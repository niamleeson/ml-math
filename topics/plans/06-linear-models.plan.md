# Lesson Plan — 06 Linear Models: Regression, Logistic, GLM

| Field | Value |
|---|---|
| Source | CS 229 |
| Content category | Model |
| Example type | ⚖️ Both |
| Colab notebook | Yes |
| Est. lesson time | 55–70 min |
| Source topic file | ../06-linear-models.md |

## Part 1 — Overview (plan)
Linear models connect simple geometry (lines, planes, hyperplanes) to probability models for regression, binary classification, multiclass classification, and GLMs. Hook: one score $\theta^Tx$ can mean a fitted value, a log-odds, or a natural parameter depending on the assumed distribution.

## Part 2 — Key Idea (plan)
- **Focus (per category = Model):** formulation + when to use ordinary least squares, LMS/gradient descent, locally weighted regression, logistic regression, softmax regression, and GLMs.
- **Core artifacts to present:** design matrix $X$; normal equations $\theta=(X^TX)^{-1}X^Ty$; squared-error objective; LMS update $\theta_j\leftarrow\theta_j+\alpha\sum_i(y^{(i)}-h_\theta(x^{(i)}))x_j^{(i)}$; LWR weights $w^{(i)}(x)=\exp(-(x^{(i)}-x)^2/(2\tau^2))$; sigmoid $g(z)=1/(1+e^{-z})$; Bernoulli likelihood/logistic loss; softmax $\phi_i=\exp(\theta_i^Tx)/\sum_j\exp(\theta_j^Tx)$; exponential-family form $p(y;\eta)=b(y)\exp(\eta T(y)-a(\eta))$ and GLM assumptions.

## Part 3 — Worked Examples

### 🟢 Basics (10)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| B1 | Compute one linear score $\theta^Tx$ with an intercept | toy scalars: one feature vector and $\theta$ | printed values | ~2 |
| B2 | Convert one score into a sigmoid probability $g(z)$ | toy scalars: one logit $z$ | sigmoid point on curve | ~2 |
| B3 | Compute one locally weighted regression weight $w^{(i)}(x)$ | toy scalars: $x^{(i)}$, query $x$, and $\tau$ | printed values | ~3 |
| B4 | Build one design-matrix row $[1,x]$ | toy scalar: one raw feature | printed row | ~2 |
| B5 | Compute one residual $y-\widehat y$ | toy scalars: one target and prediction | printed residual | ~2 |
| B6 | Compute squared error for one prediction | toy scalars: one target and prediction | printed squared error | ~2 |
| B7 | Take one LMS step for one point | toy vector: one row, one target, one $\theta$ | printed old/new parameters | ~3 |
| B8 | Compute MSE of three predictions | toy arrays: three targets and predictions | printed MSE | ~2 |
| B9 | Compute a tiny $X^TX$ matrix | toy design matrix with two rows | printed matrix | ~2 |
| B10 | Compute logistic loss for one labeled example | toy scalar: one logit and label | printed probability and loss | ~3 |

### 🟡 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | [pen-and-paper] Fit a line with the normal equations | Tiny 3-point dataset with intercept column | Table of $X$, $X^TX$, $X^Ty$, and fitted residuals | pen-and-paper ~4 |
| E2 | [coded] OLS line + residual anatomy | Synthetic linear data with Gaussian noise | fitted line + vertical residual segments; residual histogram | ~4 |
| E3 | [pen-and-paper] One LMS batch update by hand | Two examples, two parameters, fixed $\alpha$ | Gradient/update table comparing prediction error to parameter change | pen-and-paper ~5 |
| E4 | [coded] Logistic regression from score to probability | `make_classification` 2-D separable data | sigmoid curve; probability-contour decision boundary | ~5 |
| E5 | [pen-and-paper] Bernoulli logistic likelihood for one example | One labeled point with specified $\theta^Tx$ | Calculation of $g(z)$, log-likelihood, and logistic loss | pen-and-paper ~4 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | [coded] Gradient descent path on squared-error loss | Synthetic one-feature regression | process: loss-vs-iteration + path on 3-D loss surface; result: converged line | ~6 |
| A2 | [coded] Locally weighted regression vs global OLS | Nonlinear sinusoidal data with noise | local weights around query point; OLS line vs LWR curve for several $\tau$ values | ~6 |
| A3 | [coded] Logistic regression failure on nonlinear classes | `make_moons` | probability contours; linear boundary failing on moons; accuracy annotated | ~6 |
| A4 | [coded] Softmax regression on three classes | Iris or `make_blobs` 3-class data | one-vs-all score contours; multiclass decision regions | ~6 |
| A5 | [pen-and-paper] GLM mapping: Gaussian, Bernoulli, Poisson | Three mini prediction scenarios | Table deriving $\eta$, $a(\eta)$, $\mathbb{E}[y\mid x]$, inverse-link interpretation | pen-and-paper ~6 |

## Part 4 — Colab Notebook
- **Notebook file:** topics/notebooks/06-linear-models.ipynb
- **Est. cell count:** ~86 (⚖️ topic → all 13 examples (3 basics + 5 easy + 5 advanced), mixing hand derivations with coded OLS/logistic/LWR/softmax examples)
- **Key libraries:** numpy, matplotlib, scikit-learn (`make_classification`, `make_moons`, `LogisticRegression`, `LinearRegression`), ipywidgets
- **Runtime:** CPU
- **Failure/edge dataset included:** `make_moons` in A3 — shows a linear decision boundary cannot represent nonlinear class geometry.
- **Signature visualizations:** fitted line + residuals; loss-vs-iteration with 3-D loss-surface path; logistic probability contours and linear boundary failure.
