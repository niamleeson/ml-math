# Math · Part 12 — Differential geometry  (deep-authored reference)

> **Per-section execution plan.** Load together with the master
> [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) for the four
> exposition principles, the fix recipe, and the Definition of Done. This rewrite keeps the section's
> existing strength while adding complete derivations, named symbols, and six concept-specific applications
> per lesson. Numeric claims were checked with `python3` using `sympy`/`numpy` arithmetic from the repository root.

**Section:** Differential geometry · **Lessons:** 20 · **Breadcrumb:** `Mathematics · Geometry & Topology` · **Priority:** MEDIUM (deepening + one LaTeX fix)

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| §5 boilerplate — no whole-section shared app block, but several lessons need more concept-specific numerical uses | 0 / 20 |
| Templated / thin motivation | 4 / 20 |
| Key formula not in display form | 9 / 20 |
| Unclosed dollar-sign LaTeX bug | 1 / 20 |
| Derivation plan in this file | 18 derivation / 2 explain-only |

## Priority & systemic issues

- No whole-section §5 boilerplate block was detected. The change is targeted deepening: every §5 set below uses the lesson's own object, not generic vectors or norms.
- Differential geometry underlies information geometry, natural gradient, manifold learning, geometric deep learning, and non-Euclidean embeddings. Lessons `math-12-15` through `math-12-20` should be authored as one connected arc.
- **LaTeX bug to fix:** `math-12-03` application **Turning radius** has an unclosed dollar sign in its `numbers` field. Current text ends with `0.25\,\text{m}^{-1}.` inside math; add the missing closing dollar sign after the exponent, before the period.
- Number verification highlights: quarter circle length `3.1416`; helix length `8.8858`; parabola curvature at `x=1` `0.1789`; helix curvature `0.5`; graph metric step length `0.3000`; sphere geodesic with `R=3,\theta=0.4` length `1.2`; Bernoulli Fisher value at `p=0.2` `6.25`; natural-gradient scalar `0.24`.

## Model entry (full prose)

### `math-12-16` — Geodesics  — **full-depth model entry**

**Connections (§1).**
> The earlier lessons in this section give the ingredients for measuring motion on curved spaces. Parametrized
> curves describe paths, the first fundamental form measures their lengths, and a Riemannian metric tells each
> tangent vector how long it is. A geodesic is the path that those ingredients single out as straightest, or
> locally shortest, inside the curved space itself.
>
> This lesson is the bridge from local measurements to global geometry. Geodesics give the shortest routes on a
> sphere, the update paths used by manifold optimization, and the distance functions used in manifold learning.
> They also prepare the next lesson, the exponential map, which starts with a tangent vector and follows the
> geodesic it determines.

**Motivation & Intuition (§2).**
> In a flat plane, the shortest path between two points is a straight line. A sphere has no straight lines that
> stay on the surface, but it still has paths that behave like straight lines from the point of view of the
> surface. Great-circle arcs are the familiar example: airplanes follow them because they are shorter on the
> globe than latitude-longitude drawings suggest.
>
> The same idea applies on any Riemannian manifold. A geodesic is a curve whose velocity is transported along
> itself without turning sideways according to the manifold's connection. Equivalently, for nearby points it is
> the path that makes the length stationary. The formula looks more complicated than a line because the
> coordinates themselves bend, and the Christoffel symbols record how the coordinate grid changes.
>
> For machine learning, this matters whenever data or parameters do not naturally live in flat Euclidean space.
> Probability distributions carry the Fisher metric, spherical embeddings use angular distance, and geometric
> deep learning often compares points by distances that follow the data manifold rather than cutting through the
> surrounding space.

**Definition & Assumptions (§3).** Display the geodesic equation and the sphere distance formula:

$$
\frac{d^2x^k}{dt^2}+\Gamma^k_{ij}(x)\frac{dx^i}{dt}\frac{dx^j}{dt}=0,
\qquad
 d_{S_R^2}(p,q)=R\theta,
\qquad
 \theta=\arccos\!\left(\frac{p\cdot q}{R^2}\right).
$$

**Derive (complete).**
1. Start with a curve $x(t)$ and its velocity components $\dot x^i=dx^i/dt$ — a geodesic is defined by how its velocity changes along the curve.
2. Write parallel velocity as $\nabla_{\dot x}\dot x=0$ — the curve is not accelerating sideways according to the manifold's connection.
3. Expand the covariant derivative in coordinates: $(\nabla_{\dot x}\dot x)^k=\ddot x^k+\Gamma^k_{ij}\dot x^i\dot x^j$ — the ordinary second derivative is corrected by the coordinate-bending terms.
4. Set each component to zero: $\ddot x^k+\Gamma^k_{ij}\dot x^i\dot x^j=0$ — this is the coordinate geodesic equation.
5. On a sphere of radius $R$, the geodesic through two non-antipodal points lies on the great circle determined by the origin, $p$, and $q$ — intersecting that plane with the sphere gives the locally shortest arc.
6. The central angle satisfies $p\cdot q=\lVert p\rVert\lVert q\rVert\cos\theta=R^2\cos\theta$ — this is the dot-product formula with both radii length $R$.
7. Solve for the angle: $\theta=\arccos((p\cdot q)/R^2)$ — the angle is determined by the normalized dot product.
8. Arc length on a radius-$R$ circle is radius times angle, so $d_{S_R^2}(p,q)=R\theta$ — the great-circle geodesic is a circular arc.
9. Example: if $R=3$ and $\theta=0.4$, then $d=3\cdot0.4=1.2$ — the distance uses the surface, not the chord through the ball.

**Symbols.** $x^k(t)$ is the $k$th coordinate of the curve; $\dot x^i$ is its velocity component; $\ddot x^k$ is its coordinate acceleration; $\Gamma^k_{ij}$ are Christoffel symbols for the chosen metric; $p,q$ are points on the sphere; $R$ is the sphere radius; $\theta$ is the central angle in radians.

**Real-World Applications (§5).**
1. **Sphere distance.** On a radius-$3$ sphere with central angle $0.4$, the geodesic length is $R\theta=1.2$.
2. **Quarter great circle.** On the unit sphere, $(1,0,0)$ to $(0,1,0)$ has $\theta=\pi/2$, so distance is $1.571$.
3. **Earth routes.** A $30^\circ=\pi/6$ central angle on Earth gives $6371\cdot\pi/6=3335.85$ km.
4. **Hyperbolic embeddings.** In the Poincare disk, radial distance from $0$ to radius $0.5$ is $2\operatorname{artanh}(0.5)=1.099$.
5. **Diffusion kernels.** A geodesic distance $d=1.2$ with time $t=0.5$ gives $\exp(-d^2/(4t))=0.487$.
6. **Robot orientation.** On $SO(2)$, moving from $350^\circ$ to $10^\circ$ follows the wrapped geodesic of $20^\circ=0.349$ rad, not $340^\circ$.

---

## Per-lesson change specs

**How to read these specs.** Each block is drafted content for the lesson in render order. The labels are plan shorthand; the app should turn them into flowing prose in the same plain textbook voice.

### `math-12-01` — Parametrized curves  · deepen

**Connections (§1).**
> Parametrized curves begin the section with the simplest object in differential geometry: a point that moves.
> The coordinate functions are familiar from calculus, but the geometric viewpoint treats them as one vector-valued
> path. This lesson prepares arc length, curvature, and tangent vectors by making velocity the central local object.
> It also gives the language used later when curves lie on surfaces and manifolds instead of in ordinary Euclidean space.

