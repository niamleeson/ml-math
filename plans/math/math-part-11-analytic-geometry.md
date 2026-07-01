# Math · Part 11 — Analytic geometry  (deep-authored reference)

> **Per-section execution plan.** Load together with the master
> [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) for the four
> exposition principles: warm voice, complete step-by-step derivations, case-by-case judgment, and named
> symbols. Numbers below were checked with `python3` + `numpy` from the repository root on 2026-07-01.

**Section:** Analytic geometry · **Lessons:** 18 · **Breadcrumb:** `Mathematics · Geometry & Topology` · **Priority:** STANDARD (targeted deepening)

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| §5 boilerplate (shared app-set with a sibling) | 0 / 18 |
| Templated / thin motivation (stock opener or ≤45 words) | 1 / 18 |
| Key formula not in display form ($$…$$) | 9 / 18 |
| Unclosed dollar-delimiter LaTeX bug | 0 / 18 |
| Derivation to author or deepen | 17 / 18 |
| Explain-only, by case-by-case judgment | 1 / 18 |

## Priority & systemic issues

- No whole-section §5 boilerplate block is present. The work is not a boilerplate cleanup; it is a depth pass.
- Keep applications geometry-focused. Dot and cross product overlap Part 02, so this section should emphasize conics, distances, projections, transformations, planes, and decision boundaries rather than general ML vector calculus.
- Promote central formulas into display form and add complete derivations where the lesson has a real formula.
- `math-11-18` is already strong in the master scan. Use it as the full-prose model entry and match or exceed the current treatment by deriving classification, boundary distance, and SVM geometric margin.
- LaTeX bug scan: no genuine unclosed dollar delimiter or lost matrix row-break bug found in this section.

## Model entry (full prose)

### `math-11-18` — Hyperplanes and decision boundaries  — **full-depth model entry**

**Connections (§1).** *(Plain textbook voice: what the learner already knows, and where this fits.)*
> Earlier lessons in this section describe lines, planes, distances, projections, and normal vectors. A
> hyperplane uses those same ideas in any number of dimensions. In two dimensions it is a line. In three
> dimensions it is a plane. In higher-dimensional feature space it is still the same object: a flat set with
> a normal direction.
>
> This lesson connects analytic geometry directly to linear classifiers. A logistic regression model,
> perceptron, or linear SVM computes an affine score $w\cdot x+b$. The decision boundary is the set of
> points where that score is exactly zero. The sign tells which side a point is on, and the distance formula
> tells how far the point lies from the boundary.

**Motivation & Intuition (§2).** *(Complete prose for the section voice bar.)*
> A line in the plane can split the plane into two half-planes. The equation $2x-y-3=0$ is the boundary
> itself. Points with $2x-y-3>0$ lie on one side, and points with $2x-y-3<0$ lie on the other. The vector
> $(2,-1)$ is perpendicular to the boundary, so moving in that normal direction changes the score fastest.
>
> A hyperplane is the same idea with more coordinates. The vector $w$ stores the normal direction, $x$ is
> the point being classified, and $b$ shifts the boundary away from the origin. The score $w\cdot x+b$ is a
> signed quantity: positive on one side, negative on the other, and zero on the boundary.
>
> The size of the raw score depends on the scale of $w$. Doubling both $w$ and $b$ doubles every score but
> leaves the boundary unchanged. For geometry, divide by $\lVert w\rVert$. That turns the score into a true
> Euclidean distance from the point to the hyperplane. This is why SVMs distinguish a functional margin
> $y(w\cdot x+b)$ from a geometric margin $y(w\cdot x+b)/\lVert w\rVert$.

**Definition & Assumptions (§3).** Display the formula
$$
H=\{x\in\mathbb R^n: w\cdot x+b=0\},
\qquad
\operatorname{dist}(x,H)=\frac{|w\cdot x+b|}{\lVert w\rVert}.
$$
For an SVM label $y\in\{-1,1\}$, display
$$
\gamma_{\text{functional}}=y(w\cdot x+b),
\qquad
\gamma_{\text{geometric}}=\frac{y(w\cdot x+b)}{\lVert w\rVert}.
$$
Then derive it completely:
1. Choose any point $x_0$ on the hyperplane, so $w\cdot x_0+b=0$; this gives a known anchor on the boundary.
2. Subtract the two scores: $(w\cdot x+b)-(w\cdot x_0+b)=w\cdot(x-x_0)$; the bias cancels because it shifts both scores equally.
3. Replace the boundary score with zero: $w\cdot x+b=w\cdot(x-x_0)$; the score measures the offset from the boundary in the normal direction.
4. Make the normal unit length: $u=w/\lVert w\rVert$; distances along a direction require a unit direction.
5. Project the offset onto the unit normal: $u\cdot(x-x_0)=\dfrac{w\cdot(x-x_0)}{\lVert w\rVert}$; projection gives signed perpendicular distance.
6. Substitute Step 3: $u\cdot(x-x_0)=\dfrac{w\cdot x+b}{\lVert w\rVert}$; this is signed distance.
7. Take absolute value for ordinary distance: $\operatorname{dist}(x,H)=\dfrac{|w\cdot x+b|}{\lVert w\rVert}$; distance is nonnegative.
8. For a labeled SVM point, multiply by $y$ before dividing: $\gamma=\dfrac{y(w\cdot x+b)}{\lVert w\rVert}$; correctly classified points have positive margin.

**Worked problem.** A classifier has $w=(2,-1)$ and $b=-3$. For $x=(4,2)$, the score is
$2\cdot4+(-1)\cdot2-3=3$, so the point is on the positive side. The boundary distance is
$|3|/\sqrt{2^2+(-1)^2}=3/\sqrt5\approx1.342$. With label $y=1$, the functional margin is $3$ and the
geometric margin is $3/\sqrt5\approx1.342$.

**Symbols.** $x$ is the feature point; $w$ is the nonzero normal vector; $b$ is the bias or offset; $H$ is the hyperplane; $y$ is the class label in $\{-1,1\}$; $\lVert w\rVert$ is the Euclidean length of the normal; $\gamma$ is a margin. Assumptions: $w\ne0$; distances use the Euclidean norm; multiplying $w$ and $b$ by the same positive constant leaves the boundary but not the raw score unchanged.

**Real-World Applications (§5).** (1) **Linear classifier sign.** With $s=1.5x_1-0.5x_2+1$, point $(2,4)$ gives $3-2+1=2$, so it is on the positive side. (2) **Boundary distance.** For $w=(2,-1)$, $b=-3$, and $x=(4,2)$, the distance is $3/\sqrt5\approx1.342$. (3) **SVM maximum margin.** If $\lVert w\rVert=5$ and the closest functional margin is $1$, the geometric margin is $1/5=0.2$. (4) **Distance-based confidence.** Scores $0.5$ and $2.0$ with $\lVert w\rVert=2$ have boundary distances $0.25$ and $1.0$. (5) **Multiclass linear boundary.** If $s_1=2x+1$ and $s_2=-x+4$, the class-switch boundary solves $2x+1=-x+4$, so $x=1$. (6) **Feature-map boundary.** In features $(x,x^2)$, the linear boundary $x^2-4=0$ becomes two original-input decision points, $x=-2$ and $x=2$.

