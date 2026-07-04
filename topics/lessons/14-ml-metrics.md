# ML Metrics: Classification & Regression
> **Source:** CS 229 · **Category:** Metric · **Type:** 🧮 Numeric · [↑ Full reference](../../ai-ml-cheatsheets.md)

## 1. Overview

Metrics translate predictions into decisions about model quality: whether a classifier is safe to deploy, whether a regression model explains variation, and whether a more complex model is worth its cost. The central warning is that the same classifier can look excellent by accuracy and dangerous by recall when classes are imbalanced. In this lesson, every metric is computed by hand so that each number can be traced back to counts, residuals, likelihoods, and model size.

## 2. Key Idea

### Classification counts: the confusion matrix

For binary classification, write the positive class as $+$ and the negative class as $-$.

| Actual class | Predicted $+$ | Predicted $-$ | How to read it |
|---|---:|---:|---|
| Actual $+$ | $\textrm{TP}$ | $\textrm{FN}$ | True positives are caught positives; false negatives are missed positives. |
| Actual $-$ | $\textrm{FP}$ | $\textrm{TN}$ | False positives are false alarms; true negatives are correctly rejected negatives. |

Let

$$
N=\textrm{TP}+\textrm{TN}+\textrm{FP}+\textrm{FN}.
$$

- **Accuracy**

$$
\textrm{Accuracy}=\frac{\textrm{TP}+\textrm{TN}}{\textrm{TP}+\textrm{TN}+\textrm{FP}+\textrm{FN}}.
$$

Read it as the overall fraction of examples classified correctly; it can hide poor minority-class performance.

- **Precision**

$$
\textrm{Precision}=\frac{\textrm{TP}}{\textrm{TP}+\textrm{FP}}.
$$

Read it as: among examples predicted positive, what fraction really were positive?

- **Recall / sensitivity / true positive rate**

$$
\textrm{Recall}=\textrm{Sensitivity}=\textrm{TPR}=\frac{\textrm{TP}}{\textrm{TP}+\textrm{FN}}.
$$

Read it as: among actual positives, what fraction did the model find?

- **Specificity / true negative rate**

$$
\textrm{Specificity}=\frac{\textrm{TN}}{\textrm{TN}+\textrm{FP}}.
$$

Read it as: among actual negatives, what fraction did the model correctly reject?

- **F1 score**

$$
\textrm{F1}=\frac{2\textrm{TP}}{2\textrm{TP}+\textrm{FP}+\textrm{FN}}.
$$

Equivalently, when precision $P$ and recall $R$ are defined,

$$
\textrm{F1}=\frac{2PR}{P+R}.
$$

Read it as a harmonic-mean compromise between precision and recall; it is pulled toward the smaller of the two.

- **False positive rate**

$$
\textrm{FPR}=\frac{\textrm{FP}}{\textrm{TN}+\textrm{FP}}=1-\textrm{Specificity}.
$$

Read it as: among actual negatives, what fraction were incorrectly accepted as positive?

- **ROC curve**

A receiver operating characteristic curve plots

$$
\textrm{TPR}=\frac{\textrm{TP}}{\textrm{TP}+\textrm{FN}}
\quad\textrm{versus}\quad
\textrm{FPR}=\frac{\textrm{FP}}{\textrm{TN}+\textrm{FP}}
$$

as the classification threshold varies. Read each point as one operating mode of the same scoring model.

- **AUC / AUROC**

$$
\textrm{AUC}=\textrm{area under the ROC curve}.
$$

Read it as threshold-averaged ranking quality: larger area means positives tend to receive higher scores than negatives.

### Regression sums and model-selection metrics

Suppose a regression model $f$ predicts $f(x_i)$ for examples $i=1,\ldots,m$, and let

$$
\overline{y}=\frac{1}{m}\sum_{i=1}^{m}y_i.
$$

- **Total sum of squares**

$$
\textrm{SS}_{\textrm{tot}}=\sum_{i=1}^{m}(y_i-\overline{y})^2.
$$

