/* All ML — authored content for Part 8: Sequence Models & NLP (except 8.11, already authored).
   Generated with verified companion notebooks; LaTeX via String.raw; no prose italics. */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

/* ---------------- 8.1 Text preprocessing & normalization ---------------- */

window.ALLML_CONTENT["8.1"] = {
  tagline: "Normalization is the quiet decision about which surface differences in text should count as the same token — made once, before any model sees a character.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.1-text-preprocessing.ipynb",
  context: String.raw`
    <p>This is the doorway every NLP system walks through first, and it rests on a few ideas you already hold.</p>
    <ul>
      <li><b>Equivalence relations</b> from discrete math are exactly what a normalizer builds: casefolding and Unicode folding declare that many surface strings — <b>Caf&eacute;</b>, <b>CAF&Eacute;</b>, <b>cafe</b> — all name one canonical class.</li>
      <li><b>Sets and counting</b> give the yardstick: normalization is judged by how much it shrinks the vocabulary (the set of distinct tokens) without erasing meaning.</li>
      <li><b>Unicode</b> is the character model underneath, where "one letter" can secretly be one code point or two, so byte equality and human equality disagree.</li>
    </ul>
    <p>Where it leads: every later NLP lesson consumes the stream this step produces. Tokenization (8.3) splits it into subwords; bag-of-words and TF-IDF (8.4) count these exact tokens; embeddings (8.6) assign a vector to each surviving vocabulary entry. A decision made here — to drop digits, to fold case — silently reshapes every count and every embedding downstream, which is why it earns its own lesson instead of being an afterthought.</p>`,
  intuition: String.raw`
    <p>The concrete problem: to a reader, <b>Caf&eacute;</b> and <b>CAF&Eacute;</b> and <b>cafe</b> are one word, but to a computer they are three different byte strings. If we model text as-is, the vocabulary fills with accidental variants, counts fragment across spellings, and the model wastes capacity learning that three strings mean the same thing.</p>
    <p>The naive fix is to hand-patch each variant as it appears. That collapses the moment a new capitalization, accent, or punctuation mark shows up. The durable fix is a single <b>normalization function</b> $n(\cdot)$ applied before anything else: map every surface form to one canonical form, so equality of meaning becomes equality of string.</p>
    <p>The design decision people gloss over is what to <b>throw away</b>. Every normalization is a deliberate, irreversible loss of information — the wise goal is not to keep everything, nor to strip everything, but to discard exactly the distinctions the downstream task does not need. Casefolding helps "The" match "the" but destroys "US" versus "us"; deleting punctuation cleans up noise but erases the currency mark in a price and the <b>+</b> in "C++". Normalization is where you decide, on purpose, what your model is allowed to still see.</p>`,
  mathematics: String.raw`
    <p>Write normalization as a function $n:\Sigma^\ast\to\Sigma^\ast$ from raw strings to a canonical form; two strings are treated as the same token exactly when $n(a)=n(b)$. Every choice below is one more rule folded into $n$.</p>
    <div class="formula-box">$$n:\Sigma^\ast\to\Sigma^\ast,\qquad a\equiv b \iff n(a)=n(b)$$</div>

    <p><b>Folding collapses accidental variants.</b> Take the raw string <b>"Caf&eacute; CAF&Eacute; cafe!"</b>. Casefold it, strip the accent, and drop the trailing punctuation, and all three words collapse to <b>"cafe cafe cafe"</b>:</p>
    <ol class="work">
      <li>distinct words before normalization — the three surface forms <b>Caf&eacute;</b>, <b>CAF&Eacute;</b>, <b>cafe!</b> — give vocabulary size $3$</li>
      <li>distinct words after normalization — all map to <b>cafe</b> — give vocabulary size $1$</li>
    </ol>
    <p>Three surface forms became one token, and the vocabulary shrank from $3$ to $1$. That is the whole point in miniature: the counts a model later learns from now concentrate on one entry instead of scattering across three.</p>

    <p><b>Unicode makes "equal" ambiguous.</b> The single visible word <b>Caf&eacute;</b> can be stored two ways. Precomposed, the <b>&eacute;</b> is one code point and the string has length $4$; decomposed, it is an <b>e</b> followed by a combining acute accent and the string has length $5$. Byte-for-byte they differ, so a naive equality test calls them different words:</p>
    <ol class="work">
      <li>length decomposed $=5$, length precomposed $=4$</li>
      <li>after applying Unicode NFC, both become the same $4$-code-point string, so they finally compare equal</li>
    </ol>
    <p>Without this step, two identical-looking words never match and their counts split across invisible twins; with it they collapse before any counting happens. This is the failure that hides longest, because the two strings look the same on screen.</p>

    <p><b>Punctuation policy is signal, not just noise.</b> Take a promo line whose words are <b>Win</b>, a currency amount, and <b>now</b> buried in stray symbols and exclamation marks. Normalize it two ways, then split on whitespace:</p>
    <ol class="work">
      <li>keep alphanumerics: tokens $=[\textsf{win},\ \textsf{5000},\ \textsf{now}]$, count $3$</li>
      <li>keep letters only, dropping digits: tokens $=[\textsf{win},\ \textsf{now}]$, count $2$</li>
    </ol>
    <p>The stricter policy deleted the token <b>5000</b> — the one word carrying the amount. Whether that is cleaning or vandalism depends entirely on the task: for topic classification the number may be noise, for spam or price detection it is the signal. The arithmetic makes the tradeoff impossible to wave away.</p>

    <p><b>Stop-word removal can quietly flip meaning.</b> Start from <b>"the model is not bad"</b> and remove function words:</p>
    <ol class="work">
      <li>safe stoplist $\{\textsf{the},\textsf{is}\}$: tokens $=[\textsf{model},\textsf{not},\textsf{bad}]$</li>
      <li>over-eager stoplist $\{\textsf{the},\textsf{is},\textsf{not}\}$: tokens $=[\textsf{model},\textsf{bad}]$</li>
    </ol>
    <p>The second list treated <b>not</b> as a throwaway function word and, in doing so, turned a positive sentence into a negative one. "Unimportant" is defined by the task: negation is invisible grammar to a topic model and the entire signal to a sentiment model.</p>

    <p><b>Padding adds slots, not tokens.</b> A batch needs equal lengths, so short sequences are padded to a common width $\text{maxlen}=4$ with a placeholder, and a boolean mask records which positions are real:</p>
    <ol class="work">
      <li>three sequences of lengths $2,4,1$ padded with $\langle\text{pad}\rangle$ to width $4$</li>
      <li>the mask is $\text{True}$ on real positions; total real tokens $=2+4+1=7$ out of $12$ slots</li>
    </ol>
    <p>The $7$ is what the model must attend to; the other $5$ slots are scaffolding. Forgetting the mask lets $\langle\text{pad}\rangle$ leak into averages and attention as if it were a word — a bug that never raises an error, it just quietly biases every result.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Casefolding meaning-bearing case.</b> Folding "US" to "us" or "Apple" to "apple" collapses a named entity into a common word; the mechanism is $n(\cdot)$ merging two classes the task needed kept apart.</li>
      <li><b>Silent Unicode mismatches.</b> Two on-screen-identical words that differ as code points never match unless you apply NFC first — the counts split across invisible twins and nothing warns you.</li>
      <li><b>Stripping punctuation that was the signal.</b> Deleting digits and symbols erases prices, code tokens, and emoticons; the punctuation example showed the token <b>5000</b> disappear under a stricter policy.</li>
      <li><b>Over-eager stop lists deleting negation.</b> Dropping "not"/"no"/"never" flips sentiment, exactly as $[\textsf{model},\textsf{not},\textsf{bad}]$ became $[\textsf{model},\textsf{bad}]$ above.</li>
      <li><b>Counting padding as real.</b> If the mask is ignored, $\langle\text{pad}\rangle$ positions enter means and attention; the count should be the $7$ real tokens, not the $12$ padded slots.</li>
      <li><b>Different normalization at train and inference.</b> If $n(\cdot)$ is not byte-identical in both places, tokens that trained as one class arrive out-of-vocabulary at serving time.</li>
    </ul>`
};

window.ALLML_CONTENT["8.2"] = { tagline:"Edit distance turns spelling disagreement into the cheapest sequence of edits, so fuzzy matching becomes a table you can audit instead of a guess.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.2-edit-distance.ipynb", context:String.raw`
    <p>This is the string-algorithm bridge between raw text and tolerant NLP systems.</p>
    <ul>
      <li><b>Dynamic programming</b> supplies the grid: every prefix pair stores the best cost already known, so the full string comparison is built from smaller comparisons.</li>
      <li><b>Graphs</b> give the mental model: insert, delete, and substitute are edges, and the distance is the shortest path from one word to another.</li>
      <li><b>Token normalization (8.1)</b> decides which character differences remain before the edit table ever sees the strings.</li>
    </ul>
    <p>Where it leads: edit distance supports spelling correction before tokenization (8.3), approximate vocabulary lookup for bag-of-words models (8.4), and sequence evaluation ideas that later reappear when encoder-decoder models (8.10) must be judged against target strings.</p>`, intuition:String.raw`
    <p>The concrete pain is that exact string equality is brittle. A search box should probably connect <b>color</b> with <b>colour</b>, but a raw equality test says they are unrelated.</p>
    <p>The naive fix is a pile of hand-written misspelling rules. That fails because the space of possible typos is enormous: a missing character, an extra character, and a wrong character all need the same disciplined accounting. Edit distance replaces the rule pile with one reusable question: what is the cheapest repair script from source to target?</p>
    <p>The design decision people gloss over is the cost model. If substitution costs the same as delete-plus-insert, <b>cat</b> to <b>cut</b> is one edit; if substitution is expensive, the algorithm may prefer a different path. The table is not merely computing similarity — it is encoding what kinds of mistakes your application considers plausible.</p>`, mathematics:String.raw`
    <p>For source string $a_1,\dots,a_m$ and target string $b_1,\dots,b_n$, let $D_{i,j}$ be the minimum edit cost from the first $i$ source characters to the first $j$ target characters:</p>
    <div class="formula-box">$$D_{i,j}=\min\{D_{i-1,j}+1,\;D_{i,j-1}+1,\;D_{i-1,j-1}+\mathbf{1}[a_i\ne b_j]\}$$</div>
    <p>The boundary values are $D_{i,0}=i$ and $D_{0,j}=j$ because an empty string can only be reached by deleting or inserting every character.</p>

    <p><b>A one-letter substitution fills the table cleanly.</b> For <b>cat</b> to <b>cut</b>, the final dynamic-programming matrix is:</p>
    <ol class="work">
      <li>row for empty source: $[0,1,2,3]$</li>
      <li>row after <b>c</b>: $[1,0,1,2]$</li>
      <li>row after <b>a</b>: $[2,1,1,2]$</li>
      <li>row after <b>t</b>: $[3,2,2,1]$, so $D_{3,3}=1$</li>
    </ol>
    <p>The diagonal match on <b>c</b>, the substitution <b>a</b> to <b>u</b>, and the match on <b>t</b> make the cost exactly one.</p>

    <p><b>The three primitive edit types have the same unit price here.</b> Comparing <b>cat</b> with three neighbors isolates each operation:</p>
    <ol class="work">
      <li><b>cat</b> to <b>cats</b>: insert <b>s</b>, distance $1$</li>
      <li><b>cat</b> to <b>cut</b>: substitute <b>a</b> with <b>u</b>, distance $1$</li>
      <li><b>cat</b> to <b>at</b>: delete <b>c</b>, distance $1$</li>
    </ol>
    <p>Because all three costs are equal, the number $1$ means one atomic string repair rather than one particular kind of repair.</p>

    <p><b>A famous longer pair exposes path composition.</b> For <b>kitten</b> to <b>sitting</b>, the computed distance is $3$:</p>
    <ol class="work">
      <li><b>kitten</b> to <b>sitten</b>: substitute <b>k</b> with <b>s</b>, cost $1$</li>
      <li><b>sitten</b> to <b>sittin</b>: substitute <b>e</b> with <b>i</b>, cumulative cost $2$</li>
      <li><b>sittin</b> to <b>sitting</b>: insert <b>g</b>, cumulative cost $3$</li>
    </ol>
    <p>The DP table proves there is no two-edit shortcut, so the familiar script is not just plausible; it is optimal under unit costs.</p>

    <p><b>Changing substitution cost changes the measured distance.</b> Recompute <b>cat</b> to <b>cut</b> with substitution costs $1,2,3$:</p>
    <ol class="work">
      <li>substitution cost $1$: one substitution costs $1$</li>
      <li>substitution cost $2$: substitute once or delete-plus-insert both cost $2$</li>
      <li>substitution cost $3$: delete <b>a</b> and insert <b>u</b> costs $2$, so the distance stays $2$</li>
    </ol>
    <p>The values $[1,2,2]$ show why costs are modeling assumptions: after substitution becomes too expensive, the algorithm routes around it.</p>

    <p><b>Approximate retrieval is a radius query.</b> With query <b>color</b> and candidates <b>colour</b>, <b>colon</b>, <b>cold</b>, <b>caller</b>, <b>color</b>:</p>
    <ol class="work">
      <li>distances are $[1,1,2,3,0]$ in that order</li>
      <li>the exact best match is <b>color</b> because its distance is $0$</li>
      <li>an edit radius of $2$ accepts $4$ of the $5$ words and rejects only <b>caller</b></li>
    </ol>
    <p>A fuzzy matcher is therefore not magic; it is the set of strings whose table endpoint falls below a chosen threshold.</p>`, pitfalls:String.raw`
    <ul>
      <li><b>Using the wrong boundary row.</b> If $D_{i,0}=i$ or $D_{0,j}=j$ is omitted, insertions and deletions at the beginning become artificially cheap.</li>
      <li><b>Treating the threshold as universal.</b> Radius $2$ accepts <b>cold</b> for <b>color</b>; that may help search but harm entity matching where near misses are distinct names.</li>
      <li><b>Forgetting the cost model.</b> The values $[1,2,2]$ for <b>cat</b> to <b>cut</b> show that a substitution penalty can change both the number and the preferred edit script.</li>
      <li><b>Comparing unnormalized text.</b> Accent and case differences from 8.1 can add edit costs that are not real spelling errors.</li>
      <li><b>Reading distance as semantic similarity.</b> <b>colon</b> is one edit from <b>color</b>, but the meanings are unrelated; $D_{m,n}$ measures surface repair, not concept closeness.</li>
    </ul>` };

window.ALLML_CONTENT["8.3"] = { tagline:"Subword tokenization is the compromise that lets text stay open-vocabulary without making every character its own word.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.3-tokenization.ipynb", context:String.raw`
    <p>This lesson is where normalized characters become the units a language model can count, embed, and generate.</p>
    <ul>
      <li><b>Greedy compression</b> explains BPE: repeatedly merge the most frequent adjacent pair so common fragments become single symbols.</li>
      <li><b>Vocabulary design</b> controls the tradeoff between word-level unknowns and character-level length.</li>
      <li><b>Probability</b> enters SentencePiece, where a segmentation can be scored by the likelihood of its pieces.</li>
    </ul>
    <p>Where it leads: bag-of-words (8.4) counts the tokens chosen here, n-gram models (8.5) estimate next-token probabilities over this vocabulary, and Transformers (8.12) inherit both the strengths and oddities of the subword inventory.</p>`, intuition:String.raw`
    <p>The concrete problem is that natural language keeps inventing new surface forms. A word-level system sees <b>lowest</b> as unknown if it trained only on <b>low</b> and <b>lower</b>; a character-level system avoids unknowns but makes every sentence painfully long.</p>
    <p>Subword tokenizers take the middle road. They learn reusable chunks such as <b>lo</b>, <b>low</b>, or continuation pieces, so rare words can be assembled from known parts while frequent words remain short.</p>
    <p>The hidden design decision is the granularity budget. A larger vocabulary shortens sequences but memorizes more surface forms; a smaller vocabulary generalizes better to new words but makes the model process more positions. Tokenization is therefore not a preprocessing detail — it fixes the alphabet on which every later probability and attention pattern is defined.</p>`, mathematics:String.raw`
    <p>For BPE, if $V$ is the current list of tokenized words, the next merge chooses the adjacent pair with largest corpus count:</p>
    <div class="formula-box">$$(x^\star,y^\star)=\arg\max_{(x,y)}\sum_{w\in V}\operatorname{count}_{w}(x,y)$$</div>
    <p>After the merge, every adjacent occurrence of $x,y$ is replaced by the single symbol $xy$.</p>

    <p><b>Pair counts decide the first BPE merge.</b> In <b>low</b>, <b>lower</b>, <b>newest</b>, <b>widest</b> with end markers:</p>
    <ol class="work">
      <li>the pair $(\textsf{l},\textsf{o})$ occurs in <b>low</b> and <b>lower</b>, so its count is $2$</li>
      <li>$(\textsf{o},\textsf{w})$ also has count $2$</li>
      <li>$(\textsf{e},\textsf{s})$, $(\textsf{s},\textsf{t})$, and $(\textsf{t},\langle/\textsf{w}\rangle)$ also reach $2$</li>
      <li>the implementation's first maximum is $(\textsf{l},\textsf{o})$, so the learned merge is <b>lo</b></li>
    </ol>
    <p>The tie is real; deterministic tie-breaking becomes part of the tokenizer, which is why two BPE trainers can differ even on the same corpus.</p>

    <p><b>A merge shortens a common fragment.</b> The word <b>low</b> with an end marker is represented as characters before the merge and as one larger chunk after it:</p>
    <ol class="work">
      <li>before merging: $[\textsf{l},\textsf{o},\textsf{w},\textsf{_}]$ has length $4$</li>
      <li>after merging <b>lo</b>: $[\textsf{lo},\textsf{w},\textsf{_}]$ has length $3$</li>
      <li>the local saving is $4-3=1$ token position</li>
    </ol>
    <p>That one saved position looks small, but frequent fragments pay back their merge across millions of sentences.</p>

    <p><b>Subwords prevent unknown whole words.</b> With vocabulary $\{\textsf{low},\textsf{lower}\}$ and the word <b>lowest</b>:</p>
    <ol class="work">
      <li>word-level lookup fails, so the token list is $[\langle\textsf{unk}\rangle]$ with length $1$</li>
      <li>subword segmentation gives $[\textsf{low},\textsf{est}]$ with length $2$</li>
      <li>the first subword is the known stem <b>low</b>, so the model keeps useful lexical evidence</li>
    </ol>
    <p>The subword version is longer, but it is learnable; the unknown token throws away the word's internal structure.</p>

    <p><b>WordPiece continuation markers preserve boundaries.</b> For pieces <b>play</b>, <b>##ing</b>, <b>play</b>, <b>##er</b>, <b>un</b>, <b>##play</b>, <b>##able</b>:</p>
    <ol class="work">
      <li>continuation pieces are those beginning with <b>##</b></li>
      <li>there are $4$ continuations out of $7$ total pieces</li>
      <li>the continuation fraction is $4/7\approx0.571$</li>
    </ol>
    <p>The marker tells the model and the detokenizer that <b>##ing</b> is not a fresh word; it attaches to the previous piece.</p>

    <p><b>SentencePiece can choose by segmentation probability.</b> For segmenting <b>there</b>:</p>
    <ol class="work">
      <li>$P([\textsf{the},\textsf{re}])=0.32$</li>
      <li>$P([\textsf{ther},\textsf{e}])=0.18$</li>
      <li>$P([\textsf{t},\textsf{here}])=0.05$</li>
      <li>the highest score is $0.32$, so the chosen split is $[\textsf{the},\textsf{re}]$</li>
    </ol>
    <p>Unlike a pure merge history, the unigram view lets multiple possible segmentations compete explicitly.</p>`, pitfalls:String.raw`
    <ul>
      <li><b>Ignoring tie-breaking in BPE.</b> Several pairs have count $2$ above; if the trainer chooses a different maximum than $(\textsf{l},\textsf{o})$, downstream token ids change.</li>
      <li><b>Confusing no unknowns with no cost.</b> <b>lowest</b> becomes two subwords instead of one unknown, but the sequence is longer and attention must process the extra position.</li>
      <li><b>Dropping continuation markers.</b> Removing <b>##</b> loses boundary information and can make detokenization join or split words incorrectly.</li>
      <li><b>Training and serving with different vocabularies.</b> The merge equation defines token identities; a mismatch makes the same text become different ids.</li>
      <li><b>Choosing vocabulary size without measuring length.</b> The merge from $4$ to $3$ positions is the basic currency; if you never measure average positions, you cannot price the tokenizer.</li>
    </ul>` };

