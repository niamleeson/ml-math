module.exports = {
  "math-01-47": {
    id: "math-01-47",
    title: "Improper integrals",
    tagline: "Measure a total amount over an infinite interval, or near a point where the function blows up.",
    connections: {
      buildsOn: ["definite integrals", "limits", "antiderivatives"],
      leadsTo: ["convergence tests for series", "Laplace transforms", "probability densities on unbounded domains"],
      usedWith: ["area under curves", "comparison tests", "exponential decay", "infinite limits"]
    },
    motivation:
      `<p>You already know how to compute a definite integral like $\\int_0^3 e^{-x}\\,dx$: find an antiderivative, plug in two endpoints, subtract. The new question is what to do when one endpoint is not really an endpoint.</p>` +
      `<p>An <b>improper integral</b> lets us ask whether an infinite-looking total is actually finite. If a tail decays fast enough, the total area can settle to a number. If it decays too slowly, the total keeps growing forever. The key move is friendly: replace the troublesome endpoint with a variable, compute an ordinary integral, then take a limit.</p>`,
    definition:
      `<p>An improper integral is a definite integral whose interval is infinite, such as $$\\int_a^\\infty f(x)\\,dx=\\lim_{b\\to\\infty}\\int_a^b f(x)\\,dx,$$ or whose integrand is unbounded, such as $$\\int_a^b f(x)\\,dx=\\lim_{t\\to c^-}\\int_a^t f(x)\\,dx+\\lim_{t\\to c^+}\\int_t^b f(x)\\,dx$$ when the trouble is at an interior point $c$. If the required limit is finite, the integral <b>converges</b>; otherwise it <b>diverges</b>.</p>` +
      `<p><b>Assumptions that matter:</b> split the integral at every discontinuity or infinite endpoint; every resulting limit must converge; cancellation across an infinite blow-up is not allowed unless the problem explicitly asks for a principal value.</p>`,
    worked: {
      problem: "Compute $\\displaystyle\\int_1^\\infty \\frac{1}{x^2}\\,dx$.",
      skills: ["improper integrals", "limits at infinity", "power rule"],
      strategy: "The endpoint $\\infty$ is the obstacle. Replace it by $b$, integrate on $[1,b]$, then let $b\\to\\infty$.",
      steps: [
        { do: "Replace $\\infty$ by $b$", result: "$\\lim_{b\\to\\infty}\\int_1^b x^{-2}\\,dx$", why: "this turns the problem into ordinary definite integrals" },
        { do: "Find an antiderivative", result: "$\\int x^{-2}\\,dx=-x^{-1}$", why: "the power rule gives $x^{-1}/(-1)$" },
        { do: "Evaluate from $1$ to $b$", result: "$\\left[-\\frac1x\\right]_1^b=-\\frac1b+1$", why: "upper value minus lower value" },
        { do: "Take the limit", result: "$\\lim_{b\\to\\infty}\\left(1-\\frac1b\\right)=1$", why: "$1/b\\to0$" }
      ],
      verify: "The rectangle estimate over $[1,b]$ keeps increasing but never passes $1$ by much; a fast $1/x^2$ tail has finite total area.",
      answer: "$\\displaystyle\\int_1^\\infty \\frac{1}{x^2}\\,dx=1$",
      connects: "convergence versus divergence — the tail is infinite in length, but the accumulated area settles to a finite limit."
    },
    practice: [
      { problem: "$\\displaystyle\\int_0^\\infty e^{-3x}\\,dx$", steps: [
        { do: "Replace $\\infty$ by $b$", result: "$\\lim_{b\\to\\infty}\\int_0^b e^{-3x}\\,dx$", why: "the interval is infinite" },
        { do: "Find an antiderivative", result: "$-\\frac13 e^{-3x}$", why: "differentiate it to recover $e^{-3x}$" },
        { do: "Evaluate from $0$ to $b$", result: "$-\\frac13e^{-3b}+\\frac13$", why: "subtract the lower value $-1/3$" },
        { do: "Take the limit", result: "$\\frac13$", why: "$e^{-3b}\\to0$" }
      ], answer: "$\\frac13$" },
      { problem: "$\\displaystyle\\int_1^\\infty \\frac{1}{x}\\,dx$", steps: [
        { do: "Replace $\\infty$ by $b$", result: "$\\lim_{b\\to\\infty}\\int_1^b \\frac1x\\,dx$", why: "use the definition" },
        { do: "Find an antiderivative", result: "$\\ln x$", why: "the logarithm grows from integrating $1/x$" },
        { do: "Evaluate from $1$ to $b$", result: "$\\ln b-\\ln1=\\ln b$", why: "$\\ln1=0$" },
        { do: "Take the limit", result: "$\\infty$", why: "$\\ln b$ grows without bound" }
      ], answer: "Diverges." },
      { problem: "$\\displaystyle\\int_0^1 \\frac{1}{\\sqrt{x}}\\,dx$", steps: [
        { do: "Replace the troublesome endpoint by $a$", result: "$\\lim_{a\\to0^+}\\int_a^1 x^{-1/2}\\,dx$", why: "$x^{-1/2}$ blows up at $0$" },
        { do: "Find an antiderivative", result: "$2\\sqrt{x}$", why: "the power rule adds $1$ to the exponent" },
        { do: "Evaluate from $a$ to $1$", result: "$2-2\\sqrt{a}$", why: "upper value minus lower value" },
        { do: "Take the limit", result: "$2$", why: "$\\sqrt{a}\\to0$" }
      ], answer: "$2$" },
      { problem: "$\\displaystyle\\int_0^1 \\frac{1}{x^2}\\,dx$", steps: [
        { do: "Replace the troublesome endpoint by $a$", result: "$\\lim_{a\\to0^+}\\int_a^1 x^{-2}\\,dx$", why: "the integrand is unbounded at $0$" },
        { do: "Find an antiderivative", result: "$-x^{-1}$", why: "the power rule gives exponent $-1$" },
        { do: "Evaluate from $a$ to $1$", result: "$-1+\\frac1a$", why: "subtracting $-1/a$ adds $1/a$" },
        { do: "Take the limit", result: "$\\infty$", why: "$1/a\\to\\infty$ as $a\\to0^+$" }
      ], answer: "Diverges." },
      { problem: "A waiting-time density is $f(t)=0.2e^{-0.2t}$ for $t\\ge0$. Compute $\\displaystyle\\int_0^\\infty f(t)\\,dt$.", steps: [
        { do: "Set up the improper integral", result: "$\\lim_{b\\to\\infty}\\int_0^b 0.2e^{-0.2t}\\,dt$", why: "time has no fixed upper bound" },
        { do: "Find an antiderivative", result: "$-e^{-0.2t}$", why: "the factor $0.2$ cancels the derivative of $-0.2t$" },
        { do: "Evaluate from $0$ to $b$", result: "$-e^{-0.2b}+1$", why: "the lower value is $-1$" },
        { do: "Take the limit", result: "$1$", why: "$e^{-0.2b}\\to0$" }
      ], answer: "$1$, so the density has total probability $1$." }
    ],
    applications: [
      { title: "Probability densities", background: "Continuous distributions on unbounded ranges need improper integrals so their total probability can still be $1$.", numbers: "For $f(t)=0.5e^{-0.5t}$, $\\int_0^\\infty0.5e^{-0.5t}\\,dt=1$, so it is a valid waiting-time density." },
      { title: "Expected lifetime", background: "Reliability models often use tails to summarize how long hardware or requests survive.", numbers: "If survival is $S(t)=e^{-t/2000}$ hours, mean lifetime is $\\int_0^\\infty S(t)\\,dt=2000$ hours." },
      { title: "Normalization in ML", background: "A model density must integrate to one before it can score likelihoods.", numbers: "$\\int_{-\\infty}^{\\infty}e^{-|x|}\\,dx=2$, so $\\frac12e^{-|x|}$ is normalized." },
      { title: "Loss tails", background: "Heavy-tailed errors can make averages unstable because expected values are improper integrals.", numbers: "A Pareto tail with density $2/x^3$ on $x\\ge1$ has mean $\\int_1^\\infty x\\cdot2/x^3\\,dx=2$; with density $1/x^2$, the mean diverges." },
      { title: "Laplace transforms", background: "Transforms summarize time signals by integrating them against decaying exponentials.", numbers: "$\\int_0^\\infty e^{-st}\\,dt=1/s$ for $s>0$; at $s=2$ the value is $0.5$." },
      { title: "Continuous attention kernels", background: "Some sequence models use decaying kernels whose total mass controls memory.", numbers: "$\\int_0^\\infty e^{-t/20}\\,dt=20$, so the kernel's total weight equals a 20-step time scale." }
    ],
    applicationsClose: "The shared thread is tail behavior: replace the impossible endpoint by a limit, then ask whether the total settles.",
    takeaways: [
      "An improper integral is a definite integral completed by a limit.",
      "Every infinite endpoint or blow-up point must be handled separately.",
      "Fast decay can give finite area; slow decay can diverge even over a simple positive function."
    ]
  },

  "math-01-48": {
    id: "math-01-48",
    title: "Area between curves",
    tagline: "Turn the vertical gap between two graphs into accumulated area.",
    connections: {
      buildsOn: ["definite integrals", "graphing functions", "intersection points"],
      leadsTo: ["volumes of revolution", "probability as area", "integral-based error measures"],
      usedWith: ["systems of equations", "signed area", "absolute value", "Riemann sums"]
    },
    motivation:
      `<p>You already know that $\\int_a^b f(x)\\,dx$ measures signed area between a curve and the $x$-axis. But many real comparisons are not against zero. We want to compare two curves directly: prediction versus truth, supply versus demand, one boundary versus another.</p>` +
      `<p>The idea is beautifully simple: slice the region into skinny vertical rectangles. Each rectangle has height "top minus bottom" and width $dx$. Add those heights across the interval, and the area appears.</p>`,
    definition:
      `<p>If $f(x)\\ge g(x)$ on $[a,b]$, the area between the curves is $$A=\\int_a^b \\bigl(f(x)-g(x)\\bigr)\\,dx.$$ The expression $f(x)-g(x)$ is the vertical height of a thin rectangle, and $dx$ is its tiny width. If the curves cross, split the interval at crossing points or integrate $|f(x)-g(x)|$.</p>` +
      `<p><b>Assumptions that matter:</b> know which curve is on top on each subinterval; use actual intersection points as limits; area is nonnegative, so do not let signed cancellation hide a region.</p>`,
    worked: {
      problem: "Find the area between $y=x$ and $y=x^2$ on $[0,1]$.",
      skills: ["top minus bottom", "polynomial integration", "area interpretation"],
      strategy: "First decide which graph is higher, then integrate the vertical gap.",
      steps: [
        { do: "Compare the functions on $[0,1]$", result: "$x\\ge x^2$", why: "numbers between $0$ and $1$ shrink when squared" },
        { do: "Write top minus bottom", result: "$x-x^2$", why: "vertical rectangle height" },
        { do: "Set up the integral", result: "$A=\\int_0^1 (x-x^2)\\,dx$", why: "add the heights from $0$ to $1$" },
        { do: "Integrate", result: "$\\left[\\frac{x^2}{2}-\\frac{x^3}{3}\\right]_0^1$", why: "use the power rule" },
        { do: "Evaluate", result: "$\\frac12-\\frac13=\\frac16$", why: "the lower endpoint contributes $0$" }
      ],
      verify: "The gap is never bigger than about $0.25$ across a width of $1$, so an area of $1/6\\approx0.167$ is reasonable.",
      answer: "$A=\\frac16$ square unit",
      connects: "area is accumulated difference — the integral converts many local gaps into one total comparison."
    },
    practice: [
      { problem: "Find the area between $y=2x$ and $y=x$ on $[0,3]$.", steps: [
        { do: "Identify the top curve", result: "$2x\\ge x$ on $[0,3]$", why: "$x$ is nonnegative" },
        { do: "Write the gap", result: "$2x-x=x$", why: "top minus bottom" },
        { do: "Set up the integral", result: "$\\int_0^3 x\\,dx$", why: "add vertical gaps" },
        { do: "Integrate", result: "$\\left[\\frac{x^2}{2}\\right]_0^3$", why: "power rule" },
        { do: "Evaluate", result: "$\\frac92$", why: "$9/2-0=9/2$" }
      ], answer: "$\\frac92$" },
      { problem: "Find the area between $y=4$ and $y=x^2$.", steps: [
        { do: "Find intersections", result: "$x^2=4$ gives $x=-2,2$", why: "these are the region boundaries" },
        { do: "Identify the top curve", result: "$4\\ge x^2$ on $[-2,2]$", why: "the parabola sits below the line there" },
        { do: "Set up the integral", result: "$\\int_{-2}^{2}(4-x^2)\\,dx$", why: "top minus bottom" },
        { do: "Use symmetry", result: "$2\\int_0^2(4-x^2)\\,dx$", why: "the integrand is even" },
        { do: "Evaluate", result: "$2\\left[4x-\\frac{x^3}{3}\\right]_0^2=\\frac{32}{3}$", why: "$8-8/3=16/3$ before doubling" }
      ], answer: "$\\frac{32}{3}$" },
      { problem: "Find the area between $y=x^2$ and $y=x+2$.", steps: [
        { do: "Find intersections", result: "$x^2=x+2$", why: "boundaries occur where curves meet" },
        { do: "Factor", result: "$(x-2)(x+1)=0$", why: "move all terms to one side" },
        { do: "Record the limits", result: "$x=-1$ and $x=2$", why: "these enclose the region" },
        { do: "Identify the top curve", result: "$x+2\\ge x^2$ on $[-1,2]$", why: "test $x=0$: $2\\ge0$" },
        { do: "Integrate the gap", result: "$\\int_{-1}^{2}(x+2-x^2)\\,dx=\\left[\\frac{x^2}{2}+2x-\\frac{x^3}{3}\\right]_{-1}^{2}=\\frac92$", why: "evaluate the antiderivative at both intersections" }
      ], answer: "$\\frac92$" },
      { problem: "Find the area between $y=\\sin x$ and the $x$-axis on $[0,\\pi]$.", steps: [
        { do: "Identify the top curve", result: "$\\sin x\\ge0$ on $[0,\\pi]$", why: "sine is nonnegative in the upper half of the unit circle" },
        { do: "Write the gap", result: "$\\sin x-0=\\sin x$", why: "the bottom curve is the axis" },
        { do: "Set up the integral", result: "$\\int_0^\\pi \\sin x\\,dx$", why: "area under a nonnegative curve" },
        { do: "Integrate", result: "$[-\\cos x]_0^\\pi$", why: "the derivative of $-\\cos x$ is $\\sin x$" },
        { do: "Evaluate", result: "$1-(-1)=2$", why: "$-\\cos\\pi=1$ and $-\\cos0=-1$" }
      ], answer: "$2$" },
      { problem: "For model error $e(x)=|x-(2-x)|$ on $[0,2]$, compute total absolute error.", steps: [
        { do: "Find where the expressions cross", result: "$x=2-x$ gives $x=1$", why: "the absolute value changes form there" },
        { do: "Write the left gap", result: "$(2-x)-x=2-2x$ on $[0,1]$", why: "the prediction $2-x$ is larger there" },
        { do: "Write the right gap", result: "$x-(2-x)=2x-2$ on $[1,2]$", why: "$x$ is larger there" },
        { do: "Set up the split integral", result: "$\\int_0^1(2-2x)\\,dx+\\int_1^2(2x-2)\\,dx$", why: "absolute area cannot cancel" },
        { do: "Evaluate", result: "$1+1=2$", why: "each triangle has area $1$" }
      ], answer: "$2$ total error units" }
    ],
    applications: [
      { title: "Absolute error in regression", background: "Mean absolute error starts as area between prediction and target curves before dividing by interval length.", numbers: "If $\\hat y=x$ and $y=2-x$ on $[0,2]$, total absolute error is $2$, so average absolute error is $2/2=1$." },
      { title: "AUC comparisons", background: "Classifier curves are often compared by the area between ROC or precision-recall curves.", numbers: "If model A has TPR $x$ and model B has $x^2$ over FPR $x\\in[0,1]$, A's advantage area is $\\int_0^1(x-x^2)dx=1/6$." },
      { title: "Calibration gaps", background: "Calibration plots compare predicted probability to observed frequency.", numbers: "A curve $p^2$ versus ideal $p$ on $[0,1]$ has gap $1/6\\approx0.167$." },
      { title: "Image segmentation overlap", background: "Continuous masks can be compared by integrating the difference between boundary curves.", numbers: "Between $y=1$ and $y=x^2$ on $[-1,1]$, area is $\\int_{-1}^1(1-x^2)dx=4/3$." },
      { title: "Queue backlog", background: "Backlog accumulates when arrival rate exceeds service rate; the area between rates is work waiting.", numbers: "Arrival $10$ jobs/s and service $7$ jobs/s for $5$s creates $\\int_0^5 3\\,dt=15$ jobs of backlog." },
      { title: "Distribution distance", background: "Total variation in one dimension can be read from area between density curves.", numbers: "Densities $2x$ and $2(1-x)$ on $[0,1]$ have absolute gap area $1$, so total variation is $1/2$." }
    ],
    applicationsClose: "Top minus bottom is a quiet but powerful idea: local differences become one honest total.",
    takeaways: [
      "Area between curves is the integral of top minus bottom.",
      "Find intersections first; split wherever the order changes.",
      "For absolute comparisons, prevent positive and negative regions from canceling."
    ]
  },

  "math-01-49": {
    id: "math-01-49",
    title: "Volumes of revolution",
    tagline: "Spin a flat region around an axis and add up the tiny circular slices.",
    connections: {
      buildsOn: ["definite integrals", "area between curves", "basic geometry of circles"],
      leadsTo: ["surface area", "multivariable integration", "geometric probability"],
      usedWith: ["cross sections", "shell method", "disk method", "symmetry"]
    },
    motivation:
      `<p>Area between curves measures a flat region. Now imagine spinning that region around an axis. A curve becomes a bowl, a cap, a tube, or a smooth solid. The question becomes: how much three-dimensional stuff did we make?</p>` +
      `<p>The friendly trick is to slice the solid. A thin slice perpendicular to the axis is usually a disk or washer. Its volume is area times thickness, and the integral adds all those slice volumes.</p>`,
    definition:
      `<p>Using disks around the $x$-axis, a solid generated by $y=f(x)\\ge0$ on $[a,b]$ has volume $$V=\\pi\\int_a^b [f(x)]^2\\,dx.$$ If there is a hole, use washers: $$V=\\pi\\int_a^b\\left(R(x)^2-r(x)^2\\right)\\,dx,$$ where $R$ is the outer radius and $r$ is the inner radius.</p>` +
      `<p><b>Assumptions that matter:</b> radii must be distances to the axis of rotation, so they are nonnegative; choose slices perpendicular to the axis for disks and washers; if the outer radius changes, split the interval.</p>`,
    worked: {
      problem: "Find the volume formed by rotating $y=x$ on $0\\le x\\le2$ around the $x$-axis.",
      skills: ["disk method", "polynomial integration", "geometry of rotation"],
      strategy: "A vertical slice becomes a disk with radius $x$. Integrate $\\pi r^2$ along the interval.",
      steps: [
        { do: "Identify the radius", result: "$r(x)=x$", why: "distance from $y=0$ to $y=x$" },
        { do: "Write the disk area", result: "$A(x)=\\pi x^2$", why: "area of a circle is $\\pi r^2$" },
        { do: "Set up the volume integral", result: "$V=\\pi\\int_0^2 x^2\\,dx$", why: "add disk volumes $A(x)dx$" },
        { do: "Integrate", result: "$\\pi\\left[\\frac{x^3}{3}\\right]_0^2$", why: "power rule" },
        { do: "Evaluate", result: "$\\frac{8\\pi}{3}$", why: "$2^3/3=8/3$" }
      ],
      verify: "The shape is a cone with radius $2$ and height $2$, so $\\frac13\\pi r^2h=\\frac13\\pi\\cdot4\\cdot2=\\frac{8\\pi}{3}$.",
      answer: "$V=\\frac{8\\pi}{3}$ cubic units",
      connects: "volumes of revolution convert a changing radius into an integral of circular cross-sectional area."
    },
    practice: [
      { problem: "Rotate $y=3$ on $0\\le x\\le4$ around the $x$-axis. Find the volume.", steps: [
        { do: "Identify the radius", result: "$r=3$", why: "the line is 3 units above the axis" },
        { do: "Write the disk area", result: "$A=\\pi(3)^2=9\\pi$", why: "each slice is the same circle" },
        { do: "Set up the integral", result: "$V=\\int_0^4 9\\pi\\,dx$", why: "add constant cross sections" },
        { do: "Integrate", result: "$9\\pi[x]_0^4$", why: "antiderivative of $1$ is $x$" },
        { do: "Evaluate", result: "$36\\pi$", why: "a cylinder has base area $9\\pi$ and height $4$" }
      ], answer: "$36\\pi$" },
      { problem: "Rotate $y=\\sqrt{x}$ on $0\\le x\\le4$ around the $x$-axis. Find the volume.", steps: [
        { do: "Identify the radius", result: "$r(x)=\\sqrt{x}$", why: "distance to the $x$-axis" },
        { do: "Square the radius", result: "$r(x)^2=x$", why: "disk area uses $r^2$" },
        { do: "Set up the integral", result: "$V=\\pi\\int_0^4 x\\,dx$", why: "add disk areas" },
        { do: "Integrate", result: "$\\pi\\left[\\frac{x^2}{2}\\right]_0^4$", why: "power rule" },
        { do: "Evaluate", result: "$8\\pi$", why: "$16/2=8$" }
      ], answer: "$8\\pi$" },
      { problem: "Rotate the region between $y=2$ and $y=1$ on $0\\le x\\le5$ around the $x$-axis.", steps: [
        { do: "Identify the outer radius", result: "$R=2$", why: "farther distance from the axis" },
        { do: "Identify the inner radius", result: "$r=1$", why: "the hole has radius $1$" },
        { do: "Write the washer area", result: "$\\pi(R^2-r^2)=\\pi(4-1)=3\\pi$", why: "subtract the hole" },
        { do: "Set up the integral", result: "$V=\\int_0^5 3\\pi\\,dx$", why: "cross section is constant" },
        { do: "Evaluate", result: "$15\\pi$", why: "area times length" }
      ], answer: "$15\\pi$" },
      { problem: "Rotate the region under $y=2-x$ on $0\\le x\\le2$ around the $x$-axis.", steps: [
        { do: "Identify the radius", result: "$r(x)=2-x$", why: "height above the axis" },
        { do: "Write the disk area", result: "$\\pi(2-x)^2$", why: "square the radius" },
        { do: "Set up the integral", result: "$V=\\pi\\int_0^2(2-x)^2\\,dx$", why: "add disk slices" },
        { do: "Substitute $u=2-x$", result: "$\\pi\\int_0^2u^2\\,du$", why: "the same bounds appear after reversing the endpoints" },
        { do: "Evaluate", result: "$\\frac{8\\pi}{3}$", why: "$\\int_0^2u^2du=8/3$" }
      ], answer: "$\\frac{8\\pi}{3}$" },
      { problem: "A radial density profile has radius $r(t)=e^{-t}$ for $0\\le t\\le\\ln 2$. Rotate around the $t$-axis and compute volume.", steps: [
        { do: "Write the radius", result: "$r(t)=e^{-t}$", why: "the curve gives distance to the axis" },
        { do: "Square the radius", result: "$r(t)^2=e^{-2t}$", why: "disk area uses radius squared" },
        { do: "Set up the integral", result: "$V=\\pi\\int_0^{\\ln2}e^{-2t}\\,dt$", why: "add circular slices" },
        { do: "Integrate", result: "$\\pi\\left[-\\frac12e^{-2t}\\right]_0^{\\ln2}$", why: "chain rule in reverse" },
        { do: "Evaluate", result: "$\\frac{3\\pi}{8}$", why: "$e^{-2\\ln2}=1/4$" }
      ], answer: "$\\frac{3\\pi}{8}$" }
    ],
    applications: [
      { title: "3D modeling from profiles", background: "CAD tools create rotationally symmetric parts by revolving a 2D sketch.", numbers: "A radius $r=2$ cm over length $10$ cm gives volume $\\pi\\int_0^{10}4dx=40\\pi\\approx125.7$ cm$^3$." },
      { title: "Neural rendering primitives", background: "Simple solids approximate geometry before a learned renderer adds detail.", numbers: "A cone with learned height $3$ and base radius $1$ has volume $\\pi\\int_0^3(1-x/3)^2dx=\\pi$." },
      { title: "Medical scan reconstruction", background: "Rotating a measured radius curve estimates organ volume when the anatomy is roughly symmetric.", numbers: "If $r(z)=\\sqrt{4-z^2}$ for $-2\\le z\\le2$, $V=\\pi\\int_{-2}^{2}(4-z^2)dz=\\frac{32\\pi}{3}\\approx33.5$." },
      { title: "Robot workspace envelopes", background: "A rotating arm sweeps out a volume that can be approximated by washers.", numbers: "Reach radii from $0.5$ m to $2$ m through height $1$ m give $\\pi(2^2-0.5^2)(1)=3.75\\pi\\approx11.8$ m$^3$." },
      { title: "Kernel mass in radial features", background: "Radial basis features in physical spaces often need volume weighting.", numbers: "A unit sphere volume comes from $\\pi\\int_{-1}^1(1-x^2)dx=4\\pi/3$." },
      { title: "Manufacturing cost", background: "Material cost is often proportional to volume, so calculus turns a profile into dollars.", numbers: "At $\\$0.08$ per cm$^3$, a $40\\pi$ cm$^3$ part costs about $0.08\\cdot125.7=\\$10.06$." }
    ],
    applicationsClose: "The same action repeats: identify a radius, square it, multiply by $\\pi$, and let the integral add the slices.",
    takeaways: [
      "Disk volumes use $V=\\pi\\int R(x)^2\\,dx$.",
      "Washer volumes subtract the inner radius squared from the outer radius squared.",
      "Radii are distances to the rotation axis, so choosing the right distance is the main skill."
    ]
  },

  "math-01-50": {
    id: "math-01-50",
    title: "Arc length",
    tagline: "Measure the length of a curve by adding many tiny straight-line steps.",
    connections: {
      buildsOn: ["derivatives", "definite integrals", "Pythagorean theorem"],
      leadsTo: ["curvature", "line integrals", "gradient path length"],
      usedWith: ["parametric equations", "polar coordinates", "speed", "Euclidean distance"]
    },
    motivation:
      `<p>The distance between two points is easy: use the Pythagorean theorem. A curved path is trickier because its direction keeps changing. But if you zoom in far enough, each tiny piece of a smooth curve is almost a straight segment.</p>` +
      `<p>Arc length is the result of adding those tiny straight pieces. The derivative tells us the local slope, and the integral adds the local stretch.</p>`,
    definition:
      `<p>For a smooth graph $y=f(x)$ on $[a,b]$, the arc length is $$L=\\int_a^b\\sqrt{1+\\bigl(f'(x)\\bigr)^2}\\,dx.$$ This comes from a tiny right triangle: horizontal change $dx$, vertical change $dy=f'(x)dx$, so $ds=\\sqrt{dx^2+dy^2}=\\sqrt{1+(f'(x))^2}\\,dx$.</p>` +
      `<p><b>Assumptions that matter:</b> the curve should be smooth enough that $f'$ exists except possibly at finitely many split points; use positive length, not signed displacement; many arc length integrals need numerical approximation.</p>`,
    worked: {
      problem: "Find the length of the line segment $y=3x+1$ from $x=0$ to $x=2$.",
      skills: ["arc length formula", "constant derivative", "geometry check"],
      strategy: "Use the arc length formula; because the slope is constant, the integrand is constant too.",
      steps: [
        { do: "Differentiate", result: "$f'(x)=3$", why: "the slope of the line is constant" },
        { do: "Substitute into the formula", result: "$L=\\int_0^2\\sqrt{1+3^2}\\,dx$", why: "arc length uses $\\sqrt{1+(f')^2}$" },
        { do: "Simplify the integrand", result: "$L=\\int_0^2\\sqrt{10}\\,dx$", why: "$1+9=10$" },
        { do: "Integrate", result: "$\\sqrt{10}[x]_0^2$", why: "the integrand is constant" },
        { do: "Evaluate", result: "$2\\sqrt{10}$", why: "the interval length is $2$" }
      ],
      verify: "The endpoints are $(0,1)$ and $(2,7)$; their distance is $\\sqrt{2^2+6^2}=\\sqrt{40}=2\\sqrt{10}$.",
      answer: "$L=2\\sqrt{10}$",
      connects: "arc length is just the Pythagorean theorem applied continuously along a curve."
    },
    practice: [
      { problem: "Find the length of $y=0$ from $x=-2$ to $x=5$.", steps: [
        { do: "Differentiate", result: "$f'(x)=0$", why: "a horizontal line has slope zero" },
        { do: "Substitute into the formula", result: "$L=\\int_{-2}^{5}\\sqrt{1+0^2}\\,dx$", why: "arc length formula" },
        { do: "Simplify the integrand", result: "$L=\\int_{-2}^{5}1\\,dx$", why: "$\\sqrt1=1$" },
        { do: "Integrate", result: "$[x]_{-2}^{5}$", why: "constant speed one" },
        { do: "Evaluate", result: "$7$", why: "$5-(-2)=7$" }
      ], answer: "$7$" },
      { problem: "Find the length of $y=\\frac34x$ from $x=0$ to $x=4$.", steps: [
        { do: "Differentiate", result: "$f'(x)=\\frac34$", why: "constant slope" },
        { do: "Substitute into the formula", result: "$L=\\int_0^4\\sqrt{1+(3/4)^2}\\,dx$", why: "local stretch factor" },
        { do: "Simplify inside the root", result: "$1+9/16=25/16$", why: "common denominator" },
        { do: "Simplify the integrand", result: "$\\sqrt{25/16}=5/4$", why: "positive square root" },
        { do: "Evaluate", result: "$\\int_0^4\\frac54dx=5$", why: "multiply by the interval length" }
      ], answer: "$5$" },
      { problem: "Find the length of $y=\\frac23x^{3/2}$ on $0\\le x\\le1$.", steps: [
        { do: "Differentiate", result: "$f'(x)=\\sqrt{x}$", why: "the constants are chosen to simplify" },
        { do: "Substitute into the formula", result: "$L=\\int_0^1\\sqrt{1+x}\\,dx$", why: "$(f')^2=x$" },
        { do: "Rewrite as a power", result: "$\\int_0^1(1+x)^{1/2}\\,dx$", why: "prepare to integrate" },
        { do: "Integrate", result: "$\\left[\\frac{2}{3}(1+x)^{3/2}\\right]_0^1$", why: "reverse the power rule" },
        { do: "Evaluate", result: "$\\frac23(2\\sqrt2-1)$", why: "plug in $1$ and $0$" }
      ], answer: "$\\frac23(2\\sqrt2-1)$" },
      { problem: "Approximate the length of $y=x^2$ on $0\\le x\\le1$ using Simpson's rule with $h=0.5$.", steps: [
        { do: "Differentiate", result: "$f'(x)=2x$", why: "arc length needs the slope" },
        { do: "Write the integrand", result: "$g(x)=\\sqrt{1+4x^2}$", why: "substitute into $\\sqrt{1+(f')^2}$" },
        { do: "Evaluate sample values", result: "$g(0)=1,\\ g(0.5)=\\sqrt2,\\ g(1)=\\sqrt5$", why: "Simpson's rule uses endpoints and midpoint" },
        { do: "Apply Simpson's rule", result: "$L\\approx\\frac{0.5}{3}(1+4\\sqrt2+\\sqrt5)$", why: "weights are $1,4,1$" },
        { do: "Compute the decimal", result: "$L\\approx1.479$", why: "this is close to the exact value" }
      ], answer: "Approximately $1.479$." },
      { problem: "A training path is $w(t)=(t,t^2)$ for $0\\le t\\le1$. Compute its path length.", steps: [
        { do: "Differentiate the components", result: "$w'(t)=(1,2t)$", why: "speed is the norm of velocity" },
        { do: "Compute speed", result: "$\\|w'(t)\\|=\\sqrt{1+4t^2}$", why: "Euclidean norm" },
        { do: "Set up the length integral", result: "$L=\\int_0^1\\sqrt{1+4t^2}\\,dt$", why: "add tiny parameter-space steps" },
        { do: "Use Simpson's rule", result: "$L\\approx\\frac{0.5}{3}(1+4\\sqrt2+\\sqrt5)$", why: "sample at $0,0.5,1$" },
        { do: "Compute the decimal", result: "$L\\approx1.479$", why: "same geometry as $y=x^2$" }
      ], answer: "Approximately $1.479$ parameter units." }
    ],
    applications: [
      { title: "Optimization path length", background: "Training does not just care where parameters end; the path length says how much they moved.", numbers: "For $w(t)=(t,t^2)$, $0\\le t\\le1$, Simpson's rule gives path length about $1.479$." },
      { title: "Robotics trajectories", background: "A robot arm needs distance along a planned curve to estimate time and energy.", numbers: "A straight path from $(0,0)$ to $(3,4)$ has length $5$ m; at $0.5$ m/s it takes $10$ s." },
      { title: "Vector graphics", background: "Fonts and curves are rendered by parametrized arcs whose lengths place dashes and animations.", numbers: "A line with slope $3/4$ over width $4$ has length $5$, so ten equal dash intervals are $0.5$ each." },
      { title: "Data manifold distance", background: "A curved latent manifold can make Euclidean shortcuts misleading.", numbers: "A semicircle of radius $2$ has arc length $2\\pi\\approx6.28$, while its diameter is $4$." },
      { title: "Signal variation", background: "Arc length of a time series graph increases when the signal wiggles more.", numbers: "For $y=3t$ over $0\\le t\\le2$, graph length is $2\\sqrt{10}\\approx6.32$." },
      { title: "Curriculum schedules", background: "A smoothly changing hyperparameter schedule has length measuring total change over time.", numbers: "Schedule $\\eta(t)=0.1t$ over $0\\le t\\le10$ has graph length $10\\sqrt{1.01}\\approx10.05$." }
    ],
    applicationsClose: "Arc length is distance with memory: it respects every turn the path takes, not just start and finish.",
    takeaways: [
      "For $y=f(x)$, length is $\\int_a^b\\sqrt{1+(f'(x))^2}\\,dx$.",
      "The formula comes from the Pythagorean theorem on tiny curve pieces.",
      "Many useful arc lengths are approximated numerically rather than simplified exactly."
    ]
  },

  "math-01-51": {
    id: "math-01-51",
    title: "Parametric equations and calculus",
    tagline: "Describe motion with a parameter, then read slope, speed, and area from the components.",
    connections: {
      buildsOn: ["functions", "derivatives", "arc length"],
      leadsTo: ["vector calculus", "dynamical systems", "curves in higher dimensions"],
      usedWith: ["vectors", "chain rule", "speed", "arc length", "polar coordinates"]
    },
    motivation:
      `<p>Not every curve wants to be written as $y=f(x)$. A circle fails the vertical-line test, and a moving particle naturally gives position as two coordinates changing with time.</p>` +
      `<p>Parametric equations let one parameter, usually $t$, drive both coordinates: $x=x(t)$ and $y=y(t)$. Calculus then asks familiar questions in a better language: slope is vertical speed divided by horizontal speed, and length is the integral of actual speed.</p>`,
    definition:
      `<p>A parametric curve is given by $$x=x(t),\\qquad y=y(t),\\qquad \\alpha\\le t\\le\\beta.$$ When $dx/dt\\ne0$, its slope is $$\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}.$$ Its arc length is $$L=\\int_\\alpha^\\beta\\sqrt{\\left(\\frac{dx}{dt}\\right)^2+\\left(\\frac{dy}{dt}\\right)^2}\\,dt,$$ which is the integral of speed.</p>` +
      `<p><b>Assumptions that matter:</b> the parameter interval and direction are part of the curve; $dy/dx$ needs $dx/dt\\ne0$ at the point; length uses speed, so it stays nonnegative even if the curve doubles back.</p>`,
    worked: {
      problem: "For $x=t^2$ and $y=t^3$ at $t=2$, find $\\frac{dy}{dx}$.",
      skills: ["parametric derivative", "chain rule", "slope interpretation"],
      strategy: "Differentiate both coordinates with respect to $t$, then divide vertical velocity by horizontal velocity.",
      steps: [
        { do: "Differentiate $x(t)$", result: "$\\frac{dx}{dt}=2t$", why: "power rule" },
        { do: "Differentiate $y(t)$", result: "$\\frac{dy}{dt}=3t^2$", why: "power rule" },
        { do: "Form the slope ratio", result: "$\\frac{dy}{dx}=\\frac{3t^2}{2t}$", why: "slope is vertical change per horizontal change" },
        { do: "Simplify", result: "$\\frac{dy}{dx}=\\frac{3t}{2}$", why: "cancel one factor of $t$ when $t\\ne0$" },
        { do: "Substitute $t=2$", result: "$3$", why: "the requested point occurs at that parameter" }
      ],
      verify: "At $t=2$, velocity is $(4,12)$, so the curve rises $12$ units for $4$ horizontal units: slope $3$.",
      answer: "$\\frac{dy}{dx}=3$ at $t=2$",
      connects: "parametric calculus turns a moving point into familiar slope by comparing component rates."
    },
    practice: [
      { problem: "For $x=t+1$, $y=t^2$, find $\\frac{dy}{dx}$ at $t=3$.", steps: [
        { do: "Differentiate $x$", result: "$dx/dt=1$", why: "linear function" },
        { do: "Differentiate $y$", result: "$dy/dt=2t$", why: "power rule" },
        { do: "Form the ratio", result: "$dy/dx=2t/1$", why: "divide vertical rate by horizontal rate" },
        { do: "Substitute $t=3$", result: "$6$", why: "evaluate at the requested parameter" },
        { do: "State the point", result: "$(4,9)$", why: "it helps connect the slope to the curve" }
      ], answer: "$6$ at $(4,9)$." },
      { problem: "For $x=\\cos t$, $y=\\sin t$, find $\\frac{dy}{dx}$ at $t=\\pi/4$.", steps: [
        { do: "Differentiate $x$", result: "$dx/dt=-\\sin t$", why: "derivative of cosine" },
        { do: "Differentiate $y$", result: "$dy/dt=\\cos t$", why: "derivative of sine" },
        { do: "Form the ratio", result: "$dy/dx=\\frac{\\cos t}{-\\sin t}$", why: "parametric slope formula" },
        { do: "Substitute $t=\\pi/4$", result: "$\\frac{\\sqrt2/2}{-\\sqrt2/2}$", why: "unit circle values" },
        { do: "Simplify", result: "$-1$", why: "the numerator and denominator have equal magnitude" }
      ], answer: "$-1$" },
      { problem: "Find the speed for $x=3t$, $y=4t$.", steps: [
        { do: "Differentiate $x$", result: "$dx/dt=3$", why: "constant horizontal velocity" },
        { do: "Differentiate $y$", result: "$dy/dt=4$", why: "constant vertical velocity" },
        { do: "Write the speed", result: "$\\sqrt{3^2+4^2}$", why: "speed is velocity magnitude" },
        { do: "Simplify inside the root", result: "$\\sqrt{25}$", why: "$9+16=25$" },
        { do: "Take the positive root", result: "$5$", why: "speed is nonnegative" }
      ], answer: "$5$" },
      { problem: "Find the length of $x=3\\cos t$, $y=3\\sin t$ for $0\\le t\\le\\pi$.", steps: [
        { do: "Differentiate $x$", result: "$dx/dt=-3\\sin t$", why: "chain rule is simple here" },
        { do: "Differentiate $y$", result: "$dy/dt=3\\cos t$", why: "derivative of sine" },
        { do: "Compute speed", result: "$\\sqrt{9\\sin^2t+9\\cos^2t}=3$", why: "$\\sin^2t+\\cos^2t=1$" },
        { do: "Set up length", result: "$L=\\int_0^\\pi3\\,dt$", why: "integrate speed" },
        { do: "Evaluate", result: "$3\\pi$", why: "half the circumference of radius $3$" }
      ], answer: "$3\\pi$" },
      { problem: "An optimizer follows $w(t)=(e^{-t},e^{-2t})$. Find its speed at $t=0$.", steps: [
        { do: "Differentiate the first coordinate", result: "$-e^{-t}$", why: "chain rule" },
        { do: "Differentiate the second coordinate", result: "$-2e^{-2t}$", why: "chain rule with factor $-2$" },
        { do: "Substitute $t=0$", result: "$w'(0)=(-1,-2)$", why: "both exponentials equal $1$" },
        { do: "Compute the norm", result: "$\\sqrt{(-1)^2+(-2)^2}$", why: "speed is magnitude" },
        { do: "Simplify", result: "$\\sqrt5$", why: "$1+4=5$" }
      ], answer: "$\\sqrt5$" }
    ],
    applications: [
      { title: "Motion planning", background: "Robots and drones plan positions as $x(t),y(t),z(t)$ because time controls all coordinates together.", numbers: "For $x=3t,y=4t$, speed is $5$ m/s, so a $20$ m path takes $4$ s." },
      { title: "Optimization trajectories", background: "Training parameters trace a parametric curve through weight space.", numbers: "For $w(t)=(e^{-t},e^{-2t})$, initial speed is $\\sqrt5\\approx2.236$." },
      { title: "Animation curves", background: "Computer graphics uses parametric curves to move objects smoothly without requiring $y$ to be a function of $x$.", numbers: "$x=\\cos t,y=\\sin t$ runs around a unit circle; speed is $1$ for every $t$." },
      { title: "Phase portraits", background: "Dynamical systems track state variables together, so the path itself is parametric.", numbers: "State $(e^{-t},2e^{-t})$ moves along a line with speed $\\sqrt5e^{-t}$, dropping from $2.236$ to $0.823$ by $t=1$." },
      { title: "Bezier curves", background: "Design tools use parameter $t\\in[0,1]$ to trace curves for fonts and interfaces.", numbers: "A straight Bezier from $(0,0)$ to $(6,8)$ has derivative $(6,8)$ and length $10$." },
      { title: "Sampling along a curve", background: "Data augmentation can sample points along curves rather than grids.", numbers: "On $x=2\\cos t,y=2\\sin t$, $0\\le t\\le2\\pi$, total length is $4\\pi\\approx12.57$." }
    ],
    applicationsClose: "The parameter is a clock: once you know the component rates, slope, speed, and length become familiar again.",
    takeaways: [
      "Parametric curves write $x$ and $y$ as functions of a shared parameter.",
      "$dy/dx=(dy/dt)/(dx/dt)$ when $dx/dt\\ne0$.",
      "Arc length for a parametric curve is the integral of speed."
    ]
  },

  "math-01-52": {
    id: "math-01-52",
    title: "Polar coordinates and calculus",
    tagline: "Describe a point by distance and angle, then integrate with the geometry of wedges.",
    connections: {
      buildsOn: ["trigonometry", "parametric equations", "definite integrals"],
      leadsTo: ["complex numbers", "multivariable polar integrals", "Fourier features"],
      usedWith: ["unit circle", "arc length", "area", "symmetry"]
    },
    motivation:
      `<p>Cartesian coordinates are wonderful for grids, but circles and spirals often look simpler when you describe distance from the origin and angle from the positive $x$-axis.</p>` +
      `<p>Polar coordinates use $r$ and $\\theta$. The calculus changes only because a tiny angular slice is a wedge, not a rectangle. That small geometry change gives the famous area formula with $\\frac12r^2$.</p>`,
    definition:
      `<p>Polar coordinates represent a point by $$x=r\\cos\\theta,\\qquad y=r\\sin\\theta.$$ A polar curve is $r=f(\\theta)$. Its area from $\\alpha$ to $\\beta$ is $$A=\\frac12\\int_\\alpha^\\beta r(\\theta)^2\\,d\\theta,$$ because a tiny wedge with radius $r$ and angle $d\\theta$ has area about $\\frac12r^2d\\theta$.</p>` +
      `<p><b>Assumptions that matter:</b> angles are in radians; polar points are not unique; negative $r$ points in the opposite direction; check whether the curve traces a region once or multiple times before integrating.</p>`,
    worked: {
      problem: "Find the area inside the circle $r=2$ for $0\\le\\theta\\le2\\pi$.",
      skills: ["polar area", "constant radius", "radian measure"],
      strategy: "Use the polar area formula; the radius is constant, so this should match $\\pi r^2$.",
      steps: [
        { do: "Write the area formula", result: "$A=\\frac12\\int_0^{2\\pi}r^2\\,d\\theta$", why: "polar area adds wedge areas" },
        { do: "Substitute $r=2$", result: "$A=\\frac12\\int_0^{2\\pi}4\\,d\\theta$", why: "the radius is constant" },
        { do: "Simplify the constant", result: "$A=2\\int_0^{2\\pi}1\\,d\\theta$", why: "$\\frac12\\cdot4=2$" },
        { do: "Integrate", result: "$2[\\theta]_0^{2\\pi}$", why: "integrate with respect to angle" },
        { do: "Evaluate", result: "$4\\pi$", why: "the angular width is $2\\pi$" }
      ],
      verify: "A circle of radius $2$ has area $\\pi(2)^2=4\\pi$, so the polar formula agrees with geometry.",
      answer: "$A=4\\pi$",
      connects: "polar area is ordinary accumulation, but the tiny pieces are wedges instead of rectangles."
    },
    practice: [
      { problem: "Convert $(r,\\theta)=(4,\\pi/3)$ to Cartesian coordinates.", steps: [
        { do: "Write the conversion", result: "$x=r\\cos\\theta,\\ y=r\\sin\\theta$", why: "polar coordinates project onto axes" },
        { do: "Substitute $r=4$ and $\\theta=\\pi/3$", result: "$x=4\\cos\\pi/3,\\ y=4\\sin\\pi/3$", why: "use unit circle values" },
        { do: "Evaluate cosine", result: "$x=4\\cdot\\frac12=2$", why: "$\\cos\\pi/3=1/2$" },
        { do: "Evaluate sine", result: "$y=4\\cdot\\frac{\\sqrt3}{2}=2\\sqrt3$", why: "$\\sin\\pi/3=\\sqrt3/2$" },
        { do: "State the point", result: "$(2,2\\sqrt3)$", why: "Cartesian coordinates use ordered pairs" }
      ], answer: "$(2,2\\sqrt3)$" },
      { problem: "Find the area of one sector of $r=3$ from $\\theta=0$ to $\\theta=\\pi/2$.", steps: [
        { do: "Write the formula", result: "$A=\\frac12\\int_0^{\\pi/2}r^2\\,d\\theta$", why: "area of polar wedges" },
        { do: "Substitute $r=3$", result: "$A=\\frac12\\int_0^{\\pi/2}9\\,d\\theta$", why: "constant radius" },
        { do: "Simplify", result: "$A=\\frac92\\int_0^{\\pi/2}1\\,d\\theta$", why: "combine constants" },
        { do: "Integrate", result: "$\\frac92[\\theta]_0^{\\pi/2}$", why: "angle is the variable" },
        { do: "Evaluate", result: "$\\frac{9\\pi}{4}$", why: "quarter of a radius-3 circle" }
      ], answer: "$\\frac{9\\pi}{4}$" },
      { problem: "Find the area inside one loop of $r=2\\sin\\theta$ for $0\\le\\theta\\le\\pi$.", steps: [
        { do: "Write the formula", result: "$A=\\frac12\\int_0^\\pi(2\\sin\\theta)^2\\,d\\theta$", why: "the loop is traced once on this interval" },
        { do: "Simplify the square", result: "$A=2\\int_0^\\pi\\sin^2\\theta\\,d\\theta$", why: "$\\frac12\\cdot4=2$" },
        { do: "Use the identity", result: "$\\sin^2\\theta=\\frac{1-\\cos2\\theta}{2}$", why: "this makes the integral direct" },
        { do: "Substitute the identity", result: "$A=\\int_0^\\pi(1-\\cos2\\theta)\\,d\\theta$", why: "the factor $2$ cancels the denominator" },
        { do: "Evaluate", result: "$[\\theta-\\frac12\\sin2\\theta]_0^\\pi=\\pi$", why: "the sine terms vanish" }
      ], answer: "$\\pi$" },
      { problem: "For $r=1+\\cos\\theta$, find the area from $0$ to $\\pi$.", steps: [
        { do: "Write the area integral", result: "$A=\\frac12\\int_0^\\pi(1+\\cos\\theta)^2\\,d\\theta$", why: "polar area formula" },
        { do: "Expand the square", result: "$1+2\\cos\\theta+\\cos^2\\theta$", why: "prepare to integrate term by term" },
        { do: "Use the identity", result: "$\\cos^2\\theta=\\frac{1+\\cos2\\theta}{2}$", why: "integrate the squared cosine" },
        { do: "Integrate inside", result: "$\\int_0^\\pi\\left(\\frac32+2\\cos\\theta+\\frac12\\cos2\\theta\\right)d\\theta=\\frac{3\\pi}{2}$", why: "both sine endpoint terms are zero" },
        { do: "Multiply by $1/2$", result: "$\\frac{3\\pi}{4}$", why: "the area formula has the leading half" }
      ], answer: "$\\frac{3\\pi}{4}$" },
      { problem: "A radial attention window has $r(\\theta)=2$ for $0\\le\\theta\\le\\pi/3$. Compute its area.", steps: [
        { do: "Write the polar area formula", result: "$A=\\frac12\\int_0^{\\pi/3}r^2\\,d\\theta$", why: "the window is angular" },
        { do: "Substitute $r=2$", result: "$A=\\frac12\\int_0^{\\pi/3}4\\,d\\theta$", why: "constant reach" },
        { do: "Simplify", result: "$A=2\\int_0^{\\pi/3}1\\,d\\theta$", why: "combine constants" },
        { do: "Integrate", result: "$2[\\theta]_0^{\\pi/3}$", why: "sum wedge area" },
        { do: "Evaluate", result: "$\\frac{2\\pi}{3}$", why: "a sixth of a radius-2 circle" }
      ], answer: "$\\frac{2\\pi}{3}$" }
    ],
    applications: [
      { title: "Computer vision angles", background: "Radial features describe edges by distance and orientation around a keypoint.", numbers: "A feature at $r=4,\\theta=\\pi/3$ maps to $(2,2\\sqrt3)\\approx(2,3.46)$." },
      { title: "Radar and lidar", background: "Sensors naturally report range and bearing, which are polar coordinates.", numbers: "Range $10$ m at $30^\\circ$ gives $x=10\\cos\\pi/6\\approx8.66$, $y=5$." },
      { title: "Rotational data augmentation", background: "Images and point clouds often rotate around an origin, making angle the natural variable.", numbers: "Rotating $(1,0)$ by $\\pi/2$ gives $r=1,\\theta=\\pi/2$, so Cartesian point $(0,1)$." },
      { title: "Attention over directions", background: "A model may attend over a cone or sector rather than a rectangle.", numbers: "Radius $2$ over angle $\\pi/3$ has area $2\\pi/3\\approx2.09$." },
      { title: "Fourier and phase features", background: "Complex numbers encode magnitude and phase, the algebraic cousin of polar coordinates.", numbers: "$3e^{i\\pi/6}$ has real part $3\\sqrt3/2\\approx2.60$ and imaginary part $1.5$." },
      { title: "Circular probability", background: "Directional distributions integrate over angle instead of a line.", numbers: "A uniform angle on $[0,2\\pi]$ assigns probability $(\\pi/2)/(2\\pi)=1/4$ to a quadrant." }
    ],
    applicationsClose: "Polar coordinates trade grid rectangles for angular wedges, which is exactly the right language for circular structure.",
    takeaways: [
      "Convert by $x=r\\cos\\theta$ and $y=r\\sin\\theta$.",
      "Polar area is $\\frac12\\int r^2\\,d\\theta$.",
      "Check tracing and radians carefully; polar descriptions are not unique."
    ]
  },

  "math-01-53": {
    id: "math-01-53",
    title: "Sequences",
    tagline: "Study ordered lists of numbers and ask where their long-run behavior is heading.",
    connections: {
      buildsOn: ["functions", "limits", "exponents"],
      leadsTo: ["series", "convergence tests", "iterative algorithms"],
      usedWith: ["recursion", "monotonicity", "boundedness", "subsequences"]
    },
    motivation:
      `<p>A sequence is just a list with a rule: first term, second term, third term, and so on. That sounds humble, but every iterative algorithm produces one: losses across epochs, parameter values across updates, validation scores over time.</p>` +
      `<p>The central question is familiar from limits: do the terms settle somewhere? A sequence can converge, diverge, oscillate, or grow. Learning to read that behavior is the bridge from calculus to algorithms.</p>`,
    definition:
      `<p>A sequence is a function whose inputs are positive integers: $$a_1,a_2,a_3,\\ldots,$$ or $a_n$ for $n=1,2,3,\\ldots$. We say $a_n$ converges to $L$ if $$\\lim_{n\\to\\infty}a_n=L.$$ In words, the later terms get as close to $L$ as we want and stay close.</p>` +
      `<p><b>Assumptions that matter:</b> the index $n$ is discrete, so do not treat every sequence exactly like a continuous function; convergence depends on the tail, not the first few terms; bounded and monotone sequences converge, but bounded alone does not guarantee convergence.</p>`,
    worked: {
      problem: "Determine whether $a_n=\\frac{3n+1}{n+2}$ converges, and find the limit if it does.",
      skills: ["sequence limits", "dominant terms", "algebraic simplification"],
      strategy: "For rational expressions in $n$, divide top and bottom by the highest power of $n$.",
      steps: [
        { do: "Identify the highest power", result: "$n$", why: "both numerator and denominator are linear" },
        { do: "Divide numerator and denominator by $n$", result: "$\\frac{3+1/n}{1+2/n}$", why: "this exposes the terms that vanish" },
        { do: "Take the limit of $1/n$", result: "$1/n\\to0$", why: "reciprocals shrink to zero" },
        { do: "Take the limit of $2/n$", result: "$2/n\\to0$", why: "constant multiples also shrink to zero" },
        { do: "Compute the final limit", result: "$\\frac{3+0}{1+0}=3$", why: "the denominator limit is not zero" }
      ],
      verify: "$a_{100}=301/102\\approx2.951$ and $a_{1000}=3001/1002\\approx2.995$, moving toward $3$.",
      answer: "The sequence converges to $3$.",
      connects: "a sequence limit is the long-run value of an iterative list."
    },
    practice: [
      { problem: "Find $\\lim_{n\\to\\infty}\\frac{5}{n}$.", steps: [
        { do: "Recognize the form", result: "$5\\cdot\\frac1n$", why: "separate the constant" },
        { do: "Use the reciprocal limit", result: "$1/n\\to0$", why: "denominators grow without bound" },
        { do: "Multiply by the constant", result: "$5\\cdot0=0$", why: "limits respect constant multiples" },
        { do: "Check a late term", result: "$5/1000=0.005$", why: "late terms are close to zero" },
        { do: "State convergence", result: "converges", why: "the limit is finite" }
      ], answer: "$0$" },
      { problem: "Find $\\lim_{n\\to\\infty}\\frac{2n^2+1}{n^2+4n}$.", steps: [
        { do: "Identify the highest power", result: "$n^2$", why: "quadratic terms dominate" },
        { do: "Divide by $n^2$", result: "$\\frac{2+1/n^2}{1+4/n}$", why: "make the tail behavior visible" },
        { do: "Take vanishing limits", result: "$1/n^2\\to0$ and $4/n\\to0$", why: "reciprocal powers shrink" },
        { do: "Substitute the limits", result: "$\\frac{2+0}{1+0}$", why: "the denominator tends to $1$" },
        { do: "Simplify", result: "$2$", why: "ratio of leading coefficients" }
      ], answer: "$2$" },
      { problem: "Does $a_n=(-1)^n$ converge?", steps: [
        { do: "List several terms", result: "$-1,1,-1,1,\\ldots$", why: "the parity of $n$ controls the sign" },
        { do: "Inspect even indices", result: "$a_{2k}=1$", why: "even powers give positive one" },
        { do: "Inspect odd indices", result: "$a_{2k-1}=-1$", why: "odd powers give negative one" },
        { do: "Compare subsequence limits", result: "$1\\ne-1$", why: "a convergent sequence cannot have two different subsequential limits" },
        { do: "Conclude", result: "does not converge", why: "the terms keep oscillating" }
      ], answer: "Diverges by oscillation." },
      { problem: "Show that $a_n=1-\\frac1n$ is increasing and bounded above by $1$.", steps: [
        { do: "Compute the next term", result: "$a_{n+1}=1-\\frac{1}{n+1}$", why: "compare consecutive terms" },
        { do: "Subtract", result: "$a_{n+1}-a_n=\\frac1n-\\frac{1}{n+1}$", why: "positive difference means increasing" },
        { do: "Combine fractions", result: "$\\frac{1}{n(n+1)}$", why: "common denominator" },
        { do: "Read the sign", result: "$\\frac{1}{n(n+1)}>0$", why: "$n$ is positive" },
        { do: "Check the upper bound", result: "$1-\\frac1n<1$", why: "subtract a positive number from $1$" }
      ], answer: "It is increasing and bounded above by $1$, so it converges to $1$." },
      { problem: "A learning rate is $\\eta_n=0.1/\\sqrt{n}$. Find its limit.", steps: [
        { do: "Write the sequence", result: "$\\eta_n=0.1n^{-1/2}$", why: "use exponent notation" },
        { do: "Find the denominator behavior", result: "$\\sqrt n\\to\\infty$", why: "the index grows without bound" },
        { do: "Take the reciprocal limit", result: "$1/\\sqrt n\\to0$", why: "reciprocal of a growing quantity shrinks" },
        { do: "Multiply by $0.1$", result: "$0.1\\cdot0=0$", why: "constant multiples preserve limits" },
        { do: "Interpret", result: "updates shrink over time", why: "the learning rate tends to zero" }
      ], answer: "$0$" }
    ],
    applications: [
      { title: "Training loss curves", background: "Each epoch produces a loss value, so training creates a sequence.", numbers: "If $L_n=1+2/n$, then $L_{10}=1.2$, $L_{100}=1.02$, and $L_n\\to1$." },
      { title: "Learning-rate schedules", background: "Many optimizers lower step sizes as a sequence indexed by update count.", numbers: "$\\eta_n=0.1/\\sqrt n$ gives $0.1$ at $n=1$, $0.01$ at $n=100$, and tends to $0$." },
      { title: "Fixed-point iteration", background: "Algorithms like value iteration repeatedly update estimates and ask whether the sequence stabilizes.", numbers: "$a_{n+1}=0.5a_n+1$ with $a_0=0$ gives $1,1.5,1.75,\\ldots\\to2$." },
      { title: "Exponential moving averages", background: "EMA states form a sequence that smooths noisy measurements.", numbers: "$m_n=1-0.9^n$ gives $m_{10}\\approx0.651$ and limit $1$." },
      { title: "Numerical approximation", background: "Approximations often improve as $n$ grows, and convergence tells us what value they approach.", numbers: "$(1+1/n)^n$ gives $2.594$ at $n=10$ and approaches $e\\approx2.718$." },
      { title: "Oscillation detection", background: "A metric can stay bounded without settling, which matters in monitoring training.", numbers: "$a_n=(-1)^n$ stays between $-1$ and $1$ but never converges." }
    ],
    applicationsClose: "Sequences are the mathematics of iteration: watch the tail, and you learn the algorithm's long-run story.",
    takeaways: [
      "A sequence is a function of an integer index.",
      "Convergence means the tail terms approach one number.",
      "Bounded monotone sequences converge; oscillation can prevent convergence even when values stay bounded."
    ]
  },

  "math-01-54": {
    id: "math-01-54",
    title: "Series",
    tagline: "Add the terms of a sequence and ask whether the running totals settle.",
    connections: {
      buildsOn: ["sequences", "limits", "improper integrals"],
      leadsTo: ["geometric series", "Taylor series", "Fourier series"],
      usedWith: ["partial sums", "comparison tests", "p-series", "convergence"]
    },
    motivation:
      `<p>A sequence asks where the terms go. A series asks what happens when we keep adding them. That small change matters: terms can go to zero and still add up to infinity if they do not shrink fast enough.</p>` +
      `<p>The safe way to think about a series is through partial sums. Add the first $N$ terms, then ask whether those running totals approach a finite number as $N$ grows.</p>`,
    definition:
      `<p>An infinite series is $$\\sum_{n=1}^\\infty a_n.$$ Its $N$th partial sum is $$S_N=\\sum_{n=1}^N a_n.$$ The series converges to $S$ if $\\lim_{N\\to\\infty}S_N=S$ is finite. A necessary condition is $a_n\\to0$, but that condition alone is not sufficient.</p>` +
      `<p><b>Assumptions that matter:</b> do not confuse the term limit with the sum; if $a_n$ does not tend to zero, the series diverges immediately; for positive terms, comparison with known series is often the cleanest test.</p>`,
    worked: {
      problem: "Determine whether $\\displaystyle\\sum_{n=1}^\\infty \\frac{1}{n(n+1)}$ converges, and find its sum.",
      skills: ["partial fractions", "telescoping series", "partial sums"],
      strategy: "Rewrite the term so neighboring pieces cancel in the partial sums.",
      steps: [
        { do: "Decompose the term", result: "$\\frac{1}{n(n+1)}=\\frac1n-\\frac{1}{n+1}$", why: "partial fractions reveal cancellation" },
        { do: "Write the partial sum", result: "$S_N=\\sum_{n=1}^N\\left(\\frac1n-\\frac{1}{n+1}\\right)$", why: "series convergence is about partial sums" },
        { do: "Expand several terms", result: "$S_N=(1-\\frac12)+(\\frac12-\\frac13)+\\cdots+(\\frac1N-\\frac{1}{N+1})$", why: "show the cancellation pattern" },
        { do: "Cancel neighboring terms", result: "$S_N=1-\\frac{1}{N+1}$", why: "all middle fractions cancel" },
        { do: "Take the limit", result: "$\\lim_{N\\to\\infty}S_N=1$", why: "$1/(N+1)\\to0$" }
      ],
      verify: "The first four terms sum to $1/2+1/6+1/12+1/20=0.8$, and the formula gives $1-1/5=0.8$.",
      answer: "The series converges, and its sum is $1$.",
      connects: "a series converges when its partial sums, not just its individual terms, settle."
    },
    practice: [
      { problem: "Does $\\displaystyle\\sum_{n=1}^\\infty 3$ converge?", steps: [
        { do: "Identify the term", result: "$a_n=3$", why: "each term is constant" },
        { do: "Take the term limit", result: "$\\lim_{n\\to\\infty}a_n=3$", why: "constant sequences keep the same value" },
        { do: "Apply the term test", result: "$3\\ne0$", why: "a convergent series must have terms tending to zero" },
        { do: "Conclude divergence", result: "diverges", why: "the necessary condition fails" },
        { do: "Check partial sums", result: "$S_N=3N\\to\\infty$", why: "the running total grows without bound" }
      ], answer: "Diverges." },
      { problem: "Find the sum of $\\displaystyle\\sum_{n=1}^\\infty\\left(\\frac1n-\\frac{1}{n+1}\\right)$.", steps: [
        { do: "Write the partial sum", result: "$S_N=\\sum_{n=1}^N\\left(\\frac1n-\\frac{1}{n+1}\\right)$", why: "work with finite sums first" },
        { do: "Expand", result: "$(1-\\frac12)+(\\frac12-\\frac13)+\\cdots+(\\frac1N-\\frac{1}{N+1})$", why: "make cancellation visible" },
        { do: "Cancel middle terms", result: "$S_N=1-\\frac{1}{N+1}$", why: "each interior fraction appears once positive and once negative" },
        { do: "Take the limit", result: "$\\lim_{N\\to\\infty}(1-\\frac{1}{N+1})=1$", why: "the final fraction vanishes" },
        { do: "State convergence", result: "converges to $1$", why: "partial sums settle" }
      ], answer: "$1$" },
      { problem: "Does $\\displaystyle\\sum_{n=1}^\\infty \\frac1{n^2}$ converge? Use comparison with $1/(n(n-1))$ for $n\\ge2$.", steps: [
        { do: "Start at $n=2$", result: "$\\sum_{n=2}^\\infty\\frac1{n^2}$", why: "one finite term cannot decide convergence" },
        { do: "Compare denominators", result: "$n^2\\ge n(n-1)$", why: "$n^2-n$ is smaller than $n^2$" },
        { do: "Invert positive quantities", result: "$\\frac1{n^2}\\le\\frac1{n(n-1)}$", why: "larger denominator gives smaller fraction" },
        { do: "Recognize the comparison series", result: "$\\sum_{n=2}^\\infty\\frac1{n(n-1)}=1$", why: "it telescopes" },
        { do: "Apply comparison", result: "converges", why: "a positive series below a convergent positive series converges" }
      ], answer: "Converges." },
      { problem: "Does the harmonic series $\\displaystyle\\sum_{n=1}^\\infty\\frac1n$ converge?", steps: [
        { do: "Group terms", result: "$1+\\frac12+(\\frac13+\\frac14)+(\\frac15+\\cdots+\\frac18)+\\cdots$", why: "powers of two make lower bounds visible" },
        { do: "Bound the third group", result: "$\\frac13+\\frac14\\ge\\frac14+\\frac14=\\frac12$", why: "each term in the group is at least the last one" },
        { do: "Bound the next group", result: "$\\frac15+\\cdots+\\frac18\\ge4\\cdot\\frac18=\\frac12$", why: "four terms each at least $1/8$" },
        { do: "Repeat the pattern", result: "each dyadic group contributes at least $\\frac12$", why: "the number of terms doubles while the smallest term halves" },
        { do: "Conclude", result: "partial sums grow without bound", why: "adding infinitely many halves diverges" }
      ], answer: "Diverges." },
      { problem: "A discounted reward stream is $1+0.5+0.25+0.125+\\cdots$. Find the total.", steps: [
        { do: "Identify the first term", result: "$a=1$", why: "the stream starts with reward $1$" },
        { do: "Identify the ratio", result: "$r=0.5$", why: "each term is half the previous one" },
        { do: "Write the partial sum", result: "$S_N=\\frac{1-r^N}{1-r}$", why: "geometric partial sums have a closed form" },
        { do: "Take the limit", result: "$r^N\\to0$", why: "$|0.5|<1$" },
        { do: "Compute the sum", result: "$\\frac1{1-0.5}=2$", why: "the discounted tail is finite" }
      ], answer: "$2$" }
    ],
    applications: [
      { title: "Expected total reward", background: "Reinforcement learning adds rewards over time, often with discounting to make the series finite.", numbers: "Rewards $1,0.5,0.25,\\ldots$ sum to $2$." },
      { title: "Taylor approximations", background: "Functions like $e^x$ can be represented by infinite series that computers truncate.", numbers: "At $x=1$, $1+1+1/2+1/6=2.667$, close to $e\\approx2.718$." },
      { title: "Fourier representations", background: "Signals can be built as sums of waves, with more terms improving detail.", numbers: "A square wave approximation uses $\\sin x+\\frac13\\sin3x+\\frac15\\sin5x+\\cdots$." },
      { title: "Algorithmic error bounds", background: "Iterative methods often have total remaining error bounded by a tail series.", numbers: "If errors are below $0.1(0.8)^k$, remaining error after step $N$ is at most $0.1\\cdot0.8^{N+1}/0.2=0.5\\cdot0.8^{N+1}$." },
      { title: "Network retries", background: "Repeated retry probabilities create series for expected attempts or traffic.", numbers: "If retry probability is $0.2$, expected attempts are $1+0.2+0.04+\\cdots=1.25$." },
      { title: "Numerical integration", background: "Some quadrature and simulation errors are controlled by summing decreasing contributions.", numbers: "A tail $\\sum_{n=10}^\\infty1/n^2$ is less than $\\int_9^\\infty x^{-2}dx=1/9\\approx0.111$." }
    ],
    applicationsClose: "Series are the language of accumulated small effects: the terms may shrink, but the partial sums tell the truth.",
    takeaways: [
      "A series is the limit of its partial sums.",
      "Terms must go to zero for convergence, but that alone is not enough.",
      "Telescoping, comparison, and geometric structure are common ways to decide convergence."
    ]
  },

  "math-01-55": {
    id: "math-01-55",
    title: "The geometric series",
    tagline: "When each term is a fixed fraction of the last, the whole infinite tail has a simple sum.",
    connections: {
      buildsOn: ["sequences", "series", "exponents"],
      leadsTo: ["Taylor series", "discounted reinforcement learning", "Markov chains"],
      usedWith: ["partial sums", "exponential decay", "recurrence relations", "probability"]
    },
    motivation:
      `<p>Some infinite sums are surprisingly tame. If each term is half the previous one, the pieces get small so quickly that the total settles. This is the geometric series, and it is one of the most reusable formulas in applied math.</p>` +
      `<p>The mental picture is a tail that keeps shrinking by the same multiplier. Once you know the multiplier $r$, the entire infinite future is compressed into $1/(1-r)$.</p>`,
    definition:
      `<p>A geometric series has the form $$a+ar+ar^2+\\cdots=\\sum_{n=0}^\\infty ar^n.$$ Its $N$th partial sum is $$S_N=a\\frac{1-r^{N+1}}{1-r}\\quad(r\\ne1).$$ If $|r|<1$, then $r^{N+1}\\to0$, so $$\\sum_{n=0}^\\infty ar^n=\\frac{a}{1-r}.$$ If $|r|\\ge1$, the series does not converge.</p>` +
      `<p><b>Assumptions that matter:</b> the ratio must be constant from term to term; the infinite-sum formula requires $|r|<1$; the first term $a$ is the term at $n=0$ in this convention.</p>`,
    worked: {
      problem: "Find the sum $\\displaystyle 3+\\frac32+\\frac34+\\frac38+\\cdots$.",
      skills: ["geometric ratio", "infinite series", "partial sum limit"],
      strategy: "Identify the first term and common ratio, check $|r|<1$, then use $a/(1-r)$.",
      steps: [
        { do: "Identify the first term", result: "$a=3$", why: "the series starts with $3$" },
        { do: "Find the common ratio", result: "$r=\\frac{(3/2)}{3}=\\frac12$", why: "divide a term by the previous term" },
        { do: "Check convergence", result: "$|r|=\\frac12<1$", why: "geometric series converge only when the ratio's magnitude is below $1$" },
        { do: "Apply the formula", result: "$S=\\frac{a}{1-r}=\\frac{3}{1-1/2}$", why: "the tail term $r^{N+1}$ vanishes" },
        { do: "Simplify", result: "$6$", why: "$3/(1/2)=6$" }
      ],
      verify: "The first four terms sum to $5.625$, already close to $6$, and the remaining tail is $0.375+0.1875+\\cdots$.",
      answer: "$6$",
      connects: "the geometric series turns repeated fixed-percentage decay into one closed-form total."
    },
    practice: [
      { problem: "Find $\\displaystyle\\sum_{n=0}^\\infty \\left(\\frac13\\right)^n$.", steps: [
        { do: "Identify the first term", result: "$a=1$", why: "when $n=0$, the term is $1$" },
        { do: "Identify the ratio", result: "$r=\\frac13$", why: "each term is one third of the last" },
        { do: "Check convergence", result: "$|r|<1$", why: "the powers shrink to zero" },
        { do: "Apply the formula", result: "$S=\\frac{1}{1-1/3}$", why: "use $a/(1-r)$" },
        { do: "Simplify", result: "$\\frac32$", why: "$1/(2/3)=3/2$" }
      ], answer: "$\\frac32$" },
      { problem: "Find $\\displaystyle\\sum_{n=0}^\\infty 5(0.2)^n$.", steps: [
        { do: "Identify the first term", result: "$a=5$", why: "the coefficient is the $n=0$ term" },
        { do: "Identify the ratio", result: "$r=0.2$", why: "each power multiplies by $0.2$" },
        { do: "Check convergence", result: "$0.2<1$", why: "the ratio's magnitude is below one" },
        { do: "Apply the formula", result: "$S=\\frac{5}{1-0.2}$", why: "infinite geometric sum" },
        { do: "Simplify", result: "$6.25$", why: "$5/0.8=6.25$" }
      ], answer: "$6.25$" },
      { problem: "Does $\\displaystyle\\sum_{n=0}^\\infty 2^n$ converge?", steps: [
        { do: "Identify the first term", result: "$a=1$", why: "$2^0=1$" },
        { do: "Identify the ratio", result: "$r=2$", why: "each term doubles" },
        { do: "Check the ratio", result: "$|r|=2$", why: "geometric convergence needs $|r|<1$" },
        { do: "Inspect term behavior", result: "$2^n\\to\\infty$", why: "the terms do not even go to zero" },
        { do: "Conclude", result: "diverges", why: "partial sums grow without bound" }
      ], answer: "Diverges." },
      { problem: "Find the finite sum $\\displaystyle\\sum_{n=0}^{4}3(\\frac12)^n$.", steps: [
        { do: "Identify values", result: "$a=3,\\ r=\\frac12,\\ N=4$", why: "there are five terms from $0$ through $4$" },
        { do: "Write the finite formula", result: "$S_4=3\\frac{1-(1/2)^5}{1-1/2}$", why: "finite geometric partial sum" },
        { do: "Compute the power", result: "$(1/2)^5=1/32$", why: "five halvings" },
        { do: "Simplify the numerator", result: "$1-1/32=31/32$", why: "subtract the remaining tail factor" },
        { do: "Evaluate", result: "$3\\cdot\\frac{31/32}{1/2}=\\frac{93}{16}$", why: "dividing by $1/2$ doubles" }
      ], answer: "$\\frac{93}{16}=5.8125$" },
      { problem: "In discounted RL, rewards are $1$ every step with discount $\\gamma=0.9$. Find the return $G=\\sum_{t=0}^\\infty0.9^t$.", steps: [
        { do: "Identify the first term", result: "$a=1$", why: "the immediate reward is $1$" },
        { do: "Identify the ratio", result: "$r=0.9$", why: "each future reward is discounted by another $0.9$" },
        { do: "Check convergence", result: "$0.9<1$", why: "discounting makes the infinite future finite" },
        { do: "Apply the formula", result: "$G=\\frac{1}{1-0.9}$", why: "geometric return" },
        { do: "Simplify", result: "$10$", why: "the effective horizon is $1/(1-\\gamma)$" }
      ], answer: "$10$" }
    ],
    applications: [
      { title: "Discounted RL returns", background: "Reinforcement learning discounts future rewards so infinite horizons have finite value.", numbers: "With reward $1$ and $\\gamma=0.99$, return is $1/(1-0.99)=100$." },
      { title: "Effective horizon", background: "The geometric sum tells how many future steps a discount factor roughly remembers.", numbers: "$\\gamma=0.9$ gives horizon $10$; $\\gamma=0.999$ gives horizon $1000$." },
      { title: "Expected geometric counts", background: "If each trial continues with probability $q$, expected count is a geometric series.", numbers: "With stop probability $0.2$, continue probability $0.8$, expected attempts are $1+0.8+0.8^2+\\cdots=5$." },
      { title: "Retry traffic", background: "Distributed systems retry failed requests, and each retry layer adds load.", numbers: "Failure probability $0.1$ gives expected sends $1+0.1+0.01+\\cdots=1/0.9\\approx1.111$." },
      { title: "Exponential moving averages", background: "EMA weights on past observations form a geometric tail.", numbers: "For $\\beta=0.9$, total raw weight $1+0.9+0.9^2+\\cdots=10$, and normalized newest weight is $0.1$." },
      { title: "Neural sequence memory", background: "A recurrent state with multiplier $r$ keeps a geometrically decaying trace of past inputs.", numbers: "If $r=0.95$, total memory mass is $1/(1-0.95)=20$ time steps." },
      { title: "Binary fractions", background: "Repeating binary expansions are geometric series.", numbers: "Binary $0.111\\ldots_2$ equals $1/2+1/4+1/8+\\cdots=1$." }
    ],
    applicationsClose: "The geometric series is the mathematics of repeated fractional survival: rewards, retries, memories, and tails all wear the same uniform.",
    takeaways: [
      "A geometric series has constant ratio $r$ between consecutive terms.",
      "The infinite sum is $a/(1-r)$ exactly when $|r|<1$.",
      "The factor $1/(1-r)$ appears everywhere an effect decays by the same percentage each step."
    ]
  }
};
