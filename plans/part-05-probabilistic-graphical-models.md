# Part 5 — Probabilistic & Graphical Models

> Plan only — per-topic revamp plan. See ../00-MASTER-PLAN.md for the shared design & family registry (F1–F17).
> **Code style:** every notebook code cell is written one statement per line (newline-split, blank lines between logical groups) for readability — never dense, semicolon-packed one-liners. See ../00-MASTER-PLAN.md §B.4.
> Dominant family: F10 (Probabilistic-Inference).

### 5.1 — Bayesian inference foundations   [notebook: 5.1-bayesian-inference.ipynb]   (family: F10)

**Lesson — Real World Applications (5):**
1. A/B conversion updating — Beta prior plus click data; lesson numbers re-derive $\mathrm{Beta}(2,3)+7$ successes and $3$ failures $=\mathrm{Beta}(9,6)$.
2. Medical test-risk revision — prior disease probability times likelihood then evidence-normalize; illustrative 2-state table sums two unnormalized scores to evidence $p(D)$.
3. Fraud-risk scoring — transaction prior odds updated by observed features; illustrative positive class posterior normalizes two scores whose sum is $1.0$.
4. Reliability after pass/fail tests — pseudo-counts encode prior device failures; illustrative $2$ prior successes, $3$ prior failures, then $10$ observations mirrors lesson count addition.
5. Ad-quality uncertainty — posterior mean and variance drive decisions instead of MAP-only ranking; lesson pitfall cites preserving posterior variance rather than replacing it too early.

**Notebook plan:**
- Family: F10 Probabilistic-Inference
- Concept built once (D1): `bayes_update(prior, likelihood)` plus `beta_bernoulli_update(alpha,beta,s,f)` verifying lesson $\alpha=2+7=9$, $\beta=3+3=6$ and explicit evidence normalization.
- Datasets D1–D5: target/graphical-model complexity — D1 2-state disease/test target (exact, verify by hand) · D2 4-state hypothesis table · D3 bimodal discrete posterior with prior/likelihood conflict · D4 small real contingency table of clicks vs conversions · D5 higher-dim sparse categorical posterior with strong prior pseudo-counts.
- Metric: total-variation distance to exact posterior across all rungs.
- Closing viz: (a) posterior marginals vs truth panels (b) TV-error-vs-dataset-complexity curve.
- Pitfall on D5: forgetting the evidence and using unnormalized scores; reproduce scores that do not sum to $1$, then divide by evidence.
- Notes: delete dead template helpers; mark any non-lesson application counts as illustrative.

### 5.2 — Bayesian linear & logistic regression   [notebook: 5.2-bayesian-regression.ipynb]   (family: F10)

**Lesson — Real World Applications (5):**
1. Demand forecasting with intervals — prediction uses noise plus parameter uncertainty; lesson formula includes $\sigma^2+x_*^\top\Sigma x_*$.
2. Marketing lift estimation — coefficient posterior shrinks noisy features; lesson worked precision is $0.25+56=56.25$.
3. Clinical risk logistic regression — no Gaussian conjugacy, so approximate inference is needed; lesson explicitly names grid, Laplace, VI, or MCMC.
4. Sensor calibration — slope uncertainty transfers coherently to new inputs; illustrative 1-D design uses inputs $1,2,3$ like lesson arithmetic.
5. Credit default scoring — feature scaling matters because a spherical prior shrinks different units unevenly; illustrative compare two standardized coefficients.

**Notebook plan:**
- Family: F10 Probabilistic-Inference
- Concept built once (D1): `bayes_linear_regression(X,y,sigma2,prior_var)` verifying lesson precision $1/4+(1^2+2^2+3^2)/0.25=56.25$ and posterior mean/covariance.
- Datasets D1–D5: target/graphical-model complexity — D1 2-point/1-weight Gaussian regression exact · D2 4-point linear regression · D3 bimodal logistic grid posterior under separable-ish labels · D4 correlated 2-D diabetes-style regression subset · D5 higher-dim ill-conditioned design matrix.
- Metric: marginal error of posterior mean and 95% interval coverage proxy versus exact/grid reference.
- Closing viz: (a) posterior predictive bands or weight marginals vs truth panels (b) marginal-error-vs-rung curve.
- Pitfall on D5: confusing noise with parameter uncertainty; reproduce over-narrow intervals dropping one variance term, then fix with full predictive variance.
- Notes: delete factory constants; standardize D5 features to expose/fix unscaled prior caveat.

### 5.3 — Bayesian networks (directed models)   [notebook: 5.3-bayesian-networks.ipynb]   (family: F10)

**Lesson — Real World Applications (5):**
1. Diagnostic triage networks — symptoms depend on latent causes; lesson chain computes posterior $p(A=1\mid C=1)=0.354/0.450=0.787$.
2. Spam filtering with directed features — factorization avoids full joint tables; lesson compares full joint $2^3-1=7$ parameters vs BN factors $1+2+2=5$.
3. Equipment fault trees — local conditional mechanisms combine into a joint; lesson joint $0.6\cdot0.7\cdot0.8=0.336$ is the re-derivable pattern.
4. Credit-risk causal-looking diagrams — arrows define conditionals, not proof of causality; illustrative intervention replaces one conditional rather than observing a child.
5. User journey funnels — hidden summations over unobserved ancestors produce conversion marginals; lesson marginal $p(C=1)=0.450$ anchors the calculation.

