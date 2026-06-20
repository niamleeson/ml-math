/* =====================================================================
   PRACTICE PROBLEMS — MODULE 2 (ML), set C, HARDER tier.
   Appends to the existing easy->hard problems via concat.
   Owned ids: ml-kmeans, ml-em, ml-hierarchical, ml-pca, ml-ica,
              ml-classification-metrics, ml-roc-auc,
              ml-regression-metrics, ml-regularization.
   Schema: { q, steps:[{do, why}], answer }.
   ===================================================================== */
(function () {
  var P = window.PRACTICE;
  function add(id, probs) { P[id] = (P[id] || []).concat(probs); }

  /* ------------------------------------------------------------ */
  add("ml-kmeans", [
    { q:`<p>1D points $1, 2, 9, 10$, $k=2$, start $\\mu_1=1$, $\\mu_2=2$. Run TWO full iterations (assign then update each time). Give the final centroids.</p>`,
      steps:[
        {do:`Iter 1 assign: $1\\to\\mu_1$ (0 vs 1). $2\\to\\mu_2$ (1 vs 0). $9$: $8$ vs $7\\to\\mu_2$. $10$: $9$ vs $8\\to\\mu_2$.`, why:`Each point joins its nearest centroid.`},
        {do:`Iter 1 update: $\\mu_1=1$, $\\mu_2=\\frac{2+9+10}{3}=7$.`, why:`Move each centroid to its cluster mean.`},
        {do:`Iter 2 assign: $1\\to\\mu_1$ (0 vs 6). $2\\to\\mu_1$ (1 vs 5). $9\\to\\mu_2$ (8 vs 2). $10\\to\\mu_2$ (9 vs 3).`, why:`Re-assign with the new centroids; $2$ now jumps to cluster 1.`},
        {do:`Iter 2 update: $\\mu_1=\\frac{1+2}{2}=1.5$, $\\mu_2=\\frac{9+10}{2}=9.5$.`, why:`Average each new cluster.`}
      ],
      answer:`$\\mu_1=1.5$, $\\mu_2=9.5$ (stable; another round would not move them).` },

    { q:`<p>Continue: centroids $\\mu_1=1.5$, $\\mu_2=9.5$ on points $1,2,9,10$. Show the algorithm has converged.</p>`,
      steps:[
        {do:`Assign: $1,2\\to\\mu_1$ (closer to $1.5$). $9,10\\to\\mu_2$ (closer to $9.5$).`, why:`Convergence means the assignment stops changing.`},
        {do:`Update: $\\mu_1=\\frac{1+2}{2}=1.5$, $\\mu_2=\\frac{9+10}{2}=9.5$.`, why:`Recompute the means of the unchanged clusters.`},
        {do:`Centroids did not move.`, why:`When centroids are stable, k-means has converged.`}
      ],
      answer:`Converged: assignments and centroids are unchanged.` },

    { q:`<p>Total distortion is $J=\\sum\\lVert x-\\mu\\rVert^2$. Clusters $\\{1,2\\}$ at $\\mu_1=1.5$ and $\\{9,10\\}$ at $\\mu_2=9.5$. Find $J$.</p>`,
      steps:[
        {do:`Cluster 1: $(1-1.5)^2+(2-1.5)^2=0.25+0.25=0.5$.`, why:`Sum each point's squared distance to its own centroid.`},
        {do:`Cluster 2: $(9-9.5)^2+(10-9.5)^2=0.25+0.25=0.5$.`, why:`Same for the second cluster.`},
        {do:`Total: $0.5+0.5=1.0$.`, why:`Distortion adds the cost over all clusters.`}
      ],
      answer:`$J=1.0$.` },

    { q:`<p>Compare distortion for two clusterings of $1,2,9,10$. Clustering A: $\\{1,2\\},\\{9,10\\}$ ($J=1.0$). Clustering B: $\\{1,2,9\\},\\{10\\}$. Which is better?</p>`,
      steps:[
        {do:`B cluster 1 mean: $\\frac{1+2+9}{3}=4$. Cost: $(1-4)^2+(2-4)^2+(9-4)^2=9+4+25=38$.`, why:`Recompute the centroid and squared distances for B's big cluster.`},
        {do:`B cluster 2 is a singleton: cost $0$. So $J_B=38$.`, why:`A lone point sits on its own centroid.`},
        {do:`$J_A=1.0&lt;J_B=38$.`, why:`Lower distortion is the better clustering.`}
      ],
      answer:`A is far better ($J=1.0$ vs $38$).` },

    { q:`<p>2D, $k=2$. Points $(0,0),(0,1),(5,0),(5,1)$. Start $\\mu_1=(0,0)$, $\\mu_2=(5,1)$. One iteration. Give the new centroids.</p>`,
      steps:[
        {do:`Assign by squared distance. $(0,0)$: $0$ vs $26\\to\\mu_1$. $(0,1)$: $1$ vs $25\\to\\mu_1$.`, why:`Left points are nearer $\\mu_1$.`},
        {do:`$(5,0)$: $25$ vs $1\\to\\mu_2$. $(5,1)$: $26$ vs $0\\to\\mu_2$.`, why:`Right points are nearer $\\mu_2$.`},
        {do:`Update: $\\mu_1=(\\frac{0+0}{2},\\frac{0+1}{2})=(0,0.5)$, $\\mu_2=(5,0.5)$.`, why:`Average each coordinate within each cluster.`}
      ],
      answer:`$\\mu_1=(0,0.5)$, $\\mu_2=(5,0.5)$.` },

    { q:`<p>k-means++ seeding. First center is $x=1$ on points $1,2,3,20$. Next center is chosen with probability $\\propto D(x)^2$ (squared distance to the nearest center). Which point is most likely picked next?</p>`,
      steps:[
        {do:`$D^2$ values: $1\\to0$, $2\\to1$, $3\\to4$, $20\\to361$.`, why:`$D(x)$ is the distance to the closest existing center, here just $\\mu=1$.`},
        {do:`Probabilities $\\propto 0,1,4,361$; total $=366$. $P(20)=\\frac{361}{366}\\approx0.99$.`, why:`Normalize the squared distances into probabilities.`},
        {do:`$20$ dominates.`, why:`k-means++ favors far-away points to spread centers out.`}
      ],
      answer:`Point $20$ (chance $\\approx0.99$) — k-means++ spreads centers apart.` },

    { q:`<p>Bad initialization can trap k-means. Points $0,1,2,3$, $k=2$, start $\\mu_1=1$, $\\mu_2=2$. Run to convergence and report the (locally) final clusters.</p>`,
      steps:[
        {do:`Assign: $0,1\\to\\mu_1$ ($\\mu_1$ nearer). $2,3\\to\\mu_2$.`, why:`Split at the midpoint $1.5$.`},
        {do:`Update: $\\mu_1=\\frac{0+1}{2}=0.5$, $\\mu_2=\\frac{2+3}{2}=2.5$.`, why:`Average each cluster.`},
        {do:`Re-assign: $0,1\\to\\mu_1$, $2,3\\to\\mu_2$ (split still at $1.5$); centroids unchanged.`, why:`No point crosses, so it has converged.`}
      ],
      answer:`Clusters $\\{0,1\\}$ and $\\{2,3\\}$ with $\\mu_1=0.5$, $\\mu_2=2.5$.` },

    { q:`<p>Elbow method. Distortion vs $k$: $k{=}1\\to100$, $k{=}2\\to30$, $k{=}3\\to25$, $k{=}4\\to23$. Where is the elbow?</p>`,
      steps:[
        {do:`Drops: $1\\to2$ saves $70$; $2\\to3$ saves $5$; $3\\to4$ saves $2$.`, why:`The elbow is where added clusters stop helping much.`},
        {do:`The big drop ends at $k=2$; later drops are tiny.`, why:`After the elbow, distortion falls only marginally.`}
      ],
      answer:`Elbow at $k=2$.` },

    { q:`<p>1D points $2,3,4,10,11,12$, $k=2$, start $\\mu_1=2$, $\\mu_2=3$. Run two iterations. Give final centroids and distortion.</p>`,
      steps:[
        {do:`Iter 1 assign: $2\\to\\mu_1$; $3,4,10,11,12$ are nearer $\\mu_2=3$ (e.g. $4$: $|4-2|=2$ vs $|4-3|=1$). So cluster 1 $=\\{2\\}$, cluster 2 $=\\{3,4,10,11,12\\}$.`, why:`Assign each point to its nearest centroid.`},
        {do:`Iter 1 update: $\\mu_1=2$, $\\mu_2=\\frac{3+4+10+11+12}{5}=8$.`, why:`Average each cluster.`},
        {do:`Iter 2 assign: $2,3,4\\to\\mu_1=2$ (nearer than $8$); $10,11,12\\to\\mu_2=8$. Update: $\\mu_1=\\frac{2+3+4}{3}=3$, $\\mu_2=\\frac{10+11+12}{3}=11$.`, why:`Re-split, then average.`},
        {do:`Distortion: cluster 1 $=(2-3)^2+0+(4-3)^2=2$; cluster 2 $=(10-11)^2+0+(12-11)^2=2$; $J=4$.`, why:`Sum squared distances to each centroid.`}
      ],
      answer:`$\\mu_1=3$, $\\mu_2=11$; $J=4$.` },

    { q:`<p>Standardization changes clusters. A 2D point differs from a centroid by $(\\Delta x,\\Delta y)=(10,1)$. Feature $x$ has std $10$, feature $y$ has std $1$. Compare raw vs standardized squared distance.</p>`,
      steps:[
        {do:`Raw squared distance: $10^2+1^2=101$ — $x$ dominates.`, why:`Without scaling, the large-range feature controls the distance.`},
        {do:`Standardize: divide each gap by its std: $(\\frac{10}{10},\\frac{1}{1})=(1,1)$.`, why:`Standardizing puts features on a common scale.`},
        {do:`Standardized squared distance: $1^2+1^2=2$ — now both count equally.`, why:`Scaling stops one unit-heavy feature from dominating k-means.`}
      ],
      answer:`Raw $=101$ ($x$ dominates); standardized $=2$ (features balanced).` }
  ]);

  /* ------------------------------------------------------------ */
  add("ml-em", [
    { q:`<p>1D Gaussian density is $\\frac{1}{\\sqrt{2\\pi}\\sigma}e^{-(x-\\mu)^2/(2\\sigma^2)}$. Two clusters share $\\sigma=1$, equal weights. Point $x=1$, $\\mu_A=0$, $\\mu_B=2$. Find the responsibility to A. (The $\\frac{1}{\\sqrt{2\\pi}}$ cancels.)</p>`,
      steps:[
        {do:`Exponents: A gives $e^{-(1-0)^2/2}=e^{-0.5}$; B gives $e^{-(1-2)^2/2}=e^{-0.5}$.`, why:`Equal $\\sigma$ and equal distance to each mean give equal density.`},
        {do:`Both densities equal, weights equal, so $r_A=\\frac{e^{-0.5}}{e^{-0.5}+e^{-0.5}}=\\frac{1}{2}$.`, why:`Normalize weight times density across clusters.`}
      ],
      answer:`$r_A=0.5$ — the point sits exactly between the two means.` },

    { q:`<p>Same setup ($\\sigma=1$, equal weights), now $x=0.5$, $\\mu_A=0$, $\\mu_B=2$. Find the responsibility to A. Use $e^{-0.125}\\approx0.882$, $e^{-1.125}\\approx0.325$.</p>`,
      steps:[
        {do:`A exponent: $-(0.5-0)^2/2=-0.125$, density $\\propto0.882$. B exponent: $-(0.5-2)^2/2=-1.125$, density $\\propto0.325$.`, why:`Closer mean gives larger Gaussian density.`},
        {do:`$r_A=\\frac{0.882}{0.882+0.325}=\\frac{0.882}{1.207}\\approx0.73$.`, why:`Normalize the two densities.`}
      ],
      answer:`$r_A\\approx0.73$ — leans toward the nearer mean A.` },

    { q:`<p>Unequal mixing weights. $\\pi_A=0.7$, $\\pi_B=0.3$. Densities at the point: $A=0.2$, $B=0.4$. Find the responsibility to A.</p>`,
      steps:[
        {do:`Weighted: A $=0.7\\times0.2=0.14$; B $=0.3\\times0.4=0.12$.`, why:`Responsibility uses prior weight times density.`},
        {do:`$r_A=\\frac{0.14}{0.14+0.12}=\\frac{0.14}{0.26}\\approx0.538$.`, why:`Normalize by the sum of weighted terms.`}
      ],
      answer:`$r_A\\approx0.54$ — the prior tips the closer call toward A.` },

    { q:`<p>Full M-step for a mean over two points. $x_1=2$ with $r_A=0.9$; $x_2=8$ with $r_A=0.4$. Update $\\mu_A=\\frac{\\sum r_i x_i}{\\sum r_i}$.</p>`,
      steps:[
        {do:`Weighted sum: $0.9\\times2+0.4\\times8=1.8+3.2=5.0$.`, why:`Each point counts in proportion to its responsibility.`},
        {do:`Total weight: $0.9+0.4=1.3$.`, why:`Divide by the soft count, not the point count.`},
        {do:`$\\mu_A=\\frac{5.0}{1.3}\\approx3.85$.`, why:`This is the responsibility-weighted mean.`}
      ],
      answer:`$\\mu_A\\approx3.85$.` },

    { q:`<p>M-step variance (1D). $\\mu_A=3.85$, points $x_1=2$ ($r_A=0.9$), $x_2=8$ ($r_A=0.4$). Compute $\\sigma_A^2=\\frac{\\sum r_i (x_i-\\mu_A)^2}{\\sum r_i}$.</p>`,
      steps:[
        {do:`Deviations: $(2-3.85)^2=3.42$, $(8-3.85)^2=17.22$.`, why:`Variance uses squared distances from the updated mean.`},
        {do:`Weighted: $0.9\\times3.42+0.4\\times17.22=3.08+6.89=9.97$.`, why:`Weight each squared deviation by its responsibility.`},
        {do:`Divide by $\\sum r=1.3$: $\\frac{9.97}{1.3}\\approx7.67$.`, why:`Normalize by the soft count.`}
      ],
      answer:`$\\sigma_A^2\\approx7.67$.` },

    { q:`<p>Two rounds of responsibilities for one point. Round 1 weights $\\pi_A=0.5$ give $r_A=0.6$. Round 2 the M-step raises $\\pi_A$ to $0.8$ but densities stay $A=0.3$, $B=0.45$. Recompute $r_A$.</p>`,
      steps:[
        {do:`Round 2 weighted: A $=0.8\\times0.3=0.24$; B $=0.2\\times0.45=0.09$.`, why:`Plug the new mixing weight into weight times density.`},
        {do:`$r_A=\\frac{0.24}{0.24+0.09}=\\frac{0.24}{0.33}\\approx0.727$.`, why:`Normalize.`},
        {do:`$0.727&gt;0.6$.`, why:`A's larger prior pulled the responsibility up between rounds.`}
      ],
      answer:`$r_A\\approx0.73$, up from $0.6$ as A's weight grew.` },

    { q:`<p>Update all three mixing weights. Soft counts (summed responsibilities) over $m=10$ points are $N_A=5$, $N_B=3$, $N_C=2$. Find the new mixing weights.</p>`,
      steps:[
        {do:`$\\pi_k=\\frac{N_k}{m}$. $\\pi_A=\\frac{5}{10}=0.5$.`, why:`Each weight is the cluster's soft count over the point total.`},
        {do:`$\\pi_B=\\frac{3}{10}=0.3$, $\\pi_C=\\frac{2}{10}=0.2$.`, why:`Same for the others.`},
        {do:`Check: $0.5+0.3+0.2=1.0$.`, why:`Mixing weights must sum to $1$.`}
      ],
      answer:`$\\pi_A=0.5$, $\\pi_B=0.3$, $\\pi_C=0.2$.` },

    { q:`<p>Log-likelihood for one point. Weighted densities are A $=0.14$, B $=0.12$. The point's likelihood is their sum. Find its log-likelihood. Use $\\ln(0.26)\\approx-1.347$.</p>`,
      steps:[
        {do:`Mixture likelihood: $p(x)=\\sum_k \\pi_k\\, \\text{density}_k=0.14+0.12=0.26$.`, why:`The marginal likelihood sums weighted densities over clusters.`},
        {do:`$\\ln(0.26)\\approx-1.347$.`, why:`Log-likelihood is the log of that mixture probability.`}
      ],
      answer:`Log-likelihood $\\approx-1.347$.` },

    { q:`<p>EM monotonicity check across four rounds: $-30, -25, -24.5, -25$. Something is wrong. Which step is impossible and why?</p>`,
      steps:[
        {do:`Rounds 1-3 rise: $-30\\to-25\\to-24.5$.`, why:`EM never decreases the log-likelihood.`},
        {do:`Round 3 to 4 falls: $-24.5\\to-25$.`, why:`A drop violates EM's guarantee, so it signals a bug (or numerical error).`}
      ],
      answer:`The $-24.5\\to-25$ drop is impossible; EM log-likelihood must be non-decreasing.` },

    { q:`<p>Hard-EM limit. A point has weighted densities A $=0.98$, B $=0.02$. Give the soft responsibilities, then the hard (k-means-style) assignment, and the difference in M-step effect.</p>`,
      steps:[
        {do:`Soft: $r_A=\\frac{0.98}{1.0}=0.98$, $r_B=0.02$.`, why:`Normalize weighted densities.`},
        {do:`Hard: round to $r_A=1$, $r_B=0$.`, why:`Hard EM (k-means) assigns the point fully to the winner.`},
        {do:`M-step effect: soft adds $0.02$ of the point to B's mean and variance; hard adds nothing.`, why:`The small soft weight still nudges B, while a hard split ignores it.`}
      ],
      answer:`Soft $(0.98,0.02)$ vs hard $(1,0)$; hard EM discards B's $0.02$ share entirely.` }
  ]);

  /* ------------------------------------------------------------ */
  add("ml-hierarchical", [
    { q:`<p>Distance matrix on $A,B,C,D$: $AB{=}2$, $AC{=}6$, $AD{=}10$, $BC{=}5$, $BD{=}9$, $CD{=}4$. Single linkage. Give the first merge, then the updated distances from $\\{A,B\\}$ to $C$ and $D$.</p>`,
      steps:[
        {do:`Smallest entry is $AB=2$, so merge $A,B$.`, why:`Single linkage merges the closest pair first.`},
        {do:`$d(\\{A,B\\},C)=\\min(AC,BC)=\\min(6,5)=5$.`, why:`Single linkage keeps the nearer member distance.`},
        {do:`$d(\\{A,B\\},D)=\\min(AD,BD)=\\min(10,9)=9$.`, why:`Same minimum rule for D.`}
      ],
      answer:`Merge $\\{A,B\\}$; then $d(\\{A,B\\},C)=5$, $d(\\{A,B\\},D)=9$.` },

    { q:`<p>Continue the previous single-linkage run. Current clusters $\\{A,B\\}, C, D$ with $d(\\{A,B\\},C)=5$, $d(\\{A,B\\},D)=9$, $CD=4$. What merges next, and at what height?</p>`,
      steps:[
        {do:`Compare current distances: $5$, $9$, $CD=4$.`, why:`Pick the smallest remaining linkage distance.`},
        {do:`Smallest is $CD=4$, so merge $C,D$ at height $4$.`, why:`That pair is closest now.`}
      ],
      answer:`Merge $\\{C,D\\}$ at height $4$.` },

    { q:`<p>Finish the run. Clusters $\\{A,B\\}$ and $\\{C,D\\}$, with original $d(\\{A,B\\},C)=5$, $d(\\{A,B\\},D)=9$. Single linkage. Final merge height?</p>`,
      steps:[
        {do:`$d(\\{A,B\\},\\{C,D\\})=\\min(5,9)=5$.`, why:`Single linkage between two clusters is the closest cross-pair.`},
        {do:`Merge at height $5$.`, why:`That is the last merge, joining everything.`}
      ],
      answer:`Final merge at height $5$; dendrogram heights are $2, 4, 5$.` },

    { q:`<p>Same matrix ($AB{=}2$, $AC{=}6$, $AD{=}10$, $BC{=}5$, $BD{=}9$, $CD{=}4$) but COMPLETE linkage. First merge is still $\\{A,B\\}$ at $2$. Find complete-linkage $d(\\{A,B\\},C)$ and $d(\\{A,B\\},D)$.</p>`,
      steps:[
        {do:`$d(\\{A,B\\},C)=\\max(AC,BC)=\\max(6,5)=6$.`, why:`Complete linkage uses the farthest member distance.`},
        {do:`$d(\\{A,B\\},D)=\\max(AD,BD)=\\max(10,9)=10$.`, why:`Take the maximum for D too.`}
      ],
      answer:`$d(\\{A,B\\},C)=6$, $d(\\{A,B\\},D)=10$ (larger than single linkage).` },

    { q:`<p>Average linkage. Cluster $\\{1,3\\}$ and cluster $\\{8,10\\}$. Compute the average-linkage distance (mean of all cross pairs).</p>`,
      steps:[
        {do:`Cross distances: $|1-8|=7$, $|1-10|=9$, $|3-8|=5$, $|3-10|=7$.`, why:`Average linkage averages every pair between the two clusters.`},
        {do:`Mean: $\\frac{7+9+5+7}{4}=\\frac{28}{4}=7$.`, why:`Sum the four distances and divide by $4$.`}
      ],
      answer:`Average-linkage distance $=7$.` },

    { q:`<p>Linkage changes the tree. Points $1,2,4,8$. With SINGLE linkage, list the merge heights.</p>`,
      steps:[
        {do:`Closest pair: $1$-$2$ at $1$. Merge $\\{1,2\\}$.`, why:`Single linkage merges the nearest pair.`},
        {do:`Now $d(\\{1,2\\},4)=\\min(3,2)=2$, $d(4,8)=4$. Merge $\\{1,2\\}$ with $4$ at height $2$.`, why:`Nearest member of $\\{1,2\\}$ to $4$ is $2$.`},
        {do:`Last: $d(\\{1,2,4\\},8)=\\min(7,6,4)=4$. Merge at $4$.`, why:`Closest member ($4$) to $8$.`}
      ],
      answer:`Heights $1, 2, 4$.` },

    { q:`<p>Same points $1,2,4,8$ with COMPLETE linkage. List the merge heights and contrast with single linkage.</p>`,
      steps:[
        {do:`Merge $\\{1,2\\}$ at $1$. Then $d(\\{1,2\\},4)=\\max(3,2)=3$, $d(4,8)=4$.`, why:`Complete linkage uses farthest-member distances.`},
        {do:`Smallest is $3$, merge $\\{1,2\\}$ with $4$ at height $3$.`, why:`$3&lt;4$, so $4$ joins $\\{1,2\\}$.`},
        {do:`Last: $d(\\{1,2,4\\},8)=\\max(7,6,4)=7$. Merge at $7$.`, why:`Farthest member ($1$) to $8$.`}
      ],
      answer:`Heights $1, 3, 7$ — higher than single linkage's $1,2,4$.` },

    { q:`<p>A dendrogram has merge heights $1, 2, 3, 8$ over $5$ points. Cut to get exactly $2$ clusters. What height range works, and how many clusters does a cut at height $2.5$ give?</p>`,
      steps:[
        {do:`$5$ points, $4$ merges. To get $2$ clusters, cut above the third merge ($3$) but below the top ($8$).`, why:`Cutting between heights $3$ and $8$ undoes only the top merge.`},
        {do:`So cut anywhere in $(3,8)$ for $2$ clusters.`, why:`That leaves the two top subtrees separate.`},
        {do:`A cut at $2.5$ is below merges at $3$ and $8$, so it undoes both: $3$ clusters.`, why:`Each merge above the cut line is severed.`}
      ],
      answer:`Cut in $(3,8)$ for $2$ clusters; a cut at $2.5$ yields $3$ clusters.` },

    { q:`<p>Ward-style cost: merging clusters of means $\\mu_1, \\mu_2$ with sizes $n_1, n_2$ adds $\\frac{n_1 n_2}{n_1+n_2}\\lVert\\mu_1-\\mu_2\\rVert^2$. Merge singleton $\\{2\\}$ with singleton $\\{6\\}$ (1D). Find the merge cost.</p>`,
      steps:[
        {do:`$n_1=n_2=1$, so $\\frac{1\\cdot1}{1+1}=\\frac{1}{2}$.`, why:`Plug the sizes into the Ward weight.`},
        {do:`$\\lVert2-6\\rVert^2=16$. Cost $=\\frac{1}{2}\\times16=8$.`, why:`Multiply the weight by the squared mean gap.`}
      ],
      answer:`Ward merge cost $=8$.` },

    { q:`<p>Ward again. Merge cluster $\\{0,2\\}$ (mean $1$, size $2$) with singleton $\\{8\\}$ (mean $8$, size $1$). Find the merge cost.</p>`,
      steps:[
        {do:`Weight: $\\frac{n_1 n_2}{n_1+n_2}=\\frac{2\\cdot1}{2+1}=\\frac{2}{3}$.`, why:`Use the cluster sizes $2$ and $1$.`},
        {do:`$\\lVert1-8\\rVert^2=49$.`, why:`Squared distance between the two cluster means.`},
        {do:`Cost $=\\frac{2}{3}\\times49\\approx32.67$.`, why:`Ward merges the pair with the smallest such cost.`}
      ],
      answer:`Ward merge cost $\\approx32.67$.` }
  ]);

  /* ------------------------------------------------------------ */
  add("ml-pca", [
    { q:`<p>Two features over $m=3$ examples, columns $x=(1,2,3)$, $y=(1,3,5)$. Center each, then build the covariance entries via $\\frac{1}{m}\\sum$ on centered data.</p>`,
      steps:[
        {do:`Means: $\\bar x=2$, $\\bar y=3$. Centered $x=(-1,0,1)$, $y=(-2,0,2)$.`, why:`PCA centers each feature before forming covariance.`},
        {do:`$\\text{Var}(x)=\\frac{1+0+1}{3}=\\frac{2}{3}$, $\\text{Var}(y)=\\frac{4+0+4}{3}=\\frac{8}{3}$.`, why:`Diagonal entries are each feature's variance.`},
        {do:`$\\text{Cov}(x,y)=\\frac{(-1)(-2)+0+(1)(2)}{3}=\\frac{4}{3}$.`, why:`Off-diagonal entries average the products of centered pairs.`}
      ],
      answer:`$\\Sigma=\\frac{1}{3}\\begin{bmatrix}2&4\\\\4&8\\end{bmatrix}=\\begin{bmatrix}0.67&1.33\\\\1.33&2.67\\end{bmatrix}$.` },

    { q:`<p>For $\\Sigma=\\begin{bmatrix}2&4\\\\4&8\\end{bmatrix}$ find the eigenvalues. (This is the un-normalized covariance from the prior problem, scaled by $3$.)</p>`,
      steps:[
        {do:`$\\det(\\Sigma-\\lambda I)=(2-\\lambda)(8-\\lambda)-16$.`, why:`Characteristic polynomial of a $2\\times2$.`},
        {do:`Expand: $\\lambda^2-10\\lambda+16-16=\\lambda^2-10\\lambda=\\lambda(\\lambda-10)$.`, why:`Multiply out and simplify.`},
        {do:`Roots: $\\lambda=0$ and $\\lambda=10$.`, why:`Set each factor to zero.`}
      ],
      answer:`Eigenvalues $\\lambda=10$ and $\\lambda=0$ (the data lies on a line).` },

    { q:`<p>From the previous result, $\\Sigma=\\begin{bmatrix}2&4\\\\4&8\\end{bmatrix}$ has one zero eigenvalue. What fraction of variance does PC1 explain, and what does $\\lambda_2=0$ mean?</p>`,
      steps:[
        {do:`Total variance $=10+0=10$. PC1 share $=\\frac{10}{10}=1.0$.`, why:`Variance explained is each eigenvalue over the sum.`},
        {do:`$\\lambda_2=0$ means no spread in the second direction.`, why:`A zero eigenvalue means the data is perfectly $1$-dimensional.`}
      ],
      answer:`PC1 explains $100\\%$; $\\lambda_2=0$ means the points lie exactly on a line.` },

    { q:`<p>Find the top eigenvector of $\\Sigma=\\begin{bmatrix}2&4\\\\4&8\\end{bmatrix}$ for $\\lambda=10$, then normalize it to unit length.</p>`,
      steps:[
        {do:`$(\\Sigma-10I)v=\\begin{bmatrix}-8&4\\\\4&-2\\end{bmatrix}v=0$ gives $-8v_1+4v_2=0$, so $v_2=2v_1$.`, why:`The eigenvector solves $(\\Sigma-\\lambda I)v=0$.`},
        {do:`Take $v=[1,2]$. Length $=\\sqrt{1^2+2^2}=\\sqrt5$.`, why:`Pick a representative direction, then measure its norm.`},
        {do:`Unit vector: $\\frac{1}{\\sqrt5}[1,2]\\approx[0.447,0.894]$.`, why:`Divide by the norm so the principal axis has length $1$.`}
      ],
      answer:`Top eigenvector $\\approx[0.447,\\,0.894]$ (direction $[1,2]$).` },

    { q:`<p>Project a centered point $(1,2)$ onto the unit PC1 direction $u=\\frac{1}{\\sqrt5}[1,2]$. Find the scalar score $u^\\top x$.</p>`,
      steps:[
        {do:`$u^\\top x=\\frac{1}{\\sqrt5}(1\\cdot1+2\\cdot2)=\\frac{5}{\\sqrt5}$.`, why:`The PCA score is the dot product of the unit axis with the point.`},
        {do:`$\\frac{5}{\\sqrt5}=\\sqrt5\\approx2.236$.`, why:`Simplify $5/\\sqrt5=\\sqrt5$.`}
      ],
      answer:`Score $=\\sqrt5\\approx2.24$.` },

    { q:`<p>Eigenvalues $\\lambda=5,3,1.5,0.5$. To retain at least $90\\%$ of variance, how many components do you keep?</p>`,
      steps:[
        {do:`Total $=5+3+1.5+0.5=10$.`, why:`Sum all eigenvalues for total variance.`},
        {do:`Cumulative: $5(50\\%)$, $8(80\\%)$, $9.5(95\\%)$.`, why:`Add eigenvalues from largest down and track the running fraction.`},
        {do:`$95\\%\\ge90\\%$ is first reached at $3$ components.`, why:`Keep the fewest components clearing the threshold.`}
      ],
      answer:`Keep $3$ components ($95\\%\\ge90\\%$).` },

    { q:`<p>$\\Sigma=\\begin{bmatrix}3&1\\\\1&3\\end{bmatrix}$. Find both eigenvalues and the variance explained by PC1.</p>`,
      steps:[
        {do:`$(3-\\lambda)^2-1=0\\Rightarrow 3-\\lambda=\\pm1$, so $\\lambda=2$ or $4$.`, why:`Solve the characteristic equation of the symmetric $2\\times2$.`},
        {do:`Total $=2+4=6$.`, why:`Sum of eigenvalues equals the trace $3+3=6$.`},
        {do:`PC1 share $=\\frac{4}{6}\\approx0.667$.`, why:`Largest eigenvalue over the total.`}
      ],
      answer:`Eigenvalues $4$ and $2$; PC1 explains $\\approx66.7\\%$.` },

    { q:`<p>$\\Sigma=\\begin{bmatrix}5&2\\\\2&2\\end{bmatrix}$. Find the eigenvalues using the trace and determinant.</p>`,
      steps:[
        {do:`Trace $=5+2=7$ (sum of $\\lambda$); $\\det=5\\cdot2-2\\cdot2=6$ (product).`, why:`For $2\\times2$, eigenvalues sum to the trace and multiply to the determinant.`},
        {do:`Solve $\\lambda^2-7\\lambda+6=0$: $(\\lambda-6)(\\lambda-1)=0$.`, why:`Build the characteristic quadratic from trace and determinant.`},
        {do:`$\\lambda=6$ and $\\lambda=1$.`, why:`Factor and read the roots.`}
      ],
      answer:`Eigenvalues $\\lambda=6$ and $\\lambda=1$.` },

    { q:`<p>PCA needs orthogonal eigenvectors. For $\\Sigma=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$, the eigenvectors are $[1,1]$ ($\\lambda=3$) and $[1,-1]$ ($\\lambda=1$). Verify they are orthogonal.</p>`,
      steps:[
        {do:`Dot product: $[1,1]\\cdot[1,-1]=1\\cdot1+1\\cdot(-1)=0$.`, why:`Orthogonal vectors have a zero dot product.`},
        {do:`A zero dot product confirms a right angle.`, why:`Symmetric covariance matrices always have orthogonal eigenvectors.`}
      ],
      answer:`Dot product $=0$, so the principal axes are orthogonal.` },

    { q:`<p>Reconstruction error equals the dropped eigenvalues. Eigenvalues $\\lambda=8,4,2,1$. You keep the top $2$. What fraction of variance is LOST?</p>`,
      steps:[
        {do:`Total $=8+4+2+1=15$. Dropped $=2+1=3$.`, why:`Lost variance is the sum of the discarded eigenvalues.`},
        {do:`Fraction lost $=\\frac{3}{15}=0.2$.`, why:`Divide dropped variance by total variance.`}
      ],
      answer:`$20\\%$ of variance is lost (kept $80\\%$).` }
  ]);

  /* ------------------------------------------------------------ */
  add("ml-ica", [
    { q:`<p>Mixing $A=\\begin{bmatrix}3&1\\\\1&2\\end{bmatrix}$. Find the unmixing matrix $W=A^{-1}$.</p>`,
      steps:[
        {do:`$\\det=3\\cdot2-1\\cdot1=5$.`, why:`The $2\\times2$ inverse divides by the determinant.`},
        {do:`$W=\\frac{1}{5}\\begin{bmatrix}2&-1\\\\-1&3\\end{bmatrix}=\\begin{bmatrix}0.4&-0.2\\\\-0.2&0.6\\end{bmatrix}$.`, why:`Swap the diagonal, negate the off-diagonal, divide by $\\det$.`}
      ],
      answer:`$W=\\begin{bmatrix}0.4&-0.2\\\\-0.2&0.6\\end{bmatrix}$.` },

    { q:`<p>Using $W=\\begin{bmatrix}0.4&-0.2\\\\-0.2&0.6\\end{bmatrix}$, recordings $x_1=10$, $x_2=5$. Recover the sources, then verify with $A=\\begin{bmatrix}3&1\\\\1&2\\end{bmatrix}$.</p>`,
      steps:[
        {do:`$s_1=0.4(10)-0.2(5)=4-1=3$. $s_2=-0.2(10)+0.6(5)=-2+3=1$.`, why:`Apply $W$ to the recordings: $s=Wx$.`},
        {do:`Check: $As=\\begin{bmatrix}3\\cdot3+1\\cdot1\\\\1\\cdot3+2\\cdot1\\end{bmatrix}=\\begin{bmatrix}10\\\\5\\end{bmatrix}=x$.`, why:`Re-mixing the recovered sources must reproduce $x$.`}
      ],
      answer:`$s_1=3$, $s_2=1$ (verified by $As=x$).` },

    { q:`<p>Whitening is a PCA pre-step for ICA. A whitened variable has variance $1$. If a centered signal has variance $4$, what scale makes it variance $1$?</p>`,
      steps:[
        {do:`Variance scales by the square of the factor: $\\text{Var}(c\\,s)=c^2\\,\\text{Var}(s)$.`, why:`Scaling a signal by $c$ multiplies its variance by $c^2$.`},
        {do:`Need $c^2\\cdot4=1$, so $c=\\frac{1}{2}$.`, why:`Solve for the factor that gives unit variance.`}
      ],
      answer:`Scale by $\\frac{1}{2}$ (i.e. divide by the std $\\sqrt4=2$).` },

    { q:`<p>ICA maximizes non-Gaussianity via kurtosis. A Gaussian has excess kurtosis $0$. Signal P has excess kurtosis $+3$, signal Q has $-1$. Which is "more non-Gaussian" by magnitude?</p>`,
      steps:[
        {do:`Non-Gaussianity uses $|\\text{kurtosis}|$: $|+3|=3$ vs $|-1|=1$.`, why:`Both positive (super-Gaussian) and negative (sub-Gaussian) count; magnitude matters.`},
        {do:`$3&gt;1$, so P is more non-Gaussian.`, why:`ICA prefers directions with larger absolute kurtosis.`}
      ],
      answer:`P (excess kurtosis $3$) is more non-Gaussian than Q.` },

    { q:`<p>Mixing $A=\\begin{bmatrix}2&1\\\\4&3\\end{bmatrix}$. Recordings $x_1=8$, $x_2=18$. Recover the sources.</p>`,
      steps:[
        {do:`$\\det=2\\cdot3-1\\cdot4=2$. $W=\\frac{1}{2}\\begin{bmatrix}3&-1\\\\-4&2\\end{bmatrix}=\\begin{bmatrix}1.5&-0.5\\\\-2&1\\end{bmatrix}$.`, why:`Invert $A$ with the $2\\times2$ formula.`},
        {do:`$s_1=1.5(8)-0.5(18)=12-9=3$.`, why:`Apply the first row of $W$.`},
        {do:`$s_2=-2(8)+1(18)=-16+18=2$.`, why:`Apply the second row of $W$.`}
      ],
      answer:`$s_1=3$, $s_2=2$.` },

    { q:`<p>Permutation ambiguity. True sources are $s=(\\text{music},\\text{voice})$, but ICA outputs them in the order $(\\text{voice},\\text{music})$. Which "ambiguity" is this, and does it break the unmixing?</p>`,
      steps:[
        {do:`Swapping the output order is the permutation ambiguity.`, why:`ICA recovers the sources but cannot label which is which.`},
        {do:`The signals themselves are still correctly separated.`, why:`Order does not affect the content, only the labeling.`}
      ],
      answer:`Permutation ambiguity — the sources are recovered, just relabeled, so unmixing still works.` },

    { q:`<p>Sign ambiguity. True source is $s_1=[2,-3,1]$ but ICA returns $[-2,3,-1]$. What did ICA do, and why is it acceptable?</p>`,
      steps:[
        {do:`Output $=-1\\times$ truth: every value is negated.`, why:`ICA can flip a source's sign because $A$ and $s$ can both absorb a $-1$.`},
        {do:`A sign flip preserves the signal's shape and independence.`, why:`Flipping the sign keeps the waveform's information intact.`}
      ],
      answer:`A sign flip (scale by $-1$); acceptable since ICA recovers sources only up to sign and scale.` },

    { q:`<p>The unmixing must be invertible. Mixing $A=\\begin{bmatrix}1&2\\\\2&4\\end{bmatrix}$. Can you recover the sources? Show why or why not.</p>`,
      steps:[
        {do:`$\\det=1\\cdot4-2\\cdot2=4-4=0$.`, why:`A zero determinant means no inverse exists.`},
        {do:`The rows are proportional ($[2,4]=2\\times[1,2]$), so $A$ is singular.`, why:`The two recordings carry the same mixed information.`}
      ],
      answer:`No — $\\det A=0$, so $A$ is singular and the sources cannot be recovered.` },

    { q:`<p>$3\\times3$ diagonal mixing $A=\\text{diag}(2,5,10)$. Recordings $x=(6,15,40)$. Recover $s$.</p>`,
      steps:[
        {do:`Diagonal inverse reciprocates the diagonal: $W=\\text{diag}(\\frac12,\\frac15,\\frac1{10})$.`, why:`A diagonal matrix inverts entry by entry.`},
        {do:`$s_1=\\frac{6}{2}=3$, $s_2=\\frac{15}{5}=3$, $s_3=\\frac{40}{10}=4$.`, why:`Apply $W$ to each recording.`}
      ],
      answer:`$s=(3,3,4)$.` },

    { q:`<p>Center then unmix. Recording column $x_1$ has values $(4,6,8)$ with mean $6$. ICA assumes zero-mean inputs. Center it, and explain why centering precedes unmixing.</p>`,
      steps:[
        {do:`Subtract the mean $6$: $(4-6,6-6,8-6)=(-2,0,2)$.`, why:`ICA models sources as zero-mean, so centering is required first.`},
        {do:`A nonzero mean would corrupt the independence/whitening estimates.`, why:`Statistics like covariance and kurtosis assume centered data.`}
      ],
      answer:`Centered to $(-2,0,2)$; centering is needed so the independence statistics are valid.` }
  ]);

  /* ------------------------------------------------------------ */
  add("ml-classification-metrics", [
    { q:`<p>Imbalanced data: $1000$ negatives, $20$ positives. The model flags $40$ as positive, of which $15$ are truly positive. Find precision, recall, and F1.</p>`,
      steps:[
        {do:`TP$=15$, FP$=40-15=25$, FN$=20-15=5$.`, why:`Of $40$ flagged, $15$ are right (TP) and $25$ wrong (FP); $5$ real positives were missed (FN).`},
        {do:`Precision $=\\frac{15}{15+25}=\\frac{15}{40}=0.375$; recall $=\\frac{15}{15+5}=\\frac{15}{20}=0.75$.`, why:`Precision over flagged, recall over real positives.`},
        {do:`F1 $=\\frac{2\\cdot0.375\\cdot0.75}{0.375+0.75}=\\frac{0.5625}{1.125}=0.5$.`, why:`Harmonic mean of precision and recall.`}
      ],
      answer:`Precision $=0.375$, recall $=0.75$, F1 $=0.5$.` },

    { q:`<p>Same imbalanced problem ($1000$ neg, $20$ pos), TP$=15$, FP$=25$, FN$=5$, TN$=975$. Find accuracy, then explain why it is misleading.</p>`,
      steps:[
        {do:`Accuracy $=\\frac{TP+TN}{\\text{all}}=\\frac{15+975}{1020}=\\frac{990}{1020}\\approx0.97$.`, why:`Accuracy is all correct over the total.`},
        {do:`The huge TN count inflates accuracy.`, why:`With $1000$ negatives, getting negatives right dominates.`},
        {do:`Yet recall is only $0.75$ and precision $0.375$.`, why:`Accuracy hides poor performance on the rare positive class.`}
      ],
      answer:`Accuracy $\\approx0.97$, but it is misleading — F1 ($0.5$) reveals weak positive-class performance.` },

    { q:`<p>Threshold effect. Raising the threshold reclassifies $10$ borderline points from "positive" to "negative"; $3$ were true positives and $7$ true negatives. Old counts: TP$=30$, FP$=20$, FN$=10$, TN$=40$. Find the new precision and recall.</p>`,
      steps:[
        {do:`New TP $=30-3=27$, FP $=20-7=13$, FN $=10+3=13$, TN $=40+7=47$.`, why:`Raising the threshold turns some positives into negatives: TPs lost become FNs, FPs cleared become TNs.`},
        {do:`Precision $=\\frac{27}{27+13}=\\frac{27}{40}=0.675$ (was $\\frac{30}{50}=0.6$).`, why:`Fewer false alarms raise precision.`},
        {do:`Recall $=\\frac{27}{27+13}=\\frac{27}{40}=0.675$ (was $\\frac{30}{40}=0.75$).`, why:`Missing more positives lowers recall.`}
      ],
      answer:`Precision rises to $0.675$, recall falls to $0.675$ — the classic precision/recall trade-off.` },

    { q:`<p>Specificity (true negative rate). TN$=80$, FP$=20$. Find specificity, and relate it to FPR.</p>`,
      steps:[
        {do:`Specificity $=\\frac{TN}{TN+FP}=\\frac{80}{80+20}=\\frac{80}{100}=0.8$.`, why:`Specificity is the fraction of real negatives correctly cleared.`},
        {do:`FPR $=1-\\text{specificity}=1-0.8=0.2$.`, why:`The false positive rate is the complement of specificity.`}
      ],
      answer:`Specificity $=0.8$; FPR $=0.2$.` },

    { q:`<p>Macro vs micro F1. Class A: TP$=8$, FP$=2$, FN$=2$. Class B: TP$=1$, FP$=1$, FN$=8$. Find the macro-F1 (average of per-class F1).</p>`,
      steps:[
        {do:`A: P$=\\frac{8}{10}=0.8$, R$=\\frac{8}{10}=0.8$, F1$=0.8$.`, why:`Compute class A's precision, recall, F1.`},
        {do:`B: P$=\\frac{1}{2}=0.5$, R$=\\frac{1}{9}\\approx0.111$, F1$=\\frac{2\\cdot0.5\\cdot0.111}{0.611}\\approx0.182$.`, why:`Compute class B's metrics; its low recall tanks its F1.`},
        {do:`Macro-F1 $=\\frac{0.8+0.182}{2}\\approx0.49$.`, why:`Macro averaging weights each class equally.`}
      ],
      answer:`Macro-F1 $\\approx0.49$ — the weak class B drags the average down.` },

    { q:`<p>Micro-F1 for the same two classes. Pool all: TP$=8+1=9$, FP$=2+1=3$, FN$=2+8=10$. Find micro-F1.</p>`,
      steps:[
        {do:`Pooled precision $=\\frac{9}{9+3}=\\frac{9}{12}=0.75$.`, why:`Micro pools the raw counts before computing the metric.`},
        {do:`Pooled recall $=\\frac{9}{9+10}=\\frac{9}{19}\\approx0.474$.`, why:`Same pooling for recall.`},
        {do:`Micro-F1 $=\\frac{2\\cdot0.75\\cdot0.474}{0.75+0.474}=\\frac{0.711}{1.224}\\approx0.581$.`, why:`Harmonic mean of pooled precision and recall.`}
      ],
      answer:`Micro-F1 $\\approx0.58$ (differs from macro-F1 $\\approx0.49$).` },

    { q:`<p>$F_\\beta$ weighting. With $\\beta=2$ (recall weighted more), precision $=0.6$, recall $=0.9$. Use $F_\\beta=\\frac{(1+\\beta^2)PR}{\\beta^2 P+R}$.</p>`,
      steps:[
        {do:`$\\beta^2=4$. Numerator $=(1+4)\\cdot0.6\\cdot0.9=5\\cdot0.54=2.7$.`, why:`$F_2$ emphasizes recall via $\\beta^2$.`},
        {do:`Denominator $=4\\cdot0.6+0.9=2.4+0.9=3.3$.`, why:`Plug into the $F_\\beta$ denominator.`},
        {do:`$F_2=\\frac{2.7}{3.3}\\approx0.818$.`, why:`Divide; the high recall lifts $F_2$ above the plain F1.`}
      ],
      answer:`$F_2\\approx0.82$.` },

    { q:`<p>Matthews correlation coefficient. TP$=70$, TN$=10$, FP$=10$, FN$=10$. Use $\\text{MCC}=\\frac{TP\\cdot TN - FP\\cdot FN}{\\sqrt{(TP+FP)(TP+FN)(TN+FP)(TN+FN)}}$.</p>`,
      steps:[
        {do:`Numerator: $70\\cdot10-10\\cdot10=700-100=600$.`, why:`MCC's top rewards correct over incorrect agreements.`},
        {do:`Denominator: $\\sqrt{(80)(80)(20)(20)}=\\sqrt{2{,}560{,}000}=1600$.`, why:`Multiply the four margins and take the root.`},
        {do:`$\\text{MCC}=\\frac{600}{1600}=0.375$.`, why:`MCC ranges $-1$ to $1$; $0.375$ is modest despite high accuracy.`}
      ],
      answer:`MCC $=0.375$.` },

    { q:`<p>Balanced accuracy. Sensitivity (recall) $=0.6$, specificity $=0.9$. Find balanced accuracy, and compare to plain accuracy when negatives dominate.</p>`,
      steps:[
        {do:`Balanced accuracy $=\\frac{\\text{sensitivity}+\\text{specificity}}{2}=\\frac{0.6+0.9}{2}=0.75$.`, why:`It averages per-class recall, treating classes equally.`},
        {do:`Plain accuracy would lean toward the $0.9$ specificity if negatives dominate.`, why:`Plain accuracy over-weights the majority class.`}
      ],
      answer:`Balanced accuracy $=0.75$, lower than the inflated plain accuracy on imbalanced data.` },

    { q:`<p>Cost-sensitive choice. A false negative costs $\\$100$ (missed fraud); a false positive costs $\\$1$ (extra review). Model X: FN$=2$, FP$=50$. Model Y: FN$=5$, FP$=5$. Which has lower total cost?</p>`,
      steps:[
        {do:`X cost: $2\\times100+50\\times1=200+50=250$.`, why:`Total cost weights each error type by its dollar cost.`},
        {do:`Y cost: $5\\times100+5\\times1=500+5=505$.`, why:`Same weighting for model Y.`},
        {do:`$250&lt;505$, so X is cheaper.`, why:`When misses are costly, the model with fewer FNs wins.`}
      ],
      answer:`Model X ($\\$250$ vs $\\$505$) — it minimizes the expensive false negatives.` }
  ]);

  /* ------------------------------------------------------------ */
  add("ml-roc-auc", [
    { q:`<p>Compute AUC by counting pairs. Positives score $0.8, 0.6$; negatives score $0.7, 0.5, 0.3$. How many of the $2\\times3=6$ pairs are correctly ranked, and what is the AUC?</p>`,
      steps:[
        {do:`Pos $0.8$ beats negs $0.7,0.5,0.3$: $3$ correct. Pos $0.6$ beats $0.5,0.3$ but loses to $0.7$: $2$ correct.`, why:`A pair is correct when the positive scores above the negative.`},
        {do:`Correct $=3+2=5$ of $6$.`, why:`Sum correct pairs.`},
        {do:`AUC $=\\frac{5}{6}\\approx0.833$.`, why:`AUC is correct pairs over total pairs.`}
      ],
      answer:`$5/6$ correct; AUC $\\approx0.833$.` },

    { q:`<p>Tied scores count as half. Positive scores $0.5$; a negative also scores $0.5$. The other negative scores $0.3$. Find the AUC over these $1\\times2$ pairs.</p>`,
      steps:[
        {do:`Pair (pos $0.5$, neg $0.5$): a tie counts as $0.5$.`, why:`AUC gives ties half credit.`},
        {do:`Pair (pos $0.5$, neg $0.3$): pos wins, counts $1$.`, why:`Higher positive score scores a full correct pair.`},
        {do:`AUC $=\\frac{0.5+1}{2}=\\frac{1.5}{2}=0.75$.`, why:`Sum credit over total pairs.`}
      ],
      answer:`AUC $=0.75$ (the tie contributed $0.5$).` },

    { q:`<p>Build the ROC by sweeping thresholds. Ranked scores with labels (high to low): P, N, P, N. There are $2$ positives, $2$ negatives. Trace the ROC points and find the AUC by area.</p>`,
      steps:[
        {do:`Start $(0,0)$. Take P: TPR$\\to\\frac12$, step up to $(0,0.5)$. Take N: FPR$\\to\\frac12$, step right to $(0.5,0.5)$.`, why:`Each positive moves up $\\frac1{n_+}$; each negative moves right $\\frac1{n_-}$.`},
        {do:`Take P: up to $(0.5,1)$. Take N: right to $(1,1)$.`, why:`Continue down the ranked list.`},
        {do:`Area = two trapezoids: $0.5\\cdot0.5+0.5\\cdot1=0.25+0.5=0.75$.`, why:`Sum the rectangle areas under the staircase.`}
      ],
      answer:`AUC $=0.75$.` },

    { q:`<p>Perfectly ranked vs reversed. Order P,P,N,N gives AUC$=1$. What AUC does the fully reversed order N,N,P,P give, and what does it imply?</p>`,
      steps:[
        {do:`Reversed: every negative outranks every positive, so $0$ of $4$ pairs are correct.`, why:`AUC counts positives ranked above negatives.`},
        {do:`AUC $=\\frac{0}{4}=0$.`, why:`Perfectly wrong ranking.`},
        {do:`Flipping predictions would give AUC$=1$.`, why:`An AUC of $0$ is a perfect classifier with inverted labels.`}
      ],
      answer:`AUC $=0$ — perfectly inverted; flipping the scores recovers AUC$=1$.` },

    { q:`<p>AUC equals the Mann-Whitney statistic over $n_+ n_-$ pairs. With $3$ positives and $4$ negatives, $9$ pairs are correctly ordered (positive higher). Find the AUC.</p>`,
      steps:[
        {do:`Total pairs $=n_+ n_-=3\\times4=12$.`, why:`AUC's denominator is all positive-negative pairs.`},
        {do:`AUC $=\\frac{9}{12}=0.75$.`, why:`Correct pairs over total.`}
      ],
      answer:`AUC $=0.75$.` },

    { q:`<p>Three ROC points beyond the corners: $(0,0),(0.25,0.6),(0.5,0.8),(1,1)$. Approximate the AUC with the trapezoid rule.</p>`,
      steps:[
        {do:`Trapezoid 1 over $[0,0.25]$: $0.25\\cdot\\frac{0+0.6}{2}=0.25\\cdot0.3=0.075$.`, why:`Each trapezoid area is width times average height.`},
        {do:`$[0.25,0.5]$: $0.25\\cdot\\frac{0.6+0.8}{2}=0.25\\cdot0.7=0.175$. $[0.5,1]$: $0.5\\cdot\\frac{0.8+1}{2}=0.5\\cdot0.9=0.45$.`, why:`Continue across each segment.`},
        {do:`Sum: $0.075+0.175+0.45=0.7$.`, why:`Total area under the ROC curve.`}
      ],
      answer:`AUC $\\approx0.7$.` },

    { q:`<p>Precision-recall vs ROC under imbalance. $10$ positives, $990$ negatives. At a threshold, TP$=8$, FP$=80$, FN$=2$. Find recall (=TPR), FPR, and precision; note which metric looks worse.</p>`,
      steps:[
        {do:`Recall/TPR $=\\frac{8}{8+2}=0.8$. FPR $=\\frac{80}{990}\\approx0.081$.`, why:`TPR over positives, FPR over the many negatives.`},
        {do:`Precision $=\\frac{8}{8+80}=\\frac{8}{88}\\approx0.091$.`, why:`Precision divides by all flagged points.`},
        {do:`ROC looks fine (low FPR) but precision is terrible ($0.09$).`, why:`Under heavy imbalance, FPR stays small while precision collapses.`}
      ],
      answer:`Recall $=0.8$, FPR $\\approx0.08$, precision $\\approx0.09$ — PR exposes the imbalance that ROC hides.` },

    { q:`<p>Threshold sweep affects one ROC point. At threshold $t$, scores $\\ge t$ are predicted positive. Positives: $0.9,0.7$; negatives: $0.8,0.4$. Find the ROC point at $t=0.75$.</p>`,
      steps:[
        {do:`Predicted positive (score $\\ge0.75$): the $0.9$ positive and the $0.8$ negative.`, why:`Apply the threshold to every score.`},
        {do:`TP$=1$ (the $0.9$), FN$=1$ (the $0.7$): TPR$=\\frac12=0.5$.`, why:`One of two positives clears the threshold.`},
        {do:`FP$=1$ (the $0.8$), TN$=1$ (the $0.4$): FPR$=\\frac12=0.5$.`, why:`One of two negatives is wrongly flagged.`}
      ],
      answer:`ROC point $(0.5,\\,0.5)$ at $t=0.75$.` },

    { q:`<p>Compare two models by AUC. Model A: positives $0.9,0.85$, negatives $0.4,0.3$. Model B: positives $0.6,0.55$, negatives $0.5,0.45$. Which ranks better?</p>`,
      steps:[
        {do:`A: both positives beat both negatives, $4/4$ correct, AUC$=1$.`, why:`AUC depends only on ranking, not the raw score values.`},
        {do:`B: $0.6&gt;0.5,0.45$ ($2$); $0.55&gt;0.5,0.45$ ($2$); $4/4$, AUC$=1$.`, why:`B's scores are bunched but still perfectly separated.`},
        {do:`Both AUC$=1$.`, why:`AUC is invariant to monotonic score rescaling.`}
      ],
      answer:`Tie: both AUC$=1$ — AUC cares only about ranking, not score gaps.` },

    { q:`<p>Partial credit from a tie cluster. Positives $0.6,0.6$; negatives $0.6,0.2$. Count AUC over the $2\\times2=4$ pairs (ties score $0.5$).</p>`,
      steps:[
        {do:`vs neg $0.6$: both positives tie ($0.5$ each) $\\to 0.5+0.5=1.0$.`, why:`Equal scores between a positive and negative count half.`},
        {do:`vs neg $0.2$: both positives win ($1$ each) $\\to 1+1=2.0$.`, why:`Both positives outrank the low negative.`},
        {do:`AUC $=\\frac{1.0+2.0}{4}=\\frac{3}{4}=0.75$.`, why:`Total credit over total pairs.`}
      ],
      answer:`AUC $=0.75$.` }
  ]);

  /* ------------------------------------------------------------ */
  add("ml-regression-metrics", [
    { q:`<p>Truths $y=2,4,6,8$ (mean $5$). Predictions $\\hat y=3,3,7,7$. Find $SS_{res}$, $SS_{tot}$, and $R^2$.</p>`,
      steps:[
        {do:`Residuals: $2-3,4-3,6-7,8-7=-1,1,-1,1$. $SS_{res}=1+1+1+1=4$.`, why:`Sum the squared prediction errors.`},
        {do:`Deviations from mean $5$: $-3,-1,1,3$. $SS_{tot}=9+1+1+9=20$.`, why:`Sum squared deviations from $\\bar y$.`},
        {do:`$R^2=1-\\frac{4}{20}=1-0.2=0.8$.`, why:`Plug into the $R^2$ formula.`}
      ],
      answer:`$SS_{res}=4$, $SS_{tot}=20$, $R^2=0.8$.` },

    { q:`<p>Adjusted $R^2$. With $R^2=0.8$, $m=10$ samples, and $p=3$ predictors, use $R^2_{adj}=1-(1-R^2)\\frac{m-1}{m-p-1}$.</p>`,
      steps:[
        {do:`$\\frac{m-1}{m-p-1}=\\frac{9}{10-3-1}=\\frac{9}{6}=1.5$.`, why:`The penalty grows as predictors $p$ rise.`},
        {do:`$1-R^2=0.2$, so $0.2\\times1.5=0.3$.`, why:`Scale the unexplained fraction by the penalty.`},
        {do:`$R^2_{adj}=1-0.3=0.7$.`, why:`Adjusted $R^2$ falls below $R^2$ to penalize extra predictors.`}
      ],
      answer:`$R^2_{adj}=0.7$ (below the raw $R^2=0.8$).` },

    { q:`<p>Adding a useless predictor. $R^2$ barely rises from $0.80$ to $0.81$ but $p$ goes $3\\to4$ ($m=10$). Compute the new $R^2_{adj}$ and say whether the predictor helped (old adjusted was $0.70$).</p>`,
      steps:[
        {do:`$\\frac{m-1}{m-p-1}=\\frac{9}{10-4-1}=\\frac{9}{5}=1.8$.`, why:`The penalty rises with the extra predictor.`},
        {do:`$(1-0.81)\\times1.8=0.19\\times1.8=0.342$. $R^2_{adj}=1-0.342=0.658$.`, why:`Apply the adjusted formula.`},
        {do:`$0.658&lt;0.70$.`, why:`Adjusted $R^2$ dropped, so the new predictor was not worth it.`}
      ],
      answer:`$R^2_{adj}=0.658$, lower than before — the extra predictor hurt; it added noise.` },

    { q:`<p>MAE vs RMSE with an outlier. Errors are $1,1,1,7$. Compute both MAE and RMSE over $m=4$.</p>`,
      steps:[
        {do:`MAE $=\\frac{|1|+|1|+|1|+|7|}{4}=\\frac{10}{4}=2.5$.`, why:`MAE averages absolute errors.`},
        {do:`Squared: $1+1+1+49=52$. MSE $=\\frac{52}{4}=13$.`, why:`RMSE squares errors first, magnifying the outlier.`},
        {do:`RMSE $=\\sqrt{13}\\approx3.61$.`, why:`Take the root to return to $y$'s units.`}
      ],
      answer:`MAE $=2.5$, RMSE $\\approx3.61$ — RMSE is larger because squaring punishes the outlier.` },

    { q:`<p>RMSE units. A house-price model has MSE $=2500$ (in thousands-of-dollars squared). Give the RMSE and its interpretation.</p>`,
      steps:[
        {do:`RMSE $=\\sqrt{2500}=50$.`, why:`RMSE is the square root of MSE.`},
        {do:`It is in the same units as $y$ (thousands of dollars).`, why:`The root undoes the squaring, restoring original units.`}
      ],
      answer:`RMSE $=50$ (thousand dollars) — the typical prediction error size.` },

    { q:`<p>$R^2$ from correlation. For simple linear regression, $R^2=r^2$ where $r$ is the correlation. If $r=-0.8$, find $R^2$.</p>`,
      steps:[
        {do:`$R^2=r^2=(-0.8)^2=0.64$.`, why:`In one-predictor regression, $R^2$ is the squared correlation.`},
        {do:`The sign of $r$ drops out under squaring.`, why:`Both positive and negative correlations explain variance.`}
      ],
      answer:`$R^2=0.64$.` },

    { q:`<p>Truths $y=5,10,15$ (mean $10$). Predictions $\\hat y=6,9,15$. Find MAE, RMSE, and $R^2$.</p>`,
      steps:[
        {do:`Errors: $5-6,10-9,15-15=-1,1,0$. MAE $=\\frac{1+1+0}{3}\\approx0.667$.`, why:`Average the absolute errors.`},
        {do:`Squared: $1+1+0=2$. MSE $=\\frac{2}{3}$, RMSE $=\\sqrt{0.667}\\approx0.816$.`, why:`RMSE squares, averages, roots.`},
        {do:`$SS_{tot}$: deviations $-5,0,5$, sum of squares $=50$. $R^2=1-\\frac{2}{50}=0.96$.`, why:`$R^2$ compares $SS_{res}=2$ to $SS_{tot}=50$.`}
      ],
      answer:`MAE $\\approx0.667$, RMSE $\\approx0.816$, $R^2=0.96$.` },

    { q:`<p>Compare models on the same data. Model A: $SS_{res}=15$. Model B: $SS_{res}=10$. $SS_{tot}=50$. Find each $R^2$ and the improvement.</p>`,
      steps:[
        {do:`$R^2_A=1-\\frac{15}{50}=0.7$.`, why:`Plug A's residual into the formula.`},
        {do:`$R^2_B=1-\\frac{10}{50}=0.8$.`, why:`Plug B's residual.`},
        {do:`Improvement $=0.8-0.7=0.1$.`, why:`B explains $10$ more percentage points of variance.`}
      ],
      answer:`$R^2_A=0.7$, $R^2_B=0.8$; B improves by $0.1$.` },

    { q:`<p>Out-of-sample $R^2$ can be negative. On test data $SS_{res}=120$, and using the training mean as baseline $SS_{tot}=100$. Find $R^2$ and interpret.</p>`,
      steps:[
        {do:`$R^2=1-\\frac{120}{100}=1-1.2=-0.2$.`, why:`The formula applies even on test data.`},
        {do:`$R^2&lt;0$ means the model beats neither the baseline mean.`, why:`Its test error exceeds just predicting the mean — a sign of overfitting.`}
      ],
      answer:`$R^2=-0.2$ — the model generalizes worse than predicting the mean (overfit).` },

    { q:`<p>RMSE is dominated by the worst points. Errors $2,2,2,2,10$. Compute RMSE, then RMSE if the $10$ were instead a $2$.</p>`,
      steps:[
        {do:`With the outlier: squares $4,4,4,4,100$, sum $=116$, MSE $=\\frac{116}{5}=23.2$, RMSE $=\\sqrt{23.2}\\approx4.82$.`, why:`The single large error dominates the sum of squares.`},
        {do:`Without it (all $2$): squares sum $=20$, MSE $=4$, RMSE $=2$.`, why:`Replacing $10$ with $2$ removes the outlier's influence.`},
        {do:`RMSE drops from $4.82$ to $2$.`, why:`One bad point more than doubled the RMSE.`}
      ],
      answer:`RMSE $\\approx4.82$ with the outlier vs $2$ without — RMSE is outlier-sensitive.` }
  ]);

  /* ------------------------------------------------------------ */
  add("ml-regularization", [
    { q:`<p>Elastic net combines both penalties: $\\lambda_1\\lVert\\theta\\rVert_1+\\lambda_2\\lVert\\theta\\rVert_2^2$. Weights $\\theta=[3,-4]$, $\\lambda_1=2$, $\\lambda_2=0.5$. Find the total penalty.</p>`,
      steps:[
        {do:`L1 $=|3|+|-4|=7$; term $=2\\times7=14$.`, why:`The L1 part sums absolute values.`},
        {do:`L2$^2=3^2+4^2=25$; term $=0.5\\times25=12.5$.`, why:`The L2 part sums squared weights.`},
        {do:`Total $=14+12.5=26.5$.`, why:`Elastic net adds both penalty terms.`}
      ],
      answer:`Total penalty $=26.5$.` },

    { q:`<p>Ridge gradient step on one weight. The data-fit gradient at $\\theta=4$ is $-2$, and the L2 penalty adds $2\\lambda\\theta$ with $\\lambda=0.5$. With learning rate $\\eta=0.1$, find the updated $\\theta$.</p>`,
      steps:[
        {do:`Penalty gradient: $2\\lambda\\theta=2\\cdot0.5\\cdot4=4$.`, why:`The derivative of $\\lambda\\theta^2$ is $2\\lambda\\theta$.`},
        {do:`Total gradient: $-2+4=2$.`, why:`Add the data-fit and penalty gradients.`},
        {do:`Update: $\\theta\\leftarrow4-0.1\\times2=4-0.2=3.8$.`, why:`Gradient descent steps opposite the gradient; the penalty shrinks $\\theta$.`}
      ],
      answer:`$\\theta=3.8$.` },

    { q:`<p>L1 subgradient (soft-thresholding intuition). The data-fit gradient at $\\theta=0.3$ is $-0.1$; L1 adds $\\lambda\\cdot\\text{sign}(\\theta)$ with $\\lambda=0.5$. With $\\eta=1$, compute the raw update and note what L1 tends to do.</p>`,
      steps:[
        {do:`L1 gradient: $\\lambda\\cdot\\text{sign}(0.3)=0.5\\cdot(+1)=0.5$.`, why:`The L1 derivative is $\\pm\\lambda$ depending on the sign.`},
        {do:`Total gradient: $-0.1+0.5=0.4$. Update: $0.3-1\\times0.4=-0.1$.`, why:`The large constant L1 push overshoots past zero.`},
        {do:`Soft-thresholding clips it to $0$.`, why:`L1 drives small weights exactly to zero, creating sparsity.`}
      ],
      answer:`Raw update overshoots to $-0.1$; soft-thresholding sets $\\theta=0$ — L1 induces sparsity.` },

    { q:`<p>Ridge closed form. $\\theta=(X^\\top X+\\lambda I)^{-1}X^\\top y$. With scalars $X^\\top X=8$, $X^\\top y=20$, $\\lambda=2$, find $\\theta$. Compare to the unregularized $\\theta$.</p>`,
      steps:[
        {do:`Unregularized: $\\theta=\\frac{20}{8}=2.5$.`, why:`Without $\\lambda$, just divide.`},
        {do:`Ridge: denominator $=8+2=10$, so $\\theta=\\frac{20}{10}=2.0$.`, why:`Adding $\\lambda I$ enlarges the denominator, shrinking $\\theta$.`}
      ],
      answer:`Ridge $\\theta=2.0$, smaller than the unregularized $2.5$.` },

    { q:`<p>Regularization path. As $\\lambda$ grows $0\\to1\\to10\\to100$, a Ridge weight goes $5.0\\to3.0\\to1.0\\to0.1$. Describe the trend and the limit.</p>`,
      steps:[
        {do:`Each larger $\\lambda$ gives a smaller weight: $5,3,1,0.1$.`, why:`Stronger penalties shrink weights monotonically.`},
        {do:`As $\\lambda\\to\\infty$, the weight $\\to0$ but never exactly $0$.`, why:`Ridge's squared penalty fades near zero, so it only approaches it.`}
      ],
      answer:`The weight shrinks toward (but not to) $0$; Ridge never zeroes weights exactly.` },

    { q:`<p>LASSO path zeros features. As $\\lambda$ grows, a LASSO weight goes $5\\to2\\to0\\to0$. Contrast with Ridge's path from the prior problem.</p>`,
      steps:[
        {do:`LASSO hits exactly $0$ at moderate $\\lambda$ and stays there.`, why:`The L1 penalty's constant pull forces small weights to exactly zero.`},
        {do:`Ridge only approached $0$ asymptotically.`, why:`The squared penalty weakens near zero, so Ridge never quite reaches it.`}
      ],
      answer:`LASSO sets the weight exactly to $0$ (feature dropped); Ridge merely shrinks it.` },

    { q:`<p>Bias-variance from $\\lambda$. Train and validation error vs $\\lambda$: $\\lambda{=}0.1$: train $0.05$, val $0.40$; $\\lambda{=}1$: train $0.15$, val $0.20$; $\\lambda{=}10$: train $0.35$, val $0.38$. Diagnose each and pick $\\lambda$.</p>`,
      steps:[
        {do:`$\\lambda{=}0.1$: low train, high val $\\to$ overfitting (high variance).`, why:`A big train-val gap signals overfitting.`},
        {do:`$\\lambda{=}10$: high train and high val $\\to$ underfitting (high bias).`, why:`Both errors high means the model is too constrained.`},
        {do:`$\\lambda{=}1$: lowest val ($0.20$).`, why:`The best $\\lambda$ minimizes validation error.`}
      ],
      answer:`Pick $\\lambda=1$ — it balances the overfit ($0.1$) and underfit ($10$) extremes.` },

    { q:`<p>Standardize before regularizing. Feature A ranges $0$-$1000$ with weight $0.01$; feature B ranges $0$-$1$ with weight $5$. Compare raw squared-weight penalties and explain the fix.</p>`,
      steps:[
        {do:`Raw L2 contributions: A $=0.01^2=0.0001$; B $=5^2=25$.`, why:`The penalty looks at weights, ignoring feature scale.`},
        {do:`B is penalized far more, though A's feature is huge.`, why:`Unstandardized features make the penalty unfair across features.`},
        {do:`Standardize features to equal scale first.`, why:`Then weights are comparable and the penalty is fair.`}
      ],
      answer:`Raw penalty unfairly hits B ($25$) over A ($0.0001$); standardize features before regularizing.` },

    { q:`<p>Total regularized cost with elastic net. Data-fit cost $=12$, weights $\\theta=[2,-3]$, $\\lambda_1=1$, $\\lambda_2=2$. Find the total.</p>`,
      steps:[
        {do:`L1 $=|2|+|-3|=5$; term $=1\\times5=5$.`, why:`L1 sums absolute values.`},
        {do:`L2$^2=2^2+3^2=13$; term $=2\\times13=26$.`, why:`L2 sums squared weights.`},
        {do:`Total $=12+5+26=43$.`, why:`Sum data-fit plus both penalties.`}
      ],
      answer:`Total cost $=43$.` },

    { q:`<p>Why L1 zeros weights but L2 doesn't (geometry). Near $\\theta=0$, the L1 penalty $\\lambda|\\theta|$ has slope $\\pm\\lambda$, while L2's $\\lambda\\theta^2$ has slope $2\\lambda\\theta$. Evaluate both slopes at $\\theta=0.01$, $\\lambda=1$, and conclude.</p>`,
      steps:[
        {do:`L1 slope at $0.01$: $\\pm1$ (constant).`, why:`The absolute value keeps a constant pull regardless of how small $\\theta$ is.`},
        {do:`L2 slope at $0.01$: $2\\cdot1\\cdot0.01=0.02$ (tiny).`, why:`The squared penalty's pull vanishes as $\\theta\\to0$.`},
        {do:`L1's constant pull overpowers a small data gradient and forces $\\theta$ to $0$; L2's fading pull does not.`, why:`This is why L1 is sparse and L2 is not.`}
      ],
      answer:`L1 slope $=1$ (constant) vs L2 slope $=0.02$ (vanishing) — L1's persistent pull zeros weights.` }
  ]);

})();
