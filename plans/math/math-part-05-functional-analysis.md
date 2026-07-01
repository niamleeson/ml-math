# Math · Part 05 — Functional analysis  (deep-authored reference)

> **Per-section execution plan.** Load together with the master
> [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) for the four
> exposition principles: warm plain voice, complete step-by-step derivations, case-by-case judgment, and every
> important symbol named. This plan rewrites the scaffold into concrete per-lesson authoring specs. Numeric
> claims were checked with `python3` + `numpy` from the app root on 2026-07-01.

**Section:** Functional analysis · **Lessons:** 21 · **Breadcrumb:** `Mathematics · Analysis & Calculus` · **Priority:** STANDARD (targeted deepening, ML kernel/RKHS spine)

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| §5 boilerplate shared with a sibling lesson | 0 / 21 |
| Templated / thin motivation needing expansion | 7 / 21 |
| Key formula not in display form | 7 / 21 |
| Unclosed-`$` or lost matrix-row LaTeX bug | 0 / 21 |
| Derivation action after deep authoring | 19 derivation lessons · 2 explain-only lessons |

**The core change:** keep the section's existing strength in `math-05-06`, then make every lesson functional-analytic rather than generic linear algebra. Applications must compute with this lesson's own object: norms, inner products, projections, operator bounds, weak probes, spectral weights, kernel values, RKHS norms, and Gram matrices.

---

## Priority & systemic issues

- No whole-section §5 boilerplate was detected. The work is targeted deepening: stronger prose, displayed formulas, complete derivations where there is a real theorem or rule, and six concept-specific applications per lesson.
- The section should form a clear spine: vector spaces → normed/Banach/Hilbert spaces → projections and duality → bounded/compact/spectral operators → RKHS, positive kernels, Mercer, representer theorem.
- The ML through-line is kernel learning. Lessons `05-18`, `05-19`, `05-20`, and `05-21` should feel like the payoff of the earlier geometry, not a separate topic.
- LaTeX bugs found in current dump: none. Do not flag `$e<0$`-style expressions as bugs; only unbalanced `$` or lost matrix row breaks count.

**Verification log.** Recomputed representative values: $\|(3,-4,12)\|_1=19$, $\|(3,-4,12)\|_2=13$, $\|(3,-4,12)\|_\infty=12$; $(1,1/2,1/4,\ldots)$ has squared $\ell^2$ sum $4/3$ and norm $1.1547$; projection of $(3,1)$ onto span$(1,1)$ is $(2,2)$; best constant for $(2,4,7)$ is $13/3$; RKHS example $2k(4,1)-k(4,3)=-3$ for $k(x,z)=1+xz$; KRR capstone gives $\alpha=(3/11,5/11)$ and $f(1)=18/11$.

---

## Model entry (full prose)

### `math-05-06` — Hilbert spaces  — **full-depth model entry (this is the bar)**

**Connections (§1).**
> This lesson joins two ideas that have already been introduced separately. A norm tells us when vectors are
> close and when a sequence of approximations is settling down. An inner product gives geometry: lengths,
> angles, orthogonality, and projections. A Hilbert space is the setting where both structures work together
> and where limits of Cauchy sequences stay inside the space.
>
> This matters because functional analysis often studies vectors that are not short coordinate lists. They may
> be signals, square-integrable functions, infinite coefficient sequences, or kernel sections. Hilbert spaces
> let those objects keep the familiar geometry of Euclidean space while allowing infinitely many coordinates.
> The next lessons on orthonormal bases, projections, best approximation, Riesz representation, and RKHS all
> rely on this combination of geometry and completeness.

**Motivation & Intuition (§2).**
> In ordinary Euclidean space, a vector has a length, two vectors can be perpendicular, and a Cauchy sequence of
> vectors has a limit in the same space. Those facts are so familiar that it is easy to forget how much they
> support: least squares has a closest fitted vector, Fourier coefficients have a squared-energy sum, and an
> optimizer can measure whether updates are getting small.
>
> A Hilbert space keeps exactly that structure in a larger setting. The inner product gives the geometry, and
> the induced norm $\|x\|=\sqrt{\langle x,x\rangle}$ measures convergence. Completeness then says that if
> a sequence of vectors becomes internally consistent under that norm, its limit is still a valid vector in the
> space. That last condition is essential in infinite dimensions, where a sequence of polynomials, signals, or
> basis expansions can approach a limit that is not present unless the space has been completed.
>
> The model example is $\ell^2$, the space of infinite sequences whose squared entries add to a finite number.
> A sequence such as $(1,1/2,1/4,\ldots)$ is a genuine Hilbert-space vector because its squared entries form a
> convergent geometric series. That single example previews the rest of the section: infinite objects can be
> treated geometrically when their energy is finite and their limits remain inside the space.

**Definition & Assumptions (§3).** Display the definition:
$$
H\text{ is Hilbert} \quad\Longleftrightarrow\quad H\text{ is an inner-product space complete under }\|x\|=\sqrt{\langle x,x\rangle}.
$$
Then derive the model membership calculation completely:
1. Write $x=(1,1/2,1/4,1/8,\ldots)$, because $\ell^2$ membership is tested by the squared entries.
2. Square each entry to get $1,1/4,1/16,1/64,\ldots$, because $\|x\|_2^2=\sum_k |x_k|^2$.
3. Recognize the common ratio $r=1/4$, because each squared term is one fourth of the previous one.
4. Use the geometric-series formula $\sum_{k=0}^\infty r^k=1/(1-r)$, because $|r|<1$.
5. Substitute $r=1/4$ to get $\sum_{k=0}^\infty (1/4)^k=1/(1-1/4)$, because this is the exact squared norm.
6. Simplify $1/(1-1/4)=1/(3/4)=4/3$, because subtracting the denominator gives the finite energy.
7. Take the square root $\|x\|_2=\sqrt{4/3}=2/\sqrt3\approx1.1547$, because norm is the square root of squared norm.
8. Conclude $x\in\ell^2$, because the squared sum is finite.

**Symbols.** $H$ is the Hilbert space; $x$ is a vector, function, or sequence in it; $\langle x,y\rangle$ is the inner product; $\|x\|$ is the norm induced by that inner product; $\ell^2$ is the space of square-summable sequences; completeness means every Cauchy sequence in this norm converges to an element of $H$.

**Real-World Applications (§5).**
1. **Finite-energy signals.** Samples $(1,2,2)$ have energy $1^2+2^2+2^2=9$ and Hilbert norm $3$.
2. **Fourier coefficients.** Coefficients $(1,1/2,1/4,\ldots)$ have squared energy $4/3$ and norm $1.1547$.
3. **Kernel feature vectors.** If hidden features have $k(a,a)=4$, $k(b,b)=9$, and $k(a,b)=3$, their Hilbert cosine is $3/(2\cdot3)=0.5$.
4. **Quantum-style unit states.** Amplitudes $(1/\sqrt2,1/\sqrt2)$ have squared norm $1/2+1/2=1$.
5. **Least-squares geometry.** Projecting $(3,4)$ onto the $x$-axis gives $(3,0)$ and residual norm $4$.
6. **Embedding normalization.** Vector $(3,4)$ becomes $(0.6,0.8)$ after division by its Hilbert norm $5$.

---

## Per-lesson change specs

**How to read these specs.** Each block is drafted content guidance in render order. Labels are plan shorthand only. In the app, expand them into flowing prose with the same plain textbook voice as the model entry. Every §5 item below is concept-specific and carries a re-derivable number.

### `math-05-01` — Vector spaces  · deepen

**Connections (§1).**
> This opening lesson supplies the algebraic ground for the whole section. Earlier linear algebra work
> treated vectors as coordinate lists, and that picture is still useful here. Functional analysis
> keeps the same addition and scaling rules while allowing the vectors to be functions, signals,
> distributions of coefficients, or infinite sequences. Once those rules are stable, later lessons can
> talk about norms, limits, operators, and projections without rechecking the basic algebra each time.

