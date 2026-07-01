# Part 8 — Sequence Models & NLP

> Plan only — per-topic revamp plan. See ../00-MASTER-PLAN.md for the shared design & family registry (F1–F17).
> **Code style:** every notebook code cell is written one statement per line (newline-split, blank lines between logical groups) for readability — never dense, semicolon-packed one-liners. See ../00-MASTER-PLAN.md §B.4.
> Dominant family: F7 (Sequence/NLP).

### 8.1 — Text preprocessing & normalization   [notebook: 8.1-text-preprocessing.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Search indexing — collapse `Café/CAFÉ/cafe` to one term; lesson toy re-derives 3 raw variants → 1 canonical token.
2. Sentiment moderation — preserve negation in reviews; lesson pitfall: deleting `not/no/never` can flip a 2-token phrase such as `not good`.
3. Entity analytics — keep case for `US` versus `us`; lesson pitfall: casefolding merges 2 classes the task may need separate.
4. Price/product extraction — keep digits and symbols; lesson pitfall: strict punctuation policy can erase the token `5000` (1 numeric fact lost).
5. Unicode-safe deduplication — apply NFC before counting; lesson pitfall: 2 visually identical strings can split counts without normalization.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `normalize(text, policy)` implements $n:\Sigma^*\to\Sigma^*$ and verifies the lesson toy `Café CAFÉ cafe!` collapses 3 variants to `cafe cafe cafe`.
- Datasets D1–D5: D1 lesson café toy · D2 5 clean queries with case/accent variants · D3 +negation/case/digits that must be protected · D4 tiny inline support-ticket titles · D5 longer mixed-language/product strings.
- Metric: normalization accuracy against expected canonical forms.
- Closing viz: (a) token-equivalence/alignment heatmap panels  (b) accuracy-vs-policy-complexity curve.
- Pitfall on D5: reproduce over-normalization (`US`, `not`, `5000` lost), then fix with field-aware preserve rules.
- Notes: delete dead template helpers; CPU-only, tiny; no lesson/notebook downloads.

### 8.2 — Edit distance & string algorithms   [notebook: 8.2-edit-distance.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Spell-correct search — tolerate `color/colour`; illustrative radius 2 accepts 1 insertion plus 1 nearby edit.
2. Customer-name matching — reject unsafe near misses; lesson warning: `colon` is 1 edit from `color` but semantically unrelated.
3. OCR cleanup — audit character edits; lesson DP gives one-letter `cat→cut` final distance 1 under unit substitution.
4. Autocomplete ranking — tune thresholds by domain; lesson pitfall: universal radius 2 can help search but harm entities.
5. DNA/protein toy alignment — use insertion/deletion boundaries; lesson requires $D_{i,0}=i$, so a length-4 prefix costs 4 deletions.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `edit_distance(a,b,costs)` fills the DP recurrence and verifies `cat→cut` distance 1 plus boundary row $D_{i,0}=i$.
- Datasets D1–D5: D1 lesson `cat/cut` · D2 5 clean typo pairs · D3 +accent/case/threshold conflicts · D4 tiny inline search-query dictionary · D5 longer entity names with misleading near matches.
- Metric: match accuracy at a chosen edit threshold.
- Closing viz: (a) DP/alignment heatmap panels  (b) accuracy-vs-string-length/threshold curve.
- Pitfall on D5: reproduce semantic false matches such as near-spelled entities, then fix with normalization plus domain-specific thresholds.
- Notes: keep the edit-distance helper because it is the concept; delete unrelated dead helpers; CPU-only, tiny.

### 8.3 — Tokenization (BPE, WordPiece, SentencePiece)   [notebook: 8.3-tokenization.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. LLM serving — trade vocabulary for context length; lesson toy: `lowest` becomes 2 subwords instead of 1 unknown.
2. Search logs — BPE merge audit; lesson toy has several adjacent pairs with count 2, so tie-breaking changes token ids.
3. Multilingual products — avoid word-level unknowns; illustrative: 5 unseen forms can still be segmented into known pieces.
4. Detokenization — preserve continuation markers; lesson pitfall: dropping `##` loses 1 boundary signal per continuation piece.
5. Cost estimation — measure sequence length; lesson toy merge reduces a word from 4 to 3 positions (25% fewer positions).

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `train_bpe(corpus, merges)` chooses $(x^*,y^*)=\arg\max$ pair count and verifies the lesson corpus `low/lower/newest/widest` count-2 merge behavior.
- Datasets D1–D5: D1 lesson BPE words · D2 5 clean invented words · D3 +tie-breaking/unknown morphology · D4 tiny inline product/search corpus · D5 longer multilingual-looking strings.
- Metric: average tokens per word.
- Closing viz: (a) token-boundary/alignment heatmap panels  (b) token-length-vs-vocab/complexity curve.
- Pitfall on D5: reproduce train/serve vocabulary mismatch and missing continuation markers, then fix by freezing vocab and explicit markers.
- Notes: delete unused edit_distance/helpers; CPU-only, tiny; no pretrained tokenizer downloads.

