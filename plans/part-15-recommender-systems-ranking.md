# Part 15 — Recommender Systems & Ranking

> Plan only — per-topic revamp plan. See ../00-MASTER-PLAN.md for the shared design & family registry (F1–F17).
> **Code style:** every notebook code cell is written one statement per line (newline-split, blank lines between logical groups) for readability — never dense, semicolon-packed one-liners. See ../00-MASTER-PLAN.md §B.4.
> Dominant family: F14 (Ranking/Retrieval/RecSys).

### 15.1 — Collaborative filtering   [notebook: 15.1-collaborative-filtering.ipynb]   (family: F14)

**Lesson — Real World Applications (5):**
1. Streaming/video recommendations — user-user evidence predicts Ava's missing rating as 4.635 from lesson similarities 0.473 and 0.272.
2. Marketplace product rows — item-item evidence gives a lower 3.351 score, showing neighbor axis changes the recommendation.
3. Job/course recommendations — mean-centering reduces rating-scale bias to 4.335 instead of the raw neighbor 4.635.
4. Social/content feeds — tiny-overlap risk is visible when cosine can be computed from only the 3 shared items used in the toy.
5. Email/news personalization — popularity fallback is illustrative: a 4-item slate can collapse to the same head item unless similarities are normalized.

**Notebook plan:**
- Family: F14 Ranking/Retrieval/RecSys
- Concept built once (D1): `user_user_cf()` and `item_item_cf()` with masked cosine; verify lesson toy similarities 13/27.495=0.473, 9/33.045=0.272, prediction 4.635, and item-item 3.351.
- Datasets D1–D5: D1 3-item slate / tiny rating matrix · D2 small synthetic preferences · D3 +noise/ties/sparsity · D4 MovieLens-100k subset (or a small bundled ratings sample) · D5 long-tail / cold-start
- Metric: RMSE across observed holdout ratings
- Closing viz: (a) predicted-vs-true rating panels per rung  (b) RMSE-vs-sparsity curve
- Pitfall on D5: missing-as-zero and popularity masquerading as personalization; reproduce the degradation, then fix with observed-entry masking, mean-centering, and normalized similarities.
- Notes: Delete dead template helpers; CPU-only/tiny; keep overlap counts visible.

### 15.2 — Matrix factorization   [notebook: 15.2-matrix-factorization.ipynb]   (family: F14)

**Lesson — Real World Applications (5):**
1. Movie recommendation — a 2-factor dot product scores item 0 at 4.840 for user 0 in the lesson.
2. Music taste embeddings — the same user scores item 2 at 0.980, showing latent mismatch.
3. Retail personalization — user 2 and item 2 align at 4.830, reusing the same two hidden coordinates.
4. Rating prediction services — one SGD step raises prediction from 2.480 to 3.728 after a 5-star observation.
5. Catalog compression — rank controls error: lesson rank-1 error 7.141, rank-2 1.414, rank-4 0.000.

**Notebook plan:**
- Family: F14 Ranking/Retrieval/RecSys
- Concept built once (D1): `fit_mf_sgd()` with observed-entry squared loss and L2; verify lesson dot products 4.840/0.980/4.830 and the SGD update to `p'=(1.174,0.249)`, `q'=(3.086,0.423)`.
- Datasets D1–D5: D1 3-item slate / tiny rating matrix · D2 small synthetic preferences · D3 +noise/ties/sparsity · D4 MovieLens-100k subset (or a small bundled ratings sample) · D5 long-tail / cold-start
- Metric: RMSE across observed holdout ratings
- Closing viz: (a) reconstructed rating heatmaps per rung  (b) RMSE-vs-sparsity curve
- Pitfall on D5: treating blank cells as negatives and choosing rank too large; reproduce overfit, then fix with observed-only loss, validation rank choice, and regularization.
- Notes: Delete dead template helpers; CPU-only/tiny; no large downloads.

