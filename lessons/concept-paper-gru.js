/* Paper lesson — GRU (Gated Recurrent Unit), Cho et al. 2014.
   Track A (primitive): build a GRU cell from raw torch (gate packing order r,z,n to match PyTorch's
   nn.GRUCell), then verify torch.allclose(mine, nn.GRUCell). The allclose IS the proof.

   GROUNDING / arXiv NOTE (read this):
   The reference row assigns this lesson to arXiv 1409.1259, "On the Properties of Neural Machine
   Translation: Encoder-Decoder Approaches" (Cho, van Merrienboer, Bahdanau, Bengio, 2014). We fetched
   that paper via ar5iv (https://ar5iv.labs.arxiv.org/html/1409.1259). Its Section 2.1 INTRODUCES the
   gated recurrent unit conceptually — the reset gate r and update gate z, the unit that "adaptively
   remembers and forgets" (Figure 1(b)) — but it does NOT print the four gate equations; it explicitly
   says "For details about this unit, we refer the reader to [Cho et al., 2014]." So we ground the prose
   and the qualitative long-sentence finding from 1409.1259, and we transcribe the EXACT equations from
   the cited companion paper Cho et al. 2014, "Learning Phrase Representations using RNN Encoder-Decoder
   for Statistical Machine Translation" (arXiv 1406.1078, Section 2.3, eqs (5)-(8)), fetched via ar5iv
   (https://ar5iv.labs.arxiv.org/html/1406.1078). Both links are in paper.{arxiv,url}. Nothing recalled.

   CONVENTION FLAG: the paper's eq (7) writes h = z*h_prev + (1-z)*h_tilde (z gates the OLD state).
   PyTorch's nn.GRUCell writes h = (1-z)*n + z*h_prev (z gates the OLD state, but the "1-z" multiplies the
   candidate). These are the same family with the z-vs-(1-z) labels swapped on the candidate; we state this
   explicitly and BUILD the PyTorch convention so the allclose oracle passes. Cross-link: paper-lstm. */
