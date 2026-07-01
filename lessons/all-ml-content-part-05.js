/* All ML — authored content for Part 5: Probabilistic & Graphical Models (5.1–5.24).
   Appends to window.ALLML_CONTENT. Every number here is mirrored by the verified notebooks.
   LaTeX via String.raw; emphasis is bold; no prose italics. */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

/* ---------------- 5.1 Bayesian inference foundations ---------------- */
window.ALLML_CONTENT["5.1"] = {
  tagline: "Belief becomes mathematics when prior knowledge and data are multiplied, normalized, and read as a posterior distribution.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/5.1-bayesian-inference.ipynb",
  context: String.raw`
    <p>Bayesian inference begins with probability, likelihood, and loss: probability supplies the prior distribution, likelihood measures how compatible data are with each hypothesis, and posterior summaries become decisions under loss. It feeds every model in Part 5, from Bayesian regression (5.2) and graphical models (5.3-5.7) to probabilistic programming (5.24).</p>`,
  intuition: String.raw`
    <p>The concrete problem is learning when the unknown quantity is not just a point but a state of uncertainty. The naive move is to choose the most likely parameter and pretend certainty; Bayesian inference keeps the whole distribution so downstream predictions know how much evidence they rest on. The design decision people gloss over is normalization: multiplying prior by likelihood gives only a score, and the evidence term turns scores into probabilities that can be compared across models.</p>`,
  mathematics: String.raw`
    <p>Here $\theta$ is the unknown parameter, $D$ is the data, $p(D\mid\theta)$ is the likelihood, $p(\theta)$ is the prior, and $p(D)$ is the evidence. In a Beta-Bernoulli model the prior $\mathrm{Beta}(\alpha,\beta)$ updates by adding successes to $\alpha$ and failures to $\beta$.</p>
    <div class="formula-box">$$p(\theta\mid D)=\frac{p(D\mid\theta)p(\theta)}{p(D)},\quad p(D)=\int p(D\mid\theta)p(\theta)d\theta$$</div>
    <p><b>Worked arithmetic.</b> The same quantities are computed in the companion notebook before the notebook is written:</p>
    <ol class="work">
          <li>prior $\mathrm{Beta}(2,3)$ plus $7$ successes and $3$ failures gives $\alpha=2+7=9$, $\beta=3+3=6$</li>
          <li>posterior predictive success probability $=9/(9+6)=9/15=0.600$</li>
          <li>posterior variance $=9\cdot6/((15)^2(16))=54/3600=0.015$</li>
          <li>evidence for $7$ successes in $10$ trials $=0.079920$</li>
        </ol>
    <p>These numbers are small on purpose: the point is to see exactly which term carries prior belief, which term carries evidence, and which normalization step turns local scores into a usable probability statement.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Forgetting the evidence.</b> The product $p(D\mid\theta)p(\theta)$ is only an unnormalized score; without $p(D)$ the posterior cannot be a probability distribution.</li><li><b>Replacing the posterior too early.</b> A MAP point discards the variance term that drives predictive uncertainty.</li><li><b>Using a prior as decoration.</b> In the Beta update, $\alpha$ and $\beta$ are actual pseudo-counts, so a strong prior can dominate small data.</li></ul>`
};

/* ---------------- 5.2 Bayesian linear & logistic regression ---------------- */
window.ALLML_CONTENT["5.2"] = {
  tagline: "Regression becomes a distribution over plausible weights, so prediction carries both a mean and an uncertainty band.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/5.2-bayesian-regression.ipynb",
  context: String.raw`
    <p>This lesson builds directly on posterior updating (5.1) and the linear/logistic models from earlier statistics. The design matrices supply the likelihood geometry; priors supply shrinkage; posterior predictive distributions support Gaussian Processes (5.14) and variational approximations (5.16).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a fitted coefficient is never known exactly. A point estimate says what slope looks best; a Bayesian regression asks which slopes remain plausible after data. The glossed-over design decision is to put the prior on weights, not predictions: weights are shared across inputs, so uncertainty transfers coherently to new points.</p>`,
  mathematics: String.raw`
    <p>Here $X$ is an $m\times d$ design matrix, $w$ is a $d$-vector of weights, $\sigma^2$ is observation noise, and $\mu,\Sigma$ are the posterior mean and covariance. Logistic regression keeps the same posterior idea but loses the Gaussian closed form, so grid, Laplace, VI, or MCMC approximations step in.</p>
    <div class="formula-box">$$p(w\mid X,y)\propto p(y\mid X,w)p(w),\quad \Sigma=(\Sigma_0^{-1}+X^\top X/\sigma^2)^{-1},\quad \mu=\Sigma X^\top y/\sigma^2$$</div>
    <p><b>Worked arithmetic.</b> The same quantities are computed in the companion notebook before the notebook is written:</p>
    <ol class="work">
          <li>precision $=1/4+(1^2+2^2+3^2)/0.25=0.25+56=56.25$</li>
          <li>posterior variance $=1/56.25=0.017778$</li>
          <li>weighted sum $=(1\cdot1.2+2\cdot1.9+3\cdot3.2)/0.25=14.6/0.25=58.4$ so mean $=0.017778\cdot58.4=1.038222$</li>
          <li>at $x_*=4$, mean $=4\cdot1.038222=4.152889$ and variance $=0.25+16\cdot0.017778=0.534444$</li>
        </ol>
    <p>These numbers are small on purpose: the point is to see exactly which term carries prior belief, which term carries evidence, and which normalization step turns local scores into a usable probability statement.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Confusing noise with parameter uncertainty.</b> The predictive variance includes both $\sigma^2$ and $x_*^\top\Sigma x_*$; dropping either gives overconfident intervals.</li><li><b>Using an unscaled prior.</b> A spherical prior shrinks coefficients unevenly when features have different units.</li><li><b>Expecting logistic conjugacy.</b> The Bernoulli-logit likelihood does not preserve a Gaussian prior, which is why approximate inference appears.</li></ul>`
};

