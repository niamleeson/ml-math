# Math · Part 06 — Harmonic / Fourier analysis  (deep-authored reference)

> **Per-section execution plan.** Load together with the master
> [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) for the four exposition
> principles: warm voice, complete step-by-step derivations, case-by-case proof choices, and named symbols.
> Numbers below were checked with `python3` + `numpy` (`np.fft`, `np.convolve`, and direct arithmetic). No genuine
> LaTeX bugs were found in the dump.

**Section:** Harmonic / Fourier analysis · **Lessons:** 19 · **Breadcrumb:** `Mathematics · Analysis & Calculus` · **Priority:** STANDARD (targeted deepening)

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| §5 boilerplate — no whole-section repeated app block detected | 0 / 19 |
| Templated / thin motivation | 0 / 19 |
| Key formula not in display form (`math-06-07`, `06-11`, `06-15`, `06-16`, `06-17`, `06-18`, `06-19`) | 7 / 19 |
| Unclosed-`$` or broken matrix row LaTeX bugs | 0 / 19 |
| Complete derivation to author or deepen | 17 / 19 |
| Explain-only, by case judgment | 2 / 19 |

**The core change:** keep the section's already-good spectral focus, but make every lesson render as a deep per-lesson plan: complete derivations where there is a formula, symbol glosses, and six applications whose numbers come from that lesson's own Fourier idea.

---

## Priority & systemic issues

- No shared §5 boilerplate block was present. The work is targeted deepening: make every app numerical and concept-specific rather than merely related to signals.
- `math-06-06` was already rated strong in the master. Use it as the model entry because it is the section's gateway from periodic series to continuous spectra.
- The section should make the ML line explicit: spectra explain convolution, filtering, aliasing, FFT feature pipelines, CNN kernels, and spectral architectures.
- Formula-to-display repairs are authoring instructions, not bug fixes: promote the transform properties, uncertainty inequality, Laplace/Fourier relation, wavelet transform, filtering equation, spectral heat-mode rule, and CNN convolution rule.
- LaTeX bugs: none found. `$e<0$`-style comparisons are not bugs; no odd-dollar fields or broken `bmatrix` row separators were found.

---

## Model entry (full prose)

### Model entry — `math-06-06` The Fourier transform  — **full-depth model entry**

**Connections (§1).**
> Fourier series showed that a periodic signal can be described by sine, cosine, or complex exponential coordinates. That idea is already useful for repeating sound, seasons, and waves, but many important signals do not repeat. A pulse, a word, a sensor spike, an image row, and a probability density are better treated as signals on a line rather than as one cycle of a repeating pattern.
>
> The Fourier transform keeps the same coordinate idea and removes the fixed period. Instead of asking for the amount of frequency $n$ in one repeating interval, it asks for the amount of every real angular frequency $\omega$. This lesson is the bridge to transform properties, convolution, filtering, sampling, the DFT, FFT, and the spectral view of CNNs.

**Motivation & Intuition (§2).**
> A nonperiodic signal can still contain slow and fast variation. A wide smooth pulse mostly overlaps slow oscillations. A narrow click overlaps many fast oscillations. The Fourier transform measures that overlap by multiplying the signal by a complex wave $e^{-i\omega t}$ and integrating over all time.
>
> The result $\hat f(\omega)$ is usually complex. Its magnitude tells how strongly frequency $\omega$ is present, and its phase tells how that frequency is aligned. At $\omega=0$, the complex wave is just $1$, so the transform records total area. At larger $|\omega|$, the oscillation alternates positive and negative more quickly, so only matching rapid structure survives the integral.
>
> This is why the transform is central for machine learning systems that handle audio, images, sensors, and learned operators. It turns local variation in time or space into a frequency description where smoothness, edges, blur, aliasing, and convolution become easier to reason about.

**Definition & Assumptions (§3).** Display
$$
\hat f(\omega)=\int_{-\infty}^{\infty} f(t)e^{-i\omega t}\,dt,\qquad
f(t)=\frac1{2\pi}\int_{-\infty}^{\infty}\hat f(\omega)e^{i\omega t}\,d\omega .
$$
For $f(t)=e^{-at}$ on $t\ge0$ and $0$ for $t<0$, with $a>0$, author the complete derivation:
1. $\hat f(\omega)=\int_0^\infty e^{-at}e^{-i\omega t}\,dt$ because the signal is zero for $t<0$.
2. $\hat f(\omega)=\int_0^\infty e^{-(a+i\omega)t}\,dt$ because multiplying exponentials adds exponents.
3. An antiderivative is $-e^{-(a+i\omega)t}/(a+i\omega)$ because differentiating it returns the integrand.
4. The upper-limit term is $0$ because $a>0$ gives real exponential decay.
5. The lower-limit term is $-1/(a+i\omega)$ because $e^0=1$.
6. Subtract endpoints: $0-[-1/(a+i\omega)]=1/(a+i\omega)$.
7. Check $\omega=0$: $\hat f(0)=1/a$, matching the area under $e^{-at}$ on $[0,\infty)$.

**Symbols.** $t$ is the original time or spatial variable; $\omega$ is angular frequency in radians per unit; $i^2=-1$; $\hat f$ is the frequency-domain function; $a$ is a positive decay rate; $1/(2\pi)$ is the inverse constant for this convention.

**Real-World Applications (§5).**
1. **Audio spectrum.** A $0.01$ s analysis window has rough frequency spacing $1/0.01=100$ Hz.
2. **Image stripes.** A stripe repeating every $8$ pixels has spatial frequency $1/8=0.125$ cycles/pixel.
3. **One-sided exponential.** For $e^{-3t}1_{t\ge0}$, $|\hat f(4)|=|1/(3+4i)|=1/5=0.2$.
4. **Box pulse.** For $1_{|t|\le1}$, $\hat f(\omega)=2\sin\omega/\omega$; at $\omega=\pi/2$ this is $4/\pi\approx1.273$.
5. **MRI grids.** A $256\times256$ scan has $65{,}536$ spatial pixels and the same count of full frequency samples.
6. **ML spectral bias.** Amplitudes $10$ at frequency $1$ and $0.5$ at frequency $20$ have energy ratio $10^2/0.5^2=400$.

---

## Per-lesson change specs

**How to read these specs.** Each block is drafted content for the lesson in Part 02's shorthand. Labels are plan-internal; the app should render them as flowing prose in a plain textbook voice.

### `math-06-01` — Periodic functions  · deepen

**Connections (§1).**
> Periodic functions are the simplest setting where repetition becomes a mathematical structure. The reader already knows functions, graphs, and basic trigonometry, so the new point is not a new kind of formula but a rule about copying values. Once one repeat block is known, the rest of the signal is determined by shifting that block forward or backward. This makes periodicity the natural starting point for Fourier analysis, where repeated signals are described by repeated waves.

**Motivation & Intuition (§2).**
> A periodic function repeats after a fixed positive step. This means the function does not need to be understood separately at every time. If $T$ is a period, then the value at $t+T$ is the same as the value at $t$, and applying the same rule again gives the value at $t+2T$, $t+3T$, and all integer shifts.
>
> Sinusoids give the basic examples because they repeat after a full turn around the circle. The angular frequency $\omega$ tells how fast the angle advances, so a larger $|\omega|$ completes the same $2\pi$ turn in less time. This link between period and angular frequency is the first bridge from repeating graphs to frequency coordinates.

