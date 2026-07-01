# Part 6 — Deep Learning Foundations

> Plan only — per-topic revamp plan. See ../00-MASTER-PLAN.md for the shared design & family registry (F1–F17).
> **Code style:** every notebook code cell is written one statement per line (newline-split, blank lines between logical groups) for readability — never dense, semicolon-packed one-liners. See ../00-MASTER-PLAN.md §B.4.
> Dominant family: F5 (DL-Training).

### 6.1 — The perceptron & MLPs   [notebook: 6.1-perceptron-mlps.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Credit-risk triage — a 2-input affine gate can be hand-checked on lesson x=[1.5,-0.5] (lesson).
2. Ad click prediction — XOR D1 has 4 points, showing why one perceptron is insufficient (D1).
3. Medical tabular screening — hidden width 128 implies d*128*4 activation bytes (lesson).
4. Quality inspection — softmax turns class logits into 3-class probabilities on D3 (D3).
5. Retail image classification — digits/fashion rungs use 10 labels; numbers illustrative for D5.

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `mlp_forward(x)`; verify the lesson affine score/hidden activation z=W x+b, h=phi(z) on x=[1.5,-0.5] and 4-point XOR.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: accuracy — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val accuracy curves
- Pitfall on D5: Treating the design as magic: show the affine+nonlinear gate failing/succeeding, then expose activations and gradients.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads.

### 6.2 — The universal approximation theorem   [notebook: 6.2-universal-approximation.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Sensor calibration — approximate a 1D nonlinear response with m hidden units (lesson formula).
2. Speech command boundary — more units reduce approximation error; width values illustrative.
3. Fraud rules — XOR's 4 points demonstrate non-linear composability (D1).
4. Robot control lookup — continuous policies use sums of basis-like activations (lesson).
5. Demand curve fitting — validation accuracy/loss vs width is re-derivable from the notebook.

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `wide_mlp(width)`; verify the lesson sum of m nonlinear units by fitting XOR first with too-small then wider hidden layers.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: accuracy — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val accuracy curves
- Pitfall on D5: Confusing local improvement with global learning: a wider approximator still needs enough training/validation checks.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads.

### 6.3 — Activation functions (sigmoid, tanh, ReLU, GELU, softmax)   [notebook: 6.3-activation-functions.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Recommendation scoring — softmax denominators sum over K classes; D3 uses K=3 (D3).
2. Vision ReLU stacks — compare five activations named in title (5-way sweep).
3. Medical risk logits — sigmoid saturation is visible from z on lesson x=[1.5,-0.5].
4. Language token choice — probabilities must sum to 1 by softmax formula (lesson).
5. Fraud detection — GELU/ReLU curves compared across the same 5 datasets (illustrative).

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `activation_sweep(phi)`; verify the lesson h=phi(z) and softmax on D1 logits; keep the net fixed and vary sigmoid/tanh/ReLU/GELU/softmax.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: accuracy — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val accuracy curves
- Pitfall on D5: Ignoring scale: saturated sigmoid/tanh gradients on D5, fixed by ReLU/GELU plus normalized inputs.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads; component topic, so hold the small net fixed and vary only this component across D1–D5.

### 6.4 — Backpropagation   [notebook: 6.4-backpropagation.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Ad ranking — each loss gradient moves weights by one chain-rule path (lesson).
2. Robotics control — one wrong derivative changes all downstream updates (lesson formula).
3. Medical imaging — D4 digits has 10 outputs, so backprop touches 10 logits (D4).
4. Manufacturing QA — D1 hand pass checks dL/dW before automation (4 XOR points).
5. Forecasting classifiers — train/val curves show whether repeated steps generalize (lesson pitfall).

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `manual_backprop_step()`; verify the lesson chain-rule gradient dL/dW1 on one XOR point before using autograd on all datasets.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: loss — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val loss curves
- Pitfall on D5: Confusing local improvement with global learning: one correct gradient step can overfit; fix with validation curves.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads.

