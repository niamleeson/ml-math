# Trees, Ensembles & Non-parametric Methods

> **Source:** Machine Learning — Stanford CS 229 &middot; Topic 9/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

### 1.6 Tree-based and ensemble methods

These methods can be used for both regression and classification problems.

- **CART** — Classification and Regression Trees (CART), commonly known as decision trees, can be represented as binary trees. They have the advantage to be very interpretable.

- **Random forest** — It is a tree-based technique that uses a high number of decision trees built out of randomly selected sets of features. Contrary to the simple decision tree, it is highly uninterpretable but its generally good performance makes it a popular algorithm.

Remark: random forests are a type of ensemble methods.

- **Boosting** — The idea of boosting methods is to combine several weak learners to form a stronger one. The main ones are summed up in the table below:

| Adaptive boosting | Gradient boosting |
|---|---|
| - High weights are put on errors to improve at the next boosting step<br>- Known as Adaboost | - Weak learners trained on remaining errors |

### 1.7 Other non-parametric approaches

- **$k$-nearest neighbors** — The $k$-nearest neighbors algorithm, commonly known as $k$-NN, is a non-parametric approach where the response of a data point is determined by the nature of its $k$ neighbors from the training set. It can be used in both classification and regression settings.

Remark: The higher the parameter $k$, the higher the bias, and the lower the parameter $k$, the higher the variance.

*[Figure: Three $k$-nearest-neighbors classification panels with blue and red points and colored decision regions for $k=1$, $k=3$, and $k=11$; illustrates increasingly smoother decision boundaries as $k$ increases.]*
