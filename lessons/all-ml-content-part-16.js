/* All ML — authored content for Part 16: Information Retrieval & Search (16.1–16.8).
   Appends to window.ALLML_CONTENT (merged into lessons by id in all-ml-register.js).
   Every number here was computed and verified before shipping. LaTeX via String.raw;
   emphasis is bold (no prose italics). */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

/* ---------------- 16.1 Inverted indexes & Boolean retrieval ---------------- */
window.ALLML_CONTENT["16.1"] = {
  tagline: "Search begins by turning documents into postings lists, so a query can jump straight to the documents that contain its terms.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/16.1-inverted-indexes.ipynb",
  context: String.raw`
    <p>This lesson is the first machinery behind retrieval: it teaches the data structure that makes keyword search fast.</p>
    <ul>
      <li><b>Sets and logic</b> become the operations of retrieval: AND is intersection, OR is union, and NOT is set difference.</li>
      <li><b>Tokenization</b> turns raw text into the terms that can be placed in an index; the index is only as good as these normalized keys.</li>
      <li><b>Term frequency and document frequency</b> prepare the counts that BM25 (16.2) and TF-IDF vector spaces (16.3) will weight rather than merely filter.</li>
    </ul>
    <p>Where it leads: Boolean retrieval gives exact candidates quickly, BM25 (16.2) ranks them, hybrid retrieval (16.6) combines them with dense candidates, and retrieval evaluation (16.8) asks whether the whole pipeline returned useful documents.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple: if a corpus has millions of documents, scanning every document for every query is wasteful. The inverted index flips the table. Instead of document to terms, it stores term to documents.</p>
    <p>The pain in the naive approach is that every query pays for the whole corpus. The index pays a construction cost once, then each query touches only the postings lists for the query terms. That is why almost every production search stack starts with an inverted index, even if a neural system later re-ranks the results.</p>
    <p>The design decision people gloss over is sorted postings. Keeping document ids in sorted order makes AND queries a linear merge, not a nested comparison. Search speed comes less from clever scoring than from making the cheapest filtering step painfully efficient.</p>`,
  mathematics: String.raw`
    <p>Let the corpus be $D=\{d_1,\ldots,d_N\}$ with $N=4$. An inverted index maps each term $t$ to a postings list $P(t)=\{i:t\in d_i\}$. Boolean operators become set operators: $P(a\;\text{AND}\;b)=P(a)\cap P(b)$, $P(a\;\text{OR}\;b)=P(a)\cup P(b)$, and $P(\text{NOT }a)=\{1,\ldots,N\}\setminus P(a)$.</p>
    <p><b>Build the postings.</b> For documents $d_1=\{\text{neural, search}\}$, $d_2=\{\text{search, graph}\}$, $d_3=\{\text{neural, retrieval}\}$, and $d_4=\{\text{graph, retrieval, search}\}$:</p>
    <ol class="work">
      <li>$P(\text{neural})=\{1,3\}$ because the term appears in $d_1$ and $d_3$.</li>
      <li>$P(\text{search})=\{1,2,4\}$ because it appears in $d_1,d_2,d_4$.</li>
      <li>$P(\text{graph})=\{2,4\}$ and $P(\text{retrieval})=\{3,4\}$.</li>
    </ol>
    <p>Those four lists are the whole retrieval surface for exact keyword matching; the original text no longer needs to be scanned for these queries.</p>
    <p><b>Run Boolean queries by set arithmetic.</b></p>
    <ol class="work">
      <li>search AND graph: $\{1,2,4\}\cap\{2,4\}=\{2,4\}$.</li>
      <li>neural OR retrieval: $\{1,3\}\cup\{3,4\}=\{1,3,4\}$.</li>
      <li>NOT search: $\{1,2,3,4\}\setminus\{1,2,4\}=\{3\}$.</li>
    </ol>
    <p>The answer is exact, but exactness is also the limitation: a document that says "semantic matching" may be relevant to "neural search" and still be invisible to this index.</p>
    <p><b>Count how rare each term is.</b> Document frequency is $df(t)=|P(t)|$, and the simplest inverse-document-frequency signal is $idf(t)=\log(N/df(t))$.</p>
    <ol class="work">
      <li>neural: $df=2$, so $idf=\log(4/2)=\log 2=0.693$.</li>
      <li>search: $df=3$, so $idf=\log(4/3)=0.288$.</li>
      <li>graph and retrieval each have $df=2$, so each has $idf=0.693$.</li>
    </ol>
    <p>The index has now exposed a ranking clue: rare terms carry more discrimination than common terms, which is exactly what BM25 formalizes next.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Forgetting normalization.</b> If "Search" and "search" become different keys, $P(t)$ splits evidence and Boolean recall silently drops.</li>
      <li><b>Leaving postings unsorted.</b> Intersection then becomes repeated membership testing instead of a two-pointer merge, so the $P(a)\cap P(b)$ operation loses its main speed advantage.</li>
      <li><b>Treating Boolean retrieval as ranking.</b> Set membership answers yes or no; without a score like $idf$ or BM25, all returned documents are tied.</li>
      <li><b>Overusing NOT.</b> $\{1,\ldots,N\}\setminus P(t)$ can be huge, so a negative term may expand work rather than narrow it.</li>
    </ul>`
};