**Notebook plan:**
- Family: F10 Probabilistic-Inference
- Concept built once (D1): `enumerate_bn_marginals(graph,cpts,evidence)` verifying lesson chain joint $0.336$, marginal $0.450$, and posterior $0.787$.
- Datasets D1–D5: target/graphical-model complexity — D1 tiny 3-node BN exact · D2 4-state/4-node BN · D3 explaining-away bimodal posterior · D4 small real contingency table converted to a BN · D5 higher-dim DAG with hidden ancestors and near-deterministic CPTs.
- Metric: marginal error against exact enumeration.
- Closing viz: (a) estimated vs exact marginals panels (b) marginal-error-vs-eliminated-states curve.
- Pitfall on D5: forgetting hidden summations; reproduce child-only shortcut, then fix by summing unobserved ancestors.
- Notes: avoid causal claims in text; delete dead notebook helpers.

### 5.4 — Markov random fields (undirected models)   [notebook: 5.4-mrfs.ipynb]   (family: F10)

**Lesson — Real World Applications (5):**
1. Image denoising grids — neighboring pixels prefer compatible labels; lesson aligned score $e^{0.8}=2.225541$ vs opposed $e^{-0.8}=0.449329$.
2. Spatial disease maps — adjacent regions share risk without parent direction; illustrative symmetric coupling keeps each node marginal at $0.500$ like the lesson.
3. Social affiliation smoothing — mutual compatibility is scored before global normalization; lesson partition $Z=5.349740$.
4. Part-of-speech consistency — undirected potentials reward compatible adjacent tags; illustrative 2-tag edge uses aligned/opposed potentials from lesson.
5. Error-correcting codes — parity checks define compatibility; illustrative 4-bit factor graph requires summing all valid assignments.

**Notebook plan:**
- Family: F10 Probabilistic-Inference
- Concept built once (D1): `enumerate_mrf(potentials)` verifying lesson aligned/opposed scores, $Z=5.349740$, one aligned-state probability $0.416009$, and marginal $0.500$.
- Datasets D1–D5: target/graphical-model complexity — D1 2-node binary MRF exact · D2 4-node chain · D3 bimodal ferromagnetic square · D4 correlated 2-D grid denoising toy image · D5 higher-dim grid with strong couplings.
- Metric: marginal error against exact or high-precision reference.
- Closing viz: (a) estimated vs exact node marginals / label grids panels (b) marginal-error-vs-iteration curve.
- Pitfall on D5: ignoring $Z$; reproduce raw potential “probabilities,” then fix with normalized partition-aware marginals.
- Notes: show symmetric coupling can create dependence without marginal bias; remove unused helpers.

### 5.5 — Factor graphs   [notebook: 5.5-factor-graphs.ipynb]   (family: F10)

**Lesson — Real World Applications (5):**
1. Error-correction decoders — variables connect only through parity factors; lesson shows one factor product score $0.7\cdot2.0\cdot0.4=0.560$.
2. Sensor fusion — each sensor contributes a local factor; lesson all scores sum to $1.100$ so $p(0,0)=0.509$.
3. Recommender constraints — user/item priors and compatibility factors multiply explicitly; illustrative 2-variable table follows lesson factor product.
4. Scheduling constraints — dense all-at-once factors are costly; lesson pitfall warns one large factor destroys sparsity.
5. Probabilistic programs — traces decompose into named factors; lesson message to $X=0$ is $2.0\cdot0.4+0.5\cdot0.6=1.100$.

**Notebook plan:**
- Family: F10 Probabilistic-Inference
- Concept built once (D1): `factor_product_and_messages(factors)` verifying lesson unnormalized $(0,0)=0.560$, total $1.100$, $p(0,0)=0.509$, and messages $[1.100,1.100]$.
- Datasets D1–D5: target/graphical-model complexity — D1 2-variable factor graph exact · D2 4-state chain of factors · D3 loopy/bimodal factor graph · D4 small real contingency table as unary plus pairwise factors · D5 higher-dim graph with one dense factor.
- Metric: marginal error vs exact enumeration/reference.
- Closing viz: (a) estimated vs exact factor-graph marginals panels (b) marginal-error-vs-iteration curve.
- Pitfall on D5: hiding a dense factor; reproduce memory/time blow-up, then fix by decomposing or eliminating sparsely.
- Notes: explicitly check factor shapes and broadcasting; delete dead template code.

### 5.6 — Belief propagation (sum-product, max-product)   [notebook: 5.6-belief-propagation.ipynb]   (family: F10)

**Lesson — Real World Applications (5):**
1. HMM filtering — forward messages cache repeated sums; lesson right message is $[0.340,0.620]$.
2. Error-correcting codes — messages pass along factor edges; illustrative marginal checks use sum-product not max-product.
3. Stereo vision/MRFs — loopy BP approximates pixel disparity marginals; lesson warns cycles are approximate.
4. Sequence labeling — CRFs use BP-like dynamic programs; lesson left contribution to $Y$ is $[0.620,0.380]$.
5. MAP decoding — max-product swaps sums for maxima and backpointers; lesson distinguishes marginals from MAP states.

