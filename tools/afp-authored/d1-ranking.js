/* =====================================================================
   AFP-AI Learning Guide — Domain 1 · Ranking & Recommenders (M6–M10)
   ---------------------------------------------------------------------
   Authored source for the AFP-AI track. One object per module.
   Read by tools/gen-afp.js (-> lessons/afp-ai.js) and
   tools/gen-afp-notebooks.js (-> notebooks/afp-mNN.ipynb).
   ===================================================================== */
"use strict";

const M6 = {
  m: 6, domain: 1,
  title: "RecSys landscape: collaborative filtering / matrix factorization → two-tower → sequential & generative recommenders",
  tagline: "Choose the recommender family that matches the data, latency, and product question in front of you.",
  skipIf: "contrast CF vs two-tower vs generative recommenders and pick per use-case.",
  mapsTo: ["all"],
  connections: {
    buildsOn: ["supervised learning", "vector similarity", "train/serve candidate funnels"],
    leadsTo: ["ranking objectives", "implicit-feedback training", "sequence and generative retrieval"],
    usedWith: ["nearest-neighbor search", "embeddings", "retrieval-to-ranking cascades"]
  },
  motivation:
    "<p>You already know how to score one example with a supervised model. A recommender has a harder first question: out of millions of possible ads, creators, posts, events, or videos, which few hundred should the expensive ranker even see? The answer changes as the system grows from sparse interactions to dense histories to real-time sequences.</p>" +
    "<p>The landscape is easiest to read as a progression. Neighborhood collaborative filtering says <b>similar users like similar items</b>. Matrix factorization compresses that idea into vectors. Two-tower retrieval learns user and item vectors directly for fast dot-product search. Sequential and generative recommenders then make the next item depend on order, intent, and language-like action histories, using objectives such as $s(u,i)=p_u^\\top q_i$ or $p(i_t\\mid i_1,\\ldots,i_{t-1})$.</p>",
  definition:
    "<p><b>Definition.</b> A recommender maps a user/context $u$ and a large item set $\\mathcal{I}$ to an ordered candidate list. In matrix factorization, the interaction matrix $R\\in\\mathbb{R}^{m\\times n}$ is approximated by low-rank factors $P\\in\\mathbb{R}^{m\\times k}$ and $Q\\in\\mathbb{R}^{n\\times k}$, so $\\hat r_{ui}=p_u^\\top q_i$. In two-tower retrieval, neural encoders produce $e_u=f_\\theta(u)$ and $e_i=g_\\phi(i)$, and retrieval uses $s(u,i)=e_u^\\top e_i$.</p>" +
    "<p><b>Assumptions that matter:</b> collaborative methods need enough overlap in interactions; two-tower systems need features available at serving time and an ANN index; sequential systems need ordered histories; generative retrieval needs stable item tokenization and careful evaluation so fluent generation does not replace relevance.</p>",
  symbols: [
    { sym: "$R_{ui}$", desc: "observed interaction or rating from user $u$ to item $i$." },
    { sym: "$p_u, q_i \\in \\mathbb{R}^k$", desc: "latent vectors for a user and an item in a shared $k$-dimensional space." },
    { sym: "$\\hat r_{ui}=p_u^\\top q_i$", desc: "predicted affinity from a dot product." },
    { sym: "$e_u=f_\\theta(u)$", desc: "the user/context tower embedding used for retrieval." },
    { sym: "$p(i_t\\mid i_{<t})$", desc: "a sequential or generative next-item distribution." }
  ],
  derivation: [
    { do: "Start with the interaction matrix", result: "$R$ has users as rows and items as columns", why: "the raw recommender signal is a sparse table of who interacted with what" },
    { do: "Choose a small latent dimension", result: "$k \\ll \\min(m,n)$", why: "we want shared factors such as topic, intent, or quality rather than one parameter per cell" },
    { do: "Represent each user and item", result: "$p_u\\in\\mathbb{R}^k$ and $q_i\\in\\mathbb{R}^k$", why: "nearby vectors encode similar taste or similar content" },
    { do: "Score by a dot product", result: "$\\hat r_{ui}=\\sum_{j=1}^k p_{uj}q_{ij}$", why: "matching positive coordinates increase affinity while mismatches lower it" },
    { do: "Replace lookup vectors with towers", result: "$p_u=f_\\theta(u)$ and $q_i=g_\\phi(i)$", why: "features let the system score new users or items and support ANN retrieval" }
  ],
  worked: {
    problem: "A tiny Creator Marketplace has two briefs and three creators. Factor the observed affinity pattern into two latent dimensions and explain where retrieval and ranking split.",
    skills: ["matrix factorization", "dot-product retrieval", "funnel design"],
    strategy: "Use interpretable factors first, then treat the dot products as retrieval candidates, not final business scores.",
    steps: [
      { do: "Define factor 1", result: "dimension 1 = B2B tech", why: "brief A and creator 1 both strongly express technical thought leadership" },
      { do: "Define factor 2", result: "dimension 2 = event/video storytelling", why: "brief B and creator 3 both express event-oriented video content" },
      { do: "Assign brief vectors", result: "$p_A=(2,0)$ and $p_B=(0,2)$", why: "each brief is intentionally pure in this toy example" },
      { do: "Assign creator vectors", result: "$q_1=(2,0), q_2=(1,1), q_3=(0,2)$", why: "creator 2 is a hybrid, while 1 and 3 specialize" },
      { do: "Compute scores for brief A", result: "$[p_A^\\top q_1,p_A^\\top q_2,p_A^\\top q_3]=[4,2,0]$", why: "the dot product retrieves creators aligned to A's latent need" },
      { do: "Place the ranker", result: "retrieve creators 1 and 2, then rank with price, safety, freshness, and predicted response", why: "retrieval is a recall stage; ranking handles richer objectives" }
    ],
    verify: "For brief B the same factors give scores $[0,2,4]$, so creator 3 becomes the top candidate as expected.",
    answer: "A two-factor model retrieves the right specialized creator for each brief, while the downstream ranker decides the final ordering under business constraints.",
    connects: "the dot-product view is the bridge from classic matrix factorization to modern two-tower retrieval."
  },
  practice: [
    { problem: "A user vector is $p=(1,2)$ and three item vectors are $q_a=(2,0)$, $q_b=(0,2)$, $q_c=(1,1)$. Rank the items by matrix-factorization score.", steps: [ { do: "Score item a", result: "$p^\\top q_a=1\\cdot2+2\\cdot0=2$", why: "dot products sum coordinate-wise matches" }, { do: "Score item b", result: "$p^\\top q_b=1\\cdot0+2\\cdot2=4$", why: "the second coordinate matches strongly" }, { do: "Score item c", result: "$p^\\top q_c=1\\cdot1+2\\cdot1=3$", why: "the hybrid item matches both dimensions moderately" } ], answer: "The order is $b$ (4), $c$ (3), then $a$ (2)." },
    { problem: "You have item metadata but no item interactions. Which family should be the first production baseline: user-neighborhood CF, pure MF lookup factors, or a two-tower/hybrid model?", steps: [ { do: "Check collaborative overlap", result: "new items have no interaction columns", why: "neighborhood CF and pure MF cannot estimate reliable item factors without observations" }, { do: "Use available features", result: "encode metadata in an item tower or hybrid scorer", why: "content features let the model place cold items before interaction history accumulates" } ], answer: "Start with a content-aware two-tower or hybrid baseline, then hand off to collaborative signals when interactions arrive." },
    { problem: "A session is [event post, event ad, registration page]. Why is a sequential recommender more appropriate than static MF for the next action?", steps: [ { do: "Inspect the signal", result: "the order shows rising event intent", why: "the latest actions change the next-item distribution" }, { do: "Compare model assumptions", result: "static MF compresses the whole history into one vector", why: "it may miss that the recent registration page matters more than older activity" }, { do: "Pick the family", result: "SASRec/BERT4Rec-style sequence modeling", why: "attention can weight recent and related actions differently" } ], answer: "Use a sequential recommender because the ordered path carries intent that a static user factor can blur." },
    { problem: "A two-tower model returns 1,000 candidates in 12 ms, while a cross-feature ranker scores 1,000 items in 500 ms. Why not run the ranker over all 10M items?", steps: [ { do: "Scale ranker cost", result: "$10{,}000{,}000/1{,}000 \\times 500\\text{ ms}=5{,}000\\text{ s}$", why: "the ranker cost grows linearly with item count" }, { do: "Read the latency", result: "5,000 seconds is impossible online", why: "interactive products need responses in milliseconds" } ], answer: "Use fast retrieval to shrink 10M items to a few hundred or thousand, then run the expensive ranker." },
    { problem: "A generative retriever emits item tokens. Name one evaluation risk and one guardrail.", steps: [ { do: "Name the risk", result: "the model can generate valid-looking but irrelevant or unavailable item IDs", why: "language fluency is not the same as catalog relevance" }, { do: "Add a guardrail", result: "constrain decoding to catalog tokens and measure recall@K against logged positives", why: "validity and retrieval quality must both be checked" } ], answer: "Guard generative retrieval with catalog-constrained decoding plus standard retrieval metrics such as recall@K or NDCG@K." }
  ],
  applications: [
    { title: "Creator Marketplace AI candidate generation", background: "A brand brief and a creator can each be embedded by a two-tower model before a richer ranker considers price, safety, and campaign fit.", numbers: "If the creator catalog has 2M profiles and ANN retrieval returns 500, the ranker sees $500/2{,}000{,}000=0.025\\%$ of the catalog while keeping recall high enough to be useful." },
    { title: "Instream Ads organic-video relevance", background: "Video embeddings from content classification can feed item towers, letting ads retrieve videos whose topics and audience context match the campaign.", numbers: "A campaign vector $(2,1)$ scores a finance video $(1.5,0.5)$ at $3.5$ and a cooking video $(0.2,1.0)$ at $1.4$, so retrieval sends the finance video first." },
    { title: "Event Ads cold-to-warm retrieval", background: "New events start with text, organizer, and topic features; after impressions arrive, collaborative event/member interactions strengthen the model.", numbers: "With 0 registrations the content score may carry 100% weight; after 1,000 impressions and 80 registrations, a collaborative estimate of $0.08$ attendance can enter the ranker." },
    { title: "Event Organic discovery in Feed SPR", background: "Feed can retrieve event posts using member-event affinity before SPR ranking decides session value and freshness.", numbers: "If retrieval recall@200 rises from 0.70 to 0.82 on held-out attended events, the ranker gets $0.12\\times10{,}000=1{,}200$ additional true-positive opportunities per 10k positives." },
    { title: "Search Ads query relevance", background: "Query and ad towers are a natural retrieval pair because the query is short, the ad catalog is large, and latency is tight.", numbers: "For query vector $(1,3)$, ad A $(1,1)$ scores 4 and ad B $(3,0)$ scores 3, so the relevance candidate set favors A before auction logic." },
    { title: "Creative Intelligence similar-creative search", background: "Creative embeddings let teams find comparable assets, diagnose fatigue, and retrieve examples for recommendations.", numbers: "Cosine similarity $0.92$ versus $0.41$ means one creative is near-duplicate while the other is merely same category; thresholds such as 0.85 can flag reuse." },
    { title: "Palette-driven pCTR feature reuse", background: "The same palette/content embeddings used in retrieval can become dense features for a downstream pCTR ranker.", numbers: "A retrieval score of 2.4 plus calibrated pCTR 0.018 and bid 6 gives expected click value $0.018\\times6=0.108$ before other terms." }
  ],
  applicationsClose:
    "<p>Recommender families are not rivals so much as stages in a maturity curve. Start with the signals you truly have, retrieve cheaply, rank carefully, and let sequence or generative models enter when order and intent justify their complexity.</p>",
  takeaways: [
    "Collaborative filtering uses interaction overlap; matrix factorization compresses that overlap into user and item vectors.",
    "Two-tower retrieval is the production workhorse when catalogs are large and item/user features matter.",
    "Sequential and generative recommenders add power when ordered histories or tokenized item spaces carry real intent.",
    "Retrieval optimizes recall and latency; ranking optimizes the final business objective."
  ],
  resources: [
    { label: "Google — Recommendation Systems course", note: "CF, matrix factorization, retrieval+ranking" },
    { label: "Microsoft Recommenders", note: "reference implementations across algorithms" },
    { label: "Aggarwal — Recommender Systems (book)", note: "the comprehensive textbook" }
  ],
  papers: [
    "Deep Neural Networks for YouTube Recommendations (Covington et al., 2016)",
    "SASRec (Kang & McAuley, 2018)",
    "BERT4Rec (Sun et al., 2019)",
    "TIGER: Generative Retrieval (Rajput et al., 2023)",
    "HSTU: Actions Speak Louder than Words (Zhai et al., 2024)"
  ],
  notebook: [
    { t: "md", src: "# M6 · RecSys landscape\n\n_Curriculum · Domain 1 · Ranking & Recommenders_\n\n**Choose the recommender family that matches the data, latency, and product question.**\n\nWe build a tiny matrix-factorization retrieval example, then treat its dot products as the first stage of a retrieval-to-ranking funnel. Run top to bottom. _Save a copy to your Drive (File -> Save a copy in Drive) to keep your edits._" },
    { t: "code", src: "# Setup - CPU-only and deterministic.\nimport numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\nrng = np.random.default_rng(6)" },
    { t: "md", src: "## First, look at the data\n\nRows are users or briefs, columns are items or creators. Most production matrices are sparse; this one is small enough to see. A low-rank model predicts $\\hat r_{ui}=p_u^\\top q_i$." },
    { t: "code", src: "users = [\"brief_A\", \"brief_B\", \"brief_C\"]\nitems = [\"creator_tech\", \"creator_hybrid\", \"creator_event\"]\nR = np.array([[5.0, 3.0, 0.0], [0.0, 2.0, 5.0], [4.0, 4.0, 1.0]])\nratings = pd.DataFrame(R, index=users, columns=items)\n\nprint(ratings)" },
    { t: "md", src: "## The model, in one formula\n\nMatrix factorization approximates the interaction matrix with two smaller matrices:\n\n$$R \\approx P Q^\\top$$\n\nThe retrieval score for one user and item is their dot product $p_u^\\top q_i$." },
    { t: "md", src: "### Step 1 - Factor with SVD\n\nFor a compact demonstration, truncated SVD gives two latent dimensions. Real systems learn factors with losses, sampling, and regularization." },
    { t: "code", src: "U, S, Vt = np.linalg.svd(R, full_matrices=False)\nk = 2\nP = U[:, :k] * np.sqrt(S[:k])\nQ = Vt[:k, :].T * np.sqrt(S[:k])\nR_hat = P @ Q.T\n\nprint(np.round(R_hat, 2))\n\nassert R_hat.shape == R.shape" },
    { t: "md", src: "### Step 2 - Retrieve candidates for one brief\n\nWe score every creator by dot product and keep the top candidates. This is retrieval, not the final ranker." },
    { t: "code", src: "target = 0\nscores = P[target] @ Q.T\norder = np.argsort(-scores)\nretrieved = [items[i] for i in order[:2]]\n\nprint(pd.Series(scores, index=items).sort_values(ascending=False))\nprint(\"top candidates:\", retrieved)\n\nassert retrieved[0] == \"creator_tech\"" },
    { t: "md", src: "### Step 3 - Add a lightweight ranking feature\n\nA final ranker can mix retrieval affinity with business features. Here we add availability and compute a simple combined score." },
    { t: "code", src: "availability = np.array([0.7, 1.0, 0.4])\nrank_score = 0.8 * scores + 0.2 * availability\nranked = [items[i] for i in np.argsort(-rank_score)]\n\nprint(pd.DataFrame({\"retrieval\": scores, \"availability\": availability, \"rank_score\": rank_score}, index=items).round(3))\nprint(ranked)\n\nassert ranked[0] in retrieved" },
    { t: "md", src: "## Visualize retrieval scores\n\nThe bar chart shows why a cheap dot-product stage is so useful: it quickly separates plausible candidates from the rest." },
    { t: "code", src: "fig, ax = plt.subplots(figsize=(5, 3))\nax.bar(items, scores, color=\"#4c78a8\")\nax.set_ylabel(\"dot-product score\")\nax.set_title(\"retrieval scores for brief_A\")\nax.tick_params(axis=\"x\", rotation=20)\nplt.show()" },
    { t: "md", src: "## Practice\n\nTry each in the empty cell below it.\n\n1. Change `k` to 1 and compare reconstruction error.\n2. Add a fourth creator vector by hand and score it against `brief_A`.\n3. Change the ranking weight from 0.8 to 0.5 and see whether the order changes." },
    { t: "code", src: "# Your turn:\n" }
  ]
};