**Definition & Assumptions (§3).** Period propagation and sinusoid period:
1. Start with $f(t+T)=f(t)$ for all $t$ because $T$ is a period.
2. Replace $t$ by $t+T$ to get $f(t+2T)=f(t+T)$ because the identity holds everywhere.
3. Use step 1 to get $f(t+2T)=f(t)$ because $f(t+T)=f(t)$.
4. Repeat the same argument to get $f(t+nT)=f(t)$ for every integer $n$.
5. For $\sin(\omega t)$, require $\omega(t+T)=\omega t+2\pi$ because sine repeats after one full turn.
6. Subtract $\omega t$ and divide by $|\omega|$ to get $T=2\pi/|\omega|$.

**Symbols.** $T$ period; fundamental period smallest positive period; $\omega$ angular frequency; $n$ integer repeat count.

**Real-World Applications (§5).**
1. **Calendar feature.** Day $91$ gives $\theta=2\pi(91)/365\approx1.566$, so $(\sin\theta,\cos\theta)\approx(1.000,0.004)$.
2. **Audio.** $440$ Hz has period $1/440\approx0.00227$ s.
3. **Daily traffic.** $\omega=2\pi/24=\pi/12$ rad/hour.
4. **Fan.** A fan at $1800$ rpm is $30$ Hz, period $0.0333$ s.
5. **Positional channel.** $\sin(p\pi/2)$ repeats every $4$ positions.
6. **Circular buffer.** A circular buffer of length $8$: index $19$ maps to $19\bmod8=3$.

### `math-06-02` — Orthogonality of sinusoids  · AUTHOR derivation

**Connections (§1).**
> Orthogonality extends the familiar idea of perpendicular vectors to functions. Instead of taking a finite dot product, the overlap of two waves is measured by integrating their product over a full period. This lesson depends on periodic functions and trigonometric identities, and it prepares the coefficient formulas for Fourier series. The main payoff is that different frequencies can be separated cleanly.

**Motivation & Intuition (§2).**
> Orthogonality says two waves have zero net overlap over a full common period. When one wave is multiplied by a different-frequency wave, the product has positive regions and negative regions. Over a complete interval, those regions balance out, so the integral is zero.
>
> This cancellation is what lets Fourier methods behave like coordinate geometry. A signal may contain many waves at once, but projecting onto one sinusoid isolates only the matching frequency. The same idea later appears in DFT matrices, communication carriers, feature decorrelation, and spectral layers.

**Definition & Assumptions (§3).** For positive integers $m\ne n$:
1. Define $\langle f,g\rangle=\int_{-\pi}^{\pi}f(t)g(t)\,dt$ because functions are treated like vectors over a period.
2. Use $\sin(mt)\sin(nt)=\tfrac12[\cos((m-n)t)-\cos((m+n)t)]$ to turn the product into integrable waves.
3. Integrate: $\int_{-\pi}^{\pi}\cos(kt)\,dt=\sin(kt)/k|_{-\pi}^{\pi}$ for nonzero integer $k$.
4. Evaluate endpoints: $\sin(k\pi)=\sin(-k\pi)=0$, so each nonzero integer cosine integral is $0$.
5. Since $m-n\ne0$ and $m+n\ne0$, both terms vanish.
6. Therefore $\int_{-\pi}^{\pi}\sin(mt)\sin(nt)\,dt=0$.
7. For $m=n$, use $\sin^2(nt)=\tfrac12(1-\cos(2nt))$ to get norm squared $\pi$.

**Symbols.** $m,n$ integer frequencies; $\langle f,g\rangle$ integral inner product; $\pi$ is the squared norm of each nonzero sine/cosine on this interval.

**Real-World Applications (§5).**
1. **Coefficient extraction.** If $f=7\cos3t+2\sin t$, then $\pi^{-1}\int f\cos3t=7$.
2. **Audio carriers.** $1000$ Hz and $2000$ Hz over $0.01$ s complete $10$ and $20$ cycles, so ideal overlap is $0$.
3. **Projection.** An inner product $4\pi$ on a basis with norm squared $\pi$ gives coefficient $4$.
4. **DCT block.** All-ones data dotted with an alternating row summing to $0$ gives coefficient $0$.
5. **Communications.** $\int_0^1\sin(2\pi3t)\sin(2\pi5t)dt=0$.
6. **Feature decorrelation.** Vectors with dot $0$ and norms $2,3$ have cosine similarity $0/(2\cdot3)=0$.

### `math-06-03` — Fourier series  · AUTHOR derivation

**Connections (§1).**
> Fourier series combine periodicity with orthogonality. A repeating signal is treated like a vector, and the sine and cosine waves provide the coordinate directions. The reader has already seen that different sinusoid frequencies do not overlap over a full period. This lesson uses that fact to compute the actual coordinates of a periodic function.

**Motivation & Intuition (§2).**
> A Fourier series writes a periodic shape as an average level plus sine and cosine coordinates. The average level records the baseline, while the cosine and sine terms record how much of each harmonic appears. Low harmonics describe broad variation, and higher harmonics describe faster detail.
>
> Orthogonality makes the coordinates measurable one at a time. Multiplying the whole signal by a chosen cosine and integrating cancels all nonmatching sine and cosine terms. Only the matching cosine term remains, so division by its norm gives the coefficient.

**Definition & Assumptions (§3).** Coefficient formula for $a_k$:
1. Start with $f(t)\sim a_0/2+\sum_{n\ge1}(a_n\cos nt+b_n\sin nt)$ because this is the real series form.
2. Multiply both sides by $\cos(kt)$ because projection onto the $k$th cosine should isolate $a_k$.
3. Integrate over $[-\pi,\pi]$ to use the sinusoid inner product.
4. The constant term integrates to $0$ against $\cos(kt)$ because nonzero cosine has zero full-period average.
5. Every $\sin(nt)\cos(kt)$ term integrates to $0$ by sine-cosine orthogonality.
6. Every $a_n\cos(nt)\cos(kt)$ term with $n\ne k$ integrates to $0$.
7. The $n=k$ term gives $a_k\int_{-\pi}^{\pi}\cos^2(kt)dt=a_k\pi$.
8. Divide by $\pi$ to get $a_k=\pi^{-1}\int_{-\pi}^{\pi}f(t)\cos(kt)dt$.
9. Repeat with $\sin(kt)$ to get $b_k=\pi^{-1}\int f(t)\sin(kt)dt$; use $1$ to get $a_0=\pi^{-1}\int f$.

**Symbols.** $a_0/2$ average level; $a_n$ cosine coefficient; $b_n$ sine coefficient; $n,k$ harmonic numbers.

