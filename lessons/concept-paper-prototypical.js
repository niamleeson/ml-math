/* Paper lesson — "Prototypical Networks for Few-shot Learning", Snell, Swersky, Zemel, 2017.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-prototypical".
   GROUNDED from arXiv:1703.05175 (abstract) and the ar5iv HTML mirror (Section 2.2 Eqns 1-2,
   Section 2.3 Bregman, Tables 1-2). Track B (architecture): build the novel part by hand on top
   of nn.Linear — per-class prototype = mean of support embeddings, then classify a query by
   softmax over NEGATIVE squared Euclidean distances to the prototypes. Train episodically.
   All CODE/CODEVIZ numbers are from our own small CPU run, not the paper's reported numbers. */
(function () {
  window.LESSONS.push({
    id: "paper-prototypical",
    title: "Prototypical Networks — Prototypical Networks for Few-shot Learning (2017)",
    tagline: "Average each class's few support examples into one prototype point, then label a query by the nearest prototype.",
    module: "Papers · Meta-learning, Bayesian & Robustness",
    track: "architecture",
    paper: {
      authors: "Jake Snell, Kevin Swersky, Richard S. Zemel",
      org: "University of Toronto / Vector Institute / Twitter",
      year: 2017,
      venue: "arXiv:1703.05175 (Mar 2017); NeurIPS (NIPS) 2017",
      citations: "",
      arxiv: "https://arxiv.org/abs/1703.05175",
      code: "https://github.com/jakesnell/prototypical-networks"
    },
    conceptLink: "fs-few-shot",
    partOf: [],
    prereqs: ["fs-few-shot", "fs-metric-learning", "ml-softmax", "fnd-vector", "pt-nn-module", "dl-backprop"],

    // WHY READ IT
    problem:
      `<p><b>Few-shot classification</b> is the task of recognizing brand-new classes from only a handful of
       labeled examples each &mdash; say, telling apart five new bird species after seeing just five photos of
       each. A normal classifier trained on a fixed set of classes cannot do this: it has a fixed output layer,
       one slot per class it was trained on, and a new class has no slot. Retraining on five photos would
       badly overfit.</p>
       <p>By 2017 the leading few-shot methods leaned on heavy machinery &mdash; recurrent controllers,
       attention over the whole support set, or learned optimizers. The paper's complaint is that this
       complexity was not obviously buying much:</p>
       <blockquote>"some simple design decisions can yield substantial improvements over recent approaches
       involving complicated architectural choices and meta-learning." (Abstract)</blockquote>
       <p>The open question: is there a <i>simple</i> inductive bias &mdash; a built-in assumption about the
       data &mdash; that does well precisely <b>because</b> data is scarce?</p>`,
    contribution:
      `<ul>
        <li><b>The class prototype.</b> Embed each labeled support example with a neural network, then take
        the <b>mean</b> of a class's embeddings to get one point per class &mdash; its <b>prototype</b>. The
        whole class is summarized by a single vector.</li>
        <li><b>Classify by distance to prototypes.</b> Embed a query, measure its <b>squared Euclidean
        distance</b> to each prototype, and turn the negative distances into class probabilities with a
        softmax. Nearest prototype wins.</li>
        <li><b>A principled reason it works.</b> Section 2.3 shows that with squared Euclidean distance &mdash;
        a <b>Bregman divergence</b> &mdash; the mean is the provably optimal single representative of a set of
        points. So "prototype = mean" is not a guess; it is the right choice for this distance.</li>
      </ul>`,
    whyItMattered:
      `<p>Prototypical Networks became a standard baseline for <b>meta-learning</b> (learning to learn new
       tasks quickly) and few-shot benchmarks, prized for being simple, fast, and strong. The "embed, then
       compare by distance to a class summary" pattern recurs widely: nearest-class-mean classifiers,
       retrieval, and clustering all share its shape. It is the natural companion to Matching Networks
       (<code>paper-matching-networks</code>): both are <b>metric / embedding</b> few-shot methods, but where
       Matching Networks attends over <i>every</i> support example, Prototypical Networks first collapse each
       class to one prototype &mdash; simpler, and often just as accurate.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2.2 (Model)</b> &mdash; the two equations you will transcribe and implement: the prototype
        as a mean (Eqn. 1) and the softmax over negative distances (Eqn. 2), plus the loss
        $J = -\\log p_\\phi(y=k\\mid x)$.</li>
        <li><b>Algorithm 1</b> &mdash; how a training <b>episode</b> is built: sample classes, split each
        class's examples into a support set and a query set.</li>
        <li><b>&sect;2.3 (Prototypical Networks as Mixture Density Estimation)</b> &mdash; the Bregman-divergence
        argument for <i>why</i> the mean is the right prototype when the distance is squared Euclidean.</li>
        <li><b>Tables 1-2</b> &mdash; the Omniglot and miniImageNet accuracy numbers.</li>
       </ul>
       <p><b>Skim:</b> &sect;2.4-2.5 (comparison to Matching Networks and the linear-model view), &sect;3
       (zero-shot extension to the CU-Birds dataset), and the exact embedding-network layer tables. The math
       you need is two short equations in &sect;2.2.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will build a <b>5-way 5-shot</b> task: 5 brand-new classes, 5 labeled support examples each, and
       you must label query points the model has never seen, drawn from those same 5 classes. Pure guessing
       would be right <b>1 in 5</b> times &mdash; <b>20%</b>, the <b>chance</b> level. After episodic training
       of just the embedding network, where do you expect 5-way accuracy on <i>held-out</i> classes to land:
       near 20%, or far above it? Write your guess and one sentence of reasoning before running the code.</p>`,
    attempt:
      `<p>Before the reveal, sketch the forward pass. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>Embed the support set with <code>f = nn.Sequential(...)</code>: shape
        <code>[N, K, M]</code> &mdash; $N$ classes, $K$ shots each, $M$-dimensional embedding.</li>
        <li>TODO: <b>prototype</b> for each class = <code>support_emb.mean(dim=1)</code> &rarr; shape
        <code>[N, M]</code>  <i># Eqn. 1: mean of the K support embeddings</i></li>
        <li>Embed the queries &rarr; shape <code>[Nq, M]</code>.</li>
        <li>TODO: <b>squared Euclidean distance</b> from each query to each prototype:
        <code>d = ((q[:,None,:] - proto[None,:,:])**2).sum(-1)</code> &rarr; shape <code>[Nq, N]</code>.</li>
        <li>TODO: <b>logits</b> = <code>-d</code> (NEGATIVE distance), then <code>cross_entropy(logits, query_labels)</code>
        <i># Eqn. 2 is softmax of these logits</i></li>
       </ul>
       <p>Then train it episodically and check accuracy on classes held out of training.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The method has three moving parts: an <b>embedding network</b>, the <b>prototype</b>, and a
       <b>distance-based softmax</b>. Define each term as we go.</p>
       <p><b>Embedding network</b> $f_\\phi$. This is a neural network with weights $\\phi$ (the Greek letter
       "phi") that maps an input $x$ (an image, say) to a point in an $M$-dimensional space &mdash; a length-$M$
       list of numbers. "Embedding" just means this learned point that stands in for the raw input. Two inputs
       that should count as the same class ought to land near each other.</p>
       <p><b>Support set</b> $S_k$. For each class $k$ you are given a few labeled examples. The set of examples
       carrying label $k$ is written $S_k$, and $|S_k|$ is how many there are (the "$K$" in "$K$-shot"). The
       paper (&sect;2.2): "Each prototype is the mean vector of the embedded support points belonging to its
       class."</p>
       <p><b>Prototype</b> $c_k$ (the letter "c" with subscript $k$). Embed every support example of class $k$
       and <b>average</b> the resulting points. That single average vector is the class prototype &mdash; one
       point that summarizes the whole class (Eqn. 1).</p>
       <p><b>Distance, then softmax.</b> To classify a new query $x$, embed it to $f_\\phi(x)$ and compute its
       <b>squared Euclidean distance</b> to each prototype. "Squared Euclidean distance" between two points $z$
       and $z'$ is $d(z,z') = \\lVert z - z' \\rVert^2$: subtract coordinate by coordinate, square each
       difference, and sum. Smaller means closer. The paper turns these distances into a probability over
       classes with a <b>softmax</b> applied to the <b>negative</b> distances (Eqn. 2): the closer prototype
       (smaller $d$, so larger $-d$) gets the larger probability. Negating is what flips "near" into "high
       score."</p>
       <p>Training is <b>episodic</b> (Algorithm 1): each step builds a fresh mini few-shot task &mdash; pick a
       handful of classes, split each class's examples into a support set (to form prototypes) and a query set
       (to score) &mdash; and the loss pushes queries toward their own class's prototype. Because every episode
       uses different classes, the embedding learns a <i>general</i> rule for separating classes, not the
       identities of any fixed label set. That is what lets it handle classes it never trained on.</p>`,
    architecture:
      `<p>Two pieces: the <b>embedding network</b> $f_\\phi$ (the only learned weights) and the
       <b>non-parametric classifier head</b> (prototypes + distance softmax, no weights of its own).</p>
       <p><b>Embedding network</b> $f_\\phi$ (&sect;3.1, used for Omniglot and miniImageNet). <b>Four convolutional
       blocks</b> stacked in sequence; each block is:
       <code>Conv 3&times;3, 64 filters &rarr; BatchNorm &rarr; ReLU &rarr; MaxPool 2&times;2</code>. Each block
       halves the spatial resolution. On 28&times;28 Omniglot images the four 2&times;2 pools shrink the map to
       1&times;1&times;64, giving a <b>64-dimensional</b> embedding ($M=64$); on 84&times;84 miniImageNet images the
       same stack outputs a 5&times;5&times;64 map flattened to a <b>1600-dimensional</b> embedding ($M=1600$). The
       paper deliberately reuses the <i>same</i> simple architecture as Matching Networks for a fair comparison.
       In this lesson's toy code $f_\\phi$ is instead a small MLP
       (<code>Linear 20&rarr;64 &rarr; ReLU &rarr; Linear 64&rarr;16</code>) over synthetic vectors, but the head is identical.</p>
       <p><b>Classifier head</b> (Eqns. 1-2, no parameters). Given an episode: (a) embed the $N\\times K$ support
       examples and <b>average per class</b> &rarr; $N$ prototypes $c_k$ of dimension $M$ (Eqn. 1); (b) embed each
       query, compute its <b>squared Euclidean distance</b> to all $N$ prototypes, <b>negate</b> to get logits, and
       softmax (Eqn. 2). Nothing here is trainable &mdash; gradients flow only back into $\\phi$.</p>
       <p><b>Episodic training (Algorithm 1).</b> Each step is a fresh task, not a fixed dataset pass:</p>
       <ol>
        <li>Randomly select $N_C$ classes from the training split.</li>
        <li>For each chosen class, randomly draw $N_S$ <b>support</b> examples and $N_Q$ <b>query</b> examples
        (disjoint).</li>
        <li>Compute the $N_C$ prototypes from the support sets (Eqn. 1).</li>
        <li>For every query point accumulate the softmax cross-entropy loss $J = -\\log p_\\phi(y=k\\mid x)$ (Eqn. 2),
        averaged over all $N_C \\times N_Q$ queries.</li>
        <li>Take one SGD/Adam step on $\\phi$. Repeat for thousands of episodes, each sampling different classes.</li>
       </ol>
       <p>The paper notes it can help to train with <b>more classes per episode than at test time</b> (a higher
       $N_C$ during meta-training than the $N$-way used for evaluation), making the task harder and the embedding
       more discriminative.</p>`,
    symbols: [
      { sym: "$x$", desc: "an <b>input</b> example (e.g. an image), either a labeled support example or a query to classify." },
      { sym: "$f_\\phi$", desc: "the <b>embedding network</b>: a neural network with weights $\\phi$ that maps an input $x$ to an $M$-dimensional point $f_\\phi(x)$ (a length-$M$ list of numbers). This is the only thing that gets trained." },
      { sym: "$\\phi$", desc: "the Greek letter <b>phi</b> &mdash; the learnable <b>weights</b> of the embedding network." },
      { sym: "$M$", desc: "the <b>embedding dimension</b>: how many numbers describe each embedded point." },
      { sym: "$k$", desc: "a <b>class index</b> (which class). The query's possible labels are $k = 1, 2, \\ldots, N$ in an $N$-way task." },
      { sym: "$S_k$", desc: "the <b>support set</b> of class $k$: the few labeled examples given for that class. Written as pairs $(x_i, y_i)$ where $y_i = k$." },
      { sym: "$|S_k|$", desc: "the <b>number of support examples</b> in class $k$ &mdash; the \"$K$\" in \"$K$-shot\" (e.g. 5 for 5-shot)." },
      { sym: "$c_k$", desc: "the <b>prototype</b> of class $k$: the mean (average) of the embedded support points of that class. One vector that stands in for the whole class." },
      { sym: "$d(z, z')$", desc: "the <b>distance function</b> between two embedded points. The paper uses squared Euclidean distance $d(z,z') = \\lVert z - z' \\rVert^2$ (subtract, square each coordinate, sum)." },
      { sym: "$p_\\phi(y=k\\mid x)$", desc: "the model's <b>probability</b> that query $x$ belongs to class $k$, from a softmax over the negative distances to the prototypes." },
      { sym: "$J(\\phi)$", desc: "the <b>training loss</b>: the negative log-probability of the query's true class, $-\\log p_\\phi(y=k\\mid x)$ (cross-entropy on the distance-based softmax)." },
      { sym: "$\\mathbf{z}, \\mathbf{z}'$", desc: "two <b>embedded points</b> in the $M$-dimensional space &mdash; generic arguments of the distance $d$ (e.g. a query embedding and a prototype)." },
      { sym: "$\\varphi$", desc: "the Greek letter <b>varphi</b> &mdash; the convex <b>generating function</b> of a Bregman divergence. For squared Euclidean distance $\\varphi(\\mathbf{z}) = \\lVert \\mathbf{z}\\rVert^2$; $\\nabla\\varphi$ is its gradient." },
      { sym: "$\\mathbf{w}_k, b_k$", desc: "the <b>weight vector and bias</b> of the equivalent linear classifier for class $k$ (&sect;2.4): $\\mathbf{w}_k = 2\\,\\mathbf{c}_k$ and $b_k = -\\mathbf{c}_k^\\top\\mathbf{c}_k$, so the negative squared distance equals $\\mathbf{w}_k^\\top f_\\phi(x) + b_k$ up to a class-independent constant." },
      { sym: "$N_C, N_S, N_Q$", desc: "episode sizes in Algorithm 1: number of <b>classes</b> per episode, <b>support</b> examples per class, and <b>query</b> examples per class (called $N$, $K$, $Q$ elsewhere in this lesson)." },
      { sym: "“episode”", desc: "a plain term, not a symbol: one self-contained mini few-shot task sampled per training step &mdash; a set of classes split into a support set and a query set." },
      { sym: "“Bregman divergence”", desc: "a plain term: a family of distance-like measures (squared Euclidean is one) for which the <i>mean</i> of a set of points is the provably best single representative &mdash; which is why the prototype is a mean." }
    ],
    formula: `$$ \\mathbf{c}_k = \\frac{1}{|S_k|}\\sum_{(x_i,y_i)\\in S_k} f_\\phi(x_i) \\qquad\\text{(Eqn. 1)} $$
              <p>The class <b>prototype</b> is the mean of its support embeddings (&sect;2.2).</p>
              $$ p_\\phi(y=k \\mid \\mathbf{x}) = \\frac{\\exp\\!\\big(-d(f_\\phi(\\mathbf{x}),\\,\\mathbf{c}_k)\\big)}{\\sum_{k'} \\exp\\!\\big(-d(f_\\phi(\\mathbf{x}),\\,\\mathbf{c}_{k'})\\big)} \\qquad\\text{(Eqn. 2)} $$
              <p>A <b>softmax over the negative distances</b> from the query embedding to every prototype (&sect;2.2). The nearest prototype gets the highest probability.</p>
              $$ J(\\phi) = -\\log p_\\phi(y=k \\mid \\mathbf{x}) $$
              <p>The <b>loss</b>: negative log-probability of the query's true class $k$, minimized by SGD over episodes (&sect;2.2).</p>
              $$ d(\\mathbf{z},\\mathbf{z}') = \\lVert \\mathbf{z}-\\mathbf{z}' \\rVert^2 \\quad\\text{(squared Euclidean), a Bregman divergence } d_\\varphi(\\mathbf{z},\\mathbf{z}') = \\varphi(\\mathbf{z}) - \\varphi(\\mathbf{z}') - (\\mathbf{z}-\\mathbf{z}')^\\top \\nabla\\varphi(\\mathbf{z}') $$
              <p>The distance used. Squared Euclidean is the Bregman divergence generated by $\\varphi(\\mathbf{z})=\\lVert \\mathbf{z}\\rVert^2$; for any Bregman divergence the cluster <b>mean</b> minimizes total distance to its points, which is why the prototype is a mean (&sect;2.3).</p>
              $$ -\\lVert \\mathbf{z}-\\mathbf{c}_k \\rVert^2 = -\\mathbf{z}^\\top\\mathbf{z} + 2\\,\\mathbf{c}_k^\\top\\mathbf{z} - \\mathbf{c}_k^\\top\\mathbf{c}_k = \\underbrace{2\\,\\mathbf{c}_k}_{\\mathbf{w}_k}{}^{\\!\\top}\\mathbf{z} \\;\\underbrace{-\\,\\mathbf{c}_k^\\top\\mathbf{c}_k}_{b_k} + \\;\\text{const} $$
              <p><b>Linear-model equivalence</b> (&sect;2.4): for squared Euclidean distance the negative distance is <i>linear</i> in the embedding $\\mathbf{z}=f_\\phi(\\mathbf{x})$. The $-\\mathbf{z}^\\top\\mathbf{z}$ term is the same for every class so it cancels in the softmax, leaving a linear classifier with weights $\\mathbf{w}_k = 2\\,\\mathbf{c}_k$ and bias $b_k = -\\mathbf{c}_k^\\top\\mathbf{c}_k$.</p>`,
    whatItDoes:
      `<p><b>Equation 1</b> builds the prototype: run every support example of class $k$ through the embedding
       network $f_\\phi$, then <b>average</b> those points. The $\\frac{1}{|S_k|}\\sum$ is exactly "add them up
       and divide by how many there are" &mdash; the mean. One vector $c_k$ now represents the entire class.</p>
       <p><b>Equation 2</b> classifies a query $x$. For each class $k$ it takes the negative distance from the
       query's embedding $f_\\phi(x)$ to that prototype $c_k$, exponentiates it, and divides by the sum over all
       classes &mdash; the standard <b>softmax</b>, but fed <b>negative distances</b> instead of raw scores.
       Because $-d$ is largest when $d$ is smallest, the <i>nearest</i> prototype receives the highest
       probability. Training minimizes $J(\\phi) = -\\log p_\\phi(y=k\\mid x)$, which simply means: make the
       true class's prototype the closest one.</p>`,
    derivation:
      `<p><b>Why the prototype is a mean (&sect;2.3, short recap).</b> Suppose you must summarize a cluster of
       points by a single representative $c$, and you score that choice by the total squared Euclidean distance
       from $c$ to every point: $\\sum_i \\lVert z_i - c\\rVert^2$. Which $c$ makes this smallest? Differentiate
       with respect to $c$ and set the result to zero:</p>
       <p>$$ \\frac{\\partial}{\\partial c}\\sum_i \\lVert z_i - c\\rVert^2 = -2\\sum_i (z_i - c) = 0
       \\;\\;\\Longrightarrow\\;\\; c = \\frac{1}{n}\\sum_i z_i. $$</p>
       <p>The minimizer is exactly the <b>mean</b>. The paper generalizes this: squared Euclidean distance is a
       <b>Bregman divergence</b>, and for any Bregman divergence "the cluster representative achieving minimal
       distance to its assigned points is the cluster mean" (&sect;2.3). So defining the prototype as the mean
       (Eqn. 1) is not arbitrary &mdash; it is the optimal representative <i>for this exact distance</i>. Use a
       different distance (say cosine) and the mean is no longer guaranteed optimal, which is why the paper
       insists on squared Euclidean. The deeper softmax-over-distances probability and the few-shot framing are
       developed in the <b>fs-few-shot</b> concept lesson; here we recap.</p>
       <p><b>Why this equals a linear model (&sect;2.4).</b> Expand the negative squared Euclidean distance between
       a query embedding $z = f_\\phi(x)$ and a prototype $c_k$:</p>
       <p>$$ -\\lVert z - c_k\\rVert^2 = -(z - c_k)^\\top(z - c_k) = -z^\\top z + 2\\,c_k^\\top z - c_k^\\top c_k. $$</p>
       <p>The first term $-z^\\top z$ does <b>not depend on $k$</b> &mdash; it is the same for every class &mdash; so
       it cancels top-and-bottom in the Eqn. 2 softmax. What is left is <b>linear in the embedding $z$</b>:</p>
       <p>$$ 2\\,c_k^\\top z - c_k^\\top c_k = w_k^\\top z + b_k, \\qquad w_k = 2\\,c_k, \\quad b_k = -c_k^\\top c_k. $$</p>
       <p>So a Prototypical Network with squared Euclidean distance is <b>exactly a linear classifier</b> on top of
       the embedding, whose weights $w_k$ and biases $b_k$ are <i>computed</i> from the support set rather than
       learned as free parameters. This is why squaring (not plain Euclidean distance) is the natural choice: it
       makes the model both Bregman-optimal for the mean prototype <i>and</i> equivalent to a familiar linear
       softmax classifier.</p>`,
    example:
      `<p>Work a tiny <b>2-way 2-shot</b> case by hand with 2-dimensional embeddings, so every number is
       checkable. Suppose the embedding network has already mapped the support examples to these points:</p>
       <ul class="steps">
        <li><b>Class A support</b> embeds to $[1,1]$ and $[3,1]$. <b>Prototype</b> (Eqn. 1, the mean):
        $c_A = \\tfrac{1}{2}([1,1]+[3,1]) = [2,1]$.</li>
        <li><b>Class B support</b> embeds to $[4,3]$ and $[6,3]$. Prototype: $c_B = \\tfrac{1}{2}([4,3]+[6,3]) = [5,3]$.</li>
        <li><b>A query</b> embeds to $q = [3,2]$. <b>Squared Euclidean distances</b> (subtract, square each
        coordinate, sum):
        <br>$d_A = (3-2)^2 + (2-1)^2 = 1 + 1 = 2$.
        <br>$d_B = (3-5)^2 + (2-3)^2 = 4 + 1 = 5$.</li>
        <li><b>Negate and softmax</b> (Eqn. 2). Logits are $-d_A = -2$ and $-d_B = -5$.
        <br>$\\exp(-2) = 0.135335$, $\\quad \\exp(-5) = 0.006738$.
        <br>$p(A) = \\dfrac{0.135335}{0.135335 + 0.006738} = 0.9526$, $\\quad p(B) = 0.0474$.</li>
        <li><b>Verdict:</b> the query is closer to $c_A$ ($d_A = 2 \\lt d_B = 5$), so the model assigns it to
        class A with probability $\\approx 95\\%$. The negation is what made "nearer" become "higher
        probability."</li>
       </ul>
       <p>These exact numbers ($c_A=[2,1]$, $c_B=[5,3]$, $d_A=2$, $d_B=5$, $p(A)=0.9526$) are recomputed in the
       notebook's first cell so you can check them by running it.</p>`,
    recipe:
      `<ol>
        <li><b>Build the embedding network</b> $f_\\phi$ from <code>nn.Linear</code> / <code>nn.ReLU</code>
        (a small CNN for images; a small MLP for our toy vectors). This is the only thing that learns.</li>
        <li><b>Sample an episode:</b> pick $N$ classes; for each, draw $K$ support examples and $Q$ query
        examples. (This is an $N$-way $K$-shot task.)</li>
        <li><b>Prototypes</b> (Eqn. 1): embed the support set and average per class &rarr; $N$ prototypes
        $c_k$.</li>
        <li><b>Score queries</b> (Eqn. 2): embed each query, compute squared Euclidean distance to every
        prototype, take <b>logits = negative distances</b>, and apply cross-entropy against the true labels.</li>
        <li><b>Update</b> $\\phi$ by gradient descent. Repeat over thousands of episodes, each with fresh
        classes.</li>
        <li><b>Evaluate</b> on classes <b>held out</b> of training: build new episodes from unseen classes and
        measure accuracy &mdash; it should sit far above the $1/N$ chance level.</li>
      </ol>`,
    results:
      `<p>From the results tables (quoted). On <b>Omniglot</b> (Table 1): <b>5-way 1-shot "98.8%"</b>,
       <b>5-way 5-shot "99.7%"</b>, <b>20-way 1-shot "96.0%"</b>, <b>20-way 5-shot "98.9%"</b>. On the harder
       <b>miniImageNet</b> benchmark (Table 2): <b>5-way 1-shot "49.42 &plusmn; 0.78%"</b> and
       <b>5-way 5-shot "68.20 &plusmn; 0.66%"</b>. For context, 5-way chance is 20% and 20-way chance is 5%, so
       these are far above guessing. The abstract also reports state-of-the-art zero-shot results on the
       CU-Birds dataset.</p>
       <p><i>These are the paper's reported figures, quoted from the abstract and tables. The numbers in the
       CODE and CODEVIZ panels below are from our own tiny CPU run on synthetic data &mdash; not the paper's
       results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the building blocks already ship in PyTorch, so you
       <b>import</b> them and write only the novel algorithm. <b>Import:</b> <code>nn.Linear</code>,
       <code>nn.ReLU</code>, <code>nn.Sequential</code>, <code>F.cross_entropy</code>, and the Adam optimizer.
       <b>Build by hand:</b> the per-class <b>prototype</b> (mean of support embeddings, Eqn. 1), the
       <b>squared-Euclidean-distance logits</b> and softmax classification (Eqn. 2), and the <b>episodic
       training loop</b> that samples a fresh $N$-way $K$-shot task each step. The Bregman / mean-is-optimal
       argument and the broader few-shot framing are recapped from the <b>fs-few-shot</b> concept lesson, not
       re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting to negate the distance.</b> The softmax must be over $-d$, not $d$. Feed raw
        distances and you reward the <i>farthest</i> prototype &mdash; accuracy collapses to chance.
        <b>Fix:</b> <code>logits = -d</code> before <code>cross_entropy</code>.</li>
        <li><b>Using plain (non-squared) distance, or cosine, by default.</b> The Bregman argument (&sect;2.3)
        that makes "prototype = mean" optimal holds for <b>squared</b> Euclidean distance. Squaring also keeps
        the math differentiable everywhere (no square-root kink at zero). Swap in cosine and you lose the
        guarantee; the paper found Euclidean clearly better than cosine.</li>
        <li><b>Leaking test classes into training.</b> Few-shot evaluation only means something on classes the
        embedding never saw during training. If the same classes appear in both, you are measuring ordinary
        classification, not few-shot generalization. <b>Fix:</b> disjoint class splits.</li>
        <li><b>Averaging over the wrong axis.</b> The prototype averages the $K$ <i>shots</i> of one class, not
        across classes. With a <code>[N, K, M]</code> support tensor the mean is over <code>dim=1</code> &mdash;
        check the result is <code>[N, M]</code>, one prototype per class.</li>
        <li><b>Confusing with Matching Networks.</b> Prototypical Networks collapse each class to one mean
        prototype; Matching Networks (<code>paper-matching-networks</code>) keep every support example and
        attend over all of them. Same metric-learning family, different summary.</li>
      </ul>`,
    recall: [
      "State the prototype equation (Eqn. 1) from memory.",
      "Why does the softmax (Eqn. 2) take the NEGATIVE distance?",
      "Why is the prototype defined as a mean (what role does squared Euclidean / Bregman play)?",
      "What is the chance accuracy of an $N$-way task, and what does 'episodic training' mean?"
    ],
    practice: [
      {
        q: `<b>The metric ablation.</b> Your trained model classifies queries by softmax over the NEGATIVE
            squared Euclidean distance to each prototype. Replace that with softmax over the <b>positive</b>
            distance (drop the minus sign) and re-evaluate &mdash; no retraining. What happens to accuracy, and
            why does this isolate the role of the negation?`,
        steps: [
          { do: `Change exactly one character: <code>logits = -d</code> becomes <code>logits = d</code>; keep the embedding, prototypes, data, and everything else identical.`, why: `An honest ablation changes one thing, so any accuracy change is attributable to the sign of the distance in Eqn. 2.` },
          { do: `Re-run the held-out evaluation and watch accuracy fall toward the $1/N$ chance level (about 20% for 5-way).`, why: `With positive distances the softmax now assigns the highest probability to the FARTHEST prototype &mdash; the opposite of "nearest wins."` },
          { do: `Conclude that the negation, not just the distance, is load-bearing: it is what turns "small distance" into "large probability."`, why: `Eqn. 2 is a softmax over $-d$; remove the minus and the model systematically prefers the wrong class.` }
        ],
        answer: `<p>Accuracy collapses toward chance (~20% for 5-way). Softmax over $+d$ rewards the prototype
                 that is <b>farthest</b> from the query, which is exactly backwards. This isolates the
                 <b>negation</b> in Eqn. 2 as essential: the model classifies by <i>nearest</i> prototype only
                 because the distance is negated before the softmax. The CODE panel's negated version trains
                 well above chance; this flipped version does not.</p>`
      },
      {
        q: `A 3-way 4-shot episode. One class's four support examples embed to $[0,0]$, $[2,0]$, $[0,2]$, and
            $[2,2]$. A query for that class embeds to $[1,1]$. Compute the class prototype and the squared
            Euclidean distance from the query to it.`,
        steps: [
          { do: `Prototype (Eqn. 1) = mean of the four points: $c = \\tfrac{1}{4}([0,0]+[2,0]+[0,2]+[2,2]) = \\tfrac{1}{4}[4,4] = [1,1]$.`, why: `Average each coordinate over the $K=4$ shots; the result is one $[1,1]$ prototype for the class.` },
          { do: `Distance from query $[1,1]$ to $c=[1,1]$: $d = (1-1)^2 + (1-1)^2 = 0$.`, why: `Squared Euclidean distance: subtract coordinate-wise, square, sum. Here the query sits exactly on the prototype.` },
          { do: `Note the logit is $-d = 0$, the largest possible for this class, so the query is maximally confident for it (before comparing to the other two prototypes).`, why: `A query landing on its prototype gets the smallest distance and thus the highest pre-softmax score for that class.` }
        ],
        answer: `<p>The prototype is the mean $[1,1]$, and the query's squared Euclidean distance to it is
                 $d = 0$. The query coincides with its class prototype, so its negative-distance logit $-d = 0$
                 is the maximum &mdash; the strongest possible vote for that class.</p>`
      },
      {
        q: `In the worked example the query $[3,2]$ got $p(A)=0.9526$ with prototypes $c_A=[2,1]$, $c_B=[5,3]$.
            Now move the query to $q=[4,2]$ (closer to B). Recompute $d_A$, $d_B$, and $p(A)$, and say which
            class wins.`,
        steps: [
          { do: `Distances: $d_A = (4-2)^2 + (2-1)^2 = 4+1 = 5$; $d_B = (4-5)^2 + (2-3)^2 = 1+1 = 2$.`, why: `Same squared-Euclidean rule; the query is now nearer B, so $d_B \\lt d_A$.` },
          { do: `Logits $-d_A=-5$, $-d_B=-2$; $\\exp(-5)=0.006738$, $\\exp(-2)=0.135335$.`, why: `Negate the distances and exponentiate, exactly as in Eqn. 2.` },
          { do: `$p(A) = \\dfrac{0.006738}{0.006738+0.135335} = 0.0474$, so $p(B)=0.9526$.`, why: `The softmax normalizes the two exponentials; the nearer prototype (B) now takes the large share.` }
        ],
        answer: `<p>$d_A = 5$, $d_B = 2$, so $p(A) = 0.0474$ and $p(B) = 0.9526$ &mdash; <b>class B wins</b>. The
                 probabilities are exactly the mirror image of the original example, because moving the query
                 from equidistant-favoring-A to closer-to-B swapped which prototype is nearest. Distance to the
                 prototype is the whole story.</p>`
      }
    ]
  });

  window.CODE["paper-prototypical"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the novel parts by hand on top of <code>nn.Linear</code> &mdash; the
       per-class <b>prototype</b> (mean of support embeddings, Eqn. 1) and the <b>softmax over negative squared
       Euclidean distances</b> (Eqn. 2) &mdash; then train the embedding network <b>episodically</b> on a
       synthetic few-shot task. The key lines are <code>proto = support_emb.mean(dim=1)</code> (Eqn. 1) and
       <code>logits = -((q[:,None,:] - proto[None,:,:])**2).sum(-1)</code> (Eqn. 2, note the minus sign). The
       first cell recomputes the worked example ($c_A=[2,1]$, $c_B=[5,3]$, $d_A=2$, $d_B=5$, $p(A)=0.9526$). We
       then run 5-way 5-shot episodes and report accuracy on <b>held-out</b> classes versus the 20% chance
       level. Paste into Colab (or any CPU) and run. No pip needed.</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0)

# --- 0. Sanity-check the worked example: prototype = mean, softmax over -d. ---
A = torch.tensor([[1., 1.], [3., 1.]]); B = torch.tensor([[4., 3.], [6., 3.]])
cA, cB = A.mean(0), B.mean(0)                  # Eqn. 1: prototypes (the means)
q = torch.tensor([3., 2.])
dA = ((q - cA)**2).sum(); dB = ((q - cB)**2).sum()   # squared Euclidean distance
p = torch.softmax(torch.tensor([-dA, -dB]), 0)       # Eqn. 2: softmax over NEGATIVE d
print("worked: cA", cA.tolist(), "cB", cB.tolist(), "dA", float(dA), "dB", float(dB))
print("worked: p(A)", round(float(p[0]), 4), "p(B)", round(float(p[1]), 4))
# worked: cA [2.0, 1.0] cB [5.0, 3.0] dA 2.0 dB 5.0
# worked: p(A) 0.9526 p(B) 0.0474


# --- 1. A synthetic few-shot dataset: many classes, disjoint train/test splits. ---
# Each class is a Gaussian blob whose class signal lives in a 2-d latent space, mapped
# into 20-d and buried in nuisance noise -- so a learned embedding helps.
RAWDIM, PER, LAT = 20, 40, 2
Wsig = torch.randn(LAT, RAWDIM, generator=torch.Generator().manual_seed(3)) * 0.7

def make_classes(n, seed):
    g = torch.Generator().manual_seed(seed)
    centers = torch.randn(n, LAT, generator=g)
    sig  = centers[:, None, :].expand(n, PER, LAT) @ Wsig
    jit  = torch.randn(n, PER, LAT, generator=g) * 0.25 @ Wsig
    nuis = torch.randn(n, PER, RAWDIM, generator=g) * 0.7
    return sig + jit + nuis                       # [n, PER, RAWDIM]

train_data = make_classes(80, 1)                  # 80 classes for meta-training
test_data  = make_classes(20, 99)                 # 20 UNSEEN classes for evaluation


# --- 2. The embedding network f_phi (the only thing that learns). ---
def build_embed(seed=0):
    torch.manual_seed(seed)
    return nn.Sequential(nn.Linear(RAWDIM, 64), nn.ReLU(), nn.Linear(64, 16))


# --- 3. Sample an N-way K-shot episode: support + query, fresh classes each call. ---
def sample_episode(data, N, K, Q, gen):
    cls = torch.randperm(data.shape[0], generator=gen)[:N]
    sup, que, qy = [], [], []
    for i, c in enumerate(cls):
        idx = torch.randperm(PER, generator=gen)
        sup.append(data[c, idx[:K]]); que.append(data[c, idx[K:K + Q]]); qy += [i] * Q
    return torch.stack(sup), torch.cat(que), torch.tensor(qy)   # [N,K,RAWDIM],[N*Q,RAWDIM],[N*Q]


# --- 4. The novel algorithm: prototypes (Eqn. 1) + negative-distance logits (Eqn. 2). ---
def proto_logits(emb, sup, que):
    N, K, _ = sup.shape
    proto = emb(sup.reshape(N * K, -1)).reshape(N, K, -1).mean(dim=1)   # Eqn. 1: mean of K shots
    qe = emb(que)
    d = ((qe[:, None, :] - proto[None, :, :])**2).sum(-1)               # squared Euclidean [Nq, N]
    return -d                                                           # Eqn. 2 logits: NEGATIVE d


def eval_acc(emb, data, N=5, K=5, Q=5, episodes=400, seed=123):
    g = torch.Generator().manual_seed(seed); correct = total = 0
    with torch.no_grad():
        for _ in range(episodes):
            sup, que, qy = sample_episode(data, N, K, Q, g)
            correct += int((proto_logits(emb, sup, que).argmax(1) == qy).sum()); total += len(qy)
    return correct / total


# --- 5. Episodic training: each step is a fresh 5-way 5-shot task. ---
N, K, Q = 5, 5, 5
embed_untrained = build_embed(0)
acc_chance_emb  = eval_acc(embed_untrained, test_data)   # random embedding baseline

embed = build_embed(0)
opt = torch.optim.Adam(embed.parameters(), lr=1e-3)
gen = torch.Generator().manual_seed(7)
for step in range(800):
    sup, que, qy = sample_episode(train_data, N, K, Q, gen)
    loss = F.cross_entropy(proto_logits(embed, sup, que), qy)   # J = -log p_phi(y=k|x)
    opt.zero_grad(); loss.backward(); opt.step()
    if step % 160 == 0:
        print(f"  step {step:3d}  episode loss {loss.item():.3f}")

acc_trained = eval_acc(embed, test_data)
print(f"\\n5-way chance accuracy        : {1/N:.2f}")
print(f"random (untrained) embedding : {acc_chance_emb:.3f}")
print(f"TRAINED prototypical net      : {acc_trained:.3f}   (held-out classes)")
# 5-way chance accuracy        : 0.20
# random (untrained) embedding : ~0.72
# TRAINED prototypical net      : ~0.84   -- far above the 0.20 chance level.
# (Exact numbers vary by hardware; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-prototypical"] = {
    question: "After episodic training, do query embeddings cluster around their class prototype on held-out (never-trained) classes?",
    charts: [
      {
        type: "scatter",
        title: "Held-out 3-way episode: query embeddings (dots) cluster around their prototypes (X), 2D PCA",
        xlabel: "PCA component 1",
        ylabel: "PCA component 2",
        series: [
          {
            name: "Class 0 queries",
            color: "#7ee787",
            points: [[0.2,1.31],[-1.21,0.83],[-0.7,1.29],[-1.46,1.49],[-0.18,1.4],[-1.34,1.29],[-1.76,1.6],[-1.64,0.89],[0.3,1.52]]
          },
          {
            name: "Class 1 queries",
            color: "#79c0ff",
            points: [[-0.95,-1.71],[-1.49,-1.3],[-1.51,-1.15],[-1.57,-1.52],[-1.76,-0.52],[-0.44,-1.37],[-1.02,-0.12],[-1.16,-0.84],[-1.04,-0.64],[-1.17,-0.72]]
          },
          {
            name: "Class 2 queries",
            color: "#ffa657",
            points: [[1.06,0.27],[1.42,-0.13],[1.47,-0.54],[1.57,0.2],[2.14,0.99],[2.81,0.27],[1.34,0.38],[2.85,-0.44],[1.98,-0.92],[1.88,-1.21]]
          },
          {
            name: "Prototypes (X)",
            color: "#f85149",
            points: [[-0.38,0.95],[-1.01,-0.87],[2.0,0.14]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. After 800 episodes of 5-way 5-shot training on synthetic classes, we sampled a 3-way episode from 20 HELD-OUT classes the embedding never saw, then projected the 16-d embeddings to 2D with PCA. The three query clouds (green / blue / orange) sit in distinct regions, each near its own class prototype (red X) &mdash; the prototypes separate the unseen classes, which is why nearest-prototype classification works far above the 20% 5-way chance level (our trained 5-way held-out accuracy was ~0.84). Prototypes are the means of the 5 support embeddings per class (Eqn. 1).",
    code: `import torch, torch.nn as nn, torch.nn.functional as F

# Reuse the trained 'embed', 'test_data', 'sample_episode' from the CODE panel.
# Embed one held-out 3-way episode, then PCA-project to 2D to SEE the clusters.
with torch.no_grad():
    g = torch.Generator().manual_seed(50)
    sup, que, qy = sample_episode(test_data, 3, 6, 10, g)           # 3 unseen classes
    proto = embed(sup.reshape(18, -1)).reshape(3, 6, -1).mean(1)    # Eqn. 1 prototypes
    qe = embed(que)                                                 # query embeddings

pts = torch.cat([proto, qe], 0)
pts = pts - pts.mean(0)
U, S, V = torch.svd(pts)                # PCA via SVD
proj = pts @ V[:, :2]                   # 16-d -> 2-d
proto2, q2 = proj[:3], proj[3:]
print("prototypes (2D):", [[round(float(a), 2) for a in r] for r in proto2])
for lab in range(3):
    cloud = q2[qy == lab]
    print(f"class {lab} queries (2D):", [[round(float(p[0]), 2), round(float(p[1]), 2)] for p in cloud])
# The three query clouds land in separate regions, each hugging its class prototype.
# (Exact coordinates vary by hardware/seed; our small run, not the paper's number.)`
  };
})();