const M7 = {
  m: 7, domain: 1,
  title: "Ranking & CTR-family (pCTR/pVTR/pLTR), learning-to-rank",
  tagline: "Turn calibrated response probabilities into an ordered list that serves members, advertisers, and the marketplace.",
  skipIf: "explain pointwise vs pairwise vs listwise ranking and a multi-objective head.",
  mapsTo: ["all"],
  connections: {
    buildsOn: ["supervised classification", "log loss", "candidate retrieval"],
    leadsTo: ["calibration", "multi-objective optimization", "auction-aware ranking"],
    usedWith: ["AUC", "NDCG", "calibrated probabilities"]
  },
  motivation:
    "<p>Once retrieval has narrowed the world to a few hundred candidates, the product still needs an order. Ads, creators, videos, events, and search results all ask the same question: which item should appear first for this member in this context? A raw click score is useful, but the final rank often blends click probability, view probability, long-click probability, value, quality, and constraints.</p>" +
    "<p>The central ranking move is to choose the training signal that matches the decision. Pointwise models learn $p(y=1\\mid x)$ with log loss. Pairwise models learn that one item should beat another. Listwise models shape the whole slate through metrics such as NDCG. A production ranker often has multiple heads, for example $S=b\\cdot pCTR+\\lambda_v pVTR+\\lambda_l pLTR$, with each probability calibrated enough to be safely combined.</p>",
  definition:
    "<p><b>Definition.</b> Ranking learns a scoring function $s(x,i)$ that orders candidates $i\\in\\mathcal{C}(x)$ for a context $x$. A <b>pointwise</b> objective treats each candidate independently, commonly log loss $-y\\log p-(1-y)\\log(1-p)$. A <b>pairwise</b> objective compares a preferred item $i^+$ to a less-preferred item $i^-$, for example $-\\log\\sigma(s_{i^+}-s_{i^-})$. A <b>listwise</b> objective optimizes or approximates a metric over the whole ranked list.</p>" +
    "<p><b>Assumptions that matter:</b> labels reflect exposure policies, so position bias and missing-not-at-random impressions can distort learning; objectives must match the online surface; and multi-objective scores only make sense when heads are calibrated to comparable business meaning.</p>",
  symbols: [
    { sym: "$pCTR$", desc: "predicted probability of click for an impression." },
    { sym: "$pVTR$", desc: "predicted probability of a video view-through event." },
    { sym: "$pLTR$", desc: "predicted probability of a long-term or long-click response." },
    { sym: "$s_i$", desc: "ranker score for candidate $i$." },
    { sym: "$\\sigma(z)=\\frac{1}{1+e^{-z}}$", desc: "sigmoid used to convert a pairwise margin to a probability." },
    { sym: "$NDCG@K$", desc: "a list metric that discounts relevant items lower in the slate." }
  ],
  derivation: [
    { do: "Write the pointwise probability", result: "$p_i=\\sigma(s_i)$", why: "a binary response model predicts each candidate independently" },
    { do: "Write the pointwise loss", result: "$\\ell_i=-y_i\\log p_i-(1-y_i)\\log(1-p_i)$", why: "log loss rewards calibrated probabilities, not just ordering" },
    { do: "Form a pairwise margin", result: "$\\Delta=s_{i^+}-s_{i^-}$", why: "ranking only needs the preferred item to score higher" },
    { do: "Convert margin to loss", result: "$\\ell=-\\log\\sigma(\\Delta)$", why: "large positive margins have small loss; reversed pairs are punished" },
    { do: "Move to listwise evaluation", result: "$DCG@K=\\sum_{j=1}^K\\frac{2^{rel_j}-1}{\\log_2(j+1)}$", why: "the value of relevance depends on position in the displayed slate" }
  ],
  worked: {
    problem: "Two ads are candidates for one Search Ads query. Ad A was clicked and has score 1.2; ad B was skipped and has score 0.4. Compute the RankNet-style pairwise loss and a simple multi-objective score.",
    skills: ["pairwise loss", "sigmoid", "multi-objective scoring"],
    strategy: "First check whether the margin has the right sign, then translate probabilities into business value.",
    steps: [
      { do: "Compute the margin", result: "$\\Delta=s_A-s_B=1.2-0.4=0.8$", why: "the clicked item should outrank the skipped item" },
      { do: "Apply the sigmoid", result: "$\\sigma(0.8)=\\frac{1}{1+e^{-0.8}}\\approx0.690$", why: "this is the model's probability that A beats B" },
      { do: "Compute pairwise loss", result: "$-\\log(0.690)\\approx0.371$", why: "a positive margin gives moderate but not zero loss" },
      { do: "Score ad A", result: "$S_A=4\\cdot0.030+0.5\\cdot0.20+0.2\\cdot0.08=0.236$", why: "bid-weighted pCTR is combined with view and long-response heads" },
      { do: "Score ad B", result: "$S_B=6\\cdot0.018+0.5\\cdot0.12+0.2\\cdot0.04=0.176$", why: "a higher bid does not overcome lower response probabilities here" }
    ],
    verify: "The clicked ad has both the higher pairwise score and the higher combined score, so the two readings agree for this toy case.",
    answer: "The pairwise loss is about 0.371, and the multi-objective rank puts ad A ahead with 0.236 versus 0.176.",
    connects: "pointwise heads give probabilities; pairwise/listwise objectives decide whether the ordering is trained directly."
  },
  practice: [
    { problem: "A positive item has score 0.3 and a negative item has score 0.9. Compute the pairwise loss $-\\log\\sigma(s_+-s_-)$.", steps: [ { do: "Compute the margin", result: "$\\Delta=0.3-0.9=-0.6$", why: "the model ranks the positive item too low" }, { do: "Apply sigmoid", result: "$\\sigma(-0.6)\\approx0.354$", why: "the model assigns low probability to the correct ordering" }, { do: "Take negative log", result: "$-\\log(0.354)\\approx1.038$", why: "wrongly ordered pairs receive large loss" } ], answer: "The pairwise loss is about 1.038." },
    { problem: "Compute $S=bid\\cdot pCTR+0.3\\cdot pVTR$ for ad A: bid 5, pCTR 0.02, pVTR 0.30; ad B: bid 8, pCTR 0.012, pVTR 0.20.", steps: [ { do: "Score ad A", result: "$5\\cdot0.02+0.3\\cdot0.30=0.19$", why: "click value and video value are both included" }, { do: "Score ad B", result: "$8\\cdot0.012+0.3\\cdot0.20=0.156$", why: "the higher bid is offset by lower probabilities" } ], answer: "Ad A ranks first with 0.190 versus 0.156." },
    { problem: "A slate has relevance labels [3, 0, 1]. Compute DCG@3.", steps: [ { do: "Compute position 1 gain", result: "$(2^3-1)/\\log_2(2)=7$", why: "top position has no discount" }, { do: "Compute position 2 gain", result: "$(2^0-1)/\\log_2(3)=0$", why: "zero relevance contributes no gain" }, { do: "Compute position 3 gain", result: "$(2^1-1)/\\log_2(4)=0.5$", why: "rank 3 has discount 2" } ], answer: "DCG@3 is $7.5$." },
    { problem: "Why can a ranker with high AUC still produce a weak top slot?", steps: [ { do: "Read what AUC measures", result: "average pair ordering over positives and negatives", why: "it does not focus only on rank 1" }, { do: "Read the product need", result: "top-slot utility depends on the first few positions", why: "small errors at the top can dominate user impact" } ], answer: "AUC can hide top-position mistakes; use listwise metrics such as NDCG@K or top-slot precision as well." },
    { problem: "A click head is calibrated but a dwell head is not. What can go wrong in $S=pCTR+\\lambda pDwell$?", steps: [ { do: "Compare units", result: "$pCTR$ means observed click frequency, but raw $pDwell$ may not mean probability", why: "uncalibrated heads are not comparable" }, { do: "Trace the score", result: "one head can dominate because of scale rather than value", why: "multi-objective addition assumes meaningful numeric units" } ], answer: "Calibrate or rescale heads before combining, or the score can optimize an arbitrary scale artifact." }
  ],
  applications: [
    { title: "Palette-driven pCTR auction score", background: "Palette features can feed a pCTR head, but the ad ranker ultimately combines response probability with bid and quality.", numbers: "Ad A with pCTR 0.015 and bid 8 has expected click value $0.120$; ad B with pCTR 0.025 and bid 4 has $0.100$, so A wins before quality terms." },
    { title: "Instream Ads pVTR ranking", background: "Organic-video relevance narrows context, then pVTR predicts whether the member will watch enough video for the ad experience to make sense.", numbers: "A creative with pVTR 0.32 and value 0.4 contributes $0.128$; another with pVTR 0.20 contributes $0.080$, a 60% lift in that head." },
    { title: "Creator Marketplace AI multi-objective fit", background: "A creator match may optimize brand response, creator quality, budget fit, and safety at once.", numbers: "Using $S=0.6pReply+0.3pAccept+0.1quality$, scores $0.6(0.25)+0.3(0.40)+0.1(0.90)=0.36$ for creator A." },
    { title: "Search Ads query relevance", background: "Search ranking often uses pairwise or listwise objectives because the displayed order matters more than standalone click estimates.", numbers: "If a clicked ad moves from rank 3 to rank 1, DCG gain changes from $1/\\log_2(4)=0.5$ to $1/\\log_2(2)=1.0$, doubling discounted gain." },
    { title: "Event Ads pAttend ranking", background: "Event Ads can include a pAttend or pRegister head so ranking does not optimize clicks that never become attendance.", numbers: "Ad X has pCTR 0.03 and pAttend 0.004; ad Y has pCTR 0.02 and pAttend 0.010. With $S=pCTR+5pAttend$, X scores 0.05 and Y scores 0.07." },
    { title: "Feed SPR for Event Organic", background: "Feed ranking uses list effects because a post's value depends on where it appears in a session, not just whether it is clicked in isolation.", numbers: "A relevant event at rank 5 contributes $1/\\log_2(6)\\approx0.387$ DCG, far less than the same post at rank 2 with $0.631$." },
    { title: "Creative Intelligence recommendation lists", background: "Creative suggestions are ranked as slates: diversity, predicted lift, and relevance all matter to the final list.", numbers: "A list with relevance [2,2,0] has DCG $3+3/1.585+0=4.893$; [2,0,2] has $3+0+3/2=4.5$, so order matters even with the same items." }
  ],
  applicationsClose:
    "<p>Ranking is where probabilities become product choices. Pointwise models give calibrated heads, pairwise losses teach preferences, and listwise metrics remind us that the top of the slate is where members actually live.</p>",
  takeaways: [
    "pCTR, pVTR, and pLTR are probability heads that often feed a larger ranking score.",
    "Pointwise objectives learn labels independently; pairwise objectives learn preferences; listwise objectives optimize slate quality.",
    "Multi-objective ranking requires calibrated or otherwise comparable heads."
  ],
  resources: [
    { label: "Google — Recommendation Systems course", note: "scoring & ranking stage" },
    { label: "Tie-Yan Liu — Learning to Rank for Information Retrieval (book)", note: "pointwise/pairwise/listwise theory" }
  ],
  papers: [
    "Practical Lessons from Predicting Clicks on Ads at Facebook (He et al., 2014)",
    "Wide & Deep (Cheng et al., 2016)",
    "DeepFM (Guo et al., 2017)",
    "DCN-V2 (Wang et al., 2021)",
    "DLRM (Naumov et al., 2019)"
  ],
  notebook: [
    { t: "md", src: "# M7 · Ranking & CTR-family\n\n_Curriculum · Domain 1 · Ranking & Recommenders_\n\n**Turn response probabilities into an ordered list.**\n\nWe compare pointwise pCTR scoring, pairwise loss, and a simple multi-objective rank score. _Save a copy to your Drive (File -> Save a copy in Drive) to keep your edits._" },
    { t: "code", src: "# Setup - CPU-only and deterministic.\nimport numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\nrng = np.random.default_rng(7)" },
    { t: "md", src: "## First, look at candidates\n\nEach row is an ad candidate with predicted probabilities. A ranker may combine $pCTR$, $pVTR$, and value weights rather than sorting by clicks alone." },
    { t: "code", src: "df = pd.DataFrame({\"ad\": [\"A\", \"B\", \"C\", \"D\"], \"bid\": [5.0, 8.0, 4.0, 6.0], \"pctr\": [0.026, 0.016, 0.030, 0.020], \"pvtr\": [0.18, 0.25, 0.10, 0.22], \"clicked\": [1, 0, 1, 0]})\n\nprint(df)" },
    { t: "md", src: "## The pairwise objective\n\nFor a clicked item $i^+$ and skipped item $i^-$, RankNet-style loss is\n\n$$\\ell=-\\log\\sigma(s_{i^+}-s_{i^-})$$\n\nA larger positive margin means smaller loss." },
    { t: "md", src: "### Step 1 - Build a pointwise score\n\nExpected click value is a simple pointwise ranking score: bid times calibrated pCTR." },
    { t: "code", src: "df[\"click_value\"] = df[\"bid\"] * df[\"pctr\"]\npointwise = df.sort_values(\"click_value\", ascending=False)\n\nprint(pointwise[[\"ad\", \"click_value\"]])\n\nassert pointwise.iloc[0][\"ad\"] == \"A\"" },
    { t: "md", src: "### Step 2 - Compute one pairwise loss\n\nCompare clicked ad A with skipped ad B using the pointwise score as $s$." },
    { t: "code", src: "s_pos = float(df.loc[df[\"ad\"] == \"A\", \"click_value\"].iloc[0])\ns_neg = float(df.loc[df[\"ad\"] == \"B\", \"click_value\"].iloc[0])\nmargin = s_pos - s_neg\nprob_order = 1.0 / (1.0 + np.exp(-margin))\npair_loss = -np.log(prob_order)\n\nprint(\"margin:\", round(margin, 4))\nprint(\"pairwise loss:\", round(pair_loss, 4))\n\nassert pair_loss < 0.75" },
    { t: "md", src: "### Step 3 - Add a video-view head\n\nA multi-objective score can include both click value and video value, as long as the heads are meaningful." },
    { t: "code", src: "df[\"multi_score\"] = df[\"click_value\"] + 0.25 * df[\"pvtr\"]\nmulti = df.sort_values(\"multi_score\", ascending=False)\n\nprint(multi[[\"ad\", \"click_value\", \"pvtr\", \"multi_score\"]].round(4))\n\nassert set(multi[\"ad\"]) == set(df[\"ad\"])" },
    { t: "md", src: "## Visualize score components\n\nThe plot makes the trade-off visible: click value and video-view value can disagree." },
    { t: "code", src: "x = np.arange(len(df))\nfig, ax = plt.subplots(figsize=(5, 3))\nax.bar(x - 0.18, df[\"click_value\"], width=0.36, label=\"click value\")\nax.bar(x + 0.18, 0.25 * df[\"pvtr\"], width=0.36, label=\"video term\")\nax.set_xticks(x)\nax.set_xticklabels(df[\"ad\"])\nax.set_title(\"multi-objective rank terms\")\nax.legend()\nplt.show()" },
    { t: "md", src: "## Practice\n\nTry each in the empty cell below it.\n\n1. Change the video weight from 0.25 to 0.10 and inspect the top ad.\n2. Compute pairwise loss for clicked C versus skipped D.\n3. Replace `bid * pctr` with pCTR-only ranking and compare the order." },
    { t: "code", src: "# Your turn:\n" }
  ]
};

