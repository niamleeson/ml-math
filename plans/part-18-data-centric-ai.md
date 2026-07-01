# Part 18 — Data-Centric AI

> Plan only — per-topic revamp plan. See ../00-MASTER-PLAN.md for the shared design & family registry (F1–F17).
> **Code style:** every notebook code cell is written one statement per line (newline-split, blank lines between logical groups) for readability — never dense, semicolon-packed one-liners. See ../00-MASTER-PLAN.md §B.4.
> Dominant approach: the data-quality MODIFIER ladder over a base learner (F1).

### 18.1 — Exploratory data analysis   [notebook: 18.1-exploratory-data-analysis.ipynb]   (family: F1 + data-quality modifier, gap)

**Lesson — Real World Applications (5):**
1. Fraud/risk triage — inspect tail leverage before modeling; lesson outlier has z = (20−6.167)/6.256 = 2.211.
2. Product analytics — compare segment rates before averaging; lesson A = 1/4 = 0.250 vs B = 3/4 = 0.750.
3. Healthcare vitals — flag center disagreement; lesson mean 6.167 vs median 3.500 implies a tail-heavy distribution.
4. Feature discovery — screen associations; lesson feature-target correlation r = 0.775.
5. Data intake monitoring — quantify global label mix; lesson overall rate = 4/8 = 0.500 while slices differ.

**Notebook plan:**
- Family: F1 + data-quality modifier
- Concept built once (D1): `profile_then_train()` computes mean/median/std/z/correlation/slice rates, then fits one logistic baseline; verify lesson x={2,3,3,4,5,20}, mean 6.167, median 3.500, z=2.211, r=0.775, slice rates 0.250/0.750.
- Datasets D1–D5: vary the DATA quality, not the model — D1 clean toy · D2 +label noise · D3 +class imbalance · D4 real tabular (breast_cancer/wine) · D5 real messy (missing values / duplicates / drift)
- Metric: accuracy across all rungs, with EDA issue count as a secondary annotation.
- Closing viz: (a) before/after data or boundary panels per rung (b) metric-vs-data-quality curve
- Pitfall on D5: averaging away segments; reproduce hidden slice failure, then fix with stratified/slice validation.
- Notes: delete dead conv2d/iou/edit_distance/ce/kl template code; CPU-only, tiny; gap lesson may need fuller authoring before notebook cites more than the current formulas.

### 18.2 — Data collection & sampling design   [notebook: 18.2-data-collection-sampling-design.ipynb]   (family: F1 + data-quality modifier)

**Lesson — Real World Applications (5):**
1. Survey sampling — recover population mixture; lesson true rate = (800·0.200 + 200·0.700)/1000 = 0.300.
2. Ads/log sampling — expose biased capture; lesson 90/10 sample gives 25/100 = 0.250 instead of 0.300.
3. Rare-group evaluation — stratify deliberately; lesson 80/20 sample gives 30/100 = 0.300.
4. Annotation budgeting — quantify uncertainty; lesson p=0.300, n=100 gives SE = 0.0458.
5. Scaling collection — show diminishing random error; lesson n=400 halves SE to 0.0229 and 95% half-width at n=100 is 0.0898.

**Notebook plan:**
- Family: F1 + data-quality modifier
- Concept built once (D1): `sample_design_train()` generates target-mixture samples, optional weights, and one fixed classifier; verify lesson rates 0.300, biased 0.250, stratified 0.300, SE 0.0458/0.0229.
- Datasets D1–D5: vary the DATA quality, not the model — D1 clean toy · D2 +label noise · D3 +class imbalance · D4 real tabular (breast_cancer/wine) · D5 real messy (missing values / duplicates / drift)
- Metric: weighted evaluation accuracy across all rungs.
- Closing viz: (a) before/after data or boundary panels per rung (b) metric-vs-data-quality curve
- Pitfall on D5: confusing sample size with representativeness; reproduce large biased sample underperformance, then fix target weights/stratified sampling.
- Notes: delete dead template helpers; CPU-only, tiny.

### 18.3 — Data cleaning & missing-value handling   [notebook: 18.3-data-cleaning-missing-value-handling.ipynb]   (family: F1 + data-quality modifier)