(function () {
  window.LESSONS.push({
    id: "paper-gru",
    title: "GRU — Gated Recurrent Unit (2014)",
    tagline: "A simpler gated recurrent cell: two gates, one state, no separate memory cell — yet it still bridges long time gaps.",
    module: "Papers · Sequence & NLP",
    track: "primitive",

    paper: {
      authors: "Kyunghyun Cho, Bart van Merrienboer, Dzmitry Bahdanau, Yoshua Bengio",
      org: "Universite de Montreal, Jacobs University, CIFAR",
      year: 2014,
      venue: "arXiv:1409.1259 (SSST-8 workshop, EMNLP 2014)",
      citations: "",                       // no reliable count fetched in this environment — left blank, not invented
      arxiv: "https://arxiv.org/abs/1409.1259",
      url: "https://arxiv.org/abs/1406.1078",   // companion paper that prints the gate equations (Cho et al. 2014, eqs 5-8)
      code: ""
    },

    conceptLink: "dl-lstm-gru",
    partOf: [],
    prereqs: ["dl-rnn", "dl-lstm-gru", "dl-backprop", "paper-lstm"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> A <b>recurrent neural network</b> (RNN) reads a sequence one step at a time, keeping a
       running summary called the <b>hidden state</b> $h$ that it rewrites at every step. A plain RNN rewrites $h$
       <i>completely</i> every step: $h^{&lt;t&gt;} = \\tanh(W x^{&lt;t&gt;} + U h^{&lt;t-1&gt;})$. Here $x^{&lt;t&gt;}$
       is the input at step $t$, the superscript $^{&lt;t&gt;}$ just means "at time step $t$", $W$ and $U$ are weight
       matrices (numbers the network learns), and $\\tanh$ is the squashing function that keeps values in $[-1,1]$.</p>
       <p><b>What was broken.</b> Because the plain RNN overwrites its whole state each step, information from far back
       is squashed again and again until it disappears; and the training gradient that should connect "an output now"
       to "a cause many steps ago" <b>vanishes exponentially with the gap</b>. The <b>Long Short-Term Memory</b> (LSTM)
       cell fixed this with a protected memory cell and three gates (see the LSTM lesson), but the LSTM is heavy: it
       carries <i>two</i> states (a hidden state and a separate memory cell) and uses three gates.</p>
       <p><b>The question this paper asks.</b> Can we get the long-gap benefit with a <i>simpler</i> cell? And how do
       these neural translation models actually behave? The paper (1409.1259) analyses an RNN encoder-decoder built
       from this new cell and reports that such models "perform relatively well on short sentences" but their quality
       "suffer[s] significantly as the length of the sentences increases" (their analysis of sentence length).</p>`,

    contribution:
      `<p>The paper introduces (Section 2.1, and defined in full in the companion paper Cho et al. 2014) the
       <b>gated recurrent unit</b> (GRU): a recurrent cell with two learned gates and a <b>single</b> state.</p>
       <ul>
         <li><b>The update gate $z$.</b> A learned valve $\\in[0,1]$ that decides, per dimension, <b>how much of the
         old state to keep versus how much fresh content to write</b>. When $z$ stays near the "keep" extreme, the
         cell copies its state forward almost unchanged across many steps — that is how it bridges a long gap.</li>
         <li><b>The reset gate $r$.</b> A learned valve $\\in[0,1]$ that decides <b>how much of the old state to use
         when computing the fresh candidate content</b>. The paper notes that "when the reset gate is close to 0, the
         hidden state is forced to ignore the previous hidden state and reset" (Cho et al. 2014, Sec 2.3) — letting the
         unit drop information that is no longer relevant.</li>
         <li><b>One state, two gates.</b> Unlike the LSTM there is <b>no separate memory cell</b> and <b>no output
         gate</b> — the single hidden state is both the memory and the output. The paper calls it a unit that
         "adaptively remembers and forgets" (Figure 1(b) of 1409.1259).</li>
       </ul>`,

    whyItMattered:
      `<p>The GRU became the standard "lighter LSTM": fewer parameters and one fewer state to carry, often matching the
       LSTM on many tasks while training a bit faster. For years it was — alongside the LSTM — the default recurrent
       cell for translation, speech, and time-series, until the Transformer replaced recurrence for large NLP. PyTorch
       ships it as <code>nn.GRUCell</code> / <code>nn.GRU</code>, which is exactly what we will reconstruct and match.</p>`,

    // READING GUIDE
    readingGuide:
      `<p>Read <b>Section 2.1</b> of 1409.1259 (the RNN with gated hidden units) — that is where the reset and update
       gates and Figure 1(b) live. For the precise gate equations the paper points you to <b>Section 2.3 of the
       companion paper Cho et al. 2014</b> (arXiv 1406.1078, eqs (5)-(8)); read those four lines carefully. Skim the
       gated-convolutional model and the heavy SMT (statistical machine translation) plumbing. Look at the
       <b>quantitative analysis</b> plots of BLEU vs sentence length — that is the paper's headline empirical message.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Predict before you run.</b> We will give a recurrent net a one-bit cue at step 0, then a long run of
       blanks, and ask it to recall the bit at the end. As we stretch the gap longer and longer, which fails first —
       a plain <b>tanh RNN</b> or a <b>GRU</b>? And is there a gap length where the RNN drops to coin-flip accuracy
       while the GRU still recalls perfectly? Write your guess, then look at the CODEVIZ.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Build one GRU step from raw tensors. Given input $x$, previous state
       $h$, and PyTorch-packed weights, compute:</p>
       <ol>
         <li><code>r = sigmoid(x @ W_ir.T + b_ir + h @ W_hr.T + b_hr)</code>  <i># reset gate</i></li>
         <li><code>z = sigmoid(x @ W_iz.T + b_iz + h @ W_hz.T + b_hz)</code>  <i># update gate</i></li>
         <li><code>n = tanh(x @ W_in.T + b_in + r * (h @ W_hn.T + b_hn))</code>  <i># candidate; r gates the hidden part</i></li>
         <li><code>h_new = (1 - z) * n + z * h</code>  <i># blend old state and candidate</i></li>
       </ol>
       <p>The reveal: <code>torch.allclose(your_h_new, nn.GRUCell(...)(x, h))</code> must print <b>True</b>. The TODO is
       to slice the packed <code>weight_ih</code>/<code>weight_hh</code> in the order $[r, z, n]$.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>A GRU step takes the current input $x^{&lt;t&gt;}$ and the previous state $h^{&lt;t-1&gt;}$ and produces the new
       state $h^{&lt;t&gt;}$. It works in four small steps.</p>
       <ol>
         <li><b>Reset gate $r$.</b> Mix input and old state through a linear map, then squash with the logistic
         sigmoid $\\sigma$ so every entry lands in $[0,1]$. $r$ near $0$ means "ignore the old state for now".</li>
         <li><b>Update gate $z$.</b> Same idea, separate weights: $z$ near $1$ means "keep the old state, write almost
         nothing new"; $z$ near $0$ means "overwrite with the fresh candidate". (Watch the convention — see the flag
         below; PyTorch keeps the old state where $z$ is large.)</li>
         <li><b>Candidate state $\\tilde{h}$.</b> Propose fresh content with a $\\tanh$. Crucially the old state enters
         this candidate <b>only through</b> $r \\odot h^{&lt;t-1&gt;}$ — the reset gate decides how much past context the
         candidate is allowed to see. Here $\\odot$ means elementwise multiply.</li>
         <li><b>Blend.</b> The new state is a per-dimension interpolation between the old state and the candidate,
         controlled by $z$. No separate memory cell, no output gate — this single $h$ is both.</li>
       </ol>
       <p><b>Why it bridges long gaps.</b> If $z\\approx 1$ (PyTorch convention) for a stretch of steps, then
       $h^{&lt;t&gt;}\\approx h^{&lt;t-1&gt;}$ — the state is copied forward almost unchanged, and the training gradient
       flows back through that near-identity link without being repeatedly shrunk. That is the same "carry the signal"
       trick as the LSTM, achieved with one gate fewer and one state fewer.</p>`,

    symbols: [
      { sym: "$x^{&lt;t&gt;}$", desc: "input vector at time step $t$; the superscript $^{&lt;t&gt;}$ means 'at step $t$'." },
      { sym: "$h^{&lt;t&gt;}$", desc: "hidden state (the running summary) at step $t$; for the GRU it is also the output." },
      { sym: "$r_j$", desc: "reset gate for unit $j$, a number in $[0,1]$: how much old state the candidate may use." },
      { sym: "$z_j$", desc: "update gate for unit $j$, a number in $[0,1]$: how much old state to keep vs. new candidate." },
      { sym: "$\\tilde{h}_j$", desc: "candidate (proposed) new value for unit $j$ before blending with the old state." },
      { sym: "$\\sigma$", desc: "logistic sigmoid $\\sigma(a)=1/(1+e^{-a})$ — squashes any number into $(0,1)$, so gates act as soft valves." },
      { sym: "$\\phi$", desc: "the candidate's squashing function; here $\\tanh$, which maps any number into $(-1,1)$." },
      { sym: "$\\odot$", desc: "elementwise (Hadamard) product: multiply two vectors entry by entry." },
      { sym: "$W_r,W_z,W$", desc: "input-to-gate weight matrices (learned) for reset, update, and candidate." },
      { sym: "$U_r,U_z,U$", desc: "state-to-gate weight matrices (learned) for reset, update, and candidate." }
    ],

    formula:
      `$$\\begin{aligned}
        r_j &= \\sigma\\!\\big([W_r x]_j + [U_r h^{&lt;t-1&gt;}]_j\\big) &&\\text{(reset gate, eq. 5)}\\\\
        z_j &= \\sigma\\!\\big([W_z x]_j + [U_z h^{&lt;t-1&gt;}]_j\\big) &&\\text{(update gate, eq. 6)}\\\\
        \\tilde{h}_j^{&lt;t&gt;} &= \\phi\\!\\big([W x]_j + [U\\,(r \\odot h^{&lt;t-1&gt;})]_j\\big) &&\\text{(candidate, eq. 8)}\\\\
        h_j^{&lt;t&gt;} &= z_j\\,h_j^{&lt;t-1&gt;} + (1-z_j)\\,\\tilde{h}_j^{&lt;t&gt;} &&\\text{(blend, eq. 7)}
       \\end{aligned}$$`,

    whatItDoes:
      `<p>Two gates and one candidate. The <b>reset gate</b> $r$ controls how much of the old state feeds the
       candidate $\\tilde{h}$. The <b>update gate</b> $z$ then linearly interpolates: the new state is a weighted
       average of the old state $h^{&lt;t-1&gt;}$ and the candidate $\\tilde{h}$, mixed per dimension by $z$. Equations
       (5)-(8) are transcribed verbatim from Cho et al. 2014, Section 2.3 (the companion paper that 1409.1259 cites).</p>
       <p><b>Convention flag (important).</b> As written above (the paper's eq. 7), $z\\to 1$ keeps the OLD state.
       PyTorch's <code>nn.GRUCell</code> writes the same blend as $h=(1-z)\\,\\tilde{h}+z\\,h^{&lt;t-1&gt;}$ — again $z\\to1$
       keeps the old state, just with the $(1-z)$ factor attached to the candidate instead. Some textbooks flip the
       label so $z\\to1$ <i>writes</i> the candidate. The math is one family; only which side wears the $z$ vs $(1-z)$
       label moves. We BUILD PyTorch's exact form so the allclose passes, and we say so out loud.</p>`,

    derivation:
      `<p>The math owner is the <b>dl-lstm-gru</b> concept lesson — see it for the full why. Short recap: the danger in
       a plain RNN is that backpropagation through time multiplies the gradient by the recurrent Jacobian at every
       step, so it shrinks geometrically across a long gap (vanishing gradient). The GRU's blend
       $h^{&lt;t&gt;}=z\\,h^{&lt;t-1&gt;}+(1-z)\\,\\tilde{h}$ makes $\\partial h^{&lt;t&gt;}/\\partial h^{&lt;t-1&gt;}$ contain an
       <i>additive</i> $z$ term (a near-identity path when $z\\approx1$). Gradient can ride that path back through many
       steps almost undamped — the same constant-error idea the LSTM achieves with its memory cell, here with two
       gates and a single state. The reset gate is an orthogonal valve: it lets the candidate ignore stale context
       without affecting the carry path.</p>`,

    example:
      `<p><b>Worked numbers — one scalar GRU step</b> (1 unit, 1 input), so you can do it by hand. Take input
       $x=1.0$, previous state $h^{&lt;t-1&gt;}=0.5$, and these weights:
       $W_r=0.5, U_r=-0.3$; $W_z=0.8, U_z=0.2$; $W=1.0, U=0.4$ (no biases).</p>
       <ol>
         <li><b>Reset gate.</b> $r=\\sigma(0.5\\cdot1 + (-0.3)\\cdot0.5)=\\sigma(0.35)=\\mathbf{0.5866}$.</li>
         <li><b>Update gate.</b> $z=\\sigma(0.8\\cdot1 + 0.2\\cdot0.5)=\\sigma(0.90)=\\mathbf{0.7109}$.</li>
         <li><b>Candidate.</b> first $r\\odot h^{&lt;t-1&gt;}=0.5866\\cdot0.5=0.2933$, then
         $\\tilde{h}=\\tanh(1.0\\cdot1 + 0.4\\cdot0.2933)=\\tanh(1.1173)=\\mathbf{0.8066}$.</li>
         <li><b>Blend (PyTorch form $h=(1-z)\\tilde{h}+z\\,h^{&lt;t-1&gt;}$).</b>
         $h^{&lt;t&gt;}=(1-0.7109)\\cdot0.8066 + 0.7109\\cdot0.5 = 0.2332 + 0.3555 = \\mathbf{0.5886}$.</li>
       </ol>
       <p>Because $z=0.71$ is fairly high, the new state $0.5886$ stays close to the old $0.5$ — the gate chose to
       mostly keep. The notebook recomputes these exact four numbers.</p>`,

    recipe:
      `<p>The GRU cell as numbered steps (PyTorch packing order $[r, z, n]$ in <code>weight_ih</code>/<code>weight_hh</code>):</p>
       <ol>
         <li>Slice the packed input weights into $W_{ir},W_{iz},W_{in}$ and the state weights into $W_{hr},W_{hz},W_{hn}$
         (each a block of <code>hidden_size</code> rows), plus the matching bias blocks.</li>
         <li>$r=\\sigma(x W_{ir}^\\top + b_{ir} + h W_{hr}^\\top + b_{hr})$.</li>
         <li>$z=\\sigma(x W_{iz}^\\top + b_{iz} + h W_{hz}^\\top + b_{hz})$.</li>
         <li>$n=\\tanh\\!\\big(x W_{in}^\\top + b_{in} + r\\odot(h W_{hn}^\\top + b_{hn})\\big)$ &mdash; note $r$ multiplies
         <i>only</i> the hidden contribution, exactly as PyTorch does.</li>
         <li>$h'=(1-z)\\odot n + z\\odot h$.</li>
       </ol>`,

    results:
      `<p>The paper's headline is an <b>analysis</b>, not a single accuracy number. It reports that the RNN
       encoder-decoder (built from this GRU) and the gated-convolutional model both "perform relatively well on
       short sentences" but "suffer significantly as the length of the sentences increases" and as the number of
       unknown words grows — i.e. translation quality degrades with sentence length (1409.1259, quantitative-analysis
       section). We quote this qualitatively and do not invent a BLEU figure. Our own numbers below are a separate
       toy demo, labelled as ours.</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> You build the GRU cell's four equations by hand from raw tensors, then verify it
       reproduces PyTorch's <code>nn.GRUCell</code> bit-for-bit with <code>torch.allclose</code>. What you import is
       only the <i>plumbing</i> — the random weight initialisation (we read the weights straight out of a constructed
       <code>nn.GRUCell</code>) and autograd. The <b>idea</b> — gate slicing in order $[r,z,n]$, the reset gating only
       the hidden part of the candidate, and the $(1-z)/z$ blend — is all yours. The allclose passing is the proof
       that "my version IS PyTorch's GRU".</p>`,

    pitfalls:
      `<ul>
         <li><b>Gate order.</b> PyTorch packs <code>weight_ih</code>/<code>weight_hh</code> as $[r, z, n]$ (reset,
         update, new). Slice in that order or the allclose fails silently with plausible-looking numbers.</li>
         <li><b>Where $r$ multiplies.</b> In PyTorch the reset gate multiplies <i>only</i> the hidden contribution:
         $n=\\tanh(x W_{in}^\\top + b_{in} + r\\odot(h W_{hn}^\\top + b_{hn}))$. A common bug is gating the whole
         pre-activation (including the input part) — that is a different cell and will not match.</li>
         <li><b>Two bias vectors.</b> <code>nn.GRUCell</code> has both <code>bias_ih</code> and <code>bias_hh</code>;
         keep them separate (don't fold them) to match exactly.</li>
         <li><b>$z$ vs $(1-z)$ convention.</b> The paper's eq. 7 and PyTorch agree that $z\\to1$ keeps the old state,
         but some references flip it. Match PyTorch's $(1-z)n + z h$ for the oracle.</li>
         <li><b>Wrong arXiv for the equations.</b> 1409.1259 describes the gates in words (Sec 2.1) but defers the
         equations to Cho et al. 2014 (1406.1078, Sec 2.3). Cite the right one.</li>
       </ul>`,

    recall: [
      "State the four GRU equations (reset $r$, update $z$, candidate $\\tilde{h}$, blend $h$) from memory.",
      "What does the reset gate $r$ do when it is close to $0$?",
      "In PyTorch's $h=(1-z)n+zh^{&lt;t-1&gt;}$, which value of $z$ copies the old state forward?",
      "Name two ways a GRU is simpler than an LSTM.",
      "In the candidate equation, the reset gate multiplies which part — the input contribution, the hidden contribution, or both?"
    ],

    practice: [
      {
        q: `Compute one scalar GRU step (PyTorch blend) with $x=1.0$, $h^{&lt;t-1&gt;}=0.5$, $W_r=0.5,U_r=-0.3$, $W_z=0.8,U_z=0.2$, $W=1.0,U=0.4$, no biases. Give $r,z,\\tilde{h},h^{&lt;t&gt;}$.`,
        steps: [
          { do: `$r=\\sigma(0.5\\cdot1-0.3\\cdot0.5)=\\sigma(0.35)$.`, why: `Reset gate: linear mix of input and old state, squashed into $[0,1]$.` },
          { do: `$z=\\sigma(0.8\\cdot1+0.2\\cdot0.5)=\\sigma(0.90)$.`, why: `Update gate, separate weights.` },
          { do: `$\\tilde{h}=\\tanh(1.0\\cdot1+0.4\\cdot(r\\cdot0.5))$.`, why: `Candidate sees the old state only through $r\\odot h$.` },
          { do: `$h^{&lt;t&gt;}=(1-z)\\tilde{h}+z\\cdot0.5$.`, why: `PyTorch blend; $z$ near 1 keeps the old state.` }
        ],
        answer: `$r=0.5866$, $z=0.7109$, $\\tilde{h}=0.8066$, $h^{&lt;t&gt;}=0.5886$. Since $z\\approx0.71$ is high, the state barely moves from $0.5$.`
      },
      {
        q: `ABLATION (long-gap memory). We train a tanh RNN and a GRU on the same task: a +1/-1 cue at step 0, then $T-1$ blank steps, recall the cue at the end. We sweep the gap $T$. In our run (gaps 5, 15, 25, 35) the RNN scored [1.0, 1.0, 1.0, 0.514] and the GRU scored [1.0, 1.0, 1.0, 1.0]. What does this show, and which mechanism explains the GRU's last value?`,
        steps: [
          { do: `Compare the two models at short gaps.`, why: `At $T\\le25$ both are perfect — the gap is short enough that even a plain RNN carries one bit.` },
          { do: `Look at the longest gap $T=35$.`, why: `The RNN collapses to $0.514$ (coin-flip) while the GRU stays at $1.0$ — the qualitative split the paper's long-sentence analysis predicts.` },
          { do: `Attribute the GRU's success.`, why: `When the update gate $z\\approx1$, $h^{&lt;t&gt;}\\approx h^{&lt;t-1&gt;}$: the cue is copied forward almost unchanged across all 35 blanks, and the gradient rides that near-identity path back undamped.` }
        ],
        answer: `Both cells handle short gaps; only the GRU survives the long gap (RNN $\\to$ chance at $T=35$, GRU $=1.0$). The update gate's near-identity carry ($z\\approx1$) is what preserves the bit and the gradient across the gap. (Numbers are our small toy run, seed 0 — not the paper's reported figures; the reproducible effect is the split, not the exact step.)`
      },
      {
        q: `Why does breaking the gate ordering (slicing $[z,r,n]$ instead of $[r,z,n]$) usually still produce sensible-looking outputs but fail torch.allclose?`,
        steps: [
          { do: `Note $r$ and $z$ have identical functional form (sigmoid of a linear map).`, why: `Swapping them still yields valid gates in $[0,1]$, so nothing crashes and outputs look reasonable.` },
          { do: `But the learned weight blocks differ.`, why: `PyTorch's first block was trained/initialised as the reset weights; using it as the update gate changes which numbers multiply where.` }
        ],
        answer: `The shapes and ranges all match, so you get plausible numbers — but you've fed the reset weights into the update slot and vice-versa, so the result differs from nn.GRUCell and allclose returns False. The lesson: matching a primitive means matching its exact weight packing, not just its formula shape.`
      }
    ]
  });

  window.CODE["paper-gru"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Track A. Build a GRU cell from raw tensors and prove it equals nn.GRUCell with torch.allclose, then recompute ` +
      `the worked example (r=0.5866, z=0.7109, h_tilde=0.8066, h_new=0.5886). PyTorch packs weight_ih/weight_hh as ` +
      `[r, z, n]; the reset gate multiplies only the hidden contribution of the candidate; the blend is (1-z)*n + z*h. ` +
      `torch and torchvision are preinstalled in Colab — never pip-install them.`,
    code: `import torch, torch.nn as nn
torch.manual_seed(0)

in_dim, hid = 3, 4
cell = nn.GRUCell(in_dim, hid)          # the reference we must match

# --- pull PyTorch's packed weights, sliced in order [r, z, n] ---
Wi, Wh = cell.weight_ih, cell.weight_hh           # (3*hid, in_dim), (3*hid, hid)
bi, bh = cell.bias_ih, cell.bias_hh               # (3*hid,), (3*hid,)
Wir, Wiz, Win = Wi[:hid], Wi[hid:2*hid], Wi[2*hid:]
Whr, Whz, Whn = Wh[:hid], Wh[hid:2*hid], Wh[2*hid:]
bir, biz, bin = bi[:hid], bi[hid:2*hid], bi[2*hid:]
bhr, bhz, bhn = bh[:hid], bh[hid:2*hid], bh[2*hid:]

def my_gru(x, h):                                  # the four GRU equations, by hand
    r = torch.sigmoid(x @ Wir.T + bir + h @ Whr.T + bhr)          # reset gate
    z = torch.sigmoid(x @ Wiz.T + biz + h @ Whz.T + bhz)          # update gate
    n = torch.tanh(x @ Win.T + bin + r * (h @ Whn.T + bhn))       # candidate; r gates hidden part only
    return (1 - z) * n + z * h                                    # PyTorch blend

x  = torch.randn(2, in_dim)
h0 = torch.randn(2, hid)
mine, ref = my_gru(x, h0), cell(x, h0)
print("allclose:", torch.allclose(mine, ref, atol=1e-6))         # -> True
print("max abs diff:", (mine - ref).abs().max().item())          # ~1.2e-7

# --- use it in a 2-line net (roll a GRU cell over a sequence) ---
def gru_seq(X):                                    # X: (batch, T, in_dim)
    h = torch.zeros(X.size(0), hid)
    for t in range(X.size(1)): h = my_gru(X[:, t, :], h)
    return h
print("final state shape:", tuple(gru_seq(torch.randn(2, 5, in_dim)).shape))

# --- recompute the WORKED EXAMPLE (scalar, no bias) and check the lesson numbers ---
import math
sig = lambda v: 1/(1+math.exp(-v))
x_s, h_p = 1.0, 0.5
r  = sig(0.5*x_s + (-0.3)*h_p)                     # 0.5866
z  = sig(0.8*x_s + 0.2*h_p)                        # 0.7109
ht = math.tanh(1.0*x_s + 0.4*(r*h_p))             # 0.8066
hn = (1-z)*ht + z*h_p                              # 0.5886
print(f"worked: r={r:.4f} z={z:.4f} h_tilde={ht:.4f} h_new={hn:.4f}")`
  };

  window.CODEVIZ["paper-gru"] = {
    question: "Give a tanh RNN and a GRU the same task — a +1/-1 cue at step 0, then a run of blanks, recall the cue at the end. As we stretch the gap, which fails first?",
    charts: [
      {
        type: "line",
        title: "Recall accuracy vs gap length T (cue at t=0, readout at t=T-1)",
        xlabel: "gap length T (steps between cue and readout)",
        ylabel: "held-out accuracy",
        series: [
          {
            name: "vanilla tanh RNN",
            color: "#f85149",
            points: [
              { x: 5,  y: 1.0 },
              { x: 15, y: 1.0 },
              { x: 25, y: 1.0 },
              { x: 35, y: 0.514 }
            ]
          },
          {
            name: "GRU",
            color: "#7ee787",
            points: [
              { x: 5,  y: 1.0 },
              { x: 15, y: 1.0 },
              { x: 25, y: 1.0 },
              { x: 35, y: 1.0 }
            ]
          }
        ]
      }
    ],
    caption: "Our small-scale run (PyTorch, seed 0; data generator seeds 1 train / 2 test), not the paper's reported numbers. For each gap length T we trained a single-layer nn.RNN (tanh) and a single-layer nn.GRU (hidden size 16) + a linear head for 400 Adam steps on a recall task: a +1/-1 cue appears only at step 0, every later step is a blank (zero), and the model must report the cue's sign at the last step. Up to T=25 both cells are perfect (1.000). At T=35 the vanilla RNN collapses to chance (0.514) while the GRU still recalls perfectly (1.000) — its update gate can hold z near 1 and copy the cue forward across all 35 blanks, so the gradient also survives. This reproduces the paper's qualitative point that the recurrence handles short sequences but a plain RNN degrades as the span grows, whereas the gated unit bridges it. (Exact crossover gap varies by seed/hidden-size; the reproducible effect is the RNN-collapses / GRU-holds split at a long gap.)",
    code: `import torch, torch.nn as nn
def make_batch(n, T, seed):
    g = torch.Generator().manual_seed(seed)
    bit = torch.randint(0, 2, (n,), generator=g)
    seq = torch.zeros(n, T, 1); seq[:, 0, 0] = bit.float()*2 - 1   # cue at step 0, blanks after
    return seq, bit
class Net(nn.Module):
    def __init__(self, kind, hid=16):
        super().__init__()
        self.rnn = (nn.RNN(1, hid, batch_first=True, nonlinearity='tanh')
                    if kind == 'rnn' else nn.GRU(1, hid, batch_first=True))
        self.fc = nn.Linear(hid, 2)
    def forward(self, x):
        out, _ = self.rnn(x); return self.fc(out[:, -1])
def train_eval(kind, T, epochs=400):
    torch.manual_seed(0)
    net = Net(kind); opt = torch.optim.Adam(net.parameters(), lr=0.01)
    lossf = nn.CrossEntropyLoss(); Xtr, ytr = make_batch(256, T, 1)
    for _ in range(epochs):
        opt.zero_grad(); lossf(net(Xtr), ytr).backward(); opt.step()
    Xte, yte = make_batch(512, T, 2)
    with torch.no_grad(): return round((net(Xte).argmax(1) == yte).float().mean().item(), 3)
for T in [5, 15, 25, 35]:
    print(f"T={T:2d}: RNN={train_eval('rnn', T):.3f}  GRU={train_eval('gru', T):.3f}")
# T= 5: RNN=1.000  GRU=1.000
# T=15: RNN=1.000  GRU=1.000
# T=25: RNN=1.000  GRU=1.000
# T=35: RNN=0.514  GRU=1.000`
  };
})();