**Notebook plan:**
- Family: F10 Probabilistic-Inference
- Concept built once (D1): `sum_product(factor_graph,evidence)` verifying lesson messages $[0.340,0.620]$, $[0.620,0.380]$, then normalized belief scores.
- Datasets D1–D5: target/graphical-model complexity — D1 3-node chain exact · D2 4-state tree · D3 single-loop loopy graph · D4 small real sequence-label contingency table · D5 higher-dim loopy grid.
- Metric: marginal error vs exact enumeration/reference.
- Closing viz: (a) estimated vs exact marginals panels (b) marginal-error-vs-iteration curve.
- Pitfall on D5: trusting loopy beliefs blindly / double-counting evidence; reproduce unstable loopy updates, then fix with tree case or damped messages and correct exclusion.
- Notes: structured-inference viz uses marginals vs truth, not samples; remove factory helpers.

### 5.7 — The junction-tree algorithm   [notebook: 5.7-junction-tree.ipynb]   (family: F10)

**Lesson — Real World Applications (5):**
1. Medical diagnosis with loops — cluster variables to recover exact marginals; lesson message from $AB$ to $B$ is $[1.1,0.9]$.
2. Reliability networks — separator consistency prevents conflicting subsystem beliefs; lesson calibrated total is $2.0$.
3. Small pedigree/genetics models — treewidth determines feasibility; lesson notes binary clique entries for $7$ variables equal $2^7=128$.
4. Legal/evidence networks — new evidence requires recalibration; illustrative evidence update changes clique potentials.
5. Computer vision patches — exact local inference works until clique size explodes; lesson pitfall is underestimating treewidth.

**Notebook plan:**
- Family: F10 Probabilistic-Inference
- Concept built once (D1): `junction_tree_calibrate(cliques,separators)` verifying lesson separator message $[1.1,0.9]$, total $2.0$, and $p(C=1)=0.650/2.0=0.325$.
- Datasets D1–D5: target/graphical-model complexity — D1 two cliques with separator exact · D2 4-state clique tree · D3 triangulated loopy cycle · D4 small real contingency table with separator variables · D5 higher-treewidth graph with $2^7=128$-entry clique.
- Metric: marginal error against exact enumeration.
- Closing viz: (a) estimated vs exact clique/separator marginals panels (b) marginal-error-vs-calibration-pass curve.
- Pitfall on D5: underestimating treewidth; reproduce exponential table growth, then fix by choosing a lower-treewidth elimination order or approximate fallback.
- Notes: check running-intersection property; no gap.

### 5.8 — Structure learning   [notebook: 5.8-structure-learning.ipynb]   (family: F10)

**Lesson — Real World Applications (5):**
1. Causal-discovery screening — edge gains must beat a score penalty; lesson BIC penalty at $n=100$ is $0.5\log100=2.303$.
2. Feature-dependency pruning — strong edge likelihood gain totals $17.774$, exceeding $2.303$ in the lesson.
3. Gene network hypotheses — weak edges lose to the same penalty; lesson names tiny likelihood gains as a pitfall.
4. Fraud graph design — dense graphs overfit; illustrative compare empty, one-edge, and two-edge DAG scores with the BIC formula.
5. Sensor dependency maps — Markov-equivalent DAGs can tie observationally; lesson warns different DAGs can encode same independences.

**Notebook plan:**
- Family: F10 Probabilistic-Inference
- Concept built once (D1): `score_graph_bic(data,graph)` verifying lesson gain per sample $0.177741$, total $17.774$, and penalty $2.303$ at $n=100$.
- Datasets D1–D5: target/graphical-model complexity — D1 2-node edge/no-edge exact · D2 4-state/3-node clean DAG · D3 conflicting/bimodal Markov-equivalent candidates · D4 small real contingency table · D5 higher-dim search space with weak spurious edges.
- Metric: structural Hamming distance or marginal predictive error across all rungs; use SHD when truth is known, predictive error on D4.
- Closing viz: (a) learned graph vs truth panels (b) score/error-vs-search-iteration curve.
- Pitfall on D5: searching greedily without safeguards and rewarding tiny likelihood gains; reproduce local trap, then fix with restarts plus BIC penalty.
- Notes: all application edge counts not in lesson are illustrative.

### 5.9 — Hidden Markov Models   [notebook: 5.9-hmms.ipynb]   (family: F10)

**Lesson — Real World Applications (5):**
1. Speech phoneme tracking — hidden state sequence inferred from noisy observations; lesson first filter normalizes $[0.54,0.08]$ to $[0.871,0.129]$.
2. Part-of-speech tagging — Viterbi path is not marginal states; lesson path example returns $[0,1,1]$.
3. User-session intent — forward scale factors recover sequence likelihood; lesson likelihood is $0.131542$.
4. Robot localization — filtering uses past, smoothing uses future; lesson notes future observations raise smoothed initial probability of state $1$.
5. Regime detection in finance — Markov transitions encode persistence; illustrative two-state transition matrix mirrors lesson notation $T_{rs}$.

**Notebook plan:**
- Family: F10 Probabilistic-Inference
- Concept built once (D1): `forward_backward_viterbi(pi,T,E,obs)` verifying lesson normalized filter $[0.871,0.129]$, likelihood $0.131542$, and Viterbi path $[0,1,1]$.
- Datasets D1–D5: target/graphical-model complexity — D1 2-state HMM exact · D2 4-state HMM · D3 ambiguous/bimodal emissions · D4 small real sequence-like contingency table · D5 longer ill-conditioned HMM with near-identical emissions.
- Metric: marginal error vs exact forward-backward.
- Closing viz: (a) estimated vs exact state-marginal panels (b) marginal-error-vs-time/iteration curve.
- Pitfall on D5: normalizing away likelihood accidentally and confusing Viterbi with marginals; reproduce lost scale factors, then fix with scaled forward messages retaining log-likelihood.
- Notes: structured-inference panels show marginals vs truth.