**Real-World Applications (§5).**
1. **Audio timbre.** $\sin(2\pi440t)+0.5\sin(2\pi880t)$ has harmonics $440$ and $880$ Hz.
2. **Square wave.** $4/\pi\approx1.273$ and $4/(3\pi)\approx0.424$ for first and third sine terms.
3. **Seasonal model.** $20+8\cos(2\pi d/365)$ predicts $28$ at $d=0$ and $12$ half a year later.
4. **Compression.** Coefficients $80$ and $5$ give retained energy $80^2/(80^2+5^2)\approx0.996$.
5. **Vibration.** $4\cos30t+1\cos90t$ has third-harmonic amplitude ratio $1/4=0.25$.
6. **Fourier feature.** $x=0.25$ gives $[\sin2\pi x,\cos2\pi x]=[1,0]$.

### `math-06-04` — Convergence of Fourier series  · explain-only

**Connections (§1).**
> Fourier coefficients can be computed by projection, but an infinite series also needs a rule for what value it represents. This lesson follows Fourier series and asks how the sum behaves when more and more harmonics are included. Smooth points and jump points have different limiting behavior. The result is important for signal reconstruction, compression, and boundary artifacts.

**Motivation & Intuition (§2).**
> Fourier coefficients can be computed for many piecewise-smooth periodic signals, but the infinite sum still needs an interpretation. At a point where the signal is continuous, the partial sums settle toward the signal value. The nearby oscillations balance around the correct height.
>
> At a jump, the left and right sides ask the series to approach two different values at the same point. The symmetric Fourier partial sums split the difference and converge to the midpoint of the two one-sided limits. This does not remove ringing near the jump, but it gives the correct value of the limiting series at the discontinuity itself.

**Definition & Assumptions (§3).** Explain-only: a full proof of Dirichlet convergence uses kernels and bounded variation, which is outside this lesson's scope. Author the midpoint rule conceptually from symmetry of partial sums near a jump, and explicitly state the theorem's hypotheses.

**Symbols.** $f(t^-),f(t^+)$ one-sided limits; $S(t)$ Fourier-series sum; piecewise smooth means finitely many well-behaved pieces.

**Real-World Applications (§5).**
1. **Jump.** from $-1$ to $3$ gives midpoint $1$.
2. **Continuous point.** with $f(1)=4$ converges to $4$.
3. **Square wave.** jumps from $-1$ to $1$ at $0$, so value is $0$.
4. **Gibbs overshoot.** from $0$ to about $1.09$ is $9\%$ of a unit jump.
5. **Resolution.** Keeping $50$ harmonics resolves features roughly wider than $2\pi/50\approx0.126$ radians.
6. **Label jump.** $0$ to $1$ has Fourier boundary value $0.5$.

### `math-06-05` — Complex Fourier coefficients  · AUTHOR derivation

**Connections (§1).**
> Complex Fourier coefficients repackage the sine and cosine series into a more compact basis. The reader already knows real Fourier coefficients and the complex exponential identity behind rotating waves. This lesson shows how one coefficient per integer frequency can carry both amplitude and phase. That form is the natural language for the Fourier transform, DFT, and spectral multiplication.

**Motivation & Intuition (§2).**
> Complex exponentials package sine and cosine as one rotating coordinate per integer frequency. A positive frequency rotates one direction, and a negative frequency rotates the opposite direction. For real signals, those paired rotations combine to make real sine and cosine motion.
>
> The coefficient $c_k$ is found by the same projection idea as before. Multiplying by $e^{-ikt}$ cancels the $k$th rotation and leaves a constant term, while all other rotations complete full turns and integrate to zero. This keeps the derivation short and makes phase bookkeeping cleaner than separate sine and cosine coefficients.

**Definition & Assumptions (§3).**
1. Write $f(t)\sim\sum_{n=-\infty}^{\infty}c_ne^{int}$ because complex waves form the basis.
2. Multiply by $e^{-ikt}$ to project onto frequency $k$.
3. Integrate: $\int f(t)e^{-ikt}dt\sim\sum_n c_n\int e^{i(n-k)t}dt$.
4. For $n\ne k$, $\int_{-\pi}^{\pi}e^{i(n-k)t}dt=0$ because roots complete full turns.
5. For $n=k$, the integrand is $1$, so the integral is $2\pi$.
6. The right side becomes $2\pi c_k$.
7. Divide by $2\pi$ to get $c_k=(2\pi)^{-1}\int_{-\pi}^{\pi}f(t)e^{-ikt}dt$.

**Symbols.** $c_k$ complex coefficient; $k,n$ integer frequencies; $e^{int}$ rotating basis wave; overline means complex conjugate.

**Real-World Applications (§5).**
1. **Cosine coefficient.** $3\cos t$ has $c_1=c_{-1}=1.5$.
2. **Sine coefficient.** $2\sin t$ has $c_1=-i,c_{-1}=i$.
3. **Real-to-complex conversion.** $a_2=6,b_2=-4$ gives $c_2=(6+4i)/2=3+2i$.
4. **Paired amplitude.** If $c_5=3e^{i\pi/6}$, paired real amplitude is $6$.
5. **Real data symmetry.** For real data, $c_7=1-2i$ implies $c_{-7}=1+2i$.
6. **Frequency-domain multiplication.** $(3+4i)(1-i)=7+i$ for one frequency-domain multiplication.

### `math-06-06` — The Fourier transform  · model entry

**Connections (§1).**
> Fourier series showed that a periodic signal can be described by sine, cosine, or complex exponential coordinates. That idea is already useful for repeating sound, seasons, and waves, but many important signals do not repeat. A pulse, a word, a sensor spike, an image row, and a probability density are better treated as signals on a line rather than as one cycle of a repeating pattern.
>
> The Fourier transform keeps the same coordinate idea and removes the fixed period. Instead of asking for the amount of frequency $n$ in one repeating interval, it asks for the amount of every real angular frequency $\omega$. This lesson is the bridge to transform properties, convolution, filtering, sampling, the DFT, FFT, and the spectral view of CNNs.

**Motivation & Intuition (§2).**
> A nonperiodic signal can still contain slow and fast variation. A wide smooth pulse mostly overlaps slow oscillations. A narrow click overlaps many fast oscillations. The Fourier transform measures that overlap by multiplying the signal by a complex wave $e^{-i\omega t}$ and integrating over all time.
>
> The result $\hat f(\omega)$ is usually complex. Its magnitude tells how strongly frequency $\omega$ is present, and its phase tells how that frequency is aligned. At $\omega=0$, the complex wave is just $1$, so the transform records total area. At larger $|\omega|$, the oscillation alternates positive and negative more quickly, so only matching rapid structure survives the integral.
>
> This is why the transform is central for machine learning systems that handle audio, images, sensors, and learned operators. It turns local variation in time or space into a frequency description where smoothness, edges, blur, aliasing, and convolution become easier to reason about.