---

## Per-lesson change specs

**How to read these specs.** Each block is drafted content for one lesson in render order. The labels
(Intuition / Derive / Symbols / Apps) have been expanded into flowing prose in a plain,
warm textbook voice.

### `math-11-01` — Cartesian coordinates  · explain-only · promote display

**Connections (§1).**
> This lesson begins the analytic geometry section with the basic language of location. The reader already knows how a number line marks positions with numbers; Cartesian coordinates do the same thing in two or more independent directions at once. Once points can be named by coordinates, later lessons can measure distances, draw lines, describe planes, and build geometric models for data.

**Motivation & Intuition (§2).**
> Cartesian coordinates turn location into an ordered list of numbers. In the plane, the first number measures horizontal position and the second measures vertical position. The origin is the reference point where both measurements are zero, and the axes show the directions in which each coordinate changes while the other is held fixed.
>
> The order matters because each coordinate has a different role. The point $(2,5)$ is not the same as $(5,2)$: one moves $2$ units in the first direction and $5$ in the second, while the other reverses those movements. Adding a third coordinate gives space: $(x,y,z)$ records three independent measurements, such as right-left, forward-back, and up-down.

**Definition & Assumptions (§3).** This lesson is explain-only because Cartesian coordinates are a naming system for points, not a formula with a hidden proof.
Explain-only. Cartesian coordinates are a naming system for points, not a formula with a hidden proof. Explain axes, origin, ordered pairs, ordered triples, and why changing order changes the point.

**Symbols.** $(x,y)$ is a point in the plane; $(x,y,z)$ is a point in space; the origin is $(0,0)$ or $(0,0,0)$; each axis measures one coordinate while the other coordinates are held fixed.

**Real-World Applications (§5).** (1) **Image locations.** Pixel $(12,8)$ means column $12$, row $8$. (2) **Bounding boxes.** Corners $(2,3)$ and $(7,9)$ give width $7-2=5$ and height $9-3=6$. (3) **Map offsets.** Coordinate $(4,-2)$ means $4$ units east and $2$ units south of the origin. (4) **Data plotting.** A point $(4,11)$ can encode spend $4$ and clicks $11$. (5) **Quadrant signs.** Point $(-3,5)$ lies in Quadrant II because $x<0$ and $y>0$. (6) **3-D asset placement.** Point $(2,5,1)$ is $2$ units right, $5$ units forward, and $1$ unit up.

### `math-11-02` — Polar coordinates  · deepen

**Connections (§1).**
> Cartesian coordinates describe a point by horizontal and vertical movement. Polar coordinates describe the same point by distance and direction. This gives a second coordinate language that is especially useful whenever circles, angles, rotations, or radial measurements are more natural than rectangular movement.

**Motivation & Intuition (§2).**
> A point in the plane can be reached by walking straight out from the origin a distance $r$ while facing an angle $\theta$ from the positive $x$-axis. That description is polar form. It keeps the radial part and the angular part separate, so a circle centered at the origin can be described by one constant number, $r$.
>
> To connect polar coordinates back to ordinary graphing, drop a perpendicular from the point to the $x$-axis. The resulting right triangle has hypotenuse $r$, adjacent side $x$, and opposite side $y$. Trigonometry then translates distance and angle into rectangular coordinates, while the distance formula and a quadrant-aware angle recover $r$ and $\theta$ from $(x,y)$.

**Definition & Assumptions (§3).** Convert between rectangular and polar coordinates:
1. Start with a point whose distance from the origin is $r$ and angle is $\theta$.
2. Drop a perpendicular to the $x$-axis, forming a right triangle.
3. The adjacent side is $x$, so $\cos\theta=x/r$; multiply by $r$ to get $x=r\cos\theta$.
4. The opposite side is $y$, so $\sin\theta=y/r$; multiply by $r$ to get $y=r\sin\theta$.
5. Square and add: $x^2+y^2=r^2(\cos^2\theta+\sin^2\theta)$; the identity makes this $x^2+y^2=r^2$.
6. Take the nonnegative square root: $r=\sqrt{x^2+y^2}$.
7. Use the quadrant-aware angle $\theta=\operatorname{atan2}(y,x)$; this avoids confusing opposite quadrants.

**Symbols.** $r$ is radial distance, $r\ge0$; $\theta$ is angle from the positive $x$-axis; $(x,y)$ are Cartesian coordinates; $\operatorname{atan2}$ returns the angle with the correct quadrant.

**Real-World Applications (§5).** (1) **Circle parameterization.** $r=5$, $\theta=53.13^\circ$ gives $(x,y)\approx(3,4)$. (2) **Point conversion.** $(-3,3)$ has $r=\sqrt{18}\approx4.243$ and $\theta=135^\circ$. (3) **Radar reading.** A target at $r=10$, $\theta=30^\circ$ is at $(8.660,5.000)$. (4) **Circular crop.** Point $(6,8)$ has $r=10$, so it lies on a radius-$10$ circle. (5) **Angle binning.** Point $(0,-2)$ has $\theta=-90^\circ$ or $270^\circ$. (6) **Spiral path.** If $r=2\theta$ and $\theta=3$, then $r=6$.

### `math-11-03` — Distance and midpoints  · deepen

**Connections (§1).**
> After coordinates name points, the next step is to compare points. Distance tells how far apart two coordinate locations are, and the midpoint names the point exactly halfway between them. These ideas support later formulas for circles, projections, nearest neighbors, and geometric margins.

**Motivation & Intuition (§2).**
> Two points in the plane determine a horizontal change and a vertical change. Those changes form the legs of a right triangle, with the straight-line distance as the hypotenuse. The Pythagorean theorem therefore turns coordinate differences into Euclidean distance.
>
> The midpoint uses a different but related idea: halfway progress in each coordinate direction. To be halfway from $A$ to $B$, the $x$-coordinate must be halfway from $x_1$ to $x_2$, and the $y$-coordinate must be halfway from $y_1$ to $y_2$. Averaging the coordinates gives that balanced location.

**Definition & Assumptions (§3).** For $A=(x_1,y_1)$ and $B=(x_2,y_2)$:
1. The horizontal change is $\Delta x=x_2-x_1$; this is one leg of the right triangle.
2. The vertical change is $\Delta y=y_2-y_1$; this is the other leg.
3. Apply Pythagoras: $d^2=(\Delta x)^2+(\Delta y)^2$.
4. Take the nonnegative square root: $d=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$.
5. A midpoint has equal coordinate progress from both endpoints, so $M_x=x_1+\tfrac12(x_2-x_1)=\tfrac{x_1+x_2}{2}$.
6. Do the same vertically: $M_y=\tfrac{y_1+y_2}{2}$.

**Symbols.** $A,B$ are endpoints; $d$ is Euclidean distance; $M$ is the midpoint; $\Delta x,\Delta y$ are coordinate changes.

