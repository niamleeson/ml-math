module.exports = {
  "math-01-01": {
    id: "math-01-01",
    title: "Functions and their graphs",
    tagline: "A function is a dependable rule: one allowed input goes in, exactly one output comes out.",
    connections: {
      buildsOn: ["variables", "ordered pairs", "the coordinate plane"],
      leadsTo: ["Function transformations", "Limits: definition and computation", "Continuity"],
      usedWith: ["equations", "tables of values", "graphs", "composition of functions"]
    },
    motivation:
      "<p>You already know how to follow a rule. If a parking garage charges $5 plus $2 per hour, then 3 hours costs $5+2\\cdot3=11$. Give the rule an input, and it gives back an output.</p>" +
      "<p>A <b>function</b> names that reliable behavior. The graph is not a separate mystery; it is the picture of all input-output pairs the rule produces. Once you can move between formula, table, and graph, calculus has a place to stand.</p>",
    definition:
      "<p>A <b>function</b> $f$ from a <b>domain</b> $D$ to a set of possible outputs $Y$ assigns each input $x$ in $D$ exactly one output, written $f(x)$. The <b>range</b> is the set of outputs that actually occur. The graph of $f$ is the set of points $(x,f(x))$ in the coordinate plane.</p>" +
      "<p>The vertical-line test follows from the definition: if a vertical line at $x=a$ hit the graph twice, then the same input $a$ would have two outputs, which is not a function. To find the natural real domain of a formula, exclude inputs that make the formula illegal, such as division by zero or an even root of a negative number.</p>" +
      "<p><b>Assumptions that matter:</b> we are working with real-valued functions unless stated otherwise; $x$ means an allowed input from the domain; $f(x)$ means the output assigned to that input; and every input in the domain must have one and only one output.</p>",
    worked: {
      problem: "For $f(x)=\\dfrac{x+2}{x-3}$, find $f(1)$, the natural real domain, and two points on the graph.",
      skills: ["evaluating functions", "domain restrictions", "graph points"],
      strategy: "The denominator can break the rule — evaluate allowed inputs and exclude the input that divides by zero.",
      steps: [
        { do: "Substitute $x=1$", result: "$f(1)=\\dfrac{1+2}{1-3}$", why: "replace every $x$ by 1" },
        { do: "Simplify the fraction", result: "$f(1)=-\\dfrac32$", why: "$3/(-2)=-3/2$" },
        { do: "Set the denominator equal to zero", result: "$x-3=0$", why: "division by zero is not allowed" },
        { do: "Solve for the excluded input", result: "$x=3$", why: "add 3 to both sides" },
        { do: "State the domain", result: "$(-\\infty,3)\\cup(3,\\infty)$", why: "all real inputs except 3 are allowed" },
        { do: "Evaluate another easy input", result: "$f(2)=\\dfrac{4}{-1}=-4$", why: "two graph points help locate the curve" },
        { do: "Write the graph points", result: "$(1,-\\tfrac32)$ and $(2,-4)$", why: "a graph point has the form $(x,f(x))$" }
      ],
      verify: "The input $x=3$ would give denominator $0$, so excluding it keeps the function well-defined; the listed points use allowed inputs.",
      answer: "$f(1)=-\\dfrac32$; domain $(-\\infty,3)\\cup(3,\\infty)$; two graph points are $(1,-\\tfrac32)$ and $(2,-4)$.",
      connects: "A graph is the visible record of the function's allowed input-output pairs."
    },
    practice: [
      { problem: "For $g(x)=x^2-4x+1$, compute $g(-1)$ and $g(3)$, then decide whether $(3,-2)$ is on the graph.", steps: [
        { do: "Substitute $x=-1$", result: "$g(-1)=(-1)^2-4(-1)+1$", why: "evaluate the rule at the first input" },
        { do: "Simplify $g(-1)$", result: "$g(-1)=6$", why: "$1+4+1=6$" },
        { do: "Substitute $x=3$", result: "$g(3)=3^2-4\\cdot3+1$", why: "evaluate the rule at the second input" },
        { do: "Simplify $g(3)$", result: "$g(3)=-2$", why: "$9-12+1=-2$" },
        { do: "Compare with the point", result: "$(3,-2)$ is on the graph", why: "its $y$-value equals $g(3)$" }
      ], answer: "$g(-1)=6$, $g(3)=-2$, and $(3,-2)$ is on the graph." },
      { problem: "Find the natural real domain of $h(x)=\\dfrac{\\sqrt{x-2}}{x+5}$.", steps: [
        { do: "Require the square-root input to be nonnegative", result: "$x-2\\ge0$", why: "even roots need nonnegative inputs over the reals" },
        { do: "Solve the root condition", result: "$x\\ge2$", why: "add 2 to both sides" },
        { do: "Require the denominator to be nonzero", result: "$x+5\\ne0$", why: "division by zero is not allowed" },
        { do: "Solve the denominator condition", result: "$x\\ne-5$", why: "subtract 5 from both sides" },
        { do: "Combine the conditions", result: "$[2,\\infty)$", why: "$x\\ge2$ already excludes $-5$" }
      ], answer: "The natural real domain is $[2,\\infty)$." },
      { problem: "Let $p(t)=40+8t$ give speed in miles per hour after $t$ seconds. Find $p(0)$, $p(5)$, and the meaning of the slope.", steps: [
        { do: "Evaluate at $t=0$", result: "$p(0)=40+8\\cdot0=40$", why: "the starting speed is the output at time 0" },
        { do: "Evaluate at $t=5$", result: "$p(5)=40+8\\cdot5$", why: "substitute 5 seconds" },
        { do: "Simplify", result: "$p(5)=80$", why: "$40+40=80$" },
        { do: "Read the coefficient of $t$", result: "$8$", why: "a linear function changes by its slope per unit input" },
        { do: "Attach units", result: "$8$ miles per hour per second", why: "speed changes by 8 mph for each additional second" }
      ], answer: "$p(0)=40$, $p(5)=80$, and the slope means the speed increases by $8$ mph each second." },
      { problem: "A relation contains points $(-1,2)$, $(0,4)$, $(2,4)$, and $(2,7)$. Is it a function?", steps: [
        { do: "List the inputs", result: "$-1,0,2,2$", why: "function status depends on repeated inputs" },
        { do: "Find the repeated input", result: "$x=2$", why: "the same input appears twice" },
        { do: "List its outputs", result: "$4$ and $7$", why: "compare what the rule assigns to that input" },
        { do: "Apply the function rule", result: "not a function", why: "one input has two different outputs" },
        { do: "Connect to the graph", result: "a vertical line at $x=2$ hits two points", why: "this fails the vertical-line test" }
      ], answer: "It is not a function because input $2$ has outputs $4$ and $7$." },
      { problem: "A one-feature predictor is $\\hat y=f(x)=0.8x+1.5$. Compute predictions for $x=2$ and $x=7$, then find the input that gives prediction $5.5$.", steps: [
        { do: "Substitute $x=2$", result: "$f(2)=0.8\\cdot2+1.5$", why: "evaluate the predictor" },
        { do: "Simplify $f(2)$", result: "$f(2)=3.1$", why: "$1.6+1.5=3.1$" },
        { do: "Substitute $x=7$", result: "$f(7)=0.8\\cdot7+1.5$", why: "evaluate the second input" },
        { do: "Simplify $f(7)$", result: "$f(7)=7.1$", why: "$5.6+1.5=7.1$" },
        { do: "Set the prediction equal to $5.5$", result: "$0.8x+1.5=5.5$", why: "solve for the input that would produce that output" },
        { do: "Subtract $1.5$", result: "$0.8x=4$", why: "isolate the term with $x$" },
        { do: "Divide by $0.8$", result: "$x=5$", why: "$4/0.8=5$" }
      ], answer: "The predictions are $3.1$ and $7.1$; prediction $5.5$ occurs at $x=5$." }
    ],
    applications: [
      { title: "A machine-learning model is a function", background: "Supervised learning formalizes prediction as a rule from features to an output. Linear regression is the oldest friendly example: a line maps one measured feature to one prediction.", numbers: "For $f(x)=2.3x+4.1$, a house-size feature $x=10$ gives $f(10)=27.1$. The graph point is $(10,27.1)$." },
      { title: "Activation functions in neural networks", background: "Modern neural networks stack simple functions. ReLU became popular because it is cheap and keeps positive signals from saturating.", numbers: "For $r(x)=\\max(0,x)$, $r(-3)=0$ and $r(2.5)=2.5$. One rule, two graph points." },
      { title: "Hash tables as finite functions", background: "Computer science often uses functions on finite sets. A hash function maps keys to bucket numbers so data can be found quickly.", numbers: "If $h(k)=k\\bmod 10$, then $h(37)=7$ and $h(42)=2$; both are allowed outputs in buckets $0$ through $9$." },
      { title: "Image coordinates and pixel intensity", background: "An image can be viewed as a function from pixel coordinates to brightness or color. This viewpoint is basic in computer vision.", numbers: "A grayscale image might have $I(20,15)=180$ on a $0$ to $255$ scale, meaning coordinate $(20,15)$ has brightness $180$." },
      { title: "Loss as a function of a parameter", background: "Training adjusts parameters because the loss changes when the parameters change. Even a tiny model has a loss function you can graph.", numbers: "For $L(w)=(w-3)^2+2$, $L(1)=6$, $L(3)=2$, and $L(5)=6$, so the lowest plotted point is at $w=3$." },
      { title: "Database lookups are functions when keys are unique", background: "A primary key in a database is designed to choose exactly one row. That is the function rule in engineering clothing.", numbers: "If user id $104$ maps to score $87$, then lookup $s(104)=87$. If id $104$ returned both $87$ and $91$, the key rule would be broken." }
    ],
    applicationsClose: "Across graphs, models, images, tables, and code, the same promise holds: each allowed input has one output you can reason about.",
    takeaways: [
      "A function assigns every input in its domain exactly one output.",
      "The graph is the set of points $(x,f(x))$; the vertical-line test checks the one-output rule.",
      "Natural domains exclude illegal inputs such as zero denominators and negative radicands under even roots.",
      "ML models, losses, activations, and many data lookups are functions in practical form."
    ]
  },

  "math-01-02": {
    id: "math-01-02",
    title: "Function transformations",
    tagline: "Once you know one graph, shifts, stretches, and reflections give you a whole family.",
    connections: {
      buildsOn: ["Functions and their graphs", "coordinate-plane reading", "basic algebra"],
      leadsTo: ["Exponential functions", "Logarithmic functions", "graphing derivatives"],
      usedWith: ["composition", "inverse functions", "symmetry", "piecewise functions"]
    },
    motivation:
      "<p>You already recognize the shape of $y=x^2$: a calm U-shaped parabola. Now suppose you see $g(x)=3(x-2)^2+1$. It would be a shame to rebuild the whole graph from scratch.</p>" +
      "<p>Transformations let you read the new graph as a changed version of an old friend. Shift it, stretch it, or flip it; the basic shape remains visible. This is also the language behind centering data, scaling features, and adding biases.</p>",
    definition:
      "<p>Start with a base function $f(x)$. The graph of $f(x)+k$ shifts up by $k$; $f(x-h)$ shifts right by $h$; $a f(x)$ stretches vertically by factor $|a|$ and reflects across the $x$-axis if $a<0$; $f(bx)$ changes horizontal scale by factor $1/|b|$ and reflects across the $y$-axis if $b<0$.</p>" +
      "<p>Why the inside shift moves right: a point $(u,f(u))$ on the original graph appears on $g(x)=f(x-h)$ when $x-h=u$, so $x=u+h$. Every old input moves to the right by $h$. That one equation explains the counterintuitive part.</p>" +
      "<p><b>Assumptions that matter:</b> transformations preserve the base shape only where the transformed inputs remain in the domain; vertical changes affect outputs, horizontal changes affect inputs; and order matters when several transformations are combined.</p>",
    worked: {
      problem: "Describe how $g(x)=-2\\sqrt{x-3}+4$ is obtained from $f(x)=\\sqrt{x}$, and give the new starting point.",
      skills: ["horizontal shifts", "vertical stretches", "reflections", "domain reading"],
      strategy: "The expression changes both input and output — read inside changes first, then outside changes.",
      steps: [
        { do: "Identify the inside change", result: "$x\\mapsto x-3$", why: "the input to $\\sqrt{\\ }$ is $x-3$" },
        { do: "Translate the inside change", result: "shift right by $3$", why: "$f(x-h)$ moves right by $h$" },
        { do: "Identify the vertical multiplier", result: "$-2$", why: "the whole square root is multiplied" },
        { do: "Translate the multiplier", result: "reflect across the $x$-axis and stretch by $2$", why: "negative flips; absolute value gives stretch" },
        { do: "Identify the outside addition", result: "$+4$", why: "it is added after the square root" },
        { do: "Translate the outside addition", result: "shift up by $4$", why: "adding to outputs moves the graph vertically" },
        { do: "Transform the base starting point $(0,0)$", result: "$(3,4)$", why: "right 3 and up 4; multiplying zero still gives zero" }
      ],
      verify: "At $x=3$, $g(3)=-2\\sqrt0+4=4$, so the graph really starts at $(3,4)$.",
      answer: "Shift $\\sqrt{x}$ right 3, reflect over the $x$-axis, stretch vertically by 2, then shift up 4; the starting point is $(3,4)$.",
      connects: "Transformations turn graphing into tracking how inputs and outputs are renamed."
    },
    practice: [
      { problem: "From $f(x)=x^2$, describe $g(x)=(x+4)^2-7$ and give the vertex.", steps: [
        { do: "Identify the inside expression", result: "$x+4=x-(-4)$", why: "write it in shift form" },
        { do: "Translate the horizontal shift", result: "left $4$", why: "$f(x-h)$ shifts right by $h$, so $h=-4$ shifts left" },
        { do: "Identify the outside change", result: "$-7$", why: "the subtraction is outside the square" },
        { do: "Translate the vertical shift", result: "down $7$", why: "subtracting from outputs moves the graph down" },
        { do: "Move the base vertex $(0,0)$", result: "$(-4,-7)$", why: "left 4 and down 7" }
      ], answer: "The graph shifts left $4$ and down $7$; the vertex is $(-4,-7)$." },
      { problem: "For $g(x)=\\dfrac12|x-6|+3$, describe the transformations from $f(x)=|x|$ and find the vertex.", steps: [
        { do: "Read the inside change", result: "$x-6$", why: "it appears inside the absolute value" },
        { do: "Translate the inside change", result: "right $6$", why: "$f(x-6)$ shifts right" },
        { do: "Read the vertical multiplier", result: "$\\dfrac12$", why: "the absolute value is multiplied by one half" },
        { do: "Translate the multiplier", result: "vertical compression by $\\dfrac12$", why: "outputs are half as far from the axis" },
        { do: "Read the outside addition", result: "$+3$", why: "it changes every output" },
        { do: "Move the base vertex", result: "$(6,3)$", why: "right 6 and up 3" }
      ], answer: "Shift right $6$, compress vertically by $\\tfrac12$, shift up $3$; vertex $(6,3)$." },
      { problem: "If $f(2)=5$ and $f(7)=-1$, find two points on $g(x)=f(x-3)+4$.", steps: [
        { do: "Use the old input $2$", result: "$x-3=2$", why: "match the input inside $f$" },
        { do: "Solve for the new input", result: "$x=5$", why: "add 3" },
        { do: "Transform the old output $5$", result: "$5+4=9$", why: "the outside $+4$ raises outputs" },
        { do: "Use the old input $7$", result: "$x-3=7$", why: "match the second known input" },
        { do: "Solve for the new input", result: "$x=10$", why: "add 3" },
        { do: "Transform the old output $-1$", result: "$-1+4=3$", why: "raise the output by 4" }
      ], answer: "Two points on $g$ are $(5,9)$ and $(10,3)$." },
      { problem: "Describe $q(x)=2f(-x)-1$ using the graph of $f$.", steps: [
        { do: "Read the inside multiplier", result: "$-x$", why: "the input is negated before $f$ sees it" },
        { do: "Translate the inside multiplier", result: "reflect across the $y$-axis", why: "$f(-x)$ mirrors left and right" },
        { do: "Read the outside multiplier", result: "$2$", why: "the output of $f$ is doubled" },
        { do: "Translate the outside multiplier", result: "vertical stretch by $2$", why: "outputs move twice as far from the $x$-axis" },
        { do: "Read the outside subtraction", result: "$-1$", why: "it is applied after the stretch" },
        { do: "Translate the outside subtraction", result: "shift down $1$", why: "subtracting lowers all outputs" }
      ], answer: "Reflect $f$ across the $y$-axis, stretch vertically by $2$, then shift down $1$." },
      { problem: "A feature is standardized by $z=(x-50)/10$. Find the transformed values for $x=30,50,80$, and identify the shift and scale.", steps: [
        { do: "Substitute $x=30$", result: "$z=(30-50)/10$", why: "evaluate the transformed input" },
        { do: "Simplify the first value", result: "$z=-2$", why: "$-20/10=-2$" },
        { do: "Substitute $x=50$", result: "$z=(50-50)/10=0$", why: "the center maps to zero" },
        { do: "Substitute $x=80$", result: "$z=(80-50)/10$", why: "evaluate the third input" },
        { do: "Simplify the third value", result: "$z=3$", why: "$30/10=3$" },
        { do: "Name the transformation", result: "shift by $50$, then scale by $10$", why: "subtract the center and divide by the spread" }
      ], answer: "$30\\mapsto-2$, $50\\mapsto0$, $80\\mapsto3$; subtract $50$ and divide by $10$." }
    ],
    applications: [
      { title: "Feature standardization", background: "Statistics and ML often center and scale features so optimization is less lopsided. This is a transformation of the input axis.", numbers: "With mean $100$ and standard deviation $15$, $x=130$ becomes $z=(130-100)/15=2$." },
      { title: "Bias terms in linear models", background: "A bias shifts a graph vertically. It lets a model fit data that does not pass through the origin.", numbers: "The line $y=3x$ gives $12$ at $x=4$; adding bias $-5$ gives $y=3x-5=7$." },
      { title: "Data augmentation for images", background: "Computer vision training often shifts or flips images so a model learns the object rather than its exact location.", numbers: "A pixel at coordinate $(12,8)$ shifted right by $5$ appears at $(17,8)$; a horizontal flip in a width-$100$ image sends $x=12$ to $x=87$." },
      { title: "Normalizing loss curves", background: "Researchers rescale loss curves to compare training runs with different starting values. The shape is easier to compare after a vertical transformation.", numbers: "If loss drops from $2.4$ to $0.6$, normalized loss $(L-0.6)/(2.4-0.6)$ sends $2.4\\mapsto1$ and $0.6\\mapsto0$." },
      { title: "Audio amplitude scaling", background: "Digital audio changes loudness by multiplying the waveform. A negative multiplier flips the wave phase.", numbers: "Samples $[0.2,-0.5,0.4]$ scaled by $0.5$ become $[0.1,-0.25,0.2]$." },
      { title: "Coordinate transforms in graphics", background: "Computer graphics builds scenes by translating, scaling, and reflecting shapes. The same transformations you read on graphs move objects on screen.", numbers: "A point $(2,3)$ scaled by $4$ then shifted by $(10,-1)$ becomes $(18,11)$." }
    ],
    applicationsClose: "Whether the object is a parabola, a feature, an image, or a sound wave, transformations tell you what changed without losing the original shape.",
    takeaways: [
      "Outside changes move or scale outputs; inside changes move or scale inputs.",
      "$f(x-h)$ shifts right by $h$ because $x-h$ must equal the old input.",
      "Negative outside multipliers reflect across the $x$-axis; negative inside multipliers reflect across the $y$-axis.",
      "Standardization, biases, augmentation, and graphics all use transformation thinking."
    ]
  },

  "math-01-03": {
    id: "math-01-03",
    title: "Exponential functions",
    tagline: "Exponential change is repeated multiplication, the quiet pattern behind growth, decay, and softmax.",
    connections: {
      buildsOn: ["Functions and their graphs", "exponent rules", "Function transformations"],
      leadsTo: ["Logarithmic functions", "limits involving $e$", "derivatives of exponentials"],
      usedWith: ["geometric sequences", "inverse functions", "series", "differential equations"]
    },
    motivation:
      "<p>You already know the difference between adding and multiplying. Add 3 every step and you walk: $3,6,9,12$. Multiply by 3 every step and the numbers run away: $3,9,27,81$.</p>" +
      "<p>An <b>exponential function</b> captures that constant-factor change. It can model doubling, radioactive decay, compound interest, probability weights, and the natural growth curve whose slope equals its height. The graph is steep because multiplication stacks on itself.</p>",
    definition:
      "<p>An exponential function has the form $f(x)=C a^x$, where $C$ is the starting scale, $a$ is the base, and $a>0$ with $a\\ne1$. If $a>1$, the function grows; if $0<a<1$, it decays. The natural exponential is $e^x$, where $e\\approx2.71828$.</p>" +
      "<p>The key law is $a^{x+y}=a^x a^y$. It comes from counting factors for whole-number exponents: $a^{m+n}$ has $m+n$ copies of $a$, which split into $m$ copies times $n$ copies. The real-exponent version is defined so this law remains true continuously.</p>" +
      "<p><b>Assumptions that matter:</b> the base is positive so real-valued powers are well-defined for all real $x$; $a=1$ is excluded because it gives the constant function; and exponential models assume a constant multiplicative factor per equal input step.</p>",
    worked: {
      problem: "A quantity starts at $12$ and grows by $25\\%$ each day. Write the exponential model and find the amount after $6$ days.",
      skills: ["growth factors", "exponential models", "numerical evaluation"],
      strategy: "Percent growth is the obstacle — turn it into a multiplicative factor, then raise that factor to the number of steps.",
      steps: [
        { do: "Convert $25\\%$ growth to a factor", result: "$1+0.25=1.25$", why: "growth adds the percent to the original 100 percent" },
        { do: "Write the model", result: "$A(t)=12(1.25)^t$", why: "start at 12 and multiply by 1.25 each day" },
        { do: "Substitute $t=6$", result: "$A(6)=12(1.25)^6$", why: "six days means six growth factors" },
        { do: "Compute the power", result: "$(1.25)^6\\approx3.8147$", why: "multiply the factor by itself six times" },
        { do: "Multiply by the start", result: "$A(6)\\approx45.78$", why: "$12\\cdot3.8147\\approx45.78$" }
      ],
      verify: "The amount should be bigger than $12$ because the factor $1.25$ is greater than $1$; $45.78$ is plausible after repeated growth.",
      answer: "$A(t)=12(1.25)^t$, so $A(6)\\approx45.78$.",
      connects: "An exponential records equal input steps as equal multiplicative changes."
    },
    practice: [
      { problem: "A value starts at $80$ and decays by $10\\%$ each hour. Write the model and find the value after $4$ hours.", steps: [
        { do: "Convert $10\\%$ decay to a factor", result: "$1-0.10=0.90$", why: "decay keeps 90 percent each hour" },
        { do: "Write the model", result: "$V(t)=80(0.90)^t$", why: "start at 80 and multiply by 0.90 each hour" },
        { do: "Substitute $t=4$", result: "$V(4)=80(0.90)^4$", why: "four hours means four factors" },
        { do: "Compute the power", result: "$(0.90)^4=0.6561$", why: "$0.9$ multiplied four times" },
        { do: "Multiply by $80$", result: "$52.488$", why: "$80\\cdot0.6561=52.488$" }
      ], answer: "$V(t)=80(0.90)^t$ and $V(4)=52.488$." },
      { problem: "Solve $3\\cdot2^x=96$ by rewriting both sides.", steps: [
        { do: "Divide by $3$", result: "$2^x=32$", why: "isolate the exponential" },
        { do: "Rewrite $32$ as a power of $2$", result: "$32=2^5$", why: "use a matching base" },
        { do: "Set the powers equal", result: "$2^x=2^5$", why: "both sides now have the same base" },
        { do: "Equate exponents", result: "$x=5$", why: "$2^x$ is one-to-one" },
        { do: "Check in the original", result: "$3\\cdot2^5=96$", why: "$3\\cdot32=96$" }
      ], answer: "$x=5$." },
      { problem: "Compute $e^{\\ln 7}$ and $\\ln(e^{-2})$.", steps: [
        { do: "Identify inverse functions", result: "$e^x$ and $\\ln x$ undo each other", why: "logarithms reverse exponentials" },
        { do: "Apply the inverse rule to $e^{\\ln 7}$", result: "$7$", why: "$\\ln 7$ is the exponent that produces $7$" },
        { do: "Apply the inverse rule to $\\ln(e^{-2})$", result: "$-2$", why: "the natural log returns the exponent on $e$" },
        { do: "Check the domain", result: "$e^{-2}>0$", why: "the logarithm input must be positive" },
        { do: "State both values", result: "$7$ and $-2$", why: "both simplifications are valid" }
      ], answer: "$e^{\\ln 7}=7$ and $\\ln(e^{-2})=-2$." },
      { problem: "A half-life model starts at $160$ grams and halves every $3$ days. Find the amount after $12$ days.", steps: [
        { do: "Count half-lives", result: "$12/3=4$", why: "one half-life takes 3 days" },
        { do: "Write the half-life model", result: "$A=160(\\tfrac12)^4$", why: "four halvings occur" },
        { do: "Compute the power", result: "$(\\tfrac12)^4=\\tfrac1{16}$", why: "halve four times" },
        { do: "Multiply by the start", result: "$160\\cdot\\tfrac1{16}=10$", why: "divide 160 by 16" },
        { do: "Attach units", result: "$10$ grams", why: "the modeled quantity is mass" }
      ], answer: "$10$ grams remain after $12$ days." },
      { problem: "Softmax uses exponentials. For logits $[0,1,2]$, compute the probability of the largest logit using $e^0=1$, $e^1\\approx2.718$, $e^2\\approx7.389$.", steps: [
        { do: "Exponentiate the logits", result: "$[1,2.718,7.389]$", why: "softmax turns scores into positive weights" },
        { do: "Add the weights", result: "$1+2.718+7.389=11.107$", why: "probabilities divide by the total weight" },
        { do: "Select the largest weight", result: "$7.389$", why: "the largest logit is 2" },
        { do: "Divide by the total", result: "$7.389/11.107\\approx0.665$", why: "normalize the weight" },
        { do: "Convert to percent", result: "$66.5\\%$", why: "$0.665$ is about two thirds" }
      ], answer: "The largest-logit softmax probability is approximately $0.665$." }
    ],
    applications: [
      { title: "Compound interest", background: "Banks and finance made exponentials familiar long before ML. Reinvested interest earns interest on interest, so growth is multiplicative.", numbers: "$1000$ at $5\\%$ yearly for $10$ years becomes $1000(1.05)^{10}\\approx1628.89$." },
      { title: "Population growth and decay", background: "Early mathematical biology used exponentials for populations with roughly constant percentage growth, and for substances with constant percentage decay.", numbers: "A culture of $500$ cells doubling every hour has $500\\cdot2^6=32000$ cells after $6$ hours." },
      { title: "Learning-rate schedules", background: "Optimization often lowers the learning rate smoothly so early steps explore and later steps settle.", numbers: "With $\\eta_t=0.1e^{-0.2t}$, $\\eta_5=0.1e^{-1}\\approx0.0368$." },
      { title: "Softmax probabilities", background: "Classification models use exponentials to turn arbitrary scores into positive weights that can be normalized.", numbers: "Logits $[2,0]$ give weights $[7.389,1]$, so the first probability is $7.389/(8.389)\\approx0.881$." },
      { title: "Exponential moving averages", background: "Signal processing and optimizers like Adam smooth noisy measurements with exponentially fading memory.", numbers: "With $m_t=0.9m_{t-1}+0.1x_t$, a value from $5$ steps ago has weight $0.1(0.9)^5\\approx0.059$." },
      { title: "Runtime blowup", background: "Computer science uses exponentials to describe algorithms whose work doubles with each added item, a warning sign for scale.", numbers: "A brute-force subset search over $n=30$ items checks $2^{30}=1,073,741,824$ subsets." }
    ],
    applicationsClose: "The shared pattern is constant-factor change: money, cells, probabilities, memories, and runtimes all multiply as the input moves.",
    takeaways: [
      "$C a^x$ starts at scale $C$ and multiplies by $a$ for each unit increase in $x$.",
      "$a>1$ gives growth; $0<a<1$ gives decay; $e\\approx2.71828$ is the natural base.",
      "The law $a^{x+y}=a^x a^y$ is the engine behind exponential modeling.",
      "Softmax, learning-rate decay, moving averages, and runtime analysis all use exponential change."
    ]
  },

  "math-01-04": {
    id: "math-01-04",
    title: "Logarithmic functions",
    tagline: "A logarithm asks for the exponent, turning multiplicative stories into additive ones.",
    connections: {
      buildsOn: ["Exponential functions", "inverse functions", "exponent rules"],
      leadsTo: ["limits involving logarithms", "derivatives of logarithms", "log-likelihood"],
      usedWith: ["inverse functions", "change of base", "concavity", "orders of growth"]
    },
    motivation:
      "<p>You already know that $2^5=32$. A logarithm asks the same fact from the other side: what exponent on $2$ gives $32$? The answer is $5$.</p>" +
      "<p>This reversal is more than notation. Logs compress huge ranges and turn products into sums. That is why they are so useful when probabilities get tiny, when algorithms span many input sizes, and when a graph needs to show both $1$ and $1,000,000$ clearly.</p>",
    definition:
      "<p>For base $b>0$ with $b\\ne1$, $\\log_b(y)=x$ means exactly $b^x=y$. The natural logarithm is $\\ln y=\\log_e y$. The input $y$ must be positive over the real numbers, because $b^x$ is always positive.</p>" +
      "<p>The product rule comes from exponent laws. If $u=b^m$ and $v=b^n$, then $uv=b^{m+n}$. Taking $\\log_b$ gives $\\log_b(uv)=m+n=\\log_b u+\\log_b v$. So a product becomes a sum because multiplying powers adds exponents.</p>" +
      "<p><b>Assumptions that matter:</b> the base must be positive and not equal to $1$; log inputs must be positive; log rules such as $\\log(uv)=\\log u+\\log v$ require $u>0$ and $v>0$; and $\\ln$ means base $e$.</p>",
    worked: {
      problem: "Solve $\\ln(x-1)=2$ and state the domain condition.",
      skills: ["inverse functions", "domain restrictions", "natural logarithms"],
      strategy: "The logarithm hides the input — exponentiate both sides, but keep the positivity condition.",
      steps: [
        { do: "Require the log input to be positive", result: "$x-1>0$", why: "real logarithms need positive inputs" },
        { do: "Solve the domain condition", result: "$x>1$", why: "add 1 to both sides" },
        { do: "Exponentiate both sides", result: "$e^{\\ln(x-1)}=e^2$", why: "$e^x$ undoes $\\ln x$" },
        { do: "Simplify the left side", result: "$x-1=e^2$", why: "inverse functions cancel on positive inputs" },
        { do: "Add 1", result: "$x=1+e^2$", why: "isolate $x$" },
        { do: "Approximate", result: "$x\\approx8.389$", why: "$e^2\\approx7.389$" }
      ],
      verify: "$x\\approx8.389$ is greater than $1$, so the log input is positive; $\\ln(e^2)=2$.",
      answer: "$x=1+e^2\\approx8.389$, with required domain $x>1$.",
      connects: "Logarithms undo exponentials, but only after the domain has been respected."
    },
    practice: [
      { problem: "Evaluate $\\log_2 64$, $\\log_{10}(0.01)$, and $\\ln 1$.", steps: [
        { do: "Rewrite $64$ as a power of $2$", result: "$64=2^6$", why: "log base 2 asks for an exponent on 2" },
        { do: "Evaluate the first log", result: "$\\log_2 64=6$", why: "$2^6=64$" },
        { do: "Rewrite $0.01$ as a power of $10$", result: "$0.01=10^{-2}$", why: "one hundredth is $10^{-2}$" },
        { do: "Evaluate the second log", result: "$\\log_{10}(0.01)=-2$", why: "$10^{-2}=0.01$" },
        { do: "Use $e^0=1$", result: "$\\ln1=0$", why: "the exponent on $e$ that gives 1 is 0" }
      ], answer: "$6$, $-2$, and $0$." },
      { problem: "Simplify $\\ln(3e^5)-\\ln 3$.", steps: [
        { do: "Use the product rule", result: "$\\ln(3e^5)=\\ln3+\\ln(e^5)$", why: "log of a product becomes a sum" },
        { do: "Substitute into the expression", result: "$(\\ln3+\\ln(e^5))-\\ln3$", why: "replace the first term" },
        { do: "Cancel $\\ln3$", result: "$\\ln(e^5)$", why: "opposite terms add to zero" },
        { do: "Use inverse functions", result: "$5$", why: "$\\ln(e^5)=5$" },
        { do: "Check positivity", result: "$3e^5>0$ and $3>0$", why: "the log rules were legal" }
      ], answer: "$5$." },
      { problem: "Solve $\\log_3(x+2)=4$.", steps: [
        { do: "Require a positive log input", result: "$x+2>0$", why: "the logarithm needs a positive argument" },
        { do: "Convert to exponential form", result: "$x+2=3^4$", why: "$\\log_3(y)=4$ means $y=3^4$" },
        { do: "Compute $3^4$", result: "$81$", why: "$3\\cdot3\\cdot3\\cdot3=81$" },
        { do: "Subtract $2$", result: "$x=79$", why: "isolate $x$" },
        { do: "Check the domain", result: "$79+2=81>0$", why: "the log input is valid" }
      ], answer: "$x=79$." },
      { problem: "Use change of base to approximate $\\log_2 10$ given $\\ln10\\approx2.303$ and $\\ln2\\approx0.693$.", steps: [
        { do: "Write the change-of-base formula", result: "$\\log_2 10=\\dfrac{\\ln10}{\\ln2}$", why: "any log base can be expressed with natural logs" },
        { do: "Substitute the approximations", result: "$\\dfrac{2.303}{0.693}$", why: "use the given numbers" },
        { do: "Divide", result: "$3.323$", why: "$2.303/0.693\\approx3.323$" },
        { do: "Compare powers", result: "$2^3=8$ and $2^4=16$", why: "10 should have a log between 3 and 4" },
        { do: "Confirm the estimate", result: "$3.323$ is between $3$ and $4$", why: "the approximation is reasonable" }
      ], answer: "$\\log_2 10\\approx3.323$." },
      { problem: "A model assigns probabilities $0.8$, $0.5$, and $0.25$ to three correct labels. Compute the log-likelihood and negative log-likelihood using natural logs: $\\ln0.8\\approx-0.223$, $\\ln0.5\\approx-0.693$, $\\ln0.25\\approx-1.386$.", steps: [
        { do: "Write the product likelihood", result: "$0.8\\cdot0.5\\cdot0.25$", why: "independent correct-label probabilities multiply" },
        { do: "Convert product to log sum", result: "$\\ln0.8+\\ln0.5+\\ln0.25$", why: "log of a product is a sum" },
        { do: "Substitute values", result: "$-0.223-0.693-1.386$", why: "use the provided natural logs" },
        { do: "Add the logs", result: "$-2.302$", why: "sum the three terms" },
        { do: "Negate for loss", result: "$2.302$", why: "negative log-likelihood is the negative of log-likelihood" }
      ], answer: "Log-likelihood $\\approx-2.302$; negative log-likelihood $\\approx2.302$." }
    ],
    applications: [
      { title: "Log-likelihood", background: "Statistics uses likelihood to measure how well parameters explain data. Logs make products of probabilities computable and easier to optimize.", numbers: "For probabilities $0.9$, $0.8$, and $0.5$, log-likelihood is $\\ln0.9+\\ln0.8+\\ln0.5\\approx-0.105-0.223-0.693=-1.021$." },
      { title: "Cross-entropy loss", background: "Classification models are often trained by penalizing low probability on the true class. The penalty is a negative log.", numbers: "If the true-class probability is $0.95$, loss is $-\\ln0.95\\approx0.051$; if it is $0.05$, loss is $-\\ln0.05\\approx2.996$." },
      { title: "Numerical stability", background: "Products of many small probabilities can underflow to zero in floating-point arithmetic. Summing logs avoids that collapse.", numbers: "The product of $100$ probabilities each equal to $0.01$ is $10^{-200}$, while the log is $100\\ln0.01\\approx-460.5$." },
      { title: "Information in bits", background: "Information theory measures surprise with a logarithm. Rare events carry more bits because their probabilities require larger negative logs.", numbers: "An event with probability $1/8$ has $-\\log_2(1/8)=3$ bits of surprise." },
      { title: "Algorithm analysis", background: "Binary search is fast because each comparison halves the search space. Logs count how many halvings are needed.", numbers: "Searching $1,048,576=2^{20}$ sorted items takes at most about $20$ halvings." },
      { title: "Log-scale hyperparameter search", background: "Learning rates often matter by multiplicative factors, so engineers search evenly in log space rather than ordinary space.", numbers: "The values $10^{-4}$, $10^{-3}$, $10^{-2}$, $10^{-1}$ are equally spaced by $1$ on a base-10 log scale." }
    ],
    applicationsClose: "Logs keep the exponent in view: they compress scale, tame products, and turn multiplicative structure into additive arithmetic.",
    takeaways: [
      "$\\log_b(y)=x$ means $b^x=y$; the log asks for an exponent.",
      "The input to a real logarithm must be positive, and the base must be positive and not $1$.",
      "$\\log(uv)=\\log u+\\log v$ because multiplying powers adds exponents.",
      "Log-likelihood, cross-entropy, binary search, and log-scale tuning all rely on the same exponent-counting idea."
    ]
  },

  "math-01-05": {
    id: "math-01-05",
    title: "Trigonometric functions",
    tagline: "Sine and cosine are coordinates on a circle, which is why they describe waves so naturally.",
    connections: {
      buildsOn: ["Functions and their graphs", "angles", "right triangles", "the unit circle"],
      leadsTo: ["Inverse trigonometric functions", "limits of trigonometric functions", "derivatives of sine and cosine"],
      usedWith: ["periodic functions", "vectors", "rotations", "Fourier series"]
    },
    motivation:
      "<p>You already know a repeating pattern when you see one: daylight, seasons, a swing, a sound wave. Trigonometric functions are the calm mathematical way to describe that repetition.</p>" +
      "<p>The beautiful shortcut is the unit circle. As a point travels around a circle of radius $1$, its horizontal coordinate is $\\cos\\theta$ and its vertical coordinate is $\\sin\\theta$. A wave is what you see when you watch one coordinate over time.</p>",
    definition:
      "<p>On the unit circle, an angle $\\theta$ in radians determines a point $(\\cos\\theta,\\sin\\theta)$. The functions repeat with period $2\\pi$: $\\sin(\\theta+2\\pi)=\\sin\\theta$ and $\\cos(\\theta+2\\pi)=\\cos\\theta$. The tangent is $\\tan\\theta=\\sin\\theta/\\cos\\theta$ where $\\cos\\theta\\ne0$.</p>" +
      "<p>The identity $\\sin^2\\theta+\\cos^2\\theta=1$ comes directly from the unit circle: every point on radius $1$ satisfies $x^2+y^2=1$, and here $x=\\cos\\theta$, $y=\\sin\\theta$. This is Pythagoras written in circular coordinates.</p>" +
      "<p><b>Assumptions that matter:</b> calculus uses radians, not degrees; tangent is undefined where $\\cos\\theta=0$; and periodicity means many different angles can have the same sine or cosine value.</p>",
    worked: {
      problem: "Evaluate $\\sin\\left(\\dfrac{5\\pi}{6}\\right)$, $\\cos\\left(\\dfrac{5\\pi}{6}\\right)$, and $\\tan\\left(\\dfrac{5\\pi}{6}\\right)$.",
      skills: ["unit circle", "reference angles", "tangent as a ratio"],
      strategy: "The angle is in quadrant II — use the reference angle and the signs of the coordinates.",
      steps: [
        { do: "Find the reference angle", result: "$\\pi-\\dfrac{5\\pi}{6}=\\dfrac{\\pi}{6}$", why: "quadrant II angles are measured back to $\\pi$" },
        { do: "Recall sine of the reference angle", result: "$\\sin(\\pi/6)=\\dfrac12$", why: "standard unit-circle value" },
        { do: "Apply the quadrant II sign for sine", result: "$\\sin(5\\pi/6)=\\dfrac12$", why: "the $y$-coordinate is positive in quadrant II" },
        { do: "Recall cosine of the reference angle", result: "$\\cos(\\pi/6)=\\dfrac{\\sqrt3}{2}$", why: "standard unit-circle value" },
        { do: "Apply the quadrant II sign for cosine", result: "$\\cos(5\\pi/6)=-\\dfrac{\\sqrt3}{2}$", why: "the $x$-coordinate is negative in quadrant II" },
        { do: "Compute tangent", result: "$\\tan(5\\pi/6)=\\dfrac{1/2}{-\\sqrt3/2}$", why: "tangent is sine divided by cosine" },
        { do: "Simplify tangent", result: "$-\\dfrac{1}{\\sqrt3}=-\\dfrac{\\sqrt3}{3}$", why: "divide the fractions and rationalize" }
      ],
      verify: "Quadrant II has positive sine and negative cosine, so the negative tangent is expected.",
      answer: "$\\sin(5\\pi/6)=\\dfrac12$, $\\cos(5\\pi/6)=-\\dfrac{\\sqrt3}{2}$, and $\\tan(5\\pi/6)=-\\dfrac{\\sqrt3}{3}$.",
      connects: "Trig values are just signed coordinates on the unit circle."
    },
    practice: [
      { problem: "Evaluate $\\sin(7\\pi/4)$ and $\\cos(7\\pi/4)$.", steps: [
        { do: "Locate the quadrant", result: "$7\\pi/4$ is in quadrant IV", why: "it lies between $3\\pi/2$ and $2\\pi$" },
        { do: "Find the reference angle", result: "$2\\pi-7\\pi/4=\\pi/4$", why: "measure back to the positive $x$-axis" },
        { do: "Recall the reference values", result: "$\\sin(\\pi/4)=\\cos(\\pi/4)=\\dfrac{\\sqrt2}{2}$", why: "standard $45^\\circ$ values" },
        { do: "Apply the sine sign", result: "$\\sin(7\\pi/4)=-\\dfrac{\\sqrt2}{2}$", why: "the $y$-coordinate is negative in quadrant IV" },
        { do: "Apply the cosine sign", result: "$\\cos(7\\pi/4)=\\dfrac{\\sqrt2}{2}$", why: "the $x$-coordinate is positive in quadrant IV" }
      ], answer: "$\\sin(7\\pi/4)=-\\dfrac{\\sqrt2}{2}$ and $\\cos(7\\pi/4)=\\dfrac{\\sqrt2}{2}$." },
      { problem: "Find the exact value of $\\tan(2\\pi/3)$.", steps: [
        { do: "Locate the quadrant", result: "$2\\pi/3$ is in quadrant II", why: "it lies between $\\pi/2$ and $\\pi$" },
        { do: "Find the reference angle", result: "$\\pi-2\\pi/3=\\pi/3$", why: "measure back to $\\pi$" },
        { do: "Recall sine and cosine", result: "$\\sin(\\pi/3)=\\dfrac{\\sqrt3}{2}$, $\\cos(\\pi/3)=\\dfrac12$", why: "standard values" },
        { do: "Apply quadrant II signs", result: "$\\sin(2\\pi/3)=\\dfrac{\\sqrt3}{2}$, $\\cos(2\\pi/3)=-\\dfrac12$", why: "sine positive, cosine negative" },
        { do: "Divide sine by cosine", result: "$\\tan(2\\pi/3)=-\\sqrt3$", why: "$(\\sqrt3/2)/(-1/2)=-\\sqrt3$" }
      ], answer: "$-\\sqrt3$." },
      { problem: "Use periodicity to simplify $\\sin(17\\pi/6)$.", steps: [
        { do: "Subtract one full period", result: "$17\\pi/6-12\\pi/6=5\\pi/6$", why: "$2\\pi=12\\pi/6$" },
        { do: "Use periodicity", result: "$\\sin(17\\pi/6)=\\sin(5\\pi/6)$", why: "sine repeats every $2\\pi$" },
        { do: "Find the reference angle", result: "$\\pi-5\\pi/6=\\pi/6$", why: "$5\\pi/6$ is in quadrant II" },
        { do: "Recall the reference sine", result: "$\\sin(\\pi/6)=\\dfrac12$", why: "standard value" },
        { do: "Apply the quadrant sign", result: "$\\dfrac12$", why: "sine is positive in quadrant II" }
      ], answer: "$\\sin(17\\pi/6)=\\dfrac12$." },
      { problem: "If $\\sin\\theta=3/5$ and $\\theta$ is in quadrant II, find $\\cos\\theta$ and $\\tan\\theta$.", steps: [
        { do: "Use the Pythagorean identity", result: "$(3/5)^2+\\cos^2\\theta=1$", why: "$\\sin^2\\theta+\\cos^2\\theta=1$" },
        { do: "Square the sine", result: "$9/25+\\cos^2\\theta=1$", why: "$(3/5)^2=9/25$" },
        { do: "Subtract $9/25$", result: "$\\cos^2\\theta=16/25$", why: "$1=25/25$" },
        { do: "Take the square root with quadrant sign", result: "$\\cos\\theta=-4/5$", why: "cosine is negative in quadrant II" },
        { do: "Compute tangent", result: "$\\tan\\theta=(3/5)/(-4/5)=-3/4$", why: "tangent is sine over cosine" }
      ], answer: "$\\cos\\theta=-4/5$ and $\\tan\\theta=-3/4$." },
      { problem: "A positional encoding uses $s(p)=\\sin(p\\pi/2)$. Compute $s(0)$, $s(1)$, $s(2)$, and $s(3)$.", steps: [
        { do: "Substitute $p=0$", result: "$s(0)=\\sin0=0$", why: "the angle is $0$" },
        { do: "Substitute $p=1$", result: "$s(1)=\\sin(\\pi/2)=1$", why: "the top of the unit circle" },
        { do: "Substitute $p=2$", result: "$s(2)=\\sin\\pi=0$", why: "the point is on the negative $x$-axis" },
        { do: "Substitute $p=3$", result: "$s(3)=\\sin(3\\pi/2)=-1$", why: "the bottom of the unit circle" },
        { do: "List the pattern", result: "$0,1,0,-1$", why: "sine samples a repeating wave" }
      ], answer: "The values are $0,1,0,-1$." }
    ],
    applications: [
      { title: "Positional encodings", background: "Transformers need a way to represent order. Sinusoidal encodings, introduced in the original Transformer, use many sine and cosine waves at different frequencies.", numbers: "For a simple channel $\\sin(p\\pi/2)$, positions $0,1,2,3$ map to $0,1,0,-1$." },
      { title: "Fourier analysis", background: "Fourier's nineteenth-century insight was that complicated periodic signals can be decomposed into sines and cosines. This powers audio, images, and PDE solvers.", numbers: "The signal $3\\sin(2t)+0.5\\cos(10t)$ has a low-frequency amplitude $3$ and high-frequency amplitude $0.5$." },
      { title: "Rotations in graphics", background: "Rotating a 2-D point uses cosine and sine because rotation preserves distance around a circle.", numbers: "Rotating $(1,0)$ by $\\pi/2$ gives $(\\cos\\pi/2,\\sin\\pi/2)=(0,1)$." },
      { title: "Seasonal features", background: "Calendar variables wrap around: December and January are close. Sine and cosine encode that circular structure for models.", numbers: "Day $91$ of a $365$-day year has angle $2\\pi(91/365)\\approx1.57$, so $\\sin\\theta\\approx1$ and $\\cos\\theta\\approx0$." },
      { title: "Signal sampling", background: "Digital signal processing tracks waves by sampling trig functions at discrete times.", numbers: "A $2$ Hz sine sampled at $t=0.125$ seconds has value $\\sin(2\\pi\\cdot2\\cdot0.125)=\\sin(\\pi/2)=1$." },
      { title: "Cosine similarity geometry", background: "Vector similarity is named after cosine because dot products encode angles between directions.", numbers: "For unit vectors at $60^\\circ$, similarity is $\\cos(\\pi/3)=0.5$." }
    ],
    applicationsClose: "The unit circle gives one language for waves, rotations, seasons, signals, and vector angles.",
    takeaways: [
      "$\\cos\\theta$ and $\\sin\\theta$ are the $x$- and $y$-coordinates on the unit circle.",
      "They repeat every $2\\pi$, and calculus expects angles in radians.",
      "$\\sin^2\\theta+\\cos^2\\theta=1$ comes from the unit circle equation.",
      "Trig functions model periodic behavior in signals, encodings, rotations, and geometry."
    ]
  },

  "math-01-06": {
    id: "math-01-06",
    title: "Inverse trigonometric functions",
    tagline: "Inverse trig recovers a chosen angle from a ratio, carefully avoiding the many-answers trap.",
    connections: {
      buildsOn: ["Trigonometric functions", "inverse functions", "unit-circle signs"],
      leadsTo: ["derivatives of inverse trig functions", "trig substitution", "geometry of gradients"],
      usedWith: ["right triangles", "vectors", "restricted domains", "coordinate geometry"]
    },
    motivation:
      "<p>Sometimes you know the ratio before you know the angle. A ramp rises $3$ meters over a $4$ meter run; a pair of vectors has cosine similarity $0.8$; a robot sees movement $(2,5)$. In each case, you want an angle back.</p>" +
      "<p>The only catch is that trig functions repeat. Many angles have the same sine, cosine, or tangent. Inverse trig functions solve this by returning one agreed-upon principal angle, like choosing one clean representative from a repeating family.</p>",
    definition:
      "<p>The functions $\\arcsin x$, $\\arccos x$, and $\\arctan x$ return principal angles. Specifically, $\\arcsin x\\in[-\\pi/2,\\pi/2]$ with input $x\\in[-1,1]$; $\\arccos x\\in[0,\\pi]$ with input $x\\in[-1,1]$; and $\\arctan x\\in(-\\pi/2,\\pi/2)$ with any real input.</p>" +
      "<p>The restriction is necessary. Since $\\sin(\\pi/6)=\\sin(5\\pi/6)=1/2$, sine cannot have a true inverse on all real angles. By restricting sine to $[-\\pi/2,\\pi/2]$, each output in $[-1,1]$ comes from exactly one angle, so $\\arcsin$ is well-defined.</p>" +
      "<p><b>Assumptions that matter:</b> inverse trig outputs are angles in radians unless stated otherwise; $\\arcsin$ and $\\arccos$ accept only inputs from $[-1,1]$; and $\\arctan(y/x)$ alone does not always identify the correct quadrant, which is why many systems use $\\operatorname{atan2}(y,x)$.</p>",
    worked: {
      problem: "Evaluate $\\arcsin\\left(-\\dfrac12\\right)$, $\\arccos\\left(-\\dfrac12\\right)$, and $\\arctan(\\sqrt3)$.",
      skills: ["principal ranges", "unit-circle values", "radians"],
      strategy: "The ratios are familiar — choose the angle that lies in each inverse function's principal range.",
      steps: [
        { do: "Recall where sine is $-1/2$", result: "$\\theta=-\\pi/6$ or $7\\pi/6$ among many choices", why: "sine repeats" },
        { do: "Apply the arcsine range", result: "$\\arcsin(-1/2)=-\\pi/6$", why: "arcsine returns an angle in $[-\\pi/2,\\pi/2]$" },
        { do: "Recall where cosine is $-1/2$", result: "$\\theta=2\\pi/3$ or $4\\pi/3$ among many choices", why: "cosine repeats" },
        { do: "Apply the arccosine range", result: "$\\arccos(-1/2)=2\\pi/3$", why: "arccosine returns an angle in $[0,\\pi]$" },
        { do: "Recall where tangent is $\\sqrt3$", result: "$\\theta=\\pi/3$ plus repeats", why: "$\\tan(\\pi/3)=\\sqrt3$" },
        { do: "Apply the arctangent range", result: "$\\arctan(\\sqrt3)=\\pi/3$", why: "arctangent returns an angle in $(-\\pi/2,\\pi/2)$" }
      ],
      verify: "Each answer lies in its required principal range and gives back the requested trig value.",
      answer: "$\\arcsin(-\\tfrac12)=-\\dfrac\\pi6$, $\\arccos(-\\tfrac12)=\\dfrac{2\\pi}{3}$, and $\\arctan(\\sqrt3)=\\dfrac\\pi3$.",
      connects: "Inverse trig is ordinary inverse-function thinking, with domain restrictions doing the quiet essential work."
    },
    practice: [
      { problem: "Evaluate $\\arcsin(\\sqrt2/2)$ and $\\arccos(\\sqrt2/2)$.", steps: [
        { do: "Recall the sine value", result: "$\\sin(\\pi/4)=\\sqrt2/2$", why: "standard unit-circle value" },
        { do: "Check the arcsine range", result: "$\\pi/4\\in[-\\pi/2,\\pi/2]$", why: "principal range is required" },
        { do: "Evaluate arcsine", result: "$\\arcsin(\\sqrt2/2)=\\pi/4$", why: "the angle is allowed" },
        { do: "Recall the cosine value", result: "$\\cos(\\pi/4)=\\sqrt2/2$", why: "same reference angle" },
        { do: "Check the arccosine range", result: "$\\pi/4\\in[0,\\pi]$", why: "principal range is required" }
      ], answer: "$\\arcsin(\\sqrt2/2)=\\pi/4$ and $\\arccos(\\sqrt2/2)=\\pi/4$." },
      { problem: "Evaluate $\\arccos(0)$ and $\\arctan(-1)$.", steps: [
        { do: "Recall where cosine is zero", result: "$\\theta=\\pi/2$ and $3\\pi/2$ among repeats", why: "cosine is the $x$-coordinate" },
        { do: "Apply the arccosine range", result: "$\\arccos(0)=\\pi/2$", why: "$\\pi/2$ lies in $[0,\\pi]$" },
        { do: "Recall where tangent is $-1$", result: "$\\theta=-\\pi/4$ plus repeats", why: "tangent is negative in quadrant IV within the principal range" },
        { do: "Apply the arctangent range", result: "$\\arctan(-1)=-\\pi/4$", why: "arctangent returns angles in $(-\\pi/2,\\pi/2)$" },
        { do: "Check both values", result: "$\\cos(\\pi/2)=0$ and $\\tan(-\\pi/4)=-1$", why: "substitution verifies the inverses" }
      ], answer: "$\\arccos(0)=\\pi/2$ and $\\arctan(-1)=-\\pi/4$." },
      { problem: "Solve $\\sin\\theta=\\dfrac12$ for the principal arcsine answer, then list the two solutions in $[0,2\\pi)$.", steps: [
        { do: "Take the principal inverse", result: "$\\arcsin(1/2)=\\pi/6$", why: "$\\pi/6$ lies in the arcsine range" },
        { do: "Find the second quadrant angle", result: "$\\pi-\\pi/6=5\\pi/6$", why: "sine is also positive in quadrant II" },
        { do: "List angles in one full turn", result: "$\\pi/6$ and $5\\pi/6$", why: "both lie in $[0,2\\pi)$" },
        { do: "Check the first", result: "$\\sin(\\pi/6)=1/2$", why: "standard value" },
        { do: "Check the second", result: "$\\sin(5\\pi/6)=1/2$", why: "same reference angle in quadrant II" }
      ], answer: "Principal arcsine answer $\\pi/6$; solutions in $[0,2\\pi)$ are $\\pi/6$ and $5\\pi/6$." },
      { problem: "A right triangle has opposite side $5$ and adjacent side $12$. Find the angle $\\theta$ using arctangent and approximate it in degrees.", steps: [
        { do: "Write the tangent ratio", result: "$\\tan\\theta=5/12$", why: "tangent is opposite over adjacent" },
        { do: "Apply arctangent", result: "$\\theta=\\arctan(5/12)$", why: "arctangent recovers the angle from the ratio" },
        { do: "Approximate in radians", result: "$\\theta\\approx0.395$", why: "calculator value" },
        { do: "Convert to degrees", result: "$0.395\\cdot180/\\pi\\approx22.6^\\circ$", why: "multiply radians by $180/\\pi$" },
        { do: "Check the size", result: "less than $45^\\circ$", why: "$5/12<1$, so the angle should be below $\\arctan(1)$" }
      ], answer: "$\\theta=\\arctan(5/12)\\approx0.395$ radians, about $22.6^\\circ$." },
      { problem: "Two unit embedding vectors have cosine similarity $0.8$. Find the angle between them in radians and degrees using $\\arccos(0.8)\\approx0.644$.", steps: [
        { do: "Use the cosine-angle relation", result: "$\\cos\\theta=0.8$", why: "unit-vector dot product equals cosine similarity" },
        { do: "Apply arccosine", result: "$\\theta=\\arccos(0.8)$", why: "recover the angle from its cosine" },
        { do: "Use the given approximation", result: "$\\theta\\approx0.644$ radians", why: "calculator value" },
        { do: "Convert to degrees", result: "$0.644\\cdot180/\\pi\\approx36.9^\\circ$", why: "radian-to-degree conversion" },
        { do: "Interpret the result", result: "the vectors are fairly close", why: "an angle under $45^\\circ$ means high similarity" }
      ], answer: "The angle is about $0.644$ radians, or $36.9^\\circ$." }
    ],
    applications: [
      { title: "Angles from cosine similarity", background: "Embedding models compare vectors by cosine similarity. Inverse cosine converts that similarity into a geometric angle.", numbers: "Similarity $0.5$ gives $\\theta=\\arccos(0.5)=\\pi/3\\approx60^\\circ$." },
      { title: "Robot heading with atan2", background: "Robots and games need a direction from horizontal and vertical movement. $\\operatorname{atan2}$ handles quadrants that plain arctangent can miss.", numbers: "For movement $(x,y)=(-3,3)$, $\\operatorname{atan2}(3,-3)=3\\pi/4\\approx135^\\circ$." },
      { title: "Camera field of view", background: "Computer graphics and vision use inverse tangent to convert sensor geometry into angular field of view.", numbers: "A sensor half-width $18$ mm with focal length $24$ mm gives half-angle $\\arctan(18/24)\\approx36.9^\\circ$, so full FOV is $73.8^\\circ$." },
      { title: "Gradient direction in two dimensions", background: "Optimization often cares about direction as well as size. An arctangent turns a gradient vector into a heading.", numbers: "For gradient $(4,3)$, the uphill angle is $\\arctan(3/4)\\approx0.644$ radians, about $36.9^\\circ$." },
      { title: "Slope angle of a ramp", background: "Civil engineering and robotics both convert rise-over-run ratios into angles to assess steepness.", numbers: "Rise $2$ over run $10$ gives angle $\\arctan(0.2)\\approx11.3^\\circ$." },
      { title: "Phase recovery in signals", background: "Signals often store sine and cosine components separately. Inverse tangent recovers the phase angle from those components.", numbers: "If cosine component is $0$ and sine component is $1$, phase is $\\operatorname{atan2}(1,0)=\\pi/2$." }
    ],
    applicationsClose: "Inverse trig is the bridge back from ratios and similarities to angles you can picture.",
    takeaways: [
      "$\\arcsin$, $\\arccos$, and $\\arctan$ return principal angles, not every possible angle.",
      "Restrictions make the inverse functions single-valued: arcsine and arctangent use central ranges; arccosine uses $[0,\\pi]$.",
      "$\\arcsin$ and $\\arccos$ require inputs in $[-1,1]$; $\\arctan$ accepts all real inputs.",
      "Angles from embeddings, headings, gradients, cameras, and signals all use inverse trig."
    ]
  },

  "math-01-08": {
    id: "math-01-08",
    title: "One-sided limits",
    tagline: "A one-sided limit asks what the function approaches when you walk in from only one direction.",
    connections: {
      buildsOn: ["Limits: definition and computation", "Functions and their graphs", "piecewise functions"],
      leadsTo: ["Continuity", "The Intermediate Value Theorem", "derivatives at corners"],
      usedWith: ["piecewise functions", "absolute value", "step functions", "domain endpoints"]
    },
    motivation:
      "<p>You already know that a two-sided limit asks where a function is heading as $x$ gets close to a point. But sometimes the road looks different depending on which side you approach from.</p>" +
      "<p>One-sided limits let us slow down and ask each direction separately. From the left, what value is the graph approaching? From the right, what value is it approaching? This is exactly what you need at jumps, corners, and endpoints.</p>",
    definition:
      "<p>The notation $\\lim_{x\\to a^-}f(x)=L$ means $f(x)$ approaches $L$ as $x$ approaches $a$ using values less than $a$. The notation $\\lim_{x\\to a^+}f(x)=R$ means $f(x)$ approaches $R$ using values greater than $a$.</p>" +
      "<p>The ordinary two-sided limit exists precisely when the two one-sided limits both exist and agree: $$\\lim_{x\\to a}f(x)=L \\quad\\text{if and only if}\\quad \\lim_{x\\to a^-}f(x)=L \\text{ and } \\lim_{x\\to a^+}f(x)=L.$$ This is not a new trick; it is the two-sided approach split into its two directions.</p>" +
      "<p><b>Assumptions that matter:</b> left-hand limits require domain points to the left of $a$; right-hand limits require domain points to the right of $a$; the value $f(a)$ itself does not decide either one-sided limit; and unequal one-sided limits make the two-sided limit fail to exist.</p>",
    worked: {
      problem: "For $f(x)=\\begin{cases}2x+1,&x<1\\\\5,&x=1\\\\x^2+1,&x>1\\end{cases}$, find the left-hand limit, right-hand limit, and two-sided limit at $x=1$.",
      skills: ["piecewise functions", "left-hand limits", "right-hand limits"],
      strategy: "The formula changes at $1$ — use the branch that matches each direction, then compare the results.",
      steps: [
        { do: "Choose the left branch", result: "$2x+1$", why: "values with $x<1$ approach from the left" },
        { do: "Substitute $x=1$ into the left branch", result: "$2(1)+1=3$", why: "the branch is continuous near the approach" },
        { do: "State the left-hand limit", result: "$\\lim_{x\\to1^-}f(x)=3$", why: "left-side outputs approach 3" },
        { do: "Choose the right branch", result: "$x^2+1$", why: "values with $x>1$ approach from the right" },
        { do: "Substitute $x=1$ into the right branch", result: "$1^2+1=2$", why: "the right branch is continuous near the approach" },
        { do: "State the right-hand limit", result: "$\\lim_{x\\to1^+}f(x)=2$", why: "right-side outputs approach 2" },
        { do: "Compare the one-sided limits", result: "$3\\ne2$", why: "two-sided limits require agreement" }
      ],
      verify: "The actual value $f(1)=5$ is separate; neither side approaches 5, and the two sides do not approach each other.",
      answer: "$\\lim_{x\\to1^-}f(x)=3$, $\\lim_{x\\to1^+}f(x)=2$, so $\\lim_{x\\to1}f(x)$ does not exist.",
      connects: "One-sided limits diagnose jumps by asking each direction to speak for itself."
    },
    practice: [
      { problem: "Let $g(x)=\\begin{cases}x+4,&x<2\\\\7-x,&x\\ge2\\end{cases}$. Find $\\lim_{x\\to2^-}g(x)$, $\\lim_{x\\to2^+}g(x)$, and $\\lim_{x\\to2}g(x)$.", steps: [
        { do: "Choose the left branch", result: "$x+4$", why: "approaching from the left means $x<2$" },
        { do: "Substitute $x=2$ into the left branch", result: "$6$", why: "$2+4=6$" },
        { do: "Choose the right branch", result: "$7-x$", why: "approaching from the right uses $x>2$, which is included in $x\\ge2$" },
        { do: "Substitute $x=2$ into the right branch", result: "$5$", why: "$7-2=5$" },
        { do: "Compare", result: "$6\\ne5$", why: "the two-sided limit needs equal one-sided limits" }
      ], answer: "Left-hand limit $6$, right-hand limit $5$, two-sided limit does not exist." },
      { problem: "Find $\\lim_{x\\to0^-}\\dfrac{|x|}{x}$ and $\\lim_{x\\to0^+}\\dfrac{|x|}{x}$.", steps: [
        { do: "Use the left-side absolute value rule", result: "$|x|=-x$ for $x<0$", why: "negative inputs become positive by negation" },
        { do: "Simplify the left expression", result: "$\\dfrac{|x|}{x}=\\dfrac{-x}{x}=-1$", why: "cancel $x$ for $x\\ne0$" },
        { do: "State the left-hand limit", result: "$-1$", why: "the expression is constantly $-1$ on the left" },
        { do: "Use the right-side absolute value rule", result: "$|x|=x$ for $x>0$", why: "positive inputs stay positive" },
        { do: "Simplify the right expression", result: "$\\dfrac{|x|}{x}=1$", why: "cancel $x$ for $x\\ne0$" },
        { do: "State the right-hand limit", result: "$1$", why: "the expression is constantly $1$ on the right" }
      ], answer: "$\\lim_{x\\to0^-}|x|/x=-1$ and $\\lim_{x\\to0^+}|x|/x=1$." },
      { problem: "Find the one-sided limits of $h(x)=\\dfrac{1}{x-3}$ at $x=3$.", steps: [
        { do: "Look at the denominator from the left", result: "$x-3<0$ and close to $0$", why: "left of 3 means $x$ is slightly smaller than 3" },
        { do: "Evaluate the left behavior", result: "$\\dfrac{1}{x-3}\\to-\\infty$", why: "a positive numerator over a tiny negative denominator decreases without bound" },
        { do: "Look at the denominator from the right", result: "$x-3>0$ and close to $0$", why: "right of 3 means $x$ is slightly larger than 3" },
        { do: "Evaluate the right behavior", result: "$\\dfrac{1}{x-3}\\to\\infty$", why: "a positive numerator over a tiny positive denominator grows without bound" },
        { do: "Compare behaviors", result: "opposite infinite directions", why: "the vertical asymptote has different one-sided behavior" }
      ], answer: "$\\lim_{x\\to3^-}h(x)=-\\infty$ and $\\lim_{x\\to3^+}h(x)=\\infty$." },
      { problem: "For $p(x)=\\begin{cases}ax+1,&x<4\\\\9,&x\\ge4\\end{cases}$, choose $a$ so the two-sided limit at $4$ exists.", steps: [
        { do: "Compute the left-hand limit", result: "$\\lim_{x\\to4^-}p(x)=4a+1$", why: "use the left branch" },
        { do: "Compute the right-hand limit", result: "$\\lim_{x\\to4^+}p(x)=9$", why: "the right branch is constant near 4" },
        { do: "Set one-sided limits equal", result: "$4a+1=9$", why: "two-sided existence requires agreement" },
        { do: "Subtract $1$", result: "$4a=8$", why: "isolate the term with $a$" },
        { do: "Divide by $4$", result: "$a=2$", why: "solve for the parameter" }
      ], answer: "$a=2$." },
      { problem: "A threshold classifier uses $s(x)=0$ for $x<0.7$ and $s(x)=1$ for $x\\ge0.7$. Find the left- and right-hand limits at $0.7$ and interpret the jump.", steps: [
        { do: "Use the left branch", result: "$s(x)=0$", why: "approaching from below means $x<0.7$" },
        { do: "State the left-hand limit", result: "$\\lim_{x\\to0.7^-}s(x)=0$", why: "the output stays 0 on the left" },
        { do: "Use the right branch", result: "$s(x)=1$", why: "approaching from above means $x>0.7$" },
        { do: "State the right-hand limit", result: "$\\lim_{x\\to0.7^+}s(x)=1$", why: "the output stays 1 on the right" },
        { do: "Compare the limits", result: "$0\\ne1$", why: "the score jumps at the threshold" }
      ], answer: "The left-hand limit is $0$, the right-hand limit is $1$, and the classifier jumps from reject to accept at $0.7$." }
    ],
    applications: [
      { title: "Threshold classifiers", background: "Many systems turn a score into a class by crossing a threshold. One-sided limits show what happens just below and just above the cutoff.", numbers: "For threshold $0.8$, scores $0.799$ and $0.801$ can output $0$ and $1$, so the one-sided limits are $0$ and $1$." },
      { title: "ReLU at zero", background: "ReLU became a standard neural-network activation because it is simple and avoids some saturation. Its slope changes abruptly at zero.", numbers: "For $r(x)=\\max(0,x)$, values from the left approach $0$ and values from the right also approach $0$, even though the slopes are $0$ and $1$." },
      { title: "Quantization boundaries", background: "Digital systems round continuous values into bins. At bin boundaries, the output can jump.", numbers: "If $q(x)=0$ for $x<0.5$ and $q(x)=1$ for $x\\ge0.5$, then the left limit at $0.5$ is $0$ and the right limit is $1$." },
      { title: "Database pagination cutoffs", background: "Ranking systems often show items above a cutoff. A tiny score change around the cutoff can alter visibility.", numbers: "If rank score $s=10.00$ is required, $9.999$ is excluded and $10.001$ is included, a one-sided jump in displayed status." },
      { title: "Loss functions with margins", background: "Hinge-style losses use a piecewise formula: no penalty beyond the margin, linear penalty inside it. One-sided analysis checks behavior at the margin.", numbers: "For $L(m)=\\max(0,1-m)$, as $m\\to1^-$, $L\\to0$; as $m\\to1^+$, $L\\to0$, so the value is continuous there." },
      { title: "Control systems with switches", background: "Thermostats and rule-based controllers switch actions at thresholds. One-sided limits separate behavior before and after switching.", numbers: "If heat turns on below $19^\\circ$C and off at or above $19^\\circ$C, the action limit from below is on and from above is off." }
    ],
    applicationsClose: "One-sided limits are how we read behavior at thresholds: not just where the graph is, but how it arrives from each side.",
    takeaways: [
      "$\\lim_{x\\to a^-}$ approaches from inputs less than $a$; $\\lim_{x\\to a^+}$ approaches from inputs greater than $a$.",
      "A two-sided limit exists exactly when the left- and right-hand limits agree.",
      "The actual value $f(a)$ does not determine either one-sided limit.",
      "Jumps, thresholds, endpoints, and piecewise definitions are natural homes for one-sided limits."
    ]
  },

  "math-01-09": {
    id: "math-01-09",
    title: "Continuity",
    tagline: "A continuous function has no surprise at the point: the value equals the destination.",
    connections: {
      buildsOn: ["Limits: definition and computation", "One-sided limits", "Functions and their graphs"],
      leadsTo: ["The Intermediate Value Theorem", "the derivative", "optimization on intervals"],
      usedWith: ["piecewise functions", "polynomials", "rational functions", "composition"]
    },
    motivation:
      "<p>You can often see continuity before you name it: a graph you can trace through a point without lifting your pencil feels continuous there. A hole, jump, or vertical blow-up feels different.</p>" +
      "<p>The precise idea is gentle: as the input approaches $a$, the output should approach the function's actual value at $a$. No mismatch between destination and arrival. This simple agreement is what lets calculus make reliable promises.</p>",
    definition:
      "<p>A function $f$ is <b>continuous at</b> $x=a$ if three conditions hold: $f(a)$ is defined, $\\lim_{x\\to a}f(x)$ exists, and $\\lim_{x\\to a}f(x)=f(a)$. It is continuous on an interval if it is continuous at every point of that interval, using one-sided continuity at endpoints.</p>" +
      "<p>The three conditions come from the idea of no surprise. You need an actual value to arrive at; nearby values must approach one destination; and that destination must equal the actual value. Polynomials are continuous everywhere because sums and products of continuous functions stay continuous. Rational functions are continuous wherever their denominators are not zero.</p>" +
      "<p><b>Assumptions that matter:</b> continuity is checked relative to the domain; endpoints use one-sided limits; changing a function at a single point can break or repair continuity there; and functions built by sums, products, quotients with nonzero denominators, and composition inherit continuity from their parts.</p>",
    worked: {
      problem: "Choose $c$ so $f(x)=\\begin{cases}x^2+1,&x<2\\\\c,&x=2\\\\3x-1,&x>2\\end{cases}$ is continuous at $x=2$, if possible.",
      skills: ["continuity conditions", "one-sided limits", "piecewise functions"],
      strategy: "Continuity needs both sides to approach the same value — compare the side limits before choosing $c$.",
      steps: [
        { do: "Compute the left-hand limit", result: "$\\lim_{x\\to2^-}(x^2+1)=5$", why: "$2^2+1=5$" },
        { do: "Compute the right-hand limit", result: "$\\lim_{x\\to2^+}(3x-1)=5$", why: "$3\\cdot2-1=5$" },
        { do: "Compare the side limits", result: "$5=5$", why: "the two-sided limit exists" },
        { do: "State the two-sided limit", result: "$\\lim_{x\\to2}f(x)=5$", why: "matching one-sided limits give the limit" },
        { do: "Set the function value equal to the limit", result: "$c=5$", why: "continuity requires $f(2)=\\lim_{x\\to2}f(x)$" }
      ],
      verify: "With $c=5$, the left branch, right branch, and actual value all meet at height $5$.",
      answer: "$c=5$ makes $f$ continuous at $x=2$.",
      connects: "Continuity is the agreement between the limiting destination and the assigned function value."
    },
    practice: [
      { problem: "Is $f(x)=\\dfrac{x^2-9}{x-3}$ continuous at $x=3$?", steps: [
        { do: "Check the function value", result: "$f(3)$ is undefined", why: "the denominator is $3-3=0$" },
        { do: "Factor the numerator", result: "$\\dfrac{(x-3)(x+3)}{x-3}$", why: "difference of squares" },
        { do: "Cancel for $x\\ne3$", result: "$x+3$", why: "the limit can ignore the single point" },
        { do: "Compute the limit", result: "$\\lim_{x\\to3}f(x)=6$", why: "substitute into the simplified expression" },
        { do: "Apply the continuity test", result: "not continuous at $3$", why: "$f(3)$ is not defined" }
      ], answer: "No. The limit is $6$, but $f(3)$ is undefined, so the function is not continuous at $3$." },
      { problem: "Define $f(3)$ to repair the hole in $f(x)=\\dfrac{x^2-9}{x-3}$ for $x\\ne3$.", steps: [
        { do: "Factor the numerator", result: "$\\dfrac{(x-3)(x+3)}{x-3}$", why: "rewrite the expression near the hole" },
        { do: "Cancel the common factor", result: "$x+3$", why: "valid for $x\\ne3$" },
        { do: "Take the limit", result: "$\\lim_{x\\to3}f(x)=6$", why: "$3+3=6$" },
        { do: "Set the missing value", result: "$f(3)=6$", why: "continuity needs value equal to limit" },
        { do: "Name the repaired function", result: "continuous at $3$", why: "all three continuity conditions now hold" }
      ], answer: "Define $f(3)=6$." },
      { problem: "For $g(x)=\\begin{cases}2x+k,&x<1\\\\x^2+4,&x\\ge1\\end{cases}$, find $k$ so $g$ is continuous at $1$.", steps: [
        { do: "Compute the left-hand limit", result: "$\\lim_{x\\to1^-}g(x)=2+k$", why: "use the left branch" },
        { do: "Compute the right-hand value", result: "$g(1)=1^2+4=5$", why: "the right branch includes $x=1$" },
        { do: "Compute the right-hand limit", result: "$\\lim_{x\\to1^+}g(x)=5$", why: "the right branch is continuous" },
        { do: "Set the side limits equal", result: "$2+k=5$", why: "continuity requires matching sides" },
        { do: "Solve for $k$", result: "$k=3$", why: "subtract 2" }
      ], answer: "$k=3$." },
      { problem: "Where is $h(x)=\\dfrac{x+1}{x^2-4}$ continuous?", steps: [
        { do: "Identify the function type", result: "rational function", why: "a quotient of polynomials" },
        { do: "Set the denominator equal to zero", result: "$x^2-4=0$", why: "rational functions fail where the denominator is zero" },
        { do: "Factor the denominator", result: "$(x-2)(x+2)=0$", why: "difference of squares" },
        { do: "Solve for excluded points", result: "$x=2$ or $x=-2$", why: "zero-product property" },
        { do: "State continuity set", result: "$(-\\infty,-2)\\cup(-2,2)\\cup(2,\\infty)$", why: "continuous everywhere else" }
      ], answer: "$h$ is continuous for all real $x$ except $x=-2$ and $x=2$." },
      { problem: "The smooth loss $L(w)=(w-2)^2+1$ is continuous. If $w$ moves from $1$ to $3$, what loss values are guaranteed between $L(1)$ and $L(3)$?", steps: [
        { do: "Evaluate $L(1)$", result: "$(1-2)^2+1=2$", why: "substitute the first parameter" },
        { do: "Evaluate $L(3)$", result: "$(3-2)^2+1=2$", why: "substitute the second parameter" },
        { do: "Evaluate the middle", result: "$L(2)=1$", why: "the vertex is at $w=2$" },
        { do: "Identify the range on the interval", result: "$1\\le L(w)\\le2$", why: "the parabola decreases then increases on $[1,3]$" },
        { do: "Connect to continuity", result: "every value from $1$ to $2$ occurs", why: "a continuous curve cannot skip heights between its low and high values" }
      ], answer: "On $[1,3]$, the loss takes every value in $[1,2]$." }
    ],
    applications: [
      { title: "Smooth loss landscapes", background: "Gradient-based optimization relies on losses that change predictably under small parameter changes. Continuity is the first layer of that predictability.", numbers: "For $L(w)=(w-4)^2$, moving from $w=4.00$ to $w=4.01$ changes loss from $0$ to $0.0001$." },
      { title: "ReLU is continuous but kinked", background: "ReLU is popular in neural networks. It has no jump at zero, even though its derivative changes there.", numbers: "$\\lim_{x\\to0^-}\\max(0,x)=0$, $\\lim_{x\\to0^+}\\max(0,x)=0$, and $r(0)=0$." },
      { title: "Step functions are discontinuous", background: "Hard thresholds are easy to implement but can be hard to optimize because tiny input changes can flip the output.", numbers: "For $s(x)=0$ below $0.5$ and $1$ at or above $0.5$, the left limit is $0$ and the right limit is $1$." },
      { title: "Sensor calibration", background: "Physical sensors are usually expected to change continuously with the measured quantity. Sudden jumps often mean a switch or fault.", numbers: "A temperature sensor modeled by $v(T)=0.02T+0.5$ changes from $1.000$ V at $25^\\circ$C to $1.002$ V at $25.1^\\circ$C." },
      { title: "Interpolation", background: "Graphics, animation, and data preprocessing often fill values between samples. Continuity keeps the filled curve from jumping.", numbers: "Linear interpolation from $(0,10)$ to $(4,18)$ gives value $14$ at $x=2$, halfway between the endpoints." },
      { title: "Probability calibration curves", background: "Calibration plots compare predicted probability to observed frequency. A continuous curve means small probability changes lead to small expected frequency changes.", numbers: "If observed rate is modeled by $c(p)=0.9p+0.05$, then $c(0.70)=0.68$ and $c(0.71)=0.689$." }
    ],
    applicationsClose: "Continuity is the no-surprise condition that lets models, sensors, curves, and proofs behave reliably under small changes.",
    takeaways: [
      "Continuity at $a$ requires $f(a)$ defined, $\\lim_{x\\to a}f(x)$ existing, and the two being equal.",
      "Polynomials are continuous everywhere; rational functions are continuous where denominators are nonzero.",
      "A removable hole can be repaired by defining the missing value to equal the limit.",
      "Continuous functions can bend and kink, but they do not jump or tear at the point."
    ]
  },

  "math-01-10": {
    id: "math-01-10",
    title: "The Intermediate Value Theorem",
    tagline: "A continuous path from one height to another must pass through every height in between.",
    connections: {
      buildsOn: ["Continuity", "One-sided limits", "Functions and their graphs"],
      leadsTo: ["root-finding", "the derivative", "optimization on intervals"],
      usedWith: ["closed intervals", "zeros of functions", "bisection", "existence proofs"]
    },
    motivation:
      "<p>Imagine walking up a hill on a continuous trail. If you start at elevation $100$ meters and end at elevation $180$ meters, then at some moment you must have been at $150$ meters. You may not know when, but you know it happened.</p>" +
      "<p>The <b>Intermediate Value Theorem</b> turns that common-sense picture into a precise guarantee. It is one of the first times calculus says, with confidence, that a solution exists even before we know how to compute it.</p>",
    definition:
      "<p>If $f$ is continuous on the closed interval $[a,b]$ and $N$ is any number between $f(a)$ and $f(b)$, then there exists at least one $c$ in $[a,b]$ such that $f(c)=N$. For root-finding, the common special case is: if $f(a)$ and $f(b)$ have opposite signs, then some $c$ in $(a,b)$ satisfies $f(c)=0$.</p>" +
      "<p>Why it is true in the graph picture: a continuous graph cannot jump over a horizontal line. Starting below height $N$ and ending above height $N$ forces the curve to cross the line $y=N$ somewhere between the endpoints. The theorem gives existence, not necessarily uniqueness.</p>" +
      "<p><b>Assumptions that matter:</b> $f$ must be continuous on the whole closed interval $[a,b]$; the target value $N$ must lie between endpoint values; the theorem guarantees at least one point, not exactly one; and a discontinuous function can jump over the target without ever taking it.</p>",
    worked: {
      problem: "Show that $f(x)=x^3-x-1$ has a root in $(1,2)$.",
      skills: ["continuity", "sign changes", "existence proofs"],
      strategy: "We do not need the exact root — show continuity and opposite signs at the endpoints.",
      steps: [
        { do: "Identify the function type", result: "polynomial", why: "sums and powers of $x$ form a polynomial" },
        { do: "State continuity", result: "$f$ is continuous on $[1,2]$", why: "polynomials are continuous everywhere" },
        { do: "Evaluate the left endpoint", result: "$f(1)=1^3-1-1=-1$", why: "substitute $x=1$" },
        { do: "Evaluate the right endpoint", result: "$f(2)=2^3-2-1=5$", why: "substitute $x=2$" },
        { do: "Compare signs", result: "$f(1)<0$ and $f(2)>0$", why: "the endpoint values are on opposite sides of zero" },
        { do: "Apply the Intermediate Value Theorem", result: "some $c\\in(1,2)$ has $f(c)=0$", why: "a continuous function crossing from negative to positive must hit zero" }
      ],
      verify: "The theorem guarantees existence only; it does not claim the root is exactly halfway or that there is only one root.",
      answer: "There is at least one root $c$ in $(1,2)$.",
      connects: "The IVT converts continuity plus endpoint information into a guaranteed in-between value."
    },
    practice: [
      { problem: "Show that $f(x)=x^2-2$ has a zero in $(1,2)$.", steps: [
        { do: "Identify continuity", result: "$f$ is continuous on $[1,2]$", why: "polynomials are continuous" },
        { do: "Evaluate $f(1)$", result: "$1^2-2=-1$", why: "substitute the left endpoint" },
        { do: "Evaluate $f(2)$", result: "$2^2-2=2$", why: "substitute the right endpoint" },
        { do: "Compare signs", result: "$-1<0<2$", why: "zero lies between the endpoint values" },
        { do: "Apply IVT", result: "some $c\\in(1,2)$ satisfies $c^2-2=0$", why: "continuous functions hit intermediate values" }
      ], answer: "A zero exists in $(1,2)$; it is $\\sqrt2$, though IVT only needed to prove existence." },
      { problem: "Show that $g(x)=\\cos x-x$ has a root in $(0,1)$ using $\\cos1\\approx0.540$.", steps: [
        { do: "State continuity", result: "$g$ is continuous on $[0,1]$", why: "cosine and $x$ are continuous, and differences preserve continuity" },
        { do: "Evaluate $g(0)$", result: "$\\cos0-0=1$", why: "$\\cos0=1$" },
        { do: "Evaluate $g(1)$", result: "$\\cos1-1\\approx0.540-1=-0.460$", why: "use the given approximation" },
        { do: "Compare signs", result: "$g(0)>0$ and $g(1)<0$", why: "the function crosses from positive to negative" },
        { do: "Apply IVT", result: "some $c\\in(0,1)$ satisfies $\\cos c-c=0$", why: "zero is between the endpoint values" }
      ], answer: "A root exists in $(0,1)$." },
      { problem: "A continuous temperature function has $T(8)=12^\\circ$C and $T(14)=21^\\circ$C. Prove it reached $18^\\circ$C sometime between 8:00 and 14:00.", steps: [
        { do: "State the interval", result: "$[8,14]$", why: "the times run from 8:00 to 14:00" },
        { do: "State continuity", result: "$T$ is continuous on $[8,14]$", why: "the problem says the temperature function is continuous" },
        { do: "Compare the target to endpoint values", result: "$12<18<21$", why: "$18^\\circ$C lies between the measured values" },
        { do: "Apply IVT", result: "there is some $c\\in[8,14]$ with $T(c)=18$", why: "continuous functions take intermediate values" },
        { do: "Interpret $c$", result: "a time between 8:00 and 14:00", why: "$c$ belongs to the time interval" }
      ], answer: "Yes. At some time between 8:00 and 14:00, the temperature was $18^\\circ$C." },
      { problem: "Explain why IVT does not apply to $f(x)=\\dfrac{1}{x}$ on $[-1,1]$, even though $f(-1)=-1$ and $f(1)=1$.", steps: [
        { do: "Check the endpoint signs", result: "$f(-1)=-1$ and $f(1)=1$", why: "the endpoints do straddle zero" },
        { do: "Check the formula at $0$", result: "$f(0)$ is undefined", why: "division by zero is not allowed" },
        { do: "Assess continuity on the interval", result: "not continuous on $[-1,1]$", why: "the function breaks at $0$" },
        { do: "Compare with IVT assumptions", result: "assumption fails", why: "IVT requires continuity on the whole closed interval" },
        { do: "State what happens", result: "no zero occurs", why: "$1/x$ is never equal to $0$" }
      ], answer: "IVT does not apply because $1/x$ is not continuous on $[-1,1]$; the function jumps through a vertical asymptote and never equals $0$." },
      { problem: "A validation metric is modeled continuously by $M(\\lambda)$ for regularization $\\lambda\\in[0.01,1]$. If $M(0.01)=0.72$ and $M(1)=0.81$, show that some setting has metric $0.78$.", steps: [
        { do: "State continuity", result: "$M$ is continuous on $[0.01,1]$", why: "the model assumption says it changes continuously" },
        { do: "List endpoint values", result: "$M(0.01)=0.72$ and $M(1)=0.81$", why: "given data" },
        { do: "Compare the target", result: "$0.72<0.78<0.81$", why: "the target metric lies between endpoints" },
        { do: "Apply IVT", result: "there is some $\\lambda^\\ast\\in[0.01,1]$ with $M(\\lambda^\\ast)=0.78$", why: "continuous functions hit intermediate values" },
        { do: "Interpret the result", result: "at least one regularization setting reaches $0.78$", why: "the theorem guarantees existence, not a specific value" }
      ], answer: "Some $\\lambda^\\ast\\in[0.01,1]$ has $M(\\lambda^\\ast)=0.78$." }
    ],
    applications: [
      { title: "Bisection root-finding", background: "Bisection is an old and reliable numerical method. It repeatedly halves an interval where a continuous function changes sign.", numbers: "If $f(1)=-1$ and $f(2)=5$, the first midpoint is $1.5$; if $f(1.5)=-0.125$, the root remains in $[1.5,2]$." },
      { title: "Hyperparameter existence arguments", background: "When a validation metric changes continuously with a tuning parameter, IVT can guarantee that a target metric is reached somewhere in a range.", numbers: "Accuracy $0.70$ at $\\lambda=0.001$ and $0.82$ at $\\lambda=0.1$ guarantees some setting with accuracy $0.75$, if continuity holds." },
      { title: "Calibration thresholds", background: "A calibrated score curve can be used to find a threshold for a desired positive rate. Continuity turns endpoint rates into a guarantee.", numbers: "If threshold $0.2$ gives positive rate $0.90$ and threshold $0.8$ gives $0.10$, then some threshold gives rate $0.50$." },
      { title: "Physical simulation", background: "Continuous motion cannot teleport across a wall or target height. IVT formalizes crossing events in simulation and robotics.", numbers: "If a robot's $x$-position is $-2$ meters at $t=0$ and $3$ meters at $t=5$, continuous motion implies some time has $x=0$." },
      { title: "Computer graphics intersections", background: "Ray and curve intersection algorithms often bracket sign changes, then refine. The IVT is the existence guarantee behind the bracket.", numbers: "If a signed distance is $-0.4$ at one sample and $0.2$ at the next, a continuous surface crossing lies between them." },
      { title: "Fairness and operating points", background: "Changing a classification threshold can trade off rates. If rates vary continuously, intermediate operating points are guaranteed.", numbers: "If false positive rate changes from $0.30$ to $0.05$ as threshold rises, then a target FPR $0.10$ occurs at some threshold, assuming continuity." }
    ],
    applicationsClose: "The IVT is a promise of passage: with continuity and endpoint bounds, some in-between input reaches the in-between value.",
    takeaways: [
      "If $f$ is continuous on $[a,b]$, it takes every value between $f(a)$ and $f(b)$.",
      "Opposite signs at the endpoints guarantee at least one zero inside the interval.",
      "The theorem proves existence, not uniqueness or an exact formula for the solution.",
      "Continuity on the whole closed interval is essential; jumps and asymptotes can break the conclusion."
    ]
  }
};