**Definition & Assumptions (§3).** Display
$$
\hat f(\omega)=\int_{-\infty}^{\infty} f(t)e^{-i\omega t}\,dt,\qquad
f(t)=\frac1{2\pi}\int_{-\infty}^{\infty}\hat f(\omega)e^{i\omega t}\,d\omega .
$$
For $f(t)=e^{-at}$ on $t\ge0$ and $0$ for $t<0$, with $a>0$, author the complete derivation:
1. $\hat f(\omega)=\int_0^\infty e^{-at}e^{-i\omega t}\,dt$ because the signal is zero for $t<0$.
2. $\hat f(\omega)=\int_0^\infty e^{-(a+i\omega)t}\,dt$ because multiplying exponentials adds exponents.
3. An antiderivative is $-e^{-(a+i\omega)t}/(a+i\omega)$ because differentiating it returns the integrand.
4. The upper-limit term is $0$ because $a>0$ gives real exponential decay.
5. The lower-limit term is $-1/(a+i\omega)$ because $e^0=1$.
6. Subtract endpoints: $0-[-1/(a+i\omega)]=1/(a+i\omega)$.
7. Check $\omega=0$: $\hat f(0)=1/a$, matching the area under $e^{-at}$ on $[0,\infty)$.

**Symbols.** $t$ is the original time or spatial variable; $\omega$ is angular frequency in radians per unit; $i^2=-1$; $\hat f$ is the frequency-domain function; $a$ is a positive decay rate; $1/(2\pi)$ is the inverse constant for this convention.

**Real-World Applications (§5).**
1. **Audio spectrum.** A $0.01$ s analysis window has rough frequency spacing $1/0.01=100$ Hz.
2. **Image stripes.** A stripe repeating every $8$ pixels has spatial frequency $1/8=0.125$ cycles/pixel.
3. **One-sided exponential.** For $e^{-3t}1_{t\ge0}$, $|\hat f(4)|=|1/(3+4i)|=1/5=0.2$.
4. **Box pulse.** For $1_{|t|\le1}$, $\hat f(\omega)=2\sin\omega/\omega$; at $\omega=\pi/2$ this is $4/\pi\approx1.273$.
5. **MRI grids.** A $256\times256$ scan has $65{,}536$ spatial pixels and the same count of full frequency samples.
6. **ML spectral bias.** Amplitudes $10$ at frequency $1$ and $0.5$ at frequency $20$ have energy ratio $10^2/0.5^2=400$.

### `math-06-07` — Properties of the Fourier transform  · deepen

**Connections (§1).**
> After the Fourier transform is defined, the next step is to learn how it responds to common changes in a signal. The reader already knows shifts, scaling, derivatives, and multiplication by oscillations in the time domain. This lesson translates those actions into frequency-domain rules. These rules are used constantly in filtering, PDEs, image registration, modulation, and neural signal pipelines.

**Motivation & Intuition (§2).**
> Transform properties say how ordinary actions in time change the spectrum. A time shift does not change which frequencies are present, but it changes their phases because each wave has been delayed. Scaling the time axis stretches or compresses the frequency axis in the opposite direction.
>
> Derivatives and modulation have equally concrete meanings. Differentiation emphasizes rapid oscillation because high-frequency waves change faster. Multiplying by a carrier wave moves the spectrum to a new center frequency. These identities let one reason about signal operations without recomputing the transform from scratch.

**Definition & Assumptions (§3).** Include four short derivations:
1. Linearity: insert $af+bg$ into the integral, distribute multiplication, split the integral, and obtain $a\hat f+b\hat g$.
2. Shift: for $g(t)=f(t-t_0)$, substitute $u=t-t_0$; then $e^{-i\omega t}=e^{-i\omega u}e^{-i\omega t_0}$, giving $\hat g=e^{-i\omega t_0}\hat f$.
3. Scaling: for $g(t)=f(at)$, set $u=at$ and $dt=du/a$; orientation gives the absolute factor $1/|a|$, so $\hat g(\omega)=|a|^{-1}\hat f(\omega/a)$.
4. Derivative: integrate $\int f'(t)e^{-i\omega t}dt$ by parts; the boundary term vanishes under decay, leaving $i\omega\hat f(\omega)$.

**Symbols.** $a,b$ scalar weights; $t_0$ delay; $a$ in $f(at)$ scale factor; $\omega$ angular frequency; boundary term means endpoint contribution.

**Real-World Applications (§5).**
1. **Edge derivative.** at $\omega=10$ derivative gain is $10$, at $\omega=1$ gain is $1$.
2. **Audio delay.** $5$ ms at $200$ Hz gives phase $-2\pi(200)(0.005)=-2\pi$.
3. **Time stretch.** $g(t)=f(t/2)$ gives $\hat g(\omega)=2\hat f(2\omega)$.
4. **Radio carrier.** multiplying by $e^{i1000t}$ shifts $\hat f(\omega)$ to $\hat f(\omega-1000)$.
5. **PDE.** A second derivative multiplier at $\omega=3$ is $-9$.
6. **Shifted image.** Shifting an image by $4$ pixels changes DFT phase by $-2\pi k4/N$ and preserves $|C_k|$.

### `math-06-08` — The convolution theorem  · AUTHOR derivation

**Connections (§1).**
> Convolution is one of the main operations that Fourier analysis makes simpler. The reader has already seen the Fourier transform and its basic properties. This lesson connects a sliding operation in time or space with multiplication in frequency. The theorem explains why filters, blur kernels, reverb, probability sums, and CNN kernels all have spectral descriptions.

**Motivation & Intuition (§2).**
> Convolution is a sliding weighted sum in time or space. One function supplies the weights, and the other supplies the signal being shifted under those weights. In direct form, this can be computationally and conceptually heavy because every output location depends on a neighborhood or even the whole input.
>
> The Fourier transform turns that sliding operation into ordinary multiplication frequency by frequency. Each complex wave is an eigenfunction of convolution: filtering a pure frequency only changes its amplitude and phase. This is why frequency responses are enough to describe linear time-invariant filters.

**Definition & Assumptions (§3).**
1. Start with $(f*g)(t)=\int f(\tau)g(t-\tau)d\tau$ because convolution sums shifted copies.
2. Transform it: $\widehat{f*g}(\omega)=\int[\int f(\tau)g(t-\tau)d\tau]e^{-i\omega t}dt$.
3. Swap integrals because the functions are integrable enough.
4. Factor $f(\tau)$ outside the inner $t$ integral.
5. Substitute $u=t-\tau$, so $t=u+\tau$ and $dt=du$.
6. The exponential becomes $e^{-i\omega(u+\tau)}=e^{-i\omega u}e^{-i\omega\tau}$.
7. The inner integral becomes $\int g(u)e^{-i\omega u}du=\hat g(\omega)$.
8. The remaining outer integral is $\hat g(\omega)\int f(\tau)e^{-i\omega\tau}d\tau=\hat f(\omega)\hat g(\omega)$.

**Symbols.** $*$ convolution; $\tau$ sliding variable; $u$ shifted variable; $\hat f,\hat g$ frequency responses.

**Real-World Applications (§5).**
1. **Blur.** $[30,60,90]$ averaged by $[1/3,1/3,1/3]$ gives $60$.
2. **CNN edge.** kernel $[-1,0,1]$ on $[2,5,9]$ gives $7$.
3. **Polynomial product.** $[1,2]*[3,4]=[3,10,8]$.
4. **Dice sum.** $6$ ways out of $36$ sum to $7$, probability $1/6$.
5. **Reverb.** impulse response $[1,0.5]$ and pulse $[2]$ give $[2,1]$.
6. **Low-pass.** gains $H(2)=0.9,H(20)=0.1$ turn amplitudes $10,4$ into $9,0.4$.

