/* =====================================================================
   AFP-AI Learning Guide — Domain 2 · Retrieval & Representation (M11–M14)
   ---------------------------------------------------------------------
   Authored source for the AFP-AI track. One object per module.
   Read by tools/gen-afp.js and tools/gen-afp-notebooks.js.
   ===================================================================== */
"use strict";

const M11 = {
  m: 11, domain: 2,
  title: "Embeddings & representation learning",
  tagline: "Turn messy people, text, and ads into vectors whose geometry can be searched, measured, and learned.",
  skipIf: "explain what an embedding space encodes and how you'd evaluate it.",
  mapsTo: ["all"],
  connections: {
    buildsOn: ["vectors and dot products", "supervised learning", "matrix factorization intuition"],
    leadsTo: ["Two-tower / EBR (embedding-based retrieval) retrieval architecture", "ANN (approximate nearest neighbor) / vector search & indexing", "Encoders & contrastive training"],
    usedWith: ["cosine similarity", "normalization", "retrieval recall", "downstream evaluation"]
  },
  motivation:
    "<p>You already compare things by hand: two creator profiles feel similar because they mention B2B SaaS, executive audiences, and short-form video; two ads feel different because one sells hiring software and the other promotes an event. The machine needs the same instinct, but in a form it can rank a million times per second.</p>" +
    "<p>An <b>embedding</b> is that bridge. It maps a query, creator, ad, event, or piece of creative into a dense vector, then lets geometry carry meaning. Near vectors should be semantically close; far vectors should disagree. In Creator Marketplace AI, this is what turns a plain-language brief into a candidate set of creators before any expensive reranker reads the details.</p>",
  definition:
    "<p><b>Definition.</b> An embedding model is a function $g_\\theta$ that maps an object $x$ into a dense vector $z=g_\\theta(x)\\in\\mathbb{R}^d$. Similarity is usually measured by a dot product $z_q^\\top z_i$ or, after normalization, cosine similarity:</p>" +
    "<p>$$\\operatorname{cos}(q,i)=\\frac{z_q^\\top z_i}{\|z_q\|_2\|z_i\|_2}.$$</p>" +
    "<p>The coordinates rarely have hand-written names. Instead, the training signal shapes them: skip-gram predicts nearby words, matrix factorization reconstructs co-occurrence, and encoders learn from labeled or contrastive pairs. A good embedding space is useful because neighbors are meaningful, not because each dimension is individually interpretable.</p>",
  symbols: [
    { sym: "$x$", desc: "the raw object: a query, creator profile, ad, event, or text snippet." },
    { sym: "$g_\\theta$", desc: "the representation model with learned parameters $\\theta$." },
    { sym: "$z\\in\\mathbb{R}^d$", desc: "the dense embedding vector with $d$ learned coordinates." },
    { sym: "$z_q^\\top z_i$", desc: "dot-product similarity between a query vector and an item vector." },
    { sym: "$\|z\|_2$", desc: "Euclidean length, used to normalize vectors before cosine similarity." }
  ],
  derivation: [
    { do: "Start with dot similarity", result: "$s=z_q^\\top z_i$", why: "large aligned coordinates raise the score" },
    { do: "Notice length sensitivity", result: "$2z_i$ doubles the dot score", why: "dot product mixes direction with vector magnitude" },
    { do: "Normalize each vector", result: "$\\hat z=z/\|z\|_2$", why: "all vectors now live on the unit sphere" },
    { do: "Take the normalized dot product", result: "$\\hat z_q^\\top\\hat z_i=\\frac{z_q^\\top z_i}{\|z_q\|_2\|z_i\|_2}$", why: "the score now measures angle, so scale no longer dominates" }
  ],
  worked: {
    problem: "A Creator Marketplace query has embedding $q=[1,2,0]$. Creator A has $a=[2,4,0]$ and Creator B has $b=[2,0,2]$. Compute dot and cosine similarity, then decide why normalization matters.",
    skills: ["dot product", "L2 norm", "cosine similarity"],
    strategy: "Compute the raw dot first, then divide by lengths so direction is separated from magnitude.",
    steps: [
      { do: "Compute the dot for A", result: "$q^\\top a=1\\cdot2+2\\cdot4+0\\cdot0=10$", why: "A points in the same coordinate pattern as the query" },
      { do: "Compute the dot for B", result: "$q^\\top b=1\\cdot2+2\\cdot0+0\\cdot2=2$", why: "only one coordinate overlaps strongly" },
      { do: "Compute the query norm", result: "$\|q\|_2=\\sqrt{1^2+2^2}=\\sqrt5$", why: "cosine divides out length" },
      { do: "Compute A's norm", result: "$\|a\|_2=\\sqrt{2^2+4^2}=2\\sqrt5$", why: "A is exactly twice the query" },
      { do: "Compute cosine for A", result: "$\\frac{10}{\\sqrt5\\cdot2\\sqrt5}=1.00$", why: "same direction means maximum cosine" },
      { do: "Compute cosine for B", result: "$\\frac{2}{\\sqrt5\\cdot\\sqrt8}\\approx0.316$", why: "B has extra mass in a direction the query does not ask for" }
    ],
    verify: "If A were scaled to $[20,40,0]$, its dot score would grow to 100 but its cosine would remain 1.00, so cosine protects retrieval from pure popularity or text-length scale.",
    answer: "A is the better semantic match; cosine reveals it is identical in direction to the query while B is only weakly aligned.",
    connects: "embedding quality is geometry quality — normalization decides whether direction or magnitude drives nearest neighbors."
  },
  practice: [
    {
      problem: "Compute cosine similarity for $u=[3,0,4]$ and $v=[0,4,3]$.",
      steps: [
        { do: "Compute the dot product", result: "$u^\\top v=3\\cdot0+0\\cdot4+4\\cdot3=12$", why: "only the third coordinate overlaps" },
        { do: "Compute the first norm", result: "$\|u\|_2=\\sqrt{3^2+4^2}=5$", why: "cosine needs vector length" },
        { do: "Compute the second norm", result: "$\|v\|_2=\\sqrt{4^2+3^2}=5$", why: "both vectors have the same length" },
        { do: "Divide by both norms", result: "$\\operatorname{cos}=12/(5\\cdot5)=0.48$", why: "the normalized score is angle-based" }
      ],
      answer: "The cosine similarity is $0.48$."
    },
    {
      problem: "A retrieval set has 8 relevant creators. Your top 10 returns 5 of them. What is recall@10 (recall at 10)?",
      steps: [
        { do: "Name the numerator", result: "retrieved relevant creators $=5$", why: "recall counts relevant items found" },
        { do: "Name the denominator", result: "all relevant creators $=8$", why: "the denominator is the complete labeled relevant set" },
        { do: "Divide", result: "$\\operatorname{recall@10}=5/8=0.625$", why: "recall is a fraction of relevant items recovered" }
      ],
      answer: "Recall@10 is $0.625$, or 62.5%."
    },
    {
      problem: "A query vector is $[6,8]$. Normalize it to unit length.",
      steps: [
        { do: "Compute the norm", result: "$\\sqrt{6^2+8^2}=10$", why: "unit normalization divides by length" },
        { do: "Divide the first coordinate", result: "$6/10=0.6$", why: "each coordinate is scaled equally" },
        { do: "Divide the second coordinate", result: "$8/10=0.8$", why: "the vector direction stays the same" }
      ],
      answer: "The normalized vector is $[0.6,0.8]$."
    },
    {
      problem: "A tiny embedding evaluator has 50 labeled query-item positives. Top-5 retrieval finds 35 of them at least once. What does the score say?",
      steps: [
        { do: "Set the denominator", result: "50 positives", why: "each labeled positive is a target the index should recover" },
        { do: "Set the numerator", result: "35 recovered positives", why: "only recovered positives count toward recall" },
        { do: "Compute the rate", result: "$35/50=0.70$", why: "retrieval recall is recovered divided by total" }
      ],
      answer: "Top-5 recall is 70%; 30% of known matches are still being missed."
    },
    {
      problem: "A two-dimensional embedding has creator $c=[0.8,0.6]$ and a query $q=[0.8,-0.6]$. Both are unit length. Compute cosine and interpret the sign.",
      steps: [
        { do: "Use the unit-vector shortcut", result: "$\\operatorname{cos}=q^\\top c$", why: "both norms are already 1" },
        { do: "Multiply coordinates", result: "$0.8\\cdot0.8+(-0.6)\\cdot0.6=0.64-0.36$", why: "aligned and opposing dimensions cancel" },
        { do: "Simplify", result: "$0.28$", why: "positive but small means weak alignment" }
      ],
      answer: "Cosine is $0.28$; the creator is somewhat related but one learned dimension points against the query."
    }
  ],
  applications: [
    { title: "Creator Marketplace AI semantic creator search", background: "A brand brief such as 'B2B cybersecurity founder with executive audience' must retrieve creators even when their profile never uses the exact words in the brief. Embeddings let the query and creator profile meet in one semantic space before a reranker reads richer features.", numbers: "If 120 creators are labeled relevant and top-50 retrieval finds 72, recall@50 is $72/120=0.60$. Raising that to 84 relevant creators gives $84/120=0.70$, a 10-point recall lift before ranking." },
    { title: "Search Ads query-ad matching", background: "Search Ads needs query understanding beyond exact keyword matches. A query vector for 'project management software' can sit near ads for collaboration platforms even when the ad text says 'team workflow'.", numbers: "A unit query with dot scores 0.81, 0.74, and 0.31 against three ad embeddings would rank the first two as semantic candidates; a cosine threshold of 0.70 keeps 2 of 3." },
    { title: "Creative Intelligence asset clustering", background: "Creative Intelligence can cluster ad images or copy so marketers see repeated concepts instead of a long flat list. The embedding decides whether two pieces are variations on one idea.", numbers: "Ten assets averaging pairwise cosine 0.86 inside a cluster and 0.22 to the next cluster have a separation margin of $0.86-0.22=0.64$, enough to treat them as one theme." },
    { title: "Instream Ads video-topic retrieval", background: "Video embeddings can retrieve safe, relevant organic videos for ad placement without relying only on category labels. The learned space captures transcript, visual, and engagement signals together.", numbers: "If a campaign needs 5,000 candidate videos and exact topic labels cover only 3,200, embedding retrieval that adds 1,100 approved near-neighbors increases supply to 4,300, a $1,100/3,200=34.4\%$ expansion." },
    { title: "Event Ads audience similarity", background: "Events often have sparse attendance labels. Embedding the event description and likely audience makes a cold-start event comparable to past events with known attendance patterns.", numbers: "A new AI webinar has cosine 0.92 to a past AI webinar with 8% attend rate and 0.41 to a sales meetup with 3% attend rate; nearest-neighbor smoothing would weight the 8% history much more heavily." },
    { title: "Palette pCTR feature compression", background: "High-cardinality member and advertiser features can be embedded before entering a click model. The downstream pCTR (predicted click-through rate) model gets dense coordinates instead of millions of sparse IDs.", numbers: "Replacing 1,000,000 sparse advertiser IDs with 64-dimensional embeddings changes the active input from a million-column one-hot space to 64 numbers per advertiser, while keeping $64/1{,}000{,}000=0.0064\%$ as many coordinates." }
  ],
  applicationsClose:
    "<p>Embeddings are the shared language of retrieval. The same geometry that finds creators for a brand brief can cluster creatives, expand video supply, and compress IDs for pCTR. Once you can ask whether neighbors are meaningful, you can improve nearly every AFP-AI project that starts with candidate generation.</p>",
  takeaways: [
    "An embedding maps raw objects into dense vectors where nearby should mean semantically related.",
    "Dot product is scale-sensitive; cosine similarity compares direction after L2 normalization.",
    "Evaluate embedding spaces with retrieval recall, alignment/uniformity, and downstream task lift rather than visual intuition alone.",
    "Dimensions are learned factors, not guaranteed human-readable labels."
  ],
  resources: [
    { label: "Google — Embeddings module (MLCC)", note: "what latent dimensions capture" },
    { label: "Jay Alammar — illustrated embeddings/word2vec", note: "visual intuition" }
  ],
  papers: [
    "Efficient Estimation of Word Representations / word2vec (Mikolov et al., 2013)",
    "E5 Text Embeddings (Wang et al., 2022)",
    "Sentence-BERT (Reimers & Gurevych, 2019)"
  ],
  notebook: [
    { t: "md", src: "# M11 · Embeddings & representation learning\n\n_Curriculum · Domain 2 · Retrieval & Representation_\n\n**Turn messy people, text, and ads into vectors whose geometry can be searched.**\n\nWe will build tiny creator and query embeddings, compare dot product with cosine similarity, and measure retrieval recall. The key formula is $\\operatorname{cos}(q,i)=\\frac{q^\\top i}{\|q\|\|i\|}$." },
    { t: "code", src: "import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\nrng = np.random.default_rng(11)" },
    { t: "md", src: "## A tiny semantic space\n\nEach creator has four hand-built signals. In production those coordinates are learned, but this toy space lets us inspect the geometry." },
    { t: "code", src: "names = np.array([\"ai founder\", \"career coach\", \"b2b security\", \"food creator\", \"cloud architect\", \"event host\"])\nemb = np.array([\n    [0.90, 0.70, 0.80, 0.10],\n    [0.30, 0.85, 0.25, 0.20],\n    [0.85, 0.40, 0.95, 0.05],\n    [0.05, 0.20, 0.05, 0.95],\n    [0.80, 0.35, 0.75, 0.10],\n    [0.35, 0.90, 0.30, 0.30],\n])\nquery = np.array([0.88, 0.50, 0.90, 0.05])\n\nprint(pd.DataFrame(emb, index=names, columns=[\"ai\", \"audience\", \"security\", \"lifestyle\"]))" },
    { t: "md", src: "## Dot product can reward magnitude\n\nDot product is useful, but it mixes semantic alignment with vector length. Cosine focuses on direction." },
    { t: "code", src: "dot_scores = emb @ query\nemb_norm = emb / np.linalg.norm(emb, axis=1, keepdims=True)\nquery_norm = query / np.linalg.norm(query)\ncos_scores = emb_norm @ query_norm\n\nranking = pd.DataFrame({\n    \"creator\": names,\n    \"dot\": dot_scores,\n    \"cosine\": cos_scores,\n})\nranking = ranking.sort_values(\"cosine\", ascending=False)\n\nprint(ranking.round(3))" },
    { t: "md", src: "## Step 1 - Normalize and verify\n\nAfter L2 normalization, every vector should have length $1$. This is the habit that makes cosine retrieval stable." },
    { t: "code", src: "lengths = np.linalg.norm(emb_norm, axis=1)\nquery_length = np.linalg.norm(query_norm)\n\nprint(lengths.round(3))\nprint(round(query_length, 3))\n\nassert np.allclose(lengths, 1.0)\nassert np.isclose(query_length, 1.0)" },
    { t: "md", src: "## Step 2 - Compute recall@k\n\nSuppose human judges say three creators are relevant to this brief: AI founder, B2B security, and cloud architect." },
    { t: "code", src: "relevant = {\"ai founder\", \"b2b security\", \"cloud architect\"}\ntop3 = ranking.head(3)[\"creator\"].tolist()\nhits = sum(name in relevant for name in top3)\nrecall_at_3 = hits / len(relevant)\n\nprint(\"top3:\", top3)\nprint(\"recall@3:\", recall_at_3)\n\nassert recall_at_3 >= 2 / 3" },
    { t: "md", src: "## Visualize the scores\n\nA bar chart makes it easy to see which creators the query pulls forward." },
    { t: "code", src: "plot_df = ranking.sort_values(\"cosine\")\n\nfig, ax = plt.subplots(figsize=(6, 3))\nax.barh(plot_df[\"creator\"], plot_df[\"cosine\"], color=\"#4c78a8\")\nax.set_xlabel(\"cosine similarity\")\nax.set_title(\"Creator Marketplace semantic retrieval\")\nplt.show()" },
    { t: "md", src: "## Practice\n\nTry changing the query toward career coaching or food content. Watch how the nearest creators change, then recompute recall with a new relevant set." },
    { t: "code", src: "# Your turn:\n" }
  ]
};