### 15.3 — Content-based & hybrid recommenders   [notebook: 15.3-content-hybrid-recommenders.ipynb]   (family: F14, gap)

**Lesson — Real World Applications (5):**
1. New-item launch ranking — content fallback scores a cold item at 0.820 in the lesson instead of zeroing it.
2. Article/product similarity — rating-weighted features form profile p=(0.900,0.500,0.600) from ratings 5,4,1.
3. Creative/content matching — candidate (1,1,0) wins by cosine 0.819 over 0.744 and 0.643.
4. Hybrid feed ranking — with alpha=0.4, item B wins at 0.836 because collaborative evidence outweighs content.
5. Cold inventory surfacing — absent collaboration is unknown, not 0; illustrative 3-candidate slate can keep the new item eligible.

**Notebook plan:**
- Family: F14 Ranking/Retrieval/RecSys
- Concept built once (D1): `content_profile()` plus `hybrid_score()`; verify lesson profile, cosine scores 0.744/0.643/0.819, and hybrid scores 0.496/0.836/0.760.
- Datasets D1–D5: D1 3-item slate / tiny rating matrix · D2 small synthetic preferences · D3 +noise/ties/sparsity · D4 MovieLens-100k subset (or a small bundled ratings sample) · D5 long-tail / cold-start
- Metric: NDCG@3 across all rungs
- Closing viz: (a) ranked slate panels with content/collab/hybrid bars  (b) NDCG@3-vs-sparsity curve
- Pitfall on D5: over-specialized content profile, uncalibrated blends, and missing collaborative evidence; reproduce narrow-bubble ranking, then fix with calibrated scores and cold-item content fallback.
- Notes: Delete dead template helpers; CPU-only/tiny; gap topic needs lesson authoring review before final citations.

### 15.4 — Learning to rank (pointwise, pairwise, listwise)   [notebook: 15.4-learning-to-rank.ipynb]   (family: F14)

**Lesson — Real World Applications (5):**
1. Search result ranking — pointwise logistic mean loss is 0.471 for labels (1,0,1) and scores (2.0,0.5,1.0).
2. Ads auction ordering — pairwise hinge loss is 0.500 when the relevant score beats the negative by only 0.500.
3. Feed ranking — smooth pairwise loss is 0.474 for the same score gap, keeping pressure on hard negatives.
4. Homepage slates — listwise target probability is 0.629 and loss 0.464 for the 3-item lesson slate.
5. Candidate re-ranking — listwise gradient (-0.371,0.140,0.231) pushes one target up and all competitors down.

**Notebook plan:**
- Family: F14 Ranking/Retrieval/RecSys
- Concept built once (D1): `rank_loss_scores()` implementing pointwise, pairwise, and listwise updates; verify lesson losses 0.471, 0.500/0.474, and 0.464.
- Datasets D1–D5: D1 3-item slate / tiny rating matrix · D2 small synthetic preferences · D3 +noise/ties/sparsity · D4 MovieLens-100k subset (or a small bundled ratings sample) · D5 long-tail / cold-start
- Metric: NDCG@3 across all rungs
- Closing viz: (a) pointwise/pairwise/listwise ranked slate panels per rung  (b) NDCG@3-vs-sparsity curve
- Pitfall on D5: optimizing pointwise loss while expecting NDCG and sampling only easy negatives; reproduce metric mismatch, then fix with hard negatives and listwise/pairwise training within query boundaries.
- Notes: Delete dead template helpers; CPU-only/tiny; keep one simple linear scorer.

### 15.5 — Ranking metrics (NDCG, MAP, MRR)   [notebook: 15.5-ranking-metrics.ipynb]   (family: F14)

**Lesson — Real World Applications (5):**
1. Web search relevance — graded list (3,2,0,1) has DCG 9.323 and NDCG 0.993.
2. Shopping search — the ideal graded ordering gives IDCG 9.393, so nearly perfect ordering is visible numerically.
3. Recommendation shelves — binary hits (1,0,1,1,0) have AP 0.806 from precisions 1.000, 0.667, 0.750.
4. Question answering — hits (0,0,1,1,0) have MRR 0.333 because first success appears at rank 3.
5. Feed evaluation — cutoff choice is concrete: NDCG@10 and NDCG@100 answer different surfaces with 10 vs 100 positions.

