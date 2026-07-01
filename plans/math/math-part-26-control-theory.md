# Math · Part 26 — Control theory  (deep-authored reference)

> **Per-section execution plan.** Load together with the master
> [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) for the four
> exposition principles and Definition of Done. Every numeric claim below was checked with `python3` using
> `sympy 1.14.0` and `numpy 1.26.4`; key checks include poles, ranks, gains, time constants, dB values,
> LQR/Kalman arithmetic, and discounted returns.

**Section:** Control theory · **Lessons:** 22 · **Breadcrumb:** `Mathematics · Applied / Computational` · **Priority:** HIGH

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| §5 boilerplate — shared application-title sets | 17 / 22 |
| Templated / thin motivation | 12 / 22 |
| Key formula not in display form | 20 / 22 |
| Current dump shows lost `<...>` LaTeX fragments | 5 / 22 |
| Derivations to author or deepen | 22 / 22 |

**The core change:** replace every shared §5 block with six applications that use the lesson's own control
concept and a re-derivable number; promote formulas to display form; add complete step-by-step derivations
and symbol glosses.

---

## Priority & systemic issues

- **Shared §5 block A — 9 lessons:** `math-26-03`…`math-26-11` share _Step tests · Motor control · Filters · Robotics · Optimization · RL control_. These applications mostly use generic DC gain, pole, or multiplier facts instead of the lesson's own concept.
- **Shared §5 block B — 6 lessons:** `math-26-16`…`math-26-21` share _Robotics · Autonomous vehicles · Recommendation systems · Operations and inventory · Energy systems · ML training loops_. These are broad dynamical-system examples and do not compute controllability, observability, pole placement, LQR, Kalman, or optimal-control quantities.
- **Shared §5 block C — 2 lessons:** `math-26-01`…`math-26-02` share _Thermostats · Cruise control · Robotics · Gradient methods · Reinforcement learning · Online systems_. Keep the domains only when the calculation actually uses feedback or differential-equation modeling.
- **Current dump LaTeX/display bugs to flag:** `math-26-01` loses `$e<0$`; `math-26-02` loses `$a<0$`; `math-26-07` loses `$\operatorname{Re}(p_i)<0$`; `math-26-08` loses `$0<\zeta<1$`; `math-26-22` loses `$0\le\gamma<1$` and `$\gamma<1$`. The authored JS appears balanced, but `dump-section.js` prints these as broken fragments, so verify the renderer escapes less-than signs correctly. No lost matrix `\\` row break was found in Part 26.

---

## Model entry (full prose)

### `math-26-06` — Poles and zeros  — **full-depth model entry**

**Connections (§1).**
> This lesson builds on transfer functions and the Laplace transform. A transfer function writes an LTI
> system as a ratio $G(s)=N(s)/D(s)$, so the roots of the numerator and denominator are no longer just algebraic
> details. They become the places in the complex plane that tell how the system naturally moves and how it
> responds to inputs.
>
> The next lessons use this language constantly. Stability reads the real parts of poles, transient response
> reads damping and oscillation from complex poles, and root locus follows poles as feedback gain changes.
> Poles and zeros are therefore the bridge from an equation to the behavior a controller designer cares about.

**Motivation & Intuition (§2).**
> When a system is disturbed briefly, its response either dies out, oscillates, or grows. For a linear system,
> that behavior is controlled by a small set of points in the complex plane. Factor the transfer function
> $G(s)=N(s)/D(s)$. The poles, which are the roots of $D(s)$, give the system's natural modes. A pole at $p$
> contributes a term like $e^{pt}$, so the real part of $p$ decides whether that mode decays or grows.
>
> Zeros, which are the roots of $N(s)$, do a different job. They shape the response by reducing or blocking
> parts of the input-output behavior. In the worked system
> $G(s)=\dfrac{s+2}{(s+1)(s+4)}$, the zero is at $-2$, the poles are at $-1$ and $-4$, and the DC gain is
> $G(0)=\dfrac{2}{4}=0.5$. Those three numbers already tell a useful story: the system is stable, its slow
> mode has time constant $1$ second, and a unit step settles at one half.

**Definition & Assumptions (§3).** Display
$$
G(s)=\frac{N(s)}{D(s)},\qquad N(z)=0\text{ gives zeros},\qquad D(p)=0\text{ gives poles}.
$$
Then derive the mode rule:
1. Start with a denominator factor $s-p$ — a pole is a value $p$ that makes the denominator vanish.
2. A simple partial fraction has the form $A/(s-p)$ — this isolates the contribution of that pole.
3. Use the inverse Laplace transform $\mathcal L^{-1}\{1/(s-p)\}=e^{pt}$ — this converts the pole into a time-domain mode.
4. Write $p=\sigma+j\omega$ — every complex pole has a real part $\sigma$ and imaginary part $\omega$.
5. Then $e^{pt}=e^{\sigma t}e^{j\omega t}$ — separate growth/decay from oscillation.
6. The magnitude is $|e^{pt}|=e^{\sigma t}$ — the complex sinusoid has magnitude $1$.
7. Therefore $\sigma<0$ gives decay, $\sigma=0$ gives sustained size, and $\sigma>0$ gives growth.

**Symbols.** $G(s)$ is the transfer function; $s$ is the Laplace variable; $N(s)$ is the numerator; $D(s)$ is the denominator; $z$ is a zero; $p$ is a pole; $\sigma=\operatorname{Re}(p)$ is the decay or growth rate; $\omega=\operatorname{Im}(p)$ is the oscillation rate in radians per second.

**Real-World Applications (§5).**
1. **Stability from pole sign** — $G(s)=\dfrac{s+2}{(s+1)(s+4)}$ has poles $-1,-4$, so modes $e^{-t}$ and $e^{-4t}$ decay.
2. **Dominant speed** — the slowest pole $-1$ gives time constant $1/|-1|=1$ s; the pole $-4$ gives $0.25$ s.
3. **DC gain** — $G(0)=2/(1\cdot4)=0.5$, so a stable unit-step response settles to $0.5$.
4. **Oscillation** — poles $-2\pm3j$ have envelope $e^{-2t}$ and period $2\pi/3\approx2.09$ s.
5. **Optimization-as-control** — a linearized error update $e_{k+1}=0.9e_k$ has discrete pole $0.9$, so after $20$ steps the error multiplier is $0.9^{20}\approx0.122$.
6. **Unstable learned policy check** — if a closed-loop scalar policy gives $x_{k+1}=1.05x_k$, then $100$ steps multiply state by $1.05^{100}\approx131.5$.

---

## Per-lesson change specs

**How to read these specs.** Each block is drafted content for one lesson. The labels are plan shorthand; in the app they become flowing prose in the same plain textbook voice as the model entry.

### `math-26-01` — Systems, signals, and feedback  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson begins the control-theory section with the basic objects that appear everywhere afterward. A signal is a time-varying quantity, and a system is a rule that turns one signal into another. Feedback adds the central control idea: use the measured output to decide what input should come next. Later lessons turn this same loop into transfer functions, stability tests, state-space models, and optimal controllers.

**Motivation & Intuition (§2).**
> Many mathematical models describe how a quantity changes, but control theory also asks how to influence that change. The input might be heater power, throttle, torque, a bid multiplier, or a parameter update. The output is what the system actually does, and the reference is what we wanted it to do. The error is the difference between those two signals.
>
> Feedback uses that error instead of choosing inputs blindly. If the output is too low, the controller pushes upward; if the output is too high, it pushes downward. In the simple scalar loop below, the plant has gain $P$ and the controller has gain $K$, so the algebra shows how the open-loop gains combine into the closed-loop reference-to-output gain.

**Definition & Assumptions (§3).** Closed-loop scalar proportional feedback for plant $y=Pu$ and controller $u=K(r-y)$:
1. Write the error $e=r-y$ — feedback compares desired output with measured output.
2. Write the controller $u=Ke=K(r-y)$ — proportional action scales the error.
3. Substitute into the plant $y=PK(r-y)$ — the plant output depends on the control input.
4. Distribute $y=PKr-PKy$ — separate reference and output terms.
5. Collect output terms $(1+PK)y=PKr$ — move the feedback term to the left.
6. Divide to get $y=\dfrac{PK}{1+PK}r$ — this is the closed-loop reference-to-output gain.