**Motivation & Intuition (§2).**
> A vector space is the setting where linear combinations make sense. If two objects are allowed
> models, signals, or states, then adding them and multiplying them by scalars should produce another
> object of the same kind. That closure property is what lets a learner average embeddings, mix
> signals, add polynomial terms, or form residual directions without leaving the space being studied.
>
> In functional analysis this matters more than it first appears, because the objects are often not
> finite coordinate vectors. They may be functions in a hypothesis class or infinite coefficient
> sequences in a basis expansion. The subspace test in this lesson is the local version of the same
> idea: check zero, addition, and scaling, and then the larger machinery of linear analysis can safely
> apply inside the candidate set.

**Definition & Assumptions (§3).**
- **Derive (complete).** Subspace test for $W=\{(x,y):x+y=0\}$: 1. Write $u=(a,-a)$ because every point in $W$ has coordinates summing to $0$. 2. Write $v=(b,-b)$ for a second arbitrary point. 3. Add to get $u+v=(a+b,-a-b)$ because addition is coordinatewise. 4. Sum coordinates: $(a+b)+(-a-b)=0$ because the terms cancel. 5. Scale $u$ by $c$ to get $(ca,-ca)$ because scalar multiplication is coordinatewise. 6. Sum scaled coordinates: $ca-ca=0$ because scaling preserves the defining equation. 7. Check $(0,0)\in W$ because $0+0=0$. 8. Conclude $W$ is a vector space because it contains zero and is closed under addition and scaling inside $\mathbb R^2$.
- **Symbols.** $V$ is a vector space; $u,v$ are vectors; $a,b,c$ are scalars; $W$ is a candidate subspace; closure means the result stays inside the same set.

**Real-World Applications (§5).**
1. Feature vectors: $0.5[2,5]+[1,-1]=[2,1.5]$.
2. Image space: average of $[1,2,3,4]$ and $[4,3,2,1]$ is $[2.5,2.5,2.5,2.5]$.
3. Polynomial models: $(3+2x-x^2)+(1+x^2)=4+2x$.
4. Signal mixtures: $2t+(1-t)=1+t$.
5. Mean embeddings: $([1,3]+[2,5]+[4,1])/3=[7/3,3]$.
6. Constraint subspace: $[1,-1,0]+[2,0,-2]=[3,-1,-2]$ and the coordinates still sum to $0$.

### `math-05-02` — Linear operators  · deepen

**Connections (§1).**
> This lesson builds directly on vector spaces by studying maps that respect their two basic
> operations. A linear operator is the natural way to move from one vector space to another without
> breaking addition or scaling. Matrices are the finite-dimensional model, but the same definition
> also covers derivatives, projections, expectations, shifts, and integral transforms. Later operator
> norms, boundedness, compactness, and spectral decompositions all begin with this linearity rule.

**Motivation & Intuition (§2).**
> Once vectors can be added and scaled, the next question is which transformations preserve that
> structure. A linear operator sends a linear combination of inputs to the same linear combination of
> outputs. That is why knowing the operator on basis vectors is enough in finite dimensions: every
> other input is built from those basis vectors with fixed coefficients.
>
> This simple preservation rule is the reason very different procedures can share one analysis. A
> dense layer, a fixed convolution, and differentiation all distribute over sums and scalars when the
> underlying assumptions are fixed. Functional analysis uses that shared structure to study stability,
> approximation, spectra, and kernels in spaces much larger than ordinary matrix spaces.

**Definition & Assumptions (§3).**
- **Derive (complete).** Basis-determination rule: 1. Start with $x=c_1v_1+\cdots+c_nv_n$ because a basis writes every vector as a unique linear combination. 2. Apply $T$ to get $T(x)=T(c_1v_1+\cdots+c_nv_n)$ because $T$ acts on vectors. 3. Pull out the first scalar: $T(c_1v_1+\cdots)=c_1T(v_1)+T(c_2v_2+\cdots)$ because linearity preserves scaling and sums. 4. Repeat for each term to get $T(x)=c_1T(v_1)+\cdots+c_nT(v_n)$. 5. Conclude $T$ is determined by the images $T(v_i)$ because the coefficients $c_i$ are fixed by $x$.
- **Symbols.** $T:V\to W$ is the operator; $v_i$ are basis vectors; $c_i$ are coordinates; $T(au+bv)=aT(u)+bT(v)$ is linearity.

**Real-World Applications (§5).**
1. Dense layer: $\begin{bmatrix}1&2\\3&4\end{bmatrix}[1,2]^T=[5,11]^T$.
2. Fixed convolution: $[1,0,-1]\cdot[2,5,4]=-2$.
3. Differentiation: $\frac{d}{dx}\left(3x^2+5x\right)=6x+5$.
4. Expectation: $E[3X-Y]=3\cdot2-5=1$.
5. PCA projection: $[3,4]$ onto first coordinate becomes $[3,0]$.
6. Graph swap matrix: $\begin{bmatrix}0&1\\1&0\end{bmatrix}[7,2]^T=[2,7]^T$.

### `math-05-03` — Norms and normed spaces  · AUTHOR derivation

**Connections (§1).**
> Vector spaces provide algebra, and this lesson adds size. A norm tells us how large a vector is and
> therefore how far two vectors are from each other. With that distance in place, statements about
> convergence, approximation error, robustness, and regularization become precise. Banach spaces,
> Hilbert spaces, bounded operators, and weak convergence all depend on having a fixed norm before any
> limiting argument begins.

**Motivation & Intuition (§2).**
> A norm is more than a length formula. It is the rule that turns an algebraic vector space into a
> space where closeness can be measured. Once $\|u-v\|$ is available, the same language can describe
> residual error in regression, perturbation size in robustness, and the magnitude of a function
> difference.
>
> The axioms are exactly the properties needed for this measurement to behave like size. Positivity
> says only the zero vector has zero size, homogeneity says scaling changes size by the absolute scale
> factor, and the triangle inequality says indirect travel is not shorter than the direct
> displacement. The derivation shows that these three rules automatically create a metric, so every
> normed space comes with a usable notion of distance.

**Definition & Assumptions (§3).**
- **Derive (complete).** Norm axioms and metric from a norm: 1. State positivity $\|v\|\ge0$ and $\|v\|=0\iff v=0$ because only the zero vector has no size. 2. State homogeneity $\|av\|=|a|\|v\|$ because scaling a vector scales its length by the absolute scalar. 3. State triangle inequality $\|u+v\|\le\|u\|+\|v\|$ because a direct trip is no longer than going in two legs. 4. Define $d(u,v)=\|u-v\|$ because distance is the size of the displacement. 5. Show $d(u,v)\ge0$ from positivity. 6. Show $d(u,v)=0\iff u=v$ because $u-v=0$. 7. Show symmetry: $d(u,v)=\|u-v\|=\|-(v-u)\|=|{-1}|\|v-u\|=d(v,u)$. 8. Show triangle: $d(u,w)=\|u-w\|=\|(u-v)+(v-w)\|\le\|u-v\|+\|v-w\|$. 9. Conclude a norm creates a metric because all distance rules follow.
- **Symbols.** $\|v\|$ is the norm of $v$; $d(u,v)$ is distance; $a$ is a scalar; $u,v,w$ are vectors.

**Real-World Applications (§5).**
1. Residual norm: $[2,-1,2]$ has $\ell_2$ norm $3$.
2. Weight penalty: $[3,4]$ gives $\|w\|_2^2=25$.
3. Gradient clipping: $[6,8]$ has norm $10$ and clips to norm $5$ as $[3,4]$.
4. $\ell_\infty$ perturbation: $[0.01,-0.02,0.02]$ has size $0.02$.
5. Embedding distance: $[1,2]$ to $[4,6]$ is $5$.
6. Function error: if $|f(t)-g(t)|\le0.03$ for all $t$, then $\|f-g\|_\infty\le0.03$.

### `math-05-04` — Banach spaces and completeness  · explain-only