**Notebook plan:**
- Family: F14 Ranking/Retrieval/RecSys
- Concept built once (D1): `ranking_metrics()` for DCG/NDCG, AP/MAP, and MRR; verify lesson DCG 9.323, NDCG 0.993, AP 0.806, and MRR 0.333.
- Datasets D1–D5: D1 3-item slate / tiny rating matrix · D2 small synthetic preferences · D3 +noise/ties/sparsity · D4 MovieLens-100k subset (or a small bundled ratings sample) · D5 long-tail / cold-start
- Metric: NDCG@3 across all rungs
- Closing viz: (a) relevance-at-rank panels per rung  (b) NDCG@3-vs-sparsity curve
- Pitfall on D5: comparing different cutoffs, treating unjudged as irrelevant, and using MRR when multiple good items matter; reproduce disagreement, then fix with consistent cutoffs and explicit unjudged handling.
- Notes: Delete dead template helpers; CPU-only/tiny; this notebook is metric-only but still uses the F14 ladder.

### 15.6 — CTR prediction (Wide & Deep, DeepFM, DLRM)   [notebook: 15.6-ctr-prediction.ipynb]   (family: F14)

**Lesson — Real World Applications (5):**
1. Sponsored content ranking — lesson logit -0.100 maps to click probability 0.475.
2. Ads feature crosses — adding a wide cross changes probability from 0.250 to 0.525.
3. Marketplace recommendation — FM embedding interactions sum to 0.670 across three pairwise dots.
4. Feed ranking — linear -0.300, FM 0.670, and deep 0.250 give z=0.620 and p=0.650.
5. Bidding/pacing systems — illustrative 10:1 negative downsampling requires an intercept correction before reading p as CTR.

**Notebook plan:**
- Family: F14 Ranking/Retrieval/RecSys
- Concept built once (D1): `ctr_score()` with linear, cross, FM-dot, and optional tiny MLP terms; verify lesson probabilities 0.475, 0.250→0.525, FM sum 0.670, and p=0.650.
- Datasets D1–D5: D1 3-item slate / tiny rating matrix · D2 small synthetic preferences · D3 +noise/ties/sparsity · D4 MovieLens-100k subset (or a small bundled ratings sample) · D5 long-tail / cold-start
- Metric: NDCG@3 after ranking by predicted CTR
- Closing viz: (a) ranked CTR slate panels with calibration inset per rung  (b) NDCG@3-vs-sparsity curve
- Pitfall on D5: optimized AUC but miscalibrated probabilities, exploding crosses, and negative-sampling-rate error; reproduce miscalibration, then fix with intercept correction and calibration.
- Notes: Delete dead template helpers; CPU-only/tiny; no deep framework required.

### 15.7 — Two-tower & neural retrieval recommenders   [notebook: 15.7-two-tower-neural-retrieval.ipynb]   (family: F14)

**Lesson — Real World Applications (5):**
1. Large-catalog retrieval — dot scores 1.020, 0.880, 0.300, -0.340 identify the nearest item before deep ranking.
2. Video candidate generation — sampled-softmax positive probability is 0.665 with positive score 2.0 and negatives 1.0/0.0.
3. Job recommendation retrieval — loss is 0.408 for that positive-vs-negative competition.
4. ANN index serving — temperature changes sharpness: T=0.5 gives 0.867, T=1.0 gives 0.665, T=2.0 gives 0.506.
5. Batch training systems — a batch of 3 user-item pairs creates a 3x3 in-batch-negative score matrix.

