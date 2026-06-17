/* =====================================================================
   PRACTICE PROBLEMS — MODULE 2 (ML), set C.
   Owned ids: ml-kmeans, ml-em, ml-hierarchical, ml-pca, ml-ica,
              ml-classification-metrics, ml-roc-auc,
              ml-regression-metrics, ml-regularization.
   Each id: EXACTLY 10 problems, easy -> hard.
   Schema: { q, steps:[{do, why}], answer }.
   ===================================================================== */
(function () {
Object.assign(window.PRACTICE, {

  /* ------------------------------------------------------------ */
  "ml-kmeans": [
    { q:`<p>A cluster has the 1D points $2, 4, 6$. Where does its centroid go after the update step?</p>`,
      steps:[
        {do:`Add the points: $2+4+6=12$.`, why:`The centroid is the mean, so first sum the values.`},
        {do:`Divide by the count: $\\frac{12}{3}=4$.`, why:`The mean is the sum divided by how many points there are.`}
      ],
      answer:`Centroid $=4$.` },

    { q:`<p>A cluster has the 1D points $10, 20, 30, 40$. Find the new centroid.</p>`,
      steps:[
        {do:`Sum: $10+20+30+40=100$.`, why:`The update step averages the cluster's points.`},
        {do:`Divide by $4$: $\\frac{100}{4}=25$.`, why:`Four points, so divide the sum by $4$.`}
      ],
      answer:`Centroid $=25$.` },

    { q:`<p>Point $x=7$. Centroids are $\\mu_1=3$ and $\\mu_2=10$. Which cluster gets the point?</p>`,
      steps:[
        {do:`Distance to $\\mu_1$: $|7-3|=4$.`, why:`Assign each point to its nearest centroid.`},
        {do:`Distance to $\\mu_2$: $|7-10|=3$.`, why:`Compare distances to every centroid.`},
        {do:`$3<4$, so $\\mu_2$ is closer.`, why:`The smallest distance wins.`}
      ],
      answer:`Cluster $2$ (centroid $\\mu_2=10$).` },

    { q:`<p>2D point $x=(0,0)$. Centroids $\\mu_1=(1,1)$ and $\\mu_2=(3,0)$. Which is nearer? Use squared distance.</p>`,
      steps:[
        {do:`To $\\mu_1$: $(0-1)^2+(0-1)^2=1+1=2$.`, why:`Squared L2 distance sums the squared coordinate gaps.`},
        {do:`To $\\mu_2$: $(0-3)^2+(0-0)^2=9+0=9$.`, why:`Same rule for the second centroid.`},
        {do:`$2<9$, so $\\mu_1$ is closer.`, why:`Pick the centroid with the smaller squared distance.`}
      ],
      answer:`Cluster $1$ (centroid $\\mu_1$).` },

    { q:`<p>1D points $1, 3, 8, 9$, with $k=2$ and start centroids $\\mu_1=1$, $\\mu_2=9$. Do one assignment step.</p>`,
      steps:[
        {do:`$1$: $|1-1|=0$ vs $|1-9|=8$, so cluster 1.`, why:`Each point joins its nearest centroid.`},
        {do:`$3$: $|3-1|=2$ vs $|3-9|=6$, so cluster 1.`, why:`Same nearest-centroid rule.`},
        {do:`$8$: $|8-1|=7$ vs $|8-9|=1$, so cluster 2. $9$: $0$ vs $8$, so cluster 2.`, why:`Finish assigning all points.`}
      ],
      answer:`Cluster 1 $=\\{1,3\\}$, cluster 2 $=\\{8,9\\}$.` },

    { q:`<p>After assigning, cluster 1 $=\\{1,3\\}$ and cluster 2 $=\\{8,9\\}$. Recompute both centroids.</p>`,
      steps:[
        {do:`$\\mu_1=\\frac{1+3}{2}=2$.`, why:`Each centroid moves to the mean of its assigned points.`},
        {do:`$\\mu_2=\\frac{8+9}{2}=8.5$.`, why:`Same averaging for cluster 2.`}
      ],
      answer:`$\\mu_1=2$, $\\mu_2=8.5$.` },

    { q:`<p>2D cluster has points $(2,0)$, $(4,2)$, $(6,4)$. Find the centroid.</p>`,
      steps:[
        {do:`Average the x's: $\\frac{2+4+6}{3}=\\frac{12}{3}=4$.`, why:`A 2D centroid averages each coordinate separately.`},
        {do:`Average the y's: $\\frac{0+2+4}{3}=\\frac{6}{3}=2$.`, why:`Do the same for the y coordinate.`}
      ],
      answer:`Centroid $=(4,2)$.` },

    { q:`<p>Point $x=5$ sits between centroids $\\mu_1=2$ and $\\mu_2=8$. Check the distances, then assign.</p>`,
      steps:[
        {do:`$|5-2|=3$ and $|5-8|=3$.`, why:`Compute the distance to each centroid.`},
        {do:`The distances tie at $3$.`, why:`A tie means the point sits exactly between the centroids.`},
        {do:`Break the tie by lowest index: cluster 1.`, why:`k-means needs a fixed rule (usually smallest index) to break ties.`}
      ],
      answer:`Tie at distance $3$; assign to cluster $1$ by the tie-break rule.` },

    { q:`<p>1D points $0, 2, 10, 12$, $k=2$. Start $\\mu_1=0$, $\\mu_2=2$ (a bad start). Run assign then update once.</p>`,
      steps:[
        {do:`Assign: $0\\to\\mu_1$ (dist 0). $2\\to\\mu_2$ (dist 0). $10$: $10$ vs $8$, so $\\mu_2$. $12$: $12$ vs $10$, so $\\mu_2$.`, why:`Each point picks its nearest centroid even from a bad start.`},
        {do:`Cluster 1 $=\\{0\\}$, cluster 2 $=\\{2,10,12\\}$.`, why:`Group the points by their assignment.`},
        {do:`Update: $\\mu_1=0$, $\\mu_2=\\frac{2+10+12}{3}=8$.`, why:`Move each centroid to its cluster mean.`}
      ],
      answer:`$\\mu_1=0$, $\\mu_2=8$.` },

    { q:`<p>Within-cluster cost is $\\sum\\lVert x-\\mu\\rVert^2$. A cluster has points $1,2,3$ with centroid $\\mu=2$. Find the cost.</p>`,
      steps:[
        {do:`Squared gaps: $(1-2)^2=1$, $(2-2)^2=0$, $(3-2)^2=1$.`, why:`The cost adds each point's squared distance to its centroid.`},
        {do:`Sum: $1+0+1=2$.`, why:`Add the squared distances for the total cost.`}
      ],
      answer:`Cost $=2$.` }
  ],

  /* ------------------------------------------------------------ */
  "ml-em": [
    { q:`<p>E-step: a point gets density $0.6$ from cluster A and $0.4$ from cluster B (equal mixing weights). Find its responsibility to A.</p>`,
      steps:[
        {do:`Total density: $0.6+0.4=1.0$.`, why:`Responsibility shares the point across clusters by their densities.`},
        {do:`Responsibility to A: $\\frac{0.6}{1.0}=0.6$.`, why:`Each cluster's share is its density over the total.`}
      ],
      answer:`Responsibility to A $=0.6$.` },

    { q:`<p>A point gets density $0.2$ from A and $0.2$ from B. Find both responsibilities.</p>`,
      steps:[
        {do:`Total: $0.2+0.2=0.4$.`, why:`Sum the densities to normalize.`},
        {do:`To A: $\\frac{0.2}{0.4}=0.5$; to B: $\\frac{0.2}{0.4}=0.5$.`, why:`Equal densities give an equal split.`}
      ],
      answer:`A $=0.5$, B $=0.5$.` },

    { q:`<p>Densities: A gives $0.9$, B gives $0.1$. Find the responsibility to B.</p>`,
      steps:[
        {do:`Total: $0.9+0.1=1.0$.`, why:`Normalize by the sum of densities.`},
        {do:`To B: $\\frac{0.1}{1.0}=0.1$.`, why:`B's share is its density over the total.`}
      ],
      answer:`Responsibility to B $=0.1$.` },

    { q:`<p>Three clusters give densities $0.3$, $0.5$, $0.2$. Find the responsibility to cluster 2.</p>`,
      steps:[
        {do:`Total: $0.3+0.5+0.2=1.0$.`, why:`With more clusters, still divide by the full sum.`},
        {do:`To cluster 2: $\\frac{0.5}{1.0}=0.5$.`, why:`Each responsibility is one density over the total.`}
      ],
      answer:`Responsibility to cluster 2 $=0.5$.` },

    { q:`<p>Mixing weights matter. Cluster A has weight $0.8$ and density $0.5$; B has weight $0.2$ and density $0.5$. Find the responsibility to A using weight $\\times$ density.</p>`,
      steps:[
        {do:`Weighted A: $0.8\\times0.5=0.4$. Weighted B: $0.2\\times0.5=0.1$.`, why:`Responsibility uses prior weight times density, not density alone.`},
        {do:`Total: $0.4+0.1=0.5$.`, why:`Normalize by the sum of weighted terms.`},
        {do:`To A: $\\frac{0.4}{0.5}=0.8$.`, why:`A's larger weight pulls the responsibility toward A.`}
      ],
      answer:`Responsibility to A $=0.8$.` },

    { q:`<p>A point has responsibilities $r_A=0.7$ and $r_B=0.3$. In the M-step, how much "soft count" does it add to each cluster?</p>`,
      steps:[
        {do:`It adds $0.7$ to A's effective count and $0.3$ to B's.`, why:`In the M-step each point contributes its responsibility as a soft count.`},
        {do:`Check: $0.7+0.3=1.0$, one whole point split.`, why:`Responsibilities for one point always sum to $1$.`}
      ],
      answer:`$0.7$ to A, $0.3$ to B (a soft, fractional membership).` },

    { q:`<p>Two points, one feature. Point $x_1=4$ has $r_A=1$; point $x_2=10$ has $r_A=0.5$. M-step: update cluster A's mean as a responsibility-weighted average.</p>`,
      steps:[
        {do:`Weighted sum: $1\\times4+0.5\\times10=4+5=9$.`, why:`Each point's value is weighted by its responsibility to A.`},
        {do:`Total weight: $1+0.5=1.5$.`, why:`Divide by the sum of responsibilities, not the point count.`},
        {do:`Mean: $\\frac{9}{1.5}=6$.`, why:`This is the soft (weighted) version of a cluster mean.`}
      ],
      answer:`New mean $\\mu_A=6$.` },

    { q:`<p>Mixing weights are updated too. Two points have $r_A=0.8$ and $r_A=0.4$. Estimate cluster A's new mixing weight (its average responsibility).</p>`,
      steps:[
        {do:`Sum responsibilities to A: $0.8+0.4=1.2$.`, why:`The new mixing weight is the average responsibility across points.`},
        {do:`Divide by the $2$ points: $\\frac{1.2}{2}=0.6$.`, why:`Average over all $m$ points.`}
      ],
      answer:`New mixing weight for A $=0.6$.` },

    { q:`<p>Why does k-means look like a special case of EM? A point has densities $0.99$ and $0.01$. What kind of assignment does this resemble?</p>`,
      steps:[
        {do:`Responsibilities: $\\frac{0.99}{1.0}=0.99$ and $0.01$.`, why:`Normalize the densities as usual.`},
        {do:`Almost all weight goes to one cluster.`, why:`When responsibilities are near $1$ and $0$, the soft split becomes nearly hard.`},
        {do:`Round to $1$ and $0$: a hard k-means assignment.`, why:`k-means is EM where each point is forced fully into its nearest cluster.`}
      ],
      answer:`It is nearly a hard assignment ($1$ and $0$) — that is the k-means limit.` },

    { q:`<p>Log-likelihood should not decrease across EM rounds. Round 1 gives $-50$, round 2 gives $-48$, round 3 gives $-48$. Is EM behaving correctly, and has it converged?</p>`,
      steps:[
        {do:`Round 1 to 2: $-50\\to-48$, an increase of $2$.`, why:`EM is guaranteed to never lower the log-likelihood.`},
        {do:`Round 2 to 3: $-48\\to-48$, no change.`, why:`When the value stops moving, the fit has settled.`},
        {do:`Increasing then flat: correct and converged.`, why:`A flat log-likelihood signals convergence.`}
      ],
      answer:`Yes — it increased then leveled off, so EM converged correctly.` }
  ],

  /* ------------------------------------------------------------ */
  "ml-hierarchical": [
    { q:`<p>You have $5$ data points. In agglomerative clustering, how many clusters do you start with?</p>`,
      steps:[
        {do:`Each point starts alone.`, why:`Agglomerative clustering begins bottom-up with singletons.`},
        {do:`So there are $5$ starting clusters.`, why:`One cluster per point at the start.`}
      ],
      answer:`$5$ clusters.` },

    { q:`<p>Starting from $5$ singleton clusters, how many merges until everything is one cluster?</p>`,
      steps:[
        {do:`Each merge reduces the count by $1$.`, why:`A merge combines two clusters into one.`},
        {do:`From $5$ down to $1$ takes $5-1=4$ merges.`, why:`You need $n-1$ merges for $n$ points.`}
      ],
      answer:`$4$ merges.` },

    { q:`<p>1D points $A=1$, $B=2$, $C=8$. Single linkage. Which pair merges first?</p>`,
      steps:[
        {do:`Distances: $A$-$B=1$, $B$-$C=6$, $A$-$C=7$.`, why:`Single linkage merges the closest pair of points.`},
        {do:`Smallest is $A$-$B=1$.`, why:`Pick the minimum distance.`}
      ],
      answer:`Merge $A$ and $B$ first.` },

    { q:`<p>After merging $A=1$ and $B=2$ into $\\{A,B\\}$, find the single-linkage distance to $C=8$.</p>`,
      steps:[
        {do:`Single linkage = closest member. Distances: $|1-8|=7$, $|2-8|=6$.`, why:`Single linkage uses the nearest pair between the two clusters.`},
        {do:`Take the minimum: $6$.`, why:`The closest member of $\\{A,B\\}$ to $C$ is $B$.`}
      ],
      answer:`Distance $=6$.` },

    { q:`<p>Cluster $\\{1,2\\}$ and point $C=8$. Find the complete-linkage distance.</p>`,
      steps:[
        {do:`Complete linkage = farthest member. Distances: $|1-8|=7$, $|2-8|=6$.`, why:`Complete linkage uses the farthest pair between clusters.`},
        {do:`Take the maximum: $7$.`, why:`The farthest member of $\\{1,2\\}$ from $C$ is the point $1$.`}
      ],
      answer:`Distance $=7$.` },

    { q:`<p>Cluster $\\{1,3\\}$ and point $C=9$. Find the average-linkage distance.</p>`,
      steps:[
        {do:`Member distances: $|1-9|=8$, $|3-9|=6$.`, why:`Average linkage averages all pairwise distances between clusters.`},
        {do:`Average: $\\frac{8+6}{2}=7$.`, why:`Mean of the two member-to-$C$ distances.`}
      ],
      answer:`Distance $=7$.` },

    { q:`<p>1D points $2, 3, 10, 11$. Single linkage. List the first two merges.</p>`,
      steps:[
        {do:`Pairwise: $2$-$3=1$, $10$-$11=1$, others $\\ge7$.`, why:`Find the two smallest distances.`},
        {do:`Merge $\\{2,3\\}$ (dist 1), then $\\{10,11\\}$ (dist 1).`, why:`Both closest pairs merge before any cross-merge.`}
      ],
      answer:`Merge $\\{2,3\\}$, then $\\{10,11\\}$.` },

    { q:`<p>Distance matrix between clusters $P,Q,R$: $d(P,Q)=4$, $d(P,R)=2$, $d(Q,R)=5$. Which two merge next?</p>`,
      steps:[
        {do:`Compare the three distances: $4$, $2$, $5$.`, why:`Merge the pair with the smallest linkage distance.`},
        {do:`Smallest is $d(P,R)=2$.`, why:`Pick the minimum entry.`}
      ],
      answer:`Merge $P$ and $R$.` },

    { q:`<p>A dendrogram has merges at heights $1, 1, 6$. To get $2$ clusters, where do you cut?</p>`,
      steps:[
        {do:`There are $3$ merges, so $4$ original points.`, why:`Cutting above the low merges but below the top merge leaves $2$ clusters.`},
        {do:`Cut between height $1$ and height $6$.`, why:`A cut there keeps the two low merges but undoes the top merge, giving $2$ clusters.`}
      ],
      answer:`Cut at a height between $1$ and $6$ (e.g. $3$) to get $2$ clusters.` },

    { q:`<p>Points $A=0$, $B=1$, $C=2$. Single linkage. Trace all merges and give the merge heights.</p>`,
      steps:[
        {do:`Distances: $A$-$B=1$, $B$-$C=1$, $A$-$C=2$.`, why:`Start by finding the closest pair.`},
        {do:`First merge: $A$-$B$ at height $1$ (tie broken by order).`, why:`Smallest distance merges first.`},
        {do:`Now $d(\\{A,B\\},C)=\\min(2,1)=1$. Merge at height $1$.`, why:`Single linkage takes the closest member, $B$ to $C$.`}
      ],
      answer:`Merge $\\{A,B\\}$ at height $1$, then add $C$ at height $1$.` }
  ],

  /* ------------------------------------------------------------ */
  "ml-pca": [
    { q:`<p>Feature values $2, 4, 6$. Center them by subtracting the mean.</p>`,
      steps:[
        {do:`Mean: $\\frac{2+4+6}{3}=4$.`, why:`PCA centers data so the mean is zero before finding directions.`},
        {do:`Subtract: $2-4=-2$, $4-4=0$, $6-4=2$.`, why:`Centering shifts the cloud to the origin.`}
      ],
      answer:`Centered values: $-2, 0, 2$.` },

    { q:`<p>Centered values $-2, 0, 2$. Find the variance using $\\frac{1}{m}\\sum x^2$.</p>`,
      steps:[
        {do:`Square them: $4, 0, 4$.`, why:`Variance averages the squared centered values.`},
        {do:`Average over $m=3$: $\\frac{4+0+4}{3}=\\frac{8}{3}\\approx2.67$.`, why:`Divide the sum of squares by the count.`}
      ],
      answer:`Variance $\\approx2.67$.` },

    { q:`<p>Two centered features: $x=(-1,0,1)$, $y=(-2,0,2)$. Find the covariance $\\frac{1}{m}\\sum x_iy_i$.</p>`,
      steps:[
        {do:`Products: $(-1)(-2)=2$, $(0)(0)=0$, $(1)(2)=2$.`, why:`Covariance averages the products of paired centered values.`},
        {do:`Average over $m=3$: $\\frac{2+0+2}{3}=\\frac{4}{3}\\approx1.33$.`, why:`Sum the products and divide by the count.`}
      ],
      answer:`Covariance $\\approx1.33$.` },

    { q:`<p>The covariance matrix is $\\Sigma=\\begin{bmatrix}3&0\\\\0&1\\end{bmatrix}$. Which axis is the top principal component?</p>`,
      steps:[
        {do:`Diagonal entries are the variances: $3$ along x, $1$ along y.`, why:`For a diagonal $\\Sigma$ the axes are the eigenvectors and the diagonal gives the eigenvalues.`},
        {do:`$3>1$, so the x-axis has more spread.`, why:`The top component points where variance is largest.`}
      ],
      answer:`The x-axis (eigenvalue $3$) is the top principal component.` },

    { q:`<p>Eigenvalues of $\\Sigma$ are $\\lambda_1=8$ and $\\lambda_2=2$. What fraction of variance does the top component explain?</p>`,
      steps:[
        {do:`Total variance: $8+2=10$.`, why:`Total variance is the sum of all eigenvalues.`},
        {do:`Top share: $\\frac{8}{10}=0.8$.`, why:`Variance explained is each eigenvalue over the total.`}
      ],
      answer:`$0.8$, i.e. $80\\%$.` },

    { q:`<p>Eigenvalues are $6, 3, 1$. Keep the top $2$ components. What fraction of variance is retained?</p>`,
      steps:[
        {do:`Total: $6+3+1=10$.`, why:`Sum all eigenvalues for total variance.`},
        {do:`Top two: $6+3=9$, share $\\frac{9}{10}=0.9$.`, why:`Add the kept eigenvalues over the total.`}
      ],
      answer:`$0.9$, i.e. $90\\%$ retained.` },

    { q:`<p>For $\\Sigma=\\begin{bmatrix}2&0\\\\0&2\\end{bmatrix}$, find the eigenvalues. What does this say about the spread?</p>`,
      steps:[
        {do:`Diagonal matrix, so eigenvalues are the diagonal: $2$ and $2$.`, why:`A diagonal matrix's eigenvalues are its diagonal entries.`},
        {do:`Both equal, so spread is the same in every direction.`, why:`Equal eigenvalues mean no single direction dominates.`}
      ],
      answer:`Eigenvalues $2$ and $2$; spread is equal, so PCA finds no preferred direction.` },

    { q:`<p>$\\Sigma=\\begin{bmatrix}4&0\\\\0&1\\end{bmatrix}$. Find the eigenvalues via $\\det(\\Sigma-\\lambda I)=0$.</p>`,
      steps:[
        {do:`$\\Sigma-\\lambda I=\\begin{bmatrix}4-\\lambda&0\\\\0&1-\\lambda\\end{bmatrix}$.`, why:`Subtract $\\lambda$ from the diagonal.`},
        {do:`Determinant: $(4-\\lambda)(1-\\lambda)=0$.`, why:`A diagonal determinant is the product of the diagonal.`},
        {do:`Roots: $\\lambda=4$ and $\\lambda=1$.`, why:`Set each factor to zero.`}
      ],
      answer:`Eigenvalues $\\lambda=4$ and $\\lambda=1$.` },

    { q:`<p>For $\\Sigma=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$, find the eigenvalues.</p>`,
      steps:[
        {do:`$\\det\\begin{bmatrix}2-\\lambda&1\\\\1&2-\\lambda\\end{bmatrix}=(2-\\lambda)^2-1=0$.`, why:`Determinant of a 2x2 is $ad-bc$.`},
        {do:`So $(2-\\lambda)^2=1$, giving $2-\\lambda=\\pm1$.`, why:`Take the square root of both sides.`},
        {do:`$\\lambda=1$ or $\\lambda=3$.`, why:`Solve the two cases.`}
      ],
      answer:`Eigenvalues $\\lambda=3$ and $\\lambda=1$.` },

    { q:`<p>For $\\Sigma=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$ with top eigenvalue $\\lambda=3$, find the top eigenvector direction.</p>`,
      steps:[
        {do:`Solve $(\\Sigma-3I)v=0$: $\\begin{bmatrix}-1&1\\\\1&-1\\end{bmatrix}v=0$.`, why:`The eigenvector satisfies $(\\Sigma-\\lambda I)v=0$.`},
        {do:`Row gives $-v_1+v_2=0$, so $v_1=v_2$.`, why:`Both rows say the components are equal.`},
        {do:`Direction $[1,1]$ (the diagonal).`, why:`Any vector with equal components works; this is the spread direction.`}
      ],
      answer:`Top eigenvector points along $[1,1]$.` }
  ],

  /* ------------------------------------------------------------ */
  "ml-ica": [
    { q:`<p>Mixing is $x=As$. If you find $W=A^{-1}$, how do you recover the sources $s$?</p>`,
      steps:[
        {do:`Apply $W$ to the recordings: $Wx=A^{-1}As=s$.`, why:`The inverse undoes the mixing matrix.`},
        {do:`So $s=Wx$.`, why:`Multiplying by $W$ recovers the original signals.`}
      ],
      answer:`$s=Wx$.` },

    { q:`<p>Sources mix as $x_1=s_1+s_2$, $x_2=s_2$. Write the mixing matrix $A$.</p>`,
      steps:[
        {do:`Row 1 from $x_1=1\\cdot s_1+1\\cdot s_2$ gives $[1,1]$.`, why:`Each row of $A$ holds the coefficients of one recording.`},
        {do:`Row 2 from $x_2=0\\cdot s_1+1\\cdot s_2$ gives $[0,1]$.`, why:`Read off the coefficients for the second recording.`}
      ],
      answer:`$A=\\begin{bmatrix}1&1\\\\0&1\\end{bmatrix}$.` },

    { q:`<p>Find the inverse of $A=\\begin{bmatrix}1&1\\\\0&1\\end{bmatrix}$ (the unmixing matrix $W$).</p>`,
      steps:[
        {do:`For $\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}$, $\\det=ad-bc=1\\cdot1-1\\cdot0=1$.`, why:`The 2x2 inverse formula divides by the determinant.`},
        {do:`$W=\\frac{1}{1}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix}=\\begin{bmatrix}1&-1\\\\0&1\\end{bmatrix}$.`, why:`Swap the diagonal, negate the off-diagonal, divide by $\\det$.`}
      ],
      answer:`$W=\\begin{bmatrix}1&-1\\\\0&1\\end{bmatrix}$.` },

    { q:`<p>With $W=\\begin{bmatrix}1&-1\\\\0&1\\end{bmatrix}$ and recordings $x_1=5$, $x_2=2$, recover the sources.</p>`,
      steps:[
        {do:`$s_1=1\\cdot5+(-1)\\cdot2=5-2=3$.`, why:`Apply the first row of $W$ to $x$.`},
        {do:`$s_2=0\\cdot5+1\\cdot2=2$.`, why:`Apply the second row of $W$ to $x$.`}
      ],
      answer:`$s_1=3$, $s_2=2$.` },

    { q:`<p>Why can't PCA solve the cocktail-party problem that ICA solves? State the key difference.</p>`,
      steps:[
        {do:`PCA finds directions of maximum variance (uncorrelated).`, why:`PCA only removes linear correlation, a weaker condition.`},
        {do:`ICA finds statistically independent signals.`, why:`Independence is stronger than uncorrelatedness and is what unmixes the voices.`}
      ],
      answer:`PCA only decorrelates; ICA requires full independence, which is what separates the sources.` },

    { q:`<p>Mixing matrix $A=\\begin{bmatrix}2&0\\\\0&3\\end{bmatrix}$. Find $W=A^{-1}$.</p>`,
      steps:[
        {do:`For a diagonal matrix, invert each diagonal entry.`, why:`A diagonal matrix's inverse just reciprocates the diagonal.`},
        {do:`$W=\\begin{bmatrix}1/2&0\\\\0&1/3\\end{bmatrix}$.`, why:`$\\frac{1}{2}$ and $\\frac{1}{3}$ undo the scaling.`}
      ],
      answer:`$W=\\begin{bmatrix}1/2&0\\\\0&1/3\\end{bmatrix}$.` },

    { q:`<p>ICA recovers sources only "up to scale and order". If the true source is $s_1=4$ but ICA outputs $8$, what scale factor did it apply?</p>`,
      steps:[
        {do:`Output over truth: $\\frac{8}{4}=2$.`, why:`A scale ambiguity means each source may be multiplied by a constant.`},
        {do:`So it scaled by $2$.`, why:`ICA cannot pin down the amplitude, only the signal shape.`}
      ],
      answer:`A scale factor of $2$; this ambiguity is expected in ICA.` },

    { q:`<p>ICA needs non-Gaussian sources. Two independent signals are both Gaussian. Can ICA separate them? Why?</p>`,
      steps:[
        {do:`A mix of Gaussians is still Gaussian and rotationally symmetric.`, why:`Gaussians look the same in every rotated direction.`},
        {do:`So there is no unique unmixing direction.`, why:`ICA relies on non-Gaussianity to find the right rotation.`}
      ],
      answer:`No — purely Gaussian sources cannot be separated by ICA.` },

    { q:`<p>Recordings $x_1=10$, $x_2=4$. Mixing $A=\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}$. Find $W$, then recover $s$.</p>`,
      steps:[
        {do:`$\\det=1\\cdot(-1)-1\\cdot1=-2$. $W=\\frac{1}{-2}\\begin{bmatrix}-1&-1\\\\-1&1\\end{bmatrix}=\\begin{bmatrix}0.5&0.5\\\\0.5&-0.5\\end{bmatrix}$.`, why:`Use the 2x2 inverse formula.`},
        {do:`$s_1=0.5(10)+0.5(4)=7$.`, why:`Apply the first row of $W$ to $x$.`},
        {do:`$s_2=0.5(10)-0.5(4)=3$.`, why:`Apply the second row of $W$ to $x$.`}
      ],
      answer:`$s_1=7$, $s_2=3$.` },

    { q:`<p>To unmix $n$ signals you need $n$ recordings. Three speakers are recorded by only $2$ microphones. Can ICA fully separate all three?</p>`,
      steps:[
        {do:`Sources $=3$, recordings $=2$.`, why:`Standard ICA needs at least as many recordings as sources.`},
        {do:`With fewer recordings than sources, the mixing matrix is not invertible.`, why:`A non-square $A$ has no plain inverse, so $W=A^{-1}$ does not exist.`}
      ],
      answer:`No — $2$ mics cannot fully separate $3$ sources (underdetermined).` }
  ],

  /* ------------------------------------------------------------ */
  "ml-classification-metrics": [
    { q:`<p>A classifier gives TP$=50$, FP$=10$. Find precision.</p>`,
      steps:[
        {do:`Add the positive predictions: $TP+FP=50+10=60$.`, why:`Precision's bottom is every point the model called "yes".`},
        {do:`Precision $=\\frac{TP}{TP+FP}=\\frac{50}{60}\\approx0.83$.`, why:`Precision is correct positives over all positive predictions.`}
      ],
      answer:`Precision $\\approx0.83$.` },

    { q:`<p>TP$=50$, FN$=50$. Find recall.</p>`,
      steps:[
        {do:`Add the real positives: $TP+FN=50+50=100$.`, why:`Recall's bottom is every point that was truly "yes".`},
        {do:`Recall $=\\frac{TP}{TP+FN}=\\frac{50}{100}=0.5$.`, why:`Recall is caught positives over all real positives.`}
      ],
      answer:`Recall $=0.5$.` },

    { q:`<p>Confusion matrix: TP$=20$, FP$=5$, FN$=5$, TN$=70$. Find accuracy.</p>`,
      steps:[
        {do:`Accuracy $=\\frac{TP+TN}{\\text{all}}=\\frac{20+70}{20+5+5+70}=\\frac{90}{100}$.`, why:`Accuracy is all correct predictions over the total count.`},
        {do:`$\\frac{90}{100}=0.9$.`, why:`Simplify the fraction.`}
      ],
      answer:`Accuracy $=0.9$.` },

    { q:`<p>TP$=40$, FP$=10$, FN$=20$, TN$=30$. Find both precision and recall.</p>`,
      steps:[
        {do:`Precision $=\\frac{40}{40+10}=\\frac{40}{50}=0.8$.`, why:`Precision watches false alarms (FP).`},
        {do:`Recall $=\\frac{40}{40+20}=\\frac{40}{60}\\approx0.67$.`, why:`Recall watches misses (FN).`}
      ],
      answer:`Precision $=0.8$, recall $\\approx0.67$.` },

    { q:`<p>TP$=30$, FP$=10$, FN$=10$. Find the F1 score.</p>`,
      steps:[
        {do:`F1 $=\\frac{2\\,TP}{2\\,TP+FP+FN}=\\frac{2\\cdot30}{2\\cdot30+10+10}$.`, why:`F1 blends precision and recall into one number.`},
        {do:`$=\\frac{60}{60+20}=\\frac{60}{80}=0.75$.`, why:`Compute the numerator and denominator, then divide.`}
      ],
      answer:`F1 $=0.75$.` },

    { q:`<p>A model predicts "yes" for everything. With $90$ real positives and $10$ real negatives, find precision and recall.</p>`,
      steps:[
        {do:`Predicting all yes: TP$=90$, FP$=10$, FN$=0$.`, why:`Every positive is caught, every negative is a false alarm.`},
        {do:`Recall $=\\frac{90}{90+0}=1.0$.`, why:`No positives are missed, so recall is perfect.`},
        {do:`Precision $=\\frac{90}{90+10}=0.9$.`, why:`The $10$ false alarms lower precision.`}
      ],
      answer:`Recall $=1.0$, precision $=0.9$.` },

    { q:`<p>Rare disease: $5$ sick, $95$ healthy. A lazy model predicts "healthy" for all. Find accuracy and the recall for the sick class.</p>`,
      steps:[
        {do:`All-healthy: TN$=95$, FN$=5$, TP$=0$, FP$=0$.`, why:`It catches no sick patients.`},
        {do:`Accuracy $=\\frac{0+95}{100}=0.95$.`, why:`It looks great because healthy dominates.`},
        {do:`Recall $=\\frac{0}{0+5}=0$.`, why:`It misses every sick patient — accuracy hides this.`}
      ],
      answer:`Accuracy $=0.95$ but recall $=0$; accuracy is misleading here.` },

    { q:`<p>Precision $=0.6$ and recall $=0.6$. Find the F1 score.</p>`,
      steps:[
        {do:`F1 $=\\frac{2\\cdot P\\cdot R}{P+R}=\\frac{2\\cdot0.6\\cdot0.6}{0.6+0.6}$.`, why:`F1 is the harmonic mean of precision and recall.`},
        {do:`$=\\frac{0.72}{1.2}=0.6$.`, why:`When precision equals recall, F1 equals that same value.`}
      ],
      answer:`F1 $=0.6$.` },

    { q:`<p>Precision $=1.0$ but recall $=0.2$. Find F1 and explain what F1 reveals.</p>`,
      steps:[
        {do:`F1 $=\\frac{2\\cdot1.0\\cdot0.2}{1.0+0.2}=\\frac{0.4}{1.2}\\approx0.33$.`, why:`The harmonic mean is pulled down by the small value.`},
        {do:`F1 is low despite perfect precision.`, why:`F1 punishes imbalance, exposing the poor recall.`}
      ],
      answer:`F1 $\\approx0.33$; it flags that recall is weak despite perfect precision.` },

    { q:`<p>Two classifiers: A has precision $0.9$, recall $0.5$; B has precision $0.7$, recall $0.7$. Which has the higher F1?</p>`,
      steps:[
        {do:`F1$_A=\\frac{2\\cdot0.9\\cdot0.5}{0.9+0.5}=\\frac{0.9}{1.4}\\approx0.64$.`, why:`Compute the harmonic mean for A.`},
        {do:`F1$_B=\\frac{2\\cdot0.7\\cdot0.7}{0.7+0.7}=\\frac{0.98}{1.4}=0.7$.`, why:`Compute the harmonic mean for B.`},
        {do:`$0.7>0.64$, so B wins.`, why:`Balanced scores give a higher harmonic mean.`}
      ],
      answer:`B has the higher F1 ($0.7$ vs $\\approx0.64$).` }
  ],

  /* ------------------------------------------------------------ */
  "ml-roc-auc": [
    { q:`<p>TP$=30$, FN$=10$. Find the true positive rate (TPR).</p>`,
      steps:[
        {do:`Add the real positives: $TP+FN=30+10=40$.`, why:`TPR's bottom is every point that was truly "yes".`},
        {do:`TPR $=\\frac{TP}{TP+FN}=\\frac{30}{40}=0.75$.`, why:`TPR is the fraction of real positives caught (same as recall).`}
      ],
      answer:`TPR $=0.75$.` },

    { q:`<p>FP$=20$, TN$=80$. Find the false positive rate (FPR).</p>`,
      steps:[
        {do:`Add the real negatives: $FP+TN=20+80=100$.`, why:`FPR's bottom is every point that was truly "no".`},
        {do:`FPR $=\\frac{FP}{FP+TN}=\\frac{20}{100}=0.2$.`, why:`FPR is the fraction of real negatives wrongly flagged.`}
      ],
      answer:`FPR $=0.2$.` },

    { q:`<p>An AUC of $0.5$ means what about the classifier?</p>`,
      steps:[
        {do:`AUC $0.5$ is the diagonal line on the ROC plot.`, why:`The diagonal is the curve of random guessing.`},
        {do:`So it cannot tell the classes apart.`, why:`No skill beyond a coin flip.`}
      ],
      answer:`It is no better than random guessing.` },

    { q:`<p>AUC $=0.9$. In the ranking interpretation, what does this number mean?</p>`,
      steps:[
        {do:`AUC is the chance a random positive scores above a random negative.`, why:`This is the standard probabilistic reading of AUC.`},
        {do:`So $90\\%$ of random positive-negative pairs are ranked correctly.`, why:`Plug $0.9$ into that interpretation.`}
      ],
      answer:`A random positive outranks a random negative $90\\%$ of the time.` },

    { q:`<p>At a strict threshold: TP$=10$, FN$=30$, FP$=2$, TN$=58$. Find the ROC point (FPR, TPR).</p>`,
      steps:[
        {do:`TPR $=\\frac{10}{10+30}=\\frac{10}{40}=0.25$.`, why:`A strict threshold catches few positives.`},
        {do:`FPR $=\\frac{2}{2+58}=\\frac{2}{60}\\approx0.03$.`, why:`A strict threshold also raises few false alarms.`}
      ],
      answer:`Point $\\approx(0.03,\\,0.25)$, near the bottom-left.` },

    { q:`<p>Loosen the threshold: now TP$=38$, FN$=2$, FP$=40$, TN$=20$. Find the new ROC point.</p>`,
      steps:[
        {do:`TPR $=\\frac{38}{38+2}=\\frac{38}{40}=0.95$.`, why:`Loosening catches more real positives.`},
        {do:`FPR $=\\frac{40}{40+20}=\\frac{40}{60}\\approx0.67$.`, why:`But it also raises more false alarms.`}
      ],
      answer:`Point $\\approx(0.67,\\,0.95)$, toward the top-right.` },

    { q:`<p>A perfect classifier passes through which ROC point, and what is its AUC?</p>`,
      steps:[
        {do:`Perfect means TPR$=1$ and FPR$=0$.`, why:`It catches all positives and raises no false alarms.`},
        {do:`That is the point $(0,1)$, the top-left corner.`, why:`The ROC curve hugs the corner.`},
        {do:`The area under it is the full unit square: AUC$=1$.`, why:`A perfect curve covers the whole area.`}
      ],
      answer:`Point $(0,1)$; AUC $=1$.` },

    { q:`<p>Scores: positives at $0.9, 0.8$; negatives at $0.4, 0.3$. Are all positive-negative pairs ranked correctly? What is the AUC?</p>`,
      steps:[
        {do:`Every positive score ($0.9,0.8$) exceeds every negative ($0.4,0.3$).`, why:`AUC counts how often a positive outranks a negative.`},
        {do:`All $2\\times2=4$ pairs are correct.`, why:`Perfect separation of scores.`},
        {do:`AUC $=\\frac{4}{4}=1$.`, why:`Correct pairs over total pairs.`}
      ],
      answer:`All $4$ pairs correct; AUC $=1$.` },

    { q:`<p>Scores: positives at $0.9, 0.4$; negatives at $0.6, 0.3$. Count correctly ranked pairs and find the AUC.</p>`,
      steps:[
        {do:`Pairs: $(0.9,0.6)$ ok, $(0.9,0.3)$ ok, $(0.4,0.6)$ wrong, $(0.4,0.3)$ ok.`, why:`A pair is correct if the positive's score is higher.`},
        {do:`Correct $=3$ out of $4$.`, why:`Count the correctly ordered pairs.`},
        {do:`AUC $=\\frac{3}{4}=0.75$.`, why:`AUC is correct pairs over total pairs.`}
      ],
      answer:`$3/4$ correct; AUC $=0.75$.` },

    { q:`<p>The ROC curve has points $(0,0)$, $(0,1)$, $(1,1)$ in order. Compute the AUC as an area.</p>`,
      steps:[
        {do:`From $(0,0)$ up to $(0,1)$: the curve rises along the left edge.`, why:`The curve jumps straight up at FPR$=0$.`},
        {do:`From $(0,1)$ across to $(1,1)$: it runs along the top.`, why:`TPR stays at $1$ as FPR grows.`},
        {do:`The enclosed region is the full $1\\times1$ square, area $=1$.`, why:`The curve bounds the whole unit square.`}
      ],
      answer:`AUC $=1$ (a perfect classifier).` }
  ],

  /* ------------------------------------------------------------ */
  "ml-regression-metrics": [
    { q:`<p>$SS_{res}=10$, $SS_{tot}=40$. Find $R^2$.</p>`,
      steps:[
        {do:`$R^2=1-\\frac{SS_{res}}{SS_{tot}}=1-\\frac{10}{40}=1-0.25$.`, why:`$R^2$ compares your error to the baseline's error.`},
        {do:`$=0.75$.`, why:`Subtract to get the explained fraction.`}
      ],
      answer:`$R^2=0.75$.` },

    { q:`<p>Truths $y=2,4,6$ with predictions $\\hat{y}=2,4,6$. Find $SS_{res}$.</p>`,
      steps:[
        {do:`Residuals: $2-2=0$, $4-4=0$, $6-6=0$.`, why:`$SS_{res}$ sums squared prediction errors.`},
        {do:`Sum of squares: $0+0+0=0$.`, why:`Perfect predictions give zero residual error.`}
      ],
      answer:`$SS_{res}=0$ (a perfect fit).` },

    { q:`<p>Truths $y=1,2,3$. Find $SS_{tot}$ (mean $\\bar{y}=2$).</p>`,
      steps:[
        {do:`Deviations from the mean: $1-2=-1$, $2-2=0$, $3-2=1$.`, why:`$SS_{tot}$ sums squared distances from the mean.`},
        {do:`Squares: $1+0+1=2$.`, why:`This is the baseline (predict-the-mean) error.`}
      ],
      answer:`$SS_{tot}=2$.` },

    { q:`<p>$SS_{res}=2$ over $m=2$ examples. Find the RMSE.</p>`,
      steps:[
        {do:`Mean squared error: $\\frac{SS_{res}}{m}=\\frac{2}{2}=1$.`, why:`RMSE first averages the squared errors.`},
        {do:`RMSE $=\\sqrt{1}=1$.`, why:`Take the square root to return to $y$'s units.`}
      ],
      answer:`RMSE $=1$.` },

    { q:`<p>Residuals (errors) are $3, 4$. Find the RMSE over these $m=2$ points.</p>`,
      steps:[
        {do:`Square: $3^2=9$, $4^2=16$. Sum $=25$.`, why:`RMSE uses squared residuals.`},
        {do:`Average: $\\frac{25}{2}=12.5$. RMSE $=\\sqrt{12.5}\\approx3.54$.`, why:`Average then square-root.`}
      ],
      answer:`RMSE $\\approx3.54$.` },

    { q:`<p>If a model predicts the mean for every point, what are $SS_{res}$ versus $SS_{tot}$, and what is $R^2$?</p>`,
      steps:[
        {do:`Predicting the mean means $\\hat{y}=\\bar{y}$, so $SS_{res}=SS_{tot}$.`, why:`Its residuals equal the deviations from the mean.`},
        {do:`$R^2=1-\\frac{SS_{tot}}{SS_{tot}}=1-1=0$.`, why:`No improvement over the baseline gives $R^2=0$.`}
      ],
      answer:`$SS_{res}=SS_{tot}$, so $R^2=0$.` },

    { q:`<p>Truths $y=1,2,3$ (mean $2$). Predictions $\\hat{y}=1.5,2,2.5$. Find $SS_{res}$, then $R^2$ (use $SS_{tot}=2$).</p>`,
      steps:[
        {do:`Residuals: $1-1.5=-0.5$, $2-2=0$, $3-2.5=0.5$.`, why:`Find each prediction error.`},
        {do:`$SS_{res}=0.25+0+0.25=0.5$.`, why:`Sum the squared residuals.`},
        {do:`$R^2=1-\\frac{0.5}{2}=1-0.25=0.75$.`, why:`Plug into the $R^2$ formula.`}
      ],
      answer:`$SS_{res}=0.5$, $R^2=0.75$.` },

    { q:`<p>A model has $SS_{res}=60$ but $SS_{tot}=50$. Find $R^2$ and explain the sign.</p>`,
      steps:[
        {do:`$R^2=1-\\frac{60}{50}=1-1.2=-0.2$.`, why:`Plug into the formula even if it goes negative.`},
        {do:`$R^2<0$ means the model is worse than predicting the mean.`, why:`Its error exceeds the baseline's, so it explains negative variance.`}
      ],
      answer:`$R^2=-0.2$; the model is worse than just guessing the mean.` },

    { q:`<p>Truths $y=10,20,30$ (mean $20$). Predictions $\\hat{y}=12,18,33$. Find $R^2$.</p>`,
      steps:[
        {do:`Residuals: $-2,2,-3$. $SS_{res}=4+4+9=17$.`, why:`Sum the squared prediction errors.`},
        {do:`Deviations from mean: $-10,0,10$. $SS_{tot}=100+0+100=200$.`, why:`Sum the squared deviations from the mean.`},
        {do:`$R^2=1-\\frac{17}{200}=1-0.085=0.915$.`, why:`Plug into the $R^2$ formula.`}
      ],
      answer:`$R^2\\approx0.915$.` },

    { q:`<p>Model A has RMSE $5$, model B has RMSE $8$, both on the same data. Which fits better, and roughly how much smaller is A's typical error?</p>`,
      steps:[
        {do:`Lower RMSE means smaller typical error.`, why:`RMSE is the typical error size in $y$'s units.`},
        {do:`A's RMSE $5<8$, so A fits better.`, why:`Compare the two values directly.`},
        {do:`Gap: $8-5=3$ units.`, why:`A's typical miss is about $3$ units smaller.`}
      ],
      answer:`Model A fits better; its typical error is about $3$ units smaller.` }
  ],

  /* ------------------------------------------------------------ */
  "ml-regularization": [
    { q:`<p>Weights $\\theta=[3,4]$. Find the L2 penalty $\\lVert\\theta\\rVert_2^2=\\sum\\theta_j^2$.</p>`,
      steps:[
        {do:`Square each: $3^2=9$, $4^2=16$.`, why:`The squared L2 norm sums the squared weights.`},
        {do:`Sum: $9+16=25$.`, why:`Add the squares for the penalty.`}
      ],
      answer:`L2 penalty $=25$.` },

    { q:`<p>Weights $\\theta=[3,-4]$. Find the L1 penalty $\\lVert\\theta\\rVert_1=\\sum|\\theta_j|$.</p>`,
      steps:[
        {do:`Absolute values: $|3|=3$, $|-4|=4$.`, why:`The L1 norm sums the absolute values.`},
        {do:`Sum: $3+4=7$.`, why:`Add the magnitudes for the penalty.`}
      ],
      answer:`L1 penalty $=7$.` },

    { q:`<p>Weights $\\theta=[2,-2]$, $\\lambda=0.5$. Find the L2 penalty term $\\lambda\\lVert\\theta\\rVert_2^2$.</p>`,
      steps:[
        {do:`$\\lVert\\theta\\rVert_2^2=2^2+(-2)^2=4+4=8$.`, why:`First compute the squared L2 norm.`},
        {do:`Multiply by $\\lambda$: $0.5\\times8=4$.`, why:`The penalty term scales the norm by $\\lambda$.`}
      ],
      answer:`Penalty term $=4$.` },

    { q:`<p>Weights $\\theta=[1,-3,2]$, $\\lambda=2$. Find the L1 penalty term $\\lambda\\lVert\\theta\\rVert_1$.</p>`,
      steps:[
        {do:`$\\lVert\\theta\\rVert_1=|1|+|-3|+|2|=1+3+2=6$.`, why:`Sum the absolute values for the L1 norm.`},
        {do:`Multiply by $\\lambda$: $2\\times6=12$.`, why:`Scale by the regularization strength.`}
      ],
      answer:`Penalty term $=12$.` },

    { q:`<p>Weights $\\theta=[6,8]$. Compare the L1 and (squared) L2 penalties.</p>`,
      steps:[
        {do:`L1 $=|6|+|8|=14$.`, why:`L1 sums absolute values.`},
        {do:`L2 (squared) $=6^2+8^2=36+64=100$.`, why:`Squared L2 sums squared weights.`},
        {do:`L2 is far larger, $100$ vs $14$.`, why:`Squaring punishes big weights much harder.`}
      ],
      answer:`L1 $=14$, L2 $=100$; L2 penalizes large weights more.` },

    { q:`<p>Data-fit cost is $20$. Weights $\\theta=[3,4]$, $\\lambda=1$, squared L2. Find the total regularized cost.</p>`,
      steps:[
        {do:`L2 penalty: $3^2+4^2=25$. Term $=1\\times25=25$.`, why:`The penalty adds to the data-fit cost.`},
        {do:`Total: $20+25=45$.`, why:`Regularized cost = fit cost + penalty.`}
      ],
      answer:`Total cost $=45$.` },

    { q:`<p>You want a model that drops useless features by setting weights exactly to zero. Pick Ridge (L2) or LASSO (L1), and say why.</p>`,
      steps:[
        {do:`LASSO uses the absolute-value (L1) penalty.`, why:`L1's shape drives weak weights all the way to zero.`},
        {do:`Ridge (L2) only shrinks weights toward zero, rarely hitting it.`, why:`The squared penalty fades near zero, leaving small nonzero weights.`}
      ],
      answer:`Use LASSO (L1) — it zeros out useless features.` },

    { q:`<p>5-fold cross-validation gives average test errors: $\\lambda=0.1\\to0.30$, $\\lambda=1\\to0.22$, $\\lambda=10\\to0.28$. Which $\\lambda$ do you pick?</p>`,
      steps:[
        {do:`Compare the average errors: $0.30$, $0.22$, $0.28$.`, why:`Cross-validation picks the $\\lambda$ with the lowest held-out error.`},
        {do:`Smallest is $0.22$ at $\\lambda=1$.`, why:`That $\\lambda$ generalizes best.`}
      ],
      answer:`Pick $\\lambda=1$.` },

    { q:`<p>As $\\lambda\\to\\infty$, what happens to the weights and to bias/variance?</p>`,
      steps:[
        {do:`A huge $\\lambda$ makes the penalty dominate, so weights shrink toward $0$.`, why:`The cost cares almost only about small weights.`},
        {do:`The model gets simpler: bias rises, variance falls.`, why:`Strong shrinkage underfits, trading variance for bias.`}
      ],
      answer:`Weights go to $\\approx0$; bias increases and variance decreases (underfitting).` },

    { q:`<p>Two weight vectors give the same data-fit cost: $\\theta_A=[5,0]$ and $\\theta_B=[3,4]$. With squared L2 regularization, which does Ridge prefer?</p>`,
      steps:[
        {do:`L2$_A=5^2+0^2=25$.`, why:`Compute the squared L2 norm of A.`},
        {do:`L2$_B=3^2+4^2=9+16=25$.`, why:`Compute the squared L2 norm of B.`},
        {do:`Both equal $25$, so Ridge is indifferent here.`, why:`Equal penalties and equal fit mean equal total cost.`}
      ],
      answer:`A tie — both have L2 penalty $25$, so Ridge has no preference.` }
  ]

});
})();