**Connections (§1).**
> This lesson follows norms by asking whether limits stay inside the space. In finite-dimensional
> Euclidean spaces that usually happens automatically, but functional analysis often works in spaces
> where missing limits are a real issue. Completeness is the condition that prevents a Cauchy
> approximation process from converging to something outside the allowed space. Hilbert spaces later
> add inner products to this same completeness requirement.

**Motivation & Intuition (§2).**
> A Cauchy sequence is a sequence whose late terms become close to each other, even before a candidate
> limit has been named. Completeness says that this internal settling is enough: there is an actual
> point in the space that the sequence approaches. Without completeness, approximations can look
> perfectly stable from within the norm while still having no legal destination in the space.
>
> A Banach space is simply a normed space where that failure has been ruled out. This is why the
> lesson is definition-heavy rather than formula-heavy. The examples distinguish complete and
> incomplete settings: real numbers contain the limits of their Cauchy sequences, while rational
> numbers can have rational approximations that settle toward an irrational limit not present in the
> space.

**Definition & Assumptions (§3).**
- **Derive (complete).** explain-only: this lesson is primarily a definition and distinction. Show examples rather than force a theorem proof: $1/n$ is Cauchy and converges to $0$ in $\mathbb R$; rational decimals approaching $\sqrt2$ are Cauchy in $\mathbb Q$ but have no rational limit.
- **Symbols.** $(x_n)$ is a sequence; $\varepsilon$ is a tolerance; $N$ is the point after which all late terms are close; $\|x_n-x_m\|$ measures pairwise distance; Banach means complete normed space.

**Real-World Applications (§5).**
1. Fixed-point iteration: error $10(0.5)^{10}=0.00977$.
2. Infinite updates: $1/2+1/4+1/8+\cdots=1$.
3. Uniform function limit: $\|f_n-f\|_\infty<0.001$ means every output differs by less than $0.001$.
4. Decimal approximations: $0.7071$ approximates $1/\sqrt2$ in complete $\mathbb R$.
5. Weight sequence: $(1/n,3)\to(0,3)$ remains in $\mathbb R^2$.
6. Value iteration: $5(0.9)^{20}\approx0.608$.

### `math-05-05` — Inner products  · deepen

**Connections (§1).**
> Norms measure size, and inner products add geometry. This lesson explains how alignment, angle,
> orthogonality, energy, and projection all come from one bilinear measurement. The Hilbert-space
> model entry then combines this geometry with completeness. Orthonormal bases, projections, best
> approximation, Riesz representation, and RKHS evaluation all use the inner product as their basic
> measuring device.

**Motivation & Intuition (§2).**
> An inner product records how much two vectors point in the same direction. When the two vectors are
> the same, that self-alignment gives squared length. When the value is zero, the vectors are
> orthogonal, which is the geometry behind residual checks, Fourier coefficients, and least-squares
> normal equations.
>
> The Cauchy-Schwarz inequality is the central safety bound for this geometry. It says that alignment
> cannot exceed the product of the two lengths, so an inner product measurement is controlled by the
> norms of its inputs. The derivation subtracts the best multiple of one vector from another and uses
> nonnegativity of squared length, which is the same projection idea that later becomes a full theorem
> in Hilbert spaces.

**Definition & Assumptions (§3).**
- **Derive (complete).** Cauchy-Schwarz from nonnegative squares: 1. If $y=0$, then $|\langle x,y\rangle|=0$ and the inequality is done. 2. For $y\ne0$, define $a=\langle x,y\rangle/\langle y,y\rangle$ because this is the coefficient of $x$ along $y$. 3. Form $x-ay$ because this subtracts the parallel part. 4. Use positivity: $0\le\langle x-ay,x-ay\rangle$. 5. Expand to get $\|x\|^2-2a\langle x,y\rangle+a^2\|y\|^2$ in the real case. 6. Substitute $a=\langle x,y\rangle/\|y\|^2$ and simplify to $0\le\|x\|^2-\langle x,y\rangle^2/\|y\|^2$. 7. Move the second term to get $\langle x,y\rangle^2\le\|x\|^2\|y\|^2$. 8. Take square roots to get $|\langle x,y\rangle|\le\|x\|\|y\|$.
- **Symbols.** $\langle x,y\rangle$ is the inner product; $\|x\|=\sqrt{\langle x,x\rangle}$; $a$ is a projection coefficient; orthogonal means inner product $0$.

**Real-World Applications (§5).**
1. Cosine similarity: $[1,1]\cdot[2,0]=2$ and norms $\sqrt2,2$ give $0.707$.
2. Least-squares residual: $[1,-1]\cdot[1,1]=0$.
3. Signal energy: $[2,-1,2]$ has $\langle s,s\rangle=9$.
4. Attention score: $[1,2]\cdot[3,1]=5$.
5. Linear kernel: $K([1,2],[3,4])=11$.
6. Fourier coefficient: if unit $e$ has $\langle f,e\rangle=2.5$, the coefficient is $2.5$.

### `math-05-07` — Orthonormal bases  · deepen

**Connections (§1).**
> After Hilbert spaces, this lesson introduces the cleanest coordinate systems available there. An
> orthonormal basis uses unit directions that are mutually perpendicular, so coefficients can be read
> by inner products. This connects the familiar coordinate picture from Euclidean space to Fourier,
> wavelet, PCA, and feature expansions. Projection and best approximation become especially
> transparent once the allowed directions are orthonormal.

**Motivation & Intuition (§2).**
> A general basis can represent vectors, but its coordinates may be hard to compute and its lengths
> may not decompose cleanly. An orthonormal basis removes those complications. Each coordinate is
> obtained by testing against the matching basis vector, and the perpendicularity of the other
> directions makes all cross terms vanish.
>
> Parseval's identity is the energy statement that results. The squared norm of the vector becomes the
> sum of squared coefficients, just as in ordinary right-triangle geometry. In functional analysis
> this is the bridge from infinite objects to manageable coefficient sequences: the geometry of a
> signal or function can be studied through the energy of its orthonormal expansion.

**Definition & Assumptions (§3).**
- **Derive (complete).** Coefficient formula and Parseval in finite dimension: 1. Write $x=\sum_k c_ke_k$ because the orthonormal basis spans the space. 2. Take inner product with $e_j$: $\langle x,e_j\rangle=\langle\sum_k c_ke_k,e_j\rangle$. 3. Move the sum out: $\sum_k c_k\langle e_k,e_j\rangle$ because the inner product is linear. 4. Use orthonormality: $\langle e_k,e_j\rangle=0$ for $k\ne j$ and $1$ for $k=j$. 5. Only one term remains, so $\langle x,e_j\rangle=c_j$. 6. Compute $\|x\|^2=\langle\sum_i c_ie_i,\sum_j c_je_j\rangle$. 7. Cross terms vanish by orthogonality. 8. Get $\|x\|^2=\sum_k c_k^2$.
- **Symbols.** $e_k$ are basis vectors; $c_k$ are coordinates; orthonormal means $\langle e_i,e_j\rangle=\delta_{ij}$; Parseval is the squared-energy identity.

**Real-World Applications (§5).**
1. Fourier features: coefficients $3,4$ on unit waves give norm $5$.
2. PCA coordinates: $(2,-1)$ has squared length $5$.
3. Compression: dropping coefficient $0.1$ loses energy $0.01$.
4. Wavelet transform: $[8,0,0,0]$ has energy $64$.
5. QR: if $Q$ has orthonormal columns and $c=[3,4]$, then $\|Qc\|=5$.
6. Feature analysis: $x=2e_1+0.5e_2$ has coefficient $2$ along $e_1$.

### `math-05-08` — Orthogonal projections  · deepen

**Connections (§1).**
> This lesson uses orthonormal coordinates to formalize the idea of keeping the part of a vector that
> lies in a chosen subspace. Projection is already familiar from shadows and least squares, and
> Hilbert spaces make it an exact geometric operation. The residual left after projection is
> perpendicular to the subspace. That orthogonality is the engine behind best approximation,
> regression normal equations, PCA truncation, and denoising.