### 8.4 — Bag-of-words & TF-IDF   [notebook: 8.4-bow-tfidf.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Document search — rank by TF-IDF cosine; lesson toy vocabulary has 5 axes: `[ate, cat, dog, fish, sat]`.
2. Ticket routing — fixed vocabulary serving; lesson vector `[0,1,0,0,1]` means `cat sat` only under that 5-term order.
3. Spam filtering — downweight common words; lesson IDF smoothing uses `1+N` and `1+df` over 3 documents.
4. Legal discovery — long documents need TF normalization; illustrative: a 1000-token document should not win only for length.
5. Sentiment baseline — order loss is visible; lesson pitfall: BoW has no slot for negation position in a 2-word phrase.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `tfidf_matrix(docs)` implements $w_{d,t}=tf_{d,t}(\log((1+N)/(1+df_t))+1)$ and verifies the lesson 3-doc, 5-vocabulary matrix.
- Datasets D1–D5: D1 lesson `cat sat` corpus · D2 5 clean topic docs · D3 +negation/order collisions · D4 tiny inline news snippets · D5 longer mixed-topic documents.
- Metric: retrieval/classification accuracy.
- Closing viz: (a) document-term heatmap panels  (b) accuracy-vs-document-length/overlap curve.
- Pitfall on D5: reproduce vocabulary mismatch and order-blind negation, then fix with frozen vocab plus bigram features.
- Notes: delete unused edit_distance/helpers; CPU-only, tiny; no large corpus downloads.

### 8.5 — n-gram language models   [notebook: 8.5-ngram-language-models.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Keyboard prediction — estimate next tokens from counts; lesson corpus `a b a b a c` gives unigram counts `[3,2,1]` over 6 tokens.
2. Query suggestion — condition on row sums; lesson pitfall: divide by $\sum_v c(h,v)$, not total corpus length 6.
3. ASR fallback rescoring — smooth unseen transitions; lesson formula uses add-$\alpha$, with $\alpha=1$ for add-one.
4. Synthetic text QA — expose greedy loops; lesson greedy path `a,b,a,b,a` has 5 tokens but is not typical sampling.
5. Tokenizer comparison — perplexity audit; lesson pitfall: word vs subword models have different event spaces, so raw PPL is not comparable.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `ngram_lm(tokens,n,alpha)` computes $P(w\mid h)$ and verifies the lesson `a b a b a c` counts `[3,2,1]`.
- Datasets D1–D5: D1 lesson 6-token corpus · D2 5 clean short sequences · D3 +unseen transitions/sparse rows · D4 tiny inline headlines · D5 longer domain-shifted sequences.
- Metric: perplexity.
- Closing viz: (a) transition-probability heatmap panels  (b) perplexity-vs-sequence-complexity curve.
- Pitfall on D5: reproduce zero-probability sentence without smoothing, then fix with add-$\alpha$ and tokenizer-consistent evaluation.
- Notes: delete unused edit_distance/helpers; CPU-only, tiny.

### 8.6 — Word embeddings (Word2Vec, GloVe, FastText)   [notebook: 8.6-word-embeddings.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Semantic search — compare vectors by cosine; lesson pitfall: cosine reflects training context, not guaranteed truth.
2. Analogy demos — audit offsets; lesson toy offset `[2,3]` works in a 2D plane but may fail in real spaces.
3. Rare-word handling — use subword overlap; lesson FastText-style evidence has overlaps 0.5 and 0.4 for related forms.
4. Bias monitoring — inspect vector neighborhoods; illustrative: top-5 nearest neighbors can reveal frequency or stereotype artifacts.
5. Recommendation tags — compress sparse terms; lesson count matrix row sums include 10 co-occurrences for `king`.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `cooc_to_svd_embeddings(corpus)` builds a tiny co-occurrence/PPMI matrix and verifies lesson-style cosine/offset calculations for `king/queen/man/woman`.
- Datasets D1–D5: D1 lesson royal-word toy · D2 5 clean analogy pairs · D3 +polysemy/frequency/morphology · D4 tiny inline category corpus · D5 longer biased/rare-word corpus.
- Metric: nearest-neighbor/analogy accuracy.
- Closing viz: (a) embedding-similarity heatmap panels  (b) accuracy-vs-vocabulary-noise curve.
- Pitfall on D5: reproduce raw-dot-product frequency domination and over-sold analogies, then fix with cosine normalization and subword features.
- Notes: simulate embeddings with counts/SVD only; delete unused helpers; CPU-only, tiny.

### 8.7 — Recurrent Neural Networks   [notebook: 8.7-rnn.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Sensor-event classification — carry running state; lesson toy updates `[1,0,1,1]` to final $h_4=0.8281545644800706$.
2. Autocomplete — produce intermediate outputs; lesson pitfall: final-state classifiers and next-token models use different states.
3. Fraud sequences — parameter sharing generalizes length; lesson count grows from 3 shared parameters to 18 if length 6 has separate weights.
4. Long-note triage — expose vanishing memory; lesson powers $0.2^{20}$ and $0.5^{20}$ show old evidence decay.
5. Clickstream modeling — align shifted targets; lesson pitfall: predictions `[1,0,...]` can be evaluated against wrong time steps.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `simple_rnn(xs, params)` implements $h_t=\tanh(W_{hh}h_{t-1}+W_{xh}x_t+b)$ and verifies the lesson final $h_4=0.8281545644800706$.
- Datasets D1–D5: D1 lesson binary sequence · D2 5 clean pattern sequences · D3 +long gaps/noise · D4 tiny inline click sequences · D5 longer delayed-dependency sequences.
- Metric: sequence classification accuracy.
- Closing viz: (a) hidden-state/time alignment heatmap panels  (b) accuracy-vs-dependency-length curve.
- Pitfall on D5: reproduce vanishing memory on long dependencies, then fix with shorter dependency features or gated-cell comparison.
- Notes: delete dead template helpers; CPU-only, tiny; no GPU training.

