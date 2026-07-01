module.exports = {
  "math-11-01": {
    connectionsProse: "<p>This lesson begins the analytic geometry section with the basic language of location. The reader already knows how a number line marks positions with numbers; Cartesian coordinates do the same thing in two or more independent directions at once. Once points can be named by coordinates, later lessons can measure distances, draw lines, describe planes, and build geometric models for data.</p>",
    motivation: "<p>Cartesian coordinates turn location into an ordered list of numbers. In the plane, the first number measures horizontal position and the second measures vertical position. The origin is the reference point where both measurements are zero, and the axes show the directions in which each coordinate changes while the other is held fixed.</p>" +
                "<p>The order matters because each coordinate has a different role. The point $(2,5)$ is not the same as $(5,2)$: one moves $2$ units in the first direction and $5$ in the second, while the other reverses those movements. Adding a third coordinate gives space: $(x,y,z)$ records three independent measurements, such as right-left, forward-back, and up-down.</p>",
    definition: "<p>Cartesian coordinates are a naming system for points. They use axes, an origin, ordered pairs, and ordered triples to record position, and changing the order changes the point.</p>" +
                "<p><b>Assumptions that matter:</b> Each axis measures one coordinate direction while the other coordinates are held fixed.</p>",
    symbols: [
      { sym: "$(x,y)$", desc: "a point in the plane" },
      { sym: "$(x,y,z)$", desc: "a point in space" },
      { sym: "$(0,0)$ or $(0,0,0)$", desc: "the origin" },
      { sym: "axis", desc: "one coordinate direction measured while the other coordinates are held fixed" }
    ],
    applications: [
      { title: "Image locations", background: "Pixel coordinates name a column and row.", numbers: "Pixel $(12,8)$ means column $12$, row $8$." },
      { title: "Bounding boxes", background: "Two corners determine width and height.", numbers: "Corners $(2,3)$ and $(7,9)$ give width $7-2=5$ and height $9-3=6$." },
      { title: "Map offsets", background: "Signs describe direction from the origin.", numbers: "Coordinate $(4,-2)$ means $4$ units east and $2$ units south of the origin." },
      { title: "Data plotting", background: "Coordinates can encode paired measurements.", numbers: "A point $(4,11)$ can encode spend $4$ and clicks $11$." },
      { title: "Quadrant signs", background: "Coordinate signs identify quadrants.", numbers: "Point $(-3,5)$ lies in Quadrant II because $x<0$ and $y>0$." },
      { title: "3-D asset placement", background: "Three coordinates place an object in space.", numbers: "Point $(2,5,1)$ is $2$ units right, $5$ units forward, and $1$ unit up." }
    ]
  },
  "math-11-02": {
    connectionsProse: "<p>Cartesian coordinates describe a point by horizontal and vertical movement. Polar coordinates describe the same point by distance and direction. This gives a second coordinate language that is especially useful whenever circles, angles, rotations, or radial measurements are more natural than rectangular movement.</p>",
    motivation: "<p>A point in the plane can be reached by walking straight out from the origin a distance $r$ while facing an angle $\\theta$ from the positive $x$-axis. That description is polar form. It keeps the radial part and the angular part separate, so a circle centered at the origin can be described by one constant number, $r$.</p>" +
                "<p>To connect polar coordinates back to ordinary graphing, drop a perpendicular from the point to the $x$-axis. The resulting right triangle has hypotenuse $r$, adjacent side $x$, and opposite side $y$. Trigonometry then translates distance and angle into rectangular coordinates, while the distance formula and a quadrant-aware angle recover $r$ and $\\theta$ from $(x,y)$.</p>",
    definition: "<p>Polar coordinates describe a point by radial distance and angle, and convert to rectangular coordinates by</p>" +
                "<p>$$x=r\\cos\\theta,\\qquad y=r\\sin\\theta,\\qquad r=\\sqrt{x^2+y^2},\\qquad \\theta=\\operatorname{atan2}(y,x).$$</p>" +
                "<p><b>Assumptions that matter:</b> The radial distance satisfies $r\\ge0$, and $\\operatorname{atan2}$ is used so the angle has the correct quadrant.</p>",
    symbols: [
      { sym: "$r$", desc: "radial distance, with $r\\ge0$" },
      { sym: "$\\theta$", desc: "angle from the positive $x$-axis" },
      { sym: "$(x,y)$", desc: "Cartesian coordinates" },
      { sym: "$\\operatorname{atan2}$", desc: "the quadrant-aware angle function" }
    ],
    derivation: [
      { do: "Start with a point whose distance from the origin is $r$ and angle is $\\theta$.", result: "$(r,\\theta)$", why: "This is the polar description of the point." },
      { do: "Drop a perpendicular to the $x$-axis.", result: "a right triangle", why: "The triangle connects polar distance and angle to rectangular coordinates." },
      { do: "Use the adjacent side relation.", result: "$\\cos\\theta=x/r$, so $x=r\\cos\\theta$", why: "Multiplying by $r$ gives the horizontal coordinate." },
      { do: "Use the opposite side relation.", result: "$\\sin\\theta=y/r$, so $y=r\\sin\\theta$", why: "Multiplying by $r$ gives the vertical coordinate." },
      { do: "Square and add the coordinate formulas.", result: "$x^2+y^2=r^2(\\cos^2\\theta+\\sin^2\\theta)=r^2$", why: "The identity $\\cos^2\\theta+\\sin^2\\theta=1$ removes the angle." },
      { do: "Take the nonnegative square root.", result: "$r=\\sqrt{x^2+y^2}$", why: "Radial distance is nonnegative." },
      { do: "Use the quadrant-aware angle.", result: "$\\theta=\\operatorname{atan2}(y,x)$", why: "This avoids confusing opposite quadrants." }
    ],
    applications: [
      { title: "Circle parameterization", background: "Polar data converts directly to a point on a circle.", numbers: "$r=5$, $\\theta=53.13^\\circ$ gives $(x,y)\\approx(3,4)$." },
      { title: "Point conversion", background: "A Cartesian point can be converted back to polar form.", numbers: "$(-3,3)$ has $r=\\sqrt{18}\\approx4.243$ and $\\theta=135^\\circ$." },
      { title: "Radar reading", background: "Radar naturally reports distance and bearing.", numbers: "A target at $r=10$, $\\theta=30^\\circ$ is at $(8.660,5.000)$." },
      { title: "Circular crop", background: "Radius decides whether a point lies on a circular boundary.", numbers: "Point $(6,8)$ has $r=10$, so it lies on a radius-$10$ circle." },
      { title: "Angle binning", background: "Angles can be represented in equivalent ranges.", numbers: "Point $(0,-2)$ has $\\theta=-90^\\circ$ or $270^\\circ$." },
      { title: "Spiral path", background: "A polar rule can describe a growing spiral.", numbers: "If $r=2\\theta$ and $\\theta=3$, then $r=6$." }
    ]
  },
  "math-11-03": {
    connectionsProse: "<p>After coordinates name points, the next step is to compare points. Distance tells how far apart two coordinate locations are, and the midpoint names the point exactly halfway between them. These ideas support later formulas for circles, projections, nearest neighbors, and geometric margins.</p>",
    motivation: "<p>Two points in the plane determine a horizontal change and a vertical change. Those changes form the legs of a right triangle, with the straight-line distance as the hypotenuse. The Pythagorean theorem therefore turns coordinate differences into Euclidean distance.</p>" +
                "<p>The midpoint uses a different but related idea: halfway progress in each coordinate direction. To be halfway from $A$ to $B$, the $x$-coordinate must be halfway from $x_1$ to $x_2$, and the $y$-coordinate must be halfway from $y_1$ to $y_2$. Averaging the coordinates gives that balanced location.</p>",
    definition: "<p>For endpoints $A=(x_1,y_1)$ and $B=(x_2,y_2)$, Euclidean distance and midpoint are</p>" +
                "<p>$$d=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2},\\qquad M=\\left(\\frac{x_1+x_2}{2},\\frac{y_1+y_2}{2}\\right).$$</p>" +
                "<p><b>Assumptions that matter:</b> Distance is straight-line Euclidean distance in a coordinate plane.</p>",
    symbols: [
      { sym: "$A,B$", desc: "endpoints" },
      { sym: "$d$", desc: "Euclidean distance" },
      { sym: "$M$", desc: "the midpoint" },
      { sym: "$\\Delta x,\\Delta y$", desc: "coordinate changes" }
    ],
    derivation: [
      { do: "Compute the horizontal change.", result: "$\\Delta x=x_2-x_1$", why: "This is one leg of the right triangle." },
      { do: "Compute the vertical change.", result: "$\\Delta y=y_2-y_1$", why: "This is the other leg." },
      { do: "Apply Pythagoras.", result: "$d^2=(\\Delta x)^2+(\\Delta y)^2$", why: "The segment is the hypotenuse." },
      { do: "Take the nonnegative square root.", result: "$d=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$", why: "Distance is nonnegative." },
      { do: "Move halfway in the $x$ direction.", result: "$M_x=x_1+\\tfrac12(x_2-x_1)=\\tfrac{x_1+x_2}{2}$", why: "A midpoint has equal coordinate progress from both endpoints." },
      { do: "Move halfway in the $y$ direction.", result: "$M_y=\\tfrac{y_1+y_2}{2}$", why: "The same halfway rule applies vertically." }
    ],
    applications: [
      { title: "Segment measurement", background: "Coordinate differences measure a segment.", numbers: "From $(1,2)$ to $(7,10)$, distance is $\\sqrt{6^2+8^2}=10$." },
      { title: "Center of a segment", background: "A midpoint gives the exact center of two endpoints.", numbers: "The same endpoints have midpoint $(4,6)$." },
      { title: "Nearest neighbor in a map", background: "Comparing distances identifies the closer point.", numbers: "Distances from $(0,0)$ to $(3,4)$ and $(6,8)$ are $5$ and $10$, so $(3,4)$ is nearer." },
      { title: "Collision radius", background: "Circle centers and radii determine overlap.", numbers: "Centers $(2,1)$ and $(5,5)$ are $5$ units apart; two radius-$3$ circles overlap because $5<6$." },
      { title: "Screen layout", background: "Midpoints locate visual centers.", numbers: "The midpoint between button corners $(20,10)$ and $(80,50)$ is $(50,30)$." },
      { title: "Local GPS approximation", background: "Small east-north offsets can be treated as perpendicular legs.", numbers: "A $0.3$ km east and $0.4$ km north offset has straight-line length $0.5$ km." }
    ]
  },
  "math-11-04": {
    connectionsProse: "<p>Lines are the first flat objects described by coordinate equations. The reader has already seen points, coordinate changes, and distance; a line adds the idea of a constant direction through the plane. This lesson also prepares for planes and hyperplanes, where normal-vector equations play the same role in higher dimensions.</p>",
    motivation: "<p>A line can be understood as a path that keeps the same rise for each unit of run. Slope records that constant rate of change. If one point on the line is known, keeping the same slope from that point to every other point gives the point-slope equation.</p>" +
                "<p>The same line can also be described by moving all terms to one side. In the equation $ax+by+c=0$, the pair $(a,b)$ acts as a normal direction, perpendicular to the line. This form is especially useful for testing which side of a line a point lies on and for extending the idea to planes and decision boundaries.</p>",
    definition: "<p>A nonvertical line through $P_1=(x_1,y_1)$ and $P_2=(x_2,y_2)$ has slope and point-slope forms</p>" +
                "<p>$$m=\\dfrac{y_2-y_1}{x_2-x_1},\\qquad y-y_1=m(x-x_1),\\qquad ax+by+c=0.$$</p>" +
                "<p><b>Assumptions that matter:</b> The slope formula assumes $x_2\\ne x_1$; vertical lines are described separately by $x=\\text{constant}$.</p>",
    symbols: [
      { sym: "$m$", desc: "slope" },
      { sym: "$b$", desc: "vertical intercept" },
      { sym: "$(x_1,y_1)$", desc: "a known point" },
      { sym: "$a,b,c$", desc: "constants in $ax+by+c=0$ defining a normal-vector form" },
      { sym: "$(a,b)$", desc: "a normal vector to the line" }
    ],
    derivation: [
      { do: "Compute run and rise from two points.", result: "$x_2-x_1$ and $y_2-y_1$", why: "They measure horizontal and vertical change." },
      { do: "Define slope as rise per run.", result: "$m=\\dfrac{y_2-y_1}{x_2-x_1}$", why: "This assumes $x_2\\ne x_1$." },
      { do: "Use the same rise/run from $P_1$ to any point $(x,y)$ on the line.", result: "$\\dfrac{y-y_1}{x-x_1}=m$", why: "All points on the line share the same slope from $P_1$." },
      { do: "Multiply by $x-x_1$.", result: "$y-y_1=m(x-x_1)$", why: "This gives point-slope form." },
      { do: "Expand the equation.", result: "$y=mx+(y_1-mx_1)$", why: "The non-$x$ terms form a constant." },
      { do: "Call the constant $b$ and move all terms to one side.", result: "$y=mx+b$ and $mx-y+b=0$", why: "This connects slope-intercept form to standard form $ax+by+c=0$." }
    ],
    applications: [
      { title: "Trend line through two points", background: "Two points determine a nonvertical line.", numbers: "Points $(0,1)$ and $(2,5)$ give $m=2$ and line $y=2x+1$." },
      { title: "Prediction on a line", background: "A line equation evaluates an output from an input.", numbers: "On $y=2x+1$, input $x=3$ gives $y=7$." },
      { title: "Intersection", background: "Solving two line equations gives their crossing point.", numbers: "Lines $y=2x+1$ and $y=-x+5$ meet at $x=4/3$, $y=11/3$." },
      { title: "Vertical line", background: "A vertical line has constant $x$.", numbers: "All points with $x=4$ lie on the vertical line through $(4,0)$ and $(4,7)$." },
      { title: "Road grade", background: "Slope measures rise per horizontal run.", numbers: "Rise $6$ over run $100$ gives slope $0.06$." },
      { title: "Line-side test", background: "Standard form tests which side a point is on.", numbers: "For $2x-y+1=0$, point $(1,5)$ gives $2-5+1=-2$, so it is on the negative side." }
    ]
  },
  "math-11-05": {
    connectionsProse: "<p>Vectors use coordinates to describe movement rather than fixed position. The same coordinate differences that appeared in distance formulas now become objects that can be added, scaled, and measured. This prepares for dot products, cross products, projections, lines in space, and geometric transformations.</p>",
    motivation: "<p>A vector records a displacement: how far to move in each coordinate direction. It may be drawn with its tail at many different starting points because its meaning is the movement itself, not the absolute location of the drawing. Moving from $A$ to $B$ is therefore described by subtracting the starting coordinates from the ending coordinates.</p>" +
                "<p>Vector operations follow the independence of coordinate directions. Adding vectors combines their horizontal parts and their vertical parts separately. Scaling a vector stretches or reverses the displacement. Measuring its length brings us back to the distance formula, and dividing by that length gives a unit vector with the same direction.</p>",
    definition: "<p>A vector records displacement, supports coordinatewise addition and scaling, and has length</p>" +
                "<p>$$v=B-A=(x_2-x_1,y_2-y_1),\\qquad \\lambda(a,b)=(\\lambda a,\\lambda b),\\qquad \\lVert v\\rVert=\\sqrt{v_x^2+v_y^2},\\qquad \\hat v=v/\\lVert v\\rVert.$$</p>" +
                "<p><b>Assumptions that matter:</b> Unit vectors require $v\\ne0$.</p>",
    symbols: [
      { sym: "$v$", desc: "a vector" },
      { sym: "$v_x,v_y$", desc: "components" },
      { sym: "$\\lambda$", desc: "a scalar" },
      { sym: "$\\lVert v\\rVert$", desc: "length" },
      { sym: "$\\hat v$", desc: "a unit vector" }
    ],
    derivation: [
      { do: "Subtract starting coordinates from ending coordinates.", result: "$v=B-A=(x_2-x_1,y_2-y_1)$", why: "A vector records displacement from $A$ to $B$." },
      { do: "Add displacements coordinatewise.", result: "$(a,b)+(c,d)=(a+c,b+d)$", why: "Horizontal and vertical moves are independent." },
      { do: "Scale a displacement by a scalar.", result: "$\\lambda(a,b)=(\\lambda a,\\lambda b)$", why: "Scaling stretches or reverses each component of the same movement." },
      { do: "Measure length from the origin to the tip.", result: "$\\lVert v\\rVert=\\sqrt{v_x^2+v_y^2}$", why: "This is the distance formula applied to the vector components." },
      { do: "Divide by length.", result: "$\\hat v=v/\\lVert v\\rVert$", why: "Assuming $v\\ne0$, this keeps direction but gives length $1$." }
    ],
    applications: [
      { title: "Displacement", background: "Subtracting points gives a movement vector.", numbers: "From $(1,2)$ to $(4,6)$, the vector is $(3,4)$ with length $5$." },
      { title: "Resultant motion", background: "Successive moves add coordinatewise.", numbers: "Moves $(2,-1)$ and $(-3,5)$ add to $(-1,4)$." },
      { title: "Unit direction", background: "Dividing by length gives a direction of length one.", numbers: "Vector $(3,4)$ has unit vector $(0.6,0.8)$." },
      { title: "Half-step", background: "Scalar multiplication changes the size of a move.", numbers: "Half of $(8,-2)$ is $(4,-1)$." },
      { title: "Polygon edge", background: "An edge can be represented as endpoint displacement.", numbers: "Edge from $(2,3)$ to $(5,1)$ is $(3,-2)$." },
      { title: "Velocity update", background: "Velocity times time updates position.", numbers: "Position $(10,4)$ plus velocity $(1.5,-0.5)$ for $2$ seconds gives $(13,3)$." }
    ]
  },
  "math-11-06": {
    connectionsProse: "<p>Vectors have length and direction, and the dot product turns two vectors into one number that measures how their directions relate. This lesson connects coordinate multiplication with geometric alignment. It also gives the main tool for perpendicularity, projections, plane equations, and distance-to-boundary formulas later in the section.</p>",
    motivation: "<p>The dot product is large and positive when two vectors point in similar directions, zero when their directions are perpendicular, and negative when they point partly against each other. In coordinates, it is computed by multiplying matching components and adding. Geometrically, it measures how much of one vector lies along the other.</p>" +
                "<p>The link between the coordinate formula and the angle formula comes from comparing two ways to compute the same side of a triangle. The vector $a-b$ is the side connecting the tips of $a$ and $b$. Expanding its squared length with dot products and also using the law of cosines shows that the dot product must equal the product of the lengths times $\\cos\\theta$.</p>",
    definition: "<p>The dot product multiplies matching components and adds them, and its geometric form is</p>" +
                "<p>$$a\\cdot b=\\sum_i a_ib_i=\\lVert a\\rVert\\lVert b\\rVert\\cos\\theta.$$</p>" +
                "<p><b>Assumptions that matter:</b> The angle formula uses Euclidean length and the angle $\\theta$ between the two vectors.</p>",
    symbols: [
      { sym: "$a\\cdot b=\\sum_i a_ib_i$", desc: "the dot product" },
      { sym: "$\\theta$", desc: "the angle between vectors" },
      { sym: "$\\lVert a\\rVert$", desc: "length of $a$" },
      { sym: "$\\cos\\theta$", desc: "alignment converted into a scalar" }
    ],
    derivation: [
      { do: "Start with the triangle whose sides are $a$, $b$, and $a-b$.", result: "side $a-b$", why: "It connects the tips of the two vectors." },
      { do: "Expand the squared length algebraically.", result: "$\\lVert a-b\\rVert^2=(a-b)\\cdot(a-b)=\\lVert a\\rVert^2-2a\\cdot b+\\lVert b\\rVert^2$", why: "The dot product distributes over vector subtraction." },
      { do: "Apply the law of cosines to the same triangle.", result: "$\\lVert a-b\\rVert^2=\\lVert a\\rVert^2+\\lVert b\\rVert^2-2\\lVert a\\rVert\\lVert b\\rVert\\cos\\theta$", why: "This computes the same side length geometrically." },
      { do: "Set the two right-hand sides equal.", result: "$\\lVert a\\rVert^2-2a\\cdot b+\\lVert b\\rVert^2=\\lVert a\\rVert^2+\\lVert b\\rVert^2-2\\lVert a\\rVert\\lVert b\\rVert\\cos\\theta$", why: "They describe the same length." },
      { do: "Cancel matching squared-length terms.", result: "$-2a\\cdot b=-2\\lVert a\\rVert\\lVert b\\rVert\\cos\\theta$", why: "$\\lVert a\\rVert^2+\\lVert b\\rVert^2$ appears on both sides." },
      { do: "Divide by $-2$.", result: "$a\\cdot b=\\lVert a\\rVert\\lVert b\\rVert\\cos\\theta$", why: "This isolates the geometric dot-product formula." }
    ],
    applications: [
      { title: "Angle between directions", background: "The dot product can recover an angle.", numbers: "$a=(3,4)$ and $b=(5,0)$ give $a\\cdot b=15$, so $\\cos\\theta=15/(5\\cdot5)=0.6$ and $\\theta\\approx53.13^\\circ$." },
      { title: "Scalar projection", background: "Projection length comes from a dot product divided by target length.", numbers: "The projection of $(3,4)$ onto $(5,0)$ has length $15/5=3$." },
      { title: "Perpendicular check", background: "A zero dot product means perpendicular directions.", numbers: "$(2,-1)\\cdot(1,2)=0$, so the directions are perpendicular." },
      { title: "Lighting", background: "Brightness can be modeled by alignment with a normal.", numbers: "A unit normal $(0,0,1)$ and light direction $(0,0,0.8)$ give brightness $0.8$." },
      { title: "Obtuse turn", background: "A negative dot product indicates more than a right angle.", numbers: "$(1,0)\\cdot(-2,1)=-2$, so the angle is obtuse." },
      { title: "Similarity of arrows", background: "For unit vectors, the dot product is cosine similarity.", numbers: "Unit vectors with dot product $0.25$ have angle $\\arccos(0.25)\\approx75.52^\\circ$." }
    ]
  },
  "math-11-07": {
    connectionsProse: "<p>The dot product measures alignment with a scalar. The cross product answers a different geometric need in three dimensions: it builds a perpendicular direction. This is the natural language for surface normals, oriented turns, triangle area, and plane construction.</p>",
    motivation: "<p>In 3-D, two nonparallel vectors determine a flat parallelogram. A vector perpendicular to that parallelogram gives its normal direction, and its length can store the parallelogram area. The cross product packages both pieces: direction by the right-hand rule and length by the area spanned by the two input vectors.</p>" +
                "<p>The coordinate formula may look longer than the dot product, but it is built to satisfy two simple constraints. The result must be perpendicular to $a$ and also perpendicular to $b$. Expanding the determinant gives components arranged so that dotting with either input cancels to zero, and Lagrange's identity confirms the area formula.</p>",
    definition: "<p>For $a=(a_1,a_2,a_3)$ and $b=(b_1,b_2,b_3)$, the cross product is the perpendicular vector</p>" +
                "<p>$$a\\times b=(a_2b_3-a_3b_2,\\,a_3b_1-a_1b_3,\\,a_1b_2-a_2b_1),\\qquad \\lVert a\\times b\\rVert=\\lVert a\\rVert\\lVert b\\rVert\\sin\\theta.$$</p>" +
                "<p><b>Assumptions that matter:</b> The cross product here is the usual 3-D operation, with direction determined by the right-hand rule.</p>",
    symbols: [
      { sym: "$a\\times b$", desc: "the cross product" },
      { sym: "$\\mathbf i,\\mathbf j,\\mathbf k$", desc: "coordinate unit vectors" },
      { sym: "$\\theta$", desc: "the angle between $a$ and $b$" },
      { sym: "right-hand rule", desc: "the convention determining cross-product direction" }
    ],
    derivation: [
      { do: "Seek a vector $c=(c_1,c_2,c_3)$ perpendicular to both $a$ and $b$.", result: "$c\\cdot a=0$ and $c\\cdot b=0$", why: "A normal direction must be perpendicular to both input vectors." },
      { do: "Use the determinant construction.", result: "$a\\times b=\\det\\begin{bmatrix}\\mathbf i&\\mathbf j&\\mathbf k\\a_1&a_2&a_3\\b_1&b_2&b_3\\end{bmatrix}$", why: "This construction encodes the perpendicularity constraints." },
      { do: "Expand along the first row.", result: "$a\\times b=(a_2b_3-a_3b_2,\\,a_3b_1-a_1b_3,\\,a_1b_2-a_2b_1)$", why: "The expansion gives the coordinate formula." },
      { do: "Dot the result with $a$.", result: "$a\\cdot(a\\times b)=0$", why: "Terms cancel in pairs." },
      { do: "Dot the result with $b$.", result: "$b\\cdot(a\\times b)=0$", why: "Terms cancel again, confirming perpendicularity to $b$." },
      { do: "Use Lagrange's identity.", result: "$\\lVert a\\times b\\rVert^2=\\lVert a\\rVert^2\\lVert b\\rVert^2-(a\\cdot b)^2=\\lVert a\\rVert^2\\lVert b\\rVert^2\\sin^2\\theta$", why: "It connects the coordinate formula to the area formula." },
      { do: "Take the nonnegative square root.", result: "$\\lVert a\\times b\\rVert=\\lVert a\\rVert\\lVert b\\rVert\\sin\\theta$", why: "This is the parallelogram area." }
    ],
    applications: [
      { title: "Surface normal", background: "The cross product gives a normal to a spanned surface.", numbers: "$a=(1,2,2)$ and $b=(3,0,4)$ give $a\\times b=(8,2,-6)$." },
      { title: "Triangle area", background: "Triangle area is half the parallelogram area.", numbers: "The triangle spanned by those vectors has area $\\tfrac12\\sqrt{104}\\approx5.099$." },
      { title: "Parallelogram area", background: "The cross-product length is the spanned parallelogram area.", numbers: "The same pair spans area $\\sqrt{104}\\approx10.198$." },
      { title: "2-D orientation", background: "The $z$ component of a 2-D cross product indicates turn direction.", numbers: "For edges $(2,0)$ and $(0,3)$, the $z$-cross is $6$, so the turn is counterclockwise." },
      { title: "Plane normal", background: "Two edges in a plane determine a normal.", numbers: "Points $(0,0,0)$, $(1,0,0)$, and $(0,2,0)$ have normal $(0,0,2)$." },
      { title: "Degenerate triangle", background: "Parallel vectors span zero area.", numbers: "Vectors $(1,1,1)$ and $(2,2,2)$ have cross product $(0,0,0)$, so the area is $0$." }
    ]
  },
  "math-11-08": {
    connectionsProse: "<p>A line in the plane can be described by slope, but space has more than one possible sideways direction. The vector language from earlier lessons gives a cleaner description. A 3-D line is built from an anchor point and a direction vector, and this same form is used for rays, motion paths, and interpolation.</p>",
    motivation: "<p>To move along a line in space, start at a known point and take some scalar number of steps in one fixed direction. The parameter $t$ records how many copies of the direction vector have been taken. Positive, negative, and fractional values of $t$ move to different points on the same infinite line.</p>" +
                "<p>Distance from a point to a 3-D line is easiest to see through area. The vector from the line's anchor to the outside point and the direction vector form a parallelogram. Its area is also base times height, where the height is the perpendicular distance to the line. Dividing the cross-product area by the base length gives the distance formula.</p>",
    definition: "<p>A 3-D line with anchor $r_0$ and nonzero direction $v$ has parametric form and point-to-line distance</p>" +
                "<p>$$r(t)=r_0+t v,\\qquad d=\\dfrac{\\lVert(P-r_0)\\times v\\rVert}{\\lVert v\\rVert}.$$</p>" +
                "<p><b>Assumptions that matter:</b> The direction vector must be nonzero, and distance is perpendicular Euclidean distance.</p>",
    symbols: [
      { sym: "$r_0$", desc: "a point on the line" },
      { sym: "$v$", desc: "the direction vector" },
      { sym: "$t$", desc: "a real parameter" },
      { sym: "$P$", desc: "an outside point" },
      { sym: "$d$", desc: "perpendicular distance to the line" }
    ],
    derivation: [
      { do: "Start at a point on the line.", result: "$r_0$", why: "An anchor fixes one known location on the line." },
      { do: "Move $t$ copies of the direction vector.", result: "$r(t)=r_0+t v$", why: "Changing $t$ traces all points on the line." },
      { do: "For an outside point $P$, form the anchor-to-point vector.", result: "$P-r_0$", why: "This vector connects the line anchor to the point being measured." },
      { do: "Compute the parallelogram area formed by $P-r_0$ and $v$.", result: "$\\lVert(P-r_0)\\times v\\rVert$", why: "Cross-product length gives parallelogram area." },
      { do: "Write the same area as base times height.", result: "$\\lVert v\\rVert\\,d$", why: "The base is the direction-vector length and the height is point-to-line distance." },
      { do: "Divide by the base length.", result: "$d=\\dfrac{\\lVert(P-r_0)\\times v\\rVert}{\\lVert v\\rVert}$", why: "This isolates the perpendicular distance." }
    ],
    applications: [
      { title: "Point on a ray", background: "A parameter chooses a point along a ray or line.", numbers: "With $r_0=(1,1,1)$ and $v=(1,2,2)$, $t=2$ gives $(3,5,5)$." },
      { title: "Point-to-line distance", background: "The cross-product formula measures perpendicular distance.", numbers: "Point $(2,3,4)$ to that line has distance $\\sqrt5/3\\approx0.745$." },
      { title: "Camera ray", background: "A viewing ray starts at a camera and moves in a direction.", numbers: "Ray $(0,0,0)+5(0,0,1)$ reaches $(0,0,5)$." },
      { title: "Linear interpolation", background: "Fractional parameters move partway between endpoints.", numbers: "From $A=(1,2,3)$ to $B=(5,2,3)$, $t=0.25$ gives $(2,2,3)$." },
      { title: "Closest approach to a vertical line", background: "Distance to the $z$-axis ignores height and measures horizontal offset.", numbers: "Point $(3,4,2)$ to the $z$-axis has distance $5$." },
      { title: "Motion path", background: "Velocity gives a direction scaled by time.", numbers: "Starting $(2,0,1)$ with velocity $(0,3,-1)$ for $4$ seconds gives $(2,12,-3)$." }
    ]
  },
  "math-11-09": {
    connectionsProse: "<p>Lines in 3-D use a direction vector; planes use a normal vector. This lesson extends the normal-form idea from lines in the plane to flat sheets in space. It also prepares for clipping planes, point-to-plane distance, and the hyperplane decision boundaries used in machine learning.</p>",
    motivation: "<p>A plane is the 3-D version of a flat sheet. Vectors that lie inside the sheet can point in many directions, but they all share one property: they are perpendicular to the plane's normal vector. If a known point $r_0$ lies on the plane, then any other point $r$ on the plane creates an inside-sheet displacement $r-r_0$.</p>" +
                "<p>The dot product records perpendicularity, so the equation $n\\cdot(r-r_0)=0$ describes the whole plane. After expansion, the equation becomes $ax+by+cz=d$. For a point not on the plane, the signed numerator $n\\cdot P-d$ measures offset in the normal direction, and dividing by the normal length turns that offset into Euclidean distance.</p>",
    definition: "<p>A plane with normal $n=(a,b,c)$ through $r_0=(x_0,y_0,z_0)$ satisfies</p>" +
                "<p>$$n\\cdot(r-r_0)=0,\\qquad ax+by+cz=d,\\qquad \\operatorname{dist}(P,\\Pi)=\\dfrac{|n\\cdot P-d|}{\\lVert n\\rVert}.$$</p>" +
                "<p><b>Assumptions that matter:</b> The normal vector is nonzero and distance is measured perpendicular to the plane.</p>",
    symbols: [
      { sym: "$n$", desc: "the normal vector" },
      { sym: "$r_0$", desc: "a point on the plane" },
      { sym: "$d$", desc: "the plane constant" },
      { sym: "$P$", desc: "a test point" },
      { sym: "$\\Pi$", desc: "the plane" }
    ],
    derivation: [
      { do: "Let $r=(x,y,z)$ be a point in the plane.", result: "$r-r_0$", why: "This is a displacement inside the sheet." },
      { do: "Use perpendicularity to the normal.", result: "$n\\cdot(r-r_0)=0$", why: "Inside-plane displacements are perpendicular to the normal." },
      { do: "Expand the dot product.", result: "$a(x-x_0)+b(y-y_0)+c(z-z_0)=0$", why: "This writes the plane condition in coordinates." },
      { do: "Rearrange terms.", result: "$ax+by+cz=d$, where $d=ax_0+by_0+cz_0$", why: "The known point determines the constant." },
      { do: "Evaluate a test point $P$ in the plane expression.", result: "$n\\cdot P-d$", why: "This is the signed offset from the plane in the normal direction." },
      { do: "Divide by the normal length and take absolute value.", result: "$\\operatorname{dist}(P,\\Pi)=\\dfrac{|n\\cdot P-d|}{\\lVert n\\rVert}$", why: "This converts normal offset into Euclidean distance." }
    ],
    applications: [
      { title: "Plane from point and normal", background: "A normal and point determine a plane.", numbers: "Normal $(2,-1,2)$ through $(1,0,1)$ gives $2x-y+2z=4$." },
      { title: "Point-to-plane distance", background: "Distance divides signed offset by normal length.", numbers: "Point $(3,1,0)$ to that plane has distance $|6-1-4|/3=1/3$." },
      { title: "Side test", background: "The sign of the numerator identifies a side of the plane.", numbers: "The same point has signed numerator $1$, so it lies on the positive-normal side." },
      { title: "Horizontal slice", background: "A constant height equation describes a horizontal plane.", numbers: "Plane $z=3$ is reached by all points with height $3$." },
      { title: "Triangle plane", background: "Three noncollinear points determine a plane.", numbers: "Points $(0,0,0)$, $(1,0,0)$, $(0,1,0)$ define plane $z=0$." },
      { title: "Clipping plane", background: "A clipping equation keeps points on a boundary.", numbers: "For $x+y+z=6$, point $(1,2,3)$ lies exactly on the clip because the left side is $6$." }
    ]
  },
  "math-11-10": {
    connectionsProse: "<p>Distance formulas now become equations for curved shapes. A circle keeps one fixed distance from a center, while an ellipse stretches that idea differently along two axes. These conics appear throughout geometry, graphics, physical modeling, and data contours.</p>",
    motivation: "<p>A circle is the set of all points at the same distance from a center. Once the center is $(h,k)$, the distance formula gives the circle equation directly. Squaring removes the square root and leaves a clean relationship between horizontal and vertical offsets.</p>" +
                "<p>An ellipse can be viewed as a circle after different scaling in the horizontal and vertical directions. Dividing the horizontal offset by $a$ and the vertical offset by $b$ measures distance in scaled coordinates. The focus relationship adds the classical geometric interpretation: for a horizontal ellipse, the two focus distances are arranged so their sum stays constant.</p>",
    definition: "<p>A circle has fixed distance from its center, while a standard ellipse has unit scaled radius:</p>" +
                "<p>$$(x-h)^2+(y-k)^2=r^2,\\qquad \\dfrac{(x-h)^2}{a^2}+\\dfrac{(y-k)^2}{b^2}=1,\\qquad c^2=a^2-b^2.$$</p>" +
                "<p><b>Assumptions that matter:</b> The ellipse formula uses positive semi-axis lengths, and $c^2=a^2-b^2$ is for a horizontal ellipse with $a\\ge b$.</p>",
    symbols: [
      { sym: "$(h,k)$", desc: "the center" },
      { sym: "$r$", desc: "circle radius" },
      { sym: "$a,b$", desc: "ellipse semi-axis lengths" },
      { sym: "$c$", desc: "center-to-focus distance" },
      { sym: "foci", desc: "the two fixed points defining the ellipse" }
    ],
    derivation: [
      { do: "Start with a circle of radius $r$ centered at $(h,k)$.", result: "distance to $(h,k)$ is $r$", why: "A circle contains points at one fixed distance from the center." },
      { do: "Use the distance formula.", result: "$\\sqrt{(x-h)^2+(y-k)^2}=r$", why: "This measures distance from $(x,y)$ to the center." },
      { do: "Square both sides.", result: "$(x-h)^2+(y-k)^2=r^2$", why: "Squaring removes the square root." },
      { do: "Scale horizontal distance by $a$ and vertical distance by $b$.", result: "scaled coordinates $(\\frac{x-h}{a},\\frac{y-k}{b})$", why: "An ellipse is a circle after different coordinate scalings." },
      { do: "Write the scaled radius condition.", result: "$(\\frac{x-h}{a})^2+(\\frac{y-k}{b})^2=1$", why: "The scaled point lies on a unit circle." },
      { do: "Rearrange the scaled condition.", result: "$\\dfrac{(x-h)^2}{a^2}+\\dfrac{(y-k)^2}{b^2}=1$", why: "This is the standard ellipse equation." },
      { do: "Use the endpoint focus-distance relation for a horizontal ellipse.", result: "$c^2=a^2-b^2$", why: "At endpoint $(h+a,k)$, focus distances $(a-c)$ and $(a+c)$ sum to $2a$." }
    ],
    applications: [
      { title: "Circle membership", background: "A point lies on a circle when squared offsets equal $r^2$.", numbers: "For center $(2,1)$ and radius $5$, point $(5,5)$ lies on the circle because $(3)^2+(4)^2=25$." },
      { title: "Ellipse value", background: "The ellipse expression decides inside or outside.", numbers: "In $x^2/25+y^2/9=1$, point $(3,2)$ gives $9/25+4/9\\approx0.804<1$, so it is inside." },
      { title: "Ellipse foci", background: "Semi-axis lengths determine focus distance.", numbers: "With $a=5$, $b=3$, $c=\\sqrt{25-9}=4$." },
      { title: "Ellipse area", background: "An ellipse scales a circle by factors $a$ and $b$.", numbers: "The area is $\\pi ab=15\\pi\\approx47.124$." },
      { title: "Circular mask", background: "A radius test can define a circular mask.", numbers: "Point $(6,8)$ is on the radius-$10$ circle because $6^2+8^2=100$." },
      { title: "Axis endpoints", background: "Semi-axis length gives endpoint locations from the center.", numbers: "Ellipse centered at $(1,2)$ with $a=4$, $b=2$ has horizontal endpoints $(-3,2)$ and $(5,2)$." }
    ]
  },
  "math-11-11": {
    connectionsProse: "<p>Circles and ellipses describe constant distance or constant distance-sum relationships. Parabolas and hyperbolas complete the standard family of conics by changing the distance rule. This lesson keeps the same coordinate-based approach while introducing focus-directrix and distance-difference geometry.</p>",
    motivation: "<p>A parabola balances distance from a point, called the focus, with distance from a line, called the directrix. For the standard horizontal setup, this equality creates a curve opening to the right or left. Squaring the distance equation simplifies the condition into the familiar form $y^2=4px$.</p>" +
                "<p>A hyperbola uses two foci differently. Instead of keeping the sum of distances fixed, it keeps the difference of distances fixed. In standard position this produces an equation with one squared term subtracted from another, which explains the two-branch shape and the asymptotes that guide it.</p>",
    definition: "<p>A standard horizontal parabola and hyperbola are described by</p>" +
                "<p>$$y^2=4px,\\qquad \\dfrac{x^2}{a^2}-\\dfrac{y^2}{b^2}=1,\\qquad c^2=a^2+b^2.$$</p>" +
                "<p><b>Assumptions that matter:</b> The parabola derivation uses focus $(p,0)$, directrix $x=-p$, and points to the right of the directrix; the hyperbola formula is in standard horizontal position.</p>",
    symbols: [
      { sym: "$p$", desc: "focus distance for the parabola" },
      { sym: "$a,b$", desc: "hyperbola semi-axis parameters" },
      { sym: "$c$", desc: "focus distance" },
      { sym: "directrix", desc: "the fixed line used in the parabola definition" }
    ],
    derivation: [
      { do: "Use the parabola definition.", result: "distance to focus equals distance to directrix", why: "A parabola balances a point and a line." },
      { do: "Write the equality for focus $(p,0)$ and directrix $x=-p$.", result: "$\\sqrt{(x-p)^2+y^2}=x+p$", why: "This applies to points to the right of the directrix." },
      { do: "Square both sides.", result: "$(x-p)^2+y^2=(x+p)^2$", why: "Squaring removes the square root." },
      { do: "Expand both sides.", result: "$x^2-2px+p^2+y^2=x^2+2px+p^2$", why: "Expansion reveals cancellable terms." },
      { do: "Cancel $x^2$ and $p^2$, then add $2px$.", result: "$y^2=4px$", why: "This is the standard horizontal parabola form." },
      { do: "State the horizontal hyperbola form.", result: "$\\dfrac{x^2}{a^2}-\\dfrac{y^2}{b^2}=1$ with $c^2=a^2+b^2$", why: "It represents a scaled difference-of-distances relationship." }
    ],
    applications: [
      { title: "Parabola parameter", background: "The coefficient $4p$ identifies the focus distance.", numbers: "$y^2=8x$ has $4p=8$, so $p=2$ and focus $(2,0)$." },
      { title: "Point on parabola", background: "Substitution finds a coordinate on the curve.", numbers: "In $y^2=8x$, $y=4$ gives $x=2$." },
      { title: "Vertex shift", background: "Shifted standard form reveals vertex and parameter.", numbers: "$(y-1)^2=12(x+2)$ has vertex $(-2,1)$ and $p=3$." },
      { title: "Hyperbola foci", background: "Hyperbola focus distance uses $c^2=a^2+b^2$.", numbers: "$x^2/9-y^2/4=1$ has $c=\\sqrt{13}\\approx3.606$." },
      { title: "Hyperbola asymptotes", background: "The semi-axis parameters determine guiding asymptotes.", numbers: "For that hyperbola, asymptotes are $y=\\pm(2/3)x$." },
      { title: "Membership", background: "A point satisfying the equation lies on the conic.", numbers: "Point $(3,0)$ satisfies $x^2/9-y^2/4=1$, so it is a vertex." }
    ]
  },
  "math-11-12": {
    connectionsProse: "<p>Conic equations often contain squared terms and cross terms. A quadratic form packages those terms into matrix notation, which makes the geometry easier to classify. This connects analytic geometry with linear algebra through eigenvalues, rotations, ellipses, and saddle shapes.</p>",
    motivation: "<p>The expression $x^TAx$ turns a coordinate vector into a single quadratic value. When $A$ is symmetric, the off-diagonal entries create the cross term, and the diagonal entries create the pure squared terms. This compact notation is useful because the matrix stores the whole shape.</p>" +
                "<p>The eigenvectors of a symmetric matrix give rotated coordinate axes where the cross term disappears. In those coordinates, the quadratic form is just a weighted sum of squares. Positive weights produce ellipse-like level sets, while mixed signs produce saddle-like behavior.</p>",
    definition: "<p>For a symmetric matrix $A=\\begin{bmatrix}a&b\\b&c\\end{bmatrix}$ and $x=(u,v)^T$, the quadratic form is</p>" +
                "<p>$$x^TAx=au^2+2buv+cv^2,\\qquad x^TAx=\\lambda_1z_1^2+\\lambda_2z_2^2\\text{ in eigen-coordinates}.$$</p>" +
                "<p><b>Assumptions that matter:</b> The clean eigen-coordinate classification uses a symmetric matrix and an orthonormal eigenbasis.</p>",
    symbols: [
      { sym: "$A$", desc: "a symmetric matrix" },
      { sym: "$x$", desc: "a coordinate vector" },
      { sym: "$x^TAx$", desc: "the quadratic form" },
      { sym: "$\\lambda_i$", desc: "eigenvalues" },
      { sym: "$2buv$", desc: "the cross term recording axis rotation" }
    ],
    derivation: [
      { do: "Write the coordinate vector.", result: "$x=(u,v)^T$", why: "The variables are the coordinates of the point." },
      { do: "Multiply by the symmetric matrix.", result: "$Ax=(au+bv,bu+cv)^T$", why: "This applies the matrix to the coordinate vector." },
      { do: "Dot with $x$.", result: "$x^TAx=u(au+bv)+v(bu+cv)$", why: "The quadratic form is $x$ dotted with $Ax$." },
      { do: "Combine like terms.", result: "$x^TAx=au^2+2buv+cv^2$", why: "The two off-diagonal terms combine into the cross term." },
      { do: "Use a symmetric matrix's orthonormal eigenbasis.", result: "rotated coordinates without length stretching", why: "Symmetry gives perpendicular eigenvectors." },
      { do: "Rewrite the form in eigen-coordinates $z$.", result: "$\\lambda_1z_1^2+\\lambda_2z_2^2$", why: "The cross term disappears in the eigenbasis." },
      { do: "Classify by eigenvalue signs.", result: "positive eigenvalues give ellipses; mixed signs give saddle-like behavior", why: "The signs determine whether squared terms bound the level set or oppose each other." }
    ],
    applications: [
      { title: "Evaluate a form", background: "Matrix notation evaluates a quadratic expression.", numbers: "With $A=\\begin{bmatrix}3&1\\1&3\\end{bmatrix}$ and $x=(1,2)$, $x^TAx=19$." },
      { title: "Classify definiteness", background: "Eigenvalue signs classify a quadratic form.", numbers: "The eigenvalues are $2$ and $4$, so the form is positive definite." },
      { title: "Ellipse axes", background: "Eigenvalues determine level-set semi-axis lengths.", numbers: "Level $x^TAx=12$ has semi-axis lengths $\\sqrt{12/2}\\approx2.449$ and $\\sqrt{12/4}\\approx1.732$." },
      { title: "Saddle form", background: "Mixed signs produce saddle-like values.", numbers: "$x^2-y^2$ at $(2,1)$ gives $3$ and has mixed signs." },
      { title: "Conic discriminant", background: "The discriminant helps identify conic type.", numbers: "For $3x^2+2xy+3y^2=1$, $B^2-4AC=4-36=-32<0$, an ellipse type." },
      { title: "Mahalanobis contour", background: "A diagonal quadratic form can describe a contour.", numbers: "If $A=\\operatorname{diag}(1/4,1)$, then point $(2,1)$ has value $2$." }
    ]
  },
  "math-11-13": {
    connectionsProse: "<p>Quadric surfaces extend conic geometry from two variables to three. The same squared-term patterns that create ellipses, hyperbolas, and parabolas now create surfaces in space. This lesson prepares the reader to recognize 3-D shapes from equations and from their 2-D slices.</p>",
    motivation: "<p>A diagonal quadric equation tells how the squared coordinates are allowed to trade off. If all three squared terms are positive and bounded by $1$, the surface closes into an ellipsoid. The intercepts appear by setting two variables to zero and solving for the remaining coordinate.</p>" +
                "<p>Changing signs or replacing a squared term with a linear term changes the shape. A negative squared term creates hyperboloid behavior because slices grow as the corresponding coordinate moves away from zero. A linear term paired with squared terms creates a paraboloid, where height grows like a quadratic in the other coordinates.</p>",
    definition: "<p>A diagonal quadric is read from its squared-term signs and scales, for example</p>" +
                "<p>$$\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}+\\dfrac{z^2}{c^2}=1,\\qquad \\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}-\\dfrac{z^2}{c^2}=1,\\qquad z=\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}.$$</p>" +
                "<p><b>Assumptions that matter:</b> These standard forms are diagonal and centered or aligned with the coordinate axes.</p>",
    symbols: [
      { sym: "$a,b,c$", desc: "semi-axis scales" },
      { sym: "traces", desc: "2-D slices" },
      { sym: "signs of squared terms", desc: "features that determine bounded or saddle-like behavior" }
    ],
    derivation: [
      { do: "Start with the ellipsoid equation.", result: "$\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}+\\dfrac{z^2}{c^2}=1$", why: "This is the diagonal all-positive standard form." },
      { do: "Set $y=z=0$.", result: "$x=\\pm a$", why: "This finds the $x$-intercepts." },
      { do: "Set two coordinates to zero in the other directions.", result: "$y=\\pm b$ and $z=\\pm c$", why: "These are the $y$- and $z$-intercepts." },
      { do: "Interpret the positive bounded squared terms.", result: "an ellipsoid", why: "The sum of nonnegative scaled squares is bounded by $1$." },
      { do: "Change one squared-term sign.", result: "$\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}-\\dfrac{z^2}{c^2}=1$", why: "The resulting traces grow as $|z|$ grows, giving hyperboloid behavior." },
      { do: "Replace one squared term by a linear term.", result: "$z=\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}$", why: "This produces a paraboloid." }
    ],
    applications: [
      { title: "Ellipsoid intercepts", background: "Intercepts come from setting other variables to zero.", numbers: "$x^2/9+y^2/4+z^2/16=1$ has intercepts $\\pm3$, $\\pm2$, $\\pm4$." },
      { title: "Ellipsoid membership", background: "Substitution decides whether a point lies inside or outside.", numbers: "Point $(2,1,3)$ gives $4/9+1/4+9/16\\approx1.257>1$, so it is outside." },
      { title: "Hyperboloid slice", background: "Fixing one coordinate reveals a 2-D trace.", numbers: "For $x^2+y^2-z^2/4=1$, at $z=2$ the slice is $x^2+y^2=2$." },
      { title: "Paraboloid height", background: "A paraboloid equation gives height from horizontal coordinates.", numbers: "For $z=(x^2+y^2)/4$, point $(2,1)$ has $z=1.25$." },
      { title: "Cone slice", background: "A cone's horizontal slice has radius equal to height magnitude.", numbers: "Cone $z^2=x^2+y^2$ at $z=3$ has radius $3$." },
      { title: "Cylinder", background: "A missing variable means the surface extends along that direction.", numbers: "Equation $x^2+y^2=4$ ignores $z$, so $(0,2,7)$ lies on it." }
    ]
  },
  "math-11-14": {
    connectionsProse: "<p>The dot product measures how much one vector points along another. Projection turns that measurement into an actual vector in the chosen direction. This lesson connects alignment, closest points, shadows, residuals, and the geometry behind least squares.</p>",
    motivation: "<p>A projection keeps the part of a vector that lies along a target direction and removes the perpendicular part. If the target direction is $u$, the projected vector must be some scalar multiple of $u$. The only question is which scalar gives the closest point on that line.</p>" +
                "<p>The closest point occurs when the leftover residual is perpendicular to the target direction. If the residual still had a component along $u$, moving farther along the line would reduce the error. Setting the residual's dot product with $u$ to zero solves for the scalar and gives the projection formula.</p>",
    definition: "<p>The projection of $v$ onto a nonzero vector $u$ is</p>" +
                "<p>$$\\operatorname{proj}_u(v)=\\dfrac{v\\cdot u}{u\\cdot u}u.$$</p>" +
                "<p><b>Assumptions that matter:</b> The target direction $u$ must be nonzero, and the residual is perpendicular to $u$ at the closest point.</p>",
    symbols: [
      { sym: "$v$", desc: "the vector being projected" },
      { sym: "$u$", desc: "the nonzero target direction" },
      { sym: "$\\alpha$", desc: "the scalar coordinate along $u$" },
      { sym: "residual", desc: "the perpendicular leftover" }
    ],
    derivation: [
      { do: "Write the projection as a multiple of $u$.", result: "$\\alpha u$", why: "The projection must lie along the target direction." },
      { do: "Require the residual to be perpendicular to $u$.", result: "$v-\\alpha u\\perp u$", why: "Perpendicular residual gives the closest point on the line." },
      { do: "Set the dot product to zero.", result: "$(v-\\alpha u)\\cdot u=0$", why: "Dot product zero records perpendicularity." },
      { do: "Expand the dot product.", result: "$v\\cdot u-\\alpha(u\\cdot u)=0$", why: "This isolates the unknown scalar linearly." },
      { do: "Solve for the scalar.", result: "$\\alpha=\\dfrac{v\\cdot u}{u\\cdot u}$", why: "$u\\cdot u\\ne0$ because $u\\ne0$." },
      { do: "Substitute back into $\\alpha u$.", result: "$\\operatorname{proj}_u(v)=\\dfrac{v\\cdot u}{u\\cdot u}u$", why: "This gives the projection vector." }
    ],
    applications: [
      { title: "Projection length", background: "A scalar projection measures how far along a unit direction the vector reaches.", numbers: "For unit $u=(3/5,4/5)$ and $v=(6,2)$, scalar projection is $5.2$." },
      { title: "Projection vector", background: "Multiplying scalar projection by the unit direction gives the vector projection.", numbers: "The projected vector is $(3.12,4.16)$." },
      { title: "Residual", background: "Subtracting the projection leaves a perpendicular component.", numbers: "The perpendicular leftover is $(2.88,-2.16)$ with length $3.6$." },
      { title: "Closest point on an axis", background: "Projection onto an axis drops the perpendicular coordinate.", numbers: "Project $(3,4)$ onto the $x$-axis to get $(3,0)$." },
      { title: "Least-squares coefficient", background: "A one-feature least-squares coefficient is a projection scalar.", numbers: "Project $y=(2,4)$ onto $x=(1,1)$: coefficient is $6/2=3$." },
      { title: "Road snapping", background: "Projection finds the closest point on a road direction.", numbers: "On a road direction $(1,0)$, location $(8,3)$ projects to $(8,0)$, so the offset is $3$." }
    ]
  },
  "math-11-15": {
    connectionsProse: "<p>Projections split a vector into a part along a direction and a perpendicular leftover. Reflections use exactly that split. Keeping one part and flipping the other gives a clean geometric transformation that can be written as a matrix.</p>",
    motivation: "<p>A reflection across a mirror line leaves anything on the mirror unchanged. The part perpendicular to the mirror crosses to the opposite side with the same length. If a vector is decomposed into parallel and perpendicular parts, the reflection rule becomes simple: keep the parallel part and negate the perpendicular part.</p>" +
                "<p>When the mirror line passes through the origin and has unit direction $u$, the projection $(u\\cdot x)u$ gives the parallel part. Subtracting that from $x$ gives the perpendicular leftover. Combining the kept and flipped pieces leads to the compact formula $x'=2(u\\cdot x)u-x$, and matrix notation turns it into $2uu^T-I$.</p>",
    definition: "<p>Reflecting $x$ across the line through the origin in unit direction $u$ gives</p>" +
                "<p>$$x'=2(u\\cdot x)u-x=(2uu^T-I)x.$$</p>" +
                "<p><b>Assumptions that matter:</b> The mirror line passes through the origin, and $u$ is a unit vector along that line.</p>",
    symbols: [
      { sym: "$u$", desc: "a unit vector along the mirror line" },
      { sym: "$I$", desc: "the identity matrix" },
      { sym: "$2uu^T-I$", desc: "the reflection matrix" },
      { sym: "$x'$", desc: "the reflected point or vector" }
    ],
    derivation: [
      { do: "Split $x$ into parallel and perpendicular parts.", result: "$x=(u\\cdot x)u+\\bigl(x-(u\\cdot x)u\\bigr)$", why: "Projection gives the mirror-line component and the leftover is perpendicular." },
      { do: "Keep the parallel part unchanged.", result: "$(u\\cdot x)u$", why: "Points on the mirror line do not move under reflection." },
      { do: "Negate the perpendicular part.", result: "$-\\bigl(x-(u\\cdot x)u\\bigr)$", why: "The perpendicular component crosses to the opposite side." },
      { do: "Combine the kept and flipped pieces.", result: "$x'=(u\\cdot x)u-\\bigl(x-(u\\cdot x)u\\bigr)$", why: "This implements the reflection rule." },
      { do: "Combine like terms.", result: "$x'=2(u\\cdot x)u-x$", why: "The two parallel parts add." },
      { do: "Rewrite the projection in matrix form.", result: "$x'=(2uu^T-I)x$", why: "Since $(u\\cdot x)u=(uu^T)x$, reflection is a matrix transformation." }
    ],
    applications: [
      { title: "Reflect across the $x$-axis", background: "An $x$-axis reflection keeps $x$ and flips $y$.", numbers: "$(3,5)$ becomes $(3,-5)$." },
      { title: "Reflect across the $y$-axis", background: "A $y$-axis reflection flips $x$ and keeps $y$.", numbers: "$(3,5)$ becomes $(-3,5)$." },
      { title: "Reflect across $y=x$", background: "Reflection across $y=x$ swaps coordinates.", numbers: "$(3,5)$ becomes $(5,3)$." },
      { title: "Reflect across a $30^\\circ$ line", background: "A unit direction can define any mirror line through the origin.", numbers: "With $u=(\\cos30^\\circ,\\sin30^\\circ)$, point $(2,1)$ reflects to approximately $(1.866,1.232)$." },
      { title: "Normal reflection", background: "Flipping across a plane normal reverses the normal component.", numbers: "Flipping across the plane normal to $(1,0)$ sends velocity $(4,-2)$ to $(-4,-2)$." },
      { title: "Symmetry check", background: "Mirror images have equal perpendicular distances on opposite sides.", numbers: "Points $(2,7)$ and $(2,-7)$ are mirror images across the $x$-axis." }
    ]
  },
  "math-11-16": {
    connectionsProse: "<p>Reflections are one kind of geometric transformation. Rotations, scalings, and translations are other basic ways to move or reshape points. This lesson connects coordinate geometry with transformation matrices and prepares for homogeneous coordinates, where affine transformations can be composed uniformly.</p>",
    motivation: "<p>A rotation changes direction while preserving lengths and angles. A scaling changes lengths along coordinate axes. Both can be represented by matrices because they send the origin to the origin and are determined by what they do to the basis vectors.</p>" +
                "<p>Translation is different because it shifts every point by the same vector and moves the origin itself. In ordinary coordinates, that means translation is affine rather than linear. It still has a simple formula, $x'=x+t$, and the next lesson shows how adding one extra coordinate lets translations join rotations and scalings inside matrix multiplication.</p>",
    definition: "<p>A 2-D rotation, axis scaling, and translation are given by</p>" +
                "<p>$$R_\\theta=\\begin{bmatrix}\\cos\\theta&-\\sin\\theta\\\sin\\theta&\\cos\\theta\\end{bmatrix},\\qquad S=\\begin{bmatrix}s_x&0\\0&s_y\\end{bmatrix},\\qquad x'=x+t.$$</p>" +
                "<p><b>Assumptions that matter:</b> Rotations and scalings are linear maps about the origin; translation is affine in ordinary coordinates because it moves the origin.</p>",
    symbols: [
      { sym: "$R_\\theta$", desc: "a rotation matrix" },
      { sym: "$S$", desc: "a scaling matrix" },
      { sym: "$s_x,s_y$", desc: "scale factors" },
      { sym: "$t$", desc: "a translation vector" }
    ],
    derivation: [
      { do: "Rotate the unit $x$-axis vector.", result: "$(1,0)\\mapsto(\\cos\\theta,\\sin\\theta)$", why: "This is the point on the unit circle at angle $\\theta$." },
      { do: "Rotate the unit $y$-axis vector.", result: "$(0,1)\\mapsto(-\\sin\\theta,\\cos\\theta)$", why: "It remains perpendicular and keeps orientation." },
      { do: "Place the basis images as matrix columns.", result: "$R_\\theta=\\begin{bmatrix}\\cos\\theta&-\\sin\\theta\\\sin\\theta&\\cos\\theta\\end{bmatrix}$", why: "A matrix is determined by where it sends basis vectors." },
      { do: "Scale each basis direction.", result: "$(1,0)\\mapsto(s_x,0)$ and $(0,1)\\mapsto(0,s_y)$", why: "Axis scaling stretches the coordinate axes separately." },
      { do: "Place the scaled basis images as columns.", result: "$S=\\begin{bmatrix}s_x&0\\0&s_y\\end{bmatrix}$", why: "This gives the scaling matrix." },
      { do: "Add a translation vector.", result: "$x'=x+t$", why: "Translation shifts every point and is not linear in ordinary coordinates because the origin moves." }
    ],
    applications: [
      { title: "Quarter-turn", background: "A $90^\\circ$ rotation turns the $x$-axis to the $y$-axis.", numbers: "Rotating $(1,0)$ by $90^\\circ$ gives $(0,1)$." },
      { title: "Thirty-degree rotation", background: "The rotation matrix sends a horizontal vector to an angled one.", numbers: "Rotating $(2,0)$ by $30^\\circ$ gives $(\\sqrt3,1)\\approx(1.732,1.000)$." },
      { title: "Axis scaling", background: "Scaling stretches each coordinate by its own factor.", numbers: "Scaling $(4,5)$ by $s_x=2$, $s_y=3$ gives $(8,15)$." },
      { title: "Translation", background: "Translation adds the same vector to every point.", numbers: "Adding $t=(3,-2)$ to $(4,5)$ gives $(7,3)$." },
      { title: "Scale then translate in 1-D", background: "Affine transformations combine scaling and shifting.", numbers: "$x=4$ scaled by $2$ and translated by $3$ gives $11$." },
      { title: "Inverse rotation", background: "A negative angle rotates in the opposite direction.", numbers: "Rotating $(0,1)$ by $-90^\\circ$ gives $(1,0)$." }
    ]
  },
  "math-11-17": {
    connectionsProse: "<p>The previous lesson separated linear transformations from translation. Homogeneous coordinates bring them together by adding one extra coordinate. This gives a single matrix language for affine transformations, composition, graphics pipelines, and perspective conversion.</p>",
    motivation: "<p>Ordinary matrix multiplication handles rotations and scalings well, but translation requires adding a vector after the multiplication. Homogeneous coordinates solve this by representing a 2-D point as $(x,y,1)^T$ and placing the translation vector in an extra matrix column. Multiplication then produces $Ax+t$ automatically in the top coordinates.</p>" +
                "<p>The final coordinate also separates points from directions. A point has final coordinate $1$, so translation affects it. A direction has final coordinate $0$, so translation drops out and only the linear part remains. If a homogeneous point ends with a nonzero value other than $1$, dividing by that value returns the ordinary Cartesian point.</p>",
    definition: "<p>For a 2-D affine map $x'=Ax+t$, homogeneous coordinates use</p>" +
                "<p>$$\\tilde x=(x,y,1)^T,\\qquad H=\\begin{bmatrix}A&t\\0&1\\end{bmatrix},\\qquad H\\tilde x=\\begin{bmatrix}Ax+t\\1\\end{bmatrix}.$$</p>" +
                "<p><b>Assumptions that matter:</b> Final coordinate $1$ marks points, final coordinate $0$ marks directions, and nonzero final coordinate $w$ converts back by division.</p>",
    symbols: [
      { sym: "$\\tilde x$", desc: "a homogeneous point" },
      { sym: "$A$", desc: "the linear part" },
      { sym: "$t$", desc: "translation" },
      { sym: "$H$", desc: "the homogeneous transformation matrix" },
      { sym: "final coordinate $1$", desc: "marks points" },
      { sym: "final coordinate $0$", desc: "marks directions" }
    ],
    derivation: [
      { do: "Write an ordinary point in homogeneous form.", result: "$\\tilde x=(x,y,1)^T$", why: "The extra coordinate lets translation enter matrix multiplication." },
      { do: "Build the block matrix.", result: "$H=\\begin{bmatrix}A&t\\0&1\\end{bmatrix}$", why: "The translation vector is placed in the extra matrix column." },
      { do: "Multiply the matrix by the homogeneous point.", result: "$H\\tilde x=\\begin{bmatrix}A&t\\0&1\\end{bmatrix}\\begin{bmatrix}x\\y\\1\\end{bmatrix}=\\begin{bmatrix}Ax+t\\1\\end{bmatrix}$", why: "Matrix multiplication produces the affine transform automatically." },
      { do: "Read the top coordinates and final coordinate.", result: "$Ax+t$ and $1$", why: "The top coordinates are the transformed point and the final coordinate stays $1$." },
      { do: "Use final coordinate $0$ for a direction.", result: "$H(v_x,v_y,0)^T=(Av_x,Av_y,0)^T$", why: "Translation does not affect directions." },
      { do: "Convert a nonzero final coordinate back to Cartesian form.", result: "$(X,Y,w)\\mapsto(X/w,Y/w)$", why: "Dividing by $w\\ne0$ returns the ordinary point." }
    ],
    applications: [
      { title: "Affine transform", background: "A homogeneous matrix can scale and translate at once.", numbers: "Matrix $\\begin{bmatrix}2&0&3\\0&2&4\\0&0&1\\end{bmatrix}$ sends $(1,2,1)$ to $(5,8,1)$." },
      { title: "Direction unchanged by translation", background: "Final coordinate $0$ removes translation effects.", numbers: "The same matrix sends direction $(1,2,0)$ to $(2,4,0)$." },
      { title: "Perspective divide", background: "A non-one final coordinate represents a Cartesian point after division.", numbers: "Homogeneous point $(6,9,3)$ represents Cartesian point $(2,3)$." },
      { title: "1-D scale then translate", background: "Homogeneous coordinates also represent 1-D affine maps.", numbers: "Matrix $\\begin{bmatrix}2&3\\0&1\\end{bmatrix}$ sends $(4,1)$ to $(11,1)$." },
      { title: "Pure translation", background: "A translation matrix adds offsets to point coordinates.", numbers: "Matrix $\\begin{bmatrix}1&0&7\\0&1&7\\0&0&1\\end{bmatrix}$ sends $(1,2,1)$ to $(8,9,1)$." },
      { title: "Batch composition", background: "Composed matrices apply transformations in sequence.", numbers: "If one matrix sends $(1,1,1)$ to $(3,3,1)$ and the next translates by $(4,0)$, the composed result is $(7,3,1)$." }
    ]
  },
  "math-11-18": {
    connectionsProse: "<p>Earlier lessons in this section describe lines, planes, distances, projections, and normal vectors. A hyperplane uses those same ideas in any number of dimensions. In two dimensions it is a line. In three dimensions it is a plane. In higher-dimensional feature space it is still the same object: a flat set with a normal direction.</p>" +
                      "<p>This lesson connects analytic geometry directly to linear classifiers. A logistic regression model, perceptron, or linear SVM computes an affine score $w\\cdot x+b$. The decision boundary is the set of points where that score is exactly zero. The sign tells which side a point is on, and the distance formula tells how far the point lies from the boundary.</p>",
    motivation: "<p>A line in the plane can split the plane into two half-planes. The equation $2x-y-3=0$ is the boundary itself. Points with $2x-y-3>0$ lie on one side, and points with $2x-y-3<0$ lie on the other. The vector $(2,-1)$ is perpendicular to the boundary, so moving in that normal direction changes the score fastest.</p>" +
                "<p>A hyperplane is the same idea with more coordinates. The vector $w$ stores the normal direction, $x$ is the point being classified, and $b$ shifts the boundary away from the origin. The score $w\\cdot x+b$ is a signed quantity: positive on one side, negative on the other, and zero on the boundary.</p>" +
                "<p>The size of the raw score depends on the scale of $w$. Doubling both $w$ and $b$ doubles every score but leaves the boundary unchanged. For geometry, divide by $\\lVert w\\rVert$. That turns the score into a true Euclidean distance from the point to the hyperplane. This is why SVMs distinguish a functional margin $y(w\\cdot x+b)$ from a geometric margin $y(w\\cdot x+b)/\\lVert w\\rVert$.</p>",
    definition: "<p>A hyperplane is the zero set of a nonzero affine score, and distance to it is the normalized absolute score:</p>" +
                "<p>$$H=\\{x\\in\\mathbb R^n: w\\cdot x+b=0\\},\\qquad \\operatorname{dist}(x,H)=\\frac{|w\\cdot x+b|}{\\lVert w\\rVert}.$$</p>" +
                "<p>For an SVM label $y\\in\\{-1,1\\}$,</p>" +
                "<p>$$\\gamma_{\\text{functional}}=y(w\\cdot x+b),\\qquad \\gamma_{\\text{geometric}}=\\frac{y(w\\cdot x+b)}{\\lVert w\\rVert}.$$</p>" +
                "<p><b>Assumptions that matter:</b> $w\\ne0$; distances use the Euclidean norm; multiplying $w$ and $b$ by the same positive constant leaves the boundary but not the raw score unchanged.</p>",
    symbols: [
      { sym: "$x$", desc: "the feature point" },
      { sym: "$w$", desc: "the nonzero normal vector" },
      { sym: "$b$", desc: "the bias or offset" },
      { sym: "$H$", desc: "the hyperplane" },
      { sym: "$y$", desc: "the class label in $\\{-1,1\\}$" },
      { sym: "$\\lVert w\\rVert$", desc: "the Euclidean length of the normal" },
      { sym: "$\\gamma$", desc: "a margin" }
    ],
    derivation: [
      { do: "Choose any point $x_0$ on the hyperplane.", result: "$w\\cdot x_0+b=0$", why: "This gives a known anchor on the boundary." },
      { do: "Subtract the two scores.", result: "$(w\\cdot x+b)-(w\\cdot x_0+b)=w\\cdot(x-x_0)$", why: "The bias cancels because it shifts both scores equally." },
      { do: "Replace the boundary score with zero.", result: "$w\\cdot x+b=w\\cdot(x-x_0)$", why: "The score measures the offset from the boundary in the normal direction." },
      { do: "Make the normal unit length.", result: "$u=w/\\lVert w\\rVert$", why: "Distances along a direction require a unit direction." },
      { do: "Project the offset onto the unit normal.", result: "$u\\cdot(x-x_0)=\\dfrac{w\\cdot(x-x_0)}{\\lVert w\\rVert}$", why: "Projection gives signed perpendicular distance." },
      { do: "Substitute Step 3.", result: "$u\\cdot(x-x_0)=\\dfrac{w\\cdot x+b}{\\lVert w\\rVert}$", why: "This is signed distance." },
      { do: "Take absolute value for ordinary distance.", result: "$\\operatorname{dist}(x,H)=\\dfrac{|w\\cdot x+b|}{\\lVert w\\rVert}$", why: "Distance is nonnegative." },
      { do: "For a labeled SVM point, multiply by $y$ before dividing.", result: "$\\gamma=\\dfrac{y(w\\cdot x+b)}{\\lVert w\\rVert}$", why: "Correctly classified points have positive margin." }
    ],
    applications: [
      { title: "Linear classifier sign", background: "The score sign chooses a side of the boundary.", numbers: "With $s=1.5x_1-0.5x_2+1$, point $(2,4)$ gives $3-2+1=2$, so it is on the positive side." },
      { title: "Boundary distance", background: "Dividing score magnitude by normal length gives distance.", numbers: "For $w=(2,-1)$, $b=-3$, and $x=(4,2)$, the distance is $3/\\sqrt5\\approx1.342$." },
      { title: "SVM maximum margin", background: "Functional margin becomes geometric margin after normalization.", numbers: "If $\\lVert w\\rVert=5$ and the closest functional margin is $1$, the geometric margin is $1/5=0.2$." },
      { title: "Distance-based confidence", background: "Larger normalized scores are farther from the boundary.", numbers: "Scores $0.5$ and $2.0$ with $\\lVert w\\rVert=2$ have boundary distances $0.25$ and $1.0$." },
      { title: "Multiclass linear boundary", background: "A class switch happens where two scores are equal.", numbers: "If $s_1=2x+1$ and $s_2=-x+4$, the class-switch boundary solves $2x+1=-x+4$, so $x=1$." },
      { title: "Feature-map boundary", background: "A linear boundary in feature space can be nonlinear in the original input.", numbers: "In features $(x,x^2)$, the linear boundary $x^2-4=0$ becomes two original-input decision points, $x=-2$ and $x=2$." }
    ]
  }
};