const M8 = {
  m: 8, domain: 1,
  title: "Calibration & class imbalance (isotonic/Platt, rare events, sparse slices)",
  tagline: "Make predicted probabilities mean what the marketplace thinks they mean, especially when positives are rare.",
  skipIf: "calibrate a sparse-slice model and explain why raw scores mislead.",
  mapsTo: ["all"],
  connections: {
    buildsOn: ["pCTR heads", "log loss", "validation splits"],
    leadsTo: ["auction value", "thresholding", "sparse-slice monitoring"],
    usedWith: ["reliability diagrams", "class weighting", "Platt and isotonic calibration"]
  },
  motivation:
    "<p>A ranker can be excellent at ordering yet still dangerous as a probability source. If a model says 0.10 on a slice and only 0.04 of those impressions click, the order might be useful but the marketplace math is wrong. In ads, multiplying pCTR by bid turns calibration error into money allocation error.</p>" +
    "<p>Calibration asks for a simple promise: among examples predicted at $p$, about a fraction $p$ should be positive. Rare events and sparse slices make that promise hard. Platt scaling bends scores through a sigmoid; isotonic regression learns a monotone stair-step map; ECE summarizes the reliability diagram as $\\sum_b \\frac{n_b}{n}|acc(b)-conf(b)|$.</p>",
  definition:
    "<p><b>Definition.</b> A probabilistic classifier is calibrated if $\\Pr(Y=1\\mid \\hat p=p)=p$. Expected calibration error bins predictions and compares each bin's empirical accuracy $acc(b)$ to its mean confidence $conf(b)$: $$ECE=\\sum_{b=1}^B \\frac{n_b}{n}\\left|acc(b)-conf(b)\\right|.$$ Platt scaling fits $\\hat p'=\\sigma(a z+b)$ to raw score $z$; isotonic calibration fits a monotone function $g(z)$.</p>" +
    "<p><b>Assumptions that matter:</b> calibration must be fit on held-out data; bins need enough examples to be stable; rare positives make variance large; and resampling or class-weighting can improve learning while still requiring a post-training calibration read.</p>",
  symbols: [
    { sym: "$\\hat p$", desc: "model-predicted probability before or after calibration." },
    { sym: "$acc(b)$", desc: "observed positive rate in calibration bin $b$." },
    { sym: "$conf(b)$", desc: "average predicted probability in bin $b$." },
    { sym: "$n_b/n$", desc: "fraction of examples in bin $b$." },
    { sym: "$\\sigma(a z+b)$", desc: "Platt-scaled probability from raw score $z$." }
  ],
  derivation: [
    { do: "Group predictions into bins", result: "$b=1,\\ldots,B$", why: "exact probability values rarely repeat, so bins estimate local behavior" },
    { do: "Compute bin confidence", result: "$conf(b)=\\frac{1}{n_b}\\sum_{i\\in b}\\hat p_i$", why: "this is what the model promised for the bin" },
    { do: "Compute bin accuracy", result: "$acc(b)=\\frac{1}{n_b}\\sum_{i\\in b} y_i$", why: "this is what actually happened" },
    { do: "Take the absolute gap", result: "$|acc(b)-conf(b)|$", why: "overprediction and underprediction are both calibration errors" },
    { do: "Weight by bin size", result: "$ECE=\\sum_b\\frac{n_b}{n}|acc(b)-conf(b)|$", why: "large slices should count more than tiny ones" }
  ],
  worked: {
    problem: "A pCTR model has three calibration bins: 100 examples at confidence 0.02 with 1 click, 200 at 0.05 with 14 clicks, and 100 at 0.20 with 12 clicks. Compute ECE and explain the marketplace risk.",
    skills: ["ECE", "reliability", "rare-event reasoning"],
    strategy: "For each bin, compare what the model promised with what the labels delivered.",
    steps: [
      { do: "Compute bin 1 accuracy", result: "$acc_1=1/100=0.01$", why: "one positive out of 100 examples clicked" },
      { do: "Compute bin 1 contribution", result: "$(100/400)|0.01-0.02|=0.0025$", why: "the bin is one quarter of the data" },
      { do: "Compute bin 2 accuracy", result: "$acc_2=14/200=0.07$", why: "fourteen positives among 200 examples" },
      { do: "Compute bin 2 contribution", result: "$(200/400)|0.07-0.05|=0.0100$", why: "the model underpredicts this larger bin" },
      { do: "Compute bin 3 accuracy", result: "$acc_3=12/100=0.12$", why: "twelve positives among 100 examples" },
      { do: "Sum ECE", result: "$0.0025+0.0100+(100/400)|0.12-0.20|=0.0325$", why: "the high-score bin is heavily overconfident" }
    ],
    verify: "The largest gap is 0.08 in the high-confidence bin, exactly where bid multiplication can over-allocate traffic.",
    answer: "ECE is 0.0325; the model is overconfident at the top and would overvalue those impressions in an auction.",
    connects: "calibration turns response heads from ranking signals into trustworthy probabilities."
  },
  practice: [
    { problem: "A bin has 50 impressions, mean predicted pCTR 0.04, and 5 clicks. What is its calibration gap?", steps: [ { do: "Compute observed rate", result: "$acc=5/50=0.10$", why: "calibration compares prediction with frequency" }, { do: "Compute gap", result: "$|0.10-0.04|=0.06$", why: "the model underpredicts by six percentage points" } ], answer: "The bin's calibration gap is 0.06." },
    { problem: "Two bins have contributions 0.004 and 0.011 to ECE. What is total ECE?", steps: [ { do: "List contributions", result: "$0.004$ and $0.011$", why: "ECE is additive over bins" }, { do: "Sum them", result: "$0.004+0.011=0.015$", why: "weighted absolute gaps combine linearly" } ], answer: "Total ECE is 0.015." },
    { problem: "A raw score $z=1$ is Platt-scaled with $a=0.8$, $b=-2.0$. Compute the calibrated probability.", steps: [ { do: "Compute calibrated logit", result: "$0.8\\cdot1-2.0=-1.2$", why: "Platt scaling is a linear transform before sigmoid" }, { do: "Apply sigmoid", result: "$\\sigma(-1.2)=1/(1+e^{1.2})\\approx0.231$", why: "sigmoid maps logits to probabilities" } ], answer: "The calibrated probability is about 0.231." },
    { problem: "Why can class weighting improve rare-event learning but hurt raw calibration?", steps: [ { do: "Read the training effect", result: "positives receive larger effective weight", why: "the model sees rare positives more strongly" }, { do: "Read the probability effect", result: "the fitted intercept no longer matches the natural base rate", why: "weighted data are not the same distribution as serving data" } ], answer: "Class weighting can improve separation, but recalibrate on natural held-out data before using probabilities." },
    { problem: "A slice has only 20 examples and 1 positive. Why should its reliability point be treated carefully?", steps: [ { do: "Compute observed rate", result: "$1/20=0.05$", why: "the point estimate is simple" }, { do: "Assess variance", result: "one more positive would change the rate to $2/20=0.10$", why: "small denominators make calibration estimates noisy" } ], answer: "The observed rate is 0.05, but the slice is too small for a stable calibration conclusion." }
  ],
  applications: [
    { title: "Palette-driven pCTR marketplace value", background: "A calibrated pCTR is multiplied by bid, so overconfidence directly changes auction ranking and spend allocation.", numbers: "If predicted pCTR is 0.020 but observed is 0.012, a bid of 10 is valued at 0.200 instead of the empirical 0.120, an overestimate of 0.080 per impression opportunity." },
    { title: "Creator Marketplace sparse slices", background: "New creator categories can have few labeled outcomes, making raw response scores unstable without slice-level reliability checks.", numbers: "A niche slice with 8 positives in 400 examples has base rate 0.020; predicting 0.050 for the slice overstates expected replies by $400(0.05-0.02)=12$ replies." },
    { title: "Instream Ads video pVTR calibration", background: "Video view-through heads must mean the same thing across content categories, or rankers can favor poorly calibrated genres.", numbers: "A sports slice at predicted 0.30 with observed 0.29 is close; a finance slice at predicted 0.30 with observed 0.18 has a 0.12 gap." },
    { title: "Event Ads pAttend cold-start", background: "Attendance is rare, so a model can rank events well while overstating absolute attendance probabilities used for pacing.", numbers: "For 5,000 impressions, predicted pAttend 0.010 implies 50 attendees; observed rate 0.006 implies 30, a 20-attendee pacing miss." },
    { title: "Event Organic Feed SPR", background: "Session value estimates are combined across many posts, so calibration errors can accumulate over the slate.", numbers: "Ten posts each overpredicted by 0.003 expected sessions produce $10\\times0.003=0.030$ excess expected value for that slate." },
    { title: "Search Ads query relevance thresholds", background: "A calibrated relevance probability makes threshold choices interpretable across query slices.", numbers: "At threshold 0.80, a calibrated bin should be about 80% relevant; if observed relevance is 0.62, the filter is admitting 18 extra irrelevant results per 100." },
    { title: "Creative Intelligence lift estimates", background: "Creative recommendations often report expected lift, and teams trust those numbers only when reliability curves are sane.", numbers: "A predicted lift probability of 0.15 over 1,000 campaigns suggests 150 wins; if observed is 0.11, the estimate is high by 40 wins." }
  ],
  applicationsClose:
    "<p>Calibration is the quiet contract between modeling and decision-making. A score can rank well and still be unsafe as a probability; reliability diagrams, Platt scaling, isotonic maps, and sparse-slice discipline keep that contract honest.</p>",
  takeaways: [
    "Calibration means predicted probabilities match observed frequencies, not merely good ordering.",
    "ECE summarizes reliability gaps by bin, but sparse slices need uncertainty-aware interpretation.",
    "Class imbalance techniques help training; held-out calibration makes the resulting probabilities usable."
  ],
  resources: [
    { label: "scikit-learn — probability calibration", note: "Platt & isotonic with reliability curves" },
    { label: "imbalanced-learn", note: "resampling & class-weighting" }
  ],
  papers: [
    "On Calibration of Modern Neural Networks (Guo et al., 2017)",
    "Focal Loss for Dense Object Detection (Lin et al., 2017)",
    "Modeling Delayed Feedback in Display Advertising (Chapelle, 2014)"
  ],
  notebook: [
    { t: "md", src: "# M8 · Calibration & class imbalance\n\n_Curriculum · Domain 1 · Ranking & Recommenders_\n\n**Make predicted probabilities mean what downstream systems think they mean.**\n\nWe compute ECE, fit Platt scaling, and draw a reliability diagram for rare click-style labels. _Save a copy to your Drive (File -> Save a copy in Drive) to keep your edits._" },
    { t: "code", src: "# Setup - CPU-only and deterministic.\nimport numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import log_loss\n\nrng = np.random.default_rng(8)" },
    { t: "md", src: "## First, look at raw scores\n\nA model can be good at ranking but overconfident as a probability source. Calibration asks whether $\\Pr(Y=1\\mid \\hat p=p)=p$." },
    { t: "code", src: "n = 3000\nz = rng.normal(size=n)\nraw_p = 1.0 / (1.0 + np.exp(-(1.4 * z - 2.6)))\ntrue_p = 0.65 * raw_p\ny = (rng.random(n) < true_p).astype(int)\n\nprint(\"positive rate:\", round(y.mean(), 4))\nprint(\"mean raw probability:\", round(raw_p.mean(), 4))" },
    { t: "md", src: "## The calibration metric\n\nExpected calibration error bins predictions and computes\n\n$$ECE=\\sum_b \\frac{n_b}{n}|acc(b)-conf(b)|$$\n\nwhere `acc` is observed frequency and `conf` is average predicted probability." },
    { t: "md", src: "### Step 1 - Compute reliability bins\n\nWe bin by predicted probability, then compare mean prediction with observed click rate." },
    { t: "code", src: "bins = np.linspace(0.0, 1.0, 8)\nbin_id = np.digitize(raw_p, bins) - 1\nrows = []\nfor b in range(len(bins) - 1):\n    mask = bin_id == b\n    if mask.sum() > 0:\n        rows.append((b, mask.sum(), raw_p[mask].mean(), y[mask].mean()))\n\nreliability = pd.DataFrame(rows, columns=[\"bin\", \"n\", \"conf\", \"acc\"])\nreliability[\"gap\"] = (reliability[\"acc\"] - reliability[\"conf\"]).abs()\nece_raw = ((reliability[\"n\"] / n) * reliability[\"gap\"]).sum()\n\nprint(reliability.round(4))\nprint(\"raw ECE:\", round(ece_raw, 4))\n\nassert ece_raw > 0.01" },
    { t: "md", src: "### Step 2 - Fit Platt scaling\n\nPlatt scaling learns $\\sigma(a z+b)$ on held-out labels. Here we use the raw logit-like score `z`." },
    { t: "code", src: "cal = LogisticRegression()\ncal.fit(z.reshape(-1, 1), y)\ncal_p = cal.predict_proba(z.reshape(-1, 1))[:, 1]\n\nprint(\"raw log loss:\", round(log_loss(y, raw_p), 4))\nprint(\"cal log loss:\", round(log_loss(y, cal_p), 4))\n\nassert log_loss(y, cal_p) < log_loss(y, raw_p)" },
    { t: "md", src: "### Step 3 - Recompute ECE after calibration\n\nThe calibrated probabilities should be closer to observed frequencies." },
    { t: "code", src: "bin_id_cal = np.digitize(cal_p, bins) - 1\nrows_cal = []\nfor b in range(len(bins) - 1):\n    mask = bin_id_cal == b\n    if mask.sum() > 0:\n        rows_cal.append((b, mask.sum(), cal_p[mask].mean(), y[mask].mean()))\n\nrel_cal = pd.DataFrame(rows_cal, columns=[\"bin\", \"n\", \"conf\", \"acc\"])\nrel_cal[\"gap\"] = (rel_cal[\"acc\"] - rel_cal[\"conf\"]).abs()\nece_cal = ((rel_cal[\"n\"] / n) * rel_cal[\"gap\"]).sum()\n\nprint(\"cal ECE:\", round(ece_cal, 4))\n\nassert ece_cal < ece_raw" },
    { t: "md", src: "## Visualize reliability\n\nPerfect calibration sits on the diagonal. Points below the line mean overprediction." },
    { t: "code", src: "fig, ax = plt.subplots(figsize=(4, 4))\nax.plot([0, 1], [0, 1], color=\"black\", linewidth=1)\nax.scatter(reliability[\"conf\"], reliability[\"acc\"], label=\"raw\")\nax.scatter(rel_cal[\"conf\"], rel_cal[\"acc\"], label=\"Platt\")\nax.set_xlabel(\"mean predicted probability\")\nax.set_ylabel(\"observed frequency\")\nax.set_title(\"reliability diagram\")\nax.legend()\nplt.show()" },
    { t: "md", src: "## Practice\n\nTry each in the empty cell below it.\n\n1. Change the number of bins to 12 and compare ECE stability.\n2. Simulate underconfidence by setting `true_p = 1.3 * raw_p` clipped to 1.\n3. Print the learned Platt coefficient and intercept." },
    { t: "code", src: "# Your turn:\n" }
  ]
};