const M12 = {
  m: 12, domain: 2,
  title: "Two-tower / EBR retrieval architecture (+ serving)",
  tagline: "Train query and item towers into one space, then serve fast by precomputing the item side.",
  skipIf: "build a two-tower retrieval model and reason about the negatives.",
  mapsTo: ["Creator Marketplace AI", "Search Ads"],
  connections: {
    buildsOn: ["embeddings", "softmax classification", "negative sampling"],
    leadsTo: ["ANN (approximate nearest neighbor) / vector search & indexing", "hard-negative mining", "retrieval evaluation at scale"],
    usedWith: ["in-batch negatives", "sampling-bias correction", "recall@k (recall at k)", "offline-online serving parity"]
  },
  motivation:
    "<p>A retrieval system cannot run a large cross-feature model over every possible creator or ad for every request. Creator Marketplace AI might need to search millions of creators for one brand brief, and Search Ads may need candidates while the member is still typing.</p>" +
    "<p>A <b>two-tower</b> model solves the serving problem by doing expensive item work ahead of time. One tower embeds the query; another tower embeds the item; a dot product joins them. At serving time the system computes one query vector, looks up precomputed item vectors, and gets a broad candidate set fast enough for a reranker to refine.</p>",
  definition:
    "<p><b>Definition.</b> A two-tower retrieval model learns a query encoder $f_\\theta(q)$ and an item encoder $h_\\phi(i)$ in the same $d$-dimensional space. The retrieval score is</p>" +
    "<p>$$s(q,i)=f_\\theta(q)^\\top h_\\phi(i).$$</p>" +
    "<p>For a batch of matched pairs $(q_b,i_b)$, in-batch softmax treats the other items in the batch as negatives:</p>" +
    "<p>$$\\ell_b=-\\log\\frac{\\exp(s_{bb})}{\\sum_j \\exp(s_{bj})}.$$</p>" +
    "<p>If items are sampled from a non-uniform distribution $Q(i)$, a common correction subtracts $\\log Q(i)$ from sampled logits so frequent items are not rewarded merely for appearing often.</p>",
  symbols: [
    { sym: "$q$", desc: "a query object, such as a brand brief or search query." },
    { sym: "$i$", desc: "an item object, such as a creator, ad, or document." },
    { sym: "$f_\\theta(q)$", desc: "the query-tower embedding." },
    { sym: "$h_\\phi(i)$", desc: "the item-tower embedding, often precomputed for serving." },
    { sym: "$Q(i)$", desc: "the sampling probability for an item under the training sampler." },
    { sym: "$\\operatorname{recall@k}$", desc: "fraction of labeled relevant items recovered among the top $k$ candidates." }
  ],
  derivation: [
    { do: "Score every item in a batch", result: "$s_{bj}=f_\\theta(q_b)^\\top h_\\phi(i_j)$", why: "each query compares with its positive and with other batch items" },
    { do: "Convert scores to probabilities", result: "$p_{bb}=\\frac{\\exp(s_{bb})}{\\sum_j\\exp(s_{bj})}$", why: "softmax asks the positive item to beat sampled negatives" },
    { do: "Take negative log probability", result: "$\\ell_b=-\\log p_{bb}$", why: "the loss is small only when the positive gets most probability mass" },
    { do: "Correct sampled logits", result: "$s'_{bj}=s_{bj}-\\log Q(i_j)$", why: "frequent sampled items should not be over-penalized as if they represented the whole catalog uniformly" }
  ],
  worked: {
    problem: "For one Creator Marketplace query, logits against three batch creators are $[3.0,1.0,0.0]$, where the first is positive. The sampler probabilities are $Q=[0.50,0.25,0.25]$. Compute the in-batch softmax loss before and after subtracting $\\log Q$.",
    skills: ["softmax", "cross-entropy", "sampling correction"],
    strategy: "Turn logits into positive probability, then repeat after the logQ correction changes each logit.",
    steps: [
      { do: "Exponentiate the uncorrected logits", result: "$[e^3,e^1,e^0]\\approx[20.09,2.72,1.00]$", why: "softmax works in exponentiated score space" },
      { do: "Sum the exponentials", result: "$20.09+2.72+1.00=23.81$", why: "this is the softmax denominator" },
      { do: "Compute positive probability", result: "$20.09/23.81\\approx0.844$", why: "the positive item receives most mass" },
      { do: "Compute uncorrected loss", result: "$-\\log(0.844)\\approx0.170$", why: "high positive probability means low loss" },
      { do: "Subtract logQ", result: "$[3-\\log0.50,1-\\log0.25,0-\\log0.25]\\approx[3.693,2.386,1.386]$", why: "less-frequent sampled negatives are adjusted upward" },
      { do: "Softmax the corrected logits", result: "$p_+=e^{3.693}/(e^{3.693}+e^{2.386}+e^{1.386})\\approx0.705$", why: "the correction makes the comparison harder" },
      { do: "Compute corrected loss", result: "$-\\log(0.705)\\approx0.350$", why: "harder corrected negatives raise the training signal" }
    ],
    verify: "The positive still wins after correction, but the loss grows from about 0.17 to 0.35, so the model receives a stronger push to separate it.",
    answer: "Uncorrected loss is about 0.170; logQ-corrected loss is about 0.350.",
    connects: "two-tower training is classification over sampled candidates, while serving is nearest-neighbor search over precomputed item embeddings."
  },
  practice: [
    {
      problem: "A query has logits $[2,0]$ against its positive and one negative. Compute the two-item softmax probability for the positive.",
      steps: [
        { do: "Exponentiate the positive logit", result: "$e^2\\approx7.389$", why: "softmax uses exponential scores" },
        { do: "Exponentiate the negative logit", result: "$e^0=1$", why: "the negative also enters the denominator" },
        { do: "Divide", result: "$7.389/(7.389+1)\\approx0.881$", why: "this is probability assigned to the positive" }
      ],
      answer: "The positive probability is about $0.881$."
    },
    {
      problem: "Using the previous probability $0.881$, compute the retrieval loss.",
      steps: [
        { do: "Write the loss", result: "$\\ell=-\\log p_+$", why: "cross-entropy penalizes low positive probability" },
        { do: "Substitute", result: "$\\ell=-\\log(0.881)$", why: "the positive probability is the model's confidence" },
        { do: "Evaluate", result: "$\\ell\\approx0.127$", why: "a confident correct match has small loss" }
      ],
      answer: "The loss is approximately $0.127$."
    },
    {
      problem: "A batch has 64 matched pairs. For each query, how many in-batch negatives are available?",
      steps: [
        { do: "Count all item candidates", result: "64 items", why: "each query is compared with every item in the batch" },
        { do: "Remove the one positive", result: "$64-1=63$", why: "the matched item is not a negative" }
      ],
      answer: "Each query has 63 in-batch negatives."
    },
    {
      problem: "A retrieval model returns 40 candidates. Human labels say 25 relevant items exist, and 18 appear in the returned set. Compute recall@40.",
      steps: [
        { do: "Set the numerator", result: "18 relevant items retrieved", why: "only relevant hits count" },
        { do: "Set the denominator", result: "25 relevant items total", why: "recall asks how much of the relevant set was recovered" },
        { do: "Divide", result: "$18/25=0.72$", why: "recall is a fraction" }
      ],
      answer: "Recall@40 is $0.72$."
    },
    {
      problem: "An item has sampling probability $Q=0.05$ and raw logit $1.2$. What is its logQ-corrected logit?",
      steps: [
        { do: "Compute the log probability", result: "$\\log(0.05)\\approx-2.996$", why: "rare items have negative log probabilities with large magnitude" },
        { do: "Subtract logQ", result: "$1.2-(-2.996)=4.196$", why: "the correction raises logits for rare sampled items" }
      ],
      answer: "The corrected logit is about $4.196$."
    }
  ],
  applications: [
    { title: "Creator Marketplace AI first-stage retrieval", background: "The query tower reads a brand brief and the item tower reads creator profile features. Creator embeddings are computed offline, so online retrieval only embeds the brief and searches the vector index.", numbers: "If 2,000,000 creator embeddings have 128 float32 dimensions, storage is $2{,}000{,}000\\cdot128\\cdot4=1.024$ GB before index overhead, small enough for a serving index shard plan." },
    { title: "Search Ads semantic candidate generation", background: "Search Ads can retrieve ads whose landing pages and copy are semantically close to the query before a heavier relevance model checks policy, bid, and quality.", numbers: "A 64-query training batch gives $64\\cdot63=4{,}032$ query-negative comparisons from only 64 positive pairs, which is why in-batch negatives are so efficient." },
    { title: "Creative Intelligence asset-to-asset retrieval", background: "A creative brief can be the query tower input and historical creatives can be item tower inputs. This helps marketers find examples without manually tagging every template.", numbers: "If top-20 retrieval contains 14 approved examples from 30 known positives, recall@20 is $14/30=0.467$; top-100 with 24 hits reaches $24/30=0.800$." },
    { title: "Event Ads cold-start matching", background: "For a new event with no attendance history, the query tower can embed event text and organizer context while the item tower embeds member or audience segments.", numbers: "Precomputing 500,000 audience embeddings nightly avoids scoring $500{,}000$ tower passes online; the request computes 1 query vector plus ANN lookup instead." },
    { title: "Instream Ads video retrieval", background: "A campaign objective can retrieve videos with aligned transcript and topic embeddings. The two-tower stage supplies a broad safe set for policy and suitability filters.", numbers: "If suitability filters keep 70% of retrieved candidates, a target of 10,000 usable videos requires retrieving at least $10{,}000/0.70\\approx14{,}286$ candidates upstream." },
    { title: "Palette pCTR candidate features", background: "A retrieval tower can feed dense ad-member match features into the pCTR (predicted click-through rate) stack. The final model still predicts clicks, but it starts from better semantic candidates.", numbers: "A candidate generator lifting recall@100 from 0.55 to 0.70 gives the ranker $0.70/0.55\\approx1.27\\times$ as many labeled positives to choose from in the first 100 slots." }
  ],
  applicationsClose:
    "<p>The two-tower pattern separates what must be fresh from what can be prepared. Query embeddings are computed at request time; creator, ad, event, and creative embeddings are refreshed offline. That split is why dense retrieval can be both learned and fast.</p>",
  takeaways: [
    "A two-tower model learns query and item encoders whose dot product is the retrieval score.",
    "In-batch negatives make each batch a small classification problem; logQ correction handles biased item sampling.",
    "Serving depends on precomputing item embeddings and using an index, then measuring recall@k against labeled positives.",
    "Train-serving parity matters because an embedding space that is not indexed the same way will not deliver its offline recall."
  ],
  resources: [
    { label: "TensorFlow Recommenders (GitHub)", note: "two-tower retrieval reference" },
    { label: "Google Rec course — retrieval stage", note: "candidate generation with embeddings" }
  ],
  papers: [
    "Sampling-Bias-Corrected Neural Two-Tower (Yi et al., 2019)",
    "Embedding-based Retrieval in Facebook Search (Huang et al., 2020)",
    "Dense Passage Retrieval (Karpukhin et al., 2020)"
  ],
  notebook: [
    { t: "md", src: "# M12 · Two-tower / EBR (embedding-based retrieval) retrieval architecture\n\n_Curriculum · Domain 2 · Retrieval & Representation_\n\n**Train query and item towers into one space, then serve with precomputed item embeddings.**\n\nThe batch loss is $\\ell=-\\log\\frac{\\exp(s_{+})}{\\sum_j\\exp(s_j)}$, and the serving score is a dot product." },
    { t: "code", src: "import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\nrng = np.random.default_rng(12)" },
    { t: "md", src: "## Tiny batch of query and item embeddings\n\nRows are matched pairs. Every other item in the batch becomes an in-batch negative." },
    { t: "code", src: "query = np.array([\n    [1.0, 0.2, 0.1],\n    [0.1, 1.0, 0.2],\n    [0.2, 0.1, 1.0],\n    [0.8, 0.4, 0.1],\n])\nitem = np.array([\n    [0.9, 0.3, 0.1],\n    [0.0, 0.9, 0.3],\n    [0.3, 0.2, 0.9],\n    [0.7, 0.5, 0.0],\n])\n\nscores = query @ item.T\n\nprint(pd.DataFrame(scores).round(3))" },
    { t: "md", src: "## Step 1 - Softmax over each row\n\nThe diagonal is positive. The off-diagonal entries are negatives supplied by the batch." },
    { t: "code", src: "shifted = scores - scores.max(axis=1, keepdims=True)\nexp_scores = np.exp(shifted)\nprobs = exp_scores / exp_scores.sum(axis=1, keepdims=True)\npos_probs = np.diag(probs)\nloss = -np.log(pos_probs).mean()\n\nprint(\"positive probabilities:\", pos_probs.round(3))\nprint(\"mean loss:\", round(loss, 3))\n\nassert pos_probs.shape[0] == 4" },
    { t: "md", src: "## Step 2 - Apply a logQ correction\n\nIf frequent items are sampled more often, subtracting $\\log Q(i)$ changes the logits used by the sampled-softmax loss." },
    { t: "code", src: "sample_q = np.array([0.50, 0.20, 0.20, 0.10])\ncorrected_scores = scores - np.log(sample_q)[None, :]\ncorrected_shifted = corrected_scores - corrected_scores.max(axis=1, keepdims=True)\ncorrected_exp = np.exp(corrected_shifted)\ncorrected_probs = corrected_exp / corrected_exp.sum(axis=1, keepdims=True)\ncorrected_loss = -np.log(np.diag(corrected_probs)).mean()\n\nprint(\"corrected positive probabilities:\", np.diag(corrected_probs).round(3))\nprint(\"corrected loss:\", round(corrected_loss, 3))\n\nassert corrected_loss > 0" },
    { t: "md", src: "## Step 3 - Serve by searching item embeddings\n\nAt serving time, the item tower has already run. A fresh query vector is compared to cached item vectors." },
    { t: "code", src: "catalog = np.vstack([item, rng.normal(scale=0.4, size=(8, 3))])\ncreator_names = np.array([f\"creator_{i}\" for i in range(catalog.shape[0])])\nserve_query = np.array([0.85, 0.35, 0.05])\nserve_scores = catalog @ serve_query\ntop_idx = np.argsort(-serve_scores)[:5]\n\nprint(pd.DataFrame({\"creator\": creator_names[top_idx], \"score\": serve_scores[top_idx]}).round(3))\n\nassert top_idx[0] in [0, 3]" },
    { t: "md", src: "## Visualize the training score matrix\n\nGood retrieval training pushes the diagonal above the off-diagonal entries." },
    { t: "code", src: "fig, ax = plt.subplots(figsize=(4, 3))\nim = ax.imshow(scores, cmap=\"Blues\")\nax.set_xlabel(\"item in batch\")\nax.set_ylabel(\"query in batch\")\nax.set_title(\"two-tower scores\")\nfig.colorbar(im, ax=ax)\nplt.show()" },
    { t: "md", src: "## Practice\n\nChange `sample_q` so one negative is much rarer. Observe how the corrected probability and loss move." },
    { t: "code", src: "# Your turn:\n" }
  ]
};

