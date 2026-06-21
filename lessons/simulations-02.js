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
        narrative: `<p>You build movie recommendations on the <b>MovieLens 25M</b> dataset (GroupLens / University of Minnesota): <b>162,000 users</b>, <b>62,000 movies</b>, and <b>25 million ratings</b> on a 0.5–5 star scale. Only a tiny fraction of the catalog a user could see ever gets rated, and a recommender's home row earns far more attention at the top than the bottom. The job is to <i>order</i> titles so the best ones land on top — not to predict an exact star rating nobody asked for. Framing this as ranking (not rating, not classification) decides every choice downstream: the data you label, the loss you train, and the metric you ship on.</p>`,
        concepts: ["cls-recommender", "ml-classification-metrics", "ml-supervised"],
        insight: `<b>Position is everything.</b> The bigger industry benchmark, the <b>Netflix Prize</b> set, has <b>480K users</b> and <b>100M ratings</b> on just <b>17K movies</b> — and there, roughly <b>62% of plays come from the first 3 slots</b> of a row. So a model that is "accurate on average" but puts the user's one true favorite in slot 9 has failed — the only ranks that earn watch-time are the top few. That is why you optimize <b>top-$K$ ranking</b>, not per-title accuracy.`,
        symbols: [
          { sym: "$K$", desc: "how many titles fit in the visible row (here $K\\approx 10$); only these positions get meaningful attention." },
          { sym: "recall@$K$", desc: "fraction of the titles a user actually played that landed in your top $K$ — the core ranking success metric." },
          { sym: "NDCG", desc: "Normalized Discounted Cumulative Gain: rewards putting the right title near the top, discounting hits that sit lower in the list." }
        ],
        steps: [{
          type: "decide", prompt: "What objective best fits a home-page recommender?",
          options: [
            { label: "Minimize rating prediction error (RMSE, Root Mean Squared Error) on a 1–5 star scale", feedback: "RMSE optimizes the wrong thing. Users barely rate anything (under 2% of impressions), so the signal is thin, and a low RMSE doesn't imply a good ORDER — two titles predicted 4.1 and 4.0 can be ranked either way and RMSE won't care, yet the order is the entire product. You ship a ranked list, so optimize ranking, not star accuracy." },
            { label: "Rank titles so the ones a user will actually play sit at the top (high recall in the top-K)", best: true, feedback: "exactly. The product IS the ordered row, so top-$K$ ranking quality is what matters. recall@$K$ asks 'did the titles they'd play make the visible window?' and NDCG rewards putting them near the very top where attention concentrates. This objective matches how the row is actually consumed." },
            { label: "Show the globally most popular titles to everyone", feedback: "this is a non-personalized heuristic, not an objective. It's a fine cold-start FALLBACK for users with zero history, but as the goal it buries the long tail and ignores that your sci-fi fan and your rom-com fan should see different rows. You'd have built a top-charts page, not a recommender." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather the data",
        narrative: `<p>MovieLens 25M ships one core file, <code>ratings.csv</code>, with exactly four columns: <b>userId, movieId, rating, timestamp</b>. Each row is one explicit star rating (0.5–5.0 in half-star steps). Explicit ratings are gold but sparse — most user–movie pairs are simply blank because the user never saw that film, so you can't treat an un-rated movie as disliked. Get the positive/negative definition wrong here and no model downstream can recover.</p>`,
        concepts: ["ml-supervised", "cls-recommender", "prob-bernoulli-binomial"],
        insight: `<b>25M filled cells in a 10-billion-cell grid.</b> The matrix is <b>162,000 users × 62,000 movies ≈ 10 billion cells</b>, but only <b>25 million</b> are filled — about <b>0.25% density (~99.75% empty)</b>. A high star rating is a confident positive; everything un-rated is mostly just <i>un-seen</i>, not disliked. In a production setting you'd add implicit signals (plays, watch-time) on top, but that asymmetry — sparse positives, mostly-missing negatives — is the defining shape of the data.`,
        data: {
          caption: "ratings.csv — the MovieLens 25M interaction table (one row per rating)",
          columns: ["userId", "movieId", "rating", "timestamp"],
          rows: [
            ["1", "296", "5.0", "1147880044"],
            ["1", "306", "3.5", "1147868817"],
            ["7", "1196", "4.5", "1106635992"],
            ["14", "1", "2.0", "1442169485"],
            ["… 25,000,095 rows", "…", "…", "…"]
          ],
          note: `Real schema: <b>userId</b> and <b>movieId</b> are integer keys, <b>rating</b> is on the 0.5–5.0 half-star scale, <b>timestamp</b> is Unix seconds (used for time-split holdouts). There is no "disliked" row — an absent (userId, movieId) pair means <i>unseen</i>, which is why un-rated titles become <i>soft</i> negatives, downweighted rather than treated as confident dislikes.`
        },
        symbols: [
          { sym: "rating", desc: "explicit star score on MovieLens's 0.5–5.0 half-star scale; a high value is a confident implicit positive." },
          { sym: "soft −", desc: "a downweighted negative for an un-rated (unseen) movie — counted weakly because 'not rated' usually means 'never watched'." },
          { sym: "$p$", desc: "the Bernoulli like-probability the model ultimately estimates for each (userId, movieId) pair." }
        ],
        steps: [
          { type: "decide", prompt: "What feedback should you train on?",
            options: [
              { label: "Treat high star ratings as positives and downweight the vast pile of un-rated movies as soft negatives", best: true, feedback: "right. The 25M ratings are honest positives, but they cover only ~0.25% of all (userId, movieId) pairs — the rest is mostly unseen, not disliked. The mechanism: treat a high rating as a strong positive, and downweight the enormous un-rated set as SOFT negatives so the model learns preference without being told that 'unseen' equals 'disliked'. Honest labels plus soft negatives is the winning combination." },
              { label: "Only train on movies a user rated exactly 5 stars", feedback: "too sparse and too biased. Five-star ratings are a vocal minority of an already-sparse signal, skewing hard toward extremes. You'd train on a tiny, unrepresentative slice and throw away the 3.5s and 4.0s that carry most of the preference information. The full 0.5–5.0 scale ANCHORS taste; a single rating value can't carry the catalog." },
              { label: "Treat every movie a user did NOT rate as a hard negative", feedback: "this poisons the labels. Users never SAW the vast majority of the 62K-movie catalog, so 'not rated' overwhelmingly means 'never watched' — not 'disliked'. Marking all of it a confident negative teaches the model to suppress movies a user might love simply because they never encountered them. Negatives must be SOFT, not hard." }
            ] },
          { type: "run", label: "▶ Load MovieLens 25M ratings", prompt: "Assemble the user-item interaction matrix.",
            result: { log: "reading ratings.csv (userId, movieId, rating, timestamp)...\nusers: 162,000   movies: 62,000\nratings: 25,000,095   scale: 0.5 .. 5.0 (half-star)\nmatrix density: 0.25%  (99.75% empty)\npositives: high star ratings; un-rated pairs treated as soft negatives", metrics: [{ k: "users", v: "162K" }, { k: "movies", v: "62K" }, { k: "density", v: "0.25%" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore the matrix",
        narrative: `<p>Before modeling, understand the shape of demand. MovieLens ratings are brutally skewed: a few blockbusters soak up most ratings, and most of the 62,000 movies get almost none.</p>`,
        concepts: ["prob-variance", "cls-recommender", "mlx-error-analysis"],
        insight: `<b>The long tail.</b> Ratings are brutally skewed — the <b>top 1% of movies draws 62% of all ratings</b>, while the bottom 80% of movies together get under 5%. And the matrix is <b>~99.75% empty</b>: with 25M ratings over 162K users, the average user has rated only ~155 of 62,000 movies. Every modeling choice has to survive this skew and this sparsity.`,
        chart: { type: "bars", title: "Rating distribution by popularity tier (long tail)", labels: ["top 1%", "next 19%", "bottom 80%"], values: [62, 33, 5], valueLabels: ["62%", "33%", "5%"], colors: ["#4ea1ff", "#ffb454", "#ff7b72"] },
        data: {
          caption: "The user–item matrix $R$ (a tiny corner of a huge, mostly-empty grid)",
          columns: ["userId / movieId →", "296", "1196", "1", "306", "… 62K cols"],
          rows: [
            ["user 1", "5.0", "—", "—", "3.5", "…"],
            ["user 7", "—", "4.5", "—", "—", "…"],
            ["user 14", "—", "—", "2.0", "—", "…"],
            ["… 162K rows", "…", "…", "…", "…", "…"]
          ],
          note: `162K users × 62K movies ≈ 10 billion cells, but only ~0.25% (25M) are filled. A dash (—) means "never rated". The entire job is predicting the dashes — which movie each user <i>would</i> love.`
        },
        symbols: [
          { sym: "$R$", desc: "the user–item matrix; entry $R_{ui}$ is user $u$'s star rating for movie $i$ (mostly empty)." },
          { sym: "$m,\\ n$", desc: "number of users ($m\\approx 162$K) and movies ($n\\approx 62$K)." },
          { sym: "density", desc: "fraction of cells actually filled — here only $\\approx 0.25\\%$, which is why naive averages fail." }
        ],
        steps: [
          { type: "run", label: "▶ Profile popularity & users", result: { log: "rating distribution: top 1% of movies -> 62% of all ratings (long tail)\nmedian ratings per user: 70   median ratings per movie: 3\nnew users (held-out latest week): cold start, 0 prior ratings\nnew movies (recent additions): no ratings yet", metrics: [{ k: "tail skew", v: "top 1% = 62%" }, { k: "ratings", v: "25M" }] } },
          { type: "decide", prompt: "The popularity curve is extremely skewed. What's the modeling risk?",
            options: [
              { label: "The model just learns to recommend blockbusters to everyone (popularity bias)", best: true, feedback: "right. Without care, it collapses toward global popularity and never surfaces the personalized long tail — the whole reason to personalize." },
              { label: "No risk — popular titles are popular for a reason", feedback: "popularity is a useful prior, but if that's all you predict you've built a top-charts page, not a recommender." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Latent factors",
        narrative: `<p>Raw user and item IDs don't generalize — ID 9471 tells the model nothing about taste. Matrix factorization instead learns a short vector for each user and each item so that their dot product $\\hat{r}_{ui}=\\mathbf{p}_u^\\top \\mathbf{q}_i$ predicts affinity. Read symbol by symbol: $\\mathbf{p}_u$ is user $u$'s taste in $k$ hidden dimensions, $\\mathbf{q}_i$ is item $i$'s position in those same dimensions, and $\\mathbf{p}_u^\\top\\mathbf{q}_i$ sums their agreement — high when the user's "loves sci-fi" lines up with the item's "is sci-fi". The size of $k$ is the one knob that sets how much taste the model can express.</p>`,
        concepts: ["la-svd", "ml-pca", "fnd-dot"],
        insight: `<b>From 62K columns to $k$.</b> Factorization replaces the 62,000-wide, <b>99.75%-empty</b> row for each user with a dense vector of just <b>$k\\approx 64$</b> numbers — a ~1000× compression. Those 64 dimensions become reusable axes like "drama↔action" or "kids↔adult", and a brand-new title slots in by its vector instead of needing its own rating history.`,
        chart: { type: "scatter", title: "Latent space: dim 1 (sci-fi) vs dim 2 (light)", xlabel: "dim 1 (sci-fi)", groups: [
          { name: "user u_1042", color: "#4ea1ff", points: [[0.91, -0.40]] },
          { name: "Stranger Th.", color: "#7ee787", points: [[0.88, -0.31]] },
          { name: "Rom-Com #9", color: "#ffb454", points: [[-0.62, 0.85]] }
        ] },
        data: {
          caption: "Learned latent vectors (the dense replacement for sparse ID rows)",
          columns: ["entity", "dim 1 (sci-fi)", "dim 2 (light)", "dim 3 (prestige)", "… 64 dims"],
          rows: [
            ["user u_1042 ($\\mathbf{p}_u$)", "+0.91", "−0.40", "+0.12", "…"],
            ["Stranger Th. ($\\mathbf{q}_i$)", "+0.88", "−0.31", "+0.20", "…"],
            ["Rom-Com #9 ($\\mathbf{q}_i$)", "−0.62", "+0.85", "−0.10", "…"],
            ["… 162K users + 62K movies", "…", "…", "…", "…"]
          ],
          note: `The dot product $\\mathbf{p}_u^\\top\\mathbf{q}_i$ is large when signs align: user u_1042 (high sci-fi, low light) matches Stranger Things but scores low on Rom-Com #9. The dimension names are illustrative — the model discovers the axes itself; we never label them.`
        },
        symbols: [
          { sym: "$\\mathbf{p}_u$", desc: "user $u$'s latent taste vector, length $k$ — how much they like each hidden dimension." },
          { sym: "$\\mathbf{q}_i$", desc: "item $i$'s latent vector, length $k$ — how much it expresses each hidden dimension." },
          { sym: "$\\hat r_{ui}$", desc: "predicted affinity, computed as $\\mathbf{p}_u^\\top\\mathbf{q}_i$ (the sum of element-wise products)." },
          { sym: "$k$", desc: "the latent dimension — the number of hidden taste axes; sets model capacity." }
        ],
        steps: [{
          type: "decide", prompt: "How big should the latent factor dimension $k$ be?",
          options: [
            { label: "Small (k≈64): low-rank embeddings that capture broad taste with regularization", best: true, feedback: "this is the sweet spot. On a matrix that's only 0.25% filled, a COMPACT rank is exactly what generalizes: 64 dimensions are enough to encode genres, moods and eras, but few enough that the model is forced to find patterns shared across many users instead of memorizing individual cells. SVD (Singular Value Decomposition)-style factorization compresses 62K movies into ~64 reusable axes, so even a title with little history inherits a sensible vector. Low rank = built-in regularization." },
            { label: "Huge (k≈5,000): one dimension is nearly one item", feedback: "this defeats the purpose. With $k$ that large there's almost a dimension per item, so the model barely compresses anything and instead OVERFITS the 0.25%-dense matrix — it memorizes the handful of filled cells and predicts noise for the empty ones. Serving cost (storage + dot-product time) also balloons. The whole value of factorization is the LOW rank; 5,000 throws it away." },
            { label: "k=1: a single 'goodness' score per item", feedback: "rank-1 is too little capacity. One dimension can only place every item on a single 'good↔bad' line, which collapses right back to global popularity — there's no room to encode that you love sci-fi but skip rom-coms, because that requires at least two opposing axes. You need enough dimensions to separate tastes, just not so many that you overfit." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick a model",
        narrative: `<p>You have a sparse rating matrix and need fast top-$K$ retrieval over 62K movies for 162K users. The model has to do three things well: learn taste from sparse data, serve in milliseconds, and degrade gracefully for users or titles with no history. Reach for the simplest thing that clears that bar before anything fancier — a strong cheap baseline tells you what "good" even looks like.</p>`,
        concepts: ["cls-recommender", "cls-factor-analysis", "ml-linear-regression"],
        insight: `<b>The cheap baseline is the right baseline.</b> Matrix factorization at <b>$k=64$</b> stores just <b>162K + 62K vectors</b> (well under a hundred MB) and serves a top-$K$ row as one approximate nearest-neighbor lookup in <b>single-digit milliseconds</b> — orders of magnitude cheaper than a deep net, while still doubling recall over popularity. Start here; earn the right to add complexity.`,
        symbols: [
          { sym: "ALS", desc: "Alternating Least Squares — the optimizer that fits MF by solving for $\\mathbf{p}_u$ with items fixed, then $\\mathbf{q}_i$ with users fixed, repeatedly." },
          { sym: "MF", desc: "Matrix Factorization — approximating $R\\approx PQ^\\top$ with low-rank user ($P$) and item ($Q$) factor matrices." },
          { sym: "top-$K$", desc: "the $K$ highest-scoring items returned per user, found by nearest-neighbor search over the latent vectors." }
        ],
        steps: [{
          type: "decide", prompt: "Choose a first recommender model.",
          options: [
            { label: "Matrix factorization (ALS / implicit-feedback MF) with a popularity fallback for cold start", best: true, feedback: "this is the workhorse for a reason. MF learns the latent user/item vectors from the previous stage, serves top-$K$ by fast vector search, and is cheap to store and update. The cold-start gap (no vector yet for a brand-new user or title) is handled by BOLTING ON a popularity fallback rather than complicating the model. It clears all three bars — learns from sparse data, serves fast, degrades gracefully — at the lowest cost." },
            { label: "A giant deep network over raw user+item IDs from day one", feedback: "premature complexity. A deep model only pays off once you have rich side features to feed it and a baseline that has plateaued — neither is true on day one. Up front it costs far more to train and serve, is harder to debug, and on a 0.25%-dense ID matrix it tends to overfit. MF is the strong, cheap baseline you reach for FIRST; deep models come later, if at all." },
            { label: "k-nearest-neighbors over the raw 62K-wide rows", feedback: "wrong space, wrong cost. Exact neighbor search on 99.75%-empty 62K-wide rows is both slow (millions of high-dimensional comparisons) and noisy (two users overlapping on a single title look 'similar'). The fix is to factorize FIRST into a dense 64-d space, then do nearest-neighbor there if you want — MF is the prerequisite, not the alternative." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train the factors",
        narrative: `<p>Fit the user and item vectors by minimizing reconstruction error with an $\\ell_2$ penalty $\\lambda(\\lVert\\mathbf{p}_u\\rVert^2+\\lVert\\mathbf{q}_i\\rVert^2)$ so the factors don't overfit the handful of filled entries. The penalty term shrinks vectors toward zero unless the data really insists otherwise — crucial when most users have only ~23 plays.</p>
<p><b>How ALS actually solves it, step by step.</b> The loss $\\sum_{(u,i)}(r_{ui}-\\mathbf{p}_u^\\top\\mathbf{q}_i)^2+\\lambda(\\lVert\\mathbf{p}_u\\rVert^2+\\lVert\\mathbf{q}_i\\rVert^2)$ is non-convex in $P$ and $Q$ jointly, but if you FIX one side it becomes a plain ridge regression in the other. So ALS alternates: <b>(1)</b> hold all item vectors $\\mathbf{q}_i$ fixed and, for each user $u$ independently, solve the ridge regression $\\mathbf{p}_u=(Q_u^\\top Q_u+\\lambda I)^{-1}Q_u^\\top \\mathbf{r}_u$ — where $Q_u$ stacks the vectors of the items $u$ touched and $\\mathbf{r}_u$ their ratings; the $+\\lambda I$ is the regularizer that keeps the small $k\\times k$ matrix invertible even for a user with few plays. <b>(2)</b> Then swap: hold all user vectors fixed and solve the symmetric ridge $\\mathbf{q}_i=(P_i^\\top P_i+\\lambda I)^{-1}P_i^\\top \\mathbf{r}_i$ for each item. <b>(3)</b> Repeat (1)↔(2); every half-step is a closed-form least-squares solve and can never increase the loss, so it converges. Stop when validation recall stops improving.</p>`,
        concepts: ["ml-gradient-descent", "ml-regularization", "la-svd"],
        insight: `<b>Watch the gap, stop at the plateau.</b> Train loss keeps falling (<b>0.214 → 0.061</b>) but validation recall@10 plateaus at <b>0.188 by epoch 12</b> — pushing further would just memorize the sparse cells. The $\\lambda=0.05$ penalty and early stop are what keep a 64-d model honest; the result is two compact factor tables (162K×64 and 62K×64) ready to serve.`,
        symbols: [
          { sym: "$\\lambda$", desc: "regularization strength (here 0.05) — how hard the $\\ell_2$ penalty pulls vectors toward zero to prevent overfitting." },
          { sym: "$\\lVert\\mathbf{p}_u\\rVert^2$", desc: "the squared length of a user vector; penalizing it stops any one user's factors from growing wild on thin data." },
          { sym: "recall@10", desc: "validation metric — fraction of held-out plays that landed in the user's top 10; what early stopping watches." }
        ],
        steps: [{
          type: "run", label: "▶ Train ALS (k=64, λ=0.05)",
          result: { log: "alternating least squares, 25M ratings...\neach epoch = two half-steps of closed-form ridge solves:\n  fix items Q -> per user: p_u = (Q_u^T Q_u + lambda I)^-1 Q_u^T r_u\n  fix users P -> per item: q_i = (P_i^T P_i + lambda I)^-1 P_i^T r_i\nepoch 1  train loss 0.214  val recall@10 0.118\nepoch 5  train loss 0.092  val recall@10 0.171\nepoch 12 train loss 0.061  val recall@10 0.188  (val plateaued)\nbest epoch: 12   factors: users 162K x 64, movies 62K x 64", metrics: [{ k: "val recall@10", v: "0.188" }, { k: "k", v: "64" }], chart: { type: "line", title: "ALS training curve", xlabel: "epoch", series: [
            { name: "train loss", color: "#ff7b72", points: [[1, 0.214], [5, 0.092], [12, 0.061]] },
            { name: "val recall@10", color: "#7ee787", points: [[1, 0.118], [5, 0.171], [12, 0.188]] }
          ] } } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Offline metrics",
        narrative: `<p>Evaluate ranking, not rating, and do it the way the product is consumed. Use a <i>time-split</i> holdout — train on the past, test on the following week — so you never leak the future, and report recall@$K$ plus NDCG@$K$ which rewards putting the right title near the top. Always compare against the popularity baseline: beating it is the bar that proves personalization is doing real work.</p>`,
        concepts: ["ml-classification-metrics", "mlx-cross-validation", "ml-roc-auc"],
        insight: `<b>Personalization more than doubles relevance.</b> On the next-week holdout, MF hits <b>recall@10 0.188 vs 0.094</b> for popularity — a 2× lift — and surfaces <b>71% of the catalog vs just 9%</b>. That coverage number matters as much as recall: it's the evidence the model is using the long tail, not quietly collapsing onto blockbusters.`,
        data: {
          caption: "Offline holdout: MF vs the popularity baseline",
          columns: ["model", "recall@10", "NDCG@10", "catalog coverage"],
          rows: [
            ["popularity baseline", "0.094", "0.121", "9%"],
            ["matrix factorization", "0.188", "0.241", "71%"],
            ["lift", "2.0×", "2.0×", "7.9×"]
          ],
          note: `Time-split holdout = train on days 1–83, test on plays from days 84–90, so no future information leaks in. MF doubles ranking quality AND multiplies coverage 8× — but offline wins are a PROXY, which is exactly why the next decision is whether to ship blind.`
        },
        symbols: [
          { sym: "NDCG@10", desc: "discounted-gain ranking score in the top 10 — a hit in slot 1 counts more than slot 9." },
          { sym: "coverage", desc: "fraction of the 62K-movie catalog that ever appears in someone's top list — a long-tail health check." },
          { sym: "time-split", desc: "holdout strategy where test data is strictly LATER than training data, mimicking real deployment." }
        ],
        steps: [
          { type: "run", label: "▶ Evaluate on next-week holdout", result: { log: "time-split holdout: plays from the following 7 days\nMF      recall@10 0.188   NDCG@10 0.241\npopularity baseline   recall@10 0.094   NDCG@10 0.121\ncatalog coverage: MF surfaces 71% of titles vs 9% for popularity", metrics: [{ k: "recall@10", v: "0.188" }, { k: "NDCG@10", v: "0.241" }, { k: "coverage", v: "71%" }], chart: { type: "bars", title: "MF vs popularity (next-week holdout)", labels: ["recall@10 pop", "recall@10 MF", "NDCG@10 pop", "NDCG@10 MF"], values: [0.094, 0.188, 0.121, 0.241], valueLabels: ["0.094", "0.188", "0.121", "0.241"], colors: ["#ffb454", "#4ea1ff", "#ffb454", "#4ea1ff"] } } },
          { type: "decide", prompt: "MF doubles recall@10 over popularity. Is it ready to ship blind?",
            options: [
              { label: "No — offline gains don't guarantee online lift; validate with an A/B test", best: true, feedback: "right. Offline recall is computed against logged plays that the OLD system chose to show, so it's a biased proxy: it can't see the titles users would have played if you'd surfaced them. Online, the metrics that actually pay the bills — watch-time, retention, novelty — can move differently because of position bias and feedback loops. A doubled offline number earns the model a live A/B test, where real exposure measures real lift." },
              { label: "Yes — recall doubled, ship to 100%", feedback: "this skips the most failure-prone step. Offline-online gaps are the norm, not the exception: position bias inflates familiar items, and the feedback loop means your training data was shaped by the previous model. A 2× offline win is a strong green light to TEST on a slice of traffic — but launching to everyone before a live experiment is how teams ship a metric that looks great offline and flat (or worse) online." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Cold start & diversity",
        narrative: `<p>Two complaints surface after launch: brand-new users with zero rating history get generic rows, and the row feels repetitive — five near-identical action films stacked together. Both are classic recommender failure modes, and crucially they are <i>different</i> problems: cold start is a missing-signal problem, repetition is a ranking problem. Fixing them needs two different tools, not more model capacity.</p>`,
        concepts: ["cls-bandits", "dl-cosine-similarity", "mlx-error-analysis"],
        insight: `<b>Two failures, two fixes.</b> A cold user has no vector, so MF falls back to popularity — but you can bootstrap from <b>signup genre prefs</b> and let a <b>bandit</b> explore to learn their taste within a few sessions. Repetition is separate: when the top items share a vector direction (cosine similarity <b>&gt;0.9</b>), a diversity re-rank demotes the duplicates so the row spans more of the user's interests.`,
        symbols: [
          { sym: "bandit", desc: "an explore/exploit policy that occasionally shows uncertain items to LEARN a new user's taste faster, instead of always exploiting the current best guess." },
          { sym: "cosine similarity", desc: "$\\cos(\\mathbf{q}_i,\\mathbf{q}_j)=\\frac{\\mathbf{q}_i^\\top\\mathbf{q}_j}{\\lVert\\mathbf{q}_i\\rVert\\,\\lVert\\mathbf{q}_j\\rVert}$ — how aligned two item vectors are; near 1 means near-duplicate." },
          { sym: "cold start", desc: "the no-history regime for a brand-new user or title, where the learned vector doesn't exist yet." }
        ],
        steps: [{
          type: "decide", prompt: "How do you handle cold-start users and repetitive rows?",
          options: [
            { label: "Use signup/genre prefs + a bandit to explore for new users, and re-rank for diversity via item similarity", best: true, feedback: "this addresses each failure with the right tool. For cold start, SIDE FEATURES (signup genre picks, device, region) give a starting taste estimate, and a BANDIT explores a little to learn fast instead of waiting passively for plays. For repetition, a diversity RE-RANK that penalizes high cosine similarity between item vectors breaks up near-duplicates so the row covers more of the user's interests. Two problems, two targeted mechanisms." },
            { label: "Just show the same popularity row to every cold user forever", feedback: "safe but it never learns. A static popularity row treats every new user identically and gathers no personalized signal, so you permanently forfeit the engagement you could have earned by exploring even a little. New users are exactly where a small amount of exploration pays off most — freezing them on popularity leaves that value on the table." },
            { label: "Add more latent factors to fix repetition", feedback: "wrong lever. Repetition isn't a capacity shortage — the model has PLENTY of room to express that the top five items are all action. Adding factors won't stop it from stacking similar items, because the issue is the ranking objective rewarding relevance without regard to redundancy. The fix lives in a diversity-aware re-rank, not in $k$." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Two-stage serving",
        narrative: `<p>Scoring all 62K movies for every request is too slow at 162K users. Production recommenders split serving into two stages: <b>retrieval</b> narrows 62K to a few hundred candidates with a fast approximate nearest-neighbor lookup over the latent vectors, then <b>ranking</b> applies a richer (and slower) re-ranker only to that shortlist. This is the pattern that makes personalization fit inside a single-digit-millisecond budget.</p>`,
        concepts: ["dl-cosine-similarity", "fnd-dot", "cls-recommender"],
        insight: `<b>62K → 500 → 10.</b> ANN (Approximate Nearest Neighbor) retrieval collapses the 62K-movie catalog to ~<b>500 candidates</b> in a few ms, the re-ranker orders those, and the top <b>10</b> fill the row. The canary confirms it holds: <b>p99 latency 38ms</b> and shadow online recall@10 <b>0.181</b> — within a hair of the 0.188 offline number, so the serving approximation costs almost nothing.`,
        symbols: [
          { sym: "ANN", desc: "Approximate Nearest Neighbor — sub-linear vector search that finds 'close' item vectors without scanning all 62K exactly." },
          { sym: "p99 latency", desc: "the 99th-percentile response time (38ms here) — 99% of requests finish faster, the tail users care about." },
          { sym: "retrieval / ranking", desc: "the two serving stages: cheap recall-oriented shortlisting, then precise ordering of the shortlist." }
        ],
        steps: [
          { type: "decide", prompt: "How should the home row be served?",
            options: [
              { label: "Retrieve top ~500 by approximate nearest neighbor on user/item vectors, then re-rank that shortlist", best: true, feedback: "two-stage is the standard, and here's the mechanism: ANN exploits the dense latent space to find ~500 plausible candidates in milliseconds without scoring all 62K, then a richer re-ranker — which can afford more features per item — orders just that shortlist. You get most of the accuracy of full scoring at a tiny fraction of the cost. The shadow recall (0.181 vs 0.188 offline) shows the approximation barely hurts." },
              { label: "Score every one of the 62K movies for every request in real time", feedback: "accurate in principle but economically impossible here. At 162K users each requesting rows, scoring 62K movies per request is millions of dot products per second of needless work — latency blows past budget and serving cost explodes. Retrieval-then-rank exists PRECISELY to avoid this: the vast majority of those 62K movies would never make the row, so spending compute to rank them is wasted." }
            ] },
          { type: "run", label: "▶ Ship (canary 5% → 100%)", result: { log: "building ANN index over 62K movie vectors...\ncanary 5%: p99 latency 38ms, error rate 0.0%\nshadow online recall@10 vs offline: 0.181 (close)\npromoting to 100% ...\nlive.", metrics: [{ k: "p99 latency", v: "38ms" }, { k: "rollout", v: "100%" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor the feedback loop",
        narrative: `<p>Recommenders shape the very data they train on: you only ever learn about items you chose to show. Left unwatched, this feedback loop slowly narrows the catalog — the model favors what it already surfaces, those items get more plays, and the next training round favors them even more. Monitoring isn't just uptime; it's watching for this self-reinforcing collapse before it strands the long tail.</p>`,
        concepts: ["mlx-error-analysis", "cls-bandits", "prob-clt"],
        insight: `<b>The loop is already tightening.</b> In one week online recall@10 slipped <b>0.181 → 0.166</b> and catalog coverage fell <b>71% → 58%</b> — the model is quietly retreating toward blockbusters. An average watch-time dashboard would have looked fine; only tracking <b>coverage and tail exposure</b> exposes the narrowing in time to act (boost exploration, refactorize).`,
        symbols: [
          { sym: "feedback loop", desc: "the cycle where the model's own recommendations become its next training data, amplifying whatever it already shows." },
          { sym: "tail exposure", desc: "how often long-tail (non-blockbuster) titles get surfaced — the early-warning gauge for catalog collapse." },
          { sym: "per-segment", desc: "metrics broken out by user group, so a model that helps the average while hurting a segment is caught." }
        ],
        steps: [
          { type: "decide", prompt: "What should you monitor in production?",
            options: [
              { label: "Online recall/NDCG, catalog coverage & tail exposure, plus per-segment watch-time, with alerts on drift", best: true, feedback: "this watches both halves of the failure mode. Online recall/NDCG track whether ranking quality is holding, while COVERAGE and tail exposure catch the feedback loop quietly collapsing the catalog onto blockbusters — a failure that ranking metrics alone can miss for a while. Per-segment watch-time catches a model that lifts the average while regressing a specific group. Alerts on drift turn all three into early warnings instead of post-mortems." },
              { label: "Just overall average watch-time", feedback: "a single average is exactly the blind spot the feedback loop exploits. Watch-time can hold steady — or even tick up — while catalog coverage craters and a whole user segment quietly regresses, because the average is dominated by the majority watching blockbusters. By the time a shrinking catalog drags the mean down, you've lost weeks of tail exposure. You need coverage and per-segment views, not one number." }
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
        narrative: `<p>You build a learning-to-rank model on <b>MS MARCO</b> (Microsoft's Bing-derived benchmark): over <b>1 million real anonymized Bing queries</b>, each paired against a corpus of <b>8.8 million passages</b> with human relevance judgments. A single query can return thousands of candidate documents, yet users only ever look at the first few — click-through falls off a cliff after the first page. So the task is not to score each document in isolation but to <i>order</i> them, putting the most relevant ones where the eyes already are. Framing this as ranking (not classification, not regression) decides which loss, which metric, and which model you reach for next.</p>`,
        concepts: ["ai-linear-predictors", "ml-classification-metrics", "ml-roc-auc"],
        insight: `<b>Attention is brutally top-heavy.</b> The classic learning-to-rank benchmarks — <b>LETOR</b> and the <b>Yahoo! Learning-to-Rank Challenge</b> set (~36K queries, ~883K query-document feature vectors) — grade relevance on a <b>0–4</b> scale precisely because position matters: roughly <b>90% of clicks land in the top 5 results</b> and the first organic result alone can take <b>~30% of clicks</b>. That is why you optimize a position-weighted metric like NDCG@K (Normalized Discounted Cumulative Gain) — a perfect document buried at rank 12 is, for the user, invisible. Ordering <i>is</i> the product.`,
        symbols: [
          { sym: "NDCG@$K$", desc: "Normalized Discounted Cumulative Gain over the top $K$ results — rewards placing high-grade docs near the top, with a discount that shrinks as you go down the list." },
          { sym: "$K$", desc: "the cutoff rank you score at (e.g. $K=10$, the first page) — positions below it barely matter because users rarely look." },
          { sym: "learning-to-rank", desc: "training a model to optimize the ORDER of a list directly, rather than predicting each item's label independently." }
        ],
        steps: [{
          type: "decide", prompt: "How should you frame ranking search results?",
          options: [
            { label: "Learning-to-rank: optimize the ORDER of the result list, scored by a rank metric like NDCG", best: true, feedback: "exactly. The product the user sees is an ordered list, so the objective must reward relative position — which doc sits above which, especially near the top. A rank metric like NDCG@$K$ bakes in a position discount, so the model is paid most for getting rank 1–3 right. That alignment between loss and what the user experiences is the whole reason learning-to-rank exists." },
            { label: "Independent binary classification: is each document relevant, yes/no?", feedback: "pointwise classification throws away the relativity that matters. Two docs can both be labeled 'relevant', but one still has to go first — and a yes/no model has no opinion about that ordering. It also wastes effort calibrating a relevance probability deep in the list where no user will ever look, instead of sharpening the top few positions that actually get clicks." },
            { label: "Regression to predict exact dwell-time seconds per document", feedback: "this optimizes a noisy proxy that's one step removed from the goal. Dwell-time in seconds is enormously variable per user and per document, and being accurate to the second never guarantees the right ORDER — you can predict everyone's dwell time perfectly and still rank the best doc second. You ship a sorted list, so optimize the sort, not the seconds." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather labels",
        narrative: `<p>You need a relevance label for every (query, document) pair you might rank. Two sources exist and neither is enough alone: human editorial judgments are gold-standard but scarce and expensive, while click logs are virtually free and abundant but biased toward whatever already ranked high. The craft here is combining them — debias the clicks so they reflect relevance rather than position, then anchor that signal to a smaller trusted set of graded judgments.</p>
<p><b>How the debiasing actually works, step by step.</b> A click depends on two things: did the user EXAMINE the result, and (if so) was it RELEVANT. Formally $P(\\text{click}\\mid q,d,\\text{rank}) = p_{\\text{examine}}(\\text{rank}) \\times \\text{rel}(q,d)$. Rank 1 gets clicked partly just for being seen, so to recover relevance you have to divide the click signal by how often that rank is even looked at.</p>
<p><b>1. Estimate $p_{\\text{examine}}(\\text{rank})$ with a result-randomization experiment.</b> On ~1% of traffic, randomly shuffle the top results before showing them. Because a document now lands at each rank by chance (not because it was good), the click-through rate at each position reflects only how often that position is examined — not relevance. The CTR you measure at rank $r$ under randomization IS the estimate $p_{\\text{examine}}(r)$. (Where you can't randomize, an EM (Expectation–Maximization)-based position-bias model recovers the same curve from organic logs by jointly fitting examination and relevance.)</p>
<p><b>2. Debias each click with Inverse Propensity Weighting (IPW).</b> $\\text{debiased\\_relevance}(q,d) = \\dfrac{\\text{clicks}(q,d)}{p_{\\text{examine}}(\\text{rank shown})}$. A click at rank 7 (rarely examined, small $p$) is divided by a small number and so gets UP-weighted; a click at rank 1 (almost always examined, $p\\approx 1$) is divided by ~1 and barely changes. This lifts genuinely good documents that the old ranking buried.</p>
<p><b>3. Anchor to the editorial grades.</b> The debiased numbers are unitless, so calibrate them onto the 0–4 editorial scale using the 42K graded pairs (e.g. isotonic/linear fit), so a debiased label finally reads as a relevance grade rather than a reweighted click count.</p>`,
        concepts: ["ml-supervised", "ml-logistic-regression", "prob-bernoulli-binomial"],
        insight: `<b>Cheap signal, expensive anchor — and the rank where it was shown matters.</b> The Yahoo! LTR benchmark ships <b>883,000 query-document rows</b>, each a <b>700-feature vector</b> with a <b>0–4 editorial grade</b> over <b>36,000 queries</b>. In production you augment those scarce expert grades with abundant click logs: you might assemble <b>58M query-doc pairs</b> from Bing-scale clicks but anchor to only ~42K editorial grades — clicks outnumber expert labels ~1,400 to 1. Estimated examination probabilities fall off fast — about <b>$p_{\\text{examine}}=[1.0,\\ 0.64,\\ 0.49,\\ \\ldots,\\ 0.18]$ by rank 1, 2, 3, … 7</b>. So a doc shown at rank 7 with <b>30 clicks / 1000 impr.</b> has raw CTR $0.03$ but debiased relevance $0.03/0.18 = \\mathbf{0.167}$ — which lifts it ABOVE a rank-1 doc with the same raw CTR ($0.03/1.0 = 0.03$). That single division stops you training the old ranking's bias back into the model; then the editorial grades calibrate everything to the 0–4 scale.`,
        data: {
          caption: "LETOR-style (qid, doc features, label) training table + click signals",
          columns: ["qid", "doc", "feat: BM25", "shown rank", "clicks / impr.", "label (0–4)", "debiased label"],
          rows: [
            ["q:001", "doc_8841", "12.4", "1", "0.42", "—", "3.1"],
            ["q:001", "doc_2207", "6.1", "7", "0.05", "4", "3.9"],
            ["q:014", "doc_5560", "9.8", "2", "0.18", "—", "2.4"],
            ["q:027", "doc_0001", "15.2", "1", "0.71", "4", "4.0"],
            ["… 58M pairs", "…", "…", "…", "…", "…", "…"]
          ],
          note: `LETOR/Yahoo rows key on <b>qid</b> + a dense feature vector (BM25 and ~699 others) with a <b>0–4 label</b>; most click-log pairs have no editorial grade (—) and the ~42K that do anchor the scale. Notice doc_2207 sat at rank 7 with few clicks yet is graded 4 (perfect) — position bias hid it, so the debiased label lifts it above its raw click rate. That correction is exactly what training on raw clicks would miss.`
        },
        symbols: [
          { sym: "position bias", desc: "the tendency for higher-ranked results to be clicked simply because they're higher, regardless of true relevance." },
          { sym: "$p_{\\text{examine}}(\\text{rank})$", desc: "examination probability — the chance a user actually looked at the result at a given rank, estimated by the CTR at that rank under result randomization (shuffle top results on ~1% of traffic so position, not quality, decides where a doc lands)." },
          { sym: "IPW", desc: "Inverse Propensity Weighting — the debiasing formula $\\text{debiased\\_relevance}(q,d)=\\text{clicks}(q,d)/p_{\\text{examine}}(\\text{rank shown})$; dividing by a small $p$ up-weights clicks at rarely-examined low ranks." },
          { sym: "grade 0–4", desc: "the editorial relevance scale, from 0 (irrelevant) to 4 (perfect) — the trusted anchor the debiased clicks are calibrated onto." }
        ],
        steps: [
          { type: "decide", prompt: "What relevance labels should you train on?",
            options: [
              { label: "Clicks debiased for position, anchored by a smaller set of editorial graded judgments", best: true, feedback: "this gets both scale and trust. Raw clicks suffer position bias — rank 1 gets clicked partly for BEING rank 1 — so you reweight them by examination probability to recover a relevance-like signal, then calibrate that signal against the 42K editorial grades so the numbers mean something. Clicks give you coverage of the long tail; editorial grades give you a ground truth to anchor to. Combining them is what makes the labels trustworthy at 58M-pair scale." },
              { label: "Raw clicks, treating any click as 'relevant'", feedback: "this bakes the current ranking's bias straight into your labels. Because the top result gets clicked regardless of quality, raw clicks mostly measure WHERE a doc was shown, not how good it is. Train on them and the model learns to reproduce today's ranking — a feedback loop that can never discover that a great doc stuck at rank 7 deserves to be higher. Debiasing is the whole point." },
              { label: "Only hand-graded editorial judgments", feedback: "high quality but far too few. 42K graded pairs can't begin to cover 1M+ queries, and they cluster on common head queries — leaving the 64% long tail of rare queries unlabeled, which is exactly where you most need to generalize. Editorial grades are the right ANCHOR, but as the entire training set they starve the model of coverage." }
            ] },
          { type: "run", label: "▶ Estimate examination probability (result randomization)", prompt: "Run a 1% randomization slice and read off p_examine per rank, then debias.",
            result: { log: "randomization slice: 1% of traffic, top-10 results shuffled\nmeasuring CTR at each rank (position decided by chance, not relevance):\n  rank 1  CTR 0.300 -> p_examine 1.00\n  rank 2  CTR 0.192 -> p_examine 0.64\n  rank 3  CTR 0.147 -> p_examine 0.49\n  rank 4  CTR 0.114 -> p_examine 0.38\n  rank 5  CTR 0.090 -> p_examine 0.30\n  rank 7  CTR 0.054 -> p_examine 0.18\nIPW debias: debiased = clicks/impr / p_examine(rank)\n  worked: doc_2207 shown at rank 7, 30 clicks/1000 impr -> raw CTR 0.030\n          debiased = 0.030 / 0.18 = 0.167\n  vs a rank-1 doc, same raw CTR 0.030 -> 0.030 / 1.00 = 0.030\n  => the rank-7 doc now outranks the rank-1 doc (0.167 > 0.030)", metrics: [{ k: "p_examine r7", v: "0.18" }, { k: "raw CTR r7", v: "0.030" }, { k: "debiased r7", v: "0.167" }] } },
          { type: "run", label: "▶ Assemble the judgment set", prompt: "Build the (qid, doc, label) training table.",
            result: { log: "joining MS MARCO queries + click logs + editorial grades...\nqueries: 1,010,000 (MS MARCO scale)   query-doc pairs: 58,000,000\ndebias clicks: divide each by p_examine(rank shown)  [IPW]\nanchor: calibrate debiased scores onto editorial 0..4 scale (42,000 graded pairs)\ngraded relevance: 0 (irrelevant) .. 4 (perfect)", metrics: [{ k: "queries", v: "1.01M" }, { k: "pairs", v: "58M" }, { k: "editorial", v: "42K" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore queries",
        narrative: `<p>Profile the query distribution before you model anything — its shape dictates your whole strategy. In MS MARCO most of the 1.01M Bing queries are <i>distinct, naturally-phrased questions</i>, split between a heavy head of a few hugely popular queries and a vast tail of rare, often unique ones, and many candidate passages are near-duplicates that can clog the top results. Understanding that 64% of unique queries are seen only once tells you immediately that memorization is hopeless and generalization is everything.</p>`,
        concepts: ["prob-variance", "mlx-error-analysis", "ml-classification-metrics"],
        insight: `<b>The tail is where the work is.</b> The top <b>0.1% of queries pull 41% of traffic</b>, but <b>64% of unique queries are seen ≤ once</b> — you can never collect per-query training data for them. MS MARCO is built this way on purpose: most queries have only <b>~1 known-relevant passage</b> against millions of candidates, and even a graded benchmark averages just <b>~6.2 relevant docs per query</b> — so the ranker's real job is separating a handful of needles from mostly-noise it has never seen before.`,
        chart: { type: "bars", title: "Traffic share by query segment", labels: ["head (top 0.1%)", "torso", "tail (seen <= once)"], values: [41, 44, 15], valueLabels: ["41%", "44%", "15%"], colors: ["#4ea1ff", "#ffb454", "#ff7b72"] },
        data: {
          caption: "Query distribution & relevance profile",
          columns: ["query segment", "share of traffic", "share of unique queries", "labeled history?"],
          rows: [
            ["head (top 0.1%)", "41%", "&lt;0.1%", "rich"],
            ["torso", "44%", "~36%", "some"],
            ["tail (seen ≤ once)", "15%", "64%", "—"],
            ["… per-query", "…", "…", "…"]
          ],
          note: `A tiny set of head queries dominates traffic but carries plenty of labels; the long tail is the opposite — most of the distinct queries, almost no per-query history. Memorized rules would only ever help the head; the tail (64% of unique queries) demands features that transfer to queries never seen in training.`
        },
        symbols: [
          { sym: "head / tail", desc: "head = the few very frequent queries with rich history; tail = the many rare queries (often seen once) with no per-query data." },
          { sym: "relevant docs / query", desc: "how many of the thousands of candidates are actually on-topic (~6.2 here) — the signal hiding in the noise." },
          { sym: "near-duplicate", desc: "documents with nearly identical content that crowd out variety in the top results (here for ~8% of queries)." }
        ],
        steps: [
          { type: "run", label: "▶ Profile queries & relevance", result: { log: "head queries (top 0.1%) -> 41% of traffic\ntail queries seen <=1 time: 64% of unique queries\navg relevant docs per query: 6.2 (most candidates are noise)\nfound near-duplicate docs inflating top results for 8% of queries", metrics: [{ k: "tail share", v: "64% unique" }, { k: "dup queries", v: "8%" }] } },
          { type: "decide", prompt: "Most unique queries are rare and unseen. What does that demand?",
            options: [
              { label: "Features that generalize across queries (text-match, embeddings) rather than memorized per-query rules", best: true, feedback: "right — the 64% tail makes memorization a dead end, so you need features whose meaning transfers. Query-document match scores (does the query's text appear in the doc?) and semantic embeddings (does the doc MEAN the same thing?) compute the same way for a query the model has never seen as for one it has. That transferability is exactly what lets one model serve both the head and the unseen tail." },
              { label: "A separate hand-tuned ranking rule for each query", feedback: "this can't scale and can't reach the tail. Hand-tuning 1.2M+ distinct queries is impossible operationally, and even if you tried, 64% of unique queries are seen only once — there's no traffic to tune a rule against, and a brand-new query tomorrow has no rule at all. Per-query rules optimize the few you've already seen while abandoning the majority you haven't." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Engineer ranking features",
        narrative: `<p>A strong ranker blends complementary signals so it catches relevance from several angles at once. Lexical features like BM25 reward exact term overlap; semantic features compute the cosine similarity between query and document embeddings, $\\cos(\\mathbf{q},\\mathbf{d})=\\frac{\\mathbf{q}^\\top\\mathbf{d}}{\\lVert\\mathbf{q}\\rVert\\,\\lVert\\mathbf{d}\\rVert}$, to catch paraphrases that share no keywords; and document-quality signals like freshness or authority break ties between two equally on-topic results. The cosine reads symbol by symbol: $\\mathbf{q}^\\top\\mathbf{d}$ is the dot product of the two embedding vectors, and dividing by the norms $\\lVert\\mathbf{q}\\rVert\\,\\lVert\\mathbf{d}\\rVert$ rescales it to a pure angle between $-1$ and $1$, so only DIRECTION (meaning), not length, matters.</p>`,
        concepts: ["dl-cosine-similarity", "dl-word-embeddings", "fnd-norm"],
        insight: `<b>Lexical and semantic cover each other's blind spots.</b> BM25 nails exact-keyword queries but scores <b>0</b> when the words differ — \"cheap flights\" vs \"budget airfare\" share no terms. Semantic cosine catches that paraphrase (high $\\cos$ despite zero word overlap) but can drift on exact names. Blended, plus quality/freshness tie-breakers, they form the backbone of modern ranking — and on the tail, the semantic feature ends up the single strongest signal.`,
        data: {
          caption: "Per (query, doc) feature row fed to the ranker",
          columns: ["feature", "what it measures", "\"budget airfare\" → flights doc", "\"acme login\" → login doc"],
          rows: [
            ["BM25", "exact term-overlap score", "0.0 (no shared words)", "8.7 (strong overlap)"],
            ["$\\cos(\\mathbf{q},\\mathbf{d})$", "embedding angle / meaning", "0.81 (same intent)", "0.74"],
            ["freshness", "age of the document", "0.6", "0.9"],
            ["doc quality", "authority / spam score", "0.88", "0.95"],
            ["… more features", "…", "…", "…"]
          ],
          note: `See the complementarity: for \"budget airfare\" BM25 is 0 (different words) yet cosine is 0.81 (same meaning) — semantic rescues the paraphrase. For \"acme login\" both fire. Quality and freshness sit alongside to break ties when two docs are equally relevant.`
        },
        symbols: [
          { sym: "$\\cos(\\mathbf{q},\\mathbf{d})$", desc: "cosine similarity — the angle between the query and document embedding vectors; near 1 means same meaning, near 0 means unrelated." },
          { sym: "$\\mathbf{q},\\ \\mathbf{d}$", desc: "the query and document embedding vectors (learned dense representations of their text)." },
          { sym: "$\\mathbf{q}^\\top\\mathbf{d}$", desc: "their dot product — sums how much the two vectors point the same way before normalization." },
          { sym: "$\\lVert\\mathbf{q}\\rVert$", desc: "the norm (length) of a vector; dividing by the norms makes cosine depend on direction (meaning), not magnitude." },
          { sym: "BM25", desc: "a classic lexical relevance score based on how often the query's terms appear in the document, with diminishing returns." }
        ],
        steps: [{
          type: "decide", prompt: "Which feature set ranks best?",
          options: [
            { label: "Lexical match (BM25) + semantic cosine similarity of query/doc embeddings + doc quality/freshness signals", best: true, feedback: "this blend wins because the signals are complementary, not redundant. BM25 handles exact-keyword and navigational queries; semantic cosine catches synonyms and paraphrases where the words differ but the meaning matches; and quality/freshness break ties between two docs that are equally on-topic. Each covers a failure mode of the others, which is why no single one is enough and the combination is the modern-ranking backbone." },
            { label: "Only exact keyword overlap counts", feedback: "pure lexical match is brittle precisely on the tail you most need to serve. It scores zero for 'cheap flights' against a doc about 'budget airfare' because they share no words, even though they mean the same thing — so every synonym, paraphrase, or intent-level match slips through. You'd rank the head fine and fail the rephrased long tail, which is the opposite of generalization." },
            { label: "Only the document's global popularity, ignoring the query", feedback: "this isn't ranking FOR the query at all. A query-independent popularity score returns the same handful of popular docs no matter what was searched, so it can't tell apart two totally different searches. Popularity is a fine TIE-BREAKER among already-relevant docs, but as the whole feature set it ignores the one thing search must respect: the query." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick a ranker",
        narrative: `<p>You now have tabular ranking features (BM25, cosine, freshness, quality) and graded labels, and three constraints that narrow the choice: the model must optimize list ORDER directly, capture interactions between features, and serve within a tight latency budget across thousands of candidates. That combination — tabular inputs, a rank-aware objective, millisecond serving — points squarely at gradient-boosted trees rather than a linear model or a heavy network.</p>`,
        concepts: ["cls-gradient-boosting", "cls-stacking", "ai-linear-predictors"],
        insight: `<b>Boosted trees own tabular ranking.</b> LambdaMART optimizes a <b>listwise</b> objective: each gradient step weights a pairwise swap by how much it would move NDCG, so the model is paid directly for getting the top positions right. It captures feature interactions (BM25 high AND fresh) that a linear model can't, while still scoring a candidate in microseconds — the reason it remains the industry default for learning-to-rank.`,
        symbols: [
          { sym: "LambdaMART", desc: "a gradient-boosted decision-tree ranker whose gradients ('lambdas') are scaled by each swap's effect on the rank metric." },
          { sym: "listwise", desc: "an objective that considers the whole ranked list at once (vs pointwise = one item at a time, pairwise = two at a time)." },
          { sym: "feature interaction", desc: "when the effect of one feature depends on another (e.g. freshness matters more for news queries) — trees model this naturally; a linear model doesn't." }
        ],
        steps: [{
          type: "decide", prompt: "Choose a learning-to-rank model.",
          options: [
            { label: "LambdaMART (gradient-boosted trees with a listwise rank objective)", best: true, feedback: "this is the workhorse for a reason: it matches all three constraints. The listwise objective scales each tree's gradient by how a swap would change NDCG, so training pushes directly on the metric you ship. Trees capture the feature interactions that drive relevance (a high BM25 means more when the doc is also fresh), it's robust on heterogeneous tabular features without heavy preprocessing, and it serves in microseconds. Right tool, right job." },
            { label: "Plain linear regression on the features", feedback: "a fine sanity-check baseline, but it's pointwise and additive. Pointwise means it scores each doc in isolation and never optimizes the relative order that NDCG cares about; additive means it can't represent interactions like 'freshness matters only for news queries'. It'll be beaten by a model that's both rank-aware and able to combine features non-linearly — which is exactly LambdaMART." },
            { label: "A large transformer scoring every candidate at full depth", feedback: "powerful for relevance but it breaks the latency budget at this stage. Running a deep transformer over thousands of candidates per query is far too slow and expensive to serve under a search SLA (Service Level Agreement). Its place is RE-RANKING a small shortlist of a few dozen after a cheaper model has narrowed the field — not as the first-pass ranker over the whole candidate set." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train the ranker",
        narrative: `<p>Fit LambdaMART by adding trees one at a time, each correcting the last, with a listwise objective so every gradient step is weighted by the NDCG change a pairwise swap would produce. Because boosting will keep fitting the training set forever, you watch validation NDCG and stop the moment it stops improving — early stopping is the regularizer that prevents memorizing the labels. The gap between train and validation NDCG is your overfitting gauge.</p>`,
        concepts: ["ml-gradient-descent", "ml-regularization", "cls-gradient-boosting"],
        insight: `<b>Stop before train and valid diverge.</b> Train NDCG@10 climbs to <b>0.704</b> while validation plateaus at <b>0.631</b> — that widening gap is overfitting, so early stopping fires at iteration <b>412</b> of a planned 500. The top feature is <b>semantic cosine similarity</b>, confirming the embedding signal does the heavy lifting, especially on the long tail.`,
        symbols: [
          { sym: "iteration / tree", desc: "one boosting round that adds a new decision tree correcting the current ensemble's errors." },
          { sym: "early stopping", desc: "halting training when validation NDCG stops improving — a regularizer that prevents the model from memorizing training labels." },
          { sym: "train vs valid gap", desc: "the difference between training and validation NDCG; a growing gap signals overfitting." }
        ],
        steps: [{
          type: "run", label: "▶ Train LambdaMART (500 trees)",
          result: { log: "training listwise boosted ranker...\n[100] train NDCG@10 0.612  valid NDCG@10 0.588\n[300] train NDCG@10 0.671  valid NDCG@10 0.624\n[480] train NDCG@10 0.704  valid NDCG@10 0.631  (early stop)\nbest iteration: 412   top feature: semantic cosine sim", metrics: [{ k: "valid NDCG@10", v: "0.631" }, { k: "trees", v: "412" }], chart: { type: "line", title: "LambdaMART training curve (NDCG@10)", xlabel: "trees", ylabel: "NDCG@10", series: [
            { name: "train NDCG@10", color: "#ff7b72", points: [[100, 0.612], [300, 0.671], [480, 0.704]] },
            { name: "valid NDCG@10", color: "#7ee787", points: [[100, 0.588], [300, 0.624], [480, 0.631]] }
          ] } } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate ranking",
        narrative: `<p>Evaluate the way the product is consumed: NDCG@K rewards placing high-grade docs near the top via a position discount, and MRR tracks how high the first relevant result lands. Always compare against the CURRENT production ranker on a fresh, held-out set of queries — beating production, not beating zero, is the bar. And slice head versus tail separately, because an aggregate win can hide a regression on one segment.</p>
<p><b>How NDCG@K is actually computed, step by step.</b> Start from the graded relevance $g_i\\in\\{0,1,2,3,4\\}$ of the doc at each rank $i$. (1) <b>DCG@K</b> (Discounted Cumulative Gain) sums the gains with a logarithmic position discount: $\\text{DCG@}K=\\sum_{i=1}^{K}\\dfrac{2^{g_i}-1}{\\log_2(i+1)}$. The $2^{g_i}-1$ makes a grade-4 doc worth far more than a grade-1; the $\\log_2(i+1)$ shrinks the credit as you go down (rank 1 divides by $\\log_2 2=1$, rank 2 by $\\log_2 3\\approx1.585$, rank 3 by $2$, …). (2) <b>IDCG@K</b> is the same sum for the IDEAL ordering — the docs sorted by grade, best first — the largest DCG achievable. (3) <b>Normalize</b>: $\\text{NDCG@}K=\\text{DCG@}K/\\text{IDCG@}K$, which lands in $[0,1]$ so queries with different numbers of relevant docs are comparable. Worked: grades $[3,2,3,0,1]$ give $\\text{DCG}= \\frac{7}{1}+\\frac{3}{1.585}+\\frac{7}{2}+0+\\frac{1}{2.585}=12.27$; the ideal order $[3,3,2,1,0]$ gives $\\text{IDCG}=7+\\frac{7}{1.585}+\\frac{3}{2}+\\frac{1}{2.322}+0=13.35$, so $\\text{NDCG}=12.27/13.35=0.92$.</p>`,
        concepts: ["ml-classification-metrics", "ml-roc-auc", "mlx-cross-validation"],
        insight: `<b>Biggest wins are on the tail.</b> On 80K fresh queries the new ranker beats production <b>NDCG@10 0.631 vs 0.597</b> and lifts the tail <b>+6.8%</b> versus only <b>+3.1%</b> on the head — the semantic feature pays off most exactly where there's no per-query history. MRR (Mean Reciprocal Rank) also rises (<b>0.502 vs 0.471</b>), so the first relevant result lands higher too.`,
        data: {
          caption: "New ranker vs current production (80K-query holdout)",
          columns: ["ranker", "NDCG@10", "MRR", "head NDCG", "tail NDCG"],
          rows: [
            ["production", "0.597", "0.471", "baseline", "baseline"],
            ["LambdaMART v2", "0.631", "0.502", "+3.1%", "+6.8%"],
            ["… per-segment", "…", "…", "…", "…"]
          ],
          note: `The new ranker wins overall AND on both segments, but the tail (+6.8%) gains roughly double the head (+3.1%) — the semantic embeddings generalize to rare queries that lexical-only ranking fumbles. Still: these are offline numbers on debiased-click labels, which is why the next step is a live test, not a launch.`
        },
        symbols: [
          { sym: "DCG@$K$", desc: "Discounted Cumulative Gain: $\\sum_{i=1}^{K}(2^{g_i}-1)/\\log_2(i+1)$ — sums graded relevance with a log position discount, so a hit at rank 1 counts more than the same hit at rank 9." },
          { sym: "IDCG@$K$", desc: "the DCG of the IDEAL ranking (docs sorted by grade, best first) — the maximum achievable DCG, used as the denominator." },
          { sym: "NDCG@10", desc: "DCG@10 / IDCG@10 — the position-discounted relevance of the top 10, normalized to [0,1] so queries with different relevant-doc counts compare fairly." },
          { sym: "MRR", desc: "Mean Reciprocal Rank — averages $1/\\text{rank}$ of the first relevant result, so getting one good answer high matters most." },
          { sym: "holdout", desc: "queries withheld from training and dated AFTER it, used to estimate fresh, unleaked performance." }
        ],
        steps: [
          { type: "run", label: "▶ Evaluate vs current production ranker", result: { log: "holdout: 80,000 fresh queries\nNDCG@10 per query: DCG@10 / IDCG@10 with gains (2^g - 1) and log2(i+1) discount\n  e.g. grades [3,2,3,0,1]: DCG 12.27 / IDCG(ideal [3,3,2,1,0]) 13.35 = 0.92\n  average over 80,000 queries ->\nLambdaMART  NDCG@10 0.631   MRR 0.502\nproduction  NDCG@10 0.597   MRR 0.471\nhead queries: +3.1% NDCG   tail queries: +6.8% NDCG (semantic helps most on rare queries)", metrics: [{ k: "NDCG@10", v: "0.631" }, { k: "MRR", v: "0.502" }, { k: "tail lift", v: "+6.8%" }], chart: { type: "bars", title: "NDCG lift by query segment (vs production)", labels: ["head", "tail"], values: [3.1, 6.8], valueLabels: ["+3.1%", "+6.8%"], colors: ["#4ea1ff", "#7ee787"] } } },
          { type: "decide", prompt: "NDCG is up overall and on the tail. Ship straight to 100%?",
            options: [
              { label: "No — run an interleaving / A/B test to confirm users actually click higher in the list", best: true, feedback: "right, because offline NDCG is computed on imperfect, debiased-click labels — a proxy for relevance, not ground truth. An interleaving test mixes both rankers' results in one list and watches which side users click, and an A/B test measures live engagement directly; both catch regressions on query classes your labels under-represent. The offline win earns a live test, which is the only thing that measures real user preference." },
              { label: "Yes — NDCG beats production everywhere, push it live", feedback: "this trusts a proxy too far. The labels are debiased clicks, so a 'win' partly reflects how well the new model matches your labeling assumptions, not necessarily users. A small but real regression on, say, navigational queries can hide inside an aggregate NDCG gain — which is exactly what happens in the next stage. Verify online before exposing everyone." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>The A/B test shows a click-through gain overall, but a slice has regressed: navigational queries — where someone types an exact brand or product name expecting that one page — got slightly worse. The cause is the very semantic feature that helped the tail; it over-generalizes a precise name into nearby paraphrases. Error analysis means slicing the losses to localize the failure, then fixing that slice with a targeted feature rather than reverting the whole model.</p>`,
        concepts: ["mlx-error-analysis", "ml-bias-variance", "cls-bandits"],
        insight: `<b>One signal can help and hurt different slices.</b> The semantic feature drove the <b>+6.8% tail</b> win but slightly hurt navigational queries, because for an exact-name search ('acme login') the right answer is a precise lexical match, not a semantic neighbor. The fix is surgical: add an <b>exact-match boost</b> feature so navigational intent is rescued without surrendering the tail gains — the kind of targeted patch error analysis is built for.`,
        symbols: [
          { sym: "navigational query", desc: "a search for one specific known page (a brand or product name) where the user wants that exact result, not similar ones." },
          { sym: "error slicing", desc: "breaking the losses down by segment (intent, query type) to localize WHERE a model fails instead of only seeing the average." },
          { sym: "exact-match boost", desc: "a feature/signal that rewards a doc for matching the query's literal text, used to rescue navigational intent." }
        ],
        steps: [{
          type: "decide", prompt: "Semantic ranking hurt exact-name navigational queries. Best response?",
          options: [
            { label: "Slice the losses, find that semantic match over-weights paraphrases on navigational intent, and add an exact-match boost", best: true, feedback: "this is error analysis done right. Slicing the regression by intent localizes it to navigational queries, and the diagnosis is specific: the semantic feature treats a precise name as if a paraphrase were just as good. Adding an exact-match boost gives the model the missing signal for that one slice, fixing navigational queries while keeping the +6.8% tail win the semantic feature earned. Targeted feature, targeted fix." },
            { label: "Drop the semantic features entirely", feedback: "this over-corrects, trading a big win to fix a small loss. The semantic feature is responsible for the +6.8% tail improvement; removing it to repair a narrow navigational slice throws away far more value than it recovers. When one slice regresses, you patch that slice — you don't amputate the signal that's carrying the rest of the gains." },
            { label: "Retrain with twice as many trees", feedback: "more capacity can't fix a missing-feature problem. The model isn't failing navigational queries because it lacks trees; it's failing because it has no feature telling it an exact brand match should dominate for that intent. Doubling the trees just fits the existing (flawed) signals harder. The fix is a new exact-match FEATURE, not extra capacity." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy the ranker",
        narrative: `<p>Search lives under a strict latency budget, so production splits the work into two stages: a cheap retrieval pass narrows thousands of candidates down to a few hundred, then the heavier LambdaMART ranker re-orders only that shortlist. Wrap the launch in a feature flag and an A/B test so you can measure live CTR and roll back instantly if anything regresses. The two-stage pattern is what lets an expensive ranker run inside a fast page.</p>`,
        concepts: ["cls-gradient-boosting", "dl-cosine-similarity", "ml-classification-metrics"],
        insight: `<b>Two stages keep it fast AND good.</b> Retrieval cuts thousands of candidates to <b>~300</b>, and LambdaMART re-ranks only those, holding <b>p99 latency at 72ms</b> with a <b>0% error rate</b> in the 10% bucket. The live A/B confirms the offline promise: <b>CTR@5 up +2.4%</b> with a 95% CI (Confidence Interval) that excludes 0, and navigational queries now neutral after the exact-match boost.`,
        symbols: [
          { sym: "retrieve-then-rank", desc: "a two-stage serving pattern: a cheap model selects a candidate shortlist, then an expensive ranker orders just that shortlist." },
          { sym: "p99 latency", desc: "the 99th-percentile response time (72ms here) — only 1% of requests are slower, the tail users feel." },
          { sym: "CTR@5", desc: "click-through rate on the top 5 results — the live engagement metric the A/B test reads." },
          { sym: "95% CI excludes 0", desc: "the confidence interval for the lift doesn't contain zero, so the +2.4% gain is statistically distinguishable from no effect." }
        ],
        steps: [
          { type: "decide", prompt: "How should ranking run in production?",
            options: [
              { label: "Cheap retrieval to ~300 candidates, then LambdaMART re-ranks that set, rolled out behind a flag with an A/B", best: true, feedback: "this is the standard for a reason. Retrieval (cheap, recall-oriented) discards the thousands of obviously-irrelevant candidates so the expensive ranker only scores ~300 — keeping p99 at 72ms. Wrapping it in a flag + A/B means you measure live CTR against control and can disable instantly if a regression appears. You get the accuracy of the heavy ranker at a latency the page can afford, with a safety net." },
              { label: "Run the full ranker on all thousands of candidates per query", feedback: "this blows the latency budget. Scoring every one of thousands of candidates with LambdaMART per query, multiplied by live query volume, is far too slow and costly to serve under a search SLA — and pointless, since the vast majority of candidates would never reach the top results anyway. The retrieve-then-rank split exists precisely to avoid spending compute ranking docs no user will see." }
            ] },
          { type: "run", label: "▶ Ship behind A/B (10% → 100%)", result: { log: "deploying ranker v2 behind experiment...\n10% bucket: p99 latency 72ms, error rate 0.0%\nlive CTR@5: +2.4% vs control (95% CI excludes 0)\nnavigational queries: now neutral after exact-match boost\npromoting to 100% ...\nlive.", metrics: [{ k: "p99 latency", v: "72ms" }, { k: "CTR@5 lift", v: "+2.4%" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain",
        narrative: `<p>A search ranker is never 'done' because the world underneath it moves: new content and trending queries appear daily, language drifts, and the click feedback loop can entrench whatever already ranks high. Monitoring has to catch both slow decay (relevance eroding over weeks) and sudden breaks (a fresh-content gap appearing in a day). The user-frustration signals — abandonment and query reformulation — are often your earliest warning that relevance has slipped.</p>`,
        concepts: ["mlx-error-analysis", "ml-roc-auc", "prob-clt"],
        insight: `<b>Frustration signals fire before NDCG cracks.</b> This week overall NDCG@10 drifts <b>0.631 → 0.604</b>, but the louder alarm is the <b>+14% reformulation rate on news queries</b> — users re-typing because fresh content isn't indexed fast enough. Semantic-embedding feature drift versus the training distribution confirms the cause, triggering an embedding refresh and retrain.`,
        symbols: [
          { sym: "reformulation rate", desc: "how often users re-type or rephrase a query after seeing results — a direct signal that the answers weren't good enough." },
          { sym: "abandonment", desc: "sessions where the user leaves without clicking any result — a sign the ranking failed them entirely." },
          { sym: "feature drift", desc: "the live distribution of a feature (here embeddings) moving away from what the model trained on, degrading accuracy." }
        ],
        steps: [
          { type: "decide", prompt: "What should you monitor for the live ranker?",
            options: [
              { label: "Online NDCG/CTR by query segment, abandonment & reformulation rate, feature drift, and latency — with alerts", best: true, feedback: "this combination catches every failure mode. Per-SEGMENT NDCG/CTR exposes regressions on a query class that an aggregate would average away; abandonment and reformulation rates are direct user-frustration signals that often move before the metric does; feature drift flags when live inputs diverge from training; and latency guards the SLA. With alerts, that quartet turns both slow decay and sudden breaks into pages, not post-mortems." },
              { label: "Just the overall CTR number once a month", feedback: "too coarse and too slow. A single monthly aggregate averages a regressing segment together with healthy ones, so per-segment failures and trending-query gaps stay invisible for weeks — and by the time the number visibly moves, you've lost a month of relevance. You need per-segment metrics plus frustration and drift signals, monitored continuously with alerts, not one lagging scalar." }
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
        narrative: `<p>You run retention on the <b>Telco Customer Churn</b> dataset (IBM sample, popularized on Kaggle): <b>7,043 customers</b> of a fictional California telco, <b>21 columns</b> of account and service attributes, and a binary <b>Churn</b> label where <b>~26.5%</b> of customers left last quarter. The business doesn't actually want a churn score — it wants to know <i>who to give a discount to</i> so they stay, and the retention budget only covers a slice of the base. So the real deliverable is a prioritized targeting list, not a yes/no flag, and the right objective is ranking the people whose departure you can both predict and prevent.</p>`,
        concepts: ["ml-logistic-regression", "ml-classification-metrics", "ml-supervised"],
        insight: `<b>Imbalance still defines the problem.</b> Even at the Telco set's <b>~26.5% churn</b>, a model that predicts &quot;nobody churns&quot; scores <b>73.5% accuracy</b> while saving zero customers — and in a real subscription with monthly churn near <b>4%</b> that lazy baseline hits 96%. That's why you frame this as <b>ranking by risk</b> and judge it with precision near the top of the list, not raw accuracy — the budget reaches only the highest-ranked few percent, so getting that head of the list right is the entire game.`,
        symbols: [
          { sym: "churn rate", desc: "the fraction of subscribers who cancel in a given window — ~26.5% in the Telco set (last quarter), the positive-class rate." },
          { sym: "accuracy", desc: "share of all predictions that are correct; misleading when classes are imbalanced because the majority class dominates it." },
          { sym: "precision@top", desc: "of the customers the model ranks highest (the ones you can afford to contact), what fraction actually churn — the metric the budget cares about." }
        ],
        steps: [{
          type: "decide", prompt: "What should the model actually optimize for?",
          options: [
            { label: "Rank customers by churn risk so a limited retention budget hits the highest-risk savable users first", best: true, feedback: "exactly. The decision you're funding is &quot;who gets an offer&quot;, and the budget only covers a small fraction of the base — so what matters is the ORDER of the list, not an absolute score for everyone. Optimizing a ranking lets precision at the top of the list spend the budget where churn is most likely, which is the lever that actually moves retained dollars." },
            { label: "Maximize raw accuracy of churn vs stay", feedback: "accuracy is the classic trap on an imbalanced problem. With 4% churn, the lazy model that predicts &quot;nobody churns&quot; is 96% accurate and yet flags zero people to save — perfectly accurate and perfectly useless. Accuracy rewards the majority class, so it tells you nothing about whether you found the rare churners the budget exists to rescue." },
            { label: "Predict each customer's exact remaining months as a regression", feedback: "tenure regression solves a harder, noisier problem than you need. Remaining-lifetime is extremely high-variance and only indirectly tied to the action you take, which is sending a finite number of offers this cycle. You act on a targeting LIST, so a calibrated churn-risk ranking tied to expected value of intervening is both easier to learn and directly usable." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather the data",
        narrative: `<p>The Telco churn table is one row per customer with <b>21 columns</b>: demographics (gender, SeniorCitizen, Partner, Dependents), account terms (<b>tenure</b>, <b>Contract</b>, PaperlessBilling, <b>PaymentMethod</b>, <b>MonthlyCharges</b>, TotalCharges), services (<b>InternetService</b>, OnlineSecurity, TechSupport, StreamingTV, …), and the label <b>Churn</b> (Yes/No). In production you'd snapshot these at a cutoff date and label churn in the window AFTER it — the subtle trap is <i>target leakage</i>, a feature that's only true <i>because</i> the customer already churned. Get the feature window wrong and no model downstream can recover.</p>`,
        concepts: ["ml-supervised", "prob-bernoulli-binomial", "mlx-error-analysis"],
        insight: `<b>Small, wide, imbalanced — and one trap to dodge.</b> The Telco snapshot is <b>7,043 customers × 21 columns</b>, with <b>1,869 churned (26.5%)</b>. It's a clean public set, but the lesson generalizes: any feature only known at or after cancellation (a &quot;visited cancel page&quot; flag, a cancellation-reason field) is <b>leakage</b> — left in, it inflates validation scores yet fails completely on live customers, who don't have a cancellation event yet.`,
        data: {
          caption: "Telco Customer Churn — one row per customer (real columns)",
          columns: ["customerID", "tenure", "Contract", "InternetService", "MonthlyCharges", "Churn"],
          rows: [
            ["7590-VHVEG", "1", "Month-to-month", "DSL", "29.85", "No"],
            ["3668-QPYBK", "2", "Month-to-month", "DSL", "53.85", "Yes"],
            ["7795-CFOCW", "45", "One year", "DSL", "42.30", "No"],
            ["9237-HQITU", "2", "Month-to-month", "Fiber optic", "70.70", "Yes"],
            ["… 7,043 rows", "…", "…", "…", "…", "…"]
          ],
          note: `Real Telco schema: <b>tenure</b> in months, <b>Contract</b> ∈ {Month-to-month, One year, Two year}, <b>InternetService</b> ∈ {DSL, Fiber optic, No}, <b>MonthlyCharges</b> in dollars, and the binary <b>Churn</b> label. A &quot;cancellation reason&quot; column would belong nowhere here — it exists only at churn time, so it would be leakage and must be excluded.`
        },
        symbols: [
          { sym: "target leakage", desc: "using a feature whose value is only known because the outcome already happened — it inflates offline scores but fails in production." },
          { sym: "Contract", desc: "the Telco term length (Month-to-month / One year / Two year) — the single strongest churn signal in this dataset." },
          { sym: "$y$", desc: "the binary Churn label — 1 if the customer left (Churn = Yes), 0 otherwise." }
        ],
        steps: [
          { type: "decide", prompt: "How do you define the churn label and feature window?",
            options: [
              { label: "Use the Churn label with only features known as of a snapshot cutoff (no post-cancellation fields)", best: true, feedback: "right, and the mechanism matters: by freezing features at a snapshot date and labeling Churn from the period AFTER, you guarantee a time gap between what the model sees and what it predicts. That gap is exactly what prevents post-decision information from sneaking in, so the offline setup mirrors how you'll actually score a live, still-active customer." },
              { label: "Label churners, then use their final-week activity as features", feedback: "this is textbook leakage. Cancellation-week behavior — visiting the cancel page, downgrading, a final-day login spike — is only observable AFTER the customer has effectively decided to leave. The model will look brilliant offline because those features almost perfectly predict the label, then collapse on live customers who haven't generated that behavior yet." },
              { label: "Use a customer's cancellation reason text as a feature", feedback: "same leakage, even more blatant: the cancellation reason is literally recorded at the moment of churn, so it cannot exist when you'd score an active subscriber. Any feature that only materializes at or after the outcome must be excluded — if you couldn't compute it for a customer who's still paying, it can't be in the model." }
            ] },
          { type: "run", label: "▶ Load Telco churn snapshot", prompt: "Build the labeled training table.",
            result: { log: "reading Telco Customer Churn (7043 rows, 21 columns)...\ncustomers: 7,043   columns: 21\nchurned (Churn = Yes): 1,869  (26.5%)\nkey features: tenure, Contract, MonthlyCharges, TotalCharges, InternetService, PaymentMethod\ncoerced TotalCharges to numeric (11 blank strings -> NaN)", metrics: [{ k: "customers", v: "7,043" }, { k: "churn rate", v: "26.5%" }, { k: "columns", v: "21" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore & segment",
        narrative: `<p>Before predicting churn, understand who your customers even are. In the Telco data the single biggest split is <b>Contract</b>, but unsupervised segmentation (PCA (Principal Component Analysis) over the encoded features, then k-means) reveals richer behavior groups that churn for very different reasons — a long-tenure two-year customer is not the same animal as a month-to-month fiber newcomer. Letting the data define the segments, instead of guessing them, keeps the later interventions honest: each group gets a churn driver you can actually act on.</p>`,
        concepts: ["ml-kmeans", "mlx-clustering-metrics", "ml-pca"],
        insight: `<b>Churn is concentrated, not uniform.</b> The silhouette score peaks at <b>k=4</b> (0.41), and the segments span a <b>13×</b> range in churn — mirroring the real Telco breakdown where <b>two-year contracts churn at ~2.8%</b> while <b>month-to-month churns at ~42.7%</b>. Month-to-month fiber customers without tech support dominate the 26.5% base, so the retention budget has obvious places to aim before a single model is trained.`,
        chart: { type: "bars", title: "Churn rate by discovered segment (base 26.5%)", labels: ["2-yr loyal", "1-yr stable", "mo-to-mo DSL", "mo-to-mo fiber"], values: [2.8, 11.3, 35.0, 42.7], valueLabels: ["2.8%", "11.3%", "35.0%", "42.7%"], colors: ["#7ee787", "#4ea1ff", "#ffb454", "#ff7b72"] },
        data: {
          caption: "Discovered segments and their churn rates (k-means, k=4)",
          columns: ["segment", "share of base", "churn rate", "main driver"],
          rows: [
            ["two-year loyal", "24%", "2.8%", "long contract, high tenure"],
            ["one-year stable", "21%", "11.3%", "moderate commitment"],
            ["month-to-month DSL", "30%", "35.0%", "no lock-in"],
            ["month-to-month fiber", "25%", "42.7%", "high charges, no support"]
          ],
          note: `The shares are illustrative but the churn-rate ordering is the real Telco signal: a single average of 26.5% hides a 2.8%→42.7% spread driven by Contract and InternetService. Each segment maps to a DIFFERENT intervention (fiber → tech-support bundle, month-to-month → annual-contract offer), which is why segmenting first pays off.`
        },
        symbols: [
          { sym: "$k$", desc: "the number of clusters (segments) k-means is asked to find; chosen here by the silhouette score, not by eye." },
          { sym: "silhouette", desc: "a 0–1 cluster-quality score measuring within-cluster cohesion vs between-cluster separation; higher is tighter and more distinct." },
          { sym: "PCA", desc: "Principal Component Analysis — compresses the encoded Telco features to a few informative dimensions so k-means clusters on signal, not noise." }
        ],
        steps: [
          { type: "run", label: "▶ Cluster customers (k-means)", result: { log: "one-hot encode categoricals, PCA to 8 dims, k-means sweep k=2..10...\nsilhouette score peaks at k=4\nsegments: 'two-year loyal' (2.8% churn), 'one-year stable' (11.3%), 'month-to-month DSL' (35.0%), 'month-to-month fiber' (42.7%)\nmonth-to-month fiber customers dominate churn", metrics: [{ k: "segments", v: "4" }, { k: "silhouette", v: "0.41" }] } },
          { type: "decide", prompt: "Silhouette peaks at k=4. Why pick the segment count this way instead of by eye?",
            options: [
              { label: "Silhouette quantifies how tight and separated clusters are, giving an objective k instead of a guess", best: true, feedback: "right — silhouette measures cohesion (points close to their own cluster) against separation (far from the next cluster), so it gives a principled answer instead of an aesthetic one. Its peak at k=4 is the data's own verdict on how many real groups exist, and those four happen to map cleanly onto distinct churn drivers you can target separately." },
              { label: "Always use k=10 to capture maximum detail", feedback: "over-segmenting backfires. Forcing k=10 splinters the base into tiny, noisy clusters that don't generalize and rarely map to a distinct action — you can't design ten different retention offers, and several clusters would be statistical noise. The right k is whatever the cohesion-vs-separation metric supports, here 4, not the largest number you can fit." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Engineer features",
        narrative: `<p>The raw Telco columns already carry most of the signal, but encoding and combining them sharpens it. The dominant predictors are <b>Contract</b> (month-to-month is far riskier than a locked-in two-year term), low <b>tenure</b>, high <b>MonthlyCharges</b>, <b>Fiber optic</b> internet without <b>TechSupport</b>, and the <b>electronic-check</b> payment method. You one-hot the categoricals and can derive ratios like charges-per-tenure that capture a customer paying a lot for little commitment.</p>`,
        concepts: ["ml-pca", "ml-logistic-regression", "mlx-error-analysis"],
        insight: `<b>Some columns dominate, some are noise.</b> In the Telco set, <b>Contract</b>, <b>tenure</b>, and <b>InternetService</b> drive most of the separability — a <b>month-to-month fiber customer with high MonthlyCharges and no TechSupport</b> is far likelier to churn than a long-tenure two-year customer. Raw <b>customerID</b> carries none — it's an arbitrary identifier that only invites overfitting if fed in.`,
        data: {
          caption: "From raw Telco column to model feature (which signals actually separate churn)",
          columns: ["feature", "type", "churn signal", "example"],
          rows: [
            ["Contract (one-hot)", "categorical", "strong", "Month-to-month → high risk"],
            ["tenure", "level", "strong", "2 mo → high risk"],
            ["InternetService = Fiber optic", "categorical", "strong", "fiber + no TechSupport → high risk"],
            ["MonthlyCharges", "level", "moderate", "70.70 → elevated risk"],
            ["customerID", "identifier", "none", "noise / leakage"]
          ],
          note: `Telco churn is driven by commitment and price: short <b>tenure</b> + <b>Month-to-month</b> + <b>Fiber optic</b> + high <b>MonthlyCharges</b> stack into the highest-risk profile. The customerID row is a warning: an arbitrary identifier carries no predictive magnitude and invites overfitting.`
        },
        symbols: [
          { sym: "Contract", desc: "term length (Month-to-month / One year / Two year) — the strongest single churn predictor in the Telco data; no lock-in means easy to leave." },
          { sym: "tenure", desc: "months the customer has been with the telco; low tenure (especially &lt; 12 months) is strongly associated with churn." },
          { sym: "one-hot", desc: "encoding a categorical column (Contract, InternetService, PaymentMethod) as a set of 0/1 indicator features the model can use." }
        ],
        steps: [{
          type: "decide", prompt: "Which features best predict churn in the Telco data?",
          options: [
            { label: "Contract type, tenure, MonthlyCharges, and Fiber-optic-without-TechSupport, with categoricals one-hot encoded", best: true, feedback: "these are exactly the columns that separate churners in this dataset. Month-to-month Contract means no lock-in; low tenure means a customer who hasn't yet committed; high MonthlyCharges on Fiber optic without TechSupport is the classic 'paying a lot, getting frustrated' profile. Stacked together they compound into a strong, actionable churn signal — and one-hot encoding lets the model split on each category cleanly." },
            { label: "Only the customer's gender", feedback: "gender is essentially uncorrelated with churn in the Telco data — churn rates for male and female customers are nearly identical. A single demographic flag with no signal can't distinguish a loyal two-year customer from a month-to-month fiber newcomer. The churn signal lives in Contract, tenure, and service mix, which a lone demographic column simply cannot express." },
            { label: "The raw customerID as a number", feedback: "a customerID is an arbitrary label, not a measurement — its numeric magnitude means nothing, so feeding it in is pure noise. Worse, a high-capacity model can memorize specific IDs from training, which is overfitting and a backdoor to leakage. Identifiers belong in joins, never as predictive features." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick a model",
        narrative: `<p>After one-hot encoding the Telco categoricals you have ~30 tabular features with strong non-linear interactions — Fiber-optic internet matters far more for a month-to-month customer than for a two-year one — and you need a score you can both rank by and read as a probability for budgeting. That points to a model that handles feature interactions natively, ranks well, and can be calibrated. Match the model to the data shape, not to fashion.</p>`,
        concepts: ["cls-gradient-boosting", "ml-logistic-regression", "ml-classification-metrics"],
        insight: `<b>Interactions are the whole point.</b> Churn isn't additive: Fiber-optic × month-to-month × low-tenure compounds into far more risk than the three add up to separately. Gradient-boosted trees split on exactly these combinations, which is why they reach <b>AUC (Area Under the Curve) ~0.84</b> on the encoded Telco features where plain logistic regression — additive by construction — leaves signal on the table. Calibration then makes a <b>0.3 score mean ~30% churn</b>, so the marketing team can budget against it.`,
        symbols: [
          { sym: "AUC", desc: "area under the ROC (Receiver Operating Characteristic) curve — the probability the model ranks a random churner above a random stayer; 0.5 is coin-flip, 1.0 is perfect." },
          { sym: "interaction", desc: "when the effect of one feature depends on another (payment failure matters more for new price-sensitive users); trees capture these, linear models don't." },
          { sym: "calibration", desc: "adjusting raw scores so a predicted 0.3 really corresponds to a ~30% churn rate — required for budgeting and expected-value decisions." }
        ],
        steps: [{
          type: "decide", prompt: "Choose a churn model.",
          options: [
            { label: "Gradient-boosted trees for the ranker, with calibrated probabilities", best: true, feedback: "this fits the data shape exactly. Boosted trees split on feature COMBINATIONS, so they natively capture the failure × segment × tenure interactions that drive churn — the signal a linear model can't see. They rank strongly (good AUC and top-decile precision), and calibrating the outputs (e.g. isotonic) makes the scores behave like genuine probabilities, which is what lets you tie each customer to an expected-value targeting decision." },
            { label: "Logistic regression only", feedback: "a valuable baseline, but ADDITIVE by design — it sums each feature's independent contribution and so structurally cannot represent &quot;a payment failure is dangerous only for new price-sensitive users&quot;. You'd lose the interaction signal that makes churn predictable. Keep it as an interpretable sanity check next to boosting, not as the production model." },
            { label: "A deep neural net on the encoded Telco features", feedback: "overkill that rarely pays off here. On a small (~7K-row), mixed tabular dataset, boosted trees usually MATCH or beat deep nets while training faster, calibrating more easily, and being far simpler to explain to a marketing team that has to trust the targeting list. A neural net adds tuning burden and opacity with no accuracy edge on this problem." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train it",
        narrative: `<p>Fit gradient-boosted trees with class weighting to counter the 26.5% positive rate (so the minority churners aren't drowned out by the 73.5% who stay) and $\\ell_2$ regularization to keep the trees from memorizing noise on a small dataset. Then calibrate the output scores — raw boosting scores aren't true probabilities — so a 0.3 score really means ~30% churn likelihood, which is what the budgeting math downstream depends on.</p>`,
        concepts: ["ml-gradient-descent", "ml-regularization", "cls-gradient-boosting"],
        insight: `<b>Watch the gap, then calibrate.</b> Train AUC climbs to <b>0.918</b> while validation plateaus at <b>0.838</b> by iteration 268 — a widening gap is the overfitting signal that triggers early stopping. The held-out <b>0.838 AUC</b> is the honest number. Crucially, isotonic calibration afterward fixes the scores so they read as real probabilities (reliability &quot;good&quot;), without which a 0.3 wouldn't mean 30%.`,
        symbols: [
          { sym: "class weighting", desc: "up-weighting the minority churn (26.5%) examples so the loss doesn't favor the 73.5% who stay." },
          { sym: "$\\ell_2$", desc: "L2 regularization — a penalty on large leaf weights that shrinks the model toward simpler fits, reducing overfitting." },
          { sym: "early stop", desc: "halting training when validation AUC stops improving (here ~iter 268), even though training AUC keeps rising — the gap is overfitting." },
          { sym: "isotonic", desc: "a monotonic calibration step that maps raw model scores onto well-behaved probabilities matching observed churn rates." }
        ],
        steps: [{
          type: "run", label: "▶ Train gradient boosting (class-weighted)",
          result: { log: "training boosted churn ranker...\n[80]  train AUC 0.842  valid AUC 0.821\n[200] train AUC 0.889  valid AUC 0.836\n[340] train AUC 0.918  valid AUC 0.838  (early stop)\ncalibrating scores (isotonic)... reliability good\nbest iteration: 268", metrics: [{ k: "valid AUC", v: "0.838" }, { k: "trees", v: "268" }], chart: { type: "line", title: "Gradient-boosting training curve (AUC)", xlabel: "trees", ylabel: "AUC", series: [
            { name: "train AUC", color: "#ff7b72", points: [[80, 0.842], [200, 0.889], [340, 0.918]] },
            { name: "valid AUC", color: "#7ee787", points: [[80, 0.821], [200, 0.836], [340, 0.838]] }
          ] } } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate for targeting",
        narrative: `<p>You don't ship an AUC; you ship a <i>targeting list</i>. A single aggregate score says little about the only customers you'll actually contact — the highest-ranked few percent — so you evaluate precision and lift in the top deciles, where the retention budget gets spent. Top-decile lift answers the business question directly: how much denser is churn among the people we'd reach than in the base?</p>`,
        concepts: ["ml-classification-metrics", "ml-roc-auc", "mlx-cross-validation"],
        insight: `<b>The list is sharp where it counts.</b> The model's top decile (<b>141 contacted</b>) churns at <b>72% vs the 26.5% base</b> — a <b>2.7× lift</b> — and that one decile captures <b>27% of all churners</b>. With the budget reaching only the riskiest few percent, that front-loading is the multiplier the bare AUC of 0.836 never shows.`,
        chart: { type: "roc", title: "Churn ranker ROC (AUC 0.836)", auc: 0.836, points: [[0, 0], [0.05, 0.34], [0.1, 0.51], [0.2, 0.68], [0.4, 0.84], [0.6, 0.92], [0.8, 0.97], [1, 1]] },
        data: {
          caption: "Decile lift table — sort by predicted risk, then look top-down",
          columns: ["decile", "customers", "churn rate", "lift vs base", "cumulative churners"],
          rows: [
            ["1 (highest risk)", "141", "72.0%", "2.7×", "27%"],
            ["2", "141", "51.1%", "1.9×", "47%"],
            ["3", "141", "37.6%", "1.4×", "61%"],
            ["… deciles 4–10", "…", "…", "…", "…"],
            ["base (all)", "1,409", "26.5%", "1.0×", "100%"]
          ],
          note: `Targeting works because risk is front-loaded: decile 1 holds 27% of churners at 2.7× the base rate, and the top three deciles together capture 61%. The budget should chase the steep top of this table — but high risk still isn't the same as persuadable, which is the next question.`
        },
        symbols: [
          { sym: "decile", desc: "a 10% slice of customers after sorting by predicted churn risk; decile 1 is the highest-risk tenth." },
          { sym: "lift", desc: "churn rate within a slice divided by the overall base rate — 2.7× means that slice churns 2.7 times as often as average." },
          { sym: "precision@decile", desc: "the fraction of the targeted decile that actually churns (0.72 here) — directly how well the budget is spent." },
          { sym: "recall", desc: "the share of all churners captured by the slices you target (27% in decile 1) — coverage of the people worth saving." }
        ],
        steps: [
          { type: "run", label: "▶ Evaluate top-decile targeting", result: { log: "holdout: 1,409 customers (20% of 7,043), 373 churners\nAUC 0.836\nsort customers by predicted risk, cut into 10 equal deciles (~141 each)\ntop decile (141): ~102 churners observed -> churn rate 72.0%\nlift = decile churn rate / base rate = 72.0% / 26.5% = 2.7x\nprecision@top-decile = churners in decile / decile size = 0.72\nrecall = churners in decile / all churners = ~102 / 373 = 27% captured", metrics: [{ k: "AUC", v: "0.836" }, { k: "top-decile lift", v: "2.7x" }, { k: "churners caught", v: "27%" }], chart: { type: "bars", title: "Churn rate by risk decile (base 26.5%)", labels: ["decile 1", "decile 2", "decile 3", "base"], values: [72.0, 51.1, 37.6, 26.5], valueLabels: ["72.0%", "51.1%", "37.6%", "26.5%"], colors: ["#ff7b72", "#ffb454", "#4ea1ff", "#7ee787"] } } },
          { type: "decide", prompt: "The top decile has 2.7x lift. Is high churn risk enough to target someone?",
            options: [
              { label: "No — target high-risk customers who are also persuadable (uplift), not the ones who'll churn no matter what", best: true, feedback: "right, and this is the crucial distinction. Risk answers &quot;who will leave?&quot; but the offer only earns its cost on people whose decision it actually CHANGES. The top decile mixes lost causes (already gone, an offer won't help) with the genuinely persuadable; spending only on the persuadable is what makes the campaign profitable. Risk ranking is step one — uplift, the causal effect of the offer, is the real target." },
              { label: "Yes — just send the offer to everyone in the top decile", feedback: "this over-targets and wastes budget two ways. You'll spend on doomed churners who'll leave no matter what the offer says, AND on a hidden group who would have stayed for free — handing them a needless discount. Pure risk ranking can't tell these apart from the persuadable middle, which is exactly why you next need to estimate uplift, not just risk." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Uplift, not just risk",
        narrative: `<p>The first campaign saved fewer customers than the 2.7× lift suggested. The reason is the gap between risk and <i>uplift</i>: targeting by risk alone spends offers on two useless groups — the lost causes who churn anyway, and the &quot;sure things&quot; who'd have stayed for free. The offer only pays off on the persuadable middle, and the only way to find them is to measure the offer's causal effect by withholding it from a randomized control.</p>`,
        concepts: ["cls-bandits", "mlx-error-analysis", "ml-classification-metrics"],
        insight: `<b>Four customer types, one paying group.</b> Split high-risk users into lost causes, sure things, sleeping dogs (an offer annoys them into leaving), and the <b>persuadables</b> — only the last earns back the discount. Risk ranking can't separate them; a <b>randomized control</b> can, by comparing treated vs untreated retention. That measured difference is uplift, and it's why the next campaign keeps a holdout.`,
        data: {
          caption: "Risk vs uplift — same high-risk decile, very different ROI (Return on Investment)",
          columns: ["type", "churns if untreated?", "churns if treated?", "offer worth sending?"],
          rows: [
            ["persuadable", "yes", "no", "yes — the offer saves them"],
            ["lost cause", "yes", "yes", "no — leaves anyway"],
            ["sure thing", "no", "no", "no — wasted discount"],
            ["sleeping dog", "no", "yes", "no — offer backfires"]
          ],
          note: `All four can sit in the top risk decile, yet only the persuadable returns value. You can't read these labels off a risk score — they're defined by the DIFFERENCE between treated and untreated outcomes, which only a randomized holdout reveals.`
        },
        symbols: [
          { sym: "uplift", desc: "the causal effect of the offer on one customer — churn probability if untreated minus if treated; positive means the offer helps." },
          { sym: "control / holdout", desc: "a randomly chosen group deliberately NOT given the offer, providing the untreated baseline to measure incremental effect against." },
          { sym: "incremental retention", desc: "treated retention rate minus control retention rate — the offer's true lift, free of baseline churn and seasonality." }
        ],
        steps: [{
          type: "decide", prompt: "How do you find who the offer actually persuades?",
          options: [
            { label: "Run a holdout: give the offer to a random subset of high-risk users and measure incremental retention vs an untreated control", best: true, feedback: "this is the only valid way to measure uplift. Persuadability is a CAUSAL question — would this customer have stayed without the offer? — and you can't answer it from observational scores. By randomly withholding the offer from a control group, the treated-minus-control difference isolates the offer's effect from baseline churn and seasonality. That incremental number is exactly the uplift you want to target on." },
            { label: "Assume the highest-risk customers are the most persuadable", feedback: "this is often backwards. The very highest-risk users are frequently lost causes — already mentally gone — so an offer changes nothing and the spend is wasted. Persuadability is a distinct quantity from risk and the two don't move together; assuming they do sends the budget to the people least likely to be moved. It must be measured, not inferred from the risk score." },
            { label: "Send the offer to everyone and hope retention rises", feedback: "with no control group this learns nothing. If retention goes up you can't tell whether the offer did it or whether seasonality, a price change, or a product launch did — there's no untreated baseline to compare against. You'd spend the whole budget and still not know if the campaign works, let alone on whom." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy the campaign",
        narrative: `<p>Churn plays out over days and renewals are scheduled, so the model doesn't need millisecond serving — a daily batch that scores everyone and flags at-risk renewals is the right fit. The non-negotiable is baking a randomized control directly into the launch: hold back a random slice of the targeted group untreated, so every campaign keeps measuring incremental retention instead of just total retention.</p>`,
        concepts: ["ml-classification-metrics", "cls-gradient-boosting", "cls-bandits"],
        insight: `<b>Batch is enough; the control is essential.</b> A daily batch scoring the <b>7,043-customer</b> base (trivial at this scale) matches a decision that unfolds over days, not milliseconds. With a <b>10% untreated control</b>, week-1 results read <b>treated 88.1% vs control 83.4%</b> retention — a clean <b>+4.7pp incremental</b> lift. Without that control you'd see only the 88.1% and never know how much the offer actually caused.`,
        symbols: [
          { sym: "batch scoring", desc: "scoring all customers on a schedule (here daily) rather than on-demand per request — appropriate when decisions evolve slowly." },
          { sym: "10% control", desc: "one in ten targeted customers randomly left untreated, forming the baseline that turns raw retention into a causal measurement." },
          { sym: "pp (percentage points)", desc: "an absolute difference between two rates; +4.7pp means 88.1% − 83.4%, not a 4.7% relative change." }
        ],
        steps: [
          { type: "decide", prompt: "How should the targeting model run?",
            options: [
              { label: "Daily batch scoring that flags at-risk renewals, with a randomized holdout left untreated to measure lift", best: true, feedback: "this matches the problem on both axes. Churn and renewals evolve over DAYS, so a daily batch refreshes scores in plenty of time and costs a fraction of a live service. And building the randomized holdout INTO the campaign means you keep measuring incremental (causal) retention on every run, so a fading offer is caught by the control instead of hidden behind a healthy-looking total." },
              { label: "A real-time sub-100ms scoring service at page load", feedback: "over-engineered for this decision. A retention offer tied to a renewal date doesn't need to be computed in the moment a page loads — nothing acts on the score within milliseconds. Standing up a low-latency service adds infrastructure cost and complexity for zero benefit, when a nightly batch delivers the same targeting list far more cheaply." }
            ] },
          { type: "run", label: "▶ Launch campaign (with 10% control)", result: { log: "scoring 7,043 customers (daily batch)...\ntargeted: top-decile persuadable, 90% treated / 10% control\noffer: 20% off 3 months\nweek 1 retention: treated 88.1% vs control 83.4% -> +4.7pp incremental\nlive.", metrics: [{ k: "incremental retention", v: "+4.7pp" }, { k: "control", v: "10%" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain",
        narrative: `<p>A churn campaign decays from two directions: the MODEL drifts as pricing, competitors and customer mix shift, and the OFFER fatigues as customers grow numb to the same discount. The retained control group is your ground truth for both — only the treated-minus-control gap tells you whether the offer still causes retention, or whether you're spending budget on a campaign that quietly stopped working.</p>`,
        concepts: ["mlx-error-analysis", "ml-roc-auc", "prob-clt"],
        insight: `<b>Both halves are slipping.</b> Incremental retention has fallen from <b>+4.7pp to +1.9pp</b> (offer fatigue) while top-decile precision dropped <b>0.72 → 0.61</b> after a pricing change shifted the MonthlyCharges distribution (model drift). A total-retained dashboard would look fine; only the <b>control comparison and drift alerts</b> expose that the campaign is losing both its targeting accuracy and its causal punch.`,
        data: {
          caption: "What the monitors caught this month",
          columns: ["monitor", "at launch", "now", "diagnosis"],
          rows: [
            ["incremental retention (vs control)", "+4.7pp", "+1.9pp ⚠", "offer fatigue"],
            ["top-decile precision", "0.72", "0.61 ⚠", "model drift"],
            ["MonthlyCharges distribution", "stable", "shifted", "pricing change"],
            ["offer-cost ROI", "positive", "thinning", "spend at risk"]
          ],
          note: `Two distinct failures, two distinct fixes: fatigue calls for a fresh offer, drift calls for a retrain on post-price-change data. A single &quot;customers retained&quot; number would have blurred them together — the control and per-metric alerts are what separate cause from coincidence.`
        },
        symbols: [
          { sym: "model drift", desc: "the live feature distribution moving away from training (here MonthlyCharges after a price change), eroding the model's targeting accuracy." },
          { sym: "offer fatigue", desc: "the declining causal effect of a repeated offer as customers grow used to it — visible as shrinking incremental lift vs control." },
          { sym: "ROI", desc: "return on investment of the campaign — incremental revenue retained versus discount cost; thins as lift fades." }
        ],
        steps: [
          { type: "decide", prompt: "What should you monitor for the live campaign?",
            options: [
              { label: "Incremental retention vs control, top-decile precision as labels land, feature drift, and offer-cost ROI — with alerts", best: true, feedback: "this watches every way the campaign can fail. Incremental retention vs CONTROL tracks the offer's causal lift (catching fatigue); top-decile precision as outcomes arrive tracks targeting quality (catching model drift); feature drift flags when inputs like MonthlyCharges shift after a price change; and ROI guards that the discount still pays for itself. Alerts turn all four into early warnings, so you fix a fading offer or stale model before the budget bleeds." },
              { label: "Just total customers retained, with no control group", feedback: "this is blind exactly where it matters. Without a control you can't separate the offer's effect from seasonality, a price change, or a product launch — total retention can hold steady while the offer's real (causal) lift collapses to zero. You'd keep funding a campaign that may no longer work, with no signal that anything is wrong. The control comparison is the whole point." }
            ] },
          { type: "run", label: "▶ Check this month's monitors", result: { log: "incremental retention: +4.7pp -> +1.9pp  (offer fatigue?)\nfeature 'MonthlyCharges' drift detected: a pricing change shifted the distribution\ntop-decile precision: 0.72 -> 0.61  ALERT\naction: refresh the offer, retrain on post-price-change data", metrics: [{ k: "incremental lift", v: "+1.9pp ⚠" }, { k: "precision", v: "0.61 ⚠" }] }, note: `The loop closes here: a pricing change shifted the data and the offer fatigued, so monitoring triggers a retrain and a new offer — back to <b>Data</b>. Retention is a moving target.` }
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
        narrative: `<p>This is the classic web-conversion experiment behind the widely-used Kaggle <b>"A/B testing"</b> dataset: a site shows a control group the <b>old landing/checkout page</b> and a treatment group a <b>new page</b>, logging for each session whether the user <b>converted</b> (the binary primary metric). Before touching traffic, turn the hunch into a testable hypothesis with exactly one <b>primary metric</b>, a stated direction, and a guardrail you commit to in advance. The reason to pre-commit is statistical: every extra metric you let yourself watch is another lottery ticket for a false positive, so freezing the question before you see the data is what keeps the answer honest.</p>`,
        concepts: ["prob-estimation", "prob-bernoulli-binomial", "prob-expectation"],
        insight: `<b>One metric, decided up front.</b> That public dataset logs <b>294,478 sessions</b> split ~50/50 into control and treatment, with a baseline conversion of <b>~12%</b> — and its honest verdict is no significant lift, a reminder of how easy noise is to mistake for signal. If you watch <b>40 metrics</b> at $\\alpha=0.05$, you expect <b>~2 to look "significant" by pure chance</b> even when nothing changed ($40\\times0.05=2$). Pre-registering a single primary metric (conversion) plus a revenue guardrail collapses those 40 lottery tickets down to one honest test.`,
        symbols: [
          { sym: "$\\alpha$", desc: "the false-positive rate you accept — here 0.05, a 5% chance of calling a null effect 'significant'." },
          { sym: "primary metric", desc: "the single pre-chosen outcome the decision rests on (checkout conversion); everything else is secondary." },
          { sym: "guardrail", desc: "a metric (revenue) that must not get WORSE — a safety check, not the thing you're trying to move." }
        ],
        steps: [{
          type: "decide", prompt: "How should you frame the experiment?",
          options: [
            { label: "One primary metric (checkout conversion), a directional hypothesis, and a guardrail metric (revenue) chosen up front", best: true, feedback: "exactly. Committing to a single primary metric, a direction, and a guardrail BEFORE you look removes your freedom to cherry-pick a winner after the fact. The mechanism: a pre-registered question has one chance to be wrong, so the 5% false-positive rate actually means 5%. Conversion is the thing you want to move; revenue is the guardrail that catches a 'win' that secretly cannibalizes value." },
            { label: "Track 40 metrics and ship if any one of them improves", best: false, feedback: "this is p-hacking by construction. Testing 40 independent metrics at $\\alpha=0.05$ means you expect ~2 to clear the bar by chance alone, so 'something improved' is almost guaranteed even for a useless change. Picking the metric AFTER seeing which one looks good inflates your real false-positive rate far above 5% — you'd ship noise and call it a win." },
            { label: "Just ship the new button — the designer is confident", feedback: "confidence isn't evidence. Intuition about UI changes is wrong more often than not, which is the entire reason experimentation exists — to MEASURE the effect instead of trusting a hunch. Shipping blind also forfeits the guardrail check, so a change that quietly hurts revenue would go unnoticed." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Power & sample size",
        narrative: `<p>Each logged row in the experiment table is one session: <b>user_id, timestamp, group</b> (control / treatment), <b>landing_page</b> (old_page / new_page), and <b>converted</b> (0/1) — the same schema as the Kaggle A/B dataset. Before launching, decide how much traffic you need. Sample size depends on three things: the baseline conversion rate (~12% here), the smallest effect worth detecting (the MDE, Minimum Detectable Effect), and the variance of the metric — roughly $n\\propto \\frac{\\sigma^2}{\\delta^2}$, so halving the effect you want to catch quadruples the users you need.</p>
<p><b>How the sample size is actually derived, step by step.</b> The per-arm formula for comparing two proportions is $n=\\dfrac{(z_{\\alpha/2}+z_{\\beta})^2\\,\\big(\\sigma_0^2+\\sigma_1^2\\big)}{\\delta^2}$. Reading it piece by piece: $z_{\\alpha/2}$ is the normal cutoff for the false-positive rate (for $\\alpha=0.05$ two-sided, $z_{\\alpha/2}=1.96$); $z_{\\beta}$ is the cutoff for the miss rate (for 80% power, $\\beta=0.20$ so $z_{\\beta}=0.84$); $\\delta$ is the MDE; and the variance of a proportion $p$ is $\\sigma^2=p(1-p)$. Plug in: baseline $p_0=0.12$ gives $\\sigma_0^2=0.12\\times0.88=0.1056$, treatment $p_1=0.126$ gives $\\sigma_1^2=0.126\\times0.874=0.1101$, and $\\delta=0.006$. So $n=\\dfrac{(1.96+0.84)^2(0.1056+0.1101)}{0.006^2}=\\dfrac{7.84\\times0.2157}{0.000036}\\approx 58{,}200$ users per arm. Because $\\delta$ is squared in the denominator, the MDE is the dominant lever. Computing this up front fixes the finish line so you read the result exactly once, instead of peeking until randomness crosses the line.</p>`,
        concepts: ["prob-variance", "prob-clt", "prob-estimation"],
        insight: `<b>The math gives a concrete finish line.</b> For a <b>12.0% baseline</b>, an MDE of <b>+0.6pp</b> (relative +5%), $\\alpha=0.05$ and <b>80% power</b>, the formula returns <b>~58,200 users per arm</b> — about <b>7 days</b> at 9,000 eligible users/day/arm. That number is decided NOW, before any data arrives, so 'when do we stop?' is never a judgment call.`,
        data: {
          caption: "Power analysis: inputs → required sample size",
          columns: ["input", "value", "effect on $n$"],
          rows: [
            ["baseline conversion", "12.0%", "sets the variance $\\sigma^2$"],
            ["MDE ($\\delta$)", "+0.6pp", "smaller $\\delta$ → much larger $n$"],
            ["$\\alpha$ (two-sided)", "0.05", "stricter → larger $n$"],
            ["power (1−$\\beta$)", "0.80", "higher → larger $n$"],
            ["→ required n/arm", "~58,200", "≈ 7 days of traffic"]
          ],
          note: `Because $n\\propto \\sigma^2/\\delta^2$, the MDE is the dominant lever: aiming to detect half the effect (+0.3pp) would roughly QUADRUPLE the sample and the runtime. Pick the smallest effect that's actually worth shipping, not the smallest you can imagine.`
        },
        symbols: [
          { sym: "$n$", desc: "required sample size per arm $=\\dfrac{(z_{\\alpha/2}+z_{\\beta})^2(\\sigma_0^2+\\sigma_1^2)}{\\delta^2}$ — how many users each variant needs to hit the target power." },
          { sym: "$\\sigma^2$", desc: "the variance of the metric; for a proportion $p$ it is $p(1-p)$, so the baseline rate sets it (here $0.12\\times0.88=0.1056$)." },
          { sym: "$z_{\\alpha/2},\\ z_{\\beta}$", desc: "normal cutoffs: $z_{\\alpha/2}=1.96$ for $\\alpha=0.05$ two-sided (false positives), $z_{\\beta}=0.84$ for 80% power (misses); their sum, squared, scales $n$." },
          { sym: "$\\delta$ (MDE)", desc: "minimum detectable effect — the smallest lift you commit to being able to catch (here +0.6pp); appears SQUARED in the denominator, so it dominates $n$." },
          { sym: "power (1−$\\beta$)", desc: "probability of detecting a real effect of size $\\delta$; 0.80 means a 20% chance of missing it." },
          { sym: "pp", desc: "percentage points — an ABSOLUTE change in a rate (12.0% → 12.6% is +0.6pp), not a relative percent." }
        ],
        steps: [
          { type: "decide", prompt: "Why compute the required sample size BEFORE you start?",
            options: [
              { label: "An underpowered test can't detect a real effect, so you'd risk a false 'no difference' and waste the experiment", best: true, feedback: "right. Power is the probability of catching a true effect of the size you care about. Run too small a sample and a genuine +0.6pp lift stays buried in sampling noise, so you conclude 'no effect', kill a good idea, and learn nothing — a false negative. Sizing up front guarantees you have enough signal to trust whichever way the result lands." },
              { label: "It doesn't matter — just run it until the p-value drops below 0.05", best: false, feedback: "this is 'peeking', and it's how teams ship pure noise. A p-value wanders randomly over time; if you keep checking and stop the instant it dips under 0.05, you've given a null effect many chances to cross the line, inflating the false-positive rate far past 5%. Fix $n$ in advance, then read ONCE — the discipline is the whole point." },
              { label: "Bigger is always better, so just use 100% of traffic for a year", feedback: "wasteful and risky, not safe. Power analysis finds the RIGHT size; going far beyond it exposes every user to an unvalidated change for months longer than needed and ties up traffic you could spend on other tests. More data has steeply diminishing returns once you're already powered for the MDE — past that point you're just burning opportunity." }
            ] },
          { type: "run", label: "▶ Run power analysis", prompt: "Compute the sample size for an 80%-power test.",
            result: { log: "baseline conversion: 12.0%   ->  variance p0(1-p0) = 0.1056\ntreatment 12.6%             ->  variance p1(1-p1) = 0.1101\nminimum detectable effect (MDE): delta = +0.6pp = 0.006\nsignificance alpha 0.05 (two-sided) -> z = 1.96\npower 0.80 (beta 0.20)              -> z = 0.84\nn = (1.96+0.84)^2 * (0.1056+0.1101) / 0.006^2\n  = 7.84 * 0.2157 / 0.000036\nrequired n per arm: ~58,200\nat 9,000 eligible users/day/arm -> ~7 days", metrics: [{ k: "n per arm", v: "58,200" }, { k: "MDE", v: "+0.6pp" }, { k: "runtime", v: "~7 days" }], chart: { type: "line", title: "Required sample size vs MDE (n proportional to 1/MDE^2)", xlabel: "MDE (pp)", ylabel: "n per arm", series: [
              { name: "n per arm", color: "#4ea1ff", points: [[0.3, 232800], [0.6, 58200], [0.9, 25867], [1.2, 14550]] }
            ] } } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Randomization & SRM",
        narrative: `<p>The test's validity rests on clean randomization — the only thing that makes treatment and control comparable. So the first sanity check before any analysis is: did traffic actually split as designed? A <b>Sample Ratio Mismatch (SRM)</b> — a split that deviates from the intended ratio by more than chance allows — is a red flag that something upstream is silently dropping or misrouting users, and it quietly biases every downstream number.</p>
<p><b>How the SRM chi-square check is actually computed, step by step.</b> (1) From the intended ratio and the total observed, compute the EXPECTED count in each arm: with a total of $\\approx 100{,}150$ users and a 50/50 design, each arm expects $E=50{,}075$. (2) For each arm form $(O-E)^2/E$, the squared deviation scaled by its expected count: control $(O-E)=51{,}940-50{,}075=+1865$ over the example run; treatment $(48{,}210-50{,}075)=-1865$. (3) Sum them into the statistic $\\chi^2=\\sum_k\\dfrac{(O_k-E_k)^2}{E_k}$. (4) Compare $\\chi^2$ to a chi-square distribution with $\\text{df}=(\\text{arms}-1)=1$ to read off the $p$-value — the probability of a split at least this skewed under fair randomization. Here that comes out to $p=0.0003$: a deviation this large happens about 3 times in 10,000 by chance, so the imbalance is systematic, not noise. (Intuition: a fair 50/50 split has standard deviation $\\sqrt{n\\,p(1-p)}=\\sqrt{100150\\times0.25}\\approx158$ users per arm, and $1865$ is more than ten of those — far outside normal sampling wobble.)</p>`,
        concepts: ["prob-bernoulli-binomial", "prob-clt", "prob-variance"],
        insight: `<b>A 1.9-point gap is a 3-in-10,000 event.</b> The intended 50/50 came back <b>51,940 vs 48,210</b> — and a $\\chi^2$ test puts the chance of a split that skewed under pure randomness at <b>p=0.0003</b>. That's not 'close enough'; it's a near-certain pipeline bug (here, the treatment bucket erroring out for logged-out users), so the remaining sample is biased and unanalyzable until fixed.`,
        data: {
          caption: "Assignment-split check (SRM test)",
          columns: ["arm", "intended", "observed", "share"],
          rows: [
            ["control", "50,075", "51,940", "51.9%"],
            ["treatment", "50,075", "48,210", "48.1%"],
            ["$\\chi^2$ p-value", "—", "0.0003", "⚠ SRM"]
          ],
          note: `Under true 50/50 randomization the counts would hug 50,075 each within normal sampling wobble. A $\\chi^2$ p of 0.0003 says this much imbalance almost never happens by chance — so users are being lost or misassigned NON-randomly, and the two arms are no longer apples-to-apples.`
        },
        symbols: [
          { sym: "SRM", desc: "Sample Ratio Mismatch — observed arm sizes differ from the intended ratio by more than chance explains." },
          { sym: "$\\chi^2$", desc: "chi-square statistic $\\sum_k(O_k-E_k)^2/E_k$ over the arms, where $E_k$ is the expected count under the intended ratio; compared to a $\\chi^2$ distribution with df $=$ arms $-1$ to get the $p$-value." },
          { sym: "$E_k$", desc: "expected count in arm $k$ under the intended split (here $50{,}075$ each for a 50/50 design on $\\approx100{,}150$ users) — the baseline the observed counts are measured against." },
          { sym: "p-value", desc: "probability of seeing a split this skewed (or worse) if randomization were truly fair — 0.0003 here." }
        ],
        steps: [
          { type: "run", label: "▶ Check the assignment split", result: { log: "intended split: 50% / 50%   total 100,150 -> expected E = 50,075 per arm\nobserved: control 51,940 (O-E = +1865)   treatment 48,210 (O-E = -1865)\nchi-square = sum (O-E)^2 / E  over both arms, df = 1\nfair-split SD = sqrt(100150 * 0.25) ~ 158 users; |1865| is >10 SD out\nSRM chi-square p-value: 0.0003  -> SAMPLE RATIO MISMATCH\nlikely cause: treatment bucket errors out for logged-out users (dropped before logging)", metrics: [{ k: "split", v: "51.9% / 48.1%" }, { k: "SRM p", v: "0.0003 ⚠" }] } },
          { type: "decide", prompt: "The split is 51.9/48.1 with a tiny SRM p-value. What does it mean?",
            options: [
              { label: "The randomization is broken — the buckets aren't comparable, so any result is untrustworthy until it's fixed", best: true, feedback: "right. A $\\chi^2$ p of 0.0003 means the imbalance is essentially impossible by chance, so users are being dropped or misassigned NON-randomly — here, treatment erroring out for logged-out users. The danger isn't the missing ~1.9 points of traffic; it's that whoever got dropped is a specific kind of user, so treatment and control now differ for reasons other than the button. Fix the pipeline and restart — analyzing this is analyzing a biased sample." },
              { label: "It's basically 50/50, close enough — just analyze it", feedback: "'close enough' is exactly the trap. The 51.9/48.1 gap looks small but the $\\chi^2$ test says it's a 3-in-10,000 fluke under fair randomization, which points to a systematic bug, not noise. Whatever silently dropped one arm did so selectively, so the survivors are a skewed sample and any lift you compute is confounded. Trust the SRM alarm over your eyeball." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Reduce variance",
        narrative: `<p>Smaller variance means a sharper test for the same traffic. CUPED (Controlled-experiment Using Pre-Experiment Data) uses a covariate measured <i>before</i> the test — each user's prior conversion — to strip out the part of the metric's spread that has nothing to do with your change. Because that covariate is fixed before randomization, it can't be moved by the treatment, so subtracting its influence shrinks the noise without touching the true effect.</p>
<p><b>How CUPED actually works, step by step.</b> Let $Y$ be the experiment outcome (did the user convert) and $X$ a pre-experiment covariate (their conversion in the weeks BEFORE the test). (1) Compute the adjustment coefficient $\\theta=\\dfrac{\\mathrm{Cov}(X,Y)}{\\mathrm{Var}(X)}$ — exactly the slope of regressing $Y$ on $X$, i.e. how much of $Y$ the covariate explains. (2) Form the adjusted metric $Y_{\\text{adj}}=Y-\\theta\\,(X-\\mathbb{E}[X])$: you subtract each user's covariate deviation from the mean, scaled by $\\theta$, so a user who is simply a heavy converter (high $X$) has that baked-in tendency removed. (3) Run the SAME two-proportion comparison on $Y_{\\text{adj}}$ instead of $Y$. Because $X$ was fixed before randomization it is balanced across arms, so $\\mathbb{E}[Y_{\\text{adj}}]$ is unchanged in each arm — the lift estimate is identical — but its variance drops to $\\mathrm{Var}(Y)(1-\\rho^2)$, where $\\rho=\\mathrm{Corr}(X,Y)$. Worked: if $\\rho=0.5$ then $1-\\rho^2=0.75$, so variance falls 25% — equivalent to ~25% more users for free, all of it tightening the confidence interval rather than shifting the point estimate.</p>`,
        concepts: ["prob-covariance-correlation", "prob-variance", "prob-estimation"],
        insight: `<b>Same traffic, sharper test.</b> If a pre-period covariate correlates with the outcome at $\\rho$, CUPED removes a $\\rho^2$ slice of the variance — a correlation of <b>0.5 cuts variance ~25%</b>, like getting <b>~25% more users for free</b>. The point estimate of the lift is unchanged; only its confidence interval narrows, so you detect the same effect faster or a smaller effect at the same $n$.`,
        symbols: [
          { sym: "CUPED", desc: "a variance-reduction method: replace the outcome $Y$ with the adjusted $Y_{\\text{adj}}=Y-\\theta(X-\\mathbb{E}[X])$ to remove pre-existing noise, then run the usual test on $Y_{\\text{adj}}$." },
          { sym: "$\\theta$", desc: "the CUPED coefficient $\\mathrm{Cov}(X,Y)/\\mathrm{Var}(X)$ — the regression slope of $Y$ on the covariate $X$; how much of the covariate to subtract to maximally cut variance." },
          { sym: "$Y_{\\text{adj}}$", desc: "the adjusted outcome $Y-\\theta(X-\\mathbb{E}[X])$ — each user's outcome with their pre-existing tendency removed; same per-arm mean as $Y$, smaller variance." },
          { sym: "$\\rho$", desc: "correlation between the pre-period covariate and the outcome; variance drops to $\\mathrm{Var}(Y)(1-\\rho^2)$, so $\\rho=0.5$ cuts it 25%." },
          { sym: "covariate", desc: "a pre-randomization variable $X$ (prior conversion) tied to the outcome but unaffected by the treatment, so adjusting by it stays unbiased." }
        ],
        steps: [{
          type: "decide", prompt: "Why adjust the metric using pre-experiment behavior (CUPED)?",
          options: [
            { label: "Pre-period behavior is correlated with the outcome but unaffected by the treatment, so subtracting it removes noise and tightens the confidence interval", best: true, feedback: "exactly. The covariate explains variation that exists for reasons that predate your experiment — some users just convert more — and that variation is pure noise as far as your TREATMENT effect is concerned. Because the covariate was fixed before randomization, the treatment can't have changed it, so subtracting its influence is unbiased: the point estimate stays put and only the variance shrinks. A narrower CI means the same effect detected faster, or a smaller effect detected at all." },
            { label: "It changes the true effect size to make treatment look better", best: false, feedback: "no, and if it did it would be cheating, not analysis. A valid variance-reduction adjustment is designed to leave the UNBIASED effect estimate exactly where it was — it only removes pre-existing spread around that estimate. If subtracting the covariate moved the point estimate, that would mean the covariate was correlated with the treatment assignment, which clean randomization prevents." },
            { label: "It lets you stop the test early as soon as it looks good", feedback: "variance reduction is not a license to peek. CUPED makes each read more PRECISE, but you still read at the pre-registered sample size — exactly once. Stopping early the moment the (now tighter) interval looks good reintroduces the multiple-comparisons inflation that fixing $n$ was meant to prevent. Sharper instrument, same stopping rule." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick the test",
        narrative: `<p>Your primary metric is a conversion rate — each user either converts (1) or doesn't (0), a Bernoulli outcome. The test you choose should match that structure: a two-proportion z-test compares the two conversion rates and, thanks to the Central Limit Theorem at this sample size, the difference in proportions is approximately normal. Report it as a confidence interval on the lift, not a bare p-value, so the result carries magnitude and uncertainty.</p>`,
        concepts: ["prob-bernoulli-binomial", "prob-estimation", "prob-normal"],
        insight: `<b>The metric dictates the test.</b> Conversion is a 0/1 Bernoulli variable with variance $p(1-p)$, so the principled choice is a <b>two-proportion z-test</b>. At <b>~58K users per arm</b> the CLT (Central Limit Theorem) makes the difference in rates effectively normal, and a <b>95% CI (Confidence Interval) on the lift</b> answers 'how big, and how sure?' — far more useful than a yes/no verdict at $\\alpha=0.05$.`,
        symbols: [
          { sym: "$p$", desc: "a conversion rate (proportion) — the chance a user in an arm converts; the parameter you're comparing." },
          { sym: "z-test", desc: "a test using the normal approximation to the difference in proportions, valid because $n$ is large (CLT)." },
          { sym: "95% CI", desc: "confidence interval — the range of true lifts consistent with the data; if it excludes 0 the effect is significant." },
          { sym: "Bernoulli", desc: "a 0/1 outcome (convert or not) with variance $p(1-p)$ — the shape a proportion test is built for." }
        ],
        steps: [{
          type: "decide", prompt: "Which analysis fits a binary conversion metric at this scale?",
          options: [
            { label: "A two-proportion test (z-test on the difference in conversion rates), reported with a confidence interval on the lift", best: true, feedback: "right on both counts. Conversion is a Bernoulli 0/1 outcome, so a two-proportion z-test is the natural match — it models the variance as $p(1-p)$ correctly and, at ~58K/arm, the CLT makes the difference in rates normal so the z-approximation is sound. Reporting a CI on the lift (not just a p-value) tells stakeholders the plausible RANGE of the effect, which is what a ship decision actually needs." },
            { label: "A t-test treating each conversion as a continuous score", feedback: "it would mostly work at this huge $n$ because the CLT rescues almost anything, but it's the wrong tool in principle. A t-test assumes a continuous metric with its own variance to estimate, whereas a 0/1 outcome has a KNOWN variance form $p(1-p)$ that the proportion test uses directly. Same answer here by luck of large $n$, but reach for the test that matches the metric." },
            { label: "Eyeball the two bar charts and decide", feedback: "with sampling noise this size, two bars that differ by half a point look 'higher' purely at random. Eyeballing has no notion of sampling variability, so it can't distinguish a real +0.5pp lift from noise — it's exactly how teams ship randomness. You need a test that quantifies the uncertainty, which charts alone never do." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Run the experiment",
        narrative: `<p>Launch to the planned $50/50$ split and let it run to the pre-registered sample size of ~58K per arm. Early on the numbers swing wildly — day 1 might show a +1.1pp gap that's almost entirely noise — but the Law of Large Numbers pulls the estimate toward the truth as $n$ grows. Resist the urge to stop the moment it crosses the line; the pre-committed finish line is what protects you from peeking.</p>`,
        concepts: ["prob-lln", "prob-clt", "prob-estimation"],
        insight: `<b>Noise shrinks as $n$ grows.</b> Day 1 shows a flashy <b>treatment 13.1% vs 12.0%</b> on tiny $n$, but by day 3 it's settled to <b>12.6% (p=0.07)</b> and by day 7, at the planned <b>58,400/arm</b>, it stabilizes near <b>12.5%</b>. The early swing was sampling noise; only the value at the pre-registered $n$ is the one you're allowed to act on.`,
        symbols: [
          { sym: "LLN", desc: "Law of Large Numbers — the sample mean converges to the true rate as the number of users grows, so estimates steady out." },
          { sym: "$n$/arm", desc: "users accumulated per variant; the experiment ends when it reaches the pre-registered ~58,400, not before." },
          { sym: "p=0.07", desc: "an interim p-value above 0.05 — NOT a stopping signal; the read happens only at the planned sample size." }
        ],
        steps: [{
          type: "run", label: "▶ Run to planned sample size (7 days)",
          result: { log: "day 1: control 12.0%  treatment 13.1%  (n small, noisy — DO NOT STOP)\nday 3: control 12.1%  treatment 12.6%  p=0.07\nday 7: control 12.0%  treatment 12.5%  (n=58,400/arm reached)\nestimate stabilizing as n grows (law of large numbers)\nstopping at planned n.", metrics: [{ k: "control", v: "12.0%" }, { k: "treatment", v: "12.5%" }, { k: "n/arm", v: "58.4K" }], chart: { type: "line", title: "Conversion rate stabilizing as n grows", xlabel: "day", ylabel: "conversion %", series: [
            { name: "control", color: "#4ea1ff", points: [[1, 12.0], [3, 12.1], [7, 12.0]] },
            { name: "treatment", color: "#7ee787", points: [[1, 13.1], [3, 12.6], [7, 12.5]] }
          ] } } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Read the result",
        narrative: `<p>At the planned sample size, compute the lift, its confidence interval, and the p-value — and check the guardrail too. The CI tells you the plausible RANGE of the true effect, which is far more decision-useful than a bare 'significant or not': a result can clear $p&lt;0.05$ yet have a lower bound too small to be worth the engineering cost. Statistical significance and practical significance are different questions, and shipping needs both.</p>`,
        concepts: ["prob-estimation", "prob-clt", "prob-normal"],
        insight: `<b>Significant, but read the lower bound.</b> The lift is <b>+0.5pp (relative +4.2%)</b> with <b>p=0.018</b> and a <b>95% CI of [+0.1pp, +0.9pp]</b> — it excludes 0, so the effect is real. But that lower bound (<b>+0.1pp</b>) sits below the <b>+0.6pp MDE</b> you said was worth shipping, so the true effect MIGHT be too small to matter. The revenue guardrail is neutral (+0.3%, CI spans 0), so at least there's no harm.`,
        data: {
          caption: "Primary-metric readout at the planned $n$",
          columns: ["quantity", "value", "reading"],
          rows: [
            ["control / treatment", "12.0% / 12.5%", "raw rates"],
            ["absolute lift", "+0.5pp (+4.2% rel)", "point estimate"],
            ["95% CI on lift", "[+0.1pp, +0.9pp]", "excludes 0 → real"],
            ["p-value", "0.018", "&lt; 0.05 → significant"],
            ["guardrail revenue", "+0.3% (CI spans 0)", "neutral, no harm"]
          ],
          note: `The CI is the star of this table. It excludes 0 (so the lift is probably real) but its lower end +0.1pp is BELOW the +0.6pp you cared about — so 'significant' here doesn't yet mean 'worth shipping'. The p-value alone would have hidden that nuance.`
        },
        symbols: [
          { sym: "lift", desc: "the treatment minus control conversion rate (+0.5pp here) — the effect you're trying to measure." },
          { sym: "p-value", desc: "chance of seeing a lift this large (or larger) if the button truly did nothing; 0.018 &lt; 0.05 is 'significant'." },
          { sym: "95% CI", desc: "interval of true lifts consistent with the data; excluding 0 means significant, and its width shows precision." },
          { sym: "MDE", desc: "the +0.6pp threshold you pre-set as 'worth shipping' — compare the CI's lower bound against it." }
        ],
        steps: [
          { type: "run", label: "▶ Analyze the primary metric", result: { log: "control 12.0%  treatment 12.5%\nabsolute lift: +0.5pp  (relative +4.2%)\n95% CI on lift: [+0.1pp, +0.9pp]  (excludes 0)\ntwo-proportion p-value: 0.018\nguardrail revenue/user: +0.3% (CI includes 0, neutral — no harm)", metrics: [{ k: "lift", v: "+0.5pp" }, { k: "95% CI", v: "[0.1, 0.9]" }, { k: "p", v: "0.018" }], chart: { type: "bars", title: "Conversion by arm (lift +0.5pp, 95% CI [0.1, 0.9])", labels: ["control", "treatment"], values: [12.0, 12.5], valueLabels: ["12.0%", "12.5%"], colors: ["#4ea1ff", "#7ee787"] } } },
          { type: "decide", prompt: "p=0.018 and the 95% CI is [+0.1pp, +0.9pp]. How do you read it?",
            options: [
              { label: "A statistically significant positive lift, but the CI lower bound (+0.1pp) is below the +0.6pp MDE, so check it's worth shipping", best: true, feedback: "right — this separates statistical from practical significance. p=0.018 and a CI excluding 0 mean the lift is probably REAL, but the interval says the true effect could be anywhere from +0.1pp to +0.9pp, and the low end is under the +0.6pp you decided was worth the effort. So 'significant' establishes existence, not importance; you weigh the lower bound against the cost and risk of shipping before deciding." },
              { label: "p=0.018 proves the new button definitely lifts conversion by exactly 0.5pp", feedback: "two errors. First, a p-value never 'proves' anything — it's the probability of the data under the null, not a certainty the effect is real. Second, +0.5pp is a single POINT estimate; the truth lives somewhere in the [+0.1, +0.9] interval, and reading it as exact ignores all the uncertainty the CI exists to express. Significance is evidence, not proof, and estimates are ranges, not points." },
              { label: "The CI includes small values, so the result is meaningless — discard it", feedback: "too harsh — you've thrown out a real signal. The CI is ENTIRELY positive and excludes 0, which is genuine evidence of a lift, not noise. The open question is only about MAGNITUDE: is +0.1-to-+0.9pp big enough to justify shipping? That's a judgment about value, not a reason to call the result meaningless and discard it." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Novelty & segments",
        narrative: `<p>Before declaring victory, check whether the lift is durable or just users reacting to something <i>new</i>. A treatment effect that starts large and decays over the run is the classic signature of a <b>novelty effect</b> — people click the unfamiliar thing once, then habituate. Also check that the effect holds across segments, but do it carefully: slicing many ways after the fact manufactures false winners.</p>`,
        concepts: ["prob-covariance-correlation", "prob-clt", "prob-estimation"],
        insight: `<b>A decaying curve is a warning, not a win.</b> If the lift is large on day 1 and shrinks by day 7, the durable effect is the SETTLED value, not the peak — extrapolating from day-1 enthusiasm overstates what you'll actually keep. And slicing 20 segments at $\\alpha=0.05$ yields <b>~1 'significant' segment by chance</b>, so post-hoc cherry-picking the best slice invents a winner that won't replicate.`,
        symbols: [
          { sym: "novelty effect", desc: "a temporary lift driven by a change being NEW; it decays as users habituate, so the early estimate is inflated." },
          { sym: "durable lift", desc: "the effect that remains after novelty fades — the settled value you'd actually realize long-term." },
          { sym: "multiple comparisons", desc: "testing many segments inflates false positives; ~1 in 20 looks significant at $\\alpha=0.05$ by chance alone." }
        ],
        steps: [{
          type: "decide", prompt: "Conversion lift was big on day 1 and shrank by day 7. What's the concern?",
          options: [
            { label: "A novelty effect — users click the new thing because it's new, and the lift may decay to near zero once it's familiar", best: true, feedback: "right — a decaying treatment curve is the signature of novelty. The mechanism: a fresh UI draws attention purely because it's unfamiliar, so early clicks overstate genuine preference; once users habituate, the lift settles toward its true (smaller) level. The fix is to look at returning vs new users and let it run past the novelty window so you trust the SETTLED effect, not the day-1 peak." },
            { label: "It proves the effect is huge — ship immediately based on day 1", feedback: "day-1 enthusiasm is exactly the trap novelty sets. The peak is the most inflated point of the whole curve, so shipping on it bakes in a lift you won't keep once the change stops being new. You'd over-forecast the impact, mis-allocate follow-up work, and look wrong a month later. Wait for the curve to settle before committing." },
            { label: "Slice by 20 segments and ship to whichever one looks best", feedback: "this manufactures a false winner. With 20 segments tested at $\\alpha=0.05$ you expect ~1 to look 'significant' by chance even if the button does nothing, so picking the prettiest slice after the fact is just multiple-comparisons p-hacking. If segments matter, pre-register them or apply a correction (e.g. Bonferroni) — don't shop for the best-looking cut post-hoc." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Ship the decision",
        narrative: `<p>The effect held up after the novelty window and the guardrails are neutral, so it's time to roll out — but gradually, not all at once. A staged ramp (10% → 50% → 100%) catches a scale-dependent regression before it reaches everyone, and a small long-term <b>holdback</b> — a slice deliberately kept on the old experience — lets you keep measuring whether the lift truly persists at full scale.</p>`,
        concepts: ["prob-estimation", "prob-lln", "cls-bandits"],
        insight: `<b>Ramp slowly, keep a window open.</b> Ramping <b>10% → 50% → 100%</b> means a surprise that only shows up at scale hits a fraction of users first, and a <b>5% holdback</b> kept on the old button becomes your long-term control. After the ramp, the launched-vs-holdback gap reads <b>+0.4pp</b> — durable, with novelty settled — confirming the lift is real at full traffic.`,
        symbols: [
          { sym: "holdback", desc: "a small slice (5%) permanently kept on the OLD experience — a long-term control to verify the lift persists." },
          { sym: "staged ramp", desc: "increasing exposure in steps (10/50/100%) so a scale-dependent problem is caught before it reaches all users." },
          { sym: "durable lift", desc: "the launched-vs-holdback difference (+0.4pp) measured after novelty fades — the effect you actually keep." }
        ],
        steps: [
          { type: "decide", prompt: "How should you roll out the winning variant?",
            options: [
              { label: "Ramp 10% → 50% → 100% while watching guardrails, keeping a 5% long-term holdback to verify durable lift", best: true, feedback: "this is the honest rollout. The staged ramp limits blast radius: a regression that only appears at scale (a slow query, a downstream load issue) shows up at 10% or 50% where you can roll back, instead of breaking 100% of users at once. The 5% holdback then stays on the old experience as a permanent control, so you can keep measuring the gap and prove the lift is DURABLE rather than assuming it." },
              { label: "Flip to 100% instantly and delete the experiment", feedback: "two avoidable risks. Flipping straight to 100% means any scale-dependent regression — invisible at experiment traffic — hits every user simultaneously with no safety margin to catch it. And deleting the experiment removes your only control group, so you can never again answer 'is the lift still there?' once other launches and seasonality muddy the waters. Always ramp, always keep a holdback." }
            ] },
          { type: "run", label: "▶ Roll out winner (with 5% holdback)", result: { log: "ramping new button: 10% -> 50% -> 100%...\nguardrails stable through ramp (revenue, latency neutral)\n5% long-term holdback retained\nweek 2 vs holdback: +0.4pp conversion (durable, novelty settled)\nlive.", metrics: [{ k: "durable lift", v: "+0.4pp" }, { k: "holdback", v: "5%" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & learn",
        narrative: `<p>An experiment program is only trustworthy if you keep watching after launch and bank the learning. Effects fade, and later launches in the same surface can collide with yours and absorb the gain — so the 5% holdback is your ongoing ground truth for whether the lift still exists. Just as important: write down the effect, the decision, and the caveats, so the org's memory doesn't reset every quarter.</p>`,
        concepts: ["prob-clt", "prob-estimation", "prob-lln"],
        insight: `<b>The holdback catches the fade.</b> A quarter later the launched-vs-holdback lift slipped <b>+0.4pp → +0.2pp</b> and the CI now includes 0 — a later checkout redesign overlapped and absorbed the gain. Without that retained <b>5% control</b> you'd never have seen the erosion; guardrails stayed neutral, so the action is to log the interaction and re-test in the new context.`,
        symbols: [
          { sym: "holdback", desc: "the retained 5% on the old experience — the long-term control that reveals whether the lift persists or fades." },
          { sym: "95% CI includes 0", desc: "the lift is no longer statistically distinguishable from no effect — a signal the gain has eroded." },
          { sym: "interaction", desc: "a later launch overlapping yours so their effects entangle, absorbing or amplifying the measured lift." }
        ],
        steps: [
          { type: "decide", prompt: "What should you monitor and record after shipping?",
            options: [
              { label: "Holdback vs launched lift over time, guardrail metrics, and a written record of the effect, decision and caveats", best: true, feedback: "all three matter and reinforce each other. The holdback is a live control, so comparing launched-vs-holdback over time tells you whether the gain PERSISTS or quietly fades as other launches overlap. Guardrails keep watching for late harm a one-time read would miss. And the written record builds institutional memory — so the next team doesn't burn weeks re-running this exact test or repeat the novelty mistake you already learned from." },
              { label: "Nothing — the test was significant, move on", feedback: "significance at launch says nothing about durability. Effects decay, and a later checkout redesign can absorb your gain (here the lift fell +0.4pp → +0.2pp with a CI back across 0) — but with no monitoring you'd never see it. And with no written record, the organization forgets WHY the button changed and what the caveats were, so the learning evaporates. Trustworthy experimentation continues after launch." }
            ] },
          { type: "run", label: "▶ Check the holdback this quarter", result: { log: "launched-vs-holdback lift: +0.4pp -> +0.2pp (CI now includes 0)\nlikely cause: a later checkout redesign overlapped and absorbed the gain\nguardrails: still neutral\naction: log the interaction, re-test the button in the new checkout context", metrics: [{ k: "current lift", v: "+0.2pp ⚠" }, { k: "holdback", v: "5%" }] }, note: `The loop closes here: the holdback shows the lift faded once another launch overlapped, so you log the interaction and re-test — back to <b>Frame</b>. Trustworthy experimentation never really ends.` }
        ]
      }
    ]
  }
});