### `math-06-09` — The Dirac delta  · deepen

**Connections (§1).**
> The Dirac delta enters Fourier analysis as the ideal version of a point impulse. The reader already knows ordinary functions and integrals, but the delta is better understood by how it acts inside an integral. This lesson prepares the language for sampling, impulse responses, distributions, and point sources. It also clarifies why idealized spikes can be useful without being ordinary finite-valued functions.

**Motivation & Intuition (§2).**
> The Dirac delta is an ideal unit impulse. It concentrates one unit of total mass at a single point, so it cannot be treated as an ordinary function with a normal pointwise height. Its defining behavior is that it samples another function inside an integral.
>
> A narrow rectangle with area $1$ gives the right intuition. As the rectangle gets narrower, its height grows so that the area stays fixed. Integrating a continuous function against that rectangle gives a local average, and in the limit that average becomes the function value at the center.

**Definition & Assumptions (§3).** Pulse limit for sifting:
1. Define $p_\varepsilon(t-a)=1/\varepsilon$ on $[a-\varepsilon/2,a+\varepsilon/2]$ and $0$ elsewhere so area is $1$.
2. Compute $\int f(t)p_\varepsilon(t-a)dt=(1/\varepsilon)\int_{a-\varepsilon/2}^{a+\varepsilon/2}f(t)dt$.
3. Recognize this as the average value of $f$ over a small interval around $a$.
4. If $f$ is continuous at $a$, the average tends to $f(a)$ as $\varepsilon\to0$.
5. The limiting object is written $\delta(t-a)$, so $\int f(t)\delta(t-a)dt=f(a)$.

**Symbols.** $\delta(t-a)$ impulse at $a$; $\varepsilon$ pulse width; $f$ test function; unit mass means integral $1$.

**Real-World Applications (§5).**
1. **Sampling.** $\int f(t)\delta(t-0.01)dt=f(0.01)$.
2. **Polynomial sample.** $\int(t^2+3t)\delta(t-2)dt=10$.
3. **Point mass.** $\int x\delta(x-5)dx=5$.
4. **Source strength.** $\int2\delta(x-3)dx=2$.
5. **Scaling.** $\delta(3t)=\delta(t)/3$.
6. **Convolution identity.** $[2]$ convolved with impulses $[1,0.5]$ gives impulse weights $[2,1]$.

### `math-06-10` — Distributions  · deepen

**Connections (§1).**
> Distributions extend the delta idea into a broader calculus of generalized functions. The reader has just seen that an impulse is best described by its action under an integral. This lesson uses that same action-based viewpoint for derivatives and jumps. It supports weak derivatives, PDE source terms, and signal models with discontinuities.

**Motivation & Intuition (§2).**
> Distributions extend functions by defining how an object acts on smooth test functions. Instead of asking for a value at each point, a distribution is understood through the number it returns when paired with a test function. Ordinary functions still fit this framework by integration, but impulses and jump derivatives fit too.
>
> The derivative rule comes from integration by parts. Rather than differentiating a rough object directly, the derivative is moved onto the smooth test function with a minus sign. For the Heaviside step, all variation is concentrated at the jump, so its distributional derivative is the Dirac delta.

**Definition & Assumptions (§3).** $H'=\delta$ in the distributional sense:
1. Define derivative action by $\langle T',\varphi\rangle=-\langle T,\varphi'\rangle$ because integration by parts moves derivatives to the test function.
2. For the Heaviside step $H$, write $\langle H',\varphi\rangle=-\int_0^\infty\varphi'(t)dt$ because $H=1$ on positive $t$ and $0$ on negative $t$.
3. Integrate: $-\int_0^\infty\varphi'(t)dt=-[\varphi(\infty)-\varphi(0)]$.
4. Use compact support: $\varphi(\infty)=0$.
5. Simplify to $\varphi(0)$.
6. Since $\langle\delta,\varphi\rangle=\varphi(0)$, conclude $H'=\delta$.

**Symbols.** $T$ distribution; $\varphi$ smooth test function; $\langle T,\varphi\rangle$ action; $H$ step function.

**Real-World Applications (§5).**
1. **Ordinary function action.** $f=2$ on $[0,1]$, $\varphi=t+1$ gives $\int_0^1 2(t+1)dt=3$.
2. **Delta action.** $\langle\delta_2,t^2-1\rangle=3$.
3. **Step derivative.** A jump of height $5$ gives $5\delta(t)$.
4. **Weak derivative.** The weak derivative of a clipped signal has impulses at kink jumps in slope.
5. **Point source.** $7\delta_{x_0}$ returns $7\varphi(x_0)$.
6. **Constant distribution derivative.** A constant distribution derivative gives $0$ because $-\int c\varphi'=0$.

### `math-06-11` — The uncertainty principle  · deepen

**Connections (§1).**
> The uncertainty principle describes a limit built into the Fourier transform itself. The reader already knows that the transform compares a signal with many oscillations. This lesson explains why concentration in time and concentration in frequency cannot both be made arbitrarily small. The idea matters for audio windows, radar pulses, spectrograms, and learned time-frequency features.

**Motivation & Intuition (§2).**
> A signal cannot be arbitrarily sharp in time and frequency at the same time. A very short pulse must be built from many oscillatory components, so it occupies a broad frequency band. A very pure tone uses a narrow frequency band, but it must persist long enough to reveal that purity.
>
> The formal statement measures spread rather than exact support. The time spread $\Delta t$ and angular-frequency spread $\Delta\omega$ are energy-weighted standard deviations. The Fourier derivative relation and Cauchy-Schwarz inequality combine to force their product to be at least $1/2$ under this convention.

**Definition & Assumptions (§3).** Author the standard inequality sketch:
1. Center the signal so its time and frequency means are $0$; this avoids extra notation without changing spreads.
2. Define $\Delta t^2=\|tf\|_2^2/\|f\|_2^2$ and $\Delta\omega^2=\|\omega\hat f\|_2^2/\|\hat f\|_2^2$.
3. Use the derivative property to connect $\omega\hat f$ with $f'$ under the chosen Fourier convention.
4. Apply Cauchy-Schwarz to $tf$ and $f'$: $\|tf\|_2\|f'\|_2\ge |\langle tf,f'\rangle|$.
5. Integrate by parts to get the needed lower bound proportional to $\|f\|_2^2/2$.
6. Translate back through the Fourier derivative relation to obtain $\Delta t\Delta\omega\ge1/2$.
7. Note that Gaussians achieve equality.

**Symbols.** $\Delta t$ time spread; $\Delta\omega$ angular-frequency spread; $\|\cdot\|_2$ energy norm; centers are energy-weighted means.

**Real-World Applications (§5).**
1. **Time spread.** $\Delta t=0.04$ s gives $\Delta\omega\ge12.5$ rad/s and $\Delta f\ge1.99$ Hz.
2. **Longer window.** $0.10$ s gives $5$ rad/s and $0.796$ Hz.
3. **Frequency spread.** $\Delta\omega=40$ rad/s gives $\Delta t\ge0.0125$ s.
4. **Impossible pair.** $5$ ms with $10$ Hz gives product $0.314<0.5$, impossible under the bound.
5. **Audio frame.** A $25$ ms audio frame has best-case $\Delta f\ge3.18$ Hz.
6. **Radar pulse.** A $1$ ms radar pulse has $\Delta f\ge79.6$ Hz.

