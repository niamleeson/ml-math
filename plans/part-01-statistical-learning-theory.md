# Part 1 — Statistical Learning Theory

> Plan only — per-topic revamp plan. See ../00-MASTER-PLAN.md for the shared design & family registry (F1–F17).
> **Code style:** every notebook code cell is written one statement per line (newline-split, blank lines between logical groups) for readability — never dense, semicolon-packed one-liners. See ../00-MASTER-PLAN.md §B.4.
> Dominant family: F16 (Algorithmic-Instance — theory/capacity variant).

### 1.1 — Empirical Risk Minimization   [notebook: 1.1-erm.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Ad click thresholding — choose the threshold with lowest observed 0-1 loss; lesson hand case picks `t=2.5` with `0/5=0.00` training error.
2. Price/score baselines — a constant regressor under squared loss is the sample mean; lesson targets `{2,4,6}` pick `c=4` with MSE `2.667`.
3. Medical triage rule selection — audit whether zero training mistakes are plausible; lesson's separable 5-point threshold reaches `R_S=0` but noisy labels can impose a `0.10` Bayes floor.
4. Fraud-rule menus — compare tied empirical risks before adding secondary criteria; lesson thresholds `t=1.5` and `t=3.5` both have `1/5=0.20` mistakes.
5. Recommendation ranking variants — treat offline loss as an estimate, not truth; illustrative fixed-model empirical risk over `m=100` events averages 100 losses.

**Notebook plan:**
- Family: F16 Algorithmic-Instance (theory/capacity variant)
- Concept built once (D1): implement `empirical_risk(h, X, y, loss)` and verify the lesson threshold counts: `t=1.5 -> 1/5`, `t=2.5 -> 0/5`, `t=3.5 -> 1/5`.
- Datasets D1–D5: D1 five ordered points/three thresholds · D2 add 7 thresholds on same monotone labels · D3 inject 10% illustrative label noise · D4 increase `m` from 20 to 200 with fixed thresholds · D5 add a memorizing class with one rule per point.
- Metric: empirical-vs-holdout risk gap.
- Closing viz: (a) small-multiples of threshold/memorizer predictions by rung  (b) gap vs capacity curve — this single curve is the payoff.
- Pitfall on D5: reproduce “zero training error is a warning, not a trophy,” then fix by using held-out risk/penalty.
- Notes: delete dead template helpers (`conv2d`, `iou`, `edit_distance`, `ce`, `kl`).

### 1.2 — The bias–complexity tradeoff   [notebook: 1.2-bias-complexity.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Demand forecasting model class choice — small class can win with scarce data; lesson at `m=100` totals `0.424`, `0.787`, `2.256` as complexity rises.
2. Ad creative quality scoring — richer features reduce approximation error; lesson approximation drops `0.20 -> 0.08 -> 0.02`.
3. Search ranking launches — finite data makes complexity costly; lesson estimation term rises `0.224 -> 0.707 -> 2.236` at `m=100`.
4. Risk-model refreshes — more data changes the optimal class; lesson medium-class estimation falls from `0.707` at `m=100` to `0.177` at `m=1600`.
5. A/B candidate pruning — quadrupling data halves the `1/sqrt(m)` estimation term; illustrative `m=400` gives half the `m=100` penalty.

**Notebook plan:**
- Family: F16 Algorithmic-Instance (theory/capacity variant)
- Concept built once (D1): implement `total_error(approx, complexity, m)=approx+sqrt(complexity/(2*m))` and verify lesson rows for complexities `10,100,1000` at `m=100`.
- Datasets D1–D5: D1 three lesson classes at `m=100` · D2 add more class rungs · D3 hold classes fixed and sweep `m=100..1600` · D4 add noisy approximation floor · D5 overlarge class menu at small `m`.
- Metric: total excess-error proxy.
- Closing viz: (a) small-multiples of class-capacity ladders  (b) total error vs complexity/n curve — this single curve is the payoff.
- Pitfall on D5: reproduce “bigger model is always better,” then fix by selecting the minimum total, not minimum approximation.
- Notes: delete dead template helpers; keep all numbers labeled lesson-derived or illustrative.

### 1.3 — PAC learning   [notebook: 1.3-pac-learning.ipynb]   (family: F16, gap)

**Lesson — Real World Applications (5):**
1. Labeling-budget planning — finite-class PAC says `|H|=100`, `epsilon=0.1`, `delta=0.05` needs `77` examples.
2. Safety review sampling — demanding `delta=0.01` with `|H|=100`, `epsilon=0.1` needs `93` examples.
3. Accuracy target setting — halving `epsilon` from `0.1` to `0.05` doubles the lesson count from `77` to `153`.
4. Feature-template expansion — growing `|H|` from `100` to `10,000` raises the lesson count only to `123` examples.
5. Rule-library sizing — each class doubling at `epsilon=0.1` costs `ln(2)/0.1 = 6.93` extra samples.

