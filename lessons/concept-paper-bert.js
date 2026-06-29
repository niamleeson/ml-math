/* Paper lesson — "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
   Devlin, Chang, Lee, Toutanova 2018.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-bert".
   GROUNDED from arXiv:1810.04805 (ar5iv HTML mirror; Section 3.1 Masked LM, the 15% / 80-10-10 split,
   Section 3 architecture BERT-BASE/LARGE, Table 1 GLUE).
   Track B (architecture): build a tiny bidirectional Transformer encoder + a masked-language-model (MLM)
   head from torch.nn on a small word corpus; mask 15% of tokens and predict them; show the MLM loss falling
   and a filled-in [MASK]; ABLATE bidirectionality (causal/left-to-right attention) and watch MLM get harder.
   The transformer block math lives in paper-transformer; the bigger LLM picture lives in concept mod-llm. */
(function () {
  window.LESSONS.push({
    id: "paper-bert",
    title: "BERT — Pre-training of Deep Bidirectional Transformers (2018)",
    tagline: "Pre-train a Transformer encoder by masking 15% of the words and predicting them from BOTH sides, then fine-tune the same model on any language task.",
    module: "Papers · Transformers & LLMs",
    track: "architecture",
    paper: {
      authors: "Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova",
      org: "Google AI Language",
      year: 2018,
      venue: "arXiv:1810.04805 (Oct 2018); NAACL 2019",
      citations: "",
      arxiv: "https://arxiv.org/abs/1810.04805",
      code: "https://github.com/google-research/bert"
    },
    conceptLink: "mod-llm",
    partOf: [],
    prereqs: ["mod-llm", "paper-transformer", "mod-transformer", "dl-language-model", "dl-attention", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p>By 2018 the Transformer (the <b>paper-transformer</b> lesson) was the dominant sequence model, and
       people had started <b>pre-training</b> language models on huge unlabeled text and then reusing them. But
       the strongest of those, like the original GPT, were <b>left-to-right</b>: a model that reads a sentence
       one word at a time and, at each position, may only look at the words <i>before</i> it. A <b>language
       model</b> here means a model that predicts a word from its context; "left-to-right" (also called
       <b>causal</b> or <b>unidirectional</b>) means the context is only the words to the left.</p>
       <p>The paper's complaint (&sect;1) is that this is wasteful for <i>understanding</i> tasks. To decide
       what a word means, you usually want the words on <b>both</b> sides of it. In the sentence
       "the cat ___ on the mat", the blank is constrained by "the cat" on the left <i>and</i> "on the mat" on
       the right. A left-to-right model never gets to use the right side. The paper writes that standard
       language models are unidirectional, and "this limits the choice of architectures... and could be
       very harmful when applying fine-tuning based approaches to token-level tasks" (&sect;1).</p>
       <p>Why not just read both directions at once? Because in an ordinary language model, "seeing both sides"
       would let each word peek at <i>itself</i> through the network &mdash; the answer leaks, and prediction
       becomes trivial. The paper's whole trick is a training objective that makes bidirectional reading safe.</p>`,
    contribution:
      `<ul>
        <li><b>The Masked Language Model (MLM) objective (&sect;3.1).</b> Randomly hide 15% of the input
        tokens (a <b>token</b> is one word or sub-word piece), replacing each with a special
        <code>[MASK]</code> symbol, and train the model to predict the hidden words. Because the model never
        sees the hidden word in the input, it is safe to let it read the <i>whole rest of the sentence</i> on
        both sides &mdash; "deep bidirectional" representations (abstract).</li>
        <li><b>A deep bidirectional Transformer encoder.</b> BERT is just a stack of Transformer encoder
        blocks (the same block you built in paper-transformer) with <b>no causal mask</b>, so every position
        attends to every other position. BERT-BASE has 12 layers, hidden width 768, 12 heads (110M
        parameters); BERT-LARGE has 24 layers, width 1024, 16 heads (340M) (&sect;3).</li>
        <li><b>Next Sentence Prediction (NSP) and the pre-train / fine-tune recipe.</b> A second objective
        (does sentence B really follow sentence A?) plus the idea that <b>one</b> pre-trained model can be
        fine-tuned for many tasks by adding a tiny output layer (&sect;3.1, &sect;4).</li>
      </ul>`,
    whyItMattered:
      `<p>BERT made "pre-train once, fine-tune everywhere" the default in natural-language processing. The paper
       reports a new state of the art on eleven tasks; the headline is the <b>GLUE</b> benchmark (a suite of
       language-understanding tests), where BERT reached "80.5% ... a 7.7% point absolute improvement" over the
       prior best (abstract, Table 1). RoBERTa, ALBERT, DistilBERT, ELECTRA and a decade of encoder models are
       direct descendants &mdash; you will meet several of them in this module. The masked-prediction idea also
       jumped to vision as the Masked Autoencoder (<b>paper-mae</b>).</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3.1 (Task #1: Masked LM)</b> &mdash; the core of this lesson. The 15% masking rate and the
        <b>80/10/10</b> rule: of the chosen tokens, replace with <code>[MASK]</code> 80% of the time, a random
        word 10%, and leave unchanged 10%. Note <i>why</i> (the <code>[MASK]</code> symbol never appears at
        fine-tune time, so you must not over-rely on it).</li>
        <li><b>&sect;3 (Model Architecture)</b> &mdash; BERT is a multi-layer bidirectional Transformer
        encoder; the BERT-BASE / BERT-LARGE sizes; the comparison to GPT's left-to-right Transformer
        (Figure 1 / Figure 3).</li>
        <li><b>Figure 1</b> &mdash; the pre-training then fine-tuning picture: same architecture, swap only the
        top layer.</li>
        <li><b>Table 1</b> &mdash; the GLUE results, for the headline number.</li>
       </ul>
       <p><b>Skim:</b> &sect;3.1 Task #2 (Next Sentence Prediction) &mdash; we mention it but our tiny build
       focuses on the MLM. Skim the input-embedding details (&sect;3, the token + segment + position
       embeddings), the fine-tuning task-by-task setup (&sect;4), and the ablations / SQuAD tables (&sect;5)
       unless you want to reproduce them.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train a tiny BERT on a small corpus by masking 15% of the words and predicting them, and
       watch the <b>masked-LM loss fall</b>. Then comes the ablation: we make attention <b>causal</b>
       (left-to-right), so when predicting a masked word the model may only use the words to its <i>left</i> &mdash;
       exactly the limitation BERT was designed to remove. Same data, same masking, same size &mdash; only the
       attention direction changes.</p>
       <p>Question: will the left-to-right model reach the <i>same</i> masked-LM loss as the bidirectional one,
       or a <i>higher</i> (worse) one? Write your guess and one sentence of reasoning &mdash; think about the
       blank in "the cat ___ on the mat" and how much the right side ("on the mat") tells you. Then run it.</p>`,
    attempt:
      `<p>Before the reveal, sketch the four pieces you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><code>TinyBERT(nn.Module)</code>: a token <code>nn.Embedding</code> plus a sinusoidal positional
        encoding added in, then a stack of encoder blocks, then an <b>MLM head</b>
        <code>nn.Linear(d_model, vocab)</code> that turns each position's vector into a score for every word.
        TODO: the attention inside the block uses <b>no causal mask</b> &mdash; every position sees every
        other.</li>
        <li><code>mask_batch(batch)</code>: pick 15% of positions; for each chosen one, with probability 0.8
        overwrite it with <code>[MASK]</code>, 0.1 with a random word, 0.1 leave it. TODO: record the
        <i>original</i> word as the label only at chosen positions; mark all other positions as "ignore".</li>
        <li>The loss: cross-entropy of the head's logits against the labels, <b>only at masked positions</b>
        (use <code>ignore_index</code> for the rest). TODO: this is the MLM objective.</li>
        <li>The ablation: a second model whose attention adds a <b>causal mask</b> (a position may not attend
        to positions after it). TODO: train it the same way and compare the final MLM loss.</li>
       </ul>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>BERT has two halves: an <b>architecture</b> (a bidirectional Transformer encoder) and a
       <b>training objective</b> (masked language modeling). The architecture is not new &mdash; it is the
       encoder you built in <b>paper-transformer</b>. The objective is the contribution; spend your attention
       there.</p>
       <p><b>1. The architecture: a bidirectional encoder.</b> Stack $L$ Transformer encoder blocks. Each block
       is multi-head <b>self-attention</b> followed by a small feed-forward network, each wrapped in
       residual + LayerNorm (all from paper-transformer). The one thing that makes it "bidirectional" is what
       it does <i>not</i> do: it applies <b>no causal mask</b>. In a left-to-right model, attention is masked so
       position $i$ can only attend to positions $\\le i$; BERT drops that mask, so every position attends to
       <i>every</i> position &mdash; left and right context together (&sect;3). Inputs are word embeddings plus
       position information (BERT also adds segment embeddings for sentence-pair tasks; our tiny build uses
       token + position only).</p>
       <p><b>2. Why you can't just read both directions naively.</b> Suppose you trained the usual language-model
       objective "predict word $i$" but let the model see all positions. Then to predict word $i$ the model can
       look at position $i$ itself &mdash; the answer is sitting right there in the input. It would learn nothing.
       The paper calls this letting a word "see itself" (&sect;3.1). So bidirectionality needs a different
       objective.</p>
       <p><b>3. The Masked LM objective (&sect;3.1).</b> Here is the fix. Before feeding a sentence in,
       randomly choose <b>15%</b> of the token positions. <i>Corrupt</i> the input at those positions, then ask
       the model to reconstruct the <b>original</b> words there. Because the true word is no longer in the input
       at a masked slot, the model is free to use the entire rest of the sentence &mdash; both sides &mdash; with
       no leak. The loss is computed <b>only at the chosen positions</b>; the model is graded on filling the
       blanks.</p>
       <p><b>4. The 80/10/10 corruption (&sect;3.1).</b> How do we "corrupt" a chosen position? Not always with
       <code>[MASK]</code>. The catch: the special <code>[MASK]</code> symbol appears during pre-training but
       <b>never</b> during fine-tuning on a real task, so a model that only ever predicts under a literal
       <code>[MASK]</code> would be mismatched. The paper's remedy: of the 15% chosen tokens, replace with
       <code>[MASK]</code> 80% of the time, with a <b>random word</b> 10% of the time, and leave the word
       <b>unchanged</b> 10% of the time. The model never knows which of the three happened, so it must build a
       useful representation of <i>every</i> token, not just the masked ones (&sect;3.1).</p>
       <p>For prediction, the encoder's output vector at a masked position is fed through the MLM head &mdash; a
       linear map to a score (logit) per vocabulary word &mdash; and softmax + cross-entropy against the true
       word is the loss. That is exactly the language-model loss of the <b>dl-language-model</b> concept, just
       applied at the masked slots with two-sided context.</p>`,
    architecture:
      `<p>BERT is "a multi-layer bidirectional Transformer encoder" (&sect;3) &mdash; the encoder block from
       <b>paper-transformer</b> (multi-head self-attention &rarr; position-wise feed-forward, each wrapped in
       residual + LayerNorm), stacked $L$ times with <b>no causal mask</b> so every position attends to every
       other. Three sizes parameterize it: $L$ = number of stacked layers, $H$ = hidden width, $A$ = number of
       attention heads; the feed-forward inner size is fixed at $4H$.</p>
       <ul>
        <li><b>BERT-BASE:</b> $L=12$, $H=768$, $A=12$ &mdash; $110$M parameters (sized to match GPT for a fair
        comparison).</li>
        <li><b>BERT-LARGE:</b> $L=24$, $H=1024$, $A=16$ &mdash; $340$M parameters.</li>
       </ul>
       <p><b>Input side (&sect;3.2).</b> Text is split by <b>WordPiece</b> (sub-word tokenization, 30,000-token
       vocabulary). Every sequence starts with the special <code>[CLS]</code> token and uses <code>[SEP]</code>
       to mark sentence boundaries: <code>[CLS]</code> A <code>[SEP]</code> B <code>[SEP]</code>. Each token's
       input vector is the sum of three width-$H$ embeddings &mdash; token + segment (which sentence) + position
       &mdash; as in the formula panel. The final hidden vector over <code>[CLS]</code>, written $\\mathbf{C}$,
       is the pooled summary used for sentence-level outputs (e.g. NSP, and downstream classification).</p>
       <p><b>Two heads on one trunk.</b> The same encoder feeds two pre-training heads at once: the <b>MLM head</b>
       (a linear map $H \\to V$ at masked positions) and the <b>NSP head</b> (a binary linear map on
       $\\mathbf{C}$). No task-specific architecture is bolted on.</p>
       <p><b>Pre-train &rarr; fine-tune paradigm (&sect;3, Figure 1).</b> First <i>pre-train</i> the encoder on
       large unlabeled text with MLM + NSP. Then <i>fine-tune</i>: initialize from the pre-trained weights, add a
       small task-specific output layer, and update <i>all</i> parameters on the labeled downstream data. One
       architecture, swap only the top layer &mdash; sentence-pair tasks read $\\mathbf{C}$, token-level tasks
       (e.g. SQuAD span prediction) read the per-token $\\mathbf{h}_i$. See <b>paper-transformer</b> for the
       encoder block internals this lesson reuses.</p>`,
    symbols: [
      { sym: "token", desc: "one unit of input &mdash; a word or sub-word piece. BERT's input is a sequence of tokens; a few are special, like <code>[MASK]</code> and <code>[CLS]</code>." },
      { sym: "$[\\text{MASK}]$", desc: "a special placeholder token that replaces a hidden word in the input. The model's job is to predict what word was there." },
      { sym: "$[\\text{CLS}]$", desc: "the special <b>classification</b> token placed first in every sequence. Its final hidden vector $\\mathbf{C}$ is the pooled summary used for sentence-level outputs (NSP, downstream classification) (&sect;3.2)." },
      { sym: "$[\\text{SEP}]$", desc: "a special <b>separator</b> token marking sentence boundaries in a pair: <code>[CLS]</code> A <code>[SEP]</code> B <code>[SEP]</code> (&sect;3.2)." },
      { sym: "WordPiece", desc: "the sub-word tokenizer BERT uses (30,000-token vocabulary). Rare words split into known pieces, so $V$ stays bounded (&sect;3.2)." },
      { sym: "$\\mathbf{E}^{\\text{token}}, \\mathbf{E}^{\\text{segment}}, \\mathbf{E}^{\\text{position}}$", desc: "the three learned width-$H$ embeddings whose <b>sum</b> is each token's input vector $\\mathbf{E}_i$ &mdash; the WordPiece id, the sentence (A/B) it belongs to, and its absolute position (&sect;3.2)." },
      { sym: "$\\mathbf{C}$", desc: "the final hidden vector above <code>[CLS]</code> (the pooled vector $\\mathbf{h}_0$); the NSP head and downstream classifiers read it." },
      { sym: "bidirectional", desc: "a plain term: using context on <b>both</b> sides of a position. Opposite of <b>left-to-right / causal / unidirectional</b>, which uses only the words before the position." },
      { sym: "MLM", desc: "<b>Masked Language Model</b>: the pre-training objective of hiding some input tokens and predicting them from the surrounding (two-sided) context (&sect;3.1)." },
      { sym: "NSP", desc: "<b>Next Sentence Prediction</b>: the second pre-training objective &mdash; a binary classifier on $\\mathbf{C}$ deciding whether sentence B is the true continuation of A (IsNext vs. NotNext), 50% each at training time (&sect;3.1)." },
      { sym: "$V$", desc: "the <b>vocabulary size</b> (WordPiece, $\\approx 30{,}000$): how many distinct tokens the model knows. The MLM head outputs one score per vocabulary token, so it has $V$ outputs." },
      { sym: "$L$", desc: "the number of <b>stacked encoder layers</b> (Transformer blocks). BERT-BASE uses $L=12$, BERT-LARGE $L=24$ (&sect;3)." },
      { sym: "$H$ (a.k.a. $d_{\\text{model}}$)", desc: "the <b>hidden width</b>: length of every token vector. BERT-BASE uses $H=768$, BERT-LARGE $H=1024$; the feed-forward inner size is $4H$ (&sect;3)." },
      { sym: "$A$", desc: "the number of <b>attention heads</b> per layer (paper-transformer's $h$). BERT-BASE $12$, BERT-LARGE $16$ (&sect;3)." },
      { sym: "$M$", desc: "the set of <b>masked positions</b> chosen for a sentence (about 15% of its tokens). The MLM loss is summed only over $M$." },
      { sym: "$x_i$", desc: "the <b>original</b> (true) token at position $i$ &mdash; the target the model must reconstruct when $i$ is masked." },
      { sym: "$\\hat{p}_i$", desc: "the model's <b>predicted probability distribution</b> over the whole vocabulary for position $i$: $\\mathrm{softmax}$ of the MLM head's logits there." },
      { sym: "$\\mathrm{softmax}$", desc: "turns a row of scores into positive weights summing to $1$: $\\mathrm{softmax}(z)_j = e^{z_j}/\\sum_l e^{z_l}$. Here it makes the head's $V$ logits a probability over words." },
      { sym: "causal mask", desc: "a plain term: a rule applied inside attention forbidding a position from attending to positions <i>after</i> it (used by left-to-right models). BERT omits it; the ablation re-adds it." }
    ],
    formula: `<p><b>(a) Input embedding (&sect;3.2).</b> Each token's input vector is the sum of three learned
       embeddings of width $H$ &mdash; the WordPiece token id, the segment (sentence A vs. B), and the absolute
       position:</p>
       $$ \\mathbf{E}_i \\;=\\; \\mathbf{E}^{\\text{token}}_i \\;+\\; \\mathbf{E}^{\\text{segment}}_i \\;+\\; \\mathbf{E}^{\\text{position}}_i \\;\\in\\; \\mathbb{R}^{H} \\qquad\\text{(\\S 3.2, input representation)} $$
       <p>A whole sequence is laid out as <code>[CLS]</code> $A_1\\ldots A_m$ <code>[SEP]</code> $B_1\\ldots B_n$
       <code>[SEP]</code>. Stacking the encoder gives final hidden vectors $\\mathbf{h}_i \\in \\mathbb{R}^{H}$;
       call the one above <code>[CLS]</code> the pooled vector $\\mathbf{C} = \\mathbf{h}_0$.</p>
       <p><b>(b) Masking scheme (&sect;3.1).</b> Choose $15\\%$ of token positions. Each chosen position $i$ is
       corrupted in the input by one of three cases, then its <i>original</i> word $x_i$ is the prediction
       target:</p>
       $$ \\text{input}_i \\;=\\; \\begin{cases} [\\text{MASK}] & \\text{with prob. } 0.8 \\\\ \\text{random token} & \\text{with prob. } 0.1 \\\\ x_i \\ (\\text{unchanged}) & \\text{with prob. } 0.1 \\end{cases} \\qquad\\text{(\\S 3.1, 80/10/10)} $$
       <p><b>(c) Masked-LM loss (&sect;3.1).</b> "The final hidden vectors corresponding to the mask tokens are
       fed into an output softmax over the vocabulary." With $M$ the masked positions and $V$ the WordPiece
       vocabulary:</p>
       $$ \\hat{p}_i \\;=\\; \\mathrm{softmax}\\big(W_{\\text{mlm}}\\,\\mathbf{h}_i + b_{\\text{mlm}}\\big) \\in \\mathbb{R}^{V}, \\qquad \\mathcal{L}_{\\text{MLM}} \\;=\\; -\\frac{1}{|M|}\\sum_{i \\in M} \\log \\hat{p}_i\\big[x_i\\big] $$
       <p><b>(d) Next-Sentence-Prediction loss (&sect;3.1).</b> A binary softmax on the pooled <code>[CLS]</code>
       vector $\\mathbf{C}$ predicts whether sentence $B$ truly follows $A$ ($y \\in \\{\\text{IsNext},
       \\text{NotNext}\\}$, $50\\%$ each at training time):</p>
       $$ \\hat{q} \\;=\\; \\mathrm{softmax}\\big(W_{\\text{nsp}}\\,\\mathbf{C} + b_{\\text{nsp}}\\big) \\in \\mathbb{R}^{2}, \\qquad \\mathcal{L}_{\\text{NSP}} \\;=\\; -\\log \\hat{q}\\big[y\\big] $$
       <p>Pre-training minimizes $\\mathcal{L}_{\\text{MLM}} + \\mathcal{L}_{\\text{NSP}}$. Our tiny build
       implements (b)&ndash;(c); (a) and (d) are stated here in full but kept out of the toy run for clarity.</p>`,
    whatItDoes:
      `<p>Read it right to left. $\\mathbf{h}_i$ is the encoder's output vector at position $i$ &mdash; a
       summary of that slot built from the <b>whole sentence on both sides</b>, because there is no causal
       mask. The MLM head $W\\mathbf{h}_i + b$ turns that vector into one score (logit) per vocabulary word, and
       $\\mathrm{softmax}$ makes those $V$ scores a probability distribution $\\hat{p}_i$ over which word fills
       the slot.</p>
       <p>The loss looks only at the <b>masked positions</b> $M$ (about 15% of the tokens). For each, it reads
       off the probability the model assigned to the <i>true</i> word $x_i$, namely $\\hat{p}_i[x_i]$, takes
       $-\\log$ of it (the standard cross-entropy / language-model loss from <b>dl-language-model</b>), and
       averages over the masked slots. Confident-and-correct &rarr; probability near $1$ &rarr; loss near $0$;
       confident-and-wrong &rarr; large loss. Unmasked positions contribute nothing, which is the whole point:
       the model is graded only on filling the blanks, so it can safely read both sides to do it.</p>`,
    derivation:
      `<p>This is the cross-entropy of a single softmax classifier, applied per masked slot &mdash; the math is
       owned by the <b>dl-language-model</b> concept (recap + link, not re-derived here). The short version:
       predicting one of $V$ words is a $V$-way classification; the right loss is the negative log-probability
       of the true class, $-\\log \\hat{p}_i[x_i]$, which is the cross-entropy between the one-hot true word and
       $\\hat{p}_i$. Minimizing it pushes the model to put probability mass on the actual word.</p>
       <p>The genuinely new step is <i>why masking makes bidirectionality legal</i> (&sect;3.1). In a plain
       "predict $x_i$ from all positions" objective, $\\mathbf{h}_i$ would depend on the input token at
       position $i$, which <i>is</i> $x_i$ &mdash; so the target leaks into its own prediction and the loss
       collapses to zero without learning. Masking <b>removes</b> $x_i$ from the input at the slots being
       graded, so $\\mathbf{h}_i$ is forced to come from the <i>other</i> tokens &mdash; both sides &mdash;
       and the loss becomes informative. That single observation is what unlocks deep bidirectional
       pre-training; everything else is the encoder you already built.</p>`,
    example:
      `<p>Work the MLM loss at <b>one</b> masked position by hand. Take a tiny vocabulary of $V=6$ words,
       indexed $0\\ldots 5$ as
       <code>[the, cat, sat, dog, ran, mat]</code>. We mask the third word of "the cat <code>[MASK]</code> on
       the mat", so the <b>true word</b> $x_i$ is index $2$ ("sat"). Suppose the MLM head produced the logits
       (raw scores) $W\\mathbf{h}_i + b = [\\,0.5,\\;1.0,\\;3.0,\\;0.2,\\;-1.0,\\;0.8\\,]$ at that slot.</p>
       <table class="extable">
        <caption>Softmax over the $V=6$ vocabulary: exponentiate each logit, then divide by the sum $28.27$</caption>
        <thead><tr><th>word</th><th class="num">index</th><th class="num">logit $z_j$</th><th class="num">$e^{z_j}$</th><th class="num">$\\hat{p}_i[j]$</th></tr></thead>
        <tbody>
         <tr><td class="row-h">the</td><td class="num">0</td><td class="num">0.5</td><td class="num">1.649</td><td class="num">0.0583</td></tr>
         <tr><td class="row-h">cat</td><td class="num">1</td><td class="num">1.0</td><td class="num">2.718</td><td class="num">0.0962</td></tr>
         <tr><td class="row-h">sat (true)</td><td class="num">2</td><td class="num">3.0</td><td class="num">20.09</td><td class="num">0.7106</td></tr>
         <tr><td class="row-h">dog</td><td class="num">3</td><td class="num">0.2</td><td class="num">1.221</td><td class="num">0.0432</td></tr>
         <tr><td class="row-h">ran</td><td class="num">4</td><td class="num">-1.0</td><td class="num">0.368</td><td class="num">0.0130</td></tr>
         <tr><td class="row-h">mat</td><td class="num">5</td><td class="num">0.8</td><td class="num">2.226</td><td class="num">0.0787</td></tr>
         <tr><td class="row-h">sum</td><td class="num"></td><td class="num"></td><td class="num">28.27</td><td class="num">1.0000</td></tr>
        </tbody>
       </table>
       <ul class="steps">
        <li><b>Softmax.</b> Exponentiate each logit (the $e^{z_j}$ column), sum to $28.27$, and divide &mdash;
        giving the probabilities $\\hat{p}_i$ in the last column. The big logit ($3.0$ for "sat") becomes the
        dominant probability.</li>
        <li><b>Read off the true word's probability.</b> The true word is index $2$ ("sat"), so
        $\\hat{p}_i[x_i] = 0.7106$ &mdash; the model is fairly confident.</li>
        <li><b>Cross-entropy loss at this slot.</b> $\\mathcal{L} = -\\log \\hat{p}_i[x_i] = -\\log(0.7106) = 0.3417$.</li>
       </ul>
       <p><b>How the loss depends on the confidence in the true word.</b> The loss reads <i>only</i> the
       probability on "sat"; here is what it would have been at three confidence levels:</p>
       <table class="extable">
        <caption>MLM cross-entropy $= -\\log \\hat{p}_i[\\text{sat}]$ at one masked slot</caption>
        <thead><tr><th>case</th><th class="num">$\\hat{p}_i[\\text{sat}]$</th><th class="num">$-\\log \\hat{p}_i[\\text{sat}]$</th></tr></thead>
        <tbody>
         <tr><td class="row-h">certain &amp; right</td><td class="num">1.00</td><td class="num">0.000</td></tr>
         <tr><td class="row-h">our model</td><td class="num">0.7106</td><td class="num">0.3417</td></tr>
         <tr><td class="row-h">barely backing it</td><td class="num">0.05</td><td class="num">2.996</td></tr>
        </tbody>
       </table>
       <p>The full MLM loss averages the per-slot value over all masked slots in the batch. These exact numbers
       ($\\hat{p}_i = [0.0583,\\ldots]$, $0.3417$) are recomputed in the notebook's first cell and match
       <code>F.cross_entropy</code> to the digit, so you can check them by running.</p>`,
    recipe:
      `<ol>
        <li><b>Tokenize</b> the corpus into a small word vocabulary; reserve special tokens
        <code>[PAD]</code> and <code>[MASK]</code>.</li>
        <li><b>Embed + add position.</b> Token <code>nn.Embedding</code> to $d_{\\text{model}}$, plus the
        sinusoidal positional encoding from paper-transformer.</li>
        <li><b>Stack $L$ encoder blocks</b> (multi-head self-attention + feed-forward, residual + LayerNorm),
        with <b>no causal mask</b> &mdash; this is what makes it bidirectional (&sect;3).</li>
        <li><b>MLM head.</b> A linear map $d_{\\text{model}} \\to V$ giving a logit per word at every
        position.</li>
        <li><b>Mask a batch (&sect;3.1).</b> Choose 15% of positions; per chosen position apply the
        <b>80/10/10</b> rule (<code>[MASK]</code> / random word / unchanged); record the original word as the
        label only at chosen positions.</li>
        <li><b>MLM loss.</b> Cross-entropy of head logits vs. labels, ignoring non-chosen positions; step the
        optimizer; watch the loss fall.</li>
        <li><b>Fill a <code>[MASK]</code></b> to sanity-check: feed a sentence with one slot masked and read
        the top predicted word.</li>
        <li><b>Ablate</b>: re-run with a <b>causal</b> (left-to-right) attention mask and compare the final MLM
        loss &mdash; the model can no longer use the right side.</li>
      </ol>`,
    results:
      `<p>From the abstract / Table 1 (quoted): BERT "obtains new state-of-the-art results on eleven natural
       language processing tasks, including pushing the GLUE score to 80.5% (7.7% point absolute improvement),
       MultiNLI accuracy to 86.7% (4.6% absolute improvement), SQuAD v1.1 question answering Test F1 to 93.2
       ... and SQuAD v2.0 Test F1 to 83.1." BERT-BASE has 110M parameters and BERT-LARGE 340M (&sect;3).
       (GLUE = General Language Understanding Evaluation, a benchmark suite; SQuAD = Stanford Question
       Answering Dataset; F1 is a precision/recall score, higher is better.)</p>
       <p><i>These are the paper's reported figures, quoted from the abstract. The numbers in the CODE and
       CODEVIZ panels below are from our own tiny corpus run &mdash; not the paper's results.</i></p>`,
    evaluation:
      `<p><b>1. The metric &amp; benchmark.</b> Two things are scored. (i) <b>Pre-training health:</b> the
       masked-LM cross-entropy $\\mathcal{L}_{\\text{MLM}} = -\\frac{1}{|M|}\\sum_{i\\in M}\\log\\hat{p}_i[x_i]$
       on held-out text, and the top-1 accuracy of the filled <code>[MASK]</code>. The no-skill baseline is
       a uniform guess over the vocabulary: loss $-\\ln(1/V) = \\ln V$ (for $V\\approx 30{,}000$ WordPiece tokens
       that is $\\approx 10.3$ nats; for our toy $V{=}11$ it is $\\ln 11\\approx 2.40$) and accuracy $1/V$. (ii)
       <b>The real BERT claim is downstream:</b> fine-tune and score the <b>GLUE</b> suite &mdash; the paper's
       headline is GLUE $80.5\\%$, MultiNLI $86.7\\%$, SQuAD v1.1 F1 $93.2$ (abstract / Table 1, quoted above).
       "Better than trivial" there means beating the majority-class / prior-SOTA per task, not $50\\%$.</p>
       <ul>
        <li><b>2. Sanity checks BEFORE the full run.</b> (a) <b>Loss at init</b> should sit near
        $\\ln V$ &mdash; a random encoder predicts roughly uniformly over the vocab; if step-0 loss is far below
        that you have a leak (see below). (b) <b>Overfit one batch:</b> train on a single handful of sentences
        with masking and watch $\\mathcal{L}_{\\text{MLM}}\\to 0$ &mdash; the toy run drives it to $\\approx 0.28$
        on 8 sentences. (c) <b>Shape/range:</b> the MLM head output is $(B,S,V)$; after softmax each masked row
        sums to $1$. (d) <b>Known-answer:</b> reproduce the worked example &mdash; softmax of
        $[0.5,1.0,3.0,0.2,-1.0,0.8]$ gives $\\hat{p}[2]=0.7106$ and loss $0.3417$, matching
        <code>F.cross_entropy</code> to the digit. (e) <b>Label hygiene:</b> assert the loss is computed only at
        masked positions (unmasked labels are the <code>ignore_index</code> $-100$).</li>
        <li><b>3. Expected range.</b> A correct toy build reaches $\\mathcal{L}_{\\text{MLM}}\\approx 0.28$
        bidirectional (rule of thumb from our 8-sentence run, <i>not</i> a paper number) and fills
        "the cat <code>[MASK]</code> on the mat" $\\to$ "sat". Real BERT targets are the paper's reported
        figures &mdash; GLUE $\\approx 80.5\\%$, SQuAD v1.1 F1 $\\approx 93.2$ (approximate, per abstract); landing
        within a point or two after fine-tuning is "tuning," while being stuck near the $\\ln V$ chance loss, or
        $20{+}$ GLUE points low, is "probably a bug."</li>
        <li><b>4. Ablation &mdash; prove bidirectionality earns its keep.</b> The central idea is the
        <b>no-causal-mask</b> two-sided encoder. Turn the knob: re-add a <b>causal (left-to-right) mask</b> inside
        attention, change nothing else (data, 15% masking, depth, width, heads, optimizer, seed), and the
        masked-LM loss must <b>rise</b> &mdash; in our run $\\approx 0.28$ (bidirectional) vs $\\approx 0.66$
        (causal). If the loss does <i>not</i> get worse, your "bidirectional" model was secretly masked, or the
        right-hand context is not reaching the masked slot &mdash; the contribution is not wired in.</li>
        <li><b>5. Failure signals &amp; what they mean.</b> <b>Loss collapses to ~0 in a few steps</b> (far below
        $\\ln V$): the target leaked &mdash; you scored "predict $x_i$" while $x_i$ was still in the input at that
        position, or you forgot to corrupt the chosen slots (&sect;3.1). <b>Loss stuck near $\\ln V$ / accuracy at
        $1/V$:</b> not learning &mdash; LR too low, the loss is averaged over <i>all</i> positions (a trivial copy
        task) instead of masked ones, or labels are shuffled. <b>Loss NaN:</b> LR too high or bad init.
        <b>Bidirectional and causal reach the same loss:</b> the causal mask is not actually applied, so the
        ablation is a no-op. <b>Train-good, val-bad:</b> the tiny corpus was memorized &mdash; expected at toy
        scale, but at real scale it signals leakage or overfitting.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the Transformer primitives ship in PyTorch and you
       already built the encoder block in paper-transformer, so here you <b>import</b> the plumbing and build
       only BERT's contribution &mdash; the MLM training objective &mdash; on top. <b>Import:</b>
       <code>nn.Embedding</code>, <code>nn.Linear</code>, <code>nn.LayerNorm</code>, the optimizer, and
       <code>F.cross_entropy</code> (reuse your multi-head attention + positional encoding from
       paper-transformer). <b>Build by hand:</b> the bidirectional encoder wiring (the block with <b>no</b>
       causal mask), the <b>MLM head</b>, the <b>15% / 80-10-10 masking</b>, the masked cross-entropy loss, and
       the <b>causal-mask ablation</b>. The cross-entropy math itself is recapped from
       <b>dl-language-model</b>, not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Computing the loss over all positions.</b> The MLM loss is only over the <b>masked</b>
        positions $M$. <b>Fix:</b> set the label to an ignore value (e.g. <code>-100</code>) at unmasked
        positions and pass <code>ignore_index</code> to <code>F.cross_entropy</code>. Grading every position
        turns it into a trivial copy task and the model learns nothing useful.</li>
        <li><b>Skipping the 80/10/10 and always using <code>[MASK]</code>.</b> If every chosen token becomes a
        literal <code>[MASK]</code>, the model over-fits to that symbol and is mismatched at fine-tune time
        (where <code>[MASK]</code> never appears). Keep the 10% random / 10% unchanged (&sect;3.1).</li>
        <li><b>Leaving a causal mask in.</b> If you reuse a decoder's masked attention by accident, BERT stops
        being bidirectional &mdash; that is literally the ablation, not the model. The encoder must use
        <b>unmasked</b> self-attention.</li>
        <li><b>Letting the token see itself without masking.</b> If you ever train "predict $x_i$" while $x_i$
        is still in the input at position $i$, the target leaks and the loss collapses. The mask removing $x_i$
        is what makes two-sided reading legal (&sect;3.1).</li>
        <li><b>Reading our tiny loss as the paper's result.</b> Our corpus has a handful of sentences; the
        absolute loss and which words it fills are <i>our</i> small run. BERT's reported numbers are GLUE/SQuAD
        on internet-scale text (&sect;5), not reproduced here.</li>
      </ul>`,
    recall: [
      "State the MLM objective (\\S 3.1): what fraction of tokens are masked, and the 80/10/10 corruption rule.",
      "Why does masking make deep <i>bidirectional</i> pre-training legal, where a plain 'predict $x_i$' objective would not?",
      "Write the masked-LM loss $\\mathcal{L}_{\\text{MLM}} = -\\frac{1}{|M|}\\sum_{i\\in M}\\log \\hat{p}_i[x_i]$ from memory and say what $M$ is.",
      "How does BERT's encoder differ from a left-to-right (causal) Transformer in one sentence?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> Your tiny BERT drives the masked-LM loss down with full bidirectional
            attention. Now switch the attention to <b>causal</b> (each position may only attend to positions at
            or before it), keep everything else identical, and retrain. What happens to the final MLM loss, and
            what does that show about <i>why</i> BERT reads both directions?`,
        steps: [
          { do: `Change exactly one thing: add a causal mask inside attention so position $i$ cannot attend to positions $\\gt i$. Keep the corpus, the 15% masking, depth, width, heads, optimizer, and seed identical.`, why: `An honest ablation changes only the variable under test &mdash; here, bidirectional vs. left-to-right &mdash; so any difference is attributable to it.` },
          { do: `Retrain and compare the final MLM loss. In our run the bidirectional model reaches ~0.28 while the causal one plateaus higher, around ~0.66 (averaged over seeds).`, why: `To fill "the cat ___ on the mat", the right context ("on the mat") is informative; a left-to-right model at the blank cannot see it, so it predicts less well and the loss stays higher.` },
          { do: `Conclude that the two-sided context, not extra capacity, is what lets BERT fill masks better.`, why: `Both runs share architecture, parameter count, data, and seed; only the attention direction differs, isolating bidirectionality as the cause.` }
        ],
        answer: `<p>With causal (left-to-right) attention the masked-LM loss settles at a clearly <b>higher</b>
                 (worse) value than the bidirectional model (~0.66 vs ~0.28 in our small run). Because the only
                 difference between the two runs is whether a masked position may read the words to its right,
                 this isolates <b>bidirectionality</b> as the reason BERT fills blanks better &mdash; exactly
                 the limitation of left-to-right models that &sect;3.1's masked objective was designed to
                 remove. The CODEVIZ panel shows the two loss curves.</p>`
      },
      {
        q: `In the worked example the head's logits at the masked slot were $[0.5, 1.0, 3.0, 0.2, -1.0, 0.8]$
            and the true word was index 2 ("sat"). We got loss $0.3417$. Suppose instead the head had been
            <i>certain and wrong</i> &mdash; logit $5.0$ on index 4 ("ran") and small logits elsewhere &mdash;
            would the loss be larger or smaller, and why does that push the model in the right direction?`,
        steps: [
          { do: `Recall the loss reads only the true word's probability: $-\\log \\hat{p}_i[x_i]$ with $x_i = 2$.`, why: `Cross-entropy ignores how mass is split among the wrong words; only the probability on the <i>true</i> word matters.` },
          { do: `A huge logit on the wrong word (index 4) drains probability away from index 2, so $\\hat{p}_i[2]$ becomes tiny, and $-\\log$ of a tiny number is large.`, why: `Confident-and-wrong is exactly the case cross-entropy punishes hardest.` },
          { do: `Gradient descent on that large loss raises the logit for the true word and lowers the others next time.`, why: `That is how the MLM objective teaches the encoder to put mass on the actually-masked word.` }
        ],
        answer: `<p><b>Larger.</b> The loss depends only on the probability the model gives the <i>true</i> word
                 ("sat", index 2). Pouring confidence onto the wrong word ("ran") starves index 2 of
                 probability, so $\\hat{p}_i[2]$ is tiny and $-\\log \\hat{p}_i[2]$ is big &mdash; far above
                 $0.3417$. The large gradient then pushes the head to raise the true word's logit and lower the
                 others, which is precisely how masked prediction trains useful two-sided representations.</p>`
      },
      {
        q: `The paper masks only <b>15%</b> of tokens, and of those uses <code>[MASK]</code> just <b>80%</b> of
            the time (10% random word, 10% unchanged). Why not mask far more tokens, and why not use
            <code>[MASK]</code> 100% of the time for the chosen ones?`,
        steps: [
          { do: `Think about masking, say, 90% of tokens.`, why: `With almost nothing left as context, there is too little signal on each side to predict the blanks &mdash; the task becomes near-impossible and pre-training is inefficient.` },
          { do: `Think about always using <code>[MASK]</code> for chosen tokens.`, why: `The <code>[MASK]</code> symbol never appears at fine-tune time, so a model that only ever predicts under it sees a different input distribution downstream &mdash; a pre-train/fine-tune mismatch (\\S 3.1).` },
          { do: `Note the 10%-random and 10%-unchanged force the model to build a good representation of <i>every</i> token, since it cannot tell which positions were chosen.`, why: `It must stay ready to "correct or confirm" any token, not just obvious <code>[MASK]</code> slots.` }
        ],
        answer: `<p>15% balances two pressures: enough masked targets to learn from, but enough surrounding
                 context left intact to make each prediction solvable &mdash; masking most of the sentence would
                 starve the context. The 80/10/10 split (&sect;3.1) fixes a <i>distribution mismatch</i>:
                 because <code>[MASK]</code> is absent at fine-tune time, sometimes substituting a random word
                 or keeping the original forces the model to encode every token usefully rather than keying off
                 the <code>[MASK]</code> symbol, so the pre-trained encoder transfers cleanly.</p>`
      }
    ]
  });

  window.CODE["paper-bert"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> a tiny BERT &mdash; a bidirectional Transformer encoder (multi-head
       self-attention with <b>no causal mask</b> + feed-forward, residual + LayerNorm, reusing the
       paper-transformer block) plus an <b>MLM head</b> <code>nn.Linear(d_model, vocab)</code> &mdash; on a
       small word corpus. We implement the <b>masked-language-model</b> objective: mask 15% of tokens with the
       <b>80/10/10</b> rule and predict the originals, scoring cross-entropy <b>only at masked positions</b>.
       We <b>print the MLM loss falling</b> and <b>fill a <code>[MASK]</code></b> ("the cat [MASK] on the mat"
       &rarr; "sat"). The <b>ablation</b> adds a causal (left-to-right) mask: the masked-LM loss settles higher
       because the model loses the right-hand context. The first cell recomputes the worked example: softmax of
       $[0.5,1.0,3.0,0.2,-1.0,0.8]$ gives $\\hat p=[0.0583,\\ldots,0.7106,\\ldots]$ and loss $0.3417$, matching
       <code>F.cross_entropy</code>. Paste into Colab and run (torch is preinstalled &mdash; no pip).</p>`,
    code: `import math
import torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0)

# === 0. Worked example: cross-entropy at ONE masked slot over a V=6 vocabulary. ===
# Vocab indices: [the, cat, sat, dog, ran, mat]; true masked word is index 2 ("sat").
logits = torch.tensor([0.5, 1.0, 3.0, 0.2, -1.0, 0.8])
target = 2
p = F.softmax(logits, dim=0)
print("softmax probs =", [round(v, 4) for v in p.tolist()])      # [0.0583, 0.0962, 0.7106, 0.0432, 0.013, 0.0787]
print("p(true='sat') =", round(p[target].item(), 4))             # 0.7106
print("MLM loss = -log p(true) =", round(-math.log(p[target].item()), 4))         # 0.3417
print("F.cross_entropy        =", round(F.cross_entropy(logits.unsqueeze(0), torch.tensor([target])).item(), 4))  # 0.3417

# === 1. Tiny word corpus. Reserve [PAD] and [MASK]. ===
sentences = ["the cat sat on the mat", "the dog sat on the log",
             "the cat ran on the mat", "the dog ran on the log",
             "a cat sat on a mat",     "a dog sat on a log",
             "the cat sat on the log", "the dog ran on the mat"]
words = sorted(set(" ".join(sentences).split()))
PAD, MASK = "[PAD]", "[MASK]"
vocab = [PAD, MASK] + words
stoi = {w: i for i, w in enumerate(vocab)}
V, SEQ = len(vocab), 6
data = torch.tensor([[stoi[w] for w in s.split()] for s in sentences])   # (N, SEQ)
print("\\nvocab (V=%d):" % V, vocab)

# === 2. Positional encoding (from paper-transformer). ===
def positional_encoding(seq_len, d_model):
    pos = torch.arange(seq_len).unsqueeze(1).float()
    i2  = torch.arange(0, d_model, 2).float()
    denom = torch.pow(10000.0, i2 / d_model)
    pe = torch.zeros(seq_len, d_model)
    pe[:, 0::2] = torch.sin(pos / denom)
    pe[:, 1::2] = torch.cos(pos / denom)
    return pe

# === 3. Multi-head self-attention. causal=False -> BIDIRECTIONAL (BERT); True -> the ablation. ===
class MHA(nn.Module):
    def __init__(self, d, h, causal=False):
        super().__init__(); self.h, self.dk, self.causal = h, d // h, causal
        self.Wq, self.Wk, self.Wv, self.Wo = (nn.Linear(d, d) for _ in range(4))
    def split(self, x):
        B, S, _ = x.shape; return x.view(B, S, self.h, self.dk).transpose(1, 2)
    def forward(self, x):
        Q, K, Vv = self.split(self.Wq(x)), self.split(self.Wk(x)), self.split(self.Wv(x))
        S = x.shape[1]
        scores = Q @ K.transpose(-2, -1) / math.sqrt(self.dk)
        if self.causal:                                  # left-to-right: forbid attending to the right
            cm = torch.triu(torch.ones(S, S), diagonal=1).bool()
            scores = scores.masked_fill(cm, float('-inf'))
        a = F.softmax(scores, dim=-1) @ Vv
        B, _, S, _ = a.shape
        return self.Wo(a.transpose(1, 2).contiguous().view(B, S, self.h * self.dk))

class Block(nn.Module):
    def __init__(self, d, h, ff, causal=False):
        super().__init__(); self.a = MHA(d, h, causal)
        self.f = nn.Sequential(nn.Linear(d, ff), nn.GELU(), nn.Linear(ff, d))   # GELU: BERT's activation
        self.n1, self.n2 = nn.LayerNorm(d), nn.LayerNorm(d)
    def forward(self, x):
        x = self.n1(x + self.a(x)); return self.n2(x + self.f(x))

# === 4. Tiny BERT: embed + position -> L bidirectional blocks -> MLM head (d_model -> V). ===
class TinyBERT(nn.Module):
    def __init__(self, V, d=64, h=4, ff=128, L=2, mx=SEQ, causal=False):
        super().__init__()
        self.e = nn.Embedding(V, d)
        self.register_buffer("pe", positional_encoding(mx, d))
        self.b = nn.ModuleList([Block(d, h, ff, causal) for _ in range(L)])
        self.head = nn.Linear(d, V)                      # MLM head: logits over the vocabulary per position
    def forward(self, t):
        x = self.e(t) + self.pe[:t.shape[1]]
        for blk in self.b: x = blk(x)
        return self.head(x)                              # (B, S, V)

# === 5. MLM masking: 15% of positions; of those 80% -> [MASK], 10% -> random, 10% -> unchanged (\\S 3.1). ===
def mask_batch(batch):
    inp = batch.clone()
    labels = torch.full_like(batch, -100)                # -100 = ignored by cross_entropy
    chosen = torch.rand(batch.shape) < 0.15
    for r in range(batch.shape[0]):                      # tiny data: guarantee >=1 masked token per row
        if not chosen[r].any():
            chosen[r, torch.randint(0, batch.shape[1], (1,))] = True
    labels[chosen] = batch[chosen]                       # predict the ORIGINAL word at chosen slots
    r2 = torch.rand(batch.shape)
    inp[chosen & (r2 < 0.8)] = stoi[MASK]                # 80% -> [MASK]
    rand = chosen & (r2 >= 0.8) & (r2 < 0.9)             # 10% -> random word
    inp[rand] = torch.randint(2, V, (int(rand.sum()),))
    # remaining 10% -> unchanged (already a copy)
    return inp, labels

# === 6. Train on the MLM objective; print the loss FALLING. ===
def train(causal=False, steps=600, lr=3e-3, seed=0):
    torch.manual_seed(seed)
    net = TinyBERT(V, causal=causal)
    opt = torch.optim.Adam(net.parameters(), lr=lr)
    losses = []
    for s in range(steps):
        inp, labels = mask_batch(data)
        loss = F.cross_entropy(net(inp).reshape(-1, V), labels.reshape(-1), ignore_index=-100)
        opt.zero_grad(); loss.backward(); opt.step()
        losses.append(loss.item())
        if s % 100 == 0 or s == steps - 1:
            print(f"  step {s:4d}  MLM loss {loss.item():.4f}")
    return net, losses

print("\\nTRAIN tiny BERT (bidirectional MLM):")
net, losses = train(causal=False)

# === 7. Fill a [MASK]: feed a sentence with one slot masked, read the top predictions. ===
def fill_mask(net, sent, pos):
    toks = [stoi[w] for w in sent.split()]; toks[pos] = stoi[MASK]
    with torch.no_grad():
        probs = F.softmax(net(torch.tensor([toks]))[0, pos], dim=0)
    top = torch.topk(probs, 3)
    return [(vocab[i], round(probs[i].item(), 3)) for i in top.indices.tolist()]

print('\\nFILL THE [MASK]:')
print('  "the cat [MASK] on the mat" ->', fill_mask(net, "the cat sat on the mat", 2))   # 'sat' wins
print('  "the [MASK] sat on the log" ->', fill_mask(net, "the dog sat on the log", 1))   # 'dog' wins

# === 8. ABLATION: causal (left-to-right) attention -> the masked word loses its RIGHT context. ===
print("\\nABLATION: causal (left-to-right) instead of bidirectional:")
_, losses_causal = train(causal=True)
print(f"\\nfinal MLM loss  bidirectional: {losses[-1]:.4f}   causal: {losses_causal[-1]:.4f}")
# Bidirectional reaches a clearly lower (better) loss: it can use both sides to fill the blank.
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-bert"] = {
    question: "Does the masked-language-model loss fall as we train a tiny bidirectional BERT, and does removing bidirectionality (a causal/left-to-right ablation) leave the loss higher?",
    charts: [
      {
        type: "line",
        title: "Masked-LM loss vs step — bidirectional (BERT) vs causal left-to-right (ablation)",
        xlabel: "training step",
        ylabel: "masked-LM loss (avg over masked tokens)",
        series: [
          {
            name: "bidirectional (BERT)",
            color: "#7ee787",
            points: [[0,2.417],[50,1.095],[100,0.439],[150,0.382],[200,0.534],[250,0.433],[300,0.322],[350,0.494],[400,0.324],[450,0.336],[500,0.284],[550,0.597],[599,0.278]]
          },
          {
            name: "causal / left-to-right (ablation)",
            color: "#ff7b72",
            points: [[0,2.415],[50,0.954],[100,0.702],[150,0.870],[200,0.486],[250,0.422],[300,0.474],[350,0.514],[400,0.595],[450,0.641],[500,0.397],[550,0.461],[599,0.658]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A 2-layer tiny BERT (d_model=64, 4 heads, GELU) pre-trained with the masked-LM objective on an 8-sentence corpus (V=11 words): mask 15% of tokens with the 80/10/10 rule and predict the originals, cross-entropy over masked slots only. Each curve is averaged over 4 seeds. The bidirectional encoder (green) drives the masked-LM loss down to ~0.28 and fills masks correctly (\"the cat [MASK] on the mat\" -> \"sat\", p~0.69). The ABLATION (red) re-adds a causal (left-to-right) attention mask so a masked position cannot read the words to its right; with everything else identical (data, 15% masking, depth, width, heads, optimizer, seed) it plateaus higher at ~0.66, because the right-hand context that would constrain the blank is hidden. That gap is exactly the limitation of left-to-right language models that BERT's masked objective (\\S 3.1) was designed to remove.",
    code: `import math, torch, torch.nn as nn, torch.nn.functional as F

sentences = ["the cat sat on the mat", "the dog sat on the log",
             "the cat ran on the mat", "the dog ran on the log",
             "a cat sat on a mat",     "a dog sat on a log",
             "the cat sat on the log", "the dog ran on the mat"]
words = sorted(set(" ".join(sentences).split()))
vocab = ["[PAD]", "[MASK]"] + words
stoi = {w: i for i, w in enumerate(vocab)}
V = len(vocab)
data = torch.tensor([[stoi[w] for w in s.split()] for s in sentences])

def positional_encoding(seq_len, d_model):
    pos = torch.arange(seq_len).unsqueeze(1).float()
    i2  = torch.arange(0, d_model, 2).float()
    denom = torch.pow(10000.0, i2 / d_model)
    pe = torch.zeros(seq_len, d_model)
    pe[:, 0::2] = torch.sin(pos / denom); pe[:, 1::2] = torch.cos(pos / denom)
    return pe

class MHA(nn.Module):
    def __init__(self, d, h, causal):
        super().__init__(); self.h, self.dk, self.causal = h, d // h, causal
        self.Wq, self.Wk, self.Wv, self.Wo = (nn.Linear(d, d) for _ in range(4))
    def split(self, x):
        B, S, _ = x.shape; return x.view(B, S, self.h, self.dk).transpose(1, 2)
    def forward(self, x):
        Q, K, Vv = self.split(self.Wq(x)), self.split(self.Wk(x)), self.split(self.Wv(x))
        S = x.shape[1]; sc = Q @ K.transpose(-2, -1) / math.sqrt(self.dk)
        if self.causal:
            sc = sc.masked_fill(torch.triu(torch.ones(S, S), 1).bool(), float('-inf'))
        a = F.softmax(sc, dim=-1) @ Vv; B, _, S, _ = a.shape
        return self.Wo(a.transpose(1, 2).contiguous().view(B, S, self.h * self.dk))

class Block(nn.Module):
    def __init__(self, d, h, ff, causal):
        super().__init__(); self.a = MHA(d, h, causal)
        self.f = nn.Sequential(nn.Linear(d, ff), nn.GELU(), nn.Linear(ff, d))
        self.n1, self.n2 = nn.LayerNorm(d), nn.LayerNorm(d)
    def forward(self, x):
        x = self.n1(x + self.a(x)); return self.n2(x + self.f(x))

class TinyBERT(nn.Module):
    def __init__(self, V, d=64, h=4, ff=128, L=2, mx=6, causal=False):
        super().__init__(); self.e = nn.Embedding(V, d)
        self.register_buffer("pe", positional_encoding(mx, d))
        self.b = nn.ModuleList([Block(d, h, ff, causal) for _ in range(L)]); self.head = nn.Linear(d, V)
    def forward(self, t):
        x = self.e(t) + self.pe[:t.shape[1]]
        for blk in self.b: x = blk(x)
        return self.head(x)

def mask_batch(batch):
    inp = batch.clone(); labels = torch.full_like(batch, -100)
    chosen = torch.rand(batch.shape) < 0.15
    for r in range(batch.shape[0]):
        if not chosen[r].any(): chosen[r, torch.randint(0, batch.shape[1], (1,))] = True
    labels[chosen] = batch[chosen]; r2 = torch.rand(batch.shape)
    inp[chosen & (r2 < 0.8)] = stoi["[MASK]"]
    rd = chosen & (r2 >= 0.8) & (r2 < 0.9); inp[rd] = torch.randint(2, V, (int(rd.sum()),))
    return inp, labels

def run(causal, steps=600, seed=0):
    torch.manual_seed(seed)
    net = TinyBERT(V, causal=causal); opt = torch.optim.Adam(net.parameters(), lr=3e-3); L = []
    for s in range(steps):
        inp, lab = mask_batch(data)
        loss = F.cross_entropy(net(inp).reshape(-1, V), lab.reshape(-1), ignore_index=-100)
        opt.zero_grad(); loss.backward(); opt.step(); L.append(loss.item())
    return L

# average over seeds for a cleaner curve
import statistics
def avg(causal, seeds=(0, 1, 2, 3)):
    runs = [run(causal, seed=s) for s in seeds]
    return [statistics.mean(col) for col in zip(*runs)]

bi, ca = avg(False), avg(True)
idx = list(range(0, 600, 50)) + [599]
print("bidirectional:", [[i, round(bi[i], 3)] for i in idx])
print("causal       :", [[i, round(ca[i], 3)] for i in idx])
# bidirectional -> ~0.28 (uses both sides). causal -> ~0.66 (right context hidden). Our small run, not the paper's.`
  };
})();