**Real-World Applications (§5).** (1) **Segment measurement.** From $(1,2)$ to $(7,10)$, distance is $\sqrt{6^2+8^2}=10$. (2) **Center of a segment.** The same endpoints have midpoint $(4,6)$. (3) **Nearest neighbor in a map.** Distances from $(0,0)$ to $(3,4)$ and $(6,8)$ are $5$ and $10$, so $(3,4)$ is nearer. (4) **Collision radius.** Centers $(2,1)$ and $(5,5)$ are $5$ units apart; two radius-$3$ circles overlap because $5<6$. (5) **Screen layout.** The midpoint between button corners $(20,10)$ and $(80,50)$ is $(50,30)$. (6) **Local GPS approximation.** A $0.3$ km east and $0.4$ km north offset has straight-line length $0.5$ km.

### `math-11-04` — Lines in the plane  · AUTHOR derivation

**Connections (§1).**
> Lines are the first flat objects described by coordinate equations. The reader has already seen points, coordinate changes, and distance; a line adds the idea of a constant direction through the plane. This lesson also prepares for planes and hyperplanes, where normal-vector equations play the same role in higher dimensions.

**Motivation & Intuition (§2).**
> A line can be understood as a path that keeps the same rise for each unit of run. Slope records that constant rate of change. If one point on the line is known, keeping the same slope from that point to every other point gives the point-slope equation.
>
> The same line can also be described by moving all terms to one side. In the equation $ax+by+c=0$, the pair $(a,b)$ acts as a normal direction, perpendicular to the line. This form is especially useful for testing which side of a line a point lies on and for extending the idea to planes and decision boundaries.

**Definition & Assumptions (§3).** From two points $P_1=(x_1,y_1)$ and $P_2=(x_2,y_2)$:
1. The run is $x_2-x_1$ and the rise is $y_2-y_1$.
2. Define slope as rise per run: $m=\dfrac{y_2-y_1}{x_2-x_1}$, assuming $x_2\ne x_1$.
3. Any point $(x,y)$ on the same line has the same rise/run from $P_1$: $\dfrac{y-y_1}{x-x_1}=m$.
4. Multiply by $x-x_1$: $y-y_1=m(x-x_1)$; this is point-slope form.
5. Expand: $y=mx+(y_1-mx_1)$; call the constant $b$ to get $y=mx+b$.
6. Move all terms to one side: $mx-y+b=0$; this is the standard form $ax+by+c=0$.

**Symbols.** $m$ is slope; $b$ is vertical intercept; $(x_1,y_1)$ is a known point; $a,b,c$ in $ax+by+c=0$ define a normal-vector form, with normal $(a,b)$.

**Real-World Applications (§5).** (1) **Trend line through two points.** Points $(0,1)$ and $(2,5)$ give $m=2$ and line $y=2x+1$. (2) **Prediction on a line.** On $y=2x+1$, input $x=3$ gives $y=7$. (3) **Intersection.** Lines $y=2x+1$ and $y=-x+5$ meet at $x=4/3$, $y=11/3$. (4) **Vertical line.** All points with $x=4$ lie on the vertical line through $(4,0)$ and $(4,7)$. (5) **Road grade.** Rise $6$ over run $100$ gives slope $0.06$. (6) **Line-side test.** For $2x-y+1=0$, point $(1,5)$ gives $2-5+1=-2$, so it is on the negative side.

### `math-11-05` — Vectors  · AUTHOR derivation

**Connections (§1).**
> Vectors use coordinates to describe movement rather than fixed position. The same coordinate differences that appeared in distance formulas now become objects that can be added, scaled, and measured. This prepares for dot products, cross products, projections, lines in space, and geometric transformations.

**Motivation & Intuition (§2).**
> A vector records a displacement: how far to move in each coordinate direction. It may be drawn with its tail at many different starting points because its meaning is the movement itself, not the absolute location of the drawing. Moving from $A$ to $B$ is therefore described by subtracting the starting coordinates from the ending coordinates.
>
> Vector operations follow the independence of coordinate directions. Adding vectors combines their horizontal parts and their vertical parts separately. Scaling a vector stretches or reverses the displacement. Measuring its length brings us back to the distance formula, and dividing by that length gives a unit vector with the same direction.

**Definition & Assumptions (§3).** For a displacement from $A=(x_1,y_1)$ to $B=(x_2,y_2)$:
1. Subtract starting coordinates from ending coordinates: $v=B-A=(x_2-x_1,y_2-y_1)$.
2. Add displacements coordinatewise because horizontal and vertical moves are independent: $(a,b)+(c,d)=(a+c,b+d)$.
3. Scale a displacement by multiplying each coordinate: $\lambda(a,b)=(\lambda a,\lambda b)$.
4. Its length is the distance from the origin to its tip: $\lVert v\rVert=\sqrt{v_x^2+v_y^2}$.
5. A unit vector keeps direction but has length $1$: $\hat v=v/\lVert v\rVert$, assuming $v\ne0$.

**Symbols.** $v$ is a vector; $v_x,v_y$ are components; $\lambda$ is a scalar; $\lVert v\rVert$ is length; $\hat v$ is a unit vector.

**Real-World Applications (§5).** (1) **Displacement.** From $(1,2)$ to $(4,6)$, the vector is $(3,4)$ with length $5$. (2) **Resultant motion.** Moves $(2,-1)$ and $(-3,5)$ add to $(-1,4)$. (3) **Unit direction.** Vector $(3,4)$ has unit vector $(0.6,0.8)$. (4) **Half-step.** Half of $(8,-2)$ is $(4,-1)$. (5) **Polygon edge.** Edge from $(2,3)$ to $(5,1)$ is $(3,-2)$. (6) **Velocity update.** Position $(10,4)$ plus velocity $(1.5,-0.5)$ for $2$ seconds gives $(13,3)$.

### `math-11-06` — The dot product  · AUTHOR derivation · geometry-focused

**Connections (§1).**
> Vectors have length and direction, and the dot product turns two vectors into one number that measures how their directions relate. This lesson connects coordinate multiplication with geometric alignment. It also gives the main tool for perpendicularity, projections, plane equations, and distance-to-boundary formulas later in the section.

**Motivation & Intuition (§2).**
> The dot product is large and positive when two vectors point in similar directions, zero when their directions are perpendicular, and negative when they point partly against each other. In coordinates, it is computed by multiplying matching components and adding. Geometrically, it measures how much of one vector lies along the other.
>
> The link between the coordinate formula and the angle formula comes from comparing two ways to compute the same side of a triangle. The vector $a-b$ is the side connecting the tips of $a$ and $b$. Expanding its squared length with dot products and also using the law of cosines shows that the dot product must equal the product of the lengths times $\cos\theta$.

**Definition & Assumptions (§3).** Derive the geometric formula from the law of cosines:
1. Start with the triangle whose sides are $a$, $b$, and $a-b$.
2. Expand the squared length algebraically: $\lVert a-b\rVert^2=(a-b)\cdot(a-b)=\lVert a\rVert^2-2a\cdot b+\lVert b\rVert^2$.
3. Apply the law of cosines to the same triangle: $\lVert a-b\rVert^2=\lVert a\rVert^2+\lVert b\rVert^2-2\lVert a\rVert\lVert b\rVert\cos\theta$.
4. Set the two right-hand sides equal because they describe the same length.
5. Cancel $\lVert a\rVert^2+\lVert b\rVert^2$ from both sides.
6. Divide by $-2$ to get $a\cdot b=\lVert a\rVert\lVert b\rVert\cos\theta$.

