# Support Vector Machines

> **Source:** Machine Learning — Stanford CS 229 &middot; Topic 7/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

### 1.4 Support Vector Machines

The goal of support vector machines is to find the line that maximizes the minimum distance to the line.

- **Optimal margin classifier** — The optimal margin classifier $h$ is such that:

$$
h(x)=\operatorname{sign}(w^Tx-b)
$$

where $(w,b)\in\mathbb{R}^n\times\mathbb{R}$ is the solution of the following optimization problem:

$$
\min \frac{1}{2}\|w\|^2\quad\text{such that}\quad y^{(i)}(w^Tx^{(i)}-b)\geq 1
$$

*[Figure: SVM scatter plot with blue and red points separated by the line $w^Tx-b=0$, parallel margin lines $w^Tx-b=1$ and $w^Tx-b=-1$, circled support vectors on the margins, margin width $2/\|w\|$, and arrows labeling support vectors; illustrates maximum-margin classification.]*

Remark: the line is defined as $w^Tx-b=0$.

- **Hinge loss** — The hinge loss is used in the setting of SVMs and is defined as follows:

$$
L(z,y)=[1-yz]_+=\max(0,1-yz)
$$

- **Kernel** — Given a feature mapping $\phi$, we define the kernel $K$ to be defined as:

$$
K(x,z)=\phi(x)^T\phi(z)
$$

In practice, the kernel $K$ defined by $K(x,z)=\exp\left(-\frac{\|x-z\|^2}{2\sigma^2}\right)$ is called the Gaussian kernel and is commonly used.

*[Figure: Three-panel SVM kernel illustration: a non-linearly separable ring-shaped data set, its separation after use of a kernel mapping $\phi$, and the resulting circular decision boundary in the original space; illustrates the kernel trick.]*

Remark: we say that we use the “kernel trick” to compute the cost function using the kernel because we actually don’t need to know the explicit mapping $\phi$, which is often very complicated. Instead, only the values $K(x,z)$ are needed.

- **Lagrangian** — We define the Lagrangian $\mathcal{L}(w,b)$ as follows:

$$
\mathcal{L}(w,b)=f(w)+\sum_{i=1}^{l}\beta_i h_i(w)
$$

Remark: the coefficients $\beta_i$ are called the Lagrange multipliers.