window.ALLML_CONTENT["8.4"] = { tagline:"Bag-of-words deliberately forgets order, then TF-IDF asks which surviving words are common enough to trust and rare enough to matter.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.4-bow-tfidf.ipynb", context:String.raw`
    <p>This is the simplest useful way to turn a document into a vector.</p>
    <ul>
      <li><b>Counting</b> builds the document-term matrix, one row per document and one column per vocabulary word.</li>
      <li><b>Normalization</b> turns raw counts into term frequencies so long documents do not win merely by being long.</li>
      <li><b>Vector geometry</b> supplies cosine similarity, which compares document direction after TF-IDF weighting.</li>
    </ul>
    <p>Where it leads: n-gram models (8.5) restore a little order to these counts, embeddings (8.6) replace sparse columns with dense meaning vectors, and modern retrieval systems still keep TF-IDF's rare-term instinct inside stronger models.</p>`, intuition:String.raw`
    <p>The concrete problem is that classifiers and retrieval systems need numbers, not paragraphs. Bag-of-words makes the most brutal useful move: ignore word order and record which vocabulary items appear.</p>
    <p>The naive count vector has a weakness. Words such as <b>sat</b> or <b>cat</b> may appear in many documents, while a rarer word such as <b>fish</b> can be more diagnostic. TF-IDF fixes the imbalance by multiplying within-document frequency by a corpus-wide rarity weight.</p>
    <p>The design decision people underplay is what information you are willing to discard. Bag-of-words cannot distinguish <b>dog bites man</b> from <b>man bites dog</b>; in exchange, it gives a sparse, transparent vector whose largest coordinates can be inspected by a human.</p>`, mathematics:String.raw`
    <p>For document $d$ and term $t$, TF-IDF multiplies local frequency by inverse document frequency over $N$ documents:</p>
    <div class="formula-box">$$w_{d,t}=\operatorname{tf}_{d,t}\left(\log\frac{1+N}{1+\operatorname{df}_t}+1\right)$$</div>
    <p>Here $\operatorname{df}_t$ is the number of documents containing term $t$ at least once.</p>

    <p><b>The count matrix fixes the vocabulary axes.</b> For documents <b>cat sat</b>, <b>cat ate fish</b>, and <b>dog sat</b>, the sorted vocabulary is $[\textsf{ate},\textsf{cat},\textsf{dog},\textsf{fish},\textsf{sat}]$:</p>
    <ol class="work">
      <li>$d_0=[0,1,0,0,1]$</li>
      <li>$d_1=[1,1,0,1,0]$</li>
      <li>$d_2=[0,0,1,0,1]$</li>
      <li>the matrix shape is $3\times5$</li>
    </ol>
    <p>Every later calculation uses these same five coordinates; changing vocabulary order changes the vector representation.</p>

    <p><b>Binary presence drops repeated-count information.</b> In this tiny corpus, all nonzero counts are already one:</p>
    <ol class="work">
      <li>document presence counts are $2$, $3$, and $2$ across the three rows</li>
      <li>the total number of one entries is $2+3+2=7$</li>
      <li>the binary matrix therefore has $7$ active entries out of $15$ possible entries</li>
    </ol>
    <p>Binary bag-of-words is useful when occurrence matters more than repetition, but it cannot tell one mention from ten.</p>

    <p><b>Term frequency corrects for document length.</b> For <b>cat cat sat</b>:</p>
    <ol class="work">
      <li>the document length is $3$ tokens</li>
      <li><b>cat</b> appears $2$ times, so $\operatorname{tf}=2/3=0.667$</li>
      <li><b>sat</b> appears $1$ time, so $\operatorname{tf}=1/3=0.333$</li>
      <li><b>ate</b>, <b>dog</b>, and <b>fish</b> each have term frequency $0$</li>
    </ol>
    <p>The vector now says that <b>cat</b> is twice as prominent as <b>sat</b> inside this document.</p>

    <p><b>IDF rewards rarer columns.</b> With $N=3$ documents:</p>
    <ol class="work">
      <li>$\operatorname{df}_{\textsf{cat}}=2$, so $\operatorname{idf}_{\textsf{cat}}=\log(4/3)+1=1.288$</li>
      <li>$\operatorname{df}_{\textsf{fish}}=1$, so $\operatorname{idf}_{\textsf{fish}}=\log(4/2)+1=1.693$</li>
      <li>the rare word's advantage is $1.693-1.288=0.405$</li>
    </ol>
    <p>The formula does not know that fish is meaningful; it only knows that fish appears in fewer documents, which is often a good retrieval clue.</p>

    <p><b>Cosine similarity retrieves the topical row.</b> For a query containing <b>cat</b> and <b>fish</b>:</p>
    <ol class="work">
      <li>the TF-IDF cosine scores are $[0.428,0.782,0.000]$ for $d_0,d_1,d_2$</li>
      <li>$d_1$ wins because it contains both query terms</li>
      <li>$d_2$ scores $0$ because it has neither <b>cat</b> nor <b>fish</b></li>
    </ol>
    <p>The retrieval result is transparent: the largest score is exactly the document whose weighted coordinates overlap the query best.</p>`, pitfalls:String.raw`
    <ul>
      <li><b>Losing negation and order.</b> The document-term matrix has no slot for word position, so phrase meaning can disappear even when every count is correct.</li>
      <li><b>Mixing vocabularies between train and serve.</b> The vector $[0,1,0,0,1]$ only means <b>cat sat</b> under the fixed vocabulary order above.</li>
      <li><b>Using raw counts for long-document retrieval.</b> Without the TF part of $w_{d,t}$, longer documents can dominate because they have more opportunities to contain every word.</li>
      <li><b>Forgetting IDF smoothing.</b> The smoothing convention uses $1+N$ and $1+\operatorname{df}$; dropping those terms changes every weight and can create division problems for unseen terms.</li>
      <li><b>Interpreting cosine zero as unrelated meaning.</b> The $0.000$ for $d_2$ only says there is no shared weighted vocabulary with the query, not that a dog document is conceptually irrelevant forever.</li>
    </ul>` };

window.ALLML_CONTENT["8.5"] = { tagline:"An n-gram model is language modeling before neural networks: predict the next token by trusting the counts that followed the same short history before.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.5-ngram-language-models.ipynb", context:String.raw`
    <p>This lesson puts probability directly on token sequences using only local histories.</p>
    <ul>
      <li><b>Conditional probability</b> turns counts of histories and next tokens into $P(\text{next}\mid\text{history})$.</li>
      <li><b>Maximum likelihood</b> explains why count ratios are the natural estimates when the model class is fixed.</li>
      <li><b>Smoothing</b> prevents unseen continuations from receiving impossible zero probability.</li>
    </ul>
    <p>Where it leads: RNNs (8.7) replace the fixed short history with a hidden state, LSTMs and GRUs (8.8, 8.9) make that state easier to preserve, and encoder-decoder models (8.10) generate target sequences one token at a time.</p>`, intuition:String.raw`
    <p>The concrete problem is next-word prediction without a deep model. If the history is <b>a</b>, the corpus itself can tell us what usually came next.</p>
    <p>The naive unigram model ignores context completely; it knows <b>a</b> is frequent but not what follows <b>a</b>. Bigram and n-gram models add a short memory by conditioning on the previous token or previous few tokens.</p>
    <p>The overlooked design decision is what to do with events you did not see. A pure count ratio assigns zero probability to unseen continuations, which makes an entire sentence probability collapse to zero. Smoothing spends a little probability mass on the unseen so the model can survive novelty.</p>`, mathematics:String.raw`
    <p>For a bigram model with add-$\alpha$ smoothing over vocabulary $V$, the next-token probability after history $h$ is:</p>
    <div class="formula-box">$$P(w\mid h)=\frac{c(h,w)+\alpha}{\sum_{v\in V}c(h,v)+\alpha |V|}$$</div>
    <p>With $\alpha=0$, this is the raw maximum-likelihood count ratio; with $\alpha=1$, it is add-one smoothing.</p>

    <p><b>Unigram counts establish the base rates.</b> In the corpus <b>a b a b a c</b>:</p>
    <ol class="work">
      <li>the vocabulary is $[\textsf{a},\textsf{b},\textsf{c}]$</li>
      <li>counts are $[3,2,1]$</li>
      <li>the total token count is $3+2+1=6$</li>
      <li>the unigram probability of <b>a</b> is $3/6=0.5$</li>
    </ol>
    <p>Unigrams know that <b>a</b> is common, but they do not know that <b>a</b> is usually followed by <b>b</b>.</p>

    <p><b>Bigram counts condition on the current token.</b> The continuations after <b>a</b> are <b>b</b>, <b>b</b>, and <b>c</b>:</p>
    <ol class="work">
      <li>the row of counts for history <b>a</b> is $[0,2,1]$ over $[\textsf{a},\textsf{b},\textsf{c}]$</li>
      <li>the row sum is $3$</li>
      <li>raw probabilities are $[0/3,2/3,1/3]=[0.000,0.667,0.333]$</li>
    </ol>
    <p>The model has learned a local grammar for this toy corpus: after <b>a</b>, <b>b</b> is twice as likely as <b>c</b>.</p>

    <p><b>Add-one smoothing rescues unseen events.</b> Apply $\alpha=1$ to the same row:</p>
    <ol class="work">
      <li>add one to each count: $[0,2,1]+[1,1,1]=[1,3,2]$</li>
      <li>the denominator becomes $3+3=6$</li>
      <li>smoothed probabilities are $[1/6,3/6,2/6]=[0.167,0.500,0.333]$</li>
    </ol>
    <p>The unseen transition <b>a</b> to <b>a</b> now has nonzero mass, paid for by lowering the observed transition to <b>b</b>.</p>

    <p><b>Perplexity prices a whole sequence.</b> For <b>a b a c</b>, the bigram probabilities are:</p>
    <ol class="work">
      <li>$P(\textsf{b}\mid\textsf{a})=2/3=0.667$</li>
      <li>$P(\textsf{a}\mid\textsf{b})=1.000$</li>
      <li>$P(\textsf{c}\mid\textsf{a})=1/3=0.333$</li>
      <li>$\exp(-\operatorname{mean}(\log p))=1.6509636244473134$</li>
    </ol>
    <p>Perplexity is the model's average branching factor: here it behaves as though it were choosing among about $1.65$ plausible next tokens at each step.</p>

    <p><b>Greedy generation follows the largest smoothed count.</b> Starting at <b>a</b> and repeatedly choosing the maximum smoothed probability:</p>
    <ol class="work">
      <li>from <b>a</b>, the largest probability is for <b>b</b>, so the path begins $[\textsf{a},\textsf{b}]$</li>
      <li>from <b>b</b>, the largest probability is for <b>a</b>, so it becomes $[\textsf{a},\textsf{b},\textsf{a}]$</li>
      <li>after four generated moves, the full path is $[\textsf{a},\textsf{b},\textsf{a},\textsf{b},\textsf{a}]$</li>
    </ol>
    <p>The model loops because its counts loop; n-grams generate the habits of the training corpus with very little abstraction.</p>`, pitfalls:String.raw`
    <ul>
      <li><b>Letting zeros kill sentences.</b> Without the $+\alpha$ term, one unseen transition makes the product probability zero and perplexity unusable.</li>
      <li><b>Trusting long histories with tiny data.</b> As $n$ grows, rows become sparse; the bigram row $[0,2,1]$ is already thin in a six-token corpus.</li>
      <li><b>Forgetting to condition on the row sum.</b> Dividing by total corpus length instead of $\sum_v c(h,v)$ gives the wrong conditional distribution.</li>
      <li><b>Reading greedy output as typical language.</b> The path $a,b,a,b,a$ is the argmax loop, not a representative sample from the full distribution.</li>
      <li><b>Comparing perplexities across different tokenizers.</b> A model over subwords from 8.3 has a different event space than a word-level model, so raw perplexity is not directly comparable.</li>
    </ul>` };

window.ALLML_CONTENT["8.6"] = { tagline:"Word embeddings make the distributional hunch geometric: words that live in similar neighborhoods learn vectors that point in similar directions.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.6-word-embeddings.ipynb", context:String.raw`
    <p>This lesson replaces sparse word-count columns with dense coordinates learned from context.</p>
    <ul>
      <li><b>Co-occurrence statistics</b> provide the raw evidence: nearby words create counts that reveal usage patterns.</li>
      <li><b>Matrix weighting</b> such as PPMI emphasizes surprising pairs rather than merely frequent pairs.</li>
      <li><b>Vector geometry</b> turns similarity and analogy into dot products, cosines, and offsets.</li>
    </ul>
    <p>Where it leads: RNNs (8.7) consume embeddings at each time step, LSTMs and GRUs (8.8, 8.9) preserve information from those embedded tokens, and seq2seq systems (8.10) learn source and target embedding spaces for generation.</p>`, intuition:String.raw`
    <p>The concrete problem with one-hot words is that every word is equally far from every other word. <b>king</b> and <b>queen</b> share no coordinates, even though their contexts are deeply related.</p>
    <p>Embeddings fix that by learning dense vectors from the company words keep. Word2Vec predicts context from a center word, GloVe factorizes global co-occurrence structure, and FastText shares character n-grams so related surface forms can share parameters.</p>
    <p>The design decision people rush past is what counts as context. A narrow window emphasizes syntax and local substitutions; a wide window emphasizes topic. The vector space inherits that choice, so geometry is never pure meaning detached from the data collection rule.</p>`, mathematics:String.raw`
    <p>In skip-gram Word2Vec, a center word $w$ predicts a context word $c$ through a softmax over output vectors $u$ and input vector $v_w$:</p>
    <div class="formula-box">$$P(c\mid w)=\frac{\exp(u_c^\top v_w)}{\sum_{j\in V}\exp(u_j^\top v_w)}$$</div>
    <p>GloVe and PPMI start from co-occurrence counts instead, but they are chasing the same geometry: nearby vectors for words with related contexts.</p>

    <p><b>Co-occurrence counts encode neighborhood evidence.</b> For words <b>king</b>, <b>queen</b>, <b>man</b>, <b>woman</b>, the count matrix has row sums $10$:</p>
    <ol class="work">
      <li>$C_{\textsf{king},\textsf{man}}=5$</li>
      <li>$C_{\textsf{queen},\textsf{woman}}=5$</li>
      <li>each of the four rows sums to $10$, so the corpus total is $40$</li>
    </ol>
    <p>The paired counts already hint at structure: royal words and gendered words co-occur in a patterned way.</p>

    <p><b>PPMI keeps surprising associations.</b> For <b>king</b> with <b>man</b>:</p>
    <ol class="work">
      <li>observed count is $5$ and total count is $40$</li>
      <li>the row total and column total are both $10$</li>
      <li>$\log((5\cdot40)/(10\cdot10))=\log 2=0.693$</li>
      <li>PPMI keeps $0.693$ because it is positive</li>
    </ol>
    <p>A raw count of five becomes evidence of surprise because it is twice what independence would suggest.</p>

    <p><b>Cosine similarity reads vector direction.</b> With toy vectors for <b>king</b>, <b>queen</b>, <b>man</b>, and <b>car</b>:</p>
    <ol class="work">
      <li>$\cos(\textsf{king},\textsf{queen})=0.9986178293325095$</li>
      <li>$\cos(\textsf{king},\textsf{man})=0.9986178293325095$</li>
      <li>$\cos(\textsf{king},\textsf{car})=-0.9999999999999998$</li>
    </ol>
    <p>The model puts <b>car</b> in the opposite direction while keeping the human and royal terms almost aligned.</p>

    <p><b>Analogy uses vector offsets.</b> In the toy plane:</p>
    <ol class="work">
      <li>$\textsf{king}=[2,1]$</li>
      <li>$\textsf{man}=[1,0]$ and $\textsf{woman}=[1,2]$</li>
      <li>$\textsf{king}-\textsf{man}+\textsf{woman}=[2,1]-[1,0]+[1,2]=[2,3]$</li>
      <li>the constructed <b>queen</b> point is $[2,3]$</li>
    </ol>
    <p>The arithmetic says that relations can become directions, though real analogy quality depends on training data and evaluation.</p>

    <p><b>FastText shares subword evidence.</b> Character trigrams for <b>play</b>, <b>playing</b>, and <b>played</b> overlap:</p>
    <ol class="work">
      <li><b>play</b> has trigrams $\{\textsf{pla},\textsf{lay}\}$</li>
      <li>Jaccard overlap with <b>playing</b> is $2/5=0.4$</li>
      <li>Jaccard overlap with <b>played</b> is $2/4=0.5$</li>
    </ol>
    <p>Subword sharing lets related forms borrow statistical strength even when a full word is rare.</p>`, pitfalls:String.raw`
    <ul>
      <li><b>Mistaking cosine for truth.</b> The cosine numbers reflect the training contexts and vector construction, not a guaranteed semantic ontology.</li>
      <li><b>Forgetting negative or missing evidence.</b> PPMI clips negative values to zero, so it preserves positive surprise while discarding other association information.</li>
      <li><b>Over-selling analogies.</b> The offset $[2,3]$ works in the toy plane; real spaces contain bias, polysemy, and frequency artifacts.</li>
      <li><b>Ignoring morphology for rare words.</b> Without FastText-style n-grams, <b>played</b> and <b>playing</b> cannot share the $0.5$ and $0.4$ overlap evidence.</li>
      <li><b>Comparing unnormalized vectors with dot products.</b> Cosine uses normalized directions; raw vector length can otherwise make frequent words look spuriously similar.</li>
    </ul>` };

