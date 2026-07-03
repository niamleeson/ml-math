/* =====================================================================
   AFP-AI Learning Guide — Domain 3 · Unsupervised Learning  (modules M15–M16)
   ---------------------------------------------------------------------
   Authored source for AFP-AI track lessons and Colab notebooks.
   ===================================================================== */
"use strict";

const M15 = {
  m: 15, domain: 3,
  title: "Clustering & cohort/persona discovery (k-means, GMM, HDBSCAN)",
  tagline: "Find structure without labels, then test whether the structure is stable enough to use.",
  skipIf: "pick a clustering method and validate clusters without labels.",
  mapsTo: ["all"],
  connections: {
    buildsOn: ["feature vectors and scaling", "distances and norms", "basic probability densities"],
    leadsTo: ["persona discovery", "topic modeling", "retrieval evaluation without labels"],
    usedWith: ["PCA or UMAP for visualization", "silhouette and stability metrics", "human review of cluster names"]
  },
  motivation:
    "<p>You already know how to train a model when the answer column exists. Clustering starts one step earlier: the data has useful shape, but no one has labeled the personas, cohorts, or content groups yet. In ads and marketplace work, that is common. We may have creator bios, viewer behavior, campaign goals, and creative embeddings, but no canonical list of cohorts waiting in a table.</p>" +
    "<p>The promise of clustering is not magic labeling; it is disciplined grouping. We choose a notion of similarity, run an algorithm that prefers compact or dense groups, then ask whether the groups are coherent, stable, and useful for a downstream decision. A good cluster is a hypothesis you can inspect, name, and test.</p>",
  definition:
    "<p><b>Definition.</b> Given feature vectors $x_1,\\ldots,x_n \\in \\mathbb{R}^d$, clustering partitions or softly assigns the points into groups so points in the same group are more similar than points in different groups. For k-means, the objective is the within-cluster sum of squared errors:</p>" +
    "$$\\min_{C_1,\\ldots,C_k,\\mu_1,\\ldots,\\mu_k} \\sum_{j=1}^k \\sum_{x_i \\in C_j} \\|x_i-\\mu_j\\|_2^2.$$" +
    "<p>A Gaussian mixture model instead assumes $p(x)=\\sum_{j=1}^k \\pi_j\\mathcal{N}(x\\mid\\mu_j,\\Sigma_j)$ and returns soft responsibilities. Density methods such as DBSCAN and HDBSCAN define clusters as dense regions separated by sparse space; they can mark noise and do not require choosing $k$.</p>",
  symbols: [
    { sym: "$x_i \\in \\mathbb{R}^d$", desc: "the feature vector for member, creator, ad, or content item $i$." },
    { sym: "$k$", desc: "the requested number of k-means or GMM groups." },
    { sym: "$C_j$", desc: "the set of points assigned to cluster $j$." },
    { sym: "$\\mu_j$", desc: "cluster $j$'s centroid or Gaussian mean." },
    { sym: "$\\Sigma_j$", desc: "cluster $j$'s covariance in a Gaussian mixture." },
    { sym: "$r_{ij}$", desc: "GMM responsibility: probability-like soft assignment of point $i$ to component $j$." },
    { sym: "$s_i$", desc: "silhouette score for point $i$, comparing its own-cluster distance to nearest-other-cluster distance." }
  ],
  derivation: [
    { do: "Fix centroids in k-means", result: "assign each $x_i$ to the nearest $\\mu_j$", why: "with centroids fixed, the SSE contribution for a point is minimized by its closest centroid" },
    { do: "Fix assignments", result: "set $\\mu_j=\\frac{1}{|C_j|}\\sum_{x_i\\in C_j}x_i$", why: "the mean is the squared-error minimizer for points in one cluster" },
    { do: "Alternate the two steps", result: "Lloyd's algorithm monotonically decreases SSE until assignments stop changing", why: "each assignment or mean update cannot increase the objective" },
    { do: "Replace hard labels by mixture probabilities", result: "$r_{ij}=\\frac{\\pi_j\\mathcal{N}(x_i\\mid\\mu_j,\\Sigma_j)}{\\sum_{\\ell}\\pi_{\\ell}\\mathcal{N}(x_i\\mid\\mu_{\\ell},\\Sigma_{\\ell})}$", why: "the EM E-step computes how much each component explains each point" },
    { do: "Validate without labels", result: "use silhouette, Davies-Bouldin, elbow curves, and resampling stability", why: "unsupervised scores are proxies, so agreement across several checks is safer than trusting one number" }
  ],
  worked: {
    problem: "Run one k-means update on six 2D points: A(1,1), B(1,2), C(2,1), D(8,8), E(9,8), F(8,9). Start centroids $\\mu_1=(1,1)$ and $\\mu_2=(8,8)$. Then compute the silhouette for point A using average distances.",
    skills: ["Euclidean distance", "Lloyd update", "silhouette"],
    strategy: "Do one operation at a time: assign points to nearest centroids, average coordinates, then compare A's within-cluster and nearest-other-cluster distances.",
    steps: [
      { do: "Compute A's distances", result: "$d(A,\\mu_1)=0$ and $d(A,\\mu_2)=\\sqrt{98}\\approx9.90$", why: "A is assigned to the closest centroid" },
      { do: "Assign the first three points", result: "$A,B,C \\in C_1$", why: "each is within about 1 of $(1,1)$ and much farther from $(8,8)$" },
      { do: "Assign the last three points", result: "$D,E,F \\in C_2$", why: "each is within about 1 of $(8,8)$ and much farther from $(1,1)$" },
      { do: "Average cluster 1", result: "$\\mu_1'=(\\frac{1+1+2}{3},\\frac{1+2+1}{3})=(1.33,1.33)$", why: "the centroid is the coordinate-wise mean" },
      { do: "Average cluster 2", result: "$\\mu_2'=(\\frac{8+9+8}{3},\\frac{8+8+9}{3})=(8.33,8.33)$", why: "the second centroid moves to the middle of D, E, and F" },
      { do: "Compute A's own-cluster average distance", result: "$a(A)=\\frac{d(A,B)+d(A,C)}{2}=\\frac{1+1}{2}=1$", why: "silhouette uses average distance to other points in the same cluster" },
      { do: "Compute A's other-cluster average distance", result: "$b(A)=\\frac{\\sqrt{98}+\\sqrt{113}+\\sqrt{113}}{3}\\approx10.39$", why: "with two clusters, the nearest other cluster is $C_2$" },
      { do: "Compute A's silhouette", result: "$s(A)=\\frac{b-a}{\\max(a,b)}=\\frac{10.39-1}{10.39}\\approx0.904$", why: "a value near 1 means A is much closer to its own cluster" }
    ],
    verify: "The new centroids sit near the two visible triangles, and A's silhouette near 0.90 matches the obvious separation.",
    answer: "After one update, the centroids are approximately $(1.33,1.33)$ and $(8.33,8.33)$; A's silhouette is about 0.904.",
    connects: "k-means provides the grouping; silhouette asks whether the grouping is geometrically credible without labels."
  },
  practice: [
    {
      problem: "For points $(0,0),(0,2),(2,0),(10,10)$ with $k=2$ and centroids $(0,0),(10,10)$, assign points and update centroids once.",
      steps: [
        { do: "Assign $(0,0)$", result: "cluster 1", why: "distance to $(0,0)$ is 0 and distance to $(10,10)$ is $\\sqrt{200}$" },
        { do: "Assign $(0,2)$ and $(2,0)$", result: "cluster 1", why: "both are distance 2 from $(0,0)$ and much farther from $(10,10)$" },
        { do: "Assign $(10,10)$", result: "cluster 2", why: "it equals the second centroid" },
        { do: "Average cluster 1", result: "$\\mu_1'=(\\frac{0+0+2}{3},\\frac{0+2+0}{3})=(0.67,0.67)$", why: "the centroid is the coordinate mean" },
        { do: "Average cluster 2", result: "$\\mu_2'=(10,10)$", why: "a one-point cluster has that point as its mean" }
      ],
      answer: "Assignments are three near-origin points in cluster 1 and $(10,10)$ in cluster 2; updated centroids are $(0.67,0.67)$ and $(10,10)$."
    },
    {
      problem: "A point has average within-cluster distance $a=2.0$ and nearest-other-cluster average distance $b=5.0$. Compute and interpret its silhouette.",
      steps: [
        { do: "Choose the denominator", result: "$\\max(a,b)=5.0$", why: "silhouette normalizes by the larger average distance" },
        { do: "Subtract distances", result: "$b-a=3.0$", why: "positive means the point is closer to its own cluster" },
        { do: "Divide", result: "$s=3/5=0.60$", why: "silhouette lies between -1 and 1" }
      ],
      answer: "$s=0.60$, a reasonably well-separated point."
    },
    {
      problem: "An elbow table reports SSE for $k=1,2,3,4$ as 900, 420, 250, 230. Which $k$ is a reasonable elbow and why?",
      steps: [
        { do: "Compute first drop", result: "$900-420=480$", why: "the gain from one to two clusters is large" },
        { do: "Compute second drop", result: "$420-250=170$", why: "adding a third cluster still helps" },
        { do: "Compute third drop", result: "$250-230=20$", why: "the fourth cluster adds little" }
      ],
      answer: "$k=3$ is reasonable because improvements flatten sharply after three clusters."
    },
    {
      problem: "A two-component GMM gives unnormalized component weights 0.12 and 0.03 for one creator. Compute responsibilities.",
      steps: [
        { do: "Sum weights", result: "$0.12+0.03=0.15$", why: "responsibilities normalize the component evidence" },
        { do: "Normalize component 1", result: "$r_1=0.12/0.15=0.80$", why: "divide its evidence by the total" },
        { do: "Normalize component 2", result: "$r_2=0.03/0.15=0.20$", why: "responsibilities sum to 1" }
      ],
      answer: "The soft assignment is 80% component 1 and 20% component 2."
    },
    {
      problem: "DBSCAN uses $\\epsilon=0.5$ and min_samples=4. A point has 5 neighbors inside $\\epsilon$; another has 2 and is not reachable from any core point. Name both statuses.",
      steps: [
        { do: "Compare first count", result: "$5 \\ge 4$", why: "meeting min_samples makes a point core" },
        { do: "Compare second count", result: "$2 < 4$", why: "it is not core on its own" },
        { do: "Check reachability", result: "not reachable", why: "a non-core point that is not density-reachable is noise" }
      ],
      answer: "The first point is a core point; the second is noise."
    }
  ],
  applications: [
    { title: "Creator Marketplace AI persona discovery", background: "Creator marketplaces often begin with embeddings from bios, content topics, audience engagement, and past campaign fit. Clustering turns those embeddings into draft personas that humans can name, such as B2B thought leaders or career-transition coaches.", numbers: "If 12,000 creators are embedded and $k=8$, an even split would average 1,500 creators per persona. A real run with cluster sizes 2,400, 1,900, 1,700, 1,400, 1,300, 1,100, 1,000, and 1,200 has entropy $-\\sum p_j\\log p_j\\approx2.05$, close to $\\log 8=2.08$, so it is not dominated by one bucket." },
    { title: "Cohort discovery for advertiser briefs", background: "Advertiser briefs can be grouped by objectives, vertical, budget range, and creative language before labels exist. Sales and product teams can inspect clusters to decide whether a new workflow should serve a recurring brief type.", numbers: "Suppose cluster centroids in standardized features show lead-gen=1.4 and awareness=-0.6 for cluster A, versus lead-gen=-0.5 and awareness=1.2 for cluster B. The centroid gap on those two axes is $\\sqrt{(1.9)^2+(-1.8)^2}\\approx2.62$, a clear separation to review." },
    { title: "Instream Ads content clustering", background: "Video embeddings can be clustered to find content neighborhoods for Instream Ads: tutorials, product demos, leadership talks, hiring content, and industry news. This helps inventory exploration before a supervised taxonomy is mature.", numbers: "For 50,000 videos, sampling 1,000 from each of 6 clusters gives a 6,000-video review set. If reviewers mark 840 of 1,000 sampled videos in cluster 3 as 'technical tutorials,' the observed cluster purity is 0.84 with standard error $\\sqrt{0.84\\cdot0.16/1000}\\approx0.0116$." },
    { title: "Audience segmentation for ads pacing", background: "Member-level features such as seniority, industry, engagement recency, and content affinity can produce cohorts for pacing diagnostics. The cluster is not the final targeting rule; it is a lens for seeing who receives delivery.", numbers: "If a campaign spends USD 24k across cohorts with spend [9k, 6k, 4k, 3k, 2k], cohort 1 receives $9/24=37.5\\%$ of spend. If its conversion share is 30%, that cohort is overrepresented by 7.5 percentage points in spend." },
    { title: "Creative Intelligence theme grouping", background: "Creative Intelligence can cluster ad text and images by message theme before measuring performance. Teams can compare clusters such as hiring urgency, product proof, social proof, and educational content.", numbers: "If a cluster of 320 creatives has mean CTR 0.82% and the account baseline is 0.61%, the relative lift is $(0.0082-0.0061)/0.0061\\approx34.4\\%$. That number is re-derived directly from the cluster aggregate." },
    { title: "Anomaly detection on ads metrics via small clusters", background: "Clustering daily campaign metrics can reveal a tiny cluster of unusual delivery days before a dedicated anomaly detector is built. Small dense groups are worth inspecting when they concentrate failures.", numbers: "If 14 of 1,400 campaign-days fall into a cluster with mean CPC USD 9.20 while the global mean is USD 3.10, the cluster is 1% of volume but has $9.20/3.10\\approx2.97\\times$ CPC, a strong operations flag." },
    { title: "Choosing a method by cluster shape", background: "k-means likes round, equal-variance groups; GMM handles ellipses and uncertainty; HDBSCAN handles variable density and noise. The method choice should match the geometry, not the team preference.", numbers: "A candidate with silhouette 0.42 but 18% points labeled noise may be better for discovery than k-means silhouette 0.46 if the noise bucket catches bad or off-topic inventory. On 20,000 items, 18% means 3,600 items withheld from persona names." }
  ],
  applicationsClose:
    "<p>Clustering is most valuable when it stays honest about uncertainty. Use it to propose personas, themes, cohorts, and odd pockets of behavior; then validate with geometry, stability, and human inspection before turning a cluster name into a product decision.</p>",
  takeaways: [
    "k-means minimizes within-cluster SSE by alternating nearest-centroid assignment and centroid recomputation.",
    "GMMs give soft assignments through EM, which is useful when a creator, member, or creative plausibly belongs to multiple personas.",
    "DBSCAN and HDBSCAN look for dense regions, can mark noise, and avoid choosing $k$ up front.",
    "Without labels, trust clusters only after checking silhouette or Davies-Bouldin, elbow behavior, resampling stability, and human coherence."
  ],
  resources: [
    { label: "scikit-learn — clustering", note: "k-means, GMM, DBSCAN, metrics" },
    { label: "HDBSCAN docs", note: "density clustering with noise + variable density" },
    { label: "StatQuest — k-means", note: "the algorithm, visually" }
  ],
  papers: [
    "Density-Based Clustering / HDBSCAN (Campello et al., 2013)",
    "BERTopic (Grootendorst, 2022)"
  ],
  notebook: [
    { t: "md", src:
      "# M15 · Clustering & cohort/persona discovery\n\n" +
      "Curriculum · Domain 3 · Unsupervised learning\n\n" +
      "**Find structure without labels, then test whether the structure is stable enough to use.**\n\n" +
      "We will create creator-style feature vectors, run k-means, compare $k$ with silhouette, inspect GMM soft assignments, and use DBSCAN to mark noise. Run top to bottom." },
    { t: "code", src:
      "import numpy as np\n" +
      "import matplotlib.pyplot as plt\n" +
      "from sklearn.cluster import KMeans\n" +
      "from sklearn.cluster import DBSCAN\n" +
      "from sklearn.datasets import make_blobs\n" +
      "from sklearn.mixture import GaussianMixture\n" +
      "from sklearn.metrics import silhouette_score\n" +
      "from sklearn.preprocessing import StandardScaler\n\n" +
      "rng = np.random.default_rng(15)" },
    { t: "md", src:
      "## Build a small persona dataset\n\n" +
      "Each row is a creator or content account. The columns are standardized signals like technical depth, creator reach, buyer intent, and entertainment style." },
    { t: "code", src:
      "centers = np.array([\n" +
      "    [2.2, 0.4, 1.8, 0.2],\n" +
      "    [-1.5, 1.8, -0.8, 1.4],\n" +
      "    [0.1, -1.8, 1.2, -1.2],\n" +
      "])\n\n" +
      "X, true_group = make_blobs(\n" +
      "    n_samples=450,\n" +
      "    centers=centers,\n" +
      "    cluster_std=[0.55, 0.70, 0.60],\n" +
      "    random_state=15,\n" +
      ")\n\n" +
      "X = StandardScaler().fit_transform(X)\n\n" +
      "print(\"rows:\", X.shape[0])\n" +
      "print(\"features:\", X.shape[1])" },
    { t: "md", src:
      "## k-means objective\n\n" +
      "k-means chooses centroids $\\mu_1,\\ldots,\\mu_k$ to minimize\n\n" +
      "$$\\sum_{j=1}^k \\sum_{x_i \\in C_j} \\|x_i - \\mu_j\\|_2^2.$$\n\n" +
      "The `inertia_` attribute below is exactly that within-cluster SSE." },
    { t: "code", src:
      "model = KMeans(n_clusters=3, random_state=15, n_init=20)\n" +
      "labels = model.fit_predict(X)\n" +
      "score = silhouette_score(X, labels)\n\n" +
      "print(\"SSE:\", round(model.inertia_, 2))\n" +
      "print(\"silhouette:\", round(score, 3))\n\n" +
      "assert score > 0.45" },
    { t: "md", src:
      "## Choose $k$ with two imperfect signals\n\n" +
      "The elbow asks where SSE stops falling quickly. Silhouette asks whether points are nearer to their own cluster than to other clusters. Neither is truth; together they are a useful diagnostic." },
    { t: "code", src:
      "ks = [2, 3, 4, 5, 6]\n" +
      "inertias = []\n" +
      "silhouettes = []\n\n" +
      "for k in ks:\n" +
      "    km = KMeans(n_clusters=k, random_state=15, n_init=20)\n" +
      "    yk = km.fit_predict(X)\n" +
      "    inertias.append(km.inertia_)\n" +
      "    silhouettes.append(silhouette_score(X, yk))\n\n" +
      "for k, inertia, sil in zip(ks, inertias, silhouettes):\n" +
      "    print(k, round(inertia, 1), round(sil, 3))" },
    { t: "md", src:
      "## Visualize the first two feature axes\n\n" +
      "A plot is not a proof, but it is a fast way to catch obviously broken clusters before deeper review." },
    { t: "code", src:
      "fig, ax = plt.subplots(figsize=(5, 4))\n" +
      "scatter = ax.scatter(X[:, 0], X[:, 1], c=labels, s=20, cmap=\"viridis\")\n" +
      "ax.scatter(model.cluster_centers_[:, 0], model.cluster_centers_[:, 1], c=\"red\", s=120, marker=\"x\")\n" +
      "ax.set_xlabel(\"feature 1\")\n" +
      "ax.set_ylabel(\"feature 2\")\n" +
      "ax.set_title(\"k-means creator personas\")\n" +
      "plt.show()" },
    { t: "md", src:
      "## GMM: soft assignment instead of hard membership\n\n" +
      "A creator can look 70% like a technical educator and 30% like a career coach. GMM responsibilities capture that ambiguity." },
    { t: "code", src:
      "gmm = GaussianMixture(n_components=3, random_state=15)\n" +
      "gmm.fit(X)\n\n" +
      "probs = gmm.predict_proba(X[:5])\n\n" +
      "print(np.round(probs, 3))\n\n" +
      "row_sums = probs.sum(axis=1)\n" +
      "assert np.allclose(row_sums, 1.0)" },
    { t: "md", src:
      "## DBSCAN: density and noise\n\n" +
      "Density methods are useful when some inventory should not be forced into a persona. DBSCAN is the scikit-learn version; HDBSCAN extends the idea to variable density." },
    { t: "code", src:
      "noise = rng.uniform(low=-5.0, high=5.0, size=(18, X.shape[1]))\n" +
      "X_with_noise = np.vstack([X, noise])\n\n" +
      "db = DBSCAN(eps=0.75, min_samples=8)\n" +
      "db_labels = db.fit_predict(X_with_noise)\n\n" +
      "noise_count = int(np.sum(db_labels == -1))\n" +
      "cluster_count = len(set(db_labels)) - int(-1 in db_labels)\n\n" +
      "print(\"clusters:\", cluster_count)\n" +
      "print(\"noise points:\", noise_count)\n\n" +
      "assert noise_count >= 10" },
    { t: "md", src:
      "## Practice\n\n" +
      "1. Change `n_clusters` to 2 and 4. Which has the better silhouette?\n" +
      "2. Increase `cluster_std` and re-run. Watch silhouette fall as personas overlap.\n" +
      "3. Change DBSCAN `eps`. How many points become noise?\n" +
      "4. Inspect the GMM probability rows. Which creators are ambiguous?" },
    { t: "code", src:
      "# Your turn\n" }
  ]
};

