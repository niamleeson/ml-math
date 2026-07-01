/* All ML — Part 08 applications (5 each). Loaded after content-part-08.js, before all-ml-register.js.
   Assignment is self-creating so a missing content entry (e.g. a gap topic) can't crash the file. */

/* ---- _apps-part08-A.js ---- */
(window.ALLML_CONTENT["8.1"] = window.ALLML_CONTENT["8.1"] || {}).applications = [
  {
    title: "Search indexing",
    background: "<p>Search engines normalize query and document text so accidental spelling, case, accent, and punctuation variants share one posting list instead of fragmenting recall.</p>",
    numbers: "<p>The lesson toy re-derives the index win: <b>Café</b>, <b>CAFÉ</b>, and <b>cafe!</b> are 3 raw surface forms, but $n(\cdot)$ maps them to one canonical token, so the vocabulary count shrinks from $3$ to $1$.</p>"
  },
  {
    title: "Sentiment moderation",
    background: "<p>Moderation and review classifiers often remove stop words, but negation words are task-bearing tokens rather than harmless filler.</p>",
    numbers: "<p>In a 2-token phrase such as <b>not good</b>, deleting <b>not</b> leaves only <b>good</b>; that removes $1$ of the $2$ tokens and can flip the downstream sentiment decision.</p>"
  },
  {
    title: "Entity analytics",
    background: "<p>Business dashboards count names, countries, products, and common words together unless normalization preserves distinctions needed by the entity task.</p>",
    numbers: "<p>Casefolding merges <b>US</b> and <b>us</b> into one class: $2$ meaning-bearing classes become $1$, an illustrative 50% loss of class resolution for that pair.</p>"
  },
  {
    title: "Price and product extraction",
    background: "<p>Parsers for prices, SKUs, and product codes must keep digits and selected symbols even when topic models might safely discard them.</p>",
    numbers: "<p>The lesson punctuation example keeps alphanumerics as $[\textsf{win},\textsf{5000},\textsf{now}]$, count $3$; a stricter policy deletes <b>5000</b>, losing $1$ numeric fact.</p>"
  },
  {
    title: "Unicode-safe deduplication",
    background: "<p>Deduplication systems must compare canonical Unicode forms because visually identical text can be stored with different code-point sequences.</p>",
    numbers: "<p>The visible word <b>Café</b> has length $4$ when <b>é</b> is precomposed and length $5$ when it is <b>e</b> plus a combining accent; NFC maps the 2 encodings back to one counted key.</p>"
  }
];

(window.ALLML_CONTENT["8.2"] = window.ALLML_CONTENT["8.2"] || {}).applications = [
  {
    title: "Spell-correct search",
    background: "<p>Search boxes use edit distance to connect user typos and spelling variants to indexed vocabulary entries without hand-writing every repair rule.</p>",
    numbers: "<p>For <b>color</b> and <b>colour</b>, an illustrative radius $2$ is enough to accept a one-character insertion plus one nearby spelling edit while still ranking exact <b>color</b> at distance $0$.</p>"
  },
  {
    title: "Customer-name matching",
    background: "<p>Name and entity matching need more caution than general search because a near spelling can be a different real person or organization.</p>",
    numbers: "<p>The lesson warning is concrete: <b>colon</b> is distance $1$ from <b>color</b>, so a threshold of $1$ accepts a surface neighbor even though the meanings are unrelated.</p>"
  },
  {
    title: "OCR cleanup",
    background: "<p>OCR post-processing audits each suspected character repair with a dynamic-programming table rather than an opaque string similarity score.</p>",
    numbers: "<p>The lesson DP matrix for <b>cat</b> to <b>cut</b> ends at $D_{3,3}=1$ because the optimal script is one substitution, <b>a</b> to <b>u</b>.</p>"
  },
  {
    title: "Autocomplete ranking",
    background: "<p>Autocomplete systems tune the accepted edit radius by query length, domain, and risk, then rank candidates by repair cost.</p>",
    numbers: "<p>A universal radius $2$ can help a broad search query but can also accept <b>cold</b> for <b>color</b>; the lesson uses that $2$-edit threshold as the pitfall.</p>"
  },
  {
    title: "DNA and protein toy alignment",
    background: "<p>Sequence alignment starts with the same insertion and deletion boundary logic before biological scoring matrices add domain-specific costs.</p>",
    numbers: "<p>The boundary condition $D_{i,0}=i$ means aligning a length-$4$ prefix to an empty target costs $4$ deletions; omitting it makes leading gaps artificially cheap.</p>"
  }
];

(window.ALLML_CONTENT["8.3"] = window.ALLML_CONTENT["8.3"] || {}).applications = [
  {
    title: "LLM serving",
    background: "<p>Subword tokenizers let serving systems avoid a word-level unknown for new forms while keeping sequences shorter than pure characters.</p>",
    numbers: "<p>The lesson example shows <b>lowest</b> can be represented by 2 known subwords instead of 1 unknown whole-word token, trading open vocabulary for extra positions.</p>"
  },
  {
    title: "Search-log tokenizer audits",
    background: "<p>Search teams inspect BPE merges because tie-breaking changes token ids, cached features, and model inputs even on the same corpus.</p>",
    numbers: "<p>In <b>low</b>, <b>lower</b>, <b>newest</b>, and <b>widest</b>, several adjacent pairs have count $2$; the deterministic first maximum chooses $(\textsf{l},\textsf{o})$.</p>"
  },
  {
    title: "Multilingual products",
    background: "<p>Subwords are useful for products that see many names, borrowed words, and inflected forms that were absent from training.</p>",
    numbers: "<p>Illustratively, 5 unseen surface forms can still be segmented into known character or subword pieces, replacing 5 word-level unknowns with measurable token lengths.</p>"
  },
  {
    title: "Detokenization",
    background: "<p>Continuation markers encode whether a piece starts a new word or attaches to the previous piece, which matters when generated tokens are stitched back into text.</p>",
    numbers: "<p>Dropping <b>##</b> loses $1$ boundary signal for each continuation piece; a 3-piece word with 2 continuations loses 2 explicit join decisions.</p>"
  },
  {
    title: "Cost estimation",
    background: "<p>Inference cost depends on sequence length, so tokenizer changes are priced by average positions per word or per request.</p>",
    numbers: "<p>The lesson merge changes <b>low</b> from $[\textsf{l},\textsf{o},\textsf{w},\textsf{_}]$ length $4$ to $[\textsf{lo},\textsf{w},\textsf{_}]$ length $3$, a 25% local reduction.</p>"
  }
];

