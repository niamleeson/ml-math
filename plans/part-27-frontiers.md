# Part 27 — Frontiers

> Plan only — per-topic revamp plan. See ../00-MASTER-PLAN.md for the shared design & family registry (F1–F17).
> **Code style:** every notebook code cell is written one statement per line (newline-split, blank lines between logical groups) for readability — never dense, semicolon-packed one-liners. See ../00-MASTER-PLAN.md §B.4.
> Dominant families: F8 (LLM/Prompt) and F16 (Algorithmic-Instance / scaling), per topic.

### 27.1 — Quantum machine learning   [notebook: 27.1-quantum-machine-learning.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Quantum readout for binary decisions — lesson state $[0.6,0.8]^T$ gives $P(1)=0.64$ and $\langle Z\rangle=-0.280$.
2. Variational circuit feature maps — lesson $R_y(\pi/3)$ yields $P(0)=0.750$, $P(1)=0.250$, $\langle Z\rangle=0.500$.
3. Interference demos in sensors/experiments — lesson Hadamard state has balanced $P(0)=P(1)=0.500$ before later gates interfere.
4. Quantum-kernel classification — lesson kernel separates nearby $K(0.2,0.7)=0.939$ from far $K(0.2,2.6)=0.131$.
5. Hybrid optimizer debugging — lesson prediction $\hat y=\cos(1.2)=0.362$ gives loss $0.407$ and gradient $1.189$.

**Notebook plan:**
- Family: F16 Algorithmic-Instance / scaling
- Concept built once (D1): `quantum_feature_kernel()` plus `measure_z()`; verify normalization $0.36+0.64=1.000$, $\langle Z\rangle=-0.280$, and $K(a,b)=\cos^2((a-b)/2)$ from the lesson.
- Datasets D1–D5: D1 one-qubit amplitudes and two angles · D2 6 one-angle points with clean labels · D3 overlapping angle classes plus finite-shot measurement noise · D4 2-qubit product-feature kernel on a small synthetic classification set · D5 deliberately bad observable/kernel instance with labels hidden from measured $Z$.
- Metric: classification accuracy with finite-shot cost tracked as secondary annotation.
- Closing viz: (a) per-rung outcome panels showing state probabilities/kernel matrix/decision boundary  (b) accuracy-vs-instance-size-or-shot-cost curve.
- Pitfall on D5: Measuring the wrong observable; reproduce hidden state information causing poor accuracy, then fix by measuring an added observable/classical baseline kernel.
- Notes: Delete dead `conv2d/iou/edit_distance/ce/kl` template code; CPU-only NumPy simulation, no quantum hardware or large models; no gap.

### 27.2 — Neuromorphic computing   [notebook: 27.2-neuromorphic-computing.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Event-camera processing — lesson strong event $x_1=1.2$ with $\lambda=0.8,\theta=1$ spikes as $[1,0,0,0,0]$.
2. Audio-click or robot-touch accumulation — lesson five inputs of $0.3$ accumulate to $v_5=1.008$ and spike once.
3. Memory-timescale tuning — lesson four $0.3$ inputs end at $0.374$ for $\lambda=0.2$ versus $0.886$ for $\lambda=0.8$.
4. Sparse neuromorphic hardware scheduling — lesson 12 active spikes out of 1000 inputs skips $98.8\%$ of dense work.
5. Spiking dense-layer replacement — lesson presynaptic $x=[1,0,1]$, $w=[0.6,0.2,0.5]$ gives weighted input $1.100$ and spikes.

**Notebook plan:**
- Family: F16 Algorithmic-Instance / scaling
- Concept built once (D1): `lif_run(inputs, leak, threshold, reset=True)`; verify lesson strong-event train `[1,0,0,0,0]` and weak-evidence $v_5=1.008$.
- Datasets D1–D5: D1 single LIF neuron, 5 ticks · D2 clean event stream with sparse bursts · D3 noisy weak events requiring leak tuning · D4 small event-camera-like 2D spike grid · D5 dense/badly scaled stream where threshold is too low and active fraction explodes.
- Metric: spike-decision accuracy per unit active fraction/cost.
- Closing viz: (a) per-rung voltage/spike raster panels  (b) accuracy-or-energy-vs-stream-complexity curve.
- Pitfall on D5: Assuming sparsity automatically appears; reproduce high active fraction from low threshold/bad scaling, then fix by threshold/input normalization.
- Notes: Delete dead `conv2d/iou/edit_distance/ce/kl` template code; CPU-only deterministic LIF simulation; no surrogate-gradient training beyond an illustrative curve; no gap.

### 27.3 — Foundation models & generalist agents   [notebook: 27.3-foundation-models-generalist-agents.ipynb]   (family: F8)

**Lesson — Real World Applications (5):**
1. Pretraining budget planning — lesson scaling gives $L(10^{20})=0.030143$, $L(10^{22})=0.020854$, $L(10^{24})=0.014427$.
2. Compute ROI communication — lesson hundredfold compute increase multiplies loss by $0.692$, a $30.8\%$ reduction.
3. Model/data sizing — lesson rough transformer compute for $N=70$B, $D=300$B is $1.26\cdot10^{23}$ FLOPs.
4. Multi-skill evaluation dashboards — lesson weighted task losses combine to mixture loss $0.340$.
5. Tool-routing agents — lesson route probabilities $[0.690,0.254,0.057]$ yield expected tool cost $0.310$.

