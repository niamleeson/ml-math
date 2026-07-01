/* All ML — Part 16 applications (5 each). Loaded after content-part-16.js, before all-ml-register.js. */

/* ---- _apps-part16-A.js ---- */
(window.ALLML_CONTENT["16.1"] = window.ALLML_CONTENT["16.1"] || {}).applications = [
  {
    title: "Site search facets",
    background: "<p>Faceted site search first narrows a corpus with exact keyword candidates before ranking or filtering. Inverted indexes make this cheap because the engine jumps to stored postings instead of scanning every page.</p>",
    numbers: "<p>On the lesson corpus, $P(\text{search})=\{1,2,4\}$, so a search facet starts with 3 candidates out of $N=4$ documents.</p>"
  },
  {
    title: "Legal eDiscovery Boolean review",
    background: "<p>Legal review teams often use Boolean queries to define an auditable document set. The value is exact reproducibility: the same postings lists produce the same review population.</p>",
    numbers: "<p>The query <code>neural AND search</code> gives $\{1,3\}\cap\{1,2,4\}=\{1\}$, reducing the review set to 1 document.</p>"
  },
  {
    title: "Code and documentation search",
    background: "<p>Developer search frequently combines related terms when exact vocabulary differs across comments, docs, and source files. OR queries broaden recall while staying transparent.</p>",
    numbers: "<p><code>graph OR retrieval</code> gives $\{2,4\}\cup\{3,4\}=\{2,3,4\}$, so 3 of 4 lesson documents match.</p>"
  },
  {
    title: "Security-log exclusion filters",
    background: "<p>Investigators often exclude known noisy categories after collecting a universe of candidate events. NOT is set difference, which is powerful but can be large.</p>",
    numbers: "<p><code>NOT neural</code> gives $\{1,2,3,4\}\setminus\{1,3\}=\{2,4\}$, leaving 2 surviving documents.</p>"
  },
  {
    title: "Case-normalized support search",
    background: "<p>Support search systems normalize case and punctuation so equivalent user wording lands on the same index key. Without that step, evidence fragments across postings lists.</p>",
    numbers: "<p>The lesson has 3 pieces of <code>search</code> evidence in $P(\text{search})=\{1,2,4\}$; splitting <code>Search</code> from <code>search</code> can make each postings list smaller and lower recall.</p>"
  }
];

(window.ALLML_CONTENT["16.2"] = window.ALLML_CONTENT["16.2"] || {}).applications = [
  {
    title: "Enterprise keyword search",
    background: "<p>Enterprise search rewards rare terms because they discriminate between otherwise similar documents. BM25 turns document frequency into a stable logarithmic weight.</p>",
    numbers: "<p>In the lesson, $idf(\text{neural})=0.693$ and $idf(\text{search})=0.357$, so the rare term receives about $0.693/0.357=1.94\times$ the weight.</p>"
  },
  {
    title: "Anti-keyword-stuffing ranking",
    background: "<p>Search engines should reward repeated evidence but not let spammy repetition dominate. BM25 uses a saturating term-frequency multiplier.</p>",
    numbers: "<p>For an average-length document, the lesson multipliers are $1.000$, $1.375$, and $1.774$ for $tf=1,2,5$; five repeats are not $5\times$ one repeat.</p>"
  },
  {
    title: "Help-center search",
    background: "<p>Help-center retrieval often starts with sparse ranking because exact product and error words matter. BM25 combines exact overlap with rarity and length normalization.</p>",
    numbers: "<p>For query <code>neural search</code>, lesson document $d_1$ scores $0.490+0.693=1.184$, ranking first.</p>"
  },
  {
    title: "Legal document retrieval",
    background: "<p>In legal corpora, a rare term can be more valuable than several common words. BM25 captures this by weighting the rare term before summing contributions.</p>",
    numbers: "<p>The one-rare-term document $d_3$ scores $0.693$, beating the common-term-only $d_4$ score of $0.448$.</p>"
  },
  {
    title: "Long-document normalization",
    background: "<p>Long documents have more chances to contain accidental matches. BM25 corrects by comparing each document length to the corpus average.</p>",
    numbers: "<p>The lesson lengths are $3,2,3,4$, so $avgdl=(3+2+3+4)/4=3.000$; the length-4 document receives a larger denominator.</p>"
  }
];