**Motivation & Intuition (§2).**
> A plotted curve shows the shape traced in space, but it does not always show how the point moved through that shape.
> A parametrization keeps both pieces of information. The same circle can be traced slowly, quickly, clockwise, or
> counterclockwise, and the parameter records that order and speed.
>
> The derivative of a parametrized curve is therefore more than a calculus operation. It is the instantaneous velocity
> of the moving point, and when it is nonzero it gives the tangent direction. Regularity is the condition that the curve
> is not stopping or losing its local direction at the point being studied.

**Definition & Assumptions (§3).** Use a differentiable map from an interval into Euclidean space, and define regular points by nonzero velocity.

**Derive (complete).**
1. Write $\gamma(t)=(x_1(t),\ldots,x_n(t))$ — each coordinate depends on the same parameter.
2. Form the difference quotient $[\gamma(t+h)-\gamma(t)]/h$ — this is average velocity over a small parameter change.
3. Apply the quotient coordinate by coordinate — vector subtraction and division are componentwise.
4. Take $h\to0$ to get $\gamma'(t)=(x_1'(t),\ldots,x_n'(t))$ — the instantaneous velocity is the tangent vector.
5. Declare regularity when $\gamma'(t)\ne0$ — a nonzero velocity gives a definite tangent direction.

**Symbols.** $\gamma$ is the curve; $t$ is the parameter; $I$ is the parameter interval; $\gamma'(t)$ is velocity; $\mathbb R^n$ is the ambient coordinate space.

**Real-World Applications (§5).**
1. Robot path $\gamma(t)=(2t,1+t)$ gives $\gamma(4)=(8,5)$ and speed $\sqrt5=2.236$.
2. Animation circle $(10\cos t,10\sin t,2)$ starts at $(10,0,2)$ and has speed $10$.
3. Embedding interpolation from $(1,2)$ to $(5,4)$ gives $\gamma(0.25)=(2,2.5)$.
4. Projectile $\gamma(t)=(20t,30t-4.9t^2)$ gives $\gamma(2)=(40,40.4)$ and vertical velocity $10.4$.
5. Linear Bezier from $(0,0)$ to $(6,3)$ gives midpoint $(3,1.5)$.
6. Optimizer path $w(t)=5-0.2t$ gives $w(10)=3$ and $w'=-0.2$.

### `math-12-02` — Arc length  · deepen

**Connections (§1).**
> Once a curve has a velocity, it is natural to ask how far the moving point travels. The previous lesson supplied
> the derivative $\gamma'(t)$, and this lesson turns its norm into the speed used for measuring distance along the
> path. Arc length is the first intrinsic measurement in the section because it measures the curve itself, not just
> the straight chord between endpoints. The same idea later becomes surface length through the first fundamental form.

**Motivation & Intuition (§2).**
> A curved path cannot usually be measured correctly by one straight segment from start to finish. The standard
> approximation is to replace the curve by many tiny straight chords, add their lengths, and refine the partition.
> As the chords get shorter, they follow the curve more closely.
>
> Differentiability explains the limiting formula. Over a very small parameter interval, the curve behaves almost
> like its tangent line, so the small distance traveled is speed times the small parameter change. Adding those small
> distances gives the integral of speed.

**Definition & Assumptions (§3).** Assume $\gamma$ is differentiable on the parameter interval and has integrable speed.

**Derive (complete).**
1. Partition $[a,b]$ into small intervals — length is approximated by chords.
2. One chord is $\lVert\gamma(t_i)-\gamma(t_{i-1})\rVert$ — distance between consecutive positions.
3. Use $\gamma(t_i)-\gamma(t_{i-1})\approx\gamma'(t_i)\Delta t_i$ — differentiability gives the local linear approximation.
4. The chord length is approximately $\lVert\gamma'(t_i)\rVert\Delta t_i$ — scalar $\Delta t_i$ factors out of the norm.
5. Sum and take the limit to get $L=\int_a^b\lVert\gamma'(t)\rVert\,dt$ — the Riemann sum becomes the integral of speed.

**Symbols.** $L$ is arc length; $\gamma'(t)$ is velocity; $\lVert\gamma'(t)\rVert$ is speed; $[a,b]$ is the parameter interval.

**Real-World Applications (§5).**
1. Line $\gamma(t)=(3t,4t)$ on $[0,2]$ has length $5\cdot2=10$.
2. Radius-$2$ quarter circle has length $2\cdot\pi/2=3.142$.
3. Helix $(\cos t,\sin t,t)$ on $[0,2\pi]$ has length $2\sqrt2\pi=8.886$.
4. Earth latitude at $60^\circ$ over $90^\circ$ longitude has length $6371\cos60^\circ\cdot\pi/2=5003.77$ km.
5. Parabola $(t,t^2)$ on $[0,1]$ has length $1.479$.
6. A training trajectory with speed $0.03$ for $200$ steps has path length $6.0$ in parameter units.

### `math-12-03` — Curvature  · AUTHOR derivation · FIX LaTeX

**Connections (§1).**
> Arc length measures how far a curve goes, and curvature measures how sharply it turns while going there. The unit
> tangent from the previous lessons gives the direction of travel without the distraction of speed. Curvature studies
> how that direction changes per unit distance. This prepares the Frenet frame, where turning becomes one axis of a
> moving coordinate system along a space curve.

**Motivation & Intuition (§2).**
> A curve can be long without turning much, or short while turning sharply. Curvature separates turning from speed by
> watching the unit tangent, which records direction only. Measuring its change with respect to arc length makes the
> result independent of how quickly the curve is parametrized.
>
> Tight circles have large curvature because their tangent direction changes rapidly over a short distance. Large-radius
> curves have small curvature because the same amount of turning is spread out. For space curves, the cross-product
> formula keeps the part of acceleration that actually bends the path away from its current direction.

**Definition & Assumptions (§3).** Assume a regular curve with enough derivatives for velocity, acceleration, and the unit tangent to be defined.

**Derive (complete).**
1. Define the unit tangent $T=\gamma'/\lVert\gamma'\rVert$ — direction should not depend on speed.
2. Define curvature by $\kappa=\lVert dT/ds\rVert$ — it measures change of direction per arc length $s$.
3. Use $ds/dt=\lVert\gamma'\rVert$ — speed converts parameter change to distance change.
4. Therefore $dT/ds=(dT/dt)/\lVert\gamma'\rVert$ — divide direction change by distance rate.
5. For a space curve, simplifying the derivative of $\gamma'/\lVert\gamma'\rVert$ gives $\kappa=\lVert\gamma'\times\gamma''\rVert/\lVert\gamma'\rVert^3$ — the cross product keeps only the acceleration perpendicular to the velocity.

**Symbols.** $\kappa$ is curvature; $T$ is unit tangent; $s$ is arc length; $\gamma'$ is velocity; $\gamma''$ is acceleration.

**Real-World Applications (§5).**
1. Circle radius $4$ has $\kappa=1/4=0.25$.
2. Helix $(\cos t,\sin t,t)$ has $\kappa=1/2=0.5$.
3. Parabola $y=x^2$ at $x=1$ has $\kappa=2/(1+4)^{3/2}=0.1789$.
4. Road turn radius $25$ m has $\kappa=0.04\,\text{m}^{-1}$.
5. Curve $(t,t^3)$ at $t=1$ has $\kappa=6/10^{3/2}=0.1897$.
6. Embedding path $(t,t^2,0)$ at $t=0.5$ has $\kappa=0.7071$.

### `math-12-04` — The Frenet frame  · deepen

**Connections (§1).**
> Curvature tells how much a curve turns, and the Frenet frame records the directions involved in that turning.
> The tangent direction comes from parametrized curves, the normal direction comes from the change in tangent, and
> the binormal completes a right-handed coordinate system. This lesson gives a local moving frame for space curves.
> It is useful before moving to surfaces because it shows how geometry can be described by frames attached to points.