(window.ALLML_CONTENT["8.4"] = window.ALLML_CONTENT["8.4"] || {}).applications = [
  {
    title: "Document search",
    background: "<p>Classic search ranks documents by sparse term vectors, with TF-IDF giving rare matching terms more weight than ubiquitous ones.</p>",
    numbers: "<p>The lesson corpus fixes 5 axes, $[\textsf{ate},\textsf{cat},\textsf{dog},\textsf{fish},\textsf{sat}]$, so <b>cat sat</b> is exactly $[0,1,0,0,1]$.</p>"
  },
  {
    title: "Ticket routing",
    background: "<p>Ticket classifiers freeze the training vocabulary so the same numeric vector means the same words at serving time.</p>",
    numbers: "<p>The vector $[0,1,0,0,1]$ routes as <b>cat sat</b> only under the lesson's 5-term order; permuting the vocabulary permutes all 5 coordinates.</p>"
  },
  {
    title: "Spam filtering",
    background: "<p>Spam and abuse filters often downweight common words while preserving rarer tokens that better identify a campaign or template.</p>",
    numbers: "<p>The lesson IDF convention uses $1+N$ and $1+\operatorname{df}$; with $N=3$ and $\operatorname{df}_{\textsf{cat}}=2$, the factor is $\log(4/3)+1$.</p>"
  },
  {
    title: "Legal discovery",
    background: "<p>Long documents need term-frequency normalization so a large file does not win merely because it has more chances to mention every word.</p>",
    numbers: "<p>Illustratively, if a 1000-token document mentions a term 10 times, its normalized frequency is $10/1000=0.01$ rather than raw count $10$.</p>"
  },
  {
    title: "Sentiment baseline",
    background: "<p>Bag-of-words is a transparent baseline for sentiment, but it has no coordinate for position or composition unless features are added.</p>",
    numbers: "<p>A 2-word phrase such as <b>not good</b> contributes the same unigram counts as separated tokens <b>not</b> and <b>good</b>; adding a bigram creates 1 extra feature, <b>not_good</b>.</p>"
  }
];

(window.ALLML_CONTENT["8.5"] = window.ALLML_CONTENT["8.5"] || {}).applications = [
  {
    title: "Keyboard prediction",
    background: "<p>Keyboards can suggest the next token from counts of what followed the same recent history in prior text.</p>",
    numbers: "<p>In the lesson corpus <b>a b a b a c</b>, counts are $[3,2,1]$ over 6 tokens, so the unigram probability of <b>a</b> is $3/6=0.5$.</p>"
  },
  {
    title: "Query suggestion",
    background: "<p>Query suggesters condition on the current history row, not on the whole corpus, when estimating the next token.</p>",
    numbers: "<p>After history <b>a</b>, the row is $[0,2,1]$ with row sum $3$; dividing by total corpus length $6$ would give the wrong conditional probabilities.</p>"
  },
  {
    title: "ASR fallback rescoring",
    background: "<p>Speech systems can use a small smoothed n-gram model as a fallback rescoring signal when neural confidence is weak.</p>",
    numbers: "<p>With add-one smoothing, the lesson row $[0,2,1]$ becomes $[1,3,2]$ and denominator $3+3=6$, giving probabilities $[1/6,3/6,2/6]$.</p>"
  },
  {
    title: "Synthetic text QA",
    background: "<p>Simple n-gram generators expose how greedy decoding can loop through local maxima instead of sampling typical language.</p>",
    numbers: "<p>The lesson greedy path <b>a,b,a,b,a</b> has 5 tokens; it is an argmax loop, not proof that all 5-token samples should look that way.</p>"
  },
  {
    title: "Tokenizer comparison",
    background: "<p>Perplexity only compares models over the same event space, so tokenizer changes require careful reporting.</p>",
    numbers: "<p>A word-level model and a subword model assign probability to different token sequences; raw PPL values are therefore not directly comparable unless the tokenization is held fixed.</p>"
  }
];

(window.ALLML_CONTENT["8.6"] = window.ALLML_CONTENT["8.6"] || {}).applications = [
  {
    title: "Semantic search",
    background: "<p>Embedding retrieval compares dense word or document vectors by direction so related context neighborhoods can rank together even without exact term overlap.</p>",
    numbers: "<p>The lesson warns that cosine is contextual evidence: the toy geometry gives $\cos(\textsf{king},\textsf{queen})=0.9986178293325095$, not a guaranteed ontology fact.</p>"
  },
  {
    title: "Analogy demos",
    background: "<p>Analogy probes test whether a relation is represented as a consistent vector offset, while also revealing where the space over-promises.</p>",
    numbers: "<p>The lesson arithmetic is auditable: $[2,1]-[1,0]+[1,2]=[2,3]$, so the constructed <b>queen</b> point is $[2,3]$ in the toy plane.</p>"
  },
  {
    title: "Rare-word handling",
    background: "<p>FastText-style subword features let rare inflections borrow evidence from character n-grams shared with known forms.</p>",
    numbers: "<p>The lesson trigrams give Jaccard overlaps of $2/5=0.4$ for <b>play</b> with <b>playing</b> and $2/4=0.5$ for <b>play</b> with <b>played</b>.</p>"
  },
  {
    title: "Bias monitoring",
    background: "<p>Nearest-neighbor inspection helps practitioners find frequency artifacts or stereotype patterns inherited from the training corpus.</p>",
    numbers: "<p>Illustratively, a top-5 neighbor panel audits 5 local directions around a word; a suspicious neighbor in any of those 5 slots is a concrete review item.</p>"
  },
  {
    title: "Recommendation tags",
    background: "<p>Recommendation systems compress sparse tags into dense vectors so tags with similar co-occurrence neighborhoods can share statistical strength.</p>",
    numbers: "<p>The lesson count matrix has $C_{\textsf{king},\textsf{man}}=5$ and each row sum $10$; across 4 rows, the corpus total is $40$ co-occurrence counts.</p>"
  }
];

/* ---- _apps-part08-B.js ---- */
/* All ML — Part 08 applications batch B (8.7--8.12). Loaded after content-part-08.js. */

(window.ALLML_CONTENT["8.7"] = window.ALLML_CONTENT["8.7"] || {}).applications = [
  { title: "Sensor-event classification", background: "<p>Device telemetry arrives as a stream, so a small recurrent state can summarize whether enough positive evidence has appeared.</p>", numbers: "<p>With the lesson sequence $[1,0,1,1]$ and $h_t=\\tanh(0.8h_{t-1}+0.6x_t)$, the final state is $h_4=0.8281545644800706$, large enough to act as a sequence-level score.</p>" },
  { title: "Autocomplete", background: "<p>Next-token systems need outputs at intermediate states, not just one final summary after the sentence is over.</p>", numbers: "<p>For lesson sequence $[1,0,1,0,1]$, four next-token predictions are produced because the last token has no next target; the prediction list $[1,0,1,1]$ must be aligned to next tokens $[0,1,0,1]$.</p>" },
  { title: "Fraud sequences", background: "<p>Fraud behavior often depends on repeated actions over time, and recurrent parameter sharing keeps the model size independent of the observed length.</p>", numbers: "<p>The lesson compares $3$ shared transition parameters with $3\\cdot6=18$ separate per-step parameters at length $6$, so the unshared version uses $18/3=6$ times as many.</p>" },
  { title: "Long-note triage", background: "<p>Clinical or support notes can mention early evidence that must survive many later tokens.</p>", numbers: "<p>The lesson decay values show the risk: $0.2^{20}=1.0485760000000012\\cdot10^{-14}$ while $0.9^{20}=0.12157665459056935$, so small recurrent factors erase early evidence.</p>" },
  { title: "Clickstream modeling", background: "<p>Click models can score an entire session or predict the next action after every click, but the target alignment changes.</p>", numbers: "<p>For the lesson final-state classifier, $h_T=1.833$ is compared with threshold $1.5$, giving class $1$ because $1.833\\gt1.5$.</p>" }
];

