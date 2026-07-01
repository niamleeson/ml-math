# Part 19 — Trustworthy, Responsible & Robust AI

> Plan only — per-topic revamp plan. See ../00-MASTER-PLAN.md for the shared design & family registry (F1–F17).
> **Code style:** every notebook code cell is written one statement per line (newline-split, blank lines between logical groups) for readability — never dense, semicolon-packed one-liners. See ../00-MASTER-PLAN.md §B.4.
> Dominant family: F15 (Trust/Interpretability/Robustness).

### 19.1 — Interpretability: feature importance & SHAP   [notebook: 19.1-feature-importance-shap.ipynb]   (family: F15)

**Lesson — Real World Applications (5):**
1. Credit underwriting — decompose a 1.700 signed decision into SHAP line items; top component share 0.480 (lesson toy).
2. Medical triage — separate helpful vs harmful factors; absolute explanatory mass 2.500 flags audit workload (lesson toy).
3. Fraud review — compare baseline and feature removals; removing the third mechanism changes score by -0.900 (lesson toy).
4. Ad quality ranking — report guard uplift from 1.700 to 2.450 under knob 0.300 (lesson toy).
5. Hiring-screen audit — keep signed attributions, not only ranks; illustrative 3-feature receipt sums to 1.700.

**Notebook plan:**
- Family: F15 Trust/Interpretability/Robustness
- Concept built once (D1): implement `explain_additive(model, X, background)` returning `phi0, phi`; verify `f(x)=phi0+sum(phi_j)`, signed total 1.700, absolute total 2.500, share 0.480.
- Datasets D1–D5: D1 linear toy · D2 +interaction/nonlinearity · D3 real tabular (wine/breast_cancer) · D4 image (digits) · D5 shifted/attacked/biased
- Metric: faithfulness across all rungs via deletion AUC / prediction-drop correlation.
- Closing viz: (a) attribution/reliability/robustness panels per rung (b) faithfulness-vs-stress curve
- Pitfall on D5: reproduce ranking by absolute value only, then fix by plotting signed local contributions against the background baseline.
- Notes: replace any generic guarded-score template; CPU-only, tiny.

### 19.2 — Interpretability: LIME & saliency maps   [notebook: 19.2-lime-saliency.ipynb]   (family: F15)

**Lesson — Real World Applications (5):**
1. Loan appeal explanations — local surrogate explains one applicant; top local component share 0.727 (lesson toy).
2. Skin-image saliency review — gradient saliency checks the most sensitive pixels; illustrative 8×8 digits rung uses 64 pixels.
3. Content moderation — kernel-width sweeps show local vs global explanations; guarded score rises 0.900→1.450 (lesson toy).
4. Fraud analyst tooling — perturbation budget audits coefficient stability; absolute local mass 1.100 (lesson toy).
5. Claims triage — remove the third local mechanism and score moves +0.100 (lesson toy).

**Notebook plan:**
- Family: F15 Trust/Interpretability/Robustness
- Concept built once (D1): implement `local_explain(x, model, kernel_width)` with weighted least squares plus gradient saliency; verify `f(x+Delta)≈f(x)+grad f(x)^T Delta`, total 0.900, share 0.727.
- Datasets D1–D5: D1 linear toy · D2 +interaction/nonlinearity · D3 real tabular (wine/breast_cancer) · D4 image (digits) · D5 shifted/attacked/biased
- Metric: faithfulness across all rungs via local surrogate R² / saliency deletion drop.
- Closing viz: (a) LIME bars or saliency maps per rung (b) faithfulness-vs-kernel/stress curve
- Pitfall on D5: reproduce using a huge kernel, then fix by tuning kernel width and reporting perturbation-count stability.
- Notes: replace generic guarded-score notebook with real LIME/saliency build-up; CPU-only, tiny.

### 19.3 — Counterfactual explanations   [notebook: 19.3-counterfactual-explanations.ipynb]   (family: F15)

**Lesson — Real World Applications (5):**
1. Credit denial recourse — smallest actionable change crosses a threshold; toy total 1.000 with distance terms 0.600, 0.300, 0.100.
2. Admissions advising — immutable-feature constraints prevent impossible edits; illustrative 2 mutable + 1 immutable feature audit.
3. Churn intervention — compare nearest acceptable region vs raw probability; guard adds 0.400 to the toy score.
4. Medical risk counseling — actionability distinguishes feasible lifestyle changes from fixed attributes; illustrative distance budget 1.000.
5. Fraud challenge workflow — removing mechanism three changes score -0.100, so recourse is stable in the toy.