**Symbols.** $r(t)$ reference; $y(t)$ output; $u(t)$ input; $e(t)$ error; $P$ plant gain; $K$ controller gain.

**Real-World Applications (§5).**
1. **Thermostat** — $r=22$, $y=19$, $e=3$, $K=400$ W/degree gives $1200$ W.
2. **Static loop** — $P=2$, $K=0.25$, $r=10$ gives $y=10/3\approx3.33$.
3. **Cruise control** — speed error $65-61=4$ mph and gain $0.03$ gives throttle change $0.12$.
4. **Robot joint** — $e=0.20$ rad, $K=15$ N m/rad gives $3$ N m.
5. **Gradient feedback** — $L(w)=(w-5)^2$, $w=2$, gradient $-6$, step $0.1$ gives $w^+=2.6$.
6. **Pacing loop** — spend error $8000-7600=400$, gain $0.001$ changes bid multiplier by $0.4$.

### `math-26-02` — Modeling with differential equations  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> The previous lesson introduced systems as input-output objects. This lesson looks inside a system by describing its state with a differential equation. The state tells what the system remembers at the current time, and the derivative tells how that state is moving. This language supports later transfer functions, time responses, and state-space models.

**Motivation & Intuition (§2).**
> A static equation can say where a system is, but it cannot describe motion by itself. Control problems usually depend on rates: heat leaks away, vehicles accelerate, tanks drain, and optimization variables drift toward better values. A differential equation gives a compact rule for that motion by connecting the present state, the input, and the derivative.
>
> The simplest useful model is first order and linear. With a constant input, it has an equilibrium where the derivative is zero. By subtracting that equilibrium, the model becomes a pure exponential deviation equation, which shows both the final value and the speed at which the system approaches it.

**Definition & Assumptions (§3).** For $\dot x=ax+bu_0$ with constant input:
1. Set equilibrium by $0=ax^*+bu_0$ — equilibrium means the rate is zero.
2. Solve $x^*=-bu_0/a$ — isolate the state, assuming $a\ne0$.
3. Define deviation $z=x-x^*$ — measure distance from equilibrium.
4. Differentiate $\dot z=\dot x$ — $x^*$ is constant.
5. Substitute $x=z+x^*$ to get $\dot z=a(z+x^*)+bu_0$ — write dynamics in deviation coordinates.
6. Use $ax^*+bu_0=0$ to reduce to $\dot z=az$ — equilibrium terms cancel.
7. Solve $z(t)=z(0)e^{at}$ — first-order exponential solution.
8. Return to $x(t)=x^*+(x(0)-x^*)e^{at}$ — add the equilibrium back.

**Symbols.** $x$ state; $u_0$ constant input; $a$ natural rate coefficient; $b$ input coefficient; $x^*$ equilibrium; $z$ deviation.

**Real-World Applications (§5).**
1. **Tank level** — $\dot h=-0.5h+5$ gives $h^*=10$.
2. **Current model** — $\dot x=-0.4x+2u$, $u=3$ gives $x^*=15$.
3. **Cooling room** — $a=-0.2$ gives time constant $5$ min.
4. **Euler simulation** — $\dot x=-x+5$, $x_0=2$, $\Delta t=0.1$ gives $x_1=2.3$, $x_2=2.57$.
5. **Feedback design** — $\dot x=x+u$, choose $u=-3x$ to get $\dot x=-2x$.
6. **Optimization flow** — $\dot w=-(w-5)$ from $w_0=2$ gives $w(1)=5-3e^{-1}\approx3.90$.

### `math-26-03` — Transfer functions  · rewrite §5 · deepen derivation

**Connections (§1).**
> Differential equations describe dynamics in time. Transfer functions describe the same linear dynamics in the Laplace domain, where derivatives become algebraic factors. This shift makes it easier to combine systems, draw block diagrams, and locate poles. The lessons on poles, stability, frequency response, and Bode plots all use this representation.

**Motivation & Intuition (§2).**
> Solving a differential equation directly is useful, but control design often needs repeated algebra with connected pieces. A controller, actuator, plant, and sensor can each have their own equation. The transfer-function view replaces each linear piece by a ratio from input transform to output transform, so interconnections can be simplified with multiplication, addition, and feedback formulas.
>
> The key assumption is zero initial condition, because the transfer function describes the forced input-output behavior rather than the system's stored initial energy. In the first-order example below, the equation $\dot y+ay=bu$ becomes a ratio $G(s)=b/(s+a)$. The denominator already shows the pole, and the value at $s=0$ gives the steady gain.

**Definition & Assumptions (§3).** For $\dot y+ay=bu$ with zero initial condition:
1. Take Laplace transforms: $sY(s)+aY(s)=bU(s)$ — derivatives become multiplication by $s$ when $y(0)=0$.
2. Factor output: $(s+a)Y(s)=bU(s)$ — collect terms containing $Y$.
3. Divide by $U(s)$: $(s+a)Y(s)/U(s)=b$ — prepare the input-output ratio.
4. Divide by $s+a$: $Y(s)/U(s)=b/(s+a)$ — isolate the ratio.
5. Name it $G(s)=b/(s+a)$ — this ratio is the transfer function.

**Symbols.** $G(s)$ transfer function; $Y(s)$ output transform; $U(s)$ input transform; $s$ Laplace variable; $a$ decay coefficient; $b$ input gain.

**Real-World Applications (§5).**
1. **First-order plant** — $\dot y+3y=6u$ gives $G(s)=6/(s+3)$.
2. **DC gain** — $G(0)=6/3=2$, so a unit step settles at $2$.
3. **Pole from denominator** — $s+3=0$ gives pole $-3$ and time constant $1/3$ s.
4. **Low-pass filter** — $G(s)=100/(s+100)$ has DC gain $1$ and corner scale $100$ rad/s.
5. **Static gain check** — $\dot y+2y=10u$ gives equilibrium gain $10/2=5$.
6. **Gradient error model** — $e_{k+1}=0.8e_k$ has transfer-like multiplier $0.8$, so $e_3=0.8^3e_0=0.512e_0$.

### `math-26-04` — Block diagrams  · rewrite §5 · deepen derivation

**Connections (§1).**
> Transfer functions make each linear component into an input-output block. Block diagrams arrange those components so the signal flow stays visible. This is the notation used before reducing a feedback loop to a single closed-loop transfer function. It prepares the algebra used in steady-state error, root locus, and controller design.

**Motivation & Intuition (§2).**
> A real control system is rarely one isolated equation. The reference passes through a controller, the controller drives a plant, the plant output is measured by a sensor, and the measurement returns to the summing junction. A block diagram keeps those roles separate while still allowing exact algebra.
>
> The three main simplifications are simple but powerful. Series blocks multiply because the output of one is the input to the next. Parallel blocks add because their outputs are summed. Negative feedback produces the denominator $1+GH$, which is why feedback can change poles, reduce sensitivity, and reshape the closed-loop response.

**Definition & Assumptions (§3).** Negative feedback with forward path $G$ and feedback path $H$:
1. Write the error $E=R-HY$ — measured feedback is subtracted from reference.
2. Write the forward path $Y=GE$ — the plant/controller block maps error to output.
3. Substitute $Y=G(R-HY)$ — close the loop algebraically.
4. Distribute $Y=GR-GHY$ — separate reference and output terms.
5. Collect $(1+GH)Y=GR$ — move feedback output terms left.
6. Divide by $R$: $T(s)=Y/R=G/(1+GH)$ — get the closed-loop transfer.

**Symbols.** $R$ reference; $E$ error; $Y$ output; $G$ forward path; $H$ feedback path; $T$ closed-loop transfer.