/* ---------------- 16.2 BM25 & probabilistic retrieval ---------------- */
window.ALLML_CONTENT["16.2"] = {
  tagline: "BM25 ranks keyword matches by rewarding rare query terms, saturating repeated terms, and correcting for document length.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/16.2-bm25.ipynb",
  context: String.raw`
    <p>BM25 is what happens when the exact candidate machinery of 16.1 grows a careful ranking function.</p>
    <ul>
      <li><b>Inverted indexes (16.1)</b> provide $tf(t,d)$ and $df(t)$ without scanning every document.</li>
      <li><b>Logarithms</b> turn rarity into a stable additive weight, so one rare term can matter without exploding the score.</li>
      <li><b>Normalization</b> from earlier modeling lessons appears as length correction: a long document should not win merely because it has more places to repeat a word.</li>
    </ul>
    <p>Where it leads: BM25 is the sparse half of hybrid retrieval (16.6), a strong baseline for dense retrieval (16.4), and a candidate generator for cross-encoder re-ranking (16.7).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that Boolean retrieval can say a document matches, but it cannot say which match is better. A document containing two query terms should usually beat one containing one, and a rare term should matter more than a common one.</p>
    <p>The naive count-based approach is brittle. Counting every repetition linearly lets keyword-stuffed documents win; ignoring length lets long documents collect accidental hits. BM25 fixes both with two choices: repeated terms saturate, and longer-than-average documents are discounted.</p>
    <p>The design decision worth noticing is that BM25 is not just TF-IDF with a prettier formula. Its term-frequency fraction bends quickly: the first occurrence is valuable, the second helps, and the tenth helps very little. That shape is why it remains a hard baseline to beat.</p>`,
  mathematics: String.raw`
    <p>For query $q$, document $d$, corpus size $N$, document frequency $df_t$, document length $|d|$, average length $avgdl$, and term count $tf_{t,d}$, BM25 scores</p>
    <div class="formula-box">$$\text{BM25}(q,d)=\sum_{t\in q} idf(t)\frac{tf_{t,d}(k_1+1)}{tf_{t,d}+k_1(1-b+b|d|/avgdl)}$$</div>
    <p>Here $idf(t)=\log\left(1+\frac{N-df_t+0.5}{df_t+0.5}\right)$, $k_1=1.2$ controls saturation, and $b=0.75$ controls length normalization.</p>
    <p><b>Compute the corpus constants.</b> Use four documents with lengths $3,2,3,4$, so $avgdl=(3+2+3+4)/4=3.000$.</p>
    <ol class="work">
      <li>For search, $df=3$: $idf=\log(1+(4-3+0.5)/(3+0.5))=\log(1.429)=0.357$.</li>
      <li>For neural, $df=2$: $idf=\log(1+(4-2+0.5)/(2+0.5))=\log(2.000)=0.693$.</li>
    </ol>
    <p>The rarer term neural receives almost twice the weight of search before term frequency is even considered.</p>
    <p><b>Score the query "neural search".</b></p>
    <ol class="work">
      <li>$d_1$ has search twice and neural once, $|d|=3$: search denominator $2+1.2(1)=3.200$, contribution $0.357\cdot(2\cdot2.2)/3.200=0.490$; neural contribution $0.693\cdot(1\cdot2.2)/2.200=0.693$; total $1.184$.</li>
      <li>$d_2$ has search once and no neural, $|d|=2$: denominator $1+1.2(0.25+0.75\cdot2/3)=1.900$, contribution $0.357\cdot2.2/1.900=0.413$.</li>
      <li>$d_3$ has neural once and no search, $|d|=3$: total $0.693$.</li>
      <li>$d_4$ has search twice, no neural, $|d|=4$: denominator $2+1.2(0.25+0.75\cdot4/3)=3.500$, contribution $0.357\cdot4.4/3.500=0.448$.</li>
    </ol>
    <p>The ranking is $d_1 \gt d_3 \gt d_4 \gt d_2$. The repeated search term helps $d_1$, but the missing rare term keeps $d_4$ below $d_3$.</p>
    <p><b>See saturation directly.</b> In an average-length document, the term-frequency multiplier for $tf=1,2,5$ is $2.2/(1+1.2)=1.000$, $4.4/(2+1.2)=1.375$, and $11/(5+1.2)=1.774$.</p>
    <ol class="work">
      <li>The first occurrence moves the multiplier from $0$ to $1.000$.</li>
      <li>The second adds only $0.375$.</li>
      <li>Going from two to five adds $1.774-1.375=0.399$ total, so repetition has diminishing returns.</li>
    </ol>
    <p>This is the anti-stuffing mechanism: repeated evidence matters, but the formula refuses to count it linearly.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Using raw counts as scores.</b> That removes the denominator's saturation term, so repeated query terms dominate instead of flattening.</li>
      <li><b>Ignoring document length.</b> Setting $b=0$ makes the $|d|/avgdl$ correction disappear, favoring long documents with accidental matches.</li>
      <li><b>Comparing scores across differently processed indexes.</b> Changing tokenization changes $tf$, $df$, and $avgdl$, so a BM25 number is meaningful only inside the same index.</li>
      <li><b>Expecting semantic recall.</b> BM25 cannot score terms that never overlap; dense retrieval (16.4) exists to cover that failure mode.</li>
    </ul>`
};

