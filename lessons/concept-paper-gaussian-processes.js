/* Paper lesson — Gaussian Processes for Machine Learning (Rasmussen & Williams, MIT Press, 2006).
   Grounded from the official book (gaussianprocess.org/gpml), Chapter 2 "Regression":
   noise model eqs (2.1)-(2.2); function-space predictive mean eq (2.25) and variance eq (2.26);
   linear-predictor form eq (2.27); squared-exponential (RBF) covariance eq (2.31); Algorithm 2.1
   (Cholesky GPR); lengthscale ablation Figure 2.5.
   Track A (primitive, NumPy): build GP regression from scratch (RBF kernel + predictive mean/cov),
   verify it matches sklearn.gaussian_process.GaussianProcessRegressor on a toy 1-D problem.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-gaussian-processes". */
(function () {
  window.LESSONS.push({
    id: "paper-gaussian-processes",
    title: "Gaussian Processes — Gaussian Processes for Machine Learning (2006)",
    tagline: "A distribution over functions: every prediction arrives with an honest error bar, computed in closed form from a kernel.",
    module: "Papers · Classical ML",
    track: "primitive",

    paper: {
      authors: "Carl Edward Rasmussen, Christopher K. I. Williams",
      org: "Max Planck Institute for Biological Cybernetics / University of Edinburgh",
      year: 2006,
      venue: "The MIT Press (book), ISBN 0-262-18253-X",
      citations: "",
      arxiv: "",
      url: "http://gaussianprocess.org/gpml/",
      code: "http://gaussianprocess.org/gpml/code/"
    },

    conceptLink: "cls-gaussian-process",
    partOf: [],
    prereqs: ["cls-gaussian-process", "ml-linear-regression", "prob-normal", "ml-pca"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> Ordinary regression fits one curve and reports one number per input. But in many
       settings &mdash; a sensor reading, a drug-dose response, a slow-to-evaluate simulation &mdash; you also
       need to know <i>how sure</i> the model is. A point estimate with no error bar can be confidently wrong
       exactly where you have no data.</p>
       <p><b>What was incomplete before.</b> The book frames supervised learning as inferring the conditional
       distribution of targets given inputs (Section 2.1). The Bayesian linear model
       $f(\\mathbf{x})=\\mathbf{x}^\\top\\mathbf{w}$, $y=f(\\mathbf{x})+\\varepsilon$ (eq. 2.1) does give a full
       predictive distribution, but its "main drawback is that it only allows a limited flexibility; if the
       relationship between input and output cannot reasonably be approximated by a linear function, the model
       will give poor predictions" (Section 2.1). Projecting inputs into a fixed high-dimensional
       <b>feature space</b> $\\boldsymbol{\\phi}(\\mathbf{x})$ adds flexibility, but then you must <i>choose</i>
       the basis functions and pay for the high-dimensional algebra.</p>`,

    contribution:
      `<p>The book consolidates the <b>Gaussian process (GP)</b> view of regression and classification. For
       regression (Chapter 2) the contributions you will implement here are:</p>
       <ul>
         <li><b>The function-space view.</b> Instead of choosing weights or basis functions, place a prior
         <i>directly over functions</i>. A GP is "a distribution over functions, and inference taking place
         directly in the space of functions" (Section 2). It is fully specified by a mean function (taken to be
         zero) and a <b>covariance function</b> (kernel) $k(\\mathbf{x},\\mathbf{x}')$.</li>
         <li><b>Closed-form predictive mean and variance.</b> Conditioning the joint Gaussian on the observed
         data gives the predictive distribution at any test point as a Gaussian with a mean (eq. 2.25) and a
         variance (eq. 2.26) &mdash; no iterative training, just linear algebra on the kernel matrix.</li>
         <li><b>The kernel trick made the object of interest.</b> Because everything enters through inner
         products $\\boldsymbol{\\phi}(\\mathbf{x})^\\top\\Sigma_p\\boldsymbol{\\phi}(\\mathbf{x}')$, you can work
         with the kernel and never form the (possibly infinite) feature vectors &mdash; "this is sometimes
         called the <i>kernel trick</i>" (Section 2.1.2).</li>
       </ul>`,

    whyItMattered:
      `<p>This book is the standard reference for GP regression and classification; it received the 2009 DeGroot
       Prize from the International Society for Bayesian Analysis. GPs became the workhorse for problems where
       <b>calibrated uncertainty</b> matters: Bayesian optimization (deciding which expensive experiment to run
       next), geostatistics / kriging, robot dynamics, and time-series interpolation. The same predictive
       equations you build here underlie modern libraries (scikit-learn's <code>GaussianProcessRegressor</code>,
       GPyTorch). The kernel-and-uncertainty mindset also connects to support-vector machines and to the
       infinite-width limit of neural networks.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely (all in Chapter 2, "Regression"):</b></p>
       <ul>
         <li><b>Section 2.1</b> &mdash; the weight-space (Bayesian linear) view and the kernel trick. Sets up why
         we move to functions.</li>
         <li><b>Section 2.2 ("Function-space View")</b> &mdash; the heart of it. The compact-notation predictive
         <b>mean eq. (2.25)</b> and <b>variance eq. (2.26)</b>, and the "linear predictor" form eq. (2.27).</li>
         <li><b>Algorithm 2.1</b> (the boxed pseudocode) &mdash; the practical recipe using a Cholesky
         factorization instead of an explicit matrix inverse.</li>
         <li><b>Section 2.3 and Figure 2.5</b> &mdash; the squared-exponential kernel eq. (2.31) and the effect of
         varying the length-scale $\\ell$ (the ablation you will reproduce).</li>
       </ul>
       <p><b>Skim:</b> Section 2.4 (decision theory for picking a point prediction) and Section 2.6 (theoretical
       analysis). Hyperparameter <i>learning</i> by marginal likelihood is Chapter 5 &mdash; here we hold the
       kernel fixed.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> You will fit a GP to six noisy points from a smooth curve and predict on a
       dense grid. Two questions: (1) Where will the $\\pm 2\\sigma$ uncertainty band be <i>narrowest</i> &mdash;
       near a data point, in a gap between data points, or far beyond all the data? (2) If you <i>shrink</i> the
       kernel length-scale $\\ell$ (make the function able to wiggle faster), will the uncertainty between data
       points grow or shrink? Write your guesses, then check the worked numbers and the CODEVIZ charts.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Using only NumPy, write GP regression from scratch:</p>
       <ul>
         <li><code># TODO: rbf(a, b) = sigma_f2 * exp(-(a-b)**2 / (2*l*l))</code> &mdash; the squared-exponential
         (RBF) kernel for two scalar inputs.</li>
         <li><code># TODO: K = rbf(Xtrain, Xtrain)</code> then <code>A = K + sigma_n2 * I</code> &mdash; the
         $n\\times n$ kernel matrix with noise added to the diagonal.</li>
         <li><code># TODO: alpha = solve(A, ytrain)</code> &mdash; this is $(K+\\sigma_n^2 I)^{-1}\\mathbf{y}$.</li>
         <li><code># TODO: mean = k_star @ alpha</code> &mdash; the predictive mean, eq. (2.25).</li>
         <li><code># TODO: var = k(x*,x*) - k_star @ inv(A) @ k_star</code> &mdash; the predictive variance, eq. (2.26).</li>
       </ul>
       <p>The CODE cell is the full reference, including the check that your mean and standard deviation match
       <code>sklearn.gaussian_process.GaussianProcessRegressor</code> to machine precision &mdash; that passing
       check is the proof your formulas are exactly the textbook's.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>A GP says: the function values at any finite set of inputs are jointly Gaussian. We never write down a
       formula for the function; we only specify how correlated its values at two inputs are, through a
       <b>kernel</b> $k(\\mathbf{x},\\mathbf{x}')$. Nearby inputs get high correlation, so the function is forced
       to vary smoothly.</p>
       <ol>
         <li><b>Pick the kernel.</b> The squared-exponential (a.k.a. RBF, radial basis function) kernel
         $k(x,x')=\\sigma_f^2\\exp(-\\tfrac{1}{2\\ell^2}(x-x')^2)$ (eq. 2.31) makes the correlation fall off
         smoothly with distance. The <b>length-scale</b> $\\ell$ sets how far one point's influence reaches; the
         <b>signal variance</b> $\\sigma_f^2$ sets the overall vertical spread.</li>
         <li><b>Build the training covariance.</b> Fill the $n\\times n$ matrix $K$ with $K_{ij}=k(x_i,x_j)$.
         Add the observation noise on the diagonal: $K+\\sigma_n^2 I$. The noise comes from the model
         $y=f(x)+\\varepsilon$, $\\varepsilon\\sim\\mathcal{N}(0,\\sigma_n^2)$ (eqs. 2.1&ndash;2.2): we observe
         the function plus independent Gaussian noise.</li>
         <li><b>Solve once.</b> Compute $\\boldsymbol\\alpha=(K+\\sigma_n^2 I)^{-1}\\mathbf{y}$. This single solve
         is the whole "training" cost.</li>
         <li><b>Predict the mean.</b> At a test input $\\mathbf{x}_*$, form the vector of train-to-test
         covariances $\\mathbf{k}_*$ where $(\\mathbf{k}_*)_i=k(x_i,\\mathbf{x}_*)$. The predictive mean is
         $\\bar f_*=\\mathbf{k}_*^\\top\\boldsymbol\\alpha$ &mdash; a weighted blend of the training targets, the
         weights being how correlated each training point is with the test point (eq. 2.25 / 2.27).</li>
         <li><b>Predict the variance.</b> $\\mathbb{V}[f_*]=k(\\mathbf{x}_*,\\mathbf{x}_*)-\\mathbf{k}_*^\\top
         (K+\\sigma_n^2 I)^{-1}\\mathbf{k}_*$ (eq. 2.26): the prior variance $k(\\mathbf{x}_*,\\mathbf{x}_*)$
         <i>minus</i> what the data tells us. Near data, $\\mathbf{k}_*$ is large and the subtracted term is big,
         so the variance is small. Far from data, $\\mathbf{k}_*\\to 0$ and the variance returns to the prior.</li>
       </ol>
       <p>Notice (Section 2.2): the variance in eq. (2.26) depends only on the input locations, not on the
       observed targets $\\mathbf{y}$ &mdash; a property of the Gaussian. To predict <i>noisy</i> targets $y_*$
       rather than the latent $f_*$, add $\\sigma_n^2$ to the variance (Algorithm 2.1 note).</p>`,

    architecture:
      `<p>A GP is not a layered network &mdash; it is a <b>probabilistic pipeline</b> built around one
       covariance function. The structure (Section 2.2, graphical model Figure 2.3):</p>
       <ul>
         <li><b>Inputs layer.</b> Each input $\\mathbf{x}_i$ (and each test input $\\mathbf{x}_*$) sits at the
         bottom. Inputs are observed; they index the random variables.</li>
         <li><b>Latent Gaussian field.</b> Above each input is a latent function value $f_i=f(\\mathbf{x}_i)$.
         These are unobserved random variables. The GP prior makes <i>every finite collection</i> of them
         jointly Gaussian, with covariances set entirely by the kernel: $\\operatorname{cov}(f_p,f_q)=k(\\mathbf{x}_p,\\mathbf{x}_q)$.
         The kernel (eq. 2.31) is the single shared component that wires every node to every other node.</li>
         <li><b>Observations layer.</b> Each observed target $y_i=f_i+\\varepsilon_i$ hangs off its latent
         $f_i$ through independent Gaussian noise $\\varepsilon_i\\sim\\mathcal{N}(0,\\sigma_n^2)$ (eqs. 2.1&ndash;2.2).
         Given $f_i$, the observation $y_i$ is conditionally independent of everything else &mdash; noise enters
         only on the diagonal, $K+\\sigma_n^2 I$ (eq. 2.20).</li>
       </ul>
       <p><b>Data flow (no iterative training):</b></p>
       <ol>
         <li><b>Prior assembly.</b> The kernel populates the joint covariance block matrix in eq. (2.21),
         coupling training targets $\\mathbf{y}$ and test latents $\\mathbf{f}_*$.</li>
         <li><b>Conditioning = "training".</b> One Gaussian-conditioning step (a single linear solve against
         $K+\\sigma_n^2 I$, done via a Cholesky factor) turns the prior into the posterior (eqs. 2.23&ndash;2.24).
         There are no weights to learn and no gradient descent &mdash; the cost is the $O(n^3)$ Cholesky.</li>
         <li><b>Prediction.</b> Each test point flows through the same kernel to get its covariance vector
         $\\mathbf{k}_*$, then a dot product yields the mean (eq. 2.25) and a quadratic form yields the variance
         (eq. 2.26).</li>
         <li><b>Hyperparameter loop (optional, Chapter 5).</b> The kernel's $(\\ell,\\sigma_f,\\sigma_n)$ are
         tuned by maximizing the log marginal likelihood (eq. 2.30) &mdash; the only "training" the model does,
         and it sits outside the prediction path.</li>
       </ol>
       <p>So the "architecture" is: <i>kernel &rarr; joint Gaussian (eq. 2.21) &rarr; condition on data
       (eqs. 2.23&ndash;2.24) &rarr; mean + variance per test point</i>. Algorithm 2.1 (in the
       <code>recipe</code> field) is the numerically careful Cholesky implementation of this flow.</p>`,

    symbols: [
      { sym: "$\\mathbf{x}, \\mathbf{x}'$", desc: "two input points (covariates). In our 1-D toy they are single numbers; the kernel measures how correlated the function's values at them are." },
      { sym: "$\\mathbf{x}_*$", desc: "a test input — the new point where we want a prediction. The star subscript always marks the test side." },
      { sym: "$y$", desc: "an observed target: the true function value plus noise, $y=f(\\mathbf{x})+\\varepsilon$ (eq. 2.1). $\\mathbf{y}$ is the column vector of all $n$ training targets." },
      { sym: "$f, f_*$", desc: "the latent (noise-free) function value at a training input and at the test input $\\mathbf{x}_*$ respectively. We predict $f_*$, then optionally add noise for $y_*$." },
      { sym: "$\\mathcal{GP}$", desc: "Gaussian process: a distribution over functions such that any finite set of function values is jointly Gaussian (Definition 2.1). Written $\\mathcal{GP}(m,k)$ — fully specified by a mean function $m$ and covariance function $k$." },
      { sym: "$m(\\mathbf{x})$", desc: "the mean function of the GP, $m(\\mathbf{x})=\\mathbb{E}[f(\\mathbf{x})]$ (eq. 2.13): the prior expected value of the function at $\\mathbf{x}$. We take it to be zero everywhere." },
      { sym: "$\\mathbf{f}, \\mathbf{f}_*$", desc: "the vectors of latent function values at all training inputs and at all test inputs $X_*$ respectively. (Lowercase non-bold $f_*$ is the single-test-point version.)" },
      { sym: "$X, X_*$", desc: "the matrices of all training inputs and all test inputs. $K(X,X_*)$ etc. denote the covariance matrices evaluated at every pair of points from the two sets." },
      { sym: "$\\operatorname{cov}(\\mathbf{f}_*)$", desc: "the predictive (posterior) covariance matrix over the test latent values (eq. 2.24); its diagonal entries are the pointwise predictive variances $\\mathbb{V}[f_*]$." },
      { sym: "$\\delta_{pq}$", desc: "the Kronecker delta: equals 1 if $p=q$ and 0 otherwise. In eq. (2.31) it places the noise variance $\\sigma_n^2$ only on the diagonal (a point is noisy only with respect to itself)." },
      { sym: "$\\log p(\\mathbf{y}\\mid X)$", desc: "the log marginal likelihood (log evidence) of the targets given the inputs (eq. 2.30): how well the chosen kernel and hyperparameters explain the data, used to tune $(\\ell,\\sigma_f,\\sigma_n)$." },
      { sym: "$|K+\\sigma_n^2 I|$", desc: "the determinant of the noisy kernel matrix; its log is the complexity-penalty term of the marginal likelihood (large when the model is flexible)." },
      { sym: "$n$", desc: "the number of training observations." },
      { sym: "$\\varepsilon$", desc: "epsilon: the observation noise, assumed independent Gaussian with zero mean and variance $\\sigma_n^2$, i.e. $\\varepsilon\\sim\\mathcal{N}(0,\\sigma_n^2)$ (eq. 2.2)." },
      { sym: "$k(\\mathbf{x},\\mathbf{x}')$", desc: "the covariance function / kernel: a number saying how correlated the function values at $\\mathbf{x}$ and $\\mathbf{x}'$ are. Larger = more correlated = forced to be more similar." },
      { sym: "$K$", desc: "the $n\\times n$ kernel (Gram) matrix of all training-to-training covariances, $K_{ij}=k(\\mathbf{x}_i,\\mathbf{x}_j)$. Symmetric and positive semi-definite." },
      { sym: "$\\mathbf{k}_*$", desc: "the length-$n$ vector of covariances between the test point $\\mathbf{x}_*$ and each training point, $(\\mathbf{k}_*)_i=k(\\mathbf{x}_i,\\mathbf{x}_*)$. Written $k(\\mathbf{x}_*)$ in the book." },
      { sym: "$\\sigma_n^2$", desc: "the observation-noise variance (sigma-n-squared): how noisy each measurement is. It is added to the diagonal of $K$." },
      { sym: "$\\sigma_f^2$", desc: "the signal variance (sigma-f-squared): the overall vertical scale of the function — how far it ranges from its mean. It multiplies the RBF kernel." },
      { sym: "$\\ell$", desc: "the length-scale (ell): how far apart two inputs must be before their function values stop being strongly correlated. Small $\\ell$ = wiggly function; large $\\ell$ = slowly varying function." },
      { sym: "$\\boldsymbol\\alpha$", desc: "alpha: the precomputed vector $(K+\\sigma_n^2 I)^{-1}\\mathbf{y}$. The predictive mean is a dot product of $\\boldsymbol\\alpha$ with the test-covariance vector $\\mathbf{k}_*$." },
      { sym: "$\\bar f_*$", desc: "the predictive mean at $\\mathbf{x}_*$ (eq. 2.25): the model's best single guess." },
      { sym: "$\\mathbb{V}[f_*]$", desc: "the predictive variance at $\\mathbf{x}_*$ (eq. 2.26): the squared width of the error bar. Its square root is the predictive standard deviation $\\sigma_*$." },
      { sym: "$I$", desc: "the identity matrix (1s on the diagonal, 0s elsewhere); $\\sigma_n^2 I$ adds the noise variance to every diagonal entry of $K$." },
      { sym: "kernel / covariance function", desc: "the same thing: a function $k$ of two inputs giving their covariance. It encodes all our assumptions about smoothness and scale." },
      { sym: "positive semi-definite", desc: "a property the kernel matrix must satisfy ($\\mathbf{z}^\\top K\\mathbf{z}\\ge 0$ for all $\\mathbf{z}$) so it is a valid covariance — guarantees the math has a solution." }
    ],

    formula:
      `$$f(\\mathbf{x}) \\;\\sim\\; \\mathcal{GP}\\big(m(\\mathbf{x}),\\,k(\\mathbf{x},\\mathbf{x}')\\big),\\qquad
        m(\\mathbf{x})=\\mathbb{E}[f(\\mathbf{x})],\\quad
        k(\\mathbf{x},\\mathbf{x}')=\\mathbb{E}\\big[(f(\\mathbf{x})-m(\\mathbf{x}))(f(\\mathbf{x}')-m(\\mathbf{x}'))\\big]$$
       <p>The GP prior: a distribution over functions, fully specified by a mean function and a covariance function (eqs. 2.13&ndash;2.14). We take $m(\\mathbf{x})=0$.</p>
       $$\\begin{bmatrix}\\mathbf{y}\\\\ \\mathbf{f}_*\\end{bmatrix} \\;\\sim\\;
        \\mathcal{N}\\!\\left(\\mathbf{0},\\;
        \\begin{bmatrix} K(X,X)+\\sigma_n^2 I & K(X,X_*) \\\\ K(X_*,X) & K(X_*,X_*)\\end{bmatrix}\\right)$$
       <p>The joint Gaussian of the noisy training targets $\\mathbf{y}$ and the test latent values $\\mathbf{f}_*$ under the prior (eq. 2.21).</p>
       $$\\mathbf{f}_*\\mid X,\\mathbf{y},X_* \\;\\sim\\; \\mathcal{N}\\big(\\bar{\\mathbf{f}}_*,\\,\\operatorname{cov}(\\mathbf{f}_*)\\big)$$
       $$\\bar{\\mathbf{f}}_* \\;=\\; K(X_*,X)\\,[K(X,X)+\\sigma_n^2 I]^{-1}\\,\\mathbf{y} \\qquad\\text{(eq. 2.23, predictive mean)}$$
       $$\\operatorname{cov}(\\mathbf{f}_*) \\;=\\; K(X_*,X_*)\\;-\\;K(X_*,X)\\,[K(X,X)+\\sigma_n^2 I]^{-1}\\,K(X,X_*) \\qquad\\text{(eq. 2.24, predictive covariance)}$$
       <p>Condition the joint Gaussian on the observed $\\mathbf{y}$ to get the predictive (posterior) distribution at the test inputs (eqs. 2.22&ndash;2.24).</p>
       $$\\bar f_* \\;=\\; \\mathbf{k}_*^\\top\\,(K+\\sigma_n^2 I)^{-1}\\,\\mathbf{y} \\qquad\\text{(eq. 2.25, single test point)}$$
       $$\\mathbb{V}[f_*] \\;=\\; k(\\mathbf{x}_*,\\mathbf{x}_*)\\;-\\;\\mathbf{k}_*^\\top\\,(K+\\sigma_n^2 I)^{-1}\\,\\mathbf{k}_* \\qquad\\text{(eq. 2.26)}$$
       <p>Same two equations in compact notation for a single test point $\\mathbf{x}_*$, with $K=K(X,X)$ and $\\mathbf{k}_*=K(X,\\mathbf{x}_*)$.</p>
       $$\\bar f(\\mathbf{x}_*) \\;=\\; \\sum_{i=1}^{n}\\alpha_i\\,k(\\mathbf{x}_i,\\mathbf{x}_*),\\qquad
        \\boldsymbol\\alpha=(K+\\sigma_n^2 I)^{-1}\\mathbf{y}$$
       <p>The mean as a linear predictor: a weighted sum of kernels centered on the training points &mdash; a manifestation of the representer theorem (eq. 2.27).</p>
       $$\\log p(\\mathbf{y}\\mid X) \\;=\\; -\\tfrac{1}{2}\\,\\mathbf{y}^\\top(K+\\sigma_n^2 I)^{-1}\\mathbf{y}\\;-\\;\\tfrac{1}{2}\\log\\!\\big|K+\\sigma_n^2 I\\big|\\;-\\;\\tfrac{n}{2}\\log 2\\pi$$
       <p>The log marginal likelihood: a data-fit term, a complexity penalty (log-determinant), and a normalizing constant. Used to learn hyperparameters in Chapter 5 (eq. 2.30).</p>
       $$k_y(x_p,x_q) \\;=\\; \\sigma_f^2\\,\\exp\\!\\Big(-\\tfrac{1}{2\\ell^2}\\,(x_p-x_q)^2\\Big)\\;+\\;\\sigma_n^2\\,\\delta_{pq} \\qquad\\text{(eq. 2.31, squared-exponential / RBF kernel)}$$
       <p>The squared-exponential (RBF) covariance with hyperparameters $(\\ell,\\sigma_f,\\sigma_n)$: signal correlation that decays as a Gaussian bump with distance, plus a noise term ($\\delta_{pq}=1$ iff $p=q$) on the diagonal (eq. 2.31).</p>`,

    whatItDoes:
      `<p>The first line is the prediction: blend the training targets $\\mathbf{y}$, weighting each by how
       correlated its input is with the test point (through $\\mathbf{k}_*$) after de-correlating them with the
       inverse kernel matrix. The second line is the honesty: start from the prior uncertainty
       $k(\\mathbf{x}_*,\\mathbf{x}_*)$ and subtract everything the data already explains; what is left is the
       remaining uncertainty. The third line is the kernel that drives both: function values closer than about
       $\\ell$ in input are strongly correlated, and the correlation decays as a Gaussian bump with distance.</p>`,

    derivation:
      `<p>The full "why a GP is a distribution over functions, and why conditioning a joint Gaussian gives these
       formulas" is owned by the <code>cls-gaussian-process</code> concept lesson &mdash; see it for the joint
       Gaussian and the conditioning identity. Here is the short recap, following Section 2.2.</p>
       <p>Stack the training latent values $\\mathbf{f}$ and the test value $f_*$. Under the zero-mean GP prior
       with the noise model $\\mathbf{y}\\sim\\mathcal{N}(\\mathbf{0},K+\\sigma_n^2 I)$, they are jointly Gaussian:</p>
       $$\\begin{bmatrix}\\mathbf{y}\\\\ f_*\\end{bmatrix}\\sim
        \\mathcal{N}\\!\\left(\\mathbf{0},\\;
        \\begin{bmatrix} K+\\sigma_n^2 I & \\mathbf{k}_* \\\\ \\mathbf{k}_*^\\top & k(\\mathbf{x}_*,\\mathbf{x}_*)\\end{bmatrix}\\right).$$
       <p>For a joint Gaussian $\\begin{bmatrix}\\mathbf{a}\\\\ b\\end{bmatrix}\\sim\\mathcal{N}(\\mathbf{0},
       \\begin{bmatrix}A&B\\\\ B^\\top&C\\end{bmatrix})$, the conditional $b\\mid\\mathbf{a}$ is Gaussian with mean
       $B^\\top A^{-1}\\mathbf{a}$ and variance $C-B^\\top A^{-1}B$ (the standard Gaussian conditioning result,
       book Appendix A.2). Substituting $A=K+\\sigma_n^2 I$, $B=\\mathbf{k}_*$, $C=k(\\mathbf{x}_*,\\mathbf{x}_*)$,
       $\\mathbf{a}=\\mathbf{y}$ gives exactly eqs. (2.25) and (2.26). The mean is linear in $\\mathbf{y}$ (eq. 2.27,
       the "linear predictor"); the variance is independent of $\\mathbf{y}$.</p>`,

    example:
      `<p><b>Worked numbers (the 2&times;2 kernel + one predictive mean)</b>. Two training points $x_1=0,\\ x_2=1$
       with targets $\\mathbf{y}=[\\,1,\\,-1\\,]^\\top$. RBF kernel with $\\sigma_f^2=1,\\ \\ell=1$, and noise
       $\\sigma_n^2=0.1$.</p>
       <ul>
         <li>Kernel entries: $k(0,0)=k(1,1)=1$ and $k(0,1)=\\exp(-\\tfrac{1}{2}(0-1)^2)=\\exp(-0.5)=0.6065$. So
         $$K=\\begin{bmatrix}1 & 0.6065\\\\ 0.6065 & 1\\end{bmatrix},\\qquad
          K+\\sigma_n^2 I=\\begin{bmatrix}1.1 & 0.6065\\\\ 0.6065 & 1.1\\end{bmatrix}.$$</li>
         <li>Invert the $2\\times 2$: determinant $=1.1^2-0.6065^2=1.21-0.3679=0.8421$, so
         $$(K+\\sigma_n^2 I)^{-1}=\\frac{1}{0.8421}\\begin{bmatrix}1.1 & -0.6065\\\\ -0.6065 & 1.1\\end{bmatrix}
          =\\begin{bmatrix}1.3062 & -0.7202\\\\ -0.7202 & 1.3062\\end{bmatrix}.$$</li>
         <li>Precompute $\\boldsymbol\\alpha=(K+\\sigma_n^2 I)^{-1}\\mathbf{y}$:
         $\\alpha_1=1.3062\\cdot 1+(-0.7202)\\cdot(-1)=2.0265$, $\\alpha_2=-2.0265$ by symmetry.</li>
         <li>Predict at the test point $x_*=0$ (a training location). Test covariances:
         $\\mathbf{k}_*=[\\,k(0,0),\\,k(1,0)\\,]=[\\,1,\\,0.6065\\,]$. Mean
         $\\bar f_*=\\mathbf{k}_*^\\top\\boldsymbol\\alpha=1\\cdot 2.0265+0.6065\\cdot(-2.0265)=0.797$.</li>
         <li>Variance at $x_*=0$: $\\mathbb{V}[f_*]=k(0,0)-\\mathbf{k}_*^\\top(K+\\sigma_n^2 I)^{-1}\\mathbf{k}_*
          =1-0.913=0.087$, so $\\sigma_*=\\sqrt{0.087}=0.295$.</li>
       </ul>
       <p>Two things to notice. The prediction at the data point is $0.797$, not the raw target $1$ &mdash; the
       noise $\\sigma_n^2$ shrinks it toward zero (it does not interpolate exactly). And the error bar there is
       small ($\\sigma_*\\approx 0.30$) because the point sits on data. The CODE cell recomputes every one of
       these numbers and prints them.</p>`,

    recipe:
      `<p><b>Algorithm 2.1 (GP regression), as numbered steps</b> &mdash; inputs $X$ (training inputs),
       $\\mathbf{y}$ (targets), kernel $k$, noise $\\sigma_n^2$, test point $\\mathbf{x}_*$:</p>
       <ol>
         <li>Form $K_{ij}=k(\\mathbf{x}_i,\\mathbf{x}_j)$ and Cholesky-factor $L=\\text{cholesky}(K+\\sigma_n^2 I)$
         (numerically safer than inverting directly).</li>
         <li>Solve for $\\boldsymbol\\alpha=L^\\top\\backslash(L\\backslash\\mathbf{y})$ &mdash; i.e.
         $(K+\\sigma_n^2 I)^{-1}\\mathbf{y}$ via two triangular solves.</li>
         <li>Form the test-covariance vector $\\mathbf{k}_*$ with $(\\mathbf{k}_*)_i=k(\\mathbf{x}_i,\\mathbf{x}_*)$.</li>
         <li>Predictive mean: $\\bar f_*=\\mathbf{k}_*^\\top\\boldsymbol\\alpha$ (eq. 2.25).</li>
         <li>Solve $\\mathbf{v}=L\\backslash\\mathbf{k}_*$; predictive variance
         $\\mathbb{V}[f_*]=k(\\mathbf{x}_*,\\mathbf{x}_*)-\\mathbf{v}^\\top\\mathbf{v}$ (eq. 2.26).</li>
         <li>For noisy-target predictions $y_*$, add $\\sigma_n^2$ to the variance. Return $\\bar f_*$ and
         $\\mathbb{V}[f_*]$.</li>
       </ol>`,

    results:
      `<p>The book is a reference text, not a single benchmark; its "result" is the methodology itself. The
       qualitative behavior it documents (Section 2.3, Figure 2.5) is what we reproduce: with the
       squared-exponential kernel and $(\\ell,\\sigma_f,\\sigma_n)=(1,1,0.1)$ the 95% confidence band hugs the
       data and widens away from it; a too-short length-scale ($\\ell=0.3$) makes the band "grow rapidly away
       from the datapoints," while a too-long one ($\\ell=3$) yields "a slowly varying function with a lot of
       noise." (Source: Rasmussen &amp; Williams, <i>Gaussian Processes for Machine Learning</i>, MIT Press 2006,
       Chapter 2.) The CODEVIZ numbers below are our own small run, not the book's reported numbers.</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive), in NumPy.</b> scikit-learn ships this as
       <code>GaussianProcessRegressor</code> in a few lines. Here you <b>build it from scratch</b>: the RBF
       kernel, the kernel matrix with noise on the diagonal, the single linear solve for the predictive mean
       (eq. 2.25), and the quadratic form for the predictive variance (eq. 2.26). The payoff is the check that
       your mean and standard deviation match
       <code>sklearn.gaussian_process.GaussianProcessRegressor</code> to machine precision &mdash; if it passes,
       your formulas <i>are</i> the textbook's. You import only the linear-algebra plumbing
       (<code>numpy.linalg</code>); the GP math is all yours.</p>`,

    pitfalls:
      `<ul>
         <li><b>Forgetting the noise on the diagonal.</b> Use $K+\\sigma_n^2 I$, not $K$. With $\\sigma_n^2=0$
         the matrix can be singular (two close inputs make near-identical rows) and the solve blows up. The noise
         term is also what makes the GP <i>not</i> interpolate the data exactly.</li>
         <li><b>Mismatching sklearn's <code>alpha</code>.</b> In <code>GaussianProcessRegressor</code> the
         constructor argument <code>alpha</code> <i>is</i> $\\sigma_n^2$ (added to the diagonal). To match your
         scratch code, pass the same value and a <code>fixed</code> kernel so sklearn does not re-optimize the
         hyperparameters.</li>
         <li><b>Comparing variance vs standard deviation.</b> sklearn's <code>predict(..., return_std=True)</code>
         returns the standard deviation $\\sigma_*=\\sqrt{\\mathbb{V}[f_*]}$, not the variance. Square it (or square-root
         yours) before comparing.</li>
         <li><b>$f_*$ vs $y_*$ variance.</b> eq. (2.26) is the variance of the latent $f_*$. If you want the band
         for noisy observations $y_*$, add $\\sigma_n^2$. sklearn returns the $f_*$ (latent) std by default, so do
         not add noise when checking against it.</li>
         <li><b>Negative variance from round-off.</b> The subtraction $k(\\mathbf{x}_*,\\mathbf{x}_*)-\\mathbf{v}^\\top\\mathbf{v}$
         can go slightly negative numerically; clamp at a small floor before taking the square root.</li>
         <li><b>Wrong length-scale in the exponent.</b> eq. (2.31) divides by $2\\ell^2$, not $\\ell^2$ or
         $2\\ell$. Get this wrong and the band width is off even though the curve still looks roughly right.</li>
       </ul>`,

    recall: [
      "State the GP predictive mean (eq. 2.25) and variance (eq. 2.26) from memory.",
      "Write the squared-exponential / RBF kernel and define $\\ell$ and $\\sigma_f^2$.",
      "Why does the predictive variance shrink near data and return to the prior far from data?",
      "Why is $\\sigma_n^2 I$ added to $K$, and what role does $\\sigma_n^2$ play in the prediction at a data point?",
      "Does the predictive variance (eq. 2.26) depend on the observed targets $\\mathbf{y}$? Why or why not?"
    ],

    practice: [
      {
        q: `Using the worked example (two points $x_1=0,x_2=1$, $\\mathbf{y}=[1,-1]$, RBF $\\sigma_f^2=1,\\ell=1$, $\\sigma_n^2=0.1$), predict the mean at the midpoint $x_*=0.5$. Predict the answer by symmetry before computing.`,
        steps: [
          { do: `Test covariances: $k(0,0.5)=k(1,0.5)=\\exp(-\\tfrac12(0.5)^2)=\\exp(-0.125)=0.8825$.`, why: `$x_*$ is equidistant from both training points.` },
          { do: `Recall $\\boldsymbol\\alpha=[2.0265,-2.0265]$.`, why: `Computed once in the worked example.` },
          { do: `Mean $=\\mathbf{k}_*^\\top\\boldsymbol\\alpha=0.8825\\cdot 2.0265+0.8825\\cdot(-2.0265)=0$.`, why: `Equal-and-opposite contributions cancel.` }
        ],
        answer: `The mean is exactly $0$. The two equally-distant training points have equal covariance with $x_*$, and their $\\boldsymbol\\alpha$ weights are equal and opposite (because $\\mathbf{y}=[1,-1]$ is antisymmetric), so they cancel. The variance there is $\\approx 0.087$ ($\\sigma_*\\approx 0.295$) — slightly larger than at the data points, reflecting that $x_*=0.5$ is a small gap between data.`
      },
      {
        q: `In eq. (2.26), explain why the predictive variance equals the prior variance $k(\\mathbf{x}_*,\\mathbf{x}_*)$ when the test point is very far from all training points.`,
        steps: [
          { do: `Far away, every $k(x_i,\\mathbf{x}_*)\\to 0$, so $\\mathbf{k}_*\\to\\mathbf{0}$.`, why: `RBF correlation decays to zero with distance.` },
          { do: `Then the subtracted term $\\mathbf{k}_*^\\top(K+\\sigma_n^2 I)^{-1}\\mathbf{k}_*\\to 0$.`, why: `A quadratic form in the zero vector is zero.` },
          { do: `So $\\mathbb{V}[f_*]\\to k(\\mathbf{x}_*,\\mathbf{x}_*)=\\sigma_f^2$.`, why: `Nothing is subtracted from the prior.` }
        ],
        answer: `Far from data the test point is uncorrelated with every observation, so the data tells us nothing and the variance returns to the prior $\\sigma_f^2$. This is exactly why the $\\pm 2\\sigma$ band fans out to its full prior width beyond the data — the GP is honest that it is just guessing there.`
      },
      {
        q: `Ablation (length-scale). In the CODE/CODEVIZ, refit with length-scale $\\ell=0.3$ and $\\ell=3$ instead of $\\ell=1$, keeping the data fixed. What happens to the uncertainty between data points, and why? (This reproduces the book's Figure 2.5.)`,
        steps: [
          { do: `Set $\\ell=0.3$ and recompute the band on the dense grid.`, why: `Short length-scale = correlation decays fast.` },
          { do: `With small $\\ell$, $k(x_i,\\mathbf{x}_*)$ drops to ~0 just a short distance from each data point.`, why: `So $\\mathbf{k}_*\\approx\\mathbf{0}$ even in small gaps between points.` },
          { do: `Set $\\ell=3$ and recompute.`, why: `Long length-scale = each point's influence reaches far.` }
        ],
        answer: `With $\\ell=0.3$ the band balloons to nearly the full prior width in every gap between data — the model assumes the function can wiggle fast, so it is uncertain the moment it leaves a data point. With $\\ell=3$ each point's influence reaches across the whole input range, so the band stays narrow and the mean is a slowly-varying smooth curve. In our run the predictive std at the gap point $x=-2$ goes from $\\approx 1.00$ ($\\ell=0.3$) to $\\approx 0.50$ ($\\ell=1$) to $\\approx 0.09$ ($\\ell=3$). This is the length-scale's job: it controls how far confidence propagates from the data, matching Figure 2.5.`
      }
    ]
  });

  window.CODE["paper-gaussian-processes"] = {
    lib: "NumPy",
    runnable: false,
    explain:
      `Build Gaussian-process regression from scratch with NumPy: the squared-exponential (RBF) kernel, the ` +
      `kernel matrix with noise on the diagonal, the predictive mean (eq. 2.25) and variance (eq. 2.26). ` +
      `Then PROVE it is the textbook's by checking that the mean and standard deviation match ` +
      `sklearn.gaussian_process.GaussianProcessRegressor on a toy 1-D problem to machine precision. Finally ` +
      `recompute the 2x2 worked example. Runs in Colab (numpy + sklearn are preinstalled).`,
    code: `import numpy as np
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import RBF, ConstantKernel

rng = np.random.default_rng(0)

# ---- toy 1-D regression: y = sin(x) + noise at 6 inputs ----
Xtr = np.array([-4., -3., -1., 0., 2., 3.5])
ytr = np.sin(Xtr) + rng.normal(0, 0.1, Xtr.shape[0])
sf2, l, sn2 = 1.0, 1.0, 0.01          # signal var, length-scale, noise var

def rbf(A, B):                         # eq. (2.31), squared-exponential kernel
    d = A.reshape(-1, 1) - B.reshape(1, -1)
    return sf2 * np.exp(-(d ** 2) / (2 * l * l))

# ---- GP regression from scratch (Algorithm 2.1, via Cholesky) ----
def gp_predict(Xtest):
    K = rbf(Xtr, Xtr)
    L = np.linalg.cholesky(K + sn2 * np.eye(len(Xtr)))   # chol(K + sn2 I)
    alpha = np.linalg.solve(L.T, np.linalg.solve(L, ytr))# (K+sn2 I)^-1 y
    Ks = rbf(Xtest, Xtr)                                  # k_* for each test pt
    mean = Ks @ alpha                                     # eq. (2.25)
    v = np.linalg.solve(L, Ks.T)
    var = sf2 - np.sum(v * v, axis=0)                     # eq. (2.26)
    return mean, np.sqrt(np.maximum(var, 1e-9))

Xte = np.linspace(-5, 5, 8)
mean_mine, std_mine = gp_predict(Xte)

# ---- THE ORACLE: match sklearn's GaussianProcessRegressor ----
kern = ConstantKernel(sf2, "fixed") * RBF(l, "fixed")    # fixed -> no re-tuning
gp = GaussianProcessRegressor(kernel=kern, alpha=sn2, optimizer=None)  # alpha = sn2
gp.fit(Xtr.reshape(-1, 1), ytr)
mean_sk, std_sk = gp.predict(Xte.reshape(-1, 1), return_std=True)

print("mean allclose vs sklearn:", np.allclose(mean_mine, mean_sk, atol=1e-6))  # True
print("std  allclose vs sklearn:", np.allclose(std_mine,  std_sk,  atol=1e-6))  # True
print("max mean diff:", float(np.max(np.abs(mean_mine - mean_sk))))             # ~4e-16

# ---- recompute the 2x2 worked example ----
l2, sn2b = 1.0, 0.1
X2 = np.array([0., 1.]); y2 = np.array([1., -1.])
def k2(a, b): return np.exp(-(a - b) ** 2 / (2 * l2 * l2))
K2 = np.array([[k2(0,0), k2(0,1)], [k2(1,0), k2(1,1)]])
Ainv = np.linalg.inv(K2 + sn2b * np.eye(2))
a2 = Ainv @ y2
ks0 = np.array([k2(0,0), k2(1,0)])                       # test point x*=0
print("worked: K01 =", round(k2(0,1), 4),               # 0.6065
      " alpha =", np.round(a2, 4),                       # [ 2.0265 -2.0265]
      " mean@0 =", round(float(ks0 @ a2), 4),            # 0.7973
      " std@0 =", round(float(np.sqrt(1 - ks0 @ Ainv @ ks0)), 4))  # 0.2949`
  };

  window.CODEVIZ["paper-gaussian-processes"] = {
    question: "Fit a GP (RBF kernel, length-scale ℓ=1) to 6 noisy points of sin(x). Where is the ±2σ uncertainty band narrow, and how does the band width between data points respond to the length-scale ℓ?",
    charts: [
      {
        type: "line",
        title: "GP posterior on toy 1-D data: mean and ±2σ uncertainty band (ℓ=1)",
        xlabel: "input x",
        ylabel: "output y",
        series: [
          {
            name: "mean (eq. 2.25)",
            color: "#4ea1ff",
            points: [[-5.5,0.367],[-5,0.644],[-4.5,0.837],[-4,0.757],[-3.5,0.369],[-3,-0.147],[-2.5,-0.573],[-2,-0.826],[-1.5,-0.9],[-1,-0.768],[-0.5,-0.431],[0,0.006],[0.5,0.415],[1,0.731],[1.5,0.906],[2,0.846],[2.5,0.516],[3,0.052],[3.5,-0.308],[4,-0.424],[4.5,-0.34],[5,-0.195],[5.5,-0.084]]
          },
          {
            name: "mean + 2σ",
            color: "#7ee787",
            points: [[-5.5,2.221],[-5,2.13],[-4.5,1.642],[-4,0.955],[-3.5,0.741],[-3,0.052],[-2.5,0.116],[-2,0.17],[-1.5,-0.213],[-1,-0.569],[-0.5,-0.067],[0,0.204],[0.5,1.122],[1,1.794],[1.5,1.685],[2,1.045],[2.5,1.175],[3,0.72],[3.5,-0.109],[4,0.48],[4.5,1.222],[5,1.688],[5.5,1.896]]
          },
          {
            name: "mean − 2σ",
            color: "#ff7b72",
            points: [[-5.5,-1.487],[-5,-0.842],[-4.5,0.032],[-4,0.559],[-3.5,-0.003],[-3,-0.345],[-2.5,-1.262],[-2,-1.822],[-1.5,-1.587],[-1,-0.966],[-0.5,-0.796],[0,-0.193],[0.5,-0.292],[1,-0.331],[1.5,0.126],[2,0.647],[2.5,-0.144],[3,-0.617],[3.5,-0.507],[4,-1.327],[4.5,-1.902],[5,-2.077],[5.5,-2.063]]
          }
        ]
      },
      {
        type: "bars",
        title: "Length-scale ablation: predictive std at a gap (x=−2) and far beyond data (x=5.3)",
        labels: ["ℓ=0.3 @ x=−2", "ℓ=1 @ x=−2", "ℓ=3 @ x=−2", "ℓ=0.3 @ x=5.3", "ℓ=1 @ x=5.3", "ℓ=3 @ x=5.3"],
        values: [1.0, 0.498, 0.089, 1.0, 0.978, 0.38],
        valueLabels: ["1.00", "0.50", "0.09", "1.00", "0.98", "0.38"]
      }
    ],
    caption: "Our small-scale run (numpy, seed 0), not the book's reported numbers. Training inputs are at x ∈ {−4,−3,−1,0,2,3.5}. Top: the green (mean+2σ) and red (mean−2σ) curves bracket the blue predictive mean — the band PINCHES SHUT right at each training input (e.g. near x=−4,−3,−1,0,2,3.5 the two curves squeeze toward the mean) and FANS OUT in the gaps and beyond the data (widest at the left/right edges where it returns to the prior). Bottom: holding the data fixed and changing only the length-scale ℓ, the predictive standard deviation at the between-data gap x=−2 collapses from 1.00 (ℓ=0.3, model assumes fast wiggles → uncertain) to 0.50 (ℓ=1) to 0.09 (ℓ=3, influence reaches across the gap → confident). This reproduces the qualitative effect of Figure 2.5.",
    code: `import numpy as np
rng = np.random.default_rng(0)

Xtr = np.array([-4., -3., -1., 0., 2., 3.5])
ytr = np.sin(Xtr) + rng.normal(0, 0.1, Xtr.shape[0])
sf2, sn2 = 1.0, 0.01

def fit_predict(l, Xte):
    def rbf(A, B):
        d = A.reshape(-1, 1) - B.reshape(1, -1)
        return sf2 * np.exp(-(d ** 2) / (2 * l * l))
    L = np.linalg.cholesky(rbf(Xtr, Xtr) + sn2 * np.eye(len(Xtr)))
    alpha = np.linalg.solve(L.T, np.linalg.solve(L, ytr))
    Ks = rbf(Xte, Xtr)
    mean = Ks @ alpha
    v = np.linalg.solve(L, Ks.T)
    std = np.sqrt(np.maximum(sf2 - np.sum(v * v, axis=0), 1e-9))
    return mean, std

# top chart: posterior mean +/- 2 std on a dense grid (l=1)
Xte = np.linspace(-5.5, 5.5, 23)
m, s = fit_predict(1.0, Xte)
print("mean:", np.round(m, 3))
print("upper (m+2s):", np.round(m + 2 * s, 3))
print("lower (m-2s):", np.round(m - 2 * s, 3))

# bottom chart: length-scale ablation at a gap (x=-2) and far (x=5.3)
for l in [0.3, 1.0, 3.0]:
    _, ss = fit_predict(l, np.array([-2.0, 5.3]))
    print(f"l={l}: std@x=-2 = {ss[0]:.3f}, std@x=5.3 = {ss[1]:.3f}")`
  };
})();
