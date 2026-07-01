module.exports = {
  "math-11-01": {
    id: "math-11-01",
    title: "Cartesian coordinates",
    tagline: "Cartesian coordinates turn location into numbers you can measure, compare, and compute with.",
    connections: {
      buildsOn: ["number lines", "ordered pairs", "basic algebra"],
      leadsTo: ["Distance and midpoints", "Lines in the plane", "Vectors"],
      usedWith: ["graphs", "functions", "systems of equations", "transformations"]
    },
    motivation:
      "<p>You already know how to find a seat by row and number, or a cell in a spreadsheet by column and row. The coordinate plane is the same kindness: it gives every point a dependable address.</p>" +
      "<p><b>Cartesian coordinates</b> let geometry and algebra talk to each other. A point becomes $(x,y)$, a movement becomes a change in those numbers, and a picture becomes something we can calculate. This is the doorway to almost every geometric idea used in ML.</p>",
    definition:
      "<p>In the Cartesian plane, two perpendicular number lines meet at the <b>origin</b> $(0,0)$. The horizontal axis is the $x$-axis, the vertical axis is the $y$-axis, and a point $P=(x,y)$ means: move $x$ units horizontally from the origin, then $y$ units vertically. Positive $x$ points right, positive $y$ points up.</p>" +
      "<p>The four quadrants come from the signs of the coordinates: quadrant I has $(+,+)$, quadrant II has $(-,+)$, quadrant III has $(-,-)$, and quadrant IV has $(+,-)$. A displacement from $A=(x_1,y_1)$ to $B=(x_2,y_2)$ is measured component by component as $(x_2-x_1, y_2-y_1)$.</p>" +
      "<p><b>Assumptions that matter:</b> the axes are perpendicular and use the same unit scale unless stated otherwise; an ordered pair is ordered, so $(2,5)$ and $(5,2)$ are different points; and coordinates describe location relative to the chosen origin and axes.</p>",
    worked: {
      problem: "Plot $A=(-3,2)$ and $B=(4,-1)$ mentally, identify their quadrants, and find the displacement from $A$ to $B$.",
      skills: ["ordered pairs", "quadrants", "coordinate differences"],
      strategy: "Read each coordinate as horizontal then vertical, then subtract start from finish component by component.",
      steps: [
        { do: "Read point $A$", result: "$x=-3$, $y=2$", why: "the first coordinate is horizontal and the second is vertical" },
        { do: "Classify $A$ by signs", result: "quadrant II", why: "negative $x$ and positive $y$ put the point left and up" },
        { do: "Read point $B$", result: "$x=4$, $y=-1$", why: "the ordered pair gives right-left first, then up-down" },
        { do: "Classify $B$ by signs", result: "quadrant IV", why: "positive $x$ and negative $y$ put the point right and down" },
        { do: "Subtract $x$-coordinates", result: "$4-(-3)=7$", why: "horizontal displacement is final $x$ minus initial $x$" },
        { do: "Subtract $y$-coordinates", result: "$-1-2=-3$", why: "vertical displacement is final $y$ minus initial $y$" },
        { do: "Write the displacement", result: "$(7,-3)$", why: "go 7 units right and 3 units down from $A$ to reach $B$" }
      ],
      verify: "Starting at $(-3,2)$ and adding $(7,-3)$ gives $(-3+7,2-3)=(4,-1)$, which is $B$.",
      answer: "$A$ is in quadrant II, $B$ is in quadrant IV, and the displacement from $A$ to $B$ is $(7,-3)$.",
      connects: "Coordinates make location arithmetic: movement becomes subtraction and addition of ordered pairs."
    },
    practice: [
      { problem: "For $P=(6,-4)$, identify the quadrant and describe how to reach it from the origin.", steps: [
        { do: "Read the $x$-coordinate", result: "$x=6$", why: "the first coordinate is horizontal" },
        { do: "Read the $y$-coordinate", result: "$y=-4$", why: "the second coordinate is vertical" },
        { do: "Translate the horizontal coordinate", result: "move 6 units right", why: "positive $x$ points right" },
        { do: "Translate the vertical coordinate", result: "move 4 units down", why: "negative $y$ points downward" },
        { do: "Classify the signs", result: "quadrant IV", why: "$(+,-)$ belongs to quadrant IV" }
      ], answer: "$P$ is in quadrant IV; move 6 units right and 4 units down from the origin." },
      { problem: "Find the coordinates after starting at $(2,-3)$ and moving left $5$ units and up $7$ units.", steps: [
        { do: "Convert the horizontal move", result: "$-5$", why: "left means a negative change in $x$" },
        { do: "Convert the vertical move", result: "$+7$", why: "up means a positive change in $y$" },
        { do: "Add the $x$ change", result: "$2+(-5)=-3$", why: "new horizontal location is old plus change" },
        { do: "Add the $y$ change", result: "$-3+7=4$", why: "new vertical location is old plus change" },
        { do: "Write the point", result: "$(-3,4)$", why: "coordinates are listed as $(x,y)$" }
      ], answer: "The new point is $(-3,4)$." },
      { problem: "Find the displacement from $C=(1,8)$ to $D=(-6,3)$ and describe it in words.", steps: [
        { do: "Subtract final minus initial for $x$", result: "$-6-1=-7$", why: "horizontal displacement uses the $x$-coordinates" },
        { do: "Subtract final minus initial for $y$", result: "$3-8=-5$", why: "vertical displacement uses the $y$-coordinates" },
        { do: "Combine the components", result: "$(-7,-5)$", why: "a displacement is an ordered pair of changes" },
        { do: "Interpret the first component", result: "7 units left", why: "negative horizontal change points left" },
        { do: "Interpret the second component", result: "5 units down", why: "negative vertical change points down" }
      ], answer: "The displacement is $(-7,-5)$: 7 units left and 5 units down." },
      { problem: "A rectangle has opposite corners $(-2,-1)$ and $(5,4)$, with sides parallel to the axes. Find the other two corners.", steps: [
        { do: "Name the given coordinates", result: "$x$-values $-2,5$ and $y$-values $-1,4$", why: "axis-parallel corners mix these coordinate choices" },
        { do: "Keep the first $x$ with the second $y$", result: "$(-2,4)$", why: "one missing corner is above the left given corner" },
        { do: "Keep the second $x$ with the first $y$", result: "$(5,-1)$", why: "the other missing corner is right of the lower given corner" },
        { do: "Check horizontal sides", result: "$y=-1$ and $y=4$", why: "top and bottom sides have constant $y$" },
        { do: "Check vertical sides", result: "$x=-2$ and $x=5$", why: "left and right sides have constant $x$" }
      ], answer: "The other corners are $(-2,4)$ and $(5,-1)$." },
      { problem: "A tiny image patch has pixel coordinates with origin at the upper-left, $x$ right and $y$ down. A feature moves from $(12,20)$ to $(17,14)$. Find the coordinate change and interpret it.", steps: [
        { do: "Subtract the $x$ coordinates", result: "$17-12=5$", why: "positive $x$ still means right" },
        { do: "Subtract the $y$ coordinates", result: "$14-20=-6$", why: "final minus initial gives vertical coordinate change" },
        { do: "Write the coordinate change", result: "$(5,-6)$", why: "the feature's address changed by these components" },
        { do: "Interpret the horizontal change", result: "5 pixels right", why: "positive $x$ points right" },
        { do: "Interpret the vertical change", result: "6 pixels up", why: "in image coordinates, smaller $y$ is higher" }
      ], answer: "The change is $(5,-6)$: 5 pixels right and 6 pixels up in that image coordinate system." }
    ],
    applications: [
      { title: "Image pixels", background: "Computer vision treats an image as values attached to coordinate locations. The coordinate convention may place the origin at the top-left instead of the mathematical center, but the address idea is the same.", numbers: "A pixel at $(40,25)$ shifted by $(8,-3)$ moves to $(48,22)$." },
      { title: "Scatter plots in data analysis", background: "A scatter plot turns two measured features into points, so patterns become visible before a model is fit.", numbers: "A user with feature values age $30$ and score $0.82$ becomes the point $(30,0.82)$." },
      { title: "Screen and UI layout", background: "Interfaces place buttons, text, and images by coordinates, often with $y$ increasing downward on the screen.", numbers: "A button at $(120,80)$ with width $200$ and height $40$ has lower-right corner $(320,120)$." },
      { title: "Robotics position tracking", background: "A robot map needs a coordinate frame so sensor readings and planned moves agree.", numbers: "If a robot at $(2.0,1.5)$ meters moves by $(0.7,-0.4)$ meters, its new position is $(2.7,1.1)$." },
      { title: "Feature spaces", background: "ML often represents each example as a point whose coordinates are feature values. Two-feature examples are easy to picture in the plane.", numbers: "A house with size feature $1.6$ and commute feature $0.3$ is the point $(1.6,0.3)$." },
      { title: "Bounding boxes", background: "Object detectors describe regions using coordinate corners or centers and sizes.", numbers: "A box with top-left $(10,15)$ and bottom-right $(70,55)$ has width $60$ and height $40$." }
    ],
    applicationsClose: "Coordinates are the quiet address system behind graphs, images, maps, screens, and feature spaces.",
    takeaways: [
      "A Cartesian point $(x,y)$ records horizontal position first and vertical position second.",
      "Signs locate quadrants and directions of movement.",
      "Displacement from $A$ to $B$ is final coordinates minus initial coordinates.",
      "Changing the origin or axis convention changes coordinates, not the underlying point."
    ]
  },

  "math-11-02": {
    id: "math-11-02",
    title: "Polar coordinates",
    tagline: "Polar coordinates locate a point by distance and direction, which is often the most natural way to see it.",
    connections: {
      buildsOn: ["Cartesian coordinates", "trigonometric functions", "angles in radians"],
      leadsTo: ["Vectors", "The dot product", "complex numbers"],
      usedWith: ["unit circle", "rotations", "parametric curves", "trigonometry"]
    },
    motivation:
      "<p>Sometimes a point feels less like a row-and-column address and more like a direction and a distance: walk 5 meters at a $30^\\circ$ angle, or point a radar beam 12 km northeast.</p>" +
      "<p><b>Polar coordinates</b> honor that instinct. Instead of $(x,y)$, a point is described by $(r,\\theta)$, where $r$ is how far from the origin and $\\theta$ is the angle from the positive $x$-axis. Circles, rotations, waves, and directions become easier to read.</p>",
    definition:
      "<p>A polar coordinate pair $(r,\\theta)$ describes a point by radius $r$ and angle $\\theta$. The conversion to Cartesian coordinates is $$x=r\\cos\\theta,\\qquad y=r\\sin\\theta.$$ For a Cartesian point $(x,y)$, the radius satisfies $r=\\sqrt{x^2+y^2}$, and the angle satisfies $\\tan\\theta=y/x$ with quadrant chosen carefully.</p>" +
      "<p>The conversion comes from the right triangle formed by the point, the origin, and the $x$-axis: cosine gives adjacent over hypotenuse, so $\\cos\\theta=x/r$; sine gives opposite over hypotenuse, so $\\sin\\theta=y/r$. Multiplying by $r$ gives $x$ and $y$.</p>" +
      "<p><b>Assumptions that matter:</b> angles are measured from the positive $x$-axis, usually in radians; $(r,\\theta)$ is not unique because adding $2\\pi$ to $\\theta$ gives the same point; and when converting from $(x,y)$, use quadrant information rather than trusting plain arctangent alone.</p>",
    worked: {
      problem: "Convert the polar point $(6,\\pi/3)$ to Cartesian coordinates.",
      skills: ["polar-to-Cartesian conversion", "unit-circle values", "exact coordinates"],
      strategy: "Use $x=r\\cos\\theta$ and $y=r\\sin\\theta$, then plug in the familiar angle values.",
      steps: [
        { do: "Identify the radius", result: "$r=6$", why: "the first polar coordinate is distance from the origin" },
        { do: "Identify the angle", result: "$\\theta=\\pi/3$", why: "the second polar coordinate is direction" },
        { do: "Write the $x$ conversion", result: "$x=6\\cos(\\pi/3)$", why: "horizontal coordinate is radius times cosine" },
        { do: "Use the cosine value", result: "$x=6\\cdot\\dfrac12=3$", why: "$\\cos(\\pi/3)=1/2$" },
        { do: "Write the $y$ conversion", result: "$y=6\\sin(\\pi/3)$", why: "vertical coordinate is radius times sine" },
        { do: "Use the sine value", result: "$y=6\\cdot\\dfrac{\\sqrt3}{2}=3\\sqrt3$", why: "$\\sin(\\pi/3)=\\sqrt3/2$" }
      ],
      verify: "The radius of $(3,3\\sqrt3)$ is $\\sqrt{9+27}=6$, so the distance matches the polar radius.",
      answer: "The Cartesian coordinates are $(3,3\\sqrt3)$.",
      connects: "Polar and Cartesian coordinates are two descriptions of the same point: one by direction and distance, one by horizontal and vertical components."
    },
    practice: [
      { problem: "Convert $(4,\\pi/2)$ from polar to Cartesian coordinates.", steps: [
        { do: "Write the $x$ formula", result: "$x=4\\cos(\\pi/2)$", why: "polar-to-Cartesian uses cosine for horizontal coordinate" },
        { do: "Evaluate cosine", result: "$x=4\\cdot0=0$", why: "$\\cos(\\pi/2)=0$" },
        { do: "Write the $y$ formula", result: "$y=4\\sin(\\pi/2)$", why: "sine gives the vertical component" },
        { do: "Evaluate sine", result: "$y=4\\cdot1=4$", why: "$\\sin(\\pi/2)=1$" },
        { do: "Write the point", result: "$(0,4)$", why: "Cartesian coordinates are $(x,y)$" }
      ], answer: "$(4,\\pi/2)$ is $(0,4)$ in Cartesian coordinates." },
      { problem: "Convert the Cartesian point $(-3,3)$ to polar form with $r>0$ and $0\\le\\theta<2\\pi$.", steps: [
        { do: "Compute the radius", result: "$r=\\sqrt{(-3)^2+3^2}$", why: "distance from the origin uses the Pythagorean theorem" },
        { do: "Simplify the radius", result: "$r=\\sqrt{18}=3\\sqrt2$", why: "add the squared coordinates" },
        { do: "Compute the tangent ratio", result: "$y/x=3/(-3)=-1$", why: "the angle has tangent $-1$" },
        { do: "Use the quadrant", result: "quadrant II", why: "$x<0$ and $y>0$" },
        { do: "Choose the angle", result: "$\\theta=3\\pi/4$", why: "quadrant II with reference angle $\\pi/4$" }
      ], answer: "One polar form is $(3\\sqrt2,3\\pi/4)$." },
      { problem: "Show that $(5,7\\pi/6)$ and $(5,-5\\pi/6)$ describe the same point.", steps: [
        { do: "Compare the angles", result: "$7\\pi/6-(-5\\pi/6)=12\\pi/6$", why: "subtract to see how far apart they are" },
        { do: "Simplify the difference", result: "$2\\pi$", why: "$12\\pi/6=2\\pi$" },
        { do: "Use angle periodicity", result: "$\\cos(\\theta+2\\pi)=\\cos\\theta$", why: "cosine repeats every full turn" },
        { do: "Use sine periodicity", result: "$\\sin(\\theta+2\\pi)=\\sin\\theta$", why: "sine also repeats every full turn" },
        { do: "Keep the radius", result: "$r=5$ for both", why: "same radius and coterminal angles give the same point" }
      ], answer: "They describe the same point because the angles differ by $2\\pi$." },
      { problem: "Convert the polar point $(8,5\\pi/6)$ to Cartesian coordinates.", steps: [
        { do: "Write the $x$ formula", result: "$x=8\\cos(5\\pi/6)$", why: "horizontal component uses cosine" },
        { do: "Evaluate cosine", result: "$x=8\\cdot(-\\sqrt3/2)=-4\\sqrt3$", why: "$5\\pi/6$ is in quadrant II" },
        { do: "Write the $y$ formula", result: "$y=8\\sin(5\\pi/6)$", why: "vertical component uses sine" },
        { do: "Evaluate sine", result: "$y=8\\cdot(1/2)=4$", why: "sine is positive in quadrant II" },
        { do: "Write the ordered pair", result: "$(-4\\sqrt3,4)$", why: "combine $x$ and $y$" }
      ], answer: "The Cartesian point is $(-4\\sqrt3,4)$." },
      { problem: "A sensor detects an object $10$ meters away at angle $30^\\circ$ from the positive $x$-axis. Convert the location to Cartesian coordinates using $30^\\circ=\\pi/6$.", steps: [
        { do: "Set the polar coordinates", result: "$(r,\\theta)=(10,\\pi/6)$", why: "distance is radius and direction is angle" },
        { do: "Compute $x$", result: "$x=10\\cos(\\pi/6)$", why: "horizontal location uses cosine" },
        { do: "Evaluate $x$", result: "$x=10\\cdot\\sqrt3/2=5\\sqrt3\\approx8.66$", why: "$\\cos(\\pi/6)=\\sqrt3/2$" },
        { do: "Compute $y$", result: "$y=10\\sin(\\pi/6)$", why: "vertical location uses sine" },
        { do: "Evaluate $y$", result: "$y=10\\cdot1/2=5$", why: "$\\sin(\\pi/6)=1/2$" }
      ], answer: "The object is at approximately $(8.66,5)$ meters." }
    ],
    applications: [
      { title: "Radar and lidar", background: "Range sensors often measure distance and bearing directly, so polar form matches the instrument before conversion to a map.", numbers: "A return at $r=20$ m and $\\theta=\\pi/6$ has coordinates $(20\\cdot0.866,20\\cdot0.5)\\approx(17.32,10)$." },
      { title: "Rotations", background: "Rotating a point is especially simple in polar coordinates because the radius stays fixed and the angle changes.", numbers: "Rotating $(r,\\theta)=(5,\\pi/4)$ by $\\pi/2$ gives $(5,3\\pi/4)$." },
      { title: "Computer graphics circles", background: "Circles are easier to generate by sweeping an angle and keeping a constant radius.", numbers: "A circle of radius $12$ has point $(12\\cos\\pi,12\\sin\\pi)=(-12,0)$ at angle $\\pi$." },
      { title: "Audio phase", background: "Sinusoidal signals use amplitude and phase, a polar-like way to represent oscillation.", numbers: "Amplitude $3$ and phase $\\pi/2$ gives value $3\\sin(0+\\pi/2)=3$ at time zero." },
      { title: "Complex numbers", background: "Complex numbers can be written as distance and angle, which makes multiplication behave like scaling plus rotation.", numbers: "Magnitude $2$ at angle $\\pi/3$ corresponds to $2\\cos\\pi/3+i2\\sin\\pi/3=1+i\\sqrt3$." },
      { title: "Directional features in ML", background: "Cyclic features such as time of day or heading should wrap around smoothly; sine and cosine coordinates do that.", numbers: "Hour $6$ on a 24-hour clock has angle $2\\pi(6/24)=\\pi/2$, so features are $(\\cos\\theta,\\sin\\theta)=(0,1)$." }
    ],
    applicationsClose: "Polar coordinates shine whenever distance, direction, rotation, or circular structure is the natural story.",
    takeaways: [
      "Polar coordinates $(r,\\theta)$ describe distance from the origin and direction from the positive $x$-axis.",
      "Convert by $x=r\\cos\\theta$ and $y=r\\sin\\theta$.",
      "Convert back with $r=\\sqrt{x^2+y^2}$ and careful quadrant choice for $\\theta$.",
      "The same point has many polar descriptions because angles repeat every $2\\pi$."
    ]
  },

  "math-11-03": {
    id: "math-11-03",
    title: "Distance and midpoints",
    tagline: "Distance measures how far apart two points are, and the midpoint finds the balanced point between them.",
    connections: {
      buildsOn: ["Cartesian coordinates", "the Pythagorean theorem", "ordered pairs"],
      leadsTo: ["Lines in the plane", "Vectors", "The dot product"],
      usedWith: ["circles", "nearest neighbors", "coordinate geometry", "averages"]
    },
    motivation:
      "<p>Once points have coordinates, the next natural questions are simple and powerful: how far apart are they, and where is halfway between them?</p>" +
      "<p>The distance formula is the Pythagorean theorem wearing coordinate clothing. The midpoint formula is averaging applied separately to the horizontal and vertical coordinates. Together, they make geometry computable.</p>",
    definition:
      "<p>For points $A=(x_1,y_1)$ and $B=(x_2,y_2)$ in the plane, their distance is $$d(A,B)=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}.$$ Their midpoint is $$M=\\left(\\dfrac{x_1+x_2}{2},\\dfrac{y_1+y_2}{2}\\right).$$</p>" +
      "<p>The distance formula comes from drawing a right triangle: the horizontal leg has length $|x_2-x_1|$, the vertical leg has length $|y_2-y_1|$, and the segment $AB$ is the hypotenuse. Squaring removes sign, so the formula works in every quadrant. The midpoint averages coordinates because halfway means halfway in each independent direction.</p>" +
      "<p><b>Assumptions that matter:</b> the coordinate axes are perpendicular with the same unit scale; distance is nonnegative; and the midpoint formula gives the point exactly halfway along the straight segment from $A$ to $B$.</p>",
    worked: {
      problem: "Find the distance and midpoint between $A=(-2,5)$ and $B=(4,-3)$.",
      skills: ["distance formula", "midpoint formula", "coordinate differences"],
      strategy: "Subtract coordinates for distance, then average coordinates for the midpoint.",
      steps: [
        { do: "Compute the horizontal difference", result: "$x_2-x_1=4-(-2)=6$", why: "distance uses change in $x$" },
        { do: "Compute the vertical difference", result: "$y_2-y_1=-3-5=-8$", why: "distance uses change in $y$" },
        { do: "Substitute into the distance formula", result: "$d=\\sqrt{6^2+(-8)^2}$", why: "the segment is the hypotenuse of a right triangle" },
        { do: "Square and add", result: "$d=\\sqrt{36+64}=\\sqrt{100}$", why: "squares make both changes positive" },
        { do: "Simplify the distance", result: "$d=10$", why: "$\\sqrt{100}=10$" },
        { do: "Average the $x$-coordinates", result: "$(-2+4)/2=1$", why: "midpoint is halfway horizontally" },
        { do: "Average the $y$-coordinates", result: "$(5+(-3))/2=1$", why: "midpoint is halfway vertically" }
      ],
      verify: "From $(1,1)$ to $A$ the change is $(-3,4)$, and from $(1,1)$ to $B$ the change is $(3,-4)$, equal and opposite as a midpoint should be.",
      answer: "The distance is $10$, and the midpoint is $(1,1)$.",
      connects: "Distance and midpoint turn straight-line geometry into arithmetic on coordinate differences and averages."
    },
    practice: [
      { problem: "Find the distance between $(1,2)$ and $(4,6)$.", steps: [
        { do: "Compute the $x$ difference", result: "$4-1=3$", why: "horizontal leg length comes from $x$-coordinates" },
        { do: "Compute the $y$ difference", result: "$6-2=4$", why: "vertical leg length comes from $y$-coordinates" },
        { do: "Substitute into the formula", result: "$d=\\sqrt{3^2+4^2}$", why: "use Pythagoras" },
        { do: "Square and add", result: "$d=\\sqrt{9+16}=\\sqrt{25}$", why: "combine squared legs" },
        { do: "Simplify", result: "$d=5$", why: "this is the $3$-$4$-$5$ triangle" }
      ], answer: "The distance is $5$." },
      { problem: "Find the midpoint of $(-7,3)$ and $(5,11)$.", steps: [
        { do: "Add the $x$-coordinates", result: "$-7+5=-2$", why: "midpoint averages horizontal positions" },
        { do: "Divide by $2$", result: "$-2/2=-1$", why: "average means sum divided by two" },
        { do: "Add the $y$-coordinates", result: "$3+11=14$", why: "midpoint averages vertical positions" },
        { do: "Divide by $2$", result: "$14/2=7$", why: "average the vertical positions" },
        { do: "Write the midpoint", result: "$(-1,7)$", why: "combine the averaged coordinates" }
      ], answer: "The midpoint is $(-1,7)$." },
      { problem: "A segment has endpoint $A=(2,-5)$ and midpoint $M=(6,1)$. Find the other endpoint $B$.", steps: [
        { do: "Use the midpoint $x$ equation", result: "$(2+x_B)/2=6$", why: "midpoint averages endpoint $x$-coordinates" },
        { do: "Solve for $x_B$", result: "$2+x_B=12$, so $x_B=10$", why: "multiply by 2, then subtract 2" },
        { do: "Use the midpoint $y$ equation", result: "$(-5+y_B)/2=1$", why: "midpoint averages endpoint $y$-coordinates" },
        { do: "Solve for $y_B$", result: "$-5+y_B=2$, so $y_B=7$", why: "multiply by 2, then add 5" },
        { do: "Write the endpoint", result: "$B=(10,7)$", why: "combine the solved coordinates" }
      ], answer: "The other endpoint is $(10,7)$." },
      { problem: "Determine whether $(0,0)$, $(6,0)$, and $(3,3\\sqrt3)$ form an equilateral triangle.", steps: [
        { do: "Find the base length", result: "$\\sqrt{(6-0)^2+(0-0)^2}=6$", why: "distance between the first two points" },
        { do: "Find the left side length", result: "$\\sqrt{(3-0)^2+(3\\sqrt3-0)^2}$", why: "distance from origin to the top point" },
        { do: "Simplify the left side", result: "$\\sqrt{9+27}=6$", why: "$(3\\sqrt3)^2=27$" },
        { do: "Find the right side length", result: "$\\sqrt{(3-6)^2+(3\\sqrt3-0)^2}$", why: "distance from $(6,0)$ to the top point" },
        { do: "Simplify the right side", result: "$\\sqrt{9+27}=6$", why: "all three side lengths match" }
      ], answer: "Yes. All three side lengths are $6$." },
      { problem: "Two normalized data points are $p=(1.2,-0.5)$ and $q=(-0.8,1.0)$. Find their Euclidean distance and midpoint.", steps: [
        { do: "Compute the $x$ difference", result: "$-0.8-1.2=-2.0$", why: "distance uses final minus initial" },
        { do: "Compute the $y$ difference", result: "$1.0-(-0.5)=1.5$", why: "subtract the second coordinate" },
        { do: "Compute the distance", result: "$d=\\sqrt{(-2.0)^2+1.5^2}$", why: "Euclidean distance squares component changes" },
        { do: "Simplify the distance", result: "$d=\\sqrt{4+2.25}=2.5$", why: "$\\sqrt{6.25}=2.5$" },
        { do: "Average the coordinates", result: "$M=((1.2-0.8)/2,(-0.5+1.0)/2)=(0.2,0.25)$", why: "midpoint averages each feature" }
      ], answer: "The distance is $2.5$, and the midpoint is $(0.2,0.25)$." }
    ],
    applications: [
      { title: "Nearest-neighbor classification", background: "A basic ML classifier can assign a label by looking at the closest labeled example in feature space.", numbers: "Distance from $(1,2)$ to $(4,6)$ is $5$, while distance to $(2,3)$ is $\\sqrt2\\approx1.41$, so $(2,3)$ is nearer." },
      { title: "Clustering centers", background: "Cluster centers are often averages of point coordinates, a many-point version of the midpoint idea.", numbers: "The average of $(1,2)$, $(3,4)$, and $(5,0)$ is $((1+3+5)/3,(2+4+0)/3)=(3,2)$." },
      { title: "Computer graphics interpolation", background: "Animations often place an object halfway between two positions for a smooth transition.", numbers: "Halfway between $(10,20)$ and $(30,50)$ is $(20,35)$." },
      { title: "Collision detection", background: "Games and simulations use distances to decide whether objects touch or overlap.", numbers: "Two circular objects with centers distance $7$ and radii $3$ and $5$ overlap because $7<3+5=8$." },
      { title: "GPS-style planar approximation", background: "Over small regions, map coordinates can approximate local positions in meters.", numbers: "Points $(100,40)$ and $(130,80)$ meters apart have distance $\\sqrt{30^2+40^2}=50$ meters." },
      { title: "Embedding similarity by distance", background: "Some embedding systems compare vectors by Euclidean distance after normalization or projection.", numbers: "Embeddings $(0.2,0.9)$ and $(0.5,0.5)$ are $\\sqrt{0.3^2+(-0.4)^2}=0.5$ apart." }
    ],
    applicationsClose: "Distance and midpoint are the small formulas behind proximity, averaging, interpolation, and many geometric ML routines.",
    takeaways: [
      "Distance between two plane points is $\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$.",
      "The midpoint is found by averaging corresponding coordinates.",
      "Distance comes from the Pythagorean theorem on coordinate differences.",
      "Midpoints and averages are coordinate-wise balance points."
    ]
  },

  "math-11-04": {
    id: "math-11-04",
    title: "Lines in the plane",
    tagline: "A line is a constant direction written as an equation, a slope, or a set of points.",
    connections: {
      buildsOn: ["Cartesian coordinates", "Distance and midpoints", "linear equations"],
      leadsTo: ["Vectors", "Planes in 3D", "linear regression"],
      usedWith: ["slope", "systems of equations", "intercepts", "normal vectors"]
    },
    motivation:
      "<p>You already recognize a straight path: every step keeps the same direction. In coordinates, that steady direction becomes a slope, and the entire path becomes an equation.</p>" +
      "<p>Lines matter because they are the simplest models of change. They separate regions, approximate curves, define trends, and become the building blocks for higher-dimensional geometry.</p>",
    definition:
      "<p>A nonvertical line in the plane can be written as $y=mx+b$, where $m$ is the <b>slope</b> and $b$ is the $y$-intercept. The slope between two points $(x_1,y_1)$ and $(x_2,y_2)$ with $x_2\\ne x_1$ is $$m=\\dfrac{y_2-y_1}{x_2-x_1}.$$ A line through $(x_1,y_1)$ with slope $m$ can also be written $y-y_1=m(x-x_1)$.</p>" +
      "<p>The slope formula is rise over run: when $x$ changes by $\\Delta x$, $y$ changes by $m\\Delta x$. Vertical lines have equations $x=c$ and no finite slope. The general form $Ax+By=C$ includes vertical and nonvertical lines; $(A,B)$ is perpendicular to the line.</p>" +
      "<p><b>Assumptions that matter:</b> slope is defined only when the run is nonzero; parallel lines have equal slopes when both slopes exist; and perpendicular nonvertical lines have slopes whose product is $-1$.</p>",
    worked: {
      problem: "Find the equation of the line through $(-1,4)$ and $(3,-2)$ in slope-intercept form.",
      skills: ["slope", "point-slope form", "slope-intercept form"],
      strategy: "Use the two points to find the slope, then use one point to solve for the intercept.",
      steps: [
        { do: "Compute the rise", result: "$-2-4=-6$", why: "rise is the change in $y$" },
        { do: "Compute the run", result: "$3-(-1)=4$", why: "run is the change in $x$" },
        { do: "Compute the slope", result: "$m=-6/4=-3/2$", why: "slope is rise over run" },
        { do: "Start slope-intercept form", result: "$y=-\\dfrac32x+b$", why: "use the slope in $y=mx+b$" },
        { do: "Substitute point $(-1,4)$", result: "$4=-\\dfrac32(-1)+b$", why: "the point lies on the line" },
        { do: "Simplify", result: "$4=\\dfrac32+b$", why: "multiply the slope by $-1$" },
        { do: "Solve for $b$", result: "$b=\\dfrac52$", why: "subtract $3/2$ from both sides" }
      ],
      verify: "At $x=3$, the equation gives $y=-\\tfrac32\\cdot3+\\tfrac52=-2$, so the second point fits.",
      answer: "The line is $y=-\\dfrac32x+\\dfrac52$.",
      connects: "A line is determined by one point plus one constant slope, or by two distinct points that reveal that slope."
    },
    practice: [
      { problem: "Find the slope of the line through $(2,1)$ and $(8,13)$.", steps: [
        { do: "Compute the change in $y$", result: "$13-1=12$", why: "rise is final $y$ minus initial $y$" },
        { do: "Compute the change in $x$", result: "$8-2=6$", why: "run is final $x$ minus initial $x$" },
        { do: "Form rise over run", result: "$12/6$", why: "slope is vertical change divided by horizontal change" },
        { do: "Simplify", result: "$2$", why: "divide numerator and denominator by $6$" },
        { do: "Interpret", result: "rise 2 for each run 1", why: "slope measures change in $y$ per unit $x$" }
      ], answer: "The slope is $2$." },
      { problem: "Write the line with slope $-4$ through $(2,7)$ in slope-intercept form.", steps: [
        { do: "Use point-slope form", result: "$y-7=-4(x-2)$", why: "a point and slope determine the line" },
        { do: "Distribute", result: "$y-7=-4x+8$", why: "expand the right side" },
        { do: "Add $7$", result: "$y=-4x+15$", why: "isolate $y$" },
        { do: "Check the point", result: "$7=-4\\cdot2+15$", why: "the given point should satisfy the equation" },
        { do: "Simplify the check", result: "$7=7$", why: "the equation is consistent" }
      ], answer: "$y=-4x+15$." },
      { problem: "Find the $x$- and $y$-intercepts of $2x+3y=12$.", steps: [
        { do: "Set $y=0$", result: "$2x=12$", why: "the $x$-intercept lies on the $x$-axis" },
        { do: "Solve for $x$", result: "$x=6$", why: "divide by 2" },
        { do: "Write the $x$-intercept", result: "$(6,0)$", why: "the $y$-coordinate is zero" },
        { do: "Set $x=0$", result: "$3y=12$", why: "the $y$-intercept lies on the $y$-axis" },
        { do: "Solve and write the point", result: "$y=4$, so $(0,4)$", why: "divide by 3 and attach $x=0$" }
      ], answer: "The intercepts are $(6,0)$ and $(0,4)$." },
      { problem: "Find the equation of the line perpendicular to $y=\\dfrac23x-1$ through $(4,5)$.", steps: [
        { do: "Read the given slope", result: "$m=2/3$", why: "slope-intercept form displays the slope" },
        { do: "Find the perpendicular slope", result: "$m_\\perp=-3/2$", why: "perpendicular slopes are negative reciprocals" },
        { do: "Use point-slope form", result: "$y-5=-\\dfrac32(x-4)$", why: "use the required point and slope" },
        { do: "Distribute", result: "$y-5=-\\dfrac32x+6$", why: "$(-3/2)(-4)=6$" },
        { do: "Add $5$", result: "$y=-\\dfrac32x+11$", why: "solve for $y$" }
      ], answer: "$y=-\\dfrac32x+11$." },
      { problem: "A linear model predicts $\\hat y=1.8x+0.7$. Find the prediction at $x=4$ and the input where $\\hat y=10.6$.", steps: [
        { do: "Substitute $x=4$", result: "$\\hat y=1.8\\cdot4+0.7$", why: "evaluate the line" },
        { do: "Simplify the prediction", result: "$\\hat y=7.9$", why: "$7.2+0.7=7.9$" },
        { do: "Set the output to $10.6$", result: "$1.8x+0.7=10.6$", why: "solve for the input that gives that prediction" },
        { do: "Subtract $0.7$", result: "$1.8x=9.9$", why: "isolate the slope term" },
        { do: "Divide by $1.8$", result: "$x=5.5$", why: "$9.9/1.8=5.5$" }
      ], answer: "The prediction at $x=4$ is $7.9$; prediction $10.6$ occurs at $x=5.5$." }
    ],
    applications: [
      { title: "Linear regression", background: "The simplest supervised model fits a line to data, treating slope as change in prediction per feature unit.", numbers: "For $\\hat y=2.4x+1.1$, increasing $x$ from $3$ to $4$ raises prediction by $2.4$." },
      { title: "Decision boundaries", background: "A linear classifier in two features separates the plane by a line.", numbers: "The boundary $2x-y=1$ can be written $y=2x-1$; point $(1,0)$ gives $2(1)-0=2>1$ on one side." },
      { title: "Trend lines in monitoring", background: "Systems dashboards often fit local linear trends to latency or traffic.", numbers: "Latency rising from $80$ ms at noon to $95$ ms at 12:30 has slope $15/30=0.5$ ms per minute." },
      { title: "Computer graphics edges", background: "Rasterizers draw straight edges using line equations to decide which pixels are inside a triangle.", numbers: "Line through $(0,0)$ and $(4,2)$ has slope $1/2$, so at $x=6$ the continuation has $y=3$." },
      { title: "Interpolation", background: "Linear interpolation estimates values between two known samples by assuming constant slope.", numbers: "Between $(10,50)$ and $(20,70)$, slope is $2$, so at $x=13$ the value is $56$." },
      { title: "Perpendicular constraints", background: "Normals to lines are used in optimization and geometry to express constraints compactly.", numbers: "For $3x+4y=12$, the normal vector is $(3,4)$, and point $(0,3)$ lies on the line because $12=12$." }
    ],
    applicationsClose: "Lines are the first geometry of models: constant rate, straight boundary, and a compact equation for direction.",
    takeaways: [
      "Slope is rise over run: $m=(y_2-y_1)/(x_2-x_1)$ when the run is nonzero.",
      "Point-slope form uses one point and one slope; slope-intercept form displays $m$ and $b$.",
      "Vertical lines have equations $x=c$ and no finite slope.",
      "Parallel and perpendicular relationships can be read from slopes or normal vectors."
    ]
  },

  "math-11-05": {
    id: "math-11-05",
    title: "Vectors",
    tagline: "A vector is a directed quantity: it tells how much, and in which direction.",
    connections: {
      buildsOn: ["Cartesian coordinates", "Distance and midpoints", "Lines in the plane"],
      leadsTo: ["The dot product", "The cross product", "Lines in 3D"],
      usedWith: ["matrices", "linear combinations", "unit vectors", "coordinate transformations"]
    },
    motivation:
      "<p>A point says where something is. A vector says how to move, push, change, or represent. From one location to another, from one feature vector to another, from a gradient step to a velocity, vectors carry direction and size together.</p>" +
      "<p>That small shift is enormous for ML. A data example can be a vector of features, a model parameter can be a vector of weights, and learning can be a sequence of vector updates.</p>",
    definition:
      "<p>A <b>vector</b> in the plane is an ordered pair $\\mathbf{v}=\\langle v_1,v_2\\rangle$ representing a displacement with horizontal component $v_1$ and vertical component $v_2$. In $n$ dimensions, $\\mathbf{v}=\\langle v_1,\\ldots,v_n\\rangle$. Vector addition and scalar multiplication are componentwise: $$\\mathbf{u}+\\mathbf{v}=\\langle u_1+v_1,u_2+v_2\\rangle,\\qquad c\\mathbf{v}=\\langle cv_1,cv_2\\rangle.$$</p>" +
      "<p>The length, or norm, of a plane vector is $\\|\\mathbf{v}\\|=\\sqrt{v_1^2+v_2^2}$. This is the distance from the origin to the vector's tip when its tail is placed at the origin. A unit vector has length $1$ and records direction without scale.</p>" +
      "<p><b>Assumptions that matter:</b> vectors can be moved without changing them as long as their components stay the same; componentwise operations require matching dimensions; and the zero vector has length $0$ but no unique direction.</p>",
    worked: {
      problem: "Let $\\mathbf{u}=\\langle 3,-2\\rangle$ and $\\mathbf{v}=\\langle -1,5\\rangle$. Compute $2\\mathbf{u}+\\mathbf{v}$ and its length.",
      skills: ["scalar multiplication", "vector addition", "vector norm"],
      strategy: "Scale first, add component by component, then use the norm formula.",
      steps: [
        { do: "Scale $\\mathbf{u}$ by $2$", result: "$2\\mathbf{u}=\\langle 6,-4\\rangle$", why: "multiply each component by 2" },
        { do: "Add the first components", result: "$6+(-1)=5$", why: "vector addition is componentwise" },
        { do: "Add the second components", result: "$-4+5=1$", why: "add vertical components separately" },
        { do: "Write the resulting vector", result: "$2\\mathbf{u}+\\mathbf{v}=\\langle 5,1\\rangle$", why: "combine the two components" },
        { do: "Apply the length formula", result: "$\\|\\langle5,1\\rangle\\|=\\sqrt{5^2+1^2}$", why: "norm is Pythagorean length" },
        { do: "Simplify", result: "$\\sqrt{26}$", why: "$25+1=26$" }
      ],
      verify: "The result points mostly right with a small upward component, so a length a little above $5$ is sensible; $\\sqrt{26}\\approx5.10$.",
      answer: "$2\\mathbf{u}+\\mathbf{v}=\\langle5,1\\rangle$, with length $\\sqrt{26}$.",
      connects: "Vector algebra lets you combine directions and sizes by working cleanly with components."
    },
    practice: [
      { problem: "For $\\mathbf{a}=\\langle 4,3\\rangle$, find $\\|\\mathbf{a}\\|$ and a unit vector in the same direction.", steps: [
        { do: "Apply the norm formula", result: "$\\|\\mathbf{a}\\|=\\sqrt{4^2+3^2}$", why: "length comes from Pythagoras" },
        { do: "Simplify the norm", result: "$\\|\\mathbf{a}\\|=5$", why: "$16+9=25$" },
        { do: "Divide the first component by the norm", result: "$4/5$", why: "unit vector scales length to one" },
        { do: "Divide the second component by the norm", result: "$3/5$", why: "scale every component equally" },
        { do: "Write the unit vector", result: "$\\langle4/5,3/5\\rangle$", why: "same direction, length one" }
      ], answer: "$\\|\\mathbf{a}\\|=5$ and the unit vector is $\\langle4/5,3/5\\rangle$." },
      { problem: "Find the vector from $P=(-2,7)$ to $Q=(4,1)$.", steps: [
        { do: "Subtract the $x$ coordinates", result: "$4-(-2)=6$", why: "displacement uses final minus initial" },
        { do: "Subtract the $y$ coordinates", result: "$1-7=-6$", why: "vertical component is final $y$ minus initial $y$" },
        { do: "Write the displacement vector", result: "$\\langle6,-6\\rangle$", why: "vectors record component changes" },
        { do: "Interpret the first component", result: "6 units right", why: "positive horizontal component points right" },
        { do: "Interpret the second component", result: "6 units down", why: "negative vertical component points down" }
      ], answer: "The vector from $P$ to $Q$ is $\\langle6,-6\\rangle$." },
      { problem: "Compute $3\\langle1,-2,4\\rangle-\\langle5,0,-1\\rangle$.", steps: [
        { do: "Scale the first vector", result: "$3\\langle1,-2,4\\rangle=\\langle3,-6,12\\rangle$", why: "multiply each component by 3" },
        { do: "Subtract first components", result: "$3-5=-2$", why: "operate component by component" },
        { do: "Subtract second components", result: "$-6-0=-6$", why: "the middle component stays $-6$" },
        { do: "Subtract third components", result: "$12-(-1)=13$", why: "subtracting a negative adds" },
        { do: "Write the vector", result: "$\\langle-2,-6,13\\rangle$", why: "combine all three components" }
      ], answer: "$\\langle-2,-6,13\\rangle$." },
      { problem: "Write $\\langle 7,-1\\rangle$ as a linear combination of $\\mathbf{i}=\\langle1,0\\rangle$ and $\\mathbf{j}=\\langle0,1\\rangle$.", steps: [
        { do: "Match the first component", result: "$7\\mathbf{i}=\\langle7,0\\rangle$", why: "$\\mathbf{i}$ carries horizontal direction" },
        { do: "Match the second component", result: "$-1\\mathbf{j}=\\langle0,-1\\rangle$", why: "$\\mathbf{j}$ carries vertical direction" },
        { do: "Add the pieces", result: "$\\langle7,0\\rangle+\\langle0,-1\\rangle$", why: "component vectors combine independently" },
        { do: "Simplify", result: "$\\langle7,-1\\rangle$", why: "the sum matches the target vector" },
        { do: "Write the combination", result: "$7\\mathbf{i}-\\mathbf{j}$", why: "basis vectors name the coordinate directions" }
      ], answer: "$\\langle7,-1\\rangle=7\\mathbf{i}-\\mathbf{j}$." },
      { problem: "A gradient step uses $\\mathbf{w}_{new}=\\mathbf{w}-0.1\\mathbf{g}$ with $\\mathbf{w}=\\langle2,-1,3\\rangle$ and $\\mathbf{g}=\\langle4,-2,1\\rangle$. Find $\\mathbf{w}_{new}$.", steps: [
        { do: "Scale the gradient", result: "$0.1\\mathbf{g}=\\langle0.4,-0.2,0.1\\rangle$", why: "learning rate scales the update" },
        { do: "Subtract first components", result: "$2-0.4=1.6$", why: "update each weight component" },
        { do: "Subtract second components", result: "$-1-(-0.2)=-0.8$", why: "subtracting a negative increases the value" },
        { do: "Subtract third components", result: "$3-0.1=2.9$", why: "apply the same rule to the third component" },
        { do: "Write the new vector", result: "$\\langle1.6,-0.8,2.9\\rangle$", why: "combine updated weights" }
      ], answer: "$\\mathbf{w}_{new}=\\langle1.6,-0.8,2.9\\rangle$." }
    ],
    applications: [
      { title: "Feature vectors", background: "ML examples are often stored as vectors so algorithms can add, scale, and compare them.", numbers: "A user vector $\\langle0.2,1.5,3.0\\rangle$ scaled by $2$ becomes $\\langle0.4,3.0,6.0\\rangle$." },
      { title: "Gradient descent", background: "Training updates parameters by moving opposite a gradient vector.", numbers: "With $\\mathbf{w}=\\langle1,2\\rangle$, gradient $\\langle0.3,-0.5\\rangle$, and step $0.1$, the new weight is $\\langle0.97,2.05\\rangle$." },
      { title: "Velocity in physics engines", background: "Games and simulations use velocity vectors to update positions frame by frame.", numbers: "Position $(10,4)$ plus velocity $\\langle3,-1\\rangle$ for $0.5$ seconds gives $(11.5,3.5)$." },
      { title: "Embeddings", background: "Words, images, and ads can be embedded as high-dimensional vectors so similarity becomes geometry.", numbers: "A 3D embedding might be $\\langle0.1,-0.4,0.9\\rangle$ with norm $\\sqrt{0.01+0.16+0.81}=0.99$." },
      { title: "Forces and motion", background: "Several forces acting on an object add as vectors, combining directions component by component.", numbers: "Forces $\\langle5,0\\rangle$ and $\\langle-2,3\\rangle$ sum to $\\langle3,3\\rangle$." },
      { title: "Recommendation profiles", background: "A profile can average vectors for content a member liked, creating a direction of preference.", numbers: "Averaging $\\langle1,0\\rangle$ and $\\langle0.6,0.8\\rangle$ gives $\\langle0.8,0.4\\rangle$." }
    ],
    applicationsClose: "Vectors are the shared language of displacement, features, gradients, embeddings, forces, and updates.",
    takeaways: [
      "A vector records components of a directed quantity.",
      "Addition and scalar multiplication happen component by component.",
      "The norm $\\|\\mathbf{v}\\|$ measures vector length.",
      "Unit vectors keep direction while normalizing length to $1$."
    ]
  },

  "math-11-06": {
    id: "math-11-06",
    title: "The dot product",
    tagline: "The dot product measures how much two vectors point in the same direction.",
    connections: {
      buildsOn: ["Vectors", "trigonometric functions", "vector length"],
      leadsTo: ["The cross product", "Planes in 3D", "orthogonal projections"],
      usedWith: ["cosine similarity", "projections", "normal vectors", "matrix multiplication"]
    },
    motivation:
      "<p>Two vectors can both be long but point in very different directions. To compare directions, we need more than length. We need a number that says aligned, opposed, or perpendicular.</p>" +
      "<p>The <b>dot product</b> gives exactly that. It is simple component arithmetic, but it secretly contains angle information. That is why it appears everywhere from projections to attention scores.</p>",
    definition:
      "<p>For vectors $\\mathbf{a}=\\langle a_1,a_2,\\ldots,a_n\\rangle$ and $\\mathbf{b}=\\langle b_1,b_2,\\ldots,b_n\\rangle$, the <b>dot product</b> is $$\\mathbf{a}\\cdot\\mathbf{b}=a_1b_1+a_2b_2+\\cdots+a_nb_n.$$ Geometrically, $$\\mathbf{a}\\cdot\\mathbf{b}=\\|\\mathbf{a}\\|\\,\\|\\mathbf{b}\\|\\cos\\theta,$$ where $\\theta$ is the angle between the vectors.</p>" +
      "<p>The geometric formula says the dot product is positive when the angle is acute, zero when the vectors are perpendicular, and negative when the angle is obtuse. If both vectors are unit vectors, the dot product is exactly $\\cos\\theta$.</p>" +
      "<p><b>Assumptions that matter:</b> the vectors must have the same dimension; the angle formula uses Euclidean length; and zero dot product means orthogonal, though the zero vector has zero dot product with every vector without having a meaningful direction.</p>",
    worked: {
      problem: "For $\\mathbf{a}=\\langle2,3\\rangle$ and $\\mathbf{b}=\\langle4,-1\\rangle$, compute $\\mathbf{a}\\cdot\\mathbf{b}$ and decide whether the angle is acute, right, or obtuse.",
      skills: ["component multiplication", "angle interpretation", "orthogonality"],
      strategy: "Multiply matching components, add them, then read the sign of the result.",
      steps: [
        { do: "Multiply first components", result: "$2\\cdot4=8$", why: "dot product pairs matching coordinates" },
        { do: "Multiply second components", result: "$3\\cdot(-1)=-3$", why: "include the sign of each component" },
        { do: "Add the products", result: "$8+(-3)=5$", why: "the dot product is the sum of matching products" },
        { do: "State the dot product", result: "$\\mathbf{a}\\cdot\\mathbf{b}=5$", why: "combine the component contributions" },
        { do: "Read the sign", result: "positive", why: "$5>0$" },
        { do: "Interpret the angle", result: "acute", why: "positive dot product means $\\cos\\theta>0$" }
      ],
      verify: "The vectors share a strong rightward component, so a positive dot product and acute angle are reasonable.",
      answer: "$\\mathbf{a}\\cdot\\mathbf{b}=5$, so the angle between them is acute.",
      connects: "The dot product turns component arithmetic into a direction comparison."
    },
    practice: [
      { problem: "Compute $\\langle1,4\\rangle\\cdot\\langle3,2\\rangle$.", steps: [
        { do: "Multiply the first components", result: "$1\\cdot3=3$", why: "pair the $x$-components" },
        { do: "Multiply the second components", result: "$4\\cdot2=8$", why: "pair the $y$-components" },
        { do: "Add the products", result: "$3+8=11$", why: "dot product sums matching products" },
        { do: "Check the sign", result: "positive", why: "both vectors point generally in the same quadrant" },
        { do: "State the value", result: "$11$", why: "the arithmetic is complete" }
      ], answer: "The dot product is $11$." },
      { problem: "Determine whether $\\langle3,-2\\rangle$ and $\\langle4,6\\rangle$ are orthogonal.", steps: [
        { do: "Multiply first components", result: "$3\\cdot4=12$", why: "start the dot product" },
        { do: "Multiply second components", result: "$(-2)\\cdot6=-12$", why: "include the negative sign" },
        { do: "Add the products", result: "$12+(-12)=0$", why: "opposite contributions cancel" },
        { do: "Apply the orthogonality test", result: "orthogonal", why: "nonzero vectors with dot product zero are perpendicular" },
        { do: "State the angle", result: "$90^\\circ$", why: "orthogonal vectors meet at a right angle" }
      ], answer: "Yes. Their dot product is $0$, so they are orthogonal." },
      { problem: "Find the angle between $\\mathbf{u}=\\langle1,0\\rangle$ and $\\mathbf{v}=\\langle\\sqrt3,1\\rangle$.", steps: [
        { do: "Compute the dot product", result: "$\\mathbf{u}\\cdot\\mathbf{v}=\\sqrt3$", why: "$1\\cdot\\sqrt3+0\\cdot1=\\sqrt3$" },
        { do: "Compute $\\|\\mathbf{u}\\|$", result: "$1$", why: "unit vector along the $x$-axis" },
        { do: "Compute $\\|\\mathbf{v}\\|$", result: "$\\sqrt{3+1}=2$", why: "use the norm formula" },
        { do: "Solve for cosine", result: "$\\cos\\theta=\\dfrac{\\sqrt3}{1\\cdot2}=\\dfrac{\\sqrt3}{2}$", why: "use $\\mathbf{u}\\cdot\\mathbf{v}=\\|\\mathbf{u}\\|\\|\\mathbf{v}\\|\\cos\\theta$" },
        { do: "Find the angle", result: "$\\theta=\\pi/6$", why: "$\\cos(\\pi/6)=\\sqrt3/2$" }
      ], answer: "The angle is $\\pi/6$, or $30^\\circ$." },
      { problem: "Project $\\mathbf{a}=\\langle6,2\\rangle$ onto $\\mathbf{b}=\\langle3,1\\rangle$.", steps: [
        { do: "Compute $\\mathbf{a}\\cdot\\mathbf{b}$", result: "$6\\cdot3+2\\cdot1=20$", why: "projection needs the dot product" },
        { do: "Compute $\\mathbf{b}\\cdot\\mathbf{b}$", result: "$3^2+1^2=10$", why: "divide by the squared length of $\\mathbf{b}$" },
        { do: "Compute the scalar coefficient", result: "$20/10=2$", why: "projection coefficient is $(\\mathbf{a}\\cdot\\mathbf{b})/(\\mathbf{b}\\cdot\\mathbf{b})$" },
        { do: "Multiply by $\\mathbf{b}$", result: "$2\\langle3,1\\rangle=\\langle6,2\\rangle$", why: "the projection lies along $\\mathbf{b}$" },
        { do: "Interpret", result: "the projection equals $\\mathbf{a}$", why: "$\\mathbf{a}$ is already a multiple of $\\mathbf{b}$" }
      ], answer: "The projection is $\\langle6,2\\rangle$." },
      { problem: "Two unit embeddings have dot product $0.25$. Find their cosine similarity and approximate angle using $\\arccos(0.25)\\approx1.318$ radians.", steps: [
        { do: "Use unit lengths", result: "$\\|\\mathbf{a}\\|=\\|\\mathbf{b}\\|=1$", why: "the embeddings are unit vectors" },
        { do: "Apply the angle formula", result: "$\\mathbf{a}\\cdot\\mathbf{b}=\\cos\\theta$", why: "unit lengths make the denominator $1$" },
        { do: "Substitute the dot product", result: "$\\cos\\theta=0.25$", why: "dot product equals cosine similarity for unit vectors" },
        { do: "Take inverse cosine", result: "$\\theta=\\arccos(0.25)$", why: "recover the angle from cosine" },
        { do: "Use the approximation", result: "$\\theta\\approx1.318$ radians", why: "the problem provides the inverse cosine value" }
      ], answer: "The cosine similarity is $0.25$, and the angle is about $1.318$ radians." }
    ],
    applications: [
      { title: "Cosine similarity", background: "Embedding systems often compare direction rather than raw length, especially for text and recommendation vectors.", numbers: "For unit vectors with dot product $0.8$, cosine similarity is $0.8$ and the angle is about $36.9^\\circ$." },
      { title: "Linear model scores", background: "A linear model computes a weighted sum, which is a dot product between weights and features.", numbers: "Weights $\\langle0.5,-1,2\\rangle$ and features $\\langle4,3,1\\rangle$ give score $2-3+2=1$." },
      { title: "Attention scores", background: "Transformer attention compares query and key vectors using dot products before normalization.", numbers: "Query $\\langle1,2\\rangle$ and key $\\langle3,1\\rangle$ have score $1\\cdot3+2\\cdot1=5$." },
      { title: "Work in physics", background: "Work equals force times displacement in the same direction, which is a dot product.", numbers: "Force $\\langle10,0\\rangle$ over displacement $\\langle3,4\\rangle$ does work $30$ joules in the horizontal direction." },
      { title: "Projection onto a feature", background: "Projection measures how much of one vector lies along another, useful in dimensionality reduction intuition.", numbers: "Projection length of $\\langle3,4\\rangle$ on unit vector $\\langle1,0\\rangle$ is $3$." },
      { title: "Orthogonal residuals", background: "Least squares leaves residuals perpendicular to the fitted feature directions at the optimum.", numbers: "If residual $\\langle2,-1\\rangle$ and feature $\\langle1,2\\rangle$ have dot product $2-2=0$, they are orthogonal." }
    ],
    applicationsClose: "The dot product is the arithmetic of alignment: score, similarity, projection, work, and orthogonality all share it.",
    takeaways: [
      "$\\mathbf{a}\\cdot\\mathbf{b}$ multiplies matching components and adds the results.",
      "Geometrically, $\\mathbf{a}\\cdot\\mathbf{b}=\\|\\mathbf{a}\\|\\|\\mathbf{b}\\|\\cos\\theta$.",
      "Positive, zero, and negative dot products correspond to acute, right, and obtuse angles for nonzero vectors.",
      "For unit vectors, the dot product is cosine similarity."
    ]
  },

  "math-11-07": {
    id: "math-11-07",
    title: "The cross product",
    tagline: "The cross product builds a vector perpendicular to two 3D directions and measures the area they span.",
    connections: {
      buildsOn: ["Vectors", "The dot product", "determinants"],
      leadsTo: ["Lines in 3D", "Planes in 3D", "surface normals"],
      usedWith: ["orientation", "area", "normal vectors", "3D geometry"]
    },
    motivation:
      "<p>In 3D, two nonparallel directions determine a flat sheet. To describe that sheet, we often want a direction sticking straight out of it. The dot product can test perpendicularity, but it does not create the perpendicular vector for us.</p>" +
      "<p>The <b>cross product</b> does. Given two 3D vectors, it produces a new vector perpendicular to both, with length equal to the area of the parallelogram they span. That is why it is everywhere in geometry, graphics, and physics.</p>",
    definition:
      "<p>For $\\mathbf{a}=\\langle a_1,a_2,a_3\\rangle$ and $\\mathbf{b}=\\langle b_1,b_2,b_3\\rangle$, the cross product is $$\\mathbf{a}\\times\\mathbf{b}=\\langle a_2b_3-a_3b_2,\\ a_3b_1-a_1b_3,\\ a_1b_2-a_2b_1\\rangle.$$ Its length is $$\\|\\mathbf{a}\\times\\mathbf{b}\\|=\\|\\mathbf{a}\\|\\,\\|\\mathbf{b}\\|\\sin\\theta,$$ the area of the parallelogram formed by $\\mathbf{a}$ and $\\mathbf{b}$.</p>" +
      "<p>The direction follows the right-hand rule: curl from $\\mathbf{a}$ toward $\\mathbf{b}$, and your thumb points along $\\mathbf{a}\\times\\mathbf{b}$. Reversing the order reverses the direction, so $\\mathbf{b}\\times\\mathbf{a}=-(\\mathbf{a}\\times\\mathbf{b})$.</p>" +
      "<p><b>Assumptions that matter:</b> this vector-valued cross product is for three-dimensional vectors; parallel vectors have cross product $\\mathbf{0}$ because they span zero area; and the output direction depends on the order of the inputs.</p>",
    worked: {
      problem: "Compute $\\mathbf{a}\\times\\mathbf{b}$ for $\\mathbf{a}=\\langle1,2,3\\rangle$ and $\\mathbf{b}=\\langle4,0,-1\\rangle$.",
      skills: ["cross product components", "3D vectors", "orthogonality check"],
      strategy: "Use the component formula carefully, then verify perpendicularity with dot products.",
      steps: [
        { do: "Compute the first component", result: "$2(-1)-3(0)=-2$", why: "use $a_2b_3-a_3b_2$" },
        { do: "Compute the second component", result: "$3(4)-1(-1)=13$", why: "use $a_3b_1-a_1b_3$" },
        { do: "Compute the third component", result: "$1(0)-2(4)=-8$", why: "use $a_1b_2-a_2b_1$" },
        { do: "Write the cross product", result: "$\\mathbf{a}\\times\\mathbf{b}=\\langle-2,13,-8\\rangle$", why: "combine the three components" },
        { do: "Check with $\\mathbf{a}$", result: "$1(-2)+2(13)+3(-8)=0$", why: "the cross product should be perpendicular to $\\mathbf{a}$" },
        { do: "Check with $\\mathbf{b}$", result: "$4(-2)+0(13)+(-1)(-8)=0$", why: "the cross product should be perpendicular to $\\mathbf{b}$" }
      ],
      verify: "Both dot products are zero, so $\\langle-2,13,-8\\rangle$ is perpendicular to the two input vectors as required.",
      answer: "$\\mathbf{a}\\times\\mathbf{b}=\\langle-2,13,-8\\rangle$.",
      connects: "The cross product turns two directions into the normal direction of the plane they span."
    },
    practice: [
      { problem: "Compute $\\langle1,0,0\\rangle\\times\\langle0,1,0\\rangle$.", steps: [
        { do: "Name the vectors", result: "$\\mathbf{i}=\\langle1,0,0\\rangle$, $\\mathbf{j}=\\langle0,1,0\\rangle$", why: "these are standard basis directions" },
        { do: "Compute the first component", result: "$0\\cdot0-0\\cdot1=0$", why: "use the cross product formula" },
        { do: "Compute the second component", result: "$0\\cdot0-1\\cdot0=0$", why: "use the middle component formula" },
        { do: "Compute the third component", result: "$1\\cdot1-0\\cdot0=1$", why: "the $x$-$y$ plane normal points along $z$" },
        { do: "Write the result", result: "$\\langle0,0,1\\rangle$", why: "right-hand rule gives positive $z$" }
      ], answer: "$\\langle1,0,0\\rangle\\times\\langle0,1,0\\rangle=\\langle0,0,1\\rangle$." },
      { problem: "Compute $\\langle2,1,0\\rangle\\times\\langle0,3,4\\rangle$.", steps: [
        { do: "Compute the first component", result: "$1\\cdot4-0\\cdot3=4$", why: "use $a_2b_3-a_3b_2$" },
        { do: "Compute the second component", result: "$0\\cdot0-2\\cdot4=-8$", why: "use $a_3b_1-a_1b_3$" },
        { do: "Compute the third component", result: "$2\\cdot3-1\\cdot0=6$", why: "use $a_1b_2-a_2b_1$" },
        { do: "Write the vector", result: "$\\langle4,-8,6\\rangle$", why: "combine the components" },
        { do: "Factor if desired", result: "$2\\langle2,-4,3\\rangle$", why: "a common factor can simplify direction" }
      ], answer: "$\\langle4,-8,6\\rangle$." },
      { problem: "Find the area of the parallelogram spanned by $\\mathbf{u}=\\langle3,0,0\\rangle$ and $\\mathbf{v}=\\langle0,4,0\\rangle$.", steps: [
        { do: "Compute the cross product", result: "$\\mathbf{u}\\times\\mathbf{v}=\\langle0,0,12\\rangle$", why: "basis directions along $x$ and $y$ span a $z$ normal" },
        { do: "Apply the norm formula", result: "$\\|\\langle0,0,12\\rangle\\|=\\sqrt{0^2+0^2+12^2}$", why: "area equals cross product length" },
        { do: "Simplify the norm", result: "$12$", why: "$\\sqrt{144}=12$" },
        { do: "Compare with rectangle area", result: "$3\\cdot4=12$", why: "the vectors are perpendicular side lengths" },
        { do: "State the area", result: "$12$ square units", why: "area units come from two lengths" }
      ], answer: "The parallelogram area is $12$ square units." },
      { problem: "Show that $\\langle1,2,3\\rangle$ and $\\langle2,4,6\\rangle$ have zero cross product.", steps: [
        { do: "Notice the scaling", result: "$\\langle2,4,6\\rangle=2\\langle1,2,3\\rangle$", why: "the vectors are parallel" },
        { do: "Compute the first component", result: "$2\\cdot6-3\\cdot4=0$", why: "parallel components cancel" },
        { do: "Compute the second component", result: "$3\\cdot2-1\\cdot6=0$", why: "same direction gives no perpendicular area" },
        { do: "Compute the third component", result: "$1\\cdot4-2\\cdot2=0$", why: "the final component also cancels" },
        { do: "Write the result", result: "$\\mathbf{0}$", why: "parallel vectors span zero parallelogram area" }
      ], answer: "Their cross product is $\\langle0,0,0\\rangle$." },
      { problem: "A triangle has vertices $A=(0,0,0)$, $B=(2,0,1)$, and $C=(0,3,1)$. Find its area.", steps: [
        { do: "Form vector $\\overrightarrow{AB}$", result: "$\\langle2,0,1\\rangle$", why: "subtract $A$ from $B$" },
        { do: "Form vector $\\overrightarrow{AC}$", result: "$\\langle0,3,1\\rangle$", why: "subtract $A$ from $C$" },
        { do: "Compute the cross product", result: "$\\overrightarrow{AB}\\times\\overrightarrow{AC}=\\langle-3,-2,6\\rangle$", why: "this gives a parallelogram area vector" },
        { do: "Compute its length", result: "$\\sqrt{(-3)^2+(-2)^2+6^2}=7$", why: "the parallelogram area is the norm" },
        { do: "Take half", result: "$7/2$", why: "a triangle is half the parallelogram" }
      ], answer: "The triangle area is $7/2$ square units." }
    ],
    applications: [
      { title: "Surface normals in graphics", background: "Lighting calculations need a normal vector perpendicular to a surface so brightness can depend on angle.", numbers: "Triangle edges $\\langle1,0,0\\rangle$ and $\\langle0,1,0\\rangle$ give normal $\\langle0,0,1\\rangle$." },
      { title: "Triangle area in 3D meshes", background: "Mesh processing computes triangle areas for rendering, simulation, and simplification.", numbers: "If edge cross product has length $10$, the triangle area is $5$." },
      { title: "Torque", background: "Physics uses cross products for rotational effect: force farther from a pivot creates more torque when perpendicular.", numbers: "Lever arm $\\langle2,0,0\\rangle$ and force $\\langle0,5,0\\rangle$ give torque $\\langle0,0,10\\rangle$." },
      { title: "Plane equations", background: "Two direction vectors in a plane produce a normal vector, which becomes the coefficients of a plane equation.", numbers: "Directions $\\langle1,0,1\\rangle$ and $\\langle0,1,1\\rangle$ cross to $\\langle-1,-1,1\\rangle$." },
      { title: "Orientation tests", background: "Geometry algorithms use signed cross products to decide clockwise versus counterclockwise order.", numbers: "In 2D, vectors $(1,0)$ and $(0,1)$ have scalar $z$-cross value $1$, indicating a left turn." },
      { title: "Camera coordinate frames", background: "A camera basis can be built by crossing viewing and up directions to create a perpendicular right direction.", numbers: "View $\\langle0,0,-1\\rangle$ crossed with up $\\langle0,1,0\\rangle$ gives right $\\langle1,0,0\\rangle$." }
    ],
    applicationsClose: "The cross product is the 3D tool for normals, areas, orientation, and rotational effects.",
    takeaways: [
      "The cross product of two 3D vectors is perpendicular to both input vectors.",
      "Its length is the area of the parallelogram spanned by the inputs.",
      "Order matters: $\\mathbf{b}\\times\\mathbf{a}=-(\\mathbf{a}\\times\\mathbf{b})$.",
      "Parallel vectors have zero cross product."
    ]
  },

  "math-11-08": {
    id: "math-11-08",
    title: "Lines in 3D",
    tagline: "A 3D line is a starting point plus every scalar multiple of a direction vector.",
    connections: {
      buildsOn: ["Vectors", "The dot product", "The cross product"],
      leadsTo: ["Planes in 3D", "parametric geometry", "linear algebra"],
      usedWith: ["parametric equations", "direction vectors", "intersections", "distance"]
    },
    motivation:
      "<p>In the plane, a slope can describe a nonvertical line. In 3D, one slope is not enough because a line can move in $x$, $y$, and $z$ at the same time.</p>" +
      "<p>The vector idea fixes this beautifully: choose one point on the line and one direction vector. Then every point on the line is reached by scaling that direction and adding it to the starting point.</p>",
    definition:
      "<p>A line in 3D through point $\\mathbf{p}_0=\\langle x_0,y_0,z_0\\rangle$ with direction vector $\\mathbf{v}=\\langle a,b,c\\rangle\\ne\\mathbf{0}$ is $$\\mathbf{r}(t)=\\mathbf{p}_0+t\\mathbf{v}.$$ In coordinates, this means $$x=x_0+at,\\qquad y=y_0+bt,\\qquad z=z_0+ct,$$ where $t$ is a real parameter.</p>" +
      "<p>The parameter $t$ tells how far along the direction vector you have moved: $t=0$ gives the base point, $t=1$ moves one full direction vector, and negative $t$ moves the opposite way. Two 3D lines can intersect, be parallel, or be skew, meaning nonparallel and not intersecting.</p>" +
      "<p><b>Assumptions that matter:</b> the direction vector must be nonzero; the same line has many possible base points and scaled direction vectors; and solving intersections requires matching all three coordinates with the same parameter values.</p>",
    worked: {
      problem: "Find a parametric equation for the line through $P=(1,-2,3)$ and $Q=(5,0,-1)$.",
      skills: ["direction vectors", "parametric equations", "3D coordinates"],
      strategy: "Subtract the points to get a direction vector, then attach that direction to one point.",
      steps: [
        { do: "Subtract $x$-coordinates", result: "$5-1=4$", why: "direction vector uses final minus initial" },
        { do: "Subtract $y$-coordinates", result: "$0-(-2)=2$", why: "find the vertical-in-plane component" },
        { do: "Subtract $z$-coordinates", result: "$-1-3=-4$", why: "find the depth component" },
        { do: "Write a direction vector", result: "$\\mathbf{v}=\\langle4,2,-4\\rangle$", why: "this points from $P$ to $Q$" },
        { do: "Use point $P$", result: "$\\mathbf{r}(t)=\\langle1,-2,3\\rangle+t\\langle4,2,-4\\rangle$", why: "point plus scalar times direction describes the whole line" },
        { do: "Write coordinate equations", result: "$x=1+4t,\\ y=-2+2t,\\ z=3-4t$", why: "expand component by component" }
      ],
      verify: "At $t=1$, the equation gives $(5,0,-1)$, so it reaches $Q$ from $P$ in one direction step.",
      answer: "$\\mathbf{r}(t)=\\langle1,-2,3\\rangle+t\\langle4,2,-4\\rangle$, or $x=1+4t$, $y=-2+2t$, $z=3-4t$.",
      connects: "A 3D line is not about slope alone; it is about a full direction vector."
    },
    practice: [
      { problem: "For $\\mathbf{r}(t)=\\langle2,1,-3\\rangle+t\\langle1,4,2\\rangle$, find the point at $t=3$.", steps: [
        { do: "Scale the direction vector", result: "$3\\langle1,4,2\\rangle=\\langle3,12,6\\rangle$", why: "parameter $t=3$ means three direction steps" },
        { do: "Add first components", result: "$2+3=5$", why: "update $x$" },
        { do: "Add second components", result: "$1+12=13$", why: "update $y$" },
        { do: "Add third components", result: "$-3+6=3$", why: "update $z$" },
        { do: "Write the point", result: "$(5,13,3)$", why: "combine the coordinates" }
      ], answer: "At $t=3$, the point is $(5,13,3)$." },
      { problem: "Does the point $(4,7,1)$ lie on $\\mathbf{r}(t)=\\langle1,1,4\\rangle+t\\langle1,2,-1\\rangle$?", steps: [
        { do: "Use the $x$ equation", result: "$1+t=4$", why: "match the target $x$ coordinate" },
        { do: "Solve for $t$", result: "$t=3$", why: "subtract 1" },
        { do: "Check the $y$ equation", result: "$1+2(3)=7$", why: "same parameter must match $y$" },
        { do: "Check the $z$ equation", result: "$4-3=1$", why: "same parameter must match $z$" },
        { do: "Decide", result: "the point lies on the line", why: "one value $t=3$ satisfies all coordinates" }
      ], answer: "Yes. The point corresponds to $t=3$." },
      { problem: "Find a line through $(0,2,5)$ parallel to $\\mathbf{d}=\\langle-2,1,3\\rangle$.", steps: [
        { do: "Choose the base point", result: "$\\mathbf{p}_0=\\langle0,2,5\\rangle$", why: "the line must pass through this point" },
        { do: "Choose the direction", result: "$\\mathbf{v}=\\langle-2,1,3\\rangle$", why: "parallel lines share a direction vector up to scaling" },
        { do: "Write vector form", result: "$\\mathbf{r}(t)=\\langle0,2,5\\rangle+t\\langle-2,1,3\\rangle$", why: "point plus parameter times direction" },
        { do: "Write the $x$ equation", result: "$x=-2t$", why: "start at $0$ and add $-2t$" },
        { do: "Write the other equations", result: "$y=2+t,\\ z=5+3t$", why: "expand remaining components" }
      ], answer: "$\\mathbf{r}(t)=\\langle0,2,5\\rangle+t\\langle-2,1,3\\rangle$." },
      { problem: "Find where $\\mathbf{r}(t)=\\langle1,0,2\\rangle+t\\langle2,1,-1\\rangle$ meets the plane $z=0$.", steps: [
        { do: "Write the $z$ coordinate", result: "$z=2-t$", why: "use the third component of the line" },
        { do: "Set $z=0$", result: "$2-t=0$", why: "the plane consists of points with zero $z$" },
        { do: "Solve for $t$", result: "$t=2$", why: "move along the line until depth is zero" },
        { do: "Compute $x$", result: "$x=1+2(2)=5$", why: "substitute the same parameter" },
        { do: "Compute $y$", result: "$y=0+1(2)=2$", why: "substitute into the $y$ equation" }
      ], answer: "The line meets $z=0$ at $(5,2,0)$." },
      { problem: "A camera ray starts at $C=(0,0,2)$ and points in direction $\\langle3,4,-1\\rangle$. Where is it after moving to parameter $t=5$, and how far from $C$ is that point?", steps: [
        { do: "Scale the direction", result: "$5\\langle3,4,-1\\rangle=\\langle15,20,-5\\rangle$", why: "parameter $5$ means five direction-vector steps" },
        { do: "Add to the start", result: "$(15,20,-3)$", why: "$(0,0,2)+\\langle15,20,-5\\rangle$" },
        { do: "Find the direction length", result: "$\\sqrt{3^2+4^2+(-1)^2}=\\sqrt{26}$", why: "one step has this Euclidean length" },
        { do: "Scale the length by $5$", result: "$5\\sqrt{26}$", why: "distance traveled scales with the parameter magnitude" },
        { do: "Approximate if desired", result: "$5\\sqrt{26}\\approx25.5$", why: "$\\sqrt{26}\\approx5.10$" }
      ], answer: "The point is $(15,20,-3)$, and its distance from $C$ is $5\\sqrt{26}\\approx25.5$." }
    ],
    applications: [
      { title: "Ray tracing", background: "Rendering follows rays from a camera through pixels into a 3D scene, using line equations to find intersections.", numbers: "A ray $\\mathbf{r}(t)=\\langle0,0,1\\rangle+t\\langle2,0,-1\\rangle$ hits $z=0$ when $1-t=0$, so at $(2,0,0)$." },
      { title: "Robot paths", background: "A straight 3D path can be planned as a base position plus a direction vector.", numbers: "From $(1,2,0)$ with direction $\\langle0.5,0,0.2\\rangle$, at $t=4$ the robot is at $(3,2,0.8)$." },
      { title: "Line-of-sight checks", background: "Games and simulations test whether a line from viewer to object crosses an obstacle.", numbers: "Viewer $(0,0,1)$ to object $(10,0,1)$ has direction $\\langle10,0,0\\rangle$ and midpoint at $t=0.5$ is $(5,0,1)$." },
      { title: "3D interpolation", background: "Animation moves objects between 3D keyframes using line segments.", numbers: "Halfway from $(2,4,6)$ to $(8,10,0)$ is $(5,7,3)$." },
      { title: "Sensor beams", background: "Lidar and depth cameras emit rays whose intersections estimate scene geometry.", numbers: "A beam from $(0,0,0)$ in direction $\\langle0,1,2\\rangle$ reaches $(0,3,6)$ at $t=3$." },
      { title: "Optimization search lines", background: "Line search methods examine a one-dimensional path through a high-dimensional parameter space.", numbers: "Weights $\\mathbf{w}=\\langle1,-1,2\\rangle$ and direction $\\mathbf{d}=\\langle-0.2,0.4,0\\rangle$ give $\\mathbf{w}(0.5)=\\langle0.9,-0.8,2\\rangle$." }
    ],
    applicationsClose: "A 3D line is a movable recipe: start here, move in this direction, choose how far.",
    takeaways: [
      "A 3D line has vector form $\\mathbf{r}(t)=\\mathbf{p}_0+t\\mathbf{v}$.",
      "The direction vector must be nonzero and can be scaled without changing the line.",
      "A point lies on the line only if one parameter value satisfies all coordinates.",
      "Lines in 3D can be intersecting, parallel, or skew."
    ]
  },

  "math-11-09": {
    id: "math-11-09",
    title: "Planes in 3D",
    tagline: "A plane is a flat 3D surface best described by a point and a perpendicular normal vector.",
    connections: {
      buildsOn: ["Vectors", "The dot product", "The cross product", "Lines in 3D"],
      leadsTo: ["linear algebra", "multivariable calculus", "hyperplanes"],
      usedWith: ["normal vectors", "linear equations", "projections", "3D intersections"]
    },
    motivation:
      "<p>A line is the flat path through space. A plane is the flat sheet. In 3D, planes are where surfaces, constraints, decision boundaries, and tangent approximations begin.</p>" +
      "<p>The cleanest way to describe a plane is not by every direction inside it, but by one direction outside it: a <b>normal vector</b> perpendicular to the whole plane. The dot product then turns perpendicularity into an equation.</p>",
    definition:
      "<p>A plane through point $P_0=(x_0,y_0,z_0)$ with nonzero normal vector $\\mathbf{n}=\\langle A,B,C\\rangle$ is the set of points $(x,y,z)$ satisfying $$A(x-x_0)+B(y-y_0)+C(z-z_0)=0.$$ Expanding gives the standard form $$Ax+By+Cz=D,$$ where $D=Ax_0+By_0+Cz_0$.</p>" +
      "<p>This equation comes from the dot product. For any point $P=(x,y,z)$ in the plane, the displacement $\\overrightarrow{P_0P}=\\langle x-x_0,y-y_0,z-z_0\\rangle$ lies inside the plane, so it must be perpendicular to $\\mathbf{n}$. Therefore $\\mathbf{n}\\cdot\\overrightarrow{P_0P}=0$.</p>" +
      "<p><b>Assumptions that matter:</b> the normal vector cannot be zero; multiplying all coefficients by the same nonzero scalar gives the same plane; and two nonparallel direction vectors in a plane can produce a normal by their cross product.</p>",
    worked: {
      problem: "Find the plane through $P_0=(1,-2,3)$ with normal vector $\\mathbf{n}=\\langle2,-1,4\\rangle$.",
      skills: ["normal vectors", "dot product equations", "plane standard form"],
      strategy: "Use the normal vector dotted with a displacement from the known point, then expand.",
      steps: [
        { do: "Write the displacement", result: "$\\langle x-1,y+2,z-3\\rangle$", why: "subtract the base point from a general point" },
        { do: "Dot with the normal", result: "$2(x-1)-1(y+2)+4(z-3)=0$", why: "in-plane displacements are perpendicular to the normal" },
        { do: "Distribute", result: "$2x-2-y-2+4z-12=0$", why: "expand each term" },
        { do: "Combine constants", result: "$2x-y+4z-16=0$", why: "$-2-2-12=-16$" },
        { do: "Move the constant", result: "$2x-y+4z=16$", why: "standard form keeps variables on one side" },
        { do: "Check the point", result: "$2(1)-(-2)+4(3)=16$", why: "the given point should satisfy the plane equation" }
      ],
      verify: "The check gives $2+2+12=16$, so the plane contains $P_0$ and has the requested normal coefficients.",
      answer: "The plane is $2x-y+4z=16$.",
      connects: "A plane equation is a perpendicularity condition written with the dot product."
    },
    practice: [
      { problem: "Find the plane through $(0,1,2)$ with normal $\\langle3,0,-2\\rangle$.", steps: [
        { do: "Write the displacement", result: "$\\langle x,y-1,z-2\\rangle$", why: "subtract the known point" },
        { do: "Dot with the normal", result: "$3x+0(y-1)-2(z-2)=0$", why: "plane displacements are orthogonal to the normal" },
        { do: "Remove the zero term", result: "$3x-2(z-2)=0$", why: "the $y$ coefficient is zero" },
        { do: "Distribute", result: "$3x-2z+4=0$", why: "expand the last term" },
        { do: "Write standard form", result: "$3x-2z=-4$", why: "move the constant to the other side" }
      ], answer: "The plane is $3x-2z=-4$." },
      { problem: "Check whether $(2,-1,3)$ lies on the plane $x+2y-z=-3$.", steps: [
        { do: "Substitute $x=2$", result: "$2+2y-z$", why: "begin evaluating the left side" },
        { do: "Substitute $y=-1$", result: "$2+2(-1)-z$", why: "use the point's second coordinate" },
        { do: "Substitute $z=3$", result: "$2+2(-1)-3$", why: "use the point's third coordinate" },
        { do: "Simplify", result: "$2-2-3=-3$", why: "combine terms" },
        { do: "Compare with the right side", result: "$-3=-3$", why: "the equation is satisfied" }
      ], answer: "Yes. The point lies on the plane." },
      { problem: "Find a normal vector to the plane through $A=(0,0,0)$, $B=(1,2,0)$, and $C=(0,1,3)$.", steps: [
        { do: "Form $\\overrightarrow{AB}$", result: "$\\langle1,2,0\\rangle$", why: "one direction inside the plane" },
        { do: "Form $\\overrightarrow{AC}$", result: "$\\langle0,1,3\\rangle$", why: "a second direction inside the plane" },
        { do: "Compute the first cross component", result: "$2\\cdot3-0\\cdot1=6$", why: "cross product gives a perpendicular vector" },
        { do: "Compute the second cross component", result: "$0\\cdot0-1\\cdot3=-3$", why: "use the middle component formula" },
        { do: "Compute the third cross component", result: "$1\\cdot1-2\\cdot0=1$", why: "complete the normal vector" }
      ], answer: "A normal vector is $\\langle6,-3,1\\rangle$." },
      { problem: "Find the equation of the plane through $(0,0,0)$, $(1,2,0)$, and $(0,1,3)$.", steps: [
        { do: "Use two direction vectors", result: "$\\langle1,2,0\\rangle$ and $\\langle0,1,3\\rangle$", why: "subtract the origin from the other two points" },
        { do: "Take their cross product", result: "$\\langle6,-3,1\\rangle$", why: "this is a normal vector from the previous calculation" },
        { do: "Use the origin as base point", result: "$6(x-0)-3(y-0)+1(z-0)=0$", why: "normal dotted with displacement equals zero" },
        { do: "Simplify", result: "$6x-3y+z=0$", why: "the base point is the origin" },
        { do: "Check point $(1,2,0)$", result: "$6-6+0=0$", why: "one non-origin point satisfies the plane" }
      ], answer: "The plane is $6x-3y+z=0$." },
      { problem: "A linear classifier in three features uses boundary $2x_1-x_2+3x_3=6$. Find a normal vector and classify point $(1,1,2)$ by the sign of left side minus $6$.", steps: [
        { do: "Read the normal vector", result: "$\\mathbf{n}=\\langle2,-1,3\\rangle$", why: "plane coefficients form the normal" },
        { do: "Evaluate the left side", result: "$2(1)-1+3(2)$", why: "substitute the point into the boundary expression" },
        { do: "Simplify the left side", result: "$7$", why: "$2-1+6=7$" },
        { do: "Subtract the boundary value", result: "$7-6=1$", why: "signed score compares the point to the plane" },
        { do: "Read the sign", result: "positive side", why: "the signed score is greater than zero" }
      ], answer: "A normal vector is $\\langle2,-1,3\\rangle$, and $(1,1,2)$ lies on the positive side of the boundary." }
    ],
    applications: [
      { title: "Linear decision boundaries", background: "A linear classifier in three features separates space with a plane; in more dimensions, the same idea is a hyperplane.", numbers: "Boundary $2x-y+z=4$ gives point $(1,0,1)$ score $3-4=-1$, so it lies on the negative side." },
      { title: "Tangent planes", background: "Multivariable calculus approximates a curved surface near a point by a plane, just as a tangent line approximates a curve.", numbers: "For $z=2x+3y+1$, at $(1,2)$ the plane value is $2+6+1=9$." },
      { title: "3D graphics surfaces", background: "A flat polygon face lies in a plane, and its normal controls lighting and visibility.", numbers: "Plane $z=5$ has normal $\\langle0,0,1\\rangle$; every point on it has depth $5$." },
      { title: "Constraint equations", background: "Optimization often restricts variables to a linear constraint, which is geometrically a plane.", numbers: "The constraint $x+y+z=1$ includes $(0.2,0.3,0.5)$ because the coordinates sum to $1$." },
      { title: "Distance to a plane", background: "Distances from points to planes appear in geometry processing and support-vector methods.", numbers: "For plane $x=0$, point $(3,4,5)$ is distance $3$ away because only the $x$ coordinate is perpendicular." },
      { title: "Plane fitting", background: "Point clouds from depth sensors are often approximated by planes to detect floors, walls, or tabletops.", numbers: "Points with $z$ near $1.0$, such as $0.98$, $1.01$, and $1.00$, fit the plane $z=1$ with errors $0.02$, $0.01$, and $0$." }
    ],
    applicationsClose: "Planes are flat constraints: the same normal-vector idea powers surfaces, classifiers, approximations, and geometry processing.",
    takeaways: [
      "A plane can be written from a point and nonzero normal vector using $\\mathbf{n}\\cdot\\overrightarrow{P_0P}=0$.",
      "Standard form $Ax+By+Cz=D$ has normal vector $\\langle A,B,C\\rangle$.",
      "Two nonparallel directions in a plane produce a normal through the cross product.",
      "Plane equations classify points by which side of the plane they lie on."
    ]
  }
};