**Motivation & Intuition (§2).**
> A fixed coordinate system is often awkward for describing a curve that twists through space. The Frenet frame moves
> with the curve, so one axis points forward, one points toward the direction of turning, and one points sideways.
> This makes local bending visible without constantly referring back to the ambient $x,y,z$ axes.
>
> The construction starts with the unit tangent because forward motion is the most basic direction along a curve. If
> the tangent changes, that change identifies the principal normal. The binormal is then forced by perpendicularity,
> giving three mutually orthogonal directions that travel with the curve.

**Definition & Assumptions (§3).** Assume a regular space curve with nonzero curvature where the normal direction is defined.

**Derive (complete).**
1. Start with $T=\gamma'/\lVert\gamma'\rVert$ — the first direction is forward along the curve.
2. Differentiate $T$ with respect to arc length — changes in $T$ reveal the curve's turning direction.
3. Normalize this change to $N=(dT/ds)/\lVert dT/ds\rVert$ — the principal normal records pure direction.
4. Define $B=T\times N$ — the cross product gives the third perpendicular direction.
5. For the helix at $t=0$, $T=(0,1/\sqrt2,1/\sqrt2)$, $N=(-1,0,0)$, and $B=(0,-1/\sqrt2,1/\sqrt2)$ — the three directions are orthonormal.

**Symbols.** $T$ is unit tangent; $N$ is principal normal; $B$ is binormal; $s$ is arc length; $\kappa$ is the size of $dT/ds$.

**Real-World Applications (§5).**
1. Helix frame at $t=0$ has $B=(0,-0.707,0.707)$.
2. Helix curvature is $0.5$, so $\lVert dT/ds\rVert=0.5$.
3. A tube drawn around a curve can use $N$ and $B$ as cross-section axes; radius $0.2$ gives diameter $0.4$.
4. Camera motion uses $T$ as forward direction; $T=(0,0.707,0.707)$ tilts $45^\circ$.
5. A path with $\kappa=0.1$ turns its tangent by about $0.5$ rad over length $5$.
6. A robot end-effector following the helix at speed $2$ has angular turning rate $v\kappa=1$ rad/s.

### `math-12-05` — Regular surfaces  · explain-only

**Connections (§1).**
> After curves, the next object is a two-dimensional surface described by two parameters. The curve lessons used one
> derivative to produce one tangent direction; a surface patch uses two coordinate derivatives to produce a tangent
> plane. Regularity is the condition that those two directions are genuinely independent. This prepares tangent planes,
> surface area scale, and the first fundamental form.

**Motivation & Intuition (§2).**
> A surface parametrization should behave locally like a sheet, not collapse into a line or a point. The two parameters
> are meant to move in two independent directions across the patch. If both parameter directions point the same way,
> the parametrization may still be a formula, but it is not a regular surface patch at that point.
>
> The cross product $r_u\times r_v$ captures both independence and local area scaling. When it is nonzero, the two
> tangent vectors span a plane and have a well-defined normal direction. When it is zero, the local coordinate grid has
> collapsed and the usual surface tools no longer apply there.

**Definition & Assumptions (§3).** This lesson is definition-first: a regular patch is a smooth two-parameter map whose coordinate tangent vectors are independent.

**Derive.** Explain-only: this is a definition and rank condition, not a closed-form identity. The lesson should show why $r_u\times r_v\ne0$ means two independent surface directions.

**Symbols.** $r(u,v)$ is a surface parametrization; $r_u,r_v$ are coordinate tangent vectors; $U$ is the parameter domain; $r_u\times r_v$ is the normal-area vector.

**Real-World Applications (§5).**
1. Graph $r(u,v)=(u,v,u^2+v^2)$ at $(1,2)$ has $\lVert r_u\times r_v\rVert=\sqrt{21}=4.583$.
2. Unit plane patch $r(u,v)=(u,v,0)$ has area scale $1$.
3. Sphere patch of radius $2$ at the equator has area scale $4$.
4. Degenerate patch $r(u,v)=(u+v,0,0)$ has $r_u\times r_v=0$.
5. A $20\times30$ grid samples $600$ surface points.
6. UV texture coordinates with Jacobian area scale $0.5$ map one parameter square of area $0.04$ to surface area $0.02$.

### `math-12-06` — Tangent planes  · deepen

**Connections (§1).**
> Regular surfaces have two independent tangent directions, and the tangent plane is the flat plane they span at a
> point. This lesson connects surface parametrizations with the linear approximations from multivariable calculus.
> The tangent plane is the surface analogue of the tangent line to a curve. It becomes the local model used for normals,
> constraints, and first-order updates on curved spaces.

**Motivation & Intuition (§2).**
> Near a smooth point, a surface can be approximated by a plane in the same way a smooth curve can be approximated by
> a line. For a graph $z=f(x,y)$, the two partial derivatives describe how height changes when moving in the $x$ and
> $y$ directions. Combining those two slopes gives the best first-order flat approximation.
>
> This plane does not claim the surface is globally flat. It only captures what is visible at very small scale, where
> higher-order bending terms are negligible. That local flatness is what makes normals, projections, and constrained
> differential calculations possible.

**Definition & Assumptions (§3).** Assume $f$ is differentiable at $(a,b)$, or equivalently that a regular parametrized surface has a well-defined tangent plane.

**Derive (complete).**
1. For a graph $z=f(x,y)$, choose base point $(a,b,f(a,b))$ — the tangent plane must pass through it.
2. Move by small amounts $\Delta x,\Delta y$ — local behavior is first order in these changes.
3. Use the linear approximation $\Delta z\approx f_x(a,b)\Delta x+f_y(a,b)\Delta y$ — partial derivatives give the two coordinate slopes.
4. Replace changes by coordinates: $\Delta x=x-a$, $\Delta y=y-b$, $\Delta z=z-f(a,b)$.
5. Solve for $z$: $z=f(a,b)+f_x(a,b)(x-a)+f_y(a,b)(y-b)$ — this is the tangent plane.

**Symbols.** $(a,b)$ is the base input; $f_x,f_y$ are partial slopes; $z$ is height; $r_u,r_v$ can also span the tangent plane for a parametrized surface.

**Real-World Applications (§5).**
1. For $z=x^2+y^2$ at $(1,2)$, the plane is $z=5+2(x-1)+4(y-2)$.
2. That plane predicts $z=11$ at $(2,3)$.
3. Sphere radius $2$ at north pole has tangent plane $z=2$.
4. Graph normal at $(1,2)$ is $(-2,-4,1)$.
5. A mesh triangle with tangent vectors $(1,0,0),(0,2,0)$ has normal area vector $(0,0,2)$.
6. Linearizing a constraint with normal $(1,1,1)$ gives tangent directions satisfying $v_1+v_2+v_3=0$.

### `math-12-07` — The differential of a map  · deepen

**Connections (§1).**
> Tangent planes describe first-order geometry at one surface point, and the differential describes how a smooth map
> moves those first-order directions. It is the geometric version of the Jacobian matrix from multivariable calculus.
> This lesson connects local linearization with maps between spaces. Later, the same idea carries tangent vectors
> between manifolds and supports metric-aware optimization.

**Motivation & Intuition (§2).**
> A smooth map can be nonlinear over large distances while still having a reliable linear approximation near one point.
> Tiny input displacements are sent to tiny output displacements, and the differential is the linear rule that best
> describes this local behavior. In coordinates, that rule is exactly multiplication by the Jacobian.
>
> Thinking of the Jacobian as a differential gives it a geometric role. It does not just store partial derivatives; it
> pushes tangent vectors forward from the input space to the output space. This is why it appears in sensitivity
> analysis, image warping, neural networks, and changes of coordinates.

**Definition & Assumptions (§3).** Assume $F$ is differentiable at $p$, so its first-order approximation is represented by the Jacobian matrix.