/* ---------------- 16.3 Vector-space models ---------------- */
window.ALLML_CONTENT["16.3"] = {
  tagline: "Vector-space retrieval represents queries and documents as weighted term vectors, then ranks by angle rather than exact Boolean membership.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/16.3-vector-space-models.ipynb",
  context: String.raw`
    <p>Vector-space models soften the hard yes-or-no retrieval of 16.1 while keeping the sparse, inspectable vocabulary.</p>
    <ul>
      <li><b>Inverted-index counts (16.1)</b> become coordinates in a document-term matrix.</li>
      <li><b>IDF weighting (16.2)</b> becomes a diagonal rescaling that makes rare coordinates matter more.</li>
      <li><b>Linear algebra</b> supplies dot products, norms, and cosine similarity, the same geometric tools later reused by dense embeddings (16.4).</li>
    </ul>
    <p>Where it leads: sparse vector spaces are the conceptual bridge from BM25 to dense retrieval (16.4), and their scores often become one feature in hybrid retrieval (16.6).</p>`,
  intuition: String.raw`
    <p>The concrete problem is ranking partial matches. Boolean retrieval treats a document with one query term as simply in or out. A vector-space model asks a gentler question: how close is the document's weighted term pattern to the query's pattern?</p>
    <p>The naive dot product rewards longer documents, because more coordinates create more chances for overlap. Cosine similarity divides by vector length, so the score becomes about direction: two short and long documents can tie if their term proportions point the same way.</p>
    <p>The design decision people miss is why we weight before taking angles. Without IDF, common words dominate the geometry. With TF-IDF, the space rotates attention toward terms that actually distinguish documents.</p>`,
  mathematics: String.raw`
    <p>Let $X\in\mathbb{R}^{N\times V}$ be the term-count matrix for $N$ documents and $V$ vocabulary terms. With smoothed $idf_j=\log((N+1)/(df_j+1))+1$, the TF-IDF vector for document $i$ is $v_i=X_i\odot idf$. Query-document similarity is</p>
    <div class="formula-box">$$\cos(q,v_i)=\frac{q^\top v_i}{\|q\|_2\|v_i\|_2}$$</div>
    <p><b>Compute the weights.</b> For vocabulary [neural, search, graph, retrieval] and the four documents from 16.1, document frequencies are $[2,3,2,2]$.</p>
    <ol class="work">
      <li>neural: $idf=\log(5/3)+1=1.511$.</li>
      <li>search: $idf=\log(5/4)+1=1.223$.</li>
      <li>graph and retrieval each have $idf=\log(5/3)+1=1.511$.</li>
    </ol>
    <p>The common term search is still useful, but its coordinate is smaller than the rarer terms.</p>
    <p><b>Represent the query "neural search".</b> Its weighted vector is $q=[1.511,1.223,0,0]$.</p>
    <ol class="work">
      <li>$\|q\|_2=\sqrt{1.511^2+1.223^2}=1.944$.</li>
      <li>$d_1=[1.511,1.223,0,0]$ gives cosine $q^\top d_1/(1.944\cdot1.944)=1.000$ before repeated-count effects.</li>
      <li>With $d_1$ containing search twice, its vector is $[1.511,2.446,0,0]$, giving cosine $0.944$.</li>
    </ol>
    <p>The repeated search term tilts $d_1$ slightly away from the exact query direction, but it remains the closest document.</p>
    <p><b>Rank all four documents.</b></p>
    <ol class="work">
      <li>$d_1$: cosine $0.944$.</li>
      <li>$d_2$: cosine $0.396$.</li>
      <li>$d_3$: cosine $0.550$.</li>
      <li>$d_4$: cosine $0.474$.</li>
    </ol>
    <p>The order $d_1 \gt d_3 \gt d_4 \gt d_2$ mirrors BM25 here, but the reason is geometric: documents pointing toward the query direction win.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Forgetting length normalization.</b> Using $q^\top v_i$ alone lets larger $\|v_i\|_2$ inflate the score, even when the document is not more aligned.</li>
      <li><b>Letting stopwords dominate coordinates.</b> If common terms keep high weights, the angle measures topic-irrelevant overlap.</li>
      <li><b>Assuming sparse vectors understand synonyms.</b> "car" and "automobile" are different coordinates unless preprocessing or embeddings tie them together.</li>
      <li><b>Mixing TF-IDF conventions.</b> Different smoothing formulas change $idf_j$, so reproducibility requires naming the exact formula.</li>
    </ul>`
};

