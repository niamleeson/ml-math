/* =====================================================================
   MODULE 0 — FOUNDATIONS: the math you need before anything else.
   This file is the GOLD STANDARD for lesson style:
     - short sentences, one idea each
     - every symbol defined in plain English BEFORE it is used
     - a worked example with real numbers
     - a real-world application
   Each lesson is an object pushed into window.LESSONS.
   ===================================================================== */
(function () {
const M = "Foundations: Math you need first";
const L = (o) => window.LESSONS.push(Object.assign({ module: M }, o));

/* ---------------------------------------------------------------- */
L({
  id: "fnd-vector",
  title: "Vectors",
  tagline: "A vector is just a list of numbers. That's the whole secret.",
  bigIdea:
    `<p>A <b>vector</b> is an ordered list of numbers.</p>
     <p>That's it. No magic.</p>
     <p>One house can be described by numbers: size, bedrooms, age. Put them in a list. That list is a vector.</p>
     <p>In machine learning, every example (a house, a photo, a user) becomes a vector of numbers. The whole field runs on vectors.</p>`,
  buildup:
    `<p>You already know a single number, like $5$. We call that a <b>scalar</b>.</p>
     <p>A vector stacks several scalars together. We write it standing up (a column):</p>`,
  symbols: [
    { sym: "$x$", desc: "the whole vector. Bold or lower-case letters are common." },
    { sym: "$x_i$", desc: "the $i$-th number inside the vector. The little $i$ is the position." },
    { sym: "$\\mathbb{R}^n$", desc: "the set of all vectors with $n$ real numbers. 'R' = real numbers, 'n' = how many." },
    { sym: "$n$", desc: "the length of the vector (how many numbers it holds). Also called the dimension." }
  ],
  formula: `$$ x = \\begin{bmatrix} x_1 \\\\ x_2 \\\\ \\vdots \\\\ x_n \\end{bmatrix} \\in \\mathbb{R}^n $$`,
  whatItDoes:
    `<p>Read it left to right: "$x$ is a stack of $n$ numbers, $x_1$ down to $x_n$, and it lives in $\\mathbb{R}^n$."</p>
     <p>$\\in$ means "is a member of". So $x \\in \\mathbb{R}^n$ just means "$x$ is one of the $n$-number vectors".</p>`,
  example:
    `<p>Describe one house with 3 numbers: 1500 sq ft, 3 bedrooms, 10 years old.</p>
     <div class="formula-box">$$ x = \\begin{bmatrix} 1500 \\\\ 3 \\\\ 10 \\end{bmatrix} \\in \\mathbb{R}^3 $$</div>
     <p>Here $x_1 = 1500$, $x_2 = 3$, $x_3 = 10$, and $n = 3$.</p>
     <p>A second house is just another vector. A whole dataset is many such vectors.</p>`,
  application:
    `<p>Every input to every ML model is a vector. A 28×28 grayscale digit becomes a vector of 784 pixel values. A user becomes a vector of their actions. Learning to think in vectors is step one.</p>`,
  quiz: {
    q: `A movie is described by [running time = 120, rating = 8.5, year = 1999]. What are $n$, $x_2$, and what does $\\mathbb{R}^n$ mean here?`,
    a: `<p>$n = 3$ (three numbers). $x_2 = 8.5$ (the second entry, the rating). $\\mathbb{R}^3$ = the set of all 3-number vectors, which is where this movie-vector lives.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "fnd-dot",
  title: "The dot product (inner product)",
  tagline: "Multiply two lists, add it all up, get one number. It measures agreement.",
  prereqs: ["fnd-vector"],
  bigIdea:
    `<p>The <b>dot product</b> takes two vectors and returns a single number.</p>
     <p>Recipe: multiply matching entries, then add everything.</p>
     <p>Why care? The result tells you how much two vectors <i>point the same way</i>. Big positive number = they agree. Zero = unrelated. Negative = they disagree.</p>
     <p>This one operation is the heart of almost every model: a prediction is usually a dot product of "weights" and "features".</p>`,
  buildup:
    `<p>You have two vectors of the same length. You want to combine them into one score.</p>
     <p>The natural way: pair them up and multiply, position by position. Then sum.</p>`,
  symbols: [
    { sym: "$x, y$", desc: "two vectors, each with $n$ numbers." },
    { sym: "$x^\\top y$", desc: "the dot product of $x$ and $y$. The little $\\top$ ('transpose') just lays $x$ on its side so the multiply lines up. Also written $x \\cdot y$." },
    { sym: "$\\sum_{i=1}^{n}$", desc: "'add up, for $i$ going from 1 to $n$'. The $\\Sigma$ is a capital Greek S, for Sum." },
    { sym: "$x_i y_i$", desc: "the $i$-th number of $x$ times the $i$-th number of $y$." }
  ],
  formula: `$$ x^\\top y = \\sum_{i=1}^{n} x_i\\, y_i \\;\\in\\; \\mathbb{R} $$`,
  whatItDoes:
    `<p>The $\\sum$ says: walk through every position $i$, multiply $x_i$ by $y_i$, and keep a running total.</p>
     <p>The answer is a plain number (it lives in $\\mathbb{R}$), not a vector.</p>`,
  example:
    `<p>Let $x = [1500, 3, 10]$ be a house. Let $w = [200, 10000, -500]$ be "price weights" (dollars per sq ft, per bedroom, per year of age).</p>
     <ul class="steps">
       <li>Multiply matching entries: $1500\\times200 = 300000$, &nbsp; $3\\times10000 = 30000$, &nbsp; $10\\times(-500) = -5000$.</li>
       <li>Add them: $300000 + 30000 - 5000 = 325000$.</li>
       <li>So $w^\\top x = \\$325{,}000$. That is a price prediction.</li>
     </ul>
     <p>Notice: older house (the $-500$) pushes price <i>down</i>. The negative weight "disagrees" with age.</p>`,
  application:
    `<p>Linear regression, logistic regression, SVMs, and every neuron in a neural net compute a dot product of weights and inputs first, then do something with that number. Master this and half of ML stops being scary.</p>`,
  quiz: {
    q: `Compute the dot product of $[2, 0, 1]$ and $[3, 5, 4]$.`,
    a: `<p>$2\\times3 + 0\\times5 + 1\\times4 = 6 + 0 + 4 = 10$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "fnd-matrix",
  title: "Matrices",
  tagline: "A grid of numbers. Stack many vectors and you get a matrix.",
  prereqs: ["fnd-vector"],
  bigIdea:
    `<p>A <b>matrix</b> is a rectangle of numbers, with rows and columns.</p>
     <p>Think of a spreadsheet. Each row is one example. Each column is one feature.</p>
     <p>A whole dataset of 1000 houses, each with 3 numbers, is a $1000 \\times 3$ matrix.</p>`,
  buildup:
    `<p>One vector describes one thing. But you have many things. Stack their vectors as rows. Now you have a matrix.</p>`,
  symbols: [
    { sym: "$A$", desc: "the matrix. Capital letters are used for matrices." },
    { sym: "$\\mathbb{R}^{m\\times n}$", desc: "all matrices with $m$ rows and $n$ columns." },
    { sym: "$m$", desc: "number of rows (often: number of examples)." },
    { sym: "$n$", desc: "number of columns (often: number of features)." },
    { sym: "$A_{i,j}$", desc: "the number in row $i$, column $j$. Row first, column second." }
  ],
  formula: `$$ A = \\begin{bmatrix} A_{1,1} & \\cdots & A_{1,n} \\\\ \\vdots & \\ddots & \\vdots \\\\ A_{m,1} & \\cdots & A_{m,n} \\end{bmatrix} \\in \\mathbb{R}^{m\\times n} $$`,
  whatItDoes:
    `<p>$A_{2,3}$ means "go to row 2, column 3, read that number". The dots ($\\cdots$, $\\vdots$, $\\ddots$) just mean "and so on" across, down, and diagonally.</p>`,
  example:
    `<p>Three houses, two features each (size, bedrooms):</p>
     <div class="formula-box">$$ A = \\begin{bmatrix} 1500 & 3 \\\\ 900 & 2 \\\\ 2200 & 4 \\end{bmatrix} \\in \\mathbb{R}^{3\\times 2} $$</div>
     <p>$m = 3$ houses, $n = 2$ features. $A_{2,1} = 900$ (second house's size). $A_{3,2} = 4$ (third house's bedrooms).</p>`,
  application:
    `<p>Datasets are matrices (rows = examples, columns = features). Images are matrices of pixels. Neural-network layers are matrices of weights. Almost all ML computation is "matrix in, matrix out".</p>`,
  quiz: {
    q: `In the house matrix above, what is $A_{1,2}$, and what does it mean?`,
    a: `<p>$A_{1,2} = 3$: row 1, column 2 — the first house has 3 bedrooms.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "fnd-matvec",
  title: "Matrix × vector",
  tagline: "Apply the same dot product to every row at once.",
  prereqs: ["fnd-dot", "fnd-matrix"],
  bigIdea:
    `<p>Multiplying a matrix by a vector does one dot product per row.</p>
     <p>So you can score a whole dataset of examples in a single step.</p>
     <p>This is why ML code is fast: one matrix multiply replaces a thousand loops.</p>`,
  buildup:
    `<p>You learned the dot product turns weights + one example into one prediction.</p>
     <p>You have many examples stacked in a matrix. Do the dot product against each row. Collect the answers into a new vector.</p>`,
  symbols: [
    { sym: "$A$", desc: "an $m\\times n$ matrix. Each of its $m$ rows is one example/vector." },
    { sym: "$x$", desc: "a vector with $n$ numbers (e.g. the weights). Length must match the columns of $A$." },
    { sym: "$Ax$", desc: "the result: a vector with $m$ numbers (one score per row)." },
    { sym: "$a_{r,i}^{\\top}$", desc: "row $i$ of $A$, written as a flat vector so it can dot with $x$." }
  ],
  formula: `$$ Ax = \\begin{bmatrix} a_{r,1}^{\\top} x \\\\ \\vdots \\\\ a_{r,m}^{\\top} x \\end{bmatrix} \\in \\mathbb{R}^{m} $$`,
  whatItDoes:
    `<p>Row by row: take row $i$ of $A$, dot it with $x$, write the number in slot $i$ of the answer.</p>
     <p>Rule to remember: an $(m\\times n)$ matrix times an $(n)$ vector gives an $(m)$ vector. The inner $n$'s must match and cancel.</p>`,
  example:
    `<p>Two houses $A=\\begin{bmatrix}1500 & 3\\\\900 & 2\\end{bmatrix}$, price weights $x=\\begin{bmatrix}200\\\\10000\\end{bmatrix}$.</p>
     <ul class="steps">
       <li>Row 1 dot $x$: $1500\\times200 + 3\\times10000 = 300000 + 30000 = 330000$.</li>
       <li>Row 2 dot $x$: $900\\times200 + 2\\times10000 = 180000 + 20000 = 200000$.</li>
       <li>Result: $Ax = \\begin{bmatrix}330000\\\\200000\\end{bmatrix}$ — both prices at once.</li>
     </ul>`,
  application:
    `<p>Predicting on a batch of data, passing inputs through a neural-network layer, rotating 3D points in graphics — all are matrix×vector. GPUs exist mainly to do this operation very fast.</p>`,
  quiz: {
    q: `If $A$ is $5\\times 3$ and $x$ has 3 numbers, how many numbers does $Ax$ have?`,
    a: `<p>5. The $3$'s match and cancel, leaving the row count $m=5$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "fnd-norm",
  title: "Norms (the length of a vector)",
  tagline: "How big is a vector? Norms measure that. They power 'distance' and regularization.",
  prereqs: ["fnd-vector", "fnd-dot"],
  bigIdea:
    `<p>A <b>norm</b> measures the size (length) of a vector — a single non-negative number.</p>
     <p>The most common one is ordinary straight-line length, from the Pythagorean theorem.</p>
     <p>Norms let us say how <i>far apart</i> two vectors are, and how <i>big</i> a model's weights are. Both matter a lot in ML.</p>`,
  buildup:
    `<p>In 2D, the length of an arrow $[a, b]$ is $\\sqrt{a^2+b^2}$ (Pythagoras). Norms generalize that to any number of dimensions.</p>`,
  symbols: [
    { sym: "$\\lVert x \\rVert_2$", desc: "the Euclidean (L2) norm: ordinary straight-line length." },
    { sym: "$\\lVert x \\rVert_1$", desc: "the Manhattan (L1) norm: add up the sizes, like walking city blocks." },
    { sym: "$\\lvert x_i \\rvert$", desc: "the absolute value of $x_i$ (drop the minus sign)." },
    { sym: "$x_i^2$", desc: "$x_i$ squared. Squaring also removes minus signs and punishes big values more." }
  ],
  formula: `$$ \\lVert x \\rVert_2 = \\sqrt{\\sum_{i=1}^{n} x_i^2} \\qquad\\quad \\lVert x \\rVert_1 = \\sum_{i=1}^{n} \\lvert x_i \\rvert $$`,
  whatItDoes:
    `<p>L2: square every entry, add them, take the square root. That is the Pythagorean distance.</p>
     <p>L1: just add up the absolute values. Simpler, and it likes to push small weights all the way to zero (useful for feature selection).</p>`,
  example:
    `<p>Let $x = [3, -4]$.</p>
     <ul class="steps">
       <li>L2: $\\sqrt{3^2 + (-4)^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$.</li>
       <li>L1: $|3| + |-4| = 3 + 4 = 7$.</li>
     </ul>
     <p>Same vector, two different "sizes". The distance between two vectors is the norm of their difference: $\\lVert x - y\\rVert$.</p>`,
  application:
    `<p>L2 distance powers k-means and k-NN. L2 on the weights = <b>Ridge</b> regularization; L1 = <b>LASSO</b>, which zeroes out useless features. Norms are how models avoid getting too "big" and overfitting.</p>`,
  quiz: {
    q: `Find the L2 and L1 norm of $[0, 6, 8]$.`,
    a: `<p>L2 $=\\sqrt{0+36+64}=\\sqrt{100}=10$. L1 $=0+6+8=14$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "fnd-derivative",
  title: "Derivatives (slope)",
  tagline: "How fast does the output change when you nudge the input? That's the derivative.",
  bigIdea:
    `<p>A <b>derivative</b> is a slope: the rate of change of a function.</p>
     <p>It answers: "if I increase the input a tiny bit, how much does the output move, and in which direction?"</p>
     <p>Training a model = changing numbers to make error smaller. Derivatives tell you which way to change them. No derivatives, no learning.</p>`,
  buildup:
    `<p>Picture a curve. Zoom in on one point until the curve looks like a straight line. The steepness of that line is the derivative there.</p>
     <p>Positive slope = going uphill. Negative = downhill. Zero = flat (a peak, a valley, or a plateau).</p>`,
  symbols: [
    { sym: "$f(x)$", desc: "a function: feed in $x$, get out a number." },
    { sym: "$f'(x)$", desc: "the derivative: the slope of $f$ at the point $x$." },
    { sym: "$\\frac{df}{dx}$", desc: "another way to write the same derivative ('change in $f$ per change in $x$')." },
    { sym: "$h$", desc: "a tiny step in $x$. We imagine it shrinking toward 0." }
  ],
  formula: `$$ f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h} $$`,
  whatItDoes:
    `<p>$f(x+h) - f(x)$ is how much the output changed. Divide by $h$ (how much the input changed) to get rise-over-run: a slope.</p>
     <p>$\\lim_{h\\to 0}$ means "let the step shrink to nearly nothing", so you get the slope exactly at the point, not an average over a gap.</p>
     <p>Handy rule: the slope of $x^2$ is $2x$.</p>`,
  example:
    `<p>Let $f(x) = x^2$ (a U-shaped bowl). Its derivative is $f'(x) = 2x$.</p>
     <ul class="steps">
       <li>At $x = 3$: slope $= 2\\times3 = 6$. Steep, going uphill to the right.</li>
       <li>At $x = 0$: slope $= 0$. Flat — this is the bottom of the bowl (the minimum).</li>
       <li>At $x = -2$: slope $= -4$. Going downhill to the right.</li>
     </ul>
     <p>To reach the bottom, step <i>opposite</i> the slope. That single idea is gradient descent.</p>`,
  application:
    `<p>Every model is trained by computing the derivative of its error and stepping downhill. Backpropagation is just the chain rule (next lessons) applied to millions of derivatives at once.</p>`,
  quiz: {
    q: `For $f(x)=x^2$, what is the slope at $x=-5$? Are we going up or down as $x$ increases?`,
    a: `<p>$f'(-5)=2(-5)=-10$. Negative slope means the function is going <i>down</i> as $x$ increases there.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "fnd-gradient",
  title: "The gradient (slope in many directions)",
  tagline: "A derivative for functions with many inputs. It points straight uphill.",
  prereqs: ["fnd-derivative", "fnd-vector"],
  bigIdea:
    `<p>Most ML functions have many inputs (millions of weights), not one.</p>
     <p>The <b>gradient</b> collects the slope in <i>each</i> input direction into one vector.</p>
     <p>Key fact: the gradient points in the direction that makes the output grow fastest. To shrink error, step the opposite way.</p>`,
  buildup:
    `<p>With one input you had a single slope $f'(x)$.</p>
     <p>With inputs $x_1, x_2, \\dots$, ask: "how does the output change if I nudge <i>only</i> $x_1$?" That is a <b>partial derivative</b>, written $\\frac{\\partial f}{\\partial x_1}$. Do it for every input and stack the answers.</p>`,
  symbols: [
    { sym: "$\\nabla f$", desc: "the gradient of $f$ (the upside-down triangle is called 'nabla'). It is a vector." },
    { sym: "$\\frac{\\partial f}{\\partial x_i}$", desc: "the partial derivative: slope in the $x_i$ direction, holding the others fixed. The curly $\\partial$ = 'partial'." },
    { sym: "$x_i$", desc: "the $i$-th input/weight." }
  ],
  formula: `$$ \\nabla f(x) = \\begin{bmatrix} \\dfrac{\\partial f}{\\partial x_1} \\\\[4pt] \\vdots \\\\[2pt] \\dfrac{\\partial f}{\\partial x_n} \\end{bmatrix} $$`,
  whatItDoes:
    `<p>Each slot of the gradient is the slope in one direction. Together they form an arrow pointing toward steepest increase.</p>
     <p>Going downhill (to reduce error) means moving along $-\\nabla f$, the negative gradient.</p>`,
  example:
    `<p>Let $f(x_1, x_2) = x_1^2 + x_2^2$ (a round bowl). Partials: $\\frac{\\partial f}{\\partial x_1} = 2x_1$, $\\frac{\\partial f}{\\partial x_2} = 2x_2$.</p>
     <ul class="steps">
       <li>At the point $(3, 4)$: $\\nabla f = [\\,2\\times3,\\; 2\\times4\\,] = [6, 8]$.</li>
       <li>That arrow points away from the center — straight uphill.</li>
       <li>To go downhill, step toward $-[6,8] = [-6,-8]$, heading back to the bottom at $(0,0)$.</li>
     </ul>`,
  application:
    `<p>Training = "compute gradient of the error, step downhill, repeat." This is gradient descent, the engine behind linear models, SVMs, and every deep neural network.</p>`,
  quiz: {
    q: `For $f(x_1,x_2)=x_1^2+x_2^2$, what is the gradient at $(0,0)$, and what does it tell you?`,
    a: `<p>$\\nabla f = [0,0]$. A zero gradient means you're at a flat spot — here, the minimum of the bowl. Nowhere is downhill, so learning stops.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "fnd-chain",
  title: "The chain rule",
  tagline: "Derivative of a function inside a function: multiply the slopes. This IS backprop.",
  prereqs: ["fnd-derivative"],
  bigIdea:
    `<p>Often a value passes through several steps: $x \\to$ step 1 $\\to$ step 2 $\\to$ output.</p>
     <p>The <b>chain rule</b> says: to get the overall slope, multiply the slope of each step together.</p>
     <p>A neural network is just many steps stacked. The chain rule is exactly how we get the gradient through all of them. Its nickname is "backpropagation".</p>`,
  buildup:
    `<p>Suppose $z$ depends on $y$, and $y$ depends on $x$. If $x$ wiggles, $y$ wiggles, which makes $z$ wiggle.</p>
     <p>How much does $z$ move per unit of $x$? Combine the two rates by multiplying.</p>`,
  symbols: [
    { sym: "$\\frac{dz}{dx}$", desc: "how much output $z$ changes per change in input $x$ (what we want)." },
    { sym: "$\\frac{dz}{dy}$", desc: "how much $z$ changes per change in the middle value $y$." },
    { sym: "$\\frac{dy}{dx}$", desc: "how much $y$ changes per change in $x$." }
  ],
  formula: `$$ \\frac{dz}{dx} = \\frac{dz}{dy} \\cdot \\frac{dy}{dx} $$`,
  whatItDoes:
    `<p>Read it as: "rate of $z$ over $x$ = (rate of $z$ over $y$) times (rate of $y$ over $x$)."</p>
     <p>The middle term $dy$ "cancels" like a fraction — a good memory trick (it is not literally division, but it behaves that way here).</p>`,
  example:
    `<p>Let $y = 3x$ and $z = y^2$. So $z$ depends on $x$ through $y$.</p>
     <ul class="steps">
       <li>Slope of the outer step: $\\frac{dz}{dy} = 2y$.</li>
       <li>Slope of the inner step: $\\frac{dy}{dx} = 3$.</li>
       <li>Multiply: $\\frac{dz}{dx} = 2y \\cdot 3 = 6y = 6(3x) = 18x$.</li>
       <li>Check at $x=1$: $z = (3\\cdot1)^2 = 9$. Slope $18\\times1 = 18$. ✔</li>
     </ul>`,
  application:
    `<p>Backpropagation runs the chain rule backward through every layer of a network, multiplying local slopes, to find how each weight affects the final loss. Without it, deep learning would be impossible.</p>`,
  quiz: {
    q: `If $y = 2x$ and $z = y^3$, use the chain rule to find $\\frac{dz}{dx}$.`,
    a: `<p>$\\frac{dz}{dy}=3y^2$ and $\\frac{dy}{dx}=2$, so $\\frac{dz}{dx}=3y^2\\cdot2=6y^2=6(2x)^2=24x^2$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "fnd-eigen",
  title: "Eigenvalues & eigenvectors",
  tagline: "Special directions a matrix only stretches, never rotates. The skeleton of your data.",
  prereqs: ["fnd-matvec"],
  bigIdea:
    `<p>A matrix usually rotates <i>and</i> stretches a vector when it multiplies it.</p>
     <p>But for a few special directions, the matrix only stretches — it does not change the direction at all.</p>
     <p>Those directions are <b>eigenvectors</b>. The stretch amount is the <b>eigenvalue</b>. They reveal the main axes hidden inside data (this is what PCA uses).</p>`,
  buildup:
    `<p>Multiplying $A$ by $z$ normally gives a vector pointing somewhere new.</p>
     <p>Ask: is there a $z$ where $Az$ points the <i>same</i> way as $z$, just longer or shorter? If yes, $z$ is special.</p>`,
  symbols: [
    { sym: "$A$", desc: "a square matrix ($n\\times n$)." },
    { sym: "$z$", desc: "the eigenvector — the special direction (not the zero vector)." },
    { sym: "$\\lambda$", desc: "the eigenvalue — the stretch factor (Greek 'lambda'). 2 = twice as long, 0.5 = half, negative = flipped." }
  ],
  formula: `$$ A z = \\lambda z $$`,
  whatItDoes:
    `<p>Left side: run $z$ through the matrix. Right side: just scale $z$ by the number $\\lambda$.</p>
     <p>When both sides match, the matrix's effect on $z$ is pure stretching. Same direction in, same direction out.</p>`,
  example:
    `<p>Let $A=\\begin{bmatrix}2&0\\\\0&3\\end{bmatrix}$ and try $z=\\begin{bmatrix}1\\\\0\\end{bmatrix}$.</p>
     <ul class="steps">
       <li>$Az=\\begin{bmatrix}2\\cdot1\\\\3\\cdot0\\end{bmatrix}=\\begin{bmatrix}2\\\\0\\end{bmatrix}$.</li>
       <li>That equals $2\\begin{bmatrix}1\\\\0\\end{bmatrix}$. Same direction, twice as long.</li>
       <li>So $z=[1,0]$ is an eigenvector with eigenvalue $\\lambda = 2$. (Similarly $[0,1]$ has $\\lambda=3$.)</li>
     </ul>`,
  application:
    `<p>PCA finds the eigenvectors of your data's covariance matrix — the directions of greatest spread — and keeps only the top few to compress data. Google's original PageRank was an eigenvector problem too.</p>`,
  quiz: {
    q: `For $A=\\begin{bmatrix}5&0\\\\0&5\\end{bmatrix}$, what does $Az$ do to ANY vector $z$? What is the eigenvalue?`,
    a: `<p>It scales every vector by 5 without turning it. So every direction is an eigenvector, all with eigenvalue $\\lambda=5$.</p>`
  }
});

})();
