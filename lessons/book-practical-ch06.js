/* Practical Statistics for Data Scientists (Bruce & Bruce, O'Reilly 2017)
   Chapter 6 — Statistical Machine Learning. Self-registering book-template lessons. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "Practical Statistics";
  const BOOK = "Practical Statistics for Data Scientists";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: BOOK }, o));

  // ---------------------------------------------------------------- KNN
  B({
    id: "ps-ch6-knn",
    chapter: "Chapter 6",
    title: "K-Nearest Neighbors",
    tagline: "Classify a record the way its most similar records are classified.",
    sections: [
      { h: "The whole idea", body:
        "<p>K-Nearest Neighbors (KNN) is one of the simplest predictive methods. There is no model to fit, as there is in regression. For each new record you want to classify or predict, you do three things.</p>" +
        "<ul class='steps'>" +
        "<li>Find the <em>K</em> records that have the most similar predictor values to the new record. These are its neighbors.</li>" +
        "<li>For classification: see which class is the majority among those K neighbors, and assign that class to the new record.</li>" +
        "<li>For prediction (called KNN regression): take the average outcome of the K neighbors and predict that average.</li>" +
        "</ul>" +
        "<p>Because there is no fitted model, the results depend entirely on three choices: how the features are scaled, how similarity is measured, and how big <em>K</em> is. All predictors must be numeric.</p>" },
      { h: "Loan default example", body:
        "<p>The book uses personal loan data from Lending Club, a peer-to-peer lender. Each loan record has an outcome (paid off or default) plus predictors. The goal is to predict whether a new loan will be paid off or default.</p>" +
        "<table class='extable'><thead><tr><th>Outcome</th><th class='num'>Loan amount</th><th class='num'>Income</th><th>Purpose</th><th class='num'>Years employed</th><th>Home ownership</th><th>State</th></tr></thead><tbody>" +
        "<tr><td class='row-h'>Paid off</td><td class='num'>10000</td><td class='num'>79100</td><td>debt_consolidation</td><td class='num'>11</td><td>MORTGAGE</td><td>NV</td></tr>" +
        "<tr><td class='row-h'>Paid off</td><td class='num'>9600</td><td class='num'>48000</td><td>moving</td><td class='num'>5</td><td>MORTGAGE</td><td>TN</td></tr>" +
        "<tr><td class='row-h'>Paid off</td><td class='num'>18800</td><td class='num'>120036</td><td>debt_consolidation</td><td class='num'>11</td><td>MORTGAGE</td><td>MD</td></tr>" +
        "<tr><td class='row-h'>Default</td><td class='num'>15250</td><td class='num'>232000</td><td>small_business</td><td class='num'>9</td><td>MORTGAGE</td><td>CA</td></tr>" +
        "<tr><td class='row-h'>Paid off</td><td class='num'>17050</td><td class='num'>35000</td><td>debt_consolidation</td><td class='num'>4</td><td>RENT</td><td>MD</td></tr>" +
        "<tr><td class='row-h'>Paid off</td><td class='num'>5500</td><td class='num'>43000</td><td>debt_consolidation</td><td class='num'>4</td><td>RENT</td><td>KS</td></tr>" +
        "</tbody></table>" +
        "<p>A simple version uses just two predictors. <code>dti</code> is the ratio of debt payments (excluding mortgage) to income, and <code>payment_inc_ratio</code> is the ratio of the loan payment to income, both multiplied by 100. Using 200 known loans and $K = 20$, a new loan with <code>dti</code> = 22.5 and <code>payment_inc_ratio</code> = 9 is predicted. Of the 20 nearest loans, 14 defaulted and 6 were paid off, so the prediction is <strong>default</strong>.</p>" +
        "<p>That majority can also be read as a probability. The fraction defaulting is the propensity score:</p>" +
        "<ul class='steps'><li>$\\text{Prob(default)} = \\frac{14}{20} = 0.7$.</li></ul>" +
        "<p>A probability lets you use a cutoff other than a simple majority (0.5). For a rare class you would typically set the cutoff below 50%.</p>" },
      { h: "Distance metrics", body:
        "<p>Similarity, or nearness, is measured by a <em>distance metric</em>: a function that turns the gap between two records $(x_1, x_2, \\ldots, x_p)$ and $(u_1, u_2, \\ldots, u_p)$ into a single number. The most popular is <em>Euclidean distance</em>. Subtract one vector from the other, square the differences, sum them, and take the square root:</p>" +
        "<p>$\\sqrt{(x_1 - u_1)^2 + (x_2 - u_2)^2 + \\cdots + (x_p - u_p)^2}$</p>" +
        "<p>Euclidean distance is the straight-line distance between two points, as the crow flies. It is fast to compute, which matters because KNN does $K \\times n$ pairwise comparisons, where $n$ is the number of rows.</p>" +
        "<p>Another common metric for numeric data is <em>Manhattan distance</em>, the sum of absolute differences:</p>" +
        "<p>$|x_1 - u_1| + |x_2 - u_2| + \\cdots + |x_p - u_p|$</p>" +
        "<p>Manhattan distance is the distance traveled one direction at a time, like walking rectangular city blocks. It is a good approximation when similarity means point-to-point travel time.</p>" +
        "<p>The book also mentions <em>Mahalanobis distance</em>, which accounts for correlation between variables (treating two highly correlated variables almost as one), at the cost of more computation via the covariance matrix.</p>" },
      { h: "One-hot encoding", body:
        "<p>The loan data has factor (string) variables such as home ownership. Most models need these turned into binary dummy variables that carry the same information. Instead of one variable with values like owns-with-mortgage, owns-without-mortgage, rents, or other, you get four binary columns. Each record gets a single 1 and the rest 0s. The name comes from digital circuits, where only one bit may be hot.</p>" +
        "<table class='extable'><thead><tr><th class='num'>MORTGAGE</th><th class='num'>OTHER</th><th class='num'>OWN</th><th class='num'>RENT</th></tr></thead><tbody>" +
        "<tr><td class='num'>1</td><td class='num'>0</td><td class='num'>0</td><td class='num'>0</td></tr>" +
        "<tr><td class='num'>1</td><td class='num'>0</td><td class='num'>0</td><td class='num'>0</td></tr>" +
        "<tr><td class='num'>1</td><td class='num'>0</td><td class='num'>0</td><td class='num'>0</td></tr>" +
        "<tr><td class='num'>1</td><td class='num'>0</td><td class='num'>0</td><td class='num'>0</td></tr>" +
        "<tr><td class='num'>0</td><td class='num'>0</td><td class='num'>0</td><td class='num'>1</td></tr>" +
        "<tr><td class='num'>0</td><td class='num'>0</td><td class='num'>0</td><td class='num'>1</td></tr>" +
        "</tbody></table>" +
        "<p>In linear and logistic regression, one full set of dummies causes multicollinearity, so one dummy is dropped (it can be inferred from the rest). That is not an issue for KNN.</p>" },
      { h: "Standardization and z-scores", body:
        "<p>When you measure distance, a variable measured on a large scale dominates the result. For the loan data, distance would be almost entirely a function of income and loan amount (in the tens or hundreds of thousands), while ratio variables count for almost nothing. The fix is to <em>standardize</em> (also called <em>normalization</em>): put every variable on a similar scale by subtracting its mean and dividing by its standard deviation.</p>" +
        "<p>$z = \\dfrac{x - \\bar{x}}{s}$</p>" +
        "<p>The result is a <em>z-score</em>: each value is now stated in standard deviations away from the mean, so a variable's influence no longer depends on the scale of its original units.</p>" +
        "<p>The book adds a fourth predictor, <code>revol_bal</code>, the total revolving credit in dollars, alongside <code>dti</code>, <code>payment_inc_ratio</code>, and <code>revol_util</code>. On the raw data the five nearest neighbors match the new record only on <code>revol_bal</code> (the big-scale dollar variable) and are all over the map on the others — <code>revol_bal</code> alone is driving the result:</p>" +
        "<table class='extable'><thead><tr><th>row</th><th class='num'>payment_inc_ratio</th><th class='num'>dti</th><th class='num'>revol_bal</th><th class='num'>revol_util</th></tr></thead><tbody>" +
        "<tr><td class='row-h'>new</td><td class='num'>2.3932</td><td class='num'>1</td><td class='num'>1687</td><td class='num'>9.4</td></tr>" +
        "<tr><td class='row-h'>36054</td><td class='num'>2.22024</td><td class='num'>0.79</td><td class='num'>1687</td><td class='num'>8.4</td></tr>" +
        "<tr><td class='row-h'>33233</td><td class='num'>5.97874</td><td class='num'>1.03</td><td class='num'>1692</td><td class='num'>6.2</td></tr>" +
        "<tr><td class='row-h'>28989</td><td class='num'>5.65339</td><td class='num'>5.40</td><td class='num'>1694</td><td class='num'>7.0</td></tr>" +
        "<tr><td class='row-h'>29572</td><td class='num'>5.00128</td><td class='num'>1.84</td><td class='num'>1695</td><td class='num'>5.1</td></tr>" +
        "<tr><td class='row-h'>20962</td><td class='num'>9.42600</td><td class='num'>7.14</td><td class='num'>1683</td><td class='num'>8.6</td></tr>" +
        "</tbody></table>" +
        "<p>After standardizing each variable to a z-score, the five nearest neighbors are much more alike across all four variables, giving a more sensible result. The book prints the neighbors below on the original dollar/ratio scales even though KNN was run on the z-scored matrix:</p>" +
        "<table class='extable'><thead><tr><th>row</th><th class='num'>payment_inc_ratio</th><th class='num'>dti</th><th class='num'>revol_bal</th><th class='num'>revol_util</th></tr></thead><tbody>" +
        "<tr><td class='row-h'>new</td><td class='num'>2.3932</td><td class='num'>1</td><td class='num'>1687</td><td class='num'>9.4</td></tr>" +
        "<tr><td class='row-h'>2081</td><td class='num'>2.61091</td><td class='num'>1.03</td><td class='num'>1218</td><td class='num'>9.7</td></tr>" +
        "<tr><td class='row-h'>36054</td><td class='num'>2.22024</td><td class='num'>0.79</td><td class='num'>1687</td><td class='num'>8.4</td></tr>" +
        "<tr><td class='row-h'>23655</td><td class='num'>2.34286</td><td class='num'>1.12</td><td class='num'>523</td><td class='num'>10.7</td></tr>" +
        "<tr><td class='row-h'>41327</td><td class='num'>2.15987</td><td class='num'>0.69</td><td class='num'>2115</td><td class='num'>8.1</td></tr>" +
        "<tr><td class='row-h'>39555</td><td class='num'>2.76891</td><td class='num'>0.75</td><td class='num'>2129</td><td class='num'>9.5</td></tr>" +
        "</tbody></table>" +
        "<p>The book notes z-scoring is just one rescaling; you could use the median and the interquartile range instead, and scaling every variable to equal variance is itself a (somewhat arbitrary) choice.</p>" },
      { h: "Choosing K", body:
        "<p>The choice of <em>K</em> strongly affects performance. The simplest is $K = 1$, the 1-nearest neighbor classifier: predict using the single most similar training record. It is intuitive but rarely best — you almost always do better with $K \\gt 1$.</p>" +
        "<ul class='steps'>" +
        "<li>If K is too low, you overfit: you pick up the noise in the data.</li>" +
        "<li>Higher K smooths the data, reducing the risk of overfitting.</li>" +
        "<li>If K is too high, you oversmooth and miss the local structure that is KNN's main advantage.</li>" +
        "</ul>" +
        "<p>The best K is usually found with accuracy on holdout or validation data — this is an instance of the <em>bias-variance tradeoff</em>, handled in general by cross-validation. There is no universal rule; it depends on the data. Highly structured, low-noise data (a high signal-to-noise ratio, such as handwriting or speech) favors small K. Noisy data with little structure, such as the loan data, favors larger K. Typical values fall in the range 1 to 20, often an odd number to avoid ties.</p>" },
      { h: "KNN as a feature engine", body:
        "<p>By itself KNN is usually not competitive with more sophisticated classifiers. Its real value in practice is adding local knowledge in a staged process with another method.</p>" +
        "<ul class='steps'>" +
        "<li>Run KNN on the data and derive a classification, or a quasi-probability, for each record.</li>" +
        "<li>Add that result as a new feature on the record, then run a second, non-KNN classifier. The original predictors get used twice.</li>" +
        "</ul>" +
        "<p>This is not a multicollinearity problem, because the KNN feature is highly local — built from only a few nearby records — so it carries additional, non-redundant information. You can view this as a form of ensemble learning, or as automatic feature engineering.</p>" +
        "<p>The book's analogy is the King County housing data: a realtor pricing a home looks at recent sales of similar homes (comps), which is a manual KNN. You mimic the realtor by adding a KNN-predicted sale price as a feature, using the average of the K neighbors because the target is numeric (KNN regression). For loans, a KNN-based feature can summarize a borrower's creditworthiness from his credit history.</p>" },
    ],
    takeaways: [
      "KNN classifies a record by the majority class of its K most similar records (or their average, for prediction).",
      "Similarity is a distance metric — usually Euclidean, sometimes Manhattan or Mahalanobis.",
      "Predictors must be numeric: one-hot encode factors, and standardize to z-scores so big-scale variables do not dominate.",
      "K is chosen by accuracy on validation data; small K overfits, large K oversmooths — a bias-variance tradeoff.",
      "KNN is often used as a first-stage feature engine feeding a second model.",
    ],
  });

  // ---------------------------------------------------------------- TREE MODELS
  B({
    id: "ps-ch6-trees",
    chapter: "Chapter 6",
    title: "Tree Models",
    tagline: "Learn if-then-else rules by repeatedly splitting the data into purer groups.",
    sections: [
      { h: "What a tree is", body:
        "<p>Tree models, also called Classification and Regression Trees (CART) or decision trees, were developed by Leo Breiman and others in 1984. A tree is a set of if-then-else rules that are easy to read and implement. Unlike linear or logistic regression, trees can discover hidden patterns from complex interactions in the data; unlike KNN or naive Bayes, a simple tree stays interpretable.</p>" +
        "<p>Some terms the book uses: a <em>split value</em> is a predictor value that divides records into those below it and those at or above it. A <em>node</em> is the rule (split) drawn in the tree. A <em>leaf</em> is the end of a chain of rules — the leaf gives the classification. <em>Loss</em> is the number of misclassifications at a stage. <em>Impurity</em> is how mixed the classes are in a partition (also called heterogeneity); its opposite is homogeneity or purity. <em>Pruning</em> cuts a fully grown tree back to reduce overfitting.</p>" },
      { h: "A worked tree on the loan data", body:
        "<p>The book fits a tree to 3,000 loan records using <code>payment_inc_ratio</code> and <code>borrower_score</code>. You traverse from the root down until you reach a leaf. The first rule splits on <code>borrower_score &gt;= 0.525</code>. The printed tree gives each node's records (n), misclassifications (loss), the predicted class, and the (paid-off, default) proportions:</p>" +
        "<table class='extable'><thead><tr><th>node / rule</th><th class='num'>n</th><th class='num'>loss</th><th>predict</th><th class='num'>P(paid off)</th><th class='num'>P(default)</th></tr></thead><tbody>" +
        "<tr><td class='row-h'>1) root</td><td class='num'>3000</td><td class='num'>1467</td><td>paid off</td><td class='num'>0.5110</td><td class='num'>0.4890</td></tr>" +
        "<tr><td class='row-h'>2) score &gt;= 0.525</td><td class='num'>1283</td><td class='num'>474</td><td>paid off</td><td class='num'>0.6306</td><td class='num'>0.3694</td></tr>" +
        "<tr><td class='row-h'>4) pir &lt; 8.772 *</td><td class='num'>845</td><td class='num'>249</td><td>paid off</td><td class='num'>0.7053</td><td class='num'>0.2947</td></tr>" +
        "<tr><td class='row-h'>10) score &gt;= 0.625 *</td><td class='num'>149</td><td class='num'>60</td><td>paid off</td><td class='num'>0.5973</td><td class='num'>0.4027</td></tr>" +
        "<tr><td class='row-h'>11) score &lt; 0.625 *</td><td class='num'>289</td><td class='num'>124</td><td>default</td><td class='num'>0.4291</td><td class='num'>0.5709</td></tr>" +
        "<tr><td class='row-h'>3) score &lt; 0.525</td><td class='num'>1717</td><td class='num'>724</td><td>default</td><td class='num'>0.4217</td><td class='num'>0.5783</td></tr>" +
        "<tr><td class='row-h'>12) score &gt;= 0.375 *</td><td class='num'>784</td><td class='num'>384</td><td>paid off</td><td class='num'>0.5102</td><td class='num'>0.4898</td></tr>" +
        "<tr><td class='row-h'>13) score &lt; 0.375 *</td><td class='num'>298</td><td class='num'>117</td><td>default</td><td class='num'>0.3926</td><td class='num'>0.6074</td></tr>" +
        "<tr><td class='row-h'>7) pir &gt;= 9.732 *</td><td class='num'>635</td><td class='num'>207</td><td>default</td><td class='num'>0.3260</td><td class='num'>0.6740</td></tr>" +
        "</tbody></table>" +
        "<p>A * marks a terminal node (leaf). The depth shows as indentation. Each node's class is the prevalent outcome in that partition. For example node 2 had 474 misclassifications out of 1,283 records, and leaf 13, which predicts default, has over 60% of its records in default. A loan with <code>borrower_score</code> of 0.6 and <code>payment_inc_ratio</code> of 8.0 lands at the leftmost leaf and is predicted paid off.</p>" },
      { h: "The recursive partitioning algorithm", body:
        "<p>The algorithm, called <em>recursive partitioning</em>, repeatedly splits the data using the predictor value that best separates it into homogeneous groups. With a response $Y$ and predictors $X_j$ for $j = 1, \\ldots, P$, for a partition $A$ it finds the best two-way split:</p>" +
        "<ul class='steps'>" +
        "<li>For each predictor $X_j$, and for each candidate split value $s_j$: put records with $X_j \\lt s_j$ in one partition and the rest ($X_j \\ge s_j$) in the other, then measure the class homogeneity within each subpartition.</li>" +
        "<li>Pick the $s_j$ that gives the most within-partition homogeneity for that predictor.</li>" +
        "<li>Across all predictors, pick the variable $X_j$ and split $s_j$ that together give the maximum within-partition homogeneity.</li>" +
        "</ul>" +
        "<p>Then the recursion: start with $A$ as the whole data set, split it into $A_1$ and $A_2$, and repeat the same step on each piece. It stops when no further split sufficiently improves homogeneity. The end result partitions the data (in P dimensions); each partition predicts 0 or 1 by majority vote.</p>" +
        "<p>For the loan tree, the first split was <code>borrower_score &gt;= 0.525</code> and the second <code>payment_inc_ratio &lt; 9.732</code>, which divides the right-hand region in two. A tree can also output a probability:</p>" +
        "<ul class='steps'><li>$\\text{Prob}(Y = 1) = \\dfrac{\\text{number of 1s in the partition}}{\\text{size of the partition}}$, then convert to a class (e.g. predict 1 if the probability exceeds 0.5).</li></ul>" },
      { h: "Measuring homogeneity or impurity", body:
        "<p>The algorithm needs a way to measure homogeneity (<em>class purity</em>) within a partition, or equivalently its impurity. Accuracy seems natural — the proportion $p$ of misclassified records, ranging from 0 (perfect) to 0.5 (random guessing) — but it turns out to be a poor impurity measure. Two common measures are used instead (shown here for the binary case).</p>" +
        "<p>Gini impurity for a set of records $A$:</p>" +
        "<p>$I(A) = p(1 - p)$</p>" +
        "<p>Entropy (information):</p>" +
        "<p>$I(A) = -p\\,\\log_2(p) - (1 - p)\\,\\log_2(1 - p)$</p>" +
        "<p>Rescaled Gini and entropy behave similarly, with entropy giving somewhat higher impurity scores at moderate and high accuracy rates. In the splitting algorithm, impurity is measured for each resulting partition, a weighted average is taken, and the split with the lowest weighted average is chosen. (Note: Gini impurity is not the Gini coefficient, which is tied to the AUC metric.)</p>" +
        "<ul class='steps'>" +
        "<li>At a node with misclassification rate $p=0.30$, the unscaled Gini impurity is $0.30(1-0.30)=0.21$; Figure 6-5 rescales it by its maximum 0.25, giving $0.21/0.25=0.84$.</li>" +
        "<li>The entropy is $-0.30\\log_2(0.30)-0.70\\log_2(0.70)=0.881$.</li>" +
        "<li>Accuracy on the same rescaled plot is $0.30/0.50=0.60$, which is why the straight accuracy line sits below entropy at this point.</li>" +
        "</ul>" },
      { h: "Stopping the tree from growing", body:
        "<p>As a tree grows, its rules get more detailed and start reflecting noise rather than real relationships. A fully grown tree has completely pure leaves and 100% accuracy on its training data — but that accuracy is illusory: the tree has overfit, fitting the noise instead of the signal you want for new data. You need a way to stop growth at a point that generalizes. There are two common approaches (the parameters below are from R's <code>rpart</code>):</p>" +
        "<ul class='steps'>" +
        "<li>Do not split if a resulting subpartition, or a terminal leaf, would be too small. These are controlled by <code>minsplit</code> and <code>minbucket</code>, with defaults of 20 and 7.</li>" +
        "<li>Do not split if the new partition does not significantly reduce impurity. This is controlled by the complexity parameter <code>cp</code>, which penalizes complexity (more splits). If <code>cp</code> is too small the tree overfits; too large and the tree is too small to predict well. The <code>rpart</code> default is 0.01; the book used 0.005 because the default produced a single split.</li>" +
        "</ul>" +
        "<p>An alternative is <em>pruning</em>: grow a full tree, then cut terminal and smaller branches back, commonly to the point where error on holdout data is minimized. Choosing the optimum <code>cp</code> is itself a bias-variance tradeoff, usually estimated by cross-validation: partition into training and validation, grow and prune the tree recording <code>cp</code>, note the <code>cp</code> at minimum validation error, repartition and repeat, then average the best <code>cp</code> values and grow a final tree to that complexity.</p>" },
      { h: "Predicting a continuous value", body:
        "<p>Predicting a continuous value (regression) with a tree follows the same logic, with two changes: impurity is measured by squared deviations from the mean (squared errors) within each subpartition, and predictive performance is judged by the root mean squared error (RMSE) in each partition.</p>" +
        "<p>Trees are appealing because they fight the black-box objection two ways: they are a visual tool for exploring which variables matter and how they relate (capturing nonlinear relationships), and they produce rules you can communicate to nonspecialists. For raw prediction, though, combining many trees — random forests and boosting — almost always beats a single tree, at the cost of losing that single-tree interpretability.</p>" },
    ],
    takeaways: [
      "A decision tree is a set of if-then-else rules built by recursive partitioning.",
      "Each split chooses the predictor and value that best increases within-partition class homogeneity.",
      "Homogeneity is measured by Gini impurity p(1-p) or entropy, not by accuracy.",
      "A fully grown tree overfits; stop growth (minsplit/minbucket/cp) or prune, tuned by cross-validation.",
      "For a continuous target, impurity becomes squared error and performance is judged by RMSE.",
    ],
  });

  // ---------------------------------------------------------------- BAGGING & RANDOM FOREST
  B({
    id: "ps-ch6-bagging-rf",
    chapter: "Chapter 6",
    title: "Bagging and the Random Forest",
    tagline: "Average many trees built on resampled data to beat any single tree.",
    sections: [
      { h: "The wisdom of crowds", body:
        "<p>In 1907 the statistician Francis Galton watched a county-fair contest to guess the dressed weight of an ox. Across 800 guesses, both the mean and the median came within 1% of the true weight. The same principle drives <em>ensemble learning</em>: averaging (or taking majority votes of) many models is more accurate than any single model. The simple ensemble recipe is:</p>" +
        "<ul class='steps'>" +
        "<li>Build a predictive model and record its predictions for a data set.</li>" +
        "<li>Repeat for multiple models on the same data.</li>" +
        "<li>For each record, take an average (or weighted average, or majority vote) of the predictions.</li>" +
        "</ul>" +
        "<p>Ensembles work best with decision trees. The two main variants are <em>bagging</em> and <em>boosting</em>; for trees these give random forest models and boosted tree models. This lesson covers bagging.</p>" },
      { h: "Bagging", body:
        "<p>Bagging stands for <em>bootstrap aggregating</em> and was introduced by Leo Breiman in 1994. It is the basic ensemble idea with one change: instead of fitting each model to the same data, each model is fit to a bootstrap resample. With response $Y$ and predictors $X$ over $n$ records, the algorithm is:</p>" +
        "<ul class='steps'>" +
        "<li>Set the number of models $M$ and the resample size $n$. Set the counter $m = 1$.</li>" +
        "<li>Take a bootstrap resample (sampling with replacement) of $n$ records from the training data — this is the bag.</li>" +
        "<li>Train a model on the bag to create decision rules.</li>" +
        "<li>Increment $m = m + 1$. If $m \\le M$, go back and resample again.</li>" +
        "</ul>" +
        "<p>When each model predicts the probability that $Y = 1$, the bagged estimate is simply their average:</p>" +
        "<p>$\\hat{f} = \\dfrac{1}{M}\\left(\\hat{f}_1(X) + \\hat{f}_2(X) + \\cdots + \\hat{f}_M(X)\\right)$</p>" },
      { h: "Random forest", body:
        "<p>The <em>random forest</em> applies bagging to decision trees with one extra twist: at each split it samples not only the records but also the variables. In an ordinary tree, every split considers all predictors and chooses the variable and split point that best minimizes a criterion like Gini impurity. In a random forest, each split may only consider a random subset of the variables. So it adds two steps to the basic tree algorithm — bagging the records, and bootstrap-sampling the variables at each split:</p>" +
        "<ul class='steps'>" +
        "<li>Take a bootstrap subsample of the records.</li>" +
        "<li>For the first split, sample $p \\lt P$ variables at random (without replacement).</li>" +
        "<li>Among those sampled variables, run the splitting algorithm and pick the variable and split value that maximize within-partition homogeneity.</li>" +
        "<li>Move to the next split and repeat, re-sampling variables each time, until the tree is grown.</li>" +
        "<li>Go back, take another bootstrap subsample, and grow the next tree.</li>" +
        "</ul>" +
        "<p>A rule of thumb is to sample $\\sqrt{P}$ variables at each step, where $P$ is the number of predictors.</p>" },
      { h: "Out-of-bag error", body:
        "<p>Fitting the random forest to the loan data with <code>borrower_score</code> and <code>payment_inc_ratio</code> trains 500 trees by default. With only two predictors, it samples one variable per split. The model reports an <em>out-of-bag</em> (OOB) error estimate — the error rate of each tree on the records that were left out of its own bootstrap sample. Here the OOB error was about 38.53%, with this confusion matrix:</p>" +
        "<table class='extable'><thead><tr><th>actual \\ predicted</th><th class='num'>paid off</th><th class='num'>default</th><th class='num'>class error</th></tr></thead><tbody>" +
        "<tr><td class='row-h'>paid off</td><td class='num'>1089</td><td class='num'>425</td><td class='num'>0.2807</td></tr>" +
        "<tr><td class='row-h'>default</td><td class='num'>731</td><td class='num'>755</td><td class='num'>0.4919</td></tr>" +
        "</tbody></table>" +
        "<p>Plotting OOB error against the number of trees (Figure 6-6) shows the error dropping rapidly from over 0.44 and then stabilizing around 0.385 as more trees are added.</p>" +
        "<p>The random forest is more accurate than a single tree but is a black box: its intuitive decision rules are lost, and its predictions are somewhat noisy — some borrowers with very high scores still get predicted as default, a sign of overfitting to a few unusual records.</p>" },
      { h: "Variable importance", body:
        "<p>The random forest's strength shows on data with many features. It automatically ranks which predictors matter and uncovers interactions. Fitting to the loan data with all columns gave an OOB error of about 34.38% (with 3 variables sampled per split). There are two ways to measure variable importance:</p>" +
        "<ul class='steps'>" +
        "<li><strong>Accuracy decrease</strong> (type 1): randomly permute a variable's values, which destroys its predictive power, and see how much accuracy drops. Because it is computed on the out-of-bag data, this is effectively a cross-validated estimate, and it is the more reliable measure.</li>" +
        "<li><strong>Gini decrease</strong> (type 2): the mean decrease in Gini impurity across all nodes split on that variable. It measures how much that variable improves node purity, but it is based on the training set and is less reliable.</li>" +
        "</ul>" +
        "<p>The two measures can rank variables quite differently. Gini decrease is the default because it is a free byproduct of training, while accuracy decrease needs extra permute-and-predict computation — costly when fitting thousands of models. Comparing the two can suggest ways to improve the model. The chart below recreates the accuracy-decrease panel of Figure 6-8, with <code>borrower_score</code> by far the most important predictor.</p>" },
      { h: "Random-forest hyperparameters", body:
        "<p>The book highlights two random-forest hyperparameters that matter for noisy data. <code>nodesize</code> is the minimum terminal-node size; in R <code>randomForest</code> defaults to 1 for classification and 5 for regression. <code>maxnodes</code> caps the number of nodes in each tree; by default there is no cap beyond <code>nodesize</code>. Raising either one grows smaller trees, reducing the chance of spurious rules; cross-validation is used to pick values.</p>" },
    ],
    takeaways: [
      "Ensembles average many models and beat any single model — the wisdom-of-crowds principle.",
      "Bagging fits each model to a bootstrap resample of the data, then averages the predictions.",
      "A random forest bags trees and also samples a random subset of variables at each split (rule of thumb: sqrt(P)).",
      "Out-of-bag error measures accuracy on the records each tree did not train on.",
      "Variable importance is measured by accuracy decrease (more reliable) or Gini decrease (cheaper, the default).",
    ],
  });

  // ---------------------------------------------------------------- BOOSTING
  B({
    id: "ps-ch6-boosting",
    chapter: "Chapter 6",
    title: "Boosting",
    tagline: "Fit a sequence of models, each correcting the errors of the last.",
    sections: [
      { h: "What boosting is", body:
        "<p>Boosting, like bagging, is a general way to build an ensemble of models and is most often used with decision trees. It was developed around the same time as bagging, but takes a very different approach with many more tuning knobs. The book's analogy: if these were cars, bagging is a Honda Accord (reliable, little tuning) and boosting is a Porsche (powerful, but demands care).</p>" +
        "<p>The core idea: fit a series of models, each one fit to minimize the error of the models before it — giving more weight to the records that were hard to predict. Common variants are <em>Adaboost</em> (reweights data based on residuals), <em>gradient boosting</em> (casts boosting as minimizing a cost function), and <em>stochastic gradient boosting</em> (the most general and widely used, adding resampling of records and columns each round). With the right parameters, stochastic gradient boosting can even emulate a random forest.</p>" },
      { h: "The boosting algorithm", body:
        "<p>The easiest variant to follow is Adaboost. Starting with $M$ models, set the counter $m = 1$, give every observation equal weight $w_i = 1/N$, and start the ensemble at $\\hat{F}_0 = 0$. Then:</p>" +
        "<ul class='steps'>" +
        "<li>Train a model $\\hat{f}_m$ using the current observation weights so that it minimizes the weighted error $e_m$ (the sum of the weights of the misclassified observations).</li>" +
        "<li>Add the model to the ensemble: $\\hat{F}_m = \\hat{F}_{m-1} + \\alpha_m \\hat{f}_m$, where $\\alpha_m = \\log\\left(\\dfrac{1 - e_m}{e_m}\\right)$.</li>" +
        "<li>Update the weights so that the misclassified observations get larger weights; the size of the increase grows with $\\alpha_m$.</li>" +
        "<li>Increment $m = m + 1$; if $m \\le M$, repeat.</li>" +
        "</ul>" +
        "<p>The boosted estimate is the weighted sum of the models:</p>" +
        "<p>$\\hat{F} = \\alpha_1 \\hat{f}_1 + \\alpha_2 \\hat{f}_2 + \\cdots + \\alpha_M \\hat{f}_M$</p>" +
        "<p>Raising the weights of misclassified observations forces later models to train harder on the records the ensemble got wrong, while $\\alpha_m$ gives lower-error models a bigger say. Gradient boosting is similar but fits each model to a <em>pseudo-residual</em> instead of adjusting weights; stochastic gradient boosting adds randomness by sampling observations and predictors each round.</p>" },
      { h: "XGBoost", body:
        "<p>The most widely used public-domain boosting software is <em>XGBoost</em>, an implementation of stochastic gradient boosting originally by Tianqi Chen and Carlos Guestrin at the University of Washington. It is computationally efficient, has many options, and is available in most data science languages (the R package is <code>xgboost</code>).</p>" +
        "<p>XGBoost has many parameters that should be tuned. Two especially important ones:</p>" +
        "<ul class='steps'>" +
        "<li><code>subsample</code> — the fraction of observations sampled at each iteration. Using subsampling makes boosting act like a random forest, except the sampling is done without replacement.</li>" +
        "<li><code>eta</code> — a shrinkage factor applied to $\\alpha_m$ in the boosting algorithm. It reduces the change in the weights each round, which prevents overfitting (a smaller weight change makes the algorithm less likely to overfit the training set).</li>" +
        "</ul>" +
        "<p>XGBoost does not accept formula syntax: predictors must be a numeric data matrix and the response must be 0/1. An <code>objective</code> argument (e.g. binary:logistic) tells it the problem type so it can pick a metric to optimize. Applied to the loan data, its predictions look qualitatively like the random forest's — and similarly noisy, with some high-score borrowers still predicted to default.</p>" },
      { h: "Regularization and avoiding overfitting", body:
        "<p>Blindly applying <code>xgboost</code> can produce unstable, overfit models. Overfitting hurts two ways: accuracy on new data degrades, and predictions become highly variable. Most methods avoid overfitting through careful predictor selection, and even a random forest is usually reasonable untuned — but this is not true of XGBoost.</p>" +
        "<p>The book demonstrates this. Fitting the default model with 250 rounds to a training set (the rest of the data, with 10,000 records held out as a test set) prints a training error of 0.145622 and a test error of 0.3715 — a clear sign of overfitting.</p>" +
        "<table class='extable'><thead><tr><th>model</th><th class='num'>training error</th><th class='num'>test error</th></tr></thead><tbody>" +
        "<tr><td class='row-h'>default</td><td class='num'>0.145622</td><td class='num'>0.3715</td></tr>" +
        "<tr><td class='row-h'>penalized (lambda = 1000)</td><td class='num'>0.332405</td><td class='num'>0.3483</td></tr>" +
        "</tbody></table>" +
        "<p>Beyond <code>eta</code> and <code>subsample</code>, another defense is <em>regularization</em>: modifying the cost function to penalize model complexity. XGBoost has two regularization parameters, <code>lambda</code> and <code>alpha</code>, which correspond to squared Euclidean distance and Manhattan distance respectively (analogous to ridge regression and the Lasso). Increasing them penalizes complex models and shrinks the trees. With <code>lambda</code> set to 1,000, the training error rises to 0.332405 — now only slightly below the 0.3483 test error, so the gap from overfitting has nearly closed. Figure 6-10 shows the default model's training error steadily improving while its test error worsens; the penalized model does not show that divergence.</p>" },
      { h: "Hyperparameters and cross-validation", body:
        "<p>The <em>hyperparameters</em> are parameters you set before fitting; they are not optimized during training. XGBoost has a daunting array of them, and the choice dramatically changes the fit. The standard way to choose them is <em>cross-validation</em>: split the data into $K$ groups (folds); for each fold, train on the other folds and evaluate on the held-out fold; the best hyperparameters give the lowest average out-of-sample error across folds.</p>" +
        "<p>The book tunes two parameters: the shrinkage <code>eta</code> and <code>max_depth</code> (the maximum tree depth, default 6 — deeper trees are more complex and more prone to overfitting). Using a 3-by-3 grid of <code>eta</code> in {0.1, 0.5, 0.9} and <code>max_depth</code> in {3, 6, 12} with five folds (45 model fits in all) gives these average error rates (as percentages):</p>" +
        "<table class='extable'><thead><tr><th class='num'>eta</th><th class='num'>max_depth</th><th class='num'>avg error</th></tr></thead><tbody>" +
        "<tr><td class='num'>0.1</td><td class='num'>3</td><td class='num'>35.41</td></tr>" +
        "<tr><td class='num'>0.5</td><td class='num'>3</td><td class='num'>35.84</td></tr>" +
        "<tr><td class='num'>0.9</td><td class='num'>3</td><td class='num'>36.48</td></tr>" +
        "<tr><td class='num'>0.1</td><td class='num'>6</td><td class='num'>35.37</td></tr>" +
        "<tr><td class='num'>0.5</td><td class='num'>6</td><td class='num'>37.33</td></tr>" +
        "<tr><td class='num'>0.9</td><td class='num'>6</td><td class='num'>39.41</td></tr>" +
        "<tr><td class='num'>0.1</td><td class='num'>12</td><td class='num'>36.70</td></tr>" +
        "<tr><td class='num'>0.5</td><td class='num'>12</td><td class='num'>38.85</td></tr>" +
        "<tr><td class='num'>0.9</td><td class='num'>12</td><td class='num'>40.19</td></tr>" +
        "</tbody></table>" +
        "<p>Cross-validation suggests shallower trees with a smaller <code>eta</code> give more accurate (and more stable) results: the best choices are <code>eta</code> = 0.1 with <code>max_depth</code> = 3 (or possibly 6). Other key XGBoost hyperparameters include <code>nrounds</code> (number of boosting rounds — increase it when <code>eta</code> is small), <code>subsample</code> and <code>colsample_bytree</code> (fractions of records and predictors to sample), and <code>lambda</code>/<code>alpha</code> (regularization).</p>" },
    ],
    takeaways: [
      "Boosting fits a sequence of models, each weighting the records the previous models got wrong.",
      "Adaboost reweights misclassified records; gradient boosting fits pseudo-residuals; stochastic gradient boosting adds resampling.",
      "XGBoost is the popular, efficient implementation of stochastic gradient boosting.",
      "Boosting overfits readily — control it with eta, subsample, and regularization (lambda, alpha).",
      "Hyperparameters are tuned by cross-validation; shallower trees with small eta were best on the loan data.",
    ],
  });

  // -------------------------------------------------------------- CHARTS
  // Figure 6-2: KNN neighbors around the new loan; the book prints 14 defaults versus 6 paid off.
  window.CODEVIZ["ps-ch6-knn"] = {
    charts: [{
      type: "bars",
      title: "KNN vote for the new loan",
      interpret: "With K = 20, the nearest-neighbor circle contains 14 defaulted loans and 6 paid-off loans, so the estimated default probability is 14/20 = 0.70.",
      labels: ["default", "paid off"],
      values: [14, 6],
      colors: ["#ffb454", "#4ea1ff"]
    }],
    code: "# --- R (Practical Statistics, 1st ed.) ---\n# library(FNN)\n# knn_pred <- knn(train=loan200, test=newloan, cl=outcome200, k=20)\n# knn_pred == 'default'                         # [1] TRUE\n# # Figure 6-2: among the 20 neighbors, 14 default and 6 paid off\n# loan_df <- model.matrix(~ -1 + payment_inc_ratio + dti + revol_bal + revol_util, data=loan_data)\n# knn_pred <- knn(train=loan_df, test=newloan, cl=outcome, k=5)\n# loan_df[attr(knn_pred, \"nn.index\"), ]        # raw-scale neighbors: rows 36054,33233,28989,29572,20962\n# loan_std <- scale(loan_df)\n# knn_pred <- knn(train=loan_std, test=newloan_std, cl=outcome, k=5)\n# loan_df[attr(knn_pred, \"nn.index\"), ]        # standardized neighbors: 2081,36054,23655,41327,39555\n# borrow_df <- model.matrix(~ -1 + dti + revol_bal + revol_util + open_acc + delinq_2yrs_zero + pub_rec_zero, data=loan_data)\n# borrow_knn <- knn(borrow_df, test=borrow_df, cl=loan_data[, 'outcome'], prob=TRUE, k=10)\n# summary(ifelse(borrow_knn=='default', attr(borrow_knn, \"prob\"), 1-attr(borrow_knn, \"prob\")))\n# # Min 0.0000; 1st Qu. 0.4000; Median 0.5000; Mean 0.5012; 3rd Qu. 0.6000; Max 1.0000\n\n# --- Python equivalent ---\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.preprocessing import StandardScaler\nknn = KNeighborsClassifier(n_neighbors=20)\nknn.fit(loan200[['dti', 'payment_inc_ratio']], outcome200)\nprint(knn.predict([[22.5, 9.0]])[0])             # default\nprint(knn.predict_proba([[22.5, 9.0]]).max())    # about 0.70 if class default has 14/20 votes\nscaler = StandardScaler().fit(loan_df)\nKNeighborsClassifier(n_neighbors=5).fit(scaler.transform(loan_df), outcome).kneighbors(scaler.transform(newloan))"
  };

  // Figure 6-5: Gini impurity (rescaled) and entropy versus p, with the accuracy line.
  window.CODEVIZ["ps-ch6-trees"] = {
    charts: [{
      type: "line",
      xlabel: "p (misclassification rate)",
      ylabel: "impurity",
      title: "Gini impurity and entropy measures",
      interpret: "Entropy and rescaled Gini both rise with mixing and peak at p = 0.5; entropy is a bit higher at moderate accuracy. The straight accuracy line is the poor measure trees avoid. Recreated from the book's I(A) formulas (Figure 6-5).",
      series: [
        { name: "Accuracy", color: "#ffb454", points: [[0, 0], [0.1, 0.2], [0.2, 0.4], [0.3, 0.6], [0.4, 0.8], [0.5, 1.0]] },
        { name: "Entropy", color: "#7ee787", points: [[0, 0], [0.1, 0.469], [0.2, 0.722], [0.3, 0.881], [0.4, 0.971], [0.5, 1.0]] },
        { name: "Gini", color: "#4ea1ff", points: [[0, 0], [0.1, 0.36], [0.2, 0.64], [0.3, 0.84], [0.4, 0.96], [0.5, 1.0]] }
      ]
    }],
    code: "# --- R (Practical Statistics, 1st ed.) ---\n# library(rpart)\n# loan_tree <- rpart(outcome ~ borrower_score + payment_inc_ratio,\n#                    data=loan_data, control=rpart.control(cp=.005))\n# plot(loan_tree, uniform=TRUE, margin=.05); text(loan_tree)\n# loan_tree\n# # n=3000; root loss=1467; first split borrower_score>=0.525\n# # leaf payment_inc_ratio<8.772305: n=845, loss=249, P(default)=0.2946746\n# # leaf payment_inc_ratio>=9.73236: n=635, loss=207, P(default)=0.6740157\n# printcp(loan_tree)   # cptable gives cp and xerror for pruning/cross-validation\n\n# --- Python equivalent ---\nfrom sklearn.tree import DecisionTreeClassifier, plot_tree\nX = loan_data[['borrower_score', 'payment_inc_ratio']]\ny = loan_data['outcome']\ntree = DecisionTreeClassifier(min_impurity_decrease=0.005, random_state=1)\ntree.fit(X, y)\nplot_tree(tree, feature_names=X.columns, class_names=tree.classes_, filled=True)\n# impurity check used in Figure 6-5: p=0.30 -> gini=0.30*(1-0.30)=0.21; rescaled=0.84"
  };

  // Figures 6-6 and 6-8: random-forest OOB error and variable importance.
  // Figure 6-8 values are approximate readings from the book's dot plot, ranked highest to lowest.
  window.CODEVIZ["ps-ch6-bagging-rf"] = {
    charts: [{
      type: "bars",
      title: "Variable importance — accuracy decrease",
      interpret: "borrower_score dominates, with grade, term, payment_inc_ratio and annual_inc next; home ownership matters least. Reconstructed from the accuracy-decrease panel of Figure 6-8 (approximate values read off the dot plot).",
      labels: ["borrower_score", "grade", "term", "payment_inc_ratio", "annual_inc", "loan_amnt", "revol_bal", "revol_util", "dti", "purpose", "open_acc", "emp_len", "delinq_2yrs_zero", "pub_rec_zero", "home"],
      values: [126, 92, 66, 60, 54, 49, 36, 35, 30, 28, 18, 11, 9, 8, 7]
    }, {
      type: "line",
      xlabel: "number of trees",
      ylabel: "OOB error rate",
      title: "Random forest OOB error stabilizes",
      interpret: "Figure 6-6 drops from over 0.44 and settles near the printed OOB error of 0.3853 as 500 trees accumulate.",
      series: [{ name: "OOB error", color: "#4ea1ff", points: [[1, 0.445], [25, 0.405], [50, 0.392], [100, 0.386], [250, 0.385], [500, 0.3853]] }]
    }],
    code: "# --- R (Practical Statistics, 1st ed.) ---\n# library(randomForest)\n# rf <- randomForest(outcome ~ borrower_score + payment_inc_ratio, data=loan3000)\n# rf\n# # Number of trees: 500; variables tried at each split: 1; OOB error: 38.53%\n# # Confusion: paid off 1089/425 class.error 0.2807133; default 731/755 class.error 0.4919246\n# error_df <- data.frame(error_rate=rf$err.rate[, 'OOB'], num_trees=1:rf$ntree)\n# ggplot(error_df, aes(x=num_trees, y=error_rate)) + geom_line()  # Figure 6-6: stabilizes around .385\n# rf_all <- randomForest(outcome ~ ., data=loan_data, importance=TRUE)\n# rf_all   # variables tried: 3; OOB error: 34.38%; default class.error 0.3392548\n# varImpPlot(rf_all, type=1); varImpPlot(rf_all, type=2)\n\n# --- Python equivalent ---\nfrom sklearn.ensemble import RandomForestClassifier\nrf = RandomForestClassifier(n_estimators=500, max_features=1, oob_score=True, random_state=1)\nrf.fit(loan3000[['borrower_score', 'payment_inc_ratio']], loan3000['outcome'])\nprint(1 - rf.oob_score_)                         # about 0.3853\nrf_all = RandomForestClassifier(n_estimators=500, max_features=3, oob_score=True, random_state=1)\nrf_all.fit(X_all, y_all)\nprint(1 - rf_all.oob_score_)                     # about 0.3438"
  };

  // Figure 6-10 plus the printed training/test errors for default versus penalized XGBoost.
  window.CODEVIZ["ps-ch6-boosting"] = {
    charts: [{
      type: "bars",
      title: "XGBoost overfitting and regularization",
      interpret: "The default 250-round model drives training error to 0.145622 while test error is 0.3715; lambda=1000 raises train error to 0.332405 and lowers test error to 0.3483.",
      labels: ["default train", "default test", "lambda=1000 train", "lambda=1000 test"],
      values: [0.145622, 0.3715, 0.332405, 0.3483],
      colors: ["#7ee787", "#ffb454", "#4ea1ff", "#c89bff"]
    }],
    code: "# --- R (Practical Statistics, 1st ed.) ---\n# library(xgboost)\n# predictors <- data.matrix(loan3000[, c('borrower_score', 'payment_inc_ratio')])\n# label <- as.numeric(loan3000[, 'outcome']) - 1\n# xgb <- xgboost(data=predictors, label=label, objective='binary:logistic',\n#                params=list(subsample=.63, eta=0.1), nrounds=100)\n# pred <- predict(xgb, newdata=predictors)\n# xgb_default <- xgboost(data=predictors[-test_idx,], label=label[-test_idx], objective='binary:logistic', nrounds=250)\n# xgb_default$evaluation_log[250,]                # train_error 0.145622\n# mean(abs(label[test_idx] - predict(xgb_default, predictors[test_idx,])) > 0.5)  # [1] 0.3715\n# xgb_penalty <- xgboost(data=predictors[-test_idx,], label=label[-test_idx],\n#                        params=list(eta=.1, subsample=.63, lambda=1000), objective='binary:logistic', nrounds=250)\n# xgb_penalty$evaluation_log[250,]                # train_error 0.332405\n# mean(abs(label[test_idx] - predict(xgb_penalty, predictors[test_idx,])) > 0.5)  # [1] 0.3483\n# cbind(params, 100 * rowMeans(error))             # best: eta=.1,max_depth=6 -> 35.37%; eta=.1,max_depth=3 -> 35.41%\n\n# --- Python equivalent ---\nfrom xgboost import XGBClassifier\nxgb = XGBClassifier(objective='binary:logistic', n_estimators=100, subsample=.63, learning_rate=.1)\nxgb.fit(loan3000[['borrower_score', 'payment_inc_ratio']], label)\npenalty = XGBClassifier(objective='binary:logistic', n_estimators=250, learning_rate=.1, subsample=.63, reg_lambda=1000)\npenalty.fit(X_train, y_train)\nprint(1 - penalty.score(X_test, y_test))          # about 0.3483"
  };
})();
