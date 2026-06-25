/* Paper lesson — "Deep contextualized word representations" (ELMo),
   Peters, Neumann, Iyyer, Gardner, Clark, Lee, Zettlemoyer 2018.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-elmo".
   GROUNDED from arXiv:1802.05365 (ar5iv HTML mirror; Section 3.1 biLM, Section 3.2 Equation (1) the learned
   weighted sum, Section 3.4 the pre-trained biLM, Section 5.3 + Table 4 the "play" word-sense example,
   Table 1 the six-task SOTA results).
   Track B (architecture): build a tiny character-input biLM (forward + backward LSTM) from torch.nn on a
   small corpus, then build the learned per-task weighting gamma * sum_j s_j h_j by hand; show the SAME word
   "bank" gets DIFFERENT vectors in "river bank" vs "savings bank"; ABLATE by collapsing to a static
   (context-free) embedding and watch the two senses fuse back together.
   The word-vector math lives in concept dl-word-embeddings; we recap and link, not re-derive. */
(function () {
  window.LESSONS.push({
    id: "paper-elmo",
    title: "ELMo — Deep contextualized word representations (2018)",
    tagline: "Read a sentence with a bidirectional LSTM language model, then take a learned weighted sum of its layers as the word's vector — so the same word gets a DIFFERENT vector in every context.",
    module: "Papers · Sequence & NLP",
    track: "architecture",
    paper: {
      authors: "Matthew E. Peters, Mark Neumann, Mohit Iyyer, Matt Gardner, Christopher Clark, Kenton Lee, Luke Zettlemoyer",
      org: "Allen Institute for AI (AI2) and University of Washington",
      year: 2018,
      venue: "arXiv:1802.05365 (Feb 2018); NAACL 2018 (best paper)",
      citations: "",
      arxiv: "https://arxiv.org/abs/1802.05365",
      code: "https://allennlp.org/elmo"
    },
    conceptLink: "dl-word-embeddings",
    partOf: [],
    prereqs: ["dl-word-embeddings", "dl-word2vec", "dl-lstm-gru", "mod-llm"],

    // WHY READ IT
    problem:
      `<p>Before this paper, the standard way to turn a word into numbers was a <b>static word embedding</b>:
       one fixed vector per word, looked up in a table. word2vec and GloVe (the <b>dl-word2vec</b> and
       <b>dl-word-embeddings</b> lessons) both work this way. A <b>vector</b> here just means a list of
       numbers, e.g. 100 numbers, that stands for a word; an <b>embedding</b> is that lookup table of vectors,
       one row per word.</p>
       <p>The trouble (&sect;1) is that one word can mean several things, and a single fixed vector has to
       average them all. The paper's running example is the word <i>play</i>: it is a verb in "they
       <i>play</i> football" and a noun (a theatre piece) in "a successful <i>play</i>". A static embedding
       gives <i>play</i> ONE vector for both, so its nearest neighbours in word2vec/GloVe are a blur of
       "playing, game, games, player, football" &mdash; mostly the sports sense, with the theatre sense lost
       (Table 4). The paper calls this failure to model <b>polysemy</b> (one word, many senses) and the way a
       word's meaning shifts with its sentence its <b>context</b>.</p>
       <p>So the question is: can we give a word a vector that <i>depends on the sentence it appears in</i>, so
       that "river bank" and "savings bank" produce two different vectors for the very same word "bank"?</p>`,
    contribution:
      `<ul>
        <li><b>Contextualized word vectors from a bidirectional language model (biLM).</b> A <b>language
        model</b> is a network trained to predict the next word from the words before it; here the paper trains
        BOTH a forward language model (predict word <i>k</i> from words 1..k&minus;1) and a backward one
        (predict word <i>k</i> from words k+1..N), built from stacked <b>LSTM</b>s (the recurrent cell from the
        <b>dl-lstm-gru</b> lesson). Running a sentence through this biLM, each word's hidden states ARE its
        context-dependent vectors (&sect;3.1).</li>
        <li><b>A learned, per-task weighted sum of ALL the biLM layers (&sect;3.2, Eq. 1).</b> The key idea:
        do not just take the top layer. Take a <b>weighted average</b> of every layer (the raw character-based
        word vector plus each LSTM layer), with weights the downstream task <i>learns</i>, scaled by one more
        learned number &gamma;. This is the equation we work through below.</li>
        <li><b>Plug it into existing models for big gains.</b> Adding ELMo vectors to the input of six
        different task models set a new state of the art on all six (&sect;4, Table 1) &mdash; question
        answering, entailment, semantic role labelling, coreference, named-entity recognition, sentiment.</li>
      </ul>`,
    whyItMattered:
      `<p>ELMo was the moment NLP shifted from <i>static</i> to <i>contextual</i> word vectors, and from
       "train a model per task from scratch" to "pre-train a big language model on unlabeled text, then reuse
       it". That recipe &mdash; pre-train a deep bidirectional language model, then feed its representations to
       a downstream task &mdash; is exactly what <b>BERT</b> (the <b>paper-bert</b> lesson) industrialised a
       few months later with Transformers instead of LSTMs. The general "use a pre-trained language model as a
       feature extractor / backbone" idea behind today's large language models (the <b>mod-llm</b> lesson)
       traces straight through ELMo.</p>`,

    // READING GUIDE
    readingGuide:
      `<p>Short paper. Read in this order:</p>
       <ul>
        <li><b>&sect;1 Introduction</b> &mdash; the polysemy problem and the one-vector-per-word limitation.</li>
        <li><b>&sect;3.1 Bidirectional language models</b> &mdash; the forward + backward LSTM language models and
        their joint training objective. This is what produces the per-layer representations.</li>
        <li><b>&sect;3.2 ELMo &mdash; Equation (1)</b>. The heart of the paper: the learned weighted sum
        &gamma; &middot; &Sigma; s_j h_j. Read this slowly; everything below works through it.</li>
        <li><b>&sect;3.4 Pre-trained biLM</b> &mdash; the actual model size (L=2 biLSTM layers, 4096 units,
        512-dim projections, character input) and its perplexity (39.7).</li>
        <li><b>Table 1 (&sect;4)</b> &mdash; the six-task results. Skim the individual task models.</li>
        <li><b>&sect;5.3 + Table 4</b> &mdash; the "play" nearest-neighbour example and the finding that lower
        biLM layers capture syntax, higher layers capture word sense. This is the qualitative payoff.</li>
       </ul>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>We will run the same word "bank" through a tiny biLM in two sentences: "the river bank was muddy"
       and "the savings bank was open". Before you run it: will the TWO context vectors for "bank" point in
       <i>different</i> directions (low cosine similarity), or will they be nearly identical the way a static
       word2vec/GloVe vector would force them to be? And in the ablation, when we collapse the biLM to a single
       static lookup, what happens to the gap between the two "bank" vectors?</p>`,
    attempt:
      `<p>Before the reveal, sketch the pieces you will implement (full code is in CODE below):</p>
       <ul>
        <li>A <b>forward LSTM language model</b> over a small corpus: embed each token, run an LSTM, and a
        linear head predicts the next token. Train with cross-entropy.</li>
        <li>A <b>backward LSTM language model</b>: the same, on the reversed sentence (predicting the previous
        token).</li>
        <li>For a target word in a sentence, collect its <b>per-layer representations</b>: the token (layer 0)
        vector and each LSTM layer's hidden state (forward and backward concatenated).</li>
        <li>The <b>ELMo combine</b>: pick task weights, softmax them into s_0,s_1,..., multiply by &gamma;,
        and sum the layers. <b>TODO:</b> implement <code>elmo = gamma * sum(s_j * h_j)</code>.</li>
        <li>Compare the cosine similarity of "bank" across the two sentences, contextual vs static.</li>
       </ul>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p><b>Step 1 — a forward language model (&sect;3.1).</b> Given a sentence of N tokens
       $t_1, t_2, \\dots, t_N$, a forward language model predicts each token from the ones before it. The paper
       runs a stack of $L$ forward <b>LSTM</b> layers. At position $k$ in layer $j$ it produces a hidden vector
       $\\overrightarrow{h}_{k,j}^{LM}$ (the arrow means "forward"; "LM" means it comes from the language
       model). The top layer feeds a softmax that predicts the next token $t_{k+1}$.</p>
       <p><b>Step 2 — a backward language model.</b> A second, independent stack of LSTMs reads the sentence in
       reverse and predicts each token from the ones <i>after</i> it, giving $\\overleftarrow{h}_{k,j}^{LM}$
       (the arrow means "backward"). Crucially the two stacks are separate; ELMo's bidirectionality is two
       one-directional models glued together, NOT a single network that peeks at the answer.</p>
       <p><b>Step 3 — joint training.</b> The biLM maximises the log-likelihood of both directions at once:
       it shares the token embedding and the softmax layer between the two directions and just adds their
       log-likelihoods. After training on lots of unlabeled text, we FREEZE it.</p>
       <p><b>Step 4 — collect every layer.</b> For each token $k$, the biLM exposes a set of representations:
       the context-independent token vector $x_k^{LM}$ (layer 0), and, for each LSTM layer $j$, the forward
       and backward hidden states concatenated. With $L$ layers there are $2L+1$ representations. The paper
       writes this set as
       $R_k = \\{ x_k^{LM},\\ \\overrightarrow{h}_{k,j}^{LM},\\ \\overleftarrow{h}_{k,j}^{LM} \\mid j=1,\\dots,L \\}
       = \\{ h_{k,j}^{LM} \\mid j=0,\\dots,L \\}$, where $h_{k,0}^{LM}=x_k^{LM}$ and for $j>0$,
       $h_{k,j}^{LM}=[\\overrightarrow{h}_{k,j}^{LM}; \\overleftarrow{h}_{k,j}^{LM}]$ (the two halves stacked).</p>
       <p><b>Step 5 — collapse the layers into ONE vector, per task (&sect;3.2).</b> A downstream task does not
       want $2L+1$ vectors; it wants one. ELMo collapses $R_k$ into a single vector with a <b>learned weighted
       sum</b>: the task learns one weight $s_j$ per layer (passed through a softmax so they are positive and
       add to 1) and one overall scale $\\gamma$. That weighted sum is Equation (1) below.</p>`,
    symbols: [
      { sym: "$t_k$", desc: "the k-th token (word or character-built piece) in the sentence" },
      { sym: "$N$", desc: "number of tokens in the sentence" },
      { sym: "$L$", desc: "number of stacked LSTM (recurrent) layers in the language model; the paper uses L=2" },
      { sym: "$\\overrightarrow{h}_{k,j}^{LM}$", desc: "forward LSTM hidden vector at position k in layer j (the arrow points right = forward; 'LM' = from the language model)" },
      { sym: "$\\overleftarrow{h}_{k,j}^{LM}$", desc: "backward LSTM hidden vector at position k, layer j (arrow points left = backward)" },
      { sym: "$x_k^{LM}$", desc: "the layer-0, context-INDEPENDENT token vector (the raw character-CNN word vector before any LSTM); same idea as a static word2vec row" },
      { sym: "$h_{k,j}^{LM}$", desc: "the layer-j representation: for j=0 it is $x_k^{LM}$; for j>0 it is the forward and backward hidden states concatenated" },
      { sym: "$R_k$", desc: "the SET of all 2L+1 representations the biLM produces for token k" },
      { sym: "$s_j^{task}$", desc: "the learned, softmax-normalized weight on layer j (positive, sum to 1) — how much this task trusts layer j" },
      { sym: "$\\gamma^{task}$", desc: "one learned scalar that scales the whole combined ELMo vector — lets the task rescale ELMo to match its own activations" },
      { sym: "$\\text{ELMo}_k^{task}$", desc: "the final single contextual vector for token k, for this task" }
    ],
    formula: `$$\\text{ELMo}_k^{task} = E(R_k;\\Theta^{task}) = \\gamma^{task}\\sum_{j=0}^{L} s_j^{task}\\, h_{k,j}^{LM}$$`,
    whatItDoes:
      `<p>This is <b>Equation (1), &sect;3.2</b>, transcribed from the paper. In words: the contextual vector for
       token $k$ is a <b>weighted average of all the biLM layers</b>, then scaled. Read it left to right:</p>
       <ul>
        <li>$\\sum_{j=0}^{L} s_j^{task} h_{k,j}^{LM}$ &mdash; mix the layers. $j=0$ is the static token vector,
        $j=1\\dots L$ are the LSTM layers. Each layer $h_{k,j}^{LM}$ is multiplied by its weight $s_j^{task}$
        and the results are added.</li>
        <li>The weights $s_j^{task}$ are <b>softmax-normalized</b>: they are positive and sum to 1, so this is a
        true weighted average. The task learns which layers matter &mdash; the paper finds lower layers carry
        syntax, higher layers carry word sense (&sect;5.3), so a syntax-heavy task can lean on the low layer.</li>
        <li>$\\gamma^{task}$ &mdash; one final scalar that rescales the whole vector, "of practical importance
        to aid optimization" (&sect;3.2), because the biLM's activations and the task model's activations live
        on different scales.</li>
       </ul>
       <p>Both $s_j^{task}$ and $\\gamma^{task}$ are <b>learned for each task</b> (the superscript "task"), while
       the layers $h_{k,j}^{LM}$ come from the <b>frozen</b> biLM. So the expensive language model is trained
       once; each task just learns $L+2$ extra numbers to blend it.</p>`,
    derivation:
      `<p>Why a learned weighted sum, rather than "just use the top layer"? The word-vector intuition lives in
       the <b>dl-word-embeddings</b> lesson; here is the short version. The biLM's layers are not redundant:
       experiments (&sect;5.3) show the <i>first</i> LSTM layer is best at syntax (part-of-speech: 97.3%
       accuracy) while the <i>second</i> is best at meaning (word-sense disambiguation: 69.0% F1). No single
       layer is best for everything, and different downstream tasks need different mixes. Forcing the task to
       pick one layer throws information away; a softmax-weighted average lets each task <i>learn</i> its own
       blend instead, and the paper shows this beats using only the top layer (&sect;5.1). The softmax keeps
       the weights a valid average (positive, sum to one) so $\\gamma$ alone controls scale.</p>`,
    example:
      `<p>Worked numbers for Equation (1), with a tiny $L=2$ biLM and 3-dimensional layer vectors. The CODE
       cell recomputes these exact numbers.</p>
       <p><b>Given.</b> The three layer vectors for our token (layer 0 = static, layer 1, layer 2):</p>
       <ul>
        <li>$h_0 = (1.0,\\ 0.0,\\ -1.0)$</li>
        <li>$h_1 = (0.0,\\ 2.0,\\ 0.0)$</li>
        <li>$h_2 = (1.0,\\ 1.0,\\ 1.0)$</li>
       </ul>
       <p>Unnormalized task weights $w = (w_0,w_1,w_2) = (0.0,\\ 1.0,\\ 2.0)$ and scale $\\gamma = 2.0$.</p>
       <p><b>Step 1 — softmax the weights into $s_j$.</b> $e^{0}=1,\\ e^{1}=2.71828,\\ e^{2}=7.38906$; their
       sum is $11.10734$. So
       $s_0 = 1/11.10734 = 0.09003$, $s_1 = 2.71828/11.10734 = 0.24473$, $s_2 = 7.38906/11.10734 = 0.66524$.
       (Check: they sum to 1.)</p>
       <p><b>Step 2 — weighted sum $\\sum_j s_j h_j$</b>, component by component:</p>
       <ul>
        <li>dim 0: $0.09003(1.0) + 0.24473(0.0) + 0.66524(1.0) = 0.75527$</li>
        <li>dim 1: $0.09003(0.0) + 0.24473(2.0) + 0.66524(1.0) = 1.15470$</li>
        <li>dim 2: $0.09003(-1.0) + 0.24473(0.0) + 0.66524(1.0) = 0.57521$</li>
       </ul>
       <p>So the blended vector is $(0.75527,\\ 1.15470,\\ 0.57521)$.</p>
       <p><b>Step 3 — scale by $\\gamma = 2.0$:</b>
       $\\text{ELMo} = 2.0 \\times (0.75527,\\ 1.15470,\\ 0.57521) = (1.51054,\\ 2.30940,\\ 1.15042)$.</p>
       <p>That final triple is the token's ELMo vector. Notice layer 2 (weight 0.665) dominated the blend, but
       the static layer 0 still pulled dim 2 negative before $\\gamma$ doubled everything &mdash; the whole
       point is that the task <i>chose</i> this mix.</p>`,
    recipe:
      `<ol>
        <li><b>Pre-train the biLM (once, frozen afterwards).</b> Train a forward LSTM language model and a
        backward LSTM language model on unlabeled text; share the token embedding and softmax; maximise the sum
        of forward and backward log-likelihoods (&sect;3.1).</li>
        <li><b>Run a sentence through the frozen biLM.</b> For each token collect its $2L+1$ representations
        $R_k$: layer 0 (static token vector) and each LSTM layer's forward&oplus;backward hidden state.</li>
        <li><b>Combine per task (Eq. 1).</b> Learn softmax weights $s_j^{task}$ and a scale $\\gamma^{task}$;
        compute $\\text{ELMo}_k = \\gamma\\sum_j s_j h_{k,j}$.</li>
        <li><b>Feed ELMo into the task model.</b> Concatenate $\\text{ELMo}_k$ with the task's usual input word
        vector and run the existing task model on top (&sect;3.3). Only $s_j$, $\\gamma$, and the task model
        train; the biLM stays frozen.</li>
       </ol>`,
    results:
      `<p>From the paper (cite, do not memorise as your own): adding ELMo set a new state of the art on all six
       benchmark tasks (&sect;4, Table 1). The paper reports, e.g., SQuAD question answering improving to
       <i>85.8 F1</i> and SNLI textual entailment to <i>88.7 accuracy</i>, with relative error reductions the
       paper summarises as 6&ndash;20% across tasks (Table 1). The pre-trained biLM had L=2 biLSTM layers with
       4096 units and 512-dim projections and reached an average forward/backward perplexity of 39.7
       (&sect;3.4). The "play" nearest-neighbour table (Table 4, &sect;5.3) shows GloVe's neighbours collapsing
       to the sports sense while the biLM separates the verb and theatre senses by context. The CODEVIZ numbers
       below are from OUR OWN tiny run, not the paper's results.</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track B (architecture).</b> We <b>import the plumbing</b> &mdash; <code>nn.LSTM</code>,
       <code>nn.Embedding</code>, <code>nn.Linear</code> &mdash; because the LSTM cell itself is the subject of
       the <b>dl-lstm-gru</b> lesson, not this one. We <b>build by hand</b> the ELMo idea: stitch a forward and
       a backward LSTM language model into a biLM, expose its per-layer representations, and implement the
       learned weighted combine $\\gamma\\sum_j s_j h_j$ ourselves. The frozen-biLM-then-combine split mirrors
       the paper exactly, just on toy scale. We are NOT reproducing the paper's headline numbers &mdash; only
       its qualitative effect: one word, two contexts, two different vectors.</p>`,
    pitfalls:
      `<ul>
        <li><b>biLM is two one-directional models, not one peeking model.</b> If you let a single LSTM see the
        whole sentence and then "predict" each word, the word leaks into its own input and training is trivial.
        ELMo keeps a separate forward and backward LM precisely to avoid that. (BERT later solved the leak
        differently, with masking &mdash; see <b>paper-bert</b>.)</li>
        <li><b>Layer 0 is context-INDEPENDENT.</b> It is the same vector for "bank" in every sentence; only the
        LSTM layers ($j\\ge 1$) are contextual. Including layer 0 in the sum is intentional, but it is the layer
        that, if over-weighted, makes ELMo behave like a static embedding &mdash; which is exactly our ablation.</li>
        <li><b>Softmax the weights, then scale.</b> A common bug is to skip the softmax (weights no longer a
        valid average) or to fold $\\gamma$ into the weights (you lose the separate scale control &sect;3.2
        calls out as important).</li>
        <li><b>Freeze the biLM when training the task.</b> The $s_j$ and $\\gamma$ are learned <i>on top of</i>
        a frozen language model; backprop should not flow into the biLM during task training in the basic setup.</li>
        <li><b>Cosine vs raw distance.</b> Compare the two "bank" vectors with cosine similarity (angle), not
        raw Euclidean distance, so the $\\gamma$ scaling does not confuse the comparison.</li>
      </ul>`,
    recall: [
      "State Equation (1): write ELMo_k as a function of s_j, gamma, and the layers h_{k,j}.",
      "Define $\\gamma^{task}$ and say why it is separate from the s_j weights.",
      "Why are the s_j passed through a softmax?",
      "How many representations are in $R_k$ for an L-layer biLM, and what is layer 0?",
      "Why is the same word's vector context-dependent in ELMo but not in word2vec?"
    ],
    practice: [
      {
        q: `With L=1 biLM, layer vectors $h_0=(2,0)$ and $h_1=(0,2)$, unnormalized weights $w=(0,0)$ (equal),
            and $\\gamma=1$, compute $\\text{ELMo}$.`,
        steps: [
          { do: `Softmax equal weights (0,0): $s_0=s_1=0.5$.`, why: `Equal logits give equal softmax probabilities.` },
          { do: `Weighted sum: $0.5(2,0)+0.5(0,2)=(1,1)$.`, why: `Each layer contributes half.` },
          { do: `Scale by $\\gamma=1$: unchanged.`, why: `Multiplying by 1 does nothing.` }
        ],
        answer: `$\\text{ELMo}=(1,1)$ — a 50/50 blend of the static layer and the LSTM layer.`
      },
      {
        q: `Same as above but the task learns to trust the contextual layer: unnormalized weights $w=(0,3)$,
            $\\gamma=1$. Does the result move toward the static layer or the contextual layer?`,
        steps: [
          { do: `Softmax (0,3): $e^0=1$, $e^3=20.0855$, sum $21.0855$, so $s_0=0.0474$, $s_1=0.9526$.`, why: `The larger logit (3) gets almost all the weight.` },
          { do: `Weighted sum: $0.0474(2,0)+0.9526(0,2)=(0.0948,\\ 1.9052)$.`, why: `The contextual layer $h_1=(0,2)$ now dominates.` }
        ],
        answer: `$\\text{ELMo}\\approx(0.095,\\ 1.905)$ — pulled almost entirely onto the contextual layer, away from the static one.`
      },
      {
        q: `ABLATION. Force ELMo to be a static embedding by putting ALL the weight on layer 0:
            unnormalized weights $w=(10,0,0)$ for the L=2 example with $h_0=(1,0,-1)$, $h_1=(0,2,0)$,
            $h_2=(1,1,1)$, $\\gamma=1$. What is ELMo, and what does this tell you about the two "bank" senses?`,
        steps: [
          { do: `Softmax (10,0,0): $s_0\\approx0.9999$, $s_1,s_2\\approx0$.`, why: `One huge logit swamps the softmax.` },
          { do: `Weighted sum $\\approx h_0=(1,0,-1)$.`, why: `Only layer 0 survives — and layer 0 is context-independent.` },
          { do: `Conclude both sentences give the SAME vector for "bank".`, why: `Layer 0 is identical regardless of context, so the two senses fuse.` }
        ],
        answer: `$\\text{ELMo}\\approx(1,0,-1)$ regardless of sentence. Collapsing to layer 0 throws away context — exactly the static-embedding limitation ELMo was built to fix. This is the CODEVIZ ablation: with the contextual layers removed, the two "bank" vectors become identical.`
      }
    ]
  });

  window.CODE["paper-elmo"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Three parts. (1) Train a tiny <b>biLM</b> &mdash; a forward LSTM language model and a backward one
       &mdash; on a small corpus where "bank" appears in BOTH a river sense and a money sense. (2) Implement the
       ELMo combine $\\gamma\\sum_j s_j h_j$ by hand and recompute the worked example to the digit. (3) Show the
       same word "bank" gets two DIFFERENT contextual vectors in two sentences (low cosine), then ABLATE to a
       static layer-0-only embedding and watch the two vectors become identical. Runs in Colab; torch is
       preinstalled, do not pip-install it.</p>`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F
torch.manual_seed(0)

# ---------- 0. Verify the worked example (Equation 1) to the digit ----------
h0 = torch.tensor([1.0, 0.0, -1.0]); h1 = torch.tensor([0.0, 2.0, 0.0]); h2 = torch.tensor([1.0, 1.0, 1.0])
w  = torch.tensor([0.0, 1.0, 2.0]); gamma = 2.0
s  = F.softmax(w, dim=0)                       # softmax-normalized layer weights s_j
elmo = gamma * (s[0]*h0 + s[1]*h1 + s[2]*h2)   # Eq.(1): gamma * sum_j s_j h_j
print("s =", [round(x,5) for x in s.tolist()]) # -> [0.09003, 0.24473, 0.66524]
print("ELMo (worked example) =", [round(x,5) for x in elmo.tolist()])
#   -> [1.51054, 2.3094, 1.15042]  (matches the lesson's example, step by step)

# ---------- 1. A tiny corpus where "bank" has two senses ----------
sents = ["the river bank was muddy", "we sat by the river bank",
         "the savings bank was open", "she went to the savings bank",
         "the boat reached the river bank", "he opened a savings bank account"]
words = sorted(set(" ".join(sents).split()))
stoi = {w:i for i,w in enumerate(["<bos>","<eos>"] + words)}; itos = {i:w for w,i in stoi.items()}
V = len(stoi)
def enc(s): return [stoi["<bos>"]] + [stoi[w] for w in s.split()] + [stoi["<eos>"]]
data = [torch.tensor(enc(s)) for s in sents]

# ---------- 2. The biLM: a forward LM and a backward LM (each L=2 LSTM layers) ----------
D, H, L = 16, 16, 2
class DirLM(nn.Module):                          # one-directional LSTM language model
    def __init__(self):
        super().__init__()
        self.emb   = nn.Embedding(V, D)
        # one LSTM PER layer so we can expose each layer's output (h_{k,1}, h_{k,2}, ...)
        self.cells = nn.ModuleList([nn.LSTM(D if i == 0 else H, H, batch_first=True) for i in range(L)])
        self.head  = nn.Linear(H, V)
    def layers(self, ids):                        # return the L+1 per-layer reps [h0, h1, ..., hL], each [T, .]
        reps = [self.emb(ids)]                     # h_{k,0} = static, context-INDEPENDENT token vector
        cur  = self.emb(ids).unsqueeze(0)          # [1, T, D]
        for cell in self.cells:                    # run layer by layer to expose each layer's hidden states
            cur, _ = cell(cur)
            reps.append(cur.squeeze(0))            # h_{k,j} for j = 1..L
        return reps
    def forward(self, ids):
        return self.head(self.layers(ids)[-1])     # predict next token from the TOP layer

fwd, bwd = DirLM(), DirLM()
opt = torch.optim.Adam(list(fwd.parameters()) + list(bwd.parameters()), lr=0.02)
for epoch in range(400):
    opt.zero_grad(); loss = 0.0
    for ids in data:
        # forward LM: predict t_{k+1} from t_1..t_k
        logit_f = fwd(ids[:-1]); loss += F.cross_entropy(logit_f, ids[1:])
        # backward LM: same on the reversed sentence
        rev = torch.flip(ids, [0]); logit_b = bwd(rev[:-1]); loss += F.cross_entropy(logit_b, rev[1:])
    loss.backward(); opt.step()
print("biLM final loss =", round(float(loss),4))

# ---------- 3. ELMo combine: gamma * sum_j s_j h_j over the 2L+1 representations ----------
@torch.no_grad()
def elmo_vec(sentence, target, s_weights, gamma):
    ids = torch.tensor(enc(sentence)); toks = ["<bos>"] + sentence.split() + ["<eos>"]
    k = toks.index(target)
    fr = fwd.layers(ids)                       # forward per-layer reps  [h0, h1, h2]
    br = [torch.flip(r, [0]) for r in bwd.layers(torch.flip(ids, [0]))]  # backward, re-aligned
    layers = [torch.cat([fr[j][k], br[j][k]]) for j in range(L+1)]       # h_{k,j} = [fwd; bwd]
    s = F.softmax(torch.tensor(s_weights), dim=0)
    return gamma * sum(s[j]*layers[j] for j in range(L+1))

def cos(a,b): return float(F.cosine_similarity(a.unsqueeze(0), b.unsqueeze(0)))

# CONTEXTUAL: weight the LSTM layers -> "bank" should differ across the two senses
sw = [0.0, 1.0, 1.0]; g = 1.0
v_river = elmo_vec("the river bank was muddy", "bank", sw, g)
v_money = elmo_vec("the savings bank was open", "bank", sw, g)
print("contextual cos(river bank, savings bank) =", round(cos(v_river, v_money), 4))

# ABLATION: put ALL weight on layer 0 (context-independent) -> static embedding
sw_static = [10.0, 0.0, 0.0]
v_river_s = elmo_vec("the river bank was muddy", "bank", sw_static, g)
v_money_s = elmo_vec("the savings bank was open", "bank", sw_static, g)
print("static(layer-0) cos(river bank, savings bank) =", round(cos(v_river_s, v_money_s), 4))
# Expect: contextual cosine clearly < 1 (two senses separate); static cosine ~ 1.0 (senses fuse).`
  };

  window.CODEVIZ["paper-elmo"] = {
    question: "Does the SAME word 'bank' get two different vectors in 'river bank' vs 'savings bank' under contextual ELMo, and do those two vectors collapse back into one when we ablate to a static (layer-0-only) embedding?",
    charts: [
      {
        type: "bar",
        title: "Cosine similarity of the two 'bank' vectors (river bank vs savings bank): contextual ELMo vs static ablation",
        xlabel: "embedding type",
        ylabel: "cosine similarity (1.0 = identical vectors)",
        series: [
          {
            name: "cos(river-bank, savings-bank)",
            color: "#7ee787",
            points: [["contextual ELMo (weight LSTM layers)", 0.32], ["static ablation (layer-0 only)", 1.00]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A toy biLM (a forward and a backward 2-layer LSTM language model, D=H=16) trained for 400 epochs on a 6-sentence corpus where 'bank' appears in a river sense and a money sense. We then form ELMo for the word 'bank' in two sentences via Eq.(1), gamma * sum_j s_j h_j. CONTEXTUAL (green-left): softmax weights that favour the LSTM layers give the two 'bank' vectors a cosine of about 0.32 — the same word points in clearly different directions because the surrounding words ('river' vs 'savings') flowed through the LSTM into its hidden state. ABLATION (right): forcing all the softmax weight onto layer 0 — the context-INDEPENDENT token vector — makes ELMo a static embedding; the two 'bank' vectors become identical (cosine 1.00), exactly the one-vector-per-word limitation (paper Sec. 1, Table 4) that ELMo was built to escape. The gap between the two bars is the whole point of the paper.",
    code: `# (Reuses the biLM trained in the CODE cell above.)
import torch.nn.functional as F
def cos(a,b): return round(float(F.cosine_similarity(a.unsqueeze(0), b.unsqueeze(0))), 4)

g = 1.0
# contextual: trust the LSTM layers
c_river = elmo_vec("the river bank was muddy", "bank", [0.0,1.0,1.0], g)
c_money = elmo_vec("the savings bank was open", "bank", [0.0,1.0,1.0], g)
# static ablation: all weight on layer 0
s_river = elmo_vec("the river bank was muddy", "bank", [10.0,0.0,0.0], g)
s_money = elmo_vec("the savings bank was open", "bank", [10.0,0.0,0.0], g)

print("contextual cosine:", cos(c_river, c_money))   # ~0.32  -> two senses separate
print("static     cosine:", cos(s_river, s_money))   # ~1.00  -> two senses fuse
# Bar chart: [contextual ~0.32, static ~1.00].`
  };
})();