**Symbols.** $a\cdot b=\sum_i a_ib_i$; $\theta$ is the angle between vectors; $\lVert a\rVert$ is length; $\cos\theta$ converts alignment into a scalar.

**Real-World Applications (§5).** (1) **Angle between directions.** $a=(3,4)$ and $b=(5,0)$ give $a\cdot b=15$, so $\cos\theta=15/(5\cdot5)=0.6$ and $\theta\approx53.13^\circ$. (2) **Scalar projection.** The projection of $(3,4)$ onto $(5,0)$ has length $15/5=3$. (3) **Perpendicular check.** $(2,-1)\cdot(1,2)=0$, so the directions are perpendicular. (4) **Lighting.** A unit normal $(0,0,1)$ and light direction $(0,0,0.8)$ give brightness $0.8$. (5) **Obtuse turn.** $(1,0)\cdot(-2,1)=-2$, so the angle is obtuse. (6) **Similarity of arrows.** Unit vectors with dot product $0.25$ have angle $\arccos(0.25)\approx75.52^\circ$.

### `math-11-07` — The cross product  · deepen · geometry-focused

**Connections (§1).**
> The dot product measures alignment with a scalar. The cross product answers a different geometric need in three dimensions: it builds a perpendicular direction. This is the natural language for surface normals, oriented turns, triangle area, and plane construction.

**Motivation & Intuition (§2).**
> In 3-D, two nonparallel vectors determine a flat parallelogram. A vector perpendicular to that parallelogram gives its normal direction, and its length can store the parallelogram area. The cross product packages both pieces: direction by the right-hand rule and length by the area spanned by the two input vectors.
>
> The coordinate formula may look longer than the dot product, but it is built to satisfy two simple constraints. The result must be perpendicular to $a$ and also perpendicular to $b$. Expanding the determinant gives components arranged so that dotting with either input cancels to zero, and Lagrange's identity confirms the area formula.

**Definition & Assumptions (§3).** For $a=(a_1,a_2,a_3)$ and $b=(b_1,b_2,b_3)$:
1. Seek a vector $c=(c_1,c_2,c_3)$ perpendicular to both $a$ and $b$.
2. The determinant construction gives the vector with those perpendicularity constraints:
   $a\times b=\det\begin{bmatrix}\mathbf i&\mathbf j&\mathbf k\\a_1&a_2&a_3\\b_1&b_2&b_3\end{bmatrix}$.
3. Expand along the first row: $a\times b=(a_2b_3-a_3b_2,\,a_3b_1-a_1b_3,\,a_1b_2-a_2b_1)$.
4. Dot the result with $a$; terms cancel in pairs, giving $a\cdot(a\times b)=0$.
5. Dot the result with $b$; terms cancel again, giving $b\cdot(a\times b)=0$.
6. Use Lagrange's identity: $\lVert a\times b\rVert^2=\lVert a\rVert^2\lVert b\rVert^2-(a\cdot b)^2=\lVert a\rVert^2\lVert b\rVert^2\sin^2\theta$.
7. Take the nonnegative square root: $\lVert a\times b\rVert=\lVert a\rVert\lVert b\rVert\sin\theta$, the parallelogram area.

**Symbols.** $a\times b$ is the cross product; $\mathbf i,\mathbf j,\mathbf k$ are coordinate unit vectors; $\theta$ is the angle between $a$ and $b$; direction follows the right-hand rule.

**Real-World Applications (§5).** (1) **Surface normal.** $a=(1,2,2)$ and $b=(3,0,4)$ give $a\times b=(8,2,-6)$. (2) **Triangle area.** The triangle spanned by those vectors has area $\tfrac12\sqrt{104}\approx5.099$. (3) **Parallelogram area.** The same pair spans area $\sqrt{104}\approx10.198$. (4) **2-D orientation.** For edges $(2,0)$ and $(0,3)$, the $z$-cross is $6$, so the turn is counterclockwise. (5) **Plane normal.** Points $(0,0,0)$, $(1,0,0)$, and $(0,2,0)$ have normal $(0,0,2)$. (6) **Degenerate triangle.** Vectors $(1,1,1)$ and $(2,2,2)$ have cross product $(0,0,0)$, so the area is $0$.

### `math-11-08` — Lines in 3D  · AUTHOR derivation

**Connections (§1).**
> A line in the plane can be described by slope, but space has more than one possible sideways direction. The vector language from earlier lessons gives a cleaner description. A 3-D line is built from an anchor point and a direction vector, and this same form is used for rays, motion paths, and interpolation.

**Motivation & Intuition (§2).**
> To move along a line in space, start at a known point and take some scalar number of steps in one fixed direction. The parameter $t$ records how many copies of the direction vector have been taken. Positive, negative, and fractional values of $t$ move to different points on the same infinite line.
>
> Distance from a point to a 3-D line is easiest to see through area. The vector from the line's anchor to the outside point and the direction vector form a parallelogram. Its area is also base times height, where the height is the perpendicular distance to the line. Dividing the cross-product area by the base length gives the distance formula.

**Definition & Assumptions (§3).** For anchor $r_0$ and nonzero direction $v$:
1. A point on the line starts at $r_0$.
2. Moving $t$ copies of the direction vector gives $r(t)=r_0+t v$.
3. For a point $P$, the vector from the line anchor to the point is $P-r_0$.
4. The parallelogram formed by $P-r_0$ and $v$ has area $\lVert(P-r_0)\times v\rVert$.
5. The same area is base times height: $\lVert v\rVert\,d$.
6. Divide by the base length: $d=\dfrac{\lVert(P-r_0)\times v\rVert}{\lVert v\rVert}$.

**Symbols.** $r_0$ is a point on the line; $v$ is the direction vector; $t$ is a real parameter; $P$ is an outside point; $d$ is perpendicular distance to the line.

**Real-World Applications (§5).** (1) **Point on a ray.** With $r_0=(1,1,1)$ and $v=(1,2,2)$, $t=2$ gives $(3,5,5)$. (2) **Point-to-line distance.** Point $(2,3,4)$ to that line has distance $\sqrt5/3\approx0.745$. (3) **Camera ray.** Ray $(0,0,0)+5(0,0,1)$ reaches $(0,0,5)$. (4) **Linear interpolation.** From $A=(1,2,3)$ to $B=(5,2,3)$, $t=0.25$ gives $(2,2,3)$. (5) **Closest approach to a vertical line.** Point $(3,4,2)$ to the $z$-axis has distance $5$. (6) **Motion path.** Starting $(2,0,1)$ with velocity $(0,3,-1)$ for $4$ seconds gives $(2,12,-3)$.

### `math-11-09` — Planes in 3D  · deepen

**Connections (§1).**
> Lines in 3-D use a direction vector; planes use a normal vector. This lesson extends the normal-form idea from lines in the plane to flat sheets in space. It also prepares for clipping planes, point-to-plane distance, and the hyperplane decision boundaries used in machine learning.

