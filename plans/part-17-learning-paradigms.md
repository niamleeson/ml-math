# Part 17 — Learning Paradigms

> Plan only — per-topic revamp plan. See ../00-MASTER-PLAN.md for the shared design & family registry (F1–F17).
> **Code style:** every notebook code cell is written one statement per line (newline-split, blank lines between logical groups) for readability — never dense, semicolon-packed one-liners. See ../00-MASTER-PLAN.md §B.4.
> Dominant approach: the budget/shift MODIFIER ladder over a base learner (F1/F5).

### 17.1 — Transfer learning   [notebook: 17.1-transfer-learning.ipynb]   (family: F5 + budget/shift modifier)

**Lesson — Real World Applications (5):**
1. Medical-imaging triage — reuse a source encoder and fit only the head with 10% target labels (illustrative) instead of 100% from scratch.
2. Defect detection — freeze a vision backbone so the target update is a small correction; verify D1 with lesson logit 1.600 and probability 0.832.
3. Document classification — transfer language features and fine-tune the last layer with a 0.1 learning rate, matching the lesson's small update size.
4. Retail product tagging — adapt a catalog encoder where a 2-feature D1 head update changes weights from (1.2, -0.8) to (1.234, -0.783), citing lesson numbers.
5. Ads creative quality — reuse asset embeddings and spend scarce labels on the head; compare 100%, 50%, 10%, 2%, 1% budgets (illustrative).

**Notebook plan:**
- Family: F5 DL-Training + label-budget/domain-shift modifier
- Concept built once (D1): `transfer_head_step()` freezes a 2-D feature map and applies the lesson formula $p=\sigma(w^Tz+b)$, verifying logit 1.600, p=0.832, gradient (-0.336,-0.168), and updated w=(1.234,-0.783).
- Datasets D1–D5: D1 two-feature toy from the lesson · D2 clean `make_classification` source/target with 100% labels · D3 same target with 50% then 10% labels · D4 sklearn digits 2-class transfer with 2% labels · D5 digits with 1% labels plus source-target nuisance shift.
- Metric: target accuracy vs label budget/shift.
- Closing viz: (a) frozen-feature decision-boundary panels across D1–D5 (b) accuracy-vs-label-budget curve showing transfer payoff.
- Pitfall on D5: assumed shared structure is nuisance/negative transfer; reproduce source-shift harm, then fix by unfreezing last layer or reducing transferred features.
- Notes: replace the generic Base/Knob/Contrast/Edge template; CPU-only, tiny; keep numbers lesson-cited unless marked illustrative.

### 17.2 — Domain adaptation & domain generalization   [notebook: 17.2-domain-adaptation-generalization.ipynb]   (family: F1 + budget/shift modifier)

**Lesson — Real World Applications (5):**
1. Fraud models across countries — align source and target feature means; lesson shift (1, -0.5) has discrepancy 1.250 before alignment and 0.000 after.
2. Hospital models across scanners — validate that domain identity is nuisance, not label signal, before subtracting a domain shift (lesson warning).
3. Speech recognition across microphones — train on several source domains and test a held-out target with rising shift 0.0→1.0 (illustrative).
4. Ads prediction across markets — monitor target risk because source risk alone is not a certificate; use accuracy drop vs shift as the number.
5. Retail demand models across seasons — compare no adaptation vs mean alignment on D4/D5; report the same discrepancy formula from the lesson.

**Notebook plan:**
- Family: F1 Supervised-Tabular + domain-shift modifier
- Concept built once (D1): `mean_align_then_fit()` computes $\|\mu_S-\mu_T\|_2^2$ and verifies lesson values: (0,0) to (1,-0.5) gives 1.250, subtracting shift gives 0.000.
- Datasets D1–D5: D1 two Gaussian means from lesson · D2 clean source/target blobs with pure nuisance shift · D3 same with shift partly correlated with label · D4 iris with synthetic domain offsets · D5 digits tabular pixels with stronger domain/style shift.
- Metric: target accuracy vs domain-shift magnitude, with discrepancy tracked as diagnostic.
- Closing viz: (a) source/target boundary and aligned-feature panels across shifts (b) target accuracy-vs-shift curve.
- Pitfall on D5: alignment removes useful label information when the shifted direction is not nuisance; reproduce drop, then fix by class-conditional alignment or validation-gated alignment.
- Notes: replace generic template; CPU-only; mark synthetic shift magnitudes illustrative.