const M13 = {
  m: 13, domain: 2,
  title: "ANN / vector search & indexing (HNSW, IVF-PQ, ScaNN)",
  tagline: "Trade a little exactness for the latency and memory needed to search millions of embeddings.",
  skipIf: "choose HNSW (hierarchical navigable small world) vs IVF-PQ (inverted file with product quantization) and tune recall vs latency.",
  mapsTo: ["Creator Marketplace AI"],
  connections: {
    buildsOn: ["embedding spaces", "nearest neighbors", "recall@k (recall at k)"],
    leadsTo: ["production retrieval serving", "hybrid dense and lexical search", "reranking architectures"],
    usedWith: ["HNSW efSearch", "IVF (inverted file) nprobe", "product quantization", "latency-memory-recall tradeoffs"]
  },
  motivation:
    "<p>Exact nearest-neighbor search is beautifully simple: compare the query to every creator vector and sort. That is fine for a notebook and impossible for a live Creator Marketplace search path if the catalog has millions of vectors and many requests per second.</p>" +
    "<p><b>Approximate nearest neighbor</b> indexing keeps the same goal but refuses to inspect everything. Graph methods like HNSW walk through neighbor links; IVF-PQ narrows search to coarse clusters and compressed codes; ScaNN combines partitioning and anisotropic quantization. The practical skill is not memorizing names — it is choosing the knob that buys latency without losing too much recall.</p>",
  definition:
    "<p><b>Definition.</b> Exact top-$k$ vector search returns the $k$ items with largest similarity $q^\\top x_i$ or cosine. ANN (approximate nearest neighbor) returns an approximate set $A_k(q)$ faster than exact search, and we measure quality by recall:</p>" +
    "<p>$$\\operatorname{recall@k}=\\frac{|A_k(q)\\cap E_k(q)|}{|E_k(q)|},$$</p>" +
    "<p>where $E_k(q)$ is the exact top-$k$. HNSW increases recall with larger $\\operatorname{efSearch}$; IVF-style indexes increase recall with larger $\\operatorname{nprobe}$; PQ (product quantization) saves memory by storing compressed subvector codes instead of full float vectors.</p>",
  symbols: [
    { sym: "$q$", desc: "the query embedding." },
    { sym: "$x_i$", desc: "the embedding of catalog item $i$." },
    { sym: "$E_k(q)$", desc: "the exact top-$k$ set for query $q$." },
    { sym: "$A_k(q)$", desc: "the approximate top-$k$ returned by an ANN index." },
    { sym: "$\\operatorname{efSearch}$", desc: "HNSW search breadth knob; larger is slower and usually higher recall." },
    { sym: "$\\operatorname{nprobe}$", desc: "number of IVF coarse clusters searched; larger is slower and usually higher recall." }
  ],
  derivation: [
    { do: "Count exact comparisons", result: "$N$ dot products per query", why: "brute force scores every catalog vector" },
    { do: "Estimate exact arithmetic", result: "$N\\cdot d$ multiply-adds", why: "each dot product touches $d$ dimensions" },
    { do: "Restrict candidates", result: "$C\\ll N$ scored vectors", why: "ANN uses graph paths, partitions, or quantized codes to avoid the full scan" },
    { do: "Measure the cost of approximation", result: "$|A_k\\cap E_k|/k$", why: "recall@k tells how much exact-neighbor quality survived the speedup" }
  ],
  worked: {
    problem: "For one query, exact top-5 creator IDs are $[7,2,9,4,1]$. An approximate index returns $[7,9,3,1,8]$ in 2 ms, while exact brute force takes 20 ms. Compute recall@5 and speedup.",
    skills: ["set overlap", "recall@k", "latency ratio"],
    strategy: "Compare sets for quality, then divide exact latency by approximate latency for speedup.",
    steps: [
      { do: "List the shared IDs", result: "$\{7,9,1\}$", why: "only items present in both top-5 lists count as hits" },
      { do: "Count the shared IDs", result: "$3$", why: "there are three approximate neighbors that exact search also wanted" },
      { do: "Divide by $k$", result: "$\\operatorname{recall@5}=3/5=0.60$", why: "exact top-5 has five targets" },
      { do: "Compute speedup", result: "$20\\text{ ms}/2\\text{ ms}=10\\times$", why: "speedup is old latency divided by new latency" }
    ],
    verify: "The index is much faster but misses two exact top-5 items, so a reranker receives a lower-quality candidate set unless we tune the search breadth.",
    answer: "Recall@5 is 0.60 and speedup is 10x.",
    connects: "ANN tuning is always a trade: more search breadth raises recall and latency together."
  },
  practice: [
    {
      problem: "Exact top-4 is $[10,11,12,13]$ and approximate top-4 is $[11,13,15,16]$. Compute recall@4.",
      steps: [
        { do: "Find the overlap", result: "$\{11,13\}$", why: "these IDs appear in both lists" },
        { do: "Count hits", result: "$2$", why: "two exact neighbors were recovered" },
        { do: "Divide by four", result: "$2/4=0.50$", why: "recall@4 uses four exact targets" }
      ],
      answer: "Recall@4 is $0.50$."
    },
    {
      problem: "A float32 catalog has 3 million vectors with 256 dimensions. Estimate raw vector memory.",
      steps: [
        { do: "Count floats", result: "$3{,}000{,}000\\cdot256=768{,}000{,}000$", why: "each vector stores one float per dimension" },
        { do: "Convert to bytes", result: "$768{,}000{,}000\\cdot4=3{,}072{,}000{,}000$ bytes", why: "float32 uses 4 bytes" },
        { do: "Convert to GB", result: "$3{,}072{,}000{,}000/10^9=3.072$ GB", why: "decimal GB gives an engineering estimate" }
      ],
      answer: "Raw vectors require about 3.07 GB before index overhead."
    },
    {
      problem: "IVF has 1,000 coarse clusters with 1,000 vectors each. If $\\operatorname{nprobe}=12$, about how many vectors are scanned?",
      steps: [
        { do: "Identify vectors per cluster", result: "1,000", why: "the prompt gives equal-size clusters" },
        { do: "Multiply by probed clusters", result: "$12\\cdot1{,}000=12{,}000$", why: "IVF scans only selected clusters" }
      ],
      answer: "About 12,000 vectors are scanned."
    },
    {
      problem: "A PQ code stores a 128-dimensional vector as 16 one-byte codes. How much smaller is it than float32 storage?",
      steps: [
        { do: "Compute float storage", result: "$128\\cdot4=512$ bytes", why: "float32 uses 4 bytes per coordinate" },
        { do: "Read PQ storage", result: "16 bytes", why: "there are 16 one-byte codes" },
        { do: "Compute compression ratio", result: "$512/16=32$", why: "ratio is original size divided by compressed size" }
      ],
      answer: "The PQ code is 32x smaller than raw float32 storage."
    },
    {
      problem: "An HNSW setting has recall@10 of 0.88 at 4 ms. Increasing efSearch gives 0.96 at 9 ms. What is the recall gain per added ms?",
      steps: [
        { do: "Compute recall gain", result: "$0.96-0.88=0.08$", why: "the higher setting recovers 8 more points" },
        { do: "Compute latency cost", result: "$9-4=5$ ms", why: "this is the added serving time" },
        { do: "Divide", result: "$0.08/5=0.016$ recall per ms", why: "this normalizes quality gain by latency" }
      ],
      answer: "The trade is 0.016 recall@10 per additional millisecond."
    }
  ],
  applications: [
    { title: "Creator Marketplace AI vector index", background: "Creator search needs high recall before ranking because missed creators cannot be recovered later. HNSW is often attractive when memory is available and low-latency high-recall search matters.", numbers: "If HNSW efSearch 80 gives recall@50 of 0.93 at 12 ms and efSearch 160 gives 0.97 at 21 ms, the extra 4 recall points cost 9 ms, or $0.04/9=0.0044$ recall per ms." },
    { title: "IVF-PQ for large creative catalogs", background: "Creative Intelligence may store embeddings for many historical assets. IVF-PQ trades exact distances for compressed memory, making a broader catalog searchable on fewer machines.", numbers: "A 100 million vector catalog at 128 float32 dimensions needs $100{,}000{,}000\\cdot128\\cdot4=51.2$ GB raw; 16-byte PQ codes need 1.6 GB, a 32x reduction." },
    { title: "Search Ads dense plus lexical hybrid", background: "Dense retrieval handles semantic matches while lexical retrieval protects exact advertiser terms, product names, and compliance-sensitive phrases. Hybrid union improves coverage.", numbers: "If dense top-100 finds 62 relevant ads and lexical top-100 finds 45 with 20 overlapping hits, the union has $62+45-20=87$ relevant hits before reranking." },
    { title: "Instream Ads latency budgeting", background: "Video candidate retrieval competes with policy checks and pacing in the request budget. ANN knobs must leave time for downstream filters.", numbers: "With a 60 ms retrieval budget, exact scan at 180 ms is impossible; ANN at 18 ms uses $18/60=30\%$ of the budget and leaves 42 ms for filtering and ranking." },
    { title: "Event Ads regional shards", background: "Events are naturally partitioned by geography and language. Searching only relevant shards can improve both latency and relevance before ANN even starts.", numbers: "If a global catalog has 4 million events but a region-language shard has 250,000, brute comparison count drops by $4{,}000{,}000/250{,}000=16\\times$ before indexing." },
    { title: "Palette pCTR candidate freshness", background: "ANN indexes may refresh on a schedule while pCTR features update faster. Teams need to quantify the quality cost of stale vectors.", numbers: "If daily refresh has recall@100 of 0.91 and hourly refresh has 0.94 over 10,000 judged queries, hourly recovers about $(0.94-0.91)\\cdot100\\cdot10{,}000=30{,}000$ additional exact-neighbor slots." }
  ],
  applicationsClose:
    "<p>ANN indexing is where representation learning meets production physics. The embedding model decides what should be near; HNSW, IVF-PQ, ScaNN, and hybrid retrieval decide how much of that neighborhood you can afford to find under real latency and memory limits.</p>",
  takeaways: [
    "Exact kNN (k-nearest neighbors) costs $N\\cdot d$ work per query; ANN reduces candidate comparisons by using graphs, partitions, or compression.",
    "Recall@k compares approximate results to exact top-k and is the central quality metric for index tuning.",
    "HNSW favors high-recall low-latency search with memory overhead; IVF-PQ favors memory compression and tunable probing; ScaNN is built around efficient partitioning and quantization.",
    "Hybrid dense plus lexical retrieval often beats either method alone in ads and creator search."
  ],
  resources: [
    { label: "Faiss wiki", note: "IVF, PQ, HNSW indexes and tuning" },
    { label: "Pinecone — learning center", note: "ANN concepts and recall/latency tradeoffs" }
  ],
  papers: [
    "HNSW (Malkov & Yashunin, 2018)",
    "ScaNN / Anisotropic Vector Quantization (Guo et al., 2020)",
    "Product Quantization (Jégou et al., 2011)"
  ],
  notebook: [
    { t: "md", src: "# M13 · ANN / vector search & indexing\n\n_Curriculum · Domain 2 · Retrieval & Representation_\n\n**Trade a little exactness for the latency needed to search many vectors.**\n\nWe compare exact top-k search with a tiny approximate search. Quality is $\\operatorname{recall@k}=\\frac{|A_k\\cap E_k|}{k}$." },
    { t: "code", src: "import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nimport time\n\nrng = np.random.default_rng(13)" },
    { t: "md", src: "## Synthetic creator embeddings\n\nWe make clustered vectors so approximate search can use a cheap coarse partition, similar in spirit to IVF." },
    { t: "code", src: "n_clusters = 8\nitems_per_cluster = 80\ndim = 12\ncenters = rng.normal(size=(n_clusters, dim))\ncenters = centers / np.linalg.norm(centers, axis=1, keepdims=True)\nlabels = np.repeat(np.arange(n_clusters), items_per_cluster)\nnoise = rng.normal(scale=0.18, size=(n_clusters * items_per_cluster, dim))\nitems = centers[labels] + noise\nitems = items / np.linalg.norm(items, axis=1, keepdims=True)\nquery = centers[3] + centers[5] + rng.normal(scale=0.05, size=dim)\nquery = query / np.linalg.norm(query)\n\nprint(items.shape)" },
    { t: "md", src: "## Step 1 - Exact search\n\nExact search scores every vector and sorts the result. It is the quality reference." },
    { t: "code", src: "k = 10\nstart = time.perf_counter()\nexact_scores = items @ query\nexact_top = np.argsort(-exact_scores)[:k]\nexact_time = time.perf_counter() - start\n\nprint(\"exact top ids:\", exact_top)\nprint(\"exact time ms:\", round(exact_time * 1000, 4))\n\nassert len(exact_top) == k" },
    { t: "md", src: "## Step 2 - Approximate search with coarse clusters\n\nWe choose the nearest centroids, then score only items in those clusters. Increasing `nprobe` improves recall and costs more comparisons." },
    { t: "code", src: "def approx_search(nprobe):\n    centroid_scores = centers @ query\n    chosen_clusters = np.argsort(-centroid_scores)[:nprobe]\n    mask = np.isin(labels, chosen_clusters)\n    candidate_idx = np.where(mask)[0]\n    candidate_scores = items[candidate_idx] @ query\n    chosen_local = np.argsort(-candidate_scores)[:k]\n    return candidate_idx[chosen_local], candidate_idx.size\n\napprox_top, comparisons = approx_search(2)\noverlap = len(set(exact_top).intersection(set(approx_top)))\nrecall = overlap / k\n\nprint(\"approx top ids:\", approx_top)\nprint(\"comparisons:\", comparisons)\nprint(\"recall@10:\", recall)\n\nassert comparisons < items.shape[0]" },
    { t: "md", src: "## Step 3 - Sweep the search knob\n\nThis is the recall-latency tradeoff in miniature." },
    { t: "code", src: "rows = []\nfor nprobe in range(1, n_clusters + 1):\n    top_ids, count = approx_search(nprobe)\n    hits = len(set(exact_top).intersection(set(top_ids)))\n    rows.append({\"nprobe\": nprobe, \"comparisons\": count, \"recall\": hits / k})\n\nsweep = pd.DataFrame(rows)\n\nprint(sweep)\n\nassert sweep[\"recall\"].iloc[-1] == 1.0" },
    { t: "md", src: "## Visualize recall vs comparisons\n\nThe curve shows why index tuning is a product decision, not only an algorithms decision." },
    { t: "code", src: "fig, ax = plt.subplots(figsize=(5, 3))\nax.plot(sweep[\"comparisons\"], sweep[\"recall\"], marker=\"o\")\nax.set_xlabel(\"vectors scored\")\nax.set_ylabel(\"recall@10\")\nax.set_ylim(0, 1.05)\nax.set_title(\"ANN recall tradeoff\")\nplt.show()" },
    { t: "md", src: "## Practice\n\nChange `items_per_cluster`, `dim`, or `nprobe`. Try to find the smallest number of comparisons that still reaches recall@10 of at least 0.9." },
    { t: "code", src: "# Your turn:\n" }
  ]
};

