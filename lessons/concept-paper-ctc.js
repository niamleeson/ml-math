/* Paper lesson — "Connectionist Temporal Classification: Labelling Unsegmented Sequence Data
   with Recurrent Neural Networks", Alex Graves, Santiago Fernandez, Faustino Gomez, Juergen
   Schmidhuber (IDSIA / TU Munich), ICML 2006.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-ctc".
   GROUNDED from the official PDF cs.toronto.edu/~graves/icml_2006.pdf (no arXiv):
   - Sec 2, Eq. 1 (label error rate); Sec 3.1 Eq. 2 (path probability), Eq. 3 (labelling = sum over paths).
   - Sec 4.1 (CTC forward-backward): Eq. 5 forward-variable definition, the initialisation rules,
     Eq. 6 the alpha recursion (with the skip condition l'_s = blank or l'_{s-2} = l'_s), Eq. 7 the
     two-term merge alpha-bar, Eq. 8 p(l|x) = alpha_T(|l'|) + alpha_T(|l'|-1).
   - Sec 4.2 Eq. 12 the maximum-likelihood objective O^ML = -sum ln p(z|x).
   Track B (architecture): implement the CTC forward (alpha) recursion in NumPy on a tiny example
   (T=4 frames, target "ab") and verify -ln p(l|x) matches torch.nn.CTCLoss via np.allclose.
   Worked numbers: alpha[1,1] = (0.6+0.1)*0.5 = 0.35; the SKIP step alpha[2,3] = (0.18+0.12+0.35)*0.4
   = 0.26; p(l|x)=0.3304, loss=1.10745 (matches torch exactly). Ablation: drop the
   l'_s=l'_{s-2} skip rule on the repeated target "aa" -> wrongly low loss (0.402 vs correct 1.503).
   conceptLink null (CTC owns its own forward-backward math here). */