### 17.3 — Semi-supervised learning   [notebook: 17.3-semi-supervised-learning.ipynb]   (family: F1 + budget/shift modifier)

**Lesson — Real World Applications (5):**
1. Image moderation — keep only pseudo-labels above threshold 0.8; lesson keeps 0.9 and rejects 0.5.
2. Medical coding — use unlabeled records only when entropy is low; lesson entropies are 0.325 vs 0.693.
3. Product taxonomy — expand 10 labeled examples with confident unlabeled neighbors (illustrative) while tracking confirmation bias.
4. Search intent classification — threshold pseudo-labels so ambiguous 50/50 cases are rejected, citing lesson probability 0.5 < 0.8.
5. Sensor fault detection — exploit abundant unlabeled readings but validate geometry aligns with labels, the lesson's central condition.

**Notebook plan:**
- Family: F1 Supervised-Tabular + label-budget modifier
- Concept built once (D1): `self_train_threshold()` computes entropy and confidence, verifying lesson: entropy(0.9,0.1)=0.325, entropy(0.5,0.5)=0.693, tau=0.8 keeps only the 0.9 pseudo-label.
- Datasets D1–D5: D1 two probability vectors from lesson · D2 clean two-moons with 100%→50% labels · D3 noisy moons with 10% labels plus unlabeled pool · D4 iris with 2% labels · D5 digits binary with 1% labels and misleading cluster geometry.
- Metric: accuracy vs labeled-budget fraction.
- Closing viz: (a) pseudo-label/decision-boundary panels with accepted/rejected points (b) accuracy-vs-label-budget curve.
- Pitfall on D5: guessed labels become self-reinforcing errors/confirmation bias; reproduce with low tau, then fix by tau=0.8 plus calibration or consistency checks.
- Notes: explicitly replace the current generic notebook template; CPU-only; no invented lesson numbers beyond illustrative budgets.

### 17.4 — Self-supervised learning   [notebook: 17.4-self-supervised-learning.ipynb]   (family: F5 + budget/shift modifier)

**Lesson — Real World Applications (5):**
1. Vision pretraining — create labels from augmentations, then fine-tune with 10% labels (illustrative) because annotation scales slower than data.
2. Time-series sensors — predict masked coordinates; lesson line y=0.7x+0.2 gives -0.500, 0.200, 0.900 at x=-1,0,1.
3. Search embeddings — train from query/document co-occurrence and use downstream labels only for a small head, paralleling transfer.
4. Industrial audio — learn representations by recovering hidden segments; require zero D1 squared error as in the lesson's line-recovery toy.
5. Medical notes — masked-token pretraining must avoid shortcuts; compare clean pretext vs shortcut pretext accuracy (illustrative).

**Notebook plan:**
- Family: F5 DL-Training + pretraining/label-budget modifier
- Concept built once (D1): `pretrain_then_probe()` fits the lesson pretext $\hat y=0.7x+0.2$, verifying targets -0.500, 0.200, 0.900 and total squared error 0.000 before a tiny downstream probe.
- Datasets D1–D5: D1 3-point line recovery from lesson · D2 clean synthetic tabular masked-feature prediction · D3 shortcut-corrupted pretext · D4 sklearn digits with masked-pixel pretraining and 10% labels · D5 digits with 1% labels and a shortcut augmentation.
- Metric: downstream accuracy vs label budget/pretext quality.
- Closing viz: (a) learned representation or boundary panels across pretext difficulty (b) accuracy-vs-label-budget curve with pretrained vs scratch.
- Pitfall on D5: shortcut pretext solves the task without useful structure; reproduce shortcut win/pretext loss, then fix by removing shortcut augmentations.
- Notes: CPU-only small MLP/logistic probe; replace generic template.

