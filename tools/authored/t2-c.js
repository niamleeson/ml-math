module.exports = {
  "math-02-29": {
    id: "math-02-29",
    title: "The Jacobian determinant",
    tagline: "The Jacobian determinant tells how a smooth change of coordinates stretches tiny areas or volumes.",
    connections: { buildsOn: ["partial derivatives", "linear approximation", "determinants"], leadsTo: ["change of variables in double and triple integrals", "coordinate systems", "normalizing flows"], usedWith: ["linear maps", "area scaling", "orientation", "multivariable integration"] },
    motivation: "<p>You already know that the determinant of a matrix measures how a linear map scales area. A smooth nonlinear map is not linear everywhere, but if you zoom in near one point, it looks almost linear.</p><p>The <b>Jacobian determinant</b> is the determinant of that local linear map. It is the conversion factor that keeps area and volume honest when coordinates are renamed.</p>",
    definition: "<p>For a map $T(u,v)=(x(u,v),y(u,v))$, the <b>Jacobian matrix</b> is $$J_T=\\begin{bmatrix}\\dfrac{\\partial x}{\\partial u}&\\dfrac{\\partial x}{\\partial v}\\\\\\dfrac{\\partial y}{\\partial u}&\\dfrac{\\partial y}{\\partial v}\\end{bmatrix}.$$ Its determinant $$\\dfrac{\\partial(x,y)}{\\partial(u,v)}=\\det J_T=x_u y_v-x_v y_u$$ is the signed local area scale. The derivation is the determinant idea applied to the two tiny displacement vectors $T_u\\,du$ and $T_v\\,dv$ that span the image of a tiny coordinate rectangle.</p><p><b>Assumptions that matter:</b> the coordinate map should be differentiable, the determinant should not vanish on the region except possibly boundaries, and integrals use $|\\det J_T|$ because area and volume are nonnegative.</p>",
    worked: {
      problem: "Find the Jacobian determinant for $x=2u+v$, $y=u-3v$, and compute the area of the image of a $4$ by $5$ rectangle in the $uv$-plane.",
      skills: ["partial derivatives", "determinants", "area scaling"],
      strategy: "The map is linear, so one determinant gives the same scale everywhere.",
      steps: [
        { do: "Compute $x_u$", result: "$2$", why: "differentiate $2u+v$ with respect to $u$" },
        { do: "Compute $x_v$", result: "$1$", why: "differentiate $2u+v$ with respect to $v$" },
        { do: "Compute $y_u$", result: "$1$", why: "differentiate $u-3v$ with respect to $u$" },
        { do: "Compute $y_v$", result: "$-3$", why: "differentiate $u-3v$ with respect to $v$" },
        { do: "Build the matrix", result: "$J=\\begin{bmatrix}2&1\\\\1&-3\\end{bmatrix}$", why: "place derivatives in coordinate-output order" },
        { do: "Take the determinant", result: "$\\det J=2(-3)-1(1)=-7$", why: "use $ad-bc$" },
        { do: "Use absolute scale", result: "$|\\det J|=7$", why: "area cannot be negative" },
        { do: "Scale the original area", result: "$7\\cdot(4\\cdot5)=140$", why: "linear maps multiply every area by the determinant magnitude" }
      ],
      verify: "A negative determinant means orientation flipped, not that area is negative; the scale factor $7$ turns area $20$ into area $140$.",
      answer: "$\\det J=-7$ and the image area is $140$ square units.",
      connects: "The Jacobian determinant is the local version of determinant-as-area-scale."
    },
    practice: [
      { problem: "For $x=3u$, $y=4v$, find the Jacobian determinant and the image area of $0\\le u\\le2$, $0\\le v\\le5$.", steps: [
        { do: "Compute $x_u$", result: "$3$", why: "differentiate $3u$ with respect to $u$" },
        { do: "Compute $x_v$", result: "$0$", why: "$x$ does not depend on $v$" },
        { do: "Compute $y_u$", result: "$0$", why: "$y$ does not depend on $u$" },
        { do: "Compute $y_v$", result: "$4$", why: "differentiate $4v$ with respect to $v$" },
        { do: "Compute the determinant", result: "$\\det J=3\\cdot4-0\\cdot0=12$", why: "use the $2$ by $2$ determinant" },
        { do: "Scale the rectangle area", result: "$12\\cdot(2\\cdot5)=120$", why: "area scale is constant" }
      ], answer: "$\\det J=12$ and the image area is $120$ square units." },
      { problem: "For polar coordinates $x=r\\cos\\theta$, $y=r\\sin\\theta$, compute $\\dfrac{\\partial(x,y)}{\\partial(r,\\theta)}$.", steps: [
        { do: "Compute $x_r$", result: "$\\cos\\theta$", why: "differentiate with respect to $r$" },
        { do: "Compute $x_\\theta$", result: "$-r\\sin\\theta$", why: "differentiate cosine with respect to $\\theta$" },
        { do: "Compute $y_r$", result: "$\\sin\\theta$", why: "differentiate with respect to $r$" },
        { do: "Compute $y_\\theta$", result: "$r\\cos\\theta$", why: "differentiate sine with respect to $\\theta$" },
        { do: "Take the determinant", result: "$r\\cos^2\\theta+r\\sin^2\\theta$", why: "subtract the product of the off-diagonal entries" },
        { do: "Use the identity", result: "$r$", why: "$\\cos^2\\theta+\\sin^2\\theta=1$" }
      ], answer: "The polar Jacobian determinant is $r$." },
      { problem: "For $x=u^2-v^2$, $y=2uv$, compute the Jacobian determinant at $(u,v)=(3,1)$.", steps: [
        { do: "Compute $x_u$", result: "$2u$", why: "differentiate $u^2-v^2$ with respect to $u$" },
        { do: "Compute $x_v$", result: "$-2v$", why: "differentiate with respect to $v$" },
        { do: "Compute $y_u$", result: "$2v$", why: "differentiate $2uv$ with respect to $u$" },
        { do: "Compute $y_v$", result: "$2u$", why: "differentiate $2uv$ with respect to $v$" },
        { do: "Form the determinant", result: "$\\det J=(2u)(2u)-(-2v)(2v)=4u^2+4v^2$", why: "use $ad-bc$" },
        { do: "Substitute $(3,1)$", result: "$4(9)+4(1)=40$", why: "evaluate the local scale" }
      ], answer: "The local area scale at $(3,1)$ is $40$." },
      { problem: "Use $x=2u-v$, $y=u+v$ to transform an integral. What factor multiplies $du\\,dv$?", steps: [
        { do: "Compute $x_u$", result: "$2$", why: "differentiate $2u-v$" },
        { do: "Compute $x_v$", result: "$-1$", why: "differentiate with respect to $v$" },
        { do: "Compute $y_u$", result: "$1$", why: "differentiate $u+v$" },
        { do: "Compute $y_v$", result: "$1$", why: "differentiate with respect to $v$" },
        { do: "Compute the determinant", result: "$2\\cdot1-(-1)\\cdot1=3$", why: "determinant gives signed scale" },
        { do: "Take the absolute value", result: "$3$", why: "integrals use positive area scale" }
      ], answer: "The area element becomes $dx\\,dy=3\\,du\\,dv$." },
      { problem: "A normalizing flow has local Jacobian matrix $\\begin{bmatrix}1.5&0\\\\0&0.8\\end{bmatrix}$. Find the log-density correction $-\\log|\\det J|$.", steps: [
        { do: "Multiply the diagonal entries", result: "$\\det J=1.5\\cdot0.8$", why: "the matrix is diagonal" },
        { do: "Simplify the determinant", result: "$\\det J=1.2$", why: "$15\\cdot8=120$ hundredths" },
        { do: "Take the absolute value", result: "$|\\det J|=1.2$", why: "the determinant is already positive" },
        { do: "Apply the correction", result: "$-\\log(1.2)$", why: "density divides by local volume expansion" },
        { do: "Approximate the logarithm", result: "$-\\log(1.2)\\approx-0.182$", why: "$\\log(1.2)\\approx0.182$" }
      ], answer: "The correction is about $-0.182$." }
    ],
    applications: [
      { title: "Changing variables in a double integral", background: "Coordinate changes turn awkward regions into simple rectangles, but the area element must be rescaled.", numbers: "For $x=2u$, $y=3v$, $|\\det J|=6$, so a $1$ by $4$ rectangle in $uv$ has image area $6\\cdot4=24$." },
      { title: "Polar area elements", background: "Polar coordinates spread points farther apart as radius grows, which is why rings have more area than tiny central wedges.", numbers: "At $r=5$, a small box $dr=0.2$, $d\\theta=0.1$ has area about $5\\cdot0.2\\cdot0.1=0.1$." },
      { title: "Normalizing flows", background: "Flow models learn invertible maps and adjust density by local volume expansion.", numbers: "If $|\\det J|=0.25$ and base density is $0.08$, transformed density is $0.08/0.25=0.32$." },
      { title: "Image warping", background: "Computer vision warps images for alignment; the Jacobian says whether pixels are magnified or compressed.", numbers: "A local matrix $\\begin{bmatrix}2&0\\\\0&0.5\\end{bmatrix}$ has determinant $1$, so a $10$ pixel patch keeps area $10$." },
      { title: "Robotics workspace maps", background: "Joint angles map to end-effector positions; the Jacobian determinant measures local reachability.", numbers: "A local determinant $0.03$ means a joint-space area $0.2$ maps to about $0.006$ square meters of workspace area." },
      { title: "Uncertainty propagation", background: "Small covariance ellipses transform through nonlinear maps using the local Jacobian.", numbers: "If a two-dimensional uncertainty area is $0.04$ and $|\\det J|=3$, the image area is about $0.12$." }
    ],
    applicationsClose: "The same determinant idea keeps appearing: zoom in, read the local linear stretch, and scale area or density accordingly.",
    takeaways: ["The Jacobian matrix collects first partial derivatives of a coordinate map.", "Its determinant is signed local area or volume scale.", "Change-of-variable integrals use the absolute value of the determinant."]
  },

  "math-02-30": {
    id: "math-02-30",
    title: "Cylindrical coordinates",
    tagline: "Cylindrical coordinates add height to polar coordinates, matching shapes built around an axis.",
    connections: { buildsOn: ["polar coordinates", "three-dimensional coordinates", "the Jacobian determinant"], leadsTo: ["triple integrals", "spherical coordinates", "flux through cylinders"], usedWith: ["symmetry", "radial distance", "volume elements", "triple integrals"] },
    motivation: "<p>You already know how polar coordinates describe a point in a flat disk using radius and angle. If the object also has height, keep the same radius and angle and simply add $z$.</p><p>That is cylindrical coordinates. They make cans, pipes, circular sensors, and axis-symmetric fields feel natural instead of algebraically heavy.</p>",
    definition: "<p><b>Cylindrical coordinates</b> write a point as $(r,\\theta,z)$ with $$x=r\\cos\\theta,\\qquad y=r\\sin\\theta,\\qquad z=z.$$ Here $r\\ge0$ is distance from the $z$-axis, $\\theta$ is angle in the $xy$-plane, and $z$ is ordinary height. The volume element is $$dV=r\\,dr\\,d\\theta\\,dz$$ because the $xy$ part has polar Jacobian $r$ and the height direction has scale $1$.</p><p><b>Assumptions that matter:</b> describe angles consistently, include the factor $r$ in every integral, and choose cylindrical coordinates mainly when the region or integrand has circular symmetry around an axis.</p>",
    worked: {
      problem: "Find the volume of a cylinder of radius $3$ and height $5$ using cylindrical coordinates.",
      skills: ["coordinate bounds", "triple integrals", "volume element"],
      strategy: "The cylinder has constant radial and height bounds, so integrate $r$ over a rectangular box in $(r,\\theta,z)$.",
      steps: [
        { do: "Set the radial bounds", result: "$0\\le r\\le3$", why: "points lie within radius $3$" },
        { do: "Set the angular bounds", result: "$0\\le\\theta\\le2\\pi$", why: "the full cylinder goes all the way around" },
        { do: "Set the height bounds", result: "$0\\le z\\le5$", why: "the cylinder height is $5$" },
        { do: "Write the integral", result: "$V=\\int_0^5\\int_0^{2\\pi}\\int_0^3 r\\,dr\\,d\\theta\\,dz$", why: "the cylindrical volume element is $r\\,dr\\,d\\theta\\,dz$" },
        { do: "Integrate with respect to $r$", result: "$\\int_0^3 r\\,dr=\\dfrac92$", why: "area of radial shells accumulates as $r$" },
        { do: "Integrate with respect to $\\theta$", result: "$\\dfrac92\\cdot2\\pi=9\\pi$", why: "the full angle contributes length $2\\pi$" },
        { do: "Integrate with respect to $z$", result: "$9\\pi\\cdot5=45\\pi$", why: "multiply by height" }
      ],
      verify: "The ordinary formula gives $\\pi r^2h=\\pi\\cdot9\\cdot5=45\\pi$, matching the integral.",
      answer: "$45\\pi$ cubic units.",
      connects: "Cylindrical coordinates turn circular volume into radius, angle, and height bookkeeping."
    },
    practice: [
      { problem: "Convert $(r,\\theta,z)=(4,\\pi/6,2)$ to rectangular coordinates.", steps: [
        { do: "Write the $x$ formula", result: "$x=4\\cos(\\pi/6)$", why: "use $x=r\\cos\\theta$" },
        { do: "Evaluate the cosine", result: "$x=4\\cdot\\dfrac{\\sqrt3}{2}=2\\sqrt3$", why: "$\\cos(\\pi/6)=\\sqrt3/2$" },
        { do: "Write the $y$ formula", result: "$y=4\\sin(\\pi/6)$", why: "use $y=r\\sin\\theta$" },
        { do: "Evaluate the sine", result: "$y=4\\cdot\\dfrac12=2$", why: "$\\sin(\\pi/6)=1/2$" },
        { do: "Keep the height", result: "$z=2$", why: "cylindrical and rectangular height agree" }
      ], answer: "$(x,y,z)=(2\\sqrt3,2,2)$." },
      { problem: "Convert $(x,y,z)=(-3,3,7)$ to cylindrical coordinates with $0\\le\\theta<2\\pi$.", steps: [
        { do: "Compute $r$", result: "$r=\\sqrt{(-3)^2+3^2}=3\\sqrt2$", why: "radial distance is distance from the $z$-axis" },
        { do: "Compute the reference tangent", result: "$|y/x|=1$", why: "the angle has a $45^\\circ$ reference angle" },
        { do: "Identify the quadrant", result: "quadrant II", why: "$x<0$ and $y>0$" },
        { do: "Choose the angle", result: "$\\theta=3\\pi/4$", why: "quadrant II angle with reference $\\pi/4$" },
        { do: "Keep the height", result: "$z=7$", why: "height is unchanged" }
      ], answer: "$(r,\\theta,z)=(3\\sqrt2,3\\pi/4,7)$." },
      { problem: "Set up the volume integral for the solid $1\\le r\\le4$, $0\\le\\theta\\le\\pi$, $0\\le z\\le2$ and compute it.", steps: [
        { do: "Write the integral", result: "$\\int_0^2\\int_0^\\pi\\int_1^4 r\\,dr\\,d\\theta\\,dz$", why: "use the cylindrical volume element" },
        { do: "Integrate in $r$", result: "$\\left[\\dfrac{r^2}{2}\\right]_1^4=\\dfrac{15}{2}$", why: "subtract inner radius contribution" },
        { do: "Integrate in $\\theta$", result: "$\\dfrac{15}{2}\\pi$", why: "the angle length is $\\pi$" },
        { do: "Integrate in $z$", result: "$15\\pi$", why: "height length is $2$" },
        { do: "Interpret the shape", result: "half of a cylindrical shell", why: "the angle covers half a full turn" }
      ], answer: "The volume is $15\\pi$." },
      { problem: "Compute $\\iiint_E z\\,dV$ for $0\\le r\\le2$, $0\\le\\theta\\le2\\pi$, $0\\le z\\le3$.", steps: [
        { do: "Insert the volume element", result: "$\\int_0^3\\int_0^{2\\pi}\\int_0^2 z r\\,dr\\,d\\theta\\,dz$", why: "$dV=r\\,dr\\,d\\theta\\,dz$" },
        { do: "Integrate in $r$", result: "$\\int_0^2 zr\\,dr=2z$", why: "$\\int_0^2 r\\,dr=2$" },
        { do: "Integrate in $\\theta$", result: "$4\\pi z$", why: "multiply by $2\\pi$" },
        { do: "Integrate in $z$", result: "$\\int_0^3 4\\pi z\\,dz$", why: "only height remains" },
        { do: "Evaluate", result: "$18\\pi$", why: "$4\\pi\\cdot9/2=18\\pi$" }
      ], answer: "$18\\pi$." },
      { problem: "A LiDAR bin covers $2\\le r\\le2.5$, $0\\le\\theta\\le0.2$, and $0\\le z\\le1.5$. Approximate its volume.", steps: [
        { do: "Write the cylindrical volume", result: "$\\int_0^{1.5}\\int_0^{0.2}\\int_2^{2.5} r\\,dr\\,d\\theta\\,dz$", why: "bin boundaries are cylindrical" },
        { do: "Integrate in $r$", result: "$\\dfrac{2.5^2-2^2}{2}=1.125$", why: "radial shell area grows with $r$" },
        { do: "Multiply by angle width", result: "$1.125\\cdot0.2=0.225$", why: "the bin uses $0.2$ radians" },
        { do: "Multiply by height", result: "$0.225\\cdot1.5=0.3375$", why: "height is $1.5$" },
        { do: "State units", result: "$0.3375$ cubic units", why: "a volume calculation needs cubic units" }
      ], answer: "The bin volume is $0.3375$ cubic units." }
    ],
    applications: [
      { title: "Pipe and tank volumes", background: "Engineering designs cylindrical containers because circular cross-sections distribute stress well.", numbers: "A tank with radius $2$ m and height $6$ m has volume $\\pi\\cdot2^2\\cdot6=24\\pi\\approx75.4$ m$^3$." },
      { title: "LiDAR point bins", background: "Autonomous systems often bin points by range, angle, and height around the sensor.", numbers: "A bin near $r=10$ with $\\Delta r=0.5$, $\\Delta\\theta=0.1$, $\\Delta z=2$ has volume about $10\\cdot0.5\\cdot0.1\\cdot2=1$." },
      { title: "Rotationally symmetric densities", background: "Some probability models depend only on distance from an axis, so cylindrical coordinates remove angular clutter.", numbers: "For density $0.01$ in a cylinder radius $5$, height $4$, mass is $0.01\\pi25\\cdot4=\\pi\\approx3.14$." },
      { title: "Graphics and game worlds", background: "Cylindrical coordinates make orbiting cameras and radial effects easy to parameterize.", numbers: "At radius $8$, changing angle by $0.05$ rad moves about $8\\cdot0.05=0.4$ units along the arc." },
      { title: "Magnetic fields around wires", background: "Fields around a long straight wire are naturally described by radius from the wire and angle around it.", numbers: "A field proportional to $1/r$ has strength $10$ at $r=0.2$ if the constant is $2$, since $2/0.2=10$." },
      { title: "Convolution kernels with radial symmetry", background: "Vision filters sometimes depend on radial distance from a center pixel rather than separate $x$ and $y$.", numbers: "A ring from $r=2$ to $r=3$ has area $\\pi(9-4)=5\\pi\\approx15.7$ pixels squared." }
    ],
    applicationsClose: "Whenever a problem is built around an axis, cylindrical coordinates trade awkward rectangles for radius, angle, and height.",
    takeaways: ["Cylindrical coordinates are $(r,\\theta,z)$ with $x=r\\cos\\theta$ and $y=r\\sin\\theta$.", "The volume element is $r\\,dr\\,d\\theta\\,dz$.", "Use them for circular or axis-symmetric regions in three dimensions."]
  },

  "math-02-31": {
    id: "math-02-31",
    title: "Spherical coordinates",
    tagline: "Spherical coordinates describe points by distance from the origin and two angles.",
    connections: { buildsOn: ["trigonometry", "cylindrical coordinates", "the Jacobian determinant"], leadsTo: ["triple integrals over balls", "surface area on spheres", "radial probability models"], usedWith: ["spheres", "cones", "radial symmetry", "solid angle"] },
    motivation: "<p>You already know that a point in space has a distance from the origin. For a ball, shell, cone, or radiation pattern, that distance is often the main character.</p><p><b>Spherical coordinates</b> make the radius explicit. The two angles say where on the sphere you are looking, and the Jacobian accounts for the fact that larger spheres have larger shells.</p>",
    definition: "<p>Use $(\\rho,\\phi,\\theta)$ with $$x=\\rho\\sin\\phi\\cos\\theta,\\qquad y=\\rho\\sin\\phi\\sin\\theta,\\qquad z=\\rho\\cos\\phi.$$ Here $\\rho\\ge0$ is distance from the origin, $0\\le\\phi\\le\\pi$ is angle down from the positive $z$-axis, and $0\\le\\theta<2\\pi$ is the usual angle in the $xy$-plane. The volume element is $$dV=\\rho^2\\sin\\phi\\,d\\rho\\,d\\phi\\,d\\theta.$$ One factor $\\rho$ comes from arc length in the $\\phi$ direction, another $\\rho\\sin\\phi$ from arc length around the horizontal circle.</p><p><b>Assumptions that matter:</b> different fields use different angle conventions, so define $\\phi$ and $\\theta$ before computing; include $\\rho^2\\sin\\phi$; and use spherical coordinates when radial distance or spherical boundaries simplify the region.</p>",
    worked: {
      problem: "Use spherical coordinates to find the volume of a ball of radius $2$.",
      skills: ["spherical bounds", "triple integrals", "volume element"],
      strategy: "A ball has constant radial bounds and all angles, so integrate the spherical volume element.",
      steps: [
        { do: "Set the radial bounds", result: "$0\\le\\rho\\le2$", why: "the radius of the ball is $2$" },
        { do: "Set the polar-angle bounds", result: "$0\\le\\phi\\le\\pi$", why: "the ball goes from north pole to south pole" },
        { do: "Set the azimuth bounds", result: "$0\\le\\theta\\le2\\pi$", why: "the ball goes all the way around" },
        { do: "Write the integral", result: "$V=\\int_0^{2\\pi}\\int_0^\\pi\\int_0^2 \\rho^2\\sin\\phi\\,d\\rho\\,d\\phi\\,d\\theta$", why: "use the spherical volume element" },
        { do: "Integrate in $\\rho$", result: "$\\int_0^2\\rho^2\\,d\\rho=\\dfrac83$", why: "power rule" },
        { do: "Integrate in $\\phi$", result: "$\\int_0^\\pi\\sin\\phi\\,d\\phi=2$", why: "the antiderivative is $-\\cos\\phi$" },
        { do: "Integrate in $\\theta$", result: "$2\\pi$", why: "the interval length is $2\\pi$" },
        { do: "Multiply the factors", result: "$\\dfrac83\\cdot2\\cdot2\\pi=\\dfrac{32\\pi}{3}$", why: "the integrand separates" }
      ],
      verify: "The standard formula $4\\pi R^3/3$ with $R=2$ gives $32\\pi/3$, so the setup is consistent.",
      answer: "$\\dfrac{32\\pi}{3}$ cubic units.",
      connects: "The factor $\\rho^2\\sin\\phi$ is the spherical Jacobian that makes shell volume correct."
    },
    practice: [
      { problem: "Convert $(\\rho,\\phi,\\theta)=(4,\\pi/3,\\pi/6)$ to rectangular coordinates.", steps: [
        { do: "Compute $x$", result: "$x=4\\sin(\\pi/3)\\cos(\\pi/6)$", why: "use the spherical $x$ formula" },
        { do: "Simplify $x$", result: "$x=4\\cdot\\dfrac{\\sqrt3}{2}\\cdot\\dfrac{\\sqrt3}{2}=3$", why: "multiply the exact trig values" },
        { do: "Compute $y$", result: "$y=4\\sin(\\pi/3)\\sin(\\pi/6)$", why: "use the spherical $y$ formula" },
        { do: "Simplify $y$", result: "$y=4\\cdot\\dfrac{\\sqrt3}{2}\\cdot\\dfrac12=\\sqrt3$", why: "multiply the factors" },
        { do: "Compute $z$", result: "$z=4\\cos(\\pi/3)=2$", why: "height comes from the polar angle" }
      ], answer: "$(x,y,z)=(3,\\sqrt3,2)$." },
      { problem: "Convert $(x,y,z)=(0,3,4)$ to spherical coordinates.", steps: [
        { do: "Compute $\\rho$", result: "$\\rho=\\sqrt{0^2+3^2+4^2}=5$", why: "distance from the origin" },
        { do: "Use the $z$ relation", result: "$\\cos\\phi=z/\\rho=4/5$", why: "$z=\\rho\\cos\\phi$" },
        { do: "Solve for $\\phi$", result: "$\\phi=\\arccos(4/5)$", why: "the point is above the $xy$-plane" },
        { do: "Read the $xy$ angle", result: "$\\theta=\\pi/2$", why: "$x=0$ and $y>0$" },
        { do: "State the coordinate triple", result: "$(5,\\arccos(4/5),\\pi/2)$", why: "combine distance and angles" }
      ], answer: "$(\\rho,\\phi,\\theta)=(5,\\arccos(4/5),\\pi/2)$." },
      { problem: "Find the volume inside $\\rho\\le3$ above the $xy$-plane.", steps: [
        { do: "Set radial bounds", result: "$0\\le\\rho\\le3$", why: "the ball radius is $3$" },
        { do: "Set $\\phi$ bounds", result: "$0\\le\\phi\\le\\pi/2$", why: "above the $xy$-plane means $z\\ge0$" },
        { do: "Set $\\theta$ bounds", result: "$0\\le\\theta\\le2\\pi$", why: "all directions around are included" },
        { do: "Write the integral", result: "$\\int_0^{2\\pi}\\int_0^{\\pi/2}\\int_0^3\\rho^2\\sin\\phi\\,d\\rho\\,d\\phi\\,d\\theta$", why: "use spherical volume" },
        { do: "Evaluate factors", result: "$9\\cdot1\\cdot2\\pi=18\\pi$", why: "$\\int_0^3\\rho^2d\\rho=9$ and $\\int_0^{\\pi/2}\\sin\\phi d\\phi=1$" }
      ], answer: "$18\\pi$ cubic units." },
      { problem: "Compute $\\iiint_B \\rho^2\\,dV$ over the ball $\\rho\\le2$.", steps: [
        { do: "Insert $dV$", result: "$\\int_0^{2\\pi}\\int_0^\\pi\\int_0^2 \\rho^4\\sin\\phi\\,d\\rho\\,d\\phi\\,d\\theta$", why: "multiply the integrand $\\rho^2$ by the Jacobian $\\rho^2\\sin\\phi$" },
        { do: "Integrate in $\\rho$", result: "$\\int_0^2\\rho^4\\,d\\rho=\\dfrac{32}{5}$", why: "power rule" },
        { do: "Integrate in $\\phi$", result: "$2$", why: "$\\int_0^\\pi\\sin\\phi\\,d\\phi=2$" },
        { do: "Integrate in $\\theta$", result: "$2\\pi$", why: "full rotation" },
        { do: "Multiply", result: "$\\dfrac{32}{5}\\cdot2\\cdot2\\pi=\\dfrac{128\\pi}{5}$", why: "the factors separate" }
      ], answer: "$\\dfrac{128\\pi}{5}$." },
      { problem: "A 3-D sensor sector has $9\\le\\rho\\le10$, $0\\le\\phi\\le0.1$, $0\\le\\theta\\le0.2$. Approximate the volume using $\\rho\\approx9.5$ and $\\sin\\phi\\approx0.05$.", steps: [
        { do: "Use the spherical volume approximation", result: "$\\rho^2\\sin\\phi\\,\\Delta\\rho\\,\\Delta\\phi\\,\\Delta\\theta$", why: "small bins use the local Jacobian" },
        { do: "Substitute $\\rho$", result: "$9.5^2\\sin\\phi\\,\\Delta\\rho\\,\\Delta\\phi\\,\\Delta\\theta$", why: "use the midpoint radius" },
        { do: "Substitute $\\sin\\phi$", result: "$90.25\\cdot0.05\\cdot\\Delta\\rho\\,\\Delta\\phi\\,\\Delta\\theta$", why: "use the provided angle approximation" },
        { do: "Substitute bin widths", result: "$90.25\\cdot0.05\\cdot1\\cdot0.1\\cdot0.2$", why: "the widths are $1$, $0.1$, and $0.2$" },
        { do: "Multiply", result: "$0.09025$", why: "combine the factors" }
      ], answer: "The approximate sector volume is $0.09025$ cubic units." }
    ],
    applications: [
      { title: "Volume of balls and shells", background: "Physics and geometry use spherical shells because radius is the natural variable around a center.", numbers: "A shell from $\\rho=4$ to $\\rho=5$ has volume $\\frac{4\\pi}{3}(125-64)=\\frac{244\\pi}{3}\\approx255.5$." },
      { title: "Radial probability densities", background: "Isotropic models assign equal behavior in all directions, so only radius matters after integrating angles.", numbers: "A constant density $0.01$ inside radius $2$ has total mass $0.01\\cdot32\\pi/3\\approx0.335$." },
      { title: "3-D vision range bins", background: "Depth sensors often organize returns by range and viewing angles.", numbers: "At $\\rho=20$ and $\\phi=\\pi/2$, a bin with widths $0.5$, $0.02$, $0.03$ has volume about $400\\cdot1\\cdot0.5\\cdot0.02\\cdot0.03=0.12$." },
      { title: "Radiation falloff", background: "Energy from a point source spreads over spherical area, explaining inverse-square laws.", numbers: "A sphere of radius $10$ has area $4\\pi100=400\\pi$, so power $1000$ spreads to intensity $1000/(400\\pi)\\approx0.796$." },
      { title: "Spherical embeddings", background: "Some ML embeddings normalize vectors to a sphere so direction matters more than length.", numbers: "Vector $(3,4,0)$ normalizes to $(0.6,0.8,0)$ because its radius is $5$." },
      { title: "Volumetric rendering", background: "Rendering rays sample density through spherical or radial volumes when scenes are centered around cameras or objects.", numbers: "A radial density $0.2$ over shell volume $12$ contributes mass $0.2\\cdot12=2.4$." }
    ],
    applicationsClose: "Spherical coordinates turn center-out geometry into direct radius and angle accounting.",
    takeaways: ["Spherical coordinates use radius $\\rho$, polar angle $\\phi$, and azimuth $\\theta$.", "The volume element is $\\rho^2\\sin\\phi\\,d\\rho\\,d\\phi\\,d\\theta$.", "They shine for balls, shells, cones, and radially symmetric functions."]
  },

  "math-02-32": {
    id: "math-02-32",
    title: "Vector fields",
    tagline: "A vector field attaches a direction and strength to every point in space.",
    connections: { buildsOn: ["vectors", "multivariable functions", "partial derivatives"], leadsTo: ["divergence", "curl", "line integrals", "flux"], usedWith: ["gradients", "parametric curves", "level sets", "differential operators"] },
    motivation: "<p>You already use single vectors to describe a push, velocity, or step. But wind, fluid flow, and gradients change from place to place.</p><p>A <b>vector field</b> is the moving map: at each point, it tells which way something points and how strongly. Once you can read the field, divergence, curl, line integrals, and flux become natural measurements of it.</p>",
    definition: "<p>A vector field in the plane is a function $$\\mathbf F(x,y)=\\langle P(x,y),Q(x,y)\\rangle,$$ where $P$ is the horizontal component and $Q$ is the vertical component. In space, $$\\mathbf F(x,y,z)=\\langle P,Q,R\\rangle.$$ A gradient field has the special form $\\nabla f=\\langle f_x,f_y\\rangle$ or $\\langle f_x,f_y,f_z\\rangle$, so its vectors point in the direction of fastest increase of $f$.</p><p><b>Assumptions that matter:</b> know the domain where the field is defined, track component order, and remember that vectors are attached to points even when the same arrow shape appears elsewhere.</p>",
    worked: {
      problem: "For $\\mathbf F(x,y)=\\langle y,2x\\rangle$, compute the vectors at $(1,3)$ and $(-2,4)$ and their magnitudes.",
      skills: ["evaluating vector fields", "components", "magnitudes"],
      strategy: "Substitute each point into both components, then use the length formula.",
      steps: [
        { do: "Substitute $(1,3)$ into the first component", result: "$P(1,3)=3$", why: "$P=y$" },
        { do: "Substitute $(1,3)$ into the second component", result: "$Q(1,3)=2$", why: "$Q=2x$" },
        { do: "Write the first vector", result: "$\\mathbf F(1,3)=\\langle3,2\\rangle$", why: "combine horizontal and vertical components" },
        { do: "Compute its magnitude", result: "$\\sqrt{3^2+2^2}=\\sqrt{13}$", why: "use the Euclidean length formula" },
        { do: "Substitute $(-2,4)$", result: "$\\mathbf F(-2,4)=\\langle4,-4\\rangle$", why: "$y=4$ and $2x=-4$" },
        { do: "Compute the second magnitude", result: "$\\sqrt{4^2+(-4)^2}=4\\sqrt2$", why: "sum squared components" }
      ],
      verify: "At points with larger $|x|$ or $|y|$, this field tends to have longer arrows, which matches the computed magnitudes.",
      answer: "$\\mathbf F(1,3)=\\langle3,2\\rangle$ with magnitude $\\sqrt{13}$; $\\mathbf F(-2,4)=\\langle4,-4\\rangle$ with magnitude $4\\sqrt2$.",
      connects: "A vector field is just a vector-valued function evaluated point by point."
    },
    practice: [
      { problem: "Evaluate $\\mathbf G(x,y)=\\langle x-y,x+y\\rangle$ at $(4,1)$ and find its magnitude.", steps: [
        { do: "Evaluate the first component", result: "$4-1=3$", why: "use $P=x-y$" },
        { do: "Evaluate the second component", result: "$4+1=5$", why: "use $Q=x+y$" },
        { do: "Write the vector", result: "$\\mathbf G(4,1)=\\langle3,5\\rangle$", why: "combine components in order" },
        { do: "Square the components", result: "$3^2+5^2=34$", why: "magnitude uses sum of squares" },
        { do: "Take the square root", result: "$\\sqrt{34}$", why: "length is the square root of squared length" }
      ], answer: "$\\mathbf G(4,1)=\\langle3,5\\rangle$ and $|\\mathbf G(4,1)|=\\sqrt{34}$." },
      { problem: "For $\\mathbf H(x,y,z)=\\langle z,x,2y\\rangle$, evaluate at $(1,-3,5)$.", steps: [
        { do: "Read the first component", result: "$z=5$", why: "the first component is $z$" },
        { do: "Read the second component", result: "$x=1$", why: "the second component is $x$" },
        { do: "Compute the third component", result: "$2y=2(-3)=-6$", why: "substitute $y=-3$" },
        { do: "Write the vector", result: "$\\langle5,1,-6\\rangle$", why: "keep component order" },
        { do: "Compute squared length", result: "$25+1+36=62$", why: "sum squared components" }
      ], answer: "$\\mathbf H(1,-3,5)=\\langle5,1,-6\\rangle$ with magnitude $\\sqrt{62}$." },
      { problem: "Show that $\\mathbf F(x,y)=\\langle2x,2y\\rangle$ is the gradient of $f(x,y)=x^2+y^2$.", steps: [
        { do: "Differentiate with respect to $x$", result: "$f_x=2x$", why: "treat $y$ as constant" },
        { do: "Differentiate with respect to $y$", result: "$f_y=2y$", why: "treat $x$ as constant" },
        { do: "Form the gradient", result: "$\\nabla f=\\langle2x,2y\\rangle$", why: "gradient collects partial derivatives" },
        { do: "Compare with $\\mathbf F$", result: "$\\nabla f=\\mathbf F$", why: "the components match" },
        { do: "Interpret at $(3,4)$", result: "$\\mathbf F(3,4)=\\langle6,8\\rangle$", why: "the field points outward from the origin" }
      ], answer: "Yes. $\\mathbf F=\\nabla(x^2+y^2)$." },
      { problem: "For the rotational field $\\mathbf R(x,y)=\\langle-y,x\\rangle$, evaluate at $(2,0)$, $(0,2)$, and $(-2,0)$.", steps: [
        { do: "Evaluate at $(2,0)$", result: "$\\mathbf R(2,0)=\\langle0,2\\rangle$", why: "$-y=0$ and $x=2$" },
        { do: "Evaluate at $(0,2)$", result: "$\\mathbf R(0,2)=\\langle-2,0\\rangle$", why: "$-y=-2$ and $x=0$" },
        { do: "Evaluate at $(-2,0)$", result: "$\\mathbf R(-2,0)=\\langle0,-2\\rangle$", why: "$-y=0$ and $x=-2$" },
        { do: "Compare to radius vectors", result: "each arrow is perpendicular to its radius", why: "the dot product with $\\langle x,y\\rangle$ is $-xy+xy=0$" },
        { do: "Read the motion", result: "counterclockwise circulation", why: "the arrows follow increasing angle" }
      ], answer: "The vectors are $\\langle0,2\\rangle$, $\\langle-2,0\\rangle$, and $\\langle0,-2\\rangle$, forming counterclockwise rotation." },
      { problem: "A parameter update uses field $\\mathbf U(w,b)=\\langle-0.1w,-0.2b\\rangle$. Starting at $(w,b)=(5,-3)$, compute the update vector and the new point after one step.", steps: [
        { do: "Evaluate the first component", result: "$-0.1(5)=-0.5$", why: "substitute $w=5$" },
        { do: "Evaluate the second component", result: "$-0.2(-3)=0.6$", why: "substitute $b=-3$" },
        { do: "Write the update vector", result: "$\\langle-0.5,0.6\\rangle$", why: "combine components" },
        { do: "Add to the current point", result: "$(5,-3)+(-0.5,0.6)$", why: "an update vector changes the parameter point" },
        { do: "Compute the new point", result: "$(4.5,-2.4)$", why: "add component by component" }
      ], answer: "The update vector is $\\langle-0.5,0.6\\rangle$, and the new point is $(4.5,-2.4)$." }
    ],
    applications: [
      { title: "Gradient descent fields", background: "Optimization views every parameter setting as having a direction of steepest loss change.", numbers: "For $L(w,b)=w^2+2b^2$, $\\nabla L(3,-1)=\\langle6,-4\\rangle$, so descent direction is $\\langle-6,4\\rangle$." },
      { title: "Optical flow", background: "Computer vision estimates a velocity vector at each pixel to describe motion between frames.", numbers: "A pixel moving $3$ right and $-1$ down has flow vector $\\langle3,-1\\rangle$ and speed $\\sqrt{10}\\approx3.16$." },
      { title: "Wind maps", background: "Weather maps attach wind velocity to each location, exactly the vector-field idea.", numbers: "A wind vector $\\langle6,8\\rangle$ m/s has speed $10$ m/s." },
      { title: "Robotics force fields", background: "Potential-field planners push robots away from obstacles and toward goals.", numbers: "At a point, attraction $\\langle4,0\\rangle$ plus repulsion $\\langle-1,2\\rangle$ gives net field $\\langle3,2\\rangle$." },
      { title: "Recommendation embedding directions", background: "A model can assign a vector direction showing how a user embedding should move to reduce loss.", numbers: "If the update is $\\langle0.03,-0.04\\rangle$, its size is $0.05$, since $0.03^2+0.04^2=0.0025$." },
      { title: "Fluid velocity simulation", background: "Simulators store velocity at grid points and update particles by following those arrows.", numbers: "Velocity $\\langle2,-0.5\\rangle$ for $0.1$ s moves a particle by $\\langle0.2,-0.05\\rangle$." }
    ],
    applicationsClose: "A vector field is the common language for motion, force, gradients, and local directions in data space.",
    takeaways: ["A vector field assigns a vector to each point in a domain.", "Components are ordinary scalar functions evaluated at the point.", "Gradient fields are vector fields built from partial derivatives of a scalar function."]
  },

  "math-02-33": {
    id: "math-02-33",
    title: "Divergence",
    tagline: "Divergence measures whether a vector field behaves like a source or a sink at a point.",
    connections: { buildsOn: ["vector fields", "partial derivatives", "local linear change"], leadsTo: ["flux", "the divergence theorem", "conservation laws"], usedWith: ["gradient", "Laplacian", "volume expansion", "flow fields"] },
    motivation: "<p>Imagine tiny dust particles near a point in a flow. If they spread apart, the point acts like a source. If they squeeze together, it acts like a sink.</p><p><b>Divergence</b> turns that visual instinct into a number: positive means net outward expansion, negative means net inward compression, and zero means locally volume-preserving.</p>",
    definition: "<p>For a three-dimensional vector field $\\mathbf F=\\langle P,Q,R\\rangle$, the <b>divergence</b> is $$\\nabla\\cdot\\mathbf F=\\dfrac{\\partial P}{\\partial x}+\\dfrac{\\partial Q}{\\partial y}+\\dfrac{\\partial R}{\\partial z}.$$ In two dimensions, use $P_x+Q_y$. The formula comes from measuring net outward flow through the sides of a tiny box; the right face minus left face contributes $P_x\\,\\Delta x\\Delta y\\Delta z$, and the other directions add the matching partial derivatives.</p><p><b>Assumptions that matter:</b> components should have the needed partial derivatives near the point, and divergence is local; it describes infinitesimal source strength, not the full global flow by itself.</p>",
    worked: {
      problem: "Compute the divergence of $\\mathbf F(x,y,z)=\\langle x^2y,3yz,z^2\\rangle$ at $(2,1,3)$.",
      skills: ["partial derivatives", "vector fields", "source strength"],
      strategy: "Differentiate each component only with respect to its matching coordinate, then substitute the point.",
      steps: [
        { do: "Differentiate the first component with respect to $x$", result: "$P_x=2xy$", why: "$P=x^2y$ and $y$ is constant" },
        { do: "Differentiate the second component with respect to $y$", result: "$Q_y=3z$", why: "$Q=3yz$ and $z$ is constant" },
        { do: "Differentiate the third component with respect to $z$", result: "$R_z=2z$", why: "$R=z^2$" },
        { do: "Add the matching partials", result: "$\\nabla\\cdot\\mathbf F=2xy+3z+2z$", why: "divergence is the trace of local component changes" },
        { do: "Substitute $(2,1,3)$", result: "$2(2)(1)+3(3)+2(3)$", why: "evaluate at the point" },
        { do: "Simplify", result: "$4+9+6=19$", why: "combine source contributions" }
      ],
      verify: "The positive value says a tiny volume near $(2,1,3)$ is expanding under the field.",
      answer: "$\\nabla\\cdot\\mathbf F(2,1,3)=19$.",
      connects: "Divergence is local net outflow per unit volume."
    },
    practice: [
      { problem: "Compute $\\nabla\\cdot\\langle 2x,3y\\rangle$.", steps: [
        { do: "Identify $P$", result: "$P=2x$", why: "the first component matches the $x$ direction" },
        { do: "Differentiate $P$ with respect to $x$", result: "$P_x=2$", why: "use the matching coordinate" },
        { do: "Identify $Q$", result: "$Q=3y$", why: "the second component matches the $y$ direction" },
        { do: "Differentiate $Q$ with respect to $y$", result: "$Q_y=3$", why: "use the matching coordinate" },
        { do: "Add", result: "$2+3=5$", why: "two-dimensional divergence is $P_x+Q_y$" }
      ], answer: "The divergence is $5$." },
      { problem: "Compute the divergence of $\\mathbf F=\\langle-y,x\\rangle$.", steps: [
        { do: "Set $P$", result: "$P=-y$", why: "first component" },
        { do: "Compute $P_x$", result: "$0$", why: "$-y$ does not depend on $x$" },
        { do: "Set $Q$", result: "$Q=x$", why: "second component" },
        { do: "Compute $Q_y$", result: "$0$", why: "$x$ does not depend on $y$" },
        { do: "Add", result: "$0+0=0$", why: "rotation need not create sources or sinks" }
      ], answer: "The divergence is $0$." },
      { problem: "For $\\mathbf F=\\langle xz,yz,xy\\rangle$, compute divergence at $(1,2,3)$.", steps: [
        { do: "Compute $P_x$", result: "$z$", why: "differentiate $xz$ with respect to $x$" },
        { do: "Compute $Q_y$", result: "$z$", why: "differentiate $yz$ with respect to $y$" },
        { do: "Compute $R_z$", result: "$0$", why: "$xy$ does not depend on $z$" },
        { do: "Add", result: "$2z$", why: "$z+z+0=2z$" },
        { do: "Substitute $z=3$", result: "$6$", why: "only $z$ remains" }
      ], answer: "The divergence at $(1,2,3)$ is $6$." },
      { problem: "Find $a$ so $\\mathbf F=\\langle ax,2y,-5z\\rangle$ has zero divergence everywhere.", steps: [
        { do: "Compute $P_x$", result: "$a$", why: "differentiate $ax$" },
        { do: "Compute $Q_y$", result: "$2$", why: "differentiate $2y$" },
        { do: "Compute $R_z$", result: "$-5$", why: "differentiate $-5z$" },
        { do: "Add the terms", result: "$a+2-5=a-3$", why: "divergence sums matching partials" },
        { do: "Set to zero", result: "$a-3=0$", why: "zero divergence is required everywhere" },
        { do: "Solve", result: "$a=3$", why: "add $3$ to both sides" }
      ], answer: "$a=3$." },
      { problem: "A learned flow in two variables is $\\mathbf v(x,y)=\\langle0.4x,-0.1y\\rangle$. Find the local area growth rate.", steps: [
        { do: "Compute the $x$ derivative", result: "$\\partial(0.4x)/\\partial x=0.4$", why: "horizontal expansion rate" },
        { do: "Compute the $y$ derivative", result: "$\\partial(-0.1y)/\\partial y=-0.1$", why: "vertical compression rate" },
        { do: "Add the rates", result: "$0.4+(-0.1)$", why: "divergence combines directional volume changes" },
        { do: "Simplify", result: "$0.3$", why: "net expansion remains positive" },
        { do: "Interpret", result: "area grows at about $30\\%$ per unit time locally", why: "positive divergence means expansion" }
      ], answer: "The local area growth rate is $0.3$ per unit time." }
    ],
    applications: [
      { title: "Fluid source detection", background: "Engineers use divergence to locate where fluid is being added or removed from a flow.", numbers: "For $\\mathbf v=\\langle0.2x,0.1y,0.3z\\rangle$, divergence is $0.6$, so a $2$ m$^3$ small volume expands at about $1.2$ m$^3$/s." },
      { title: "Incompressible simulation", background: "Many graphics solvers enforce nearly zero divergence so water does not visibly gain or lose volume.", numbers: "If grid derivatives are $0.7$, $-0.4$, and $-0.3$, their sum is $0$, so the cell is locally incompressible." },
      { title: "Probability flow models", background: "Continuous normalizing flows track density changes through the divergence of a velocity field.", numbers: "If divergence is $-0.5$ for $2$ seconds, log density changes by about $-\\int \\nabla\\cdot v\\,dt=1.0$." },
      { title: "Crowd motion", background: "Crowd analytics can use divergence to tell whether people are dispersing or bottlenecking.", numbers: "A local field with $P_x=-0.2$ and $Q_y=-0.4$ has divergence $-0.6$, indicating compression." },
      { title: "Heat and diffusion intuition", background: "The Laplacian is divergence of the gradient, measuring net outflow of a gradient field.", numbers: "For $f=x^2+y^2$, $\\nabla f=\\langle2x,2y\\rangle$ and $\\nabla\\cdot\\nabla f=4$." },
      { title: "Robotics formation control", background: "A vector field can spread robots out or bring them together; divergence quantifies that tendency.", numbers: "Field $\\langle-x,-y\\rangle$ has divergence $-2$, so nearby agents are pulled inward." }
    ],
    applicationsClose: "Divergence is a small local sum with a big interpretation: expansion, compression, or conservation.",
    takeaways: ["Divergence sums the matching partial derivatives of a vector field.", "Positive divergence means local source-like expansion; negative means sink-like compression.", "Zero divergence often signals volume-preserving or incompressible flow."]
  },

  "math-02-34": {
    id: "math-02-34",
    title: "Curl",
    tagline: "Curl measures the local tendency of a vector field to rotate.",
    connections: { buildsOn: ["vector fields", "partial derivatives", "cross products"], leadsTo: ["Stokes' theorem", "circulation", "conservative fields"], usedWith: ["line integrals", "orientation", "normal vectors", "rotational flow"] },
    motivation: "<p>Divergence asks whether flow spreads out. Another question is just as natural: does the flow make a tiny paddle wheel spin?</p><p><b>Curl</b> measures local rotation. In the plane it gives a single signed number; in space it gives a vector whose direction is the rotation axis and whose magnitude measures spin strength.</p>",
    definition: "<p>For $\\mathbf F=\\langle P,Q,R\\rangle$, the <b>curl</b> is $$\\nabla\\times\\mathbf F=\\left\\langle R_y-Q_z,\\;P_z-R_x,\\;Q_x-P_y\\right\\rangle.$$ In two dimensions, the scalar curl is $Q_x-P_y$, the $z$-component of the three-dimensional curl of $\\langle P,Q,0\\rangle$. The formula comes from comparing circulation around the tiny coordinate rectangles perpendicular to each axis.</p><p><b>Assumptions that matter:</b> the relevant partial derivatives should exist and be continuous nearby; the sign depends on orientation; and zero curl on a simply connected region is the test that often leads to a potential function.</p>",
    worked: {
      problem: "Compute the curl of $\\mathbf F(x,y,z)=\\langle yz,xz,xy\\rangle$.",
      skills: ["partial derivatives", "curl formula", "component order"],
      strategy: "Compute each curl component separately and keep the subtraction order steady.",
      steps: [
        { do: "Identify $P,Q,R$", result: "$P=yz$, $Q=xz$, $R=xy$", why: "name the components before differentiating" },
        { do: "Compute $R_y$", result: "$x$", why: "$R=xy$ and differentiating with respect to $y$ leaves $x$" },
        { do: "Compute $Q_z$", result: "$x$", why: "$Q=xz$ and differentiating with respect to $z$ leaves $x$" },
        { do: "Compute the first curl component", result: "$R_y-Q_z=x-x=0$", why: "the two contributions match" },
        { do: "Compute the second component", result: "$P_z-R_x=y-y=0$", why: "$P=yz$ gives $P_z=y$ and $R=xy$ gives $R_x=y$" },
        { do: "Compute the third component", result: "$Q_x-P_y=z-z=0$", why: "$Q=xz$ gives $Q_x=z$ and $P=yz$ gives $P_y=z$" },
        { do: "Assemble the curl", result: "$\\nabla\\times\\mathbf F=\\langle0,0,0\\rangle$", why: "all three components vanish" }
      ],
      verify: "This field is $\\nabla(xyz)$, and gradient fields have zero curl where the second partial derivatives agree.",
      answer: "$\\nabla\\times\\mathbf F=\\langle0,0,0\\rangle$.",
      connects: "Curl detects rotation; this gradient field has no local rotational twist."
    },
    practice: [
      { problem: "Find the scalar curl of $\\mathbf F(x,y)=\\langle-y,x\\rangle$.", steps: [
        { do: "Identify $P$", result: "$P=-y$", why: "first component" },
        { do: "Identify $Q$", result: "$Q=x$", why: "second component" },
        { do: "Compute $Q_x$", result: "$1$", why: "differentiate $x$ with respect to $x$" },
        { do: "Compute $P_y$", result: "$-1$", why: "differentiate $-y$ with respect to $y$" },
        { do: "Subtract", result: "$Q_x-P_y=1-(-1)=2$", why: "two-dimensional curl is signed spin" }
      ], answer: "The scalar curl is $2$." },
      { problem: "Find the scalar curl of $\\mathbf F=\\langle x^2, y^2\\rangle$.", steps: [
        { do: "Set $P$", result: "$P=x^2$", why: "horizontal component" },
        { do: "Set $Q$", result: "$Q=y^2$", why: "vertical component" },
        { do: "Compute $Q_x$", result: "$0$", why: "$y^2$ does not depend on $x$" },
        { do: "Compute $P_y$", result: "$0$", why: "$x^2$ does not depend on $y$" },
        { do: "Subtract", result: "$0-0=0$", why: "there is no local rotational tendency" }
      ], answer: "The scalar curl is $0$." },
      { problem: "Compute $\\nabla\\times\\langle0,0,x^2+y^2\\rangle$.", steps: [
        { do: "Identify components", result: "$P=0$, $Q=0$, $R=x^2+y^2$", why: "name each component" },
        { do: "Compute the first component", result: "$R_y-Q_z=2y-0=2y$", why: "differentiate $R$ with respect to $y$" },
        { do: "Compute the second component", result: "$P_z-R_x=0-2x=-2x$", why: "differentiate $R$ with respect to $x$" },
        { do: "Compute the third component", result: "$Q_x-P_y=0-0=0$", why: "both components are zero" },
        { do: "Assemble", result: "$\\langle2y,-2x,0\\rangle$", why: "combine curl components" }
      ], answer: "$\\nabla\\times\\mathbf F=\\langle2y,-2x,0\\rangle$." },
      { problem: "For $\\mathbf F=\\langle ay,3x\\rangle$, find $a$ so the scalar curl is zero.", steps: [
        { do: "Identify $P$", result: "$P=ay$", why: "first component" },
        { do: "Identify $Q$", result: "$Q=3x$", why: "second component" },
        { do: "Compute $Q_x$", result: "$3$", why: "differentiate $3x$" },
        { do: "Compute $P_y$", result: "$a$", why: "differentiate $ay$" },
        { do: "Set scalar curl to zero", result: "$3-a=0$", why: "curl is $Q_x-P_y$" },
        { do: "Solve", result: "$a=3$", why: "move $a$ to the other side" }
      ], answer: "$a=3$." },
      { problem: "A 2-D velocity field near an object is $\\mathbf v=\\langle-0.6y,0.6x\\rangle$. Find its scalar curl and interpret the spin.", steps: [
        { do: "Set $P$", result: "$P=-0.6y$", why: "horizontal component" },
        { do: "Set $Q$", result: "$Q=0.6x$", why: "vertical component" },
        { do: "Compute $Q_x$", result: "$0.6$", why: "differentiate with respect to $x$" },
        { do: "Compute $P_y$", result: "$-0.6$", why: "differentiate with respect to $y$" },
        { do: "Subtract", result: "$0.6-(-0.6)=1.2$", why: "scalar curl measures signed rotation" },
        { do: "Interpret the sign", result: "counterclockwise", why: "positive scalar curl follows the right-hand orientation" }
      ], answer: "The scalar curl is $1.2$, indicating counterclockwise local spin." }
    ],
    applications: [
      { title: "Vorticity in fluids", background: "Fluid mechanics calls curl of velocity vorticity, a key diagnostic for swirling flow.", numbers: "For $\\mathbf v=\\langle-2y,2x\\rangle$, scalar curl is $2-(-2)=4$." },
      { title: "Detecting rotation in optical flow", background: "Video analysis can distinguish expansion from swirl by computing divergence and curl of motion vectors.", numbers: "If $Q_x=0.7$ and $P_y=-0.4$, curl is $1.1$, a strong counterclockwise signal." },
      { title: "Electromagnetism", background: "Maxwell's equations use curl to relate rotating electric and magnetic fields.", numbers: "If a magnetic field has $R_y=5$ and $Q_z=2$ in one component, that curl component is $3$." },
      { title: "Conservative-force checks", background: "A force field with zero curl on a simple region often comes from potential energy.", numbers: "For $\\mathbf F=\\langle2x,2y\\rangle$, $Q_x-P_y=0-0=0$, so it is compatible with potential $x^2+y^2$." },
      { title: "Robotics navigation", background: "Curl helps detect circulating vector fields that could make agents orbit instead of reaching a goal.", numbers: "Field $\\langle-y,x\\rangle$ has curl $2$, so a robot may circle the origin." },
      { title: "Weather rotation", background: "Meteorologists use curl-like vorticity to analyze rotating storms and shear.", numbers: "Wind derivatives $\\partial v/\\partial x=0.004$ s$^{-1}$ and $\\partial u/\\partial y=-0.001$ s$^{-1}$ give vorticity $0.005$ s$^{-1}$." }
    ],
    applicationsClose: "Curl is the mathematical paddle wheel: it turns local rotational tendency into components you can compute.",
    takeaways: ["Curl measures local rotation of a vector field.", "In two dimensions the scalar curl is $Q_x-P_y$.", "Zero curl is a key signal for conservative fields on simple domains."]
  },

  "math-02-35": {
    id: "math-02-35",
    title: "Line integrals",
    tagline: "A line integral adds a scalar or vector-field contribution along a curve.",
    connections: { buildsOn: ["parametric curves", "vector fields", "single-variable integration"], leadsTo: ["Green's theorem", "Stokes' theorem", "path independence"], usedWith: ["arc length", "work", "circulation", "conservative fields"] },
    motivation: "<p>You already know how to integrate over an interval. But sometimes the path bends through the plane or space, and the quantity you add depends on where the path goes.</p><p>A <b>line integral</b> lets an integral follow a curve. For scalar fields it accumulates weighted length; for vector fields it accumulates work or circulation along the direction of travel.</p>",
    definition: "<p>For a scalar field $f$ along a curve $\\mathbf r(t)$, $a\\le t\\le b$, $$\\int_C f\\,ds=\\int_a^b f(\\mathbf r(t))\\,|\\mathbf r'(t)|\\,dt.$$ For a vector field $\\mathbf F$, $$\\int_C \\mathbf F\\cdot d\\mathbf r=\\int_a^b \\mathbf F(\\mathbf r(t))\\cdot\\mathbf r'(t)\\,dt.$$ The factor $|\\mathbf r'(t)|$ converts parameter change into length, while $\\mathbf F\\cdot\\mathbf r'$ keeps only the component of the field along the motion.</p><p><b>Assumptions that matter:</b> the curve should be piecewise smooth, orientation matters for vector line integrals, and the field must be defined on the path.</p>",
    worked: {
      problem: "Compute $\\int_C \\mathbf F\\cdot d\\mathbf r$ for $\\mathbf F(x,y)=\\langle y,x\\rangle$ along $\\mathbf r(t)=\\langle t,t^2\\rangle$, $0\\le t\\le2$.",
      skills: ["parameterization", "dot products", "single-variable integration"],
      strategy: "Pull the field onto the path, dot with velocity, then integrate in $t$.",
      steps: [
        { do: "Substitute the path into the field", result: "$\\mathbf F(\\mathbf r(t))=\\langle t^2,t\\rangle$", why: "$x=t$ and $y=t^2$" },
        { do: "Differentiate the path", result: "$\\mathbf r'(t)=\\langle1,2t\\rangle$", why: "velocity gives the direction of travel" },
        { do: "Take the dot product", result: "$\\langle t^2,t\\rangle\\cdot\\langle1,2t\\rangle=t^2+2t^2$", why: "multiply matching components" },
        { do: "Simplify the integrand", result: "$3t^2$", why: "combine like terms" },
        { do: "Set up the integral", result: "$\\int_0^2 3t^2\\,dt$", why: "integrate over the parameter interval" },
        { do: "Integrate", result: "$[t^3]_0^2=8$", why: "the antiderivative of $3t^2$ is $t^3$" }
      ],
      verify: "The dot product is nonnegative along the path, so a positive work value is reasonable.",
      answer: "$8$.",
      connects: "A vector line integral measures how much the field helps along the chosen path."
    },
    practice: [
      { problem: "Compute $\\int_C x\\,ds$ for the line segment $\\mathbf r(t)=\\langle t,0\\rangle$, $0\\le t\\le3$.", steps: [
        { do: "Substitute the path", result: "$x=t$", why: "the scalar field is $f=x$" },
        { do: "Differentiate the path", result: "$\\mathbf r'(t)=\\langle1,0\\rangle$", why: "find speed" },
        { do: "Compute speed", result: "$|\\mathbf r'(t)|=1$", why: "the path is traversed at unit speed" },
        { do: "Write the scalar line integral", result: "$\\int_0^3 t\\cdot1\\,dt$", why: "use $f(\\mathbf r(t))|\\mathbf r'(t)|$" },
        { do: "Evaluate", result: "$\\dfrac{9}{2}$", why: "$\\int_0^3 t\\,dt=9/2$" }
      ], answer: "$\\dfrac92$." },
      { problem: "Compute $\\int_C \\langle1,2\\rangle\\cdot d\\mathbf r$ from $(0,0)$ to $(3,4)$ along the straight line.", steps: [
        { do: "Parameterize the line", result: "$\\mathbf r(t)=\\langle3t,4t\\rangle$, $0\\le t\\le1$", why: "move linearly from start to end" },
        { do: "Differentiate", result: "$\\mathbf r'(t)=\\langle3,4\\rangle$", why: "constant velocity" },
        { do: "Evaluate the field on the path", result: "$\\mathbf F=\\langle1,2\\rangle$", why: "the field is constant" },
        { do: "Take the dot product", result: "$\\langle1,2\\rangle\\cdot\\langle3,4\\rangle=11$", why: "work uses field along displacement" },
        { do: "Integrate", result: "$\\int_0^1 11\\,dt=11$", why: "the integrand is constant" }
      ], answer: "$11$." },
      { problem: "Compute $\\int_C \\mathbf F\\cdot d\\mathbf r$ for $\\mathbf F=\\langle -y,x\\rangle$ around the unit circle counterclockwise.", steps: [
        { do: "Parameterize the circle", result: "$\\mathbf r(t)=\\langle\\cos t,\\sin t\\rangle$, $0\\le t\\le2\\pi$", why: "counterclockwise unit circle" },
        { do: "Differentiate", result: "$\\mathbf r'(t)=\\langle-\\sin t,\\cos t\\rangle$", why: "tangent velocity" },
        { do: "Evaluate the field", result: "$\\mathbf F(\\mathbf r(t))=\\langle-\\sin t,\\cos t\\rangle$", why: "substitute $x=\\cos t$, $y=\\sin t$" },
        { do: "Dot with velocity", result: "$\\sin^2t+\\cos^2t=1$", why: "the field equals the unit tangent" },
        { do: "Integrate", result: "$\\int_0^{2\\pi}1\\,dt=2\\pi$", why: "one full rotation" }
      ], answer: "$2\\pi$." },
      { problem: "Compute $\\int_C y\\,ds$ along $\\mathbf r(t)=\\langle3t,4t\\rangle$, $0\\le t\\le1$.", steps: [
        { do: "Substitute into the scalar field", result: "$y=4t$", why: "the second coordinate is $4t$" },
        { do: "Differentiate the path", result: "$\\mathbf r'(t)=\\langle3,4\\rangle$", why: "find speed" },
        { do: "Compute speed", result: "$|\\mathbf r'(t)|=5$", why: "use the $3$-$4$-$5$ triangle" },
        { do: "Set up the integral", result: "$\\int_0^1 4t\\cdot5\\,dt$", why: "multiply field value by arc-length factor" },
        { do: "Evaluate", result: "$20\\cdot\\dfrac12=10$", why: "$\\int_0^1 t\\,dt=1/2$" }
      ], answer: "$10$." },
      { problem: "A parameter path is $\\mathbf r(t)=\\langle t,1-t\\rangle$, $0\\le t\\le1$, and gradient field $\\mathbf g=\\langle2x,2y\\rangle$. Compute the line integral.", steps: [
        { do: "Evaluate the field on the path", result: "$\\mathbf g(\\mathbf r(t))=\\langle2t,2-2t\\rangle$", why: "substitute $x=t$, $y=1-t$" },
        { do: "Differentiate the path", result: "$\\mathbf r'(t)=\\langle1,-1\\rangle$", why: "velocity along the update" },
        { do: "Dot the vectors", result: "$2t-(2-2t)=4t-2$", why: "measure field along the path" },
        { do: "Integrate", result: "$\\int_0^1(4t-2)\\,dt$", why: "use the parameter interval" },
        { do: "Evaluate", result: "$[2t^2-2t]_0^1=0$", why: "endpoint potential values match" }
      ], answer: "The line integral is $0$." }
    ],
    applications: [
      { title: "Mechanical work", background: "Physics defines work as force accumulated along a path, which is exactly a vector line integral.", numbers: "A constant force $\\langle5,0\\rangle$ over displacement $\\langle3,4\\rangle$ does work $5\\cdot3+0\\cdot4=15$ J." },
      { title: "Robot energy along a route", background: "A robot moving through terrain may pay energy based on location and direction.", numbers: "If resistance force along a $10$ m path averages $3$ N opposite motion, work cost is about $30$ J." },
      { title: "Circulation around loops", background: "Fluid circulation measures how much a velocity field pushes around a closed curve.", numbers: "For $\\langle-y,x\\rangle$ around radius $2$, the integral is $2\\pi r^2=8\\pi$." },
      { title: "Path-dependent losses", background: "Optimization trajectories can accumulate gradient information along their path through parameter space.", numbers: "A constant gradient $\\langle4,-1\\rangle$ over parameter change $\\langle0.5,2\\rangle$ contributes $2-2=0$." },
      { title: "Electric potential", background: "Voltage difference is a line integral of electric field, with sign convention depending on direction.", numbers: "A field $\\langle10,0\\rangle$ V/m over $0.2$ m in $x$ gives $2$ V of field integral." },
      { title: "Curve-weighted data summaries", background: "A scalar line integral can total a quantity sampled along a route, not over an area.", numbers: "Pollution concentration $6$ units/m along a $1.5$ km route gives total exposure $9$ unit-km." }
    ],
    applicationsClose: "Line integrals are ordinary accumulation taught to follow a curve and respect direction.",
    takeaways: ["Scalar line integrals use $f(\\mathbf r(t))|\\mathbf r'(t)|$.", "Vector line integrals use $\\mathbf F(\\mathbf r(t))\\cdot\\mathbf r'(t)$.", "Orientation matters for vector line integrals, especially around loops."]
  },

  "math-02-36": {
    id: "math-02-36",
    title: "Green's theorem",
    tagline: "Green's theorem turns circulation around a plane curve into curl across the region inside.",
    connections: { buildsOn: ["line integrals", "double integrals", "curl in two dimensions"], leadsTo: ["Stokes' theorem", "the divergence theorem", "area formulas"], usedWith: ["orientation", "closed curves", "planar regions", "partial derivatives"] },
    motivation: "<p>A line integral around a closed curve can be hard if the boundary has many pieces. But the boundary surrounds a region, and sometimes the inside tells the same story more simply.</p><p><b>Green's theorem</b> is the two-dimensional bridge: circulation on the edge equals total scalar curl over the area.</p>",
    definition: "<p>If $C$ is a positively oriented, piecewise smooth, simple closed curve bounding a region $D$, and $\\mathbf F=\\langle P,Q\\rangle$ has continuous partial derivatives on an open set containing $D$, then $$\\oint_C P\\,dx+Q\\,dy=\\iint_D\\left(\\dfrac{\\partial Q}{\\partial x}-\\dfrac{\\partial P}{\\partial y}\\right)dA.$$ The right side adds the tiny rotations inside $D$; neighboring interior edges cancel, leaving only the outer boundary circulation.</p><p><b>Assumptions that matter:</b> use counterclockwise orientation for the positive sign, split regions with holes carefully, and ensure the field is smooth throughout the region.</p>",
    worked: {
      problem: "Use Green's theorem to compute $\\oint_C -y\\,dx+x\\,dy$ where $C$ is the unit circle counterclockwise.",
      skills: ["Green's theorem", "scalar curl", "area"],
      strategy: "The boundary is round, but the curl is constant, so replace the line integral with an area integral.",
      steps: [
        { do: "Identify $P$", result: "$P=-y$", why: "this multiplies $dx$" },
        { do: "Identify $Q$", result: "$Q=x$", why: "this multiplies $dy$" },
        { do: "Compute $Q_x$", result: "$1$", why: "differentiate $x$ with respect to $x$" },
        { do: "Compute $P_y$", result: "$-1$", why: "differentiate $-y$ with respect to $y$" },
        { do: "Compute scalar curl", result: "$Q_x-P_y=2$", why: "Green's theorem uses this difference" },
        { do: "Integrate over the unit disk", result: "$\\iint_D2\\,dA=2\\pi$", why: "the unit disk area is $\\pi$" }
      ],
      verify: "Direct parameterization also gives integrand $1$ around $0\\le t\\le2\\pi$, so the answer $2\\pi$ is consistent.",
      answer: "$2\\pi$.",
      connects: "Green's theorem turns boundary circulation into accumulated interior curl."
    },
    practice: [
      { problem: "Use Green's theorem for $\\oint_C y\\,dx$ around the unit square $0\\le x,y\\le1$ counterclockwise.", steps: [
        { do: "Identify $P$", result: "$P=y$", why: "the integrand is $P\\,dx+Q\\,dy$" },
        { do: "Identify $Q$", result: "$Q=0$", why: "there is no $dy$ term" },
        { do: "Compute $Q_x$", result: "$0$", why: "$Q$ is zero" },
        { do: "Compute $P_y$", result: "$1$", why: "differentiate $y$ with respect to $y$" },
        { do: "Integrate the curl", result: "$\\iint_D(-1)\\,dA=-1$", why: "the square area is $1$" }
      ], answer: "The integral is $-1$." },
      { problem: "Compute $\\oint_C x\\,dy$ around the rectangle $0\\le x\\le3$, $0\\le y\\le2$ counterclockwise.", steps: [
        { do: "Set $P$", result: "$P=0$", why: "there is no $dx$ term" },
        { do: "Set $Q$", result: "$Q=x$", why: "the $dy$ coefficient is $x$" },
        { do: "Compute $Q_x$", result: "$1$", why: "differentiate $x$" },
        { do: "Compute $P_y$", result: "$0$", why: "$P=0$" },
        { do: "Integrate over the rectangle", result: "$\\iint_D1\\,dA=6$", why: "area is $3\\cdot2$" }
      ], answer: "$6$." },
      { problem: "Use Green's theorem to compute $\\oint_C (x^2-y)\\,dx+(x+y^2)\\,dy$ around a region of area $5$ counterclockwise.", steps: [
        { do: "Identify $P$", result: "$P=x^2-y$", why: "coefficient of $dx$" },
        { do: "Identify $Q$", result: "$Q=x+y^2$", why: "coefficient of $dy$" },
        { do: "Compute $Q_x$", result: "$1$", why: "differentiate with respect to $x$" },
        { do: "Compute $P_y$", result: "$-1$", why: "differentiate with respect to $y$" },
        { do: "Compute the curl", result: "$2$", why: "$1-(-1)=2$" },
        { do: "Multiply by area", result: "$2\\cdot5=10$", why: "the curl is constant" }
      ], answer: "$10$." },
      { problem: "Use the area formula $A=\\dfrac12\\oint_C x\\,dy-y\\,dx$ to find the area of a circle of radius $4$.", steps: [
        { do: "Identify the Green's theorem curl", result: "$Q_x-P_y=1-(-1)=2$", why: "for $P=-y$ and $Q=x$" },
        { do: "Write the half integral", result: "$A=\\dfrac12\\iint_D2\\,dA$", why: "Green's theorem converts the boundary integral" },
        { do: "Simplify", result: "$A=\\iint_D1\\,dA$", why: "the half cancels the curl $2$" },
        { do: "Use the disk area", result: "$\\pi\\cdot4^2$", why: "radius is $4$" },
        { do: "Evaluate", result: "$16\\pi$", why: "square the radius" }
      ], answer: "$16\\pi$." },
      { problem: "A planar flow has scalar curl $0.3$ across a rectangular region $10$ by $4$. Estimate the counterclockwise circulation around the boundary.", steps: [
        { do: "Compute the area", result: "$10\\cdot4=40$", why: "rectangle area" },
        { do: "Write Green's theorem", result: "$\\oint_C\\mathbf F\\cdot d\\mathbf r=\\iint_D0.3\\,dA$", why: "circulation equals curl over area" },
        { do: "Use constant curl", result: "$0.3\\iint_D1\\,dA$", why: "factor out the constant" },
        { do: "Substitute the area", result: "$0.3\\cdot40$", why: "the region has area $40$" },
        { do: "Multiply", result: "$12$", why: "constant curl accumulates linearly with area" }
      ], answer: "The circulation is about $12$." }
    ],
    applications: [
      { title: "Fast circulation from vorticity", background: "Fluid analysts often know curl over a region more easily than velocity on every boundary point.", numbers: "Constant curl $4$ over area $3$ gives circulation $12$." },
      { title: "Area from boundary samples", background: "Computational geometry can estimate polygon area by a boundary integral, a Green's theorem idea.", numbers: "A rectangle traced counterclockwise with sides $5$ and $2$ has area $10$, matching $\\frac12\\oint x\\,dy-y\\,dx$." },
      { title: "Checking vector-field simulations", background: "A numerical flow should have boundary circulation consistent with integrated curl over grid cells.", numbers: "Four cells each area $0.25$ with curl values $1,2,3,4$ give circulation about $0.25(10)=2.5$." },
      { title: "Planar electromagnetism", background: "Two-dimensional versions of Maxwell-style relationships connect circulation to accumulated source terms.", numbers: "Curl density $0.02$ over area $150$ gives boundary integral $3$." },
      { title: "Image contour moments", background: "Shape features can be computed from closed contours instead of filling every pixel.", numbers: "A circular boundary radius $10$ encloses area $100\\pi\\approx314.2$ pixels squared." },
      { title: "Robotics coverage loops", background: "A robot circling a region can infer interior swirl by measuring work around the route.", numbers: "Measured circulation $6$ around area $20$ implies average scalar curl $6/20=0.3$." }
    ],
    applicationsClose: "Green's theorem says the edge and the interior are two honest views of the same planar circulation.",
    takeaways: ["Green's theorem relates a counterclockwise boundary line integral to a double integral of scalar curl.", "The scalar curl is $Q_x-P_y$.", "Orientation, smoothness, and a well-behaved enclosed region matter."]
  },

  "math-02-37": {
    id: "math-02-37",
    title: "Surface integrals",
    tagline: "A surface integral adds a quantity over a curved sheet instead of a flat region.",
    connections: { buildsOn: ["parametric surfaces", "cross products", "double integrals"], leadsTo: ["flux", "Stokes' theorem", "the divergence theorem"], usedWith: ["surface area", "normal vectors", "parameter domains", "Jacobian scale factors"] },
    motivation: "<p>You already know how a double integral adds over a flat region. A curved surface needs the same idea, but each little parameter rectangle may stretch when it lands on the surface.</p><p>A <b>surface integral</b> uses a local area scale to add density, temperature, mass, or any scalar quantity across a curved sheet.</p>",
    definition: "<p>If a surface is parameterized by $\\mathbf r(u,v)$ over a domain $D$, then $$\\iint_S f\\,dS=\\iint_D f(\\mathbf r(u,v))\\,|\\mathbf r_u\\times\\mathbf r_v|\\,du\\,dv.$$ The cross product gives a normal vector whose length is the area scale from the $uv$ parameter patch to the surface patch. For a graph $z=g(x,y)$, this becomes $$dS=\\sqrt{1+g_x^2+g_y^2}\\,dA.$$</p><p><b>Assumptions that matter:</b> the surface should be smooth or piecewise smooth, the parameterization should not fold over itself except on boundaries, and scalar surface area uses the magnitude of the cross product.</p>",
    worked: {
      problem: "Find the surface area of the plane patch $\\mathbf r(u,v)=\\langle u,v,2u\\rangle$ over $0\\le u\\le3$, $0\\le v\\le4$.",
      skills: ["parametric surfaces", "cross products", "surface area"],
      strategy: "Surface area is the integral of the cross-product magnitude over the parameter rectangle.",
      steps: [
        { do: "Differentiate with respect to $u$", result: "$\\mathbf r_u=\\langle1,0,2\\rangle$", why: "hold $v$ constant" },
        { do: "Differentiate with respect to $v$", result: "$\\mathbf r_v=\\langle0,1,0\\rangle$", why: "hold $u$ constant" },
        { do: "Compute the cross product", result: "$\\mathbf r_u\\times\\mathbf r_v=\\langle-2,0,1\\rangle$", why: "this normal vector encodes area scale" },
        { do: "Compute its magnitude", result: "$\\sqrt{(-2)^2+0^2+1^2}=\\sqrt5$", why: "length is local surface stretch" },
        { do: "Write the area integral", result: "$\\int_0^4\\int_0^3\\sqrt5\\,du\\,dv$", why: "area density is constant" },
        { do: "Evaluate", result: "$12\\sqrt5$", why: "the parameter rectangle has area $12$" }
      ],
      verify: "The slanted patch has more area than its $3$ by $4$ shadow; $12\\sqrt5>12$, which makes sense.",
      answer: "$12\\sqrt5$ square units.",
      connects: "Surface integrals are double integrals with a curved-area scale factor."
    },
    practice: [
      { problem: "Find the area of the graph $z=x+y$ over $0\\le x\\le2$, $0\\le y\\le3$.", steps: [
        { do: "Compute $g_x$", result: "$1$", why: "differentiate $x+y$ with respect to $x$" },
        { do: "Compute $g_y$", result: "$1$", why: "differentiate with respect to $y$" },
        { do: "Compute the graph factor", result: "$\\sqrt{1+1^2+1^2}=\\sqrt3$", why: "use the graph surface formula" },
        { do: "Write the integral", result: "$\\int_0^3\\int_0^2\\sqrt3\\,dx\\,dy$", why: "the factor is constant" },
        { do: "Evaluate", result: "$6\\sqrt3$", why: "the rectangular shadow has area $6$" }
      ], answer: "$6\\sqrt3$." },
      { problem: "Compute $\\iint_S z\\,dS$ on the horizontal square $z=5$, $0\\le x\\le2$, $0\\le y\\le4$.", steps: [
        { do: "Read the surface value", result: "$z=5$", why: "the height is constant" },
        { do: "Read the area factor", result: "$dS=dA$", why: "the surface is horizontal" },
        { do: "Write the integral", result: "$\\int_0^4\\int_0^2 5\\,dx\\,dy$", why: "integrate the scalar value over the square" },
        { do: "Compute the base area", result: "$2\\cdot4=8$", why: "rectangle area" },
        { do: "Multiply", result: "$5\\cdot8=40$", why: "constant scalar times area" }
      ], answer: "$40$." },
      { problem: "For $\\mathbf r(u,v)=\\langle u,2v,0\\rangle$ over $0\\le u\\le1$, $0\\le v\\le3$, find the surface area.", steps: [
        { do: "Compute $\\mathbf r_u$", result: "$\\langle1,0,0\\rangle$", why: "differentiate with respect to $u$" },
        { do: "Compute $\\mathbf r_v$", result: "$\\langle0,2,0\\rangle$", why: "differentiate with respect to $v$" },
        { do: "Compute the cross product", result: "$\\langle0,0,2\\rangle$", why: "normal vector to the patch" },
        { do: "Compute its magnitude", result: "$2$", why: "the parameter rectangle is stretched in the $v$ direction" },
        { do: "Integrate", result: "$\\int_0^3\\int_0^1 2\\,du\\,dv=6$", why: "area scale times parameter area" }
      ], answer: "$6$." },
      { problem: "Find the surface area of a sphere of radius $2$ using $\\mathbf r(\\phi,\\theta)=\\langle2\\sin\\phi\\cos\\theta,2\\sin\\phi\\sin\\theta,2\\cos\\phi\\rangle$.", steps: [
        { do: "Use the spherical surface factor", result: "$|\\mathbf r_\\phi\\times\\mathbf r_\\theta|=4\\sin\\phi$", why: "a sphere of radius $2$ has factor $R^2\\sin\\phi$" },
        { do: "Set bounds", result: "$0\\le\\phi\\le\\pi$, $0\\le\\theta\\le2\\pi$", why: "cover the full sphere" },
        { do: "Write the integral", result: "$\\int_0^{2\\pi}\\int_0^\\pi4\\sin\\phi\\,d\\phi\\,d\\theta$", why: "integrate surface area density" },
        { do: "Integrate in $\\phi$", result: "$8$", why: "$4\\int_0^\\pi\\sin\\phi\\,d\\phi=8$" },
        { do: "Integrate in $\\theta$", result: "$16\\pi$", why: "multiply by $2\\pi$" }
      ], answer: "$16\\pi$." },
      { problem: "A curved sensor patch has parameter area $0.6$ and nearly constant area scale $1.25$. If signal density is $8$, estimate the surface integral.", steps: [
        { do: "Compute surface area", result: "$1.25\\cdot0.6=0.75$", why: "area scale turns parameter area into surface area" },
        { do: "Read the density", result: "$8$", why: "signal per surface-area unit" },
        { do: "Multiply density by area", result: "$8\\cdot0.75$", why: "constant density integrates as density times area" },
        { do: "Simplify", result: "$6$", why: "eight times three quarters is six" },
        { do: "State the estimate", result: "$6$ signal units", why: "the integral accumulates total signal" }
      ], answer: "The estimated surface integral is $6$." }
    ],
    applications: [
      { title: "Mass of a thin shell", background: "A shell with varying density needs a surface integral rather than volume integration.", numbers: "Density $3$ kg/m$^2$ on area $12$ m$^2$ gives mass $36$ kg." },
      { title: "Texture and lighting in graphics", background: "Rendering integrates light over visible surfaces, often using surface-area factors.", numbers: "Radiance $0.8$ over surface area $2.5$ contributes $2.0$ radiance-area units before angular factors." },
      { title: "Sensor coverage on curved devices", background: "Wearables and cameras have curved surfaces where flat area estimates undercount coverage.", numbers: "A patch with shadow area $10$ cm$^2$ and slope factor $1.2$ has surface area $12$ cm$^2$." },
      { title: "Surface loss on meshes", background: "Geometric ML may penalize errors over a mesh surface, weighting by triangle areas.", numbers: "Three triangles with areas $0.4,0.5,0.6$ and error $2$ give integrated error $2(1.5)=3$." },
      { title: "Heat on a plate", background: "Thermal energy on a thin curved plate is density integrated over surface area.", numbers: "Heat density $50$ J/m$^2$ over $0.3$ m$^2$ gives $15$ J." },
      { title: "Earth surface approximations", background: "Geographic quantities such as rainfall totals are surface integrals over curved regions.", numbers: "Rain depth $0.01$ m over $2,000,000$ m$^2$ gives water volume $20,000$ m$^3$." }
    ],
    applicationsClose: "Surface integrals keep the familiar idea of accumulation while respecting the true curved area being covered.",
    takeaways: ["A scalar surface integral is a double integral over a parameter domain with area scale $|\\mathbf r_u\\times\\mathbf r_v|$.", "For graphs, $dS=\\sqrt{1+g_x^2+g_y^2}\\,dA$.", "Use surface integrals for area, mass, heat, signal, or loss spread over a curved sheet."]
  },

  "math-02-38": {
    id: "math-02-38",
    title: "Flux",
    tagline: "Flux measures how much of a vector field passes through a surface.",
    connections: { buildsOn: ["vector fields", "surface integrals", "normal vectors"], leadsTo: ["the divergence theorem", "Stokes' theorem", "conservation laws"], usedWith: ["orientation", "surface normals", "dot products", "parametric surfaces"] },
    motivation: "<p>A surface may sit in a moving flow: air through a window, water through a net, probability through a boundary. The important part is not the flow sliding along the surface, but the part piercing through it.</p><p><b>Flux</b> measures that through-surface amount using a dot product with the surface normal.</p>",
    definition: "<p>For an oriented surface $S$ with unit normal $\\mathbf n$, the flux of $\\mathbf F$ through $S$ is $$\\iint_S \\mathbf F\\cdot\\mathbf n\\,dS.$$ With a parameterization $\\mathbf r(u,v)$, the vector area element is $\\mathbf r_u\\times\\mathbf r_v\\,du\\,dv$, so $$\\iint_S\\mathbf F\\cdot\\mathbf n\\,dS=\\iint_D\\mathbf F(\\mathbf r(u,v))\\cdot(\\mathbf r_u\\times\\mathbf r_v)\\,du\\,dv,$$ with the cross-product order chosen for the desired orientation.</p><p><b>Assumptions that matter:</b> orientation must be specified, tangential flow contributes zero to flux, and reversing the normal reverses the sign.</p>",
    worked: {
      problem: "Compute the upward flux of $\\mathbf F=\\langle0,0,5\\rangle$ through the rectangle $0\\le x\\le3$, $0\\le y\\le2$, $z=1$.",
      skills: ["dot products", "surface normals", "constant fields"],
      strategy: "The surface is horizontal, so upward normal is $\\langle0,0,1\\rangle$ and the flux is field-through-normal times area.",
      steps: [
        { do: "Choose the unit normal", result: "$\\mathbf n=\\langle0,0,1\\rangle$", why: "upward orientation" },
        { do: "Dot the field with the normal", result: "$\\langle0,0,5\\rangle\\cdot\\langle0,0,1\\rangle=5$", why: "only the through-surface component remains" },
        { do: "Compute the rectangle area", result: "$3\\cdot2=6$", why: "width times height in the $xy$ projection" },
        { do: "Multiply", result: "$5\\cdot6=30$", why: "constant normal flow times area" },
        { do: "Check sign", result: "positive", why: "the field points in the same direction as the upward normal" }
      ],
      verify: "A field of strength $5$ passing straight through $6$ square units should give flux $30$.",
      answer: "$30$.",
      connects: "Flux is through-surface flow, not along-surface flow."
    },
    practice: [
      { problem: "Find the upward flux of $\\mathbf F=\\langle1,2,3\\rangle$ through the square $0\\le x,y\\le2$ in the plane $z=0$.", steps: [
        { do: "Choose the normal", result: "$\\mathbf n=\\langle0,0,1\\rangle$", why: "upward orientation" },
        { do: "Dot with the field", result: "$\\mathbf F\\cdot\\mathbf n=3$", why: "only vertical component passes through" },
        { do: "Compute area", result: "$2\\cdot2=4$", why: "square side length is $2$" },
        { do: "Multiply", result: "$3\\cdot4=12$", why: "constant flux density" },
        { do: "State sign", result: "positive", why: "the vertical component points upward" }
      ], answer: "$12$." },
      { problem: "Find the flux of $\\mathbf F=\\langle4,0,0\\rangle$ through the plane rectangle $x=2$, $0\\le y\\le3$, $0\\le z\\le5$, oriented in the positive $x$ direction.", steps: [
        { do: "Choose the normal", result: "$\\mathbf n=\\langle1,0,0\\rangle$", why: "positive $x$ orientation" },
        { do: "Dot with the field", result: "$4$", why: "the field is normal to the rectangle" },
        { do: "Compute area", result: "$3\\cdot5=15$", why: "side lengths in $y$ and $z$" },
        { do: "Multiply", result: "$4\\cdot15=60$", why: "constant flux density" },
        { do: "Interpret", result: "outflow in positive $x$ direction", why: "field and normal align" }
      ], answer: "$60$." },
      { problem: "Compute the flux of $\\mathbf F=\\langle0,7,0\\rangle$ through the same rectangle $x=2$ with positive $x$ normal.", steps: [
        { do: "Use the normal", result: "$\\mathbf n=\\langle1,0,0\\rangle$", why: "orientation is positive $x$" },
        { do: "Dot with the field", result: "$\\langle0,7,0\\rangle\\cdot\\langle1,0,0\\rangle=0$", why: "the field is tangent to the surface" },
        { do: "Write the flux integral", result: "$\\iint_S0\\,dS$", why: "zero through-component everywhere" },
        { do: "Evaluate", result: "$0$", why: "integral of zero is zero" },
        { do: "Interpret", result: "flow slides along the rectangle", why: "tangential motion does not cross it" }
      ], answer: "$0$." },
      { problem: "For $\\mathbf F=\\langle x,y,z\\rangle$, compute upward flux through $z=2$ over $0\\le x\\le1$, $0\\le y\\le3$.", steps: [
        { do: "Choose the normal", result: "$\\mathbf n=\\langle0,0,1\\rangle$", why: "upward surface" },
        { do: "Dot with the field", result: "$\\mathbf F\\cdot\\mathbf n=z$", why: "take the vertical component" },
        { do: "Substitute the surface height", result: "$z=2$", why: "the plane is $z=2$" },
        { do: "Compute area", result: "$1\\cdot3=3$", why: "rectangle area" },
        { do: "Multiply", result: "$2\\cdot3=6$", why: "constant flux density over the plane" }
      ], answer: "$6$." },
      { problem: "Air velocity $\\mathbf v=\\langle0,0,-1.5\\rangle$ crosses a horizontal filter of area $8$ with upward normal. Compute flux and interpret the sign.", steps: [
        { do: "Use the upward normal", result: "$\\mathbf n=\\langle0,0,1\\rangle$", why: "orientation is specified" },
        { do: "Dot velocity with normal", result: "$-1.5$", why: "the air moves downward" },
        { do: "Multiply by area", result: "$-1.5\\cdot8=-12$", why: "flux density times filter area" },
        { do: "Read the sign", result: "negative", why: "flow crosses opposite the chosen normal" },
        { do: "Read the magnitude", result: "$12$", why: "amount crossing ignores sign" }
      ], answer: "The oriented flux is $-12$; $12$ units per second cross downward." }
    ],
    applications: [
      { title: "Air through a vent", background: "HVAC calculations need volume per time passing through openings, a direct flux computation.", numbers: "Speed $2.5$ m/s normal to area $0.8$ m$^2$ gives flow rate $2.0$ m$^3$/s." },
      { title: "Fluid through a membrane", background: "Filters and biological membranes are modeled by through-surface flow.", numbers: "Flux density $0.03$ L/(s m$^2$) over $12$ m$^2$ gives $0.36$ L/s." },
      { title: "Electric flux", background: "Gauss's law uses electric flux through closed surfaces to connect fields with enclosed charge.", numbers: "Uniform field $5$ N/C through area $4$ m$^2$ aligned with the normal gives flux $20$ N m$^2$/C." },
      { title: "Probability current", background: "In stochastic systems, flux across a boundary measures probability mass leaving a region.", numbers: "Probability current $0.02$ per second per unit boundary over length $15$ gives outflow $0.3$ per second." },
      { title: "Neural rendering rays", background: "Rendering integrates light crossing image-plane pixels, a flux-like through-surface measurement.", numbers: "Radiance-through-pixel value $0.7$ over pixel area $0.01$ contributes $0.007$." },
      { title: "Robotics safety boundaries", background: "Flux through a virtual boundary estimates how many agents or particles enter a protected region.", numbers: "Density $0.4$ agents/m$^2$ and normal speed $1.5$ m/s across $6$ m gives $0.4\\cdot1.5\\cdot6=3.6$ agents/s." }
    ],
    applicationsClose: "Flux is the dot product idea made global: only the normal component counts as crossing.",
    takeaways: ["Flux is $\\iint_S\\mathbf F\\cdot\\mathbf n\\,dS$.", "Tangential field components contribute zero flux.", "Changing orientation changes the sign but not the physical magnitude crossing the surface."]
  },

  "math-02-39": {
    id: "math-02-39",
    title: "Stokes' theorem",
    tagline: "Stokes' theorem turns circulation around a space curve into curl through any surface it bounds.",
    connections: { buildsOn: ["curl", "line integrals", "surface integrals", "orientation"], leadsTo: ["Maxwell equations", "differential forms", "the divergence theorem"], usedWith: ["normal vectors", "boundary curves", "surface orientation", "circulation"] },
    motivation: "<p>Green's theorem works for flat regions in the plane. But many boundaries live in space: a wire loop, a tilted ring, or the rim of a curved surface.</p><p><b>Stokes' theorem</b> says the same principle survives: circulation around the boundary equals total curl through a surface spanning that boundary.</p>",
    definition: "<p>If $S$ is an oriented smooth surface with positively oriented boundary $\\partial S$, and $\\mathbf F$ has continuous partial derivatives nearby, then $$\\oint_{\\partial S}\\mathbf F\\cdot d\\mathbf r=\\iint_S(\\nabla\\times\\mathbf F)\\cdot\\mathbf n\\,dS.$$ The orientation is linked by the right-hand rule: your thumb points along $\\mathbf n$, and your fingers curl in the positive boundary direction. The theorem follows from adding tiny Green's-theorem patches; interior boundary pieces cancel, leaving only the outer curve.</p><p><b>Assumptions that matter:</b> the surface must have the stated boundary, the field must be smooth on and near it, and orientation must be consistent between surface normal and boundary direction.</p>",
    worked: {
      problem: "Use Stokes' theorem to compute $\\oint_C \\langle-y,x,0\\rangle\\cdot d\\mathbf r$ where $C$ is the unit circle in the $xy$-plane, counterclockwise viewed from above.",
      skills: ["curl", "Stokes' theorem", "orientation"],
      strategy: "Use the flat disk as the spanning surface; the curl is constant and the normal is upward.",
      steps: [
        { do: "Identify the surface normal", result: "$\\mathbf n=\\langle0,0,1\\rangle$", why: "counterclockwise from above matches upward orientation" },
        { do: "Compute the curl", result: "$\\nabla\\times\\langle-y,x,0\\rangle=\\langle0,0,2\\rangle$", why: "the scalar curl is $1-(-1)=2$" },
        { do: "Dot curl with the normal", result: "$2$", why: "only the upward component passes through" },
        { do: "Set up the surface integral", result: "$\\iint_D2\\,dA$", why: "use the flat unit disk" },
        { do: "Use the disk area", result: "$2\\pi$", why: "area of the unit disk is $\\pi$" }
      ],
      verify: "This matches the direct unit-circle line integral, where the field equals the tangent vector.",
      answer: "$2\\pi$.",
      connects: "Stokes' theorem is Green's theorem lifted from a plane region to a surface in space."
    },
    practice: [
      { problem: "Use Stokes' theorem for $\\mathbf F=\\langle-y,x,0\\rangle$ around a circle of radius $3$ in the $xy$-plane, counterclockwise from above.", steps: [
        { do: "Choose the surface", result: "disk of radius $3$", why: "it has the given boundary" },
        { do: "Choose the normal", result: "$\\langle0,0,1\\rangle$", why: "counterclockwise from above" },
        { do: "Compute the curl", result: "$\\langle0,0,2\\rangle$", why: "same field as the worked example" },
        { do: "Dot with the normal", result: "$2$", why: "normal component of curl" },
        { do: "Multiply by area", result: "$2\\cdot9\\pi=18\\pi$", why: "disk area is $9\\pi$" }
      ], answer: "$18\\pi$." },
      { problem: "For $\\mathbf F=\\langle0,0,x\\rangle$, compute circulation around the unit square in the plane $z=0$ with upward normal orientation.", steps: [
        { do: "Compute the curl", result: "$\\nabla\\times\\mathbf F=\\langle0,-1,0\\rangle$", why: "$P_z-R_x=0-1=-1$" },
        { do: "Choose the normal", result: "$\\mathbf n=\\langle0,0,1\\rangle$", why: "upward orientation" },
        { do: "Dot curl with normal", result: "$0$", why: "the curl is tangent to the surface" },
        { do: "Integrate over the square", result: "$\\iint_S0\\,dS=0$", why: "zero normal curl gives zero circulation" },
        { do: "State the result", result: "$0$", why: "Stokes' theorem equals the boundary integral" }
      ], answer: "$0$." },
      { problem: "For $\\mathbf F=\\langle0,x,0\\rangle$, find circulation around a rectangle of area $6$ in the $xy$-plane, counterclockwise from above.", steps: [
        { do: "Compute curl", result: "$\\nabla\\times\\mathbf F=\\langle0,0,1\\rangle$", why: "$Q_x=1$ and other relevant partials are zero" },
        { do: "Use upward normal", result: "$\\mathbf n=\\langle0,0,1\\rangle$", why: "counterclockwise from above" },
        { do: "Dot", result: "$1$", why: "curl aligns with the normal" },
        { do: "Integrate over area", result: "$\\iint_S1\\,dS=6$", why: "the rectangle area is $6$" },
        { do: "Report circulation", result: "$6$", why: "boundary integral equals surface integral" }
      ], answer: "$6$." },
      { problem: "Reverse the orientation in the previous problem. What is the circulation?", steps: [
        { do: "Keep the curl", result: "$\\langle0,0,1\\rangle$", why: "the field is unchanged" },
        { do: "Reverse the normal", result: "$\\mathbf n=\\langle0,0,-1\\rangle$", why: "opposite boundary orientation" },
        { do: "Dot curl with normal", result: "$-1$", why: "orientation changes the sign" },
        { do: "Integrate over area $6$", result: "$-6$", why: "constant integrand over the rectangle" },
        { do: "Compare", result: "negative of the previous answer", why: "only orientation changed" }
      ], answer: "$-6$." },
      { problem: "A measured curl has constant normal component $0.08$ over a drone loop spanning area $50$ m$^2$. Estimate the circulation.", steps: [
        { do: "Write Stokes' theorem", result: "$\\oint_C\\mathbf F\\cdot d\\mathbf r=\\iint_S0.08\\,dS$", why: "normal curl is constant" },
        { do: "Use the area", result: "$\\iint_S1\\,dS=50$", why: "given spanning area" },
        { do: "Multiply", result: "$0.08\\cdot50$", why: "constant curl times area" },
        { do: "Simplify", result: "$4$", why: "eight hundredths times fifty" },
        { do: "Attach orientation", result: "positive for the chosen normal", why: "the sign follows the right-hand rule" }
      ], answer: "The circulation is approximately $4$ for the chosen orientation." }
    ],
    applications: [
      { title: "Electromagnetic induction", background: "Faraday's law is a Stokes-type statement connecting circulation of electric field to changing magnetic flux.", numbers: "A changing magnetic flux of $-0.12$ Wb/s gives electric circulation $0.12$ V under the usual sign convention." },
      { title: "Fluid circulation over flexible surfaces", background: "A loop in a fluid can span many surfaces; Stokes says the curl flux through any one gives the same boundary circulation.", numbers: "Normal vorticity $2$ over area $0.5$ gives circulation $1$." },
      { title: "Mesh verification", background: "Simulation codes check boundary integrals against curl flux through triangulated surfaces.", numbers: "Triangles with curl fluxes $0.2$, $0.4$, and $0.1$ sum to boundary circulation $0.7$." },
      { title: "Robotics loop sensing", background: "A robot following a loop can infer average rotational field inside the loop.", numbers: "Measured circulation $15$ around a loop spanning $30$ m$^2$ implies average normal curl $0.5$." },
      { title: "Computer graphics vector textures", background: "Artists and engineers use curl fields for swirling textures and incompressible motion.", numbers: "If average normal curl is $3$ on a patch of area $2$, expected boundary swirl is $6$." },
      { title: "Geophysical flows", background: "Circulation around atmospheric loops relates to vorticity passing through the enclosed surface.", numbers: "Average vorticity $10^{-4}$ s$^{-1}$ over $10^8$ m$^2$ gives circulation $10^4$ m$^2$/s." }
    ],
    applicationsClose: "Stokes' theorem lets you choose the easier side: boundary circulation or curl through a spanning surface.",
    takeaways: ["Stokes' theorem states $\\oint_{\\partial S}\\mathbf F\\cdot d\\mathbf r=\\iint_S(\\nabla\\times\\mathbf F)\\cdot\\mathbf n\\,dS$.", "The boundary orientation and surface normal are tied by the right-hand rule.", "Green's theorem is the flat-plane special case."]
  },

  "math-02-40": {
    id: "math-02-40",
    title: "The divergence theorem",
    tagline: "The divergence theorem turns outward flux through a closed surface into total source strength inside.",
    connections: { buildsOn: ["divergence", "flux", "triple integrals", "closed surfaces"], leadsTo: ["conservation laws", "PDEs", "finite-volume methods"], usedWith: ["normal vectors", "volume integrals", "surface orientation", "source terms"] },
    motivation: "<p>Flux tells how much field crosses a surface. Divergence tells how strongly the field is born or absorbed at a point. For a closed surface, these should be two views of one story.</p><p>The <b>divergence theorem</b> says total outward flux equals total divergence inside. It is the bookkeeping law behind conservation of mass, charge, heat, and probability.</p>",
    definition: "<p>If $E$ is a solid region with closed, outward-oriented boundary surface $\\partial E$, and $\\mathbf F$ has continuous partial derivatives nearby, then $$\\iint_{\\partial E}\\mathbf F\\cdot\\mathbf n\\,dS=\\iiint_E \\nabla\\cdot\\mathbf F\\,dV.$$ Tiny internal fluxes cancel face by face when small boxes are added together; only flux through the outside boundary remains.</p><p><b>Assumptions that matter:</b> the surface must be closed and outward oriented, the field must be smooth on the region, and holes or piecewise surfaces require including every boundary component.</p>",
    worked: {
      problem: "Use the divergence theorem to find outward flux of $\\mathbf F=\\langle x,y,z\\rangle$ through the sphere of radius $2$ centered at the origin.",
      skills: ["divergence", "triple integrals", "spheres"],
      strategy: "Surface flux is awkward directly; divergence is constant, so integrate over volume.",
      steps: [
        { do: "Compute $P_x$", result: "$1$", why: "differentiate $x$ with respect to $x$" },
        { do: "Compute $Q_y$", result: "$1$", why: "differentiate $y$ with respect to $y$" },
        { do: "Compute $R_z$", result: "$1$", why: "differentiate $z$ with respect to $z$" },
        { do: "Add for divergence", result: "$\\nabla\\cdot\\mathbf F=3$", why: "sum matching partials" },
        { do: "Compute the sphere volume", result: "$\\dfrac43\\pi(2^3)=\\dfrac{32\\pi}{3}$", why: "radius is $2$" },
        { do: "Multiply by divergence", result: "$3\\cdot\\dfrac{32\\pi}{3}=32\\pi$", why: "constant divergence integrates as value times volume" }
      ],
      verify: "On the sphere, $\\mathbf F$ points outward with normal component $2$ and surface area $16\\pi$, giving $32\\pi$ directly.",
      answer: "$32\\pi$.",
      connects: "Outward flux through a closed surface equals total source strength in the volume."
    },
    practice: [
      { problem: "Find the outward flux of $\\mathbf F=\\langle2x,0,0\\rangle$ through the unit cube $0\\le x,y,z\\le1$.", steps: [
        { do: "Compute divergence", result: "$\\nabla\\cdot\\mathbf F=2$", why: "$\\partial(2x)/\\partial x=2$" },
        { do: "Compute cube volume", result: "$1$", why: "unit cube" },
        { do: "Apply divergence theorem", result: "$\\iiint_E2\\,dV$", why: "closed outward flux equals volume integral" },
        { do: "Evaluate", result: "$2\\cdot1=2$", why: "constant divergence" },
        { do: "Interpret", result: "net outward flux is $2$", why: "right face outflow exceeds left face outflow" }
      ], answer: "$2$." },
      { problem: "Find outward flux of $\\mathbf F=\\langle x,y,z\\rangle$ through the box $0\\le x\\le2$, $0\\le y\\le3$, $0\\le z\\le4$.", steps: [
        { do: "Compute divergence", result: "$1+1+1=3$", why: "matching partials" },
        { do: "Compute box volume", result: "$2\\cdot3\\cdot4=24$", why: "length times width times height" },
        { do: "Write the volume integral", result: "$\\iiint_E3\\,dV$", why: "use divergence theorem" },
        { do: "Evaluate", result: "$3\\cdot24=72$", why: "constant divergence" },
        { do: "State outward flux", result: "$72$", why: "surface is closed and outward oriented" }
      ], answer: "$72$." },
      { problem: "For $\\mathbf F=\\langle-y,x,0\\rangle$, find outward flux through any closed surface enclosing a smooth solid.", steps: [
        { do: "Compute $P_x$", result: "$0$", why: "$-y$ does not depend on $x$" },
        { do: "Compute $Q_y$", result: "$0$", why: "$x$ does not depend on $y$" },
        { do: "Compute $R_z$", result: "$0$", why: "$R=0$" },
        { do: "Add divergence", result: "$0$", why: "all terms vanish" },
        { do: "Integrate over the volume", result: "$\\iiint_E0\\,dV=0$", why: "zero source strength gives zero net flux" }
      ], answer: "The outward flux is $0$." },
      { problem: "Find outward flux of $\\mathbf F=\\langle x^2,y^2,z^2\\rangle$ through the unit cube $0\\le x,y,z\\le1$.", steps: [
        { do: "Compute divergence", result: "$2x+2y+2z$", why: "differentiate each squared component" },
        { do: "Split the integral", result: "$\\iiint_E(2x+2y+2z)dV$", why: "use linearity" },
        { do: "Integrate $2x$ over the cube", result: "$1$", why: "$\\int_0^1 2x\\,dx=1$ and other widths are $1$" },
        { do: "Integrate $2y$ over the cube", result: "$1$", why: "same calculation in $y$" },
        { do: "Integrate $2z$ over the cube", result: "$1$", why: "same calculation in $z$" },
        { do: "Add", result: "$3$", why: "sum the three contributions" }
      ], answer: "$3$." },
      { problem: "A probability flow has constant divergence $-0.04$ inside a closed region of volume $250$. What is the outward probability flux?", steps: [
        { do: "Write the theorem", result: "$\\text{outward flux}=\\iiint_E -0.04\\,dV$", why: "divergence is constant" },
        { do: "Use the volume", result: "$-0.04\\cdot250$", why: "constant times volume" },
        { do: "Multiply", result: "$-10$", why: "four hundredths of $250$ is $10$" },
        { do: "Interpret sign", result: "net inward flow", why: "negative outward flux means more entering than leaving" },
        { do: "State magnitude", result: "$10$", why: "the amount of net inward flux is positive magnitude" }
      ], answer: "The outward flux is $-10$, meaning net inward flux of magnitude $10$." }
    ],
    applications: [
      { title: "Mass conservation", background: "Continuity equations say changes inside a region are controlled by flux through the boundary.", numbers: "If divergence is $-0.2$ kg/(m$^3$s) over volume $5$ m$^3$, net outward mass flux is $-1$ kg/s." },
      { title: "Finite-volume simulation", background: "Numerical PDE solvers update cell averages by balancing fluxes through cell faces.", numbers: "Divergence $3$ over cell volume $0.1$ predicts net outward flux $0.3$." },
      { title: "Gauss's law", background: "Electric flux through a closed surface is proportional to enclosed charge.", numbers: "If enclosed charge over $\\epsilon_0$ equals $12$, outward electric flux is $12$." },
      { title: "Checking fluid incompressibility", background: "For incompressible flow, total flux through any closed surface should be near zero.", numbers: "Average divergence $0.002$ over volume $100$ gives flux $0.2$, small but not zero." },
      { title: "Probability conservation in ML dynamics", background: "Continuous generative models track how probability mass moves through regions.", numbers: "Divergence $0.5$ over volume $0.8$ gives outward flux $0.4$ probability units per time." },
      { title: "Heat sources", background: "Heat flow out of a closed surface equals total internal heat generation at steady state.", numbers: "A source density $15$ W/m$^3$ in volume $2$ m$^3$ gives outward heat flux $30$ W." }
    ],
    applicationsClose: "The divergence theorem is conservation in one line: what is created inside must show up as net outward flow.",
    takeaways: ["The divergence theorem relates outward flux through a closed surface to a volume integral of divergence.", "The boundary must be closed and outward oriented.", "It is the mathematical backbone of conservation laws and finite-volume methods."]
  },

  "math-02-41": {
    id: "math-02-41",
    title: "Matrix calculus for ML",
    tagline: "Matrix calculus organizes gradients for models whose inputs, weights, and losses are vectors or matrices.",
    connections: { buildsOn: ["gradients", "Jacobians", "linear algebra", "the chain rule"], leadsTo: ["backpropagation", "optimization", "deep learning architectures"], usedWith: ["matrix multiplication", "dot products", "quadratic forms", "Jacobian-vector products"] },
    motivation: "<p>You already know how to differentiate a one-variable loss and how a gradient points in the direction of steepest increase. Machine-learning models simply have many parameters at once: weights in a vector, rows in a matrix, layers in a chain.</p><p><b>Matrix calculus</b> keeps the bookkeeping clean. It tells you the shape of each derivative, how errors flow backward, and how to compute gradients with real arrays instead of one parameter at a time.</p>",
    definition: "<p>For a scalar loss $L$ and vector $w\\in\\mathbb R^n$, the gradient $\\nabla_w L$ is the vector of partial derivatives. For $y=Wx$, where $W\\in\\mathbb R^{m\\times n}$ and $x\\in\\mathbb R^n$, each output is $y_i=\\sum_j W_{ij}x_j$. If $L$ depends on $y$ and $g=\\nabla_y L$, then the chain rule gives $$\\nabla_W L=gx^T,\\qquad \\nabla_x L=W^Tg.$$ These formulas come from $dL=g^Tdy=g^T(dW)x+g^TW\\,dx$, then matching coefficients of $dW$ and $dx$.</p><p><b>Assumptions that matter:</b> track shapes before multiplying, use column-vector convention consistently, distinguish elementwise products from matrix products, and remember that backprop is repeated chain rule from the scalar loss backward through each operation.</p>",
    worked: {
      problem: "Let $W=\\begin{bmatrix}1&2\\\\-1&3\\end{bmatrix}$, $x=\\begin{bmatrix}4\\\\1\\end{bmatrix}$, target $t=\\begin{bmatrix}5\\\\0\\end{bmatrix}$, $y=Wx$, and $L=\\dfrac12\\|y-t\\|^2$. Compute $\\nabla_W L$ and $\\nabla_x L$.",
      skills: ["matrix multiplication", "quadratic loss", "backpropagation"],
      strategy: "Forward pass first, then backpropagate $g=\\nabla_yL=y-t$ through $y=Wx$.",
      steps: [
        { do: "Compute the first output", result: "$y_1=1\\cdot4+2\\cdot1=6$", why: "row one of $W$ dotted with $x$" },
        { do: "Compute the second output", result: "$y_2=-1\\cdot4+3\\cdot1=-1$", why: "row two of $W$ dotted with $x$" },
        { do: "Form the residual", result: "$g=y-t=\\begin{bmatrix}1\\\\-1\\end{bmatrix}$", why: "for $\\frac12\\|y-t\\|^2$, the gradient with respect to $y$ is $y-t$" },
        { do: "Compute the loss", result: "$L=\\dfrac12(1^2+(-1)^2)=1$", why: "this checks the forward pass" },
        { do: "Use the outer-product rule", result: "$\\nabla_WL=gx^T$", why: "weights feed outputs linearly" },
        { do: "Evaluate the outer product", result: "$\\nabla_WL=\\begin{bmatrix}1\\\\-1\\end{bmatrix}\\begin{bmatrix}4&1\\end{bmatrix}=\\begin{bmatrix}4&1\\\\-4&-1\\end{bmatrix}$", why: "each row is $g_i$ times $x^T$" },
        { do: "Use the input-gradient rule", result: "$\\nabla_xL=W^Tg$", why: "backpropagate through the linear map" },
        { do: "Evaluate $W^Tg$", result: "$\\begin{bmatrix}1&-1\\\\2&3\\end{bmatrix}\\begin{bmatrix}1\\\\-1\\end{bmatrix}=\\begin{bmatrix}2\\\\-1\\end{bmatrix}$", why: "multiply the transposed weights by the upstream gradient" }
      ],
      verify: "A small change $\\Delta W_{11}=0.01$ changes $y_1$ by $0.04$ and loss by about $g_1\\cdot0.04=0.04$, matching gradient entry $4$ times $0.01$.",
      answer: "$\\nabla_WL=\\begin{bmatrix}4&1\\\\-4&-1\\end{bmatrix}$ and $\\nabla_xL=\\begin{bmatrix}2\\\\-1\\end{bmatrix}$.",
      connects: "Backpropagation is matrix calculus applying the chain rule with shape-aware gradients."
    },
    practice: [
      { problem: "For $L(w)=\\dfrac12\\|Aw-b\\|^2$ with $A=\\begin{bmatrix}1&2\\\\3&0\\end{bmatrix}$, $w=\\begin{bmatrix}1\\\\-1\\end{bmatrix}$, and $b=\\begin{bmatrix}0\\\\4\\end{bmatrix}$, compute $\\nabla_wL$.", steps: [
        { do: "Compute $Aw$", result: "$\\begin{bmatrix}1(1)+2(-1)\\\\3(1)+0(-1)\\end{bmatrix}=\\begin{bmatrix}-1\\\\3\\end{bmatrix}$", why: "forward linear prediction" },
        { do: "Compute the residual", result: "$r=Aw-b=\\begin{bmatrix}-1\\\\-1\\end{bmatrix}$", why: "subtract the target" },
        { do: "Use the gradient rule", result: "$\\nabla_wL=A^Tr$", why: "least-squares gradient" },
        { do: "Transpose $A$", result: "$A^T=\\begin{bmatrix}1&3\\\\2&0\\end{bmatrix}$", why: "backprop through $Aw$" },
        { do: "Multiply", result: "$\\begin{bmatrix}1&3\\\\2&0\\end{bmatrix}\\begin{bmatrix}-1\\\\-1\\end{bmatrix}=\\begin{bmatrix}-4\\\\-2\\end{bmatrix}$", why: "combine residual contributions" }
      ], answer: "$\\nabla_wL=\\begin{bmatrix}-4\\\\-2\\end{bmatrix}$." },
      { problem: "For $f(x)=x^TAx$ with $A=\\begin{bmatrix}2&1\\\\0&3\\end{bmatrix}$ and $x=\\begin{bmatrix}1\\\\2\\end{bmatrix}$, compute $\\nabla_x f=(A+A^T)x$.", steps: [
        { do: "Transpose $A$", result: "$A^T=\\begin{bmatrix}2&0\\\\1&3\\end{bmatrix}$", why: "quadratic forms use symmetric part" },
        { do: "Add $A+A^T$", result: "$\\begin{bmatrix}4&1\\\\1&6\\end{bmatrix}$", why: "combine forward and transposed contributions" },
        { do: "Multiply by $x$", result: "$\\begin{bmatrix}4&1\\\\1&6\\end{bmatrix}\\begin{bmatrix}1\\\\2\\end{bmatrix}$", why: "apply the gradient formula" },
        { do: "Compute the first component", result: "$4(1)+1(2)=6$", why: "row one dot product" },
        { do: "Compute the second component", result: "$1(1)+6(2)=13$", why: "row two dot product" }
      ], answer: "$\\nabla_x f=\\begin{bmatrix}6\\\\13\\end{bmatrix}$." },
      { problem: "A layer has $y=Wx+b$, upstream gradient $g=\\begin{bmatrix}2\\\\-3\\end{bmatrix}$, and input $x=\\begin{bmatrix}5\\\\1\\\\-2\\end{bmatrix}$. Compute $\\nabla_WL$ and $\\nabla_bL$.", steps: [
        { do: "Use the bias rule", result: "$\\nabla_bL=g$", why: "$y$ changes one-for-one with $b$" },
        { do: "Write the outer-product rule", result: "$\\nabla_WL=gx^T$", why: "each weight multiplies one input component" },
        { do: "Write $x^T$", result: "$\\begin{bmatrix}5&1&-2\\end{bmatrix}$", why: "outer product needs a row vector" },
        { do: "Compute row one", result: "$2\\begin{bmatrix}5&1&-2\\end{bmatrix}=\\begin{bmatrix}10&2&-4\\end{bmatrix}$", why: "first upstream component is $2$" },
        { do: "Compute row two", result: "$-3\\begin{bmatrix}5&1&-2\\end{bmatrix}=\\begin{bmatrix}-15&-3&6\\end{bmatrix}$", why: "second upstream component is $-3$" }
      ], answer: "$\\nabla_WL=\\begin{bmatrix}10&2&-4\\\\-15&-3&6\\end{bmatrix}$ and $\\nabla_bL=\\begin{bmatrix}2\\\\-3\\end{bmatrix}$." },
      { problem: "For sigmoid $a=\\sigma(z)$ with $z=0.7$ and upstream gradient $\\partial L/\\partial a=4$, compute $\\partial L/\\partial z$ using $\\sigma(0.7)\\approx0.668$.", steps: [
        { do: "Write the sigmoid derivative", result: "$\\dfrac{da}{dz}=a(1-a)$", why: "standard activation derivative" },
        { do: "Substitute $a=0.668$", result: "$0.668(1-0.668)$", why: "use the forward activation" },
        { do: "Compute the local derivative", result: "$0.668\\cdot0.332\\approx0.222$", why: "multiply the factors" },
        { do: "Apply the chain rule", result: "$\\dfrac{\\partial L}{\\partial z}=4\\cdot0.222$", why: "upstream gradient times local derivative" },
        { do: "Multiply", result: "$0.888$", why: "backpropagated gradient" }
      ], answer: "$\\partial L/\\partial z\\approx0.888$." },
      { problem: "A one-sample linear model has $\\hat y=w^Tx+b$, $x=\\begin{bmatrix}2\\\\-1\\end{bmatrix}$, $w=\\begin{bmatrix}0.5\\\\1.5\\end{bmatrix}$, $b=0.2$, target $y=1.0$, and loss $L=\\frac12(\\hat y-y)^2$. Compute gradients for $w$ and $b$.", steps: [
        { do: "Compute the prediction", result: "$\\hat y=0.5(2)+1.5(-1)+0.2=-0.3$", why: "forward pass" },
        { do: "Compute the residual", result: "$e=\\hat y-y=-0.3-1.0=-1.3$", why: "quadratic loss derivative with respect to prediction" },
        { do: "Compute $\\nabla_wL$", result: "$e x=-1.3\\begin{bmatrix}2\\\\-1\\end{bmatrix}$", why: "each weight scales the input" },
        { do: "Evaluate $\\nabla_wL$", result: "$\\begin{bmatrix}-2.6\\\\1.3\\end{bmatrix}$", why: "multiply the residual into each feature" },
        { do: "Compute $\\partial L/\\partial b$", result: "$-1.3$", why: "bias changes prediction by one" }
      ], answer: "$\\nabla_wL=\\begin{bmatrix}-2.6\\\\1.3\\end{bmatrix}$ and $\\partial L/\\partial b=-1.3$." }
    ],
    applications: [
      { title: "Backprop through a dense layer", background: "Every neural-network library computes dense-layer gradients using outer products from matrix calculus.", numbers: "With upstream $g=[2,-3]^T$ and input $x=[5,1,-2]^T$, $gx^T=\\begin{bmatrix}10&2&-4\\\\-15&-3&6\\end{bmatrix}$." },
      { title: "Least-squares regression", background: "Linear regression training is built on the gradient $X^T(Xw-y)$.", numbers: "If $X^Tr=[-4,-2]^T$ and learning rate $0.1$, the update is $w\\leftarrow w-[ -0.4,-0.2]^T$, so $w$ increases by $[0.4,0.2]^T$." },
      { title: "Mini-batch gradients", background: "Batches average many outer products so updates are less noisy.", numbers: "Two sample gradients $[4,1]$ and $[2,5]$ average to $[3,3]$." },
      { title: "Softmax classifier logits", background: "For cross-entropy after softmax, the gradient with respect to logits is probabilities minus one-hot target.", numbers: "If $p=[0.7,0.2,0.1]$ and target class $2$ is $[0,1,0]$, then $g=[0.7,-0.8,0.1]$." },
      { title: "Jacobian-vector products", background: "Modern autodiff often avoids forming full Jacobians by multiplying them by vectors during forward or reverse mode.", numbers: "For $y=Wx$ with $W=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$ and vector $v=[5,6]^T$, $Jv=Wv=[17,39]^T$." },
      { title: "Gradient clipping", background: "Training large models clips gradient vectors when their norm is too large for stable updates.", numbers: "Gradient $[6,8]$ has norm $10$; clipping to norm $5$ scales it by $0.5$ to $[3,4]$." },
      { title: "Attention score gradients", background: "Transformer attention scores are dot products, so their gradients follow simple vector calculus rules.", numbers: "For score $s=q^Tk$, if upstream $\\partial L/\\partial s=0.2$ and $k=[3,-1]^T$, then $\\nabla_qL=0.2k=[0.6,-0.2]^T$." },
      { title: "Weight decay", background: "Regularization adds a simple matrix-calculus gradient that pulls weights toward zero.", numbers: "For penalty $0.5\\lambda\\|W\\|_F^2$ with $\\lambda=0.1$ and $W_{12}=3$, the penalty gradient entry is $0.3$." }
    ],
    applicationsClose: "Matrix calculus is the shape-aware chain rule that makes backpropagation concrete, efficient, and checkable with numbers.",
    takeaways: ["For $y=Wx$, backprop gives $\\nabla_WL=gx^T$ and $\\nabla_xL=W^Tg$.", "For least squares, $\\nabla_w\\frac12\\|Aw-b\\|^2=A^T(Aw-b)$.", "Always track shapes; most matrix-calculus mistakes are shape mistakes.", "Backprop is repeated matrix chain rule from a scalar loss backward through each operation."]
  }
};
