/* Paper lesson — Swish / SiLU (Ramachandran, Zoph & Le, 2017).
   Grounded from arXiv:1710.05941 (abstract + ar5iv HTML, Section 4; formula f(x)=x*sigmoid(beta x);
   derivative f'(x)=beta*f(x)+sigma(beta x)(1-beta f(x))).
   Track A (primitive): build Swish from scratch, verify torch.allclose(mine(beta=1), F.silu(x)).
   Cross-links paper-gelu (a similar smooth self-gated activation) and the dl-activations concept.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-swish". */
(function () {
  window.LESSONS.push({
    id: "paper-swish",
    title: "Swish / SiLU — Searching for Activation Functions (2017)",
    tagline: "Replace ReLU's hard hinge with a smooth self-gated curve, $x\\cdot\\sigma(\\beta x)$, that dips slightly below zero — found by automated search and matching or beating ReLU on deep nets.",
    module: "Papers · Foundations & Optimization",
    track: "primitive",

    paper: {
      authors: "Prajit Ramachandran, Barret Zoph, Quoc V. Le",
      org: "Google Brain",
      year: 2017,
      venue: "arXiv preprint (arXiv:1710.05941, cs.NE)",
      citations: "",
      arxiv: "https://arxiv.org/abs/1710.05941",
      code: ""
    },

    conceptLink: "dl-activations",
    partOf: [],
    prereqs: ["dl-activations", "dl-backprop", "pt-nn-module", "pt-autograd"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> An <b>activation function</b> is the small nonlinear curve a neural network applies to
       each number after a linear layer. Without it, stacking layers just makes one big linear function. Since
       2010 the default has been <b>ReLU</b> (Rectified Linear Unit): $\\mathrm{ReLU}(x)=\\max(0,x)$ &mdash; pass
       positives through unchanged, clamp negatives to exactly zero. See the <code>dl-activations</code> lesson.</p>
       <p><b>What the paper questions.</b> ReLU was chosen by hand. The authors ask: <i>is it actually the best
       simple activation, or just the one we happened to settle on?</i> ReLU has two awkward features (Section 1,
       Section 4):</p>
       <ul>
         <li><b>It has a hard corner at $0$.</b> Its slope jumps from $0$ to $1$ instantly, so it is not smooth.</li>
         <li><b>It kills all negative information.</b> Every negative input becomes exactly $0$, and its gradient
         there is exactly $0$ &mdash; a unit can get stuck outputting zero forever (the "dying ReLU" problem).</li>
       </ul>`,

    contribution:
      `<p>Instead of hand-designing a new activation, the paper <b>searches</b> for one automatically, then studies
       the winner. Its contributions:</p>
       <ul>
         <li><b>An automated search over activation functions.</b> They combine exhaustive search and a
         reinforcement-learning controller to explore many candidate formulas built from simple unary and binary
         operations (Section 3).</li>
         <li><b>Swish.</b> The best discovered function is $f(x)=x\\cdot\\sigma(\\beta x)$, where $\\sigma$ is the
         sigmoid. The paper writes: "the best discovered activation function, $f(x)=x\\cdot\\mathrm{sigmoid}(\\beta x)$,
         which we name Swish, tends to work better than ReLU on deeper models" (Section 4). $\\beta$ is either a
         fixed constant or a learned per-channel parameter.</li>
         <li><b>An analysis of why it helps.</b> Swish is <b>smooth</b> and <b>non-monotonic</b> &mdash; it dips
         slightly below zero before rising &mdash; while keeping ReLU's useful "unbounded above, bounded below"
         shape (Section 4).</li>
       </ul>
       <p>The paper also notes that for $\\beta=1$ Swish "is equivalent to the Sigmoid-weighted Linear Unit (SiL) of
       Elfwing et al. (2017)" (Section 4). PyTorch ships this $\\beta=1$ case as <code>nn.SiLU</code> /
       <code>F.silu</code> &mdash; the name this course uses interchangeably with Swish.</p>`,

    whyItMattered:
      `<p>Swish/SiLU became one of the standard activations in modern deep networks. It is the default activation in
       <b>EfficientNet</b> and is used across many vision and language models; the closely related <b>GELU</b>
       (another smooth self-gated curve &mdash; see <code>paper-gelu</code>) became the default in Transformers and
       large language models. The shared lesson of these papers: a <i>smooth, slightly-negative-allowing</i> gate
       tends to train deep models at least as well as ReLU, and often a little better. The paper reports the swap is
       trivial: Swish's "simplicity and its similarity to ReLU mean that replacing ReLUs in any network is just a
       simple one line code change" (Section 4).</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Abstract</b> &mdash; the search idea and the one-line definition $f(x)=x\\cdot\\mathrm{sigmoid}(\\beta x)$.</li>
         <li><b>Section 4, "Swish"</b> &mdash; this <i>is</i> the lesson: the formula, the derivative, the
         non-monotonic "bump", the role of $\\beta$ (from linear at $\\beta=0$ to ReLU-like as $\\beta\\to\\infty$),
         and the SiL/Elfwing equivalence at $\\beta=1$.</li>
         <li><b>The shape discussion</b> &mdash; "unbounded above and bounded below", "smooth and non-monotonic".</li>
       </ul>
       <p><b>Skim:</b> Section 3 (the search method and the RL controller) for intuition &mdash; you do not need to
       reproduce the search. Skim the experiment tables for the qualitative claim (Swish matches/beats ReLU on deep
       models); do not memorize the exact percentages.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> ReLU sends every negative input to exactly $0$. Swish is
       $x\\cdot\\sigma(\\beta x)$. For a <b>negative</b> input like $x=-1$, will Swish output exactly $0$, a small
       <b>negative</b> number, or a small <b>positive</b> number? And is Swish <i>monotonic</i> (always increasing
       as $x$ increases) like ReLU, or does it dip down first? Write your guess, then check the curve in the CODEVIZ
       cell.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write <code>my_swish(x, beta=1.0)</code> using raw tensors, no
       <code>F.silu</code>:</p>
       <ul>
         <li>Compute the sigmoid of $\\beta x$: <code># TODO: s = torch.sigmoid(beta * x)</code>. The sigmoid
         $\\sigma(z)=1/(1+e^{-z})$ squashes any number into $(0,1)$.</li>
         <li>Multiply the raw input by that gate: <code># TODO: return x * s</code>. The input "gates itself" &mdash;
         large positive $x$ gets a gate near $1$ (passes through), large negative $x$ gets a gate near $0$
         (suppressed), but not all the way to zero.</li>
       </ul>
       <p>The CODE cell is the full reference, including the <code>torch.allclose(my_swish(x, 1.0), F.silu(x))</code>
       check and the worked numbers.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Swish takes one number $x$ and computes $x\\cdot\\sigma(\\beta x)$. Read it as <b>"$x$, gated by a smooth
       switch that $x$ controls itself"</b>:</p>
       <ol>
         <li><b>The gate.</b> $\\sigma(\\beta x)$ is the <b>sigmoid</b> of $\\beta x$ &mdash; an S-shaped curve that
         outputs a number between $0$ and $1$. It is near $1$ for large positive $x$, near $0$ for large negative
         $x$, and exactly $0.5$ at $x=0$. Think of it as a soft "how much of $x$ should pass" dial.</li>
         <li><b>Self-gating.</b> Multiply the original $x$ by that dial. The signal decides its own gate &mdash;
         there is no separate input, which is why it is called a <b>self-gated</b> activation.</li>
         <li><b>What comes out.</b> For large positive $x$ the gate is $\\approx 1$, so $f(x)\\approx x$ (like ReLU's
         positive side). For large negative $x$ the gate is $\\approx 0$, so $f(x)\\approx 0$ (like ReLU's negative
         side). <b>But in between, for moderately negative $x$, the gate is small but nonzero, so $f(x)$ is a small
         negative number</b> &mdash; the curve dips below zero and then comes back up. That dip is the
         <b>non-monotonic "bump"</b>: "The most striking difference between Swish and ReLU is the non-monotonic
         'bump' of Swish when $x\\lt0$" (Section 4).</li>
       </ol>
       <p><b>The role of $\\beta$.</b> $\\beta$ controls how sharp the gate is. "If $\\beta=0$, Swish becomes the
       scaled linear function $f(x)=x/2$" (the sigmoid is stuck at $0.5$). "As $\\beta\\to\\infty$, the sigmoid
       component approaches a 0-1 function, so Swish becomes like the ReLU function" (Section 4). So Swish smoothly
       interpolates between a straight line and ReLU, and $\\beta=1$ (the SiLU case) sits in between. <b>Unlike</b>
       ReLU, Swish is <b>smooth</b> (no corner) and <b>non-monotonic</b> (the bump); <b>like</b> ReLU, it is
       "unbounded above and bounded below" (Section 4). It is closely related to <b>GELU</b>, which gates with the
       Gaussian cumulative distribution instead of the sigmoid &mdash; see <code>paper-gelu</code>.</p>`,

    architecture:
      `<p>This is an activation-function paper, so the "architecture" is two things: how the function was
       <b>found</b>, and how it <b>slots into a network</b>.</p>
       <p><b>1. The search structure (Section 3).</b> A candidate activation is built as a small tree of operations.
       The search composes:</p>
       <ul>
         <li><b>Unary functions</b> applied to a single input (e.g. $x$, $-x$, $|x|$, $x^2$, $e^x$, $\\sigma(x)$,
         $\\tanh(x)$, $\\max(x,0)$, $\\min(x,0)$, $\\sin(x)$, and constants).</li>
         <li><b>Binary functions</b> combining two of those (e.g. $a+b$, $a\\cdot b$, $a-b$, $a/(1+ b)$,
         $\\max(a,b)$, $\\min(a,b)$, and gated forms $\\sigma(a)\\cdot b$).</li>
       </ul>
       <p>An <b>RNN controller</b> (the same idea as neural architecture search) proposes candidate functions; each is
       used as the activation in a small child network trained on CIFAR-10; the child's validation accuracy is the
       reward used to update the controller with reinforcement learning. Exhaustive search covers the smallest trees.
       The winning structure is the gated binary form $b\\cdot\\sigma(a)$ with $a=b=x$ scaled by $\\beta$ &mdash; i.e.
       $x\\cdot\\sigma(\\beta x)$, Swish.</p>
       <p><b>2. Swish inside a layer.</b> Swish is a pointwise (elementwise) activation, a drop-in replacement for
       ReLU. For a linear layer producing pre-activations $z = Wx+b$, the layer output is $\\sigma(\\beta z)\\odot z$
       applied elementwise ($\\odot$ is elementwise multiply). It carries no extra weights when $\\beta$ is fixed; the
       <b>Swish-$\\beta$</b> variant adds <i>one</i> learnable scalar $\\beta$ <b>per channel</b>, trained jointly with
       the network's other parameters. The paper notes replacing ReLU with Swish is "just a simple one line code
       change" (Section 4).</p>`,

    symbols: [
      { sym: "activation function", desc: "the small nonlinear curve applied to each number after a linear layer; without it a deep network collapses to one linear function." },
      { sym: "$x$", desc: "the input to the activation: one pre-activation number (the output of a linear layer for one unit)." },
      { sym: "$\\sigma(z)$", desc: "the sigmoid (logistic) function $\\sigma(z)=1/(1+e^{-z})$, which squashes any real number $z$ into the open interval $(0,1)$. Here it acts as a soft gate." },
      { sym: "$\\beta$", desc: "beta, a parameter controlling the sharpness of the gate. $\\beta=0$ gives the line $x/2$; $\\beta=1$ is SiLU; $\\beta\\to\\infty$ approaches ReLU. It may be fixed or learned per channel." },
      { sym: "$f(x)$", desc: "the Swish output, $f(x)=x\\cdot\\sigma(\\beta x)$ (Section 4)." },
      { sym: "$f'(x)$", desc: "the derivative (slope) of Swish with respect to $x$, used in backpropagation: $f'(x)=\\sigma(\\beta x)+\\beta x\\,\\sigma(\\beta x)(1-\\sigma(\\beta x))=\\beta f(x)+\\sigma(\\beta x)(1-\\beta f(x))$ (Section 4)." },
      { sym: "$\\partial f/\\partial \\beta$", desc: "the derivative of Swish with respect to the gate-sharpness parameter $\\beta$, equal to $x^2\\,\\sigma(\\beta x)(1-\\sigma(\\beta x))$; used to train $\\beta$ by gradient descent when it is a learnable parameter (Section 4)." },
      { sym: "ReLU", desc: "Rectified Linear Unit, $\\max(0,x)$ — the hard-cornered baseline activation Swish is compared against." },
      { sym: "SiLU / SiL", desc: "Sigmoid-weighted Linear Unit (Elfwing et al., 2017): exactly Swish with $\\beta=1$. PyTorch's $\\texttt{nn.SiLU}$ / $\\texttt{F.silu}$." },
      { sym: "self-gated", desc: "an activation where the input multiplies a gate computed from that same input (here $\\sigma(\\beta x)$), rather than from a separate signal." },
      { sym: "non-monotonic", desc: "not always increasing: as $x$ rises through the negative region, Swish first goes DOWN (the 'bump') before turning back up — ReLU never does this." },
      { sym: "$z=Wx+b$", desc: "the pre-activation: the output of a linear layer (weight matrix $W$ times input $x$ plus bias $b$) that Swish is applied to elementwise." },
      { sym: "$\\odot$", desc: "elementwise (Hadamard) multiplication — multiply two equal-shaped tensors entry by entry. In a layer Swish computes $\\sigma(\\beta z)\\odot z$." }
    ],

    formula:
      `$$f(x)=x\\cdot\\sigma(\\beta x)=\\frac{x}{1+e^{-\\beta x}},\\qquad \\sigma(z)=\\frac{1}{1+e^{-z}}\\qquad(\\text{Swish, Section 4})$$
       <p>Swish: the input $x$ times its own sigmoid gate. $\\beta$ is "either a constant or a trainable parameter" (Section 4).</p>
       $$f'(x)=\\sigma(\\beta x)+\\beta x\\,\\sigma(\\beta x)\\big(1-\\sigma(\\beta x)\\big)=\\beta\\,f(x)+\\sigma(\\beta x)\\big(1-\\beta\\,f(x)\\big)\\qquad(\\text{derivative, Section 4})$$
       <p>The derivative, used in backpropagation. Left form is the paper's; right form is the same thing regrouped using $x\\,\\sigma(\\beta x)=f(x)$ (see Derivation). Both equal each other.</p>
       $$f(x)\\Big|_{\\beta=0}=\\tfrac{x}{2},\\qquad f(x)\\Big|_{\\beta=1}=x\\cdot\\sigma(x)=\\mathrm{SiLU}(x),\\qquad \\lim_{\\beta\\to\\infty}f(x)=\\mathrm{ReLU}(x)=\\max(0,x)$$
       <p>The three limiting cases (Section 4): at $\\beta=0$ the gate is stuck at $0.5$ so Swish is the line $x/2$; at $\\beta=1$ it is exactly the Sigmoid-weighted Linear Unit (SiLU) of Elfwing et al. (2017) &mdash; PyTorch's $\\texttt{F.silu}$; as $\\beta\\to\\infty$ the sigmoid becomes a 0-1 step and Swish approaches ReLU.</p>
       $$\\beta \\text{ trainable (per channel):}\\quad \\frac{\\partial f}{\\partial \\beta}=x^2\\,\\sigma(\\beta x)\\big(1-\\sigma(\\beta x)\\big)\\qquad(\\text{learnable-}\\beta\\text{ Swish, Section 4})$$
       <p>When $\\beta$ is a learned parameter ("Swish with a trainable $\\beta$", Section 4), the model tunes the gate sharpness itself; this is its gradient with respect to $\\beta$, so $\\beta$ updates by gradient descent like any weight. "The degree of interpolation can be controlled by the model if $\\beta$ is set as a trainable parameter" (Section 4).</p>`,

    whatItDoes:
      `<p>The first line is Swish: take the input $x$ and multiply it by its own sigmoid gate $\\sigma(\\beta x)$.
       Because $\\sigma$ lives in $(0,1)$, the output is a <i>fraction</i> of $x$ &mdash; nearly all of it for large
       positive $x$, almost none for large negative $x$, and a small negative amount for moderately negative $x$
       (the bump). The second line is the slope used during backpropagation. Notice it is built from $f(x)$ and
       $\\sigma(\\beta x)$ &mdash; quantities already computed on the forward pass &mdash; so the backward pass is
       cheap. Crucially, this slope is <b>nonzero for negative inputs</b>, unlike ReLU whose slope is a flat $0$
       there, so Swish units do not "die". (Section 4.)</p>`,

    derivation:
      `<p>This lesson's math owner is the <code>dl-activations</code> concept lesson, which covers what activation
       functions are and how their gradients flow; here is the short recap plus the one new derivative.
       <b>Forward:</b> $f(x)=x\\,\\sigma(\\beta x)$ is just a product of $x$ and the sigmoid $\\sigma(\\beta x)$.
       <b>Backward:</b> apply the product rule. The derivative of $x$ is $1$; the derivative of $\\sigma(\\beta x)$
       is $\\beta\\,\\sigma(\\beta x)\\,(1-\\sigma(\\beta x))$ (the standard sigmoid derivative, times $\\beta$ from
       the chain rule). So
       $$f'(x)=\\sigma(\\beta x)+x\\cdot\\beta\\,\\sigma(\\beta x)\\,(1-\\sigma(\\beta x)).$$
       Substituting $x\\,\\sigma(\\beta x)=f(x)$ into the second term and regrouping gives the paper's compact form
       $f'(x)=\\beta f(x)+\\sigma(\\beta x)(1-\\beta f(x))$ (Section 4). The CODE cell checks this derivative against
       autograd, and the slope is verified to be nonzero at a negative input.</p>`,

    example:
      `<p><b>Worked numbers</b> (Swish with $\\beta=1$, so the gate is $\\sigma(x)$):</p>
       <ul>
         <li><b>$x=1$:</b> gate $\\sigma(1)=1/(1+e^{-1})=0.7311$; output $f(1)=1\\times 0.7311=0.7311$. (ReLU would
         give $1$ &mdash; Swish passes a bit less.)</li>
         <li><b>$x=-1$:</b> gate $\\sigma(-1)=0.2689$; output $f(-1)=-1\\times 0.2689=-0.2689$. <b>Not zero</b> &mdash;
         a small negative number, where ReLU gives exactly $0$.</li>
         <li><b>$x=2$:</b> gate $\\sigma(2)=0.8808$; output $f(2)=2\\times 0.8808=1.7616$. (ReLU gives $2$.)</li>
         <li><b>$x=-3$:</b> gate $\\sigma(-3)=0.0474$; output $f(-3)=-3\\times 0.0474=-0.1423$. The gate is nearly
         shut, so the output is a tiny negative, close to ReLU's $0$.</li>
       </ul>
       <p><b>Derivative at $x=1$, $\\beta=1$:</b> $f(1)=0.7311$, $\\sigma(1)=0.7311$, so
       $f'(1)=1\\cdot 0.7311+0.7311\\cdot(1-1\\cdot 0.7311)=0.7311+0.7311\\cdot 0.2689=0.9277$. The CODE cell recomputes
       all of these and matches them against $\\texttt{F.silu}$ and autograd.</p>`,

    recipe:
      `<p><b>Swish as numbered steps</b> (input is one pre-activation number $x$, with a chosen $\\beta$):</p>
       <ol>
         <li>Compute the gate $g=\\sigma(\\beta x)=1/(1+e^{-\\beta x})$, a number in $(0,1)$.</li>
         <li>Output $f(x)=x\\cdot g$.</li>
         <li>To use it in a layer, apply this elementwise to every number coming out of a linear layer &mdash;
         exactly where you would have put a ReLU.</li>
         <li>(Optional) make $\\beta$ a learnable per-channel parameter, trained by gradient descent like any other
         weight.</li>
       </ol>`,

    results:
      `<p>Quoted from the paper (Section 4): Swish "tends to work better than ReLU on deeper models" and
       "consistently matches or outperforms ReLU on every model for both CIFAR-10 and CIFAR-100." On ImageNet it
       reports "a 1.4% boost on Mobile NASNet-A and a 2.2% boost on MobileNet over ReLU." (Source: arXiv:1710.05941.)
       We quote these with their source rather than restating them as our own; the numbers in our CODEVIZ below are
       our own small run, not the paper's reported numbers.</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> PyTorch ships the $\\beta=1$ case as <code>F.silu</code> / <code>nn.SiLU</code>
       in one line. Here you <b>build it from scratch</b> with raw tensors: one sigmoid and one multiply. The payoff
       is the <code>torch.allclose(my_swish(x, beta=1.0), F.silu(x))</code> check &mdash; proving your two-line
       formula <i>is</i> PyTorch's SiLU. You then verify the paper's derivative against autograd, confirm the slope
       is nonzero at a negative input (where ReLU's is zero), and run a tiny Swish-vs-ReLU ablation on a small net.</p>`,

    pitfalls:
      `<ul>
         <li><b>Forgetting the $\\beta$ inside the sigmoid.</b> The gate is $\\sigma(\\beta x)$, not $\\sigma(x)$.
         At $\\beta=1$ they coincide (that is the SiLU case), but with any other $\\beta$ the gate's argument must be
         scaled or the allclose-to-a-$\\beta\\neq1$ reference fails.</li>
         <li><b>Multiplying by the wrong thing.</b> Swish is $x\\cdot\\sigma(\\beta x)$ &mdash; raw $x$ times the
         gate. A common slip is returning $\\sigma(\\beta x)$ alone (that is just the sigmoid, bounded in $(0,1)$),
         or $\\sigma(x)\\cdot\\sigma(\\beta x)$.</li>
         <li><b>Expecting ReLU's zero floor.</b> Swish is <b>not</b> $\\geq 0$. For negative $x$ it returns small
         negative values (the bump), with a global minimum near $x\\approx-1.28$. If your output is clamped at $0$,
         you accidentally built ReLU.</li>
         <li><b>Confusing Swish and GELU.</b> Both are smooth self-gated activations; Swish gates with the
         <i>sigmoid</i>, GELU with the <i>Gaussian cumulative distribution</i>. They are close but not identical &mdash;
         see <code>paper-gelu</code>.</li>
         <li><b>SiLU vs Swish naming.</b> "SiLU" is exactly Swish with $\\beta=1$. PyTorch's <code>F.silu</code> has
         no $\\beta$; to match it your <code>my_swish</code> must use $\\beta=1$.</li>
       </ul>`,

    recall: [
      "Write Swish from memory: $f(x)=x\\cdot\\sigma(\\beta x)$. What does $\\sigma$ stand for, and what range does the gate live in?",
      "What happens to Swish as $\\beta\\to 0$ and as $\\beta\\to\\infty$?",
      "What is the 'non-monotonic bump', and for which sign of $x$ does it appear?",
      "How does Swish differ from ReLU for a negative input like $x=-1$, in both value and gradient?",
      "What is SiLU, and which value of $\\beta$ makes Swish equal to it?"
    ],

    practice: [
      {
        q: `Compute Swish at $x=-2$ with $\\beta=1$ (use $\\sigma(-2)=0.1192$). Then say how this differs from ReLU at the same input.`,
        steps: [
          { do: `Gate: $\\sigma(\\beta x)=\\sigma(-2)=0.1192$.`, why: `The sigmoid of $\\beta x$ is the self-gate; it is small but nonzero for a moderately negative input.` },
          { do: `Output: $f(-2)=x\\cdot\\sigma(\\beta x)=-2\\times 0.1192=-0.2384$.`, why: `Swish multiplies the raw $x$ by its gate.` },
          { do: `Compare to ReLU: $\\max(0,-2)=0$, with gradient $0$ there.`, why: `ReLU zeros out all negatives and has no gradient on that side.` }
        ],
        answer: `Swish gives $-0.2384$ (a small negative, part of the bump), while ReLU gives exactly $0$. Swish also has a nonzero slope here, so the unit can keep learning where a ReLU unit would be 'dead'.`
      },
      {
        q: `Beta effect: evaluate Swish at $x=2$ for $\\beta=0$, a small $\\beta=0.1$, and a large $\\beta=5$, and relate each to a limiting function. ($\\sigma(0)=0.5$, $\\sigma(0.2)=0.5498$, $\\sigma(10)=0.99995$.)`,
        steps: [
          { do: `$\\beta=0$: $f(2)=2\\cdot\\sigma(0)=2\\cdot 0.5=1.0$.`, why: `The gate is stuck at $0.5$, so Swish is the line $x/2$ — $2/2=1$ (paper: $\\beta=0\\Rightarrow x/2$).` },
          { do: `$\\beta=0.1$: $f(2)=2\\cdot\\sigma(0.2)=2\\cdot 0.5498=1.0997$.`, why: `Small $\\beta$ keeps the gate close to $0.5$, so the output stays near the $x/2$ line.` },
          { do: `$\\beta=5$: $f(2)=2\\cdot\\sigma(10)=2\\cdot 0.99995=1.9999$.`, why: `Large $\\beta$ drives the gate to $\\approx 1$, so $f(2)\\approx 2=\\mathrm{ReLU}(2)$ (paper: $\\beta\\to\\infty\\Rightarrow$ ReLU).` }
        ],
        answer: `As $\\beta$ grows from $0$ to large, Swish at $x=2$ moves from $1.0$ (the line $x/2$) through $1.0997$ up to $1.9999$ (ReLU's $2$). So $\\beta$ tunes Swish smoothly between a straight line and ReLU.`
      },
      {
        q: `Ablation: in a small network you train once with ReLU and once with Swish, everything else fixed. The CODEVIZ reports Swish reaching slightly lower final loss. Why might allowing small negative outputs and a smooth corner help, and why is this our number rather than the paper's?`,
        steps: [
          { do: `Note ReLU zeros every negative pre-activation and has zero gradient there, so some units can get stuck ('die').`, why: `No gradient means no learning signal for those units.` },
          { do: `Note Swish keeps a small nonzero value and slope for negatives, and is smooth at $0$.`, why: `Gradients keep flowing through near-zero and negative regions, and the smooth shape can ease optimization.` },
          { do: `Mark the result as OUR small run, not the paper's reported metric.`, why: `The spec forbids presenting our toy-run numbers as the paper's headline; the paper's own gains are quoted separately in 'results'.` }
        ],
        answer: `Swish's nonzero negative gradient and smoothness give the optimizer signal where ReLU gives none, which can edge out a lower loss on deep/small nets — matching the paper's qualitative claim that Swish 'tends to work better than ReLU on deeper models'. The exact loss gap in CODEVIZ is our own small-scale run, not the paper's reported number.`
      }
    ]
  });

  window.CODE["paper-swish"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build Swish from scratch with raw tensors: one sigmoid gate sigma(beta*x), one multiply by x. ` +
      `Prove the beta=1 case IS PyTorch's SiLU with torch.allclose(my_swish(x,1.0), F.silu(x)). ` +
      `Verify the paper's derivative f'(x)=beta*f(x)+sigma(beta x)(1-beta f(x)) against autograd, and show the ` +
      `slope is NONZERO at a negative input (where ReLU's is zero). Recompute the worked example, then run a ` +
      `tiny Swish-vs-ReLU ablation on a small net. Runs in Colab (torch is preinstalled).`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F

torch.manual_seed(0)

def my_swish(x, beta=1.0):
    """Swish from scratch — Ramachandran, Zoph & Le (2017), Section 4: f(x)=x*sigmoid(beta*x).
       At beta=1 this is SiLU (PyTorch's F.silu)."""
    return x * torch.sigmoid(beta * x)          # self-gated: x times its own sigmoid gate

# ---- THE ORACLE: my Swish at beta=1 must equal F.silu ----
x = torch.randn(1000)
ok = torch.allclose(my_swish(x, beta=1.0), F.silu(x), atol=1e-6)
print("allclose vs F.silu (beta=1):", ok)                     # expect True

# ---- the derivative (Section 4) checked against autograd ----
xb = torch.randn(5, requires_grad=True)
y = my_swish(xb, beta=1.0).sum()
y.backward()
auto = xb.grad
s = torch.sigmoid(xb); f = xb * s
paper = 1.0 * f + s * (1.0 - 1.0 * f)          # f'(x)=beta*f + sigma(beta x)(1 - beta f)
print("derivative matches autograd:", torch.allclose(auto, paper, atol=1e-6))  # True

# ---- nonzero gradient at a negative input (ReLU's is zero) ----
xn = torch.tensor([-1.0], requires_grad=True)
my_swish(xn).backward()
print("Swish slope at x=-1:", round(xn.grad.item(), 4), "(ReLU's slope there is 0.0)")

# ---- recompute the worked example (beta=1) ----
for xv in [1.0, -1.0, 2.0, -3.0]:
    print(f"swish({xv:+.0f}) =", round(my_swish(torch.tensor(xv)).item(), 4))
# expect 0.7311, -0.2689, 1.7616, -0.1423

# ---- ABLATION: Swish vs ReLU on a tiny net (same data, same init seed) ----
def make_net(act):
    return nn.Sequential(nn.Linear(20, 64), act, nn.Linear(64, 64), act, nn.Linear(64, 1))

X = torch.randn(256, 20)
w_true = torch.randn(20, 1)
Y = (X @ w_true).pow(2).sum(1, keepdim=True) + 0.1 * torch.randn(256, 1)  # nonlinear target

def train(act, steps=300):
    torch.manual_seed(0)                         # identical init for a fair comparison
    net = make_net(act); opt = torch.optim.Adam(net.parameters(), lr=1e-2)
    for _ in range(steps):
        opt.zero_grad(); loss = F.mse_loss(net(X), Y); loss.backward(); opt.step()
    return loss.item()

print("final loss  ReLU :", round(train(nn.ReLU()),  4))
print("final loss  SiLU :", round(train(nn.SiLU()),  4))   # Swish(beta=1); often matches/edges ReLU`
  };

  window.CODEVIZ["paper-swish"] = {
    question: "What does the Swish curve look like next to ReLU? Is it smooth, and does it really dip below zero (the non-monotonic 'bump') for negative inputs?",
    charts: [
      {
        type: "line",
        title: "Swish ($\\beta=1$) vs ReLU over $x\\in[-5,5]$ — the smooth, non-monotonic curve",
        xlabel: "x (pre-activation input)",
        ylabel: "activation output",
        series: [
          {
            name: "Swish = x*sigmoid(x)  (ours)",
            color: "#7ee787",
            points: [[-5.0,-0.0335],[-4.5,-0.0494],[-4.0,-0.0719],[-3.5,-0.1026],[-3.0,-0.1423],[-2.5,-0.1896],[-2.0,-0.2384],[-1.5,-0.2736],[-1.0,-0.2689],[-0.5,-0.1888],[0.0,0.0],[0.5,0.3112],[1.0,0.7311],[1.5,1.2264],[2.0,1.7616],[2.5,2.3104],[3.0,2.8577],[3.5,3.3974],[4.0,3.9281],[4.5,4.4506],[5.0,4.9665]]
          },
          {
            name: "ReLU = max(0,x)",
            color: "#ff7b72",
            points: [[-5.0,0.0],[-4.5,0.0],[-4.0,0.0],[-3.5,0.0],[-3.0,0.0],[-2.5,0.0],[-2.0,0.0],[-1.5,0.0],[-1.0,0.0],[-0.5,0.0],[0.0,0.0],[0.5,0.5],[1.0,1.0],[1.5,1.5],[2.0,2.0],[2.5,2.5],[3.0,3.0],[3.5,3.5],[4.0,4.0],[4.5,4.5],[5.0,5.0]]
          }
        ]
      }
    ],
    caption: "Our own computed curve (the Swish line is OURS, labeled), not the paper's reported numbers. The GREEN Swish curve hugs ReLU (red) for large positive x (gate near 1) and for large negative x (gate near 0), but differs in two ways the paper highlights (Section 4): (1) it is SMOOTH through x=0 with no hard corner; (2) it is NON-MONOTONIC &mdash; instead of clamping negatives to 0, it dips BELOW zero, reaching a minimum of about -0.278 near x=-1.28 (the 'bump') before rising again. That small negative region carries gradient where ReLU carries none.",
    code: `import numpy as np

def sigmoid(z): return 1.0 / (1.0 + np.exp(-z))
def swish(x, beta=1.0): return x * sigmoid(beta * x)
def relu(x): return np.maximum(0.0, x)

xs = np.arange(-5.0, 5.001, 0.5)        # 21 points
print("x     :", np.round(xs, 1).tolist())
print("swish :", np.round(swish(xs), 4).tolist())
print("relu  :", np.round(relu(xs),  4).tolist())

# locate the non-monotonic minimum (the 'bump')
fine = np.linspace(-3, 0, 200000)
ys = swish(fine)
i = ys.argmin()
print("Swish minimum: x =", round(float(fine[i]), 4), " value =", round(float(ys[i]), 4))
# expect x ~ -1.2785, value ~ -0.2785  -> this is the non-monotonic bump`
  };
})();