**Motivation & Intuition (§2).**
> A projection separates a vector into an allowed component and an error component. The allowed
> component lies in the chosen subspace, while the residual contains everything that the subspace
> cannot express. When the subspace has an orthonormal basis, the projection is built by taking each
> inner-product coefficient and adding the corresponding basis direction.
>
> The important point is not only that the formula produces a vector in the subspace. It also makes
> the residual orthogonal to every direction in that subspace. Because of Pythagoras, any other
> candidate in the subspace adds extra squared distance, so the projection is the closest allowed
> vector.

**Definition & Assumptions (§3).**
- **Derive (complete).** Projection formula and Pythagorean theorem: 1. Let $M$ have orthonormal basis $e_1,\ldots,e_k$ because coefficients are inner products. 2. Define $p=\sum_j\langle x,e_j\rangle e_j$ because this keeps each basis component inside $M$. 3. Test residual against $e_i$: $\langle x-p,e_i\rangle=\langle x,e_i\rangle-\sum_j\langle x,e_j\rangle\langle e_j,e_i\rangle$. 4. Use orthonormality so the sum equals $\langle x,e_i\rangle$. 5. Conclude $\langle x-p,e_i\rangle=0$ for every basis vector, so $x-p\perp M$. 6. For any $m\in M$, write $x-m=(x-p)+(p-m)$. 7. The two terms are orthogonal because $p-m\in M$. 8. Apply Pythagoras: $\|x-m\|^2=\|x-p\|^2+\|p-m\|^2\ge\|x-p\|^2$.
- **Symbols.** $P_Mx=p$ is the projection; $M$ is a closed subspace; $e_j$ are orthonormal directions; $x-p$ is residual error.

**Real-World Applications (§5).**
1. Regression on constants: $[1,2,2]$ projects to $[5/3,5/3,5/3]$.
2. PCA: keeping coefficients $5,2$ and dropping $0.1$ leaves squared error $0.01$.
3. Residual check: $[1,-1]\cdot[1,1]=0$.
4. Denoising: $3e_1+0.2e_2$ projects to $3e_1$ and drops energy $0.04$.
5. Debiasing: $[3,4]$ minus projection onto $[1,0]$ leaves $[0,4]$.
6. Shadow: $(2,3,5)$ projected onto the $xy$-plane is $(2,3,0)$.

### `math-05-09` — Best approximation  · AUTHOR derivation

**Connections (§1).**
> Projection leads naturally to best approximation. Instead of representing a target exactly, this
> lesson studies the closest vector allowed by a model space. In Euclidean regression this is least
> squares; in Hilbert spaces it is the projection theorem in action. Later Riesz, RKHS, and
> representer-theorem arguments use the same split between visible model directions and orthogonal
> residuals.

**Motivation & Intuition (§2).**
> Best approximation starts from a practical limitation: the target vector may not lie in the model
> space. The goal is then to choose the allowed vector with the smallest error norm. In a Hilbert
> space, the decisive condition is geometric rather than mysterious: at the closest point, the
> residual must be orthogonal to every direction in which the model can move.
>
> For a one-parameter model, this condition becomes the familiar least-squares normal equation.
> Expanding the squared error gives a quadratic in the coefficient, and differentiating identifies the
> minimum. Rewriting the result as an orthogonality statement shows the deeper pattern that survives
> beyond one-dimensional regression.

**Definition & Assumptions (§3).**
- **Derive (complete).** Normal equation for one-parameter least squares: 1. Approximate $y$ by $ax$ because the model space is span$(x)$. 2. Minimize $E(a)=\|y-ax\|^2$ because squared distance gives the same minimizer. 3. Expand $E(a)=\langle y-ax,y-ax\rangle$. 4. Distribute to get $\|y\|^2-2a\langle y,x\rangle+a^2\|x\|^2$. 5. Differentiate: $E'(a)=-2\langle y,x\rangle+2a\|x\|^2$. 6. Set $E'(a)=0$ because a quadratic minimum has zero derivative. 7. Solve $a=\langle y,x\rangle/\langle x,x\rangle$. 8. Rewrite as $\langle y-ax,x\rangle=0$ because the residual is orthogonal to the feature direction.
- **Symbols.** $y$ is the target vector; $x$ is a feature direction; $a$ is the fitted coefficient; $m^*$ is the closest point; residual is $y-m^*$.

**Real-World Applications (§5).**
1. Through-origin line: points $(1,2),(2,3)$ give slope $(2\cdot1+3\cdot2)/(1^2+2^2)=8/5=1.6$.
2. PCA compression: dropping coefficient $0.1$ loses squared error $0.01$.
3. Fourier truncation: dropping $0.3,0.4$ gives error norm $0.5$.
4. Best constant: data $2,4,7$ have mean $13/3\approx4.333$.
5. Autoencoder residual: $[0.1,-0.2]$ has squared error $0.05$.
6. Distillation: $[0.7,0.2]-[0.8,0.1]=[-0.1,0.1]$ has norm $\sqrt{0.02}\approx0.141$.

### `math-05-10` — The Riesz representation theorem  · deepen

**Connections (§1).**
> This lesson turns inner products into a language for measurements. A continuous linear functional
> may look like an outside probe of a Hilbert space, but Riesz says it is represented by a vector
> inside the same space. That result links gradients, linear probes, evaluation maps, and dual norms
> to Hilbert geometry. The RKHS lessons later depend on applying this theorem to point evaluation.

**Motivation & Intuition (§2).**
> A linear functional takes a vector and returns one number. In finite-dimensional Euclidean space,
> such a measurement is usually written as a dot product with a coefficient vector. Riesz
> representation says that the same idea holds in every Hilbert space, provided the functional is
> continuous.
>
> The theorem is powerful because it identifies the measurement with its representing vector.
> Uniqueness means there is only one vector that gives all the same readings, and the norm equality
> means the size of the functional is exactly the Hilbert norm of that vector. The derivation here
> focuses on those two structural facts once the representation exists.

**Definition & Assumptions (§3).**
- **Derive (complete).** Uniqueness and norm equality once representation exists: 1. Suppose $F(x)=\langle x,y_1\rangle=\langle x,y_2\rangle$ for all $x$ because two vectors represent the same functional. 2. Subtract to get $\langle x,y_1-y_2\rangle=0$ for all $x$. 3. Choose $x=y_1-y_2$ because the statement holds for every vector. 4. Get $\|y_1-y_2\|^2=0$. 5. Conclude $y_1=y_2$ by positive definiteness. 6. Bound $|F(x)|=|\langle x,y\rangle|\le\|x\|\|y\|$ by Cauchy-Schwarz. 7. For $x=y/\|y\|$ when $y\ne0$, get $|F(x)|=\|y\|$ on a unit vector. 8. Conclude $\|F\|=\|y\|$.
- **Symbols.** $F$ is a bounded linear functional; $y$ is the representing vector; $H$ is the Hilbert space; $\|F\|$ is the dual/operator norm of the measurement.

**Real-World Applications (§5).**
1. Gradient: if $Df(w)[h]=2h_1-3h_2$, then $\nabla f(w)=(2,-3)$.
2. Attention query: $q=[2,-1]$ represents $F(k)=2k_1-k_2$.
3. Weighted integral: $F(f)=\int_0^1 f(t)2t\,dt$ has representing function $2t$ with norm $2/\sqrt3$.
4. RKHS evaluation: if $\|k_x\|=2$, then $|f(x)|\le2\|f\|$.
5. Sensitivity: $F(h)=3h_1+4h_2$ has norm $5$.
6. Linear probe: $w=[1,2,2]$ has norm $3$, so $|w\cdot x|\le3\|x\|$.

### `math-05-11` — Bounded linear operators  · deepen