**Notebook plan:**
- Family: F15 Trust/Interpretability/Robustness
- Concept built once (D1): implement `counterfactual_search(x, target, mutable_mask, cost)`; verify `x_cf=argmin_z d(z,x) s.t. f(z)=y_target`, total/cost 1.000 and top share 0.600.
- Datasets D1–D5: D1 linear toy · D2 +interaction/nonlinearity · D3 real tabular (wine/breast_cancer) · D4 image (digits) · D5 shifted/attacked/biased
- Metric: faithfulness via valid-actionable counterfactual rate at fixed distance.
- Closing viz: (a) original/counterfactual paths or edited pixels per rung (b) valid-rate-vs-stress curve
- Pitfall on D5: reproduce minimizing distance without constraints, then fix with mutable masks, feature-scaled costs, and plausibility checks.
- Notes: replace generic template; CPU-only, tiny.

### 19.4 — Concept-based explanations (TCAV)   [notebook: 19.4-tcav.ipynb]   (family: F15)

**Lesson — Real World Applications (5):**
1. Medical imaging concepts — test whether a concept direction raises disease score; toy TCAV total 0.900.
2. Brand-safety classifiers — verify concept sensitivity before release; top concept share 0.538 (lesson toy).
3. Hiring-text audit — compare concept examples to random controls; guard 0.600 lifts 0.900→1.680 (lesson toy).
4. Digit model audit — D4 uses human concepts like stroke thickness; illustrative 8×8 activation vector.
5. Visual search ranking — remove concept mechanism three and score changes +0.200 (lesson toy).

**Notebook plan:**
- Family: F15 Trust/Interpretability/Robustness
- Concept built once (D1): implement `tcav_score(activations, concept_examples, class_grad)`; verify `S_C,k(x)=grad h_k(x)^T v_C`, total 0.900, abs mass 1.300, guard 1.680.
- Datasets D1–D5: D1 linear toy · D2 +interaction/nonlinearity · D3 real tabular (wine/breast_cancer) · D4 image (digits) · D5 shifted/attacked/biased
- Metric: faithfulness via concept-sensitivity sign stability / concept ablation drop.
- Closing viz: (a) concept-direction bars and activation projections per rung (b) sensitivity-vs-stress curve
- Pitfall on D5: reproduce concept examples overlapping the target class, then fix with held-out concept negatives and layer comparison.
- Notes: replace generic template; CPU-only, tiny.

### 19.5 — Influence functions   [notebook: 19.5-influence-functions.ipynb]   (family: F15, gap)

**Lesson — Real World Applications (5):**
1. Bad-training-example debugging — rank points by approximate removal effect; toy signed total is 0.000 but abs mass 1.400.
2. Data audit for rare cases — high influence can be clean rarity; top component share 0.357 (lesson toy).
3. Unlearning triage — estimate which deletions need retraining; removing mechanism three changes score -0.200 (lesson toy).
4. Label-noise inspection — damping prevents ill-conditioned inverse-Hessian explosions; illustrative damping grid 0.01–1.00.
5. Customer-support model audit — compare influence approximation to leave-one-out on D1; illustrative 20-point toy.

**Notebook plan:**
- Family: F15 Trust/Interpretability/Robustness
- Concept built once (D1): implement `influence_scores(model, train, test, damping)`; verify `I_i(z)=-grad l(z)^T H^-1 grad l(z_i)`, lesson components 0.500, -0.700, 0.200 and abs mass 1.400.
- Datasets D1–D5: D1 linear toy · D2 +interaction/nonlinearity · D3 real tabular (wine/breast_cancer) · D4 image (digits) · D5 shifted/attacked/biased
- Metric: faithfulness via rank correlation with actual leave-one-out retraining on tiny subsets.
- Closing viz: (a) influential-point highlights per rung (b) correlation-vs-stress/damping curve
- Pitfall on D5: reproduce ignoring damping, then fix with damped Hessian solves and leave-one-out sanity checks.
- Notes: replace generic template; CPU-only, tiny; gap topic likely needs lesson-body authoring before notebook can cite stable numbers.

### 19.6 — Fairness definitions & metrics (demographic parity, equalized odds)   [notebook: 19.6-fairness-metrics.ipynb]   (family: F15)

