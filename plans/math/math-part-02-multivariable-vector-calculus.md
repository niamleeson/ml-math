# Math · Part 02 — Multivariable / vector calculus  (deep-authored reference)

> **Per-section execution plan.** Load together with the master
> [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) for the four
> exposition principles (warm voice · complete step-by-step derivations · case-by-case · name every
> symbol), the fix recipe, and the Definition of Done.
> This is the **first fully-authored section** — the concrete changes per lesson, not a flag table. Every
> number was verified with sympy/numpy (`/tmp` compute log; re-run to check). It is the depth the other
> 26 sections will be brought to.

**Section:** Multivariable / vector calculus · **Lessons:** 41 · **Breadcrumb:** `Mathematics · Analysis & Calculus` · **Priority:** HIGH

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| §5 boilerplate — lessons 02-02…02-28 all ship the **same** app block (_ML model geometry · Computer graphics · Robotics · Optimization · Data visualization · Similarity search_, later _Gradient descent · Backprop · …_) | 27 / 41 |
| Templated / thin motivation ("You already have the coordinate tools…") | 27 / 41 |
| Key formula not in display form | 17 / 41 |
| Unclosed-`$` LaTeX bug | 0 / 41 |

**The core change:** every §5 below is rewritten so all six applications *use this lesson's own concept and
number*; every motivation opens on a concrete stuck-problem; and each formula gets a complete, warm,
step-by-step derivation (or is marked explain-only).

---

## Per-lesson change specs

