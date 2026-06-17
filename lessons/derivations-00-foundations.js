/* =====================================================================
   DERIVATIONS / PROOFS / INTUITION for the Foundations module.
   GOLD STANDARD for the other derivation files.
   Each value is HTML. It answers: WHERE does the formula come from?
   WHY is it true? What is the INTUITION? Show steps, keep sentences short.
   ===================================================================== */
(function () {
Object.assign(window.DERIVATIONS, {

/* ---------------------------------------------------------------- */
"fnd-vector":
  `<p><b>Why a "list of numbers"?</b> A vector is a definition, not a theorem. But the definition is not arbitrary. It captures one honest idea: to describe a thing, list its measurable parts.</p>
   <p><b>Intuition.</b> An arrow in space needs one number per direction. On a flat map: how far east, how far north. That is two numbers, so a 2D vector. Add height and you need three. The pattern never stops: $n$ independent directions need $n$ numbers.</p>
   <p><b>Where it comes from.</b> The vector rules (add them, scale them) are chosen so the algebra matches the geometry of arrows:</p>
   <ul class="steps">
     <li>Two arrows add tip-to-tail. In numbers, that is adding entry by entry: $[1,2]+[3,1]=[4,3]$.</li>
     <li>Stretching an arrow to twice its length doubles every number: $2[1,2]=[2,4]$.</li>
   </ul>
   <p>Because the numbers obey the same rules as the arrows, we can throw away the picture and just compute. That is the whole power of the idea.</p>`,

/* ---------------------------------------------------------------- */
"fnd-dot":
  `<p>The dot product has <b>two faces</b>. The formula $x^\\top y=\\sum_i x_i y_i$ is the <i>algebra</i> face. The intuition comes from its <i>geometry</i> face:</p>
   <div class="formula-box">$$ x^\\top y = \\lVert x\\rVert\\,\\lVert y\\rVert \\cos\\theta $$</div>
   <p>where $\\theta$ is the angle between the two vectors. Let us see why the sum-of-products equals this.</p>
   <p><b>Where the formula comes from (law of cosines).</b> Look at the triangle made by $x$, $y$, and the side $x-y$.</p>
   <ul class="steps">
     <li>The law of cosines says: $\\lVert x-y\\rVert^2 = \\lVert x\\rVert^2 + \\lVert y\\rVert^2 - 2\\lVert x\\rVert\\lVert y\\rVert\\cos\\theta$.</li>
     <li>But $\\lVert x-y\\rVert^2$ is also $\\sum_i (x_i-y_i)^2 = \\sum_i x_i^2 - 2\\sum_i x_i y_i + \\sum_i y_i^2$.</li>
     <li>The $\\sum x_i^2$ is $\\lVert x\\rVert^2$ and $\\sum y_i^2$ is $\\lVert y\\rVert^2$. Those cancel on both sides.</li>
     <li>What's left: $-2\\sum_i x_i y_i = -2\\lVert x\\rVert\\lVert y\\rVert\\cos\\theta$. Divide by $-2$: $\\sum_i x_i y_i = \\lVert x\\rVert\\lVert y\\rVert\\cos\\theta$. ∎</li>
   </ul>
   <p><b>Intuition.</b> $\\cos\\theta$ measures agreement of direction. Same way: $\\cos 0=1$, big positive. Perpendicular: $\\cos 90^\\circ=0$, so the dot product is zero — that is exactly why "dot product = 0" means "unrelated". Opposite: $\\cos180^\\circ=-1$, negative. The sum-of-products is just a shortcut to that angle.</p>`,

/* ---------------------------------------------------------------- */
"fnd-matrix":
  `<p>A matrix is a definition too, but it earns its shape from <b>what we want to do with it</b>: store many vectors, and transform vectors.</p>
   <p><b>Intuition 1 — a table.</b> Stack $m$ example-vectors as rows. You get an $m\\times n$ grid. Nothing deeper than a spreadsheet.</p>
   <p><b>Intuition 2 — a machine.</b> A matrix also <i>acts</i> on a vector and returns a new vector (next lesson). The rows-and-columns layout is chosen precisely so that "matrix times vector" lines up as a clean set of dot products. The notation is built backward from the operation we need.</p>
   <p>So "row $i$, column $j$" is not bureaucracy. Row $i$ picks the example; column $j$ picks the feature. The two indices are the two questions you can ask of a table.</p>`,

/* ---------------------------------------------------------------- */
"fnd-matvec":
  `<p><b>Where the rule comes from.</b> We want one object that applies the <i>same</i> linear combination to many rows at once. Start from what a single dot product does, then stack.</p>
   <ul class="steps">
     <li>One row $a$ scored against weights $x$ is the dot product $a^\\top x = \\sum_i a_i x_i$. One number.</li>
     <li>A matrix $A$ is just many rows $a_{r,1},\\dots,a_{r,m}$ stacked.</li>
     <li>Apply the same $x$ to each row. Collect the $m$ answers into a column. That <i>is</i> the definition $Ax=[\\,a_{r,1}^\\top x,\\dots,a_{r,m}^\\top x\\,]^\\top$.</li>
   </ul>
   <p><b>Why dimensions must match.</b> A dot product needs equal-length lists. So each row of $A$ (length $n$) must match $x$ (length $n$). That is the rule "$(m\\times n)$ times $(n)$": the inner $n$'s touch and must agree; the outer $m$ survives as the answer's length.</p>
   <p><b>Deeper intuition.</b> $Ax$ is also a <i>recipe for mixing the columns of $A$</i>: $x_1$ of column 1, plus $x_2$ of column 2, and so on. Row-view and column-view give the same answer — a useful double meaning that shows up all over linear algebra.</p>`,

/* ---------------------------------------------------------------- */
"fnd-norm":
  `<p><b>The L2 norm is just Pythagoras, repeated.</b></p>
   <ul class="steps">
     <li>In 2D, a vector $[a,b]$ is the hypotenuse of a right triangle with legs $a$ and $b$. Pythagoras: length$^2 = a^2+b^2$, so length $=\\sqrt{a^2+b^2}$.</li>
     <li>In 3D, add a third perpendicular leg $c$. Apply Pythagoras twice and you get $\\sqrt{a^2+b^2+c^2}$.</li>
     <li>Keep going. With $n$ perpendicular directions you get $\\sqrt{\\sum_i x_i^2}$. That is the L2 norm. The square root undoes the squaring so the units stay "length", not "length squared".</li>
   </ul>
   <p><b>Why square the entries?</b> Squaring kills minus signs (length can't be negative) and is smooth, so calculus likes it. Big entries get punished extra hard — which is exactly why L2 (Ridge) keeps weights gently small.</p>
   <p><b>Why the L1 norm is different.</b> L1 adds $|x_i|$ with no squaring. Walk along the grid like city blocks: 3 east + 4 north = 7 blocks, even though the straight-line distance is 5. L1's corners (the absolute-value "V" shape) are what make LASSO push weights all the way to exactly zero, instead of just small.</p>`,

/* ---------------------------------------------------------------- */
"fnd-derivative":
  `<p>The formula $f'(x)=\\lim_{h\\to0}\\frac{f(x+h)-f(x)}{h}$ is literally "rise over run, as the run shrinks to nothing". Let us <b>derive a real slope from it</b> so the limit stops being scary.</p>
   <p><b>Prove the slope of $f(x)=x^2$ is $2x$:</b></p>
   <ul class="steps">
     <li>Rise over run: $\\dfrac{f(x+h)-f(x)}{h}=\\dfrac{(x+h)^2-x^2}{h}$.</li>
     <li>Expand the top: $(x+h)^2 = x^2+2xh+h^2$. Subtract $x^2$: the top is $2xh+h^2$.</li>
     <li>So the ratio is $\\dfrac{2xh+h^2}{h}=2x+h$ (cancel one $h$).</li>
     <li>Now let $h\\to0$. The leftover $h$ vanishes. Slope $=2x$. ∎</li>
   </ul>
   <p><b>Why the limit, not just plug in $h=0$?</b> At $h=0$ the ratio is $\\tfrac{0}{0}$ — meaningless. The trick is to simplify <i>first</i> (cancel the $h$), then take the limit. That is the heart of calculus: get arbitrarily close without dividing by zero.</p>
   <p><b>Intuition.</b> Zoom into any smooth curve far enough and it looks straight. The derivative is the slope of that tiny straight piece. Positive = uphill, negative = downhill, zero = a flat top or bottom.</p>`,

/* ---------------------------------------------------------------- */
"fnd-gradient":
  `<p><b>Why stack the partials into a vector — and why does that vector point uphill?</b> This is the one fact that makes gradient descent work, so it is worth proving.</p>
   <p>Step into direction $u$ (a unit vector). The rate of change along $u$ is the <b>directional derivative</b>. For a smooth $f$ it equals a dot product:</p>
   <div class="formula-box">$$ D_u f = \\nabla f \\cdot u = \\lVert\\nabla f\\rVert\\,\\lVert u\\rVert\\cos\\theta $$</div>
   <ul class="steps">
     <li>This comes from the chain rule: nudging along $u$ nudges each input $x_i$ by $u_i$, and the effects add up as $\\sum_i \\frac{\\partial f}{\\partial x_i}u_i$ — which is exactly $\\nabla f\\cdot u$.</li>
     <li>$u$ is a unit vector, so $\\lVert u\\rVert=1$. The rate is $\\lVert\\nabla f\\rVert\\cos\\theta$, where $\\theta$ is the angle between your step and the gradient.</li>
     <li>To climb fastest, make $\\cos\\theta$ as big as possible. Its max is $1$, at $\\theta=0$ — i.e. step <i>along</i> $\\nabla f$. ∎</li>
   </ul>
   <p><b>So:</b> the gradient points in the steepest-uphill direction, and its length is how steep. To go <i>downhill</i> (shrink error), step the opposite way, $-\\nabla f$. That single line is the training rule of nearly every model.</p>
   <p><b>Intuition.</b> Each partial derivative asks "how much does the output change if I push only this one knob?" Bundle all those answers and you get one arrow that says "push the knobs together <i>this</i> way to climb hardest".</p>`,

/* ---------------------------------------------------------------- */
"fnd-chain":
  `<p>The chain rule $\\frac{dz}{dx}=\\frac{dz}{dy}\\frac{dy}{dx}$ looks like fractions cancelling. That picture is a great memory aid, and it is almost a proof.</p>
   <p><b>Where it comes from.</b> Use small changes. Write $\\Delta$ for "a small change in".</p>
   <ul class="steps">
     <li>A small input change $\\Delta x$ causes a change $\\Delta y \\approx \\frac{dy}{dx}\\,\\Delta x$ (that is what the derivative means).</li>
     <li>That $\\Delta y$ in turn causes $\\Delta z \\approx \\frac{dz}{dy}\\,\\Delta y$.</li>
     <li>Substitute: $\\Delta z \\approx \\frac{dz}{dy}\\cdot\\frac{dy}{dx}\\,\\Delta x$.</li>
     <li>Divide by $\\Delta x$ and shrink it to zero: $\\frac{dz}{dx}=\\frac{dz}{dy}\\frac{dy}{dx}$. ∎</li>
   </ul>
   <p>(The real proof is careful that $\\Delta y$ isn't exactly zero, but the idea above is the honest core.)</p>
   <p><b>Intuition.</b> Rates multiply through a chain. If gear A spins 3× as fast as the crank, and gear B spins 2× as fast as A, then B spins $3\\times2=6$× the crank. Each stage's "amplification" multiplies. A neural network is a long gear-train; backprop multiplies the local rates from the output back to each weight.</p>`,

/* ---------------------------------------------------------------- */
"fnd-eigen":
  `<p>The equation $Az=\\lambda z$ is a <b>question</b>, not a formula you compute blindly: "is there a direction the matrix only stretches?" Here is where it leads and why we care.</p>
   <p><b>How they are found (the idea).</b></p>
   <ul class="steps">
     <li>Rewrite $Az=\\lambda z$ as $Az-\\lambda z=0$, i.e. $(A-\\lambda I)z=0$, where $I$ is the identity matrix.</li>
     <li>For a non-zero $z$ to be squashed to zero by $(A-\\lambda I)$, that matrix must be "degenerate" — its determinant must be $0$: $\\det(A-\\lambda I)=0$.</li>
     <li>That determinant is a polynomial in $\\lambda$. Its roots are the eigenvalues. Plug each back in to find its eigenvector $z$.</li>
   </ul>
   <p><b>Intuition.</b> A general matrix rotates space, so most arrows come out pointing somewhere new. The eigenvectors are the rare "grain of the wood" directions that don't rotate — they only get longer or shorter by the factor $\\lambda$. They are the natural axes the matrix is built around.</p>
   <p><b>Why ML cares.</b> The covariance matrix of a dataset stretches most along the directions of greatest spread. Those directions are its top eigenvectors. PCA keeps them and drops the rest — compressing data while losing the least information. The whole method is "find the eigenvectors, keep the big-$\\lambda$ ones".</p>`

});
})();