**Lesson — Real World Applications (5):**
1. Loan approval monitoring — demographic parity uses all group members; toy rate components 0.650 and 0.450 imply gap 0.200.
2. Hiring model review — equal opportunity uses positives only; illustrative TPR gap 0.100.
3. Recidivism risk audit — equalized odds checks TPR and FPR; illustrative two-rate dashboard.
4. Ad delivery pacing — accuracy parity can hide error burden; toy guarded fairness score 1.560 from 1.300.
5. Healthcare prioritization — choose metric by harm; top rate component share 0.500 (lesson toy).

**Notebook plan:**
- Family: F15 Trust/Interpretability/Robustness
- Concept built once (D1): implement `fairness_report(y, yhat, group)` computing DP, EO, TPR/FPR gaps; verify `Delta_DP=|P(yhat=1|A=0)-P(yhat=1|A=1)|` and toy 0.200 rate gap.
- Datasets D1–D5: D1 linear toy · D2 +interaction/nonlinearity · D3 real tabular (wine/breast_cancer) · D4 image (digits) · D5 shifted/attacked/biased
- Metric: fairness gap across all rungs (primary DP gap plus EO panel).
- Closing viz: (a) group-rate dashboards per rung (b) fairness-gap-vs-stress curve
- Pitfall on D5: reproduce mixing denominators, then fix by displaying each metric's numerator/denominator and subgroup confusion matrices.
- Notes: replace generic template; CPU-only, tiny.

### 19.7 — Bias mitigation   [notebook: 19.7-bias-mitigation.ipynb]   (family: F15)

**Lesson — Real World Applications (5):**
1. Lending threshold post-processing — tune fairness penalty lambda; toy objective components sum to 0.650.
2. Hiring loss-constraint training — add `lambda Delta(theta)` to ERM; guard at lambda-like knob 0.500 gives 0.975.
3. Ad allocation reweighting — compare pre-, in-, and post-processing; top loss component share 0.538 (lesson toy).
4. Benefits eligibility — validate fairness gain vs sampling noise; illustrative 5-fold group-stratified CV.
5. Healthcare triage — avoid huge weights on rare cells; lesson toy absolute mass 0.650 bounds audit scale.

**Notebook plan:**
- Family: F15 Trust/Interpretability/Robustness
- Concept built once (D1): implement `mitigate_bias(model, lambda_, method)` using reweighting/thresholding/fairness penalty; verify `J(theta)=R_S(theta)+lambda Delta(theta)`, total 0.650 and guard 0.975.
- Datasets D1–D5: D1 linear toy · D2 +interaction/nonlinearity · D3 real tabular (wine/breast_cancer) · D4 image (digits) · D5 shifted/attacked/biased
- Metric: fairness gap across all rungs at constrained accuracy.
- Closing viz: (a) accuracy-vs-gap panels per rung (b) fairness-gap-vs-lambda/stress curve
- Pitfall on D5: reproduce tuning lambda without validation, then fix with held-out group-stratified validation and calibration checks.
- Notes: replace generic template; CPU-only, tiny.

### 19.8 — Adversarial examples & attacks   [notebook: 19.8-adversarial-attacks.ipynb]   (family: F15)

**Lesson — Real World Applications (5):**
1. Image classifier safety — FGSM perturbation uses epsilon times gradient sign; toy components sum 0.900.
2. Fraud classifier probing — robust accuracy must cite epsilon; illustrative epsilon ladder 0.00–0.30.
3. Malware detection hardening — norm choice defines allowed edits; top component share 0.444 (lesson toy).
4. Autonomous perception QA — attack success under small norm is not semantic safety; illustrative 8×8 digit pixel attack.
5. Content classifier red team — removing mechanism three changes score -0.200 (lesson toy).

**Notebook plan:**
- Family: F15 Trust/Interpretability/Robustness
- Concept built once (D1): implement `fgsm_attack(model, x, y, eps)`; verify `x_adv=x+eps sign(grad_x loss)`, total 0.900, guard 0.990 at eps/knob 0.100.
- Datasets D1–D5: D1 linear toy · D2 +interaction/nonlinearity · D3 real tabular (wine/breast_cancer) · D4 image (digits) · D5 shifted/attacked/biased
- Metric: robust-accuracy across all rungs.
- Closing viz: (a) clean/adversarial attribution or image panels per rung (b) robust-accuracy-vs-epsilon curve
- Pitfall on D5: reproduce reporting accuracy without epsilon, then fix by plotting clean and adversarial accuracy over a declared norm/radius ladder.
- Notes: replace generic template; CPU-only, tiny.

