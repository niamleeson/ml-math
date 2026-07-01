# Part 25 — Neurosymbolic AI & Program Synthesis

> Plan only — per-topic revamp plan. See ../00-MASTER-PLAN.md for the shared design & family registry (F1–F17).
> **Code style:** every notebook code cell is written one statement per line (newline-split, blank lines between logical groups) for readability — never dense, semicolon-packed one-liners. See ../00-MASTER-PLAN.md §B.4.
> Dominant families: F16 (Algorithmic-Instance) or F4 (Optimizer/differentiable), per topic.

### 25.1 — Neurosymbolic integration   [notebook: 25.1-neurosymbolic-integration.ipynb]   (family: F4)

**Lesson — Real World Applications (5):**
1. Medical decision support with incompatible diagnoses — rule implication on illustrative $A=0.9,B=0.4$ gives satisfaction $0.4$ and penalty $0.6$ (lesson formula).
2. Scene-graph consistency for perception systems — product AND on illustrative inside/outside scores $0.70,0.60$ gives joint violation evidence $0.42$ (lesson number).
3. Recommender business-rule regularization — with lesson $L_{neural}=0.22839300363692283$ and penalty $0.4$, $\lambda=2$ yields total loss $1.0283930036369228$.
4. Knowledge-graph completion with type constraints — probabilistic OR for two illustrative type signals $0.70,0.60$ gives $0.88$ satisfaction (lesson number).
5. Safety filtering for robotics actions — increasing rule weight from $\lambda=0.5$ to $5$ changes total loss from $0.42839300363692284$ to $2.228393003636923$ (lesson numbers).

**Notebook plan:**
- Family: F4 Optimizer/differentiable
- Concept built once (D1): implement `neurosymbolic_loss(p, y, A, B, lambda_)` with BCE plus soft implication; verify lesson BCE $0.22839300363692283$, implication penalties $0.2,0.4,0.6$, and $\lambda$ totals on the toy.
- Datasets D1–D5: D1 three hand probabilities/rules from the lesson · D2 clean synthetic binary classifier with one implication rule · D3 same with noisy labels and conflicting rule cases · D4 sklearn breast-cancer subset with an illustrative monotone/risk consistency rule · D5 shifted/noisy subset where rules and labels conflict hardest
- Metric: total loss, with neural loss and rule penalty tracked as components across all rungs
- Closing viz: (a) loss-surface/trajectory panels over $\lambda$ or threshold per dataset  (b) total-loss and rule-violation-vs-complexity curve
- Pitfall on D5: treating $\lambda$ as harmless; reproduce rule domination at high $\lambda$, then fix with a validation sweep and component reporting.
- Notes: delete dead template helpers; CPU-only deterministic sklearn/synthetic data; no gap.

### 25.2 — Inductive logic programming   [notebook: 25.2-inductive-logic-programming.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Family/kinship rule learning — two-hop grandparent rule covers $2$ positives and $0$ negatives, score $2$ (lesson facts).
2. Biomedical relation discovery — illustrative rule score $cov^+-cov^-$: $8$ supported interactions minus $3$ counterexamples gives score $5$.
3. Fraud-ring relational rules — illustrative shared-address rule with $12$ positives and $5$ negatives scores $7$, while positives-only would hide the $5$ false alarms.
4. Access-control policy mining — illustrative policy clause covering $20$ approved accesses and $2$ denied accesses scores $18$.
5. Knowledge-base completion — after adding $parent(bob,dan)$, the lesson's rule changes $grandparent(ann,dan)$ from unproved $0$ to proved $1$.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `score_rule(rule, facts, positives, negatives)` and a tiny clause enumerator; verify lesson candidates `parent(X,Z)` score $-1$, `parent2(X,Z)` score $2$, and `anything(X,Z)` score $-1$.
- Datasets D1–D5: D1 lesson family chain with 3 parent facts and 3 candidate rules · D2 longer clean kinship chain · D3 add negative examples and distracting predicates · D4 small real-ish family/company graph encoded inline · D5 larger graph with missing facts and many overbroad clauses
- Metric: solved-tasks / best rule score, plus number of candidate clauses searched
- Closing viz: (a) proof/coverage panels showing positives and negatives covered by the selected rule  (b) best-score and candidates-searched-vs-instance-size curve
- Pitfall on D5: learning from positives only; reproduce selection of the overbroad `anything(X,Z)` rule, then fix by including $cov^-(r)$ and language bias.
- Notes: delete dead template helpers; CPU-only pure Python enumeration; no gap.

### 25.3 — Differentiable programming   [notebook: 25.3-differentiable-programming.ipynb]   (family: F4)

**Lesson — Real World Applications (5):**
1. Trainable thresholding in risk triage — lesson threshold $t=1.5,k=4$ gives predictions $\{0.0024726231566347743,0.11920292202211755,0.8807970779778823,0.9975273768433653\}$.
2. Differentiable simulators for robotics — illustrative smooth contact threshold can be tuned by gradient; lesson finite difference at $t=1.0$ is $-0.49966464986062054$.
3. Soft routing in decision pipelines — lesson hard branch has loss $0$ throughout $t\in[1.01,1.99]$, showing why a soft surrogate is used for training.
4. Differentiable rendering/calibration — lesson gradient descent moves $t$ from $1.0$ to $1.4984574318643302$ after $30$ updates.
5. Constraint layers in optimization models — lesson loss surface has $L(1.0)=0.41003759580145864$, $L(1.5)=0.06470184809035148$, $L(2.0)=0.41003759580145864$.