/* ---------------- 16.4 Dense retrieval & embeddings ---------------- */
window.ALLML_CONTENT["16.4"] = {
  tagline: "Dense retrieval maps text into learned vectors, so semantic neighbors can be retrieved even when their words do not overlap.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/16.4-dense-retrieval.ipynb",
  context: String.raw`
    <p>Dense retrieval keeps the vector geometry of 16.3 but changes what the coordinates mean.</p>
    <ul>
      <li><b>Cosine similarity (16.3)</b> remains the ranking operation; the difference is that learned embedding coordinates replace vocabulary coordinates.</li>
      <li><b>Representation learning</b> from earlier neural lessons supplies encoders that place semantically similar texts near one another.</li>
      <li><b>Candidate generation</b> links forward to approximate nearest neighbors (16.5), because scanning every dense vector is too slow at real scale.</li>
    </ul>
    <p>Where it leads: dense retrieval supplies semantic recall, hybrid retrieval (16.6) combines it with BM25 precision, and bi-encoder design is contrasted with cross-encoders in 16.7.</p>`,
  intuition: String.raw`
    <p>The concrete problem is vocabulary mismatch. A sparse system may miss a relevant document because it says "vector database" while the query says "embedding search." Dense retrieval tries to put those meanings near each other anyway.</p>
    <p>The naive alternative is to expand queries with synonyms by hand, but language is too varied and context-dependent. A learned encoder compresses text into a small vector whose location carries semantic information learned from many examples.</p>
    <p>The design decision is to encode queries and documents separately. That makes retrieval fast because document vectors can be precomputed, but it also means the score is a simple vector comparison rather than a deep joint reading of the pair. Cross-encoders (16.7) spend more compute to repair that weakness.</p>`,
  mathematics: String.raw`
    <p>An encoder $f_\theta$ maps text to an embedding in $\mathbb{R}^d$. Dense retrieval stores $z_i=f_\theta(d_i)$ and ranks by cosine or dot product:</p>
    <div class="formula-box">$$s(q,d_i)=\cos(f_\theta(q),z_i)=\frac{f_\theta(q)^\top z_i}{\|f_\theta(q)\|_2\|z_i\|_2}$$</div>
    <p><b>Compute a tiny semantic neighborhood.</b> Let $q=[0.9,0.1]$ and document embeddings $z_1=[1,0]$, $z_2=[0.8,0.2]$, $z_3=[0,1]$, $z_4=[-0.2,0.9]$.</p>
    <ol class="work">
      <li>$\|q\|_2=\sqrt{0.9^2+0.1^2}=0.906$.</li>
      <li>$s(q,z_1)=0.9/(0.906\cdot1)=0.994$.</li>
      <li>$s(q,z_2)=(0.9\cdot0.8+0.1\cdot0.2)/(0.906\cdot0.825)=0.991$.</li>
      <li>$s(q,z_3)=0.1/(0.906\cdot1)=0.110$ and $s(q,z_4)=(-0.18+0.09)/(0.906\cdot0.922)=-0.108$.</li>
    </ol>
    <p>The first two documents are retrieved because their vectors point in the same semantic direction as the query, not because we inspected exact tokens.</p>
    <p><b>Normalize before using dot products.</b> If vectors are unit-normalized, cosine equals dot product.</p>
    <ol class="work">
      <li>$z_2/\|z_2\|=[0.970,0.243]$ because $\sqrt{0.8^2+0.2^2}=0.825$.</li>
      <li>$q/\|q\|=[0.994,0.110]$.</li>
      <li>The dot product $0.994\cdot0.970+0.110\cdot0.243=0.991$, matching cosine.</li>
    </ol>
    <p>This equivalence is why vector databases often store normalized embeddings and use fast inner-product search.</p>
    <p><b>Compare sparse and dense failure modes.</b> A document can have zero lexical overlap and still receive $s=0.991$ if its embedding is aligned; a keyword-perfect but off-topic document can be rescued only if the encoder learned that it points elsewhere.</p>
    <ol class="work">
      <li>Aligned dense neighbor: $0.991 \gt 0.110$.</li>
      <li>Opposite semantic direction: $-0.108 \lt 0$, so it should not be retrieved for this query.</li>
    </ol>
    <p>Dense retrieval buys semantic recall, but it places trust in the learned geometry.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Skipping normalization while assuming cosine.</b> Raw dot products mix direction with vector norm, so high-norm embeddings can win for the wrong reason.</li>
      <li><b>Expecting exact constraints.</b> Dense scores do not guarantee that a required keyword, date, or product name appears; sparse filters still matter.</li>
      <li><b>Using an encoder off-domain.</b> If $f_\theta$ was not trained on your language and relevance pattern, nearby vectors may reflect the wrong semantics.</li>
      <li><b>Scanning all vectors at scale.</b> Exact nearest-neighbor search is $O(Nd)$ per query, which motivates ANN indexes in 16.5.</li>
    </ul>`
};