Read it as the total variation in the observed responses around their mean.

- **Explained sum of squares**

$$
\textrm{SS}_{\textrm{reg}}=\sum_{i=1}^{m}(f(x_i)-\overline{y})^2.
$$

Read it as the variation in predictions around the response mean.

- **Residual sum of squares**

$$
\textrm{SS}_{\textrm{res}}=\sum_{i=1}^{m}(y_i-f(x_i))^2.
$$

Read it as unexplained squared error left by the model; smaller is better when comparing on the same data.

- **Coefficient of determination**

$$
R^2=1-\frac{\textrm{SS}_{\textrm{res}}}{\textrm{SS}_{\textrm{tot}}}.
$$

Read it as the fraction of total variation explained relative to the mean baseline; negative values mean worse than predicting $\overline{y}$.

- **Adjusted $R^2$**

$$
\textrm{Adjusted }R^2=1-\frac{(1-R^2)(m-1)}{m-n-1}.
$$

Read it as $R^2$ with a penalty for using $n$ variables; adding weak variables can lower it.

- **Mallows' Cp**

$$
C_p=\frac{\textrm{SS}_{\textrm{res}}+2(n+1)\widehat{\sigma}^2}{m}.
$$

Read it as residual error plus a complexity penalty based on the number of fitted coefficients $n+1$; smaller is preferred for models fit to the same response with the same variance estimate.

- **AIC**

$$
\textrm{AIC}=2\left[(n+2)-\log(L)\right].
$$

Read it as a likelihood reward minus a complexity penalty; because lower AIC is better, it favors high likelihood but penalizes extra parameters.

- **BIC**

$$
\textrm{BIC}=\log(m)(n+2)-2\log(L).
$$

Read it as a likelihood reward minus a sample-size-dependent complexity penalty; for $m>e^2\approx7.39$, BIC penalizes each variable more strongly than AIC.

## 3. Worked Examples

### 🟢 Easy

#### E1. Fill and read a binary confusion matrix

**Problem.** Given $100$ examples with $\textrm{TP}=30$, $\textrm{FP}=10$, $\textrm{FN}=5$, and $\textrm{TN}=55$, compute accuracy, precision, recall, and specificity.

**Solution.**

First place the counts in the confusion matrix.

| Actual class | Predicted $+$ | Predicted $-$ | Row total |
|---|---:|---:|---:|
| Actual $+$ | $\textrm{TP}=30$ | $\textrm{FN}=5$ | $30+5=35$ |
| Actual $-$ | $\textrm{FP}=10$ | $\textrm{TN}=55$ | $10+55=65$ |
| Column total | $30+10=40$ | $5+55=60$ | $100$ |

Compute the total number of examples.

$$
N=\textrm{TP}+\textrm{TN}+\textrm{FP}+\textrm{FN}
=30+55+10+5=100.
$$

Accuracy measures all correct classifications.

$$
\textrm{Accuracy}=\frac{\textrm{TP}+\textrm{TN}}{N}
=\frac{30+55}{100}
=\frac{85}{100}
=0.85.
$$

Precision measures correctness among predicted positives.

$$
\textrm{Precision}=\frac{\textrm{TP}}{\textrm{TP}+\textrm{FP}}
=\frac{30}{30+10}
=\frac{30}{40}
=0.75.
$$

Recall measures coverage among actual positives.

$$
\textrm{Recall}=\frac{\textrm{TP}}{\textrm{TP}+\textrm{FN}}
=\frac{30}{30+5}
=\frac{30}{35}
=\frac{6}{7}
\approx0.8571.
$$

Specificity measures coverage among actual negatives.

$$
\textrm{Specificity}=\frac{\textrm{TN}}{\textrm{TN}+\textrm{FP}}
=\frac{55}{55+10}
=\frac{55}{65}
=\frac{11}{13}
\approx0.8462.
$$

Therefore,

$$
\boxed{\textrm{Accuracy}=0.85,\quad \textrm{Precision}=0.75,\quad \textrm{Recall}\approx0.8571,\quad \textrm{Specificity}\approx0.8462.}
$$

