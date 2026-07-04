# Learning Theory

> **Source:** Machine Learning — Stanford CS 229 &middot; Topic 10/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

### 1.8 Learning Theory

- **Union bound** — Let $A_1,\ldots,A_k$ be $k$ events. We have:

$$
P(A_1\cup\ldots\cup A_k)\leq P(A_1)+\ldots+P(A_k)
$$

*[Figure: Venn-style event illustration showing overlapping sets $A_1\cup A_2\cup A_3$ and separate shaded sets labeled $A_1$, $A_2$, and $A_3$; illustrates that the probability of a union is upper bounded by the sum of individual probabilities.]*

- **Hoeffding inequality** — Let $Z_1,\ldots,Z_m$ be $m$ iid variables drawn from a Bernoulli distribution of parameter $\phi$. Let $\widehat{\phi}$ be their sample mean and $\gamma>0$ fixed. We have:

$$
P\left(|\phi-\widehat{\phi}|>\gamma\right)\leq 2\exp(-2\gamma^2m)
$$

Remark: this inequality is also known as the Chernoff bound.

- **Training error** — For a given classifier $h$, we define the training error $\widehat{\epsilon}(h)$, also known as the empirical risk or empirical error, to be as follows:

$$
\widehat{\epsilon}(h)=\frac{1}{m}\sum_{i=1}^{m}\mathbf{1}_{\{h(x^{(i)})\neq y^{(i)}\}}
$$

- **Probably Approximately Correct (PAC)** — PAC is a framework under which numerous results on learning theory were proved, and has the following set of assumptions:

  - the training and testing sets follow the same distribution
  - the training examples are drawn independently

- **Shattering** — Given a set $S=\{x^{(1)},\ldots,x^{(d)}\}$, and a set of classifiers $\mathcal{H}$, we say that $\mathcal{H}$ shatters $S$ if for any set of labels $\{y^{(1)},\ldots,y^{(d)}\}$, we have:

$$
\exists h\in\mathcal{H},\quad \forall i\in[\![1,d]\!],\quad h(x^{(i)})=y^{(i)}
$$

- **Upper bound theorem** — Let $\mathcal{H}$ be a finite hypothesis class such that $|\mathcal{H}|=k$ and let $\delta$ and the sample size $m$ be fixed. Then, with probability of at least $1-\delta$, we have:

$$
\epsilon(\widehat{h})\leq\left(\min_{h\in\mathcal{H}}\epsilon(h)\right)+2\sqrt{\frac{1}{2m}\log\left(\frac{2k}{\delta}\right)}
$$

- **VC dimension** — The Vapnik-Chervonenkis (VC) dimension of a given infinite hypothesis class $\mathcal{H}$, noted $\mathrm{VC}(\mathcal{H})$ is the size of the largest set that is shattered by $\mathcal{H}$.

Remark: the VC dimension of $\mathcal{H}=\{$set of linear classifiers in 2 dimensions$\}$ is 3.

*[Figure: Sequence of small two-dimensional point configurations with blue and red labels separated by lines, demonstrating that linear classifiers in two dimensions can shatter three points but not all labelings of four points; illustrates VC dimension.]*

- **Theorem (Vapnik)** — Let $\mathcal{H}$ be given, with $\mathrm{VC}(\mathcal{H})=d$ and $m$ the number of training examples. With probability at least $1-\delta$, we have:

$$
\epsilon(\widehat{h})\leq\left(\min_{h\in\mathcal{H}}\epsilon(h)\right)+O\left(\sqrt{\frac{d}{m}\log\left(\frac{m}{d}\right)+\frac{1}{m}\log\left(\frac{1}{\delta}\right)}\right)
$$