**Real-World Applications (§5).**
1. **Unity feedback** — with $C=2$, $P=5/(s+4)$ gives $G=10/(s+4)$ and $T=10/(s+14)$.
2. **Closed-loop pole** — moves from $-4$ to $-14$, time constant from $0.25$ s to $0.071$ s.
3. **DC closed-loop gain** — is $10/14\approx0.714$.
4. **Sensor feedback** — $H=0.5$ gives $T=G/(1+0.5G)$, so $G(0)=10/4=2.5$ yields $T(0)=2.5/2.25\approx1.11$.
5. **Parallel filters** — $G_1=2$, $G_2=3$ give equivalent gain $5$.
6. **Series actuator and plant** — gains $0.4$ and $8$ multiply to $3.2$.

### `math-26-05` — System response  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> After modeling a system and writing its transfer function, the next question is how it moves in time. System response describes the output after an input change or an initial disturbance. The first-order response is the simplest case and sets the pattern for later transient-response metrics. It also gives the language of final value, transient, time constant, and settling.

**Motivation & Intuition (§2).**
> A stable system does not usually jump instantly to its final value. It carries memory of where it started, and that memory fades according to the dynamics. For a first-order stable model, this memory is a single exponential term, so the response can be read as steady state plus a decaying correction.
>
> This decomposition is useful because it separates two design questions. The steady state tells where the system will end up under a constant input, while the transient tells how quickly the initial error disappears. In the derivation below, subtracting the equilibrium exposes the pure exponential decay.

**Definition & Assumptions (§3).** For $\dot x=-ax+bu_0$ with $a>0$:
1. Set $0=-ax^*+bu_0$ — final steady state has zero derivative.
2. Solve $x^*=bu_0/a$ — isolate the final value.
3. Define $z=x-x^*$ — subtract the final value.
4. Differentiate $\dot z=\dot x$ — the final value is constant.
5. Substitute $x=z+x^*$ to get $\dot z=-a(z+x^*)+bu_0$ — rewrite in deviation form.
6. Use $-ax^*+bu_0=0$ to get $\dot z=-az$ — steady terms cancel.
7. Solve $z(t)=z(0)e^{-at}$ — deviation decays exponentially.
8. Return to $x(t)=x^*+(x(0)-x^*)e^{-at}$ — final value plus transient.

**Symbols.** $x(t)$ state; $x^*$ steady state; $a$ positive decay rate; $u_0$ constant input; $b$ input gain; $z$ deviation.

**Real-World Applications (§5).**
1. **First-order response** — $\dot x=-2x+6$, $x(0)=1$ gives $x(t)=3-2e^{-2t}$.
2. **Value at time** — at $t=0.5$, $x=3-2e^{-1}\approx2.264$.
3. **Time constant** — for $a=2$ is $0.5$ s.
4. **Three time constants** — leave remaining error $e^{-3}\approx0.050$.
5. **Step final value** — for $\dot y+4y=8$ is $2$.
6. **Warm-start model** — if $x(0)=10$, $x^*=4$, $a=0.5$, then $x(2)=4+6e^{-1}\approx6.21$.

### `math-26-06` — Poles and zeros  · rewrite §5 · deepen derivation

**Connections (§1).**
> This lesson builds on transfer functions and the Laplace transform. A transfer function writes an LTI system as a ratio $G(s)=N(s)/D(s)$, so the roots of the numerator and denominator are no longer just algebraic details. They become the places in the complex plane that tell how the system naturally moves and how it responds to inputs.
>
> The next lessons use this language constantly. Stability reads the real parts of poles, transient response reads damping and oscillation from complex poles, and root locus follows poles as feedback gain changes. Poles and zeros are therefore the bridge from an equation to the behavior a controller designer cares about.

**Motivation & Intuition (§2).**
> When a system is disturbed briefly, its response either dies out, oscillates, or grows. For a linear system, that behavior is controlled by a small set of points in the complex plane. Factor the transfer function $G(s)=N(s)/D(s)$. The poles, which are the roots of $D(s)$, give the system's natural modes. A pole at $p$ contributes a term like $e^{pt}$, so the real part of $p$ decides whether that mode decays or grows.
>
> Zeros, which are the roots of $N(s)$, do a different job. They shape the response by reducing or blocking parts of the input-output behavior. In the worked system $G(s)=\dfrac{s+2}{(s+1)(s+4)}$, the zero is at $-2$, the poles are at $-1$ and $-4$, and the DC gain is $G(0)=\dfrac{2}{4}=0.5$. Those three numbers already tell a useful story: the system is stable, its slow mode has time constant $1$ second, and a unit step settles at one half.

**Definition & Assumptions (§3).** Display
$$
G(s)=\frac{N(s)}{D(s)},\qquad N(z)=0\text{ gives zeros},\qquad D(p)=0\text{ gives poles}.
$$
Then derive the mode rule:
1. Start with a denominator factor $s-p$ — a pole is a value $p$ that makes the denominator vanish.
2. A simple partial fraction has the form $A/(s-p)$ — this isolates the contribution of that pole.
3. Use the inverse Laplace transform $\mathcal L^{-1}\{1/(s-p)\}=e^{pt}$ — this converts the pole into a time-domain mode.
4. Write $p=\sigma+j\omega$ — every complex pole has a real part $\sigma$ and imaginary part $\omega$.
5. Then $e^{pt}=e^{\sigma t}e^{j\omega t}$ — separate growth/decay from oscillation.
6. The magnitude is $|e^{pt}|=e^{\sigma t}$ — the complex sinusoid has magnitude $1$.
7. Therefore $\sigma<0$ gives decay, $\sigma=0$ gives sustained size, and $\sigma>0$ gives growth.

**Symbols.** $G(s)$ is the transfer function; $s$ is the Laplace variable; $N(s)$ is the numerator; $D(s)$ is the denominator; $z$ is a zero; $p$ is a pole; $\sigma=\operatorname{Re}(p)$ is the decay or growth rate; $\omega=\operatorname{Im}(p)$ is the oscillation rate in radians per second.

**Real-World Applications (§5).**
1. **Stability from pole sign** — $G(s)=\dfrac{s+2}{(s+1)(s+4)}$ has poles $-1,-4$, so modes $e^{-t}$ and $e^{-4t}$ decay.
2. **Dominant speed** — the slowest pole $-1$ gives time constant $1/|-1|=1$ s; the pole $-4$ gives $0.25$ s.
3. **DC gain** — $G(0)=2/(1\cdot4)=0.5$, so a stable unit-step response settles to $0.5$.
4. **Oscillation** — poles $-2\pm3j$ have envelope $e^{-2t}$ and period $2\pi/3\approx2.09$ s.
5. **Optimization-as-control** — a linearized error update $e_{k+1}=0.9e_k$ has discrete pole $0.9$, so after $20$ steps the error multiplier is $0.9^{20}\approx0.122$.
6. **Unstable learned policy check** — if a closed-loop scalar policy gives $x_{k+1}=1.05x_k$, then $100$ steps multiply state by $1.05^{100}\approx131.5$.

### `math-26-07` — Stability  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> Poles connect algebra to natural modes. Stability uses that connection to decide whether disturbances fade or grow. This lesson gives the continuous-time pole test that later appears in transient response, Routh-Hurwitz, root locus, and pole placement. It is one of the main safety checks in linear control.

**Motivation & Intuition (§2).**
> A stable system returns toward rest after it is disturbed. In a linear model, the natural response is built from modal terms, and each pole contributes one such term. The real part of the pole controls the envelope, while the imaginary part controls oscillation.
>
> This makes stability a geometric condition in the complex plane. Poles in the left half-plane have negative real parts, so their exponential envelopes decay. A pole in the right half-plane has a positive real part, so its mode grows and eventually dominates the response.

**Definition & Assumptions (§3).** Pole real-part test:
1. A pole $p$ contributes a mode $e^{pt}$ — from the inverse Laplace transform.
2. Write $p=\sigma+j\omega$ — split real and imaginary parts.
3. Rewrite $e^{pt}=e^{\sigma t}e^{j\omega t}$ — separate envelope and oscillation.
4. Take magnitude $|e^{pt}|=e^{\sigma t}$ — the oscillatory factor has magnitude $1$.
5. If $\sigma<0$, then $e^{\sigma t}\to0$ — the mode decays.
6. If every pole has $\sigma<0$, every mode decays — the system is asymptotically stable.
7. If any pole has $\sigma>0$, that mode grows — the system is unstable.

