module.exports = {
  "math-12-11": {
    id: "math-12-11",
    title: "Mean curvature",
    tagline: "Mean curvature is the average bending a surface feels in its two principal directions.",
    connections: {
      buildsOn: ["curvature", "surfaces in $\\mathbb{R}^3$", "partial derivatives"],
      leadsTo: ["Manifolds and charts", "Riemannian metrics", "Geodesics"],
      usedWith: ["principal curvatures", "normal vectors", "surface variation"]
    },
    motivation: "<p>You already know that a small circle bends more sharply than a large one. A surface is richer: through one point it can bend differently in two perpendicular directions.</p><p><b>Mean curvature</b> keeps the useful summary. It averages those two bends, so a sphere, a saddle, a soap film, or a mesh vertex can all be compared with one local number.</p>",
    definition: "<p>For a smooth surface in $\\mathbb{R}^3$, let $k_1$ and $k_2$ be the principal curvatures at a point, measured with respect to a chosen unit normal. The <b>mean curvature</b> is $$H=\\dfrac{k_1+k_2}{2}.$$ A sphere of radius $R$ has $k_1=k_2=1/R$, so $H=1/R$ for the outward normal.</p><p>For a graph $z=f(x,y)$ with $\\nabla f(0,0)=0$, the tangent plane is horizontal and $H=(f_{xx}+f_{yy})/2$ at the origin. That is the average of the two second-derivative bends when the axes are principal directions.</p><p><b>Assumptions that matter:</b> the surface is smooth enough to have a tangent plane and second derivatives; a unit normal has been chosen; changing the normal changes the sign of $H$; and $H=0$ means the two principal bends balance.</p>",
    worked: {
      problem: "Find the mean curvature of a sphere of radius $4$ with the outward normal.",
      skills: ["principal curvatures", "averaging", "units"],
      strategy: "A sphere bends equally in every tangent direction, so both principal curvatures are $1/R$.",
      steps: [
        { do: "Identify the radius", result: "$R=4$", why: "the radius sets the curvature scale" },
        { do: "Write the first principal curvature", result: "$k_1=1/4$", why: "normal sections are circles of radius $4$" },
        { do: "Write the second principal curvature", result: "$k_2=1/4$", why: "the sphere is symmetric in all tangent directions" },
        { do: "Average the two curvatures", result: "$H=\\dfrac{1/4+1/4}{2}$", why: "mean curvature is their arithmetic mean" },
        { do: "Simplify", result: "$H=1/4$", why: "the average of equal numbers is the same number" }
      ],
      verify: "The unit is inverse length, and a larger sphere would have smaller mean curvature, which matches the picture.",
      answer: "$H=1/4$ for the outward normal.",
      connects: "Mean curvature compresses two local bending directions into one average bending measurement."
    },
    practice: [
      { problem: "A plane has $k_1=0$ and $k_2=0$. Find $H$.", steps: [
        { do: "Write the formula", result: "$H=\\dfrac{k_1+k_2}{2}$", why: "start from the definition" },
        { do: "Substitute the curvatures", result: "$H=\\dfrac{0+0}{2}$", why: "a plane does not bend normally" },
        { do: "Add the numerator", result: "$H=0/2$", why: "zero plus zero is zero" },
        { do: "Divide", result: "$H=0$", why: "zero divided by two is zero" }
      ], answer: "The mean curvature is $0$." },
      { problem: "A cylinder of radius $3$ has principal curvatures $1/3$ and $0$. Find $H$.", steps: [
        { do: "Name the curved direction", result: "$k_1=1/3$", why: "circular cross-sections have radius $3$" },
        { do: "Name the straight direction", result: "$k_2=0$", why: "the axis direction is straight" },
        { do: "Average", result: "$H=\\dfrac{1/3+0}{2}$", why: "use the definition" },
        { do: "Simplify", result: "$H=1/6$", why: "half of $1/3$ is $1/6$" }
      ], answer: "The mean curvature is $1/6$." },
      { problem: "For $z=x^2+y^2$ at the origin, use $H=(f_{xx}+f_{yy})/2$.", steps: [
        { do: "Compute $f_{xx}$", result: "$f_{xx}=2$", why: "differentiate $x^2$ twice" },
        { do: "Compute $f_{yy}$", result: "$f_{yy}=2$", why: "differentiate $y^2$ twice" },
        { do: "Check the tangent condition", result: "$\\nabla f(0,0)=(0,0)$", why: "the simplified graph formula applies" },
        { do: "Average", result: "$H=\\dfrac{2+2}{2}$", why: "add the two second derivatives" },
        { do: "Simplify", result: "$H=2$", why: "four divided by two is two" }
      ], answer: "At the origin, $H=2$." },
      { problem: "For $z=x^2-y^2$ at the origin, find $H$.", steps: [
        { do: "Compute $f_{xx}$", result: "$2$", why: "the $x$ direction bends upward" },
        { do: "Compute $f_{yy}$", result: "$-2$", why: "the $y$ direction bends downward" },
        { do: "Average", result: "$H=\\dfrac{2+(-2)}{2}$", why: "opposite bends balance" },
        { do: "Simplify", result: "$H=0$", why: "the numerator is zero" },
        { do: "Interpret", result: "mean-curvature balanced", why: "zero mean curvature does not mean flat" }
      ], answer: "The saddle has $H=0$ at the origin." },
      { problem: "A mean-curvature flow update is $\\Delta p=-0.2Hn$. If $H=1.5$ and $n=(0,0,1)$, find $\\Delta p$.", steps: [
        { do: "Substitute $H$", result: "$\\Delta p=-0.2\\cdot1.5\\,n$", why: "use the given curvature" },
        { do: "Multiply the scalars", result: "$-0.2\\cdot1.5=-0.3$", why: "compute the update size" },
        { do: "Substitute the normal", result: "$\\Delta p=-0.3(0,0,1)$", why: "attach the direction" },
        { do: "Scale the vector", result: "$\\Delta p=(0,0,-0.3)$", why: "multiply each component" },
        { do: "Check direction", result: "opposite the chosen normal", why: "the scalar is negative" }
      ], answer: "The displacement is $(0,0,-0.3)$." }
    ],
    applications: [
      { title: "Soap films", background: "Minimal surfaces were first understood through soap films, which balance tension so their mean curvature is zero away from boundaries.", numbers: "If $k_1=0.7$ and $k_2=-0.7$, then $H=(0.7-0.7)/2=0$." },
      { title: "Bubble pressure", background: "The Young-Laplace law connects pressure jump to mean curvature, explaining why small bubbles need more pressure.", numbers: "For $\\gamma=0.03$ N/m and radius $0.02$ m, $H=50$ and $\\Delta p=2\\gamma H=3$ Pa." },
      { title: "Mesh smoothing", background: "Geometry processing removes noise by moving vertices along mean-curvature normals.", numbers: "With step $0.01$ and $H=4$, the normal displacement size is $0.04$." },
      { title: "Image surfaces", background: "A grayscale image can be treated as a height surface, where curvature-based smoothing respects local shape.", numbers: "For $z=0.5x^2+0.1y^2$, $H=(1+0.2)/2=0.6$ at a flat-gradient point." },
      { title: "Neural implicit surfaces", background: "Learned 3-D surfaces often include curvature penalties so reconstructions stay smooth.", numbers: "A penalty $0.05H^2$ with $H=3$ contributes $0.45$ to the loss." },
      { title: "Medical shape analysis", background: "Vessels and organs are compared with curvature summaries because disease can change local bending.", numbers: "A cylindrical vessel of radius $2$ mm has $H=1/(2R)=0.25$ mm$^{-1}$." }
    ],
    applicationsClose: "Across films, meshes, images, and learned surfaces, mean curvature is the local average bend that computation can act on.",
    takeaways: ["Mean curvature is $H=(k_1+k_2)/2$.", "Its sign depends on the chosen normal.", "Spheres have $H=1/R$ and cylinders have $H=1/(2R)$.", "Zero mean curvature means balanced bending, not necessarily flatness."]
  },

  "math-12-12": {
    id: "math-12-12",
    title: "Manifolds and charts",
    tagline: "A manifold is a curved space that can be read locally with ordinary coordinates.",
    connections: {
      buildsOn: ["sets and functions", "coordinate maps", "curves and surfaces"],
      leadsTo: ["Tangent spaces", "Vector fields on manifolds", "Riemannian metrics"],
      usedWith: ["atlases", "coordinate changes", "parametrizations"]
    },
    motivation: "<p>You already trust maps of the Earth even though no single flat map represents the whole globe perfectly. Each map is local, and overlapping maps translate between coordinate systems.</p><p>A <b>manifold</b> is the same idea made precise. It may curve or wrap globally, but near each point it behaves like ordinary $\\mathbb{R}^n$.</p>",
    definition: "<p>An $n$-dimensional <b>manifold</b> $\\mathcal{M}$ is a space that is locally like $\\mathbb{R}^n$. A <b>chart</b> is a one-to-one coordinate map $\\varphi:U\\to V$, where $U\\subset\\mathcal{M}$ and $V\\subset\\mathbb{R}^n$. An <b>atlas</b> is a collection of compatible charts covering the manifold.</p><p>Compatibility means that on overlaps, the coordinate change $\\psi\\circ\\varphi^{-1}$ is smooth. This is what lets derivatives computed in one chart translate smoothly into another chart. The circle is one-dimensional because small arcs need one coordinate, even though one global coordinate has a seam.</p><p><b>Assumptions that matter:</b> charts are local; transition maps must be smooth; the manifold dimension is the number of local coordinates; and global coordinate systems can fail even when local charts work.</p>",
    worked: {
      problem: "Use the upper semicircle chart $\\varphi(x,y)=x$ on $x^2+y^2=1$ with $y>0$. Find the point with coordinate $u=0.6$.",
      skills: ["charts", "inverse maps", "unit circle"],
      strategy: "The chart stores $x$; recover $y$ from the circle equation and the upper-half condition.",
      steps: [
        { do: "Set the chart coordinate", result: "$x=u=0.6$", why: "the chart is projection to the $x$ coordinate" },
        { do: "Use the circle equation", result: "$x^2+y^2=1$", why: "the point lies on the unit circle" },
        { do: "Substitute $x=0.6$", result: "$0.36+y^2=1$", why: "square the coordinate" },
        { do: "Solve for $y^2$", result: "$y^2=0.64$", why: "subtract $0.36$" },
        { do: "Choose the upper value", result: "$y=0.8$", why: "the chart domain has $y>0$" }
      ],
      verify: "$0.6^2+0.8^2=1$, so the recovered point lies on the circle.",
      answer: "The point is $(0.6,0.8)$.",
      connects: "A chart turns a curved local patch into ordinary coordinates and back again."
    },
    practice: [
      { problem: "On the same chart, find the point with coordinate $u=-0.8$.", steps: [
        { do: "Set $x$", result: "$x=-0.8$", why: "the chart coordinate is $x$" },
        { do: "Square $x$", result: "$x^2=0.64$", why: "prepare the circle equation" },
        { do: "Solve for $y^2$", result: "$y^2=1-0.64=0.36$", why: "use $x^2+y^2=1$" },
        { do: "Choose the upper root", result: "$y=0.6$", why: "the chart has $y>0$" },
        { do: "Write the point", result: "$(-0.8,0.6)$", why: "combine the coordinates" }
      ], answer: "The point is $(-0.8,0.6)$." },
      { problem: "The parabola chart sends $(t,t^2)$ to $t$. Find the point with coordinate $t=3$.", steps: [
        { do: "Read the parameter", result: "$t=3$", why: "the coordinate is the parameter" },
        { do: "Compute the first component", result: "$x=3$", why: "the parabola stores $t$ as $x$" },
        { do: "Compute the second component", result: "$y=3^2=9$", why: "use the defining equation" },
        { do: "Write the point", result: "$(3,9)$", why: "combine components" },
        { do: "Check membership", result: "$9=3^2$", why: "the point lies on the parabola" }
      ], answer: "The point is $(3,9)$." },
      { problem: "Charts on positive numbers are $u=x$ and $v=\\ln x$. Find the transition $u\\mapsto v$ and evaluate it at $u=4$.", steps: [
        { do: "Invert the first chart", result: "$x=u$", why: "the first coordinate equals the point" },
        { do: "Apply the second chart", result: "$v=\\ln x$", why: "the second chart takes a logarithm" },
        { do: "Substitute $x=u$", result: "$v=\\ln u$", why: "compose the charts" },
        { do: "Evaluate at $u=4$", result: "$v=\\ln4$", why: "use the requested coordinate" },
        { do: "Approximate", result: "$v\\approx1.386$", why: "natural logarithm of four" }
      ], answer: "The transition map is $v=\\ln u$, and $v\\approx1.386$ at $u=4$." },
      { problem: "Latitude-longitude uses two numbers on a sphere except at seams and poles. What is the local dimension?", steps: [
        { do: "Count coordinates", result: "two", why: "latitude and longitude are two local numbers" },
        { do: "Name the local model", result: "$\\mathbb{R}^2$", why: "two coordinates give a local plane" },
        { do: "Identify the seam", result: "longitude jumps at a chosen meridian", why: "one global chart is discontinuous" },
        { do: "Identify the pole issue", result: "all longitudes meet", why: "coordinates are not one-to-one there" },
        { do: "State the dimension", result: "$2$", why: "local charts still need two coordinates" }
      ], answer: "The sphere is locally two-dimensional." },
      { problem: "On the probability simplex $p_1+p_2+p_3=1$, use chart $(u,v)=(p_1,p_2)$. Recover $p$ from $(0.2,0.5)$.", steps: [
        { do: "Set $p_1$", result: "$p_1=0.2$", why: "the chart stores the first probability" },
        { do: "Set $p_2$", result: "$p_2=0.5$", why: "the chart stores the second probability" },
        { do: "Use the constraint", result: "$p_3=1-p_1-p_2$", why: "probabilities sum to one" },
        { do: "Substitute", result: "$p_3=1-0.2-0.5$", why: "use the chart values" },
        { do: "Simplify", result: "$p_3=0.3$", why: "subtract" }
      ], answer: "The probability vector is $(0.2,0.5,0.3)$." }
    ],
    applications: [
      { title: "Maps of Earth", background: "Cartography is the everyday model of chart thinking: local maps are useful even when one global map distorts.", numbers: "A $1$ km city block is tiny compared with Earth radius $6371$ km, so a flat chart is accurate locally." },
      { title: "Robot angles", background: "A joint angle lives on a circle because $0$ and $2\\pi$ describe the same pose.", numbers: "Angles $6.27$ and $0.01$ radians differ by about $0.023$ around the circle, not $6.26$." },
      { title: "Probability simplexes", background: "Categorical probabilities live on a simplex, where one coordinate is determined by the others.", numbers: "For four classes, $(0.1,0.2,0.3)$ gives $p_4=0.4$." },
      { title: "Pose estimation", background: "Rotations form a manifold, so pose algorithms use local coordinates for small updates.", numbers: "A 3-D rotation has $3$ local degrees of freedom, not $9$ free matrix entries." },
      { title: "Latent variables", background: "Generative models often learn a low-dimensional coordinate chart for high-dimensional data.", numbers: "A $64\\times64$ image has $4096$ pixels but may be controlled by a $128$-dimensional latent vector." },
      { title: "Manifold learning", background: "Methods such as Isomap and UMAP build local coordinate neighborhoods instead of forcing one flat global chart.", numbers: "Using $15$ nearest neighbors gives many small local patches for each data point." }
    ],
    applicationsClose: "Charts are the local coordinate language that lets curved spaces become calculable without pretending they are globally flat.",
    takeaways: ["A manifold locally resembles $\\mathbb{R}^n$.", "A chart assigns coordinates on a local patch.", "Smooth transition maps make calculus coordinate-consistent.", "Global coordinates can fail even when local charts work."]
  },

  "math-12-13": {
    id: "math-12-13",
    title: "Tangent spaces",
    tagline: "A tangent space is the linear home for all possible velocities through one point.",
    connections: { buildsOn: ["Manifolds and charts", "curves", "linear approximation"], leadsTo: ["Vector fields on manifolds", "Riemannian metrics", "Geodesics"], usedWith: ["directional derivatives", "constraints", "local coordinates"] },
    motivation: "<p>You already know the tangent line to a curve. It records the direction of motion at one instant, not the whole future path.</p><p>On a manifold there are many possible directions through a point. The <b>tangent space</b> gathers them into one vector space where derivatives and optimization steps can live.</p>",
    definition: "<p>For a smooth manifold $\\mathcal{M}$ and point $p$, the <b>tangent space</b> $T_p\\mathcal{M}$ is the set of velocities $\\gamma'(0)$ of smooth curves $\\gamma(t)$ in $\\mathcal{M}$ with $\\gamma(0)=p$. For a constraint $F(x)=0$, tangent vectors satisfy $DF_p(v)=0$.</p><p>For the unit sphere, $F(x,y,z)=x^2+y^2+z^2-1$. Differentiating gives $DF_p(v)=2p\\cdot v$, so $T_pS^2=\\{v:p\\cdot v=0\\}$. The tangent plane is perpendicular to the radius.</p><p><b>Assumptions that matter:</b> the curves are smooth; tangent vectors are attached to a base point; vectors from different tangent spaces cannot be added without extra structure; and constraint formulas describe first-order feasible motion.</p>",
    worked: { problem: "Find $T_pS^2$ at $p=(0,0,1)$ and test $v=(2,-1,0)$.", skills: ["constraints", "dot products", "tangent planes"], strategy: "Differentiate the sphere constraint, then check perpendicularity to the radius.", steps: [
      { do: "Write the tangent condition", result: "$p\\cdot v=0$", why: "differentiate $x^2+y^2+z^2=1$" },
      { do: "Use a general vector", result: "$(0,0,1)\\cdot(a,b,c)=c$", why: "substitute the north pole" },
      { do: "Set the derivative to zero", result: "$c=0$", why: "tangent motion stays on the sphere to first order" },
      { do: "State the tangent space", result: "$T_pS^2=\\{(a,b,0):a,b\\in\\mathbb{R}\\}$", why: "only horizontal velocities remain" },
      { do: "Test the vector", result: "$(0,0,1)\\cdot(2,-1,0)=0$", why: "it satisfies the tangent condition" }
    ], verify: "The vector has no radial component at the north pole, so it is tangent.", answer: "$T_pS^2=\\{(a,b,0)\\}$, and $v$ is tangent.", connects: "Tangent spaces linearize curved constraints at a point." },
    practice: [
      { problem: "Find the tangent line to the unit circle at $(1,0)$.", steps: [{ do: "Write the condition", result: "$p\\cdot v=0$", why: "circle tangents are perpendicular to the radius" },{ do: "Substitute $p$", result: "$(1,0)\\cdot(a,b)=a$", why: "use a general vector" },{ do: "Set to zero", result: "$a=0$", why: "stay on the circle to first order" },{ do: "Describe tangent vectors", result: "$(0,b)$", why: "only vertical motion remains" },{ do: "State the line", result: "$x=1$", why: "the line through $(1,0)$ is vertical" }], answer: "The tangent line is $x=1$." },
      { problem: "For the plane $x+y+z=3$, find tangent vectors.", steps: [{ do: "Define the constraint", result: "$F=x+y+z-3$", why: "the plane is $F=0$" },{ do: "Differentiate", result: "$DF(v)=v_1+v_2+v_3$", why: "each coordinate has derivative one" },{ do: "Set to zero", result: "$v_1+v_2+v_3=0$", why: "the constraint remains fixed" },{ do: "Give an example", result: "$(1,-1,0)$", why: "the components sum to zero" },{ do: "Describe the space", result: "$\\{v:v_1+v_2+v_3=0\\}$", why: "all such velocities are tangent" }], answer: "All tangent vectors satisfy $v_1+v_2+v_3=0$." },
      { problem: "For $z=x^2+y^2$ at $(1,2,5)$, find two tangent vectors.", steps: [{ do: "Parametrize", result: "$r(x,y)=(x,y,x^2+y^2)$", why: "use chart coordinates" },{ do: "Differentiate in $x$", result: "$r_x=(1,0,2x)$", why: "hold $y$ fixed" },{ do: "Evaluate", result: "$r_x=(1,0,2)$", why: "use $x=1$" },{ do: "Differentiate in $y$", result: "$r_y=(0,1,2y)$", why: "hold $x$ fixed" },{ do: "Evaluate", result: "$r_y=(0,1,4)$", why: "use $y=2$" }], answer: "Two tangent vectors are $(1,0,2)$ and $(0,1,4)$." },
      { problem: "On the simplex $p_1+p_2+p_3=1$, test $v=(0.1,-0.3,0.2)$.", steps: [{ do: "Differentiate the sum", result: "$v_1+v_2+v_3=0$", why: "total probability must stay one" },{ do: "Add components", result: "$0.1-0.3+0.2$", why: "test the vector" },{ do: "Simplify", result: "$0$", why: "positive and negative changes balance" },{ do: "Check the condition", result: "satisfied", why: "the derivative of the constraint is zero" },{ do: "Conclude", result: "tangent", why: "it is a feasible first-order probability motion" }], answer: "The vector is tangent to the simplex." },
      { problem: "For $\\gamma(t)=(\\cos t,\\sin t,0)$ on $S^2$, find $\\gamma'(0)$ and verify tangency.", steps: [{ do: "Evaluate the point", result: "$\\gamma(0)=(1,0,0)$", why: "substitute $t=0$" },{ do: "Differentiate", result: "$\\gamma'(t)=(-\\sin t,\\cos t,0)$", why: "differentiate componentwise" },{ do: "Evaluate velocity", result: "$\\gamma'(0)=(0,1,0)$", why: "substitute $t=0$" },{ do: "Dot with the point", result: "$(1,0,0)\\cdot(0,1,0)=0$", why: "sphere tangents are perpendicular to radius" },{ do: "Conclude", result: "tangent", why: "the dot product is zero" }], answer: "The velocity is $(0,1,0)$, and it is tangent." }
    ],
    applications: [
      { title: "Constrained optimization", background: "Feasible directions for constrained training live in tangent spaces.", numbers: "On a simplex, step $(0.02,-0.01,-0.01)$ sums to $0$, so it preserves total probability to first order." },
      { title: "Robot velocities", background: "A robot configuration is a point; its instantaneous joint rates are tangent vectors.", numbers: "Velocity $(0.1,-0.2)$ rad/s for $0.05$ s changes angles by $(0.005,-0.010)$." },
      { title: "Graphics normals", background: "Surface shading uses tangent vectors and normals to compute light response.", numbers: "For $z=x^2$ at $x=1$, tangent $(1,0,2)$ is perpendicular to normal $(-2,0,1)$." },
      { title: "Manifold learning", background: "Local PCA estimates tangent spaces from nearby data.", numbers: "Singular values $5,2,0.1$ suggest a two-dimensional local tangent." },
      { title: "Probability models", background: "Probability vectors must keep total mass one, so tangent directions sum to zero.", numbers: "Increasing one class by $0.03$ requires other classes to decrease by $0.03$ total." },
      { title: "Physics constraints", background: "A particle constrained to a sphere can move only tangentially.", numbers: "At $(0,0,2)$, velocity $(1,1,0)$ is allowed because the dot product is $0$." }
    ],
    applicationsClose: "Tangent spaces are the linear workbenches for motion, derivatives, and feasible updates on curved spaces.",
    takeaways: ["Tangent vectors are velocities of curves through a point.", "For $F=0$, tangent vectors satisfy $DF_p(v)=0$.", "Tangent spaces depend on the base point.", "Optimization on constraints uses tangent directions."]
  },

  "math-12-14": {
    id: "math-12-14",
    title: "Vector fields on manifolds",
    tagline: "A vector field assigns a tangent arrow to every point of a manifold.",
    connections: { buildsOn: ["Tangent spaces", "functions", "differential equations"], leadsTo: ["Riemannian metrics", "Geodesics", "Connections and parallel transport"], usedWith: ["flows", "gradients", "directional derivatives"] },
    motivation: "<p>A wind map is a familiar vector field: every location gets an arrow. On a manifold, the arrow must lie in the tangent space at that location.</p><p>That small rule is powerful. It turns geometry into motion, from rotations on spheres to gradient flows in learning.</p>",
    definition: "<p>A <b>vector field</b> $X$ on $\\mathcal{M}$ assigns each point $p$ a tangent vector $X(p)\\in T_p\\mathcal{M}$. In coordinates, $$X=\\sum_i X^i(x)\\dfrac{\\partial}{\\partial x^i},$$ where $X^i$ are component functions.</p><p>A vector field generates flow curves by $\\gamma'(t)=X(\\gamma(t))$. For an embedded sphere, tangency is checked by $p\\cdot X(p)=0$ at each point.</p><p><b>Assumptions that matter:</b> every arrow must be tangent at its own base point; smooth fields have well-behaved local flows; and coordinate components change with charts even when the geometric field is the same.</p>",
    worked: { problem: "On the unit sphere, let $X(x,y,z)=(-y,x,0)$. Show it is tangent at $p=(3/5,4/5,0)$ and find its speed.", skills: ["vector fields", "dot products", "norms"], strategy: "Evaluate the field, check $p\\cdot X(p)=0$, then compute length.", steps: [
      { do: "Evaluate the field", result: "$X(p)=(-4/5,3/5,0)$", why: "substitute the point" },
      { do: "Compute the dot product", result: "$(3/5)(-4/5)+(4/5)(3/5)+0$", why: "sphere tangency requires perpendicularity" },
      { do: "Simplify", result: "$-12/25+12/25=0$", why: "the radial component cancels" },
      { do: "Compute squared speed", result: "$\\|X(p)\\|^2=(4/5)^2+(3/5)^2=1$", why: "add squared components" },
      { do: "Take the square root", result: "$\\|X(p)\\|=1$", why: "speed is nonnegative" }
    ], verify: "The vector is perpendicular to the radius and has unit length.", answer: "The field is tangent at $p$, and its speed is $1$.", connects: "A manifold vector field is a smooth assignment of tangent arrows." },
    practice: [
      { problem: "On the line, $X(x)=2x\\,\\partial/\\partial x$. Find $X(3)$.", steps: [{ do: "Read the coefficient", result: "$2x$", why: "there is one component" },{ do: "Substitute $x=3$", result: "$2\\cdot3=6$", why: "evaluate the field" },{ do: "Attach the basis", result: "$6\\,\\partial/\\partial x$", why: "write the tangent arrow" },{ do: "Interpret the flow", result: "$\\gamma'=6$ at $x=3$", why: "flows follow the field" },{ do: "State direction", result: "positive", why: "the point moves right" }], answer: "$X(3)=6\\,\\partial/\\partial x$." },
      { problem: "On the unit circle, show $X(x,y)=(-y,x)$ is tangent at $(0,1)$.", steps: [{ do: "Evaluate", result: "$X(0,1)=(-1,0)$", why: "substitute the point" },{ do: "Use the condition", result: "$p\\cdot X(p)=0$", why: "circle tangent vectors are perpendicular to radius" },{ do: "Compute", result: "$(0,1)\\cdot(-1,0)=0$", why: "multiply and add" },{ do: "Conclude", result: "tangent", why: "the condition holds" },{ do: "Interpret", result: "rotation", why: "the field turns around the circle" }], answer: "$(-1,0)$ is tangent at $(0,1)$." },
      { problem: "For $X(x,y)=(y,-x)$, compute $X(2,1)$ and speed.", steps: [{ do: "Substitute", result: "$X(2,1)=(1,-2)$", why: "replace $x,y$" },{ do: "Square components", result: "$1^2+(-2)^2$", why: "speed uses length" },{ do: "Add", result: "$5$", why: "squared speed" },{ do: "Take square root", result: "$\\sqrt5$", why: "speed is nonnegative" },{ do: "State value", result: "$(1,-2)$", why: "field value and speed are separate" }], answer: "$X(2,1)=(1,-2)$ with speed $\\sqrt5$." },
      { problem: "For $f=x^2+3y$, find $\\nabla f(1,2)$ and its directional change along $(0,1)$.", steps: [{ do: "Compute $f_x$", result: "$2x$", why: "differentiate in $x$" },{ do: "Compute $f_y$", result: "$3$", why: "differentiate in $y$" },{ do: "Evaluate", result: "$\\nabla f(1,2)=(2,3)$", why: "substitute the point" },{ do: "Dot with direction", result: "$(2,3)\\cdot(0,1)=3$", why: "directional derivative" },{ do: "Interpret", result: "rate $3$", why: "moving upward increases $f$" }], answer: "The gradient is $(2,3)$ and the directional rate is $3$." },
      { problem: "On the simplex, $X(p)=(p_1(1-p_1),-p_1p_2,-p_1p_3)$. Verify tangency at $(0.2,0.3,0.5)$.", steps: [{ do: "Compute first component", result: "$0.2(0.8)=0.16$", why: "substitute $p_1$" },{ do: "Compute second", result: "$-0.2\\cdot0.3=-0.06$", why: "use $p_2$" },{ do: "Compute third", result: "$-0.2\\cdot0.5=-0.10$", why: "use $p_3$" },{ do: "Add components", result: "$0.16-0.06-0.10=0$", why: "simplex tangents sum to zero" },{ do: "Conclude", result: "tangent", why: "total mass is preserved to first order" }], answer: "$X(p)=(0.16,-0.06,-0.10)$ is tangent." }
    ],
    applications: [
      { title: "Fluid velocity", background: "Fluids are modeled by velocity fields, one arrow per location.", numbers: "Velocity $(0.4,0.3)$ m/s has speed $0.5$ m/s." },
      { title: "Gradient descent", background: "Negative gradients form the vector field followed by training.", numbers: "For $L(w)=w^2$, $X=-2w$ gives $X(3)=-6$; step $0.1$ moves to $2.4$." },
      { title: "Circular motion", background: "The field $(-y,x)$ generates rotation on the circle.", numbers: "At $(\\sqrt3/2,1/2)$ the speed is $1$." },
      { title: "Probability dynamics", background: "Learning rules on distributions use tangent fields on the simplex.", numbers: "Direction $(0.04,-0.01,-0.03)$ sums to $0$." },
      { title: "Neural ODEs", background: "Neural ODEs learn vector fields and integrate their flows.", numbers: "If $x'=0.5x$ and $x=2$, an Euler step $0.2$ gives $2.2$." },
      { title: "Surface navigation", background: "Robots on terrain project commands onto tangent planes.", numbers: "Command $(1,0,1)$ with normal $(0,0,1)$ projects to $(1,0,0)$." }
    ],
    applicationsClose: "Vector fields are motion made local: each tangent arrow says how the state wants to move right now.",
    takeaways: ["A vector field assigns $X(p)\\in T_p\\mathcal{M}$.", "Flows solve $\\gamma'=X(\\gamma)$.", "Tangency must be checked on constrained manifolds.", "Gradients and velocities are vector fields in context."]
  },

  "math-12-15": {
    id: "math-12-15", title: "Riemannian metrics", tagline: "A Riemannian metric tells tangent vectors how long they are and what angle they make.",
    connections: { buildsOn: ["Tangent spaces", "inner products", "positive definite matrices"], leadsTo: ["Geodesics", "The exponential map", "The Fisher information metric"], usedWith: ["norms", "gradients", "local distance"] },
    motivation: "<p>You already measure ordinary vectors with dot products. On a curved manifold, each point has its own tangent space, and the right measurement can change from place to place.</p><p>A <b>Riemannian metric</b> supplies that measurement, turning a bare smooth space into a geometric space with length, angle, gradients, and distance.</p>",
    definition: "<p>A <b>Riemannian metric</b> assigns each point $p\\in\\mathcal{M}$ an inner product $g_p$ on $T_p\\mathcal{M}$. In coordinates, $g_p(u,v)=u^TG(p)v$, where $G(p)$ is symmetric positive definite. Length is $\\|v\\|_g=\\sqrt{g_p(v,v)}$.</p><p>Positive definiteness makes every nonzero tangent vector have positive length. Smooth dependence on $p$ lets curve length be integrated as $\\int\\sqrt{g_{\\gamma(t)}(\\gamma'(t),\\gamma'(t))}\\,dt$.</p><p><b>Assumptions that matter:</b> vectors compared by $g_p$ live in the same tangent space; $G$ must be symmetric positive definite; and coordinates may change while geometric lengths remain the same.</p>",
    worked: { problem: "For $G=\\begin{pmatrix}4&0\\\\0&1\\end{pmatrix}$, find $\\|(1,2)\\|_g$ and $g((1,2),(3,0))$.", skills: ["metric matrices", "inner products", "norms"], strategy: "Use $g(u,v)=u^TGv$ and take a square root for length.", steps: [
      { do: "Multiply $Gv$ for $v=(1,2)$", result: "$(4,2)$", why: "apply the metric matrix" },{ do: "Compute $g(v,v)$", result: "$(1,2)\\cdot(4,2)=8$", why: "metric length squared" },{ do: "Take the square root", result: "$\\|v\\|_g=\\sqrt8=2\\sqrt2$", why: "length is nonnegative" },{ do: "Multiply $Gw$ for $w=(3,0)$", result: "$(12,0)$", why: "prepare the cross inner product" },{ do: "Compute $g(v,w)$", result: "$(1,2)\\cdot(12,0)=12$", why: "use the metric inner product" }
    ], verify: "The first coordinate is weighted more heavily, so the metric length exceeds the Euclidean length $\\sqrt5$.", answer: "$\\|v\\|_g=2\\sqrt2$ and $g(v,w)=12$.", connects: "A metric is a measurement rule on tangent spaces." },
    practice: [
      { problem: "For $G=\\operatorname{diag}(2,3)$, find $\\|(1,1)\\|_g$.", steps: [{ do: "Multiply", result: "$G(1,1)=(2,3)$", why: "apply the metric" },{ do: "Dot", result: "$(1,1)\\cdot(2,3)=5$", why: "length squared" },{ do: "Take square root", result: "$\\sqrt5$", why: "length is nonnegative" },{ do: "Compare", result: "$\\sqrt5>\\sqrt2$", why: "weights increase length" },{ do: "State", result: "$\\|(1,1)\\|_g=\\sqrt5$", why: "final metric length" }], answer: "$\\sqrt5$." },
      { problem: "In polar metric $ds^2=dr^2+r^2d\\theta^2$, find the length of $(0,0.5)$ at $r=2$.", steps: [{ do: "Write squared length", result: "$0^2+2^2(0.5)^2$", why: "use the polar metric" },{ do: "Square", result: "$4\\cdot0.25$", why: "compute the angular part" },{ do: "Multiply", result: "$1$", why: "squared length" },{ do: "Take square root", result: "$1$", why: "length" },{ do: "Interpret", result: "unit arc speed", why: "radius doubles angular motion" }], answer: "The length is $1$." },
      { problem: "On the unit sphere metric $ds^2=d\\phi^2+\\sin^2\\phi d\\theta^2$, find the length of $(0,0.2)$ at $\\phi=\\pi/2$.", steps: [{ do: "Evaluate sine", result: "$\\sin(\\pi/2)=1$", why: "equator" },{ do: "Write squared length", result: "$0^2+1^2(0.2)^2$", why: "use the metric" },{ do: "Square", result: "$0.04$", why: "compute" },{ do: "Take square root", result: "$0.2$", why: "length" },{ do: "Interpret", result: "angle equals arc length", why: "unit equator" }], answer: "The length is $0.2$." },
      { problem: "For $G=\\operatorname{diag}(1,9)$, find the metric cosine between $u=(1,0)$ and $v=(1,1)$.", steps: [{ do: "Compute $g(u,v)$", result: "$1$", why: "$Gv=(1,9)$" },{ do: "Compute $\\|u\\|_g$", result: "$1$", why: "first basis vector has weight one" },{ do: "Compute $\\|v\\|_g^2$", result: "$10$", why: "$1+9=10$" },{ do: "Take root", result: "$\\|v\\|_g=\\sqrt{10}$", why: "length" },{ do: "Divide", result: "$\\cos\\alpha=1/\\sqrt{10}$", why: "inner product over lengths" }], answer: "$1/\\sqrt{10}$." },
      { problem: "Metric $G=\\operatorname{diag}(100,1)$. Compare lengths of $(0.1,0)$ and $(0,0.1)$.", steps: [{ do: "First squared length", result: "$100(0.1)^2=1$", why: "first coordinate is expensive" },{ do: "First length", result: "$1$", why: "square root" },{ do: "Second squared length", result: "$(0.1)^2=0.01$", why: "second coordinate weight is one" },{ do: "Second length", result: "$0.1$", why: "square root" },{ do: "Compare", result: "first is $10$ times longer", why: "$1/0.1=10$" }], answer: "Lengths are $1$ and $0.1$." }
    ],
    applications: [
      { title: "Feature scaling", background: "Metrics formalize that some feature directions count more than others.", numbers: "With weights $1/4$ and $1$, step $(2,1)$ has squared length $1+1=2$." },
      { title: "Robot costs", background: "Heavy joints can be penalized more strongly by a metric.", numbers: "$G=\\operatorname{diag}(5,1)$ makes velocity $(1,1)$ have squared cost $6$." },
      { title: "Graphics parametrization", background: "Surface coordinates need metrics to recover real lengths.", numbers: "At polar radius $10$, angle $0.01$ has length $0.1$." },
      { title: "Natural gradients", background: "Information geometry measures parameter steps by distributional change.", numbers: "If $G=25$, raw step $0.02$ has metric length $0.1$." },
      { title: "Image diffusion", background: "Anisotropic metrics smooth along edges more than across them.", numbers: "Weights $100$ across and $1$ along make equal steps $10$ times longer across." },
      { title: "Embedding distance", background: "Mahalanobis metrics give task-specific similarity in learned spaces.", numbers: "With $G=\\operatorname{diag}(4,1)$, difference $(1,2)$ has squared distance $8$." }
    ],
    applicationsClose: "A metric is local measurement made precise; once you can measure, you can define distance, gradients, and geodesics.",
    takeaways: ["A Riemannian metric is an inner product on each tangent space.", "Coordinate matrices must be symmetric positive definite.", "Lengths and angles depend on the metric.", "Metrics prepare the ground for geodesics and natural gradients."]
  },

  "math-12-16": {
    id: "math-12-16", title: "Geodesics", tagline: "Geodesics are the straightest paths a curved space allows.",
    connections: { buildsOn: ["Riemannian metrics", "curve length", "tangent vectors"], leadsTo: ["The exponential map", "Connections and parallel transport", "The Fisher information metric"], usedWith: ["shortest paths", "energy", "Christoffel symbols"] },
    motivation: "<p>You know the shortest path in the plane is a straight line. On a sphere or statistical manifold, the path must stay inside the space.</p><p>A <b>geodesic</b> is the geometry-aware straight line: it does not turn according to the manifold connection, and locally it minimizes length.</p>",
    definition: "<p>A curve $\\gamma(t)$ is a <b>geodesic</b> when $\\nabla_{\\gamma'}\\gamma'=0$. In coordinates this is $\\ddot{x}^k+\\Gamma^k_{ij}\\dot{x}^i\\dot{x}^j=0$, where $\\Gamma^k_{ij}$ are Christoffel symbols from the metric.</p><p>In Euclidean space the Christoffel symbols vanish, so geodesics satisfy $\\ddot{x}=0$ and are lines. On a sphere, geodesics are great circles.</p><p><b>Assumptions that matter:</b> geodesics depend on the metric; constant-speed parametrization is usually intended; local shortest does not always mean globally unique; and several geodesics can connect the same two points.</p>",
    worked: { problem: "On a sphere of radius $2$, find the shorter geodesic distance for central angle $\\pi/3$.", skills: ["sphere geometry", "arc length", "distance"], strategy: "Sphere geodesics are great-circle arcs, and arc length is $R\\theta$.", steps: [{ do: "Identify radius", result: "$R=2$", why: "given sphere size" },{ do: "Identify angle", result: "$\\theta=\\pi/3$", why: "given central angle" },{ do: "Use arc length", result: "$s=R\\theta$", why: "great-circle formula" },{ do: "Substitute", result: "$s=2\\pi/3$", why: "multiply radius and angle" },{ do: "Approximate", result: "$s\\approx2.094$", why: "decimal value" }], verify: "The shorter arc is less than half a great circle, so the distance is plausible.", answer: "$2\\pi/3\\approx2.094$.", connects: "Geodesics generalize straight-line distance to curved spaces." },
    practice: [
      { problem: "In the plane, solve the geodesic with point $(1,2)$ and velocity $(3,-1)$.", steps: [{ do: "Use $\\ddot{x}=0$", result: "$\\dot{x}=3$", why: "initial velocity" },{ do: "Integrate", result: "$x=1+3t$", why: "initial position" },{ do: "Use $\\ddot{y}=0$", result: "$\\dot{y}=-1$", why: "second velocity" },{ do: "Integrate", result: "$y=2-t$", why: "initial position" },{ do: "Combine", result: "$\\gamma(t)=(1+3t,2-t)$", why: "write the line" }], answer: "$\\gamma(t)=(1+3t,2-t)$." },
      { problem: "On the unit sphere, central angle $\\pi/2$. Find distance.", steps: [{ do: "Set radius", result: "$R=1$", why: "unit sphere" },{ do: "Set angle", result: "$\\theta=\\pi/2$", why: "given" },{ do: "Use formula", result: "$s=R\\theta$", why: "great-circle length" },{ do: "Substitute", result: "$s=\\pi/2$", why: "unit radius" },{ do: "State", result: "$\\pi/2$", why: "exact distance" }], answer: "$\\pi/2$." },
      { problem: "A radius-$1$ cylinder unrolls. Height difference $3$, angle difference $\\pi$. Find unwrapped distance.", steps: [{ do: "Convert angle", result: "$1\\cdot\\pi=\\pi$", why: "arc displacement" },{ do: "Form plane displacement", result: "$(\\pi,3)$", why: "unroll the cylinder" },{ do: "Use distance", result: "$\\sqrt{\\pi^2+9}$", why: "straight line on the unwrapped plane" },{ do: "Approximate inside", result: "$9.870+9=18.870$", why: "use $\\pi^2\\approx9.870$" },{ do: "Take root", result: "$4.344$", why: "decimal distance" }], answer: "$\\sqrt{\\pi^2+9}\\approx4.344$." },
      { problem: "In hyperbolic metric $ds^2=(dx^2+dy^2)/y^2$, find vertical length from $y=1$ to $4$.", steps: [{ do: "Set $dx=0$", result: "$ds=dy/y$", why: "vertical path" },{ do: "Set integral", result: "$\\int_1^4 dy/y$", why: "length integral" },{ do: "Antidifferentiate", result: "$\\ln y\\big|_1^4$", why: "integral of $1/y$" },{ do: "Evaluate", result: "$\\ln4-\\ln1$", why: "endpoints" },{ do: "Simplify", result: "$\\ln4\\approx1.386$", why: "$\\ln1=0$" }], answer: "$\\ln4\\approx1.386$." },
      { problem: "On the unit circle, angles $0.2$ and $0.8$. Find geodesic distance.", steps: [{ do: "Subtract angles", result: "$0.8-0.2=0.6$", why: "same coordinate chart" },{ do: "Check shorter arc", result: "$0.6<\\pi$", why: "no wraparound is shorter" },{ do: "Use unit arc length", result: "$s=1\\cdot0.6$", why: "radius one" },{ do: "Simplify", result: "$0.6$", why: "radians equal unit-circle length" },{ do: "Interpret", result: "manifold distance", why: "distance is along the circle" }], answer: "The distance is $0.6$." }
    ],
    applications: [
      { title: "Air routes", background: "Flights follow great circles on Earth because those are spherical geodesics.", numbers: "Earth radius $6371$ km and angle $0.5$ gives $3185.5$ km." },
      { title: "Robot angles", background: "Joint interpolation should use circular geodesics instead of raw angle subtraction.", numbers: "$350^\\circ$ to $10^\\circ$ is $20^\\circ$, not $340^\\circ$." },
      { title: "Shape interpolation", background: "Geodesic morphs stay inside valid shape spaces.", numbers: "A midpoint along distance $0.3$ is $0.15$ from each endpoint." },
      { title: "Hyperbolic embeddings", background: "Tree-like data use hyperbolic geodesic distances.", numbers: "Vertical half-plane levels $1$ and $8$ are distance $\\ln8\\approx2.079$." },
      { title: "Optimization paths", background: "Riemannian methods move along geometry-aware paths.", numbers: "A geodesic step of norm $0.1$ travels local distance $0.1$." },
      { title: "Diffusion kernels", background: "Kernels on manifolds often use geodesic distance.", numbers: "$e^{-0.5^2}=0.779$, while $e^{-2^2}=0.018$." }
    ],
    applicationsClose: "Geodesics are straight lines in the language of the space itself.",
    takeaways: ["Geodesics satisfy $\\nabla_{\\gamma'}\\gamma'=0$.", "Euclidean geodesics are lines.", "Sphere geodesics are great circles.", "Geodesics are locally shortest but may not be globally unique."]
  },

  "math-12-17": {
    id: "math-12-17", title: "The exponential map", tagline: "The exponential map follows a tangent vector along a geodesic to land back on the manifold.",
    connections: { buildsOn: ["Geodesics", "Tangent spaces", "Riemannian metrics"], leadsTo: ["Connections and parallel transport", "The Fisher information metric", "Geometric deep learning"], usedWith: ["normal coordinates", "retractions", "local parametrization"] },
    motivation: "<p>In flat space, you can add a vector to a point. On a manifold, that sum may leave the space.</p><p>The <b>exponential map</b> gives the curved-space replacement: start at $p$, use $v$ as initial velocity, follow the geodesic for time $1$, and arrive at $\\exp_p(v)$.</p>",
    definition: "<p>For $v\\in T_p\\mathcal{M}$, define $\\exp_p(v)=\\gamma_v(1)$, where $\\gamma_v(0)=p$ and $\\gamma_v'(0)=v$ is the geodesic with that initial velocity. In Euclidean space, $\\exp_p(v)=p+v$.</p><p>On the unit sphere, for $v\\ne0$, $$\\exp_p(v)=\\cos(\\|v\\|)p+\\sin(\\|v\\|)\\dfrac{v}{\\|v\\|}.$$ The norm of $v$ is the geodesic travel distance.</p><p><b>Assumptions that matter:</b> $v$ must be tangent at $p$; the map is best behaved locally before cut points; and numerical methods often use retractions as cheaper approximations.</p>",
    worked: { problem: "On the unit sphere at $p=(0,0,1)$, compute $\\exp_p(v)$ for $v=(\\pi/6,0,0)$.", skills: ["sphere exponential", "norms", "trigonometry"], strategy: "Use the sphere formula: vector length is the travel angle.", steps: [{ do: "Compute the norm", result: "$\\|v\\|=\\pi/6$", why: "only one component is nonzero" },{ do: "Normalize direction", result: "$v/\\|v\\|=(1,0,0)$", why: "divide by $\\pi/6$" },{ do: "Apply the formula", result: "$\\cos(\\pi/6)p+\\sin(\\pi/6)(1,0,0)$", why: "substitute length and direction" },{ do: "Use trig values", result: "$\\cos(\\pi/6)=\\sqrt3/2$, $\\sin(\\pi/6)=1/2$", why: "standard values" },{ do: "Combine", result: "$(1/2,0,\\sqrt3/2)$", why: "add the vector parts" }], verify: "The endpoint has squared norm $1/4+3/4=1$, so it lies on the sphere.", answer: "$\\exp_p(v)=(1/2,0,\\sqrt3/2)$.", connects: "The exponential map turns a tangent instruction into a manifold point." },
    practice: [
      { problem: "In Euclidean space, compute $\\exp_{(1,2)}(3,-4)$.", steps: [{ do: "Recall Euclidean rule", result: "$\\exp_p(v)=p+v$", why: "geodesics are lines" },{ do: "Add first coordinate", result: "$1+3=4$", why: "componentwise addition" },{ do: "Add second coordinate", result: "$2-4=-2$", why: "componentwise addition" },{ do: "Write endpoint", result: "$(4,-2)$", why: "combine components" },{ do: "Check", result: "straight-line endpoint", why: "flat case" }], answer: "$(4,-2)$." },
      { problem: "On the unit circle at $(1,0)$ with $v=(0,0.3)$, approximate $\\exp_p(v)$.", steps: [{ do: "Compute norm", result: "$0.3$", why: "tangent speed" },{ do: "Unit direction", result: "$(0,1)$", why: "normalize" },{ do: "Use formula", result: "$(\\cos0.3,\\sin0.3)$", why: "circle geodesic" },{ do: "Approximate", result: "$(0.955,0.296)$", why: "calculator values" },{ do: "State", result: "point on the circle", why: "approximately unit length" }], answer: "Approximately $(0.955,0.296)$." },
      { problem: "At the north pole, compute $\\exp_p(0,\\pi/4,0)$ on the unit sphere.", steps: [{ do: "Find norm", result: "$\\pi/4$", why: "travel angle" },{ do: "Normalize", result: "$(0,1,0)$", why: "direction" },{ do: "Apply formula", result: "$\\cos(\\pi/4)p+\\sin(\\pi/4)(0,1,0)$", why: "sphere exponential" },{ do: "Use values", result: "$\\sqrt2/2$ and $\\sqrt2/2$", why: "standard trig" },{ do: "Combine", result: "$(0,\\sqrt2/2,\\sqrt2/2)$", why: "endpoint" }], answer: "$(0,\\sqrt2/2,\\sqrt2/2)$." },
      { problem: "Retraction $R_p(v)=(p+v)/\\|p+v\\|$ on the sphere. Use $p=(0,0,1)$, $v=(0.1,0,0)$.", steps: [{ do: "Add", result: "$(0.1,0,1)$", why: "ambient trial point" },{ do: "Norm", result: "$\\sqrt{1.01}\\approx1.005$", why: "sum squares" },{ do: "Divide first", result: "$0.1/1.005\\approx0.0995$", why: "normalize" },{ do: "Divide third", result: "$1/1.005\\approx0.9950$", why: "normalize" },{ do: "Write result", result: "$(0.0995,0,0.9950)$", why: "retracted point" }], answer: "Approximately $(0.0995,0,0.9950)$." },
      { problem: "If $\\|v\\|=0.05$, what is the local distance from $p$ to $\\exp_p(v)$?", steps: [{ do: "Use geodesic speed", result: "$\\|\\gamma'\\|=\\|v\\|$", why: "initial speed stays constant" },{ do: "Set time", result: "$1$", why: "exponential evaluates at time one" },{ do: "Multiply", result: "$0.05\\cdot1=0.05$", why: "distance equals speed times time locally" },{ do: "Add condition", result: "before cut points", why: "local minimizing is assumed" },{ do: "State distance", result: "$0.05$", why: "local geodesic length" }], answer: "The local distance is $0.05$." }
    ],
    applications: [
      { title: "Normal coordinates", background: "Exponential maps create coordinates centered at a point where radial lines are geodesics.", numbers: "A tangent vector of norm $0.2$ lands about distance $0.2$ away." },
      { title: "Riemannian optimization", background: "Manifold optimizers use exponential maps or retractions to stay feasible.", numbers: "A sphere step $(0.1,0,0)$ from north retracts to about $(0.0995,0,0.9950)$." },
      { title: "Rotation updates", background: "Rigid-body rotations are updated by exponentiating angular velocities.", numbers: "Norm $0.01$ radians is about $0.57^\\circ$." },
      { title: "Shape shooting", background: "Geodesic shooting predicts an initial velocity that reaches a target shape.", numbers: "A target distance $3$ needs a unit-time velocity of norm about $3$." },
      { title: "Hyperbolic learning", background: "Hyperbolic embeddings use exponential maps to keep points in curved space.", numbers: "A tangent step of norm $0.1$ changes local distance by about $0.1$." },
      { title: "Data augmentation", background: "Small tangent perturbations can create valid nearby manifold data.", numbers: "A sphere perturbation of norm $0.05$ is about $2.86^\\circ$." }
    ],
    applicationsClose: "The exponential map is the curved equivalent of point plus vector, local but deeply useful.",
    takeaways: ["$\\exp_p(v)=\\gamma_v(1)$.", "In flat space it is $p+v$.", "On spheres it follows great circles.", "Retractions are practical approximations."]
  },

  "math-12-18": {
    id: "math-12-18", title: "Connections and parallel transport", tagline: "A connection tells curved spaces how to differentiate and move tangent vectors.",
    connections: { buildsOn: ["Vector fields on manifolds", "Riemannian metrics", "Geodesics"], leadsTo: ["The Fisher information metric", "Geometric deep learning", "curvature tensors"], usedWith: ["covariant derivatives", "Christoffel symbols", "parallel fields"] },
    motivation: "<p>In the plane, you can slide an arrow around without changing it. On a sphere, tangent planes tilt, so comparing arrows at different points needs a rule.</p><p>A <b>connection</b> supplies that rule. It lets us differentiate vector fields, define geodesics, and transport momentum or directions along curves.</p>",
    definition: "<p>A <b>connection</b> $\\nabla$ takes vector fields $X,Y$ and forms $\\nabla_XY$, the derivative of $Y$ in direction $X$ corrected to remain tangent. For a Riemannian metric, the Levi-Civita connection preserves the metric and has no torsion.</p><p>In coordinates, $\\nabla_{\\partial_i}\\partial_j=\\Gamma^k_{ij}\\partial_k$. A vector field $V$ along $\\gamma$ is <b>parallel</b> if $\\nabla_{\\gamma'}V=0$. A geodesic is the case $V=\\gamma'$.</p><p><b>Assumptions that matter:</b> the connection must be specified; Levi-Civita depends on the metric; Christoffel symbols are coordinate-dependent; and parallel transport can depend on path.</p>",
    worked: { problem: "In polar coordinates, $\\nabla_{\\partial_\\theta}\\partial_\\theta=-r\\partial_r$. For $r=2$, $\\theta=t$, compute $\\nabla_{\\gamma'}\\gamma'$.", skills: ["connections", "polar coordinates", "geodesic acceleration"], strategy: "The velocity is $\\partial_\\theta$, so substitute into the given connection formula.", steps: [{ do: "Write velocity", result: "$\\gamma'=\\partial_\\theta$", why: "only angle changes" },{ do: "Set up acceleration", result: "$\\nabla_{\\gamma'}\\gamma'=\\nabla_{\\partial_\\theta}\\partial_\\theta$", why: "differentiate velocity along itself" },{ do: "Use the formula", result: "$-r\\partial_r$", why: "given connection" },{ do: "Substitute $r=2$", result: "$-2\\partial_r$", why: "circle radius" },{ do: "Interpret", result: "inward acceleration", why: "constant-radius circles turn inward" }], verify: "The acceleration is nonzero, so this circle is not a Euclidean geodesic.", answer: "$\\nabla_{\\gamma'}\\gamma'=-2\\partial_r$.", connects: "Connections measure turning in a way that respects the manifold." },
    practice: [
      { problem: "In Cartesian Euclidean coordinates, compute $\\nabla_{\\gamma'}\\gamma'$ for $\\gamma(t)=(1+2t,3-t)$.", steps: [{ do: "Differentiate", result: "$\\gamma'=(2,-1)$", why: "velocity" },{ do: "Differentiate again", result: "$\\gamma''=(0,0)$", why: "constant velocity" },{ do: "Use zero Christoffels", result: "$\\nabla_{\\gamma'}\\gamma'=\\gamma''$", why: "Cartesian flat coordinates" },{ do: "Substitute", result: "$(0,0)$", why: "ordinary acceleration" },{ do: "Conclude", result: "geodesic", why: "zero covariant acceleration" }], answer: "The covariant acceleration is $(0,0)$." },
      { problem: "Use $\\nabla_{\\partial_r}\\partial_r=0$ to show a polar radial line is geodesic.", steps: [{ do: "Write velocity", result: "$\\partial_r$", why: "only radius changes" },{ do: "Set acceleration", result: "$\\nabla_{\\partial_r}\\partial_r$", why: "differentiate velocity" },{ do: "Use formula", result: "$0$", why: "given" },{ do: "Apply geodesic test", result: "zero", why: "no covariant turning" },{ do: "Conclude", result: "geodesic", why: "satisfies the equation" }], answer: "The radial line is geodesic." },
      { problem: "Transport $(0,0,1)$ along the unit-sphere equator from $(1,0,0)$ to $(0,1,0)$. What remains?", steps: [{ do: "Check start tangency", result: "$(1,0,0)\\cdot(0,0,1)=0$", why: "sphere tangent condition" },{ do: "Use equator point", result: "$(\\cos t,\\sin t,0)$", why: "parametrize path" },{ do: "Check all tangency", result: "$(\\cos t,\\sin t,0)\\cdot(0,0,1)=0$", why: "north vector stays tangent" },{ do: "Observe ambient derivative", result: "$0$", why: "the vector is constant" },{ do: "State result", result: "$(0,0,1)$", why: "it remains parallel" }], answer: "The transported vector is $(0,0,1)$." },
      { problem: "If $\\nabla_{\\partial_x}\\partial_y=0$, compute $\\nabla_XY$ for $X=3\\partial_x$, $Y=2\\partial_y$ with constant coefficients.", steps: [{ do: "Pull out $3$", result: "$3\\nabla_{\\partial_x}Y$", why: "linear in direction" },{ do: "Pull out $2$", result: "$6\\nabla_{\\partial_x}\\partial_y$", why: "constant coefficient" },{ do: "Use given value", result: "$6\\cdot0$", why: "connection term is zero" },{ do: "Simplify", result: "$0$", why: "zero times six" },{ do: "State", result: "$\\nabla_XY=0$", why: "parallel in that direction" }], answer: "$0$." },
      { problem: "One-dimensional Christoffel correction $\\Gamma^1_{11}=0.5$, with $\\dot{x}=2$, $\\ddot{x}=0$. Compute geodesic equation left side.", steps: [{ do: "Write formula", result: "$\\ddot{x}+\\Gamma^1_{11}\\dot{x}^2$", why: "one coordinate" },{ do: "Substitute", result: "$0+0.5\\cdot2^2$", why: "given values" },{ do: "Square", result: "$4$", why: "speed squared" },{ do: "Multiply", result: "$2$", why: "Christoffel contribution" },{ do: "Interpret", result: "not geodesic", why: "left side is nonzero" }], answer: "The value is $2$." }
    ],
    applications: [
      { title: "Navigation on Earth", background: "Parallel transport on a curved globe can rotate directions after a loop.", numbers: "A unit-sphere triangle of area $\\pi/2$ rotates a vector by $\\pi/2$." },
      { title: "General relativity", background: "Gravity is encoded by a connection on spacetime.", numbers: "Correction $0.01$ m/s$^2$ over $10$ s changes speed by $0.1$ m/s." },
      { title: "Manifold momentum", background: "Optimization with momentum must transport old velocity to the new tangent space.", numbers: "Momentum norm $0.8$ and gradient norm $0.2$ can be combined after transport." },
      { title: "Graphics frames", background: "Parallel-transport frames avoid twisting along curves.", numbers: "A tube with $100$ samples can transport one normal step by step." },
      { title: "Information geometry", background: "Statistical manifolds use connections to compare score directions.", numbers: "A transported score change of metric length $0.03$ is a small correction." },
      { title: "Robotics orientation", background: "Rotation velocities are transported between changing body frames.", numbers: "$0.2$ rad/s for $0.05$ s gives a $0.01$ rad update." }
    ],
    applicationsClose: "Connections are the rules that let arrows move honestly across curved spaces.",
    takeaways: ["A connection defines $\\nabla_XY$.", "Parallel transport means $\\nabla_{\\gamma'}V=0$.", "Geodesics satisfy $\\nabla_{\\gamma'}\\gamma'=0$.", "Transport may depend on path in curved spaces."]
  },

  "math-12-19": {
    id: "math-12-19", title: "The Fisher information metric", tagline: "The Fisher metric measures parameter motion by how much it changes a probability distribution.",
    connections: { buildsOn: ["Riemannian metrics", "probability distributions", "log-likelihood"], leadsTo: ["Geometric deep learning", "natural gradient", "information geometry"], usedWith: ["score functions", "KL divergence", "statistical manifolds"] },
    motivation: "<p>A raw parameter change of $0.1$ does not mean the same thing in every model. Near a probability boundary, it can radically change the distribution.</p><p>The <b>Fisher information metric</b> measures changes by distributional sensitivity, not coordinate size.</p>",
    definition: "<p>For $p(x\\mid\\theta)$, the score is $s_\\theta(x)=\\nabla_\\theta\\log p(x\\mid\\theta)$. The Fisher information matrix is $$I(\\theta)=\\mathbb{E}[s_\\theta(x)s_\\theta(x)^T],$$ and it defines $g_\\theta(u,v)=u^TI(\\theta)v$.</p><p>Locally, $D_{KL}(p_\\theta\\|p_{\\theta+d\\theta})\\approx\\frac12 d\\theta^TI(\\theta)d\\theta$. That is why Fisher length measures distinguishability of nearby distributions.</p><p><b>Assumptions that matter:</b> the model is smooth; expectations exist; parameters are identifiable; and boundary probabilities can make the metric large.</p>",
    worked: { problem: "For Bernoulli $p=0.2$, compute $I(p)=1/[p(1-p)]$ and squared Fisher length of $dp=0.04$.", skills: ["Bernoulli", "Fisher metric", "local length"], strategy: "Compute Fisher information, then multiply by $dp^2$.", steps: [{ do: "Compute $1-p$", result: "$0.8$", why: "failure probability" },{ do: "Multiply", result: "$p(1-p)=0.2\\cdot0.8=0.16$", why: "denominator" },{ do: "Invert", result: "$I=1/0.16=6.25$", why: "Bernoulli formula" },{ do: "Square the step", result: "$(0.04)^2=0.0016$", why: "length squared uses squared change" },{ do: "Multiply", result: "$6.25\\cdot0.0016=0.01$", why: "squared Fisher length" }], verify: "The Fisher length is $0.1$, a modest local distribution change.", answer: "$I(0.2)=6.25$ and squared length is $0.01$.", connects: "The Fisher metric turns statistical sensitivity into geometry." },
    practice: [
      { problem: "For Bernoulli $p=0.5$, compute $I$ and squared length of $dp=0.1$.", steps: [{ do: "Multiply", result: "$0.5\\cdot0.5=0.25$", why: "denominator" },{ do: "Invert", result: "$I=4$", why: "Fisher information" },{ do: "Square step", result: "$0.01$", why: "$0.1^2$" },{ do: "Multiply", result: "$0.04$", why: "$4\\cdot0.01$" },{ do: "Take length", result: "$0.2$", why: "square root" }], answer: "$I=4$, squared length $0.04$." },
      { problem: "Compare squared length of $dp=0.02$ at Bernoulli $p=0.9$ and $p=0.5$.", steps: [{ do: "Compute $I(0.9)$", result: "$1/(0.9\\cdot0.1)=11.111\\ldots$", why: "near boundary" },{ do: "Square step", result: "$0.0004$", why: "$0.02^2$" },{ do: "Multiply at $0.9$", result: "$0.00444$", why: "Fisher length squared" },{ do: "Compute at $0.5$", result: "$4\\cdot0.0004=0.0016$", why: "center metric" },{ do: "Compare", result: "$0.00444>0.0016$", why: "boundary step is larger" }], answer: "About $0.00444$ at $p=0.9$ versus $0.0016$ at $p=0.5$." },
      { problem: "Normal mean with known variance $4$: use $I(\\mu)=1/4$ to find Fisher length of $d\\mu=1$.", steps: [{ do: "Identify Fisher", result: "$I=1/4$", why: "known-variance normal mean" },{ do: "Square change", result: "$1^2=1$", why: "given step" },{ do: "Compute squared length", result: "$1/4$", why: "multiply" },{ do: "Take square root", result: "$1/2$", why: "length" },{ do: "State", result: "$0.5$", why: "decimal form" }], answer: "The Fisher length is $0.5$." },
      { problem: "Poisson rate $\\lambda=5$, $I=1/\\lambda$. Find squared length of $d\\lambda=0.5$.", steps: [{ do: "Compute Fisher", result: "$I=1/5=0.2$", why: "Poisson formula" },{ do: "Square change", result: "$0.25$", why: "$0.5^2$" },{ do: "Multiply", result: "$0.2\\cdot0.25=0.05$", why: "squared length" },{ do: "Optional length", result: "$\\sqrt{0.05}\\approx0.224$", why: "square root" },{ do: "State requested value", result: "$0.05$", why: "squared length" }], answer: "The squared Fisher length is $0.05$." },
      { problem: "Bernoulli $p=0.25$ has ordinary gradient $2$. Compute natural-gradient direction.", steps: [{ do: "Compute inverse Fisher", result: "$p(1-p)=0.25\\cdot0.75=0.1875$", why: "Bernoulli inverse metric" },{ do: "Multiply by gradient", result: "$0.1875\\cdot2=0.375$", why: "precondition the gradient" },{ do: "Check Fisher", result: "$I=5.333\\ldots$", why: "inverse of $0.1875$" },{ do: "Name direction", result: "$0.375$", why: "natural gradient" },{ do: "Interpret", result: "descent subtracts a scaled version", why: "optimization convention" }], answer: "The natural-gradient direction is $0.375$." }
    ],
    applications: [
      { title: "Natural gradient descent", background: "Natural gradients precondition ordinary gradients by information geometry.", numbers: "For $p=0.2$, $I^{-1}=0.16$ and gradient $1.5$ becomes $0.24$." },
      { title: "Boundary confidence", background: "Near $0$ or $1$, Bernoulli parameters are geometrically sensitive.", numbers: "At $p=0.99$, $I\\approx101.01$; step $0.01$ has squared length $0.0101$." },
      { title: "Estimator uncertainty", background: "Inverse Fisher information approximates variance of maximum likelihood estimators.", numbers: "If $100$ samples give information $400$, variance is about $1/400=0.0025$." },
      { title: "KL trust regions", background: "Fisher length approximates local KL, useful for limiting policy changes.", numbers: "If $d\\theta^TId\\theta=0.02$, local KL is about $0.01$." },
      { title: "Policy optimization", background: "Reinforcement learning methods often constrain Fisher-like step size.", numbers: "A Fisher squared length $0.04$ gives local KL about $0.02$." },
      { title: "Gaussian noise", background: "More observation noise means less information about a mean.", numbers: "Variance $9$ gives one-sample $I=1/9$; $81$ samples give total information $9$." }
    ],
    applicationsClose: "The Fisher metric is probability-aware geometry: it measures how much the distribution changes.",
    takeaways: ["Fisher information is the expected score outer product.", "It defines a metric on identifiable statistical models.", "Local KL is approximately half squared Fisher length.", "Natural gradients use the inverse Fisher metric."]
  },

  "math-12-20": {
    id: "math-12-20", title: "Geometric deep learning", tagline: "Geometric deep learning builds models that respect the shape, symmetry, and constraints of their data.",
    connections: { buildsOn: ["Geodesics", "The exponential map", "Connections and parallel transport", "The Fisher information metric"], leadsTo: ["manifold optimization", "equivariant networks", "graph neural networks"], usedWith: ["symmetry groups", "Riemannian metrics", "message passing"] },
    motivation: "<p>Many neural networks treat everything as flat vectors. But rotations, graphs, probability distributions, spherical embeddings, and covariance matrices are not naturally flat.</p><p><b>Geometric deep learning</b> asks the model to respect the structure already present: distances, symmetries, manifolds, and graph neighborhoods.</p>",
    definition: "<p><b>Geometric deep learning</b> designs learning systems around geometric structure such as manifolds, graphs, groups, and metrics. A model is <b>equivariant</b> when transforming the input predictably transforms the output, and <b>invariant</b> when the output should not change.</p><p>This topic contributes concrete tools: metrics measure meaningful steps, exponential maps and retractions keep updates on manifolds, parallel transport moves tangent information, and Fisher geometry gives natural gradients $I(\\theta)^{-1}\\nabla L$.</p><p><b>Assumptions that matter:</b> the chosen geometry must match the data; graph edges must encode useful relations; equivariance must match the true symmetry; and manifold updates need tangent steps followed by valid maps back to the manifold.</p>",
    worked: { problem: "Bernoulli $p=0.2$ has ordinary loss gradient $1.5$. Take a natural-gradient descent step with learning rate $0.1$.", skills: ["Fisher metric", "natural gradient", "ML optimization"], strategy: "Use $I^{-1}=p(1-p)$, precondition the gradient, then subtract the scaled step.", steps: [{ do: "Compute $1-p$", result: "$0.8$", why: "failure probability" },{ do: "Compute inverse Fisher", result: "$p(1-p)=0.2\\cdot0.8=0.16$", why: "Bernoulli inverse metric" },{ do: "Compute natural gradient", result: "$0.16\\cdot1.5=0.24$", why: "precondition the ordinary gradient" },{ do: "Scale by learning rate", result: "$0.1\\cdot0.24=0.024$", why: "step size" },{ do: "Update", result: "$p_{new}=0.2-0.024=0.176$", why: "descent subtracts the step" }], verify: "A raw Euclidean step would move by $0.15$ to $0.05$; the natural step is gentler near the boundary.", answer: "$p_{new}=0.176$.", connects: "Geometric learning uses the right metric so optimization respects the model space." },
    practice: [
      { problem: "Sphere embedding $p=(0,0,1)$ has tangent gradient $g=(0.3,0.4,0)$. Retract a descent step of size $0.2$.", steps: [{ do: "Compute step", result: "$v=-0.2g=(-0.06,-0.08,0)$", why: "move opposite gradient" },{ do: "Add", result: "$p+v=(-0.06,-0.08,1)$", why: "ambient trial" },{ do: "Squared norm", result: "$0.0036+0.0064+1=1.01$", why: "sum squares" },{ do: "Norm", result: "$\\sqrt{1.01}\\approx1.005$", why: "normalize" },{ do: "Divide", result: "$(-0.0597,-0.0796,0.9950)$", why: "retraction" }], answer: "Approximately $(-0.0597,-0.0796,0.9950)$." },
      { problem: "A GNN node has neighbors $(1,3)$ and $(5,1)$. With mean message and $h_1^{new}=0.5h_1+0.5m$, $h_1=(2,2)$.", steps: [{ do: "Add neighbors", result: "$(6,4)$", why: "aggregate" },{ do: "Average", result: "$m=(3,2)$", why: "two neighbors" },{ do: "Scale self", result: "$0.5h_1=(1,1)$", why: "self weight" },{ do: "Scale message", result: "$0.5m=(1.5,1)$", why: "neighbor weight" },{ do: "Add", result: "$(2.5,2)$", why: "updated feature" }], answer: "$h_1^{new}=(2.5,2)$." },
      { problem: "Hyperbolic score $s=-d$: distances $0.7$ and $2.1$. Use $e^{-0.7}=0.497$, $e^{-2.1}=0.122$ for two-way softmax.", steps: [{ do: "Set weights", result: "$0.497$ and $0.122$", why: "exponentiate scores" },{ do: "Add", result: "$0.619$", why: "softmax denominator" },{ do: "Divide", result: "$0.497/0.619$", why: "probability of closer edge" },{ do: "Approximate", result: "$0.803$", why: "compute ratio" },{ do: "Interpret", result: "$80.3\\%$", why: "closer point is favored" }], answer: "The closer-edge probability is about $0.803$." },
      { problem: "A $90^\\circ$ equivariant vector model outputs $(2,1)$. What output should follow a $90^\\circ$ input rotation?", steps: [{ do: "Write rotation rule", result: "$(x,y)\\mapsto(-y,x)$", why: "counterclockwise $90^\\circ$" },{ do: "Substitute", result: "$(2,1)\\mapsto(-1,2)$", why: "apply rotation" },{ do: "Check old norm", result: "$\\sqrt5$", why: "length before rotation" },{ do: "Check new norm", result: "$\\sqrt5$", why: "rotation preserves length" },{ do: "State equivariance", result: "$(-1,2)$", why: "output transforms with input" }], answer: "$(-1,2)$." },
      { problem: "Fisher matrix $I=\\operatorname{diag}(4,1)$ and gradient $g=(8,3)$. Update $\\theta=(1,1)$ with natural-gradient descent, learning rate $0.05$.", steps: [{ do: "Invert Fisher", result: "$I^{-1}=\\operatorname{diag}(1/4,1)$", why: "diagonal inverse" },{ do: "Precondition", result: "$I^{-1}g=(2,3)$", why: "natural gradient" },{ do: "Scale", result: "$0.05(2,3)=(0.1,0.15)$", why: "learning rate" },{ do: "Subtract", result: "$(1,1)-(0.1,0.15)$", why: "descent" },{ do: "Simplify", result: "$(0.9,0.85)$", why: "new parameter" }], answer: "Natural direction $(2,3)$; updated parameter $(0.9,0.85)$." }
    ],
    applications: [
      { title: "Natural gradient training", background: "Natural gradients use Fisher geometry to reduce dependence on parameter coordinates.", numbers: "At $p=0.2$, gradient $1.5$ becomes $0.24$, so $\\eta=0.1$ moves by $0.024$." },
      { title: "Manifold-valued embeddings", background: "Sphere or rotation embeddings need updates that stay on the manifold.", numbers: "The retracted point $(-0.0597,-0.0796,0.9950)$ has norm about $1$." },
      { title: "Graph neural networks", background: "GNNs use graph neighborhoods as the geometry of the data.", numbers: "Neighbor scalars $4,7,10$ average to message $7$." },
      { title: "Equivariant vision", background: "Convolutions respect translation; group-equivariant models extend this to rotations.", numbers: "A $90^\\circ$ rotation sends $(2,1)$ to $(-1,2)$." },
      { title: "Hyperbolic hierarchy embeddings", background: "Hyperbolic space fits tree-like growth better than flat space.", numbers: "Distances $0.7$ and $2.1$ give softmax probability $0.803$ for the closer relation." },
      { title: "Molecular learning", background: "Rotating a molecule should rotate predicted forces but leave energy unchanged.", numbers: "Force $(1,0,0)$ rotates to $(0,1,0)$, while energy $-3.2$ eV stays $-3.2$ eV." },
      { title: "SPD covariance layers", background: "Covariance matrices live on a positive-definite manifold, not all matrices.", numbers: "Log variances $(\\ln4,\\ln9)=(1.386,2.197)$ plus $(-0.1,0.2)$ map to about $(3.62,10.99)$." }
    ],
    applicationsClose: "Geometric deep learning is the practical payoff: respect the space, use the right metric, and build the symmetry into the model.",
    takeaways: ["Geometry tells models what distances, constraints, and symmetries matter.", "Manifold updates use tangent steps plus exponential maps or retractions.", "Natural gradients use Fisher geometry.", "GNNs, equivariant models, hyperbolic embeddings, and manifold networks are concrete geometric learning tools."]
  }
};