**How to read these specs.** Each block is the *drafted content* for one lesson, in render order. **The
labels (Intuition / Derive / Symbols / Apps) are plan shorthand — the lesson never prints them.** In the app
they become flowing prose in a **plain, warm textbook voice — clear and helpful, never poetic or
attention-grabbing** (see the master's four principles):

- **Connections (§1)** — a short, welcoming paragraph that says, in plain prose, what the reader already
  knows that makes this approachable and where it leads. Never a *builds-on / used-with / leads-to* list.
- **Motivation & Intuition (§2)** — a clear explanation of the idea itself, starting from what the reader
  can already do. An explanation, not a one-line hook.
- **Definition & Assumptions (§3)** — the display formula, a **complete step-by-step derivation**
  (case-by-case — skip if there's nothing to derive), and **every symbol glossed** in plain English.
- **Real-World Applications (§5)** — six concept-specific uses with re-derivable numbers.

`math-02-13` below is written at **full prose depth as the bar for voice and completeness**; the other
entries are compressed to their *distinctive* content (the intuition's core, the derivation target, the app
list) and get expanded to the same prose and plain voice when authored.

### `math-02-01` — Points and vectors in Rⁿ  · deepen

**Connections (§1).**
> This lesson starts with the coordinate language you already use whenever you read a table of numbers. A single row of features can be treated as a point, and the same row can also be treated as a vector from the origin to that point. That small shift lets algebraic data inherit geometric ideas such as distance, length, and direction. Those ideas support the dot product, projections, embeddings, and many of the optimization pictures that come later.

**Motivation & Intuition (§2).**
> When there are only two coordinates, it is natural to draw a point on graph paper and measure how far it is from the origin. The Pythagorean theorem gives that distance by squaring the horizontal and vertical changes, adding them, and taking a square root. In higher-dimensional data there may be hundreds or thousands of coordinates, but the same measurement still works because each coordinate axis is treated as perpendicular to the others.
>
> This is why vectors are so useful for machine learning. A word embedding, an image, or a feature row can all be placed in a coordinate space, and then comparisons become geometric. Length tells you scale, distance tells you separation, and later the dot product will tell you alignment. The formulas look simple, but they are the entry point for treating data as geometry.

**Definition & Assumptions (§3).** Length from Pythagoras, generalized: $\lVert v\rVert=\sqrt{v_1^2+\dots+v_n^2}$ — build it in
  2-D, then note the same sum works in $n$-D because each new axis is perpendicular to the rest. **Symbols:** $v=\langle v_1,\dots,v_n\rangle$ components; $\lVert v\rVert$ length; $\mathbf 0$ origin.

**Real-World Applications (§5).** (1) A 768-d embedding is a point in $\mathbb R^{768}$. (2) Euclidean distance $\lVert a-b\rVert$
  as similarity: $a=(1,2,2),b=(3,0,4)\Rightarrow\sqrt{4+4+4}=3.46$. (3) One-hot vector = a corner of the unit
  cube. (4) Feature scaling changes $\lVert v\rVert$. (5) Bias trick: append a 1 to $x$. (6) Grayscale image
  as a point in $\mathbb R^{H\cdot W}$.

### `math-02-02` — The dot product  · rewrite §5 · deepen derivation

**Connections (§1).**
> This lesson builds on vectors and length, then adds the first way to compare two directions with one number. You already know how to multiply ordinary numbers; the dot product is the vector version that returns a scalar rather than another vector. It connects directly to angles, projections, similarity scores, and linear model computations. Later lessons use it inside directional derivatives, gradients, and matrix calculus.

**Motivation & Intuition (§2).**
> A vector has both size and direction, so multiplying two vectors should say something about how their directions relate. The dot product does this by multiplying matching coordinates and adding the results. If two vectors point mostly the same way, the result is positive and large; if they point against each other, it is negative; if they are perpendicular, it is zero.
>
> The geometric formula explains why this coordinate sum is meaningful. The dot product equals the product of the two lengths times the cosine of the angle between them. That makes it a similarity measure, a projection tool, and the basic computation behind a neuron pre-activation. A linear model is therefore not just algebra; it is repeatedly measuring alignment between weights and inputs.

**Definition & Assumptions (§3).** From the law of cosines on the triangle with sides $a,b,a-b$:
  1. $\lVert a-b\rVert^2=\lVert a\rVert^2+\lVert b\rVert^2-2\,a\!\cdot\!b$ (expand $ (a-b)\!\cdot\!(a-b)$).
  2. Law of cosines: $\lVert a-b\rVert^2=\lVert a\rVert^2+\lVert b\rVert^2-2\lVert a\rVert\lVert b\rVert\cos\theta$.
  3. Match the two right-hand sides ⇒ $a\!\cdot\!b=\lVert a\rVert\lVert b\rVert\cos\theta$. **Symbols:** $a\!\cdot\!b=\sum_i a_ib_i$; $\theta$ the angle; $\lVert a\rVert$ length.

**Real-World Applications (§5).** (1) **Neuron pre-activation** $w^\top x+b$: $w=(0.5,1),x=(2,3),b=-1\Rightarrow 0.5\cdot2+1\cdot3-1=3$.
  (2) **Cosine similarity** (retrieval): $a\!\cdot\!b=11,\ \cos=\tfrac{11}{3\cdot5}=0.733$. (3) **Scalar
  projection** of $a$ onto $b$: $\tfrac{a\cdot b}{\lVert b\rVert}=\tfrac{11}{5}=2.2$. (4) **Orthogonal
  features**: $(1,2)\!\cdot\!(2,-1)=0$ ⇒ decorrelated. (5) **Attention score** (pre-softmax) $q^\top k$:
  $q=(1,0,1),k=(2,1,2)\Rightarrow 4$. (6) **Work** $F\!\cdot\!d$: $F=(3,4),d=(2,0)\Rightarrow 6$.

### `math-02-03` — The cross product  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson follows the dot product by studying the other basic product available in three dimensions. The dot product returns a number that measures alignment, while the cross product returns a vector that stands perpendicular to two given vectors. That perpendicular direction is exactly what surfaces, rotations, torques, and 3-D geometry need. It also prepares the ground for surface normals, curl, and Stokes' theorem later in the section.

**Motivation & Intuition (§2).**
> In three-dimensional space, two nonparallel directions determine a plane. Many geometric tasks then need a direction that is not in that plane at all, but normal to it. The cross product produces that normal direction, with a sign chosen by the right-hand rule.
>
> Its length has an equally important meaning. The magnitude of the cross product is the area of the parallelogram spanned by the two input vectors, so half of it gives the area of the corresponding triangle. This is why the same operation appears in mesh geometry, shading, torque, and angular motion. It packages perpendicular direction and area scale into one vector.

**Definition & Assumptions (§3).** (1) Set up the determinant $a\times b=\det\begin{bmatrix}\mathbf i&\mathbf j&\mathbf k\\a_1&a_2&a_3\\b_1&b_2&b_3\end{bmatrix}$.
  (2) Expand along row 1 ⇒ $\langle a_2b_3-a_3b_2,\ a_3b_1-a_1b_3,\ a_1b_2-a_2b_1\rangle$.
  (3) Magnitude via the Lagrange identity $\lVert a\times b\rVert^2=\lVert a\rVert^2\lVert b\rVert^2-(a\!\cdot\!b)^2=\lVert a\rVert^2\lVert b\rVert^2\sin^2\theta$ ⇒ $\lVert a\times b\rVert=\lVert a\rVert\lVert b\rVert\sin\theta$ = area of the parallelogram. **Symbols:** $a\times b$ perpendicular vector; $\mathbf i,\mathbf j,\mathbf k$ axes; right-hand rule for sign.

**Real-World Applications (§5).** (1) **Surface normal** (3-D vision/shading): $a=(1,2,2),b=(3,0,4)\Rightarrow a\times b=(8,2,-6)$.
  (2) **Triangle/mesh area**: $\tfrac12\lVert a\times b\rVert=\tfrac12(10.198)=5.099$. (3) **Plane through 3
  points**: normal $=(P_2-P_1)\times(P_3-P_1)$. (4) **Polygon winding / orientation**: sign of the $z$-cross
  says CCW vs CW. (5) **Torque** $\tau=r\times F$. (6) **Angular velocity** $v=\omega\times r$.

### `math-02-04` — Lines in space  · rewrite §5 · deepen

**Connections (§1).**
> This lesson uses the vector language from the opening lessons to describe straight paths in space. In two dimensions a slope-intercept equation can describe many lines, but in three dimensions a single slope is no longer enough. A point plus a direction vector gives a more flexible description. This parametric view will reappear in curves, line integrals, ray tracing, and optimizer trajectories.

**Motivation & Intuition (§2).**
> A line in space is easiest to understand as motion from an anchor point. Start at one known point on the line, then move any real amount in a fixed direction. The parameter records how far along that direction you have traveled, so positive, negative, and zero values cover the whole line.
>
> This point-and-direction form also makes distance questions manageable. To measure how far a point is from the line, form the parallelogram between the offset vector and the line direction. Its area is base times height, and dividing by the base length leaves the perpendicular distance. The formula is a direct use of the cross product's area meaning.

**Definition & Assumptions (§3).** Parametric $r(t)=r_0+t\,v$; distance from point $P$ to the line $=\dfrac{\lVert (P-r_0)\times v\rVert}{\lVert v\rVert}$ (the cross-product area ÷ base). **Symbols:** $r_0$ anchor point; $v$ direction; $t$ parameter.

**Real-World Applications (§5).** (1) **Ray in ray-tracing** $r_0+t d$. (2) **Embedding interpolation** $r(t)=(1-t)a+tb$.
  (3) **Nearest point on a line** (projection). (4) **RANSAC residual** = point-to-line distance: $P=(3,0,0)$
  to the $z$-axis $\Rightarrow 3$. (5) **Robot linear path**. (6) **GD trajectory** as a ray in weight space.

### `math-02-05` — Planes in space  · rewrite §5 · deepen

**Connections (§1).**
> This lesson extends the idea of a line to the flat surfaces used throughout multivariable geometry. You already have the dot product as a way to test perpendicularity, and that is enough to write the equation of a plane. A plane is determined by a point on it and a normal vector to it. This becomes the geometry behind linear decision boundaries, tangent planes, and half-space constraints.

**Motivation & Intuition (§2).**
> A plane can be described by saying which directions are allowed along the surface and which direction points straight out of it. The normal vector gives that straight-out direction. Any vector that lies inside the plane must be perpendicular to the normal, so its dot product with the normal is zero.
>
> This same normal vector also gives distance from a point to the plane. The offset from the plane to the point may point partly along the plane and partly perpendicular to it. Projecting that offset onto the unit normal keeps only the perpendicular part, which is the shortest distance. This is why plane equations are so useful in classification and geometry.

**Definition & Assumptions (§3).** $n\!\cdot\!(r-r_0)=0\Rightarrow ax+by+cz=d$; distance $=\dfrac{|n\!\cdot\!P-d|}{\lVert n\rVert}$
  (project the offset onto the unit normal). **Symbols:** $n=(a,b,c)$ normal; $d$ offset; $r_0$ a point on the plane.

**Real-World Applications (§5).** (1) **SVM/logistic boundary** $w^\top x+b=0$. (2) **Point-to-plane ICP** residual (3-D
  registration). (3) **PCA hyperplane** (best-fit plane). (4) **Half-space constraint** in LP.
  (5) **Clipping plane** in graphics. (6) **Distance** of $(3,0,0)$ to $2x+2y+z=1$: $\tfrac{|6-1|}{3}=1.667$.

### `math-02-06` — Vector-valued functions  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson takes the single-variable function idea and lets the output be a whole vector. Instead of returning one height, the function returns a position with several coordinates. That makes it a natural language for paths through space, parameter trajectories, and animations. The derivative then becomes velocity, which leads into speed and arc length.

**Motivation & Intuition (§2).**
> A scalar-valued function gives one number for each input. A vector-valued function gives several numbers at once, such as the $x$, $y$, and $z$ coordinates of a moving point. As the parameter changes, those coordinates trace a curve through space.
>
> Differentiation works one coordinate at a time. The difference quotient compares two nearby positions, divides by the change in the parameter, and then takes a limit. The result is a velocity vector, and its length is the speed along the path. This makes curves analyzable with the same derivative ideas you already know.

**Definition & Assumptions (§3).** (1) $r(t)=\langle x(t),y(t),z(t)\rangle$. (2) Difference quotient
  $\tfrac{r(t+h)-r(t)}{h}$ acts componentwise. (3) Limit ⇒ $r'(t)=\langle x',y',z'\rangle$; speed $=\lVert r'\rVert$. **Symbols:** $r(t)$ position; $r'(t)$ velocity; $\lVert r'\rVert$ speed.

**Real-World Applications (§5).** (1) **Latent-space interpolation** path $r(t)$. (2) **Optimizer trajectory** $\theta(t)$ with speed
  $\lVert\theta'\rVert$. (3) **Learning-rate schedule** as a curve. (4) **Bézier/animation** curves.
  (5) **Particle/physics** trajectory. (6) **Parametric data augmentation** path.

### `math-02-07` — Space curves  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson builds on vector-valued functions by asking for the length of the path they trace. You already know how to measure straight-line distance between two points. For a curve, the strategy is to approximate it by many tiny straight segments. That limiting process becomes the arc-length integral, which later supports line integrals and path-based diagnostics.

**Motivation & Intuition (§2).**
> A curved path cannot be measured accurately by one straight segment unless the curve itself is almost straight. The standard method is to chop the parameter interval into many small pieces, measure each small chord, and add the chord lengths. As the pieces get smaller, the chords follow the curve more closely.
>
> The derivative tells you the length of each tiny segment. Over a short time interval, the displacement is approximately velocity times the time step, so its length is speed times the time step. Adding those speeds and passing to the limit gives the integral of speed. Arc length is therefore accumulated motion along the curve.

**Definition & Assumptions (§3).** (1) Chop $[a,b]$; each hop $\lVert\Delta r\rVert\approx\lVert r'(t)\rVert\Delta t$.
  (2) Sum → integral: arc length $=\int_a^b\lVert r'(t)\rVert\,dt$. **Symbols:** $s$ arc length; $r'(t)$ velocity; unit tangent $T=r'/\lVert r'\rVert$.

**Real-World Applications (§5).** (1) **Helix** $r=(\cos t,\sin t,t)$: $\lVert r'\rVert=\sqrt2$, length over $[0,2\pi]=2\sqrt2\pi\approx8.886$.
  (2) **Path length in robotics**. (3) **Training-trajectory length** (a diagnostic). (4) **Road/cable** length.
  (5) **Tangent direction** for Frenet frames. (6) **Speed profile** $\lVert r'\rVert$ over time.

### `math-02-08` — Functions of several variables  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson moves from curves to scalar functions with several inputs. You already know functions that take one input and return one output; now the input can be a vector of coordinates or parameters. The output is still a single number, such as a loss, intensity, density, or score. This is the main object studied by partial derivatives, gradients, level sets, and optimization.

**Motivation & Intuition (§2).**
> Many important quantities depend on more than one variable at a time. A model loss depends on all the weights, an image intensity depends on two pixel coordinates, and a revenue function may depend on price and spend. The function takes a point in a multidimensional domain and assigns a scalar value to it.
>
> There are two common ways to visualize this information. The graph adds one output coordinate above the input space, while level sets mark all input points with the same output value. The graph and its contours are two views of the same function. Learning both views makes later ideas like gradients and constrained optimization easier to interpret.

**Definition & Assumptions (§3).** Graph = $\{(x,f(x))\}$; a **level set** $f=c$ is the map's contour line — derive that the graph
  in $\mathbb R^{n+1}$ and the contours in $\mathbb R^n$ carry the same information. **Symbols:** $f(x_1,\dots,x_n)$; domain $\subseteq\mathbb R^n$; output a scalar.

**Real-World Applications (§5).** (1) **Loss** $L(w)$. (2) **Image** $I(x,y)$ = intensity. (3) **RBF kernel** $k(x)=e^{-\lVert x\rVert^2}$.
  (4) **Revenue** $f(\text{price},\text{spend})$. (5) **2-feature model score**. (6) **Gaussian bump** density.

### `math-02-09` — Level sets and contour maps  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson uses functions of several variables and turns their equal-output points into geometry. You have seen contour lines on maps; level sets are the same idea for any scalar function. They let a high-dimensional function be studied through slices where the value stays constant. Gradients, decision boundaries, and optimizer visualizations all rely on this picture.

**Motivation & Intuition (§2).**
> A level set collects all points where a function has one fixed value. For a height map, this gives contour lines; for a model score, it can give a decision boundary; for a loss, it gives the curves an optimizer crosses. The level set removes the output axis and shows where the same output occurs in input space.
>
> The key geometric fact is that the gradient is perpendicular to a level set. If you move along the set, the function value does not change, so the directional derivative in that tangent direction is zero. Since directional derivatives are dot products with the gradient, tangent directions must be perpendicular to the gradient. This is why gradients point across contours rather than along them.

**Definition & Assumptions (§3).** Contour $=f^{-1}(c)$; **the gradient is perpendicular to it** — moving along a contour keeps $f$
  fixed, so the directional derivative is $0$, i.e. $\nabla f\!\cdot\!u=0$ (full argument in `02-13`). **Symbols:** $f=c$ level set; $c$ the level; $\nabla f$ normal to it.

**Real-World Applications (§5).** (1) **Loss contours** in an optimizer viz. (2) **Decision boundary** = level set of the score at 0.
  (3) **Gaussian confidence ellipses** = level sets of the quadratic form. (4) **Indifference curves** (econ).
  (5) **Isolines** $f=x^2+y^2=25$ through $(3,4)$ and $(5,0)$. (6) **Equipotential** lines of a field.

### `math-02-10` — Limits in several variables  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson extends the limit idea from single-variable calculus to inputs with several coordinates. In one dimension, approaching a point means coming from the left or right. In several variables, there are many possible paths into the same point. That extra freedom makes multivariable limits more delicate and important for continuity and differentiability.

**Motivation & Intuition (§2).**
> A limit describes the value a function approaches near a point, not necessarily at the point itself. With several input variables, nearby points can approach along lines, curves, or more complicated paths. For the limit to exist, all of those approaches must settle on the same value.
>
> This path agreement is the main new issue. To disprove a limit, it is enough to find two paths that produce different limiting values. To prove one, you need an argument that controls all paths at once. This distinction matters in numerical work because formulas that look harmless along one slice may behave differently along another.

**Definition & Assumptions (§3).** Show $f(x,y)=\dfrac{xy}{x^2+y^2}$ has **no** limit at $0$: (1) along the $x$-axis
  ($y=0$) $f=0$; (2) along $y=x$, $f=\dfrac{x^2}{2x^2}=\tfrac12$. Different path values ⇒ limit fails. **Symbols:** $\lim_{(x,y)\to(a,b)}$; "along a path"; agreement across all paths.

**Real-World Applications (§5).** (1) **0/0 in softmax** near equal logits. (2) **Gradient blow-up** detection. (3) **ReLU kink**
  behavior at 0. (4) **Numerical stability** of a custom op near a singularity. (5) **Loss continuity** checks.
  (6) **Batchnorm** as variance→0 (limit sensitivity).

### `math-02-11` — Continuity in several variables  · rewrite §5 · deepen

**Connections (§1).**
> This lesson follows multivariable limits by naming the functions whose nearby behavior matches their value. You already know that continuity means no sudden break in one-variable calculus. In several variables, the same idea applies, but the limit must agree from every direction. Continuity then supports stable optimization, interpolation, and modeling assumptions.

**Motivation & Intuition (§2).**
> A continuous function is one where small input changes produce small output changes. The formal test says that the limit at a point must equal the function's actual value there. In several variables, that limit is only valid when all paths into the point agree.
>
> Continuity is weaker than differentiability but still very useful. A function can be continuous at a corner or kink even when no unique tangent plane exists there. Many machine learning functions are built from continuous pieces, which helps small parameter updates lead to controlled changes in the loss. The lesson also clarifies why continuity alone does not guarantee a gradient.

**Definition & Assumptions (§3).** $f$ continuous at $a$ iff $\lim_{x\to a}f(x)=f(a)$; contrast with `02-10`'s path-broken example. **Symbols:** limit = value; neighborhood; jump.

**Real-World Applications (§5).** (1) **Continuous loss ⇒ stable GD**. (2) **ReLU** continuous but not differentiable at 0.
  (3) **Bilinear image interpolation** continuity. (4) **Kernel** continuity. (5) **Price elasticity** smoothness.
  (6) $f=x^2+xy+2y^2$ continuous everywhere; $f(1,2)=11$ equals its limit.

### `math-02-12` — Partial derivatives  · rewrite §5 · AUTHOR derivation *(override: this has a formula)*

**Connections (§1).**
> This lesson takes the derivative idea and applies it one coordinate at a time. You already know how a derivative measures change along a line. For a function with several inputs, a partial derivative freezes all but one variable and measures the slope along that coordinate axis. These coordinate slopes are the pieces that form the gradient.

**Motivation & Intuition (§2).**
> When a function has many inputs, it is often useful to isolate one input's effect. A partial derivative does exactly that: change one variable by a tiny amount while holding the others fixed. The result answers a local sensitivity question for that one coordinate.
>
> This is the basic operation behind training many-parameter models. Each weight has a partial derivative that tells how the loss changes if that weight alone is nudged. Collecting all those partials gives a vector of sensitivities, but the partial derivative itself remains a one-variable derivative taken along an axis. That makes the concept familiar even in high dimensions.

**Definition & Assumptions (§3).** $\dfrac{\partial f}{\partial x}=\lim_{h\to0}\dfrac{f(x+h,y)-f(x,y)}{h}$; for
  $f=x^2+xy+2y^2$: expand $f(x+h,y)-f(x,y)=2xh+h^2+yh$, divide by $h$, let $h\to0$ ⇒ $f_x=2x+y$. Likewise $f_y=x+4y$. **Symbols:** $\partial$ (round-d) = "holding the others fixed"; $f_x$ shorthand.

**Real-World Applications (§5).** (1) **One weight's effect on loss** $\partial L/\partial w_i$. (2) **Backprop local derivative**.
  (3) **Finite-difference gradient check**: $[f(2.001)-f(2)]/0.001$. (4) **Image gradient** $\partial I/\partial x$
  = vertical edges. (5) **Sensitivity** of price. (6) At $(1,2)$: $f_x=4,\ f_y=9$.

### `math-02-13` — The gradient  — **full-depth model entry (this is the bar)**

**Connections (§1).** *(Plain textbook voice: what the reader already knows, and where this fits. Prose, not a bullet list.)*
> This lesson builds directly on two things you have already seen: partial derivatives, and the dot product.
> A partial derivative measures the slope of $f$ along one axis; the gradient simply collects those slopes
> into a single vector. The dot product then does the rest of the work, because the rate of change in any
> direction turns out to be a dot product with the gradient.
>
> It is worth knowing where this leads, because the gradient reappears constantly. Directional derivatives,
> tangent planes, and the Hessian are all built on it. In later topics it becomes the basis of gradient
> descent and backpropagation, and it is the central object in Lagrange multipliers. Understanding the
> gradient well now will make each of those later lessons easier.

**Motivation & Intuition (§2).**  *(Plain, clear explanation of the concept itself.)*
> A partial derivative answers a narrow question: if you change one variable and hold the others fixed, how
> fast does $f$ change? That is useful, but a function of several variables can change in any direction, not
> just along the axes. We need a single object that captures how $f$ changes in every direction at once.
>
> The gradient is that object. Consider a surface $z=f(x,y)$. The partial derivative $f_x$ is the slope in
> the $x$-direction, and $f_y$ is the slope in the $y$-direction. Collect them into one vector,
> $\nabla f=\langle f_x, f_y\rangle$. This vector has a useful property we will prove in the next section: it
> points in the direction of steepest increase of $f$, and its length $\lVert\nabla f\rVert$ is that steepest
> rate. The opposite direction, $-\nabla f$, is the direction of steepest decrease.
>
> That last fact is the reason the gradient matters so much in machine learning. Training a model means
> reducing a loss function, and $-\nabla f$ tells you the most direct way to reduce it. So although the
> gradient is defined simply, by collecting partial derivatives, it gives you the information an optimizer
> needs at every step.

**Definition & Assumptions (§3).** Display the formula $\nabla f=\big\langle \tfrac{\partial f}{\partial x},
\tfrac{\partial f}{\partial y}\big\rangle$, then the **complete 8-step derivation** of $D_uf=\nabla f\cdot u$,
steepest-ascent, and ⊥-level-sets — written out in master **E-1** (reuse verbatim). **Symbols:** $f_x=\partial
f/\partial x$ is the slope with $y$ held fixed; $\nabla f$ stacks the partials; $u$ is a *unit* direction so
directions compare fairly; $\theta$ is the angle between $u$ and $\nabla f$. **Assumptions:** partials exist;
$u$ is unit; $-\nabla f$ is the steepest *local* decrease (not global).

**Real-World Applications (§5).** The six from master **C-1**: $\nabla f(1,2)=\langle4,9\rangle$ · GD step
$(1,2)-0.1\langle4,9\rangle=(0.6,1.1)$ · $\nabla f\perp$ contour · backprop $\nabla_wL=X^\top(Xw-y)$ ·
directional rates $4$ and $9$ · saddle when $\lVert\nabla f\rVert\approx0$.

### `math-02-14` — Directional derivatives  · rewrite §5 · deepen

**Connections (§1).**
> This lesson uses the gradient from the model entry and asks for change in a chosen direction. You already know the gradient points toward steepest increase, but applications often care about a particular step direction. The directional derivative measures the rate along that direction. It is the bridge from gradients to line search, projections, and local sensitivity along feature combinations.

**Motivation & Intuition (§2).**
> A partial derivative measures change along a coordinate axis, and the gradient collects all coordinate rates. Sometimes the direction of interest is not an axis. It might be an optimizer step, a feasible motion under constraints, or a direction in image space.
>
> The directional derivative uses the gradient to answer that more specific question. Taking the dot product with a unit direction keeps the component of the gradient along that direction. If the direction aligns with the gradient, the rate is largest; if it points opposite, the rate is most negative; if it is perpendicular, the rate is zero. The unit-length assumption matters because it makes different directions comparable.

**Definition & Assumptions (§3).** $D_uf=\nabla f\!\cdot\!u$ (Move 1 of `02-13`); maximal when $u\parallel\nabla f$. **Symbols:** $u$ *unit* direction; $D_uf$ rate along $u$.

**Real-World Applications (§5).** (1) **Line-search slope** $g^\top p$. (2) **Projected-gradient** rate along a feasible direction.
  (3) **Directional finite difference**. (4) **Feature-combo sensitivity**. (5) **Edge response** along an
  orientation. (6) At $(1,2)$: toward $(1,0)\Rightarrow4$, $(0,1)\Rightarrow9$, $(0.6,0.8)\Rightarrow9.6$.

### `math-02-15` — Tangent planes  · rewrite §5 · deepen

**Connections (§1).**
> This lesson turns partial derivatives into the local flat model of a surface. You already know that a tangent line approximates a one-variable curve near a point. For a surface, the corresponding object is a tangent plane. It leads directly to linear approximation, Taylor expansion, and first-order optimization methods.

**Motivation & Intuition (§2).**
> A smooth surface may curve globally, but near one point it can be approximated by a flat plane. The partial derivatives give the slopes of that plane in the coordinate directions. Together with the surface point itself, those slopes determine the tangent plane.
>
> The tangent plane is useful because it replaces a curved function with a simple linear expression nearby. This is the first-order view used whenever a model predicts how a small parameter change will affect a loss. The normal vector to the plane also connects the surface picture back to plane geometry and shading normals.

**Definition & Assumptions (§3).** $z=f(a,b)+f_x(a,b)(x-a)+f_y(a,b)(y-b)$ — the plane through $(a,b,f(a,b))$ with the two partial slopes. **Symbols:** tangent plane; surface normal $n=(-f_x,-f_y,1)$.

**Real-World Applications (§5).** (1) **First-order Taylor** for optimization. (2) **Shading normal** $(-f_x,-f_y,1)$.
  (3) **Local linear surrogate** (LIME-style). (4) **Newton step** setup. (5) **Linearized dynamics**.
  (6) $f=x^2+xy+2y^2$ at $(1,2)$: $z=11+4(x-1)+9(y-2)$.

### `math-02-16` — Linear approximation in several variables  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson continues the tangent-plane idea and writes it as a practical approximation formula. You already have the gradient as a vector of local slopes. Multiplying it by a small input change predicts the corresponding output change. This first-order approximation becomes a standard tool for sensitivity analysis, trust regions, and error estimates.

**Motivation & Intuition (§2).**
> Evaluating a complicated function exactly can be expensive, but near a known point the function often behaves almost linearly. The tangent plane gives that local linear model. Instead of recomputing the full function, you use the current value plus the gradient's predicted change.
>
> The approximation is most reliable for small steps because the terms it ignores are second order in the step size. That means halving the step tends to shrink the neglected error much faster than the step itself. This is why linear approximation is useful for local reasoning but must be treated carefully far from the base point.

**Definition & Assumptions (§3).** From the tangent plane: $f(a+\Delta)\approx f(a)+\nabla f(a)\!\cdot\!\Delta$; the
  error is $O(\lVert\Delta\rVert^2)$ (the leftover second-order Taylor term). **Symbols:** $\Delta$ small step; $\nabla f\!\cdot\!\Delta$ predicted change.

**Real-World Applications (§5).** (1) **First-order loss change** under a weight step. (2) **Error propagation** / delta method.
  (3) **Trust-region model**. (4) **Fast surrogate** of expensive $f$. (5) **Sensitivity budget**.
  (6) $f(1.1,2.1)\approx11+4(0.1)+9(0.1)=12.30$ vs true $12.34$.

### `math-02-17` — The multivariable chain rule  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson extends the chain rule to functions with several intermediate variables. You already know that derivatives multiply through a one-variable composition. In multivariable settings, one upstream change can reach the output through several paths. Adding those path contributions is the core mechanism behind backpropagation.

**Motivation & Intuition (§2).**
> A composed function often has an outside function depending on intermediate quantities, and those intermediate quantities depend on an earlier variable. When the earlier variable changes, each intermediate changes, and each of those changes affects the final output. The total derivative must collect every route by which the change travels.
>
> The multivariable chain rule expresses this as a weighted sum. Each partial derivative of the outside function measures sensitivity to one intermediate, and each derivative of the intermediate measures how the upstream variable affects it. In vector form this becomes a dot product or a Jacobian multiplication. Autodiff systems are built around applying this rule repeatedly.

**Definition & Assumptions (§3).** For $z=f(x(t),y(t))$: (1) total change $dz=f_x\,dx+f_y\,dy$; (2) divide by $dt$ ⇒
  $\dfrac{dz}{dt}=f_x\dfrac{dx}{dt}+f_y\dfrac{dy}{dt}$; (3) vector form $\dfrac{dz}{dt}=\nabla f\!\cdot\!\dfrac{dr}{dt}$; many inputs ⇒ multiply by the Jacobian. **Symbols:** intermediate $x,y$; upstream $t$; sum over paths.

**Real-World Applications (§5).** (1) **Backpropagation** (the whole algorithm). (2) **Reparameterization gradient** (VAE).
  (3) **JVP/VJP** in autodiff. (4) **Backprop-through-time** (RNN). (5) **Change-of-variable density**.
  (6) $z=x^2+y^2$, $x=t,y=t^2$: $\tfrac{dz}{dt}=2t+4t^3$; at $t=1\Rightarrow6$.

### `math-02-18` — The Jacobian matrix  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson generalizes the derivative to vector-output functions. You already know the gradient for a scalar output; a vector output has one scalar component for each row. The Jacobian stacks the gradients of all components into a matrix. This is the local linear map used in coordinate changes, robotics, normalizing flows, and autodiff.

**Motivation & Intuition (§2).**
> When a function returns several outputs, a single gradient is not enough. Each output can respond differently to each input variable. The Jacobian records all of those partial derivatives in a rectangular matrix, with rows corresponding to outputs and columns to inputs.
>
> Near a point, the Jacobian acts like the best linear approximation to the function. A small input displacement is multiplied by the Jacobian to predict the output displacement. This is why Jacobians appear in forward kinematics and in neural network layers. They are the multivariable derivative written in the language of linear maps.

**Definition & Assumptions (§3).** Stack the partials: $J_{ij}=\dfrac{\partial F_i}{\partial x_j}$; then
  $F(a+\Delta)\approx F(a)+J\Delta$ is the best local linear map (each row is one output's gradient). **Symbols:** $J\in\mathbb R^{m\times n}$; rows = output gradients.

**Real-World Applications (§5).** (1) **Layer local linearization** in backprop. (2) **VJP/JVP** primitives. (3) **Change of
  variables** (needs $\det J$). (4) **Forward kinematics** (robotics). (5) **Normalizing-flow** Jacobian.
  (6) $F=(x^2y,\,x+y)$: $J(1,2)=\begin{bmatrix}4&1\\1&1\end{bmatrix}$, $\det=3$.

### `math-02-19` — Higher-order partial derivatives  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson studies what happens after taking partial derivatives more than once. You already know second derivatives measure how slopes change. In several variables, there are pure second partials and mixed second partials. The equality of mixed partials under mild smoothness conditions is what makes Hessian matrices symmetric.

**Motivation & Intuition (§2).**
> A first partial derivative measures slope in one coordinate direction. Taking another partial derivative measures how that slope changes as another coordinate moves. When the two coordinates are different, the result is a mixed partial derivative.
>
> For sufficiently smooth functions, differentiating first in one variable and then the other gives the same answer as doing the order in reverse. This is Clairaut's theorem. The result is not just a computational shortcut; it explains the symmetry of the Hessian and simplifies curvature analysis. Most smooth losses used in calculus-based optimization are designed to live in this setting.

**Definition & Assumptions (§3).** **Clairaut's theorem**: if $f_{xy},f_{yx}$ are continuous then $f_{xy}=f_{yx}$; verify on
  $f=x^2+xy+2y^2$: $f_{xy}=\partial_y(2x+y)=1=\partial_x(x+4y)=f_{yx}$. **Symbols:** $f_{xy}=\partial^2 f/\partial y\partial x$; mixed partial.

**Real-World Applications (§5).** (1) **Symmetric Hessian**. (2) **Curvature** of a surface. (3) **PDE stencils** (2nd-order).
  (4) **Second-order optimization**. (5) **Mixed sensitivity** $\partial^2L/\partial w_i\partial w_j$.
  (6) **Gaussian-curvature** setup (`02` → diff-geo).

### `math-02-20` — The Hessian matrix  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson collects second partial derivatives into the matrix that describes local curvature. You already have the gradient for local slope and higher-order partials for how those slopes change. The Hessian organizes those curvature measurements in one object. It leads to Newton's method, convexity tests, and saddle-point classification.

**Motivation & Intuition (§2).**
> The gradient tells the direction of first-order change, but it does not say whether the surface is bending upward, downward, or differently in different directions. The Hessian supplies that second-order information. Each entry tells how one component of the gradient changes as one input coordinate changes.
>
> The quadratic form built from the Hessian measures curvature along a displacement. If it is positive in every direction, the surface bends like a bowl; if negative in every direction, like a dome; if mixed, like a saddle. Eigenvalues make this directional behavior precise. This is why curvature, conditioning, and second-order optimization all use the Hessian.

**Definition & Assumptions (§3).** (1) Collect second partials $H_{ij}=\partial^2f/\partial x_i\partial x_j$
  (symmetric by `02-19`). (2) Second-order model $f(a+\Delta)\approx f(a)+g^\top\Delta+\tfrac12\Delta^\top H\Delta$.
  (3) The sign of $\Delta^\top H\Delta$ (eigenvalues of $H$) decides min/max/saddle. **Symbols:** $H=\nabla^2f$; eigenvalues $\lambda_i$; quadratic form $\Delta^\top H\Delta$.

**Real-World Applications (§5).** (1) **Newton step** $-H^{-1}g$. (2) **Convexity test** $H\succeq0$. (3) **Condition number**
  $\lambda_{\max}/\lambda_{\min}$ sets GD speed. (4) **Saddle detection** (indefinite). (5) **Sharpness**
  of a minimum (generalization). (6) $f=x^2+xy+2y^2$: $H=\begin{bmatrix}2&1\\1&4\end{bmatrix}$, eigenvalues
  $3\pm\sqrt2\approx1.586,\,4.414>0$ ⇒ convex bowl.

### `math-02-21` — Multivariable Taylor expansion  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson combines the gradient and Hessian into a local polynomial model. You already know one-variable Taylor expansion as a way to approximate a function near a point. In several variables, the step direction is a vector, so the first-order term uses the gradient and the second-order term uses the Hessian. This quadratic model underlies Newton methods, trust regions, and curvature-based uncertainty.

**Motivation & Intuition (§2).**
> A complicated smooth function can often be understood locally by keeping only its most important terms near a base point. The constant term gives the value at the base point. The gradient term predicts linear change, and the Hessian term adds the leading curvature correction.
>
> One clean way to derive the formula is to restrict the function to a line through the base point. Along that line, ordinary one-variable Taylor expansion applies. Translating the derivatives of that line function back into multivariable notation gives the gradient dot product and the Hessian quadratic form. The result is a compact local model for many algorithms.

**Definition & Assumptions (§3).** Apply the 1-D Taylor of $g(s)=f(a+s\Delta)$ at $s=0$: $g(0)+g'(0)+\tfrac12g''(0)$
  with $g'(0)=\nabla f\!\cdot\!\Delta$, $g''(0)=\Delta^\top H\Delta$ ⇒ $f(a+\Delta)\approx f(a)+\nabla f^\top\Delta+\tfrac12\Delta^\top H\Delta$. **Symbols:** first-order term $\nabla f^\top\Delta$; second-order $\tfrac12\Delta^\top H\Delta$.

**Real-World Applications (§5).** (1) **Newton / second-order optimization**. (2) **Laplace approximation** of a posterior.
  (3) **Trust-region** subproblem. (4) **Gauss–Newton / LM**. (5) **Uncertainty via curvature**.
  (6) For a quadratic it's *exact*: $f(1+\Delta)=11+(4,9)\Delta+\tfrac12\Delta^\top\begin{bmatrix}2&1\\1&4\end{bmatrix}\Delta$.

### `math-02-22` — Unconstrained optimization & critical points  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson applies gradients and Hessians to the basic problem of finding optima without constraints. You already know a one-variable minimum has derivative zero when it occurs at an interior smooth point. In several variables, every directional derivative must vanish, which means the gradient is zero. The Hessian then helps classify what kind of critical point was found.

**Motivation & Intuition (§2).**
> At a local minimum, there should be no small direction in which moving decreases the function. If one direction had a negative directional derivative, a small step that way would lower the value. The opposite direction rules out positive directional derivatives as well, so all local directional rates must be zero.
>
> Since directional derivatives are dot products with the gradient, the only vector perpendicular to every direction is the zero vector. Thus interior smooth optima must be critical points. That condition is necessary, not sufficient: saddles and maxima can also have zero gradient. The Hessian supplies the next layer of information needed for classification.

**Definition & Assumptions (§3).** At a local min every directional derivative is $\ge0$ and its negative also $\ge0$
  ⇒ $D_uf=\nabla f\!\cdot\!u=0$ for all $u$ ⇒ $\nabla f=0$; then classify with $H$ (`02-24`). **Symbols:** critical point $\nabla f=0$; classification via $H$.

**Real-World Applications (§5).** (1) **Training stationarity** (convergence check $\lVert\nabla f\rVert<\varepsilon$). (2) **Normal
  equations**: $\nabla\lVert Xw-y\rVert^2=0\Rightarrow X^\top Xw=X^\top y$. (3) **MLE** score $=0$.
  (4) **Saddle-heavy DL** landscapes. (5) **Ridge** stationary point. (6) $f=x^2+xy+2y^2$: $\nabla f=0\Rightarrow(0,0)$, $H\succ0$ ⇒ min, $f=0$.

### `math-02-23` — Saddle points  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson focuses on critical points that are not minima or maxima. You already know the Hessian records curvature in different directions. A saddle point has upward curvature in some directions and downward curvature in others. This distinction is especially important in high-dimensional optimization landscapes.

**Motivation & Intuition (§2).**
> A zero gradient can make a point look stationary, but stationary does not mean optimal. At a saddle, first-order change vanishes, yet nearby directions behave differently. Moving one way increases the function while moving another way decreases it.
>
> The Hessian detects this through mixed-sign eigenvalues. Along an eigenvector with positive eigenvalue, the quadratic model bends upward; along one with negative eigenvalue, it bends downward. That combination prevents the point from being a local minimum or maximum. In optimization, negative-curvature directions can provide escape routes from such points.

**Definition & Assumptions (§3).** With $\nabla f=0$, look at $\Delta^\top H\Delta$: if $H$ has **mixed-sign
  eigenvalues** it's positive along one eigenvector and negative along another ⇒ saddle. Example $f=x^2-y^2$:
  $H=\mathrm{diag}(2,-2)$. **Symbols:** indefinite $H$; escape direction = negative-eigenvalue eigenvector.

**Real-World Applications (§5).** (1) **DL loss saddles**. (2) **SGD noise escapes saddles**. (3) **GAN saddle equilibria**.
  (4) **PCA** as a saddle problem on the sphere. (5) **Minimax** saddle. (6) $f=x^2-y^2$: eigenvalues $2,-2$ ⇒ saddle at $0$.

### `math-02-24` — Definiteness & the second-derivative test  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson turns Hessian eigenvalues into a classification rule for critical points. You already know the one-variable second-derivative test. The multivariable version checks curvature in every direction, not just along one axis. Definiteness is the language for making that all-directions statement precise.

**Motivation & Intuition (§2).**
> At a critical point, the linear term in Taylor's expansion disappears, so the second-order term becomes the leading local behavior. That term is the Hessian quadratic form. Its sign across all nonzero directions determines the shape near the point.
>
> If the quadratic form is always positive, the surface rises in every small direction and the point is a local minimum. If it is always negative, the surface falls in every small direction and the point is a local maximum. If it has both signs, the point is a saddle. Eigenvalues make this test practical because diagonalizing the Hessian separates the independent curvature directions.

**Definition & Assumptions (§3).** $\Delta^\top H\Delta=\sum_i\lambda_i(\,q_i^\top\Delta)^2$ (diagonalize $H$): all
  $\lambda_i>0$ ⇒ positive for every $\Delta$ ⇒ **min**; all $<0$ ⇒ **max**; mixed ⇒ **saddle**. **Symbols:** positive-definite $H\succ0$; eigenvalues $\lambda_i$.

**Real-World Applications (§5).** (1) **Convexity certificate**. (2) **Newton safeguarding** (fix non-PD $H$). (3) **Covariance PSD**
  check. (4) **Kernel/Gram matrix** PD (valid kernel). (5) **GP** validity. (6) $\mathrm{diag}(2,200)\succ0$ ⇒ min;
  $\mathrm{diag}(2,-2)$ indefinite ⇒ saddle.

### `math-02-25` — Lagrange multipliers  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson adds equality constraints to optimization. You already know that an unconstrained optimum has zero gradient because all directions are available. With a constraint, only tangent directions along the constraint are allowed. Lagrange multipliers express the condition that the objective has no improving component along those feasible directions.

**Motivation & Intuition (§2).**
> A constrained optimum must lie on the constraint surface. At that point, you cannot move in every direction; you can only move along directions that keep the constraint satisfied to first order. These feasible directions are tangent to the constraint surface and perpendicular to the constraint gradient.
>
> If the objective could increase or decrease along one of those tangent directions, the point would not be optimal under the constraint. Therefore the objective gradient must have no tangential component. The only remaining direction is normal to the constraint surface, so the objective gradient must be parallel to the constraint gradient. The scalar of proportionality is the Lagrange multiplier.

**Definition & Assumptions (§3).** On $g=0$, feasible moves are tangent ($\nabla g\!\cdot\!u=0$). At an optimum no feasible
  move improves $f$ ⇒ $\nabla f\!\cdot\!u=0$ for all such $u$ ⇒ $\nabla f$ has no tangential part ⇒ $\nabla f=\lambda\nabla g$. **Symbols:** multiplier $\lambda$; constraint $g=0$; parallel gradients.

**Real-World Applications (§5).** (1) **SVM dual** (max margin under constraints). (2) **Max-entropy ⇒ softmax**. (3) **Constrained
  MLE**. (4) **Portfolio** with a budget line. (5) **Equality-constrained least squares**. (6) $\max xy$ s.t.
  $x+y=10$: $(y,x)=\lambda(1,1)\Rightarrow x=y=5,\ \lambda=5,\ f=25$.

### `math-02-26` — Double integrals  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson extends the definite integral from intervals to regions in the plane. You already know a one-variable integral accumulates area under a curve. A double integral accumulates values over many tiny area patches. It is the basic tool for 2-D probability, image averages, centroids, and planar mass.

**Motivation & Intuition (§2).**
> To integrate over a region in the plane, divide the region into small rectangles or other tiny patches. On each patch, the function is nearly constant, so its contribution is approximately value times area. Adding all contributions and refining the grid gives the double integral.
>
> Fubini's theorem makes many double integrals practical. Under suitable conditions, the two-dimensional accumulation can be computed as two ordinary one-dimensional integrals, one inside the other. This turns area-based accumulation into repeated familiar calculus. The region and the order of integration carry the geometry of the problem.

**Definition & Assumptions (§3).** Grid the region, sum $f(x_i,y_j)\,\Delta A$, refine ⇒ $\iint_R f\,dA$; **Fubini** lets
  you do it as two 1-D integrals. **Symbols:** $dA=dx\,dy$; iterated integral; region $R$.

**Real-World Applications (§5).** (1) **2-D probability** $P((X,Y)\in R)=\iint p$. (2) **Expected value** $\iint xy\,p$.
  (3) **Marginalization** $\int p(x,y)\,dy$. (4) **Image average intensity** over a patch. (5) **Centroid/area**.
  (6) $\iint_{[0,1]^2}(x+y)\,dA=1$; $\iint xy=\tfrac14$.

### `math-02-27` — Triple integrals  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson takes the same accumulation idea into three-dimensional solids. You already know double integrals over planar regions. Triple integrals add values over small volume elements instead. They are used for densities, voxel data, mass, charge, and normalization over solid regions.

**Motivation & Intuition (§2).**
> A triple integral divides a solid into many tiny boxes. The function's value on each box is multiplied by the box's volume, and those contributions are summed. As the boxes shrink, the sum approaches the total accumulation over the solid.
>
> The computation is often written as three iterated one-variable integrals. Each limit describes how the solid is swept out in one coordinate direction. This keeps the idea close to the double integral while adding one more dimension. The main new work is describing the region accurately.

**Definition & Assumptions (§3).** Refine a 3-D grid: $\iiint_V f\,dV$, iterated as three 1-D integrals. **Symbols:** $dV=dx\,dy\,dz$; solid $V$.

**Real-World Applications (§5).** (1) **3-D probability** over a region. (2) **Voxel/3-D conv** aggregation. (3) **Mass/charge**.
  (4) **Moment of inertia**. (5) **Normalizing a 3-D density**. (6) $\iiint_{[0,1]^3}xyz\,dV=\tfrac18$; $\iiint 1=1$.

### `math-02-28` — Change of variables  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson connects integration with coordinate transformations. You already have the Jacobian as the local linear map of a transformation. When coordinates change, small areas or volumes are stretched by the determinant of that map. The change-of-variables formula accounts for that stretch so integrals keep the same total meaning.

**Motivation & Intuition (§2).**
> Changing coordinates can make a region or integrand much simpler. Polar coordinates, for example, describe disks more naturally than rectangular coordinates. But a small rectangle in the new coordinates may not have the same area after it is mapped into the original coordinates.
>
> The Jacobian determinant supplies the correction factor. Its absolute value measures how much tiny area or volume is scaled by the transformation. Multiplying by that factor ensures the integral accumulates the right amount in the original space. This same idea is central in normalizing flows, where density changes are tracked through invertible maps.

**Definition & Assumptions (§3).** A tiny box $dx\,dy$ maps to a parallelogram of area $|\det J|\,du\,dv$ (the Jacobian
  columns are its edges) ⇒ $\iint f\,dA=\iint (f\circ g)\,|\det J|\,du\,dv$. **Symbols:** $J=\partial(x,y)/\partial(u,v)$; $|\det J|$ area scale.

**Real-World Applications (§5).** (1) **Normalizing flows**: $p_x(x)=p_z(z)\,|\det \partial z/\partial x|$. (2) **Polar/spherical**
  integration. (3) **Reparameterization** $z=\mu+\sigma\epsilon$. (4) **Gaussian integral** via polar.
  (5) **Whitening** transform. (6) Polar Jacobian $=r$; area of unit disk $=\int_0^{2\pi}\!\!\int_0^1 r\,dr\,d\theta=\pi$.

---

## Tail lessons `math-02-29` … `math-02-41` — full specs

These are not §5-boilerplate, but they get the same full treatment as the rest for consistency.

### `math-02-29` — The Jacobian determinant  · deepen

**Connections (§1).**
> This lesson isolates the area-scaling part of the change-of-variables formula. You already know the Jacobian matrix gives the local linear approximation to a transformation. The determinant of that matrix tells how the local grid cell changes in size and orientation. This makes it essential for invertibility, coordinate changes, and density transformations.

**Motivation & Intuition (§2).**
> Near a point, a smooth transformation behaves almost like its Jacobian matrix. The columns of that matrix show where the coordinate basis directions are sent. In two dimensions, those image vectors span a small parallelogram; in three dimensions, they span a small parallelepiped.
>
> The determinant measures the signed area or volume scale of that linear image. Its absolute value tells how much size changes, while its sign records whether orientation is preserved or flipped. If the determinant is zero, the transformation collapses local area or volume, so it cannot be locally invertible in the usual smooth way. This is why the determinant carries both geometric and analytic information.

**Definition & Assumptions (§3).** 1. Near a point, a map $F$ acts like its Jacobian $J$ (from `02-18`). 2. $J$ sends the unit square's edge vectors to the columns of $J$. 3. The area of the parallelogram they span is $|\det J|$ — the geometric meaning of a $2\times2$ determinant. 4. So a small region of area $dA$ maps to one of area $|\det J|\,dA$. 5. The sign of $\det J$ is positive if the edge vectors keep their orientation and negative if they flip. **Symbols:** $J=\partial(x,y)/\partial(u,v)$ Jacobian matrix; $\det J$ its determinant; $|\det J|$ area/volume scale.

**Real-World Applications (§5).** (1) Change-of-variables area factor (used in `02-28`). (2) Normalizing-flow log-density adds $\log|\det J|$. (3) Invertibility of a layer requires $\det J\neq0$. (4) For $F=(x^2y,x+y)$, $\det J(1,2)=3$ so areas triple near $(1,2)$. (5) A rotation has $\det J=1$ (area-preserving). (6) A reflection has $\det J=-1$ (orientation flipped).

### `math-02-30` — Cylindrical coordinates  · deepen

**Connections (§1).**
> This lesson introduces coordinates adapted to an axis. You already know polar coordinates for the plane. Cylindrical coordinates keep that polar description in the horizontal plane and add an ordinary height coordinate. They are useful whenever the geometry repeats around an axis.

**Motivation & Intuition (§2).**
> A point in cylindrical coordinates is described by a radius from the central axis, an angle around that axis, and a height. This matches cylinders, pipes, rotating flows, and many axially symmetric regions. Instead of describing a round object with awkward rectangular bounds, the coordinate system follows the shape.
>
> The volume element includes the same radius factor that appears in polar area. As the radius grows, a small change in angle sweeps a longer arc, so the corresponding patch has larger area. Multiplying the polar area element by height thickness gives the cylindrical volume element. That factor is the main adjustment needed when integrating.

**Definition & Assumptions (§3).** 1. Use polar coordinates in the plane: $x=r\cos\theta$, $y=r\sin\theta$, and keep $z$. 2. The planar area element is $r\,dr\,d\theta$ (the polar Jacobian). 3. Multiplying by $dz$ gives the volume element $dV=r\,dr\,d\theta\,dz$. **Symbols:** $r$ radius from the axis; $\theta$ angle; $z$ height; $dV$ volume element.

**Real-World Applications (§5).** (1) A cylinder of radius $1$, height $2$ has volume $\int_0^2\!\int_0^{2\pi}\!\int_0^1 r\,dr\,d\theta\,dz=2\pi$. (2) Axially-symmetric density integration. (3) 3-D histogram bins around an axis. (4) CT/MRI reconstruction geometry. (5) Rotational-flow fields. (6) Pipe/annulus volumes.

### `math-02-31` — Spherical coordinates  · deepen

**Connections (§1).**
> This lesson introduces coordinates adapted to a center. You already know cylindrical coordinates for axis symmetry. Spherical coordinates describe position by distance from the origin and two angles, which fits balls, shells, radial densities, and directions on a sphere. The volume element records how shells grow with radius and how latitude circles shrink near the poles.

**Motivation & Intuition (§2).**
> A point in spherical coordinates is located by first choosing a radius, then choosing a direction using two angles. This is natural for problems where distance from the origin matters more than separate $x$, $y$, and $z$ coordinates. Balls and isotropic distributions become much easier to describe.
>
> The volume element has two geometric factors. The $r^2$ factor reflects that spherical shells have area growing like radius squared. The $\sin\phi$ factor reflects that circles of constant polar angle are smaller near the poles. Together these factors make sure integration in spherical coordinates counts actual volume correctly.

**Definition & Assumptions (§3).** 1. Write $x=r\sin\phi\cos\theta$, $y=r\sin\phi\sin\theta$, $z=r\cos\phi$. 2. Compute the Jacobian determinant of this map. 3. It equals $r^2\sin\phi$, so $dV=r^2\sin\phi\,dr\,d\phi\,d\theta$; the $r^2$ is why volume grows fast with radius and $\sin\phi$ accounts for shrinking longitude circles near the poles. **Symbols:** $r$ radius; $\phi$ polar angle from the $z$-axis; $\theta$ azimuth; $dV$ volume element.

**Real-World Applications (§5).** (1) Unit-ball volume $\int_0^{2\pi}\!\int_0^{\pi}\!\int_0^1 r^2\sin\phi\,dr\,d\phi\,d\theta=\tfrac43\pi\approx4.19$. (2) Normalizing a 3-D isotropic Gaussian. (3) Solid-angle integrals. (4) Direction embeddings on the sphere $S^2$. (5) Radial basis functions. (6) Gravitational/Coulomb potentials.

### `math-02-32` — Vector fields  · explain-only

**Connections (§1).**
> This lesson introduces the object that divergence, curl, and line integrals act on. You already know scalar functions assign one number to each point. A vector field assigns a whole vector to each point instead. That lets calculus describe flows, forces, gradients, and directions that vary across space.

**Motivation & Intuition (§2).**
> A vector field can be pictured as an arrow attached to every point in a region. The arrow might show velocity in a fluid, force on a particle, or the direction a loss decreases most rapidly. The important feature is that the vector changes with position.
>
> There is no theorem to prove in this lesson because the goal is to name and understand the object. Once a field is defined, later operations ask different questions about it: divergence measures spreading, curl measures rotation, and line or surface integrals measure accumulation along paths or across surfaces. The field is the common input to all of those ideas.

**Definition & Assumptions (§3).** explain-only — this introduces an object, not a theorem. **Symbols:** $F(x,y)=\langle P,Q\rangle$ or $F(x,y,z)=\langle P,Q,R\rangle$; each component is a scalar function of position.

**Real-World Applications (§5).** (1) The **negative-gradient field** $-\nabla L$ that gradient descent follows. (2) Fluid velocity fields. (3) Electric/force fields. (4) Image gradient fields in vision. (5) Wind/flow visualization. (6) The score $\nabla_x\log p(x)$ field in diffusion models.

### `math-02-33` — Divergence  · deepen

**Connections (§1).**
> This lesson studies one of the two basic local measurements of a vector field. You already know a vector field assigns a vector to each point. Divergence asks whether the field is locally flowing outward, inward, or neither. It connects vector calculus to conservation laws, probability flow, and the Laplacian.

**Motivation & Intuition (§2).**
> Imagine a tiny box around a point in a vector field. If more flow leaves the box than enters it, the point behaves like a source. If more enters than leaves, it behaves like a sink. Divergence measures that net outward flow per unit volume.
>
> The formula adds the coordinate-wise rates at which each field component expands in its own direction. Positive divergence indicates local spreading; negative divergence indicates local compression; zero divergence indicates incompressible behavior at that point. This local quantity becomes global through the divergence theorem and appears throughout PDEs and flow models.

**Definition & Assumptions (§3).** 1. Consider flux out of a tiny box around a point. 2. The net outflow in the $x$-direction is $\partial P/\partial x$ times the box volume, and similarly for $y,z$. 3. Summing and dividing by the volume gives $\nabla\!\cdot\!F=\partial P/\partial x+\partial Q/\partial y+\partial R/\partial z$. **Symbols:** $\nabla\!\cdot\!F$ divergence (a scalar); $P,Q,R$ field components.

**Real-World Applications (§5).** (1) Fokker–Planck probability-flow term. (2) Continuity equation (mass conservation). (3) $\nabla\!\cdot\!\nabla f=\Delta f$ the Laplacian. (4) For $F=(x^2,xy,z)$, $\nabla\!\cdot\!F=3x+1$, at $(1,1,1)$ equals $4$. (5) Source/sink detection in flows. (6) Incompressible fields have $\nabla\!\cdot\!F=0$.

### `math-02-34` — Curl  · deepen

**Connections (§1).**
> This lesson gives the other basic local measurement of a vector field. You already know divergence measures spreading out or compressing in. Curl measures local rotation. It prepares the way for conservative fields, vorticity, Maxwell-type equations, and Stokes' theorem.

**Motivation & Intuition (§2).**
> A vector field can move around a point in a way that tends to spin a tiny paddle wheel. Curl measures that local spinning tendency. In three dimensions, rotation can happen around different axes, so curl is itself a vector whose direction gives the axis of rotation.
>
> The components of curl come from circulation in the coordinate planes. Each component compares how one field component changes across the perpendicular coordinate with how the other component changes back. When these imbalances are nonzero, the field has local rotational structure. When curl vanishes on a suitable region, the field may come from a potential function.

**Definition & Assumptions (§3).** 1. Measure circulation around a tiny loop in each coordinate plane. 2. Circulation per unit area in the $xy$-plane is $\partial Q/\partial x-\partial P/\partial y$. 3. Stacking the three plane components gives $\nabla\times F=\langle R_y-Q_z,\,P_z-R_x,\,Q_x-P_y\rangle$. **Symbols:** $\nabla\times F$ curl (a vector); subscripts denote partial derivatives.

**Real-World Applications (§5).** (1) Conservative-field test: $\nabla\times F=0$ means a potential exists. (2) Vorticity in fluids. (3) Helmholtz decomposition. (4) For $F=(-y,x,0)$, $\nabla\times F=(0,0,2)$ — uniform rotation. (5) Maxwell's equations. (6) Detecting rotational structure in flow data.

### `math-02-35` — Line integrals  · deepen

**Connections (§1).**
> This lesson combines vector fields with paths. You already know arc length adds scalar contributions along a curve. A line integral of a vector field adds the field's component in the direction of travel. This gives the mathematical form of work, circulation, and path-dependent cost.

**Motivation & Intuition (§2).**
> As a particle moves along a curve, a vector field may help, oppose, or be perpendicular to the motion at each point. The dot product with the small displacement keeps only the component of the field along the path. Adding those components over the whole path gives the line integral.
>
> Parametrization turns the geometric path into an ordinary integral in one variable. The velocity vector supplies the small displacement direction and scale. For conservative fields, the integral depends only on endpoints; for more general fields, the path itself matters. This distinction becomes important in Green's and Stokes' theorems.

**Definition & Assumptions (§3).** 1. Break the path into small steps $d\mathbf r$. 2. Work over each step is $F\!\cdot\!d\mathbf r$. 3. Parametrize by $t$: $d\mathbf r=\mathbf r'(t)\,dt$. 4. Sum to an integral: $\int_C F\!\cdot\!d\mathbf r=\int_a^b F(\mathbf r(t))\!\cdot\!\mathbf r'(t)\,dt$. **Symbols:** $C$ path; $\mathbf r(t)$ parametrization; $F\!\cdot\!d\mathbf r$ infinitesimal work.

**Real-World Applications (§5).** (1) Work done by a force along a path. (2) Path-dependent cost/energy. (3) Circulation $\oint F\!\cdot\!d\mathbf r$. (4) For conservative $F=(y,x)$ (potential $xy$), work from $(0,0)$ to $(2,3)$ is $6$, independent of path. (5) Recovering a potential from its field. (6) Arc-length integrals as a special case.

### `math-02-36` — Green's theorem  · AUTHOR derivation

**Connections (§1).**
> This lesson relates a closed curve in the plane to the region it encloses. You already know line integrals measure circulation along a path, and double integrals accumulate values over a region. Green's theorem says these two views are connected. It is the planar prototype for Stokes' theorem.

**Motivation & Intuition (§2).**
> A vector field can circulate around the boundary of a region because of rotational behavior inside the region. Green's theorem makes this precise by converting the boundary circulation into an area integral of a curl-like scalar. It lets you compute a boundary quantity from interior information, or the other way around.
>
> The theorem also explains several practical area formulas. With a carefully chosen field, the line integral around a curve returns the area inside it. More broadly, it shows how local rotation accumulates into total circulation around the boundary. This boundary-interior relationship is one of the central themes of vector calculus.

**Definition & Assumptions (§3).** 1. State $\oint_{\partial R}(P\,dx+Q\,dy)=\iint_R\big(\tfrac{\partial Q}{\partial x}-\tfrac{\partial P}{\partial y}\big)\,dA$. 2. For a vertically simple region, integrate $-\partial P/\partial y$ over $y$ and apply the fundamental theorem of calculus to recover the top/bottom boundary pieces of $\oint P\,dx$. 3. Do the symmetric argument for $Q$ over $x$. 4. Add the two results to get the full identity. **Symbols:** $\partial R$ boundary curve (counterclockwise); $P,Q$ field components; $dA$ area element.

**Real-World Applications (§5).** (1) Area from boundary: $\tfrac12\oint(x\,dy-y\,dx)=\mathrm{Area}$. (2) For $\oint(-y\,dx+x\,dy)$ on the unit disk the value is $2\,\mathrm{Area}=2\pi$. (3) Planimeter instruments. (4) 2-D circulation = integral of curl. (5) Image moments from contours. (6) Shoelace polygon-area formula as the discrete case.

### `math-02-37` — Surface integrals  · deepen

**Connections (§1).**
> This lesson extends integration from curves and flat regions to curved surfaces. You already know a double integral adds values over a planar region. A surface integral adds values over a two-dimensional surface that may bend in space. It prepares the surface-area element needed for flux and the divergence theorem.

**Motivation & Intuition (§2).**
> To integrate over a curved surface, describe the surface with two parameters. Small changes in those parameters create two tangent vectors on the surface. Their cross product gives the area of the tiny parallelogram patch they span.
>
> The surface integral multiplies the scalar value on each patch by that patch's area and adds over the whole surface. The formula looks like a double integral because the parameter domain is two-dimensional, but the area factor corrects for stretching and bending in space. This is the surface analogue of the Jacobian correction in coordinate changes.

**Definition & Assumptions (§3).** 1. Parametrize the surface by two parameters $\mathbf r(u,v)$. 2. A small patch has area $\lVert \mathbf r_u\times\mathbf r_v\rVert\,du\,dv$ (the cross product gives the patch's area). 3. Integrate: $\iint_S f\,dS=\iint f(\mathbf r(u,v))\lVert \mathbf r_u\times\mathbf r_v\rVert\,du\,dv$. **Symbols:** $S$ surface; $dS$ surface-area element; $\mathbf r_u,\mathbf r_v$ tangent vectors.

**Real-World Applications (§5).** (1) Total radiance/irradiance over a surface. (2) Surface area of a sphere of radius $2$ is $4\pi(2)^2\approx50.27$. (3) Mass of a curved sheet. (4) Setting up flux (next lesson). (5) Rendering integrals in graphics. (6) Heat radiated from a surface.

### `math-02-38` — Flux  · deepen

**Connections (§1).**
> This lesson uses surface integrals to measure how a vector field crosses a surface. You already know a vector field has direction and magnitude at each point, and a surface has a normal direction. Flux keeps the field's component normal to the surface. It is the language of flow through boundaries, heat transfer, and Gauss-type laws.

**Motivation & Intuition (§2).**
> A field may pass through a surface, slide along it, or point partly through and partly along. Only the normal component contributes to throughput across the surface. The dot product with the unit normal extracts that component.
>
> Multiplying the normal component by a small area patch gives the amount of flow through that patch. Integrating over the surface gives total flux. The sign depends on the chosen normal direction, so orientation matters. This idea is the surface counterpart of work along a path, where the dot product keeps the component along motion.

**Definition & Assumptions (§3).** 1. Take the field's component along the surface normal, $F\!\cdot\!\mathbf n$. 2. Multiply by patch area $dS$ to get flow through the patch. 3. Integrate: flux $=\iint_S F\!\cdot\!\mathbf n\,dS$. **Symbols:** $\mathbf n$ unit normal; $F\!\cdot\!\mathbf n$ normal component; flux is a scalar.

**Real-World Applications (§5).** (1) Probability flux across a boundary. (2) Heat flux through a wall. (3) Electric flux (Gauss's law). (4) A uniform field $F=(0,0,1)$ through a unit disk in the plane $z=1$ (normal $\mathbf k$) has flux $=$ area $=\pi$. (5) Mass flow rate through a pipe cross-section. (6) Radiative flux in rendering.

### `math-02-39` — Stokes' theorem  · AUTHOR derivation

**Connections (§1).**
> This lesson lifts Green's theorem from flat regions to surfaces in space. You already know curl measures local rotation and line integrals measure circulation around a path. Stokes' theorem says boundary circulation equals total curl passing through any surface with that boundary. It ties local rotational behavior to a global loop integral.

**Motivation & Intuition (§2).**
> A vector field may circulate around the edge of a surface because of curl distributed across the surface. Stokes' theorem adds the normal component of curl over the surface and shows that this equals the circulation around the boundary. The exact shape of the spanning surface does not matter when the boundary and orientation are fixed under the theorem's assumptions.
>
> The cancellation idea is central. If the surface is divided into many small patches, neighboring patches traverse their shared edges in opposite directions, so those interior contributions cancel. Only the outer boundary remains. This is the same boundary-interior pattern seen in Green's theorem, now in three-dimensional geometry.

**Definition & Assumptions (§3).** 1. State $\oint_{\partial S}F\!\cdot\!d\mathbf r=\iint_S(\nabla\times F)\!\cdot\!\mathbf n\,dS$. 2. Tile $S$ with tiny patches; on each, Green's theorem (in the tangent plane) equates the patch's boundary circulation to $(\nabla\times F)\!\cdot\!\mathbf n$ times its area. 3. Sum over patches: interior edges are traversed twice in opposite directions and cancel. 4. Only the outer boundary $\partial S$ survives, giving the identity. **Symbols:** $\partial S$ boundary curve; $\nabla\times F$ curl; $\mathbf n$ surface normal.

**Real-World Applications (§5).** (1) Circulation equals vorticity flux in fluids. (2) Ampère's law in electromagnetism. (3) Conservative fields ($\nabla\times F=0$) have zero circulation on every loop. (4) Reduces to Green's theorem for a flat surface. (5) Wing lift from circulation. (6) Consistency checks for learned vector fields.

### `math-02-40` — The divergence theorem  · AUTHOR derivation

**Connections (§1).**
> This lesson gives the three-dimensional counterpart to Green's theorem for outflow. You already know divergence measures local source strength and flux measures flow through a surface. The divergence theorem says total source strength inside a region equals total flux out through its boundary. It is a central mathematical form of conservation.

**Motivation & Intuition (§2).**
> Divergence is a local measurement: it tells how much a field spreads out from a tiny box around a point. Flux through a closed surface is global: it measures how much field leaves the whole region. The divergence theorem states that adding all the local divergence inside exactly accounts for the boundary flux.
>
> The proof idea is a cancellation argument. Split the region into many small boxes. Flux through shared interior faces cancels because the neighboring boxes use opposite outward normals. Only the flux through the outside boundary remains. This is why the theorem is so useful for deriving conservation laws and checking flow calculations.

**Definition & Assumptions (§3).** 1. State $\iiint_V\nabla\!\cdot\!F\,dV=\oiint_{\partial V}F\!\cdot\!\mathbf n\,dS$. 2. Divide $V$ into tiny boxes; for each, divergence times volume equals net flux out of that box (the definition of divergence). 3. Sum over boxes: shared interior faces cancel because their outward normals are opposite. 4. Only the outer surface $\partial V$ remains. **Symbols:** $V$ solid region; $\partial V$ its closed boundary surface; $\mathbf n$ outward normal.

**Real-World Applications (§5).** (1) Conservation of probability mass. (2) Gauss's law relating charge to flux. (3) Continuity equations. (4) Flux of $F=(x,y,z)$ (divergence $3$) out of the unit ball is $3\cdot\tfrac43\pi=4\pi\approx12.57$. (5) Heat balance in a region. (6) Deriving PDEs from conservation laws.

### `math-02-41` — Matrix calculus for ML  · AUTHOR derivation — **section ML capstone**

**Connections (§1).**
> This capstone lesson translates the vector-calculus derivative ideas into the notation used for machine learning models. You already know gradients of scalar functions and Jacobians of vector-valued maps. Matrix calculus writes those derivatives compactly when parameters, data, and residuals are stored in vectors and matrices. It connects this section directly to regression, backpropagation, and second-order methods.

**Motivation & Intuition (§2).**
> Machine learning losses are usually scalar functions of many parameters. Writing one partial derivative at a time is possible but quickly becomes unreadable. Matrix calculus keeps the whole gradient in one expression, using transposes and matrix products to show how residuals flow back to parameters.
>
> The squared-error example is the standard model. Expanding the loss reveals a quadratic form in the weight vector, and differentiating that quadratic gives the gradient used in least squares and gradient descent. The same rules extend to linear layers, ridge penalties, Mahalanobis distances, and Gauss-Newton approximations. The notation is compact because it matches the linear algebra of the computation itself.

**Definition & Assumptions (§3).** 1. Expand the squared error $\lVert Xw-y\rVert^2=(Xw-y)^\top(Xw-y)$. 2. Multiply out: $w^\top X^\top Xw-2y^\top Xw+y^\top y$. 3. Differentiate term by term with respect to $w$: $\nabla(w^\top X^\top Xw)=2X^\top Xw$ and $\nabla(-2y^\top Xw)=-2X^\top y$. 4. Combine: $\nabla_w\lVert Xw-y\rVert^2=2X^\top(Xw-y)$. 5. Separately, for a quadratic form, $\nabla_x\,x^\top Ax=(A+A^\top)x$, which is $2Ax$ when $A$ is symmetric. **Symbols:** $X$ data matrix; $w$ weight vector; $y$ targets; $X^\top(Xw-y)$ residual projected onto features; $A$ a square matrix.

**Real-World Applications (§5).** (1) Normal equations: set $\nabla=0\Rightarrow X^\top Xw=X^\top y$. (2) For $X=\begin{bmatrix}1&0\\1&1\\0&1\end{bmatrix}$, $w=(1,1)$, $y=(1,2,2)$: residual $Xw-y=(0,0,-1)$, gradient $2X^\top(Xw-y)=(0,-2)$. (3) Ridge regression gradient $2X^\top(Xw-y)+2\lambda w$. (4) Backprop of a linear layer uses $\partial L/\partial W=\delta\,x^\top$. (5) Mahalanobis distance gradient $\nabla_x\,x^\top A x=2Ax$ for symmetric $A$. (6) Gauss–Newton uses $X^\top X$ as the curvature.

---

## Build order for this section

1. **Motivation + §5 rewrite** for `02-02…02-28` (kills 27/27 boilerplate) — start with `02-13` (has the
   master exemplar), then the gradient family `02-12,14,15,16,17,20,22,25`, then the rest.
2. **AUTHOR derivations** for the 28 lessons flagged AUTHOR (see specs); **deepen** the 12 with a cue.
3. **Promote inline formulas to display** on the 17 flagged lessons; add the symbol gloss.
4. Capstone `02-41` (matrix calculus) last — it ties the whole section to backprop/regression.