### `math-06-12` — Sampling and the Nyquist-Shannon theorem  · AUTHOR derivation

**Connections (§1).**
> Sampling connects continuous signals to the finite data arrays used in computation. The reader already knows Fourier spectra and the Dirac impulse. This lesson explains how a grid of samples appears in frequency as repeated spectral copies. It is the foundation for digital audio, video, sensors, image resolution, and aliasing control in ML pipelines.

**Motivation & Intuition (§2).**
> Sampling replaces a continuous signal by values on a grid. In the frequency domain, that regular grid does not simply preserve one spectrum; it creates repeated copies spaced by the sampling rate. If the original signal is band-limited, those copies have finite width.
>
> The Nyquist-Shannon condition says the copies must stay separated. If the sampling rate is faster than twice the highest frequency, an ideal low-pass filter can recover the central copy. If the copies overlap, high frequencies fold into lower ones, producing aliases that cannot be separated after sampling.

**Definition & Assumptions (§3).**
1. Sampling every $T_s=1/f_s$ seconds multiplies $x(t)$ by an impulse train $\sum_n\delta(t-nT_s)$.
2. Multiplication in time corresponds to convolution in frequency, so the spectrum is copied at multiples of $f_s$.
3. If $X(f)=0$ for $|f|>B$, the central copy occupies $[-B,B]$.
4. Neighboring copies are centered at $\pm f_s$, so no overlap requires $B < f_s-B$.
5. Rearrange to $f_s>2B$.
6. When copies do not overlap, an ideal low-pass filter selects the central copy.
7. The inverse transform gives sinc interpolation $x(t)=\sum_nx[n]\operatorname{sinc}(f_st-n)$.

**Symbols.** $B$ band limit in Hz; $f_s$ sampling rate; $T_s$ sample spacing; Nyquist frequency $f_s/2$; aliasing means overlapping spectral copies.

**Real-World Applications (§5).**
1. **Band limit.** $B=120$ Hz requires $f_s>240$ Hz; $200$ Hz aliases.
2. **Audio.** $B=20$ kHz requires $>40$ kHz; $44.1$ kHz leaves $4.1$ kHz margin.
3. **Aliasing.** $70$ Hz sampled at $100$ Hz aliases to $30$ Hz.
4. **Video.** $60$ fps video represents temporal frequencies below $30$ Hz.
5. **Sensor cutoff.** Sampling at $256$ Hz with cutoff $90$ Hz leaves Nyquist margin $128-90=38$ Hz.
6. **Pixel spacing.** $0.01$ mm gives sampling $100$ samples/mm and Nyquist $50$ cycles/mm.

### `math-06-13` — The Discrete Fourier Transform (DFT)  · deepen

**Connections (§1).**
> The DFT is the finite-sample version of Fourier analysis. The reader already knows continuous transforms and sampling; now the signal is a list of $N$ numbers. This lesson shows that finite data can be rewritten exactly in finite frequency coordinates. It prepares the FFT and the spectral tools used in digital signal processing and ML feature extraction.

**Motivation & Intuition (§2).**
> The DFT rewrites a finite list of samples as finite frequency coordinates. Each row of the DFT matrix compares the data with a discrete rotating wave. The output coefficient records how strongly the sample vector aligns with that frequency bin.
>
> Roots of unity provide the orthogonality. When two different rows are dotted together, the rotations wrap evenly around the circle and sum to zero. When a row is dotted with itself, all terms align and the sum is $N$, which gives the inverse formula.

**Definition & Assumptions (§3).** Matrix and inverse:
1. Let $w=e^{-2\pi i/N}$ because one step around the $N$th roots of unity is the discrete rotation.
2. Define $X_k=\sum_{n=0}^{N-1}x_nw^{kn}$, so the row $k$ is the $k$th rotating wave.
3. Write this as $X=Fx$ with $F_{k,n}=w^{kn}$.
4. Compute row orthogonality: $\sum_{n=0}^{N-1}w^{(k-m)n}=0$ if $k\ne m$ and $N$ if $k=m$.
5. Therefore $F^*F=NI$.
6. Multiply by $(1/N)F^*$ to invert: $x_n=N^{-1}\sum_kX_ke^{2\pi ikn/N}$.

**Symbols.** $N$ number of samples; $n$ sample index; $k$ frequency-bin index; $F$ DFT matrix; $w$ root of unity; $F^*$ conjugate transpose.

**Real-World Applications (§5).**
1. **`np.fft` check.** $[1,0,-1,0]$ maps to $[0,2,0,2]$.
2. **Constant.** $[1,1,1,1]$ maps to $[4,0,0,0]$.
3. **Alternating.** $[1,-1,1,-1]$ maps to $[0,0,4,0]$.
4. **Bins.** With $N=8,f_s=800$ Hz, bins $0,1,2,4$ are $0,100,200,400$ Hz.
5. **Real signal symmetry.** A real signal with $X_1=3-4i$ has $X_7=3+4i$ and magnitude $5$.
6. **Bin spacing.** For $N=1024,f_s=44100$, bin spacing is $43.1$ Hz.

### `math-06-14` — The Fast Fourier Transform (FFT)  · deepen

**Connections (§1).**
> The FFT is an efficient way to compute the DFT without changing its mathematical output. The reader already knows the DFT formula and the role of roots of unity. This lesson shows how symmetry in those roots reduces repeated work. The result is why Fourier methods are practical for audio, images, polynomial multiplication, and large feature pipelines.

**Motivation & Intuition (§2).**
> The FFT computes the DFT exactly but avoids recomputing symmetric pieces. A length-$N$ transform can be split into the samples with even indices and the samples with odd indices. Each half looks like a length-$N/2$ DFT.
>
> The two half-size transforms are then recombined with twiddle factors in butterfly pairs. Repeating this split through powers of two gives about $\log_2N$ stages, with about $N$ work per stage. This changes the scale from $O(N^2)$ to $O(N\log_2N)$.

**Definition & Assumptions (§3).**
1. Start with $X_k=\sum_{n=0}^{N-1}x_ne^{-2\pi ikn/N}$.
2. Split indices into $n=2m$ and $n=2m+1$ because $N$ is even.
3. The even sum becomes $\sum_{m=0}^{N/2-1}x_{2m}e^{-2\pi ikm/(N/2)}=E_k$.
4. The odd sum becomes $e^{-2\pi ik/N}\sum_mx_{2m+1}e^{-2\pi ikm/(N/2)}=w_N^kO_k$.
5. Thus $X_k=E_k+w_N^kO_k$.
6. Periodicity of the half-size DFT gives $X_{k+N/2}=E_k-w_N^kO_k$.
7. At each stage there are about $N$ butterfly operations and $\log_2N$ stages.
8. Work is $O(N\log_2N)$ instead of $O(N^2)$.

**Symbols.** $E_k,O_k$ DFTs of even and odd subsequences; $w_N=e^{-2\pi i/N}$ twiddle factor; butterfly pair means one add and one subtract after twiddle multiplication.

