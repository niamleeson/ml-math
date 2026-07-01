/* Plan-applied content for Topic 05 (Functional analysis).
   Field-level override merged by tools/math-authored.js (sorts last → wins).
   Only plan-derived fields are set here; worked/practice/title/tagline are preserved
   from the base entry. LaTeX uses natural single backslashes and is normalized by
   tools/fix-latex-backslashes.js. Source: plans/math/math-part-05-functional-analysis.md */
module.exports = {
  "math-05-01": {
    connectionsProse:
      "<p>This opening lesson supplies the algebraic ground for the whole section. Earlier linear algebra work treated vectors as coordinate lists, and that picture is still useful here. Functional analysis keeps the same addition and scaling rules while allowing the vectors to be functions, signals, distributions of coefficients, or infinite sequences. Once those rules are stable, later lessons can talk about norms, limits, operators, and projections without rechecking the basic algebra each time.</p>",
    motivation:
      "<p>A vector space is the setting where linear combinations make sense. If two objects are allowed models, signals, or states, then adding them and multiplying them by scalars should produce another object of the same kind. That closure property is what lets a learner average embeddings, mix signals, add polynomial terms, or form residual directions without leaving the space being studied.</p>" +
      "<p>In functional analysis this matters more than it first appears, because the objects are often not finite coordinate vectors. They may be functions in a hypothesis class or infinite coefficient sequences in a basis expansion. The subspace test in this lesson is the local version of the same idea: check zero, addition, and scaling, and then the larger machinery of linear analysis can safely apply inside the candidate set.</p>",
    definition:
      "<p>A <b>vector space</b> is a set of objects closed under vector addition and scalar multiplication; a subset $W$ is a subspace when it contains zero and remains closed under those same two operations.</p>" +
      "<p><b>Assumptions that matter:</b> the ambient operations are fixed, the scalars come from the chosen field, and closure means the result stays inside the same set.</p>",
    symbols: [
      { sym: "$V$", desc: "a vector space" },
      { sym: "$u,v$", desc: "vectors" },
      { sym: "$a,b,c$", desc: "scalars" },
      { sym: "$W$", desc: "a candidate subspace" },
      { sym: "closure", desc: "the result stays inside the same set" }
    ],
    derivation: [
      { do: "Write an arbitrary element of $W$", result: "$u=(a,-a)$", why: "every point in $W$ has coordinates summing to $0$" },
      { do: "Write a second arbitrary element", result: "$v=(b,-b)$", why: "the addition check needs two general points" },
      { do: "Add the two vectors", result: "$u+v=(a+b,-a-b)$", why: "addition is coordinatewise" },
      { do: "Sum the coordinates", result: "$(a+b)+(-a-b)=0$", why: "the terms cancel" },
      { do: "Scale $u$ by $c$", result: "$cu=(ca,-ca)$", why: "scalar multiplication is coordinatewise" },
      { do: "Sum the scaled coordinates", result: "$ca-ca=0$", why: "scaling preserves the defining equation" },
      { do: "Check the zero vector", result: "$(0,0)\\in W$", why: "$0+0=0$" },
      { do: "Conclude the subspace test", result: "$W$ is a vector space", why: "it contains zero and is closed under addition and scaling inside $\\mathbb R^2$" }
    ],
    applications: [
      { title: "Feature vectors", background: "Feature vectors stay in the same space under linear combinations.", numbers: "$0.5[2,5]+[1,-1]=[2,1.5]$." },
      { title: "Image space", background: "Averaging images is coordinatewise vector addition and scaling.", numbers: "average of $[1,2,3,4]$ and $[4,3,2,1]$ is $[2.5,2.5,2.5,2.5]$." },
      { title: "Polynomial models", background: "Polynomial model classes are closed under addition when degree limits are respected.", numbers: "$(3+2x-x^2)+(1+x^2)=4+2x$." },
      { title: "Signal mixtures", background: "Signals can be mixed by adding and scaling functions.", numbers: "$2t+(1-t)=1+t$." },
      { title: "Mean embeddings", background: "A mean embedding is an average of vector embeddings.", numbers: "$([1,3]+[2,5]+[4,1])/3=[7/3,3]$." },
      { title: "Constraint subspace", background: "A sum-zero constraint is preserved by adding compatible vectors.", numbers: "$[1,-1,0]+[2,0,-2]=[3,-1,-2]$ and the coordinates still sum to $0$." }
    ]
  },
  "math-05-02": {
    connectionsProse:
      "<p>This lesson builds directly on vector spaces by studying maps that respect their two basic operations. A linear operator is the natural way to move from one vector space to another without breaking addition or scaling. Matrices are the finite-dimensional model, but the same definition also covers derivatives, projections, expectations, shifts, and integral transforms. Later operator norms, boundedness, compactness, and spectral decompositions all begin with this linearity rule.</p>",
    motivation:
      "<p>Once vectors can be added and scaled, the next question is which transformations preserve that structure. A linear operator sends a linear combination of inputs to the same linear combination of outputs. That is why knowing the operator on basis vectors is enough in finite dimensions: every other input is built from those basis vectors with fixed coefficients.</p>" +
      "<p>This simple preservation rule is the reason very different procedures can share one analysis. A dense layer, a fixed convolution, and differentiation all distribute over sums and scalars when the underlying assumptions are fixed. Functional analysis uses that shared structure to study stability, approximation, spectra, and kernels in spaces much larger than ordinary matrix spaces.</p>",
    definition:
      "<p>A <b>linear operator</b> $T:V\\to W$ is a map that preserves addition and scalar multiplication.</p>" +
      "<p>$$T(au+bv)=aT(u)+bT(v).$$</p>" +
      "<p><b>Assumptions that matter:</b> $V$ and $W$ are vector spaces over the same scalar field, and the coefficients in a basis expansion are fixed by the input vector.</p>",
    symbols: [
      { sym: "$T:V\\to W$", desc: "the operator" },
      { sym: "$v_i$", desc: "basis vectors" },
      { sym: "$c_i$", desc: "coordinates" },
      { sym: "$T(au+bv)=aT(u)+bT(v)$", desc: "linearity" }
    ],
    derivation: [
      { do: "Start with a basis expansion", result: "$x=c_1v_1+\\cdots+c_nv_n$", why: "a basis writes every vector as a unique linear combination" },
      { do: "Apply $T$", result: "$T(x)=T(c_1v_1+\\cdots+c_nv_n)$", why: "$T$ acts on vectors" },
      { do: "Pull out the first scalar", result: "$T(c_1v_1+\\cdots)=c_1T(v_1)+T(c_2v_2+\\cdots)$", why: "linearity preserves scaling and sums" },
      { do: "Repeat for each term", result: "$T(x)=c_1T(v_1)+\\cdots+c_nT(v_n)$", why: "each basis component is handled the same way" },
      { do: "Conclude basis determination", result: "$T$ is determined by the images $T(v_i)$", why: "the coefficients $c_i$ are fixed by $x$" }
    ],
    applications: [
      { title: "Dense layer", background: "A fixed matrix acts linearly on an input vector.", numbers: "$\\begin{bmatrix}1&2\\3&4\\end{bmatrix}[1,2]^T=[5,11]^T$." },
      { title: "Fixed convolution", background: "A fixed convolution filter is a linear dot product on a window.", numbers: "$[1,0,-1]\\cdot[2,5,4]=-2$." },
      { title: "Differentiation", background: "Differentiation is linear on differentiable functions.", numbers: "$\\frac{d}{dx}\\left(3x^2+5x\\right)=6x+5$." },
      { title: "Expectation", background: "Expectation preserves linear combinations.", numbers: "$E[3X-Y]=3\\cdot2-5=1$." },
      { title: "PCA projection", background: "Projection onto a coordinate subspace is linear.", numbers: "$[3,4]$ onto first coordinate becomes $[3,0]$." },
      { title: "Graph swap matrix", background: "A permutation matrix linearly swaps coordinates.", numbers: "$\\begin{bmatrix}0&1\\1&0\\end{bmatrix}[7,2]^T=[2,7]^T$." }
    ]
  },
  "math-05-03": {
    connectionsProse:
      "<p>Vector spaces provide algebra, and this lesson adds size. A norm tells us how large a vector is and therefore how far two vectors are from each other. With that distance in place, statements about convergence, approximation error, robustness, and regularization become precise. Banach spaces, Hilbert spaces, bounded operators, and weak convergence all depend on having a fixed norm before any limiting argument begins.</p>",
    motivation:
      "<p>A norm is more than a length formula. It is the rule that turns an algebraic vector space into a space where closeness can be measured. Once $\\|u-v\\|$ is available, the same language can describe residual error in regression, perturbation size in robustness, and the magnitude of a function difference.</p>" +
      "<p>The axioms are exactly the properties needed for this measurement to behave like size. Positivity says only the zero vector has zero size, homogeneity says scaling changes size by the absolute scale factor, and the triangle inequality says indirect travel is not shorter than the direct displacement. The derivation shows that these three rules automatically create a metric, so every normed space comes with a usable notion of distance.</p>",
    definition:
      "<p>A <b>norm</b> assigns each vector a nonnegative size satisfying positivity, homogeneity, and the triangle inequality. It induces a distance by taking the norm of the displacement.</p>" +
      "<p>$$d(u,v)=\\|u-v\\|.$$</p>" +
      "<p><b>Assumptions that matter:</b> the vector space and scalar field are fixed, and the same norm is used for all distance and convergence statements.</p>",
    symbols: [
      { sym: "$\\|v\\|$", desc: "the norm of $v$" },
      { sym: "$d(u,v)$", desc: "distance" },
      { sym: "$a$", desc: "a scalar" },
      { sym: "$u,v,w$", desc: "vectors" }
    ],
    derivation: [
      { do: "State positivity", result: "$\\|v\\|\\ge0$ and $\\|v\\|=0\\iff v=0$", why: "only the zero vector has no size" },
      { do: "State homogeneity", result: "$\\|av\\|=|a|\\|v\\|$", why: "scaling a vector scales its length by the absolute scalar" },
      { do: "State triangle inequality", result: "$\\|u+v\\|\\le\\|u\\|+\\|v\\|$", why: "a direct trip is no longer than going in two legs" },
      { do: "Define distance", result: "$d(u,v)=\\|u-v\\|$", why: "distance is the size of the displacement" },
      { do: "Check nonnegativity", result: "$d(u,v)\\ge0$", why: "this follows from positivity" },
      { do: "Check identity of indiscernibles", result: "$d(u,v)=0\\iff u=v$", why: "$u-v=0$" },
      { do: "Check symmetry", result: "$d(u,v)=\\|u-v\\|=\\|-(v-u)\\|=|{-1}|\\|v-u\\|=d(v,u)$", why: "homogeneity handles the minus sign" },
      { do: "Check triangle", result: "$d(u,w)=\\|u-w\\|=\\|(u-v)+(v-w)\\|\\le\\|u-v\\|+\\|v-w\\|$", why: "the norm triangle inequality applies to the two displacements" },
      { do: "Conclude metric structure", result: "a norm creates a metric", why: "all distance rules follow" }
    ],
    applications: [
      { title: "Residual norm", background: "Regression error can be measured by a vector norm.", numbers: "$[2,-1,2]$ has $\\ell_2$ norm $3$." },
      { title: "Weight penalty", background: "Regularization often penalizes squared weight norm.", numbers: "$[3,4]$ gives $\\|w\\|_2^2=25$." },
      { title: "Gradient clipping", background: "Clipping rescales a large gradient to a target norm.", numbers: "$[6,8]$ has norm $10$ and clips to norm $5$ as $[3,4]$." },
      { title: "$\\ell_\\infty$ perturbation", background: "The infinity norm measures the largest coordinate perturbation.", numbers: "$[0.01,-0.02,0.02]$ has size $0.02$." },
      { title: "Embedding distance", background: "Embedding differences can be measured as Euclidean displacement.", numbers: "$[1,2]$ to $[4,6]$ is $5$." },
      { title: "Function error", background: "Uniform error is controlled by the supremum norm.", numbers: "if $|f(t)-g(t)|\\le0.03$ for all $t$, then $\\|f-g\\|_\\infty\\le0.03$." }
    ]
  },
  "math-05-04": {
    connectionsProse:
      "<p>This lesson follows norms by asking whether limits stay inside the space. In finite-dimensional Euclidean spaces that usually happens automatically, but functional analysis often works in spaces where missing limits are a real issue. Completeness is the condition that prevents a Cauchy approximation process from converging to something outside the allowed space. Hilbert spaces later add inner products to this same completeness requirement.</p>",
    motivation:
      "<p>A Cauchy sequence is a sequence whose late terms become close to each other, even before a candidate limit has been named. Completeness says that this internal settling is enough: there is an actual point in the space that the sequence approaches. Without completeness, approximations can look perfectly stable from within the norm while still having no legal destination in the space.</p>" +
      "<p>A Banach space is simply a normed space where that failure has been ruled out. This is why the lesson is definition-heavy rather than formula-heavy. The examples distinguish complete and incomplete settings: real numbers contain the limits of their Cauchy sequences, while rational numbers can have rational approximations that settle toward an irrational limit not present in the space.</p>",
    definition:
      "<p>A <b>Banach space</b> is a normed vector space in which every Cauchy sequence converges to an element of the same space.</p>" +
      "<p>$$\\forall\\varepsilon>0\\;\\exists N\\;\\forall n,m\\ge N:\\ \\|x_n-x_m\\|<\\varepsilon.$$</p>" +
      "<p><b>Assumptions that matter:</b> the norm is fixed, convergence is measured in that norm, and completeness is about limits remaining inside the space.</p>",
    symbols: [
      { sym: "$(x_n)$", desc: "a sequence" },
      { sym: "$\\varepsilon$", desc: "a tolerance" },
      { sym: "$N$", desc: "the point after which all late terms are close" },
      { sym: "$\\|x_n-x_m\\|$", desc: "pairwise distance" },
      { sym: "Banach", desc: "complete normed space" }
    ],
    applications: [
      { title: "Fixed-point iteration", background: "A contraction iteration has errors that shrink geometrically.", numbers: "error $10(0.5)^{10}=0.00977$." },
      { title: "Infinite updates", background: "A complete space contains the limit of a convergent update series.", numbers: "$1/2+1/4+1/8+\\cdots=1$." },
      { title: "Uniform function limit", background: "Supremum-norm convergence controls every output at once.", numbers: "$\\|f_n-f\\|_\\infty<0.001$ means every output differs by less than $0.001$." },
      { title: "Decimal approximations", background: "Real numbers contain limits of Cauchy decimal approximations.", numbers: "$0.7071$ approximates $1/\\sqrt2$ in complete $\\mathbb R$." },
      { title: "Weight sequence", background: "Coordinatewise settling remains inside Euclidean space.", numbers: "$(1/n,3)\\to(0,3)$ remains in $\\mathbb R^2$." },
      { title: "Value iteration", background: "Discounted errors decay but may remain visible after finite steps.", numbers: "$5(0.9)^{20}\\approx0.608$." }
    ]
  },
  "math-05-05": {
    connectionsProse:
      "<p>Norms measure size, and inner products add geometry. This lesson explains how alignment, angle, orthogonality, energy, and projection all come from one bilinear measurement. The Hilbert-space model entry then combines this geometry with completeness. Orthonormal bases, projections, best approximation, Riesz representation, and RKHS evaluation all use the inner product as their basic measuring device.</p>",
    motivation:
      "<p>An inner product records how much two vectors point in the same direction. When the two vectors are the same, that self-alignment gives squared length. When the value is zero, the vectors are orthogonal, which is the geometry behind residual checks, Fourier coefficients, and least-squares normal equations.</p>" +
      "<p>The Cauchy-Schwarz inequality is the central safety bound for this geometry. It says that alignment cannot exceed the product of the two lengths, so an inner product measurement is controlled by the norms of its inputs. The derivation subtracts the best multiple of one vector from another and uses nonnegativity of squared length, which is the same projection idea that later becomes a full theorem in Hilbert spaces.</p>",
    definition:
      "<p>An <b>inner product</b> is a positive-definite bilinear measurement of alignment; it induces the norm $\\|x\\|=\\sqrt{\\langle x,x\\rangle}$ and obeys Cauchy-Schwarz.</p>" +
      "<p>$$|\\langle x,y\\rangle|\\le\\|x\\|\\|y\\|.$$</p>" +
      "<p><b>Assumptions that matter:</b> the real-case derivation uses bilinearity and positive definiteness; in complex spaces conjugates are handled by the complex inner-product convention.</p>",
    symbols: [
      { sym: "$\\langle x,y\\rangle$", desc: "the inner product" },
      { sym: "$\\|x\\|=\\sqrt{\\langle x,x\\rangle}$", desc: "the induced norm" },
      { sym: "$a$", desc: "a projection coefficient" },
      { sym: "orthogonal", desc: "inner product $0$" }
    ],
    derivation: [
      { do: "Handle the zero case", result: "if $y=0$, then $|\\langle x,y\\rangle|=0$", why: "the inequality is done" },
      { do: "Define the projection coefficient", result: "$a=\\langle x,y\\rangle/\\langle y,y\\rangle$", why: "this is the coefficient of $x$ along $y$ when $y\\ne0$" },
      { do: "Subtract the parallel part", result: "$x-ay$", why: "this removes the component along $y$" },
      { do: "Use positivity", result: "$0\\le\\langle x-ay,x-ay\\rangle$", why: "squared length is nonnegative" },
      { do: "Expand in the real case", result: "$\\|x\\|^2-2a\\langle x,y\\rangle+a^2\\|y\\|^2$", why: "bilinearity distributes the inner product" },
      { do: "Substitute $a$", result: "$0\\le\\|x\\|^2-\\langle x,y\\rangle^2/\\|y\\|^2$", why: "the projection coefficient simplifies the quadratic" },
      { do: "Rearrange", result: "$\\langle x,y\\rangle^2\\le\\|x\\|^2\\|y\\|^2$", why: "move the second term to the other side" },
      { do: "Take square roots", result: "$|\\langle x,y\\rangle|\\le\\|x\\|\\|y\\|$", why: "both sides are nonnegative" }
    ],
    applications: [
      { title: "Cosine similarity", background: "Cosine similarity normalizes an inner product by lengths.", numbers: "$[1,1]\\cdot[2,0]=2$ and norms $\\sqrt2,2$ give $0.707$." },
      { title: "Least-squares residual", background: "A fitted residual is checked by orthogonality.", numbers: "$[1,-1]\\cdot[1,1]=0$." },
      { title: "Signal energy", background: "A signal's self inner product is its squared energy.", numbers: "$[2,-1,2]$ has $\\langle s,s\\rangle=9$." },
      { title: "Attention score", background: "Attention logits use dot-product alignment.", numbers: "$[1,2]\\cdot[3,1]=5$." },
      { title: "Linear kernel", background: "The linear kernel is the ordinary inner product.", numbers: "$K([1,2],[3,4])=11$." },
      { title: "Fourier coefficient", background: "A coefficient on a unit direction is an inner product.", numbers: "if unit $e$ has $\\langle f,e\\rangle=2.5$, the coefficient is $2.5$." }
    ]
  },
  "math-05-06": {
    connectionsProse:
      "<p>This lesson joins two ideas that have already been introduced separately. A norm tells us when vectors are close and when a sequence of approximations is settling down. An inner product gives geometry: lengths, angles, orthogonality, and projections. A Hilbert space is the setting where both structures work together and where limits of Cauchy sequences stay inside the space.</p>" +
      "<p>This matters because functional analysis often studies vectors that are not short coordinate lists. They may be signals, square-integrable functions, infinite coefficient sequences, or kernel sections. Hilbert spaces let those objects keep the familiar geometry of Euclidean space while allowing infinitely many coordinates. The next lessons on orthonormal bases, projections, best approximation, Riesz representation, and RKHS all rely on this combination of geometry and completeness.</p>",
    motivation:
      "<p>In ordinary Euclidean space, a vector has a length, two vectors can be perpendicular, and a Cauchy sequence of vectors has a limit in the same space. Those facts are so familiar that it is easy to forget how much they support: least squares has a closest fitted vector, Fourier coefficients have a squared-energy sum, and an optimizer can measure whether updates are getting small.</p>" +
      "<p>A Hilbert space keeps exactly that structure in a larger setting. The inner product gives the geometry, and the induced norm $\\|x\\|=\\sqrt{\\langle x,x\\rangle}$ measures convergence. Completeness then says that if a sequence of vectors becomes internally consistent under that norm, its limit is still a valid vector in the space. That last condition is essential in infinite dimensions, where a sequence of polynomials, signals, or basis expansions can approach a limit that is not present unless the space has been completed.</p>" +
      "<p>The model example is $\\ell^2$, the space of infinite sequences whose squared entries add to a finite number. A sequence such as $(1,1/2,1/4,\\ldots)$ is a genuine Hilbert-space vector because its squared entries form a convergent geometric series. That single example previews the rest of the section: infinite objects can be treated geometrically when their energy is finite and their limits remain inside the space.</p>",
    definition:
      "<p>A <b>Hilbert space</b> is an inner-product space that is complete under the norm induced by that inner product.</p>" +
      "<p>$$H\\text{ is Hilbert} \\quad\\Longleftrightarrow\\quad H\\text{ is an inner-product space complete under }\\|x\\|=\\sqrt{\\langle x,x\\rangle}.$$</p>" +
      "<p><b>Assumptions that matter:</b> the inner product is fixed, convergence is measured by its induced norm, and every Cauchy sequence in that norm must converge to an element of $H$.</p>",
    symbols: [
      { sym: "$H$", desc: "the Hilbert space" },
      { sym: "$x$", desc: "a vector, function, or sequence in it" },
      { sym: "$\\langle x,y\\rangle$", desc: "the inner product" },
      { sym: "$\\|x\\|$", desc: "the norm induced by that inner product" },
      { sym: "$\\ell^2$", desc: "the space of square-summable sequences" },
      { sym: "completeness", desc: "every Cauchy sequence in this norm converges to an element of $H$" }
    ],
    derivation: [
      { do: "Write the sequence", result: "$x=(1,1/2,1/4,1/8,\\ldots)$", why: "$\\ell^2$ membership is tested by the squared entries" },
      { do: "Square each entry", result: "$1,1/4,1/16,1/64,\\ldots$", why: "$\\|x\\|_2^2=\\sum_k |x_k|^2$" },
      { do: "Recognize the ratio", result: "$r=1/4$", why: "each squared term is one fourth of the previous one" },
      { do: "Use the geometric-series formula", result: "$\\sum_{k=0}^\\infty r^k=1/(1-r)$", why: "$|r|<1$" },
      { do: "Substitute the ratio", result: "$\\sum_{k=0}^\\infty (1/4)^k=1/(1-1/4)$", why: "this is the exact squared norm" },
      { do: "Simplify", result: "$1/(1-1/4)=1/(3/4)=4/3$", why: "subtracting the denominator gives the finite energy" },
      { do: "Take the square root", result: "$\\|x\\|_2=\\sqrt{4/3}=2/\\sqrt3\\approx1.1547$", why: "norm is the square root of squared norm" },
      { do: "Conclude membership", result: "$x\\in\\ell^2$", why: "the squared sum is finite" }
    ],
    applications: [
      { title: "Finite-energy signals", background: "A finite signal vector has Hilbert norm equal to the square root of its energy.", numbers: "Samples $(1,2,2)$ have energy $1^2+2^2+2^2=9$ and Hilbert norm $3$." },
      { title: "Fourier coefficients", background: "Square-summable coefficients form an $\\ell^2$ vector.", numbers: "Coefficients $(1,1/2,1/4,\\ldots)$ have squared energy $4/3$ and norm $1.1547$." },
      { title: "Kernel feature vectors", background: "Kernel values determine Hilbert-space cosines between hidden features.", numbers: "If hidden features have $k(a,a)=4$, $k(b,b)=9$, and $k(a,b)=3$, their Hilbert cosine is $3/(2\\cdot3)=0.5$." },
      { title: "Quantum-style unit states", background: "A unit state has total squared amplitude one.", numbers: "Amplitudes $(1/\\sqrt2,1/\\sqrt2)$ have squared norm $1/2+1/2=1$." },
      { title: "Least-squares geometry", background: "Projection geometry measures residual length in a Hilbert norm.", numbers: "Projecting $(3,4)$ onto the $x$-axis gives $(3,0)$ and residual norm $4$." },
      { title: "Embedding normalization", background: "Embeddings can be scaled to unit Hilbert norm.", numbers: "Vector $(3,4)$ becomes $(0.6,0.8)$ after division by its Hilbert norm $5$." }
    ]
  },
  "math-05-07": {
    connectionsProse:
      "<p>After Hilbert spaces, this lesson introduces the cleanest coordinate systems available there. An orthonormal basis uses unit directions that are mutually perpendicular, so coefficients can be read by inner products. This connects the familiar coordinate picture from Euclidean space to Fourier, wavelet, PCA, and feature expansions. Projection and best approximation become especially transparent once the allowed directions are orthonormal.</p>",
    motivation:
      "<p>A general basis can represent vectors, but its coordinates may be hard to compute and its lengths may not decompose cleanly. An orthonormal basis removes those complications. Each coordinate is obtained by testing against the matching basis vector, and the perpendicularity of the other directions makes all cross terms vanish.</p>" +
      "<p>Parseval's identity is the energy statement that results. The squared norm of the vector becomes the sum of squared coefficients, just as in ordinary right-triangle geometry. In functional analysis this is the bridge from infinite objects to manageable coefficient sequences: the geometry of a signal or function can be studied through the energy of its orthonormal expansion.</p>",
    definition:
      "<p>An <b>orthonormal basis</b> is a spanning family of unit, mutually orthogonal vectors, so coordinates are inner products and squared norm is coefficient energy.</p>" +
      "<p>$$x=\\sum_k \\langle x,e_k\\rangle e_k,\\qquad \\|x\\|^2=\\sum_k |\\langle x,e_k\\rangle|^2.$$</p>" +
      "<p><b>Assumptions that matter:</b> the basis is orthonormal in the chosen inner product and spans the space under the relevant finite or Hilbert-space limit sense.</p>",
    symbols: [
      { sym: "$e_k$", desc: "basis vectors" },
      { sym: "$c_k$", desc: "coordinates" },
      { sym: "orthonormal", desc: "$\\langle e_i,e_j\\rangle=\\delta_{ij}$" },
      { sym: "Parseval", desc: "the squared-energy identity" }
    ],
    derivation: [
      { do: "Write the expansion", result: "$x=\\sum_k c_ke_k$", why: "the orthonormal basis spans the space" },
      { do: "Take inner product with $e_j$", result: "$\\langle x,e_j\\rangle=\\langle\\sum_k c_ke_k,e_j\\rangle$", why: "this tests the $j$th direction" },
      { do: "Move the sum out", result: "$\\sum_k c_k\\langle e_k,e_j\\rangle$", why: "the inner product is linear" },
      { do: "Use orthonormality", result: "$\\langle e_k,e_j\\rangle=0$ for $k\\ne j$ and $1$ for $k=j$", why: "orthonormal directions are perpendicular and unit length" },
      { do: "Read the coefficient", result: "$\\langle x,e_j\\rangle=c_j$", why: "only one term remains" },
      { do: "Compute squared norm", result: "$\\|x\\|^2=\\langle\\sum_i c_ie_i,\\sum_j c_je_j\\rangle$", why: "norm comes from the inner product" },
      { do: "Remove cross terms", result: "cross terms vanish", why: "orthogonality kills all $i\\ne j$ terms" },
      { do: "Get Parseval", result: "$\\|x\\|^2=\\sum_k c_k^2$", why: "only squared coefficients remain" }
    ],
    applications: [
      { title: "Fourier features", background: "Orthonormal Fourier coefficients add by squared energy.", numbers: "coefficients $3,4$ on unit waves give norm $5$." },
      { title: "PCA coordinates", background: "PCA coordinates in orthonormal components preserve Euclidean length.", numbers: "$(2,-1)$ has squared length $5$." },
      { title: "Compression", background: "Dropping an orthonormal coefficient loses its squared magnitude as energy.", numbers: "dropping coefficient $0.1$ loses energy $0.01$." },
      { title: "Wavelet transform", background: "An orthonormal wavelet transform preserves energy.", numbers: "$[8,0,0,0]$ has energy $64$." },
      { title: "QR", background: "Multiplication by an orthonormal-column matrix preserves coefficient norm.", numbers: "if $Q$ has orthonormal columns and $c=[3,4]$, then $\\|Qc\\|=5$." },
      { title: "Feature analysis", background: "Inner products read off orthonormal feature coordinates.", numbers: "$x=2e_1+0.5e_2$ has coefficient $2$ along $e_1$." }
    ]
  },
  "math-05-08": {
    connectionsProse:
      "<p>This lesson uses orthonormal coordinates to formalize the idea of keeping the part of a vector that lies in a chosen subspace. Projection is already familiar from shadows and least squares, and Hilbert spaces make it an exact geometric operation. The residual left after projection is perpendicular to the subspace. That orthogonality is the engine behind best approximation, regression normal equations, PCA truncation, and denoising.</p>",
    motivation:
      "<p>A projection separates a vector into an allowed component and an error component. The allowed component lies in the chosen subspace, while the residual contains everything that the subspace cannot express. When the subspace has an orthonormal basis, the projection is built by taking each inner-product coefficient and adding the corresponding basis direction.</p>" +
      "<p>The important point is not only that the formula produces a vector in the subspace. It also makes the residual orthogonal to every direction in that subspace. Because of Pythagoras, any other candidate in the subspace adds extra squared distance, so the projection is the closest allowed vector.</p>",
    definition:
      "<p>The <b>orthogonal projection</b> $P_Mx$ of $x$ onto a closed subspace $M$ is the vector $p\\in M$ such that the residual $x-p$ is orthogonal to $M$.</p>" +
      "<p>$$P_Mx=\\sum_j\\langle x,e_j\\rangle e_j.$$</p>" +
      "<p><b>Assumptions that matter:</b> $M$ is closed, the listed $e_j$ form an orthonormal basis for $M$, and the inner product determines orthogonality.</p>",
    symbols: [
      { sym: "$P_Mx=p$", desc: "the projection" },
      { sym: "$M$", desc: "a closed subspace" },
      { sym: "$e_j$", desc: "orthonormal directions" },
      { sym: "$x-p$", desc: "residual error" }
    ],
    derivation: [
      { do: "Choose an orthonormal basis", result: "$e_1,\\ldots,e_k$ for $M$", why: "coefficients are inner products" },
      { do: "Define the projection", result: "$p=\\sum_j\\langle x,e_j\\rangle e_j$", why: "this keeps each basis component inside $M$" },
      { do: "Test the residual", result: "$\\langle x-p,e_i\\rangle=\\langle x,e_i\\rangle-\\sum_j\\langle x,e_j\\rangle\\langle e_j,e_i\\rangle$", why: "subtract the projected component and use linearity" },
      { do: "Use orthonormality", result: "the sum equals $\\langle x,e_i\\rangle$", why: "only the $j=i$ term survives" },
      { do: "Conclude orthogonality", result: "$\\langle x-p,e_i\\rangle=0$ for every basis vector", why: "so $x-p\\perp M$" },
      { do: "Compare any other $m\\in M$", result: "$x-m=(x-p)+(p-m)$", why: "split the error into residual plus in-subspace difference" },
      { do: "Identify orthogonal terms", result: "$x-p\\perp(p-m)$", why: "$p-m\\in M$" },
      { do: "Apply Pythagoras", result: "$\\|x-m\\|^2=\\|x-p\\|^2+\\|p-m\\|^2\\ge\\|x-p\\|^2$", why: "extra in-subspace movement can only add squared distance" }
    ],
    applications: [
      { title: "Regression on constants", background: "Projecting data onto constants gives the mean vector.", numbers: "$[1,2,2]$ projects to $[5/3,5/3,5/3]$." },
      { title: "PCA", background: "Projection keeps selected principal coefficients and drops the rest.", numbers: "keeping coefficients $5,2$ and dropping $0.1$ leaves squared error $0.01$." },
      { title: "Residual check", background: "A projection residual is orthogonal to retained directions.", numbers: "$[1,-1]\\cdot[1,1]=0$." },
      { title: "Denoising", background: "Projection can keep a signal component and drop a noise component.", numbers: "$3e_1+0.2e_2$ projects to $3e_1$ and drops energy $0.04$." },
      { title: "Debiasing", background: "Subtracting a projection removes a selected direction.", numbers: "$[3,4]$ minus projection onto $[1,0]$ leaves $[0,4]$." },
      { title: "Shadow", background: "A coordinate-plane shadow is an orthogonal projection.", numbers: "$(2,3,5)$ projected onto the $xy$-plane is $(2,3,0)$." }
    ]
  },
  "math-05-09": {
    connectionsProse:
      "<p>Projection leads naturally to best approximation. Instead of representing a target exactly, this lesson studies the closest vector allowed by a model space. In Euclidean regression this is least squares; in Hilbert spaces it is the projection theorem in action. Later Riesz, RKHS, and representer-theorem arguments use the same split between visible model directions and orthogonal residuals.</p>",
    motivation:
      "<p>Best approximation starts from a practical limitation: the target vector may not lie in the model space. The goal is then to choose the allowed vector with the smallest error norm. In a Hilbert space, the decisive condition is geometric rather than mysterious: at the closest point, the residual must be orthogonal to every direction in which the model can move.</p>" +
      "<p>For a one-parameter model, this condition becomes the familiar least-squares normal equation. Expanding the squared error gives a quadratic in the coefficient, and differentiating identifies the minimum. Rewriting the result as an orthogonality statement shows the deeper pattern that survives beyond one-dimensional regression.</p>",
    definition:
      "<p>A <b>best approximation</b> to $y$ from a model subspace is the allowed vector $m^*$ minimizing $\\|y-m\\|$; in a Hilbert space its residual is orthogonal to the model space.</p>" +
      "<p>$$a=\\frac{\\langle y,x\\rangle}{\\langle x,x\\rangle},\\qquad \\langle y-ax,x\\rangle=0.$$</p>" +
      "<p><b>Assumptions that matter:</b> the model direction $x$ is nonzero, squared norm is minimized, and the Hilbert inner product defines orthogonality.</p>",
    symbols: [
      { sym: "$y$", desc: "the target vector" },
      { sym: "$x$", desc: "a feature direction" },
      { sym: "$a$", desc: "the fitted coefficient" },
      { sym: "$m^*$", desc: "the closest point" },
      { sym: "residual", desc: "$y-m^*$" }
    ],
    derivation: [
      { do: "Choose the model form", result: "$ax$", why: "the model space is span$(x)$" },
      { do: "Define the error objective", result: "$E(a)=\\|y-ax\\|^2$", why: "squared distance gives the same minimizer" },
      { do: "Expand as an inner product", result: "$E(a)=\\langle y-ax,y-ax\\rangle$", why: "Hilbert norm comes from the inner product" },
      { do: "Distribute", result: "$\\|y\\|^2-2a\\langle y,x\\rangle+a^2\\|x\\|^2$", why: "bilinearity expands the quadratic" },
      { do: "Differentiate", result: "$E'(a)=-2\\langle y,x\\rangle+2a\\|x\\|^2$", why: "this is a quadratic in $a$" },
      { do: "Set the derivative to zero", result: "$E'(a)=0$", why: "a quadratic minimum has zero derivative" },
      { do: "Solve for the coefficient", result: "$a=\\langle y,x\\rangle/\\langle x,x\\rangle$", why: "$x$ is nonzero" },
      { do: "Rewrite as orthogonality", result: "$\\langle y-ax,x\\rangle=0$", why: "the residual is orthogonal to the feature direction" }
    ],
    applications: [
      { title: "Through-origin line", background: "Least squares through the origin fits one slope coefficient.", numbers: "points $(1,2),(2,3)$ give slope $(2\\cdot1+3\\cdot2)/(1^2+2^2)=8/5=1.6$." },
      { title: "PCA compression", background: "The best orthogonal approximation drops small coefficients.", numbers: "dropping coefficient $0.1$ loses squared error $0.01$." },
      { title: "Fourier truncation", background: "Discarded orthonormal coefficients determine truncation error.", numbers: "dropping $0.3,0.4$ gives error norm $0.5$." },
      { title: "Best constant", background: "The best constant approximation is the mean.", numbers: "data $2,4,7$ have mean $13/3\\approx4.333$." },
      { title: "Autoencoder residual", background: "Reconstruction quality is measured by residual squared norm.", numbers: "$[0.1,-0.2]$ has squared error $0.05$." },
      { title: "Distillation", background: "A student-teacher probability mismatch is a vector residual.", numbers: "$[0.7,0.2]-[0.8,0.1]=[-0.1,0.1]$ has norm $\\sqrt{0.02}\\approx0.141$." }
    ]
  },
  "math-05-10": {
    connectionsProse:
      "<p>This lesson turns inner products into a language for measurements. A continuous linear functional may look like an outside probe of a Hilbert space, but Riesz says it is represented by a vector inside the same space. That result links gradients, linear probes, evaluation maps, and dual norms to Hilbert geometry. The RKHS lessons later depend on applying this theorem to point evaluation.</p>",
    motivation:
      "<p>A linear functional takes a vector and returns one number. In finite-dimensional Euclidean space, such a measurement is usually written as a dot product with a coefficient vector. Riesz representation says that the same idea holds in every Hilbert space, provided the functional is continuous.</p>" +
      "<p>The theorem is powerful because it identifies the measurement with its representing vector. Uniqueness means there is only one vector that gives all the same readings, and the norm equality means the size of the functional is exactly the Hilbert norm of that vector. The derivation here focuses on those two structural facts once the representation exists.</p>",
    definition:
      "<p>The <b>Riesz representation theorem</b> says every bounded linear functional on a Hilbert space is uniquely represented by inner product with one vector.</p>" +
      "<p>$$F(x)=\\langle x,y\\rangle,\\qquad \\|F\\|=\\|y\\|.$$</p>" +
      "<p><b>Assumptions that matter:</b> $H$ is a Hilbert space, $F$ is linear and bounded, and the inner-product convention is fixed.</p>",
    symbols: [
      { sym: "$F$", desc: "a bounded linear functional" },
      { sym: "$y$", desc: "the representing vector" },
      { sym: "$H$", desc: "the Hilbert space" },
      { sym: "$\\|F\\|$", desc: "the dual/operator norm of the measurement" }
    ],
    derivation: [
      { do: "Assume two representations", result: "$F(x)=\\langle x,y_1\\rangle=\\langle x,y_2\\rangle$ for all $x$", why: "two vectors represent the same functional" },
      { do: "Subtract", result: "$\\langle x,y_1-y_2\\rangle=0$ for all $x$", why: "the readings agree" },
      { do: "Choose the difference as input", result: "$x=y_1-y_2$", why: "the statement holds for every vector" },
      { do: "Get zero norm", result: "$\\|y_1-y_2\\|^2=0$", why: "inner product of the difference with itself is zero" },
      { do: "Conclude uniqueness", result: "$y_1=y_2$", why: "positive definiteness" },
      { do: "Bound the functional", result: "$|F(x)|=|\\langle x,y\\rangle|\\le\\|x\\|\\|y\\|$", why: "Cauchy-Schwarz" },
      { do: "Test an aligned unit vector", result: "for $x=y/\\|y\\|$ when $y\\ne0$, $|F(x)|=\\|y\\|$", why: "the upper bound is attained on a unit vector" },
      { do: "Conclude norm equality", result: "$\\|F\\|=\\|y\\|$", why: "upper bound and attainment match" }
    ],
    applications: [
      { title: "Gradient", background: "A derivative functional is represented by a gradient vector.", numbers: "if $Df(w)[h]=2h_1-3h_2$, then $\\nabla f(w)=(2,-3)$." },
      { title: "Attention query", background: "A query vector represents a linear key-scoring functional.", numbers: "$q=[2,-1]$ represents $F(k)=2k_1-k_2$." },
      { title: "Weighted integral", background: "An $L^2$ weighted integral is represented by its weight function.", numbers: "$F(f)=\\int_0^1 f(t)2t\\,dt$ has representing function $2t$ with norm $2/\\sqrt3$." },
      { title: "RKHS evaluation", background: "Point evaluation is bounded by the norm of its kernel representer.", numbers: "if $\\|k_x\\|=2$, then $|f(x)|\\le2\\|f\\|$." },
      { title: "Sensitivity", background: "The norm of a linear measurement controls sensitivity.", numbers: "$F(h)=3h_1+4h_2$ has norm $5$." },
      { title: "Linear probe", background: "A probe vector bounds all normalized readings.", numbers: "$w=[1,2,2]$ has norm $3$, so $|w\\cdot x|\\le3\\|x\\|$." }
    ]
  },
  "math-05-11": {
    connectionsProse:
      "<p>Linear operators preserve vector-space structure, and this lesson adds a global stability condition. Boundedness says one constant controls how much the operator can stretch every input. For linear maps, that condition is equivalent to continuity, so analytic stability becomes an operator inequality. Operator norms, sensitivity bounds, compactness, and spectral normalization all build on this idea.</p>",
    motivation:
      "<p>A linear map can be algebraically valid while still behaving badly with respect to a norm. Boundedness rules out uncontrolled stretching by requiring $\\|Tx\\|$ to be at most a fixed constant times $\\|x\\|$. That turns input error bounds into output error bounds immediately.</p>" +
      "<p>The key linear fact is that comparing two outputs is the same as applying the operator to the difference of the inputs. Once $Tx-Ty=T(x-y)$, the single stretch bound gives the epsilon-delta continuity proof. This is why bounded linear maps are the stable operators of functional analysis.</p>",
    definition:
      "<p>A <b>bounded linear operator</b> is a linear map $T:V\\to W$ whose output norm is controlled by a constant multiple of the input norm.</p>" +
      "<p>$$\\|Tx\\|_W\\le C\\|x\\|_V\\quad\\text{for all }x.$$</p>" +
      "<p><b>Assumptions that matter:</b> $T$ is linear, the domain and codomain norms are fixed, and a single constant $C$ must work for every input.</p>",
    symbols: [
      { sym: "$T:V\\to W$", desc: "a linear map" },
      { sym: "$C$", desc: "a valid stretch bound" },
      { sym: "$\\|T\\|$", desc: "the smallest such bound" },
      { sym: "$V,W$", desc: "spaces with possibly different norms" }
    ],
    derivation: [
      { do: "Assume boundedness", result: "$\\|Tx\\|_W\\le C\\|x\\|_V$ for all $x$", why: "$T$ is bounded" },
      { do: "Compare two outputs", result: "$Tx-Ty=T(x-y)$", why: "$T$ is linear" },
      { do: "Take norms", result: "$\\|Tx-Ty\\|_W=\\|T(x-y)\\|_W$", why: "the output difference is an operator applied to the input difference" },
      { do: "Apply the bound", result: "$\\|T(x-y)\\|_W\\le C\\|x-y\\|_V$", why: "use boundedness on $x-y$" },
      { do: "Choose input closeness", result: "$\\delta=\\varepsilon/C$ when $C>0$", why: "this turns the stretch bound into the desired tolerance" },
      { do: "Check epsilon-delta continuity", result: "$\\|x-y\\|<\\delta$ implies $\\|Tx-Ty\\|<\\varepsilon$", why: "multiply by $C$" },
      { do: "Handle $C=0$", result: "outputs are identical", why: "continuity is immediate" },
      { do: "Conclude", result: "bounded linear maps are continuous", why: "the epsilon-delta condition holds" }
    ],
    applications: [
      { title: "Network Lipschitz bound", background: "Layer stretch bounds multiply through a network.", numbers: "layer norms $2,1.5,3$ multiply to $9$." },
      { title: "Gradient stability", background: "Repeated contraction shrinks perturbations geometrically.", numbers: "$0.8^{10}\\approx0.107$." },
      { title: "Moving average", background: "A bounded averaging operator preserves constant signals.", numbers: "weights $1/3,1/3,1/3$ map constant $[6,6,6]$ to $6$." },
      { title: "Robustness", background: "A bounded operator turns input perturbation size into output-change size.", numbers: "norm $4$ and perturbation $0.01$ give score change at most $0.04$." },
      { title: "Conditioning", background: "Operator bounds propagate numerical input error.", numbers: "$\\|A\\|=20$ and input error $0.001$ give output error at most $0.02$." },
      { title: "Spectral normalization", background: "Clipping a largest singular value limits worst-case stretch.", numbers: "clipping largest singular value from $5$ to $1$ reduces worst stretch by factor $5$." }
    ]
  },
  "math-05-12": {
    connectionsProse:
      "<p>Bounded operators have stretch limits, and this lesson measures the best such limit. The operator norm records the largest output length produced by a unit input. In finite dimensions this connects to singular values, conditioning, layer sensitivity, and spectral normalization. Later duality and compact-operator lessons use operator norms to control functionals and infinite-dimensional maps.</p>",
    motivation:
      "<p>The operator norm is a worst-case measurement. Instead of checking every possible input size separately, we normalize inputs to length one and ask for the largest output length. Linearity makes this enough, because any nonzero input is a scale times a unit input.</p>" +
      "<p>This viewpoint turns stability into one number. If the norm is small, every perturbation is controlled; if it is large, some direction can be stretched strongly. The diagonal example makes the idea visible: the direction with scale $3$ dominates the direction with scale $2$, so the Euclidean operator norm is the larger stretch.</p>",
    definition:
      "<p>The <b>operator norm</b> of a linear map is its largest stretch factor over nonzero inputs, equivalently the largest output norm over unit inputs.</p>" +
      "<p>$$\\|A\\|=\\sup_{x\\ne0}\\frac{\\|Ax\\|}{\\|x\\|}=\\sup_{\\|u\\|=1}\\|Au\\|.$$</p>" +
      "<p><b>Assumptions that matter:</b> domain and codomain norms are fixed, and the supremum is taken over inputs allowed by the domain.</p>",
    symbols: [
      { sym: "$A$", desc: "a linear operator" },
      { sym: "$x$", desc: "any input" },
      { sym: "$u$", desc: "a unit input" },
      { sym: "$\\sup$", desc: "least upper bound" },
      { sym: "domain and codomain norms", desc: "the norms that must be fixed" }
    ],
    derivation: [
      { do: "Start with stretch", result: "$\\|A\\|=\\sup_{x\\ne0}\\|Ax\\|/\\|x\\|$", why: "stretch is output length divided by input length" },
      { do: "Normalize an input", result: "$u=x/\\|x\\|$", why: "$u$ has norm $1$" },
      { do: "Use linearity", result: "$Ax=A(\\|x\\|u)=\\|x\\|Au$", why: "the scale can be pulled through the operator" },
      { do: "Divide by input norm", result: "$\\|Ax\\|/\\|x\\|=\\|Au\\|$", why: "the scale cancels" },
      { do: "Equate the suprema", result: "$\\sup_{x\\ne0}\\|Ax\\|/\\|x\\|=\\sup_{\\|u\\|=1}\\|Au\\|$", why: "every nonzero input determines a unit direction" },
      { do: "Compute the diagonal example", result: "for $A=\\operatorname{diag}(3,2)$ and $u=(s,t)$ with $s^2+t^2=1$, $\\|Au\\|^2=9s^2+4t^2$", why: "the matrix scales the two coordinates" },
      { do: "Use the unit constraint", result: "$4+5s^2\\le9$", why: "substitute $t^2=1-s^2$" },
      { do: "Test the maximizing direction", result: "$\\|A\\|=3$", why: "square roots give the upper bound and $u=(1,0)$ attains it" }
    ],
    applications: [
      { title: "Layer sensitivity", background: "A layer's operator norm bounds output perturbations.", numbers: "$\\|W\\|=2.5$, $\\|\\Delta x\\|=0.04$ gives $\\|W\\Delta x\\|\\le0.10$." },
      { title: "Score robustness", background: "A score map changes at most norm times input change.", numbers: "norm $3$ and input change $0.01$ gives at most $0.03$." },
      { title: "Smoothness", background: "A Hessian norm suggests a safe gradient step scale.", numbers: "$\\|H\\|=8$ suggests step scale $1/8=0.125$." },
      { title: "Feature scaling", background: "Diagonal feature scaling is governed by its largest scale.", numbers: "diagonal scales $10,0.5$ have Euclidean operator norm $10$." },
      { title: "Roundoff", background: "Operator norm propagates numerical roundoff error.", numbers: "$\\|A\\|=6$ and error $0.0002$ give $0.0012$." },
      { title: "Attention projection", background: "Projection matrix norm bounds query vector length.", numbers: "$\\|W_Q\\|=1.2$, $\\|x\\|=5$ gives $\\|q\\|\\le6$." }
    ]
  },
  "math-05-13": {
    connectionsProse:
      "<p>This lesson studies the space of continuous linear measurements on a normed space. After Riesz, Hilbert-space measurements can be represented by vectors, but general normed spaces still need the broader dual-space language. Dual norms quantify the size of probes, gradients, constraints, and sensitivity certificates. Hahn-Banach and weak convergence both rely on these continuous linear observers.</p>",
    motivation:
      "<p>A vector can be tested by many linear measurements: a coordinate readout, a gradient direction, a constraint differential, or an expectation. The dual space collects the measurements that are continuous under the chosen norm. Each functional then has its own norm, defined by the largest reading it can produce on the unit ball.</p>" +
      "<p>In Euclidean space, this abstract definition reduces to a familiar coefficient-vector calculation. The functional $f(x,y)=3x-4y$ is inner product with $(3,-4)$, so Cauchy-Schwarz gives the upper bound and alignment attains it. The lesson therefore shows both sides of the dual norm: a universal bound and a unit input that reaches the bound.</p>",
    definition:
      "<p>The <b>dual space</b> $X^*$ is the vector space of continuous linear functionals on $X$, with norm equal to the largest absolute reading on the unit ball.</p>" +
      "<p>$$\\|f\\|=\\sup_{\\|x\\|\\le1}|f(x)|.$$</p>" +
      "<p><b>Assumptions that matter:</b> the norm on $X$ is fixed, only continuous linear functionals belong to $X^*$, and the Euclidean example uses the ordinary inner product.</p>",
    symbols: [
      { sym: "$X^*$", desc: "the dual space" },
      { sym: "$f:X\\to\\mathbb R$", desc: "a continuous linear functional" },
      { sym: "$\\|f\\|=\\sup_{\\|x\\|\\le1}|f(x)|$", desc: "the dual norm" },
      { sym: "$a$", desc: "the representing coefficient vector in Euclidean space" }
    ],
    derivation: [
      { do: "Define the functional", result: "$f(x,y)=3x-4y$", why: "this is a linear functional" },
      { do: "Write vector notation", result: "$z=(x,y)$ and $a=(3,-4)$", why: "$f(z)=\\langle z,a\\rangle$" },
      { do: "Apply Cauchy-Schwarz", result: "$|f(z)|\\le\\|z\\|\\|a\\|$", why: "the functional is an inner product with $a$" },
      { do: "Restrict to the unit ball", result: "$|f(z)|\\le\\|a\\|$", why: "$\\|z\\|\\le1$" },
      { do: "Compute the coefficient norm", result: "$\\|a\\|=\\sqrt{3^2+(-4)^2}=5$", why: "Euclidean norm" },
      { do: "Choose an aligned unit input", result: "$z=a/5=(3/5,-4/5)$", why: "it is unit and aligned" },
      { do: "Evaluate the functional", result: "$f(z)=9/5+16/5=5$", why: "the upper bound is attained" },
      { do: "Conclude the norm", result: "$\\|f\\|=5$", why: "the upper bound is attained" }
    ],
    applications: [
      { title: "Gradient functional", background: "A gradient defines a local linear measurement.", numbers: "$g=(3,4)$ has $\\|df\\|=5$, and $df(0.01,0)=0.03$." },
      { title: "Probe", background: "A probe reads a weighted sum of feature coordinates.", numbers: "$(1,-1,2)\\cdot(0.5,0.2,0.1)=0.5$." },
      { title: "$\\ell_\\infty$ perturbation", background: "The dual of an infinity perturbation uses an $\\ell_1$ coefficient norm.", numbers: "$0.01\\| (2,-3,1)\\|_1=0.06$." },
      { title: "Constraint differential", background: "A constraint derivative is a linear functional on perturbations.", numbers: "$h_1+2h_2$ has Euclidean norm $\\sqrt5\\approx2.236$." },
      { title: "Expectation", background: "Expectation is a bounded linear functional under bounded outcomes.", numbers: "if $|X|\\le3$, then $|E[X]|\\le3$." },
      { title: "Classifier score", background: "A classifier score is a linear functional of features.", numbers: "$(0.2,-0.5)\\cdot(10,4)=0$." }
    ]
  },
  "math-05-14": {
    connectionsProse:
      "<p>Dual spaces make linear measurements central, and Hahn-Banach explains why enough of those measurements exist. The theorem extends a bounded functional from a subspace to the whole space without increasing its norm. This is one of the main tools behind separation, certificates, and support hyperplanes in analysis and optimization. The concrete example keeps the theorem grounded in a simple Euclidean extension.</p>",
    motivation:
      "<p>Often a measurement is first defined only on a smaller subspace where the relevant data live. Hahn-Banach says that, under the right boundedness condition, the measurement can be continued to the ambient space while preserving its norm. The extension may not be unique, but the theorem guarantees that no extra stretch is required.</p>" +
      "<p>This matters because global witnesses can be built from local information. A norm-preserving functional can certify a vector's norm, separate a point from a convex set, or provide a dual certificate for an optimization problem. The derivation uses the $x$-axis in $\\mathbb R^2$ to show the norm-preserving idea without hiding it inside the general theorem.</p>",
    definition:
      "<p>The <b>Hahn-Banach theorem</b> extends a bounded linear functional from a subspace to the whole normed space without increasing its norm.</p>" +
      "<p>$$F|_M=f,\\qquad \\|F\\|=\\|f\\|.$$</p>" +
      "<p><b>Assumptions that matter:</b> $M$ is a subspace of $X$, $f$ is bounded on $M$, and the extension preserves the chosen norm bound.</p>",
    symbols: [
      { sym: "$M$", desc: "a subspace" },
      { sym: "$X$", desc: "the larger normed space" },
      { sym: "$f$", desc: "the original functional" },
      { sym: "$F$", desc: "the extension" },
      { sym: "$F|_M=f$", desc: "agreement on $M$" }
    ],
    derivation: [
      { do: "Define the subspace functional", result: "$M=\\{(t,0):t\\in\\mathbb R\\}$ and $f(t,0)=2t$", why: "the measurement is defined on the $x$-axis" },
      { do: "Compute the stretch ratio", result: "$|f(t,0)|/\\|(t,0)\\|=|2t|/|t|$ for $t\\ne0$", why: "this measures the functional norm on $M$" },
      { do: "Simplify", result: "$2$", why: "$|t|$ cancels" },
      { do: "Conclude the subspace norm", result: "$\\|f\\|=2$ on $M$", why: "the ratio is constant for nonzero $t$" },
      { do: "Define an extension", result: "$F(x,y)=2x$", why: "it agrees with $f$ when $y=0$" },
      { do: "Identify the coefficient vector", result: "$(2,0)$", why: "Euclidean functionals are dot products with coefficient vectors" },
      { do: "Compute the extension norm", result: "$\\|F\\|=\\sqrt{2^2+0^2}=2$", why: "Euclidean dual norm equals coefficient norm" },
      { do: "Conclude norm preservation", result: "$F$ is a norm-preserving extension", why: "it agrees on $M$ and has the same norm" }
    ],
    applications: [
      { title: "Separating disk from point", background: "A functional can separate a convex set from an outside point.", numbers: "$F(x,y)=x$ is at most $1$ on the unit disk and equals $3$ at $(3,0)$." },
      { title: "SVM margin", background: "A unit normal functional measures signed distance to a separating hyperplane.", numbers: "projections differing by $2$ give margin $1$ on each side with a unit normal." },
      { title: "Dual certificate", background: "A global linear bound certifies optimality when it is attained.", numbers: "if all feasible $x$ satisfy $c\\cdot x\\le10$ and one reaches $10$, optimum is certified." },
      { title: "Norm witness", background: "A norm-one functional can witness a vector's norm.", numbers: "for $x=(3,4)$, $F(z)=\\langle z,x/5\\rangle$ has norm $1$ and $F(x)=5$." },
      { title: "Dual norm", background: "A dual norm reports the largest coordinate probe for the matching unit ball.", numbers: "for $w=(2,-1,0)$, $\\|w\\|_\\infty=2$." },
      { title: "Lagrangian gap", background: "A multiplier converts constraint violation into objective-gap contribution.", numbers: "multiplier $25$ times gap $0.04$ contributes $1.0$." }
    ]
  },
  "math-05-15": {
    connectionsProse:
      "<p>This lesson weakens the usual idea of convergence by testing vectors through dual measurements. Norm convergence requires the vectors themselves to get close in length. Weak convergence only requires every continuous linear observer to see convergence. That distinction is essential in infinite-dimensional spaces, where bounded sequences may have stable observable behavior without converging strongly.</p>",
    motivation:
      "<p>Norm convergence is a demanding condition because it measures the full distance between vectors. Weak convergence asks for something gentler: fix any continuous linear functional and look only at its scalar readings. If all such readings converge to the readings of a limit vector, the sequence converges weakly.</p>" +
      "<p>The standard basis in $\\ell^2$ shows why the distinction matters. Each $e_n$ keeps norm $1$, so it never approaches $0$ in norm. But any fixed square-summable observer has coordinates tending to zero, so its reading of $e_n$ vanishes; every fixed observer sees convergence to $0$.</p>",
    definition:
      "<p>A sequence $x_n$ <b>converges weakly</b> to $x$ when every continuous linear functional sees scalar convergence to its value at $x$.</p>" +
      "<p>$$x_n\\rightharpoonup x \\quad\\Longleftrightarrow\\quad f(x_n)\\to f(x)\\text{ for every }f\\in X^*.$$</p>" +
      "<p><b>Assumptions that matter:</b> weak convergence depends on the chosen dual space, and in Hilbert spaces Riesz lets fixed vectors act as the tests.</p>",
    symbols: [
      { sym: "$x_n\\rightharpoonup x$", desc: "weak convergence" },
      { sym: "$X^*$", desc: "the set of continuous linear tests" },
      { sym: "$e_n$", desc: "the $n$th standard basis vector" },
      { sym: "norm convergence", desc: "$\\|x_n-x\\|\\to0$" }
    ],
    derivation: [
      { do: "Fix an observer", result: "$y=(y_1,y_2,\\ldots)\\in\\ell^2$", why: "weak convergence tests against one fixed vector at a time" },
      { do: "Compute the reading", result: "$\\langle e_n,y\\rangle=y_n$", why: "only coordinate $n$ survives" },
      { do: "Use square summability", result: "$y_n\\to0$", why: "terms of a convergent series must vanish" },
      { do: "Conclude scalar convergence", result: "$\\langle e_n,y\\rangle\\to0$ for every fixed $y$", why: "each observer's reading vanishes" },
      { do: "Conclude weak convergence", result: "$e_n\\rightharpoonup0$", why: "the Hilbert-space weak convergence criterion holds" },
      { do: "Compute each norm", result: "$\\|e_n\\|=1$", why: "each has one unit coordinate" },
      { do: "Compute distance to zero", result: "$\\|e_n-0\\|=1$ for every $n$", why: "subtracting zero changes nothing" },
      { do: "Separate weak from norm convergence", result: "$e_n$ does not converge to $0$ in norm", why: "the distance never goes to zero" }
    ],
    applications: [
      { title: "Probe stability", background: "Weak convergence can show up as stable scalar probe readings.", numbers: "readings change by less than $0.001$ after epoch $50$." },
      { title: "Distribution-style limits", background: "Simple expectations can stabilize before stronger convergence is visible.", numbers: "a sample mean $0.50$ with error $0.01$ stabilizes simple expectations." },
      { title: "Embedding drift", background: "A fixed coordinate probe may miss movement in other coordinates.", numbers: "coordinate probe $5$ reads $0$ for $e_n$ whenever $n\\ne5$, while $\\|e_n\\|=1$." },
      { title: "Sensor inverse problem", background: "Finitely many sensor functionals can be stable even if full states are not.", numbers: "$20$ sensor functionals varying by at most $0.005$ means measured predictions are stable." },
      { title: "RKHS bound", background: "RKHS norm bounds convert weak control into pointwise bounds.", numbers: "$\\|f_n\\|\\le3$ and $k(x,x)=4$ imply $|f_n(x)|\\le6$." },
      { title: "Optimization existence", background: "Bounded sequences have uniformly bounded readings under fixed functionals.", numbers: "if $\\|x_n\\|\\le2$, any norm-$5$ functional reads at most $10$ in magnitude." }
    ]
  },
  "math-05-16": {
    connectionsProse:
      "<p>Bounded operators control size, and compact operators add a stronger limiting property. They send bounded input sequences to output sequences with norm-convergent subsequences. This makes some infinite-dimensional behavior resemble finite-dimensional matrix behavior. Compactness prepares the ground for spectral decompositions, kernel operators, smoothing maps, and low-rank approximations.</p>",
    motivation:
      "<p>A bounded operator prevents outputs from becoming too large, but boundedness alone does not force outputs to settle down. Compactness says that from any bounded input sequence, the output sequence contains a convergent subsequence. It is a sequential form of compression: the image of a bounded set may be infinite, but it cannot spread out too freely.</p>" +
      "<p>This lesson is explain-only because the main work is recognizing the definition and its examples. Diagonal damping on $\\ell^2$ illustrates compact behavior by making the basis outputs shrink to zero. The identity operator shows the contrast: it is bounded, but it preserves the separated standard basis, so no convergent subsequence appears.</p>",
    definition:
      "<p>A <b>compact operator</b> maps every bounded input sequence to an output sequence with a norm-convergent subsequence.</p>" +
      "<p>$$\\|x_n\\|\\le C\\quad\\Longrightarrow\\quad Tx_{n_k}\\text{ converges in norm for some subsequence }(n_k).$$</p>" +
      "<p><b>Assumptions that matter:</b> compactness is a sequential norm-convergence property, and boundedness alone does not imply it in infinite-dimensional spaces.</p>",
    symbols: [
      { sym: "$T:X\\to Y$", desc: "a linear map" },
      { sym: "bounded sequence", desc: "$\\|x_n\\|\\le C$" },
      { sym: "compact", desc: "some output subsequence $Tx_{n_k}$ converges in norm" },
      { sym: "finite-rank", desc: "the range is finite-dimensional" }
    ],
    applications: [
      { title: "Low-rank compression", background: "Finite-rank maps compress a high-dimensional input to a smaller range.", numbers: "rank-$5$ projection keeps $5$ numbers from $1000$." },
      { title: "Smoothing", background: "A smoothing average compresses local variation.", numbers: "$[1,3,5,7,9]$ has 5-point average center value $5$." },
      { title: "Covariance spectrum", background: "Compact covariance structure concentrates mass in leading modes.", numbers: "eigenvalues $4,1,0.25$ give first-two share $5/5.25=95.2\\%$." },
      { title: "Diagonal damping", background: "Diagonal damping shrinks higher-index coordinates.", numbers: "weights $1,1/2,1/4,1/8$ reduce the fourth component to $12.5\\%$." },
      { title: "Kernel approximation", background: "Kernel operator spectra can be approximated by leading eigenvalues.", numbers: "eigenvalues $0.5,0.2,0.05$ have first-two mass $0.7$." },
      { title: "Recommender factors", background: "A low-rank factor representation reduces coordinate count.", numbers: "$64$ factors instead of $1024$ coordinates is a $16$ times reduction." }
    ]
  },
  "math-05-17": {
    connectionsProse:
      "<p>This lesson brings Hilbert geometry to operators with especially nice symmetry. Self-adjoint operators behave like symmetric matrices: eigenvectors from different eigenvalues are orthogonal, and the operator can be understood through scalar weights on orthonormal directions. This is the operator form behind PCA, Hessian curvature, graph Laplacians, and kernel spectra. Mercer theory later applies the same spectral idea to positive kernel operators.</p>",
    motivation:
      "<p>A complicated linear operator becomes much easier to understand when there is an orthonormal basis of eigenvectors. In that coordinate system, applying the operator only multiplies each coordinate by its eigenvalue. Geometry, energy, and curvature then reduce to scalar weights along perpendicular directions.</p>" +
      "<p>Self-adjointness is the condition that makes this diagonal picture reliable. It forces eigenvectors with distinct eigenvalues to be orthogonal, so cross terms vanish in quadratic forms. The derivation shows the algebra of that orthogonality and then computes the quadratic form as a sum of eigenvalue-weighted squared coefficients.</p>",
    definition:
      "<p>The <b>spectral theorem</b> says a suitable self-adjoint operator can be analyzed through orthonormal eigenvectors and real eigenvalue weights; in finite dimensions this is the symmetric-matrix decomposition.</p>" +
      "<p>$$A=Q\\Lambda Q^T,\\qquad \\langle x,Ax\\rangle=\\sum_i\\lambda_i c_i^2.$$</p>" +
      "<p><b>Assumptions that matter:</b> the operator is self-adjoint and the stated finite-dimensional diagonal form assumes an orthonormal eigenbasis.</p>",
    symbols: [
      { sym: "$A$", desc: "self-adjoint" },
      { sym: "$q_i$", desc: "orthonormal eigenvectors" },
      { sym: "$\\lambda_i$", desc: "eigenvalues" },
      { sym: "$Q\\Lambda Q^T$", desc: "the finite-dimensional spectral form" }
    ],
    derivation: [
      { do: "Write eigen equations", result: "$Au=\\lambda u$ and $Av=\\mu v$", why: "$u,v$ are eigenvectors" },
      { do: "Assume self-adjointness", result: "$\\langle Au,v\\rangle=\\langle u,Av\\rangle$", why: "this is the defining symmetry" },
      { do: "Substitute eigen equations", result: "$\\lambda\\langle u,v\\rangle=\\mu\\langle u,v\\rangle$", why: "the operator acts by eigenvalue scaling" },
      { do: "Subtract", result: "$(\\lambda-\\mu)\\langle u,v\\rangle=0$", why: "move both sides together" },
      { do: "Use distinct eigenvalues", result: "$\\langle u,v\\rangle=0$", why: "$\\lambda\\ne\\mu$" },
      { do: "Expand in an eigenbasis", result: "$x=\\sum_i c_iq_i$", why: "the eigenbasis is orthonormal" },
      { do: "Apply the operator", result: "$Ax=\\sum_i \\lambda_i c_iq_i$", why: "each eigenvector is scaled by its eigenvalue" },
      { do: "Compute the quadratic form", result: "$\\langle x,Ax\\rangle=\\sum_i\\lambda_i c_i^2$", why: "cross terms vanish" }
    ],
    applications: [
      { title: "PCA", background: "PCA variance shares are eigenvalue shares.", numbers: "eigenvalues $9,4,1$ give first PC share $9/14=64.3\\%$." },
      { title: "Hessian curvature", background: "Hessian eigenvalues describe curvature along orthogonal directions.", numbers: "eigenvalues $100$ and $1$ mean one direction is $100$ times steeper." },
      { title: "Graph learning", background: "A Laplacian eigenvalue can reveal weak connectivity.", numbers: "second Laplacian eigenvalue $0.03$ marks a weak cut." },
      { title: "Kernel methods", background: "Kernel spectra summarize variance or energy in leading modes.", numbers: "eigenvalues $0.6,0.3,0.1$ have first-two mass $90\\%$." },
      { title: "Signal filtering", background: "Spectral filtering keeps selected modal coefficients.", numbers: "keeping $12$ of $64$ modes keeps $18.75\\%$ of coefficients." },
      { title: "Linear dynamics", background: "An eigenvalue controls repeated action along its eigenvector.", numbers: "eigenvalue $0.8$ gives $0.8^5\\approx0.328$ after $5$ steps." }
    ]
  },
  "math-05-18": {
    connectionsProse:
      "<p>This lesson starts the kernel-learning spine of the section. A Hilbert space has already supplied inner products, Riesz representation, and bounded linear measurements. An RKHS applies those ideas to a space whose vectors are functions, with point evaluation as a continuous linear functional. Positive-definite kernels, Mercer expansions, and the representer theorem all depend on this evaluation-as-inner-product structure.</p>",
    motivation:
      "<p>In a general function space, evaluating a function at one point need not be a well-behaved operation. An RKHS is built so that evaluation is continuous and linear. By Riesz representation, every evaluation map is then represented by a specific Hilbert-space vector, called a kernel section.</p>" +
      "<p>The reproducing property is the central payoff. Instead of treating $f(x)$ as an external lookup, the RKHS writes it as an inner product $\\langle f,k_x\\rangle_{\\mathcal H}$. This turns pointwise prediction, kernel similarity, and norm-based control into Hilbert-space geometry.</p>",
    definition:
      "<p>A <b>reproducing kernel Hilbert space</b> is a Hilbert space of functions in which each point-evaluation map is continuous and therefore represented by a kernel section.</p>" +
      "<p>$$f(x)=\\langle f,k_x\\rangle_{\\mathcal H},\\qquad k(x,z)=\\langle k_z,k_x\\rangle_{\\mathcal H}.$$</p>" +
      "<p><b>Assumptions that matter:</b> evaluation at each point is continuous and linear, and the Riesz theorem supplies the representing section $k_x$.</p>",
    symbols: [
      { sym: "$\\mathcal H$", desc: "the RKHS" },
      { sym: "$E_x$", desc: "evaluation at $x$" },
      { sym: "$k_x$", desc: "the representer of evaluation" },
      { sym: "$k(x,z)$", desc: "the kernel value" },
      { sym: "$\\|f\\|_{\\mathcal H}$", desc: "function-space norm" }
    ],
    derivation: [
      { do: "Fix an input", result: "$x$", why: "evaluation at that point is a map on functions" },
      { do: "Define evaluation", result: "$E_x(f)=f(x)$", why: "this records the value of $f$ at $x$" },
      { do: "Assume RKHS continuity", result: "$E_x$ is continuous and linear", why: "that is the RKHS condition" },
      { do: "Apply Riesz", result: "a unique $k_x\\in\\mathcal H$ with $E_x(f)=\\langle f,k_x\\rangle_{\\mathcal H}$", why: "continuous linear functionals on Hilbert spaces are represented by vectors" },
      { do: "Rewrite evaluation", result: "$f(x)=\\langle f,k_x\\rangle_{\\mathcal H}$", why: "this is the reproducing property" },
      { do: "Define the kernel", result: "$k(x,z)=k_z(x)$", why: "the kernel is the value of the $z$-section at $x$" },
      { do: "Use reproduction on a section", result: "$k(x,z)=\\langle k_z,k_x\\rangle_{\\mathcal H}$", why: "take $f=k_z$" },
      { do: "Apply Cauchy-Schwarz", result: "$|f(x)|\\le\\|f\\|\\sqrt{k(x,x)}$", why: "$\\|k_x\\|^2=k(x,x)$" }
    ],
    applications: [
      { title: "Kernel ridge penalty", background: "RKHS regularization penalizes squared function norm.", numbers: "$\\lambda=0.1$, $\\|f\\|=3$ gives $0.9$." },
      { title: "GP covariance", background: "A kernel diagonal gives prior point variance.", numbers: "$k(x,x)=1$ gives prior variance $1$." },
      { title: "Kernel-section cosine", background: "Kernel values compute cosines between hidden kernel sections.", numbers: "$k(a,a)=4$, $k(b,b)=9$, $k(a,b)=3$ gives $0.5$." },
      { title: "SVM form", background: "Kernel sections combine into a prediction function.", numbers: "coefficients $1.2,-0.7$ give $1.2k(x,x_1)-0.7k(x,x_2)+b$." },
      { title: "RKHS norm", background: "Kernel algebra computes norms of section combinations.", numbers: "for $f=k_1-k_2$ and $k(x,z)=1+xz$, $\\|f\\|^2=2-6+5=1$." },
      { title: "Pointwise bound", background: "The reproducing property bounds individual predictions.", numbers: "$\\|f\\|\\le4$, $k(x,x)=0.25$ gives $|f(x)|\\le2$." }
    ]
  },
  "math-05-19": {
    connectionsProse:
      "<p>RKHS theory needs kernels that can act like inner products. This lesson gives the finite consistency test: every Gram matrix built from the kernel must be positive semidefinite. That condition ensures that finite collections of kernel values describe possible geometry rather than contradictory similarities. Mercer expansions and kernel methods rely on this positivity throughout.</p>",
    motivation:
      "<p>A kernel is often introduced as a similarity function, but not every similarity can be an inner product. For a finite set of inputs, the matrix of pairwise kernel values must have nonnegative quadratic forms. Otherwise some linear combination of hidden feature vectors would have negative squared length, which is impossible.</p>" +
      "<p>Positive definiteness is therefore the algebraic checkpoint for kernel geometry. If the kernel is already an inner product in a feature space, the PSD condition follows by collecting the weighted feature vectors and taking a squared norm. The two-point example with $k(x,z)=1+xz$ shows the same test as a concrete Gram-matrix determinant.</p>",
    definition:
      "<p>A <b>positive-definite kernel</b> is a symmetric kernel whose every finite Gram matrix is positive semidefinite.</p>" +
      "<p>$$\\sum_i\\sum_j c_ic_jk(x_i,x_j)=c^TKc\\ge0.$$</p>" +
      "<p><b>Assumptions that matter:</b> the condition must hold for every finite set of inputs and every real coefficient vector $c$.</p>",
    symbols: [
      { sym: "$k$", desc: "a symmetric kernel" },
      { sym: "$x_i$", desc: "sample inputs" },
      { sym: "$c_i$", desc: "real coefficients" },
      { sym: "$K_{ij}=k(x_i,x_j)$", desc: "the Gram matrix" },
      { sym: "PSD", desc: "$c^TKc\\ge0$ for all $c$" }
    ],
    derivation: [
      { do: "Assume a feature inner product", result: "$k(x,z)=\\langle\\Phi(x),\\Phi(z)\\rangle$", why: "the kernel is a hidden feature inner product" },
      { do: "Form the PSD test sum", result: "$\\sum_i\\sum_j c_ic_jk(x_i,x_j)$", why: "PSD tests all finite coefficients" },
      { do: "Substitute the feature inner product", result: "$\\sum_i\\sum_j c_ic_j\\langle\\Phi(x_i),\\Phi(x_j)\\rangle$", why: "replace $k$ by its feature representation" },
      { do: "Move sums inside", result: "$\\langle\\sum_i c_i\\Phi(x_i),\\sum_j c_j\\Phi(x_j)\\rangle$", why: "linearity of the inner product combines the weighted features" },
      { do: "Recognize a squared norm", result: "$\\|\\sum_i c_i\\Phi(x_i)\\|^2$", why: "the two summed vectors are the same" },
      { do: "Use nonnegativity", result: "$\\ge0$", why: "norms are nonnegative" },
      { do: "Conclude positivity", result: "every feature inner-product kernel is positive semidefinite", why: "all finite coefficient tests pass" },
      { do: "Check a concrete Gram matrix", result: "for $k(x,z)=1+xz$ at $1,2$, $K=\\begin{pmatrix}2&3\\3&5\\end{pmatrix}$ with determinant $1>0$", why: "the two-point test is positive" }
    ],
    applications: [
      { title: "SVM convexity", background: "A positive semidefinite Gram matrix keeps the SVM quadratic program convex.", numbers: "determinant $0.75>0$ with diagonal $1$ is safe for two points." },
      { title: "GP covariance", background: "A valid covariance matrix must be PSD.", numbers: "covariance $0.8$ with unit variances has determinant $0.36>0$." },
      { title: "Bad similarity", background: "A similarity matrix with negative quadratic form cannot be a kernel Gram matrix.", numbers: "$[[1,2],[2,1]]$ gives $(1,-1)K(1,-1)^T=-2$." },
      { title: "Polynomial kernel", background: "Polynomial kernels compute inner products in lifted feature spaces.", numbers: "$(1+2\\cdot3)^2=49$." },
      { title: "Kernel distance", background: "Kernel diagonals and cross values determine hidden feature distance.", numbers: "if diagonals are $1$ and cross value $0.2$, squared distance is $1.6$." },
      { title: "PSD repair", background: "Clipping a small negative eigenvalue repairs a nearly PSD matrix.", numbers: "clipping eigenvalue $-0.001$ to $0$ changes trace by $0.001$." }
    ]
  },
  "math-05-20": {
    connectionsProse:
      "<p>Positive kernels have finite Gram matrices with valid geometry, and Mercer gives the corresponding infinite-dimensional spectral picture under suitable assumptions. The theorem decomposes a well-behaved positive kernel into orthonormal eigenfunctions with nonnegative weights. This mirrors the spectral theorem for positive symmetric matrices. Kernel PCA, Gaussian processes, Nyström approximation, and RKHS feature maps all use this modal viewpoint.</p>",
    motivation:
      "<p>Mercer's theorem explains how a positive kernel can be understood as a sum of independent modes. Each eigenfunction supplies a coordinate direction, and each nonnegative eigenvalue supplies its weight. The kernel value is then built by multiplying matching modal coordinates and summing them.</p>" +
      "<p>The feature-map interpretation comes from splitting each eigenvalue into square roots. Placing $\\sqrt{\\lambda_m}\\phi_m(x)$ into the $m$th coordinate makes the kernel equal to an ordinary inner product in feature space. This is the bridge between spectral analysis of kernel operators and the computational feature viewpoint used in learning algorithms.</p>",
    definition:
      "<p><b>Mercer's theorem</b> decomposes a suitable positive kernel into nonnegative eigenvalue weights and orthonormal eigenfunctions, giving a feature inner product.</p>" +
      "<p>$$k(x,z)=\\sum_m\\lambda_m\\phi_m(x)\\phi_m(z)=\\langle\\Phi(x),\\Phi(z)\\rangle.$$</p>" +
      "<p><b>Assumptions that matter:</b> compactness, positivity, and regularity assumptions supply the spectral expansion and ensure $\\lambda_m\\ge0$.</p>",
    symbols: [
      { sym: "$T$", desc: "the integral operator" },
      { sym: "$\\lambda_m$", desc: "nonnegative eigenvalues" },
      { sym: "$\\phi_m$", desc: "orthonormal eigenfunctions" },
      { sym: "$\\Phi$", desc: "the Mercer feature map" },
      { sym: "compactness and positivity", desc: "conditions that supply the spectral expansion" }
    ],
    derivation: [
      { do: "Start with Mercer's expansion", result: "$k(x,z)=\\sum_m\\lambda_m\\phi_m(x)\\phi_m(z)$", why: "Mercer provides eigenvalues and eigenfunctions" },
      { do: "Note positivity", result: "$\\lambda_m\\ge0$", why: "the kernel operator is positive" },
      { do: "Define feature coordinates", result: "$\\Phi_m(x)=\\sqrt{\\lambda_m}\\phi_m(x)$", why: "square roots split the weight evenly" },
      { do: "Compute feature inner product", result: "$\\langle\\Phi(x),\\Phi(z)\\rangle=\\sum_m\\Phi_m(x)\\Phi_m(z)$", why: "ordinary coordinate inner product sums coordinate products" },
      { do: "Substitute coordinates", result: "$\\sum_m\\sqrt{\\lambda_m}\\phi_m(x)\\sqrt{\\lambda_m}\\phi_m(z)$", why: "replace each feature coordinate" },
      { do: "Multiply square roots", result: "$\\sum_m\\lambda_m\\phi_m(x)\\phi_m(z)$", why: "this recovers the Mercer weights" },
      { do: "Conclude kernel equality", result: "$k(x,z)=\\langle\\Phi(x),\\Phi(z)\\rangle$", why: "the sums match" },
      { do: "Compute the example", result: "$4(0.5)(1)+1(2)(-1)=2-2=0$", why: "modal contributions can cancel" }
    ],
    applications: [
      { title: "Kernel PCA", background: "Kernel PCA variance shares come from kernel eigenvalues.", numbers: "eigenvalues $5,2,0.5$ give first share $5/7.5=66.7\\%$." },
      { title: "GP modes", background: "A Gaussian-process eigenvalue gives variance in one mode.", numbers: "eigenvalue $4$ gives mode standard deviation $2$." },
      { title: "Nyström low rank", background: "Low-rank kernel approximation preserves leading spectral mass.", numbers: "keeping $10$ and $3$ out of total $14$ preserves $92.9\\%$." },
      { title: "Smoothing decay", background: "Smoothing kernels often have decaying eigenvalues.", numbers: "$1/9$ is $11.1\\%$ of the first eigenvalue $1$." },
      { title: "Effective dimension", background: "Counting eigenvalues above a threshold estimates active dimension.", numbers: "$20$ eigenvalues above $0.01$ among $1000$ gives active dimension near $20$." },
      { title: "Spectral denoising", background: "Dropping a small eigenmode removes its variance contribution.", numbers: "dropping a $0.03$ eigenmode removes $0.03$ variance contribution." }
    ]
  },
  "math-05-21": {
    connectionsProse:
      "<p>This capstone lesson ties the RKHS sequence to practical kernel learning. Positive kernels supply valid inner products, RKHS theory supplies point evaluation by kernel sections, and the representer theorem explains why regularized solutions live in a finite span of training sections. The result is that many infinite-dimensional learning problems reduce to Gram matrices and coefficient vectors. Kernel ridge regression and SVM prediction are standard examples of this reduction.</p>",
    motivation:
      "<p>The kernel trick uses kernel values to compute feature-space inner products without explicitly constructing the feature vectors. That handles the computational side, but regularized learning also needs a structural reason that finitely many training examples are enough. The representer theorem gives that reason.</p>" +
      "<p>Training losses depend on $f$ only through values at the training inputs. Any component of $f$ orthogonal to the span of the training kernel sections is invisible to those values, while it can only increase the RKHS norm. Removing that component cannot worsen a nondecreasing norm regularizer, so a minimizer can be written with one coefficient per training example.</p>",
    definition:
      "<p>The <b>kernel trick</b> computes feature-space inner products through $k$, and the <b>representer theorem</b> says regularized empirical minimizers can be chosen in the span of training kernel sections.</p>" +
      "<p>$$f(x)=\\sum_i\\alpha_i k(x_i,x).$$</p>" +
      "<p><b>Assumptions that matter:</b> losses depend on $f$ only through training values, the regularizer is nondecreasing in $\\|f\\|$, and the RKHS projection onto the training span is available.</p>",
    symbols: [
      { sym: "$\\Phi$", desc: "a feature map" },
      { sym: "$k(x,z)=\\langle\\Phi(x),\\Phi(z)\\rangle$", desc: "the kernel inner product" },
      { sym: "$K$", desc: "the Gram matrix" },
      { sym: "$\\alpha_i$", desc: "learned coefficients" },
      { sym: "$\\lambda$", desc: "ridge strength" },
      { sym: "$M$", desc: "the span of training kernel sections" }
    ],
    derivation: [
      { do: "Define the training span", result: "$M=\\operatorname{span}\\{k_{x_1},\\ldots,k_{x_n}\\}$", why: "training losses only evaluate $f$ at training points" },
      { do: "Decompose any function", result: "$f=f_M+f_\\perp$ with $f_M\\in M$ and $f_\\perp\\perp M$", why: "Hilbert projection" },
      { do: "Evaluate the perpendicular part", result: "$f_\\perp(x_i)=\\langle f_\\perp,k_{x_i}\\rangle=0$", why: "$k_{x_i}\\in M$" },
      { do: "Preserve training values", result: "$f(x_i)=f_M(x_i)$ for every training input", why: "the perpendicular part is invisible to the loss" },
      { do: "Use Pythagoras", result: "$\\|f\\|^2=\\|f_M\\|^2+\\|f_\\perp\\|^2\\ge\\|f_M\\|^2$", why: "orthogonal norm squares add" },
      { do: "Remove the perpendicular part", result: "the objective cannot get worse", why: "the regularizer is nondecreasing in $\\|f\\|$" },
      { do: "Conclude finite representation", result: "$f(x)=\\sum_i\\alpha_i k(x_i,x)$", why: "a minimizer lies in the training span" },
      { do: "Solve the KRR system", result: "for $x_1=0,x_2=2,k=1+xz,y=(1,3),\\lambda=1$, $K=\\begin{pmatrix}1&1\\1&5\\end{pmatrix}$ and $(K+I)\\alpha=y$ gives $\\alpha=(3/11,5/11)$", why: "kernel ridge regression reduces to a Gram-matrix linear system" },
      { do: "Predict at $1$", result: "$f(1)=\\frac3{11}k(0,1)+\\frac5{11}k(2,1)=\\frac3{11}+\\frac{15}{11}=18/11\\approx1.636$", why: "use the learned coefficient representation" }
    ],
    applications: [
      { title: "KRR size", background: "Kernel ridge regression stores and solves with the Gram matrix.", numbers: "$500$ examples require $500^2=250000$ Gram entries." },
      { title: "SVM prediction", background: "An SVM prediction sums kernels over support vectors.", numbers: "$80$ support vectors require $80$ kernel evaluations per example." },
      { title: "Polynomial trick", background: "A polynomial kernel avoids explicitly building polynomial features.", numbers: "$k(2,3)=(1+2\\cdot3)^2=49$ instead of explicit features." },
      { title: "RBF similarity", background: "An RBF kernel turns squared distance into similarity.", numbers: "distance $2$ gives $e^{-2}=0.135$ for $k=e^{-\\|x-z\\|^2/2}$." },
      { title: "Kernel PCA", background: "Kernel PCA uses Gram-matrix eigenvalues for variance share.", numbers: "eigenvalues $6,2,1$ give first share $6/9=66.7\\%$." },
      { title: "GP posterior mean", background: "A GP posterior mean is a weighted sum of kernel similarities.", numbers: "weights $(0.4,-0.1)$ and similarities $(0.8,0.3)$ give $0.32-0.03=0.29$." }
    ]
  }
};