const M14 = {
  m: 14, domain: 2,
  title: "Encoders & contrastive training (dual/cross-encoder, InfoNCE, hard negatives)",
  tagline: "Fine-tune text encoders so positives pull together and confusing negatives finally push apart.",
  skipIf: "fine-tune a text encoder with a contrastive objective + hard negatives.",
  mapsTo: ["Creator Marketplace AI"],
  connections: {
    buildsOn: ["embeddings", "two-tower retrieval loss", "softmax and cross-entropy"],
    leadsTo: ["semantic reranking", "hard-negative mining loops", "retrieval-to-ranker cascades"],
    usedWith: ["dual encoders", "cross encoders", "InfoNCE temperature", "triplet loss", "in-batch negatives"]
  },
  motivation:
    "<p>A general text embedding model understands a lot, but AFP-AI retrieval has its own mistakes. It may think 'startup advisor' and 'enterprise security creator' are close enough, or miss that 'demand gen' and 'B2B growth' should be neighbors for Creator Marketplace AI.</p>" +
    "<p><b>Contrastive training</b> gives the encoder examples of what should be close and what should be far. Dual encoders make retrieval fast because query and item vectors are separate. Cross-encoders are slower but more accurate because they read the pair together, so they are often used after retrieval as rerankers or teachers.</p>",
  definition:
    "<p><b>Definition.</b> A dual encoder maps query and item text separately, then scores them by similarity. A cross-encoder reads the concatenated pair and scores it directly. Contrastive training often uses InfoNCE:</p>" +
    "<p>$$\\ell_i=-\\log\\frac{\\exp(s(q_i,p_i)/\\tau)}{\\exp(s(q_i,p_i)/\\tau)+\\sum_j\\exp(s(q_i,n_{ij})/\\tau)},$$</p>" +
    "<p>where $p_i$ is the positive item, $n_{ij}$ are negatives, and $\\tau$ is temperature. Smaller $\\tau$ sharpens the softmax. Hard negatives are items that look plausible but are wrong; they raise the loss and teach the boundary the model was missing.</p>",
  symbols: [
    { sym: "$q_i$", desc: "query text, such as a brand brief." },
    { sym: "$p_i$", desc: "the positive matching item for query $i$." },
    { sym: "$n_{ij}$", desc: "negative item $j$ for query $i$." },
    { sym: "$s(q,i)$", desc: "similarity score, often cosine or dot product between embeddings." },
    { sym: "$\\tau$", desc: "temperature; lower values make score differences more decisive." },
    { sym: "$\\ell_i$", desc: "contrastive loss for one query." }
  ],
  derivation: [
    { do: "Scale similarities", result: "$a_j=s_j/\\tau$", why: "temperature controls softmax sharpness" },
    { do: "Exponentiate scores", result: "$w_j=\\exp(a_j)$", why: "softmax converts relative scores into positive weights" },
    { do: "Normalize the positive weight", result: "$p_+=w_+ / \\sum_j w_j$", why: "the positive must win against positives and negatives in the denominator" },
    { do: "Take negative log", result: "$\\ell=-\\log p_+$", why: "low positive probability produces a large learning signal" },
    { do: "Add a hard negative", result: "a large $w_n$ increases $\\sum_j w_j$", why: "the loss rises because the model is confused by a plausible wrong item" }
  ],
  worked: {
    problem: "A query-positive pair has cosine $0.80$. An easy negative has cosine $0.10$. A hard negative has cosine $0.70$. With temperature $\\tau=0.1$, compute InfoNCE loss with only the easy negative, then with both negatives.",
    skills: ["temperature scaling", "softmax", "InfoNCE"],
    strategy: "Scale each cosine by $\\tau$, exponentiate, then compute the positive probability.",
    steps: [
      { do: "Scale the positive", result: "$0.80/0.1=8$", why: "temperature makes similarities sharper" },
      { do: "Scale the easy negative", result: "$0.10/0.1=1$", why: "the easy negative should get little weight" },
      { do: "Compute positive probability with easy negative", result: "$e^8/(e^8+e^1)\\approx0.999$", why: "the positive is far ahead" },
      { do: "Compute easy-negative loss", result: "$-\\log(0.999)\\approx0.001$", why: "an easy contrast teaches almost nothing" },
      { do: "Scale the hard negative", result: "$0.70/0.1=7$", why: "a plausible wrong item gets a large softmax weight" },
      { do: "Compute positive probability with both negatives", result: "$e^8/(e^8+e^1+e^7)\\approx0.731$", why: "the hard negative steals probability mass" },
      { do: "Compute hard-negative loss", result: "$-\\log(0.731)\\approx0.313$", why: "the higher loss creates a useful gradient" }
    ],
    verify: "The hard negative raises loss from nearly zero to about 0.313 even though the positive score did not change, which is exactly why mining hard negatives helps fine-tuning.",
    answer: "Easy-only InfoNCE loss is about 0.001; adding the hard negative raises it to about 0.313.",
    connects: "contrastive fine-tuning improves the embedding boundary by choosing negatives that expose the current model's confusions."
  },
  practice: [
    {
      problem: "With $\\tau=0.2$, positive similarity $0.6$, and one negative similarity $0.2$, compute the positive softmax probability.",
      steps: [
        { do: "Scale the positive", result: "$0.6/0.2=3$", why: "InfoNCE divides by temperature" },
        { do: "Scale the negative", result: "$0.2/0.2=1$", why: "the negative also enters the denominator" },
        { do: "Compute probability", result: "$e^3/(e^3+e^1)\\approx0.881$", why: "softmax compares positive against negative" }
      ],
      answer: "The positive probability is approximately $0.881$."
    },
    {
      problem: "Using the probability $0.881$, compute the InfoNCE loss.",
      steps: [
        { do: "Write the loss", result: "$\\ell=-\\log p_+$", why: "InfoNCE is cross-entropy on the positive" },
        { do: "Substitute", result: "$\\ell=-\\log(0.881)$", why: "the probability came from the softmax" },
        { do: "Evaluate", result: "$\\ell\\approx0.127$", why: "high positive probability gives low loss" }
      ],
      answer: "The loss is about $0.127$."
    },
    {
      problem: "A triplet loss uses margin $0.2$, positive distance $0.4$, and negative distance $0.55$. Compute the loss $\\max(0,d_+-d_-+m)$.",
      steps: [
        { do: "Subtract distances", result: "$0.4-0.55=-0.15$", why: "the negative is farther than the positive" },
        { do: "Add the margin", result: "$-0.15+0.2=0.05$", why: "the model has not cleared the desired margin" },
        { do: "Apply the maximum", result: "$\\max(0,0.05)=0.05$", why: "positive violations produce loss" }
      ],
      answer: "The triplet loss is $0.05$."
    },
    {
      problem: "A batch has 32 query-positive pairs. How many in-batch negatives does each query see, and how many query-negative comparisons are made?",
      steps: [
        { do: "Compute negatives per query", result: "$32-1=31$", why: "the query's own positive is not a negative" },
        { do: "Multiply by query count", result: "$32\\cdot31=992$", why: "each query compares with all other positives as negatives" }
      ],
      answer: "Each query sees 31 negatives, for 992 query-negative comparisons."
    },
    {
      problem: "A dual encoder retrieves 1,000 candidates in 15 ms. A cross-encoder scores one pair in 4 ms. Why not cross-encode all candidates under a 100 ms budget?",
      steps: [
        { do: "Compute cross-encoder time", result: "$1{,}000\\cdot4=4{,}000$ ms", why: "pairwise scoring repeats the encoder for each candidate" },
        { do: "Compare to budget", result: "$4{,}000/100=40$", why: "the cross-encoder would use forty times the budget" },
        { do: "State the architecture", result: "dual encoder first, cross-encoder reranks a small shortlist", why: "this keeps recall and precision within latency" }
      ],
      answer: "Cross-encoding all 1,000 would take 4 seconds, so use it only on a small reranking shortlist."
    }
  ],
  applications: [
    { title: "Creator Marketplace AI hard-negative mining", background: "The most valuable negatives are creators the current model retrieves for a brief but human judges reject. They are close enough to confuse the encoder and therefore teach the real boundary.", numbers: "If a batch has 128 positives and each query adds 3 mined hard negatives, the loss sees $128\\cdot3=384$ explicit hard negatives plus $128\\cdot127=16{,}256$ in-batch negatives." },
    { title: "Cross-encoder reranking after retrieval", background: "A dual encoder gets broad candidates fast. A cross-encoder can then read the brief and creator profile together for the top candidates, catching details the dot product compressed away.", numbers: "Reranking top 50 at 3 ms per pair costs $50\\cdot3=150$ ms, while reranking top 10 costs 30 ms; that 120 ms difference often decides whether the model can be online." },
    { title: "Search Ads query-ad relevance fine-tuning", background: "Contrastive pairs can teach that a query about 'CRM migration' is closer to enterprise software ads than generic productivity ads, even if both share business vocabulary.", numbers: "At $\\tau=0.05$, a positive-negative cosine gap of 0.10 becomes a logit gap of $0.10/0.05=2$, so the positive gets $e^2\\approx7.39$ times the softmax weight." },
    { title: "Creative Intelligence duplicate intent detection", background: "Two creatives may use different copy while expressing the same campaign promise. Contrastive training on approved pairs can pull such variants together.", numbers: "If duplicate-pair cosine rises from 0.62 to 0.78 and unrelated-pair cosine stays 0.30, the separation margin improves from $0.62-0.30=0.32$ to $0.78-0.30=0.48$." },
    { title: "Instream Ads safety-sensitive retrieval", background: "Hard negatives are critical when two videos are semantically similar but only one is brand-safe for a campaign. The model must learn subtle exclusions, not just broad topics.", numbers: "A hard-negative loss of 0.31 versus easy-negative loss of 0.001 is about $0.31/0.001=310\\times$ larger, so it dominates the useful gradient in that example." },
    { title: "Event Ads audience matching", background: "Event descriptions and member interests can be encoded with dual encoders, while a cross-encoder reranks the most plausible audience segments for nuance like seniority or geography.", numbers: "If the dual encoder returns 200 segments and the cross-encoder reranks 25, pair scoring falls by $200/25=8\\times$ while preserving most of the candidate recall." }
  ],
  applicationsClose:
    "<p>Encoders turn language into retrieval geometry, and contrastive objectives decide which distinctions matter. Dual encoders buy speed, cross-encoders buy pairwise judgment, and hard negatives make the training signal honest about the mistakes AFP-AI products actually make.</p>",
  takeaways: [
    "Dual encoders are fast because query and item vectors are computed separately; cross-encoders are slower but usually more accurate for reranking.",
    "InfoNCE is a softmax loss over positives and negatives, with temperature controlling sharpness.",
    "Hard negatives raise the loss because they are plausible wrong answers, making them especially useful for fine-tuning.",
    "Production retrieval often uses a dual-encoder first stage and a cross-encoder or heavier ranker on a shortlist."
  ],
  resources: [
    { label: "Sentence-Transformers docs", note: "bi-/cross-encoders and training losses" },
    { label: "Lil'Log — Contrastive Representation Learning", note: "InfoNCE, triplet, in-batch negatives" }
  ],
  papers: [
    "Sentence-BERT (Reimers & Gurevych, 2019)",
    "SimCSE (Gao et al., 2021)",
    "E5 Text Embeddings (Wang et al., 2022)",
    "CPC (contrastive predictive coding) / InfoNCE (van den Oord et al., 2018)",
    "SimCLR (Chen et al., 2020)",
    "MoCo (He et al., 2020)"
  ],
  notebook: [
    { t: "md", src: "# M14 · Encoders & contrastive training\n\n_Curriculum · Domain 2 · Retrieval & Representation_\n\n**Fine-tune text encoders so positives pull together and confusing negatives push apart.**\n\nWe simulate encoder embeddings with small numpy vectors. The InfoNCE loss is $\\ell=-\\log\\frac{\\exp(s_+/\\tau)}{\\sum_j\\exp(s_j/\\tau)}$." },
    { t: "code", src: "import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\nrng = np.random.default_rng(14)" },
    { t: "md", src: "## Simulated encoder outputs\n\nNo transformer weights are downloaded. These vectors stand in for brief and creator embeddings after a text encoder." },
    { t: "code", src: "query = np.array([1.0, 0.2, 0.1, 0.0])\npositive = np.array([0.9, 0.25, 0.1, 0.05])\neasy_negative = np.array([0.0, 0.1, 0.9, 0.2])\nhard_negative = np.array([0.75, 0.30, 0.15, 0.10])\nitems = np.vstack([positive, easy_negative, hard_negative])\nlabels = np.array([\"positive\", \"easy negative\", \"hard negative\"])\n\ndef normalize(x):\n    return x / np.linalg.norm(x, axis=-1, keepdims=True)\n\nquery_n = normalize(query)\nitems_n = normalize(items)\ncosines = items_n @ query_n\n\nprint(pd.DataFrame({\"item\": labels, \"cosine\": cosines}).round(3))" },
    { t: "md", src: "## Step 1 - Compute InfoNCE\n\nA hard negative has a cosine close to the positive, so it steals probability mass." },
    { t: "code", src: "def info_nce(similarities, tau):\n    logits = similarities / tau\n    logits = logits - logits.max()\n    weights = np.exp(logits)\n    probs = weights / weights.sum()\n    return -np.log(probs[0]), probs\n\ntau = 0.1\nloss_easy, probs_easy = info_nce(cosines[:2], tau)\nloss_hard, probs_hard = info_nce(cosines, tau)\n\nprint(\"easy-only loss:\", round(loss_easy, 4))\nprint(\"with-hard loss:\", round(loss_hard, 4))\n\nassert loss_hard > loss_easy" },
    { t: "md", src: "## Step 2 - Inspect the probabilities\n\nThe hard negative is useful because the model still assigns it meaningful probability." },
    { t: "code", src: "prob_table = pd.DataFrame({\n    \"item\": labels,\n    \"probability_with_hard\": probs_hard,\n})\n\nprint(prob_table.round(4))\n\nassert probs_hard[2] > probs_easy[1]" },
    { t: "md", src: "## Step 3 - Temperature changes sharpness\n\nLower temperature magnifies score gaps. Higher temperature spreads probability more evenly." },
    { t: "code", src: "taus = np.array([0.05, 0.10, 0.20, 0.50])\nrows = []\nfor value in taus:\n    loss_value, prob_value = info_nce(cosines, value)\n    rows.append({\"tau\": value, \"loss\": loss_value, \"positive_probability\": prob_value[0]})\n\ntemp_df = pd.DataFrame(rows)\n\nprint(temp_df.round(4))\n\nassert temp_df[\"loss\"].min() >= 0" },
    { t: "md", src: "## Visualize the hard-negative effect\n\nThe loss jumps when the negative is close enough to be plausible." },
    { t: "code", src: "fig, ax = plt.subplots(figsize=(4, 3))\nax.bar([\"easy only\", \"with hard\"], [loss_easy, loss_hard], color=[\"#4c78a8\", \"#f58518\"])\nax.set_ylabel(\"InfoNCE loss\")\nax.set_title(\"hard negatives increase signal\")\nplt.show()" },
    { t: "md", src: "## Practice\n\nMove `hard_negative` closer to `positive`, or raise `tau`. Re-run the notebook and explain how the loss and probabilities change." },
    { t: "code", src: "# Your turn:\n" }
  ]
};

module.exports = [M11, M12, M13, M14];