**Notebook plan:**
- Family: F8 LLM / Prompt
- Concept built once (D1): `route_and_answer(prompt, context, tools, logits)` plus `scaling_loss(C,A=1.2,alpha=0.08)`; verify lesson $100^{-0.08}=0.692$ and expected cost $0.310$.
- Datasets D1–D5: D1 one direct prompt · D2 few-shot set over summarize/calculate/retrieve · D3 add distractor context and stale parametric answers · D4 tiny local tool set with retrieval and calculator · D5 longer context with calibrated-vs-overconfident router on rare tool-use cases.
- Metric: capability score penalized by expected cost (same score across rungs).
- Closing viz: (a) per-rung outcome panels showing answer, selected route, context/tool trace  (b) capability-score-vs-context/tool-complexity curve.
- Pitfall on D5: Ignoring router calibration; reproduce confident wrong routes that choose the wrong external system, then fix with temperature/calibration and retrieval/tool verification.
- Notes: Delete dead `conv2d/iou/edit_distance/ce/kl` template code; CPU-only simulated prompts/tools, no API calls or large models; include scaling-law cells as illustrative support; no gap.

### 27.4 — Embodied AI & robotics learning   [notebook: 27.4-embodied-ai-robotics-learning.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Robot value learning — lesson TD target $1.350$, error $0.350$, and updated value $1.070$.
2. Contact exploration policies — lesson softmax over $Q=[1.2,0.7,0.4]$ gives action probabilities $[0.637,0.234,0.129]$.
3. Demonstration learning for manipulation — lesson $a^\star=0.80$, $\hat a=0.62$ gives behavior-cloning loss $0.0324$.
4. Sim-to-real validation — lesson 92/100 simulation vs 73/100 hardware success gives a $0.190$ success drop.
5. Closed-loop correction in control — lesson 10 cm error with 40% removal reaches $2.160$ cm after three steps.

**Notebook plan:**
- Family: F16 Algorithmic-Instance / scaling
- Concept built once (D1): `closed_loop_agent_step(state, action, reward, value)` with TD update and softmax policy; verify lesson update to $V=1.070$ and probabilities $[0.637,0.234,0.129]$.
- Datasets D1–D5: D1 2-state MDP TD toy · D2 1D reaching task with clean feedback · D3 noisy demonstrations plus recovery states · D4 small gridworld with visual-like state features · D5 sim-to-real shifted transition/friction instance.
- Metric: success rate/return across all rungs.
- Closing viz: (a) per-rung policy/value or trajectory panels  (b) success-rate-vs-dynamics-complexity curve.
- Pitfall on D5: Ignoring sim-to-real gaps; reproduce the lesson-style 0.190 success drop under shifted dynamics, then fix with domain randomization/feedback correction.
- Notes: Delete dead `conv2d/iou/edit_distance/ce/kl` template code; CPU-only grid/1D simulations, no robotics stack; no gap.

### 27.5 — Toward AGI: open problems   [notebook: 27.5-toward-agi-open-problems.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Capability scorecards — lesson $c=[0.9,0.8,0.2,0.4]$ gives average $0.575$, geometric mean $0.490$, bottleneck $0.200$.
2. Robustness under deployment shift — lesson score gap is $0.82-0.49=0.330$ with retained fraction $0.598$.
3. Continual-learning regression reviews — lesson old-task average change is $-0.265$ after adding a new task.
4. Alignment gatekeeping — lesson helpfulness/honesty/safety average is $0.733$ but required-floor score is $0.400$.
5. Scale-versus-generality audits — lesson $100^{-0.08}=0.692$ maps starting loss $0.300$ to $0.208$, improvement $0.092$.

**Notebook plan:**
- Family: F16 Algorithmic-Instance / scaling
- Concept built once (D1): `agi_score(capabilities, shift_scores, floors)` computing weighted average, geometric mean, bottleneck, retained fraction, and floor score; verify lesson $0.575/0.490/0.200$ and retained $0.598$.
- Datasets D1–D5: D1 four-capability vector from the lesson · D2 clean multi-task benchmark matrix · D3 shifted evaluation scores · D4 continual-learning before/after task matrix · D5 alignment-floor scenario with a low safety coordinate.
- Metric: bottleneck-aware capability score (minimum of robust retained score and safety floor).
- Closing viz: (a) per-rung radar/bar panels showing capability coordinates and weak links  (b) bottleneck-aware score-vs-evaluation-complexity curve.
- Pitfall on D5: Treating alignment as a postscript; reproduce high average with safety floor $0.400$, then fix by hard floor/gating so helpfulness cannot average safety away.
- Notes: Delete dead `conv2d/iou/edit_distance/ce/kl` template code; CPU-only simulated score matrices, no AGI claims or large models; no gap.