**Symbols.** $p$ pole; $\sigma=\operatorname{Re}(p)$ real part; $\omega=\operatorname{Im}(p)$ oscillation rate; $e^{pt}$ natural mode.

**Real-World Applications (§5).**
1. **Stable polynomial** — $5/(s^2+6s+8)$ has poles $-2,-4$, so it is stable.
2. **Growing pole** — a pole $+0.5$ gives $e^{0.5t}$; at $t=4$ the multiplier is $e^2\approx7.39$.
3. **Fast decay** — pole $-2$ leaves $e^{-4}\approx0.018$ after $2$ s.
4. **Damped oscillation** — poles $-1\pm2j$ decay with time constant $1$ s.
5. **Stable discrete update** — $x^+=0.95x$ is stable because $|0.95|<1$.
6. **Unstable discrete update** — $x^+=-1.1x$ is unstable because $|-1.1|>1$.

### `math-26-08` — Transient response  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> Stability says whether a response eventually fades. Transient response describes the shape of that fading before the system settles. For second-order systems, pole location becomes damping, oscillation, overshoot, and settling time. These quantities are practical design targets for feedback controllers.

**Motivation & Intuition (§2).**
> A stable system can still behave poorly on the way to its final value. It may ring too much, overshoot a safe limit, or take too long to settle. The second-order model is the standard setting where these features can be computed directly from damping ratio and natural frequency.
>
> The poles have real part $-\zeta\omega_n$ and imaginary part $\omega_n\sqrt{1-\zeta^2}$. The real part sets the exponential envelope, and the imaginary part sets the oscillation period. From those two pieces come the common engineering rules for settling time, peak time, and percent overshoot.

**Definition & Assumptions (§3).** Standard second-order metrics:
1. Start with $G(s)=\omega_n^2/(s^2+2\zeta\omega_ns+\omega_n^2)$ — normalized second-order form.
2. Solve denominator roots to get $p=-\zeta\omega_n\pm j\omega_n\sqrt{1-\zeta^2}$ — apply the quadratic formula.
3. Read the envelope $e^{-\zeta\omega_nt}$ — the real part sets decay.
4. The 2 percent settling rule sets $e^{-\zeta\omega_nT_s}\approx0.02$ — remaining envelope is about 2 percent.
5. Solve $T_s=-\ln(0.02)/(\zeta\omega_n)\approx4/(\zeta\omega_n)$ — $-\ln(0.02)\approx3.91$.
6. The first peak occurs after half an oscillation, $t_p=\pi/(\omega_n\sqrt{1-\zeta^2})$ — the sine term reaches its first extreme.
7. Substitute into the envelope to get overshoot fraction $e^{-\zeta\pi/\sqrt{1-\zeta^2}}$ — decay by the peak time.

**Symbols.** $\omega_n$ natural frequency; $\zeta$ damping ratio; $T_s$ settling time; $t_p$ peak time; $p$ poles.

**Real-World Applications (§5).**
1. **Overshoot** — with $\zeta=0.5$, $\omega_n=8$, overshoot is $16.3\%$.
2. **Settling time** — the same system has $T_s\approx4/(0.5\cdot8)=1$ s.
3. **Oscillation period** — poles are $-4\pm j6.928$, so oscillation period is $2\pi/6.928\approx0.907$ s.
4. **Higher damping** — raising damping to $\zeta=0.7$ gives overshoot $\approx4.60\%$.
5. **Dominant pole estimate** — a dominant pole real part $-3$ gives 2 percent settling about $4/3\approx1.33$ s.
6. **Robot joint target** — with allowed $5\%$ overshoot should use $\zeta\approx0.69$ because $e^{-\zeta\pi/\sqrt{1-\zeta^2}}\approx0.05$.

### `math-26-09` — Steady-state response  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> Transient response studies the journey. Steady-state response studies what remains after stable transients have vanished. Transfer functions make many final values available through limits rather than full inverse transforms. This lesson also connects directly to feedback accuracy and steady-state error.

**Motivation & Intuition (§2).**
> In many control tasks, the final value matters as much as the path. A temperature controller should settle near the setpoint, a speed controller should remove persistent error, and a sensor model should have the correct DC gain. For stable systems, the final value theorem turns that long-time question into a calculation near $s=0$.
>
> A unit step is especially important because its transform is $1/s$. Multiplying by a transfer function gives $Y(s)=G(s)/s$, and the final value theorem cancels the step's $s$. That is why a stable unit-step final output is simply the DC gain $G(0)$.

**Definition & Assumptions (§3).** Final value theorem for a stable step response:
1. Let the unit step input have $U(s)=1/s$ — Laplace transform of a unit step.
2. Output is $Y(s)=G(s)U(s)=G(s)/s$ — transfer functions multiply inputs.
3. The final value theorem gives $y(\infty)=\lim_{s\to0}sY(s)$ — valid when the response settles.
4. Substitute $Y(s)=G(s)/s$ to get $y(\infty)=\lim_{s\to0}G(s)$ — the $s$ cancels.
5. Therefore $y(\infty)=G(0)$ — a stable unit-step final value is the DC gain.
6. For unity feedback, error transfer is $E/R=1/(1+G)$ — from block algebra.
7. With a unit step, $e(\infty)=1/(1+G(0))$ — evaluate the error transfer at DC.

**Symbols.** $Y(s)$ output transform; $U(s)$ input transform; $G(0)$ DC gain; $e(\infty)$ final error.

**Real-World Applications (§5).**
1. **Unit-step final output** — $G(s)=6/(s+3)$ settles to $G(0)=2$ for a unit step.
2. **Unity-feedback error** — with $G(0)=2$ has step error $1/3\approx0.333$.
3. **Another DC gain** — $G(s)=10/(s+5)$ has final step output $2$.
4. **Integrator loop** — a type-1 loop with an integrator has ideal step error $0$ because $G(0)=\infty$.
5. **Ramp tracking** — a ramp with velocity constant $K_v=5$ has steady error $1/K_v=0.2$.
6. **Sensor calibration** — a sensor with measured final value $0.95$ for unit input has DC gain $0.95$.

### `math-26-10` — The Routh–Hurwitz criterion  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> Stability can be checked by finding poles, but high-degree polynomials can make root finding inconvenient. The Routh-Hurwitz criterion reads stability information directly from polynomial coefficients. This lesson gives the cubic case, which is enough to show how the sign-change test works. Root locus and controller tuning often use this kind of condition to find allowable gain ranges.

**Motivation & Intuition (§2).**
> The location of roots determines stability, but sometimes the exact root values are less important than knowing whether any root has crossed into the right half-plane. Routh-Hurwitz answers that question without solving the polynomial. It organizes the coefficients into an array whose first column counts right-half-plane roots through sign changes.
>
> For a cubic with positive leading coefficient, stability reduces to a few inequalities. The coefficients must have the right signs, and the middle interaction condition $ab>c$ must hold. This gives a practical way to test a proposed controller gain before computing the closed-loop poles explicitly.

**Definition & Assumptions (§3).** Cubic condition for $s^3+as^2+bs+c$:
1. Write the first two rows of the Routh array: $s^3:[1,b]$ and $s^2:[a,c]$ — place alternating coefficients.
2. Compute the $s^1$ first-column entry $(ab-c)/a$ — determinant rule for the next row.
3. Put the $s^0$ entry $c$ — the constant term forms the last row.
4. The first column is $1,\ a,\ (ab-c)/a,\ c$ — these decide right-half-plane root count.
5. Stability requires no sign changes — all first-column entries must have the same positive sign.
6. With leading coefficient $1>0$, this gives $a>0$, $c>0$, and $(ab-c)/a>0$.
7. Since $a>0$, multiply by $a$ to get $ab>c$ — the compact cubic condition.

**Symbols.** $a,b,c$ polynomial coefficients; Routh array first column; sign change; right-half-plane root.