**Derive (complete).**
1. Let $F:\mathbb R^n\to\mathbb R^m$ and move from $p$ to $p+h$ — the input displacement is $h$.
2. Linearize each output component: $F_j(p+h)\approx F_j(p)+\sum_i(\partial F_j/\partial x_i)h_i$ — multivariable first-order approximation.
3. Stack the component formulas — this forms the Jacobian matrix $J_F(p)$.
4. Subtract $F(p)$ to get output displacement $\Delta F\approx J_F(p)h$ — the differential sends tangent vectors forward.
5. Write $dF_p(h)=J_F(p)h$ — this is the coordinate expression for the differential.

**Symbols.** $F$ is the map; $p$ is the base point; $h$ is an input tangent vector; $J_F$ is the Jacobian; $dF_p$ is the differential at $p$.

**Real-World Applications (§5).**
1. For $F(x,y)=(x^2,xy)$ at $(2,3)$, $J=\begin{bmatrix}4&0\\3&2\end{bmatrix}$.
2. The vector $(0.1,-0.2)$ maps to $(0.4,-0.1)$.
3. A scalar loss with gradient $(4,9)$ maps direction $(0.6,0.8)$ to rate $9.6$.
4. A projection from $(x,y,z)$ to $(x,y)$ sends $(1,2,3)$ to $(1,2)$.
5. A local image warp with scale matrix $\operatorname{diag}(2,0.5)$ changes area by determinant $1$.
6. A neural layer with local Jacobian norm $3$ can triple a small perturbation of size $0.01$ to about $0.03$.

### `math-12-08` — The first fundamental form  · deepen

**Connections (§1).**
> The tangent plane gives a flat approximation to a surface, and the first fundamental form tells how lengths and
> angles are measured inside that tangent plane. It uses the coordinate tangent vectors of a regular surface patch.
> This lesson is the surface version of arc length because it turns small coordinate steps into actual surface
> distances. It also prepares Riemannian metrics, where the same ruler is assigned on general manifolds.

**Motivation & Intuition (§2).**
> Coordinates on a surface are not usually measured in the same units as distance on the surface. A small step in
> $u$ or $v$ may stretch, shrink, or slant depending on the parametrization. The first fundamental form records this
> local conversion from coordinate movement to surface movement.
>
> The formula comes from the ordinary dot product after linearizing the surface patch. A small displacement is a
> combination of the two tangent vectors $r_u$ and $r_v$, so its squared length expands into the coefficients $E$, $F$,
> and $G$. Those three numbers are the local metric data of the surface.

**Definition & Assumptions (§3).** Assume $r(u,v)$ is a regular surface parametrization and use its coordinate tangent vectors to measure first-order surface displacement.

**Derive (complete).**
1. Start with a surface $r(u,v)$ and a small parameter step $(du,dv)$ — this is a small move in the coordinate chart.
2. Linearize the surface displacement: $dr=r_u\,du+r_v\,dv$ — first-order change follows the two tangent directions.
3. Square its Euclidean length: $ds^2=dr\cdot dr$ — distance on the surface is measured by the ambient dot product.
4. Expand the dot product: $ds^2=(r_u\cdot r_u)du^2+2(r_u\cdot r_v)dudv+(r_v\cdot r_v)dv^2$.
5. Name $E=r_u\cdot r_u$, $F=r_u\cdot r_v$, $G=r_v\cdot r_v$ — these are the metric coefficients.

**Symbols.** $E,F,G$ are first fundamental form coefficients; $du,dv$ are coordinate steps; $ds$ is surface length; $r_u,r_v$ are tangent vectors.

**Real-World Applications (§5).**
1. For $r=(u,v,u^2+v^2)$ at $(1,0)$, $E=5,F=0,G=1$.
2. Step $(0.1,0.2)$ there has length $\sqrt{5(0.1)^2+(0.2)^2}=0.300$.
3. The area scale is $\sqrt{EG-F^2}=\sqrt5=2.236$.
4. Radius-$3$ sphere at the equator has longitude step $0.1$ length $0.3$.
5. Metric $G=\operatorname{diag}(4,1)$ turns gradient $(2,2)$ into natural step $(0.5,2)$.
6. Local manifold learning with metric determinant $5$ expands tiny coordinate areas by $2.236$.

### `math-12-09` — The second fundamental form  · AUTHOR derivation

**Connections (§1).**
> The first fundamental form measured distances within the tangent plane. The second fundamental form measures how
> the surface bends away from that plane. It uses second derivatives and the unit normal introduced by regular surfaces
> and tangent planes. This lesson prepares Gaussian and mean curvature by turning normal bending into coefficients.

**Motivation & Intuition (§2).**
> A tangent plane captures the first-order behavior of a surface, so bending is invisible at that order. To see bending,
> the calculation must look at second-order change. The second fundamental form takes those second derivatives and keeps
> the part that points in the normal direction.
>
> This separates intrinsic movement along the surface from extrinsic bending in the surrounding space. For a graph with
> a horizontal tangent plane, the Hessian gives this normal bending directly. In other coordinates, the same idea is
> expressed through the coefficients $e$, $f$, and $g$.

**Definition & Assumptions (§3).** Assume a regular surface with a chosen unit normal and enough smoothness for second derivatives.

**Derive (complete).**
1. Choose a unit normal $n$ to the surface — bending is measured in the normal direction.
2. Differentiate the surface twice to get $r_{uu},r_{uv},r_{vv}$ — second derivatives record acceleration of coordinate curves.
3. Project each second derivative onto $n$: $e=n\cdot r_{uu}$, $f=n\cdot r_{uv}$, $g=n\cdot r_{vv}$ — normal components are the bending coefficients.
4. For a parameter step $(du,dv)$, expand the second-order normal change as $II=e\,du^2+2f\,du\,dv+g\,dv^2$.
5. For a graph with horizontal tangent plane, $n=(0,0,1)$, so $II=f_{xx}dx^2+2f_{xy}dxdy+f_{yy}dy^2$ — the Hessian gives normal bending.

**Symbols.** $II$ is the second fundamental form; $n$ is the unit normal; $e,f,g$ are second-form coefficients; $du,dv$ are tangent coordinate changes.

**Real-World Applications (§5).**
1. For $z=x^2+2y^2$ at the origin, $II=2dx^2+4dy^2$.
2. Direction $(1,1)$ gives $II=6$.
3. Its first-form length squared is $2$, so normal curvature is $6/2=3$.
4. Plane $z=0$ has $II=0$.
5. Sphere radius $4$ has normal curvature $1/4=0.25$ in every unit direction.
6. Mesh smoothing can penalize $e^2+g^2$; with $e=2,g=4$ the penalty core is $20$.

### `math-12-10` — Gaussian curvature  · AUTHOR derivation

**Connections (§1).**
> The second fundamental form records normal bending in different tangent directions. Gaussian curvature compresses
> the two principal bends into one intrinsic number by multiplying them. It distinguishes sphere-like, flat-cylinder,
> and saddle-like local geometry. This lesson also connects surface calculus with later manifold ideas because Gaussian
> curvature is geometry that can be detected from measurements within the surface.

**Motivation & Intuition (§2).**
> A surface can bend in more than one direction at the same point. The principal curvatures are the largest and smallest
> normal bends, found in special perpendicular directions. Multiplying them gives a sign-sensitive summary: positive
> when the surface bends the same way in both directions, zero when one direction is flat, and negative when the surface
> bends oppositely.
>
> This product is especially important because it captures the local type of the surface. Spheres have positive
> Gaussian curvature, cylinders have zero Gaussian curvature, and saddles have negative Gaussian curvature. For graphs
> with a horizontal tangent plane, the determinant of the Hessian gives this product directly.

**Definition & Assumptions (§3).** Use principal curvatures at a smooth surface point, and for the graph formula assume the tangent plane is horizontal at the origin.

