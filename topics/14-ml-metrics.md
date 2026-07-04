# ML Metrics: Classification & Regression

> **Source:** Machine Learning — Stanford CS 229 &middot; Topic 14/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

## 4 Machine Learning Tips and Tricks

### 4.1 Metrics

Given a set of data points $\{x^{(1)},...,x^{(m)}\}$, where each $x^{(i)}$ has $n$ features, associated to a set of outcomes $\{y^{(1)},...,y^{(m)}\}$, we want to assess a given classifier that learns how to predict $y$ from $x$.

#### 4.1.1 Classification

In a context of a binary classification, here are the main metrics that are important to track to assess the performance of the model.

- **Confusion matrix** — The confusion matrix is used to have a more complete picture when assessing the performance of a model. It is defined as follows:

*[Figure: Confusion matrix for binary classification. Columns are predicted class $+$ and $-$, rows are actual class $+$ and $-$; cells show TP True Positives in green, FN False Negatives Type II error in red, FP False Positives Type I error in red, and TN True Negatives in green.]*

- **Main metrics** — The following metrics are commonly used to assess the performance of classification models:

| Metric | Formula | Interpretation |
|---|---|---|
| Accuracy | $\frac{\textrm{TP}+\textrm{TN}}{\textrm{TP}+\textrm{TN}+\textrm{FP}+\textrm{FN}}$ | Overall performance of model |
| Precision | $\frac{\textrm{TP}}{\textrm{TP}+\textrm{FP}}$ | How accurate the positive predictions are |
| Recall Sensitivity | $\frac{\textrm{TP}}{\textrm{TP}+\textrm{FN}}$ | Coverage of actual positive sample |
| Specificity | $\frac{\textrm{TN}}{\textrm{TN}+\textrm{FP}}$ | Coverage of actual negative sample |
| F1 score | $\frac{2\textrm{TP}}{2\textrm{TP}+\textrm{FP}+\textrm{FN}}$ | Hybrid metric useful for unbalanced classes |

- **ROC** — The receiver operating curve, also noted ROC, is the plot of TPR versus FPR by varying the threshold. These metrics are are summed up in the table below:

| Metric | Formula | Equivalent |
|---|---|---|
| True Positive Rate TPR | $\frac{\textrm{TP}}{\textrm{TP}+\textrm{FN}}$ | Recall, sensitivity |
| False Positive Rate FPR | $\frac{\textrm{FP}}{\textrm{TN}+\textrm{FP}}$ | 1-specificity |

- **AUC** — The area under the receiving operating curve, also noted AUC or AUROC, is the area below the ROC as shown in the following figure:

*[Figure: AUC and ROC illustration. Left plot has TPR on the vertical axis and FPR on the horizontal axis, both from 0 to 1, with a curved ROC boundary and shaded blue AUC region under it; right plot shows overlapping red Actual negative and green Actual positive score distributions separated by a vertical threshold, with bottom arrows for Predicted negative and Predicted positive regions.]*

#### 4.1.2 Regression

- **Basic metrics** — Given a regression model $f$, the following metrics are commonly used to assess the performance of the model:

| Total sum of squares | Explained sum of squares | Residual sum of squares |
|---|---|---|
| $\textrm{SS}_{\textrm{tot}}=\sum_{i=1}^{m}(y_i-\overline{y})^2$ | $\textrm{SS}_{\textrm{reg}}=\sum_{i=1}^{m}(f(x_i)-\overline{y})^2$ | $\textrm{SS}_{\textrm{res}}=\sum_{i=1}^{m}(y_i-f(x_i))^2$ |

- **Coefficient of determination** — The coefficient of determination, often noted $R^2$ or $r^2$, provides a measure of how well the observed outcomes are replicated by the model and is defined as follows:

$$
R^2 = 1 - \frac{\textrm{SS}_{\textrm{res}}}{\textrm{SS}_{\textrm{tot}}}
$$

- **Main metrics** — The following metrics are commonly used to assess the performance of regression models, by taking into account the number of variables $n$ that they take into consideration:

| Mallow’s Cp | AIC | BIC | Adjusted $R^2$ |
|---|---|---|---|
| $\frac{\textrm{SS}_{\textrm{res}}+2(n+1)\widehat{\sigma}^2}{m}$ | $2\left[(n+2)-\log(L)\right]$ | $\log(m)(n+2)-2\log(L)$ | $1-\frac{(1-R^2)(m-1)}{m-n-1}$ |

where $L$ is the likelihood and $\widehat{\sigma}^2$ is an estimate of the variance associated with each response.