**Notebook plan:**
- Family: F14 Ranking/Retrieval/RecSys
- Concept built once (D1): `two_tower_retrieve()` with user/item embeddings, dot or cosine scoring, sampled softmax, and recall@k; verify lesson scores, probability 0.665, loss 0.408, and temperature probabilities.
- Datasets D1–D5: D1 3-item slate / tiny rating matrix · D2 small synthetic preferences · D3 +noise/ties/sparsity · D4 MovieLens-100k subset (or a small bundled ratings sample) · D5 long-tail / cold-start
- Metric: recall@3 across all rungs
- Closing viz: (a) retrieved-neighbor panels per rung  (b) recall@3-vs-sparsity curve
- Pitfall on D5: expecting ranker-level crosses and using easy negatives; reproduce poor hard-negative recall, then fix with harder sampled negatives and explicit vector normalization.
- Notes: Delete dead template helpers; CPU-only/tiny; brute-force top-k is fine for the notebook.

### 15.8 — Sequential & session-based recommendation   [notebook: 15.8-sequential-session-recommendation.ipynb]   (family: F14, gap)

**Lesson — Real World Applications (5):**
1. Short-video next-item ranking — recency weights (0.2,0.3,0.5) produce session vector h=(0.700,0.800).
2. Shopping journeys — after item 1, transition counts give P(2|1)=2/3=0.667 and P(1|1)=0.333.
3. News sessions — attention dots (1.000,0.200,1.200) produce weights 0.374, 0.168, 0.457.
4. Search refinement — attention context becomes (0.832,0.626), preserving only pre-prediction events.
5. Cold new-user sessions — illustrative 3-click session can beat a lifetime average when current intent shifts.

**Notebook plan:**
- Family: F14 Ranking/Retrieval/RecSys
- Concept built once (D1): `next_item_score()` combining Markov counts, recency-weighted embeddings, and attention; verify lesson h=(0.700,0.800), P(2|1)=0.667, weights, and context.
- Datasets D1–D5: D1 3-item slate / tiny rating matrix · D2 small synthetic preferences · D3 +noise/ties/sparsity · D4 MovieLens-100k subset (or a small bundled ratings sample) · D5 long-tail / cold-start
- Metric: MRR for next-item prediction across all rungs
- Closing viz: (a) next-item rank panels per rung with session history highlighted  (b) MRR-vs-sparsity curve
- Pitfall on D5: shuffling sessions, old history drowning current intent, and future leakage; reproduce failure, then fix with chronological splits, recency/attention, and no future events.
- Notes: Delete dead template helpers; CPU-only/tiny; gap topic needs lesson authoring review before final citations.

### 15.9 — The cold-start problem   [notebook: 15.9-cold-start-problem.ipynb]   (family: F14, gap)

**Lesson — Real World Applications (5):**
1. New creator/item onboarding — raw CTRs 0.050, 0.100, 0.250 over-rank the 20-impression item.
2. Marketplace launch inventory — Beta(10,190) shrinkage changes those estimates to 0.050, 0.075, 0.068.
3. Content fallback ranking — new item vector (1,1) and profile (1,0.5) give cosine 0.949 before clicks exist.
4. New-user personalization — lesson blend weight w=n/(n+5) gives score 0.156 at n=20 from 0.06 and 0.18.
5. Exploration allocation — illustrative 5-event warm start is enough for w=0.5, making prior and behavior equally weighted.

**Notebook plan:**
- Family: F14 Ranking/Retrieval/RecSys
- Concept built once (D1): `cold_start_score()` with Beta-binomial shrinkage, content cosine, and behavior blend; verify raw CTRs, shrunk CTRs, cosine 0.949, and n=20 blend >0.150.
- Datasets D1–D5: D1 3-item slate / tiny rating matrix · D2 small synthetic preferences · D3 +noise/ties/sparsity · D4 MovieLens-100k subset (or a small bundled ratings sample) · D5 long-tail / cold-start
- Metric: NDCG@3 across all rungs
- Closing viz: (a) prior/content/behavior ranking panels per rung  (b) NDCG@3-vs-sparsity curve
- Pitfall on D5: confusing no data with bad data, raw CTR tiny denominators, and never exploring; reproduce self-fulfilling zero scores, then fix with shrinkage, content fallback, and allocated exposure.
- Notes: Delete dead template helpers; CPU-only/tiny; gap topic needs lesson authoring review before final citations.