(window.ALLML_CONTENT["8.8"] = window.ALLML_CONTENT["8.8"] || {}).applications = [
  { title: "Medical-note sequence flags", background: "<p>LSTMs are useful when an early symptom mention should remain stored while later tokens are read.</p>", numbers: "<p>With old cell value $c=2$ and forget gates $[0,0.5,1]$, the kept values are $[0\\cdot2,0.5\\cdot2,1\\cdot2]=[0,1,2]$.</p>" },
  { title: "Finance time-event text", background: "<p>Financial event streams may store a strong event while exposing only part of it to downstream decisions.</p>", numbers: "<p>For lesson cell $c=1.2820137900379085$, $\\tanh(c)=0.8570205322353923$; output gate $0.2$ gives hidden $0.17140410644707849$, while output gate $0.8$ gives $0.6856164257883139$.</p>" },
  { title: "Chat intent memory", background: "<p>Dialogue state tracking needs to write new slot evidence without treating raw pre-activations as stored facts.</p>", numbers: "<p>The lesson candidate write uses $\\tanh(2.0)=0.9640275800758169$; with input gate $0.5$, the written amount is $0.5\\cdot0.9640275800758169=0.48201379003790845$.</p>" },
  { title: "Log anomaly detection", background: "<p>Operational logs often contain long quiet stretches, making forget-gate initialization important.</p>", numbers: "<p>A near-one forget gate preserves memory: the lesson computes $0.95^{30}=0.21463876394293727$, which remains greater than $0.2$ after $30$ steps.</p>" },
  { title: "Embedded NLP", background: "<p>Small on-device sequence models still benefit from checking whether gates are saturated and therefore hard to train.</p>", numbers: "<p>Illustratively, a gate near $0$ erases or blocks almost all of a scalar path, while a gate near $1$ nearly copies it; the notebook visualizes the three LSTM gates plus $c_t$.</p>" }
];

(window.ALLML_CONTENT["8.9"] = window.ALLML_CONTENT["8.9"] || {}).applications = [
  { title: "Mobile keyboard models", background: "<p>GRUs are compact enough for small sequence models while still choosing how strongly to update hidden state.</p>", numbers: "<p>With $h_{old}=2$, $\\tilde h=-1$, and $z=[0,0.25,0.5,0.75,1]$, the lesson interpolation gives $[2,1.25,0.5,-0.25,-1]$.</p>" },
  { title: "Event stream classification", background: "<p>When only sparse events matter, a small update gate can preserve state through many uninformative steps.</p>", numbers: "<p>The lesson keep path compares $0.5^{30}=9.313225746154785\\cdot10^{-10}$ with $0.95^{30}=0.21463876394293727$, showing far better retention.</p>" },
  { title: "Dialogue intent tracking", background: "<p>Reset gates help the candidate ignore stale context before proposing a new state.</p>", numbers: "<p>With $x=1$, $h=2$, and $r=0.25$, the reset-filtered state is $0.25\\cdot2=0.5$, so the candidate is $\\tanh(0.7\\cdot1+0.4\\cdot0.5)=0.7162978701990245$.</p>" },
  { title: "IoT text logs", background: "<p>GRUs reduce gating machinery compared with LSTMs, which can matter in constrained log or sensor deployments.</p>", numbers: "<p>Illustratively, a GRU has reset and update gates plus a candidate, while the LSTM lesson tracks forget, input, output, and cell candidate paths.</p>" },
  { title: "Sequence ablations", background: "<p>The right gated cell is empirical: fewer gates are not automatically worse if the task mostly needs selective updates.</p>", numbers: "<p>For lesson sequence $[1,0,0,0,1]$, the final GRU state is $0.7598950974288129$, which is larger than the second state $0.5465304502698163$ after reacting to the final one.</p>" }
];

(window.ALLML_CONTENT["8.10"] = window.ALLML_CONTENT["8.10"] || {}).applications = [
  { title: "Toy translation", background: "<p>Encoder-decoder models condition every generated token on what the source encoder read.</p>", numbers: "<p>The lesson factors generation as $P(y_{1:T}\\mid x_{1:S})=\\prod_{t=1}^{T}P(y_t\\mid y_{1:t-1},\\operatorname{Enc}(x_{1:S}))$, one conditional decision for each target step.</p>" },
  { title: "Query rewriting", background: "<p>Search query rewrites may reorder or delete source tokens, so source and target lengths should not be assumed equal.</p>", numbers: "<p>In the lesson reverse toy, source $[1,2,3]$ maps to target $[3,2,1]$; both have length $3$ only because the toy is deliberately simple.</p>" },
  { title: "Summarization", background: "<p>Summaries require a decoder to decide when to stop rather than generating a fixed number of tokens forever.</p>", numbers: "<p>The lesson's scalar decoder unfolds exactly $4$ states $[0.5580522155596244,0.3719088632753982,0.254609968964449,0.1763635334341262]$, illustrating why fixed-step decoding can truncate or overrun.</p>" },
  { title: "Data-to-text", background: "<p>Autoregressive systems can drift because each generated token becomes context for the next one.</p>", numbers: "<p>If each token is correct with probability $0.9$, the lesson no-error survival after $10$ steps is $0.9^{10}=0.3486784401000001$.</p>" },
  { title: "Code transduction", background: "<p>Program-to-program transformations need teacher-forcing targets aligned one step ahead of decoder inputs.</p>", numbers: "<p>With target $[3,1,2]$ and predictions $[3,2,2]$, the lesson correctness vector is $[1,0,1]$ and the sum is $2$ correct positions.</p>" }
];

(window.ALLML_CONTENT["8.11"] = window.ALLML_CONTENT["8.11"] || {}).applications = [
  { title: "Translation alignment", background: "<p>Attention exposes which source words a decoder token reads when producing a target word.</p>", numbers: "<p>Illustratively, $3$ target steps attending over $4$ source tokens create $3\\cdot4=12$ attention weights to inspect.</p>" },
  { title: "Document QA", background: "<p>Question answering can point a question representation toward the evidence span that supports an answer.</p>", numbers: "<p>For one illustrative attention row $a$, softmax normalization requires $\\sum_i a_i=1$, so the largest row entry can be interpreted as the strongest evidence location.</p>" },
  { title: "Summarization", background: "<p>Sentence-level attention helps a summary step weight which source sentence is most salient.</p>", numbers: "<p>Illustratively, $5$ input sentences produce a $5$-column distribution for each summary token, and every row should sum to $1$ after softmax.</p>" },
  { title: "Speech/text alignment", background: "<p>Soft alignment can connect output symbols to multiple acoustic frames without a hard segmentation first.</p>", numbers: "<p>Illustratively, $4$ output symbols attending over $6$ frames produce $4\\cdot6=24$ alignment cells.</p>" },
  { title: "Recommendation session NLP", background: "<p>A session model can attend over recent actions to build one context vector for the current recommendation.</p>", numbers: "<p>Illustratively, $10$ prior events become one context vector through $10$ normalized weights, so the weighted value sum remains a convex mixture.</p>" }
];

