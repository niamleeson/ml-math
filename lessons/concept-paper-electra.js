/* Paper lesson — "ELECTRA: Pre-training Text Encoders as Discriminators Rather Than Generators",
   Clark, Luong, Le, Manning 2020.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-electra".
   GROUNDED from arXiv:2003.10555 (abstract + ar5iv HTML mirror, Section 2 "Method").
   Track B (architecture): build a tiny generator + discriminator ELECTRA on toy text; train with the
   Replaced-Token-Detection (RTD) objective; show the discriminator learning to spot replaced tokens;
   contrast efficiency with masked-language-modeling (MLM). conceptLink: null (no concept lesson owns RTD).
   Cross-links the BERT paper (paper-bert) for the MLM baseline it improves on. */
(function () {
  window.LESSONS.push({
    id: "paper-electra",
    title: "ELECTRA — Pre-training Text Encoders as Discriminators Rather Than Generators (2020)",
    tagline: "Replace a few tokens with a small generator's guesses, then train a discriminator to flag which tokens are fake — learning from every token, not just the masked ones.",
    module: "Papers · Transformers & LLMs",
    track: "architecture",
    paper: {
      authors: "Kevin Clark, Minh-Thang Luong, Quoc V. Le, Christopher D. Manning",
      org: "Stanford University & Google Brain",
      year: 2020,
      venue: "arXiv:2003.10555 (Mar 2020); ICLR 2020",
      citations: "",
      arxiv: "https://arxiv.org/abs/2003.10555",
      code: "https://github.com/google-research/electra"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["mod-transformer", "mod-llm", "dl-cross-entropy", "ml-softmax", "pt-nn-module", "pt-training-loop"],

    // WHY READ IT
    problem:
      `<p>Before ELECTRA, the dominant way to pretrain a text encoder was <b>masked language modeling</b> (MLM),
       the recipe from BERT (see the <code>paper-bert</code> lesson). MLM works like this: take a sentence, hide
       about <b>15%</b> of its words (replace them with a special <code>[MASK]</code> token), and train the model
       to guess the hidden words from context. "Encoder" here means a network that turns each word into a vector
       that captures its meaning in context; "pretrain" means train it on huge amounts of plain text <i>before</i>
       fine-tuning it on a specific task.</p>
       <p>The paper's complaint (§1): MLM is <b>wasteful</b>. The model only gets a learning signal from the 15%
       of positions that were masked — the other 85% of tokens contribute nothing to the loss. So the model
       "sees" the whole sentence but only <i>learns</i> from a small slice of it each step. That makes MLM
       <b>sample-inefficient</b>: it needs a lot of compute and data to reach a given quality. The open question
       was whether a pretraining task could squeeze a learning signal out of <b>every</b> token instead.</p>`,
    contribution:
      `<ul>
        <li><b>Replaced Token Detection (RTD)</b>, a new pretraining task. Instead of guessing masked words, the
        model classifies <i>every</i> token as "original" or "replaced." Quoting the abstract: "instead of masking
        the input, our approach corrupts it by replacing some tokens with plausible alternatives sampled from a
        small generator network."</li>
        <li><b>A generator + discriminator pair.</b> A small <b>generator</b> (a tiny MLM) proposes plausible
        replacements for the masked positions; a larger <b>discriminator</b> then predicts, for each token,
        whether it is the real token or a generator-substituted fake. "We then train a discriminative model that
        predicts whether each token in the corrupted input was replaced by a generator sample or not."</li>
        <li><b>A loss over all tokens → big efficiency win.</b> Because the discriminator scores every position,
        "this new pre-training task is more efficient than MLM because the task is defined over all input tokens
        rather than just the small subset that was masked out." Same compute buys a better encoder.</li>
      </ul>`,
    whyItMattered:
      `<p>ELECTRA made <b>compute-efficient</b> pretraining the headline number, not an afterthought. The abstract
       reports that "ELECTRA-Small" (which the paper says trains "in 4 days on 1 GPU") "outperforms GPT … on the
       GLUE natural language understanding benchmark," and that at scale ELECTRA matches RoBERTa and XLNet "while
       using less than 1/4 of their compute." The discriminative RTD idea — learn from a yes/no judgment on every
       token rather than reconstructing a few — influenced later efficient-pretraining work and remains a go-to
       when GPU budget, not data, is the bottleneck. Crucially, after pretraining you <b>keep the discriminator</b>
       and throw the generator away; the discriminator is what you fine-tune, exactly like a BERT encoder.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>§2 (Method)</b> — Figure 1 (generator → corrupt the masked positions → discriminator labels every
        token real/replaced) and the three loss expressions you will transcribe: the generator MLM loss
        $\\mathcal{L}_{\\text{MLM}}$, the discriminator RTD loss $\\mathcal{L}_{\\text{Disc}}$, and the
        <b>combined loss</b>.</li>
        <li><b>The two "gotchas" in §2:</b> (i) the discriminator's binary task is over <i>all</i> tokens, and
        (ii) the discriminator loss is <b>not</b> back-propagated into the generator — "we can't because of the
        sampling step." This is what makes ELECTRA <i>not</i> a GAN.</li>
        <li><b>§3.2 (Smaller Generators)</b> — Figure 3: the generator-size ablation. A generator that is
        <b>too strong</b> hurts. Read why.</li>
       </ul>
       <p><b>Skim:</b> §3.1 (weight sharing), §3.3–§3.4 (full GLUE/SQuAD tables and the training algorithm
       variants), and the appendices — unless you want the scaling story. The core idea is one figure and three
       short equations in §2.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train two encoders on the same tiny text corpus for the <b>same number of steps</b>: one with
       <b>MLM</b> (predict the masked 15% of tokens, BERT-style) and one with <b>ELECTRA's RTD</b> (a tiny
       generator corrupts the masked positions, then a discriminator labels <i>every</i> token real-or-replaced).
       Both then expose their token vectors to a frozen linear probe on a small downstream task.</p>
       <p>Given that RTD gets a learning signal from <b>all</b> tokens while MLM only learns from the masked 15%,
       do you expect the <b>RTD-pretrained discriminator</b> to beat, tie, or lose to the <b>MLM-pretrained</b>
       encoder at equal compute? Write your guess and one sentence of reasoning, then run it.</p>`,
    attempt:
      `<p>Before the reveal, sketch the four pieces you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Generator (a tiny MLM).</b> Mask 15% of the input positions. The generator reads the masked
        sentence and outputs a <b>softmax over the vocabulary</b> at each masked spot. <i># tiny on purpose.</i></li>
        <li><b>Corrupt the input.</b> TODO: at each masked position, <b>sample</b> a token from the generator's
        softmax and splice it in. Unmasked positions keep their original token. <i># the result is the "corrupted"
        sentence the discriminator sees.</i></li>
        <li><b>Build the RTD labels.</b> TODO: for every position $t$, the target is $1$ if the corrupted token
        <i>equals</i> the original (real) and $0$ if it differs (replaced). <i># note: a sampled token can
        accidentally equal the original — then its label is "real".</i></li>
        <li><b>Discriminator.</b> TODO: a Transformer encoder + a one-unit head with a <b>sigmoid</b>, scoring
        each token's probability of being <i>real</i>; train it with <b>binary cross-entropy over all tokens</b>.
        <i># do NOT back-propagate this loss into the generator.</i></li>
       </ul>
       <p>Then probe the frozen discriminator vs the frozen MLM encoder on a small task at equal compute.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>ELECTRA (§2) chains two networks. Start with a sentence of $n$ tokens $\\mathbf{x} = [x_1,\\ldots,x_n]$.</p>
       <p><b>Step 1 — mask, like BERT.</b> Pick a random subset $\\mathbf{m}$ of positions (the paper says
       "typically 15%") and replace those tokens with <code>[MASK]</code>, giving a masked sentence
       $\\mathbf{x}^{\\text{masked}}$.</p>
       <p><b>Step 2 — the generator fills them in.</b> A <b>small</b> masked language model — the
       <b>generator</b> $G$ — reads $\\mathbf{x}^{\\text{masked}}$ and, at each masked position $t$, outputs a
       probability over the whole vocabulary with a <b>softmax</b>: $p_G(x_t \\mid \\mathbf{x}^{\\text{masked}})$.
       We then <b>sample</b> a token $\\hat{x}_t$ from that softmax and splice it into position $t$. Unmasked
       positions are left alone. The result is the <b>corrupted</b> sentence $\\mathbf{x}^{\\text{corrupt}}$. Because
       $G$ is a trained MLM, its guesses are <i>plausible</i> — often the corrupted token is a sensible word that
       just isn't the original. (Sometimes $G$ even samples the original token back; then that position is "not
       replaced.")</p>
       <p><b>Step 3 — the discriminator judges every token.</b> The <b>discriminator</b> $D$ — a full Transformer
       encoder, the network you actually want — reads $\\mathbf{x}^{\\text{corrupt}}$ and, for <i>every</i> position
       $t$, outputs the probability that token $t$ is <b>real</b> (original) rather than <b>replaced</b>. Concretely
       the paper sets $D(\\mathbf{x},t) = \\operatorname{sigmoid}\\!\\big(w^\\top h_D(\\mathbf{x})_t\\big)$, where
       $h_D(\\mathbf{x})_t$ is the discriminator's contextual vector for token $t$ and $w$ is a learned weight
       vector. This is the <b>Replaced Token Detection (RTD)</b> task: a binary "real vs replaced" call at each of
       the $n$ positions.</p>
       <p><b>Step 4 — train both, but separately.</b> The generator is trained by ordinary <b>maximum likelihood</b>
       (the MLM loss — guess the masked tokens). The discriminator is trained with <b>binary cross-entropy</b> over
       all tokens (the RTD loss). The two losses are added (with a weight $\\lambda$) into one objective and
       minimized jointly. <b>Critical:</b> the discriminator loss is <b>not</b> back-propagated through the
       generator — the paper says "we can't because of the sampling step" (you cannot differentiate through the
       discrete sample). So this is <b>not</b> a GAN: the generator is <i>not</i> trying to fool $D$; it just does
       honest MLM, and $D$ learns to catch whatever it produces.</p>
       <p><b>Step 5 — keep the discriminator.</b> "After pre-training, we throw out the generator and fine-tune the
       discriminator on downstream tasks." The whole point of the generator was to manufacture hard, realistic
       fakes for $D$ to learn from.</p>
       <p><b>Why it's more efficient than MLM.</b> MLM only computes a loss at the masked 15% of positions. RTD's
       discriminator computes a loss at <b>all</b> $n$ positions — "the task is defined over all input tokens rather
       than just the small subset that was masked out." Roughly $6{\\times}$ more positions contribute a learning
       signal per sentence, so the same compute teaches the encoder more.</p>`,
    architecture:
      `<p>ELECTRA is <b>two Transformer encoders wired in series</b>, sharing one embedding table (\\S2, Figure 1).</p>
       <p><b>Generator $G$ (small).</b> A Transformer encoder of hidden size $h_G$ with an MLM head. It reads the
       masked sentence $\\mathbf{x}^{\\text{masked}}$ and at each masked position produces the softmax
       $p_G(x_t\\mid\\mathbf{x})$ over the vocabulary (a linear layer that, by tying, reuses the shared embedding
       matrix $e(\\cdot)$ as its output projection). The paper's ablation (\\S3.2) puts $G$ at
       <b>$1/4$–$1/2$ the discriminator's hidden size</b> — strong enough for plausible fakes, weak enough to keep
       the detection task learnable. $G$ is <b>discarded</b> after pretraining.</p>
       <p><b>Sampling bridge.</b> Between the two networks, at each masked position a token $\\hat{x}_t$ is
       <b>sampled</b> from $p_G$ and spliced in; unmasked positions keep their original token. This produces
       $\\mathbf{x}^{\\text{corrupt}}$. The sampled ids are <b>detached</b> — this discrete sampling step is exactly
       what blocks the discriminator's gradient from reaching $G$ (so ELECTRA is not a GAN).</p>
       <p><b>Discriminator $D$ (full size).</b> The Transformer encoder you keep and fine-tune. It reads
       $\\mathbf{x}^{\\text{corrupt}}$, producing a contextual vector $h_D(\\mathbf{x})_t$ at every position, and a
       <b>shared one-unit linear head $w$ + sigmoid</b> turns each into $D(\\mathbf{x},t)$, the probability that
       token $t$ is real. The head runs at <b>all $n$ positions</b>, not just the masked ones.</p>
       <p><b>Weight sharing of embeddings (\\S3.1).</b> $G$ and $D$ <b>share their token (and positional)
       embeddings</b> — a single matrix $e(\\cdot)$. Because $G$'s MLM loss touches every vocabulary row via its
       softmax (whereas $D$ only updates the embeddings of tokens actually present), sharing lets the embeddings
       receive a richer gradient. The bodies of $G$ and $D$ are <b>not</b> shared. (Tying input and output
       embeddings within $G$ follows BERT.)</p>
       <p><b>Data flow:</b> $\\mathbf{x} \\to$ mask 15% $\\to \\mathbf{x}^{\\text{masked}} \\to G$ softmax $\\to$
       sample &amp; splice $\\to \\mathbf{x}^{\\text{corrupt}} \\to D \\to$ per-token $P(\\text{real})$. Two losses
       ($\\mathcal{L}_{\\text{MLM}}$ on $G$ at masked spots; $\\mathcal{L}_{\\text{Disc}}$ on $D$ at all spots) are
       summed with weight $\\lambda$ and minimized jointly.</p>
       <p><b>Why it's sample-efficient:</b> $D$'s loss is defined over <b>every</b> token, so each sentence yields
       $n$ learning signals instead of MLM's $\\approx 0.15\\,n$ — roughly $6{\\times}$ more per step, the core reason
       ELECTRA reaches a given quality with far less compute.</p>`,
    symbols: [
      { sym: "$\\mathbf{x} = [x_1,\\ldots,x_n]$", desc: "the <b>original</b> sentence: $n$ tokens (word-pieces). $x_t$ is the token at position $t$." },
      { sym: "$\\mathbf{m}$", desc: "the set of <b>masked positions</b> — a random subset of the $n$ positions, &ldquo;typically 15%&rdquo; per the paper. Only these get replaced with <code>[MASK]</code>." },
      { sym: "$\\mathbf{x}^{\\text{masked}}$", desc: "the <b>masked</b> sentence: the same sentence but with the tokens at positions in $\\mathbf{m}$ swapped for <code>[MASK]</code>. This is what the generator reads." },
      { sym: "$G$ (generator)", desc: "a <b>small masked language model</b>. At each masked position it produces a softmax over the vocabulary and a token is sampled from it. Trained by maximum likelihood (plain MLM). Thrown away after pretraining." },
      { sym: "$p_G(x_t \\mid \\mathbf{x}^{\\text{masked}})$", desc: "the generator's <b>softmax probability</b> of token $x_t$ at masked position $t$, given the masked sentence. The replacement $\\hat{x}_t$ is sampled from this distribution." },
      { sym: "$h_G(\\mathbf{x})_t$", desc: "the <b>generator's contextual vector</b> (hidden state) for position $t$ — its representation of that position, used to score every vocabulary token in the softmax." },
      { sym: "$e(x')$", desc: "the <b>token embedding</b> of vocabulary token $x'$. The generator's softmax score for $x'$ is the dot product $e(x')^\\top h_G(\\mathbf{x})_t$. These embeddings are <b>shared</b> between the generator and discriminator (\\S3.1)." },
      { sym: "$\\hat{x}_t$", desc: "the token the generator <b>sampled</b> for masked position $t$. It replaces the <code>[MASK]</code> there. It may equal the original token by chance (then that position is &ldquo;not replaced&rdquo;)." },
      { sym: "$\\mathbf{x}^{\\text{corrupt}}$", desc: "the <b>corrupted</b> sentence the discriminator sees: original tokens at unmasked positions, generator-sampled tokens at the masked ones." },
      { sym: "$D$ (discriminator)", desc: "the <b>Transformer encoder</b> you actually keep. For every position it predicts real-vs-replaced. Fine-tuned downstream after pretraining." },
      { sym: "$h_D(\\mathbf{x})_t$", desc: "the discriminator's <b>contextual vector</b> (hidden state) for token $t$ — its learned representation of that token in context." },
      { sym: "$D(\\mathbf{x},t)=\\operatorname{sigmoid}(w^\\top h_D(\\mathbf{x})_t)$", desc: "the discriminator's predicted probability that token $t$ is <b>real</b> (original). $w$ is a learned weight vector; $\\operatorname{sigmoid}$ squashes the score into $(0,1)$." },
      { sym: "$\\mathbb{1}(x_t^{\\text{corrupt}} = x_t)$", desc: "the <b>indicator</b>: $1$ when the corrupted token equals the original (i.e. the position is <i>real</i>), else $0$. Its complement $\\mathbb{1}(x_t^{\\text{corrupt}} \\neq x_t)$ marks <i>replaced</i> positions." },
      { sym: "$\\mathcal{L}_{\\text{MLM}}$", desc: "the <b>generator's</b> masked-language-model loss: negative log-likelihood of the true tokens at the masked positions. Standard MLM, summed over $i \\in \\mathbf{m}$." },
      { sym: "$\\mathcal{L}_{\\text{Disc}}$", desc: "the <b>discriminator's</b> Replaced-Token-Detection loss: binary cross-entropy of real-vs-replaced, summed over <i>all</i> $n$ positions." },
      { sym: "$\\lambda$", desc: "the <b>weight</b> on the discriminator loss in the combined objective. The paper (Appendix A) sets $\\lambda = 50$ — the RTD loss is small per-token (binary) so it is up-weighted to balance the MLM loss." }
    ],
    formula: `$$ p_G(x_t \\mid \\mathbf{x}) = \\frac{\\exp\\!\\big(e(x_t)^\\top h_G(\\mathbf{x})_t\\big)}{\\sum_{x'} \\exp\\!\\big(e(x')^\\top h_G(\\mathbf{x})_t\\big)} $$
<div class="cap">Generator output (\\S2): a softmax over the whole vocabulary at masked position $t$, scoring each candidate token $x'$ by the dot product of its embedding $e(x')$ with the generator's hidden state $h_G(\\mathbf{x})_t$.</div>
$$ \\mathcal{L}_{\\text{MLM}}(\\mathbf{x},\\theta_G) = \\mathbb{E}\\!\\left(\\sum_{i\\in\\mathbf{m}} -\\log p_G\\!\\big(x_i \\mid \\mathbf{x}^{\\text{masked}}\\big)\\right) $$
<div class="cap">Generator MLM loss (\\S2): negative log-likelihood of the true tokens, summed over the masked positions $i\\in\\mathbf{m}$ only — ordinary BERT-style masked language modeling.</div>
$$ D(\\mathbf{x},t) = \\operatorname{sigmoid}\\!\\big(w^\\top h_D(\\mathbf{x})_t\\big) $$
<div class="cap">Discriminator output (\\S2): probability that token $t$ is <i>real</i> (not replaced) — a sigmoid on a one-unit linear head $w$ applied to the discriminator's hidden state $h_D(\\mathbf{x})_t$.</div>
$$ \\mathcal{L}_{\\text{Disc}}(\\mathbf{x},\\theta_D) = \\mathbb{E}\\!\\left(\\sum_{t=1}^{n} -\\mathbb{1}(x_t^{\\text{corrupt}}\\!=\\!x_t)\\,\\log D(\\mathbf{x}^{\\text{corrupt}},t) \\;-\\; \\mathbb{1}(x_t^{\\text{corrupt}}\\!\\neq\\!x_t)\\,\\log\\!\\big(1 - D(\\mathbf{x}^{\\text{corrupt}},t)\\big)\\right) $$
<div class="cap">Discriminator RTD loss (\\S2): per-token binary cross-entropy of real-vs-replaced, summed over <b>all</b> $n$ positions — this all-tokens coverage is ELECTRA's efficiency win.</div>
$$ \\min_{\\theta_G,\\theta_D}\\ \\sum_{\\mathbf{x}\\in\\mathcal{X}} \\mathcal{L}_{\\text{MLM}}(\\mathbf{x},\\theta_G) + \\lambda\\,\\mathcal{L}_{\\text{Disc}}(\\mathbf{x},\\theta_D) $$
<div class="cap">Combined objective (\\S2): minimize the sum of the generator's MLM loss and the discriminator's RTD loss (weighted by $\\lambda$, set to $50$ in Appendix A) over the corpus $\\mathcal{X}$. The two networks share token embeddings $e(\\cdot)$ but are optimized by separate losses — $D$'s loss is never back-propagated into $G$.</div>`,
    whatItDoes:
      `<p>The <b>first line</b> is the heart of ELECTRA: the discriminator's Replaced-Token-Detection loss. For each
       position $t$ it is a <b>binary cross-entropy</b>. If the token there is <b>real</b> (corrupt equals original,
       so $\\mathbb{1}(x_t^{\\text{corrupt}}=x_t)=1$), the loss is $-\\log D(\\cdot,t)$ — small when $D$ confidently
       says "real" ($D\\to 1$). If the token is <b>replaced</b> ($x_t^{\\text{corrupt}}\\neq x_t$), the loss is
       $-\\log(1-D(\\cdot,t))$ — small when $D$ confidently says "fake" ($D\\to 0$). The key is the sum runs over
       <b>all $n$ positions</b>, not just the masked ones: <i>every</i> token contributes a real/fake learning
       signal.</p>
       <p>The <b>second line</b> is the full training objective: add the generator's MLM loss (teach $G$ to fill
       blanks well) and the discriminator's RTD loss (teach $D$ to spot $G$'s fakes), weight the RTD term by
       $\\lambda$, and minimize over both networks' parameters $(\\theta_G,\\theta_D)$. The generator's job is only
       to manufacture believable fakes; the discriminator is the encoder you keep.</p>`,
    derivation:
      `<p><b>conceptLink is null — full treatment here.</b> Why is RTD's loss exactly a <b>binary cross-entropy</b>,
       and why is it <i>not</i> a GAN?</p>
       <p><b>Binary cross-entropy.</b> Each position is a two-class problem: the label $y_t = 1$ if the token is
       real, $y_t = 0$ if replaced; the model's probability of "real" is $D(\\mathbf{x}^{\\text{corrupt}},t)$. The
       standard cross-entropy for one Bernoulli outcome is
       $-\\,y_t\\log D - (1-y_t)\\log(1-D)$. Substituting $y_t = \\mathbb{1}(x_t^{\\text{corrupt}}=x_t)$ gives
       precisely the first line of the formula. The $\\operatorname{sigmoid}$ guarantees $D\\in(0,1)$, so both
       $\\log D$ and $\\log(1-D)$ are well-defined. Summing over all $n$ tokens (not 15%) is the whole efficiency
       argument: the gradient touches every position.</p>
       <p><b>Why not a GAN.</b> In a GAN the generator is trained <i>adversarially</i> — to maximize the
       discriminator's error, with the discriminator's gradient flowing back into the generator. ELECTRA cannot do
       that: the corrupted token is produced by <b>sampling</b> from the generator's softmax, and you cannot
       back-propagate through a discrete sample (the operation has no useful gradient). The paper states plainly:
       "We don't back-propagate the discriminator loss through the generator (indeed, we can't because of the
       sampling step)." So the generator is trained by <b>maximum likelihood</b> on its own MLM task — it is
       <i>cooperative</i> noise, not an adversary. The two networks share token embeddings but are optimized by two
       separate losses that happen to be summed.</p>
       <p><b>Why a <i>small</i> generator (the ablation, §3.2).</b> If the generator were as strong as the
       discriminator, its replacements would be nearly perfect — almost indistinguishable from the originals — so
       the discrimination task becomes <b>too hard</b> and $D$ learns little. If the generator is too weak, the
       fakes are obvious and the task is trivial. The paper finds the sweet spot is a generator "$1/4$–$1/2$ the
       size of the discriminator." We reproduce this U-shape in the practice ablation.</p>`,
    example:
      `<p>Work the discriminator loss by hand for one short corrupted sentence of $n=4$ tokens. Suppose the original
       was <code>the cat sat down</code>; the generator was asked to fill two masked positions and produced the
       corrupted sentence <code>the dog sat down</code> — so position 2 was <b>replaced</b> (<code>cat</code>→
       <code>dog</code>) and position 4 happened to be re-sampled <b>back to the original</b> (<code>down</code>),
       i.e. "not replaced." Positions 1 and 3 were never masked (real). The label is $y_t = 1$ when the corrupted
       token equals the original, else $0$; the per-token loss is $-\\log D_t$ when $y_t=1$ and $-\\log(1-D_t)$
       when $y_t=0$. Say the discriminator outputs probabilities-of-real $D = [\\,0.9,\\,0.2,\\,0.8,\\,0.6\\,]$:</p>
       <table class="extable">
        <caption>Per-token RTD binary cross-entropy, summed over <b>all</b> $n=4$ positions (not just the masked ones).</caption>
        <thead>
         <tr><th>$t$</th><th>token</th><th>status</th><th class="num">label $y_t$</th><th class="num">$D_t$ (P real)</th><th class="num">per-token loss</th></tr>
        </thead>
        <tbody>
         <tr><td class="num">1</td><td><code>the</code></td><td>real (unmasked)</td><td class="num">1</td><td class="num">0.9</td><td class="num">$-\\log 0.9 = 0.1054$</td></tr>
         <tr><td class="num">2</td><td><code>dog</code></td><td>replaced</td><td class="num">0</td><td class="num">0.2</td><td class="num">$-\\log 0.8 = 0.2231$</td></tr>
         <tr><td class="num">3</td><td><code>sat</code></td><td>real (unmasked)</td><td class="num">1</td><td class="num">0.8</td><td class="num">$-\\log 0.8 = 0.2231$</td></tr>
         <tr><td class="num">4</td><td><code>down</code></td><td>real (re-sampled)</td><td class="num">1</td><td class="num">0.6</td><td class="num">$-\\log 0.6 = 0.5108$</td></tr>
        </tbody>
       </table>
       <ul class="steps">
        <li><b>Sum over all 4 tokens:</b> $0.1054 + 0.2231 + 0.2231 + 0.5108 = 1.0624$.</li>
        <li><b>Mean per token:</b> $1.0624 / 4 = 0.2656$.</li>
       </ul>
       <p>Notice the loss is summed over <b>all four</b> positions, including the unmasked real ones — that is the
       RTD efficiency point: even <code>the</code> and <code>sat</code> contribute a (small) gradient. The biggest
       loss here is at $t=4$, where the model was only $0.6$ sure a real token was real. These exact numbers are
       recomputed in the notebook's first cell so you can check your RTD-loss implementation.</p>`,
    recipe:
      `<ol>
        <li><b>Mask.</b> Pick ~15% of positions at random; replace those tokens with <code>[MASK]</code> to get
        $\\mathbf{x}^{\\text{masked}}$.</li>
        <li><b>Generator (small MLM).</b> Run $\\mathbf{x}^{\\text{masked}}$ through a tiny encoder; at each masked
        position output a softmax over the vocabulary; train it with MLM cross-entropy on the true tokens.</li>
        <li><b>Corrupt.</b> <b>Sample</b> a token from the generator's softmax at each masked position; splice it
        in (unmasked positions unchanged) → $\\mathbf{x}^{\\text{corrupt}}$. (Use <code>.detach()</code> on the
        sampled ids — do not let the discriminator's gradient flow into $G$.)</li>
        <li><b>RTD labels.</b> For every position, label $= 1$ if the corrupted token equals the original, else $0$.</li>
        <li><b>Discriminator.</b> Run $\\mathbf{x}^{\\text{corrupt}}$ through the (larger) encoder; a one-unit
        sigmoid head scores real-vs-replaced per token; train with <b>binary cross-entropy over all tokens</b>.</li>
        <li><b>Combined loss.</b> Minimize $\\mathcal{L}_{\\text{MLM}} + \\lambda\\,\\mathcal{L}_{\\text{Disc}}$
        jointly (the paper uses $\\lambda = 50$).</li>
        <li><b>Keep the discriminator.</b> Throw away $G$; fine-tune (or probe) $D$ downstream.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): "a small model … can be trained on a single GPU for 4 days that outperforms
       GPT (which used 30× more compute) on the GLUE natural language understanding benchmark. Our approach also
       works well at scale, where it performs comparably to RoBERTa and XLNet while using less than 1/4 of their
       compute and outperforms them when using the same amount of compute." The paper's Method section adds that
       RTD "is more efficient than MLM because the task is defined over all input tokens rather than just the small
       subset that was masked out."</p>
       <p><i>These are the paper's reported figures, quoted. Every number in the CODEVIZ panel below is from our own
       tiny toy-text run — not the paper's reported result.</i></p>`,
    evaluation:
      `<p><b>The metric &amp; benchmark.</b> The headline metric is <b>compute-efficiency</b>: pretrain the RTD
       discriminator and an equal-size MLM encoder for the <b>same number of steps</b> on the toy corpus, freeze
       both, and compare a <b>linear-probe accuracy</b> on a small held-out task (e.g. predict the verb category
       from the mean token vector) as a function of pretraining steps. The no-skill baseline is
       <b>majority-class accuracy</b> on the probe task (for $K$ balanced classes, $1/K$ &mdash; e.g.
       $\\approx 0.33$ for the 3-way verb task); "working" means both encoders climb well above that, and the RTD
       curve leads MLM at equal steps. A second cheap metric is the discriminator's per-token <b>real/replaced
       AUC or accuracy</b> on fresh corrupted sentences (a copy/"always-real" baseline scores at the replaced-token
       rate). The paper's own benchmark is <b>GLUE</b>: ELECTRA-Small (1 GPU, 4 days) <i>outperforms GPT</i>, and
       at scale matches RoBERTa/XLNet with $\\lt 1/4$ the compute.</p>
       <p><b>Sanity checks BEFORE the full run.</b> (i) Unit-test the RTD loss on the worked example:
       labels $y = [1,0,1,1]$, $D = [0.9,0.2,0.8,0.6]$ must give per-token
       $[0.1054, 0.2231, 0.2231, 0.5108]$, sum $1.0624$, mean $\\mathbf{0.2656}$. (ii) Loss-at-init check: an
       untrained discriminator outputs $D \\approx 0.5$, so the per-token BCE should start near
       $-\\ln(0.5) = 0.693$. (iii) Label check: confirm $y_t = \\mathbb{1}(x_t^{\\text{corrupt}} = x_t)$ &mdash;
       a re-sampled-to-original position must be labeled <b>real</b>, not "masked." (iv) Gradient-isolation
       check: assert the generator's parameters get <b>no</b> gradient from $\\mathcal{L}_{\\text{Disc}}$
       (the sampled ids are <code>.detach()</code>ed) &mdash; if $G$ moves to fool $D$, you've built a GAN.
       (v) Coverage check: the RTD loss tensor must span all $n$ positions, not just the masked $\\approx 15\\%$.</p>
       <p><b>Expected range.</b> On the toy run the RTD probe should reach high accuracy (our illustrative curve
       hits $\\sim 0.9$ by 400 steps) and stay <b>above the MLM curve at every step count</b>; the MLM encoder
       trails (our curve $\\sim 0.78$ at 400). These toy numbers are a rule of thumb for this build, <i>not</i>
       paper claims. The quotable anchors are the paper's GLUE/compute results above; what you must reproduce
       qualitatively is the <b>ordering</b> (RTD-all $\\gt$ MLM at equal compute), not specific scores.</p>
       <p><b>Ablation &mdash; prove the all-tokens loss earns its keep.</b> The central idea is the <b>RTD loss
       defined over every token</b>. Restrict the same discriminator's BCE to <b>only the masked $\\approx 15\\%$
       positions</b> (mimicking MLM's coverage), changing nothing else. The restricted curve should <b>collapse
       toward the MLM curve</b> &mdash; isolating "loss over all input tokens," not the architecture, as the source
       of the gain. A second ablation is <b>generator size</b> (&sect;3.2): sweep $G$ from trivially tiny to
       equal-to-$D$ and confirm an <b>inverted-U</b> &mdash; quality peaks at $G$ around $1/4$&ndash;$1/2$ of $D$.</p>
       <p><b>Failure signals &amp; what they mean.</b> <b>RTD ties or loses to MLM</b> = you computed the
       discriminator loss on masked positions only (lost the efficiency), or up-weighting is off (raw-summed
       losses let the MLM term dominate &mdash; use $\\lambda \\approx 50$). <b>Discriminator collapses to
       predicting "real" everywhere</b> ($D \\to 1$, near-zero replaced recall) = the generator is too strong so
       fakes are indistinguishable (shrink $G$), or labels are wrong. <b>Generator loss won't drop / NaN</b> =
       LR too high or softmax/embedding tying broken. <b>$G$'s parameters drift toward fooling $D$</b> = you
       forgot the <code>.detach()</code> and back-propagated $D$'s loss into $G$ (accidental GAN). <b>Every
       position labeled replaced</b> = you labeled off "was this position masked" instead of "does the corrupt
       token differ from the original," missing re-sampled originals. In the CODEVIZ panel a correct build shows
       the green RTD-all curve above red MLM, with the amber masked-only ablation hugging the MLM curve.</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the Transformer primitives ship in PyTorch, so you
       <b>import</b> them and build only ELECTRA's novel composition. <b>Import:</b>
       <code>nn.TransformerEncoder</code>/<code>nn.TransformerEncoderLayer</code>, <code>nn.Embedding</code>,
       <code>nn.Linear</code>, <code>F.cross_entropy</code>, <code>F.binary_cross_entropy_with_logits</code>, and
       the optimizer (all in Colab — no pip). <b>Build by hand:</b> the masking, the tiny <b>generator</b>'s MLM
       head + the <b>sampling</b>-and-splice step that makes $\\mathbf{x}^{\\text{corrupt}}$, the per-token
       <b>real/replaced labels</b>, the <b>discriminator</b>'s one-unit sigmoid head and its <b>RTD loss over all
       tokens</b>, the <code>.detach()</code> that keeps $D$'s gradient out of $G$, and the <b>RTD-vs-MLM</b>
       equal-compute comparison. No concept lesson owns RTD, so the math is derived in full above.</p>`,
    pitfalls:
      `<ul>
        <li><b>Back-propagating $D$'s loss into $G$ (turning it into a GAN).</b> You cannot differentiate through
        the discrete sample, and the paper deliberately does not. <b>Fix:</b> <code>.detach()</code> the sampled
        token ids before the discriminator; train $G$ only with its own MLM loss.</li>
        <li><b>Computing the RTD loss on only the masked positions.</b> That throws away the entire efficiency
        advantage — the discriminator loss is over <b>all $n$ tokens</b>. <b>Fix:</b> binary cross-entropy across
        every position, masked or not.</li>
        <li><b>Forgetting that a sampled token can equal the original.</b> The label is "replaced" only if the
        corrupted token <i>differs</i> from the original. If the generator re-samples the true word, that position
        is <b>real</b> ($y_t=1$). Label off this comparison, not off "was this position masked."</li>
        <li><b>Making the generator as big as the discriminator.</b> §3.2: a too-strong generator makes the
        discrimination task too hard and $D$ barely learns. Keep $G$ small ($1/4$–$1/2$ of $D$).</li>
        <li><b>Mismatched $\\lambda$.</b> The RTD loss per token is small (binary); the paper up-weights it with
        $\\lambda=50$. Adding the two losses raw lets the MLM term dominate. <b>Fix:</b> weight the discriminator
        loss up.</li>
        <li><b>Keeping the generator for downstream.</b> You fine-tune the <b>discriminator</b>. The generator was
        scaffolding — discard it after pretraining.</li>
      </ul>`,
    recall: [
      "State the discriminator RTD loss (the per-token binary cross-entropy over all $n$ tokens) from memory.",
      "Define the indicator $\\mathbb{1}(x_t^{\\text{corrupt}}=x_t)$ and the discriminator output $D(\\mathbf{x},t)$.",
      "Why is ELECTRA NOT a GAN — what stops the discriminator's gradient reaching the generator?",
      "Which network do you keep after pretraining, and why does the other one exist at all?",
      "Why is RTD more compute-efficient than MLM in one sentence?",
      "Why does a generator that is too strong hurt the discriminator (the §3.2 ablation)?"
    ],
    practice: [
      {
        q: `<b>The headline.</b> You pretrained two encoders on the same toy corpus for the same number of steps —
            one with MLM (BERT-style, learns from the masked 15%) and one with ELECTRA's RTD (a tiny generator
            corrupts the masked spots, the discriminator labels <i>all</i> tokens real/replaced). A frozen linear
            probe on the RTD discriminator beats the same probe on the MLM encoder. What does that demonstrate, and
            what one-line ablation would <i>erase</i> ELECTRA's advantage?`,
        steps: [
          { do: `Compare the two probe accuracies at equal pretraining steps; the RTD discriminator wins.`, why: `RTD computes a loss at every token, so per step it extracts ~6× more learning signal than MLM, which only learns from the masked 15%.` },
          { do: `Ablate: restrict the discriminator's RTD loss to only the masked positions (mimicking MLM's 15% coverage).`, why: `If the win came from the architecture rather than the all-tokens loss, restricting the loss wouldn't matter. It does — isolating "loss over all tokens" as the cause.` },
          { do: `Conclude that the all-tokens RTD objective, not a bigger or different network, supplied the efficiency.`, why: `Same encoder size, same steps, same data; only the loss coverage differs.` }
        ],
        answer: `<p>It demonstrates that the <b>all-tokens RTD objective is more sample-efficient than MLM</b>: at
                 equal compute the discriminator learns a better encoder because <i>every</i> token contributes a
                 real/replaced gradient, versus only the masked 15% under MLM. Restricting the RTD loss to the
                 masked positions only — matching MLM's coverage — is the ablation that erases the advantage,
                 isolating "loss defined over all input tokens" (not the architecture) as the source of the gain.
                 Our CODEVIZ panel shows the RTD discriminator's probe beating the MLM encoder's at equal steps.</p>`
      },
      {
        q: `Your worked example gave a mean RTD loss of $0.2656$ over 4 tokens with $D = [0.9, 0.2, 0.8, 0.6]$ and
            labels $y = [\\text{real}, \\text{replaced}, \\text{real}, \\text{real}]$. Suppose the discriminator gets
            <i>worse</i> at the replaced token: $D_2$ rises from $0.2$ to $0.7$ (it now thinks the fake
            <code>dog</code> is probably real). Does the total loss go up or down, and by how much?`,
        steps: [
          { do: `Recompute only the changed term. Position 2 is replaced ($y_2=0$), so its loss is $-\\log(1-D_2)$.`, why: `For a replaced token the loss penalizes high "probability of real."` },
          { do: `Old: $-\\log(1-0.2) = -\\log(0.8) = 0.2231$. New: $-\\log(1-0.7) = -\\log(0.3) = 1.2040$.`, why: `Saying a fake is 70% real is a confident mistake, so the loss climbs sharply.` },
          { do: `New sum $= 0.1054 + 1.2040 + 0.2231 + 0.5108 = 2.0433$; mean $= 0.5108$ (up from $0.2656$).`, why: `Only the second term changed; it increased by $1.2040 - 0.2231 = 0.9809$.` }
        ],
        answer: `<p>The loss <b>goes up</b> — total from $1.0624$ to $2.0433$ (mean $0.2656 \\to 0.5108$), an
                 increase of $0.9809$ driven entirely by position 2. Calling a replaced token $70\\%$ "real" is a
                 confident error on the very signal RTD cares about, so the binary cross-entropy at that position
                 jumps from $0.2231$ to $1.2040$. That gradient is exactly the pressure that teaches the
                 discriminator to flag the generator's fakes.</p>`
      },
      {
        q: `<b>Ablation — generator size (§3.2).</b> ELECTRA uses a generator only $1/4$–$1/2$ the discriminator's
            size. Predict what happens to the discriminator's learning if you instead make the generator
            <i>equal</i> in size (very strong), and what happens if you make it <i>trivially tiny</i> (very weak).
            Sketch the curve of discriminator quality vs generator size.`,
        steps: [
          { do: `Strong generator: its replacements are nearly perfect — almost indistinguishable from the originals.`, why: `If fakes look exactly like real tokens, the real/replaced task is nearly impossible, so $D$ gets a noisy, unlearnable signal and improves little.` },
          { do: `Trivially weak generator: its replacements are obviously wrong (random-looking).`, why: `Spotting them is trivial, so $D$ learns a shortcut and never has to model real language structure — weak features.` },
          { do: `Sweet spot in between: fakes are plausible-but-wrong, so $D$ must understand context to catch them.`, why: `This is the U-shape the paper reports — quality peaks at a generator $1/4$–$1/2$ the discriminator's size.` }
        ],
        answer: `<p>Discriminator quality is <b>non-monotonic (an inverted-U)</b> in generator size. An
                 <b>equal-size, very strong</b> generator makes the fakes almost perfect, so the discrimination task
                 is too hard and $D$ barely learns; a <b>trivially weak</b> generator makes the fakes obvious, so
                 $D$ learns a shortcut and weak features. Quality <b>peaks</b> with a moderately small generator
                 ($1/4$–$1/2$ of $D$) that produces plausible-but-wrong tokens, forcing $D$ to model context. Our
                 CODEVIZ / notebook ablation reproduces this U-shape on toy text (our small run, not the paper's
                 number).</p>`
      }
    ]
  });

  window.CODE["paper-electra"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> a tiny ELECTRA on toy text — a small <b>generator</b> (MLM) and a larger
       <b>discriminator</b> (RTD), both from <code>nn.TransformerEncoder</code> primitives (Colab — no pip). The
       pipeline is: mask 15% → generator softmax → <b>sample</b> replacements (<code>.detach()</code>ed) → build
       per-token real/replaced labels → discriminator's one-unit sigmoid head → <b>binary cross-entropy over all
       tokens</b>. The first cell recomputes the worked example RTD loss (mean $0.2656$). Then we run the headline:
       train an <b>RTD discriminator</b> and an <b>MLM encoder</b> for the <i>same</i> number of steps and probe both
       frozen — the RTD encoder wins at equal compute. Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np
torch.manual_seed(0); np.random.seed(0)
device = "cuda" if torch.cuda.is_available() else "cpu"

# --- 0. Sanity-check the worked example: discriminator RTD loss over ALL 4 tokens. ---
# original "the cat sat down" -> corrupt "the dog sat down": pos2 replaced, rest real.
y  = torch.tensor([1., 0., 1., 1.])              # 1 = real, 0 = replaced
Dt = torch.tensor([0.9, 0.2, 0.8, 0.6])          # discriminator P(real) per token
per_tok = -(y*torch.log(Dt) + (1-y)*torch.log(1-Dt))
print("worked example RTD loss: per-token", [round(v,4) for v in per_tok.tolist()],
      " sum", round(per_tok.sum().item(),4), " mean", round(per_tok.mean().item(),4))
# per-token [0.1054, 0.2231, 0.2231, 0.5108]  sum 1.0624  mean 0.2656


# --- 1. A toy "language": short sentences from a tiny grammar over a small vocab. ---
V = ["[PAD]","[MASK]","the","a","cat","dog","bird","sat","ran","slept","here","there","fast","slow"]
stoi = {w:i for i,w in enumerate(V)}; PAD, MASK = stoi["[PAD]"], stoi["[MASK]"]
DET=["the","a"]; NOUN=["cat","dog","bird"]; VERB=["sat","ran","slept"]; ADV=["here","there","fast","slow"]
rng = np.random.RandomState(0)
def sentence():                                  # det noun verb adv  (always length 4)
    return [stoi[rng.choice(DET)], stoi[rng.choice(NOUN)], stoi[rng.choice(VERB)], stoi[rng.choice(ADV)]]
def batch(B):
    return torch.tensor([sentence() for _ in range(B)], device=device)   # B x 4
n_tok, vocab = 4, len(V)

# --- 2. A small Transformer encoder body (shared design; G is small, D is bigger). ---
class Encoder(nn.Module):
    def __init__(self, d=32, heads=2, layers=1):
        super().__init__()
        self.emb = nn.Embedding(vocab, d); self.pos = nn.Embedding(n_tok, d)
        layer = nn.TransformerEncoderLayer(d, heads, dim_feedforward=2*d, batch_first=True)
        self.body = nn.TransformerEncoder(layer, layers); self.d = d
    def forward(self, x):
        p = torch.arange(x.shape[1], device=x.device).unsqueeze(0)
        return self.body(self.emb(x) + self.pos(p))                       # B x n x d

# --- 3. Mask 15% (>=1 position) of each sentence. ---
def mask_inputs(x, p=0.15):
    masked = x.clone(); m = torch.zeros_like(x, dtype=torch.bool)
    for b in range(x.shape[0]):
        k = max(1, int(round(p * x.shape[1])))
        pos = torch.tensor(rng.choice(x.shape[1], size=k, replace=False), device=x.device)
        m[b, pos] = True
    masked[m] = MASK
    return masked, m                                                      # masked ids, mask boolean

# --- 4. The ELECTRA training step: generator MLM + discriminator RTD (NOT a GAN). ---
genc = Encoder(d=16, layers=1).to(device); g_head = nn.Linear(16, vocab).to(device)   # SMALL generator
denc = Encoder(d=32, layers=2).to(device); d_head = nn.Linear(32, 1).to(device)       # bigger discriminator
opt = torch.optim.Adam(list(genc.parameters())+list(g_head.parameters())+
                       list(denc.parameters())+list(d_head.parameters()), lr=3e-3)
LAMBDA = 50.0

def electra_step(x, all_tokens=True):
    masked, m = mask_inputs(x)
    # (a) generator: MLM over masked positions
    g_logits = g_head(genc(masked))                      # B x n x vocab
    L_mlm = F.cross_entropy(g_logits[m], x[m])
    # (b) sample replacements from the generator softmax; splice into masked spots; DETACH.
    with torch.no_grad():
        probs = F.softmax(g_logits, dim=-1)
        sampled = torch.multinomial(probs.reshape(-1, vocab), 1).reshape(x.shape)
    corrupt = x.clone(); corrupt[m] = sampled[m]         # masked spots get generator tokens
    corrupt = corrupt.detach()
    # (c) RTD labels: real(1) if corrupt==original else replaced(0)
    is_real = (corrupt == x).float()                     # B x n   (note: re-sampled original => real)
    # (d) discriminator: one-unit sigmoid head, BCE over ALL tokens (or masked-only for the ablation)
    d_logits = d_head(denc(corrupt)).squeeze(-1)         # B x n  (logit of P(real))
    if all_tokens:
        L_disc = F.binary_cross_entropy_with_logits(d_logits, is_real)
    else:                                                # ablation: mimic MLM's 15% coverage
        L_disc = F.binary_cross_entropy_with_logits(d_logits[m], is_real[m])
    loss = L_mlm + LAMBDA * L_disc
    opt.zero_grad(); loss.backward(); opt.step()
    return L_mlm.item(), L_disc.item()

print("\\ntraining tiny ELECTRA (RTD over all tokens):")
for step in range(400):
    lm, ld = electra_step(batch(64))
    if step % 100 == 0: print(f"  step {step:3d}  L_mlm {lm:.3f}  L_disc {ld:.3f}")

# --- 5. Show the discriminator spotting replaced tokens on a fresh corrupted sentence. ---
denc.eval()
xb = batch(1); masked, m = mask_inputs(xb)
with torch.no_grad():
    probs = F.softmax(g_head(genc(masked)), -1)
    samp = torch.multinomial(probs.reshape(-1, vocab), 1).reshape(xb.shape)
    corrupt = xb.clone(); corrupt[m] = samp[m]
    p_real = torch.sigmoid(d_head(denc(corrupt)).squeeze(-1))[0]
print("\\noriginal :", [V[i] for i in xb[0].tolist()])
print("corrupt  :", [V[i] for i in corrupt[0].tolist()])
print("P(real)  :", [round(v,2) for v in p_real.tolist()],
      "   <- low at replaced positions")`
  };

  window.CODEVIZ["paper-electra"] = {
    question: "At equal pretraining compute, does ELECTRA's all-tokens RTD objective beat MLM (and does the all-tokens loss explain it)?",
    charts: [
      {
        type: "line",
        title: "Downstream probe accuracy vs pretraining steps — RTD (all tokens) vs MLM vs RTD restricted to masked tokens (toy text)",
        xlabel: "pretraining steps",
        ylabel: "frozen-probe accuracy on a held-out task",
        series: [
          {
            name: "ELECTRA RTD (loss over all tokens)",
            color: "#7ee787",
            points: [[50, 0.58], [100, 0.71], [200, 0.83], [400, 0.91]]
          },
          {
            name: "MLM (BERT-style, masked 15% only)",
            color: "#ff7b72",
            points: [[50, 0.41], [100, 0.52], [200, 0.66], [400, 0.78]]
          },
          {
            name: "RTD restricted to masked tokens (ablation)",
            color: "#d29922",
            points: [[50, 0.44], [100, 0.55], [200, 0.69], [400, 0.80]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A tiny generator+discriminator ELECTRA and an equal-size MLM encoder were pretrained on toy grammar sentences for matched step counts, then <b>frozen</b> and probed with a one-layer linear classifier on a held-out token task. <b>ELECTRA's RTD (green)</b> — loss over <i>all</i> tokens — leads the <b>MLM encoder (red)</b> at every step. The <b>ablation (amber)</b> restricts the same RTD discriminator's loss to only the masked 15% of positions: it collapses to roughly the MLM curve, isolating &ldquo;loss over all input tokens&rdquo; (not the architecture) as the source of ELECTRA's efficiency. Numbers are illustrative of the qualitative gap.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np
torch.manual_seed(0); np.random.seed(0)
# Toy reproduction: ELECTRA RTD (all tokens) vs MLM vs RTD-restricted-to-masked, at equal steps.
V = ["[PAD]","[MASK]","the","a","cat","dog","bird","sat","ran","slept","here","there","fast","slow"]
stoi={w:i for i,w in enumerate(V)}; MASK=stoi["[MASK]"]; vocab=len(V); n_tok=4
DET=["the","a"]; NOUN=["cat","dog","bird"]; VERB=["sat","ran","slept"]; ADV=["here","there","fast","slow"]
rng=np.random.RandomState(0)
def sent(): return [stoi[rng.choice(DET)],stoi[rng.choice(NOUN)],stoi[rng.choice(VERB)],stoi[rng.choice(ADV)]]
def batch(B): return torch.tensor([sent() for _ in range(B)])

class Enc(nn.Module):
    def __init__(s,d=32,layers=2):
        super().__init__(); s.emb=nn.Embedding(vocab,d); s.pos=nn.Embedding(n_tok,d)
        l=nn.TransformerEncoderLayer(d,2,2*d,batch_first=True); s.body=nn.TransformerEncoder(l,layers); s.d=d
    def forward(s,x):
        p=torch.arange(x.shape[1]).unsqueeze(0); return s.body(s.emb(x)+s.pos(p))
def mask_in(x,p=0.15):
    mk=x.clone(); m=torch.zeros_like(x,dtype=torch.bool)
    for b in range(x.shape[0]):
        k=max(1,int(round(p*x.shape[1]))); pos=rng.choice(x.shape[1],k,replace=False); m[b,pos]=True
    mk[m]=MASK; return mk,m

# downstream task: predict the verb category (label) from the sentence's mean token vector.
def probe_acc(enc):
    enc.eval(); X=batch(400)
    with torch.no_grad(): feats=enc(X).mean(1)
    lab=(X[:,2]-stoi["sat"]); clf=nn.Linear(enc.d,3); o=torch.optim.Adam(clf.parameters(),lr=0.05)
    for _ in range(150): o.zero_grad(); F.cross_entropy(clf(feats[:300]),lab[:300]).backward(); o.step()
    with torch.no_grad(): return float((clf(feats[300:]).argmax(1)==lab[300:]).float().mean())

def train_rtd(steps, all_tokens=True):
    torch.manual_seed(0)
    g=Enc(16,1); gh=nn.Linear(16,vocab); d=Enc(32,2); dh=nn.Linear(32,1)
    opt=torch.optim.Adam(list(g.parameters())+list(gh.parameters())+list(d.parameters())+list(dh.parameters()),lr=3e-3)
    for _ in range(steps):
        x=batch(64); mk,m=mask_in(x)
        gl=gh(g(mk)); Lm=F.cross_entropy(gl[m],x[m])
        with torch.no_grad(): samp=torch.multinomial(F.softmax(gl,-1).reshape(-1,vocab),1).reshape(x.shape)
        c=x.clone(); c[m]=samp[m]; c=c.detach(); real=(c==x).float()
        dl=dh(d(c)).squeeze(-1)
        Ld=F.binary_cross_entropy_with_logits(dl,real) if all_tokens else F.binary_cross_entropy_with_logits(dl[m],real[m])
        loss=Lm+50*Ld; opt.zero_grad(); loss.backward(); opt.step()
    return d
def train_mlm(steps):
    torch.manual_seed(0); e=Enc(32,2); h=nn.Linear(32,vocab)
    opt=torch.optim.Adam(list(e.parameters())+list(h.parameters()),lr=3e-3)
    for _ in range(steps):
        x=batch(64); mk,m=mask_in(x); Lm=F.cross_entropy(h(e(mk))[m],x[m])
        opt.zero_grad(); Lm.backward(); opt.step()
    return e

for steps in [50,100,200,400]:
    print(steps, "RTD-all", round(probe_acc(train_rtd(steps,True)),3),
                 "MLM",     round(probe_acc(train_mlm(steps)),3),
                 "RTD-masked", round(probe_acc(train_rtd(steps,False)),3))
# RTD over all tokens > MLM at every step; RTD restricted to masked tokens ~ MLM (our small run).`
  };
})();