window.ALLML_CONTENT["8.7"] = { tagline:"An RNN reuses one small transition at every time step, letting a hidden state become the running memory of a sequence.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.7-rnn.ipynb", context:String.raw`
    <p>This is the first neural sequence model in the path: the same computation is applied again and again as tokens arrive.</p>
    <ul>
      <li><b>Recurrence relations</b> define the hidden state by combining the previous state with the current input.</li>
      <li><b>Backpropagation</b> extends through time, multiplying many Jacobians along the unrolled chain.</li>
      <li><b>Parameter sharing</b> lets one transition handle sequences longer than the examples used during training.</li>
    </ul>
    <p>Where it leads: LSTMs (8.8) and GRUs (8.9) repair the memory problems of vanilla recurrence, while seq2seq models (8.10) use recurrent encoders and decoders to map one sequence into another.</p>`, intuition:String.raw`
    <p>The concrete problem is that a sentence is not a fixed-size vector by nature. A model must read one token, remember something, read the next token, and update its memory.</p>
    <p>A feed-forward network over a fixed window cannot naturally handle arbitrary length, and a bag-of-words model discards order. An RNN solves both by carrying a hidden state forward, using the same weights at each position.</p>
    <p>The design decision people underestimate is how much old information should survive the repeated transition. The same multiplication that carries memory forward also carries gradients backward; if its effective scale is too small, old evidence and learning signal fade away.</p>`, mathematics:String.raw`
    <p>A vanilla RNN updates hidden state $h_t$ from input $x_t$ and previous state $h_{t-1}$:</p>
    <div class="formula-box">$$h_t=\tanh(W_{hh}h_{t-1}+W_{xh}x_t+b_h),\qquad y_t=W_{hy}h_t+b_y$$</div>
    <p>The key constraint is that the same matrices are reused for every $t$.</p>

    <p><b>The hidden state accumulates evidence.</b> With inputs $[1,0,1,1]$ and update $h_t=\tanh(0.8h_{t-1}+0.6x_t)$:</p>
    <ol class="work">
      <li>$h_1=\tanh(0.6)=0.5370495669980352$</li>
      <li>$h_2=\tanh(0.8\cdot0.5370495669980352)=0.40502011794967835$</li>
      <li>$h_3=0.7277917876299974$</li>
      <li>$h_4=0.8281545644800706$, which is larger than $h_1$</li>
    </ol>
    <p>The state falls when the input is zero, then rises again as more positive evidence arrives.</p>

    <p><b>Backpropagation through time multiplies scales.</b> For repeated scalar factors over $20$ steps:</p>
    <ol class="work">
      <li>$0.2^{20}=1.0485760000000012\cdot10^{-14}$</li>
      <li>$0.5^{20}=9.5367431640625\cdot10^{-7}$</li>
      <li>$0.9^{20}=0.12157665459056935$</li>
    </ol>
    <p>The gradient with factor $0.2$ is essentially gone, while $0.9$ still leaves a usable signal after the same depth.</p>

    <p><b>A final state can classify a whole sequence.</b> For sequence $[0,1,1,0,1]$ and linear update $h_t=0.7h_{t-1}+x_t$:</p>
    <ol class="work">
      <li>hidden states are $[0.0,1.0,1.7,1.19,1.833]$</li>
      <li>the decision threshold is $1.5$</li>
      <li>the final state $1.833\gt1.5$, so the class is $1$</li>
    </ol>
    <p>The model compresses the entire sequence into the last number before making the decision.</p>

    <p><b>Parameter sharing controls model size.</b> Compare one shared transition with a different transition at each of $T=6$ positions:</p>
    <ol class="work">
      <li>shared RNN parameters: $3$</li>
      <li>separate per-step parameters: $3\cdot6=18$</li>
      <li>the unshared model uses $18/3=6$ times as many parameters</li>
    </ol>
    <p>Sharing is what lets the model read a seventh or eighth token without inventing new weights.</p>

    <p><b>One-step prediction exposes autoregressive use.</b> For sequence $[1,0,1,0,1]$ with $h_t=0.5h_{t-1}+x_t$:</p>
    <ol class="work">
      <li>four next-token predictions are produced because the last token has no next target</li>
      <li>the predicted labels are $[1,0,1,1]$</li>
      <li>the next-token targets are $[0,1,0,1]$</li>
      <li>the first prediction is $1$, as required by the computed path</li>
    </ol>
    <p>The same recurrent state can be used for sequence-level decisions or for a prediction at each position.</p>`, pitfalls:String.raw`
    <ul>
      <li><b>Assuming memory lasts automatically.</b> The powers $0.2^{20}$ and $0.5^{20}$ show why old evidence can vanish long before the end of a sequence.</li>
      <li><b>Forgetting parameter sharing.</b> If each time step has its own weights, the parameter count grows from $3$ to $18$ at length $6$ and no longer generalizes cleanly to new lengths.</li>
      <li><b>Using the wrong state for the task.</b> A final-state classifier reads $h_T$; a next-token model needs outputs at intermediate states as well.</li>
      <li><b>Ignoring saturation in tanh.</b> Once the pre-activation is large, $\tanh$ changes slowly and gradients shrink even if the recurrence weight is not tiny.</li>
      <li><b>Evaluating autoregressive predictions with shifted targets misaligned.</b> The predictions $[1,0,1,1]$ must be compared to the next tokens $[0,1,0,1]$, not to the inputs that produced them.</li>
    </ul>` };

window.ALLML_CONTENT["8.8"] = { tagline:"An LSTM separates memory from exposure, using gates to decide what to keep, what to write, and what to reveal.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.8-lstm.ipynb", context:String.raw`
    <p>This lesson is the classic answer to the vanilla RNN's fading-memory problem.</p>
    <ul>
      <li><b>RNN recurrence (8.7)</b> supplies the sequential setting, but LSTM adds a dedicated cell state beside the hidden state.</li>
      <li><b>Sigmoid gates</b> produce values between $0$ and $1$, so the network can softly erase, write, and expose information.</li>
      <li><b>Elementwise arithmetic</b> makes memory preservation a multiplication by the forget gate rather than a full nonlinear rewrite at every step.</li>
    </ul>
    <p>Where it leads: GRUs (8.9) simplify the same gating idea, seq2seq models (8.10) use gated recurrent cells in encoders and decoders, and attention mechanisms later reduce the need to compress everything into one recurrent state.</p>`, intuition:String.raw`
    <p>The concrete pain in a vanilla RNN is that every step rewrites the hidden state through the same nonlinearity. Information needed much later can be overwritten or attenuated before it is useful.</p>
    <p>An LSTM adds a protected memory lane, the cell state. The forget gate scales old memory, the input gate controls new writing, and the output gate controls how much of the cell becomes visible as the hidden state.</p>
    <p>The design decision people skip is that remembering is an active choice, not the default. A forget gate near one preserves old information for many steps; a forget gate near zero deliberately clears it. The model learns both behaviors from data.</p>`, mathematics:String.raw`
    <p>For input $x_t$, previous hidden state $h_{t-1}$, and previous cell $c_{t-1}$, an LSTM computes:</p>
    <div class="formula-box">$$f_t=\sigma(W_f[h_{t-1},x_t]+b_f),\quad i_t=\sigma(W_i[h_{t-1},x_t]+b_i),\quad c_t=f_t\odot c_{t-1}+i_t\odot \tilde c_t,\quad h_t=o_t\odot\tanh(c_t)$$</div>
    <p>The cell update is the important line: kept old memory plus gated new candidate.</p>

    <p><b>The forget gate scales old memory.</b> With old cell value $c=2$ and forget gates $[0,0.5,1]$:</p>
    <ol class="work">
      <li>$0\cdot2=0$</li>
      <li>$0.5\cdot2=1$</li>
      <li>$1\cdot2=2$</li>
      <li>the kept-memory values are $[0,1,2]$</li>
    </ol>
    <p>A forget gate of one is not a vague preference; it exactly copies this scalar memory forward.</p>

    <p><b>The input gate controls write strength.</b> With candidate value $g=3$ and input gates $[0.1,0.5,0.9]$:</p>
    <ol class="work">
      <li>$0.1\cdot3=0.30000000000000004$</li>
      <li>$0.5\cdot3=1.5$</li>
      <li>$0.9\cdot3=2.7$</li>
    </ol>
    <p>The same candidate can be a whisper or a large write depending entirely on the learned gate.</p>

    <p><b>The cell update adds kept old plus new written.</b> With $c_{old}=1$, $f=0.8$, $i=0.5$, and $g=\tanh(2.0)=0.9640275800758169$:</p>
    <ol class="work">
      <li>old kept: $0.8\cdot1=0.8$</li>
      <li>new written: $0.5\cdot0.9640275800758169=0.48201379003790845$</li>
      <li>new cell: $0.8+0.48201379003790845=1.2820137900379085$</li>
    </ol>
    <p>The number $1.2820137900379085$ is not a black-box activation; it is a sum of a preserved term and a gated write.</p>

    <p><b>The output gate decides what becomes visible.</b> With cell $c=1.2820137900379085$:</p>
    <ol class="work">
      <li>$\tanh(c)=0.8570205322353923$</li>
      <li>low output gate $0.2$ gives hidden value $0.17140410644707849$</li>
      <li>high output gate $0.8$ gives hidden value $0.6856164257883139$</li>
      <li>the high-output hidden state is larger than the low-output hidden state</li>
    </ol>
    <p>The cell can store information without fully exposing it to the rest of the network at this step.</p>

    <p><b>A near-one forget gate preserves long memory.</b> With constant forget gate $f=0.95$ for $30$ steps:</p>
    <ol class="work">
      <li>after $1$ step, memory multiplier is $0.95$</li>
      <li>after $30$ steps, multiplier is $0.95^{30}=0.21463876394293727$</li>
      <li>the final retained fraction is greater than $0.2$</li>
    </ol>
    <p>That is why LSTMs helped long sequences: the model can learn a path where memory decays slowly instead of being fully rewritten each time.</p>`, pitfalls:String.raw`
    <ul>
      <li><b>Calling the hidden state the memory cell.</b> The formula separates $c_t$ from $h_t$; the output gate can hide memory that still remains in $c_t$.</li>
      <li><b>Biasing forget gates too low.</b> If $f_t$ starts near zero, the multiplier path destroys long-range information before learning can use it.</li>
      <li><b>Forgetting the candidate nonlinearity.</b> The write used $\tanh(2.0)=0.9640275800758169$, not the raw value $2.0$.</li>
      <li><b>Letting gates saturate permanently.</b> Sigmoid values near exactly $0$ or $1$ make the choice decisive but can also slow learning through tiny derivatives.</li>
      <li><b>Assuming exposure means storage.</b> The output-gate example shows a small $h_t$ can coexist with a substantial cell value.</li>
    </ul>` };

window.ALLML_CONTENT["8.9"] = { tagline:"A GRU keeps the spirit of gated memory but folds it into one hidden state, blending old belief with a proposed update.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.9-gru.ipynb", context:String.raw`
    <p>This lesson is the lean gated recurrent cell: fewer gates than an LSTM, but the same instinct to protect useful history.</p>
    <ul>
      <li><b>LSTM gating (8.8)</b> motivates the update and reset gates, though the GRU removes the separate cell state.</li>
      <li><b>Convex interpolation</b> explains the update gate: the new state sits between the old state and a candidate.</li>
      <li><b>Reset filtering</b> decides how much previous state the candidate is allowed to inspect.</li>
    </ul>
    <p>Where it leads: GRUs can replace vanilla RNN cells in sequence classifiers, language models, and seq2seq encoders (8.10), especially when a smaller recurrent model is preferred.</p>`, intuition:String.raw`
    <p>The concrete problem is the same as for LSTMs: vanilla recurrence forgets too easily. The GRU response is more compact: keep one state, but learn gates that decide when to keep it and when to revise it.</p>
    <p>The update gate is the main mental model. If it is small, the old state mostly survives; if it is large, the candidate state mostly replaces it. The reset gate is subtler: it controls how much past information the candidate sees before proposing a change.</p>
    <p>The design decision people gloss over is whether a task needs the LSTM's separate memory lane. GRUs have fewer moving parts, which can train faster or generalize better on modest data, but they also have less explicit separation between storage and exposure.</p>`, mathematics:String.raw`
    <p>A GRU computes reset gate $r_t$, update gate $z_t$, candidate $\tilde h_t$, and new hidden state $h_t$:</p>
    <div class="formula-box">$$r_t=\sigma(W_r[x_t,h_{t-1}]),\quad z_t=\sigma(W_z[x_t,h_{t-1}]),\quad \tilde h_t=\tanh(W_xx_t+W_h(r_t\odot h_{t-1})),\quad h_t=(1-z_t)h_{t-1}+z_t\tilde h_t$$</div>
    <p>The last line is an interpolation between old state and candidate state.</p>

    <p><b>The update gate interpolates two states.</b> With $h_{old}=2$, candidate $\tilde h=-1$, and $z=[0,0.25,0.5,0.75,1]$:</p>
    <ol class="work">
      <li>$z=0$ gives $(1-0)2+0(-1)=2$</li>
      <li>$z=0.25$ gives $1.25$</li>
      <li>$z=0.5$ gives $0.5$</li>
      <li>$z=0.75$ gives $-0.25$</li>
      <li>$z=1$ gives $-1$</li>
    </ol>
    <p>The computed sequence $[2,1.25,0.5,-0.25,-1]$ makes the gate's meaning literal.</p>

    <p><b>The reset gate filters the past before candidate construction.</b> With previous state $h=3$ and reset values $[0,0.5,1]$:</p>
    <ol class="work">
      <li>$0\cdot3=0$</li>
      <li>$0.5\cdot3=1.5$</li>
      <li>$1\cdot3=3$</li>
    </ol>
    <p>A reset gate of zero tells the candidate to ignore the old state; a reset gate of one lets it see the past fully.</p>

    <p><b>The candidate uses reset-filtered state.</b> With $x=1$, $h=2$, $r=0.25$:</p>
    <ol class="work">
      <li>reset-filtered state is $0.25\cdot2=0.5$</li>
      <li>pre-activation is $0.7\cdot1+0.4\cdot0.5=0.9$</li>
      <li>$\tanh(0.9)=0.7162978701990245$</li>
    </ol>
    <p>The candidate is not based on the full old state; it is based on the reset-filtered memory.</p>

    <p><b>Small updates preserve state longer than vanilla decay.</b> Compare $0.5^T$ with $(1-0.05)^T=0.95^T$ at $T=30$:</p>
    <ol class="work">
      <li>vanilla decay gives $0.5^{30}=9.313225746154785\cdot10^{-10}$</li>
      <li>GRU keep path gives $0.95^{30}=0.21463876394293727$</li>
      <li>the gated path is vastly larger after the same $30$ steps</li>
    </ol>
    <p>This is the memory benefit in one comparison: a small update gate can keep old state alive.</p>

    <p><b>A synthetic sequence shows selective reaction.</b> For sequence $[1,0,0,0,1]$, using $z=0.8$ on informative ones and $z=0.2$ on zeros:</p>
    <ol class="work">
      <li>hidden states are $[0.6092753247646119,0.5465304502698163,0.4905564622027722,0.44054017450365,0.7598950974288129]$</li>
      <li>the final state is $0.7598950974288129$</li>
      <li>the second state is $0.5465304502698163$</li>
      <li>the final state is larger than the earlier state</li>
    </ol>
    <p>The cell decays through uninformative zeros and then reacts strongly when the final one arrives.</p>`, pitfalls:String.raw`
    <ul>
      <li><b>Flipping the update convention.</b> This lesson uses $h_t=(1-z_t)h_{old}+z_t\tilde h_t$; some libraries define the complement, so inspect the equation before interpreting gate plots.</li>
      <li><b>Forgetting reset acts before the candidate.</b> The reset gate changes $\tilde h_t$, not the final interpolation directly.</li>
      <li><b>Assuming fewer gates always means worse memory.</b> The $0.95^{30}$ path shows a GRU can preserve state very well when the update gate stays small.</li>
      <li><b>Comparing GRU and LSTM parameter counts without task evidence.</b> The GRU is simpler, but the best choice depends on sequence length, data size, and whether separate cell storage helps.</li>
      <li><b>Reading zeros as no computation.</b> In the synthetic sequence, zero inputs still decay and transform the hidden state; they are not skipped time steps.</li>
    </ul>` };

window.ALLML_CONTENT["8.10"] = { tagline:"Sequence-to-sequence learning turns one variable-length stream into another by encoding what was read and decoding what should be said next.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.10-seq2seq.ipynb", context:String.raw`
    <p>This lesson assembles sequence modeling into translation-shaped work: read a source sequence, then generate a target sequence.</p>
    <ul>
      <li><b>RNN encoders (8.7)</b> compress a source prefix into a state that summarizes what has been read.</li>
      <li><b>Gated cells (8.8, 8.9)</b> make that compression more stable for longer inputs.</li>
      <li><b>Autoregressive probability</b> factors the target into one next-token decision at a time.</li>
    </ul>
    <p>Where it leads: attention mechanisms relieve the bottleneck of one final encoder state, and Transformer encoder-decoder models keep the same conditional factorization while replacing recurrence with attention.</p>`, intuition:String.raw`
    <p>The concrete problem is that inputs and outputs can have different lengths. A translation, summary, or reversed sequence cannot be handled by a classifier that emits one label.</p>
    <p>An encoder reads the source into state; a decoder starts from that state and unfolds target tokens. During training, teacher forcing often feeds the true previous target token so each next-token prediction gets a clean context.</p>
    <p>The design decision people understate is the training-serving mismatch. At serving time, the decoder must consume its own previous predictions. A single early mistake can push later steps into states the training procedure rarely exposed.</p>`, mathematics:String.raw`
    <p>Seq2seq models factor the conditional probability of target tokens $y_1,\dots,y_T$ given source $x_{1:S}$ autoregressively:</p>
    <div class="formula-box">$$P(y_{1:T}\mid x_{1:S})=\prod_{t=1}^{T}P(y_t\mid y_{1:t-1},\operatorname{Enc}(x_{1:S}))$$</div>
    <p>The encoder summary conditions every decoder step, while previous target tokens provide the autoregressive history.</p>

    <p><b>The encoder compresses the source into a final state.</b> For source $[2,1,3]$ and update $h_t=\tanh(0.6h_{t-1}+0.4x_t)$:</p>
    <ol class="work">
      <li>$h_1=0.664036770267849$</li>
      <li>$h_2=0.6631536913995937$</li>
      <li>$h_3=0.9213506585709649$</li>
      <li>the final state is larger than the first state</li>
    </ol>
    <p>The decoder receives the final summary, not the raw list of source tokens in this basic architecture.</p>

    <p><b>The decoder unfolds several target positions.</b> Starting from $h=0.9$ and repeatedly applying $h\leftarrow\tanh(0.7h)$ for four steps:</p>
    <ol class="work">
      <li>decoder states are $[0.5580522155596244,0.3719088632753982,0.254609968964449,0.1763635334341262]$</li>
      <li>there are exactly $4$ output steps</li>
      <li>the last state is smaller than the first state</li>
    </ol>
    <p>Generation is a sequence of decisions; even this scalar decoder has a trajectory, not a single output.</p>

    <p><b>Teacher forcing scores each next-token prediction.</b> With target $[3,1,2]$ and predictions $[3,2,2]$:</p>
    <ol class="work">
      <li>position $1$: $3=3$, correct</li>
      <li>position $2$: $2\ne1$, incorrect</li>
      <li>position $3$: $2=2$, correct</li>
      <li>the correctness vector is $[1,0,1]$ and its sum is $2$</li>
    </ol>
    <p>The model gets supervised at every target position, not merely on the completed sentence.</p>

    <p><b>Exposure bias compounds over time.</b> If the per-step error rate is $0.1$, the chance that no error has occurred by step $t$ is $0.9^t$:</p>
    <ol class="work">
      <li>after $1$ step, survival probability is $0.9$</li>
      <li>after $10$ steps, survival probability is $0.9^{10}=0.3486784401000001$</li>
      <li>the ten-step value is lower than the one-step value</li>
    </ol>
    <p>Autoregressive decoding makes early mistakes dangerous because later inputs depend on earlier outputs.</p>

    <p><b>A reverse-sequence task shows variable mapping directly.</b> For source $[1,2,3]$:</p>
    <ol class="work">
      <li>the target is the reversed sequence $[3,2,1]$</li>
      <li>source length is $3$ and target length is $3$ in this toy case</li>
      <li>the first target token $3$ comes from the last source token</li>
    </ol>
    <p>Even when lengths match, the output order depends on the whole source, which is the reason an encoder-decoder model is needed.</p>`, pitfalls:String.raw`
    <ul>
      <li><b>Overloading one final encoder state.</b> The basic factorization conditions on $\operatorname{Enc}(x_{1:S})$; long sources can exceed what a single vector carries.</li>
      <li><b>Ignoring exposure bias.</b> The drop from $0.9$ to $0.3486784401000001$ over ten steps shows how small per-token errors accumulate.</li>
      <li><b>Misaligning decoder inputs and targets.</b> Teacher forcing predicts the next token; shifting by one position incorrectly makes training look worse or better than it is.</li>
      <li><b>Stopping after a fixed length only.</b> Real decoders need an end-of-sequence decision, not just four unfolded steps.</li>
      <li><b>Assuming equal source and target lengths.</b> The reverse toy has length $3$ on both sides, but translation and summarization usually do not.</li>
    </ul>` };