### 6.5 — Automatic differentiation & computational graphs   [notebook: 6.5-automatic-differentiation.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Compiler/autograd systems — reverse accumulation sums child contributions (lesson formula).
2. Finance models — a 2-layer graph on D1 exposes every operation (4 points).
3. Medical pipelines — finite-difference checks catch silent graph disconnects (illustrative).
4. Vision training — D5 cached subset keeps graph inspection CPU-sized (few hundred illustrative).
5. Scientific ML — graph nodes map formulas to reusable computation (lesson).

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `autograd_graph(model)`; verify the lesson reverse accumulation bar-v=sum child bar-u du/dv against a hand two-layer XOR graph.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: loss — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val loss curves
- Pitfall on D5: Treating the design as magic: print graph nodes and gradient tensors, then compare with finite differences.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads.

### 6.6 — Loss functions (MSE, cross-entropy, hinge, contrastive, triplet)   [notebook: 6.6-loss-functions.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Spam filtering — cross-entropy uses -sum y log p; K=3 on D3 (lesson/D3).
2. Regression sensors — MSE averages n squared errors (lesson formula).
3. Margin ranking — hinge loss compares score gaps (title).
4. Face/asset matching — contrastive/triplet losses compare pairs/triples (title: 2/3 items).
5. Fashion classification — same D5 labels use one chosen loss for all rungs.

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `loss_sweep(loss_name)`; verify the lesson CE=-sum y log p and MSE on D1 logits; reuse the same classifier with CE/MSE/hinge where appropriate.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: loss — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val loss curves
- Pitfall on D5: Ignoring scale: logits/probabilities mismatch on D5, fixed by stable softmax and consistent targets.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads.

### 6.7 — SGD, Momentum, Nesterov   [notebook: 6.7-sgd-momentum-nesterov.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Ad model training — momentum keeps velocity v_t across steps (lesson formula).
2. Robotics policy updates — Nesterov lookahead mitigates overshoot (title).
3. Tiny education demo — one scalar D1 update is hand-recomputed (4 points).
4. Vision classifier — compare SGD/momentum/Nesterov across 5 datasets (D1-D5).
5. Large-batch service training — lr and mu values are illustrative, reported in curves.

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `optimizer_sweep(momentum)`; verify the lesson velocity update v_t=mu v_{t-1}-eta g_t, theta_t=theta_{t-1}+v_t on one scalar XOR weight.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: accuracy — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val accuracy curves
- Pitfall on D5: Confusing local improvement with global learning: momentum overshoots on D5, fixed by lower lr or Nesterov comparison.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads; component topic, so hold the small net fixed and vary only this component across D1–D5.

### 6.8 — AdaGrad, RMSProp, Adam, AdamW   [notebook: 6.8-adaptive-optimizers.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Sparse ads features — AdaGrad adapts per-coordinate history (title).
2. Noisy sensor models — RMSProp smooths squared gradients (title).
3. Vision classifiers — Adam/AdamW compared on D4/D5 with same net (D4/D5).
4. Text classifiers — AdamW separates weight decay from gradient step (title).
5. Toy debugging — D1 scalar m_t/v_t calculation is re-derivable (lesson).

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `adaptive_optimizer_sweep()`; verify the lesson m_t/v_t adaptive step on the same D1 weight; hold the small net fixed and vary optimizer.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: accuracy — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val accuracy curves
- Pitfall on D5: Ignoring scale: adaptive methods hide bad feature scale on D5, fixed by normalization plus AdamW weight decay.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads; component topic, so hold the small net fixed and vary only this component across D1–D5.

### 6.9 — Lion, LAMB & large-batch optimizers   [notebook: 6.9-lion-lamb-large-batch.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Foundation-model pretraining — LAMB trust ratio uses ||theta||/||u|| (lesson).
2. Large-batch vision — compare tiny vs larger batches; batch sizes illustrative.
3. Edge recommender retraining — Lion sign step stores less update state (title/lesson).
4. D1 teaching demo — one sign(m_t) update on XOR is hand-checkable (4 points).
5. D5 CPU simulation — few-hundred fashion subset avoids real large-batch downloads.

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `large_batch_optimizer_sweep()`; verify the lesson sign step/trust ratio with a scalar update before comparing tiny vs larger batches.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: accuracy — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val accuracy curves
- Pitfall on D5: Confusing local improvement with global learning: large batch converges smoothly but generalizes worse; fix with lr scaling/warmup.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads; component topic, so hold the small net fixed and vary only this component across D1–D5.