(window.ALLML_CONTENT["16.3"] = window.ALLML_CONTENT["16.3"] || {}).applications = [
  {
    title: "Knowledge-base search",
    background: "<p>Knowledge-base search often needs interpretable sparse features. TF-IDF keeps vocabulary coordinates visible while reducing the impact of common terms.</p>",
    numbers: "<p>With smoothed $idf_j=\log((N+1)/(df_j+1))+1$, the lesson gives $idf(\text{neural})=1.511$ and $idf(\text{search})=1.223$.</p>"
  },
  {
    title: "Document similarity search",
    background: "<p>Vector-space retrieval compares direction rather than raw length. Query and document vectors can be ranked by cosine similarity.</p>",
    numbers: "<p>For query <code>neural search</code>, the weighted vector norm is $\sqrt{1.511^2+1.223^2}=1.944$.</p>"
  },
  {
    title: "Duplicate and near-duplicate detection",
    background: "<p>Near-duplicate systems look for documents pointing in almost the same sparse direction. Exact matches produce the maximum cosine before count effects change the angle.</p>",
    numbers: "<p>The exact query/document direction has cosine $1.000$; when $d_1$ repeats <code>search</code>, its cosine becomes $0.944$.</p>"
  },
  {
    title: "Long-document correction",
    background: "<p>Cosine normalization prevents large term counts from acting like pure document quality. Repetition can tilt a vector rather than simply increasing its score.</p>",
    numbers: "<p>The lesson repeated-count vector for $d_1$ ranks at cosine $0.944$, showing angle normalization rather than raw size.</p>"
  },
  {
    title: "Sparse search result ranking",
    background: "<p>TF-IDF ranking is a strong transparent baseline before dense or hybrid systems are added. The ranked slate can be inspected term by term.</p>",
    numbers: "<p>The lesson cosines rank $d_1=0.944\gt d_3=0.550\gt d_4=0.474\gt d_2=0.396$.</p>"
  }
];

(window.ALLML_CONTENT["16.4"] = window.ALLML_CONTENT["16.4"] || {}).applications = [
  {
    title: "Semantic enterprise search",
    background: "<p>Dense retrieval represents meaning with learned coordinates, so semantically close documents can be retrieved even without exact lexical overlap.</p>",
    numbers: "<p>For $q=[0.9,0.1]$ and $z_1=[1,0]$, the lesson cosine is $0.9/(0.906\cdot1)=0.994$.</p>"
  },
  {
    title: "FAQ synonym retrieval",
    background: "<p>FAQ systems benefit when paraphrases and synonyms land near the same query vector. Dense retrieval can return a semantic neighbor nearly tied with an exact-looking item.</p>",
    numbers: "<p>For $z_2=[0.8,0.2]$, the score is $(0.9\cdot0.8+0.1\cdot0.2)/(0.906\cdot0.825)=0.991$.</p>"
  },
  {
    title: "Mismatch rejection",
    background: "<p>Dense scores still separate directions when the embedding geometry is well behaved. Orthogonal concepts should receive low similarity.</p>",
    numbers: "<p>The orthogonal lesson vector $z_3=[0,1]$ scores $0.1/(0.906\cdot1)=0.110$, far below the aligned neighbors.</p>"
  },
  {
    title: "Safety and constraint filtering",
    background: "<p>Semantic similarity is not a substitute for constraints, but low or negative cosine can still help reject off-direction candidates before filters are applied.</p>",
    numbers: "<p>For $z_4=[-0.2,0.9]$, the numerator is $-0.18+0.09=-0.09$, giving cosine $-0.108$.</p>"
  },
  {
    title: "Vector database serving",
    background: "<p>Exact dense retrieval compares every stored vector to the query. At production scale, that per-query scan motivates approximate nearest-neighbor indexes.</p>",
    numbers: "<p>An exact scan costs $O(Nd)$ per query; for illustrative $N=1{,}000{,}000$ and $d=768$, that is $768{,}000{,}000$ coordinate operations.</p>"
  }
];

/* ---- _apps-part16-B.js ---- */
(window.ALLML_CONTENT["16.5"] = window.ALLML_CONTENT["16.5"] || {}).applications = [
  { title: "Vector database search", background: "<p>ANN indexes make dense retrieval practical by searching a candidate set before exact distance scoring.</p>", numbers: "<p>For $q=[3.1,3.0]$, the exact nearest lesson point is $[3,3]$ because $\sqrt{(3-3.1)^2+(3-3.0)^2}=0.100$.</p>" },
  { title: "Image and product similarity", background: "<p>Product, image, and asset search systems often need several near neighbors, not only the closest one.</p>", numbers: "<p>The lesson second neighbor $[3.2,3.1]$ has distance $\sqrt{0.1^2+0.1^2}=0.141$, so it is close enough to test recall@2.</p>" },
  { title: "Candidate pruning", background: "<p>IVF-style partitions replace a full scan with a coarse centroid lookup plus a short local scan.</p>", numbers: "<p>The point $[4,3]$ is distance $0.900$, while far-cluster distances include $4.314$, $3.662$, and $3.689$, so the coarse list can prune many comparisons.</p>" },
  { title: "ANN recall monitoring", background: "<p>Fast serving is useful only if the candidate set still contains the true nearest neighbor.</p>", numbers: "<p>If $C(q)=\{[3,3],[3.2,3.1],[4,3]\}$, ANN returns $[3,3]$ and recall@1 is $1$; if $C(q)=\{[4,3]\}$, recall@1 is $0$.</p>" },
  { title: "Metric consistency checks", background: "<p>Teams audit whether the index distance matches the embedding normalization used by the retriever.</p>", numbers: "<p>Euclidean and cosine order can change without normalization; the illustrative guard is to L2-normalize before comparing cosine-like vectors.</p>" }
];