### 19.9 — Adversarial robustness & certification   [notebook: 19.9-adversarial-robustness-certification.ipynb]   (family: F15)

**Lesson — Real World Applications (5):**
1. Medical image release gates — certificate holds only inside radius; toy margin components sum 2.200.
2. Safety-critical perception — Lipschitz bound checks `margin > 2L eps`; top margin share 0.545 (lesson toy).
3. Fraud model assurance — compare empirical and certified robustness; guard 2.200→2.640 (lesson toy).
4. Document classifier QA — loose L can fail to certify robust examples; illustrative L grid 0.5–5.0.
5. Digit recognition demo — one uncertified high-risk example remains unproved; illustrative 8×8 D4 panel.

**Notebook plan:**
- Family: F15 Trust/Interpretability/Robustness
- Concept built once (D1): implement `certify_margin(scores, L, eps)`; verify `f_y(x)-max_k!=y f_k(x) > 2L eps`, lesson total 2.200 and abs mass 2.200.
- Datasets D1–D5: D1 linear toy · D2 +interaction/nonlinearity · D3 real tabular (wine/breast_cancer) · D4 image (digits) · D5 shifted/attacked/biased
- Metric: robust-accuracy / certified-accuracy across all rungs.
- Closing viz: (a) certified vs attacked examples per rung (b) certified-accuracy-vs-epsilon curve
- Pitfall on D5: reproduce claiming certification outside the norm ball, then fix by labeling the norm, radius, and conservative bound for each example.
- Notes: replace generic template; CPU-only, tiny.

### 19.10 — Data poisoning & backdoors   [notebook: 19.10-data-poisoning-backdoors.ipynb]   (family: F15, gap)

**Lesson — Real World Applications (5):**
1. Vision backdoor tests — clean accuracy can stay high while trigger error rises; toy poison mix total 0.570.
2. Spam-filter poisoning — alpha mixes clean and bad risk; illustrative poison rates 0%, 2%, 5%, 10%.
3. Recommender abuse detection — rare high-leverage examples can dominate; top component share 0.088 (lesson toy).
4. Data dedup pipelines — near-duplicates may preserve trigger features; removing mechanism three changes -0.120 (lesson toy).
5. Model supply-chain QA — conditional trigger tests must accompany aggregate validation; guard 0.616 (lesson toy).

**Notebook plan:**
- Family: F15 Trust/Interpretability/Robustness
- Concept built once (D1): implement `poison_train_eval(alpha, trigger_fn)` measuring clean and triggered risk; verify `R_poison=(1-alpha)R_clean+alpha R_bad`, toy total 0.570 and knob 0.080.
- Datasets D1–D5: D1 linear toy · D2 +interaction/nonlinearity · D3 real tabular (wine/breast_cancer) · D4 image (digits) · D5 shifted/attacked/biased
- Metric: robust-accuracy as clean accuracy minus attack success / triggered accuracy.
- Closing viz: (a) clean vs trigger panels per rung (b) triggered-failure-vs-poison-rate curve
- Pitfall on D5: reproduce checking only clean accuracy, then fix with conditional trigger slices and influence-style point review.
- Notes: replace generic template; CPU-only, tiny; gap topic likely needs lesson-body authoring before notebook can cite stable numbers.

### 19.11 — Model extraction & stealing   [notebook: 19.11-model-extraction-stealing.ipynb]   (family: F15, gap)

**Lesson — Real World Applications (5):**
1. API abuse defense — fit a substitute from q queries; lesson objective components sum 1.800.
2. Rate-limit design — boundary queries reveal more than random interiors; illustrative query budget ladder 10–500.
3. Model IP monitoring — behavioral similarity matters without exact parameter recovery; top share 0.500 (lesson toy).
4. Confidence-output policy — probabilities leak more than labels; guard 1.800→2.070 with knob 0.150 (lesson toy).
5. Watermark validation — stolen substitute can be tested for copied behavior; removing mechanism three changes -0.300.