### 5.10 — Conditional Random Fields   [notebook: 5.10-crfs.ipynb]   (family: F10)

**Lesson — Real World Applications (5):**
1. Named-entity recognition — labels are normalized jointly over a sequence; lesson partition over $2^3=8$ label sequences is $Z(x)=47.151013$.
2. POS tagging with overlapping features — features freely inspect $x$ because CRF models $p(y\mid x)$ only.
3. Address parsing — transition rewards smooth label sequences; lesson best path $(1,1,1)$ wins because smoothness beats middle noise.
4. Protein secondary-structure labeling — local softmaxes miss coupled transitions; illustrative sequence labels use the same conditional normalization.
5. OCR word labeling — character labels benefit from consistency features; lesson pitfall says dropping transition features loses label consistency.

**Notebook plan:**
- Family: F10 Probabilistic-Inference
- Concept built once (D1): `linear_chain_crf_forward(features,weights)` verifying lesson $2^3=8$ sequences, $Z(x)=47.151013$, and best path $(1,1,1)$.
- Datasets D1–D5: target/graphical-model complexity — D1 2-label length-3 CRF exact · D2 4-state label set · D3 noisy middle-token ambiguity · D4 small real token-label table · D5 longer sequence with strong/conflicting transitions.
- Metric: marginal error vs exact forward-backward, plus path accuracy as secondary only.
- Closing viz: (a) estimated vs exact token-label marginals panels (b) marginal-error-vs-sequence-length curve.
- Pitfall on D5: using local softmaxes independently; reproduce per-token normalization failure, then fix with global $Z(x)$.
- Notes: do not introduce generative $p(x)$; delete template helpers.

### 5.11 — Kalman filters   [notebook: 5.11-kalman-filters.ipynb]   (family: F10)

**Lesson — Real World Applications (5):**
1. Vehicle GPS tracking — Kalman gain weights prediction vs measurement; lesson $K=1.2/(1.2+0.5)=0.705882$.
2. Warehouse robot localization — updated mean after measurement is $0+0.705882(1.4)=0.988235$ from lesson.
3. Financial trend smoothing — process noise must be added before update; lesson prediction variance $P^-=1+0.2=1.200$.
4. Wearable sensor fusion — updated variance shrinks to $(1-0.705882)1.2=0.352941$ in lesson arithmetic.
5. Radar target tracking — nonlinear dynamics need extensions or particles; lesson pitfall says unchanged Kalman breaks Gaussian closure.

**Notebook plan:**
- Family: F10 Probabilistic-Inference
- Concept built once (D1): `kalman_filter_1d(A,H,Q,R,measurements)` verifying lesson $P^-=1.200$, $K=0.705882$, updated mean $0.988235$, variance $0.352941$.
- Datasets D1–D5: target/graphical-model complexity — D1 1-D 2-step linear Gaussian exact · D2 4-time-step constant velocity · D3 bimodal/non-Gaussian observation noise · D4 correlated 2-D tracking trace · D5 nonlinear or ill-conditioned noise mismatch.
- Metric: marginal mean/covariance error vs exact/simulation truth.
- Closing viz: (a) filtered estimates vs true trajectory panels (b) RMSE/marginal-error-vs-time curve.
- Pitfall on D5: tuning $Q$ and $R$ by feel and forgetting prediction uncertainty; reproduce lag/jitter, then fix by calibrated noise and adding process noise before update.
- Notes: F10 visualization may be filtered marginals vs truth rather than samples.

### 5.12 — Particle filters   [notebook: 5.12-particle-filters.ipynb]   (family: F10)

**Lesson — Real World Applications (5):**
1. Robot localization — particles approximate a nonlinear posterior; lesson weights satisfy $w_i\propto\mathcal N(1.2;x_i,0.3)$ then normalize to sum $1$.
2. Object tracking in video — posterior estimate is weighted average $\sum_i w_ix_i$, lesson says it lies between $1.0$ and $1.3$.
3. Weather/data assimilation — effective sample size $1/\sum_i w_i^2$ diagnoses collapse from the lesson.
4. Mobile-device navigation — resampling fights weight collapse but reduces diversity; illustrative compare ESS before/after resampling.
5. Epidemiological state filtering — proposals must reach high-likelihood regions; lesson pitfall says weighting cannot rescue missing particles.

**Notebook plan:**
- Family: F10 Probabilistic-Inference
- Concept built once (D1): `particle_filter(particles,transition,likelihood,resample)` verifying lesson normalized Gaussian weights, weighted mean between $1.0$ and $1.3$, and ESS formula.
- Datasets D1–D5: target/graphical-model complexity — D1 2-state/1-D exact filtering target · D2 4-state particle approximation · D3 bimodal nonlinear observation · D4 correlated 2-D tracking trace · D5 higher-dim narrow-proposal filter.
- Metric: ESS and marginal error versus exact/grid reference.
- Closing viz: (a) particles/marginals vs truth panels (b) ESS-or-error-vs-time curve.
- Pitfall on D5: letting weights degenerate and using too narrow a proposal; reproduce ESS collapse, then fix with adaptive noise/resampling.
- Notes: retain deterministic seed; no large downloads.