### 8.8 — LSTM   [notebook: 8.8-lstm.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Medical-note sequence flags — preserve long evidence; lesson forget gates `[0,0.5,1]` keep old cell value 2 as `[0,1,2]`.
2. Finance time-event text — separate storage from exposure; lesson: substantial cell can coexist with small hidden output.
3. Chat intent memory — gate writes; lesson candidate write uses $\tanh(2.0)=0.9640275800758169$, not raw 2.0.
4. Log anomaly detection — initialize forget bias safely; lesson pitfall: low $f_t$ destroys long-range information early.
5. Embedded NLP — inspect saturated gates; illustrative: gates near 0 or 1 make decisions but slow learning.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `lstm_step(x,h,c,gates)` implements $c_t=f_t\odot c_{t-1}+i_t\odot\tilde c_t$ and verifies keeping `c=2` with gates `[0,0.5,1]` gives `[0,1,2]`.
- Datasets D1–D5: D1 lesson gate toy · D2 5 clean memory sequences · D3 +distractor writes · D4 tiny inline dialogue-slot sequences · D5 longer delayed-trigger sequences.
- Metric: sequence classification accuracy.
- Closing viz: (a) gate/cell-state heatmap panels  (b) accuracy-vs-delay curve.
- Pitfall on D5: reproduce hidden-state-as-memory confusion and low forget-gate loss, then fix by plotting `c_t` separately and biasing keep gates.
- Notes: delete unused helpers; CPU-only, tiny.