**Notebook plan:**
- Family: F15 Trust/Interpretability/Robustness
- Concept built once (D1): implement `extract_model(teacher, query_strategy, q)` fitting substitute to teacher outputs; verify `g_hat=argmin_g 1/q sum loss(g(x_i), f(x_i))`, total 1.800 and share 0.500.
- Datasets D1–D5: D1 linear toy · D2 +interaction/nonlinearity · D3 real tabular (wine/breast_cancer) · D4 image (digits) · D5 shifted/attacked/biased
- Metric: faithfulness via teacher-student agreement across all rungs.
- Closing viz: (a) teacher vs substitute boundary/prediction panels per rung (b) agreement-vs-query-budget/stress curve
- Pitfall on D5: reproduce ignoring confidence outputs, then fix by comparing hard-label vs probability APIs and diversity-aware query throttling.
- Notes: replace generic template; CPU-only, tiny; gap topic likely needs lesson-body authoring before notebook can cite stable numbers.

### 19.12 — Privacy attacks (membership inference)   [notebook: 19.12-membership-inference.ipynb]   (family: F15)

**Lesson — Real World Applications (5):**
1. Healthcare model privacy audit — threshold confidence to infer membership; toy components sum 1.640.
2. Education analytics — attack advantage, not raw accuracy, handles class imbalance; illustrative member prior 0.500.
3. Face recognition deployment — rare examples may leak despite accuracy; top confidence share 0.500 (lesson toy).
4. Calibration-aware release — threshold tau must be chosen without victim leakage; guard 2.706 from 1.640 (lesson toy).
5. DP regression test — removing mechanism three changes score -0.270, so confidence gap is visible (lesson toy).

**Notebook plan:**
- Family: F15 Trust/Interpretability/Robustness
- Concept built once (D1): implement `membership_attack(scores, tau)` using train/test confidence distributions; verify `m_hat=1[s(x,y)>=tau]`, total 1.640 and guard 2.706.
- Datasets D1–D5: D1 linear toy · D2 +interaction/nonlinearity · D3 real tabular (wine/breast_cancer) · D4 image (digits) · D5 shifted/attacked/biased
- Metric: privacy attack advantage across all rungs.
- Closing viz: (a) member/nonmember confidence histograms per rung (b) attack-advantage-vs-overfit/stress curve
- Pitfall on D5: reproduce choosing tau on victim data, then fix with shadow/calibration split and advantage reporting.
- Notes: replace generic template; CPU-only, tiny.

### 19.13 — Differential privacy   [notebook: 19.13-differential-privacy.ipynb]   (family: F15)

**Lesson — Real World Applications (5):**
1. Census statistics release — noise calibrated to one-row sensitivity; toy privacy components sum 1.600.
2. Federated analytics — epsilon spending composes across releases; guard at epsilon-like knob 0.800 gives 2.880.
3. Search-log dashboards — delta is a failure probability, not zero; illustrative delta budget 1e-5.
4. Healthcare model training — DP limits membership inference surface; top component share 0.625 (lesson toy).
5. A/B reporting — forgetting sensitivity invalidates noise scale; removing mechanism three changes -0.100 (lesson toy).

**Notebook plan:**
- Family: F15 Trust/Interpretability/Robustness
- Concept built once (D1): implement `dp_release(statistic, sensitivity, epsilon, delta)`; verify `P(M(D)=o)<=e^epsilon P(M(D')=o)+delta`, total 1.600 and share 0.625.
- Datasets D1–D5: D1 linear toy · D2 +interaction/nonlinearity · D3 real tabular (wine/breast_cancer) · D4 image (digits) · D5 shifted/attacked/biased
- Metric: privacy risk / membership attack advantage at fixed utility across all rungs.
- Closing viz: (a) noisy-statistic or DP-training reliability panels per rung (b) utility/privacy-vs-epsilon curve
- Pitfall on D5: reproduce forgetting sensitivity, then fix by computing Delta f before noise and tracking composition.
- Notes: replace generic template; CPU-only, tiny.

### 19.14 — Machine unlearning   [notebook: 19.14-machine-unlearning.ipynb]   (family: F15, gap)

**Lesson — Real World Applications (5):**
1. User deletion compliance — approximate parameter removal; toy update components total 0.180.
2. Vector-search cleanup — caches and embeddings must be updated, not just the main model; illustrative 3-artifact lineage.
3. Dataset takedown — compare approximation to retraining; top update share 0.632 (lesson toy).
4. Recommendation index refresh — large deletion batches break first-order removal; illustrative delete fractions 1%, 5%, 20%.
5. Privacy incident response — removing mechanism three changes -0.040, a small toy residual to verify.