**Notebook plan:**
- Family: F16 Algorithmic-Instance (theory/capacity variant)
- Concept built once (D1): implement `pac_m(H_size, epsilon, delta)=ceil((ln|H|+ln(1/delta))/epsilon)` and verify `100,0.1,0.05 -> 77`.
- Datasets D1–D5: D1 lesson finite class · D2 sweep `|H|=50,100,200,400` · D3 tighten `epsilon` · D4 tighten `delta` · D5 agnostic/no-realizable case with `1/epsilon^2` illustrative contrast.
- Metric: required sample size `m`.
- Closing viz: (a) small-multiples of hypothesis menus growing by rung  (b) required `m` vs `|H|/epsilon/delta` curve — this single curve is the payoff.
- Pitfall on D5: reproduce “using the realizable formula in the agnostic case,” then fix by switching to the agnostic scaling.
- Notes: gap:true — lesson body may need authoring first; delete dead template helpers.

### 1.4 — VC dimension   [notebook: 1.4-vc-dimension.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Threshold alerting — one-dimensional threshold rules have VC dimension `1`, so they cannot shatter `2` ordered points.
2. Range filters for moderation — interval rules shatter `2` points but fail on `3` with the `+ - +` pattern.
3. Linear screeners in 2D — half-planes have VC dimension `3` for points in general position.
4. Box-rule dashboards — axis-aligned rectangles have VC dimension `4`, matching four corner-style constraints.
5. Capacity audits for infinite classes — Sauer’s lemma gives at most `16` labelings for `d=2,m=5` vs `32` arbitrary labelings.

**Notebook plan:**
- Family: F16 Algorithmic-Instance (theory/capacity variant)
- Concept built once (D1): implement `realized_labelings(class, points)` and verify thresholds shatter `1` point but not `2`.
- Datasets D1–D5: D1 thresholds on 1 point · D2 thresholds on 2 points · D3 intervals on 2/3 points · D4 half-planes/rectangles schematic capacities `3/4` · D5 Sauer growth for larger `m`.
- Metric: growth function / realized labelings.
- Closing viz: (a) small-multiples of shattered/unshattered point sets  (b) realized labelings vs `m` curve against `2^m` — this single curve is the payoff.
- Pitfall on D5: reproduce “equating VC dimension with parameter count,” then fix by testing behavior on labelings.
- Notes: delete dead template helpers; mark half-plane/rectangle diagrams as theory illustrations.

### 1.5 — Rademacher complexity   [notebook: 1.5-rademacher.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Shuffled-label overfit tests — a single fixed function has empirical Rademacher complexity exactly `0`.
2. Tiny rule-menu audits — lesson two-function class on `3` points averages to `0.3333` over `2^3=8` sign vectors.
3. Memorization detection — a class realizing every sign pattern scores `1`, the top of the lesson scale.
4. Dataset-specific model review — recompute on each sample because the lesson emphasizes empirical complexity is data-dependent.
5. Bound dashboards — plug noise-fit into `R(h) <= R_S(h)+2Rhat+sqrt(ln(1/delta)/(2m))`; illustrative `Rhat=1/3` contributes `2/3`.

**Notebook plan:**
- Family: F16 Algorithmic-Instance (theory/capacity variant)
- Concept built once (D1): implement exact enumeration `rademacher(F_outputs)` and verify lesson `F={[1,1,1],[1,-1,1]} -> 0.3333`.
- Datasets D1–D5: D1 one fixed function · D2 lesson two-function class · D3 four-function class · D4 all sign patterns on `m=3/4` · D5 large class with approximated supremum.
- Metric: empirical Rademacher complexity.
- Closing viz: (a) small-multiples of noise signs and best-matching functions  (b) complexity vs class richness curve — this single curve is the payoff.
- Pitfall on D5: reproduce “underestimating the supremum,” then fix with exhaustive enumeration for tiny rungs and clear approximation labels later.
- Notes: delete dead template helpers.

### 1.6 — Generalization bounds   [notebook: 1.6-generalization-bounds.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Offline model risk cards — with `|H|=100`, `delta=0.05`, `m=100`, lesson penalty is `0.1949`.
2. Data acquisition planning — same setup gives penalties `0.1949`, `0.0616`, `0.0195` at `m=100,1000,10000`.
3. Confidence choice — at `m=500`, `|H|=100`, penalties are `0.0831`, `0.0872`, `0.0960` for `delta=0.10,0.05,0.01`.
4. Experiment sizing — quadrupling from `m=100` to `m=400` halves the lesson penalty to `0.0975`.
5. Launch guardrails — detect vacuity when the penalty exceeds `1`, yielding only the trivial `R <= 1` ceiling.