**Derive (complete).**
1. At a surface point, choose principal directions — these diagonalize normal curvature.
2. Let their curvatures be $k_1$ and $k_2$ — they are the maximum and minimum normal curvatures.
3. Define $K=k_1k_2$ — the product captures whether the bends have the same sign, one zero sign, or opposite signs.
4. For a graph $z=f(x,y)$ with $\nabla f(0,0)=0$, the tangent plane is horizontal — first-order tilt is absent.
5. The shape operator matrix at the origin is the Hessian $\begin{bmatrix}f_{xx}&f_{xy}\\f_{xy}&f_{yy}\end{bmatrix}$ — second derivatives give principal bending to first order.
6. Its determinant is $f_{xx}f_{yy}-f_{xy}^2$, so $K=f_{xx}f_{yy}-f_{xy}^2$ at that point.

**Symbols.** $K$ is Gaussian curvature; $k_1,k_2$ are principal curvatures; $f_{xx},f_{xy},f_{yy}$ are second partial derivatives.

**Real-World Applications (§5).**
1. Sphere radius $2$ has $K=(1/2)^2=0.25$.
2. Cylinder has $K=(1/R)\cdot0=0$.
3. Saddle $z=x^2-y^2$ at the origin has $K=2(-2)=-4$.
4. Paraboloid $z=x^2+y^2$ at the origin has $K=2\cdot2=4$.
5. Graph $z=x^2+2y^2$ has $K=2\cdot4=8$.
6. On the unit sphere, a geodesic triangle with angle excess $0.1$ has area $0.1$.

### `math-12-11` — Mean curvature  · AUTHOR derivation

**Connections (§1).**
> Gaussian curvature multiplies the principal curvatures, while mean curvature averages them. Both use the same
> principal bending data from the second fundamental form, but they answer different geometric questions. Mean curvature
> measures the balanced normal bending that drives area-reducing motion. This makes it central in minimal surfaces,
> mesh smoothing, and physical interfaces such as films and bubbles.

**Motivation & Intuition (§2).**
> A surface may bend strongly in one direction and weakly in another. The mean curvature records the average of those
> two principal bends, so it describes the surface's local tendency to move in the normal direction when area is reduced.
> When the bends cancel, as on an ideal minimal surface, the mean curvature is zero.
>
> The sphere is the clean reference case. Every normal slice through a sphere is a circle of the same radius, so both
> principal curvatures are equal. Averaging them keeps the same reciprocal-radius value, with the sign depending on the
> chosen normal direction.

**Definition & Assumptions (§3).** Use the two principal curvatures at a smooth surface point; the sign convention depends on the chosen unit normal.

**Derive (complete).**
1. Choose principal directions with curvatures $k_1,k_2$ — these are the two extreme normal curvatures.
2. Average them: $H=(k_1+k_2)/2$ — the mean captures the balanced normal bending.
3. For a sphere of radius $R$, every normal section is a circle of radius $R$ — all tangent directions bend equally.
4. Therefore $k_1=k_2=1/R$ — both principal curvatures match the circle curvature.
5. Substitute to get $H=(1/R+1/R)/2=1/R$ — sphere mean curvature equals reciprocal radius.

**Symbols.** $H$ is mean curvature; $k_1,k_2$ are principal curvatures; $R$ is radius; the sign depends on the chosen unit normal.

**Real-World Applications (§5).**
1. Soap film with $k_1=0.7,k_2=-0.7$ has $H=0$.
2. Bubble with surface tension $0.03$ N/m and radius $0.02$ m has $H=50$ and pressure jump $3$ Pa.
3. Mesh smoothing with step $0.01$ and $H=4$ moves $0.04$ along the normal.
4. Image surface $z=0.5x^2+0.1y^2$ has $H=(1+0.2)/2=0.6$ at a flat-gradient point.
5. Curvature penalty $0.05H^2$ with $H=3$ contributes $0.45$.
6. Cylindrical vessel radius $2$ mm has $H=1/(2R)=0.25$ mm$^{-1}$.

### `math-12-12` — Manifolds and charts  · explain-only

**Connections (§1).**
> Curves and surfaces are examples of spaces that may be curved while still looking simple nearby. Manifolds generalize
> that idea by requiring each small neighborhood to have ordinary coordinates. Charts provide those coordinates, and
> atlases organize compatible charts across the space. This lesson supplies the language needed for tangent spaces,
> vector fields, metrics, and geodesics on spaces beyond surfaces in $\mathbb R^3$.

**Motivation & Intuition (§2).**
> Many spaces cannot be described cleanly by one global coordinate system. A circle needs angle coordinates with a wrap,
> a sphere has trouble at poles, and probability simplexes use coordinates with constraints. A chart handles this by
> describing only a local patch where Euclidean coordinates work well.
>
> The manifold condition says that these local descriptions fit together smoothly. On overlaps, one chart's coordinates
> must convert smoothly into another's, so calculus does not depend on the particular chart chosen. This is why manifolds
> can be curved globally while still supporting local derivatives and tangent vectors.

**Definition & Assumptions (§3).** This lesson is definition-first: a manifold is locally Euclidean and is described by compatible coordinate charts.

**Derive.** Explain-only: this is a definition of local coordinate structure. The lesson should explain charts, overlaps, smooth transition maps, and why one global chart can fail.

**Symbols.** $\mathcal M$ is the manifold; $n$ is its dimension; $U$ is a local patch; $\varphi:U\to\mathbb R^n$ is a chart; an atlas is a compatible chart collection.

**Real-World Applications (§5).**
1. Unit-circle upper chart with coordinate $u=0.6$ gives point $(0.6,0.8)$.
2. Positive-number charts $u=x$ and $v=\ln x$ give transition value $v=\ln4=1.386$.
3. Four-class simplex chart $(0.1,0.2,0.3)$ gives $p_4=0.4$.
4. A 3-D rotation manifold has $3$ local degrees of freedom, not $9$ matrix entries.
5. A $64\times64$ image has $4096$ pixels but may use a $128$-dimensional latent chart.
6. Circular angles $6.27$ and $0.01$ rad differ by $0.023$ around the circle.

### `math-12-13` — Tangent spaces  · AUTHOR derivation

**Connections (§1).**
> Charts make a manifold look locally like Euclidean space, and tangent spaces capture the first-order directions
> available at a point. The tangent plane to a surface is the familiar example, but the definition applies to any
> manifold. This lesson connects constraints, curves, and derivatives into one description of feasible infinitesimal
> motion. It prepares vector fields and Riemannian metrics, which assign vectors and lengths to these spaces.

**Motivation & Intuition (§2).**
> A curved constraint set may not allow every possible Euclidean displacement. At a point on a sphere, moving directly
> outward leaves the sphere to first order, while moving perpendicular to the radius stays tangent. The tangent space
> collects exactly the velocities that can arise from curves staying on the manifold.
>
> For constraint-defined manifolds, the chain rule gives a practical test. If $F(x)=0$ along every valid curve, then
> the derivative of $F$ in a tangent direction must be zero. This turns the geometric idea of feasible motion into a
> linear equation for tangent vectors.

**Definition & Assumptions (§3).** Assume the manifold is locally described by a smooth constraint with a well-defined derivative at the point.

