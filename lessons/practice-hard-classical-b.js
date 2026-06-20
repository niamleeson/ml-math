/* =====================================================================
   PRACTICE SET — MODULE 9B (Classical ML beyond the cheat sheet)
   Seven lessons, ~16-20 problems each, easy -> hard.
   Ids: cls-stacking, cls-anomaly, cls-recommender, cls-tsne,
        cls-factor-analysis, cls-svr, cls-bandits.
   Style: each problem has a question, 2-6 steps (each with do + why),
   and a final answer. Numbers kept small; computed by hand.
   ===================================================================== */
(function(){
  var P = window.PRACTICE;
  function add(id, probs){ P[id] = (P[id] || []).concat(probs); }

  /* ================================================================ */
  /* cls-stacking — weighted combinations of base predictions          */
  /* ================================================================ */
  add("cls-stacking", [
    {
      q:`<p>Two base models predict $z_1 = 4$ and $z_2 = 6$. A meta-model averages them equally. What is $\\hat{y}$?</p>`,
      steps:[
        {do:`An equal average uses weights $w_1 = w_2 = \\tfrac12$.`, why:`A plain average is the special stacking case with equal weights.`},
        {do:`Compute $\\hat{y} = 0.5\\cdot 4 + 0.5\\cdot 6 = 2 + 3$.`, why:`The stacked prediction is the weighted sum $\\sum_k w_k z_k$.`}
      ],
      answer:`$\\hat{y} = 5$`
    },
    {
      q:`<p>Base predictions $z_1 = 10$, $z_2 = 20$. Meta-weights $w_1 = 0.8$, $w_2 = 0.2$. Find $\\hat{y}$.</p>`,
      steps:[
        {do:`Multiply each prediction by its weight: $0.8\\cdot 10 = 8$ and $0.2\\cdot 20 = 4$.`, why:`Each weight says how much to trust that base model.`},
        {do:`Add them: $\\hat{y} = 8 + 4$.`, why:`The combiner outputs the weighted sum of base votes.`}
      ],
      answer:`$\\hat{y} = 12$`
    },
    {
      q:`<p>Three base models give $z = (3, 5, 7)$ with weights $w = (0.2, 0.5, 0.3)$. Compute the stacked prediction.</p>`,
      steps:[
        {do:`Term by term: $0.2\\cdot 3 = 0.6$, $0.5\\cdot 5 = 2.5$, $0.3\\cdot 7 = 2.1$.`, why:`Stacking dots the weight vector with the prediction vector.`},
        {do:`Sum: $\\hat{y} = 0.6 + 2.5 + 2.1$.`, why:`The meta-model output is the sum of weighted contributions.`}
      ],
      answer:`$\\hat{y} = 5.2$`
    },
    {
      q:`<p>For a valid weighted average the weights must sum to 1. If $w_1 = 0.3$ and $w_2 = 0.5$, what must $w_3$ be?</p>`,
      steps:[
        {do:`Require $w_1 + w_2 + w_3 = 1$, so $0.3 + 0.5 + w_3 = 1$.`, why:`A convex combination keeps the output on the same scale as the inputs.`},
        {do:`Solve $w_3 = 1 - 0.8$.`, why:`The leftover weight is forced once the others are fixed.`}
      ],
      answer:`$w_3 = 0.2$`
    },
    {
      q:`<p>Base predictions $z = (300, 290, 330)$ and weights $w = (0.5, 0.4, 0.1)$. The truth is $y = 300$. What is the stacked error $\\hat{y} - y$?</p>`,
      steps:[
        {do:`Stacked prediction: $0.5\\cdot 300 + 0.4\\cdot 290 + 0.1\\cdot 330 = 150 + 116 + 33 = 299$.`, why:`Combine the votes with the learned weights.`},
        {do:`Error $= \\hat{y} - y = 299 - 300$.`, why:`The signed error measures how far off the blend is.`}
      ],
      answer:`$\\hat{y} - y = -1$`
    },
    {
      q:`<p>Compare a plain average to a learned blend. $z = (8, 12, 10)$, true $y = 10$, learned weights $w = (0.25, 0.25, 0.5)$. Which is closer to $y$?</p>`,
      steps:[
        {do:`Plain average: $(8 + 12 + 10)/3 = 30/3 = 10$.`, why:`Equal weights treat all models the same.`},
        {do:`Learned: $0.25\\cdot 8 + 0.25\\cdot 12 + 0.5\\cdot 10 = 2 + 3 + 5 = 10$.`, why:`Here the weighted sum also lands on the truth.`},
        {do:`Compare $|10 - 10| = 0$ for both.`, why:`Both happen to hit $y$ exactly in this symmetric case.`}
      ],
      answer:`Both equal $10$ (a tie)`
    },
    {
      q:`<p>A linear meta-model has weights $w = (0.6, 0.4)$ and a bias $b = 2$: $\\hat{y} = w_1 z_1 + w_2 z_2 + b$. For $z = (5, 10)$, find $\\hat{y}$.</p>`,
      steps:[
        {do:`Weighted sum: $0.6\\cdot 5 + 0.4\\cdot 10 = 3 + 4 = 7$.`, why:`The combiner first blends the base predictions.`},
        {do:`Add the bias: $\\hat{y} = 7 + 2$.`, why:`A meta-model may add a constant offset like any linear model.`}
      ],
      answer:`$\\hat{y} = 9$`
    },
    {
      q:`<p>Two base models have errors $e_1 = z_1 - y = +2$ and $e_2 = z_2 - y = -4$. With equal weights, what is the blended error?</p>`,
      steps:[
        {do:`Blended error $= 0.5 e_1 + 0.5 e_2 = 0.5\\cdot 2 + 0.5\\cdot(-4)$.`, why:`Errors combine with the same weights as predictions.`},
        {do:`Compute $1 - 2 = -1$.`, why:`Opposite-sign errors partly cancel, shrinking the blend's error.`}
      ],
      answer:`Blended error $= -1$`
    },
    {
      q:`<p>Inverse-variance weighting sets $w_k \\propto 1/\\mathrm{Var}(e_k)$. Model 1 has $\\mathrm{Var} = 4$, model 2 has $\\mathrm{Var} = 1$. Find the normalized weights.</p>`,
      steps:[
        {do:`Raw weights: $1/4 = 0.25$ and $1/1 = 1$.`, why:`Less noisy models (small variance) earn bigger raw weight.`},
        {do:`Normalize by the sum $0.25 + 1 = 1.25$: $w_1 = 0.25/1.25$, $w_2 = 1/1.25$.`, why:`Dividing by the total makes the weights sum to 1.`}
      ],
      answer:`$w_1 = 0.2,\\ w_2 = 0.8$`
    },
    {
      q:`<p>Why must the meta-model train on out-of-fold predictions? If base models predict on data they memorized, the meta-model sees errors that are (smaller / larger) than at test time?</p>`,
      steps:[
        {do:`On training data a base model can overfit, so its in-sample error looks artificially small.`, why:`A memorized point is predicted almost perfectly, hiding true error.`},
        {do:`The meta-model would then over-trust those models and fail on fresh data.`, why:`Out-of-fold predictions mimic test-time error so the blend generalizes.`}
      ],
      answer:`Smaller (the meta-model would be over-optimistic)`
    },
    {
      q:`<p>Three classifiers predict probabilities $z = (1.0, 0.0, 0.5)$ with weights $w = (0.5, 0.3, 0.2)$. What stacked probability results?</p>`,
      steps:[
        {do:`Weighted sum: $0.5\\cdot 1.0 + 0.3\\cdot 0.0 + 0.2\\cdot 0.5 = 0.5 + 0 + 0.1$.`, why:`A convex combination of probabilities stays a valid probability.`},
        {do:`Total: $\\hat{p} = 0.6$.`, why:`Weights summing to 1 keep the output in $[0,1]$.`}
      ],
      answer:`$\\hat{p} = 0.6$`
    },
    {
      q:`<p>A 2-model stack minimizes $\\mathbb{E}[(w e_1 + (1-w) e_2)^2]$ with independent errors of variance $\\sigma_1^2 = 2$, $\\sigma_2^2 = 6$. What weight $w$ on model 1 is optimal?</p>`,
      steps:[
        {do:`For independent errors the optimum is $w = \\sigma_2^2 / (\\sigma_1^2 + \\sigma_2^2)$.`, why:`Inverse-variance weighting puts more weight on the lower-variance model.`},
        {do:`Plug in: $w = 6 / (2 + 6) = 6/8$.`, why:`Model 1 (variance 2) is less noisy, so it gets the larger share.`}
      ],
      answer:`$w = 0.75$ on model 1`
    },
    {
      q:`<p>Using $w = 0.75$, find the variance of the blended error $w^2\\sigma_1^2 + (1-w)^2\\sigma_2^2$ (independent errors, $\\sigma_1^2 = 2$, $\\sigma_2^2 = 6$).</p>`,
      steps:[
        {do:`Model-1 term: $0.75^2\\cdot 2 = 0.5625\\cdot 2 = 1.125$.`, why:`Independent errors add their weighted variances.`},
        {do:`Model-2 term: $0.25^2\\cdot 6 = 0.0625\\cdot 6 = 0.375$.`, why:`The smaller weight on the noisy model limits its damage.`},
        {do:`Add: $1.125 + 0.375$.`, why:`The blend variance is below either single model — that is the stacking gain.`}
      ],
      answer:`Variance $= 1.5$`
    },
    {
      q:`<p>A meta-model uses weights $w = (0.9, 0.4, -0.3)$ (a free linear combiner, not a convex average). For $z = (10, 10, 10)$, find $\\hat{y}$.</p>`,
      steps:[
        {do:`Sum the weights times the (equal) predictions: $(0.9 + 0.4 - 0.3)\\cdot 10$.`, why:`A free linear meta-model may use negative weights to subtract a correlated model.`},
        {do:`Weights sum to $1.0$, so $\\hat{y} = 1.0\\cdot 10$.`, why:`When all predictions agree, only the weight total matters.`}
      ],
      answer:`$\\hat{y} = 10$`
    },
    {
      q:`<p>Four classifiers vote "spam" probabilities $z = (0.9, 0.8, 0.3, 0.6)$ with weights $w = (0.4, 0.3, 0.1, 0.2)$. Threshold is $0.5$. Is the stacked verdict spam?</p>`,
      steps:[
        {do:`Weighted sum: $0.4\\cdot 0.9 + 0.3\\cdot 0.8 + 0.1\\cdot 0.3 + 0.2\\cdot 0.6 = 0.36 + 0.24 + 0.03 + 0.12$.`, why:`Blend the per-model probabilities by trust weight.`},
        {do:`Total $= 0.75$, compare to threshold $0.5$.`, why:`Above threshold means the positive class is chosen.`}
      ],
      answer:`Yes — stacked probability $0.75 > 0.5$, so spam`
    },
    {
      q:`<p>Show the learned combiner can never be worse than the plain average (in expected squared error). Fill the logic.</p>`,
      steps:[
        {do:`The equal-weight average is one allowed setting of the weights.`, why:`Equal weights satisfy $\\sum_k w_k = 1$, so the combiner can reproduce it.`},
        {do:`Training picks the weights that minimize expected squared error over the allowed set.`, why:`Optimizing over a set that contains the average can only match or beat it.`},
        {do:`Hence learned error $\\le$ average error.`, why:`The minimum over a superset is $\\le$ any single member's value.`}
      ],
      answer:`Learned combiner $\\le$ plain average (it can always copy the average)`
    },
    {
      q:`<p>Two stacked levels: pair $(4, 8)$ blended with $(0.5, 0.5)$ gives $m_1$; pair $(6, 6)$ blended with $(0.5,0.5)$ gives $m_2$. A top meta-model averages $m_1, m_2$ equally. Final $\\hat{y}$?</p>`,
      steps:[
        {do:`$m_1 = 0.5\\cdot 4 + 0.5\\cdot 8 = 2 + 4 = 6$.`, why:`First sub-blend combines its two base models.`},
        {do:`$m_2 = 0.5\\cdot 6 + 0.5\\cdot 6 = 6$.`, why:`Second sub-blend likewise.`},
        {do:`Top: $\\hat{y} = 0.5\\cdot 6 + 0.5\\cdot 6$.`, why:`Multi-level stacking just nests weighted sums.`}
      ],
      answer:`$\\hat{y} = 6$`
    }
  ]);

  /* ================================================================ */
  /* cls-anomaly — isolation forest path length & anomaly score        */
  /* ================================================================ */
  add("cls-anomaly", [
    {
      q:`<p>In an Isolation Forest, a short path length means a point is (easy / hard) to isolate. Which signals an anomaly?</p>`,
      steps:[
        {do:`A lonely point in empty space is sliced off after a few random cuts.`, why:`Few cuts means a short path, i.e. easy to isolate.`},
        {do:`Easy isolation is the anomaly signal.`, why:`Outliers sit in sparse regions, so they separate quickly.`}
      ],
      answer:`Easy to isolate (short path) signals an anomaly`
    },
    {
      q:`<p>A point is isolated after 3 cuts in one tree and 5 cuts in another. What is its average path length $E[h(x)]$ over these two trees?</p>`,
      steps:[
        {do:`Average the two path lengths: $(3 + 5)/2$.`, why:`$E[h(x)]$ averages the per-tree path lengths.`},
        {do:`Compute $8/2 = 4$.`, why:`The mean smooths out tree-to-tree randomness.`}
      ],
      answer:`$E[h(x)] = 4$`
    },
    {
      q:`<p>Compute the anomaly score for a point with $E[h(x)] = 2$ and normalizing constant $c(n) = 4$. Use $s(x) = 2^{-E[h]/c(n)}$.</p>`,
      steps:[
        {do:`Exponent: $-E[h]/c(n) = -2/4 = -0.5$.`, why:`The ratio compares this point's depth to a typical depth.`},
        {do:`Score: $s = 2^{-0.5} = 1/\\sqrt{2} \\approx 0.71$.`, why:`The exponential map squeezes path length into $(0,1)$.`}
      ],
      answer:`$s(x) \\approx 0.71$`
    },
    {
      q:`<p>A normal point has $E[h] = 4$ with $c(n) = 4$. What is its score, and is it the "neutral" value?</p>`,
      steps:[
        {do:`Exponent: $-4/4 = -1$.`, why:`A point at exactly the typical depth has ratio 1.`},
        {do:`Score: $s = 2^{-1} = 0.5$.`, why:`$0.5$ is the neutral score for an average-depth point.`}
      ],
      answer:`$s = 0.5$ (the neutral value)`
    },
    {
      q:`<p>With $c(n) = 8$, point A has $E[h] = 2$ and point B has $E[h] = 8$. Which has the higher anomaly score?</p>`,
      steps:[
        {do:`A: $s = 2^{-2/8} = 2^{-0.25} \\approx 0.84$.`, why:`Shorter path raises the exponent toward 0, pushing $s$ toward 1.`},
        {do:`B: $s = 2^{-8/8} = 2^{-1} = 0.5$.`, why:`A typical-depth point gets the neutral score.`}
      ],
      answer:`Point A ($\\approx 0.84$) scores higher`
    },
    {
      q:`<p>An outlier scores $s = 0.5$. What does this tell you, and would a threshold of $0.6$ flag it?</p>`,
      steps:[
        {do:`$s = 0.5$ is the neutral value — average isolation depth.`, why:`Only $s$ above the threshold is flagged.`},
        {do:`Since $0.5 < 0.6$, it is not flagged.`, why:`The point looks normal, not anomalous, by this rule.`}
      ],
      answer:`Not flagged — it looks normal ($0.5 < 0.6$)`
    },
    {
      q:`<p>If $E[h(x)] = 0$ (isolated before any cut, a degenerate extreme), what is the score $s(x)$ for any $c(n) > 0$?</p>`,
      steps:[
        {do:`Exponent: $-0/c(n) = 0$.`, why:`Zero path length means instant isolation — maximal anomaly.`},
        {do:`Score: $s = 2^0 = 1$.`, why:`$s = 1$ is the upper bound, a definite anomaly.`}
      ],
      answer:`$s(x) = 1$`
    },
    {
      q:`<p>As $E[h(x)] \\to \\infty$ (buried deep in a dense crowd), what does $s(x)$ approach?</p>`,
      steps:[
        {do:`The exponent $-E[h]/c(n) \\to -\\infty$.`, why:`A very deep point needs many cuts — clearly normal.`},
        {do:`So $s = 2^{-\\infty} \\to 0$.`, why:`The score's lower bound is 0, the "most normal" value.`}
      ],
      answer:`$s(x) \\to 0$`
    },
    {
      q:`<p>A point's path lengths across four trees are $1, 2, 1, 4$. With $c(n) = 4$, score it.</p>`,
      steps:[
        {do:`Average path: $(1 + 2 + 1 + 4)/4 = 8/4 = 2$.`, why:`$E[h]$ is the mean over the trees.`},
        {do:`Exponent $-2/4 = -0.5$, so $s = 2^{-0.5} \\approx 0.71$.`, why:`Short average path pushes the score above neutral.`}
      ],
      answer:`$s \\approx 0.71$ (likely anomaly)`
    },
    {
      q:`<p>Two points have scores $s_A = 0.72$ and $s_B = 0.40$ (threshold $0.6$). Which is flagged, and which has the longer isolation path?</p>`,
      steps:[
        {do:`$s_A = 0.72 > 0.6$ is flagged; $s_B = 0.40 < 0.6$ is not.`, why:`Only scores above threshold count as anomalies.`},
        {do:`Lower score means longer path, so B (score 0.40) has the longer path.`, why:`Score and path length move in opposite directions.`}
      ],
      answer:`A is flagged; B has the longer path`
    },
    {
      q:`<p>For $n = 2$ samples the typical path constant is $c(2) = 1$ (one cut separates two points). A point in such a subtree took $E[h] = 1$. Score it.</p>`,
      steps:[
        {do:`Exponent: $-1/1 = -1$.`, why:`The point sits exactly at the expected depth.`},
        {do:`Score: $s = 2^{-1} = 0.5$.`, why:`Average depth gives the neutral score even for tiny subtrees.`}
      ],
      answer:`$s = 0.5$`
    },
    {
      q:`<p>Point A needs $E[h] = 3$ cuts; point B needs $E[h] = 6$; both with $c(n) = 6$. By how much does A's score exceed B's?</p>`,
      steps:[
        {do:`A: $2^{-3/6} = 2^{-0.5} \\approx 0.707$.`, why:`Half the typical depth gives a clearly elevated score.`},
        {do:`B: $2^{-6/6} = 2^{-1} = 0.5$.`, why:`Full typical depth gives the neutral score.`},
        {do:`Difference: $0.707 - 0.5 \\approx 0.207$.`, why:`The gap quantifies how much more anomalous A looks.`}
      ],
      answer:`A exceeds B by $\\approx 0.21$`
    },
    {
      q:`<p>Doubling a point's average path length from $E[h] = 2$ to $E[h] = 4$ (with $c(n) = 4$): what happens to the score?</p>`,
      steps:[
        {do:`Before: $2^{-2/4} = 2^{-0.5} \\approx 0.71$.`, why:`Shorter path = higher (more anomalous) score.`},
        {do:`After: $2^{-4/4} = 2^{-1} = 0.5$.`, why:`Doubling the path halves the exponent's effect, dropping the score.`}
      ],
      answer:`Score falls from $\\approx 0.71$ to $0.5$`
    },
    {
      q:`<p>Why does a random axis-aligned cut isolate a sparse-region point faster than a dense-region point? Give the probability reasoning.</p>`,
      steps:[
        {do:`A random threshold is uniform over a feature's range, so it likely falls in the wide empty gap beside a lone point.`, why:`Empty space spans much of the range, so a cut there is probable.`},
        {do:`That single cut separates the lone point from the rest.`, why:`One well-placed cut isolates it — a short path.`},
        {do:`A dense-cluster point has neighbors on all sides, so most cuts keep it grouped.`, why:`Many cuts are needed before it is alone — a long path.`}
      ],
      answer:`Sparse points fall in big empty gaps, so one random cut isolates them`
    },
    {
      q:`<p>A forest scores a transaction at $s = 0.78$ (threshold $0.65$). Recover $E[h]/c(n)$ from $s = 2^{-E[h]/c(n)}$, using $\\log_2 0.78 \\approx -0.358$.</p>`,
      steps:[
        {do:`Take $\\log_2$ of both sides: $\\log_2 s = -E[h]/c(n)$.`, why:`Logs invert the exponential to recover the depth ratio.`},
        {do:`So $-E[h]/c(n) = -0.358$, giving $E[h]/c(n) \\approx 0.358$.`, why:`A ratio well below 1 means a short path relative to typical.`},
        {do:`Since $0.78 > 0.65$, flag the transaction.`, why:`Above threshold, it is treated as fraud.`}
      ],
      answer:`$E[h]/c(n) \\approx 0.36$; flagged as fraud`
    },
    {
      q:`<p>Forest of 100 trees: a point is isolated within 1 cut in 70 trees and within 2 cuts in 30 trees. Compute $E[h]$.</p>`,
      steps:[
        {do:`Weighted mean: $(70\\cdot 1 + 30\\cdot 2)/100 = (70 + 60)/100$.`, why:`$E[h]$ averages path length across all trees.`},
        {do:`Compute $130/100 = 1.3$.`, why:`A very short average path indicates a strong outlier.`}
      ],
      answer:`$E[h] = 1.3$`
    },
    {
      q:`<p>Using $E[h] = 1.3$ and $c(n) = 5.7$ (typical for $n = 256$), score the point. ($1.3/5.7 \\approx 0.228$, $2^{-0.228} \\approx 0.854$.)</p>`,
      steps:[
        {do:`Ratio: $E[h]/c(n) = 1.3/5.7 \\approx 0.228$.`, why:`Comparing to the realistic $c(256) \\approx 5.7$ calibrates the score.`},
        {do:`Score: $s = 2^{-0.228} \\approx 0.85$.`, why:`A path far below typical yields a high anomaly score.`}
      ],
      answer:`$s \\approx 0.85$ (strong anomaly)`
    },
    {
      q:`<p>Rank three points by anomaly: P ($E[h] = 3$), Q ($E[h] = 6$), R ($E[h] = 1.5$), all with $c(n) = 6$. Most anomalous first.</p>`,
      steps:[
        {do:`Shorter path = more anomalous, so order by $E[h]$ ascending: R (1.5), P (3), Q (6).`, why:`Score is monotone decreasing in $E[h]$, so ranking by path suffices.`},
        {do:`Check via scores: R $2^{-0.25}\\approx 0.84$, P $2^{-0.5}\\approx 0.71$, Q $2^{-1}=0.5$.`, why:`The scores confirm the path-based ranking.`}
      ],
      answer:`R, then P, then Q`
    }
  ]);

  /* ================================================================ */
  /* cls-recommender — matrix factorization dot products               */
  /* ================================================================ */
  add("cls-recommender", [
    {
      q:`<p>In matrix factorization the predicted rating is $\\hat{R}_{ui} = u_u \\cdot v_i$. For user vector $u = [1, 0]$ and item vector $v = [4, 9]$, find the prediction.</p>`,
      steps:[
        {do:`Dot product: $1\\cdot 4 + 0\\cdot 9 = 4 + 0$.`, why:`A zero in the user vector mutes that factor entirely.`},
        {do:`Sum the terms.`, why:`The dot product is the sum of element-wise products.`}
      ],
      answer:`$\\hat{R}_{ui} = 4$`
    },
    {
      q:`<p>User $u = [0.9, 0.2]$, item $v = [0.8, 0.6]$ (factors: comedy, action). Predict the rating.</p>`,
      steps:[
        {do:`Comedy term: $0.9\\cdot 0.8 = 0.72$.`, why:`A comedy-lover meeting a funny film scores high on factor 1.`},
        {do:`Action term: $0.2\\cdot 0.6 = 0.12$, then add: $0.72 + 0.12$.`, why:`Each factor's contribution sums into the final rating.`}
      ],
      answer:`$\\hat{R} = 0.84$`
    },
    {
      q:`<p>The ratings matrix $R$ is $1000 \\times 500$. Factoring as $U V^\\top$ with $k = 10$ latent factors, how many numbers does each of $U$ and $V$ hold?</p>`,
      steps:[
        {do:`$U$ has one row of $k$ numbers per user: $1000 \\times 10 = 10{,}000$.`, why:`Each user gets a length-$k$ taste vector.`},
        {do:`$V$ has one row per item: $500 \\times 10 = 5000$.`, why:`Each item gets a length-$k$ trait vector.`}
      ],
      answer:`$U$: $10{,}000$; $V$: $5000$`
    },
    {
      q:`<p>Two users, $u_1 = [1, 0]$ and $u_2 = [0, 1]$, both rate item $v = [3, 5]$. Who is predicted to rate it higher?</p>`,
      steps:[
        {do:`$u_1\\cdot v = 1\\cdot 3 + 0\\cdot 5 = 3$.`, why:`User 1 cares only about factor 1.`},
        {do:`$u_2\\cdot v = 0\\cdot 3 + 1\\cdot 5 = 5$.`, why:`User 2 cares only about factor 2, where the item is stronger.`}
      ],
      answer:`User 2 (prediction $5 > 3$)`
    },
    {
      q:`<p>Three latent factors: $u = [0.5, 1, 0.5]$, $v = [2, 1, 4]$. Compute $\\hat{R} = u\\cdot v$.</p>`,
      steps:[
        {do:`Products: $0.5\\cdot 2 = 1$, $1\\cdot 1 = 1$, $0.5\\cdot 4 = 2$.`, why:`Compute one factor at a time.`},
        {do:`Sum: $1 + 1 + 2$.`, why:`The dot product totals all factor contributions.`}
      ],
      answer:`$\\hat{R} = 4$`
    },
    {
      q:`<p>An item has trait vector $v = [0, 0]$ (a cold-start item with no latent signal). What does pure factorization predict for any user?</p>`,
      steps:[
        {do:`$\\hat{R} = u\\cdot 0 = 0$ for every user.`, why:`A zero item vector kills every product term.`},
        {do:`So the model predicts the same baseline for all users.`, why:`Cold-start items need a bias term, since pure factorization gives 0.`}
      ],
      answer:`$\\hat{R} = 0$ for every user`
    },
    {
      q:`<p>With a global bias added, $\\hat{R}_{ui} = b + u_u\\cdot v_i$ where $b = 3$. For $u = [0.5, 0.5]$, $v = [2, 0]$, predict the rating.</p>`,
      steps:[
        {do:`Dot product: $0.5\\cdot 2 + 0.5\\cdot 0 = 1$.`, why:`The latent part captures deviation from the baseline.`},
        {do:`Add the bias: $3 + 1$.`, why:`The bias centers predictions at the global average rating.`}
      ],
      answer:`$\\hat{R} = 4$`
    },
    {
      q:`<p>Observed rating $R_{ui} = 5$, model predicts $\\hat{R} = u\\cdot v = 4.2$. What is the squared error on this cell?</p>`,
      steps:[
        {do:`Residual: $R_{ui} - \\hat{R} = 5 - 4.2 = 0.8$.`, why:`Training minimizes squared error only on observed cells.`},
        {do:`Square it: $0.8^2 = 0.64$.`, why:`Squared error penalizes larger gaps more.`}
      ],
      answer:`Squared error $= 0.64$`
    },
    {
      q:`<p>Why does the dot product reward aligned taste? User $u = [1, 1]$ vs item A $v_A = [1, 1]$ and item B $v_B = [1, -1]$. Compare.</p>`,
      steps:[
        {do:`$u\\cdot v_A = 1\\cdot 1 + 1\\cdot 1 = 2$.`, why:`Same-direction vectors reinforce, giving a large product.`},
        {do:`$u\\cdot v_B = 1\\cdot 1 + 1\\cdot(-1) = 0$.`, why:`Opposite components cancel, giving a low rating.`}
      ],
      answer:`Item A scores $2$; item B scores $0$ — alignment wins`
    },
    {
      q:`<p>A user vector has L2 norm $\\|u\\| = 2$, an item vector has $\\|v\\| = 3$, and the angle between them is $0$. Predict $\\hat{R} = u\\cdot v$.</p>`,
      steps:[
        {do:`$u\\cdot v = \\|u\\|\\,\\|v\\|\\cos\\theta$.`, why:`The dot product splits into magnitudes times the cosine of the angle.`},
        {do:`With $\\theta = 0$, $\\cos\\theta = 1$, so $\\hat{R} = 2\\cdot 3\\cdot 1$.`, why:`Perfect alignment gives the maximum possible rating for these magnitudes.`}
      ],
      answer:`$\\hat{R} = 6$`
    },
    {
      q:`<p>Same magnitudes $\\|u\\| = 2$, $\\|v\\| = 3$ but the vectors are orthogonal ($\\theta = 90^\\circ$). Predict $\\hat{R}$.</p>`,
      steps:[
        {do:`$\\cos 90^\\circ = 0$.`, why:`Orthogonal taste and traits share nothing.`},
        {do:`So $\\hat{R} = 2\\cdot 3\\cdot 0$.`, why:`No alignment means no predicted preference.`}
      ],
      answer:`$\\hat{R} = 0$`
    },
    {
      q:`<p>A $2\\times 2$ block of $U V^\\top$: $U$ rows $u_1 = [1, 0]$, $u_2 = [0, 2]$; $V$ rows $v_1 = [3, 1]$, $v_2 = [1, 1]$. Find the full predicted block.</p>`,
      steps:[
        {do:`$\\hat{R}_{11} = u_1\\cdot v_1 = 3$, $\\hat{R}_{12} = u_1\\cdot v_2 = 1$.`, why:`Row 1 of $U$ dotted with each item row.`},
        {do:`$\\hat{R}_{21} = u_2\\cdot v_1 = 0\\cdot 3 + 2\\cdot 1 = 2$, $\\hat{R}_{22} = u_2\\cdot v_2 = 2$.`, why:`Row 2 dotted with each item row completes the block.`}
      ],
      answer:`$\\hat{R} = \\begin{bmatrix} 3 & 1 \\\\ 2 & 2 \\end{bmatrix}$`
    },
    {
      q:`<p>Regularized loss on one cell is $(R_{ui} - u\\cdot v)^2 + \\lambda(\\|u\\|^2 + \\|v\\|^2)$. With $R = 4$, $u\\cdot v = 4$, $\\lambda = 0.1$, $\\|u\\|^2 = 2$, $\\|v\\|^2 = 3$, compute the loss.</p>`,
      steps:[
        {do:`Error term: $(4 - 4)^2 = 0$.`, why:`A perfect fit on this cell costs nothing in the error term.`},
        {do:`Penalty: $0.1\\cdot(2 + 3) = 0.1\\cdot 5 = 0.5$.`, why:`The regularizer still charges for vector size to prevent overfitting.`}
      ],
      answer:`Loss $= 0.5$`
    },
    {
      q:`<p>SGD updates a user factor: $U_{uf} \\leftarrow U_{uf} + \\eta\\,(e\\cdot V_{if})$ with error $e = R - \\hat{R}$. With $\\eta = 0.1$, $e = 2$, $V_{if} = 0.5$, current $U_{uf} = 1.0$, find the new value.</p>`,
      steps:[
        {do:`Step size: $\\eta\\cdot e\\cdot V_{if} = 0.1\\cdot 2\\cdot 0.5 = 0.1$.`, why:`The user factor moves toward reducing this cell's error.`},
        {do:`Update: $1.0 + 0.1$.`, why:`A positive error nudges the factor up along the item direction.`}
      ],
      answer:`$U_{uf} = 1.1$`
    },
    {
      q:`<p>To recommend, rank a user's predicted ratings over unrated items. User $u = [1, 1]$; items $v_A = [2, 0]$, $v_B = [0, 3]$, $v_C = [1, 1]$. Which is the top recommendation?</p>`,
      steps:[
        {do:`$u\\cdot v_A = 2$, $u\\cdot v_B = 3$, $u\\cdot v_C = 1 + 1 = 2$.`, why:`Predict each unrated item via dot product.`},
        {do:`Pick the max: B has $3$.`, why:`The highest predicted rating is recommended first.`}
      ],
      answer:`Recommend item B (predicted $3$)`
    },
    {
      q:`<p>Two users have nearly identical factor vectors $u_1 = [0.8, 0.3]$ and $u_2 = [0.79, 0.31]$. What does this imply about their recommendations?</p>`,
      steps:[
        {do:`Their dot products with any item $v$ are almost equal: $u_1\\cdot v \\approx u_2\\cdot v$.`, why:`Close vectors give close predictions for every item.`},
        {do:`So they get nearly the same ranked recommendations.`, why:`Similar latent taste is exactly what collaborative filtering exploits.`}
      ],
      answer:`They receive nearly identical recommendations`
    },
    {
      q:`<p>A blank cell is predicted from $u = [0.6, 0.6]$ and $v = [0.5, 0.5]$. The known cells in that row average $0.7$. Is the prediction above or below the row average?</p>`,
      steps:[
        {do:`Predict: $0.6\\cdot 0.5 + 0.6\\cdot 0.5 = 0.3 + 0.3 = 0.6$.`, why:`The dot product gives the filled-in value.`},
        {do:`Compare $0.6$ to the row average $0.7$.`, why:`A below-average prediction means this item suits the user less than usual.`}
      ],
      answer:`$0.6$, below the row average $0.7$`
    },
    {
      q:`<p>A rank-1 factorization gives every user a scalar taste $u_u$ and every item a scalar trait $v_i$, so $\\hat{R}_{ui} = u_u v_i$. If $u = (2, 1, 3)$ and $v = (1, 4)$, find the prediction for user 3, item 2.</p>`,
      steps:[
        {do:`Pick $u_3 = 3$ and $v_2 = 4$.`, why:`A rank-1 model is a single product per cell.`},
        {do:`Multiply: $\\hat{R}_{32} = 3\\cdot 4$.`, why:`With $k = 1$ the dot product collapses to one term.`}
      ],
      answer:`$\\hat{R}_{32} = 12$`
    }
  ]);

  /* ================================================================ */
  /* cls-tsne — neighbor affinities & reasoning                        */
  /* ================================================================ */
  add("cls-tsne", [
    {
      q:`<p>t-SNE's 2-D map affinity (unnormalized) is $(1 + d^2)^{-1}$. For two map points at distance $d = 1$, compute it.</p>`,
      steps:[
        {do:`Square the distance: $d^2 = 1$.`, why:`The Student-t kernel uses squared distance.`},
        {do:`Affinity $= (1 + 1)^{-1} = 1/2$.`, why:`Closer points get higher affinity (more neighborly).`}
      ],
      answer:`Affinity $= 0.5$`
    },
    {
      q:`<p>Same kernel $(1 + d^2)^{-1}$. Compute the affinity for $d = 3$.</p>`,
      steps:[
        {do:`$d^2 = 9$.`, why:`Square the distance first.`},
        {do:`Affinity $= (1 + 9)^{-1} = 1/10$.`, why:`Far points get low affinity, marking them as non-neighbors.`}
      ],
      answer:`Affinity $= 0.1$`
    },
    {
      q:`<p>Pair A is at map distance $d = 1$ (affinity $0.5$); pair B at $d = 3$ (affinity $0.1$). How many times more "neighborly" is A?</p>`,
      steps:[
        {do:`Take the ratio $0.5 / 0.1$.`, why:`Relative affinity tells the layout how tightly to bind pairs.`},
        {do:`Compute $5$.`, why:`A is five times more strongly pulled together.`}
      ],
      answer:`$5\\times$ more neighborly`
    },
    {
      q:`<p>Why does t-SNE square distances and invert? Compare $d = 0$ (coincident) to large $d$ for $(1 + d^2)^{-1}$.</p>`,
      steps:[
        {do:`At $d = 0$: $(1 + 0)^{-1} = 1$, the maximum affinity.`, why:`Coincident points are perfect neighbors.`},
        {do:`As $d \\to \\infty$: $(1 + d^2)^{-1} \\to 0$.`, why:`The kernel decays smoothly from 1 to 0, a valid neighbor weight.`}
      ],
      answer:`Ranges from $1$ (at $d=0$) down to $0$ (large $d$)`
    },
    {
      q:`<p>Compare the Gaussian map kernel $e^{-d^2}$ to the Student-t kernel $(1+d^2)^{-1}$ at $d = 2$. Which keeps more weight on far points?</p>`,
      steps:[
        {do:`Gaussian: $e^{-4} \\approx 0.018$.`, why:`The Gaussian falls off fast — far points nearly vanish.`},
        {do:`Student-t: $(1 + 4)^{-1} = 0.2$.`, why:`The heavy tail keeps real weight on moderately far points.`}
      ],
      answer:`Student-t ($0.2 \\gg 0.018$) keeps more weight`
    },
    {
      q:`<p>The heavy tail lets distinct clusters spread out. At $d = 4$, by what factor does Student-t affinity exceed the Gaussian's? ($e^{-16} \\approx 1.1\\times 10^{-7}$.)</p>`,
      steps:[
        {do:`Student-t: $(1 + 16)^{-1} = 1/17 \\approx 0.0588$.`, why:`The Student-t tail stays appreciable even at $d=4$.`},
        {do:`Ratio: $0.0588 / (1.1\\times 10^{-7}) \\approx 5\\times 10^5$.`, why:`The Gaussian crushes far points; Student-t does not, opening cluster gaps.`}
      ],
      answer:`About $5\\times 10^5$ times larger`
    },
    {
      q:`<p>Normalize three unnormalized affinities into $q_{ij}$: pairs have affinities $0.5, 0.3, 0.2$. Find $q$ for the first pair.</p>`,
      steps:[
        {do:`Sum the affinities: $0.5 + 0.3 + 0.2 = 1.0$.`, why:`$q_{ij}$ divides each affinity by the total so they sum to 1.`},
        {do:`$q_1 = 0.5 / 1.0$.`, why:`Normalization turns affinities into a probability distribution.`}
      ],
      answer:`$q_1 = 0.5$`
    },
    {
      q:`<p>KL divergence cost is $\\sum p_{ij}\\log(p_{ij}/q_{ij})$. For one pair, $p = 0.4$, $q = 0.4$. What is its contribution?</p>`,
      steps:[
        {do:`Ratio $p/q = 0.4/0.4 = 1$, so $\\log 1 = 0$.`, why:`A perfectly matched pair adds nothing to the cost.`},
        {do:`Contribution $= 0.4\\cdot 0 = 0$.`, why:`KL is zero exactly when $q$ matches $p$.`}
      ],
      answer:`Contribution $= 0$`
    },
    {
      q:`<p>For a pair with $p = 0.4$ but $q = 0.2$ (placed too far on the map), compute the KL contribution $p\\log(p/q)$ using natural log ($\\ln 2 \\approx 0.693$).</p>`,
      steps:[
        {do:`Ratio: $p/q = 0.4/0.2 = 2$, so $\\ln 2 \\approx 0.693$.`, why:`A positive log means the map under-weights a true neighbor.`},
        {do:`Contribution: $0.4\\cdot 0.693 \\approx 0.277$.`, why:`This positive cost pushes gradient descent to pull the pair closer.`}
      ],
      answer:`$\\approx 0.277$`
    },
    {
      q:`<p>Two map points at $d = 1$ are pulled to $d = 0.5$ by gradient descent. How does their affinity $(1+d^2)^{-1}$ change?</p>`,
      steps:[
        {do:`Before: $(1 + 1)^{-1} = 0.5$.`, why:`Original affinity at $d=1$.`},
        {do:`After: $(1 + 0.25)^{-1} = 1/1.25 = 0.8$.`, why:`Shrinking the distance raises affinity toward the high-D target.`}
      ],
      answer:`Affinity rises from $0.5$ to $0.8$`
    },
    {
      q:`<p>In high-D, points $i,j$ are close so $p_{ij}$ is large, but on the current map they are far so $q_{ij}$ is small. Which way does gradient descent move them?</p>`,
      steps:[
        {do:`The cost term $p\\log(p/q)$ is positive because $p > q$.`, why:`The map under-represents a real neighbor relation.`},
        {do:`Descent reduces the cost by raising $q$, i.e. pulling the points together.`, why:`Closer points have larger $q$, matching the high $p$.`}
      ],
      answer:`Pulled together (closer)`
    },
    {
      q:`<p>Perplexity roughly sets the neighbor count. With perplexity $\\approx 30$, about how many nearest neighbors define each point's $p$ distribution? (Order of magnitude.)</p>`,
      steps:[
        {do:`Perplexity is $2^{H}$ where $H$ is the entropy of the neighbor distribution.`, why:`It behaves like an effective number of neighbors.`},
        {do:`Perplexity $30$ means each point attends to roughly $30$ neighbors.`, why:`This controls the local-vs-global balance of the embedding.`}
      ],
      answer:`About $30$ neighbors`
    },
    {
      q:`<p>Three map pairs have distances $d = 0, 1, 2$. Rank their affinities $(1+d^2)^{-1}$ and give the values.</p>`,
      steps:[
        {do:`$d=0$: $1$; $d=1$: $0.5$; $d=2$: $0.2$.`, why:`Affinity strictly decreases with distance.`},
        {do:`Rank: $d=0$ highest, then $d=1$, then $d=2$.`, why:`Closer pairs are always more neighborly under this kernel.`}
      ],
      answer:`$1 > 0.5 > 0.2$ (for $d = 0, 1, 2$)`
    },
    {
      q:`<p>The heavy tail keeps affinity finite at large $d$, relieving "crowding". At $d = 5$, what is $(1+d^2)^{-1}$?</p>`,
      steps:[
        {do:`$d^2 = 25$, so affinity $= (1 + 25)^{-1} = 1/26 \\approx 0.0385$.`, why:`Even at $d = 5$ the affinity is small but nonzero.`},
        {do:`A nonzero value lets the layout place points far apart without infinite cost.`, why:`The heavy tail relieves the crowding problem.`}
      ],
      answer:`$\\approx 0.0385$`
    },
    {
      q:`<p>UMAP vs t-SNE: both preserve local neighbors, but which is generally noted for better global layout and speed?</p>`,
      steps:[
        {do:`t-SNE optimizes local KL with a heavy-tailed map kernel.`, why:`It excels at local cluster separation but can distort global distances.`},
        {do:`UMAP uses a different neighbor graph model.`, why:`It tends to be faster and preserve global structure better.`}
      ],
      answer:`UMAP (faster, better global structure)`
    },
    {
      q:`<p>Two pairs: A at $d = 1$, B at $d = 2$. After normalizing only these two affinities, what fraction of the probability mass goes to A?</p>`,
      steps:[
        {do:`Affinities: A $= 0.5$, B $= 0.2$.`, why:`Compute each with $(1+d^2)^{-1}$.`},
        {do:`Normalize: $q_A = 0.5/(0.5 + 0.2) = 0.5/0.7$.`, why:`Divide A's affinity by the total to get its probability.`}
      ],
      answer:`$q_A = 5/7 \\approx 0.71$`
    },
    {
      q:`<p>If you double every map distance uniformly, do the relative $q_{ij}$ values stay the same? Test pairs at $d = 1, 2$ vs $d = 2, 4$.</p>`,
      steps:[
        {do:`Original: $0.5$ and $0.2$, ratio $2.5$.`, why:`Affinities at $d=1,2$.`},
        {do:`Doubled: $(1+4)^{-1} = 0.2$ and $(1+16)^{-1} \\approx 0.0588$, ratio $\\approx 3.4$.`, why:`The kernel is nonlinear, so uniform scaling changes ratios.`}
      ],
      answer:`No — the ratio changes ($2.5 \\to \\approx 3.4$)`
    },
    {
      q:`<p>A point lies between two clusters. Its high-D neighbor probabilities are $p = 0.6$ to cluster 1 and $0.4$ to cluster 2. Where should the map place it?</p>`,
      steps:[
        {do:`KL cost wants $q$ to match $p$: $0.6$ toward cluster 1, $0.4$ toward cluster 2.`, why:`The point must be near both, weighted by $p$.`},
        {do:`Higher $p$ to cluster 1 means it sits closer to cluster 1 but still between them.`, why:`The layout balances both attractions, leaning to the stronger one.`}
      ],
      answer:`Between the clusters, slightly nearer cluster 1`
    }
  ]);

  /* ================================================================ */
  /* cls-factor-analysis — x = Lambda z + mu + epsilon                 */
  /* ================================================================ */
  add("cls-factor-analysis", [
    {
      q:`<p>The model is $x = \\Lambda z + \\mu + \\epsilon$. Ignore noise. A signal has loading $\\Lambda = 2$, baseline $\\mu = 5$, factor $z = 1$. Find $x$.</p>`,
      steps:[
        {do:`Factor contribution: $\\Lambda z = 2\\cdot 1 = 2$.`, why:`The loading scales how strongly the factor moves the signal.`},
        {do:`Add baseline: $x = 2 + 5$.`, why:`$\\mu$ sets the signal's resting level.`}
      ],
      answer:`$x = 7$`
    },
    {
      q:`<p>Loading $\\Lambda = 3$, baseline $\\mu = 50$, factor $z = -2$ (ignore noise). Compute $x$.</p>`,
      steps:[
        {do:`$\\Lambda z = 3\\cdot(-2) = -6$.`, why:`A negative factor pulls the signal below baseline.`},
        {do:`$x = -6 + 50$.`, why:`Add the baseline to the factor effect.`}
      ],
      answer:`$x = 44$`
    },
    {
      q:`<p>One hidden factor "ability" $z = 1.5$ loads on three tests with $\\Lambda = [2, 1.5, 1]^\\top$, baselines $\\mu = [70, 60, 80]$. Find test-1's score (ignore noise).</p>`,
      steps:[
        {do:`Factor effect: $\\Lambda_1 z = 2\\cdot 1.5 = 3$.`, why:`Test 1 responds most strongly (largest loading).`},
        {do:`Add baseline: $3 + 70$.`, why:`Each test sits at its own baseline.`}
      ],
      answer:`Test 1 $= 73$`
    },
    {
      q:`<p>Same setup: $z = 1.5$, $\\Lambda = [2, 1.5, 1]^\\top$, $\\mu = [70, 60, 80]$. Find tests 2 and 3.</p>`,
      steps:[
        {do:`Test 2: $1.5\\cdot 1.5 + 60 = 2.25 + 60$.`, why:`Smaller loading means a smaller shift.`},
        {do:`Test 3: $1\\cdot 1.5 + 80 = 1.5 + 80$.`, why:`The same hidden $z$ moves all three together.`}
      ],
      answer:`Test 2 $= 62.25$, Test 3 $= 81.5$`
    },
    {
      q:`<p>Two factors load on one signal: $\\Lambda = [2, -1]$ (row), factors $z = [1, 3]^\\top$, baseline $\\mu = 4$. Find $x$ (ignore noise).</p>`,
      steps:[
        {do:`Factor effect: $\\Lambda z = 2\\cdot 1 + (-1)\\cdot 3 = 2 - 3 = -1$.`, why:`Loadings can be negative, so factors can subtract.`},
        {do:`Add baseline: $-1 + 4$.`, why:`Combine the net factor pull with the baseline.`}
      ],
      answer:`$x = 3$`
    },
    {
      q:`<p>The factors are standardized: $z \\sim \\mathcal{N}(0, I)$. What are the mean and variance of a single factor $z_1$?</p>`,
      steps:[
        {do:`$\\mathcal{N}(0, I)$ means each factor has mean $0$.`, why:`Factors are centered so $\\mu$ alone carries the baseline.`},
        {do:`The identity covariance gives each factor variance $1$.`, why:`Standardized factors have unit variance and are uncorrelated.`}
      ],
      answer:`Mean $0$, variance $1$`
    },
    {
      q:`<p>The model covariance is $\\mathrm{Cov}(x) = \\Lambda\\Lambda^\\top + \\Psi$. With single factor $\\Lambda = [2, 1]^\\top$ and noise $\\Psi = \\mathrm{diag}(0.5, 0.5)$, find the variance of signal 1.</p>`,
      steps:[
        {do:`Shared part: $(\\Lambda\\Lambda^\\top)_{11} = 2\\cdot 2 = 4$.`, why:`The diagonal of $\\Lambda\\Lambda^\\top$ holds each signal's factor-driven variance.`},
        {do:`Add noise: $4 + 0.5$.`, why:`$\\Psi$ adds private per-signal variance on the diagonal.`}
      ],
      answer:`$\\mathrm{Var}(x_1) = 4.5$`
    },
    {
      q:`<p>Same $\\Lambda = [2, 1]^\\top$. What is the covariance between signals 1 and 2 (off-diagonal of $\\Lambda\\Lambda^\\top + \\Psi$)?</p>`,
      steps:[
        {do:`Off-diagonal: $(\\Lambda\\Lambda^\\top)_{12} = 2\\cdot 1 = 2$.`, why:`A shared factor creates correlation between signals.`},
        {do:`$\\Psi$ is diagonal, so it adds $0$ off-diagonal.`, why:`Private noise cannot create cross-signal covariance.`}
      ],
      answer:`$\\mathrm{Cov}(x_1, x_2) = 2$`
    },
    {
      q:`<p>Why do the cross terms $\\mathbb{E}[\\Lambda z\\,\\epsilon^\\top]$ vanish when deriving $\\mathrm{Cov}(x)$?</p>`,
      steps:[
        {do:`Factors $z$ and noise $\\epsilon$ are independent and both mean-zero.`, why:`Independence lets the expectation factor into a product.`},
        {do:`$\\mathbb{E}[z\\epsilon^\\top] = \\mathbb{E}[z]\\mathbb{E}[\\epsilon^\\top] = 0$.`, why:`A product of zero means is zero, killing the cross term.`}
      ],
      answer:`They vanish (independent, mean-zero factors and noise)`
    },
    {
      q:`<p>Factor analysis vs PCA: which models per-variable noise via a diagonal $\\Psi$, separating shared structure from private junk?</p>`,
      steps:[
        {do:`PCA fits all variance with components, treating noise the same everywhere.`, why:`PCA has no explicit per-variable noise term.`},
        {do:`Factor analysis adds a diagonal $\\Psi$ for private noise.`, why:`That diagonal lets it pull out shared structure cleanly.`}
      ],
      answer:`Factor analysis (it has the diagonal noise $\\Psi$)`
    },
    {
      q:`<p>A signal's total variance is $5$. Its factor-explained (communality) part is $3$. What fraction of its variance is private noise?</p>`,
      steps:[
        {do:`Noise variance $= 5 - 3 = 2$.`, why:`Total $=$ shared (communality) $+$ private noise.`},
        {do:`Fraction $= 2/5$.`, why:`The uniqueness is the noise share of total variance.`}
      ],
      answer:`$2/5 = 0.4$ is noise`
    },
    {
      q:`<p>The communality of a signal with loadings $\\Lambda = [3, 4]$ on two factors is $\\Lambda_1^2 + \\Lambda_2^2$. Compute it.</p>`,
      steps:[
        {do:`Square each loading: $3^2 = 9$, $4^2 = 16$.`, why:`Communality sums squared loadings across factors.`},
        {do:`Add: $9 + 16$.`, why:`This is the variance the factors jointly explain for the signal.`}
      ],
      answer:`Communality $= 25$`
    },
    {
      q:`<p>Center the data so $\\mu = 0$, giving $x = \\Lambda z + \\epsilon$. For $\\Lambda = [2, 1]^\\top$, $z = 1.5$, noise sample $\\epsilon = [0.2, -0.1]^\\top$, find $x$.</p>`,
      steps:[
        {do:`Signal 1: $2\\cdot 1.5 + 0.2 = 3 + 0.2$.`, why:`Factor effect plus this signal's noise.`},
        {do:`Signal 2: $1\\cdot 1.5 - 0.1 = 1.5 - 0.1$.`, why:`Each signal adds its own private noise.`}
      ],
      answer:`$x = [3.2, 1.4]^\\top$`
    },
    {
      q:`<p>Three signals load on one factor with $\\Lambda = [1, 1, 1]^\\top$ and equal noise $\\Psi = \\mathrm{diag}(1, 1, 1)$. What is the covariance between any two distinct signals?</p>`,
      steps:[
        {do:`Off-diagonal of $\\Lambda\\Lambda^\\top$: $1\\cdot 1 = 1$.`, why:`Equal loadings give equal pairwise covariance.`},
        {do:`Diagonal noise adds nothing off-diagonal.`, why:`So every distinct pair has covariance $1$.`}
      ],
      answer:`Covariance $= 1$ for each pair`
    },
    {
      q:`<p>From the previous setup ($\\Lambda = [1,1,1]^\\top$, unit noise), find the correlation between two signals. Each variance is $1 + 1 = 2$.</p>`,
      steps:[
        {do:`Correlation $= \\mathrm{Cov}/(\\sigma_1\\sigma_2) = 1/(\\sqrt{2}\\cdot\\sqrt{2})$.`, why:`Standardize covariance by the two standard deviations.`},
        {do:`Compute $1/2$.`, why:`Shared factor plus equal noise gives moderate correlation.`}
      ],
      answer:`Correlation $= 0.5$`
    },
    {
      q:`<p>A finance model uses 2 market factors. Stock A has loadings $\\Lambda_A = [1.2, 0.3]$; factor returns today are $z = [0.5, -1]^\\top$ (ignore idiosyncratic noise, $\\mu = 0$). Predict A's return.</p>`,
      steps:[
        {do:`Factor 1: $1.2\\cdot 0.5 = 0.6$.`, why:`Stock A is sensitive (high loading) to factor 1.`},
        {do:`Factor 2: $0.3\\cdot(-1) = -0.3$; sum $0.6 - 0.3$.`, why:`Loadings combine the two factor moves into the return.`}
      ],
      answer:`Return $= 0.3$`
    },
    {
      q:`<p>Two signals have loadings $\\Lambda_1 = [2, 0]$ and $\\Lambda_2 = [0, 2]$ (each on a different factor). What is their covariance? Noise is diagonal.</p>`,
      steps:[
        {do:`Off-diagonal of $\\Lambda\\Lambda^\\top$: $2\\cdot 0 + 0\\cdot 2 = 0$.`, why:`They share no common factor, so no shared variance.`},
        {do:`Diagonal noise adds nothing off-diagonal.`, why:`Signals on disjoint factors are uncorrelated.`}
      ],
      answer:`Covariance $= 0$`
    },
    {
      q:`<p>Recover a factor: if signal $x_1 = 7$, baseline $\\mu_1 = 5$, loading $\\Lambda_1 = 2$, and noise is ignored, what factor value $z$ explains it?</p>`,
      steps:[
        {do:`Solve $x_1 = \\Lambda_1 z + \\mu_1$: $7 = 2z + 5$.`, why:`Invert the model to estimate the hidden factor.`},
        {do:`So $2z = 2$, $z = 1$.`, why:`A unit factor lifts this signal by its loading above baseline.`}
      ],
      answer:`$z = 1$`
    }
  ]);

  /* ================================================================ */
  /* cls-svr — epsilon-tube & support vectors                          */
  /* ================================================================ */
  add("cls-svr", [
    {
      q:`<p>SVR uses $\\varepsilon$-insensitive loss $L_\\varepsilon = \\max(0, |y - f(x)| - \\varepsilon)$. With $\\varepsilon = 1$, a point has error $|y - f(x)| = 0.5$. Find its loss.</p>`,
      steps:[
        {do:`Subtract $\\varepsilon$: $0.5 - 1 = -0.5$.`, why:`Errors inside the tube give a negative pre-clamp value.`},
        {do:`Clamp: $\\max(0, -0.5) = 0$.`, why:`Inside the tube the loss is forgiven entirely.`}
      ],
      answer:`Loss $= 0$ (inside the tube)`
    },
    {
      q:`<p>With $\\varepsilon = 1$, a point has error $2.5$. Compute its $\\varepsilon$-insensitive loss.</p>`,
      steps:[
        {do:`Subtract: $2.5 - 1 = 1.5$.`, why:`Outside the tube the excess beyond $\\varepsilon$ is charged.`},
        {do:`Clamp: $\\max(0, 1.5) = 1.5$.`, why:`Positive excess is the loss; the point is a support vector.`}
      ],
      answer:`Loss $= 1.5$`
    },
    {
      q:`<p>A point sits exactly on the tube edge: error $= \\varepsilon = 1$. What is its loss?</p>`,
      steps:[
        {do:`Subtract: $1 - 1 = 0$.`, why:`At the edge the excess is exactly zero.`},
        {do:`Clamp: $\\max(0, 0) = 0$.`, why:`Edge points are still free; loss only grows strictly outside.`}
      ],
      answer:`Loss $= 0$`
    },
    {
      q:`<p>Tube half-width $\\varepsilon = 0.5$. The fit predicts $f(x) = 5$. Is a point with true $y = 5.4$ inside the tube?</p>`,
      steps:[
        {do:`Error: $|5.4 - 5| = 0.4$.`, why:`Compare the absolute error to the tube half-width.`},
        {do:`Since $0.4 < 0.5$, it is inside.`, why:`Inside-tube points cost nothing and are not support vectors.`}
      ],
      answer:`Inside (error $0.4 < 0.5$)`
    },
    {
      q:`<p>Which points are support vectors: those inside or outside the $\\varepsilon$-tube? Why?</p>`,
      steps:[
        {do:`Inside points have $L_\\varepsilon = 0$, a flat region with zero gradient.`, why:`Zero gradient means they exert no force on the weights.`},
        {do:`Outside points have slope $\\pm 1$, pushing on $w$.`, why:`Only the outside points determine the fit, so they are the support vectors.`}
      ],
      answer:`Outside points are the support vectors`
    },
    {
      q:`<p>Five points have errors $0.2, 0.9, 1.0, 1.5, 2.0$ with $\\varepsilon = 1$. How many are support vectors?</p>`,
      steps:[
        {do:`Support vectors have error $> \\varepsilon = 1$: that is $1.5$ and $2.0$.`, why:`Strictly outside the tube means a support vector.`},
        {do:`The error $1.0$ is on the edge (loss 0), not strictly outside.`, why:`Edge points are absorbed by the tube.`}
      ],
      answer:`$2$ support vectors`
    },
    {
      q:`<p>The SVR objective is $\\tfrac12\\|w\\|^2 + C\\sum_i L_\\varepsilon$. With $w = [3, 4]$, what is $\\tfrac12\\|w\\|^2$?</p>`,
      steps:[
        {do:`$\\|w\\|^2 = 3^2 + 4^2 = 9 + 16 = 25$.`, why:`Squared norm sums the squared components.`},
        {do:`Half it: $\\tfrac12\\cdot 25$.`, why:`The flatness term penalizes large weights.`}
      ],
      answer:`$\\tfrac12\\|w\\|^2 = 12.5$`
    },
    {
      q:`<p>Total SVR cost with $C = 2$: flatness $\\tfrac12\\|w\\|^2 = 5$ and two outside points with losses $1.5$ and $0.5$. Find the total objective.</p>`,
      steps:[
        {do:`Sum of losses: $1.5 + 0.5 = 2.0$.`, why:`Only outside points contribute loss.`},
        {do:`Total: $5 + 2\\cdot 2.0 = 5 + 4$.`, why:`$C$ scales the data-fitting term against flatness.`}
      ],
      answer:`Total $= 9$`
    },
    {
      q:`<p>The fitted line is $f(x) = 0.8x + 1$ with $\\varepsilon = 0.7$. At $x = 5$, a point has $y = 6.0$. Is it a support vector?</p>`,
      steps:[
        {do:`Predict: $f(5) = 0.8\\cdot 5 + 1 = 4 + 1 = 5$.`, why:`Evaluate the line at the point's $x$.`},
        {do:`Error: $|6.0 - 5| = 1.0 > 0.7$.`, why:`Error exceeds the tube half-width, so it sits outside.`}
      ],
      answer:`Yes — error $1.0 > 0.7$, a support vector`
    },
    {
      q:`<p>Same line $f(x) = 0.8x + 1$, $\\varepsilon = 0.7$. At $x = 2$, a point has $y = 2.4$. Compute its loss.</p>`,
      steps:[
        {do:`Predict: $f(2) = 0.8\\cdot 2 + 1 = 1.6 + 1 = 2.6$.`, why:`Evaluate the fit at $x = 2$.`},
        {do:`Error $|2.4 - 2.6| = 0.2 < 0.7$, so $L_\\varepsilon = 0$.`, why:`Inside the tube, the point is free.`}
      ],
      answer:`Loss $= 0$`
    },
    {
      q:`<p>Increasing $\\varepsilon$ from $0.5$ to $1.5$ on a fixed dataset: does the number of support vectors usually go up or down?</p>`,
      steps:[
        {do:`A wider tube absorbs more points.`, why:`More points now have error $< \\varepsilon$, so loss $0$.`},
        {do:`Fewer points remain outside.`, why:`Fewer outside points means fewer support vectors.`}
      ],
      answer:`Down (a wider tube absorbs more points)`
    },
    {
      q:`<p>The penalty $C$ trades flatness against fit. A very large $C$ pushes the model to do what with outside points?</p>`,
      steps:[
        {do:`Large $C$ heavily weights the loss term $C\\sum L_\\varepsilon$.`, why:`The optimizer prioritizes shrinking outside errors.`},
        {do:`So it bends the fit to reduce outside-point error, risking overfit.`, why:`Flatness is sacrificed to fit stubborn points tightly.`}
      ],
      answer:`Fit them tightly (less flat, more overfitting risk)`
    },
    {
      q:`<p>The dual solution writes $w = \\sum_i (\\alpha_i - \\alpha_i^*) x_i$ where only support vectors have nonzero $(\\alpha_i - \\alpha_i^*)$. If 3 of 100 points are support vectors, how many terms are nonzero?</p>`,
      steps:[
        {do:`Inside-tube points have $\\alpha_i - \\alpha_i^* = 0$.`, why:`Their loss is flat, so they drop out of the weight sum.`},
        {do:`Only the 3 support vectors contribute.`, why:`The fit "rests on" the support vectors alone.`}
      ],
      answer:`$3$ nonzero terms`
    },
    {
      q:`<p>Two outside points pull the line: one above with $+1$ slope, one below with $-1$ slope. What is the net first-order pull on the intercept?</p>`,
      steps:[
        {do:`Above point pushes intercept up ($+1$), below point pushes down ($-1$).`, why:`Each outside point pulls with a unit-size force toward itself.`},
        {do:`Net: $+1 + (-1) = 0$.`, why:`Balanced support vectors leave the intercept at equilibrium.`}
      ],
      answer:`Net pull $= 0$ (balanced)`
    },
    {
      q:`<p>Compare SVR to least squares on an outlier with error $10$ and $\\varepsilon = 1$. What loss does each assign?</p>`,
      steps:[
        {do:`SVR: $\\max(0, 10 - 1) = 9$ (linear).`, why:`The $\\varepsilon$-insensitive loss grows only linearly outside.`},
        {do:`Least squares: $10^2 = 100$ (quadratic).`, why:`Squared loss explodes on outliers, making OLS more sensitive.`}
      ],
      answer:`SVR $= 9$; least squares $= 100$`
    },
    {
      q:`<p>A point's error equals $\\varepsilon + 0.3$ (just outside). If you grow $\\varepsilon$ by $0.3$ so the point lands on the edge, how does its loss change?</p>`,
      steps:[
        {do:`Before: loss $= (\\varepsilon + 0.3) - \\varepsilon = 0.3$.`, why:`Loss is the excess beyond the tube.`},
        {do:`After widening: error $= \\varepsilon + 0.3$ equals the new edge, so loss $= 0$.`, why:`The point now sits on the edge, costing nothing.`}
      ],
      answer:`Loss drops from $0.3$ to $0$`
    },
    {
      q:`<p>Three points with errors $0.4, 1.2, 0.9$ and $\\varepsilon = 1$. Compute the total $\\varepsilon$-insensitive loss summed over all three.</p>`,
      steps:[
        {do:`Losses: $\\max(0, 0.4-1)=0$, $\\max(0, 1.2-1)=0.2$, $\\max(0, 0.9-1)=0$.`, why:`Only the error $1.2$ exceeds the tube.`},
        {do:`Sum: $0 + 0.2 + 0$.`, why:`Only outside points add to the total loss.`}
      ],
      answer:`Total loss $= 0.2$`
    },
    {
      q:`<p>A support vector is $2.5$ above the tube edge (loss slope toward it is $-1$ per unit). If we move the prediction up by $0.1$, reducing its error, how does its loss change?</p>`,
      steps:[
        {do:`Loss slope is $-1$ per unit of error reduced.`, why:`Closing the gap lowers the linear loss one-for-one.`},
        {do:`Change: $-1\\cdot 0.1 = -0.1$.`, why:`A $0.1$ error reduction drops the loss by $0.1$.`}
      ],
      answer:`Loss decreases by $0.1$`
    }
  ]);

  /* ================================================================ */
  /* cls-bandits — epsilon-greedy & UCB choices over rounds            */
  /* ================================================================ */
  add("cls-bandits", [
    {
      q:`<p>$\\varepsilon$-greedy with $\\varepsilon = 0.1$: with what probability do you pull the current best arm (exploit)?</p>`,
      steps:[
        {do:`You explore (random arm) with probability $\\varepsilon = 0.1$.`, why:`$\\varepsilon$ is the chance of trying a random arm.`},
        {do:`So you exploit with probability $1 - 0.1$.`, why:`Exploit and explore probabilities sum to 1.`}
      ],
      answer:`$0.9$`
    },
    {
      q:`<p>Three arms have averages $\\bar{x} = (0.3, 0.7, 0.5)$. Which does a pure-greedy ($\\varepsilon = 0$) policy pull?</p>`,
      steps:[
        {do:`Greedy picks the largest average.`, why:`With $\\varepsilon = 0$ there is no exploration.`},
        {do:`Arm 2 has $\\bar{x} = 0.7$, the max.`, why:`Greedy exploits the best-so-far estimate.`}
      ],
      answer:`Arm 2`
    },
    {
      q:`<p>UCB score is $\\bar{x}_i + \\sqrt{\\frac{2\\ln t}{n_i}}$. At $t = 10$ ($2\\ln 10 \\approx 4.6$), arm X has $\\bar{x} = 0.8$, $n = 4$. Compute its UCB.</p>`,
      steps:[
        {do:`Bonus: $\\sqrt{4.6/4} = \\sqrt{1.15} \\approx 1.07$.`, why:`The bonus rewards arms with few pulls.`},
        {do:`UCB $= 0.8 + 1.07$.`, why:`Add the optimism bonus to the average.`}
      ],
      answer:`UCB $\\approx 1.87$`
    },
    {
      q:`<p>At $t = 10$ ($2\\ln t \\approx 4.6$), an arm has been pulled $n = 1$ time. Compute its exploration bonus.</p>`,
      steps:[
        {do:`Bonus: $\\sqrt{4.6/1} = \\sqrt{4.6}$.`, why:`A rarely-pulled arm gets a large bonus.`},
        {do:`$\\sqrt{4.6} \\approx 2.14$.`, why:`Big uncertainty means "worth another look".`}
      ],
      answer:`Bonus $\\approx 2.14$`
    },
    {
      q:`<p>Two arms at $t = 10$ ($2\\ln t \\approx 4.6$): A has $\\bar{x} = 0.6$, $n = 6$; C has $\\bar{x} = 0.7$, $n = 1$. Which does UCB pull?</p>`,
      steps:[
        {do:`A: bonus $\\sqrt{4.6/6} = \\sqrt{0.767} \\approx 0.88$, UCB $\\approx 1.48$.`, why:`More pulls shrink the bonus.`},
        {do:`C: bonus $\\sqrt{4.6/1} \\approx 2.14$, UCB $\\approx 2.84$.`, why:`C's huge uncertainty bonus dominates.`}
      ],
      answer:`Arm C (UCB $\\approx 2.84 > 1.48$)`
    },
    {
      q:`<p>Why does the UCB bonus shrink as $n_i$ grows? Compare the bonus at $n = 1$ vs $n = 100$ (same $2\\ln t = 4.6$).</p>`,
      steps:[
        {do:`At $n = 1$: $\\sqrt{4.6/1} \\approx 2.14$.`, why:`Little data means large uncertainty.`},
        {do:`At $n = 100$: $\\sqrt{4.6/100} = \\sqrt{0.046} \\approx 0.21$.`, why:`More pulls give a confident estimate, so the bonus fades.`}
      ],
      answer:`$2.14$ at $n=1$ vs $\\approx 0.21$ at $n=100$ — it shrinks`
    },
    {
      q:`<p>The bonus $\\sqrt{2\\ln t / n_i}$ depends on $t$ even for an unpulled arm. As other arms get pulled and $t$ rises, what happens to a neglected arm's bonus?</p>`,
      steps:[
        {do:`$t$ increases while $n_i$ stays fixed.`, why:`Pulling other arms still advances the global clock $t$.`},
        {do:`So $\\sqrt{2\\ln t / n_i}$ slowly grows.`, why:`UCB eventually revisits neglected arms — it never fully abandons them.`}
      ],
      answer:`It slowly grows (the arm gets revisited eventually)`
    },
    {
      q:`<p>An arm has rewards $1, 0, 1, 1$ over four pulls. What is its current average $\\bar{x}$?</p>`,
      steps:[
        {do:`Sum rewards: $1 + 0 + 1 + 1 = 3$.`, why:`The average is total reward over pulls.`},
        {do:`Divide by $n = 4$: $3/4$.`, why:`This running mean is the exploit estimate.`}
      ],
      answer:`$\\bar{x} = 0.75$`
    },
    {
      q:`<p>After the average above ($\\bar{x} = 0.75$, $n = 4$), the arm is pulled again and yields reward $1$. Update the average.</p>`,
      steps:[
        {do:`New sum: $3 + 1 = 4$; new count $n = 5$.`, why:`Accumulate the new reward and increment the count.`},
        {do:`New average: $4/5$.`, why:`Incremental update keeps the running mean current.`}
      ],
      answer:`$\\bar{x} = 0.8$`
    },
    {
      q:`<p>Incremental mean update: $\\bar{x}_{\\text{new}} = \\bar{x} + \\tfrac1n(r - \\bar{x})$. With $\\bar{x} = 0.5$, new reward $r = 1$, this being the $n = 5$th pull, find the new mean.</p>`,
      steps:[
        {do:`Step: $\\tfrac15(1 - 0.5) = \\tfrac15\\cdot 0.5 = 0.1$.`, why:`Each new sample nudges the mean by a shrinking amount.`},
        {do:`New mean: $0.5 + 0.1$.`, why:`This avoids re-summing all past rewards.`}
      ],
      answer:`$\\bar{x}_{\\text{new}} = 0.6$`
    },
    {
      q:`<p>Three arms at $t = 10$ ($2\\ln t \\approx 4.6$): A ($\\bar{x}=0.6$, $n=6$), B ($\\bar{x}=0.5$, $n=3$), C ($\\bar{x}=0.7$, $n=1$). Rank by UCB.</p>`,
      steps:[
        {do:`A: $0.6 + \\sqrt{4.6/6} \\approx 0.6 + 0.88 = 1.48$.`, why:`Compute each UCB = average + bonus.`},
        {do:`B: $0.5 + \\sqrt{4.6/3} \\approx 0.5 + 1.24 = 1.74$; C: $0.7 + \\sqrt{4.6/1} \\approx 0.7 + 2.14 = 2.84$.`, why:`Fewer pulls give bigger bonuses.`},
        {do:`Rank: C $>$ B $>$ A.`, why:`Optimism favors the least-explored arms first.`}
      ],
      answer:`C ($2.84$) > B ($1.74$) > A ($1.48$)`
    },
    {
      q:`<p>Regret is best-arm reward minus what you earned. Over 3 pulls the best arm pays $0.7$ each; you earned $0.7, 0.3, 0.5$. What is the total regret?</p>`,
      steps:[
        {do:`Per-pull regret: $0.7 - 0.7 = 0$, $0.7 - 0.3 = 0.4$, $0.7 - 0.5 = 0.2$.`, why:`Regret per round is the gap to the best arm.`},
        {do:`Sum: $0 + 0.4 + 0.2$.`, why:`Total regret accumulates each round's shortfall.`}
      ],
      answer:`Total regret $= 0.6$`
    },
    {
      q:`<p>$\\varepsilon$-greedy with $\\varepsilon = 0.2$ over 3 arms explores uniformly. What is the probability of pulling a specific arm via exploration on one step?</p>`,
      steps:[
        {do:`Explore happens with probability $0.2$, split over $3$ arms uniformly: $0.2/3$ per arm.`, why:`Standard $\\varepsilon$-greedy explores uniformly over all arms.`},
        {do:`So a specific arm gets $0.2/3 \\approx 0.0667$ from exploration.`, why:`Each arm shares the exploration budget equally.`}
      ],
      answer:`$\\approx 0.067$`
    },
    {
      q:`<p>UCB must try each arm once before its bonus is defined (else $n_i = 0$). With 4 arms, how many pulls are spent on this initialization?</p>`,
      steps:[
        {do:`Each of the 4 arms is pulled once.`, why:`A zero count makes the bonus undefined (division by zero).`},
        {do:`Total initialization pulls $= 4$.`, why:`After that, every arm has $n_i \\ge 1$ and UCB is well-defined.`}
      ],
      answer:`$4$ pulls`
    },
    {
      q:`<p>At $t = 100$, $2\\ln t \\approx 9.21$. Arm A: $\\bar{x} = 0.50$, $n = 50$. Arm B: $\\bar{x} = 0.45$, $n = 10$. Which does UCB pull?</p>`,
      steps:[
        {do:`A: bonus $\\sqrt{9.21/50} = \\sqrt{0.184} \\approx 0.43$, UCB $\\approx 0.93$.`, why:`A well-tried arm has a modest bonus.`},
        {do:`B: bonus $\\sqrt{9.21/10} = \\sqrt{0.921} \\approx 0.96$, UCB $\\approx 1.41$.`, why:`B's smaller count gives a larger bonus.`},
        {do:`B wins ($1.41 > 0.93$).`, why:`Despite a lower average, B's uncertainty still earns a pull.`}
      ],
      answer:`Arm B (UCB $\\approx 1.41$)`
    },
    {
      q:`<p>The UCB bonus comes from Hoeffding's bound $e^{-2 n_i u^2} = t^{-4}$. Solve for $u$ to show $u = \\sqrt{2\\ln t / n_i}$.</p>`,
      steps:[
        {do:`Take logs: $-2 n_i u^2 = -4\\ln t$.`, why:`Logs turn the exponential bound into a solvable equation.`},
        {do:`So $u^2 = \\tfrac{4\\ln t}{2 n_i} = \\tfrac{2\\ln t}{n_i}$.`, why:`Isolate $u^2$ by dividing both sides.`},
        {do:`Square-root: $u = \\sqrt{2\\ln t / n_i}$.`, why:`This is the high-confidence width of the bonus.`}
      ],
      answer:`$u = \\sqrt{2\\ln t / n_i}$`
    },
    {
      q:`<p>UCB round 1 ($t=2$, $2\\ln 2 \\approx 1.386$): arm A ($\\bar{x}=1$, $n=1$), arm B ($\\bar{x}=0$, $n=1$). Which is pulled?</p>`,
      steps:[
        {do:`A: $1 + \\sqrt{1.386/1} \\approx 1 + 1.18 = 2.18$.`, why:`Both arms have one pull, so the bonuses are equal.`},
        {do:`B: $0 + \\sqrt{1.386/1} \\approx 1.18$.`, why:`Same bonus, but A's higher average wins.`}
      ],
      answer:`Arm A (UCB $\\approx 2.18$)`
    },
    {
      q:`<p>Continue: A is pulled and yields reward $0$, so A now has $\\bar{x} = 0.5$, $n = 2$; B still $\\bar{x} = 0$, $n = 1$; now $t = 3$, $2\\ln 3 \\approx 2.197$. Which is pulled next?</p>`,
      steps:[
        {do:`A: $0.5 + \\sqrt{2.197/2} = 0.5 + \\sqrt{1.099} \\approx 0.5 + 1.05 = 1.55$.`, why:`A's bonus shrank (more pulls) and its average dropped.`},
        {do:`B: $0 + \\sqrt{2.197/1} \\approx 1.48$.`, why:`B is still under-explored, so its bonus is larger.`},
        {do:`A wins narrowly ($1.55 > 1.48$).`, why:`UCB balances A's higher estimate against B's uncertainty.`}
      ],
      answer:`Arm A (UCB $\\approx 1.55$ vs B $\\approx 1.48$)`
    }
  ]);

})();
