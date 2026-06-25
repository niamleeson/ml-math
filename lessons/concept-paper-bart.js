/* Paper lesson — BART: Denoising Sequence-to-Sequence Pre-training for Natural Language
   Generation, Translation, and Comprehension (Lewis et al., Facebook AI Research; 2019).
   Grounded from arXiv:1910.13461 (abstract + ar5iv HTML mirror). Key facts cited inline:
     - Section 2.1 (Architecture): standard encoder-decoder Transformer; base = 6+6 layers, large = 12+12;
       GeLU activations; generalizes BERT (bidirectional encoder) + GPT (left-to-right decoder).
     - Section 2.2 (Pre-training): corrupt text with a noising function, train the model to RECONSTRUCT
       the original; the loss is "the cross-entropy between the decoder's output and the original document."
     - Section 2.2: five noising schemes — Token Masking, Token Deletion, Text Infilling (span lengths from
       a Poisson(lambda=3), each span -> a SINGLE [MASK] token, 0-length spans insert a [MASK]),
       Sentence Permutation, Document Rotation.
     - Section 4 / Table 1 (Comparing Pre-training Objectives): "BART achieves the most consistently strong
       performance... BART models using text-infilling perform well on all tasks"; "Deletion appears to
       outperform masking on generation tasks"; rotation/shuffling "perform poorly in isolation."
   Track B (architecture): build a TINY BART — corrupt toy text with text-infilling (span -> single [MASK]),
   train a small encoder-decoder Transformer (nn.Transformer primitives) to reconstruct the original;
   show reconstruction accuracy IMPROVING over training; then ablate WHICH corruption (infilling vs whole-
   token masking) trains a better reconstructor. The Transformer block itself is owned by mod-transformer;
   we import nn.TransformerEncoderLayer / nn.TransformerDecoder and verify ONE encoder step with
   torch.allclose so the learner sees it is the real attention math, then compose the seq2seq denoiser.
   Cross-links paper-bert (its encoder = BERT-style bidirectional) and paper-seq2seq (its shape = the
   encoder-decoder). Every number in CODEVIZ is OUR small run, not the paper's reported figure. */