#### E2. Compute F1 from precision and recall

**Problem.** Given precision $P=0.80$ and recall $R=0.50$, compute F1 and explain why it is closer to the smaller value.

**Solution.**

Use the harmonic-mean form of F1.

$$
\textrm{F1}=\frac{2PR}{P+R}.
$$

Substitute $P=0.80$ and $R=0.50$.

$$
\textrm{F1}=\frac{2(0.80)(0.50)}{0.80+0.50}.
$$

Multiply in the numerator.

$$
2(0.80)(0.50)=1.60(0.50)=0.80.
$$

Add in the denominator.

$$
0.80+0.50=1.30.
$$

Divide.

$$
\textrm{F1}=\frac{0.80}{1.30}=\frac{80}{130}=\frac{8}{13}\approx0.6154.
$$

Compare with the arithmetic mean.

$$
\frac{P+R}{2}=\frac{0.80+0.50}{2}=\frac{1.30}{2}=0.65.
$$

The harmonic mean $0.6154$ is below the arithmetic mean $0.65$ because F1 punishes imbalance between precision and recall. Its distance from recall is

$$
0.6154-0.50=0.1154,
$$

while its distance from precision is

$$
0.80-0.6154=0.1846.
$$

Thus F1 is numerically closer to the smaller component, recall.

$$
\boxed{\textrm{F1}=\frac{8}{13}\approx0.6154,\textrm{ closer to }0.50\textrm{ than to }0.80.}
$$

#### E3. Imbalanced accuracy trap

**Problem.** There are $1{,}000$ patients, $20$ of whom are positive for a disease. A classifier predicts every patient as negative. Derive the confusion matrix and compare accuracy, recall, and specificity.

**Solution.**

There are $20$ actual positives.

$$
\textrm{Actual positives}=20.
$$

There are $1{,}000-20=980$ actual negatives.

$$
\textrm{Actual negatives}=980.
$$

The classifier predicts all patients as negative, so it predicts no positives.

$$
\textrm{TP}=0,\qquad \textrm{FP}=0.
$$

All actual positives are missed, so they are false negatives.

$$
\textrm{FN}=20.
$$

All actual negatives are correctly predicted negative, so they are true negatives.

$$
\textrm{TN}=980.
$$

The confusion matrix is

| Actual class | Predicted $+$ | Predicted $-$ | Row total |
|---|---:|---:|---:|
| Actual $+$ | $0$ | $20$ | $20$ |
| Actual $-$ | $0$ | $980$ | $980$ |
| Column total | $0$ | $1000$ | $1000$ |

Compute accuracy.

$$
\textrm{Accuracy}=\frac{\textrm{TP}+\textrm{TN}}{\textrm{TP}+\textrm{TN}+\textrm{FP}+\textrm{FN}}
=\frac{0+980}{0+980+0+20}
=\frac{980}{1000}=0.98.
$$

Compute recall.

$$
\textrm{Recall}=\frac{\textrm{TP}}{\textrm{TP}+\textrm{FN}}
=\frac{0}{0+20}=\frac{0}{20}=0.
$$

Compute specificity.

$$
\textrm{Specificity}=\frac{\textrm{TN}}{\textrm{TN}+\textrm{FP}}
=\frac{980}{980+0}
=\frac{980}{980}=1.
$$

This model has excellent accuracy because negatives dominate the data, but it finds none of the sick patients.

$$
\boxed{\textrm{Accuracy}=0.98,\quad \textrm{Recall}=0,\quad \textrm{Specificity}=1.}
$$

#### E4. One ROC point from a threshold

**Problem.** For $8$ examples, scores and labels are given below. At threshold $0.6$, predict positive when score $\ge 0.6$ and negative otherwise. Compute predicted labels, $\textrm{TP}$, $\textrm{FP}$, $\textrm{TPR}$, and $\textrm{FPR}$.