### 6.10 — Second-order methods for DL (K-FAC)   [notebook: 6.10-second-order-kfac.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Vision fine-tuning — K-FAC preconditions layer gradients (lesson).
2. Robotics dynamics — 2x2 curvature block is hand-invertible (illustrative).
3. Medical classifier — block approximations trade accuracy for memory (lesson pitfall).
4. Ad ranking — compare first-order vs preconditioned loss curves on 5 rungs.
5. D5 fashion — curvature storage grows with layer shape; report bytes illustrative.

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `preconditioned_step()`; verify the lesson curvature-preconditioned update Delta W≈-eta A^{-1}GS^{-1} on a 2x2 toy layer.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: loss — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val loss curves
- Pitfall on D5: Forgetting shape and memory: curvature blocks grow quickly on D5; fix with diagonal/block approximations.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads; component topic, so hold the small net fixed and vary only this component across D1–D5.

### 6.11 — Weight initialization (Xavier, He, orthogonal, LSUV)   [notebook: 6.11-weight-initialization.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Computer vision — He init matches ReLU variance 2/fan_in (lesson).
2. Tabular MLPs — Xavier uses 2/(fan_in+fan_out) (lesson).
3. Speech models — orthogonal init preserves signal norms (title).
4. Manufacturing QA — LSUV rescales layer outputs before training (title).
5. D1 XOR — fan_in=2 is hand-computable for the first layer (D1).

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `init_sweep(init)`; verify lesson Xavier/He variance using fan_in/fan_out on D1; hold the net fixed and vary initialization.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: accuracy — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val accuracy curves
- Pitfall on D5: Ignoring scale: too-small/too-large initial activations kill D5 learning, fixed by He/Xavier/LSUV.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads; component topic, so hold the small net fixed and vary only this component across D1–D5.

### 6.12 — Dropout & DropConnect   [notebook: 6.12-dropout-dropconnect.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Image classification — dropout masks hidden units with Bernoulli(q) (lesson).
2. Ad prediction — inverted dropout divides by q, preserving expectation (lesson).
3. Robust small-data medical models — vary q over 5 datasets (illustrative).
4. Network pruning proxy — DropConnect masks weights instead of activations (title).
5. D5 fashion — overfit gap is visible in train/val curves (few hundred illustrative).

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `regularizer_sweep(dropout_p)`; verify lesson inverted dropout h~=m*h/q with q on a four-hidden-unit D1 pass; vary only dropout/dropconnect.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: accuracy — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val accuracy curves
- Pitfall on D5: Confusing local improvement with global learning: dropout hurts underfit D1 but helps D5 overfit, fixed by tuning q.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads; component topic, so hold the small net fixed and vary only this component across D1–D5.

### 6.13 — Weight decay & early stopping   [notebook: 6.13-weight-decay-early-stopping.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Fraud models — weight decay multiplies theta by (1-eta lambda) (lesson).
2. Medical imaging — early stopping chooses the best validation epoch (title).
3. Ad CTR models — decay and patience are swept with the same architecture.
4. D1 XOR — one theta shrinkage update is hand-recomputed (4 points).
5. D5 fashion — report epoch where val loss turns upward (illustrative).

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `regularizer_sweep(weight_decay, patience)`; verify lesson shrinkage theta_t=(1-eta*lambda)theta-eta*g on one D1 weight; vary only decay/patience.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: accuracy — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val accuracy curves
- Pitfall on D5: Confusing local improvement with global learning: train loss keeps falling while val loss rises on D5; fix early stop/decay.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads; component topic, so hold the small net fixed and vary only this component across D1–D5.

### 6.14 — Label smoothing   [notebook: 6.14-label-smoothing.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Image classification — one-hot target becomes y'_k with epsilon/K (lesson).
2. Speech recognition — smoothing reduces overconfident posteriors (title).
3. Medical triage — K=3 on blobs makes epsilon/3 re-derivable (D3).
4. Digit recognition — K=10 on digits/fashion makes epsilon/10 visible (D4/D5).
5. Ad category models — compare accuracy and calibration caveat (illustrative).

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `label_smoothing_sweep(epsilon)`; verify lesson y'_k=(1-epsilon)y_k+epsilon/K on D1 class targets; vary epsilon only.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: accuracy — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val accuracy curves
- Pitfall on D5: Treating the design as magic: smoothed labels reduce overconfidence but can cap accuracy; fix by reporting calibration plus accuracy.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads; component topic, so hold the small net fixed and vary only this component across D1–D5.