window.ALLML_CONTENT["8.12"] = { tagline:"A Transformer keeps every token in the room at once: attention mixes the sequence, residuals preserve identity, and normalization keeps the stack trainable.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.12-transformers.ipynb", context:String.raw`
    <p>Transformers are the point where attention (8.11) stops being a module inside a recurrent system and becomes the whole sequence engine.</p>
    <ul>
      <li><b>Scaled dot-product attention</b> supplies the routing rule: each token forms query, key, and value vectors, then uses similarity to decide which other token values to mix.</li>
      <li><b>Matrix multiplication</b> makes all token-to-token scores happen in one parallel operation, which is why Transformers displaced step-by-step recurrence for long text.</li>
      <li><b>Normalization and residual learning</b> keep deep stacks from erasing the original token stream while attention and MLP layers repeatedly rewrite it.</li>
    </ul>
    <p>Where it leads: positional encodings (8.13) repair the order information self-attention does not contain by itself; efficient long-context attention (8.14) asks which attention links can be skipped; decoding strategies (8.15) turn Transformer logits into actual text. This lesson is the bridge from the single attention mechanism in (8.11) to modern language models.</p>`, intuition:String.raw`
    <p>The concrete problem is that a word's meaning often depends on words far away, but recurrent models have to carry that information through a narrow hidden state. A Transformer lets every position look directly at every other position, so the token <b>her</b> can consult <b>Ada</b> without waiting for a chain of updates to pass the message along.</p>
    <p>The older pain was not only vanishing gradients; it was serialization. If token $7$ cannot be processed until token $6$ finishes, hardware sits idle and long-range evidence arrives late. Self-attention replaces that line with a table: all pairwise comparisons are computed together, then each row becomes a distribution over the sequence.</p>
    <p>The design decision people often rush past is why a Transformer block is not only attention. Attention mixes information across positions, but the residual path keeps the old representation available, layer normalization keeps feature scales comparable, and the MLP rewrites each token locally after it has listened globally. Remove any one of those pieces and the elegant attention equation becomes a brittle layer instead of a usable deep model.</p>`, mathematics:String.raw`
    <p>For one head with token matrix $X\in\mathbb{R}^{T\times d}$, learned projections form $Q=XW_Q$, $K=XW_K$, and $V=XW_V$; the head output is</p>
    <div class="formula-box">$$\operatorname{Attn}(Q,K,V)=\operatorname{softmax}\!\left(\frac{QK^{\top}}{\sqrt{d_k}}\right)V,\qquad \operatorname{MHA}(X)=\operatorname{Concat}(H_1,\ldots,H_h)W_O$$</div>
    <p>Here $T$ is sequence length, $d_k$ is the key dimension for one head, and each softmax row is one token's distribution over all source positions.</p>

    <p><b>Self-attention turns similarities into routing weights.</b> With $X=\begin{bmatrix}1&0\\0&1\\1&1\end{bmatrix}$ and $d_k=2$, using $Q=K=V=X$ gives scaled scores and row-normalized weights:</p>
    <ol class="work">
      <li>$XX^{\top}/\sqrt{2}=\begin{bmatrix}0.7071&0&0.7071\\0&0.7071&0.7071\\0.7071&0.7071&1.4142\end{bmatrix}$</li>
      <li>softmax row $1$ is $[0.4011,0.1978,0.4011]$, so token $1$ splits attention between itself and token $3$</li>
      <li>the three row sums are $1.0000,1.0000,1.0000$, confirming that each row is a probability distribution</li>
    </ol>
    <p>The numbers show why the scale matters: the dot products become comparable scores, and the softmax converts them into a convex mixing rule rather than an unbounded sum.</p>

    <p><b>Different heads can prefer different neighborhoods.</b> Two heads with hand-built score tables produce genuinely different attention maps:</p>
    <ol class="work">
      <li>head $1$ first row from scores $[2,1,0]$ becomes $[0.6652,0.2447,0.0900]$</li>
      <li>head $2$ first row from scores $[0,1,2]$ becomes $[0.0900,0.2447,0.6652]$</li>
      <li>the largest weight moves from position $1$ to position $3$, so the heads cannot be collapsed into one shared view</li>
    </ol>
    <p>Multi-head attention is not decorative parallelism; it gives separate subspaces permission to ask different relational questions before their answers are concatenated.</p>

    <p><b>The residual stream protects information while attention edits it.</b> For a token feature vector $x=[1,2]$ and attention update $a=[0.5,-0.5]$, the block adds rather than replaces:</p>
    <ol class="work">
      <li>coordinate $1$: $1+0.5=1.5$</li>
      <li>coordinate $2$: $2+(-0.5)=1.5$</li>
      <li>the residual output is $y=[1.5,1.5]$</li>
    </ol>
    <p>This is why deep Transformer layers can be conservative: a head may adjust a feature without forcing the model to relearn the token's whole representation from scratch.</p>

    <p><b>Layer normalization makes feature scale local to a token.</b> For $z=[1,2,5]$, normalize by its own mean and standard deviation:</p>
    <ol class="work">
      <li>mean $=(1+2+5)/3=2.6667$</li>
      <li>standard deviation $=1.6997$</li>
      <li>normalized vector $=[-0.9806,-0.3922,1.3728]$ with mean $0$ and standard deviation $1$</li>
    </ol>
    <p>The large feature remains large relative to its neighbors, but the next layer receives a controlled scale instead of chasing activations that drift across depth.</p>

    <p><b>A tiny block already has the Transformer shape.</b> Using the same $X$, the attention output is $H=AX$, then the residual and row-wise normalization finish the block:</p>
    <ol class="work">
      <li>$H=\begin{bmatrix}0.8022&0.5989\\0.5989&0.8022\\0.7517&0.7517\end{bmatrix}$</li>
      <li>$X+H$ gives rows $[1.8022,0.5989]$, $[0.5989,1.8022]$, and $[1.7517,1.7517]$</li>
      <li>row-wise normalization yields $[1,-1]$, $[-1,1]$, and $[0,0]$</li>
    </ol>
    <p>The final row becoming $[0,0]$ is not a mistake: both features were equal after mixing, so normalization found no within-token contrast to keep.</p>`, pitfalls:String.raw`
    <ul>
      <li><b>Forgetting the scale.</b> Dropping $\sqrt{d_k}$ makes $QK^{\top}$ grow with dimension, pushing softmax rows toward one-hot routes before the model has learned useful heads.</li>
      <li><b>Confusing heads with copies.</b> If every head sees the same projections, the contrast between $[0.6652,0.2447,0.0900]$ and $[0.0900,0.2447,0.6652]$ disappears and capacity is wasted.</li>
      <li><b>Replacing instead of adding the residual.</b> The $[1,2]+[0.5,-0.5]$ example preserves original signal; overwriting $x$ with $a$ would throw away the token identity.</li>
      <li><b>Normalizing across the wrong axis.</b> LayerNorm should center features within a token, as with $z=[1,2,5]$; normalizing across batch or time silently couples unrelated positions.</li>
      <li><b>Ignoring positional information.</b> Self-attention alone is permutation-friendly; the block can mix tokens, but order has to be injected by the mechanisms in (8.13).</li>
    </ul>` };

window.ALLML_CONTENT["8.13"] = { tagline:"Position encodings give attention a sense of before and after without giving up its parallel view of the whole sequence.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.13-positional-encodings.ipynb", context:String.raw`
    <p>Self-attention compares token contents, so this lesson answers the missing question: how does the model know which identical-looking vector came first?</p>
    <ul>
      <li><b>Trigonometry</b> supplies sinusoidal coordinates whose phases change smoothly with position and can extrapolate beyond a trained length.</li>
      <li><b>Vector addition and rotation</b> explain why learned positions are added to token embeddings while RoPE rotates query and key pairs before their dot product.</li>
      <li><b>Attention biasing</b> lets ALiBi and relative-position methods change the score matrix directly, so distance affects routing even before values are mixed.</li>
    </ul>
    <p>Where it leads: Transformers (8.12) need this order signal to distinguish <b>dog bites man</b> from <b>man bites dog</b>; long-context attention (8.14) changes which positions can interact; decoding (8.15) relies on position-aware hidden states when predicting the next token.</p>`, intuition:String.raw`
    <p>The concrete problem is brutal: if a Transformer sees only a bag of token vectors, swapping two tokens can leave the same multiset of vectors. Attention can ask what is present, but it cannot infer where each thing stood unless position is included somewhere.</p>
    <p>The naive fix is to append an integer index to each token, but raw indices have poor geometry: position $1000$ is not naturally comparable to position $1001$ in a way a dot product can use. Better encodings place positions into vector space, either as learned embeddings, sinusoids, rotations, or additive score biases.</p>
    <p>The design decision people gloss over is whether position should live in the <b>representation</b> or the <b>attention score</b>. Learned and sinusoidal embeddings alter token vectors before attention; RoPE changes query-key geometry so relative offsets show up in dot products; ALiBi directly penalizes distant pairs. These are not cosmetic variants — they decide how the model generalizes when the sequence is longer, shifted, or full of repeated words.</p>`, mathematics:String.raw`
    <p>A standard sinusoidal coordinate and a two-dimensional RoPE rotation are</p>
    <div class="formula-box">$$PE(pos,2i)=\sin\!\left(\frac{pos}{10000^{2i/d}}\right),\quad PE(pos,2i+1)=\cos\!\left(\frac{pos}{10000^{2i/d}}\right),\qquad R_\theta\begin{bmatrix}q_1\\q_2\end{bmatrix}=\begin{bmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{bmatrix}\begin{bmatrix}q_1\\q_2\end{bmatrix}$$</div>
    <p>The sinusoid maps a position to features; RoPE rotates each query and key pair by a position-dependent angle before their dot product is taken.</p>

    <p><b>No position means swapped order can look identical.</b> With token vectors $X=[[1,0],[0,1]]$ and the reversed sequence $[[0,1],[1,0]]$, sorting by coordinate removes the order:</p>
    <ol class="work">
      <li>original multiset after coordinate sorting is $[[0,0],[1,1]]$</li>
      <li>reversed multiset after the same sorting is also $[[0,0],[1,1]]$</li>
      <li>their difference is $[[0,0],[0,0]]$</li>
    </ol>
    <p>That zero table is the warning: content alone can say which vectors exist, not which one came first.</p>

    <p><b>Sinusoids make positions into smooth coordinates.</b> For positions $0$ through $7$ and the first sine-cosine pair, $PE(pos)=[\sin(pos),\cos(pos)]$:</p>
    <ol class="work">
      <li>$PE(0)=[0.0000,1.0000]$</li>
      <li>$PE(1)=[0.8415,0.5403]$</li>
      <li>$PE(7)=[0.6570,0.7539]$, and the table shape is $8\times2$</li>
    </ol>
    <p>Neighboring positions move around the unit circle instead of jumping through arbitrary integer labels, giving attention a geometry for distance and phase.</p>

    <p><b>Learned positions act like trainable offsets.</b> Add learned position rows to three token vectors of all ones:</p>
    <ol class="work">
      <li>position offsets are $[0.1,0.0]$, $[0.0,0.2]$, and $[0.2,0.1]$</li>
      <li>the second token becomes $[1,1]+[0,0.2]=[1.0,1.2]$</li>
      <li>all summed rows are $[[1.1,1.0],[1.0,1.2],[1.2,1.1]]$</li>
    </ol>
    <p>The model can learn task-specific position codes, but those rows are parameters tied to the trained length unless the architecture handles extrapolation carefully.</p>

    <p><b>RoPE preserves angles while changing coordinates.</b> Rotate $q=[1,0]$ and $k=[0,1]$ by $\theta=\pi/4$:</p>
    <ol class="work">
      <li>$R=\begin{bmatrix}0.7071&-0.7071\\0.7071&0.7071\end{bmatrix}$</li>
      <li>$Rq=[0.7071,0.7071]$ and $Rk=[-0.7071,0.7071]$</li>
      <li>$(Rq)\cdot(Rk)=-0.0000$, matching $q\cdot k=0$ up to rounding</li>
    </ol>
    <p>A shared rotation keeps same-position similarity intact; using different rotations by position makes relative displacement visible inside the query-key dot product.</p>

    <p><b>ALiBi writes distance into the attention scores.</b> With length $T=6$ and slope $0.5$, the bias from position $0$ to each position is:</p>
    <ol class="work">
      <li>$[-0.0,-0.5,-1.0,-1.5,-2.0,-2.5]$</li>
      <li>near distance $1$ receives bias $-0.5$</li>
      <li>far distance $5$ receives bias $-2.5$, which is lower by $2.0$ logit units</li>
    </ol>
    <p>The model is not forbidden from attending far away, but it must earn that link against a distance penalty already present in the score matrix.</p>`, pitfalls:String.raw`
    <ul>
      <li><b>Assuming attention learns order for free.</b> The zero difference between the original and reversed two-token multiset shows why content-only self-attention cannot recover sequence order.</li>
      <li><b>Using learned positions past their trained range.</b> A learned row such as $[0,0.2]$ exists only because a parameter was allocated for that index; extrapolation is not automatic.</li>
      <li><b>Rotating queries but not keys.</b> RoPE's useful geometry lives in the query-key dot product; applying $R_\theta$ to only one side changes scores in a way the derivation did not intend.</li>
      <li><b>Adding ALiBi with the wrong sign.</b> The far bias should be more negative, as $-2.5\lt -0.5$; flipping the sign rewards distance instead of discouraging it.</li>
      <li><b>Mixing absolute and relative schemes carelessly.</b> Stacking learned absolute rows, RoPE, and score biases can make position dominate content unless their scales are monitored.</li>
    </ul>` };

window.ALLML_CONTENT["8.14"] = { tagline:"Long-context attention is the art of keeping the links that matter while refusing to store a full square table just because the formula permits it.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.14-efficient-long-context-attention.ipynb", context:String.raw`
    <p>Dense self-attention is powerful because every token can talk to every token; it is expensive for exactly the same reason.</p>
    <ul>
      <li><b>Quadratic scaling</b> explains the memory wall: a sequence of length $T$ creates $T^2$ attention scores before any values are mixed.</li>
      <li><b>Sparse graph design</b> underlies Longformer and BigBird, where local windows, global tokens, and random links define which attention edges are even allowed.</li>
      <li><b>Numerically stable softmax</b> is the idea behind FlashAttention: compute exact dense attention without materializing the entire score matrix at once.</li>
    </ul>
    <p>Where it leads: these methods let the Transformer block from (8.12) read documents, logs, and long conversations; positional choices from (8.13) determine how far-away links are biased; language-model evaluation (8.16) often exposes whether the longer context actually helped.</p>`, intuition:String.raw`
    <p>The concrete problem is that a sequence twice as long does not merely cost twice as much. Dense attention stores every pairwise score, so length multiplies against itself. At document scale, the attention matrix becomes the bottleneck before the feed-forward network or vocabulary head does.</p>
    <p>The naive fix is to truncate the input. That is simple, and often disastrous: the answer to a question may be in the first paragraph while the question appears at the end, or a legal clause may depend on a definition pages earlier. Efficient attention tries to preserve useful paths through the sequence without paying for every possible edge.</p>
    <p>The overlooked design decision is whether the approximation changes the <b>attention pattern</b> or only the <b>implementation</b>. Longformer and BigBird deliberately change which entries of the score matrix exist; FlashAttention keeps dense attention mathematically exact but streams blocks through memory. Confusing those two ideas leads to wrong expectations about both accuracy and speed.</p>`, mathematics:String.raw`
    <p>Dense attention stores $T^2$ scores, while a local window of radius $w$ stores only the allowed band:</p>
    <div class="formula-box">$$M_{ij}=\mathbf{1}\{|i-j|\le w\},\qquad \operatorname{cost}_{\mathrm{dense}}=T^2,\\ \operatorname{cost}_{\mathrm{window}}\approx T(2w+1)$$</div>
    <p>Global and random edges add selected nonlocal links; FlashAttention computes the dense softmax in blocks while preserving the same result.</p>

    <p><b>Dense attention hits the square law immediately.</b> For lengths $128,256,512,1024$, the score counts are just $T^2$:</p>
    <ol class="work">
      <li>$128^2=16{,}384$ and $256^2=65{,}536$</li>
      <li>$512^2=262{,}144$ and $1024^2=1{,}048{,}576$</li>
      <li>$1{,}048{,}576/16{,}384=64$</li>
    </ol>
    <p>An eightfold increase in length produced a sixty-fourfold increase in score storage, which is why long context requires more than patience.</p>

    <p><b>A local window replaces the square with a band.</b> With $T=32$ and radius $w=2$, each interior token can attend to at most five positions:</p>
    <ol class="work">
      <li>dense score slots would be $32\cdot32=1024$</li>
      <li>the actual window mask contains $154$ true entries</li>
      <li>row $10$ has $5$ allowed positions, and position $12$ is included because $|10-12|=2$</li>
    </ol>
    <p>The mask keeps nearby syntax and phrase structure cheap, but it cannot by itself connect the first token to the last token in one layer.</p>

    <p><b>Global tokens create shortcuts across the document.</b> With $T=20$, $w=1$, and token $0$ global, the mask starts with a local band and then fills row and column $0$:</p>
    <ol class="work">
      <li>the window alone would give roughly $20\cdot3$ local slots minus boundary losses</li>
      <li>after adding the global row and column, the mask contains $94$ true entries</li>
      <li>both long links are present: $M_{19,0}=\mathrm{True}$ and $M_{0,19}=\mathrm{True}$</li>
    </ol>
    <p>A global summary token gives far-apart positions a shared hub without restoring the entire dense matrix.</p>

    <p><b>Random sparse links add graph reachability.</b> BigBird-style random edges choose three destinations per row for $T=24$:</p>
    <ol class="work">
      <li>each of the $24$ rows receives $3$ random links</li>
      <li>total true entries are $24\cdot3=72$</li>
      <li>the first five row counts are $3,3,3,3,3$</li>
    </ol>
    <p>The point is not that random edges know syntax; it is that they shorten graph paths so information can percolate between distant regions over layers.</p>

    <p><b>FlashAttention streams the exact softmax.</b> For logits $[10,9,8,1]$, split into two chunks but use the global maximum $m=10$:</p>
    <ol class="work">
      <li>streaming denominator is $\exp(0)+\exp(-1)+\exp(-2)+\exp(-9)=1.503338$</li>
      <li>full softmax is $[0.665186,0.244708,0.090023,0.000082]$</li>
      <li>streamed softmax is the same $[0.665186,0.244708,0.090023,0.000082]$</li>
    </ol>
    <p>Unlike sparse masks, this changes memory traffic rather than the answer: the probabilities match the dense softmax while avoiding a giant stored matrix.</p>`, pitfalls:String.raw`
    <ul>
      <li><b>Calling sparse attention exact dense attention.</b> A $154$-entry window mask over $1024$ possible slots has removed links, so it changes the model class.</li>
      <li><b>Forgetting boundary effects.</b> The approximation $T(2w+1)$ overcounts edges near the start and end; the actual $T=32,w=2$ mask has $154$, not $160$.</li>
      <li><b>Leaving out global routes.</b> Local windows alone cannot make $M_{19,0}$ true in one layer; global tokens are the shortcut mechanism.</li>
      <li><b>Sampling random links without fixed reproducibility.</b> BigBird-style edges affect reachability; changing the random pattern between runs can change behavior even when the shape is identical.</li>
      <li><b>Implementing streaming softmax with local chunk maxima only.</b> FlashAttention needs the global max and denominator logic; otherwise the streamed result will not match $[0.665186,0.244708,0.090023,0.000082]$.</li>
    </ul>` };

