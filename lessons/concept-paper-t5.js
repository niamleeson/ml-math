/* Paper lesson — "Exploring the Limits of Transfer Learning with a Unified Text-to-Text
   Transformer" (T5), Raffel et al. 2019.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-t5".
   GROUNDED from arXiv:1910.10683 (abstract) and the ar5iv HTML mirror (Sections 2.1 "Model",
   2.4 / 3.1 text-to-text framework, 3.1.4 span-corruption objective).
   Track B (architecture): build a tiny T5-style encoder-decoder Transformer from nn.Linear /
   nn.LayerNorm / nn.Embedding; cast THREE toy tasks (reverse, +1, last-symbol QA) as ONE
   text->text problem with task-prefix tokens; train a single model on all three; show it learns
   them all; then ABLATE T5's simplified relative position bias and watch the order-dependent
   tasks collapse. The plumbing of attention/positional encoding is taught in paper-transformer
   (cross-linked); the bigger-picture LLM math lives in concept mod-llm. */
(function () {
  window.LESSONS.push({
    id: "paper-t5",
    title: "T5 — Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer (2019)",
    tagline: "Cast every NLP task — translation, classification, question answering — as text in → text out, and pre-train one encoder-decoder Transformer to do them all.",
    module: "Papers · Transformers & LLMs",
    track: "architecture",
    paper: {
      authors: "Colin Raffel, Noam Shazeer, Adam Roberts, Katherine Lee, Sharan Narang, Michael Matena, Yanqi Zhou, Wei Li, Peter J. Liu",
      org: "Google, Mountain View, CA",
      year: 2019,
      venue: "arXiv:1910.10683 (Oct 2019); JMLR 2020",
      citations: "",
      arxiv: "https://arxiv.org/abs/1910.10683",
      code: "https://github.com/google-research/text-to-text-transfer-transformer"
    },
    conceptLink: "mod-llm",
    partOf: [],
    prereqs: ["paper-transformer", "mod-transformer", "mod-llm", "pt-nn-module", "pt-tensors"],

    // WHY READ IT
    problem:
      `<p>By 2019 <b>transfer learning</b> — pre-train a model on a huge data-rich task, then
       <b>fine-tune</b> it on a smaller downstream task — had become the dominant recipe in
       <b>natural language processing (NLP)</b> (the field of getting computers to work with human
       language). <i>Transfer learning</i> means reusing what a model learned on one task to help on
       another; <i>fine-tune</i> means continuing training on the new task's data. But the field had
       exploded into a tangle of incompatible choices (&sect;1): different <b>model architectures</b>
       (encoder-only like BERT, decoder-only, encoder-decoder), different pre-training
       <b>objectives</b> (what fill-in-the-blank game the model plays on raw text), different
       datasets, and a different <b>output head</b> bolted on for every task — a classifier for
       sentiment, a span-pointer for question answering, a sequence generator for translation.</p>
       <p>Because every paper changed several of these knobs at once, you could not tell <i>which</i>
       choice actually drove the gains. The authors set out to "explore the limits" by running a
       single, systematic comparison — and to do that cleanly they first needed one common format
       that every task could be poured into.</p>`,
    contribution:
      `<ul>
        <li><b>The unified text-to-text framework.</b> Reframe <i>every</i> task — translation,
        classification, similarity scoring, question answering, summarization — as "feed the model
        some text, get some text back" (&sect;2.4). A short <b>task-prefix</b> string tells the model
        which task it is. One model, one loss (next-token prediction), one decoder — no task-specific
        output heads.</li>
        <li><b>One clean encoder-decoder architecture.</b> A standard Transformer encoder-decoder
        (&sect;2.1) with two deliberate simplifications: <b>Layer Normalization with no additive
        bias</b>, placed on the <i>input</i> of each sub-component, and a <b>simplified relative
        position bias</b> (a learned scalar added to each attention logit) replacing the original
        sinusoidal positional encoding.</li>
        <li><b>A span-corruption pre-training objective + a big clean corpus (C4).</b> Drop out 15% of
        the tokens in a sentence, replace each contiguous dropped span with a single
        <b>sentinel</b> token, and train the model to generate the missing spans (&sect;3.1.4). Plus
        a controlled study, on a new web-scale dataset they call <b>C4</b>, of which knob matters.</li>
      </ul>`,
    whyItMattered:
      `<p>"Text-to-text" became a default mental model for NLP: one interface for many tasks, which is
       exactly how today's instruction-following chat models are used (you type text, you get text).
       T5 itself, and its successors (mT5, ByT5, Flan-T5, UL2), are still strong encoder-decoder
       baselines, and the paper's careful ablation table is a reference for "what actually helps." It
       is also a clean worked example of the encoder-<b>decoder</b> design, complementing the
       decoder-only GPT line.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2.1 (Model)</b> — the encoder-decoder structure and its two changes from the
        original Transformer: LayerNorm with <i>no bias</i> on each sub-component's input, and the
        <b>simplified relative position embeddings</b> (the part you will implement and ablate). Note
        the exact line: "each 'embedding' is simply a scalar that is added to the corresponding logit
        used for computing the attention weights."</li>
        <li><b>&sect;2.4 / Figure 1 (the text-to-text framework)</b> — how translation, MNLI
        classification, STS-B similarity, and QA are all written as input string &rarr; target
        string with a task prefix. This is the central idea.</li>
        <li><b>&sect;3.1.4 / Figure 2 (the unsupervised objective)</b> — the span-corruption
        ("Thank you for inviting me…") example with sentinel tokens <code>&lt;X&gt; &lt;Y&gt;
        &lt;Z&gt;</code>.</li>
       </ul>
       <p><b>Skim:</b> the giant systematic-study sections (&sect;3.2–&sect;3.7: architectures,
       objectives, datasets, fine-tuning, scaling) on a first pass — they are the "limits" experiments
       and reward a second reading. Skim the per-benchmark result tables unless you are reproducing.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train <b>one</b> tiny T5-style encoder-decoder on <b>three</b> toy tasks at once,
       each written text-to-text with its own prefix token: <code>&lt;rev&gt;</code> reverse the
       digits, <code>&lt;inc&gt;</code> add 1 to each digit, <code>&lt;last&gt;</code> output only the
       last digit (a one-token "question answering"). Now the prediction: T5's only position signal is
       the <b>relative position bias</b> — a learned scalar, added to each attention logit, that
       depends on how far apart two tokens are. If we <b>remove</b> that bias, self-attention becomes
       order-blind. Which of the three tasks survive the ablation, and which collapse? Write your guess
       and one sentence of reasoning before running.</p>
       <p>(Hint: ask, for each task, whether the answer depends on <i>where</i> a digit sits.
       <code>&lt;last&gt;</code> only needs "which token is at the end"; <code>&lt;rev&gt;</code> needs
       the full ordering.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the pieces you will build on top of <code>nn.Linear</code> /
       <code>nn.LayerNorm</code> / <code>nn.Embedding</code>. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><code>RelPosBias(nn.Module)</code>: an <code>nn.Embedding(num_buckets, n_heads)</code>
        holding one <b>scalar per (bucket, head)</b>. TODO: for a query at position $i$ and key at
        position $j$, map the signed offset $j-i$ into a <b>bucket</b> (bidirectional: a "past" half
        and a "future" half; far offsets share a bucket), look up the per-head scalar, and <b>add it
        to the attention logit</b> before the softmax (&sect;2.1).</li>
        <li><code>EncoderBlock</code> / <code>DecoderBlock</code>: standard Transformer blocks, but
        apply <code>nn.LayerNorm</code> to the <i>input</i> of each sub-component and add the
        sub-component's output back as a residual (T5's pre-norm placement, &sect;2.1). The decoder
        block has self-attention (causal-masked) + cross-attention to the encoder + a feed-forward.</li>
        <li>The data loader: TODO emit <code>(source, target)</code> token strings for the three
        tasks, each prefixed by its task token — one shared vocabulary, one model.</li>
       </ul>
       <p>Then train the single model on the mixed stream, and run it again with the relative position
       bias switched off (the ablation). Predict which tasks break.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>T5 has two big ideas: a <b>framing</b> (text-to-text) and a small set of <b>architecture
       choices</b>. The plumbing — scaled dot-product attention, multi-head attention, residual blocks
       — is the original Transformer (see <b>paper-transformer</b>); here we focus on what T5 changes.</p>
       <p><b>1. The text-to-text framing (&sect;2.4).</b> Pick a single interface: the model always
       reads a string and writes a string. To tell it <i>which</i> task, prepend a short
       <b>task-prefix</b> to the input. The paper's examples: translation is
       <code>"translate English to German: That is good."</code> &rarr; <code>"Das ist gut."</code>;
       the MNLI classification task is <code>"mnli premise: I hate pigeons. hypothesis: My feelings
       towards pigeons are filled with animosity."</code> &rarr; <code>"entailment"</code> — the
       <i>label is emitted as a word</i>, not picked by a classifier head. Because the output is always
       text, one decoder and one next-token loss handle everything.</p>
       <p><b>2. The encoder-decoder (&sect;2.1).</b> The <b>encoder</b> reads the whole input with
       bidirectional self-attention into context-aware vectors; the <b>decoder</b> generates the
       output left-to-right, at each step doing causal (masked) self-attention over what it has written
       so far <i>and</i> cross-attention into the encoder's output. Two deliberate simplifications vs
       the 2017 Transformer: (a) <b>LayerNorm with no additive bias</b> — activations are only rescaled
       — applied to the <i>input</i> of each sub-component, with the normalization placed outside the
       residual path; (b) the position signal below.</p>
       <p><b>3. Simplified relative position bias (&sect;2.1) — the piece we implement and ablate.</b>
       The original Transformer <i>added</i> a sinusoidal vector to the token embeddings. T5 instead
       does nothing to the embeddings and injects position directly into attention: "each 'embedding'
       is simply a scalar that is added to the corresponding logit used for computing the attention
       weights." The scalar depends only on the <b>relative</b> distance between the query token and
       the key token, not their absolute positions. To keep the parameter count tiny, nearby distances
       get their own bucket while far ones are binned together: the paper uses 32 buckets "with ranges
       that increase in size logarithmically up to an offset of 128 beyond which we assign all relative
       positions to the same embedding." The scalars are <b>shared across all layers</b>, but each
       attention <b>head</b> learns its own set.</p>
       <p><b>4. The pre-training game (&sect;3.1.4).</b> Before any task, the model is taught language
       by <b>span corruption</b>: randomly drop 15% of a sentence's tokens; replace each contiguous run
       of dropped tokens by one unique <b>sentinel</b> token; train the model to output the dropped
       spans (each prefixed by its sentinel). Figure 2's example: input <code>"Thank you &lt;X&gt; me to
       your party &lt;Y&gt; week."</code> &rarr; target <code>"&lt;X&gt; for inviting &lt;Y&gt; last
       &lt;Z&gt;"</code>. Note this is already text-to-text, so pre-training and fine-tuning share one
       format.</p>`,
    symbols: [
      { sym: "text-to-text", desc: "the plain-English framing: the model always takes a string as input and produces a string as output. Every task is expressed this way." },
      { sym: "task-prefix", desc: "a short string (e.g. <code>\"translate English to German:\"</code> or our toy <code>&lt;rev&gt;</code>) prepended to the input to tell the one shared model which task to perform." },
      { sym: "encoder / decoder", desc: "the <b>encoder</b> reads the whole input with bidirectional self-attention; the <b>decoder</b> writes the output one token at a time (causal self-attention + cross-attention into the encoder)." },
      { sym: "$i,\\ j$", desc: "token positions: $i$ is the <b>query</b> position (the token doing the looking), $j$ is the <b>key</b> position (a token being looked at)." },
      { sym: "$j - i$", desc: "the <b>relative position</b> (signed offset) of key $j$ from query $i$. Negative = key is to the left (past), positive = key is to the right (future). T5's bias depends only on this, not on $i$ or $j$ alone." },
      { sym: "$\\mathrm{bucket}(j-i)$", desc: "the function that bins a signed offset into one of a small number of buckets — small offsets get their own bucket, large ones are merged (logarithmically), so the table stays small. The paper uses 32 buckets, max offset 128." },
      { sym: "$b_{h,\\,\\mathrm{bucket}}$", desc: "the learned <b>scalar</b> for head $h$ and a given bucket. This is the entire relative-position parameter set: one number per (head, bucket), shared across all layers." },
      { sym: "logit", desc: "an attention <i>score</i> $q_i\\!\\cdot\\! k_j / \\sqrt{d_k}$ <i>before</i> the softmax. T5 adds the position scalar to this number." },
      { sym: "$d_k$", desc: "the per-head key/query width; the dot products are divided by $\\sqrt{d_k}$ (the scaled-dot-product scaling, from paper-attention)." },
      { sym: "LayerNorm (no bias)", desc: "<b>Layer Normalization</b> that re-centers and re-scales each token's vector but applies <i>no</i> additive bias — \"activations are only rescaled.\" T5 applies it to the input of each sub-component." },
      { sym: "sentinel token", desc: "a special placeholder token (written <code>&lt;X&gt;, &lt;Y&gt;, &lt;Z&gt;</code>) that marks where a corrupted span was removed in the input and labels that span in the target." },
      { sym: "span corruption", desc: "the unsupervised pre-training objective: drop 15% of tokens, replace each dropped contiguous span by one sentinel, and train the model to regenerate the dropped spans." }
    ],
    formula: `$$ \\text{logit}_{i,j} \\;=\\; \\frac{q_i \\cdot k_j}{\\sqrt{d_k}} \\;+\\; b_{\\,h,\\;\\mathrm{bucket}(j-i)} \\qquad\\text{(\\S 2.1: relative position scalar added to each attention logit)} $$
$$ \\text{Attention weights for query } i:\\quad \\alpha_{i,\\cdot} \\;=\\; \\mathrm{softmax}_j\\big(\\text{logit}_{i,j}\\big) $$`,
    whatItDoes:
      `<p>The equation is ordinary scaled dot-product attention with <b>one extra term</b>. The first
       part, $q_i\\!\\cdot\\! k_j/\\sqrt{d_k}$, is the usual content match: how much query token $i$
       wants key token $j$ based on their vectors. The second part, $b_{h,\\,\\mathrm{bucket}(j-i)}$, is
       a single learned number that depends <i>only</i> on the relative offset $j-i$ (binned into a
       bucket) and the head $h$. Adding it <i>before</i> the softmax lets the model learn position
       preferences directly in attention — e.g. a head can learn "attend more to the token immediately
       to my left" by giving the bucket for offset $-1$ a large positive scalar. Because the term is the
       <i>same scalar</i> for every query/key pair sharing a relative offset, and is shared across
       layers, it costs almost nothing: just (number of buckets) &times; (number of heads) parameters.
       Remove this term and attention sees only content, with no notion of order — which is exactly the
       ablation below.</p>`,
    derivation:
      `<p>This is a Track-B architecture paper, so the "why it's true" is a design rationale, not a
       theorem; the underlying attention math is owned by <b>paper-transformer</b> / mod-llm and only
       recapped here.</p>
       <p><b>Why a relative scalar instead of sinusoids?</b> What attention actually needs is a sense of
       <i>distance</i> between tokens, and that is inherently relative — "the previous word" is the same
       relationship at position 5 or position 500. Encoding it as an additive bias on the logit puts the
       signal exactly where it is used (the attention comparison) and makes it cheap. <b>Why bucket
       offsets logarithmically?</b> A separate parameter for every possible distance would be huge and
       most far distances behave alike, so T5 gives small offsets their own bucket and merges large ones
       (all offsets beyond 128 share one bucket). <b>Why share across layers but split across heads?</b>
       Sharing across layers keeps the position table tiny; giving each head its own scalars lets
       different heads specialize on different distance patterns — the same motivation as multi-head
       attention. <b>Why drop the LayerNorm bias?</b> An empirical simplification: the paper found the
       additive bias unnecessary, so "activations are only rescaled."</p>`,
    example:
      `<p>Work the relative-position bucketing by hand for the settings used in the notebook:
       <b>16 buckets, bidirectional</b>, so the buckets split into 8 for the "past" (offset
       $\\le 0$) and 8 for the "future" (offset $\\gt 0$). Take a query at position $i=2$ and bucket
       each key position $j$ by its signed offset $j-i$:</p>
       <ul class="steps">
        <li><b>Offset $0$ (the query attends to itself, $j=2$).</b> $j-i=0$ &rarr; bucket $0$ (the
        first "past/zero" bucket).</li>
        <li><b>Key to the left ($j=1$, offset $-1$; $j=0$, offset $-2$).</b> Small negative offsets get
        their own buckets: $-1\\to$ bucket $1$, $-2\\to$ bucket $2$. These live in the first 8 (the past
        half).</li>
        <li><b>Key to the right ($j=3$, offset $+1$; $j=4$, offset $+2$; $j=5$, offset $+3$).</b>
        Positive offsets land in the <i>second</i> half (buckets 8–15): $+1\\to$ bucket $9$,
        $+2\\to$ bucket $10$, $+3\\to$ bucket $11$.</li>
       </ul>
       <p>So the query at position 2 looks up scalars from buckets $[2,1,0,9,10,11]$ across keys
       $[0,1,2,3,4,5]$. The bias is therefore <b>direction-aware</b>: a left neighbour (bucket 1) and a
       right neighbour (bucket 9) get <i>different</i> learned scalars, which is how a single number per
       offset still lets a head prefer, say, the token just before it. (With the paper's full settings —
       32 buckets, max offset 128 — the only change is more fine-grained buckets and a logarithmic merge
       of far offsets; the mechanism is identical.) The notebook recomputes exactly these six bucket
       indices so you can check them.</p>`,
    recipe:
      `<ol>
        <li><b>One shared vocabulary + task prefixes.</b> Build a token set with a few special tokens
        (<code>BOS, EOS, PAD</code>) plus one <b>task-prefix</b> token per task. Express each example
        as <code>(source_tokens, target_tokens)</code> (&sect;2.4).</li>
        <li><b>Relative position bias (&sect;2.1).</b> An <code>nn.Embedding(num_buckets, n_heads)</code>
        of scalars; bucket the offset $j-i$; add $b_{h,\\mathrm{bucket}(j-i)}$ to every attention logit
        before softmax. Build it once; reuse the module in encoder self-attention and decoder
        self-attention.</li>
        <li><b>Encoder block.</b> LayerNorm &rarr; multi-head self-attention (+ position bias) &rarr;
        residual; LayerNorm &rarr; feed-forward (Linear&ndash;ReLU&ndash;Linear) &rarr; residual.</li>
        <li><b>Decoder block.</b> LayerNorm &rarr; <i>causal</i> self-attention (+ position bias)
        &rarr; residual; LayerNorm &rarr; cross-attention into the encoder output &rarr; residual;
        LayerNorm &rarr; feed-forward &rarr; residual.</li>
        <li><b>Train one model</b> on the mixed three-task stream with teacher forcing and a single
        next-token cross-entropy loss (the text-to-text loss).</li>
        <li><b>Ablate:</b> switch the relative position bias off and retrain — order-dependent tasks
        collapse.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): by combining the text-to-text framework with their study and
       scale, the authors "achieve state-of-the-art results on many benchmarks covering summarization,
       question answering, text classification, and more." The paper reports training models "up to 11
       billion parameters" (&sect;1) and evaluates on GLUE, SuperGLUE, SQuAD, CNN/Daily Mail, and WMT
       translation. (We do not restate the per-benchmark scores from memory — see the paper's tables.)</p>
       <p><i>These are the paper's reported claims, quoted from the abstract. Every number in the CODE
       and CODEVIZ panels below is from our own tiny three-task run — our small-scale run, not the
       paper's reported numbers.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: PyTorch ships the primitives, so you
       <b>import</b> them and build only T5's novel composition. <b>Import:</b> <code>nn.Linear</code>,
       <code>nn.LayerNorm</code>, <code>nn.Embedding</code>, <code>F.softmax</code>,
       <code>F.cross_entropy</code>, the optimizer, and the causal mask via
       <code>torch.triu</code>. <b>Build by hand:</b> the text-to-text data with task-prefix tokens, the
       <b>simplified relative position bias</b> (bucketing + per-head scalar added to the logit), the
       encoder/decoder blocks wired T5-style, and the <b>position-bias ablation</b>. We reuse — not
       re-derive — scaled dot-product / multi-head attention and the encoder-decoder idea; those are the
       <b>paper-transformer</b> and mod-llm lessons.</p>`,
    pitfalls:
      `<ul>
        <li><b>Adding the bias in the wrong place.</b> The scalar is added to the <i>logit</i> (before
        the softmax), not to the embeddings and not after the softmax. <b>Fix:</b>
        <code>scores = QKᵀ/√d_k + bias</code>, then <code>softmax</code>.</li>
        <li><b>Forgetting the bias is direction-aware.</b> Offset $+1$ and offset $-1$ map to
        <i>different</i> buckets (bidirectional split). If you bucket on <code>abs(offset)</code> only,
        a head can no longer tell "left neighbour" from "right neighbour" — and reverse becomes
        impossible.</li>
        <li><b>Sharing vs splitting the wrong way.</b> T5 shares the position scalars <i>across
        layers</i> but gives each <i>head</i> its own. Per-layer tables waste parameters; a single
        shared scalar across heads kills head specialization.</li>
        <li><b>Putting a LayerNorm bias back in.</b> T5's LayerNorm has no additive bias ("activations
        are only rescaled"). It also normalizes the <i>input</i> of each sub-component. Match the paper.</li>
        <li><b>Mixing up the decoder masks.</b> Decoder self-attention must be causal (a token may not
        see future tokens); cross-attention into the encoder is <i>not</i> masked. Swapping them leaks
        the answer or starves the decoder.</li>
        <li><b>Reading the ablation as "position never matters."</b> The <code>&lt;last&gt;</code> task
        partly survives the ablation precisely because it barely needs order; the order-heavy tasks
        (<code>&lt;rev&gt;</code>, <code>&lt;inc&gt;</code>) collapse. The ablation isolates <i>which</i>
        tasks need position, not whether position is ever useful.</li>
      </ul>`,
    recall: [
      "State the T5 attention logit with the position term (\\S 2.1) from memory, and say where the scalar is added relative to the softmax.",
      "What does the relative position scalar depend on — and what is it independent of? (offset $j-i$ and head; independent of absolute $i,j$ and of layer.)",
      "Give two concrete text-to-text examples (input prefix &rarr; target), one classification and one translation, in T5's format.",
      "Describe the span-corruption objective: what fraction is dropped, what replaces a dropped span, and what the target looks like.",
      "Name the two ways T5's architecture differs from the original 2017 Transformer."
    ],
    practice: [
      {
        q: `<b>The ablation.</b> Your one tiny T5 reaches ~100% on all three text-to-text tasks
            (<code>&lt;rev&gt;</code>, <code>&lt;inc&gt;</code>, <code>&lt;last&gt;</code>) <i>with</i>
            the relative position bias. You delete the position bias (the only thing the model knows
            about order) and retrain everything else identically. What happens to each task, and what
            does the split tell you?`,
        steps: [
          { do: `Change exactly one thing: set <code>use_relpos=False</code> so no scalar is added to any attention logit. Keep depth, width, heads, optimizer, data, and seed identical.`, why: `An honest ablation varies only the relative position bias, so any change is attributable to it.` },
          { do: `Retrain and read per-task accuracy: <code>&lt;rev&gt;</code> and <code>&lt;inc&gt;</code> collapse toward chance, while <code>&lt;last&gt;</code> only partly drops.`, why: `Reversing and per-position +1 both require knowing each token's place; outputting the last symbol needs only "the end token," which survives weak position information.` },
          { do: `Conclude that the relative position bias — not extra capacity — is what lets the order-blind attention respect token order.`, why: `Both runs share architecture and parameter count except for the position scalars, isolating them as the cause.` }
        ],
        answer: `<p>With the relative position bias removed, the order-dependent tasks
                 (<code>&lt;rev&gt;</code>, <code>&lt;inc&gt;</code>) collapse toward chance because plain
                 self-attention is permutation-invariant — it can see <i>which</i> digits are present but
                 not <i>where</i> they go. The <code>&lt;last&gt;</code> task degrades far less, since it
                 needs almost no ordering. In our run overall sequence accuracy fell from ~1.0 to ~0.15.
                 Because the two runs are identical except for the position scalars, this isolates the
                 relative position bias as the source of order information. The CODEVIZ panel shows the
                 contrast.</p>`
      },
      {
        q: `In the worked example (16 buckets, bidirectional, query at position 2), the keys at
            positions $[0,1,2,3,4,5]$ mapped to buckets $[2,1,0,9,10,11]$. Why do the left neighbour
            (offset $-1$) and right neighbour (offset $+1$) get <i>different</i> buckets (1 vs 9), and
            why does that matter for the reverse task?`,
        steps: [
          { do: `Read the bucketing: bidirectional splits the 16 buckets into a "past" half (offsets $\\le 0$, buckets 0–7) and a "future" half (offsets $\\gt 0$, buckets 8–15).`, why: `So sign is preserved: $-1$ lands in the past half (bucket 1), $+1$ in the future half (bucket 9).` },
          { do: `Note that each bucket has its own learned per-head scalar, so "one token to my left" and "one token to my right" can be weighted differently.`, why: `Direction-aware bias lets a head prefer, say, the previous token specifically.` },
          { do: `Connect to reverse: producing output position $k$ from input position $N{-}1{-}k$ requires the model to count from a known end and move in a consistent direction.`, why: `If $+1$ and $-1$ shared a bucket, the model could not distinguish "the token before" from "the token after," and reversing would be impossible.` }
        ],
        answer: `<p>The bidirectional split sends negative offsets to the first 8 buckets and positive
                 offsets to the last 8, so offset $-1$ (bucket 1) and offset $+1$ (bucket 9) carry
                 different learned scalars. That direction-awareness is what lets a head treat "the token
                 to my left" differently from "the token to my right." Reversing a sequence depends on
                 exactly that distinction, which is why collapsing the two directions (or removing the
                 bias entirely) breaks <code>&lt;rev&gt;</code> while leaving the order-free
                 <code>&lt;last&gt;</code> task largely intact.</p>`
      },
      {
        q: `T5 pre-trains with <b>span corruption</b> before any task. For the sentence "Thank you for
            inviting me to your party last week.", suppose the tokens "for inviting" and "last" are the
            ones dropped. Write the corrupted input and the target in T5's sentinel format, and explain
            why this objective is itself "text-to-text."`,
        steps: [
          { do: `Replace each dropped contiguous span by one unique sentinel: "for inviting" &rarr; <code>&lt;X&gt;</code>, "last" &rarr; <code>&lt;Y&gt;</code>.`, why: `\\S 3.1.4: consecutive dropped tokens share a single sentinel; each span gets a distinct one.` },
          { do: `Write the input: <code>"Thank you &lt;X&gt; me to your party &lt;Y&gt; week."</code>`, why: `The model sees the surviving tokens with sentinels marking the gaps.` },
          { do: `Write the target as the dropped spans, each prefixed by its sentinel, ending with a final sentinel: <code>"&lt;X&gt; for inviting &lt;Y&gt; last &lt;Z&gt;"</code>.`, why: `The decoder regenerates only the missing pieces, in order, delimited by sentinels.` }
        ],
        answer: `<p>Input: <code>"Thank you &lt;X&gt; me to your party &lt;Y&gt; week."</code>; target:
                 <code>"&lt;X&gt; for inviting &lt;Y&gt; last &lt;Z&gt;"</code> (Figure 2). It is
                 text-to-text because the model is given a string and asked to produce a string, using the
                 <i>same</i> encoder-decoder, vocabulary, and next-token loss as every downstream task —
                 so pre-training and fine-tuning differ only in the data, not the interface. That
                 uniformity is the whole point of T5.</p>`
      }
    ]
  });

  window.CODE["paper-t5"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> a tiny T5-style encoder-decoder from <code>nn.Linear</code> /
       <code>nn.LayerNorm</code> / <code>nn.Embedding</code>, including T5's <b>simplified relative
       position bias</b> (a per-head scalar, bucketed by relative offset, added to each attention
       logit). We cast <b>three</b> toy tasks as one text-to-text problem with task-prefix tokens —
       <code>&lt;rev&gt;</code> (reverse the digits), <code>&lt;inc&gt;</code> (add 1 to each digit, a
       tiny "translation"), <code>&lt;last&gt;</code> (output only the last digit, a one-token "question
       answering") — and train a <b>single</b> model on the mixed stream. It prints per-task accuracy
       (all three reach ~100%). The <b>ablation</b> sets <code>use_relpos=False</code> and retrains: the
       order-dependent tasks collapse. The first cell recomputes the worked example — query at position
       2 maps keys [0..5] to buckets [2,1,0,9,10,11]. Paste into Colab and run (torch is preinstalled —
       no pip).</p>`,
    code: `import math, torch, torch.nn as nn, torch.nn.functional as F, random
torch.manual_seed(0); random.seed(0)

# ===== shared vocabulary: specials + 3 task-prefix tokens + digits 0..9 =====
PAD, BOS, EOS = 0, 1, 2
REV, INC, LAST = 3, 4, 5          # task-prefix tokens (the text-to-text "which task")
DIG0 = 6; V = DIG0 + 10           # digits 0..9 -> ids 6..15
def dig(d): return DIG0 + d
N = 4                              # fixed source length (isolates the POSITION effect)

# ===== text-to-text data: every task is (source string -> target string) with a prefix =====
def make_example():
    task = random.choice(["rev", "inc", "last"])
    seq = [random.randint(0, 9) for _ in range(N)]
    if task == "rev":   src = [REV]  + [dig(x) for x in seq];        tgt = [dig(x) for x in reversed(seq)]
    elif task == "inc": src = [INC]  + [dig(x) for x in seq];        tgt = [dig((x + 1) % 10) for x in seq]
    else:               src = [LAST] + [dig(x) for x in seq];        tgt = [dig(seq[-1])]
    return [BOS] + src + [EOS], [BOS] + tgt + [EOS]
def pad(b):
    m = max(len(x) for x in b); return torch.tensor([x + [PAD] * (m - len(x)) for x in b])
def batch(bs=64):
    ex = [make_example() for _ in range(bs)]; return pad([s for s, t in ex]), pad([t for s, t in ex])

# ===== T5 simplified relative position bias: bucket(offset) -> per-head scalar, added to the logit =====
def rel_bucket(rp, num_buckets=16, max_distance=64):     # bidirectional bucketing (\\S 2.1, simplified)
    nb = num_buckets // 2                                 # half "past" (offset<=0), half "future" (offset>0)
    rb = (rp > 0) * nb                                    # future offsets live in the second half
    rp = abs(rp); max_exact = nb // 2
    if rp < max_exact:                                    # small offsets: their own bucket
        val = rp
    else:                                                 # large offsets: merged logarithmically
        val = max_exact + int(math.log(max(rp, 1) / max_exact) / math.log(max_distance / max_exact) * (nb - max_exact))
        val = min(val, nb - 1)
    return rb + val

# ----- worked example: query at position 2, keys 0..5 -> buckets [2,1,0,9,10,11] -----
q = 2
print("buckets for query@2, keys 0..5:", [rel_bucket(k - q) for k in range(6)])   # [2, 1, 0, 9, 10, 11]

class RelPosBias(nn.Module):
    def __init__(self, h, num_buckets=16, max_distance=64):
        super().__init__(); self.nb, self.md = num_buckets, max_distance
        self.emb = nn.Embedding(num_buckets, h)          # ONE scalar per (bucket, head); shared across layers
    def forward(self, q_len, k_len, device):
        bk = torch.tensor([[rel_bucket(j - i, self.nb, self.md) for j in range(k_len)]
                           for i in range(q_len)], device=device)
        return self.emb(bk).permute(2, 0, 1).unsqueeze(0)    # (1, h, q_len, k_len) -> add to logits

# ===== multi-head attention (imported primitives), position bias added to the logit =====
class MHA(nn.Module):
    def __init__(self, d, h):
        super().__init__(); self.h, self.dk = h, d // h
        self.Wq, self.Wk, self.Wv, self.Wo = (nn.Linear(d, d, bias=False) for _ in range(4))
    def split(self, x):
        B, S, _ = x.shape; return x.view(B, S, self.h, self.dk).transpose(1, 2)
    def forward(self, xq, xkv, bias=None, mask=None):
        Q, K, Vv = self.split(self.Wq(xq)), self.split(self.Wk(xkv)), self.split(self.Wv(xkv))
        s = Q @ K.transpose(-2, -1) / math.sqrt(self.dk)     # scaled dot-product logits
        if bias is not None: s = s + bias                    # \\S 2.1: position scalar added to the logit
        if mask is not None: s = s.masked_fill(mask, float("-inf"))
        out = (F.softmax(s, dim=-1) @ Vv).transpose(1, 2).contiguous().view(xq.shape[0], xq.shape[1], self.h * self.dk)
        return self.Wo(out)

class FF(nn.Module):
    def __init__(self, d, ff):
        super().__init__(); self.n = nn.Sequential(nn.Linear(d, ff), nn.ReLU(), nn.Linear(ff, d))
    def forward(self, x): return self.n(x)

# ===== T5-style blocks: LayerNorm (no bias) on the INPUT of each sub-component, then residual =====
class EncoderBlock(nn.Module):
    def __init__(self, d, h, ff):
        super().__init__(); self.a = MHA(d, h); self.f = FF(d, ff)
        self.n1 = nn.LayerNorm(d, bias=False); self.n2 = nn.LayerNorm(d, bias=False)
    def forward(self, x, bias):
        x = x + self.a(self.n1(x), self.n1(x), bias)         # self-attention + position bias
        return x + self.f(self.n2(x))                        # feed-forward
class DecoderBlock(nn.Module):
    def __init__(self, d, h, ff):
        super().__init__(); self.sa = MHA(d, h); self.ca = MHA(d, h); self.f = FF(d, ff)
        self.n1 = nn.LayerNorm(d, bias=False); self.n2 = nn.LayerNorm(d, bias=False); self.n3 = nn.LayerNorm(d, bias=False)
    def forward(self, x, enc, sbias, cmask):
        x = x + self.sa(self.n1(x), self.n1(x), sbias, cmask)  # causal self-attention + position bias
        x = x + self.ca(self.n2(x), enc)                       # cross-attention into the encoder (no mask)
        return x + self.f(self.n3(x))

class TinyT5(nn.Module):
    def __init__(self, V, d=64, h=4, ff=128, L=2, use_relpos=True):
        super().__init__(); self.use = use_relpos
        self.emb = nn.Embedding(V, d)
        self.enc = nn.ModuleList([EncoderBlock(d, h, ff) for _ in range(L)])
        self.dec = nn.ModuleList([DecoderBlock(d, h, ff) for _ in range(L)])
        self.encbias = RelPosBias(h); self.decbias = RelPosBias(h)
        self.fn = nn.LayerNorm(d, bias=False); self.head = nn.Linear(d, V, bias=False)
    def forward(self, src, tgt):
        e = self.emb(src)
        eb = self.encbias(src.size(1), src.size(1), src.device) if self.use else None
        for b in self.enc: e = b(e, eb)
        d = self.emb(tgt); T = tgt.size(1)
        causal = torch.triu(torch.ones(T, T, dtype=torch.bool, device=tgt.device), 1)[None, None]
        db = self.decbias(T, T, tgt.device) if self.use else None
        for b in self.dec: d = b(d, e, db, causal)
        return self.head(self.fn(d))

def train(use_relpos, steps=2500, lr=2e-3):
    torch.manual_seed(0); random.seed(0)
    net = TinyT5(V, use_relpos=use_relpos); opt = torch.optim.Adam(net.parameters(), lr=lr)
    for _ in range(steps):
        src, tgt = batch()
        logits = net(src, tgt[:, :-1])                       # teacher forcing: predict tgt shifted by 1
        loss = F.cross_entropy(logits.reshape(-1, V), tgt[:, 1:].reshape(-1), ignore_index=PAD)
        opt.zero_grad(); loss.backward(); opt.step()
    return net

@torch.no_grad()
def evaluate(net, n=300):
    random.seed(123); per = {"rev": [0, 0], "inc": [0, 0], "last": [0, 0]}; name = {REV: "rev", INC: "inc", LAST: "last"}; tot = 0
    for _ in range(n):
        src, tgt = make_example(); t = name[src[1]]; s = pad([src]); ys = [BOS]
        for _ in range(N + 2):                               # greedy decode
            o = net(s, torch.tensor([ys])); nx = int(o[0, -1].argmax()); ys.append(nx)
            if nx == EOS: break
        p = ys[1:]
        if p and p[-1] == EOS: p = p[:-1]
        ok = (p == tgt[1:-1]); per[t][1] += 1; per[t][0] += int(ok); tot += int(ok)
    return tot / n, {k: f"{v[0]}/{v[1]}" for k, v in per.items()}

print("\\nONE model, THREE text-to-text tasks, WITH relative position bias:")
net = train(True);  acc, per = evaluate(net);  print(f"  seq-acc={acc:.3f}  per-task={per}")
print("ABLATION: same model, relative position bias OFF:")
net2 = train(False); acc2, per2 = evaluate(net2); print(f"  seq-acc={acc2:.3f}  per-task={per2}")
# Typical (our small run, not the paper's numbers):
#   WITH bias    -> seq-acc 1.000  (rev 101/101, inc 100/100, last 99/99)
#   WITHOUT bias -> seq-acc 0.150  (rev 3/101, inc 10/100, last 32/99) -- order-dependent tasks collapse.
# Exact numbers vary by hardware/seed; this is our small-scale run, not the paper's reported result.`
  };

  window.CODEVIZ["paper-t5"] = {
    question: "Can one tiny T5-style encoder-decoder learn three tasks at once when they are all cast as text-to-text — and does removing T5's relative position bias (ablation) destroy the order-dependent ones?",
    charts: [
      {
        type: "line",
        title: "Mixed three-task sequence accuracy vs step — relative position bias ON vs OFF (ablation)",
        xlabel: "training step",
        ylabel: "exact-match sequence accuracy",
        series: [
          {
            name: "rel-pos bias on",
            color: "#7ee787",
            points: [[0,0.0],[50,0.36],[100,0.727],[150,0.96],[200,0.967],[300,1.0],[400,1.0],[600,1.0],[800,1.0],[1200,1.0],[1600,1.0],[2000,1.0],[2500,1.0]]
          },
          {
            name: "rel-pos bias off (ablation)",
            color: "#ff7b72",
            points: [[0,0.0],[50,0.16],[100,0.14],[150,0.147],[200,0.16],[300,0.147],[400,0.213],[600,0.167],[800,0.207],[1200,0.22],[1600,0.2],[2000,0.207],[2500,0.167]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A single tiny T5-style encoder-decoder (d_model=64, 4 heads, 2+2 layers) trained on a MIXED stream of three tasks, each written text-to-text with a task-prefix token: &lt;rev&gt; reverse 4 digits, &lt;inc&gt; add 1 to each digit, &lt;last&gt; output only the last digit. WITH T5's simplified relative position bias (green) one model masters all three — exact-match sequence accuracy climbs from 0 to 1.0 by ~step 300 (final per-task: rev 101/101, inc 100/100, last 99/99). The ABLATION (red, the same model with the per-head position scalars switched off) flatlines near 0.15-0.22: with no order signal the permutation-invariant attention can read which digits are present but not where they go, so the order-dependent rev/inc tasks collapse and only the order-free &lt;last&gt; task partly survives. Same architecture, width, heads, optimizer, and seed; the only difference is the relative position bias.",
    code: `import math, torch, torch.nn as nn, torch.nn.functional as F, random
torch.manual_seed(0); random.seed(0)
PAD, BOS, EOS, REV, INC, LAST, DIG0 = 0, 1, 2, 3, 4, 5, 6
V = DIG0 + 10; N = 4
def dig(d): return DIG0 + d
def make_example():
    task = random.choice(["rev", "inc", "last"]); seq = [random.randint(0, 9) for _ in range(N)]
    if task == "rev":   src = [REV]  + [dig(x) for x in seq];  tgt = [dig(x) for x in reversed(seq)]
    elif task == "inc": src = [INC]  + [dig(x) for x in seq];  tgt = [dig((x + 1) % 10) for x in seq]
    else:               src = [LAST] + [dig(x) for x in seq];  tgt = [dig(seq[-1])]
    return [BOS] + src + [EOS], [BOS] + tgt + [EOS]
def pad(b):
    m = max(len(x) for x in b); return torch.tensor([x + [PAD] * (m - len(x)) for x in b])
def batch(bs=64):
    ex = [make_example() for _ in range(bs)]; return pad([s for s, t in ex]), pad([t for s, t in ex])
def rel_bucket(rp, nb=16, md=64):
    half = nb // 2; rb = (rp > 0) * half; rp = abs(rp); me = half // 2
    val = rp if rp < me else min(me + int(math.log(max(rp, 1) / me) / math.log(md / me) * (half - me)), half - 1)
    return rb + val
class RelPosBias(nn.Module):
    def __init__(self, h, nb=16, md=64):
        super().__init__(); self.nb, self.md = nb, md; self.emb = nn.Embedding(nb, h)
    def forward(self, q, k, dev):
        bk = torch.tensor([[rel_bucket(j - i, self.nb, self.md) for j in range(k)] for i in range(q)], device=dev)
        return self.emb(bk).permute(2, 0, 1).unsqueeze(0)
class MHA(nn.Module):
    def __init__(self, d, h):
        super().__init__(); self.h, self.dk = h, d // h
        self.Wq, self.Wk, self.Wv, self.Wo = (nn.Linear(d, d, bias=False) for _ in range(4))
    def split(self, x):
        B, S, _ = x.shape; return x.view(B, S, self.h, self.dk).transpose(1, 2)
    def forward(self, xq, xkv, bias=None, mask=None):
        Q, K, Vv = self.split(self.Wq(xq)), self.split(self.Wk(xkv)), self.split(self.Wv(xkv))
        s = Q @ K.transpose(-2, -1) / math.sqrt(self.dk)
        if bias is not None: s = s + bias
        if mask is not None: s = s.masked_fill(mask, float("-inf"))
        return self.Wo((F.softmax(s, -1) @ Vv).transpose(1, 2).contiguous().view(xq.shape[0], xq.shape[1], self.h * self.dk))
class FF(nn.Module):
    def __init__(self, d, ff):
        super().__init__(); self.n = nn.Sequential(nn.Linear(d, ff), nn.ReLU(), nn.Linear(ff, d))
    def forward(self, x): return self.n(x)
class Enc(nn.Module):
    def __init__(self, d, h, ff):
        super().__init__(); self.a = MHA(d, h); self.f = FF(d, ff)
        self.n1 = nn.LayerNorm(d, bias=False); self.n2 = nn.LayerNorm(d, bias=False)
    def forward(self, x, b): x = x + self.a(self.n1(x), self.n1(x), b); return x + self.f(self.n2(x))
class Dec(nn.Module):
    def __init__(self, d, h, ff):
        super().__init__(); self.sa = MHA(d, h); self.ca = MHA(d, h); self.f = FF(d, ff)
        self.n1 = nn.LayerNorm(d, bias=False); self.n2 = nn.LayerNorm(d, bias=False); self.n3 = nn.LayerNorm(d, bias=False)
    def forward(self, x, e, sb, cm):
        x = x + self.sa(self.n1(x), self.n1(x), sb, cm); x = x + self.ca(self.n2(x), e); return x + self.f(self.n3(x))
class TinyT5(nn.Module):
    def __init__(self, V, d=64, h=4, ff=128, L=2, use=True):
        super().__init__(); self.use = use; self.emb = nn.Embedding(V, d)
        self.enc = nn.ModuleList([Enc(d, h, ff) for _ in range(L)]); self.dec = nn.ModuleList([Dec(d, h, ff) for _ in range(L)])
        self.eb = RelPosBias(h); self.db = RelPosBias(h); self.fn = nn.LayerNorm(d, bias=False); self.head = nn.Linear(d, V, bias=False)
    def forward(self, src, tgt):
        e = self.emb(src); eb = self.eb(src.size(1), src.size(1), src.device) if self.use else None
        for b in self.enc: e = b(e, eb)
        d = self.emb(tgt); T = tgt.size(1)
        cm = torch.triu(torch.ones(T, T, dtype=torch.bool, device=tgt.device), 1)[None, None]
        db = self.db(T, T, tgt.device) if self.use else None
        for b in self.dec: d = b(d, e, db, cm)
        return self.head(self.fn(d))
@torch.no_grad()
def quick(net, n=150):
    random.seed(7); tot = 0
    for _ in range(n):
        src, tgt = make_example(); s = pad([src]); ys = [BOS]
        for _ in range(N + 2):
            o = net(s, torch.tensor([ys])); nx = int(o[0, -1].argmax()); ys.append(nx)
            if nx == EOS: break
        p = ys[1:]
        if p and p[-1] == EOS: p = p[:-1]
        tot += int(p == tgt[1:-1])
    return round(tot / n, 3)
def track(use, evals=(0,50,100,150,200,300,400,600,800,1200,1600,2000,2500), lr=2e-3):
    torch.manual_seed(0); random.seed(0)
    net = TinyT5(V, use=use); opt = torch.optim.Adam(net.parameters(), lr=lr); es = set(evals); curve = []
    for st in range(max(evals) + 1):
        if st in es: curve.append([st, quick(net)])
        src, tgt = batch(); lg = net(src, tgt[:, :-1])
        loss = F.cross_entropy(lg.reshape(-1, V), tgt[:, 1:].reshape(-1), ignore_index=PAD)
        opt.zero_grad(); loss.backward(); opt.step()
    return curve
print("rel-pos ON :", track(True))
print("rel-pos OFF:", track(False))
# ON  -> 0.0, 0.36, 0.73, 0.96, ... 1.0 by ~step 300 (one model learns all three text-to-text tasks)
# OFF -> flat ~0.15-0.22 (order-dependent rev/inc collapse; only order-free <last> partly survives)`
  };
})();
