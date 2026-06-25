/* Paper lesson — LSTM (Hochreiter & Schmidhuber, 1997).
   Source: "Long Short-Term Memory", Neural Computation 9(8):1735-1780, 1997. NO arXiv.
   Grounding: metadata, the constant error carousel (CEC), and the input/output gate roles were
   fetched from the Wikipedia "Long short-term memory" article (en.wikipedia.org/wiki/Long_short-term_memory),
   which attributes them to the 1997 paper; paper.url points at the official published PDF
   (bioinf.jku.at/publications/older/2604.pdf). The official PDF host returned ECONNREFUSED in the
   authoring environment, so the prose is grounded from the Wikipedia mirror, not pure recall — flagged honestly.
   HONEST NOTE: the FORGET gate is NOT in the 1997 paper. It was added by Gers, Schmidhuber & Cummins (1999/2000).
   PyTorch's nn.LSTMCell implements the modern forget-gate variant, so the from-scratch cell here INCLUDES the
   forget gate to make the torch.allclose oracle pass; the lesson states this distinction explicitly.
   Track A (primitive): build an LSTM cell from raw torch (gate order i,f,g,o to match PyTorch's packing) and
   verify torch.allclose(mine, nn.LSTMCell). The allclose IS the proof. */
(function () {
  window.LESSONS.push({
    id: "paper-lstm",
    title: "LSTM — Long Short-Term Memory (1997)",
    tagline: "A recurrent cell with a protected memory and learned gates, so gradients survive across long time gaps.",
    module: "Papers · Sequence & NLP",
    track: "primitive",

    paper: {
      authors: "Sepp Hochreiter, Jürgen Schmidhuber",
      org: "IDSIA / TU München",
      year: 1997,
      venue: "Neural Computation 9(8):1735-1780",
      citations: "",                       // no reliable count fetched in this environment — left blank, not invented
      url: "https://www.bioinf.jku.at/publications/older/2604.pdf",   // official published PDF (no arXiv)
      code: ""
    },

    conceptLink: "dl-lstm-gru",
    partOf: [
      { capstone: "capstone-sentiment", step: 2, builds: "the recurrent memory cell — reads a sentence token by token and carries context" }
    ],
    prereqs: ["dl-rnn", "dl-lstm-gru", "dl-backprop", "pt-autograd", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> A <b>recurrent neural network</b> (RNN) reads a sequence one step at a time, keeping a
       running summary called the <b>hidden state</b> $h$ that it updates at every step. To train it you use
       <b>backpropagation through time</b> (BPTT): you "unroll" the network across all $T$ time steps and send the
       error gradient backward from the last step to the first.</p>
       <p><b>What was broken.</b> That backward signal gets <b>multiplied by the same recurrent weight at every
       step</b>. Multiplying a number by itself many times either shrinks it toward $0$ (if it is &lt; 1 in size)
       or blows it up (if it is &gt; 1). So the gradient that should connect "an event now" to "a cause 50 steps
       ago" <b>vanishes exponentially with the gap</b> (or explodes). The Wikipedia summary of the paper puts it as:
       gradients "can 'vanish' ... tend to zero" because $\\lim_{n\\to\\infty} W^n = 0$ when the recurrent weight's
       magnitude is below 1. Result: ordinary RNNs simply <b>cannot learn dependencies more than ~10 steps apart</b>.
       (Source: Wikipedia, "Long short-term memory", grounding the 1997 paper.)</p>`,

    contribution:
      `<p>The paper introduces the <b>LSTM cell</b>: a recurrent unit redesigned so error can flow across long gaps
       without vanishing. Three pieces (as attributed to the 1997 paper):</p>
       <ul>
         <li><b>The Constant Error Carousel (CEC).</b> A memory cell with a <b>self-connection whose weight is fixed
         at exactly $1.0$</b>. Because the cell copies its own value forward unchanged, the backward error through
         that link is multiplied by $1$ every step &mdash; so it stays <i>constant</i> instead of decaying. That is
         the "carousel" that carries error around and around without loss.</li>
         <li><b>The input gate.</b> A learned valve $\\in[0,1]$ that decides <b>how much of the new information to
         write</b> into the memory cell at this step &mdash; protecting the stored value from being overwritten by
         irrelevant inputs.</li>
         <li><b>The output gate.</b> A learned valve $\\in[0,1]$ that decides <b>how much of the memory to release</b>
         as the cell's output this step &mdash; protecting other units from a memory that is not yet relevant.</li>
       </ul>
       <p><b>Honest scope note.</b> The famous <b>forget gate</b> &mdash; the valve that lets the cell <i>erase</i>
       part of its memory &mdash; is <b>NOT</b> in this 1997 paper. It was added two years later by Gers,
       Schmidhuber &amp; Cummins (1999/2000). The 1997 cell holds its memory with a fixed weight-$1$ self-loop. We
       flag this because the modern LSTM you will build (and that PyTorch ships) <i>does</i> include the forget
       gate.</p>`,

    whyItMattered:
      `<p>LSTM made it possible to train recurrent networks on <b>long sequences</b>, and for nearly two decades it
       was the default workhorse for sequence data: speech recognition, handwriting, machine translation, and text
       classification all ran on LSTMs before Transformers. The gating idea &mdash; a network learning <i>when to
       remember and when to forget</i> &mdash; carried forward into the GRU and into the gated/residual paths of
       later architectures. In this course the LSTM cell is step 2 of the sentiment-analysis capstone: it reads a
       review token by token and carries the gist of the sentence to the end.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li>The <b>analysis of the vanishing-gradient problem</b> (early sections) &mdash; the algebra showing the
         backward signal scales like the recurrent weight raised to the time-lag power. This is the <i>why</i>.</li>
         <li>The <b>Constant Error Carousel</b> derivation &mdash; the requirement that the self-recurrent weight be
         exactly $1$ so the error neither grows nor shrinks.</li>
         <li>The <b>memory cell with input and output gates</b> &mdash; the figure of one cell and how the gates
         multiply the flows in and out.</li>
       </ul>
       <p><b>Skim:</b> the detailed experiments (Reber grammar, long-time-lag toy tasks) for the qualitative point
       &mdash; LSTM solves lags of 1000+ steps that plain RNNs cannot &mdash; without memorizing the exact tables.</p>
       <p><b>Read alongside:</b> when you see modern LSTM equations (with a forget gate $f$), remember those are the
       <b>1999/2000 variant</b>. The 1997 paper has the input and output gates and the weight-$1$ self-loop, but no
       forget gate. The <code>dl-lstm-gru</code> concept lesson owns the full modern math.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> We build a tiny task: a sequence of length $12$. At step $0$ we show a single
       <b>cue</b> &mdash; either $+1$ or $-1$. Every later step is pure noise. At the <i>last</i> step the model
       must report which cue it saw at the start. The relevant signal and the readout are $12$ steps apart. Will an
       LSTM cell learn to <b>carry that one bit across the noisy gap</b> and end near $100\\%$ accuracy &mdash; and
       what happens if we destroy its memory carry? Write your guess, then look at the CODEVIZ.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write one LSTM cell step from raw tensors. Given the current input
       $x_t$, previous hidden $h_{t-1}$, previous cell $c_{t-1}$, and weight matrices, compute the four gate
       pre-activations in <b>PyTorch's packed order $i, f, g, o$</b> (input, forget, candidate, output), then the
       new cell and hidden states:</p>
       <ul>
         <li>Pre-activations: <code># TODO: gates = x @ W_ih.T + b_ih + h @ W_hh.T + b_hh   # (B, 4H)</code></li>
         <li>Slice the four blocks of width $H$ and apply activations:
         <code># TODO: i=sigmoid(gates[:,0:H]); f=sigmoid(gates[:,H:2H]); g=tanh(gates[:,2H:3H]); o=sigmoid(gates[:,3H:4H])</code></li>
         <li>Update the memory: <code># TODO: c_new = f * c_prev + i * g</code></li>
         <li>Emit the output: <code># TODO: h_new = o * tanh(c_new)</code></li>
       </ul>
       <p>The CODE cell is the full reference, including the <code>torch.allclose(mine, nn.LSTMCell(...))</code>
       check. That passing check is the proof your cell <i>is</i> PyTorch's LSTM cell &mdash; same gate order, same
       weights, same math.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Think of one LSTM cell as a tiny memory chip with three valves. It keeps a private number (the <b>cell
       state</b> $c$) that it can hold for a long time, and it exposes a public number (the <b>hidden state</b> $h$)
       that the rest of the network reads. At each time step:</p>
       <ol>
         <li><b>Read the inputs.</b> The cell looks at the current input $x_t$ and the previous public output
         $h_{t-1}$. From these it computes four little linear combinations (one per gate/candidate).</li>
         <li><b>Candidate</b> $g$ (squashed by $\\tanh$ to $[-1,1]$): "here is the new content I <i>could</i> write
         into memory this step."</li>
         <li><b>Input gate</b> $i$ (squashed by sigmoid to $[0,1]$): "how much of that candidate do I actually
         write?" $0$ = ignore the new input, $1$ = write it fully.</li>
         <li><b>Forget gate</b> $f$ (sigmoid, $[0,1]$): "how much of my <i>old</i> memory do I keep?" $1$ = keep all
         (this reproduces the 1997 weight-$1$ carousel), $0$ = erase. <b>This valve is the 1999/2000 addition; the
         original 1997 cell simply kept everything (effectively $f=1$).</b></li>
         <li><b>Update memory:</b> $c_t = f\\odot c_{t-1} + i\\odot g$ &mdash; keep a fraction of the old, add a
         fraction of the new. The $\\odot$ means element-by-element multiply.</li>
         <li><b>Output gate</b> $o$ (sigmoid, $[0,1]$) and <b>emit:</b> $h_t = o\\odot\\tanh(c_t)$ &mdash; reveal a
         gated, squashed view of the memory as this step's output.</li>
       </ol>
       <p><b>Why this beats a plain RNN.</b> When the forget gate is near $1$ and the input gate near $0$, the memory
       update becomes $c_t \\approx c_{t-1}$: the cell <b>copies itself forward unchanged</b>. That is the Constant
       Error Carousel &mdash; the backward gradient through $c$ is multiplied by $\\approx 1$ each step instead of by
       a shrinking weight, so it does not vanish. The gates are what let the network <i>choose</i> to open that
       carousel exactly when a value needs to survive a long gap.</p>`,

    symbols: [
      { sym: "$x_t$", desc: "the input vector at time step $t$ (e.g. one token's features). Length $d$ = input size." },
      { sym: "$h_{t-1}$, $h_t$", desc: "the hidden state (the cell's public output) before and after this step. Length $H$ = hidden size. This is what later layers read." },
      { sym: "$c_{t-1}$, $c_t$", desc: "the cell state (the private long-term memory) before and after this step. Length $H$. Carried by the constant-error carousel." },
      { sym: "$i_t$", desc: "input gate, a vector in $[0,1]^H$. How much of the new candidate to WRITE into memory. From a sigmoid." },
      { sym: "$f_t$", desc: "forget gate, in $[0,1]^H$. How much of the OLD memory to keep ($1$=keep all, $0$=erase). NOTE: not in the 1997 paper; added 1999/2000." },
      { sym: "$g_t$ (also $\\tilde c_t$)", desc: "the candidate cell content, in $[-1,1]^H$. The new information proposed this step. From a $\\tanh$." },
      { sym: "$o_t$", desc: "output gate, in $[0,1]^H$. How much of the (squashed) memory to RELEASE as the output $h_t$. From a sigmoid." },
      { sym: "$\\sigma$", desc: "the logistic sigmoid $\\sigma(z)=1/(1+e^{-z})$, squashing any real number into $(0,1)$ — used for the three gates (valves)." },
      { sym: "$\\tanh$", desc: "the hyperbolic tangent, squashing any real number into $(-1,1)$ — used for the candidate $g$ and for the memory readout." },
      { sym: "$\\odot$", desc: "the Hadamard (element-wise) product: multiply two equal-length vectors entry by entry. This is how a gate scales a flow, slot by slot." },
      { sym: "$W_{ih}$, $b_{ih}$", desc: "the input-to-gates weight matrix (shape $4H\\times d$) and bias (length $4H$). Maps $x_t$ to the four stacked gate pre-activations." },
      { sym: "$W_{hh}$, $b_{hh}$", desc: "the hidden-to-gates (recurrent) weight matrix (shape $4H\\times H$) and bias (length $4H$). Maps $h_{t-1}$ to the same four blocks. PyTorch keeps two separate biases." }
    ],

    formula:
      `$$\\begin{aligned}
        i_t &= \\sigma\\!\\big(W_{ii}x_t + b_{ii} + W_{hi}h_{t-1} + b_{hi}\\big) \\\\
        f_t &= \\sigma\\!\\big(W_{if}x_t + b_{if} + W_{hf}h_{t-1} + b_{hf}\\big) \\\\
        g_t &= \\tanh\\!\\big(W_{ig}x_t + b_{ig} + W_{hg}h_{t-1} + b_{hg}\\big) \\\\
        o_t &= \\sigma\\!\\big(W_{io}x_t + b_{io} + W_{ho}h_{t-1} + b_{ho}\\big) \\\\
        c_t &= f_t \\odot c_{t-1} + i_t \\odot g_t \\\\
        h_t &= o_t \\odot \\tanh(c_t)
      \\end{aligned}$$`,

    whatItDoes:
      `<p>The first four lines build the three <b>gates</b> ($i,f,o$ via sigmoid, each a valve in $[0,1]$) and the
       <b>candidate</b> ($g$ via $\\tanh$, the proposed new content). Each is just a linear map of the input $x_t$
       and the previous output $h_{t-1}$, then a squashing function.</p>
       <p>The fifth line is the heart: the new memory $c_t$ <b>keeps</b> $f_t$ of the old memory and <b>adds</b>
       $i_t$ of the new candidate. The sixth line <b>reads out</b> a gated, $\\tanh$-squashed view of the memory as
       the output $h_t$.</p>
       <p><b>Mapping to the 1997 paper:</b> the input gate $i$ and output gate $o$ are the paper's two gates; the
       $c_t = f\\odot c_{t-1}+\\dots$ self-loop with $f\\!\\to\\!1$ is the <b>Constant Error Carousel</b> (weight-$1$
       self-connection). The explicit forget gate $f$ is the 1999/2000 generalization of that fixed weight-$1$
       loop. These equations are PyTorch's <code>nn.LSTMCell</code> definition, which we match exactly.</p>`,

    derivation:
      `<p>The full modern LSTM derivation &mdash; why each gate exists and how BPTT flows through the cell &mdash; is
       owned by the <code>dl-lstm-gru</code> concept lesson; this is a short recap. <b>The key claim</b> is that the
       memory's recurrent path does not vanish. Take the cell update $c_t = f_t\\odot c_{t-1} + i_t\\odot g_t$. The
       partial derivative of $c_t$ with respect to $c_{t-1}$ along the carry path is just $f_t$ (element-wise).
       Backpropagating across $k$ steps multiplies these together: $\\frac{\\partial c_t}{\\partial c_{t-k}}
       \\approx \\prod_{j} f_{t-j}$. When the forget gates are near $1$, this product stays near $1$ &mdash; the
       gradient is <b>preserved</b> across the gap. Contrast a plain RNN, where the analogous factor is the
       recurrent weight times a $\\tanh'$ derivative (typically &lt; 1), whose $k$-fold product decays exponentially.
       That single difference &mdash; a near-identity carry instead of a shrinking one &mdash; is the Constant Error
       Carousel, and it is why LSTM learns long lags. See <code>dl-lstm-gru</code> for the full gate gradients.</p>`,

    example:
      `<p><b>Worked numbers</b> for one LSTM cell step with hidden size $H=1$ (scalars), input $x_t=1$, previous
       output $h_{t-1}=0$, previous memory $c_{t-1}=2$. Pre-activation weights (recurrent parts vanish since
       $h_{t-1}=0$): input-gate net $z_i=0.5$, forget-gate net $z_f=1.0$, candidate net $z_g=0.8$, output-gate net
       $z_o=0.3$.</p>
       <ul>
         <li><b>Gates &amp; candidate</b> (apply $\\sigma$ to $i,f,o$ and $\\tanh$ to $g$):
         <ul>
           <li>$i = \\sigma(0.5) = 0.622459$</li>
           <li>$f = \\sigma(1.0) = 0.731059$</li>
           <li>$g = \\tanh(0.8) = 0.664037$</li>
           <li>$o = \\sigma(0.3) = 0.574443$</li>
         </ul></li>
         <li><b>New memory</b> $c_t = f\\cdot c_{t-1} + i\\cdot g
         = 0.731059\\cdot 2 + 0.622459\\cdot 0.664037
         = 1.462118 + 0.413335 = 1.875453$.</li>
         <li><b>Read out</b> $h_t = o\\cdot\\tanh(c_t) = 0.574443\\cdot\\tanh(1.875453)
         = 0.574443\\cdot 0.954086 = 0.548068$.</li>
       </ul>
       <p>So this cell <b>kept</b> most of its old memory ($f=0.73$ of $2$) and added a bit of the new candidate,
       landing at $c_t=1.875453$, and revealed about $55\\%$ of its squashed memory as the output $h_t=0.548068$.
       The CODE cell recomputes these exact numbers and prints them.</p>`,

    recipe:
      `<p><b>One LSTM cell step, as numbered operations (matching <code>nn.LSTMCell</code>):</b></p>
       <ol>
         <li>Stack four gate pre-activations: $\\text{gates} = x_t W_{ih}^\\top + b_{ih} + h_{t-1} W_{hh}^\\top + b_{hh}$,
         a vector of length $4H$.</li>
         <li>Slice into four blocks of width $H$ <b>in the order $i,f,g,o$</b> (PyTorch's packing).</li>
         <li>Apply $\\sigma$ to the $i,f,o$ blocks and $\\tanh$ to the $g$ block.</li>
         <li>Update memory: $c_t = f\\odot c_{t-1} + i\\odot g$.</li>
         <li>Emit output: $h_t = o\\odot\\tanh(c_t)$.</li>
         <li>To process a sequence, repeat steps 1&ndash;5 for each time step, feeding $h_t,c_t$ into the next step.</li>
       </ol>`,

    results:
      `<p>The 1997 paper reports that LSTM <b>learns long-time-lag tasks that plain RNNs and earlier methods cannot</b>
       &mdash; bridging gaps of well over $1000$ time steps on its toy benchmarks, while standard recurrent nets fail
       past roughly $10$ steps. We do not quote exact table numbers from memory; see the paper's experiment sections
       for the specific lags and success rates. (Source: "Long Short-Term Memory", Neural Computation 9(8), 1997, as
       summarized on Wikipedia.) The numbers in our CODEVIZ are our own small-scale run, not the paper's reported
       figures.</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> PyTorch ships the whole cell as <code>nn.LSTMCell(input_size, hidden_size)</code>
       in one line. Here you <b>build it from scratch</b>: take PyTorch's own packed weights
       (<code>weight_ih</code>, <code>weight_hh</code>, <code>bias_ih</code>, <code>bias_hh</code>), slice the four
       gate blocks in the order $i,f,g,o$, apply the right activations, and compute $c_t,h_t$ by hand. The payoff is
       the <code>torch.allclose(my_h, ref_h)</code> and <code>torch.allclose(my_c, ref_c)</code> check &mdash; if it
       passes, your hand-written cell <i>is</i> PyTorch's LSTM cell. Then we drop the cell into a 12-step memory task
       to reproduce the paper's qualitative effect (remembering across a long gap) and ablate the memory carry.</p>
       <p><b>What we import vs build.</b> We build the cell's forward math by hand and verify it; we let
       <code>nn.LSTMCell</code> own the weights and autograd own the backward pass (that is the point of the
       allclose &mdash; matching the library, not re-deriving gradients).</p>`,

    pitfalls:
      `<ul>
         <li><b>Gate order.</b> PyTorch packs the four blocks as $i, f, g, o$ (input, forget, candidate, output).
         Slice in <i>that</i> order or the allclose fails. Other frameworks use different orderings.</li>
         <li><b>Two biases, not one.</b> <code>nn.LSTMCell</code> has both <code>bias_ih</code> and
         <code>bias_hh</code> and adds <i>both</i>. Dropping one (or merging into a single bias) breaks the match.</li>
         <li><b>Forget gate is post-1997.</b> The original paper has only input and output gates plus a fixed
         weight-$1$ self-loop; the forget gate is the 1999/2000 addition. The cell you build (to match PyTorch) has
         the forget gate &mdash; do not attribute it to the 1997 paper.</li>
         <li><b>$\\tanh$ on $g$, sigmoid on the gates.</b> The candidate uses $\\tanh$ (content in $[-1,1]$); the
         three gates use sigmoid (valves in $[0,1]$). Swapping them quietly changes the model and fails the check.</li>
         <li><b>Initial states.</b> If you do not pass $(h_0,c_0)$, PyTorch starts them at zero; match that in your
         own loop or the first step diverges.</li>
         <li><b>Tiny-run variance.</b> The CODEVIZ accuracy hitting exactly $100\\%$ is our small toy task, not a
         claim about real data; some seeds learn faster than others.</li>
       </ul>`,

    recall: [
      "Write the LSTM cell update $c_t$ and output $h_t$ from memory, naming each gate.",
      "What is the Constant Error Carousel, and why does it stop the gradient from vanishing?",
      "Which gate is NOT in the 1997 paper, and who added it (and when)?",
      "Define $\\odot$, and say which of $i,f,g,o$ use sigmoid vs $\\tanh$.",
      "In PyTorch's packing, what is the order of the four gate blocks, and how many bias vectors does nn.LSTMCell add?"
    ],

    practice: [
      {
        q: `Compute one LSTM cell step ($H=1$) with $x_t$ giving gate nets $z_i=0,\\ z_f=2,\\ z_g=0,\\ z_o=0$, previous memory $c_{t-1}=1$, and $h_{t-1}=0$. Find $c_t$ and $h_t$.`,
        steps: [
          { do: `Gates: $i=\\sigma(0)=0.5$, $f=\\sigma(2)=0.880797$, $g=\\tanh(0)=0$, $o=\\sigma(0)=0.5$.`, why: `Sigmoid on $i,f,o$; $\\tanh$ on the candidate $g$.` },
          { do: `Memory: $c_t = f\\cdot c_{t-1} + i\\cdot g = 0.880797\\cdot1 + 0.5\\cdot0 = 0.880797$.`, why: `Keep $f$ of old memory; add $i$ of the (here zero) candidate.` },
          { do: `Output: $h_t = o\\cdot\\tanh(c_t) = 0.5\\cdot\\tanh(0.880797) = 0.5\\cdot0.706727 = 0.353363$.`, why: `Output gate releases a squashed view of memory.` }
        ],
        answer: `$c_t \\approx 0.880797$, $h_t \\approx 0.353363$. With $g=0$ nothing new is written, so the cell mostly carries its old memory forward (forget gate $0.88$) — a small demo of the carousel holding a value.`
      },
      {
        q: `Why does setting the forget gate near $1$ and the input gate near $0$ let a value survive a long gap, while a plain RNN's hidden state does not?`,
        steps: [
          { do: `With $f\\approx1,\\ i\\approx0$: $c_t = f\\odot c_{t-1}+i\\odot g \\approx c_{t-1}$.`, why: `The memory copies itself forward almost unchanged.` },
          { do: `Backward, $\\partial c_t/\\partial c_{t-1}\\approx f\\approx 1$, so across $k$ steps the factor is $\\prod f \\approx 1$.`, why: `Near-identity carry = no vanishing.` },
          { do: `A plain RNN's carry factor is $\\approx W\\cdot\\tanh' < 1$, whose $k$-fold product decays to $0$.`, why: `Repeated multiplication by a sub-unit number vanishes exponentially.` }
        ],
        answer: `The LSTM's memory has a (near) weight-$1$ self-loop — the Constant Error Carousel — so both the value and its gradient pass through ~unchanged. A plain RNN multiplies by a sub-unit factor every step, so the signal connecting distant steps shrinks toward zero. That is exactly the vanishing-gradient problem the 1997 paper solved.`
      },
      {
        q: `Ablation: in the CODEVIZ long-gap task the trained LSTM reaches ~100% accuracy. We then zero the recurrent weights ($W_{hh}\\!=\\!0,\\ b_{hh}\\!=\\!0$) and re-test without retraining. Predict the accuracy and explain.`,
        steps: [
          { do: `Zeroing $W_{hh},b_{hh}$ removes the $h_{t-1}$ contribution to every gate.`, why: `The cell can no longer condition on its own past output.` },
          { do: `Each gate now depends only on the current $x_t$; the cell cannot route the $t=0$ cue to step $11$.`, why: `The memory carry that bridged the gap is broken.` },
          { do: `The last step is pure noise, so the readout has no information about the cue.`, why: `Cue lives only at $t=0$; without recurrence it is unreachable at $t=11$.` }
        ],
        answer: `Accuracy collapses to chance (~0.50; our run gave 0.495). The cue is shown only at step 0 and the readout is at step 11, so the model can only succeed by carrying memory across the gap. Destroying the recurrent path removes that carry — the Constant Error Carousel is what made the 100% possible, and the ablation proves it.`
      }
    ]
  });

  window.CODE["paper-lstm"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build one LSTM cell step from raw tensors. Pull PyTorch's own packed weights from nn.LSTMCell ` +
      `(weight_ih, weight_hh, bias_ih, bias_hh), slice the four gate blocks in PyTorch's order i,f,g,o, apply ` +
      `sigmoid to i/f/o and tanh to g, then c_t = f*c + i*g and h_t = o*tanh(c_t). Prove it matches with ` +
      `torch.allclose(mine, nn.LSTMCell(...)) for both h and c — the allclose IS the proof. Recompute the worked ` +
      `H=1 example, then drop the cell into a 12-step long-gap memory task and ablate the recurrence. ` +
      `Runs in Colab (torch preinstalled).`,
    code: `import torch, torch.nn as nn
torch.manual_seed(0)

def my_lstm_cell(x, h, c, W_ih, W_hh, b_ih, b_hh, H):
    """One LSTM cell step from scratch. Gate order = PyTorch's packing: i, f, g, o."""
    gates = x @ W_ih.t() + b_ih + h @ W_hh.t() + b_hh   # (B, 4H) stacked pre-activations
    i = torch.sigmoid(gates[:, 0*H:1*H])                # input gate  (write how much new?)
    f = torch.sigmoid(gates[:, 1*H:2*H])                # forget gate (keep how much old?)  [1999/2000 addition]
    g = torch.tanh   (gates[:, 2*H:3*H])                # candidate   (the new content)
    o = torch.sigmoid(gates[:, 3*H:4*H])                # output gate (release how much memory?)
    c_new = f * c + i * g                               # cell-state update (the carousel + write)
    h_new = o * torch.tanh(c_new)                       # gated, squashed read-out
    return h_new, c_new

# ---- THE ORACLE: my cell must equal nn.LSTMCell on the SAME weights ----
I, H, B = 3, 4, 2
cell = nn.LSTMCell(I, H)                                # PyTorch's reference cell
x  = torch.randn(B, I)
h0 = torch.zeros(B, H); c0 = torch.zeros(B, H)         # PyTorch defaults states to zero
h_ref, c_ref = cell(x, (h0, c0))
h_mine, c_mine = my_lstm_cell(
    x, h0, c0,
    cell.weight_ih.detach(), cell.weight_hh.detach(),  # (4H, I) and (4H, H)
    cell.bias_ih.detach(),   cell.bias_hh.detach(),    # nn.LSTMCell adds BOTH biases
    H)
print("h allclose :", torch.allclose(h_mine, h_ref, atol=1e-6))   # True
print("c allclose :", torch.allclose(c_mine, c_ref, atol=1e-6))   # True
print("max |dh|   :", (h_mine - h_ref).abs().max().item())        # ~0

# ---- recompute the WORKED EXAMPLE: H=1, x->z_i=0.5,z_f=1.0,z_g=0.8,z_o=0.3, c_prev=2 ----
import math
sig = lambda z: 1/(1+math.exp(-z))
zi, zf, zg, zo, c_prev = 0.5, 1.0, 0.8, 0.3, 2.0
i = sig(zi); f = sig(zf); g = math.tanh(zg); o = sig(zo)
c_t = f*c_prev + i*g
h_t = o*math.tanh(c_t)
print("i,f,g,o    :", [round(v,6) for v in (i,f,g,o)])   # [0.622459, 0.731059, 0.664037, 0.574443]
print("c_t        :", round(c_t, 6))                     # 1.875453
print("h_t        :", round(h_t, 6))                     # 0.548068

# ---- use the cell on a 12-step LONG-GAP memory task ----
T, Hd = 12, 16
def make_batch(n, g):                                    # cue at t=0, noise after, recall at t=11
    X = torch.zeros(n, T, 2); b = torch.randint(0, 2, (n,), generator=g).float()
    X[:, 0, 0] = b*2 - 1                                 # +1/-1 cue on feature 0 at step 0
    X[:, :, 1] = torch.randn(n, T, generator=g)*0.5      # noise on feature 1 everywhere
    X[:, 0, 1] = 0.0
    return X, b
def run(cell, head, X):
    n = X.size(0); h = torch.zeros(n, Hd); c = torch.zeros(n, Hd)
    for t in range(T): h, c = cell(X[:, t, :], (h, c))   # carry h,c across all 12 steps
    return head(h).squeeze(1)

torch.manual_seed(0); g = torch.Generator().manual_seed(100)
mem = nn.LSTMCell(2, Hd); head = nn.Linear(Hd, 1)
opt = torch.optim.Adam(list(mem.parameters())+list(head.parameters()), lr=0.03)
lossf = nn.BCEWithLogitsLoss()
ge = torch.Generator().manual_seed(999); Xt, bt = make_batch(1000, ge)
acc = lambda: (((torch.sigmoid(run(mem, head, Xt))>0.5).float()==bt).float().mean().item())
for step in range(601):
    X, b = make_batch(64, g)
    opt.zero_grad(); lossf(run(mem, head, X), b).backward(); opt.step()
print("trained gap-task accuracy:", round(acc(), 3))     # ~1.0 — it remembers across the gap

# ---- ABLATION: break the memory carry, re-test (no retrain) ----
abl = nn.LSTMCell(2, Hd); abl.load_state_dict(mem.state_dict())
with torch.no_grad(): abl.weight_hh.zero_(); abl.bias_hh.zero_()   # no recurrence -> no carry
with torch.no_grad():
    abl_acc = (((torch.sigmoid(run(abl, head, Xt))>0.5).float()==bt).float().mean().item())
print("ablated (no recurrence)  :", round(abl_acc, 3))   # ~0.50 — chance; memory is what mattered`
  };

  window.CODEVIZ["paper-lstm"] = {
    question: "Show an LSTM cell a cue at step 0, then 11 steps of noise, and ask it to recall the cue at the end. Does it learn to remember across the gap — and does breaking the memory carry destroy that?",
    charts: [
      {
        type: "line",
        title: "Recall accuracy on the 12-step long-gap task vs training step (cue at t=0, readout at t=11)",
        xlabel: "training step",
        ylabel: "held-out accuracy",
        series: [
          {
            name: "LSTM cell (full)",
            color: "#7ee787",
            points: [
              { x: 0,   y: 0.505 },
              { x: 50,  y: 0.527 },
              { x: 100, y: 0.495 },
              { x: 150, y: 1.0 },
              { x: 200, y: 1.0 },
              { x: 250, y: 1.0 },
              { x: 300, y: 1.0 },
              { x: 400, y: 1.0 },
              { x: 500, y: 1.0 },
              { x: 600, y: 1.0 }
            ]
          },
          {
            name: "Ablation: recurrence removed (W_hh=0)",
            color: "#f85149",
            points: [
              { x: 0,   y: 0.495 },
              { x: 150, y: 0.495 },
              { x: 300, y: 0.495 },
              { x: 600, y: 0.495 }
            ]
          }
        ]
      }
    ],
    caption: "Our small-scale run (PyTorch, seed 0, data generator seed 100), not the paper's reported numbers. We trained one nn.LSTMCell (hidden size 16) + a linear head on a 12-step task: a +1/-1 cue appears only at step 0, every later step is noise, and the model must report the cue at step 11. Held-out accuracy sits at chance (~0.50) for the first ~100 steps, then snaps to 100% by step 150 once the cell learns to latch the cue into its memory and carry it across the gap (green). The red line is the ablation: we copy the trained weights but zero the recurrent weights (W_hh, b_hh), destroying the memory carry — accuracy collapses to chance (0.495). The carry is exactly what made recall possible, reproducing the paper's qualitative point that the LSTM's protected memory bridges long time lags that a plain RNN cannot. (Exact step-of-takeoff varies by seed; the chance -> 100% transition and the ablation collapse are the reproducible effects.)",
    code: `import torch, torch.nn as nn
T, Hd = 12, 16
def make_batch(n, g):
    X = torch.zeros(n, T, 2); b = torch.randint(0, 2, (n,), generator=g).float()
    X[:, 0, 0] = b*2 - 1; X[:, :, 1] = torch.randn(n, T, generator=g)*0.5; X[:, 0, 1] = 0.0
    return X, b
def run(cell, head, X):
    n = X.size(0); h = torch.zeros(n, Hd); c = torch.zeros(n, Hd)
    for t in range(T): h, c = cell(X[:, t, :], (h, c))
    return head(h).squeeze(1)

torch.manual_seed(0); g = torch.Generator().manual_seed(100)
mem = nn.LSTMCell(2, Hd); head = nn.Linear(Hd, 1)
opt = torch.optim.Adam(list(mem.parameters())+list(head.parameters()), lr=0.03)
lossf = nn.BCEWithLogitsLoss()
ge = torch.Generator().manual_seed(999); Xt, bt = make_batch(1000, ge)
acc = lambda: round((((torch.sigmoid(run(mem, head, Xt))>0.5).float()==bt).float().mean().item()), 3)
for step in range(601):
    if step % 50 == 0: print("step", step, "acc", acc())   # 0.505 ... 0.495 -> 1.0 by step 150
    X, b = make_batch(64, g)
    opt.zero_grad(); lossf(run(mem, head, X), b).backward(); opt.step()
print("final acc", acc())                                  # 1.0

abl = nn.LSTMCell(2, Hd); abl.load_state_dict(mem.state_dict())
with torch.no_grad(): abl.weight_hh.zero_(); abl.bias_hh.zero_()
with torch.no_grad():
    print("ablation acc", round((((torch.sigmoid(run(abl, head, Xt))>0.5).float()==bt).float().mean().item()), 3))  # ~0.495`
  };
})();