**Connections (§1).**
> Linear operators preserve vector-space structure, and this lesson adds a global stability condition.
> Boundedness says one constant controls how much the operator can stretch every input. For linear
> maps, that condition is equivalent to continuity, so analytic stability becomes an operator
> inequality. Operator norms, sensitivity bounds, compactness, and spectral normalization all build on
> this idea.

**Motivation & Intuition (§2).**
> A linear map can be algebraically valid while still behaving badly with respect to a norm.
> Boundedness rules out uncontrolled stretching by requiring $\|Tx\|$ to be at most a fixed constant
> times $\|x\|$. That turns input error bounds into output error bounds immediately.
>
> The key linear fact is that comparing two outputs is the same as applying the operator to the
> difference of the inputs. Once $Tx-Ty=T(x-y)$, the single stretch bound gives the epsilon-delta
> continuity proof. This is why bounded linear maps are the stable operators of functional analysis.

**Definition & Assumptions (§3).**
- **Derive (complete).** Bounded implies continuous for linear maps: 1. Assume $\|Tx\|_W\le C\|x\|_V$ for all $x$ because $T$ is bounded. 2. Compare two inputs by subtracting outputs: $Tx-Ty=T(x-y)$ because $T$ is linear. 3. Take norms: $\|Tx-Ty\|_W=\|T(x-y)\|_W$. 4. Apply the bound to $x-y$: $\|T(x-y)\|_W\le C\|x-y\|_V$. 5. Given tolerance $\varepsilon$, choose input closeness $\delta=\varepsilon/C$ when $C>0$. 6. Then $\|x-y\|<\delta$ implies $\|Tx-Ty\|<\varepsilon$. 7. If $C=0$, outputs are identical and continuity is immediate. 8. Conclude bounded linear maps are continuous.
- **Symbols.** $T:V\to W$ is linear; $C$ is a valid stretch bound; $\|T\|$ is the smallest such bound; $V,W$ have possibly different norms.

**Real-World Applications (§5).**
1. Network Lipschitz bound: layer norms $2,1.5,3$ multiply to $9$.
2. Gradient stability: $0.8^{10}\approx0.107$.
3. Moving average: weights $1/3,1/3,1/3$ map constant $[6,6,6]$ to $6$.
4. Robustness: norm $4$ and perturbation $0.01$ give score change at most $0.04$.
5. Conditioning: $\|A\|=20$ and input error $0.001$ give output error at most $0.02$.
6. Spectral normalization: clipping largest singular value from $5$ to $1$ reduces worst stretch by factor $5$.

### `math-05-12` — Operator norms  · deepen

**Connections (§1).**
> Bounded operators have stretch limits, and this lesson measures the best such limit. The operator
> norm records the largest output length produced by a unit input. In finite dimensions this connects
> to singular values, conditioning, layer sensitivity, and spectral normalization. Later duality and
> compact-operator lessons use operator norms to control functionals and infinite-dimensional maps.

**Motivation & Intuition (§2).**
> The operator norm is a worst-case measurement. Instead of checking every possible input size
> separately, we normalize inputs to length one and ask for the largest output length. Linearity makes
> this enough, because any nonzero input is a scale times a unit input.
>
> This viewpoint turns stability into one number. If the norm is small, every perturbation is
> controlled; if it is large, some direction can be stretched strongly. The diagonal example makes the
> idea visible: the direction with scale $3$ dominates the direction with scale $2$, so the Euclidean
> operator norm is the larger stretch.

**Definition & Assumptions (§3).**
- **Derive (complete).** Equivalent norm formulas and diagonal example: 1. Start with $\|A\|=\sup_{x\ne0}\|Ax\|/\|x\|$ because stretch is output length divided by input length. 2. For any nonzero $x$, set $u=x/\|x\|$ because $u$ has norm $1$. 3. Use linearity: $Ax=A(\|x\|u)=\|x\|Au$. 4. Divide to get $\|Ax\|/\|x\|=\|Au\|$. 5. Conclude the supremum over nonzero $x$ equals $\sup_{\|u\|=1}\|Au\|$. 6. For $A=\operatorname{diag}(3,2)$ and $u=(s,t)$ with $s^2+t^2=1$, compute $\|Au\|^2=9s^2+4t^2$. 7. Substitute $t^2=1-s^2$ to get $4+5s^2\le9$. 8. Take square roots and test $u=(1,0)$ to get $\|A\|=3$.
- **Symbols.** $A$ is a linear operator; $x$ is any input; $u$ is a unit input; $\sup$ means least upper bound; domain and codomain norms must be fixed.

**Real-World Applications (§5).**
1. Layer sensitivity: $\|W\|=2.5$, $\|\Delta x\|=0.04$ gives $\|W\Delta x\|\le0.10$.
2. Score robustness: norm $3$ and input change $0.01$ gives at most $0.03$.
3. Smoothness: $\|H\|=8$ suggests step scale $1/8=0.125$.
4. Feature scaling: diagonal scales $10,0.5$ have Euclidean operator norm $10$.
5. Roundoff: $\|A\|=6$ and error $0.0002$ give $0.0012$.
6. Attention projection: $\|W_Q\|=1.2$, $\|x\|=5$ gives $\|q\|\le6$.

### `math-05-13` — Dual spaces  · AUTHOR derivation

**Connections (§1).**
> This lesson studies the space of continuous linear measurements on a normed space. After Riesz,
> Hilbert-space measurements can be represented by vectors, but general normed spaces still need the
> broader dual-space language. Dual norms quantify the size of probes, gradients, constraints, and
> sensitivity certificates. Hahn-Banach and weak convergence both rely on these continuous linear
> observers.

**Motivation & Intuition (§2).**
> A vector can be tested by many linear measurements: a coordinate readout, a gradient direction, a
> constraint differential, or an expectation. The dual space collects the measurements that are
> continuous under the chosen norm. Each functional then has its own norm, defined by the largest
> reading it can produce on the unit ball.
>
> In Euclidean space, this abstract definition reduces to a familiar coefficient-vector calculation.
> The functional $f(x,y)=3x-4y$ is inner product with $(3,-4)$, so Cauchy-Schwarz gives the upper
> bound and alignment attains it. The lesson therefore shows both sides of the dual norm: a universal
> bound and a unit input that reaches the bound.

**Definition & Assumptions (§3).**
- **Derive (complete).** Euclidean dual norm: 1. Let $f(x,y)=3x-4y$ because this is a linear functional. 2. Write $z=(x,y)$ and $a=(3,-4)$ because $f(z)=\langle z,a\rangle$. 3. Apply Cauchy-Schwarz: $|f(z)|\le\|z\|\|a\|$. 4. Restrict to $\|z\|\le1$ to get $|f(z)|\le\|a\|$. 5. Compute $\|a\|=\sqrt{3^2+(-4)^2}=5$. 6. Choose $z=a/5=(3/5,-4/5)$ because it is unit and aligned. 7. Evaluate $f(z)=9/5+16/5=5$. 8. Conclude $\|f\|=5$ because the upper bound is attained.
- **Symbols.** $X^*$ is the dual space; $f:X\to\mathbb R$ is a continuous linear functional; $\|f\|=\sup_{\|x\|\le1}|f(x)|$; $a$ is the representing coefficient vector in Euclidean space.

**Real-World Applications (§5).**
1. Gradient functional: $g=(3,4)$ has $\|df\|=5$, and $df(0.01,0)=0.03$.
2. Probe: $(1,-1,2)\cdot(0.5,0.2,0.1)=0.5$.
3. $\ell_\infty$ perturbation: $0.01\| (2,-3,1)\|_1=0.06$.
4. Constraint differential: $h_1+2h_2$ has Euclidean norm $\sqrt5\approx2.236$.
5. Expectation: if $|X|\le3$, then $|E[X]|\le3$.
6. Classifier score: $(0.2,-0.5)\cdot(10,4)=0$.

### `math-05-14` — The Hahn–Banach theorem  · deepen