**Real-World Applications (§5).**
1. **Stable cubic** — $s^3+4s^2+5s+2$ has first column $1,4,4.5,2$, so stable.
2. **Unstable cubic** — $s^3+s^2+s+2$ has middle $(1-2)/1=-1$, first column $1,1,-1,2$, two sign changes.
3. **Gain lower bound** — for $s^3+2s^2+Ks+3$, stability needs $2K>3$, so $K>1.5$.
4. **Gain interval** — for $s^3+5s^2+6s+K$, stability needs $K>0$ and $30>K$.
5. **Second-order check** — for $s^2+3s+2$, positive coefficients give stable roots $-1,-2$.
6. **Near boundary** — a controller gain producing first column $1,3,0.2,5$ is stable but close to the boundary because $0.2$ is small.

### `math-26-11` — Root locus  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> Routh-Hurwitz can say whether a gain is stable. Root locus shows how the closed-loop poles move as that gain changes. It builds on transfer functions, block diagrams, and the pole interpretation of response. This makes gain tuning visible as motion in the complex plane.

**Motivation & Intuition (§2).**
> Feedback gain changes the characteristic equation of the closed-loop system. As the gain varies, the roots of that equation trace curves. Those curves show when poles become faster, when they become oscillatory, and when they approach instability.
>
> In the worked unity-feedback example, the open-loop plant has poles at $0$ and $-2$. Closing the loop with gain $K$ gives the polynomial $s^2+2s+K$. Choosing a particular $K$ then gives the closed-loop pole locations and the response information that comes with them.

**Definition & Assumptions (§3).** Unity feedback with open-loop $G(s)=1/[s(s+2)]$:
1. Closed-loop poles satisfy $1+KG(s)=0$ — denominator of $G/(1+KG)$ must vanish.
2. Substitute $G$: $1+K/[s(s+2)]=0$ — use the plant.
3. Multiply by $s(s+2)$: $s(s+2)+K=0$ — clear the denominator.
4. Expand $s^2+2s+K=0$ — get the characteristic polynomial.
5. Set $K=3$: $s^2+2s+3=0$ — choose the gain.
6. Apply the quadratic formula: $s=(-2\pm\sqrt{4-12})/2$ — solve the roots.
7. Simplify to $s=-1\pm j\sqrt2$ — read stable oscillatory poles.

**Symbols.** $K$ gain; $G(s)$ open-loop transfer; root locus; closed-loop pole; characteristic equation.

**Real-World Applications (§5).**
1. **Chosen gain** — for $K=3$, poles are $-1\pm j\sqrt2$.
2. **Double pole** — for $K=1$, $s^2+2s+1=(s+1)^2$, a double pole at $-1$.
3. **Starting poles** — for $K=0$, poles start at $0$ and $-2$.
4. **Higher gain** — for $K=5$, poles are $-1\pm2j$, period $\pi\approx3.14$ s.
5. **Damping ratio** — for $K=3$ is $1/\sqrt3\approx0.577$.
6. **Natural frequency** — for $K=3$ is $\sqrt3\approx1.732$ rad/s.

### `math-26-12` — Frequency response  · deepen derivation

**Connections (§1).**
> Transfer functions describe how inputs become outputs. Frequency response studies that relationship one sinusoidal frequency at a time. It connects time-domain differential equations to gain and phase, which are the language of filters, resonance, and robustness. Bode plots in the next lesson organize the same information across many frequencies.

**Motivation & Intuition (§2).**
> Linear time-invariant systems have a special relationship with sinusoids. A sinusoidal input produces a sinusoidal output at the same frequency, but the amplitude and phase may change. Complex exponentials make this fact algebraic, because differentiation only multiplies $e^{j\omega t}$ by $j\omega$.
>
> Evaluating the transfer function at $s=j\omega$ gives the multiplier for that frequency. Its magnitude tells how much the input amplitude is scaled, and its angle tells how much the output is shifted in phase. This lets a control designer compare low-frequency tracking, high-frequency noise rejection, and phase delay with one common tool.

**Definition & Assumptions (§3).** Why $G(j\omega)$ is the sinusoidal gain:
1. Use complex input $u(t)=e^{j\omega t}$ — real sinusoids are real parts of this signal.
2. A derivative gives $du/dt=j\omega e^{j\omega t}$ — differentiating only multiplies by $j\omega$.
3. In an LTI differential equation, every derivative becomes a factor of $j\omega$ — the same exponential factors out.
4. The remaining algebraic multiplier is $G(j\omega)$ — evaluate the transfer function on the imaginary axis.
5. Thus $y(t)=G(j\omega)e^{j\omega t}$ — same frequency, complex multiplier.
6. The magnitude $|G(j\omega)|$ scales amplitude and the angle $\angle G(j\omega)$ shifts phase.

**Symbols.** $j$ imaginary unit; $\omega$ angular frequency; $G(j\omega)$ frequency response; magnitude; phase.

**Real-World Applications (§5).**
1. **First-order gain** — $G(s)=2/(s+2)$ at $\omega=3$ has gain $2/\sqrt{13}\approx0.555$.
2. **Phase lag** — its phase is $-\tan^{-1}(3/2)\approx-56.3^\circ$.
3. **Voltage scaling** — a $3$ V input at gain $0.555$ produces $1.66$ V output.
4. **Low-pass attenuation** — $1/(0.5s+1)$ at $\omega=10$ has gain $1/\sqrt{26}\approx0.196$.
5. **Channel compensation** — a channel gain $0.25$ needs $4$ times amplitude to compensate before noise limits.
6. **Phase as delay** — a phase of $-90^\circ$ at $6$ rad/s corresponds to delay $\pi/(12)\approx0.262$ s.

### `math-26-13` — Bode plots  · deepen derivation

**Connections (§1).**
> Frequency response gives gain and phase at one frequency. A Bode plot shows those quantities across a wide frequency range. It uses logarithmic frequency and decibels so common transfer-function factors have recognizable shapes. This is the standard picture for bandwidth, rolloff, resonance, and phase margin.

**Motivation & Intuition (§2).**
> Control systems often need to behave differently at different frequencies. They may track slow commands, reject medium-frequency disturbances, and avoid amplifying high-frequency sensor noise. A Bode plot makes these tradeoffs visible by plotting magnitude and phase against frequency.
>
> Decibels are useful because products of gains become sums of dB values. A first-order pole gives about $-20$ dB per decade after its corner, and at the corner its magnitude is $1/\sqrt2$, or about $-3$ dB. These simple patterns let designers sketch and interpret complicated products of factors.

**Definition & Assumptions (§3).** First-order pole slope:
1. Write $G(s)=1/(1+s/a)$ — a first-order pole with corner $a$.
2. Evaluate at $s=j\omega$: $G(j\omega)=1/(1+j\omega/a)$ — frequency response.
3. Magnitude is $|G(j\omega)|=1/\sqrt{1+(\omega/a)^2}$ — complex magnitude.
4. At $\omega=a$, magnitude is $1/\sqrt2\approx0.707$ — substitute the corner frequency.
5. Convert to dB: $20\log_{10}(1/\sqrt2)\approx-3.01$ dB — amplitude dB formula.
6. For $\omega\gg a$, $|G|\approx a/\omega$ — the high-frequency term dominates.
7. Multiplying $\omega$ by $10$ changes $20\log_{10}(a/\omega)$ by $-20$ dB — one-pole rolloff.

**Symbols.** $a$ corner frequency; $\omega$ frequency; dB decibel; $|G|$ magnitude; $\angle G$ phase.

**Real-World Applications (§5).**
1. **Corner magnitude** — $G(s)=10/(s+10)$ at $\omega=10$ has magnitude $-3.01$ dB.
2. **Corner phase** — its phase is $-45^\circ$.
3. **Gain increase** — a $6$ dB gain increase multiplies amplitude by $10^{6/20}\approx2.00$.
4. **Gain cut** — a $-12$ dB cut gives amplitude ratio $10^{-12/20}\approx0.251$.
5. **Resonance** — a $14$ dB resonance has ratio $10^{14/20}\approx5.01$.
6. **Two poles** — two first-order poles produce about $-40$ dB per decade after both corners.