/* ---------------- 5.3 Bayesian networks (directed models) ---------------- */
window.ALLML_CONTENT["5.3"] = {
  tagline: "Directed edges encode local conditional mechanisms, turning one impossible joint table into manageable conditional pieces.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/5.3-bayesian-networks.ipynb",
  context: String.raw`
    <p>Bayesian networks use conditional probability from (5.1) and graph factorization. They are the directed-model foundation for dynamic Bayesian networks (5.13), HMMs (5.9), and probabilistic programs (5.24).</p>`,
  intuition: String.raw`
    <p>The concrete problem is representing many variables without listing every joint assignment. The naive full table grows exponentially. A Bayesian network chooses parents for each variable and stores only the conditional table needed once those parents are known. The design decision is causal-looking direction: even when used only probabilistically, arrows define which conditional distributions are local.</p>`,
  mathematics: String.raw`
    <p>Here $x_i$ is a variable node and $\mathrm{pa}(x_i)$ is its parent set in the directed acyclic graph. For $A\to B\to C$, the joint is $p(A)p(B\mid A)p(C\mid B)$.</p>
    <div class="formula-box">$$p(x_1,\ldots,x_n)=\prod_{i=1}^n p(x_i\mid \mathrm{pa}(x_i))$$</div>
    <p><b>Worked arithmetic.</b> The same quantities are computed in the companion notebook before the notebook is written:</p>
    <ol class="work">
          <li>joint $p(A{=}1,B{=}1,C{=}1)=0.6\cdot0.7\cdot0.8=0.336$</li>
          <li>marginal $p(C{=}1)=0.4(0.8\cdot0.1+0.2\cdot0.8)+0.6(0.3\cdot0.1+0.7\cdot0.8)=0.450$</li>
          <li>posterior $p(A{=}1\mid C{=}1)=0.354/0.450=0.787$</li>
          <li>parameters full joint $=2^3-1=7$, BN factors $=1+2+2=5$</li>
        </ol>
    <p>These numbers are small on purpose: the point is to see exactly which term carries prior belief, which term carries evidence, and which normalization step turns local scores into a usable probability statement.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Reading every arrow as proof of causality.</b> The factorization is probabilistic; interventions require replacing a conditional, not merely observing a child.</li><li><b>Leaving cycles in the graph.</b> Directed Bayesian networks need acyclic parent order so the product is well-defined.</li><li><b>Forgetting hidden summations.</b> Marginals such as $p(C)$ require summing over every unobserved ancestor.</li></ul>`
};

/* ---------------- 5.4 Markov random fields (undirected models) ---------------- */
window.ALLML_CONTENT["5.4"] = {
  tagline: "Undirected models express mutual compatibility, then one global partition function turns scores into probabilities.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/5.4-mrfs.ipynb",
  context: String.raw`
    <p>MRFs build on the normalization idea in (5.1) but replace directed conditionals with clique potentials. They lead naturally to factor graphs (5.5), belief propagation (5.6), and CRFs (5.10).</p>`,
  intuition: String.raw`
    <p>The concrete problem is symmetric dependence: neighboring labels or pixels influence each other without a natural parent. A directed model forces an order; an MRF scores joint compatibility directly. The design decision is to allow unnormalized potentials, gaining modeling freedom at the price of computing the partition function.</p>`,
  mathematics: String.raw`
    <p>Here $c$ indexes cliques, $x_c$ is the assignment in a clique, $\psi_c$ is a nonnegative potential, and $Z$ normalizes all assignments.</p>
    <div class="formula-box">$$p(x)=\frac{1}{Z}\prod_{c\in\mathcal C}\psi_c(x_c),\quad Z=\sum_x\prod_{c\in\mathcal C}\psi_c(x_c)$$</div>
    <p><b>Worked arithmetic.</b> The same quantities are computed in the companion notebook before the notebook is written:</p>
    <ol class="work">
          <li>aligned score $=e^{0.8}=2.225541$, opposed score $=e^{-0.8}=0.449329$</li>
          <li>partition $Z=2e^{0.8}+2e^{-0.8}=5.349740$</li>
          <li>probability of one aligned state $=2.225541/5.349740=0.416009$</li>
          <li>marginal $p(X_1=1)=0.416009+0.083991=0.500$</li>
        </ol>
    <p>These numbers are small on purpose: the point is to see exactly which term carries prior belief, which term carries evidence, and which normalization step turns local scores into a usable probability statement.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Ignoring $Z$.</b> Potentials are not probabilities until divided by the partition function.</li><li><b>Assuming edge potentials create marginal bias.</b> Symmetric couplings can create dependence while each node stays balanced.</li><li><b>Expecting cheap exact inference.</b> Summing over $Z$ scales with the global state space unless structure is exploited.</li></ul>`
};

/* ---------------- 5.5 Factor graphs ---------------- */
window.ALLML_CONTENT["5.5"] = {
  tagline: "Factor graphs expose the algebra of a model: variables are connected exactly to the factors that mention them.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/5.5-factor-graphs.ipynb",
  context: String.raw`
    <p>Factor graphs unify directed factors from (5.3) and undirected potentials from (5.4). They are the cleanest language for belief propagation (5.6), junction trees (5.7), and message-passing views of probabilistic programs (5.24).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that graph semantics can hide the actual multiplication being performed. A factor graph makes every local function explicit. The design decision is bipartite structure: variables never connect directly to variables, because all influence must pass through a named factor that can send messages.</p>`,
  mathematics: String.raw`
    <p>Here $f_a$ is a factor, $x_a$ is the subset of variables it touches, and $Z$ is included when the product is unnormalized.</p>
    <div class="formula-box">$$p(x)=\frac{1}{Z}\prod_{a=1}^{A} f_a(x_a)$$</div>
    <p><b>Worked arithmetic.</b> The same quantities are computed in the companion notebook before the notebook is written:</p>
    <ol class="work">
          <li>unnormalized $(X{=}0,Y{=}0)=0.7\cdot2.0\cdot0.4=0.560$</li>
          <li>all scores sum to $1.100$, so $p(0,0)=0.560/1.100=0.509$</li>
          <li>message to $X=0$ before normalization $=2.0\cdot0.4+0.5\cdot0.6=1.100$</li>
          <li>message to $X=1$ before normalization $=0.5\cdot0.4+1.5\cdot0.6=1.100$</li>
        </ol>
    <p>These numbers are small on purpose: the point is to see exactly which term carries prior belief, which term carries evidence, and which normalization step turns local scores into a usable probability statement.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Multiplying incompatible shapes.</b> Every factor must be broadcast over exactly the variables it mentions.</li><li><b>Normalizing too early.</b> Local messages may be scaled for stability, but the final belief needs the correct product of incoming factors.</li><li><b>Hiding a dense factor.</b> One large factor can destroy the sparsity that made the graph attractive.</li></ul>`
};