window.ALLML_CONTENT["8.15"] = { tagline:"Decoding is where a language model's probability distribution becomes a single sentence, so the sampling rule becomes part of the model's behavior.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.15-decoding-strategies.ipynb", context:String.raw`
    <p>A Transformer gives logits for the next token; decoding decides how deterministic, diverse, or risk-seeking the final text will be.</p>
    <ul>
      <li><b>Softmax</b> turns logits into probabilities, and temperature changes how sharply the largest logits dominate.</li>
      <li><b>Search over sequences</b> underlies greedy and beam decoding, where local or cumulative log-probability determines which partial continuations survive.</li>
      <li><b>Probability truncation</b> gives top-k and nucleus sampling their character: remove low-probability candidates, renormalize, then sample from the surviving mass.</li>
    </ul>
    <p>Where it leads: language-model evaluation (8.16) judges the text these choices produce; coreference (8.20) and parsing (8.19) can fail downstream when decoding chooses fluent but structurally inconsistent continuations; generation-heavy tasks in (8.22) through (8.24) depend on these exact tradeoffs.</p>`, intuition:String.raw`
    <p>The concrete problem is that the model does not output a word; it outputs a distribution over words. Turning that distribution into text is an additional algorithm, not a clerical step. Greedy decoding asks for the single most likely next token, beam search asks for likely whole paths, and sampling asks for controlled variety.</p>
    <p>The naive choice is always take the largest probability. That is stable, but it can get stuck in dull loops or miss a sequence whose first token is not locally best but whose continuation is better. The opposite naive choice, sampling from everything, lets tiny tail probabilities inject nonsense.</p>
    <p>The design decision people understate is where to spend uncertainty. Temperature changes the entire distribution; top-k fixes the number of candidates; nucleus fixes the amount of probability mass. These knobs are not interchangeable: one controls sharpness, one controls candidate count, and one adapts the candidate count to the model's confidence.</p>`, mathematics:String.raw`
    <p>Temperature and truncation operate on the next-token distribution</p>
    <div class="formula-box">$$p_T(i)=\frac{\exp(z_i/T)}{\sum_j\exp(z_j/T)},\qquad p_{k}(i)=\frac{p(i)\mathbf{1}\{i\in\operatorname{TopK}(p,k)\}}{\sum_{j\in\operatorname{TopK}(p,k)}p(j)},\qquad \sum_{i\in K_p}p(i)\ge p$$</div>
    <p>Here $z_i$ is the logit for token $i$, $T$ is temperature, and $K_p$ is the smallest nucleus set whose cumulative mass reaches threshold $p$.</p>

    <p><b>Greedy decoding follows the largest probability immediately.</b> With logits $[3,2,0.5]$ for tokens <b>A</b>, <b>B</b>, and <b>C</b>:</p>
    <ol class="work">
      <li>softmax probabilities are $[0.689672,0.253716,0.056612]$</li>
      <li>the maximum entry is $0.689672$ at token <b>A</b></li>
      <li>greedy therefore emits <b>A</b> before considering any future continuation</li>
    </ol>
    <p>This is excellent when the distribution is decisive and brittle when a slightly worse token would unlock a much better phrase.</p>

    <p><b>Beam search scores whole partial strings.</b> For candidate sequences <b>AA</b>, <b>AB</b>, and <b>BA</b>, multiply step probabilities and add logs:</p>
    <ol class="work">
      <li>path probabilities are $0.6\cdot0.5=0.30$, $0.6\cdot0.4=0.24$, and $0.3\cdot0.9=0.27$</li>
      <li>log scores are $-1.203973$, $-1.427116$, and $-1.309333$</li>
      <li><b>AA</b> wins because $-1.203973$ is the largest log-probability</li>
    </ol>
    <p>Beam search protects some future evidence, but only for paths that survive the beam; pruning still makes an irreversible decision.</p>

    <p><b>Temperature changes entropy, not rank by itself.</b> For base logits $[2,1,0]$, compare $T=0.5$, $1$, and $2$:</p>
    <ol class="work">
      <li>entropy at $T=0.5$ is $0.441057$</li>
      <li>entropy at $T=1$ is $0.832396$</li>
      <li>entropy at $T=2$ is $1.020191$</li>
    </ol>
    <p>Higher temperature spreads probability mass, so sampling becomes more exploratory even though the logit ordering stays the same.</p>

    <p><b>Top-k fixes the number of candidates.</b> Softmax over logits $[4,3,2,1,0]$ gives probabilities $[0.636409,0.234122,0.086129,0.031685,0.011656]$; keep $k=3$:</p>
    <ol class="work">
      <li>the tail probabilities $0.031685$ and $0.011656$ are set to $0$</li>
      <li>the remaining mass is renormalized to $[0.665241,0.244728,0.090031,0,0]$</li>
      <li>exactly $3$ entries are nonzero</li>
    </ol>
    <p>The rule is simple and predictable, but it keeps three tokens even when the third token is poor and only three tokens even when many are plausible.</p>

    <p><b>Nucleus sampling fixes cumulative mass.</b> Using the same probabilities with threshold $0.9$:</p>
    <ol class="work">
      <li>sorted cumulative mass is $[0.636409,0.870530,0.956659,0.988344,1.000000]$</li>
      <li>the first two tokens reach only $0.870530$, so the third token is included</li>
      <li>the final nucleus distribution is $[0.665241,0.244728,0.090031,0,0]$</li>
    </ol>
    <p>Here top-k and nucleus happen to keep the same three tokens; in a flatter or sharper distribution, nucleus would adapt the set size to the model's uncertainty.</p>`, pitfalls:String.raw`
    <ul>
      <li><b>Treating decoding as evaluation-neutral.</b> The same logits can produce deterministic <b>A</b> or a sampled alternative; metrics in (8.16) are measuring the combined model and decoder.</li>
      <li><b>Multiplying probabilities until they underflow.</b> Beam search should compare log scores like $-1.203973$, not long products that collapse toward zero.</li>
      <li><b>Using temperature after truncation without intent.</b> Temperature before top-k can change the probability shape that gets renormalized; changing the order changes the sampler.</li>
      <li><b>Forgetting to renormalize after filtering.</b> Top-k set the last two entries to $0$ and then rescaled the first three to sum to $1$.</li>
      <li><b>Assuming nucleus always keeps a fixed count.</b> The count was $3$ only because the first two probabilities summed to $0.870530$; the rule is about mass, not count.</li>
    </ul>` };

window.ALLML_CONTENT["8.16"] = { tagline:"Language-model metrics are lenses, not verdicts: likelihood, overlap precision, overlap recall, and alignment reward different virtues.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.16-lm-evaluation.ipynb", context:String.raw`
    <p>Once a model generates or scores text, evaluation asks which notion of goodness is being measured and which one is being ignored.</p>
    <ul>
      <li><b>Negative log-likelihood</b> gives perplexity its meaning: how surprised the model is by the reference tokens on average.</li>
      <li><b>N-gram counting</b> underlies BLEU and ROUGE, with precision rewarding candidate words that appear in the reference and recall rewarding reference words that are covered.</li>
      <li><b>Weighted harmonic means</b> explain METEOR-style scoring, where precision and recall are combined but recall can be deliberately emphasized.</li>
    </ul>
    <p>Where it leads: decoding choices (8.15) change metric outcomes; machine translation (8.22), question answering (8.23), and summarization (8.24) all inherit the same danger that a convenient metric may reward the wrong behavior.</p>`, intuition:String.raw`
    <p>The concrete problem is that generated text has many acceptable answers. A probability model can be good at assigning likelihood, a translation can be adequate with different wording, and a summary can be faithful while sharing few exact words with one reference.</p>
    <p>The naive fix is to choose one number and optimize it. That quickly misleads: perplexity rewards calibrated next-token probabilities, BLEU rewards precise overlap, ROUGE rewards coverage, and METEOR tries to balance overlap with stronger recall. None of them reads meaning the way a human does.</p>
    <p>The design decision people gloss over is whether the metric should punish <b>extra words</b>, <b>missing words</b>, or <b>surprise</b>. BLEU dislikes unsupported additions through precision; ROUGE dislikes omissions through recall; perplexity never compares a generated candidate to a reference at all. A wise evaluation report names that choice instead of hiding it behind a single leaderboard score.</p>`, mathematics:String.raw`
    <p>Perplexity exponentiates average cross-entropy, while BLEU-style unigram precision counts candidate overlap:</p>
    <div class="formula-box">$$\operatorname{PPL}=\exp\!\left(-\frac{1}{N}\sum_{t=1}^{N}\log p(x_t\mid x_{\lt t})\right),
    \qquad P_1=\frac{\sum_w \min(c_{\mathrm{cand}}(w),c_{\mathrm{ref}}(w))}{\sum_w c_{\mathrm{cand}}(w)}$$</div>
    <p>The first formula evaluates likelihood of reference tokens; the second evaluates word overlap from the candidate side.</p>

    <p><b>Perplexity is exponentiated surprise.</b> For token probabilities $[0.5,0.25,0.25]$:</p>
    <ol class="work">
      <li>cross-entropy is $-(\log0.5+\log0.25+\log0.25)/3=1.155245300933242$</li>
      <li>perplexity is $\exp(1.155245300933242)=3.1748021039363983$</li>
      <li>the asserted value rounds to $3.174802103936399$</li>
    </ol>
    <p>Lower perplexity means the model placed more probability on the observed next tokens, but it says nothing about whether a sampled answer is useful.</p>

    <p><b>BLEU-1 rewards candidate precision.</b> Candidate <b>the cat sat</b> is compared with reference <b>the cat slept</b>:</p>
    <ol class="work">
      <li>candidate tokens are $3$: <b>the</b>, <b>cat</b>, <b>sat</b></li>
      <li>overlapping candidate tokens are $2$: <b>the</b> and <b>cat</b></li>
      <li>precision is $2/3=0.6666666666666666$</li>
    </ol>
    <p>The wrong verb hurts, but the metric is still high because two candidate words were supported by the reference.</p>

    <p><b>ROUGE-1 rewards reference coverage.</b> Candidate <b>the cat sat</b> is compared with reference <b>the small cat sat</b>:</p>
    <ol class="work">
      <li>reference tokens are $4$: <b>the</b>, <b>small</b>, <b>cat</b>, <b>sat</b></li>
      <li>covered reference tokens are $3$: <b>the</b>, <b>cat</b>, and <b>sat</b></li>
      <li>recall is $3/4=0.75$</li>
    </ol>
    <p>The missing word <b>small</b> is the only penalty, so ROUGE is naturally friendly to summaries that cover key content.</p>

    <p><b>METEOR-style scoring can weight recall heavily.</b> With $P=2/3$ and $R=2/4$:</p>
    <ol class="work">
      <li>numerator is $10PR=10\cdot(2/3)\cdot(1/2)=3.333333333333333$</li>
      <li>denominator is $R+9P=0.5+6=6.5$</li>
      <li>score is $3.333333333333333/6.5=0.5128205128205128$</li>
    </ol>
    <p>Because recall receives the heavier weight in the denominator, missing reference content can dominate the final score.</p>

    <p><b>Metrics can rank systems differently.</b> Compare two model outputs called <b>fluent short</b> and <b>faithful long</b>:</p>
    <ol class="work">
      <li>BLEU scores are $0.80$ and $0.55$, so BLEU prefers <b>fluent short</b></li>
      <li>ROUGE scores are $0.40$ and $0.85$, so ROUGE prefers <b>faithful long</b></li>
      <li>the preference gap is $0.25$ in BLEU one way and $0.45$ in ROUGE the other way</li>
    </ol>
    <p>This disagreement is not a bug in arithmetic; it is a reminder that precision-heavy and recall-heavy metrics ask different questions.</p>`, pitfalls:String.raw`
    <ul>
      <li><b>Comparing perplexity across different tokenizers.</b> The average log probability is per token, so changing tokenization changes $N$ and the meaning of PPL.</li>
      <li><b>Reading BLEU as semantic correctness.</b> <b>the cat sat</b> earned $2/3$ against <b>the cat slept</b> despite the predicate changing.</li>
      <li><b>Using ROUGE when unsupported additions matter most.</b> ROUGE recall can be high even if the candidate adds claims not present in the reference.</li>
      <li><b>Forgetting METEOR's weighting.</b> The denominator $R+9P$ intentionally changes the tradeoff; it is not the same as an unweighted F1.</li>
      <li><b>Reporting one metric as a final truth.</b> The BLEU and ROUGE comparison reversed the model ranking, so a single number can hide the actual product goal.</li>
    </ul>` };

window.ALLML_CONTENT["8.17"] = { tagline:"NER is sequence labeling with memory: each token gets a tag, but the tag must also make sense as part of a span.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.17-ner-sequence-labeling.ipynb", context:String.raw`
    <p>Named entity recognition turns raw token sequences into typed spans such as people, organizations, and locations.</p>
    <ul>
      <li><b>BIO encoding</b> converts spans into token tags, marking where an entity begins, continues, or where no entity is present.</li>
      <li><b>Emission scores</b> connect each token representation to plausible tags, usually through a classifier over the tag set.</li>
      <li><b>Transition scores and Viterbi decoding</b> enforce sequence consistency, so a locally tempting tag can lose if it creates an illegal or unlikely path.</li>
    </ul>
    <p>Where it leads: POS tagging (8.18) uses the same sequence-labeling machinery for syntax; coreference (8.20) often begins from detected mentions; information extraction tasks rely on NER spans before relation or event models can reason about entities.</p>`, intuition:String.raw`
    <p>The concrete problem is that entities are not isolated token decisions. <b>OpenAI</b> should be an organization in <b>Ada works at OpenAI</b>, but a multi-token entity needs start and continuation tags, and a tag sequence such as <b>I-ORG</b> immediately after <b>O</b> is structurally suspicious.</p>
    <p>The naive approach classifies each token independently. That can label obvious words well, but it forgets that spans have grammar: beginnings, interiors, and outside regions. A CRF-style layer repairs this by scoring the whole tag path, not just each token's favorite label.</p>
    <p>The design decision people gloss over is that legal-looking spans and high token scores can disagree. A wise NER system lets emissions say what each word resembles, while transitions say which neighboring labels are coherent. The final answer is the path with the best joint score, not the row-wise maximum taken in isolation.</p>`, mathematics:String.raw`
    <p>For tokens $x_1,\ldots,x_T$ and tags $y_1,\ldots,y_T$, a linear-chain CRF scores a tag path by emissions and transitions:</p>
    <div class="formula-box">$$s(x,y)=\sum_{t=1}^{T} e_t(y_t)+\sum_{t=2}^{T} A_{y_{t-1},y_t},\qquad \hat y=\arg\max_y s(x,y)$$</div>
    <p>The emission $e_t(k)$ says how much token $t$ likes tag $k$; the transition $A_{ij}$ says how plausible tag $j$ is after tag $i$.</p>

    <p><b>BIO tags turn spans into token labels.</b> For <b>Ada works at OpenAI</b>, the tags are <b>B-PER</b>, <b>O</b>, <b>O</b>, <b>B-ORG</b>:</p>
    <ol class="work">
      <li>tokens are $4$: <b>Ada</b>, <b>works</b>, <b>at</b>, <b>OpenAI</b></li>
      <li>entity-marked positions are $[\mathrm{True},\mathrm{False},\mathrm{False},\mathrm{True}]$</li>
      <li>there are $2$ entity tokens and $2$ outside tokens</li>
    </ol>
    <p>The tags do not merely classify words; they mark span boundaries so downstream code can recover mentions.</p>

    <p><b>Emissions are local evidence.</b> With emission matrix $[[2,0],[0,2],[1,1]]$, softmax converts each row into tag probabilities:</p>
    <ol class="work">
      <li>row $1$ becomes $[0.880797,0.119203]$, strongly favoring tag $0$</li>
      <li>row $2$ becomes $[0.119203,0.880797]$, strongly favoring tag $1$</li>
      <li>row $3$ becomes $[0.5,0.5]$, offering no local preference</li>
    </ol>
    <p>The ambiguous third token is exactly where transitions and sentence context earn their keep.</p>

    <p><b>Transitions encode path preferences.</b> The transition matrix $[[1,-2],[0,1]]$ rewards some moves and penalizes others:</p>
    <ol class="work">
      <li>staying in tag $0$ scores $1$</li>
      <li>moving from tag $0$ to tag $1$ scores $-2$</li>
      <li>staying in tag $1$ scores $1$, which is $3$ points better than the $0\to1$ move</li>
    </ol>
    <p>A CRF can therefore reject a locally attractive label if the transition into it would break the learned span grammar.</p>

    <p><b>Viterbi accumulates the best path score.</b> With emissions $[[2,0],[1,1],[0,2]]$ and transitions $[[0.5,-1],[0,0.5]]$:</p>
    <ol class="work">
      <li>initial dynamic-program row is $[2,0]$</li>
      <li>after token $2$, the best scores are $[3.5,2.0]$</li>
      <li>after token $3$, the best scores are $[4.0,4.5]$, so the final tag index is $1$</li>
    </ol>
    <p>The last decision is not made from the last emission alone; it includes the best route that reached each tag.</p>

    <p><b>Span extraction is the payoff.</b> From tags <b>B-PER</b>, <b>I-PER</b>, <b>O</b>, <b>B-ORG</b>:</p>
    <ol class="work">
      <li><b>B-PER</b> at index $0$ starts a person span</li>
      <li><b>I-PER</b> at index $1$ continues it, so the first span is $[0,1]$</li>
      <li><b>B-ORG</b> at index $3$ starts a second span $[3]$</li>
    </ol>
    <p>The model's token-level output finally becomes two entity mentions that another system can link, count, or retrieve.</p>`, pitfalls:String.raw`
    <ul>
      <li><b>Taking independent argmax tags.</b> Local emissions can produce a path transitions would penalize; the CRF score $s(x,y)$ exists to avoid that mismatch.</li>
      <li><b>Dropping the B versus I distinction.</b> Without BIO boundaries, two adjacent entities of the same type collapse into one span.</li>
      <li><b>Masking padding incorrectly.</b> Transition sums should run over real tokens only; padded positions can create fake span starts and endings.</li>
      <li><b>Ignoring neutral emissions.</b> A row such as $[0.5,0.5]$ should be resolved by context, not treated as confident evidence.</li>
      <li><b>Extracting spans after changing tag order.</b> If index $1$ meant the final Viterbi tag during training but a different tag at serving, the decoded spans are silently wrong.</li>
    </ul>` };