/* ---------------- 16.5 Approximate nearest neighbors (FAISS, HNSW, IVF) ---------------- */
window.ALLML_CONTENT["16.5"] = {
  tagline: "Approximate nearest-neighbor indexes trade a little recall for a large speedup in vector search.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/16.5-approximate-nearest-neighbors.ipynb",
  context: String.raw`
    <p>ANN is the systems answer to the dense-retrieval cost exposed in 16.4.</p>
    <ul>
      <li><b>Dense embeddings (16.4)</b> create the vectors; ANN decides which vectors are worth comparing exactly.</li>
      <li><b>Distance metrics</b> provide the objective: nearest means smallest Euclidean distance or largest cosine similarity after normalization.</li>
      <li><b>Graph and clustering ideas</b> appear in HNSW-style neighbor walks and IVF-style coarse partitions.</li>
    </ul>
    <p>Where it leads: ANN makes dense retrieval practical enough to join BM25 in hybrid retrieval (16.6), while retrieval evaluation (16.8) measures the recall lost by approximation.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that exact vector search compares the query with every stored vector. At a billion documents, even a cheap dot product becomes expensive.</p>
    <p>The naive shortcut is to sample random documents, but that loses recall unpredictably. ANN indexes add structure: clusters let us search only promising regions, and graph links let us walk quickly toward nearby points.</p>
    <p>The design decision is to accept a controlled miss rate. Search systems usually prefer returning a very good neighbor in milliseconds over proving the exact nearest neighbor too slowly to use.</p>`,
  mathematics: String.raw`
    <p>For Euclidean vectors $x_i\in\mathbb{R}^d$, exact nearest-neighbor search returns $\arg\min_i\|x_i-q\|_2$. ANN restricts this comparison to a candidate set $C(q)$, returning $\arg\min_{i\in C(q)}\|x_i-q\|_2$.</p>
    <p><b>Compute exact neighbors.</b> With points $[0,0]$, $[1,0]$, $[0,1]$, $[3,3]$, $[3.2,3.1]$, $[4,3]$ and query $q=[3.1,3.0]$:</p>
    <ol class="work">
      <li>$d([3,3],q)=\sqrt{(3-3.1)^2+(3-3.0)^2}=0.100$.</li>
      <li>$d([3.2,3.1],q)=\sqrt{0.1^2+0.1^2}=0.141$.</li>
      <li>$d([4,3],q)=\sqrt{0.9^2+0^2}=0.900$.</li>
      <li>The far cluster distances include $4.314$, $3.662$, and $3.689$.</li>
    </ol>
    <p>The exact nearest point is $[3,3]$, but finding that by brute force required all six comparisons.</p>
    <p><b>IVF-style coarse search.</b> Suppose a coarse quantizer has centroids $c_1=[0.33,0.33]$ and $c_2=[3.4,3.03]$.</p>
    <ol class="work">
      <li>$\|q-c_1\|_2=\sqrt{2.77^2+2.67^2}=3.847$.</li>
      <li>$\|q-c_2\|_2=\sqrt{0.30^2+0.03^2}=0.302$.</li>
      <li>Searching only the $c_2$ list compares three points instead of six and still finds distance $0.100$.</li>
    </ol>
    <p>The speedup comes from replacing many fine comparisons with a few coarse comparisons plus a short local scan.</p>
    <p><b>Measure the approximation.</b> Recall@1 is $1$ if the ANN top result equals the exact top result and $0$ otherwise.</p>
    <ol class="work">
      <li>If $C(q)=\{[3,3],[3.2,3.1],[4,3]\}$, ANN returns $[3,3]$, so recall@1 $=1$.</li>
      <li>If a bad partition searches only $\{[4,3]\}$, ANN returns distance $0.900$ while exact is $0.100$, so recall@1 $=0$.</li>
    </ol>
    <p>ANN quality is therefore not a vague feeling; it is a measurable recall-speed tradeoff.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Reporting latency without recall.</b> A fast ANN index that searches the wrong $C(q)$ is just a fast way to miss relevant neighbors.</li>
      <li><b>Changing the metric accidentally.</b> Euclidean distance and cosine agree only under specific normalization; mixing them changes the nearest-neighbor order.</li>
      <li><b>Using too few probes.</b> IVF speed comes from searching few lists, but too few lists can exclude the true nearest point before scoring begins.</li>
      <li><b>Assuming library names are concepts.</b> FAISS is an implementation; HNSW and IVF are indexing strategies with different failure modes.</li>
    </ul>`
};