### `math-26-14` — PID controllers  · deepen derivation

**Connections (§1).**
> Feedback uses error to choose input. A PID controller is the most common practical way to build that input from the error signal. It combines present error, accumulated past error, and rate of change of error. The Laplace-domain form also connects PID tuning to transfer functions and closed-loop pole behavior.

**Motivation & Intuition (§2).**
> Proportional action reacts to the current error, so it gives an immediate correction. Integral action accumulates error over time, which helps remove persistent offset that proportional action may leave behind. Derivative action reacts to the error's rate of change, which can add damping or anticipation when used carefully.
>
> The three terms are easy to write in time domain, but control analysis often uses the Laplace domain. Under zero initial conditions, integration becomes division by $s$ and differentiation becomes multiplication by $s$. That gives the familiar controller transfer $K_P+K_I/s+K_Ds$.

**Definition & Assumptions (§3).** Time-domain to Laplace-domain PID:
1. Define error $e(t)=r(t)-y(t)$ — reference minus output.
2. Write $u(t)=K_Pe(t)+K_I\int_0^t e(\tau)d\tau+K_Dde/dt$ — add P, I, and D actions.
3. Take Laplace transforms with zero initial conditions — each term transforms separately.
4. Proportional term becomes $K_PE(s)$ — constants pass through.
5. Integral term becomes $K_IE(s)/s$ — integration divides by $s$.
6. Derivative term becomes $K_DsE(s)$ — differentiation multiplies by $s$.
7. Factor $E(s)$ to get $U(s)=(K_P+K_I/s+K_Ds)E(s)$ — the PID transfer is the bracketed factor.

**Symbols.** $e$ error; $u$ control input; $K_P,K_I,K_D$ gains; $E(s),U(s)$ Laplace transforms.

**Real-World Applications (§5).**
1. **Combined PID action** — with $e=2$, $\int e=5$, $de/dt=-0.4$, gains $3,0.8,1.5$, $u=9.4$.
2. **P-only thermostat** — $2^\circ$C error and $30$ W/degree gives $60$ W.
3. **Integral term** — $K_I=0.5$, accumulated error $8$ gives $4$ units.
4. **Derivative term** — $K_D=0.03$, rate $-20^\circ$/s gives $-0.6$.
5. **Windup example** — saturation at $5$ when requested $8$ leaves $3$ units unserved.
6. **Robot joint** — $e=0.1$, $\int e=0.3$, $de/dt=-0.2$, gains $20,4,2$ gives $u=2.8$.

### `math-26-15` — State-space representation  · deepen derivation

**Connections (§1).**
> Transfer functions focus on input-output behavior. State-space models keep track of the internal variables needed to predict future motion. This representation handles multiple inputs and outputs naturally and prepares the rank tests for controllability and observability. It is also the form used for LQR and Kalman filtering.

**Motivation & Intuition (§2).**
> A higher-order differential equation contains hidden memory, such as position and velocity in a mechanical system. State-space modeling makes that memory explicit by collecting the necessary variables into a vector $x$. Once the state is known, the model can predict the next instant from $\dot x=Ax+Bu$ and the measured output from $y=Cx+Du$.
>
> The standard conversion turns one second-order equation into two first-order equations. Position becomes one state, velocity becomes another, and acceleration is rewritten using the original equation. The result is a matrix model whose eigenvalues, input directions, and measured directions can be analyzed systematically.

**Definition & Assumptions (§3).** Convert $\ddot q+3\dot q+2q=u$ with $y=q$:
1. Choose $x_1=q$ — position is part of the needed memory.
2. Choose $x_2=\dot q$ — velocity completes the second-order state.
3. Differentiate $x_1$: $\dot x_1=x_2$ — velocity is position derivative.
4. Solve the original equation: $\ddot q=-2q-3\dot q+u$ — isolate acceleration.
5. Replace variables: $\dot x_2=-2x_1-3x_2+u$ — write acceleration in state variables.
6. Put coefficients into matrices: $A=\begin{bmatrix}0&1\\-2&-3\end{bmatrix}$, $B=\begin{bmatrix}0\\1\end{bmatrix}$ — state and input coefficients.
7. Output is $y=\begin{bmatrix}1&0\end{bmatrix}x$ — measure position only.

**Symbols.** $x$ state vector; $u$ input; $y$ output; $A$ dynamics matrix; $B$ input matrix; $C$ output matrix; $D$ direct feedthrough.

**Real-World Applications (§5).**
1. **Eigenvalues** — the example has eigenvalues $-1,-2$, so the uncontrolled motion is stable.
2. **Robot state dimension** — a two-joint robot with angles and velocities has $4$ states.
3. **Discrete update** — $x_{t+1}=0.8x_t+2u_t$, $x_0=5$, $u_0=1$ gives $x_1=6$.
4. **Output matrix** — $C=[1\ 0]$ and $x=[10,2]^T$ gives $y=10$.
5. **Euler prediction** — with position $3$ m, velocity $2$ m/s, $\Delta t=0.1$ gives $3.2$ m.
6. **RNN analogy** — $h_{t+1}=0.5h_t+x_t$, $h_t=4$, $x_t=3$ gives $5$.

### `math-26-16` — Controllability  · rewrite §5 · deepen derivation

**Connections (§1).**
> State-space models separate the dynamics matrix from the input matrix. Controllability asks whether those inputs can move the full state, not just the variables they touch directly. This lesson gives the rank test that checks reachable directions. Pole placement and LQR both rely on having enough control authority.

**Motivation & Intuition (§2).**
> An actuator may push only one coordinate directly, but the system dynamics can carry that push into other coordinates over time. A force changes velocity immediately, and velocity then changes position. Controllability measures whether the direct input directions and their dynamically mixed versions span the whole state space.
>
> The controllability matrix collects those directions as columns. In a two-state system, $B$ gives the direct direction and $AB$ gives the next direction produced by the dynamics. If the rank is the number of states, then the input can influence every independent state direction.

**Definition & Assumptions (§3).** For two-state $\dot x=Ax+Bu$:
1. An input first moves along columns of $B$ — those are direct actuation directions.
2. After dynamics mix that direction, it contributes $AB$ — the system carries input effects into new directions.
3. For two states, collect $\mathcal C=[B\ AB]$ — enough columns for the rank test.
4. With $A=\begin{bmatrix}0&1\\0&0\end{bmatrix}$ and $B=\begin{bmatrix}0\\1\end{bmatrix}$, compute $AB=\begin{bmatrix}1\\0\end{bmatrix}$ — multiply matrices.
5. Thus $\mathcal C=\begin{bmatrix}0&1\\1&0\end{bmatrix}$ — columns are both coordinate directions.
6. The rank is $2$ — columns are independent.
7. Since rank equals the number of states, the pair is controllable.

**Symbols.** $A$ dynamics matrix; $B$ input matrix; $n$ state dimension; $\mathcal C$ controllability matrix; rank; span.

**Real-World Applications (§5).**
1. **Double integrator** — has $\operatorname{rank}\mathcal C=2$, so position and velocity are reachable.
2. **Uncontrollable input** — if $B=[1,0]^T$ with the same $A$, $AB=0$ and rank is $1$, not controllable.
3. **Independent actuators** — two independent actuators $B=I_2$ give rank $2$ immediately.
4. **Three-state chain** — with $B=e_3$ and companion dynamics can produce $B,AB,A^2B=e_3,e_2,e_1$, rank $3$.
5. **Actuator limit** — if velocity needs change $10$ and max input is $2$ per second, at least $5$ s is needed even when controllable.
6. **Feature-control analogy** — if updates span only one of two parameter directions, rank $1$ means one direction cannot be corrected.

### `math-26-17` — Observability  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> Controllability asks what inputs can move. Observability asks what measurements can reveal. It uses the same state-space model but looks from the sensor side rather than the actuator side. This idea is essential before designing estimators such as Kalman filters.