**Notebook plan:**
- Family: F15 Trust/Interpretability/Robustness
- Concept built once (D1): implement `unlearn_point(model, z_i, method)` and compare to retrain-without-point; verify `theta_unlearn≈theta-H^-1 grad l(z_i)/n`, total 0.180 and abs mass 0.380.
- Datasets D1–D5: D1 linear toy · D2 +interaction/nonlinearity · D3 real tabular (wine/breast_cancer) · D4 image (digits) · D5 shifted/attacked/biased
- Metric: faithfulness via prediction distance to exact retraining.
- Closing viz: (a) before/unlearned/retrained panels per rung (b) retrain-distance-vs-delete-fraction curve
- Pitfall on D5: reproduce updating only the main model, then fix with provenance-linked cache/embedding/index cleanup checks.
- Notes: replace generic template; CPU-only, tiny; gap topic likely needs lesson-body authoring before notebook can cite stable numbers.

### 19.15 — Watermarking & provenance   [notebook: 19.15-watermarking-provenance.ipynb]   (family: F15, gap)

**Lesson — Real World Applications (5):**
1. Model IP verification — use z-test over trigger hits; lesson counts 18, 10, 4 sum to 32.
2. Dataset license audits — provenance chains record artifacts; illustrative 4-step data lineage graph.
3. Stolen-model detection — false-positive control matters; top count share 0.562 (lesson toy).
4. Safety watermark design — trigger must not become a backdoor; guard count rises 32→48 with knob 0.500.
5. Release evidence bundle — too few trigger queries reduce power; removing 4 counts changes total to 28 (lesson toy).

**Notebook plan:**
- Family: F15 Trust/Interpretability/Robustness
- Concept built once (D1): implement `watermark_test(k, n, p0)` plus provenance DAG check; verify `z=(k-np0)/sqrt(np0(1-p0))`, lesson counts total 32 and share 0.562.
- Datasets D1–D5: D1 linear toy · D2 +interaction/nonlinearity · D3 real tabular (wine/breast_cancer) · D4 image (digits) · D5 shifted/attacked/biased
- Metric: faithfulness via watermark detection power at fixed false-positive rate.
- Closing viz: (a) trigger-response/provenance panels per rung (b) detection-power-vs-query/stress curve
- Pitfall on D5: reproduce using too few trigger queries, then fix with power analysis and safe non-backdoor trigger design.
- Notes: replace generic template; CPU-only, tiny; gap topic likely needs lesson-body authoring before notebook can cite stable numbers.

### 19.16 — Uncertainty quantification & calibration   [notebook: 19.16-uncertainty-calibration.ipynb]   (family: F15)

**Lesson — Real World Applications (5):**
1. Weather-style risk scores — 0.8 predictions should be correct about 80%; lesson ECE components sum 0.350.
2. Medical triage probabilities — reliability matters beyond accuracy; top bin share 0.286 (lesson toy).
3. Credit pricing — calibration bins expose overconfidence; guard 0.350→0.420 with knob 0.200.
4. Search ranking confidence — too many bins on small data are noisy; illustrative 5-bin vs 20-bin comparison.
5. Autonomous system fallback — removing largest bin error changes ECE by -0.200 (lesson toy).

**Notebook plan:**
- Family: F15 Trust/Interpretability/Robustness
- Concept built once (D1): implement `calibration_report(y, proba, bins)` with ECE and reliability curve; verify `ECE=sum_b n_b/n |acc(b)-conf(b)|`, total 0.350 and guard 0.420.
- Datasets D1–D5: D1 linear toy · D2 +interaction/nonlinearity · D3 real tabular (wine/breast_cancer) · D4 image (digits) · D5 shifted/attacked/biased
- Metric: ECE across all rungs.
- Closing viz: (a) reliability diagrams per rung (b) ECE-vs-shift/stress curve
- Pitfall on D5: reproduce looking only at accuracy, then fix with reliability diagrams, ECE, and bin-count sensitivity.
- Notes: replace generic template; CPU-only, tiny.

### 19.17 — Conformal prediction   [notebook: 19.17-conformal-prediction.ipynb]   (family: F15)

**Lesson — Real World Applications (5):**
1. Medical diagnosis sets — finite-sample coverage uses residual ranks; lesson nonconformity components sum 0.650.
2. Demand forecasting intervals — quantile cutoff uses `ceil((n+1)(1-alpha))`; illustrative alpha 0.100 target 90% coverage.
3. Autonomous fallback — prediction-set size grows under shift; top residual share 0.154 for first component (lesson toy).
4. Legal-document classification — marginal coverage can hide subgroup failures; illustrative subgroup gap 0.100.
5. Fraud review queue — removing largest residual component changes total -0.350 (lesson toy).