**Motivation & Intuition (§2).**
> A plane is the 3-D version of a flat sheet. Vectors that lie inside the sheet can point in many directions, but they all share one property: they are perpendicular to the plane's normal vector. If a known point $r_0$ lies on the plane, then any other point $r$ on the plane creates an inside-sheet displacement $r-r_0$.
>
> The dot product records perpendicularity, so the equation $n\cdot(r-r_0)=0$ describes the whole plane. After expansion, the equation becomes $ax+by+cz=d$. For a point not on the plane, the signed numerator $n\cdot P-d$ measures offset in the normal direction, and dividing by the normal length turns that offset into Euclidean distance.

**Definition & Assumptions (§3).** For normal $n=(a,b,c)$ and point $r_0=(x_0,y_0,z_0)$:
1. A point $r=(x,y,z)$ lies in the plane exactly when $r-r_0$ is a displacement inside the sheet.
2. Inside-plane displacements are perpendicular to the normal, so $n\cdot(r-r_0)=0$.
3. Expand: $a(x-x_0)+b(y-y_0)+c(z-z_0)=0$.
4. Rearrange to $ax+by+cz=d$, where $d=ax_0+by_0+cz_0$.
5. For point $P$, the signed offset from the plane is $n\cdot P-d$.
6. Divide by $\lVert n\rVert$ to convert normal offset into Euclidean distance: $\operatorname{dist}(P,\Pi)=\dfrac{|n\cdot P-d|}{\lVert n\rVert}$.

**Symbols.** $n$ is the normal vector; $r_0$ is a point on the plane; $d$ is the plane constant; $P$ is a test point; $\Pi$ names the plane.

**Real-World Applications (§5).** (1) **Plane from point and normal.** Normal $(2,-1,2)$ through $(1,0,1)$ gives $2x-y+2z=4$. (2) **Point-to-plane distance.** Point $(3,1,0)$ to that plane has distance $|6-1-4|/3=1/3$. (3) **Side test.** The same point has signed numerator $1$, so it lies on the positive-normal side. (4) **Horizontal slice.** Plane $z=3$ is reached by all points with height $3$. (5) **Triangle plane.** Points $(0,0,0)$, $(1,0,0)$, $(0,1,0)$ define plane $z=0$. (6) **Clipping plane.** For $x+y+z=6$, point $(1,2,3)$ lies exactly on the clip because the left side is $6$.

### `math-11-10` — The circle and ellipse  · AUTHOR derivation · promote display

**Connections (§1).**
> Distance formulas now become equations for curved shapes. A circle keeps one fixed distance from a center, while an ellipse stretches that idea differently along two axes. These conics appear throughout geometry, graphics, physical modeling, and data contours.

**Motivation & Intuition (§2).**
> A circle is the set of all points at the same distance from a center. Once the center is $(h,k)$, the distance formula gives the circle equation directly. Squaring removes the square root and leaves a clean relationship between horizontal and vertical offsets.
>
> An ellipse can be viewed as a circle after different scaling in the horizontal and vertical directions. Dividing the horizontal offset by $a$ and the vertical offset by $b$ measures distance in scaled coordinates. The focus relationship adds the classical geometric interpretation: for a horizontal ellipse, the two focus distances are arranged so their sum stays constant.

**Definition & Assumptions (§3).** For center $(h,k)$:
1. A circle of radius $r$ contains points whose distance to $(h,k)$ is $r$.
2. Use the distance formula: $\sqrt{(x-h)^2+(y-k)^2}=r$.
3. Square both sides: $(x-h)^2+(y-k)^2=r^2$.
4. A standard ellipse scales horizontal distance by $a$ and vertical distance by $b$ before measuring circular radius.
5. Write the scaled radius condition: $(\frac{x-h}{a})^2+(\frac{y-k}{b})^2=1$.
6. Rearrange as $\dfrac{(x-h)^2}{a^2}+\dfrac{(y-k)^2}{b^2}=1$.
7. For a horizontal ellipse, the focus distance satisfies $c^2=a^2-b^2$ because the endpoint $(h+a,k)$ has focus distances $(a-c)$ and $(a+c)$ whose sum is $2a$.

**Symbols.** $(h,k)$ is the center; $r$ is circle radius; $a,b$ are ellipse semi-axis lengths; $c$ is center-to-focus distance; foci are the two fixed points defining the ellipse.

**Real-World Applications (§5).** (1) **Circle membership.** For center $(2,1)$ and radius $5$, point $(5,5)$ lies on the circle because $(3)^2+(4)^2=25$. (2) **Ellipse value.** In $x^2/25+y^2/9=1$, point $(3,2)$ gives $9/25+4/9\approx0.804<1$, so it is inside. (3) **Ellipse foci.** With $a=5$, $b=3$, $c=\sqrt{25-9}=4$. (4) **Ellipse area.** The area is $\pi ab=15\pi\approx47.124$. (5) **Circular mask.** Point $(6,8)$ is on the radius-$10$ circle because $6^2+8^2=100$. (6) **Axis endpoints.** Ellipse centered at $(1,2)$ with $a=4$, $b=2$ has horizontal endpoints $(-3,2)$ and $(5,2)$.

### `math-11-11` — The parabola and hyperbola  · deepen · promote display

**Connections (§1).**
> Circles and ellipses describe constant distance or constant distance-sum relationships. Parabolas and hyperbolas complete the standard family of conics by changing the distance rule. This lesson keeps the same coordinate-based approach while introducing focus-directrix and distance-difference geometry.

**Motivation & Intuition (§2).**
> A parabola balances distance from a point, called the focus, with distance from a line, called the directrix. For the standard horizontal setup, this equality creates a curve opening to the right or left. Squaring the distance equation simplifies the condition into the familiar form $y^2=4px$.
>
> A hyperbola uses two foci differently. Instead of keeping the sum of distances fixed, it keeps the difference of distances fixed. In standard position this produces an equation with one squared term subtracted from another, which explains the two-branch shape and the asymptotes that guide it.

**Definition & Assumptions (§3).** For a parabola with focus $(p,0)$ and directrix $x=-p$:
1. A point $(x,y)$ is on the parabola when its distance to the focus equals its distance to the directrix.
2. Write the equality: $\sqrt{(x-p)^2+y^2}=x+p$ for points to the right of the directrix.
3. Square both sides: $(x-p)^2+y^2=(x+p)^2$.
4. Expand both sides: $x^2-2px+p^2+y^2=x^2+2px+p^2$.
5. Cancel $x^2$ and $p^2$, then add $2px$: $y^2=4px$.
6. For a horizontal hyperbola, the standard scaled difference-of-distances form is $\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=1$ with foci satisfying $c^2=a^2+b^2$.

**Symbols.** $p$ is focus distance for the parabola; $a,b$ are hyperbola semi-axis parameters; $c$ is focus distance; the directrix is the fixed line used in the parabola definition.

**Real-World Applications (§5).** (1) **Parabola parameter.** $y^2=8x$ has $4p=8$, so $p=2$ and focus $(2,0)$. (2) **Point on parabola.** In $y^2=8x$, $y=4$ gives $x=2$. (3) **Vertex shift.** $(y-1)^2=12(x+2)$ has vertex $(-2,1)$ and $p=3$. (4) **Hyperbola foci.** $x^2/9-y^2/4=1$ has $c=\sqrt{13}\approx3.606$. (5) **Hyperbola asymptotes.** For that hyperbola, asymptotes are $y=\pm(2/3)x$. (6) **Membership.** Point $(3,0)$ satisfies $x^2/9-y^2/4=1$, so it is a vertex.

