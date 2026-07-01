/* =====================================================================
   MATH CURRICULUM GENERATOR
   ---------------------------------------------------------------------
   Single source of truth for the "Mathematics for ML" track.
   Emits one lessons/math-<NN>-<slug>.js file per topic, each lesson using
   the monochrome "book" template (template:"book" + sections[] + takeaways[]).

   Every lesson follows the agreed 5-section template:
     1. Connections
     2. Motivation & Intuition
     3. Definition & Assumptions
     4. Worked Example & Practice
     5. Real-World Applications in CS & ML

   Lessons listed in AUTHORED[] are written out in full (gold standard).
   Everything else is emitted as a navigable scaffold that follows the same
   structure and can be deepened by adding an AUTHORED entry and re-running:
       node tools/gen-math.js
   ===================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname, "..", "lessons");

/* --- The curriculum: 27 topics, grouped by category, one concept per lesson. */
const TOPICS = [
  { n: 1, cat: "Analysis & Calculus", name: "Single-variable calculus", tag: "🟢", lessons: [
    "Functions and their graphs","Function transformations","Exponential functions","Logarithmic functions","Trigonometric functions","Inverse trigonometric functions","Limits: definition and computation","One-sided limits","Continuity","The Intermediate Value Theorem","Limits at infinity","Asymptotes","The derivative — definition and meaning","Differentiability vs continuity","The power rule","The sum and difference rule","The product rule","The quotient rule","The chain rule","Derivative of exponential functions","Derivative of logarithmic functions","Derivatives of trigonometric functions","Implicit differentiation","Logarithmic differentiation","Related rates","Linear approximation","Differentials","Indeterminate forms","L'Hôpital's rule","Critical points","The first derivative test","Concavity","The second derivative test","Inflection points","The Mean Value Theorem","Curve sketching","Applied optimization","Antiderivatives","Riemann sums","The definite integral","The Fundamental Theorem of Calculus","Integration by substitution","Integration by parts","Trigonometric integrals","Trigonometric substitution","Partial fraction decomposition","Improper integrals","Area between curves","Volumes of revolution","Arc length","Parametric equations and calculus","Polar coordinates and calculus","Sequences","Series","The geometric series","Convergence tests","Power series","Taylor series","Maclaurin series","Numerical differentiation","Numerical integration","★ Backpropagation as the chain rule"] },
  { n: 2, cat: "Analysis & Calculus", name: "Multivariable / vector calculus", tag: "🟢", lessons: [
    "Points and vectors in Rⁿ","The dot product","The cross product","Lines in space","Planes in space","Vector-valued functions","Space curves","Functions of several variables","Level sets and contour maps","Limits in several variables","Continuity in several variables","Partial derivatives","The gradient","Directional derivatives","Tangent planes","Linear approximation in several variables","The multivariable chain rule","The Jacobian matrix","Higher-order partial derivatives","The Hessian matrix","Multivariable Taylor expansion","Unconstrained optimization and critical points","Saddle points","Definiteness and the second-derivative test","Lagrange multipliers","Double integrals","Triple integrals","Change of variables","The Jacobian determinant","Cylindrical coordinates","Spherical coordinates","Vector fields","Divergence","Curl","Line integrals","Green's theorem","Surface integrals","Flux","Stokes' theorem","The divergence theorem","★ Matrix calculus for ML"] },
  { n: 3, cat: "Analysis & Calculus", name: "Differential equations (ODEs)", tag: "🟡", lessons: [
    "What is a differential equation?","Classifying differential equations","Solutions and initial conditions","Direction fields","Separable equations","Linear first-order equations","Integrating factors","Exact equations","Bernoulli equations","Homogeneous substitutions","Modeling with first-order ODEs","The existence–uniqueness theorem","Second-order linear ODE theory","Constant-coefficient homogeneous equations","Method of undetermined coefficients","Variation of parameters","Forced oscillations and resonance","Higher-order linear ODEs","Systems of first-order ODEs","The matrix exponential","Eigenvalue methods for systems","Phase-plane analysis","Equilibria and stability","Linearization","Series solutions","Special functions","The Laplace transform","The inverse Laplace transform","Solving IVPs with Laplace","Euler's method","Runge–Kutta methods","Boundary value problems","Sturm–Liouville theory","★ Neural ODEs","★ Stochastic differential equations & diffusion"] },
  { n: 4, cat: "Analysis & Calculus", name: "Real analysis", tag: "🟡", lessons: [
    "Proof techniques","The natural and rational numbers","The real numbers","Completeness, suprema, and infima","Countable and uncountable sets","Sequences","Limits of sequences","Subsequences","The Bolzano–Weierstrass theorem","Cauchy sequences","Infinite series","Convergence tests for series","Absolute and conditional convergence","Limits of functions (ε–δ)","Continuity (ε–δ)","Properties of continuous functions","Uniform continuity","The derivative, rigorously","The Mean Value Theorem","Taylor's theorem with remainder","The Riemann integral","The Fundamental Theorem of Calculus","Sequences of functions","Series of functions","Pointwise convergence","Uniform convergence","Power series and analyticity","Metric spaces","Open and closed sets","Compactness","The contraction mapping theorem","★ Convergence guarantees for gradient methods"] },
  { n: 5, cat: "Analysis & Calculus", name: "Functional analysis", tag: "🟡", lessons: [
    "Vector spaces","Linear operators","Norms and normed spaces","Banach spaces and completeness","Inner products","Hilbert spaces","Orthonormal bases","Orthogonal projections","Best approximation","The Riesz representation theorem","Bounded linear operators","Operator norms","Dual spaces","The Hahn–Banach theorem","Weak convergence","Compact operators","The spectral theorem for operators","Reproducing kernel Hilbert spaces (RKHS)","Positive-definite kernels","Mercer's theorem","★ The kernel trick and representer theorem"] },
  { n: 6, cat: "Analysis & Calculus", name: "Harmonic / Fourier analysis", tag: "🟡", lessons: [
    "Periodic functions","Orthogonality of sinusoids","Fourier series","Convergence of Fourier series","Complex Fourier coefficients","The Fourier transform","Properties of the Fourier transform","The convolution theorem","The Dirac delta","Distributions","The uncertainty principle","Sampling and the Nyquist–Shannon theorem","The Discrete Fourier Transform (DFT)","The Fast Fourier Transform (FFT)","The Laplace connection (s = iω)","Wavelets","Filtering","Spectral methods","★ Convolutions in CNNs & spectral architectures"] },
  { n: 7, cat: "Analysis & Calculus", name: "Measure theory", tag: "🟡", lessons: [
    "Why measure theory?","σ-algebras","Measurable spaces","Measures","Outer measure","Lebesgue measure","Measurable functions","The Lebesgue integral","The monotone convergence theorem","Fatou's lemma","The dominated convergence theorem","Lᵖ spaces","Product measures","Fubini's theorem","Probability spaces as measure spaces","Random variables, measure-theoretically","Expectation as a Lebesgue integral","The Radon–Nikodym theorem","Densities","★ Measure-theoretic foundations of probability"] },
  { n: 8, cat: "Analysis & Calculus", name: "Numerical analysis", tag: "🟢", lessons: [
    "Floating-point representation (IEEE 754)","Machine epsilon and rounding","Absolute and relative error","Error propagation","Catastrophic cancellation","Conditioning of problems","Stability of algorithms","Bisection","Newton's method","The secant method","Fixed-point iteration","LU factorization","Cholesky factorization","Pivoting","Matrix condition number","Jacobi and Gauss–Seidel iteration","Polynomial interpolation","Spline interpolation","Least-squares approximation","Numerical integration (quadrature)","Numerical differentiation","Eigenvalue computation","★ Numerical precision & stability in deep learning"] },
  { n: 9, cat: "Algebra", name: "Linear algebra", tag: "🟢", lessons: [
    "Vectors and linear combinations","Systems of linear equations","Gaussian elimination","Matrix algebra","Matrix multiplication as composition","Matrix inverses","Elementary matrices","LU factorization","Vector spaces and subspaces","Span","Linear independence","Basis and dimension","The four fundamental subspaces","Linear transformations","Matrix of a linear transformation","Change of basis","Determinants","The eigenvalue equation","The characteristic polynomial","Diagonalization","Similarity","The Jordan form","Inner products","Orthogonality","Orthogonal projections","Gram–Schmidt","QR factorization","The Spectral Theorem","Positive-definite matrices","Quadratic forms","Singular Value Decomposition (SVD)","Least squares","The pseudoinverse","Principal Component Analysis (PCA)","Matrix norms","The condition number","Tensors","The Kronecker product","★ Weights as linear maps; low-rank factorization"] },
  { n: 10, cat: "Algebra", name: "Representation theory", tag: "🟡", lessons: [
    "Groups","Subgroups and homomorphisms","Group actions","Orbits and stabilizers","Linear representations","Subrepresentations","Reducibility","Irreducible representations","Schur's lemma","Characters","Orthogonality relations","Representations of continuous groups","Invariance","Equivariance","★ Group-equivariant & geometric neural networks"] },
  { n: 11, cat: "Geometry & Topology", name: "Analytic geometry", tag: "🟡", lessons: [
    "Cartesian coordinates","Polar coordinates","Distance and midpoints","Lines in the plane","Vectors","The dot product","The cross product","Lines in 3D","Planes in 3D","The circle and ellipse","The parabola and hyperbola","Quadratic forms","Quadric surfaces","Projections","Reflections","Rotations, scaling, and translation","Homogeneous coordinates","★ Hyperplanes and decision boundaries"] },
  { n: 12, cat: "Geometry & Topology", name: "Differential geometry", tag: "🟡", lessons: [
    "Parametrized curves","Arc length","Curvature","The Frenet frame","Regular surfaces","Tangent planes","The differential of a map","The first fundamental form","The second fundamental form","Gaussian curvature","Mean curvature","Manifolds and charts","Tangent spaces","Vector fields on manifolds","Riemannian metrics","Geodesics","The exponential map","Connections and parallel transport","The Fisher information metric","★ Geometric deep learning"] },
  { n: 13, cat: "Geometry & Topology", name: "Topology", tag: "🟡", lessons: [
    "What topology studies","Topological spaces","Open and closed sets","Bases","Subspace topology","Continuity","Homeomorphisms","Connectedness","Compactness","Metric-space topology","Quotient spaces","Homotopy","The fundamental group","Covering spaces","Simplicial complexes","Homology groups","Persistent homology","★ The manifold hypothesis & TDA"] },
  { n: 14, cat: "Discrete & Foundations", name: "Discrete math / combinatorics", tag: "🟢", lessons: [
    "Propositional logic","Predicate logic","Sets","Relations","Functions","Proof by induction","Proof by contradiction","The sum rule","The product rule","Permutations","Combinations","The binomial theorem","Combinatorial identities","Inclusion–exclusion","The pigeonhole principle","Recurrence relations","Solving linear recurrences","Generating functions","Discrete probability","Posets and lattices","Modular arithmetic","Boolean algebra","★ Counting, complexity, and Big-O"] },
  { n: 15, cat: "Discrete & Foundations", name: "Graph theory", tag: "🟢", lessons: [
    "Graphs and their representations","Degree and the handshake lemma","Paths and walks","Cycles","Connectivity","Trees","Spanning trees","Breadth-first search","Depth-first search","Dijkstra's shortest paths","Bellman–Ford","Minimum spanning trees","Network flows","Cuts and the max-flow min-cut theorem","Bipartite graphs","Matching","Graph coloring","Planar graphs","Euler's formula","Eulerian graphs","Hamiltonian graphs","The adjacency matrix","The graph Laplacian","Spectral graph theory","Random graphs","Spectral clustering","★ Graph neural networks & message passing"] },
  { n: 16, cat: "Discrete & Foundations", name: "Mathematical logic & set theory", tag: "🟡", lessons: [
    "Propositional logic and truth tables","Logical equivalence","Normal forms","Predicate (first-order) logic","Quantifiers","Formal semantics","Natural deduction","Soundness and completeness","Naive set theory","The ZFC axioms","Relations and orderings","Cardinality","Infinite sets","Ordinals","The axiom of choice","Turing machines and computability","Decidability","Gödel's incompleteness theorems","★ Neuro-symbolic AI"] },
  { n: 17, cat: "Probability & Statistics", name: "Probability theory", tag: "🟢", lessons: [
    "Sample spaces and events","Set operations on events","Axioms of probability","Combinatorial probability","Conditional probability","Independence","The law of total probability","Bayes' theorem","Discrete random variables","Continuous random variables","Probability density functions","Cumulative distribution functions","Expectation","Variance","Moments","Moment generating functions","The Bernoulli distribution","The binomial distribution","The Poisson distribution","The geometric distribution","The uniform distribution","The exponential distribution","The Gaussian distribution","The Beta and Gamma distributions","Joint distributions","Marginal distributions","Conditional distributions","Independence of random variables","Covariance","Correlation","Transformations of random variables","Sums of random variables and convolution","Conditional expectation","Markov's inequality","Chebyshev's inequality","Jensen's inequality","The Law of Large Numbers","The Central Limit Theorem","Hoeffding's inequality","★ The multivariate Gaussian"] },
  { n: 18, cat: "Probability & Statistics", name: "Mathematical statistics / inference", tag: "🟢", lessons: [
    "Populations and samples","Statistics and estimators","Descriptive statistics","Sampling distributions","Point estimation","Bias of an estimator","Variance of an estimator","Mean squared error","Consistency","Efficiency","The method of moments","Maximum Likelihood Estimation (MLE)","Asymptotics of MLE","Fisher information","Maximum a Posteriori (MAP) estimation","Sufficiency","The exponential family","The Cramér–Rao bound","Confidence intervals","Hypothesis testing","Type I and II errors","Statistical power","The z-test and t-test","The χ² and F tests","The likelihood ratio test","Nonparametric methods","The bootstrap","Linear regression","The bias–variance tradeoff","★ Statistical learning theory & generalization"] },
  { n: 19, cat: "Probability & Statistics", name: "Stochastic processes", tag: "🟢", lessons: [
    "What is a stochastic process?","Discrete-time Markov chains","Transition matrices","The Chapman–Kolmogorov equations","Classification of states","Stationary distributions","Limiting distributions","Reversibility and detailed balance","Continuous-time Markov chains","Poisson processes","Birth–death processes","Random walks","Brownian motion","Gaussian processes","Martingales","Itô's lemma","Monte Carlo methods","Markov Chain Monte Carlo (MCMC)","Markov Decision Processes (RL)","Autoregressive (AR) models","Moving-average (MA) models","ARMA and ARIMA models","Hidden Markov Models","★ Diffusion processes as generative models"] },
  { n: 20, cat: "Probability & Statistics", name: "Bayesian statistics", tag: "🟢", lessons: [
    "The Bayesian view of probability","Priors","Likelihoods","Posteriors","Conjugate priors","The Beta–Binomial model","The Normal–Normal model","Noninformative priors","Credible intervals","Posterior predictive distributions","Hierarchical models","Bayesian model comparison","The model evidence","The Laplace approximation","Variational inference","Expectation–maximization (EM)","MCMC for Bayesian inference","Gaussian process regression","★ Bayesian deep learning & uncertainty"] },
  { n: 21, cat: "Probability & Statistics", name: "Information theory", tag: "🟢", lessons: [
    "Information and surprise","Entropy","Joint entropy","Conditional entropy","Mutual information","KL divergence","Cross-entropy","Chain rules for entropy","The data processing inequality","Jensen's inequality in information theory","Source coding and Shannon's theorem","Huffman coding","Arithmetic coding","Channel capacity","The noisy-channel coding theorem","Rate–distortion theory","The maximum entropy principle","f-divergences","The evidence lower bound (ELBO)","★ Cross-entropy loss, KL in VAEs and RL"] },
  { n: 22, cat: "Applied / Computational", name: "Optimization", tag: "🟢", lessons: [
    "Optimization problem formulations","Convex sets","Convex functions","Optimality conditions (unconstrained)","Gradient descent","Convergence rates","Line search methods","Momentum","Nesterov acceleration","Subgradients","Nonsmooth optimization","Proximal methods","Stochastic gradient descent (SGD)","Variance reduction (SVRG, SAG)","AdaGrad","RMSProp","Adam","Coordinate descent","Newton's method","Quasi-Newton methods (BFGS, L-BFGS)","Lagrangian duality","The KKT conditions","The dual problem","Linear programming","Quadratic programming","★ Nonconvex optimization & the DL landscape"] },
  { n: 23, cat: "Applied / Computational", name: "Operations research", tag: "🟡", lessons: [
    "Modeling in operations research","Linear programming formulation","The simplex method","LP duality","Sensitivity analysis","Integer programming","Branch and bound","The transportation problem","The assignment problem","Network flow models","Dynamic programming","Queueing theory","Inventory models","Scheduling models","Stochastic optimization","Robust optimization","★ Resource allocation & scheduling in ML systems"] },
  { n: 24, cat: "Applied / Computational", name: "Game theory", tag: "🟢", lessons: [
    "Games, players, and payoffs","Normal-form games","Dominant strategies","Dominated strategies","Iterated elimination","Pure-strategy Nash equilibrium","Mixed strategies","Mixed-strategy Nash equilibrium","Existence of equilibria","Zero-sum games","The minimax theorem","Extensive-form games","Backward induction","Subgame perfection","Repeated games","Bayesian games","Cooperative games and the core","Evolutionary game theory","Correlated equilibrium","★ GANs as minimax; multi-agent RL"] },
  { n: 25, cat: "Applied / Computational", name: "Dynamical systems & chaos", tag: "🟡", lessons: [
    "States and evolution","One-dimensional flows","Fixed points","Stability of fixed points","Saddle-node bifurcations","Transcritical and pitchfork bifurcations","Two-dimensional linear systems","Phase portraits","Classification of equilibria","Nonlinear systems and linearization","Limit cycles","The Poincaré–Bendixson theorem","Lyapunov functions","Discrete maps","The logistic map","Period doubling","Chaos and sensitive dependence","Strange attractors","Fractals","★ Training dynamics & RNN stability"] },
  { n: 26, cat: "Applied / Computational", name: "Control theory", tag: "🟡", lessons: [
    "Systems, signals, and feedback","Modeling with differential equations","Transfer functions","Block diagrams","System response","Poles and zeros","Stability","Transient response","Steady-state response","The Routh–Hurwitz criterion","Root locus","Frequency response","Bode plots","PID controllers","State-space representation","Controllability","Observability","State feedback and pole placement","The Linear Quadratic Regulator (LQR)","Kalman filtering","Optimal control","★ Control theory ↔ reinforcement learning"] },
  { n: 27, cat: "Applied / Computational", name: "Numerical methods / scientific computing", tag: "🟢", lessons: [
    "The scientific computing workflow","Vectorization","Applied floating-point error","Direct linear solvers in practice","Conjugate gradient (CG)","GMRES","Preconditioning","Power iteration","The QR algorithm","Lanczos iteration","Sparse matrices","Numerical optimization in practice","Automatic differentiation","ODE solvers in practice","PDE solvers in practice","Monte Carlo methods","Randomized numerical linear algebra","GPU and parallel computing","★ Mixed precision & stability in training"] }
];