### 5.13 — Dynamic Bayesian networks   [notebook: 5.13-dynamic-bayesian-networks.ipynb]   (family: F10)

**Lesson — Real World Applications (5):**
1. Activity recognition — repeated two-slice templates share transition structure; lesson one-step prediction is $[0.7,0.3]T=[0.635,0.365]$.
2. Equipment health monitoring — tied binary transition parameters are $2$ instead of untied $(10-1)\cdot2=18$ at $T=10$ from lesson.
3. Traffic-state estimation — filtering, prediction, and smoothing answer different timing questions; lesson pitfall names evidence timing.
4. Patient-state progression — slice must include all future-relevant variables; illustrative add vitals variable to satisfy Markov property.
5. Ad-funnel temporal modeling — sensor evidence multiplies predicted state vector then renormalizes each slice as in lesson.

**Notebook plan:**
- Family: F10 Probabilistic-Inference
- Concept built once (D1): `dbn_filter(two_slice_template,evidence)` verifying lesson prediction $[0.635,0.365]$, tied vs untied parameter counts $2$ vs $18$, and evidence renormalization.
- Datasets D1–D5: target/graphical-model complexity — D1 2-state two-slice DBN exact · D2 4-state DBN · D3 ambiguous/bimodal evidence sequence · D4 small real temporal contingency table · D5 higher-dim DBN with insufficient-state failure.
- Metric: marginal error vs exact unrolled inference.
- Closing viz: (a) estimated vs exact slice marginals panels (b) marginal-error-vs-time curve.
- Pitfall on D5: making the state too small / unrolling without tying; reproduce biased predictions, then fix with sufficient state and shared parameters.
- Notes: structured-inference topic; use estimated vs exact marginals.

### 5.14 — Gaussian Processes   [notebook: 5.14-gaussian-processes.ipynb]   (family: F10)

**Lesson — Real World Applications (5):**
1. Bayesian optimization — kernel controls uncertainty away from observed points; lesson RBF covariance at distance $2$ with $\ell=1$ is $e^{-2}=0.135335$.
2. Spatial interpolation — nearby inputs share function values through $K_{ij}=k(x_i,x_j)$; illustrative distance $1$ covariance changes with $\ell$ as lesson notes.
3. Calibration curves — posterior variance subtracts explained covariance from prior variance $1$ per lesson.
4. Small-data regression — posterior mean uses $K_{*X}(K_{XX}+0.1I)^{-1}y$ from lesson.
5. Sensor-field mapping — exact conditioning has cubic cost; lesson pitfall warns matrix solves scale poorly.

**Notebook plan:**
- Family: F10 Probabilistic-Inference
- Concept built once (D1): `gp_posterior(X,y,Xstar,kernel,sigma2)` verifying lesson RBF $e^{-2}=0.135335$, noise $0.1$, posterior mean solve, and variance subtraction.
- Datasets D1–D5: target/graphical-model complexity — D1 2-point GP exact · D2 4-point smooth function · D3 bimodal/nonstationary sample · D4 correlated 2-D small real-ish surface · D5 higher-dim ill-conditioned kernel matrix.
- Metric: marginal predictive mean/variance error vs exact/reference.
- Closing viz: (a) posterior samples/bands vs truth panels (b) marginal-error-or-NLL-vs-rung curve.
- Pitfall on D5: choosing length-scale carelessly and ignoring cubic/conditioning cost; reproduce over/under-smooth posterior, then fix by length-scale sweep plus jitter.
- Notes: keep D5 small enough for CPU; mark synthetic surfaces illustrative.

### 5.15 — The EM algorithm (general)   [notebook: 5.15-em.ipynb]   (family: F10)

**Lesson — Real World Applications (5):**
1. Mixture clustering — hidden component labels are soft responsibilities; lesson first sequence responsibility is near $1$ for the high-bias coin because $0.8^8 0.2^2$ dwarfs $0.3^8 0.7^2$.
2. HMM training — Baum-Welch alternates expected counts and parameter updates; lesson M-step uses $\theta_k=\sum_i r_{ik}h_i/(10\sum_i r_{ik})$.
3. Missing-data imputation — expected sufficient statistics replace hard fills; illustrative one missing Bernoulli contributes a probability not $0/1$.
4. Topic-model fitting — observed log-likelihood should not decrease after each update; lesson states one update is no smaller than before.
5. Coin-bias estimation — complete-data likelihood is not the guaranteed diagnostic; lesson pitfall says observed likelihood is.

**Notebook plan:**
- Family: F10 Probabilistic-Inference
- Concept built once (D1): `em_latent_coin(sequences,K)` verifying lesson responsibility contrast, M-step formula, and observed log-likelihood nondecrease.
- Datasets D1–D5: target/graphical-model complexity — D1 2-coin tiny exact latent target · D2 4-state mixture · D3 overlapping/bimodal mixture · D4 small real contingency table with missing labels · D5 higher-dim mixture with bad initialization.
- Metric: marginal responsibility error or observed log-likelihood gap vs reference.
- Closing viz: (a) responsibilities/cluster marginals vs truth panels (b) log-likelihood/error-vs-iteration curve.
- Pitfall on D5: expecting global optimality and hardening responsibilities too soon; reproduce local optimum, then fix with soft E-step and multiple starts.
- Notes: avoid claiming EM samples; it optimizes latent-variable likelihood.

### 5.16 — Variational inference   [notebook: 5.16-variational-inference.ipynb]   (family: F10)