(function () {
  window.LESSONS.push({
    id: "paper-ctc",
    title: "CTC — Connectionist Temporal Classification (2006)",
    tagline: "Train a recurrent network to map an unsegmented input sequence to a shorter label string with no frame-by-frame labels: add a blank symbol, collapse repeats-and-blanks, and sum over every valid alignment with a forward-backward dynamic program.",
    module: "Papers · Sequence & NLP",
    track: "architecture",
    paper: {
      authors: "Alex Graves, Santiago Fernández, Faustino Gomez, Jürgen Schmidhuber",
      org: "IDSIA (Istituto Dalle Molle di Studi sull'Intelligenza Artificiale), Switzerland; TU München, Germany",
      year: 2006,
      venue: "Proceedings of the 23rd International Conference on Machine Learning (ICML 2006)",
      citations: "",
      url: "https://www.cs.toronto.edu/~graves/icml_2006.pdf",
      code: ""
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["dl-rnn", "dl-lstm-gru", "ml-softmax", "ml-likelihood"],

    // WHY READ IT
    problem:
      `<p><b>Unsegmented sequence labelling</b> means turning one long input stream into a much shorter
       string of labels &mdash; an audio waveform into the word "the", a line of handwriting into letters
       &mdash; <i>without being told which input frame goes with which label</i>. A <b>recurrent neural
       network</b> (RNN &mdash; a network that reads a sequence one step at a time, carrying a memory
       between steps; see <code>dl-rnn</code>) emits one output per input frame. But there are far more
       frames than labels, and you do not know the boundaries. The paper opens on exactly this mismatch
       (&sect;1):</p>
       <blockquote>"because they require pre-segmented training data, and post-processing to transform their
       outputs into label sequences, their [RNNs'] applicability has so far been limited." (&sect;1)</blockquote>
       <p>Read that carefully. A plain RNN trained for sequence labelling needs a <b>frame-level label</b>
       for every time step &mdash; someone must mark "frames 1&ndash;30 are an 'a', frames 31&ndash;50 are
       silence, &hellip;" That <b>segmentation</b> is expensive and often impossible. And even after the RNN
       fires per frame, you must hand-write rules to <b>collapse</b> those per-frame guesses into the final
       string. The standard fix at the time was to bolt the RNN onto a <b>hidden Markov model</b> (HMM &mdash;
       a probabilistic model with hidden states that does the alignment), inheriting the HMM's assumptions
       (&sect;1). The real task is simpler than all that: given an input and a target string, train the network
       so the <i>whole string</i> is likely &mdash; never telling it where each label lives.</p>`,
    contribution:
      `<ul>
        <li><b>The blank symbol + collapse rule.</b> CTC adds one extra output unit, a <b>blank</b> (written
        $b$ or $\\varnothing$), meaning "emit no label here." A many-to-one map $\\mathcal{B}$ turns a
        per-frame output string (a <b>path</b>) into a label string by <i>merging repeated labels, then
        deleting blanks</i> &mdash; e.g. $\\mathcal{B}(a\\,b\\,\\varnothing\\,b\\,b) = a\\,b\\,b$ (&sect;3.1).
        This lets a length-$T$ path stand for any shorter string, with blanks marking the gaps.</li>
        <li><b>Sequence labelling as one probability.</b> CTC reads the softmax outputs as "a probability
        distribution over all possible label sequences, conditioned on a given input sequence" (&sect;3). The
        probability of a target string is the <b>sum over every path that collapses to it</b> (Eq. 3) &mdash;
        so the network is trained on the string directly, with <b>no pre-segmentation</b>.</li>
        <li><b>A forward-backward dynamic program.</b> That sum is over exponentially many paths, but
        "the problem can be solved with a dynamic programming algorithm, similar to the forward-backward
        algorithm for HMMs" (&sect;4.1). A <b>forward variable</b> $\\alpha_t(s)$ accumulates the probability
        of all valid alignments up to frame $t$ in $O(T\\,|l'|)$ time, giving a differentiable loss trainable
        by ordinary backpropagation through time.</li>
      </ul>`,
    whyItMattered:
      `<p>CTC made end-to-end sequence transcription practical: one RNN, one differentiable loss, no external
       aligner and no frame labels. It became the standard output layer for <b>speech recognition</b>
       (Deep Speech and most early end-to-end ASR), <b>handwriting recognition</b>, and <b>optical character
       recognition</b>, and it is still shipped as <code>torch.nn.CTCLoss</code>. The core trick &mdash;
       a blank token plus a forward-backward sum over alignments &mdash; reappears throughout sequence
       modelling, and CTC remains a baseline that attention- and transducer-based models are measured
       against.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3.1 (From Network Outputs to Labellings)</b> &mdash; the heart of the idea. The softmax
        with one extra <b>blank</b> unit; <b>Eq. 2</b>, the probability of a single path $\\pi$; the
        many-to-one map $\\mathcal{B}$ and its example $\\mathcal{B}(a\\,\\text{-}\\,ab\\text{-}) = \\mathcal{B}(\\text{-}aa\\text{-}\\text{-}abb)=aab$;
        and <b>Eq. 3</b>, the labelling probability as a sum over $\\mathcal{B}^{-1}(l)$.</li>
        <li><b>&sect;4.1 (The CTC Forward-Backward Algorithm)</b> &mdash; the dynamic program. The extended
        sequence $l'$ (blanks inserted around every label); <b>Eq. 5</b> defining $\\alpha_t(s)$; the
        initialisation; <b>Eq. 6</b> the recursion with its <b>skip condition</b>; <b>Eq. 7</b> the merge
        $\\bar\\alpha$; and <b>Eq. 8</b>, $p(l|x)=\\alpha_T(|l'|)+\\alpha_T(|l'|-1)$.</li>
        <li><b>Fig. 1</b> &mdash; the speech-signal picture: CTC outputs a series of <i>spikes</i> separated
        by blanks, versus the framewise network's smeared activations. <b>Fig. 3</b> &mdash; the lattice of
        allowed transitions for the labelling "CAT".</li>
       </ul>
       <p><b>Skim:</b> the rescaling for numerical stability (&sect;4.2 paragraph on $C_t$, $D_t$), the
       decoding heuristics (best-path and prefix search, &sect;3), and the TIMIT experiment numbers (&sect;5)
       &mdash; unless you need them. The two ideas you must own are the <b>blank-plus-collapse map</b>
       $\\mathcal{B}$ and the <b>forward recursion</b> $\\alpha$.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You want the network to output the label string <b>"aa"</b> (the letter 'a' twice in a row). The
       collapse rule first <i>merges repeated labels</i>, then deletes blanks. Consider a path that emits 'a'
       on two adjacent frames with <b>nothing between them</b>: <code>a a</code>.</p>
       <ul>
        <li>What does $\\mathcal{B}(\\,a\\,a\\,)$ collapse to &mdash; "aa" or "a"?</li>
        <li>So to produce <b>two</b> a's, what symbol <i>must</i> sit between them in the path?</li>
       </ul>
       <p>Predict: in the forward lattice, is the network <b>allowed to skip</b> the blank between two
       <i>identical</i> labels the way it may skip the blank between two <i>different</i> labels? Write your
       guess, then run the ablation that removes this skip rule and watch the loss break.</p>`,
    attempt:
      `<p>Before the reveal, implement the <b>CTC forward (alpha) recursion</b> in NumPy. You are given the
       per-frame softmax matrix $y$ (shape $T\\times K$, rows summing to $1$; column $0$ is the blank) and a
       target label list. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>extend(labels)</b> &mdash; TODO: build $l'$ by inserting the blank (index $0$) at the start,
        the end, and <i>between every pair</i> of labels. Length is $2\\,|labels|+1$.</li>
        <li><b>alpha_forward(y, labels)</b> &mdash; TODO: initialise $\\alpha_0(0)=y_{0,b}$,
        $\\alpha_0(1)=y_{0,l'_1}$, rest $0$. Then for each frame $t$ and position $s$, set
        $\\bar\\alpha = \\alpha_{t-1}(s) + \\alpha_{t-1}(s-1)$, and <i>add</i> $\\alpha_{t-1}(s-2)$ <b>only
        if</b> $l'_s$ is not blank <b>and</b> $l'_s \\neq l'_{s-2}$ (the skip condition). Multiply by
        $y_{t,\\,l'_s}$.</li>
        <li><b>loss</b> &mdash; TODO: $p(l|x)=\\alpha_{T-1}(S-1)+\\alpha_{T-1}(S-2)$, then $-\\ln p$. Verify it
        against <code>torch.nn.CTCLoss</code> with <code>np.allclose</code>.</li>
       </ul>
       <p>Then run the ablation: drop the "$l'_s \\neq l'_{s-2}$" half of the skip condition and recompute the
       loss for the repeated target "aa".</p>`,

    // HOW IT WORKS
    walkthrough:
      `<p><b>The set-up (&sect;3).</b> The network is a softmax over $K = |L|+1$ symbols: the real labels plus
       one extra <b>blank</b>. At each of the $T$ input frames it outputs a probability vector $y^t$ (a
       distribution over the $K$ symbols; see <code>ml-softmax</code>). A <b>path</b> $\\pi$ is one full
       length-$T$ string of symbols &mdash; one symbol picked per frame. Because the network is assumed
       conditionally independent across frames, a path's probability is just the product of the per-frame
       probabilities it uses (<b>Eq. 2</b>): $p(\\pi|x)=\\prod_t y^t_{\\pi_t}$.</p>
       <p><b>The collapse map $\\mathcal{B}$ (&sect;3.1).</b> Many different paths mean the same label string.
       The map $\\mathcal{B}$ takes a path and (1) <b>merges runs of the same label</b> into one, then (2)
       <b>deletes all blanks</b>. The paper's example: $\\mathcal{B}(a\\,\\text{-}\\,ab\\text{-})=\\mathcal{B}(\\text{-}aa\\text{-}\\text{-}abb)=aab$
       (the dash is the blank). Two consequences you must hold onto: a <i>blank</i> between two copies of a
       label keeps them separate (so "aa" needs a blank in the middle), but <i>repeated identical</i> labels
       with no blank merge into one.</p>
       <p><b>The labelling probability (&sect;3.1, Eq. 3).</b> The probability the network assigns to a target
       string $l$ is the <b>sum over every path that collapses to it</b>:
       $p(l|x)=\\sum_{\\pi\\in\\mathcal{B}^{-1}(l)} p(\\pi|x)$. This is the whole point of CTC: we never tell the
       network <i>which</i> alignment is right; we add up <i>all</i> the valid ones and ask only that their
       total probability be high. There is no segmentation anywhere.</p>
       <p><b>Why we cannot just enumerate (&sect;4.1).</b> The number of paths in $\\mathcal{B}^{-1}(l)$ grows
       exponentially with $T$. CTC instead computes the sum with a <b>dynamic program</b> "similar to the
       forward-backward algorithm for HMMs" (&sect;4.1).</p>
       <p><b>The extended sequence $l'$ (&sect;4.1).</b> To handle blanks cleanly, build $l'$ from $l$ by
       inserting a blank at the start, the end, and between every pair of labels. For $l=ab$,
       $l'=(\\,b,\\,a,\\,b,\\,b,\\,b\\,)$ &mdash; here the outer and middle entries are the blank symbol, the
       2nd and 4th are 'a' and 'b'. Its length is $|l'|=2|l|+1$. Every valid path now corresponds to a
       monotone walk through the positions of $l'$.</p>
       <p><b>The forward variable $\\alpha_t(s)$ (Eq. 5).</b> Define $\\alpha_t(s)$ as "the total probability of
       $l'_{1:s}$ at time $t$" (&sect;4.1, Eq. 5) &mdash; i.e. the summed probability of all path-prefixes that
       have, by frame $t$, accounted for the first $s$ positions of the extended sequence. Initialise
       (&sect;4.1): a path may start in the leading blank or on the first label, so $\\alpha_1(1)=y^1_b$,
       $\\alpha_1(2)=y^1_{l_1}$, and $\\alpha_1(s)=0$ for $s\\gt2$.</p>
       <p><b>The recursion (Eq. 6, 7).</b> At each step a path may stay on the same position, advance one
       position, or &mdash; <i>sometimes</i> &mdash; skip a position. Two positions always feed $s$: staying
       ($s$) and stepping from $s-1$. Their sum is $\\bar\\alpha_t(s)=\\alpha_{t-1}(s)+\\alpha_{t-1}(s-1)$
       (Eq. 7). The third, <b>skip</b> term $\\alpha_{t-1}(s-2)$ is added <b>only when the skip is legal</b>:
       not if $l'_s$ is a blank, and not if $l'_{s-2}=l'_s$ (Eq. 6). The first forbids skipping <i>onto</i> a
       blank; the second forbids skipping <i>over</i> the blank that separates two identical labels &mdash;
       because erasing that blank would merge them and silently delete one label. Finally multiply by the
       current emission $y^t_{l'_s}$.</p>
       <p><b>Reading off the answer (Eq. 8).</b> A valid full path ends either on the final label or on the
       trailing blank, so $p(l|x)=\\alpha_T(|l'|)+\\alpha_T(|l'|-1)$ (&sect;4.1, Eq. 8). The training loss is
       the negative log of this (&sect;4.2, Eq. 12): $O^{ML}=-\\sum \\ln p(z|x)$ &mdash; ordinary
       maximum-likelihood, differentiable end to end.</p>`,
    symbols: [
      { sym: "$T$", desc: "the number of <b>input frames</b> (time steps the RNN reads); far larger than the label count." },
      { sym: "$L$", desc: "the <b>label alphabet</b> (e.g. the letters or phonemes); $|L|$ is its size." },
      { sym: "$b$ (blank)", desc: "the special extra output symbol meaning <b>\\\"emit no label here\\\"</b>; the softmax has one unit for it on top of $L$. Written $\\varnothing$ or a dash in path examples." },
      { sym: "$K = |L|+1$", desc: "the number of <b>softmax outputs</b> per frame: every label plus the blank." },
      { sym: "$y^t_k$", desc: "the <b>softmax probability</b> the network gives to symbol $k$ at frame $t$ (each $y^t$ sums to $1$ over the $K$ symbols)." },
      { sym: "$\\pi$ (path)", desc: "one full length-$T$ string of symbols, one per frame &mdash; a single frame-by-frame alignment." },
      { sym: "$p(\\pi|x)$", desc: "the <b>probability of a path</b>: the product of the per-frame probabilities it uses, $\\prod_t y^t_{\\pi_t}$ (Eq. 2)." },
      { sym: "$\\mathcal{B}$", desc: "the many-to-one <b>collapse map</b>: merge runs of the same label, then delete blanks. Maps a path to a label string." },
      { sym: "$\\mathcal{B}^{-1}(l)$", desc: "the <b>set of all paths</b> that collapse to the label string $l$ &mdash; the alignments we sum over." },
      { sym: "$l$", desc: "the <b>target label string</b> we want to output (e.g. \\\"ab\\\"), shorter than $T$." },
      { sym: "$l'$", desc: "the <b>extended target</b>: $l$ with a blank inserted at the start, end, and between every pair of labels. Length $|l'|=2|l|+1$." },
      { sym: "$l'_s$", desc: "the symbol at <b>position $s$</b> of the extended sequence ($s$ runs $1\\ldots|l'|$)." },
      { sym: "$\\alpha_t(s)$", desc: "the <b>forward variable</b>: total probability of all path-prefixes that, by frame $t$, have covered the first $s$ positions of $l'$ (Eq. 5)." },
      { sym: "$\\bar\\alpha_t(s)$", desc: "the <b>two-term merge</b> $\\alpha_{t-1}(s)+\\alpha_{t-1}(s-1)$: staying put plus stepping one position forward (Eq. 7)." },
      { sym: "$p(l|x)$", desc: "the <b>labelling probability</b>: the alignment sum $\\sum_{\\pi\\in\\mathcal{B}^{-1}(l)}p(\\pi|x)$, computed by the forward pass (Eq. 3 = Eq. 8)." },
      { sym: "$O^{ML}$", desc: "the <b>training objective</b> (&sect;4.2, Eq. 12): $-\\sum_{(x,z)}\\ln p(z|x)$ &mdash; negative log-likelihood, minimised by gradient descent." },
      { sym: "forward-backward", desc: "a plain term: a <b>dynamic program</b> that sums over all alignments by sweeping forward ($\\alpha$) and backward ($\\beta$) through the lattice in linear time." }
    ],
    formula: `$$ p(l|x) \\;=\\; \\sum_{\\pi \\,\\in\\, \\mathcal{B}^{-1}(l)} p(\\pi|x) \\;=\\; \\sum_{\\pi \\,\\in\\, \\mathcal{B}^{-1}(l)} \\;\\prod_{t=1}^{T} y^{t}_{\\pi_t} \\qquad\\text{(\\S3.1, Eq.\\,3 \\& Eq.\\,2 — the alignment sum)} $$
              $$ \\alpha_t(s) \\;=\\; \\begin{cases} \\bar\\alpha_t(s)\\, y^{t}_{l'_s} & \\text{if } l'_s = b \\text{ or } l'_{s-2}=l'_s \\\\[2pt] \\big(\\bar\\alpha_t(s) + \\alpha_{t-1}(s-2)\\big)\\, y^{t}_{l'_s} & \\text{otherwise} \\end{cases} \\qquad\\text{(\\S4.1, Eq.\\,6 — the forward recursion)} $$
              $$ \\bar\\alpha_t(s) \\;=\\; \\alpha_{t-1}(s) + \\alpha_{t-1}(s-1) \\quad\\text{(Eq.\\,7)}, \\qquad p(l|x) = \\alpha_T(|l'|) + \\alpha_T(|l'|-1) \\quad\\text{(Eq.\\,8)} $$`,
    whatItDoes:
      `<p><b>The alignment sum (Eq. 3).</b> The top line is CTC's definition of "how likely is the string $l$?":
       add up the probabilities of <i>every</i> path that collapses to $l$. Each path's probability (Eq. 2) is
       the product of the one softmax value it picks at each frame. Because we sum over <i>all</i> valid
       alignments, the network is never asked which frame is which label &mdash; only that the alignments,
       taken together, be probable. That single equation is what removes the need for segmentation.</p>
       <p><b>The forward recursion (Eq. 6).</b> Computing that exponential sum directly is impossible, so
       $\\alpha_t(s)$ builds it up frame by frame. The merge $\\bar\\alpha_t(s)$ collects the two always-legal
       ways to arrive at position $s$: a path that was already there ($\\alpha_{t-1}(s)$) and one that stepped
       up from the position just below ($\\alpha_{t-1}(s-1)$). The <b>skip</b> term $\\alpha_{t-1}(s-2)$ is the
       extra freedom to jump <i>over</i> a separating blank &mdash; allowed only when $l'_s$ is a real label
       <b>and</b> it differs from $l'_{s-2}$. Multiplying by $y^t_{l'_s}$ charges the emission probability for
       being on symbol $l'_s$ at frame $t$.</p>
       <p><b>Reading off the loss (Eq. 8).</b> After the last frame, a complete path sits either on the final
       label or on the trailing blank, so the labelling probability is the sum of those two endpoint
       $\\alpha$'s. Negate its log to get the training loss $O^{ML}=-\\ln p(l|x)$ (&sect;4.2). Everything is
       products and sums of the differentiable $y^t_k$, so gradients flow straight back into the RNN.</p>`,
    derivation:
      `<p><b>Why the recursion equals the alignment sum.</b> Group every path in $\\mathcal{B}^{-1}(l)$ by the
       position $s$ of $l'$ it occupies at frame $t$. Within a group, a path's first-$t$ probability factors as
       (probability of the prefix that reached $s$ by frame $t-1$) $\\times\\, y^t_{l'_s}$ (the emission now).
       So if $\\alpha_{t-1}(\\cdot)$ already holds the summed prefix-probabilities at each position, the
       summed probability at $(t,s)$ is just (sum of the legal predecessors of $s$) $\\times\\, y^t_{l'_s}$.
       That is exactly Eq. 6. Induction from the initialisation gives $\\alpha_T$, and $p(l|x)$ is read off at
       the two valid endpoints (Eq. 8).</p>
       <p><b>Which predecessors are legal &mdash; the three arrows.</b> Between adjacent frames a path may
       (i) <b>stay</b> on the same symbol (so $s$ feeds $s$), (ii) <b>advance</b> by one position (so $s-1$
       feeds $s$), or (iii) <b>skip</b> a position (so $s-2$ feeds $s$). Staying and advancing are always
       allowed &mdash; that is $\\bar\\alpha$. The skip exists so a path can move from one label directly to
       the next <i>without dwelling on the blank between them</i>. But the paper forbids the skip in two
       cases (Eq. 6): when $l'_s$ is itself a blank (you cannot skip onto a blank), and when
       $l'_{s-2}=l'_s$ &mdash; the case where the two surrounding labels are <b>identical</b>. Skipping there
       would jump from the first 'a' straight to the second 'a', deleting the blank that keeps them apart;
       collapsing would then merge them and we would have produced "a" instead of "aa". This single condition
       is what the worked-example ablation breaks.</p>
       <p>CTC owns its forward-backward derivation here (there is no separate concept lesson for it), so the
       full argument is given rather than recapped. The backward variable $\\beta_t(s)$ is the mirror image
       (Eq. 9&ndash;11), and $\\alpha_t(s)\\beta_t(s)/y^t_{l'_s}$ gives the per-symbol gradient (&sect;4.1) &mdash;
       we implement only the forward $\\alpha$, which already yields the loss.</p>`,
    example:
      `<p>Work the forward pass by hand. Alphabet of $K=3$ symbols: index $0=$ blank $b$, $1=$ 'a', $2=$ 'b'.
       Target $l=$ "ab" $=[1,2]$, so the extended sequence is
       $l'=(\\,b,\\,a,\\,b,\\,b,\\,b\\,)$ &mdash; positions $s=0\\ldots4$, with $l'=[0,1,0,2,0]$ (blank, a, blank,
       b, blank). We use $0$-based indices to match the notebook. There are $T=4$ frames; the per-frame
       softmax matrix (rows sum to $1$, columns are $[b,a,b]$) is:</p>
       <p>$$ y = \\begin{bmatrix} 0.10 & 0.60 & 0.30 \\\\ 0.20 & 0.50 & 0.30 \\\\ 0.30 & 0.30 & 0.40 \\\\ 0.40 & 0.20 & 0.40 \\end{bmatrix}
            \\qquad (\\text{row }t,\\ \\text{col }k = y^t_k) $$</p>
       <ul class="steps">
        <li><b>Initialise ($t=0$).</b> $\\alpha_0(0)=y^0_b=0.10$, $\\alpha_0(1)=y^0_a=0.60$, rest $0$.
        Row: $[0.10,\\;0.60,\\;0,\\;0,\\;0]$.</li>
        <li><b>One plain step: $\\alpha_1(1)$</b> (position $s=1$, symbol 'a'). Legal predecessors are
        $s=1$ (stay) and $s=0$ (advance); no skip (there is no $s=-1$). So
        $\\bar\\alpha = \\alpha_0(1)+\\alpha_0(0) = 0.60+0.10 = 0.70$, times $y^1_a=0.50$:
        $\\alpha_1(1)=0.70\\times0.50=\\mathbf{0.35}$. Full row $t=1$:
        $[0.02,\\;0.35,\\;0.12,\\;0.18,\\;0]$.</li>
        <li><b>One SKIP step: $\\alpha_2(3)$</b> (position $s=3$, symbol 'b'). Here $l'_3=$'b' and
        $l'_1=$'a' &mdash; <i>different</i> and non-blank &rarr; the <b>skip is allowed</b>, so all three
        predecessors feed in: $\\alpha_1(3)+\\alpha_1(2)+\\alpha_1(1) = 0.18+0.12+0.35 = 0.65$, times
        $y^2_b=0.40$: $\\alpha_2(3)=0.65\\times0.40=\\mathbf{0.26}$.</li>
        <li><b>A no-skip step for contrast: $\\alpha_2(2)$</b> (position $s=2$, a <b>blank</b>). Because
        $l'_2$ is blank, the skip is forbidden: only $\\alpha_1(2)+\\alpha_1(1)=0.12+0.35=0.47$, times
        $y^2_b{=}0.30$: $\\alpha_2(2)=\\mathbf{0.141}$.</li>
        <li><b>Finish.</b> Iterating to $t=3$ gives the last row
        $[0.0024,\\;0.0234,\\;0.1008,\\;0.2048,\\;0.1256]$. Read off (Eq. 8):
        $p(l|x)=\\alpha_3(4)+\\alpha_3(3)=0.1256+0.2048=\\mathbf{0.3304}$. Loss
        $=-\\ln 0.3304=\\mathbf{1.10745}$.</li>
       </ul>
       <p>The notebook builds this exact $y$ and runs the recursion, then calls
       <code>torch.nn.CTCLoss</code> on the same inputs &mdash; it returns $\\mathbf{1.10745}$ too, with
       <code>np.allclose</code> $=$ True.</p>`,
    recipe:
      `<ol>
        <li><b>Output layer:</b> a softmax over $K=|L|+1$ symbols &mdash; the labels plus one <b>blank</b> &mdash;
        emitting $y^t$ at every frame (the RNN that produces $y$ is standard; we feed $y$ directly).</li>
        <li><b>Extend the target:</b> build $l'$ by inserting blanks at the start, end, and between every pair
        of labels; $|l'|=2|l|+1$.</li>
        <li><b>Initialise:</b> $\\alpha_0(0)=y^0_b$, $\\alpha_0(1)=y^0_{l_1}$, rest $0$.</li>
        <li><b>Forward recurse:</b> for each frame $t$ and position $s$, form $\\bar\\alpha=\\alpha_{t-1}(s)+\\alpha_{t-1}(s-1)$,
        add $\\alpha_{t-1}(s-2)$ <i>iff</i> $l'_s\\neq b$ and $l'_s\\neq l'_{s-2}$, then multiply by $y^t_{l'_s}$.</li>
        <li><b>Read off the loss:</b> $p(l|x)=\\alpha_T(|l'|)+\\alpha_T(|l'|-1)$; the training loss is $-\\ln p(l|x)$.</li>
        <li><b>Backprop:</b> the loss is products/sums of the differentiable $y^t_k$, so gradients flow into
        the RNN by backpropagation through time (in the notebook we verify the loss; PyTorch's
        <code>CTCLoss</code> provides the gradient in real training).</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): "An experiment on the TIMIT speech corpus demonstrates its advantages
       over both a baseline HMM and a hybrid HMM-RNN." The paper frames CTC as removing two requirements at
       once &mdash; "removes the need for pre-segmented training data and post-processed outputs, and models
       all aspects of the sequence within a single network architecture" (&sect;1) &mdash; rather than chasing
       a single headline accuracy number.</p>
       <p><i>These are the paper's reported, quoted claims. The numbers in the CODEVIZ panel below are from our
       own tiny forward-pass computation &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper. The plumbing &mdash; the recurrent network that
       produces the per-frame softmax $y$, and the gradient through the loss &mdash; is standard (an RNN/LSTM
       from <code>dl-rnn</code>/<code>dl-lstm-gru</code>; the gradient ships in
       <code>torch.nn.CTCLoss</code>). What we build by hand is CTC's actual contribution: the
       <b>forward (alpha) recursion that sums over all alignments</b>. We take a fixed tiny $y$ (so the result
       is deterministic), construct the extended sequence $l'$, run the Eq. 6 recursion with its skip
       condition, read off $p(l|x)$ via Eq. 8, and <b>verify</b> $-\\ln p(l|x)$ equals
       <code>torch.nn.CTCLoss</code> with <code>np.allclose</code>. Then the <b>ablation</b>: on the
       repeated-label target "aa", we drop the "$l'_s\\neq l'_{s-2}$" half of the skip rule and watch the loss
       collapse to a wrong (too-low) value &mdash; the code is the oracle that proves the rule is necessary.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting the blank between identical labels.</b> To output "aa" the path needs a blank in
        the middle; the skip over $s-2$ is forbidden exactly when $l'_{s-2}=l'_s$. Drop that guard and "aa"
        leaks into "a" &mdash; this is the ablation below.</li>
        <li><b>Blank index mismatch.</b> <code>torch.nn.CTCLoss</code> defaults to <code>blank=0</code>; your
        $l'$, $y$ columns, and targets must all agree on which index is the blank, or the loss is silently
        wrong.</li>
        <li><b>Passing probabilities instead of log-probabilities to PyTorch.</b> <code>CTCLoss</code> expects
        <code>log_probs</code> (apply <code>log_softmax</code> or <code>torch.log</code> first), shape
        $(T, N, C)$; our raw $y$ must be logged before the comparison.</li>
        <li><b>Numerical underflow.</b> Multiplying many small $y^t_k$ underflows for long sequences; the
        paper rescales $\\alpha$ by $C_t=\\sum_s\\alpha_t(s)$ (&sect;4.2) and works in log-space. Our toy
        $T=4$ is short enough to skip this, but real CTC must do it.</li>
        <li><b>Reading $p(l|x)$ off one endpoint.</b> Eq. 8 sums <b>two</b> endpoints &mdash;
        $\\alpha_T(|l'|)$ (ends on the trailing blank) and $\\alpha_T(|l'|-1)$ (ends on the last label).
        Dropping either loses valid paths.</li>
      </ul>`,
    recall: [
      "State the alignment sum (Eq. 3) and say in words what $\\mathcal{B}^{-1}(l)$ is.",
      "What is the blank symbol for, and what are the two steps of the collapse map $\\mathcal{B}$?",
      "Write the forward recursion (Eq. 6) and the two conditions under which the skip term is forbidden.",
      "Why does the target \\\"aa\\\" require a blank between the two a's, but \\\"ab\\\" does not?",
      "How is $p(l|x)$ read off from $\\alpha_T$ (Eq. 8), and what is the training loss in terms of it?"
    ],
    practice: [
      {
        q: `<b>The skip-rule ablation.</b> For the repeated target "aa", explain why the skip from $s-2$ to
            $s$ must be forbidden, and what the loss does if you (wrongly) allow it. Then state which value the
            forward pass should report.`,
        steps: [
          { do: `Extend "aa" $=[1,1]$ to $l'=[0,1,0,1,0]$ (blank, a, blank, a, blank). The middle blank at $s=2$ separates the two a's.`, why: `$\\mathcal{B}$ merges adjacent identical labels, so without that blank the two a's collapse into one.` },
          { do: `At $s=3$ (the second 'a'), $l'_3=$'a' and $l'_1=$'a' are <b>identical</b>, so Eq. 6 forbids the $\\alpha_{t-1}(1)$ skip term. Only stay ($s{=}3$) and advance ($s{=}2$) feed in.`, why: `Skipping from the first 'a' straight to the second would erase the separating blank and produce "a", not "aa".` },
          { do: `Allowing the skip anyway adds invalid paths, <i>raising</i> $p(l|x)$ and so <i>lowering</i> the loss &mdash; in our run from the correct $1.503$ down to a bogus $0.402$.`, why: `Those extra paths actually collapse to "a"; counting them is double-counting a different labelling.` }
        ],
        answer: `<p>The skip from $s-2$ is forbidden when $l'_{s-2}=l'_s$ because it would jump over the blank
                 that keeps two identical labels apart, merging "aa" into "a". The correct CTC loss on our
                 tiny example is $\\mathbf{1.503}$ (and <code>torch.nn.CTCLoss</code> agrees,
                 <code>allclose</code> True). The buggy version that allows the skip reports a wrongly low
                 $\\approx0.402$. The CODEVIZ panel plots this gap.</p>`
      },
      {
        q: `Recompute the worked-example skip step by hand. Using row $t=1$ of $\\alpha$,
            $[0.02,\\,0.35,\\,0.12,\\,0.18,\\,0]$, and $y^2 = [0.30,0.30,0.40]$ (cols $[b,a,b]$), compute
            $\\alpha_2(3)$ for the target "ab" (so $l'=[0,1,0,2,0]$).`,
        steps: [
          { do: `Position $s=3$ holds symbol $l'_3=2$ ('b'); $l'_1=1$ ('a'). They differ and neither is blank, so the skip is <b>allowed</b>.`, why: `Eq. 6 permits the $s-2$ term unless $l'_s$ is blank or $l'_{s-2}=l'_s$ &mdash; here neither holds.` },
          { do: `Sum the three predecessors: $\\alpha_1(3)+\\alpha_1(2)+\\alpha_1(1) = 0.18+0.12+0.35 = 0.65$.`, why: `Stay ($s{=}3$), advance ($s{=}2$), and the legal skip ($s{=}1$) all feed position $3$.` },
          { do: `Multiply by the emission $y^2_{l'_3}=y^2_b=0.40$: $0.65\\times0.40 = 0.26$.`, why: `Every $\\alpha$ entry charges the probability of emitting its symbol at the current frame.` }
        ],
        answer: `<p>$\\alpha_2(3) = (0.18+0.12+0.35)\\times0.40 = 0.65\\times0.40 = \\mathbf{0.26}$ &mdash;
                 exactly the value in the worked-example matrix, and the notebook reproduces it.</p>`
      },
      {
        q: `Why does CTC sum over <i>all</i> paths in $\\mathcal{B}^{-1}(l)$ (Eq. 3) instead of picking the
            single most likely alignment? What would training on the single best path lose?`,
        steps: [
          { do: `The label string $l$ never tells us which frame is which label, so there is no \\\"true\\\" alignment to single out.`, why: `The data is <b>unsegmented</b> &mdash; that is the whole problem CTC solves.` },
          { do: `Summing over every valid alignment makes $p(l|x)$ the actual probability of the string, marginalising out the unknown alignment.`, why: `Marginalisation is the principled way to handle a latent variable (here, the alignment) we do not observe.` },
          { do: `Training on only the single best path would commit early to one alignment and ignore the probability mass in all the others, giving a biased, lower-variance-but-wrong objective.`, why: `Early hard alignment can lock onto a poor segmentation; the soft sum lets the network discover alignments itself.` }
        ],
        answer: `<p>Because the data is unsegmented, no single alignment is \\\"the\\\" right one. Eq. 3
                 marginalises over the latent alignment by summing every path that collapses to $l$, giving the
                 true string probability $p(l|x)$; the forward-backward DP computes that sum in $O(T|l'|)$. Using
                 only the best path would throw away the mass in all other valid alignments and bias training
                 toward a prematurely chosen segmentation.</p>`
      }
    ]
  });

  window.CODE["paper-ctc"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build CTC's forward (alpha) recursion by hand</b> in NumPy &mdash; the paper's actual
       contribution &mdash; without rebuilding the RNN (that just produces the softmax matrix $y$, which we
       fix to a tiny deterministic array). Cell 1 extends the target "ab" to $l'=[0,1,0,2,0]$, runs the
       Eq. 6 recursion with its skip condition, prints the full $\\alpha$ matrix, reads off
       $p(l|x)=\\alpha_T(|l'|)+\\alpha_T(|l'|-1)=0.3304$ and the loss $-\\ln p=\\mathbf{1.10745}$, and
       <b>verifies it against</b> <code>torch.nn.CTCLoss</code> with <code>np.allclose</code> (True). It also
       recomputes the worked skip step $\\alpha_2(3)=0.26$. Cell 2 is the <b>ablation</b>: on the
       repeated-label target "aa", dropping the "$l'_s\\neq l'_{s-2}$" guard lets the path skip the separating
       blank &mdash; the loss drops from the correct $1.503$ to a bogus $0.402$, proving the rule is load-bearing.
       Paste into Colab (torch is preinstalled) and run.</p>`,
    code: `import numpy as np
import torch
import torch.nn as nn

np.set_printoptions(precision=4, suppress=True)
BLANK = 0   # PyTorch CTCLoss convention: blank is index 0

def extend(labels, blank=BLANK):
    """l' = blank, l1, blank, l2, blank, ... ; length 2*len(labels)+1."""
    lp = [blank]
    for c in labels:
        lp += [c, blank]
    return lp

def ctc_forward(y, labels, blank=BLANK, allow_repeat_skip=True):
    """CTC forward (alpha) recursion. y: (T,K) softmax rows. Returns (p, alpha)."""
    T, K = y.shape
    lp = extend(labels, blank)
    S = len(lp)
    a = np.zeros((T, S))
    a[0, 0] = y[0, lp[0]]                 # start in leading blank
    a[0, 1] = y[0, lp[1]]                 # or on the first label
    for t in range(1, T):
        for s in range(S):
            v = a[t-1, s]                                  # stay
            if s - 1 >= 0:
                v += a[t-1, s-1]                           # advance one
            # skip term: allowed unless l'_s is blank, or l'_s == l'_{s-2}
            forbids = (lp[s] == blank) or (allow_repeat_skip and lp[s] == lp[s-2])
            if s - 2 >= 0 and not forbids:
                v += a[t-1, s-2]                           # skip a position
            a[t, s] = v * y[t, lp[s]]
    p = a[T-1, S-1] + a[T-1, S-2]         # Eq. 8: end on last label or trailing blank
    return p, a

# --- 1. Worked example: target "ab", T=4 frames, K=3 (blank, a, b) -----------------
y = np.array([[0.10, 0.60, 0.30],
              [0.20, 0.50, 0.30],
              [0.30, 0.30, 0.40],
              [0.40, 0.20, 0.40]])
labels = [1, 2]                            # "a","b"   (l' = [0,1,0,2,0])
p, alpha = ctc_forward(y, labels)
loss_mine = -np.log(p)
print("l' =", extend(labels))
print("alpha matrix (rows=t, cols=s):\\n", alpha)
print("worked skip step alpha[2,3] = (0.18+0.12+0.35)*0.40 =", round(alpha[2, 3], 4))  # 0.26
print("p(l|x) =", round(p, 4), "  loss -ln p =", round(loss_mine, 6))                  # 0.3304 / 1.107451

# Verify against torch.nn.CTCLoss (it expects LOG-probs, shape (T, N, C)).
log_probs = torch.log(torch.tensor(y, dtype=torch.double)).unsqueeze(1)   # (T,1,K)
targets = torch.tensor([labels], dtype=torch.long)                        # (1,L)
ctc = nn.CTCLoss(blank=BLANK, reduction='none')
loss_torch = ctc(log_probs, targets,
                 torch.tensor([y.shape[0]]), torch.tensor([len(labels)])).item()
print("loss torch =", round(loss_torch, 6),
      "  allclose:", np.allclose(loss_mine, loss_torch))                   # True


# --- 2. ABLATION: the l'_s == l'_{s-2} skip rule, on the repeated target "aa" -------
y2 = np.array([[0.1, 0.7, 0.2],
               [0.5, 0.4, 0.1],
               [0.1, 0.6, 0.3],
               [0.4, 0.5, 0.1]])
aa = [1, 1]                                # "aa" -> l' = [0,1,0,1,0]; middle blank separates the a's
p_correct, _ = ctc_forward(y2, aa, allow_repeat_skip=True)   # rule ON  (correct CTC)
p_buggy,   _ = ctc_forward(y2, aa, allow_repeat_skip=False)  # rule OFF (skip the separating blank)
print("\\nABLATION on target 'aa':")
print("  correct loss (skip forbidden between equal labels):", round(-np.log(p_correct), 4))  # 1.5028
print("  buggy   loss (skip allowed -> 'aa' leaks to 'a')  :", round(-np.log(p_buggy),   4))  # 0.4024

# torch agrees with the CORRECT value:
lp2 = torch.log(torch.tensor(y2, dtype=torch.double)).unsqueeze(1)
lt2 = nn.CTCLoss(blank=BLANK, reduction='none')(
        lp2, torch.tensor([aa]), torch.tensor([4]), torch.tensor([2])).item()
print("  torch loss:", round(lt2, 4), " matches correct:", np.allclose(-np.log(p_correct), lt2))
print("Dropping the rule wrongly lowers the loss -> it counts paths that collapse to 'a', not 'aa'.")
print("(Tiny deterministic run, not the paper's TIMIT numbers.)")`
  };

  window.CODEVIZ["paper-ctc"] = {
    question: "On the repeated-label target 'aa', what does the CTC loss do if you drop the l'_s = l'_{s-2} skip rule that keeps a blank between the two a's?",
    charts: [
      {
        type: "bar",
        title: "CTC loss on target 'aa' — correct rule vs dropping the equal-label skip guard",
        xlabel: "forward recursion variant",
        ylabel: "CTC loss  (-ln p(l|x))   lower = wrongly more confident",
        series: [
          {
            name: "CTC loss (-ln p)",
            color: "#7ee787",
            points: [["Correct (skip forbidden, =torch)", 1.5028], ["Buggy (skip allowed)", 0.4024]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported TIMIT numbers. Target 'aa' (two identical labels) needs a blank between the two a's, so CTC's forward recursion (paper &sect;4.1, Eq. 6) forbids the skip transition exactly when $l'_s = l'_{s-2}$. With the rule ON, the forward pass gives loss $-\\ln p = 1.5028$, which matches <code>torch.nn.CTCLoss</code> (allclose True). Dropping the guard lets a path skip the separating blank &mdash; it now counts alignments that actually collapse to 'a', not 'aa', which inflates $p(l|x)$ and pushes the loss down to a bogus $0.4024$. The lower bar is the bug: a model trained on it would happily emit a single 'a'. This one condition is what lets CTC represent repeated labels at all.",
    code: `import numpy as np

BLANK = 0
def extend(labels):
    lp = [BLANK]
    for c in labels: lp += [c, BLANK]
    return lp

def ctc_forward(y, labels, allow_repeat_skip=True):
    T = y.shape[0]; lp = extend(labels); S = len(lp)
    a = np.zeros((T, S)); a[0, 0] = y[0, lp[0]]; a[0, 1] = y[0, lp[1]]
    for t in range(1, T):
        for s in range(S):
            v = a[t-1, s] + (a[t-1, s-1] if s-1 >= 0 else 0)
            forbids = (lp[s] == BLANK) or (allow_repeat_skip and lp[s] == lp[s-2])
            if s-2 >= 0 and not forbids:
                v += a[t-1, s-2]
            a[t, s] = v * y[t, lp[s]]
    return a[T-1, S-1] + a[T-1, S-2]

y = np.array([[0.1, 0.7, 0.2],
              [0.5, 0.4, 0.1],
              [0.1, 0.6, 0.3],
              [0.4, 0.5, 0.1]])
aa = [1, 1]                                       # "aa" -> l' = [0,1,0,1,0]
correct = -np.log(ctc_forward(y, aa, allow_repeat_skip=True))   # 1.5028 (= torch)
buggy   = -np.log(ctc_forward(y, aa, allow_repeat_skip=False))  # 0.4024 (wrong)
print("correct loss:", round(correct, 4))
print("buggy   loss:", round(buggy,   4))
# Dropping the l'_s == l'_{s-2} guard lets the path skip the blank between the two a's,
# so it counts paths that collapse to 'a' -> p(l|x) inflated -> loss wrongly low.`
  };
})();
