/* Paper lesson — Sequence to Sequence Learning with Neural Networks (Sutskever, Vinyals, Le; 2014).
   Grounded from arXiv:1409.3215 (abstract + ar5iv HTML). Key facts cited inline:
     - Eq. 1 (Section 2): the conditional probability p(y_1..y_T' | x_1..x_T) = prod_t p(y_t | v, y_<t).
     - Section 3.3: reversing the SOURCE word order dropped test perplexity 5.8 -> 4.7 and raised
       test BLEU 25.9 -> 30.6 (quoted from the paper).
     - Section 3.4 / 3.6 (Table 1): 4-layer LSTM, 1000 cells/layer, 384M params; ensemble of 5 reversed
       LSTMs reached 34.81 BLEU on WMT'14 En->Fr vs 33.30 SMT baseline.
   Track B (architecture): build an LSTM encoder-decoder from nn.LSTM/nn.Embedding on a TOY copy task;
   reproduce the QUALITATIVE reverse-input effect (reverse=True learns faster + higher token accuracy).
   The LSTM cell itself is owned by paper-lstm / dl-lstm-gru; we import nn.LSTM and verify ONE cell step
   with torch.allclose so the learner sees the gate math is the real thing, then compose the seq2seq net.
   Every number in CODEVIZ is OUR small run, not the paper's reported figure. */