**Lesson — Real World Applications (5):**
1. Topic-model scaling — replace exact posterior with tractable $q$; lesson ELBO identity decomposes $\log p(x)$ into ELBO plus KL.
2. Bayesian A/B dashboards — fast approximate posterior can be biased; lesson example has ELBO $-0.186098$ and KL gap $0.186098$ for $p=[0.1,0.3,0.6]$, $q=[0.2,0.5,0.3]$.
3. Probabilistic-program inference — optimize a family when exact inference is unavailable; lesson ties VI to probabilistic programming.
4. Sparse latent-factor models — mean-field outer products miss correlations; lesson pitfall says family bias cannot represent posterior correlations.
5. Multimodal risk models — $\mathrm{KL}(q\|p)$ can under-cover modes; lesson explicitly warns about KL direction.

**Notebook plan:**
- Family: F10 Probabilistic-Inference
- Concept built once (D1): `fit_variational_categorical(p, family)` verifying lesson ELBO $-0.186098$, KL gap $0.186098$, and optimum when unrestricted $q=p$.
- Datasets D1–D5: target/graphical-model complexity — D1 2-state target exact · D2 4-state categorical · D3 bimodal posterior · D4 correlated 2-D posterior grid · D5 higher-dim correlated/ill-conditioned posterior.
- Metric: total-variation or KL/marginal error vs exact posterior; use TV for plots.
- Closing viz: (a) variational marginals vs truth panels (b) TV-error-vs-optimization-iteration curve.
- Pitfall on D5: forgetting family bias / confusing KL directions; reproduce mean-field under-coverage, then fix with richer family or compare reverse/forward KL.
- Notes: stochastic ELBO estimates must use enough samples or exact D1-D4 sums.

### 5.17 — Stochastic variational inference   [notebook: 5.17-svi.ipynb]   (family: F10)

**Lesson — Real World Applications (5):**
1. Large topic models — minibatches stand in for full corpora; lesson scales a batch of size $4$ by $10/4=2.5$.
2. Streaming click models — global parameters damp noisy updates; lesson with $\rho=0.3$ gives $0.7[1,1]+0.3[8.5,3.5]=[3.25,1.75]$.
3. Online Bayesian dashboards — full ten Bernoulli observations with seven successes update to $[8,4]$ in lesson.
4. Federated-ish analytics — larger minibatches reduce variance; lesson explicitly notes minibatch size affects variance.
5. Probabilistic programs at scale — step-size schedule $\rho_t=(t+\tau)^{-\kappa}$ controls convergence; lesson pitfall warns constant large steps bounce.

**Notebook plan:**
- Family: F10 Probabilistic-Inference
- Concept built once (D1): `svi_beta_bernoulli_minibatch(data,N,rho)` verifying lesson full update $[8,4]$, scaled minibatch $[8.5,3.5]$, and damped update $[3.25,1.75]$.
- Datasets D1–D5: target/graphical-model complexity — D1 2-state Bernoulli exact · D2 4-state categorical global parameter · D3 noisy/bimodal minibatches · D4 small real click/conversion table · D5 higher-dim sparse minibatches with bad schedule.
- Metric: marginal parameter error vs full-batch VI/reference.
- Closing viz: (a) SVI marginals vs full-data truth panels (b) marginal-error-vs-iteration curve.
- Pitfall on D5: forgetting minibatch scaling and using a constant large step; reproduce biased/bouncing path, then fix with scaling and decaying $\rho_t$.
- Notes: use averaged held-out diagnostics, not one minibatch ELBO.

### 5.18 — Expectation propagation   [notebook: 5.18-expectation-propagation.ipynb]   (family: F10)

**Lesson — Real World Applications (5):**
1. Bayesian classification with non-Gaussian likelihoods — local sites approximate hard factors; lesson site precisions add $1/2+1/3=0.833333$.
2. Gaussian-process classification — EP moment-matches one likelihood factor at a time; lesson global variance is $1/0.833333=1.200$.
3. Sensor fusion with outlier factors — cavity removes old site before adding true factor; lesson cavity after removing site 2 has variance $2.000$ and mean $0.000$.
4. Approximate message passing — site natural parameters combine into a global approximation; lesson global mean is $(1/3)/0.833333=0.400$.
5. Real-time risk inference — damping prevents oscillation; lesson pitfall says undamped updates can destabilize EP.

**Notebook plan:**
- Family: F10 Probabilistic-Inference
- Concept built once (D1): `ep_site_update(sites, factor)` verifying lesson precision $0.833333`, variance $1.200`, mean $0.400`, cavity variance $2.000`, and tilted moments.
- Datasets D1–D5: target/graphical-model complexity — D1 2-site Gaussian exact · D2 4-site approximate posterior · D3 bimodal/non-log-concave factor · D4 correlated 2-D small posterior · D5 higher-dim ill-conditioned EP with oscillations.
- Metric: marginal moment error vs numerical integration/reference.
- Closing viz: (a) EP marginals vs truth panels (b) moment-error-vs-site-update curve.
- Pitfall on D5: skipping the cavity and undamped updates; reproduce double-counting/oscillation, then fix with cavity computation and damping.
- Notes: state that convergence is empirical, not guaranteed.

### 5.19 — Sampling (rejection, importance)   [notebook: 5.19-sampling.ipynb]   (family: F10)

