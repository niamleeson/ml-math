module.exports = {
  "math-02-01": {
    connectionsProse:
      "<p>This lesson starts with the coordinate language you already use whenever you read a table of numbers. A single row of features can be treated as a point, and the same row can also be treated as a vector from the origin to that point. That small shift lets algebraic data inherit geometric ideas such as distance, length, and direction. Those ideas support the dot product, projections, embeddings, and many of the optimization pictures that come later.</p>",
    motivation:
      "<p>When there are only two coordinates, it is natural to draw a point on graph paper and measure how far it is from the origin. The Pythagorean theorem gives that distance by squaring the horizontal and vertical changes, adding them, and taking a square root. In higher-dimensional data there may be hundreds or thousands of coordinates, but the same measurement still works because each coordinate axis is treated as perpendicular to the others.</p>" +
      "<p>This is why vectors are so useful for machine learning. A word embedding, an image, or a feature row can all be placed in a coordinate space, and then comparisons become geometric. Length tells you scale, distance tells you separation, and later the dot product will tell you alignment. The formulas look simple, but they are the entry point for treating data as geometry.</p>",
    definition:
      "<p>Length from Pythagoras, generalized: $\\lVert v\\rVert=\\sqrt{v_1^2+\\dots+v_n^2}$ — build it in 2-D, then note the same sum works in $n$-D because each new axis is perpendicular to the rest.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$v=\\langle v_1,\\dots,v_n\\rangle$", desc: "components" },
      { sym: "$\\lVert v\\rVert$", desc: "length" },
      { sym: "$\\mathbf 0$", desc: "origin" }
    ],
    derivation: [
      { do: "Length from Pythagoras, generalized", result: "$\\lVert v\\rVert=\\sqrt{v_1^2+\\dots+v_n^2}$", why: "this names the corresponding formula or conclusion" },
      { do: "build it in 2-D, then note the same sum works in $n$-D because each new axis is perpendicular to the rest", result: "build it in 2-D, then note the same sum works in $n$-D because each new axis is perpendicular to the rest", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "A 768-d embedding is a", background: "A 768-d embedding is a point in $\\mathbb R^{768}$", numbers: "A 768-d embedding is a point in $\\mathbb R^{768}$" },
      { title: "Euclidean distance", background: "Euclidean distance $\\lVert a-b\\rVert$ as similarity: $a=(1,2,2),b=(3,0,4)\\Rightarrow\\sqrt{4+4+4}=3.46$", numbers: "Euclidean distance $\\lVert a-b\\rVert$ as similarity: $a=(1,2,2),b=(3,0,4)\\Rightarrow\\sqrt{4+4+4}=3.46$" },
      { title: "One-hot vector", background: "One-hot vector = a corner of the unit cube", numbers: "One-hot vector = a corner of the unit cube" },
      { title: "Feature scaling changes", background: "Feature scaling changes $\\lVert v\\rVert$", numbers: "Feature scaling changes $\\lVert v\\rVert$" },
      { title: "Bias trick", background: "append a 1 to $x$", numbers: "Bias trick: append a 1 to $x$" },
      { title: "Grayscale image as a point", background: "Grayscale image as a point in $\\mathbb R^{H\\cdot W}$", numbers: "Grayscale image as a point in $\\mathbb R^{H\\cdot W}$" }
    ]
  },
  "math-02-02": {
    connectionsProse:
      "<p>This lesson builds on vectors and length, then adds the first way to compare two directions with one number. You already know how to multiply ordinary numbers; the dot product is the vector version that returns a scalar rather than another vector. It connects directly to angles, projections, similarity scores, and linear model computations. Later lessons use it inside directional derivatives, gradients, and matrix calculus.</p>",
    motivation:
      "<p>A vector has both size and direction, so multiplying two vectors should say something about how their directions relate. The dot product does this by multiplying matching coordinates and adding the results. If two vectors point mostly the same way, the result is positive and large; if they point against each other, it is negative; if they are perpendicular, it is zero.</p>" +
      "<p>The geometric formula explains why this coordinate sum is meaningful. The dot product equals the product of the two lengths times the cosine of the angle between them. That makes it a similarity measure, a projection tool, and the basic computation behind a neuron pre-activation. A linear model is therefore not just algebra; it is repeatedly measuring alignment between weights and inputs.</p>",
    definition:
      "<p>From the law of cosines on the triangle with sides $a,b,a-b$: 1. $\\lVert a-b\\rVert^2=\\lVert a\\rVert^2+\\lVert b\\rVert^2-2\\,a\\!\\cdot\\!b$ (expand $ (a-b)\\!\\cdot\\!(a-b)$). 2. Law of cosines: $\\lVert a-b\\rVert^2=\\lVert a\\rVert^2+\\lVert b\\rVert^2-2\\lVert a\\rVert\\lVert b\\rVert\\cos\\theta$. 3. Match the two right-hand sides ⇒ $a\\!\\cdot\\!b=\\lVert a\\rVert\\lVert b\\rVert\\cos\\theta$.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$a\\!\\cdot\\!b=\\sum_i a_ib_i$", desc: "as named in the plan" },
      { sym: "$\\theta$", desc: "the angle" },
      { sym: "$\\lVert a\\rVert$", desc: "length" }
    ],
    derivation: [
      { do: "$\\lVert a-b\\rVert^2=\\lVert a\\rVert^2+\\lVert b\\rVert^2-2\\,a\\!\\cdot\\!b$ (expand $ (a-b)\\!\\cdot\\!(a-b)$)", result: "$\\lVert a-b\\rVert^2=\\lVert a\\rVert^2+\\lVert b\\rVert^2-2\\,a\\!\\cdot\\!b$ (expand $ (a-b)\\!\\cdot\\!(a-b)$)", why: "this is the stated step in the plan's derivation" },
      { do: "Law of cosines", result: "$\\lVert a-b\\rVert^2=\\lVert a\\rVert^2+\\lVert b\\rVert^2-2\\lVert a\\rVert\\lVert b\\rVert\\cos\\theta$", why: "this names the corresponding formula or conclusion" },
      { do: "Match the two right-hand sides", result: "$a\\!\\cdot\\!b=\\lVert a\\rVert\\lVert b\\rVert\\cos\\theta$", why: "this is the next consequence in the plan's argument" }
    ],
    applications: [
      { title: "Neuron pre-activation $w^\\top x+b$", background: "$w=(0.5,1),x=(2,3),b=-1\\Rightarrow 0.5\\cdot2+1\\cdot3-1=3$", numbers: "Neuron pre-activation $w^\\top x+b$: $w=(0.5,1),x=(2,3),b=-1\\Rightarrow 0.5\\cdot2+1\\cdot3-1=3$" },
      { title: "Cosine similarity (retrieval)", background: "$a\\!\\cdot\\!b=11,\\ \\cos=\\tfrac{11}{3\\cdot5}=0.733$", numbers: "Cosine similarity (retrieval): $a\\!\\cdot\\!b=11,\\ \\cos=\\tfrac{11}{3\\cdot5}=0.733$" },
      { title: "Scalar projection of $a$ onto $b$", background: "$\\tfrac{a\\cdot b}{\\lVert b\\rVert}=\\tfrac{11}{5}=2.2$", numbers: "Scalar projection of $a$ onto $b$: $\\tfrac{a\\cdot b}{\\lVert b\\rVert}=\\tfrac{11}{5}=2.2$" },
      { title: "Orthogonal features", background: "$(1,2)\\!\\cdot\\!(2,-1)=0$ ⇒ decorrelated", numbers: "Orthogonal features: $(1,2)\\!\\cdot\\!(2,-1)=0$ ⇒ decorrelated" },
      { title: "Attention score (pre-softmax) $q^\\top k$", background: "$q=(1,0,1),k=(2,1,2)\\Rightarrow 4$", numbers: "Attention score (pre-softmax) $q^\\top k$: $q=(1,0,1),k=(2,1,2)\\Rightarrow 4$" },
      { title: "Work $F\\!\\cdot\\!d$", background: "$F=(3,4),d=(2,0)\\Rightarrow 6$", numbers: "Work $F\\!\\cdot\\!d$: $F=(3,4),d=(2,0)\\Rightarrow 6$" }
    ]
  },
  "math-02-03": {
    connectionsProse:
      "<p>This lesson follows the dot product by studying the other basic product available in three dimensions. The dot product returns a number that measures alignment, while the cross product returns a vector that stands perpendicular to two given vectors. That perpendicular direction is exactly what surfaces, rotations, torques, and 3-D geometry need. It also prepares the ground for surface normals, curl, and Stokes' theorem later in the section.</p>",
    motivation:
      "<p>In three-dimensional space, two nonparallel directions determine a plane. Many geometric tasks then need a direction that is not in that plane at all, but normal to it. The cross product produces that normal direction, with a sign chosen by the right-hand rule.</p>" +
      "<p>Its length has an equally important meaning. The magnitude of the cross product is the area of the parallelogram spanned by the two input vectors, so half of it gives the area of the corresponding triangle. This is why the same operation appears in mesh geometry, shading, torque, and angular motion. It packages perpendicular direction and area scale into one vector.</p>",
    definition:
      "<p>(1) Set up the determinant $a\\times b=\\det\\begin{bmatrix}\\mathbf i&\\mathbf j&\\mathbf k\\a_1&a_2&a_3\\b_1&b_2&b_3\\end{bmatrix}$. (2) Expand along row 1 ⇒ $\\langle a_2b_3-a_3b_2,\\ a_3b_1-a_1b_3,\\ a_1b_2-a_2b_1\\rangle$. (3) Magnitude via the Lagrange identity $\\lVert a\\times b\\rVert^2=\\lVert a\\rVert^2\\lVert b\\rVert^2-(a\\!\\cdot\\!b)^2=\\lVert a\\rVert^2\\lVert b\\rVert^2\\sin^2\\theta$ ⇒ $\\lVert a\\times b\\rVert=\\lVert a\\rVert\\lVert b\\rVert\\sin\\theta$ = area of the parallelogram.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$a\\times b$", desc: "perpendicular vector" },
      { sym: "$\\mathbf i,\\mathbf j,\\mathbf k$", desc: "axes" },
      { sym: "right-hand", desc: "rule for sign" }
    ],
    derivation: [
      { do: "Set up the determinant $a\\times b=\\det\\begin{bmatrix}\\mathbf i&\\mathbf j&\\mathbf k\\a_1&a_2&a_3\\b_1&b_2&b_3\\end{bmatrix}$", result: "Set up the determinant $a\\times b=\\det\\begin{bmatrix}\\mathbf i&\\mathbf j&\\mathbf k\\a_1&a_2&a_3\\b_1&b_2&b_3\\end{bmatrix}$", why: "this is the stated step in the plan's derivation" },
      { do: "Expand along row 1", result: "$\\langle a_2b_3-a_3b_2,\\ a_3b_1-a_1b_3,\\ a_1b_2-a_2b_1\\rangle$", why: "this is the next consequence in the plan's argument" },
      { do: "Magnitude via the Lagrange identity $\\lVert a\\times b\\rVert^2=\\lVert a\\rVert^2\\lVert b\\rVert^2-(a\\!\\cdot\\!b)^2=\\lVert a\\rVert^2\\lVert b\\rVert^2\\sin^2\\theta$", result: "$\\lVert a\\times b\\rVert=\\lVert a\\rVert\\lVert b\\rVert\\sin\\theta$ = area of the parallelogram", why: "this is the next consequence in the plan's argument" }
    ],
    applications: [
      { title: "Surface normal (3-D vision/shading)", background: "$a=(1,2,2),b=(3,0,4)\\Rightarrow a\\times b=(8,2,-6)$", numbers: "Surface normal (3-D vision/shading): $a=(1,2,2),b=(3,0,4)\\Rightarrow a\\times b=(8,2,-6)$" },
      { title: "Triangle/mesh area", background: "$\\tfrac12\\lVert a\\times b\\rVert=\\tfrac12(10.198)=5.099$", numbers: "Triangle/mesh area: $\\tfrac12\\lVert a\\times b\\rVert=\\tfrac12(10.198)=5.099$" },
      { title: "Plane through 3 points", background: "normal $=(P_2-P_1)\\times(P_3-P_1)$", numbers: "Plane through 3 points: normal $=(P_2-P_1)\\times(P_3-P_1)$" },
      { title: "Polygon winding / orientation", background: "sign of the $z$-cross says CCW vs CW", numbers: "Polygon winding / orientation: sign of the $z$-cross says CCW vs CW" },
      { title: "Torque", background: "Torque $\\tau=r\\times F$", numbers: "Torque $\\tau=r\\times F$" },
      { title: "Angular velocity", background: "Angular velocity $v=\\omega\\times r$", numbers: "Angular velocity $v=\\omega\\times r$" }
    ]
  },
  "math-02-04": {
    connectionsProse:
      "<p>This lesson uses the vector language from the opening lessons to describe straight paths in space. In two dimensions a slope-intercept equation can describe many lines, but in three dimensions a single slope is no longer enough. A point plus a direction vector gives a more flexible description. This parametric view will reappear in curves, line integrals, ray tracing, and optimizer trajectories.</p>",
    motivation:
      "<p>A line in space is easiest to understand as motion from an anchor point. Start at one known point on the line, then move any real amount in a fixed direction. The parameter records how far along that direction you have traveled, so positive, negative, and zero values cover the whole line.</p>" +
      "<p>This point-and-direction form also makes distance questions manageable. To measure how far a point is from the line, form the parallelogram between the offset vector and the line direction. Its area is base times height, and dividing by the base length leaves the perpendicular distance. The formula is a direct use of the cross product's area meaning.</p>",
    definition:
      "<p>Parametric $r(t)=r_0+t\\,v$; distance from point $P$ to the line $=\\dfrac{\\lVert (P-r_0)\\times v\\rVert}{\\lVert v\\rVert}$ (the cross-product area ÷ base).</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$r_0$", desc: "anchor point" },
      { sym: "$v$", desc: "direction" },
      { sym: "$t$", desc: "parameter" }
    ],
    derivation: [
      { do: "Parametric $r(t)=r_0+t\\,v$", result: "Parametric $r(t)=r_0+t\\,v$", why: "this is the stated step in the plan's derivation" },
      { do: "distance from point $P$ to the line $=\\dfrac{\\lVert (P-r_0)\\times v\\rVert}{\\lVert v\\rVert}$ (the cross-product area ÷ base)", result: "distance from point $P$ to the line $=\\dfrac{\\lVert (P-r_0)\\times v\\rVert}{\\lVert v\\rVert}$ (the cross-product area ÷ base)", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "Ray in ray-tracing", background: "Ray in ray-tracing $r_0+t d$", numbers: "Ray in ray-tracing $r_0+t d$" },
      { title: "Embedding interpolation", background: "Embedding interpolation $r(t)=(1-t)a+tb$", numbers: "Embedding interpolation $r(t)=(1-t)a+tb$" },
      { title: "Nearest point on a line", background: "Nearest point on a line (projection)", numbers: "Nearest point on a line (projection)" },
      { title: "RANSAC residual = point-to-line distance", background: "$P=(3,0,0)$ to the $z$-axis $\\Rightarrow 3$", numbers: "RANSAC residual = point-to-line distance: $P=(3,0,0)$ to the $z$-axis $\\Rightarrow 3$" },
      { title: "Robot linear path", background: "Robot linear path", numbers: "Robot linear path" },
      { title: "GD trajectory as a ray", background: "GD trajectory as a ray in weight space", numbers: "GD trajectory as a ray in weight space" }
    ]
  },
  "math-02-05": {
    connectionsProse:
      "<p>This lesson extends the idea of a line to the flat surfaces used throughout multivariable geometry. You already have the dot product as a way to test perpendicularity, and that is enough to write the equation of a plane. A plane is determined by a point on it and a normal vector to it. This becomes the geometry behind linear decision boundaries, tangent planes, and half-space constraints.</p>",
    motivation:
      "<p>A plane can be described by saying which directions are allowed along the surface and which direction points straight out of it. The normal vector gives that straight-out direction. Any vector that lies inside the plane must be perpendicular to the normal, so its dot product with the normal is zero.</p>" +
      "<p>This same normal vector also gives distance from a point to the plane. The offset from the plane to the point may point partly along the plane and partly perpendicular to it. Projecting that offset onto the unit normal keeps only the perpendicular part, which is the shortest distance. This is why plane equations are so useful in classification and geometry.</p>",
    definition:
      "<p>$n\\!\\cdot\\!(r-r_0)=0\\Rightarrow ax+by+cz=d$; distance $=\\dfrac{|n\\!\\cdot\\!P-d|}{\\lVert n\\rVert}$ (project the offset onto the unit normal).</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$n=(a,b,c)$", desc: "normal" },
      { sym: "$d$", desc: "offset" },
      { sym: "$r_0$", desc: "a point on the plane" }
    ],
    derivation: [
      { do: "$n\\!\\cdot\\!(r-r_0)=0\\Rightarrow ax+by+cz=d$", result: "$n\\!\\cdot\\!(r-r_0)=0\\Rightarrow ax+by+cz=d$", why: "this is the stated step in the plan's derivation" },
      { do: "distance $=\\dfrac{|n\\!\\cdot\\!P-d|}{\\lVert n\\rVert}$ (project the offset onto the unit normal)", result: "distance $=\\dfrac{|n\\!\\cdot\\!P-d|}{\\lVert n\\rVert}$ (project the offset onto the unit normal)", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "SVM/logistic boundary", background: "SVM/logistic boundary $w^\\top x+b=0$", numbers: "SVM/logistic boundary $w^\\top x+b=0$" },
      { title: "Point-to-plane ICP residual", background: "Point-to-plane ICP residual (3-D registration)", numbers: "Point-to-plane ICP residual (3-D registration)" },
      { title: "PCA hyperplane", background: "PCA hyperplane (best-fit plane)", numbers: "PCA hyperplane (best-fit plane)" },
      { title: "Half-space constraint in LP", background: "Half-space constraint in LP", numbers: "Half-space constraint in LP" },
      { title: "Clipping plane in graphics", background: "Clipping plane in graphics", numbers: "Clipping plane in graphics" },
      { title: "Distance of $(3,0,0)$ to $2x+2y+z=1$", background: "$\\tfrac{|6-1|}{3}=1.667$", numbers: "Distance of $(3,0,0)$ to $2x+2y+z=1$: $\\tfrac{|6-1|}{3}=1.667$" }
    ]
  },
  "math-02-06": {
    connectionsProse:
      "<p>This lesson takes the single-variable function idea and lets the output be a whole vector. Instead of returning one height, the function returns a position with several coordinates. That makes it a natural language for paths through space, parameter trajectories, and animations. The derivative then becomes velocity, which leads into speed and arc length.</p>",
    motivation:
      "<p>A scalar-valued function gives one number for each input. A vector-valued function gives several numbers at once, such as the $x$, $y$, and $z$ coordinates of a moving point. As the parameter changes, those coordinates trace a curve through space.</p>" +
      "<p>Differentiation works one coordinate at a time. The difference quotient compares two nearby positions, divides by the change in the parameter, and then takes a limit. The result is a velocity vector, and its length is the speed along the path. This makes curves analyzable with the same derivative ideas you already know.</p>",
    definition:
      "<p>(1) $r(t)=\\langle x(t),y(t),z(t)\\rangle$. (2) Difference quotient $\\tfrac{r(t+h)-r(t)}{h}$ acts componentwise. (3) Limit ⇒ $r'(t)=\\langle x',y',z'\\rangle$; speed $=\\lVert r'\\rVert$.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$r(t)$", desc: "position" },
      { sym: "$r'(t)$", desc: "velocity" },
      { sym: "$\\lVert r'\\rVert$", desc: "speed" }
    ],
    derivation: [
      { do: "$r(t)=\\langle x(t),y(t),z(t)\\rangle$", result: "$r(t)=\\langle x(t),y(t),z(t)\\rangle$", why: "this is the stated step in the plan's derivation" },
      { do: "Difference quotient $\\tfrac{r(t+h)-r(t)}{h}$ acts componentwise", result: "Difference quotient $\\tfrac{r(t+h)-r(t)}{h}$ acts componentwise", why: "this is the stated step in the plan's derivation" },
      { do: "Limit", result: "$r'(t)=\\langle x',y',z'\\rangle$; speed $=\\lVert r'\\rVert$", why: "this is the next consequence in the plan's argument" }
    ],
    applications: [
      { title: "Latent-space interpolation path", background: "Latent-space interpolation path $r(t)$", numbers: "Latent-space interpolation path $r(t)$" },
      { title: "Optimizer trajectory", background: "Optimizer trajectory $\\theta(t)$ with speed $\\lVert\\theta'\\rVert$", numbers: "Optimizer trajectory $\\theta(t)$ with speed $\\lVert\\theta'\\rVert$" },
      { title: "Learning-rate schedule as a curve", background: "Learning-rate schedule as a curve", numbers: "Learning-rate schedule as a curve" },
      { title: "Bézier/animation curves", background: "Bézier/animation curves", numbers: "Bézier/animation curves" },
      { title: "Particle/physics trajectory", background: "Particle/physics trajectory", numbers: "Particle/physics trajectory" },
      { title: "Parametric data augmentation path", background: "Parametric data augmentation path", numbers: "Parametric data augmentation path" }
    ]
  },
  "math-02-07": {
    connectionsProse:
      "<p>This lesson builds on vector-valued functions by asking for the length of the path they trace. You already know how to measure straight-line distance between two points. For a curve, the strategy is to approximate it by many tiny straight segments. That limiting process becomes the arc-length integral, which later supports line integrals and path-based diagnostics.</p>",
    motivation:
      "<p>A curved path cannot be measured accurately by one straight segment unless the curve itself is almost straight. The standard method is to chop the parameter interval into many small pieces, measure each small chord, and add the chord lengths. As the pieces get smaller, the chords follow the curve more closely.</p>" +
      "<p>The derivative tells you the length of each tiny segment. Over a short time interval, the displacement is approximately velocity times the time step, so its length is speed times the time step. Adding those speeds and passing to the limit gives the integral of speed. Arc length is therefore accumulated motion along the curve.</p>",
    definition:
      "<p>(1) Chop $[a,b]$; each hop $\\lVert\\Delta r\\rVert\\approx\\lVert r'(t)\\rVert\\Delta t$. (2) Sum → integral: arc length $=\\int_a^b\\lVert r'(t)\\rVert\\,dt$.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$s$", desc: "arc length" },
      { sym: "$r'(t)$", desc: "velocity" },
      { sym: "unit", desc: "tangent $T=r'/\\lVert r'\\rVert$" }
    ],
    derivation: [
      { do: "Chop $[a,b]$; each hop $\\lVert\\Delta r\\rVert\\approx\\lVert r'(t)\\rVert\\Delta t$", result: "Chop $[a,b]$; each hop $\\lVert\\Delta r\\rVert\\approx\\lVert r'(t)\\rVert\\Delta t$", why: "this is the stated step in the plan's derivation" },
      { do: "Sum → integral", result: "arc length $=\\int_a^b\\lVert r'(t)\\rVert\\,dt$", why: "this names the corresponding formula or conclusion" }
    ],
    applications: [
      { title: "Helix $r=(\\cos t,\\sin t,t)$", background: "$\\lVert r'\\rVert=\\sqrt2$, length over $[0,2\\pi]=2\\sqrt2\\pi\\approx8.886$", numbers: "Helix $r=(\\cos t,\\sin t,t)$: $\\lVert r'\\rVert=\\sqrt2$, length over $[0,2\\pi]=2\\sqrt2\\pi\\approx8.886$" },
      { title: "Path length in robotics", background: "Path length in robotics", numbers: "Path length in robotics" },
      { title: "Training-trajectory length", background: "Training-trajectory length (a diagnostic)", numbers: "Training-trajectory length (a diagnostic)" },
      { title: "Road/cable length", background: "Road/cable length", numbers: "Road/cable length" },
      { title: "Tangent direction for Frenet frames", background: "Tangent direction for Frenet frames", numbers: "Tangent direction for Frenet frames" },
      { title: "Speed profile", background: "Speed profile $\\lVert r'\\rVert$ over time", numbers: "Speed profile $\\lVert r'\\rVert$ over time" }
    ]
  },
  "math-02-08": {
    connectionsProse:
      "<p>This lesson moves from curves to scalar functions with several inputs. You already know functions that take one input and return one output; now the input can be a vector of coordinates or parameters. The output is still a single number, such as a loss, intensity, density, or score. This is the main object studied by partial derivatives, gradients, level sets, and optimization.</p>",
    motivation:
      "<p>Many important quantities depend on more than one variable at a time. A model loss depends on all the weights, an image intensity depends on two pixel coordinates, and a revenue function may depend on price and spend. The function takes a point in a multidimensional domain and assigns a scalar value to it.</p>" +
      "<p>There are two common ways to visualize this information. The graph adds one output coordinate above the input space, while level sets mark all input points with the same output value. The graph and its contours are two views of the same function. Learning both views makes later ideas like gradients and constrained optimization easier to interpret.</p>",
    definition:
      "<p>Graph = $\\{(x,f(x))\\}$; a level set $f=c$ is the map's contour line — derive that the graph in $\\mathbb R^{n+1}$ and the contours in $\\mathbb R^n$ carry the same information.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$f(x_1,\\dots,x_n)$", desc: "as named in the plan" },
      { sym: "domain", desc: "$\\subseteq\\mathbb R^n$" },
      { sym: "output", desc: "a scalar" }
    ],
    derivation: [
      { do: "Graph = $\\{(x,f(x))\\}$", result: "Graph = $\\{(x,f(x))\\}$", why: "this is the stated step in the plan's derivation" },
      { do: "a level set $f=c$ is the map's contour line", result: "a level set $f=c$ is the map's contour line", why: "this is the stated step in the plan's derivation" },
      { do: "derive that the graph in $\\mathbb R^{n+1}$ and the contours in $\\mathbb R^n$ carry the same information", result: "derive that the graph in $\\mathbb R^{n+1}$ and the contours in $\\mathbb R^n$ carry the same information", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "Loss", background: "Loss $L(w)$", numbers: "Loss $L(w)$" },
      { title: "Image", background: "Image $I(x,y)$ = intensity", numbers: "Image $I(x,y)$ = intensity" },
      { title: "RBF kernel", background: "RBF kernel $k(x)=e^{-\\lVert x\\rVert^2}$", numbers: "RBF kernel $k(x)=e^{-\\lVert x\\rVert^2}$" },
      { title: "Revenue", background: "Revenue $f(\\text{price},\\text{spend})$", numbers: "Revenue $f(\\text{price},\\text{spend})$" },
      { title: "2-feature model score", background: "2-feature model score", numbers: "2-feature model score" },
      { title: "Gaussian bump density", background: "Gaussian bump density", numbers: "Gaussian bump density" }
    ]
  },
  "math-02-09": {
    connectionsProse:
      "<p>This lesson uses functions of several variables and turns their equal-output points into geometry. You have seen contour lines on maps; level sets are the same idea for any scalar function. They let a high-dimensional function be studied through slices where the value stays constant. Gradients, decision boundaries, and optimizer visualizations all rely on this picture.</p>",
    motivation:
      "<p>A level set collects all points where a function has one fixed value. For a height map, this gives contour lines; for a model score, it can give a decision boundary; for a loss, it gives the curves an optimizer crosses. The level set removes the output axis and shows where the same output occurs in input space.</p>" +
      "<p>The key geometric fact is that the gradient is perpendicular to a level set. If you move along the set, the function value does not change, so the directional derivative in that tangent direction is zero. Since directional derivatives are dot products with the gradient, tangent directions must be perpendicular to the gradient. This is why gradients point across contours rather than along them.</p>",
    definition:
      "<p>Contour $=f^{-1}(c)$; the gradient is perpendicular to it — moving along a contour keeps $f$ fixed, so the directional derivative is $0$, i.e. $\\nabla f\\!\\cdot\\!u=0$ (full argument in `02-13`).</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$f=c$", desc: "level set" },
      { sym: "$c$", desc: "the level" },
      { sym: "$\\nabla f$", desc: "normal to it" }
    ],
    derivation: [
      { do: "Contour $=f^{-1}(c)$", result: "Contour $=f^{-1}(c)$", why: "this is the stated step in the plan's derivation" },
      { do: "the gradient is perpendicular to it", result: "the gradient is perpendicular to it", why: "this is the stated step in the plan's derivation" },
      { do: "moving along a contour keeps $f$ fixed, so the directional derivative is $0$, i.e. $\\nabla f\\!\\cdot\\!u=0$ (full argument in `02-13`)", result: "moving along a contour keeps $f$ fixed, so the directional derivative is $0$, i.e. $\\nabla f\\!\\cdot\\!u=0$ (full argument in `02-13`)", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "Loss contours in an optimizer", background: "Loss contours in an optimizer viz", numbers: "Loss contours in an optimizer viz" },
      { title: "Decision boundary", background: "Decision boundary = level set of the score at 0", numbers: "Decision boundary = level set of the score at 0" },
      { title: "Gaussian confidence ellipses", background: "Gaussian confidence ellipses = level sets of the quadratic form", numbers: "Gaussian confidence ellipses = level sets of the quadratic form" },
      { title: "Indifference curves", background: "Indifference curves (econ)", numbers: "Indifference curves (econ)" },
      { title: "Isolines", background: "Isolines $f=x^2+y^2=25$ through $(3,4)$ and $(5,0)$", numbers: "Isolines $f=x^2+y^2=25$ through $(3,4)$ and $(5,0)$" },
      { title: "Equipotential lines of a field", background: "Equipotential lines of a field", numbers: "Equipotential lines of a field" }
    ]
  },
  "math-02-10": {
    connectionsProse:
      "<p>This lesson extends the limit idea from single-variable calculus to inputs with several coordinates. In one dimension, approaching a point means coming from the left or right. In several variables, there are many possible paths into the same point. That extra freedom makes multivariable limits more delicate and important for continuity and differentiability.</p>",
    motivation:
      "<p>A limit describes the value a function approaches near a point, not necessarily at the point itself. With several input variables, nearby points can approach along lines, curves, or more complicated paths. For the limit to exist, all of those approaches must settle on the same value.</p>" +
      "<p>This path agreement is the main new issue. To disprove a limit, it is enough to find two paths that produce different limiting values. To prove one, you need an argument that controls all paths at once. This distinction matters in numerical work because formulas that look harmless along one slice may behave differently along another.</p>",
    definition:
      "<p>Show $f(x,y)=\\dfrac{xy}{x^2+y^2}$ has no limit at $0$: (1) along the $x$-axis ($y=0$) $f=0$; (2) along $y=x$, $f=\\dfrac{x^2}{2x^2}=\\tfrac12$. Different path values ⇒ limit fails.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$\\lim_{(x,y)\\to(a,b)}$", desc: "as named in the plan" },
      { sym: "\"along", desc: "a path\"" },
      { sym: "agreement", desc: "across all paths" }
    ],
    derivation: [
      { do: "along the $x$-axis ($y=0$) $f=0$", result: "along the $x$-axis ($y=0$) $f=0$", why: "this is the stated step in the plan's derivation" },
      { do: "along $y=x$, $f=\\dfrac{x^2}{2x^2}=\\tfrac12$. Different path values", result: "limit fails", why: "this is the next consequence in the plan's argument" }
    ],
    applications: [
      { title: "0/0 in softmax near equal", background: "0/0 in softmax near equal logits", numbers: "0/0 in softmax near equal logits" },
      { title: "Gradient blow-up detection", background: "Gradient blow-up detection", numbers: "Gradient blow-up detection" },
      { title: "ReLU kink behavior at 0", background: "ReLU kink behavior at 0", numbers: "ReLU kink behavior at 0" },
      { title: "Numerical stability of a custom", background: "Numerical stability of a custom op near a singularity", numbers: "Numerical stability of a custom op near a singularity" },
      { title: "Loss continuity checks", background: "Loss continuity checks", numbers: "Loss continuity checks" },
      { title: "Batchnorm as variance→0", background: "Batchnorm as variance→0 (limit sensitivity)", numbers: "Batchnorm as variance→0 (limit sensitivity)" }
    ]
  },
  "math-02-11": {
    connectionsProse:
      "<p>This lesson follows multivariable limits by naming the functions whose nearby behavior matches their value. You already know that continuity means no sudden break in one-variable calculus. In several variables, the same idea applies, but the limit must agree from every direction. Continuity then supports stable optimization, interpolation, and modeling assumptions.</p>",
    motivation:
      "<p>A continuous function is one where small input changes produce small output changes. The formal test says that the limit at a point must equal the function's actual value there. In several variables, that limit is only valid when all paths into the point agree.</p>" +
      "<p>Continuity is weaker than differentiability but still very useful. A function can be continuous at a corner or kink even when no unique tangent plane exists there. Many machine learning functions are built from continuous pieces, which helps small parameter updates lead to controlled changes in the loss. The lesson also clarifies why continuity alone does not guarantee a gradient.</p>",
    definition:
      "<p>$f$ continuous at $a$ iff $\\lim_{x\\to a}f(x)=f(a)$; contrast with `02-10`'s path-broken example.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "limit", desc: "= value" },
      { sym: "neighborhood", desc: "as named in the plan" },
      { sym: "jump", desc: "as named in the plan" }
    ],
    derivation: [
      { do: "$f$ continuous at $a$ iff $\\lim_{x\\to a}f(x)=f(a)$", result: "$f$ continuous at $a$ iff $\\lim_{x\\to a}f(x)=f(a)$", why: "this is the stated step in the plan's derivation" },
      { do: "contrast with `02-10`'s path-broken example", result: "contrast with `02-10`'s path-broken example", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "Continuous loss ⇒ stable GD", background: "Continuous loss ⇒ stable GD", numbers: "Continuous loss ⇒ stable GD" },
      { title: "ReLU continuous but not differentiable", background: "ReLU continuous but not differentiable at 0", numbers: "ReLU continuous but not differentiable at 0" },
      { title: "Bilinear image interpolation continuity", background: "Bilinear image interpolation continuity", numbers: "Bilinear image interpolation continuity" },
      { title: "Kernel continuity", background: "Kernel continuity", numbers: "Kernel continuity" },
      { title: "Price elasticity smoothness", background: "Price elasticity smoothness", numbers: "Price elasticity smoothness" },
      { title: "Application 6", background: "$f=x^2+xy+2y^2$ continuous everywhere; $f(1,2)=11$ equals its limit", numbers: "$f=x^2+xy+2y^2$ continuous everywhere; $f(1,2)=11$ equals its limit" }
    ]
  },
  "math-02-12": {
    connectionsProse:
      "<p>This lesson takes the derivative idea and applies it one coordinate at a time. You already know how a derivative measures change along a line. For a function with several inputs, a partial derivative freezes all but one variable and measures the slope along that coordinate axis. These coordinate slopes are the pieces that form the gradient.</p>",
    motivation:
      "<p>When a function has many inputs, it is often useful to isolate one input's effect. A partial derivative does exactly that: change one variable by a tiny amount while holding the others fixed. The result answers a local sensitivity question for that one coordinate.</p>" +
      "<p>This is the basic operation behind training many-parameter models. Each weight has a partial derivative that tells how the loss changes if that weight alone is nudged. Collecting all those partials gives a vector of sensitivities, but the partial derivative itself remains a one-variable derivative taken along an axis. That makes the concept familiar even in high dimensions.</p>",
    definition:
      "<p>$\\dfrac{\\partial f}{\\partial x}=\\lim_{h\\to0}\\dfrac{f(x+h,y)-f(x,y)}{h}$; for $f=x^2+xy+2y^2$: expand $f(x+h,y)-f(x,y)=2xh+h^2+yh$, divide by $h$, let $h\\to0$ ⇒ $f_x=2x+y$. Likewise $f_y=x+4y$.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$\\partial$", desc: "(round-d) = \"holding the others fixed\"" },
      { sym: "$f_x$", desc: "shorthand" }
    ],
    derivation: [
      { do: "$\\dfrac{\\partial f}{\\partial x}=\\lim_{h\\to0}\\dfrac{f(x+h,y)-f(x,y)}{h}$", result: "$\\dfrac{\\partial f}{\\partial x}=\\lim_{h\\to0}\\dfrac{f(x+h,y)-f(x,y)}{h}$", why: "this is the stated step in the plan's derivation" },
      { do: "for $f=x^2+xy+2y^2$", result: "expand $f(x+h,y)-f(x,y)=2xh+h^2+yh$, divide by $h$, let $h\\to0$", why: "this names the corresponding formula or conclusion" },
      { do: "$f_x=2x+y$. Likewise $f_y=x+4y$", result: "$f_x=2x+y$. Likewise $f_y=x+4y$", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "One weight's effect on loss", background: "One weight's effect on loss $\\partial L/\\partial w_i$", numbers: "One weight's effect on loss $\\partial L/\\partial w_i$" },
      { title: "Backprop local derivative", background: "Backprop local derivative", numbers: "Backprop local derivative" },
      { title: "Finite-difference gradient check", background: "$[f(2.001)-f", numbers: "Finite-difference gradient check: $[f(2.001)-f" },
      { title: "]/0.001", background: "]/0.001$", numbers: "]/0.001$" },
      { title: "Image gradient", background: "Image gradient $\\partial I/\\partial x$ = vertical edges", numbers: "Image gradient $\\partial I/\\partial x$ = vertical edges" },
      { title: "Sensitivity of price", background: "Sensitivity of price", numbers: "Sensitivity of price" }
    ]
  },
  "math-02-13": {
    connectionsProse:
      "<p>This lesson builds directly on two things you have already seen: partial derivatives, and the dot product. A partial derivative measures the slope of $f$ along one axis; the gradient simply collects those slopes into a single vector. The dot product then does the rest of the work, because the rate of change in any direction turns out to be a dot product with the gradient.</p><p>It is worth knowing where this leads, because the gradient reappears constantly. Directional derivatives, tangent planes, and the Hessian are all built on it. In later topics it becomes the basis of gradient descent and backpropagation, and it is the central object in Lagrange multipliers.</p>",
    motivation:
      "<p>A partial derivative answers a narrow question: if you change one variable and hold the others fixed, how fast does $f$ change? That is useful, but a function of several variables can change in any direction, not just along the axes. We need a single object that captures how $f$ changes in every direction at once.</p><p>The gradient is that object. Consider a surface $z=f(x,y)$. The partial derivative $f_x$ is the slope in the $x$-direction, and $f_y$ is the slope in the $y$-direction. Collect them into one vector, $\\nabla f=\\langle f_x, f_y\\rangle$. This vector points in the direction of steepest increase of $f$, and its length $\\lVert\\nabla f\\rVert$ is that steepest rate. The opposite direction, $-\\nabla f$, is the direction of steepest decrease.</p><p>That last fact is why the gradient matters so much in machine learning. Training a model means reducing a loss function, and $-\\nabla f$ tells you the most direct way to reduce it. So although the gradient is defined simply, by collecting partial derivatives, it gives an optimizer the information it needs at every step.</p>",
    definition:
      "<p>Display the formula $\\nabla f=\\big\\langle \\tfrac{\\partial f}{\\partial x}, \\tfrac{\\partial f}{\\partial y}\\big\\rangle$, then the complete 8-step derivation of $D_uf=\\nabla f\\cdot u$, steepest-ascent, and ⊥-level-sets — written out in master E-1 (reuse verbatim).</p><p><b>Assumptions that matter:</b> partials exist; $u$ is unit; $-\\nabla f$ is the steepest *local* decrease (not global).</p>",
    symbols: [
      { sym: "$f_x=\\partial f/\\partial x$", desc: "is the slope with $y$ held fixed" },
      { sym: "$\\nabla f$", desc: "stacks the partials" },
      { sym: "$u$", desc: "is a *unit* direction so directions compare fairly" },
      { sym: "$\\theta$", desc: "is the angle between $u$ and $\\nabla f$" }
    ],
    derivation: [
      { do: "Display the formula $\\nabla f=\\big\\langle \\tfrac{\\partial f}{\\partial x}, \\tfrac{\\partial f}{\\partial y}\\big\\rangle$, then the complete 8-step derivation of $D_uf=\\nabla f\\cdot u$, steepest-ascent, and ⊥-level-sets", result: "Display the formula $\\nabla f=\\big\\langle \\tfrac{\\partial f}{\\partial x}, \\tfrac{\\partial f}{\\partial y}\\big\\rangle$, then the complete 8-step derivation of $D_uf=\\nabla f\\cdot u$, steepest-ascent, and ⊥-level-sets", why: "this is the stated step in the plan's derivation" },
      { do: "written out in master E-1 (reuse verbatim)", result: "written out in master E-1 (reuse verbatim)", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "Application 1", background: "$\\nabla f(1,2)=\\langle4,9\\rangle$", numbers: "$\\nabla f(1,2)=\\langle4,9\\rangle$" },
      { title: "GD step", background: "GD step $(1,2)-0.1\\langle4,9\\rangle=(0.6,1.1)$", numbers: "GD step $(1,2)-0.1\\langle4,9\\rangle=(0.6,1.1)$" },
      { title: "Application 3", background: "$\\nabla f\\perp$ contour", numbers: "$\\nabla f\\perp$ contour" },
      { title: "backprop", background: "backprop $\\nabla_wL=X^\\top(Xw-y)$", numbers: "backprop $\\nabla_wL=X^\\top(Xw-y)$" },
      { title: "directional rates", background: "directional rates $4$ and $9$", numbers: "directional rates $4$ and $9$" },
      { title: "saddle when", background: "saddle when $\\lVert\\nabla f\\rVert\\approx0$", numbers: "saddle when $\\lVert\\nabla f\\rVert\\approx0$" }
    ]
  },
  "math-02-14": {
    connectionsProse:
      "<p>This lesson uses the gradient from the model entry and asks for change in a chosen direction. You already know the gradient points toward steepest increase, but applications often care about a particular step direction. The directional derivative measures the rate along that direction. It is the bridge from gradients to line search, projections, and local sensitivity along feature combinations.</p>",
    motivation:
      "<p>A partial derivative measures change along a coordinate axis, and the gradient collects all coordinate rates. Sometimes the direction of interest is not an axis. It might be an optimizer step, a feasible motion under constraints, or a direction in image space.</p>" +
      "<p>The directional derivative uses the gradient to answer that more specific question. Taking the dot product with a unit direction keeps the component of the gradient along that direction. If the direction aligns with the gradient, the rate is largest; if it points opposite, the rate is most negative; if it is perpendicular, the rate is zero. The unit-length assumption matters because it makes different directions comparable.</p>",
    definition:
      "<p>$D_uf=\\nabla f\\!\\cdot\\!u$ (Move 1 of `02-13`); maximal when $u\\parallel\\nabla f$.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$u$", desc: "*unit* direction" },
      { sym: "$D_uf$", desc: "rate along $u$" }
    ],
    derivation: [
      { do: "$D_uf=\\nabla f\\!\\cdot\\!u$ (Move 1 of `02-13`)", result: "$D_uf=\\nabla f\\!\\cdot\\!u$ (Move 1 of `02-13`)", why: "this is the stated step in the plan's derivation" },
      { do: "maximal when $u\\parallel\\nabla f$", result: "maximal when $u\\parallel\\nabla f$", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "Line-search slope", background: "Line-search slope $g^\\top p$", numbers: "Line-search slope $g^\\top p$" },
      { title: "Projected-gradient rate along a feasible", background: "Projected-gradient rate along a feasible direction", numbers: "Projected-gradient rate along a feasible direction" },
      { title: "Directional finite difference", background: "Directional finite difference", numbers: "Directional finite difference" },
      { title: "Feature-combo sensitivity", background: "Feature-combo sensitivity", numbers: "Feature-combo sensitivity" },
      { title: "Edge response along an orientation", background: "Edge response along an orientation", numbers: "Edge response along an orientation" },
      { title: "At $(1,2)$", background: "toward $(1,0)\\Rightarrow4$, $(0,1)\\Rightarrow9$, $(0.6,0.8)\\Rightarrow9.6$", numbers: "At $(1,2)$: toward $(1,0)\\Rightarrow4$, $(0,1)\\Rightarrow9$, $(0.6,0.8)\\Rightarrow9.6$" }
    ]
  },
  "math-02-15": {
    connectionsProse:
      "<p>This lesson turns partial derivatives into the local flat model of a surface. You already know that a tangent line approximates a one-variable curve near a point. For a surface, the corresponding object is a tangent plane. It leads directly to linear approximation, Taylor expansion, and first-order optimization methods.</p>",
    motivation:
      "<p>A smooth surface may curve globally, but near one point it can be approximated by a flat plane. The partial derivatives give the slopes of that plane in the coordinate directions. Together with the surface point itself, those slopes determine the tangent plane.</p>" +
      "<p>The tangent plane is useful because it replaces a curved function with a simple linear expression nearby. This is the first-order view used whenever a model predicts how a small parameter change will affect a loss. The normal vector to the plane also connects the surface picture back to plane geometry and shading normals.</p>",
    definition:
      "<p>$z=f(a,b)+f_x(a,b)(x-a)+f_y(a,b)(y-b)$ — the plane through $(a,b,f(a,b))$ with the two partial slopes.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "tangent", desc: "plane" },
      { sym: "surface", desc: "normal $n=(-f_x,-f_y,1)$" }
    ],
    derivation: [
      { do: "$z=f(a,b)+f_x(a,b)(x-a)+f_y(a,b)(y-b)$", result: "$z=f(a,b)+f_x(a,b)(x-a)+f_y(a,b)(y-b)$", why: "this is the stated step in the plan's derivation" },
      { do: "the plane through $(a,b,f(a,b))$ with the two partial slopes", result: "the plane through $(a,b,f(a,b))$ with the two partial slopes", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "First-order Taylor for optimization", background: "First-order Taylor for optimization", numbers: "First-order Taylor for optimization" },
      { title: "Shading normal", background: "Shading normal $(-f_x,-f_y,1)$", numbers: "Shading normal $(-f_x,-f_y,1)$" },
      { title: "Local linear surrogate", background: "Local linear surrogate (LIME-style)", numbers: "Local linear surrogate (LIME-style)" },
      { title: "Newton step setup", background: "Newton step setup", numbers: "Newton step setup" },
      { title: "Linearized dynamics", background: "Linearized dynamics", numbers: "Linearized dynamics" },
      { title: "$f=x^2+xy+2y^2$ at $(1,2)$", background: "$z=11+4(x-1)+9(y-2)$", numbers: "$f=x^2+xy+2y^2$ at $(1,2)$: $z=11+4(x-1)+9(y-2)$" }
    ]
  },
  "math-02-16": {
    connectionsProse:
      "<p>This lesson continues the tangent-plane idea and writes it as a practical approximation formula. You already have the gradient as a vector of local slopes. Multiplying it by a small input change predicts the corresponding output change. This first-order approximation becomes a standard tool for sensitivity analysis, trust regions, and error estimates.</p>",
    motivation:
      "<p>Evaluating a complicated function exactly can be expensive, but near a known point the function often behaves almost linearly. The tangent plane gives that local linear model. Instead of recomputing the full function, you use the current value plus the gradient's predicted change.</p>" +
      "<p>The approximation is most reliable for small steps because the terms it ignores are second order in the step size. That means halving the step tends to shrink the neglected error much faster than the step itself. This is why linear approximation is useful for local reasoning but must be treated carefully far from the base point.</p>",
    definition:
      "<p>From the tangent plane: $f(a+\\Delta)\\approx f(a)+\\nabla f(a)\\!\\cdot\\!\\Delta$; the error is $O(\\lVert\\Delta\\rVert^2)$ (the leftover second-order Taylor term).</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$\\Delta$", desc: "small step" },
      { sym: "$\\nabla f\\!\\cdot\\!\\Delta$", desc: "predicted change" }
    ],
    derivation: [
      { do: "From the tangent plane", result: "$f(a+\\Delta)\\approx f(a)+\\nabla f(a)\\!\\cdot\\!\\Delta$", why: "this names the corresponding formula or conclusion" },
      { do: "the error is $O(\\lVert\\Delta\\rVert^2)$ (the leftover second-order Taylor term)", result: "the error is $O(\\lVert\\Delta\\rVert^2)$ (the leftover second-order Taylor term)", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "First-order loss change under a", background: "First-order loss change under a weight step", numbers: "First-order loss change under a weight step" },
      { title: "Error propagation / delta method", background: "Error propagation / delta method", numbers: "Error propagation / delta method" },
      { title: "Trust-region model", background: "Trust-region model", numbers: "Trust-region model" },
      { title: "Fast surrogate of expensive", background: "Fast surrogate of expensive $f$", numbers: "Fast surrogate of expensive $f$" },
      { title: "Sensitivity budget", background: "Sensitivity budget", numbers: "Sensitivity budget" },
      { title: "Application 6", background: "$f(1.1,2.1)\\approx11+4(0.1)+9(0.1)=12.30$ vs true $12.34$", numbers: "$f(1.1,2.1)\\approx11+4(0.1)+9(0.1)=12.30$ vs true $12.34$" }
    ]
  },
  "math-02-17": {
    connectionsProse:
      "<p>This lesson extends the chain rule to functions with several intermediate variables. You already know that derivatives multiply through a one-variable composition. In multivariable settings, one upstream change can reach the output through several paths. Adding those path contributions is the core mechanism behind backpropagation.</p>",
    motivation:
      "<p>A composed function often has an outside function depending on intermediate quantities, and those intermediate quantities depend on an earlier variable. When the earlier variable changes, each intermediate changes, and each of those changes affects the final output. The total derivative must collect every route by which the change travels.</p>" +
      "<p>The multivariable chain rule expresses this as a weighted sum. Each partial derivative of the outside function measures sensitivity to one intermediate, and each derivative of the intermediate measures how the upstream variable affects it. In vector form this becomes a dot product or a Jacobian multiplication. Autodiff systems are built around applying this rule repeatedly.</p>",
    definition:
      "<p>For $z=f(x(t),y(t))$: (1) total change $dz=f_x\\,dx+f_y\\,dy$; (2) divide by $dt$ ⇒ $\\dfrac{dz}{dt}=f_x\\dfrac{dx}{dt}+f_y\\dfrac{dy}{dt}$; (3) vector form $\\dfrac{dz}{dt}=\\nabla f\\!\\cdot\\!\\dfrac{dr}{dt}$; many inputs ⇒ multiply by the Jacobian.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "intermediate", desc: "$x,y$" },
      { sym: "upstream", desc: "$t$" },
      { sym: "sum", desc: "over paths" }
    ],
    derivation: [
      { do: "total change $dz=f_x\\,dx+f_y\\,dy$", result: "total change $dz=f_x\\,dx+f_y\\,dy$", why: "this is the stated step in the plan's derivation" },
      { do: "divide by $dt$", result: "$\\dfrac{dz}{dt}=f_x\\dfrac{dx}{dt}+f_y\\dfrac{dy}{dt}$", why: "this is the next consequence in the plan's argument" },
      { do: "vector form $\\dfrac{dz}{dt}=\\nabla f\\!\\cdot\\!\\dfrac{dr}{dt}$; many inputs", result: "multiply by the Jacobian", why: "this is the next consequence in the plan's argument" }
    ],
    applications: [
      { title: "Backpropagation", background: "Backpropagation (the whole algorithm)", numbers: "Backpropagation (the whole algorithm)" },
      { title: "Reparameterization gradient", background: "Reparameterization gradient (VAE)", numbers: "Reparameterization gradient (VAE)" },
      { title: "JVP/VJP in autodiff", background: "JVP/VJP in autodiff", numbers: "JVP/VJP in autodiff" },
      { title: "Backprop-through-time", background: "Backprop-through-time (RNN)", numbers: "Backprop-through-time (RNN)" },
      { title: "Change-of-variable density", background: "Change-of-variable density", numbers: "Change-of-variable density" },
      { title: "$z=x^2+y^2$, $x=t,y=t^2$", background: "$\\tfrac{dz}{dt}=2t+4t^3$; at $t=1\\Rightarrow6$", numbers: "$z=x^2+y^2$, $x=t,y=t^2$: $\\tfrac{dz}{dt}=2t+4t^3$; at $t=1\\Rightarrow6$" }
    ]
  },
  "math-02-18": {
    connectionsProse:
      "<p>This lesson generalizes the derivative to vector-output functions. You already know the gradient for a scalar output; a vector output has one scalar component for each row. The Jacobian stacks the gradients of all components into a matrix. This is the local linear map used in coordinate changes, robotics, normalizing flows, and autodiff.</p>",
    motivation:
      "<p>When a function returns several outputs, a single gradient is not enough. Each output can respond differently to each input variable. The Jacobian records all of those partial derivatives in a rectangular matrix, with rows corresponding to outputs and columns to inputs.</p>" +
      "<p>Near a point, the Jacobian acts like the best linear approximation to the function. A small input displacement is multiplied by the Jacobian to predict the output displacement. This is why Jacobians appear in forward kinematics and in neural network layers. They are the multivariable derivative written in the language of linear maps.</p>",
    definition:
      "<p>Stack the partials: $J_{ij}=\\dfrac{\\partial F_i}{\\partial x_j}$; then $F(a+\\Delta)\\approx F(a)+J\\Delta$ is the best local linear map (each row is one output's gradient).</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$J\\in\\mathbb R^{m\\times n}$", desc: "as named in the plan" },
      { sym: "rows", desc: "= output gradients" }
    ],
    derivation: [
      { do: "Stack the partials", result: "$J_{ij}=\\dfrac{\\partial F_i}{\\partial x_j}$", why: "this names the corresponding formula or conclusion" },
      { do: "then $F(a+\\Delta)\\approx F(a)+J\\Delta$ is the best local linear map (each row is one output's gradient)", result: "then $F(a+\\Delta)\\approx F(a)+J\\Delta$ is the best local linear map (each row is one output's gradient)", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "Layer local linearization in backprop", background: "Layer local linearization in backprop", numbers: "Layer local linearization in backprop" },
      { title: "VJP/JVP primitives", background: "VJP/JVP primitives", numbers: "VJP/JVP primitives" },
      { title: "Change of variables (needs", background: "Change of variables (needs $\\det J$)", numbers: "Change of variables (needs $\\det J$)" },
      { title: "Forward kinematics", background: "Forward kinematics (robotics)", numbers: "Forward kinematics (robotics)" },
      { title: "Normalizing-flow Jacobian", background: "Normalizing-flow Jacobian", numbers: "Normalizing-flow Jacobian" },
      { title: "$F=(x^2y,\\,x+y)$", background: "$J(1,2)=\\begin{bmatrix}4&1\\1&1\\end{bmatrix}$, $\\det=3$", numbers: "$F=(x^2y,\\,x+y)$: $J(1,2)=\\begin{bmatrix}4&1\\1&1\\end{bmatrix}$, $\\det=3$" }
    ]
  },
  "math-02-19": {
    connectionsProse:
      "<p>This lesson studies what happens after taking partial derivatives more than once. You already know second derivatives measure how slopes change. In several variables, there are pure second partials and mixed second partials. The equality of mixed partials under mild smoothness conditions is what makes Hessian matrices symmetric.</p>",
    motivation:
      "<p>A first partial derivative measures slope in one coordinate direction. Taking another partial derivative measures how that slope changes as another coordinate moves. When the two coordinates are different, the result is a mixed partial derivative.</p>" +
      "<p>For sufficiently smooth functions, differentiating first in one variable and then the other gives the same answer as doing the order in reverse. This is Clairaut's theorem. The result is not just a computational shortcut; it explains the symmetry of the Hessian and simplifies curvature analysis. Most smooth losses used in calculus-based optimization are designed to live in this setting.</p>",
    definition:
      "<p>Clairaut's theorem: if $f_{xy},f_{yx}$ are continuous then $f_{xy}=f_{yx}$; verify on $f=x^2+xy+2y^2$: $f_{xy}=\\partial_y(2x+y)=1=\\partial_x(x+4y)=f_{yx}$.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$f_{xy}=\\partial^2 f/\\partial y\\partial x$", desc: "as named in the plan" },
      { sym: "mixed", desc: "partial" }
    ],
    derivation: [
      { do: "Clairaut's theorem", result: "if $f_{xy},f_{yx}$ are continuous then $f_{xy}=f_{yx}$", why: "this names the corresponding formula or conclusion" },
      { do: "verify on $f=x^2+xy+2y^2$", result: "$f_{xy}=\\partial_y(2x+y)=1=\\partial_x(x+4y)=f_{yx}$", why: "this names the corresponding formula or conclusion" }
    ],
    applications: [
      { title: "Symmetric Hessian", background: "Symmetric Hessian", numbers: "Symmetric Hessian" },
      { title: "Curvature of a surface", background: "Curvature of a surface", numbers: "Curvature of a surface" },
      { title: "PDE stencils", background: "PDE stencils (2nd-order)", numbers: "PDE stencils (2nd-order)" },
      { title: "Second-order optimization", background: "Second-order optimization", numbers: "Second-order optimization" },
      { title: "Mixed sensitivity", background: "Mixed sensitivity $\\partial^2L/\\partial w_i\\partial w_j$", numbers: "Mixed sensitivity $\\partial^2L/\\partial w_i\\partial w_j$" },
      { title: "Gaussian-curvature setup", background: "Gaussian-curvature setup (`02` → diff-geo)", numbers: "Gaussian-curvature setup (`02` → diff-geo)" }
    ]
  },
  "math-02-20": {
    connectionsProse:
      "<p>This lesson collects second partial derivatives into the matrix that describes local curvature. You already have the gradient for local slope and higher-order partials for how those slopes change. The Hessian organizes those curvature measurements in one object. It leads to Newton's method, convexity tests, and saddle-point classification.</p>",
    motivation:
      "<p>The gradient tells the direction of first-order change, but it does not say whether the surface is bending upward, downward, or differently in different directions. The Hessian supplies that second-order information. Each entry tells how one component of the gradient changes as one input coordinate changes.</p>" +
      "<p>The quadratic form built from the Hessian measures curvature along a displacement. If it is positive in every direction, the surface bends like a bowl; if negative in every direction, like a dome; if mixed, like a saddle. Eigenvalues make this directional behavior precise. This is why curvature, conditioning, and second-order optimization all use the Hessian.</p>",
    definition:
      "<p>(1) Collect second partials $H_{ij}=\\partial^2f/\\partial x_i\\partial x_j$ (symmetric by `02-19`). (2) Second-order model $f(a+\\Delta)\\approx f(a)+g^\\top\\Delta+\\tfrac12\\Delta^\\top H\\Delta$. (3) The sign of $\\Delta^\\top H\\Delta$ (eigenvalues of $H$) decides min/max/saddle.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$H=\\nabla^2f$", desc: "as named in the plan" },
      { sym: "eigenvalues", desc: "$\\lambda_i$" },
      { sym: "quadratic", desc: "form $\\Delta^\\top H\\Delta$" }
    ],
    derivation: [
      { do: "Collect second partials $H_{ij}=\\partial^2f/\\partial x_i\\partial x_j$ (symmetric by `02-19`)", result: "Collect second partials $H_{ij}=\\partial^2f/\\partial x_i\\partial x_j$ (symmetric by `02-19`)", why: "this is the stated step in the plan's derivation" },
      { do: "Second-order model $f(a+\\Delta)\\approx f(a)+g^\\top\\Delta+\\tfrac12\\Delta^\\top H\\Delta$", result: "Second-order model $f(a+\\Delta)\\approx f(a)+g^\\top\\Delta+\\tfrac12\\Delta^\\top H\\Delta$", why: "this is the stated step in the plan's derivation" },
      { do: "The sign of $\\Delta^\\top H\\Delta$ (eigenvalues of $H$) decides min/max/saddle", result: "The sign of $\\Delta^\\top H\\Delta$ (eigenvalues of $H$) decides min/max/saddle", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "Newton step", background: "Newton step $-H^{-1}g$", numbers: "Newton step $-H^{-1}g$" },
      { title: "Convexity test", background: "Convexity test $H\\succeq0$", numbers: "Convexity test $H\\succeq0$" },
      { title: "Condition number", background: "Condition number $\\lambda_{\\max}/\\lambda_{\\min}$ sets GD speed", numbers: "Condition number $\\lambda_{\\max}/\\lambda_{\\min}$ sets GD speed" },
      { title: "Saddle detection", background: "Saddle detection (indefinite)", numbers: "Saddle detection (indefinite)" },
      { title: "Sharpness of a minimum", background: "Sharpness of a minimum (generalization)", numbers: "Sharpness of a minimum (generalization)" },
      { title: "$f=x^2+xy+2y^2$", background: "$H=\\begin{bmatrix}2&1\\1&4\\end{bmatrix}$, eigenvalues $3\\pm\\sqrt2\\approx1.586,\\,4.414>0$ ⇒ convex bowl", numbers: "$f=x^2+xy+2y^2$: $H=\\begin{bmatrix}2&1\\1&4\\end{bmatrix}$, eigenvalues $3\\pm\\sqrt2\\approx1.586,\\,4.414>0$ ⇒ convex bowl" }
    ]
  },
  "math-02-21": {
    connectionsProse:
      "<p>This lesson combines the gradient and Hessian into a local polynomial model. You already know one-variable Taylor expansion as a way to approximate a function near a point. In several variables, the step direction is a vector, so the first-order term uses the gradient and the second-order term uses the Hessian. This quadratic model underlies Newton methods, trust regions, and curvature-based uncertainty.</p>",
    motivation:
      "<p>A complicated smooth function can often be understood locally by keeping only its most important terms near a base point. The constant term gives the value at the base point. The gradient term predicts linear change, and the Hessian term adds the leading curvature correction.</p>" +
      "<p>One clean way to derive the formula is to restrict the function to a line through the base point. Along that line, ordinary one-variable Taylor expansion applies. Translating the derivatives of that line function back into multivariable notation gives the gradient dot product and the Hessian quadratic form. The result is a compact local model for many algorithms.</p>",
    definition:
      "<p>Apply the 1-D Taylor of $g(s)=f(a+s\\Delta)$ at $s=0$: $g(0)+g'(0)+\\tfrac12g''(0)$ with $g'(0)=\\nabla f\\!\\cdot\\!\\Delta$, $g''(0)=\\Delta^\\top H\\Delta$ ⇒ $f(a+\\Delta)\\approx f(a)+\\nabla f^\\top\\Delta+\\tfrac12\\Delta^\\top H\\Delta$.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "first-order", desc: "term $\\nabla f^\\top\\Delta$" },
      { sym: "second-order", desc: "$\\tfrac12\\Delta^\\top H\\Delta$" }
    ],
    derivation: [
      { do: "Apply the 1-D Taylor of $g(s)=f(a+s\\Delta)$ at $s=0$", result: "$g(0)+g'(0)+\\tfrac12g''(0)$ with $g'(0)=\\nabla f\\!\\cdot\\!\\Delta$, $g''(0)=\\Delta^\\top H\\Delta$", why: "this names the corresponding formula or conclusion" },
      { do: "$f(a+\\Delta)\\approx f(a)+\\nabla f^\\top\\Delta+\\tfrac12\\Delta^\\top H\\Delta$", result: "$f(a+\\Delta)\\approx f(a)+\\nabla f^\\top\\Delta+\\tfrac12\\Delta^\\top H\\Delta$", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "Newton / second-order optimization", background: "Newton / second-order optimization", numbers: "Newton / second-order optimization" },
      { title: "Laplace approximation of a posterior", background: "Laplace approximation of a posterior", numbers: "Laplace approximation of a posterior" },
      { title: "Trust-region subproblem", background: "Trust-region subproblem", numbers: "Trust-region subproblem" },
      { title: "Gauss–Newton / LM", background: "Gauss–Newton / LM", numbers: "Gauss–Newton / LM" },
      { title: "Uncertainty via curvature", background: "Uncertainty via curvature", numbers: "Uncertainty via curvature" },
      { title: "For a quadratic it's *exact*", background: "$f(1+\\Delta)=11+(4,9)\\Delta+\\tfrac12\\Delta^\\top\\begin{bmatrix}2&1\\1&4\\end{bmatrix}\\Delta$", numbers: "For a quadratic it's *exact*: $f(1+\\Delta)=11+(4,9)\\Delta+\\tfrac12\\Delta^\\top\\begin{bmatrix}2&1\\1&4\\end{bmatrix}\\Delta$" }
    ]
  },
  "math-02-22": {
    connectionsProse:
      "<p>This lesson applies gradients and Hessians to the basic problem of finding optima without constraints. You already know a one-variable minimum has derivative zero when it occurs at an interior smooth point. In several variables, every directional derivative must vanish, which means the gradient is zero. The Hessian then helps classify what kind of critical point was found.</p>",
    motivation:
      "<p>At a local minimum, there should be no small direction in which moving decreases the function. If one direction had a negative directional derivative, a small step that way would lower the value. The opposite direction rules out positive directional derivatives as well, so all local directional rates must be zero.</p>" +
      "<p>Since directional derivatives are dot products with the gradient, the only vector perpendicular to every direction is the zero vector. Thus interior smooth optima must be critical points. That condition is necessary, not sufficient: saddles and maxima can also have zero gradient. The Hessian supplies the next layer of information needed for classification.</p>",
    definition:
      "<p>At a local min every directional derivative is $\\ge0$ and its negative also $\\ge0$ ⇒ $D_uf=\\nabla f\\!\\cdot\\!u=0$ for all $u$ ⇒ $\\nabla f=0$; then classify with $H$ (`02-24`).</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "critical", desc: "point $\\nabla f=0$" },
      { sym: "classification", desc: "via $H$" }
    ],
    derivation: [
      { do: "At a local min every directional derivative is $\\ge0$ and its negative also $\\ge0$", result: "At a local min every directional derivative is $\\ge0$ and its negative also $\\ge0$", why: "this is the stated step in the plan's derivation" },
      { do: "$D_uf=\\nabla f\\!\\cdot\\!u=0$ for all $u$", result: "$D_uf=\\nabla f\\!\\cdot\\!u=0$ for all $u$", why: "this is the stated step in the plan's derivation" },
      { do: "$\\nabla f=0$", result: "$\\nabla f=0$", why: "this is the stated step in the plan's derivation" },
      { do: "then classify with $H$ (`02-24`)", result: "then classify with $H$ (`02-24`)", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "Training stationarity (convergence check", background: "Training stationarity (convergence check $\\lVert\\nabla f\\rVert<\\varepsilon$)", numbers: "Training stationarity (convergence check $\\lVert\\nabla f\\rVert<\\varepsilon$)" },
      { title: "Normal equations", background: "$\\nabla\\lVert Xw-y\\rVert^2=0\\Rightarrow X^\\top Xw=X^\\top y$", numbers: "Normal equations: $\\nabla\\lVert Xw-y\\rVert^2=0\\Rightarrow X^\\top Xw=X^\\top y$" },
      { title: "MLE score", background: "MLE score $=0$", numbers: "MLE score $=0$" },
      { title: "Saddle-heavy DL landscapes", background: "Saddle-heavy DL landscapes", numbers: "Saddle-heavy DL landscapes" },
      { title: "Ridge stationary point", background: "Ridge stationary point", numbers: "Ridge stationary point" },
      { title: "$f=x^2+xy+2y^2$", background: "$\\nabla f=0\\Rightarrow(0,0)$, $H\\succ0$ ⇒ min, $f=0$", numbers: "$f=x^2+xy+2y^2$: $\\nabla f=0\\Rightarrow(0,0)$, $H\\succ0$ ⇒ min, $f=0$" }
    ]
  },
  "math-02-23": {
    connectionsProse:
      "<p>This lesson focuses on critical points that are not minima or maxima. You already know the Hessian records curvature in different directions. A saddle point has upward curvature in some directions and downward curvature in others. This distinction is especially important in high-dimensional optimization landscapes.</p>",
    motivation:
      "<p>A zero gradient can make a point look stationary, but stationary does not mean optimal. At a saddle, first-order change vanishes, yet nearby directions behave differently. Moving one way increases the function while moving another way decreases it.</p>" +
      "<p>The Hessian detects this through mixed-sign eigenvalues. Along an eigenvector with positive eigenvalue, the quadratic model bends upward; along one with negative eigenvalue, it bends downward. That combination prevents the point from being a local minimum or maximum. In optimization, negative-curvature directions can provide escape routes from such points.</p>",
    definition:
      "<p>With $\\nabla f=0$, look at $\\Delta^\\top H\\Delta$: if $H$ has mixed-sign eigenvalues it's positive along one eigenvector and negative along another ⇒ saddle. Example $f=x^2-y^2$: $H=\\mathrm{diag}(2,-2)$.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "indefinite", desc: "$H$" },
      { sym: "escape", desc: "direction = negative-eigenvalue eigenvector" }
    ],
    derivation: [
      { do: "With $\\nabla f=0$, look at $\\Delta^\\top H\\Delta$", result: "if $H$ has mixed-sign eigenvalues it's positive along one eigenvector and negative along another", why: "this names the corresponding formula or conclusion" },
      { do: "saddle. Example $f=x^2-y^2$", result: "$H=\\mathrm{diag}(2,-2)$", why: "this names the corresponding formula or conclusion" }
    ],
    applications: [
      { title: "DL loss saddles", background: "DL loss saddles", numbers: "DL loss saddles" },
      { title: "SGD noise escapes saddles", background: "SGD noise escapes saddles", numbers: "SGD noise escapes saddles" },
      { title: "GAN saddle equilibria", background: "GAN saddle equilibria", numbers: "GAN saddle equilibria" },
      { title: "PCA as a saddle problem", background: "PCA as a saddle problem on the sphere", numbers: "PCA as a saddle problem on the sphere" },
      { title: "Minimax saddle", background: "Minimax saddle", numbers: "Minimax saddle" },
      { title: "$f=x^2-y^2$", background: "eigenvalues $2,-2$ ⇒ saddle at $0$", numbers: "$f=x^2-y^2$: eigenvalues $2,-2$ ⇒ saddle at $0$" }
    ]
  },
  "math-02-24": {
    connectionsProse:
      "<p>This lesson turns Hessian eigenvalues into a classification rule for critical points. You already know the one-variable second-derivative test. The multivariable version checks curvature in every direction, not just along one axis. Definiteness is the language for making that all-directions statement precise.</p>",
    motivation:
      "<p>At a critical point, the linear term in Taylor's expansion disappears, so the second-order term becomes the leading local behavior. That term is the Hessian quadratic form. Its sign across all nonzero directions determines the shape near the point.</p>" +
      "<p>If the quadratic form is always positive, the surface rises in every small direction and the point is a local minimum. If it is always negative, the surface falls in every small direction and the point is a local maximum. If it has both signs, the point is a saddle. Eigenvalues make this test practical because diagonalizing the Hessian separates the independent curvature directions.</p>",
    definition:
      "<p>$\\Delta^\\top H\\Delta=\\sum_i\\lambda_i(\\,q_i^\\top\\Delta)^2$ (diagonalize $H$): all $\\lambda_i>0$ ⇒ positive for every $\\Delta$ ⇒ min; all $<0$ ⇒ max; mixed ⇒ saddle.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "positive-definite", desc: "$H\\succ0$" },
      { sym: "eigenvalues", desc: "$\\lambda_i$" }
    ],
    derivation: [
      { do: "$\\Delta^\\top H\\Delta=\\sum_i\\lambda_i(\\,q_i^\\top\\Delta)^2$ (diagonalize $H$)", result: "all $\\lambda_i>0$", why: "this names the corresponding formula or conclusion" },
      { do: "positive for every $\\Delta$", result: "positive for every $\\Delta$", why: "this is the stated step in the plan's derivation" },
      { do: "min", result: "min", why: "this is the stated step in the plan's derivation" },
      { do: "all $<0$", result: "all $<0$", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "Convexity certificate", background: "Convexity certificate", numbers: "Convexity certificate" },
      { title: "Newton safeguarding (fix non-PD", background: "Newton safeguarding (fix non-PD $H$)", numbers: "Newton safeguarding (fix non-PD $H$)" },
      { title: "Covariance PSD check", background: "Covariance PSD check", numbers: "Covariance PSD check" },
      { title: "Kernel/Gram matrix PD", background: "Kernel/Gram matrix PD (valid kernel)", numbers: "Kernel/Gram matrix PD (valid kernel)" },
      { title: "GP validity", background: "GP validity", numbers: "GP validity" },
      { title: "Application 6", background: "$\\mathrm{diag}(2,200)\\succ0$ ⇒ min; $\\mathrm{diag}(2,-2)$ indefinite ⇒ saddle", numbers: "$\\mathrm{diag}(2,200)\\succ0$ ⇒ min; $\\mathrm{diag}(2,-2)$ indefinite ⇒ saddle" }
    ]
  },
  "math-02-25": {
    connectionsProse:
      "<p>This lesson adds equality constraints to optimization. You already know that an unconstrained optimum has zero gradient because all directions are available. With a constraint, only tangent directions along the constraint are allowed. Lagrange multipliers express the condition that the objective has no improving component along those feasible directions.</p>",
    motivation:
      "<p>A constrained optimum must lie on the constraint surface. At that point, you cannot move in every direction; you can only move along directions that keep the constraint satisfied to first order. These feasible directions are tangent to the constraint surface and perpendicular to the constraint gradient.</p>" +
      "<p>If the objective could increase or decrease along one of those tangent directions, the point would not be optimal under the constraint. Therefore the objective gradient must have no tangential component. The only remaining direction is normal to the constraint surface, so the objective gradient must be parallel to the constraint gradient. The scalar of proportionality is the Lagrange multiplier.</p>",
    definition:
      "<p>On $g=0$, feasible moves are tangent ($\\nabla g\\!\\cdot\\!u=0$). At an optimum no feasible move improves $f$ ⇒ $\\nabla f\\!\\cdot\\!u=0$ for all such $u$ ⇒ $\\nabla f$ has no tangential part ⇒ $\\nabla f=\\lambda\\nabla g$.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "multiplier", desc: "$\\lambda$" },
      { sym: "constraint", desc: "$g=0$" },
      { sym: "parallel", desc: "gradients" }
    ],
    derivation: [
      { do: "On $g=0$, feasible moves are tangent ($\\nabla g\\!\\cdot\\!u=0$). At an optimum no feasible move improves $f$", result: "On $g=0$, feasible moves are tangent ($\\nabla g\\!\\cdot\\!u=0$). At an optimum no feasible move improves $f$", why: "this is the stated step in the plan's derivation" },
      { do: "$\\nabla f\\!\\cdot\\!u=0$ for all such $u$", result: "$\\nabla f\\!\\cdot\\!u=0$ for all such $u$", why: "this is the stated step in the plan's derivation" },
      { do: "$\\nabla f$ has no tangential part", result: "$\\nabla f$ has no tangential part", why: "this is the stated step in the plan's derivation" },
      { do: "$\\nabla f=\\lambda\\nabla g$", result: "$\\nabla f=\\lambda\\nabla g$", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "SVM dual", background: "SVM dual (max margin under constraints)", numbers: "SVM dual (max margin under constraints)" },
      { title: "Max-entropy ⇒ softmax", background: "Max-entropy ⇒ softmax", numbers: "Max-entropy ⇒ softmax" },
      { title: "Constrained MLE", background: "Constrained MLE", numbers: "Constrained MLE" },
      { title: "Portfolio with a budget line", background: "Portfolio with a budget line", numbers: "Portfolio with a budget line" },
      { title: "Equality-constrained least squares", background: "Equality-constrained least squares", numbers: "Equality-constrained least squares" },
      { title: "$\\max xy$ s.t. $x+y=10$", background: "$(y,x)=\\lambda(1,1)\\Rightarrow x=y=5,\\ \\lambda=5,\\ f=25$", numbers: "$\\max xy$ s.t. $x+y=10$: $(y,x)=\\lambda(1,1)\\Rightarrow x=y=5,\\ \\lambda=5,\\ f=25$" }
    ]
  },
  "math-02-26": {
    connectionsProse:
      "<p>This lesson extends the definite integral from intervals to regions in the plane. You already know a one-variable integral accumulates area under a curve. A double integral accumulates values over many tiny area patches. It is the basic tool for 2-D probability, image averages, centroids, and planar mass.</p>",
    motivation:
      "<p>To integrate over a region in the plane, divide the region into small rectangles or other tiny patches. On each patch, the function is nearly constant, so its contribution is approximately value times area. Adding all contributions and refining the grid gives the double integral.</p>" +
      "<p>Fubini's theorem makes many double integrals practical. Under suitable conditions, the two-dimensional accumulation can be computed as two ordinary one-dimensional integrals, one inside the other. This turns area-based accumulation into repeated familiar calculus. The region and the order of integration carry the geometry of the problem.</p>",
    definition:
      "<p>Grid the region, sum $f(x_i,y_j)\\,\\Delta A$, refine ⇒ $\\iint_R f\\,dA$; Fubini lets you do it as two 1-D integrals.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$dA=dx\\,dy$", desc: "as named in the plan" },
      { sym: "iterated", desc: "integral" },
      { sym: "region", desc: "$R$" }
    ],
    derivation: [
      { do: "Grid the region, sum $f(x_i,y_j)\\,\\Delta A$, refine", result: "Grid the region, sum $f(x_i,y_j)\\,\\Delta A$, refine", why: "this is the stated step in the plan's derivation" },
      { do: "$\\iint_R f\\,dA$", result: "$\\iint_R f\\,dA$", why: "this is the stated step in the plan's derivation" },
      { do: "Fubini lets you do it as two 1-D integrals", result: "Fubini lets you do it as two 1-D integrals", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "2-D probability", background: "2-D probability $P((X,Y)\\in R)=\\iint p$", numbers: "2-D probability $P((X,Y)\\in R)=\\iint p$" },
      { title: "Expected value", background: "Expected value $\\iint xy\\,p$", numbers: "Expected value $\\iint xy\\,p$" },
      { title: "Marginalization", background: "Marginalization $\\int p(x,y)\\,dy$", numbers: "Marginalization $\\int p(x,y)\\,dy$" },
      { title: "Image average intensity over a", background: "Image average intensity over a patch", numbers: "Image average intensity over a patch" },
      { title: "Centroid/area", background: "Centroid/area", numbers: "Centroid/area" },
      { title: "Application 6", background: "$\\iint_{[0,1]^2}(x+y)\\,dA=1$; $\\iint xy=\\tfrac14$", numbers: "$\\iint_{[0,1]^2}(x+y)\\,dA=1$; $\\iint xy=\\tfrac14$" }
    ]
  },
  "math-02-27": {
    connectionsProse:
      "<p>This lesson takes the same accumulation idea into three-dimensional solids. You already know double integrals over planar regions. Triple integrals add values over small volume elements instead. They are used for densities, voxel data, mass, charge, and normalization over solid regions.</p>",
    motivation:
      "<p>A triple integral divides a solid into many tiny boxes. The function's value on each box is multiplied by the box's volume, and those contributions are summed. As the boxes shrink, the sum approaches the total accumulation over the solid.</p>" +
      "<p>The computation is often written as three iterated one-variable integrals. Each limit describes how the solid is swept out in one coordinate direction. This keeps the idea close to the double integral while adding one more dimension. The main new work is describing the region accurately.</p>",
    definition:
      "<p>Refine a 3-D grid: $\\iiint_V f\\,dV$, iterated as three 1-D integrals.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$dV=dx\\,dy\\,dz$", desc: "as named in the plan" },
      { sym: "solid", desc: "$V$" }
    ],
    derivation: [
      { do: "Refine a 3-D grid", result: "$\\iiint_V f\\,dV$, iterated as three 1-D integrals", why: "this names the corresponding formula or conclusion" }
    ],
    applications: [
      { title: "3-D probability over a region", background: "3-D probability over a region", numbers: "3-D probability over a region" },
      { title: "Voxel/3-D conv aggregation", background: "Voxel/3-D conv aggregation", numbers: "Voxel/3-D conv aggregation" },
      { title: "Mass/charge", background: "Mass/charge", numbers: "Mass/charge" },
      { title: "Moment of inertia", background: "Moment of inertia", numbers: "Moment of inertia" },
      { title: "Normalizing a 3-D density", background: "Normalizing a 3-D density", numbers: "Normalizing a 3-D density" },
      { title: "Application 6", background: "$\\iiint_{[0,1]^3}xyz\\,dV=\\tfrac18$; $\\iiint 1=1$", numbers: "$\\iiint_{[0,1]^3}xyz\\,dV=\\tfrac18$; $\\iiint 1=1$" }
    ]
  },
  "math-02-28": {
    connectionsProse:
      "<p>This lesson connects integration with coordinate transformations. You already have the Jacobian as the local linear map of a transformation. When coordinates change, small areas or volumes are stretched by the determinant of that map. The change-of-variables formula accounts for that stretch so integrals keep the same total meaning.</p>",
    motivation:
      "<p>Changing coordinates can make a region or integrand much simpler. Polar coordinates, for example, describe disks more naturally than rectangular coordinates. But a small rectangle in the new coordinates may not have the same area after it is mapped into the original coordinates.</p>" +
      "<p>The Jacobian determinant supplies the correction factor. Its absolute value measures how much tiny area or volume is scaled by the transformation. Multiplying by that factor ensures the integral accumulates the right amount in the original space. This same idea is central in normalizing flows, where density changes are tracked through invertible maps.</p>",
    definition:
      "<p>A tiny box $dx\\,dy$ maps to a parallelogram of area $|\\det J|\\,du\\,dv$ (the Jacobian columns are its edges) ⇒ $\\iint f\\,dA=\\iint (f\\circ g)\\,|\\det J|\\,du\\,dv$.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$J=\\partial(x,y)/\\partial(u,v)$", desc: "as named in the plan" },
      { sym: "$|\\det J|$", desc: "area scale" }
    ],
    derivation: [
      { do: "A tiny box $dx\\,dy$ maps to a parallelogram of area $|\\det J|\\,du\\,dv$ (the Jacobian columns are its edges)", result: "A tiny box $dx\\,dy$ maps to a parallelogram of area $|\\det J|\\,du\\,dv$ (the Jacobian columns are its edges)", why: "this is the stated step in the plan's derivation" },
      { do: "$\\iint f\\,dA=\\iint (f\\circ g)\\,|\\det J|\\,du\\,dv$", result: "$\\iint f\\,dA=\\iint (f\\circ g)\\,|\\det J|\\,du\\,dv$", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "Normalizing flows", background: "$p_x(x)=p_z(z)\\,|\\det \\partial z/\\partial x|$", numbers: "Normalizing flows: $p_x(x)=p_z(z)\\,|\\det \\partial z/\\partial x|$" },
      { title: "Polar/spherical integration", background: "Polar/spherical integration", numbers: "Polar/spherical integration" },
      { title: "Reparameterization", background: "Reparameterization $z=\\mu+\\sigma\\epsilon$", numbers: "Reparameterization $z=\\mu+\\sigma\\epsilon$" },
      { title: "Gaussian integral via polar", background: "Gaussian integral via polar", numbers: "Gaussian integral via polar" },
      { title: "Whitening transform", background: "Whitening transform", numbers: "Whitening transform" },
      { title: "Polar Jacobian", background: "Polar Jacobian $=r$; area of unit disk $=\\int_0^{2\\pi}\\!\\!\\int_0^1 r\\,dr\\,d\\theta=\\pi$", numbers: "Polar Jacobian $=r$; area of unit disk $=\\int_0^{2\\pi}\\!\\!\\int_0^1 r\\,dr\\,d\\theta=\\pi$" }
    ]
  },
  "math-02-29": {
    connectionsProse:
      "<p>This lesson isolates the area-scaling part of the change-of-variables formula. You already know the Jacobian matrix gives the local linear approximation to a transformation. The determinant of that matrix tells how the local grid cell changes in size and orientation. This makes it essential for invertibility, coordinate changes, and density transformations.</p>",
    motivation:
      "<p>Near a point, a smooth transformation behaves almost like its Jacobian matrix. The columns of that matrix show where the coordinate basis directions are sent. In two dimensions, those image vectors span a small parallelogram; in three dimensions, they span a small parallelepiped.</p>" +
      "<p>The determinant measures the signed area or volume scale of that linear image. Its absolute value tells how much size changes, while its sign records whether orientation is preserved or flipped. If the determinant is zero, the transformation collapses local area or volume, so it cannot be locally invertible in the usual smooth way. This is why the determinant carries both geometric and analytic information.</p>",
    definition:
      "<p>1. Near a point, a map $F$ acts like its Jacobian $J$ (from `02-18`). 2. $J$ sends the unit square's edge vectors to the columns of $J$. 3. The area of the parallelogram they span is $|\\det J|$ — the geometric meaning of a $2\\times2$ determinant. 4. So a small region of area $dA$ maps to one of area $|\\det J|\\,dA$. 5. The sign of $\\det J$ is positive if the edge vectors keep their orientation and negative if they flip.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$J=\\partial(x,y)/\\partial(u,v)$", desc: "Jacobian matrix" },
      { sym: "$\\det J$", desc: "its determinant" },
      { sym: "$|\\det J|$", desc: "area/volume scale" }
    ],
    derivation: [
      { do: "Near a point, a map $F$ acts like its Jacobian $J$ (from `02-18`)", result: "Near a point, a map $F$ acts like its Jacobian $J$ (from `02-18`)", why: "this is the stated step in the plan's derivation" },
      { do: "$J$ sends the unit square's edge vectors to the columns of $J$", result: "$J$ sends the unit square's edge vectors to the columns of $J$", why: "this is the stated step in the plan's derivation" },
      { do: "The area of the parallelogram they span is $|\\det J|$ — the geometric meaning of a $2\\times2$ determinant", result: "The area of the parallelogram they span is $|\\det J|$ — the geometric meaning of a $2\\times2$ determinant", why: "this is the stated step in the plan's derivation" },
      { do: "So a small region of area $dA$ maps to one of area $|\\det J|\\,dA$", result: "So a small region of area $dA$ maps to one of area $|\\det J|\\,dA$", why: "this is the stated step in the plan's derivation" },
      { do: "The sign of $\\det J$ is positive if the edge vectors keep their orientation and negative if they flip", result: "The sign of $\\det J$ is positive if the edge vectors keep their orientation and negative if they flip", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "Change-of-variables area factor", background: "Change-of-variables area factor (used in `02-28`)", numbers: "Change-of-variables area factor (used in `02-28`)" },
      { title: "Normalizing-flow log-density adds", background: "Normalizing-flow log-density adds $\\log|\\det J|$", numbers: "Normalizing-flow log-density adds $\\log|\\det J|$" },
      { title: "Invertibility of a layer requires", background: "Invertibility of a layer requires $\\det J\\neq0$", numbers: "Invertibility of a layer requires $\\det J\\neq0$" },
      { title: "For", background: "For $F=(x^2y,x+y)$, $\\det J(1,2)=3$ so areas triple near $(1,2)$", numbers: "For $F=(x^2y,x+y)$, $\\det J(1,2)=3$ so areas triple near $(1,2)$" },
      { title: "A rotation has", background: "A rotation has $\\det J=1$ (area-preserving)", numbers: "A rotation has $\\det J=1$ (area-preserving)" },
      { title: "A reflection has", background: "A reflection has $\\det J=-1$ (orientation flipped)", numbers: "A reflection has $\\det J=-1$ (orientation flipped)" }
    ]
  },
  "math-02-30": {
    connectionsProse:
      "<p>This lesson introduces coordinates adapted to an axis. You already know polar coordinates for the plane. Cylindrical coordinates keep that polar description in the horizontal plane and add an ordinary height coordinate. They are useful whenever the geometry repeats around an axis.</p>",
    motivation:
      "<p>A point in cylindrical coordinates is described by a radius from the central axis, an angle around that axis, and a height. This matches cylinders, pipes, rotating flows, and many axially symmetric regions. Instead of describing a round object with awkward rectangular bounds, the coordinate system follows the shape.</p>" +
      "<p>The volume element includes the same radius factor that appears in polar area. As the radius grows, a small change in angle sweeps a longer arc, so the corresponding patch has larger area. Multiplying the polar area element by height thickness gives the cylindrical volume element. That factor is the main adjustment needed when integrating.</p>",
    definition:
      "<p>1. Use polar coordinates in the plane: $x=r\\cos\\theta$, $y=r\\sin\\theta$, and keep $z$. 2. The planar area element is $r\\,dr\\,d\\theta$ (the polar Jacobian). 3. Multiplying by $dz$ gives the volume element $dV=r\\,dr\\,d\\theta\\,dz$.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$r$", desc: "radius from the axis" },
      { sym: "$\\theta$", desc: "angle" },
      { sym: "$z$", desc: "height" },
      { sym: "$dV$", desc: "volume element" }
    ],
    derivation: [
      { do: "Use polar coordinates in the plane", result: "$x=r\\cos\\theta$, $y=r\\sin\\theta$, and keep $z$", why: "this names the corresponding formula or conclusion" },
      { do: "The planar area element is $r\\,dr\\,d\\theta$ (the polar Jacobian)", result: "The planar area element is $r\\,dr\\,d\\theta$ (the polar Jacobian)", why: "this is the stated step in the plan's derivation" },
      { do: "Multiplying by $dz$ gives the volume element $dV=r\\,dr\\,d\\theta\\,dz$", result: "Multiplying by $dz$ gives the volume element $dV=r\\,dr\\,d\\theta\\,dz$", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "A cylinder of radius", background: "A cylinder of radius $1$, height $2$ has volume $\\int_0^2\\!\\int_0^{2\\pi}\\!\\int_0^1 r\\,dr\\,d\\theta\\,dz=2\\pi$", numbers: "A cylinder of radius $1$, height $2$ has volume $\\int_0^2\\!\\int_0^{2\\pi}\\!\\int_0^1 r\\,dr\\,d\\theta\\,dz=2\\pi$" },
      { title: "Axially-symmetric density integration", background: "Axially-symmetric density integration", numbers: "Axially-symmetric density integration" },
      { title: "3-D histogram bins around an", background: "3-D histogram bins around an axis", numbers: "3-D histogram bins around an axis" },
      { title: "CT/MRI reconstruction geometry", background: "CT/MRI reconstruction geometry", numbers: "CT/MRI reconstruction geometry" },
      { title: "Rotational-flow fields", background: "Rotational-flow fields", numbers: "Rotational-flow fields" },
      { title: "Pipe/annulus volumes", background: "Pipe/annulus volumes", numbers: "Pipe/annulus volumes" }
    ]
  },
  "math-02-31": {
    connectionsProse:
      "<p>This lesson introduces coordinates adapted to a center. You already know cylindrical coordinates for axis symmetry. Spherical coordinates describe position by distance from the origin and two angles, which fits balls, shells, radial densities, and directions on a sphere. The volume element records how shells grow with radius and how latitude circles shrink near the poles.</p>",
    motivation:
      "<p>A point in spherical coordinates is located by first choosing a radius, then choosing a direction using two angles. This is natural for problems where distance from the origin matters more than separate $x$, $y$, and $z$ coordinates. Balls and isotropic distributions become much easier to describe.</p>" +
      "<p>The volume element has two geometric factors. The $r^2$ factor reflects that spherical shells have area growing like radius squared. The $\\sin\\phi$ factor reflects that circles of constant polar angle are smaller near the poles. Together these factors make sure integration in spherical coordinates counts actual volume correctly.</p>",
    definition:
      "<p>1. Write $x=r\\sin\\phi\\cos\\theta$, $y=r\\sin\\phi\\sin\\theta$, $z=r\\cos\\phi$. 2. Compute the Jacobian determinant of this map. 3. It equals $r^2\\sin\\phi$, so $dV=r^2\\sin\\phi\\,dr\\,d\\phi\\,d\\theta$; the $r^2$ is why volume grows fast with radius and $\\sin\\phi$ accounts for shrinking longitude circles near the poles.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$r$", desc: "radius" },
      { sym: "$\\phi$", desc: "polar angle from the $z$-axis" },
      { sym: "$\\theta$", desc: "azimuth" },
      { sym: "$dV$", desc: "volume element" }
    ],
    derivation: [
      { do: "Write $x=r\\sin\\phi\\cos\\theta$, $y=r\\sin\\phi\\sin\\theta$, $z=r\\cos\\phi$", result: "Write $x=r\\sin\\phi\\cos\\theta$, $y=r\\sin\\phi\\sin\\theta$, $z=r\\cos\\phi$", why: "this is the stated step in the plan's derivation" },
      { do: "Compute the Jacobian determinant of this map", result: "Compute the Jacobian determinant of this map", why: "this is the stated step in the plan's derivation" },
      { do: "It equals $r^2\\sin\\phi$, so $dV=r^2\\sin\\phi\\,dr\\,d\\phi\\,d\\theta$; the $r^2$ is why volume grows fast with radius and $\\sin\\phi$ accounts for shrinking longitude circles near the poles", result: "It equals $r^2\\sin\\phi$, so $dV=r^2\\sin\\phi\\,dr\\,d\\phi\\,d\\theta$; the $r^2$ is why volume grows fast with radius and $\\sin\\phi$ accounts for shrinking longitude circles near the poles", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "Unit-ball volume", background: "Unit-ball volume $\\int_0^{2\\pi}\\!\\int_0^{\\pi}\\!\\int_0^1 r^2\\sin\\phi\\,dr\\,d\\phi\\,d\\theta=\\tfrac43\\pi\\approx4.19$", numbers: "Unit-ball volume $\\int_0^{2\\pi}\\!\\int_0^{\\pi}\\!\\int_0^1 r^2\\sin\\phi\\,dr\\,d\\phi\\,d\\theta=\\tfrac43\\pi\\approx4.19$" },
      { title: "Normalizing a 3-D isotropic Gaussian", background: "Normalizing a 3-D isotropic Gaussian", numbers: "Normalizing a 3-D isotropic Gaussian" },
      { title: "Solid-angle integrals", background: "Solid-angle integrals", numbers: "Solid-angle integrals" },
      { title: "Direction embeddings on the sphere", background: "Direction embeddings on the sphere $S^2$", numbers: "Direction embeddings on the sphere $S^2$" },
      { title: "Radial basis functions", background: "Radial basis functions", numbers: "Radial basis functions" },
      { title: "Gravitational/Coulomb potentials", background: "Gravitational/Coulomb potentials", numbers: "Gravitational/Coulomb potentials" }
    ]
  },
  "math-02-32": {
    connectionsProse:
      "<p>This lesson introduces the object that divergence, curl, and line integrals act on. You already know scalar functions assign one number to each point. A vector field assigns a whole vector to each point instead. That lets calculus describe flows, forces, gradients, and directions that vary across space.</p>",
    motivation:
      "<p>A vector field can be pictured as an arrow attached to every point in a region. The arrow might show velocity in a fluid, force on a particle, or the direction a loss decreases most rapidly. The important feature is that the vector changes with position.</p>" +
      "<p>There is no theorem to prove in this lesson because the goal is to name and understand the object. Once a field is defined, later operations ask different questions about it: divergence measures spreading, curl measures rotation, and line or surface integrals measure accumulation along paths or across surfaces. The field is the common input to all of those ideas.</p>",
    definition:
      "<p>explain-only — this introduces an object, not a theorem.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$F(x,y)=\\langle P,Q\\rangle$", desc: "or $F(x,y,z)=\\langle P,Q,R\\rangle$" },
      { sym: "each", desc: "component is a scalar function of position" }
    ],
    applications: [
      { title: "The negative-gradient field", background: "The negative-gradient field $-\\nabla L$ that gradient descent follows", numbers: "The negative-gradient field $-\\nabla L$ that gradient descent follows" },
      { title: "Fluid velocity fields", background: "Fluid velocity fields", numbers: "Fluid velocity fields" },
      { title: "Electric/force fields", background: "Electric/force fields", numbers: "Electric/force fields" },
      { title: "Image gradient fields in vision", background: "Image gradient fields in vision", numbers: "Image gradient fields in vision" },
      { title: "Wind/flow visualization", background: "Wind/flow visualization", numbers: "Wind/flow visualization" },
      { title: "The score", background: "The score $\\nabla_x\\log p(x)$ field in diffusion models", numbers: "The score $\\nabla_x\\log p(x)$ field in diffusion models" }
    ]
  },
  "math-02-33": {
    connectionsProse:
      "<p>This lesson studies one of the two basic local measurements of a vector field. You already know a vector field assigns a vector to each point. Divergence asks whether the field is locally flowing outward, inward, or neither. It connects vector calculus to conservation laws, probability flow, and the Laplacian.</p>",
    motivation:
      "<p>Imagine a tiny box around a point in a vector field. If more flow leaves the box than enters it, the point behaves like a source. If more enters than leaves, it behaves like a sink. Divergence measures that net outward flow per unit volume.</p>" +
      "<p>The formula adds the coordinate-wise rates at which each field component expands in its own direction. Positive divergence indicates local spreading; negative divergence indicates local compression; zero divergence indicates incompressible behavior at that point. This local quantity becomes global through the divergence theorem and appears throughout PDEs and flow models.</p>",
    definition:
      "<p>1. Consider flux out of a tiny box around a point. 2. The net outflow in the $x$-direction is $\\partial P/\\partial x$ times the box volume, and similarly for $y,z$. 3. Summing and dividing by the volume gives $\\nabla\\!\\cdot\\!F=\\partial P/\\partial x+\\partial Q/\\partial y+\\partial R/\\partial z$.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$\\nabla\\!\\cdot\\!F$", desc: "divergence (a scalar)" },
      { sym: "$P,Q,R$", desc: "field components" }
    ],
    derivation: [
      { do: "Consider flux out of a tiny box around a point", result: "Consider flux out of a tiny box around a point", why: "this is the stated step in the plan's derivation" },
      { do: "The net outflow in the $x$-direction is $\\partial P/\\partial x$ times the box volume, and similarly for $y,z$", result: "The net outflow in the $x$-direction is $\\partial P/\\partial x$ times the box volume, and similarly for $y,z$", why: "this is the stated step in the plan's derivation" },
      { do: "Summing and dividing by the volume gives $\\nabla\\!\\cdot\\!F=\\partial P/\\partial x+\\partial Q/\\partial y+\\partial R/\\partial z$", result: "Summing and dividing by the volume gives $\\nabla\\!\\cdot\\!F=\\partial P/\\partial x+\\partial Q/\\partial y+\\partial R/\\partial z$", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "Fokker–Planck probability-flow term", background: "Fokker–Planck probability-flow term", numbers: "Fokker–Planck probability-flow term" },
      { title: "Continuity equation", background: "Continuity equation (mass conservation)", numbers: "Continuity equation (mass conservation)" },
      { title: "Application 3", background: "$\\nabla\\!\\cdot\\!\\nabla f=\\Delta f$ the Laplacian", numbers: "$\\nabla\\!\\cdot\\!\\nabla f=\\Delta f$ the Laplacian" },
      { title: "For", background: "For $F=(x^2,xy,z)$, $\\nabla\\!\\cdot\\!F=3x+1$, at $(1,1,1)$ equals $4$", numbers: "For $F=(x^2,xy,z)$, $\\nabla\\!\\cdot\\!F=3x+1$, at $(1,1,1)$ equals $4$" },
      { title: "Source/sink detection in flows", background: "Source/sink detection in flows", numbers: "Source/sink detection in flows" },
      { title: "Incompressible fields have", background: "Incompressible fields have $\\nabla\\!\\cdot\\!F=0$", numbers: "Incompressible fields have $\\nabla\\!\\cdot\\!F=0$" }
    ]
  },
  "math-02-34": {
    connectionsProse:
      "<p>This lesson gives the other basic local measurement of a vector field. You already know divergence measures spreading out or compressing in. Curl measures local rotation. It prepares the way for conservative fields, vorticity, Maxwell-type equations, and Stokes' theorem.</p>",
    motivation:
      "<p>A vector field can move around a point in a way that tends to spin a tiny paddle wheel. Curl measures that local spinning tendency. In three dimensions, rotation can happen around different axes, so curl is itself a vector whose direction gives the axis of rotation.</p>" +
      "<p>The components of curl come from circulation in the coordinate planes. Each component compares how one field component changes across the perpendicular coordinate with how the other component changes back. When these imbalances are nonzero, the field has local rotational structure. When curl vanishes on a suitable region, the field may come from a potential function.</p>",
    definition:
      "<p>1. Measure circulation around a tiny loop in each coordinate plane. 2. Circulation per unit area in the $xy$-plane is $\\partial Q/\\partial x-\\partial P/\\partial y$. 3. Stacking the three plane components gives $\\nabla\\times F=\\langle R_y-Q_z,\\,P_z-R_x,\\,Q_x-P_y\\rangle$.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$\\nabla\\times F$", desc: "curl (a vector)" },
      { sym: "subscripts", desc: "denote partial derivatives" }
    ],
    derivation: [
      { do: "Measure circulation around a tiny loop in each coordinate plane", result: "Measure circulation around a tiny loop in each coordinate plane", why: "this is the stated step in the plan's derivation" },
      { do: "Circulation per unit area in the $xy$-plane is $\\partial Q/\\partial x-\\partial P/\\partial y$", result: "Circulation per unit area in the $xy$-plane is $\\partial Q/\\partial x-\\partial P/\\partial y$", why: "this is the stated step in the plan's derivation" },
      { do: "Stacking the three plane components gives $\\nabla\\times F=\\langle R_y-Q_z,\\,P_z-R_x,\\,Q_x-P_y\\rangle$", result: "Stacking the three plane components gives $\\nabla\\times F=\\langle R_y-Q_z,\\,P_z-R_x,\\,Q_x-P_y\\rangle$", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "Conservative-field test", background: "$\\nabla\\times F=0$ means a potential exists", numbers: "Conservative-field test: $\\nabla\\times F=0$ means a potential exists" },
      { title: "Vorticity in fluids", background: "Vorticity in fluids", numbers: "Vorticity in fluids" },
      { title: "Helmholtz decomposition", background: "Helmholtz decomposition", numbers: "Helmholtz decomposition" },
      { title: "For", background: "For $F=(-y,x,0)$, $\\nabla\\times F=(0,0,2)$ — uniform rotation", numbers: "For $F=(-y,x,0)$, $\\nabla\\times F=(0,0,2)$ — uniform rotation" },
      { title: "Maxwell's equations", background: "Maxwell's equations", numbers: "Maxwell's equations" },
      { title: "Detecting rotational structure in flow", background: "Detecting rotational structure in flow data", numbers: "Detecting rotational structure in flow data" }
    ]
  },
  "math-02-35": {
    connectionsProse:
      "<p>This lesson combines vector fields with paths. You already know arc length adds scalar contributions along a curve. A line integral of a vector field adds the field's component in the direction of travel. This gives the mathematical form of work, circulation, and path-dependent cost.</p>",
    motivation:
      "<p>As a particle moves along a curve, a vector field may help, oppose, or be perpendicular to the motion at each point. The dot product with the small displacement keeps only the component of the field along the path. Adding those components over the whole path gives the line integral.</p>" +
      "<p>Parametrization turns the geometric path into an ordinary integral in one variable. The velocity vector supplies the small displacement direction and scale. For conservative fields, the integral depends only on endpoints; for more general fields, the path itself matters. This distinction becomes important in Green's and Stokes' theorems.</p>",
    definition:
      "<p>1. Break the path into small steps $d\\mathbf r$. 2. Work over each step is $F\\!\\cdot\\!d\\mathbf r$. 3. Parametrize by $t$: $d\\mathbf r=\\mathbf r'(t)\\,dt$. 4. Sum to an integral: $\\int_C F\\!\\cdot\\!d\\mathbf r=\\int_a^b F(\\mathbf r(t))\\!\\cdot\\!\\mathbf r'(t)\\,dt$.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$C$", desc: "path" },
      { sym: "$\\mathbf r(t)$", desc: "parametrization" },
      { sym: "$F\\!\\cdot\\!d\\mathbf r$", desc: "infinitesimal work" }
    ],
    derivation: [
      { do: "Break the path into small steps $d\\mathbf r$", result: "Break the path into small steps $d\\mathbf r$", why: "this is the stated step in the plan's derivation" },
      { do: "Work over each step is $F\\!\\cdot\\!d\\mathbf r$", result: "Work over each step is $F\\!\\cdot\\!d\\mathbf r$", why: "this is the stated step in the plan's derivation" },
      { do: "Parametrize by $t$", result: "$d\\mathbf r=\\mathbf r'(t)\\,dt$", why: "this names the corresponding formula or conclusion" },
      { do: "Sum to an integral", result: "$\\int_C F\\!\\cdot\\!d\\mathbf r=\\int_a^b F(\\mathbf r(t))\\!\\cdot\\!\\mathbf r'(t)\\,dt$", why: "this names the corresponding formula or conclusion" }
    ],
    applications: [
      { title: "Work done by a force", background: "Work done by a force along a path", numbers: "Work done by a force along a path" },
      { title: "Path-dependent cost/energy", background: "Path-dependent cost/energy", numbers: "Path-dependent cost/energy" },
      { title: "Circulation", background: "Circulation $\\oint F\\!\\cdot\\!d\\mathbf r$", numbers: "Circulation $\\oint F\\!\\cdot\\!d\\mathbf r$" },
      { title: "For conservative", background: "For conservative $F=(y,x)$ (potential $xy$), work from $(0,0)$ to $(2,3)$ is $6$, independent of path", numbers: "For conservative $F=(y,x)$ (potential $xy$), work from $(0,0)$ to $(2,3)$ is $6$, independent of path" },
      { title: "Recovering a potential from its", background: "Recovering a potential from its field", numbers: "Recovering a potential from its field" },
      { title: "Arc-length integrals as a special", background: "Arc-length integrals as a special case", numbers: "Arc-length integrals as a special case" }
    ]
  },
  "math-02-36": {
    connectionsProse:
      "<p>This lesson relates a closed curve in the plane to the region it encloses. You already know line integrals measure circulation along a path, and double integrals accumulate values over a region. Green's theorem says these two views are connected. It is the planar prototype for Stokes' theorem.</p>",
    motivation:
      "<p>A vector field can circulate around the boundary of a region because of rotational behavior inside the region. Green's theorem makes this precise by converting the boundary circulation into an area integral of a curl-like scalar. It lets you compute a boundary quantity from interior information, or the other way around.</p>" +
      "<p>The theorem also explains several practical area formulas. With a carefully chosen field, the line integral around a curve returns the area inside it. More broadly, it shows how local rotation accumulates into total circulation around the boundary. This boundary-interior relationship is one of the central themes of vector calculus.</p>",
    definition:
      "<p>1. State $\\oint_{\\partial R}(P\\,dx+Q\\,dy)=\\iint_R\\big(\\tfrac{\\partial Q}{\\partial x}-\\tfrac{\\partial P}{\\partial y}\\big)\\,dA$. 2. For a vertically simple region, integrate $-\\partial P/\\partial y$ over $y$ and apply the fundamental theorem of calculus to recover the top/bottom boundary pieces of $\\oint P\\,dx$. 3. Do the symmetric argument for $Q$ over $x$. 4. Add the two results to get the full identity.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$\\partial R$", desc: "boundary curve (counterclockwise)" },
      { sym: "$P,Q$", desc: "field components" },
      { sym: "$dA$", desc: "area element" }
    ],
    derivation: [
      { do: "State $\\oint_{\\partial R}(P\\,dx+Q\\,dy)=\\iint_R\\big(\\tfrac{\\partial Q}{\\partial x}-\\tfrac{\\partial P}{\\partial y}\\big)\\,dA$", result: "State $\\oint_{\\partial R}(P\\,dx+Q\\,dy)=\\iint_R\\big(\\tfrac{\\partial Q}{\\partial x}-\\tfrac{\\partial P}{\\partial y}\\big)\\,dA$", why: "this is the stated step in the plan's derivation" },
      { do: "For a vertically simple region, integrate $-\\partial P/\\partial y$ over $y$ and apply the fundamental theorem of calculus to recover the top/bottom boundary pieces of $\\oint P\\,dx$", result: "For a vertically simple region, integrate $-\\partial P/\\partial y$ over $y$ and apply the fundamental theorem of calculus to recover the top/bottom boundary pieces of $\\oint P\\,dx$", why: "this is the stated step in the plan's derivation" },
      { do: "Do the symmetric argument for $Q$ over $x$", result: "Do the symmetric argument for $Q$ over $x$", why: "this is the stated step in the plan's derivation" },
      { do: "Add the two results to get the full identity", result: "Add the two results to get the full identity", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "Area from boundary", background: "$\\tfrac12\\oint(x\\,dy-y\\,dx)=\\mathrm{Area}$", numbers: "Area from boundary: $\\tfrac12\\oint(x\\,dy-y\\,dx)=\\mathrm{Area}$" },
      { title: "For", background: "For $\\oint(-y\\,dx+x\\,dy)$ on the unit disk the value is $2\\,\\mathrm{Area}=2\\pi$", numbers: "For $\\oint(-y\\,dx+x\\,dy)$ on the unit disk the value is $2\\,\\mathrm{Area}=2\\pi$" },
      { title: "Planimeter instruments", background: "Planimeter instruments", numbers: "Planimeter instruments" },
      { title: "2-D circulation", background: "2-D circulation = integral of curl", numbers: "2-D circulation = integral of curl" },
      { title: "Image moments from contours", background: "Image moments from contours", numbers: "Image moments from contours" },
      { title: "Shoelace polygon-area formula as the", background: "Shoelace polygon-area formula as the discrete case", numbers: "Shoelace polygon-area formula as the discrete case" }
    ]
  },
  "math-02-37": {
    connectionsProse:
      "<p>This lesson extends integration from curves and flat regions to curved surfaces. You already know a double integral adds values over a planar region. A surface integral adds values over a two-dimensional surface that may bend in space. It prepares the surface-area element needed for flux and the divergence theorem.</p>",
    motivation:
      "<p>To integrate over a curved surface, describe the surface with two parameters. Small changes in those parameters create two tangent vectors on the surface. Their cross product gives the area of the tiny parallelogram patch they span.</p>" +
      "<p>The surface integral multiplies the scalar value on each patch by that patch's area and adds over the whole surface. The formula looks like a double integral because the parameter domain is two-dimensional, but the area factor corrects for stretching and bending in space. This is the surface analogue of the Jacobian correction in coordinate changes.</p>",
    definition:
      "<p>1. Parametrize the surface by two parameters $\\mathbf r(u,v)$. 2. A small patch has area $\\lVert \\mathbf r_u\\times\\mathbf r_v\\rVert\\,du\\,dv$ (the cross product gives the patch's area). 3. Integrate: $\\iint_S f\\,dS=\\iint f(\\mathbf r(u,v))\\lVert \\mathbf r_u\\times\\mathbf r_v\\rVert\\,du\\,dv$.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$S$", desc: "surface" },
      { sym: "$dS$", desc: "surface-area element" },
      { sym: "$\\mathbf r_u,\\mathbf r_v$", desc: "tangent vectors" }
    ],
    derivation: [
      { do: "Parametrize the surface by two parameters $\\mathbf r(u,v)$", result: "Parametrize the surface by two parameters $\\mathbf r(u,v)$", why: "this is the stated step in the plan's derivation" },
      { do: "A small patch has area $\\lVert \\mathbf r_u\\times\\mathbf r_v\\rVert\\,du\\,dv$ (the cross product gives the patch's area)", result: "A small patch has area $\\lVert \\mathbf r_u\\times\\mathbf r_v\\rVert\\,du\\,dv$ (the cross product gives the patch's area)", why: "this is the stated step in the plan's derivation" },
      { do: "Integrate", result: "$\\iint_S f\\,dS=\\iint f(\\mathbf r(u,v))\\lVert \\mathbf r_u\\times\\mathbf r_v\\rVert\\,du\\,dv$", why: "this names the corresponding formula or conclusion" }
    ],
    applications: [
      { title: "Total radiance/irradiance over a surface", background: "Total radiance/irradiance over a surface", numbers: "Total radiance/irradiance over a surface" },
      { title: "Surface area of a sphere", background: "Surface area of a sphere of radius $2$ is $4\\pi", numbers: "Surface area of a sphere of radius $2$ is $4\\pi" },
      { title: "^2\\approx50.27", background: "^2\\approx50.27$", numbers: "^2\\approx50.27$" },
      { title: "Mass of a curved sheet", background: "Mass of a curved sheet", numbers: "Mass of a curved sheet" },
      { title: "Setting up flux", background: "Setting up flux (next lesson)", numbers: "Setting up flux (next lesson)" },
      { title: "Rendering integrals in graphics", background: "Rendering integrals in graphics", numbers: "Rendering integrals in graphics" }
    ]
  },
  "math-02-38": {
    connectionsProse:
      "<p>This lesson uses surface integrals to measure how a vector field crosses a surface. You already know a vector field has direction and magnitude at each point, and a surface has a normal direction. Flux keeps the field's component normal to the surface. It is the language of flow through boundaries, heat transfer, and Gauss-type laws.</p>",
    motivation:
      "<p>A field may pass through a surface, slide along it, or point partly through and partly along. Only the normal component contributes to throughput across the surface. The dot product with the unit normal extracts that component.</p>" +
      "<p>Multiplying the normal component by a small area patch gives the amount of flow through that patch. Integrating over the surface gives total flux. The sign depends on the chosen normal direction, so orientation matters. This idea is the surface counterpart of work along a path, where the dot product keeps the component along motion.</p>",
    definition:
      "<p>1. Take the field's component along the surface normal, $F\\!\\cdot\\!\\mathbf n$. 2. Multiply by patch area $dS$ to get flow through the patch. 3. Integrate: flux $=\\iint_S F\\!\\cdot\\!\\mathbf n\\,dS$.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$\\mathbf n$", desc: "unit normal" },
      { sym: "$F\\!\\cdot\\!\\mathbf n$", desc: "normal component" },
      { sym: "flux", desc: "is a scalar" }
    ],
    derivation: [
      { do: "Take the field's component along the surface normal, $F\\!\\cdot\\!\\mathbf n$", result: "Take the field's component along the surface normal, $F\\!\\cdot\\!\\mathbf n$", why: "this is the stated step in the plan's derivation" },
      { do: "Multiply by patch area $dS$ to get flow through the patch", result: "Multiply by patch area $dS$ to get flow through the patch", why: "this is the stated step in the plan's derivation" },
      { do: "Integrate", result: "flux $=\\iint_S F\\!\\cdot\\!\\mathbf n\\,dS$", why: "this names the corresponding formula or conclusion" }
    ],
    applications: [
      { title: "Probability flux across a boundary", background: "Probability flux across a boundary", numbers: "Probability flux across a boundary" },
      { title: "Heat flux through a wall", background: "Heat flux through a wall", numbers: "Heat flux through a wall" },
      { title: "Electric flux", background: "Electric flux (Gauss's law)", numbers: "Electric flux (Gauss's law)" },
      { title: "A uniform field", background: "A uniform field $F=(0,0,1)$ through a unit disk in the plane $z=1$ (normal $\\mathbf k$) has flux $=$ area $=\\pi$", numbers: "A uniform field $F=(0,0,1)$ through a unit disk in the plane $z=1$ (normal $\\mathbf k$) has flux $=$ area $=\\pi$" },
      { title: "Mass flow rate through a", background: "Mass flow rate through a pipe cross-section", numbers: "Mass flow rate through a pipe cross-section" },
      { title: "Radiative flux in rendering", background: "Radiative flux in rendering", numbers: "Radiative flux in rendering" }
    ]
  },
  "math-02-39": {
    connectionsProse:
      "<p>This lesson lifts Green's theorem from flat regions to surfaces in space. You already know curl measures local rotation and line integrals measure circulation around a path. Stokes' theorem says boundary circulation equals total curl passing through any surface with that boundary. It ties local rotational behavior to a global loop integral.</p>",
    motivation:
      "<p>A vector field may circulate around the edge of a surface because of curl distributed across the surface. Stokes' theorem adds the normal component of curl over the surface and shows that this equals the circulation around the boundary. The exact shape of the spanning surface does not matter when the boundary and orientation are fixed under the theorem's assumptions.</p>" +
      "<p>The cancellation idea is central. If the surface is divided into many small patches, neighboring patches traverse their shared edges in opposite directions, so those interior contributions cancel. Only the outer boundary remains. This is the same boundary-interior pattern seen in Green's theorem, now in three-dimensional geometry.</p>",
    definition:
      "<p>1. State $\\oint_{\\partial S}F\\!\\cdot\\!d\\mathbf r=\\iint_S(\\nabla\\times F)\\!\\cdot\\!\\mathbf n\\,dS$. 2. Tile $S$ with tiny patches; on each, Green's theorem (in the tangent plane) equates the patch's boundary circulation to $(\\nabla\\times F)\\!\\cdot\\!\\mathbf n$ times its area. 3. Sum over patches: interior edges are traversed twice in opposite directions and cancel. 4. Only the outer boundary $\\partial S$ survives, giving the identity.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$\\partial S$", desc: "boundary curve" },
      { sym: "$\\nabla\\times F$", desc: "curl" },
      { sym: "$\\mathbf n$", desc: "surface normal" }
    ],
    derivation: [
      { do: "State $\\oint_{\\partial S}F\\!\\cdot\\!d\\mathbf r=\\iint_S(\\nabla\\times F)\\!\\cdot\\!\\mathbf n\\,dS$", result: "State $\\oint_{\\partial S}F\\!\\cdot\\!d\\mathbf r=\\iint_S(\\nabla\\times F)\\!\\cdot\\!\\mathbf n\\,dS$", why: "this is the stated step in the plan's derivation" },
      { do: "Tile $S$ with tiny patches; on each, Green's theorem (in the tangent plane) equates the patch's boundary circulation to $(\\nabla\\times F)\\!\\cdot\\!\\mathbf n$ times its area", result: "Tile $S$ with tiny patches; on each, Green's theorem (in the tangent plane) equates the patch's boundary circulation to $(\\nabla\\times F)\\!\\cdot\\!\\mathbf n$ times its area", why: "this is the stated step in the plan's derivation" },
      { do: "Sum over patches", result: "interior edges are traversed twice in opposite directions and cancel", why: "this names the corresponding formula or conclusion" },
      { do: "Only the outer boundary $\\partial S$ survives, giving the identity", result: "Only the outer boundary $\\partial S$ survives, giving the identity", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "Circulation equals vorticity flux in", background: "Circulation equals vorticity flux in fluids", numbers: "Circulation equals vorticity flux in fluids" },
      { title: "Ampère's law in electromagnetism", background: "Ampère's law in electromagnetism", numbers: "Ampère's law in electromagnetism" },
      { title: "Conservative fields (", background: "Conservative fields ($\\nabla\\times F=0$) have zero circulation on every loop", numbers: "Conservative fields ($\\nabla\\times F=0$) have zero circulation on every loop" },
      { title: "Reduces to Green's theorem for", background: "Reduces to Green's theorem for a flat surface", numbers: "Reduces to Green's theorem for a flat surface" },
      { title: "Wing lift from circulation", background: "Wing lift from circulation", numbers: "Wing lift from circulation" },
      { title: "Consistency checks for learned vector", background: "Consistency checks for learned vector fields", numbers: "Consistency checks for learned vector fields" }
    ]
  },
  "math-02-40": {
    connectionsProse:
      "<p>This lesson gives the three-dimensional counterpart to Green's theorem for outflow. You already know divergence measures local source strength and flux measures flow through a surface. The divergence theorem says total source strength inside a region equals total flux out through its boundary. It is a central mathematical form of conservation.</p>",
    motivation:
      "<p>Divergence is a local measurement: it tells how much a field spreads out from a tiny box around a point. Flux through a closed surface is global: it measures how much field leaves the whole region. The divergence theorem states that adding all the local divergence inside exactly accounts for the boundary flux.</p>" +
      "<p>The proof idea is a cancellation argument. Split the region into many small boxes. Flux through shared interior faces cancels because the neighboring boxes use opposite outward normals. Only the flux through the outside boundary remains. This is why the theorem is so useful for deriving conservation laws and checking flow calculations.</p>",
    definition:
      "<p>1. State $\\iiint_V\\nabla\\!\\cdot\\!F\\,dV=\\oiint_{\\partial V}F\\!\\cdot\\!\\mathbf n\\,dS$. 2. Divide $V$ into tiny boxes; for each, divergence times volume equals net flux out of that box (the definition of divergence). 3. Sum over boxes: shared interior faces cancel because their outward normals are opposite. 4. Only the outer surface $\\partial V$ remains.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$V$", desc: "solid region" },
      { sym: "$\\partial V$", desc: "its closed boundary surface" },
      { sym: "$\\mathbf n$", desc: "outward normal" }
    ],
    derivation: [
      { do: "State $\\iiint_V\\nabla\\!\\cdot\\!F\\,dV=\\oiint_{\\partial V}F\\!\\cdot\\!\\mathbf n\\,dS$", result: "State $\\iiint_V\\nabla\\!\\cdot\\!F\\,dV=\\oiint_{\\partial V}F\\!\\cdot\\!\\mathbf n\\,dS$", why: "this is the stated step in the plan's derivation" },
      { do: "Divide $V$ into tiny boxes; for each, divergence times volume equals net flux out of that box (the definition of divergence)", result: "Divide $V$ into tiny boxes; for each, divergence times volume equals net flux out of that box (the definition of divergence)", why: "this is the stated step in the plan's derivation" },
      { do: "Sum over boxes", result: "shared interior faces cancel because their outward normals are opposite", why: "this names the corresponding formula or conclusion" },
      { do: "Only the outer surface $\\partial V$ remains", result: "Only the outer surface $\\partial V$ remains", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "Conservation of probability mass", background: "Conservation of probability mass", numbers: "Conservation of probability mass" },
      { title: "Gauss's law relating charge to", background: "Gauss's law relating charge to flux", numbers: "Gauss's law relating charge to flux" },
      { title: "Continuity equations", background: "Continuity equations", numbers: "Continuity equations" },
      { title: "Flux of", background: "Flux of $F=(x,y,z)$ (divergence $3$) out of the unit ball is $3\\cdot\\tfrac43\\pi=4\\pi\\approx12.57$", numbers: "Flux of $F=(x,y,z)$ (divergence $3$) out of the unit ball is $3\\cdot\\tfrac43\\pi=4\\pi\\approx12.57$" },
      { title: "Heat balance in a region", background: "Heat balance in a region", numbers: "Heat balance in a region" },
      { title: "Deriving PDEs from conservation laws", background: "Deriving PDEs from conservation laws", numbers: "Deriving PDEs from conservation laws" }
    ]
  },
  "math-02-41": {
    connectionsProse:
      "<p>This capstone lesson translates the vector-calculus derivative ideas into the notation used for machine learning models. You already know gradients of scalar functions and Jacobians of vector-valued maps. Matrix calculus writes those derivatives compactly when parameters, data, and residuals are stored in vectors and matrices. It connects this section directly to regression, backpropagation, and second-order methods.</p>",
    motivation:
      "<p>Machine learning losses are usually scalar functions of many parameters. Writing one partial derivative at a time is possible but quickly becomes unreadable. Matrix calculus keeps the whole gradient in one expression, using transposes and matrix products to show how residuals flow back to parameters.</p>" +
      "<p>The squared-error example is the standard model. Expanding the loss reveals a quadratic form in the weight vector, and differentiating that quadratic gives the gradient used in least squares and gradient descent. The same rules extend to linear layers, ridge penalties, Mahalanobis distances, and Gauss-Newton approximations. The notation is compact because it matches the linear algebra of the computation itself.</p>",
    definition:
      "<p>1. Expand the squared error $\\lVert Xw-y\\rVert^2=(Xw-y)^\\top(Xw-y)$. 2. Multiply out: $w^\\top X^\\top Xw-2y^\\top Xw+y^\\top y$. 3. Differentiate term by term with respect to $w$: $\\nabla(w^\\top X^\\top Xw)=2X^\\top Xw$ and $\\nabla(-2y^\\top Xw)=-2X^\\top y$. 4. Combine: $\\nabla_w\\lVert Xw-y\\rVert^2=2X^\\top(Xw-y)$. 5. Separately, for a quadratic form, $\\nabla_x\\,x^\\top Ax=(A+A^\\top)x$, which is $2Ax$ when $A$ is symmetric.</p><p><b>Assumptions that matter:</b> use the stated smoothness, dimensional, unit-direction, orientation, or region conditions from the plan when applying the formula.</p>",
    symbols: [
      { sym: "$X$", desc: "data matrix" },
      { sym: "$w$", desc: "weight vector" },
      { sym: "$y$", desc: "targets" },
      { sym: "$X^\\top(Xw-y)$", desc: "residual projected onto features" },
      { sym: "$A$", desc: "a square matrix" }
    ],
    derivation: [
      { do: "Expand the squared error $\\lVert Xw-y\\rVert^2=(Xw-y)^\\top(Xw-y)$", result: "Expand the squared error $\\lVert Xw-y\\rVert^2=(Xw-y)^\\top(Xw-y)$", why: "this is the stated step in the plan's derivation" },
      { do: "Multiply out", result: "$w^\\top X^\\top Xw-2y^\\top Xw+y^\\top y$", why: "this names the corresponding formula or conclusion" },
      { do: "Differentiate term by term with respect to $w$", result: "$\\nabla(w^\\top X^\\top Xw)=2X^\\top Xw$ and $\\nabla(-2y^\\top Xw)=-2X^\\top y$", why: "this names the corresponding formula or conclusion" },
      { do: "Combine", result: "$\\nabla_w\\lVert Xw-y\\rVert^2=2X^\\top(Xw-y)$", why: "this names the corresponding formula or conclusion" },
      { do: "Separately, for a quadratic form, $\\nabla_x\\,x^\\top Ax=(A+A^\\top)x$, which is $2Ax$ when $A$ is symmetric", result: "Separately, for a quadratic form, $\\nabla_x\\,x^\\top Ax=(A+A^\\top)x$, which is $2Ax$ when $A$ is symmetric", why: "this is the stated step in the plan's derivation" }
    ],
    applications: [
      { title: "Normal equations", background: "set $\\nabla=0\\Rightarrow X^\\top Xw=X^\\top y$", numbers: "Normal equations: set $\\nabla=0\\Rightarrow X^\\top Xw=X^\\top y$" },
      { title: "For", background: "For $X=\\begin{bmatrix}1&0\\1&1\\0&1\\end{bmatrix}$, $w=(1,1)$, $y=(1,2,2)$: residual $Xw-y=(0,0,-1)$, gradient $2X^\\top(Xw-y)=(0,-2)$", numbers: "For $X=\\begin{bmatrix}1&0\\1&1\\0&1\\end{bmatrix}$, $w=(1,1)$, $y=(1,2,2)$: residual $Xw-y=(0,0,-1)$, gradient $2X^\\top(Xw-y)=(0,-2)$" },
      { title: "Ridge regression gradient", background: "Ridge regression gradient $2X^\\top(Xw-y)+2\\lambda w$", numbers: "Ridge regression gradient $2X^\\top(Xw-y)+2\\lambda w$" },
      { title: "Backprop of a linear layer", background: "Backprop of a linear layer uses $\\partial L/\\partial W=\\delta\\,x^\\top$", numbers: "Backprop of a linear layer uses $\\partial L/\\partial W=\\delta\\,x^\\top$" },
      { title: "Mahalanobis distance gradient", background: "Mahalanobis distance gradient $\\nabla_x\\,x^\\top A x=2Ax$ for symmetric $A$", numbers: "Mahalanobis distance gradient $\\nabla_x\\,x^\\top A x=2Ax$ for symmetric $A$" },
      { title: "Gauss–Newton uses", background: "Gauss–Newton uses $X^\\top X$ as the curvature", numbers: "Gauss–Newton uses $X^\\top X$ as the curvature" }
    ]
  }
};