### `math-11-12` — Quadratic forms  · deepen · promote display

**Connections (§1).**
> Conic equations often contain squared terms and cross terms. A quadratic form packages those terms into matrix notation, which makes the geometry easier to classify. This connects analytic geometry with linear algebra through eigenvalues, rotations, ellipses, and saddle shapes.

**Motivation & Intuition (§2).**
> The expression $x^TAx$ turns a coordinate vector into a single quadratic value. When $A$ is symmetric, the off-diagonal entries create the cross term, and the diagonal entries create the pure squared terms. This compact notation is useful because the matrix stores the whole shape.
>
> The eigenvectors of a symmetric matrix give rotated coordinate axes where the cross term disappears. In those coordinates, the quadratic form is just a weighted sum of squares. Positive weights produce ellipse-like level sets, while mixed signs produce saddle-like behavior.

**Definition & Assumptions (§3).** For a symmetric matrix $A=\begin{bmatrix}a&b\\b&c\end{bmatrix}$:
1. Write $x=(u,v)^T$.
2. Multiply $Ax=(au+bv,bu+cv)^T$.
3. Dot with $x$: $x^TAx=u(au+bv)+v(bu+cv)$.
4. Combine like terms: $x^TAx=au^2+2buv+cv^2$.
5. Because $A$ is symmetric, an orthonormal eigenbasis rotates coordinates without stretching lengths.
6. In eigen-coordinates $z$, the form becomes $\lambda_1z_1^2+\lambda_2z_2^2$.
7. If both eigenvalues are positive, level sets $x^TAx=c>0$ are ellipses; if signs differ, the form is saddle-like.

**Symbols.** $A$ is a symmetric matrix; $x$ is a coordinate vector; $x^TAx$ is the quadratic form; $\lambda_i$ are eigenvalues; cross term $2buv$ records axis rotation.

**Real-World Applications (§5).** (1) **Evaluate a form.** With $A=\begin{bmatrix}3&1\\1&3\end{bmatrix}$ and $x=(1,2)$, $x^TAx=19$. (2) **Classify definiteness.** The eigenvalues are $2$ and $4$, so the form is positive definite. (3) **Ellipse axes.** Level $x^TAx=12$ has semi-axis lengths $\sqrt{12/2}\approx2.449$ and $\sqrt{12/4}\approx1.732$. (4) **Saddle form.** $x^2-y^2$ at $(2,1)$ gives $3$ and has mixed signs. (5) **Conic discriminant.** For $3x^2+2xy+3y^2=1$, $B^2-4AC=4-36=-32<0$, an ellipse type. (6) **Mahalanobis contour.** If $A=\operatorname{diag}(1/4,1)$, then point $(2,1)$ has value $2$.

### `math-11-13` — Quadric surfaces  · AUTHOR derivation · promote display

**Connections (§1).**
> Quadric surfaces extend conic geometry from two variables to three. The same squared-term patterns that create ellipses, hyperbolas, and parabolas now create surfaces in space. This lesson prepares the reader to recognize 3-D shapes from equations and from their 2-D slices.

**Motivation & Intuition (§2).**
> A diagonal quadric equation tells how the squared coordinates are allowed to trade off. If all three squared terms are positive and bounded by $1$, the surface closes into an ellipsoid. The intercepts appear by setting two variables to zero and solving for the remaining coordinate.
>
> Changing signs or replacing a squared term with a linear term changes the shape. A negative squared term creates hyperboloid behavior because slices grow as the corresponding coordinate moves away from zero. A linear term paired with squared terms creates a paraboloid, where height grows like a quadratic in the other coordinates.

**Definition & Assumptions (§3).** Read a diagonal quadric from its equation:
1. Start with $\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}+\dfrac{z^2}{c^2}=1$.
2. Set $y=z=0$ to find the $x$-intercepts: $x=\pm a$.
3. Set $x=z=0$ to find $y=\pm b$; set $x=y=0$ to find $z=\pm c$.
4. Positive squared terms bounded by $1$ give an ellipsoid.
5. Changing one sign, such as $\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}-\dfrac{z^2}{c^2}=1$, gives hyperboloid traces because cross-sections grow as $|z|$ grows.
6. Replacing one squared term by a linear term, such as $z=\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}$, gives a paraboloid.

**Symbols.** $a,b,c$ are semi-axis scales; traces are 2-D slices; signs of squared terms determine bounded or saddle-like behavior.

**Real-World Applications (§5).** (1) **Ellipsoid intercepts.** $x^2/9+y^2/4+z^2/16=1$ has intercepts $\pm3$, $\pm2$, $\pm4$. (2) **Ellipsoid membership.** Point $(2,1,3)$ gives $4/9+1/4+9/16\approx1.257>1$, so it is outside. (3) **Hyperboloid slice.** For $x^2+y^2-z^2/4=1$, at $z=2$ the slice is $x^2+y^2=2$. (4) **Paraboloid height.** For $z=(x^2+y^2)/4$, point $(2,1)$ has $z=1.25$. (5) **Cone slice.** Cone $z^2=x^2+y^2$ at $z=3$ has radius $3$. (6) **Cylinder.** Equation $x^2+y^2=4$ ignores $z$, so $(0,2,7)$ lies on it.

### `math-11-14` — Projections  · deepen · promote display

**Connections (§1).**
> The dot product measures how much one vector points along another. Projection turns that measurement into an actual vector in the chosen direction. This lesson connects alignment, closest points, shadows, residuals, and the geometry behind least squares.

**Motivation & Intuition (§2).**
> A projection keeps the part of a vector that lies along a target direction and removes the perpendicular part. If the target direction is $u$, the projected vector must be some scalar multiple of $u$. The only question is which scalar gives the closest point on that line.
>
> The closest point occurs when the leftover residual is perpendicular to the target direction. If the residual still had a component along $u$, moving farther along the line would reduce the error. Setting the residual's dot product with $u$ to zero solves for the scalar and gives the projection formula.

**Definition & Assumptions (§3).** Project $v$ onto nonzero vector $u$:
1. The projection must lie along $u$, so write it as $\alpha u$.
2. The residual $v-\alpha u$ must be perpendicular to $u$ for the closest point.
3. Set the dot product to zero: $(v-\alpha u)\cdot u=0$.
4. Expand: $v\cdot u-\alpha(u\cdot u)=0$.
5. Solve for the scalar: $\alpha=\dfrac{v\cdot u}{u\cdot u}$.
6. Substitute back: $\operatorname{proj}_u(v)=\dfrac{v\cdot u}{u\cdot u}u$.

**Symbols.** $v$ is the vector being projected; $u$ is the nonzero target direction; $\alpha$ is the scalar coordinate along $u$; the residual is the perpendicular leftover.

**Real-World Applications (§5).** (1) **Projection length.** For unit $u=(3/5,4/5)$ and $v=(6,2)$, scalar projection is $5.2$. (2) **Projection vector.** The projected vector is $(3.12,4.16)$. (3) **Residual.** The perpendicular leftover is $(2.88,-2.16)$ with length $3.6$. (4) **Closest point on an axis.** Project $(3,4)$ onto the $x$-axis to get $(3,0)$. (5) **Least-squares coefficient.** Project $y=(2,4)$ onto $x=(1,1)$: coefficient is $6/2=3$. (6) **Road snapping.** On a road direction $(1,0)$, location $(8,3)$ projects to $(8,0)$, so the offset is $3$.