window.ALLML_CONTENT["8.18"] = { tagline:"POS tagging names a word's syntactic job, while morphology records the word-internal clues that often reveal that job.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.18-pos-tagging-morphology.ipynb", context:String.raw`
    <p>This lesson sits between surface text and syntax: before parsing a sentence, a model often benefits from knowing whether a word is acting as a noun, verb, adjective, and what features its form carries.</p>
    <ul>
      <li><b>Suffix features</b> capture word-internal evidence such as past tense or gerund endings, which can be strong clues for POS tags.</li>
      <li><b>Emission classifiers</b> turn a token representation into a distribution over tags like <b>NOUN</b>, <b>VERB</b>, and <b>ADJ</b>.</li>
      <li><b>Context transitions</b> resolve ambiguity by making neighboring tag sequences plausible, much like sequence labeling in NER (8.17).</li>
    </ul>
    <p>Where it leads: dependency and constituency parsers (8.19) use tag information as syntactic evidence; morphology helps multilingual and cross-lingual NLP (8.27) because agreement, tense, and case may be encoded inside words rather than in word order.</p>`, intuition:String.raw`
    <p>The concrete problem is that a word form alone is often ambiguous. <b>walk</b> can be a noun or verb, while <b>walked</b> and <b>walking</b> carry suffix evidence that points toward verbal morphology. POS tagging combines that local shape with the surrounding sentence.</p>
    <p>The naive approach is a dictionary lookup: assign each word its most common tag. That fails on unknown words, domain shifts, and words whose tag changes with context. A better model reads characters, suffixes, emissions, and neighboring tag preferences together.</p>
    <p>The design decision people understate is whether morphology is treated as a side feature or as part of the prediction target. Some systems predict only POS; others also predict bundles such as tense, number, and person. The richer target can help grammar-sensitive tasks, but it also creates more labels and more ways to be partly right.</p>`, mathematics:String.raw`
    <p>A simple sequence tagger can combine local emissions with transition preferences:</p>
    <div class="formula-box">$$p(y_t=k\mid x_t)=\frac{\exp(e_t(k))}{\sum_j\exp(e_t(j))},\qquad s(y)=\sum_t e_t(y_t)+\sum_{t\gt1}A_{y_{t-1},y_t}$$</div>
    <p>The first equation is token-local POS classification; the second adds context through tag-to-tag transitions.</p>

    <p><b>Suffixes are compact morphology features.</b> For <b>walk</b>, <b>walked</b>, and <b>walking</b>, encode <b>ed</b> as $1$ and <b>ing</b> as $2$:</p>
    <ol class="work">
      <li><b>walk</b> has neither suffix, so its feature value is $0$</li>
      <li><b>walked</b> ends in <b>ed</b>, so its feature value is $1$</li>
      <li><b>walking</b> ends in <b>ing</b>, so its feature value is $2$</li>
    </ol>
    <p>A small integer feature already separates bare, past-like, and gerund-like forms before sentence context is considered.</p>

    <p><b>Emission scores choose a likely POS tag.</b> For tags <b>NOUN</b>, <b>VERB</b>, and <b>ADJ</b> with scores $[0.2,2.0,0.1]$:</p>
    <ol class="work">
      <li>softmax probabilities are $[0.125715,0.760533,0.113752]$</li>
      <li>the largest probability is $0.760533$ for <b>VERB</b></li>
      <li>the margin over <b>NOUN</b> is $0.760533-0.125715=0.634818$</li>
    </ol>
    <p>The word's local evidence is strongly verbal, but a full tagger can still let context challenge that choice.</p>

    <p><b>Transitions encode neighboring grammar.</b> With transition matrix $[[0.1,1.5],[1.0,0.2]]$ over two tags:</p>
    <ol class="work">
      <li>from tag $0$ to tag $0$ scores $0.1$</li>
      <li>from tag $0$ to tag $1$ scores $1.5$</li>
      <li>the transition preference difference is $1.5-0.1=1.4$ toward tag $1$ after tag $0$</li>
    </ol>
    <p>That single row says the next tag should usually differ in this context, a pattern a dictionary lookup cannot express.</p>

    <p><b>Morphology bundles carry multiple grammatical facts.</b> For the bundle <b>Number=Sing</b>, <b>Tense=Past</b>, <b>Person=3</b> with values $1,1,0$:</p>
    <ol class="work">
      <li>singular is active with value $1$</li>
      <li>past tense is active with value $1$</li>
      <li>third person is inactive with value $0$, so the active-feature count is $2$</li>
    </ol>
    <p>A POS tag like <b>VERB</b> may be too coarse; the bundle records which grammatical properties the parser or agreement model may need.</p>

    <p><b>Context can overturn a local ambiguity.</b> Combine local probabilities $[0.55,0.45]$ with context weights $[0.2,0.8]$:</p>
    <ol class="work">
      <li>unnormalized products are $[0.55\cdot0.2,0.45\cdot0.8]=[0.11,0.36]$</li>
      <li>their sum is $0.47$</li>
      <li>renormalized probabilities are $[0.234043,0.765957]$, so <b>VERB</b> wins</li>
    </ol>
    <p>The local model slightly preferred the first tag, but sentence context supplied enough evidence to reverse the decision.</p>`, pitfalls:String.raw`
    <ul>
      <li><b>Overtrusting suffixes.</b> The feature value $2$ for <b>walking</b> is useful, but names and domain terms can share suffixes without sharing grammar.</li>
      <li><b>Ignoring context on ambiguous words.</b> Local $[0.55,0.45]$ favored one tag, while context changed the final answer to $[0.234043,0.765957]$.</li>
      <li><b>Collapsing morphology into POS too early.</b> Losing <b>Tense=Past</b> or <b>Number=Sing</b> can hurt agreement-sensitive parsing even when the coarse POS is correct.</li>
      <li><b>Using transition scores with mismatched tag order.</b> The matrix entry $A_{0,1}=1.5$ only means what the training tag index said it meant.</li>
      <li><b>Evaluating only exact bundles.</b> A prediction can get POS and tense right while missing person; reporting only all-or-nothing accuracy hides partial grammatical competence.</li>
    </ul>` };

window.ALLML_CONTENT["8.19"] = { tagline:"Parsing turns a sentence from a line of words into structure: dependencies ask who governs whom, while constituencies ask which spans form units.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.19-dependency-constituency-parsing.ipynb", context:String.raw`
    <p>After tokens have embeddings and often POS tags, parsing asks for the grammatical skeleton that explains how the sentence is built.</p>
    <ul>
      <li><b>Arc scoring</b> gives dependency parsing a head-to-child table, where each token chooses a syntactic governor except the root.</li>
      <li><b>Span scoring</b> gives constituency parsing its candidates, assigning value to phrases such as noun phrases, verb phrases, and full sentences.</li>
      <li><b>Dynamic programming</b> powers CKY-style constituency parsing by building short spans before using them inside longer spans.</li>
    </ul>
    <p>Where it leads: semantic role labeling (8.21) often leans on parse structure to identify predicates and arguments; coreference (8.20) uses syntactic constraints for mentions and pronouns; text-to-SQL semantic parsing (8.28) requires even more explicit structure.</p>`, intuition:String.raw`
    <p>The concrete problem is that word order alone does not state grammatical relationships. In <b>I saw her</b>, the verb <b>saw</b> governs both subject and object; a parser must recover those links rather than only labeling the words individually.</p>
    <p>The naive approach is to pick the highest-scoring local relationship everywhere. That can create cycles, multiple roots, crossing arcs, or incompatible phrase spans. Parsing is therefore a constrained prediction problem: local scores matter, but the output must be a valid tree or nested span structure.</p>
    <p>The design decision people rush past is which structure the downstream task needs. Dependencies are compact and relation-centered; constituencies preserve phrase nesting. A sentiment system may care about spans, an information extractor may prefer heads, and a grammar checker may need both views to catch different mistakes.</p>`, mathematics:String.raw`
    <p>An arc-factored dependency parser scores a tree by summing selected head-child scores:</p>
    <div class="formula-box">$$S(T)=\sum_{(h\to m)\in T} s_{h,m},\qquad \hat T=\arg\max_{T\in\mathcal{T}} S(T)$$</div>
    <p>Here $h$ is a head token index, $m$ is a modifier index, and $\mathcal{T}$ is the set of valid dependency trees for the sentence.</p>

    <p><b>Arc scores say which heads look plausible.</b> For words <b>I</b>, <b>saw</b>, <b>her</b>, the head-to-child score table is $[[0,2,1],[0,0,3],[0,1,0]]$:</p>
    <ol class="work">
      <li>score from <b>saw</b> to <b>her</b> is $S_{1,2}=3$</li>
      <li>score from <b>I</b> to <b>her</b> is $S_{0,2}=1$</li>
      <li>the verb-to-object arc is ahead by $3-1=2$ points</li>
    </ol>
    <p>The table encodes syntactic preference before the tree constraint is applied.</p>

    <p><b>A dependency tree assigns one head per token.</b> The heads list $[1,-1,1]$ uses $-1$ for the root:</p>
    <ol class="work">
      <li>token $0$ has head $1$, so <b>I</b> attaches to <b>saw</b></li>
      <li>token $1$ has head $-1$, so <b>saw</b> is the single root</li>
      <li>token $2$ has head $1$, so <b>her</b> also attaches to <b>saw</b></li>
    </ol>
    <p>The root count is exactly $1$, which is a structural requirement, not a learned preference.</p>

    <p><b>Constituency parsing scores spans.</b> Candidate spans $(0,1)$, $(1,3)$, and $(0,3)$ receive scores $1.0$, $2.5$, and $3.0$:</p>
    <ol class="work">
      <li>the single-token span $(0,1)$ scores $1.0$</li>
      <li>the two-token span $(1,3)$ scores $2.5$</li>
      <li>the full span $(0,3)$ scores $3.0$, which is the maximum</li>
    </ol>
    <p>The full sentence span often must be present, but high inner-span scores determine which phrase boundaries explain it.</p>

    <p><b>CKY fills short spans before long spans.</b> A chart for $n=4$ stores completed span scores:</p>
    <ol class="work">
      <li>length-one spans have chart entries $C_{0,1}=1$, $C_{1,2}=1$, and $C_{2,3}=1$</li>
      <li>the longer span $C_{1,3}=2$ is filled after its shorter pieces</li>
      <li>the full span score is $C_{0,3}=3$</li>
    </ol>
    <p>The chart is the bookkeeping that prevents the parser from recomputing the same subphrases for every larger candidate.</p>

    <p><b>Projective structure forbids crossing arcs.</b> For arcs $(0,2)$ and $(1,3)$:</p>
    <ol class="work">
      <li>the indices satisfy $0\lt1\lt2\lt3$</li>
      <li>that pattern means the arcs cross when drawn above the sentence</li>
      <li>the crossing indicator is $1$</li>
    </ol>
    <p>Many parsers disallow such crossings for speed or linguistic reasons; doing so is a structural assumption that can be wrong for some languages.</p>`, pitfalls:String.raw`
    <ul>
      <li><b>Choosing best arcs independently.</b> Arc score $S_{1,2}=3$ is local evidence, but the final tree must still have one root and no illegal cycles.</li>
      <li><b>Mixing dependency and constituency outputs.</b> A head list like $[1,-1,1]$ is not a phrase tree; span scores such as $(0,3)$ answer a different question.</li>
      <li><b>Allowing multiple roots by accident.</b> The root count should be exactly $1$; extra $-1$ entries are structural errors even if each local choice seems plausible.</li>
      <li><b>Filling CKY spans in the wrong order.</b> A long span such as $C_{0,3}$ depends on shorter spans already being available.</li>
      <li><b>Assuming projectivity for every language and domain.</b> The crossing indicator $1$ marks a pattern some parsers cannot produce, even when the sentence legitimately needs it.</li>
    </ul>` };

window.ALLML_CONTENT["8.20"] = { tagline:"Coreference resolution is the memory problem of NLP: decide which mentions are different names for the same entity.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.20-coreference-resolution.ipynb", context:String.raw`
    <p>Coreference begins after text has candidate mentions and asks which ones belong to the same real-world entity.</p>
    <ul>
      <li><b>Mention detection</b> supplies the spans to compare, often helped by NER (8.17) and parsing (8.19).</li>
      <li><b>Pairwise scoring</b> estimates whether an earlier mention is a plausible antecedent for a later mention.</li>
      <li><b>Clustering and agreement constraints</b> turn pair decisions into entity chains while blocking links that violate number, gender, speaker, or type evidence.</li>
    </ul>
    <p>Where it leads: question answering (8.23) needs coreference to know who <b>she</b> or <b>it</b> refers to; summarization (8.24) must avoid switching entities; dialogue systems (8.26) track participants across turns.</p>`, intuition:String.raw`
    <p>The concrete problem is that language constantly reuses short expressions for previously introduced entities. In <b>Alice arrived. She smiled.</b>, the pronoun is easy for a reader but not for a model unless it links <b>She</b> back to <b>Alice</b>.</p>
    <p>The naive approach links each pronoun to the nearest noun phrase. That works often enough to be tempting and fails often enough to be dangerous: agreement, salience, syntax, discourse role, and distance all matter. Coreference is not just string matching because <b>Alice</b> and <b>she</b> share no surface words.</p>
    <p>The design decision people gloss over is whether to optimize pair links or final clusters. A pairwise classifier can say mention $1$ links to mention $0$, but entity chains must be transitive and coherent. Once mentions are clustered, one bad bridge can merge two people for the rest of the document.</p>`, mathematics:String.raw`
    <p>A mention-pair resolver scores a candidate antecedent $i$ for mention $j$, optionally masking impossible links before clustering:</p>
    <div class="formula-box">$$s(i,j)=w^{\top}\phi(m_i,m_j),\qquad p(i\mid j)=\frac{\exp(s(i,j))M_{ij}}{\sum_{k\lt j}\exp(s(k,j))M_{kj}}$$</div>
    <p>The feature vector $\phi$ describes the two mentions, and $M_{ij}$ is an agreement mask that can zero out forbidden antecedents.</p>

    <p><b>Pair scores choose antecedents.</b> For mentions <b>Alice</b>, <b>she</b>, and <b>Bob</b>, the score matrix is $[[0,2,0],[0,0,0],[0,0,0]]$:</p>
    <ol class="work">
      <li>score from <b>Alice</b> to <b>she</b> is $2$</li>
      <li>score from <b>Alice</b> to <b>Bob</b> is $0$</li>
      <li>the pronoun link is ahead by $2-0=2$ points</li>
    </ol>
    <p>The matrix says <b>Alice</b> is a better antecedent for <b>she</b> than for <b>Bob</b>, which matches the discourse intuition.</p>

    <p><b>Links induce clusters.</b> With links $(0,1)$ and $(2,3)$ over four mentions:</p>
    <ol class="work">
      <li>mentions $0$ and $1$ receive cluster id $0$</li>
      <li>mentions $2$ and $3$ receive cluster id $1$</li>
      <li>cluster ids are $[0,0,1,1]$, so mention $2$ is not in mention $0$'s entity</li>
    </ol>
    <p>The output is no longer a list of independent links; it is a partition of mentions into entity chains.</p>

    <p><b>Agreement masks block impossible links.</b> The mask $[[1,1,0],[1,1,0],[0,0,1]]$ permits or forbids mention pairs:</p>
    <ol class="work">
      <li>$M_{0,1}=1$, so mention $0$ can link with mention $1$</li>
      <li>$M_{0,2}=0$, so mention $0$ cannot link with mention $2$</li>
      <li>the mask removes the impossible pair before probability normalization</li>
    </ol>
    <p>This is how symbolic agreement evidence can prevent a high neural score from merging incompatible mentions.</p>

    <p><b>Pairwise evaluation counts link overlap.</b> Gold links are $(0,1)$ and $(2,3)$; predicted links are $(0,1)$ and $(1,2)$:</p>
    <ol class="work">
      <li>intersection size is $1$ because only $(0,1)$ matches</li>
      <li>precision is $1/2=0.5$ and recall is $1/2=0.5$</li>
      <li>F1 is $2\cdot0.5\cdot0.5/(0.5+0.5)=0.5$</li>
    </ol>
    <p>The wrong bridge $(1,2)$ is especially harmful because it can merge clusters even though the pairwise count records just one false positive.</p>

    <p><b>Distance priors favor nearby antecedents without forbidding far ones.</b> For distances $1$, $5$, and $12$, use weights proportional to $\exp(-d/5)$:</p>
    <ol class="work">
      <li>unnormalized weights are $\exp(-0.2)$, $\exp(-1)$, and $\exp(-2.4)$</li>
      <li>after normalization the scores are $[0.640971,0.288007,0.071022]$</li>
      <li>the near antecedent is about $0.640971/0.071022=9.025$ times the far one</li>
    </ol>
    <p>Distance is a prior, not a law: it nudges the model toward nearby mentions while leaving room for long-range discourse links.</p>`, pitfalls:String.raw`
    <ul>
      <li><b>Linking by surface match only.</b> <b>Alice</b> and <b>she</b> share no tokens, yet the score matrix correctly prefers their link by $2$ points.</li>
      <li><b>Forgetting transitive consequences.</b> A single bad predicted link such as $(1,2)$ can merge two clusters, not merely add one isolated error.</li>
      <li><b>Applying agreement masks after clustering.</b> The mask $M_{0,2}=0$ should block the pair before normalization and linking; afterward the damage may already be transitive.</li>
      <li><b>Letting distance dominate discourse.</b> The near prior $0.640971$ is useful, but some documents refer back across many sentences.</li>
      <li><b>Evaluating only pairs when the product needs entities.</b> Pairwise F1 of $0.5$ does not fully describe whether the final clusters are usable for QA or summarization.</li>
    </ul>` };

window.ALLML_CONTENT["8.21"] = { tagline:"Semantic role labeling turns a sentence from a string of words into a small event record: the predicate, its actors, its objects, and the circumstances around it.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.21-semantic-role-labeling.ipynb", context:String.raw`
    <p>SRL is the bridge between sequence tagging and meaning extraction: it asks not merely which words appear, but what job each phrase plays around a verb.</p>
    <ul>
      <li><b>Token classification</b> (8.17) supplies the per-token scores that mark predicates and label argument spans.</li>
      <li><b>Softmax scoring</b> converts role logits such as ARG0, ARG1, and ARG2 into comparable probabilities for one candidate phrase.</li>
      <li><b>Structured prediction</b> contributes global constraints, because a sentence can locally favor duplicate core roles that cannot all be true at once.</li>
    </ul>
    <p>Where it leads: SRL gives information extraction (8.19) predicate-centered facts rather than flat entities, supports question answering (8.23) when a question asks who did what, and helps semantic parsing (8.28) recognize the relation a user wants executed.</p>`, intuition:String.raw`
    <p>The concrete problem is that syntax alone does not tell us meaning. In <b>Alice sold Bob a car</b>, the important record is not just that <b>sold</b> is a verb; it is that Alice is the seller, Bob is the recipient, and the car is the thing transferred.</p>
    <p>A naive tagger can label each token independently, but independent decisions collide: two spans may both want ARG1, a predicate may be missed, or a role may be interpreted with the wrong frame. SRL works because it anchors the sentence on a predicate first, then scores the surrounding spans relative to that predicate.</p>
    <p>The design decision people underestimate is whether role labels are universal enough. ARG0 often behaves like an agent, but the exact meaning changes with the predicate frame; for <b>sell.01</b> and <b>give.01</b>, the numbered arguments are similar but not interchangeable. A good SRL system therefore learns local evidence and also remembers which roles the current frame actually licenses.</p>`, mathematics:String.raw`
    <p>For predicate position $p$ and candidate span $s=(i,j)$, score a role $r$ by combining the predicate representation, the span representation, and a frame-specific bias:</p>
    <div class="formula-box">$$P(r	herefore s,p)=\operatorname{softmax}_r\big(h_s^\top W_r h_p+b_{f(p),r}\big),\qquad \hat r=\arg\max_r P(r	herefore s,p)$$</div>
    <p>Here $h_p\in\mathbb{R}^d$ represents the predicate token, $h_s\in\mathbb{R}^d$ represents one argument span, $W_r\in\mathbb{R}^{d\times d}$ is the scorer for role $r$, and $b_{f(p),r}$ is the bias for the predicate frame $f(p)$.</p>

    <p><b>The predicate anchors the frame.</b> In <b>Alice sold Bob a car</b>, the predicate detector marks only the token <b>sold</b>:</p>
    <ol class="work">
      <li>tokens $=[\textsf{Alice},\textsf{sold},\textsf{Bob},\textsf{a},\textsf{car}]$ give $5$ candidate positions</li>
      <li>predicate flags $=[0,1,0,0,0]$, so the number of active predicates is $0+1+0+0+0=1$</li>
    </ol>
    <p>That single anchor matters: all role questions are now asked relative to <b>sold</b>, not relative to the sentence in the abstract.</p>

    <p><b>Role probabilities come from competing logits.</b> For one candidate phrase, the role scores are ARG0 $=2.5$, ARG1 $=0.4$, and ARG2 $=1.2$:</p>
    <ol class="work">
      <li>$e^{2.5}=12.182$, $e^{0.4}=1.492$, $e^{1.2}=3.320$, and the denominator is $16.994$</li>
      <li>$P(\textsf{ARG0})=12.182/16.994=0.717$, $P(\textsf{ARG1})=0.088$, $P(\textsf{ARG2})=0.195$</li>
    </ol>
    <p>The model is not merely naming a role; it is saying ARG0 wins with a large margin, so this span is much more likely to be the actor than the thing sold or the recipient.</p>

    <p><b>Global constraints catch locally plausible duplicates.</b> Suppose three spans decode as $[\textsf{ARG0},\textsf{ARG1},\textsf{ARG1}]$:</p>
    <ol class="work">
      <li>there are $3$ assigned core-role labels but only $2$ distinct labels, $\{\textsf{ARG0},\textsf{ARG1}\}$</li>
      <li>the uniqueness test is $3=2$, which is false, so the duplicate ARG1 violation is flagged</li>
    </ol>
    <p>This is why SRL is more than independent classification: the sentence-level structure can reject a set of labels even when each local choice looked reasonable.</p>

    <p><b>Span selection is a small search problem.</b> Four candidate spans receive scores $[0.1,2.0,0.5,1.5]$:</p>
    <ol class="work">
      <li>the largest score is $2.0$ at index $1$</li>
      <li>the next best is $1.5$, so the winning span margin is $2.0-1.5=0.5$</li>
    </ol>
    <p>The chosen argument is span $1$ because it best fits the predicate-role relation; the margin shows the choice is preferred, but not infinitely secure.</p>

    <p><b>Frames decide which roles are available.</b> Compare <b>sell.01</b> and <b>give.01</b> with ARG2 flags $[1,1]$ and ARG3 flags $[0,1]$:</p>
    <ol class="work">
      <li>ARG2 is licensed by both frames, so its total support is $1+1=2$</li>
      <li>ARG3 is absent for <b>sell.01</b> and present for <b>give.01</b>, so $1\gt 0$ for that role comparison</li>
    </ol>
    <p>The numbered labels only become meaningful inside a predicate frame; the same surface sentence can require different legal slots when the verb sense changes.</p>`, pitfalls:String.raw`
    <ul>
      <li><b>Labeling before anchoring.</b> If the predicate flag vector misses the one active verb, every $P(r\mid s,p)$ score is conditioned on the wrong event.</li>
      <li><b>Trusting local argmax too much.</b> The duplicate ARG1 example shows that independent role winners can violate the core-role constraint while still looking confident token by token.</li>
      <li><b>Confusing ARG numbers with plain English roles.</b> ARG0 is not always a human agent; its meaning is tied to $b_{f(p),r}$ and the predicate frame.</li>
      <li><b>Throwing away span boundaries.</b> A correct role on the wrong span changes the fact being extracted, because $h_s$ names a phrase, not a single universal token.</li>
      <li><b>Ignoring near-ties.</b> A margin of $0.5$ between the best and second-best span is useful uncertainty; flattening it into a hard label hides review-worthy cases.</li>
    </ul>` };