/* ---------------- 5.6 Belief propagation (sum-product, max-product) ---------------- */
window.ALLML_CONTENT["5.6"] = {
  tagline: "Inference becomes a conversation: each message is a summarized view of one side of the graph.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/5.6-belief-propagation.ipynb",
  context: String.raw`
    <p>Belief propagation uses factor graphs (5.5) and exact marginalization. It powers HMM filtering (5.9), CRFs (5.10), and becomes exact on junction trees (5.7).</p>`,
  intuition: String.raw`
    <p>The concrete problem is repeated summation over many variables. Brute force recomputes the same partial sums. Message passing caches each partial sum once and sends it across an edge. The design decision is local recursion: a node sends to a neighbor using all information except the message that came from that neighbor.</p>`,
  mathematics: String.raw`
    <p>Here $m_{a\to i}$ is a factor-to-variable message and the sum removes all variables in factor $a$ except $x_i$. Max-product replaces the sum with a maximum for MAP states.</p>
    <div class="formula-box">$$m_{a\to i}(x_i)=\sum_{x_a\setminus x_i} f_a(x_a)\prod_{j\in a\setminus i} m_{j\to a}(x_j)$$</div>
    <p><b>Worked arithmetic.</b> The same quantities are computed in the companion notebook before the notebook is written:</p>
    <ol class="work">
          <li>right message to $Y$ from $Z$ is $[0.9\cdot0.3+0.1\cdot0.7,\;0.2\cdot0.3+0.8\cdot0.7]=[0.340,0.620]$</li>
          <li>left contribution to $Y$ is $[0.6,0.4]\begin{bmatrix}0.9&0.1\\0.2&0.8\end{bmatrix}=[0.620,0.380]$</li>
          <li>belief scores $=[0.620\cdot0.340,0.380\cdot0.620]=[0.2108,0.2356]$</li>
          <li>normalized $p(Y=0)=0.2108/(0.2108+0.2356)=0.472222$</li>
        </ol>
    <p>These numbers are small on purpose: the point is to see exactly which term carries prior belief, which term carries evidence, and which normalization step turns local scores into a usable probability statement.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Double-counting evidence.</b> A message back to a neighbor must exclude that neighbor’s incoming message.</li><li><b>Trusting loopy beliefs blindly.</b> On trees sum-product is exact; on graphs with cycles it is an approximation.</li><li><b>Confusing sum-product and max-product.</b> Marginals require sums; MAP paths require maxima and backpointers.</li></ul>`
};

/* ---------------- 5.7 The junction-tree algorithm ---------------- */
window.ALLML_CONTENT["5.7"] = {
  tagline: "Cycles become tractable when variables are clustered into a tree and separators agree.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/5.7-junction-tree.ipynb",
  context: String.raw`
    <p>The junction-tree algorithm turns loopy graphs from (5.4-5.6) into exact tree-structured message passing. It is the exact-inference counterpart to approximate methods like VI (5.16), EP (5.18), and MCMC (5.20).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that ordinary belief propagation is exact only on trees. Junction trees repair this by clustering variables until the cluster graph is a tree. The design decision is the running-intersection property: every variable must appear in a connected set of clusters, or messages will lose consistency.</p>`,
  mathematics: String.raw`
    <p>Here $C,D$ are cliques, $S=C\cap D$ is their separator, and the message sums out variables in $C$ not shared with $D$.</p>
    <div class="formula-box">$$m_{C\to D}(S)=\sum_{C\setminus S} \phi_C(C)\prod_{B\in N(C)\setminus D} m_{B\to C}(C\cap B)$$</div>
    <p><b>Worked arithmetic.</b> The same quantities are computed in the companion notebook before the notebook is written:</p>
    <ol class="work">
          <li>message from $AB$ to separator $B$: $[0.3+0.8,0.7+0.2]=[1.1,0.9]$</li>
          <li>calibrated $BC$ score table has total $1.1(0.9+0.1)+0.9(0.4+0.6)=2.0$</li>
          <li>marginal $p(C=1)=(1.1\cdot0.1+0.9\cdot0.6)/2.0=0.650/2.0=0.325$</li>
          <li>binary clique entries for $7$ variables $=2^7=128$</li>
        </ol>
    <p>These numbers are small on purpose: the point is to see exactly which term carries prior belief, which term carries evidence, and which normalization step turns local scores into a usable probability statement.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Violating running intersection.</b> If a variable appears in disconnected cliques, separator beliefs cannot agree.</li><li><b>Underestimating treewidth.</b> Exactness requires tables exponential in the largest clique size.</li><li><b>Calibrating once after changing evidence.</b> New evidence changes clique potentials and requires message updates.</li></ul>`
};

/* ---------------- 5.8 Structure learning ---------------- */
window.ALLML_CONTENT["5.8"] = {
  tagline: "Learning a graph means paying for edges only when their likelihood gain is worth the complexity.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/5.8-structure-learning.ipynb",
  context: String.raw`
    <p>Structure learning uses likelihood from (5.1) and graphical factorizations from (5.3). It prepares model selection in HMMs, DBNs, and probabilistic programs where structure may be learned or designed.</p>`,
  intuition: String.raw`
    <p>The concrete problem is choosing which dependencies deserve edges. A graph with every possible edge fits well but explains poorly and overfits. The design decision is scoring: combine data fit with a penalty so a new edge must earn its keep.</p>`,
  mathematics: String.raw`
    <p>Here $G$ is a graph, $\hat\theta_G$ are fitted parameters, $k_G$ is the number of free parameters, and $n$ is the number of samples.</p>
    <div class="formula-box">$$\mathrm{BIC}(G)=\log p(D\mid \hat\theta_G,G)-\frac{k_G}{2}\log n$$</div>
    <p><b>Worked arithmetic.</b> The same quantities are computed in the companion notebook before the notebook is written:</p>
    <ol class="work">
          <li>strong edge likelihood gain per sample $=0.177741$ nats</li>
          <li>BIC edge penalty for one extra parameter at $n=100$ is $0.5\log100=2.303$</li>
          <li>strong edge gain total $=17.774$, which exceeds $2.303$</li>
          <li>weak edge gain is small and loses to the same penalty</li>
        </ol>
    <p>These numbers are small on purpose: the point is to see exactly which term carries prior belief, which term carries evidence, and which normalization step turns local scores into a usable probability statement.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Searching greedily without safeguards.</b> Local edge additions can trap the search in a poor graph.</li><li><b>Ignoring Markov-equivalent graphs.</b> Different DAGs can encode the same conditional independences and receive the same observational score.</li><li><b>Rewarding tiny likelihood gains.</b> The $k_G\log n/2$ term is what prevents weak edges from accumulating.</li></ul>`
};