| Example | Score | True label |
|---:|---:|---:|
| 1 | $0.95$ | $+$ |
| 2 | $0.85$ | $-$ |
| 3 | $0.70$ | $+$ |
| 4 | $0.65$ | $+$ |
| 5 | $0.55$ | $-$ |
| 6 | $0.40$ | $+$ |
| 7 | $0.30$ | $-$ |
| 8 | $0.10$ | $-$ |

**Solution.**

Apply the threshold rule score $\ge0.6\Rightarrow\widehat{y}=+$.

| Example | Score | True label | Prediction | Outcome |
|---:|---:|---:|---:|---:|
| 1 | $0.95$ | $+$ | $+$ | TP |
| 2 | $0.85$ | $-$ | $+$ | FP |
| 3 | $0.70$ | $+$ | $+$ | TP |
| 4 | $0.65$ | $+$ | $+$ | TP |
| 5 | $0.55$ | $-$ | $-$ | TN |
| 6 | $0.40$ | $+$ | $-$ | FN |
| 7 | $0.30$ | $-$ | $-$ | TN |
| 8 | $0.10$ | $-$ | $-$ | TN |

Count true positives.

$$
\textrm{TP}=3 \quad \textrm{from examples }1,3,4.
$$

Count false positives.

$$
\textrm{FP}=1 \quad \textrm{from example }2.
$$

Count false negatives and true negatives because TPR and FPR need denominators.

$$
\textrm{FN}=1 \quad \textrm{from example }6,
$$

$$
\textrm{TN}=3 \quad \textrm{from examples }5,7,8.
$$

Compute TPR.

$$
\textrm{TPR}=\frac{\textrm{TP}}{\textrm{TP}+\textrm{FN}}
=\frac{3}{3+1}
=\frac{3}{4}=0.75.
$$

Compute FPR.

$$
\textrm{FPR}=\frac{\textrm{FP}}{\textrm{TN}+\textrm{FP}}
=\frac{1}{3+1}
=\frac{1}{4}=0.25.
$$

Thus the threshold $0.6$ gives one ROC point at horizontal coordinate $0.25$ and vertical coordinate $0.75$.

$$
\boxed{\textrm{TP}=3,\quad \textrm{FP}=1,\quad \textrm{TPR}=0.75,\quad \textrm{FPR}=0.25.}
$$

#### E5. Compute $R^2$ for a small regression

**Problem.** Given $y=[2,4,6]$ and predictions $\widehat{y}=[2,5,5]$, compute $\overline{y}$, $\textrm{SS}_{\textrm{tot}}$, $\textrm{SS}_{\textrm{res}}$, and $R^2$.

**Solution.**

Compute the response mean.

$$
\overline{y}=\frac{2+4+6}{3}=\frac{12}{3}=4.
$$

Compute total sum of squares.

$$
\textrm{SS}_{\textrm{tot}}=\sum_{i=1}^{3}(y_i-\overline{y})^2.
$$

Substitute each observed value.

$$
\textrm{SS}_{\textrm{tot}}=(2-4)^2+(4-4)^2+(6-4)^2.
$$

Evaluate each deviation.

$$
(2-4)^2=(-2)^2=4,
$$

$$
(4-4)^2=0^2=0,
$$

$$
(6-4)^2=2^2=4.
$$

Add the squared deviations.

$$
\textrm{SS}_{\textrm{tot}}=4+0+4=8.
$$

Compute residual sum of squares.

$$
\textrm{SS}_{\textrm{res}}=\sum_{i=1}^{3}(y_i-\widehat{y}_i)^2.
$$

Substitute observations and predictions.

$$
\textrm{SS}_{\textrm{res}}=(2-2)^2+(4-5)^2+(6-5)^2.
$$

Evaluate each residual square.

$$
(2-2)^2=0^2=0,
$$

$$
(4-5)^2=(-1)^2=1,
$$

$$
(6-5)^2=1^2=1.
$$

Add the residual squares.

$$
\textrm{SS}_{\textrm{res}}=0+1+1=2.
$$

Compute $R^2$.