window.ALLML_CONTENT["8.22"] = { tagline:"Machine translation is meaning preservation under a new vocabulary, a new grammar, and often a new word order.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.22-machine-translation.ipynb", context:String.raw`
    <p>Translation sits where language modeling becomes bilingual: the decoder must speak fluently while staying accountable to a source sentence it did not write.</p>
    <ul>
      <li><b>Conditional language models</b> (8.8) provide the left-to-right probability of the target words once the source has been encoded.</li>
      <li><b>Attention</b> (8.11) supplies soft alignments, so each generated token can look back at the source positions it needs.</li>
      <li><b>N-gram evaluation</b> (8.16) contributes BLEU-style overlap checks that catch missing words even when a sentence sounds grammatical.</li>
    </ul>
    <p>Where it leads: the same encoder-decoder machinery powers summarization (8.24), multilingual transfer (8.27), and instruction-following generators that must condition every output on an input rather than free-run as pure language models.</p>`, intuition:String.raw`
    <p>The concrete problem is not word substitution. <b>je mange</b> can map cleanly to <b>I eat</b>, but real translation has agreement, dropped subjects, idioms, and word orders that do not line up one-to-one.</p>
    <p>A dictionary-only system fails because it chooses local word equivalents without checking whether the whole target sentence is fluent or complete. Modern translation treats the target as a conditional sequence: at each step, choose the next target token using the previous target tokens and the source evidence.</p>
    <p>The design decision people gloss over is length. A raw log probability always becomes more negative as a sentence gets longer, so a decoder can prefer short, incomplete outputs unless the score is normalized. Adequacy and fluency have to be balanced: the best translation is not the shortest sentence, and it is not a word salad that covers every source token.</p>`, mathematics:String.raw`
    <p>For source sentence $x_{1:m}$ and target sentence $y_{1:n}$, an attention-based translator factors the conditional probability as:</p>
    <div class="formula-box">$$P(y_{1:n}\mid x_{1:m})=\prod_{t=1}^{n}P(y_t\mid y_{\lt t},c_t),\qquad c_t=\sum_{i=1}^{m}\alpha_{t,i}h_i,\\ \operatorname{BLEU1}=\frac{\#\{\text{candidate unigrams in reference}\}}{\#\{\text{candidate unigrams}\}}$$</div>
    <p>Here $h_i\in\mathbb{R}^d$ is the encoded source state at position $i$, $\alpha_{t,i}$ is the attention weight from target step $t$ to source position $i$, and $c_t$ is the source summary used to predict target token $y_t$.</p>

    <p><b>Lexical probabilities provide the simplest alignment.</b> For source words $[\textsf{je},\textsf{mange}]$ and target words $[\textsf{I},\textsf{eat}]$, the lexical matrix is $\begin{bmatrix}0.9&0.1\\0.1&0.9\end{bmatrix}$:</p>
    <ol class="work">
      <li>$P(\textsf{I}\mid\textsf{je})=0.9$ and $P(\textsf{eat}\mid\textsf{je})=0.1$, so <b>je</b> aligns to <b>I</b></li>
      <li>$P(\textsf{I}\mid\textsf{mange})=0.1$ and $P(\textsf{eat}\mid\textsf{mange})=0.9$, so <b>mange</b> aligns to <b>eat</b></li>
    </ol>
    <p>The toy matrix is diagonal because the two-word example keeps order, but the probabilities already show the translation task as a set of conditional choices.</p>

    <p><b>Word order is allowed to change.</b> A source order $[0,1,2]$ and target order $[1,0,2]$ contain the same three positions but place the first two differently:</p>
    <ol class="work">
      <li>at position $0$, the target uses source index $1$, so $1\ne0$</li>
      <li>at position $1$, the target uses source index $0$, so the pair $(0,1)$ has been swapped while index $2$ stays fixed</li>
    </ol>
    <p>A translator must therefore model alignments, not just copy the source order into a new vocabulary.</p>

    <p><b>Attention rows must be probability distributions.</b> The attention matrix is $\begin{bmatrix}0.8&0.2\\0.1&0.9\\0.4&0.6\end{bmatrix}$ for three target steps over two source positions:</p>
    <ol class="work">
      <li>row sums are $0.8+0.2=1.0$, $0.1+0.9=1.0$, and $0.4+0.6=1.0$</li>
      <li>the strongest source position per target step is $[0,1,1]$</li>
    </ol>
    <p>Those normalized rows are the $\alpha_{t,i}$ weights in the formula; without the sum-to-one property, the context vector would change scale unpredictably.</p>

    <p><b>Length normalization prevents short-output bias.</b> Two candidates have log probabilities $[-1.2,-1.8]$ and lengths $[2,4]$, scored as $\log P/n^{0.6}$:</p>
    <ol class="work">
      <li>short score $=-1.2/2^{0.6}=-1.2/1.516=-0.792$</li>
      <li>long score $=-1.8/4^{0.6}=-1.8/2.297=-0.783$, which is greater than raw $-1.8$ and also slightly greater than $-0.792$</li>
    </ol>
    <p>The longer translation wins after normalization because its extra words are no longer punished merely for existing.</p>

    <p><b>Unigram BLEU rewards complete lexical coverage.</b> Candidate <b>I eat rice</b> and reference <b>I eat rice</b> contain the same three unigrams:</p>
    <ol class="work">
      <li>matching unigrams $=3$ out of candidate unigrams $=3$</li>
      <li>$\operatorname{BLEU1}=3/3=1.0$</li>
    </ol>
    <p>This perfect toy score does not prove a real translation is ideal, but it verifies that all candidate words appear in the reference here.</p>`, pitfalls:String.raw`
    <ul>
      <li><b>Using a dictionary as a translator.</b> The reordered sequence $[1,0,2]$ shows why word-by-word substitution cannot handle grammar.</li>
      <li><b>Forgetting attention normalization.</b> If rows of $\alpha$ do not sum to $1$, the context vector $c_t$ mixes alignment with arbitrary scale.</li>
      <li><b>Ranking by raw log probability only.</b> Since longer candidates accumulate more negative terms, omitting the $n^{0.6}$ penalty favors clipped translations.</li>
      <li><b>Treating BLEU as meaning.</b> BLEU1 of $1.0$ is possible in the exact toy case, but unigram overlap can miss wrong order, bad agreement, or mistranslated relations.</li>
      <li><b>Ignoring source coverage.</b> A fluent decoder can hallucinate a sentence that never attends to important source positions, so adequacy must be checked alongside target fluency.</li>
    </ul>` };

window.ALLML_CONTENT["8.23"] = { tagline:"Question answering is the discipline of letting a question decide which part of a context becomes the answer, and when no part should.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.23-question-answering.ipynb", context:String.raw`
    <p>QA turns reading into a conditional decision: the same passage can contain many facts, but the question selects one answer or demands abstention.</p>
    <ul>
      <li><b>Contextual embeddings</b> (8.10) let each token representation include both the passage and the question.</li>
      <li><b>Span prediction</b> contributes start and end distributions over passage positions for extractive answers.</li>
      <li><b>Retrieval</b> (8.20) supplies candidate documents before the reader can score any answer span.</li>
    </ul>
    <p>Where it leads: span scoring is a direct ingredient in reading-comprehension systems, no-answer thresholds connect to calibrated classification (8.25), and retrieval-augmented QA is the practical parent of many dialogue systems (8.26).</p>`, intuition:String.raw`
    <p>The concrete problem is that an answer is not a global property of a passage. <b>Paris is in France</b> answers one question with <b>France</b>, another with <b>Paris</b>, and many questions not at all.</p>
    <p>The naive approach is keyword matching: find words from the question in the passage and return nearby text. That fails on paraphrase, distractors, and unanswerable questions. A trained QA model instead scores every possible start and end position, then chooses a legal span whose end is not before its start.</p>
    <p>The design decision people underplay is abstention. A system that always returns the best span will answer even when the passage lacks the information. The no-answer score is not a nuisance threshold; it is the model's permission to say the evidence is insufficient.</p>`, mathematics:String.raw`
    <p>For passage positions $1$ through $m$, an extractive reader scores start logits $a_i$ and end logits $b_j$, then chooses a legal span:</p>
    <div class="formula-box">$$P_s(i)=\frac{e^{a_i}}{\sum_{k=1}^{m}e^{a_k}},\qquad P_e(j)=\frac{e^{b_j}}{\sum_{k=1}^{m}e^{b_k}},\qquad (\hat i,\hat j)=\arg\max_{i\le j}P_s(i)P_e(j)$$</div>
    <p>Here $P_s$ and $P_e$ are distributions over the same passage tokens, and the constraint $i\le j$ removes spans whose end would occur before their start.</p>

    <p><b>Start and end distributions point to the answer token.</b> For <b>Paris is in France</b>, start logits $[0.1,0.2,0.1,2.0]$ and end logits $[0.1,0.1,0.2,2.5]$ produce:</p>
    <ol class="work">
      <li>$P_s=[0.102,0.113,0.102,0.683]$, so the start argmax is position $3$ using zero-based indexing</li>
      <li>$P_e=[0.071,0.071,0.078,0.780]$, so the end argmax is also position $3$</li>
    </ol>
    <p>Both distributions concentrate on <b>France</b>, turning the passage into the one-token span the question asks for.</p>

    <p><b>The span matrix enforces a legal interval.</b> Multiplying the start and end distributions gives a four-by-four matrix, then entries with end before start are zeroed:</p>
    <ol class="work">
      <li>the best legal span score is $0.683\times0.780=0.533$ at $(3,3)$</li>
      <li>flattening a four-by-four matrix gives index $3\times4+3=15$, matching the chosen span</li>
    </ol>
    <p>The triangular mask is the small piece of structure that prevents impossible answers such as starting after they end.</p>

    <p><b>Abstention beats a weak span.</b> The no-answer score is $0.62$ and the best span score is $0.55$:</p>
    <ol class="work">
      <li>difference $=0.62-0.55=0.07$</li>
      <li>because $0.62\gt0.55$, the model should abstain rather than return the span</li>
    </ol>
    <p>The highest text span is not always good enough; a calibrated no-answer option protects the system from fabricating evidence.</p>

    <p><b>Retrieval chooses which context the reader sees.</b> Query vector $[1,0]$ is compared with document vectors $[0.9,0.1]$, $[0,1]$, and $[0.7,0.3]$ by cosine similarity:</p>
    <ol class="work">
      <li>cosines are $0.994$, $0.000$, and $0.919$</li>
      <li>document $0$ wins because $0.994\gt0.919\gt0.000$</li>
    </ol>
    <p>If retrieval picks the wrong document, even a perfect span scorer can only extract the wrong evidence.</p>

    <p><b>Generative QA still needs confidence over answers.</b> Answer logits for <b>Paris</b>, <b>London</b>, and <b>Rome</b> are $[3,1,0.5]$:</p>
    <ol class="work">
      <li>softmax probabilities are $[0.821,0.111,0.067]$</li>
      <li><b>Paris</b> has probability $0.821$, which is greater than $0.8$ and far above the alternatives</li>
    </ol>
    <p>Even when the answer is generated rather than copied, the model must reveal whether its first choice is strongly supported.</p>`, pitfalls:String.raw`
    <ul>
      <li><b>Taking independent argmaxes without legality.</b> The formula needs $i\le j$; otherwise start and end distributions can name an impossible span.</li>
      <li><b>Suppressing no-answer calibration.</b> A best span of $0.55$ should lose to a no-answer score of $0.62$, even though returning text feels more satisfying.</li>
      <li><b>Letting retrieval errors masquerade as reading errors.</b> The reader cannot recover if the cosine stage sends it to document $1$ instead of document $0$.</li>
      <li><b>Confusing passage probability with truth.</b> A span score only says the answer is supported by the chosen context; it does not verify the context itself.</li>
      <li><b>Overtrusting generated fluency.</b> A smooth answer with low softmax mass can sound authoritative while being less supported than the extractive evidence.</li>
    </ul>` };

window.ALLML_CONTENT["8.24"] = { tagline:"Summarization is compression with a conscience: fewer words, but the important facts must survive.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.24-summarization.ipynb", context:String.raw`
    <p>Summarization lives between selection and generation: it must decide what matters, avoid repeating itself, and compress without breaking the source.</p>
    <ul>
      <li><b>Sentence representations</b> (8.6) provide salience scores for extractive systems that choose whole sentences.</li>
      <li><b>Similarity measures</b> expose redundancy, letting the model prefer new information over another version of the same fact.</li>
      <li><b>Sequence-to-sequence modeling</b> (8.22) supplies the machinery for abstractive summaries that fuse and rewrite source facts.</li>
    </ul>
    <p>Where it leads: summary evaluation connects to ROUGE in evaluation (8.16), factual coverage becomes a core concern for QA (8.23), and dialogue assistants (8.26) use summarization to keep long conversations manageable.</p>`, intuition:String.raw`
    <p>The concrete problem is not making text shorter; it is choosing which information deserves the scarce space. A short summary that drops the main fact is worse than no summary, because it creates false confidence.</p>
    <p>The naive method is to take the first few sentences or the highest-scoring sentence repeatedly. That can work for news leads, but it often repeats the same fact and misses complementary evidence. Strong summarizers balance salience against redundancy.</p>
    <p>The design decision people gloss over is the unit of truth. Extractive systems preserve source wording but can stitch together awkward fragments; abstractive systems read better but can invent facts. The mathematics must therefore measure both compression and coverage, not just fluency.</p>`, mathematics:String.raw`
    <p>An extractive summarizer can choose sentences by maximal marginal relevance, trading sentence salience against similarity to sentences already selected:</p>
    <div class="formula-box">$$\operatorname{MMR}(s)=\lambda\operatorname{sal}(s)-(1-\lambda)\max_{c\in C}\operatorname{sim}(s,c),\qquad \operatorname{ROUGE_R}=\frac{|\text{reference facts}\cap\text{summary facts}|}{|\text{reference facts}|}$$</div>
    <p>Here $s$ is a candidate sentence, $C$ is the selected set, $\lambda$ controls the salience-redundancy tradeoff, and ROUGE recall measures how much reference content the summary covers.</p>

    <p><b>Salience ranks candidate sentences.</b> Four sentences have salience scores $[0.9,0.4,0.8,0.2]$:</p>
    <ol class="work">
      <li>the maximum is $0.9$ at sentence $0$</li>
      <li>the runner-up is $0.8$ at sentence $2$, so the top margin is $0.9-0.8=0.1$</li>
    </ol>
    <p>The first sentence is the best single extraction, but the small margin warns that the third sentence is also carrying important information.</p>

    <p><b>Redundancy changes the second choice.</b> With sentence $0$ already selected, salience $[0.9,0.8,0.7]$, similarity to sentence $0$ equal to $[1.0,0.8,0.1]$, and $\lambda=0.7$:</p>
    <ol class="work">
      <li>MMR scores are $0.7[0.9,0.8,0.7]-0.3[1.0,0.8,0.1]=[0.33,0.32,0.46]$</li>
      <li>among remaining sentences $1$ and $2$, sentence $2$ wins because $0.46\gt0.32$</li>
    </ol>
    <p>The less individually salient sentence is chosen because it adds new content instead of echoing the selected one.</p>

    <p><b>Compression ratio makes brevity explicit.</b> A source of length $120$ is summarized to lengths $20$, $40$, and $80$:</p>
    <ol class="work">
      <li>ratios are $20/120=0.167$, $40/120=0.333$, and $80/120=0.667$</li>
      <li>the shortest summary keeps one sixth of the source length, since $20/120=1/6$</li>
    </ol>
    <p>The ratio is not a quality score, but it states the constraint under which coverage must be achieved.</p>

    <p><b>ROUGE recall checks factual overlap.</b> Reference facts are $\{a,b,c,d,e\}$ and the candidate contains $\{a,b,c\}$:</p>
    <ol class="work">
      <li>overlap size is $3$ and reference size is $5$</li>
      <li>$\operatorname{ROUGE_R}=3/5=0.6$</li>
    </ol>
    <p>The candidate covers sixty percent of the reference facts in this toy calculation, so missing facts are visible rather than hidden by fluent wording.</p>

    <p><b>Abstractive fusion must preserve source facts.</b> Source fact indicators are $[1,1,0,1]$ and generated-summary indicators are $[1,0,0,1]$:</p>
    <ol class="work">
      <li>source has $1+1+0+1=3$ present facts</li>
      <li>the summary preserves $2$ of them, so coverage is $2/3=0.667$</li>
    </ol>
    <p>A generated summary can sound coherent while still dropping one of three source facts; the coverage number catches that loss.</p>`, pitfalls:String.raw`
    <ul>
      <li><b>Ranking by salience alone.</b> Sentence $1$ loses after the redundancy penalty even though its raw salience is high, so salience without MMR repeats information.</li>
      <li><b>Celebrating shortness as quality.</b> A ratio of $0.167$ is concise, but it says nothing about whether the right facts survived.</li>
      <li><b>Using ROUGE without reading omissions.</b> ROUGE recall of $0.6$ means two of five reference facts are absent in the toy case.</li>
      <li><b>Letting abstraction invent glue.</b> Rewriting can introduce unsupported relations; the fact indicators must be checked against the source, not against style.</li>
      <li><b>Ignoring near-equal salience.</b> A $0.1$ gap between the top two sentence scores means small model noise can change the summary plan.</li>
    </ul>` };

