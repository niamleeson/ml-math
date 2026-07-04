# Clustering: EM, k-means, Hierarchical

> **Source:** Machine Learning — Stanford CS 229 &middot; Topic 11/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

## 2 Unsupervised Learning

### 2.1 Introduction to Unsupervised Learning

- **Motivation** — The goal of unsupervised learning is to find hidden patterns in unlabeled data $\{x^{(1)},\ldots,x^{(m)}\}$.

- **Jensen’s inequality** — Let $f$ be a convex function and $X$ a random variable. We have the following inequality:

$$
\mathbb{E}[f(X)]\geq f(\mathbb{E}[X])
$$

### 2.2 Clustering

#### 2.2.1 Expectation-Maximization

- **Latent variables** — Latent variables are hidden/unobserved variables that make estimation problems difficult, and are often denoted $z$. Here are the most common settings where there are latent variables:

| Setting | Latent variable $z$ | $x\mid z$ | Comments |
|---|---|---|---|
| Mixture of $k$ Gaussians | $\operatorname{Multinomial}(\phi)$ | $\mathcal{N}(\mu_j,\Sigma_j)$ | $\mu_j\in\mathbb{R}^n,\ \phi\in\mathbb{R}^k$ |
| Factor analysis | $\mathcal{N}(0,I)$ | $\mathcal{N}(\mu+\Lambda z,\psi)$ | $\mu_j\in\mathbb{R}^n$ |

- **Algorithm** — The Expectation-Maximization (EM) algorithm gives an efficient method at estimating the parameter $\theta$ through maximum likelihood estimation by repeatedly constructing a lower-bound on the likelihood (E-step) and optimizing that lower bound (M-step) as follows:

  - E-step: Evaluate the posterior probability $Q_i(z^{(i)})$ that each data point $x^{(i)}$ came from a particular cluster $z^{(i)}$ as follows:

$$
Q_i(z^{(i)})=P(z^{(i)}\mid x^{(i)};\theta)
$$

  - M-step: Use the posterior probabilities $Q_i(z^{(i)})$ as cluster specific weights on data points $x^{(i)}$ to separately re-estimate each cluster model as follows:

$$
\theta_i=\operatorname*{argmax}_{\theta}\sum_i\int_{z^{(i)}}Q_i(z^{(i)})\log\left(\frac{P(x^{(i)},z^{(i)};\theta)}{Q_i(z^{(i)})}\right)dz^{(i)}
$$

*[Figure: Expectation-Maximization diagram showing Gaussian initialization with three colored Gaussian clusters, an expectation step assigning soft cluster regions, a maximization step updating Gaussian contours and centers, and convergence; illustrates alternating E-step and M-step refinement.]*

#### 2.2.2 $k$-means clustering

We note $c^{(i)}$ the cluster of data point $i$ and $\mu_j$ the center of cluster $j$.

- **Algorithm** — After randomly initializing the cluster centroids $\mu_1,\mu_2,\ldots,\mu_k\in\mathbb{R}^n$, the $k$-means algorithm repeats the following step until convergence:

$$
c^{(i)}=\operatorname*{argmin}_{j}\left\|x^{(i)}-\mu_j\right\|^2\quad\text{and}\quad \mu_j=\frac{\sum_{i=1}^{m}\mathbf{1}_{\{c^{(i)}=j\}}x^{(i)}}{\sum_{i=1}^{m}\mathbf{1}_{\{c^{(i)}=j\}}}
$$

*[Figure: $k$-means diagram with means initialization, cluster assignment Voronoi regions, means update, and convergence for three clusters; illustrates iterative assignment and centroid update until stable clusters.]*

- **Distortion function** — In order to see if the algorithm converges, we look at the distortion function defined as follows:

$$
J(c,\mu)=\sum_{i=1}^{m}\left\|x^{(i)}-\mu_{c^{(i)}}\right\|^2
$$

#### 2.2.3 Hierarchical clustering

- **Algorithm** — It is a clustering algorithm with an agglomerative hierarchical approach that build nested clusters in a successive manner.

- **Types** — There are different sorts of hierarchical clustering algorithms that aims at optimizing different objective functions, which is summed up in the table below:

| Ward linkage | Average linkage | Complete linkage |
|---|---|---|
| Minimize within cluster distance | Minimize average distance between cluster pairs | Minimize maximum distance of between cluster pairs |

#### 2.2.4 Clustering assessment metrics

In an unsupervised learning setting, it is often hard to assess the performance of a model since we don’t have the ground truth labels as was the case in the supervised learning setting.

- **Silhouette coefficient** — By noting $a$ and $b$ the mean distance between a sample and all other points in the same class, and between a sample and all other points in the next nearest cluster, the silhouette coefficient $s$ for a single sample is defined as follows:

$$
s=\frac{b-a}{\max(a,b)}
$$


- **Calinski-Harabasz index** — By noting $k$ the number of clusters, $B_k$ and $W_k$ the between and within-clustering dispersion matrices respectively defined as

$$
B_k = \sum_{j=1}^{k} n_{c^{(i)}}(\mu_{c^{(i)}}-\mu)(\mu_{c^{(i)}}-\mu)^T, \qquad W_k = \sum_{i=1}^{m}(x^{(i)}-\mu_{c^{(i)}})(x^{(i)}-\mu_{c^{(i)}})^T
$$

the Calinski-Harabasz index $s(k)$ indicates how well a clustering model defines its clusters, such that the higher the score, the more dense and well separated the clusters are. It is defined as follows:

$$
s(k) = \frac{\operatorname{Tr}(B_k)}{\operatorname{Tr}(W_k)} \times \frac{N-k}{k-1}
$$