**Notebook plan:**
- Family: F16 Algorithmic-Instance (theory/capacity variant)
- Concept built once (D1): implement `finite_bound(emp,H_size,delta,m)` and verify penalty `0.1949` for `100,0.05,100`.
- Datasets D1–D5: D1 lesson `m=100` · D2 `m=1000` · D3 `m=10000` · D4 confidence sweep at `m=500` · D5 huge `|H|`/small `m` vacuous case.
- Metric: bound value / penalty.
- Closing viz: (a) small-multiples of empirical-risk-plus-penalty bars  (b) penalty vs sample size curve — this single curve is the payoff.
- Pitfall on D5: reproduce “vacuous bounds,” then fix by increasing `m` or using VC/Rademacher terms.
- Notes: delete dead template helpers.

### 1.7 — Structural Risk Minimization   [notebook: 1.7-srm.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Polynomial-degree selection — SRM can pick rung `3` because lesson bounds are `0.396, 0.270, 0.216, 0.238`.
2. Rule-list governance — lowest training error is not enough; lesson rung `4` has `emp=0.05` but loses to rung `3`.
3. Feature-family rollout — penalties rise with richness: lesson `0.096 -> 0.120 -> 0.146 -> 0.188`.
4. AutoML search constraints — empirical errors fall `0.30 -> 0.15 -> 0.07 -> 0.05`, showing why unpenalized ERM climbs too high.
5. Compliance model cards — document the selected complexity by the minimum bound `0.216`, not by accuracy alone.

**Notebook plan:**
- Family: F16 Algorithmic-Instance (theory/capacity variant)
- Concept built once (D1): implement `srm_select(emp_errors, H_sizes, delta, m)` and verify lesson selects rung `3` at `m=200`, `delta=0.05`.
- Datasets D1–D5: D1 four lesson rungs · D2 more nested rungs · D3 larger `m` shifts winner upward · D4 noisy empirical errors · D5 bad penalty/ordering stress case.
- Metric: SRM bound by rung.
- Closing viz: (a) small-multiples of nested class ladder structures  (b) empirical, penalty, and sum vs rung curve — this single curve is the payoff.
- Pitfall on D5: reproduce “a penalty that misjudges complexity,” then fix by using the correct bound term/validated ladder.
- Notes: delete dead template helpers.

### 1.8 — Regularization theory   [notebook: 1.8-regularization.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Ridge forecasting — lesson data `X=[1,1],[1,2],[1,3]`, `y=[1,2,2]` gives `w=[0.667,0.500]` at `lambda=0`.
2. Overfit control — increasing `lambda` to `1` changes the lesson weights to `[0.375,0.583]` and norm `0.481`.
3. Simplicity budgeting — lesson squared norm shrinks `0.694 -> 0.481 -> 0.206 -> 0.011` as `lambda` grows.
4. Strong-shrinkage warnings — lesson `lambda=100` nearly collapses to the trivial model with norm `0.011`.
5. Feature pipeline hygiene — scaling matters because the same `lambda` penalizes coefficients unevenly; illustrative two features with 10x scale get unequal shrinkage.

**Notebook plan:**
- Family: F16 Algorithmic-Instance (theory/capacity variant)
- Concept built once (D1): implement ridge closed form `(X.T@X + lambda*I)^-1 X.T@y` and verify lesson weights/norms for `lambda=0,1,10,100`.
- Datasets D1–D5: D1 lesson 3-row regression · D2 sweep more `lambda` values · D3 increase feature count/capacity · D4 add noisy labels · D5 unscaled-feature/intercept-penalty trap.
- Metric: training loss plus norm / validation risk gap.
- Closing viz: (a) small-multiples of fitted lines as `lambda` changes  (b) norm/risk vs `lambda` curve — this single curve is the payoff.
- Pitfall on D5: reproduce “skipping feature scaling” or “penalizing the intercept,” then fix by standardizing and excluding intercept.
- Notes: delete dead template helpers.