/* ---------------- 5.9 Hidden Markov Models ---------------- */
window.ALLML_CONTENT["5.9"] = {
  tagline: "A hidden state evolves through time, and each observation gives noisy evidence about where it is.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/5.9-hmms.ipynb",
  context: String.raw`
    <p>HMMs are dynamic Bayesian networks with one hidden chain and emissions. They use Bayesian filtering (5.1), message passing (5.6), and lead to Kalman filters (5.11) and CRFs (5.10).</p>`,
  intuition: String.raw`
    <p>The concrete problem is a sequence where the important state is not observed directly. Looking only at the latest observation is noisy; using all observations naively is exponential. The design decision is the Markov assumption: the current hidden state carries all relevant history, enabling forward messages.</p>`,
  mathematics: String.raw`
    <p>Here $z_t$ is the hidden state, $y_t$ is the observation, $T_{rs}=p(s\mid r)$ is the transition, and emissions are $p(y_t\mid s)$.</p>
    <div class="formula-box">$$\alpha_t(s)=p(y_{1:t},z_t=s)=p(y_t\mid s)\sum_{r}\alpha_{t-1}(r)p(s\mid r)$$</div>
    <p><b>Worked arithmetic.</b> The same quantities are computed in the companion notebook before the notebook is written:</p>
    <ol class="work">
          <li>first filter after observing $0$: normalize $[0.6\cdot0.9,0.4\cdot0.2]=[0.54,0.08]$ to $[0.871,0.129]$</li>
          <li>sequence likelihood scales multiply to $0.131542$</li>
          <li>Viterbi dynamic program returns path $[0,1,1]$</li>
          <li>future observations raise the smoothed initial probability of state $1$ above its filtered value</li>
        </ol>
    <p>These numbers are small on purpose: the point is to see exactly which term carries prior belief, which term carries evidence, and which normalization step turns local scores into a usable probability statement.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Normalizing away likelihood accidentally.</b> Scaled forward messages need their scale factors multiplied to recover $p(y_{1:T})$.</li><li><b>Using filtering when smoothing is needed.</b> Filtering uses past data only; smoothing also uses future observations.</li><li><b>Confusing Viterbi with marginals.</b> The most likely path is not the collection of most likely states independently.</li></ul>`
};

/* ---------------- 5.10 Conditional Random Fields ---------------- */
window.ALLML_CONTENT["5.10"] = {
  tagline: "A CRF scores label sequences directly conditioned on the observed input.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/5.10-crfs.ipynb",
  context: String.raw`
    <p>CRFs borrow undirected potentials from (5.4) and message passing from (5.6), but normalize conditionally. They are the discriminative cousin of HMMs (5.9).</p>`,
  intuition: String.raw`
    <p>The concrete problem is sequence labeling where observations are rich and overlapping. An HMM must model how inputs are generated; a CRF skips that burden and models labels given inputs. The design decision is conditional normalization: $Z(x)$ depends on the observed sequence, so features can look freely at $x$.</p>`,
  mathematics: String.raw`
    <p>Here $x$ is the observed sequence, $y$ is the label sequence, $f$ is a feature vector, $w$ is its weight vector, and $Z(x)$ sums over all label sequences.</p>
    <div class="formula-box">$$p(y\mid x)=\frac{1}{Z(x)}\exp\Big(\sum_t w^\top f(y_{t-1},y_t,x,t)\Big)$$</div>
    <p><b>Worked arithmetic.</b> The same quantities are computed in the companion notebook before the notebook is written:</p>
    <ol class="work">
          <li>one sequence score is unary terms plus transition rewards</li>
          <li>partition over $2^3=8$ label sequences is $Z(x)=47.151013$</li>
          <li>conditional probabilities are $e^{s(y)}/47.151013$</li>
          <li>the best path for the example is $(1,1,1)$ because transition smoothness beats the middle negative feature</li>
        </ol>
    <p>These numbers are small on purpose: the point is to see exactly which term carries prior belief, which term carries evidence, and which normalization step turns local scores into a usable probability statement.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Using local softmaxes independently.</b> The transition terms couple labels, so the whole sequence must be normalized through $Z(x)$.</li><li><b>Dropping the transition features.</b> Without them the model cannot reward label consistency.</li><li><b>Assuming generative likelihoods exist.</b> A CRF does not model $p(x)$, only $p(y\mid x)$.</li></ul>`
};

/* ---------------- 5.11 Kalman filters ---------------- */
window.ALLML_CONTENT["5.11"] = {
  tagline: "The Kalman gain is the trust coefficient between a noisy prediction and a noisy measurement.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/5.11-kalman-filters.ipynb",
  context: String.raw`
    <p>Kalman filters are Gaussian HMMs with linear dynamics. They use Bayesian updating (5.1), HMM recursion (5.9), and foreshadow particle filters (5.12) for nonlinear or non-Gaussian systems.</p>`,
  intuition: String.raw`
    <p>The concrete problem is tracking a state when both motion and sensors are noisy. The naive average treats all information equally. The Kalman filter weights prediction and measurement by their variances. The design decision is Gaussian closure: linear-Gaussian assumptions keep the posterior Gaussian after every step.</p>`,
  mathematics: String.raw`
    <p>Here $\hat x_t^-$ and $P_t^-$ are predicted mean and covariance, $Q$ is process noise, $R$ is measurement noise, and $K_t$ is the Kalman gain.</p>
    <div class="formula-box">$$\hat x_t^-=A\hat x_{t-1},\quad P_t^-=AP_{t-1}A^\top+Q,\quad K_t=P_t^-H^\top(HP_t^-H^\top+R)^{-1}$$</div>
    <p><b>Worked arithmetic.</b> The same quantities are computed in the companion notebook before the notebook is written:</p>
    <ol class="work">
          <li>prediction variance $P^- =1+0.2=1.200$</li>
          <li>gain $K=1.2/(1.2+0.5)=0.705882$</li>
          <li>updated mean $=0+0.705882(1.4-0)=0.988235$</li>
          <li>updated variance $=(1-0.705882)1.2=0.352941$</li>
        </ol>
    <p>These numbers are small on purpose: the point is to see exactly which term carries prior belief, which term carries evidence, and which normalization step turns local scores into a usable probability statement.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Tuning $Q$ and $R$ by feel only.</b> These variances determine the gain, so bad noise assumptions directly cause lag or jitter.</li><li><b>Forgetting prediction uncertainty.</b> Process noise must be added before the update or the filter becomes overconfident.</li><li><b>Applying it to nonlinear systems unchanged.</b> Nonlinear dynamics break Gaussian closure and require extensions or particles.</li></ul>`
};

/* ---------------- 5.12 Particle filters ---------------- */
window.ALLML_CONTENT["5.12"] = {
  tagline: "Particles carry an approximate posterior through nonlinear dynamics by predict, weight, and resample.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/5.12-particle-filters.ipynb",
  context: String.raw`
    <p>Particle filters generalize HMM/Kalman filtering (5.9, 5.11) using sampling (5.19). They are the sequential Monte Carlo bridge to MCMC (5.20).</p>`,
  intuition: String.raw`
    <p>The concrete problem is filtering when the posterior is not a neat Gaussian. A grid may be too large and a Kalman approximation too rigid. Particles use simulated states as movable probability mass. The design decision is resampling: it fights weight collapse but also reduces diversity.</p>`,
  mathematics: String.raw`
    <p>Here $x_t^{(i)}$ is particle $i$, $w_t^{(i)}$ is its normalized weight, and $\delta$ is a point mass.</p>
    <div class="formula-box">$$w_t^{(i)}\propto w_{t-1}^{(i)}p(y_t\mid x_t^{(i)}),\quad \hat p(x_t\mid y_{1:t})\approx\sum_i w_t^{(i)}\delta_{x_t^{(i)}}$$</div>
    <p><b>Worked arithmetic.</b> The same quantities are computed in the companion notebook before the notebook is written:</p>
    <ol class="work">
          <li>predicted particle mean in the verified run is $0.997563$</li>
          <li>weights are $w_i\propto \mathcal N(1.2; x_i,0.3)$ then normalized so $\sum_iw_i=1$</li>
          <li>posterior estimate is the weighted average $\sum_iw_ix_i$, which lies between $1.0$ and $1.3$</li>
          <li>effective sample size $=1/\sum_iw_i^2$, less than $N=200$ when weights concentrate</li>
        </ol>
    <p>These numbers are small on purpose: the point is to see exactly which term carries prior belief, which term carries evidence, and which normalization step turns local scores into a usable probability statement.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Letting weights degenerate.</b> When one weight dominates, effective sample size collapses and estimates use only a few particles.</li><li><b>Resampling every step blindly.</b> Resampling controls degeneracy but duplicates particles, reducing diversity.</li><li><b>Using too narrow a proposal.</b> If particles never reach high-likelihood regions, weighting cannot rescue them.</li></ul>`
};