**Motivation & Intuition (§2).**
> A sensor may measure only part of the state directly. Even so, the unmeasured parts can sometimes be inferred from how the measurement changes over time. Position samples, for example, can reveal velocity when the dynamics connect velocity to position.
>
> The observability matrix stacks the measured direction $C$ and the dynamically shifted measured direction $CA$. If those rows span the state space, then the initial state leaves enough evidence in the output history to be recovered. If the rank is too small, some hidden direction never affects the measurements.

**Definition & Assumptions (§3).** For two-state $y=Cx$:
1. The first measurement sees $Cx(0)$ — direct sensor information.
2. The derivative or next-time behavior carries $CAx(0)$ — dynamics reveal another mixture of the initial state.
3. For two states, collect $\mathcal O=\begin{bmatrix}C\\CA\end{bmatrix}$ — stack measured directions.
4. With $A=\begin{bmatrix}1&1\\0&1\end{bmatrix}$ and $C=\begin{bmatrix}1&0\end{bmatrix}$, compute $CA=\begin{bmatrix}1&1\end{bmatrix}$ — multiply sensor by dynamics.
5. Thus $\mathcal O=\begin{bmatrix}1&0\\1&1\end{bmatrix}$ — two measurement rows.
6. Its determinant is $1$, so rank is $2$ — rows are independent.
7. Since rank equals the state dimension, the pair is observable.

**Symbols.** $C$ output matrix; $A$ dynamics matrix; $\mathcal O$ observability matrix; rank; initial state.

**Real-World Applications (§5).**
1. **Worked pair** — has rank $2$, so both states are recoverable.
2. **Hidden position** — if $C=[0\ 1]$ with the same $A$, then $CA=[0\ 1]$, rank $1$, so position is hidden.
3. **Velocity from samples** — measuring position in constant-velocity motion reveals velocity from two samples: $(x_1-x_0)/\Delta t$. With $10$ m and $13$ m over $1$ s, velocity is $3$ m/s.
4. **Sensor fusion** — measuring both states with $C=I_2$ gives rank $2$ immediately.
5. **Kalman filter precheck** — unobservable bias state cannot be corrected no matter how small sensor noise is.
6. **Recommender state analogy** — if only one aggregate metric is measured for a two-factor user state and dynamics do not mix factors, rank stays $1$.

### `math-26-18` — State feedback and pole placement  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> Controllability says when the input has enough authority to shape the state. State feedback uses that authority by setting the input as a function of the measured state. Pole placement chooses the feedback gains so the closed-loop eigenvalues land at desired locations. This connects state-space algebra back to the pole-based response ideas from earlier lessons.

**Motivation & Intuition (§2).**
> In state feedback, the controller does not wait to compare only final output with reference. It uses the current state vector directly, so position and velocity, or other state components, can be corrected together. The gain row $K$ determines how strongly each state component contributes to the input.
>
> For the double integrator, feedback changes the closed-loop matrix from $A$ to $A-BK$. The characteristic polynomial of that matrix contains the gain entries. By matching it to a desired polynomial, the controller places the closed-loop poles and therefore sets the natural modes of the controlled system.

**Definition & Assumptions (§3).** Double integrator with $u=-[k_1\ k_2]x$:
1. Write $A=\begin{bmatrix}0&1\\0&0\end{bmatrix}$, $B=\begin{bmatrix}0\\1\end{bmatrix}$, $K=\begin{bmatrix}k_1&k_2\end{bmatrix}$ — define matrices.
2. Compute $BK=\begin{bmatrix}0&0\\k_1&k_2\end{bmatrix}$ — input column times gain row.
3. Closed-loop matrix is $A-BK=\begin{bmatrix}0&1\\-k_1&-k_2\end{bmatrix}$ — substitute feedback.
4. Characteristic polynomial is $\det(sI-(A-BK))=s^2+k_2s+k_1$ — compute determinant.
5. Desired poles $-2,-3$ give $(s+2)(s+3)=s^2+5s+6$ — expand target polynomial.
6. Match coefficients: $k_2=5$, $k_1=6$ — equal polynomials have equal coefficients.
7. Therefore $K=[6\ 5]$ — this places the poles.

**Symbols.** $K$ feedback gain; $A-BK$ closed-loop dynamics; eigenvalues/poles; characteristic polynomial.

**Real-World Applications (§5).**
1. **Desired poles** — $-2,-3$ give $K=[6\ 5]$.
2. **Closed-loop polynomial** — is $s^2+5s+6$.
3. **Closed-loop modes** — are $e^{-2t}$ and $e^{-3t}$.
4. **Slowest time constant** — is $1/2=0.5$ s.
5. **Faster desired poles** — if desired poles are $-4,-5$, then target $s^2+9s+20$ gives $K=[20\ 9]$.
6. **Control effort** — at $x=[1,0]^T$ with $K=[6\ 5]$ is $u=-6$.

### `math-26-19` — The Linear Quadratic Regulator (LQR)  · rewrite §5 · deepen derivation

**Connections (§1).**
> Pole placement chooses desired poles directly. LQR chooses feedback by minimizing a cost that balances state error against control effort. It still produces a stabilizing state-feedback gain, but the gain comes from an optimization problem. This lesson prepares the optimal-control view used again in dynamic programming and reinforcement learning.

**Motivation & Intuition (§2).**
> Hand-selecting poles can be effective, but it does not say how expensive the required control effort will be. LQR makes that tradeoff explicit with a quadratic cost: large states are penalized, and large inputs are penalized too. Changing the weights changes whether the controller acts aggressively or conservatively.
>
> In the scalar integrator, the value function is quadratic because both the dynamics and cost are simple. The Hamilton-Jacobi-Bellman condition finds the input that minimizes immediate cost plus future value change. Solving the resulting algebra gives the feedback gain $K=\sqrt{q/r}$.

**Definition & Assumptions (§3).** Scalar continuous-time integrator $\dot x=u$, cost $\int_0^\infty(qx^2+ru^2)dt$:
1. Assume value $V(x)=Px^2$ — quadratic cost and linear dynamics preserve quadratic form.
2. The HJB stationary condition is $0=\min_u(qx^2+ru^2+V_xu)$ — running cost plus value change.
3. Compute $V_x=2Px$ — derivative of the value function.
4. Differentiate with respect to $u$: $2ru+2Px=0$ — first-order optimality.
5. Solve $u=-(P/r)x$ — optimal feedback is linear.
6. Substitute back: $0=qx^2+r(P^2/r^2)x^2-2P^2/r\,x^2$ — plug the minimizing input into HJB.
7. Combine terms: $0=(q-P^2/r)x^2$ — one quadratic coefficient must vanish.
8. Solve $P=\sqrt{qr}$ and $K=P/r=\sqrt{q/r}$ — take the positive stabilizing root.

**Symbols.** $J$ total cost; $Q$ or $q$ state penalty; $R$ or $r$ effort penalty; $P$ Riccati/value coefficient; $K$ feedback gain.

**Real-World Applications (§5).**
1. **Trial cost** — at $x=3$, $u=-3$ is $9+0.25\cdot9=11.25$.
2. **More effort** — trial $u=-6$ gives $9+0.25\cdot36=18$, so $u=-x$ is cheaper among the two.
3. **Scalar optimal gain** — for scalar integrator with $q=1$, $r=0.25$, optimal gain is $K=\sqrt{1/0.25}=2$.
4. **Closed-loop pole** — the feedback $u=-2x$ puts the scalar closed-loop pole at $-2$.
5. **Effort penalty** — if $r=4$, $K=0.5$, so effort is weighted more heavily.
6. **Value coefficient** — for $q=1$, $r=0.25$ is $P=0.5$, so $V(3)=4.5$.

### `math-26-20` — Kalman filtering  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> Observability says whether measurements contain enough information to recover state. Kalman filtering gives a principled way to estimate that state when measurements and models are noisy. It blends prediction with correction using uncertainty. The same state-space viewpoint used for control gains now supports sensor fusion and estimation.