**Lesson — Real World Applications (5):**
1. Bayesian expectation estimation — importance weights correct proposal draws; lesson ratios are $[0.4,0.8,1.6,1.2]$.
2. Rare-event simulation — rejection envelope controls acceptance; lesson $M=1.6$ gives acceptance $1/1.6=0.625$.
3. Off-policy evaluation — bad proposals produce high-variance weights; lesson says ESS falls below $3$ out of $4$.
4. Rendering/integration — Monte Carlo estimates $E_p[h(X)]$ via samples from $q$; lesson estimate of $E[X]$ is $1.900$.
5. Particle-filter proposals — missing support cannot be fixed by weights; lesson pitfall states if $q(x)=0$ where $p(x)>0$, correction fails.

**Notebook plan:**
- Family: F10 Probabilistic-Inference
- Concept built once (D1): `importance_estimate(target,proposal,h)` and `rejection_sample` verifying lesson ratios, $M=1.6$, acceptance $0.625$, estimate $1.900$, and ESS.
- Datasets D1–D5: target/graphical-model complexity — D1 2-state target exact · D2 4-state target/proposal · D3 bimodal target with poor proposal · D4 correlated 2-D target · D5 higher-dim target with missing/near-missing proposal support.
- Metric: ESS and absolute expectation error; plot normalized error.
- Closing viz: (a) samples/weighted marginals vs truth panels (b) error-vs-sample-size curve.
- Pitfall on D5: proposal with missing support and high-variance weights; reproduce failure, then fix with heavier-tailed/mixture proposal.
- Notes: avoid hardcoded asserts; use tolerance with deterministic seed.

### 5.20 — MCMC: Metropolis–Hastings & Gibbs   [notebook: 5.20-mcmc.ipynb]   (family: F10)

**Lesson — Real World Applications (5):**
1. Bayesian posterior simulation — MH works with unnormalized targets; lesson move state $1\to2$ accepts with $\min(1,0.4/0.2)=1$.
2. Image-label Gibbs sampling — conditionals update variables one at a time; lesson $p(X=1\mid Y=1)=4/(1+4)=0.800$.
3. Hierarchical marketing models — long-run frequencies approximate $[0.1,0.2,0.4,0.3]$ from lesson target.
4. Epidemiological uncertainty — burn-in reduces initialization bias; lesson pitfall names burn-in and mixing.
5. Bayesian network inference — asymmetric proposals require the $q$ ratio; lesson formula includes $q(x\mid x')/q(x'\mid x)$.

**Notebook plan:**
- Family: F10 Probabilistic-Inference
- Concept built once (D1): `metropolis_hastings(pi,q)` plus `gibbs_step(conditionals)` verifying lesson acceptance $1$, target frequencies $[0.1,0.2,0.4,0.3]$, and Gibbs conditional $0.800$.
- Datasets D1–D5: target/graphical-model complexity — D1 2-state target exact · D2 4-state discrete target · D3 bimodal target with valley · D4 correlated 2-D posterior · D5 higher-dim poorly mixing target.
- Metric: total-variation distance and ESS across iterations.
- Closing viz: (a) samples-or-marginals vs truth panels (b) TV-error-vs-iteration curve.
- Pitfall on D5: ignoring burn-in and mixing / dropping proposal asymmetry; reproduce biased chain, then fix with burn-in, better proposal, and correct MH ratio.
- Notes: distinguish distribution estimates from MAP optimization.

### 5.21 — Hamiltonian Monte Carlo & NUTS   [notebook: 5.21-hmc-nuts.ipynb]   (family: F10)

**Lesson — Real World Applications (5):**
1. Bayesian hierarchical regression — gradients move far with high acceptance; lesson leapfrog changes energy by less than $0.01$ so acceptance exceeds $0.99$.
2. Probabilistic programming backends — NUTS chooses trajectory length; lesson says it stops when displacement dot momentum becomes negative.
3. Pharmacokinetic posterior inference — step size controls divergences; lesson pitfall says too-large step collapses acceptance.
4. Logistic regression uncertainty — HMC avoids random-walk behavior; lesson half-step $p_{1/2}=0.3-0.1\cdot1=0.2$.
5. Spatial Bayesian models — mass matrix/geometry matters; illustrative correlated Gaussian exposes random-walk vs gradient trajectories.

**Notebook plan:**
- Family: F10 Probabilistic-Inference
- Concept built once (D1): `leapfrog(q,p,grad_U,epsilon,L)` verifying lesson $p_{1/2}=0.2$, $q_1=1+0.2\cdot0.2=1.040$, energy change $<0.01$, and acceptance $>0.99$.
- Datasets D1–D5: target/graphical-model complexity — D1 1-D/2-state-equivalent Gaussian target exact · D2 4-D diagonal Gaussian · D3 bimodal continuous target · D4 correlated 2-D banana/Gaussian target · D5 higher-dim ill-conditioned posterior.
- Metric: ESS per gradient evaluation and marginal error vs truth.
- Closing viz: (a) HMC samples vs target contours/marginals panels (b) marginal-error-or-ESS-vs-iteration curve.
- Pitfall on D5: choosing step size too large / ignoring divergences; reproduce energy-error divergence, then fix with smaller step or NUTS-style stop/adaptation.
- Notes: keep pure NumPy implementation; no PyMC dependency unless already present.

### 5.22 — Nonparametric Bayes & Dirichlet processes   [notebook: 5.22-dirichlet-processes.ipynb]   (family: F10)

