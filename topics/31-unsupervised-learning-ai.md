# Unsupervised Learning in AI (k-means, PCA)

> **Source:** Artificial Intelligence — Stanford CS 221 &middot; Topic 31/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

### 1.6 Unsupervised Learning

The class of unsupervised learning methods aims at discovering the structure of the data, which may have of rich latent structures.

#### 1.6.1 $k$-means

- **Clustering** — Given a training set of input points $\mathcal{D}_{\text{train}}$, the goal of a clustering algorithm is to assign each point $\phi(x_i)$ to a cluster $z_i\in\{1,...,k\}$.

- **Objective function** — The loss function for one of the main clustering algorithms, $k$-means, is given by:

$$
\operatorname{Loss}_{k\text{-means}}(x,\mu)=\sum_{i=1}^m\|\phi(x_i)-\mu_{z_i}\|^2
$$

- **Algorithm** — After randomly initializing the cluster centroids $\mu_1,\mu_2,...,\mu_k\in\mathbb{R}^n$, the $k$-means algorithm repeats the following step until convergence:

$$
z_i=\operatorname*{argmin}_j\|\phi(x_i)-\mu_j\|^2
\quad\text{and}\quad
\mu_j=\frac{\sum_{i=1}^m\mathbf{1}_{\{z_i=j\}}\phi(x_i)}{\sum_{i=1}^m\mathbf{1}_{\{z_i=j\}}}
$$

*[Figure: A four-stage $k$-means illustration. The first panel shows scattered points and initial means marked by colored plus signs (“Means initialization”); the second panel shows colored Voronoi-like cluster assignments (“Cluster assignment”); the third panel shows centroids moving to cluster centers (“Means update”); the final panel shows stable colored clusters and means (“Convergence”).]*

#### 1.6.2 Principal Component Analysis

- **Eigenvalue, eigenvector** — Given a matrix $A\in\mathbb{R}^{n\times n}$, $\lambda$ is said to be an eigenvalue of $A$ if there exists a vector $z\in\mathbb{R}^n\setminus\{0\}$, called eigenvector, such that we have:

$$
Az=\lambda z
$$

- **Spectral theorem** — Let $A\in\mathbb{R}^{n\times n}$. If $A$ is symmetric, then $A$ is diagonalizable by a real orthogonal matrix $U\in\mathbb{R}^{n\times n}$. By noting $\Lambda=\operatorname{diag}(\lambda_1,...,\lambda_n)$, we have:

$$
\exists\Lambda\text{ diagonal},\quad A=U\Lambda U^T
$$

*Remark: the eigenvector associated with the largest eigenvalue is called principal eigenvector of matrix $A$.*

- **Algorithm** — The Principal Component Analysis (PCA) procedure is a dimension reduction technique that projects the data on $k$ dimensions by maximizing the variance of the data as follows:

- Step 1: Normalize the data to have a mean of 0 and standard deviation of 1.

$$
x_j^{(i)}\leftarrow\frac{x_j^{(i)}-\mu_j}{\sigma_j}
\quad\text{where}\quad
\mu_j=\frac{1}{m}\sum_{i=1}^m x_j^{(i)}
\quad\text{and}\quad
\sigma_j^2=\frac{1}{m}\sum_{i=1}^m\left(x_j^{(i)}-\mu_j\right)^2
$$

- Step 2: Compute $\Sigma=\frac{1}{m}\sum_{i=1}^m x^{(i)}x^{(i)T}\in\mathbb{R}^{n\times n}$, which is symmetric with real eigenvalues.

- Step 3: Compute $u_1,...,u_k\in\mathbb{R}^n$ the $k$ orthogonal principal eigenvectors of $\Sigma$, i.e. the orthogonal eigenvectors of the $k$ largest eigenvalues.

- Step 4: Project the data on $\operatorname{span}(u_1,...,u_k)$. This procedure maximizes the variance among all $k$-dimensional spaces.

*[Figure: A three-panel PCA diagram. The first panel shows two-dimensional data in feature space with axes $X_1$ and $X_2$; the second panel overlays principal component directions on the data; the third panel shows the data in principal component space with axes $PC_1$ and $PC_2$, illustrating projection onto directions of maximum variance.]*