$$
R^2=1-\frac{\textrm{SS}_{\textrm{res}}}{\textrm{SS}_{\textrm{tot}}}
=1-\frac{2}{8}
=1-0.25
=0.75.
$$

The model explains $75\%$ of the variation relative to the mean baseline.

$$
\boxed{\overline{y}=4,\quad \textrm{SS}_{\textrm{tot}}=8,\quad \textrm{SS}_{\textrm{res}}=2,\quad R^2=0.75.}
$$

### 🔴 Advanced

#### A1. Sweep thresholds and approximate ROC-AUC

**Problem.** Six scored examples are sorted from highest score to lowest score.

| Rank | Score | True label |
|---:|---:|---:|
| 1 | $0.95$ | $+$ |
| 2 | $0.90$ | $-$ |
| 3 | $0.80$ | $+$ |
| 4 | $0.60$ | $+$ |
| 5 | $0.40$ | $-$ |
| 6 | $0.20$ | $-$ |

Sweep the threshold from above all scores to below all scores. Compute $\textrm{TPR}$ and $\textrm{FPR}$ at each ROC point and approximate AUC using the step/trapezoid areas between consecutive points.

**Solution.**

There are three actual positives and three actual negatives.

$$
P=3,\qquad N=3.
$$

Start with threshold above $0.95$, so no example is predicted positive.

$$
\textrm{TP}=0,\quad \textrm{FP}=0,
$$

$$
\textrm{TPR}=\frac{0}{3}=0,
\qquad
\textrm{FPR}=\frac{0}{3}=0.
$$

As the threshold passes each score, the corresponding example becomes predicted positive. Track cumulative counts.

| Included scores | Newly included label | TP | FP | TPR | FPR | ROC point |
|---|---:|---:|---:|---:|---:|---:|
| none | none | $0$ | $0$ | $0/3=0$ | $0/3=0$ | $(0,0)$ |
| $0.95$ | $+$ | $1$ | $0$ | $1/3$ | $0/3=0$ | $(0,1/3)$ |
| $0.95,0.90$ | $-$ | $1$ | $1$ | $1/3$ | $1/3$ | $(1/3,1/3)$ |
| through $0.80$ | $+$ | $2$ | $1$ | $2/3$ | $1/3$ | $(1/3,2/3)$ |
| through $0.60$ | $+$ | $3$ | $1$ | $3/3=1$ | $1/3$ | $(1/3,1)$ |
| through $0.40$ | $-$ | $3$ | $2$ | $1$ | $2/3$ | $(2/3,1)$ |
| through $0.20$ | $-$ | $3$ | $3$ | $1$ | $1$ | $(1,1)$ |

Now compute area under the piecewise-linear ROC curve by summing trapezoids between consecutive points. The points in order are

$$
(0,0),\ (0,1/3),\ (1/3,1/3),\ (1/3,2/3),\ (1/3,1),\ (2/3,1),\ (1,1).
$$

Vertical segments have width $0$, so their area is $0$.

From $(0,0)$ to $(0,1/3)$:

$$
\Delta x=0-0=0,
\qquad
\textrm{area}=0.
$$

From $(0,1/3)$ to $(1/3,1/3)$, height is constant $1/3$.

$$
\Delta x=\frac{1}{3}-0=\frac{1}{3},
$$

$$
\textrm{area}=\Delta x\cdot \frac{y_1+y_2}{2}
=\frac{1}{3}\cdot\frac{\frac{1}{3}+\frac{1}{3}}{2}
=\frac{1}{3}\cdot\frac{\frac{2}{3}}{2}
=\frac{1}{3}\cdot\frac{1}{3}
=\frac{1}{9}.
$$

From $(1/3,1/3)$ to $(1/3,2/3)$:

$$
\Delta x=\frac{1}{3}-\frac{1}{3}=0,
\qquad
\textrm{area}=0.
$$

From $(1/3,2/3)$ to $(1/3,1)$:

$$
\Delta x=\frac{1}{3}-\frac{1}{3}=0,
\qquad
\textrm{area}=0.
$$