### 17.5 — Contrastive & metric learning (SimCLR, MoCo, triplet)   [notebook: 17.5-contrastive-metric-learning.ipynb]   (family: F5 + budget/shift modifier)

**Lesson — Real World Applications (5):**
1. Face verification — positives define invariance and negatives preserve identity; lesson positive probability is 0.726.
2. Product image retrieval — tune temperature 0.5 and compare alternatives so high absolute similarity is not enough.
3. Duplicate-ticket search — use metric embeddings where query and positive must beat three alternatives, matching lesson's 4-similarity denominator.
4. Few-shot classification — prototypes inherit geometry from contrastive pretraining; track 1, 5, 10 shots (illustrative).
5. Multimodal retrieval — shared space later supports CLIP-style matching; use lesson InfoNCE loss 0.320 as D1 check.

**Notebook plan:**
- Family: F5 DL-Training + comparison-set/label-budget modifier
- Concept built once (D1): `contrastive_score()` computes InfoNCE from lesson similarities (0.994, 0, -1, 0.243) and tau=0.5, verifying scaled logits (1.988,0,-2,0.486), positive probability 0.726, loss 0.320.
- Datasets D1–D5: D1 four embedding similarities from lesson · D2 clean paired blobs with correct positives · D3 noisy positives/false negatives · D4 sklearn digits metric embeddings with 10 labels/class · D5 digits with too-small/biased negative set and 1 label/class.
- Metric: kNN/prototype accuracy vs shots/comparison-set quality.
- Closing viz: (a) embedding/prototype panels across rungs (b) accuracy-vs-shots or negative-quality curve.
- Pitfall on D5: biased comparison set makes the numeric score look healthy while validation is biased; reproduce false-negative collapse, then fix by balanced negatives and held-out retrieval.
- Notes: CPU-only; no SimCLR-scale training; replace generic template.

### 17.6 — Multi-task learning   [notebook: 17.6-multi-task-learning.ipynb]   (family: F5 + budget/shift modifier)

**Lesson — Real World Applications (5):**
1. Ads ranking plus calibration — shared trunk optimizes weighted losses; lesson weights produce 0.028 + 0.027 = 0.055.
2. Autonomous driving perception — share visual features for lanes and signs but watch gradient tug-of-war.
3. Healthcare risk prediction — related tasks reduce variance, mirroring lesson link to regularization.
4. Retail forecasting — product categories teach common seasonal structure; compare 1, 2, 4, 8 tasks (illustrative).
5. Content moderation — harmful-content heads share text representations but require validation per target task.

**Notebook plan:**
- Family: F5 DL-Training + #tasks/gradient-conflict modifier
- Concept built once (D1): `weighted_multitask_loss()` computes $L=\sum_t\alpha_tL_t$ and verifies lesson values: L1=0.04, L2=0.09, alpha=0.7, total 0.055.
- Datasets D1–D5: D1 two scalar task losses from lesson · D2 clean synthetic two related tabular tasks · D3 add a mildly conflicting task · D4 digits with digit-parity and high/low-digit heads · D5 digits with an adversarial/nuisance task that conflicts with target.
- Metric: primary-task accuracy vs number/conflict of tasks.
- Closing viz: (a) shared-boundary or per-task accuracy panels (b) primary accuracy-vs-task-conflict curve.
- Pitfall on D5: shared structure is actually nuisance/negative transfer; reproduce gradient fight, then fix with task weights, partial sharing, or removing the nuisance task.
- Notes: CPU-only tiny shared MLP/logistic trunk; replace generic template.

### 17.7 — Meta-learning & few-shot (MAML, prototypical nets)   [notebook: 17.7-meta-learning-few-shot.ipynb]   (family: F5 + budget/shift modifier)