**Lesson — Real World Applications (5):**
1. CRM/customer tables — mean-impute with audit; lesson observed mean = (10+12+18+20)/4 = 15.000.
2. Segment-aware healthcare/finance — preserve group structure; lesson group fills are A=11.000 and B=31.000.
3. Churn/risk modeling — avoid complete-case label shift; lesson full rate 4/6 = 0.667 drops to 0.500.
4. Feature engineering — add missingness indicators; lesson missing indicator count = 2 concentrated among positives.
5. Data contracts — compare filled distribution; lesson filled vector mean remains 15.000 but variance is changed.

**Notebook plan:**
- Family: F1 + data-quality modifier
- Concept built once (D1): `clean_and_train()` applies imputation strategy plus missingness indicator before the same classifier; verify lesson mean 15.000, group fills 11.000/31.000, full vs complete-case rates 0.667/0.500.
- Datasets D1–D5: vary the DATA quality, not the model — D1 clean toy · D2 +label noise · D3 +class imbalance · D4 real tabular (breast_cancer/wine) · D5 real messy (missing values / duplicates / drift)
- Metric: accuracy across all rungs.
- Closing viz: (a) before/after data or boundary panels per rung (b) metric-vs-data-quality curve
- Pitfall on D5: dropping rows under informative missingness; reproduce label reweighting, then fix with imputation plus missingness indicators and slice checks.
- Notes: delete dead conv2d/iou/edit_distance/ce/kl code; CPU-only, tiny.

### 18.4 — Data labeling & annotation   [notebook: 18.4-data-labeling-annotation.ipynb]   (family: F1 + data-quality modifier)

**Lesson — Real World Applications (5):**
1. Content moderation — convert repeated judgments to labels; lesson vote fractions are {0.667,0.333,0.000,1.000,0.333}.
2. Medical annotation — measure annotator calibration; lesson three raters each score 4/5 = 0.800 on gold.
3. Search relevance — flag ambiguous items; lesson vote fraction near 1/3 or 2/3 signals uncertainty rather than truth.
4. Taxonomy QA — adjust for chance agreement; lesson observed agreement p_o = 3/5 = 0.600.
5. Guideline governance — detect weak agreement; lesson kappa = (0.600−0.520)/(1−0.520) = 0.167.

**Notebook plan:**
- Family: F1 + data-quality modifier
- Concept built once (D1): `aggregate_labels_train()` computes vote fractions, majority labels, gold rater accuracy, kappa, then trains one fixed classifier; verify lesson fractions, majority labels {1,0,0,1,0}, rater accuracy 0.800, kappa 0.167.
- Datasets D1–D5: vary the DATA quality, not the model — D1 clean toy · D2 +label noise · D3 +class imbalance · D4 real tabular (breast_cancer/wine) · D5 real messy (missing values / duplicates / drift)
- Metric: label-quality-adjusted accuracy across all rungs.
- Closing viz: (a) before/after data or boundary panels per rung (b) metric-vs-data-quality curve
- Pitfall on D5: counting majority vote as ground truth; reproduce ambiguous-label overconfidence, then fix with review/down-weighting by vote fraction.
- Notes: delete dead template code; CPU-only, tiny.

### 18.5 — Weak supervision & programmatic labeling   [notebook: 18.5-weak-supervision-programmatic-labeling.ipynb]   (family: F1 + data-quality modifier)

**Lesson — Real World Applications (5):**
1. Domain-rule labeling — track rule reach; lesson coverage counts are {4,4,5}/5 = {0.800,0.800,1.000}.
2. Compliance screening — find rule disagreement; lesson conflict rate = 1/5 = 0.200.
3. Bootstrapping classifiers — turn abstaining votes into labels; lesson majority vote gives {1,1,0,0,1}.
4. Expert-rule weighting — combine reliabilities; lesson positive weight = 0.9+0.8 = 1.7.
5. Label-model QA — compute confidence; lesson weighted positive score = 1.7/2.1 = 0.810.

**Notebook plan:**
- Family: F1 + data-quality modifier
- Concept built once (D1): `weak_label_train()` builds an LF matrix with -1 abstain, measures coverage/conflict, aggregates weighted labels, then trains one classifier; verify coverage 0.800/0.800/1.000, conflict 0.200, weighted score 0.810.
- Datasets D1–D5: vary the DATA quality, not the model — D1 clean toy · D2 +label noise · D3 +class imbalance · D4 real tabular (breast_cancer/wine) · D5 real messy (missing values / duplicates / drift)
- Metric: label-quality / downstream accuracy across all rungs.
- Closing viz: (a) before/after data or boundary panels per rung (b) metric-vs-data-quality curve
- Pitfall on D5: hidden correlated errors; reproduce two keyword-like rules overcounting confidence, then fix by grouping/down-weighting correlated LFs and preserving abstentions.
- Notes: delete dead template helpers; CPU-only, tiny.