/* ---------------- 5.13 Dynamic Bayesian networks ---------------- */
window.ALLML_CONTENT["5.13"] = {
  tagline: "A DBN repeats a local two-slice graph, sharing structure across time.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/5.13-dynamic-bayesian-networks.ipynb",
  context: String.raw`
    <p>DBNs generalize Bayesian networks (5.3) to temporal processes and contain HMMs (5.9) and Kalman filters (5.11) as special cases. They set up probabilistic programming over time (5.24).</p>`,
  intuition: String.raw`
    <p>The concrete problem is modeling many time steps without drawing a new graph for each one. A full temporal joint is huge. A DBN defines a two-slice template and repeats it. The design decision is parameter tying: the same transition mechanism is assumed to apply at each time unless evidence says otherwise.</p>`,
  mathematics: String.raw`
    <p>Here $x_t$ can be a vector of variables within slice $t$; the displayed first-order form is the simplest template.</p>
    <div class="formula-box">$$p(x_{1:T})=p(x_1)\prod_{t=2}^{T}p(x_t\mid x_{t-1})$$</div>
    <p><b>Worked arithmetic.</b> The same quantities are computed in the companion notebook before the notebook is written:</p>
    <ol class="work">
          <li>one prediction step is $[0.7,0.3]\begin{bmatrix}0.8&0.2\\0.25&0.75\end{bmatrix}=[0.635,0.365]$</li>
          <li>for $T=10$, untied binary transition parameters $=(10-1)\cdot2=18$</li>
          <li>tied template transition parameters $=2$</li>
          <li>evidence multiplies the predicted state vector by the sensor likelihood and renormalizes each slice</li>
        </ol>
    <p>These numbers are small on purpose: the point is to see exactly which term carries prior belief, which term carries evidence, and which normalization step turns local scores into a usable probability statement.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Unrolling without tying.</b> Untied parameters grow with time and lose the DBN’s data-sharing advantage.</li><li><b>Making the state too small.</b> The Markov property holds only if the slice contains all information needed for the future.</li><li><b>Ignoring evidence timing.</b> Filtering, prediction, and smoothing answer different temporal questions.</li></ul>`
};

/* ---------------- 5.14 Gaussian Processes ---------------- */
window.ALLML_CONTENT["5.14"] = {
  tagline: "A kernel is a prior over smoothness: it says which function values should move together.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/5.14-gaussian-processes.ipynb",
  context: String.raw`
    <p>Gaussian Processes extend Bayesian regression (5.2) from finite weights to distributions over functions. They connect to kernels, posterior conditioning, and approximate inference when datasets grow.</p>`,
  intuition: String.raw`
    <p>The concrete problem is flexible regression with calibrated uncertainty. A parametric model chooses features; a GP chooses a covariance function between inputs. The design decision is to specify similarity rather than basis weights, so uncertainty follows geometry in input space.</p>`,
  mathematics: String.raw`
    <p>Here $K$ is the covariance matrix from kernel $k$, $\sigma^2$ is observation noise, and $\mu_*$ is the posterior mean at test inputs.</p>
    <div class="formula-box">$$f(X)\sim\mathcal N(0,K),\quad K_{ij}=k(x_i,x_j),\quad \mu_*=K_{*X}(K_{XX}+\sigma^2I)^{-1}y$$</div>
    <p><b>Worked arithmetic.</b> The same quantities are computed in the companion notebook before the notebook is written:</p>
    <ol class="work">
          <li>RBF covariance at distance $2$ with $\ell=1$ is $e^{-2}=0.135335$</li>
          <li>posterior mean uses $K_{*X}(K_{XX}+0.1I)^{-1}y$</li>
          <li>posterior variance subtracts the explained covariance from prior variance $1$</li>
          <li>correlation at distance $1$ increases as $\ell$ moves from $0.4$ to $2.0$</li>
        </ol>
    <p>These numbers are small on purpose: the point is to see exactly which term carries prior belief, which term carries evidence, and which normalization step turns local scores into a usable probability statement.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Choosing length-scale carelessly.</b> It controls how fast covariance decays, so it directly sets smoothness and extrapolation.</li><li><b>Ignoring cubic cost.</b> Exact GP conditioning requires matrix solves that scale poorly with sample size.</li><li><b>Reading variance as noise only.</b> Posterior variance also reflects distance from training inputs.</li></ul>`
};

/* ---------------- 5.15 The EM algorithm (general) ---------------- */
window.ALLML_CONTENT["5.15"] = {
  tagline: "When labels are hidden, alternate between soft completion and ordinary fitting.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/5.15-em.ipynb",
  context: String.raw`
    <p>EM builds on latent-variable likelihood from (5.1) and appears in HMM training (5.9), mixture models, LDA (5.23), and probabilistic programming inference (5.24).</p>`,
  intuition: String.raw`
    <p>The concrete problem is maximum likelihood with missing or hidden assignments. Hard guessing hidden labels makes brittle mistakes. EM uses expected sufficient statistics under the current model, then refits as if those soft counts were observed. The design decision is monotonicity: each E/M pair improves a lower bound on observed likelihood.</p>`,
  mathematics: String.raw`
    <p>Here $x$ is observed data, $z$ is latent data, and $Q$ is the expected complete-data log-likelihood.</p>
    <div class="formula-box">$$Q(\theta\mid\theta^{old})=\mathbb E_{z\mid x,\theta^{old}}[\log p(x,z\mid\theta)],\quad \theta^{new}=\arg\max_\theta Q(\theta\mid\theta^{old})$$</div>
    <p><b>Worked arithmetic.</b> The same quantities are computed in the companion notebook before the notebook is written:</p>
    <ol class="work">
          <li>responsibility for the first sequence is near $1$ for the high-bias coin because $0.8^8 0.2^2$ dwarfs $0.3^8 0.7^2$</li>
          <li>M-step computes $\theta_k=\sum_ir_{ik}h_i/(10\sum_ir_{ik})$</li>
          <li>observed log-likelihood after one update is no smaller than before</li>
          <li>soft counts differ from hard assignments because uncertain rows contribute to both coins</li>
        </ol>
    <p>These numbers are small on purpose: the point is to see exactly which term carries prior belief, which term carries evidence, and which normalization step turns local scores into a usable probability statement.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Expecting global optimality.</b> EM climbs to a local optimum and depends strongly on initialization.</li><li><b>Hardening responsibilities too soon.</b> The E-step is soft because uncertainty in $z$ must affect parameter updates.</li><li><b>Comparing complete-data likelihoods.</b> EM guarantees nondecrease of observed likelihood, not arbitrary diagnostics.</li></ul>`
};

