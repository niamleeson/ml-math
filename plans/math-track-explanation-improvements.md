# Math Track — Explanation Quality Improvement Plan

> **PLAN ONLY — nothing implemented yet.** Scope: the **Math** super-group (the 2nd-from-bottom
> top-level grouping in the sidebar: Course · Papers · **Math** · All ML), i.e. the 27 `template:"math"`
> topic sections (`lessons/math-01…27-*.js`, **689 lessons**) authored from `tools/math-authored.js`
> via `tools/gen-math.js` and rendered by `renderMath`. The 5-section spec is `MATH-LESSON-STRUCTURE.md`.
> This plan samples one lesson from each of the 27 sections, grades the explanation, and gives concrete
> before→after rewrites for the weak ones.
>
> **Reproduce every number below** with the throwaway scripts in the Appendix (they `eval` the lesson
> files against a mock `window` and inspect the objects).

---

## TL;DR — the track is **bimodal**, not uniformly weak

Sampling one lesson from each section shows **~⅔ of sampled lessons are genuinely strong** — real
"you're stuck" motivation, a derived (not asserted) key property, and §5 applications that actually
*use the concept* with re-derivable numbers (derivative, eigenvalue, hyperplanes, compactness, MLE,
gradient descent, KL, autodiff…). Those are the quality bar; leave them alone.

But a **minority of sections were bulk-generated** and carry the weakness you felt. The failure is
concentrated and *measurable*: **98 / 689 lessons (14%) reuse their entire §5 "Real-World
Applications" set verbatim from a sibling lesson**, so the applications don't specialize to the
concept. This is the single biggest driver of "weak explanations," and it clusters in a handful of
sections:

| # | Section | Lessons | §5 boilerplate (shared w/ a sibling) | Lessons w/ unclosed-`$` |
|---|---|---:|---:|---:|
| 2 | Multivariable / vector calculus | 41 | **27** | 0 |
| 26 | Control theory | 22 | **17** | 0 |
| 8 | Numerical analysis | 23 | **12** | **12** |
| 19 | Stochastic processes | 24 | **12** | 0 |
| 21 | Information theory | 20 | **10** | 0 |
| 15 | Graph theory | 27 | **9** | 0 |
| 25 | Dynamical systems & chaos | 20 | 6 | 0 |
| 9 | Linear algebra | 39 | 5 | 0 |
| 4 | Real analysis | 32 | 0 | **8** |
| 3, 12, 20, 23, 27 | (ODEs, diff-geo, Bayesian, OR, num-methods) | — | 0 | 1 each |