**Lesson — Real World Applications (5):**
1. Rare-disease classifiers — new task starts with support examples; lesson prototypes are c0=(-0.900,0.100), c1=(0.950,-0.100).
2. New-product tagging — rebuild classifier from 1–5 shots (illustrative) instead of retraining from scratch.
3. Robotics task adaptation — train episodes to resemble test tasks, matching lesson's episode-design warning.
4. Fraud pattern onboarding — query (0.2,0.05) is classified via prototype distances 1.2125 vs 0.5850.
5. Personalized recommendations — adapt per user from a tiny support set; use class-1 probability 0.652 as the D1 numeric check.

**Notebook plan:**
- Family: F5 DL-Training + #shots/#tasks modifier
- Concept built once (D1): `prototype_predict()` computes support means and softmax over negative distances, verifying lesson prototypes, d0^2=1.2125, d1^2=0.5850, class-1 probability 0.652.
- Datasets D1–D5: D1 lesson 2-way support/query toy · D2 clean synthetic 2-way 5-shot episodes · D3 noisy/overlapping 2-way 1-shot episodes · D4 digits few-shot classes with 5 shots · D5 digits with train/test episode mismatch and 1 shot.
- Metric: episodic accuracy vs shots/task shift.
- Closing viz: (a) support/query prototype panels per rung (b) accuracy-vs-shots curve.
- Pitfall on D5: train episodes do not resemble the few-shot test situation; reproduce episode mismatch, then fix by matching way/shot/noise in episode sampling.
- Notes: prototypical-net geometry only; CPU-only; replace generic template.

### 17.8 — Zero-shot learning   [notebook: 17.8-zero-shot-learning.ipynb]   (family: F5 + budget/shift modifier)

**Lesson — Real World Applications (5):**
1. Open-vocabulary image tagging — class description becomes classifier weight; lesson cosines are 0.970 vs 0.243.
2. Retail category launch — predict a new class before examples exist using a description vector.
3. Safety taxonomy expansion — score unseen policy labels but calibrate seen-class advantage, per lesson warning.
4. Document routing — text-defined classes use scaled cosine; lesson scale 3 gives top probability 0.898.
5. Robotics object recognition — add a new object by embedding its attributes, no retraining examples required.

**Notebook plan:**
- Family: F5 DL-Training + seen/unseen-shift modifier
- Concept built once (D1): `zeroshot_cosine()` scores $s(x,k)=\cos(f(x),a_k)$ and verifies lesson: ||x||=0.825, cosines 0.970/0.243, scale 3 top probability 0.898.
- Datasets D1–D5: D1 lesson vector x=(0.8,0.2) and two attributes · D2 clean synthetic attribute classes with one unseen class · D3 add seen-class logit bias · D4 digits described by simple attributes (round, vertical, loops) · D5 digits with multiple unseen classes and biased seen logits.
- Metric: unseen-class accuracy vs seen/unseen shift or calibration strength.
- Closing viz: (a) attribute-score/decision panels across rungs (b) unseen accuracy-vs-calibration curve.
- Pitfall on D5: seen classes inherit logit advantage/calibration failure; reproduce unseen suppression, then fix by calibrated stacking or bias correction.
- Notes: no large model downloads; CPU-only vector embeddings; replace generic template.

### 17.9 — Continual / lifelong learning   [notebook: 17.9-continual-lifelong-learning.ipynb]   (family: F1 + budget/shift modifier, gap)

**Lesson — Real World Applications (5):**
1. Personalization over time — learn task B without erasing task A; lesson EWC penalty 2.600 discourages sensitive-weight movement.
2. Fraud model refreshes — protect old patterns while adding new scams; weighted square 5.200 is the D1 protection signal.
3. Robotics skills — update sequential skills when storing all old data is impossible, matching lesson context.
4. Medical models — candidate (0.5,0.8) has smaller lesson penalty 0.689 than (0,1), so it preserves old sensitivity better.
5. Recommender drift — compare no replay vs EWC across 2, 3, 5 sequential tasks (illustrative).