/* ---------------- 5.16 Variational inference ---------------- */
window.ALLML_CONTENT["5.16"] = {
  tagline: "Approximate inference by choosing the best distribution inside a tractable family.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/5.16-variational-inference.ipynb",
  context: String.raw`
    <p>VI follows Bayesian inference (5.1) when exact posteriors are unavailable. It scales to topic models (5.23), probabilistic programming (5.24), and has stochastic form in SVI (5.17).</p>`,
  intuition: String.raw`
    <p>The concrete problem is an intractable posterior. Sampling can be slow; VI turns inference into optimization. The design decision is to pick a family $q$ that is easy to compute with, accepting approximation bias in exchange for speed and scalability.</p>`,
  mathematics: String.raw`
    <p>Here $q(z)$ is the variational approximation, $\mathcal L$ is the ELBO, and maximizing it minimizes $\mathrm{KL}(q\|p)$ within the chosen family.</p>
    <div class="formula-box">$$\log p(x)=\mathcal L(q)+\mathrm{KL}(q(z)\|p(z\mid x)),\quad \mathcal L(q)=\mathbb E_q[\log p(x,z)-\log q(z)]$$</div>
    <p><b>Worked arithmetic.</b> The same quantities are computed in the companion notebook before the notebook is written:</p>
    <ol class="work">
          <li>for $p=[0.1,0.3,0.6]$ and $q=[0.2,0.5,0.3]$, ELBO $=\sum q\log p-\sum q\log q=-0.186098$</li>
          <li>KL gap $=\sum q\log(q/p)=0.186098$</li>
          <li>the unrestricted ELBO peaks when $q=p$</li>
          <li>mean-field outer product leaves visible residual correlation in the $2\times2$ joint</li>
        </ol>
    <p>These numbers are small on purpose: the point is to see exactly which term carries prior belief, which term carries evidence, and which normalization step turns local scores into a usable probability statement.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Forgetting family bias.</b> A mean-field $q$ cannot represent posterior correlations no matter how well optimized.</li><li><b>Maximizing a noisy ELBO blindly.</b> Numerical estimates need enough precision to compare updates.</li><li><b>Confusing KL directions.</b> $\mathrm{KL}(q\|p)$ often under-covers multi-modal posteriors.</li></ul>`
};

/* ---------------- 5.17 Stochastic variational inference ---------------- */
window.ALLML_CONTENT["5.17"] = {
  tagline: "SVI makes VI scalable by replacing full-data updates with noisy, scaled minibatch updates.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/5.17-svi.ipynb",
  context: String.raw`
    <p>SVI extends VI (5.16) using stochastic optimization. It is essential for large topic models (5.23) and probabilistic programs (5.24).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that full variational updates scan all data. SVI samples a minibatch, scales its sufficient statistics to represent the full dataset, and takes a damped natural-gradient step. The design decision is step-size scheduling: noisy updates must be large enough to move and small enough to converge.</p>`,
  mathematics: String.raw`
    <p>Here $\lambda$ is a global variational natural parameter, $\hat\lambda_t$ is the minibatch-scaled update, and $\rho_t$ is the learning rate.</p>
    <div class="formula-box">$$\lambda_t=(1-\rho_t)\lambda_{t-1}+\rho_t\hat\lambda_t,\quad \rho_t=(t+\tau)^{-\kappa}$$</div>
    <p><b>Worked arithmetic.</b> The same quantities are computed in the companion notebook before the notebook is written:</p>
    <ol class="work">
          <li>full update for ten Bernoulli observations with seven successes is $[1+7,1+3]=[8,4]$</li>
          <li>minibatch $[1,0,1,1]$ scales by $10/4=2.5$, giving $[1+7.5,1+2.5]=[8.5,3.5]$</li>
          <li>with $\rho=0.3$, new parameter $=0.7[1,1]+0.3[8.5,3.5]=[3.25,1.75]$</li>
          <li>larger minibatches reduce variance of the scaled sufficient statistic</li>
        </ol>
    <p>These numbers are small on purpose: the point is to see exactly which term carries prior belief, which term carries evidence, and which normalization step turns local scores into a usable probability statement.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Forgetting minibatch scaling.</b> A batch of size $B$ must represent $N$ observations or the global update is biased small.</li><li><b>Using a constant large step.</b> The stochastic path will keep bouncing instead of settling.</li><li><b>Judging one minibatch ELBO.</b> Single-batch objectives are noisy; use held-out or averaged diagnostics.</li></ul>`
};

/* ---------------- 5.18 Expectation propagation ---------------- */
window.ALLML_CONTENT["5.18"] = {
  tagline: "EP refines simple local site approximations by matching moments of one factor at a time.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/5.18-expectation-propagation.ipynb",
  context: String.raw`
    <p>EP is another approximate inference route alongside VI (5.16) and sampling (5.19). It is useful when local moment matching is easier than global KL optimization.</p>`,
  intuition: String.raw`
    <p>The concrete problem is a posterior with difficult factors. VI chooses one global approximation; EP approximates each factor locally. The design decision is cavity-tilted replacement: remove the old site, combine the true factor with the cavity, match moments, then insert a new site.</p>`,
  mathematics: String.raw`
    <p>Here $\tilde f_i$ is an approximate site, $q_{\setminus i}$ is the cavity distribution, and the tilted distribution is proportional to $f_i(x)q_{\setminus i}(x)$.</p>
    <div class="formula-box">$$q(x)\propto\prod_i \tilde f_i(x),\quad q_{\setminus i}(x)\propto q(x)/\tilde f_i(x)$$</div>
    <p><b>Worked arithmetic.</b> The same quantities are computed in the companion notebook before the notebook is written:</p>
    <ol class="work">
          <li>site natural parameters add: precision $=1/2+1/3=0.833333$</li>
          <li>global variance $=1/0.833333=1.200$ and mean $=(1/3)/0.833333=0.400$</li>
          <li>cavity after removing site 2 has variance $2.000$ and mean $0.000$</li>
          <li>tilted moments $(0.8,0.5)$ imply site natural parameters $[2,1.6]-[0.5,0]=[1.5,1.6]$</li>
        </ol>
    <p>These numbers are small on purpose: the point is to see exactly which term carries prior belief, which term carries evidence, and which normalization step turns local scores into a usable probability statement.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Skipping the cavity.</b> Matching with the old site still included double-counts the factor.</li><li><b>Undamped updates.</b> Moment-matched sites can jump too far and destabilize EP.</li><li><b>Assuming convergence is guaranteed.</b> EP often works well but can oscillate without careful scheduling.</li></ul>`
};