### 6.15 — Batch normalization   [notebook: 6.15-batch-normalization.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Vision MLPs — normalize each mini-batch by mu_B and sigma_B^2 (lesson).
2. Ads tabular training — train/eval mode changes batch stats (lesson pitfall).
3. Medical classifiers — small batches make stats noisy; batch sizes illustrative.
4. D1 XOR — mini-batch of 4 points makes mean/variance hand-checkable.
5. D5 fashion — plot BN on/off across same five datasets.

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `normalization_sweep(batchnorm_on)`; verify lesson batch-normalized activation (x-mu_B)/sqrt(var_B+eps) on a D1 mini-batch; vary BN only.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: accuracy — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val accuracy curves
- Pitfall on D5: Ignoring scale: unnormalized D5 activations train badly, fixed by BatchNorm with train/eval mode shown.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads; component topic, so hold the small net fixed and vary only this component across D1–D5.

### 6.16 — Layer / group / instance normalization   [notebook: 6.16-layer-group-instance-normalization.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Style/vision models — instance norm uses per-example axes (title).
2. Language models — layer norm avoids batch-stat dependence (title).
3. Group conv nets — group norm splits channels into groups (title).
4. D1 MLP — axis-wise mean/variance is printed for re-derivation (lesson).
5. D5 fashion — wrong axis changes tensor shape/statistics; shape counts illustrative.

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `normalization_sweep(norm_axis)`; verify lesson axis-wise normalization on D1 activations; hold net fixed and vary layer/group/instance axes.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: accuracy — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val accuracy curves
- Pitfall on D5: Forgetting shape and memory: normalizing over the wrong axis changes meaning; fix by printing tensor axes and stats.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads; component topic, so hold the small net fixed and vary only this component across D1–D5.

### 6.17 — Residual & skip connections   [notebook: 6.17-residual-skip-connections.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Deep vision — y=x+F(x) preserves a direct signal path (lesson).
2. Speech encoders — residual blocks allow more layers (title).
3. Recommenders — skip features combine memorization and learned transforms (illustrative).
4. D1 XOR — compare 2-layer plain vs residual toy net (4 points).
5. D5 fashion — deeper plain/residual accuracy gap is plotted.

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `residual_toggle(depth)`; verify lesson y=x+F(x) and gradient I+dF/dx on D1; compare plain vs residual deeper MLP.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: accuracy — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val accuracy curves
- Pitfall on D5: Vanishing signal through depth: plain D5 net stalls, fixed by skip connections and matching dimensions.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads.

### 6.18 — Vanishing & exploding gradients   [notebook: 6.18-vanishing-exploding-gradients.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. RNN-like depth — gradient norm multiplies layer scales s_l (lesson).
2. Vision stacks — exploding/vanishing detected by layer gradient histograms.
3. Medical classifiers — normalized inputs reduce scale failure (lesson pitfall).
4. D1 XOR — product of two scales is hand-computable.
5. D5 fashion — fixed by init/norm/skip/clipping in an ablation.

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `gradient_depth_sweep(scale)`; verify lesson gradient product prod_l s_l on D1 by multiplying layer scales; hold net fixed and vary scale/depth.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: accuracy — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val accuracy curves
- Pitfall on D5: Ignoring scale: D5 gradients vanish/explode, fixed by He init, residuals, normalization, or clipping.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads; component topic, so hold the small net fixed and vary only this component across D1–D5.

### 6.19 — Gradient clipping   [notebook: 6.19-gradient-clipping.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Speech training — clip ||g|| to threshold c (lesson).
2. Robotics control — rare large gradients stop destabilizing steps (title).
3. Ad models — compare unclipped vs clipped learning curves over 5 rungs.
4. D1 XOR — one 2D gradient vector clipping factor is re-derivable.
5. D5 fashion — threshold values are illustrative and reported.

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `clip_sweep(c)`; verify lesson g_clip=g*min(1,c/||g||) on one D1 gradient vector; vary clipping threshold only.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: accuracy — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val accuracy curves
- Pitfall on D5: Confusing local improvement with global learning: clipping hides unstable lr on D5; fix by pairing clipping with lr tuning.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads.