/* ---------------- 16.6 Hybrid retrieval & re-ranking ---------------- */
window.ALLML_CONTENT["16.6"] = {
  tagline: "Hybrid retrieval joins sparse precision with dense semantic recall, then re-ranking spends extra compute only on the shortlist.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/16.6-hybrid-retrieval.ipynb",
  context: String.raw`
    <p>Hybrid retrieval is the practical compromise built from the previous retrieval tools.</p>
    <ul>
      <li><b>BM25 (16.2)</b> contributes exact lexical evidence, especially for names, codes, and rare terms.</li>
      <li><b>Dense retrieval (16.4)</b> contributes semantic evidence when words do not overlap.</li>
      <li><b>ANN (16.5)</b> makes dense candidate generation fast enough to run before a more expensive re-ranker.</li>
    </ul>
    <p>Where it leads: cross-encoders (16.7) are the common re-ranking stage, and retrieval evaluation (16.8) decides whether fusion improved recall, precision, or both.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that sparse and dense retrieval fail differently. BM25 may miss synonyms; dense retrieval may blur exact constraints. A production system often wants both.</p>
    <p>The naive approach is to pick one winner, but that throws away complementary evidence. Hybrid retrieval instead creates candidate pools from both systems, normalizes their scores, fuses them, and optionally re-ranks only the best candidates with a slower model.</p>
    <p>The design decision people gloss over is score calibration. A BM25 score and a cosine score do not live on the same scale. Fusion must normalize or rank-transform them before arithmetic means anything.</p>`,
  mathematics: String.raw`
    <p>Let $s_b(d)$ be a normalized BM25 score and $s_e(d)$ a normalized embedding score. A simple hybrid score is</p>
    <div class="formula-box">$$s_h(d)=\alpha s_b(d)+(1-\alpha)s_e(d)$$</div>
    <p>A re-ranker then scores a shortlist with $s_r(d)$ and may combine $s_f(d)=\lambda s_h(d)+(1-\lambda)s_r(d)$.</p>
    <p><b>Fuse sparse and dense scores.</b> For four documents, let $s_b=[0.80,0.20,0.60,0.10]$, $s_e=[0.10,0.90,0.50,0.30]$, and $\alpha=0.5$.</p>
    <ol class="work">
      <li>$d_1$: $0.5\cdot0.80+0.5\cdot0.10=0.450$.</li>
      <li>$d_2$: $0.5\cdot0.20+0.5\cdot0.90=0.550$.</li>
      <li>$d_3$: $0.5\cdot0.60+0.5\cdot0.50=0.550$.</li>
      <li>$d_4$: $0.5\cdot0.10+0.5\cdot0.30=0.200$.</li>
    </ol>
    <p>The hybrid shortlist keeps both the dense-only winner $d_2$ and the balanced candidate $d_3$.</p>
    <p><b>Re-rank the shortlist.</b> Suppose a cross-encoder-like re-ranker gives $s_r=[0.30,0.95,0.55,0.20]$ and $\lambda=0.4$.</p>
    <ol class="work">
      <li>$d_1$: $0.4\cdot0.45+0.6\cdot0.30=0.360$.</li>
      <li>$d_2$: $0.4\cdot0.55+0.6\cdot0.95=0.790$.</li>
      <li>$d_3$: $0.4\cdot0.55+0.6\cdot0.55=0.550$.</li>
      <li>$d_4$: $0.4\cdot0.20+0.6\cdot0.20=0.200$.</li>
    </ol>
    <p>The final order is $d_2 \gt d_3 \gt d_1 \gt d_4$ because the re-ranker has enough query-document interaction to separate the tied hybrid candidates.</p>
    <p><b>See the calibration warning.</b> If raw BM25 were $[8,2,6,1]$ while dense stayed $[0.1,0.9,0.5,0.3]$, an unnormalized average would be dominated by sparse scale.</p>
    <ol class="work">
      <li>Raw average for $d_1$: $(8+0.1)/2=4.050$.</li>
      <li>Raw average for $d_2$: $(2+0.9)/2=1.450$.</li>
      <li>After normalization above, $d_2$ and $d_3$ both reach $0.550$, so dense evidence can actually matter.</li>
    </ol>
    <p>Fusion is only meaningful after the scores are made comparable.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Averaging raw scores.</b> The formula $s_h=\alpha s_b+(1-\alpha)s_e$ assumes comparable scales; otherwise the larger numeric range wins.</li>
      <li><b>Making the shortlist too small.</b> A re-ranker cannot recover a relevant document that BM25 and dense retrieval both failed to admit.</li>
      <li><b>Tuning only final precision.</b> Candidate recall must be measured before re-ranking, or improvements may hide upstream misses.</li>
      <li><b>Using one alpha everywhere.</b> Exact-code queries may need more sparse weight, while vague semantic queries may need more dense weight.</li>
    </ul>`
};