### 1.9 — Algorithmic stability   [notebook: 1.9-stability.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Leave-one-user-out recommender audits — lesson sample `{2,4,6,8,10}` has full mean `6.0`.
2. Sensitivity reports — dropping `2` gives mean `7.0`, a largest lesson swing of `1.0` from the full fit.
3. Data-volume planning — lesson stability intuition improves from about `1/5=0.20` to `1/50=0.02` when `m` grows tenfold.
4. Regularized training reviews — stability scales schematically as `beta ∝ 1/(lambda m)`, so doubling `lambda` or `m` halves the illustrative sensitivity.
5. Nearest-neighbor risk checks — identify algorithms where one point can flip a neighborhood, unlike the stable mean estimator.

**Notebook plan:**
- Family: F16 Algorithmic-Instance (theory/capacity variant)
- Concept built once (D1): implement `leave_one_out_sensitivity(estimator, sample)` and verify mean swings on `{2,4,6,8,10}` with max `1.0`.
- Datasets D1–D5: D1 lesson 5-number mean · D2 `m=50` bounded-range sample · D3 ridge with increasing `lambda` · D4 compare stable mean/ridge to 1-NN-style rule · D5 outlier removal stress case.
- Metric: leave-one-out sensitivity / generalization gap proxy.
- Closing viz: (a) small-multiples of fitted predictor after each deletion  (b) sensitivity vs `m`/`lambda` curve — this single curve is the payoff.
- Pitfall on D5: reproduce “assuming every algorithm is stable,” then fix by switching to/adding regularization or reporting no stability guarantee.
- Notes: delete dead template helpers; label leave-one-out as empirical feel, not exact uniform `beta`.

### 1.10 — The No Free Lunch theorem   [notebook: 1.10-no-free-lunch.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Model-selection policy — no universal winner; lesson universe of `3` unseen points has `2^3=8` equally likely labelings.
2. Baseline sanity checks — fixed prediction `[0,0,0]` averages off-training error `0.500` across those `8` targets.
3. Algorithm comparison — alternative rule `[1,0,1]` also averages `0.500`, matching the theorem in miniature.
4. Domain-bias design — a method wins only by assuming structure; illustrative smoothness bias helps smooth tasks and hurts mirror-random tasks one-for-one.
5. Procurement claims review — reject “best everywhere” claims because any advantage on some labelings is exactly refunded on others under the uniform ensemble.

**Notebook plan:**
- Family: F16 Algorithmic-Instance (theory/capacity variant)
- Concept built once (D1): implement `average_off_training_error(prediction, all_targets)` and verify `[0,0,0]` and `[1,0,1]` both yield `0.500` over `8` targets.
- Datasets D1–D5: D1 1 unseen point · D2 lesson 3 unseen points · D3 4 unseen points (`16` targets) · D4 biased structured subset · D5 adversarial mirror subset.
- Metric: average off-training error.
- Closing viz: (a) small-multiples of target-label matrices/payoff tables  (b) average error vs problem-family bias curve — this single curve is the payoff.
- Pitfall on D5: reproduce “quoting it to claim all models are equal on a real task,” then fix by showing structured subsets break the uniform-prior tie.
- Notes: delete dead template helpers.

### 1.11 — Uniform convergence   [notebook: 1.11-uniform-convergence.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Whole-class validation guarantees — for one hypothesis at `m=500`, `epsilon=0.1`, lesson Hoeffding failure is `2e^-10 = 0.00009`.
2. Candidate-library audits — for `|H|=100`, union bound raises that to `0.0091`, still under `1%`.
3. Minimum sample planning — lesson solves `delta=0.05`, `|H|=100`, `epsilon=0.1` as `m >= 414.7`, so `415` samples.
4. Early-experiment warnings — lesson says `m=100,150,230` are vacuous (`right side >= 1`) for that setup.
5. Bound communication — at `m=300` the failure bound is `0.496`, a concrete warning that “almost half” failure probability is not reassuring.

**Notebook plan:**
- Family: F16 Algorithmic-Instance (theory/capacity variant)
- Concept built once (D1): implement `uniform_failure(H_size,m,epsilon)=H_size*2*exp(-2*m*epsilon^2)` and verify `H=100,m=500,epsilon=0.1 -> 0.0091`.
- Datasets D1–D5: D1 one fixed hypothesis · D2 `|H|=100,m=500` · D3 low-`m` vacuous rungs `100/150/230/300` · D4 solve required `m` for `delta=0.05` · D5 correlated/non-i.i.d. illustrative violation.
- Metric: uniform-convergence failure probability / solved epsilon penalty.
- Closing viz: (a) small-multiples of per-hypothesis failure events unioned across a class  (b) failure probability vs `m` curve — this single curve is the payoff.
- Pitfall on D5: reproduce “dropping the i.i.d. assumption” or loose union-bound vacuity, then fix by restoring i.i.d. assumptions or using VC/growth-function terms.
- Notes: delete dead template helpers.