### `math-11-15` — Reflections  · AUTHOR derivation

**Connections (§1).**
> Projections split a vector into a part along a direction and a perpendicular leftover. Reflections use exactly that split. Keeping one part and flipping the other gives a clean geometric transformation that can be written as a matrix.

**Motivation & Intuition (§2).**
> A reflection across a mirror line leaves anything on the mirror unchanged. The part perpendicular to the mirror crosses to the opposite side with the same length. If a vector is decomposed into parallel and perpendicular parts, the reflection rule becomes simple: keep the parallel part and negate the perpendicular part.
>
> When the mirror line passes through the origin and has unit direction $u$, the projection $(u\cdot x)u$ gives the parallel part. Subtracting that from $x$ gives the perpendicular leftover. Combining the kept and flipped pieces leads to the compact formula $x'=2(u\cdot x)u-x$, and matrix notation turns it into $2uu^T-I$.

**Definition & Assumptions (§3).** Reflect $x$ across the line through the origin in unit direction $u$:
1. Split $x$ into parallel and perpendicular parts: $x=(u\cdot x)u+\bigl(x-(u\cdot x)u\bigr)$.
2. A reflection keeps the parallel part unchanged because it lies on the mirror.
3. A reflection negates the perpendicular part because it crosses to the opposite side.
4. Write the reflected vector: $x'=(u\cdot x)u-\bigl(x-(u\cdot x)u\bigr)$.
5. Combine terms: $x'=2(u\cdot x)u-x$.
6. In matrix form, $(u\cdot x)u=(uu^T)x$, so $x'=(2uu^T-I)x$.

**Symbols.** $u$ is a unit vector along the mirror line; $I$ is the identity matrix; $2uu^T-I$ is the reflection matrix; $x'$ is the reflected point or vector.

**Real-World Applications (§5).** (1) **Reflect across the $x$-axis.** $(3,5)$ becomes $(3,-5)$. (2) **Reflect across the $y$-axis.** $(3,5)$ becomes $(-3,5)$. (3) **Reflect across $y=x$.** $(3,5)$ becomes $(5,3)$. (4) **Reflect across a $30^\circ$ line.** With $u=(\cos30^\circ,\sin30^\circ)$, point $(2,1)$ reflects to approximately $(1.866,1.232)$. (5) **Normal reflection.** Flipping across the plane normal to $(1,0)$ sends velocity $(4,-2)$ to $(-4,-2)$. (6) **Symmetry check.** Points $(2,7)$ and $(2,-7)$ are mirror images across the $x$-axis.

### `math-11-16` — Rotations, scaling, and translation  · deepen · promote display

**Connections (§1).**
> Reflections are one kind of geometric transformation. Rotations, scalings, and translations are other basic ways to move or reshape points. This lesson connects coordinate geometry with transformation matrices and prepares for homogeneous coordinates, where affine transformations can be composed uniformly.

**Motivation & Intuition (§2).**
> A rotation changes direction while preserving lengths and angles. A scaling changes lengths along coordinate axes. Both can be represented by matrices because they send the origin to the origin and are determined by what they do to the basis vectors.
>
> Translation is different because it shifts every point by the same vector and moves the origin itself. In ordinary coordinates, that means translation is affine rather than linear. It still has a simple formula, $x'=x+t$, and the next lesson shows how adding one extra coordinate lets translations join rotations and scalings inside matrix multiplication.