From $(1/3,1)$ to $(2/3,1)$:

$$
\Delta x=\frac{2}{3}-\frac{1}{3}=\frac{1}{3},
$$

$$
\textrm{area}=\frac{1}{3}\cdot\frac{1+1}{2}
=\frac{1}{3}\cdot1
=\frac{1}{3}.
$$

From $(2/3,1)$ to $(1,1)$:

$$
\Delta x=1-\frac{2}{3}=\frac{1}{3},
$$

$$
\textrm{area}=\frac{1}{3}\cdot\frac{1+1}{2}
=\frac{1}{3}.
$$

Add the nonzero areas.

$$
\textrm{AUC}=\frac{1}{9}+\frac{1}{3}+\frac{1}{3}
=\frac{1}{9}+\frac{3}{9}+\frac{3}{9}
=\frac{7}{9}
\approx0.7778.
$$

Because the empirical ROC consists of horizontal and vertical steps, this equals the step area as well.

$$
\boxed{\textrm{ROC points }(0,0),(0,1/3),(1/3,1/3),(1/3,2/3),(1/3,1),(2/3,1),(1,1),\quad \textrm{AUC}=\frac{7}{9}\approx0.7778.}
$$

#### A2. Precision-recall tradeoff under rare positives

**Problem.** There are $200$ examples and $10$ actual positives. Two thresholds give the following confusion matrices:

- Threshold A: $\textrm{TP}=9$, $\textrm{FP}=45$, $\textrm{FN}=1$, $\textrm{TN}=145$.
- Threshold B: $\textrm{TP}=6$, $\textrm{FP}=9$, $\textrm{FN}=4$, $\textrm{TN}=181$.

A deployment rule requires recall at least $0.80$. Decide which threshold is eligible, then compare precision and F1.

**Solution.**

First verify the actual positives for each threshold.

For threshold A:

$$
\textrm{TP}+\textrm{FN}=9+1=10.
$$

For threshold B:

$$
\textrm{TP}+\textrm{FN}=6+4=10.
$$

Both match the stated $10$ positives.

Compute recall for threshold A.

$$
\textrm{Recall}_A=\frac{\textrm{TP}}{\textrm{TP}+\textrm{FN}}
=\frac{9}{9+1}
=\frac{9}{10}=0.90.
$$

Compute recall for threshold B.

$$
\textrm{Recall}_B=\frac{6}{6+4}
=\frac{6}{10}=0.60.
$$

Compare with the deployment constraint.

$$
0.90\ge0.80 \quad \textrm{so A is eligible},
$$

$$
0.60<0.80 \quad \textrm{so B is not eligible}.
$$

Now compute precision for threshold A.

$$
\textrm{Precision}_A=\frac{9}{9+45}
=\frac{9}{54}
=\frac{1}{6}
\approx0.1667.
$$

Compute precision for threshold B.

$$
\textrm{Precision}_B=\frac{6}{6+9}
=\frac{6}{15}
=0.40.
$$

Threshold B is more precise, but it misses too many positives for the recall rule.

Compute F1 for A using the count formula.

$$
\textrm{F1}_A=\frac{2\textrm{TP}}{2\textrm{TP}+\textrm{FP}+\textrm{FN}}
=\frac{2(9)}{2(9)+45+1}
=\frac{18}{18+45+1}
=\frac{18}{64}
=0.28125.
$$

Compute F1 for B.

$$
\textrm{F1}_B=\frac{2(6)}{2(6)+9+4}
=\frac{12}{12+9+4}
=\frac{12}{25}
=0.48.
$$

B has higher precision and higher F1, but it violates the minimum recall constraint. If the recall constraint is mandatory, choose A; if there were no constraint and F1 were the only objective, choose B.

$$
\boxed{\textrm{Only threshold A is eligible because recall}_A=0.90\ge0.80;\ \textrm{precision}_A\approx0.1667,\ \textrm{F1}_A=0.28125.}
$$