### 15.10 — Bandit-based recommendation   [notebook: 15.10-bandit-based-recommendation.ipynb]   (family: F14)

**Lesson — Real World Applications (5):**
1. Homepage exploration — epsilon=0.2 over 3 arms gives best arm probability 0.867 and others 0.067.
2. New-item discovery — UCB scores 0.361, 0.775, 1.430 choose arm C despite mean 0.04 because n=5.
3. Ads creative testing — Thompson posterior means are 0.059, 0.088, 0.091 for the lesson click/non-click counts.
4. Feed experimentation — chosen rewards (0.05,0.08,0.04,0.10,0.08) yield cumulative regret ending at 0.15.
5. Safe exploration — illustrative guardrail can cap random exploration to eligible candidates while still tracking recall@3.

**Notebook plan:**
- Family: F14 Ranking/Retrieval/RecSys
- Concept built once (D1): `bandit_recommend()` implementing epsilon-greedy, UCB, and Thompson sampling; verify lesson action probabilities, UCB scores, posterior means, and regret sequence.
- Datasets D1–D5: D1 3-item slate / tiny rating matrix · D2 small synthetic preferences · D3 +noise/ties/sparsity · D4 MovieLens-100k subset (or a small bundled ratings sample) · D5 long-tail / cold-start
- Metric: recall@3 for recommended relevant arms across all rungs
- Closing viz: (a) arm-selection/ranking panels per rung  (b) recall@3-vs-sparsity curve with regret annotated
- Pitfall on D5: exploring without guardrails, stationary formulas under drift, and click-only reward; reproduce unsafe/drifting behavior, then fix with eligibility filters, recency windows, and value-weighted reward.
- Notes: Delete dead template helpers; CPU-only/tiny; keep simulation deterministic.

### 15.11 — Recommender evaluation & bias   [notebook: 15.11-recommender-evaluation-bias.ipynb]   (family: F14)

**Lesson — Real World Applications (5):**
1. Offline recommender holdouts — the lesson's 3-user example reports mean recall@3 = 1.000.
2. Exposure-biased logs — true relevance (1,1,0,1) but exposure (1,0,1,0) reveals only 1 of 3 positives.
3. Counterfactual ads evaluation — IPS weights clicks by propensities to estimate 4.000 instead of naive 0.667.
4. Feed position-bias correction — equal relevance 0.5 becomes observed rates 0.500, 0.300, 0.150, 0.075 under examination probabilities.
5. Feedback-loop monitoring — illustrative head-item traffic concentration can make future training data less diverse even if offline recall rises.

**Notebook plan:**
- Family: F14 Ranking/Retrieval/RecSys
- Concept built once (D1): `biased_eval()` computing recall@k, exposure masks, IPS with clipping, and position-bias correction; verify lesson recall@3=1.000, 1-of-3 observed positives, IPS 4.000 vs 0.667, and position rates.
- Datasets D1–D5: D1 3-item slate / tiny rating matrix · D2 small synthetic preferences · D3 +noise/ties/sparsity · D4 MovieLens-100k subset (or a small bundled ratings sample) · D5 long-tail / cold-start
- Metric: recall@3 across all rungs
- Closing viz: (a) logged-vs-true relevance panels per rung  (b) recall@3-vs-sparsity curve with biased and corrected estimates
- Pitfall on D5: treating logs as random samples, using IPS without clipping, and ignoring position bias; reproduce biased offline win, then fix with propensities, clipping, and randomized/position-aware evaluation.
- Notes: Delete dead template helpers; CPU-only/tiny; no production logs or large downloads.