### 18.6 — Synthetic data generation   [notebook: 18.6-synthetic-data-generation.ipynb]   (family: F1 + data-quality modifier)

**Lesson — Real World Applications (5):**
1. Rare-class training — repair minority count; lesson 5 real positives + 35 synthetic positives = 40, matching 40 negatives.
2. Privacy review — check memorization; lesson min nearest-neighbor distance = 0.05 below 0.10 warning threshold.
3. Distribution QA — compare means; lesson real mean (1+2+3+4)/4 = 2.500 equals synthetic mean 2.500.
4. Moment validation — require more than means; lesson real standard deviation = 1.118.
5. Simulation before launch — inspect nearest distances; lesson synthetic distances are {0.05,0.8,1.0}.

**Notebook plan:**
- Family: F1 + data-quality modifier
- Concept built once (D1): `generate_check_train()` creates class-conditional synthetic rows, checks mean/std/class balance/nearest distance, then trains one classifier; verify lesson means 2.500, real std 1.118, distances {0.05,0.8,1.0}, balance 40/40.
- Datasets D1–D5: vary the DATA quality, not the model — D1 clean toy · D2 +label noise · D3 +class imbalance · D4 real tabular (breast_cancer/wine) · D5 real messy (missing values / duplicates / drift)
- Metric: accuracy across all rungs with privacy-distance warning annotation.
- Closing viz: (a) before/after data or boundary panels per rung (b) metric-vs-data-quality curve
- Pitfall on D5: memorization disguised as generation; reproduce copied-neighbor synthetic rows, then fix with distance filtering and class-conditional regeneration.
- Notes: delete dead conv2d/iou/edit_distance/ce/kl code; CPU-only, tiny.

### 18.7 — Data augmentation strategies   [notebook: 18.7-data-augmentation-strategies.ipynb]   (family: F1 + data-quality modifier)

**Lesson — Real World Applications (5):**
1. Vision/text robustness — encode invariance; lesson jitter maps {1,2,3} to {1.1,1.9,3.2}.
2. Sensor/tabular noise training — preserve central tendency; lesson combined mean = 12.2/6 = 2.033.
3. Boundary auditing — catch invalid transforms; lesson shift disagrees on 32/80 = 0.400 points.
4. Mixup training — create soft labels; lesson λ=0.3 with y_a=0,y_b=1 gives y~ = 0.7.
5. Range validation — keep augmented rows plausible; lesson shift by 0.8 can cross x>0 boundary.

**Notebook plan:**
- Family: F1 + data-quality modifier
- Concept built once (D1): `augment_train()` applies label-preserving jitter/mixup within a radius and trains the same classifier; verify lesson augmented values, original mean 2.000, combined mean 2.033, flip rate 0.400, mixup x=(1.4,1.4), y=0.7.
- Datasets D1–D5: vary the DATA quality, not the model — D1 clean toy · D2 +label noise · D3 +class imbalance · D4 real tabular (breast_cancer/wine) · D5 real messy (missing values / duplicates / drift)
- Metric: accuracy across all rungs.
- Closing viz: (a) before/after data or boundary panels per rung (b) metric-vs-data-quality curve
- Pitfall on D5: augmenting across the boundary; reproduce systematic label noise from too-large transforms, then fix with smaller radius and validation constraints.
- Notes: delete dead template helpers; CPU-only, tiny.

### 18.8 — Data quality & validation   [notebook: 18.8-data-quality-validation.ipynb]   (family: F1 + data-quality modifier)

**Lesson — Real World Applications (5):**
1. Feature contract checks — block impossible scores; lesson {0.5,0.6,1.7,0.8} has 1 range violation.
2. Pipeline quality gates — enforce missingness budgets; lesson features 2 and 3 fail because 0.50 > 0.40.
3. Production drift monitoring — compute PSI; lesson total PSI = 0.171.
4. Offline/online parity — check distribution bins; lesson low-bin PSI term = 0.102.
5. Alert triage — separate data metric from model metric; lesson PSI uses p={0.5,0.3,0.2}, q={0.3,0.4,0.3}.

