/* Practical Statistics for Data Scientists (Bruce & Bruce, O'Reilly 2017)
   Chapter 7 — Unsupervised Learning. Self-registering book-template lessons. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "Practical Statistics";
  const BOOK = "Practical Statistics for Data Scientists";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: BOOK }, o));

  // ---------------------------------------------------------------------------
  // PCA — A Simple Example
  // ---------------------------------------------------------------------------
  B({
    id: "ps-ch7-pca-simple-example",
    chapter: "Chapter 7",
    title: "PCA Simple Example",
    tagline: "Two variables give two principal components: weighted lines through the data.",
    sections: [
      {
        h: "What PCA does",
        body: "<p>Variables often <em>covary</em>: when one moves, another tends to move with it, so part of the variation in one is really a duplicate of variation in another. Principal components analysis (PCA) finds the way numeric variables covary and repackages them into a smaller set of new variables, the <strong>principal components</strong>. Each component is a weighted linear combination of the original variables — that is, you multiply each original variable by a weight and add the products. The smaller set of components keeps most of the variability of the full set, so it reduces the dimension of the data.</p><p>Two terms the book uses: a <strong>loading</strong> is one of the weights that turns the predictors into a component (a synonym for weight); a <strong>screeplot</strong> is a plot of the variances of the components, showing their relative importance.</p>"
      },
      {
        h: "The two-variable case",
        body: "<p>For two variables $X_1$ and $X_2$ there are two principal components $Z_i$ (with $i=1$ or $2$):</p><p>$$Z_i = w_{i,1} X_1 + w_{i,2} X_2$$</p><p>Here $X_1$ and $X_2$ are the two original variables, $w_{i,1}$ and $w_{i,2}$ are the weights (loadings) for component $i$, and $Z_i$ is the new variable (the component score). The first component $Z_1$ is the linear combination that best explains the total variation; the second component $Z_2$ explains what is left over (it is also the worst-fitting line).</p>"
      },
      {
        h: "Worked example: Chevron and ExxonMobil",
        body: "<p>The book runs PCA in R (the <code>princomp</code> function) on the daily stock-price returns of Chevron (CVX) and ExxonMobil (XOM). The resulting loadings are:</p><table class=\"extable\"><thead><tr><th></th><th>Comp.1</th><th>Comp.2</th></tr></thead><tbody><tr><td class=\"row-h\">CVX</td><td class=\"num\">-0.747</td><td class=\"num\">0.665</td></tr><tr><td class=\"row-h\">XOM</td><td class=\"num\">-0.665</td><td class=\"num\">-0.747</td></tr></tbody></table><ul class=\"steps\"><li>The first component weights CVX and XOM at $-0.747$ and $-0.665$ — roughly equal weights with the same sign, so $Z_1$ is essentially an <em>average</em> of the two, reflecting that the two energy stocks are correlated and move together.</li><li>The second component weights them at $0.665$ and $-0.747$ — opposite signs, so $Z_2$ measures when the two prices <em>diverge</em>.</li><li>Both first-component weights are negative, but flipping the sign of all weights does not change the component: $0.747, 0.665$ describes the same line as $-0.747, -0.665$, just as the line through the origin and $(1,1)$ is the same as the line through the origin and $(-1,-1)$.</li></ul><p>Plotting the data with the two components drawn on top (the book's Figure 7-1) shows the first component along the long axis of the cloud and the second along the short axis — most of the variability sits along the first component, which makes sense because energy stock prices tend to move as a group.</p>"
      }
    ],
    takeaways: [
      "A principal component is a weighted linear combination of the predictor variables.",
      "First-component loadings -0.747 (CVX) and -0.665 (XOM) make Z1 an average of the two stocks.",
      "Second-component loadings 0.665 and -0.747 capture when the two prices diverge.",
      "Flipping the sign of all loadings leaves the component unchanged."
    ]
  });
  window.CODEVIZ["ps-ch7-pca-simple-example"] = {
    charts: [{
      type: "bars",
      title: "PCA loadings for CVX and XOM (reconstruction of book's princomp output)",
      interpret: "Comp.1 weights both stocks with the same sign (an average); Comp.2 gives them opposite signs (a contrast).",
      labels: ["CVX·C1", "XOM·C1", "CVX·C2", "XOM·C2"],
      values: [-0.747, -0.665, 0.665, -0.747],
      colors: ["#4ea1ff", "#4ea1ff", "#ffb454", "#ffb454"]
    }]
  };

  // ---------------------------------------------------------------------------
  // Computing the Principal Components
  // ---------------------------------------------------------------------------
  B({
    id: "ps-ch7-computing-components",
    chapter: "Chapter 7",
    title: "Computing the Components",
    tagline: "Going from two variables to many is a direct, non-iterative calculation.",
    sections: [
      {
        h: "Scaling up to many variables",
        body: "<p>Moving from two variables to more is straightforward: for the first component you simply include all the extra predictors in the linear combination, choosing weights that collect as much of the joint variation (the <em>covariance</em>) as possible into that one component. Calculation is a classic, fast statistical method that uses either the correlation matrix or the covariance matrix of the data — it executes rapidly and does <strong>not</strong> rely on iteration. It works only with numeric variables, not categorical ones.</p>"
      },
      {
        h: "The full process",
        body: "<ul class=\"steps\"><li>For the first component, PCA finds the linear combination of predictors that maximizes the percent of total variance explained.</li><li>That linear combination becomes the first new predictor, $Z_1$.</li><li>PCA repeats with the same variables but different weights to make a second predictor, $Z_2$, chosen so that $Z_1$ and $Z_2$ are uncorrelated.</li><li>The process continues until there are as many components $Z_i$ as original variables $X_i$.</li><li>You then choose to keep as many components as are needed to account for most of the variance.</li><li>Finally, apply the weights to the original values to convert the data into principal-component scores; these scores become the reduced set of predictors.</li></ul>"
      }
    ],
    takeaways: [
      "PCA relies on the correlation or covariance matrix and runs without iteration.",
      "It applies to numeric variables only.",
      "Components are built one at a time, each uncorrelated with the previous ones.",
      "Keep enough components to capture most of the variance, then use their scores as new predictors."
    ]
  });

  // ---------------------------------------------------------------------------
  // Interpreting Principal Components
  // ---------------------------------------------------------------------------
  B({
    id: "ps-ch7-interpreting-components",
    chapter: "Chapter 7",
    title: "Interpreting Components",
    tagline: "Screeplots rank the components; loading plots reveal what each one means.",
    sections: [
      {
        h: "The screeplot",
        body: "<p>The shape of the components often tells you about the structure of the data. One standard display is the <strong>screeplot</strong> (named for its resemblance to a scree slope on a hillside), which plots the variance of each component to show their relative importance. The book runs PCA on returns for a handful of top S&P 500 companies (AAPL, MSFT, CSCO, INTC, CVX, XOM, SLB, COP, JPM, WFC, USB, AXP, WMT, TGT, HD, COST) from 2005 on. In the resulting screeplot (Figure 7-2) the variance of the first component is quite large — as is typical — but the next few components are still significant.</p>"
      },
      {
        h: "Reading the loadings",
        body: "<p>Plotting the loadings of the top components (Figure 7-3) is especially revealing. For these stock returns the book reads off:</p><ul class=\"steps\"><li><strong>Component 1:</strong> all loadings share the same sign — typical when every column has a common factor, here the overall stock-market trend.</li><li><strong>Component 2:</strong> captures price changes of the energy stocks versus the others.</li><li><strong>Component 3:</strong> primarily a contrast between the movements of Apple and CostCo.</li><li><strong>Component 4:</strong> contrasts Schlumberger (SLB) against the other energy stocks.</li><li><strong>Component 5:</strong> mostly dominated by the financial companies.</li></ul>"
      },
      {
        h: "How many components to keep",
        body: "<p>If the goal is to reduce dimension you must decide how many components to keep. The most common approach is an ad hoc rule that retains the components explaining \"most\" of the variance — you can judge this visually from the screeplot (for Figure 7-2, the top five components look natural to keep), or keep enough components for cumulative variance to pass a threshold such as 80%, or inspect the loadings for an intuitive interpretation. Cross-validation gives a more formal method.</p>"
      }
    ],
    takeaways: [
      "A screeplot plots component variances; the first is usually dominant.",
      "Plotting loadings reveals what each component measures (market trend, energy-vs-rest, etc.).",
      "Same-sign loadings on component 1 signal a common factor across all variables.",
      "Choose the number of components by an ad hoc variance rule, a threshold like 80%, or cross-validation."
    ]
  });
  window.CODEVIZ["ps-ch7-interpreting-components"] = {
    charts: [{
      type: "bars",
      title: "Screeplot — component variances for top S&P 500 stocks (reconstruction of Figure 7-2)",
      interpret: "Variance falls off sharply after the first component, but the next several are still meaningful — the book keeps the top five.",
      labels: ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10"],
      values: [3.25, 1.04, 0.76, 0.45, 0.39, 0.31, 0.21, 0.18, 0.16, 0.15]
    }]
  };

  // ---------------------------------------------------------------------------
  // K-Means — A Simple Example
  // ---------------------------------------------------------------------------
  B({
    id: "ps-ch7-kmeans-simple-example",
    chapter: "Chapter 7",
    title: "K-Means Simple Example",
    tagline: "Split data into K groups by minimizing within-cluster sum of squares.",
    sections: [
      {
        h: "What K-means does",
        body: "<p>Clustering divides data into groups whose records are similar to one another, finding meaningful segments. <strong>K-means</strong> is the oldest clustering method and is still widely used because it is simple and scales to large data. It splits the data into $K$ clusters by minimizing the sum of squared distances from each record to the <em>mean</em> of its assigned cluster — the <strong>within-cluster sum of squares</strong>. It does not force clusters to be equal in size; it finds the clusters that are best separated. Key terms: a <strong>cluster</strong> is a group of similar records, the <strong>cluster mean</strong> is the vector of variable means for the records in a cluster, and $K$ is the number of clusters. It is typical to normalize (standardize) continuous variables first, or large-scale variables will dominate.</p>"
      },
      {
        h: "The math for two variables",
        body: "<p>Take $n$ records with two variables $x$ and $y$, and split them into $K=4$ clusters. Each record $(x_i, y_i)$ is assigned to a cluster $k$. If cluster $k$ holds $n_k$ records, its center $(\\bar{x}_k, \\bar{y}_k)$ is the mean of the points in it:</p><p>$$\\bar{x}_k = \\frac{1}{n_k}\\sum_{i \\in \\text{Cluster } k} x_i \\qquad \\bar{y}_k = \\frac{1}{n_k}\\sum_{i \\in \\text{Cluster } k} y_i$$</p><p>Here $n_k$ is the count of records in cluster $k$, the sum runs over those records, and $\\bar{x}_k$, $\\bar{y}_k$ are the cluster's mean coordinates. The sum of squares within a cluster is</p><p>$$SS_k = \\sum_{i \\in \\text{Cluster } k} (x_i - \\bar{x}_k)^2 + (y_i - \\bar{y}_k)^2$$</p><p>which adds up the squared distance of every point from its cluster center. K-means finds the assignment that minimizes the total across all clusters, $\\sum_{k=1}^{4} SS_k$.</p>"
      },
      {
        h: "Worked example: XOM and CVX returns",
        body: "<p>The book applies K-means with $K=4$ to ExxonMobil (XOM) and Chevron (CVX) stock returns from 2011 on. (Stock returns are already effectively standardized, so no normalization is needed here.) The four cluster centers come back as:</p><table class=\"extable\"><thead><tr><th>Cluster</th><th>XOM</th><th>CVX</th></tr></thead><tbody><tr><td class=\"row-h\">1</td><td class=\"num\">-0.328</td><td class=\"num\">-0.567</td></tr><tr><td class=\"row-h\">2</td><td class=\"num\">0.241</td><td class=\"num\">0.334</td></tr><tr><td class=\"row-h\">3</td><td class=\"num\">-1.144</td><td class=\"num\">-1.750</td></tr><tr><td class=\"row-h\">4</td><td class=\"num\">0.957</td><td class=\"num\">1.371</td></tr></tbody></table><p>Clusters 1 and 3 have negative centers — \"down\" markets — while clusters 2 and 4 are positive, \"up\" markets. With only two variables the clusters and their centers can be plotted directly (Figure 7-4).</p>"
      }
    ],
    takeaways: [
      "K-means minimizes the total within-cluster sum of squared distances to cluster means.",
      "It does not force equal-size clusters; it maximizes separation.",
      "Normalize continuous variables first unless they are already on a common scale.",
      "Cluster centers (-0.33,-0.57), (0.24,0.33), (-1.14,-1.75), (0.96,1.37) split returns into down vs up markets."
    ]
  });
  window.CODEVIZ["ps-ch7-kmeans-simple-example"] = {
    charts: [{
      type: "scatter",
      title: "K-means cluster centers for XOM and CVX returns (from book's km$centers, Figure 7-4)",
      interpret: "Clusters 1 and 3 sit in negative (down-market) territory; clusters 2 and 4 sit in positive (up-market) territory.",
      xlabel: "XOM",
      ylabel: "CVX",
      groups: [
        { name: "Cluster 1 (down)", color: "#ff6b6b", points: [[-0.328, -0.567]] },
        { name: "Cluster 2 (up)", color: "#7ee787", points: [[0.241, 0.334]] },
        { name: "Cluster 3 (down)", color: "#4ea1ff", points: [[-1.144, -1.750]] },
        { name: "Cluster 4 (up)", color: "#c89bff", points: [[0.957, 1.371]] }
      ]
    }]
  };

  // ---------------------------------------------------------------------------
  // The K-Means Algorithm
  // ---------------------------------------------------------------------------
  B({
    id: "ps-ch7-kmeans-algorithm",
    chapter: "Chapter 7",
    title: "K-Means Algorithm",
    tagline: "Iterate assign-then-recenter until cluster membership stops changing.",
    sections: [
      {
        h: "The iterative heuristic",
        body: "<p>For $p$ variables $X_1, \\dots, X_p$ the exact K-means solution is computationally very hard, so heuristic algorithms find a locally optimal one efficiently. Starting from a user-chosen $K$ and an initial set of cluster means, the algorithm repeats two steps:</p><ul class=\"steps\"><li>Assign each record to the nearest cluster mean, measured by squared distance.</li><li>Recompute each cluster mean from the records now assigned to it.</li></ul><p>It <strong>converges</strong> when the assignment of records to clusters no longer changes.</p>"
      },
      {
        h: "Initialization and restarts",
        body: "<p>The first iteration needs starting cluster means; usually you get them by randomly assigning each record to one of the $K$ clusters and taking those clusters' means. Because the algorithm is not guaranteed to find the best possible solution, it is recommended to run it several times from different random starts and keep the run with the lowest within-cluster sum of squares. In R the <code>nstart</code> argument to <code>kmeans</code> sets how many random starts to try (for example, $K=5$ with <code>nstart=10</code> tries ten starting configurations and returns the best). The <code>iter.max</code> argument caps the iterations allowed per start.</p>"
      }
    ],
    takeaways: [
      "Each pass assigns records to the nearest mean, then recomputes the means.",
      "It converges when assignments stop changing.",
      "The solution is only locally optimal, so use several random restarts (nstart).",
      "Keep the restart with the lowest within-cluster sum of squares."
    ]
  });

  // ---------------------------------------------------------------------------
  // Interpreting the Clusters
  // ---------------------------------------------------------------------------
  B({
    id: "ps-ch7-interpreting-clusters",
    chapter: "Chapter 7",
    title: "Interpreting Clusters",
    tagline: "Cluster sizes and cluster means are the two most useful outputs.",
    sections: [
      {
        h: "Cluster sizes",
        body: "<p>The two most important outputs from K-means are the <strong>sizes</strong> of the clusters and the <strong>cluster means</strong>. For the five-cluster S&P 500 example, the sizes are:</p><table class=\"extable\"><thead><tr><th>Cluster</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr></thead><tbody><tr><td class=\"row-h\">Size</td><td class=\"num\">186</td><td class=\"num\">106</td><td class=\"num\">285</td><td class=\"num\">288</td><td class=\"num\">266</td></tr></tbody></table><p>These sizes are relatively balanced. Imbalanced clusters can come from distant outliers or from groups of records very distinct from the rest — either may warrant a closer look.</p>"
      },
      {
        h: "Cluster means",
        body: "<p>Plotting the variable means within each cluster (Figure 7-5) reveals what each cluster is. In the book's example: clusters 1 and 2 correspond to down-market and up-market days; clusters 3 and 5 are up-market days for consumer stocks and down-market days for energy stocks; cluster 4 captures days when energy stocks were up and consumer stocks were down.</p><p>This loading-style plot is similar in spirit to looking at PCA loadings, but with a key difference: in cluster analysis the <em>sign</em> of the cluster mean is meaningful. PCA identifies principal directions of variation, whereas cluster analysis finds groups of records located near one another.</p>"
      }
    ],
    takeaways: [
      "Cluster sizes (186, 106, 285, 288, 266) here are fairly balanced.",
      "Imbalanced clusters may signal outliers or very distinct subgroups.",
      "Plotting cluster means shows what each cluster represents.",
      "Unlike PCA, the sign of a cluster mean carries meaning."
    ]
  });
  window.CODEVIZ["ps-ch7-interpreting-clusters"] = {
    charts: [{
      type: "bars",
      title: "K-means cluster sizes for the five-cluster S&P 500 example (book's km$size)",
      interpret: "The five clusters are relatively balanced in size; no single cluster is a tiny outlier group.",
      labels: ["Cluster 1", "Cluster 2", "Cluster 3", "Cluster 4", "Cluster 5"],
      values: [186, 106, 285, 288, 266]
    }]
  };

  // ---------------------------------------------------------------------------
  // Selecting the Number of Clusters
  // ---------------------------------------------------------------------------
  B({
    id: "ps-ch7-selecting-k",
    chapter: "Chapter 7",
    title: "Selecting Number of Clusters",
    tagline: "The elbow method looks for where added clusters stop helping.",
    sections: [
      {
        h: "Practical versus statistical choice",
        body: "<p>K-means makes you specify $K$. Often the application dictates it — a sales team clustering customers into \"personas\" might find two segments too coarse and eight too many to manage, so managerial considerations set the number. When no practical number is imposed, a statistical approach can help, but there is no single standard method for the \"best\" number of clusters.</p>"
      },
      {
        h: "The elbow method",
        body: "<p>A common approach is the <strong>elbow method</strong>: find where the set of clusters explains \"most\" of the variance, beyond which adding clusters contributes relatively little extra explained variance. The elbow is the point where the cumulative variance explained flattens out after rising steeply — hence the name. The book plots cumulative percent of variance explained for the stock data as $K$ ranges from 2 to 15 (Figure 7-6). In this example there is no obvious elbow, because the incremental gain drops only gradually — typical of data without well-defined clusters. That is a drawback of the method here, but the plot still reveals the nature of the data.</p>"
      },
      {
        h: "Beyond the elbow",
        body: "<p>Perhaps the most important test of how many clusters to keep is whether the clusters would be reproduced on new data — are they interpretable and tied to a general characteristic, or just an artifact of this sample? Cross-validation helps assess this. More formal methods exist too, such as the \"gap\" statistic of Tibshirani, Walther, and Hastie, but for most applications a theoretical approach is probably not necessary. In general no single rule reliably guides how many clusters to produce.</p>"
      }
    ],
    takeaways: [
      "Practical or managerial needs often set K directly.",
      "The elbow method seeks where added clusters stop adding much explained variance.",
      "Noisy data (like stock returns) may show no clear elbow.",
      "Reproducibility on new data — checked via cross-validation — is the real test."
    ]
  });
  window.CODEVIZ["ps-ch7-selecting-k"] = {
    charts: [{
      type: "line",
      title: "Elbow method — cumulative variance explained vs number of clusters (reconstruction of Figure 7-6)",
      interpret: "The curve rises steeply then flattens only gradually, so there is no sharp elbow — typical of data lacking well-defined clusters.",
      xlabel: "Number of clusters",
      ylabel: "% variance explained",
      series: [{
        name: "% variance explained",
        color: "#4ea1ff",
        points: [[2, 0.255], [3, 0.34], [4, 0.39], [5, 0.422], [6, 0.45], [7, 0.47], [8, 0.488], [9, 0.504], [10, 0.516], [11, 0.527], [12, 0.537], [13, 0.545], [14, 0.553]]
      }]
    }]
  };

  // ---------------------------------------------------------------------------
  // Hierarchical Clustering — A Simple Example
  // ---------------------------------------------------------------------------
  B({
    id: "ps-ch7-hier-simple-example",
    chapter: "Chapter 7",
    title: "Hierarchical Simple Example",
    tagline: "Build clusters from pairwise distances, no K specified in advance.",
    sections: [
      {
        h: "A flexible alternative to K-means",
        body: "<p><strong>Hierarchical clustering</strong> is an alternative to K-means that can give very different results. It is more flexible, more easily handles non-numerical variables, is more sensitive to outlying or aberrant groups, and lends itself to an intuitive graphical display. The trade-off is cost: it does not scale well, so even tens of thousands of records can demand intensive computation, and most applications use relatively small data sets. Two key terms: a <strong>distance</strong> measures how close one record is to another; a <strong>dissimilarity</strong> measures how close one cluster is to another.</p>"
      },
      {
        h: "The two building blocks",
        body: "<p>Hierarchical clustering works on $n$ records and $p$ variables using two pieces:</p><ul class=\"steps\"><li>A <strong>distance metric</strong> $d_{i,j}$ — how far apart two records $i$ and $j$ are.</li><li>A <strong>dissimilarity metric</strong> $D_{A,B}$ — how different two clusters $A$ and $B$ are, built from the record distances $d_{i,j}$ between their members.</li></ul><p>For numeric data the most important choice is the dissimilarity metric. The method starts with each record as its own cluster and repeatedly merges the least-dissimilar clusters. In R, <code>hclust</code> operates on the pairwise distances (from the <code>dist</code> function) rather than the data itself — a big difference from <code>kmeans</code>.</p>"
      },
      {
        h: "Worked example: clustering companies",
        body: "<p>The book clusters a set of companies (GOOGL, AMZN, AAPL, MSFT, CSCO, INTC, CVX, XOM, SLB, COP, JPM, WFC, USB, AXP, WMT, TGT, HD, COST) from their 2011-on returns. Because clustering algorithms cluster the <em>rows</em> of a data frame, and here we want to cluster companies, the data is <em>transposed</em> so the stocks lie along the rows and the dates along the columns before computing distances and calling <code>hclust</code>.</p>"
      }
    ],
    takeaways: [
      "Hierarchical clustering is flexible and intuitive but does not scale to large data.",
      "It needs a record distance d(i,j) and a cluster dissimilarity D(A,B).",
      "hclust works on pairwise distances, not the raw data, unlike kmeans.",
      "Transpose the data when you want to cluster columns (companies) instead of rows."
    ]
  });

  // ---------------------------------------------------------------------------
  // The Dendrogram
  // ---------------------------------------------------------------------------
  B({
    id: "ps-ch7-dendrogram",
    chapter: "Chapter 7",
    title: "The Dendrogram",
    tagline: "A tree that shows records and the hierarchy of clusters they join.",
    sections: [
      {
        h: "Reading the tree",
        body: "<p>Hierarchical clustering produces a natural tree display, the <strong>dendrogram</strong> (from the Greek <em>dendro</em>, tree, and <em>gramma</em>, drawing). The leaves are the records; the length of each branch indicates how dissimilar the merged clusters are. A dendrogram is a visual representation of the records and the hierarchy of clusters to which they belong.</p>"
      },
      {
        h: "Worked example: stock dendrogram",
        body: "<p>For the company example (Figure 7-7), Google and Amazon returns are quite dissimilar from all the other stocks, joining the rest only at a large height. The remaining stocks fall into natural groups — energy, financial, and consumer stocks each form their own subtrees.</p><p>Unlike K-means, you do not have to prespecify the number of clusters. To extract a specific number you cut the tree, in R with <code>cutree(hcl, k=4)</code>. Cutting into 4 clusters gives:</p><table class=\"extable\"><thead><tr><th>Cluster</th><th>Members</th></tr></thead><tbody><tr><td class=\"row-h\">1</td><td>GOOGL</td></tr><tr><td class=\"row-h\">2</td><td>AMZN</td></tr><tr><td class=\"row-h\">3</td><td>AAPL, MSFT, CSCO, INTC, JPM, WFC, USB, AXP, WMT, TGT, HD, COST</td></tr><tr><td class=\"row-h\">4</td><td>CVX, XOM, SLB, COP</td></tr></tbody></table><p>Google and Amazon each get their own cluster; the oil stocks (XOM, CVX, SLB, COP) form a cluster; the rest fall into the fourth.</p>"
      }
    ],
    takeaways: [
      "A dendrogram is a tree whose branch lengths show cluster dissimilarity.",
      "No need to prespecify the number of clusters.",
      "Use cutree(k) to slice the tree into a chosen number of clusters.",
      "Cutting into 4 isolates GOOGL and AMZN and groups the oil stocks together."
    ]
  });
  window.CODEVIZ["ps-ch7-dendrogram"] = {
    charts: [{
      type: "bars",
      title: "Merge heights for the stock dendrogram (illustrative reconstruction of Figure 7-7)",
      interpret: "GOOGL and AMZN join the tree at far greater distances than the other stocks, marking them as outliers; the energy stocks merge low and early.",
      labels: ["GOOGL", "AMZN", "oil grp", "rest grp"],
      values: [158, 137, 30, 44],
      colors: ["#ff6b6b", "#ffb454", "#4ea1ff", "#7ee787"]
    }]
  };

  // ---------------------------------------------------------------------------
  // The Agglomerative Algorithm
  // ---------------------------------------------------------------------------
  B({
    id: "ps-ch7-agglomerative",
    chapter: "Chapter 7",
    title: "Agglomerative Algorithm",
    tagline: "Start with singletons and repeatedly merge the closest clusters.",
    sections: [
      {
        h: "Building up from single records",
        body: "<p>The main algorithm for hierarchical clustering is the <strong>agglomerative</strong> algorithm: it begins with each record as its own single-record cluster and iteratively merges the most similar clusters into larger and larger ones. The first step is to compute distances between all pairs of records. For two records $(x_1, \\dots, x_p)$ and $(y_1, \\dots, y_p)$ the book uses, for example, Euclidean distance:</p><p>$$d(x, y) = \\sqrt{(x_1 - y_1)^2 + (x_2 - y_2)^2 + \\cdots + (x_p - y_p)^2}$$</p><p>where each $(x_m - y_m)^2$ is the squared gap on variable $m$, summed over all $p$ variables, then square-rooted to give one overall distance.</p>"
      },
      {
        h: "Inter-cluster dissimilarity",
        body: "<p>For two clusters $A=(a_1, \\dots, a_m)$ and $B=(b_1, \\dots, b_q)$, the dissimilarity $D(A,B)$ is built from the distances between members of $A$ and members of $B$. One measure is <strong>complete linkage</strong>, the maximum distance across all pairs:</p><p>$$D(A, B) = \\max\\, d(a_i, b_j) \\text{ for all pairs } i, j$$</p><p>That is, the dissimilarity is the biggest gap found between any record of $A$ and any record of $B$.</p>"
      },
      {
        h: "The steps",
        body: "<ul class=\"steps\"><li>Create an initial set of clusters, one per record.</li><li>Compute the dissimilarity $D(C_k, C_\\ell)$ between all pairs of clusters $k$ and $\\ell$.</li><li>Merge the two clusters $C_k$ and $C_\\ell$ that are least dissimilar.</li><li>If more than one cluster remains, return to the second step; otherwise stop.</li></ul>"
      }
    ],
    takeaways: [
      "Each record starts as its own cluster.",
      "Record distances can use Euclidean distance across all p variables.",
      "Cluster dissimilarity (e.g. complete linkage = max pairwise distance) drives merging.",
      "Repeatedly merge the least-dissimilar pair until one cluster remains."
    ]
  });

  // ---------------------------------------------------------------------------
  // Measures of Dissimilarity
  // ---------------------------------------------------------------------------
  B({
    id: "ps-ch7-dissimilarity-measures",
    chapter: "Chapter 7",
    title: "Measures of Dissimilarity",
    tagline: "Complete, single, average, and minimum-variance linkage give different clusters.",
    sections: [
      {
        h: "The four common measures",
        body: "<p>There are four common dissimilarity measures, all supported by software such as <code>hclust</code>:</p><ul class=\"steps\"><li><strong>Complete linkage</strong> — the maximum distance across all record pairs between the two clusters. It tends to produce clusters whose members are similar.</li><li><strong>Single linkage</strong> — the minimum distance between records in the two clusters, $D(A,B)=\\min d(a_i, b_j)$ over all pairs. This is a \"greedy\" method that can produce clusters with quite disparate elements.</li><li><strong>Average linkage</strong> — the average of all distance pairs, a compromise between single and complete linkage.</li><li><strong>Minimum variance</strong> (Ward's method) — similar to K-means, since it minimizes the within-cluster sum of squares.</li></ul>"
      },
      {
        h: "Worked comparison",
        body: "<p>The book applies all four measures to the ExxonMobil and Chevron returns, retaining four clusters for each (Figure 7-8). The results are strikingly different: single linkage assigns almost all points to a single cluster, and every measure except minimum variance ends up with at least one cluster holding just a few outlying points. Minimum variance (Ward's) is the most similar to the K-means result of Figure 7-4 — it finds compact, comparable clusters.</p>"
      }
    ],
    takeaways: [
      "Complete linkage = max pairwise distance; produces similar-member clusters.",
      "Single linkage = min pairwise distance; greedy, can mix disparate elements.",
      "Average linkage averages all pairs; minimum variance (Ward's) mimics K-means.",
      "On the stock data the four measures give strikingly different clusters; Ward's is closest to K-means."
    ]
  });

  // ---------------------------------------------------------------------------
  // Model-Based Clustering — Multivariate Normal
  // ---------------------------------------------------------------------------
  B({
    id: "ps-ch7-multivariate-normal",
    chapter: "Chapter 7",
    title: "Multivariate Normal",
    tagline: "A probability model for clusters: normal distributions in several dimensions.",
    sections: [
      {
        h: "Why a model",
        body: "<p>K-means and hierarchical clustering are heuristics that find clusters whose members are close together in the data, with no probability model involved. <strong>Model-based clustering</strong> instead grounds clustering in statistical theory (Adrian Raftery and others developed it), giving more rigorous ways to determine the nature and number of clusters. It can handle, for example, one group of records that are similar but not necessarily close to one another (tech stocks with high return variance) alongside another group that is both similar and close (utility stocks with low variance).</p>"
      },
      {
        h: "The multivariate normal distribution",
        body: "<p>The most widely used model-based methods rest on the <strong>multivariate normal</strong> distribution — a generalization of the normal distribution to $p$ variables $X_1, \\dots, X_p$. It is defined by a vector of means $\\mu = \\mu_1, \\mu_2, \\dots, \\mu_p$ (one mean per variable) and a covariance matrix $\\Sigma$ that measures how the variables correlate. $\\Sigma$ holds the $p$ variances $\\sigma_1^2, \\dots, \\sigma_p^2$ on its diagonal and the covariances $\\sigma_{i,j}$ off the diagonal for every pair of variables $i \\neq j$. Because the matrix is symmetric ($\\sigma_{i,j} = \\sigma_{j,i}$), there are $p \\times (p-1) - p$ distinct covariance terms and $p \\times (p-1)$ parameters in total. The distribution is written $(X_1, \\dots, X_p) \\sim N_p(\\mu, \\Sigma)$, meaning all the variables are normally distributed and the whole distribution is fully described by the mean vector and the covariance matrix.</p>"
      },
      {
        h: "Worked example: probability contours",
        body: "<p>Figure 7-9 shows probability contours for a two-variable normal with means $\\mu_x = 0.5$ and $\\mu_y = -0.5$ and covariance matrix</p><p>$$\\Sigma = \\begin{bmatrix} 1 & 1 \\\\ 1 & 2 \\end{bmatrix}$$</p><p>Reading the matrix: $X$ has variance 1, $Y$ has variance 2, and their covariance is 1. The 0.5 contour, for instance, encloses 50% of the distribution. Because the covariance $\\sigma_{xy}$ is positive, $X$ and $Y$ are positively correlated, so the contours tilt as ellipses leaning in the positive direction.</p>"
      }
    ],
    takeaways: [
      "Model-based clustering uses a probability model instead of pure distance heuristics.",
      "It rests on the multivariate normal: a mean vector mu and covariance matrix Sigma.",
      "Sigma holds variances on the diagonal and covariances off it; symmetry halves the free terms.",
      "Positive covariance tilts the probability contours, showing positive correlation."
    ]
  });
  window.CODEVIZ["ps-ch7-multivariate-normal"] = {
    charts: [{
      type: "scatter",
      title: "Two-dimensional normal — center and correlation direction (from Figure 7-9 parameters)",
      interpret: "The distribution is centered at (0.5, -0.5); positive covariance (1) means X and Y rise together, tilting the contour ellipses upward.",
      xlabel: "X",
      ylabel: "Y",
      groups: [
        { name: "Mean (mu_x, mu_y)", color: "#ff6b6b", points: [[0.5, -0.5]] }
      ],
      lines: [
        { name: "correlation direction", color: "#4ea1ff", points: [[-2, -3], [3, 2]] }
      ]
    }]
  };

  // ---------------------------------------------------------------------------
  // Mixtures of Normals
  // ---------------------------------------------------------------------------
  B({
    id: "ps-ch7-mixtures-of-normals",
    chapter: "Chapter 7",
    title: "Mixtures of Normals",
    tagline: "Each record is drawn from one of K multivariate-normal distributions.",
    sections: [
      {
        h: "The core idea",
        body: "<p>The key idea behind model-based clustering is that each record is assumed to come from one of $K$ multivariate-normal distributions, where $K$ is the number of clusters. Each distribution has its own mean $\\mu$ and covariance matrix $\\Sigma$. For two variables $X$ and $Y$, each row $(X_i, Y_i)$ is modeled as a sample from one of $K$ distributions $N_1(\\mu_1, \\Sigma_1), N_1(\\mu_2, \\Sigma_2), \\dots, N_1(\\mu_K, \\Sigma_K)$.</p>"
      },
      {
        h: "Worked example: mclust on stock returns",
        body: "<p>The R package <code>mclust</code> (Fraley and Raftery) is applied to the XOM and CVX returns. It selects a model with <strong>2 components</strong> (reported as a \"VEE\" ellipsoidal model with equal shape and orientation), splitting 1,131 records into clusters of size 963 and 168. The fitted means are:</p><table class=\"extable\"><thead><tr><th></th><th>Cluster 1</th><th>Cluster 2</th></tr></thead><tbody><tr><td class=\"row-h\">XOM</td><td class=\"num\">0.0578</td><td class=\"num\">-0.0437</td></tr><tr><td class=\"row-h\">CVX</td><td class=\"num\">0.0736</td><td class=\"num\">-0.2118</td></tr></tbody></table><p>The two clusters have similar means and correlations, but very different variances:</p><table class=\"extable\"><thead><tr><th></th><th>XOM var</th><th>XOM·CVX cov</th><th>CVX var</th></tr></thead><tbody><tr><td class=\"row-h\">Cluster 1</td><td class=\"num\">0.300</td><td class=\"num\">0.306</td><td class=\"num\">0.550</td></tr><tr><td class=\"row-h\">Cluster 2</td><td class=\"num\">1.046</td><td class=\"num\">1.067</td><td class=\"num\">1.916</td></tr></tbody></table>"
      },
      {
        h: "What the clusters mean",
        body: "<p>The result (Figure 7-10) is very different from K-means and hierarchical clustering, which find compact clusters. Here one cluster sits in the middle of the data and a second sits around the outer edge. This reflects the statistical nature of the method: stock returns look roughly normal but actually have longer tails than a normal distribution, so <code>mclust</code> fits one distribution to the bulk of the data and a second, larger-variance distribution to the spread-out tail. The goal is the best-fitting set of multivariate normals, not compact groups.</p>"
      }
    ],
    takeaways: [
      "Each record is modeled as a draw from one of K multivariate normals.",
      "mclust chose a 2-component model on the stock data (sizes 963 and 168).",
      "The two clusters share similar means but cluster 2 has ~3x the variance.",
      "One normal fits the bulk; a wider-variance normal captures the long-tailed edge."
    ]
  });
  window.CODEVIZ["ps-ch7-mixtures-of-normals"] = {
    charts: [{
      type: "bars",
      title: "mclust cluster variances — bulk vs tail (from book's summary output)",
      interpret: "Cluster 2 (the outer-edge cluster) has roughly three times the variance of cluster 1, the central bulk — mclust fits a wide normal to the long tail.",
      labels: ["XOM var C1", "XOM var C2", "CVX var C1", "CVX var C2"],
      values: [0.300, 1.046, 0.550, 1.916],
      colors: ["#4ea1ff", "#ff6b6b", "#4ea1ff", "#ff6b6b"]
    }]
  };

  // ---------------------------------------------------------------------------
  // Model-Based Clustering — Selecting the Number of Clusters
  // ---------------------------------------------------------------------------
  B({
    id: "ps-ch7-mclust-selecting-clusters",
    chapter: "Chapter 7",
    title: "Selecting Clusters With BIC",
    tagline: "Model-based clustering picks the number of clusters automatically via BIC.",
    sections: [
      {
        h: "BIC chooses the model",
        body: "<p>Unlike K-means and hierarchical clustering, <code>mclust</code> automatically selects the number of clusters — here, two. It chooses the number for which the <strong>Bayesian Information Criteria</strong> (BIC) is largest. BIC (like AIC) is a general tool for picking the best model among candidates, also used in stepwise regression. It selects the best-fitting model while applying a <em>penalty</em> for the number of parameters. In model-based clustering, adding more clusters always improves the raw fit but introduces more parameters, so the penalty keeps the choice honest.</p>"
      },
      {
        h: "Worked example: BIC curves",
        body: "<p>Plotting BIC for each cluster size (Figure 7-11) looks like the K-means elbow plot, except the value plotted is BIC rather than percent of variance explained. One big difference: instead of a single line, <code>mclust</code> shows <strong>14 lines</strong> — it is fitting 14 different models for each cluster size (different ways to parameterize the covariance matrix $\\Sigma$), and ultimately picks the best-fitting one. In this example, according to BIC, three different models (VEE, VEV, and VVE) give the best fit using two components. For most problems you do not need to worry about the model details and can simply use the model <code>mclust</code> chooses.</p>"
      },
      {
        h: "Limitations",
        body: "<p>Model-based clustering has limits: it requires an assumed model for the data, and the cluster results depend heavily on that assumption. Its computational requirements are higher than even hierarchical clustering, making it hard to scale to large data, and the algorithm is more sophisticated and less accessible than the others.</p>"
      }
    ],
    takeaways: [
      "mclust picks the cluster count by maximizing BIC.",
      "BIC rewards fit but penalizes extra parameters, so more clusters are not automatically better.",
      "mclust fits 14 covariance parameterizations per cluster size and keeps the best.",
      "The method assumes a model, is compute-heavy, and is less accessible than K-means or hierarchical."
    ]
  });
  window.CODEVIZ["ps-ch7-mclust-selecting-clusters"] = {
    charts: [{
      type: "line",
      title: "BIC vs number of components — illustrative reconstruction of Figure 7-11",
      interpret: "BIC rises steeply then peaks around 2 components and flattens; mclust selects the component count at the maximum.",
      xlabel: "Number of components",
      ylabel: "BIC (higher is better)",
      series: [{
        name: "best-fitting model",
        color: "#7ee787",
        points: [[1, -5640], [2, -4574], [3, -4720], [4, -4760], [5, -4790], [6, -4810], [7, -4820], [8, -4840], [9, -4860]]
      }]
    }]
  };

  // ---------------------------------------------------------------------------
  // Scaling the Variables
  // ---------------------------------------------------------------------------
  B({
    id: "ps-ch7-scaling-variables",
    chapter: "Chapter 7",
    title: "Scaling the Variables",
    tagline: "Standardize to z-scores so big-unit variables don't hijack the clusters.",
    sections: [
      {
        h: "Why scaling matters",
        body: "<p>Unsupervised methods generally require appropriately scaled data — unlike many regression and classification techniques where scaling does not matter (an exception is K-nearest neighbors). With the loan data, variables have widely different units and magnitudes: some are small (years employed) and others very large (loan amount in dollars). Unscaled, PCA, K-means, and other clustering methods will be dominated by the large-valued variables and ignore the small ones. Key terms: <strong>scaling</strong> means squashing or expanding data to bring variables to the same scale; <strong>normalization</strong> (a synonym for standardization) is one scaling method — subtract the mean and divide by the standard deviation.</p>"
      },
      {
        h: "Worked example: loan defaults unscaled",
        body: "<p>Applying K-means with $K=4$ to loan variables (<code>loan_amnt</code>, <code>annual_inc</code>, <code>revol_bal</code>, <code>open_acc</code>, <code>dti</code>, <code>revol_util</code>) <em>without</em> normalizing gives wildly uneven cluster sizes and centers dominated by the large-dollar variables:</p><table class=\"extable\"><thead><tr><th>Size</th><th>annual_inc</th><th>revol_bal</th></tr></thead><tbody><tr><td class=\"num\">55</td><td class=\"num\">491522</td><td class=\"num\">83471</td></tr><tr><td class=\"num\">1218</td><td class=\"num\">165748</td><td class=\"num\">38299</td></tr><tr><td class=\"num\">7686</td><td class=\"num\">83504</td><td class=\"num\">19685</td></tr><tr><td class=\"num\">14177</td><td class=\"num\">42539</td><td class=\"num\">10277</td></tr></tbody></table><p><code>annual_inc</code> and <code>revol_bal</code> dominate, and cluster 1 has just 55 members with very high income and revolving balance.</p>"
      },
      {
        h: "Scaling to z-scores",
        body: "<p>The standard fix is to convert each variable to a <strong>z-score</strong>:</p><p>$$z = \\frac{x - \\bar{x}}{s}$$</p><p>where $x$ is the raw value, $\\bar{x}$ is the variable's mean, and $s$ its standard deviation — so $z$ says how many standard deviations the value sits from the mean. After scaling (R's <code>scale</code> function) and re-running K-means, the clusters become more balanced and are no longer driven by income and revolving balance, revealing more interesting structure. The book rescales the reported centers back to the original units so they stay interpretable; left as z-scores they would be harder to read. A note: scaling matters for PCA too — using z-scores is equivalent to using the correlation matrix instead of the covariance matrix (the <code>princomp</code> <code>cor</code> argument).</p>"
      }
    ],
    takeaways: [
      "Clustering needs scaled data, or large-unit variables dominate.",
      "Unscaled loan K-means is hijacked by annual_inc and revol_bal (one tiny 55-member cluster).",
      "Z-scoring (subtract mean, divide by SD) balances the clusters.",
      "For PCA, using z-scores equals using the correlation matrix."
    ]
  });
  window.CODEVIZ["ps-ch7-scaling-variables"] = {
    charts: [{
      type: "bars",
      title: "Unscaled loan K-means cluster sizes (book's round(centers) output)",
      interpret: "Without scaling the clusters are badly imbalanced — 55 vs over 14,000 members — because large-dollar variables dominate the distance.",
      labels: ["Cluster 1", "Cluster 2", "Cluster 3", "Cluster 4"],
      values: [55, 1218, 7686, 14177]
    }]
  };

  // ---------------------------------------------------------------------------
  // Dominant Variables
  // ---------------------------------------------------------------------------
  B({
    id: "ps-ch7-dominant-variables",
    chapter: "Chapter 7",
    title: "Dominant Variables",
    tagline: "A few high-variance variables can swamp the loadings even on a common scale.",
    sections: [
      {
        h: "When one or two variables take over",
        body: "<p>Even when variables are on the same scale and accurately reflect relative importance (like stock-price movements), it can still help to rescale. The book adds Alphabet (GOOGL) and Amazon (AMZN) to the earlier PCA of top S&P 500 stocks and re-runs it. The new screeplot (Figure 7-12) shows the variances of the first <em>and second</em> components much larger than the rest — a sign that one or two variables dominate the loadings.</p>"
      },
      {
        h: "Worked example: loadings dominated by GOOGL and AMZN",
        body: "<p>The loadings for the first two components confirm it:</p><table class=\"extable\"><thead><tr><th></th><th>Comp.1</th><th>Comp.2</th></tr></thead><tbody><tr><td class=\"row-h\">GOOGL</td><td class=\"num\">0.781</td><td class=\"num\">0.609</td></tr><tr><td class=\"row-h\">AMZN</td><td class=\"num\">0.593</td><td class=\"num\">-0.792</td></tr><tr><td class=\"row-h\">AAPL</td><td class=\"num\">0.078</td><td class=\"num\">0.004</td></tr><tr><td class=\"row-h\">MSFT</td><td class=\"num\">0.029</td><td class=\"num\">0.002</td></tr><tr><td class=\"row-h\">CSCO</td><td class=\"num\">0.017</td><td class=\"num\">-0.001</td></tr><tr><td class=\"row-h\">CVX</td><td class=\"num\">0.068</td><td class=\"num\">-0.021</td></tr><tr><td class=\"row-h\">XOM</td><td class=\"num\">0.053</td><td class=\"num\">-0.005</td></tr></tbody></table><p>The first two components are almost entirely dominated by GOOGL and AMZN, because the price movements of these two stocks dominate the variability. The other stocks contribute loadings near zero.</p>"
      },
      {
        h: "What to do",
        body: "<p>There are three options, and no single \"correct\" one — the treatment depends on the application: include the dominant variables as is; rescale the variables; or exclude the dominant variables from the analysis and handle them separately.</p>"
      }
    ],
    takeaways: [
      "A few high-variance variables can dominate PCA loadings even on a common scale.",
      "Adding GOOGL and AMZN makes both the first two screeplot variances large.",
      "GOOGL (0.781, 0.609) and AMZN (0.593, -0.792) swamp components 1 and 2; others are near zero.",
      "Options: keep as is, rescale, or exclude the dominant variables — no single right answer."
    ]
  });
  window.CODEVIZ["ps-ch7-dominant-variables"] = {
    charts: [{
      type: "bars",
      title: "First-component loadings with GOOGL and AMZN added (book's princomp output)",
      interpret: "GOOGL and AMZN carry almost all the loading on component 1; the remaining stocks sit near zero, showing two variables dominate.",
      labels: ["GOOGL", "AMZN", "AAPL", "MSFT", "CSCO", "CVX", "XOM"],
      values: [0.781, 0.593, 0.078, 0.029, 0.017, 0.068, 0.053]
    }]
  };

  // ---------------------------------------------------------------------------
  // Categorical Data and Gower's Distance
  // ---------------------------------------------------------------------------
  B({
    id: "ps-ch7-gowers-distance",
    chapter: "Chapter 7",
    title: "Categorical Data and Gower's Distance",
    tagline: "Gower's distance scales mixed numeric and categorical data to a 0-1 range.",
    sections: [
      {
        h: "Handling mixed data types",
        body: "<p>Categorical data must be converted to numeric before clustering — by ranking (for an ordered factor) or by encoding as a set of binary (dummy) variables. When data mixes continuous and binary variables you usually want to scale them so the ranges match. A popular method is <strong>Gower's distance</strong>, defined in the key terms as a scaling algorithm applied to mixed numeric and categorical data to bring all variables to a 0-1 range.</p>"
      },
      {
        h: "How Gower's distance works",
        body: "<p>The basic idea is to apply a different distance metric to each variable depending on its type:</p><ul class=\"steps\"><li>For numeric variables and ordered factors, distance is the absolute value of the difference between two records (Manhattan distance).</li><li>For categorical variables, distance is 1 if the two records' categories differ and 0 if they are the same.</li></ul><p>The computation then runs:</p><ul class=\"steps\"><li>Compute the distance $d_{i,j}$ for all pairs of variables, for each record.</li><li>Scale each pair $d_{i,j}$ so its minimum is 0 and maximum is 1.</li><li>Add the scaled pairwise distances together — a simple or weighted mean — to form the distance matrix.</li></ul>"
      },
      {
        h: "Worked example: loan rows",
        body: "<p>Taking five rows of loan data with numeric (<code>dti</code>, <code>payment_inc_ratio</code>) and categorical (<code>home</code>, <code>purpose</code>) variables, R's <code>daisy</code> function (cluster package, <code>metric='gower'</code>) gives dissimilarities all between 0 and 1:</p><table class=\"extable\"><thead><tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr></thead><tbody><tr><td class=\"row-h\">2</td><td class=\"num\">0.622</td><td class=\"num\"></td><td class=\"num\"></td><td class=\"num\"></td></tr><tr><td class=\"row-h\">3</td><td class=\"num\">0.686</td><td class=\"num\">0.814</td><td class=\"num\"></td><td class=\"num\"></td></tr><tr><td class=\"row-h\">4</td><td class=\"num\">0.633</td><td class=\"num\">0.761</td><td class=\"num\">0.431</td><td class=\"num\"></td></tr><tr><td class=\"row-h\">5</td><td class=\"num\">0.377</td><td class=\"num\">0.539</td><td class=\"num\">0.309</td><td class=\"num\">0.506</td></tr></tbody></table><p>The biggest distance, 0.814, is between records 2 and 3: they share neither <code>home</code> nor <code>purpose</code> and have very different <code>dti</code> and <code>payment_inc_ratio</code>. Records 3 and 5 are closest (0.309) because they share the same <code>home</code> and <code>purpose</code> values. You can then feed the Gower distance matrix into <code>hclust</code>; in the book's larger sample, a subtree consisted entirely of renters with loan purpose \"other\", showing categorical variables tend to group together.</p>"
      }
    ],
    takeaways: [
      "Categorical variables become numeric by ranking or one-hot (dummy) encoding.",
      "Gower's distance uses Manhattan distance for numeric/ordered, 0/1 for categorical, scaled to 0-1.",
      "On the loan rows, records 2 and 3 are most dissimilar (0.814), 3 and 5 most similar (0.309).",
      "The Gower matrix feeds into hclust, and categorical values tend to cluster together."
    ]
  });
  window.CODEVIZ["ps-ch7-gowers-distance"] = {
    charts: [{
      type: "bars",
      title: "Gower's distances from record 1 to the others (book's daisy output)",
      interpret: "All distances fall in the 0-1 range; record 5 is closest to record 1, record 3 is furthest.",
      labels: ["1↔2", "1↔3", "1↔4", "1↔5"],
      values: [0.622, 0.686, 0.633, 0.377]
    }]
  };

  // ---------------------------------------------------------------------------
  // Problems with Clustering Mixed Data
  // ---------------------------------------------------------------------------
  B({
    id: "ps-ch7-clustering-mixed-data",
    chapter: "Chapter 7",
    title: "Problems Clustering Mixed Data",
    tagline: "K-means and PCA struggle when binary variables enter the mix.",
    sections: [
      {
        h: "Why K-means and PCA falter",
        body: "<p>K-means and PCA are most appropriate for continuous variables. For smaller data sets it is better to use hierarchical clustering with Gower's distance. In principle nothing stops K-means from being applied to binary or categorical data — you would one-hot encode the categories into numeric 0/1 columns — but in practice K-means and PCA with binary data can be difficult.</p>"
      },
      {
        h: "The binary-domination problem",
        body: "<p>If standard z-scores are used, the binary variables end up <em>dominating</em> the cluster definitions. The reason: a 0/1 variable takes on only two values, so K-means can drive the within-cluster sum of squares very low simply by putting all the records with a 0 (or all with a 1) into one cluster. The book illustrates with loan data including factor variables <code>home</code> and <code>pub_rec_zero</code>: after one-hot encoding and scaling, the top four K-means clusters turn out to be essentially proxies for the different levels of the factor variables — for example, one cluster is basically all the home-owners, another all the renters — rather than meaningful structure.</p>"
      },
      {
        h: "Workarounds",
        body: "<ul class=\"steps\"><li>Scale the binary variables to have a <em>smaller</em> variance than the other variables, so they no longer dominate.</li><li>For very large data sets, cluster separate subsets that share specific categorical values — for example, cluster loans with a mortgage, loans owned outright, and rentals separately.</li></ul>"
      }
    ],
    takeaways: [
      "K-means and PCA suit continuous data; small mixed data is better served by hierarchical + Gower's.",
      "One-hot binary variables, if z-scored, dominate because they take only two values.",
      "K-means then just splits records by category level, giving uninformative clusters.",
      "Fixes: shrink the binary variables' variance, or cluster within each categorical level separately."
    ]
  });
})();