**Connections (§1).**
> Dual spaces make linear measurements central, and Hahn-Banach explains why enough of those
> measurements exist. The theorem extends a bounded functional from a subspace to the whole space
> without increasing its norm. This is one of the main tools behind separation, certificates, and
> support hyperplanes in analysis and optimization. The concrete example keeps the theorem grounded in
> a simple Euclidean extension.

**Motivation & Intuition (§2).**
> Often a measurement is first defined only on a smaller subspace where the relevant data live.
> Hahn-Banach says that, under the right boundedness condition, the measurement can be continued to
> the ambient space while preserving its norm. The extension may not be unique, but the theorem
> guarantees that no extra stretch is required.
>
> This matters because global witnesses can be built from local information. A norm-preserving
> functional can certify a vector's norm, separate a point from a convex set, or provide a dual
> certificate for an optimization problem. The derivation uses the $x$-axis in $\mathbb R^2$ to show
> the norm-preserving idea without hiding it inside the general theorem.

**Definition & Assumptions (§3).**
- **Derive (complete).** Concrete norm-preserving extension in $\mathbb R^2$: 1. Let $M=\{(t,0):t\in\mathbb R\}$ and $f(t,0)=2t$ because the measurement is defined on the $x$-axis. 2. For $t\ne0$, compute $|f(t,0)|/\|(t,0)\|=|2t|/|t|$. 3. Simplify the ratio to $2$ because $|t|$ cancels. 4. Conclude $\|f\|=2$ on $M$. 5. Define $F(x,y)=2x$ because it agrees with $f$ when $y=0$. 6. Identify the Euclidean coefficient vector $(2,0)$. 7. Compute $\|F\|=\sqrt{2^2+0^2}=2$. 8. Conclude $F$ is a norm-preserving extension.
- **Symbols.** $M$ is a subspace; $X$ is the larger normed space; $f$ is the original functional; $F$ is the extension; $F|_M=f$ means agreement on $M$.

**Real-World Applications (§5).**
1. Separating disk from point: $F(x,y)=x$ is at most $1$ on the unit disk and equals $3$ at $(3,0)$.
2. SVM margin: projections differing by $2$ give margin $1$ on each side with a unit normal.
3. Dual certificate: if all feasible $x$ satisfy $c\cdot x\le10$ and one reaches $10$, optimum is certified.
4. Norm witness: for $x=(3,4)$, $F(z)=\langle z,x/5\rangle$ has norm $1$ and $F(x)=5$.
5. Dual norm: for $w=(2,-1,0)$, $\|w\|_\infty=2$.
6. Lagrangian gap: multiplier $25$ times gap $0.04$ contributes $1.0$.

### `math-05-15` — Weak convergence  · AUTHOR derivation

**Connections (§1).**
> This lesson weakens the usual idea of convergence by testing vectors through dual measurements. Norm
> convergence requires the vectors themselves to get close in length. Weak convergence only requires
> every continuous linear observer to see convergence. That distinction is essential in
> infinite-dimensional spaces, where bounded sequences may have stable observable behavior without
> converging strongly.

**Motivation & Intuition (§2).**
> Norm convergence is a demanding condition because it measures the full distance between vectors.
> Weak convergence asks for something gentler: fix any continuous linear functional and look only at
> its scalar readings. If all such readings converge to the readings of a limit vector, the sequence
> converges weakly.
>
> The standard basis in $\ell^2$ shows why the distinction matters. Each $e_n$ keeps norm $1$, so it
> never approaches $0$ in norm. But any fixed square-summable observer has coordinates tending to
> zero, so its reading of $e_n$ vanishes; every fixed observer sees convergence to $0$.

**Definition & Assumptions (§3).**
- **Derive (complete).** Standard basis in $\ell^2$: 1. Fix $y=(y_1,y_2,\ldots)\in\ell^2$ because weak convergence tests against one fixed vector at a time. 2. Compute $\langle e_n,y\rangle=y_n$ because only coordinate $n$ survives. 3. Use square summability to get $y_n\to0$, because terms of a convergent series must vanish. 4. Therefore $\langle e_n,y\rangle\to0$ for every fixed $y$. 5. Conclude $e_n\rightharpoonup0$ by the Hilbert-space weak convergence criterion. 6. Compute $\|e_n\|=1$ because each has one unit coordinate. 7. Compute $\|e_n-0\|=1$ for every $n$. 8. Conclude $e_n$ does not converge to $0$ in norm.
- **Symbols.** $x_n\rightharpoonup x$ means weak convergence; $X^*$ is the set of continuous linear tests; $e_n$ is the $n$th standard basis vector; norm convergence means $\|x_n-x\|\to0$.

**Real-World Applications (§5).**
1. Probe stability: readings change by less than $0.001$ after epoch $50$.
2. Distribution-style limits: a sample mean $0.50$ with error $0.01$ stabilizes simple expectations.
3. Embedding drift: coordinate probe $5$ reads $0$ for $e_n$ whenever $n\ne5$, while $\|e_n\|=1$.
4. Sensor inverse problem: $20$ sensor functionals varying by at most $0.005$ means measured predictions are stable.
5. RKHS bound: $\|f_n\|\le3$ and $k(x,x)=4$ imply $|f_n(x)|\le6$.
6. Optimization existence: if $\|x_n\|\le2$, any norm-$5$ functional reads at most $10$ in magnitude.

### `math-05-16` — Compact operators  · explain-only

**Connections (§1).**
> Bounded operators control size, and compact operators add a stronger limiting property. They send
> bounded input sequences to output sequences with norm-convergent subsequences. This makes some
> infinite-dimensional behavior resemble finite-dimensional matrix behavior. Compactness prepares the
> ground for spectral decompositions, kernel operators, smoothing maps, and low-rank approximations.

**Motivation & Intuition (§2).**
> A bounded operator prevents outputs from becoming too large, but boundedness alone does not force
> outputs to settle down. Compactness says that from any bounded input sequence, the output sequence
> contains a convergent subsequence. It is a sequential form of compression: the image of a bounded
> set may be infinite, but it cannot spread out too freely.
>
> This lesson is explain-only because the main work is recognizing the definition and its examples.
> Diagonal damping on $\ell^2$ illustrates compact behavior by making the basis outputs shrink to
> zero. The identity operator shows the contrast: it is bounded, but it preserves the separated
> standard basis, so no convergent subsequence appears.

**Definition & Assumptions (§3).**
- **Derive (complete).** explain-only: compactness is a definition with important examples. Demonstrate rather than over-prove: for $T(x)_n=x_n/n$, $Te_n$ has one nonzero coordinate $1/n$, so $\|Te_n\|=1/n\to0$; for the identity on $\ell^2$, $\|e_n-e_m\|=\sqrt2$, so no subsequence can converge.
- **Symbols.** $T:X\to Y$ is linear; bounded sequence means $\|x_n\|\le C$; compact means some output subsequence $Tx_{n_k}$ converges in norm; finite-rank means the range is finite-dimensional.

**Real-World Applications (§5).**
1. Low-rank compression: rank-$5$ projection keeps $5$ numbers from $1000$.
2. Smoothing: $[1,3,5,7,9]$ has 5-point average center value $5$.
3. Covariance spectrum: eigenvalues $4,1,0.25$ give first-two share $5/5.25=95.2\%$.
4. Diagonal damping: weights $1,1/2,1/4,1/8$ reduce the fourth component to $12.5\%$.
5. Kernel approximation: eigenvalues $0.5,0.2,0.05$ have first-two mass $0.7$.
6. Recommender factors: $64$ factors instead of $1024$ coordinates is a $16$ times reduction.

### `math-05-17` — The spectral theorem for operators  · AUTHOR derivation

**Connections (§1).**
> This lesson brings Hilbert geometry to operators with especially nice symmetry. Self-adjoint
> operators behave like symmetric matrices: eigenvectors from different eigenvalues are orthogonal,
> and the operator can be understood through scalar weights on orthonormal directions. This is the
> operator form behind PCA, Hessian curvature, graph Laplacians, and kernel spectra. Mercer theory
> later applies the same spectral idea to positive kernel operators.