(window.ALLML_CONTENT["8.12"] = window.ALLML_CONTENT["8.12"] || {}).applications = [
  { title: "LLM encoders", background: "<p>Transformer encoders let each token route information to and from every other token in the same layer.</p>", numbers: "<p>With $T$ tokens, one self-attention head builds a $T\\times T$ row-softmax matrix; illustratively, $8$ tokens create $8\\cdot8=64$ score cells per head.</p>" },
  { title: "Code search", background: "<p>Different heads can specialize in different token relations, such as local syntax versus matching identifiers.</p>", numbers: "<p>The lesson contrasts head rows $[0.6652,0.2447,0.0900]$ and $[0.0900,0.2447,0.6652]$, moving the largest weight from position $1$ to position $3$.</p>" },
  { title: "Chat ranking", background: "<p>Residual streams preserve token identity while attention adds an update used for ranking or generation.</p>", numbers: "<p>The lesson residual example is $[1,2]+[0.5,-0.5]=[1.5,1.5]$, so the block edits rather than replaces the original signal.</p>" },
  { title: "Batch inference", background: "<p>Matrix attention replaces step-by-step recurrence, allowing all token-to-token scores in a layer to be computed together.</p>", numbers: "<p>For lesson $X=\\begin{bmatrix}1&0\\\\0&1\\\\1&1\\end{bmatrix}$, scaled self-attention row $1$ rounds to $[0.4011,0.1978,0.4011]$ and the row sum is $1.0000$.</p>" },
  { title: "Long document tagging", background: "<p>Longer documents make scaling and positional information essential, because raw dot products and bag-like attention can misroute evidence.</p>", numbers: "<p>The pitfall is omitting $\\sqrt{d_k}$: as $d_k$ grows, unscaled logits become larger and softmax rows can become prematurely one-hot.</p>" }
];

/* ---- _apps-part08-C.js ---- */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

window.ALLML_CONTENT["8.13"] = window.ALLML_CONTENT["8.13"] || {};
(window.ALLML_CONTENT["8.13"] = window.ALLML_CONTENT["8.13"] || {}).applications = [
  { title: "Long-context LLMs", background: "<p>Sinusoidal features were introduced so Transformer positions can be represented without allocating one learned row for every possible index. This matters when a model sees prompts longer than the trained examples.</p>", numbers: "<p>The lesson formula $PE(pos,2i)=\\sin(pos/10000^{2i/d})$ gives a coordinate from only $pos$ and $2i/d$. A learned illustrative row $[0,0.2]$ exists only for its allocated index, while the sinusoid can still be evaluated at a new $pos$.</p>" },
  { title: "Chat ordering", background: "<p>Chat messages often contain the same words in different orders. Positional encodings let attention distinguish who did what to whom instead of treating the sequence as a bag of token vectors.</p>", numbers: "<p>With token vectors $[[1,0],[0,1]]$ and the reversed sequence $[[0,1],[1,0]]$, coordinate sorting gives the same multiset and difference $[[0,0],[0,0]]$. That zero difference is the no-position failure.</p>" },
  { title: "Retrieval rerankers", background: "<p>Rerankers compare query and passage tokens, so the relative placement of evidence can change the final score. RoPE changes the query-key dot product by rotating both sides by position.</p>", numbers: "<p>The 2D operation is $R_\\theta[q_1,q_2]^T$. If an implementation rotates only the query but not the key, it is no longer using the lesson geometry for the query-key dot product.</p>" },
  { title: "Streaming summarizers", background: "<p>Streaming summarizers need a bias toward nearby evidence while still allowing selected long-range links. ALiBi adds this preference directly to attention scores.</p>", numbers: "<p>With illustrative slope $-0.5$, distance $5$ gets bias $-2.5$ and distance $1$ gets $-0.5$. Since $-2.5\\lt -0.5$, the farther token is penalized more.</p>" },
  { title: "Finite trained models", background: "<p>Learned absolute position tables are common because they are flexible over the trained context window. Their weakness is extrapolation: there is no parameter row beyond the table.</p>", numbers: "<p>If the table has an illustrative row $[0,0.2]$ at one index and only $10$ rows total, asking for position $20$ is undefined. A sinusoidal coordinate still has a formula at position $20$.</p>" }
];

window.ALLML_CONTENT["8.14"] = window.ALLML_CONTENT["8.14"] || {};
(window.ALLML_CONTENT["8.14"] = window.ALLML_CONTENT["8.14"] || {}).applications = [
  { title: "Long-document search", background: "<p>Document search models need attention over many tokens, but dense attention stores every query-key score. The square law is the core cost driver.</p>", numbers: "<p>The lesson lengths square to $128^2=16{,}384$, $256^2=65{,}536$, $512^2=262{,}144$, and $1024^2=1{,}048{,}576$. An eightfold length increase creates $64$ times as many scores.</p>" },
  { title: "Legal and medical review", background: "<p>Review systems often need local context around each phrase. Window attention keeps a band around each token and avoids storing irrelevant far links.</p>", numbers: "<p>For $T=32$ and window radius $w=2$, the approximation $T(2w+1)=160$ overcounts boundaries. The actual allowed mask has $154$ entries.</p>" },
  { title: "Question answering over documents", background: "<p>Question answering may need a token near the end to read evidence at the beginning. Global tokens provide the shortcut route missing from one-layer local attention.</p>", numbers: "<p>With local radius $2$, a query at position $19$ cannot attend to key $0$, so $M_{19,0}$ is false. Marking position $0$ global makes that far evidence reachable.</p>" },
  { title: "Reproducible sparse models", background: "<p>BigBird-style random links improve sparse graph connectivity, but the chosen links become part of the computation. Reproducibility requires fixed seeds.</p>", numbers: "<p>If two runs both use $12$ illustrative random links but different seeds, the edge count can match while reachability of a specific evidence pair changes. The notebook fixes the seed before generating links.</p>" },
  { title: "Memory-efficient dense attention", background: "<p>FlashAttention is not sparse attention. It computes exact dense softmax in blocks while maintaining the correct global maximum and denominator.</p>", numbers: "<p>For lesson scores producing probabilities $[0.665186,0.244708,0.090023,0.000082]$, using only local chunk maxima changes the distribution. The global denominator is required.</p>" }
];

