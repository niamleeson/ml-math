/* Mock ML-engineering "lab" scenarios. Merged into window.SIMULATIONS by application id.
   { title, icon, goal, stages:[ { phase, icon, title, narrative(HTML), concepts:[lessonIds],
     steps:[ {type:"decide", prompt, options:[{label, feedback, best?}]} | {type:"run", label, prompt?, result:{log?, metrics?:[{k,v}], note?}} ] } ] } */
window.SIMULATIONS = Object.assign(window.SIMULATIONS || {}, {
  "recommender-systems": {
    title: "Recommender Systems",
    icon: "🎬",
    goal: "Pick which movies to put on a user's home row — and learn what they'll watch next from what people like them watched.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Frame the problem",
        narrative: `<p>You run the home page of a streaming app. Only ~$5\\%$ of titles a user sees ever get clicked. The job is to <i>order</i> titles so the best ones land on top, not to predict an exact star rating.</p>`,
        concepts: ["cls-recommender", "ml-classification-metrics", "ml-supervised"],
        steps: [{
          type: "decide", prompt: "What objective best fits a home-page recommender?",
          options: [
            { label: "Minimize rating prediction error (RMSE) on a 1–5 star scale", feedback: "users barely rate anything, and a low RMSE doesn't mean good ordering. You ship a ranked list, so optimize ranking — not star accuracy." },
            { label: "Rank titles so the ones a user will actually play sit at the top (high recall in the top-K)", best: true, feedback: "exactly. The product is the ordered row, so top-K ranking quality is what matters — you'll measure it with recall@K and NDCG." },
            { label: "Show the globally most popular titles to everyone", feedback: "a fine cold-start fallback, but it ignores personal taste and buries the long tail that keeps people subscribed." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather the data",
        narrative: `<p>You need signals of what users like. Explicit star ratings are rare; implicit signals (plays, watch-time) are everywhere but noisier.</p>`,
        concepts: ["ml-supervised", "cls-recommender", "prob-bernoulli-binomial"],
        steps: [
          { type: "decide", prompt: "What feedback should you train on?",
            options: [
              { label: "Implicit signals: completed plays and watch-time, with un-watched titles as weak negatives", best: true, feedback: "implicit feedback is abundant and reflects real behavior. Treat a finished play as a strong positive and downweight the huge pile of un-clicked items as soft negatives." },
              { label: "Only the explicit 1–5 star ratings users typed in", feedback: "fewer than 2% of impressions get a rating, and raters are a biased, vocal minority. Too sparse to rank the catalog." },
              { label: "Treat every title a user did NOT click as a hard negative", feedback: "users never SAW most of the catalog, so 'not clicked' mostly means 'never shown' — labeling all of it negative poisons the model." }
            ] },
          { type: "run", label: "▶ Pull 90 days of interactions", prompt: "Assemble the user-item interaction matrix.",
            result: { log: "querying playback events...\nusers: 2,400,000   items: 38,000\ninteractions: 410,000,000 plays\nmatrix density: 0.45%  (99.55% empty)\nimplicit positives: completed plays >70% runtime", metrics: [{ k: "users", v: "2.4M" }, { k: "items", v: "38K" }, { k: "density", v: "0.45%" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore the matrix",
        narrative: `<p>Before modeling, understand the shape of demand. Recommender data is brutally skewed: a few blockbusters soak up most plays, and most titles get almost none.</p>`,
        concepts: ["prob-variance", "cls-recommender", "mlx-error-analysis"],
        steps: [
          { type: "run", label: "▶ Profile popularity & users", result: { log: "play distribution: top 1% of titles -> 62% of all plays (long tail)\nmedian plays per user: 23   median ratings per item: 4\nnew users last 7d: 180,000  (0 history each -> cold start)\nnew titles last 30d: 1,200  (no plays yet)", metrics: [{ k: "tail skew", v: "top 1% = 62%" }, { k: "cold users/wk", v: "180K" }] } },
          { type: "decide", prompt: "The popularity curve is extremely skewed. What's the modeling risk?",
            options: [
              { label: "The model just learns to recommend blockbusters to everyone (popularity bias)", best: true, feedback: "right. Without care, it collapses toward global popularity and never surfaces the personalized long tail — the whole reason to personalize." },
              { label: "No risk — popular titles are popular for a reason", feedback: "popularity is a useful prior, but if that's all you predict you've built a top-charts page, not a recommender." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Latent factors",
        narrative: `<p>Raw IDs don't generalize. Matrix factorization learns a short vector for each user and each item so that their dot product $\\hat{r}_{ui}=\\mathbf{p}_u^\\top \\mathbf{q}_i$ predicts affinity.</p>`,
        concepts: ["la-svd", "ml-pca", "fnd-dot"],
        steps: [{
          type: "decide", prompt: "How big should the latent factor dimension $k$ be?",
          options: [
            { label: "Small (k≈64): low-rank embeddings that capture broad taste with regularization", best: true, feedback: "a compact rank captures genres/moods and generalizes on sparse data. SVD-style factorization compresses 38K items into ~64 reusable dimensions." },
            { label: "Huge (k≈5,000): one dimension is nearly one item", feedback: "that barely compresses anything, overfits the 0.45%-dense matrix, and blows up serving cost. Low rank is the point." },
            { label: "k=1: a single 'goodness' score per item", feedback: "rank-1 collapses to global popularity again — no room to encode that you like sci-fi but not rom-coms." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick a model",
        narrative: `<p>You have a sparse implicit-feedback matrix and need fast top-K retrieval over 38K items. What's the right first model?</p>`,
        concepts: ["cls-recommender", "cls-factor-analysis", "ml-linear-regression"],
        steps: [{
          type: "decide", prompt: "Choose a first recommender model.",
          options: [
            { label: "Matrix factorization (ALS / implicit-feedback MF) with a popularity fallback for cold start", best: true, feedback: "MF is the workhorse: it learns latent user/item vectors, serves top-K by fast vector search, and you bolt on popularity for users/items with no history." },
            { label: "A giant deep network over raw user+item IDs from day one", feedback: "premature. MF is a strong, cheap baseline; reach for deep models only once it plateaus and you have side features to feed them." },
            { label: "k-nearest-neighbors over the raw 38K-wide rows", feedback: "exact neighbor search on a 99.55%-empty matrix is slow and noisy. Factorize first, then neighbor in the dense latent space if you want." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train the factors",
        narrative: `<p>Fit user and item vectors by minimizing reconstruction error with an $\\ell_2$ penalty $\\lambda(\\lVert\\mathbf{p}_u\\rVert^2+\\lVert\\mathbf{q}_i\\rVert^2)$ so factors don't overfit the sparse entries.</p>`,
        concepts: ["ml-gradient-descent", "ml-regularization", "la-svd"],
        steps: [{
          type: "run", label: "▶ Train ALS (k=64, λ=0.05)",
          result: { log: "alternating least squares, 38M positive interactions...\nepoch 1  train loss 0.214  val recall@10 0.118\nepoch 5  train loss 0.092  val recall@10 0.171\nepoch 12 train loss 0.061  val recall@10 0.188  (val plateaued)\nbest epoch: 12   factors: users 2.4M x 64, items 38K x 64", metrics: [{ k: "val recall@10", v: "0.188" }, { k: "k", v: "64" }] } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Offline metrics",
        narrative: `<p>Evaluate ranking, not rating. Use a time-split holdout and report recall@K plus NDCG@K, which rewards putting the right title <i>near the top</i>.</p>`,
        concepts: ["ml-classification-metrics", "mlx-cross-validation", "ml-roc-auc"],
        steps: [
          { type: "run", label: "▶ Evaluate on next-week holdout", result: { log: "time-split holdout: plays from the following 7 days\nMF      recall@10 0.188   NDCG@10 0.241\npopularity baseline   recall@10 0.094   NDCG@10 0.121\ncatalog coverage: MF surfaces 71% of titles vs 9% for popularity", metrics: [{ k: "recall@10", v: "0.188" }, { k: "NDCG@10", v: "0.241" }, { k: "coverage", v: "71%" }] } },
          { type: "decide", prompt: "MF doubles recall@10 over popularity. Is it ready to ship blind?",
            options: [
              { label: "No — offline gains don't guarantee online lift; validate with an A/B test", best: true, feedback: "offline ranking metrics are a proxy. Watch-time, retention and novelty can move differently online, so confirm with a live experiment before full rollout." },
              { label: "Yes — recall doubled, ship to 100%", feedback: "offline-online gaps are common (position bias, feedback loops). A doubled offline metric is a green light to TEST, not to launch everywhere." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Cold start & diversity",
        narrative: `<p>Two complaints: brand-new users get generic rows, and the row feels repetitive — five action films in a row. Both are classic recommender failure modes.</p>`,
        concepts: ["cls-bandits", "dl-cosine-similarity", "mlx-error-analysis"],
        steps: [{
          type: "decide", prompt: "How do you handle cold-start users and repetitive rows?",
          options: [
            { label: "Use signup/genre prefs + a bandit to explore for new users, and re-rank for diversity via item similarity", best: true, feedback: "side features bootstrap users with no history, a bandit explores to learn fast, and a diversity re-rank using cosine similarity between item vectors breaks up near-duplicates." },
            { label: "Just show the same popularity row to every cold user forever", feedback: "safe but it never learns the new user's taste — you leak the engagement you could have earned by exploring a little." },
            { label: "Add more latent factors to fix repetition", feedback: "repetition is a ranking/diversity problem, not a capacity one. More factors won't stop the model from stacking five similar items." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Two-stage serving",
        narrative: `<p>Scoring all 38K items per request is too slow. Production recommenders split into <b>retrieval</b> (fast approximate nearest-neighbor over latent vectors) then <b>ranking</b> of a few hundred candidates.</p>`,
        concepts: ["dl-cosine-similarity", "fnd-dot", "cls-recommender"],
        steps: [
          { type: "decide", prompt: "How should the home row be served?",
            options: [
              { label: "Retrieve top ~500 by approximate nearest neighbor on user/item vectors, then re-rank that shortlist", best: true, feedback: "two-stage is the standard: ANN cuts 38K to a few hundred in milliseconds, then a richer re-ranker orders the shortlist. Fast and personalized." },
              { label: "Score every one of the 38K items for every request in real time", feedback: "accurate but far too slow and expensive at 2.4M users. Retrieval-then-rank exists precisely to avoid this." }
            ] },
          { type: "run", label: "▶ Ship (canary 5% → 100%)", result: { log: "building ANN index over 38K item vectors...\ncanary 5%: p99 latency 38ms, error rate 0.0%\nshadow online recall@10 vs offline: 0.181 (close)\npromoting to 100% ...\nlive.", metrics: [{ k: "p99 latency", v: "38ms" }, { k: "rollout", v: "100%" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor the feedback loop",
        narrative: `<p>Recommenders shape the very data they train on: you only learn about items you showed. Left unwatched, this feedback loop narrows the catalog and tastes drift.</p>`,
        concepts: ["mlx-error-analysis", "cls-bandits", "prob-clt"],
        steps: [
          { type: "decide", prompt: "What should you monitor in production?",
            options: [
              { label: "Online recall/NDCG, catalog coverage & tail exposure, plus per-segment watch-time, with alerts on drift", best: true, feedback: "track ranking quality AND coverage so the feedback loop doesn't quietly collapse onto blockbusters. Per-segment watch-time catches a model that helps the average while hurting a group." },
              { label: "Just overall average watch-time", feedback: "a single average hides a shrinking catalog and segment regressions — coverage can crater while the mean looks fine for weeks." }
            ] },
          { type: "run", label: "▶ Check this week's monitors", result: { log: "online recall@10: 0.181 -> 0.166  (slow decay)\ncatalog coverage: 71% -> 58%  (loop narrowing!)\nnew-item exposure dropped 30% after index refresh lag\naction: boost exploration for fresh titles, schedule weekly refactorization", metrics: [{ k: "recall@10", v: "0.166 ⚠" }, { k: "coverage", v: "58% ⚠" }] }, note: `The loop closes here: shrinking coverage triggers more exploration and a refresh — back to <b>Data</b> and <b>Train</b>. Recommenders need constant feeding.` }
        ]
      }
    ]
  },
  "search-ranking": {
    title: "Search & Ranking",
    icon: "🔎",
    goal: "Order the documents for each query so the most relevant ones land at the top — measured by NDCG, learned from clicks.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Frame the problem",
        narrative: `<p>You own search for a large site. A query returns thousands of candidate documents; users only look at the first few. The task is to <i>order</i> them so relevance decreases down the page.</p>`,
        concepts: ["ai-linear-predictors", "ml-classification-metrics", "ml-roc-auc"],
        steps: [{
          type: "decide", prompt: "How should you frame ranking search results?",
          options: [
            { label: "Learning-to-rank: optimize the ORDER of the result list, scored by a rank metric like NDCG", best: true, feedback: "exactly. Search is a ranking problem — what matters is which doc is above which, near the top, not an absolute relevance number for each." },
            { label: "Independent binary classification: is each document relevant, yes/no?", feedback: "pointwise classification ignores that ranking is relative. Two docs can both be 'relevant' but one must go first — that ordering is the whole product." },
            { label: "Regression to predict exact dwell-time seconds per document", feedback: "noisy and beside the point: you ship an ordered list. Predicting seconds doesn't directly optimize the order users actually see." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather labels",
        narrative: `<p>You need relevance labels per (query, document) pair. Editorial judgments are gold but scarce; click logs are abundant but biased toward whatever already ranked high.</p>`,
        concepts: ["ml-supervised", "ml-logistic-regression", "prob-bernoulli-binomial"],
        steps: [
          { type: "decide", prompt: "What relevance labels should you train on?",
            options: [
              { label: "Clicks debiased for position, anchored by a smaller set of editorial graded judgments", best: true, feedback: "clicks scale but suffer position bias (rank 1 gets clicked for being rank 1). Debias them and calibrate against editorial grades for trustworthy labels." },
              { label: "Raw clicks, treating any click as 'relevant'", feedback: "position bias dominates: the top result gets clicked regardless of quality. Train on raw clicks and you just reinforce the current ranking." },
              { label: "Only hand-graded editorial judgments", feedback: "high quality but far too few queries to cover the long tail of real searches. Use them to anchor, not as the whole training set." }
            ] },
          { type: "run", label: "▶ Assemble the judgment set", prompt: "Build the (query, doc, label) training table.",
            result: { log: "joining query logs + click logs + editorial grades...\nqueries: 1,200,000   query-doc pairs: 58,000,000\ngraded relevance: 0 (irrelevant) .. 4 (perfect)\neditorial anchor set: 42,000 pairs\nposition-bias model: clicks reweighted by examination prob", metrics: [{ k: "queries", v: "1.2M" }, { k: "pairs", v: "58M" }, { k: "editorial", v: "42K" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore queries",
        narrative: `<p>Look at the query distribution before modeling. Search is dominated by a heavy head plus a vast tail of rare queries, and many results are near-duplicates.</p>`,
        concepts: ["prob-variance", "mlx-error-analysis", "ml-classification-metrics"],
        steps: [
          { type: "run", label: "▶ Profile queries & relevance", result: { log: "head queries (top 0.1%) -> 41% of traffic\ntail queries seen <=1 time: 64% of unique queries\navg relevant docs per query: 6.2 (most candidates are noise)\nfound near-duplicate docs inflating top results for 8% of queries", metrics: [{ k: "tail share", v: "64% unique" }, { k: "dup queries", v: "8%" }] } },
          { type: "decide", prompt: "Most unique queries are rare and unseen. What does that demand?",
            options: [
              { label: "Features that generalize across queries (text-match, embeddings) rather than memorized per-query rules", best: true, feedback: "right — you can't memorize the long tail. Query-document match features and semantic embeddings transfer to queries the model has never seen." },
              { label: "A separate hand-tuned ranking rule for each query", feedback: "impossible at 1.2M+ queries, and useless for the 64% of queries seen once. You need features that generalize, not per-query rules." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Engineer ranking features",
        narrative: `<p>Strong rankers blend lexical and semantic signals: classic term-match scores plus cosine similarity between query and document embeddings, $\\cos(\\mathbf{q},\\mathbf{d})=\\frac{\\mathbf{q}^\\top\\mathbf{d}}{\\lVert\\mathbf{q}\\rVert\\,\\lVert\\mathbf{d}\\rVert}$.</p>`,
        concepts: ["dl-cosine-similarity", "dl-word-embeddings", "fnd-norm"],
        steps: [{
          type: "decide", prompt: "Which feature set ranks best?",
          options: [
            { label: "Lexical match (BM25) + semantic cosine similarity of query/doc embeddings + doc quality/freshness signals", best: true, feedback: "blending lexical and semantic catches both exact-keyword and paraphrase matches, while quality/freshness break ties. This mix is the backbone of modern ranking." },
            { label: "Only exact keyword overlap counts", feedback: "misses synonyms and intent ('cheap flights' vs 'budget airfare'). Pure lexical match is brittle on the tail of paraphrased queries." },
            { label: "Only the document's global popularity, ignoring the query", feedback: "that returns the same popular docs for every query — it isn't ranking FOR the query at all." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick a ranker",
        narrative: `<p>You have tabular ranking features and graded labels. You need a model that directly optimizes list order and serves in milliseconds.</p>`,
        concepts: ["cls-gradient-boosting", "cls-stacking", "ai-linear-predictors"],
        steps: [{
          type: "decide", prompt: "Choose a learning-to-rank model.",
          options: [
            { label: "LambdaMART (gradient-boosted trees with a listwise rank objective)", best: true, feedback: "the industry workhorse for learning-to-rank: boosted trees optimizing a rank-aware loss that directly pushes up NDCG, fast to serve, robust on tabular features." },
            { label: "Plain linear regression on the features", feedback: "a fine baseline, but it's pointwise and misses feature interactions. It won't optimize list order the way a listwise ranker does." },
            { label: "A large transformer scoring every candidate at full depth", feedback: "great for relevance but too slow to score thousands of candidates per query. Reserve it for re-ranking a small shortlist." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train the ranker",
        narrative: `<p>Fit LambdaMART with a listwise objective so each gradient step cares about pairwise swaps weighted by their effect on NDCG. Use early stopping on a validation NDCG.</p>`,
        concepts: ["ml-gradient-descent", "ml-regularization", "cls-gradient-boosting"],
        steps: [{
          type: "run", label: "▶ Train LambdaMART (500 trees)",
          result: { log: "training listwise boosted ranker...\n[100] train NDCG@10 0.612  valid NDCG@10 0.588\n[300] train NDCG@10 0.671  valid NDCG@10 0.624\n[480] train NDCG@10 0.704  valid NDCG@10 0.631  (early stop)\nbest iteration: 412   top feature: semantic cosine sim", metrics: [{ k: "valid NDCG@10", v: "0.631" }, { k: "trees", v: "412" }] } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate ranking",
        narrative: `<p>NDCG@K rewards placing high-grade docs near the top via a position discount. Compare against the live ranker on a fresh query holdout, and check the head and tail separately.</p>`,
        concepts: ["ml-classification-metrics", "ml-roc-auc", "mlx-cross-validation"],
        steps: [
          { type: "run", label: "▶ Evaluate vs current production ranker", result: { log: "holdout: 80,000 fresh queries\nLambdaMART  NDCG@10 0.631   MRR 0.502\nproduction  NDCG@10 0.597   MRR 0.471\nhead queries: +3.1% NDCG   tail queries: +6.8% NDCG (semantic helps most on rare queries)", metrics: [{ k: "NDCG@10", v: "0.631" }, { k: "MRR", v: "0.502" }, { k: "tail lift", v: "+6.8%" }] } },
          { type: "decide", prompt: "NDCG is up overall and on the tail. Ship straight to 100%?",
            options: [
              { label: "No — run an interleaving / A/B test to confirm users actually click higher in the list", best: true, feedback: "offline NDCG uses imperfect labels; interleaving and A/B tests measure real user preference and catch regressions on segments your labels miss." },
              { label: "Yes — NDCG beats production everywhere, push it live", feedback: "labels are debiased clicks, not ground truth. A small but harmful regression on some query class can hide behind an aggregate NDCG win — verify online first." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>The A/B test shows a click-through gain overall, but navigational queries (someone searching an exact brand name) got slightly worse. Error analysis is the fix.</p>`,
        concepts: ["mlx-error-analysis", "ml-bias-variance", "cls-bandits"],
        steps: [{
          type: "decide", prompt: "Semantic ranking hurt exact-name navigational queries. Best response?",
          options: [
            { label: "Slice the losses, find that semantic match over-weights paraphrases on navigational intent, and add an exact-match boost", best: true, feedback: "error analysis localized the failure to one intent class. A targeted exact-match feature/boost fixes navigational queries without giving up the tail gains." },
            { label: "Drop the semantic features entirely", feedback: "that throws away the +6.8% tail win to fix a narrow slice. Fix the slice with a feature, don't amputate the signal that's working." },
            { label: "Retrain with twice as many trees", feedback: "more capacity won't teach the model that an exact brand match should dominate — that signal needs to be a feature, not extra trees." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy the ranker",
        narrative: `<p>Search must respond fast. Use retrieval to get a candidate set, then run the heavier ranker only on the top few hundred, behind a careful rollout.</p>`,
        concepts: ["cls-gradient-boosting", "dl-cosine-similarity", "ml-classification-metrics"],
        steps: [
          { type: "decide", prompt: "How should ranking run in production?",
            options: [
              { label: "Cheap retrieval to ~300 candidates, then LambdaMART re-ranks that set, rolled out behind a flag with an A/B", best: true, feedback: "retrieve-then-rank keeps latency low, and a flagged A/B rollout lets you measure live CTR and abandon instantly if something regresses." },
              { label: "Run the full ranker on all thousands of candidates per query", feedback: "too slow under a search latency budget. The two-stage retrieve-then-rank pattern exists exactly to avoid scoring everything." }
            ] },
          { type: "run", label: "▶ Ship behind A/B (10% → 100%)", result: { log: "deploying ranker v2 behind experiment...\n10% bucket: p99 latency 72ms, error rate 0.0%\nlive CTR@5: +2.4% vs control (95% CI excludes 0)\nnavigational queries: now neutral after exact-match boost\npromoting to 100% ...\nlive.", metrics: [{ k: "p99 latency", v: "72ms" }, { k: "CTR@5 lift", v: "+2.4%" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain",
        narrative: `<p>Search relevance decays as content, language and queries shift. New trends appear daily, and click feedback loops can entrench whatever you already rank high.</p>`,
        concepts: ["mlx-error-analysis", "ml-roc-auc", "prob-clt"],
        steps: [
          { type: "decide", prompt: "What should you monitor for the live ranker?",
            options: [
              { label: "Online NDCG/CTR by query segment, abandonment & reformulation rate, feature drift, and latency — with alerts", best: true, feedback: "track ranking quality per segment plus user frustration signals (abandons, query reformulations) and input drift. That trio catches both slow decay and sudden breaks." },
              { label: "Just the overall CTR number once a month", feedback: "monthly aggregate CTR hides per-segment regressions and trending-query gaps for weeks. Monitor per segment, continuously, with alerts." }
            ] },
          { type: "run", label: "▶ Check this week's monitors", result: { log: "overall NDCG@10: 0.631 -> 0.604  (drift)\nreformulation rate on news queries: +14%  (fresh content not indexed fast enough)\nsemantic-embedding feature drift detected vs training distribution\naction: refresh embeddings, speed up fresh-content indexing, schedule retrain", metrics: [{ k: "NDCG@10", v: "0.604 ⚠" }, { k: "reformulations", v: "+14% ⚠" }] }, note: `The loop closes here: drift and rising reformulations trigger an embedding refresh and retrain — back to <b>Data</b>. Search is never 'done'.` }
        ]
      }
    ]
  },
  "marketing-churn": {
    title: "Customer Churn & Targeting",
    icon: "🎯",
    goal: "Predict which subscribers are about to cancel, target the right ones with a retention offer, and prove it actually saved them.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Frame the problem",
        narrative: `<p>You run retention for a subscription product. Monthly churn is ~$4\\%$. The business doesn't want a churn score — it wants to know <i>who to give a discount to</i> so they stay.</p>`,
        concepts: ["ml-logistic-regression", "ml-classification-metrics", "ml-supervised"],
        steps: [{
          type: "decide", prompt: "What should the model actually optimize for?",
          options: [
            { label: "Rank customers by churn risk so a limited retention budget hits the highest-risk savable users first", best: true, feedback: "exactly. With a fixed offer budget you need a ranking of who to target, not just a yes/no churn flag — precision at the top of the list is what spends the budget well." },
            { label: "Maximize raw accuracy of churn vs stay", feedback: "with 4% churn, predicting 'nobody churns' is 96% accurate and useless. Accuracy is the wrong metric on an imbalanced retention problem." },
            { label: "Predict each customer's exact remaining months as a regression", feedback: "tenure regression is noisy and indirect. You act on a targeting list, so rank churn risk and tie it to expected value of intervening." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather the data",
        narrative: `<p>You need labeled churners and a clean prediction window. The subtle trap: a feature that's only true <i>because</i> the customer already churned.</p>`,
        concepts: ["ml-supervised", "prob-bernoulli-binomial", "mlx-error-analysis"],
        steps: [
          { type: "decide", prompt: "How do you define the churn label and feature window?",
            options: [
              { label: "Predict churn in the NEXT 30 days using only features known as of today (a strict cutoff)", best: true, feedback: "right. Freeze features at a snapshot date and label churn in the following window. The time gap prevents using post-decision information." },
              { label: "Label churners, then use their final-week activity as features", feedback: "cancellation-week behavior (e.g. 'visited the cancel page') is leakage — it's only known after they've effectively decided. The model fails on live customers." },
              { label: "Use a customer's cancellation reason text as a feature", feedback: "that's recorded at cancellation time, so it can't exist when you'd score an active customer. Classic target leakage." }
            ] },
          { type: "run", label: "▶ Pull subscriber snapshots", prompt: "Build the labeled training table at the cutoff date.",
            result: { log: "snapshotting subscribers as of cutoff...\ncustomers: 1,800,000   features: 64\nchurned within 30d: 71,000  (3.9%)\nfeatures: tenure, usage trend, support tickets, payment fails, plan, last-login recency\nremoved 2 post-cutoff leak columns", metrics: [{ k: "customers", v: "1.8M" }, { k: "churn rate", v: "3.9%" }, { k: "features", v: "64" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore & segment",
        narrative: `<p>Before predicting churn, understand your customers. Unsupervised segmentation reveals distinct behavior groups that churn for very different reasons.</p>`,
        concepts: ["ml-kmeans", "mlx-clustering-metrics", "ml-pca"],
        steps: [
          { type: "run", label: "▶ Cluster customers (k-means)", result: { log: "PCA to 12 dims, k-means sweep k=2..10...\nsilhouette score peaks at k=4\nsegments: 'power users' (1.1% churn), 'casual' (5.8%), 'price-sensitive' (9.2%), 'newly-onboarded' (12.4%)\nprice-sensitive + new accounts dominate churn", metrics: [{ k: "segments", v: "4" }, { k: "silhouette", v: "0.41" }] } },
          { type: "decide", prompt: "Silhouette peaks at k=4. Why pick the segment count this way instead of by eye?",
            options: [
              { label: "Silhouette quantifies how tight and separated clusters are, giving an objective k instead of a guess", best: true, feedback: "right — it measures cohesion vs separation so you don't just eyeball a number. k=4 is the data's own answer, and the segments map to real churn drivers." },
              { label: "Always use k=10 to capture maximum detail", feedback: "over-segmenting splinters customers into tiny noisy groups that don't generalize or map to distinct interventions. Let the metric choose k." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Engineer features",
        narrative: `<p>Static snapshots miss the story; <i>change</i> predicts churn. Build trend and recency features that capture a customer cooling off.</p>`,
        concepts: ["ml-pca", "ml-logistic-regression", "mlx-error-analysis"],
        steps: [{
          type: "decide", prompt: "Which features best predict imminent churn?",
          options: [
            { label: "Usage trend (last 30d vs prior 30d), days since last login, support-ticket spikes, and recent payment failures", best: true, feedback: "these encode disengagement and friction — the leading indicators of churn. A falling usage trend and a payment failure together are a strong signal." },
            { label: "Only the customer's signup date", feedback: "tenure alone is weak: it can't tell a happy long-timer from one who's quietly disengaging this month. You need recent-behavior deltas." },
            { label: "The customer's raw account ID as a number", feedback: "an ID is an arbitrary label with no predictive magnitude — pure noise (and it invites leakage/overfitting)." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick a model",
        narrative: `<p>Tabular features, non-linear interactions (a payment failure matters far more for price-sensitive new users), and you want a probability you can rank. What model?</p>`,
        concepts: ["cls-gradient-boosting", "ml-logistic-regression", "ml-classification-metrics"],
        steps: [{
          type: "decide", prompt: "Choose a churn model.",
          options: [
            { label: "Gradient-boosted trees for the ranker, with calibrated probabilities", best: true, feedback: "boosting captures the interactions (failure × segment) that drive churn, ranks well, and you calibrate so the scores behave like real probabilities for budgeting." },
            { label: "Logistic regression only", feedback: "a great interpretable baseline, but it misses the non-linear interactions. Keep it as a sanity check alongside boosting." },
            { label: "A deep neural net on the 64 tabular features", feedback: "rarely beats boosting on modest tabular data and is harder to calibrate and explain to the marketing team. Overkill here." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train it",
        narrative: `<p>Fit gradient-boosted trees with class weighting for the 3.9% positive rate and $\\ell_2$ regularization, then calibrate the output scores so a 0.3 score means ~30% churn probability.</p>`,
        concepts: ["ml-gradient-descent", "ml-regularization", "cls-gradient-boosting"],
        steps: [{
          type: "run", label: "▶ Train gradient boosting (class-weighted)",
          result: { log: "training boosted churn ranker...\n[80]  train AUC 0.842  valid AUC 0.821\n[200] train AUC 0.889  valid AUC 0.836\n[340] train AUC 0.918  valid AUC 0.838  (early stop)\ncalibrating scores (isotonic)... reliability good\nbest iteration: 268", metrics: [{ k: "valid AUC", v: "0.838" }, { k: "trees", v: "268" }] } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate for targeting",
        narrative: `<p>You don't ship an AUC; you ship a <i>targeting list</i>. Evaluate precision and lift in the top deciles — where the retention budget actually gets spent.</p>`,
        concepts: ["ml-classification-metrics", "ml-roc-auc", "mlx-cross-validation"],
        steps: [
          { type: "run", label: "▶ Evaluate top-decile targeting", result: { log: "holdout: 360,000 customers, 14,000 churners\nAUC 0.836\ntop decile (180k contacted): churn rate 21.4% vs 3.9% base -> 5.5x lift\nprecision@top-decile 0.214   recall captured 55% of churners", metrics: [{ k: "AUC", v: "0.836" }, { k: "top-decile lift", v: "5.5x" }, { k: "churners caught", v: "55%" }] } },
          { type: "decide", prompt: "The top decile has 5.5x lift. Is high churn risk enough to target someone?",
            options: [
              { label: "No — target high-risk customers who are also persuadable (uplift), not the ones who'll churn no matter what", best: true, feedback: "right. Some high-risk users are lost causes and some would have stayed anyway; the offer only pays off on the persuadable middle. Risk ranking is step one, uplift is the goal." },
              { label: "Yes — just send the offer to everyone in the top decile", feedback: "you'll waste budget on doomed churners and on people who'd have stayed for free. Risk alone over-targets; you need to estimate who the offer actually moves." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Uplift, not just risk",
        narrative: `<p>The first campaign saved fewer customers than the lift suggested. The reason: targeting by risk wastes offers on people whose decision the offer never changes.</p>`,
        concepts: ["cls-bandits", "mlx-error-analysis", "ml-classification-metrics"],
        steps: [{
          type: "decide", prompt: "How do you find who the offer actually persuades?",
          options: [
            { label: "Run a holdout: give the offer to a random subset of high-risk users and measure incremental retention vs an untreated control", best: true, feedback: "the only way to learn uplift is to withhold the treatment from a randomized control and measure the difference. That isolates the offer's causal effect from baseline churn." },
            { label: "Assume the highest-risk customers are the most persuadable", feedback: "often the opposite — the highest-risk users are frequently already gone. Persuadability is its own thing and must be measured, not assumed." },
            { label: "Send the offer to everyone and hope retention rises", feedback: "with no control group you can never tell if retention rose because of the offer or because of seasonality. You'd learn nothing about uplift." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy the campaign",
        narrative: `<p>Churn scoring runs ahead of the renewal date, so a daily batch is fine — but you must build the randomized control directly into the campaign to keep measuring uplift.</p>`,
        concepts: ["ml-classification-metrics", "cls-gradient-boosting", "cls-bandits"],
        steps: [
          { type: "decide", prompt: "How should the targeting model run?",
            options: [
              { label: "Daily batch scoring that flags at-risk renewals, with a randomized holdout left untreated to measure lift", best: true, feedback: "churn evolves over days, so batch is appropriate, and baking in a control group means every campaign keeps measuring incremental retention." },
              { label: "A real-time sub-100ms scoring service at page load", feedback: "over-engineered: renewal decisions play out over days, not milliseconds. A nightly batch is cheaper and entirely sufficient here." }
            ] },
          { type: "run", label: "▶ Launch campaign (with 10% control)", result: { log: "scoring 1.8M customers (daily batch)...\ntargeted: top-decile persuadable, 90% treated / 10% control\noffer: 20% off 3 months\nweek 1 retention: treated 88.1% vs control 83.4% -> +4.7pp incremental\nlive.", metrics: [{ k: "incremental retention", v: "+4.7pp" }, { k: "control", v: "10%" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain",
        narrative: `<p>Churn models drift as pricing, competitors and customer mix change, and a stale offer loses its punch. Keep the control group running to know if it still works.</p>`,
        concepts: ["mlx-error-analysis", "ml-roc-auc", "prob-clt"],
        steps: [
          { type: "decide", prompt: "What should you monitor for the live campaign?",
            options: [
              { label: "Incremental retention vs control, top-decile precision as labels land, feature drift, and offer-cost ROI — with alerts", best: true, feedback: "track the causal lift (vs control), targeting quality as churn outcomes arrive, input drift, and ROI so a fading offer or shifting customer base gets caught early." },
              { label: "Just total customers retained, with no control group", feedback: "without a control you can't separate the offer's effect from seasonality or price changes — you'd keep spending on a campaign that may no longer work." }
            ] },
          { type: "run", label: "▶ Check this month's monitors", result: { log: "incremental retention: +4.7pp -> +1.9pp  (offer fatigue?)\nfeature 'usage_trend' drift detected: a pricing change shifted the distribution\ntop-decile precision: 0.214 -> 0.171  ALERT\naction: refresh the offer, retrain on post-price-change data", metrics: [{ k: "incremental lift", v: "+1.9pp ⚠" }, { k: "precision", v: "0.171 ⚠" }] }, note: `The loop closes here: a pricing change shifted the data and the offer fatigued, so monitoring triggers a retrain and a new offer — back to <b>Data</b>. Retention is a moving target.` }
        ]
      }
    ]
  },
  "ab-testing": {
    title: "A/B Testing & Experimentation",
    icon: "🧪",
    goal: "Run a trustworthy experiment: design it with enough power, read the result honestly, and avoid the traps that fool teams into shipping noise.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Frame the hypothesis",
        narrative: `<p>A designer wants to ship a new checkout button color, certain it lifts conversion. Before touching traffic, turn the hunch into a testable hypothesis with one primary metric.</p>`,
        concepts: ["prob-estimation", "prob-bernoulli-binomial", "prob-expectation"],
        steps: [{
          type: "decide", prompt: "How should you frame the experiment?",
          options: [
            { label: "One primary metric (checkout conversion), a directional hypothesis, and a guardrail metric (revenue) chosen up front", best: true, feedback: "exactly. Committing to a single primary metric and guardrails before you look prevents cherry-picking a winner from dozens of metrics after the fact." },
            { label: "Track 40 metrics and ship if any one of them improves", best: false, feedback: "testing 40 metrics means ~2 will look 'significant' at p&lt;0.05 by pure chance. Pick the primary metric in advance or you'll fool yourself." },
            { label: "Just ship the new button — the designer is confident", feedback: "confidence isn't evidence. The whole point of experimentation is to measure the effect rather than trust intuition that's often wrong." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Power & sample size",
        narrative: `<p>Before launching, decide how much traffic you need. Sample size depends on the baseline rate, the smallest effect worth detecting (MDE), and the variance of the metric: roughly $n\\propto \\frac{\\sigma^2}{\\delta^2}$.</p>`,
        concepts: ["prob-variance", "prob-clt", "prob-estimation"],
        steps: [
          { type: "decide", prompt: "Why compute the required sample size BEFORE you start?",
            options: [
              { label: "An underpowered test can't detect a real effect, so you'd risk a false 'no difference' and waste the experiment", best: true, feedback: "right. Power is the chance of catching a true effect. Too small a sample and a real lift hides in the noise — you'd wrongly conclude 'no effect' and learn nothing." },
              { label: "It doesn't matter — just run it until the p-value drops below 0.05", best: false, feedback: "stopping the moment p&lt;0.05 ('peeking') massively inflates false positives. Fix the sample size up front, then read the result once." },
              { label: "Bigger is always better, so just use 100% of traffic for a year", feedback: "wildly inefficient and risky — you'd expose everyone to an untested change for far longer than needed. Power analysis finds the RIGHT size." }
            ] },
          { type: "run", label: "▶ Run power analysis", prompt: "Compute the sample size for an 80%-power test.",
            result: { log: "baseline conversion: 12.0%\nminimum detectable effect (MDE): +0.6pp (relative +5%)\nsignificance alpha 0.05 (two-sided), power 0.80\nrequired n per arm: ~58,200\nat 9,000 eligible users/day/arm -> ~7 days", metrics: [{ k: "n per arm", v: "58,200" }, { k: "MDE", v: "+0.6pp" }, { k: "runtime", v: "~7 days" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Randomization & SRM",
        narrative: `<p>The test's validity rests on clean randomization. A first sanity check: did traffic actually split as designed? A Sample Ratio Mismatch (SRM) means something is broken upstream.</p>`,
        concepts: ["prob-bernoulli-binomial", "prob-clt", "prob-variance"],
        steps: [
          { type: "run", label: "▶ Check the assignment split", result: { log: "intended split: 50% / 50%\nobserved: control 51,940  treatment 48,210\nSRM chi-square p-value: 0.0003  -> SAMPLE RATIO MISMATCH\nlikely cause: treatment bucket errors out for logged-out users (dropped before logging)", metrics: [{ k: "split", v: "51.9% / 48.1%" }, { k: "SRM p", v: "0.0003 ⚠" }] } },
          { type: "decide", prompt: "The split is 51.9/48.1 with a tiny SRM p-value. What does it mean?",
            options: [
              { label: "The randomization is broken — the buckets aren't comparable, so any result is untrustworthy until it's fixed", best: true, feedback: "right. A significant SRM means users are being dropped or misassigned non-randomly, so treatment and control differ for reasons other than the change. Fix the pipeline and restart — don't analyze." },
              { label: "It's basically 50/50, close enough — just analyze it", feedback: "an SRM this significant signals a systematic bug (e.g. errors silently dropping one arm). The remaining users are a biased sample; results are invalid until the cause is found." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Reduce variance",
        narrative: `<p>Smaller variance means a sharper test for the same traffic. CUPED uses a pre-experiment covariate (each user's prior conversion) to strip out noise the experiment didn't cause.</p>`,
        concepts: ["prob-covariance-correlation", "prob-variance", "prob-estimation"],
        steps: [{
          type: "decide", prompt: "Why adjust the metric using pre-experiment behavior (CUPED)?",
          options: [
            { label: "Pre-period behavior is correlated with the outcome but unaffected by the treatment, so subtracting it removes noise and tightens the confidence interval", best: true, feedback: "exactly. The covariate explains variance that has nothing to do with your change. Removing it shrinks the CI — like detecting a smaller effect with the same sample, or the same effect faster." },
            { label: "It changes the true effect size to make treatment look better", best: false, feedback: "no — a valid variance-reduction adjustment leaves the unbiased effect estimate alone; it only shrinks its variance. If it moved the point estimate, it would be cheating." },
            { label: "It lets you stop the test early as soon as it looks good", feedback: "variance reduction is not a license to peek. You still read the result at the planned sample size; CUPED just makes that read more precise." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick the test",
        narrative: `<p>Your primary metric is a conversion rate — a proportion. Choose the statistical test that matches the metric and your decision-making style.</p>`,
        concepts: ["prob-bernoulli-binomial", "prob-estimation", "prob-normal"],
        steps: [{
          type: "decide", prompt: "Which analysis fits a binary conversion metric at this scale?",
          options: [
            { label: "A two-proportion test (z-test on the difference in conversion rates), reported with a confidence interval on the lift", best: true, feedback: "conversion is a Bernoulli outcome, so a two-proportion z-test is the natural fit, and a CI on the lift communicates magnitude and uncertainty — not just a yes/no p-value." },
            { label: "A t-test treating each conversion as a continuous score", feedback: "workable at huge n thanks to the CLT, but a proportion test is the principled match for a 0/1 metric and handles the variance form correctly." },
            { label: "Eyeball the two bar charts and decide", feedback: "with noise this size, eyeballing leads straight to shipping randomness. You need a test that accounts for sampling variability." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Run the experiment",
        narrative: `<p>Launch to the planned $50/50$ split and let it run to the pre-registered sample size. Resist the urge to stop the moment it crosses the line.</p>`,
        concepts: ["prob-lln", "prob-clt", "prob-estimation"],
        steps: [{
          type: "run", label: "▶ Run to planned sample size (7 days)",
          result: { log: "day 1: control 12.0%  treatment 13.1%  (n small, noisy — DO NOT STOP)\nday 3: control 12.1%  treatment 12.6%  p=0.07\nday 7: control 12.0%  treatment 12.5%  (n=58,400/arm reached)\nestimate stabilizing as n grows (law of large numbers)\nstopping at planned n.", metrics: [{ k: "control", v: "12.0%" }, { k: "treatment", v: "12.5%" }, { k: "n/arm", v: "58.4K" }] } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Read the result",
        narrative: `<p>At the planned sample size, compute the lift, its confidence interval, and the p-value. The CI tells you the plausible range of the true effect — far more useful than a bare 'significant or not'.</p>`,
        concepts: ["prob-estimation", "prob-clt", "prob-normal"],
        steps: [
          { type: "run", label: "▶ Analyze the primary metric", result: { log: "control 12.0%  treatment 12.5%\nabsolute lift: +0.5pp  (relative +4.2%)\n95% CI on lift: [+0.1pp, +0.9pp]  (excludes 0)\ntwo-proportion p-value: 0.018\nguardrail revenue/user: +0.3% (CI includes 0, neutral — no harm)", metrics: [{ k: "lift", v: "+0.5pp" }, { k: "95% CI", v: "[0.1, 0.9]" }, { k: "p", v: "0.018" }] } },
          { type: "decide", prompt: "p=0.018 and the 95% CI is [+0.1pp, +0.9pp]. How do you read it?",
            options: [
              { label: "A statistically significant positive lift, but the CI lower bound (+0.1pp) is below the +0.6pp MDE, so check it's worth shipping", best: true, feedback: "right — significance means 'probably real', but the effect could be as small as +0.1pp, under the MDE you cared about. Significant and practically meaningful aren't the same; weigh the lower bound against ship cost." },
              { label: "p=0.018 proves the new button definitely lifts conversion by exactly 0.5pp", feedback: "a p-value isn't proof, and 0.5pp is a point estimate — the truth lies somewhere in the CI. Never read significance as certainty or the estimate as exact." },
              { label: "The CI includes small values, so the result is meaningless — discard it", feedback: "too harsh: the CI excludes 0 and is entirely positive, which is real evidence of a lift. The question is whether the magnitude justifies shipping, not whether it exists." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Novelty & segments",
        narrative: `<p>Before declaring victory, check whether the lift is a lasting effect or just users reacting to something <i>new</i> — and whether it holds across segments.</p>`,
        concepts: ["prob-covariance-correlation", "prob-clt", "prob-estimation"],
        steps: [{
          type: "decide", prompt: "Conversion lift was big on day 1 and shrank by day 7. What's the concern?",
          options: [
            { label: "A novelty effect — users click the new thing because it's new, and the lift may decay to near zero once it's familiar", best: true, feedback: "right. A decaying treatment curve is the signature of novelty. Look at returning vs new users and let it run longer to see where the effect settles before trusting it." },
            { label: "It proves the effect is huge — ship immediately based on day 1", feedback: "day-1 enthusiasm is exactly the trap. Novelty fades; shipping on the peak overstates the durable lift you'll actually get." },
            { label: "Slice by 20 segments and ship to whichever one looks best", feedback: "post-hoc slicing across many segments manufactures false winners (multiple comparisons). Pre-register segments or correct for the testing." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Ship the decision",
        narrative: `<p>The effect held up after the novelty window and guardrails are neutral. Roll out the winner gradually, keeping a small holdback to confirm the lift persists at full scale.</p>`,
        concepts: ["prob-estimation", "prob-lln", "cls-bandits"],
        steps: [
          { type: "decide", prompt: "How should you roll out the winning variant?",
            options: [
              { label: "Ramp 10% → 50% → 100% while watching guardrails, keeping a 5% long-term holdback to verify durable lift", best: true, feedback: "a staged ramp catches a scaling surprise before it hits everyone, and a holdback measures whether the lift survives long-term — the honest way to confirm impact." },
              { label: "Flip to 100% instantly and delete the experiment", feedback: "no ramp means a scale-dependent regression hits all users at once, and with no holdback you can never confirm the lift was durable. Keep a holdback." }
            ] },
          { type: "run", label: "▶ Roll out winner (with 5% holdback)", result: { log: "ramping new button: 10% -> 50% -> 100%...\nguardrails stable through ramp (revenue, latency neutral)\n5% long-term holdback retained\nweek 2 vs holdback: +0.4pp conversion (durable, novelty settled)\nlive.", metrics: [{ k: "durable lift", v: "+0.4pp" }, { k: "holdback", v: "5%" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & learn",
        narrative: `<p>An experiment program is only trustworthy if you keep watching after launch and bank the learning. Effects fade, interactions with other launches appear, and the holdback is your ground truth.</p>`,
        concepts: ["prob-clt", "prob-estimation", "prob-lln"],
        steps: [
          { type: "decide", prompt: "What should you monitor and record after shipping?",
            options: [
              { label: "Holdback vs launched lift over time, guardrail metrics, and a written record of the effect, decision and caveats", best: true, feedback: "the holdback tracks whether the gain persists, guardrails catch late harm, and documenting the result builds institutional memory so the next team doesn't re-run the same test or repeat your mistakes." },
              { label: "Nothing — the test was significant, move on", feedback: "effects decay and collide with later launches; with no monitoring or record, you can't tell if the win held, and the org forgets what it learned." }
            ] },
          { type: "run", label: "▶ Check the holdback this quarter", result: { log: "launched-vs-holdback lift: +0.4pp -> +0.2pp (CI now includes 0)\nlikely cause: a later checkout redesign overlapped and absorbed the gain\nguardrails: still neutral\naction: log the interaction, re-test the button in the new checkout context", metrics: [{ k: "current lift", v: "+0.2pp ⚠" }, { k: "holdback", v: "5%" }] }, note: `The loop closes here: the holdback shows the lift faded once another launch overlapped, so you log the interaction and re-test — back to <b>Frame</b>. Trustworthy experimentation never really ends.` }
        ]
      }
    ]
  }
});
