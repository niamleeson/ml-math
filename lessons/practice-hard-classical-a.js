/* =====================================================================
   PRACTICE SET — MODULE 09 (A): CLASSICAL ML (beyond the cheat sheet)
   Owned ids: cls-gmm, cls-dbscan, cls-spectral-clustering, cls-lda-qda,
              cls-gaussian-process, cls-bayesian-regression,
              cls-gradient-boosting
   ~16-20 problems per id, easy -> hard. Every step has BOTH do and why.
   Numbers are tiny and hand-checkable.
   ===================================================================== */
(function(){
  var P = window.PRACTICE;
  function add(id, probs){ P[id] = (P[id] || []).concat(probs); }

  /* ================================================================ */
  /* 1. GAUSSIAN MIXTURE MODELS                                       */
  /* ================================================================ */
  add("cls-gmm", [
    {
      q: `<p>A GMM has $K=3$ components with mixing weights $\\pi_1=0.5,\\ \\pi_2=0.3$. What is $\\pi_3$?</p>`,
      steps: [
        { do: `The mixing weights must sum to 1: $\\sum_k \\pi_k = 1$.`, why: `Each $\\pi_k$ is the fraction of data owned by blob $k$; fractions of the whole add to 1.` },
        { do: `Solve $\\pi_3 = 1 - 0.5 - 0.3 = 0.2$.`, why: `The leftover fraction belongs to the third blob.` }
      ],
      answer: `$\\pi_3 = 0.2$`
    },
    {
      q: `<p>For a point, the weighted blob scores are $\\pi_1\\mathcal{N}_1 = 0.08$ and $\\pi_2\\mathcal{N}_2 = 0.02$. Find the responsibility $\\gamma_1$.</p>`,
      steps: [
        { do: `Apply $\\gamma_1 = \\frac{\\pi_1\\mathcal{N}_1}{\\pi_1\\mathcal{N}_1 + \\pi_2\\mathcal{N}_2}$.`, why: `Responsibility normalizes each blob's claim so the claims add to 1.` },
        { do: `Compute $\\gamma_1 = \\frac{0.08}{0.08+0.02} = \\frac{0.08}{0.10} = 0.8$.`, why: `The point belongs 80% to blob 1.` }
      ],
      answer: `$\\gamma_1 = 0.8$`
    },
    {
      q: `<p>In the same problem, what is $\\gamma_2$, the responsibility of blob 2?</p>`,
      steps: [
        { do: `Responsibilities over all blobs sum to 1: $\\gamma_2 = 1 - \\gamma_1$.`, why: `Each point is fully distributed among the blobs.` },
        { do: `Compute $\\gamma_2 = 1 - 0.8 = 0.2$.`, why: `The remaining 20% claim goes to blob 2.` }
      ],
      answer: `$\\gamma_2 = 0.2$`
    },
    {
      q: `<p>A 1-D Gaussian has $\\mu=5,\\ \\sigma=1$. Evaluate the bell $\\mathcal{N}(x;5,1)$ at $x=5$. Use $\\frac{1}{\\sqrt{2\\pi}}\\approx 0.399$.</p>`,
      steps: [
        { do: `Use $\\mathcal{N}(x;\\mu,\\sigma)=\\frac{1}{\\sqrt{2\\pi}\\,\\sigma}e^{-(x-\\mu)^2/(2\\sigma^2)}$.`, why: `This is the normal density in one dimension.` },
        { do: `At $x=\\mu=5$ the exponent is $-(5-5)^2/2 = 0$, so $e^0 = 1$.`, why: `The bell peaks at its mean.` },
        { do: `Value $= 0.399 \\times 1 = 0.399$.`, why: `With $\\sigma=1$ the leading constant is $0.399$.` }
      ],
      answer: `$\\mathcal{N}(5;5,1)\\approx 0.399$`
    },
    {
      q: `<p>Two blobs, equal weights $\\pi_A=\\pi_B=0.5$. At a point the bells are $\\mathcal{N}_A=0.30$ and $\\mathcal{N}_B=0.10$. Find $\\gamma_A$.</p>`,
      steps: [
        { do: `Weight each bell: $\\pi_A\\mathcal{N}_A = 0.5(0.30)=0.15$, $\\pi_B\\mathcal{N}_B = 0.5(0.10)=0.05$.`, why: `The E-step uses prior $\\times$ likelihood.` },
        { do: `Normalize: $\\gamma_A = \\frac{0.15}{0.15+0.05} = \\frac{0.15}{0.20} = 0.75$.`, why: `Equal priors mean the ratio is set purely by the bell values here.` }
      ],
      answer: `$\\gamma_A = 0.75$`
    },
    {
      q: `<p>The total density of a point is the mixture $p(x)=\\sum_k \\pi_k \\mathcal{N}_k$. With $\\pi_A\\mathcal{N}_A=0.12$ and $\\pi_B\\mathcal{N}_B=0.04$, what is $p(x)$?</p>`,
      steps: [
        { do: `Sum the weighted bells: $p(x)=0.12+0.04$.`, why: `The mixture density is the weighted sum over all components.` },
        { do: `So $p(x)=0.16$.`, why: `This is also the denominator used when normalizing responsibilities.` }
      ],
      answer: `$p(x)=0.16$`
    },
    {
      q: `<p>A blob at $\\mu=8,\\ \\sigma=1$. Evaluate its bell at $x=6$. Use $\\frac{1}{\\sqrt{2\\pi}}\\approx 0.399$ and $e^{-2}\\approx 0.135$.</p>`,
      steps: [
        { do: `Exponent $=-(6-8)^2/(2\\cdot 1)= -4/2 = -2$.`, why: `Squared distance from the mean, scaled by $2\\sigma^2$.` },
        { do: `Value $= 0.399\\times e^{-2} = 0.399\\times 0.135 \\approx 0.054$.`, why: `Multiply the leading constant by the exponential factor.` }
      ],
      answer: `$\\mathcal{N}(6;8,1)\\approx 0.054$`
    },
    {
      q: `<p>M-step for a 1-D blob. Three points $x=[2,4,6]$ have responsibilities $\\gamma=[1.0,\\ 0.5,\\ 0.0]$ for this blob. Compute the updated mean $\\mu$.</p>`,
      steps: [
        { do: `Use $\\mu = \\frac{\\sum_i \\gamma_i x_i}{\\sum_i \\gamma_i}$.`, why: `The M-step recenters the blob as a responsibility-weighted average of the points.` },
        { do: `Numerator $= 1.0(2)+0.5(4)+0.0(6) = 2+2+0 = 4$.`, why: `Each point is weighted by how much the blob claims it.` },
        { do: `Denominator $= 1.0+0.5+0.0 = 1.5$. So $\\mu = 4/1.5 \\approx 2.67$.`, why: `Dividing by the total claim gives a proper weighted mean.` }
      ],
      answer: `$\\mu \\approx 2.67$`
    },
    {
      q: `<p>The effective count for a blob is $N_k=\\sum_i \\gamma_{ik}$. With $N=4$ total points and $N_k=1.5$, find the updated mixing weight $\\pi_k$.</p>`,
      steps: [
        { do: `Use $\\pi_k = N_k / N$.`, why: `The new weight is the blob's share of the total (soft) point count.` },
        { do: `Compute $\\pi_k = 1.5/4 = 0.375$.`, why: `The blob softly owns 1.5 of the 4 points.` }
      ],
      answer: `$\\pi_k = 0.375$`
    },
    {
      q: `<p>Two blobs with $N_1=2.5$ and $N_2=1.5$ over $N=4$ points. Verify the updated weights sum to 1.</p>`,
      steps: [
        { do: `$\\pi_1 = 2.5/4 = 0.625$ and $\\pi_2 = 1.5/4 = 0.375$.`, why: `Each weight is the blob's effective count over the total.` },
        { do: `Sum: $0.625 + 0.375 = 1.0$.`, why: `Because $\\sum_k N_k = N$, the updated weights always sum to 1.` }
      ],
      answer: `$\\pi_1+\\pi_2 = 1$ (0.625 + 0.375)`
    },
    {
      q: `<p>One feature, two blobs. Point $x=6$. Blob A: $\\mu_A=5,\\sigma_A=1,\\pi_A=0.5$. Blob B: $\\mu_B=8,\\sigma_B=1,\\pi_B=0.5$. Find $\\gamma_A$. Use $e^{-0.5}\\approx 0.607,\\ e^{-2}\\approx 0.135$.</p>`,
      steps: [
        { do: `Bell A at 6: exponent $-(6-5)^2/2=-0.5$, so $\\mathcal{N}_A=0.399(0.607)\\approx 0.242$.`, why: `Point is 1 unit from A's mean.` },
        { do: `Bell B at 6: exponent $-(6-8)^2/2=-2$, so $\\mathcal{N}_B=0.399(0.135)\\approx 0.054$.`, why: `Point is 2 units from B's mean, so its bell is smaller.` },
        { do: `Weight: $\\pi_A\\mathcal{N}_A=0.121$, $\\pi_B\\mathcal{N}_B=0.027$.`, why: `Equal priors scale both equally.` },
        { do: `$\\gamma_A = \\frac{0.121}{0.121+0.027}=\\frac{0.121}{0.148}\\approx 0.82$.`, why: `Point is closer to A, so A claims most of it.` }
      ],
      answer: `$\\gamma_A \\approx 0.82$`
    },
    {
      q: `<p>M-step variance update (1-D). After computing $\\mu=4$, the three points $x=[2,4,6]$ have responsibilities $\\gamma=[1.0,0.5,0.0]$. Compute the updated variance $\\sigma^2 = \\frac{\\sum_i \\gamma_i (x_i-\\mu)^2}{\\sum_i \\gamma_i}$.</p>`,
      steps: [
        { do: `Squared deviations: $(2-4)^2=4,\\ (4-4)^2=0,\\ (6-4)^2=4$.`, why: `Variance measures spread around the new mean.` },
        { do: `Weighted sum $= 1.0(4)+0.5(0)+0.0(4) = 4$.`, why: `Each deviation is weighted by the blob's claim on that point.` },
        { do: `Divide by $\\sum\\gamma = 1.5$: $\\sigma^2 = 4/1.5 \\approx 2.67$.`, why: `Normalizing by the total claim gives the weighted variance.` }
      ],
      answer: `$\\sigma^2 \\approx 2.67$`
    },
    {
      q: `<p>Three blobs, equal weights $1/3$ each. Bells at a point: $\\mathcal{N}_1=0.6,\\ \\mathcal{N}_2=0.3,\\ \\mathcal{N}_3=0.1$. Find $\\gamma_2$.</p>`,
      steps: [
        { do: `Equal priors cancel in the ratio, so $\\gamma_2 = \\frac{\\mathcal{N}_2}{\\mathcal{N}_1+\\mathcal{N}_2+\\mathcal{N}_3}$.`, why: `When all $\\pi_k$ are equal, only the bell values matter.` },
        { do: `Compute $\\gamma_2 = \\frac{0.3}{0.6+0.3+0.1} = \\frac{0.3}{1.0} = 0.3$.`, why: `The denominator is the total bell mass at the point.` }
      ],
      answer: `$\\gamma_2 = 0.3$`
    },
    {
      q: `<p>Unequal priors. Blob A: $\\pi_A=0.8,\\ \\mathcal{N}_A=0.1$. Blob B: $\\pi_B=0.2,\\ \\mathcal{N}_B=0.4$. Which blob claims the point more, and what is $\\gamma_A$?</p>`,
      steps: [
        { do: `Weighted scores: $\\pi_A\\mathcal{N}_A = 0.8(0.1)=0.08$, $\\pi_B\\mathcal{N}_B = 0.2(0.4)=0.08$.`, why: `The prior multiplies the likelihood; a strong prior can offset a weaker bell.` },
        { do: `$\\gamma_A = \\frac{0.08}{0.08+0.08} = 0.5$.`, why: `The two claims are exactly equal, so the point is split 50/50.` }
      ],
      answer: `$\\gamma_A = 0.5$ (tie)`
    },
    {
      q: `<p>Why is GMM called "soft" clustering compared with k-means? Answer conceptually using $\\gamma_k$.</p>`,
      steps: [
        { do: `k-means assigns each point one hard label (membership 0 or 1).`, why: `It picks the single nearest centroid with no in-between.` },
        { do: `GMM assigns fractional responsibilities $\\gamma_k\\in[0,1]$ with $\\sum_k \\gamma_k = 1$.`, why: `A point can be e.g. 70% blob A, 30% blob B — partial membership.` },
        { do: `This softness comes from Bayes' rule weighting prior $\\times$ likelihood across all blobs.`, why: `The E-step distributes the point probabilistically rather than committing.` }
      ],
      answer: `GMM gives fractional memberships $\\gamma_k$ summing to 1; k-means gives a single hard 0/1 label.`
    },
    {
      q: `<p>A point sits far from every blob, so all bells are tiny: $\\pi_A\\mathcal{N}_A=10^{-9}$, $\\pi_B\\mathcal{N}_B=3\\times 10^{-9}$. Find $\\gamma_B$, and explain why responsibilities stay well-defined.</p>`,
      steps: [
        { do: `$\\gamma_B = \\frac{3\\times10^{-9}}{10^{-9}+3\\times10^{-9}} = \\frac{3}{4} = 0.75$.`, why: `Normalizing divides out the common tiny magnitude.` },
        { do: `The ratio depends only on relative bell sizes, not absolute ones.`, why: `Even where $p(x)$ is minuscule, $\\gamma$ is a well-defined fraction.` }
      ],
      answer: `$\\gamma_B = 0.75$`
    },
    {
      q: `<p>One EM iteration, 1-D, two blobs, equal start weights $0.5$. Points $x=[0,1,5,6]$. Initial means $\\mu_A=0,\\ \\mu_B=6$, $\\sigma=1$ each. Approximate the E-step responsibilities $\\gamma_A$ for each point, then say where the means move.</p>`,
      steps: [
        { do: `Each point is far closer to one mean. $x=0$: dist 0 to A, 6 to B, so $\\gamma_A\\approx 1$.`, why: `The bell decays as $e^{-\\text{dist}^2/2}$, so the nearer mean dominates hugely.` },
        { do: `$x=1$: dist 1 to A, 5 to B, so $\\gamma_A\\approx 1$. $x=5,6$: nearer B, so $\\gamma_A\\approx 0$.`, why: `A squared-distance gap of many units makes one bell astronomically larger.` },
        { do: `M-step then recenters: $\\mu_A\\approx \\text{mean}(0,1)=0.5$, $\\mu_B\\approx \\text{mean}(5,6)=5.5$.`, why: `Each blob moves to the (nearly) hard-assigned points it owns.` }
      ],
      answer: `$\\gamma_A\\approx[1,1,0,0]$; blob A owns $\\{0,1\\}\\Rightarrow\\mu_A\\to0.5$, blob B owns $\\{5,6\\}\\Rightarrow\\mu_B\\to5.5$.`
    },
    {
      q: `<p>Anomaly detection with a fitted GMM. Point P has mixture density $p(\\text{P})=0.0004$; typical points have $p\\approx 0.2$. Is P likely an anomaly? Justify with the formula.</p>`,
      steps: [
        { do: `Recall $p(x)=\\sum_k \\pi_k \\mathcal{N}_k$ is the model's likelihood of the point.`, why: `A point that fits no blob well gets a low total density.` },
        { do: `P's density $0.0004$ is hundreds of times below typical $0.2$.`, why: `It lies in a low-probability region under every component.` },
        { do: `Flag P as an anomaly.`, why: `Low $p(x)$ is the standard GMM anomaly criterion.` }
      ],
      answer: `Yes — P is an anomaly because its mixture density $p(x)=0.0004$ is far below the typical $\\approx 0.2$.`
    },
    {
      q: `<p>Why can each EM iteration never decrease the data log-likelihood? Give the one-line reason.</p>`,
      steps: [
        { do: `The E-step sets responsibilities to the exact posterior, making a lower bound on the log-likelihood tight.`, why: `Using $\\gamma=p(z\\mid x)$ closes the gap (Jensen's bound becomes an equality).` },
        { do: `The M-step maximizes that bound over the parameters.`, why: `Maximizing a tight lower bound cannot lower the true objective it touches.` },
        { do: `So the log-likelihood is non-decreasing and EM climbs to a local maximum.`, why: `Each round either raises it or leaves it unchanged.` }
      ],
      answer: `Each E-step makes a tight lower bound and each M-step maximizes it, so $\\log p(\\text{data})$ never decreases.`
    }
  ]);

  /* ================================================================ */
  /* 2. DBSCAN                                                        */
  /* ================================================================ */
  add("cls-dbscan", [
    {
      q: `<p>DBSCAN has $\\varepsilon=1.0$ and minPts $=3$. A point $p$ has 4 other points within distance $1.0$. Is $p$ a core point?</p>`,
      steps: [
        { do: `Count the neighborhood including $p$ itself: $|N_\\varepsilon(p)| = 4+1 = 5$.`, why: `The standard rule counts the point itself in its $\\varepsilon$-neighborhood.` },
        { do: `Check $|N_\\varepsilon(p)| \\ge$ minPts: $5 \\ge 3$ is true.`, why: `A core point must have at least minPts points within $\\varepsilon$.` }
      ],
      answer: `Yes, $p$ is a core point.`
    },
    {
      q: `<p>$\\varepsilon=1.0$, minPts $=4$. Point $q$ has exactly 2 other points within $\\varepsilon$. Is $q$ a core point?</p>`,
      steps: [
        { do: `Neighborhood size $= 2+1 = 3$ (including $q$).`, why: `Always include the point itself.` },
        { do: `$3 < 4 = $ minPts, so $q$ fails the core test.`, why: `Not enough neighbors to sit inside a dense crowd.` }
      ],
      answer: `No, $q$ is not a core point.`
    },
    {
      q: `<p>The point $q$ above is not core, but one of its 2 neighbors IS a core point within $\\varepsilon$. How is $q$ classified?</p>`,
      steps: [
        { do: `A non-core point within $\\varepsilon$ of a core point is a border point.`, why: `Border points sit on the edge of a dense cluster reachable from a core.` },
        { do: `$q$ joins that core point's cluster as a border member.`, why: `Density-reachability pulls $q$ into the cluster even though it is not core.` }
      ],
      answer: `$q$ is a border point and joins the core point's cluster.`
    },
    {
      q: `<p>A point $r$ is not core and has no core point within $\\varepsilon$. How is it classified?</p>`,
      steps: [
        { do: `It is neither core nor reachable from any core point.`, why: `Border requires being within $\\varepsilon$ of some core; $r$ is not.` },
        { do: `Therefore $r$ is noise.`, why: `Points in sparse regions belonging to no cluster are labeled noise.` }
      ],
      answer: `$r$ is a noise point.`
    },
    {
      q: `<p>Compute the Euclidean distance between $a=(0,0)$ and $b=(3,4)$ to test if $b\\in N_\\varepsilon(a)$ for $\\varepsilon=4$.</p>`,
      steps: [
        { do: `Distance $= \\sqrt{(3-0)^2+(4-0)^2} = \\sqrt{9+16} = \\sqrt{25} = 5$.`, why: `Euclidean distance is the straight-line gap.` },
        { do: `Compare $5 > 4 = \\varepsilon$, so $b \\notin N_\\varepsilon(a)$.`, why: `$b$ is outside the radius, so it is not a neighbor.` }
      ],
      answer: `Distance $=5 > 4$, so $b$ is not in $a$'s $\\varepsilon$-neighborhood.`
    },
    {
      q: `<p>Five points on a line: A$=0$, B$=0.5$, C$=1$, D$=5$, E$=5.4$. With $\\varepsilon=1$, minPts $=3$, classify B.</p>`,
      steps: [
        { do: `B's neighbors within 1: A ($0.5$ away) and C ($0.5$ away).`, why: `Both lie inside the radius.` },
        { do: `Counting B itself: $2+1 = 3 \\ge 3$.`, why: `Meets the minPts threshold.` },
        { do: `So B is a core point.`, why: `It has enough neighbors to anchor a dense region.` }
      ],
      answer: `B is a core point.`
    },
    {
      q: `<p>Same line (A$=0$,B$=0.5$,C$=1$,D$=5$,E$=5.4$), $\\varepsilon=1$, minPts $=3$. Classify D.</p>`,
      steps: [
        { do: `D's neighbors within 1: only E ($0.4$ away); C is $4$ away.`, why: `No other point lies within the radius.` },
        { do: `Counting D itself: $1+1 = 2 < 3$, so D is not core.`, why: `Too few neighbors.` },
        { do: `E is also not core, so D has no core neighbor either.`, why: `Border requires a core neighbor, which is absent.` }
      ],
      answer: `D is a noise point.`
    },
    {
      q: `<p>For the same five points, give the final clustering and noise set.</p>`,
      steps: [
        { do: `A, B, C are mutually within $\\varepsilon=1$ and each has $\\ge 3$ in its neighborhood, so all are core and connected.`, why: `Core points within $\\varepsilon$ of each other merge into one cluster.` },
        { do: `D and E are each non-core with no core neighbor.`, why: `They sit alone in a sparse region.` }
      ],
      answer: `One cluster $\\{A,B,C\\}$; noise $\\{D,E\\}$.`
    },
    {
      q: `<p>True or false: the number of clusters $k$ must be chosen in advance for DBSCAN. Explain.</p>`,
      steps: [
        { do: `DBSCAN takes only $\\varepsilon$ and minPts as inputs, not $k$.`, why: `It grows clusters from dense seeds wherever they occur.` },
        { do: `The number of clusters emerges from the density structure.`, why: `Each maximal density-connected region becomes its own cluster automatically.` }
      ],
      answer: `False — DBSCAN discovers the number of clusters; it needs $\\varepsilon$ and minPts, not $k$.`
    },
    {
      q: `<p>What happens to the clustering if $\\varepsilon$ is set far too small (near 0)?</p>`,
      steps: [
        { do: `With tiny $\\varepsilon$, almost no points have neighbors within the radius.`, why: `$N_\\varepsilon(p)$ shrinks to nearly empty.` },
        { do: `Almost every point fails the minPts test and becomes noise.`, why: `No core points form, so no clusters grow.` }
      ],
      answer: `Nearly all points are labeled noise; no clusters form.`
    },
    {
      q: `<p>What happens if $\\varepsilon$ is set far too large?</p>`,
      steps: [
        { do: `With huge $\\varepsilon$, every point sees almost every other point as a neighbor.`, why: `$N_\\varepsilon(p)$ engulfs the whole dataset.` },
        { do: `All points become density-connected into a single cluster.`, why: `Separate blobs merge because cross-gaps now fall inside $\\varepsilon$.` }
      ],
      answer: `Everything merges into one giant cluster.`
    },
    {
      q: `<p>Points on a line: P$=0$, Q$=0.9$, R$=1.8$, S$=2.7$ (evenly spaced by $0.9$). With $\\varepsilon=1$, minPts $=3$, is Q a core point?</p>`,
      steps: [
        { do: `Q's neighbors within 1: P ($0.9$) and R ($0.9$); S is $1.8$ away.`, why: `Only the immediate neighbors fall in the radius.` },
        { do: `Counting Q: $2+1 = 3 \\ge 3$.`, why: `Meets minPts.` }
      ],
      answer: `Yes, Q is a core point.`
    },
    {
      q: `<p>For that chain P,Q,R,S (spacing $0.9$, $\\varepsilon=1$, minPts $=3$), classify endpoint P, and explain density-reachability.</p>`,
      steps: [
        { do: `P's neighbors within 1: only Q ($0.9$); R is $1.8$ away. So $|N_\\varepsilon(P)|=2 < 3$, P is not core.`, why: `An endpoint has only one close neighbor.` },
        { do: `But Q is core and P is within $\\varepsilon$ of Q.`, why: `P is directly density-reachable from the core point Q.` },
        { do: `So P is a border point in Q's cluster.`, why: `A non-core point reachable from a core joins as border.` }
      ],
      answer: `P is a border point (reachable from core point Q).`
    },
    {
      q: `<p>Explain how a border point can sometimes be assigned to a cluster ambiguously when two clusters' cores both reach it.</p>`,
      steps: [
        { do: `A border point is not core, so it does not expand a cluster.`, why: `Only core points trigger neighborhood expansion.` },
        { do: `If core points from two clusters both lie within $\\varepsilon$, the border attaches to whichever core reaches it first.`, why: `The result depends on processing order, since border points are passive.` }
      ],
      answer: `It joins whichever cluster's core reaches it first — assignment is order-dependent (ambiguous).`
    },
    {
      q: `<p>2-D points: O$=(0,0)$, A$=(0.6,0)$, B$=(0,0.6)$, C$=(0.6,0.6)$. With $\\varepsilon=1$, minPts $=4$, is O a core point? (Use $\\sqrt{0.72}\\approx 0.85$.)</p>`,
      steps: [
        { do: `Distances from O: to A $=0.6$, to B $=0.6$, to C $=\\sqrt{0.36+0.36}=\\sqrt{0.72}\\approx 0.85$. All $\\le 1$.`, why: `All three other points fall inside the radius.` },
        { do: `Neighborhood size $= 3+1 = 4 \\ge 4 = $ minPts.`, why: `Including O itself reaches the threshold.` }
      ],
      answer: `Yes, O is a core point.`
    },
    {
      q: `<p>Why is DBSCAN able to find non-convex shapes (rings, crescents) while k-means cannot?</p>`,
      steps: [
        { do: `DBSCAN grows clusters by chaining density-connected points.`, why: `Reachability follows the local density, not a global center.` },
        { do: `A chain of overlapping $\\varepsilon$-neighborhoods can bend along any curve.`, why: `Each step only needs the next point within $\\varepsilon$, so the cluster traces arbitrary shapes.` },
        { do: `k-means assigns by distance to a centroid, carving only convex regions.`, why: `Its decision boundaries are straight, so curved clusters get sliced.` }
      ],
      answer: `DBSCAN chains density-connected neighborhoods, so clusters follow any curve; k-means only forms convex (blob) regions.`
    },
    {
      q: `<p>A common heuristic sets minPts $\\ge D+1$ where $D$ is the data dimension. For 2-D data, what minimum minPts does this suggest, and why have a lower bound?</p>`,
      steps: [
        { do: `For $D=2$, minPts $\\ge D+1 = 3$.`, why: `A small lower bound prevents trivial chains of two points forming clusters.` },
        { do: `Higher minPts gives more robust, noise-resistant cores.`, why: `Requiring more neighbors filters out sparse, noisy regions.` }
      ],
      answer: `minPts $\\ge 3$ for 2-D; the lower bound avoids flimsy clusters and resists noise.`
    },
    {
      q: `<p>Worst-case time complexity. With a naive neighbor scan, how does DBSCAN's runtime scale with $n$ points, and how can it improve?</p>`,
      steps: [
        { do: `Naively, computing each point's neighbors scans all other points: $O(n)$ per point.`, why: `No structure means a full distance pass each time.` },
        { do: `Over $n$ points this is $O(n^2)$.`, why: `Every pair's distance may be examined.` },
        { do: `A spatial index (k-d tree, ball tree) cuts neighbor queries to about $O(\\log n)$, giving $\\approx O(n\\log n)$.`, why: `The index prunes far-away points instead of scanning all of them.` }
      ],
      answer: `Naive $O(n^2)$; with a spatial index roughly $O(n\\log n)$.`
    },
    {
      q: `<p>Reachability subtlety: two core points $p,q$ satisfy $q\\in N_\\varepsilon(p)$. Why are $p$ and $q$ guaranteed to be in the same cluster?</p>`,
      steps: [
        { do: `Euclidean distance is symmetric: $d(p,q)=d(q,p)$, so $q\\in N_\\varepsilon(p)\\iff p\\in N_\\varepsilon(q)$.`, why: `The radius test is the same in both directions.` },
        { do: `Both being core and mutually within $\\varepsilon$ makes them directly density-reachable from each other.`, why: `Core-to-core direct reachability links them.` },
        { do: `Density-connected core points belong to one cluster.`, why: `The flood-fill merges them.` }
      ],
      answer: `Symmetric distance makes them mutually $\\varepsilon$-reachable; two such core points always land in the same cluster.`
    }
  ]);

  /* ================================================================ */
  /* 3. SPECTRAL CLUSTERING                                           */
  /* ================================================================ */
  add("cls-spectral-clustering", [
    {
      q: `<p>The graph Laplacian is $L=D-W$. If $D_{ii}=3$ and the self-weight $W_{ii}=0$, what is $L_{ii}$?</p>`,
      steps: [
        { do: `On the diagonal, $L_{ii}=D_{ii}-W_{ii}$.`, why: `No self-loops, so the diagonal of $L$ is just the degree.` },
        { do: `So $L_{ii}=3-0=3$.`, why: `The diagonal of $L$ equals the node's total connection strength.` }
      ],
      answer: `$L_{ii}=3$`
    },
    {
      q: `<p>The degree matrix is diagonal with $D_{ii}=\\sum_j W_{ij}$. A node connects with weights $0.5,\\ 0.5,\\ 1.0$ to three others. Find its degree $D_{ii}$.</p>`,
      steps: [
        { do: `Sum the row of similarities: $D_{ii}=0.5+0.5+1.0$.`, why: `Degree is the total weight of edges touching the node.` },
        { do: `$D_{ii}=2.0$.`, why: `This measures how strongly the node is connected overall.` }
      ],
      answer: `$D_{ii}=2.0$`
    },
    {
      q: `<p>Gaussian affinity is $W_{ij}=\\exp(-\\|x_i-x_j\\|^2/(2\\sigma^2))$. With $\\|x_i-x_j\\|=0$, what is $W_{ij}$?</p>`,
      steps: [
        { do: `Distance 0 gives exponent $0$.`, why: `Identical points have zero separation.` },
        { do: `$W_{ij}=e^0=1$.`, why: `Maximum similarity is 1 for coincident points.` }
      ],
      answer: `$W_{ij}=1$`
    },
    {
      q: `<p>Same Gaussian affinity with $\\sigma=1$. Two points are very far apart, $\\|x_i-x_j\\|=10$. Roughly what is $W_{ij}$?</p>`,
      steps: [
        { do: `Exponent $= -10^2/2 = -50$.`, why: `Squared distance dominates for far points.` },
        { do: `$W_{ij}=e^{-50}\\approx 0$.`, why: `Far points are essentially disconnected in the similarity graph.` }
      ],
      answer: `$W_{ij}\\approx 0$`
    },
    {
      q: `<p>Why does every graph Laplacian $L=D-W$ have an eigenvalue exactly $0$ with eigenvector the all-ones vector $\\mathbf{1}$?</p>`,
      steps: [
        { do: `Compute row $i$ of $L\\mathbf{1}$: $\\sum_j L_{ij} = D_{ii} - \\sum_j W_{ij}$.`, why: `Multiplying by all-ones sums each row.` },
        { do: `By definition $D_{ii}=\\sum_j W_{ij}$, so each row sums to 0.`, why: `The degree exactly cancels the row's total weight.` },
        { do: `Thus $L\\mathbf{1}=\\mathbf{0}=0\\cdot\\mathbf{1}$.`, why: `An eigenvalue of 0 with eigenvector $\\mathbf{1}$.` }
      ],
      answer: `Each row of $L$ sums to 0, so $L\\mathbf{1}=0$, giving eigenvalue $0$ with eigenvector $\\mathbf{1}$.`
    },
    {
      q: `<p>A 2-node graph has a single edge of weight $w=2$ between nodes 1 and 2. Write the $2\\times 2$ Laplacian $L$.</p>`,
      steps: [
        { do: `Degrees: $D_{11}=2,\\ D_{22}=2$ (each touches the one edge of weight 2).`, why: `Degree is the row-sum of $W$.` },
        { do: `$W=\\begin{bmatrix}0 & 2\\\\ 2 & 0\\end{bmatrix}$, so $L=D-W=\\begin{bmatrix}2 & -2\\\\ -2 & 2\\end{bmatrix}$.`, why: `Off-diagonals of $L$ are the negated weights.` }
      ],
      answer: `$L=\\begin{bmatrix}2 & -2\\\\ -2 & 2\\end{bmatrix}$`
    },
    {
      q: `<p>For that $L=\\begin{bmatrix}2 & -2\\\\ -2 & 2\\end{bmatrix}$, find both eigenvalues.</p>`,
      steps: [
        { do: `Eigenvalue 0 with $\\mathbf{1}=(1,1)$: $L\\mathbf{1}=(0,0)$.`, why: `Every Laplacian has a zero eigenvalue on all-ones.` },
        { do: `Trace $=2+2=4$ equals the sum of eigenvalues, so the other is $4-0=4$.`, why: `The sum of eigenvalues equals the trace.` }
      ],
      answer: `Eigenvalues $\\lambda = 0$ and $\\lambda = 4$.`
    },
    {
      q: `<p>The quadratic form satisfies $f^\\top L f = \\tfrac12\\sum_{ij} W_{ij}(f_i-f_j)^2$. For the 2-node graph with $w=2$ and $f=(1,-1)$, compute $f^\\top L f$.</p>`,
      steps: [
        { do: `Only edge (1,2): $(f_1-f_2)^2 = (1-(-1))^2 = 4$.`, why: `The labels differ across the single edge.` },
        { do: `Both ordered pairs $(1,2)$ and $(2,1)$ contribute, so $f^\\top L f = \\tfrac12(2\\cdot 4 + 2\\cdot 4)=\\tfrac12(16)=8$... use the direct form $f^\\top L f$: $f^\\top L f = \\tfrac12\\sum_{ij}W_{ij}(f_i-f_j)^2 = \\tfrac12(2\\cdot4+2\\cdot4)=8$.`, why: `The form penalizes label differences across weighted edges.` }
      ],
      answer: `$f^\\top L f = 8$`
    },
    {
      q: `<p>Using $f^\\top L f=\\tfrac12\\sum_{ij}W_{ij}(f_i-f_j)^2$, explain why minimizing it encourages a "good cut".</p>`,
      steps: [
        { do: `The sum only grows when $f_i\\ne f_j$ across an edge with weight $W_{ij}>0$.`, why: `Equal labels contribute 0.` },
        { do: `Heavy (strong-similarity) edges are penalized most when split.`, why: `$W_{ij}$ multiplies the squared label gap.` },
        { do: `So minimizing pushes the split onto weak edges — a good cut.`, why: `It separates the graph at its thinnest seam.` }
      ],
      answer: `It penalizes cutting strong edges, so the minimizer cuts only weak edges — the natural seam.`
    },
    {
      q: `<p>What is the Fiedler vector, and which eigenvalue does it correspond to?</p>`,
      steps: [
        { do: `Order eigenvalues $0=\\lambda_1\\le \\lambda_2\\le\\dots$.`, why: `The smallest is always 0 (all-ones).` },
        { do: `The Fiedler vector is the eigenvector of the second-smallest eigenvalue $\\lambda_2$.`, why: `It is the smallest non-trivial relaxed cut direction.` }
      ],
      answer: `The Fiedler vector is the eigenvector of the second-smallest eigenvalue $\\lambda_2$.`
    },
    {
      q: `<p>Tiny graph: 4 nodes in two pairs. Edges 1–2 (weight 1), 3–4 (weight 1), and a weak 2–3 (weight $0.1$). Compute the degree of node 2.</p>`,
      steps: [
        { do: `Node 2's edges: to node 1 (weight 1) and to node 3 (weight $0.1$).`, why: `Sum all weights touching node 2.` },
        { do: `$D_{22}=1+0.1=1.1$.`, why: `Degree is the row-sum.` }
      ],
      answer: `$D_{22}=1.1$`
    },
    {
      q: `<p>Same 4-node graph (1–2 weight 1, 3–4 weight 1, weak 2–3 weight $0.1$). The Fiedler vector comes out roughly $[+,+,-,-]$. Which split does its sign pattern give, and which edge is cut?</p>`,
      steps: [
        { do: `Positive sign on nodes 1,2; negative on nodes 3,4.`, why: `Cluster by sign of the Fiedler vector.` },
        { do: `The only cross-sign edge is 2–3 (weight $0.1$).`, why: `Edges 1–2 and 3–4 stay within a sign group.` },
        { do: `So the cut removes only the weak $0.1$ edge.`, why: `Spectral relaxation found the thinnest seam.` }
      ],
      answer: `Split $\\{1,2\\}$ vs $\\{3,4\\}$, cutting only the weak $0.1$ edge.`
    },
    {
      q: `<p>After computing the smallest eigenvectors of $L$, what is the final step of spectral clustering to get hard labels?</p>`,
      steps: [
        { do: `Stack the $k$ smallest (non-trivial) eigenvectors as columns to embed each point into $\\mathbb{R}^k$.`, why: `These coordinates make the clusters linearly separable.` },
        { do: `Run k-means on the embedded points.`, why: `In the spectral space the clusters are compact blobs, where k-means works well.` }
      ],
      answer: `Embed points by the smallest eigenvectors, then run k-means in that space.`
    },
    {
      q: `<p>The cut-weight identity is $\\sum_{ij}W_{ij}(f_i-f_j)^2 = 2 f^\\top L f$. Why must we relax the labels $f_i\\in\\{+1,-1\\}$ to real numbers?</p>`,
      steps: [
        { do: `Minimizing over discrete $\\pm 1$ labels is a combinatorial (NP-hard) problem.`, why: `Exact balanced minimum cut has no efficient algorithm in general.` },
        { do: `Relaxing to real $f$ of fixed length turns it into a Rayleigh-quotient eigenproblem.`, why: `Continuous optimization of $f^\\top L f$ is solved by an eigenvector.` }
      ],
      answer: `Discrete $\\pm 1$ minimization is NP-hard; relaxing to real $f$ makes it a tractable eigenvalue problem.`
    },
    {
      q: `<p>By the Rayleigh quotient, minimizing $f^\\top L f$ over unit vectors orthogonal to $\\mathbf{1}$ is solved by which eigenvector of $L$?</p>`,
      steps: [
        { do: `Constraining orthogonality to $\\mathbf{1}$ removes the trivial $\\lambda=0$ solution.`, why: `The all-ones vector gives a useless constant labeling.` },
        { do: `The minimizer is then the eigenvector of the smallest remaining eigenvalue $\\lambda_2$.`, why: `Rayleigh-quotient minimum over that subspace is the next eigenvector.` }
      ],
      answer: `The eigenvector of the second-smallest eigenvalue $\\lambda_2$ — the Fiedler vector.`
    },
    {
      q: `<p>Why does spectral clustering succeed on two interleaved crescent moons where k-means fails?</p>`,
      steps: [
        { do: `k-means groups by straight-line distance to centroids, so its regions are convex.`, why: `It slices each curved moon because the boundary is a straight line.` },
        { do: `Spectral clustering groups by connectivity along the similarity graph.`, why: `Points join if a dense chain of neighbors links them, following the curve.` },
        { do: `The thin gap between the moons is the sparse seam the Laplacian cuts.`, why: `Few/weak edges cross the gap, so the relaxed cut lands there.` }
      ],
      answer: `Spectral uses graph connectivity (chains of neighbors) and cuts the sparse seam; k-means only makes convex cuts and slices the moons.`
    },
    {
      q: `<p>A connected graph has how many zero eigenvalues of $L$? What does the count of zero eigenvalues tell you in general?</p>`,
      steps: [
        { do: `A connected graph has exactly one zero eigenvalue.`, why: `Only the global all-ones vector lies in the null space.` },
        { do: `In general, the multiplicity of eigenvalue 0 equals the number of connected components.`, why: `Each component contributes one independent constant null-space vector.` }
      ],
      answer: `One zero eigenvalue if connected; in general the number of zeros equals the number of connected components.`
    },
    {
      q: `<p>Path graph of 3 nodes: edges 1–2 and 2–3, both weight 1. Write $L$ and verify each row sums to 0.</p>`,
      steps: [
        { do: `Degrees: $D_{11}=1,\\ D_{22}=2,\\ D_{33}=1$.`, why: `Node 2 is the middle, touching two edges.` },
        { do: `$L=\\begin{bmatrix}1 & -1 & 0\\\\ -1 & 2 & -1\\\\ 0 & -1 & 1\\end{bmatrix}$.`, why: `Off-diagonals are negated edge weights; missing edges are 0.` },
        { do: `Row sums: $1-1+0=0$, $-1+2-1=0$, $0-1+1=0$.`, why: `Confirms $\\mathbf{1}$ is in the null space.` }
      ],
      answer: `$L=\\begin{bmatrix}1 & -1 & 0\\\\ -1 & 2 & -1\\\\ 0 & -1 & 1\\end{bmatrix}$, every row sums to 0.`
    },
    {
      q: `<p>How does the affinity bandwidth $\\sigma$ in $W_{ij}=\\exp(-\\|x_i-x_j\\|^2/(2\\sigma^2))$ affect the resulting graph if $\\sigma$ is far too large?</p>`,
      steps: [
        { do: `Large $\\sigma$ makes the exponent near 0 for all pairs, so $W_{ij}\\approx 1$ everywhere.`, why: `The Gaussian flattens; distant points look similar.` },
        { do: `The graph becomes nearly fully connected with no clear thin seam.`, why: `All edges are strong, so there is no good cut.` },
        { do: `Cluster structure washes out.`, why: `Spectral cuts need a contrast between strong intra-cluster and weak inter-cluster edges.` }
      ],
      answer: `Too-large $\\sigma$ makes all weights $\\approx 1$ (near-complete graph), erasing the cut structure.`
    }
  ]);

  /* ================================================================ */
  /* 4. LDA & QDA                                                     */
  /* ================================================================ */
  add("cls-lda-qda", [
    {
      q: `<p>Two classes share a covariance. Will LDA's decision boundary be a straight line or a curve?</p>`,
      steps: [
        { do: `With $\\Sigma_0=\\Sigma_1=\\Sigma$, the quadratic term $x^\\top\\Sigma^{-1}x$ is identical for both classes.`, why: `Equal covariances make that piece cancel in the score difference.` },
        { do: `What remains is linear in $x$, giving a hyperplane boundary.`, why: `A linear discriminant produces a straight line.` }
      ],
      answer: `A straight line (this is LDA).`
    },
    {
      q: `<p>Each class keeps its own covariance $\\Sigma_k$. Is the boundary linear or quadratic? Name the method.</p>`,
      steps: [
        { do: `Different $\\Sigma_k$ means $x^\\top\\Sigma_k^{-1}x$ differs across classes and does not cancel.`, why: `The quadratic term survives in the score difference.` },
        { do: `So the boundary is a quadratic curve — QDA.`, why: `Quadratic discriminant analysis bends the boundary.` }
      ],
      answer: `Quadratic (curved) — this is QDA.`
    },
    {
      q: `<p>1-D, equal priors, shared variance. Class 0: $\\mu_0=0$. Class 1: $\\mu_1=4$. Find the LDA decision boundary $x$.</p>`,
      steps: [
        { do: `Boundary where scores tie: $(x-\\mu_0)^2=(x-\\mu_1)^2$.`, why: `With shared variance and equal priors, the closer mean wins; the tie is equidistance.` },
        { do: `$x^2=(x-4)^2=x^2-8x+16\\Rightarrow 8x=16\\Rightarrow x=2$.`, why: `The boundary is the midpoint of the means.` }
      ],
      answer: `$x=2$ (the midpoint).`
    },
    {
      q: `<p>1-D LDA, shared $\\sigma^2=1$, equal priors. Class 0: $\\mu_0=2$, class 1: $\\mu_1=6$. Where is the boundary?</p>`,
      steps: [
        { do: `Equidistance: $(x-2)^2=(x-6)^2$.`, why: `Equal priors and equal variance reduce the boundary to the midpoint.` },
        { do: `$x^2-4x+4=x^2-12x+36\\Rightarrow 8x=32\\Rightarrow x=4$.`, why: `Midpoint of 2 and 6.` }
      ],
      answer: `$x=4$`
    },
    {
      q: `<p>The QDA discriminant is $\\delta_k(x)=\\log\\pi_k-\\tfrac12\\log|\\Sigma_k|-\\tfrac12(x-\\mu_k)^\\top\\Sigma_k^{-1}(x-\\mu_k)$. In 1-D with $\\sigma_k^2=4$, what is the $-\\tfrac12\\log|\\Sigma_k|$ term? (Use $\\ln 4\\approx 1.386$.)</p>`,
      steps: [
        { do: `In 1-D, $|\\Sigma_k|=\\sigma_k^2=4$.`, why: `The determinant of a $1\\times 1$ matrix is its single entry.` },
        { do: `Term $= -\\tfrac12\\ln 4 = -\\tfrac12(1.386)\\approx -0.693$.`, why: `Wider classes get a larger volume penalty.` }
      ],
      answer: `$-\\tfrac12\\log|\\Sigma_k|\\approx -0.693$`
    },
    {
      q: `<p>1-D QDA. Both classes $\\sigma^2=1$, equal priors. Class 0: $\\mu_0=0$, class 1: $\\mu_1=2$. Evaluate the squared-distance scores at $x=1$; which class wins?</p>`,
      steps: [
        { do: `$\\delta_0\\propto -\\tfrac12(1-0)^2 = -0.5$; $\\delta_1\\propto -\\tfrac12(1-2)^2 = -0.5$.`, why: `Equal variances and priors leave only the squared-distance term.` },
        { do: `They are equal, so $x=1$ is exactly on the boundary.`, why: `The point is equidistant from both means.` }
      ],
      answer: `$\\delta_0=\\delta_1=-0.5$; $x=1$ is on the boundary (a tie).`
    },
    {
      q: `<p>Why does LDA need less data than QDA?</p>`,
      steps: [
        { do: `QDA estimates a separate covariance matrix $\\Sigma_k$ for every class.`, why: `Each covariance has many parameters ($\\sim p^2/2$ in $p$ dimensions).` },
        { do: `LDA estimates one pooled covariance shared by all classes.`, why: `Fewer parameters to fit from the same data.` },
        { do: `So LDA is more data-efficient and less prone to overfit.`, why: `Sharing reduces variance of the estimates.` }
      ],
      answer: `LDA fits one shared covariance (fewer parameters); QDA fits one per class, needing more data.`
    },
    {
      q: `<p>1-D, shared $\\sigma^2=1$, unequal priors $\\pi_0=0.8,\\ \\pi_1=0.2$, means $\\mu_0=0,\\mu_1=4$. The LDA boundary shifts by $\\frac{\\sigma^2}{\\mu_1-\\mu_0}\\ln\\frac{\\pi_0}{\\pi_1}$ from the midpoint. Compute that shift. (Use $\\ln 4\\approx 1.386$.)</p>`,
      steps: [
        { do: `Plug in: shift $=\\frac{1}{4-0}\\ln\\frac{0.8}{0.2}=\\tfrac14\\ln 4$.`, why: `Unequal priors move the boundary toward the rarer class.` },
        { do: `$=\\tfrac14(1.386)\\approx 0.347$.`, why: `The boundary moves $0.347$ toward class 1 (the rarer one), so to $x\\approx 2.35$.` }
      ],
      answer: `Shift $\\approx 0.347$ (boundary moves from $x=2$ to $x\\approx 2.35$).`
    },
    {
      q: `<p>Give the LDA discriminant in its linear form $\\delta_k(x)=x^\\top\\Sigma^{-1}\\mu_k-\\tfrac12\\mu_k^\\top\\Sigma^{-1}\\mu_k+\\log\\pi_k$. In 1-D with $\\sigma^2=1$, $\\mu_k=4$, $\\pi_k=0.5$, write $\\delta_k(x)$. (Use $\\ln 0.5\\approx -0.693$.)</p>`,
      steps: [
        { do: `$\\Sigma^{-1}=1$, so $x^\\top\\Sigma^{-1}\\mu_k = 4x$.`, why: `Linear term in $x$.` },
        { do: `$-\\tfrac12\\mu_k^\\top\\Sigma^{-1}\\mu_k = -\\tfrac12(16) = -8$; $\\log\\pi_k\\approx -0.693$.`, why: `Constant offset terms.` },
        { do: `$\\delta_k(x)=4x-8-0.693 = 4x-8.693$.`, why: `Linear in $x$ confirms the straight boundary.` }
      ],
      answer: `$\\delta_k(x)=4x-8.693$`
    },
    {
      q: `<p>1-D QDA, equal priors, $\\mu_0=0,\\mu_1=4$, $\\sigma_0^2=1$, $\\sigma_1^2=4$. Set up the boundary equation (where $\\delta_0=\\delta_1$). (Use $\\ln 4\\approx 1.386$.)</p>`,
      steps: [
        { do: `Tie: $-\\tfrac12\\ln\\sigma_0^2-\\frac{(x-0)^2}{2\\sigma_0^2} = -\\tfrac12\\ln\\sigma_1^2-\\frac{(x-4)^2}{2\\sigma_1^2}$.`, why: `QDA keeps each class's own variance and log-determinant.` },
        { do: `Plug in: $-0-\\frac{x^2}{2} = -\\tfrac12(1.386)-\\frac{(x-4)^2}{8}$.`, why: `$\\ln\\sigma_0^2=\\ln 1=0$, $\\ln\\sigma_1^2=\\ln 4$.` },
        { do: `Rearrange to $\\frac{x^2}{2}-\\frac{(x-4)^2}{8}-0.693=0$, a quadratic in $x$.`, why: `Unequal variances leave a surviving quadratic term.` }
      ],
      answer: `$\\frac{x^2}{2}-\\frac{(x-4)^2}{8}-0.693=0$ — a quadratic boundary.`
    },
    {
      q: `<p>A quadratic boundary equation $0.375x^2+x-c=0$ has up to how many real roots, and what does that mean geometrically for QDA in 1-D?</p>`,
      steps: [
        { do: `A quadratic has at most 2 real roots.`, why: `Degree-2 polynomial.` },
        { do: `Two roots mean two boundary points, enclosing the tighter class in an interval.`, why: `QDA can wrap one class inside the other along the line.` }
      ],
      answer: `Up to 2 roots; QDA can carve an interval that wraps the tighter class.`
    },
    {
      q: `<p>Why does the $x^\\top\\Sigma^{-1}x$ term cancel in LDA but not in QDA? State it precisely.</p>`,
      steps: [
        { do: `In LDA all classes use the same $\\Sigma$, so $-\\tfrac12 x^\\top\\Sigma^{-1}x$ is identical in every $\\delta_k$.`, why: `Comparing $\\delta_k-\\delta_j$ subtracts identical terms.` },
        { do: `In QDA, $\\Sigma_k$ differs per class, so $-\\tfrac12 x^\\top\\Sigma_k^{-1}x$ differs and does not subtract away.`, why: `The quadratic-in-$x$ piece remains in the comparison.` }
      ],
      answer: `Shared $\\Sigma$ makes the quadratic term equal across classes (cancels) for LDA; per-class $\\Sigma_k$ keeps distinct quadratic terms for QDA.`
    },
    {
      q: `<p>2-D LDA with shared $\\Sigma=I$ (identity). Means $\\mu_0=(0,0)$, $\\mu_1=(2,0)$, equal priors. Find the decision boundary.</p>`,
      steps: [
        { do: `With $\\Sigma=I$ the boundary is equidistance: $\\|x-\\mu_0\\|^2=\\|x-\\mu_1\\|^2$.`, why: `Identity covariance makes Mahalanobis distance equal to Euclidean.` },
        { do: `$x_1^2+x_2^2=(x_1-2)^2+x_2^2\\Rightarrow 0=-4x_1+4\\Rightarrow x_1=1$.`, why: `The boundary is the perpendicular bisector of the means.` }
      ],
      answer: `The vertical line $x_1=1$.`
    },
    {
      q: `<p>The pooled covariance in LDA is $\\Sigma=\\frac{(n_0-1)\\Sigma_0+(n_1-1)\\Sigma_1}{n_0+n_1-2}$. With $n_0=n_1=11$, $\\Sigma_0=1$, $\\Sigma_1=3$ (1-D), compute $\\Sigma$.</p>`,
      steps: [
        { do: `Numerator $=(11-1)(1)+(11-1)(3)=10+30=40$.`, why: `Each class contributes its scatter weighted by $n_k-1$.` },
        { do: `Denominator $=11+11-2=20$. So $\\Sigma=40/20=2$.`, why: `Pooling averages the class variances.` }
      ],
      answer: `$\\Sigma=2$`
    },
    {
      q: `<p>When would QDA strictly outperform LDA, and when might LDA be safer?</p>`,
      steps: [
        { do: `If classes truly have different spreads/orientations, QDA's per-class $\\Sigma_k$ fits the real boundary.`, why: `LDA's single shared $\\Sigma$ would mis-model the shapes.` },
        { do: `If data is limited or covariances are similar, LDA is safer.`, why: `QDA's many extra parameters overfit with little data.` }
      ],
      answer: `QDA wins when class covariances genuinely differ and data is ample; LDA is safer with limited data or similar covariances.`
    },
    {
      q: `<p>LDA as dimensionality reduction. For $C$ classes, LDA can project onto at most how many discriminant directions, and why?</p>`,
      steps: [
        { do: `The between-class scatter matrix has rank at most $C-1$.`, why: `It is built from $C$ class means relative to the global mean, which span a $(C-1)$-dimensional space.` },
        { do: `So at most $C-1$ non-trivial discriminant directions exist.`, why: `Beyond that the projected class means coincide, carrying no class info.` }
      ],
      answer: `At most $C-1$ directions, because the between-class scatter has rank $\\le C-1$.`
    },
    {
      q: `<p>1-D QDA. $\\mu_0=0,\\sigma_0^2=1$; $\\mu_1=0,\\sigma_1^2=4$ (same mean, different spread), equal priors. At $x=0$, which class is predicted? (Use $\\ln 4\\approx 1.386$.)</p>`,
      steps: [
        { do: `At $x=0$ both squared-distance terms are 0.`, why: `The point sits at both means.` },
        { do: `Compare log-determinant penalties: $\\delta_0\\propto -\\tfrac12\\ln 1=0$ vs $\\delta_1\\propto -\\tfrac12\\ln 4\\approx -0.693$.`, why: `The tighter class has a smaller volume penalty, so it scores higher.` },
        { do: `$\\delta_0 > \\delta_1$, so class 0 wins.`, why: `QDA favors the more concentrated Gaussian at its center.` }
      ],
      answer: `Class 0 (the tighter one) is predicted at $x=0$.`
    },
    {
      q: `<p>Explain geometrically why two Gaussians with the same mean but different covariance give a closed-curve QDA boundary (an ellipse), not a line.</p>`,
      steps: [
        { do: `Equal means make the linear term vanish, leaving only the quadratic difference $x^\\top(\\Sigma_1^{-1}-\\Sigma_0^{-1})x$.`, why: `No linear part means no flat hyperplane.` },
        { do: `Setting that quadratic form (minus the log-det offset) to zero defines a conic.`, why: `A quadratic equation in $x$ is an ellipse/hyperbola.` },
        { do: `The tighter class is enclosed by the curve.`, why: `Near the shared center the concentrated Gaussian dominates; far out the wide one does.` }
      ],
      answer: `Only a quadratic term remains, so the boundary is a conic (closed ellipse) wrapping the tighter class, not a line.`
    }
  ]);

  /* ================================================================ */
  /* 5. GAUSSIAN PROCESSES                                            */
  /* ================================================================ */
  add("cls-gaussian-process", [
    {
      q: `<p>An RBF kernel is $k(a,b)=\\exp(-(a-b)^2/(2\\ell^2))$ with $\\ell=1$. Compute $k(3,3)$.</p>`,
      steps: [
        { do: `$a=b$ gives exponent $0$.`, why: `Zero separation between identical inputs.` },
        { do: `$k=e^0=1$.`, why: `A point is maximally correlated with itself.` }
      ],
      answer: `$k(3,3)=1$`
    },
    {
      q: `<p>RBF kernel, $\\ell=1$. Compute $k(0,2)$. Use $e^{-2}\\approx 0.135$.</p>`,
      steps: [
        { do: `Exponent $=-(0-2)^2/(2\\cdot 1)= -4/2 = -2$.`, why: `Squared distance scaled by $2\\ell^2$.` },
        { do: `$k=e^{-2}\\approx 0.135$.`, why: `Correlation decays with distance.` }
      ],
      answer: `$k(0,2)\\approx 0.135$`
    },
    {
      q: `<p>For two training points the kernel matrix is $K=\\begin{bmatrix}1 & 0.135\\\\ 0.135 & 1\\end{bmatrix}$. Compute its determinant.</p>`,
      steps: [
        { do: `$\\det K = (1)(1)-(0.135)(0.135)$.`, why: `Determinant of a $2\\times 2$ matrix is $ad-bc$.` },
        { do: `$=1-0.0182\\approx 0.982$.`, why: `Off-diagonal correlation slightly lowers the determinant.` }
      ],
      answer: `$\\det K\\approx 0.982$`
    },
    {
      q: `<p>Invert $K=\\begin{bmatrix}1 & 0.135\\\\ 0.135 & 1\\end{bmatrix}$ (det $\\approx 0.982$).</p>`,
      steps: [
        { do: `For $2\\times 2$, $K^{-1}=\\frac{1}{\\det}\\begin{bmatrix}d & -b\\\\ -c & a\\end{bmatrix}$.`, why: `Standard inverse formula.` },
        { do: `$K^{-1}\\approx\\frac{1}{0.982}\\begin{bmatrix}1 & -0.135\\\\ -0.135 & 1\\end{bmatrix}=\\begin{bmatrix}1.018 & -0.137\\\\ -0.137 & 1.018\\end{bmatrix}$.`, why: `Divide the adjugate by the determinant.` }
      ],
      answer: `$K^{-1}\\approx\\begin{bmatrix}1.018 & -0.137\\\\ -0.137 & 1.018\\end{bmatrix}$`
    },
    {
      q: `<p>What does a GP predict (mean and uncertainty) at a test point very far from all training data, and why?</p>`,
      steps: [
        { do: `Far away, $k_*\\approx 0$ (test point uncorrelated with all training points).`, why: `RBF kernel decays to 0 with distance.` },
        { do: `Mean $\\mu_*=k_*^\\top K^{-1}y\\approx 0$.`, why: `No training point influences the prediction, so it reverts to the prior mean (0).` },
        { do: `Variance $\\sigma_*^2=k(x_*,x_*)-k_*^\\top K^{-1}k_*\\approx k(x_*,x_*)$, the full prior.`, why: `The reduction term vanishes, so uncertainty stays maximal.` }
      ],
      answer: `Mean reverts to the prior ($\\approx 0$) and variance stays at the full prior $k(x_*,x_*)$ — the GP admits it does not know.`
    },
    {
      q: `<p>GP posterior mean is $\\mu_*=k_*^\\top K^{-1}y$. With $K^{-1}y=(0.6,\\ 2.9)$ and $k_*=(0.607,\\ 0.607)$, compute $\\mu_*$.</p>`,
      steps: [
        { do: `Dot product: $\\mu_*=0.607(0.6)+0.607(2.9)$.`, why: `The mean is a kernel-weighted blend of the (transformed) outputs.` },
        { do: `$=0.364+1.760\\approx 2.12$.`, why: `Both training points pull the prediction.` }
      ],
      answer: `$\\mu_*\\approx 2.12$`
    },
    {
      q: `<p>At a training input $x_*=x_1$, the cross-kernel $k_*$ equals a column of $K$. Show the GP variance collapses to (near) 0.</p>`,
      steps: [
        { do: `$\\sigma_*^2=k(x_*,x_*)-k_*^\\top K^{-1}k_*$.`, why: `Posterior variance formula.` },
        { do: `If $k_*$ is column $j$ of $K$, then $K^{-1}k_* = e_j$ (a unit vector).`, why: `$K^{-1}K=I$, so $K^{-1}$ times a column of $K$ is the matching standard basis vector.` },
        { do: `Then $k_*^\\top e_j = K_{jj}=k(x_*,x_*)$, so $\\sigma_*^2 = k(x_*,x_*)-k(x_*,x_*)=0$.`, why: `The reduction exactly cancels the prior — no uncertainty at observed data.` }
      ],
      answer: `$\\sigma_*^2 = 0$: the band pinches shut at training points.`
    },
    {
      q: `<p>Two data points $x_1=0,y_1=1$ and $x_2=2,y_2=3$, RBF kernel $k(a,b)=e^{-(a-b)^2/2}$. Build the kernel matrix $K$ (use $e^{-2}\\approx 0.135$).</p>`,
      steps: [
        { do: `Diagonals: $k(0,0)=k(2,2)=1$.`, why: `Self-correlation is 1.` },
        { do: `Off-diagonal: $k(0,2)=e^{-(2)^2/2}=e^{-2}\\approx 0.135$.`, why: `Inputs 2 apart give exponent $-2$.` },
        { do: `$K=\\begin{bmatrix}1 & 0.135\\\\ 0.135 & 1\\end{bmatrix}$.`, why: `Symmetric by construction.` }
      ],
      answer: `$K=\\begin{bmatrix}1 & 0.135\\\\ 0.135 & 1\\end{bmatrix}$`
    },
    {
      q: `<p>Continuing: with $y=(1,3)$ and $K^{-1}\\approx\\frac{1}{0.982}\\begin{bmatrix}1 & -0.135\\\\ -0.135 & 1\\end{bmatrix}$, compute $K^{-1}y$.</p>`,
      steps: [
        { do: `Row 1: $\\frac{1}{0.982}(1\\cdot 1 - 0.135\\cdot 3)=\\frac{1-0.405}{0.982}=\\frac{0.595}{0.982}\\approx 0.606$.`, why: `Matrix-vector product, first component.` },
        { do: `Row 2: $\\frac{1}{0.982}(-0.135\\cdot 1 + 1\\cdot 3)=\\frac{2.865}{0.982}\\approx 2.917$.`, why: `Second component.` }
      ],
      answer: `$K^{-1}y\\approx(0.606,\\ 2.917)$`
    },
    {
      q: `<p>Predict the GP mean at $x_*=1$ using $K^{-1}y\\approx(0.606,2.917)$ and $k_*=(k(1,0),k(1,2))$. Use $e^{-0.5}\\approx 0.607$.</p>`,
      steps: [
        { do: `$k_*=(e^{-0.5},e^{-0.5})=(0.607,0.607)$.`, why: `$x_*=1$ is distance 1 from each training input.` },
        { do: `$\\mu_*=0.607(0.606)+0.607(2.917)\\approx 0.368+1.771\\approx 2.14$.`, why: `Kernel-weighted blend of the transformed outputs.` }
      ],
      answer: `$\\mu_*\\approx 2.14$`
    },
    {
      q: `<p>How does increasing the length scale $\\ell$ change the GP's predicted functions?</p>`,
      steps: [
        { do: `Larger $\\ell$ makes $k(a,b)$ decay slowly with distance.`, why: `Points stay correlated over longer ranges.` },
        { do: `The posterior favors smoother, more slowly varying functions.`, why: `Nearby and moderately distant outputs are tied together.` }
      ],
      answer: `Larger $\\ell$ yields smoother functions whose values stay correlated over longer distances.`
    },
    {
      q: `<p>Why do GPs add a noise term: $K + \\sigma_n^2 I$ before inverting? What does $\\sigma_n^2$ represent?</p>`,
      steps: [
        { do: `$\\sigma_n^2$ is the observation-noise variance: targets $y$ are noisy versions of the true function.`, why: `Real measurements are not exact.` },
        { do: `Adding $\\sigma_n^2 I$ to the diagonal lets the mean curve pass near (not exactly through) data, and keeps $K$ well-conditioned for inversion.`, why: `It regularizes the matrix and accounts for noise so the fit does not overfit each point.` }
      ],
      answer: `$\\sigma_n^2$ is observation noise; adding $\\sigma_n^2 I$ accounts for it and stabilizes the inversion (mean no longer interpolates exactly).`
    },
    {
      q: `<p>With noise, the variance at a training point no longer hits exactly 0. Using $\\sigma_*^2=k(x_*,x_*)-k_*^\\top (K+\\sigma_n^2 I)^{-1}k_*$, explain the residual uncertainty.</p>`,
      steps: [
        { do: `The added $\\sigma_n^2 I$ makes $(K+\\sigma_n^2I)^{-1}$ slightly smaller than $K^{-1}$.`, why: `Larger diagonal means a smaller inverse.` },
        { do: `So the reduction term $k_*^\\top(K+\\sigma_n^2I)^{-1}k_*$ is below $k(x_*,x_*)$.`, why: `It cannot fully cancel the prior.` },
        { do: `A small positive variance remains at observed points.`, why: `The GP knows the observation itself was noisy.` }
      ],
      answer: `The noise floor keeps a small residual variance at data points, reflecting noisy observations.`
    },
    {
      q: `<p>A GP joint prior over $(f_1,f_2)$ has covariance $\\begin{bmatrix}1 & 0.8\\\\ 0.8 & 1\\end{bmatrix}$. We observe $f_1=2$ (zero prior mean). Find the conditional mean of $f_2$ using $\\mu_{2\\mid 1}=\\frac{\\Sigma_{21}}{\\Sigma_{11}}f_1$.</p>`,
      steps: [
        { do: `$\\mu_{2\\mid 1}=\\frac{\\Sigma_{21}}{\\Sigma_{11}}f_1 = \\frac{0.8}{1}(2)$.`, why: `Gaussian conditioning gives a linear update proportional to correlation.` },
        { do: `$=1.6$.`, why: `Strong correlation (0.8) pulls $f_2$'s estimate most of the way to $f_1$.` }
      ],
      answer: `$\\mu_{2\\mid 1}=1.6$`
    },
    {
      q: `<p>Same joint prior $\\begin{bmatrix}1 & 0.8\\\\ 0.8 & 1\\end{bmatrix}$, observe $f_1=2$. Find the conditional variance of $f_2$ using the Schur complement $\\sigma^2_{2\\mid 1}=\\Sigma_{22}-\\frac{\\Sigma_{21}^2}{\\Sigma_{11}}$.</p>`,
      steps: [
        { do: `$\\sigma^2_{2\\mid 1}=1-\\frac{0.8^2}{1}=1-0.64$.`, why: `Observing a correlated variable reduces uncertainty about $f_2$.` },
        { do: `$=0.36$.`, why: `The stronger the correlation, the larger the reduction.` }
      ],
      answer: `$\\sigma^2_{2\\mid 1}=0.36$`
    },
    {
      q: `<p>Why is the GP posterior variance formula $\\sigma_*^2=k(x_*,x_*)-k_*^\\top K^{-1}k_*$ exactly the Schur complement of the joint covariance block?</p>`,
      steps: [
        { do: `The joint covariance of $(y,f_*)$ is $\\begin{bmatrix}K & k_*\\\\ k_*^\\top & k(x_*,x_*)\\end{bmatrix}$.`, why: `Kernel fills all pairwise covariances.` },
        { do: `Conditioning a Gaussian on $y$ uses the Schur complement of the $K$ block: $k(x_*,x_*)-k_*^\\top K^{-1}k_*$.`, why: `That is the standard Gaussian-conditioning identity.` }
      ],
      answer: `Because GP prediction = conditioning a joint Gaussian on the data, and the conditional variance of a Gaussian is exactly that Schur complement.`
    },
    {
      q: `<p>Computational cost: inverting (or factorizing) the $n\\times n$ kernel matrix costs how much, and why does this limit GPs on big data?</p>`,
      steps: [
        { do: `Cholesky/inversion of an $n\\times n$ dense matrix costs $O(n^3)$ time and $O(n^2)$ memory.`, why: `Standard dense linear algebra scaling.` },
        { do: `For large $n$ (millions), $n^3$ is infeasible.`, why: `Cost explodes, motivating sparse/inducing-point approximations.` }
      ],
      answer: `$O(n^3)$ time, $O(n^2)$ memory — the cubic cost makes exact GPs impractical for very large datasets.`
    },
    {
      q: `<p>In Bayesian optimization, a GP is used to pick the next sample. Why is the GP's uncertainty (variance), not just its mean, essential?</p>`,
      steps: [
        { do: `The acquisition rule balances exploiting high predicted mean against exploring high variance regions.`, why: `Sampling only the mean would ignore unexplored, possibly-better areas.` },
        { do: `Large variance flags places the GP knows little about, worth probing.`, why: `Reducing uncertainty there can reveal a better optimum.` }
      ],
      answer: `Variance drives exploration — it identifies uncertain regions worth sampling, balancing exploit (mean) vs explore (variance).`
    }
  ]);

  /* ================================================================ */
  /* 6. BAYESIAN LINEAR REGRESSION                                    */
  /* ================================================================ */
  add("cls-bayesian-regression", [
    {
      q: `<p>Bayes' rule for weights: $p(w\\mid D)\\propto p(D\\mid w)\\,p(w)$. Name the three pieces.</p>`,
      steps: [
        { do: `$p(w)$ is the prior; $p(D\\mid w)$ is the likelihood; $p(w\\mid D)$ is the posterior.`, why: `These are the standard names in Bayesian updating.` },
        { do: `Posterior $\\propto$ likelihood $\\times$ prior.`, why: `Data reshapes the prior belief into the posterior.` }
      ],
      answer: `Prior $p(w)$, likelihood $p(D\\mid w)$, posterior $p(w\\mid D)$.`
    },
    {
      q: `<p>The prior is $w\\sim\\mathcal{N}(0,\\alpha^{-1}I)$ with precision $\\alpha$. With $\\alpha=4$, what is the prior variance of each weight?</p>`,
      steps: [
        { do: `Prior variance $=\\alpha^{-1}=1/\\alpha$.`, why: `Precision is the reciprocal of variance.` },
        { do: `$=1/4=0.25$.`, why: `Larger $\\alpha$ means tighter prior (smaller variance).` }
      ],
      answer: `Prior variance $=0.25$`
    },
    {
      q: `<p>Noise precision is $\\beta = 1/(\\text{noise variance})$. If the observation noise variance is $0.05$, find $\\beta$.</p>`,
      steps: [
        { do: `$\\beta = 1/0.05$.`, why: `Precision is the inverse of variance.` },
        { do: `$=20$.`, why: `Low noise variance means high precision (trustworthy observations).` }
      ],
      answer: `$\\beta=20$`
    },
    {
      q: `<p>One weight (slope through origin), $\\phi(x)=x$. Data $x=[1,2]$. Compute the scalar $\\Phi^\\top\\Phi$.</p>`,
      steps: [
        { do: `$\\Phi^\\top\\Phi=\\sum_i x_i^2 = 1^2 + 2^2$.`, why: `For a single feature it is the sum of squared inputs.` },
        { do: `$=1+4=5$.`, why: `This drives how much the data sharpens the posterior.` }
      ],
      answer: `$\\Phi^\\top\\Phi=5$`
    },
    {
      q: `<p>Same data $x=[1,2]$ with targets $y=[2,4]$, $\\phi(x)=x$. Compute $\\Phi^\\top y$.</p>`,
      steps: [
        { do: `$\\Phi^\\top y=\\sum_i x_i y_i = 1\\cdot 2 + 2\\cdot 4$.`, why: `Single-feature inner product of inputs and targets.` },
        { do: `$=2+8=10$.`, why: `This is the data's pull on the slope.` }
      ],
      answer: `$\\Phi^\\top y=10$`
    },
    {
      q: `<p>Single weight. Posterior variance $S_N=(\\alpha+\\beta\\,\\Phi^\\top\\Phi)^{-1}$. With $\\alpha=1,\\ \\beta=1,\\ \\Phi^\\top\\Phi=5$, compute $S_N$.</p>`,
      steps: [
        { do: `$S_N=(1+1\\cdot 5)^{-1}=(6)^{-1}$.`, why: `Add the prior precision and the data precision.` },
        { do: `$=1/6\\approx 0.167$.`, why: `The error bar on the slope.` }
      ],
      answer: `$S_N=1/6\\approx 0.167$`
    },
    {
      q: `<p>Continuing: posterior mean $m_N=\\beta\\,S_N\\,\\Phi^\\top y$ with $\\beta=1,\\ S_N=1/6,\\ \\Phi^\\top y=10$. Compute $m_N$.</p>`,
      steps: [
        { do: `$m_N = 1\\cdot \\tfrac16\\cdot 10$.`, why: `Plug into the posterior-mean formula.` },
        { do: `$=10/6\\approx 1.67$.`, why: `The most plausible slope given prior and data.` }
      ],
      answer: `$m_N\\approx 1.67$`
    },
    {
      q: `<p>Plain least squares for that data gives slope $\\Phi^\\top y/\\Phi^\\top\\Phi = 10/5 = 2.0$. Why is the Bayesian mean $1.67$ smaller?</p>`,
      steps: [
        { do: `The prior $w\\sim\\mathcal{N}(0,\\alpha^{-1})$ favors small weights.`, why: `It pulls the estimate toward 0.` },
        { do: `So the posterior mean $1.67$ sits between 0 (prior) and $2.0$ (data).`, why: `Bayesian regression is a compromise weighted by precisions.` }
      ],
      answer: `The prior pulls the slope toward 0, shrinking the data's $2.0$ down to $1.67$.`
    },
    {
      q: `<p>The posterior mean equals ridge regression with regularization $\\lambda=\\alpha/\\beta$. With $\\alpha=2,\\ \\beta=10$, what is the equivalent ridge $\\lambda$?</p>`,
      steps: [
        { do: `$\\lambda=\\alpha/\\beta = 2/10$.`, why: `The prior-to-noise precision ratio sets the regularization strength.` },
        { do: `$=0.2$.`, why: `Stronger prior or noisier data raises $\\lambda$.` }
      ],
      answer: `$\\lambda=0.2$`
    },
    {
      q: `<p>As $\\alpha\\to 0$ (flat prior), the posterior mean $m_N=\\beta S_N\\Phi^\\top y$ reduces to what classical estimator?</p>`,
      steps: [
        { do: `With $\\alpha=0$, $S_N=(\\beta\\Phi^\\top\\Phi)^{-1}$.`, why: `The prior-precision term drops out.` },
        { do: `Then $m_N=\\beta(\\beta\\Phi^\\top\\Phi)^{-1}\\Phi^\\top y=(\\Phi^\\top\\Phi)^{-1}\\Phi^\\top y$.`, why: `The $\\beta$ factors cancel.` }
      ],
      answer: `Ordinary least squares $m_N=(\\Phi^\\top\\Phi)^{-1}\\Phi^\\top y$.`
    },
    {
      q: `<p>As you collect more data, what happens to the posterior covariance $S_N=(\\alpha I+\\beta\\Phi^\\top\\Phi)^{-1}$ and to the cloud of sampled lines?</p>`,
      steps: [
        { do: `More data grows $\\Phi^\\top\\Phi$, so the term $\\beta\\Phi^\\top\\Phi$ inside the inverse grows.`, why: `Each example adds to the sum of outer products.` },
        { do: `A larger matrix inside means a smaller inverse: $S_N$ shrinks toward 0.`, why: `Inversion turns growth into shrinkage.` },
        { do: `The sampled-line cloud tightens around the best-fit line.`, why: `The posterior concentrates as evidence accumulates.` }
      ],
      answer: `$S_N$ shrinks toward 0; the cloud of plausible lines tightens around the best fit.`
    },
    {
      q: `<p>Two-feature model $\\phi(x)=[1,x]$ (intercept + slope), $\\alpha=2$, $\\beta=1$, single data point $x=1,y=3$. Build the precision matrix $A=\\alpha I+\\beta\\Phi^\\top\\Phi$.</p>`,
      steps: [
        { do: `Feature vector $\\phi=[1,1]$, so $\\phi\\phi^\\top=\\begin{bmatrix}1 & 1\\\\ 1 & 1\\end{bmatrix}$.`, why: `Outer product of the single example's features.` },
        { do: `$A=2I + 1\\cdot\\begin{bmatrix}1 & 1\\\\ 1 & 1\\end{bmatrix}=\\begin{bmatrix}3 & 1\\\\ 1 & 3\\end{bmatrix}$.`, why: `Add prior precision $\\alpha$ on the diagonal.` }
      ],
      answer: `$A=\\begin{bmatrix}3 & 1\\\\ 1 & 3\\end{bmatrix}$`
    },
    {
      q: `<p>Continuing, $A=\\begin{bmatrix}3 & 1\\\\ 1 & 3\\end{bmatrix}$. Find the posterior covariance $S_N=A^{-1}$.</p>`,
      steps: [
        { do: `$\\det A=3\\cdot 3-1\\cdot 1=8$.`, why: `$ad-bc$ for the $2\\times 2$ matrix.` },
        { do: `$A^{-1}=\\frac{1}{8}\\begin{bmatrix}3 & -1\\\\ -1 & 3\\end{bmatrix}=\\begin{bmatrix}0.375 & -0.125\\\\ -0.125 & 0.375\\end{bmatrix}$.`, why: `Inverse formula: swap diagonal, negate off-diagonal, divide by det.` }
      ],
      answer: `$S_N=\\begin{bmatrix}0.375 & -0.125\\\\ -0.125 & 0.375\\end{bmatrix}$`
    },
    {
      q: `<p>Continuing, compute $\\Phi^\\top y$ for the single point $\\phi=[1,1],\\ y=3$, then the posterior mean $m_N=\\beta S_N\\Phi^\\top y$ (with $\\beta=1$).</p>`,
      steps: [
        { do: `$\\Phi^\\top y = \\phi\\cdot y = [1,1]\\cdot 3 = [3,3]$.`, why: `One example contributes $\\phi y$.` },
        { do: `$m_N=S_N[3,3]^\\top$: row 1 $=0.375(3)-0.125(3)=0.75$; row 2 $=-0.125(3)+0.375(3)=0.75$.`, why: `Matrix-vector product with the posterior covariance.` }
      ],
      answer: `$m_N=(0.75,\\ 0.75)$`
    },
    {
      q: `<p>Why is "Gaussian prior $\\times$ Gaussian likelihood $=$ Gaussian posterior" the key fact that makes Bayesian linear regression closed-form?</p>`,
      steps: [
        { do: `Both log-likelihood and log-prior are quadratic in $w$.`, why: `Gaussian densities have quadratic exponents.` },
        { do: `Their sum is quadratic, which is exactly the log of a Gaussian.`, why: `A quadratic exponent defines a Gaussian.` },
        { do: `So the posterior is Gaussian and its mean/covariance follow by completing the square — no sampling needed.`, why: `Conjugacy yields exact formulas.` }
      ],
      answer: `Gaussian $\\times$ Gaussian (conjugacy) gives a Gaussian posterior, so its mean and covariance have closed-form expressions.`
    },
    {
      q: `<p>In the derivation, the log-posterior is $-\\tfrac12[\\beta(y-\\Phi w)^\\top(y-\\Phi w)+\\alpha w^\\top w]$. Why does the coefficient of the $w^\\top(\\cdot)w$ term give $S_N^{-1}$?</p>`,
      steps: [
        { do: `Collect quadratic-in-$w$ terms: $\\beta\\,w^\\top\\Phi^\\top\\Phi w + \\alpha\\,w^\\top w = w^\\top(\\alpha I+\\beta\\Phi^\\top\\Phi)w$.`, why: `Group the matrices multiplying $w^\\top(\\cdot)w$.` },
        { do: `A Gaussian $\\propto\\exp(-\\tfrac12 w^\\top \\Sigma^{-1} w)$, so the quadratic coefficient is the inverse covariance.`, why: `Match to the Gaussian form: the coefficient is $S_N^{-1}$.` }
      ],
      answer: `The quadratic coefficient of a Gaussian is its inverse covariance, so $S_N^{-1}=\\alpha I+\\beta\\Phi^\\top\\Phi$.`
    },
    {
      q: `<p>Predictive uncertainty grows away from data. Conceptually, why do sampled posterior lines fan out beyond the data range $[-1,2]$?</p>`,
      steps: [
        { do: `Each sampled line shares roughly the same value near the data but has a slightly different slope.`, why: `The posterior pins down the lines where data constrains them.` },
        { do: `Small slope differences multiply with distance from the data center.`, why: `A line's spread grows as you extrapolate.` },
        { do: `So the lines diverge (fan out) far from the observed $x$ range.`, why: `Extrapolation is poorly constrained, hence uncertain.` }
      ],
      answer: `Slope uncertainty in the posterior amplifies with distance, so the lines fan out where there is no data.`
    },
    {
      q: `<p>The full predictive distribution at a new $x_*$ has variance $\\sigma_n^2 + \\phi(x_*)^\\top S_N \\phi(x_*)$. Name the two sources of uncertainty it combines.</p>`,
      steps: [
        { do: `$\\sigma_n^2$ is the irreducible observation noise.`, why: `Even a perfect line has noisy measurements.` },
        { do: `$\\phi(x_*)^\\top S_N\\phi(x_*)$ is the weight (parameter) uncertainty propagated to $x_*$.`, why: `Our uncertainty about $w$ adds to the prediction's spread.` }
      ],
      answer: `Observation noise $\\sigma_n^2$ plus parameter uncertainty $\\phi(x_*)^\\top S_N\\phi(x_*)$.`
    },
    {
      q: `<p>How does raising the prior precision $\\alpha$ change the posterior mean and the sampled lines?</p>`,
      steps: [
        { do: `Larger $\\alpha$ strengthens the prior pull toward $w=0$.`, why: `The prior insists weights are small.` },
        { do: `The posterior mean shrinks toward flatter lines.`, why: `More regularization (larger $\\lambda=\\alpha/\\beta$) damps the slope.` },
        { do: `The lines also concentrate more around that shrunken mean.`, why: `A strong prior reduces variance but can add bias.` }
      ],
      answer: `Bigger $\\alpha$ pulls the mean toward flat (small-weight) lines and adds more regularization/bias.`
    }
  ]);

  /* ================================================================ */
  /* 7. GRADIENT BOOSTING / XGBOOST                                  */
  /* ================================================================ */
  add("cls-gradient-boosting", [
    {
      q: `<p>The boosting update is $F_m(x)=F_{m-1}(x)+\\nu\\,h_m(x)$. If $F_{m-1}(x)=2$, $h_m(x)=4$, and $\\nu=0.5$, find $F_m(x)$.</p>`,
      steps: [
        { do: `Plug in: $F_m = 2 + 0.5\\cdot 4$.`, why: `Add a shrunk fraction of the new tree to the running model.` },
        { do: `$=2+2=4$.`, why: `The learning rate $\\nu$ scales the contribution.` }
      ],
      answer: `$F_m(x)=4$`
    },
    {
      q: `<p>For squared-error loss, what does each new tree $h_m$ fit?</p>`,
      steps: [
        { do: `It fits the residual $r_i=y_i-F_{m-1}(x_i)$.`, why: `Squared loss makes the negative gradient equal the residual.` },
        { do: `Equivalently, the negative gradient of the loss.`, why: `Boosting is gradient descent in function space.` }
      ],
      answer: `The residuals $y_i-F_{m-1}(x_i)$ (the negative gradient).`
    },
    {
      q: `<p>Targets $y=[10,20,30]$. The starting model is $F_0=$ mean. Compute $F_0$ and the initial residuals.</p>`,
      steps: [
        { do: `$F_0 = (10+20+30)/3 = 20$.`, why: `The constant minimizing squared error is the mean.` },
        { do: `Residuals $r=y-F_0=[10-20,\\ 20-20,\\ 30-20]=[-10,\\ 0,\\ 10]$.`, why: `Residual is target minus current prediction.` }
      ],
      answer: `$F_0=20$, residuals $r=[-10,\\ 0,\\ 10]$.`
    },
    {
      q: `<p>Continuing ($y=[10,20,30]$, $F_0=20$), with $\\nu=1$ a stump outputs $h_1=[-10,\\ 0,\\ 10]$. Compute $F_1$ and the new residuals.</p>`,
      steps: [
        { do: `$F_1=F_0+\\nu h_1=[20-10,\\ 20+0,\\ 20+10]=[10,\\ 20,\\ 30]$.`, why: `Add the full tree since $\\nu=1$.` },
        { do: `New residuals $=y-F_1=[0,\\ 0,\\ 0]$.`, why: `The stump perfectly captured the residuals here.` }
      ],
      answer: `$F_1=[10,20,30]$, residuals $=[0,0,0]$.`
    },
    {
      q: `<p>Why is a small learning rate $\\nu$ (shrinkage) often better than $\\nu=1$?</p>`,
      steps: [
        { do: `Small $\\nu$ takes gentle steps, so no single tree dominates.`, why: `Each tree corrects only a fraction of the residual.` },
        { do: `This reduces overfitting and usually improves the final model.`, why: `Many small steps generalize better, at the cost of more trees.` }
      ],
      answer: `Small $\\nu$ takes gentler steps, reducing overfitting and improving accuracy (needs more trees).`
    },
    {
      q: `<p>A stump splits points $x=[1,2,3,4]$ with residuals $r=[-2,-2,2,2]$ at threshold $x<2.5$. Compute the left and right leaf predictions (mean residual per side).</p>`,
      steps: [
        { do: `Left side ($x<2.5$): points 1,2 with residuals $-2,-2$; mean $=-2$.`, why: `A regression leaf predicts the mean of its residuals.` },
        { do: `Right side ($x\\ge 2.5$): points 3,4 with residuals $2,2$; mean $=2$.`, why: `Same rule on the other side of the split.` }
      ],
      answer: `Left leaf $=-2$, right leaf $=+2$.`
    },
    {
      q: `<p>For the squared loss $L=\\tfrac12(y_i-F_i)^2$, compute the gradient $g_i=\\partial L/\\partial F_i$, and confirm $-g_i$ is the residual.</p>`,
      steps: [
        { do: `Differentiate: $g_i=\\frac{\\partial}{\\partial F_i}\\tfrac12(y_i-F_i)^2 = -(y_i-F_i)$.`, why: `Chain rule with the inner derivative $-1$.` },
        { do: `So $-g_i = y_i-F_i$, the residual.`, why: `The negative gradient is exactly what the next tree fits.` }
      ],
      answer: `$g_i=-(y_i-F_i)$, so $-g_i=y_i-F_i$ (the residual).`
    },
    {
      q: `<p>Targets $y=[10,20,30]$, $F_0=20$, residuals $[-10,0,10]$. A crude stump outputs $-10$ on point 1 and $+5$ on points 2,3, with $\\nu=1$. Compute $F_1$ and the new residuals.</p>`,
      steps: [
        { do: `$F_1=[20-10,\\ 20+5,\\ 20+5]=[10,\\ 25,\\ 25]$.`, why: `Add the stump's per-point output.` },
        { do: `New residuals $=[10-10,\\ 20-25,\\ 30-25]=[0,\\ -5,\\ 5]$.`, why: `Errors shrank from $\\pm 10$ to $\\pm 5$.` }
      ],
      answer: `$F_1=[10,25,25]$, residuals $=[0,-5,5]$.`
    },
    {
      q: `<p>Compute the total squared error before ($r=[-10,0,10]$) and after ($r=[0,-5,5]$) that boosting step, and confirm it dropped.</p>`,
      steps: [
        { do: `Before: $(-10)^2+0^2+10^2 = 100+0+100 = 200$.`, why: `Sum of squared residuals of $F_0$.` },
        { do: `After: $0^2+(-5)^2+5^2 = 0+25+25 = 50$.`, why: `Sum of squared residuals of $F_1$.` },
        { do: `$50 < 200$, so error fell.`, why: `Each boosting stage reduces training loss.` }
      ],
      answer: `SSE dropped from 200 to 50.`
    },
    {
      q: `<p>Why is gradient boosting described as "gradient descent in function space"?</p>`,
      steps: [
        { do: `Treat the vector of predictions $F(x_i)$ as the optimization variable.`, why: `We minimize $\\sum_i L(y_i,F(x_i))$ over the function $F$.` },
        { do: `The negative gradient $-g_i$ gives the downhill direction at each point.`, why: `Standard gradient descent steps opposite the gradient.` },
        { do: `A tree $h_m$ approximates $-g_i$, and $F_m=F_{m-1}+\\nu h_m$ takes a step of size $\\nu$.`, why: `Each tree is one descent step, in the space of functions.` }
      ],
      answer: `Each tree approximates the negative gradient $-g_i$ and is added with step $\\nu$, so boosting is gradient descent where the steps are trees.`
    },
    {
      q: `<p>After $M$ stages, $F_M(x)=F_0+\\nu\\sum_{m=1}^{M}h_m(x)$. With $F_0=5$, $\\nu=0.1$, and three stumps giving $h_1(x)=2,h_2(x)=-1,h_3(x)=3$, compute $F_3(x)$.</p>`,
      steps: [
        { do: `Sum the stump outputs: $2+(-1)+3 = 4$.`, why: `Boosting accumulates the trees.` },
        { do: `$F_3=5+0.1\\cdot 4 = 5+0.4 = 5.4$.`, why: `Each tree contributes $\\nu$ times its output.` }
      ],
      answer: `$F_3(x)=5.4$`
    },
    {
      q: `<p>For absolute-error loss $L=|y_i-F_i|$, what does the negative gradient $-g_i$ become (for $F_i\\ne y_i$)? What does each tree fit then?</p>`,
      steps: [
        { do: `$\\frac{\\partial}{\\partial F_i}|y_i-F_i| = -\\,\\text{sign}(y_i-F_i)$.`, why: `Derivative of absolute value is $\\pm 1$.` },
        { do: `So $-g_i=\\text{sign}(y_i-F_i)$.`, why: `Each tree fits just the sign of the residual, making boosting robust to outliers.` }
      ],
      answer: `$-g_i=\\text{sign}(y_i-F_i)$; the tree fits the residual signs ($\\pm 1$).`
    },
    {
      q: `<p>How does boosting differ from a random forest (bagging) in how trees are built and combined?</p>`,
      steps: [
        { do: `Random forests build many deep trees independently (in parallel) on bootstrap samples and average them.`, why: `Bagging reduces variance via independent voters.` },
        { do: `Boosting builds shallow trees sequentially, each correcting the previous model's residuals.`, why: `It reduces bias by adapting to remaining errors stage by stage.` }
      ],
      answer: `Forest: independent deep trees averaged (variance reduction). Boosting: sequential shallow trees fixing residuals (bias reduction).`
    },
    {
      q: `<p>XGBoost adds regularization $\\Omega(h)=\\gamma T + \\tfrac12\\lambda\\sum_j w_j^2$ where $T$ is the number of leaves and $w_j$ are leaf weights. What do the $\\gamma$ and $\\lambda$ terms each discourage?</p>`,
      steps: [
        { do: `$\\gamma T$ penalizes the number of leaves $T$.`, why: `It discourages overly complex (deep/bushy) trees.` },
        { do: `$\\tfrac12\\lambda\\sum_j w_j^2$ penalizes large leaf weights.`, why: `It shrinks leaf outputs, like ridge regularization, curbing overfit.` }
      ],
      answer: `$\\gamma$ penalizes extra leaves (tree complexity); $\\lambda$ shrinks leaf weights (large outputs).`
    },
    {
      q: `<p>XGBoost uses a second-order (Newton) approximation. The optimal leaf weight is $w_j^* = -\\frac{G_j}{H_j+\\lambda}$, where $G_j=\\sum g_i$ and $H_j=\\sum h_i$ over the leaf. With $G_j=-6$, $H_j=3$, $\\lambda=1$, compute $w_j^*$.</p>`,
      steps: [
        { do: `Plug in: $w_j^* = -\\frac{-6}{3+1}$.`, why: `Newton step using gradient sum $G_j$ and Hessian sum $H_j$.` },
        { do: `$= \\frac{6}{4} = 1.5$.`, why: `The $\\lambda$ in the denominator shrinks the weight toward 0.` }
      ],
      answer: `$w_j^* = 1.5$`
    },
    {
      q: `<p>XGBoost's split gain uses $\\frac{G_L^2}{H_L+\\lambda}+\\frac{G_R^2}{H_R+\\lambda}-\\frac{(G_L+G_R)^2}{H_L+H_R+\\lambda}-\\gamma$. With $G_L=4,H_L=2,G_R=-2,H_R=2,\\lambda=0,\\gamma=0$, compute the gain.</p>`,
      steps: [
        { do: `Left: $\\frac{4^2}{2}=8$. Right: $\\frac{(-2)^2}{2}=2$.`, why: `Score of each child leaf.` },
        { do: `Parent: $\\frac{(4-2)^2}{4}=\\frac{4}{4}=1$.`, why: `Score if the node were not split.` },
        { do: `Gain $=8+2-1-0 = 9$.`, why: `Positive gain means the split improves the objective.` }
      ],
      answer: `Gain $=9$ (a beneficial split).`
    },
    {
      q: `<p>Continuing the gain formula, what does the threshold $\\gamma$ control? When does XGBoost decline to make a split?</p>`,
      steps: [
        { do: `$\\gamma$ is subtracted from every split's gain.`, why: `It is the minimum gain required to justify adding a leaf.` },
        { do: `If gain $-\\gamma \\le 0$, the split is rejected (pruned).`, why: `A split that does not beat the complexity cost is not worth it.` }
      ],
      answer: `$\\gamma$ is the minimum-gain threshold; if a split's gain $\\le \\gamma$ it is pruned (not made).`
    },
    {
      q: `<p>If you set the learning rate $\\nu$ very small, what must you do to still fit the data well, and what is the trade-off?</p>`,
      steps: [
        { do: `Small $\\nu$ means each tree barely moves the model.`, why: `Only a sliver of each tree is kept.` },
        { do: `You must add many more trees (larger $M$) to reach a good fit.`, why: `Total correction is $\\nu \\sum h_m$, so more terms are needed.` },
        { do: `Trade-off: better generalization but higher training/inference cost.`, why: `More trees take longer to train and evaluate.` }
      ],
      answer: `Use many more trees ($M$); the trade-off is better generalization but more compute.`
    },
    {
      q: `<p>Early stopping watches validation loss as trees are added. Why does training loss keep falling while validation loss can start rising?</p>`,
      steps: [
        { do: `Each added tree fits residuals on the training set, so training loss monotonically decreases.`, why: `Boosting greedily reduces training error every stage.` },
        { do: `Eventually trees start fitting noise specific to the training data.`, why: `Overfitting: gains on training do not transfer.` },
        { do: `Validation loss then rises, signaling the optimal number of trees.`, why: `Early stopping halts at the validation minimum.` }
      ],
      answer: `Trees keep cutting training loss but eventually fit noise, so validation loss turns up — early stopping picks that minimum.`
    }
  ]);

})();