### 6.20 — Learning-rate schedules (step, cosine, warmup, one-cycle)   [notebook: 6.20-learning-rate-schedules.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Vision training — cosine lr follows the lesson eta_t formula.
2. Large-batch ads — warmup avoids early divergence (title).
3. Mobile models — one-cycle schedule trades speed vs stability (title).
4. D1 XOR — a 5-epoch lr table is hand-checkable (illustrative).
5. D5 fashion — plot step/cosine/warmup/one-cycle with same net.

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `schedule_sweep(schedule)`; verify lesson cosine eta_t on a 5-epoch D1 trace; hold net/optimizer fixed and vary schedule.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: accuracy — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val accuracy curves
- Pitfall on D5: Confusing local improvement with global learning: aggressive one-cycle spikes loss on D5; fix with warmup/cosine bounds.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads; component topic, so hold the small net fixed and vary only this component across D1–D5.

### 6.21 — Gradient checking   [notebook: 6.21-gradient-checking.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Autograd library testing — centered difference uses two loss calls (lesson).
2. Finance models — gradient bugs are caught before deployment (illustrative).
3. Vision classifiers — D1 check precedes D5 training (4 points then few hundred).
4. Research notebooks — relative error threshold is illustrative and printed.
5. Custom losses — CE/MSE gradients can be checked on K=3 logits (D3).

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `gradient_check(model)`; verify lesson centered finite difference [L(theta+h)-L(theta-h)]/(2h) on D1 before training.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: loss — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val loss curves
- Pitfall on D5: Treating the design as magic: autograd bug/shape bug passes silently; fix by reporting relative error before D5 training.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads.

### 6.22 — Gradient accumulation & activation checkpointing   [notebook: 6.22-gradient-accumulation-checkpointing.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Limited-memory vision — accumulation averages K micro-batch gradients (lesson).
2. Long networks — activation checkpointing trades recompute for memory (title).
3. Ad models — effective batch size stays constant across K (lesson formula).
4. D1 XOR — split 4 points into K=2 micro-batches illustrative.
5. D5 fashion — CPU memory budget reported instead of GPU assumptions.

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `memory_strategy_sweep(accum_steps)`; verify lesson accumulated gradient g=(1/K)sum g_k on D1 split into K micro-batches.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: loss — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val loss curves
- Pitfall on D5: Forgetting shape and memory: D5 batch does not fit the chosen budget; fix with accumulation/checkpointing and identical effective batch.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads.

### 6.23 — Stochastic depth & spectral normalization   [notebook: 6.23-stochastic-depth-spectral-normalization.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Deep vision — stochastic depth samples residual path b (lesson).
2. Robust classifiers — spectral norm rescales W by sigma_max(W) (lesson).
3. GAN/discriminator-style training — Lipschitz control is illustrative.
4. D1 XOR — one path survival draw and one spectral rescale are hand-checkable.
5. D5 fashion — plot stability/accuracy with and without constraints.

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `regularizer_sweep(stochastic_depth, spectral_norm)`; verify lesson y=x+bF(x) and W/sigma_max(W) on D1; vary only path survival/spectral norm.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: accuracy — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val accuracy curves
- Pitfall on D5: Ignoring scale: spectral norm constrains D5 logits/gradients; fix unstable run with normalized weights.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads; component topic, so hold the small net fixed and vary only this component across D1–D5.

### 6.24 — Transfer learning & fine-tuning   [notebook: 6.24-transfer-learning-fine-tuning.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Medical imaging — train head first, then base with smaller lr (lesson).
2. Retail vision — D4 digits pretrain to D5 fashion is illustrative transfer.
3. Ad creatives — reuse base features and update a new head (lesson formula).
4. Small-data classifiers — few-hundred D5 labels show freeze/unfreeze tradeoff.
5. D1 XOR — toy frozen feature map makes two lr updates re-derivable.

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `finetune_head_then_base()`; verify lesson different lr updates for base/head on D1 pretrained toy features, then reuse across rungs.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: accuracy — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val accuracy curves
- Pitfall on D5: Confusing local improvement with global learning: full fine-tune overfits few D5 labels; fix by freezing base then unfreezing slowly.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads.

### 6.25 — Data augmentation   [notebook: 6.25-data-augmentation.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Vision classification — label-preserving transforms optimize augmented risk (lesson).
2. Document images — shifts/rotations are illustrative transformations.
3. Speech/audio proxy — noise injection preserves class in controlled demos (illustrative).
4. D1 XOR — symmetric jitter must not change the 4 labels (D1).
5. D5 fashion — compare no augmentation vs augmentation on few hundred images.

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `augment_then_train(transforms)`; verify lesson augmented risk E_t loss(h(t(x)),y) on D1 label-preserving flips/noise; vary augmentation only.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: accuracy — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val accuracy curves
- Pitfall on D5: Treating the design as magic: reproduce no-augmentation overfit on D5, then fix with label-preserving transforms.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads; component topic, so hold the small net fixed and vary only this component across D1–D5; current notebook reportedly shows no augmentation, so replace that dead path.

