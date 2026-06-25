/* Paper lesson — "Axiomatic Attribution for Deep Networks" (Integrated Gradients),
   Sundararajan, Taly, Yan, ICML 2017. Self-contained: lesson + CODE + CODEVIZ
   merged by id "paper-integrated-gradients".
   GROUNDED from arXiv:1703.01365 (abstract) and the ar5iv HTML mirror
   (Section 2.1 Sensitivity axiom; Section 2.2 Implementation Invariance axiom;
   Section 3 Eqn. 1 the IG integral and Proposition 1 = Completeness; Section 5
   Eqn. 3 the Riemann-sum approximation, "20 to 300 steps ... within 5%").
   Track B (architecture): compose a tiny multi-layer perceptron with torch.nn, then
   implement the NOVEL part by hand — Integrated Gradients via a Riemann sum of
   gradients along the straight path from a baseline to the input — and verify the
   COMPLETENESS axiom numerically, contrasting it with plain input-gradients. */
(function () {
  window.LESSONS.push({
    id: "paper-integrated-gradients",
    title: "Integrated Gradients — Axiomatic Attribution for Deep Networks (2017)",
    tagline: "Attribute a prediction to its inputs by integrating gradients along a straight path from a baseline to the input.",
    module: "Papers · Meta-learning, Bayesian & Robustness",
    track: "architecture",
    paper: {
      authors: "Mukund Sundararajan, Ankur Taly, Qiqi Yan",
      org: "Google",
      year: 2017,
      venue: "arXiv:1703.01365 (Mar 2017); ICML 2017",
      citations: "",
      arxiv: "https://arxiv.org/abs/1703.01365",
      code: "https://github.com/ankurtaly/Integrated-Gradients"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["pt-autograd", "pt-nn-module", "dl-backprop", "ml-gradient-descent", "fnd-chain"],

    // WHY READ IT
    problem:
      `<p>You have a trained deep network. It makes a prediction. <b>Which input features caused it?</b> This is
       the <b>attribution</b> problem: split the prediction into one number per input, a credit assignment. It is
       how we debug models, extract rules, and build trust.</p>
       <p>The obvious tool is the <b>gradient</b> &mdash; the partial derivative of the output with respect to each
       input feature (how much the output moves when you nudge that feature). But a raw gradient measures a
       <i>local</i> slope. Deep networks are full of flat spots. The paper's example: a feature can be fully
       "used up" by the network so the output has <b>saturated</b> &mdash; the function is flat there &mdash; and
       its gradient is zero even though that feature clearly mattered. From the paper:</p>
       <blockquote>"We identify two fundamental axioms&mdash;Sensitivity and Implementation Invariance that
       attribution methods ought to satisfy. We show that they are not satisfied by most known attribution
       methods, which we consider to be a fundamental weakness of those methods." (Abstract)</blockquote>
       <p>The open question: is there an attribution method that provably satisfies sensible rules, yet needs no
       change to the network and "just needs a few calls to the standard gradient operator" (Abstract)?</p>`,
    contribution:
      `<ul>
        <li><b>Two axioms attributions should obey.</b> <b>Sensitivity</b> (&sect;2.1): if the input and the
        baseline differ in one feature and the network gives them different predictions, that feature must get a
        non-zero attribution. <b>Implementation Invariance</b> (&sect;2.2): two networks that compute the same
        function must get identical attributions. The paper shows plain gradients and many popular methods break
        at least one.</li>
        <li><b>Integrated Gradients (IG = Integrated Gradients), a method that satisfies them.</b> Walk along the
        straight line from a chosen <b>baseline</b> input (often all-zeros) to the real input; accumulate the
        gradient at every point along the way; multiply by how far each feature travelled. No retraining, no new
        layers &mdash; just repeated gradient calls.</li>
        <li><b>The Completeness guarantee.</b> The attributions provably <b>add up</b> to the gap between the
        network's output at the input and at the baseline (&sect;3, Proposition 1). Nothing is double-counted or
        lost. Plain input-gradients have no such guarantee.</li>
      </ul>`,
    whyItMattered:
      `<p>Integrated Gradients became one of the standard ways to explain neural-network predictions, shipped in
       libraries like Captum and used across vision, text, and tabular models. Its <i>axiomatic</i> framing
       &mdash; "decide the rules first, then derive the method that satisfies them" &mdash; reshaped how the field
       judges explanation methods: not by whether a heat-map "looks right," but by which properties it provably
       holds.</p>
       <p>It sits alongside <b>SHapley Additive exPlanations (SHAP)</b> &mdash; covered in the
       <code>paper-shap</code> lesson &mdash; as the other major <b>axiomatic</b> attribution method. Both demand
       that per-feature credits sum to the prediction gap (an additivity / completeness property); IG reaches it
       by integrating gradients along a path, SHAP by averaging marginal contributions over feature orderings
       (Shapley values from cooperative game theory). Reading them together shows two routes to the same
       guarantee.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2 (Two Fundamental Axioms)</b> &mdash; &sect;2.1 defines <b>Sensitivity(a)</b>, &sect;2.2
        defines <b>Implementation Invariance</b>. This is the "rules first" setup; the rest of the paper is
        engineered to satisfy them.</li>
        <li><b>&sect;3 (Our Method: Integrated Gradients)</b> &mdash; the definition you transcribe and implement:
        the integral in <b>Equation 1</b>, and <b>Proposition 1</b> (Completeness), the guarantee that the
        attributions sum to $F(x) - F(x')$.</li>
        <li><b>&sect;5 (Computing Integrated Gradients)</b> &mdash; the practical <b>Riemann-sum approximation</b>,
        <b>Equation 3</b>, and the note that "20 to 300 steps are enough to approximate the integral (within
        5%)." This is the actual code.</li>
       </ul>
       <p><b>Skim:</b> the image, text, and chemistry case studies (later sections) unless you want those domains;
       and the uniqueness argument (the path-integral / Aumann-Shapley theory) &mdash; the take-away is just that
       the straight-line path is the canonical choice. Read the one paragraph on <b>choosing a baseline</b>: a
       black image, an all-zero embedding, an empty string &mdash; an input that means "absence of signal."</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>Take a tiny model $F(x_1, x_2) = x_1 \\cdot x_2$ (the output is the product of two inputs). Evaluate it
       at the input $x = (1, 2)$ with baseline $x' = (0, 0)$, so $F(x) = 2$ and $F(x') = 0$ &mdash; a gap of
       $2$. <b>Plain</b> attribution multiplies each input by the gradient there: the gradient of $x_1 x_2$ is
       $(x_2, x_1) = (2, 1)$, so plain credits are $(2 \\cdot 1,\\; 1 \\cdot 2) = (2, 2)$, which sum to
       <b>4</b>.</p>
       <p>But the prediction only moved by $2$ from the baseline. The plain credits sum to $4$, double the gap.
       Before running: will <b>Integrated Gradients</b> credits sum to exactly $2$ (the gap), or also overshoot?
       Write your guess and one sentence of why.</p>`,
    attempt:
      `<p>Before the reveal, sketch the Integrated Gradients computation you will build. Fill in the
       <code>TODO</code>s:</p>
       <ul>
        <li>Choose a <b>baseline</b> $x'$ (use all-zeros). You will walk the straight line from $x'$ to the input
        $x$.</li>
        <li>Pick $m$ steps (use $m = 50$). For each step $k = 1 \\ldots m$, set
        $\\alpha = k / m$ and form the interpolated point $x' + \\alpha\\,(x - x')$.</li>
        <li>TODO &mdash; at each interpolated point, compute the gradient of the output with respect to the
        <i>inputs</i>: <code>g = torch.autograd.grad(F(xi), xi)</code>. Accumulate these gradients.</li>
        <li>TODO &mdash; turn the accumulated gradient into the attribution: multiply the <b>average</b> gradient
        by $(x - x')$ (the distance each feature travelled). This is Equation 3.</li>
        <li>TODO &mdash; the check: does $\\sum_i \\text{IG}_i$ equal $F(x) - F(x')$? (Completeness.)</li>
       </ul>
       <p>Then compute plain <code>grad(F(x), x) * (x - x')</code> at the input only, and compare its sum to the
       same gap. Predict which one matches.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Integrated Gradients answers "which inputs caused this prediction?" by comparing the input to a
       <b>baseline</b> &mdash; an input that means "no signal" (a black image, an all-zero feature vector). The
       attribution explains the <i>difference</i> between the prediction at the input and the prediction at the
       baseline.</p>
       <p><b>The straight path.</b> Draw the straight line from the baseline $x'$ to the input $x$. A point on it
       is $x' + \\alpha\\,(x - x')$ where $\\alpha$ (alpha) is a <b>path variable</b> that slides from $0$ (at the
       baseline) to $1$ (at the input). As $\\alpha$ grows, you "fade in" the input one notch at a time.</p>
       <p><b>Accumulate gradients along the path.</b> A plain gradient is the slope at a single point &mdash; it
       can be zero in a flat (saturated) region even for an important feature. Integrated Gradients fixes this by
       looking at the slope at <i>every</i> point on the path, not just at the input. For feature $i$ it
       <b>integrates</b> (sums up continuously) the partial derivative $\\partial F / \\partial x_i$ as $\\alpha$
       goes from $0$ to $1$ (&sect;3, Eqn. 1).</p>
       <p><b>Scale by the travel distance.</b> Multiply that integral by $(x_i - x'_i)$ &mdash; how far feature
       $i$ moved from baseline to input. A feature that did not change ($x_i = x'_i$) gets zero credit; a feature
       that moved a lot, through steep regions, gets a lot.</p>
       <p><b>Why this is the right thing: Completeness.</b> By the fundamental theorem of calculus, integrating a
       function's gradient along a path recovers the <i>total change</i> in the function over that path. So the
       per-feature credits sum to $F(x) - F(x')$ exactly (&sect;3, Proposition 1). Every bit of the prediction
       gap is accounted for &mdash; no double-counting, none lost. That is the guarantee plain input-gradients
       lack.</p>
       <p><b>In practice you cannot do a perfect integral</b>, so you approximate it with a <b>Riemann sum</b>: a
       finite average of the gradient at $m$ evenly spaced points along the path (&sect;5, Eqn. 3). The paper
       notes "20 to 300 steps are enough to approximate the integral (within 5%)."</p>`,
    architecture:
      `<p>Integrated Gradients is not a network &mdash; it is a <b>procedure wrapped around any differentiable
       model</b> $F$. The "architecture" is the per-attribution algorithm (&sect;5, Eqn. 3). It treats $F$ as a
       black box exposed through one operation: an input-gradient call $\\nabla_x F$.</p>
       <p><b>Inputs.</b> A scalar-output model $F$ (one class score or one regression value), the input $x \\in
       \\mathbb{R}^n$ to explain, a baseline $x' \\in \\mathbb{R}^n$ meaning "no signal" (all-zeros), and a step
       count $m$ (paper: $20$&ndash;$300$).</p>
       <p><b>Data flow, step by step:</b></p>
       <ol>
        <li><b>Build the path.</b> For $k = 1 \\ldots m$, set $\\alpha_k = k/m$ and form the interpolated point
        $\\tilde{x}_k = x' + \\alpha_k\\,(x - x')$ &mdash; a straight line of $m$ points from baseline to input.</li>
        <li><b>Gradient at each point.</b> Mark $\\tilde{x}_k$ as requiring grad, run a forward pass $F(\\tilde
        {x}_k)$, then a backward pass to get the input-gradient $g_k = \\nabla_x F(\\tilde{x}_k) \\in \\mathbb
        {R}^n$. One forward + one backward per step; $m$ gradient calls total.</li>
        <li><b>Average (the integral).</b> Accumulate $\\bar{g} = \\tfrac{1}{m}\\sum_{k=1}^{m} g_k$ &mdash; the
        Riemann-sum estimate of $\\int_0^1 \\nabla_x F\\, d\\alpha$.</li>
        <li><b>Scale by travel distance.</b> Element-wise multiply: $\\text{IG} = (x - x') \\odot \\bar{g} \\in
        \\mathbb{R}^n$, one attribution per input feature.</li>
        <li><b>Verify Completeness.</b> Check $\\sum_i \\text{IG}_i \\approx F(x) - F(x')$; the gap shrinks as $m$
        grows.</li>
       </ol>
       <p><b>Output.</b> An attribution vector in $\\mathbb{R}^n$, the same shape as the input, summing to the
       prediction gap. <b>Cost.</b> $m$ forward+backward passes through $F$ &mdash; no retraining, no extra layers,
       no change to the model. The whole method "just needs a few calls to the standard gradient operator."</p>`,
    symbols: [
      { sym: "$F$", desc: "the <b>network's output</b> as a function of the input &mdash; a single number (e.g. the score for one class, or one regression output)." },
      { sym: "$x$", desc: "the <b>input</b> being explained: the actual feature vector whose prediction we want to attribute." },
      { sym: "$x'$", desc: "the <b>baseline</b> (read \"x-prime\"): a reference input meaning \"absence of signal\" &mdash; often all-zeros (a black image, an empty embedding). Attribution explains $x$ <i>relative to</i> $x'$." },
      { sym: "$x_i,\\; x'_i$", desc: "the $i$-th <b>feature</b> of the input and of the baseline. $(x_i - x'_i)$ is how far feature $i$ travels along the path." },
      { sym: "$\\alpha$", desc: "the <b>path variable</b> (\"alpha\"): a scalar sliding from $0$ to $1$. The point $x' + \\alpha(x-x')$ moves from the baseline ($\\alpha=0$) to the input ($\\alpha=1$) along a straight line." },
      { sym: "$\\partial F / \\partial x_i$", desc: "the <b>partial derivative</b> of the output with respect to feature $i$: the local slope, holding the other features fixed. This is what one gradient call returns." },
      { sym: "$\\int_0^1 \\cdots\\, d\\alpha$", desc: "the <b>integral</b> over the path: continuously sum the value of what is inside as $\\alpha$ sweeps from $0$ to $1$. It measures total accumulated change along the path." },
      { sym: "$\\text{IG}_i(x)$", desc: "the <b>Integrated-Gradients attribution</b> for feature $i$: one number saying how much feature $i$ contributed to the prediction gap $F(x) - F(x')$." },
      { sym: "$m$", desc: "the <b>number of steps</b> in the Riemann sum &mdash; how many evenly spaced points along the path we sample. More steps means a closer approximation." },
      { sym: "$k$", desc: "the <b>step index</b> in the Riemann sum, running $1 \\ldots m$. At step $k$ the path variable is $\\alpha = k/m$." },
      { sym: "$n$", desc: "the <b>number of input features</b> (the dimension of $x$). The Completeness sum $\\sum_{i=1}^{n}$ runs over all $n$ features." },
      { sym: "$F_A,\\; F_B$", desc: "<b>two networks</b> with different internal implementations. If they compute the same output for every input (functionally equivalent), Implementation Invariance demands they get identical attributions." },
      { sym: "$\\nabla_x F$", desc: "the <b>input-gradient vector</b>: all $n$ partials $\\partial F/\\partial x_i$ at once. One backward pass returns it; the algorithm calls it $m$ times along the path." },
      { sym: "“Sensitivity”", desc: "the &sect;2.1 axiom: a feature that (alone) changes the prediction from the baseline must get non-zero credit. IG satisfies it because Completeness does." },
      { sym: "“Implementation Invariance”", desc: "the &sect;2.2 axiom: attributions depend only on the function $F$ computes, not on how it is wired. IG satisfies it because it uses only input-gradients." },
      { sym: "“baseline”", desc: "a plain term: the reference input the attribution is measured against. Changing it changes the explanation; pick one that means \"no information.\"" },
      { sym: "“completeness”", desc: "a plain term, the key property: the per-feature attributions <b>sum to</b> $F(x) - F(x')$. Nothing is double-counted or dropped." },
      { sym: "“saturation”", desc: "a plain term: a region where the output is <b>flat</b>, so the gradient is near zero, even though the feature is important. IG looks along the whole path, so it sees the non-flat part too." }
    ],
    formula:
      `$$ \\text{IG}_i(x) \\;=\\; (x_i - x'_i)\\,\\int_{\\alpha=0}^{1} \\frac{\\partial F\\!\\left(x' + \\alpha\\,(x - x')\\right)}{\\partial x_i}\\, d\\alpha $$
       <p>&sect;3, <b>Equation 1</b> &mdash; the definition: feature $i$'s attribution is the path integral of its partial derivative from baseline $x'$ to input $x$, scaled by the travel distance $(x_i - x'_i)$.</p>
       $$ \\text{IG}_i^{\\text{approx}}(x) \\;=\\; (x_i - x'_i)\\,\\sum_{k=1}^{m} \\frac{\\partial F\\!\\left(x' + \\tfrac{k}{m}(x - x')\\right)}{\\partial x_i}\\,\\frac{1}{m} $$
       <p>&sect;5, <b>Equation 3</b> &mdash; the Riemann-sum approximation: replace the integral by an average of the gradient at $m$ evenly spaced points $\\alpha = \\tfrac{k}{m}$ along the path. This is what the code runs.</p>
       $$ \\sum_{i=1}^{n} \\text{IG}_i(x) \\;=\\; F(x) - F(x') $$
       <p>&sect;3, <b>Proposition 1 (Completeness axiom)</b> &mdash; the per-feature attributions sum exactly to the prediction gap between input and baseline. Holds whenever $F$ is differentiable almost everywhere; nothing is double-counted or dropped.</p>
       $$ \\big(x_i \\neq x'_i\\big)\\;\\wedge\\;\\big(F(x) \\neq F(x')\\big)\\;\\Longrightarrow\\;\\text{IG}_i(x) \\neq 0 $$
       <p>&sect;2.1, <b>Sensitivity(a) axiom</b> &mdash; if input and baseline differ in just feature $i$ and the network gives them different predictions, feature $i$ must get a non-zero attribution. Completeness implies Sensitivity. Plain gradients can violate this at saturation.</p>
       $$ F_A(z) = F_B(z)\\;\\;\\forall z \\;\\Longrightarrow\\; \\text{IG}^{A}(x) = \\text{IG}^{B}(x) $$
       <p>&sect;2.2, <b>Implementation Invariance axiom</b> &mdash; two networks $F_A, F_B$ that compute the same function for every input get identical attributions. IG depends only on $F$'s input-gradients, so it is invariant by construction (&sect;2.2 / Theorem 1); methods using internal node values are not.</p>
       $$ \\text{IG is the } \\textbf{unique} \\text{ path method that is symmetry-preserving} \\quad (\\text{Aumann-Shapley}) $$
       <p>&sect;4, <b>Theorem 1</b> &mdash; among all path-integral attribution methods, the straight-line path is the only one that treats symmetric features identically; it is the Aumann-Shapley cost-sharing solution from economics.</p>`,
    whatItDoes:
      `<p><b>The integral form</b> (left, &sect;3, Equation 1) is the definition. Read it right-to-left: walk the
       path from $x'$ to $x$; at each point take the slope of the output along feature $i$; average those slopes
       over the whole path (that is the integral); then scale by how far feature $i$ moved, $(x_i - x'_i)$. The
       result is feature $i$'s share of the prediction.</p>
       <p><b>The Riemann-sum form</b> (right, &sect;5, Equation 3) is the implementation. The integral becomes a
       finite average: sample $m$ points along the path at $\\alpha = \\tfrac{1}{m}, \\tfrac{2}{m}, \\ldots, 1$,
       evaluate the gradient at each, average them (the $\\tfrac{1}{m}$), and scale by $(x_i - x'_i)$. As $m$
       grows this approaches the true integral.</p>
       <p>The headline consequence is <b>Completeness</b> (&sect;3, Proposition 1): summing $\\text{IG}_i$ over all
       features $i$ gives exactly $F(x) - F(x')$. The attributions are a faithful decomposition of the prediction
       gap &mdash; the property plain input-gradients fail.</p>`,
    derivation:
      `<p><b>Why Completeness holds.</b> Define a one-variable function $g(\\alpha) = F\\!\\left(x' + \\alpha(x -
       x')\\right)$ &mdash; the network's output as you slide along the path. At $\\alpha = 0$ it is $F(x')$; at
       $\\alpha = 1$ it is $F(x)$. The <b>fundamental theorem of calculus</b> (a function's total change equals
       the integral of its derivative) says:</p>
       <p>$$ F(x) - F(x') \\;=\\; g(1) - g(0) \\;=\\; \\int_0^1 \\frac{dg}{d\\alpha}\\, d\\alpha. $$</p>
       <p>Now expand $\\dfrac{dg}{d\\alpha}$ with the <b>chain rule</b> (recapped from the <code>fnd-chain</code>
       lesson). The path point has $i$-th coordinate $x'_i + \\alpha(x_i - x'_i)$, whose derivative with respect
       to $\\alpha$ is $(x_i - x'_i)$. So:</p>
       <p>$$ \\frac{dg}{d\\alpha} \\;=\\; \\sum_i \\frac{\\partial F}{\\partial x_i}\\Big(x' + \\alpha(x-x')\\Big)
       \\cdot (x_i - x'_i). $$</p>
       <p>Substitute this back and swap the finite sum with the integral:</p>
       <p>$$ F(x) - F(x') \\;=\\; \\sum_i (x_i - x'_i)\\int_0^1 \\frac{\\partial F\\!\\left(x' + \\alpha(x-x')
       \\right)}{\\partial x_i}\\, d\\alpha \\;=\\; \\sum_i \\text{IG}_i(x). $$</p>
       <p>The right side is exactly the sum of Integrated-Gradients attributions (Equation 1). So they sum to the
       prediction gap &mdash; Completeness (Proposition 1), proved straight from calculus. <b>Plain
       input-gradients</b> $\\dfrac{\\partial F}{\\partial x_i}(x)\\cdot(x_i - x'_i)$ use the slope <i>only at the
       input</i> $x$, not averaged along the path, so the fundamental-theorem cancellation does not happen and the
       sum can miss the gap &mdash; as the worked example shows.</p>`,
    example:
      `<p>Work the product model by hand &mdash; it has a clean closed form, so you can check every number.
       Model $F(x_1, x_2) = x_1 \\cdot x_2$ (output is the product of two inputs). Input $x = (1, 2)$, baseline
       $x' = (0, 0)$.</p>
       <ul class="steps">
        <li><b>The path.</b> $x' + \\alpha(x - x') = (\\alpha\\cdot 1,\\; \\alpha\\cdot 2) = (\\alpha, 2\\alpha)$,
        as $\\alpha$ goes $0 \\to 1$.</li>
        <li><b>Gradients along the path.</b> For $F = x_1 x_2$: $\\dfrac{\\partial F}{\\partial x_1} = x_2 =
        2\\alpha$, and $\\dfrac{\\partial F}{\\partial x_2} = x_1 = \\alpha$ (plugging in the path coordinates).</li>
        <li><b>Integrate, then scale (Eqn. 1).</b> Feature $1$: $(x_1 - x'_1)\\int_0^1 2\\alpha\\, d\\alpha =
        1 \\cdot \\big[\\alpha^2\\big]_0^1 = 1 \\cdot 1 = 1$. Feature $2$: $(x_2 - x'_2)\\int_0^1 \\alpha\\,
        d\\alpha = 2 \\cdot \\tfrac{1}{2} = 1$. So $\\text{IG} = (1, 1)$.</li>
        <li><b>Completeness check.</b> $\\text{IG}_1 + \\text{IG}_2 = 1 + 1 = 2$, and $F(x) - F(x') = 1\\cdot 2 -
        0 = 2$. They match exactly &mdash; Completeness holds.</li>
        <li><b>Contrast with plain gradients.</b> The gradient at the input $x = (1,2)$ is $(x_2, x_1) = (2, 1)$;
        plain attribution $(2, 1)\\cdot(x - x') = (2\\cdot 1,\\; 1\\cdot 2) = (2, 2)$, which sums to $4 \\ne 2$.
        Plain gradients <b>double-count</b> the interaction; Integrated Gradients splits it evenly and sums to the
        gap.</li>
       </ul>
       <p>The notebook's first cell recomputes this with a $50$-step Riemann sum. A right-endpoint sum on an
       increasing integrand slightly overshoots, giving $\\text{IG} \\approx (1.02, 1.02)$, sum $\\approx 2.04$;
       it tightens toward the exact $(1, 1)$ as the step count grows (sum $\\to 2$). You will see that
       convergence printed.</p>`,
    recipe:
      `<ol>
        <li><b>Build / pick the model</b> $F$. In the notebook we compose a tiny multi-layer perceptron with
        <code>torch.nn</code> ($4 \\to 8 \\to 1$, ReLU) and also use the closed-form $x_1 x_2$ for the
        hand-check.</li>
        <li><b>Choose a baseline</b> $x'$ (all-zeros) and the input $x$ to explain.</li>
        <li><b>Make the path.</b> For $k = 1 \\ldots m$ ($m = 50$) set $\\alpha = k/m$ and form the interpolated
        point $x' + \\alpha(x - x')$.</li>
        <li><b>Accumulate gradients (by hand).</b> At each interpolated point, mark it
        <code>requires_grad_(True)</code>, run $F$, and take
        <code>torch.autograd.grad(F(xi), xi)</code>; add the gradient into a running total.</li>
        <li><b>Form the attribution (Eqn. 3):</b> $\\text{IG} = (x - x') \\cdot (\\text{total gradient} / m)$.</li>
        <li><b>Verify Completeness:</b> check $\\sum_i \\text{IG}_i \\approx F(x) - F(x')$. <b>Ablate / contrast:</b>
        compute plain <code>grad(F(x), x) * (x - x')</code> at the input only and show its sum misses the gap.</li>
      </ol>`,
    results:
      `<p>The paper validates Integrated Gradients qualitatively across domains. From the abstract (quoted), it
       applies the method "to a couple of image models, a couple of text models and a chemistry model,
       demonstrating its ability to debug networks, to extract rules from a network, and to enable users to engage
       with models better."</p>
       <p>On computation (&sect;5, quoted): "20 to 300 steps are enough to approximate the integral (within 5%)."
       The theoretical headline is <b>Proposition 1 (Completeness)</b>: the attributions sum to $F(x) - F(x')$,
       proved exactly.</p>
       <p><i>These are the paper's own statements, quoted from the abstract and &sect;5. The numbers in the CODE
       and CODEVIZ panels below are from our own tiny run &mdash; not the paper's reported results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper. The model and autograd already ship in PyTorch, so you
       <b>import</b> them and build only the novel method. <b>Import:</b> <code>nn.Linear</code>,
       <code>nn.ReLU</code> for the multi-layer perceptron, and <code>torch.autograd.grad</code> for the gradient
       calls. <b>Build by hand:</b> the <b>Integrated Gradients</b> loop &mdash; interpolate $m$ points along the
       straight path from baseline $x'$ to input $x$, take the input-gradient at each, average them, and scale by
       $(x - x')$ (Eqn. 3). The novel part is this <i>path integral of gradients</i>; PyTorch will not do it for
       you. We then verify <b>Completeness</b> (sum equals $F(x) - F(x')$) and contrast against plain
       input-gradients. The chain rule used in the derivation is recapped from the <code>fnd-chain</code> lesson,
       not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Differentiating with respect to the wrong thing.</b> Integrated Gradients needs the gradient of
        the output with respect to the <b>inputs</b>, not the weights. The interpolated point must
        <code>require_grad</code>, and you call <code>autograd.grad(F(xi), xi)</code> &mdash; not the usual
        loss-with-respect-to-parameters backward. <b>Fix:</b> mark the interpolated input as requiring grad each
        step.</li>
        <li><b>Forgetting to scale by $(x - x')$.</b> The averaged path gradient is only half the formula;
        Equation 1/3 multiplies it by the travel distance $(x_i - x'_i)$. Skip this and Completeness fails and a
        feature equal to its baseline wrongly gets credit. <b>Fix:</b> always end with
        <code>(x - x') * avg_grad</code>.</li>
        <li><b>Too few steps.</b> A small $m$ (the Riemann step count) leaves a visible gap between
        $\\sum_i \\text{IG}_i$ and $F(x) - F(x')$, especially on curvy models. The paper uses $20$ to $300$.
        <b>Fix:</b> raise $m$ until the completeness gap is small; for smooth models the right-endpoint sum
        overshoots, so the gap shrinks as $m$ grows.</li>
        <li><b>Picking a careless baseline.</b> The attribution is always <i>relative to</i> $x'$. A baseline
        that is not "absence of signal" (e.g. a random image instead of black) produces explanations that are
        technically valid but hard to read. <b>Fix:</b> use an input that means "no information" for your domain
        (all-zeros, black, empty string).</li>
        <li><b>Confusing Integrated Gradients with plain gradient times input.</b> Plain
        <code>grad(F(x), x) * x</code> uses the slope only at the input and has <b>no</b> completeness guarantee.
        Integrated Gradients averages the slope along the whole path. They agree only when $F$ is linear.</li>
      </ul>`,
    recall: [
      "Write the Integrated-Gradients integral (Eqn. 1) and its Riemann-sum approximation (Eqn. 3) from memory.",
      "State the Completeness property: what does $\\sum_i \\text{IG}_i(x)$ equal, and why (one sentence of calculus)?",
      "Define the baseline $x'$ and the path variable $\\alpha$, and say what $\\alpha = 0$ and $\\alpha = 1$ correspond to.",
      "Why can a plain input-gradient be zero for an important feature, and how does integrating along the path fix it?"
    ],
    practice: [
      {
        q: `<b>The completeness ablation.</b> You have a working Integrated-Gradients implementation that sums
            (almost) to $F(x) - F(x')$. Replace it with <b>plain</b> <code>grad(F(x), x) * (x - x')</code>
            evaluated only at the input. On the product model $F = x_1 x_2$ with $x = (1,2)$, $x' = (0,0)$, what
            does each method's attribution sum to, and which property did you just break?`,
        steps: [
          { do: `Integrated Gradients: $\\text{IG} = (1, 1)$, sum $= 2$.`, why: `From the worked example: integrating $\\partial F/\\partial x_1 = 2\\alpha$ and $\\partial F/\\partial x_2 = \\alpha$ along the path, scaled by $(x - x')$, gives $(1, 1)$.` },
          { do: `Plain grad times travel: gradient at $x=(1,2)$ is $(x_2, x_1) = (2, 1)$; times $(x - x') = (1, 2)$ gives $(2, 2)$, sum $= 4$.`, why: `Plain uses the slope only at the input, ignoring how the slope changes along the path, so the interaction is double-counted.` },
          { do: `Compare to the gap $F(x) - F(x') = 2 - 0 = 2$.`, why: `Integrated Gradients matches it ($2 = 2$); plain overshoots ($4 \\ne 2$) &mdash; Completeness is broken.` }
        ],
        answer: `<p>Integrated Gradients sums to $\\mathbf{2}$, exactly the prediction gap $F(x) - F(x') = 2$ &mdash;
                 <b>Completeness holds</b>. Plain <code>grad * (x - x')</code> sums to $\\mathbf{4}$, double the
                 gap &mdash; <b>Completeness broken</b>. The product model is nonlinear (an interaction), so the
                 slope at the input alone over-credits both features; averaging the slope along the whole path
                 splits the $2$ evenly into $(1, 1)$.</p>`
      },
      {
        q: `Why can a <b>plain gradient</b> assign <i>zero</i> attribution to a feature that clearly mattered,
            and how does the path integral rescue it? Reason with a saturating model.`,
        steps: [
          { do: `Picture a model whose output rises with a feature but then <b>saturates</b> (flattens) once the feature is large &mdash; the gradient there is $\\approx 0$.`, why: `A plain gradient reads the local slope; in the flat region that slope is near zero even though moving the feature from baseline to here changed the output a lot.` },
          { do: `Now walk from baseline $x'$ to input $x$: early on the path the output is still rising, so the gradient is large; only near the input is it flat.`, why: `Integrated Gradients averages the gradient over the <i>whole</i> path, so it captures the steep early part the input-only gradient missed.` },
          { do: `By Completeness the credits still sum to $F(x) - F(x')$, so the important feature gets its due share.`, why: `The fundamental theorem of calculus guarantees the path integral recovers the full output change.` }
        ],
        answer: `<p>A plain gradient measures the slope <b>only at the input</b>. If the model has saturated there
                 &mdash; gone flat &mdash; that slope is near zero, so the feature looks unimportant even though it
                 drove the prediction up from the baseline. Integrated Gradients integrates the gradient along the
                 <i>whole</i> path from baseline to input, so it sees the steep, non-saturated stretch the input
                 gradient missed. Completeness then forces the credits to sum to the true gap, so the feature gets
                 a non-zero, faithful attribution (this is exactly the Sensitivity axiom, &sect;2.1).</p>`
      },
      {
        q: `In the worked example a $50$-step Riemann sum gave $\\sum_i \\text{IG}_i \\approx 2.04$, not the exact
            $2.0$. Is the method wrong? What single knob shrinks the gap, and which direction?`,
        steps: [
          { do: `Identify the cause: Equation 3 is a finite <b>right-endpoint</b> Riemann sum sampling $\\alpha = k/m$. On the increasing integrand it slightly over-estimates.`, why: `A right-endpoint sum on a rising function sits above the true area; the overshoot is an approximation artifact, not a flaw in the method.` },
          { do: `Raise $m$ (the step count): at $m = 5$ the sum is $2.40$, at $m = 50$ it is $2.04$, at $m = 300$ it is $\\approx 2.007$.`, why: `More, finer steps make the Riemann sum approach the exact integral, so the completeness gap shrinks toward zero.` },
          { do: `Recall the paper's guidance: "20 to 300 steps are enough ... (within 5%)" (&sect;5).`, why: `It quantifies the trade-off: a few hundred steps gets you within a few percent for typical models.` }
        ],
        answer: `<p>The method is correct; the $0.04$ is pure <b>discretization error</b> from the finite
                 Riemann sum (right-endpoint, on an increasing integrand, so it overshoots). The single knob is
                 the <b>step count $m$</b> &mdash; increase it. Our run: $m = 5 \\to 2.40$, $m = 50 \\to 2.04$,
                 $m = 300 \\to 2.007$; the gap shrinks toward zero. The true integral satisfies Completeness
                 exactly; the paper notes $20$ to $300$ steps land within $5\\%$ (&sect;5). Our small run, not the
                 paper's number.</p>`
      }
    ]
  });

  window.CODE["paper-integrated-gradients"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>compose</b> a tiny multi-layer perceptron with <code>nn.Linear</code> / <code>nn.ReLU</code>,
       then build the <b>novel</b> part by hand &mdash; <b>Integrated Gradients</b>. The
       <code>integrated_gradients</code> function walks the straight path from the baseline $x'$ to the input $x$
       in $m = 50$ steps, takes the input-gradient with <code>torch.autograd.grad</code> at each, averages them,
       and scales by $(x - x')$ (Eqn. 3). Cell&nbsp;1 recomputes the worked example $F = x_1 x_2$,
       $x=(1,2)$, $x'=(0,0)$: Integrated Gradients $\\approx (1.02, 1.02)$ summing to $\\approx 2.04$ (the exact
       integral is $(1,1)$, sum $2$), versus plain grad&times;input $(2,2)$ summing to $4$. Cell&nbsp;2 builds the
       multi-layer perceptron and verifies <b>Completeness</b> on it: the Integrated-Gradients sum matches
       $F(x) - F(x')$ to about $1\\mathrm{e}{-5}$, while plain grad&times;input misses by $\\sim 0.025$. CPU,
       a few hundred fast gradient calls. Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn
import numpy as np
torch.manual_seed(0); np.random.seed(0)

# === The novel method, built by hand: Integrated Gradients (paper Eqn. 3). ===
def integrated_gradients(F, x, baseline, steps=50):
    """Riemann sum of input-gradients along the straight path baseline -> x."""
    total = torch.zeros_like(x)
    for k in range(1, steps + 1):            # alpha = k/steps, sweeps (0, 1]
        alpha = k / steps
        xi = (baseline + alpha * (x - baseline)).clone().requires_grad_(True)
        g, = torch.autograd.grad(F(xi), xi)  # dF/dx at this path point
        total += g
    return (x - baseline) * total / steps    # scale by travel distance (x - x')

# --- Cell 1. Worked example: F(x1,x2) = x1*x2, x=(1,2), baseline=(0,0). ---
xp = torch.tensor([0.0, 0.0]); x = torch.tensor([1.0, 2.0])
def Fmul(z): return z[..., 0] * z[..., 1]
ig = integrated_gradients(Fmul, x, xp, steps=50)
print("worked example  F(x1,x2)=x1*x2,  x=(1,2),  baseline=(0,0)")
print("  IG (50 steps) =", [round(v, 4) for v in ig.tolist()], " sum =", round(ig.sum().item(), 4))
print("  F(x)-F(xp)    =", round((Fmul(x) - Fmul(xp)).item(), 4), " <- completeness target")
xg = x.clone().requires_grad_(True); g, = torch.autograd.grad(Fmul(xg), xg)
plain = g * (x - xp)
print("  plain grad*input =", [round(v, 4) for v in plain.tolist()], " sum =", round(plain.sum().item(), 4),
      " <- overshoots the gap (no completeness)")
# IG (50 steps) = [1.02, 1.02]  sum = 2.04   (exact integral is (1,1), sum 2.0)
# F(x)-F(xp)    = 2.0
# plain grad*input = [2.0, 2.0]  sum = 4.0

# --- Cell 2. A tiny torch.nn model; verify COMPLETENESS on it. ---
torch.manual_seed(1)
net = nn.Sequential(nn.Linear(4, 8), nn.ReLU(), nn.Linear(8, 1))
def Fnet(z): return net(z).squeeze(-1)        # scalar output to attribute
xb  = torch.tensor([0.7, -1.2, 0.3, 2.0])     # input to explain
xpb = torch.zeros(4)                          # baseline x' = zeros

ig_net = integrated_gradients(Fnet, xb, xpb, steps=50)
sum_ig = ig_net.sum().item()
delta  = (Fnet(xb) - Fnet(xpb)).item()
print("\\nmulti-layer perceptron (4->8->1, ReLU)")
print("  IG per feature =", [round(v, 4) for v in ig_net.tolist()])
print("  sum IG         = %.5f" % sum_ig)
print("  F(x) - F(xp)   = %.5f" % delta)
print("  COMPLETENESS gap = %.6f  (~0: attributions sum to the prediction gap)" % (sum_ig - delta))

xgb = xb.clone().requires_grad_(True); gb, = torch.autograd.grad(Fnet(xgb), xgb)
plain_sum = (gb * (xb - xpb)).sum().item()
print("  plain grad*input sum = %.5f   gap vs F(x)-F(xp) = %.5f  (no completeness)" %
      (plain_sum, plain_sum - delta))
# IG per feature = [0.0685, 0.0907, -0.0506, 0.0186]
# sum IG         = 0.12723
# F(x) - F(xp)   = 0.12721
# COMPLETENESS gap = 0.000027        <- Integrated Gradients sums to the gap
# plain grad*input sum = 0.15238   gap vs F(x)-F(xp) = 0.02517   <- plain misses it
# (Our small run, not the paper's reported numbers. Values vary by seed/hardware.)`
  };

  window.CODEVIZ["paper-integrated-gradients"] = {
    question: "As we take more Riemann steps, does the Integrated-Gradients sum converge to the prediction gap F(x) - F(x') — and does plain grad*input ever get there?",
    charts: [
      {
        type: "line",
        title: "Distance from completeness: |sum of attributions − (F(x) − F(x'))| vs Riemann steps",
        xlabel: "number of Riemann steps m (more steps = finer path integral)",
        ylabel: "absolute completeness gap (lower is better; 0 = perfect)",
        series: [
          {
            name: "Integrated Gradients (sum IG)",
            color: "#7ee787",
            points: [[5,0.00131],[10,0.00120],[20,0.00120],[50,0.00003],[100,0.00003]]
          },
          {
            name: "plain grad × input (no path)",
            color: "#ff7b72",
            points: [[5,0.02517],[10,0.02517],[20,0.02517],[50,0.02517],[100,0.02517]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A tiny multi-layer perceptron (4&rarr;8&rarr;1, ReLU) with baseline x' = zeros and a fixed input. We plot the absolute completeness gap |&Sigma;<sub>i</sub> attribution<sub>i</sub> &minus; (F(x) &minus; F(x'))|. Integrated Gradients (green) drives the gap toward zero as the Riemann-step count m grows &mdash; by 50 steps it is ~3e-5 (the ReLU net is piecewise-linear, so the sum is nearly exact). Plain grad&times;input (red) is a flat ~0.025: it uses the slope only at the input, takes no path, so adding steps cannot help &mdash; it has no completeness guarantee. This reproduces the paper's qualitative point (&sect;3, Proposition 1): IG attributions add up to the prediction gap; plain gradients do not.",
    code: `import torch, torch.nn as nn, numpy as np
torch.manual_seed(1); np.random.seed(0)

# tiny multi-layer perceptron; scalar output to attribute
net = nn.Sequential(nn.Linear(4, 8), nn.ReLU(), nn.Linear(8, 1))
def Fnet(z): return net(z).squeeze(-1)
xb = torch.tensor([0.7, -1.2, 0.3, 2.0]); xpb = torch.zeros(4)
delta = (Fnet(xb) - Fnet(xpb)).item()                 # the gap to match

def ig_sum(steps):
    tot = torch.zeros(4)
    for k in range(1, steps + 1):
        a = k / steps
        xi = (xpb + a * (xb - xpb)).clone().requires_grad_(True)
        g, = torch.autograd.grad(Fnet(xi), xi); tot += g
    return ((xb - xpb) * tot / steps).sum().item()

# plain grad*input sum (no path -> constant in steps)
xg = xb.clone().requires_grad_(True); g, = torch.autograd.grad(Fnet(xg), xg)
plain = (g * (xb - xpb)).sum().item()

steps = [5, 10, 20, 50, 100]
ig_gap    = [round(abs(ig_sum(s) - delta), 5) for s in steps]
plain_gap = [round(abs(plain - delta), 5) for _ in steps]
print("steps          :", steps)
print("IG    |gap|    :", ig_gap)
print("plain |gap|    :", plain_gap)
# steps          : [5, 10, 20, 50, 100]
# IG    |gap|    : [0.00131, 0.0012, 0.0012, 3e-05, 3e-05]
# plain |gap|    : [0.02517, 0.02517, 0.02517, 0.02517, 0.02517]
# IG -> 0 as steps grow; plain stays flat. Our small run, not the paper's number.`
  };
})();
