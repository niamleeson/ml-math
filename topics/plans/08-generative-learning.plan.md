# Lesson Plan — 08 Generative Learning: GDA & Naive Bayes

| Field | Value |
|---|---|
| Source | CS 229 |
| Content category | Model |
| Example type | ⚖️ Both |
| Colab notebook | Yes |
| Est. lesson time | 50–65 min |
| Source topic file | ../08-generative-learning.md |

## Part 1 — Overview (plan)
Generative learning models the class-conditional data distribution $P(x\mid y)$ and then uses Bayes' rule to classify with $P(y\mid x)$. Hook: rather than drawing the boundary directly, estimate how each class could have generated the point.

## Part 2 — Key Idea (plan)
- **Focus (per category = Model):** formulation + when to use Gaussian Discriminant Analysis for continuous Gaussian-like features and Naive Bayes for high-dimensional discrete/count features such as text.
- **Core artifacts to present:** Bayes rule for $P(y\mid x)$; GDA assumptions $y\sim\operatorname{Bernoulli}(\phi)$, $x\mid y=0\sim\mathcal N(\mu_0,\Sigma)$, $x\mid y=1\sim\mathcal N(\mu_1,\Sigma)$; MLEs $\hat\phi$, $\hat\mu_j$, shared $\hat\Sigma$; linear boundary from shared covariance; Naive Bayes factorization $P(x\mid y)=\prod_iP(x_i\mid y)$; class prior/count estimates; Laplace smoothing for zero counts.

## Part 3 — Worked Examples

### 🟢 Basics (3)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| B1 | Estimate one Bernoulli class prior $\hat\phi$ from labels | toy labels | printed count fraction | ~2 |
| B2 | Compute one GDA class mean $\hat\mu_j$ | toy 2-D points from one class | mean point on tiny scatter | ~3 |
| B3 | Multiply two Naive Bayes feature likelihoods $\prod_iP(x_i\mid y)$ | toy categorical likelihoods | printed values | ~2 |

### 🟡 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | [pen-and-paper] Estimate GDA class prior and means | Four 2-D labeled points | Table computing $\hat\phi$, $\hat\mu_0$, $\hat\mu_1$ | pen-and-paper ~4 |
| E2 | [pen-and-paper] Shared covariance by hand | Same tiny GDA dataset | Residual outer-product table summed into $\hat\Sigma$ | pen-and-paper ~5 |
| E3 | [coded] GDA on two Gaussian clouds | Synthetic 2-D Gaussians with shared covariance | class Gaussian contours forming; resulting linear boundary | ~5 |
| E4 | [pen-and-paper] Naive Bayes word counts for spam | Tiny email vocabulary with class labels | Count table for $P(y)$ and $P(x_i\mid y)$ | pen-and-paper ~5 |
| E5 | [coded] Multinomial Naive Bayes text toy example | Small built-in sentence corpus | class word-probability bars; predicted posterior bars | ~5 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | [coded] GDA vs logistic regression boundary | Synthetic Gaussian data satisfying GDA assumptions | GDA density contours + boundary beside logistic boundary | ~6 |
| A2 | [coded] Unequal covariance failure mode for shared-$\Sigma$ GDA | Two Gaussians with different covariance matrices | contours reveal mismatch; linear GDA boundary misclassifies curved/tilted overlap | ~6 |
| A3 | [pen-and-paper] Bayes posterior from GDA likelihoods | Given $\phi,\mu_0,\mu_1,\Sigma$ and a query point | Compute two Gaussian likelihoods, odds, and posterior decision | pen-and-paper ~7 |
| A4 | [coded] Laplace smoothing prevents zero-probability collapse | Toy spam text with unseen token in test email | unsmoothed posterior collapses to 0; smoothed bars recover | ~6 |
| A5 | [coded] Correlated features break Naive Bayes independence | Synthetic binary features with controlled correlation | true vs NB likelihood heatmap; calibration/reliability plot | ~7 |

## Part 4 — Colab Notebook
- **Notebook file:** topics/notebooks/08-generative-learning.ipynb
- **Est. cell count:** ~80 (⚖️ topic → all 13 examples (3 basics + 5 easy + 5 advanced), mixing hand MLE/Bayes derivations with coded density and text examples)
- **Key libraries:** numpy, matplotlib, scipy.stats, scikit-learn (`GaussianNB`, `MultinomialNB`, `LogisticRegression`, `CountVectorizer`), ipywidgets
- **Runtime:** CPU
- **Failure/edge dataset included:** unequal-covariance Gaussian data in A2 and correlated-feature data in A5 — show shared-covariance and independence assumptions breaking.
- **Signature visualizations:** per-class Gaussian contour formation; class density + decision boundary; word probability and posterior bar charts.