### 6.26 — Mixture-of-Experts layers   [notebook: 6.26-mixture-of-experts-layers.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. LLM serving — router picks TopK experts, TopK=2 illustrative (lesson).
2. Ad ranking — experts specialize by segment; load counts are plotted.
3. Vision mixtures — each image uses a sparse subset of experts (lesson).
4. D1 XOR — two experts and softmax router are hand-computable.
5. D5 fashion — report expert utilization over few hundred examples.

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `moe_layer(top_k)`; verify lesson routed expert mixture y=sum_{e in TopK} p_e E_e(x) on D1 with TopK=2 illustrative.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: accuracy — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val accuracy curves
- Pitfall on D5: Treating the design as magic: router collapse sends all D5 examples to one expert; fix with load-balance loss.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads.

### 6.27 — Neural ODEs   [notebook: 6.27-neural-odes.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Continuous-time control — hidden state evolves by dh/dt=f_theta (lesson).
2. Medical trajectories — solver steps model irregular dynamics (illustrative).
3. Vision depth models — residual layers approximate Euler steps (lesson connection).
4. D1 XOR — 2 Euler steps are hand-traceable illustrative.
5. D5 fashion — plot accuracy vs solver steps/runtime.

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `ode_block(steps)`; verify lesson continuous-depth update with Euler integration on D1 using 2 illustrative solver steps.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: loss — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val loss curves
- Pitfall on D5: Confusing local improvement with global learning: solver steps change accuracy/runtime on D5; fix by comparing fixed-step budgets.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads.

### 6.28 — Hypernetworks   [notebook: 6.28-hypernetworks.ipynb]   (family: F5, gap)

**Lesson — Real World Applications (5):**
1. Personalized models — context c generates weights W=H_psi(c) (lesson).
2. Multi-task learning — one generator emits task-specific heads (illustrative 2 tasks).
3. Edge deployment — small adapters avoid full generated matrices (lesson pitfall).
4. D1 XOR — two contexts produce two tiny heads (illustrative).
5. D5 fashion — generated parameter count is reported for few hundred examples.

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `hypernetwork_generate(c)`; verify lesson W=H_psi(c), y=f_W(x) on D1 with two illustrative contexts generating two heads.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: accuracy — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val accuracy curves
- Pitfall on D5: Forgetting shape and memory: generated weights balloon on D5; fix with small generated adapters. Gap: lesson body likely needs authoring before notebook can cite more than formula.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads; gap topic, lesson body may need authoring before implementation cites beyond the existing formula.

### 6.29 — Capsule networks   [notebook: 6.29-capsule-networks.ipynb]   (family: F5, gap)

**Lesson — Real World Applications (5):**
1. Part-whole vision — capsules route lower parts to wholes (lesson).
2. Medical imaging — agreement vectors encode pose-like properties (title).
3. Document layout — routing iterations combine parts into fields (illustrative).
4. D1 XOR — 2 lower/2 upper capsules are hand-traceable illustrative.
5. D5 fashion — iterations vs accuracy/cost is plotted.

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `capsule_routing(iterations)`; verify lesson routing agreement c_ij=softmax_j(b_ij), s_j=sum_i c_ij uhat on D1 with 2 capsules illustrative.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: accuracy — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val accuracy curves
- Pitfall on D5: Treating the design as magic: routing iterations add cost without accuracy gain on D5; fix by plotting iterations vs accuracy/loss. Gap noted.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads; gap topic, lesson body may need authoring before implementation cites beyond the existing formula.

### 6.30 — Spiking neural networks   [notebook: 6.30-spiking-neural-networks.ipynb]   (family: F5, gap)

