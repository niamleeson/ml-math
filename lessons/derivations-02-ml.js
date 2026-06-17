/* =====================================================================
   DERIVATIONS / PROOFS / INTUITION for the Machine Learning module (CS229).
   Style copied from derivations-00-foundations.js (the gold standard).
   Each value is HTML. It answers: WHERE does the formula come from?
   WHY is it true? What is the INTUITION? Show steps, keep sentences short.
   ===================================================================== */
(function () {
Object.assign(window.DERIVATIONS, {

/* ---------------------------------------------------------------- */
"ml-supervised":
  `<p><b>Why pairs, and why a function?</b> Supervised learning is a setup, not a theorem. But the setup is a careful choice. Let us see what each piece buys us.</p>
   <p><b>Where it comes from.</b> We believe an unseen rule turns inputs into outputs: some true $f$ with $y \\approx f(x)$. We cannot see $f$. We can only see examples it produced.</p>
   <ul class="steps">
     <li>Collect $m$ pairs $(x^{(i)}, y^{(i)})$ that the true rule already answered.</li>
     <li>Guess a rule $h_\\theta$ of our own, controlled by knobs $\\theta$ (the parameters).</li>
     <li>Turn the knobs until $h_\\theta(x^{(i)}) \\approx y^{(i)}$ on the examples we have.</li>
     <li>Bet that a rule which matches the seen pairs will also match unseen ones. That bet is the whole game.</li>
   </ul>
   <p><b>Why this is reasonable.</b> If the world is not random — if similar inputs give similar outputs — then a rule fit to many examples captures the pattern, not the accident. The rest of the module is just better ways to make and check that bet.</p>
   <p><b>Intuition.</b> A child learns "dog" from being shown dogs and told "dog". No definition is given. Enough labeled examples, and the pattern forms on its own. $h_\\theta$ is that formed pattern, written as math.</p>`,

/* ---------------------------------------------------------------- */
"ml-loss":
  `<p><b>Why squared error?</b> The loss $\\tfrac12(y-z)^2$ looks arbitrary. It is not. It falls out of one honest assumption about noise.</p>
   <p><b>The assumption.</b> The truth is the prediction plus random noise: $y = z + \\varepsilon$, where $\\varepsilon$ ('epsilon') is a small wobble. Assume that wobble is Gaussian (a bell curve) centered at $0$. That is the most common, least-surprising noise in nature.</p>
   <p><b>Derive the loss from maximum likelihood.</b></p>
   <ul class="steps">
     <li>A Gaussian says the chance of seeing error $\\varepsilon = y - z$ is proportional to $\\exp\\!\\big(-\\tfrac{(y-z)^2}{2\\sigma^2}\\big)$, where $\\sigma$ is the noise size.</li>
     <li>We want the prediction $z$ that makes the observed $y$ most probable. Maximize that probability.</li>
     <li>Maximizing $\\exp(-\\text{thing})$ means minimizing "thing". So minimize $\\tfrac{(y-z)^2}{2\\sigma^2}$.</li>
     <li>Drop the constant $\\sigma^2$. What is left to minimize is $\\tfrac12(y-z)^2$. That is the squared loss. ∎</li>
   </ul>
   <p><b>Why halve it?</b> Pure convenience. The derivative of $\\tfrac12(y-z)^2$ is $-(y-z)$, with no stray $2$. Cleaner calculus, same minimum.</p>
   <p><b>Intuition.</b> Squaring punishes big misses far more than small ones: a gap of $4$ hurts four times as much as a gap of $2$. So the model works hardest to kill its worst mistakes. And the link to Gaussian noise tells you <i>when</i> squared loss is the right call — when errors are symmetric bell-shaped wobbles.</p>`,

/* ---------------------------------------------------------------- */
"ml-cost":
  `<p><b>Why sum (or average) the per-example losses?</b> The cost $J(\\theta)=\\sum_i L_i$ is a modelling choice. Here is why it is the right one.</p>
   <p><b>Where it comes from.</b> We want one number that says how good the knobs $\\theta$ are over the <i>whole</i> dataset. Each example already has its own loss. We must combine $m$ numbers into one.</p>
   <ul class="steps">
     <li>If examples are independent, their probabilities multiply. Take the log (see the likelihood lesson) and products turn into <i>sums</i>. So a sum of per-example losses is what maximum likelihood hands us.</li>
     <li>Summing treats every example as equally important. No example is special, so none gets extra weight.</li>
     <li>Often we divide by $m$ to get the <i>average</i> loss, $\\tfrac1m\\sum_i L_i$. Same minimizer (dividing by a constant does not move the bottom), but now the number does not balloon just because you collected more data.</li>
   </ul>
   <p><b>Intuition.</b> One loss is one student's test score. The cost is the class average. Lowering the average means most students improved. Training is the search for the $\\theta$ that gives the best class average.</p>
   <p><b>Why this matters.</b> Because $J$ is a sum of smooth pieces, it is itself smooth. That smoothness is exactly what lets gradient descent (next) roll downhill on it.</p>`,

/* ---------------------------------------------------------------- */
"ml-gradient-descent":
  `<p><b>Why does stepping along $-\\nabla J$ actually lower the cost?</b> This is the one fact the whole method rests on. We can prove it.</p>
   <p><b>Setup.</b> $\\nabla J(\\theta)$ is the gradient: the uphill direction of the cost. We move by $\\theta \\leftarrow \\theta - \\alpha\\nabla J$, where $\\alpha$ ('alpha') is a small positive step size.</p>
   <p><b>Proof it decreases (first-order Taylor).</b></p>
   <ul class="steps">
     <li>For a small step $\\Delta\\theta$, the cost changes by about $J(\\theta+\\Delta\\theta) \\approx J(\\theta) + \\nabla J(\\theta)^\\top \\Delta\\theta$. This is the first-order Taylor approximation: near a point, the change is the slope times the step.</li>
     <li>We choose $\\Delta\\theta = -\\alpha\\nabla J$. Plug it in: $J(\\theta - \\alpha\\nabla J) \\approx J(\\theta) - \\alpha\\,\\nabla J^\\top \\nabla J$.</li>
     <li>But $\\nabla J^\\top\\nabla J = \\lVert\\nabla J\\rVert^2 \\ge 0$ — a squared length, never negative.</li>
     <li>So $J(\\theta - \\alpha\\nabla J) \\approx J(\\theta) - \\alpha\\lVert\\nabla J\\rVert^2 < J(\\theta)$ whenever the gradient is non-zero and $\\alpha$ is small enough. The cost went down. ∎</li>
   </ul>
   <p><b>Role of the learning rate $\\alpha$.</b> The proof only holds for <i>small</i> steps, because Taylor's line is only accurate nearby.</p>
   <ul class="steps">
     <li>$\\alpha$ too big: you overshoot the valley, land higher than before, and can bounce out or diverge.</li>
     <li>$\\alpha$ too small: every step is safe but tiny, so training crawls.</li>
     <li>Just right: big enough to make progress, small enough that the downhill promise still holds.</li>
   </ul>
   <p><b>Intuition.</b> Stand in fog on a hillside. Feel which way is steepest down. Take a step that way. Repeat. You reach a valley without ever seeing the whole landscape.</p>`,

/* ---------------------------------------------------------------- */
"ml-linear-regression":
  `<p><b>Where do the normal equations come from?</b> We derive $\\theta=(X^\\top X)^{-1}X^\\top y$ by finding where the cost is flat.</p>
   <p><b>Setup.</b> Stack predictions as $X\\theta$ and truths as $y$. The squared-error cost is $J(\\theta)=\\lVert X\\theta-y\\rVert^2$ — the squared length of the error vector. The bottom of this bowl is where its gradient is zero.</p>
   <p><b>Derivation.</b></p>
   <ul class="steps">
     <li>Expand: $J(\\theta)=(X\\theta-y)^\\top(X\\theta-y) = \\theta^\\top X^\\top X\\theta - 2\\theta^\\top X^\\top y + y^\\top y$.</li>
     <li>Take the gradient with respect to $\\theta$. The first term gives $2X^\\top X\\theta$; the middle gives $-2X^\\top y$; the last has no $\\theta$, so $0$.</li>
     <li>So $\\nabla J(\\theta) = 2X^\\top X\\theta - 2X^\\top y$.</li>
     <li>Set it to zero: $X^\\top X\\theta = X^\\top y$. These are the <b>normal equations</b>.</li>
     <li>Multiply both sides by $(X^\\top X)^{-1}$: $\\theta=(X^\\top X)^{-1}X^\\top y$. ∎</li>
   </ul>
   <p><b>The projection / orthogonality intuition.</b> Predictions $X\\theta$ can only land in the <b>column space</b> of $X$ — the set of all reachable combinations of features. The truth $y$ usually sits off that space. The closest reachable point is the <b>shadow</b> (orthogonal projection) of $y$ onto the column space. "Closest" means the leftover error $X\\theta-y$ is perpendicular to every feature: $X^\\top(X\\theta-y)=0$ — which is exactly the normal equation again. So the formula says: drop $y$ straight down onto what the features can represent.</p>
   <p><b>Why no looping?</b> Squared error is a single smooth bowl with one bottom. The flat-gradient condition is linear in $\\theta$, so algebra jumps straight to the minimum instead of crawling there.</p>`,

/* ---------------------------------------------------------------- */
"ml-likelihood":
  `<p><b>Why maximize the likelihood?</b> And why take its log? Both have clean answers.</p>
   <p><b>Why maximize.</b> The likelihood $L(\\theta)$ is the probability of the data we actually saw, read as a function of the knobs $\\theta$. Different $\\theta$ make the data more or less believable. It is reasonable to trust the $\\theta$ under which what happened was most expected. That is the maximum-likelihood principle: pick the explanation that best predicts reality.</p>
   <p><b>Why the log — and why it does not change the answer.</b></p>
   <ul class="steps">
     <li>Independent examples multiply: $L(\\theta)=\\prod_{i=1}^{m} p(y^{(i)};\\theta)$. A product of $m$ small numbers underflows to zero on a computer and is painful to differentiate.</li>
     <li>The logarithm turns products into sums: $\\log L(\\theta)=\\sum_{i=1}^{m}\\log p(y^{(i)};\\theta)$. Sums are easy to add up and easy to differentiate term by term.</li>
     <li>$\\log$ is strictly increasing: if $a>b$ then $\\log a>\\log b$. So whichever $\\theta$ makes $L$ biggest also makes $\\log L$ biggest. The peak does not move. $\\arg\\max_\\theta L = \\arg\\max_\\theta \\log L$. ∎</li>
   </ul>
   <p><b>Intuition.</b> A detective trusts the story under which the clues are least surprising. Maximum likelihood is that detective. The log is just a change of pen — it rewrites a giant product as a friendly sum without changing the verdict.</p>`,

/* ---------------------------------------------------------------- */
"ml-logistic-regression":
  `<p><b>Where does the sigmoid come from?</b> It is not pulled from a hat. It is the unique function that turns a <i>log-odds score</i> into a probability.</p>
   <p><b>Derivation from log-odds.</b> Let $p=P(y=1\\mid x)$ be the probability of "yes". The <b>odds</b> are $\\tfrac{p}{1-p}$. The <b>log-odds</b> (its logarithm) can be any real number — perfect for a linear score.</p>
   <ul class="steps">
     <li>Set the log-odds equal to the linear score $z=\\theta^\\top x$: $\\;\\log\\dfrac{p}{1-p}=z$.</li>
     <li>Undo the log: $\\dfrac{p}{1-p}=e^{z}$.</li>
     <li>Solve for $p$: $p=e^{z}(1-p)$, so $p(1+e^{z})=e^{z}$, giving $p=\\dfrac{e^{z}}{1+e^{z}}$.</li>
     <li>Divide top and bottom by $e^{z}$: $p=\\dfrac{1}{1+e^{-z}}=g(z)$. That is the sigmoid. ∎</li>
   </ul>
   <p><b>Prove the derivative $g'(z)=g(z)(1-g(z))$.</b></p>
   <ul class="steps">
     <li>$g(z)=(1+e^{-z})^{-1}$. By the chain rule, $g'(z)=-(1+e^{-z})^{-2}\\cdot(-e^{-z})=\\dfrac{e^{-z}}{(1+e^{-z})^2}$.</li>
     <li>Split it: $\\dfrac{e^{-z}}{(1+e^{-z})^2}=\\dfrac{1}{1+e^{-z}}\\cdot\\dfrac{e^{-z}}{1+e^{-z}}$.</li>
     <li>The first factor is $g(z)$. The second is $1-g(z)$ (since $1-\\tfrac{1}{1+e^{-z}}=\\tfrac{e^{-z}}{1+e^{-z}}$).</li>
     <li>So $g'(z)=g(z)\\,(1-g(z))$. ∎</li>
   </ul>
   <p><b>Intuition.</b> The score $z$ is a "confidence in yes" dial running from $-\\infty$ to $+\\infty$. The sigmoid is the smooth ramp that squashes that dial into a $0$-to-$1$ probability. The derivative being $g(1-g)$ means learning is fastest near $0.5$ (most uncertain) and slows to a stop at the confident ends — sensible: there is little to gain by pushing an already-sure prediction.</p>`,

/* ---------------------------------------------------------------- */
"ml-softmax":
  `<p><b>Why exponentiate, then normalize?</b> We want to turn $K$ free scores into $K$ probabilities. Probabilities must be (1) non-negative and (2) sum to $1$. Each step of softmax buys exactly one of those.</p>
   <ul class="steps">
     <li>Scores $\\theta_i^\\top x$ can be negative. Probabilities cannot. Apply $\\exp$: it sends any real number to a positive one. Requirement (1) met.</li>
     <li>The positives need not sum to $1$. Divide each by the total $\\sum_j \\exp(\\theta_j^\\top x)$. Now they sum to $1$. Requirement (2) met.</li>
     <li>Result: $\\phi_i=\\dfrac{\\exp(\\theta_i^\\top x)}{\\sum_j \\exp(\\theta_j^\\top x)}$, the softmax. ∎</li>
   </ul>
   <p><b>Why exp and not, say, squaring?</b> Exp preserves order and turns <i>additive</i> score gaps into <i>multiplicative</i> probability ratios: $\\dfrac{\\phi_i}{\\phi_k}=e^{\\,\\theta_i^\\top x-\\theta_k^\\top x}$. So a fixed lead in score always means the same odds ratio, anywhere on the scale. That matches the log-odds story of logistic regression.</p>
   <p><b>It generalizes the sigmoid.</b> With $K=2$ classes, write the two scores as $z_1$ and $z_2$. Then $\\phi_1=\\dfrac{e^{z_1}}{e^{z_1}+e^{z_2}}=\\dfrac{1}{1+e^{-(z_1-z_2)}}$ — the sigmoid of the score difference. So softmax is sigmoid with more than two doors. ∎</p>
   <p><b>Intuition.</b> Give each class a raw enthusiasm score. Exp makes enthusiasm a positive "vote weight". Dividing by the total shares one pie of probability among the classes. The loudest class gets the biggest slice, but every class keeps a crumb.</p>`,

/* ---------------------------------------------------------------- */
"ml-glm":
  `<p><b>Why one template instead of many models?</b> The GLM form $p(y;\\eta)=b(y)\\exp(\\eta\\,T(y)-a(\\eta))$ is the <b>exponential family</b>. Its payoff: change three small pieces and you recover linear regression, logistic regression, Poisson regression, and more — all with the same training recipe.</p>
   <p><b>The shared recipe.</b></p>
   <ul class="steps">
     <li>Pick a distribution for the output: Gaussian for real numbers, Bernoulli for yes/no, Poisson for counts.</li>
     <li>Write it in the template by choosing $b(y)$, the statistic $T(y)$, and the normalizer $a(\\eta)$.</li>
     <li>Set the natural parameter to the linear score: $\\eta=\\theta^\\top x$. The features now steer the distribution.</li>
     <li>The prediction is the distribution's mean, which comes out as $\\tfrac{d}{d\\eta}a(\\eta)$. Different $a$ gives different "link" between score and output.</li>
   </ul>
   <p><b>Two examples fall straight out.</b></p>
   <ul class="steps">
     <li>Gaussian output $\\Rightarrow$ mean $=\\eta=\\theta^\\top x$. That is plain linear regression.</li>
     <li>Bernoulli output $\\Rightarrow$ mean $=\\dfrac{1}{1+e^{-\\eta}}=g(\\theta^\\top x)$. That is logistic regression — the sigmoid was not a coincidence, it is the Bernoulli's mean function.</li>
   </ul>
   <p><b>Intuition.</b> Think of one engine (a linear score $\\theta^\\top x$) bolted to interchangeable output adapters. Swap the adapter (the distribution) and the same engine drives a different model. You learn one idea, not five.</p>`,

/* ---------------------------------------------------------------- */
"ml-svm":
  `<p><b>Why does "widest margin" become "minimize $\\tfrac12\\lVert w\\rVert^2$"?</b> We derive it. The link is the geometry of distance to a line.</p>
   <p><b>Setup.</b> The boundary is $w^\\top x-b=0$. A point's <b>signed distance</b> to it is $\\dfrac{w^\\top x-b}{\\lVert w\\rVert}$. The label $y\\in\\{+1,-1\\}$ says which side is correct, so $\\dfrac{y(w^\\top x-b)}{\\lVert w\\rVert}$ is the (positive) distance of a correctly-placed point.</p>
   <p><b>Derivation.</b></p>
   <ul class="steps">
     <li>The margin is the distance from the boundary to the nearest point. We can rescale $w$ and $b$ freely (the line $w^\\top x-b=0$ is unchanged by scaling). Use that freedom to fix the nearest points to satisfy $y(w^\\top x-b)=1$.</li>
     <li>Under that scaling the nearest point's distance is $\\dfrac{1}{\\lVert w\\rVert}$. The full street, both sides, has width $\\dfrac{2}{\\lVert w\\rVert}$.</li>
     <li>Widen the street $\\Rightarrow$ make $\\dfrac{2}{\\lVert w\\rVert}$ big $\\Rightarrow$ make $\\lVert w\\rVert$ <i>small</i>.</li>
     <li>Minimizing $\\lVert w\\rVert$ is the same as minimizing $\\tfrac12\\lVert w\\rVert^2$ (squaring is monotonic for positives; the $\\tfrac12$ tidies the derivative). Subject to every point staying on its side, $y^{(i)}(w^\\top x^{(i)}-b)\\ge1$. ∎</li>
   </ul>
   <p><b>Why only support vectors matter.</b> The constraint $y(w^\\top x-b)\\ge1$ is slack for points far from the street — they could move and nothing changes. Only the points pressed against the margin edge (where it equals $1$) hold the boundary in place. Those are the <b>support vectors</b>; delete the rest and the answer is identical.</p>
   <p><b>Intuition.</b> Build the widest possible straight road between two crowds. The road's edges rest on a few people standing closest from each side. Everyone behind them is irrelevant. A wide road leaves the most room for error on new points, so it generalizes well.</p>`,

/* ---------------------------------------------------------------- */
"ml-kernels":
  `<p><b>What is the trick, exactly?</b> To bend a straight boundary, map points to a richer space $\\phi(x)$ where a flat boundary works. The catch: $\\phi(x)$ can be enormous, even infinite. The kernel trick computes the only thing the SVM ever needs — a dot product — without ever building $\\phi(x)$.</p>
   <p><b>Why a dot product is all you need.</b> The trained SVM scores a new point using only dot products between examples, never the raw $\\phi(x)$ alone. So if we can get $\\phi(x)^\\top\\phi(z)$ cheaply, the giant vectors never have to exist. Define $K(x,z)=\\phi(x)^\\top\\phi(z)$ and substitute it everywhere a dot product appears.</p>
   <p><b>A small worked map.</b> Let $\\phi(x)=(x_1^2,\\sqrt2\\,x_1x_2,x_2^2)$ in 2D.</p>
   <ul class="steps">
     <li>Compute the dot product directly: $\\phi(x)^\\top\\phi(z)=x_1^2 z_1^2+2x_1x_2z_1z_2+x_2^2z_2^2$.</li>
     <li>Notice that equals $(x_1z_1+x_2z_2)^2=(x^\\top z)^2$.</li>
     <li>So $K(x,z)=(x^\\top z)^2$ gives the 3D dot product using only the cheap 2D inputs. We got the high-dimensional answer without forming the high-dimensional vector. ∎</li>
   </ul>
   <p><b>The Gaussian kernel as a similarity bump.</b> $K_{\\text{Gauss}}(x,z)=\\exp\\!\\big(-\\tfrac{\\lVert x-z\\rVert^2}{2\\sigma^2}\\big)$ equals $1$ when $x=z$ and fades toward $0$ as they separate. It secretly corresponds to an <i>infinite</i>-dimensional $\\phi$ — impossible to build, trivial to evaluate. The width $\\sigma$ sets how far "similar" reaches.</p>
   <p><b>Intuition.</b> You want the verdict of a vote held in a vast hall, but you never enter the hall. The kernel hands you the tallied result directly. You pay the price of two inputs and receive the power of a million features.</p>`,

/* ---------------------------------------------------------------- */
"ml-gda":
  `<p><b>Where does the classifier come from?</b> Straight from Bayes' rule. We model what each class looks like, then flip the conditional.</p>
   <p><b>Derivation.</b></p>
   <ul class="steps">
     <li>We want $p(y\\mid x)$: the class given the input. Hard to model directly.</li>
     <li>Bayes' rule rewrites it: $p(y\\mid x)=\\dfrac{p(x\\mid y)\\,p(y)}{p(x)}$.</li>
     <li>Now the pieces are easy. $p(x\\mid y)$ is "what class $y$'s points look like" — model it as a bell curve $\\mathcal{N}(\\mu_y,\\Sigma)$. $p(y)$ is "how common class $y$ is" — just count.</li>
     <li>The bottom $p(x)$ does not depend on $y$. So to pick the winning class, compare only the tops $p(x\\mid y)\\,p(y)$. $p(y\\mid x)\\propto p(x\\mid y)\\,p(y)$. ∎</li>
   </ul>
   <p><b>Why a bell curve gives a straight boundary.</b> With a shared covariance $\\Sigma$, the comparison $\\log\\frac{p(x\\mid1)p(1)}{p(x\\mid0)p(0)}$ has its quadratic $x^\\top x$ terms cancel between the two classes, leaving something <i>linear</i> in $x$. So GDA draws a line — and that linear form is exactly logistic regression's. GDA assumes more (full bell curves) to get there.</p>
   <p><b>Intuition.</b> Learn the "shape" of each class as a mound of probability. For a new point, ask which mound it most plausibly fell out of, tilted by which mound is more populous. That is generative classification: model the classes, then let Bayes' rule do the deciding.</p>`,

/* ---------------------------------------------------------------- */
"ml-naive-bayes":
  `<p><b>Where does the product come from?</b> From Bayes' rule plus one bold simplification.</p>
   <p><b>The hard part.</b> Bayes' rule needs $P(x\\mid y)$ — the chance of seeing the <i>whole</i> feature vector $x=(x_1,\\dots,x_n)$ in class $y$. For text with thousands of words, modelling how all words co-occur is hopeless: far too many combinations.</p>
   <p><b>The naive assumption.</b> Pretend the features are independent <i>given the class</i>. Independence means a joint probability factors into a product.</p>
   <ul class="steps">
     <li>In general $P(x_1,\\dots,x_n\\mid y)=P(x_1\\mid y)\\,P(x_2\\mid x_1,y)\\cdots$ — a chain of messy conditionals.</li>
     <li>Assume each feature does not care about the others once the class is fixed: $P(x_i\\mid x_{<i},y)=P(x_i\\mid y)$.</li>
     <li>The chain collapses to a clean product: $P(x\\mid y)=\\prod_{i} P(x_i\\mid y)$. ∎</li>
   </ul>
   <p><b>Then classify with Bayes.</b> $P(y\\mid x)\\propto P(y)\\prod_i P(x_i\\mid y)$. Each $P(x_i\\mid y)$ is a single easy count (how often word $i$ shows up in class $y$). Pick the class with the largest product.</p>
   <p><b>Why it works despite being wrong.</b> Words in real text are <i>not</i> independent. But for <i>ranking</i> classes we only need the right side to win, not exact probabilities. The errors often wash out, so the verdict stays correct even when the numbers are off.</p>
   <p><b>Intuition.</b> Judge an email word by word, as if each word testified alone. "Free" votes spam, "win" votes spam, multiply the votes. Treating witnesses as independent is a lie, but the jury usually reaches the right verdict anyway.</p>`,

/* ---------------------------------------------------------------- */
"ml-trees":
  `<p><b>Why greedy splits, and why this impurity formula?</b> A tree cannot try every possible tree — there are too many. So it grows greedily: at each node pick the single question that most purifies the children right now.</p>
   <p><b>Where Gini comes from.</b> Gini impurity is the chance of mislabeling a random point if you guessed labels by the group's own class proportions.</p>
   <ul class="steps">
     <li>Pick a random point; it is class $c$ with probability $p_c$. Guess its label by the same proportions; you guess $c$ with probability $p_c$.</li>
     <li>You are <i>right</i> with probability $\\sum_c p_c^2$ (guess $c$ and it is $c$).</li>
     <li>So you are <i>wrong</i> with probability $1-\\sum_c p_c^2$. That is the Gini impurity. ∎</li>
   </ul>
   <p>Gini is $0$ when one class fills the group (no mistakes possible) and largest when classes are evenly mixed (most confusion). A good split lowers the weighted Gini of the children below the parent's.</p>
   <p><b>Why trees overfit.</b> Keep splitting and every leaf can shrink to a single training point — Gini $0$ everywhere, perfect training score. But those tiny leaves memorize noise: a deep tree carves a wild, jagged boundary that fits the sample and fails on new data. That is pure high variance. The cures: stop early, limit depth, or prune back.</p>
   <p><b>Intuition.</b> Play twenty questions, always asking whatever splits the suspects best. Stop too late and you have a question for every individual — useless for the next case. The art is asking just enough.</p>`,

/* ---------------------------------------------------------------- */
"ml-ensembles":
  `<p><b>Why does averaging many trees help?</b> Because averaging crushes variance. We can show it.</p>
   <p><b>Bagging reduces variance — the math.</b></p>
   <ul class="steps">
     <li>One deep tree is nearly unbiased but high-variance: retrain on fresh data and its predictions jump around a lot, with variance $\\sigma^2$.</li>
     <li>Average $T$ trees: $\\hat y=\\tfrac1T\\sum_t h_t$. If their errors were independent, the average's variance is $\\dfrac{\\sigma^2}{T}$ — shrinking as you add trees.</li>
     <li>The bias barely changes (each tree was already roughly on-target), but the wobble drops sharply. Lower variance, same bias $\\Rightarrow$ lower error. ∎</li>
   </ul>
   <p><b>Why randomize the trees.</b> Real trees trained on similar data make <i>correlated</i> mistakes, so the variance only falls to $\\rho\\sigma^2+\\tfrac{1-\\rho}{T}\\sigma^2$, where $\\rho$ is their correlation. Random forests fight this: each tree sees a random data subset and a random feature subset, lowering $\\rho$ so the averaging bites harder.</p>
   <p><b>Boosting is different — it fits residuals.</b> Instead of averaging independent trees, boosting adds them in sequence. Each new tree is trained to predict the <i>errors left over</i> by the trees so far. Tree by tree the leftover error shrinks. Boosting mainly attacks <i>bias</i> (it builds up a complex fit from simple stumps), where bagging attacks variance.</p>
   <p><b>Intuition.</b> Bagging: poll many independent guessers and average — the crowd's noise cancels. Boosting: a relay of specialists, each cleaning up what the last one missed.</p>`,

/* ---------------------------------------------------------------- */
"ml-knn":
  `<p><b>Why does a bigger $k$ smooth the boundary?</b> Because a prediction averaged over more neighbours wobbles less. It is the same variance-shrinking math as ensembles.</p>
   <ul class="steps">
     <li>With $k=1$, the prediction copies the single closest point. One noisy or mislabeled neighbour flips the answer. High variance, jagged boundary.</li>
     <li>With larger $k$, the prediction is a <i>vote/average over $k$ points</i>. If each neighbour carries independent noise $\\sigma^2$, the average's noise is about $\\dfrac{\\sigma^2}{k}$ — it falls as $k$ grows.</li>
     <li>So more neighbours $\\Rightarrow$ less variance $\\Rightarrow$ a smoother, calmer boundary. ∎</li>
   </ul>
   <p><b>The catch — rising bias.</b> Big $k$ reaches farther out, pulling in points that may belong to a different region. Their votes blur genuine local structure. So variance falls but bias rises: the boundary gets smooth at the cost of detail. Push $k$ to the extreme ($k=m$) and every prediction is just the overall majority — maximal bias.</p>
   <p><b>Intuition.</b> Ask one nearby person and you might hit an oddball. Ask twenty and the oddballs cancel, but you start polling people from the next neighbourhood whose answers do not really apply to you. $k$ is the dial between "twitchy but local" and "smooth but generic".</p>`,

/* ---------------------------------------------------------------- */
"ml-bias-variance":
  `<p><b>Where does error = bias² + variance + noise come from?</b> We can derive it. It explains the U-shaped test curve completely.</p>
   <p><b>Setup.</b> Truth is $y=f(x)+\\varepsilon$ with noise $\\varepsilon$ of mean $0$ and variance $\\sigma^2$. Train on a random dataset to get a predictor $\\hat f(x)$, which therefore varies from dataset to dataset. Look at the expected squared error at a point $x$.</p>
   <p><b>Derivation.</b></p>
   <ul class="steps">
     <li>Let $\\bar f=\\mathbb{E}[\\hat f]$ be the <i>average</i> prediction over all possible training sets. Add and subtract it: $y-\\hat f=(f-\\bar f)+(\\bar f-\\hat f)+\\varepsilon$.</li>
     <li>Square and take the expectation. The cross terms vanish because $\\varepsilon$ has mean $0$ and $(\\bar f-\\hat f)$ averages to $0$ by definition of $\\bar f$.</li>
     <li>What survives: $\\mathbb{E}[(y-\\hat f)^2]=\\underbrace{(f-\\bar f)^2}_{\\text{bias}^2}+\\underbrace{\\mathbb{E}[(\\bar f-\\hat f)^2]}_{\\text{variance}}+\\underbrace{\\sigma^2}_{\\text{noise}}$. ∎</li>
   </ul>
   <p><b>Reading the three pieces.</b> <b>Bias</b> $=$ how far the average prediction sits from the truth (a too-simple model is consistently off). <b>Variance</b> $=$ how much the prediction jitters across datasets (a too-complex model overreacts). <b>Noise</b> $=\\sigma^2$, irreducible — no model can beat it.</p>
   <p><b>Why the U.</b> As complexity grows, bias² falls (the model can bend to the pattern) but variance rises (it starts chasing noise). Their sum drops, bottoms out, then climbs — a U. The best model sits at the bottom of the U, not at either extreme.</p>
   <p><b>Intuition.</b> A dart thrower. Bias = aiming off-center. Variance = a shaky hand scattering the darts. You want both small, but tightening one often loosens the other.</p>`,

/* ---------------------------------------------------------------- */
"ml-learning-theory":
  `<p><b>Why do more data and simpler models generalize?</b> Here is the gentle version of the argument, no heavy machinery.</p>
   <p><b>One fixed model.</b> Its training error $\\hat\\epsilon(h)$ is an average of $m$ right/wrong coin-flips. By the law of large numbers, an average of $m$ flips sits close to the true rate, and the gap shrinks like $\\dfrac{1}{\\sqrt{m}}$. So for a single model, training error $\\approx$ true error once $m$ is large. More data $\\Rightarrow$ tighter estimate.</p>
   <p><b>The catch — we pick the best of many models.</b></p>
   <ul class="steps">
     <li>We do not test one $h$; we search a whole class and keep the one that looks best on the training set.</li>
     <li>With many candidates, <i>some</i> can look great on the training data by luck alone — like buying many lottery tickets and showing off the winner.</li>
     <li>The <b>union bound</b> says: to keep <i>all</i> candidates honest at once, you need enough data to overcome the number of candidates. Roughly, the safe gap grows with $\\sqrt{\\dfrac{\\log(\\#\\text{models})}{m}}$.</li>
     <li>So a <i>richer</i> hypothesis class (more, or more flexible, candidates) needs <i>more</i> data to trust its training score. A <i>simpler</i> class needs less. ∎ (sketch)</li>
   </ul>
   <p><b>The VC story.</b> For infinite model classes, "number of models" is replaced by the <b>VC dimension</b> — how many points the class can fit in every possible labelling. Higher VC = more flexible = more data needed. Same moral.</p>
   <p><b>Intuition.</b> Try few explanations and a good fit is meaningful. Try millions and one will fit by chance, telling you nothing. Either think less (simpler class) or look harder (more data).</p>`,

/* ---------------------------------------------------------------- */
"ml-kmeans":
  `<p><b>Why do the two steps lower the distortion, and why does the mean show up?</b> Both have proofs, and together they prove k-means converges.</p>
   <p><b>The objective.</b> k-means minimizes the <b>distortion</b> $J=\\sum_i \\lVert x^{(i)}-\\mu_{c^{(i)}}\\rVert^2$ — total squared distance from each point to its centroid. Each step lowers $J$.</p>
   <p><b>Assignment step lowers $J$.</b> Fix the centroids. Each point's contribution is its squared distance to <i>its</i> centroid. Reassigning a point to its <b>nearest</b> centroid can only make that term smaller or equal. No term goes up, so $J$ does not increase. ∎</p>
   <p><b>Update step: prove the mean is the best centre.</b> Fix the assignments. For one cluster with points $x^{(1)},\\dots,x^{(n)}$, find the centre $\\mu$ minimizing $\\sum_j\\lVert x^{(j)}-\\mu\\rVert^2$.</p>
   <ul class="steps">
     <li>Differentiate with respect to $\\mu$: $\\dfrac{d}{d\\mu}\\sum_j\\lVert x^{(j)}-\\mu\\rVert^2=\\sum_j -2(x^{(j)}-\\mu)$.</li>
     <li>Set it to zero: $\\sum_j(x^{(j)}-\\mu)=0$, so $\\sum_j x^{(j)}=n\\mu$.</li>
     <li>Solve: $\\mu=\\dfrac1n\\sum_j x^{(j)}$ — the <b>mean</b>. The mean is exactly the point of least squared distance. ∎</li>
   </ul>
   <p><b>So it converges.</b> Both steps lower $J$ (or hold it), and $J\\ge0$ cannot fall forever. So $J$ settles and the algorithm stops. (It finds a local minimum, not always the global one — which is why we restart from several random seeds.)</p>
   <p><b>Intuition.</b> Two moves, each clearly helpful: send every point to its closest flag, then move each flag to the heart of its crowd. Repeat. Nothing ever gets worse, so it must settle.</p>`,

/* ---------------------------------------------------------------- */
"ml-em":
  `<p><b>Why alternate two steps, and why does it keep improving?</b> EM solves a chicken-and-egg problem, and a short argument shows it never makes the fit worse.</p>
   <p><b>The chicken and egg.</b> If we knew which Gaussian made each point (the labels), fitting the Gaussians would be easy. If we knew the Gaussians, guessing each point's label would be easy. We know neither. So we guess one, improve the other, and loop.</p>
   <ul class="steps">
     <li><b>E-step:</b> with the current Gaussians, compute each point's <i>responsibility</i> $Q_i(z)=P(z\\mid x^{(i)};\\theta)$ — its soft membership in each cluster. This fills in the missing labels probabilistically.</li>
     <li><b>M-step:</b> with those soft labels held fixed, re-fit each Gaussian's centre and spread by a responsibility-weighted average. This is the same "mean minimizes squared distance" idea as k-means, only weighted.</li>
   </ul>
   <p><b>Why the likelihood never decreases.</b> EM builds a lower bound on the log-likelihood that <i>touches</i> it at the current $\\theta$ (the E-step makes the bound tight). The M-step then climbs that bound to its top. Since the bound sits below the true likelihood but met it where we started, climbing the bound can only push the true likelihood up or leave it flat — never down. Repeat, and it climbs to a local maximum. ∎ (sketch)</p>
   <p><b>EM vs k-means.</b> k-means makes a <i>hard</i> choice (each point to one cluster); EM keeps a <i>soft</i> split (a point is 70% A, 30% B). k-means is the limit of EM as the Gaussians get infinitely sharp.</p>
   <p><b>Intuition.</b> Sort blurry photos into two unlabeled piles. Guess the piles, describe what each pile looks like, re-sort by those descriptions, re-describe. Each pass sharpens both the piles and their descriptions, and the overall fit only ever gets better.</p>`,

/* ---------------------------------------------------------------- */
"ml-hierarchical":
  `<p><b>Why build a whole tree instead of picking $k$ up front?</b> Because the right number of clusters is often unknown. A merge-tree (dendrogram) lets you decide <i>after</i> seeing the structure, by cutting at any height.</p>
   <p><b>Where the algorithm comes from.</b> The goal is a nested family of groupings, coarsest to finest. Build it bottom-up.</p>
   <ul class="steps">
     <li>Start with every point as its own cluster ($n$ singletons). The finest possible grouping.</li>
     <li>Find the two <i>closest</i> clusters and merge them. This is the one greedy move that loses the least structure right now.</li>
     <li>Repeat until a single cluster remains. Record the height (distance) of each merge.</li>
     <li>The recorded merges form the dendrogram. Cut it at a chosen height to read off that many clusters. ∎ (construction)</li>
   </ul>
   <p><b>Why linkage matters.</b> "Closest two clusters" needs a rule for distance between <i>groups</i>, not points. <b>Single</b> linkage uses the closest pair (can chain into long straggly clusters). <b>Complete</b> uses the farthest pair (tight, compact clusters). <b>Average</b> uses the mean pairwise distance. <b>Ward</b> merges whichever pair raises total within-cluster variance the least — it most directly keeps clusters tight. The choice changes the shape of the tree, so it is a real modelling decision.</p>
   <p><b>Intuition.</b> Family reunion seating. First everyone sits alone, then the closest pairs pull tables together, then small groups merge into bigger ones, until the whole room is one party. The photo of who joined whom, and when, is the dendrogram — slice it wherever you want a given number of tables.</p>`,

/* ---------------------------------------------------------------- */
"ml-pca":
  `<p><b>Why is the best direction the top eigenvector of $\\Sigma$?</b> We derive it with Lagrange multipliers. This is the heart of PCA.</p>
   <p><b>Setup.</b> $\\Sigma$ is the covariance matrix (it summarizes how features co-vary). A unit direction $u$ ($\\lVert u\\rVert=1$) captures variance $u^\\top\\Sigma u$ — how spread out the data is when projected onto $u$. We want the $u$ that maximizes this spread.</p>
   <p><b>Derivation.</b></p>
   <ul class="steps">
     <li>Maximize $u^\\top\\Sigma u$ subject to $u^\\top u=1$. The constraint keeps $u$ a pure direction (otherwise just stretch $u$ to cheat the spread to infinity).</li>
     <li>Form the Lagrangian: $\\mathcal{L}=u^\\top\\Sigma u-\\lambda(u^\\top u-1)$, where $\\lambda$ ('lambda') is the multiplier enforcing the constraint.</li>
     <li>Differentiate and set to zero: $\\dfrac{\\partial\\mathcal{L}}{\\partial u}=2\\Sigma u-2\\lambda u=0$.</li>
     <li>This rearranges to $\\Sigma u=\\lambda u$. That is the <b>eigenvector equation</b>: the best direction is an eigenvector of $\\Sigma$. ∎</li>
   </ul>
   <p><b>Which eigenvector?</b> Multiply $\\Sigma u=\\lambda u$ on the left by $u^\\top$: the captured variance is $u^\\top\\Sigma u=\\lambda u^\\top u=\\lambda$. So the variance along an eigenvector equals its eigenvalue. To capture the <i>most</i> spread, pick the eigenvector with the <i>largest</i> eigenvalue — the top principal component. The next-best (orthogonal) direction is the second eigenvector, and so on.</p>
   <p><b>Intuition.</b> The data forms a cloud, longer in some directions than others. PCA rotates your coordinate axes to line up with the cloud's longest stretches. Keep those few axes, drop the thin ones, and you have squeezed the data while losing the least.</p>`,

/* ---------------------------------------------------------------- */
"ml-ica":
  `<p><b>Why can we unmix at all, and why must the sources be non-Gaussian?</b> ICA recovers hidden sources from blends — but only under one key condition.</p>
   <p><b>The model.</b> Sources $s$ get blended by an unknown matrix $A$ into recordings $x=As$. We want $W=A^{-1}$ so that $Wx=s$. We know neither $A$ nor $s$ — only $x$.</p>
   <p><b>The lever: independence.</b> The true sources are <i>statistically independent</i> (one voice tells you nothing about the other). A generic mixture, by contrast, looks tangled and dependent. So we search for the unmixing $W$ that makes the outputs $Wx$ as independent as possible. When they snap to independent, they match the real sources (up to reordering and rescaling).</p>
   <p><b>Why Gaussian sources fail — the proof sketch.</b></p>
   <ul class="steps">
     <li>A rotation of independent Gaussians is <i>still</i> independent Gaussians, identically distributed. Spinning the axes leaves the picture unchanged.</li>
     <li>So "make the outputs independent" cannot tell the right rotation from any other — every rotation looks equally valid.</li>
     <li>The unmixing direction is therefore undetermined. ICA stalls. ∎ (sketch)</li>
     <li>Non-Gaussian sources break the symmetry: their lopsided, spiky shapes have a unique unmixing that independence can lock onto.</li>
   </ul>
   <p><b>ICA vs PCA.</b> PCA finds <i>uncorrelated</i> directions of max variance (it only cares up to a rotation). ICA demands the stronger <i>independent</i>, which is exactly what pins down the rotation PCA leaves free.</p>
   <p><b>Intuition.</b> Two voices recorded on two mics. Each mic hears a different blend. Because the voices are independent, only one way of recombining the mics yields two signals that share no information — and that recombination is the separated voices.</p>`,

/* ---------------------------------------------------------------- */
"ml-classification-metrics":
  `<p><b>Why precision and recall trade off, and where does F1 come from?</b></p>
   <p><b>The tradeoff.</b> A classifier outputs a score; a threshold turns it into yes/no. Lower the threshold to catch more true positives — recall $=\\tfrac{TP}{TP+FN}$ rises. But looser thresholds also flag more wrong cases, so false positives climb and precision $=\\tfrac{TP}{TP+FP}$ falls. Tighten the threshold and the opposite happens. You cannot freely push both up at once; gaining on one usually costs the other.</p>
   <p><b>Derive F1 as the harmonic mean.</b> We want one number that is high only when <i>both</i> precision $P$ and recall $R$ are high.</p>
   <ul class="steps">
     <li>The harmonic mean of $P$ and $R$ is $\\dfrac{2}{\\tfrac1P+\\tfrac1R}$.</li>
     <li>Combine the fractions: $\\dfrac{2}{\\tfrac1P+\\tfrac1R}=\\dfrac{2PR}{P+R}$. That is F1.</li>
     <li>Substitute $P=\\tfrac{TP}{TP+FP}$ and $R=\\tfrac{TP}{TP+FN}$ and simplify to get $\\text{F1}=\\dfrac{2\\,TP}{2\\,TP+FP+FN}$. ∎</li>
   </ul>
   <p><b>Why harmonic, not plain average?</b> The harmonic mean is dragged toward the <i>smaller</i> number. If precision is $1.0$ but recall is $0.0$, the plain average is a flattering $0.5$, but F1 is $\\dfrac{2(1)(0)}{1+0}=0$. So F1 refuses to reward a classifier that aces one metric by tanking the other. It punishes imbalance.</p>
   <p><b>Intuition.</b> Precision asks "when I shout 'yes', am I right?" Recall asks "did I catch all the real yeses?" F1 is a strict referee that gives a good grade only when you are honest <i>and</i> thorough.</p>`,

/* ---------------------------------------------------------------- */
"ml-roc-auc":
  `<p><b>What does the area under the ROC curve actually mean?</b> A clean fact: AUC is the probability that a random positive is scored higher than a random negative.</p>
   <p><b>Building the curve.</b> Slide the threshold from strict to loose. At each setting, plot the true-positive rate $\\text{TPR}=\\tfrac{TP}{TP+FN}$ (up) against the false-positive rate $\\text{FPR}=\\tfrac{FP}{FP+TN}$ (right). Strict $\\Rightarrow$ bottom-left (few of either). Loose $\\Rightarrow$ top-right (many of both). The curve traces every tradeoff in between.</p>
   <p><b>Why AUC = P(random positive outranks random negative).</b></p>
   <ul class="steps">
     <li>As the threshold drops past a score, whatever example has that score gets newly flagged "yes".</li>
     <li>If it is a true positive, the curve steps <i>up</i> (TPR rises). If a negative, it steps <i>right</i> (FPR rises).</li>
     <li>Area accumulates only on the up-steps that happen to the <i>left</i> of a right-step — i.e. when a positive's score outranks a negative's.</li>
     <li>Summing that area counts exactly the fraction of positive-negative pairs where the positive scores higher. That fraction <i>is</i> $P(\\text{score}_+ > \\text{score}_-)$. ∎ (sketch)</li>
   </ul>
   <p><b>Reading the number.</b> AUC $=1.0$: every positive outranks every negative — perfect ranking. AUC $=0.5$: a positive beats a negative only half the time — pure coin flip, the diagonal line. Below $0.5$: the model is worse than random (and could be flipped).</p>
   <p><b>Intuition.</b> Pull one real "yes" and one real "no" at random. AUC is how often the model gives the "yes" the higher score. It judges <i>ranking quality</i> without ever committing to a single threshold.</p>`,

/* ---------------------------------------------------------------- */
"ml-regression-metrics":
  `<p><b>Where does $R^2=1-\\tfrac{SS_{res}}{SS_{tot}}$ come from?</b> It is built to read as "fraction of variance the model explains".</p>
   <p><b>The two baselines.</b></p>
   <ul class="steps">
     <li>$SS_{tot}=\\sum_i(y^{(i)}-\\bar y)^2$ is the spread of $y$ around its mean $\\bar y$. It is the error of the dumbest honest model: "always predict the average". This is the total variation to be explained.</li>
     <li>$SS_{res}=\\sum_i(y^{(i)}-\\hat y^{(i)})^2$ is the leftover error <i>after</i> your model. It is the variation your model failed to capture.</li>
   </ul>
   <p><b>Derivation.</b></p>
   <ul class="steps">
     <li>"Variation explained" = total minus leftover = $SS_{tot}-SS_{res}$.</li>
     <li>As a fraction of the total: $R^2=\\dfrac{SS_{tot}-SS_{res}}{SS_{tot}}=1-\\dfrac{SS_{res}}{SS_{tot}}$. ∎</li>
   </ul>
   <p><b>Reading it.</b> $R^2=1$: $SS_{res}=0$, the model nails every point. $R^2=0$: $SS_{res}=SS_{tot}$, the model is no better than guessing the mean. Negative $R^2$ is possible too — a model worse than the flat average line.</p>
   <p><b>Intuition.</b> Start with all the wobble in $y$. Ask how much of that wobble your predictions account for. $R^2$ is that share. RMSE, by contrast, just reports the typical miss in real units — easy to tell a stakeholder "off by about $20$k on average".</p>`,

/* ---------------------------------------------------------------- */
"ml-regularization":
  `<p><b>Why penalize big weights, and why does L1 zero them out while L2 only shrinks?</b> Two penalties, two different geometries.</p>
   <p><b>Why a penalty at all.</b> Overfitting shows up as huge, see-sawing weights that chase noise. Add $\\lambda\\lVert\\theta\\rVert$ to the cost and big weights now cost something. The model must <i>trade</i> fitting the data against keeping weights small. Bigger $\\lambda$ leans toward small, simple weights (more bias, less variance); smaller $\\lambda$ leans toward fitting (less bias, more variance).</p>
   <p><b>Why L2 (Ridge) shrinks smoothly.</b></p>
   <ul class="steps">
     <li>The L2 penalty is $\\lambda\\sum_j\\theta_j^2$. Its gradient is $2\\lambda\\theta_j$ — proportional to the weight itself.</li>
     <li>So each step pulls every weight toward $0$ by a fraction of its size. Big weights get pulled hard, small ones gently.</li>
     <li>The pull fades to nothing as $\\theta_j\\to0$, so weights shrink close to zero but rarely land <i>exactly</i> on it. ∎</li>
   </ul>
   <p><b>Why L1 (LASSO) produces exact zeros.</b></p>
   <ul class="steps">
     <li>The L1 penalty is $\\lambda\\sum_j|\\theta_j|$. Its gradient is $\\lambda\\cdot\\text{sign}(\\theta_j)$ — a <i>constant</i> push of size $\\lambda$, regardless of how small the weight is.</li>
     <li>That steady push keeps driving a weak weight all the way to $0$ and pins it there (the $|\\theta|$ "corner" at zero is a sticky point).</li>
     <li>So L1 sets unhelpful weights to exactly $0$, dropping those features. That is automatic feature selection. ∎</li>
   </ul>
   <p><b>The geometric picture.</b> L2's penalty region is a round ball; the fit usually touches it off-axis, so all weights stay nonzero but small. L1's region is a diamond with sharp corners <i>on</i> the axes; the fit tends to touch a corner, where some coordinates are exactly $0$.</p>
   <p><b>Why cross-validation picks $\\lambda$.</b> You cannot read the right $\\lambda$ off the training error (more fit always looks better there). k-fold CV holds out part of the data, trains on the rest, and rotates — giving an honest estimate of error on <i>unseen</i> data for each $\\lambda$. Pick the $\\lambda$ with the best held-out score.</p>
   <p><b>Intuition.</b> The penalty is a tax on complexity. L2 taxes proportionally, so it trims everyone a little. L1 taxes at a flat rate that small earners cannot afford, so it forces the weakest features out of business entirely.</p>`

});
})();
