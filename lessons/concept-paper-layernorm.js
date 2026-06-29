/* Paper lesson — Layer Normalization (Ba, Kiros & Hinton, 2016).
   Grounded from arXiv:1607.06450 (abstract + ar5iv HTML, Section 3, Eq. 3; transform Eq. 5).
   Track A (primitive): build LayerNorm from scratch, verify with torch.allclose vs nn.LayerNorm.
   Contrast with BatchNorm (normalizes across the BATCH per feature) — cross-links dl-batchnorm.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-layernorm". */
(function () {
  window.LESSONS.push({
    id: "paper-layernorm",
    title: "Layer Normalization — Layer Normalization (2016)",
    tagline: "Normalize each training case across its own features (not across the batch), so the layer behaves identically at any batch size — even batch size 1.",
    module: "Papers · Foundations & Optimization",
    track: "primitive",

    paper: {
      authors: "Jimmy Lei Ba, Jamie Ryan Kiros, Geoffrey E. Hinton",
      org: "University of Toronto / Google",
      year: 2016,
      venue: "arXiv preprint (arXiv:1607.06450, stat.ML)",
      citations: "",
      arxiv: "https://arxiv.org/abs/1607.06450",
      code: ""
    },

    conceptLink: "dl-batchnorm",
    partOf: [
      { capstone: "capstone-mini-gpt", step: 4, builds: "LayerNorm from scratch (the normalization inside every Transformer block)" }
    ],
    prereqs: ["dl-batchnorm", "dl-backprop", "pt-nn-module", "pt-autograd"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> A neural network is a stack of layers. Each layer turns the numbers from the
       previous layer into new numbers. To train fast, it helps to <b>normalize</b> those numbers &mdash; rescale
       them so they have a stable center (mean) and spread (standard deviation) at every step. <b>Batch
       Normalization (BN)</b> did this by averaging each feature <i>across the mini-batch</i> (the small group of
       examples processed together in one step). See the <code>dl-batchnorm</code> lesson.</p>
       <p><b>What BN got wrong for some settings.</b> The paper points to two problems (Abstract, Section 1):</p>
       <ul>
         <li><b>BN depends on the batch size.</b> Its statistics are computed over the batch, so with a tiny
         batch they are noisy, and with a batch of <b>one</b> example there is no spread to measure at all. BN
         also has to behave differently at training time (use the batch) versus test time (use stored running
         averages).</li>
         <li><b>BN is awkward for recurrent neural networks (RNNs).</b> An RNN processes a sequence one time
         step at a time, and different sequences have different lengths, so "the batch at step $t$" is not a clean,
         fixed thing to normalize over.</li>
       </ul>`,

    contribution:
      `<p>The paper keeps the <i>idea</i> of normalizing a layer's inputs but changes <b>what you average over</b>.
       Its contributions:</p>
       <ul>
         <li><b>Layer Normalization (LN).</b> For <b>one</b> training case, compute the mean and standard
         deviation across <b>all the hidden units (features) in that layer</b>, and use them to normalize that
         case. The paper calls this "transpos[ing] batch normalization into layer normalization" &mdash; BN
         averages down the batch (per feature); LN averages across the features (per example).</li>
         <li><b>A learned gain and bias ($g$, $b$).</b> After normalizing, multiply by a learned vector $g$ and
         add a learned vector $b$ (one number per feature), so the layer can recover any scale/shift it needs.</li>
         <li><b>Same computation at train and test, any batch size.</b> Because LN never looks at other examples,
         it does the <i>identical</i> thing during training and inference, needs no running statistics, and works
         at <b>batch size 1</b>. It also applies cleanly to RNNs by normalizing separately at each time step.</li>
       </ul>`,

    whyItMattered:
      `<p>Layer Normalization became the normalization of choice wherever the batch is small, variable, or
       sequential. Most importantly, it is the normalization inside <b>every Transformer block</b> &mdash; the
       architecture behind modern large language models &mdash; which is why this paper is step 4 of the
       <code>mini-gpt</code> capstone in this course. Wherever you see "LayerNorm" or "RMSNorm" in a modern model,
       this is the ancestor. The paper reports it "can substantially reduce the training time compared with
       previously published techniques" (Abstract).</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Abstract</b> &mdash; the two complaints about BN (batch-size dependence; hard to use in RNNs) and
         the one-sentence fix.</li>
         <li><b>Section 3, "Layer normalization", and Equation 3</b> &mdash; the mean/standard-deviation taken
         over the $H$ hidden units of a layer. This <i>is</i> the method.</li>
         <li><b>Section 2 / Equation 5</b> &mdash; the per-neuron learned gain $g$ and bias $b$ applied after
         normalizing but before the activation.</li>
         <li><b>Section 3, the sentence on batch size</b> &mdash; LN "does not impose any constraint on the size
         of a mini-batch and it can be used in the pure online regime with batch size 1."</li>
       </ul>
       <p><b>Skim:</b> Section 3.1 (applying LN inside an RNN at each time step) and Section 5 (invariance
       analysis) for intuition. You do not need the per-task hyperparameters in the experiments.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> You will feed the <i>same single example</i> through your LayerNorm once
       as a batch of 8 and once as a batch of <b>1</b>. BatchNorm's output for that example would <i>change</i>
       between the two cases (its statistics depend on the other 7). Will LayerNorm give the <b>same</b> output
       for that example in both cases? Write your guess, then check the <code>allclose</code> in the CODE cell.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write <code>my_layernorm(x, gamma, beta, eps)</code> using raw
       tensors, no <code>nn.LayerNorm</code>. Input <code>x</code> has shape <code>(batch, features)</code>:</p>
       <ul>
         <li>Compute the mean and variance <b>across the feature dimension</b> (the LAST dim, dim&nbsp;-1), one
         pair of numbers <i>per example</i> &mdash; <b>not</b> down the batch.
         <code># TODO: mu = x.mean(-1, keepdim=True); var = x.var(-1, unbiased=False, keepdim=True)</code></li>
         <li>Use the <b>biased</b> variance (divide by $H$, the number of features), to match the paper and
         PyTorch.</li>
         <li>Normalize: <code># TODO: xhat = (x - mu) / sqrt(var + eps)</code>.</li>
         <li>Scale and shift with the learned vectors: <code># TODO: return gamma * xhat + beta</code>.</li>
       </ul>
       <p>There is <b>no</b> train/eval split and <b>no</b> running statistics &mdash; that is the whole point.
       The CODE cell is the full reference, including the <code>torch.allclose</code> check against
       <code>nn.LayerNorm</code> and the batch-size-1 test.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Picture the numbers feeding into one layer for one training case as a vector with $H$ entries &mdash;
       one per hidden unit (feature): $a_1,\\dots,a_H$. Layer Normalization works entirely <b>inside that one
       vector</b>:</p>
       <ol>
         <li><b>Mean over the features.</b> Average the $H$ numbers of this one example: $\\mu^l$.</li>
         <li><b>Standard deviation over the features.</b> Measure how spread out those $H$ numbers are:
         $\\sigma^l$ (the square root of the average squared distance from the mean).</li>
         <li><b>Normalize.</b> Subtract $\\mu^l$ and divide by $\\sigma^l$ (with a tiny $\\epsilon$ added inside
         the square root so we never divide by zero). Now this example's feature vector has mean $0$ and
         standard deviation $\\approx 1$.</li>
         <li><b>Scale and shift.</b> Multiply elementwise by a learned gain vector $g$ and add a learned bias
         vector $b$ (one number per feature, trained by gradient descent). This lets the layer choose the output
         center and spread that work best.</li>
       </ol>
       <p><b>The crucial contrast with BatchNorm.</b> BN slices the data the <i>other way</i>: it fixes one
       feature and averages that feature <b>down the batch</b> (across many examples), giving one statistic per
       feature shared by all examples. LN fixes one example and averages <b>across its features</b>, giving one
       statistic per example shared by all features. So in LN, "all the hidden units in a layer share the same
       normalization terms $\\mu$ and $\\sigma$, but different training cases have different normalization terms"
       (Section 3). Because LN never peeks at the other examples in the batch, it is <b>batch-size independent</b>:
       it does the same thing for a batch of 1, a batch of 1000, at train time and at test time. See
       <code>dl-batchnorm</code> for the BN side of this contrast.</p>`,

    architecture:
      `<p><b>Where the normalization sits.</b> Layer Normalization is not a network of its own &mdash; it is a tiny
       operation dropped <i>inside</i> a layer, between the linear map and the nonlinearity. The data flow through
       one normalized layer is:</p>
       <ol>
         <li><b>Linear map.</b> A weight matrix turns the previous layer's output $h^l$ into the summed inputs
         $a_i^l=(w_i^l)^{\\top}h^l$ &mdash; a vector of $H$ numbers (Eq. 1).</li>
         <li><b>LayerNorm.</b> Compute $\\mu^l,\\sigma^l$ over those $H$ numbers (Eq. 3), normalize, then apply the
         per-feature gain $g$ (length $H$) and bias $b$ (length $H$) (Eq. 5). No statistics cross between examples,
         so there are <b>no running buffers and no train/eval branch</b> &mdash; the parameter count added is just
         $2H$ ($g$ and $b$).</li>
         <li><b>Activation.</b> The nonlinearity $f$ (ReLU, tanh, GELU, ...) follows.</li>
       </ol>
       <p><b>In an RNN.</b> A recurrent cell computes $a^t=W_{hh}h^{t-1}+W_{xh}x^t$ at every time step; LN is
       inserted right there, normalizing $a^t$ with that step's own $\\mu^t,\\sigma^t$ (Eq. 4) before the cell's
       activation. The <b>same</b> $g,b$ are reused across all time steps. This stabilizes the hidden-state
       dynamics that BN cannot easily touch (the batch at step $t$ is ill-defined for variable-length sequences).</p>
       <p><b>In a Transformer.</b> Each Transformer block has two sub-layers &mdash; multi-head self-attention and a
       position-wise feed-forward network &mdash; each wrapped in a residual connection plus a LayerNorm over the
       model dimension $d_{model}$ (the feature axis), applied independently at every sequence position. The
       original Transformer placed LN <i>after</i> the residual add ("post-LN", $\\text{LN}(x+\\text{Sublayer}(x))$);
       most modern large language models move it <i>before</i> the sub-layer ("pre-LN", $x+\\text{Sublayer}(\\text{LN}(x))$)
       for more stable training. Either way the normalization is exactly this paper's Eq. 3 + Eq. 5 over the feature
       axis &mdash; which is why LN, not BN, is the normalization inside every Transformer (step 4 of the
       <code>mini-gpt</code> capstone).</p>`,

    symbols: [
      { sym: "feature / hidden unit", desc: "one slot in a layer's output vector. A layer with $H$ hidden units produces $H$ numbers for each example." },
      { sym: "mini-batch", desc: "the small group of training examples (say 8 or 32) processed together in one gradient-descent step." },
      { sym: "$H$", desc: "the number of hidden units (features) in the layer. LN averages over these $H$ values." },
      { sym: "$l$", desc: "the layer index (superscript). $\\mu^l$ and $\\sigma^l$ are the statistics for layer $l$." },
      { sym: "$a_i$", desc: "the summed input to the $i$-th hidden unit, for one training case (the number before the activation function). $a_i^l$ is the $i$-th of the $H$ values being normalized." },
      { sym: "$w_i^l$", desc: "the weight vector (row $i$ of the weight matrix) of layer $l$. The summed input is $a_i^l=(w_i^l)^{\\top}h^l$ (Eq. 1)." },
      { sym: "$h^l$", desc: "the output vector of layer $l$ (the input to the next linear map). $h_i$ is one of its entries." },
      { sym: "$\\mu^l$", desc: "layer mean: the average of the $H$ values $a_1,\\dots,a_H$ for this one example (Eq. 3). One number per example, shared across all features." },
      { sym: "$\\sigma^l$", desc: "layer standard deviation: the square root of the average squared distance of the $H$ values from $\\mu^l$, for this one example (Eq. 3)." },
      { sym: "$\\epsilon$", desc: "epsilon, a tiny constant (e.g. $10^{-5}$) added inside the square root so we never divide by zero when the values are all equal." },
      { sym: "$g_i$", desc: "the learned gain for feature $i$: one number per feature, multiplied into the normalized value. Trained by gradient descent (Eq. 5)." },
      { sym: "$b_i$", desc: "the learned bias for feature $i$: one number per feature, added after scaling. Trained by gradient descent (Eq. 5)." },
      { sym: "$f$", desc: "the activation (nonlinearity), e.g. ReLU or tanh, applied after the gain/bias. LN normalizes the summed input before $f$." },
      { sym: "$h_i$", desc: "the layer's output for feature $i$: the normalized value scaled by $g_i$, shifted by $b_i$, then passed through the activation $f$." },
      { sym: "$\\mu_i^l,\\,\\sigma_i^l$", desc: "BatchNorm's per-FEATURE mean and standard deviation (note the subscript $i$): for feature $i$, taken over the data distribution / mini-batch (Eq. 2). Contrast LN's $\\mu^l,\\sigma^l$, which have no $i$ because they are per-example over features." },
      { sym: "$\\mathbb{E}_{x\\sim P(x)}$", desc: "expectation (average) over the data distribution $P(x)$ — i.e. averaging across examples. BatchNorm's statistics are such averages; LayerNorm's are not." },
      { sym: "$\\odot$", desc: "elementwise (Hadamard) product: multiply two vectors entry by entry. Used in the RNN form $g/\\sigma^t\\odot(a^t-\\mu^t)$." },
      { sym: "$W_{hh},\\,W_{xh}$", desc: "an RNN's recurrent weight matrix ($W_{hh}$, on the previous hidden state) and input weight matrix ($W_{xh}$, on the current input). Together they form $a^t=W_{hh}h^{t-1}+W_{xh}x^t$." },
      { sym: "$a^t,\\,\\mu^t,\\,\\sigma^t$", desc: "the summed inputs at time step $t$ in an RNN and their per-step mean/standard deviation over the $H$ units (Eq. 4). LN normalizes each step using only that step's own values." },
      { sym: "$x^t,\\,h^{t-1}$", desc: "the input at time step $t$ and the hidden state carried from the previous step $t-1$ in an RNN." },
      { sym: "$d_{model}$", desc: "a Transformer's feature/model dimension — the axis LayerNorm normalizes over at each sequence position." }
    ],

    formula:
      `$$a_i^l=\\big(w_i^l\\big)^{\\top}h^l\\qquad(\\text{Eq. 1: the summed input to unit }i\\text{, before the activation})$$
       <p>Per-sample mean and standard deviation over the $H$ features of <b>one</b> example:</p>
       $$\\mu^l=\\frac{1}{H}\\sum_{i=1}^{H}a_i^l,\\qquad
         \\sigma^l=\\sqrt{\\frac{1}{H}\\sum_{i=1}^{H}\\big(a_i^l-\\mu^l\\big)^2}\\qquad(\\text{Eq. 3: LN statistics, summed over features})$$
       <p>Normalize, then apply the learned per-feature gain $g_i$ and bias $b_i$ and the activation $f$:</p>
       $$h_i=f\\!\\left(\\frac{g_i}{\\sigma^l}\\,\\big(a_i-\\mu^l\\big)+b_i\\right)\\qquad(\\text{Eq. 5: scaled, shifted, normalized output})$$
       <p><b>Contrast &mdash; Batch Normalization</b> uses the <i>same</i> affine form but the mean and standard
       deviation are taken <b>per feature over the data distribution / mini-batch</b>, not over the features:</p>
       $$\\bar a_i^l=\\frac{g_i}{\\sigma_i^l}\\big(a_i^l-\\mu_i^l\\big),\\qquad
         \\mu_i^l=\\mathbb{E}_{x\\sim P(x)}\\!\\big[a_i^l\\big],\\quad
         \\sigma_i^l=\\sqrt{\\mathbb{E}_{x\\sim P(x)}\\!\\big[(a_i^l-\\mu_i^l)^2\\big]}\\qquad(\\text{Eq. 2: BatchNorm})$$
       <p>The subscript $i$ on BN's $\\mu_i^l,\\sigma_i^l$ (one per feature, expectation over examples) versus the
       <i>absent</i> $i$ on LN's $\\mu^l,\\sigma^l$ (one per example, sum over features) is the entire difference:
       LN normalizes <b>over features per example</b>, BN normalizes <b>over the batch per feature</b>.</p>
       <p><b>Inside an RNN</b> (Section 3.1), with recurrent input $a^t=W_{hh}h^{t-1}+W_{xh}x^t$, LN normalizes
       that vector at <b>each time step</b> using the step's own $H$ summed inputs ($\\odot$ is elementwise):</p>
       $$h^t=f\\!\\left[\\frac{g}{\\sigma^t}\\odot\\big(a^t-\\mu^t\\big)+b\\right],\\quad
         \\mu^t=\\frac{1}{H}\\sum_{i=1}^{H}a_i^t,\\quad
         \\sigma^t=\\sqrt{\\frac{1}{H}\\sum_{i=1}^{H}\\big(a_i^t-\\mu^t\\big)^2}\\qquad(\\text{Eq. 4: LN inside an RNN})$$`,

    whatItDoes:
      `<p><b>Eq. 1</b> is just the ordinary layer: each unit's pre-activation $a_i^l$ is a weighted sum of the
       previous layer's outputs. <b>Eq. 3</b> measures the center ($\\mu^l$) and spread ($\\sigma^l$) of the $H$
       feature values of a <b>single example</b> &mdash; the sum runs over the features $i=1\\dots H$, <b>not</b>
       over the batch. <b>Eq. 5</b> then re-centers and re-scales each value to mean $0$ / standard deviation
       $\\approx 1$, multiplies by the learned gain $g_i$, adds the learned bias $b_i$, and applies the activation
       $f$. Because $\\mu^l,\\sigma^l$ come only from this example's own features, the result is identical no matter
       how many other examples are in the batch &mdash; including none (batch size 1). (Section 3.)</p>
       <p><b>Eq. 2</b> is the BatchNorm it is contrasted against: identical affine $g/\\sigma\\cdot(a-\\mu)+b$, but
       its $\\mu_i^l,\\sigma_i^l$ are <i>per feature</i>, averaged over the data distribution / mini-batch (the
       expectation $\\mathbb{E}_{x\\sim P(x)}$). That is why BN's statistics depend on the batch and must be
       estimated by running averages at test time, while LN's do not. <b>Eq. 4</b> shows LN inside an RNN:
       at each time step it normalizes that step's summed inputs $a^t$ with the step's own $\\mu^t,\\sigma^t$,
       reusing the same $g,b$ across all steps &mdash; so the normalization is well-defined for sequences of any
       length. (Section 3.1.)</p>`,

    derivation:
      `<p>The mechanics of <i>why</i> normalizing the pre-activations stabilizes training &mdash; and the gradient
       flowing back through $\\mu$, $\\sigma$, the normalized value, and the gain/bias &mdash; is the same
       normalization machinery derived in the <code>dl-batchnorm</code> concept lesson; only the <b>axis</b> of
       the average changes (across features here, down the batch there). Recap of the key idea: holding each
       example's pre-activation vector at mean 0 / standard deviation 1 before the learned $g,b$ keeps the scale
       of the signal stable from step to step, so a larger learning rate stays well-behaved. See that lesson for
       the full backward pass; here the same derivative applies with the sum index running over the $H$ features
       instead of the $m$ batch examples.</p>`,

    example:
      `<p>LayerNorm one example with $H=4$ features, $a=[2,4,4,6]$, learned gain $g=2$ and bias $b=1$ (the same
       for every feature here), $\\epsilon$ tiny enough to ignore. First the statistics over the four features:</p>
       <ul class="steps">
         <li><b>Mean over the features.</b> $\\mu=\\frac{1}{4}(2+4+4+6)=\\frac{16}{4}=4$.</li>
         <li><b>Variance over the features</b> (biased, divide by $H=4$).
         $\\sigma^2=\\frac{1}{4}\\big((2-4)^2+(4-4)^2+(4-4)^2+(6-4)^2\\big)=\\frac{4+0+0+4}{4}=\\frac{8}{4}=2$.</li>
         <li><b>Standard deviation.</b> $\\sigma=\\sqrt{2}\\approx 1.4142$.</li>
       </ul>
       <p>Now apply $y_i=g\\cdot\\frac{a_i-\\mu}{\\sigma}+b$ feature by feature &mdash; the per-feature ledger:</p>
       <table class="extable">
         <caption>Each feature: center by $\\mu=4$, divide by $\\sigma\\approx1.4142$, then $\\times g{=}2$ and $+b{=}1$.</caption>
         <thead><tr><th>feature $a_i$</th><th class="num">$a_i-\\mu$</th><th class="num">$\\hat{x}_i=(a_i-\\mu)/\\sigma$</th><th class="num">$y_i=2\\hat{x}_i+1$</th></tr></thead>
         <tbody>
           <tr><td class="row-h">2</td><td class="num">$-2$</td><td class="num">$-1.4142$</td><td class="num">$-1.8284$</td></tr>
           <tr><td class="row-h">4</td><td class="num">$0$</td><td class="num">$0$</td><td class="num">$1$</td></tr>
           <tr><td class="row-h">4</td><td class="num">$0$</td><td class="num">$0$</td><td class="num">$1$</td></tr>
           <tr><td class="row-h">6</td><td class="num">$+2$</td><td class="num">$1.4142$</td><td class="num">$3.8284$</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li><b>Normalized vector</b> (mean $0$, std $\\approx1$): $\\hat{x}=[-1.4142,\\,0,\\,0,\\,1.4142]$.</li>
         <li><b>Output</b> after gain/bias: $y=2\\cdot[-1.4142,0,0,1.4142]+1=[-1.8284,\\;1,\\;1,\\;3.8284]$.</li>
       </ul>
       <p>Every number came from the <b>four features of this one example</b> &mdash; no other example entered the
       calculation, which is exactly why the answer is identical at any batch size. The CODE cell recomputes these
       exact numbers and checks them against <code>nn.LayerNorm</code>.</p>`,

    recipe:
      `<p><b>Layer Normalization as numbered steps</b> (input is one example's feature vector of length $H$):</p>
       <ol>
         <li>Compute the mean $\\mu$ over the feature dimension (the last axis), one value per example.</li>
         <li>Compute the variance over the same axis (biased: divide by $H$); take its square root for $\\sigma$.</li>
         <li>Normalize: $\\hat{x}_i=(a_i-\\mu)/\\sqrt{\\sigma^2+\\epsilon}$.</li>
         <li>Scale and shift: $y_i=g_i\\,\\hat{x}_i+b_i$ (then the activation $f$, if any, comes next in the net).</li>
         <li>Do the <b>same</b> thing at train and test time &mdash; no running statistics, any batch size.</li>
       </ol>`,

    results:
      `<p>Quoted from the Abstract: layer normalization "performs exactly the same computation at training and
       test times," is "straightforward to apply to recurrent neural networks," is "very effective at stabilizing
       the hidden state dynamics in recurrent networks," and "can substantially reduce the training time compared
       with previously published techniques." (Source: arXiv:1607.06450 abstract.) Headline speed/accuracy numbers
       from the experiments are omitted here to avoid misquoting; the numbers in our CODEVIZ are our own small run.</p>`,

    evaluation:
      `<p><b>What "working" means here.</b> LayerNorm is a primitive, not a model &mdash; so the metric is not
       accuracy, it is <b>numerical agreement with the reference</b>. Your <code>my_layernorm</code> is correct
       iff <code>torch.allclose(my_layernorm(x, g, b), nn.LayerNorm(H)(x), atol=1e-6)</code> is <code>True</code>.
       The "no-skill baseline" is the identity map: a do-nothing LayerNorm that returns its input must FAIL this
       check (if it passes, your input was already normalized by accident &mdash; use random $x$ with non-trivial
       $g,b$).</p>
       <ul>
         <li><b>Sanity checks before the allclose.</b> (1) <b>Shapes:</b> output shape equals input shape exactly.
         (2) <b>Statistics of the normalized value</b> (before $g,b$): each row's mean $\\approx 0$ and biased
         standard deviation $\\approx 1$ &mdash; check <code>xhat.mean(-1)</code> is $\\approx 0$ and
         <code>xhat.var(-1, unbiased=False)</code> is $\\approx 1$ for every row. (3) <b>Known-answer unit test:</b>
         feed <code>[2,4,4,6]</code> with $g{=}2,b{=}1$ and confirm $\\approx[-1.828,1,1,3.828]$ (the worked
         example). (4) <b>Constant-row test:</b> a row of all-equal values must NOT produce NaN &mdash; that
         verifies the $\\epsilon$ inside the square root is wired in.</li>
         <li><b>The batch-size-independence test (this paper's whole claim).</b> Run the same example alone (batch
         1) and inside a batch of 8; the output for that example must be <b>bit-for-bit identical</b>
         (<code>allclose</code>). This is the property the abstract promises: "exactly the same computation at
         training and test times," any batch size.</li>
         <li><b>Expected range.</b> A correct build matches <code>nn.LayerNorm</code> to floating-point tolerance
         (<code>atol=1e-6</code>); there is no "close enough." If allclose is <code>False</code> by more than
         $\\sim10^{-6}$ it is a <b>bug</b>, not tuning &mdash; this paper reports qualitative claims (Abstract,
         arXiv:1607.06450), not a single accuracy number to hit.</li>
         <li><b>Ablation &mdash; prove the central idea earns its keep.</b> The central idea is <i>which axis you
         reduce over</i>. Switch the reduction from the feature axis (dim&nbsp;-1) to the batch axis (dim&nbsp;0)
         and the batch-size-independence test must <b>break</b>: the example's output now shifts when you change
         the batch (you have turned LN into BN). If flipping the axis changes nothing, you were never reducing
         over features in the first place. A second ablation: drop $g,b$ (force $g{=}1,b{=}0$) &mdash; the
         normalized statistics (mean 0, std 1) must still hold; only the learned rescale is gone.</li>
         <li><b>Failure signals &amp; what they mean.</b> <b>allclose False at batch 8 but the per-row mean/std
         look right</b> &rarr; biased-vs-unbiased variance mismatch (use <code>unbiased=False</code>, divide by
         $H$) or wrong $\\epsilon$. <b>allclose passes at batch 8 but the batch-1 test differs</b> &rarr; you are
         reducing over the wrong axis (the BN bug &mdash; the #1 mistake in <code>pitfalls</code>). <b>NaN
         output</b> &rarr; missing $\\epsilon$ on a constant row, or $\\sqrt{\\text{negative}}$ from a sign error.
         <b>gain/bias shape error</b> &rarr; <code>normalized_shape</code> does not match the last dim $H$. The
         GREEN-bars-identical, RED-bars-divergent picture in the CODEVIZ is exactly what a correct LN vs the BN
         failure mode looks like.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> PyTorch ships this as <code>nn.LayerNorm</code> in one line. Here you
       <b>build it from scratch</b> with raw tensors: mean/variance <i>across the features</i>, normalize, scale
       by $g$, shift by $b$. There is no train/eval branch and no running buffers &mdash; LN is the same
       everywhere. The payoff is the <code>torch.allclose(my_ln(x), nn.LayerNorm(...)(x))</code> check, run at
       batch size 8 <i>and</i> batch size 1, proving (a) your formula is identical to PyTorch's and (b) the
       output for an example does not depend on the batch it sits in.</p>`,

    pitfalls:
      `<ul>
         <li><b>Wrong axis &mdash; the #1 mistake.</b> LN averages <b>across the features</b> (the last
         dimension), one statistic per example. BN averages <b>down the batch</b> (dim 0), one statistic per
         feature. Reducing over the wrong axis silently turns one into the other and the allclose fails. This is
         the single most important difference to keep straight versus <code>dl-batchnorm</code>.</li>
         <li><b>Biased variance.</b> LN (and PyTorch) normalize with the <b>biased</b> variance (divide by $H$,
         not $H-1$). Use <code>unbiased=False</code> or the allclose drifts.</li>
         <li><b>Forgetting $\\epsilon$.</b> If an example's features are all equal, $\\sigma=0$; the $\\epsilon$
         inside the square root prevents dividing by zero. Match PyTorch's default $10^{-5}$.</li>
         <li><b>Adding a train/eval split.</b> LN needs none &mdash; do not add running statistics or a
         <code>model.eval()</code> branch. Doing so is copying BN's machinery where it does not belong.</li>
         <li><b>normalized_shape.</b> <code>nn.LayerNorm(H)</code> normalizes over the last $H$ entries. If your
         tensor's last dimension is not $H$, or you normalize over the wrong number of trailing dims, the gain/bias
         shapes will not line up.</li>
       </ul>`,

    recall: [
      "Write the LN statistics from memory: $\\mu=\\frac{1}{H}\\sum_i a_i$ and $\\sigma=\\sqrt{\\frac{1}{H}\\sum_i (a_i-\\mu)^2}$ — note the sum runs over features, not the batch.",
      "In one sentence: what axis does LayerNorm average over, and how is that different from BatchNorm?",
      "Why does LayerNorm work at batch size 1 while BatchNorm struggles?",
      "Why does LayerNorm need no separate train/eval behavior and no running statistics?",
      "What are $g$ and $b$, and why keep them after normalizing?"
    ],

    practice: [
      {
        q: `LayerNorm the single feature vector [1, 3, 5, 7] (H=4), then apply gain $g=2$, bias $b=0$. (Ignore $\\epsilon$.)`,
        steps: [
          { do: `Mean over the 4 features: $\\mu=(1+3+5+7)/4=4$.`, why: `Average across this example's own features.` },
          { do: `Variance: $\\sigma^2=((1-4)^2+(3-4)^2+(5-4)^2+(7-4)^2)/4=(9+1+1+9)/4=5$; $\\sigma=\\sqrt5\\approx2.236$.`, why: `Spread over the features; biased (divide by $H=4$).` },
          { do: `Normalize: $[(1-4)/2.236,\\,(3-4)/2.236,\\,(5-4)/2.236,\\,(7-4)/2.236]=[-1.342,-0.447,0.447,1.342]$.`, why: `Mean 0, standard deviation ~1.` },
          { do: `Scale/shift: $2\\cdot[-1.342,-0.447,0.447,1.342]+0=[-2.683,-0.894,0.894,2.683]$.`, why: `Learned gain stretches; bias 0 leaves the center at 0.` }
        ],
        answer: `$\\hat{x}=[-1.342,-0.447,0.447,1.342]$, output $=[-2.683,-0.894,0.894,2.683]$. Only the 4 numbers of this one example were used — no other example entered the calculation, which is exactly why the answer is the same at any batch size.`
      },
      {
        q: `Ablation / contrast: take a batch of two examples and switch the normalization axis from "across features" (LayerNorm) to "down the batch" (BatchNorm). What changes?`,
        steps: [
          { do: `Use the batch [[2,4,4,6],[1,3,5,7]]. LayerNorm normalizes EACH ROW using that row's own mean/std.`, why: `Per-example statistics — row 1 uses $\\mu=4,\\sigma=\\sqrt2$; row 2 uses $\\mu=4,\\sigma=\\sqrt5$.` },
          { do: `Now switch to averaging down each COLUMN (BatchNorm): feature 0 over both examples is [2,1], mean 1.5; etc.`, why: `Per-feature statistics shared across the two examples.` },
          { do: `Observe: under LN, removing or adding a row does not change another row's output; under BN it does.`, why: `LN's statistics are independent of the rest of the batch; BN's are not.` }
        ],
        answer: `Switching the axis changes which numbers are pooled. LayerNorm pools across the 4 features within each example (output of a row is unchanged if you drop the other row); BatchNorm pools each feature across the 2 examples (output of a row depends on the other row). This is why LN is batch-size independent and BN is not — the core contrast with $dl\\text{-}batchnorm$.`
      },
      {
        q: `Why does LayerNorm need no train/eval distinction while BatchNorm does?`,
        steps: [
          { do: `Recall BN at test time may see one example, so it cannot compute a batch mean — it falls back to running statistics gathered during training.`, why: `BN's statistics require a batch.` },
          { do: `Note LN's statistics come from a single example's own features, available identically at train and test.`, why: `Nothing depends on the batch, so nothing needs to be stored or swapped.` }
        ],
        answer: `LayerNorm computes $\\mu,\\sigma$ from one example's features, which is exactly the same operation whether you are training on a big batch or serving a single request. So it performs "exactly the same computation at training and test times" (abstract) and needs no running averages and no eval-mode branch — unlike BatchNorm.`
      }
    ]
  });

  window.CODE["paper-layernorm"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build LayerNorm from scratch with raw tensors: mean/variance ACROSS THE FEATURES (last dim), normalize, ` +
      `scale by gain g and shift by bias b. No train/eval split, no running stats. Then prove it is identical ` +
      `to nn.LayerNorm with torch.allclose — at batch size 8 AND batch size 1 (showing the output for an ` +
      `example does not depend on the rest of the batch). Finally recompute the [2,4,4,6] worked example. ` +
      `Runs in Colab (torch is preinstalled).`,
    code: `import torch, torch.nn as nn

torch.manual_seed(0)

def my_layernorm(x, gamma, beta, eps=1e-5):
    """LayerNorm from scratch — Eq. 3 + transform (Eq. 5) of Ba, Kiros & Hinton (2016).
       x: (batch, features). Statistics are taken ACROSS THE FEATURES (dim -1),
       one (mu, sigma) per example — NOT down the batch like BatchNorm."""
    mu  = x.mean(dim=-1, keepdim=True)                  # mean over the H features (Eq. 3)
    var = x.var(dim=-1, unbiased=False, keepdim=True)   # biased variance, /H (Eq. 3)
    xhat = (x - mu) / torch.sqrt(var + eps)             # normalize -> mean 0, std ~1
    return gamma * xhat + beta                          # learned gain & bias (Eq. 5)

# ---- THE ORACLE: my LN must equal nn.LayerNorm ----
H = 5
x = torch.randn(8, H)
ref = nn.LayerNorm(H)                    # default eps=1e-5, elementwise gain=1, bias=0
with torch.no_grad():                    # give g, b non-trivial values to make the test real
    ref.weight.normal_(); ref.bias.normal_()

mine = my_layernorm(x, ref.weight, ref.bias)
ok = torch.allclose(mine, ref(x), atol=1e-6)
print("allclose vs nn.LayerNorm (batch 8):", ok)        # expect True

# ---- batch-size INDEPENDENCE: same example, batch of 1 ----
one = x[:1]                              # a single example, shape (1, H)
ok1 = torch.allclose(my_layernorm(one, ref.weight, ref.bias),
                     ref(one), atol=1e-6)
print("allclose vs nn.LayerNorm (batch 1):", ok1)       # expect True
same = torch.allclose(my_layernorm(one, ref.weight, ref.bias)[0],
                      mine[0], atol=1e-6)
print("same example's output is identical at batch 1 vs batch 8:", same)  # expect True
# (BatchNorm would FAIL this last line — its output for an example depends on the batch.)

# ---- recompute the worked example: features [2,4,4,6], g=2, b=1 ----
xe = torch.tensor([[2., 4., 4., 6.]])
g  = torch.full((4,), 2.0); b = torch.full((4,), 1.0)
print("worked example y:", my_layernorm(xe, g, b).squeeze().tolist())  # ~ [-1.828, 1.0, 1.0, 3.828]

# ---- drop it into a 2-layer net (LN goes between linear and activation) ----
net = nn.Sequential(nn.Linear(H, 16), nn.LayerNorm(16), nn.ReLU(), nn.Linear(16, 2))
print("net output shape:", net(torch.randn(3, H)).shape)  # torch.Size([3, 2])`
  };

  window.CODEVIZ["paper-layernorm"] = {
    question: "Feed the SAME example through normalization once inside a batch of 8 and once alone (batch of 1). LayerNorm uses only that example's own features — does its output stay identical, where BatchNorm's would shift?",
    charts: [
      {
        type: "bar",
        title: "Output for ONE fixed example: LayerNorm vs BatchNorm, computed in a batch of 8 then alone (batch of 1)",
        xlabel: "feature index of the example",
        ylabel: "normalized output value",
        series: [
          {
            name: "LayerNorm — in batch of 8",
            color: "#7ee787",
            points: [[0,-1.3416],[1,-0.4472],[2,0.4472],[3,1.3416]]
          },
          {
            name: "LayerNorm — alone (batch 1)",
            color: "#2ea043",
            points: [[0,-1.3416],[1,-0.4472],[2,0.4472],[3,1.3416]]
          },
          {
            name: "BatchNorm — in batch of 8",
            color: "#ff7b72",
            points: [[0,0.8737],[1,1.1126],[2,1.7266],[3,1.9810]]
          },
          {
            name: "BatchNorm — alone (batch 1)",
            color: "#f85149",
            points: [[0,0.0],[1,0.0],[2,0.0],[3,0.0]]
          }
        ]
      }
    ],
    caption: "Our small-scale run (numpy, seed 0), not the paper's reported numbers. One fixed example with feature vector [1,3,5,7] is normalized two ways. The two GREEN bars (LayerNorm in a batch of 8 vs alone) are EXACTLY equal — LN uses only this example's own 4 features, so the batch is irrelevant. The two RED bars differ wildly: BatchNorm normalizes each feature down the batch, so in a batch of 8 the output depends on the other 7 examples, and at batch size 1 there is no spread to divide by, collapsing every feature to its bias (0 here). This is the paper's central claim: LayerNorm is batch-size independent; BatchNorm is not.",
    code: `import numpy as np
rng = np.random.default_rng(0)

H = 4
# a batch of 8 examples; example index 0 is our fixed [1,3,5,7]
batch = rng.normal(0, 3, (8, H))
batch[0] = [1., 3., 5., 7.]
eps = 1e-5

# --- LayerNorm: normalize ACROSS FEATURES (axis=1), per example ---
def layernorm(x):
    mu = x.mean(axis=1, keepdims=True)
    var = x.var(axis=1, keepdims=True)          # biased, /H
    return (x - mu) / np.sqrt(var + eps)

ln_in_batch = layernorm(batch)[0]               # example 0 inside the batch of 8
ln_alone    = layernorm(batch[:1])[0]           # example 0 normalized alone (batch 1)
print("LayerNorm in batch:", np.round(ln_in_batch, 4))
print("LayerNorm alone   :", np.round(ln_alone, 4))
print("identical?", np.allclose(ln_in_batch, ln_alone))   # True

# --- BatchNorm: normalize DOWN THE BATCH (axis=0), per feature ---
def batchnorm(x):
    mu = x.mean(axis=0, keepdims=True)
    var = x.var(axis=0, keepdims=True)          # biased, /N
    return (x - mu) / np.sqrt(var + eps)

bn_in_batch = batchnorm(batch)[0]               # example 0 inside the batch of 8
bn_alone    = batchnorm(batch[:1])[0]           # batch of 1 -> variance 0 -> all zeros
print("BatchNorm in batch:", np.round(bn_in_batch, 4))
print("BatchNorm alone   :", np.round(bn_alone, 4))         # ~[0,0,0,0]
print("identical?", np.allclose(bn_in_batch, bn_alone))    # False`
  };
})();
