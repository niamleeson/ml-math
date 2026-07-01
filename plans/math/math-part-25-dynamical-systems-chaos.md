# Math · Part 25 — Dynamical systems & chaos  (deep-authored reference)

> **Per-section execution plan.** Load together with the master
> [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) for the four
> exposition principles and Definition of Done. Every numeric claim below was checked with `python3` using
> `sympy` and `numpy`; checks covered fixed points, derivative signs, map iterates, Jacobian eigenvalues,
> logistic-map values, period-2 multipliers, Lyapunov exponents, and fractal dimensions.

**Section:** Dynamical systems & chaos · **Lessons:** 20 · **Breadcrumb:** `Mathematics · Applied / Computational` · **Priority:** STANDARD (targeted deepening)

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| §5 boilerplate — lessons `math-25-14`…`math-25-19` share _Iterated algorithms · Simulation step size · Population fractions · Optimizer updates · Recurrent networks · Digital filters_ | 6 / 20 |
| Templated / thin motivation | 1 / 20 |
| Key formula not in display form | 16 / 20 |
| Genuine LaTeX bugs: unclosed dollar sign or lost matrix row break | 0 / 20 |
| Derivations to author or deepen | 17 / 20 |
| Explain-only concept lessons | 3 / 20 |

**The core change:** keep the strong local-dynamics spine of the section, but author every lesson as a real
per-lesson spec: complete derivations where formulas drive the concept, plain symbol glosses, and six
applications whose numbers can be recomputed from that lesson's own idea.

---

## Priority & systemic issues

- **Shared §5 block — 6 lessons:** `math-25-14`…`math-25-19` currently reuse the same six application titles and mostly generic iteration numbers. Replace them with map stability, logistic-map, period-doubling, Lyapunov-exponent, strange-attractor, and fractal-dimension computations.
- **Formula display and derivation depth:** promote the fixed-point tests, bifurcation normal forms, Jacobian/eigenvalue rules, Lyapunov decrease formula, discrete-map multiplier rule, logistic-map stability interval, Lyapunov exponent, and similarity dimension to display math, then derive them step by step.
- **LaTeX bug review:** no genuine unclosed dollar sign and no lost matrix row break were found in the current Part 25 dump. Expressions such as `$f(x)<0$` are valid and should not be flagged.

---

## Model entry (full prose)

### `math-25-04` — Stability of fixed points  — **full-depth model entry**

**Connections (§1).**
> This lesson builds on one-dimensional flows, fixed points, and derivatives. A fixed point tells where motion can stop; stability tells whether nearby states stay near that stopping point or drift away. The derivative is the local measuring tool, because it tells how the rule changes when the state is moved slightly off the fixed point.
>
> This distinction appears throughout the rest of the section. Bifurcations happen when fixed points gain or lose stability. Linear systems classify equilibria by eigenvalues, which are the multidimensional version of local multipliers. Discrete maps, the logistic map, period doubling, and RNN stability all reuse the same local question: if a small error is introduced, does the next bit of dynamics shrink it or enlarge it?

**Motivation & Intuition (§2).**
> A fixed point is not automatically a safe resting place. For the flow $\dot x=x(4-x)$, both $x=0$ and $x=4$ are fixed points, because the velocity is zero at both places. But they behave differently. If the state starts just above $0$, the velocity is positive and the state moves away from $0$. If the state starts just below $4$, the velocity is positive, and if it starts just above $4$, the velocity is negative; both sides move back toward $4$.
>
> Stability names that local behavior. A stable fixed point holds nearby states close. An asymptotically stable fixed point does more: it pulls nearby states toward itself over time. In one-dimensional continuous time, the sign of $f'(x^*)$ gives the local answer. A negative derivative means the velocity points back toward the equilibrium on both sides. A positive derivative means the velocity points away.
>
> Discrete maps use the same idea with one important change. The local error is multiplied from one step to the next. If the multiplier has absolute value below $1$, errors shrink; if it has absolute value above $1$, errors grow. That is why the continuous-time test reads $f'(x^*)<0$, while the discrete-time test reads $|F'(x^*)|<1$.