**Notebook plan:**
- Family: F1 + data-quality modifier
- Concept built once (D1): `validate_then_train()` runs schema/range/missingness/PSI checks before the same classifier; verify lesson 1 violation, missingness failures at 0.50>0.40, PSI terms 0.102/0.029/0.041 total 0.171.
- Datasets D1–D5: vary the DATA quality, not the model — D1 clean toy · D2 +label noise · D3 +class imbalance · D4 real tabular (breast_cancer/wine) · D5 real messy (missing values / duplicates / drift)
- Metric: validation pass coverage and accuracy across all rungs.
- Closing viz: (a) before/after data or boundary panels per rung (b) metric-vs-data-quality curve
- Pitfall on D5: only checking schema; reproduce right columns with shifted/impossible values, then fix range, missingness, PSI, and train-serving skew checks.
- Notes: delete dead conv2d/iou/edit_distance/ce/kl code; CPU-only, tiny.

### 18.9 — Data versioning & lineage   [notebook: 18.9-data-versioning-lineage.ipynb]   (family: F1 + data-quality modifier, gap)

**Lesson — Real World Applications (5):**
1. Reproducible training — diff data snapshots; lesson old {1,2,3,4} vs new {1,2,4,5} adds 1 row.
2. Rollback — identify removed records; lesson removed count = 1 for row {3}.
3. Audit lineage — trace row counts through transforms; lesson raw 3 → cleaned 2 → featured 2.
4. Quality-gated releases — select last passing version; lesson scores {0.91,0.93,0.62,0.94} with threshold 0.90 make version 3 fail and version 2 the previous passing snapshot.
5. Incident response — isolate stable overlap; lesson kept rows are {1,2,4}, count 3.

**Notebook plan:**
- Family: F1 + data-quality modifier
- Concept built once (D1): `versioned_train()` hashes/diffs snapshots, records cleaning/label transforms, trains the same classifier on selected snapshot; verify lesson added=1, removed=1, kept=3, lineage counts 3→2→2, rollback to version 2.
- Datasets D1–D5: vary the DATA quality, not the model — D1 clean toy · D2 +label noise · D3 +class imbalance · D4 real tabular (breast_cancer/wine) · D5 real messy (missing values / duplicates / drift)
- Metric: snapshot-selected accuracy across all rungs.
- Closing viz: (a) before/after data or boundary panels per rung (b) metric-vs-data-quality curve
- Pitfall on D5: losing transform parameters; reproduce unreproducible cleaned snapshot, then fix by storing transform parameters and downstream model-to-data index.
- Notes: delete dead template code; CPU-only, tiny; gap lesson may need authoring expansion before notebook cites richer production examples.

### 18.10 — Data valuation & Shapley for data   [notebook: 18.10-data-valuation-shapley-for-data.ipynb]   (family: F1 + data-quality modifier, gap)

**Lesson — Real World Applications (5):**
1. Training-set pruning — rank helpful rows; lesson Shapley values {0.250,0.250,0.500} sum to 1.000.
2. Label-error detection — find harmful examples; lesson mislabeled point marginal contribution = 0.500−1.000 = −0.500.
3. Collection prioritization — identify boundary-supporting rows; lesson point 2 has value 0.500 because it supplies positive-side utility.
4. Data marketplace/accounting — allocate utility fairly; lesson U(N)−U(∅)=1.000−0.000=1.000.
5. Approximation QA — expose subset dependence; lesson singleton utilities U({0})=U({1})=U({2})=0.500 while pair/full utilities can reach 1.000.

**Notebook plan:**
- Family: F1 + data-quality modifier
- Concept built once (D1): `value_rows_train()` computes exact small-n Data Shapley for a 1-NN/F1 learner, then uses top/negative row actions with the same classifier; verify lesson utilities, φ={0.250,0.250,0.500}, negative marginal −0.500.
- Datasets D1–D5: vary the DATA quality, not the model — D1 clean toy · D2 +label noise · D3 +class imbalance · D4 real tabular (breast_cancer/wine) · D5 real messy (missing values / duplicates / drift)
- Metric: accuracy after valuation-guided keep/drop across all rungs.
- Closing viz: (a) before/after data or boundary panels per rung (b) metric-vs-data-quality curve
- Pitfall on D5: computing exact values at large scale; reproduce exponential subset growth on messy data, then fix with seeded approximation plus error checks and stable snapshots.
- Notes: delete dead conv2d/iou/edit_distance/ce/kl code; CPU-only, tiny; gap lesson may need fuller authoring around approximation before implementation.