window.ALLML_CONTENT["8.25"] = { tagline:"Text classification listens to many token-level clues, then commits to one document-level label.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.25-text-classification-sentiment.ipynb", context:String.raw`
    <p>Classification is the workhorse NLP task: it turns a whole review, post, ticket, or message into a label that another system can act on.</p>
    <ul>
      <li><b>Bag-of-words and TF-IDF</b> (8.4) provide count-based feature vectors for linear sentiment models.</li>
      <li><b>Logistic regression</b> supplies calibrated probabilities from a weighted evidence sum.</li>
      <li><b>Evaluation metrics</b> (8.16) turn confusion matrices and thresholds into precision, recall, and accuracy tradeoffs.</li>
    </ul>
    <p>Where it leads: sentiment models feed moderation and ranking systems, calibrated confidence is reused by QA abstention (8.23), and dialogue systems (8.26) use text classification for intents and safety routing.</p>`, intuition:String.raw`
    <p>The concrete problem is that a label belongs to the whole text, while the evidence is scattered across words. Two occurrences of <b>good</b> strongly suggest positive sentiment, but <b>not good</b> should not be treated as simply more goodness.</p>
    <p>A naive keyword counter fails because it ignores weight, context, negation, and decision thresholds. A classifier turns features into a score, squashes that score into a probability, and only then applies a threshold appropriate for the cost of mistakes.</p>
    <p>The design decision people underplay is the threshold. The model can output probabilities, but the product needs labels; choosing $0.5$ is a policy decision, not a law of nature. Raising the threshold can remove false positives while sacrificing recall.</p>`, mathematics:String.raw`
    <p>For a document feature vector $x\in\mathbb{R}^d$, binary sentiment can be scored by logistic regression:</p>
    <div class="formula-box">$$z=x^\top w+b,\\ P(y=1\mid x)=\sigma(z)=\frac{1}{1+e^{-z}},\qquad \hat y=\mathbb{1}[P(y=1\mid x)>\tau]$$</div>
    <p>Here $w$ gives each feature its evidence weight, $b$ is the intercept, and $\tau$ is the threshold that converts a probability into a label.</p>

    <p><b>Bag-of-words evidence becomes a logit.</b> With vocabulary $[\textsf{good},\textsf{bad}]$, features $x=[2,0]$, and weights $w=[1.2,-1.5]$:</p>
    <ol class="work">
      <li>$z=x^\top w=2(1.2)+0(-1.5)=2.4$</li>
      <li>$\sigma(2.4)=1/(1+e^{-2.4})=0.917$, which is greater than $0.9$</li>
    </ol>
    <p>Two positive-word counts create a high positive probability because the evidence-weight product is strongly positive.</p>

    <p><b>Negation changes the evidence, not just the words.</b> The scores for <b>good</b> and <b>not good</b> are $1.2$ and $-0.8$:</p>
    <ol class="work">
      <li>$\sigma(1.2)=0.769$ for <b>good</b></li>
      <li>$\sigma(-0.8)=0.310$ for <b>not good</b>, so $0.769\gt0.310$</li>
    </ol>
    <p>The phrase with an extra word is less positive because the model has learned the construction, not just the unigram count.</p>

    <p><b>The confusion matrix counts the shape of mistakes.</b> The matrix $\begin{bmatrix}8&2\\1&9\end{bmatrix}$ has correct predictions on its diagonal:</p>
    <ol class="work">
      <li>correct count $=8+9=17$</li>
      <li>total count $=8+2+1+9=20$, so accuracy is $17/20=0.85$</li>
    </ol>
    <p>The same accuracy hides asymmetric errors: there are $2$ false positives and $1$ false negative, which may not cost the same.</p>

    <p><b>A threshold turns probabilities into labels.</b> Probabilities $[0.1,0.4,0.6,0.9]$ with labels $[0,0,1,1]$ use threshold $0.5$:</p>
    <ol class="work">
      <li>predictions are $[0,0,1,1]$ because only $0.6$ and $0.9$ exceed $0.5$</li>
      <li>all four predictions match, so accuracy is $4/4=1.0$</li>
    </ol>
    <p>This perfect toy threshold is useful precisely because it shows the discrete decision boundary, not because every dataset separates so cleanly.</p>

    <p><b>Threshold tuning trades precision for recall.</b> Thresholds $[0.3,0.5,0.7]$ have precision $[0.6,0.8,1.0]$ and recall $[1.0,0.8,0.5]$:</p>
    <ol class="work">
      <li>raising the threshold from $0.3$ to $0.7$ increases precision by $1.0-0.6=0.4$</li>
      <li>the same change decreases recall by $1.0-0.5=0.5$</li>
    </ol>
    <p>A stricter classifier speaks less often and is right more often when it speaks, but it misses more positives.</p>`, pitfalls:String.raw`
    <ul>
      <li><b>Counting sentiment words without composition.</b> The <b>not good</b> score of $-0.8$ shows that a phrase can reverse unigram evidence.</li>
      <li><b>Reporting accuracy alone.</b> The confusion matrix has different false-positive and false-negative counts, so $0.85$ accuracy is not the full story.</li>
      <li><b>Hard-coding threshold $0.5$.</b> The formula contains $\tau$ because the operating point should reflect whether precision or recall matters more.</li>
      <li><b>Assuming probabilities are calibrated.</b> A sigmoid output is only useful as a probability if training and validation show calibration.</li>
      <li><b>Letting vocabulary drift at serving time.</b> If the feature vector $x$ changes meaning after training, the learned weights multiply the wrong evidence.</li>
    </ul>` };

window.ALLML_CONTENT["8.26"] = { tagline:"A dialogue system is not one prediction; it is a running state machine that must understand, remember, retrieve, and decline when needed.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.26-dialogue-systems.ipynb", context:String.raw`
    <p>Dialogue is NLP under turn-taking pressure: each response depends on the current message and on what the conversation has already established.</p>
    <ul>
      <li><b>Intent classification</b> routes a user turn to the right skill, policy, or retrieval index.</li>
      <li><b>Slot filling</b> stores required arguments such as date, city, and time until an action is executable.</li>
      <li><b>Retrieval and safety scoring</b> choose a response candidate while preserving the option to fall back.</li>
    </ul>
    <p>Where it leads: chatbots combine classification (8.25), question answering (8.23), retrieval (8.20), and language generation (8.8) into one multi-turn product surface.</p>`, intuition:String.raw`
    <p>The concrete problem is continuity. If a user says <b>Book it for Friday</b>, the system must remember what <b>it</b> refers to, which slots are already filled, and whether the requested action is safe.</p>
    <p>A single-turn classifier fails because conversations unfold. The best next action may be to ask for a missing city, retrieve a prepared answer, call a tool, or refuse. Dialogue systems therefore maintain state and update it after every turn.</p>
    <p>The design decision people gloss over is fallback. A chatbot should not always produce the highest-ranked response; it should produce a response only when intent, retrieval match, and safety are strong enough. Silence with a helpful handoff can be the correct model behavior.</p>`, mathematics:String.raw`
    <p>A retrieval-style dialogue policy can rank response candidates while also checking state and safety:</p>
    <div class="formula-box">$$\operatorname{score}(r\mid q,S)=\cos(e_q,e_r)+\beta\,\operatorname{complete}(S)-\gamma\,\mathbb{1}[\operatorname{safe}(r)\lt\tau]$$</div>
    <p>Here $e_q$ is the current-turn embedding, $e_r$ is a response embedding, $S$ is the dialogue state, and the final penalty activates when a response safety score falls below threshold $\tau$.</p>

    <p><b>Intent probabilities route the turn.</b> The intent logits for <b>book</b>, <b>cancel</b>, and <b>chitchat</b> are $[2.0,0.5,0.1]$:</p>
    <ol class="work">
      <li>softmax gives probabilities $[0.728,0.163,0.109]$</li>
      <li><b>book</b> wins because $0.728$ is the largest probability</li>
    </ol>
    <p>The first routing decision sends the conversation toward a booking policy rather than cancellation or small talk.</p>

    <p><b>Slot filling tells the policy what is missing.</b> Required slots have indicators date $=1$, city $=0$, and time $=1$:</p>
    <ol class="work">
      <li>filled slots $=1+0+1=2$</li>
      <li>missing required slots $=3-2=1$, namely city</li>
    </ol>
    <p>The system should ask for the city before executing the booking, even if the intent is already clear.</p>

    <p><b>State accumulates across turns.</b> The filled-slot count over turns is $[0,1,2,3]$:</p>
    <ol class="work">
      <li>the increase from first to last turn is $3-0=3$</li>
      <li>the final count $3$ is greater than the initial count $0$</li>
    </ol>
    <p>Dialogue memory is doing real work: later decisions have access to information that was not present in the current utterance alone.</p>

    <p><b>Retrieval picks the nearest response candidate.</b> Query vector $[1,0]$ is compared with responses $[0.9,0.1]$, $[0.2,0.8]$, and $[0.7,0.3]$:</p>
    <ol class="work">
      <li>cosine similarities are $0.994$, $0.243$, and $0.919$</li>
      <li>response $0$ wins because $0.994\gt0.919\gt0.243$</li>
    </ol>
    <p>The retrieval term in the score favors the answer whose embedding direction best matches the user's turn.</p>

    <p><b>Safety can override response selection.</b> Safety scores over three turns are $[0.95,0.6,0.2]$ with fallback threshold $0.5$:</p>
    <ol class="work">
      <li>turn $0$: $0.95\gt0.5$, so no fallback is needed</li>
      <li>turn $2$: $0.2\lt0.5$, so fallback is triggered</li>
    </ol>
    <p>The last response may be semantically close, but the safety term says not to send it as-is.</p>`, pitfalls:String.raw`
    <ul>
      <li><b>Forgetting the state.</b> A correct intent with an incomplete slot vector still cannot execute; city $=0$ should force a follow-up.</li>
      <li><b>Letting retrieval answer every turn.</b> The cosine winner is not automatically safe, current, or actionable.</li>
      <li><b>Missing threshold semantics.</b> The safety comparison uses $\operatorname{safe}(r)\lt\tau$; reversing that inequality turns fallback logic upside down.</li>
      <li><b>Overwriting instead of accumulating slots.</b> The sequence $[0,1,2,3]$ should grow as facts arrive, not reset whenever the user changes wording.</li>
      <li><b>Treating chitchat as harmless by default.</b> Low intent probability or low safety score should still route to a controlled fallback when needed.</li>
    </ul>` };

window.ALLML_CONTENT["8.27"] = { tagline:"Cross-lingual NLP tries to let languages share a geometric workspace without pretending their scripts, data, and grammar are the same.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.27-multilingual-cross-lingual-nlp.ipynb", context:String.raw`
    <p>Multilingual modeling is representation sharing under inequality: some languages have abundant labels, others have little data, and tokenizers may cover their scripts unevenly.</p>
    <ul>
      <li><b>Embeddings</b> (8.6) provide the vector space where words, documents, and labels from different languages can be compared.</li>
      <li><b>Transfer learning</b> reuses supervision from high-resource languages to improve low-resource predictions.</li>
      <li><b>Sampling policies</b> control which languages dominate training when dataset sizes differ sharply.</li>
    </ul>
    <p>Where it leads: multilingual representations improve machine translation (8.22), enable cross-language retrieval for QA (8.23), and support global text classifiers (8.25) when labels exist in only a few languages.</p>`, intuition:String.raw`
    <p>The concrete problem is that users do not arrive in one language, while labeled data often does. A sentiment classifier trained mostly on English should not become useless when a similar Spanish review appears.</p>
    <p>A naive multilingual system trains a separate model per language, which wastes shared structure and abandons low-resource languages. Cross-lingual modeling instead aligns representations so semantically similar items are near each other across languages.</p>
    <p>The design decision people underplay is fairness of coverage. Shared embeddings can transfer signal, but they can also let English dominate, split non-Latin scripts into poor subwords, or hide high loss on smaller languages behind a good average.</p>`, mathematics:String.raw`
    <p>A shared embedding model compares items across languages by cosine similarity, often while reweighting languages during training:</p>
    <div class="formula-box">$$\cos(e_x,e_z)=\frac{e_x^\top e_z}{\|e_x\|\|e_z\|},\qquad q_\ell=\frac{1/L_\ell}{\sum_j 1/L_j}$$</div>
    <p>Here $e_x$ and $e_z$ are embeddings from two languages, $L_\ell$ is the current loss for language $\ell$, and $q_\ell$ is a sampling weight that gives harder or underperforming languages more attention.</p>

    <p><b>Aligned embeddings make translations nearest neighbors.</b> English vectors are $[1,0]$ and $[0,1]$; Spanish vectors are $[0.9,0.1]$ and $[0.1,0.9]$:</p>
    <ol class="work">
      <li>dot-product similarity matrix is $\begin{bmatrix}0.9&0.1\\0.1&0.9\end{bmatrix}$</li>
      <li>English item $0$ matches Spanish item $0$, and English item $1$ matches Spanish item $1$</li>
    </ol>
    <p>The geometry says each source-language meaning is closest to its cross-language counterpart.</p>

    <p><b>Resource imbalance motivates transfer.</b> Training counts are English $=1000$ and Swahili $=50$:</p>
    <ol class="work">
      <li>the ratio is $1000/50=20$</li>
      <li>English has $20$ times as many labeled examples as Swahili</li>
    </ol>
    <p>Without transfer or rebalancing, the model can improve the high-resource language while barely learning the low-resource one.</p>

    <p><b>Script coverage is uneven.</b> Tokenizer coverage scores are Latin $=1.0$, Cyrillic $=0.8$, and Arabic $=0.6$:</p>
    <ol class="work">
      <li>Arabic coverage is lower than Latin by $1.0-0.6=0.4$</li>
      <li>Cyrillic sits between them at $0.8$, with a $0.2$ gap below Latin</li>
    </ol>
    <p>A shared model can still be unfair if the tokenizer gives some scripts cleaner units than others.</p>

    <p><b>Sampling weights can rebalance languages.</b> Losses $[0.2,0.5,1.0]$ are inverted and normalized:</p>
    <ol class="work">
      <li>inverse losses are $[5,2,1]$, whose sum is $8$</li>
      <li>weights are $[5/8,2/8,1/8]=[0.625,0.25,0.125]$, so language $3$ is sampled less than language $1$</li>
    </ol>
    <p>This particular policy emphasizes low-loss languages; the arithmetic makes clear that any sampling rule encodes a training priority.</p>

    <p><b>Zero-shot labels use the same geometry.</b> A label vector $[1,0]$ scores document vectors $[0.8,0.2]$, $[0.1,0.9]$, and $[0.7,0.3]$:</p>
    <ol class="work">
      <li>dot-product scores are $[0.8,0.1,0.7]$</li>
      <li>document $0$ wins because $0.8\gt0.7\gt0.1$</li>
    </ol>
    <p>If the label and documents share a multilingual space, a label learned in one language can rank documents in another.</p>`, pitfalls:String.raw`
    <ul>
      <li><b>Assuming shared space means equal quality.</b> The script coverage gap of $0.4$ shows that some languages can enter the model with worse tokenization.</li>
      <li><b>Letting data volume dominate.</b> A $20$ to $1$ English-Swahili ratio can hide failure on the smaller language inside a good global score.</li>
      <li><b>Using dot products when norms drift.</b> The cosine formula divides by norms; omitting that can make vector length look like semantic similarity.</li>
      <li><b>Misreading sampling weights.</b> The weights $[0.625,0.25,0.125]$ favor the first language under this rule, so they should be inspected rather than assumed fair.</li>
      <li><b>Calling zero-shot universal.</b> Document $0$ wins only because the label geometry aligns; cultural, script, or domain mismatch can break that alignment.</li>
    </ul>` };

window.ALLML_CONTENT["8.28"] = { tagline:"Text-to-SQL succeeds only when language, schema, grammar, and execution all agree on the same meaning.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.28-text-to-sql-semantic-parsing.ipynb", context:String.raw`
    <p>Semantic parsing is where NLP stops producing text and starts producing programs: the answer must be executable, not merely plausible.</p>
    <ul>
      <li><b>Schema linking</b> connects question words to table columns before any SQL action can be trusted.</li>
      <li><b>Grammar-constrained decoding</b> masks invalid next actions so the parser stays inside the language of SQL.</li>
      <li><b>Execution evaluation</b> checks denotation, because two different SQL strings can return the same answer.</li>
    </ul>
    <p>Where it leads: Text-to-SQL extends question answering (8.23) from extracting spans to computing answers, and it shares constrained decoding ideas with tool-using dialogue systems (8.26).</p>`, intuition:String.raw`
    <p>The concrete problem is that natural language underspecifies a program. <b>highest sales</b> must become an aggregation over the right column, not a fluent paraphrase.</p>
    <p>A naive sequence generator can emit SQL-looking tokens that reference the wrong column or violate grammar. A semantic parser must link words to schema items, choose actions in a valid order, and execute the result against data.</p>
    <p>The design decision people gloss over is evaluation. Exact string match is strict about surface form, while execution accuracy cares about the returned answer. Both matter: a query can be syntactically different but semantically equivalent, or string-similar but wrong when run.</p>`, mathematics:String.raw`
    <p>A constrained semantic parser scores actions while masking grammar-invalid choices, then evaluates the executed denotation:</p>
    <div class="formula-box">$$P(a_t=k\mid a_{\lt t},q,\mathcal{S})=\frac{m_k e^{z_k}}{\sum_j m_j e^{z_j}},\qquad \operatorname{ExecAcc}=\frac{1}{N}\sum_{n=1}^{N}\mathbb{1}[\operatorname{exec}(\hat y_n)=\operatorname{exec}(y_n)]$$</div>
    <p>Here $q$ is the question, $\mathcal{S}$ is the database schema, $z_k$ is the next-action logit, and $m_k\in\{0,1\}$ is the grammar mask.</p>

    <p><b>Schema links ground question words.</b> Words $[\textsf{highest},\textsf{sales}]$ are linked to columns $[\textsf{revenue},\textsf{region}]$ by scores $\begin{bmatrix}0.8&0.1\\0.9&0.2\end{bmatrix}$:</p>
    <ol class="work">
      <li>for <b>sales</b>, revenue score $0.9$ exceeds region score $0.2$</li>
      <li>the margin is $0.9-0.2=0.7$, so <b>sales</b> links strongly to revenue</li>
    </ol>
    <p>The parser should aggregate the revenue column, not the region column, because the schema evidence points there.</p>

    <p><b>Action sequences build the query.</b> The planned actions are $[\textsf{SELECT},\textsf{AGG\_MAX},\textsf{COLUMN\_revenue},\textsf{FROM\_sales}]$:</p>
    <ol class="work">
      <li>there are $4$ actions, indexed $0$ through $3$</li>
      <li>the first two actions are SELECT then AGG_MAX, establishing a maximum aggregation query</li>
    </ol>
    <p>Meaning is assembled step by step; choosing AGG_MAX before the revenue column encodes <b>highest</b> as an operation rather than a word.</p>

    <p><b>Grammar masks remove invalid next tokens.</b> Validity mask $[1,0,1,0]$ is applied to logits $[2,5,1,4]$:</p>
    <ol class="work">
      <li>invalid positions $1$ and $3$ receive probability $0$</li>
      <li>softmax over remaining logits $2$ and $1$ gives probabilities $[0.731,0,0.269,0]$</li>
    </ol>
    <p>The highest raw logit was invalid, so the mask is not decoration; it changes the decoded program.</p>

    <p><b>Execution grounds the program in data.</b> Rows have values $[10,30,20]$ for the target column:</p>
    <ol class="work">
      <li>the maximum is $30$</li>
      <li>the selected row value beats the others because $30\gt20\gt10$</li>
    </ol>
    <p>The SQL meaning is verified by the denotation it produces, not by whether the query text looks elegant.</p>

    <p><b>Exact match and execution accuracy can diverge.</b> Exact-match indicators are $[1,0,0]$ and execution indicators are $[1,1,0]$:</p>
    <ol class="work">
      <li>exact matches total $1+0+0=1$</li>
      <li>execution-correct queries total $1+1+0=2$, so execution accuracy is higher on this set</li>
    </ol>
    <p>One non-matching SQL string still returns the right answer, which is why semantic parsing reports denotation-level correctness alongside string match.</p>`, pitfalls:String.raw`
    <ul>
      <li><b>Skipping schema linking.</b> If <b>sales</b> points to region instead of revenue, the whole query can be valid SQL and still answer the wrong question.</li>
      <li><b>Letting invalid logits win.</b> The raw logit $5$ at position $1$ must become probability $0$ because $m_1=0$.</li>
      <li><b>Overvaluing exact match.</b> The indicators show one extra query executes correctly despite not matching the reference string.</li>
      <li><b>Trusting syntax without execution.</b> A grammatical query can select the wrong column, aggregation, or table; denotation checks catch that.</li>
      <li><b>Masking with the wrong grammar state.</b> A stale mask can forbid the needed action or allow an impossible one, corrupting $P(a_t=k\mid a_{\lt t},q,\mathcal{S})$ silently.</li>
    </ul>` };