(function () {
  window.LESSONS.push({
    id: "paper-seq2seq",
    title: "seq2seq — Sequence to Sequence Learning with Neural Networks (2014)",
    tagline: "Read a whole input sequence into one vector with an LSTM, then generate the output sequence with another LSTM.",
    module: "Papers · Sequence & NLP",
    track: "architecture",

    paper: {
      authors: "Ilya Sutskever, Oriol Vinyals, Quoc V. Le",
      org: "Google",
      year: 2014,
      venue: "arXiv preprint (arXiv:1409.3215); NeurIPS (NIPS) 2014",
      citations: "",
      arxiv: "https://arxiv.org/abs/1409.3215",
      code: ""
    },

    conceptLink: null,
    partOf: [
      { capstone: "capstone-sentiment", step: 3, builds: "the LSTM encoder-decoder — read a sentence into one context vector, then decode" }
    ],
    prereqs: ["dl-rnn", "dl-lstm-gru", "dl-language-model", "pt-nn-module", "pt-autograd"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> A <b>recurrent neural network</b> (RNN) reads a sequence one step at a time, keeping a
       running <b>hidden state</b> (a vector of numbers that summarizes everything seen so far). RNNs are great when
       the input and output line up one-for-one &mdash; one label per input step. But many tasks map a <i>whole
       input sequence</i> to a <i>whole output sequence of a different length</i>: translating an English sentence
       to French, or answering a question. There is no fixed alignment between the two.</p>
       <p>Before this paper, the strong machine-translation systems were <b>phrase-based statistical machine
       translation</b> (SMT) &mdash; hand-engineered pipelines that stitch together translated phrases. The paper's
       question (Section 1): can a single neural network, trained end-to-end, map an input sequence to an output
       sequence of arbitrary length and do it well? A plain RNN struggles because it would have to emit the output
       <i>as it reads</i>, with no way to wait until it has seen the entire input.</p>`,

    contribution:
      `<p>The paper introduces the <b>sequence-to-sequence (seq2seq) encoder-decoder</b> (Section 2):</p>
       <ul>
         <li><b>An encoder LSTM</b> reads the input sequence and compresses it into a single fixed-length
         <b>context vector</b> $v$ &mdash; its final hidden (and cell) state. ("LSTM" = Long Short-Term Memory, a
         kind of RNN cell with gates that let it remember information over many steps.)</li>
         <li><b>A decoder LSTM</b> is initialized from $v$ and generates the output sequence one token at a time,
         feeding each predicted token back in as the next input.</li>
         <li><b>The reverse-input trick</b> (Section 3.3): feed the <i>source</i> sequence to the encoder in
         <b>reversed order</b> (the target is left as-is). This single change "improved the LSTM's performance
         markedly," because it shortens the time lag between corresponding input and output words.</li>
       </ul>
       <p>Two separate, deep (4-layer) LSTMs are used &mdash; one for reading, one for writing &mdash; with no
       fixed alignment baked in.</p>`,

    whyItMattered:
      `<p>seq2seq made <b>end-to-end neural sequence transduction</b> practical: one network, trained by gradient
       descent on (input, output) pairs, beat a mature phrase-based SMT system on a large translation benchmark
       (Section 3.6). It became the template for neural machine translation, summarization, dialogue, and speech.
       Its main limitation &mdash; cramming an entire sentence into one fixed vector &mdash; directly motivated
       <b>attention</b> (Bahdanau 2014; the <code>paper-bahdanau-attention</code> lesson), which lets the decoder
       look back at every encoder state instead of just the last one. That line of work led straight to the
       Transformer and modern large language models. The encoder-decoder shape you build here is the same shape at
       the heart of the sentiment capstone.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Section 2 (The model)</b> &mdash; the encoder-decoder idea and <b>Equation 1</b>, the conditional
         probability the decoder factorizes.</li>
         <li><b>Section 3.3 (Reversing the Source Sentences)</b> &mdash; the reverse-input trick and the numbers it
         moved: the paper reports test perplexity dropping from $5.8$ to $4.7$ and test BLEU rising from $25.9$ to
         $30.6$.</li>
         <li><b>Section 3.4 (Training details)</b> &mdash; 4 LSTM layers, 1000 cells per layer, 384M parameters.</li>
       </ul>
       <p><b>Skim:</b> Section 3.6 and <b>Table 1</b> for the headline BLEU numbers, and Section 3.7 for the
       2D-projection plot of sentence vectors. You do not need to memorize the benchmark figures.</p>
       <p><b>Read alongside:</b> the LSTM cell math itself is covered in the <code>dl-lstm-gru</code> concept lesson
       and the <code>paper-lstm</code> paper lesson (Hochreiter &amp; Schmidhuber, 1997). This paper <i>uses</i> the
       LSTM as a building block; here we import it and focus on the encoder-decoder composition.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> We train a seq2seq LSTM on a tiny <b>copy</b> task: the output sequence must
       equal the input sequence (a stand-in for the roughly left-to-right alignment of translation). We train it
       two ways &mdash; once feeding the input in <b>normal</b> order, once feeding it <b>reversed</b> (the paper's
       trick). Which one learns the copy faster and ends more accurate? Write your guess, then look at the two loss
       curves in the CODEVIZ.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Build the encoder-decoder from PyTorch primitives
       (<code>nn.Embedding</code>, two <code>nn.LSTM</code>s, one <code>nn.Linear</code>). You do <i>not</i> rebuild
       the LSTM cell &mdash; that is owned by <code>paper-lstm</code>; here you wire the two LSTMs together:</p>
       <ul>
         <li>Embed the source, optionally reverse it:
         <code># TODO: if reverse_input: src = torch.flip(src, dims=[1])</code></li>
         <li>Run the encoder; keep its <b>final</b> hidden and cell state as the context $v$:
         <code># TODO: _, (h, c) = self.enc(self.emb(src))</code></li>
         <li>Run the decoder <i>initialized from</i> $(h, c)$ over the teacher-forced target input:
         <code># TODO: dec_out, _ = self.dec(self.emb(tgt_in), (h, c))</code></li>
         <li>Project decoder outputs to vocabulary logits:
         <code># TODO: return self.out(dec_out)</code></li>
       </ul>
       <p>The CODE cell is the full reference. It also includes a <code>torch.allclose</code> check that one
       <code>nn.LSTMCell</code> step equals the hand-written gate equations &mdash; proof the imported LSTM really
       is the gate math from the LSTM lesson.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>seq2seq treats translation (or any sequence-to-sequence map) as <b>conditional language modeling</b>:
       given the input, generate the output one token at a time, each token conditioned on the input <i>and</i> the
       tokens already produced. The pieces:</p>
       <ol>
         <li><b>Encode.</b> Run an LSTM over the input tokens $x_1,\\dots,x_T$. After the last token, its hidden
         state (together with its cell state) is a single fixed-length vector $v$ &mdash; the <b>context vector</b>
         &mdash; that is meant to summarize the whole input. The encoder produces <i>no</i> output tokens; we only
         keep its final state.</li>
         <li><b>Initialize the decoder.</b> A <i>second</i> LSTM starts from $v$. So the decoder begins "knowing"
         the entire input through this one vector.</li>
         <li><b>Decode.</b> Feed a start token, get a probability distribution over the next output word, pick a
         word, feed it back in, and repeat &mdash; until an end-of-sequence token. Each step's probability is
         conditioned on $v$ and all previously generated words (that is Eq. 1).</li>
         <li><b>Train with teacher forcing.</b> During training we feed the <i>true</i> previous target word (not the
         model's guess) as the decoder input, and minimize the negative log-likelihood of the correct next word.
         This is what makes the whole thing trainable end-to-end by backpropagation.</li>
       </ol>
       <p>The encoder and decoder are <b>different</b> LSTMs (different weights). The paper also stacks <b>4 layers</b>
       and, crucially, <b>reverses the source</b> (Section 3.3): if the input is fed back-to-front, the first input
       word ends up <i>closest in time</i> to where the first output word is generated, so short-range dependencies
       become easy for gradient descent to learn. The paper calls this reducing the "minimal time lag."</p>`,

    architecture:
      `<p><b>The deep LSTM encoder-decoder, component by component (Section 3.4).</b> Two separate stacks of LSTMs,
       each <b>4 layers deep</b> with <b>1000 cells per layer</b>, plus embeddings and an output softmax:</p>
       <ol>
         <li><b>Input embedding.</b> Each source token (from an input vocabulary of <b>160,000</b> words) is mapped to
         a <b>1000-dimensional</b> learned word vector.</li>
         <li><b>Encoder stack.</b> A 4-layer LSTM reads the embedded source tokens left to right — but on the
         <b>reversed</b> source order (Section 3.3). Layer 1 reads the embeddings; each higher layer reads the hidden
         states of the layer below. The encoder emits no output words. After the last token (the
         $\\langle\\text{EOS}\\rangle$ marker), its full state &mdash; the hidden and cell state of all 4 layers,
         <b>8000 real numbers</b> total &mdash; is the fixed context vector $v$.</li>
         <li><b>State hand-off.</b> $v$ is copied in as the <b>initial</b> hidden+cell state of the decoder stack.
         This single vector is the <i>only</i> path by which the input reaches the decoder (the bottleneck attention
         later removes).</li>
         <li><b>Decoder stack.</b> A <i>second</i>, independent 4-layer LSTM (different weights from the encoder).
         At each step it takes the embedding of the previous output token (during training, the true previous target
         &mdash; teacher forcing; at test time, its own previous prediction) and updates its 4-layer state.</li>
         <li><b>Output projection + softmax.</b> A linear map $W^{yh}$ turns the top decoder layer's hidden state into
         one logit per output word (output vocabulary of <b>80,000</b>), and a softmax gives the next-token
         distribution $p(y_t\\mid v, y_{\\lt t})$.</li>
         <li><b>Decoding loop.</b> A left-to-right <b>beam search</b> (beam size $B$, typically 2&ndash;12) keeps the
         $B$ best partial hypotheses, extending and re-pruning each step until $\\langle\\text{EOS}\\rangle$.</li>
       </ol>
       <p><b>Size.</b> The full model has <b>384M parameters</b>, of which <b>64M</b> are the pure recurrent
       connections (32M in the encoder LSTM, 32M in the decoder LSTM); the rest are the large input/output embedding
       and softmax matrices. Our CODE builds a <b>1-layer</b> toy version of exactly this shape so it trains in a
       browser; the deep 4-layer stack and 160k/80k vocabularies are the paper's, not ours.</p>`,

    symbols: [
      { sym: "$x_1,\\dots,x_T$", desc: "the input sequence: $T$ tokens (e.g. source-language words). $T$ is the input length." },
      { sym: "$y_1,\\dots,y_{T'}$", desc: "the output sequence: $T'$ tokens. Its length $T'$ can differ from the input length $T$." },
      { sym: "$T$", desc: "the number of tokens in the input." },
      { sym: "$T'$", desc: "the number of tokens in the output (read 'T-prime'); generally not equal to $T$." },
      { sym: "$v$", desc: "the context vector: the encoder LSTM's final hidden state (with its cell state). One fixed-length vector that summarizes the whole input." },
      { sym: "$\\langle\\text{EOS}\\rangle$", desc: "the end-of-sequence token appended to every sentence; it lets the model define a probability over output sequences of any length and tells the decoder when to stop." },
      { sym: "$p(y_t \\mid v, y_1,\\dots,y_{t-1})$", desc: "the model's probability of the next output token $y_t$ given the context $v$ and all previously generated tokens (the bar means 'given')." },
      { sym: "$\\prod_{t=1}^{T'}$", desc: "a product over the $T'$ output steps: multiply the per-step probabilities together to get the probability of the whole output." },
      { sym: "$\\operatorname{sigm}$ / $\\sigma$", desc: "the logistic sigmoid $1/(1+e^{-z})$ ('sigm' is the paper's spelling); squashes any real number into $(0,1)$." },
      { sym: "$\\operatorname{softmax}$", desc: "turns a vector of real-valued logits $z$ into a probability distribution: $\\operatorname{softmax}(z)_w = e^{z_w}/\\sum_{w'} e^{z_{w'}}$ (each entry in $(0,1)$, all summing to 1)." },
      { sym: "$W^{hx},\\ W^{hh},\\ W^{yh}$", desc: "weight matrices of the plain RNN: input-to-hidden, hidden-to-hidden, and hidden-to-output. In the LSTM the gate-specific $W_i,W_f,W_g,W_o,U_\\cdot$ play the analogous role." },
      { sym: "$h_t^{\\text{enc}},\\ h_t^{\\text{dec}}$", desc: "the encoder's and decoder's hidden state at step $t$; the encoder's final one (with its cell state) is $v$." },
      { sym: "$z_t,\\ z_{t,w}$", desc: "the decoder's output logits at step $t$ ($z_t = W^{yh} h_t^{\\text{dec}}$): $z_{t,w}$ is the raw score for vocabulary word $w$ before the softmax." },
      { sym: "$\\mathcal{V}$", desc: "the output vocabulary (set of possible output tokens); $|\\mathcal{V}|$ is its size (80,000 in the paper)." },
      { sym: "$\\mathcal{S}$", desc: "the training set of (target sentence $T$, source sentence $S$) pairs; $|\\mathcal{S}|$ is the number of pairs." },
      { sym: "$T,\\ S$", desc: "in the objective, $T$ is a target (output) sentence and $S$ is its source (input) sentence — uppercase, distinct from the lowercase length $T$ above." },
      { sym: "$\\hat{T}$", desc: "the decoded translation: the output sentence the model picks, i.e. $\\arg\\max_T p(T\\mid S)$ (approximated by beam search)." },
      { sym: "$\\arg\\max_T$", desc: "the value of $T$ that maximizes the expression — here, the most probable output sequence." },
      { sym: "$B$", desc: "the beam width: how many partial hypotheses the beam-search decoder keeps at each step (e.g. 1, 2, or 12)." },
      { sym: "$h_t$", desc: "the LSTM hidden state at step $t$: a vector summarizing the sequence up to step $t$ (also the cell's output)." },
      { sym: "$c_t$", desc: "the LSTM cell state at step $t$: the cell's internal memory, separate from $h_t$; the gates decide what to keep in it." },
      { sym: "$i_t,\\ f_t,\\ o_t$", desc: "the input, forget, and output gates of the LSTM at step $t$ — numbers in $(0,1)$ that control how much new info enters, how much memory is kept, and how much memory is read out." },
      { sym: "$g_t$", desc: "the candidate update at step $t$: the new content (squashed by $\\tanh$ to $(-1,1)$) that the input gate may write into the cell." },
      { sym: "$\\sigma$", desc: "the logistic sigmoid $\\sigma(z)=1/(1+e^{-z})$, which squashes any real number into $(0,1)$ — used for the gates." },
      { sym: "$\\tanh$", desc: "the hyperbolic tangent, which squashes any real number into $(-1,1)$ — used for the candidate $g_t$ and to read the cell out." },
      { sym: "$\\odot$", desc: "element-wise (Hadamard) multiplication: multiply two vectors slot-by-slot." }
    ],

    formula:
      `$$h_t = \\operatorname{sigm}\\!\\big(W^{hx} x_t + W^{hh} h_{t-1}\\big),
        \\qquad y_t = W^{yh} h_t \\qquad\\text{(Section 2: the plain-RNN recurrence seq2seq generalizes)}$$
       <p>The vanilla RNN: at each step the hidden state $h_t$ is a squashed linear mix of the current input $x_t$
       and the previous hidden state $h_{t-1}$, and an output $y_t$ is read off it. The paper swaps this fragile cell
       for an LSTM (below) but keeps the same read-in / read-out shape.</p>
       $$v = h_T^{\\text{enc}} \\;=\\; \\text{Encoder-LSTM}\\big(x_1,\\dots,x_T,\\langle\\text{EOS}\\rangle\\big)
         \\qquad\\text{(Section 2: the encoder squashes the whole input into one fixed vector }v)$$
       <p>The encoder LSTM reads the input (terminated by the end-of-sequence token $\\langle\\text{EOS}\\rangle$) and
       emits no words; only its <i>final</i> hidden+cell state is kept, and that pair is the context vector $v$.</p>
       $$p\\big(y_1,\\dots,y_{T'} \\mid x_1,\\dots,x_T\\big)
        \\;=\\; \\prod_{t=1}^{T'} p\\big(y_t \\mid v,\\, y_1,\\dots,y_{t-1}\\big)
        \\qquad\\text{(Eq. 1, Section 2)}$$
       <p>The decoder factorizes the output sequence's probability as a product of per-step conditionals, each one
       conditioned on $v$ and the tokens generated so far. Every $\\langle\\text{EOS}\\rangle$-terminated sequence of
       any length gets a well-defined probability.</p>
       $$p\\big(y_t \\mid v, y_1,\\dots,y_{t-1}\\big)
         \\;=\\; \\operatorname{softmax}\\!\\big(W^{yh} h_t^{\\text{dec}}\\big)
         \\;=\\; \\frac{\\exp\\!\\big(z_{t,\\,y_t}\\big)}{\\sum_{w=1}^{|\\mathcal{V}|}\\exp\\!\\big(z_{t,\\,w}\\big)},
         \\qquad z_t = W^{yh} h_t^{\\text{dec}}
         \\qquad\\text{(Section 2: the per-step softmax over the vocabulary)}$$
       <p>Each decoder step projects its hidden state $h_t^{\\text{dec}}$ to one logit $z_{t,w}$ per vocabulary word
       $w$, then a softmax turns the logits into a probability distribution over the whole vocabulary $\\mathcal{V}$;
       the probability of the actual token $y_t$ is the highlighted factor of Eq. 1.</p>
       $$\\frac{1}{|\\mathcal{S}|}\\sum_{(T,S)\\in\\mathcal{S}} \\log p\\big(T \\mid S\\big)
         \\qquad\\text{(Section 2: the training objective — maximize average log-likelihood of correct translations)}$$
       <p>Training maximizes, over the training set $\\mathcal{S}$ of (target $T$, source $S$) pairs, the average log
       probability the model assigns to the correct translation. Maximizing this sum of logs is exactly minimizing the
       summed per-token cross-entropy.</p>
       $$\\hat{T} \\;=\\; \\arg\\max_{T} \\; p\\big(T \\mid S\\big)
         \\qquad\\text{(Section 2: decode by finding the most likely translation)}$$
       <p>At test time we want the single most probable output sequence. Exact $\\arg\\max$ over all sequences is
       intractable, so the paper approximates it with a left-to-right <b>beam search</b>: keep the $B$ highest
       log-probability partial hypotheses, extend each by every vocabulary word, re-prune to the top $B$, and finish a
       hypothesis when it emits $\\langle\\text{EOS}\\rangle$. The paper found a beam of $B=2$ already captures most of
       the gain, and even $B=1$ (greedy) works well (Section 3.6).</p>
       $$\\begin{aligned}
         i_t &= \\sigma(W_i x_t + U_i h_{t-1} + b_i), &\\quad f_t &= \\sigma(W_f x_t + U_f h_{t-1} + b_f)\\\\
         g_t &= \\tanh(W_g x_t + U_g h_{t-1} + b_g), &\\quad o_t &= \\sigma(W_o x_t + U_o h_{t-1} + b_o)\\\\
         c_t &= f_t \\odot c_{t-1} + i_t \\odot g_t, &\\quad h_t &= o_t \\odot \\tanh(c_t)
       \\end{aligned}\\qquad\\text{(the LSTM cell that replaces the plain-RNN recurrence above)}$$`,

    whatItDoes:
      `<p><b>RNN recurrence</b> ($h_t=\\operatorname{sigm}(W^{hx}x_t+W^{hh}h_{t-1})$, $y_t=W^{yh}h_t$): the standard
       recurrent net the paper generalizes &mdash; the hidden state at each step blends the current input and the last
       hidden state, then projects to an output. It works only when input and output align step-for-step; seq2seq
       breaks that limitation by using two of these (an LSTM version), one to read and one to write.</p>
       <p><b>Encoder</b> ($v=h_T^{\\text{enc}}$): run the encoder LSTM over the whole (reversed) input; its final
       hidden+cell state is the single fixed vector $v$ &mdash; the entire input compressed to 8000 numbers in the
       paper.</p>
       <p><b>Eq. 1</b> (the product): the probability of the whole output sequence equals the <i>product</i> of the
       per-step probabilities, each conditioned on $v$ and the tokens already generated. The decoder LSTM produces
       exactly these per-step distributions: it factorizes one hard problem ("produce the whole sentence") into many
       easy ones ("produce the next word").</p>
       <p><b>Per-step softmax</b>: each decoder step projects its hidden state to one logit per vocabulary word, and
       the softmax normalizes those logits into a probability distribution over all words; the probability of the
       actual next word $y_t$ is one factor of Eq. 1.</p>
       <p><b>Training objective</b> ($\\frac{1}{|\\mathcal{S}|}\\sum \\log p(T\\mid S)$): make the correct target
       sentences as probable as possible on average over the training set &mdash; equivalently, minimize summed
       per-token cross-entropy by backprop through both LSTMs.</p>
       <p><b>Decoding</b> ($\\hat{T}=\\arg\\max_T p(T\\mid S)$): at test time, output the most probable sequence;
       since that search is intractable, approximate it with a small beam search.</p>
       <p><b>The LSTM cell block</b> is the cell the paper relies on (it cites Graves' formulation rather than printing
       the gates). It is here so the worked example below has something concrete to compute, and so you can see what
       <code>nn.LSTM</code> does inside: the forget gate $f_t$ decides how much old memory $c_{t-1}$ to keep, the
       input gate $i_t$ decides how much new content $g_t$ to write, and the output gate $o_t$ decides how much of the
       memory to expose as the hidden state $h_t$. Full derivation lives in <code>dl-lstm-gru</code> /
       <code>paper-lstm</code>.</p>`,

    derivation:
      `<p><b>Why Eq. 1 is exactly true</b> (no approximation): it is just the chain rule of probability. For any
       joint distribution, $p(y_1,\\dots,y_{T'}) = p(y_1)\\,p(y_2\\mid y_1)\\,p(y_3\\mid y_1,y_2)\\cdots$, i.e.
       $\\prod_t p(y_t\\mid y_{\\lt t})$. Conditioning everything additionally on the input (through $v$) gives Eq. 1.
       So the only modeling choice is <i>how</i> to compute each factor $p(y_t\\mid v, y_{\\lt t})$ &mdash; and that is
       what the decoder LSTM plus a softmax over the vocabulary does. Training maximizes the log of this product,
       which is a sum of per-token cross-entropy losses &mdash; exactly what <code>nn.CrossEntropyLoss</code>
       computes in the CODE.</p>
       <p>The LSTM gate equations are <i>not</i> re-derived here; that math (why gating fixes the vanishing-gradient
       problem of plain RNNs) belongs to the LSTM lesson. We import <code>nn.LSTM</code> and verify one step matches
       the gates with <code>torch.allclose</code>.</p>`,

    example:
      `<p><b>Worked numbers</b> for <i>one</i> LSTM step (scalar gates, so $h$ and $c$ are single numbers), starting
       from $h_{t-1}=0$, $c_{t-1}=0$, input $x_t=1$. We pick simple weights to make the arithmetic clean: input gate
       pre-activation $0.5$, forget gate pre-activation $1.0$, candidate pre-activation $1.0$, output gate
       pre-activation $0.5$ (these are $W_\\cdot x_t + b_\\cdot$ with $h_{t-1}=0$).</p>
       <ul>
         <li><b>Input gate:</b> $i_t=\\sigma(0.5)=1/(1+e^{-0.5})=0.62246$.</li>
         <li><b>Forget gate:</b> $f_t=\\sigma(1.0)=1/(1+e^{-1.0})=0.73106$.</li>
         <li><b>Candidate:</b> $g_t=\\tanh(1.0)=0.76159$.</li>
         <li><b>Output gate:</b> $o_t=\\sigma(0.5)=0.62246$.</li>
         <li><b>New cell:</b> $c_t=f_t\\odot c_{t-1} + i_t\\odot g_t = 0.73106\\cdot 0 + 0.62246\\cdot 0.76159 = 0.47406$.</li>
         <li><b>New hidden:</b> $h_t=o_t\\odot\\tanh(c_t)=0.62246\\cdot\\tanh(0.47406)=0.62246\\cdot 0.44150 = 0.27480$.</li>
       </ul>
       <p>The CODE recomputes these exact numbers, and separately checks a full vector <code>nn.LSTMCell</code> step
       against the hand-written gates with <code>torch.allclose</code> (returns <code>True</code>).</p>`,

    recipe:
      `<p><b>seq2seq, as numbered steps (Section 2):</b></p>
       <ol>
         <li>Embed each input token into a vector; (paper's trick) <b>reverse</b> the input token order.</li>
         <li>Run the <b>encoder LSTM</b> over the (reversed) embedded input; keep only its <b>final</b> hidden and
         cell state &mdash; that pair is the context $v$.</li>
         <li>Initialize the <b>decoder LSTM</b> with $v$.</li>
         <li>At each output step, embed the previous target token, run one decoder step, project to vocabulary
         logits, and take the softmax to get $p(y_t\\mid v, y_{\\lt t})$.</li>
         <li><b>Train</b> with teacher forcing (feed the true previous token) and per-token cross-entropy; backprop
         through both LSTMs.</li>
         <li><b>Infer</b> by feeding the model's own previous output back in (autoregressive), stopping at the
         end-of-sequence token. The paper uses a small beam search; greedy decoding is the simplest case.</li>
       </ol>`,

    results:
      `<p>From the abstract and Section 3.6: on the WMT'14 English&rarr;French translation task, an <b>ensemble of 5
       reversed deep LSTMs</b> reached a <b>BLEU of 34.81</b>, beating a phrase-based SMT baseline of <b>33.30</b>
       (Table 1). Using the LSTM to <i>rerank</i> the SMT system's 1000-best lists raised BLEU to <b>36.5</b>. BLEU
       (BiLingual Evaluation Understudy) is a 0&ndash;100 score for how well a machine translation matches human
       references &mdash; higher is better. The reverse-input trick alone (Section 3.3) dropped test perplexity from
       $5.8$ to $4.7$ and raised test BLEU from $25.9$ to $30.6$. (Source: arXiv:1409.3215, abstract + Sections 3.3,
       3.6, Table 1.) The paper also reports the LSTM "did not have difficulty on long sentences."</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track B (architecture).</b> The LSTM <i>cell</i> is a primitive PyTorch already ships
       (<code>nn.LSTM</code> / <code>nn.LSTMCell</code>) and is owned by the <code>paper-lstm</code> lesson &mdash;
       so we <b>import</b> it, and only prove with one <code>torch.allclose</code> step that it is the gate math from
       the worked example. The <b>novel composition</b> you build by hand is the encoder-decoder: two separate LSTMs
       wired so the encoder's final state seeds the decoder, plus teacher-forced training and the source-reversal
       switch. We train it on a toy copy task and run the <b>ablation</b> that the paper's Section 3.3 highlights:
       reverse the source vs not, and watch the loss curve and token accuracy. The numbers are ours, on toy data
       &mdash; not the paper's translation BLEU.</p>`,

    pitfalls:
      `<ul>
         <li><b>Two separate LSTMs.</b> The encoder and decoder are different modules with different weights. A
         common bug is reusing one LSTM for both &mdash; that is a different (weight-tied) model.</li>
         <li><b>Carry the cell state too.</b> The context $v$ is the encoder's final <i>hidden and cell</i> state
         $(h, c)$, not just $h$. Forgetting $c$ throws away half the summary.</li>
         <li><b>Reverse the source, not the target.</b> The paper reverses only the <i>input</i> order; the target is
         left as-is. Reverse both and you have changed the task.</li>
         <li><b>Teacher forcing vs free-running.</b> In training we feed the true previous token; at inference we feed
         the model's own prediction. A model that looks perfect with teacher forcing can drift when decoding on its
         own &mdash; the CODE shows both.</li>
         <li><b>One vector is a bottleneck.</b> Squeezing a long input into a single fixed vector limits long
         sequences. This is the exact weakness attention (Bahdanau 2014) was invented to remove &mdash; mentioned
         here so you know where the story goes next.</li>
         <li><b>Don't over-read a tiny run.</b> Our copy task uses short random sequences. The <i>direction</i> of the
         reverse-input effect is the reproducible point, not any single accuracy number.</li>
       </ul>`,

    recall: [
      "State Eq. 1: write $p(y_1,\\dots,y_{T'}\\mid x_1,\\dots,x_T)$ as a product, and say what each factor is conditioned on.",
      "What exactly is the context vector $v$, and which two states make it up?",
      "Why are the encoder and decoder two separate LSTMs?",
      "Describe the reverse-input trick and why it helps (what does 'minimal time lag' mean?).",
      "Define the LSTM gates $i_t, f_t, o_t$ and the cell update $c_t = f_t\\odot c_{t-1} + i_t\\odot g_t$.",
      "What is teacher forcing, and how does inference differ from training?"
    ],

    practice: [
      {
        q: `Recompute the worked LSTM step from $h_{t-1}=0,\\ c_{t-1}=0,\\ x_t=1$ but with the forget-gate pre-activation changed to $-2$ (all other pre-activations the same: input $0.5$, candidate $1.0$, output $0.5$). What are $c_t$ and $h_t$, and why is $c_t$ unchanged from the original?`,
        steps: [
          { do: `Gates: $i_t=\\sigma(0.5)=0.62246$, $f_t=\\sigma(-2)=0.11920$, $g_t=\\tanh(1)=0.76159$, $o_t=\\sigma(0.5)=0.62246$.`, why: `Only the forget gate changed.` },
          { do: `$c_t=f_t\\cdot c_{t-1}+i_t\\cdot g_t = 0.11920\\cdot 0 + 0.62246\\cdot 0.76159 = 0.47406$.`, why: `Since $c_{t-1}=0$, the forget gate multiplies zero — it has no effect on the first step.` },
          { do: `$h_t=o_t\\cdot\\tanh(c_t)=0.62246\\cdot\\tanh(0.47406)=0.27480$.`, why: `Same output gate and same $c_t$ as the original.` }
        ],
        answer: `$c_t=0.47406$, $h_t=0.27480$ — identical to the original worked example. The forget gate only scales the <i>previous</i> cell state $c_{t-1}$, which is $0$ here, so changing $f_t$ does nothing on the very first step. The forget gate only starts to matter once there is accumulated memory to forget.`
      },
      {
        q: `For a 3-token output, Eq. 1 gives $p(y_1,y_2,y_3\\mid x) = p(y_1\\mid v)\\,p(y_2\\mid v,y_1)\\,p(y_3\\mid v,y_1,y_2)$. If the decoder assigns the correct tokens probabilities $0.5,\\ 0.8,\\ 0.25$, what is the sequence probability and the total negative log-likelihood (the training loss summed over steps)?`,
        steps: [
          { do: `Sequence probability $= 0.5\\times 0.8\\times 0.25 = 0.1$.`, why: `Eq. 1 multiplies the per-step probabilities.` },
          { do: `Total NLL $= -\\ln(0.5)-\\ln(0.8)-\\ln(0.25) = 0.6931+0.2231+1.3863 = 2.3026$.`, why: `Cross-entropy loss is the negative log of each factor, summed (equivalently $-\\ln 0.1$).` },
          { do: `Check: $-\\ln(0.1)=2.3026$.`, why: `Sum of the logs equals the log of the product — same number.` }
        ],
        answer: `Sequence probability $=0.1$; total negative log-likelihood $=2.3026$. Training minimizes this sum; because logs turn the product into a sum, the loss is just the per-token cross-entropies added up — exactly what <code>nn.CrossEntropyLoss</code> does across the output positions.`
      },
      {
        q: `Ablation (from the CODE): on the toy copy task, flip <code>reverse_input</code> from <code>True</code> to <code>False</code> and retrain. Predict what happens to the loss curve and final token accuracy, and explain it using "time lag."`,
        steps: [
          { do: `Set reverse_input=False and retrain with the same seed and steps.`, why: `Isolates the source-reversal switch — the paper's Section 3.3 ablation.` },
          { do: `Compare the loss curves and the 5-seed mean token accuracy printed by the CODE.`, why: `The qualitative gap is the reproducible signal, not a single number.` },
          { do: `Reason about distances: with reverse_input=True the first source token ends nearest the decoder start, so the first output (which depends on it) has a short dependency.`, why: `That is the "minimal time lag" the paper describes.` }
        ],
        answer: `In our run, <code>reverse_input=True</code> learns the copy faster and reaches higher token accuracy (mean ≈ 0.80 over 5 seeds) than <code>reverse_input=False</code> (mean ≈ 0.54) — see the CODEVIZ curves. Reversing the source shortens the time lag between corresponding input and output tokens, so the LSTM's gradients have an easier short-range path to learn. This reproduces the <i>direction</i> of the paper's Section 3.3 effect (where it raised test BLEU 25.9 → 30.6) on toy data — our numbers, not the paper's.`
      }
    ]
  });

  window.CODE["paper-seq2seq"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build the seq2seq encoder-decoder from nn.Embedding + two nn.LSTMs + nn.Linear. First PROVE the imported ` +
      `LSTM is the real gate math: one nn.LSTMCell step matches hand-written i/f/g/o gates via torch.allclose, and ` +
      `we recompute the worked scalar example (i=0.62246, f=0.73106, g=0.76159, o=0.62246, c=0.47406, h=0.27480). ` +
      `Then train on a toy copy task two ways — source reversed vs not — and print the token accuracy gap that ` +
      `reproduces the paper's Section 3.3 reverse-input effect. Finally decode autoregressively. Runs in Colab ` +
      `(torch preinstalled).`,
    code: `import torch, torch.nn as nn
torch.manual_seed(0)

# ===== 1) THE ORACLE: one nn.LSTMCell step == hand-written i/f/g/o gates =====
torch.manual_seed(7)
cell = nn.LSTMCell(2, 2)
x  = torch.tensor([[1.0, -1.0]]); h0 = torch.zeros(1, 2); c0 = torch.zeros(1, 2)
gates = x @ cell.weight_ih.t() + h0 @ cell.weight_hh.t() + cell.bias_ih + cell.bias_hh
i_, f_, g_, o_ = gates.chunk(4, 1)                 # PyTorch packs gates as [i, f, g, o]
i_, f_, g_, o_ = torch.sigmoid(i_), torch.sigmoid(f_), torch.tanh(g_), torch.sigmoid(o_)
c1 = f_ * c0 + i_ * g_                              # cell update
h1 = o_ * torch.tanh(c1)                            # hidden update
h_ref, c_ref = cell(x, (h0, c0))                   # PyTorch's own LSTM step
print("LSTM cell allclose h:", torch.allclose(h1, h_ref, atol=1e-6),
      "| c:", torch.allclose(c1, c_ref, atol=1e-6))   # True True

# ===== 2) recompute the WORKED scalar example (h_{t-1}=c_{t-1}=0, x=1) =====
import math
i = 1/(1+math.exp(-0.5)); f = 1/(1+math.exp(-1.0))
g = math.tanh(1.0);        o = 1/(1+math.exp(-0.5))
c = f*0 + i*g;             h = o*math.tanh(c)
print(f"worked  i={i:.5f} f={f:.5f} g={g:.5f} o={o:.5f}")   # 0.62246 0.73106 0.76159 0.62246
print(f"worked  c={c:.5f} h={h:.5f}")                       # c=0.47406 h=0.27480

# ===== 3) the seq2seq encoder-decoder (Track B: compose imported LSTMs) =====
V, BOS, L, EMB, HID = 12, 10, 12, 20, 40           # vocab 0..9 + <bos>=10 + <eos>=11
def make_batch(n):
    src = torch.randint(0, 10, (n, L)); tgt = src.clone()   # COPY task: output == input
    return src, tgt

class Seq2Seq(nn.Module):
    def __init__(self, reverse_input):
        super().__init__()
        self.reverse_input = reverse_input
        self.emb = nn.Embedding(V, EMB)
        self.enc = nn.LSTM(EMB, HID, batch_first=True)       # encoder LSTM
        self.dec = nn.LSTM(EMB, HID, batch_first=True)       # decoder LSTM (separate weights)
        self.out = nn.Linear(HID, V)
    def forward(self, src, tgt_in):
        if self.reverse_input:
            src = torch.flip(src, dims=[1])                  # PAPER TRICK: reverse the source
        _, (h, c) = self.enc(self.emb(src))                  # context v = final (hidden, cell)
        dec_out, _ = self.dec(self.emb(tgt_in), (h, c))      # decoder seeded from v
        return self.out(dec_out)                             # (n, L, V) logits

def train(reverse_input, steps=500, seed=0):
    torch.manual_seed(seed)
    m = Seq2Seq(reverse_input)
    opt = torch.optim.Adam(m.parameters(), lr=3e-3); lossf = nn.CrossEntropyLoss()
    for s in range(steps):
        src, tgt = make_batch(64)
        bos = torch.full((64, 1), BOS)
        tgt_in = torch.cat([bos, tgt[:, :-1]], dim=1)        # teacher forcing
        loss = lossf(m(src, tgt_in).reshape(-1, V), tgt.reshape(-1))
        opt.zero_grad(); loss.backward(); opt.step()
    m.eval()
    with torch.no_grad():
        src, tgt = make_batch(500); bos = torch.full((500, 1), BOS)
        tgt_in = torch.cat([bos, tgt[:, :-1]], dim=1)
        acc = (m(src, tgt_in).argmax(-1) == tgt).float().mean().item()
    return m, acc

# ===== 4) ABLATION: reverse vs no-reverse, 5 seeds (paper Section 3.3) =====
accT = [train(True,  500, s)[1] for s in range(5)]
accF = [train(False, 500, s)[1] for s in range(5)]
print("token acc reverse=True :", round(sum(accT)/5, 3), [round(a,3) for a in accT])
print("token acc reverse=False:", round(sum(accF)/5, 3), [round(a,3) for a in accF])
#   -> reverse=True ~0.795  >  reverse=False ~0.544  (OUR toy run, not the paper's BLEU)

# ===== 5) autoregressive decode (free-running) with the reversed model =====
m, _ = train(True, 600, 0); m.eval()
with torch.no_grad():
    src, _ = make_batch(3)
    enc_in = torch.flip(src, dims=[1])
    _, (h, c) = m.enc(m.emb(enc_in))
    cur = torch.full((3, 1), BOS); outs = []
    for t in range(L):                                       # feed model's own output back in
        d, (h, c) = m.dec(m.emb(cur), (h, c))
        cur = m.out(d[:, -1]).argmax(-1, keepdim=True); outs.append(cur)
    gen = torch.cat(outs, 1)
for i in range(3):
    print("src", src[i].tolist(), "-> gen", gen[i].tolist())
# the first (freshest) tokens copy correctly; longer positions are harder on a 1-layer toy net`
  };

  window.CODEVIZ["paper-seq2seq"] = {
    question: "On a toy copy task, does reversing the source sequence (the paper's Section 3.3 trick) make the seq2seq LSTM learn faster and end more accurate than feeding it in normal order?",
    charts: [
      {
        type: "line",
        title: "Training loss: source reversed vs normal order (toy copy task, seed 0)",
        xlabel: "training step",
        ylabel: "cross-entropy loss",
        series: [
          {
            name: "reverse_input = True (paper trick)",
            color: "#7ee787",
            points: [
              { x: 0, y: 2.4901 }, { x: 50, y: 2.1021 }, { x: 100, y: 1.5689 },
              { x: 150, y: 1.2727 }, { x: 200, y: 1.0507 }, { x: 250, y: 0.8819 },
              { x: 300, y: 0.8349 }, { x: 350, y: 0.7380 }, { x: 400, y: 0.6817 },
              { x: 450, y: 0.5785 }, { x: 499, y: 0.5548 }
            ]
          },
          {
            name: "reverse_input = False (normal order)",
            color: "#f0883e",
            points: [
              { x: 0, y: 2.4901 }, { x: 50, y: 2.3107 }, { x: 100, y: 2.3073 },
              { x: 150, y: 2.2538 }, { x: 200, y: 2.1614 }, { x: 250, y: 2.0383 },
              { x: 300, y: 1.8781 }, { x: 350, y: 1.7851 }, { x: 400, y: 1.6863 },
              { x: 450, y: 1.5230 }, { x: 499, y: 1.4543 }
            ]
          }
        ]
      }
    ],
    caption: "Our small-scale run (PyTorch, seed 0 for the curves; 5 seeds for the accuracy), not the paper's reported BLEU. We trained an LSTM encoder-decoder on a toy copy task (output = input, length 12) for 500 steps, once feeding the source in reversed order and once in normal order — the only difference. Reversing the source (green) drives the cross-entropy down far faster and reaches a much lower loss; over 5 seeds it averages ~0.80 token accuracy versus ~0.54 for normal order. This reproduces the DIRECTION of the paper's Section 3.3 reverse-input effect (where it raised test BLEU 25.9 -> 30.6): reversing the source shortens the time lag between corresponding input and output tokens, giving the LSTM an easier short-range gradient path. The exact numbers are ours and noisy on so few steps; the reproducible point is that reversing helps.",
    code: `import torch, torch.nn as nn
V, BOS, L, EMB, HID = 12, 10, 12, 20, 40
def make_batch(n):
    src = torch.randint(0, 10, (n, L)); return src, src.clone()   # copy task

class Seq2Seq(nn.Module):
    def __init__(self, rev):
        super().__init__(); self.rev = rev
        self.emb = nn.Embedding(V, EMB)
        self.enc = nn.LSTM(EMB, HID, batch_first=True)
        self.dec = nn.LSTM(EMB, HID, batch_first=True)
        self.out = nn.Linear(HID, V)
    def forward(self, src, ti):
        if self.rev: src = torch.flip(src, dims=[1])
        _, (h, c) = self.enc(self.emb(src))
        d, _ = self.dec(self.emb(ti), (h, c)); return self.out(d)

def curve(rev, steps=500, seed=0):
    torch.manual_seed(seed)
    m = Seq2Seq(rev); opt = torch.optim.Adam(m.parameters(), 3e-3); lf = nn.CrossEntropyLoss()
    pts = []
    for s in range(steps):
        src, tgt = make_batch(64); bos = torch.full((64, 1), BOS)
        ti = torch.cat([bos, tgt[:, :-1]], 1)
        loss = lf(m(src, ti).reshape(-1, V), tgt.reshape(-1))
        opt.zero_grad(); loss.backward(); opt.step()
        if s % 50 == 0 or s == steps - 1: pts.append((s, round(loss.item(), 4)))
    return pts

print("reverse=True :", curve(True))     # the green curve plotted above
print("reverse=False:", curve(False))    # the orange curve plotted above`
  };
})();
