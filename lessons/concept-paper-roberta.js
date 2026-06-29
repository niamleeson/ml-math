/* Paper lesson — RoBERTa: A Robustly Optimized BERT Pretraining Approach (Liu et al., 2019).
   Grounded from arXiv:1907.11692 (abstract) + ar5iv HTML mirror.
   Sections cited: §2.3 (MLM objective, 15% / 80-10-10), §3.2 (data, 160GB vs 16GB),
   §4.1 (static vs dynamic masking, Table 1), §4.2 (NSP removal / input format, Table 2),
   §4.3 (large batches, Table 3), §5 (RoBERTa config: 8K batch, 500K steps).
   Track: architecture (🧩B). RoBERTa makes NO new layer — it is BERT trained better. So we take a
   tiny BERT-style masked-LM and demonstrate the two recipe changes that need code: (a) dynamic vs
   static masking, (b) removing the next-sentence-prediction (NSP) head. We train on a small corpus
   and ABLATE static vs dynamic masking. Cross-links paper-bert (the model it re-trains).
   Self-contained: lesson + CODE + CODEVIZ by id. Worked numeric example matches the notebook. */
(function () {
  window.LESSONS.push({
    id: "paper-roberta",
    title: "RoBERTa — A Robustly Optimized BERT Pretraining Approach (2019)",
    tagline: "BERT was undertrained: keep the exact architecture but train it better — more data, longer, bigger batches, fresh random masking every time, and drop the next-sentence task.",
    module: "Papers · Transformers & LLMs",
    track: "architecture",

    paper: {
      authors: "Yinhan Liu, Myle Ott, Naman Goyal, Jingfei Du, Mandar Joshi, Danqi Chen, Omer Levy, Mike Lewis, Luke Zettlemoyer, Veselin Stoyanov",
      org: "Facebook AI / University of Washington",
      year: 2019,
      venue: "arXiv:1907.11692 (cs.CL)",
      citations: "",
      arxiv: "https://arxiv.org/abs/1907.11692",
      code: "https://github.com/facebookresearch/fairseq"
    },

    conceptLink: "mod-llm",
    partOf: [],
    prereqs: ["mod-llm", "mod-transformer", "dl-cross-entropy", "ml-softmax", "pt-nn-module", "pt-autograd"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> <b>BERT</b> (the <code>paper-bert</code> lesson) is a Transformer
       <i>encoder</i> &mdash; a stack of attention layers that reads a whole sentence at once &mdash;
       pretrained on two self-supervised tasks: <b>masked language modeling</b> (MLM), where some input
       tokens are hidden and the model must guess them, and <b>next-sentence prediction</b> (NSP), a
       yes/no task asking whether sentence B really followed sentence A. ("Token" = one unit of input,
       a word or sub-word. "Self-supervised" = the labels come free from the text itself, no human
       annotation.)</p>
       <p><b>What was murky.</b> After BERT, a wave of papers reported beating it &mdash; but they each
       changed many things at once (more data, different objectives, more compute), so nobody could say
       <i>which</i> change mattered. As the abstract puts it, "careful comparison between different
       approaches is challenging&hellip; hyperparameter choices have significant impact on the final
       results."</p>
       <p><b>The finding.</b> RoBERTa is a careful <b>replication study</b> of BERT pretraining. Holding
       the architecture fixed, it sweeps the training recipe and finds (abstract) that "BERT was
       significantly undertrained, and can match or exceed the performance of every model published
       after it." The headline is uncomfortable: much of the claimed progress was just BERT trained
       better.</p>`,

    contribution:
      `<p>RoBERTa introduces <b>no new layer</b>. Its contribution is a set of training-recipe changes,
       each isolated and measured (Section 5 summarizes them):</p>
       <ul>
         <li><b>Dynamic masking</b> (Section 4.1): re-draw which tokens are masked <i>every time</i> a
         sequence is fed to the model, instead of masking once up front and reusing that pattern.</li>
         <li><b>Drop NSP; feed full sentences</b> (Section 4.2): remove the next-sentence-prediction
         task and pack inputs with contiguous full sentences. The MLM-only objective matches or beats
         BERT.</li>
         <li><b>Bigger batches, longer, more data</b> (Sections 4.3, 3.2): train with large mini-batches
         (8K sequences), for many steps, on 160GB of text &mdash; ten times BERT's 16GB.</li>
         <li><b>Larger byte-level BPE vocabulary</b> (Section 4.4): a 50K byte-level
         byte-pair-encoding tokenizer that never needs an "unknown" token.</li>
       </ul>
       <p>This lesson demonstrates the two changes that are <i>algorithmic</i> &mdash; dynamic vs static
       masking and removing NSP &mdash; on a tiny BERT-style model you can train in seconds. Batch size,
       data scale, and the tokenizer are scale knobs we discuss but do not reproduce.</p>`,

    whyItMattered:
      `<p>RoBERTa became the default strong encoder baseline: state-of-the-art on GLUE, SQuAD, and RACE
       at release (abstract), and for years the go-to checkpoint for fine-tuning classification and
       question-answering systems. Its deeper lesson reshaped the field's methodology: <b>controlled
       ablations</b> matter, and a strong baseline can beat fancier methods if you simply train it
       properly and long enough. Dynamic masking and the "drop NSP" finding carried into many later
       encoders. It is the direct sequel to <code>paper-bert</code> &mdash; same model, better
       cooking.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Section 4</b> &mdash; the whole point. 4.1 static vs dynamic masking (and Table 1),
         4.2 NSP / input format (and Table 2), 4.3 large batches (and Table 3), 4.4 the tokenizer.</li>
         <li><b>Section 2.3</b> &mdash; a one-paragraph recap of BERT's MLM (15% selected; of those,
         80% &rarr; <code>[MASK]</code>, 10% &rarr; random token, 10% unchanged). You need this to
         understand what "masking" means before comparing static vs dynamic.</li>
         <li><b>Tables 1&ndash;3</b> &mdash; the controlled ablations that justify each change.</li>
       </ul>
       <p><b>Skim:</b> Section 3 (background/setup details), Section 5's full benchmark tables, and the
       related-work discussion. The benchmark numbers are context; the <i>recipe deltas</i> are the
       contribution.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> We will pretrain the same tiny masked-LM two ways. <b>Static:</b>
       choose the masked positions <i>once</i> and reuse that exact pattern every epoch. <b>Dynamic:</b>
       choose fresh random masked positions <i>every</i> epoch. After equal training, which reaches the
       lower masked-token loss &mdash; static, dynamic, or a tie? Why might seeing the <i>same</i>
       masking holes over and over be worse than seeing fresh ones? Write your guess, then check the
       ablation.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> The novel piece is the masking step, not the model. Build
       <code>mask_batch(tokens, mask_id, rate=0.15)</code> that returns a masked copy plus the targets:</p>
       <ul>
         <li>Pick about <code>rate</code> of the positions at random.
         <code># TODO: sel = torch.rand(tokens.shape) &lt; rate</code></li>
         <li>Of the selected positions: 80% become <code>mask_id</code>, 10% a random token, 10% stay
         unchanged (BERT's 80/10/10 rule, Section 2.3).
         <code># TODO: draw r = torch.rand(...); apply the three branches</code></li>
         <li>Targets are the original tokens at selected positions, and a "ignore" index (-100)
         everywhere else, so the loss only scores the masked spots.</li>
       </ul>
       <p><b>Static vs dynamic is just WHEN you call this.</b> Static: call it once, cache the result,
       reuse every epoch. Dynamic: call it fresh inside the training loop every epoch. The CODE cell is
       the full reference and runs the ablation.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>RoBERTa keeps BERT's model untouched and changes only how it is trained. Walk through each
       recipe delta.</p>
       <ol>
         <li><b>Recall BERT's MLM objective (Section 2.3).</b> Take a sequence of tokens. Select a random
         15% of the positions. Of those selected positions, replace 80% with the special
         <code>[MASK]</code> token, replace 10% with a random vocabulary token, and leave 10% unchanged.
         The model must predict the <i>original</i> token at every selected position. The loss is the
         cross-entropy of those predictions &mdash; only at the selected positions; the rest are ignored.</li>
         <li><b>Static masking = mask once and reuse.</b> Original BERT, to save preprocessing, masks
         each sequence a single time before training and reuses that frozen pattern. To get a little
         variety it duplicates the data 10 times with 10 different masks, then trains 40 epochs &mdash;
         so each exact masking is still seen 4 times (Section 4.1).</li>
         <li><b>Dynamic masking = fresh mask every pass.</b> RoBERTa instead "generate[s] the masking
         pattern every time we feed a sequence to the model." The model rarely sees the same holes
         twice. Table 1 shows dynamic is comparable or slightly better &mdash; and it is simpler and
         essential once you train for very long (Section 4.1).</li>
         <li><b>Drop NSP, feed FULL-SENTENCES (Section 4.2).</b> BERT also trained NSP: pair two
         segments and predict whether B truly follows A. RoBERTa tests input formats and finds that
         packing inputs with contiguous full sentences and training MLM <i>alone</i> &mdash; no NSP head,
         no NSP loss &mdash; "matches or slightly improves downstream task performance" (Table 2). So NSP
         is removed.</li>
         <li><b>Bigger batches (Section 4.3).</b> BERT-large used batch size 256 for 1M steps. RoBERTa
         trains with much larger mini-batches (up to 8K sequences); Table 3 shows large batches improve
         the MLM perplexity (and end-task accuracy), with the learning rate retuned.</li>
         <li><b>More data, longer (Sections 3.2, 5).</b> 160GB of text (vs BERT's 16GB), trained for
         many more updates. "BERT was significantly undertrained" (abstract).</li>
       </ol>
       <p>None of these touches the attention or feed-forward math &mdash; that is the whole point. The
       model is BERT (<code>paper-bert</code>); only the training procedure changes.</p>`,

    architecture:
      `<p><b>The model is unchanged from BERT.</b> RoBERTa reuses the exact <b>BERT encoder</b> &mdash; a
       stack of bidirectional Transformer encoder layers, each layer being multi-head self-attention
       followed by a position-wise feed-forward block, with residual connections and layer normalization.
       Tokens enter as the sum of a token embedding and a position embedding; the final hidden state at a
       masked position is fed to a softmax over the vocabulary (the MLM head). The two sizes the paper uses
       are BERT's own (Section 3 / BERT paper):</p>
       <ul>
         <li><b>BERT-base</b>: $L=12$ layers, hidden $H=768$, $A=12$ attention heads, ~110M parameters
         (used for the masking and NSP ablations, Tables 1&ndash;2).</li>
         <li><b>BERT-large</b>: $L=24$ layers, hidden $H=1024$, $A=16$ attention heads, ~355M parameters
         (the final RoBERTa checkpoint, Section 5).</li>
       </ul>
       <p>The <b>MLM head</b> is the only output head &mdash; the BERT NSP classification head is deleted
       (Section 4.2). So architecturally RoBERTa = BERT encoder + MLM head, no NSP head.</p>
       <p><b>What actually changes is the pretraining recipe.</b> The contribution is this table of deltas:</p>
       <table style="border-collapse:collapse;width:100%">
         <tr><th style="text-align:left;border-bottom:1px solid #555;padding:4px">Knob</th>
             <th style="text-align:left;border-bottom:1px solid #555;padding:4px">BERT</th>
             <th style="text-align:left;border-bottom:1px solid #555;padding:4px">RoBERTa</th>
             <th style="text-align:left;border-bottom:1px solid #555;padding:4px">§</th></tr>
         <tr><td style="padding:4px">Masking</td><td style="padding:4px">static (mask once, 10&times; dup, 40 epochs)</td><td style="padding:4px">dynamic (fresh mask every pass)</td><td style="padding:4px">4.1</td></tr>
         <tr><td style="padding:4px">Input / NSP</td><td style="padding:4px">SEGMENT-PAIR + NSP loss</td><td style="padding:4px">FULL-SENTENCES, NSP removed</td><td style="padding:4px">4.2</td></tr>
         <tr><td style="padding:4px">Batch size</td><td style="padding:4px">256 sequences</td><td style="padding:4px">up to 8K sequences (LR retuned)</td><td style="padding:4px">4.3</td></tr>
         <tr><td style="padding:4px">Tokenizer</td><td style="padding:4px">30K character-level BPE / WordPiece</td><td style="padding:4px">50K byte-level BPE (no UNK)</td><td style="padding:4px">4.4</td></tr>
         <tr><td style="padding:4px">Data</td><td style="padding:4px">16GB (BookCorpus + Wikipedia)</td><td style="padding:4px">160GB (+ CC-News 76GB, OpenWebText 38GB, Stories 31GB)</td><td style="padding:4px">3.2</td></tr>
         <tr><td style="padding:4px">Training length</td><td style="padding:4px">1M steps @ batch 256</td><td style="padding:4px">up to 500K steps @ large batch</td><td style="padding:4px">5</td></tr>
       </table>
       <p>Rows are independent knobs the paper ablated one at a time (Tables 1&ndash;4); the rightmost
       column is the recipe that becomes "RoBERTa". The encoder itself is byte-for-byte BERT.</p>`,

    symbols: [
      { sym: "token", desc: "one unit of the input (a word or sub-word). MLM hides some tokens and asks the model to predict them." },
      { sym: "MLM", desc: "masked language modeling: the self-supervised task of predicting hidden (masked) tokens from their surrounding context." },
      { sym: "NSP", desc: "next-sentence prediction: BERT's secondary yes/no task asking whether sentence B followed sentence A. RoBERTa removes it." },
      { sym: "$[\\text{MASK}]$", desc: "a special token put in place of a hidden word, so the model knows a prediction is wanted at that position." },
      { sym: "static masking", desc: "choose which tokens to mask ONCE before training and reuse that frozen pattern (BERT's original scheme, Section 4.1)." },
      { sym: "dynamic masking", desc: "re-draw the masked positions fresh every time a sequence is fed to the model (RoBERTa's change, Section 4.1)." },
      { sym: "$p$", desc: "the masking rate: the fraction of positions selected for the MLM task. BERT/RoBERTa use $p=0.15$ (15%)." },
      { sym: "$M$", desc: "the set of selected (masked) positions in a sequence — the only positions the loss is computed on." },
      { sym: "$x$", desc: "the original token sequence; $x_i$ is the true token at position $i$." },
      { sym: "$\\hat x$", desc: "the corrupted input fed to the model: equal to $x$ except at positions in $M$, where tokens are replaced by $[\\text{MASK}]$ / a random token / left as-is per the 80/10/10 rule." },
      { sym: "$P_\\theta(\\cdot\\mid\\hat x)$", desc: "the model's predicted probability distribution over the vocabulary at a position, given the whole corrupted sequence $\\hat x$. $\\theta$ are the model weights." },
      { sym: "cross-entropy", desc: "the loss that measures how surprised the model is by the true token: $-\\log$ of the probability it assigned to that token. Smaller is better." },
      { sym: "perplexity", desc: "$e$ raised to the average MLM cross-entropy; an interpretable 'effective branching factor'. Lower = the model is less surprised. RoBERTa uses it in Table 3." },
      { sym: "batch size", desc: "the number of sequences processed before one weight update. BERT-large used 256; RoBERTa up to 8K (Section 4.3)." },
      { sym: "BPE", desc: "byte-pair encoding: a sub-word tokenizer that merges frequent character pairs. RoBERTa uses a 50K byte-level BPE that never needs an 'unknown' token (Section 4.4)." },
      { sym: "$\\mathcal{L}_{\\text{NSP}}$", desc: "BERT's next-sentence-prediction loss, $-\\log P_\\theta(\\text{IsNext}\\mid A,B)$ — a binary cross-entropy on whether segment B follows segment A. RoBERTa drops this term entirely (Section 4.2)." },
      { sym: "$A,B$", desc: "the two text segments paired in BERT's NSP task. RoBERTa instead packs contiguous FULL-SENTENCES and uses no pairing." },
      { sym: "$\\mathcal{L}_{\\text{BERT}}$", desc: "BERT's total pretraining loss, the sum $\\mathcal{L}_{\\text{MLM}}+\\mathcal{L}_{\\text{NSP}}$. RoBERTa minimizes only the first term." },
      { sym: "$M^{(e)}$", desc: "the masked set used at epoch $e$. Static keeps it fixed ($M^{(e)}=M$ for all $e$); dynamic re-samples it i.i.d. each epoch (Section 4.1)." },
      { sym: "$E$", desc: "the number of training epochs / passes over the data." },
      { sym: "$B$", desc: "the batch size in sequences. BERT-large used 256; RoBERTa up to 8K (Section 4.3). (Reused symbol: also denotes the second NSP segment in $A,B$.)" },
      { sym: "$|\\mathcal{V}|$", desc: "the vocabulary size of the tokenizer. RoBERTa's byte-level BPE uses $|\\mathcal{V}|=50\\text{K}$ (Section 4.4)." },
      { sym: "$L,H,A$", desc: "BERT encoder size: $L$ = number of Transformer layers, $H$ = hidden dimension, $A$ = number of attention heads (base: 12/768/12; large: 24/1024/16)." }
    ],

    formula:
      `<p><b>Honest framing.</b> RoBERTa is an <i>empirical replication / ablation study</i>, not a new-math
       paper. It introduces <b>no new equation</b>. The only objective is the masked-language-modeling
       (MLM) loss it <i>keeps</i> from BERT; its contribution is a training recipe, which we state below as
       precise design rules rather than as new formulas.</p>
       <p><b>(1) The kept objective &mdash; MLM cross-entropy</b> (Section 2.3, BERT's objective that
       RoBERTa retains):</p>
       $$\\mathcal{L}_{\\text{MLM}}(\\theta)=\\frac{1}{|M|}\\sum_{i\\in M}-\\log P_\\theta\\!\\left(x_i \\mid \\hat x\\right)$$
       <p>For every masked position $i$ in the masked set $M$, take the negative log of the probability the
       model assigns to the true token $x_i$ given the corrupted sequence $\\hat x$, and average over $M$.
       (Held-out quality is reported as perplexity $\\text{ppl}=\\exp(\\mathcal{L}_{\\text{MLM}})$, Table 3.)</p>
       <p><b>(2) The 80/10/10 corruption rule</b> that defines $\\hat x$ from $x$ (Section 2.3): select a
       fraction $p=0.15$ of positions to form $M$, then for each $i\\in M$,</p>
       $$\\hat x_i=\\begin{cases}[\\text{MASK}] & \\text{with prob. } 0.8\\\\ \\text{a random vocab token} & \\text{with prob. } 0.1\\\\ x_i\\ (\\text{unchanged}) & \\text{with prob. } 0.1\\end{cases}\\qquad \\hat x_j=x_j\\ \\text{for } j\\notin M$$
       <p><b>(3) Dynamic vs static masking</b> (Section 4.1) &mdash; the difference is <i>when</i> $M$ is
       drawn, stated precisely. Static draws one fixed $M$ shared across every epoch
       $e=1,\\dots,E$; dynamic draws an independent fresh $M^{(e)}$ at every pass:</p>
       $$\\text{static: } M^{(e)}=M\\ \\ \\forall e \\qquad\\text{vs}\\qquad \\text{dynamic: } M^{(e)}\\overset{\\text{i.i.d.}}{\\sim}\\text{Mask}(p)\\ \\ \\text{per epoch}$$
       <p><b>(4) Dropping the NSP loss</b> (Section 4.2). BERT minimized
       $\\mathcal{L}_{\\text{BERT}}=\\mathcal{L}_{\\text{MLM}}+\\mathcal{L}_{\\text{NSP}}$, where
       $\\mathcal{L}_{\\text{NSP}}=-\\log P_\\theta(\\text{IsNext}\\mid A,B)$ is a binary classification on
       whether segment $B$ follows $A$. RoBERTa <i>removes</i> the second term and packs FULL-SENTENCES:</p>
       $$\\mathcal{L}_{\\text{RoBERTa}}=\\mathcal{L}_{\\text{MLM}}\\quad(\\text{no }\\mathcal{L}_{\\text{NSP}})$$
       <p><b>(5) Scale knobs</b> stated as the recipe deltas (Sections 3.2, 4.3, 4.4): batch size
       $B$ raised from $256$ to $8\\text{K}$ sequences with the learning rate retuned; training data raised
       from $16\\,\\text{GB}\\to 160\\,\\text{GB}$; a byte-level byte-pair-encoding (BPE) tokenizer with
       $|\\mathcal{V}|=50\\text{K}$ that needs no "unknown" token. These are settings, not new math.</p>`,

    whatItDoes:
      `<p>This is the masked-language-modeling loss (the objective recapped in Section 2.3; RoBERTa keeps
       it and removes the separate NSP loss). In words: for every <b>masked</b> position $i$ (the set
       $M$), look at the model's predicted probability for the <i>true</i> token $x_i$ given the whole
       corrupted sentence $\\hat x$, take its negative log (the cross-entropy), and average over the
       masked positions. Minimizing it pushes the model to put high probability on the right hidden
       words. The crucial detail RoBERTa changes is not this formula &mdash; it is <b>which positions are
       in $M$</b> and <b>how often they change</b>: static (fixed $M$) versus dynamic (a fresh $M$ each
       pass).</p>`,

    derivation:
      `<p>The math owner is <code>mod-llm</code> (and <code>dl-cross-entropy</code> for the loss); we
       recap, not re-derive. The MLM objective is plain maximum likelihood on the hidden tokens: assume
       the true token at a masked spot was drawn from the model's distribution
       $P_\\theta(\\cdot\\mid\\hat x)$, and choose $\\theta$ to maximize the probability of the tokens we
       actually masked out. Maximizing that likelihood equals minimizing its negative log, which summed
       over the masked positions is exactly $\\mathcal{L}_{\\text{MLM}}$ above &mdash; the
       <b>cross-entropy</b> between the one-hot true token and the model's softmax. RoBERTa contributes
       no change to this derivation; its insight is empirical &mdash; how you <i>sample</i> $M$ (static
       vs dynamic) and how long/large you train change the solution you reach. See <code>mod-llm</code>
       for the language-model likelihood and <code>dl-cross-entropy</code> for the loss itself.</p>`,

    example:
      `<p><b>Worked numbers</b> for one tiny masked spot. Vocabulary of 4 tokens. At a masked position the
       model outputs logits (raw scores) $z=[2.0,\\,1.0,\\,0.0,\\,1.0]$ over the 4 tokens, and the true
       token is index 0. Plug into the kept MLM loss $\\mathcal{L}_{\\text{MLM}}=-\\log P_\\theta(x_i\\mid\\hat x)$
       (here $|M|=1$).</p>
       <table class="extable">
         <caption>Softmax of the logits: $P_k=e^{z_k}/\\sum_j e^{z_j}$, sum of $e^{z}=7.389+2.718+1.000+2.718=13.825$.</caption>
         <thead><tr><th>token $k$</th><th class="num">logit $z_k$</th><th class="num">$e^{z_k}$</th><th class="num">$P_k$</th></tr></thead>
         <tbody>
           <tr><td class="row-h">0 (true)</td><td class="num">$2.0$</td><td class="num">$7.389$</td><td class="num">$0.5345$</td></tr>
           <tr><td class="row-h">1</td><td class="num">$1.0$</td><td class="num">$2.718$</td><td class="num">$0.1966$</td></tr>
           <tr><td class="row-h">2</td><td class="num">$0.0$</td><td class="num">$1.000$</td><td class="num">$0.0723$</td></tr>
           <tr><td class="row-h">3</td><td class="num">$1.0$</td><td class="num">$2.718$</td><td class="num">$0.1966$</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li><b>Softmax</b> the logits (table above): $P=[0.5345,\\,0.1966,\\,0.0723,\\,0.1966]$, summing to $1$.</li>
         <li><b>Cross-entropy</b> at this spot $=-\\log P(\\text{token }0)=-\\log(0.5345)=0.6264$.</li>
         <li><b>MLM loss.</b> Only this token is masked, so $|M|=1$ and $\\mathcal{L}_{\\text{MLM}}=0.6264$.</li>
         <li><b>Perplexity</b> $=e^{\\mathcal{L}_{\\text{MLM}}}=e^{0.6264}=1.871$.</li>
       </ul>
       <p><b>Static vs dynamic, in one picture.</b> Take a 6-token sentence; $p=0.15$ selects $\\approx 1$
       position. Static freezes one masked position; dynamic re-draws a fresh one each epoch. Over 4 epochs
       the masked position $M^{(e)}$ is:</p>
       <table class="extable">
         <caption>Which position the loss trains on each epoch (static $M^{(e)}=M$; dynamic re-samples).</caption>
         <thead><tr><th>scheme</th><th class="num">epoch 1</th><th class="num">epoch 2</th><th class="num">epoch 3</th><th class="num">epoch 4</th><th>positions practised</th></tr></thead>
         <tbody>
           <tr><td class="row-h">static</td><td class="num">3</td><td class="num">3</td><td class="num">3</td><td class="num">3</td><td>only 3</td></tr>
           <tr><td class="row-h">dynamic</td><td class="num">3</td><td class="num">1</td><td class="num">5</td><td class="num">2</td><td>3, 1, 5, 2</td></tr>
         </tbody>
       </table>
       <p>Static gets very good at position 3's context but never practises predicting positions 1, 2, 4, 5, 6;
       dynamic practises many of them, so it generalizes a touch better. The CODE cell recomputes the
       cross-entropy above and runs the static-vs-dynamic training to show this small gap &mdash; our run, not
       the paper's number.</p>`,

    recipe:
      `<p><b>RoBERTa pretraining, as numbered steps (the deltas vs BERT in bold):</b></p>
       <ol>
         <li>Tokenize the corpus with a 50K <b>byte-level BPE</b> (Section 4.4) and pack inputs with
         contiguous <b>FULL-SENTENCES</b> &mdash; <b>no NSP pairing, no NSP head</b> (Section 4.2).</li>
         <li>Each training step, draw a fresh batch and apply <b>dynamic masking</b>: select 15% of
         positions, then 80% &rarr; <code>[MASK]</code> / 10% random / 10% unchanged (Sections 2.3, 4.1).</li>
         <li>Run the BERT encoder; at each masked position predict a distribution over the vocabulary.</li>
         <li>Compute the MLM cross-entropy $\\mathcal{L}_{\\text{MLM}}$ at the masked positions only;
         <b>do not add an NSP loss</b>.</li>
         <li>Update weights with a <b>large mini-batch</b> (up to 8K sequences) and a retuned learning
         rate (Section 4.3), for many steps on <b>160GB</b> of text (Sections 3.2, 5).</li>
       </ol>
       <p>Steps 3&ndash;4 are exactly BERT. The bold parts are RoBERTa.</p>`,

    results:
      `<p>All numbers below are <b>quoted from the paper</b> (arXiv:1907.11692, ar5iv mirror), not from
       memory:</p>
       <ul>
         <li><b>Static vs dynamic masking (Table 1).</b> Dynamic reaches SQuAD 2.0 F1 78.7 vs static 78.3,
         with comparable MNLI-m (84.0) and SST-2 (92.9) &mdash; "comparable or slightly better"
         (Section 4.1).</li>
         <li><b>Removing NSP (Table 2).</b> Going from segment-pair+NSP to a no-NSP full/doc-sentence
         format improves results, e.g. SQuAD 2.0 78.7 &rarr; 79.7 and RACE 64.2 &rarr; 65.6; the paper
         concludes "removing the NSP loss matches or slightly improves downstream task performance"
         (Section 4.2).</li>
         <li><b>Large batches (Table 3).</b> Going from batch 256 (1M steps) to batch 2K (125K steps)
         improves held-out MLM perplexity from 3.99 to 3.68 (Section 4.3).</li>
         <li><b>Final RoBERTa (abstract / Section 5).</b> State-of-the-art on GLUE (88.5 test average),
         SQuAD, and RACE (83.2% accuracy) &mdash; "can match or exceed the performance of every model
         published after [BERT]."</li>
       </ul>
       <p>The numbers in our CODE / CODEVIZ below are <i>our own small-scale run, not the paper's
       reported numbers.</i></p>`,

    evaluation:
      `<p><b>The metric &amp; baseline.</b> The training signal is the <b>MLM cross-entropy</b>
       $\\mathcal{L}_{\\text{MLM}}=\\frac{1}{|M|}\\sum_{i\\in M}-\\log P_\\theta(x_i\\mid\\hat x)$, reported
       as held-out loss or perplexity $\\text{ppl}=\\exp(\\mathcal{L}_{\\text{MLM}})$. The no-skill baseline
       is a uniform guess over the vocabulary: loss $-\\ln(1/|\\mathcal{V}|)=\\ln|\\mathcal{V}|$, i.e.
       perplexity $\\approx |\\mathcal{V}|$ (for the toy $|\\mathcal{V}|=20$, loss $\\approx 3.0$). At scale
       the paper's own anchors are downstream task scores: dynamic-masking SQuAD 2.0 F1 78.7 vs static 78.3
       (Table 1) and large-batch held-out MLM perplexity 3.68 at batch 2K vs 3.99 at batch 256 (Table 3).</p>
       <ul>
         <li><b>Sanity checks before the full run.</b> Verify the loss is computed <i>only</i> on masked
         positions (ignore index $-100$ everywhere else); if the model can see the answer the loss
         collapses unrealistically fast &mdash; a leakage tell. Reproduce the worked cross-entropy: logits
         $[2,1,0,1]$, true index 0 &rarr; softmax $\\approx[0.5345,0.1966,0.0723,0.1966]$, loss
         $\\approx 0.6264$, perplexity $\\approx 1.871$ (known-answer test). Check loss at init is near
         $\\ln|\\mathcal{V}|$ (random guessing). Overfit a single tiny batch and watch the masked-token
         loss drive toward $\\sim 0$. Confirm the masker actually applies 80/10/10 and that the head has
         no NSP output.</li>
         <li><b>Expected range.</b> On the toy run a correct build lands well under the $\\approx 3.0$
         random baseline (our run: static $\\approx 2.71$, dynamic $\\approx 2.55$ &mdash; our numbers,
         not the paper's). A loss stuck at $\\approx \\ln|\\mathcal{V}|$ means it is not learning; a loss
         near 0 on held-out data means leakage. The dynamic-minus-static gap is small and noisy at toy
         scale &mdash; treat its <i>sign</i>, not its size, as the signal (rule of thumb).</li>
         <li><b>Ablation &mdash; prove dynamic masking earns its keep.</b> The central knob this lesson
         introduces is <b>dynamic vs static masking</b>. Run both with everything else identical (same
         init, data, budget) and score on one fixed held-out mask: dynamic should reach the lower loss,
         matching Table 1's "comparable or slightly better" direction. If "dynamic" ties static exactly,
         you froze the RNG or cached the masked batch &mdash; it is secretly static. The second ablation:
         add back an NSP head/loss and confirm it does not help (Section 4.2, Table 2).</li>
         <li><b>Failure signals &amp; what they mean.</b> Held-out loss $\\approx \\ln|\\mathcal{V}|$ and
         flat &rarr; labels not aligned to masked positions, or loss averaged over all tokens. Loss
         near 0 on held-out but garbage predictions &rarr; the model is copying visible tokens (you masked
         100% with $[\\text{MASK}]$ and skipped the 10% random / 10% unchanged, or computed loss on
         unmasked spots). NaN loss &rarr; learning rate too high. Dynamic identical to static &rarr; the
         mask is not being re-drawn inside the loop.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track B (architecture).</b> RoBERTa adds no new primitive, so there is no
       <code>torch.allclose</code> oracle &mdash; the payoff is reproducing the paper's <i>qualitative
       effect</i>. We <b>import the plumbing</b>: a small Transformer encoder is built from
       <code>nn.TransformerEncoderLayer</code> / <code>nn.Embedding</code> / <code>nn.Linear</code>. We
       <b>implement by hand</b> only the parts RoBERTa actually changes: (1) the <b>masking function</b>
       with the 80/10/10 rule, (2) the choice of <b>static vs dynamic</b> masking (mask once and cache,
       vs re-mask every epoch), and (3) the <b>MLM-only head with no NSP</b>. We then train the same tiny
       model both ways on a small corpus and compare &mdash; the ablation. Batch size, 160GB of data, and
       the byte-level BPE tokenizer are scale knobs we do not reproduce.</p>`,

    pitfalls:
      `<ul>
         <li><b>Computing the loss everywhere, not just at masked spots.</b> The MLM loss is averaged
         over $M$ only. Use an ignore index (-100) for unmasked positions, or the model trivially copies
         the visible tokens and the loss is meaningless.</li>
         <li><b>"Dynamic" but accidentally fixed.</b> If you seed the RNG identically each epoch or cache
         the masked batch, your "dynamic" run is secretly static. Dynamic must re-draw $M$ <i>inside</i>
         the loop with fresh randomness.</li>
         <li><b>Skipping the 10% random / 10% unchanged.</b> Masking 100% of selected tokens with
         <code>[MASK]</code> creates a train/test mismatch (<code>[MASK]</code> never appears at
         fine-tuning time). The 80/10/10 split (Section 2.3) is part of the recipe &mdash; keep it.</li>
         <li><b>Thinking RoBERTa changed the architecture.</b> It did not. Same BERT encoder; only the
         training recipe differs. The gains are from data, length, batch size, dynamic masking, and
         dropping NSP.</li>
         <li><b>Over-reading a tiny run.</b> On a toy corpus the static-vs-dynamic gap is small and noisy;
         the paper's effect is at scale and over very long training. Our run shows the <i>direction</i>,
         not a benchmark.</li>
       </ul>`,

    recall: [
      "State the MLM loss $\\mathcal{L}_{\\text{MLM}}=\\frac{1}{|M|}\\sum_{i\\in M}-\\log P_\\theta(x_i\\mid\\hat x)$ and say which positions $M$ contains.",
      "Define static vs dynamic masking in one sentence each.",
      "What is the 80/10/10 rule, and why keep the 10% unchanged / 10% random?",
      "Name the four RoBERTa recipe changes and which one this lesson ablates.",
      "Did RoBERTa change BERT's architecture? What did it change instead?"
    ],

    practice: [
      {
        q: `At a masked position the model gives logits $[1.0, 3.0, 0.0]$ over a 3-token vocabulary and the true token is index 1. Compute the cross-entropy at this spot.`,
        steps: [
          { do: `Softmax: $e^{1}=2.718$, $e^{3}=20.086$, $e^{0}=1.000$; sum $=23.804$.`, why: `Turns logits into probabilities summing to 1.` },
          { do: `$P(\\text{token }1)=20.086/23.804=0.8438$.`, why: `The true token's predicted probability.` },
          { do: `Cross-entropy $=-\\log(0.8438)=0.1698$.`, why: `MLM loss at one masked spot is $-\\log P(\\text{true})$.` }
        ],
        answer: `About $0.170$. The model is fairly confident in the right token, so the surprise (loss) is small.`
      },
      {
        q: `ABLATION. You train the tiny masked-LM twice with everything equal except masking: run A masks the same positions every epoch (static), run B re-draws positions every epoch (dynamic). Predict which gives lower held-out masked-token loss, and explain why.`,
        steps: [
          { do: `Note static practises predicting only the few positions it froze; those other contexts are never trained.`, why: `The masked set $M$ never changes, so coverage of the sentence is narrow.` },
          { do: `Dynamic, over epochs, masks many different positions, so the model practises predicting from many contexts.`, why: `Fresh $M$ each pass = broader, less repetitive training signal.` },
          { do: `Expect dynamic to generalize a touch better on a held-out masking, matching Table 1's 'comparable or slightly better' (Section 4.1).`, why: `Less overfitting to one frozen pattern.` }
        ],
        answer: `Dynamic should reach a slightly lower held-out loss. The CODE/CODEVIZ run shows exactly this small gap — our small-scale run, not the paper's number. The paper's Table 1 reports the same direction (dynamic SQuAD F1 78.7 vs static 78.3).`
      },
      {
        q: `Removing NSP: you delete the next-sentence-prediction head and its loss, and instead pack inputs with contiguous full sentences. According to the paper, what happens to downstream performance, and what is the practical benefit?`,
        steps: [
          { do: `Recall Table 2: no-NSP full/doc-sentence formats match or beat segment-pair+NSP (e.g. SQuAD 78.7 → 79.7).`, why: `The paper's controlled comparison (Section 4.2).` },
          { do: `Conclude the NSP objective was not helping and can be dropped.`, why: `'Removing the NSP loss matches or slightly improves downstream task performance.'` },
          { do: `Benefit: a simpler objective (MLM only) and inputs that use full context, no wasted capacity on an easy/unhelpful task.`, why: `Less to train, no accuracy lost.` }
        ],
        answer: `Performance is matched or slightly improved, so NSP is removed. Practically: a simpler, MLM-only recipe with full-sentence inputs — fewer moving parts and at least as good (Section 4.2, Table 2).`
      }
    ]
  });

  window.CODE["paper-roberta"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build a tiny BERT-style masked-LM (an nn.TransformerEncoder + embedding + output head — NO NSP ` +
      `head, the RoBERTa choice). Implement BERT's 80/10/10 masking by hand. Then train the SAME model ` +
      `two ways — static masking (mask once, reuse every epoch) vs dynamic masking (re-mask every ` +
      `epoch, RoBERTa's change) — on a small toy corpus and print both held-out losses to reproduce the ` +
      `qualitative effect (dynamic >= static). Also recompute the worked cross-entropy example. Runs in ` +
      `Colab (torch is preinstalled). Numbers are our small run, not the paper's.`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F
torch.manual_seed(0)

# ---- worked example: cross-entropy at one masked spot (matches the lesson) ----
z = torch.tensor([2.0, 1.0, 0.0, 1.0])              # logits over a 4-token vocab
P = z.softmax(0)
print("softmax:", [round(x,4) for x in P.tolist()]) # ~[0.5345,0.1966,0.0723,0.1966]
ce = -torch.log(P[0])                               # true token = index 0
print("cross-entropy at this spot:", round(ce.item(),4),
      " perplexity:", round(torch.exp(ce).item(),4))  # ~0.6264, ~1.871

# ---- a tiny BERT-style masked-LM (MLM only — NO NSP head: the RoBERTa choice) ----
V, D, L, T = 20, 32, 16, 12   # vocab, model dim, seq len, sentences
MASK = V                      # special [MASK] id sits just past the vocab
PAD_IGNORE = -100             # loss ignores these positions

class TinyMLM(nn.Module):
    def __init__(self):
        super().__init__()
        self.emb = nn.Embedding(V + 1, D)           # +1 for [MASK]
        self.pos = nn.Parameter(torch.randn(L, D) * 0.02)
        enc = nn.TransformerEncoderLayer(D, nhead=4, dim_feedforward=64, batch_first=True)
        self.enc = nn.TransformerEncoder(enc, num_layers=2)
        self.head = nn.Linear(D, V)                 # predict over the V real tokens
    def forward(self, x):
        h = self.emb(x) + self.pos.unsqueeze(0)
        return self.head(self.enc(h))               # (B, L, V) logits — no NSP output

def mask_batch(tokens, rate=0.15):
    """BERT 80/10/10 masking (Section 2.3). Returns corrupted input + targets (-100 = ignore)."""
    x = tokens.clone()
    tgt = torch.full_like(tokens, PAD_IGNORE)
    sel = torch.rand(tokens.shape) < rate           # the masked set M
    tgt[sel] = tokens[sel]                           # score loss only on M
    r = torch.rand(tokens.shape)
    x[sel & (r < 0.8)] = MASK                                       # 80% -> [MASK]
    rand_pos = sel & (r >= 0.8) & (r < 0.9)
    x[rand_pos] = torch.randint(0, V, tokens.shape)[rand_pos]       # 10% -> random
    # remaining 10% (r >= 0.9) left unchanged
    return x, tgt

# fixed toy "corpus" and a held-out masking we score both runs on
corpus = torch.randint(0, V, (T, L))
torch.manual_seed(123); heldout_x, heldout_t = mask_batch(corpus)   # SAME eval mask for fairness

def held_out_loss(model):
    model.eval()
    with torch.no_grad():
        logits = model(heldout_x)
        return F.cross_entropy(logits.reshape(-1, V), heldout_t.reshape(-1),
                               ignore_index=PAD_IGNORE).item()

def train(dynamic, epochs=60):
    torch.manual_seed(7)                             # same init for both runs
    model = TinyMLM(); opt = torch.optim.Adam(model.parameters(), lr=3e-3)
    torch.manual_seed(1); static_x, static_t = mask_batch(corpus)  # STATIC: mask once, reuse
    for ep in range(epochs):
        model.train()
        if dynamic:
            x, t = mask_batch(corpus)                # DYNAMIC: fresh mask every epoch
        else:
            x, t = static_x, static_t                # STATIC: frozen pattern
        logits = model(x)
        loss = F.cross_entropy(logits.reshape(-1, V), t.reshape(-1), ignore_index=PAD_IGNORE)
        opt.zero_grad(); loss.backward(); opt.step()
    return held_out_loss(model)

static_loss  = train(dynamic=False)
dynamic_loss = train(dynamic=True)
print("held-out MLM loss  | static:", round(static_loss,4),
      " dynamic:", round(dynamic_loss,4))
print("dynamic better?", dynamic_loss < static_loss,
      "  (our small run, not the paper's number)")`
  };

  window.CODEVIZ["paper-roberta"] = {
    question: "Holding the tiny BERT-style masked-LM, the data, and the training budget all fixed, does RoBERTa's dynamic masking (fresh masks every epoch) reach a lower held-out masked-token loss than BERT's static masking (one frozen mask reused every epoch)?",
    charts: [
      {
        type: "bar",
        title: "Held-out MLM loss after equal training — dynamic masking edges out static (our toy run)",
        xlabel: "masking scheme",
        ylabel: "held-out masked-token cross-entropy (lower is better)",
        series: [
          {
            name: "held-out MLM loss",
            color: "#7ee787",
            points: [[0, 2.713], [1, 2.546]]
          }
        ]
      }
    ],
    caption: "Our small-scale run (torch, seed 7 for the model init; x-axis 0 = static, 1 = dynamic), NOT a number from the paper. The same 2-layer Transformer encoder is pretrained on the same 12-sentence toy corpus for 60 epochs, identical except for masking: static freezes one 80/10/10 mask and reuses it every epoch; dynamic re-draws a fresh mask each epoch (RoBERTa's change, Section 4.1). Both are scored on one fixed held-out masking for fairness. Dynamic reaches ~2.55 vs static ~2.71 — the same DIRECTION the paper reports in Table 1 (dynamic 'comparable or slightly better'), reproduced qualitatively on toy data. The gap is small and noisy at this scale; the paper's real effect is at 160GB and very long training.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F

V, D, L, T = 20, 32, 16, 12
MASK, PAD_IGNORE = V, -100

class TinyMLM(nn.Module):
    def __init__(self):
        super().__init__()
        self.emb = nn.Embedding(V + 1, D)
        self.pos = nn.Parameter(torch.randn(L, D) * 0.02)
        enc = nn.TransformerEncoderLayer(D, nhead=4, dim_feedforward=64, batch_first=True)
        self.enc = nn.TransformerEncoder(enc, num_layers=2)
        self.head = nn.Linear(D, V)
    def forward(self, x):
        return self.head(self.enc(self.emb(x) + self.pos.unsqueeze(0)))

def mask_batch(tokens, rate=0.15):
    x = tokens.clone(); tgt = torch.full_like(tokens, PAD_IGNORE)
    sel = torch.rand(tokens.shape) < rate
    tgt[sel] = tokens[sel]
    r = torch.rand(tokens.shape)
    x[sel & (r < 0.8)] = MASK
    rp = sel & (r >= 0.8) & (r < 0.9)
    x[rp] = torch.randint(0, V, tokens.shape)[rp]
    return x, tgt

corpus = (torch.manual_seed(0), torch.randint(0, V, (T, L)))[1]
torch.manual_seed(123); hx, ht = mask_batch(corpus)   # fixed eval mask

def held_out(m):
    m.eval()
    with torch.no_grad():
        return F.cross_entropy(m(hx).reshape(-1, V), ht.reshape(-1), ignore_index=PAD_IGNORE).item()

def run(dynamic, epochs=60):
    torch.manual_seed(7); m = TinyMLM(); opt = torch.optim.Adam(m.parameters(), lr=3e-3)
    torch.manual_seed(1); sx, st = mask_batch(corpus)
    for _ in range(epochs):
        m.train()
        x, t = mask_batch(corpus) if dynamic else (sx, st)
        loss = F.cross_entropy(m(x).reshape(-1, V), t.reshape(-1), ignore_index=PAD_IGNORE)
        opt.zero_grad(); loss.backward(); opt.step()
    return held_out(m)

print("static :", round(run(False), 3))   # ~2.713
print("dynamic:", round(run(True),  3))   # ~2.546`
  };
})();