**Derive (complete).**
1. Let the manifold be a constraint set $F(x)=0$ — this gives an equation that all points on the manifold satisfy.
2. Let $\gamma(t)$ be a curve in the manifold with $\gamma(0)=p$ and $\gamma'(0)=v$ — any tangent vector can be realized as a velocity.
3. Since the curve stays on the constraint, $F(\gamma(t))=0$ for all small $t$.
4. Differentiate at $t=0$: $DF_p(\gamma'(0))=0$ — the chain rule gives the first-order constraint.
5. Substitute $v=\gamma'(0)$ to get $DF_p(v)=0$ — tangent vectors are feasible first-order motions.
6. For the unit sphere, $F(x)=x\cdot x-1$, so $DF_p(v)=2p\cdot v$ and $T_pS^2=\{v:p\cdot v=0\}$.

**Symbols.** $T_p\mathcal M$ is the tangent space at $p$; $v$ is a tangent vector; $DF_p$ is the derivative of the constraint; $S^2$ is the unit sphere.

**Real-World Applications (§5).**
1. At the north pole $(0,0,1)$, tangent vectors satisfy $c=0$, so $T_pS^2=\{(a,b,0)\}$.
2. Circle at $(1,0)$ has tangent vectors $(0,b)$.
3. Simplex vector $(0.1,-0.3,0.2)$ is tangent because the components sum to $0$.
4. SPD matrices of size $3$ have symmetric tangent dimension $3\cdot4/2=6$.
5. $SO(3)$ tangent vectors are skew-symmetric matrices with $3$ independent entries.
6. Plane $x+y+z=3$ has tangent vector $(1,-1,0)$ because the component sum is $0$.

### `math-12-14` — Vector fields on manifolds  · AUTHOR derivation

**Connections (§1).**
> Tangent spaces describe the possible directions at one point, and a vector field chooses one such direction at every
> point. This turns a manifold into a space with local instructions for motion. Curves can then follow the field, and
> optimization can be described as flowing along a descent direction. The lesson prepares connections, geodesics, and
> manifold-aware learning algorithms.

**Motivation & Intuition (§2).**
> A single tangent vector tells how to move from one point, but many geometric and dynamical problems need directions
> everywhere. A vector field assigns those directions consistently across the manifold. Integral curves are the paths
> whose velocities obey the assigned directions at each point.
>
> On a curved or constrained space, an ordinary Euclidean step may leave the manifold. The vector field gives the
> first-order tangent motion, and a projection or retraction restores the point to the valid space when needed. Gradient
> fields are a central example because they turn optimization into motion along a manifold.

**Definition & Assumptions (§3).** Assume each point has a tangent space, and the assigned vector $X(p)$ lies in the correct tangent space.

**Derive (complete).**
1. Assign $X(p)\in T_p\mathcal M$ at each point $p$ — the vector must live in the correct tangent space.
2. An integral curve follows the field, so impose $\gamma'(t)=X(\gamma(t))$ — its velocity equals the assigned vector.
3. A small Euler step gives $\gamma(t+h)\approx\gamma(t)+hX(\gamma(t))$ — first-order motion follows the vector field.
4. On a constrained manifold, project or retract the step back to the manifold — the tangent step is only first-order feasible.
5. If $X=-\nabla f$, the field is the steepest local descent direction under the chosen metric — optimization is a flow.

**Symbols.** $X$ is a vector field; $X(p)$ is a tangent vector at $p$; $\gamma$ is an integral curve; $h$ is a small step; $\nabla f$ is a gradient field.

**Real-World Applications (§5).**
1. Rotation field on the sphere $X(p)=a\times p$ with $a=(0,0,1)$ gives $X(1,0,0)=(0,1,0)$.
2. Descent field for $f=x^2+y^2$ at $(3,4)$ is $(-6,-8)$.
3. ODE field $X(x)=0.5x$ at $x=2$ gives derivative $1$.
4. Euler step from $x=2$ with $h=0.1$ gives $2.1$.
5. A velocity field of norm $0.03$ for $50$ steps gives approximate path length $1.5$.
6. On the simplex, field $(0.2,-0.1,-0.1)$ preserves total probability because its components sum to $0$.

### `math-12-15` — Riemannian metrics  · AUTHOR derivation

**Connections (§1).**
> Tangent spaces provide local directions, but geometry also needs a way to measure those directions. A Riemannian
> metric assigns an inner product to each tangent space, making lengths, angles, gradients, and volumes meaningful.
> This lesson generalizes the first fundamental form from surfaces to arbitrary manifolds. It is the start of the
> metric spine that leads to geodesics, exponential maps, Fisher information, and natural gradients.

**Motivation & Intuition (§2).**
> In Euclidean space, the dot product silently decides which vectors are long, short, or perpendicular. On a manifold,
> there may be no single global dot product that fits the geometry. A Riemannian metric supplies a local inner product
> at each point, and that local ruler can change from point to point.
>
> The matrix form makes the idea concrete. Positive definiteness ensures that nonzero vectors have positive length,
> while the inverse metric converts ordinary gradients into metric-aware gradients. In optimization, this means a step
> can be scaled by the geometry of the parameter space instead of by raw coordinates alone.

**Definition & Assumptions (§3).** Assume each tangent space has a smoothly varying positive-definite inner product represented locally by $G(p)$.

**Derive (complete).**
1. At a point $p$, choose a positive-definite matrix $G(p)$ in local coordinates — positivity makes nonzero vectors have positive length.
2. Define $g_p(u,v)=u^TG(p)v$ — this is the metric inner product.
3. Set $u=v$ to get squared length $\lVert u\rVert_g^2=u^TG(p)u$ — inner products measure lengths by self-pairing.
4. Use the same inner product for angles: $\cos\theta=g_p(u,v)/(\lVert u\rVert_g\lVert v\rVert_g)$ — angle is normalized alignment.
5. For optimization, solve $G\tilde g=\nabla L$ — the metric gradient is $\tilde g=G^{-1}\nabla L$.

**Symbols.** $g_p$ is the metric at $p$; $G(p)$ is its coordinate matrix; $u,v$ are tangent vectors; $\tilde g$ is the metric or natural gradient.

**Real-World Applications (§5).**
1. With $G=\operatorname{diag}(4,1)$ and $u=(1,2)$, metric norm is $\sqrt8=2.828$.
2. The same metric turns gradient $(2,2)$ into $G^{-1}g=(0.5,2)$.
3. Unit sphere radius $3$ has equator longitude step $0.1$ length $0.3$.
4. Bernoulli Fisher metric at $p=0.2$ is $6.25$.
5. Bernoulli step $dp=0.04$ has Fisher length $0.1$.
6. A metric determinant $5$ gives local area scale $\sqrt5=2.236$.

### `math-12-16` — Geodesics  · AUTHOR derivation

**Connections (§1).**
> The earlier lessons in this section give the ingredients for measuring motion on curved spaces. Parametrized curves
> describe paths, the first fundamental form measures their lengths, and a Riemannian metric tells each tangent vector
> how long it is. A geodesic is the path that those ingredients single out as straightest, or locally shortest, inside
> the curved space itself.
>
> This lesson is the bridge from local measurements to global geometry. Geodesics give the shortest routes on a sphere,
> the update paths used by manifold optimization, and the distance functions used in manifold learning. They also prepare
> the next lesson, the exponential map, which starts with a tangent vector and follows the geodesic it determines.

**Motivation & Intuition (§2).**
> In a flat plane, the shortest path between two points is a straight line. A sphere has no straight lines that stay on
> the surface, but it still has paths that behave like straight lines from the point of view of the surface. Great-circle
> arcs are the familiar example: airplanes follow them because they are shorter on the globe than latitude-longitude
> drawings suggest.
>
> The same idea applies on any Riemannian manifold. A geodesic is a curve whose velocity is transported along itself
> without turning sideways according to the manifold's connection. Equivalently, for nearby points it is the path that
> makes the length stationary. The formula looks more complicated than a line because the coordinates themselves bend,
> and the Christoffel symbols record how the coordinate grid changes.
>
> For machine learning, this matters whenever data or parameters do not naturally live in flat Euclidean space. Probability
> distributions carry the Fisher metric, spherical embeddings use angular distance, and geometric deep learning often
> compares points by distances that follow the data manifold rather than cutting through the surrounding space.

**Definition & Assumptions (§3).** Display the geodesic equation and the sphere distance formula:

$$
\frac{d^2x^k}{dt^2}+\Gamma^k_{ij}(x)\frac{dx^i}{dt}\frac{dx^j}{dt}=0,
\qquad
 d_{S_R^2}(p,q)=R\theta,
\qquad
 \theta=\arccos\!\left(\frac{p\cdot q}{R^2}\right).
$$

**Derive (complete).**
1. Start with a curve $x(t)$ and its velocity components $\dot x^i=dx^i/dt$ — a geodesic is defined by how its velocity changes along the curve.
2. Write parallel velocity as $\nabla_{\dot x}\dot x=0$ — the curve is not accelerating sideways according to the manifold's connection.
3. Expand the covariant derivative in coordinates: $(\nabla_{\dot x}\dot x)^k=\ddot x^k+\Gamma^k_{ij}\dot x^i\dot x^j$ — the ordinary second derivative is corrected by the coordinate-bending terms.
4. Set each component to zero: $\ddot x^k+\Gamma^k_{ij}\dot x^i\dot x^j=0$ — this is the coordinate geodesic equation.
5. On a sphere of radius $R$, the geodesic through two non-antipodal points lies on the great circle determined by the origin, $p$, and $q$ — intersecting that plane with the sphere gives the locally shortest arc.
6. The central angle satisfies $p\cdot q=\lVert p\rVert\lVert q\rVert\cos\theta=R^2\cos\theta$ — this is the dot-product formula with both radii length $R$.
7. Solve for the angle: $\theta=\arccos((p\cdot q)/R^2)$ — the angle is determined by the normalized dot product.
8. Arc length on a radius-$R$ circle is radius times angle, so $d_{S_R^2}(p,q)=R\theta$ — the great-circle geodesic is a circular arc.
9. Example: if $R=3$ and $\theta=0.4$, then $d=3\cdot0.4=1.2$ — the distance uses the surface, not the chord through the ball.

**Symbols.** $x^k(t)$ is the $k$th coordinate of the curve; $\dot x^i$ is its velocity component; $\ddot x^k$ is its coordinate acceleration; $\Gamma^k_{ij}$ are Christoffel symbols for the chosen metric; $p,q$ are points on the sphere; $R$ is the sphere radius; $\theta$ is the central angle in radians.

**Real-World Applications (§5).**
1. **Sphere distance.** On a radius-$3$ sphere with central angle $0.4$, the geodesic length is $R\theta=1.2$.
2. **Quarter great circle.** On the unit sphere, $(1,0,0)$ to $(0,1,0)$ has $\theta=\pi/2$, so distance is $1.571$.
3. **Earth routes.** A $30^\circ=\pi/6$ central angle on Earth gives $6371\cdot\pi/6=3335.85$ km.
4. **Hyperbolic embeddings.** In the Poincare disk, radial distance from $0$ to radius $0.5$ is $2\operatorname{artanh}(0.5)=1.099$.
5. **Diffusion kernels.** A geodesic distance $d=1.2$ with time $t=0.5$ gives $\exp(-d^2/(4t))=0.487$.
6. **Robot orientation.** On $SO(2)$, moving from $350^\circ$ to $10^\circ$ follows the wrapped geodesic of $20^\circ=0.349$ rad, not $340^\circ$.

### `math-12-17` — The exponential map  · AUTHOR derivation

**Connections (§1).**
> Geodesics describe straightest paths on a manifold, and the exponential map uses them to turn tangent vectors into
> actual manifold points. The tangent space gives a flat local workspace, while the exponential map returns the result
> to the curved space. This lesson connects local linear motion with global manifold position. It is especially important
> for optimization, where updates often begin as tangent vectors.

**Motivation & Intuition (§2).**
> A tangent vector at a point has both direction and length, but by itself it lives in the flat tangent space rather than
> on the manifold. The exponential map interprets that vector as an initial velocity and follows the corresponding
> geodesic for one unit of time. The endpoint is the manifold point reached by that intrinsic step.
>
> On the sphere, this is easy to visualize. A tangent vector at the north pole points along a great circle, and its norm
> gives the angular distance traveled. The formula combines the starting radial direction and the tangent direction to
> land back exactly on the sphere.

**Definition & Assumptions (§3).** Assume a geodesic exists for the chosen initial point and tangent vector over the needed time interval.

**Derive (complete).**
1. Choose $p\in\mathcal M$ and $v\in T_p\mathcal M$ — the tangent vector is the initial velocity.
2. Let $\gamma_v$ be the geodesic satisfying $\gamma_v(0)=p$ and $\gamma_v'(0)=v$ — geodesics are determined by initial position and velocity.
3. Define $\exp_p(v)=\gamma_v(1)$ — run the geodesic for time $1$.
4. On the unit sphere, the geodesic with tangent vector $v$ has angular speed $\lVert v\rVert$ — arc length equals angle on the unit sphere.
5. The great-circle formula is $\exp_p(v)=\cos\lVert v\rVert\,p+\sin\lVert v\rVert\,v/\lVert v\rVert$ — combine the radial starting direction and unit tangent direction.

**Symbols.** $\exp_p$ is the exponential map at $p$; $v$ is an initial tangent vector; $\gamma_v$ is the geodesic with that initial velocity; $\lVert v\rVert$ is its metric length.

**Real-World Applications (§5).**
1. At north pole with $v=(0.1,0,0)$, the unit-sphere exponential gives $(0.0998,0,0.9950)$.
2. The same step has angular size $0.1$ rad, or $5.73^\circ$.
3. At $p=(1,0,0)$ with $v=(0,0.2,0)$, the result is $(0.9801,0.1987,0)$.
4. A tangent perturbation of norm $0.05$ on a sphere is $2.865^\circ$.
5. Hyperbolic learning can treat tangent norm $0.1$ as local distance about $0.1$.
6. A manifold optimizer with step norm $0.03$ moves about $0.03$ geodesic units before curvature corrections.

### `math-12-18` — Connections and parallel transport  · AUTHOR derivation

**Connections (§1).**
> Geodesics and exponential maps require a way to compare tangent vectors at nearby points. A connection provides that
> rule by defining how vector fields are differentiated along directions on the manifold. Parallel transport is the
> corresponding way to move a vector along a curve without introducing extra turning. This lesson explains the mechanism
> behind covariant acceleration, geodesics, and manifold momentum.

**Motivation & Intuition (§2).**
> In Euclidean space, vectors at different points can be compared by sliding them around unchanged. On a curved manifold,
> tangent vectors at different points belong to different tangent spaces, so that simple comparison is no longer built in.
> A connection supplies the missing rule for differentiating and transporting tangent vectors consistently.
>
> Christoffel symbols appear because coordinate basis vectors themselves may change from point to point. The covariant
> derivative corrects ordinary component derivatives by adding those basis-change terms. A vector field is parallel along
> a curve when its covariant derivative along that curve is zero.

**Definition & Assumptions (§3).** Work in a coordinate chart with a chosen connection, represented locally by Christoffel symbols.

**Derive (complete).**
1. In coordinates, basis vectors can change from point to point — ordinary component derivatives miss that basis motion.
2. Define $\nabla_{\partial_i}\partial_j=\Gamma^k_{ij}\partial_k$ — Christoffel symbols record how basis vector $\partial_j$ changes in direction $\partial_i$.
3. For vector field $Y=Y^j\partial_j$, compute $\nabla_XY$ by differentiating components and adding basis-change corrections — both sources affect the tangent vector.
4. Along a curve $\gamma$, a vector field $V$ is parallel when $\nabla_{\gamma'}V=0$ — it changes only as needed to remain consistently transported.
5. A geodesic is the special case $V=\gamma'$ — its own velocity is parallel transported.

**Symbols.** $\nabla$ is the connection; $X,Y,V$ are vector fields; $\partial_i$ are coordinate basis vectors; $\Gamma^k_{ij}$ are Christoffel symbols; $\gamma$ is a curve.

**Real-World Applications (§5).**
1. In polar coordinates, $\nabla_{\partial_\theta}\partial_\theta=-r\partial_r$, so at $r=2$ angular motion has radial correction $-2\partial_r$.
2. A unit-sphere triangle of area $\pi/2$ rotates a transported vector by $\pi/2$.
3. A correction $0.01$ m/s$^2$ over $10$ s changes speed by $0.1$ m/s.
4. Manifold momentum of norm $0.8$ can be combined with a transported gradient of norm $0.2$.
5. A tube with $100$ samples transports one normal frame across $99$ edges.
6. Rotation velocity $0.2$ rad/s for $0.05$ s gives an orientation update $0.01$ rad.

### `math-12-19` — The Fisher information metric  · AUTHOR derivation

**Connections (§1).**
> Riemannian metrics measure tangent vectors, and Fisher information is the metric that probability models carry
> naturally. Instead of measuring parameter changes by raw coordinate distance, it measures how much the probability
> distribution changes. This connects differential geometry with statistics and natural-gradient learning. It also
> supplies the metric used in the geometric deep learning capstone.

**Motivation & Intuition (§2).**
> A small change in a parameter can matter very differently depending on where the model is. Moving a Bernoulli
> probability by $0.01$ near $0.5$ is not the same distributional change as moving by $0.01$ near $0.99$. The Fisher
> metric captures this sensitivity through the variance of the score.
>
> The local KL expansion explains why Fisher information is geometric. It says that, to second order, the distinguishability
> between nearby distributions is measured by a quadratic form using $I(\theta)$. Natural gradients use the inverse of
> that form so parameter updates respect distributional distance rather than coordinate scale alone.

**Definition & Assumptions (§3).** Assume a differentiable probabilistic model for which the score and its second moments are well-defined.

**Derive (complete).**
1. For a model $p(x\mid\theta)$, define the score $s_\theta(x)=\nabla_\theta\log p(x\mid\theta)$ — it measures local log-probability sensitivity.
2. Define $I(\theta)=\mathbb E[s_\theta s_\theta^T]$ — averaging score outer products gives a positive semidefinite sensitivity matrix.
3. For Bernoulli parameter $p$, log likelihood is $x\log p+(1-x)\log(1-p)$.
4. Differentiate: $s_p(x)=x/p-(1-x)/(1-p)$ — one operation for each log term.
5. Square and take expectation using $P(x=1)=p$ and $P(x=0)=1-p$: $I(p)=p(1/p^2)+(1-p)(1/(1-p)^2)$.
6. Simplify to $I(p)=1/p+1/(1-p)=1/[p(1-p)]$ — combine fractions.
7. The local KL expansion is $D_{KL}(p_\theta\|p_{\theta+d\theta})\approx\tfrac12 d\theta^TI(\theta)d\theta$ — Fisher length is local distributional change.

**Symbols.** $p(x\mid\theta)$ is the model distribution; $\theta$ is the parameter; $s_\theta$ is the score; $I(\theta)$ is Fisher information; $d\theta$ is a small parameter step; $D_{KL}$ is KL divergence.

**Real-World Applications (§5).**
1. Bernoulli $p=0.2$ gives $I=1/(0.2\cdot0.8)=6.25$.
2. Natural gradient with ordinary gradient $1.5$ gives $I^{-1}g=0.16\cdot1.5=0.24$.
3. At $p=0.99$, $I=101.01$ and step $0.01$ has squared Fisher length $0.0101$.
4. If $100$ samples give information $400$, asymptotic variance is $1/400=0.0025$.
5. Fisher squared length $0.02$ gives local KL about $0.01$.
6. Gaussian mean with variance $9$ has one-sample information $1/9$, so $81$ samples give total information $9$.

### `math-12-20` — Geometric deep learning  · AUTHOR derivation · ML capstone

**Connections (§1).**
> The final lesson gathers the section's geometric tools into a machine-learning viewpoint. Manifolds provide the spaces,
> tangent spaces provide local directions, metrics measure steps, and exponential maps or retractions return tangent
> updates to valid points. Fisher information supplies a central metric for probability models. Together these ideas
> explain why geometry can change how neural networks represent data and how optimizers move through parameter spaces.

**Motivation & Intuition (§2).**
> Geometric deep learning starts from the structure of the data or parameter space. Graphs have neighborhoods, spheres
> have angular distances, groups have symmetries, probability models have Fisher geometry, and manifolds have tangent
> spaces. A model that respects this structure can use fewer arbitrary coordinate choices and more meaningful operations.
>
> Natural gradients are one concrete example. The ordinary gradient tells how loss changes under coordinate steps, while
> the metric says which steps are actually small in the geometry of the space. Solving through the metric produces a
> preconditioned direction, and a retraction or exponential map turns that tangent update back into a valid geometric
> object.

**Definition & Assumptions (§3).** Assume the parameter or data space has a metric and that tangent updates can be returned to the space by an exponential map or retraction.

**Derive (complete).**
1. Let the parameter space have metric matrix $G$ — this defines which changes are small or large.
2. A first-order loss change is $\nabla L^T\delta$ — the ordinary gradient pairs with a small step.
3. Constrain step size by metric length $\delta^TG\delta\le\epsilon^2$ — the trust region is geometric rather than Euclidean.
4. Optimize the linear decrease under this quadratic constraint — Lagrange multipliers give $\delta\propto-G^{-1}\nabla L$.
5. Therefore the natural-gradient direction is $G^{-1}\nabla L$ — the metric preconditions the ordinary gradient.
6. After a tangent step on a manifold, use an exponential map or retraction — the updated parameter must return to the valid geometric space.

**Symbols.** $G$ is the metric matrix, often Fisher information; $\nabla L$ is the ordinary loss gradient; $G^{-1}\nabla L$ is the natural gradient; $\delta$ is a tangent step; a retraction maps tangent steps back to the manifold.

**Real-World Applications (§5).**
1. Bernoulli natural gradient at $p=0.2$ with ordinary gradient $1.5$ is $0.24$, so learning rate $0.1$ moves by $0.024$.
2. Normalizing $(0.1,0.2,1)$ gives sphere retraction $(0.0976,0.1952,0.9759)$.
3. GNN neighbor scalars $4,7,10$ average to message $7$.
4. A $90^\circ$ rotation sends vector $(2,1)$ to $(-1,2)$.
5. Hyperbolic distances $0.7$ and $2.1$ give softmax probability $0.802$ for the closer relation.
6. SPD log-variances $(\ln4,\ln9)$ plus $(-0.1,0.2)$ map to variances $(3.62,10.99)$.

## Build order

1. **Mechanical pass:** fix the `math-12-03` unclosed dollar sign before any content regeneration.
2. **Metric spine:** author `math-12-15` → `math-12-16` → `math-12-17` → `math-12-19` → `math-12-20`, because this is the ML-facing arc.
3. **Surface geometry:** author `math-12-05` through `math-12-11` so first/second forms, Gaussian curvature, and mean curvature use consistent symbols.
4. **Curve geometry:** author `math-12-01` through `math-12-04` with arc length, curvature, and Frenet examples kept numerically consistent.
5. **Manifold language:** finish `math-12-12` through `math-12-14`; keep `math-12-12` explain-only and derive tangent spaces/vector fields case-by-case.
6. **Verification:** rerun the odd-dollar scan and the `python3` numeric checks; confirm exactly 20 lesson specs, 18 derivation lessons, 2 explain-only lessons, and 0 remaining LaTeX bugs in this section.