window.ALLML_CONTENT["8.15"] = window.ALLML_CONTENT["8.15"] || {};
(window.ALLML_CONTENT["8.15"] = window.ALLML_CONTENT["8.15"] || {}).applications = [
  { title: "Chat generation", background: "<p>A chat model emits logits, but the decoder decides whether the answer is deterministic or exploratory. Temperature reshapes the next-token distribution before a token is chosen.</p>", numbers: "<p>For lesson logits $[3,2,0.5]$, softmax is $[0.689672,0.253716,0.056612]$. Greedy decoding chooses token A because $0.689672$ is largest.</p>" },
  { title: "Translation decoding", background: "<p>Translation systems use beam search to compare partial sentence hypotheses. Log scores keep long sequence comparisons numerically stable.</p>", numbers: "<p>A probability $0.3$ contributes $\log(0.3)=-1.203973$. Comparing log sums avoids multiplying many small probabilities until they underflow.</p>" },
  { title: "Creative writing", background: "<p>Top-k sampling encourages variety by removing low-probability tokens while preserving a controlled candidate set. The remaining probabilities must be renormalized.</p>", numbers: "<p>In the lesson, top-k zeros the last $2$ entries and rescales the first $3$ so their sum is $1$. Without that rescale, the sampler is not drawing from a valid distribution.</p>" },
  { title: "Safety-critical answers", background: "<p>For safety-sensitive tasks, decoding is part of the product behavior. The same model logits can yield a stable refusal or a sampled alternative.</p>", numbers: "<p>With logits $[3,2,0.5]$, deterministic greedy always emits A. A seeded sampler can choose another token according to probabilities $[0.689672,0.253716,0.056612]$.</p>" },
  { title: "Nucleus sampling", background: "<p>Nucleus sampling keeps the smallest set of high-probability tokens whose cumulative mass reaches a threshold. Its candidate count changes with the distribution.</p>", numbers: "<p>The lesson count was $3$ because the first two probabilities summed to $0.870530$, below the chosen threshold, and the third pushed cumulative mass over it. The rule is mass, not fixed count.</p>" }
];

window.ALLML_CONTENT["8.16"] = window.ALLML_CONTENT["8.16"] || {};
(window.ALLML_CONTENT["8.16"] = window.ALLML_CONTENT["8.16"] || {}).applications = [
  { title: "LM training dashboards", background: "<p>Training dashboards track likelihood so teams can see whether the model is less surprised by reference tokens. Perplexity is the exponentiated average surprise.</p>", numbers: "<p>For probabilities $[0.5,0.25,0.25]$, cross-entropy is $1.155245300933242$ and perplexity is $\exp(1.155245300933242)=3.174802103936399$.</p>" },
  { title: "Translation evaluation", background: "<p>BLEU-style precision rewards candidate words that appear in the reference. It is useful for translation dashboards but can miss semantic reversals.</p>", numbers: "<p>Candidate the cat sat against reference the cat slept overlaps on the and cat. BLEU-1 precision is therefore $2/3$.</p>" },
  { title: "Summarization", background: "<p>ROUGE recall asks how much of the reference content was covered. It is natural for summaries where omitted facts matter.</p>", numbers: "<p>If an illustrative summary covers $3$ of $5$ reference facts, ROUGE-style recall is $3/5=0.6$. Extra unsupported facts need a separate check.</p>" },
  { title: "Captioning", background: "<p>METEOR-style scoring combines precision and recall but intentionally weights recall differently from plain F1. This can better match caption coverage goals.</p>", numbers: "<p>The lesson denominator is $R+9P$, so with illustrative $P=0.5$ and $R=0.8$, the score is $10PR/(R+9P)=4/(0.8+4.5)=0.754717$.</p>" },
  { title: "Model selection", background: "<p>Metric choice changes which model appears best. Product teams need a metric table plus qualitative labels rather than one final number.</p>", numbers: "<p>An illustrative model A with BLEU $0.8$ and ROUGE $0.4$ beats model B with BLEU $0.5$ by precision, while B beats A by ROUGE $0.7$. The ranking reverses.</p>" }
];

window.ALLML_CONTENT["8.17"] = window.ALLML_CONTENT["8.17"] || {};
(window.ALLML_CONTENT["8.17"] = window.ALLML_CONTENT["8.17"] || {}).applications = [
  { title: "CRM enrichment", background: "<p>NER enriches customer records by extracting people and organizations from notes, email text, and logs. BIO tags keep span boundaries recoverable.</p>", numbers: "<p>The lesson sentence Ada works at OpenAI has $4$ tokens and tags B-PER,O,O,B-ORG. There are $2$ entity tokens and $2$ outside tokens.</p>" },
  { title: "Compliance redaction", background: "<p>Redaction must remove exact spans without merging separate mentions. Keeping B and I boundaries avoids collapsing adjacent same-type entities.</p>", numbers: "<p>If Ada Bob is tagged as B-PER,B-PER, it represents two one-token person spans. Dropping B/I detail can merge them into one two-token span.</p>" },
  { title: "Search facets", background: "<p>Search indexing uses entity spans as facets such as person, organization, and location. CRF transitions prevent locally attractive but illegal tag paths.</p>", numbers: "<p>The path score is $s(x,y)=\sum_t e_t(y_t)+\sum_{t=2}^T A_{y_{t-1},y_t}$. A transition penalty can outweigh a single large emission.</p>" },
  { title: "Log parsing", background: "<p>Operational logs are batched with padding, so sequence labelers must ignore fake positions. Otherwise padding can create fake span starts or endings.</p>", numbers: "<p>For a real length $4$ sentence padded to $6$ slots, transition sums should cover $3$ real transitions, not $5$. The mask keeps the two pad slots out.</p>" },
  { title: "Medical extraction", background: "<p>Clinical extraction often sees ambiguous abbreviations and neutral local evidence. Context and transitions should decide uncertain tokens.</p>", numbers: "<p>A lesson row $[0.5,0.5]$ gives equal local support to two tags. Treating it as confident would be wrong because neither class has probability above the other.</p>" }
];

window.ALLML_CONTENT["8.18"] = window.ALLML_CONTENT["8.18"] || {};
(window.ALLML_CONTENT["8.18"] = window.ALLML_CONTENT["8.18"] || {}).applications = [
  { title: "Grammar checking", background: "<p>Grammar checkers need to know whether an ambiguous word is acting as a noun or verb before suggesting an edit. Context resolves dictionary ambiguity.</p>", numbers: "<p>The lesson ambiguous word walk cannot be tagged by dictionary lookup alone. A local split like $[0.55,0.45]$ can become contextual $[0.234043,0.765957]$ after transitions.</p>" },
  { title: "Search lemmatization", background: "<p>Search systems use morphology to connect inflected forms to a shared lemma. Suffix features provide compact evidence before deeper syntax.</p>", numbers: "<p>The lesson encodes walk as $0$, walked as $1$, and walking as $2$. Those values separate bare, past-like, and gerund-like forms.</p>" },
  { title: "Parsing pipelines", background: "<p>Parsers benefit from coarse POS plus morphology bundles such as tense and number. Collapsing bundles too early can hide agreement errors.</p>", numbers: "<p>If a token is VERB with Tense=Past, dropping Tense=Past keeps coarse POS but loses a feature needed for agreement. Exact POS accuracy can remain $1$ while morphology is incomplete.</p>" },
  { title: "Voice assistants", background: "<p>Voice assistants transcribe short commands where local word scores are often close. Sequence transitions can flip the decision toward a plausible command structure.</p>", numbers: "<p>The lesson local scores $[0.55,0.45]$ favor the first tag, but contextual probabilities $[0.234043,0.765957]$ favor the second. Context changed the answer.</p>" },
  { title: "Domain adaptation", background: "<p>Domain names and product terms can look like ordinary inflections. A robust tagger treats suffixes as evidence, not a rule.</p>", numbers: "<p>The suffix feature value $2$ for walking is useful, but a name ending in ing may not be a gerund. The D5 pitfall compares suffix-only behavior with transition-aware tagging.</p>" }
];