/* ---------------- 16.7 Cross-encoders vs bi-encoders ---------------- */
window.ALLML_CONTENT["16.7"] = {
  tagline: "Bi-encoders are fast because they compare precomputed vectors; cross-encoders are slower because they read the query and document together.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/16.7-cross-vs-bi-encoders.ipynb",
  context: String.raw`
    <p>This lesson names the encoder tradeoff behind dense retrieval and re-ranking.</p>
    <ul>
      <li><b>Dense retrieval (16.4)</b> uses bi-encoders: query and document vectors are produced separately and compared cheaply.</li>
      <li><b>Hybrid re-ranking (16.6)</b> often uses cross-encoders: the shortlist is small enough to afford joint query-document scoring.</li>
      <li><b>Attention mechanisms</b> from transformer lessons explain why cross-encoders can model token-level interactions that a single precomputed vector must compress away.</li>
    </ul>
    <p>Where it leads: retrieval systems commonly use bi-encoders for recall, cross-encoders for precision, and evaluation (16.8) to choose the cutoff where the tradeoff is worth it.</p>`,
  intuition: String.raw`
    <p>The concrete problem is deciding how much computation to spend per candidate. A system with millions of documents cannot jointly read the query with every document, but a final top-100 shortlist might deserve that care.</p>
    <p>A bi-encoder is the fast design: encode the query once, precompute document embeddings, and use dot products. A cross-encoder is the careful design: concatenate query and document, let the model inspect their words together, and output one relevance score.</p>
    <p>The design decision is separation versus interaction. Separation enables indexing; interaction enables nuance. The best retrieval stacks usually do not choose one forever; they stage them.</p>`,
  mathematics: String.raw`
    <p>A bi-encoder uses $s_{bi}(q,d)=\cos(f(q),g(d))$, where $g(d)$ can be precomputed. A cross-encoder uses $s_{cross}(q,d)=h([q;d])$, where the pair must be processed together.</p>
    <p><b>Compute bi-encoder similarities.</b> Let $q=[1,0]$ and document vectors $d_1=[0.9,0.1]$, $d_2=[0.7,0.7]$, $d_3=[0,1]$.</p>
    <ol class="work">
      <li>$s_{bi}(q,d_1)=0.9/(1\cdot\sqrt{0.9^2+0.1^2})=0.994$.</li>
      <li>$s_{bi}(q,d_2)=0.7/(1\cdot\sqrt{0.7^2+0.7^2})=0.707$.</li>
      <li>$s_{bi}(q,d_3)=0/(1\cdot1)=0.000$.</li>
    </ol>
    <p>The bi-encoder ranks $d_1$ first because it is closest in compressed vector space.</p>
    <p><b>Let a cross-encoder revise the order.</b> Suppose the joint model scores the same pairs as $[0.62,0.88,0.10]$.</p>
    <ol class="work">
      <li>$d_1$ moves from $0.994$ bi-score to $0.620$ cross-score.</li>
      <li>$d_2$ moves from $0.707$ bi-score to $0.880$ cross-score.</li>
      <li>The ranking changes from $d_1 \gt d_2 \gt d_3$ to $d_2 \gt d_1 \gt d_3$.</li>
    </ol>
    <p>This is exactly why cross-encoders are useful after candidate generation: they can notice pair-specific relevance that the embedding missed.</p>
    <p><b>Price the computation.</b> With $N=1{,}000{,}000$ documents and embedding dimension $d=2$ in this toy example, a bi-encoder query compares $N\cdot d=2{,}000{,}000$ multiply-add coordinates after precomputation.</p>
    <ol class="work">
      <li>If a cross-encoder costs one model pass per pair, scoring all documents costs $1{,}000{,}000$ passes.</li>
      <li>Scoring only a top-100 shortlist costs $100$ passes.</li>
      <li>The shortlist reduces cross-encoder passes by $1{,}000{,}000/100=10{,}000\times$.</li>
    </ol>
    <p>The architecture follows the arithmetic: use bi-encoders to find candidates, then spend cross-encoder compute where it can change the final order.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Trying to index cross-encoder scores.</b> Because $h([q;d])$ depends on the query-document pair, document scores cannot be precomputed once for all queries.</li>
      <li><b>Using a bi-encoder cutoff that is too small.</b> If the true best document is not in the shortlist, the cross-encoder never sees it.</li>
      <li><b>Comparing scores as if calibrated.</b> A bi-encoder cosine and a cross-encoder probability-like score have different meanings and should not be mixed without calibration.</li>
      <li><b>Assuming cross-encoders always win.</b> They can overfit or be too slow; the right question is whether their gain at the chosen cutoff beats their latency cost.</li>
    </ul>`
};