> This is the **same disease already flagged in the *All ML* revamp** (`plans/README.md`, "Known
> caveat": templated lesson math → templated applications). It also exists in the Math track, and the
> fix is the same: **author concept-specific §5 first, then everything downstream follows.**

**A second, deeper axis — the one you flagged now: the core exposition itself is thin, track-wide
(not just in the boilerplate sections).** Across all **689** definitions, **72% present no display
formula, 53% assert the key property with no derivation at all, and 100% end in a templated
"Assumptions that matter:" tail**; 44% of motivations are ≤55 words. The math template also **dropped
the app's own "🔤 Every symbol explained," "➗ The formula," and "📜 Why it's true — derivation"
sections** that every other lesson type renders — so formulas get *stated and symbol-named* but rarely
*built up* or *proved*. This hits even otherwise-strong sections. Full data, before→after, and a
one-time structural fix are in [*The formula & concept exposition itself is thin*](#the-formula--concept-exposition-itself-is-thin-track-wide) below.

---

## Per-section execution plans (all 27 sections)

Each section has its own **loadable worklist** in [`plans/math/`](math/) — open it alongside this master
when working that section. The master carries the *how* (the four principles, the fix recipe, the
structural fix, the Definition of Done); each per-section file carries the *what*: a defect **scorecard**,
the section's **systemic issues**, an **author-first exemplar**, and a **per-lesson table covering every
lesson** — flagging §5 rewrite, motivation rewrite, formula-to-display, the case-by-case derivation action
(`AUTHOR` full step-by-step / `deepen` / `explain-only`), and LaTeX fixes. Every count is generated from
the lesson objects (reproduce via the Appendix).

| Part | Section | Lessons | §5 boilerplate | LaTeX bugs | Derivations to author | Plan |
|---:|---|---:|---:|---:|---:|---|
| 01 | Single-variable calculus | 62 | 0 | 0 | 32 | [`math/math-part-01-single-variable-calculus.md`](math/math-part-01-single-variable-calculus.md) |
| 02 | Multivariable / vector calculus | 41 | 27 | 0 | 28 | [`math/math-part-02-multivariable-vector-calculus.md`](math/math-part-02-multivariable-vector-calculus.md) |
| 03 | Differential equations (ODEs) | 35 | 0 | 1 | 19 | [`math/math-part-03-differential-equations-odes.md`](math/math-part-03-differential-equations-odes.md) |
| 04 | Real analysis | 32 | 0 | 8 | 14 | [`math/math-part-04-real-analysis.md`](math/math-part-04-real-analysis.md) |
| 05 | Functional analysis | 21 | 0 | 0 | 9 | [`math/math-part-05-functional-analysis.md`](math/math-part-05-functional-analysis.md) |
| 06 | Harmonic / Fourier analysis | 19 | 0 | 0 | 4 | [`math/math-part-06-harmonic-fourier-analysis.md`](math/math-part-06-harmonic-fourier-analysis.md) |
| 07 | Measure theory | 20 | 0 | 0 | 10 | [`math/math-part-07-measure-theory.md`](math/math-part-07-measure-theory.md) |
| 08 | Numerical analysis | 23 | 12 | 12 | 10 | [`math/math-part-08-numerical-analysis.md`](math/math-part-08-numerical-analysis.md) |
| 09 | Linear algebra | 39 | 5 | 0 | 12 | [`math/math-part-09-linear-algebra.md`](math/math-part-09-linear-algebra.md) |
| 10 | Representation theory | 15 | 0 | 0 | 5 | [`math/math-part-10-representation-theory.md`](math/math-part-10-representation-theory.md) |
| 11 | Analytic geometry | 18 | 0 | 0 | 8 | [`math/math-part-11-analytic-geometry.md`](math/math-part-11-analytic-geometry.md) |
| 12 | Differential geometry | 20 | 0 | 1 | 12 | [`math/math-part-12-differential-geometry.md`](math/math-part-12-differential-geometry.md) |
| 13 | Topology | 18 | 0 | 0 | 4 | [`math/math-part-13-topology.md`](math/math-part-13-topology.md) |
| 14 | Discrete math / combinatorics | 23 | 0 | 0 | 6 | [`math/math-part-14-discrete-math-combinatorics.md`](math/math-part-14-discrete-math-combinatorics.md) |
| 15 | Graph theory | 27 | 9 | 0 | 12 | [`math/math-part-15-graph-theory.md`](math/math-part-15-graph-theory.md) |
| 16 | Mathematical logic & set theory | 19 | 0 | 0 | 4 | [`math/math-part-16-mathematical-logic-set-theory.md`](math/math-part-16-mathematical-logic-set-theory.md) |
| 17 | Probability theory | 40 | 0 | 0 | 18 | [`math/math-part-17-probability-theory.md`](math/math-part-17-probability-theory.md) |
| 18 | Mathematical statistics / inference | 30 | 0 | 0 | 12 | [`math/math-part-18-mathematical-statistics-inference.md`](math/math-part-18-mathematical-statistics-inference.md) |
| 19 | Stochastic processes | 24 | 12 | 0 | 13 | [`math/math-part-19-stochastic-processes.md`](math/math-part-19-stochastic-processes.md) |
| 20 | Bayesian statistics | 19 | 0 | 1 | 7 | [`math/math-part-20-bayesian-statistics.md`](math/math-part-20-bayesian-statistics.md) |
| 21 | Information theory | 20 | 10 | 0 | 10 | [`math/math-part-21-information-theory.md`](math/math-part-21-information-theory.md) |
| 22 | Optimization | 26 | 0 | 0 | 8 | [`math/math-part-22-optimization.md`](math/math-part-22-optimization.md) |
| 23 | Operations research | 17 | 0 | 1 | 9 | [`math/math-part-23-operations-research.md`](math/math-part-23-operations-research.md) |
| 24 | Game theory | 20 | 0 | 0 | 6 | [`math/math-part-24-game-theory.md`](math/math-part-24-game-theory.md) |
| 25 | Dynamical systems & chaos | 20 | 6 | 0 | 4 | [`math/math-part-25-dynamical-systems-chaos.md`](math/math-part-25-dynamical-systems-chaos.md) |
| 26 | Control theory | 22 | 17 | 0 | 12 | [`math/math-part-26-control-theory.md`](math/math-part-26-control-theory.md) |
| 27 | Numerical methods / scientific computing | 19 | 0 | 1 | 10 | [`math/math-part-27-numerical-methods-scientific-computing.md`](math/math-part-27-numerical-methods-scientific-computing.md) |
| — | **Total** | **689** | **98** | **25** | **298** | — |

> **Status: all 27 sections are fully authored, and every one of the ~689 lessons is now written in
> full prose** — not just one model entry per section. Each lesson has a §1 Connections paragraph, a
> multi-paragraph §2 Motivation & Intuition, a §3 case-by-case complete step-by-step derivation (or
> `explain-only`) with symbol glosses, and six concept-specific §5 applications with **sympy/numpy-verified
> numbers**. The plans total ~21,500 lines. Each file carries a `deep-authored` header so
> `tools/gen-section-plans.js` never overwrites it. Voice is plain, warm textbook throughout — verified
> zero rhetorical-question openers, hype, or editorializing across all files.
>
> **Consolidated LaTeX-bug list:** [`math/_LATEX-BUGS.generated.md`](math/_LATEX-BUGS.generated.md) —
> **97 unclosed-`$` fields across 11 sections** (authoritative scan of the lesson source), plus the
> agent-verified matrix row-break cases (Part 19: `math-19-06/07/08`). This is the worklist for the
> mechanical Mode-4 pass. Regenerate with `node tools/scan-latex-bugs.js`.

> **Scope:** the 27 **Math** super-group sections (689 lessons). The *Course* and *Papers* groups are out
> of scope here; the *All ML* group already has its own per-part plans (`plans/part-01…27-*.md`, see
> `plans/README.md`). Regenerate the per-section files + index with **`node tools/gen-section-plans.js`**
> (loads the lesson objects, recomputes every flag; writes `plans/math/_index-table.generated.md`).

---

## Failure modes 1–5 (surface) — motivation, applications & mechanics

1. **Copy-pasted §5 applications (highest impact).** A run of consecutive lessons shares the *same 6
   titles and the same numbers*, so §5 never touches the lesson's own concept. Ex: **math-02-02→14**
   (13 lessons — dot product, cross product, gradient, directional derivative…) all ship the identical
   set *"Machine learning model geometry · Computer graphics · Robotics · Optimization · Data
   visualization · Similarity search."* The **gradient** lesson's "numbers" are a dot product (`4`), a
   vector sum (`(5,2,2)`), a norm (`5`), and a distance (`10`) — **not one gradient**.

2. **Template-filler motivation.** 64 lessons open with a shared stock phrase. The worst is the
   multivariable set's *"You already have the coordinate tools… compute carefully, then ask what the
   result says about direction, shape, rate, or data"* (13 lessons) — it describes no specific concept
   and poses no problem the learner is stuck on. Contrast the spec's requirement: *"A concrete problem
   the learner can't yet solve, then the promise."*

3. **Template-filler *inside the definition*.** Ex: **math-15-23 (graph Laplacian)** — one of the most
   ML-central objects (spectral clustering, GNNs) — has this dropped into its Definition:
   *"The useful habit is to connect the definition to a checkable number or construction. Small
   examples reveal whether the condition is about vertices, edges, faces, matrices, probabilities, or
   learned messages."* That's authoring boilerplate, not mathematics.

4. **Mechanical LaTeX bugs.** **~59 §5 `numbers` fields have an unclosed `$`** (e.g. `gives $2\times10^{-5}.`)
   which MathJax renders as literal/garbled text — 25 lessons affected, concentrated in **Numerical
   analysis (12)** and **Real analysis (8)**. Also broken matrix row separators, e.g. math-19-06's
   `\begin{bmatrix}0.8&0.2\0.3&0.7\end{bmatrix}` (a lost `\\`).

5. **Grammar artifacts from templating.** The concept name is string-substituted into a fixed
   sentence, breaking agreement: math-19-06's *"Stationary distributions **helps** teams…"* /
   *"Stationary distributions **appears** when…"*.

---

## Sampled lesson from each of the 27 sections

Verdict key: **A** = quality bar, keep · **B** = solid, minor polish · **C** = weak, rewrite §2/§3/§5.
"§5 exposure" = how many lessons in that section carry copy-pasted applications (whole-section risk,
independent of the one sampled).

| # | Section | Sampled lesson | Verdict | §5 exposure | Note |
|---|---|---|:---:|---:|---|
| 1 | Single-variable calculus | `math-01-13` The derivative | **A** | 0 | Poses `0/0 at t=3`; all 6 apps compute derivatives. The bar. |
| 2 | Multivariable / vector calc | `math-02-13` The gradient | **C** | 27 | Filler motivation; apps are dot-product/norm/distance, never ∇f. |
| 3 | Differential equations | `math-03-05` Separable equations | **B** | 0 | Apps on-topic (growth, decay, cooling); motivation a touch generic. |
| 4 | Real analysis | `math-04-10` Cauchy sequences | **A** | 0 | Strong ("do late terms crowd so a limit must exist?"). Section has unclosed-`$`. |
| 5 | Functional analysis | `math-05-06` Hilbert spaces | **A** | 0 | Geometry+completeness framing; apps mostly on-topic. |
| 6 | Harmonic / Fourier | `math-06-06` The Fourier transform | **A** | 0 | "a pulse, a word, a click"; apps on-topic (MRI, spectral bias). |
| 7 | Measure theory | `math-07-08` The Lebesgue integral | **A** | 0 | "measure where the function takes each value"; apps = expectations. |
| 8 | Numerical analysis | `math-08-06` Conditioning | **C** | 12 | Apps = standardization/step-size, not κ; **unclosed-`$`** throughout. |
| 9 | Linear algebra | `math-09-18` The eigenvalue equation | **A** | 5 | Excellent — PCA, PageRank, dynamics, spectral, attention. |
| 10 | Representation theory | `math-10-14` Equivariance | **A** | 0 | "symmetry with memory"; apps = CNN/GNN/keypoints. |
| 11 | Analytic geometry | `math-11-18` Hyperplanes & decision boundaries | **A** | 0 | 7 apps, all margins/logits/boundaries. The bar. |
| 12 | Differential geometry | `math-12-16` Geodesics | **A** | 0 | Air routes, hyperbolic embeddings, diffusion kernels — on-topic. |
| 13 | Topology | `math-13-09` Compactness | **A** | 0 | Minimizer-exists, robustness certificates — genuinely compactness. |
| 14 | Discrete math / combinatorics | `math-14-14` Inclusion–exclusion | **A** | 0 | Every app is an honest union count. |
| 15 | Graph theory | `math-15-23` The graph Laplacian | **C** | 9 | Filler in the *definition*; apps = degree/density, never L. |
| 16 | Logic & set theory | `math-16-12` Cardinality | **A** | 0 | Bijection framing; apps = vocab size, one-hot, hash load. |
| 17 | Probability theory | `math-17-38` Central Limit Theorem | **B** | 0 | Apps on-topic; motivation is terse — expand the "why √n" intuition. |
| 18 | Math statistics / inference | `math-18-12` Maximum Likelihood Estimation | **A** | 0 | Apps = logistic/NB/Poisson/LM. (Section reuses SE/z numbers 14× elsewhere.) |
| 19 | Stochastic processes | `math-19-06` Stationary distributions | **C** | 12 | Apps never solve πP=π; grammar breaks; matrix `\\` bug. |
| 20 | Bayesian statistics | `math-20-15` Variational inference | **A** | 0 | ELBO derived from the log-evidence identity; apps = LDA/BNN/VAE. |
| 21 | Information theory | `math-21-06` KL divergence | **A** | 10 | Sampled lesson strong, but 21-11→20 carry boilerplate §5. |
| 22 | Optimization | `math-22-05` Gradient descent | **A** | 0 | Step-size wisdom, scaling, fine-tuning — the bar. |
| 23 | Operations research | `math-23-11` Dynamic programming | **A** | 0 | Principle of optimality derived; apps = shortest-path/Viterbi/RL. |
| 24 | Game theory | `math-24-08` Mixed-strategy Nash | **A** | 0 | Indifference principle; apps = penalty kicks, GANs, adversarial. |
| 25 | Dynamical systems & chaos | `math-25-04` Stability of fixed points | **A** | 6 | Sampled lesson strong; 25-14→19 carry boilerplate §5. |
| 26 | Control theory | `math-26-06` Poles and zeros | **C** | 17 | 2-sentence motivation; apps mostly generic; section 90% boilerplate. |
| 27 | Numerical methods / sci-comp | `math-27-13` Automatic differentiation | **A** | 0 | forward/reverse adjoint rule derived; apps = backprop/PINN/HMC. |

**Score: 20×A, 2×B, 5×C.** The five **C** samples (gradient, conditioning, graph Laplacian,
stationary distributions, poles/zeros) all sit inside the high-boilerplate sections from the TL;DR
table — sampling and the whole-track scan agree.

---

## How I'd improve them — concrete before→after (the 5 weak samples)

> LaTeX below is written as it renders (`$…$`). In the JS source, backslashes double (`\\nabla`), and
> a matrix row break is `\\\\`.

### C-1 · `math-02-13` The gradient

**Motivation — before** (pure filler):
> "You already have the coordinate tools from the previous lessons. Now we use them to read gradient
> as something concrete rather than as a symbol to memorize. The goal is steady and practical: compute
> carefully, then ask what the result says about direction, shape, rate, or data."

**Motivation — after** (plain textbook voice; the concrete problem, then the idea. Full version is the model entry `math-02-13` in the Part 02 plan):
> "A partial derivative tells you how the loss $f(x,y)=x^2+xy+2y^2$ changes along one axis, but at a point
> like $(1,2)$ the surface slopes differently in every direction, and an optimizer needs the single best
> direction to move. The **gradient** provides it. It collects the partial derivatives into one vector,
> $\nabla f=\langle f_x,f_y\rangle$, which points in the direction of steepest increase; the opposite
> direction, $-\nabla f$, is the steepest decrease. This is the direction gradient descent follows on every
> training step."

**§5 — after** (replace the shared dot-product/norm boilerplate with 6 uses of *this lesson's own* $f$, all re-derivable):
1. **Steepest-descent direction** — $\nabla f(1,2)=\langle 2x+y,\,x+4y\rangle=\langle4,9\rangle$; the
   fastest-decrease unit step is $-\langle4,9\rangle/\lVert\langle4,9\rangle\rVert=-\langle4,9\rangle/\sqrt{97}\approx\langle-0.41,-0.91\rangle$.
2. **One GD update** — with learning rate $0.1$: $(1,2)-0.1\langle4,9\rangle=(0.6,1.1)$; plug back to confirm $f$ dropped.
3. **Perpendicular to level sets** — along the contour through $(1,2)$ the directional derivative is $\nabla f\cdot t=0$, so the gradient is the contour's normal.
4. **Directional derivatives are dot products with $\nabla f$** — rate toward $\langle1,0\rangle$ is $4$; toward $\langle0,1\rangle$ is $9$. The gradient packages *all* directional rates at once.
5. **Backprop = gradient assembly at scale** — for $L=\tfrac12\lVert Xw-y\rVert^2$, $\nabla_w L=X^\top(Xw-y)$; each coordinate is one partial derivative, the definition applied component-wise.
6. **Vanishing/saddle diagnosis** — $\lVert\nabla f\rVert\approx0$ at a non-minimum (a saddle) stalls training; that's the cue to inspect the Hessian.

*Apply the same rewrite to all 27 math-02 boilerplate lessons: each keeps its own worked function and re-derives §5 from it.*

### C-2 · `math-08-06` Conditioning of problems

**Fix the LaTeX first** — every `numbers` field ends with an unclosed `$` (`gives $2\times10^{-5}.` → `gives $2\times10^{-5}$.`).

**§5 — before**: "Scientific computing history → *three halvings take width 1 to 0.125*"; "Data
preprocessing → *standardizing $x=130$… gives $z=2$*" — none is a condition number.

**§5 — after** (each computes/reads a κ):
1. **Ill-conditioned solve** — $\kappa(A)=\lVert A\rVert\lVert A^{-1}\rVert$; for $A=\mathrm{diag}(1000,1)$, $\kappa=1000$, so a $0.1\%$ input error can become a $100\%$ output error.
2. **Loss curvature sets GD speed** — $\kappa(\nabla^2 f)=\lambda_{\max}/\lambda_{\min}$; for $f(x,y)=x^2+100y^2$, $\kappa=200/2=100$, which is why vanilla GD zig-zags.
3. **Normal equations square κ** — $\kappa(X^\top X)=\kappa(X)^2$, so solving least squares via $X^\top X$ is far less stable than via QR.
4. **Catastrophic cancellation *is* bad conditioning** — $f(x)=1-\cos x$ near $0$ has $\kappa\to\infty$; rewrite as $2\sin^2(x/2)$ to recondition.
5. **Softmax overflow** — $\exp$ of large logits is ill-conditioned; subtracting $\max_i z_i$ before exponentiating is a reconditioning trick.
6. **The scalar formula, re-derived** — $\kappa_f(3)$ for $f(x)=x^2$ is $\lvert x f'/f\rvert=\lvert 3\cdot6/9\rvert=2$: a $1\%$ input error → about $2\%$ output error.

### C-3 · `math-15-23` The graph Laplacian

**Definition — delete the filler** ("The useful habit is to connect the definition to a checkable
number… vertices, edges, faces, matrices, probabilities, or learned messages") and **derive the
quadratic form** instead:
> "Expand $x^\top L x=x^\top(D-A)x=\sum_i d_i x_i^2-\sum_{i\sim j}x_ix_j=\sum_{(i,j)\in E}(x_i-x_j)^2$.
> So $L$ is exactly the operator whose energy is *total squared disagreement across edges* — zero only
> when the signal is constant on each connected component."

**§5 — after** (each actually uses $L$; worked graph is the path $1\!-\!2\!-\!3$, $L=\begin{bmatrix}1&-1&0\\-1&2&-1\\0&-1&1\end{bmatrix}$):
1. **Smoothness energy** — signal $x=(3,1,3)$: $x^\top L x=(3-1)^2+(1-3)^2=8$; constant $x=(2,2,2)$ gives $0$.
2. **One GNN / heat step** — $x\leftarrow x-\varepsilon L x$; with $\varepsilon=0.1$, $Lx=(2,-4,2)$, so $x\to(2.8,1.4,2.8)$ — neighbors pulled together.
3. **Connected components** = multiplicity of eigenvalue $0$ of $L$ (the path has exactly one → connected).
4. **Spectral clustering** — the Fiedler vector (2nd-smallest eigenvalue) sign-splits the graph; on a barbell it cuts the two clusters.
5. **Normalized Laplacian** used in GCNs — $L_{\text{sym}}=I-D^{-1/2}AD^{-1/2}$; the middle vertex (degree 2) gets diagonal $1$, off-diagonals $-1/\sqrt{2\cdot1}$.
6. **Effective resistance** — $L^{+}$ (pseudoinverse) gives commute distances used in link prediction.

### C-4 · `math-19-06` Stationary distributions

**Fix the matrix** — `\begin{bmatrix}0.8&0.2\\0.3&0.7\end{bmatrix}` (the `\\` row break was lost).
**Fix grammar** — stop substituting the plural concept name into a singular verb slot.

**§5 — after** (each actually solves/uses $\pi P=\pi$; sampled chain gives $\pi=[0.6,0.4]$ since $0.2\pi_1=0.3\pi_2$):
1. **PageRank** — a page's rank is the stationary distribution of the web's transition matrix; verify $0.6\cdot0.8+0.4\cdot0.3=0.6$.
2. **MCMC correctness** — samplers are built so the *target* is stationary; **detailed balance** $\pi_iP_{ij}=\pi_jP_{ji}$ is the certificate.
3. **Ergodic averages** — long-run fraction of time in state $j$ is $\pi_j$; simulate $10^6$ steps and empirical frequencies approach $[0.6,0.4]$.
4. **Queue occupancy** — a birth–death chain's $\pi$ is the long-run probability of $k$ jobs in the system.
5. **Mixing** — for a symmetric shuffle $\pi$ is uniform; mixing time measures how fast the chain reaches $\pi$.
6. **RL state visitation** — under a fixed policy the visitation distribution is the stationary $\pi$ of the induced chain, used to weight policy-gradient updates.

### C-5 · `math-26-06` Poles and zeros

**Motivation — before** (2 flat sentences). **After** — plain textbook voice, the concrete question then the idea:
> "When a system is disturbed briefly, its response either dies out, oscillates, or grows without bound.
> For a linear system, which of these happens is determined by a few points in the complex plane. Factor
> the transfer function $G(s)=N(s)/D(s)$: the **poles** (roots of $D$) are the system's natural modes, and
> the **zeros** (roots of $N$) determine which inputs are attenuated. The signs of the poles tell you
> whether the system is stable before you run any simulation."

**§5 — after** (worked system $G(s)=\dfrac{s+2}{(s+1)(s+4)}$: zero $-2$, poles $-1,-4$, DC gain $G(0)=\tfrac{2}{4}=0.5$):
1. **Stability from pole sign** — both poles $-1,-4$ have negative real part → modes $e^{-t},e^{-4t}$ decay → stable; a pole at $+0.5$ would make $e^{0.5t}$ blow up.
2. **Speed** — the slowest pole $-1$ dominates settling; time constant $1/\lvert-1\rvert=1$ s.
3. **DC gain** — a unit step settles to $G(0)=0.5$.
4. **Oscillation** — complex poles $-2\pm3j$ give envelope $e^{-2t}$ and period $2\pi/3\approx2.09$ s.
5. **Training dynamics ↔ control** — a linearized GD update $e_{t+1}=(1-\alpha\lambda)e_t$ is stable iff its "pole" $\lvert1-\alpha\lambda\rvert<1$ — the same test.
6. **Zeros shape response** — the zero at $-2$ partially cancels the pole at $-1$, speeding the response versus a system without it.

---

## The formula & concept exposition itself is thin (track-wide)

A **different, broader** problem than §5 boilerplate: it affects even the strong sections, because the
math template's `definition` is a short, **assert-style** statement of the formula plus a templated
tail. Measured across all 689 definitions/motivations:

- **100%** end in the templated **"Assumptions that matter:"** tail — a rigid generator fingerprint.
- **72%** (497/689) contain **no display formula** (`$$…$$`) — the "formula" is a brief inline snippet or missing.
- **53%** (362/689) contain **no derivation cue** (*because / since / follows from / expand…*): the key
  property is **asserted**, against the spec's §3 rule *"Derive the key property rather than asserting it."*
- **44%** of motivations are **≤55 words** (median 58) — too short to build a mental model.
- Median definition **93 words**, of which the assumptions tail eats ~25–35 — leaving ~60 words to carry
  build-up + formula + derivation *combined*.

**Structural root cause — the math template dropped the app's own pedagogy.** `renderMath` renders only
*motivation → definition → worked → applications*. The app's **standard** template (`open()` in
`index.html`) renders six further elements the math track has no field for:

| App's standard lesson template | Math track (`renderMath`) |
|---|---|
| 💡 The big idea (`bigIdea`) | folded into one sentence of `motivation` |
| 🪜 Building up to it (`buildup`) | absent |
| 🔤 Every symbol explained — table (`symbols`) | symbols named inline, tersely |
| ➗ The formula — dedicated box (`formula`) | inline in `definition`; 72% have no display form |
| 📜 **Why it's true — derivation & intuition** (`derivation`) | **absent** |
| 🔢 Concrete example (`example`) | only the `worked` mechanics |

`README.md` even advertises *"🔤 Every symbol explained — no symbol used before it's defined"* and
*"📜 Why it's true — a derivation/proof + intuition"* as the lesson shape — promises the math track does
not keep. Net effect: a formula is **stated and symbol-named but rarely built up or derived**, and the
hardest topics (where the "why" matters most) get the same ~90-word treatment as "Functions and their graphs."

**Failure modes (continuing the numbering):**

6. **Assert-not-derive (53%).** The load-bearing fact is stated, not shown. Gradient: *"Because
   $D_uf=\nabla f\cdot u$, the gradient gives the largest directional derivative… It is also perpendicular
   to level sets"* — three claims, zero derivations.
7. **Under-presented formula (72% no display).** No `$$…$$`, no symbol table, no "where this comes from."
8. **No "Why it's true" section (structural).** Derivations have nowhere to live but a cramped `definition`,
   so they get dropped; the 100%-templated assumptions tail confirms rigid generation.
9. **Thin concept intuition (44% ≤55 words).** One metaphor, rarely carried through to the formula.

### How I'd improve the exposition — four principles + before→after

Four rules the rewritten explanation sections follow:

- **Plain, warm textbook voice — like a good teacher, not an editorial.** The prose should read like a
  well-written textbook: clear, calm, direct, and respectful of the reader. Warm means *helpful and
  encouraging* — start from what the reader already knows, say plainly why something matters, and explain
  rather than assert. Warm does **not** mean poetic, dramatic, or attention-grabbing. **Avoid** rhetorical
  flourishes and hype: no "quiet miracle," "beating heart," "make yourself at home," "one idea, many
  uniforms," exclamation, or second-person cheerleading. If a sentence is trying to sound clever or
  impressive, cut it. The **math inside each step stays precise**; the warmth is in clear explanation, not
  ornament. (Compare: *"The gradient collects the partial derivatives into one vector"* — good; *"the quiet
  miracle is that this humble arrow…"* — cut.)
- **Complete, every-step derivations — no skipping.** When there is a formula / identity / inequality /
  closed form to justify, show **every step**, one operation at a time, each with a short plain-English
  *why*. No "it can be shown," no compressed one-liners — a learner should be able to reproduce it on paper.
- **Case-by-case — only derive when there's something to derive.** Many lessons are *definitions or
  concepts* with no derivable claim ("What is a stochastic process?", "Cartesian coordinates",
  "Propositional logic"). For those, **skip the derivation** and just explain clearly — never
  manufacture a proof. Derive when the lesson introduces a non-obvious formula, closed form, identity,
  inequality, or characterization (gradient steepest-ascent, CLT limit, Laplacian energy, the MLE, the
  condition number, the ELBO bound, the characteristic equation, …).
- **Name every important symbol in plain English.** Right where the formula appears, gloss each symbol —
  what it *is*, and its role or units — with **no symbol used before it's defined** (this restores the
  app's "🔤 Every symbol explained"). E.g. for gradient descent $x_{k+1}=x_k-\alpha\,\nabla f(x_k)$:
  $x_k$ is the current parameter vector, $\alpha>0$ the step size (learning rate), $\nabla f(x_k)$ the
  local uphill direction, and the minus sign is what turns "uphill" into "downhill." A reader should
  never hit a symbol they haven't been introduced to.

**E-1 · `math-02-13` gradient — full step-by-step derivation (currently three asserted claims).**

*Before:* "Because $D_uf=\nabla f\cdot u$, the gradient gives the largest directional derivative when $u$
points the same way. It is also perpendicular to level sets."

*After — plain textbook voice, every step shown:*
> The gradient points in the direction of steepest increase. This is not something to memorize; it follows
> from the chain rule in three steps.
>
> **Step 1 — the slope in a chosen direction.** Take a unit direction $u=\langle u_1,u_2\rangle$ (unit means
> $u_1^2+u_2^2=1$), move a small amount $t$ that way, and track the height as a single-variable function:
> 1. Let $g(t)=f(x+tu_1,\,y+tu_2)$ — this reduces the 2-D motion to one variable we can differentiate.
> 2. Chain rule: $g'(t)=f_x\,u_1+f_y\,u_2$ — each coordinate contributes its partial derivative times how fast that coordinate changes.
> 3. At $t=0$: $g'(0)=f_x u_1+f_y u_2=\langle f_x,f_y\rangle\cdot\langle u_1,u_2\rangle=\nabla f\cdot u$ — so the slope in direction $u$ is $\nabla f\cdot u$. Write it $D_uf$.
>
> **Step 2 — which direction increases $f$ fastest.**
> 4. Write the dot product using the angle $\theta$ between $u$ and $\nabla f$: $D_uf=\lVert\nabla f\rVert\,\lVert u\rVert\cos\theta$ — the geometric form of the dot product.
> 5. Since $u$ is a unit vector, $\lVert u\rVert=1$, so $D_uf=\lVert\nabla f\rVert\cos\theta$ — only $\cos\theta$ depends on the direction.
> 6. $\cos\theta$ is largest ($=1$) at $\theta=0$, so $f$ increases fastest in the direction of $\nabla f$, at rate $\lVert\nabla f\rVert$. At $\theta=180^\circ$, $\cos\theta=-1$, so the fastest decrease is along $-\nabla f$ — this is the direction gradient descent uses.
>
> **Step 3 — why it is perpendicular to level sets.**
> 7. Along a level curve $f$ is constant, so its slope in that direction is $0$: $D_uf=0$.
> 8. Then $D_uf=\nabla f\cdot u=0$, and a zero dot product means $\nabla f$ is perpendicular to the level curve.
>
> So collecting the partial derivatives into $\nabla f$ gives two properties at once: it points in the
> direction of steepest increase, and it is perpendicular to the level sets. **Symbols:** $f_x=\partial
> f/\partial x$ is the slope with $y$ held fixed; $\nabla f=\langle f_x,f_y\rangle$ collects the two slopes;
> $u$ is kept unit length so directions are compared on equal footing.

**E-2 · `math-17-38` Central Limit Theorem — full step-by-step "why normal" (currently omitted).**

*Before:* explains only the scaling ("the $\sqrt n$ appears because $\mathrm{sd}(\bar X_n)=\sigma/\sqrt n$").
Nothing explains why the limit *shape* is the bell — the whole point of the theorem.

*After — plain textbook voice, every step shown (the complete argument at this level is the characteristic-function one):*
> Here is why the limit is normal regardless of the starting distribution. The tool is the **characteristic
> function** $\varphi_X(t)=\mathbb E[e^{itX}]$, which has the key property that for independent variables, the
> characteristic function of a sum is the product of the individual characteristic functions.
> 1. Standardize each term: $Y_i=\dfrac{X_i-\mu}{\sigma}$, so every $Y_i$ has mean $0$ and variance $1$. Then $Z_n=\dfrac{1}{\sqrt n}\sum_{i=1}^n Y_i$.
> 2. Take characteristic functions and use independence: $\varphi_{Z_n}(t)=\prod_{i=1}^n \varphi_Y\!\big(t/\sqrt n\big)=\big[\varphi_Y(t/\sqrt n)\big]^n$ — the $1/\sqrt n$ is the scaling inside $Z_n$.
> 3. Taylor-expand one factor near $0$, using $\varphi_Y(0)=1$, $\varphi_Y'(0)=i\,\mathbb E[Y]=0$, $\varphi_Y''(0)=-\mathbb E[Y^2]=-1$: $\varphi_Y(s)=1-\tfrac12 s^2+o(s^2)$ — the mean $0$ removes the linear term and the variance $1$ fixes the quadratic term.
> 4. Substitute $s=t/\sqrt n$: $\varphi_Y(t/\sqrt n)=1-\dfrac{t^2}{2n}+o(1/n)$.
> 5. Raise to the $n$: $\varphi_{Z_n}(t)=\Big(1-\dfrac{t^2}{2n}+o(1/n)\Big)^n$, and use the limit $\big(1+\tfrac{a}{n}\big)^n\to e^{a}$.
> 6. Let $n\to\infty$ with $a=-t^2/2$: $\varphi_{Z_n}(t)\to e^{-t^2/2}$, which is the characteristic function of the standard normal $\mathcal N(0,1)$. Since a characteristic function determines its distribution, $Z_n\Rightarrow\mathcal N(0,1)$.
>
> Note what happened in steps 3–4: only the mean and variance survived, and every other detail of the
> original distribution dropped out. That is why sums of many different distributions all approach the same
> normal shape.
>
> **Symbols.** $\varphi_X(t)=\mathbb E[e^{itX}]$ is the characteristic function (a Fourier transform of the
> distribution) and $t$ its frequency argument; $\mu,\sigma$ are the original mean and standard deviation;
> $Y_i$ are the standardized terms (mean $0$, variance $1$); $Z_n$ is the standardized sample-sum; and
> $o(s^2)$ means "shrinks faster than $s^2$ as $s\to0$."

(A third fully-worked derivation is **C-3** above — the graph-Laplacian energy
$x^\top Lx=\sum_{(i,j)\in E}(x_i-x_j)^2$, which the current definition merely states.)

### Structural fix (do once, benefits all 689)

1. **Restore a real "Why it's true" section.** Add an optional `derivation` field and render it in
   `renderMath` as a **📜 Why it's true — derivation & intuition** card (parity with the standard template
   and spec §3). Author it as an ordered, **one-operation-per-step** list (the same `{do, result, why}`
   shape the worked examples already use) wrapped in plain explanatory prose. **Also restore the `symbols`
   table (now required, not optional) and the `formula` display box** — both renderers already exist
   (`symbolsTable` emits an "Every symbol, in plain English" table).
2. **Upgrade the spec.** `MATH-LESSON-STRUCTURE.md` §3 → definition flows **build-up → display formula →
   every important symbol explained in plain English → complete step-by-step derivation → assumptions**.
   Its Voice section should state that the explanation prose (§1 Connections, §2 Motivation, and the
   derivation's connective lines) is **plain, warm textbook voice — clear and helpful, not poetic or
   attention-grabbing** (see the four principles), while the steps stay precise. Add the **case-by-case
   rule**: derive only when there's a non-obvious formula; for pure definition/concept lessons, skip the
   derivation and explain plainly instead (mark those lessons so lints don't flag them).
3. **Author + regenerate.** Add `derivation` (and richer `definition`) per lesson in
   `tools/math-authored.js`; `tools/gen-math.js` emits the new field.
4. **Lints (prevent regression).** Fail/warn when: a definition states a key formula but has **zero
   derivation steps**; a motivation is **< ~45 words**; or a 🟢-core lesson has **no display formula**.
   Genuine definition-only lessons (author-marked) are exempt from the derivation check.

---

## Fix recipe (per failure mode)

- **Mode 1 (copy-paste §5) — the main job.** For each boilerplate lesson, write **≥6 applications that
  re-derive from the lesson's own worked object** (its function, matrix, chain, transfer function).
  Rule of thumb: *every §5 "numbers" field must contain a quantity you can only get by using this
  lesson's concept.* Author these in `tools/math-authored.js` keyed by lesson id, then regenerate.
- **Mode 2 (filler motivation) — §1/§2 are a warm welcome, not a hook or a list.** Replace stock openers
  with warm, inviting prose. **§1 Connections** should read like a teacher welcoming the learner in and
  showing them around the neighborhood — what they already have that makes this easy, and the exciting places
  it leads — **as flowing prose, never a *builds-on / used-with / leads-to* bullet list.** **§2 Motivation &
  Intuition** is a warm, plain-English explanation that carries **real intuition** for the idea itself. A
  one-line hook is *not* sufficient. See the full-depth model entry `math-02-13` in
  [`math/math-part-02-…`](math/math-part-02-multivariable-vector-calculus.md).
- **Mode 3 (filler definition).** Delete authoring boilerplate; **derive the key property** (Laplacian
  quadratic form, ELBO bound, condition-number formula) instead of asserting it, per the spec.
- **Mode 4 (LaTeX).** Scriptable pre-pass (see Appendix): balance `$` in every field and repair matrix
  `\\` row breaks. Add a `gen-math.js` lint that **fails the build on any field with an odd `$` count**
  (ignoring `\$`), so this can't regress.
- **Mode 5 (grammar).** Stop templating the concept name into a fixed sentence; write the sentence.
- **Modes 6–8 (assert-not-derive / under-presented formula / no "why") — the exposition job.** Land the
  structural change above (add a `derivation` field + a **📜 Why it's true** card in `renderMath`,
  optionally `symbols`/`formula`); require **build-up → $$formula$$ → complete step-by-step derivation →
  assumptions** in the spec. Derivations are **every-step and reproducible**, written in **plain textbook
  voice** (warm and clear, not poetic — see the four principles), and applied **case-by-case** — skipped
  (not faked) for definition-only lessons. The formula appears in display form with each symbol's role stated.
- **Mode 9 (thin intuition).** Expand sub-~45-word motivations into a clear explanation: what the reader
  already knows → the concrete gap → the load-bearing idea, in plain language (no forced metaphor).

---

## Prioritized rollout

1. **Mechanical LaTeX pass (hours, scriptable).** Fix the ~59 unclosed-`$` fields + matrix breaks in
   Numerical analysis (12) and Real analysis (8); add the odd-`$` build lint. Instant visible win.
2. **High-impact, high-ML-centrality §5 rewrites first** — the concepts learners actually reach for:
   **§2 gradient family (math-02-13,14,17,18,20,22,25)**, **§15 graph Laplacian + spectral (15-22→27)**,
   **§19 stationary/limiting/MCMC (19-06,07,18)**, **§21 info-theory coding block (21-11→20)**,
   **§8 conditioning/stability (08-06,07)**.
3. **Whole-section boilerplate cleanup** by exposure count: Multivariable (27) → Control (17) →
   Numerical (12) → Stochastic (12) → Information (10) → Graph (9) → Dynamical (6) → Linear algebra (5).
4. **Motivation/definition deepening** for the C samples and their section-mates; leave the 20 **A**
   lessons as the reference bar (cite them in the authoring spec as gold examples).
5. **Exposition upgrade (structural, one-time → then per-lesson).** Land the schema/renderer change (add
   `derivation` + a "Why it's true" card, optionally `symbols`/`formula`), update the spec and add the
   lints, then backfill derivations — **core 🟢 lessons first**, and prioritize the hardest topics (real
   & functional analysis, measure theory, CLT, spectral/eigen) since they suffer most from assert-only depth.

**Definition of done (per lesson):** §5 has ≥6 concept-specific, re-derivable applications; no shared
title-set with a sibling; motivation names a concrete stuck-problem and is ≥ ~45 words; **if the lesson
has a non-obvious formula, the key property is derived with complete, reproducible, every-step work in a
warm voice — otherwise (definition-only) it's explained warmly with no forced proof**; the formula appears
in **display form with every important symbol explained in plain English (no symbol used before it's
defined)**; zero odd-`$` fields. **Track-level:** the Appendix scans report `boilerplate §5 = 0`, `unclosed-$ = 0`, and (on core lessons) `no-derivation-cue`,
`no-display-formula`, and `thin-motivation` trending to 0.

---

## Appendix — reproduce the scans

Run from the repo root. Each mocks `window`, `eval`s the `math-*.js` files, and inspects the objects.

- **Boilerplate §5 (shared application-title sets)** — `/tmp/dupcheck.js` in the working notes; core idea:
  group lessons by `applications.map(a=>a.title).join('|')`; any group of size ≥2 is boilerplate.
  Current: **98/689 (14%)**.
- **Unclosed `$`** — flag any field where `s.replace(/\\\$/g,'').match(/\$/g).length` is odd.
  Current: **25 lessons / ~59 `numbers` fields**, mostly sections 8 and 4.
- **Templated openers** — count shared first-8-words of `motivation`. Current: **64 lessons** on 7 stock openers.
- **Exposition depth** — per `definition`/`motivation`: display-formula present (`/\$\$/`), derivation-cue
  present (`/because|since|follows from|expand|thus|hence/i`), word counts, and the templated tail
  (`/Assumptions that matter/`). Current: **72% no display formula, 53% no derivation cue, 44% motivations
  ≤55 words, 100% carry the "Assumptions that matter:" tail.**
- **Per-section defect table** — `/tmp/final.js` reproduces the TL;DR table exactly.
- **Per-section worklists** — `node tools/gen-section-plans.js` regenerates all 27 `plans/math/math-part-NN-*.md`
  files and `plans/math/_index-table.generated.md` (every per-lesson flag is computed from the lesson objects).

*Gold-standard references to cite in `MATH-LESSON-STRUCTURE.md`: `math-01-13`, `math-09-18`,
`math-11-18`, `math-22-05`, `math-27-13` (and the existing `math-03-27` Laplace transform).*