**Lesson — Real World Applications (5):**
1. Neuromorphic sensors — spikes fire when v_t reaches threshold tau (lesson).
2. Low-power edge vision — event counts replace dense activations (illustrative).
3. Robotics timing — membrane leak alpha carries temporal state (lesson).
4. D1 XOR — 5 timesteps and one threshold are hand-checkable illustrative.
5. D5 fashion — spike rate vs accuracy is plotted.

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `spiking_layer(timesteps)`; verify lesson membrane update v_t=alpha v_{t-1}+I_t and spike threshold on D1 for 5 illustrative timesteps.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: accuracy — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val accuracy curves
- Pitfall on D5: Ignoring scale: thresholds too high/low produce no/all spikes on D5; fix by normalizing inputs and threshold sweep. Gap noted.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads; gap topic, lesson body may need authoring before implementation cites beyond the existing formula.

### 6.31 — Neural Architecture Search   [notebook: 6.31-neural-architecture-search.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. AutoML vision — choose architecture by validation loss L_val (lesson).
2. Ads models — search small widths/depths under cost constraints (illustrative).
3. Medical classifiers — validation, not training loss, selects a (lesson pitfall).
4. D1 XOR — 3 candidate architectures are hand-compared illustrative.
5. D5 fashion — report search trials and best accuracy.

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `architecture_search(space)`; verify lesson a*=argmin_a L_val(w_a,a) on D1 over 3 illustrative tiny architectures.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: accuracy — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val accuracy curves
- Pitfall on D5: Confusing local improvement with global learning: choosing by train loss overfits D5; fix by validation loss and search-cost reporting.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads.

### 6.32 — The lottery-ticket hypothesis   [notebook: 6.32-lottery-ticket-hypothesis.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Model compression — binary mask m keeps a sparse subnetwork (lesson).
2. Edge deployment — 50% sparsity is illustrative and re-counted.
3. Vision training — reset-to-initialization distinguishes lottery tickets (lesson).
4. D1 XOR — mask entries on a tiny MLP are hand-counted.
5. D5 fashion — plot sparsity vs accuracy after reset/retrain.

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `prune_reset_retrain(sparsity)`; verify lesson winning-ticket mask m⊙theta0 on D1 with an illustrative 50% mask, then retrain.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: accuracy — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val accuracy curves
- Pitfall on D5: Treating the design as magic: pruning after training is not a lottery ticket; fix by reset-to-initialization comparison.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads.

### 6.33 — Double descent & grokking   [notebook: 6.33-double-descent-grokking.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Overparameterized vision — train error reaches zero near interpolation (lesson).
2. Education demos — sweep hidden width on 4 XOR points (D1).
3. Ad models — test error can rise then fall with capacity (lesson).
4. Algorithm tasks — grokking delays generalization after memorization (title).
5. D5 fashion — plot train/test accuracy vs width and epoch.

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `capacity_sweep(width)`; verify lesson interpolation curve by sweeping D1 widths until training error reaches zero.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: accuracy — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val accuracy curves
- Pitfall on D5: Confusing local improvement with global learning: zero train error near interpolation worsens D5 test accuracy; fix with capacity/epoch curves.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads.

### 6.34 — Hardware (GPU/TPU) & mixed-precision training   [notebook: 6.34-hardware-mixed-precision.ipynb]   (family: F5)

**Lesson — Real World Applications (5):**
1. Hardware-aware training — activations scale as d*128*4 bytes (lesson).
2. Mixed precision — fp16 gradients with fp32 master weights (lesson).
3. Vision inference — batch/memory tradeoffs are measured on CPU illustrative.
4. D1 XOR — dtype casts on tiny tensors are hand-inspected.
5. D5 fashion — few-hundred subset simulates memory savings without GPU.

**Notebook plan:**
- Family: F5 DL-Training
- Concept built once (D1): `precision_memory_sweep(dtype)`; verify lesson mixed-precision update with fp16 gradients and fp32 master weights on D1 illustrative tensors.
- Datasets D1–D5: D1 XOR (4 points, hand-traceable) · D2 make_moons · D3 3-class make_blobs with noise · D4 sklearn digits · D5 fashion-MNIST subsampled (few hundred, cached, CPU)
- Metric: loss — one metric tracked across all rungs
- Closing viz: (a) decision-boundary panels (b) train/val loss curves
- Pitfall on D5: Forgetting shape and memory: D5 activations scale as d*128*4 bytes in lesson; fix by mixed precision plus loss scaling on CPU simulation.
- Notes: delete the generic auto-generated template cells; CPU-only; cache/subsample fashion-MNIST; no large downloads.