**Motivation & Intuition (§2).**
> A complicated linear operator becomes much easier to understand when there is an orthonormal basis
> of eigenvectors. In that coordinate system, applying the operator only multiplies each coordinate by
> its eigenvalue. Geometry, energy, and curvature then reduce to scalar weights along perpendicular
> directions.
>
> Self-adjointness is the condition that makes this diagonal picture reliable. It forces eigenvectors
> with distinct eigenvalues to be orthogonal, so cross terms vanish in quadratic forms. The derivation
> shows the algebra of that orthogonality and then computes the quadratic form as a sum of
> eigenvalue-weighted squared coefficients.

**Definition & Assumptions (§3).**
- **Derive (complete).** Orthogonality of eigenvectors and quadratic form: 1. Let $Au=\lambda u$ and $Av=\mu v$ because $u,v$ are eigenvectors. 2. Assume $A$ is self-adjoint, so $\langle Au,v\rangle=\langle u,Av\rangle$. 3. Substitute eigen equations to get $\lambda\langle u,v\rangle=\mu\langle u,v\rangle$. 4. Subtract to get $(\lambda-\mu)\langle u,v\rangle=0$. 5. If $\lambda\ne\mu$, conclude $\langle u,v\rangle=0$. 6. In an orthonormal eigenbasis, write $x=\sum_i c_iq_i$. 7. Apply $A$ to get $Ax=\sum_i \lambda_i c_iq_i$. 8. Compute $\langle x,Ax\rangle=\sum_i\lambda_i c_i^2$ because cross terms vanish.
- **Symbols.** $A$ is self-adjoint; $q_i$ are orthonormal eigenvectors; $\lambda_i$ are eigenvalues; $Q\Lambda Q^T$ is the finite-dimensional spectral form.

**Real-World Applications (§5).**
1. PCA: eigenvalues $9,4,1$ give first PC share $9/14=64.3\%$.
2. Hessian curvature: eigenvalues $100$ and $1$ mean one direction is $100$ times steeper.
3. Graph learning: second Laplacian eigenvalue $0.03$ marks a weak cut.
4. Kernel methods: eigenvalues $0.6,0.3,0.1$ have first-two mass $90\%$.
5. Signal filtering: keeping $12$ of $64$ modes keeps $18.75\%$ of coefficients.
6. Linear dynamics: eigenvalue $0.8$ gives $0.8^5\approx0.328$ after $5$ steps.

### `math-05-18` — Reproducing kernel Hilbert spaces (RKHS)  · deepen

**Connections (§1).**
> This lesson starts the kernel-learning spine of the section. A Hilbert space has already supplied
> inner products, Riesz representation, and bounded linear measurements. An RKHS applies those ideas
> to a space whose vectors are functions, with point evaluation as a continuous linear functional.
> Positive-definite kernels, Mercer expansions, and the representer theorem all depend on this
> evaluation-as-inner-product structure.

**Motivation & Intuition (§2).**
> In a general function space, evaluating a function at one point need not be a well-behaved
> operation. An RKHS is built so that evaluation is continuous and linear. By Riesz representation,
> every evaluation map is then represented by a specific Hilbert-space vector, called a kernel
> section.
>
> The reproducing property is the central payoff. Instead of treating $f(x)$ as an external lookup,
> the RKHS writes it as an inner product $\langle f,k_x\rangle_{\mathcal H}$. This turns pointwise
> prediction, kernel similarity, and norm-based control into Hilbert-space geometry.

**Definition & Assumptions (§3).**
- **Derive (complete).** Reproducing property from Riesz: 1. Fix an input $x$ because evaluation at that point is a map on functions. 2. Define $E_x(f)=f(x)$ because this records the value of $f$ at $x$. 3. Assume $E_x$ is continuous and linear, because that is the RKHS condition. 4. Apply Riesz to get a unique $k_x\in\mathcal H$ with $E_x(f)=\langle f,k_x\rangle_{\mathcal H}$. 5. Rewrite this as $f(x)=\langle f,k_x\rangle_{\mathcal H}$, the reproducing property. 6. Define $k(x,z)=k_z(x)$ because the kernel is the value of the $z$-section at $x$. 7. Use reproduction with $f=k_z$ to get $k(x,z)=\langle k_z,k_x\rangle_{\mathcal H}$. 8. Apply Cauchy-Schwarz to get $|f(x)|\le\|f\|\sqrt{k(x,x)}$ because $\|k_x\|^2=k(x,x)$.
- **Symbols.** $\mathcal H$ is the RKHS; $E_x$ is evaluation at $x$; $k_x$ is the representer of evaluation; $k(x,z)$ is the kernel value; $\|f\|_{\mathcal H}$ is function-space norm.

**Real-World Applications (§5).**
1. Kernel ridge penalty: $\lambda=0.1$, $\|f\|=3$ gives $0.9$.
2. GP covariance: $k(x,x)=1$ gives prior variance $1$.
3. Kernel-section cosine: $k(a,a)=4$, $k(b,b)=9$, $k(a,b)=3$ gives $0.5$.
4. SVM form: coefficients $1.2,-0.7$ give $1.2k(x,x_1)-0.7k(x,x_2)+b$.
5. RKHS norm: for $f=k_1-k_2$ and $k(x,z)=1+xz$, $\|f\|^2=2-6+5=1$.
6. Pointwise bound: $\|f\|\le4$, $k(x,x)=0.25$ gives $|f(x)|\le2$.

### `math-05-19` — Positive-definite kernels  · AUTHOR derivation

**Connections (§1).**
> RKHS theory needs kernels that can act like inner products. This lesson gives the finite consistency
> test: every Gram matrix built from the kernel must be positive semidefinite. That condition ensures
> that finite collections of kernel values describe possible geometry rather than contradictory
> similarities. Mercer expansions and kernel methods rely on this positivity throughout.

**Motivation & Intuition (§2).**
> A kernel is often introduced as a similarity function, but not every similarity can be an inner
> product. For a finite set of inputs, the matrix of pairwise kernel values must have nonnegative
> quadratic forms. Otherwise some linear combination of hidden feature vectors would have negative
> squared length, which is impossible.
>
> Positive definiteness is therefore the algebraic checkpoint for kernel geometry. If the kernel is
> already an inner product in a feature space, the PSD condition follows by collecting the weighted
> feature vectors and taking a squared norm. The two-point example with $k(x,z)=1+xz$ shows the same
> test as a concrete Gram-matrix determinant.

**Definition & Assumptions (§3).**
- **Derive (complete).** Inner-product kernels are PSD: 1. Assume $k(x,z)=\langle\Phi(x),\Phi(z)\rangle$ because the kernel is a hidden feature inner product. 2. Form the quadratic sum $\sum_i\sum_j c_ic_jk(x_i,x_j)$ because PSD tests all finite coefficients. 3. Substitute the feature inner product. 4. Move sums inside: $\sum_i\sum_j c_ic_j\langle\Phi(x_i),\Phi(x_j)\rangle=\langle\sum_i c_i\Phi(x_i),\sum_j c_j\Phi(x_j)\rangle$. 5. Recognize this as $\|\sum_i c_i\Phi(x_i)\|^2$. 6. Use nonnegativity of norms to get $\ge0$. 7. Conclude every feature inner-product kernel is positive semidefinite. 8. For $k(x,z)=1+xz$ at $1,2$, build $K=\begin{pmatrix}2&3\\3&5\end{pmatrix}$ with determinant $1>0$.
- **Symbols.** $k$ is a symmetric kernel; $x_i$ are sample inputs; $c_i$ are real coefficients; $K_{ij}=k(x_i,x_j)$ is the Gram matrix; PSD means $c^TKc\ge0$ for all $c$.