**Motivation & Intuition (§2).**
> A model prediction is useful but imperfect, and a sensor measurement is useful but noisy. A Kalman filter combines them by weighting each source according to its variance. When the prior estimate is uncertain or the measurement is accurate, the gain is larger and the filter moves strongly toward the measurement.
>
> In the scalar direct-measurement case, the update is a weighted correction by the innovation $y-\hat x^-$. The best gain is found by minimizing the posterior error variance. The algebra gives $K=P^-/(P^-+R)$, which is a clear uncertainty ratio.

**Definition & Assumptions (§3).** Scalar direct measurement:
1. Let prior estimate be $\hat x^-$ with variance $P^-$ and measurement $y=x+v$ with noise variance $R$ — define information sources.
2. Use update $\hat x^+=\hat x^-+K(y-\hat x^-)$ — correct by the innovation.
3. Error after update is $x-\hat x^+=(1-K)(x-\hat x^-)-Kv$ — substitute $y=x+v$.
4. Variance is $P^+=(1-K)^2P^-+K^2R$ — independent prior error and measurement noise add variances.
5. Differentiate: $dP^+/dK=-2(1-K)P^-+2KR$ — minimize posterior variance.
6. Set to zero: $(1-K)P^-=KR$ — balance weighted uncertainties.
7. Solve $K=P^-/(P^-+R)$ — isolate the Kalman gain.

**Symbols.** $\hat x^-$ prior estimate; $\hat x^+$ posterior estimate; $P^-$ prior variance; $R$ measurement variance; $K$ Kalman gain; $y$ measurement.

**Real-World Applications (§5).**
1. **Prior and sensor blend** — prior $10$, variance $4$, sensor $13$, variance $1$ gives $K=4/5=0.8$.
2. **Posterior estimate** — is $10+0.8(3)=12.4$.
3. **Posterior variance** — is $(1-0.8)4=0.8$ using the simplified scalar formula.
4. **Noisier measurement** — if measurement variance rises to $9$, gain becomes $4/(4+9)=0.308$.
5. **Trusted model** — if prior variance is $0.25$ and sensor variance is $1$, gain is $0.2$, so the filter trusts the model more.
6. **Sensor fusion analogy** — two independent estimates with variances $4$ and $1$ weight the low-variance sensor $4$ times as strongly.

### `math-26-21` — Optimal control  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> LQR is one structured example of optimal control. This lesson states the broader idea: choose actions over time to minimize cost while obeying dynamics. The value function records the best remaining cost from each state. This language leads naturally to model predictive control and to Bellman equations in reinforcement learning.

**Motivation & Intuition (§2).**
> Control design often involves competing goals. Moving the state closer to a target is good, but large actions may be costly, unsafe, or impossible. Optimal control writes these goals as an objective and then solves for the action sequence that gives the best tradeoff.
>
> The one-step quadratic example keeps the full idea visible. The next state is $x_1=x_0+u$, and the cost penalizes both the next state and the action. Substituting the dynamics turns the problem into one convex quadratic in $u$, so ordinary differentiation finds the optimal control.

**Definition & Assumptions (§3).** One-step quadratic problem $x_1=x_0+u$, $J=x_1^2+u^2$:
1. Substitute dynamics into cost: $J(u)=(x_0+u)^2+u^2$ — eliminate the next state.
2. For $x_0=4$, write $J(u)=(4+u)^2+u^2$ — use the starting state.
3. Expand $J=16+8u+2u^2$ — prepare for minimization.
4. Differentiate $dJ/du=8+4u$ — first-order condition.
5. Set $8+4u=0$ — optimum of a convex quadratic.
6. Solve $u=-2$ — best one-step control.
7. The optimal cost is $(4-2)^2+(-2)^2=8$ — evaluate the chosen action.

**Symbols.** $x_t$ state; $u$ control; $J$ objective; $L$ running cost; $\phi$ terminal cost; $V$ value function.

**Real-World Applications (§5).**
1. **Trial action** — $u=-1$ gives $J=3^2+1=10$.
2. **Better trial action** — $u=-2$ gives $J=2^2+4=8$, so it is better.
3. **Exact minimizer** — is $u=-2$.
4. **Model predictive control** — with horizon $3$ and $4$ actions per step checks $4^3=64$ sequences by brute force.
5. **Fuel penalty** — if cost is $(4+u)^2+4u^2$, optimum solves $8+10u=0$, so $u=-0.8$.
6. **Terminal-only control** — with $x_0=4$, target $0$, and max action $|u|\le1$ can only reach $x_1=3$ in one step.

### `math-26-22` — Control theory ↔ reinforcement learning  · deepen derivation

**Connections (§1).**
> Control theory and reinforcement learning both study actions that affect future states. Control often begins with a known model and a cost to minimize, while reinforcement learning often learns values or policies from sampled rewards. The mathematical bridge is the value function. This final lesson connects the control vocabulary from this section to the Bellman recursion used in RL.

**Motivation & Intuition (§2).**
> In a sequential decision problem, an action matters because it changes not only the immediate reward or cost but also the future state. A value function summarizes those future consequences. Instead of evaluating an entire infinite sequence from scratch each time, the Bellman equation separates the first reward from the value of what remains.
>
> The discount factor $\gamma$ controls how strongly future rewards count, in the standard discounted setting. By pulling out the first term of the return and recognizing the rest as the next return, the infinite sum becomes a recursion. That recursion is the shared backbone behind dynamic programming, value estimation, and many RL algorithms.

**Definition & Assumptions (§3).** Bellman equation for a fixed policy:
1. Define return $G_t=\sum_{k=0}^{\infty}\gamma^k r_{t+k}$ — discounted future reward.
2. Separate the first term: $G_t=r_t+\sum_{k=1}^{\infty}\gamma^k r_{t+k}$ — isolate immediate reward.
3. Re-index the tail: $\sum_{k=1}^{\infty}\gamma^k r_{t+k}=\gamma\sum_{m=0}^{\infty}\gamma^m r_{t+1+m}$ — factor one discount.
4. Recognize the tail as $\gamma G_{t+1}$ — same return starting next step.
5. Take conditional expectation under policy $\pi$: $V^\pi(s)=\mathbb E[r_t+\gamma G_{t+1}\mid s_t=s]$ — value is expected return.
6. Replace expected next return by next-state value: $V^\pi(s)=\mathbb E[r(s,a)+\gamma V^\pi(s')\mid s]$ — Bellman recursion.

**Symbols.** $s$ state; $a$ action; $\pi$ policy; $r$ reward; $\gamma$ discount; $V^\pi$ value function; $s'$ next state.

**Real-World Applications (§5).**
1. **Discounted return** — rewards $2,1,4$ with $\gamma=0.9$ give return $2+0.9+0.81\cdot4=6.14$.
2. **Q-learning target** — with reward $2$, next value $5$, discount $0.9$ is $6.5$.
3. **LQR value** — $V(x)=2x^2$ gives $V(3)=18$ and $V(1)=2$, saving $16$.
4. **Exploration rate** — an $\epsilon$-greedy policy with $\epsilon=0.1$ explores about $10$ times in $100$ decisions.
5. **Reward-cost sign** — reward maximization equals cost minimization by sign: rewards $3,2$ correspond to costs $-3,-2$ and total cost $-5$.
6. **Policy-gradient update** — a policy-gradient estimate $-4$ with learning rate $0.05$ updates the parameter by $-0.2$.

---

## Build order for this section

1. **Start with `math-26-06`** to set voice, pole/zero notation, and the control-specific §5 standard.
2. **Rewrite the boilerplate §5 blocks** in this order: transfer/pole family `26-03`…`26-11`, state/optimal family `26-16`…`26-21`, then intro pair `26-01`…`26-02`.
3. **Author complete derivations** for all 22 lessons, keeping one operation per step and symbol glosses adjacent to the formulas.
4. **Promote formulas to display form** for the 20 flagged lessons; keep existing display formulas in `26-14` and any already-rendered matrix displays.
5. **Fix/verify less-than rendering** for `26-01`, `26-02`, `26-07`, `26-08`, and `26-22` in the dump/render path before checking the final lessons.