**Notebook plan:**
- Family: F1 Supervised-Tabular + sequential-task-shift modifier
- Concept built once (D1): `ewc_penalty()` computes $L_B+\lambda/2\sum_iF_i(\theta_i-\theta_{A,i})^2$, verifying lesson movement penalties 2.600 for (0,1) and 0.689 for (0.5,0.8).
- Datasets D1–D5: D1 two-parameter EWC toy from lesson · D2 clean two-task Gaussian classification · D3 three sequential tasks with mild shift · D4 iris class-order continual tasks · D5 digits split tasks with no old-data storage.
- Metric: average accuracy/forgetting vs number of sequential tasks.
- Closing viz: (a) per-task decision-boundary or accuracy panels after each task (b) forgetting-vs-task-count curve.
- Pitfall on D5: new-task training overwrites weights old task needed/catastrophic forgetting; reproduce, then fix with EWC or small replay.
- Notes: gap topic—lesson body may need richer pitfall wording before implementation; CPU-only; replace generic template.

### 17.10 — Active learning   [notebook: 17.10-active-learning.ipynb]   (family: F1 + budget/shift modifier, gap)

**Lesson — Real World Applications (5):**
1. Medical annotation — query max entropy first; lesson entropies rank 0.693 above 0.673 and 0.325.
2. Legal discovery — choose labels that move the boundary instead of random labeling, using label budget 1→5→10 (illustrative).
3. Image moderation — top-two margin 0.010 flags a near-tie for review, citing lesson numbers.
4. Customer-support routing — uncertainty sampling saves annotator time but needs diversity against redundant tickets.
5. Sensor labeling — avoid outlier-only queries by combining entropy with representative sampling.

**Notebook plan:**
- Family: F1 Supervised-Tabular + query-budget modifier
- Concept built once (D1): `select_query()` computes entropy/margin and verifies lesson: H(0.9,0.1)=0.325, H(0.6,0.4)=0.673, H(0.5,0.5)=0.693, margin 0.34-0.33=0.010.
- Datasets D1–D5: D1 lesson probability vectors · D2 clean blobs with random vs uncertainty queries · D3 noisy overlap with redundancy · D4 iris pool-based labeling · D5 digits binary with outlier cluster and tiny query budget.
- Metric: accuracy vs number of queried labels.
- Closing viz: (a) decision-boundary panels with queried points highlighted (b) accuracy-vs-label-budget curve.
- Pitfall on D5: most uncertain point is redundant or an outlier; reproduce wasted queries, then fix with uncertainty plus diversity/coreset sampling.
- Notes: gap topic—author lesson detail before citing more than current numbers; CPU-only; replace generic template.

### 17.11 — Curriculum learning   [notebook: 17.11-curriculum-learning.ipynb]   (family: F1 + budget/shift modifier, gap)

**Lesson — Real World Applications (5):**
1. OCR training — start with high-margin clean characters; lesson logistic losses rise from 0.127 at margin 2 to 0.974 at margin -0.5.
2. Fraud detection — introduce hard/noisy examples gradually so exceptions do not dominate early gradients.
3. Language tutoring — order examples by difficulty; too fast is random and too slow misses hard cases, per lesson.
4. Robotics control — begin with easy states, then increase perturbation; compare pace 25%, 50%, 100% per epoch (illustrative).
5. Medical imaging — clean-then-noisy curriculum lowers early gradient variance, citing the lesson's high-margin structure.

**Notebook plan:**
- Family: F1 Supervised-Tabular + curriculum-pace/noise modifier
- Concept built once (D1): `curriculum_weights()` computes weighted loss $L(t)=\sum_iw_i(t)\ell_i$ and verifies lesson logistic losses: margins 2,1,0.2,-0.5 produce 0.127, 0.313, 0.598, 0.974.
- Datasets D1–D5: D1 four margins from lesson · D2 clean separable blobs ordered easy→hard · D3 noisy labels admitted at different paces · D4 iris ordered by margin/difficulty · D5 digits with hard/noisy examples introduced too early.
- Metric: validation accuracy vs curriculum pace/difficulty rung.
- Closing viz: (a) training-order/boundary panels per pace (b) accuracy-vs-pace curve.
- Pitfall on D5: pace too fast becomes random, too slow misses hard cases; reproduce both, then fix with validation-tuned schedule.
- Notes: gap topic—lesson content is thin; CPU-only; replace generic template.