**Lesson — Real World Applications (5):**
1. Customer segmentation — new cluster probability remains available; lesson counts $[3,1]$ with $\alpha=2$ give $[0.500,0.167,0.333]$.
2. Topic discovery with unknown $K$ — expected clusters grow with data; lesson says at $n=100$ expected clusters are between $8$ and $9$.
3. Fraud-pattern discovery — finite data occupies finitely many clusters; lesson pitfall warns not to say infinite clusters in the data.
4. Protein-family clustering — base distribution shapes novel clusters; lesson predictive mean is $(3\cdot0.2+1\cdot0.8+2\cdot0.5)/6=0.400$.
5. Image-object discovery — concentration changes new-cluster tendency; lesson new-cluster probability after $n$ customers is $2/(2+n)$.

**Notebook plan:**
- Family: F10 Probabilistic-Inference
- Concept built once (D1): `crp_predictive(counts,alpha,base_mean)` verifying lesson probabilities $[0.500,0.167,0.333]$, new-cluster $2/(2+n)$, expected clusters $8$-$9$ at $n=100$, and predictive mean $0.400$.
- Datasets D1–D5: target/graphical-model complexity — D1 2-cluster CRP exact · D2 4-state seating sequence · D3 bimodal mixture with new-cluster ambiguity · D4 small real-ish 2-D clustering table · D5 higher-dim over/under-concentrated DP mixture.
- Metric: marginal cluster-assignment error / TV over predictive probabilities.
- Closing viz: (a) cluster predictive marginals or samples vs truth panels (b) predictive-TV-vs-customer-count curve.
- Pitfall on D5: overreading $\alpha$ and ignoring base distribution; reproduce too many/poor novelty clusters, then fix by sensitivity sweep of $\alpha$ and base measure.
- Notes: mark “expected clusters” as lesson-cited; synthetic data illustrative.

### 5.23 — Latent Dirichlet Allocation & topic models   [notebook: 5.23-lda.ipynb]   (family: F10)

**Lesson — Real World Applications (5):**
1. News topic exploration — documents mix topics; lesson document-topic mean is $[8+0.5,2+0.5]/11=[0.772727,0.227273]$.
2. Search-query clustering — topic-word rows normalize counts plus $\eta=0.1$ per lesson.
3. Customer-support routing — Gibbs conditionals combine document-topic count and topic-word probability; lesson states that proportional form.
4. Scientific-literature maps — topics need human validation; lesson pitfall says topics are probability vectors, not guaranteed semantic concepts.
5. Ad keyword organization — label switching means topic numbers have no inherent identity across runs; lesson pitfall names label switching.

**Notebook plan:**
- Family: F10 Probabilistic-Inference
- Concept built once (D1): `lda_collapsed_gibbs_step(doc_counts,topic_word_counts,alpha,eta)` verifying lesson document-topic mean $[0.772727,0.227273]$, row normalization with $\eta=0.1$, and Gibbs proportional conditional.
- Datasets D1–D5: target/graphical-model complexity — D1 2-topic tiny corpus exact · D2 4-topic clean synthetic corpus · D3 overlapping/bimodal vocabulary · D4 small real bundled text snippets or inline corpus · D5 higher-dim sparse corpus with label switching.
- Metric: marginal topic-mixture error / held-out perplexity consistently across rungs.
- Closing viz: (a) estimated vs exact topic/document marginals panels (b) perplexity-or-marginal-error-vs-iteration curve.
- Pitfall on D5: setting $\alpha$ too large and ignoring label switching; reproduce diffuse topics / swapped IDs, then fix with smaller $\alpha$ and post-hoc topic alignment.
- Notes: no external corpus download; inline tiny real snippets if needed.

### 5.24 — Probabilistic programming   [notebook: 5.24-probabilistic-programming.ipynb]   (family: F10)

**Lesson — Real World Applications (5):**
1. Medical generative stories — write latent disease then observed test; lesson evidence for $y=1$ is $0.7\cdot0.1+0.3\cdot0.8=0.310$.
2. A/B latent-quality models — posterior trace weights condition random choices; lesson posterior $p(z=1\mid y=1)=0.24/0.31=0.774194$.
3. Reliability simulations — prior program draws $p(z,y)$, but inference conditions on observations; lesson pitfall distinguishes simulation from inference.
4. Probabilistic robotics — trace joint table is prior times likelihood and sums to $1$ in the lesson.
5. Bayesian workflow automation — HMC/VI inherit program geometry; lesson pitfall says bad geometry hurts inference.

**Notebook plan:**
- Family: F10 Probabilistic-Inference
- Concept built once (D1): `enumerate_traces(model,observations)` verifying lesson evidence $0.310$, posterior $0.774194$, trace joint normalization, and posterior predictive trace weighting.
- Datasets D1–D5: target/graphical-model complexity — D1 2-trace Bernoulli program exact · D2 4-trace latent program · D3 bimodal branch program · D4 correlated 2-D small model with observations · D5 higher-dim program with impossible observations or bad geometry.
- Metric: total-variation distance between inferred and exact trace posterior.
- Closing viz: (a) trace posterior marginals vs truth panels (b) TV-error-vs-inference-iteration curve.
- Pitfall on D5: hiding impossible observations and confusing simulation with inference; reproduce zero-likelihood collapse, then fix with observation checks and conditioned enumeration/sampling.
- Notes: implement a tiny pedagogical PPL by functions/traces, not a heavyweight dependency.