const M9 = {
  m: 9, domain: 1,
  title: "Cold-start / warm-start / transfer & distillation",
  tagline: "Move safely from priors and content features to learned personalization, with explicit handoff criteria.",
  skipIf: "design a cold→warm handoff with explicit exit criteria.",
  mapsTo: ["all"],
  connections: {
    buildsOn: ["content features", "calibrated probabilities", "retrieval and ranking funnels"],
    leadsTo: ["hybrid recommenders", "teacher-student compression", "online ramp strategies"],
    usedWith: ["Bayesian priors", "confidence weights", "distillation losses"]
  },
  motivation:
    "<p>Cold-start is not a corner case; it is the first day of every new event, creator, creative, campaign, query, and member journey. The system must make a useful decision before it has enough direct interactions. Waiting for perfect data would starve new supply; trusting noisy early clicks would overreact.</p>" +
    "<p>The practical pattern is a controlled handoff. Start with priors, popularity, and content-transfer scores. As exposure accumulates, blend toward the warm model with a confidence weight such as $w=\\frac{n}{n+k}$. Distillation adds another handoff: a large teacher transfers dark knowledge to a smaller student by matching soft probabilities, not just hard labels.</p>",
  definition:
    "<p><b>Definition.</b> Cold-start recommendation uses fallback signals when direct interaction data for a user or item are insufficient. A common blended score is $$S(n)=\\left(1-w(n)\\right)S_{cold}+w(n)S_{warm},\\quad w(n)=\\frac{n}{n+k},$$ where $n$ is evidence count and $k$ controls how slowly the system trusts warm estimates. Transfer learning initializes or augments $S_{cold}$ from related tasks; distillation trains a student distribution $q_s$ to match a teacher $q_t$ using a loss such as $-\\sum_i q_t(i)\\log q_s(i)$.</p>" +
    "<p><b>Assumptions that matter:</b> exit criteria must be written before launch; impressions count only when exposure is comparable; warm labels can be delayed; and the cold model should be monitored separately so it does not hide under aggregate metrics.</p>",
  symbols: [
    { sym: "$S_{cold}$", desc: "score from priors, content, popularity, or transferred models." },
    { sym: "$S_{warm}$", desc: "score from direct interactions once enough data exist." },
    { sym: "$n$", desc: "evidence count such as eligible impressions or interactions." },
    { sym: "$k$", desc: "pseudo-count controlling the cold-to-warm transition speed." },
    { sym: "$q_t, q_s$", desc: "teacher and student probability distributions in distillation." }
  ],
  derivation: [
    { do: "Start with a cold score", result: "$S(0)=S_{cold}$", why: "with no evidence, direct-interaction estimates are unavailable or too noisy" },
    { do: "Define confidence", result: "$w(n)=\\frac{n}{n+k}$", why: "confidence grows with evidence and is moderated by a pseudo-count" },
    { do: "Check the zero-evidence limit", result: "$w(0)=0$", why: "the blended score equals the cold score at launch" },
    { do: "Check the large-evidence limit", result: "$\\lim_{n\\to\\infty}w(n)=1$", why: "the warm model dominates once enough observations accumulate" },
    { do: "Write an exit rule", result: "handoff when $n\\ge n_0$ and uncertainty is below a threshold", why: "production systems need explicit, auditable transition criteria" }
  ],
  worked: {
    problem: "An Event Ads campaign has a cold content prior $S_{cold}=0.012$ pAttend and an early warm estimate $S_{warm}=0.030$ after $n=400$ impressions. Use $k=600$ to blend and decide whether to fully warm-start if the exit rule is $n\\ge1000$ impressions and at least 30 attendances.",
    skills: ["confidence blending", "exit criteria", "cold-start pacing"],
    strategy: "Compute the confidence weight first, then evaluate the handoff rule separately from the score.",
    steps: [
      { do: "Compute confidence weight", result: "$w=400/(400+600)=0.40$", why: "400 impressions provide some evidence but not full trust" },
      { do: "Weight the cold score", result: "$(1-0.40)\\cdot0.012=0.0072$", why: "the cold model still carries 60% of the score" },
      { do: "Weight the warm score", result: "$0.40\\cdot0.030=0.0120$", why: "the warm estimate receives 40% influence" },
      { do: "Add the pieces", result: "$S=0.0072+0.0120=0.0192$", why: "the blended pAttend sits between prior and early estimate" },
      { do: "Check impression exit", result: "$400<1000$", why: "the campaign has not reached the exposure threshold" },
      { do: "Estimate attendances", result: "$400\\cdot0.030=12$", why: "even the warm estimate implies fewer than 30 attendances" }
    ],
    verify: "The blended score is closer to the cold prior than the warm estimate, which matches a 40% confidence weight.",
    answer: "Use blended pAttend 0.0192 and do not fully warm-start yet; both exit criteria fail.",
    connects: "cold-start design is a scoring rule plus a handoff policy, not just a fallback model."
  },
  practice: [
    { problem: "With $S_{cold}=0.04$, $S_{warm}=0.10$, $n=200$, and $k=800$, compute the blended score.", steps: [ { do: "Compute confidence", result: "$w=200/(200+800)=0.20$", why: "the pseudo-count keeps early evidence modest" }, { do: "Blend", result: "$0.8\\cdot0.04+0.2\\cdot0.10=0.052$", why: "cold score still carries most of the weight" } ], answer: "The blended score is 0.052." },
    { problem: "At what $n$ does $w=n/(n+500)$ reach 0.80?", steps: [ { do: "Set the equation", result: "$n/(n+500)=0.80$", why: "we solve for the evidence count that gives 80% warm trust" }, { do: "Multiply both sides", result: "$n=0.8n+400$", why: "clear the denominator" }, { do: "Isolate $n$", result: "$0.2n=400$, so $n=2000$", why: "subtract $0.8n$ from both sides" } ], answer: "$n=2000$ impressions." },
    { problem: "A new creator has no campaign history but has rich profile text and past organic engagement. Name two cold-start features.", steps: [ { do: "Use content", result: "profile topics, industries, language, and creative style", why: "content exists before marketplace interactions" }, { do: "Use prior engagement", result: "organic follower and engagement rates", why: "related behavior transfers signal into the cold task" } ], answer: "Use content embeddings and organic-engagement priors, then blend with marketplace outcomes later." },
    { problem: "A teacher distribution over three items is [0.7, 0.2, 0.1], while the hard label is item 1. Why can distillation be richer than hard-label training?", steps: [ { do: "Read the hard label", result: "only item 1 is marked correct", why: "hard labels discard similarity among alternatives" }, { do: "Read teacher probabilities", result: "item 2 gets 0.2 and item 3 gets 0.1", why: "the teacher communicates that item 2 is a plausible runner-up" } ], answer: "Distillation transfers relative preferences, not only the winning label." },
    { problem: "An exit rule requires 5,000 impressions and a 95% confidence interval width below 0.01. A campaign has 6,000 impressions but width 0.018. What happens?", steps: [ { do: "Check exposure", result: "$6000\\ge5000$", why: "the first criterion passes" }, { do: "Check uncertainty", result: "$0.018>0.01$", why: "the estimate is still too noisy" } ], answer: "Do not fully hand off yet; the uncertainty criterion fails." }
  ],
  applications: [
    { title: "Event Ads pacing cold-start", background: "New events need delivery before the pAttend model has reliable event-specific outcomes, so pacing starts from priors and moves to warm estimates.", numbers: "With prior 0.008, warm 0.020, $n=500$, $k=1500$, the blend is $0.75\\cdot0.008+0.25\\cdot0.020=0.011$." },
    { title: "Creator Marketplace AI new creators", background: "A creator with no marketplace campaigns can still be represented by profile topics, audience, and organic content signals.", numbers: "If content score is 0.62 and warm marketplace score is 0.80 after $n=50$ with $k=150$, blend weight is 0.25 and score is $0.75(0.62)+0.25(0.80)=0.665$." },
    { title: "Creative Intelligence new assets", background: "A fresh creative has no fatigue or lift history, so visual/text embeddings and campaign priors carry the first decisions.", numbers: "A new creative prior lift 0.03 blended with early lift 0.09 at $w=0.10$ gives $0.9(0.03)+0.1(0.09)=0.036$." },
    { title: "Search Ads new queries", background: "Rare or new queries can transfer from semantic query embeddings and neighboring known queries before click logs accumulate.", numbers: "A query cluster CTR of 0.018 and exact-query CTR of 0.030 with $w=0.2$ yields $0.8(0.018)+0.2(0.030)=0.0204$." },
    { title: "Instream Ads new video inventory", background: "New organic videos can use content classification and creator priors until enough view-through outcomes arrive.", numbers: "If content pVTR is 0.24 and early measured pVTR is 0.30 after 100 impressions with $k=900$, the blend is $0.9(0.24)+0.1(0.30)=0.246$." },
    { title: "Event Organic Feed SPR new posts", background: "New event posts need Feed exposure before SPR labels exist, so organizer reputation and text relevance act as transfer signals.", numbers: "Organizer prior 0.05 and post early score 0.08 with $n=300$, $k=700$ blend to $0.7(0.05)+0.3(0.08)=0.059$." },
    { title: "Distilling a large ranker", background: "A large cross-feature teacher can teach a smaller online student to approximate ranking behavior under latency constraints.", numbers: "For teacher [0.6,0.3,0.1] and student [0.5,0.4,0.1], distillation loss is $-[0.6\\log0.5+0.3\\log0.4+0.1\\log0.1]\\approx0.898$." }
  ],
  applicationsClose:
    "<p>Cold-start work is disciplined humility: use what you know, quantify when you know enough, and move from priors to personalization without surprising pacing, ranking, or marketplace systems.</p>",
  takeaways: [
    "Cold-start systems need content, priors, popularity, or transfer because direct interactions are missing or too noisy.",
    "Confidence weights such as $n/(n+k)$ make the cold-to-warm transition gradual and auditable.",
    "Exit criteria should include exposure and uncertainty, not just elapsed time.",
    "Distillation transfers a teacher's soft ranking knowledge into a smaller student."
  ],
  resources: [
    { label: "Eugene Yan — recsys writing", note: "practical cold-start patterns" },
    { label: "Microsoft Recommenders", note: "content + hybrid cold-start baselines" }
  ],
  papers: [
    "Distilling the Knowledge in a Neural Network (Hinton et al., 2015)"
  ],
  notebook: [
    { t: "md", src: "# M9 · Cold-start, warm-start, transfer & distillation\n\n_Curriculum · Domain 1 · Ranking & Recommenders_\n\n**Move safely from priors to learned personalization.**\n\nWe blend a cold prior with a warm estimate using an evidence-based confidence weight. _Save a copy to your Drive (File -> Save a copy in Drive) to keep your edits._" },
    { t: "code", src: "# Setup - CPU-only and deterministic.\nimport numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\nrng = np.random.default_rng(9)" },
    { t: "md", src: "## First, look at cold and warm scores\n\nA cold-start item begins with priors and content features. As evidence count $n$ grows, the blended score moves toward the warm estimate." },
    { t: "code", src: "events = pd.DataFrame({\"event\": [\"A\", \"B\", \"C\"], \"cold\": [0.010, 0.016, 0.012], \"warm\": [0.026, 0.020, 0.018], \"impressions\": [100, 800, 2500], \"attends\": [1, 14, 55]})\n\nprint(events)" },
    { t: "md", src: "## The handoff formula\n\nWe use\n\n$$S(n)=(1-w)S_{cold}+wS_{warm},\\quad w=\\frac{n}{n+k}$$\n\nwhere $k$ is a pseudo-count that controls how fast trust moves to the warm model." },
    { t: "md", src: "### Step 1 - Compute confidence weights\n\nHigher impression counts receive larger warm-model weight." },
    { t: "code", src: "k = 1000\nevents[\"w\"] = events[\"impressions\"] / (events[\"impressions\"] + k)\n\nprint(events[[\"event\", \"impressions\", \"w\"]].round(3))\n\nassert events.loc[2, \"w\"] > events.loc[0, \"w\"]" },
    { t: "md", src: "### Step 2 - Blend cold and warm scores\n\nThe blended score stays between the cold and warm estimates." },
    { t: "code", src: "events[\"blend\"] = (1.0 - events[\"w\"]) * events[\"cold\"] + events[\"w\"] * events[\"warm\"]\n\nprint(events[[\"event\", \"cold\", \"warm\", \"blend\"]].round(4))\n\nassert np.all(events[\"blend\"] >= np.minimum(events[\"cold\"], events[\"warm\"]))\nassert np.all(events[\"blend\"] <= np.maximum(events[\"cold\"], events[\"warm\"]))" },
    { t: "md", src: "### Step 3 - Apply explicit exit criteria\n\nA campaign exits cold-start only when it has enough exposure and enough outcomes." },
    { t: "code", src: "min_impressions = 1000\nmin_attends = 30\nevents[\"warm_ready\"] = (events[\"impressions\"] >= min_impressions) & (events[\"attends\"] >= min_attends)\n\nprint(events[[\"event\", \"impressions\", \"attends\", \"warm_ready\"]])\n\nassert events.loc[2, \"warm_ready\"] == True" },
    { t: "md", src: "## Visualize the handoff curve\n\nThe confidence weight rises smoothly with evidence instead of flipping abruptly." },
    { t: "code", src: "n_grid = np.arange(0, 5001, 100)\nw_grid = n_grid / (n_grid + k)\nfig, ax = plt.subplots(figsize=(5, 3))\nax.plot(n_grid, w_grid)\nax.set_xlabel(\"impressions n\")\nax.set_ylabel(\"warm weight\")\nax.set_title(\"cold-to-warm handoff\")\nplt.show()" },
    { t: "md", src: "## Practice\n\nTry each in the empty cell below it.\n\n1. Change `k` to 3000 and see how the handoff slows.\n2. Add a new event with 0 impressions and verify its blend equals the cold score.\n3. Replace the exit criteria with a confidence-weight threshold of 0.7." },
    { t: "code", src: "# Your turn:\n" }
  ]
};