**Notebook plan:**
- Family: F15 Trust/Interpretability/Robustness
- Concept built once (D1): implement `conformal_sets(cal_scores, alpha, candidate_scores)`; verify `C(x)={y:s(x,y)<=q_ceil((n+1)(1-alpha))}`, total 0.650 and guard 0.715.
- Datasets D1–D5: D1 linear toy · D2 +interaction/nonlinearity · D3 real tabular (wine/breast_cancer) · D4 image (digits) · D5 shifted/attacked/biased
- Metric: coverage gap from target coverage across all rungs.
- Closing viz: (a) prediction sets / interval panels per rung (b) coverage-gap-vs-shift/stress curve
- Pitfall on D5: reproduce using the test set as calibration, then fix with a separate calibration split and ceil-correct quantile.
- Notes: replace generic template; CPU-only, tiny.

### 19.18 — Out-of-distribution detection   [notebook: 19.18-ood-detection.ipynb]   (family: F15)

**Lesson — Real World Applications (5):**
1. Medical imaging intake — flag examples outside training support before diagnosis; lesson OOD scores sum 4.300.
2. Fraud model monitoring — threshold score tau detects unfamiliar regions; top score share 0.186 (lesson toy).
3. Autonomous driving — high softmax can be wrong far from data; guard 4.300→10.750 with knob 1.500.
4. Content moderation — distinguish covariate, label, and concept shifts; illustrative 3-shift stress panel.
5. Digit classifier rejection — removing largest OOD component changes score -2.100 (lesson toy).

**Notebook plan:**
- Family: F15 Trust/Interpretability/Robustness
- Concept built once (D1): implement `ood_detector(train_repr, score, tau)` using distance/density/energy; verify `o_hat=1[s(x)>tau]`, total 4.300 and guard 10.750.
- Datasets D1–D5: D1 linear toy · D2 +interaction/nonlinearity · D3 real tabular (wine/breast_cancer) · D4 image (digits) · D5 shifted/attacked/biased
- Metric: OOD detection AUROC / false-positive-rate at target recall across all rungs.
- Closing viz: (a) ID/OOD score panels per rung (b) AUROC-vs-shift/stress curve
- Pitfall on D5: reproduce using maximum softmax alone, then fix with distance/energy scores and tau selected without future OOD labels.
- Notes: replace generic template; CPU-only, tiny.

### 19.19 — Spurious correlations & shortcut learning   [notebook: 19.19-spurious-shortcuts.ipynb]   (family: F15, gap)

**Lesson — Real World Applications (5):**
1. Medical imaging shortcuts — train accuracy rewards watermarks; lesson environment gap components sum 0.640.
2. Hiring text screening — proxies can carry sensitive correlations; top shortcut share 0.156 (lesson toy).
3. Wildlife image classification — background cue flips under new environment; illustrative 80/20 cue-label train split.
4. Fraud detection — dropping named sensitive features is insufficient; guard 0.640→0.768 with knob 0.200.
5. Content ranking — removing shortcut mechanism three changes score -0.220 (lesson toy).

**Notebook plan:**
- Family: F15 Trust/Interpretability/Robustness
- Concept built once (D1): implement `environment_gap(model, env_train, env_shift)` and shortcut ablation; verify `Delta_env=R_shift(h)-R_train(h)`, total 0.640 and share 0.156.
- Datasets D1–D5: D1 linear toy · D2 +interaction/nonlinearity · D3 real tabular (wine/breast_cancer) · D4 image (digits) · D5 shifted/attacked/biased
- Metric: robust-accuracy / environment gap across all rungs.
- Closing viz: (a) cue-vs-core attribution panels per rung (b) environment-gap-vs-shift curve
- Pitfall on D5: reproduce validating on the same environment, then fix with environment-split evaluation and proxy ablations.
- Notes: replace generic template; CPU-only, tiny; gap topic likely needs lesson-body authoring before notebook can cite stable numbers.

### 19.20 — Causal inference (do-calculus, counterfactuals, propensity)   [notebook: 19.20-causal-inference.ipynb]   (family: F15)