#### A3. Negative $R^2$ edge case

**Problem.** Let $y=[1,2,3,4]$ and let a model predict $\widehat{y}=[10,10,10,10]$. Show that $\textrm{SS}_{\textrm{res}}>\textrm{SS}_{\textrm{tot}}$ and interpret the negative $R^2$.

**Solution.**

Compute the mean response.

$$
\overline{y}=\frac{1+2+3+4}{4}=\frac{10}{4}=2.5.
$$

Compute total sum of squares.

$$
\textrm{SS}_{\textrm{tot}}=(1-2.5)^2+(2-2.5)^2+(3-2.5)^2+(4-2.5)^2.
$$

Evaluate each term.

$$
(1-2.5)^2=(-1.5)^2=2.25,
$$

$$
(2-2.5)^2=(-0.5)^2=0.25,
$$

$$
(3-2.5)^2=(0.5)^2=0.25,
$$

$$
(4-2.5)^2=(1.5)^2=2.25.
$$

Add them.

$$
\textrm{SS}_{\textrm{tot}}=2.25+0.25+0.25+2.25=5.00.
$$

Compute residual sum of squares.

$$
\textrm{SS}_{\textrm{res}}=(1-10)^2+(2-10)^2+(3-10)^2+(4-10)^2.
$$

Evaluate each residual square.

$$
(1-10)^2=(-9)^2=81,
$$

$$
(2-10)^2=(-8)^2=64,
$$

$$
(3-10)^2=(-7)^2=49,
$$

$$
(4-10)^2=(-6)^2=36.
$$

Add them.

$$
\textrm{SS}_{\textrm{res}}=81+64+49+36=230.
$$

Compare residual variation with total variation.

$$
230>5,
$$

so the model's squared error is much larger than the squared error from predicting the mean $2.5$ for every point.

Compute $R^2$.

$$
R^2=1-\frac{\textrm{SS}_{\textrm{res}}}{\textrm{SS}_{\textrm{tot}}}
=1-\frac{230}{5}
=1-46
=-45.
$$

A negative $R^2$ does not mean the model explains a negative physical amount of variation. It means the model is worse than the baseline predictor $\widehat{y}=\overline{y}=2.5$.

$$
\boxed{\textrm{SS}_{\textrm{tot}}=5,\quad \textrm{SS}_{\textrm{res}}=230,\quad R^2=-45,\textrm{ so the model is worse than predicting the mean.}}
$$

#### A4. Adjusted $R^2$ penalizes extra variables

**Problem.** There are $m=30$ observations. Model A uses $n=2$ variables and has $R^2=0.70$. Model B uses $n=8$ variables and has $R^2=0.76$. Compute adjusted $R^2$ for both models and choose the better one by adjusted $R^2$.

**Solution.**

Use the formula

$$
\textrm{Adjusted }R^2=1-\frac{(1-R^2)(m-1)}{m-n-1}.
$$

For model A, substitute $m=30$, $n=2$, and $R^2=0.70$.

$$
\textrm{Adjusted }R_A^2=1-\frac{(1-0.70)(30-1)}{30-2-1}.
$$

Simplify the terms.

$$
1-0.70=0.30,
$$

$$
30-1=29,
$$

$$
30-2-1=27.
$$

Substitute the simplified values.

$$
\textrm{Adjusted }R_A^2=1-\frac{0.30\cdot29}{27}.
$$

Multiply the numerator.

$$
0.30\cdot29=8.70.
$$

Divide.

$$
\frac{8.70}{27}=0.322222\ldots.
$$

Subtract from $1$.

$$
\textrm{Adjusted }R_A^2=1-0.322222\ldots=0.677777\ldots\approx0.6778.
$$

For model B, substitute $m=30$, $n=8$, and $R^2=0.76$.

$$
\textrm{Adjusted }R_B^2=1-\frac{(1-0.76)(30-1)}{30-8-1}.
$$

Simplify the terms.

$$
1-0.76=0.24,
$$

$$
30-1=29,
$$

$$
30-8-1=21.
$$