**Definition & Assumptions (§3).** Display
$$
\dot x=f(x),\qquad f(x^*)=0,\qquad x_{n+1}=F(x_n),\qquad F(x^*)=x^*.
$$
Then derive both local tests:
1. Let $e=x-x^*$ — this measures a small displacement from the fixed point.
2. Use first-order Taylor expansion, $f(x^*+e)=f(x^*)+f'(x^*)e+O(e^2)$ — near the fixed point, the derivative gives the leading change.
3. Use $f(x^*)=0$ to get $\dot e=\dot x\approx f'(x^*)e$ — the constant velocity term vanishes at an equilibrium.
4. Solve the linear error equation, $e(t)\approx e(0)e^{f'(x^*)t}$ — a constant-coefficient scalar ODE has exponential solutions.
5. If $f'(x^*)<0$, the exponential decays — nearby errors shrink toward zero, so the fixed point attracts locally.
6. If $f'(x^*)>0$, the exponential grows — nearby errors move away, so the fixed point repels locally.
7. For a map, set $e_n=x_n-x^*$ — now the error is measured at integer times.
8. Taylor expand $F(x^*+e_n)=F(x^*)+F'(x^*)e_n+O(e_n^2)$ — the derivative is the local step multiplier.
9. Use $F(x^*)=x^*$ to get $e_{n+1}\approx F'(x^*)e_n$ — subtract the fixed point from both sides.
10. Iterate the error rule, $e_n\approx (F'(x^*))^n e_0$ — each step multiplies by the same local factor.
11. Therefore $|F'(x^*)|<1$ gives attraction and $|F'(x^*)|>1$ gives repulsion — powers shrink only when the multiplier's absolute value is below $1$.

**Symbols.** $x$ is the state; $x^*$ is a fixed point or equilibrium; $f$ is a continuous-time velocity field; $F$ is a discrete-time update map; $f'(x^*)$ is the local continuous-time slope of the velocity; $F'(x^*)$ is the local discrete-time multiplier; $e$ or $e_n$ is a small displacement from the fixed point.

**Real-World Applications (§5).**
1. **Population equilibrium** — for $\dot x=x(4-x)$, $f'(x)=4-2x$; $f'(0)=4>0$ makes $0$ repelling, while $f'(4)=-4<0$ makes $4$ attracting.
2. **Learning-rate stability** — gradient descent on $L(w)=3w^2$ gives $w_{k+1}=(1-6\eta)w_k$; with $\eta=0.1$, the multiplier is $0.4$, so five steps shrink error by $0.4^5=0.01024$.
3. **Discrete recommender feedback** — $x_{n+1}=0.6x_n+2$ has fixed point $5$ and multiplier $0.6$, so a unit error becomes $0.6^5=0.07776$ after five updates.
4. **Unstable scalar policy** — $x_{n+1}=1.1x_n$ has fixed point $0$ but multiplier $1.1$, so a unit perturbation grows to $1.1^5=1.61051$.
5. **Logistic-map fixed point** — for $F(x)=2.5x(1-x)$, $x^*=1-1/2.5=0.6$ and $F'(x^*)=-0.5$, so the fixed point attracts with alternating errors.
6. **ODE error correction** — $\dot e=-0.2e$ has $f'(0)=-0.2$, so an error of $10$ decays to $10e^{-1}\approx3.68$ after $5$ time units.

---

## Per-lesson change specs

**How to read these specs.** Each block is drafted content for one lesson. The labels are plan shorthand; in the app they become flowing prose in the same plain textbook voice as the model entry. Every lesson has exactly six concept-specific applications with recomputable numbers.

### `math-25-01` — States and evolution  · deepen · explain-only

**Connections (§1).**
> This opening lesson connects ordinary sequences, differential equations, optimization updates, and recurrent models under one shared vocabulary. The state is the information the system needs at a given time, and the evolution rule tells how that state moves forward. Some systems move in separate steps, while others move continuously through time. Once those choices are clear, later ideas such as fixed points, stability, and chaos have a concrete object to describe.

**Motivation & Intuition (§2).**
> A dynamical system begins with a bookkeeping choice. The state must contain enough information to continue the evolution without looking further into the past. For a queue, that might be the current number of jobs; for a physical particle, it may include position and velocity; for an RNN, it is the hidden state together with the incoming input.
>
> After the state is chosen, the evolution rule says how time advances. In discrete time, the rule produces $x_{t+1}$ from $x_t$. In continuous time, the rule gives a velocity $\dot x=f(x)$, and the trajectory is the curve generated from an initial condition. This lesson is explain-only because the main mathematical skill is recognizing the right state and interpreting the resulting trajectory.

**Definition & Assumptions (§3).**
- **Derive (complete).** Explain-only: the lesson introduces the vocabulary of state, rule, trajectory, initial condition, and time indexing. Show one short iteration example, but do not force a proof.

**Symbols.** $x_t$ state at discrete time $t$; $x(t)$ state at continuous time $t$; $F$ update rule; $f$ velocity field; $x_0$ initial state; trajectory is the sequence or curve generated from the initial state.

**Real-World Applications (§5).**
1. **Optimizer state** — $w_{t+1}=0.5w_t+3$ from $w_0=4$ gives $w_1=5$, $w_2=5.5$, $w_3=5.75$.
2. **RNN hidden state** — $h_{t+1}=0.5h_t+x_t$, $h_0=0$, inputs $2,4$ give $h_1=2$, $h_2=5$.
3. **Epidemic count** — multiplying infections by $1.2$ from $100$ gives $100(1.2)^2=144$ after two days.
4. **Physics state** — $p_{t+1}=p_t+0.1v_t$, $p_0=5$, $v_0=3$ gives $p_1=5.3$.
5. **Markov probability state** — $[0.7,0.3]$ with rows $[0.8,0.2]$, $[0.1,0.9]$ gives first new probability $0.7(0.8)+0.3(0.1)=0.59$.
6. **Queue length** — $12$ jobs plus $5$ arrivals minus $7$ completions gives state $10$.

### `math-25-02` — One-dimensional flows  · deepen derivation

**Connections (§1).**
> This lesson builds directly on the idea of a continuous-time state. In one dimension, the whole velocity field can be read on a number line, so the sign of the velocity becomes a simple guide to motion. That sign language prepares the fixed-point and stability tests that follow. It also gives a gentle first version of the phase-line reasoning used in bifurcation diagrams.

**Motivation & Intuition (§2).**
> In one dimension, motion has only two directions. If $\dot x=f(x)$ is positive, the state moves to the right on the number line; if it is negative, the state moves to the left. A zero of $f$ is a point where the instantaneous motion stops.
>
> This makes a sign chart surprisingly informative. The actual solution curve may require integration, but the direction of motion follows immediately from the sign of the velocity field. That is why one-dimensional flows are the natural place to learn phase-line reasoning before moving to fixed-point stability and bifurcations.

**Definition & Assumptions (§3).**
- **Derive (complete).**
  1. Start with $\dot x=f(x)$ — velocity is the time derivative of state.
  2. Over a small positive time step $\Delta t$, write $x(t+\Delta t)-x(t)\approx f(x(t))\Delta t$ — this is the first-order meaning of a derivative.
  3. Because $\Delta t>0$, the sign of the change is the sign of $f(x)$ — multiplying by a positive time step preserves sign.
  4. If $f(x)>0$, then $x$ increases; if $f(x)<0$, then $x$ decreases; if $f(x)=0$, the state is instantaneously stationary.
  5. Zeros of $f$ split the line into intervals — for continuous $f$, the sign can change only by passing through a zero.

**Symbols.** $x$ is the scalar state; $t$ is continuous time; $\dot x$ is velocity; $f(x)$ is the velocity field; $\Delta t$ is a small positive time step.

**Real-World Applications (§5).**
1. **Error decay** — $\dot e=-0.2e$ at $e=5$ has velocity $-1$, so over $0.1$ time units the first-order change is about $-0.1$.
2. **Population flow** — $\dot x=0.1x(100-x)$ gives velocity $160$ at $x=20$ and $-240$ at $x=120$.
3. **Thermostat relaxation** — $\dot T=0.3(70-T)$ gives $3$ at $T=60$ and $-3$ at $T=80$.
4. **Inventory correction** — $\dot q=12-q$ gives velocity $5$ at $q=7$ and $-3$ at $q=15$.
5. **Model calibration gap** — $\dot c=-0.4(c-1)$ gives velocity $0.8$ at $c=-1$ and $-0.4$ at $c=2$.
6. **Activation relaxation** — $\dot a=a(1-a)$ gives positive velocity $0.21$ at $a=0.3$ and negative velocity $-0.24$ at $a=1.2$.

### `math-25-03` — Fixed points  · deepen derivation

**Connections (§1).**
> This lesson follows naturally from states and evolution rules. Once a system has a rule for moving, it is important to identify the states where the rule produces no motion or no change. Those states are fixed points, also called equilibria in continuous time. They become the anchors for stability, bifurcation, and local linearization throughout the section.

**Motivation & Intuition (§2).**
> A fixed point is the first place to look when studying long-run behavior. It is a state that the dynamics leave unchanged, so it can serve as a resting state, an operating point, or a candidate limit of motion. In a map, the state returns to itself after one update; in a flow, the velocity is zero.
>
> Finding fixed points is an algebraic task, but interpreting them is a dynamical task. Solving $F(x)=x$ or $f(x)=0$ only says where motion can stop. Stability is a separate question about what nearby states do, and that separation keeps the later tests clear.

**Definition & Assumptions (§3).**
- **Derive (complete).**
  1. For a map, fixed means no change after one update, so write $x^*=F(x^*)$.
  2. For a flow, fixed means no instantaneous motion, so write $\dot x=f(x^*)=0$.
  3. Solve the resulting algebraic equation — fixed points are candidates found by ordinary algebra.
  4. Check the domain — an algebraic solution outside the modeled state space is not a valid fixed point.
  5. Keep stability separate — solving for $x^*$ finds where motion can stop, not whether nearby motion returns.

**Symbols.** $x^*$ is a fixed point; $F$ is a discrete update; $f$ is a continuous velocity; domain is the allowed state set.

**Real-World Applications (§5).**
1. **Linear map** — $x=0.5x+3$ gives $x^*=6$.
2. **Continuous logistic flow** — $x(4-x)=0$ gives equilibria $0$ and $4$.
3. **Training update** — $w^+=w-0.1(2w-4)$ is fixed when $2w-4=0$, so $w^*=2$.
4. **RNN without input** — $h^+=0.8h$ has fixed point $0$.
5. **Affine RNN bias** — $h^+=0.7h+1.5$ gives $h^*=5$.
6. **Probability smoothing** — $p^+=0.9p+0.05$ gives $p^*=0.5$.

### `math-25-04` — Stability of fixed points  · full-depth model entry

**Connections (§1).**
> This lesson builds on one-dimensional flows, fixed points, and derivatives. A fixed point tells where motion can stop; stability tells whether nearby states stay near that stopping point or drift away. The derivative is the local measuring tool, because it tells how the rule changes when the state is moved slightly off the fixed point.
>
> This distinction appears throughout the rest of the section. Bifurcations happen when fixed points gain or lose stability. Linear systems classify equilibria by eigenvalues, which are the multidimensional version of local multipliers. Discrete maps, the logistic map, period doubling, and RNN stability all reuse the same local question: if a small error is introduced, does the next bit of dynamics shrink it or enlarge it?

**Motivation & Intuition (§2).**
> A fixed point is not automatically a safe resting place. For the flow $\dot x=x(4-x)$, both $x=0$ and $x=4$ are fixed points, because the velocity is zero at both places. But they behave differently. If the state starts just above $0$, the velocity is positive and the state moves away from $0$. If the state starts just below $4$, the velocity is positive, and if it starts just above $4$, the velocity is negative; both sides move back toward $4$.
>
> Stability names that local behavior. A stable fixed point holds nearby states close. An asymptotically stable fixed point does more: it pulls nearby states toward itself over time. In one-dimensional continuous time, the sign of $f'(x^*)$ gives the local answer. A negative derivative means the velocity points back toward the equilibrium on both sides. A positive derivative means the velocity points away.
>
> Discrete maps use the same idea with one important change. The local error is multiplied from one step to the next. If the multiplier has absolute value below $1$, errors shrink; if it has absolute value above $1$, errors grow. That is why the continuous-time test reads $f'(x^*)<0$, while the discrete-time test reads $|F'(x^*)|<1$.

**Definition & Assumptions (§3).** Display
$$
\dot x=f(x),\qquad f(x^*)=0,\qquad x_{n+1}=F(x_n),\qquad F(x^*)=x^*.
$$
Then derive both local tests:
1. Let $e=x-x^*$ — this measures a small displacement from the fixed point.
2. Use first-order Taylor expansion, $f(x^*+e)=f(x^*)+f'(x^*)e+O(e^2)$ — near the fixed point, the derivative gives the leading change.
3. Use $f(x^*)=0$ to get $\dot e=\dot x\approx f'(x^*)e$ — the constant velocity term vanishes at an equilibrium.
4. Solve the linear error equation, $e(t)\approx e(0)e^{f'(x^*)t}$ — a constant-coefficient scalar ODE has exponential solutions.
5. If $f'(x^*)<0$, the exponential decays — nearby errors shrink toward zero, so the fixed point attracts locally.
6. If $f'(x^*)>0$, the exponential grows — nearby errors move away, so the fixed point repels locally.
7. For a map, set $e_n=x_n-x^*$ — now the error is measured at integer times.
8. Taylor expand $F(x^*+e_n)=F(x^*)+F'(x^*)e_n+O(e_n^2)$ — the derivative is the local step multiplier.
9. Use $F(x^*)=x^*$ to get $e_{n+1}\approx F'(x^*)e_n$ — subtract the fixed point from both sides.
10. Iterate the error rule, $e_n\approx (F'(x^*))^n e_0$ — each step multiplies by the same local factor.
11. Therefore $|F'(x^*)|<1$ gives attraction and $|F'(x^*)|>1$ gives repulsion — powers shrink only when the multiplier's absolute value is below $1$.

**Symbols.** $x$ is the state; $x^*$ is a fixed point or equilibrium; $f$ is a continuous-time velocity field; $F$ is a discrete-time update map; $f'(x^*)$ is the local continuous-time slope of the velocity; $F'(x^*)$ is the local discrete-time multiplier; $e$ or $e_n$ is a small displacement from the fixed point.

**Real-World Applications (§5).**
1. **Population equilibrium** — for $\dot x=x(4-x)$, $f'(x)=4-2x$; $f'(0)=4>0$ makes $0$ repelling, while $f'(4)=-4<0$ makes $4$ attracting.
2. **Learning-rate stability** — gradient descent on $L(w)=3w^2$ gives $w_{k+1}=(1-6\eta)w_k$; with $\eta=0.1$, the multiplier is $0.4$, so five steps shrink error by $0.4^5=0.01024$.
3. **Discrete recommender feedback** — $x_{n+1}=0.6x_n+2$ has fixed point $5$ and multiplier $0.6$, so a unit error becomes $0.6^5=0.07776$ after five updates.
4. **Unstable scalar policy** — $x_{n+1}=1.1x_n$ has fixed point $0$ but multiplier $1.1$, so a unit perturbation grows to $1.1^5=1.61051$.
5. **Logistic-map fixed point** — for $F(x)=2.5x(1-x)$, $x^*=1-1/2.5=0.6$ and $F'(x^*)=-0.5$, so the fixed point attracts with alternating errors.
6. **ODE error correction** — $\dot e=-0.2e$ has $f'(0)=-0.2$, so an error of $10$ decays to $10e^{-1}\approx3.68$ after $5$ time units.

### `math-25-05` — Saddle-node bifurcations  · deepen derivation

**Connections (§1).**
> This lesson uses fixed points and one-dimensional stability to study what happens when a parameter changes. Instead of treating equilibria as permanent, a bifurcation treats them as features that can be created, destroyed, or rearranged. The saddle-node case is the basic local model for a threshold where two equilibria meet. It gives a precise language for sudden loss of an operating state.

**Motivation & Intuition (§2).**
> A saddle-node bifurcation describes a local threshold. For $r>0$ in the normal form, there are two equilibria; at $r=0$, they meet; for $r<0$, no real equilibria remain. The square root branches make the collision visible in the equation itself.
>
> The derivative then labels the two sides before the collision. One branch attracts and the other repels, so the pair is not two copies of the same behavior. At the critical value the ordinary derivative test becomes inconclusive, which is exactly where bifurcation analysis is needed.

**Definition & Assumptions (§3).**
- **Derive (complete).**
  1. Start with $\dot x=r-x^2$ — $r$ is the control parameter.
  2. Set the velocity to zero, $r-x^2=0$ — fixed points occur where motion stops.
  3. Rearrange to $x^2=r$ — isolate the square.
  4. If $r>0$, take square roots to get $x^*=\pm\sqrt r$ — two real equilibria exist.
  5. If $r=0$, both branches meet at $x^*=0$ — the two roots have coalesced.
  6. If $r<0$, no real $x$ satisfies $x^2=r$ — the equilibria disappear from the real phase line.
  7. Compute $f'(x)=-2x$ — the derivative gives local stability away from the collision.
  8. At $x=\sqrt r$, $f'<0$ so the right branch attracts; at $x=-\sqrt r$, $f'>0$ so the left branch repels.

**Symbols.** $r$ is a real parameter; $x$ is the state; $x^*$ is an equilibrium; $f'(x^*)$ is the local stability slope.

**Real-World Applications (§5).**
1. **Normal-form count** — at $r=4$, equilibria are $-2$ and $2$.
2. **Approaching the fold** — at $r=0.25$, equilibria are $-0.5$ and $0.5$, only $1$ apart.
3. **Critical value** — at $r=0$, the repeated equilibrium is $0$ and $f'(0)=0$, so the usual stability test is inconclusive.
4. **After disappearance** — at $r=-1$, there are no real fixed points.
5. **Stability labels** — for $r=1$, $x=-1$ has $f'=2$ and repels, while $x=1$ has $f'=-2$ and attracts.
6. **System threshold** — if an operating point exists only when $r>0$, changing $r$ from $0.09$ to $-0.01$ removes the two local equilibria $\pm0.3$.

### `math-25-06` — Transcritical and pitchfork bifurcations  · deepen derivation

**Connections (§1).**
> This lesson continues the bifurcation story after the saddle-node case. Transcritical and pitchfork bifurcations both show equilibria changing stability as a parameter crosses a critical value. The algebra is still one-dimensional, but the branch structure is richer. These examples prepare the reader to interpret stability diagrams as organized families of fixed points, not isolated calculations.

**Motivation & Intuition (§2).**
> Transcritical bifurcations are about exchange. Two equilibrium branches cross, and their stability signs trade places as the parameter changes. The factorization $x(r-x)$ makes both branches explicit and lets the derivative show the exchange.
>
> Pitchfork bifurcations add symmetry. The origin exists for every parameter value, while a symmetric pair of nonzero equilibria appears when the square root becomes real. In the supercritical normal form used here, the center branch loses stability and the two outer branches become attracting.

**Definition & Assumptions (§3).**
- **Derive (complete).**
  1. Transcritical form: $\dot x=rx-x^2=x(r-x)$ — factoring exposes the branches.
  2. Set $x(r-x)=0$ to get $x^*=0$ and $x^*=r$ — each factor can vanish.
  3. Compute $f'(x)=r-2x$ — the slope controls one-dimensional stability.
  4. At $x=0$, $f'=r$; at $x=r$, $f'=-r$ — their stability signs exchange as $r$ crosses $0$.
  5. Pitchfork form: $\dot x=rx-x^3=x(r-x^2)$ — symmetry produces paired nonzero roots.
  6. Set $x(r-x^2)=0$ to get $x^*=0$ always and $x^*=\pm\sqrt r$ when $r>0$.
  7. Compute $f'(x)=r-3x^2$ — evaluate stability on each branch.
  8. At $x=0$, $f'=r$; at $x=\pm\sqrt r$, $f'=-2r<0$ for $r>0$ — the center branch loses stability and the two outer branches attract.

**Symbols.** $r$ is the bifurcation parameter; $x^*$ is an equilibrium branch; $f'$ is the local slope; pitchfork symmetry is the invariance under $x\mapsto -x$.

**Real-World Applications (§5).**
1. **Transcritical at $r=2$** — equilibria are $0$ and $2$; slopes $2$ and $-2$ make $0$ repelling and $2$ attracting.
2. **Transcritical at $r=-1$** — equilibria are $0$ and $-1$; slopes $-1$ and $1$ swap the stability.
3. **Pitchfork at $r=4$** — equilibria are $0$, $-2$, and $2$; slopes are $4$, $-8$, and $-8$.
4. **Pitchfork just after onset** — at $r=0.09$, outer equilibria are $\pm0.3$.
5. **Pitchfork before onset** — at $r=-0.25$, only $x=0$ is real and its slope is $-0.25$, so it attracts locally.
6. **Symmetric model choice** — if a two-sided preference model uses $r=1.44$, the two nonzero stable states are $\pm1.2$.

### `math-25-07` — Two-dimensional linear systems  · deepen derivation

**Connections (§1).**
> This lesson moves from scalar flows to two-dimensional linear systems. The state is now a vector, and the evolution rule is a matrix, but the main stability idea remains local growth or decay. Eigenvectors supply special directions where the vector system behaves like a scalar exponential. Eigenvalues then become the natural multidimensional version of growth rates.

**Motivation & Intuition (§2).**
> A matrix differential equation may mix coordinates, so the coordinate axes are not always the simplest directions to study. Eigenvectors solve that problem by identifying directions that the matrix only stretches, shrinks, or reverses. Along one of those directions, the vector equation reduces to the scalar equation $\dot c=\lambda c$.
>
> This reduction explains why eigenvalues classify local linear behavior. Negative real parts mean exponential decay, positive real parts mean growth, and imaginary parts produce rotation or oscillation. The same idea will reappear when nonlinear systems are linearized by their Jacobian matrices.

**Definition & Assumptions (§3).**
- **Derive (complete).**
  1. Start with $\dot{\mathbf x}=A\mathbf x$ — the state is a vector and $A$ gives the velocity rule.
  2. Suppose $A\mathbf v=\lambda\mathbf v$ — along an eigenvector, the matrix only rescales direction.
  3. Try a solution $\mathbf x(t)=c(t)\mathbf v$ — motion stays on the eigenvector line.
  4. Differentiate to get $\dot{\mathbf x}=\dot c(t)\mathbf v$ — $\mathbf v$ is constant.
  5. Substitute into the ODE: $\dot c\mathbf v=A(c\mathbf v)=c\lambda\mathbf v$ — use the eigenvalue equation.
  6. Cancel $\mathbf v$ to get $\dot c=\lambda c$ — the vector problem reduces to a scalar one.
  7. Solve $c(t)=c(0)e^{\lambda t}$ — eigenvalues set growth, decay, or oscillation.

**Symbols.** $\mathbf x=(x,y)^T$ is the state vector; $A$ is a $2\times2$ rate matrix; $\mathbf v$ is an eigenvector; $\lambda$ is an eigenvalue; $c(t)$ is the coordinate along that eigenvector.

**Real-World Applications (§5).**
1. **Diagonal decay** — $A=\begin{pmatrix}-1&0\\0&-3\end{pmatrix}$ has eigenvalues $-1,-3$, so both directions decay.
2. **Second-order system** — $A=\begin{pmatrix}0&1\\-2&-3\end{pmatrix}$ has eigenvalues $-1,-2$, so the origin is stable.
3. **Pure rotation** — $A=\begin{pmatrix}0&-2\\2&0\end{pmatrix}$ has eigenvalues $\pm2i$, so the linear motion rotates with angular speed $2$.
4. **Saddle matrix** — $A=\begin{pmatrix}1&2\\3&1\end{pmatrix}$ has eigenvalues $3.449$ and $-1.449$, so one direction grows and one decays.
5. **Mode time scale** — eigenvalue $-4$ gives time constant $1/4=0.25$.
6. **Latent linear dynamics** — if a learned 2-D latent model has eigenvalues $0.8$ and $1.2$ per step, the second mode grows by $1.2^5=2.488$ in five steps.

### `math-25-08` — Phase portraits  · AUTHOR derivation

**Connections (§1).**
> This lesson turns two-dimensional differential equations into geometric pictures. A phase portrait records how the vector field points across the plane, where motion stops, and how representative trajectories move. Nullclines make the picture easier to read because they mark where one component of velocity vanishes. The result is a bridge between formulas and visible motion.

**Motivation & Intuition (§2).**
> A formula for a planar vector field gives a velocity at every point, but the overall motion can be hard to see from equations alone. A phase portrait organizes that information visually. Arrows show local velocity, trajectories follow those arrows, and equilibria mark places where both velocity components vanish.
>
> Nullclines are useful because they remove one component of motion at a time. On an $x$-nullcline the arrow is vertical or zero, and on a $y$-nullcline the arrow is horizontal or zero. Their intersections give equilibrium candidates, while the surrounding arrows show how nearby trajectories move.

**Definition & Assumptions (§3).**
- **Derive (complete).**
  1. Start with $\dot x=f(x,y)$ and $\dot y=g(x,y)$ — each point has a velocity vector $(f,g)$.
  2. A trajectory has tangent $(\dot x,\dot y)$ — by definition, velocity is tangent to the path.
  3. On an $x$-nullcline, $f(x,y)=0$ — the horizontal component of velocity vanishes.
  4. Therefore arrows on an $x$-nullcline are vertical or zero — only $\dot y$ can remain.
  5. On a $y$-nullcline, $g(x,y)=0$ — the vertical component vanishes.
  6. Therefore arrows on a $y$-nullcline are horizontal or zero — only $\dot x$ can remain.
  7. Where both nullclines meet, $(f,g)=(0,0)$ — the point is an equilibrium.

**Symbols.** $(x,y)$ is the state; $(f,g)$ is the vector field; nullcline means a curve where one velocity component is zero; trajectory means a solution curve.

**Real-World Applications (§5).**
1. **Nullcline intersection** — for $\dot x=y-x$, $\dot y=1-x-y$, nullclines $y=x$ and $y=1-x$ meet at $(0.5,0.5)$.
2. **Vertical arrow check** — at $(1,1)$ in the same system, $\dot x=0$ and $\dot y=-1$, so the arrow is straight down.
3. **Horizontal arrow check** — at $(0,1)$, $\dot y=0$ and $\dot x=1$, so the arrow is rightward.
4. **Predator-prey equilibrium** — $\dot x=x(2-y)$, $\dot y=y(x-1)$ has positive equilibrium $(1,2)$.
5. **Learning two parameters** — if $\dot w_1=-2w_1$, $\dot w_2=-w_2$, then at $(3,4)$ the arrow is $(-6,-4)$.
6. **Vector-field magnitude** — for $\dot x=y$, $\dot y=-x$ at $(3,4)$, velocity is $(4,-3)$ with speed $5$.

### `math-25-09` — Classification of equilibria  · deepen derivation

**Connections (§1).**
> This lesson builds on two-dimensional linear systems and eigenvalues. For a $2\times2$ system, trace and determinant summarize the characteristic polynomial, so they carry much of the local stability information. The classification separates saddles, nodes, spirals, and centers by how eigenvalues behave. This gives a compact way to read phase portraits near equilibria.

**Motivation & Intuition (§2).**
> For a two-dimensional linear system, the eigenvalues determine whether nearby states decay, grow, spiral, or move along saddle directions. Computing eigenvalues directly is often simple, but trace and determinant reveal much of the answer before solving the quadratic. They are the sum and product information built into the characteristic polynomial.
>
> The determinant first separates saddles from non-saddles because a negative product means eigenvalues with opposite signs. When the determinant is positive, the trace tells whether the real parts lean toward decay or growth. The discriminant then separates real nodes from complex spirals or centers.

**Definition & Assumptions (§3).**
- **Derive (complete).**
  1. For $A=\begin{pmatrix}a&b\\c&d\end{pmatrix}$, eigenvalues solve $\det(A-\lambda I)=0$ — this is the eigenvalue definition.
  2. Compute $\det\begin{pmatrix}a-\lambda&b\\c&d-\lambda\end{pmatrix}=(a-\lambda)(d-\lambda)-bc$ — expand the determinant.
  3. Expand to $\lambda^2-(a+d)\lambda+(ad-bc)=0$ — collect powers of $\lambda$.
  4. Name $\tau=a+d=\operatorname{tr}(A)$ and $\Delta=ad-bc=\det(A)$ — trace and determinant are the polynomial coefficients.
  5. The discriminant $\tau^2-4\Delta$ decides real versus complex eigenvalues — it is the quadratic formula discriminant.
  6. If $\Delta<0$, the eigenvalues have opposite signs — their product is negative, so the equilibrium is a saddle.
  7. If $\Delta>0$ and $\tau<0$, real parts are negative; if $\Delta>0$ and $\tau>0$, real parts are positive — the trace is the sum of eigenvalues.

**Symbols.** $A$ is the linearization matrix; $\tau$ is trace; $\Delta$ is determinant; eigenvalues $\lambda$ determine node, saddle, spiral, or center behavior.

**Real-World Applications (§5).**
1. **Stable node** — $A=\operatorname{diag}(-1,-3)$ has $\tau=-4$, $\Delta=3$, eigenvalues $-1,-3$.
2. **Source** — $A=\operatorname{diag}(2,5)$ has $\tau=7$, $\Delta=10$, so both eigenvalues are positive.
3. **Saddle** — $A=\begin{pmatrix}1&2\\3&1\end{pmatrix}$ has $\tau=2$, $\Delta=-5$, eigenvalues $3.449$ and $-1.449$.
4. **Center** — $A=\begin{pmatrix}0&-2\\2&0\end{pmatrix}$ has $\tau=0$, $\Delta=4$, eigenvalues $\pm2i$.
5. **Stable spiral** — $A=\begin{pmatrix}-1&-3\\3&-1\end{pmatrix}$ has eigenvalues $-1\pm3i$.
6. **Classifier shortcut** — if a Jacobian has $\tau=-2$ and $\Delta=5$, then $\tau^2-4\Delta=-16<0$ and the negative trace gives a stable spiral.

### `math-25-10` — Nonlinear systems and linearization  · deepen derivation

**Connections (§1).**
> This lesson connects nonlinear systems back to the linear classification just developed. Near an equilibrium, the first-order Taylor approximation often controls the local behavior. The Jacobian is the matrix that collects those first-order rates. When the equilibrium is hyperbolic, the linearized system gives the reliable local picture.

**Motivation & Intuition (§2).**
> Nonlinear systems can bend, saturate, or couple variables in complicated ways. Near an equilibrium, however, the constant term in the Taylor expansion vanishes, and the first-order terms often dominate. Those first-order terms form the Jacobian matrix.
>
> Linearization is therefore a local approximation, not a global replacement. It tells what very small displacements do near the equilibrium when the Jacobian has no eigenvalue with zero real part. If a zero-real-part eigenvalue appears, the linear part may be too weak to decide the behavior, and higher-order terms matter.

**Definition & Assumptions (§3).**
- **Derive (complete).**
  1. Let $\dot x=f(x,y)$ and $\dot y=g(x,y)$, and let $(x^*,y^*)$ satisfy $f=g=0$ — this is an equilibrium.
  2. Define displacement $u=x-x^*$ and $v=y-y^*$ — move coordinates so the equilibrium is the origin.
  3. Taylor expand $f(x^*+u,y^*+v)=f(x^*,y^*)+f_xu+f_yv+O(\|(u,v)\|^2)$ — first partials give the linear part.
  4. Taylor expand $g$ the same way — both velocity components need local linear terms.
  5. Use $f(x^*,y^*)=g(x^*,y^*)=0$ — constant terms vanish at an equilibrium.
  6. Write $\dot{\mathbf u}=J(x^*,y^*)\mathbf u$ with $J=\begin{pmatrix}f_x&f_y\\g_x&g_y\end{pmatrix}$ — the Jacobian collects the coefficients.
  7. Classify the local behavior by eigenvalues of $J$ when no eigenvalue has zero real part — the linear part dominates the smaller nonlinear remainder.

**Symbols.** $J$ is the Jacobian; $f_x,f_y,g_x,g_y$ are partial derivatives at the equilibrium; $\mathbf u=(u,v)^T$ is displacement; hyperbolic means no Jacobian eigenvalue has zero real part.

**Real-World Applications (§5).**
1. **Predator-prey center test** — $\dot x=x(1-y)$, $\dot y=y(x-1)$ at $(1,1)$ has $J=\begin{pmatrix}0&-1\\1&0\end{pmatrix}$ with eigenvalues $\pm i$.
2. **Nonlinear stable node** — $\dot x=-x+x^2$, $\dot y=-2y$ at $(0,0)$ has eigenvalues $-1,-2$.
3. **Saddle near equilibrium** — $\dot x=x+y^2$, $\dot y=-y$ at $(0,0)$ has eigenvalues $1,-1$.
4. **Local training dynamics** — gradient flow near a minimum with Hessian eigenvalues $2,5$ has Jacobian eigenvalues $-2,-5$.
5. **Activation system** — $\dot x=\tanh x-y$, $\dot y=x-y$ at $0$ has Jacobian $\begin{pmatrix}1&-1\\1&-1\end{pmatrix}$ with eigenvalues $0,0$, so linearization is inconclusive.
6. **Operating point** — for $\dot x=x(2-x-y)$, $\dot y=y(x-1)$ at $(1,1)$, $J=\begin{pmatrix}-1&-1\\1&0\end{pmatrix}$ has eigenvalues $-0.5\pm0.866i$.

### `math-25-11` — Limit cycles  · AUTHOR derivation

**Connections (§1).**
> This lesson extends stability from fixed points to repeating motion. A limit cycle is a closed trajectory that neighboring trajectories may approach or leave. In polar examples, the radius gives a simple one-dimensional stability test for the cycle. This prepares the global planar results that explain why periodic motion is special in two dimensions.

**Motivation & Intuition (§2).**
> Not all stable long-run behavior settles to a fixed point. Some systems approach a repeating loop, returning to the same states over and over. A limit cycle names an isolated closed trajectory of this kind.
>
> In polar coordinates, the idea becomes especially clear. The angular equation keeps the state moving around the circle, while the radial equation decides whether nearby radii move toward or away from the cycle. Stability of the periodic orbit is then just the one-dimensional stability of the radius.

**Definition & Assumptions (§3).**
- **Derive (complete).**
  1. Write a planar system in polar coordinates with $\dot r=h(r)$ and $\dot\theta=\omega$ — radius and angle separate in this common test form.
  2. A circle $r=r^*$ is invariant when $h(r^*)=0$ — the radius does not change there.
  3. If $\omega\ne0$, angle keeps moving — the invariant circle is traced repeatedly.
  4. Linearize the radial equation with $\rho=r-r^*$ to get $\dot\rho\approx h'(r^*)\rho$ — this is the one-dimensional stability test applied to radius.
  5. If $h'(r^*)<0$, radial errors decay — nearby trajectories approach the circle.
  6. If no neighboring circles are also periodic, the periodic orbit is isolated — that makes it a limit cycle.

**Symbols.** $r$ is radius; $\theta$ is angle; $h(r)$ is radial velocity; $\omega$ is angular speed; $r^*$ is the cycle radius; $T$ is period.

**Real-World Applications (§5).**
1. **Stable unit cycle** — $\dot r=r(1-r)$ has $r^*=1$ and $h'(1)=-1$, so the unit circle attracts.
2. **Period from angular speed** — with $\dot\theta=2$, the cycle period is $2\pi/2=\pi$.
3. **Unstable cycle** — $\dot r=r(r-1)$ has $h'(1)=1$, so radius $1$ repels.
4. **Amplitude oscillator** — $\dot r=r(4-r^2)$ has stable radius $2$ because $h'(2)=4-12=-8$.
5. **Neural rhythm** — if phase speed is $10$ rad/s, period is $2\pi/10\approx0.628$ s.
6. **Convergence direction** — for $\dot r=r(1-r)$, at $r=0.8$ radial velocity is $0.16$ and at $r=1.2$ it is $-0.24$.

### `math-25-12` — The Poincaré–Bendixson theorem  · explain-only

**Connections (§1).**
> This lesson uses the phase-plane vocabulary of equilibria, trajectories, and trapping regions. The Poincaré–Bendixson theorem describes a strong restriction on long-run behavior in autonomous planar systems. It explains why a trapped trajectory with no equilibrium to approach must organize into periodic motion. The theorem is conceptual here because its proof depends on planar topology, but its hypotheses are practical to check.

**Motivation & Intuition (§2).**
> The Poincaré–Bendixson theorem explains why planar autonomous systems are more constrained than higher-dimensional systems. If a trajectory remains in a compact trapping region, its long-run behavior cannot wander arbitrarily in the plane. If there is no equilibrium in the limiting set, the remaining possibility is periodic motion.
>
> The hypotheses matter as much as the conclusion. The system must be autonomous and planar, the trajectory must remain trapped, and equilibria must be ruled out in the relevant region. When those checks hold, the theorem gives a rigorous route from geometric trapping to the existence of a periodic orbit.

**Definition & Assumptions (§3).**
- **Derive (complete).** Explain-only: this is a theorem whose proof relies on planar topology and uniqueness. The lesson should explain the conditions and conclusion carefully rather than fake a short derivation.

**Symbols.** $R$ is a compact trapping region; omega-limit set is the set approached as $t\to\infty$; equilibrium is a zero of the vector field; periodic orbit is a closed trajectory.

**Real-World Applications (§5).**
1. **Trapped annulus** — if trajectories stay in $1\le r\le2$ and no equilibrium lies in the annulus, the limit set is a periodic orbit.
2. **Why equilibria matter** — if a trapped disk contains a stable equilibrium at $0$, the theorem's no-equilibrium conclusion does not apply.
3. **Planar-only check** — a 3-D Lorenz system can be trapped and nonperiodic, so dimension $3$ breaks the theorem's setting.
4. **Limit-cycle proof strategy** — showing inward arrows at $r=2$ and outward arrows at $r=1$ gives a compact trapping annulus of area $3\pi$.
5. **Autonomous condition** — a periodically forced scalar equation uses time as an extra state, so the planar autonomous hypothesis must be checked.
6. **Numerical diagnosis** — if a simulated trajectory remains inside $0.9\le r\le1.1$ and no rest point is there, repeated returns suggest the periodic orbit promised by the theorem.

### `math-25-13` — Lyapunov functions  · deepen derivation

**Connections (§1).**
> This lesson gives a stability method that does not require solving the differential equation. Instead of tracking the full trajectory, it tracks a scalar quantity that behaves like energy or distance. If that quantity never increases, trajectories are constrained; if it decreases strictly, the equilibrium is attracting under the usual conditions. This idea is especially useful when eigenvalue calculations are hard or insufficient.

**Motivation & Intuition (§2).**
> Solving a nonlinear differential equation exactly is often unnecessary for stability. A Lyapunov function replaces the full solution with a scalar measure that is easy to compare along trajectories. If that measure behaves like energy and never increases, the motion is confined to lower or equal levels.
>
> The derivative of $V$ along trajectories is the key computation. The chain rule converts the vector field into the scalar rate $\dot V=\nabla V\cdot f$. A negative value means the system is moving downhill in the Lyapunov measure, which can prove stability or attraction without producing an explicit formula for $x(t)$.

**Definition & Assumptions (§3).**
- **Derive (complete).**
  1. Choose $V(x)$ with $V(0)=0$ and $V(x)>0$ for $x\ne0$ — this makes $V$ a local measure of distance from equilibrium.
  2. Along a trajectory $x(t)$, compute $\frac{d}{dt}V(x(t))$ — stability depends on how this measure changes over time.
  3. Apply the chain rule: $\dot V=\nabla V(x)\cdot\dot x$ — the gradient converts state velocity into scalar rate of change.
  4. Substitute the dynamics $\dot x=f(x)$ to get $\dot V=\nabla V(x)\cdot f(x)$ — now the decrease test depends only on the vector field.
  5. If $\dot V\le0$, $V$ never increases — trajectories cannot move to larger energy levels locally.
  6. If $\dot V<0$ away from $0$, the energy strictly decreases — nearby trajectories are driven toward the equilibrium under the usual Lyapunov conditions.

**Symbols.** $V$ is the Lyapunov function; $\nabla V$ is its gradient; $f(x)$ is the vector field; $\dot V$ is derivative along trajectories; positive definite means $V(0)=0$ and $V>0$ away from $0$.

**Real-World Applications (§5).**
1. **Scalar decay** — $\dot x=-2x$, $V=x^2$ gives $\dot V=2x(-2x)=-4x^2<0$.
2. **Two-dimensional decay** — $\dot x=-x$, $\dot y=-2y$, $V=x^2+y^2$ gives $\dot V=-2x^2-4y^2$.
3. **Point check** — at $(3,4)$ in that system, $\dot V=-18-64=-82$.
4. **Gradient flow** — $\dot w=-\nabla L$, $V=L-L^*$ gives $\dot V=-\|\nabla L\|^2\le0$.
5. **Discrete training analogy** — if validation loss drops from $0.50$ to $0.45$, the Lyapunov-like quantity decreases by $0.05$.
6. **Non-strict warning** — for $\dot x=0$, $V=x^2$ gives $\dot V=0$, proving no increase but not attraction.

### `math-25-14` — Discrete maps  · rewrite §5 · deepen derivation

**Connections (§1).**
> This lesson returns to discrete time with the same local stability question used for fixed points. A map advances the state by iteration rather than by a continuous velocity field. Near a fixed point, the derivative acts as the one-step multiplier for small errors. That multiplier becomes the central tool for the logistic map, period doubling, and recurrent update stability.

**Motivation & Intuition (§2).**
> In discrete time, the dynamics happen by repeated application of the same rule. A fixed point is a state that stays unchanged after one application, and local stability asks what happens to a small error after many applications. The derivative at the fixed point gives the first-order answer.
>
> The difference from continuous time is that errors are multiplied rather than exponentiated by a rate. If the multiplier has absolute value below $1$, repeated powers shrink; if it is above $1$, repeated powers grow. A negative multiplier can still be stable, but the error alternates sign as it converges.

**Definition & Assumptions (§3).**
- **Derive (complete).**
  1. Start with $x_{n+1}=F(x_n)$ and a fixed point $F(x^*)=x^*$.
  2. Define $e_n=x_n-x^*$ — this is the current error.
  3. Substitute $x_n=x^*+e_n$ into the map — study a nearby state.
  4. Taylor expand $F(x^*+e_n)=F(x^*)+F'(x^*)e_n+O(e_n^2)$ — the derivative is the local multiplier.
  5. Subtract $x^*$ and use $F(x^*)=x^*$ to get $e_{n+1}\approx F'(x^*)e_n$.
  6. Iterate to get $e_n\approx (F'(x^*))^ne_0$ — one multiplier is applied per step.
  7. Errors shrink when $|F'(x^*)|<1$ and grow when $|F'(x^*)|>1$ — powers decide the local behavior.

**Symbols.** $n$ is the integer time index; $F$ is the map; $x^*$ is a fixed point; $e_n$ is error; $F'(x^*)$ is the local multiplier.

**Real-World Applications (§5).**
1. **Affine iteration** — $x_{n+1}=0.7x_n+0.3$ from $x_0=0.2$ gives $0.44$, $0.608$, $0.7256$.
2. **Fixed point** — the same map has $x^*=1$ because $x=0.7x+0.3$.
3. **Error shrinkage** — multiplier $0.8$ leaves $0.8^{10}=0.10737$ of an error after ten steps.
4. **Alternating convergence** — multiplier $-0.5$ leaves $(-0.5)^6=0.015625$ after six steps.
5. **Divergent map** — $x_{n+1}=1.02x_n$ multiplies error by $1.02^{20}=1.486$ after twenty steps.
6. **Digital filter** — $y_{n+1}=0.9y_n+0.1u$ has fixed output $u$ and error multiplier $0.9$.

### `math-25-15` — The logistic map  · rewrite §5 · deepen derivation

**Connections (§1).**
> This lesson studies a single nonlinear map that displays much of discrete dynamics. The logistic map combines growth with crowding through the factor $x(1-x)$. Its fixed points can be found by algebra, and their stability follows from the derivative multiplier. As the parameter changes, the map moves from fixed-point attraction toward periodic and chaotic behavior.

**Motivation & Intuition (§2).**
> The logistic map is simple enough to compute by hand and nonlinear enough to show rich behavior. The factor $x$ represents growth from the current population fraction, while $1-x$ limits growth as the state approaches crowding. The parameter $r$ controls the strength of the update.
>
> Fixed points come from solving $x=rx(1-x)$. Their stability is then determined by the derivative multiplier, just as in any one-dimensional map. The nonzero fixed point attracts for $1<r<3$, and the loss of that stability is the entry point to period doubling and chaos.

**Definition & Assumptions (§3).**
- **Derive (complete).**
  1. Start with $F(x)=rx(1-x)$ — $r$ is the growth parameter.
  2. Fixed points solve $x=rx(1-x)$ — fixed means one update returns the same value.
  3. Move all terms to get $x[1-r(1-x)]=0$ — factor out $x$.
  4. Thus $x^*=0$ or $1=r(1-x)$ — the zero branch and nonzero branch.
  5. For $r\ne0$, solve the nonzero branch to get $x^*=1-1/r$.
  6. Differentiate $F'(x)=r(1-2x)$ — this is the map multiplier.
  7. At $0$, $F'(0)=r$; at $1-1/r$, $F'=2-r$ — substitute the fixed points.
  8. The nonzero fixed point attracts when $|2-r|<1$, so $1<r<3$ — apply the discrete-map stability test.

**Symbols.** $x_n$ is often a normalized population fraction; $r$ is growth strength; $F'$ is the one-step multiplier; fixed-point stability is local.

**Real-World Applications (§5).**
1. **Attracting fixed point** — for $r=2.5$, $x^*=0.6$ and $F'(x^*)=-0.5$.
2. **Loss of fixed-point stability** — for $r=3.2$, $x^*=0.6875$ and $F'(x^*)=-1.2$, so the fixed point repels.
3. **Chaotic-parameter iterate** — with $r=4$ and $x_0=0.2$, the next four values are $0.64$, $0.9216$, $0.28901376$, $0.8219392261$.
4. **Domain preservation** — $r=4$ maps $x=0.5$ to $1$, still in $[0,1]$.
5. **Zero fixed point** — at $r=0.8$, $F'(0)=0.8$, so $0$ attracts locally.
6. **Population fraction** — with $r=2$ and $x_n=0.3$, the next fraction is $2(0.3)(0.7)=0.42$.

### `math-25-16` — Period doubling  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson builds on discrete maps and local multipliers. A periodic orbit repeats only after several steps, so its stability is determined by the product of the multipliers around the full cycle. Period doubling occurs when a stable orbit loses stability in a characteristic alternating way. This is one of the main routes by which simple maps develop complicated long-run behavior.

**Motivation & Intuition (§2).**
> A fixed point is a period-one orbit, but maps can also settle into cycles that repeat after several steps. To test such a cycle, a perturbation must be followed all the way around the orbit. Each point contributes its own local derivative, and the product is the full-cycle multiplier.
>
> Period doubling is a common way for an attracting cycle to lose stability. When the multiplier crosses $-1$, errors alternate sign and no longer shrink over a full return. A new orbit with twice the period can then become the stable pattern of motion.

**Definition & Assumptions (§3).**
- **Derive (complete).**
  1. A period-$k$ orbit satisfies $F^k(x_0)=x_0$ and no smaller positive iterate returns to $x_0$ — this defines the repeat length.
  2. Perturb the first point by a small error $e_0$ — stability asks what happens to nearby starts.
  3. One step multiplies the error by approximately $F'(x_0)$ — use local linearization.
  4. The second step multiplies by $F'(x_1)$, and so on — each visited point contributes its local slope.
  5. After $k$ steps, $e_k\approx \left(\prod_{i=0}^{k-1}F'(x_i)\right)e_0$ — multiply the local linear factors.
  6. The period-$k$ orbit attracts when the product has absolute value below $1$ — the full-cycle error must shrink.
  7. A typical period-doubling event happens when this multiplier crosses $-1$ — errors alternate sign and stop shrinking, allowing a period-$2k$ orbit to take over.

**Symbols.** $F^k$ is $F$ composed $k$ times; $x_0,\dots,x_{k-1}$ are orbit points; the multiplier is $\prod F'(x_i)$; $r$ is a changing parameter in families such as the logistic map.

**Real-World Applications (§5).**
1. **Logistic fixed-point threshold** — the nonzero fixed point has multiplier $2-r$, which equals $-1$ at $r=3$.
2. **Period-2 points at $r=3.2$** — solving $F(F(x))=x$ excluding fixed points gives $x\approx0.5130445095$ and $0.7994554905$.
3. **Period-2 stability** — the derivative product at those two points is about $0.16$, so the 2-cycle attracts.
4. **Alternating error** — a multiplier $-0.9$ makes a unit error become $-0.9$, then $0.81$, so signs alternate while size shrinks.
5. **Flip instability** — a multiplier $-1.1$ makes size grow to $1.1^4=1.4641$ after four periods.
6. **Training oscillation analogy** — a scalar optimizer with update multiplier $-0.8$ alternates around the optimum and leaves $0.8^5=0.32768$ of the error after five steps.

### `math-25-17` — Chaos and sensitive dependence  · rewrite §5 · deepen derivation

**Connections (§1).**
> This lesson gives a quantitative meaning to sensitive dependence on initial conditions. In a map, nearby starting states separate according to the local slopes they encounter along the orbit. Multiplying those slopes gives total error growth, and averaging their logarithms gives the Lyapunov exponent. A positive exponent signals sustained average stretching in a bounded deterministic system.

**Motivation & Intuition (§2).**
> Sensitive dependence is about the growth of small differences, not about randomness in the rule. Two initial states may begin extremely close, but if the map repeatedly stretches small separations, their future states can become practically different. The derivative along the orbit records each local stretch or contraction.
>
> Products of stretches are easier to average after taking logarithms. The Lyapunov exponent is the long-run average log stretch per step. When it is positive in a bounded deterministic system, small errors typically grow exponentially until the bounded geometry of the system folds or saturates them.

**Definition & Assumptions (§3).**
- **Derive (complete).**
  1. For a map $x_{n+1}=F(x_n)$, let two nearby trajectories differ by $\delta_n$ — this is local separation.
  2. Linearize: $\delta_{n+1}\approx F'(x_n)\delta_n$ — the derivative is the local stretch factor.
  3. Repeat for $n$ steps to get $|\delta_n|\approx |\delta_0|\prod_{i=0}^{n-1}|F'(x_i)|$ — local stretches multiply.
  4. Take logs: $\log|\delta_n/\delta_0|\approx\sum_{i=0}^{n-1}\log|F'(x_i)|$ — products become sums.
  5. Divide by $n$: $\frac1n\log|\delta_n/\delta_0|\approx\frac1n\sum\log|F'(x_i)|$ — this gives average growth per step.
  6. Define the Lyapunov exponent $\lambda=\lim_{n\to\infty}\frac1n\sum\log|F'(x_i)|$ when the limit exists.
  7. If $\lambda>0$, typical small errors grow like $e^{\lambda n}$ — positive average log stretch means exponential separation.

**Symbols.** $\delta_n$ is a small separation; $\lambda$ is the Lyapunov exponent; $F'$ is local slope; positive exponent indicates sensitive dependence for bounded deterministic dynamics.

**Real-World Applications (§5).**
1. **Doubling map** — $F(x)=2x\bmod1$ has $|F'|=2$, so $\lambda=\log2\approx0.693$.
2. **Error growth** — with $\lambda=\log2$, an initial error $10^{-6}$ becomes about $0.001024$ after ten steps.
3. **Contracting map** — $F(x)=0.5x$ has $\lambda=\log0.5=-0.693$, so errors shrink.
4. **Moderate chaos** — $\lambda=0.2$ gives growth factor $e^{4}\approx54.6$ after $20$ steps.
5. **Logistic-map local stretch** — at $r=4$, $x=0.2$, $|F'(x)|=|4(1-0.4)|=2.4$, so one-step error roughly multiplies by $2.4$.
6. **Forecast horizon** — if tolerable error is $0.1$ and initial error is $10^{-5}$ with $\lambda=0.5$, the horizon is $\log(10^4)/0.5\approx18.42$ steps.

### `math-25-18` — Strange attractors  · rewrite §5 · explain-only

**Connections (§1).**
> This lesson connects chaos with geometry. A strange attractor is not just a set that trajectories approach; it is also invariant, folded, stretched, and geometrically complicated. The important ideas are attraction, recurrence, sensitivity, and non-integer scaling. The lesson stays explain-only because the definitions are subtle and differ across texts, while the diagnostics are the useful first tools.

**Motivation & Intuition (§2).**
> A strange attractor combines two tendencies that seem opposed at first. It attracts nearby trajectories, so motion is confined toward a set; at the same time, motion on or near that set can separate nearby states through stretching. Folding keeps the dynamics bounded while preserving complicated recurrence.
>
> Because the precise definition varies by context, the useful first lesson is diagnostic. Invariance means the dynamics keep the set mapped into itself. Attraction means nearby points move toward it. Positive Lyapunov behavior and fractal scaling indicate the sensitive, geometrically complicated structure associated with strange attractors.

**Definition & Assumptions (§3).**
- **Derive (complete).** Explain-only: definitions vary across texts, and the main lesson is conceptual. Explain attraction, invariance, stretching, folding, fractal geometry, and sensitive dependence using simple computed diagnostics.

**Symbols.** Attractor is the set approached by nearby trajectories; invariant means dynamics keep points on the set; basin is the set of initial conditions attracted to it; Lyapunov exponent measures average stretching; fractal dimension measures non-integer scaling.

**Real-World Applications (§5).**
1. **Stretching count** — a local separation doubled eight times grows by $2^8=256$.
2. **Folding balance** — if each stretch is followed by a half-scale fold, the layer thickness is $2^{-8}=0.00390625$ after eight folds.
3. **Lorenz-style sensitivity** — with exponent $0.9$, an error grows by $e^{0.9\cdot5}=e^{4.5}\approx90.0$ after five time units.
4. **Attraction diagnostic** — if distances to the plotted set drop from $3.0$ to $0.6$, the ratio is $0.2$.
5. **Invariant-set check** — if a numerical return map keeps $10{,}000$ sampled points inside a box after one step, the one-step escape fraction is $0/10000=0$.
6. **ML latent dynamics warning** — a learned recurrent map with local stretch $1.4$ for ten steps can amplify hidden-state error by $1.4^{10}\approx28.9$ before folding or saturation limits it.

### `math-25-19` — Fractals  · rewrite §5 · deepen derivation

**Connections (§1).**
> This lesson gives the scaling language used to describe complicated invariant sets and basin boundaries. Ordinary lines, squares, and cubes have dimensions that match simple scale-counting rules. Fractals extend that idea to sets whose copy count grows at a non-integer rate with scale. The self-similar formula is the cleanest first model of that behavior.

**Motivation & Intuition (§2).**
> Dimension can be understood by how counts change with scale. A line split in half gives two half-size pieces, while a square split in half in each direction gives four half-size pieces. Fractals follow the same counting idea but produce dimensions that need not be whole numbers.
>
> For an ideal self-similar set, the number of copies and the scale factor determine the similarity dimension. Taking logarithms turns the scaling relation into a simple ratio. This formula gives the standard dimensions for the Cantor set, Sierpiński triangle, and Koch curve.

**Definition & Assumptions (§3).**
- **Derive (complete).**
  1. Suppose a set is built from $N$ smaller copies of itself, each scaled by length factor $s$ with $0<s<1$.
  2. Dimension $D$ should make the copy count match the scale factor: $N=(1/s)^D$ — this generalizes line and square scaling.
  3. Take logs on both sides: $\log N=D\log(1/s)$ — logarithms bring the exponent down.
  4. Divide to get $D=\frac{\log N}{\log(1/s)}$ — isolate the dimension.
  5. Check ordinary shapes: $N=2,s=1/2$ gives $D=1$ for a line; $N=4,s=1/2$ gives $D=2$ for a square.

**Symbols.** $N$ is the number of self-similar copies; $s$ is the length scale of each copy; $D$ is similarity dimension; logs can use any base if the same base is used top and bottom.

**Real-World Applications (§5).**
1. **Cantor set** — $N=2$, $s=1/3$ gives $D=\log2/\log3\approx0.63093$.
2. **Sierpiński triangle** — $N=3$, $s=1/2$ gives $D=\log3/\log2\approx1.58496$.
3. **Koch curve** — $N=4$, $s=1/3$ gives $D=\log4/\log3\approx1.26186$.
4. **Box-count growth** — Cantor construction after five stages has $2^5=32$ intervals of length $3^{-5}$.
5. **Image texture** — if box counts grow from $64$ to $256$ when scale halves twice, the estimated dimension is $\log(256/64)/\log4=1$.
6. **Chaotic basin boundary** — if a boundary needs $3^5=243$ boxes at scale $1/3^5$, its scaling is consistent with dimension near $1$.

### `math-25-20` — Training dynamics & RNN stability  · AUTHOR derivation

**Connections (§1).**
> This final lesson connects the section back to machine learning dynamics. Gradient descent is a discrete dynamical system on parameters, and an RNN is a discrete dynamical system on hidden states. The same multiplier and eigenvalue tests explain local convergence, oscillation, decay, and growth. This gives the earlier stability tools a direct role in training and sequence models.

**Motivation & Intuition (§2).**
> Many machine learning procedures repeatedly update a state. In gradient descent, the state is the parameter vector, and the update depends on the gradient. Near a quadratic minimum, the error follows a linear scalar map whose multiplier depends on curvature and learning rate.
>
> Recurrent neural networks use the same repeated-multiplication idea for hidden states. Along an eigenvector of the recurrent matrix, the component is multiplied by the corresponding eigenvalue each step. Eigenvalues inside the unit circle produce decay, while eigenvalues outside it produce growth or instability.

**Definition & Assumptions (§3).**
- **Derive (complete).**
  1. For gradient descent, write $w_{k+1}=w_k-\eta\nabla L(w_k)$ — parameters are the state.
  2. Near a one-dimensional quadratic minimum $L(w)=\frac{a}{2}(w-w^*)^2$, compute $\nabla L=a(w-w^*)$ — the gradient is linear in the error.
  3. Let $e_k=w_k-w^*$ — measure distance from the optimum.
  4. Substitute to get $e_{k+1}=(1-\eta a)e_k$ — the update is a discrete map on error.
  5. Stability requires $|1-\eta a|<1$ — apply the discrete multiplier rule.
  6. This gives $0<\eta<2/a$ — solve the inequality for learning rate.
  7. For an RNN with zero input, $h_t=Wh_{t-1}$, so $h_t=W^th_0$ — repeated multiplication drives memory.
  8. Along an eigenvector $Wv=\lambda v$, the hidden component becomes $\lambda^t$ times its initial value — $|\lambda|<1$ shrinks and $|\lambda|>1$ grows.

**Symbols.** $w_k$ is the parameter vector; $\eta$ is learning rate; $L$ is loss; $a$ is local curvature; $e_k$ is optimization error; $h_t$ is hidden state; $W$ is recurrent weight matrix; $\rho(W)$ is the largest eigenvalue magnitude.

**Real-World Applications (§5).**
1. **Safe learning rate** — with curvature $a=6$, stability requires $0<\eta<1/3$.
2. **Stable GD update** — with $a=6$, $\eta=0.1$, multiplier is $0.4$ and five steps leave $0.01024$ of the error.
3. **Oscillatory GD** — with $a=6$, $\eta=0.3$, multiplier is $-0.8$, so the sign alternates while size shrinks.
4. **Unstable GD** — with $a=6$, $\eta=0.4$, multiplier is $-1.4$, so the method diverges locally.
5. **RNN decay** — $W=\operatorname{diag}(0.5,0.2)$ has spectral radius $0.5$, so the slow mode leaves $0.5^{10}=0.0009765625$ after ten steps.
6. **Exploding hidden state** — a recurrent eigenvalue $1.05$ grows by $1.05^{20}=2.653$ over twenty steps.

---

## Build order

1. **Stability spine first:** author `math-25-03`, `math-25-04`, `math-25-14`, `math-25-20` so fixed points, local multipliers, and ML/RNN analogies share one vocabulary.
2. **Continuous-time local dynamics:** author `math-25-02`, `math-25-05`, `math-25-06`, `math-25-07`, `math-25-09`, `math-25-10`, then `math-25-13`.
3. **Planar global behavior:** author `math-25-08`, `math-25-11`, `math-25-12`, `math-25-18`.
4. **Discrete chaos block:** author `math-25-15`, `math-25-16`, `math-25-17`, `math-25-19`, replacing the shared §5 block completely.
5. **Opening pass:** finish `math-25-01` last so its examples preview the finished section vocabulary without overloading the first lesson.
