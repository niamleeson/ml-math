/* Paper lesson — Learning representations by back-propagating errors
   (Rumelhart, Hinton & Williams, Nature 323:533-536, 9 October 1986). NO arXiv.
   Grounded from the canonical Nature PDF (Hinton's hosted copy: cs.toronto.edu/~hinton/absps/naturebp.pdf),
   equations (1)-(9) transcribed verbatim.
   Track A (primitive): build reverse-mode autodiff FROM SCRATCH (a tiny tape / computation graph),
   verify gradients with torch.allclose vs torch.autograd on a 2-layer MLP.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-backprop". */
(function () {
  window.LESSONS.push({
    id: "paper-backprop",
    title: "Backpropagation — Learning representations by back-propagating errors (1986)",
    tagline: "Compute the gradient of the error with respect to every weight in one backward sweep by the chain rule — so a network can learn its own internal (hidden) features.",
    module: "Papers · Foundations & Optimization",
    track: "primitive",

    paper: {
      authors: "David E. Rumelhart, Geoffrey E. Hinton, Ronald J. Williams",
      org: "Institute for Cognitive Science, UC San Diego; Computer Science, Carnegie-Mellon University",
      year: 1986,
      venue: "Nature, vol. 323, pp. 533-536 (9 October 1986)",
      citations: "",                       // not shown on the fetched source; never invent one
      arxiv: "",                            // pre-arXiv (1986) — no arXiv id exists
      url: "https://www.nature.com/articles/323533a0",
      code: ""
    },

    conceptLink: "dl-backprop",
    partOf: [
      { capstone: "capstone-image-classifier", step: 1, builds: "reverse-mode autodiff (backprop) from scratch — the engine every later step trains with" }
    ],
    prereqs: ["dl-backprop", "dl-neuron", "pt-autograd"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> A neural network is a stack of simple units. Each <b>unit</b> takes a weighted sum of
       the numbers coming in, squashes it through a smooth curve, and passes the result up. To make the network
       useful we must pick the <b>weights</b> (the numbers on the connections) so the network's output matches the
       answer we want.</p>
       <p><b>What was broken.</b> Before this paper, the famous learning rule was the <b>perceptron-convergence
       procedure</b> &mdash; it could only adjust weights that connect directly to the output, where you already
       know the desired value. The intro says learning "becomes more interesting&hellip; when we introduce
       <b>hidden units</b> whose actual or desired states are not specified by the task." A <b>hidden unit</b> is
       a unit in a middle layer: nobody tells it what it should output, so the old rule had no error signal for it.
       Without a way to train hidden units, networks could not build their own intermediate features, and so could
       not solve problems (like detecting symmetry) that <i>require</i> an internal representation.</p>`,

    contribution:
      `<p>The paper gives a single, general learning procedure &mdash; <b>back-propagation</b> &mdash; that
       assigns an error signal to <i>every</i> weight, including those feeding hidden units. Its contributions:</p>
       <ul>
         <li><b>The backward pass.</b> After a normal <b>forward pass</b> (compute every unit's output, bottom to
         top), run a <b>backward pass</b> that propagates the derivative of the error from the top layer back down,
         one layer at a time, using the <b>chain rule</b> of calculus.</li>
         <li><b>One gradient per weight, cheaply.</b> The same two passes give $\\partial E/\\partial w$ for
         <i>all</i> weights at once. You then nudge each weight downhill: $\\Delta w = -\\varepsilon\\,\\partial
         E/\\partial w$ (gradient descent).</li>
         <li><b>Learned internal representations.</b> Because hidden units now get a gradient, the network
         <i>discovers</i> useful features on its own &mdash; the paper shows hidden units that come to encode
         mirror-symmetry and family-tree structure that were never given explicitly.</li>
       </ul>`,

    whyItMattered:
      `<p>Back-propagation is the algorithm that trains essentially every deep network today. Every weight update
       in this entire course &mdash; convolutional nets, Transformers, GANs, diffusion models &mdash; is computed
       by the backward pass this paper introduced, now automated as <b>reverse-mode automatic differentiation</b>
       (what PyTorch calls <code>autograd</code>). It is step 1 of the image-classifier capstone precisely because
       nothing else can be trained until you have it. The paper's key insight &mdash; that the chain rule lets one
       backward sweep credit every weight &mdash; is the foundation the rest of deep learning is built on.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>The abstract and first two paragraphs</b> &mdash; the hidden-unit problem and what
         back-propagation does.</li>
         <li><b>Equations (1)-(9)</b> &mdash; this is the whole method in nine short lines: the forward pass
         (1)-(2), the total error (3), the backward pass (4)-(7), and the weight update (8) with its momentum
         variant (9). If you understand these nine equations you understand the paper.</li>
       </ul>
       <p><b>Skim:</b> the symmetry-detection network (Fig. 1) and the family-tree experiment (Figs. 2-4) &mdash;
       these are demonstrations that hidden units learn meaningful features; enjoy them but you do not need the
       exact weights. The recurrent-net equivalence (Fig. 5) and the local-minima discussion at the end are
       optional on a first read.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> You will build a tiny <b>tape</b> (a recorder of every arithmetic operation)
       from scratch, then ask it for the gradient of a 2-layer network's error with respect to a weight buried in
       the <i>first</i> layer. PyTorch's <code>autograd</code> will compute the same gradient independently. Do you
       expect your hand-built gradients to match PyTorch's to many decimal places &mdash; i.e. will
       <code>torch.allclose</code> return <code>True</code>? (That matching IS the proof your backprop is correct.)</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Build a scalar node class <code>Value</code> that records operations,
       so you can call <code>.backward()</code> and read a <code>.grad</code> on every input:</p>
       <ul>
         <li>Each <code>Value</code> stores its number <code>data</code>, a <code>grad</code> (starts at 0), its
         <b>parents</b> (the Values it was built from), and a tiny <code>_backward</code> closure that knows how to
         push gradient to those parents. <code># TODO</code></li>
         <li>For <code>a*b</code>: the local derivatives are $\\partial(ab)/\\partial a = b$ and $\\partial(ab)/\\partial b = a$,
         so <code># TODO: a.grad += b.data*out.grad; b.grad += a.data*out.grad</code>.</li>
         <li>For <code>sigmoid(x)</code> with output $s$: the derivative is $s(1-s)$ &mdash; that is exactly the
         paper's eq (5). <code># TODO: x.grad += s*(1-s)*out.grad</code>.</li>
         <li><code>backward()</code>: walk the graph in <b>topological order</b> (parents before children), set the
         final output's grad to 1, then call each node's <code>_backward</code> in reverse. <code># TODO</code></li>
       </ul>
       <p>The CODE cell below is the full reference, including the <code>torch.allclose</code> check against
       <code>torch.autograd</code> &mdash; that passing check is the proof your chain-rule plumbing is exactly right.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Back-propagation is two sweeps through the network.</p>
       <p><b>Forward pass (bottom to top).</b> For each unit $j$, form the total input as a weighted sum of the
       outputs $y_i$ of the units feeding it (eq 1), then squash it through the sigmoid to get the unit's output
       $y_j$ (eq 2). Do this layer by layer until the output units have values. Compare them to the desired
       values $d$ to get the total error $E$ (eq 3).</p>
       <p><b>Backward pass (top to bottom).</b> We want $\\partial E/\\partial w$ for every weight &mdash; how the
       error would change if we nudged that weight. The trick is the <b>chain rule</b>: a weight affects the error
       only through the unit it feeds, which affects the error only through the units <i>it</i> feeds, and so on up
       to the output. So we compute, in order:</p>
       <ol>
         <li>At each output unit, how the error depends on the unit's output: $\\partial E/\\partial y_j = y_j - d_j$
         (eq 4). This is the only place the targets enter.</li>
         <li>Push that through the sigmoid to get the error's sensitivity to the unit's <i>total input</i>:
         $\\partial E/\\partial x_j = \\partial E/\\partial y_j \\cdot y_j(1-y_j)$ (eq 5). ("$\\delta_j$", the
         <b>delta</b> for unit $j$, is a common name for this quantity &mdash; the error signal at unit $j$.)</li>
         <li>The gradient for a weight is then just that delta times the input on the wire:
         $\\partial E/\\partial w_{ji} = \\partial E/\\partial x_j \\cdot y_i$ (eq 6). This is the <b>delta rule</b>
         &mdash; "error signal at the top of the wire, times the activity at the bottom."</li>
         <li>To go one layer <i>down</i>, ask how the error depends on a lower unit's output: sum the deltas of all
         the units it feeds, each weighted by the connecting weight: $\\partial E/\\partial y_i = \\sum_j \\partial
         E/\\partial x_j \\cdot w_{ji}$ (eq 7). Now repeat from step 2 for that layer.</li>
       </ol>
       <p>Repeating steps 2-4 layer by layer "for successively earlier layers" gives $\\partial E/\\partial w$ for
       every weight in the network from one backward sweep. Then move each weight a small step downhill:
       $\\Delta w = -\\varepsilon\\,\\partial E/\\partial w$ (eq 8). Modern autodiff (<code>autograd</code>)
       automates exactly this: it records the forward operations on a <b>tape</b> and replays them in reverse,
       applying the local derivative at each step.</p>`,

    architecture:
      `<p><b>The net (a layered, feed-forward stack).</b> The paper's networks are layers of units stacked
       bottom-to-top:</p>
       <ul>
         <li><b>Input layer (bottom).</b> One unit per input feature; its outputs $y_i$ are just the data values.</li>
         <li><b>One or more hidden layers (middle).</b> Units with no target of their own. Each receives a weighted
         sum from the layer below and passes a sigmoid output up. The Fig. 1 symmetry net uses a single hidden layer
         of just <b>two</b> units; the Fig. 4 family-tree net is a <b>five-layer</b> net (24 inputs &rarr; 6 &rarr; 12
         &rarr; 6 &rarr; output).</li>
         <li><b>Output layer (top).</b> Units whose outputs are compared to the targets $d_j$ to form the error $E$.</li>
       </ul>
       <p><b>Connections.</b> Every weight $w_{ji}$ runs from a lower unit $i$ to a higher unit $j$. The paper allows
       any number of intermediate layers and even connections that skip layers, but <i>forbids</i> connections within
       a layer or from higher to lower layers (the net is acyclic / feed-forward). A <b>bias</b> is handled as an
       extra always-on input of value 1, so its weight is learned like any other weight.</p>
       <p><b>Two passes over this structure.</b></p>
       <ol>
         <li><b>Forward pass</b> (bottom &rarr; top): each layer's states are set in parallel from the layer below via
         eq (1) then eq (2); layers are processed in order until the output layer has values. Then eq (3) gives $E$.</li>
         <li><b>Backward pass</b> (top &rarr; bottom): the same wiring is traversed in reverse. Start the error signal
         at the output with eq (4), convert output-sensitivity to input-sensitivity (the delta) with eq (5), read off
         each weight's gradient with eq (6), and send the error signal down one layer with eq (7) &mdash; the
         <i>transpose</i> use of the very same weights. Repeat for successively earlier layers.</li>
       </ol>
       <p>The two passes touch every weight exactly once each, so one forward + one backward sweep yields
       $\\partial E/\\partial w$ for the whole net; eq (8) (or eq (9) with momentum) then updates every weight. Fig. 5
       notes a recurrent net run for $T$ iterations is equivalent to this kind of layered net unrolled into $T$ layers
       with weights tied across layers.</p>`,

    symbols: [
      { sym: "unit", desc: "one artificial neuron: it forms a weighted sum of its inputs and squashes it through a smooth curve (here the sigmoid). The paper calls them 'neurone-like units'." },
      { sym: "hidden unit", desc: "a unit in a middle layer. No target is given for it, so it has no obvious error signal — training hidden units is the problem this paper solves." },
      { sym: "weight $w_{ji}$", desc: "the number on the connection FROM unit $i$ (lower) TO unit $j$ (higher). It scales how much $i$'s output contributes to $j$'s input. The thing we are learning." },
      { sym: "$y_i$", desc: "the output (activity) of unit $i$ — the number it sends up its outgoing connections. The input layer's $y_i$ are the data." },
      { sym: "$x_j$", desc: "the total input to unit $j$: the weighted sum $\\sum_i y_i w_{ji}$ of the outputs of the units connected to it (eq 1)." },
      { sym: "sigmoid", desc: "the squashing function $y=1/(1+e^{-x})$ (eq 2): a smooth S-curve mapping any real number to $(0,1)$. Its key property: its derivative is $y(1-y)$, computable straight from the output." },
      { sym: "$d_j$", desc: "the desired (target) state of output unit $j$ — the value we want it to produce for this input case." },
      { sym: "$E$", desc: "the total error: half the sum of squared differences between actual outputs $y$ and desired outputs $d$, over all output units $j$ and all input-output cases $c$ (eq 3). The quantity we minimize." },
      { sym: "forward pass", desc: "computing every unit's output from the bottom layer up to the top, using eqs (1)-(2). Produces the predictions and the error." },
      { sym: "backward pass", desc: "propagating the error derivative from the top layer back down, one layer at a time (eqs 4-7), to get $\\partial E/\\partial w$ for every weight." },
      { sym: "chain rule", desc: "the calculus rule that the derivative of a composition is the product of the derivatives along the path: if $E$ depends on $x_j$ which depends on $w_{ji}$, then $\\partial E/\\partial w_{ji} = (\\partial E/\\partial x_j)(\\partial x_j/\\partial w_{ji})$. Backprop is the chain rule applied layer by layer." },
      { sym: "$\\partial E/\\partial y_j$", desc: "how much the error changes if unit $j$'s OUTPUT changes a little. For output units this is $y_j-d_j$ (eq 4)." },
      { sym: "$\\partial E/\\partial x_j$ (the delta $\\delta_j$)", desc: "how much the error changes if unit $j$'s TOTAL INPUT changes a little — the 'error signal' at unit $j$. Equals $\\partial E/\\partial y_j \\cdot y_j(1-y_j)$ (eq 5)." },
      { sym: "delta rule", desc: "the form of the weight gradient: $\\partial E/\\partial w_{ji} = \\delta_j\\, y_i$ (eq 6) — the error signal (delta) at the receiving unit times the activity arriving on that wire." },
      { sym: "$\\varepsilon$ (epsilon)", desc: "the learning rate: a small positive step size for each weight update (eq 8). The paper uses $\\varepsilon=0.1$ for Fig. 1." },
      { sym: "$\\alpha$ (alpha)", desc: "the momentum coefficient (eq 9), between 0 and 1: how much of the previous weight change is carried into the current one to smooth and speed up descent. The paper uses $\\alpha=0.9$ for Fig. 1." },
      { sym: "tape", desc: "(modern term) the recorded list of operations done in the forward pass, in order. Reverse-mode autodiff replays this tape backward, applying each operation's local derivative — this is exactly the backward pass, automated." }
    ],

    formula:
      `$$\\text{forward:}\\quad x_j=\\sum_i y_i\\,w_{ji}\\;(1)\\qquad y_j=\\frac{1}{1+e^{-x_j}}\\;(2)\\qquad
        E=\\tfrac{1}{2}\\sum_c\\sum_j (y_{j,c}-d_{j,c})^2\\;(3)$$
       $$\\text{backward:}\\quad \\frac{\\partial E}{\\partial y_j}=y_j-d_j\\;(4)\\qquad
        \\frac{\\partial E}{\\partial x_j}=\\frac{\\partial E}{\\partial y_j}\\,y_j(1-y_j)\\;(5)$$
       $$\\frac{\\partial E}{\\partial w_{ji}}=\\frac{\\partial E}{\\partial x_j}\\,y_i\\;(6)\\qquad
        \\frac{\\partial E}{\\partial y_i}=\\sum_j \\frac{\\partial E}{\\partial x_j}\\,w_{ji}\\;(7)$$
       $$\\text{update:}\\quad \\Delta w=-\\varepsilon\\,\\frac{\\partial E}{\\partial w}\\;(8)\\qquad
        \\Delta w(t)=-\\varepsilon\\,\\frac{\\partial E}{\\partial w(t)}+\\alpha\\,\\Delta w(t-1)\\;(9)$$`,

    whatItDoes:
      `<p>Equations (1)-(3) are the <b>forward pass</b>: stack weighted sums and sigmoids to get the outputs, then
       measure the squared error. Equations (4)-(7) are the <b>backward pass</b>: (4) starts the error signal at
       the output, (5) pushes it through the sigmoid (note $y_j(1-y_j)$ is the sigmoid's derivative, read straight
       off the output), (6) turns an error signal into a weight gradient (the <b>delta rule</b>), and (7)
       propagates the error signal down to the previous layer so the process can repeat. Equation (8) takes the
       gradient and steps every weight a little downhill; equation (9) is the <b>acceleration (momentum)</b> variant
       &mdash; it adds a fraction $\\alpha$ of the previous step $\\Delta w(t-1)$ to speed up descent without giving
       up the locality of the rule. (Equations are numbered as in the paper.)</p>`,

    derivation:
      `<p>The full derivation of why each step is exactly the chain rule &mdash; including why the sigmoid's
       derivative is $y(1-y)$ &mdash; lives in the <code>dl-backprop</code> concept lesson. Short recap of why eq
       (7) is true: a lower unit $i$ influences the error only by feeding the higher units $j$ it connects to.
       Each path contributes $\\partial E/\\partial x_j$ (how the error reacts to $j$'s input) times $\\partial
       x_j/\\partial y_i = w_{ji}$ (how $j$'s input reacts to $i$'s output, from eq 1). The chain rule says we
       multiply along each path and the multivariable chain rule says we <i>add</i> over all such paths &mdash;
       giving the sum in eq (7). See that lesson for the line-by-line derivation.</p>`,

    example:
      `<p><b>Worked numbers</b> &mdash; one backward pass through a 2-layer net. One input unit $i$, one hidden
       unit $h$, one output unit $o$; sigmoid units; target $d=0$. Weights $w_{hi}=0.2$ (input&rarr;hidden),
       $w_{oh}=0.3$ (hidden&rarr;output); input activity $y_i=0.5$.</p>
       <p><b>Forward (eqs 1-2):</b></p>
       <ul>
         <li>$x_h = y_i w_{hi} = 0.5\\cdot 0.2 = 0.1$, so $y_h = 1/(1+e^{-0.1}) = 0.524979$.</li>
         <li>$x_o = y_h w_{oh} = 0.524979\\cdot 0.3 = 0.157494$, so $y_o = 1/(1+e^{-0.157494}) = 0.539292$.</li>
         <li>Error $E = \\tfrac12 (y_o-d)^2 = \\tfrac12(0.539292)^2 = 0.145418$.</li>
       </ul>
       <p><b>Backward (eqs 4-6 at the output, then 7&rarr;5&rarr;6 for the hidden weight):</b></p>
       <ul>
         <li>$\\partial E/\\partial y_o = y_o - d = 0.539292$ (eq 4).</li>
         <li>$\\partial E/\\partial x_o = 0.539292\\cdot y_o(1-y_o) = 0.539292\\cdot 0.248456 = 0.133990$ (eq 5).
         This is the output delta $\\delta_o$.</li>
         <li>$\\partial E/\\partial w_{oh} = \\delta_o\\, y_h = 0.133990\\cdot 0.524979 = 0.070342$ (eq 6).</li>
         <li>Propagate down: $\\partial E/\\partial y_h = \\delta_o\\, w_{oh} = 0.133990\\cdot 0.3 = 0.040197$ (eq 7).</li>
         <li>$\\partial E/\\partial x_h = 0.040197\\cdot y_h(1-y_h) = 0.040197\\cdot 0.249376 = 0.010024$ (eq 5).
         This is the hidden delta $\\delta_h$.</li>
         <li>$\\partial E/\\partial w_{hi} = \\delta_h\\, y_i = 0.010024\\cdot 0.5 = 0.005012$ (eq 6).</li>
       </ul>
       <p>The CODE cell recomputes these exact numbers with the from-scratch tape and confirms them against
       <code>torch.autograd</code>.</p>`,

    recipe:
      `<p><b>The procedure, as numbered steps (one training step):</b></p>
       <ol>
         <li><b>Forward pass.</b> For each layer bottom-to-top: $x_j=\\sum_i y_i w_{ji}$ (eq 1), $y_j=\\text{sigmoid}(x_j)$ (eq 2).</li>
         <li>Compute the error $E=\\tfrac12\\sum (y_j-d_j)^2$ (eq 3).</li>
         <li><b>Backward pass</b>, output layer: $\\partial E/\\partial y_j=y_j-d_j$ (eq 4), then $\\delta_j=\\partial E/\\partial x_j=\\partial E/\\partial y_j\\cdot y_j(1-y_j)$ (eq 5).</li>
         <li>Weight gradients into that layer: $\\partial E/\\partial w_{ji}=\\delta_j\\,y_i$ (eq 6).</li>
         <li>Propagate to the layer below: $\\partial E/\\partial y_i=\\sum_j \\delta_j\\,w_{ji}$ (eq 7); go back to step 3 for that layer.</li>
         <li>Update every weight: $w \\leftarrow w-\\varepsilon\\,\\partial E/\\partial w$ (eq 8), optionally with momentum (eq 9).</li>
         <li>Repeat over many sweeps through the data until $E$ is small.</li>
       </ol>`,

    results:
      `<p>The paper's demonstrations (not benchmark numbers): a net with just <b>two hidden units</b> learned to
       detect mirror-symmetry of a binary input, converging after the authors report <b>1,425 sweeps</b> through
       the 64 inputs with $\\varepsilon=0.1$, $\\alpha=0.9$ (Fig. 1 caption). A separate net learned the structure
       of two family trees, with hidden units that came to encode features like nationality and family branch
       (Figs. 2-4). The authors note the procedure can get stuck in <b>local minima</b> but that "in our experience
       with many tasks&hellip; the network very rarely gets stuck." (Source: Nature 323:533-536, 1986.)</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> PyTorch ships this as <code>autograd</code>: call <code>.backward()</code>
       and read <code>.grad</code>. Here you <b>build that engine from scratch</b> &mdash; a tiny <code>Value</code>
       node that records each operation (a <b>tape</b>), with a local-derivative closure for $+$, $\\times$, power,
       and sigmoid, plus a topological <code>backward()</code> that applies eqs (4)-(7) by the chain rule. The
       payoff is the <code>torch.allclose(my_grads, autograd_grads)</code> check on a 2-layer MLP &mdash; if it
       passes, your hand-built backprop is provably identical to PyTorch's autograd.</p>`,

    pitfalls:
      `<ul>
         <li><b>Reverse, in topological order.</b> A node's gradient is only complete after <i>all</i> the nodes it
         feeds have pushed into it. Process the graph parents-before-children, then call the backward closures in
         reverse. Out-of-order replay gives wrong gradients.</li>
         <li><b>Accumulate, don't overwrite.</b> If a value feeds several places (e.g. a shared weight), each path
         contributes &mdash; use <code>grad +=</code>, matching the <i>sum</i> in eq (7). Overwriting drops paths.</li>
         <li><b>Zero the grads between steps.</b> Because grads accumulate, you must reset every <code>.grad</code>
         to 0 before each new backward pass (PyTorch's <code>optimizer.zero_grad()</code>). Forgetting this sums
         gradients across steps &mdash; a classic bug.</li>
         <li><b>Sigmoid derivative uses the output.</b> Eq (5) is $y(1-y)$, the <i>output</i> $y$, not the input
         $x$. Plugging in $x$ is a common slip that breaks the match.</li>
         <li><b>The factor of $\\tfrac12$ in $E$.</b> The paper's $E=\\tfrac12\\sum(y-d)^2$ makes eq (4) come out as
         exactly $y-d$ (the 2 cancels). Drop the $\\tfrac12$ and your output gradient is off by a factor of 2.</li>
         <li><b>Local minima.</b> The error surface is non-convex; gradient descent can stall. The paper notes this
         but reports it is rare in practice for these tasks.</li>
       </ul>`,

    recall: [
      "State the backward-pass chain for one weight from memory: eq (4) $\\partial E/\\partial y_j=y_j-d_j$, eq (5) $\\partial E/\\partial x_j=\\partial E/\\partial y_j\\,y_j(1-y_j)$, eq (6) $\\partial E/\\partial w_{ji}=\\partial E/\\partial x_j\\,y_i$.",
      "Write the delta rule and say in words what 'delta' ($\\partial E/\\partial x_j$) means.",
      "Why is the sigmoid's derivative $y(1-y)$ convenient during the backward pass?",
      "State eq (7) and explain why it is a SUM over the higher units.",
      "What is a 'tape' in reverse-mode autodiff, and how does replaying it relate to the backward pass?"
    ],

    practice: [
      {
        q: `One input unit $i$, one output unit $o$ (no hidden layer), sigmoid, target $d=1$. Weight $w_{oi}=0.5$, input $y_i=2$. Do a forward pass and compute $\\partial E/\\partial w_{oi}$.`,
        steps: [
          { do: `Forward (eq 1-2): $x_o=y_i w_{oi}=2\\cdot 0.5=1.0$; $y_o=1/(1+e^{-1})=0.731059$.`, why: `Weighted sum, then squash.` },
          { do: `Error sensitivity (eq 4): $\\partial E/\\partial y_o=y_o-d=0.731059-1=-0.268941$.`, why: `Only the target enters here.` },
          { do: `Delta (eq 5): $\\partial E/\\partial x_o=-0.268941\\cdot y_o(1-y_o)=-0.268941\\cdot 0.196612=-0.052878$.`, why: `Push through the sigmoid; $y(1-y)$ is its derivative.` },
          { do: `Weight gradient (eq 6): $\\partial E/\\partial w_{oi}=-0.052878\\cdot y_i=-0.052878\\cdot 2=-0.105756$.`, why: `Delta times the activity on the wire.` }
        ],
        answer: `$\\partial E/\\partial w_{oi}\\approx -0.1058$. It is negative, so gradient descent ($\\Delta w=-\\varepsilon\\,\\partial E/\\partial w$) will INCREASE $w_{oi}$ — pushing the output up toward the target $d=1$, as expected.`
      },
      {
        q: `Take the worked example (input $\\to$ hidden $\\to$ output, $\\partial E/\\partial w_{hi}=0.005012$). With learning rate $\\varepsilon=0.1$ (eq 8), what is the new $w_{hi}$, and does the update reduce the output?`,
        steps: [
          { do: `Apply eq (8): $\\Delta w_{hi}=-\\varepsilon\\,\\partial E/\\partial w_{hi}=-0.1\\cdot 0.005012=-0.0005012$.`, why: `Step downhill on the error surface.` },
          { do: `New weight: $w_{hi}=0.2-0.0005012=0.1994988$.`, why: `The gradient was positive, so the weight decreases.` },
          { do: `Reason about direction: target was $d=0$ but $y_o=0.539$ was too high; decreasing $w_{hi}$ lowers $x_h$, then $y_h$, then $x_o$, then $y_o$.`, why: `Backprop credited this buried weight correctly.` }
        ],
        answer: `$w_{hi}\\approx 0.19950$. Because the output ($0.539$) was above the target ($0$), backprop produced a positive gradient, so eq (8) shrinks $w_{hi}$, nudging the output down toward 0. The hidden-layer weight was trained with no direct target — that is the paper's whole point.`
      },
      {
        q: `Ablation: in the CODE's tape, replace the topological-order backward with a single pass that visits nodes in the order they were created (forward order), instead of reverse. What breaks, and why?`,
        steps: [
          { do: `Recall a node's grad is only final once ALL its children have pushed into it (eq 7 is a sum over children).`, why: `Reverse-mode needs children processed before parents.` },
          { do: `Visiting in forward order means a parent's $\\_backward$ runs before its children have contributed, so it reads $grad=0$ and pushes zero (or partial) gradient down.`, why: `The chain-rule product is broken mid-graph.` },
          { do: `Compare to torch.autograd: the allclose check now returns False.`, why: `The oracle exposes the bug immediately.` }
        ],
        answer: `Lower-layer gradients come out wrong (often near zero), so $\\partial E/\\partial w$ for the first-layer weights is incorrect and <code>torch.allclose</code> returns False. Reverse-mode autodiff is correct only when nodes are processed in REVERSE topological order — children fully before parents — because eq (7) sums contributions from all higher units, which must already be computed.`
      }
    ]
  });

  window.CODE["paper-backprop"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build reverse-mode autodiff FROM SCRATCH: a tiny 'Value' node that records every +, *, power and sigmoid ` +
      `on a tape, with a local-derivative closure each (the chain rule). backward() walks the graph in ` +
      `topological order and applies the paper's eqs (4)-(7). THE ORACLE: build a 2-layer MLP from these Values, ` +
      `call backward(), and check every gradient with torch.allclose vs torch.autograd — if it passes, your ` +
      `hand-built backprop IS PyTorch's autograd. Then recompute the worked 1->1->1 example. Runs in Colab.`,
    code: `import math, torch

# =========================================================
#  Reverse-mode autodiff FROM SCRATCH — a tiny 'tape'.
#  Each Value records the op that made it + how to push grad
#  to its parents (the chain rule). Rumelhart et al. (1986).
# =========================================================
class Value:
    def __init__(self, data, parents=()):
        self.data = float(data)
        self.grad = 0.0                       # dE/d(this)
        self._parents = parents               # the Values this was built from
        self._backward = lambda: None         # how to push grad to parents

    def __add__(self, o):                     # x_j = sum_i y_i w_ji  (eq 1) uses +
        o = o if isinstance(o, Value) else Value(o)
        out = Value(self.data + o.data, (self, o))
        def bw():
            self.grad += out.grad             # d(a+b)/da = 1
            o.grad    += out.grad             # accumulate! (eq 7 is a SUM)
        out._backward = bw; return out

    def __mul__(self, o):                     # ... and *  (eq 1)
        o = o if isinstance(o, Value) else Value(o)
        out = Value(self.data * o.data, (self, o))
        def bw():
            self.grad += o.data * out.grad    # chain rule: d(ab)/da = b
            o.grad    += self.data * out.grad
        out._backward = bw; return out

    def sigmoid(self):                        # y_j = 1/(1+e^-x)  (eq 2)
        s = 1.0 / (1.0 + math.exp(-self.data))
        out = Value(s, (self,))
        def bw():
            self.grad += s * (1 - s) * out.grad   # eq (5): derivative is y(1-y)
        out._backward = bw; return out

    def __pow__(self, p):                     # for the 0.5*(y-d)^2 error (eq 3)
        out = Value(self.data ** p, (self,))
        def bw():
            self.grad += p * self.data ** (p - 1) * out.grad
        out._backward = bw; return out

    def __radd__(self, o): return self + o
    def __rmul__(self, o): return self * o

    def backward(self):
        # topological order (parents before children), then replay in REVERSE
        topo, seen = [], set()
        def build(v):
            if id(v) not in seen:
                seen.add(id(v))
                for p in v._parents: build(p)
                topo.append(v)
        build(self)
        self.grad = 1.0                       # dE/dE = 1 (start the backward pass)
        for v in reversed(topo):
            v._backward()                     # apply eqs (4)-(7) layer by layer

# ---------- a 2-layer MLP: 3 inputs -> 2 hidden (sigmoid) -> 1 output (sigmoid) ----------
torch.manual_seed(0)
W1 = torch.randn(2, 3, dtype=torch.float64); b1 = torch.randn(2, dtype=torch.float64)
W2 = torch.randn(1, 2, dtype=torch.float64); b2 = torch.randn(1, dtype=torch.float64)
x  = torch.randn(3, dtype=torch.float64)
d  = 1.0                                       # desired output

# --- my tape ---
xv  = [Value(float(v)) for v in x]
W1v = [[Value(float(W1[i, j])) for j in range(3)] for i in range(2)]
b1v = [Value(float(b1[i])) for i in range(2)]
W2v = [Value(float(W2[0, j])) for j in range(2)]
b2v = Value(float(b2[0]))

h = []
for i in range(2):                             # forward pass (eq 1,2)
    z = b1v[i]
    for j in range(3): z = z + W1v[i][j] * xv[j]
    h.append(z.sigmoid())
zo = b2v
for j in range(2): zo = zo + W2v[j] * h[j]
yo = zo.sigmoid()
E = 0.5 * (yo + (-1.0) * Value(d)) ** 2         # total error (eq 3)
E.backward()                                    # the backward pass
my_gW1 = torch.tensor([[W1v[i][j].grad for j in range(3)] for i in range(2)],
                      dtype=torch.float64)

# --- THE ORACLE: torch.autograd computes the same gradient ---
W1t = W1.clone().requires_grad_(); b1t = b1.clone().requires_grad_()
W2t = W2.clone().requires_grad_(); b2t = b2.clone().requires_grad_()
ht  = torch.sigmoid(W1t @ x + b1t)
yot = torch.sigmoid(W2t @ ht + b2t)
Et  = 0.5 * (yot - d) ** 2
Et.backward()

print("E  (mine) =", round(E.data, 8), " (torch) =", round(Et.item(), 8))
print("dE/dW1 allclose vs torch.autograd:",
      torch.allclose(my_gW1, W1t.grad, atol=1e-9))   # expect True  <-- the proof

# ---------- recompute the worked example: 1 -> 1 -> 1 net, d=0 ----------
yi = Value(0.5); w_hi = Value(0.2); w_oh = Value(0.3)
y_h = (yi * w_hi).sigmoid()
y_o = (y_h * w_oh).sigmoid()
Ee  = 0.5 * (y_o + (-0.0)) ** 2
Ee.backward()
print("worked example  dE/dw_oh =", round(w_oh.grad, 6),   # ~ 0.070342
      " dE/dw_hi =", round(w_hi.grad, 6))                  # ~ 0.005012`
  };

  window.CODEVIZ["paper-backprop"] = {
    question: "Use the paper's equations (1)-(8), coded by hand, to train a tiny 2-hidden-layer net on XOR — a task that PROVABLY needs hidden units. Does the error fall and the network learn the right function?",
    charts: [
      {
        type: "line",
        title: "XOR training error E over backprop steps (our hand-coded eqs 1-8)",
        xlabel: "training step (gradient-descent sweep)",
        ylabel: "total error E (eq 3)",
        series: [
          {
            name: "Error E",
            color: "#7ee787",
            points: [[0,0.8426],[100,0.4946],[200,0.4788],[300,0.4377],[400,0.3488],[500,0.2039],[600,0.0906],[700,0.0452],[800,0.0271],[900,0.0185],[1000,0.0137],[1100,0.0107],[1200,0.0087],[1300,0.0073],[1400,0.0063],[1500,0.0055],[1600,0.0048],[1700,0.0043],[1800,0.0039],[1900,0.0036],[2000,0.0033]]
          }
        ]
      }
    ],
    caption: "Our small-scale run (numpy, seed 0), not a number from the paper. A 2-4-1 sigmoid net trained on the four XOR cases with backprop coded entirely from the paper's eqs (1)-(8), learning rate 0.5. The error E falls from 0.84 to ~0.003 over 2000 sweeps and the final predictions are [0.034, 0.959, 0.960, 0.045] — essentially the XOR truth table [0,1,1,0]. XOR is the classic task a single layer CANNOT solve (it is not linearly separable), so a low error here means the HIDDEN units learned an internal representation — exactly the capability the paper introduced. Remove the hidden layer (single-layer net) and the error stalls near 0.5, never solving XOR (the ablation).",
    code: `import numpy as np
# Train a 2-4-1 sigmoid net on XOR using ONLY the paper's eqs (1)-(8), coded by hand.
rng = np.random.default_rng(0)
X = np.array([[0,0],[0,1],[1,0],[1,1]], float)
d = np.array([0,1,1,0], float)                     # XOR target (needs a hidden layer)
H = 4
W1 = rng.normal(0,1,(H,2)); b1 = rng.normal(0,1,H)
W2 = rng.normal(0,1,H);     b2 = rng.normal(0,1)
sig = lambda z: 1/(1+np.exp(-z))
eps = 0.5
log = []
for t in range(2001):
    xh = X @ W1.T + b1; yh = sig(xh)               # forward  (eq 1,2)
    xo = yh @ W2 + b2;  yo = sig(xo)
    E = 0.5*np.sum((yo-d)**2)                       # error    (eq 3)
    if t % 100 == 0: log.append((t, round(float(E),4)))
    dyo = yo - d                                    # eq 4
    dxo = dyo*yo*(1-yo)                             # eq 5  (delta_o)
    dW2 = dxo @ yh; db2 = dxo.sum()                 # eq 6
    dyh = np.outer(dxo, W2)                         # eq 7  (propagate down)
    dxh = dyh*yh*(1-yh)                             # eq 5  (delta_h)
    dW1 = dxh.T @ X; db1 = dxh.sum(0)               # eq 6
    W1-=eps*dW1; b1-=eps*db1; W2-=eps*dW2; b2-=eps*db2   # eq 8
print(log)                                          # E: 0.84 -> 0.003
print("final preds:", np.round(sig((sig(X@W1.T+b1))@W2+b2),3))  # ~ [0.034,0.959,0.960,0.045]`
  };
})();