**Real-World Applications (§5).**
1. SVM convexity: determinant $0.75>0$ with diagonal $1$ is safe for two points.
2. GP covariance: covariance $0.8$ with unit variances has determinant $0.36>0$.
3. Bad similarity: $[[1,2],[2,1]]$ gives $(1,-1)K(1,-1)^T=-2$.
4. Polynomial kernel: $(1+2\cdot3)^2=49$.
5. Kernel distance: if diagonals are $1$ and cross value $0.2$, squared distance is $1.6$.
6. PSD repair: clipping eigenvalue $-0.001$ to $0$ changes trace by $0.001$.

### `math-05-20` — Mercer's theorem  · AUTHOR derivation

**Connections (§1).**
> Positive kernels have finite Gram matrices with valid geometry, and Mercer gives the corresponding
> infinite-dimensional spectral picture under suitable assumptions. The theorem decomposes a
> well-behaved positive kernel into orthonormal eigenfunctions with nonnegative weights. This mirrors
> the spectral theorem for positive symmetric matrices. Kernel PCA, Gaussian processes, Nyström
> approximation, and RKHS feature maps all use this modal viewpoint.

**Motivation & Intuition (§2).**
> Mercer's theorem explains how a positive kernel can be understood as a sum of independent modes.
> Each eigenfunction supplies a coordinate direction, and each nonnegative eigenvalue supplies its
> weight. The kernel value is then built by multiplying matching modal coordinates and summing them.
>
> The feature-map interpretation comes from splitting each eigenvalue into square roots. Placing
> $\sqrt{\lambda_m}\phi_m(x)$ into the $m$th coordinate makes the kernel equal to an ordinary inner
> product in feature space. This is the bridge between spectral analysis of kernel operators and the
> computational feature viewpoint used in learning algorithms.

**Definition & Assumptions (§3).**
- **Derive (complete).** Kernel as feature inner product from Mercer expansion: 1. Start with $k(x,z)=\sum_m\lambda_m\phi_m(x)\phi_m(z)$ because Mercer provides eigenvalues and eigenfunctions. 2. Note $\lambda_m\ge0$ because the kernel operator is positive. 3. Define feature coordinates $\Phi_m(x)=\sqrt{\lambda_m}\phi_m(x)$ because square roots split the weight evenly. 4. Compute the feature inner product $\langle\Phi(x),\Phi(z)\rangle=\sum_m\Phi_m(x)\Phi_m(z)$. 5. Substitute coordinates to get $\sum_m\sqrt{\lambda_m}\phi_m(x)\sqrt{\lambda_m}\phi_m(z)$. 6. Multiply square roots to recover $\sum_m\lambda_m\phi_m(x)\phi_m(z)$. 7. Conclude $k(x,z)=\langle\Phi(x),\Phi(z)\rangle$. 8. In the example, $4(0.5)(1)+1(2)(-1)=2-2=0$.
- **Symbols.** $T$ is the integral operator; $\lambda_m$ are nonnegative eigenvalues; $\phi_m$ are orthonormal eigenfunctions; $\Phi$ is the Mercer feature map; compactness and positivity supply the spectral expansion.

**Real-World Applications (§5).**
1. Kernel PCA: eigenvalues $5,2,0.5$ give first share $5/7.5=66.7\%$.
2. GP modes: eigenvalue $4$ gives mode standard deviation $2$.
3. Nyström low rank: keeping $10$ and $3$ out of total $14$ preserves $92.9\%$.
4. Smoothing decay: $1/9$ is $11.1\%$ of the first eigenvalue $1$.
5. Effective dimension: $20$ eigenvalues above $0.01$ among $1000$ gives active dimension near $20$.
6. Spectral denoising: dropping a $0.03$ eigenmode removes $0.03$ variance contribution.

### `math-05-21` — The kernel trick and representer theorem  · AUTHOR derivation · ML capstone

**Connections (§1).**
> This capstone lesson ties the RKHS sequence to practical kernel learning. Positive kernels supply
> valid inner products, RKHS theory supplies point evaluation by kernel sections, and the representer
> theorem explains why regularized solutions live in a finite span of training sections. The result is
> that many infinite-dimensional learning problems reduce to Gram matrices and coefficient vectors.
> Kernel ridge regression and SVM prediction are standard examples of this reduction.

**Motivation & Intuition (§2).**
> The kernel trick uses kernel values to compute feature-space inner products without explicitly
> constructing the feature vectors. That handles the computational side, but regularized learning also
> needs a structural reason that finitely many training examples are enough. The representer theorem
> gives that reason.
>
> Training losses depend on $f$ only through values at the training inputs. Any component of $f$
> orthogonal to the span of the training kernel sections is invisible to those values, while it can
> only increase the RKHS norm. Removing that component cannot worsen a nondecreasing norm regularizer,
> so a minimizer can be written with one coefficient per training example.

**Definition & Assumptions (§3).**
- **Derive (complete).** Representer theorem geometry and KRR calculation: 1. Let $M=\operatorname{span}\{k_{x_1},\ldots,k_{x_n}\}$ because training losses only evaluate $f$ at training points. 2. Decompose any $f\in\mathcal H$ as $f=f_M+f_\perp$ with $f_M\in M$ and $f_\perp\perp M$ by Hilbert projection. 3. For each training point, compute $f_\perp(x_i)=\langle f_\perp,k_{x_i}\rangle=0$ because $k_{x_i}\in M$. 4. Therefore $f(x_i)=f_M(x_i)$ for every training input because the perpendicular part is invisible to the loss. 5. Use Pythagoras: $\|f\|^2=\|f_M\|^2+\|f_\perp\|^2\ge\|f_M\|^2$. 6. If the regularizer is nondecreasing in $\|f\|$, removing $f_\perp$ cannot hurt the objective. 7. Conclude a minimizer has $f(x)=\sum_i\alpha_i k(x_i,x)$. 8. For KRR with $x_1=0,x_2=2,k=1+xz,y=(1,3),\lambda=1$, build $K=\begin{pmatrix}1&1\\1&5\end{pmatrix}$ and solve $(K+I)\alpha=y$ to get $\alpha=(3/11,5/11)$. 9. Predict $f(1)=\frac3{11}k(0,1)+\frac5{11}k(2,1)=\frac3{11}+\frac{15}{11}=18/11\approx1.636$.
- **Symbols.** $\Phi$ is a feature map; $k(x,z)=\langle\Phi(x),\Phi(z)\rangle$; $K$ is the Gram matrix; $\alpha_i$ are learned coefficients; $\lambda$ is ridge strength; $M$ is the span of training kernel sections.

**Real-World Applications (§5).**
1. KRR size: $500$ examples require $500^2=250000$ Gram entries.
2. SVM prediction: $80$ support vectors require $80$ kernel evaluations per example.
3. Polynomial trick: $k(2,3)=(1+2\cdot3)^2=49$ instead of explicit features.
4. RBF similarity: distance $2$ gives $e^{-2}=0.135$ for $k=e^{-\|x-z\|^2/2}$.
5. Kernel PCA: eigenvalues $6,2,1$ give first share $6/9=66.7\%$.
6. GP posterior mean: weights $(0.4,-0.1)$ and similarities $(0.8,0.3)$ give $0.32-0.03=0.29$.

---

## Build order

1. **Anchor the section with `05-06`** using the model prose above, then keep its verified $\ell^2$ sequence calculation as the voice and derivation standard.
2. **Author the foundation lessons `05-01…05-05`** so vector-space, norm, completeness, and inner-product language is stable before Hilbert spaces appear.
3. **Author Hilbert geometry `05-07…05-10`** in order: orthonormal bases, projections, best approximation, Riesz. These supply the projection theorem and evaluation-as-inner-product pattern.
4. **Author operator/duality lessons `05-11…05-17`**: boundedness and operator norms first, then dual/Hahn-Banach/weak convergence, then compact and spectral operators.
5. **Author kernel spine `05-18…05-21` last** so RKHS, positive-definite kernels, Mercer, and the representer theorem read as the capstone of the section.
6. **Validation pass:** rerun numeric checks for every §5 number, scan for unbalanced `$`, and confirm each lesson has exactly six applications except no extras are introduced by the renderer.
