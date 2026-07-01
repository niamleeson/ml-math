# Part 3 — Core Machine Learning

> Plan only — per-topic revamp plan. See ../00-MASTER-PLAN.md for the shared design & family registry (F1–F17).
> **Code style:** every notebook code cell is written one statement per line (newline-split, blank lines between logical groups) for readability — never dense, semicolon-packed one-liners. See ../00-MASTER-PLAN.md §B.4.
> Dominant family: F1 (Supervised-Tabular); some topics F2/F3/F15.

### 3.1 — ML framing (supervised/unsupervised/semi/self)   [notebook: 3.1-ml-framing.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Model launch framing — apply ML framing (supervised/unsupervised/semi/self); lesson losses 0.191, 0.122, and 0.522 average to $R_S=0.835/3=0.278$ (lesson-cited).
2. Offline-to-online validation — apply ML framing (supervised/unsupervised/semi/self); lesson toy score 0.338 vs alternative 0.378 (gap 0.378-0.338=0.040) (lesson-cited).
3. A/B candidate triage — apply ML framing (supervised/unsupervised/semi/self); lesson cost term is 0.060. (lesson-cited).
4. Data science review boards — apply ML framing (supervised/unsupervised/semi/self); lesson stabilized score $0.80\times 0.338=0.270$ (lesson-cited).
5. Monitoring retrain triggers — apply ML framing (supervised/unsupervised/semi/self); lesson relative gap is 0.106 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `ml_framing_supervised_unsupervised_semi_se_method()` verifies lesson formula `\hat f=\arg\min_{f\in\mathcal F}\frac1m\sum_{i=1}^m\ell(f(x_i),y_i)` on D1 using losses 0.191, 0.122, and 0.522 -> $R_S=0.835/3=0.278$, cost 0.060, score 0.278+0.060=0.338, gap 0.378-0.338=0.040.
- Datasets D1–D5: D1 hand train/validation toy · D2 clean `make_classification` · D3 noisy/overlap split · D4 sklearn wine · D5 breast_cancer with shift/imbalance
- Metric: validation loss / generalization gap
- Closing viz: (a) train/validation split or learning-curve panels  (b) gap-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.2 — Generalization & the i.i.d. assumption   [notebook: 3.2-generalization-iid.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Model launch framing — apply Generalization & the i.i.d. assumption; lesson losses 0.202, 0.135, and 0.539 average to $R_S=0.876/3=0.292$ (lesson-cited).
2. Offline-to-online validation — apply Generalization & the i.i.d. assumption; lesson toy score 0.362 vs alternative 0.406 (gap 0.406-0.362=0.044) (lesson-cited).
3. A/B candidate triage — apply Generalization & the i.i.d. assumption; lesson cost term is 0.070. (lesson-cited).
4. Data science review boards — apply Generalization & the i.i.d. assumption; lesson stabilized score $0.80\times 0.362=0.290$ (lesson-cited).
5. Monitoring retrain triggers — apply Generalization & the i.i.d. assumption; lesson relative gap is 0.108 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `generalization_the_i_i_d_assumption_method()` verifies lesson formula `R(f)=\mathbb E[\ell(f(X),Y)],\qquad R_S(f)=\frac1m\sum_{i=1}^m\ell(f(x_i),y_i)` on D1 using losses 0.202, 0.135, and 0.539 -> $R_S=0.876/3=0.292$, cost 0.070, score 0.292+0.070=0.362, gap 0.406-0.362=0.044.
- Datasets D1–D5: D1 hand train/validation toy · D2 clean `make_classification` · D3 noisy/overlap split · D4 sklearn wine · D5 breast_cancer with shift/imbalance
- Metric: validation loss / generalization gap
- Closing viz: (a) train/validation split or learning-curve panels  (b) gap-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.3 — The bias–variance tradeoff   [notebook: 3.3-bias-variance.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Model launch framing — apply The bias–variance tradeoff; lesson losses 0.213, 0.148, and 0.420 average to $R_S=0.781/3=0.260$ (lesson-cited).
2. Offline-to-online validation — apply The bias–variance tradeoff; lesson toy score 0.340 vs alternative 0.388 (gap 0.388-0.340=0.048) (lesson-cited).
3. A/B candidate triage — apply The bias–variance tradeoff; lesson cost term is 0.080. (lesson-cited).
4. Data science review boards — apply The bias–variance tradeoff; lesson stabilized score $0.80\times 0.340=0.272$ (lesson-cited).
5. Monitoring retrain triggers — apply The bias–variance tradeoff; lesson relative gap is 0.124 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `the_bias_variance_tradeoff_method()` verifies lesson formula `\mathbb E[(Y-\hat f(x))^2]=\text{bias}^2+\text{variance}+\sigma^2` on D1 using losses 0.213, 0.148, and 0.420 -> $R_S=0.781/3=0.260$, cost 0.080, score 0.260+0.080=0.340, gap 0.388-0.340=0.048.
- Datasets D1–D5: D1 hand train/validation toy · D2 clean `make_classification` · D3 noisy/overlap split · D4 sklearn wine · D5 breast_cancer with shift/imbalance
- Metric: validation loss / generalization gap
- Closing viz: (a) train/validation split or learning-curve panels  (b) gap-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.4 — The perceptron algorithm   [notebook: 3.4-perceptron.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Fraud and abuse triage — apply The perceptron algorithm; lesson losses 0.224, 0.070, and 0.437 average to $R_S=0.731/3=0.244$ (lesson-cited).
2. Customer churn routing — apply The perceptron algorithm; lesson toy score 0.334 vs alternative 0.386 (gap 0.386-0.334=0.052) (lesson-cited).
3. Medical image/tabular screening — apply The perceptron algorithm; lesson cost term is 0.090. (lesson-cited).
4. Content moderation queues — apply The perceptron algorithm; lesson stabilized score $0.80\times 0.334=0.267$ (lesson-cited).
5. Credit/loan decisioning — apply The perceptron algorithm; lesson relative gap is 0.135 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `the_perceptron_algorithm_method()` verifies lesson formula `w\leftarrow w+y_i x_i\quad\text{when }y_i(w^\top x_i)\le 0` on D1 using losses 0.224, 0.070, and 0.437 -> $R_S=0.731/3=0.244$, cost 0.090, score 0.244+0.090=0.334, gap 0.386-0.334=0.052.
- Datasets D1–D5: D1 hand 2-class toy · D2 clean `make_classification` · D3 noisy/overlap · D4 sklearn iris/wine · D5 breast_cancer or digits
- Metric: accuracy (macro-F1 noted when classes skew)
- Closing viz: (a) decision-boundary small multiples  (b) accuracy-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.5 — Linear regression (OLS & normal equation)   [notebook: 3.5-linear-regression-ols.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Retail demand forecasting — apply Linear regression (OLS & normal equation); lesson losses 0.235, 0.083, and 0.454 average to $R_S=0.772/3=0.257$ (lesson-cited).
2. Ad bid / spend prediction — apply Linear regression (OLS & normal equation); lesson toy score 0.357 vs alternative 0.393 (gap 0.393-0.357=0.036) (lesson-cited).
3. Clinical risk-score regression — apply Linear regression (OLS & normal equation); lesson cost term is 0.100. (lesson-cited).
4. Energy-load forecasting — apply Linear regression (OLS & normal equation); lesson stabilized score $0.80\times 0.357=0.286$ (lesson-cited).
5. Manufacturing quality estimation — apply Linear regression (OLS & normal equation); lesson relative gap is 0.092 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `linear_regression_ols_normal_equation_method()` verifies lesson formula `\hat\beta=(X^\top X)^{-1}X^\top y` on D1 using losses 0.235, 0.083, and 0.454 -> $R_S=0.772/3=0.257$, cost 0.100, score 0.257+0.100=0.357, gap 0.393-0.357=0.036.
- Datasets D1–D5: D1 hand 3-point regression toy · D2 clean `make_regression` · D3 noisy/outlier regression · D4 sklearn diabetes · D5 california housing subsample
- Metric: MSE (with R² as a secondary annotation only)
- Closing viz: (a) fitted-line/residual small multiples  (b) MSE-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.6 — Linear regression via gradient descent   [notebook: 3.6-linear-regression-gradient-descent.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Retail demand forecasting — apply Linear regression via gradient descent; lesson losses 0.246, 0.096, and 0.471 average to $R_S=0.813/3=0.271$ (lesson-cited).
2. Ad bid / spend prediction — apply Linear regression via gradient descent; lesson toy score 0.321 vs alternative 0.361 (gap 0.361-0.321=0.040) (lesson-cited).
3. Clinical risk-score regression — apply Linear regression via gradient descent; lesson cost term is 0.050. (lesson-cited).
4. Energy-load forecasting — apply Linear regression via gradient descent; lesson stabilized score $0.80\times 0.321=0.257$ (lesson-cited).
5. Manufacturing quality estimation — apply Linear regression via gradient descent; lesson relative gap is 0.111 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `linear_regression_via_gradient_descent_method()` verifies lesson formula `\beta_{t+1}=\beta_t-\eta\frac{2}{m}X^\top(X\beta_t-y)` on D1 using losses 0.246, 0.096, and 0.471 -> $R_S=0.813/3=0.271$, cost 0.050, score 0.271+0.050=0.321, gap 0.361-0.321=0.040.
- Datasets D1–D5: D1 hand 3-point regression toy · D2 clean `make_regression` · D3 noisy/outlier regression · D4 sklearn diabetes · D5 california housing subsample
- Metric: MSE (with R² as a secondary annotation only)
- Closing viz: (a) fitted-line/residual small multiples  (b) MSE-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.7 — Polynomial & basis-function regression   [notebook: 3.7-polynomial-basis-regression.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Retail demand forecasting — apply Polynomial & basis-function regression; lesson losses 0.257, 0.109, and 0.488 average to $R_S=0.854/3=0.285$ (lesson-cited).
2. Ad bid / spend prediction — apply Polynomial & basis-function regression; lesson toy score 0.345 vs alternative 0.389 (gap 0.389-0.345=0.044) (lesson-cited).
3. Clinical risk-score regression — apply Polynomial & basis-function regression; lesson cost term is 0.060. (lesson-cited).
4. Energy-load forecasting — apply Polynomial & basis-function regression; lesson stabilized score $0.80\times 0.345=0.276$ (lesson-cited).
5. Manufacturing quality estimation — apply Polynomial & basis-function regression; lesson relative gap is 0.113 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `polynomial_basis_function_regression_method()` verifies lesson formula `\hat y=\sum_{j=0}^{p}\beta_j\phi_j(x)` on D1 using losses 0.257, 0.109, and 0.488 -> $R_S=0.854/3=0.285$, cost 0.060, score 0.285+0.060=0.345, gap 0.389-0.345=0.044.
- Datasets D1–D5: D1 hand 3-point regression toy · D2 clean `make_regression` · D3 noisy/outlier regression · D4 sklearn diabetes · D5 california housing subsample
- Metric: MSE (with R² as a secondary annotation only)
- Closing viz: (a) fitted-line/residual small multiples  (b) MSE-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.8 — Ridge regression (L2)   [notebook: 3.8-ridge-regression.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Retail demand forecasting — apply Ridge regression (L2); lesson losses 0.268, 0.122, and 0.505 average to $R_S=0.895/3=0.298$ (lesson-cited).
2. Ad bid / spend prediction — apply Ridge regression (L2); lesson toy score 0.368 vs alternative 0.416 (gap 0.416-0.368=0.048) (lesson-cited).
3. Clinical risk-score regression — apply Ridge regression (L2); lesson cost term is 0.070. (lesson-cited).
4. Energy-load forecasting — apply Ridge regression (L2); lesson stabilized score $0.80\times 0.368=0.294$ (lesson-cited).
5. Manufacturing quality estimation — apply Ridge regression (L2); lesson relative gap is 0.115 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `ridge_regression_l2_method()` verifies lesson formula `\hat\beta=\arg\min_\beta \|y-X\beta\|_2^2+\lambda\|\beta\|_2^2` on D1 using losses 0.268, 0.122, and 0.505 -> $R_S=0.895/3=0.298$, cost 0.070, score 0.298+0.070=0.368, gap 0.416-0.368=0.048.
- Datasets D1–D5: D1 hand 3-point regression toy · D2 clean `make_regression` · D3 noisy/outlier regression · D4 sklearn diabetes · D5 california housing subsample
- Metric: MSE (with R² as a secondary annotation only)
- Closing viz: (a) fitted-line/residual small multiples  (b) MSE-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.9 — Lasso (L1) & sparsity   [notebook: 3.9-lasso-sparsity.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Retail demand forecasting — apply Lasso (L1) & sparsity; lesson losses 0.180, 0.135, and 0.522 average to $R_S=0.837/3=0.279$ (lesson-cited).
2. Ad bid / spend prediction — apply Lasso (L1) & sparsity; lesson toy score 0.359 vs alternative 0.411 (gap 0.411-0.359=0.052) (lesson-cited).
3. Clinical risk-score regression — apply Lasso (L1) & sparsity; lesson cost term is 0.080. (lesson-cited).
4. Energy-load forecasting — apply Lasso (L1) & sparsity; lesson stabilized score $0.80\times 0.359=0.287$ (lesson-cited).
5. Manufacturing quality estimation — apply Lasso (L1) & sparsity; lesson relative gap is 0.127 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `lasso_l1_sparsity_method()` verifies lesson formula `\hat\beta=\arg\min_\beta \frac12\|y-X\beta\|_2^2+\lambda\|\beta\|_1` on D1 using losses 0.180, 0.135, and 0.522 -> $R_S=0.837/3=0.279$, cost 0.080, score 0.279+0.080=0.359, gap 0.411-0.359=0.052.
- Datasets D1–D5: D1 hand 3-point regression toy · D2 clean `make_regression` · D3 noisy/outlier regression · D4 sklearn diabetes · D5 california housing subsample
- Metric: MSE (with R² as a secondary annotation only)
- Closing viz: (a) fitted-line/residual small multiples  (b) MSE-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.10 — Elastic Net   [notebook: 3.10-elastic-net.ipynb]   (family: F1, gap)

**Lesson — Real World Applications (5):**
1. Retail demand forecasting — apply Elastic Net; lesson losses 0.191, 0.148, and 0.539 average to $R_S=0.878/3=0.293$ (lesson-cited).
2. Ad bid / spend prediction — apply Elastic Net; lesson toy score 0.383 vs alternative 0.419 (gap 0.419-0.383=0.036) (lesson-cited).
3. Clinical risk-score regression — apply Elastic Net; lesson cost term is 0.090. (lesson-cited).
4. Energy-load forecasting — apply Elastic Net; lesson stabilized score $0.80\times 0.383=0.306$ (lesson-cited).
5. Manufacturing quality estimation — apply Elastic Net; lesson relative gap is 0.086 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `elastic_net_method()` verifies lesson formula `\frac12\|y-X\beta\|_2^2+\lambda\big(\alpha\|\beta\|_1+(1-\alpha)\tfrac12\|\beta\|_2^2\big)` on D1 using losses 0.191, 0.148, and 0.539 -> $R_S=0.878/3=0.293$, cost 0.090, score 0.293+0.090=0.383, gap 0.419-0.383=0.036.
- Datasets D1–D5: D1 hand 3-point regression toy · D2 clean `make_regression` · D3 noisy/outlier regression · D4 sklearn diabetes · D5 california housing subsample
- Metric: MSE (with R² as a secondary annotation only)
- Closing viz: (a) fitted-line/residual small multiples  (b) MSE-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic. Gap topic: lesson body is thin; author missing prose before citing applications.

### 3.11 — Kernel ridge regression   [notebook: 3.11-kernel-ridge-regression.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Retail demand forecasting — apply Kernel ridge regression; lesson losses 0.202, 0.070, and 0.420 average to $R_S=0.692/3=0.231$ (lesson-cited).
2. Ad bid / spend prediction — apply Kernel ridge regression; lesson toy score 0.331 vs alternative 0.371 (gap 0.371-0.331=0.040) (lesson-cited).
3. Clinical risk-score regression — apply Kernel ridge regression; lesson cost term is 0.100. (lesson-cited).
4. Energy-load forecasting — apply Kernel ridge regression; lesson stabilized score $0.80\times 0.331=0.265$ (lesson-cited).
5. Manufacturing quality estimation — apply Kernel ridge regression; lesson relative gap is 0.108 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `kernel_ridge_regression_method()` verifies lesson formula `\alpha=(K+\lambda I)^{-1}y,\qquad \hat y(x)=k(x,X)^\top\alpha` on D1 using losses 0.202, 0.070, and 0.420 -> $R_S=0.692/3=0.231$, cost 0.100, score 0.231+0.100=0.331, gap 0.371-0.331=0.040.
- Datasets D1–D5: D1 hand 3-point regression toy · D2 clean `make_regression` · D3 noisy/outlier regression · D4 sklearn diabetes · D5 california housing subsample
- Metric: MSE (with R² as a secondary annotation only)
- Closing viz: (a) fitted-line/residual small multiples  (b) MSE-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.12 — Quantile & isotonic regression   [notebook: 3.12-quantile-isotonic-regression.ipynb]   (family: F1, gap)

**Lesson — Real World Applications (5):**
1. Retail demand forecasting — apply Quantile & isotonic regression; lesson losses 0.213, 0.083, and 0.437 average to $R_S=0.733/3=0.244$ (lesson-cited).
2. Ad bid / spend prediction — apply Quantile & isotonic regression; lesson toy score 0.294 vs alternative 0.338 (gap 0.338-0.294=0.044) (lesson-cited).
3. Clinical risk-score regression — apply Quantile & isotonic regression; lesson cost term is 0.050. (lesson-cited).
4. Energy-load forecasting — apply Quantile & isotonic regression; lesson stabilized score $0.80\times 0.294=0.235$ (lesson-cited).
5. Manufacturing quality estimation — apply Quantile & isotonic regression; lesson relative gap is 0.130 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `quantile_isotonic_regression_method()` verifies lesson formula `\rho_\tau(r)=r(\tau-\mathbf 1[r\lt 0])` on D1 using losses 0.213, 0.083, and 0.437 -> $R_S=0.733/3=0.244$, cost 0.050, score 0.244+0.050=0.294, gap 0.338-0.294=0.044.
- Datasets D1–D5: D1 hand 3-point regression toy · D2 clean `make_regression` · D3 noisy/outlier regression · D4 sklearn diabetes · D5 california housing subsample
- Metric: MSE (with R² as a secondary annotation only)
- Closing viz: (a) fitted-line/residual small multiples  (b) MSE-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic. Gap topic: lesson body is thin; author missing prose before citing applications.

### 3.13 — Robust regression (Huber, RANSAC)   [notebook: 3.13-robust-regression.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Retail demand forecasting — apply Robust regression (Huber, RANSAC); lesson losses 0.224, 0.096, and 0.454 average to $R_S=0.774/3=0.258$ (lesson-cited).
2. Ad bid / spend prediction — apply Robust regression (Huber, RANSAC); lesson toy score 0.318 vs alternative 0.366 (gap 0.366-0.318=0.048) (lesson-cited).
3. Clinical risk-score regression — apply Robust regression (Huber, RANSAC); lesson cost term is 0.060. (lesson-cited).
4. Energy-load forecasting — apply Robust regression (Huber, RANSAC); lesson stabilized score $0.80\times 0.318=0.254$ (lesson-cited).
5. Manufacturing quality estimation — apply Robust regression (Huber, RANSAC); lesson relative gap is 0.131 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `robust_regression_huber_ransac_method()` verifies lesson formula `L_\delta(r)=\begin{cases}\tfrac12r^2,& |r|\le\delta\\ \delta(|r|-\tfrac12\delta),& |r|\gt\delta\end{cases}` on D1 using losses 0.224, 0.096, and 0.454 -> $R_S=0.774/3=0.258$, cost 0.060, score 0.258+0.060=0.318, gap 0.366-0.318=0.048.
- Datasets D1–D5: D1 hand 3-point regression toy · D2 clean `make_regression` · D3 noisy/outlier regression · D4 sklearn diabetes · D5 california housing subsample
- Metric: MSE (with R² as a secondary annotation only)
- Closing viz: (a) fitted-line/residual small multiples  (b) MSE-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.14 — Logistic regression   [notebook: 3.14-logistic-regression.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Retail demand forecasting — apply Logistic regression; lesson losses 0.235, 0.109, and 0.471 average to $R_S=0.815/3=0.272$ (lesson-cited).
2. Ad bid / spend prediction — apply Logistic regression; lesson toy score 0.342 vs alternative 0.394 (gap 0.394-0.342=0.052) (lesson-cited).
3. Clinical risk-score regression — apply Logistic regression; lesson cost term is 0.070. (lesson-cited).
4. Energy-load forecasting — apply Logistic regression; lesson stabilized score $0.80\times 0.342=0.274$ (lesson-cited).
5. Manufacturing quality estimation — apply Logistic regression; lesson relative gap is 0.132 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `logistic_regression_method()` verifies lesson formula `p(y=1\mid x)=\sigma(w^\top x)=\frac{1}{1+e^{-w^\top x}}` on D1 using losses 0.235, 0.109, and 0.471 -> $R_S=0.815/3=0.272$, cost 0.070, score 0.272+0.070=0.342, gap 0.394-0.342=0.052.
- Datasets D1–D5: D1 hand 3-point regression toy · D2 clean `make_regression` · D3 noisy/outlier regression · D4 sklearn diabetes · D5 california housing subsample
- Metric: MSE (with R² as a secondary annotation only)
- Closing viz: (a) fitted-line/residual small multiples  (b) MSE-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.15 — Softmax / multinomial regression   [notebook: 3.15-softmax-multinomial-regression.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Retail demand forecasting — apply Softmax / multinomial regression; lesson losses 0.246, 0.122, and 0.488 average to $R_S=0.856/3=0.285$ (lesson-cited).
2. Ad bid / spend prediction — apply Softmax / multinomial regression; lesson toy score 0.365 vs alternative 0.401 (gap 0.401-0.365=0.036) (lesson-cited).
3. Clinical risk-score regression — apply Softmax / multinomial regression; lesson cost term is 0.080. (lesson-cited).
4. Energy-load forecasting — apply Softmax / multinomial regression; lesson stabilized score $0.80\times 0.365=0.292$ (lesson-cited).
5. Manufacturing quality estimation — apply Softmax / multinomial regression; lesson relative gap is 0.090 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `softmax_multinomial_regression_method()` verifies lesson formula `p_k=\frac{e^{z_k}}{\sum_j e^{z_j}}` on D1 using losses 0.246, 0.122, and 0.488 -> $R_S=0.856/3=0.285$, cost 0.080, score 0.285+0.080=0.365, gap 0.401-0.365=0.036.
- Datasets D1–D5: D1 hand 3-point regression toy · D2 clean `make_regression` · D3 noisy/outlier regression · D4 sklearn diabetes · D5 california housing subsample
- Metric: MSE (with R² as a secondary annotation only)
- Closing viz: (a) fitted-line/residual small multiples  (b) MSE-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.16 — Generalized Linear Models   [notebook: 3.16-generalized-linear-models.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Fraud and abuse triage — apply Generalized Linear Models; lesson losses 0.257, 0.135, and 0.505 average to $R_S=0.897/3=0.299$ (lesson-cited).
2. Customer churn routing — apply Generalized Linear Models; lesson toy score 0.389 vs alternative 0.429 (gap 0.429-0.389=0.040) (lesson-cited).
3. Medical image/tabular screening — apply Generalized Linear Models; lesson cost term is 0.090. (lesson-cited).
4. Content moderation queues — apply Generalized Linear Models; lesson stabilized score $0.80\times 0.389=0.311$ (lesson-cited).
5. Credit/loan decisioning — apply Generalized Linear Models; lesson relative gap is 0.093 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `generalized_linear_models_method()` verifies lesson formula `g(\mathbb E[Y\mid X])=X\beta` on D1 using losses 0.257, 0.135, and 0.505 -> $R_S=0.897/3=0.299$, cost 0.090, score 0.299+0.090=0.389, gap 0.429-0.389=0.040.
- Datasets D1–D5: D1 hand 2-class toy · D2 clean `make_classification` · D3 noisy/overlap · D4 sklearn iris/wine · D5 breast_cancer or digits
- Metric: accuracy (macro-F1 noted when classes skew)
- Closing viz: (a) decision-boundary small multiples  (b) accuracy-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.17 — Linear & Quadratic Discriminant Analysis   [notebook: 3.17-lda-qda.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Fraud and abuse triage — apply Linear & Quadratic Discriminant Analysis; lesson losses 0.268, 0.148, and 0.522 average to $R_S=0.938/3=0.313$ (lesson-cited).
2. Customer churn routing — apply Linear & Quadratic Discriminant Analysis; lesson toy score 0.413 vs alternative 0.457 (gap 0.457-0.413=0.044) (lesson-cited).
3. Medical image/tabular screening — apply Linear & Quadratic Discriminant Analysis; lesson cost term is 0.100. (lesson-cited).
4. Content moderation queues — apply Linear & Quadratic Discriminant Analysis; lesson stabilized score $0.80\times 0.413=0.330$ (lesson-cited).
5. Credit/loan decisioning — apply Linear & Quadratic Discriminant Analysis; lesson relative gap is 0.096 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `linear_quadratic_discriminant_analysis_method()` verifies lesson formula `\delta_k(x)=x^\top\Sigma_k^{-1}\mu_k-\tfrac12\mu_k^\top\Sigma_k^{-1}\mu_k+\log\pi_k` on D1 using losses 0.268, 0.148, and 0.522 -> $R_S=0.938/3=0.313$, cost 0.100, score 0.313+0.100=0.413, gap 0.457-0.413=0.044.
- Datasets D1–D5: D1 hand 2-class toy · D2 clean `make_classification` · D3 noisy/overlap · D4 sklearn iris/wine · D5 breast_cancer or digits
- Metric: accuracy (macro-F1 noted when classes skew)
- Closing viz: (a) decision-boundary small multiples  (b) accuracy-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.18 — Gaussian Discriminant Analysis   [notebook: 3.18-gaussian-discriminant-analysis.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Fraud and abuse triage — apply Gaussian Discriminant Analysis; lesson losses 0.180, 0.070, and 0.539 average to $R_S=0.789/3=0.263$ (lesson-cited).
2. Customer churn routing — apply Gaussian Discriminant Analysis; lesson toy score 0.313 vs alternative 0.361 (gap 0.361-0.313=0.048) (lesson-cited).
3. Medical image/tabular screening — apply Gaussian Discriminant Analysis; lesson cost term is 0.050. (lesson-cited).
4. Content moderation queues — apply Gaussian Discriminant Analysis; lesson stabilized score $0.80\times 0.313=0.250$ (lesson-cited).
5. Credit/loan decisioning — apply Gaussian Discriminant Analysis; lesson relative gap is 0.133 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `gaussian_discriminant_analysis_method()` verifies lesson formula `p(y=k\mid x)=\frac{p(x\mid y=k)\pi_k}{\sum_j p(x\mid y=j)\pi_j}` on D1 using losses 0.180, 0.070, and 0.539 -> $R_S=0.789/3=0.263$, cost 0.050, score 0.263+0.050=0.313, gap 0.361-0.313=0.048.
- Datasets D1–D5: D1 hand 2-class toy · D2 clean `make_classification` · D3 noisy/overlap · D4 sklearn iris/wine · D5 breast_cancer or digits
- Metric: accuracy (macro-F1 noted when classes skew)
- Closing viz: (a) decision-boundary small multiples  (b) accuracy-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.19 — Gradient descent variants (batch, mini-batch, SGD)   [notebook: 3.19-gradient-descent-variants.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Retail demand forecasting — apply Gradient descent variants (batch, mini-batch, SGD); lesson losses 0.191, 0.083, and 0.420 average to $R_S=0.694/3=0.231$ (lesson-cited).
2. Ad bid / spend prediction — apply Gradient descent variants (batch, mini-batch, SGD); lesson toy score 0.291 vs alternative 0.343 (gap 0.343-0.291=0.052) (lesson-cited).
3. Clinical risk-score regression — apply Gradient descent variants (batch, mini-batch, SGD); lesson cost term is 0.060. (lesson-cited).
4. Energy-load forecasting — apply Gradient descent variants (batch, mini-batch, SGD); lesson stabilized score $0.80\times 0.291=0.233$ (lesson-cited).
5. Manufacturing quality estimation — apply Gradient descent variants (batch, mini-batch, SGD); lesson relative gap is 0.152 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `gradient_descent_variants_batch_mini_batch_method()` verifies lesson formula `w_{t+1}=w_t-\eta\frac1{|B_t|}\sum_{i\in B_t}\nabla_w\ell_i(w_t)` on D1 using losses 0.191, 0.083, and 0.420 -> $R_S=0.694/3=0.231$, cost 0.060, score 0.231+0.060=0.291, gap 0.343-0.291=0.052.
- Datasets D1–D5: D1 hand 3-point regression toy · D2 clean `make_regression` · D3 noisy/outlier regression · D4 sklearn diabetes · D5 california housing subsample
- Metric: MSE (with R² as a secondary annotation only)
- Closing viz: (a) fitted-line/residual small multiples  (b) MSE-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.20 — k-Nearest Neighbors   [notebook: 3.20-k-nearest-neighbors.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Fraud and abuse triage — apply k-Nearest Neighbors; lesson losses 0.202, 0.096, and 0.437 average to $R_S=0.735/3=0.245$ (lesson-cited).
2. Customer churn routing — apply k-Nearest Neighbors; lesson toy score 0.315 vs alternative 0.351 (gap 0.351-0.315=0.036) (lesson-cited).
3. Medical image/tabular screening — apply k-Nearest Neighbors; lesson cost term is 0.070. (lesson-cited).
4. Content moderation queues — apply k-Nearest Neighbors; lesson stabilized score $0.80\times 0.315=0.252$ (lesson-cited).
5. Credit/loan decisioning — apply k-Nearest Neighbors; lesson relative gap is 0.103 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `k_nearest_neighbors_method()` verifies lesson formula `\hat y(x)=\operatorname{mode}\{y_i:i\in N_k(x)\}` on D1 using losses 0.202, 0.096, and 0.437 -> $R_S=0.735/3=0.245$, cost 0.070, score 0.245+0.070=0.315, gap 0.351-0.315=0.036.
- Datasets D1–D5: D1 hand 2-class toy · D2 clean `make_classification` · D3 noisy/overlap · D4 sklearn iris/wine · D5 breast_cancer or digits
- Metric: accuracy (macro-F1 noted when classes skew)
- Closing viz: (a) decision-boundary small multiples  (b) accuracy-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.21 — Naive Bayes   [notebook: 3.21-naive-bayes.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Fraud and abuse triage — apply Naive Bayes; lesson losses 0.213, 0.109, and 0.454 average to $R_S=0.776/3=0.259$ (lesson-cited).
2. Customer churn routing — apply Naive Bayes; lesson toy score 0.339 vs alternative 0.379 (gap 0.379-0.339=0.040) (lesson-cited).
3. Medical image/tabular screening — apply Naive Bayes; lesson cost term is 0.080. (lesson-cited).
4. Content moderation queues — apply Naive Bayes; lesson stabilized score $0.80\times 0.339=0.271$ (lesson-cited).
5. Credit/loan decisioning — apply Naive Bayes; lesson relative gap is 0.106 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `naive_bayes_method()` verifies lesson formula `p(y=k\mid x)\propto p(y=k)\prod_{j=1}^d p(x_j\mid y=k)` on D1 using losses 0.213, 0.109, and 0.454 -> $R_S=0.776/3=0.259$, cost 0.080, score 0.259+0.080=0.339, gap 0.379-0.339=0.040.
- Datasets D1–D5: D1 hand 2-class toy · D2 clean `make_classification` · D3 noisy/overlap · D4 sklearn iris/wine · D5 breast_cancer or digits
- Metric: accuracy (macro-F1 noted when classes skew)
- Closing viz: (a) decision-boundary small multiples  (b) accuracy-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.22 — Decision trees (CART, entropy/Gini, pruning)   [notebook: 3.22-decision-trees.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Fraud and abuse triage — apply Decision trees (CART, entropy/Gini, pruning); lesson losses 0.224, 0.122, and 0.471 average to $R_S=0.817/3=0.272$ (lesson-cited).
2. Customer churn routing — apply Decision trees (CART, entropy/Gini, pruning); lesson toy score 0.362 vs alternative 0.406 (gap 0.406-0.362=0.044) (lesson-cited).
3. Medical image/tabular screening — apply Decision trees (CART, entropy/Gini, pruning); lesson cost term is 0.090. (lesson-cited).
4. Content moderation queues — apply Decision trees (CART, entropy/Gini, pruning); lesson stabilized score $0.80\times 0.362=0.290$ (lesson-cited).
5. Credit/loan decisioning — apply Decision trees (CART, entropy/Gini, pruning); lesson relative gap is 0.108 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `decision_trees_cart_entropy_gini_pruning_method()` verifies lesson formula `G(t)=1-\sum_k p_{k,t}^2,\qquad \Delta=G(parent)-\sum_c\frac{n_c}{n}G(c)` on D1 using losses 0.224, 0.122, and 0.471 -> $R_S=0.817/3=0.272$, cost 0.090, score 0.272+0.090=0.362, gap 0.406-0.362=0.044.
- Datasets D1–D5: D1 hand 2-class toy · D2 clean `make_classification` · D3 noisy/overlap · D4 sklearn iris/wine · D5 breast_cancer or digits
- Metric: accuracy (macro-F1 noted when classes skew)
- Closing viz: (a) decision-boundary small multiples  (b) accuracy-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.23 — Bagging & Random Forests   [notebook: 3.23-bagging-random-forests.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Fraud and abuse triage — apply Bagging & Random Forests; lesson losses 0.235, 0.135, and 0.488 average to $R_S=0.858/3=0.286$ (lesson-cited).
2. Customer churn routing — apply Bagging & Random Forests; lesson toy score 0.386 vs alternative 0.434 (gap 0.434-0.386=0.048) (lesson-cited).
3. Medical image/tabular screening — apply Bagging & Random Forests; lesson cost term is 0.100. (lesson-cited).
4. Content moderation queues — apply Bagging & Random Forests; lesson stabilized score $0.80\times 0.386=0.309$ (lesson-cited).
5. Credit/loan decisioning — apply Bagging & Random Forests; lesson relative gap is 0.111 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `bagging_random_forests_method()` verifies lesson formula `\hat f_{bag}(x)=\frac1B\sum_{b=1}^B \hat f_b(x)` on D1 using losses 0.235, 0.135, and 0.488 -> $R_S=0.858/3=0.286$, cost 0.100, score 0.286+0.100=0.386, gap 0.434-0.386=0.048.
- Datasets D1–D5: D1 hand 2-class toy · D2 clean `make_classification` · D3 noisy/overlap · D4 sklearn iris/wine · D5 breast_cancer or digits
- Metric: accuracy (macro-F1 noted when classes skew)
- Closing viz: (a) decision-boundary small multiples  (b) accuracy-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.24 — Extremely Randomized Trees   [notebook: 3.24-extremely-randomized-trees.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Fraud and abuse triage — apply Extremely Randomized Trees; lesson losses 0.246, 0.148, and 0.505 average to $R_S=0.899/3=0.300$ (lesson-cited).
2. Customer churn routing — apply Extremely Randomized Trees; lesson toy score 0.350 vs alternative 0.402 (gap 0.402-0.350=0.052) (lesson-cited).
3. Medical image/tabular screening — apply Extremely Randomized Trees; lesson cost term is 0.050. (lesson-cited).
4. Content moderation queues — apply Extremely Randomized Trees; lesson stabilized score $0.80\times 0.350=0.280$ (lesson-cited).
5. Credit/loan decisioning — apply Extremely Randomized Trees; lesson relative gap is 0.129 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `extremely_randomized_trees_method()` verifies lesson formula `\text{choose }(j,s)\text{ from random candidates that maximize }\Delta(j,s)` on D1 using losses 0.246, 0.148, and 0.505 -> $R_S=0.899/3=0.300$, cost 0.050, score 0.300+0.050=0.350, gap 0.402-0.350=0.052.
- Datasets D1–D5: D1 hand 2-class toy · D2 clean `make_classification` · D3 noisy/overlap · D4 sklearn iris/wine · D5 breast_cancer or digits
- Metric: accuracy (macro-F1 noted when classes skew)
- Closing viz: (a) decision-boundary small multiples  (b) accuracy-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.25 — AdaBoost   [notebook: 3.25-adaboost.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Fraud and abuse triage — apply AdaBoost; lesson losses 0.257, 0.070, and 0.522 average to $R_S=0.849/3=0.283$ (lesson-cited).
2. Customer churn routing — apply AdaBoost; lesson toy score 0.343 vs alternative 0.379 (gap 0.379-0.343=0.036) (lesson-cited).
3. Medical image/tabular screening — apply AdaBoost; lesson cost term is 0.060. (lesson-cited).
4. Content moderation queues — apply AdaBoost; lesson stabilized score $0.80\times 0.343=0.274$ (lesson-cited).
5. Credit/loan decisioning — apply AdaBoost; lesson relative gap is 0.095 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `adaboost_method()` verifies lesson formula `\alpha_t=\tfrac12\ln\frac{1-\varepsilon_t}{\varepsilon_t},\qquad w_i\leftarrow w_i e^{-\alpha_t y_i h_t(x_i)}` on D1 using losses 0.257, 0.070, and 0.522 -> $R_S=0.849/3=0.283$, cost 0.060, score 0.283+0.060=0.343, gap 0.379-0.343=0.036.
- Datasets D1–D5: D1 hand 2-class toy · D2 clean `make_classification` · D3 noisy/overlap · D4 sklearn iris/wine · D5 breast_cancer or digits
- Metric: accuracy (macro-F1 noted when classes skew)
- Closing viz: (a) decision-boundary small multiples  (b) accuracy-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.26 — Gradient Boosting Machines   [notebook: 3.26-gradient-boosting-machines.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Fraud and abuse triage — apply Gradient Boosting Machines; lesson losses 0.268, 0.083, and 0.539 average to $R_S=0.890/3=0.297$ (lesson-cited).
2. Customer churn routing — apply Gradient Boosting Machines; lesson toy score 0.367 vs alternative 0.407 (gap 0.407-0.367=0.040) (lesson-cited).
3. Medical image/tabular screening — apply Gradient Boosting Machines; lesson cost term is 0.070. (lesson-cited).
4. Content moderation queues — apply Gradient Boosting Machines; lesson stabilized score $0.80\times 0.367=0.294$ (lesson-cited).
5. Credit/loan decisioning — apply Gradient Boosting Machines; lesson relative gap is 0.098 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `gradient_boosting_machines_method()` verifies lesson formula `F_t(x)=F_{t-1}(x)+\eta h_t(x)` on D1 using losses 0.268, 0.083, and 0.539 -> $R_S=0.890/3=0.297$, cost 0.070, score 0.297+0.070=0.367, gap 0.407-0.367=0.040.
- Datasets D1–D5: D1 hand 2-class toy · D2 clean `make_classification` · D3 noisy/overlap · D4 sklearn iris/wine · D5 breast_cancer or digits
- Metric: accuracy (macro-F1 noted when classes skew)
- Closing viz: (a) decision-boundary small multiples  (b) accuracy-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.27 — XGBoost / LightGBM / CatBoost   [notebook: 3.27-xgboost-lightgbm-catboost.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Fraud and abuse triage — apply XGBoost / LightGBM / CatBoost; lesson losses 0.180, 0.096, and 0.420 average to $R_S=0.696/3=0.232$ (lesson-cited).
2. Customer churn routing — apply XGBoost / LightGBM / CatBoost; lesson toy score 0.312 vs alternative 0.356 (gap 0.356-0.312=0.044) (lesson-cited).
3. Medical image/tabular screening — apply XGBoost / LightGBM / CatBoost; lesson cost term is 0.080. (lesson-cited).
4. Content moderation queues — apply XGBoost / LightGBM / CatBoost; lesson stabilized score $0.80\times 0.312=0.250$ (lesson-cited).
5. Credit/loan decisioning — apply XGBoost / LightGBM / CatBoost; lesson relative gap is 0.124 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `xgboost_lightgbm_catboost_method()` verifies lesson formula `\tilde L=\sum_i(g_i f_i+\tfrac12 h_i f_i^2)+\Omega(f)` on D1 using losses 0.180, 0.096, and 0.420 -> $R_S=0.696/3=0.232$, cost 0.080, score 0.232+0.080=0.312, gap 0.356-0.312=0.044.
- Datasets D1–D5: D1 hand 2-class toy · D2 clean `make_classification` · D3 noisy/overlap · D4 sklearn iris/wine · D5 breast_cancer or digits
- Metric: accuracy (macro-F1 noted when classes skew)
- Closing viz: (a) decision-boundary small multiples  (b) accuracy-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.28 — Stacking & blending   [notebook: 3.28-stacking-blending.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Fraud and abuse triage — apply Stacking & blending; lesson losses 0.191, 0.109, and 0.437 average to $R_S=0.737/3=0.246$ (lesson-cited).
2. Customer churn routing — apply Stacking & blending; lesson toy score 0.336 vs alternative 0.384 (gap 0.384-0.336=0.048) (lesson-cited).
3. Medical image/tabular screening — apply Stacking & blending; lesson cost term is 0.090. (lesson-cited).
4. Content moderation queues — apply Stacking & blending; lesson stabilized score $0.80\times 0.336=0.269$ (lesson-cited).
5. Credit/loan decisioning — apply Stacking & blending; lesson relative gap is 0.125 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `stacking_blending_method()` verifies lesson formula `\hat y=\sum_{m=1}^M a_m \hat y_m,\qquad \sum_m a_m=1` on D1 using losses 0.191, 0.109, and 0.437 -> $R_S=0.737/3=0.246$, cost 0.090, score 0.246+0.090=0.336, gap 0.384-0.336=0.048.
- Datasets D1–D5: D1 hand 2-class toy · D2 clean `make_classification` · D3 noisy/overlap · D4 sklearn iris/wine · D5 breast_cancer or digits
- Metric: accuracy (macro-F1 noted when classes skew)
- Closing viz: (a) decision-boundary small multiples  (b) accuracy-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.29 — Support Vector Machines & margins   [notebook: 3.29-support-vector-machines-margins.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Fraud and abuse triage — apply Support Vector Machines & margins; lesson losses 0.202, 0.122, and 0.454 average to $R_S=0.778/3=0.259$ (lesson-cited).
2. Customer churn routing — apply Support Vector Machines & margins; lesson toy score 0.359 vs alternative 0.411 (gap 0.411-0.359=0.052) (lesson-cited).
3. Medical image/tabular screening — apply Support Vector Machines & margins; lesson cost term is 0.100. (lesson-cited).
4. Content moderation queues — apply Support Vector Machines & margins; lesson stabilized score $0.80\times 0.359=0.287$ (lesson-cited).
5. Credit/loan decisioning — apply Support Vector Machines & margins; lesson relative gap is 0.127 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `support_vector_machines_margins_method()` verifies lesson formula `\min_w \tfrac12\|w\|^2+C\sum_i\xi_i\quad\text{s.t. }y_i(w^\top x_i+b)\ge 1-\xi_i` on D1 using losses 0.202, 0.122, and 0.454 -> $R_S=0.778/3=0.259$, cost 0.100, score 0.259+0.100=0.359, gap 0.411-0.359=0.052.
- Datasets D1–D5: D1 hand 2-class toy · D2 clean `make_classification` · D3 noisy/overlap · D4 sklearn iris/wine · D5 breast_cancer or digits
- Metric: accuracy (macro-F1 noted when classes skew)
- Closing viz: (a) decision-boundary small multiples  (b) accuracy-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.30 — The kernel trick & kernel methods   [notebook: 3.30-kernel-trick-methods.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Fraud and abuse triage — apply The kernel trick & kernel methods; lesson losses 0.213, 0.135, and 0.471 average to $R_S=0.819/3=0.273$ (lesson-cited).
2. Customer churn routing — apply The kernel trick & kernel methods; lesson toy score 0.323 vs alternative 0.359 (gap 0.359-0.323=0.036) (lesson-cited).
3. Medical image/tabular screening — apply The kernel trick & kernel methods; lesson cost term is 0.050. (lesson-cited).
4. Content moderation queues — apply The kernel trick & kernel methods; lesson stabilized score $0.80\times 0.323=0.258$ (lesson-cited).
5. Credit/loan decisioning — apply The kernel trick & kernel methods; lesson relative gap is 0.100 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `the_kernel_trick_kernel_methods_method()` verifies lesson formula `K(x,z)=\phi(x)^\top\phi(z)` on D1 using losses 0.213, 0.135, and 0.471 -> $R_S=0.819/3=0.273$, cost 0.050, score 0.273+0.050=0.323, gap 0.359-0.323=0.036.
- Datasets D1–D5: D1 hand 2-class toy · D2 clean `make_classification` · D3 noisy/overlap · D4 sklearn iris/wine · D5 breast_cancer or digits
- Metric: accuracy (macro-F1 noted when classes skew)
- Closing viz: (a) decision-boundary small multiples  (b) accuracy-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.31 — Online & incremental learning   [notebook: 3.31-online-incremental-learning.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Fraud and abuse triage — apply Online & incremental learning; lesson losses 0.224, 0.148, and 0.488 average to $R_S=0.860/3=0.287$ (lesson-cited).
2. Customer churn routing — apply Online & incremental learning; lesson toy score 0.347 vs alternative 0.387 (gap 0.387-0.347=0.040) (lesson-cited).
3. Medical image/tabular screening — apply Online & incremental learning; lesson cost term is 0.060. (lesson-cited).
4. Content moderation queues — apply Online & incremental learning; lesson stabilized score $0.80\times 0.347=0.278$ (lesson-cited).
5. Credit/loan decisioning — apply Online & incremental learning; lesson relative gap is 0.103 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `online_incremental_learning_method()` verifies lesson formula `w_{t+1}=w_t-\eta_t\nabla\ell_t(w_t)` on D1 using losses 0.224, 0.148, and 0.488 -> $R_S=0.860/3=0.287$, cost 0.060, score 0.287+0.060=0.347, gap 0.387-0.347=0.040.
- Datasets D1–D5: D1 hand 2-class toy · D2 clean `make_classification` · D3 noisy/overlap · D4 sklearn iris/wine · D5 breast_cancer or digits
- Metric: accuracy (macro-F1 noted when classes skew)
- Closing viz: (a) decision-boundary small multiples  (b) accuracy-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.32 — Passive-aggressive algorithms   [notebook: 3.32-passive-aggressive-algorithms.ipynb]   (family: F1, gap)

**Lesson — Real World Applications (5):**
1. Fraud and abuse triage — apply Passive-aggressive algorithms; lesson losses 0.235, 0.070, and 0.505 average to $R_S=0.810/3=0.270$ (lesson-cited).
2. Customer churn routing — apply Passive-aggressive algorithms; lesson toy score 0.340 vs alternative 0.384 (gap 0.384-0.340=0.044) (lesson-cited).
3. Medical image/tabular screening — apply Passive-aggressive algorithms; lesson cost term is 0.070. (lesson-cited).
4. Content moderation queues — apply Passive-aggressive algorithms; lesson stabilized score $0.80\times 0.340=0.272$ (lesson-cited).
5. Credit/loan decisioning — apply Passive-aggressive algorithms; lesson relative gap is 0.115 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `passive_aggressive_algorithms_method()` verifies lesson formula `w_{t+1}=w_t+\tau_t y_t x_t,\qquad \tau_t=\frac{\max(0,1-y_t w_t^\top x_t)}{\|x_t\|^2}` on D1 using losses 0.235, 0.070, and 0.505 -> $R_S=0.810/3=0.270$, cost 0.070, score 0.270+0.070=0.340, gap 0.384-0.340=0.044.
- Datasets D1–D5: D1 hand 2-class toy · D2 clean `make_classification` · D3 noisy/overlap · D4 sklearn iris/wine · D5 breast_cancer or digits
- Metric: accuracy (macro-F1 noted when classes skew)
- Closing viz: (a) decision-boundary small multiples  (b) accuracy-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic. Gap topic: lesson body is thin; author missing prose before citing applications.

### 3.33 — Ordinal & multi-output regression   [notebook: 3.33-ordinal-multi-output-regression.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Retail demand forecasting — apply Ordinal & multi-output regression; lesson losses 0.246, 0.083, and 0.522 average to $R_S=0.851/3=0.284$ (lesson-cited).
2. Ad bid / spend prediction — apply Ordinal & multi-output regression; lesson toy score 0.364 vs alternative 0.412 (gap 0.412-0.364=0.048) (lesson-cited).
3. Clinical risk-score regression — apply Ordinal & multi-output regression; lesson cost term is 0.080. (lesson-cited).
4. Energy-load forecasting — apply Ordinal & multi-output regression; lesson stabilized score $0.80\times 0.364=0.291$ (lesson-cited).
5. Manufacturing quality estimation — apply Ordinal & multi-output regression; lesson relative gap is 0.117 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `ordinal_multi_output_regression_method()` verifies lesson formula `\hat y=(\hat y_1,\ldots,\hat y_q),\qquad L=\frac1q\sum_{j=1}^q \ell(y_j,\hat y_j)` on D1 using losses 0.246, 0.083, and 0.522 -> $R_S=0.851/3=0.284$, cost 0.080, score 0.284+0.080=0.364, gap 0.412-0.364=0.048.
- Datasets D1–D5: D1 hand 3-point regression toy · D2 clean `make_regression` · D3 noisy/outlier regression · D4 sklearn diabetes · D5 california housing subsample
- Metric: MSE (with R² as a secondary annotation only)
- Closing viz: (a) fitted-line/residual small multiples  (b) MSE-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.34 — Survival analysis (Cox proportional hazards)   [notebook: 3.34-survival-analysis-cox.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Retail demand forecasting — apply Survival analysis (Cox proportional hazards); lesson losses 0.257, 0.096, and 0.539 average to $R_S=0.892/3=0.297$ (lesson-cited).
2. Ad bid / spend prediction — apply Survival analysis (Cox proportional hazards); lesson toy score 0.387 vs alternative 0.439 (gap 0.439-0.387=0.052) (lesson-cited).
3. Clinical risk-score regression — apply Survival analysis (Cox proportional hazards); lesson cost term is 0.090. (lesson-cited).
4. Energy-load forecasting — apply Survival analysis (Cox proportional hazards); lesson stabilized score $0.80\times 0.387=0.310$ (lesson-cited).
5. Manufacturing quality estimation — apply Survival analysis (Cox proportional hazards); lesson relative gap is 0.118 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `survival_analysis_cox_proportional_hazards_method()` verifies lesson formula `h(t\mid x)=h_0(t)e^{\beta^\top x}` on D1 using losses 0.257, 0.096, and 0.539 -> $R_S=0.892/3=0.297$, cost 0.090, score 0.297+0.090=0.387, gap 0.439-0.387=0.052.
- Datasets D1–D5: D1 hand 3-point regression toy · D2 clean `make_regression` · D3 noisy/outlier regression · D4 sklearn diabetes · D5 california housing subsample
- Metric: MSE (with R² as a secondary annotation only)
- Closing viz: (a) fitted-line/residual small multiples  (b) MSE-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.35 — Cost-sensitive learning   [notebook: 3.35-cost-sensitive-learning.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Fraud and abuse triage — apply Cost-sensitive learning; lesson losses 0.268, 0.109, and 0.420 average to $R_S=0.797/3=0.266$ (lesson-cited).
2. Customer churn routing — apply Cost-sensitive learning; lesson toy score 0.366 vs alternative 0.402 (gap 0.402-0.366=0.036) (lesson-cited).
3. Medical image/tabular screening — apply Cost-sensitive learning; lesson cost term is 0.100. (lesson-cited).
4. Content moderation queues — apply Cost-sensitive learning; lesson stabilized score $0.80\times 0.366=0.293$ (lesson-cited).
5. Credit/loan decisioning — apply Cost-sensitive learning; lesson relative gap is 0.090 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `cost_sensitive_learning_method()` verifies lesson formula `R(f)=\mathbb E[C_{Y,f(X)}]` on D1 using losses 0.268, 0.109, and 0.420 -> $R_S=0.797/3=0.266$, cost 0.100, score 0.266+0.100=0.366, gap 0.402-0.366=0.036.
- Datasets D1–D5: D1 hand 2-class toy · D2 clean `make_classification` · D3 noisy/overlap · D4 sklearn iris/wine · D5 breast_cancer or digits
- Metric: accuracy (macro-F1 noted when classes skew)
- Closing viz: (a) decision-boundary small multiples  (b) accuracy-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.36 — Train/validation/test & cross-validation   [notebook: 3.36-train-validation-test-cross-validation.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Model launch framing — apply Train/validation/test & cross-validation; lesson losses 0.180, 0.122, and 0.437 average to $R_S=0.739/3=0.246$ (lesson-cited).
2. Offline-to-online validation — apply Train/validation/test & cross-validation; lesson toy score 0.296 vs alternative 0.336 (gap 0.336-0.296=0.040) (lesson-cited).
3. A/B candidate triage — apply Train/validation/test & cross-validation; lesson cost term is 0.050. (lesson-cited).
4. Data science review boards — apply Train/validation/test & cross-validation; lesson stabilized score $0.80\times 0.296=0.237$ (lesson-cited).
5. Monitoring retrain triggers — apply Train/validation/test & cross-validation; lesson relative gap is 0.119 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `train_validation_test_cross_validation_method()` verifies lesson formula `CV_K=\frac1K\sum_{k=1}^{K}R_{V_k}(\hat f_{-k})` on D1 using losses 0.180, 0.122, and 0.437 -> $R_S=0.739/3=0.246$, cost 0.050, score 0.246+0.050=0.296, gap 0.336-0.296=0.040.
- Datasets D1–D5: D1 hand train/validation toy · D2 clean `make_classification` · D3 noisy/overlap split · D4 sklearn wine · D5 breast_cancer with shift/imbalance
- Metric: validation loss / generalization gap
- Closing viz: (a) train/validation split or learning-curve panels  (b) gap-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.37 — Nested cross-validation   [notebook: 3.37-nested-cross-validation.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Model launch framing — apply Nested cross-validation; lesson losses 0.191, 0.135, and 0.454 average to $R_S=0.780/3=0.260$ (lesson-cited).
2. Offline-to-online validation — apply Nested cross-validation; lesson toy score 0.320 vs alternative 0.364 (gap 0.364-0.320=0.044) (lesson-cited).
3. A/B candidate triage — apply Nested cross-validation; lesson cost term is 0.060. (lesson-cited).
4. Data science review boards — apply Nested cross-validation; lesson stabilized score $0.80\times 0.320=0.256$ (lesson-cited).
5. Monitoring retrain triggers — apply Nested cross-validation; lesson relative gap is 0.121 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `nested_cross_validation_method()` verifies lesson formula `\widehat R_{nested}=\frac1K\sum_{k=1}^{K} R_{outer,k}(\hat f^{inner}_k)` on D1 using losses 0.191, 0.135, and 0.454 -> $R_S=0.780/3=0.260$, cost 0.060, score 0.260+0.060=0.320, gap 0.364-0.320=0.044.
- Datasets D1–D5: D1 hand train/validation toy · D2 clean `make_classification` · D3 noisy/overlap split · D4 sklearn wine · D5 breast_cancer with shift/imbalance
- Metric: validation loss / generalization gap
- Closing viz: (a) train/validation split or learning-curve panels  (b) gap-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.38 — Classification metrics (precision, recall, F1, ROC/AUC, PR)   [notebook: 3.38-classification-metrics.ipynb]   (family: F15)

**Lesson — Real World Applications (5):**
1. Fraud-alert monitoring — apply Classification metrics (precision, recall, F1, ROC/AUC, PR); lesson losses 0.202, 0.148, and 0.471 average to $R_S=0.821/3=0.274$ (lesson-cited).
2. Medical screening dashboards — apply Classification metrics (precision, recall, F1, ROC/AUC, PR); lesson toy score 0.344 vs alternative 0.392 (gap 0.392-0.344=0.048) (lesson-cited).
3. Search/ranking evaluation — apply Classification metrics (precision, recall, F1, ROC/AUC, PR); lesson cost term is 0.070. (lesson-cited).
4. Ad model launch gates — apply Classification metrics (precision, recall, F1, ROC/AUC, PR); lesson stabilized score $0.80\times 0.344=0.275$ (lesson-cited).
5. QA model scorecards — apply Classification metrics (precision, recall, F1, ROC/AUC, PR); lesson relative gap is 0.122 (lesson-cited).

**Notebook plan:**
- Family: F15 Trust / Interpretability / Robustness
- Concept built once (D1): `classification_metrics_precision_recall_f1_method()` verifies lesson formula `precision=\frac{TP}{TP+FP},\quad recall=\frac{TP}{TP+FN},\quad F1=\frac{2PR}{P+R}` on D1 using losses 0.202, 0.148, and 0.471 -> $R_S=0.821/3=0.274$, cost 0.070, score 0.274+0.070=0.344, gap 0.392-0.344=0.048.
- Datasets D1–D5: D1 6 labeled scores · D2 clean `make_classification` · D3 overlap + imbalance · D4 sklearn breast_cancer · D5 digits one-vs-rest with shifted thresholds
- Metric: macro-F1 across all rungs
- Closing viz: (a) reliability/threshold small multiples  (b) metric-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.39 — Regression metrics (MSE, MAE, R²)   [notebook: 3.39-regression-metrics.ipynb]   (family: F15)

**Lesson — Real World Applications (5):**
1. Fraud-alert monitoring — apply Regression metrics (MSE, MAE, R²); lesson losses 0.213, 0.070, and 0.488 average to $R_S=0.771/3=0.257$ (lesson-cited).
2. Medical screening dashboards — apply Regression metrics (MSE, MAE, R²); lesson toy score 0.337 vs alternative 0.389 (gap 0.389-0.337=0.052) (lesson-cited).
3. Search/ranking evaluation — apply Regression metrics (MSE, MAE, R²); lesson cost term is 0.080. (lesson-cited).
4. Ad model launch gates — apply Regression metrics (MSE, MAE, R²); lesson stabilized score $0.80\times 0.337=0.270$ (lesson-cited).
5. QA model scorecards — apply Regression metrics (MSE, MAE, R²); lesson relative gap is 0.134 (lesson-cited).

**Notebook plan:**
- Family: F15 Trust / Interpretability / Robustness
- Concept built once (D1): `regression_metrics_mse_mae_r_method()` verifies lesson formula `MSE=\frac1m\sum_i e_i^2,\quad MAE=\frac1m\sum_i |e_i|,\quad R^2=1-\frac{SS_{res}}{SS_{tot}}` on D1 using losses 0.213, 0.070, and 0.488 -> $R_S=0.771/3=0.257$, cost 0.080, score 0.257+0.080=0.337, gap 0.389-0.337=0.052.
- Datasets D1–D5: D1 4 residuals · D2 clean `make_regression` · D3 noisy/outlier regression · D4 sklearn diabetes · D5 california housing subsample
- Metric: MSE across all rungs
- Closing viz: (a) residual/error panels  (b) MSE-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.40 — Probability calibration   [notebook: 3.40-probability-calibration.ipynb]   (family: F15)

**Lesson — Real World Applications (5):**
1. Fraud-alert monitoring — apply Probability calibration; lesson losses 0.224, 0.083, and 0.505 average to $R_S=0.812/3=0.271$ (lesson-cited).
2. Medical screening dashboards — apply Probability calibration; lesson toy score 0.361 vs alternative 0.397 (gap 0.397-0.361=0.036) (lesson-cited).
3. Search/ranking evaluation — apply Probability calibration; lesson cost term is 0.090. (lesson-cited).
4. Ad model launch gates — apply Probability calibration; lesson stabilized score $0.80\times 0.361=0.289$ (lesson-cited).
5. QA model scorecards — apply Probability calibration; lesson relative gap is 0.091 (lesson-cited).

**Notebook plan:**
- Family: F15 Trust / Interpretability / Robustness
- Concept built once (D1): `probability_calibration_method()` verifies lesson formula `calibration\ gap=|\Pr(Y=1\mid \hat p\in bin)-\operatorname{avg}(\hat p\in bin)|` on D1 using losses 0.224, 0.083, and 0.505 -> $R_S=0.812/3=0.271$, cost 0.090, score 0.271+0.090=0.361, gap 0.397-0.361=0.036.
- Datasets D1–D5: D1 6 labeled scores · D2 clean `make_classification` · D3 overlap + imbalance · D4 sklearn breast_cancer · D5 digits one-vs-rest with shifted thresholds
- Metric: ECE / calibration gap across all rungs
- Closing viz: (a) reliability/threshold small multiples  (b) metric-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.41 — Model selection (AIC, BIC, MDL)   [notebook: 3.41-model-selection-aic-bic-mdl.ipynb]   (family: F15)

**Lesson — Real World Applications (5):**
1. Fraud-alert monitoring — apply Model selection (AIC, BIC, MDL); lesson losses 0.235, 0.096, and 0.522 average to $R_S=0.853/3=0.284$ (lesson-cited).
2. Medical screening dashboards — apply Model selection (AIC, BIC, MDL); lesson toy score 0.384 vs alternative 0.424 (gap 0.424-0.384=0.040) (lesson-cited).
3. Search/ranking evaluation — apply Model selection (AIC, BIC, MDL); lesson cost term is 0.100. (lesson-cited).
4. Ad model launch gates — apply Model selection (AIC, BIC, MDL); lesson stabilized score $0.80\times 0.384=0.307$ (lesson-cited).
5. QA model scorecards — apply Model selection (AIC, BIC, MDL); lesson relative gap is 0.094 (lesson-cited).

**Notebook plan:**
- Family: F15 Trust / Interpretability / Robustness
- Concept built once (D1): `model_selection_aic_bic_mdl_method()` verifies lesson formula `AIC=2k-2\ln L,\qquad BIC=k\ln n-2\ln L` on D1 using losses 0.235, 0.096, and 0.522 -> $R_S=0.853/3=0.284$, cost 0.100, score 0.284+0.100=0.384, gap 0.424-0.384=0.040.
- Datasets D1–D5: D1 3 candidate likelihoods · D2 polynomial regression candidates · D3 noisy overfit candidates · D4 diabetes model set · D5 california housing model set
- Metric: held-out negative log loss after AIC/BIC choice
- Closing viz: (a) candidate-score bars per rung  (b) held-out loss-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.42 — Overfitting, underfitting & learning curves   [notebook: 3.42-overfitting-underfitting-learning-curves.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Model launch framing — apply Overfitting, underfitting & learning curves; lesson losses 0.246, 0.109, and 0.539 average to $R_S=0.894/3=0.298$ (lesson-cited).
2. Offline-to-online validation — apply Overfitting, underfitting & learning curves; lesson toy score 0.348 vs alternative 0.392 (gap 0.392-0.348=0.044) (lesson-cited).
3. A/B candidate triage — apply Overfitting, underfitting & learning curves; lesson cost term is 0.050. (lesson-cited).
4. Data science review boards — apply Overfitting, underfitting & learning curves; lesson stabilized score $0.80\times 0.348=0.278$ (lesson-cited).
5. Monitoring retrain triggers — apply Overfitting, underfitting & learning curves; lesson relative gap is 0.112 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `overfitting_underfitting_learning_curves_method()` verifies lesson formula `gap(m)=R_{val}(m)-R_{train}(m)` on D1 using losses 0.246, 0.109, and 0.539 -> $R_S=0.894/3=0.298$, cost 0.050, score 0.298+0.050=0.348, gap 0.392-0.348=0.044.
- Datasets D1–D5: D1 hand train/validation toy · D2 clean `make_classification` · D3 noisy/overlap split · D4 sklearn wine · D5 breast_cancer with shift/imbalance
- Metric: validation loss / generalization gap
- Closing viz: (a) train/validation split or learning-curve panels  (b) gap-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.43 — Data leakage   [notebook: 3.43-data-leakage.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Model launch framing — apply Data leakage; lesson losses 0.257, 0.122, and 0.420 average to $R_S=0.799/3=0.266$ (lesson-cited).
2. Offline-to-online validation — apply Data leakage; lesson toy score 0.326 vs alternative 0.374 (gap 0.374-0.326=0.048) (lesson-cited).
3. A/B candidate triage — apply Data leakage; lesson cost term is 0.060. (lesson-cited).
4. Data science review boards — apply Data leakage; lesson stabilized score $0.80\times 0.326=0.261$ (lesson-cited).
5. Monitoring retrain triggers — apply Data leakage; lesson relative gap is 0.128 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `data_leakage_method()` verifies lesson formula `R_{leaky}=\frac1m\sum_i \ell(f(x_i,\text{future}_i),y_i)` on D1 using losses 0.257, 0.122, and 0.420 -> $R_S=0.799/3=0.266$, cost 0.060, score 0.266+0.060=0.326, gap 0.374-0.326=0.048.
- Datasets D1–D5: D1 hand train/validation toy · D2 clean `make_classification` · D3 noisy/overlap split · D4 sklearn wine · D5 breast_cancer with shift/imbalance
- Metric: validation loss / generalization gap
- Closing viz: (a) train/validation split or learning-curve panels  (b) gap-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.44 — Hyperparameter search (grid, random, Bayesian, Hyperband)   [notebook: 3.44-hyperparameter-search.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Model launch framing — apply Hyperparameter search (grid, random, Bayesian, Hyperband); lesson losses 0.268, 0.135, and 0.437 average to $R_S=0.840/3=0.280$ (lesson-cited).
2. Offline-to-online validation — apply Hyperparameter search (grid, random, Bayesian, Hyperband); lesson toy score 0.350 vs alternative 0.402 (gap 0.402-0.350=0.052) (lesson-cited).
3. A/B candidate triage — apply Hyperparameter search (grid, random, Bayesian, Hyperband); lesson cost term is 0.070. (lesson-cited).
4. Data science review boards — apply Hyperparameter search (grid, random, Bayesian, Hyperband); lesson stabilized score $0.80\times 0.350=0.280$ (lesson-cited).
5. Monitoring retrain triggers — apply Hyperparameter search (grid, random, Bayesian, Hyperband); lesson relative gap is 0.129 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `hyperparameter_search_grid_random_bayesian_method()` verifies lesson formula `\lambda^*=\arg\min_{\lambda\in\Lambda} R_{val}(\hat f_\lambda)` on D1 using losses 0.268, 0.135, and 0.437 -> $R_S=0.840/3=0.280$, cost 0.070, score 0.280+0.070=0.350, gap 0.402-0.350=0.052.
- Datasets D1–D5: D1 hand train/validation toy · D2 clean `make_classification` · D3 noisy/overlap split · D4 sklearn wine · D5 breast_cancer with shift/imbalance
- Metric: validation loss / generalization gap
- Closing viz: (a) train/validation split or learning-curve panels  (b) gap-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.45 — Feature engineering   [notebook: 3.45-feature-engineering.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Model launch framing — apply Feature engineering; lesson losses 0.180, 0.148, and 0.454 average to $R_S=0.782/3=0.261$ (lesson-cited).
2. Offline-to-online validation — apply Feature engineering; lesson toy score 0.341 vs alternative 0.377 (gap 0.377-0.341=0.036) (lesson-cited).
3. A/B candidate triage — apply Feature engineering; lesson cost term is 0.080. (lesson-cited).
4. Data science review boards — apply Feature engineering; lesson stabilized score $0.80\times 0.341=0.273$ (lesson-cited).
5. Monitoring retrain triggers — apply Feature engineering; lesson relative gap is 0.095 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `feature_engineering_method()` verifies lesson formula `z=\phi(x),\qquad \hat y=f(z)` on D1 using losses 0.180, 0.148, and 0.454 -> $R_S=0.782/3=0.261$, cost 0.080, score 0.261+0.080=0.341, gap 0.377-0.341=0.036.
- Datasets D1–D5: D1 hand train/validation toy · D2 clean `make_classification` · D3 noisy/overlap split · D4 sklearn wine · D5 breast_cancer with shift/imbalance
- Metric: validation loss / generalization gap
- Closing viz: (a) train/validation split or learning-curve panels  (b) gap-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.46 — Feature selection (filter, wrapper, embedded)   [notebook: 3.46-feature-selection.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Model launch framing — apply Feature selection (filter, wrapper, embedded); lesson losses 0.191, 0.070, and 0.471 average to $R_S=0.732/3=0.244$ (lesson-cited).
2. Offline-to-online validation — apply Feature selection (filter, wrapper, embedded); lesson toy score 0.334 vs alternative 0.374 (gap 0.374-0.334=0.040) (lesson-cited).
3. A/B candidate triage — apply Feature selection (filter, wrapper, embedded); lesson cost term is 0.090. (lesson-cited).
4. Data science review boards — apply Feature selection (filter, wrapper, embedded); lesson stabilized score $0.80\times 0.334=0.267$ (lesson-cited).
5. Monitoring retrain triggers — apply Feature selection (filter, wrapper, embedded); lesson relative gap is 0.107 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `feature_selection_filter_wrapper_embedded_method()` verifies lesson formula `S^*=\arg\min_{S\subseteq\{1,\ldots,d\}} R_{val}(f_S)+\lambda |S|` on D1 using losses 0.191, 0.070, and 0.471 -> $R_S=0.732/3=0.244$, cost 0.090, score 0.244+0.090=0.334, gap 0.374-0.334=0.040.
- Datasets D1–D5: D1 hand train/validation toy · D2 clean `make_classification` · D3 noisy/overlap split · D4 sklearn wine · D5 breast_cancer with shift/imbalance
- Metric: validation loss / generalization gap
- Closing viz: (a) train/validation split or learning-curve panels  (b) gap-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.47 — Imbalanced data (resampling, SMOTE, class weights)   [notebook: 3.47-imbalanced-data.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Fraud and abuse triage — apply Imbalanced data (resampling, SMOTE, class weights); lesson losses 0.202, 0.083, and 0.488 average to $R_S=0.773/3=0.258$ (lesson-cited).
2. Customer churn routing — apply Imbalanced data (resampling, SMOTE, class weights); lesson toy score 0.358 vs alternative 0.402 (gap 0.402-0.358=0.044) (lesson-cited).
3. Medical image/tabular screening — apply Imbalanced data (resampling, SMOTE, class weights); lesson cost term is 0.100. (lesson-cited).
4. Content moderation queues — apply Imbalanced data (resampling, SMOTE, class weights); lesson stabilized score $0.80\times 0.358=0.286$ (lesson-cited).
5. Credit/loan decisioning — apply Imbalanced data (resampling, SMOTE, class weights); lesson relative gap is 0.109 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `imbalanced_data_resampling_smote_class_wei_method()` verifies lesson formula `L=\frac1m\sum_i w_{y_i}\ell(f(x_i),y_i)` on D1 using losses 0.202, 0.083, and 0.488 -> $R_S=0.773/3=0.258$, cost 0.100, score 0.258+0.100=0.358, gap 0.402-0.358=0.044.
- Datasets D1–D5: D1 hand 2-class toy · D2 clean `make_classification` · D3 noisy/overlap · D4 sklearn iris/wine · D5 breast_cancer or digits
- Metric: accuracy (macro-F1 noted when classes skew)
- Closing viz: (a) decision-boundary small multiples  (b) accuracy-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.

### 3.48 — Multiclass & multilabel strategies   [notebook: 3.48-multiclass-multilabel-strategies.ipynb]   (family: F1)

**Lesson — Real World Applications (5):**
1. Fraud and abuse triage — apply Multiclass & multilabel strategies; lesson losses 0.213, 0.096, and 0.505 average to $R_S=0.814/3=0.271$ (lesson-cited).
2. Customer churn routing — apply Multiclass & multilabel strategies; lesson toy score 0.321 vs alternative 0.369 (gap 0.369-0.321=0.048) (lesson-cited).
3. Medical image/tabular screening — apply Multiclass & multilabel strategies; lesson cost term is 0.050. (lesson-cited).
4. Content moderation queues — apply Multiclass & multilabel strategies; lesson stabilized score $0.80\times 0.321=0.257$ (lesson-cited).
5. Credit/loan decisioning — apply Multiclass & multilabel strategies; lesson relative gap is 0.130 (lesson-cited).

**Notebook plan:**
- Family: F1 Supervised-Tabular
- Concept built once (D1): `multiclass_multilabel_strategies_method()` verifies lesson formula `p_k=\frac{e^{z_k}}{\sum_j e^{z_j}},\qquad p_j=\sigma(z_j)\text{ for multilabel}` on D1 using losses 0.213, 0.096, and 0.505 -> $R_S=0.814/3=0.271$, cost 0.050, score 0.271+0.050=0.321, gap 0.369-0.321=0.048.
- Datasets D1–D5: D1 hand 2-class toy · D2 clean `make_classification` · D3 noisy/overlap · D4 sklearn iris/wine · D5 breast_cancer or digits
- Metric: accuracy (macro-F1 noted when classes skew)
- Closing viz: (a) decision-boundary small multiples  (b) accuracy-vs-complexity curve
- Pitfall on D5: Optimizing the raw term and forgetting the cost; reproduce on D5, then include the lesson cost/scale/gap check before selecting the D5 winner.
- Notes: Delete copied dead template helpers; keep MathJax formula tied to lesson arithmetic.