**Lesson — Real World Applications (5):**
1. Treatment-effect estimation — IPW rebuilds a randomized comparison; lesson ATE components sum 2.400.
2. Ad campaign incrementality — propensity near 0 or 1 explodes weights; illustrative propensity clipping 0.05–0.95.
3. Policy evaluation — prediction `P(Y|X)` is not intervention `P(Y|do(T))`; top component share 0.500 (lesson toy).
4. Healthcare comparative effectiveness — collider adjustment can create bias; guard 2.400→3.600 with knob 0.500.
5. Uplift targeting foundation — removing mechanism three changes ATE -0.400 (lesson toy).

**Notebook plan:**
- Family: F15 Trust/Interpretability/Robustness
- Concept built once (D1): implement `estimate_ate_ipw(T, Y, e)` plus simple DAG adjustment check; verify `ATE=E[TY/e(X)-(1-T)Y/(1-e(X))]`, total 2.400 and share 0.500.
- Datasets D1–D5: D1 linear toy · D2 +interaction/nonlinearity · D3 real tabular (wine/breast_cancer) · D4 image (digits) · D5 shifted/attacked/biased
- Metric: faithfulness via ATE error against known simulated effect / stability under stress.
- Closing viz: (a) treated-control balance and effect panels per rung (b) ATE-error-vs-overlap/stress curve
- Pitfall on D5: reproduce conditioning on colliders, then fix with declared adjustment set, overlap diagnostics, and propensity clipping.
- Notes: replace generic template; CPU-only, tiny.

### 19.21 — Uplift modeling   [notebook: 19.21-uplift-modeling.ipynb]   (family: F15)

**Lesson — Real World Applications (5):**
1. Marketing targeting — predict incremental response, not baseline conversion; lesson uplift components sum 0.600.
2. Notification suppression — negative uplift users are harmed by treatment; illustrative uplift bins from -0.10 to +0.30.
3. Healthcare outreach — random assignment protects uplift labels; top share 0.500 (lesson toy).
4. Sales discounting — likely converters may waste treatment; guard 0.600→0.660 with knob 0.100.
5. Fair intervention delivery — removing mechanism three changes uplift -0.120 (lesson toy).

**Notebook plan:**
- Family: F15 Trust/Interpretability/Robustness
- Concept built once (D1): implement `uplift_score(model_t, model_c, x)` and Qini/uplift curve; verify `u(x)=P(Y=1|T=1,x)-P(Y=1|T=0,x)`, total 0.600 and share 0.500.
- Datasets D1–D5: D1 linear toy · D2 +interaction/nonlinearity · D3 real tabular (wine/breast_cancer) · D4 image (digits) · D5 shifted/attacked/biased
- Metric: faithfulness via uplift/Qini gain against known simulated treatment effect.
- Closing viz: (a) uplift-bin and treated/control response panels per rung (b) Qini/uplift-gain-vs-assignment-bias curve
- Pitfall on D5: reproduce training only on treated outcomes, then fix with two-model/T-learner comparison and randomized or propensity-weighted evaluation.
- Notes: replace generic template; CPU-only, tiny.

### 19.22 — Red teaming & evaluation   [notebook: 19.22-red-teaming-evaluation.ipynb]   (family: F15, gap)

**Lesson — Real World Applications (5):**
1. LLM release gates — weighted risk score sums severities; lesson risk components total 0.350.
2. Fraud model stress tests — denominators per scenario make severity comparable; top component share 0.143 (lesson toy).
3. Privacy/fairness launch review — include membership and fairness metrics; guard 0.350→0.560 with knob 0.600.
4. Regression test suites — fixed failures can return silently; illustrative 5-scenario red-team pack.
5. Independent safety audit — model author should not grade alone; removing largest risk component changes -0.200 (lesson toy).

**Notebook plan:**
- Family: F15 Trust/Interpretability/Robustness
- Concept built once (D1): implement `red_team_score(risks, weights, gates)` with scenario denominators; verify `S=sum_j w_j r_j`, total 0.350 and guard 0.560.
- Datasets D1–D5: D1 linear toy · D2 +interaction/nonlinearity · D3 real tabular (wine/breast_cancer) · D4 image (digits) · D5 shifted/attacked/biased
- Metric: robust-accuracy / weighted risk score across all rungs.
- Closing viz: (a) risk-card panels per rung (b) risk-score-vs-stress curve
- Pitfall on D5: reproduce counting only found bugs, then fix with denominators, predeclared gates, and regression tests for fixed failures.
- Notes: replace generic template; CPU-only, tiny; gap topic likely needs lesson-body authoring before notebook can cite stable numbers.