/* ---------------- 5.19 Sampling (rejection, importance) ---------------- */
window.ALLML_CONTENT["5.19"] = {
  tagline: "Sampling estimates integrals by drawing from something easy and correcting toward the target.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/5.19-sampling.ipynb",
  context: String.raw`
    <p>Sampling is the Monte Carlo foundation for particle filters (5.12), MCMC (5.20), and HMC (5.21). It uses expectations from Bayesian inference (5.1).</p>`,
  intuition: String.raw`
    <p>The concrete problem is an expectation that cannot be summed or integrated exactly. Rejection sampling keeps exact draws but may waste many proposals; importance sampling keeps all draws but weights them. The design decision is proposal choice: computation succeeds only if the proposal covers the target well.</p>`,
  mathematics: String.raw`
    <p>Here $p$ is the target distribution, $q$ is the proposal, and $p(x)/q(x)$ is the importance weight.</p>
    <div class="formula-box">$$\mathbb E_p[h(X)] = \mathbb E_q\left[h(X)\frac{p(X)}{q(X)}\right]$$</div>
    <p><b>Worked arithmetic.</b> The same quantities are computed in the companion notebook before the notebook is written:</p>
    <ol class="work">
          <li>target/proposal ratios for uniform $q$ are $[0.4,0.8,1.6,1.2]$</li>
          <li>rejection envelope $M=1.6$, so acceptance $=1/1.6=0.625$</li>
          <li>importance estimate of $E[X]$ is $0(0.1)+1(0.2)+2(0.4)+3(0.3)=1.900$</li>
          <li>bad proposal lowers effective sample size below $3$ out of $4$</li>
        </ol>
    <p>These numbers are small on purpose: the point is to see exactly which term carries prior belief, which term carries evidence, and which normalization step turns local scores into a usable probability statement.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Using a proposal with missing support.</b> If $q(x)=0$ where $p(x)\gt0$, importance weights cannot correct the miss.</li><li><b>Trusting high-variance weights.</b> A few huge weights lower effective sample size and make estimates unstable.</li><li><b>Choosing a loose rejection envelope.</b> Large $M$ lowers acceptance rate directly.</li></ul>`
};

/* ---------------- 5.20 MCMC: Metropolis–Hastings & Gibbs ---------------- */
window.ALLML_CONTENT["5.20"] = {
  tagline: "MCMC trades independent samples for a Markov chain whose stationary distribution is the posterior.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/5.20-mcmc.ipynb",
  context: String.raw`
    <p>MCMC builds on sampling (5.19) when direct proposals are hard. Gibbs uses conditionals from graphical models; HMC (5.21) improves continuous proposals.</p>`,
  intuition: String.raw`
    <p>The concrete problem is drawing from a distribution known only up to a normalizing constant. MH accepts or rejects local proposals so the chain visits states in target proportions. The design decision is stationarity rather than independence: correlated samples are acceptable if long-run frequencies are right.</p>`,
  mathematics: String.raw`
    <p>Here $\pi$ is the unnormalized target and $q$ is the proposal kernel. Gibbs is the special case that samples each variable from its exact conditional.</p>
    <div class="formula-box">$$a(x\to x^\prime)=\min\left(1,\frac{\pi(x^\prime)q(x\mid x^\prime)}{\pi(x)q(x^\prime\mid x)}\right)$$</div>
    <p><b>Worked arithmetic.</b> The same quantities are computed in the companion notebook before the notebook is written:</p>
    <ol class="work">
          <li>MH move from state $1$ to $2$ has acceptance $\min(1,0.4/0.2)=1$</li>
          <li>a symmetric random-walk chain visits states close to $[0.1,0.2,0.4,0.3]$</li>
          <li>Gibbs conditional $p(X=1\mid Y=1)=4/(1+4)=0.800$</li>
          <li>burn-in reduces initialization bias in the verified chain</li>
        </ol>
    <p>These numbers are small on purpose: the point is to see exactly which term carries prior belief, which term carries evidence, and which normalization step turns local scores into a usable probability statement.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Ignoring burn-in and mixing.</b> Early samples reflect initialization, and highly correlated chains explore slowly.</li><li><b>Dropping proposal asymmetry.</b> The $q$ ratio is required unless proposals are symmetric.</li><li><b>Using marginals as a MAP path.</b> Samples estimate distributions; optimization questions need different summaries.</li></ul>`
};

/* ---------------- 5.21 Hamiltonian Monte Carlo & NUTS ---------------- */
window.ALLML_CONTENT["5.21"] = {
  tagline: "Gradients let MCMC move far while preserving high acceptance.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/5.21-hmc-nuts.ipynb",
  context: String.raw`
    <p>HMC improves MCMC (5.20) for continuous posteriors by using geometry. NUTS automates trajectory length, making probabilistic programming (5.24) more practical.</p>`,
  intuition: String.raw`
    <p>The concrete problem is random-walk behavior in high dimensions. Small MH steps accept but move slowly; large blind steps reject. HMC introduces momentum and follows approximate energy-preserving paths. The design decision is the leapfrog integrator: it is reversible and volume-preserving, so MH correction remains valid.</p>`,
  mathematics: String.raw`
    <p>Here $q$ is position, $p$ is momentum, $U(q)=-\log\pi(q)$, $K(p)$ is kinetic energy, and $\epsilon$ is the step size.</p>
    <div class="formula-box">$$H(q,p)=U(q)+K(p),\quad p\leftarrow p-\frac{\epsilon}{2}\nabla U(q),\quad q\leftarrow q+\epsilon M^{-1}p$$</div>
    <p><b>Worked arithmetic.</b> The same quantities are computed in the companion notebook before the notebook is written:</p>
    <ol class="work">
          <li>leapfrog half-step $p_{1/2}=0.3-0.1\cdot1=0.2$</li>
          <li>position update $q_1=1+0.2\cdot0.2=1.040$</li>
          <li>energy changes by less than $0.01$, so MH acceptance exceeds $0.99$</li>
          <li>NUTS stops when displacement dot momentum becomes negative</li>
        </ol>
    <p>These numbers are small on purpose: the point is to see exactly which term carries prior belief, which term carries evidence, and which normalization step turns local scores into a usable probability statement.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Choosing step size too large.</b> Leapfrog energy error grows and acceptance collapses.</li><li><b>Choosing trajectories too short.</b> HMC degenerates into a random walk.</li><li><b>Ignoring divergences.</b> They signal geometry the integrator cannot follow accurately.</li></ul>`
};