**Definition & Assumptions (§3).** For a 2-D rotation by angle $\theta$:
1. The unit $x$-axis vector $(1,0)$ rotates to $(\cos\theta,\sin\theta)$.
2. The unit $y$-axis vector $(0,1)$ rotates to $(-\sin\theta,\cos\theta)$ because it remains perpendicular and keeps orientation.
3. A matrix is determined by where it sends basis vectors, so place those images as columns.
4. This gives $R_\theta=\begin{bmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{bmatrix}$.
5. Scaling by $s_x,s_y$ sends basis vectors to $(s_x,0)$ and $(0,s_y)$, so $S=\begin{bmatrix}s_x&0\\0&s_y\end{bmatrix}$.
6. Translation adds a vector $t$: $x'=x+t$; it is not a linear map in ordinary coordinates because the origin moves.

**Symbols.** $R_\theta$ is a rotation matrix; $S$ is a scaling matrix; $s_x,s_y$ are scale factors; $t$ is a translation vector.

**Real-World Applications (§5).** (1) **Quarter-turn.** Rotating $(1,0)$ by $90^\circ$ gives $(0,1)$. (2) **Thirty-degree rotation.** Rotating $(2,0)$ by $30^\circ$ gives $(\sqrt3,1)\approx(1.732,1.000)$. (3) **Axis scaling.** Scaling $(4,5)$ by $s_x=2$, $s_y=3$ gives $(8,15)$. (4) **Translation.** Adding $t=(3,-2)$ to $(4,5)$ gives $(7,3)$. (5) **Scale then translate in 1-D.** $x=4$ scaled by $2$ and translated by $3$ gives $11$. (6) **Inverse rotation.** Rotating $(0,1)$ by $-90^\circ$ gives $(1,0)$.

### `math-11-17` — Homogeneous coordinates  · AUTHOR derivation · promote display

**Connections (§1).**
> The previous lesson separated linear transformations from translation. Homogeneous coordinates bring them together by adding one extra coordinate. This gives a single matrix language for affine transformations, composition, graphics pipelines, and perspective conversion.

**Motivation & Intuition (§2).**
> Ordinary matrix multiplication handles rotations and scalings well, but translation requires adding a vector after the multiplication. Homogeneous coordinates solve this by representing a 2-D point as $(x,y,1)^T$ and placing the translation vector in an extra matrix column. Multiplication then produces $Ax+t$ automatically in the top coordinates.
>
> The final coordinate also separates points from directions. A point has final coordinate $1$, so translation affects it. A direction has final coordinate $0$, so translation drops out and only the linear part remains. If a homogeneous point ends with a nonzero value other than $1$, dividing by that value returns the ordinary Cartesian point.

**Definition & Assumptions (§3).** For a 2-D affine map $x'=Ax+t$:
1. Write an ordinary point as $\tilde x=(x,y,1)^T$.
2. Build the block matrix $H=\begin{bmatrix}A&t\\0&1\end{bmatrix}$, where $t$ is the translation column.
3. Multiply: $H\tilde x=\begin{bmatrix}A&t\\0&1\end{bmatrix}\begin{bmatrix}x\\y\\1\end{bmatrix}=\begin{bmatrix}Ax+t\\1\end{bmatrix}$.
4. The top coordinates are exactly the affine transform, and the final coordinate stays $1$.
5. A direction has homogeneous coordinate $0$, so $H(v_x,v_y,0)^T=(Av_x,Av_y,0)^T$; translation does not affect directions.
6. If the final coordinate is $w\ne0$, convert back by dividing: $(X,Y,w)\mapsto(X/w,Y/w)$.

**Symbols.** $\tilde x$ is a homogeneous point; $A$ is the linear part; $t$ is translation; $H$ is the homogeneous transformation matrix; final coordinate $1$ marks points and $0$ marks directions.

**Real-World Applications (§5).** (1) **Affine transform.** Matrix $\begin{bmatrix}2&0&3\\0&2&4\\0&0&1\end{bmatrix}$ sends $(1,2,1)$ to $(5,8,1)$. (2) **Direction unchanged by translation.** The same matrix sends direction $(1,2,0)$ to $(2,4,0)$. (3) **Perspective divide.** Homogeneous point $(6,9,3)$ represents Cartesian point $(2,3)$. (4) **1-D scale then translate.** Matrix $\begin{bmatrix}2&3\\0&1\end{bmatrix}$ sends $(4,1)$ to $(11,1)$. (5) **Pure translation.** Matrix $\begin{bmatrix}1&0&7\\0&1&7\\0&0&1\end{bmatrix}$ sends $(1,2,1)$ to $(8,9,1)$. (6) **Batch composition.** If one matrix sends $(1,1,1)$ to $(3,3,1)$ and the next translates by $(4,0)$, the composed result is $(7,3,1)$.

### `math-11-18` — Hyperplanes and decision boundaries  · deepen · full-prose model above

**Connections (§1).** *(Plain textbook voice: what the learner already knows, and where this fits.)*
> Earlier lessons in this section describe lines, planes, distances, projections, and normal vectors. A
> hyperplane uses those same ideas in any number of dimensions. In two dimensions it is a line. In three
> dimensions it is a plane. In higher-dimensional feature space it is still the same object: a flat set with
> a normal direction.
>
> This lesson connects analytic geometry directly to linear classifiers. A logistic regression model,
> perceptron, or linear SVM computes an affine score $w\cdot x+b$. The decision boundary is the set of
> points where that score is exactly zero. The sign tells which side a point is on, and the distance formula
> tells how far the point lies from the boundary.

**Motivation & Intuition (§2).** *(Complete prose for the section voice bar.)*
> A line in the plane can split the plane into two half-planes. The equation $2x-y-3=0$ is the boundary
> itself. Points with $2x-y-3>0$ lie on one side, and points with $2x-y-3<0$ lie on the other. The vector
> $(2,-1)$ is perpendicular to the boundary, so moving in that normal direction changes the score fastest.
>
> A hyperplane is the same idea with more coordinates. The vector $w$ stores the normal direction, $x$ is
> the point being classified, and $b$ shifts the boundary away from the origin. The score $w\cdot x+b$ is a
> signed quantity: positive on one side, negative on the other, and zero on the boundary.
>
> The size of the raw score depends on the scale of $w$. Doubling both $w$ and $b$ doubles every score but
> leaves the boundary unchanged. For geometry, divide by $\lVert w\rVert$. That turns the score into a true
> Euclidean distance from the point to the hyperplane. This is why SVMs distinguish a functional margin
> $y(w\cdot x+b)$ from a geometric margin $y(w\cdot x+b)/\lVert w\rVert$.

**Definition & Assumptions (§3).** Display the formula
$$
H=\{x\in\mathbb R^n: w\cdot x+b=0\},
\qquad
\operatorname{dist}(x,H)=\frac{|w\cdot x+b|}{\lVert w\rVert}.
$$
For an SVM label $y\in\{-1,1\}$, display
$$
\gamma_{\text{functional}}=y(w\cdot x+b),
\qquad
\gamma_{\text{geometric}}=\frac{y(w\cdot x+b)}{\lVert w\rVert}.
$$
Then derive it completely:
1. Choose any point $x_0$ on the hyperplane, so $w\cdot x_0+b=0$; this gives a known anchor on the boundary.
2. Subtract the two scores: $(w\cdot x+b)-(w\cdot x_0+b)=w\cdot(x-x_0)$; the bias cancels because it shifts both scores equally.
3. Replace the boundary score with zero: $w\cdot x+b=w\cdot(x-x_0)$; the score measures the offset from the boundary in the normal direction.
4. Make the normal unit length: $u=w/\lVert w\rVert$; distances along a direction require a unit direction.
5. Project the offset onto the unit normal: $u\cdot(x-x_0)=\dfrac{w\cdot(x-x_0)}{\lVert w\rVert}$; projection gives signed perpendicular distance.
6. Substitute Step 3: $u\cdot(x-x_0)=\dfrac{w\cdot x+b}{\lVert w\rVert}$; this is signed distance.
7. Take absolute value for ordinary distance: $\operatorname{dist}(x,H)=\dfrac{|w\cdot x+b|}{\lVert w\rVert}$; distance is nonnegative.
8. For a labeled SVM point, multiply by $y$ before dividing: $\gamma=\dfrac{y(w\cdot x+b)}{\lVert w\rVert}$; correctly classified points have positive margin.

**Worked problem.** A classifier has $w=(2,-1)$ and $b=-3$. For $x=(4,2)$, the score is
$2\cdot4+(-1)\cdot2-3=3$, so the point is on the positive side. The boundary distance is
$|3|/\sqrt{2^2+(-1)^2}=3/\sqrt5\approx1.342$. With label $y=1$, the functional margin is $3$ and the
geometric margin is $3/\sqrt5\approx1.342$.

**Symbols.** $x$ is the feature point; $w$ is the nonzero normal vector; $b$ is the bias or offset; $H$ is the hyperplane; $y$ is the class label in $\{-1,1\}$; $\lVert w\rVert$ is the Euclidean length of the normal; $\gamma$ is a margin. Assumptions: $w\ne0$; distances use the Euclidean norm; multiplying $w$ and $b$ by the same positive constant leaves the boundary but not the raw score unchanged.

**Real-World Applications (§5).** (1) **Linear classifier sign.** With $s=1.5x_1-0.5x_2+1$, point $(2,4)$ gives $3-2+1=2$, so it is on the positive side. (2) **Boundary distance.** For $w=(2,-1)$, $b=-3$, and $x=(4,2)$, the distance is $3/\sqrt5\approx1.342$. (3) **SVM maximum margin.** If $\lVert w\rVert=5$ and the closest functional margin is $1$, the geometric margin is $1/5=0.2$. (4) **Distance-based confidence.** Scores $0.5$ and $2.0$ with $\lVert w\rVert=2$ have boundary distances $0.25$ and $1.0$. (5) **Multiclass linear boundary.** If $s_1=2x+1$ and $s_2=-x+4$, the class-switch boundary solves $2x+1=-x+4$, so $x=1$. (6) **Feature-map boundary.** In features $(x,x^2)$, the linear boundary $x^2-4=0$ becomes two original-input decision points, $x=-2$ and $x=2$.

## Build order

1. Author `math-11-18` first as the model entry and preserve its strong boundary/margin applications.
2. Author coordinate foundations: `math-11-01` through `math-11-05`.
3. Author product and flat-object geometry: `math-11-06` through `math-11-09`.
4. Author conics and quadrics: `math-11-10` through `math-11-13`.
5. Author projections and transformations: `math-11-14` through `math-11-17`.
6. Re-run numeric verification for all §5 numbers and scan only for genuine LaTeX bugs: unclosed dollar delimiters or broken matrix row separators.