/* ---- _apps-part08-D.js ---- */
(window.ALLML_CONTENT["8.19"] = window.ALLML_CONTENT["8.19"] || {}).applications = [
  { title: "Information extraction", background: "<p>Dependency parsers turn sentences into relation graphs so extraction systems can find who did what without relying only on word order.</p>", numbers: "<p>In the lesson table, <b>saw→her</b> has score $3$ while <b>I→her</b> has score $1$, so the verb-object arc wins by $3-1=2$ points before tree constraints are applied.</p>" },
  { title: "Grammar feedback", background: "<p>Writing assistants use parse validity checks to flag malformed sentence analyses such as fragments or doubled predicates.</p>", numbers: "<p>The lesson head list $[1,-1,1]$ has exactly one root because only one entry equals $-1$; if two entries were $-1$, the root-count requirement would fail.</p>" },
  { title: "Semantic search relations", background: "<p>Search systems can index syntactic arcs so queries match relations such as actor, action, and object rather than just nearby keywords.</p>", numbers: "<p>For <b>I saw her</b>, the chosen heads $[1,-1,1]$ attach both token $0$ and token $2$ to token $1$, yielding the relation-centered pattern subject→verb←object.</p>" },
  { title: "Constituency chunking", background: "<p>Chunkers and sentiment systems need phrase spans, not only heads, when a whole noun phrase or clause should be selected.</p>", numbers: "<p>The lesson span scores are $(0,1)=1.0$, $(1,3)=2.5$, and $(0,3)=3.0$; the full span wins because $3.0\gt2.5\gt1.0$.</p>" },
  { title: "Cross-lingual parsing", background: "<p>Multilingual parsers must decide whether projectivity is a safe speed assumption for the target language or domain.</p>", numbers: "<p>For arcs $(0,2)$ and $(1,3)$, the indices satisfy $0\lt1\lt2\lt3$, so the crossing indicator is $1$ and a projective-only parser would reject it.</p>" }
];

(window.ALLML_CONTENT["8.20"] = window.ALLML_CONTENT["8.20"] || {}).applications = [
  { title: "Document understanding", background: "<p>Coreference links pronouns and names so downstream readers know which mentions describe the same real-world entity.</p>", numbers: "<p>In the lesson matrix, <b>Alice→she</b> scores $2$ and <b>Alice→Bob</b> scores $0$, so the pronoun link is ahead by $2-0=2$ points despite no shared surface tokens.</p>" },
  { title: "CRM entity merging", background: "<p>Customer and account systems cluster mentions into entity chains, making transitive mistakes expensive.</p>", numbers: "<p>Links $(0,1)$ and $(2,3)$ produce cluster ids $[0,0,1,1]$; adding a bad bridge $(1,2)$ can merge both clusters into one entity.</p>" },
  { title: "QA memory", background: "<p>Question answering needs coreference to know who <b>she</b>, <b>he</b>, or <b>it</b> refers to across sentences.</p>", numbers: "<p>The agreement mask has $M_{0,1}=1$ but $M_{0,2}=0$, so the impossible pair is removed before the normalized antecedent probability is computed.</p>" },
  { title: "News analytics", background: "<p>Analytic pipelines use entity chains to aggregate mentions of people, firms, or products across long articles.</p>", numbers: "<p>For distances $1$, $5$, and $12$, the lesson prior normalizes to $[0.640971,0.288007,0.071022]$; the nearest mention is about $0.640971/0.071022=9.025$ times the far one.</p>" },
  { title: "Evaluation dashboards", background: "<p>Coreference dashboards must show both pair quality and final entity-cluster quality because products consume clusters.</p>", numbers: "<p>With gold links $(0,1),(2,3)$ and predicted links $(0,1),(1,2)$, precision and recall are each $1/2=0.5$, so pairwise F1 is $0.5$.</p>" }
];

(window.ALLML_CONTENT["8.21"] = window.ALLML_CONTENT["8.21"] || {}).applications = [
  { title: "Event extraction", background: "<p>SRL turns text into event records such as seller, recipient, item, time, and location.</p>", numbers: "<p>In <b>Alice sold Bob a car</b>, predicate flags $[0,1,0,0,0]$ sum to $1$, so all role questions are anchored on the single predicate <b>sold</b>.</p>" },
  { title: "Contract analytics", background: "<p>Legal systems need role spans to know who must deliver, receive, pay, or approve an obligation.</p>", numbers: "<p>For role logits ARG0 $=2.5$, ARG1 $=0.4$, ARG2 $=1.2$, the lesson softmax gives $P(\textsf{ARG0})=0.717$, $P(\textsf{ARG1})=0.088$, and $P(\textsf{ARG2})=0.195$.</p>" },
  { title: "Search answers", background: "<p>Predicate-centered roles let search answer who-did-what queries instead of returning an unrelated keyword snippet.</p>", numbers: "<p>The duplicate local output $[\textsf{ARG0},\textsf{ARG1},\textsf{ARG1}]$ has $3$ assigned core roles but only $2$ distinct labels, so the uniqueness check fails.</p>" },
  { title: "Biomedical relation extraction", background: "<p>Biomedical SRL links treatments, patients, outcomes, and conditions while enforcing frame-specific role constraints.</p>", numbers: "<p>Candidate span scores $[0.1,2.0,0.5,1.5]$ choose index $1$, and the margin is $2.0-1.5=0.5$, a useful uncertainty signal for review.</p>" },
  { title: "Frame-specific NLP", background: "<p>Role numbers are interpreted inside a predicate frame, so the same ARG label can mean different things for different verbs.</p>", numbers: "<p>ARG2 flags $[1,1]$ have total support $2$, while ARG3 flags $[0,1]$ show the role is absent for one frame and present for another because $1\gt0$.</p>" }
];