/* ---------------- 16.8 Retrieval evaluation ---------------- */
window.ALLML_CONTENT["16.8"] = {
  tagline: "Retrieval evaluation turns a ranked list into measurable precision, recall, DCG, nDCG, and average precision.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/16.8-retrieval-evaluation.ipynb",
  context: String.raw`
    <p>This lesson closes the search loop: after building retrievers, we need to know whether they helped.</p>
    <ul>
      <li><b>Ranked lists</b> from BM25 (16.2), dense retrieval (16.4), hybrid retrieval (16.6), and re-ranking (16.7) are the object being measured.</li>
      <li><b>Classification metrics</b> contribute precision and recall, but retrieval adds rank sensitivity because position matters.</li>
      <li><b>Discounted sums</b> connect to the same logarithmic thinking used in IDF: later positions matter, but less.</li>
    </ul>
    <p>Where it leads: these metrics decide ANN probe settings (16.5), hybrid weights (16.6), and whether a cross-encoder's quality gain justifies its latency (16.7).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a search result is ordered. Returning three relevant documents somewhere in the top ten is good; putting them at positions one, two, and three is better.</p>
    <p>The naive metric is accuracy, but accuracy ignores rank and the many non-retrieved documents. Retrieval metrics focus on the list the user actually sees: precision asks how clean it is, recall asks how complete it is, and nDCG asks whether relevance appears early.</p>
    <p>The design decision people gloss over is the cutoff $k$. A metric at 3 and a metric at 100 answer different product questions. Evaluation is not just formula selection; it is choosing the viewing window that matches the user experience.</p>`,
  mathematics: String.raw`
    <p>For a ranked list with binary relevance $rel_i\in\{0,1\}$, precision@k and recall@k are</p>
    <div class="formula-box">$$P@k=\frac{1}{k}\sum_{i=1}^{k}rel_i,\qquad R@k=\frac{\sum_{i=1}^{k}rel_i}{\sum_{i=1}^{n}rel_i}$$</div>
    <p>Discounted cumulative gain is $DCG@k=\sum_{i=1}^{k}(2^{rel_i}-1)/\log_2(i+1)$, and $nDCG@k=DCG@k/IDCG@k$.</p>
    <p><b>Evaluate one ranked list.</b> Let relevance be $[1,0,1,1,0]$, with three relevant documents total.</p>
    <ol class="work">
      <li>$P@3=(1+0+1)/3=0.667$.</li>
      <li>$R@3=(1+0+1)/3=0.667$.</li>
      <li>$P@5=(1+0+1+1+0)/5=0.600$, while $R@5=3/3=1.000$.</li>
    </ol>
    <p>The top three are cleaner than the top five, but the top five recover everything.</p>
    <p><b>Compute nDCG@5.</b></p>
    <ol class="work">
      <li>$DCG=1/\log_2 2+0/\log_2 3+1/\log_2 4+1/\log_2 5+0/\log_2 6=1.931$.</li>
      <li>The ideal order is $[1,1,1,0,0]$, so $IDCG=1/\log_2 2+1/\log_2 3+1/\log_2 4=2.131$.</li>
      <li>$nDCG=1.931/2.131=0.906$.</li>
    </ol>
    <p>The score is high because all relevant documents appear in the top four, but not perfect because one relevant document was delayed behind a nonrelevant one.</p>
    <p><b>Compute average precision.</b> Average precision averages precision at the ranks where a relevant document appears.</p>
    <ol class="work">
      <li>At rank 1, precision is $1/1=1.000$.</li>
      <li>At rank 3, precision is $2/3=0.667$.</li>
      <li>At rank 4, precision is $3/4=0.750$.</li>
      <li>$AP=(1.000+0.667+0.750)/3=0.806$.</li>
    </ol>
    <p>Average precision rewards systems that place each new relevant document as early as possible.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Choosing a cutoff unrelated to the product.</b> $P@3$ measures a different user experience from $P@50$; the denominator $k$ must match what is shown or consumed.</li>
      <li><b>Optimizing precision while ignoring recall.</b> A very small candidate set can look clean but miss most relevant documents, as the $R@k$ denominator reveals.</li>
      <li><b>Using nDCG with incomplete judgments blindly.</b> If unjudged documents are treated as zero, $DCG$ may punish good results that were never labeled.</li>
      <li><b>Averaging queries without looking at slices.</b> Mean metrics can hide failures on rare query types, exact-id queries, or long-tail language.</li>
    </ul>`
};