Substitute.

$$
\textrm{Adjusted }R_B^2=1-\frac{0.24\cdot29}{21}.
$$

Multiply.

$$
0.24\cdot29=6.96.
$$

Divide.

$$
\frac{6.96}{21}=0.331428\ldots.
$$

Subtract from $1$.

$$
\textrm{Adjusted }R_B^2=1-0.331428\ldots=0.668571\ldots\approx0.6686.
$$

Compare the adjusted values.

$$
0.6778>0.6686.
$$

Although B has larger raw $R^2$, the improvement from $0.70$ to $0.76$ is not enough to justify adding six more variables under adjusted $R^2$.

$$
\boxed{\textrm{Adjusted }R_A^2\approx0.6778,\quad \textrm{Adjusted }R_B^2\approx0.6686,\quad \textrm{choose Model A.}}
$$

#### A5. Compare AIC/BIC for model selection

**Problem.** Two regression models are fit on $m=100$ observations.

- Model A uses $n=3$ variables and has $\log(L)=-120$.
- Model B uses $n=8$ variables and has $\log(L)=-113$.

Compute AIC and BIC for both models using the formulas from the reference, then explain why BIC punishes complexity more.

**Solution.**

Use

$$
\textrm{AIC}=2\left[(n+2)-\log(L)\right]
$$

and

$$
\textrm{BIC}=\log(m)(n+2)-2\log(L).
$$

For model A, compute $n+2$.

$$
n_A+2=3+2=5.
$$

Compute AIC for A.

$$
\textrm{AIC}_A=2\left[5-(-120)\right]
=2(5+120)
=2(125)
=250.
$$

For model B, compute $n+2$.

$$
n_B+2=8+2=10.
$$

Compute AIC for B.

$$
\textrm{AIC}_B=2\left[10-(-113)\right]
=2(10+113)
=2(123)
=246.
$$

Compare AIC values.

$$
246<250,
$$

so AIC prefers model B.

Now compute BIC. Since $m=100$,

$$
\log(m)=\log(100)\approx4.60517.
$$

Compute BIC for A.

$$
\textrm{BIC}_A=\log(100)(5)-2(-120)
=4.60517(5)+240.
$$

Multiply the penalty term.

$$
4.60517(5)=23.02585.
$$

Add.

$$
\textrm{BIC}_A=23.02585+240=263.02585.
$$

Compute BIC for B.

$$
\textrm{BIC}_B=\log(100)(10)-2(-113)
=4.60517(10)+226.
$$

Multiply the penalty term.

$$
4.60517(10)=46.05170.
$$

Add.

$$
\textrm{BIC}_B=46.05170+226=272.05170.
$$

Compare BIC values.

$$
263.02585<272.05170,
$$

so BIC prefers model A.

To see why, compare the complexity penalty per unit of $(n+2)$. In AIC,

$$
\textrm{AIC}=2(n+2)-2\log(L),
$$

so the penalty per counted parameter is $2$. In BIC, the penalty per counted parameter is

$$
\log(100)\approx4.60517.
$$

Since

$$
4.60517>2,
$$

BIC punishes the five extra variables in B more heavily. B's log-likelihood improves by

$$
-113-(-120)=7,
$$

which lowers the likelihood part $-2\log(L)$ by

$$
-2(-113)-[-2(-120)]=226-240=-14.
$$

AIC adds only

$$
2(10)-2(5)=20-10=10
$$

extra penalty, so B wins by $14-10=4$ AIC units. BIC adds

$$
4.60517(10)-4.60517(5)=46.05170-23.02585=23.02585
$$

extra penalty, which exceeds the $14$ likelihood improvement, so B loses by approximately $23.02585-14=9.02585$ BIC units.

$$
\boxed{\textrm{AIC}_A=250,\ \textrm{AIC}_B=246\textrm{ so AIC chooses B; }\textrm{BIC}_A\approx263.03,\ \textrm{BIC}_B\approx272.05\textrm{ so BIC chooses A.}}
$$