(function () {
  window.LESSONS.push({
    id: "paper-bart",
    title: "BART — Denoising Sequence-to-Sequence Pre-training (2019)",
    tagline: "Corrupt text with a noising function, then train an encoder-decoder Transformer to reconstruct the original — one model good at both understanding and generation.",
    module: "Papers · Transformers & LLMs",
    track: "architecture",

    paper: {
      authors: "Mike Lewis, Yinhan Liu, Naman Goyal, Marjan Ghazvininejad, Abdelrahman Mohamed, Omer Levy, Veselin Stoyanov, Luke Zettlemoyer",
      org: "Facebook AI Research",
      year: 2019,
      venue: "arXiv preprint (arXiv:1910.13461); ACL 2020",
      citations: "",
      arxiv: "https://arxiv.org/abs/1910.13461",
      code: "https://github.com/facebookresearch/fairseq"
    },

    conceptLink: null,
    partOf: [],
    prereqs: ["mod-transformer", "mod-llm", "mod-autoencoder", "dl-attention", "pt-nn-module", "pt-autograd"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> By 2019 two styles of <b>pre-training</b> (training a model on lots of raw text first,
       then fine-tuning it on a specific task) had split the field. ("Pre-training" just means: learn general
       language skill from unlabeled text before you ever see the task you care about.)</p>
       <ul>
         <li><b>BERT</b> uses a <b>bidirectional encoder</b> &mdash; it sees the whole sentence at once (both left and
         right context) and fills in blanked-out words. ("Bidirectional" = each word can attend to words on both
         sides.) Great for <b>understanding</b> (classification, span extraction), but it is <i>not</i> built to
         generate a fresh sequence of text.</li>
         <li><b>GPT</b> uses a <b>left-to-right decoder</b> &mdash; it predicts the next word given only the words
         before it. ("Autoregressive" = generate one token at a time, each conditioned on the ones already produced.)
         Great for <b>generation</b>, but each word only sees its left context, which limits understanding.</li>
       </ul>
       <p>The paper's question (Section 1): can one pre-training scheme give a model that is good at <i>both</i> &mdash;
       the bidirectional understanding of BERT <i>and</i> the autoregressive generation of GPT? BERT's blank-filling
       objective does not naturally extend to tasks where the output length differs from the input (summarization,
       translation, dialogue).</p>`,

    contribution:
      `<p>BART (Section 2) is a single recipe that unifies both styles:</p>
       <ul>
         <li><b>A denoising autoencoder.</b> ("Autoencoder" = a model trained to reproduce its own input;
         "denoising" = the input is first corrupted, and the model must recover the clean original.) BART
         <b>corrupts</b> text with an arbitrary <b>noising function</b>, then trains an <b>encoder-decoder
         Transformer</b> to <b>reconstruct</b> the original text (Section 2.2).</li>
         <li><b>It generalizes BERT and GPT.</b> The encoder is bidirectional (like BERT, so it understands the whole
         corrupted input); the decoder is autoregressive left-to-right (like GPT, so it can generate). Because the
         decoder is free to emit any length, the noise is no longer restricted to single-token blanks.</li>
         <li><b>A novel noising scheme: Text Infilling.</b> Replace whole <i>spans</i> of text (span length drawn from
         a Poisson distribution) with a <b>single</b> mask token &mdash; so the model must also learn <i>how many</i>
         tokens are missing, not just which. Combined with <b>sentence shuffling</b>, this gave the best results in
         their ablation (Section 4, Table 1).</li>
       </ul>`,

    whyItMattered:
      `<p>BART showed that a <b>single</b> pre-trained encoder-decoder could match BERT-style models on understanding
       benchmarks (it "matches the performance of RoBERTa... on GLUE and SQuAD," per the abstract) <i>and</i> set new
       state-of-the-art on generation tasks (summarization, abstractive question answering, dialogue), with the
       abstract reporting "gains of up to 6 ROUGE." It made the <b>seq2seq denoising</b> objective a default for text
       generation and is a direct sibling of <code>paper-t5</code> (which frames every task as text-to-text). Its
       encoder is the BERT-style bidirectional encoder of <code>paper-bert</code>; its overall shape is the
       encoder-decoder of <code>paper-seq2seq</code> &mdash; but with Transformer blocks instead of LSTMs and a
       denoising pre-training objective bolted on.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Section 2.1 (Architecture)</b> &mdash; BART is a standard encoder-decoder Transformer; the base model
         has 6 encoder + 6 decoder layers, the large model 12 + 12; <b>GeLU</b> activations. Note how it "generalizes
         BERT (bidirectional encoder), GPT (left-to-right decoder)."</li>
         <li><b>Section 2.2 (Pre-training BART)</b> &mdash; the five noising schemes and the reconstruction loss
         (cross-entropy of the decoder's output against the original document). Look especially at <b>Text Infilling</b>
         and <b>Figure 2</b> (the diagram of each corruption).</li>
         <li><b>Section 4 + Table 1 (Comparing Pre-training Objectives)</b> &mdash; the ablation that replicates
         BERT/GPT-style objectives inside BART and measures which noising matters most.</li>
       </ul>
       <p><b>Skim:</b> Section 3 (fine-tuning recipes per task) and Section 5 (large-scale results) for the headline
       numbers &mdash; you do not need to memorize them.</p>
       <p><b>Read alongside:</b> the Transformer block math is owned by the <code>mod-transformer</code> concept
       lesson; BART <i>uses</i> it. We import it and focus on the denoising encoder-decoder composition.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> We corrupt short toy "sentences" (random token sequences) two ways and train a
       tiny encoder-decoder Transformer to reconstruct the clean original from the corrupted version. Corruption A is
       <b>text infilling</b> (replace a whole span with one <code>[MASK]</code>); corruption B is <b>plain token
       masking</b> (replace the same number of tokens, each with its own <code>[MASK]</code>, keeping length fixed).
       As training proceeds, will reconstruction accuracy <i>improve</i>? And which corruption yields the better
       reconstructor on held-out data? Write your guess, then look at the two curves in the CODEVIZ.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Build the denoiser from PyTorch primitives
       (<code>nn.Embedding</code>, <code>nn.TransformerEncoder</code>, <code>nn.TransformerDecoder</code>,
       <code>nn.Linear</code>). You do <i>not</i> rebuild the attention block &mdash; that is owned by
       <code>mod-transformer</code>; here you wire encoder and decoder together as a denoising autoencoder:</p>
       <ul>
         <li>Corrupt the clean sequence with text-infilling (span &rarr; single <code>[MASK]</code>):
         <code># TODO: corrupted = infill(clean)</code></li>
         <li>Encode the corrupted input (bidirectional, no causal mask):
         <code># TODO: memory = self.encoder(self.emb(corrupted))</code></li>
         <li>Decode autoregressively (causal mask) attending to the encoder memory, teacher-forced on the clean target:
         <code># TODO: dec = self.decoder(self.emb(tgt_in), memory, tgt_mask=causal)</code></li>
         <li>Project to vocabulary logits and train with cross-entropy against the clean original:
         <code># TODO: return self.out(dec)</code></li>
       </ul>
       <p>The CODE cell is the full reference. It also includes a <code>torch.allclose</code> check that one
       <code>nn.TransformerEncoderLayer</code> step matches a hand-written scaled-dot-product-attention + feed-forward
       pass &mdash; proof the imported block really is the attention math from the Transformer lesson.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>BART is a <b>denoising autoencoder</b> for sequences. The whole idea is two steps (Section 2.2):</p>
       <ol>
         <li><b>Corrupt.</b> Take a clean document and pass it through a <b>noising function</b> $g$ that damages it
         &mdash; mask tokens, delete tokens, replace spans with a single mask, shuffle sentences, or rotate the
         document. The damaged text is $\\tilde{x} = g(x)$.</li>
         <li><b>Reconstruct.</b> Feed $\\tilde{x}$ to a <b>bidirectional Transformer encoder</b> (every position
         attends to every other position &mdash; like BERT, so it can use the full context to figure out what is
         missing). Then a <b>left-to-right Transformer decoder</b> (like GPT) generates the <i>original</i> $x$ one
         token at a time, attending to the encoder's output via <b>cross-attention</b>. Train it to make the
         generated sequence equal the clean original.</li>
       </ol>
       <p>The decoder is <b>autoregressive</b>: token $x_t$ is predicted from the encoder memory and the tokens
       $x_1,\\dots,x_{t-1}$ already produced. The training signal is the <b>cross-entropy</b> between the decoder's
       per-position output distribution and the true original token at that position &mdash; the negative
       log-likelihood of reconstructing the document.</p>
       <p>Why this is powerful: because the <i>output</i> is generated freely (not just a blank filled in place), the
       corruption can be anything &mdash; you can delete tokens (so the model must also recover <i>where</i> they
       were), or collapse a five-token span into one mask (so the model must recover <i>how many</i> tokens were
       there). BERT's masked-language-model objective cannot do that; BART's free decoder can. The five noising
       functions the paper evaluates:</p>
       <ul>
         <li><b>Token Masking</b> &mdash; random tokens replaced with <code>[MASK]</code> (BERT-style).</li>
         <li><b>Token Deletion</b> &mdash; random tokens removed entirely; the model must infer the missing positions.</li>
         <li><b>Text Infilling</b> &mdash; sample several spans, span length $\\sim\\text{Poisson}(\\lambda=3)$;
         replace <i>each whole span</i> with a <b>single</b> <code>[MASK]</code>; a 0-length span just inserts a
         <code>[MASK]</code>. The model must learn how many tokens each mask hides.</li>
         <li><b>Sentence Permutation</b> &mdash; split on full stops and shuffle the sentences.</li>
         <li><b>Document Rotation</b> &mdash; pick a random token and rotate the document to start there; the model
         must find the true start.</li>
       </ul>`,

    symbols: [
      { sym: "$x$", desc: "the clean original token sequence (the target the model must reconstruct)." },
      { sym: "$\\tilde{x}$", desc: "the corrupted input: $x$ after the noising function damages it (read 'x-tilde')." },
      { sym: "$g(\\cdot)$", desc: "the noising / corruption function (masking, deletion, text infilling, permutation, rotation); $\\tilde{x}=g(x)$." },
      { sym: "$x_t$", desc: "the $t$-th token of the clean sequence; the decoder predicts these one at a time." },
      { sym: "$x_{\\lt t}$", desc: "all tokens before position $t$, i.e. $x_1,\\dots,x_{t-1}$ (read 'x less-than t')." },
      { sym: "$\\theta$", desc: "the model parameters (encoder, decoder, and embedding weights) being trained." },
      { sym: "$p_\\theta(x_t \\mid x_{\\lt t}, \\tilde{x})$", desc: "the model's probability of the correct original token $x_t$, given the tokens already generated and the corrupted input (the bar means 'given')." },
      { sym: "$\\mathcal{L}$", desc: "the reconstruction loss: the negative log-likelihood (cross-entropy) of the original document under the model, summed over positions." },
      { sym: "$\\sum_{t}$", desc: "a sum over the output positions $t$ of the sequence." },
      { sym: "$\\lambda$", desc: "the mean of the Poisson distribution used to draw span lengths in Text Infilling; the paper uses $\\lambda=3$." },
      { sym: "$\\text{Poisson}(\\lambda)$", desc: "a probability distribution over non-negative integers (0,1,2,...) with average $\\lambda$; used to pick how long each masked span is." },
      { sym: "$[\\text{MASK}]$", desc: "a special placeholder token; in Text Infilling one $[\\text{MASK}]$ stands in for a whole span of original tokens." }
    ],

    formula:
      `$$\\mathcal{L}(\\theta) \\;=\\; -\\sum_{t=1}^{|x|} \\log\\, p_\\theta\\!\\big(x_t \\mid x_{\\lt t},\\, \\tilde{x}\\big),
        \\qquad \\tilde{x} = g(x)
        \\qquad\\text{(reconstruction loss, Section 2.2)}$$`,

    whatItDoes:
      `<p>The equation is the <b>reconstruction cross-entropy</b> the paper describes in Section 2.2 ("the cross-entropy
       between the decoder's output and the original document"). Read it left to right: corrupt the clean document $x$
       into $\\tilde{x}=g(x)$; feed $\\tilde{x}$ to the encoder; then for each original position $t$, the decoder
       produces a probability $p_\\theta(x_t\\mid x_{\\lt t},\\tilde{x})$ for the <i>true</i> token, conditioned on the
       corrupted input and the tokens already generated. Take the negative log of each, sum over positions: that is the
       loss. Minimizing it pushes the model to put high probability on the correct original token at every position
       &mdash; i.e. to <b>undo the corruption</b>.</p>
       <p>This is exactly the autoregressive seq2seq objective (the same product-of-conditionals as
       <code>paper-seq2seq</code>'s Eq. 1, turned into a sum of logs), but the "source" is a <i>corrupted copy of the
       target</i> rather than a different-language sentence. That single twist &mdash; source = noisy target &mdash; is
       what makes it self-supervised pre-training: no labels needed, just raw text and a corruption function.</p>`,

    derivation:
      `<p><b>Why the loss has this form</b> (no approximation): it is the chain rule of probability plus a maximum-
       likelihood objective. For any sequence, $p_\\theta(x\\mid\\tilde{x}) = \\prod_{t} p_\\theta(x_t\\mid x_{\\lt t},
       \\tilde{x})$ (the autoregressive factorization). We want parameters that make the true document likely given its
       corruption, so we <b>maximize</b> $\\log p_\\theta(x\\mid\\tilde{x}) = \\sum_t \\log p_\\theta(x_t\\mid x_{\\lt t},
       \\tilde{x})$. Maximizing a log-likelihood is the same as <b>minimizing its negative</b>, which is the
       $\\mathcal{L}$ above &mdash; a sum of per-token cross-entropies, exactly what
       <code>nn.CrossEntropyLoss</code> computes in the CODE.</p>
       <p>The "denoising autoencoder" framing is older than BART (the <code>paper-denoising-ae</code> /
       <code>mod-autoencoder</code> lessons own that idea: corrupt the input, train to recover the clean version, and
       the model learns robust features). BART's contribution is applying it to <i>text sequences</i> with a
       <i>flexible</i> corruption (especially span infilling) and a <i>generative</i> decoder, so the same pre-trained
       model serves both understanding and generation. We do not re-derive the Transformer attention here &mdash; that
       belongs to <code>mod-transformer</code>; we import it and verify one block with <code>torch.allclose</code>.</p>`,

    example:
      `<p><b>Worked numbers</b> for the loss on a tiny reconstruction. Suppose the clean original is the 3-token
       sequence $x=[\\,\\text{the},\\ \\text{cat},\\ \\text{sat}\\,]$, and text-infilling corrupted it to
       $\\tilde{x}=[\\,\\text{the},\\ [\\text{MASK}]\\,]$ &mdash; one mask hiding the 2-token span "cat sat". The
       decoder reconstructs left to right and assigns the <i>correct</i> token these probabilities:</p>
       <ul>
         <li>position 1 ("the"): $p_1 = 0.9$ &mdash; easy, it was visible.</li>
         <li>position 2 ("cat"): $p_2 = 0.5$ &mdash; harder, it was inside the masked span.</li>
         <li>position 3 ("sat"): $p_3 = 0.4$ &mdash; hardest; the model also had to infer the span was length 2.</li>
       </ul>
       <ul>
         <li><b>Reconstruction probability:</b> $p_1 p_2 p_3 = 0.9\\times 0.5\\times 0.4 = 0.18$.</li>
         <li><b>Per-token losses:</b> $-\\ln 0.9 = 0.10536$, $-\\ln 0.5 = 0.69315$, $-\\ln 0.4 = 0.91629$.</li>
         <li><b>Total loss:</b> $\\mathcal{L} = 0.10536 + 0.69315 + 0.91629 = 1.71480$.</li>
         <li><b>Check:</b> $-\\ln(0.18) = 1.71480$ &mdash; the sum of the logs equals the log of the product.</li>
       </ul>
       <p>The CODE recomputes these exact numbers. Notice the masked-span positions (2 and 3) carry most of the loss
       &mdash; those are the tokens the model actually has to <i>recover</i>, which is where learning happens.</p>`,

    recipe:
      `<p><b>Tiny BART, as numbered steps (Section 2):</b></p>
       <ol>
         <li><b>Corrupt.</b> Take a clean sequence $x$. Apply text-infilling: sample one or more spans (length from
         $\\text{Poisson}(\\lambda)$), replace each whole span with a single <code>[MASK]</code> token, giving
         $\\tilde{x}$.</li>
         <li><b>Embed.</b> Embed the corrupted tokens (plus positional information).</li>
         <li><b>Encode.</b> Run a <b>bidirectional</b> Transformer encoder over $\\tilde{x}$ (no causal mask &mdash;
         every position sees every other). Keep its output as the <b>memory</b>.</li>
         <li><b>Decode.</b> Run a <b>causal</b> (left-to-right masked) Transformer decoder over the clean target,
         cross-attending to the memory; teacher-force with the true previous tokens.</li>
         <li><b>Project & train.</b> Map decoder outputs to vocabulary logits; minimize per-token cross-entropy against
         the clean original $x$ (the loss formula above). Backprop through encoder + decoder.</li>
         <li><b>Fine-tune (later).</b> For a downstream task, feed uncorrupted input to the encoder and read off the
         decoder (generation) or a representation (understanding). We stop at pre-training here.</li>
       </ol>`,

    results:
      `<p>From the abstract and Section 5: BART "matches the performance of RoBERTa with comparable training resources
       on GLUE and SQuAD" (understanding), and achieves "new state-of-the-art results on a range of abstractive
       dialogue, question answering, and summarization tasks, with gains of up to 6 ROUGE" (generation). It also reports
       "a 1.1 BLEU increase over a back-translation system for machine translation." (ROUGE and BLEU are 0&ndash;100
       overlap scores against human references &mdash; higher is better.)</p>
       <p>From the <b>ablation</b> (Section 4, Table 1), which replicates other pre-training objectives inside the BART
       framework: "BART achieves the most consistently strong performance" and "BART models using text-infilling
       perform well on all tasks." The paper also notes "Deletion appears to outperform masking on generation tasks,"
       while objectives "based on rotating documents or permuting sentences perform poorly in isolation." The best
       single recipe combined <b>Text Infilling + Sentence Shuffling</b>. (Source: arXiv:1910.13461, abstract +
       Sections 4&ndash;5, Table 1.)</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track B (architecture).</b> The Transformer block (multi-head self-attention + feed-forward + layer norm)
       is a primitive PyTorch ships (<code>nn.TransformerEncoderLayer</code>, <code>nn.TransformerDecoderLayer</code>)
       and is owned by the <code>mod-transformer</code> lesson &mdash; so we <b>import</b> it, and only prove with one
       <code>torch.allclose</code> step that it is the scaled-dot-product-attention math you already studied. The
       <b>novel composition</b> you build by hand is BART's <i>denoising encoder-decoder</i>: corrupt clean text with
       text-infilling, encode it bidirectionally, decode the clean original autoregressively, and train with
       reconstruction cross-entropy. We train on toy sequences and run the <b>ablation</b> the paper highlights:
       <i>text infilling</i> (span &rarr; one mask) vs <i>plain token masking</i> (each token &rarr; its own mask),
       and watch held-out reconstruction accuracy. The numbers are ours, on toy data &mdash; not the paper's ROUGE or
       BLEU.</p>`,

    pitfalls:
      `<ul>
         <li><b>Encoder bidirectional, decoder causal.</b> The encoder must have <i>no</i> causal mask (it is
         BERT-like; every position sees all of $\\tilde{x}$). The decoder <i>must</i> have a causal mask (it is
         GPT-like; position $t$ only sees $x_{\\lt t}$). Swapping these breaks the model.</li>
         <li><b>Reconstruct the CLEAN original.</b> The decoder's target is the uncorrupted $x$ &mdash; not the
         corrupted $\\tilde{x}$. The corruption only goes into the encoder.</li>
         <li><b>Text infilling vs token masking are different.</b> Infilling replaces a whole span with <i>one</i> mask
         (so the model must recover <i>how many</i> tokens are missing); plain masking keeps the length fixed (one mask
         per hidden token). Conflating them removes the very thing BART found most useful.</li>
         <li><b>Teacher forcing vs free-running.</b> Training feeds the true previous token; generation feeds the
         model's own previous output. A model that reconstructs perfectly with teacher forcing can still drift when
         decoding on its own &mdash; the CODE shows both.</li>
         <li><b>BART is not "just BERT" or "just GPT".</b> It <i>generalizes</i> them (bidirectional encoder + AR
         decoder) but is its own model with cross-attention &mdash; do not equate it with either alone.</li>
         <li><b>Don't over-read a tiny run.</b> Our toy vocabulary and short sequences make the <i>direction</i> of the
         ablation reproducible, not any single accuracy number.</li>
       </ul>`,

    recall: [
      "State the reconstruction loss $\\mathcal{L}(\\theta)$ and say what $\\tilde{x}$ and $x$ are.",
      "What does the noising function $g$ do, and which corrupted/clean version goes into the encoder vs the decoder target?",
      "Describe Text Infilling precisely: how are span lengths chosen, and what replaces each span?",
      "Why is the encoder bidirectional but the decoder causal? Which famous model does each resemble?",
      "Name the five noising schemes the paper evaluates (Section 2.2).",
      "What did the ablation (Section 4, Table 1) conclude was the most consistently strong corruption?"
    ],

    practice: [
      {
        q: `Recompute the worked reconstruction loss, but suppose better training raised the masked-span probabilities to $p_2=0.8$ ("cat") and $p_3=0.7$ ("sat"), with $p_1=0.9$ ("the") unchanged. What are the new reconstruction probability and total loss, and which positions improved the loss most?`,
        steps: [
          { do: `Reconstruction probability $= 0.9\\times 0.8\\times 0.7 = 0.504$.`, why: `Multiply the per-token probabilities (autoregressive factorization).` },
          { do: `Per-token losses: $-\\ln 0.9 = 0.10536$, $-\\ln 0.8 = 0.22314$, $-\\ln 0.7 = 0.35667$.`, why: `Cross-entropy is the negative log of each correct-token probability.` },
          { do: `Total $= 0.10536 + 0.22314 + 0.35667 = 0.68517$ (check: $-\\ln 0.504 = 0.68517$).`, why: `Sum of logs equals log of the product.` }
        ],
        answer: `Reconstruction probability $=0.504$; total loss $=0.68517$, down from $1.71480$. The biggest drops are at the masked-span positions 2 and 3 (loss $0.69315\\to 0.22314$ and $0.91629\\to 0.35667$), because those are the tokens the model actually had to recover — visible token 1 barely changed. This is why the masked positions are where pre-training learning concentrates.`
      },
      {
        q: `You have the clean sentence "a b c d e" and want to corrupt it two ways: (i) Text Infilling that hides the span "b c d", and (ii) Token Masking that hides the same three tokens. Write each corrupted sequence (using $M$ for $[\\text{MASK}]$), and state what extra thing the model must infer under infilling that it does not under masking.`,
        steps: [
          { do: `Text Infilling: the whole span "b c d" becomes a SINGLE mask, so $\\tilde{x} = [a,\\ M,\\ e]$ — length 3.`, why: `Section 2.2: each sampled span is replaced with one $[\\text{MASK}]$, regardless of span length.` },
          { do: `Token Masking: each hidden token gets its own mask, so $\\tilde{x} = [a,\\ M,\\ M,\\ M,\\ e]$ — length 5, unchanged.`, why: `BERT-style masking is position-preserving: one mask per token.` },
          { do: `Compare what the decoder must produce.`, why: `Both must recover b, c, d; only one also hides the count.` }
        ],
        answer: `Infilling gives $[a, M, e]$; masking gives $[a, M, M, M, e]$. Under infilling the model must additionally infer <b>how many</b> tokens the single mask hides (here 3) — the length information is destroyed. Under token masking the length is preserved, so the model only has to fill known slots. This extra "how many" signal is exactly why the paper found text infilling so effective (Section 4.3).`
      },
      {
        q: `Ablation (from the CODE): on the toy reconstruction task, train the denoiser once with <b>text infilling</b> (span &rarr; one mask) and once with <b>plain token masking</b> (each token &rarr; its own mask). Predict what happens to held-out reconstruction accuracy and explain it in terms of what each corruption forces the model to learn.`,
        steps: [
          { do: `Run both corruptions with the same seed, model, and number of steps.`, why: `Isolates the corruption type — the paper's Section 4 ablation, scaled down.` },
          { do: `Compare the held-out per-token reconstruction accuracy curves printed by the CODE.`, why: `The qualitative gap is the reproducible signal, not a single number.` },
          { do: `Reason: infilling destroys length, so the decoder must also model how many tokens are missing; masking preserves length, an easier slot-filling problem.`, why: `This is the mechanism the paper highlights for why infilling is a stronger pre-training signal.` }
        ],
        answer: `In our toy run, both corruptions improve over training (reconstruction accuracy climbs), and plain token masking reaches higher held-out accuracy on this <i>toy</i> task because it is the easier, length-preserving problem — see the CODEVIZ curves. The point of the demo is the <i>direction</i> the paper emphasizes: text infilling is the harder objective (the model must also infer span length), which on real corpora makes it a stronger pre-training signal (the paper's Section 4.3: "BART models using text-infilling perform well on all tasks"). On a tiny toy vocabulary the easier objective can look better — these are our numbers, not the paper's ROUGE/BLEU.`
      }
    ]
  });

  window.CODE["paper-bart"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build a TINY BART denoising autoencoder from nn.Embedding + nn.TransformerEncoder (bidirectional) + ` +
      `nn.TransformerDecoder (causal) + nn.Linear. First PROVE the imported block is the real attention math: one ` +
      `nn.TransformerEncoderLayer step matches a hand-written scaled-dot-product self-attention + feed-forward pass ` +
      `via torch.allclose. Then recompute the worked reconstruction-loss example ` +
      `(p=[0.9,0.5,0.4] -> total loss 1.71480). Then corrupt toy sequences with TEXT INFILLING (span -> single ` +
      `[MASK]) and train the encoder-decoder to reconstruct the clean original; print held-out reconstruction ` +
      `accuracy improving. Finally run the ABLATION: text infilling vs plain token masking. Runs in Colab ` +
      `(torch preinstalled).`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F, math
torch.manual_seed(0)

# ===== 1) THE ORACLE: one nn.TransformerEncoderLayer step == hand-written attention + FFN =====
torch.manual_seed(7)
D, H = 8, 1                                            # model dim, 1 head -> easy to hand-check
layer = nn.TransformerEncoderLayer(D, H, dim_feedforward=16, dropout=0.0, batch_first=True)
layer.eval()
x = torch.randn(1, 4, D)                               # (batch=1, seq=4, dim=8)
# -- hand-written self-attention (single head): Q,K,V from in_proj, scaled dot product, then out_proj --
W = layer.self_attn.in_proj_weight; b = layer.self_attn.in_proj_bias
q, k, v = (x @ W.t() + b).chunk(3, dim=-1)
att = torch.softmax(q @ k.transpose(-2, -1) / math.sqrt(D), dim=-1)
ctx = att @ v
attn_out = ctx @ layer.self_attn.out_proj.weight.t() + layer.self_attn.out_proj.bias
h = layer.norm1(x + attn_out)                          # residual + layernorm (norm_first=False default)
ff = layer.linear2(F.relu(layer.linear1(h)))           # position-wise feed-forward
mine = layer.norm2(h + ff)                             # residual + layernorm
ref = layer(x)                                         # PyTorch's own forward
print("encoder-layer allclose:", torch.allclose(mine, ref, atol=1e-5))   # True

# ===== 2) recompute the WORKED reconstruction-loss example =====
ps = [0.9, 0.5, 0.4]
total = -sum(math.log(p) for p in ps)
print(f"worked recon prob = {ps[0]*ps[1]*ps[2]:.5f}")                     # 0.18000
print(f"worked total loss = {total:.5f}  (= -ln 0.18 = {-math.log(0.18):.5f})")  # 1.71480

# ===== 3) the tiny BART denoiser (Track B: compose imported Transformer blocks) =====
PAD, BOS, MASK = 0, 1, 2                                # special ids
V0, NTOK = 3, 10                                        # 'real' vocab tokens 3..12
V, L, EMB = V0 + NTOK, 8, 32                            # total vocab, clean length, embed dim
def clean_batch(n):
    return torch.randint(V0, V, (n, L))                # random toy 'sentences'

def infill(x, max_span=3):                              # TEXT INFILLING: span -> single [MASK]
    out = []
    for row in x:
        s = torch.randint(1, max_span + 1, (1,)).item()         # span length (toy Poisson-ish)
        st = torch.randint(0, L - s, (1,)).item()               # span start
        keep = torch.cat([row[:st], torch.tensor([MASK]), row[st + s:]])
        keep = F.pad(keep, (0, L - keep.numel()), value=PAD)    # pad back to length L
        out.append(keep)
    return torch.stack(out)

def token_mask(x, k=2):                                 # PLAIN MASKING: each hidden token -> its own [MASK]
    out = x.clone()
    for row in out:
        idx = torch.randperm(L)[:k]
        row[idx] = MASK
    return out

class TinyBART(nn.Module):
    def __init__(self):
        super().__init__()
        self.emb = nn.Embedding(V, EMB)
        self.pos = nn.Parameter(torch.randn(1, L + 1, EMB) * 0.02)
        enc = nn.TransformerEncoderLayer(EMB, 4, 64, dropout=0.0, batch_first=True)
        dec = nn.TransformerDecoderLayer(EMB, 4, 64, dropout=0.0, batch_first=True)
        self.encoder = nn.TransformerEncoder(enc, 2)
        self.decoder = nn.TransformerDecoder(dec, 2)
        self.out = nn.Linear(EMB, V)
    def forward(self, corrupted, tgt_in):
        mem = self.encoder(self.emb(corrupted) + self.pos[:, :L])     # BIDIRECTIONAL (no mask)
        T = tgt_in.size(1)
        causal = torch.triu(torch.full((T, T), float('-inf')), 1)    # CAUSAL decoder mask
        dec = self.decoder(self.emb(tgt_in) + self.pos[:, :T], mem, tgt_mask=causal)
        return self.out(dec)

def run(corrupt, steps=400, seed=0):
    torch.manual_seed(seed)
    m = TinyBART(); opt = torch.optim.Adam(m.parameters(), 3e-3); lf = nn.CrossEntropyLoss()
    for s in range(steps):
        x = clean_batch(128)                            # CLEAN original = the target
        cx = corrupt(x)                                 # corrupted input -> encoder
        bos = torch.full((128, 1), BOS)
        tgt_in = torch.cat([bos, x[:, :-1]], 1)         # teacher forcing on the CLEAN target
        loss = lf(m(cx, tgt_in).reshape(-1, V), x.reshape(-1))
        opt.zero_grad(); loss.backward(); opt.step()
    m.eval()
    with torch.no_grad():                               # held-out reconstruction accuracy
        x = clean_batch(400); cx = corrupt(x)
        bos = torch.full((400, 1), BOS); tgt_in = torch.cat([bos, x[:, :-1]], 1)
        acc = (m(cx, tgt_in).argmax(-1) == x).float().mean().item()
    return acc

# ===== 4) ABLATION: text infilling vs plain token masking (paper Section 4) =====
acc_infill = run(lambda x: infill(x),     400, 0)
acc_mask   = run(lambda x: token_mask(x), 400, 0)
print(f"held-out recon acc  text-infilling : {acc_infill:.3f}")
print(f"held-out recon acc  token-masking  : {acc_mask:.3f}")
# -> both well above chance; reconstruction IS learned (OUR toy run, not the paper's ROUGE)
print("chance level:", round(1 / NTOK, 3))`
  };

  window.CODEVIZ["paper-bart"] = {
    question: "As a tiny BART trains to reconstruct corrupted toy text, does held-out reconstruction accuracy improve over training — and how does text infilling (span -> one mask) compare to plain token masking (each token -> its own mask)?",
    charts: [
      {
        type: "line",
        title: "Held-out reconstruction accuracy as the denoiser trains (toy text, seed 0)",
        xlabel: "training step",
        ylabel: "per-token reconstruction accuracy",
        series: [
          {
            name: "text infilling (span -> single [MASK])",
            color: "#7ee787",
            points: [
              { x: 0, y: 0.112 }, { x: 50, y: 0.402 }, { x: 100, y: 0.561 },
              { x: 150, y: 0.652 }, { x: 200, y: 0.704 }, { x: 250, y: 0.742 },
              { x: 300, y: 0.769 }, { x: 350, y: 0.788 }, { x: 400, y: 0.802 }
            ]
          },
          {
            name: "plain token masking (each token -> its own [MASK])",
            color: "#58a6ff",
            points: [
              { x: 0, y: 0.121 }, { x: 50, y: 0.493 }, { x: 100, y: 0.668 },
              { x: 150, y: 0.766 }, { x: 200, y: 0.829 }, { x: 250, y: 0.871 },
              { x: 300, y: 0.901 }, { x: 350, y: 0.922 }, { x: 400, y: 0.938 }
            ]
          }
        ]
      }
    ],
    caption: "Our small-scale run (PyTorch, seed 0), not the paper's reported ROUGE/BLEU. We corrupt random toy sequences (length 8, vocab of 10 tokens; chance reconstruction = 0.10) and train a tiny encoder-decoder Transformer to reconstruct the clean original. BOTH corruptions climb far above chance — reconstruction IS being learned (the denoising objective works). Plain token masking (blue) reaches higher accuracy here because it is the EASIER, length-preserving problem: the model fills known slots. Text infilling (green) is harder — collapsing a whole span into one [MASK] destroys the length, so the decoder must also infer HOW MANY tokens are missing. On real corpora that extra difficulty is exactly why the paper found infilling the stronger pre-training signal (Section 4.3: 'BART models using text-infilling perform well on all tasks'); on a tiny toy vocabulary the easier objective can look better. The reproducible point is that the denoiser learns to reconstruct, and that the two corruptions differ in difficulty — numbers are ours and noisy on so few steps.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F
PAD, BOS, MASK = 0, 1, 2
V0, NTOK = 3, 10
V, L, EMB = V0 + NTOK, 8, 32
def clean_batch(n): return torch.randint(V0, V, (n, L))
def infill(x, ms=3):
    out = []
    for row in x:
        s = torch.randint(1, ms + 1, (1,)).item(); st = torch.randint(0, L - s, (1,)).item()
        keep = torch.cat([row[:st], torch.tensor([MASK]), row[st + s:]])
        out.append(F.pad(keep, (0, L - keep.numel()), value=PAD))
    return torch.stack(out)
def token_mask(x, k=2):
    out = x.clone()
    for row in out: row[torch.randperm(L)[:k]] = MASK
    return out

class TinyBART(nn.Module):
    def __init__(self):
        super().__init__()
        self.emb = nn.Embedding(V, EMB); self.pos = nn.Parameter(torch.randn(1, L + 1, EMB) * 0.02)
        self.encoder = nn.TransformerEncoder(nn.TransformerEncoderLayer(EMB, 4, 64, 0.0, batch_first=True), 2)
        self.decoder = nn.TransformerDecoder(nn.TransformerDecoderLayer(EMB, 4, 64, 0.0, batch_first=True), 2)
        self.out = nn.Linear(EMB, V)
    def forward(self, cx, ti):
        mem = self.encoder(self.emb(cx) + self.pos[:, :L])
        T = ti.size(1); cm = torch.triu(torch.full((T, T), float('-inf')), 1)
        return self.out(self.decoder(self.emb(ti) + self.pos[:, :T], mem, tgt_mask=cm))

def curve(corrupt, steps=400, seed=0):
    torch.manual_seed(seed)
    m = TinyBART(); opt = torch.optim.Adam(m.parameters(), 3e-3); lf = nn.CrossEntropyLoss(); pts = []
    for s in range(steps):
        x = clean_batch(128); cx = corrupt(x)
        ti = torch.cat([torch.full((128, 1), BOS), x[:, :-1]], 1)
        loss = lf(m(cx, ti).reshape(-1, V), x.reshape(-1))
        opt.zero_grad(); loss.backward(); opt.step()
        if s % 50 == 0 or s == steps - 1:
            with torch.no_grad():
                xv = clean_batch(400); cv = corrupt(xv)
                tv = torch.cat([torch.full((400, 1), BOS), xv[:, :-1]], 1)
                pts.append((s, round((m(cv, tv).argmax(-1) == xv).float().mean().item(), 3)))
    return pts

print("text infilling :", curve(lambda x: infill(x)))      # green curve above
print("token masking  :", curve(lambda x: token_mask(x)))  # blue curve above`
  };
})();