(window.ALLML_CONTENT["8.22"] = window.ALLML_CONTENT["8.22"] || {}).applications = [
  { title: "Consumer translation", background: "<p>Consumer MT must preserve meaning while changing vocabulary and grammar, not merely copy source order.</p>", numbers: "<p>For the lesson toy $[\textsf{je},\textsf{mange}]\to[\textsf{I},\textsf{eat}]$, the lexical matrix has diagonal probabilities $0.9$ and $0.9$, so both source tokens align cleanly.</p>" },
  { title: "Localization QA", background: "<p>Localization checks catch word-order and agreement errors that dictionary substitution can miss.</p>", numbers: "<p>The lesson reordered sequence $[1,0,2]$ swaps the first two positions because at target position $0$ the source index is $1\ne0$ while index $2$ remains fixed.</p>" },
  { title: "MT evaluation", background: "<p>BLEU-style overlap is useful for regression checks but cannot prove meaning preservation.</p>", numbers: "<p>The exact toy candidate <b>I eat rice</b> versus reference <b>I eat rice</b> has $3$ matching unigrams out of $3$, so $\operatorname{BLEU1}=3/3=1.0$; harder D3–D5 translations must drop below this.</p>" },
  { title: "Beam search serving", background: "<p>Serving decoders normalize length so short clipped outputs do not beat complete translations just because they contain fewer log-probability terms.</p>", numbers: "<p>With log probabilities $-1.2$ and $-1.8$ and lengths $2$ and $4$, length-normalized scores are $-1.2/2^{0.6}=-0.792$ and $-1.8/4^{0.6}=-0.783$, so the longer candidate wins.</p>" },
  { title: "Coverage monitoring", background: "<p>Attention coverage checks whether important source positions were considered before the decoder produced fluent text.</p>", numbers: "<p>The lesson attention rows $[0.8,0.2]$, $[0.1,0.9]$, and $[0.4,0.6]$ each sum to $1.0$, and their strongest source positions are $[0,1,1]$.</p>" }
];

(window.ALLML_CONTENT["8.23"] = window.ALLML_CONTENT["8.23"] || {}).applications = [
  { title: "Support search", background: "<p>Extractive support QA returns the evidence span that answers a user's question in an article or ticket.</p>", numbers: "<p>For <b>Paris is in France</b>, the lesson probabilities put start mass $0.683$ and end mass $0.780$ on position $3$, giving legal span score $0.683\times0.780=0.533$.</p>" },
  { title: "Enterprise knowledge bots", background: "<p>Knowledge bots need abstention so they do not answer when the selected passage lacks evidence.</p>", numbers: "<p>The no-answer score $0.62$ beats the best span score $0.55$ by $0.62-0.55=0.07$, so the system should abstain.</p>" },
  { title: "Reading comprehension evals", background: "<p>The same passage can answer different questions, so evaluation checks the selected span rather than the passage alone.</p>", numbers: "<p>The triangular legal-span matrix for four tokens has chosen flattened index $3\times4+3=15$, matching the one-token answer at position $3$.</p>" },
  { title: "Retrieval-augmented QA", background: "<p>RAG separates document retrieval from span reading, and a retrieval miss cannot be fixed by a perfect reader.</p>", numbers: "<p>With query vector $[1,0]$, cosine scores for documents $[0.9,0.1]$, $[0,1]$, and $[0.7,0.3]$ are $0.994$, $0.000$, and $0.919$, so document $0$ wins.</p>" },
  { title: "Safety review", background: "<p>Generated or extractive answers should expose confidence because fluent text can still be weakly supported.</p>", numbers: "<p>Answer logits $[3,1,0.5]$ produce softmax probabilities $[0.821,0.111,0.067]$, so the top answer is above $0.8$ and far above alternatives.</p>" }
];

(window.ALLML_CONTENT["8.24"] = window.ALLML_CONTENT["8.24"] || {}).applications = [
  { title: "News digests", background: "<p>News summaries select salient, nonredundant sentences so a short digest covers more than one version of the lead fact.</p>", numbers: "<p>With salience $[0.9,0.4,0.8,0.2]$, the top score is $0.9$ and the runner-up is $0.8$, so the margin is only $0.1$.</p>" },
  { title: "Meeting notes", background: "<p>Meeting summarizers operate under a compression budget, but brevity alone does not prove useful coverage.</p>", numbers: "<p>For source length $120$ and summary lengths $20$, $40$, and $80$, compression ratios are $0.167$, $0.333$, and $0.667$.</p>" },
  { title: "Legal briefs", background: "<p>Legal summaries must reveal omitted facts because a concise brief can be misleading if the missing facts are material.</p>", numbers: "<p>Reference facts $\{a,b,c,d,e\}$ and candidate facts $\{a,b,c\}$ overlap in $3$ of $5$ facts, so $\operatorname{ROUGE_R}=3/5=0.6$ and two facts are absent.</p>" },
  { title: "Support-ticket summaries", background: "<p>Ticket summaries need diversity penalties so repeated evidence does not crowd out the resolution or customer outcome.</p>", numbers: "<p>With $\lambda=0.7$, salience $[0.9,0.8,0.7]$, and redundancy $[1.0,0.8,0.1]$, MMR scores are $[0.33,0.32,0.46]$, so sentence $2$ beats sentence $1$.</p>" },
  { title: "Medical discharge summaries", background: "<p>Clinical summarization must check facts against the source because abstraction can invent unsupported relations.</p>", numbers: "<p>Source indicators $[1,1,0,1]$ contain $3$ facts, while summary indicators $[1,0,0,1]$ preserve $2$, giving coverage $2/3=0.667$.</p>" }
];

/* ---- _apps-part08-E.js ---- */
/* All ML — Part 8 batch E applications for 8.25-8.28. */

(window.ALLML_CONTENT["8.25"] = window.ALLML_CONTENT["8.25"] || {}).applications = [
  {
    title: "Review sentiment scoring",
    background: "<p>Product review systems convert words into evidence so ranking, triage, or summary systems can use a document-level sentiment label.</p>",
    numbers: "<p>With vocabulary $[\\textsf{good},\\textsf{bad}]$, features $x=[2,0]$, and weights $w=[1.2,-1.5]$, the logit is $2(1.2)+0(-1.5)=2.4$. The probability is $1/(1+e^{-2.4})=0.917$, above the illustrative $0.9$ threshold.</p>"
  },
  {
    title: "Moderation queue thresholds",
    background: "<p>Moderation systems tune the operating threshold because acting on every uncertain item can overwhelm reviewers, while missing positives can be costly.</p>",
    numbers: "<p>The lesson thresholds $[0.3,0.5,0.7]$ have precision $[0.6,0.8,1.0]$ and recall $[1.0,0.8,0.5]$. Raising $\\tau$ from $0.3$ to $0.7$ increases precision by $0.4$ and decreases recall by $0.5$.</p>"
  },
  {
    title: "Support ticket routing",
    background: "<p>Support routing uses sentiment and urgency classifiers, but the confusion matrix tells operations teams what mistakes the queue will actually make.</p>",
    numbers: "<p>For $\\begin{bmatrix}8&2\\\\1&9\\end{bmatrix}$, diagonal correct predictions are $8+9=17$ out of $20$, so accuracy is $17/20=0.85$. The same table still has $2$ false positives and $1$ false negative.</p>"
  },
  {
    title: "Brand monitoring with negation",
    background: "<p>Brand monitors need phrase composition because counting positive words alone can turn complaints into false praise.</p>",
    numbers: "<p>The lesson scores $\\textsf{good}$ at $1.2$ and $\\textsf{not good}$ at $-0.8$. Their sigmoid values are $0.769$ and $0.310$, so the composed phrase reverses the positive unigram evidence.</p>"
  },
  {
    title: "Production vocabulary contracts",
    background: "<p>Serving systems freeze the vocabulary order so every learned weight continues to multiply the feature it was trained for.</p>",
    numbers: "<p>If the two lesson weights $[1.2,-1.5]$ are accidentally applied to swapped features $[0,2]$ instead of $[2,0]$, the logit changes from $2.4$ to $2(-1.5)=-3.0$, flipping a high-confidence positive into a negative.</p>"
  }
];