/* --- helpers ------------------------------------------------------------ */
const pad = (x) => String(x).padStart(2, "0");
const esc = (s) => s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
function slug(s) {
  return s.toLowerCase().replace(/★/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function cleanTitle(t) { return t.replace(/^★\s*/, "").trim(); }
function isCapstone(t) { return /^★/.test(t); }
const lessonId = (t, i) => `math-${pad(t.n)}-${pad(i + 1)}`;

/* --- scaffold content generator (navigable, structured, deepen-later) --- */
function scaffold(topic, title, i, prevId) {
  const T = cleanTitle(title);
  const cap = isCapstone(title);
  const tagline = cap
    ? `Capstone — how ${topic.name.toLowerCase()} shows up directly in CS & ML.`
    : `One concept from ${topic.name}: ${T.toLowerCase()}.`;
  const connections = {
    buildsOn: [ i === 0 ? "the prerequisites for this topic" : `the previous lesson, <i>${cleanTitle(topic.lessons[i - 1])}</i>` ],
    leadsTo:  [ i === topic.lessons.length - 1 ? "the next topic in the track" : `the next lesson, <i>${cleanTitle(topic.lessons[i + 1])}</i>` ],
    usedWith: [ `the other concepts in ${topic.name} and its capstone` ]
  };
  // Only Connections is authored for scaffolds; renderMath shows a "To be authored" note
  // under the remaining sections, so the 5-section structure stays visible.
  return { id: lessonId(topic, i), title: T, tier: topic.tag, tagline, connections, prereqs: prevId ? [prevId] : undefined };
}

/* --- fully-authored lessons (gold standard) ----------------------------- */
const AUTHORED = require("./math-authored.js");

/* --- emit one file per topic ------------------------------------------- */
if (!fs.existsSync(OUT)) throw new Error("lessons/ dir not found");
const includeLines = [];
const orderLines = [];

for (const topic of TOPICS) {
  const objs = [];
  let prevId = null;
  topic.lessons.forEach((title, i) => {
    const id = lessonId(topic, i);
    const base = AUTHORED[id] || scaffold(topic, title, i, prevId);
    // authored entries may omit prereqs; chain them if absent
    if (!base.prereqs && prevId) base.prereqs = [prevId];
    if (!base.id) base.id = id;
    if (!base.title) base.title = cleanTitle(title);
    objs.push(base);
    prevId = id;
  });

  const body = objs.map((o) => {
    const demo = o.demo;
    const data = Object.assign({}, o);
    delete data.demo;
    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);
    const literal = JSON.stringify(data, null, 2).replace(/\n/g, "\n  ");
    return (typeof demo === "function")
      ? `  B(Object.assign(${literal}, {\n    demo: ${demo.toString()}\n  }));`
      : `  B(${literal});`;
  }).join("\n\n");

  const file =
    `/* Mathematics for ML — Topic ${topic.n}: ${topic.name} (${topic.cat}) ${topic.tag}\n` +
    `   Generated by tools/gen-math.js. Structure lives in tools/math-authored.js + the renderMath template. */\n` +
    `(function () {\n` +
    `  window.LESSONS = window.LESSONS || [];\n` +
    `  const M = ${JSON.stringify(topic.name)};\n` +
    `  const BK = ${JSON.stringify("Mathematics · " + topic.cat)};\n` +
    `  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "math", superGroup: "Math", book: BK }, o));\n\n` +
    body + `\n})();\n`;

  const fname = `math-${pad(topic.n)}-${slug(topic.name)}.js`;
  fs.writeFileSync(path.join(OUT, fname), file);
  includeLines.push(`<script src="lessons/${fname}"></script>`);
  orderLines.push(`    ${JSON.stringify(topic.name)},`);
}

/* --- write helper snippets for wiring into index.html ------------------ */
fs.writeFileSync(path.join(__dirname, "math-includes.snippet.html"),
  "<!-- Mathematics for ML — generated math track -->\n" + includeLines.join("\n") + "\n");
fs.writeFileSync(path.join(__dirname, "math-order.snippet.txt"), orderLines.join("\n") + "\n");

const total = TOPICS.reduce((a, t) => a + t.lessons.length, 0);
const authored = Object.keys(AUTHORED).length;
console.log(`Wrote ${TOPICS.length} topic files, ${total} lessons (${authored} authored, ${total - authored} scaffolded).`);
console.log("Snippets: tools/math-includes.snippet.html, tools/math-order.snippet.txt");