/* ---------------- 5.22 Nonparametric Bayes & Dirichlet processes ---------------- */
window.ALLML_CONTENT["5.22"] = {
  tagline: "A Dirichlet process lets the data decide how many clusters are needed.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/5.22-dirichlet-processes.ipynb",
  context: String.raw`
    <p>Dirichlet processes extend Bayesian inference (5.1) beyond fixed-dimensional parameter choices. They support mixture models and topic modeling ideas in (5.23).</p>`,
  intuition: String.raw`
    <p>The concrete problem is clustering without knowing the number of clusters. A fixed $K$ either underfits or wastes components. The Dirichlet process keeps a prior over countably many atoms, but finite data uses only finitely many. The design decision is rich-get-richer prediction plus a persistent new-cluster option.</p>`,
  mathematics: String.raw`
    <p>Here $n_k$ is the count at cluster $k$, $n$ is total observations, and $\alpha$ controls new-cluster tendency.</p>
    <div class="formula-box">$$P(z_{n+1}=k\mid z_{1:n})=\frac{n_k}{n+\alpha},\quad P(z_{n+1}=\text{new})=\frac{\alpha}{n+\alpha}$$</div>
    <p><b>Worked arithmetic.</b> The same quantities are computed in the companion notebook before the notebook is written:</p>
    <ol class="work">
          <li>with counts $[3,1]$ and $\alpha=2$, probabilities are $[3/6,1/6,2/6]=[0.500,0.167,0.333]$</li>
          <li>new-cluster probability after $n$ customers is $2/(2+n)$</li>
          <li>expected clusters at $n=100$ is between $8$ and $9$</li>
          <li>predictive mean $=(3\cdot0.2+1\cdot0.8+2\cdot0.5)/6=0.400$</li>
        </ol>
    <p>These numbers are small on purpose: the point is to see exactly which term carries prior belief, which term carries evidence, and which normalization step turns local scores into a usable probability statement.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Calling it infinite clusters in the data.</b> The prior has countably many atoms, but any finite dataset occupies finitely many.</li><li><b>Overreading $\alpha$.</b> It changes new-cluster probability, not the semantic quality of clusters.</li><li><b>Ignoring base distribution.</b> New clusters draw parameters from the base measure, so it shapes what novelty means.</li></ul>`
};

/* ---------------- 5.23 Latent Dirichlet Allocation & topic models ---------------- */
window.ALLML_CONTENT["5.23"] = {
  tagline: "Documents mix topics, and topics mix words.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/5.23-lda.ipynb",
  context: String.raw`
    <p>LDA combines Dirichlet priors (5.22), EM/VI ideas (5.15-5.17), and graphical models. It is a canonical latent-variable model for discrete data.</p>`,
  intuition: String.raw`
    <p>The concrete problem is discovering themes in documents without labels. A single topic per document is too rigid; a separate word distribution per document does not share structure. LDA chooses two levels of mixtures. The design decision is exchangeability within documents: word order is ignored so co-occurrence drives topics.</p>`,
  mathematics: String.raw`
    <p>Here $\theta_d$ is document-topic mixture, $\phi_k$ is topic-word distribution, $z_{dn}$ is a topic assignment, and $w_{dn}$ is a word.</p>
    <div class="formula-box">$$p(w,z,\theta,\phi)=\prod_k p(\phi_k\mid\eta)\prod_d p(\theta_d\mid\alpha)\prod_n p(z_{dn}\mid\theta_d)p(w_{dn}\mid\phi_{z_{dn}})$$</div>
    <p><b>Worked arithmetic.</b> The same quantities are computed in the companion notebook before the notebook is written:</p>
    <ol class="work">
          <li>document-topic mean $=[8+0.5,2+0.5]/11=[0.772727,0.227273]$</li>
          <li>topic-word rows normalize counts plus $\eta=0.1$</li>
          <li>Gibbs conditional for a word is proportional to document-topic count times topic-word probability</li>
          <li>the predictive word distribution is $\theta_d^\top\phi$ and sums to $1$</li>
        </ol>
    <p>These numbers are small on purpose: the point is to see exactly which term carries prior belief, which term carries evidence, and which normalization step turns local scores into a usable probability statement.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Interpreting topics as guaranteed semantic concepts.</b> They are probability vectors over words and need human validation.</li><li><b>Setting $\alpha$ too large.</b> Documents become diffuse mixtures and topics lose contrast.</li><li><b>Ignoring label switching.</b> Topic numbers have no inherent identity across runs.</li></ul>`
};

/* ---------------- 5.24 Probabilistic programming ---------------- */
window.ALLML_CONTENT["5.24"] = {
  tagline: "A probabilistic program writes the data-generating story; inference conditions that story on observations.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/5.24-probabilistic-programming.ipynb",
  context: String.raw`
    <p>Probabilistic programming ties together Bayesian inference (5.1), graphical models (5.3-5.7), VI (5.16), and MCMC/HMC (5.20-5.21). It is the capstone language for Part 5.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that every new probabilistic model used to require a custom inference engine. A probabilistic program separates model from inference: you write random choices and observations, and a backend enumerates, samples, or optimizes. The design decision is trace semantics: each execution path is a latent assignment with a probability score.</p>`,
  mathematics: String.raw`
    <p>Here $z$ denotes latent random choices in the program, $y_i$ are observed values, and the product is the accumulated likelihood score of a trace.</p>
    <div class="formula-box">$$p(z\mid y)\propto p(z)\prod_i p(y_i\mid z)$$</div>
    <p><b>Worked arithmetic.</b> The same quantities are computed in the companion notebook before the notebook is written:</p>
    <ol class="work">
          <li>trace joint table is prior times likelihood and sums to $1$</li>
          <li>evidence for $y=1$ is $0.7\cdot0.1+0.3\cdot0.8=0.310$</li>
          <li>posterior $p(z=1\mid y=1)=0.24/0.31=0.774194$</li>
          <li>posterior predictive reuses the same likelihood under the posterior trace weights</li>
        </ol>
    <p>These numbers are small on purpose: the point is to see exactly which term carries prior belief, which term carries evidence, and which normalization step turns local scores into a usable probability statement.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Hiding impossible observations.</b> Conditioning on zero-likelihood traces makes inference fail or collapse.</li><li><b>Confusing simulation with inference.</b> Running the prior program draws from $p(z,y)$; conditioning requires reweighting or sampling from $p(z\mid y)$.</li><li><b>Writing models with bad geometry.</b> HMC and VI inherit the posterior geometry created by the program.</li></ul>`
};