const M16 = {
  m: 16, domain: 3,
  title: "Dimensionality reduction & anomaly detection (PCA/UMAP)",
  tagline: "Compress high-dimensional behavior into a useful view, then spot points that do not belong.",
  skipIf: "reduce and visualize high-dimensional features and flag outliers.",
  mapsTo: ["all"],
  connections: {
    buildsOn: ["linear algebra and covariance", "eigenvectors and projections", "distances in feature space"],
    leadsTo: ["embedding visualization", "quality monitoring", "model and data drift investigation"],
    usedWith: ["standardization", "clustering", "Mahalanobis distance and reconstruction error"]
  },
  motivation:
    "<p>Modern ads and ML systems create wide feature tables: creative embeddings, audience summaries, campaign metrics, pacing signals, and text features can easily reach hundreds or thousands of dimensions. People cannot inspect that space directly, but many problems still ask for a human-readable map: what groups exist, what changed, and which points are strange?</p>" +
    "<p>Dimensionality reduction makes a faithful small view of the large space. PCA gives the best linear low-dimensional summary by variance; UMAP and t-SNE give nonlinear visual maps that are excellent for exploration but should not be treated as calibrated distances. Anomaly detection then asks which points are poorly reconstructed, isolated, locally rare, or far under the normal covariance shape.</p>",
  definition:
    "<p><b>Definition.</b> PCA centers data matrix $X \\in \\mathbb{R}^{n\\times d}$, computes covariance $S=\\frac{1}{n-1}X_c^\\top X_c$, and chooses eigenvectors with largest eigenvalues. The $r$-dimensional projection is</p>" +
    "$$Z=X_c W_r,$$" +
    "<p>where columns of $W_r$ are the top $r$ eigenvectors. The explained-variance ratio for component $j$ is $\\lambda_j/\\sum_{\\ell=1}^d\\lambda_{\\ell}$. An anomaly score can be reconstruction error $\\|x-\\hat{x}\\|_2^2$, Mahalanobis distance $(x-\\mu)^\\top\\Sigma^{-1}(x-\\mu)$, or a learned score from IsolationForest or Local Outlier Factor.</p>",
  symbols: [
    { sym: "$X$", desc: "the data matrix with rows as examples and columns as features." },
    { sym: "$X_c$", desc: "the centered data matrix after subtracting the column mean." },
    { sym: "$S$", desc: "the sample covariance matrix." },
    { sym: "$\\lambda_j$", desc: "variance explained by principal component $j$." },
    { sym: "$w_j$", desc: "the eigenvector direction for principal component $j$." },
    { sym: "$Z$", desc: "low-dimensional coordinates after projection." },
    { sym: "$\\|x-\\hat{x}\\|_2^2$", desc: "reconstruction error after projecting down and back up." }
  ],
  derivation: [
    { do: "Center each feature", result: "$X_c=X-\\mathbf{1}\\mu^\\top$", why: "PCA studies variation around the mean, not absolute offsets" },
    { do: "Compute covariance", result: "$S=\\frac{1}{n-1}X_c^\\top X_c$", why: "covariance records how features vary together" },
    { do: "Maximize projected variance", result: "$\\max_{\\|w\\|=1} w^\\top S w$", why: "the best one-dimensional linear view keeps as much variance as possible" },
    { do: "Use the eigenvector solution", result: "$S w=\\lambda w$", why: "the constrained maximum occurs at the top eigenvector" },
    { do: "Score a reconstruction anomaly", result: "$e(x)=\\|x-W_rW_r^\\top x\\|_2^2$ after centering", why: "normal points near the learned subspace reconstruct well; unusual points do not" }
  ],
  worked: {
    problem: "Compute PCA by hand for centered 2D points $(-1,-1)$, $(1,1)$, $(4,-4)$, and $(-4,4)$. Use the top eigenvector of the covariance matrix, compute explained variance, then flag the point with larger reconstruction error under one component.",
    skills: ["centering", "covariance", "eigenvectors", "reconstruction error"],
    strategy: "The points are already centered, so compute covariance, read eigen-directions, project to one dimension, reconstruct, and compare errors.",
    steps: [
      { do: "Check the mean", result: "$\\bar{x}=(\\frac{-1+0+1+4}{4},\\frac{-1+0+1-4}{4})=(1,-1)$ before centering; the listed centered coordinates already subtract it", why: "PCA must operate on centered values" },
      { do: "Compute sums of squares", result: "$\\sum x_1^2=18$ and $\\sum x_2^2=18$", why: "these become diagonal covariance entries after dividing by $n-1=3$" },
      { do: "Compute cross-product", result: "$\\sum x_1x_2=1+0+1-16=-14$", why: "the negative sign shows the outlying direction slopes downward" },
      { do: "Form covariance", result: "$S=\\begin{bmatrix}6 & -14/3\\-14/3 & 6\\end{bmatrix}$", why: "divide each sum by 3" },
      { do: "Find top eigenpair", result: "$w_1=\\frac{1}{\\sqrt2}(1,-1)$ with $\\lambda_1=6+14/3=10.67$", why: "a matrix with equal diagonals and negative off-diagonal has top direction $(1,-1)$" },
      { do: "Find second eigenvalue", result: "$\\lambda_2=6-14/3=1.33$", why: "the orthogonal direction $(1,1)$ captures the remaining variance" },
      { do: "Compute explained-variance ratio", result: "$21.33/(21.33+1.33)\\approx0.941$", why: "one component preserves about 94.1% of the variance" },
      { do: "Reconstruct point $(1,1)$", result: "projection on $(1,-1)/\\sqrt2$ is 0, reconstruction is $(0,0)$, error is $2$", why: "the point lies along the discarded $(1,1)$ direction" },
      { do: "Reconstruct point $(4,-4)$", result: "it lies exactly on $(1,-1)$, so error is $0$", why: "one component captures the high-variance diagonal direction" }
    ],
    verify: "The top component explains most variance, but the smaller diagonal direction still matters: $(1,1)$ is not large globally, yet it is poorly reconstructed by a one-component model.",
    answer: "The top PCA direction is $(1,-1)/\\sqrt2$, explained variance is about 88.9%, and $(1,1)$ has larger one-component reconstruction error than $(4,-4)$.",
    connects: "PCA can make an excellent visualization while reconstruction error highlights points that violate the learned low-dimensional structure."
  },
  practice: [
    {
      problem: "Eigenvalues of a covariance matrix are 9, 3, and 1. Compute the explained-variance ratio of the first two components.",
      steps: [
        { do: "Sum all eigenvalues", result: "$9+3+1=13$", why: "total variance is the sum of covariance eigenvalues" },
        { do: "Sum top two eigenvalues", result: "$9+3=12$", why: "two-component PCA keeps those two variances" },
        { do: "Divide", result: "$12/13\\approx0.923$", why: "explained-variance ratio is kept variance over total variance" }
      ],
      answer: "The first two components explain about 92.3% of the variance."
    },
    {
      problem: "A centered point projects to $z=3$ on unit vector $w=(0.6,0.8)$. Reconstruct the point from one PCA component.",
      steps: [
        { do: "Multiply scalar by vector", result: "$\\hat{x}=3(0.6,0.8)$", why: "one-component reconstruction maps the coordinate back along the component" },
        { do: "Compute coordinates", result: "$\\hat{x}=(1.8,2.4)$", why: "scale each coordinate of the unit vector" }
      ],
      answer: "The one-component reconstruction is $(1.8,2.4)$."
    },
    {
      problem: "A point has original centered vector $(2,3)$ and PCA reconstruction $(1.5,2.0)$. Compute squared reconstruction error.",
      steps: [
        { do: "Subtract reconstruction", result: "$(2,3)-(1.5,2.0)=(0.5,1.0)$", why: "error is measured in original feature space" },
        { do: "Square coordinates", result: "$0.5^2+1.0^2=0.25+1.00$", why: "squared Euclidean error sums squared residuals" },
        { do: "Add", result: "$1.25$", why: "larger values indicate poorer reconstruction" }
      ],
      answer: "The squared reconstruction error is 1.25."
    },
    {
      problem: "For diagonal covariance $\\Sigma=\\mathrm{diag}(4,1)$ and mean $(0,0)$, compute Mahalanobis distance squared for $x=(4,1)$.",
      steps: [
        { do: "Invert covariance", result: "$\\Sigma^{-1}=\\mathrm{diag}(1/4,1)$", why: "diagonal matrices invert entry by entry" },
        { do: "Scale squared coordinates", result: "$4^2/4+1^2/1=4+1$", why: "Mahalanobis distance accounts for feature variance" },
        { do: "Add", result: "$5$", why: "this is the squared distance under covariance geometry" }
      ],
      answer: "The Mahalanobis distance squared is 5."
    },
    {
      problem: "A two-dimensional UMAP plot shows two points close together. Name one valid conclusion and one invalid conclusion.",
      steps: [
        { do: "State the valid use", result: "they may be local neighbors worth inspecting", why: "UMAP is designed to preserve local neighborhood structure for visualization" },
        { do: "State the invalid use", result: "their plotted distance is not a calibrated business distance", why: "nonlinear embeddings distort global distances and densities" }
      ],
      answer: "Valid: inspect them as possible neighbors. Invalid: treat plot distance as an exact similarity score."
    }
  ],
  applications: [
    { title: "Creative Intelligence embedding maps", background: "Creative Intelligence systems often embed ad copy and image concepts into hundreds of dimensions. PCA or UMAP gives reviewers a map for browsing themes before creating supervised labels.", numbers: "If 768-dimensional creative embeddings reduce to 2 PCA components explaining 31% and 14% variance, the map preserves 45% of linear variance. That is enough for exploration, not enough to replace the original embedding for ranking." },
    { title: "Instream Ads content exploration", background: "Video inventory can be summarized by transcript, visual, and engagement features. A two-dimensional nonlinear map helps reviewers see pockets of tutorials, interviews, and promotional clips.", numbers: "From 100,000 videos, reviewing 50 nearest neighbors around each of 20 map landmarks touches 1,000 videos, or 1% of inventory. If 16 landmarks are coherent, the quick map review has an 80% landmark success rate." },
    { title: "Audience segmentation quality checks", background: "After clustering audiences, PCA helps show whether segments are separated by real feature variation or by one noisy feature. This is a diagnostic view before launch.", numbers: "If PC1 explains 52% variance and a cohort's centroid is 1.8 standard deviations above average on PC1, while another is -1.2, their separation along PC1 is 3.0 standard deviations." },
    { title: "Anomaly detection on ads metrics", background: "Daily campaign metrics such as impressions, CTR, CPC, spend, and conversions form a normal operating cloud. Outlier scores identify days worth investigating for tracking, auction, or pacing issues.", numbers: "For standardized metrics with diagonal covariance, a day at $(3,0,2,0,1)$ has squared distance $3^2+0^2+2^2+0^2+1^2=14$. In 5 dimensions, that is a much stronger flag than a day with score 4." },
    { title: "Creator Marketplace suspicious cohort shifts", background: "A creator cohort's feature distribution can drift after a product or inventory change. PCA gives a stable low-dimensional view for comparing this week to last week.", numbers: "If last week's centroid in PC space is $(0.2,-0.1)$ and this week's is $(1.4,0.5)$, the shift length is $\\sqrt{1.2^2+0.6^2}\\approx1.34$ PC units. That number is easy to track over releases." },
    { title: "Feature monitoring for model inputs", background: "PCA reconstruction error can monitor whether live feature vectors still look like training data. It catches correlated shifts that per-feature dashboards can miss.", numbers: "If the training 99th percentile reconstruction error is 2.8 and today's p99 is 5.6, the tail error doubled. A live vector with error 7.0 is $7.0/2.8=2.5\\times$ the training p99 threshold." },
    { title: "Local Outlier Factor for niche inventory", background: "Some campaigns naturally serve niche inventory, so global distance alone may overflag them. LOF compares a point with its local neighborhood, which is useful when density varies across segments.", numbers: "If a video's local reachability density is 0.25 and its neighbors average 0.75, a simple LOF-style ratio is $0.75/0.25=3.0$, suggesting the point is much sparser than its local context." }
  ],
  applicationsClose:
    "<p>Dimensionality reduction and anomaly detection are the inspection tools of high-dimensional ML systems. PCA tells you which linear directions carry variance; UMAP helps humans browse neighborhoods; anomaly scores tell you which examples deserve attention before they become incidents.</p>",
  takeaways: [
    "PCA centers data, eigen-decomposes covariance, and projects onto directions with the largest variance.",
    "Explained-variance ratio measures how much linear variance the retained components preserve.",
    "UMAP and t-SNE are visualization tools; do not treat their global distances as calibrated metrics.",
    "Anomalies can be flagged by reconstruction error, Mahalanobis distance, IsolationForest, or Local Outlier Factor depending on the geometry."
  ],
  resources: [
    { label: "UMAP docs", note: "nonlinear manifold embedding for visualization" },
    { label: "PyOD docs", note: "outlier detectors with a common API" },
    { label: "scikit-learn — decomposition & outlier detection", note: "PCA, IsolationForest, LOF" }
  ],
  papers: [
    "UMAP: Uniform Manifold Approximation and Projection (McInnes et al., 2018)"
  ],
  notebook: [
    { t: "md", src:
      "# M16 · Dimensionality reduction & anomaly detection\n\n" +
      "Curriculum · Domain 3 · Unsupervised learning\n\n" +
      "**Compress high-dimensional behavior into a useful view, then spot points that do not belong.**\n\n" +
      "We will use PCA to map synthetic ads metrics, inspect explained variance, and flag anomalies with reconstruction error and IsolationForest." },
    { t: "code", src:
      "import numpy as np\n" +
      "import matplotlib.pyplot as plt\n" +
      "from sklearn.decomposition import PCA\n" +
      "from sklearn.ensemble import IsolationForest\n" +
      "from sklearn.preprocessing import StandardScaler\n\n" +
      "rng = np.random.default_rng(16)" },
    { t: "md", src:
      "## Build high-dimensional campaign metrics\n\n" +
      "Each row is a campaign-day. The base variables create correlated impressions, clicks, spend, conversion, and creative-quality signals." },
    { t: "code", src:
      "n_normal = 500\n" +
      "latent = rng.normal(size=(n_normal, 2))\n" +
      "noise = rng.normal(scale=0.25, size=(n_normal, 6))\n\n" +
      "mix = np.array([\n" +
      "    [1.0, 0.2, 0.8, 0.1, 0.5, -0.2],\n" +
      "    [0.1, 1.0, 0.2, 0.9, -0.4, 0.6],\n" +
      "])\n\n" +
      "X_normal = latent @ mix + noise\n" +
      "X_normal = StandardScaler().fit_transform(X_normal)\n\n" +
      "print(\"normal rows:\", X_normal.shape[0])\n" +
      "print(\"features:\", X_normal.shape[1])" },
    { t: "md", src:
      "## PCA in one formula\n\n" +
      "PCA centers $X$, computes $S = \\frac{1}{n-1}X_c^\\top X_c$, and projects onto eigenvectors with the largest eigenvalues. The first two components are the best two-dimensional linear view by variance." },
    { t: "code", src:
      "pca = PCA(n_components=2, random_state=16)\n" +
      "Z = pca.fit_transform(X_normal)\n" +
      "explained = pca.explained_variance_ratio_\n\n" +
      "print(\"explained variance:\", np.round(explained, 3))\n" +
      "print(\"total kept:\", round(float(explained.sum()), 3))\n\n" +
      "assert explained.sum() > 0.65" },
    { t: "md", src:
      "## Add anomalous campaign-days\n\n" +
      "We create days with unusual spend and click patterns. A good detector should rank many of these near the top." },
    { t: "code", src:
      "anomalies = np.array([\n" +
      "    [4.5, -3.5, 4.0, -3.0, 3.5, -2.5],\n" +
      "    [5.0, -4.0, 4.5, -3.5, 4.0, -3.0],\n" +
      "    [-4.0, 4.5, -3.5, 4.0, -3.0, 3.5],\n" +
      "    [-4.5, 5.0, -4.0, 4.5, -3.5, 4.0],\n" +
      "    [0.0, 0.0, 5.0, -5.0, 0.0, 0.0],\n" +
      "])\n\n" +
      "X_all = np.vstack([X_normal, anomalies])\n" +
      "is_anomaly = np.zeros(X_all.shape[0], dtype=bool)\n" +
      "is_anomaly[-len(anomalies):] = True\n\n" +
      "print(\"total rows:\", X_all.shape[0])\n" +
      "print(\"injected anomalies:\", int(is_anomaly.sum()))" },
    { t: "md", src:
      "## Reconstruction error\n\n" +
      "If normal campaign-days lie close to a two-dimensional linear subspace, projecting down and back up should reconstruct them well. Poor reconstruction is an anomaly signal: $\\|x - \\hat{x}\\|_2^2$." },
    { t: "code", src:
      "Z_all = pca.transform(X_all)\n" +
      "X_hat = pca.inverse_transform(Z_all)\n" +
      "recon_error = np.sum((X_all - X_hat) ** 2, axis=1)\n" +
      "threshold = np.quantile(recon_error[:n_normal], 0.99)\n" +
      "flagged = recon_error > threshold\n\n" +
      "print(\"training p99 threshold:\", round(float(threshold), 3))\n" +
      "print(\"flagged injected anomalies:\", int(np.sum(flagged & is_anomaly)))\n\n" +
      "assert np.sum(flagged & is_anomaly) >= 3" },
    { t: "md", src:
      "## IsolationForest comparison\n\n" +
      "IsolationForest looks for points that are easy to isolate by random splits. It is nonlinear and often works well as a general-purpose tabular baseline." },
    { t: "code", src:
      "forest = IsolationForest(contamination=0.02, random_state=16)\n" +
      "forest.fit(X_normal)\n\n" +
      "forest_pred = forest.predict(X_all)\n" +
      "forest_flagged = forest_pred == -1\n\n" +
      "print(\"forest flagged total:\", int(forest_flagged.sum()))\n" +
      "print(\"forest flagged injected:\", int(np.sum(forest_flagged & is_anomaly)))\n\n" +
      "assert np.sum(forest_flagged & is_anomaly) >= 4" },
    { t: "md", src:
      "## Plot normal rows and injected outliers\n\n" +
      "We project the injected points into the PCA view. Points far from the cloud are obvious; points inside the cloud may still have high reconstruction error in discarded dimensions." },
    { t: "code", src:
      "fig, ax = plt.subplots(figsize=(5, 4))\n" +
      "ax.scatter(Z_all[~is_anomaly, 0], Z_all[~is_anomaly, 1], s=16, alpha=0.55, label=\"normal\")\n" +
      "ax.scatter(Z_all[is_anomaly, 0], Z_all[is_anomaly, 1], s=80, marker=\"x\", c=\"red\", label=\"injected\")\n" +
      "ax.set_xlabel(\"PC1\")\n" +
      "ax.set_ylabel(\"PC2\")\n" +
      "ax.legend()\n" +
      "ax.set_title(\"PCA view with anomalies\")\n" +
      "plt.show()" },
    { t: "md", src:
      "## Practice\n\n" +
      "1. Change PCA to 3 components. How does the reconstruction threshold move?\n" +
      "2. Lower the IsolationForest contamination to 0.01. Which injected points remain flagged?\n" +
      "3. Replace one injected anomaly with a mild point like `[1, 1, 1, 1, 1, 1]`. Does either detector flag it?\n" +
      "4. Print the largest reconstruction-error rows and inspect their original features." },
    { t: "code", src:
      "# Your turn\n" }
  ]
};

module.exports = [M15, M16];