### 17.12 — Federated learning   [notebook: 17.12-federated-learning.ipynb]   (family: F1 + budget/shift modifier, gap)

**Lesson — Real World Applications (5):**
1. Mobile keyboard prediction — keep client data local and aggregate updates; lesson counts 10,30,60 sum to 100.
2. Hospital collaboration — FedAvg weights by examples; lesson aggregate is (1.300,1.500), not unweighted (1.000,1.000).
3. Finance fraud — choose weighting by data volume, fairness, or reliability, matching lesson's subtle decision.
4. IoT maintenance — client heterogeneity grows across rounds; compare IID, mild non-IID, strong non-IID (illustrative).
5. Retail personalization — local updates adapt stores while server learns shared model, but validation must include small clients.

**Notebook plan:**
- Family: F1 Supervised-Tabular + client-heterogeneity/shift modifier
- Concept built once (D1): `fedavg()` computes $w^{r+1}=\sum_k n_k/\sum_jn_j w_k$, verifying lesson weighted aggregate (1.300,1.500) and contrasting unweighted (1.000,1.000).
- Datasets D1–D5: D1 three client vectors/counts from lesson · D2 IID synthetic clients · D3 non-IID label-skew clients · D4 iris split by client domains · D5 digits client shift with one small underrepresented client group.
- Metric: global and worst-client accuracy vs client heterogeneity.
- Closing viz: (a) client update/model panels across heterogeneity (b) accuracy-vs-client-shift curve including worst-client line.
- Pitfall on D5: aggregation overrepresents data volume and hides fairness/reliability goals; reproduce small-client failure, then fix with reweighting or personalized heads.
- Notes: gap topic—needs richer lesson authoring; CPU-only simulated clients; replace generic template.

### 17.13 — Multimodal learning (CLIP, vision-language)   [notebook: 17.13-multimodal-learning.ipynb]   (family: F5 + budget/shift modifier)

**Lesson — Real World Applications (5):**
1. Image-text search — matched pair probability is 0.988 after scale 5, citing lesson calculation.
2. Product catalog retrieval — align photo and title embeddings so either modality retrieves the other.
3. Medical image reporting — shared geometry supports image-to-text and text-to-image lookup, not late-fusion-only predictions.
4. Brand-safety creative review — text-defined classes enable zero-shot transfer, linking lesson 17.8.
5. Accessibility alt-text matching — cosine for matched pair is 0.994 vs 0.110 for mismatch in the lesson.

**Notebook plan:**
- Family: F5 DL-Training + paired-modality/domain-shift modifier
- Concept built once (D1): `clip_pair_score()` computes cosine matrix entries and softmax, verifying lesson: matched cosine 0.994, mismatch 0.110, scaled scores 4.970/0.550, matched probability 0.988.
- Datasets D1–D5: D1 one image vector and two text vectors from lesson · D2 clean synthetic paired 2-D modalities · D3 noisy/misaligned pairs · D4 digits paired with simple text attributes · D5 digits with spurious captions/domain shift and few aligned pairs.
- Metric: retrieval top-1 accuracy vs pair budget/domain shift.
- Closing viz: (a) image-text similarity heatmaps or retrieval panels across rungs (b) retrieval accuracy-vs-pair-budget/shift curve.
- Pitfall on D5: alignment term over-strengthened or spurious pairing removes useful modality-specific information; reproduce bad retrieval, then fix by balanced pairs and held-out cross-modal validation.
- Notes: no CLIP downloads; CPU-only tiny embeddings; replace generic template.