(window.ALLML_CONTENT["8.26"] = window.ALLML_CONTENT["8.26"] || {}).applications = [
  {
    title: "Booking assistants",
    background: "<p>Travel and appointment assistants maintain slot state so they ask for missing facts before executing an irreversible action.</p>",
    numbers: "<p>With required slots date $=1$, city $=0$, and time $=1$, the filled count is $1+0+1=2$ and the missing count is $3-2=1$. The city slot should trigger a follow-up instead of booking.</p>"
  },
  {
    title: "Customer support retrieval bots",
    background: "<p>Support bots rank candidate replies, but state completeness and safety must modify the nearest-neighbor response before it reaches a customer.</p>",
    numbers: "<p>The policy uses $\\cos(e_q,e_r)+\\beta\\operatorname{complete}(S)-\\gamma\\mathbb{1}[\\operatorname{safe}(r)\\lt\\tau]$. If an illustrative unsafe candidate has safety $0.2$ and $\\tau=0.5$, the penalty term activates because $0.2\\lt0.5$.</p>"
  },
  {
    title: "Intent routers",
    background: "<p>Multi-skill chat products use intent probabilities to route the current turn to booking, cancellation, small talk, or fallback policies.</p>",
    numbers: "<p>For intent logits $[2.0,0.5,0.1]$, softmax gives $[0.728,0.163,0.109]$. The booking intent wins because $0.728$ is larger than both alternatives.</p>"
  },
  {
    title: "Multi-turn memory",
    background: "<p>Dialogue memory lets later turns use facts that were provided earlier, instead of treating every message as isolated text.</p>",
    numbers: "<p>The lesson filled-slot sequence $[0,1,2,3]$ grows by $3-0=3$ from first to last turn. Resetting state would lose that accumulated information.</p>"
  },
  {
    title: "Safety fallback",
    background: "<p>Chat systems need controlled fallback for low-safety or low-confidence turns, even when the utterance looks like harmless chitchat.</p>",
    numbers: "<p>Safety scores $[0.95,0.6,0.2]$ with threshold $0.5$ produce no fallback for $0.95\\gt0.5$, but they do trigger fallback for $0.2\\lt0.5$.</p>"
  }
];

(window.ALLML_CONTENT["8.27"] = window.ALLML_CONTENT["8.27"] || {}).applications = [
  {
    title: "Multilingual sentiment models",
    background: "<p>Global sentiment classifiers share embedding geometry so labels learned in one language can help classify another language.</p>",
    numbers: "<p>The lesson cosine $\\cos(e_x,e_z)=\\frac{e_x^\\top e_z}{\\|e_x\\|\\|e_z\\|}$ divides by both norms. This prevents a longer vector from looking more similar merely because its magnitude is larger.</p>"
  },
  {
    title: "Low-resource transfer",
    background: "<p>Transfer learning helps smaller languages avoid being ignored when one language dominates the labeled dataset.</p>",
    numbers: "<p>English has $1000$ labeled examples and Swahili has $50$, so the ratio is $1000/50=20$. A global metric can look strong while the smaller language still fails.</p>"
  },
  {
    title: "Tokenizer coverage audits",
    background: "<p>Tokenizer audits measure whether scripts receive clean units before multilingual training begins.</p>",
    numbers: "<p>Coverage scores Latin $=1.0$, Cyrillic $=0.8$, and Arabic $=0.6$ give an Arabic-Latin gap of $1.0-0.6=0.4$ and a Cyrillic-Latin gap of $0.2$.</p>"
  },
  {
    title: "Cross-lingual retrieval",
    background: "<p>Search and question-answering systems retrieve across languages only when aligned embeddings put translations near one another.</p>",
    numbers: "<p>A label vector $[1,0]$ dotted with documents $[0.8,0.2]$, $[0.1,0.9]$, and $[0.7,0.3]$ gives scores $[0.8,0.1,0.7]$, so document $0$ wins.</p>"
  },
  {
    title: "Fair evaluation dashboards",
    background: "<p>Multilingual dashboards inspect sampling and per-language metrics so the training policy is visible instead of assumed fair.</p>",
    numbers: "<p>For losses $[0.2,0.5,1.0]$, inverse losses are $[5,2,1]$ with sum $8$, so weights are $[5/8,2/8,1/8]=[0.625,0.25,0.125]$.</p>"
  }
];

(window.ALLML_CONTENT["8.28"] = window.ALLML_CONTENT["8.28"] || {}).applications = [
  {
    title: "Analytics assistants",
    background: "<p>Text-to-SQL assistants let users ask natural-language business questions, but invalid grammar actions must be masked before decoding.</p>",
    numbers: "<p>With logits $[2,5,1,4]$ and mask $[1,0,1,0]$, invalid positions $1$ and $3$ get probability $0$. Softmax over valid logits $2$ and $1$ gives $[0.731,0,0.269,0]$.</p>"
  },
  {
    title: "BI dashboard schema linking",
    background: "<p>Dashboard query builders must link words to the right table columns before generating SQL that looks valid.</p>",
    numbers: "<p>For words $[\\textsf{highest},\\textsf{sales}]$ and columns $[\\textsf{revenue},\\textsf{region}]$, the sales-to-revenue score $0.9$ beats sales-to-region $0.2$ by margin $0.9-0.2=0.7$.</p>"
  },
  {
    title: "Data quality query checks",
    background: "<p>Data tools compare executed answers because two SQL strings can differ while returning the same denotation.</p>",
    numbers: "<p>Exact-match indicators $[1,0,0]$ sum to $1$, while execution indicators $[1,1,0]$ sum to $2$. Execution accuracy is therefore higher on this illustrative set.</p>"
  },
  {
    title: "Controlled code generation",
    background: "<p>Constrained decoders keep generated code inside the grammar state rather than trusting raw model logits.</p>",
    numbers: "<p>The probability formula $P(a_t=k\\mid a_{\\lt t},q,\\mathcal{S})=\\frac{m_k e^{z_k}}{\\sum_j m_j e^{z_j}}$ puts $m_k\\in\\{0,1\\}$ directly in the numerator and denominator.</p>"
  },
  {
    title: "Product support tooling",
    background: "<p>Internal support tools often generate small SQL queries, but syntax alone cannot prove they selected the right column, table, or aggregation.</p>",
    numbers: "<p>For target-column values $[10,30,20]$, a correct maximum query returns $30$ because $30\\gt20\\gt10$. A grammatical query over the wrong column could still execute and answer the wrong question.</p>"
  }
];