**Real-World Applications (§5).**
1. **Length 1024.** $N=1024$: direct $1{,}048{,}576$, FFT scale $10{,}240$, ratio $102.4$.
2. **Length 8.** $N=8$: $64$ direct vs $24$ FFT scale.
3. **Length 4096.** $N=4096$: $N\log_2N=49{,}152$ vs $16{,}777{,}216$.
4. **Batch FFTs.** Three $2048$-point FFTs cost $67{,}584$ scale units vs $4{,}194{,}304$, ratio $62.1$.
5. **Polynomial product.** Degree-$1023$ polynomial product needs transform length at least $2048$.
6. **Streaming frames.** $100$ frames/s of $512$-point FFTs cost $100\cdot512\cdot9=460{,}800$ scale units/s.

### `math-06-15` — The Laplace connection ($s=i\omega$)  · deepen

**Connections (§1).**
> The Laplace transform sits next to the Fourier transform as another way to probe signals by exponentials. The reader already knows that Fourier uses pure oscillations $e^{-i\omega t}$. This lesson adds the complex variable $s=\sigma+i\omega$, where the real part introduces damping or growth. The connection is especially useful in systems, control, filters, and differential equations.

**Motivation & Intuition (§2).**
> Fourier probes a signal with pure oscillation. Laplace probes it with oscillation plus exponential damping or growth. The damping factor can make integrals converge for signals that would not have an ordinary Fourier transform on the imaginary axis.
>
> When the real part $\sigma$ is set to zero, the Laplace probe becomes the Fourier probe. In that case, evaluating the Laplace transform at $s=i\omega$ gives the one-sided Fourier transform, provided the integral converges. The region of convergence records where this substitution is allowed.

**Definition & Assumptions (§3).**
1. Write $s=\sigma+i\omega$ because a complex Laplace variable has real and imaginary parts.
2. Expand $e^{-st}=e^{-\sigma t}e^{-i\omega t}$ to separate damping from oscillation.
3. The one-sided Laplace transform is $X(s)=\int_0^\infty x(t)e^{-st}dt$.
4. Set $\sigma=0$, so $s=i\omega$ and the damping factor is $1$.
5. The integral becomes $X(i\omega)=\int_0^\infty x(t)e^{-i\omega t}dt$, the one-sided Fourier transform when it converges.
6. For $x(t)=e^{-2t}$, combine exponents to integrate $\int_0^\infty e^{-(s+2)t}dt=1/(s+2)$.
7. Evaluate on the axis: $X(i\omega)=1/(2+i\omega)$.

**Symbols.** $s$ complex frequency; $\sigma$ damping rate; $\omega$ angular frequency; region of convergence is where the integral decays.

**Real-World Applications (§5).**
1. **Exponential decay.** $e^{-2t}$ gives $X(i\omega)=1/(2+i\omega)$ and $X(0)=0.5$.
2. **Faster decay.** $e^{-3t}$ gives $1/(3+i\omega)$.
3. **System gain.** $H(s)=1/(s+5)$ has gains $0.2$ at $\omega=0$ and $1/\sqrt{50}\approx0.141$ at $\omega=5$.
4. **Growth.** $e^{2t}$ has ROC $\operatorname{Re}s>2$, so no ordinary imaginary-axis Fourier transform.
5. **Poles.** $2/(s^2+3s+2)$ has poles at $-1,-2$.
6. **Magnitude.** At $\omega=4$, $|1/(2+4i)|=1/\sqrt{20}\approx0.224$.

### `math-06-16` — Wavelets  · explain-only

**Connections (§1).**
> Wavelets appear after Fourier analysis as a way to keep some location information. The reader already knows that Fourier modes are global waves extending across the whole signal. This lesson introduces localized waves that can be shifted and scaled. The goal is not a long proof but a clear representation idea used in compression, denoising, image pyramids, and transient detection.

**Motivation & Intuition (§2).**
> Wavelets analyze a signal with small localized waves that can be shifted and scaled. A wavelet coefficient measures how much the signal resembles a particular shifted and scaled copy of the mother wavelet. This keeps track of both where a feature occurs and roughly how wide it is.
>
> The tradeoff is different from Fourier analysis. Fourier modes have precise global frequency but no local position, while wavelets give local time or space information with scale-dependent frequency detail. Small scales capture narrow, high-frequency changes; large scales capture broad, low-frequency structure.

**Definition & Assumptions (§3).** Explain-only: this lesson introduces a representation family rather than proving a single identity. Author the transform definition, then explain how scaling changes width and how translation moves the wavelet.

**Symbols.** $\psi$ mother wavelet; $a$ scale; $b$ shift; $W_f(a,b)$ wavelet coefficient; small $a$ means narrow/high-frequency detail, large $a$ means broad/low-frequency structure.

**Real-World Applications (§5).**
1. **Scaled width.** A wavelet with base width $10$ ms has width $20$ ms at scale $a=2$.
2. **Image pyramid.** In an image pyramid, downsampling by $2$ halves each spatial dimension, so a $256\times256$ map becomes $128\times128$.
3. **Subbands.** Keeping $3$ detail bands per level for $4$ levels gives $12$ detail subbands.
4. **Localized spike.** A localized spike at $b=0.35$ s is captured by coefficients near that shift, not across the whole record.
5. **Scale coverage.** A scale-$4$ wavelet covers four times the samples of scale $1$.
6. **Denoising.** For denoising, threshold $0.2$ zeros coefficients $0.05$ and $0.12$ but keeps $0.8$.

### `math-06-17` — Filtering  · deepen

**Connections (§1).**
> Filtering is the practical language of changing a signal by its content. The reader already knows convolution and the convolution theorem. This lesson names the impulse response in time and the frequency response in the spectrum. It connects mathematical Fourier rules to smoothing, sharpening, anti-aliasing, masks, and learned filters.

**Motivation & Intuition (§2).**
> A filter changes a signal by keeping, reducing, or emphasizing selected structure. In time or space, an LTI filter is convolution with an impulse response or kernel. That kernel describes how shifted copies of the input are weighted and added.
>
> In frequency, the same operation is multiplication by a response. Each frequency bin has a gain, and the output magnitude at that frequency is the input magnitude times the gain. Low-pass filters keep slow variation and reduce rapid variation; high-pass filters do the opposite.

**Definition & Assumptions (§3).**
1. Define an LTI filter output by convolution $y=h*x$ because the impulse response $h$ describes shifted copies added together.
2. Apply the convolution theorem to get $\hat y(\omega)=\hat h(\omega)\hat x(\omega)$.
3. Name $H(\omega)=\hat h(\omega)$ the frequency response.
4. At each frequency, output magnitude is $|Y|=|H||X|$ because magnitudes multiply.
5. Low-pass means $|H|\approx1$ near $0$ and small at high $|\omega|$.
6. High-pass means the opposite: small near $0$ and larger at high frequencies.

**Symbols.** $h$ impulse response or kernel; $x$ input; $y$ output; $H$ frequency response; gain is magnitude multiplier.

