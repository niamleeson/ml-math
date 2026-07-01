module.exports = {
  "math-12-01": {
    connectionsProse: "<p>Parametrized curves begin the section with the simplest object in differential geometry: a point that moves. The coordinate functions are familiar from calculus, but the geometric viewpoint treats them as one vector-valued path. This lesson prepares arc length, curvature, and tangent vectors by making velocity the central local object. It also gives the language used later when curves lie on surfaces and manifolds instead of in ordinary Euclidean space.</p>",
    motivation: "<p>A plotted curve shows the shape traced in space, but it does not always show how the point moved through that shape. A parametrization keeps both pieces of information. The same circle can be traced slowly, quickly, clockwise, or counterclockwise, and the parameter records that order and speed.</p>" +
                "<p>The derivative of a parametrized curve is therefore more than a calculus operation. It is the instantaneous velocity of the moving point, and when it is nonzero it gives the tangent direction. Regularity is the condition that the curve is not stopping or losing its local direction at the point being studied.</p>",
    definition: "<p>A parametrized curve is a differentiable map from an interval into Euclidean space, written $$\\gamma(t)=(x_1(t),\\ldots,x_n(t)).$$ A point is regular when $$\\gamma'(t)\\ne0.$$</p>" +
                "<p><b>Assumptions that matter:</b> the coordinate functions are differentiable on the parameter interval, and regularity is checked at the point being studied.</p>",
    symbols: [
      { sym: "$\\gamma$", desc: "the curve" },
      { sym: "$t$", desc: "the parameter" },
      { sym: "$I$", desc: "the parameter interval" },
      { sym: "$\\gamma'(t)$", desc: "velocity" },
      { sym: "$\\mathbb R^n$", desc: "the ambient coordinate space" }
    ],
    derivation: [
      { do: "Write the curve by coordinates.", result: "$\\gamma(t)=(x_1(t),\\ldots,x_n(t))$", why: "each coordinate depends on the same parameter" },
      { do: "Form the difference quotient.", result: "$[\\gamma(t+h)-\\gamma(t)]/h$", why: "this is average velocity over a small parameter change" },
      { do: "Apply the quotient coordinate by coordinate.", result: "$((x_1(t+h)-x_1(t))/h,\\ldots,(x_n(t+h)-x_n(t))/h)$", why: "vector subtraction and division are componentwise" },
      { do: "Take the limit as $h\\to0$.", result: "$\\gamma'(t)=(x_1'(t),\\ldots,x_n'(t))$", why: "the instantaneous velocity is the tangent vector" },
      { do: "Declare regularity.", result: "$\\gamma'(t)\\ne0$", why: "a nonzero velocity gives a definite tangent direction" }
    ],
    applications: [
      { title: "Robot path", background: "a linear path in the plane", numbers: "$\\gamma(t)=(2t,1+t)$ gives $\\gamma(4)=(8,5)$ and speed $\\sqrt5=2.236$" },
      { title: "Animation circle", background: "a point moving around a horizontal circle", numbers: "$(10\\cos t,10\\sin t,2)$ starts at $(10,0,2)$ and has speed $10$" },
      { title: "Embedding interpolation", background: "a straight interpolation between two vectors", numbers: "from $(1,2)$ to $(5,4)$ gives $\\gamma(0.25)=(2,2.5)$" },
      { title: "Projectile", background: "a parabolic flight path", numbers: "$\\gamma(t)=(20t,30t-4.9t^2)$ gives $\\gamma(2)=(40,40.4)$ and vertical velocity $10.4$" },
      { title: "Linear Bezier", background: "a segment from start point to endpoint", numbers: "from $(0,0)$ to $(6,3)$ gives midpoint $(3,1.5)$" },
      { title: "Optimizer path", background: "a one-dimensional parameter changing over time", numbers: "$w(t)=5-0.2t$ gives $w(10)=3$ and $w'=-0.2$" }
    ]
  },

  "math-12-02": {
    connectionsProse: "<p>Once a curve has a velocity, it is natural to ask how far the moving point travels. The previous lesson supplied the derivative $\\gamma'(t)$, and this lesson turns its norm into the speed used for measuring distance along the path. Arc length is the first intrinsic measurement in the section because it measures the curve itself, not just the straight chord between endpoints. The same idea later becomes surface length through the first fundamental form.</p>",
    motivation: "<p>A curved path cannot usually be measured correctly by one straight segment from start to finish. The standard approximation is to replace the curve by many tiny straight chords, add their lengths, and refine the partition. As the chords get shorter, they follow the curve more closely.</p>" +
                "<p>Differentiability explains the limiting formula. Over a very small parameter interval, the curve behaves almost like its tangent line, so the small distance traveled is speed times the small parameter change. Adding those small distances gives the integral of speed.</p>",
    definition: "<p>The arc length of a differentiable curve with integrable speed on $[a,b]$ is $$L=\\int_a^b\\lVert\\gamma'(t)\\rVert\\,dt.$$</p>" +
                "<p><b>Assumptions that matter:</b> $\\gamma$ is differentiable on the parameter interval and $\\lVert\\gamma'(t)\\rVert$ is integrable.</p>",
    symbols: [
      { sym: "$L$", desc: "arc length" },
      { sym: "$\\gamma'(t)$", desc: "velocity" },
      { sym: "$\\lVert\\gamma'(t)\\rVert$", desc: "speed" },
      { sym: "$[a,b]$", desc: "the parameter interval" }
    ],
    derivation: [
      { do: "Partition $[a,b]$ into small intervals.", result: "the curve is approximated by chords", why: "length is approximated by straight segments" },
      { do: "Write one chord length.", result: "$\\lVert\\gamma(t_i)-\\gamma(t_{i-1})\\rVert$", why: "this is the distance between consecutive positions" },
      { do: "Use local linearity.", result: "$\\gamma(t_i)-\\gamma(t_{i-1})\\approx\\gamma'(t_i)\\Delta t_i$", why: "differentiability gives the local linear approximation" },
      { do: "Take the norm of the local approximation.", result: "$\\lVert\\gamma'(t_i)\\rVert\\Delta t_i$", why: "the scalar $\\Delta t_i$ factors out of the norm" },
      { do: "Sum and take the limit.", result: "$L=\\int_a^b\\lVert\\gamma'(t)\\rVert\\,dt$", why: "the Riemann sum becomes the integral of speed" }
    ],
    applications: [
      { title: "Line", background: "constant speed on a straight path", numbers: "$\\gamma(t)=(3t,4t)$ on $[0,2]$ has length $5\\cdot2=10$" },
      { title: "Quarter circle", background: "one fourth of a circular path", numbers: "Radius-$2$ quarter circle has length $2\\cdot\\pi/2=3.142$" },
      { title: "Helix", background: "a curve wrapping around while rising", numbers: "$(\\cos t,\\sin t,t)$ on $[0,2\\pi]$ has length $2\\sqrt2\\pi=8.886$" },
      { title: "Earth latitude", background: "travel along a circle of latitude", numbers: "at $60^\\circ$ over $90^\\circ$ longitude has length $6371\\cos60^\\circ\\cdot\\pi/2=5003.77$ km" },
      { title: "Parabola", background: "curved graph distance", numbers: "$(t,t^2)$ on $[0,1]$ has length $1.479$" },
      { title: "Training trajectory", background: "many optimizer steps accumulated as path length", numbers: "with speed $0.03$ for $200$ steps has path length $6.0$ in parameter units" }
    ]
  },

  "math-12-03": {
    connectionsProse: "<p>Arc length measures how far a curve goes, and curvature measures how sharply it turns while going there. The unit tangent from the previous lessons gives the direction of travel without the distraction of speed. Curvature studies how that direction changes per unit distance. This prepares the Frenet frame, where turning becomes one axis of a moving coordinate system along a space curve.</p>",
    motivation: "<p>A curve can be long without turning much, or short while turning sharply. Curvature separates turning from speed by watching the unit tangent, which records direction only. Measuring its change with respect to arc length makes the result independent of how quickly the curve is parametrized.</p>" +
                "<p>Tight circles have large curvature because their tangent direction changes rapidly over a short distance. Large-radius curves have small curvature because the same amount of turning is spread out. For space curves, the cross-product formula keeps the part of acceleration that actually bends the path away from its current direction.</p>",
    definition: "<p>Curvature is the rate at which the unit tangent changes per unit arc length: $$\\kappa=\\left\\lVert\\frac{dT}{ds}\\right\\rVert.$$ For a regular space curve, $$\\kappa=\\frac{\\lVert\\gamma'\\times\\gamma''\\rVert}{\\lVert\\gamma'\\rVert^3}.$$</p>" +
                "<p><b>Assumptions that matter:</b> the curve is regular and has enough derivatives for velocity, acceleration, and the unit tangent to be defined.</p>",
    symbols: [
      { sym: "$\\kappa$", desc: "curvature" },
      { sym: "$T$", desc: "unit tangent" },
      { sym: "$s$", desc: "arc length" },
      { sym: "$\\gamma'$", desc: "velocity" },
      { sym: "$\\gamma''$", desc: "acceleration" }
    ],
    derivation: [
      { do: "Define the unit tangent.", result: "$T=\\gamma'/\\lVert\\gamma'\\rVert$", why: "direction should not depend on speed" },
      { do: "Define curvature by arc-length change.", result: "$\\kappa=\\lVert dT/ds\\rVert$", why: "it measures change of direction per arc length $s$" },
      { do: "Convert parameter to distance.", result: "$ds/dt=\\lVert\\gamma'\\rVert$", why: "speed converts parameter change to distance change" },
      { do: "Use the chain rule.", result: "$dT/ds=(dT/dt)/\\lVert\\gamma'\\rVert$", why: "divide direction change by distance rate" },
      { do: "Simplify for a space curve.", result: "$\\kappa=\\lVert\\gamma'\\times\\gamma''\\rVert/\\lVert\\gamma'\\rVert^3$", why: "the cross product keeps only the acceleration perpendicular to the velocity" }
    ],
    applications: [
      { title: "Circle", background: "constant turning on a radius-$4$ circle", numbers: "Circle radius $4$ has $\\kappa=1/4=0.25$" },
      { title: "Helix", background: "space curve with steady bending", numbers: "Helix $(\\cos t,\\sin t,t)$ has $\\kappa=1/2=0.5$" },
      { title: "Parabola", background: "graph curvature at a point", numbers: "Parabola $y=x^2$ at $x=1$ has $\\kappa=2/(1+4)^{3/2}=0.1789$" },
      { title: "Road turn radius", background: "road bend measured by reciprocal radius", numbers: "Road turn radius $25$ m has $\\kappa=0.04\\,\\text{m}^{-1}$" },
      { title: "Cubic curve", background: "curvature for a nonlinear parametrized path", numbers: "Curve $(t,t^3)$ at $t=1$ has $\\kappa=6/10^{3/2}=0.1897$" },
      { title: "Embedding path", background: "curvature of a feature trajectory", numbers: "Embedding path $(t,t^2,0)$ at $t=0.5$ has $\\kappa=0.7071$" }
    ]
  },

  "math-12-04": {
    connectionsProse: "<p>Curvature tells how much a curve turns, and the Frenet frame records the directions involved in that turning. The tangent direction comes from parametrized curves, the normal direction comes from the change in tangent, and the binormal completes a right-handed coordinate system. This lesson gives a local moving frame for space curves. It is useful before moving to surfaces because it shows how geometry can be described by frames attached to points.</p>",
    motivation: "<p>A fixed coordinate system is often awkward for describing a curve that twists through space. The Frenet frame moves with the curve, so one axis points forward, one points toward the direction of turning, and one points sideways. This makes local bending visible without constantly referring back to the ambient $x,y,z$ axes.</p>" +
                "<p>The construction starts with the unit tangent because forward motion is the most basic direction along a curve. If the tangent changes, that change identifies the principal normal. The binormal is then forced by perpendicularity, giving three mutually orthogonal directions that travel with the curve.</p>",
    definition: "<p>The Frenet frame of a regular space curve with nonzero curvature is the moving orthonormal frame $$T=\\frac{\\gamma'}{\\lVert\\gamma'\\rVert},\\qquad N=\\frac{dT/ds}{\\lVert dT/ds\\rVert},\\qquad B=T\\times N.$$</p>" +
                "<p><b>Assumptions that matter:</b> the curve is regular and has nonzero curvature where the normal direction is defined.</p>",
    symbols: [
      { sym: "$T$", desc: "unit tangent" },
      { sym: "$N$", desc: "principal normal" },
      { sym: "$B$", desc: "binormal" },
      { sym: "$s$", desc: "arc length" },
      { sym: "$\\kappa$", desc: "the size of $dT/ds$" }
    ],
    derivation: [
      { do: "Start with the unit tangent.", result: "$T=\\gamma'/\\lVert\\gamma'\\rVert$", why: "the first direction is forward along the curve" },
      { do: "Differentiate $T$ with respect to arc length.", result: "$dT/ds$", why: "changes in $T$ reveal the curve's turning direction" },
      { do: "Normalize this change.", result: "$N=(dT/ds)/\\lVert dT/ds\\rVert$", why: "the principal normal records pure direction" },
      { do: "Define the binormal.", result: "$B=T\\times N$", why: "the cross product gives the third perpendicular direction" },
      { do: "Evaluate the helix frame at $t=0$.", result: "$T=(0,1/\\sqrt2,1/\\sqrt2)$, $N=(-1,0,0)$, and $B=(0,-1/\\sqrt2,1/\\sqrt2)$", why: "the three directions are orthonormal" }
    ],
    applications: [
      { title: "Helix frame", background: "the binormal at the starting point", numbers: "Helix frame at $t=0$ has $B=(0,-0.707,0.707)$" },
      { title: "Helix curvature", background: "turning size in the Frenet frame", numbers: "Helix curvature is $0.5$, so $\\lVert dT/ds\\rVert=0.5$" },
      { title: "Tube cross-section", background: "normal and binormal axes shape a tube", numbers: "A tube drawn around a curve can use $N$ and $B$ as cross-section axes; radius $0.2$ gives diameter $0.4$" },
      { title: "Camera motion", background: "the tangent gives the forward direction", numbers: "Camera motion uses $T$ as forward direction; $T=(0,0.707,0.707)$ tilts $45^\\circ$" },
      { title: "Tangent turn", background: "curvature accumulates direction change over length", numbers: "A path with $\\kappa=0.1$ turns its tangent by about $0.5$ rad over length $5$" },
      { title: "Robot end-effector", background: "speed times curvature gives turning rate", numbers: "A robot end-effector following the helix at speed $2$ has angular turning rate $v\\kappa=1$ rad/s" }
    ]
  },

  "math-12-05": {
    connectionsProse: "<p>After curves, the next object is a two-dimensional surface described by two parameters. The curve lessons used one derivative to produce one tangent direction; a surface patch uses two coordinate derivatives to produce a tangent plane. Regularity is the condition that those two directions are genuinely independent. This prepares tangent planes, surface area scale, and the first fundamental form.</p>",
    motivation: "<p>A surface parametrization should behave locally like a sheet, not collapse into a line or a point. The two parameters are meant to move in two independent directions across the patch. If both parameter directions point the same way, the parametrization may still be a formula, but it is not a regular surface patch at that point.</p>" +
                "<p>The cross product $r_u\\times r_v$ captures both independence and local area scaling. When it is nonzero, the two tangent vectors span a plane and have a well-defined normal direction. When it is zero, the local coordinate grid has collapsed and the usual surface tools no longer apply there.</p>",
    definition: "<p>A regular surface patch is a smooth two-parameter map $r:U\\to\\mathbb R^3$ whose coordinate tangent vectors are independent, equivalently $$r_u\\times r_v\\ne0.$$</p>" +
                "<p><b>Assumptions that matter:</b> $r$ is smooth on the parameter domain and the rank condition is checked at the point being studied.</p>",
    symbols: [
      { sym: "$r(u,v)$", desc: "a surface parametrization" },
      { sym: "$r_u,r_v$", desc: "coordinate tangent vectors" },
      { sym: "$U$", desc: "the parameter domain" },
      { sym: "$r_u\\times r_v$", desc: "the normal-area vector" }
    ],
    applications: [
      { title: "Graph patch", background: "area scaling for a paraboloid graph", numbers: "Graph $r(u,v)=(u,v,u^2+v^2)$ at $(1,2)$ has $\\lVert r_u\\times r_v\\rVert=\\sqrt{21}=4.583$" },
      { title: "Unit plane patch", background: "flat coordinate patch with no stretching", numbers: "Unit plane patch $r(u,v)=(u,v,0)$ has area scale $1$" },
      { title: "Sphere patch", background: "radius controls surface-area scaling", numbers: "Sphere patch of radius $2$ at the equator has area scale $4$" },
      { title: "Degenerate patch", background: "two parameters collapse to one direction", numbers: "Degenerate patch $r(u,v)=(u+v,0,0)$ has $r_u\\times r_v=0$" },
      { title: "Grid sampling", background: "parameter samples create surface samples", numbers: "A $20\\times30$ grid samples $600$ surface points" },
      { title: "UV texture coordinates", background: "Jacobian area scale converts parameter area to surface area", numbers: "UV texture coordinates with Jacobian area scale $0.5$ map one parameter square of area $0.04$ to surface area $0.02$" }
    ]
  },

  "math-12-06": {
    connectionsProse: "<p>Regular surfaces have two independent tangent directions, and the tangent plane is the flat plane they span at a point. This lesson connects surface parametrizations with the linear approximations from multivariable calculus. The tangent plane is the surface analogue of the tangent line to a curve. It becomes the local model used for normals, constraints, and first-order updates on curved spaces.</p>",
    motivation: "<p>Near a smooth point, a surface can be approximated by a plane in the same way a smooth curve can be approximated by a line. For a graph $z=f(x,y)$, the two partial derivatives describe how height changes when moving in the $x$ and $y$ directions. Combining those two slopes gives the best first-order flat approximation.</p>" +
                "<p>This plane does not claim the surface is globally flat. It only captures what is visible at very small scale, where higher-order bending terms are negligible. That local flatness is what makes normals, projections, and constrained differential calculations possible.</p>",
    definition: "<p>For a differentiable graph $z=f(x,y)$, the tangent plane at $(a,b,f(a,b))$ is $$z=f(a,b)+f_x(a,b)(x-a)+f_y(a,b)(y-b).$$</p>" +
                "<p><b>Assumptions that matter:</b> $f$ is differentiable at $(a,b)$, or equivalently a regular parametrized surface has a well-defined tangent plane.</p>",
    symbols: [
      { sym: "$(a,b)$", desc: "the base input" },
      { sym: "$f_x,f_y$", desc: "partial slopes" },
      { sym: "$z$", desc: "height" },
      { sym: "$r_u,r_v$", desc: "vectors that can also span the tangent plane for a parametrized surface" }
    ],
    derivation: [
      { do: "Choose the graph base point.", result: "$(a,b,f(a,b))$", why: "the tangent plane must pass through it" },
      { do: "Move by small input amounts.", result: "$\\Delta x,\\Delta y$", why: "local behavior is first order in these changes" },
      { do: "Use the linear approximation.", result: "$\\Delta z\\approx f_x(a,b)\\Delta x+f_y(a,b)\\Delta y$", why: "partial derivatives give the two coordinate slopes" },
      { do: "Replace changes by coordinates.", result: "$\\Delta x=x-a$, $\\Delta y=y-b$, $\\Delta z=z-f(a,b)$", why: "the plane is written in the original coordinates" },
      { do: "Solve for $z$.", result: "$z=f(a,b)+f_x(a,b)(x-a)+f_y(a,b)(y-b)$", why: "this is the tangent plane" }
    ],
    applications: [
      { title: "Paraboloid plane", background: "the tangent plane to $z=x^2+y^2$", numbers: "For $z=x^2+y^2$ at $(1,2)$, the plane is $z=5+2(x-1)+4(y-2)$" },
      { title: "Plane prediction", background: "first-order height approximation", numbers: "That plane predicts $z=11$ at $(2,3)$" },
      { title: "Sphere north pole", background: "the top of a sphere has horizontal tangent plane", numbers: "Sphere radius $2$ at north pole has tangent plane $z=2$" },
      { title: "Graph normal", background: "slopes determine a normal vector", numbers: "Graph normal at $(1,2)$ is $(-2,-4,1)$" },
      { title: "Mesh triangle", background: "two tangent directions give a normal area vector", numbers: "A mesh triangle with tangent vectors $(1,0,0),(0,2,0)$ has normal area vector $(0,0,2)$" },
      { title: "Constraint linearization", background: "a normal vector defines allowable tangent directions", numbers: "Linearizing a constraint with normal $(1,1,1)$ gives tangent directions satisfying $v_1+v_2+v_3=0$" }
    ]
  },

  "math-12-07": {
    connectionsProse: "<p>Tangent planes describe first-order geometry at one surface point, and the differential describes how a smooth map moves those first-order directions. It is the geometric version of the Jacobian matrix from multivariable calculus. This lesson connects local linearization with maps between spaces. Later, the same idea carries tangent vectors between manifolds and supports metric-aware optimization.</p>",
    motivation: "<p>A smooth map can be nonlinear over large distances while still having a reliable linear approximation near one point. Tiny input displacements are sent to tiny output displacements, and the differential is the linear rule that best describes this local behavior. In coordinates, that rule is exactly multiplication by the Jacobian.</p>" +
                "<p>Thinking of the Jacobian as a differential gives it a geometric role. It does not just store partial derivatives; it pushes tangent vectors forward from the input space to the output space. This is why it appears in sensitivity analysis, image warping, neural networks, and changes of coordinates.</p>",
    definition: "<p>The differential of a differentiable map $F:\\mathbb R^n\\to\\mathbb R^m$ at $p$ is the linear map represented in coordinates by the Jacobian: $$dF_p(h)=J_F(p)h.$$</p>" +
                "<p><b>Assumptions that matter:</b> $F$ is differentiable at $p$, so its first-order approximation is represented by the Jacobian matrix.</p>",
    symbols: [
      { sym: "$F$", desc: "the map" },
      { sym: "$p$", desc: "the base point" },
      { sym: "$h$", desc: "an input tangent vector" },
      { sym: "$J_F$", desc: "the Jacobian" },
      { sym: "$dF_p$", desc: "the differential at $p$" }
    ],
    derivation: [
      { do: "Let $F:\\mathbb R^n\\to\\mathbb R^m$ and move from $p$ to $p+h$.", result: "$h$ is the input displacement", why: "the differential describes local displacement" },
      { do: "Linearize each output component.", result: "$F_j(p+h)\\approx F_j(p)+\\sum_i(\\partial F_j/\\partial x_i)h_i$", why: "this is the multivariable first-order approximation" },
      { do: "Stack the component formulas.", result: "$J_F(p)$", why: "the partial derivatives form the Jacobian matrix" },
      { do: "Subtract $F(p)$.", result: "$\\Delta F\\approx J_F(p)h$", why: "the differential sends tangent vectors forward" },
      { do: "Name the linear map.", result: "$dF_p(h)=J_F(p)h$", why: "this is the coordinate expression for the differential" }
    ],
    applications: [
      { title: "Jacobian example", background: "a map from the plane to the plane", numbers: "For $F(x,y)=(x^2,xy)$ at $(2,3)$, $J=\\begin{bmatrix}4&0\\3&2\\end{bmatrix}$" },
      { title: "Vector pushforward", background: "the Jacobian maps a small input vector", numbers: "The vector $(0.1,-0.2)$ maps to $(0.4,-0.1)$" },
      { title: "Directional loss rate", background: "a gradient applied to a direction", numbers: "A scalar loss with gradient $(4,9)$ maps direction $(0.6,0.8)$ to rate $9.6$" },
      { title: "Projection", background: "dropping a coordinate pushes vectors forward", numbers: "A projection from $(x,y,z)$ to $(x,y)$ sends $(1,2,3)$ to $(1,2)$" },
      { title: "Image warp", background: "a local scaling changes area by its determinant", numbers: "A local image warp with scale matrix $\\operatorname{diag}(2,0.5)$ changes area by determinant $1$" },
      { title: "Neural layer", background: "local sensitivity can amplify perturbations", numbers: "A neural layer with local Jacobian norm $3$ can triple a small perturbation of size $0.01$ to about $0.03$" }
    ]
  },

  "math-12-08": {
    connectionsProse: "<p>The tangent plane gives a flat approximation to a surface, and the first fundamental form tells how lengths and angles are measured inside that tangent plane. It uses the coordinate tangent vectors of a regular surface patch. This lesson is the surface version of arc length because it turns small coordinate steps into actual surface distances. It also prepares Riemannian metrics, where the same ruler is assigned on general manifolds.</p>",
    motivation: "<p>Coordinates on a surface are not usually measured in the same units as distance on the surface. A small step in $u$ or $v$ may stretch, shrink, or slant depending on the parametrization. The first fundamental form records this local conversion from coordinate movement to surface movement.</p>" +
                "<p>The formula comes from the ordinary dot product after linearizing the surface patch. A small displacement is a combination of the two tangent vectors $r_u$ and $r_v$, so its squared length expands into the coefficients $E$, $F$, and $G$. Those three numbers are the local metric data of the surface.</p>",
    definition: "<p>For a regular surface patch $r(u,v)$, the first fundamental form measures squared surface displacement by $$ds^2=E\\,du^2+2F\\,du\\,dv+G\\,dv^2,$$ where $E=r_u\\cdot r_u$, $F=r_u\\cdot r_v$, and $G=r_v\\cdot r_v$.</p>" +
                "<p><b>Assumptions that matter:</b> $r(u,v)$ is a regular surface parametrization and first-order surface displacement is measured using its coordinate tangent vectors.</p>",
    symbols: [
      { sym: "$E,F,G$", desc: "first fundamental form coefficients" },
      { sym: "$du,dv$", desc: "coordinate steps" },
      { sym: "$ds$", desc: "surface length" },
      { sym: "$r_u,r_v$", desc: "tangent vectors" }
    ],
    derivation: [
      { do: "Start with a surface $r(u,v)$ and a small parameter step $(du,dv)$.", result: "a small move in the coordinate chart", why: "surface distance is studied locally" },
      { do: "Linearize the surface displacement.", result: "$dr=r_u\\,du+r_v\\,dv$", why: "first-order change follows the two tangent directions" },
      { do: "Square its Euclidean length.", result: "$ds^2=dr\\cdot dr$", why: "distance on the surface is measured by the ambient dot product" },
      { do: "Expand the dot product.", result: "$ds^2=(r_u\\cdot r_u)du^2+2(r_u\\cdot r_v)dudv+(r_v\\cdot r_v)dv^2$", why: "bilinearity separates the three coefficient types" },
      { do: "Name the metric coefficients.", result: "$E=r_u\\cdot r_u$, $F=r_u\\cdot r_v$, $G=r_v\\cdot r_v$", why: "these are the metric coefficients" }
    ],
    applications: [
      { title: "Graph coefficients", background: "metric data for a paraboloid graph", numbers: "For $r=(u,v,u^2+v^2)$ at $(1,0)$, $E=5,F=0,G=1$" },
      { title: "Coordinate step", background: "a small parameter move converted to length", numbers: "Step $(0.1,0.2)$ there has length $\\sqrt{5(0.1)^2+(0.2)^2}=0.300$" },
      { title: "Area scale", background: "the metric determinant controls local area", numbers: "The area scale is $\\sqrt{EG-F^2}=\\sqrt5=2.236$" },
      { title: "Sphere longitude", background: "surface length from angular displacement", numbers: "Radius-$3$ sphere at the equator has longitude step $0.1$ length $0.3$" },
      { title: "Metric gradient", background: "a diagonal metric rescales gradient directions", numbers: "Metric $G=\\operatorname{diag}(4,1)$ turns gradient $(2,2)$ into natural step $(0.5,2)$" },
      { title: "Manifold learning", background: "metric determinant expands tiny coordinate areas", numbers: "Local manifold learning with metric determinant $5$ expands tiny coordinate areas by $2.236$" }
    ]
  },

  "math-12-09": {
    connectionsProse: "<p>The first fundamental form measured distances within the tangent plane. The second fundamental form measures how the surface bends away from that plane. It uses second derivatives and the unit normal introduced by regular surfaces and tangent planes. This lesson prepares Gaussian and mean curvature by turning normal bending into coefficients.</p>",
    motivation: "<p>A tangent plane captures the first-order behavior of a surface, so bending is invisible at that order. To see bending, the calculation must look at second-order change. The second fundamental form takes those second derivatives and keeps the part that points in the normal direction.</p>" +
                "<p>This separates intrinsic movement along the surface from extrinsic bending in the surrounding space. For a graph with a horizontal tangent plane, the Hessian gives this normal bending directly. In other coordinates, the same idea is expressed through the coefficients $e$, $f$, and $g$.</p>",
    definition: "<p>The second fundamental form records normal bending by $$II=e\\,du^2+2f\\,du\\,dv+g\\,dv^2,$$ where $e=n\\cdot r_{uu}$, $f=n\\cdot r_{uv}$, and $g=n\\cdot r_{vv}$.</p>" +
                "<p><b>Assumptions that matter:</b> the surface is regular, a unit normal has been chosen, and the surface has enough smoothness for second derivatives.</p>",
    symbols: [
      { sym: "$II$", desc: "the second fundamental form" },
      { sym: "$n$", desc: "the unit normal" },
      { sym: "$e,f,g$", desc: "second-form coefficients" },
      { sym: "$du,dv$", desc: "tangent coordinate changes" }
    ],
    derivation: [
      { do: "Choose a unit normal $n$ to the surface.", result: "$n$", why: "bending is measured in the normal direction" },
      { do: "Differentiate the surface twice.", result: "$r_{uu},r_{uv},r_{vv}$", why: "second derivatives record acceleration of coordinate curves" },
      { do: "Project each second derivative onto $n$.", result: "$e=n\\cdot r_{uu}$, $f=n\\cdot r_{uv}$, $g=n\\cdot r_{vv}$", why: "normal components are the bending coefficients" },
      { do: "Expand the second-order normal change for a parameter step.", result: "$II=e\\,du^2+2f\\,du\\,dv+g\\,dv^2$", why: "the quadratic form records normal bending by direction" },
      { do: "Specialize to a graph with horizontal tangent plane.", result: "$II=f_{xx}dx^2+2f_{xy}dxdy+f_{yy}dy^2$", why: "$n=(0,0,1)$, so the Hessian gives normal bending" }
    ],
    applications: [
      { title: "Quadratic graph", background: "normal bending at the origin", numbers: "For $z=x^2+2y^2$ at the origin, $II=2dx^2+4dy^2$" },
      { title: "Direction value", background: "the second form applied to a direction", numbers: "Direction $(1,1)$ gives $II=6$" },
      { title: "Normal curvature", background: "second form divided by first-form length squared", numbers: "Its first-form length squared is $2$, so normal curvature is $6/2=3$" },
      { title: "Plane", background: "a flat surface has no normal bending", numbers: "Plane $z=0$ has $II=0$" },
      { title: "Sphere", background: "equal normal curvature in every direction", numbers: "Sphere radius $4$ has normal curvature $1/4=0.25$ in every unit direction" },
      { title: "Mesh smoothing", background: "bending coefficients can be penalized", numbers: "Mesh smoothing can penalize $e^2+g^2$; with $e=2,g=4$ the penalty core is $20$" }
    ]
  },

  "math-12-10": {
    connectionsProse: "<p>The second fundamental form records normal bending in different tangent directions. Gaussian curvature compresses the two principal bends into one intrinsic number by multiplying them. It distinguishes sphere-like, flat-cylinder, and saddle-like local geometry. This lesson also connects surface calculus with later manifold ideas because Gaussian curvature is geometry that can be detected from measurements within the surface.</p>",
    motivation: "<p>A surface can bend in more than one direction at the same point. The principal curvatures are the largest and smallest normal bends, found in special perpendicular directions. Multiplying them gives a sign-sensitive summary: positive when the surface bends the same way in both directions, zero when one direction is flat, and negative when the surface bends oppositely.</p>" +
                "<p>This product is especially important because it captures the local type of the surface. Spheres have positive Gaussian curvature, cylinders have zero Gaussian curvature, and saddles have negative Gaussian curvature. For graphs with a horizontal tangent plane, the determinant of the Hessian gives this product directly.</p>",
    definition: "<p>Gaussian curvature is the product of the two principal curvatures, $$K=k_1k_2.$$ For a graph $z=f(x,y)$ with horizontal tangent plane at the origin, $$K=f_{xx}f_{yy}-f_{xy}^2.$$</p>" +
                "<p><b>Assumptions that matter:</b> use principal curvatures at a smooth surface point, and for the graph formula assume the tangent plane is horizontal at the origin.</p>",
    symbols: [
      { sym: "$K$", desc: "Gaussian curvature" },
      { sym: "$k_1,k_2$", desc: "principal curvatures" },
      { sym: "$f_{xx},f_{xy},f_{yy}$", desc: "second partial derivatives" }
    ],
    derivation: [
      { do: "Choose principal directions at a surface point.", result: "normal curvature is diagonalized", why: "these directions isolate the extreme bends" },
      { do: "Name their curvatures.", result: "$k_1$ and $k_2$", why: "they are the maximum and minimum normal curvatures" },
      { do: "Define Gaussian curvature.", result: "$K=k_1k_2$", why: "the product captures whether the bends have the same sign, one zero sign, or opposite signs" },
      { do: "Specialize to a graph with $\\nabla f(0,0)=0$.", result: "the tangent plane is horizontal", why: "first-order tilt is absent" },
      { do: "Use the Hessian as the shape operator matrix.", result: "$\\begin{bmatrix}f_{xx}&f_{xy}\\f_{xy}&f_{yy}\\end{bmatrix}$", why: "second derivatives give principal bending to first order" },
      { do: "Take the determinant.", result: "$K=f_{xx}f_{yy}-f_{xy}^2$", why: "the determinant is the product of the principal curvatures" }
    ],
    applications: [
      { title: "Sphere", background: "positive curvature with equal principal bends", numbers: "Sphere radius $2$ has $K=(1/2)^2=0.25$" },
      { title: "Cylinder", background: "one curved direction and one flat direction", numbers: "Cylinder has $K=(1/R)\\cdot0=0$" },
      { title: "Saddle", background: "opposite bending directions", numbers: "Saddle $z=x^2-y^2$ at the origin has $K=2(-2)=-4$" },
      { title: "Paraboloid", background: "same-direction bending at the origin", numbers: "Paraboloid $z=x^2+y^2$ at the origin has $K=2\\cdot2=4$" },
      { title: "Elliptic graph", background: "different positive bends multiply", numbers: "Graph $z=x^2+2y^2$ has $K=2\\cdot4=8$" },
      { title: "Geodesic triangle", background: "angle excess measures area on the unit sphere", numbers: "On the unit sphere, a geodesic triangle with angle excess $0.1$ has area $0.1$" }
    ]
  },

  "math-12-11": {
    connectionsProse: "<p>Gaussian curvature multiplies the principal curvatures, while mean curvature averages them. Both use the same principal bending data from the second fundamental form, but they answer different geometric questions. Mean curvature measures the balanced normal bending that drives area-reducing motion. This makes it central in minimal surfaces, mesh smoothing, and physical interfaces such as films and bubbles.</p>",
    motivation: "<p>A surface may bend strongly in one direction and weakly in another. The mean curvature records the average of those two principal bends, so it describes the surface's local tendency to move in the normal direction when area is reduced. When the bends cancel, as on an ideal minimal surface, the mean curvature is zero.</p>" +
                "<p>The sphere is the clean reference case. Every normal slice through a sphere is a circle of the same radius, so both principal curvatures are equal. Averaging them keeps the same reciprocal-radius value, with the sign depending on the chosen normal direction.</p>",
    definition: "<p>Mean curvature is the average of the two principal curvatures, $$H=\\frac{k_1+k_2}{2}.$$ For a sphere of radius $R$ with the chosen outward convention, $$H=\\frac1R.$$</p>" +
                "<p><b>Assumptions that matter:</b> use the two principal curvatures at a smooth surface point; the sign convention depends on the chosen unit normal.</p>",
    symbols: [
      { sym: "$H$", desc: "mean curvature" },
      { sym: "$k_1,k_2$", desc: "principal curvatures" },
      { sym: "$R$", desc: "radius" },
      { sym: "chosen unit normal", desc: "the convention controlling the sign" }
    ],
    derivation: [
      { do: "Choose principal directions.", result: "$k_1,k_2$", why: "these are the two extreme normal curvatures" },
      { do: "Average them.", result: "$H=(k_1+k_2)/2$", why: "the mean captures the balanced normal bending" },
      { do: "Consider a sphere of radius $R$.", result: "every normal section is a circle of radius $R$", why: "all tangent directions bend equally" },
      { do: "Use circle curvature.", result: "$k_1=k_2=1/R$", why: "both principal curvatures match the circle curvature" },
      { do: "Substitute into the average.", result: "$H=(1/R+1/R)/2=1/R$", why: "sphere mean curvature equals reciprocal radius" }
    ],
    applications: [
      { title: "Soap film", background: "opposite bends cancel", numbers: "Soap film with $k_1=0.7,k_2=-0.7$ has $H=0$" },
      { title: "Bubble", background: "mean curvature and surface tension set pressure jump", numbers: "Bubble with surface tension $0.03$ N/m and radius $0.02$ m has $H=50$ and pressure jump $3$ Pa" },
      { title: "Mesh smoothing", background: "mean curvature motion moves vertices along normals", numbers: "Mesh smoothing with step $0.01$ and $H=4$ moves $0.04$ along the normal" },
      { title: "Image surface", background: "quadratic image height has local mean curvature", numbers: "Image surface $z=0.5x^2+0.1y^2$ has $H=(1+0.2)/2=0.6$ at a flat-gradient point" },
      { title: "Curvature penalty", background: "regularization can penalize squared mean curvature", numbers: "Curvature penalty $0.05H^2$ with $H=3$ contributes $0.45$" },
      { title: "Cylindrical vessel", background: "one curved and one flat principal direction", numbers: "Cylindrical vessel radius $2$ mm has $H=1/(2R)=0.25$ mm$^{-1}$" }
    ]
  },

  "math-12-12": {
    connectionsProse: "<p>Curves and surfaces are examples of spaces that may be curved while still looking simple nearby. Manifolds generalize that idea by requiring each small neighborhood to have ordinary coordinates. Charts provide those coordinates, and atlases organize compatible charts across the space. This lesson supplies the language needed for tangent spaces, vector fields, metrics, and geodesics on spaces beyond surfaces in $\\mathbb R^3$.</p>",
    motivation: "<p>Many spaces cannot be described cleanly by one global coordinate system. A circle needs angle coordinates with a wrap, a sphere has trouble at poles, and probability simplexes use coordinates with constraints. A chart handles this by describing only a local patch where Euclidean coordinates work well.</p>" +
                "<p>The manifold condition says that these local descriptions fit together smoothly. On overlaps, one chart's coordinates must convert smoothly into another's, so calculus does not depend on the particular chart chosen. This is why manifolds can be curved globally while still supporting local derivatives and tangent vectors.</p>",
    definition: "<p>A manifold is a space that is locally Euclidean: near each point, a chart gives coordinates $$\\varphi:U\\to\\mathbb R^n.$$ An atlas is a compatible collection of such charts.</p>" +
                "<p><b>Assumptions that matter:</b> charts are local, overlaps have smooth transition maps, and a single global chart may fail to cover the whole space well.</p>",
    symbols: [
      { sym: "$\\mathcal M$", desc: "the manifold" },
      { sym: "$n$", desc: "its dimension" },
      { sym: "$U$", desc: "a local patch" },
      { sym: "$\\varphi:U\\to\\mathbb R^n$", desc: "a chart" },
      { sym: "atlas", desc: "a compatible chart collection" }
    ],
    applications: [
      { title: "Unit-circle chart", background: "upper semicircle described by one coordinate", numbers: "Unit-circle upper chart with coordinate $u=0.6$ gives point $(0.6,0.8)$" },
      { title: "Positive-number charts", background: "two coordinate descriptions related by transition map", numbers: "Positive-number charts $u=x$ and $v=\\ln x$ give transition value $v=\\ln4=1.386$" },
      { title: "Simplex chart", background: "the last probability coordinate is determined by the others", numbers: "Four-class simplex chart $(0.1,0.2,0.3)$ gives $p_4=0.4$" },
      { title: "Rotation manifold", background: "constraints reduce coordinate degrees of freedom", numbers: "A 3-D rotation manifold has $3$ local degrees of freedom, not $9$ matrix entries" },
      { title: "Latent chart", background: "high-dimensional images may have lower-dimensional coordinates", numbers: "A $64\\times64$ image has $4096$ pixels but may use a $128$-dimensional latent chart" },
      { title: "Circular angles", background: "wraparound changes how nearby angles compare", numbers: "Circular angles $6.27$ and $0.01$ rad differ by $0.023$ around the circle" }
    ]
  },

  "math-12-13": {
    connectionsProse: "<p>Charts make a manifold look locally like Euclidean space, and tangent spaces capture the first-order directions available at a point. The tangent plane to a surface is the familiar example, but the definition applies to any manifold. This lesson connects constraints, curves, and derivatives into one description of feasible infinitesimal motion. It prepares vector fields and Riemannian metrics, which assign vectors and lengths to these spaces.</p>",
    motivation: "<p>A curved constraint set may not allow every possible Euclidean displacement. At a point on a sphere, moving directly outward leaves the sphere to first order, while moving perpendicular to the radius stays tangent. The tangent space collects exactly the velocities that can arise from curves staying on the manifold.</p>" +
                "<p>For constraint-defined manifolds, the chain rule gives a practical test. If $F(x)=0$ along every valid curve, then the derivative of $F$ in a tangent direction must be zero. This turns the geometric idea of feasible motion into a linear equation for tangent vectors.</p>",
    definition: "<p>The tangent space $T_p\\mathcal M$ is the set of first-order velocities through $p$. For a constraint manifold $F(x)=0$, tangent vectors satisfy $$DF_p(v)=0.$$ For the unit sphere, $$T_pS^2=\\{v:p\\cdot v=0\\}.$$</p>" +
                "<p><b>Assumptions that matter:</b> the manifold is locally described by a smooth constraint with a well-defined derivative at the point.</p>",
    symbols: [
      { sym: "$T_p\\mathcal M$", desc: "the tangent space at $p$" },
      { sym: "$v$", desc: "a tangent vector" },
      { sym: "$DF_p$", desc: "the derivative of the constraint" },
      { sym: "$S^2$", desc: "the unit sphere" }
    ],
    derivation: [
      { do: "Let the manifold be a constraint set.", result: "$F(x)=0$", why: "this gives an equation that all points on the manifold satisfy" },
      { do: "Choose a curve in the manifold.", result: "$\\gamma(0)=p$ and $\\gamma'(0)=v$", why: "any tangent vector can be realized as a velocity" },
      { do: "Use the constraint along the curve.", result: "$F(\\gamma(t))=0$", why: "the curve stays on the constraint for all small $t$" },
      { do: "Differentiate at $t=0$.", result: "$DF_p(\\gamma'(0))=0$", why: "the chain rule gives the first-order constraint" },
      { do: "Substitute the velocity.", result: "$DF_p(v)=0$", why: "tangent vectors are feasible first-order motions" },
      { do: "Apply this to the unit sphere.", result: "$F(x)=x\\cdot x-1$, $DF_p(v)=2p\\cdot v$, and $T_pS^2=\\{v:p\\cdot v=0\\}$", why: "sphere tangent vectors are perpendicular to the radius" }
    ],
    applications: [
      { title: "North pole", background: "sphere tangents are horizontal at the top", numbers: "At the north pole $(0,0,1)$, tangent vectors satisfy $c=0$, so $T_pS^2=\\{(a,b,0)\\}$" },
      { title: "Circle tangent", background: "radius perpendicularity in two dimensions", numbers: "Circle at $(1,0)$ has tangent vectors $(0,b)$" },
      { title: "Simplex tangent", background: "probability-preserving directions sum to zero", numbers: "Simplex vector $(0.1,-0.3,0.2)$ is tangent because the components sum to $0$" },
      { title: "SPD matrices", background: "symmetric matrices form the tangent directions", numbers: "SPD matrices of size $3$ have symmetric tangent dimension $3\\cdot4/2=6$" },
      { title: "$SO(3)$ tangent", background: "rotation tangents are skew-symmetric", numbers: "$SO(3)$ tangent vectors are skew-symmetric matrices with $3$ independent entries" },
      { title: "Plane constraint", background: "directions tangent to a plane preserve the linear sum", numbers: "Plane $x+y+z=3$ has tangent vector $(1,-1,0)$ because the component sum is $0$" }
    ]
  },

  "math-12-14": {
    connectionsProse: "<p>Tangent spaces describe the possible directions at one point, and a vector field chooses one such direction at every point. This turns a manifold into a space with local instructions for motion. Curves can then follow the field, and optimization can be described as flowing along a descent direction. The lesson prepares connections, geodesics, and manifold-aware learning algorithms.</p>",
    motivation: "<p>A single tangent vector tells how to move from one point, but many geometric and dynamical problems need directions everywhere. A vector field assigns those directions consistently across the manifold. Integral curves are the paths whose velocities obey the assigned directions at each point.</p>" +
                "<p>On a curved or constrained space, an ordinary Euclidean step may leave the manifold. The vector field gives the first-order tangent motion, and a projection or retraction restores the point to the valid space when needed. Gradient fields are a central example because they turn optimization into motion along a manifold.</p>",
    definition: "<p>A vector field assigns each point $p$ a tangent vector $$X(p)\\in T_p\\mathcal M.$$ An integral curve follows the field by satisfying $$\\gamma'(t)=X(\\gamma(t)).$$</p>" +
                "<p><b>Assumptions that matter:</b> each point has a tangent space, and the assigned vector $X(p)$ lies in the correct tangent space.</p>",
    symbols: [
      { sym: "$X$", desc: "a vector field" },
      { sym: "$X(p)$", desc: "a tangent vector at $p$" },
      { sym: "$\\gamma$", desc: "an integral curve" },
      { sym: "$h$", desc: "a small step" },
      { sym: "$\\nabla f$", desc: "a gradient field" }
    ],
    derivation: [
      { do: "Assign a vector at each point.", result: "$X(p)\\in T_p\\mathcal M$", why: "the vector must live in the correct tangent space" },
      { do: "Impose the integral-curve equation.", result: "$\\gamma'(t)=X(\\gamma(t))$", why: "the curve's velocity equals the assigned vector" },
      { do: "Take a small Euler step.", result: "$\\gamma(t+h)\\approx\\gamma(t)+hX(\\gamma(t))$", why: "first-order motion follows the vector field" },
      { do: "Handle a constrained manifold.", result: "project or retract the step back to the manifold", why: "the tangent step is only first-order feasible" },
      { do: "Use a gradient field for optimization.", result: "$X=-\\nabla f$", why: "the field is the steepest local descent direction under the chosen metric" }
    ],
    applications: [
      { title: "Rotation field", background: "cross product field on the sphere", numbers: "Rotation field on the sphere $X(p)=a\\times p$ with $a=(0,0,1)$ gives $X(1,0,0)=(0,1,0)$" },
      { title: "Descent field", background: "negative gradient for a quadratic", numbers: "Descent field for $f=x^2+y^2$ at $(3,4)$ is $(-6,-8)$" },
      { title: "ODE field", background: "a scalar vector field gives time derivative", numbers: "ODE field $X(x)=0.5x$ at $x=2$ gives derivative $1$" },
      { title: "Euler step", background: "one first-order update along the field", numbers: "Euler step from $x=2$ with $h=0.1$ gives $2.1$" },
      { title: "Velocity field", background: "norm accumulated over repeated steps", numbers: "A velocity field of norm $0.03$ for $50$ steps gives approximate path length $1.5$" },
      { title: "Simplex field", background: "probability mass is preserved by zero-sum directions", numbers: "On the simplex, field $(0.2,-0.1,-0.1)$ preserves total probability because its components sum to $0$" }
    ]
  },

  "math-12-15": {
    connectionsProse: "<p>Tangent spaces provide local directions, but geometry also needs a way to measure those directions. A Riemannian metric assigns an inner product to each tangent space, making lengths, angles, gradients, and volumes meaningful. This lesson generalizes the first fundamental form from surfaces to arbitrary manifolds. It is the start of the metric spine that leads to geodesics, exponential maps, Fisher information, and natural gradients.</p>",
    motivation: "<p>In Euclidean space, the dot product silently decides which vectors are long, short, or perpendicular. On a manifold, there may be no single global dot product that fits the geometry. A Riemannian metric supplies a local inner product at each point, and that local ruler can change from point to point.</p>" +
                "<p>The matrix form makes the idea concrete. Positive definiteness ensures that nonzero vectors have positive length, while the inverse metric converts ordinary gradients into metric-aware gradients. In optimization, this means a step can be scaled by the geometry of the parameter space instead of by raw coordinates alone.</p>",
    definition: "<p>A Riemannian metric assigns a smoothly varying positive-definite inner product to each tangent space. In coordinates, $$g_p(u,v)=u^TG(p)v,\\qquad \\lVert u\\rVert_g^2=u^TG(p)u.$$</p>" +
                "<p><b>Assumptions that matter:</b> each tangent space has a smoothly varying positive-definite inner product represented locally by $G(p)$.</p>",
    symbols: [
      { sym: "$g_p$", desc: "the metric at $p$" },
      { sym: "$G(p)$", desc: "its coordinate matrix" },
      { sym: "$u,v$", desc: "tangent vectors" },
      { sym: "$\\tilde g$", desc: "the metric or natural gradient" }
    ],
    derivation: [
      { do: "Choose a positive-definite matrix at $p$.", result: "$G(p)$", why: "positivity makes nonzero vectors have positive length" },
      { do: "Define the metric inner product.", result: "$g_p(u,v)=u^TG(p)v$", why: "this pairs tangent vectors using the local ruler" },
      { do: "Set $u=v$.", result: "$\\lVert u\\rVert_g^2=u^TG(p)u$", why: "inner products measure lengths by self-pairing" },
      { do: "Use the same inner product for angles.", result: "$\\cos\\theta=g_p(u,v)/(\\lVert u\\rVert_g\\lVert v\\rVert_g)$", why: "angle is normalized alignment" },
      { do: "Solve for the metric gradient.", result: "$G\\tilde g=\\nabla L$, so $\\tilde g=G^{-1}\\nabla L$", why: "the inverse metric converts ordinary gradients into metric-aware gradients" }
    ],
    applications: [
      { title: "Metric norm", background: "a diagonal metric changes vector length", numbers: "With $G=\\operatorname{diag}(4,1)$ and $u=(1,2)$, metric norm is $\\sqrt8=2.828$" },
      { title: "Natural step", background: "the same metric rescales a gradient", numbers: "The same metric turns gradient $(2,2)$ into $G^{-1}g=(0.5,2)$" },
      { title: "Sphere length", background: "radius scales angular longitude distance", numbers: "Unit sphere radius $3$ has equator longitude step $0.1$ length $0.3$" },
      { title: "Bernoulli Fisher", background: "probability parameters carry a metric", numbers: "Bernoulli Fisher metric at $p=0.2$ is $6.25$" },
      { title: "Bernoulli step", background: "Fisher metric turns parameter change into length", numbers: "Bernoulli step $dp=0.04$ has Fisher length $0.1$" },
      { title: "Area scale", background: "metric determinant controls local volume scaling", numbers: "A metric determinant $5$ gives local area scale $\\sqrt5=2.236$" }
    ]
  },

  "math-12-16": {
    connectionsProse: "<p>The earlier lessons in this section give the ingredients for measuring motion on curved spaces. Parametrized curves describe paths, the first fundamental form measures their lengths, and a Riemannian metric tells each tangent vector how long it is. A geodesic is the path that those ingredients single out as straightest, or locally shortest, inside the curved space itself.</p>" +
                      "<p>This lesson is the bridge from local measurements to global geometry. Geodesics give the shortest routes on a sphere, the update paths used by manifold optimization, and the distance functions used in manifold learning. They also prepare the next lesson, the exponential map, which starts with a tangent vector and follows the geodesic it determines.</p>",
    motivation: "<p>In a flat plane, the shortest path between two points is a straight line. A sphere has no straight lines that stay on the surface, but it still has paths that behave like straight lines from the point of view of the surface. Great-circle arcs are the familiar example: airplanes follow them because they are shorter on the globe than latitude-longitude drawings suggest.</p>" +
                "<p>The same idea applies on any Riemannian manifold. A geodesic is a curve whose velocity is transported along itself without turning sideways according to the manifold's connection. Equivalently, for nearby points it is the path that makes the length stationary. The formula looks more complicated than a line because the coordinates themselves bend, and the Christoffel symbols record how the coordinate grid changes.</p>" +
                "<p>For machine learning, this matters whenever data or parameters do not naturally live in flat Euclidean space. Probability distributions carry the Fisher metric, spherical embeddings use angular distance, and geometric deep learning often compares points by distances that follow the data manifold rather than cutting through the surrounding space.</p>",
    definition: "<p>A geodesic is a curve whose velocity is parallel along itself. In coordinates and on a sphere, the central formulas are $$\\frac{d^2x^k}{dt^2}+\\Gamma^k_{ij}(x)\\frac{dx^i}{dt}\\frac{dx^j}{dt}=0,\\qquad d_{S_R^2}(p,q)=R\\theta,\\qquad \\theta=\\arccos\\!\\left(\\frac{p\\cdot q}{R^2}\\right).$$</p>" +
                "<p><b>Assumptions that matter:</b> the curve lies on a Riemannian manifold with a connection, and the sphere distance formula uses non-antipodal points on a sphere of radius $R$.</p>",
    symbols: [
      { sym: "$x^k(t)$", desc: "the $k$th coordinate of the curve" },
      { sym: "$\\dot x^i$", desc: "its velocity component" },
      { sym: "$\\ddot x^k$", desc: "its coordinate acceleration" },
      { sym: "$\\Gamma^k_{ij}$", desc: "Christoffel symbols for the chosen metric" },
      { sym: "$p,q$", desc: "points on the sphere" },
      { sym: "$R$", desc: "the sphere radius" },
      { sym: "$\\theta$", desc: "the central angle in radians" }
    ],
    derivation: [
      { do: "Start with a curve $x(t)$ and its velocity components $\\dot x^i=dx^i/dt$.", result: "$\\dot x^i$", why: "a geodesic is defined by how its velocity changes along the curve" },
      { do: "Write parallel velocity.", result: "$\\nabla_{\\dot x}\\dot x=0$", why: "the curve is not accelerating sideways according to the manifold's connection" },
      { do: "Expand the covariant derivative in coordinates.", result: "$(\\nabla_{\\dot x}\\dot x)^k=\\ddot x^k+\\Gamma^k_{ij}\\dot x^i\\dot x^j$", why: "the ordinary second derivative is corrected by the coordinate-bending terms" },
      { do: "Set each component to zero.", result: "$\\ddot x^k+\\Gamma^k_{ij}\\dot x^i\\dot x^j=0$", why: "this is the coordinate geodesic equation" },
      { do: "Find the sphere geodesic through two non-antipodal points.", result: "the great circle determined by the origin, $p$, and $q$", why: "intersecting that plane with the sphere gives the locally shortest arc" },
      { do: "Use the dot-product formula for the central angle.", result: "$p\\cdot q=\\lVert p\\rVert\\lVert q\\rVert\\cos\\theta=R^2\\cos\\theta$", why: "both radii have length $R$" },
      { do: "Solve for the angle.", result: "$\\theta=\\arccos((p\\cdot q)/R^2)$", why: "the angle is determined by the normalized dot product" },
      { do: "Convert angle to arc length.", result: "$d_{S_R^2}(p,q)=R\\theta$", why: "the great-circle geodesic is a circular arc" },
      { do: "Evaluate the example.", result: "if $R=3$ and $\\theta=0.4$, then $d=3\\cdot0.4=1.2$", why: "the distance uses the surface, not the chord through the ball" }
    ],
    applications: [
      { title: "Sphere distance", background: "on a radius-$3$ sphere with central angle $0.4$", numbers: "the geodesic length is $R\\theta=1.2$" },
      { title: "Quarter great circle", background: "on the unit sphere, $(1,0,0)$ to $(0,1,0)$", numbers: "has $\\theta=\\pi/2$, so distance is $1.571$" },
      { title: "Earth routes", background: "a $30^\\circ=\\pi/6$ central angle on Earth", numbers: "gives $6371\\cdot\\pi/6=3335.85$ km" },
      { title: "Hyperbolic embeddings", background: "in the Poincare disk, radial distance from $0$ to radius $0.5$", numbers: "is $2\\operatorname{artanh}(0.5)=1.099$" },
      { title: "Diffusion kernels", background: "a geodesic distance $d=1.2$ with time $t=0.5$", numbers: "gives $\\exp(-d^2/(4t))=0.487$" },
      { title: "Robot orientation", background: "on $SO(2)$, moving from $350^\\circ$ to $10^\\circ$", numbers: "follows the wrapped geodesic of $20^\\circ=0.349$ rad, not $340^\\circ$" }
    ]
  },

  "math-12-17": {
    connectionsProse: "<p>Geodesics describe straightest paths on a manifold, and the exponential map uses them to turn tangent vectors into actual manifold points. The tangent space gives a flat local workspace, while the exponential map returns the result to the curved space. This lesson connects local linear motion with global manifold position. It is especially important for optimization, where updates often begin as tangent vectors.</p>",
    motivation: "<p>A tangent vector at a point has both direction and length, but by itself it lives in the flat tangent space rather than on the manifold. The exponential map interprets that vector as an initial velocity and follows the corresponding geodesic for one unit of time. The endpoint is the manifold point reached by that intrinsic step.</p>" +
                "<p>On the sphere, this is easy to visualize. A tangent vector at the north pole points along a great circle, and its norm gives the angular distance traveled. The formula combines the starting radial direction and the tangent direction to land back exactly on the sphere.</p>",
    definition: "<p>The exponential map at $p$ sends an initial tangent vector to the endpoint of its geodesic after one unit of time: $$\\exp_p(v)=\\gamma_v(1).$$ On the unit sphere, $$\\exp_p(v)=\\cos\\lVert v\\rVert\\,p+\\sin\\lVert v\\rVert\\,v/\\lVert v\\rVert.$$</p>" +
                "<p><b>Assumptions that matter:</b> a geodesic exists for the chosen initial point and tangent vector over the needed time interval.</p>",
    symbols: [
      { sym: "$\\exp_p$", desc: "the exponential map at $p$" },
      { sym: "$v$", desc: "an initial tangent vector" },
      { sym: "$\\gamma_v$", desc: "the geodesic with that initial velocity" },
      { sym: "$\\lVert v\\rVert$", desc: "its metric length" }
    ],
    derivation: [
      { do: "Choose $p\\in\\mathcal M$ and $v\\in T_p\\mathcal M$.", result: "$v$ is the initial velocity", why: "the tangent vector determines the geodesic's initial motion" },
      { do: "Let $\\gamma_v$ be the geodesic with those initial data.", result: "$\\gamma_v(0)=p$ and $\\gamma_v'(0)=v$", why: "geodesics are determined by initial position and velocity" },
      { do: "Define the exponential map.", result: "$\\exp_p(v)=\\gamma_v(1)$", why: "run the geodesic for time $1$" },
      { do: "Specialize to the unit sphere.", result: "the angular speed is $\\lVert v\\rVert$", why: "arc length equals angle on the unit sphere" },
      { do: "Use the great-circle formula.", result: "$\\exp_p(v)=\\cos\\lVert v\\rVert\\,p+\\sin\\lVert v\\rVert\\,v/\\lVert v\\rVert$", why: "combine the radial starting direction and unit tangent direction" }
    ],
    applications: [
      { title: "North pole step", background: "unit-sphere exponential from the north pole", numbers: "At north pole with $v=(0.1,0,0)$, the unit-sphere exponential gives $(0.0998,0,0.9950)$" },
      { title: "Angular size", background: "norm of the tangent step as angle", numbers: "The same step has angular size $0.1$ rad, or $5.73^\\circ$" },
      { title: "Equator step", background: "great-circle update from $p=(1,0,0)$", numbers: "At $p=(1,0,0)$ with $v=(0,0.2,0)$, the result is $(0.9801,0.1987,0)$" },
      { title: "Tangent perturbation", background: "sphere step size in degrees", numbers: "A tangent perturbation of norm $0.05$ on a sphere is $2.865^\\circ$" },
      { title: "Hyperbolic learning", background: "small tangent norms are local distances", numbers: "Hyperbolic learning can treat tangent norm $0.1$ as local distance about $0.1$" },
      { title: "Manifold optimizer", background: "tangent update before curvature corrections", numbers: "A manifold optimizer with step norm $0.03$ moves about $0.03$ geodesic units before curvature corrections" }
    ]
  },

  "math-12-18": {
    connectionsProse: "<p>Geodesics and exponential maps require a way to compare tangent vectors at nearby points. A connection provides that rule by defining how vector fields are differentiated along directions on the manifold. Parallel transport is the corresponding way to move a vector along a curve without introducing extra turning. This lesson explains the mechanism behind covariant acceleration, geodesics, and manifold momentum.</p>",
    motivation: "<p>In Euclidean space, vectors at different points can be compared by sliding them around unchanged. On a curved manifold, tangent vectors at different points belong to different tangent spaces, so that simple comparison is no longer built in. A connection supplies the missing rule for differentiating and transporting tangent vectors consistently.</p>" +
                "<p>Christoffel symbols appear because coordinate basis vectors themselves may change from point to point. The covariant derivative corrects ordinary component derivatives by adding those basis-change terms. A vector field is parallel along a curve when its covariant derivative along that curve is zero.</p>",
    definition: "<p>A connection differentiates vector fields along directions. In a coordinate chart, it is represented by Christoffel symbols through $$\\nabla_{\\partial_i}\\partial_j=\\Gamma^k_{ij}\\partial_k.$$ A vector field $V$ is parallel along $\\gamma$ when $$\\nabla_{\\gamma'}V=0.$$</p>" +
                "<p><b>Assumptions that matter:</b> work in a coordinate chart with a chosen connection represented locally by Christoffel symbols.</p>",
    symbols: [
      { sym: "$\\nabla$", desc: "the connection" },
      { sym: "$X,Y,V$", desc: "vector fields" },
      { sym: "$\\partial_i$", desc: "coordinate basis vectors" },
      { sym: "$\\Gamma^k_{ij}$", desc: "Christoffel symbols" },
      { sym: "$\\gamma$", desc: "a curve" }
    ],
    derivation: [
      { do: "Notice that coordinate basis vectors can change from point to point.", result: "ordinary component derivatives miss basis motion", why: "coordinates themselves may bend" },
      { do: "Define the basis derivative.", result: "$\\nabla_{\\partial_i}\\partial_j=\\Gamma^k_{ij}\\partial_k$", why: "Christoffel symbols record how basis vector $\\partial_j$ changes in direction $\\partial_i$" },
      { do: "Differentiate a vector field $Y=Y^j\\partial_j$ along $X$.", result: "$\\nabla_XY$ includes component derivatives and basis-change corrections", why: "both sources affect the tangent vector" },
      { do: "Define parallel transport along a curve.", result: "$\\nabla_{\\gamma'}V=0$", why: "the vector changes only as needed to remain consistently transported" },
      { do: "Specialize to geodesics.", result: "$V=\\gamma'$", why: "a geodesic's own velocity is parallel transported" }
    ],
    applications: [
      { title: "Polar coordinates", background: "angular basis motion creates a radial correction", numbers: "In polar coordinates, $\\nabla_{\\partial_\\theta}\\partial_\\theta=-r\\partial_r$, so at $r=2$ angular motion has radial correction $-2\\partial_r$" },
      { title: "Sphere triangle", background: "parallel transport around a loop rotates vectors", numbers: "A unit-sphere triangle of area $\\pi/2$ rotates a transported vector by $\\pi/2$" },
      { title: "Acceleration correction", background: "small correction accumulated over time", numbers: "A correction $0.01$ m/s$^2$ over $10$ s changes speed by $0.1$ m/s" },
      { title: "Manifold momentum", background: "momentum combines transported tangent vectors", numbers: "Manifold momentum of norm $0.8$ can be combined with a transported gradient of norm $0.2$" },
      { title: "Tube frame", background: "normal frames are transported along sampled edges", numbers: "A tube with $100$ samples transports one normal frame across $99$ edges" },
      { title: "Rotation update", background: "angular velocity over a short interval", numbers: "Rotation velocity $0.2$ rad/s for $0.05$ s gives an orientation update $0.01$ rad" }
    ]
  },

  "math-12-19": {
    connectionsProse: "<p>Riemannian metrics measure tangent vectors, and Fisher information is the metric that probability models carry naturally. Instead of measuring parameter changes by raw coordinate distance, it measures how much the probability distribution changes. This connects differential geometry with statistics and natural-gradient learning. It also supplies the metric used in the geometric deep learning capstone.</p>",
    motivation: "<p>A small change in a parameter can matter very differently depending on where the model is. Moving a Bernoulli probability by $0.01$ near $0.5$ is not the same distributional change as moving by $0.01$ near $0.99$. The Fisher metric captures this sensitivity through the variance of the score.</p>" +
                "<p>The local KL expansion explains why Fisher information is geometric. It says that, to second order, the distinguishability between nearby distributions is measured by a quadratic form using $I(\\theta)$. Natural gradients use the inverse of that form so parameter updates respect distributional distance rather than coordinate scale alone.</p>",
    definition: "<p>For a differentiable probabilistic model, the Fisher information metric is $$I(\\theta)=\\mathbb E[s_\\theta s_\\theta^T],\\qquad s_\\theta(x)=\\nabla_\\theta\\log p(x\\mid\\theta).$$ For Bernoulli parameter $p$, $$I(p)=\\frac1{p(1-p)}.$$</p>" +
                "<p><b>Assumptions that matter:</b> the model is differentiable and the score and its second moments are well-defined.</p>",
    symbols: [
      { sym: "$p(x\\mid\\theta)$", desc: "the model distribution" },
      { sym: "$\\theta$", desc: "the parameter" },
      { sym: "$s_\\theta$", desc: "the score" },
      { sym: "$I(\\theta)$", desc: "Fisher information" },
      { sym: "$d\\theta$", desc: "a small parameter step" },
      { sym: "$D_{KL}$", desc: "KL divergence" }
    ],
    derivation: [
      { do: "Define the score for $p(x\\mid\\theta)$.", result: "$s_\\theta(x)=\\nabla_\\theta\\log p(x\\mid\\theta)$", why: "it measures local log-probability sensitivity" },
      { do: "Average score outer products.", result: "$I(\\theta)=\\mathbb E[s_\\theta s_\\theta^T]$", why: "this gives a positive semidefinite sensitivity matrix" },
      { do: "Write the Bernoulli log likelihood.", result: "$x\\log p+(1-x)\\log(1-p)$", why: "the two outcomes have probabilities $p$ and $1-p$" },
      { do: "Differentiate with respect to $p$.", result: "$s_p(x)=x/p-(1-x)/(1-p)$", why: "differentiate one operation for each log term" },
      { do: "Square and take expectation.", result: "$I(p)=p(1/p^2)+(1-p)(1/(1-p)^2)$", why: "use $P(x=1)=p$ and $P(x=0)=1-p$" },
      { do: "Simplify the expression.", result: "$I(p)=1/p+1/(1-p)=1/[p(1-p)]$", why: "combine fractions" },
      { do: "State the local KL expansion.", result: "$D_{KL}(p_\\theta\\|p_{\\theta+d\\theta})\\approx\\tfrac12 d\\theta^TI(\\theta)d\\theta$", why: "Fisher length is local distributional change" }
    ],
    applications: [
      { title: "Bernoulli information", background: "Fisher metric at an imbalanced probability", numbers: "Bernoulli $p=0.2$ gives $I=1/(0.2\\cdot0.8)=6.25$" },
      { title: "Natural gradient", background: "inverse Fisher rescales the ordinary gradient", numbers: "Natural gradient with ordinary gradient $1.5$ gives $I^{-1}g=0.16\\cdot1.5=0.24$" },
      { title: "Near-boundary step", background: "information grows near $p=1$", numbers: "At $p=0.99$, $I=101.01$ and step $0.01$ has squared Fisher length $0.0101$" },
      { title: "Asymptotic variance", background: "sample information controls estimator variance", numbers: "If $100$ samples give information $400$, asymptotic variance is $1/400=0.0025$" },
      { title: "Local KL", background: "Fisher length approximates distributional distinguishability", numbers: "Fisher squared length $0.02$ gives local KL about $0.01$" },
      { title: "Gaussian mean", background: "known variance sets one-sample information", numbers: "Gaussian mean with variance $9$ has one-sample information $1/9$, so $81$ samples give total information $9$" }
    ]
  },

  "math-12-20": {
    connectionsProse: "<p>The final lesson gathers the section's geometric tools into a machine-learning viewpoint. Manifolds provide the spaces, tangent spaces provide local directions, metrics measure steps, and exponential maps or retractions return tangent updates to valid points. Fisher information supplies a central metric for probability models. Together these ideas explain why geometry can change how neural networks represent data and how optimizers move through parameter spaces.</p>",
    motivation: "<p>Geometric deep learning starts from the structure of the data or parameter space. Graphs have neighborhoods, spheres have angular distances, groups have symmetries, probability models have Fisher geometry, and manifolds have tangent spaces. A model that respects this structure can use fewer arbitrary coordinate choices and more meaningful operations.</p>" +
                "<p>Natural gradients are one concrete example. The ordinary gradient tells how loss changes under coordinate steps, while the metric says which steps are actually small in the geometry of the space. Solving through the metric produces a preconditioned direction, and a retraction or exponential map turns that tangent update back into a valid geometric object.</p>",
    definition: "<p>Geometric deep learning uses geometric structure in data or parameter spaces. With metric matrix $G$, the natural-gradient direction is $$G^{-1}\\nabla L,$$ and tangent updates are returned to the space by an exponential map or retraction.</p>" +
                "<p><b>Assumptions that matter:</b> the parameter or data space has a metric and tangent updates can be returned to the space by an exponential map or retraction.</p>",
    symbols: [
      { sym: "$G$", desc: "the metric matrix, often Fisher information" },
      { sym: "$\\nabla L$", desc: "the ordinary loss gradient" },
      { sym: "$G^{-1}\\nabla L$", desc: "the natural gradient" },
      { sym: "$\\delta$", desc: "a tangent step" },
      { sym: "retraction", desc: "a map from tangent steps back to the manifold" }
    ],
    derivation: [
      { do: "Let the parameter space have metric matrix $G$.", result: "$G$", why: "this defines which changes are small or large" },
      { do: "Write the first-order loss change.", result: "$\\nabla L^T\\delta$", why: "the ordinary gradient pairs with a small step" },
      { do: "Constrain the step size by metric length.", result: "$\\delta^TG\\delta\\le\\epsilon^2$", why: "the trust region is geometric rather than Euclidean" },
      { do: "Optimize the linear decrease under this quadratic constraint.", result: "$\\delta\\propto-G^{-1}\\nabla L$", why: "Lagrange multipliers give the preconditioned direction" },
      { do: "Name the natural-gradient direction.", result: "$G^{-1}\\nabla L$", why: "the metric preconditions the ordinary gradient" },
      { do: "Return a tangent step to the manifold.", result: "use an exponential map or retraction", why: "the updated parameter must return to the valid geometric space" }
    ],
    applications: [
      { title: "Bernoulli natural gradient", background: "Fisher geometry rescales the probability update", numbers: "Bernoulli natural gradient at $p=0.2$ with ordinary gradient $1.5$ is $0.24$, so learning rate $0.1$ moves by $0.024$" },
      { title: "Sphere retraction", background: "normalization maps a perturbed vector back to the sphere", numbers: "Normalizing $(0.1,0.2,1)$ gives sphere retraction $(0.0976,0.1952,0.9759)$" },
      { title: "GNN message", background: "neighbor aggregation respects graph neighborhoods", numbers: "GNN neighbor scalars $4,7,10$ average to message $7$" },
      { title: "Rotation symmetry", background: "group structure transforms features predictably", numbers: "A $90^\\circ$ rotation sends vector $(2,1)$ to $(-1,2)$" },
      { title: "Hyperbolic relation", background: "nearer hyperbolic points get larger softmax weight", numbers: "Hyperbolic distances $0.7$ and $2.1$ give softmax probability $0.802$ for the closer relation" },
      { title: "SPD variances", background: "log coordinates update positive variances", numbers: "SPD log-variances $(\\ln4,\\ln9)$ plus $(-0.1,0.2)$ map to variances $(3.62,10.99)$" }
    ]
  }
};