**Notebook plan:**
- Family: F4 Optimizer/differentiable
- Concept built once (D1): implement `soft_threshold_program(x, t, k)` and `train_threshold`; verify lesson D1 predictions, BCE $0.06470184809035148$, finite-difference gradient $-0.49966464986062054$, and 30-step learned $t\approx1.4984574318643302$.
- Datasets D1–D5: D1 lesson $x=\{0,1,2,3\}$ threshold toy · D2 clean 1D synthetic threshold · D3 noisy/overlapping threshold labels · D4 sklearn diabetes or breast-cancer one-feature threshold · D5 constrained two-feature threshold with saturation-prone sharpness
- Metric: binary cross-entropy loss across all rungs
- Closing viz: (a) sigmoid fit/loss-curve panels for each dataset  (b) final BCE and learned-threshold-vs-complexity curve
- Pitfall on D5: making the relaxation too sharp too early; reproduce saturated gradients with large $k$, then fix by annealing $k$ and monitoring gradient norms.
- Notes: delete dead template helpers; CPU-only numpy/sklearn; no gap.

### 25.4 — Program synthesis   [notebook: 25.4-program-synthesis.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Spreadsheet/data-wrangling synthesis — lesson grammar finds $x^2+1$ with MSE $0$ on $5$ examples.
2. Code-generation from tests — with only $0\mapsto1$, lesson shows $2$ programs fit, so one test is underspecified.
3. SQL/query-by-example tools — illustrative candidate query loss: $0$ mismatches over $6$ examples beats $2/6$ mismatches.
4. Robotics task-program synthesis — illustrative search budget: adding branches can expand from $15$ lesson-style arithmetic programs to hundreds of candidates.
5. API transformation synthesis — lesson near misses $x^2+0$ and $x^2+2$ each have MSE $1.0$, while $x+2$ has MSE $5.8$.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `enumerate_programs(grammar)` and `score_program(p, examples)`; verify lesson examples for $x^2+1$, near-miss MSEs $1.0$, $1.0$, $5.8$, and version-space counts $2,1,1,1,1$.
- Datasets D1–D5: D1 lesson grammar `x+c`, `c*x`, `x^2+c` with $c\in\{-2,-1,0,1,2\}$ · D2 more examples for the same clean target · D3 ambiguous/incomplete specs plus held-out tests · D4 richer grammar with composition and constants · D5 hardest grammar with branches/noisy examples and hidden true program possibly absent
- Metric: best MSE, solved-tasks, and number of programs searched (report one primary curve: best MSE)
- Closing viz: (a) search-tree/program panels showing survivors after each example  (b) best-MSE and programs-searched-vs-complexity curve
- Pitfall on D5: underspecified examples; reproduce a wrong zero-training-loss program, then fix with held-out tests and stronger examples.
- Notes: delete dead template helpers; CPU-only enumeration with caps; no gap.

### 25.5 — Neural theorem proving   [notebook: 25.5-neural-theorem-proving.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Knowledge-graph reasoning with aliases — lesson soft unification gives $u(alice,bob)=0.9701425001453318$ instead of exact-match failure.
2. Entity-resolution-assisted proof search — lesson path score with $f=0.9,u=0.9701425001453318,r=0.8$ is $0.6985026001046389$.
3. Biomedical theorem/protein-link reasoning — illustrative two-path support $s=0.60,0.20$ combines by soft OR to $1-(0.40)(0.80)=0.68$.
4. Legal/compliance rule retrieval — lesson temperature $\tau=1.0$ assigns $0.15811219504644652$ mass to a weak symbol, illustrating diffuse support.
5. Rule-weight learning in differentiable reasoning — lesson theorem score rises from $0$ at $w=0$ to $0.9143615688372891$ at $w=1$.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `soft_unify`, `path_score`, and `soft_or_paths`; verify lesson cosines $1.0,0.9701425001453318,0.0$, path score $0.6985026001046389$, temperature weights, and soft OR $0.7964892550706313$.
- Datasets D1–D5: D1 lesson three-symbol proof toy · D2 clean alias graph with one rule and short proofs · D3 add near-neighbor distractors and multiple paths · D4 small inline knowledge graph with synonym-like embeddings · D5 larger proof graph with long paths, shared facts, and accidental nearest neighbors
- Metric: solved proof queries / proof score calibration, with nodes or paths searched recorded across all rungs
- Closing viz: (a) proof-tree panels with edge/path scores and highlighted soft matches  (b) solved-query rate or calibration-error-vs-complexity curve
- Pitfall on D5: over-trusting embedding similarity; reproduce a false proof through an accidental nearest neighbor, then fix with lower temperature, type constraints, or exact-match gates.
- Notes: delete dead template helpers; CPU-only numpy graph search; no gap.