const M10 = {
  m: 10, domain: 1,
  title: "Learning with sparse & implicit labels (recsys)",
  tagline: "Train recommenders from clicks, views, and skips without pretending missing feedback is the same as dislike.",
  skipIf: "train a recsys model on implicit feedback with principled negatives + debiasing.",
  mapsTo: ["Creator Marketplace AI"],
  connections: {
    buildsOn: ["recommender retrieval", "ranking losses", "class imbalance"],
    leadsTo: ["two-tower training", "debiasing", "PU learning"],
    usedWith: ["negative sampling", "in-batch softmax", "inverse propensity weighting"]
  },
  motivation:
    "<p>Most recommender labels are implicit. A click, view, save, reply, or registration is a positive hint; absence is ambiguous. The member may dislike the item, but they also may never have seen it, may have seen it in a poor position, or may convert later. Treating every missing pair as a true negative floods training with false certainty.</p>" +
    "<p>The job is to learn from positives while constructing negatives honestly. Uniform negatives teach broad separation; popularity and in-batch negatives are efficient but biased; hard negatives sharpen the boundary. Debiasing methods such as IPS correct exposure effects, and sampling-bias corrections adjust losses so $p(i\\mid u)$ is not mostly a mirror of the sampler.</p>",
  definition:
    "<p><b>Definition.</b> Implicit-feedback recommendation learns from observed positive events $y_{ui}=1$ and unobserved pairs whose label is unknown, not necessarily $0$. Pairwise BPR maximizes $\\log\\sigma(s(u,i^+)-s(u,i^-))$ for sampled negatives. In-batch softmax for one positive item is $$\\ell_u=-\\log\\frac{\\exp(s(u,i^+)-\\log q(i^+))}{\\sum_{j\\in B}\\exp(s(u,j)-\\log q(j))},$$ where $q(j)$ is a sampling or popularity probability used for correction.</p>" +
    "<p><b>Assumptions that matter:</b> exposure is biased by previous rankers; position affects clicks; missing labels are a mixture of unexposed, ignored, and delayed outcomes; and negative sampling changes the training distribution unless corrected or evaluated carefully.</p>",
  symbols: [
    { sym: "$i^+$", desc: "an observed positive item for a user or context." },
    { sym: "$i^-$", desc: "a sampled negative or less-preferred item." },
    { sym: "$s(u,i)$", desc: "model score for user/context $u$ and item $i$." },
    { sym: "$q(i)$", desc: "probability that item $i$ is sampled as a negative or appears in the batch." },
    { sym: "$\\frac{1}{\\pi}$", desc: "inverse propensity weight for correcting exposure probability $\\pi$." }
  ],
  derivation: [
    { do: "Start from a positive", result: "observe $(u,i^+)$", why: "implicit logs tell us what happened, not every item the user rejected" },
    { do: "Sample comparison items", result: "$i^-\\sim q(i)$", why: "we need tractable negatives from a huge catalog" },
    { do: "Compute a margin", result: "$\\Delta=s(u,i^+)-s(u,i^-)$", why: "the model should rank the observed positive above sampled alternatives" },
    { do: "Use BPR loss", result: "$-\\log\\sigma(\\Delta)$", why: "larger positive margins reduce pairwise loss" },
    { do: "Correct popular negatives", result: "replace $s(u,j)$ by $s(u,j)-\\log q(j)$", why: "items sampled often should not receive unfair extra probability mass" },
    { do: "Correct exposure bias", result: "weight observed labels by $1/\\pi_{ui}$ when propensities are known", why: "rarely exposed examples represent more counterfactual mass" }
  ],
  worked: {
    problem: "A Creator Marketplace two-tower batch has one brief with positive creator P and two in-batch negatives N1 and N2. Raw scores are $[3.0,2.0,1.0]$ and sampling probabilities are $q=[0.10,0.50,0.05]$. Compute the positive log-prob before and after popularity correction.",
    skills: ["in-batch softmax", "sampling correction", "implicit negatives"],
    strategy: "Compute the ordinary softmax first, then subtract $\\log q$ from each logit and recompute.",
    steps: [
      { do: "Exponentiate raw scores", result: "$[e^3,e^2,e^1]\\approx[20.09,7.39,2.72]$", why: "softmax converts logits to positive weights" },
      { do: "Compute raw denominator", result: "$20.09+7.39+2.72=30.20$", why: "all batch items compete for probability mass" },
      { do: "Compute raw positive probability", result: "$20.09/30.20\\approx0.665$", why: "the positive has the highest raw score" },
      { do: "Compute corrected logits", result: "$[3-\\log0.10,2-\\log0.50,1-\\log0.05]\\approx[5.303,2.693,3.996]$", why: "popular sampled items are discounted by their sampling probability" },
      { do: "Exponentiate corrected logits", result: "$[200.86,14.78,54.37]$", why: "correction changes the competition scale" },
      { do: "Compute corrected positive probability", result: "$200.86/(200.86+14.78+54.37)\\approx0.744$", why: "the positive was not sampled as frequently as N1, so correction helps it" }
    ],
    verify: "The corrected probability is higher than raw because the positive's $q=0.10$ is much lower than popular negative N1's $q=0.50$.",
    answer: "Raw positive probability is about 0.665; popularity-corrected probability is about 0.744.",
    connects: "implicit-feedback training is as much about the sampler and bias correction as it is about the model."
  },
  practice: [
    { problem: "For BPR, a positive score is 2.4 and a negative score is 1.1. Compute the loss.", steps: [ { do: "Compute margin", result: "$\\Delta=2.4-1.1=1.3$", why: "positive should exceed negative" }, { do: "Apply sigmoid", result: "$\\sigma(1.3)\\approx0.786$", why: "the model assigns high probability to the correct order" }, { do: "Take negative log", result: "$-\\log0.786\\approx0.241$", why: "good margins yield small loss" } ], answer: "The BPR loss is about 0.241." },
    { problem: "A missing creator-brief pair has no click. Why is it unsafe to label it as a definite negative?", steps: [ { do: "Check exposure", result: "the pair may never have been shown", why: "unseen items cannot express preference" }, { do: "Check delay", result: "a reply or conversion may arrive later", why: "implicit outcomes are often delayed" } ], answer: "Missing means unknown, not necessarily negative; sample negatives with exposure and delay in mind." },
    { problem: "An impression at position 1 has propensity 0.8 and position 5 has propensity 0.2. What IPS weights do they receive?", steps: [ { do: "Weight position 1", result: "$1/0.8=1.25$", why: "frequently exposed positions need less correction" }, { do: "Weight position 5", result: "$1/0.2=5.0$", why: "rarely exposed positions represent more counterfactual mass" } ], answer: "The IPS weights are 1.25 and 5.0." },
    { problem: "A negative sampler draws item A with $q=0.40$ and item B with $q=0.05$. Which receives the larger $-\\log q$ correction?", steps: [ { do: "Compute A correction", result: "$-\\log0.40\\approx0.916$", why: "popular items receive a smaller correction" }, { do: "Compute B correction", result: "$-\\log0.05\\approx2.996$", why: "rarely sampled items receive a larger correction" } ], answer: "Item B receives the larger correction." },
    { problem: "Name one advantage and one risk of hard-negative mining.", steps: [ { do: "State advantage", result: "hard negatives teach fine distinctions near the decision boundary", why: "easy negatives already have low scores" }, { do: "State risk", result: "false negatives can be over-sampled", why: "a high-scoring unclicked item may actually be relevant but unobserved" } ], answer: "Hard negatives sharpen ranking, but they need safeguards against false negatives and exposure bias." }
  ],
  applications: [
    { title: "Creator Marketplace AI implicit matches", background: "Brief-creator replies, saves, and outreach are positive implicit signals; uncontacted creators are unknown, not automatic negatives.", numbers: "If a batch has 1 positive and 127 in-batch negatives, the softmax denominator has 128 items; a positive logit advantage of 3 over all negatives gives probability $e^3/(e^3+127)\\approx0.137$." },
    { title: "Instream Ads organic-video relevance", background: "A view or completion is implicit feedback, while missing views are entangled with whether the video was shown and where it appeared.", numbers: "A completion at propensity 0.25 gets IPS weight 4; the same completion at propensity 0.80 gets 1.25, so low-exposure evidence counts 3.2 times as much." },
    { title: "Event Ads delayed feedback", background: "Registrations and attendance can arrive after the impression, so premature negatives bias pAttend training.", numbers: "If 100 registrations arrive within one day and 30 more arrive by day seven, labeling at day one misses $30/130\\approx23\\%$ of positives." },
    { title: "Event Organic discovery in Feed SPR", background: "Feed impressions create position bias: lower-ranked event posts are less likely to be seen even if relevant.", numbers: "With position propensities 0.9 and 0.3, IPS weights are 1.11 and 3.33; the lower-position click receives 3 times the correction." },
    { title: "Search Ads query relevance negatives", background: "Uniform negatives teach broad irrelevance, while hard negatives from semantically close ads teach query-specific distinctions.", numbers: "For 1M ads, uniform sampling may pick a same-industry hard negative at 1%; hard-negative mining can raise that to 40%, a 40x enrichment." },
    { title: "Creative Intelligence engagement logs", background: "Creative saves and comparisons are positive hints, but unviewed creatives should not be treated like rejected creatives.", numbers: "If only 20% of creatives are exposed, then 80% missing labels are mostly unknown; treating all as negatives creates a 4:1 unknown-to-exposed imbalance." },
    { title: "Palette-driven pCTR selection bias", background: "The palette features seen in logs are shaped by previous rankers, so training data overrepresents old winners.", numbers: "If blue creatives were shown 70% of the time but are only 40% of eligible supply, uncorrected training overweights blue by $70/40=1.75\\times$." }
  ],
  applicationsClose:
    "<p>Implicit-feedback recommenders succeed when the team respects what the log can and cannot say. Positives are valuable, missingness is ambiguous, negatives are designed, and debiasing keeps yesterday's ranker from becoming tomorrow's truth.</p>",
  takeaways: [
    "Implicit positives are observed preference hints; missing pairs are unknown unless exposure and timing make them interpretable.",
    "Negative sampling strategy changes what the model learns, so uniform, popularity, in-batch, and hard negatives each need care.",
    "Sampling correction and IPS debiasing prevent the model from simply copying popularity, position, or selection bias."
  ],
  resources: [
    { label: "implicit (library) docs", note: "ALS/BPR on implicit feedback" },
    { label: "BPR paper (Rendle et al.)", note: "pairwise objective for implicit data" }
  ],
  papers: [
    "BPR: Bayesian Personalized Ranking (Rendle et al., 2009)",
    "Sampling-Bias-Corrected Neural Two-Tower (Yi et al., 2019)",
    "PU-Learning survey (Bekker & Davis, 2020)",
    "Modeling Delayed Feedback in Display Advertising (Chapelle, 2014)"
  ],
  notebook: [
    { t: "md", src: "# M10 · Learning with sparse & implicit labels\n\n_Curriculum · Domain 1 · Ranking & Recommenders_\n\n**Train from clicks and views without pretending missing means dislike.**\n\nWe build an in-batch softmax, apply popularity correction, and compare BPR margins. _Save a copy to your Drive (File -> Save a copy in Drive) to keep your edits._" },
    { t: "code", src: "# Setup - CPU-only and deterministic.\nimport numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\nrng = np.random.default_rng(10)" },
    { t: "md", src: "## First, look at implicit feedback\n\nObserved clicks are positives. Unobserved pairs may be unexposed, ignored, or delayed. Pairwise training uses $\\log\\sigma(s(u,i^+)-s(u,i^-))$." },
    { t: "code", src: "items = [\"positive\", \"popular_neg\", \"rare_neg\", \"hard_neg\"]\nscores = np.array([3.0, 2.0, 1.0, 2.6])\nq = np.array([0.10, 0.50, 0.05, 0.20])\ndf = pd.DataFrame({\"item\": items, \"score\": scores, \"sample_q\": q})\n\nprint(df)" },
    { t: "md", src: "## The in-batch softmax\n\nFor one positive, the raw loss is\n\n$$\\ell=-\\log\\frac{\\exp(s^+)}{\\sum_j \\exp(s_j)}$$\n\nSampling correction subtracts $\\log q(j)$ from each score." },
    { t: "md", src: "### Step 1 - Compute raw positive probability\n\nEvery item in the batch competes for probability mass." },
    { t: "code", src: "exp_scores = np.exp(scores)\nraw_prob = exp_scores[0] / exp_scores.sum()\nraw_loss = -np.log(raw_prob)\n\nprint(\"raw positive probability:\", round(raw_prob, 4))\nprint(\"raw loss:\", round(raw_loss, 4))\n\nassert raw_prob > 0.4" },
    { t: "md", src: "### Step 2 - Apply popularity correction\n\nSubtracting $\\log q$ reduces the advantage of frequently sampled negatives." },
    { t: "code", src: "corrected_scores = scores - np.log(q)\nexp_corrected = np.exp(corrected_scores)\ncorr_prob = exp_corrected[0] / exp_corrected.sum()\ncorr_loss = -np.log(corr_prob)\n\nprint(pd.DataFrame({\"item\": items, \"corrected_score\": corrected_scores}).round(3))\nprint(\"corrected probability:\", round(corr_prob, 4))\n\nassert corr_prob != raw_prob" },
    { t: "md", src: "### Step 3 - Compute BPR loss against a hard negative\n\nA hard negative has a high score, so the margin is small and the loss is larger." },
    { t: "code", src: "margin = scores[0] - scores[3]\nbpr_prob = 1.0 / (1.0 + np.exp(-margin))\nbpr_loss = -np.log(bpr_prob)\n\nprint(\"margin:\", round(margin, 3))\nprint(\"BPR loss:\", round(bpr_loss, 3))\n\nassert bpr_loss > 0.5" },
    { t: "md", src: "## Visualize raw vs corrected logits\n\nThe correction changes which negatives are most competitive, because the sampler is part of the training distribution." },
    { t: "code", src: "x = np.arange(len(items))\nfig, ax = plt.subplots(figsize=(6, 3))\nax.bar(x - 0.18, scores, width=0.36, label=\"raw\")\nax.bar(x + 0.18, corrected_scores, width=0.36, label=\"corrected\")\nax.set_xticks(x)\nax.set_xticklabels(items, rotation=20)\nax.set_ylabel(\"logit\")\nax.set_title(\"sampling correction\")\nax.legend()\nplt.show()" },
    { t: "md", src: "## Practice\n\nTry each in the empty cell below it.\n\n1. Change `sample_q` for `popular_neg` from 0.50 to 0.80 and recompute.\n2. Add another hard negative with score 2.9 and observe BPR loss.\n3. Compute IPS weights for propensities 0.9, 0.5, and 0.2." },
    { t: "code", src: "# Your turn:\n" }
  ]
};

module.exports = [M6, M7, M8, M9, M10];