**Real-World Applications (§5).**
1. **Moving average.** $[1/2,1/2]$ on $[2,6,10]$ gives $[4,8]$.
2. **Difference filter.** $[1,-1]$ on $[3,7,6,10]$ gives $[-4,1,-4]$.
3. **Frequency bin.** $X_k=5$, $H_k=0.2$ gives $Y_k=1$.
4. **First-order low-pass.** The gain at cutoff $\omega=10$ is $1/\sqrt2\approx0.707$.
5. **DFT mask.** DFT magnitudes $[20,8,2,1]$ masked by $[1,1,0,0]$ become $[20,8,0,0]$.
6. **Downsampling.** Downsampling from $1000$ Hz to $250$ Hz requires cutoff below $125$ Hz.

### `math-06-18` — Spectral methods  · AUTHOR derivation

**Connections (§1).**
> Spectral methods use Fourier ideas to solve equations by changing basis. The reader already knows that derivatives become multiplication in the frequency domain. This lesson applies that fact to a differential equation, where each Fourier mode evolves independently. The same pattern appears in PDE solvers, graph diffusion, smoothing, and spectral neural operators.

**Motivation & Intuition (§2).**
> Spectral methods solve a problem in a basis where an operator becomes simple. In the standard coordinate view, a derivative operator acts on the whole function. In a Fourier basis, each mode has a known derivative, so the operator becomes a multiplier on each coefficient.
>
> For the heat equation, this makes the smoothing effect transparent. The second derivative of $e^{ikx}$ gives $-k^2e^{ikx}$, so each mode follows a scalar decay equation. Higher-frequency modes have larger $k^2$, so they decay faster and the solution becomes smoother over time.

**Definition & Assumptions (§3).** Heat-mode evolution:
1. Expand $u(x,t)=\sum_k\hat u_k(t)e^{ikx}$ because Fourier modes form the periodic basis.
2. Differentiate twice: $\partial_{xx}e^{ikx}=-k^2e^{ikx}$.
3. Substitute into $u_t=\alpha u_{xx}$.
4. Match coefficients of each independent mode: $\hat u_k'(t)=-\alpha k^2\hat u_k(t)$.
5. Solve the scalar ODE: $\hat u_k(t)=\hat u_k(0)e^{-\alpha k^2t}$.
6. Interpret higher $k$ as faster decay because $k^2$ is larger.

**Symbols.** $u$ function being solved; $\hat u_k$ spectral coefficient; $k$ mode number; $\alpha$ diffusivity; $e^{ikx}$ Fourier mode.

**Real-World Applications (§5).**
1. **Heat mode.** $\hat u_3(0)=5,\alpha=0.1,t=2$ gives $5e^{-1.8}\approx0.826$.
2. **Second mode.** $\alpha=0.2,k=2,t=1,\hat u_2(0)=3$ gives $3e^{-0.8}\approx1.348$.
3. **Second derivative.** $u=2\sin3x$ has $u''=-18\sin3x$.
4. **Mode truncation.** Keep modes $[10,4,1,0.5]$ through $k=2$ gives $[10,4,1,0]$.
5. **Graph heat.** Graph heat with $\lambda=6$ and factor $e^{-0.05\lambda}$ gives $0.741$.
6. **Poisson solve.** If $-u''=f$ and $\hat f_4=8$, then $\hat u_4=8/16=0.5$.

### `math-06-19` — Convolutions in CNNs & spectral architectures  · ML capstone

**Connections (§1).**
> This capstone connects the section's Fourier tools to modern machine learning architectures. The reader already knows convolution, filtering, the convolution theorem, and spectral methods. CNNs use local learned kernels in the spatial domain, while spectral architectures learn or apply multipliers in a transformed basis. The shared idea is that structured linear operations can be understood as filters.

**Motivation & Intuition (§2).**
> CNN kernels are learned filters. A kernel forms local weighted sums across spatial offsets and input channels, and the same weights are reused across locations. That sharing gives translation equivariance away from boundaries: shifting the input shifts the output in the same way.
>
> Spectral architectures use the same filtering idea after moving to Fourier, graph, or operator eigenbases. Instead of learning a small local kernel and then transforming it implicitly, a spectral layer can learn multipliers $M_k$ for selected modes directly. This makes the connection between CNNs, convolution theorems, and operator learning explicit.

**Definition & Assumptions (§3).** CNN convolution and spectral link:
1. For one channel, define $Y_{i,j}=\sum_{a,b}K_{a,b}X_{i+a,j+b}$ because a kernel forms a local weighted sum.
2. With $C_{in}$ channels, add $\sum_c$ because each output channel reads all input channels.
3. If weights are shared across locations, translating $X$ translates $Y$ away from boundaries; this is translation equivariance.
4. View the linear convolution part as $Y=K*X$.
5. Apply the convolution theorem to get $\widehat Y_k=\widehat K_k\widehat X_k$.
6. Spectral layers learn multipliers $M_k$ directly, using $\widehat Y_k=M_k\widehat X_k$ for retained modes.

**Symbols.** $X$ input feature map; $K$ kernel; $Y$ output map; $a,b$ kernel offsets; $c$ channel index; $M_k$ learned spectral multiplier.

**Real-World Applications (§5).**
1. **Edge patch.** Patch $\begin{bmatrix}1&2&1\\0&3&2\\1&1&0\end{bmatrix}$ with edge kernel $\begin{bmatrix}1&0&-1\\1&0&-1\\1&0&-1\end{bmatrix}$ gives pre-activation $-1$ and ReLU $0$.
2. **Small patch.** $2\times2$ patch $\begin{bmatrix}2&1\\0&3\end{bmatrix}$ with kernel $\begin{bmatrix}1&-1\\0&2\end{bmatrix}$ gives $7$.
3. **Output shape.** $5\times5$ image, $3\times3$ kernel, stride $1$, no padding gives $3\times3=9$ outputs.
4. **Parameter count.** $16$ input channels, $32$ output channels, $3\times3$ kernels give $16\cdot32\cdot9=4608$ weights.
5. **Spectral multiplier.** $0.5$ on $3-2i$ gives $1.5-i$ with magnitude $\sqrt{3.25}\approx1.803$.
6. **Mode retention.** Keeping $16$ Fourier modes out of $128$ keeps $12.5\%$ of one-dimensional modes.

---

## Build order

1. Start with `math-06-06` as the prose model, then author neighboring continuous-transform lessons `06-07`, `06-08`, `06-09`, `06-10`, `06-11`.
2. Author the periodic foundation `06-01`…`06-05`, with orthogonality and Fourier coefficient derivations fully numbered.
3. Author sampling and computation `06-12`…`06-14`; verify DFT/FFT numbers with `np.fft`, `np.convolve`, and powers of two.
4. Author spectral practice `06-15`…`06-18`, promoting all inline key formulas to display.
5. Finish with `06-19` as the ML capstone, linking CNN local convolutions to spectral multipliers.

**Verification note.** Checked representative numbers with Python/numpy: DFTs `[1,0,-1,0]→[0,2,0,2]`, `[1,-1,1,-1]→[0,0,4,0]`; convolution `[1,2]*[3,4]=[3,10,8]`; Nyquist examples; exponential transform magnitudes; FFT counts $N\log_2N$ for $512$, $1024$, $2048$, $4096$; uncertainty conversions; CNN and spectral multiplier arithmetic.