(window.ALLML_CONTENT["16.6"] = window.ALLML_CONTENT["16.6"] || {}).applications = [
  { title: "Production web and app search", background: "<p>Hybrid retrieval keeps lexical evidence for exact terms while admitting semantic candidates.</p>", numbers: "<p>With $\alpha=0.5$, lesson document $d_1$ has $0.5\cdot0.80+0.5\cdot0.10=0.450$.</p>" },
  { title: "Semantic FAQ retrieval", background: "<p>Dense retrieval helps when the answer is relevant even though query words do not overlap strongly.</p>", numbers: "<p>Lesson $d_2$ rises to $0.5\cdot0.20+0.5\cdot0.90=0.550$, so dense evidence gets the FAQ into the shortlist.</p>" },
  { title: "Balanced candidate generation", background: "<p>Fusion can preserve documents with both moderate sparse and moderate dense evidence.</p>", numbers: "<p>Lesson $d_3$ also scores $0.5\cdot0.60+0.5\cdot0.50=0.550$, tying $d_2$ before reranking.</p>" },
  { title: "Low-evidence filtering", background: "<p>Documents weak on both channels should fall behind before expensive reranking.</p>", numbers: "<p>Lesson $d_4$ scores $0.5\cdot0.10+0.5\cdot0.30=0.200$, below the $0.450$ to $0.550$ candidate band.</p>" },
  { title: "Query-adaptive weighting", background: "<p>Exact-code queries can raise sparse weight, while vague natural-language queries may raise dense weight.</p>", numbers: "<p>Using the lesson values illustratively, increasing sparse weight to $\alpha=0.8$ would give $d_1=0.8\cdot0.80+0.2\cdot0.10=0.660$.</p>" }
];

(window.ALLML_CONTENT["16.7"] = window.ALLML_CONTENT["16.7"] || {}).applications = [
  { title: "First-stage semantic retrieval", background: "<p>Bi-encoders precompute document vectors so a query can cheaply compare against many documents.</p>", numbers: "<p>The lesson bi-encoder cosines rank $d_1=0.994 \gt d_2=0.707 \gt d_3=0.000$.</p>" },
  { title: "Search re-ranking", background: "<p>Cross-encoders read the query and document together, so they can revise the shortlist order.</p>", numbers: "<p>Lesson cross scores $[0.62,0.88,0.10]$ flip the top order to $d_2 \gt d_1 \gt d_3$.</p>" },
  { title: "Large-corpus serving", background: "<p>Bi-encoder retrieval is attractive when the corpus is too large for pairwise model passes.</p>", numbers: "<p>With $N=1{,}000{,}000$ and $d=2$, the query compares $N\cdot d=2{,}000{,}000$ coordinates after document precompute.</p>" },
  { title: "Shortlist scoring", background: "<p>Rerankers spend expensive pairwise compute only on candidates admitted by the first stage.</p>", numbers: "<p>Scoring only the top 100 requires 100 cross-encoder passes instead of $1{,}000{,}000$ passes.</p>" },
  { title: "Latency-quality tradeoff", background: "<p>Teams tune the cutoff by measuring whether quality gains justify the extra cross-encoder latency.</p>", numbers: "<p>The lesson shortlist cuts cross-encoder passes by $1{,}000{,}000/100=10{,}000\times$.</p>" }
];

(window.ALLML_CONTENT["16.8"] = window.ALLML_CONTENT["16.8"] || {}).applications = [
  { title: "Search UI quality at top 3", background: "<p>Precision at the visible cutoff measures how clean the first screen of results is.</p>", numbers: "<p>For relevance $[1,0,1,1,0]$, $P@3=(1+0+1)/3=0.667$.</p>" },
  { title: "Candidate completeness", background: "<p>Recall asks whether the retriever admitted the relevant items, not just whether the top slots look clean.</p>", numbers: "<p>The same list has three relevant documents total, so $R@3=(1+0+1)/3=0.667$.</p>" },
  { title: "Full-list recall auditing", background: "<p>Auditing a larger cutoff can reveal that a system recovers everything but ranks some results late.</p>", numbers: "<p>At top 5, $P@5=(1+0+1+1+0)/5=0.600$ while $R@5=3/3=1.000$.</p>" },
  { title: "Rank-sensitive evaluation", background: "<p>nDCG discounts late relevance, so it rewards ranking relevant documents earlier.</p>", numbers: "<p>Lesson $DCG@5=1.931$ and $IDCG@5=2.131$, so $nDCG@5=1.931/2.131=0.906$.</p>" },
  { title: "Mean average precision reporting", background: "<p>Average precision summarizes precision at each rank where a new relevant document appears.</p>", numbers: "<p>Relevant ranks 1, 3, and 4 give $AP=(1.000+0.667+0.750)/3=0.806$.</p>" }
];