### 8.9 — GRU   [notebook: 8.9-gru.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Mobile keyboard models — compact gating; lesson update interpolation from old 2 to candidate -1 changes as z moves 0→1.
2. Event stream classification — preserve state; lesson $0.95^{30}$ path shows long retention when update stays small.
3. Dialogue intent tracking — reset before candidate; lesson pitfall: reset gate changes $\tilde h_t$, not final interpolation directly.
4. IoT text logs — fewer parameters than LSTM; illustrative: 2-gate cell reduces gate matrices versus 3-gate LSTM.
5. Sequence ablations — compare by task evidence; lesson pitfall: fewer gates are not always worse.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `gru_step(x,h,z,r)` implements $h_t=(1-z)h_{old}+z\tilde h$ and verifies lesson interpolation for $h_{old}=2$, $\tilde h=-1$, $z=[0,.25,.5,.75,1]`.
- Datasets D1–D5: D1 lesson interpolation toy · D2 5 clean update/keep sequences · D3 +reset-needed distractors · D4 tiny inline click/dialogue sequences · D5 longer sparse-update sequences.
- Metric: sequence classification accuracy.
- Closing viz: (a) update/reset gate heatmap panels  (b) accuracy-vs-delay/noise curve.
- Pitfall on D5: reproduce flipped update-gate interpretation, then fix by explicitly matching the lesson convention in plots and code.
- Notes: delete unused helpers; CPU-only, tiny.

### 8.10 — Sequence-to-sequence (encoder–decoder)   [notebook: 8.10-seq2seq.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Toy translation — condition each target token on encoded source; lesson factors $P(y_{1:T}\mid x_{1:S})$ as a product over T steps.
2. Query rewriting — handle unequal lengths; lesson pitfall: reverse toy length 3 is special, real outputs need not match source length.
3. Summarization — decoder must decide EOS; illustrative: fixed 4-step decoding can overrun or truncate a summary.
4. Data-to-text — avoid exposure bias; lesson shows $0.9^{10}=0.3486784401000001$ after ten per-token decisions.
5. Code transduction — align decoder inputs; lesson pitfall: teacher forcing predicts next token with a one-position shift.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `seq2seq_table_translate(src)` uses an encoder state and autoregressive decoder, verifying the lesson source `[2,1,3]` recurrence values and product factorization.
- Datasets D1–D5: D1 lesson short sequence/reverse · D2 5 clean copy/reverse pairs · D3 +unequal lengths/reordering · D4 tiny inline paraphrase/command pairs · D5 longer inputs with delayed EOS.
- Metric: exact-sequence accuracy.
- Closing viz: (a) source-target alignment heatmap panels  (b) accuracy-vs-output-length curve.
- Pitfall on D5: reproduce single-vector bottleneck/exposure-bias degradation, then fix with attention-style lookup and teacher-forcing alignment checks.
- Notes: delete unused edit_distance/helpers; CPU-only, tiny.

### 8.11 — Attention mechanism   [notebook: 8.11-attention.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Translation alignment — attend from target words to source words; illustrative: 3 target steps × 4 source tokens = 12 weights to inspect.
2. Document QA — point a question token at evidence tokens; illustrative: top attention row can be normalized to sum 1.
3. Summarization — weight salient sentences; illustrative: 5 sentences can produce a 5-column attention distribution per summary token.
4. Speech/text alignment — soft-align frames to symbols; illustrative: 4 output symbols × 6 frames = 24 alignment cells.
5. Recommendation/session NLP — attend over recent actions; illustrative: 10 prior events can be reduced to one context vector by 10 weights.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `attention(q,K,V)` computes softmax-normalized scores and verifies on a tiny illustrative row that weights sum to 1; lesson content is currently empty, so numbers must be marked illustrative until authored.
- Datasets D1–D5: D1 illustrative query-key-value toy · D2 5 clean alignment pairs · D3 +distractor/reordering · D4 tiny inline QA/translation pairs · D5 longer inputs with diffuse distractors.
- Metric: alignment accuracy.
- Closing viz: (a) attention/alignment heatmap panels  (b) accuracy-vs-length/complexity curve.
- Pitfall on D5: reproduce unnormalized or distractor-focused attention, then fix with row softmax, masking, and temperature checks.
- Notes: lesson body is empty despite no gap flag; author applications after lesson content exists; delete unused helpers; CPU-only, tiny.

### 8.12 — Transformers (self-attention, multi-head)   [notebook: 8.12-transformers.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. LLM encoders — every token routes to every token; lesson one-head formula builds $T\times T$ softmax rows.
2. Code search — multiple heads capture different relations; lesson contrasts rows `[0.6652,0.2447,0.0900]` and `[0.0900,0.2447,0.6652]`.
3. Chat ranking — residuals preserve identity; lesson toy `[1,2]+[0.5,-0.5]=[1.5,1.5]` keeps original signal.
4. Batch inference — parallel attention replaces recurrence; illustrative: 8 tokens create 64 score cells per head.
5. Long document tagging — scale logits by $\sqrt{d_k}$; lesson pitfall: omitting scale makes softmax rows prematurely one-hot.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `self_attention(X,Wq,Wk,Wv,scale=True)` implements $\operatorname{softmax}(QK^T/\sqrt{d_k})V$ and verifies lesson-style 3-token attention rows and residual addition.
- Datasets D1–D5: D1 lesson 3-token toy · D2 5 clean sentence patterns · D3 +order/distractor conflicts · D4 tiny inline classification corpus · D5 longer sequences.
- Metric: sequence classification accuracy.
- Closing viz: (a) head attention heatmap panels  (b) accuracy-vs-length/complexity curve.
- Pitfall on D5: reproduce missing-scale and missing-position failures, then fix with $\sqrt{d_k}$ scaling plus positional features.
- Notes: delete unused helpers; CPU-only; simulate tiny matrices only.

### 8.13 — Positional encodings (sinusoidal, learned, RoPE, ALiBi, relative)   [notebook: 8.13-positional-encodings.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Long-context LLMs — sinusoidal features extrapolate positions; lesson formula gives sine/cosine coordinates by `pos` and `2i/d`.
2. Chat ordering — content-only attention cannot distinguish reversals; lesson pitfall: original/reversed two-token multiset difference is 0.
3. Retrieval rerankers — RoPE changes query-key dot products; lesson requires rotating both queries and keys.
4. Streaming summarizers — ALiBi discourages distance; lesson sign check: `-2.5 < -0.5`, so far bias is more negative.
5. Finite trained models — learned rows do not extrapolate; lesson example row `[0,0.2]` exists only for allocated index.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `add_positions(tokens, kind)` implements sinusoidal coordinates and 2D RoPE rotation matrix, verifying the lesson reversal ambiguity and ALiBi sign.
- Datasets D1–D5: D1 lesson two-token reversal · D2 5 clean order-sensitive sequences · D3 +reordering/agreement · D4 tiny inline classification pairs · D5 longer positions beyond learned table.
- Metric: order-sensitive accuracy.
- Closing viz: (a) position/attention heatmap panels  (b) accuracy-vs-length/extrapolation curve.
- Pitfall on D5: reproduce learned-position out-of-range and wrong-sign ALiBi failures, then fix with sinusoidal/RoPE and sign tests.
- Notes: delete unused helpers; CPU-only, tiny.

### 8.14 — Efficient & long-context attention (Longformer, BigBird, FlashAttention)   [notebook: 8.14-efficient-long-context-attention.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Long-document search — dense attention stores $T^2$ scores; lesson lengths 128,256,512,1024 square to 16,384; 65,536; 262,144; 1,048,576.
2. Legal/medical review — window attention reduces edges; lesson $T=32,w=2$ actual mask has 154 entries, not approximate 160.
3. QA over documents — global routes connect distant tokens; lesson pitfall: local windows alone cannot make $M_{19,0}$ true in one layer.
4. Reproducible sparse models — fix random links; lesson pitfall: changing BigBird-style random pattern changes reachability.
5. Memory-efficient dense attention — FlashAttention blocks softmax; lesson pitfall: local chunk maxima alone are not enough for exact streaming softmax.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `attention_mask(T,w,globals)` computes dense/window/global masks and verifies lesson $T=32,w=2$ gives 154 allowed entries.
- Datasets D1–D5: D1 lesson mask toy · D2 5 clean local-dependency sequences · D3 +global/random links · D4 tiny inline long-document snippets · D5 longer sequences with far evidence.
- Metric: evidence-retrieval accuracy per allowed edge budget.
- Closing viz: (a) attention-mask/alignment heatmap panels  (b) accuracy-vs-length/edge-count curve.
- Pitfall on D5: reproduce sparse-as-dense and missing-global-route failures, then fix with explicit global tokens and deterministic random seeds.
- Notes: delete unused helpers; CPU-only, tiny; no real FlashAttention dependency.

### 8.15 — Decoding strategies (greedy, beam, top-k, nucleus, temperature)   [notebook: 8.15-decoding-strategies.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Chat generation — temperature changes logits; lesson logits `[3,2,0.5]` make token A the greedy winner.
2. Translation decoding — beam compares log scores; lesson pitfall: use log score such as `-1.203973`, not underflowing products.
3. Creative writing — top-k must renormalize; lesson top-k zeros last 2 entries and rescales first 3 to sum 1.
4. Safety-critical answers — deterministic vs sampled output changes evaluation; lesson pitfall: same logits can produce A or a sampled alternative.
5. Nucleus sampling — variable candidate count; lesson pitfall: count was 3 only because cumulative mass reached the chosen threshold there.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `decode(logits, strategy)` implements temperature, top-k, nucleus, greedy, beam-log scoring and verifies lesson `[3,2,0.5]` behavior.
- Datasets D1–D5: D1 lesson next-token logits · D2 5 clean logits rows · D3 +near-ties/repetition traps · D4 tiny inline response candidates · D5 longer generated sequences.
- Metric: task success/constraint accuracy.
- Closing viz: (a) token-probability/beam heatmap panels  (b) accuracy-vs-diversity/length curve.
- Pitfall on D5: reproduce no-renormalization/order-of-operations and probability-underflow bugs, then fix with log scores and explicit normalization.
- Notes: delete unused helpers; CPU-only; deterministic seeded sampling.

### 8.16 — Language-model evaluation (perplexity, BLEU, ROUGE, METEOR)   [notebook: 8.16-lm-evaluation.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. LM training dashboards — perplexity exponentiates average surprise; lesson token probabilities include `[0.5,0.25,0.2,...]`.
2. Translation evaluation — BLEU unigram precision counts overlap; lesson example `the cat sat` scores 2/3 against `the cat slept`.
3. Summarization — ROUGE recall rewards covered reference facts; illustrative: 3 of 5 facts gives 0.6 recall.
4. Captioning — METEOR weights precision/recall; lesson denominator uses `R+9P`, not unweighted F1.
5. Model selection — metric rankings can reverse; lesson pitfall: BLEU and ROUGE comparison reversed model ranking.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `evaluate_text(cand,ref,probs)` computes PPL and unigram overlap, verifying lesson `the cat sat` BLEU1 precision 2/3.
- Datasets D1–D5: D1 lesson candidate/reference pair · D2 5 clean paraphrase pairs · D3 +predicate/order changes · D4 tiny inline summaries/translations · D5 longer multi-reference-like examples.
- Metric: chosen primary metric (BLEU1 for overlap) tracked across all rungs, with PPL/ROUGE shown as diagnostics.
- Closing viz: (a) overlap/alignment heatmap panels  (b) BLEU-vs-length/complexity curve.
- Pitfall on D5: reproduce single-metric false conclusion and tokenizer-incomparable PPL, then fix with metric table plus qualitative error labels.
- Notes: delete unused helpers; CPU-only, tiny.

### 8.17 — Named entity recognition & sequence labeling   [notebook: 8.17-ner-sequence-labeling.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. CRM enrichment — extract people/orgs; lesson `Ada works at OpenAI` has 4 tokens and tags `B-PER,O,O,B-ORG`.
2. Compliance redaction — spans need BIO boundaries; lesson pitfall: dropping B/I collapses adjacent same-type entities.
3. Search facets — CRF transitions prevent illegal paths; lesson scores $s(x,y)$ combine emissions and transitions.
4. Log parsing — mask padding; lesson pitfall: transition sums over fake padded tokens create fake span starts/ends.
5. Medical extraction — neutral emissions need context; lesson row `[0.5,0.5]` should not be treated as confident.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `viterbi_bio(emissions,A,mask)` implements CRF path score and verifies lesson `Ada works at OpenAI` BIO tags.
- Datasets D1–D5: D1 lesson 4-token sentence · D2 5 clean entity sentences · D3 +adjacent entities/padding/noise · D4 tiny inline CoNLL-style snippets · D5 longer multi-entity sentences.
- Metric: entity-span F1.
- Closing viz: (a) tag/alignment heatmap panels  (b) F1-vs-length/entity-density curve.
- Pitfall on D5: reproduce independent argmax illegal BIO paths and padding errors, then fix with Viterbi constraints and masks.
- Notes: delete unused helpers; CPU-only, tiny.

### 8.18 — POS tagging & morphology   [notebook: 8.18-pos-tagging-morphology.ipynb]   (family: F7, gap)

**Lesson — Real World Applications (5):**
1. Grammar checking — distinguish noun/verb uses; lesson ambiguous `walk` needs context beyond dictionary lookup.
2. Search lemmatization — suffix features help; lesson encodes `walk/walked/walking` suffixes as 0/1/2.
3. Parsing pipelines — keep morphology bundles; lesson pitfall: losing `Tense=Past` or `Number=Sing` can hurt agreement.
4. Voice assistants — context flips local scores; lesson local `[0.55,0.45]` can become contextual `[0.234043,0.765957]`.
5. Domain adaptation — suffixes can mislead names; lesson pitfall: feature value 2 for `walking` is useful but overtrusted.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `pos_tagger(tokens,suffix_features,A)` combines softmax emissions and transitions, verifying lesson suffix values `walk=0, walked=1, walking=2`.
- Datasets D1–D5: D1 lesson morphology toy · D2 5 clean POS sentences · D3 +ambiguous words/domain suffix traps · D4 tiny inline tagged sentences · D5 longer agreement-sensitive sentences.
- Metric: token accuracy.
- Closing viz: (a) POS/morphology alignment heatmap panels  (b) accuracy-vs-ambiguity/length curve.
- Pitfall on D5: reproduce overtrusting suffixes and exact-bundle-only evaluation, then fix with context transitions and partial-feature reporting.
- Notes: gap topic; lesson body likely needs authoring depth before final applications; delete unused helpers; CPU-only, tiny.

### 8.19 — Dependency & constituency parsing   [notebook: 8.19-dependency-constituency-parsing.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Information extraction — find who did what; lesson `I saw her` needs verb `saw` governing subject/object.
2. Grammar feedback — enforce one root; lesson pitfall: extra `-1` entries mean multiple roots.
3. Semantic search — dependency arcs encode relations; lesson head-to-child table has `saw→her` score 3 versus `I→her` score 1.
4. Constituency chunking — span scores differ from head lists; lesson pitfall: `[1,-1,1]` is not a phrase tree.
5. Cross-lingual parsing — projectivity is not universal; lesson crossing indicator 1 marks a pattern some parsers cannot produce.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `parse_arcs(score_table)` scores $S(T)=\sum_{h\to m}s_{h,m}$ and verifies lesson table prefers `saw→her` score 3.
- Datasets D1–D5: D1 lesson 3-word sentence · D2 5 clean projective sentences · D3 +cycles/multiple roots/crossing arcs · D4 tiny inline parsed snippets · D5 longer nonprojective-like examples.
- Metric: unlabeled attachment accuracy.
- Closing viz: (a) arc/span alignment heatmap panels  (b) UAS-vs-sentence-length/structure curve.
- Pitfall on D5: reproduce independent best-arc invalid trees, then fix with tree constraints and root/cycle checks.
- Notes: delete unused helpers; CPU-only, tiny.

### 8.20 — Coreference resolution   [notebook: 8.20-coreference-resolution.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Document understanding — link pronouns to names; lesson `Alice arrived. She smiled.` requires `She→Alice` despite no shared tokens.
2. CRM entity merging — clustering is transitive; lesson pitfall: one bad link `(1,2)` can merge two clusters.
3. QA memory — antecedent probabilities use masks; lesson formula multiplies by $M_{ij}$ before normalization.
4. News analytics — distance prior is not enough; lesson near prior `0.640971` can still fail for long discourse links.
5. Evaluation dashboards — pairwise F1 is limited; lesson cites pairwise F1 0.5 as insufficient for final entity clusters.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `resolve_coref(mentions,features,mask)` scores $s(i,j)=w^T\phi$ and verifies lesson Alice/she/Bob score matrix link.
- Datasets D1–D5: D1 lesson Alice/she/Bob · D2 5 clean pronoun cases · D3 +agreement conflicts/transitive traps · D4 tiny inline mini-docs · D5 longer documents with distant mentions.
- Metric: pairwise/link F1.
- Closing viz: (a) mention-link heatmap panels  (b) F1-vs-distance/document-length curve.
- Pitfall on D5: reproduce surface-match and post-clustering mask failures, then fix with pre-link agreement masks and cluster checks.
- Notes: delete unused helpers; CPU-only, tiny.

### 8.21 — Semantic role labeling   [notebook: 8.21-semantic-role-labeling.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Event extraction — convert `Alice sold Bob a car` into seller/recipient/thing; lesson maps predicate roles around `sold`.
2. Contract analytics — preserve span boundaries; lesson pitfall: correct role on wrong span changes extracted fact.
3. Search answers — anchor predicate first; lesson pitfall: missing predicate flag conditions every score on wrong event.
4. Biomedical relation extraction — enforce core roles; lesson duplicate ARG1 example shows local argmax can violate constraints.
5. Frame-specific NLP — ARG numbers are frame-bound; lesson warns ARG0 is not always a human agent.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `srl_decode(predicate,spans,role_scores,constraints)` computes role softmax and verifies lesson `sold` event roles.
- Datasets D1–D5: D1 lesson sell-event sentence · D2 5 clean predicate/argument sentences · D3 +duplicate roles/near-ties · D4 tiny inline PropBank-style examples · D5 longer multi-predicate sentences.
- Metric: role-span F1.
- Closing viz: (a) predicate-span role heatmap panels  (b) F1-vs-sentence/argument-complexity curve.
- Pitfall on D5: reproduce duplicate ARG1/local argmax and wrong predicate anchoring, then fix with predicate flags and frame constraints.
- Notes: delete unused helpers; CPU-only, tiny.

### 8.22 — Machine translation   [notebook: 8.22-machine-translation.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Consumer translation — preserve meaning under new grammar; lesson `je mange→I eat` is the clean 2-token toy.
2. Localization QA — handle reordering; lesson reordered sequence `[1,0,2]` shows dictionary substitution fails grammar.
3. MT evaluation — BLEU1 can be perfect but shallow; lesson warns BLEU1 of 1.0 is possible in exact toy cases.
4. Beam search serving — length-normalize log probabilities; lesson pitfall: raw log probability favors clipped translations without $n^{0.6}$.
5. Coverage monitoring — prevent hallucination; lesson attention rows $\alpha$ must sum to 1 and cover important source positions.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `translate_and_score(src, dictionary, reorder_rule)` computes conditional toy translation, attention rows, and BLEU1, verifying lesson `je mange→I eat` can score BLEU1=1.0 only on the exact 2-token toy.
- Datasets D1–D5: D1 lesson exact pair · D2 5 clean word-order-preserving pairs · D3 +reordering/agreement where BLEU must drop below D1/D2 · D4 tiny inline parallel set with alternate wording · D5 longer/harder inputs with dropped words/idioms.
- Metric: BLEU1 across all rungs.
- Closing viz: (a) attention/alignment heatmap panels  (b) BLEU-vs-length/complexity curve that drops from D3 to D5.
- Pitfall on D5: replace the current bad identical-string BLEU=1.0 demo with imperfect/reordered translations whose BLEU drops as sentences get harder, then fix by comparing against references plus coverage/length penalties.
- Notes: delete dead template code, especially unused edit_distance/helpers; CPU-only, tiny; no pretrained MT model.

### 8.23 — Question answering   [notebook: 8.23-question-answering.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Support search — extract span from passage; lesson start/end distributions choose legal $(i,j)$ with $i\le j$.
2. Enterprise knowledge bots — abstain when unsupported; lesson best span 0.55 should lose to no-answer score 0.62.
3. Reading comprehension evals — same passage answers multiple questions; lesson `Paris is in France` can answer `Paris` or `France`.
4. Retrieval-augmented QA — separate retrieval from reading; lesson pitfall: wrong document 1 prevents reader recovery when document 0 had evidence.
5. Safety review — fluency is not confidence; lesson warns smooth answers can have low softmax mass.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `extract_answer(question,passage,start_logits,end_logits,no_answer)` enforces $i\le j$ and verifies lesson no-answer 0.62 beats span 0.55.
- Datasets D1–D5: D1 lesson passage/question toy · D2 5 clean extractive QAs · D3 +impossible/retrieval distractors · D4 tiny inline QA corpus · D5 longer passages with multiple plausible spans.
- Metric: exact-match accuracy.
- Closing viz: (a) start/end/evidence heatmap panels  (b) EM-vs-passage-length/distractors curve.
- Pitfall on D5: reproduce illegal independent argmax and suppressed no-answer calibration, then fix with legal-span search and abstention threshold.
- Notes: delete unused helpers; CPU-only, tiny.

### 8.24 — Summarization   [notebook: 8.24-summarization.ipynb]   (family: F7, gap)

**Lesson — Real World Applications (5):**
1. News digests — select salient nonredundant sentences; lesson MMR subtracts redundancy from salience.
2. Meeting notes — compression ratio alone is not quality; lesson ratio 0.167 says concise, not faithful.
3. Legal briefs — check omitted facts; lesson ROUGE recall 0.6 means 2 of 5 reference facts are absent.
4. Support-ticket summaries — avoid repeated evidence; lesson sentence 1 loses after redundancy penalty despite high raw salience.
5. Medical discharge summaries — abstraction can invent glue; lesson requires fact indicators checked against source.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `mmr_summarize(sentences,salience,sim,lambda_)` implements $MMR(s)=\lambda sal(s)-(1-\lambda)\max sim$ and verifies lesson fact recall 0.6 on 3/5 facts.
- Datasets D1–D5: D1 lesson sentence/fact toy · D2 5 clean mini-docs · D3 +redundancy/near-equal salience · D4 tiny inline news/support docs · D5 longer docs with omitted/unsupported facts.
- Metric: ROUGE/fact recall.
- Closing viz: (a) sentence-selection/fact-alignment heatmap panels  (b) recall-vs-compression/length curve.
- Pitfall on D5: reproduce salience-only repetition and ROUGE-with-omissions, then fix with MMR and source fact checks.
- Notes: gap topic; lesson body likely needs authoring depth; delete unused helpers; CPU-only, tiny.

### 8.25 — Text classification & sentiment   [notebook: 8.25-text-classification-sentiment.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Review sentiment — logistic evidence from words; lesson vocabulary `[good,bad]`, features `[2,0]`, weights `[1.2,-1.5]` gives logit 2.4 before bias.
2. Moderation queues — tune threshold $\tau$; lesson formula includes $\tau$, not hard-coded 0.5.
3. Support routing — confusion matrices matter; lesson accuracy 0.85 hides different false-positive/false-negative counts.
4. Brand monitoring — composition beats counts; lesson `not good` score -0.8 reverses unigram evidence.
5. Production serving — freeze vocabulary; lesson pitfall: if feature vector $x$ changes meaning, weights multiply wrong evidence.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `sentiment_logreg(x,w,b,tau)` computes $z=x^Tw+b$ and $\sigma(z)$, verifying lesson `[good,bad]` toy and thresholding.
- Datasets D1–D5: D1 lesson `good/bad/not good` toy · D2 5 clean labeled reviews · D3 +negation/threshold imbalance · D4 tiny inline sentiment snippets · D5 longer mixed-domain reviews.
- Metric: classification accuracy.
- Closing viz: (a) token-evidence/alignment heatmap panels  (b) accuracy-vs-negation/domain-complexity curve.
- Pitfall on D5: reproduce accuracy-only and vocabulary-drift failures, then fix with precision/recall thresholding and frozen vectorizer.
- Notes: delete unused helpers; CPU-only, tiny.

### 8.26 — Dialogue systems & chatbots   [notebook: 8.26-dialogue-systems.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Booking assistants — slot state gates action; lesson city slot value 0 should force a follow-up instead of execute.
2. Customer support bots — rank retrieval with state/safety; lesson score subtracts $\gamma$ when $safe(r)<\tau$.
3. Intent routers — route current turn; lesson intent logits for `book/cancel/...` become probabilities.
4. Multi-turn memory — accumulate slots; lesson sequence `[0,1,2,3]` should grow rather than reset.
5. Safety fallback — low confidence still matters; lesson pitfall: chitchat is not harmless by default with low intent/safety.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `dialogue_policy(q,state,candidates)` computes cosine + completeness - safety penalty and verifies lesson missing city slot blocks execution.
- Datasets D1–D5: D1 lesson booking state toy · D2 5 clean intent/slot turns · D3 +missing slots/unsafe retrieval · D4 tiny inline conversations · D5 longer multi-turn conversations with topic shifts.
- Metric: next-action accuracy.
- Closing viz: (a) state/attention-retrieval heatmap panels  (b) accuracy-vs-turn-count/state-complexity curve.
- Pitfall on D5: reproduce stateless retrieval answering unsafe/incomplete turns, then fix with accumulated state and safety threshold.
- Notes: delete unused helpers; CPU-only, tiny.

### 8.27 — Multilingual & cross-lingual NLP   [notebook: 8.27-multilingual-cross-lingual-nlp.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Multilingual sentiment — share embeddings across languages; lesson cosine divides by vector norms.
2. Low-resource transfer — rebalance language sampling; lesson English:Swahili volume ratio 20:1 can hide smaller-language failure.
3. Tokenizer coverage audits — measure script coverage; lesson gap 0.4 means one script enters with worse tokenization.
4. Cross-lingual retrieval — nearest neighbors require aligned geometry; lesson document 0 wins only because label geometry aligns.
5. Fair evaluation — inspect language weights; lesson sampling weights `[0.625,0.25,0.125]` favor the first language under its rule.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `crosslingual_classify(emb,label_embs,losses)` computes cosine and sampling weights $q_\ell$, verifying lesson weights `[0.625,0.25,0.125]`.
- Datasets D1–D5: D1 lesson aligned-vector toy · D2 5 clean translation pairs · D3 +script coverage/domain mismatch · D4 tiny inline multilingual sentiment set · D5 longer low-resource/noisy examples.
- Metric: classification accuracy.
- Closing viz: (a) cross-lingual similarity/alignment heatmap panels  (b) accuracy-vs-language-resource/coverage curve.
- Pitfall on D5: reproduce global score hiding low-resource failure and dot-product norm drift, then fix with per-language metrics and cosine.
- Notes: simulate embeddings with small features/SVD; delete unused helpers; CPU-only, tiny.

### 8.28 — Text-to-SQL & semantic parsing   [notebook: 8.28-text-to-sql-semantic-parsing.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Analytics assistants — map questions to executable SQL; lesson grammar mask sets invalid action probability to 0 even if raw logit is 5.
2. BI dashboards — schema linking grounds terms; lesson pitfall: `sales` linked to `region` yields valid but wrong SQL.
3. Data quality checks — execution accuracy matters; lesson indicators show one query executes correctly despite string mismatch.
4. Controlled code generation — constrain grammar state; lesson formula uses mask $m_k\in\{0,1\}$ in the softmax denominator.
5. Product support tooling — syntax is not enough; lesson pitfall: grammatical SQL can choose wrong column, aggregation, or table.

**Notebook plan:**
- Family: F7 Sequence/NLP
- Concept built once (D1): `semantic_parse(question,schema,logits,mask)` applies constrained softmax and executes toy SQL, verifying lesson invalid raw logit 5 becomes probability 0.
- Datasets D1–D5: D1 lesson schema/action toy · D2 5 clean single-table questions · D3 +schema ambiguity/invalid actions · D4 tiny inline SQLite database/questions · D5 longer multi-table/aggregation questions.
- Metric: execution accuracy.
- Closing viz: (a) schema-link/action-mask heatmap panels  (b) exec-accuracy-vs-schema/query-complexity curve.
- Pitfall on D5: reproduce skipped schema linking and stale grammar masks, then fix with explicit schema links, constrained decoding, and execution checks.
- Notes: delete unused helpers; CPU-only, tiny; use inline SQLite only.
