/* All of Statistics (Larry Wasserman) — Chapter 19: Log-Linear Models.
   Self-registering book-template lessons, one per key concept. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "All of Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "All of Statistics" }, o));

  // 1 — The log-linear model
  B({
    id: "aos-ch19-the-log-linear-model",
    chapter: "Chapter 19",
    title: "The Log-Linear Model",
    tagline: "Re-parameterize a multinomial over a contingency table by writing the log of its probability function as a sum of interaction terms.",
    sections: [
      { h: "The setup — discrete data as a multinomial", body:
        "<p>Log-linear models are tools for modeling several discrete variables at once. Let $X = (X_1,\\dots,X_m)$ be a discrete random vector with probability function $f(x) = \\mathbb{P}(X=x) = \\mathbb{P}(X_1=x_1,\\dots,X_m=x_m)$, writing $x = (x_1,\\dots,x_m)$. Here $X_j$ means the $j$-th variable and $x_j$ is the particular value it takes.</p>" +
        "<p>Suppose $X_j$ takes $r_j$ different values; without loss of generality assume those values are $0,1,\\dots,r_j-1$. With $n$ such random vectors observed, the data behave like a sample from a <strong>multinomial</strong> with $N = r_1 \\times r_2 \\times \\cdots \\times r_m$ categories — one category for each cell of an $r_1 \\times r_2 \\times \\cdots \\times r_m$ table. The data are then represented as <strong>counts</strong> in that <strong>contingency table</strong>, and $p = (p_1,\\dots,p_N)$ denotes the multinomial parameter (the cell probabilities).</p>" +
        "<p>Notation for subsets: let $S = \\{1,\\dots,m\\}$ index the variables. For a subset $A \\subset S$, write $x_A = (x_j : j \\in A)$ for the coordinates of $x$ named by $A$. For example, if $A = \\{1,3\\}$ then $x_A = (x_1,x_3)$.</p>" },
      { h: "The log-linear expansion", body:
        "<p><strong>Theorem 19.1.</strong> The joint probability function $f(x)$ of a single random vector $X = (X_1,\\dots,X_m)$ can always be written as</p>" +
        "<p>$\\log f(x) = \\sum_{A \\subset S} \\psi_A(x),$</p>" +
        "<p>a sum over <em>all</em> subsets $A$ of $S$, where the $\\psi$-terms (psi-terms) satisfy three conditions: (1) $\\psi_\\emptyset(x)$ is a constant; (2) for every $A \\subset S$, $\\psi_A(x)$ depends only on the coordinates $x_A$, not on the rest; and (3) if $i \\in A$ and $x_i = 0$, then $\\psi_A(x) = 0$.</p>" +
        "<p>This formula is the <strong>log-linear expansion</strong> of $f$. Each $\\psi_A(x)$ may depend on unknown parameters $\\beta_A$; collecting them gives $\\beta = (\\beta_A : A \\subset S)$, and we write $f(x) = f(x;\\beta)$ to emphasize the dependence. The terms with $|A| = 1$ are <strong>main effects</strong>; terms with $|A| \\ge 2$ are <strong>interactions</strong> measuring how the variables associate.</p>" },
      { h: "Two equivalent parameter spaces", body:
        "<p>There are two ways to describe the same model. The multinomial parameter space is</p>" +
        "<p>$\\mathcal{P} = \\{ p = (p_1,\\dots,p_N) : p_j \\ge 0,\\ \\sum_{j=1}^N p_j = 1 \\},$</p>" +
        "<p>an $N-1$ dimensional space (the probabilities are non-negative and sum to one). The log-linear parameter space is</p>" +
        "<p>$\\Theta = \\{ \\beta = (\\beta_1,\\dots,\\beta_N) : \\beta = \\beta(p),\\ p \\in \\mathcal{P} \\},$</p>" +
        "<p>an $N-1$ dimensional surface in $\\mathbb{R}^N$. We can move back and forth between the two descriptions: $\\beta = \\beta(p)$ and $p = p(\\beta)$. The log-linear model is therefore just a re-parameterization of the multinomial.</p>" },
      { h: "Example — Bernoulli", body:
        "<p><strong>Example 19.2.</strong> Let $X \\sim \\text{Bernoulli}(p)$ with $0 \\lt p \\lt 1$. Write the mass function for $x = 0,1$ as $f(x) = p^x(1-p)^{1-x} = p_1^x p_2^{1-x}$, where $p_1 = p$ and $p_2 = 1-p$. Taking logs gives $\\log f(x) = \\psi_\\emptyset(x) + \\psi_1(x)$ with</p>" +
        "<ul class=\"steps\">" +
        "<li>$\\psi_\\emptyset(x) = \\log(p_2)$ — a constant (does not depend on $x$).</li>" +
        "<li>$\\psi_1(x) = x\\log(p_1/p_2)$ — which is $0$ when $x = 0$, as required.</li>" +
        "</ul>" +
        "<p>All three conditions of Theorem 19.1 hold. The log-linear parameters are $\\beta_0 = \\log(p_2)$ and $\\beta_1 = \\log(p_1/p_2)$. The multinomial space is $\\mathcal{P} = \\{(p_1,p_2): p_j \\ge 0,\\ p_1+p_2 = 1\\}$ and the log-linear space is $\\Theta = \\{(\\beta_0,\\beta_1) \\in \\mathbb{R}^2 : e^{\\beta_0+\\beta_1} + e^{\\beta_0} = 1\\}$. Given $(p_1,p_2)$ we can solve for $(\\beta_0,\\beta_1)$ and vice versa.</p>" },
      { h: "Example — a 2-by-3 table", body:
        "<p><strong>Example 19.3.</strong> Let $X = (X_1,X_2)$ with $X_1 \\in \\{0,1\\}$ and $X_2 \\in \\{0,1,2\\}$. The joint distribution is a multinomial with $6$ categories, laid out as a $2 \\times 3$ table of cell probabilities $p_{x_1 x_2}$ (e.g. $p_{00}, p_{01}, \\dots, p_{12}$), with matching observed counts $C_{x_1 x_2}$. The log-linear expansion is $\\log f(x) = \\psi_\\emptyset(x) + \\psi_1(x) + \\psi_2(x) + \\psi_{12}(x)$, where</p>" +
        "<ul class=\"steps\">" +
        "<li>$\\psi_\\emptyset(x) = \\log p_{00}$ (the constant, tied to the baseline cell where everything is $0$).</li>" +
        "<li>$\\psi_1(x) = x_1\\log(p_{10}/p_{00})$ — the main effect of $X_1$.</li>" +
        "<li>$\\psi_2(x) = I(x_2{=}1)\\log(p_{01}/p_{00}) + I(x_2{=}2)\\log(p_{02}/p_{00})$ — the main effect of $X_2$ (with indicators $I(\\cdot)$ that equal $1$ when the condition holds).</li>" +
        "<li>$\\psi_{12}(x) = I(x_1{=}1,x_2{=}1)\\log(p_{11}p_{00}/(p_{01}p_{10})) + I(x_1{=}1,x_2{=}2)\\log(p_{12}p_{00}/(p_{02}p_{10}))$ — the interaction.</li>" +
        "</ul>" +
        "<p>This model has six parameters $\\beta_1,\\dots,\\beta_6$, matching the $6-1 = 5$ free probabilities plus the constant. Each $\\psi$ obeys the three conditions: every term involving a coordinate equals $0$ whenever that coordinate is $0$, and the interaction $\\psi_{12}$ captures how the two variables associate through the cross-product ratios.</p>" }
    ],
    takeaways: [
      "Discrete multivariate data are modeled as a multinomial over the cells of an r_1 x ... x r_m contingency table.",
      "Theorem 19.1: log f(x) always equals a sum of psi-terms over all subsets A of the variables.",
      "The three conditions force psi_empty to be constant, each psi_A to depend only on x_A, and any psi_A to vanish when a coordinate it uses is 0.",
      "Single-coordinate terms are main effects; multi-coordinate terms are interactions, and the model is just a re-parameterized multinomial."
    ]
  });

  // 2 — Graphical and hierarchical log-linear models
  B({
    id: "aos-ch19-graphical-hierarchical",
    chapter: "Chapter 19",
    title: "Graphical and Hierarchical Models",
    tagline: "Setting interaction terms to zero encodes conditional independence; graphical and hierarchical models are two structured ways to do that.",
    sections: [
      { h: "Zero terms mean conditional independence", body:
        "<p>The reason to drop terms is independence. <strong>Theorem 19.4.</strong> Let $(X_a, X_b, X_c)$ be a partition of the variables $(X_1,\\dots,X_m)$. Then $X_b$ is conditionally independent of $X_c$ given $X_a$, written $X_b \\amalg X_c \\mid X_a$, if and only if every $\\psi$-term in the log-linear expansion that has at least one coordinate in $b$ <em>and</em> at least one coordinate in $c$ equals $0$.</p>" +
        "<p>The proof leans on Lemma 19.5: $X_b \\amalg X_c \\mid X_a$ holds exactly when $f(x_a,x_b,x_c) = g(x_a,x_b)h(x_a,x_c)$ factors into a part not touching $c$ times a part not touching $b$. If every $\\psi_t$ with coordinates in both $b$ and $c$ is zero, the surviving terms split into one group touching only $a \\cup b$ and another touching only $a \\cup c$; exponentiating gives exactly that factorization, so the conditional independence follows.</p>" },
      { h: "Graphical models", body:
        "<p>A log-linear model is <strong>graphical</strong> if its missing terms correspond <em>only</em> to conditional independence constraints. <strong>Definition 19.6.</strong> For $\\log f(x) = \\sum_{A \\subset S}\\psi_A(x)$, the model $f$ is graphical if all $\\psi$-terms are nonzero except those for any pair of coordinates not joined by an edge in a graph $\\mathcal{G}$. Concretely, $\\psi_A(x) = 0$ if and only if there is a pair $\\{i,j\\} \\subset A$ with $(i,j)$ not an edge.</p>" +
        "<p>A useful test: if you can add a term to the model without changing the graph, the model is <em>not</em> graphical.</p>" +
        "<p><strong>Example 19.7.</strong> For the graph in Figure 19.1, the missing edge $(1,5)$ forces out every term containing both indices $1$ and $5$ — $\\psi_{15}, \\psi_{125}, \\psi_{135}, \\psi_{145}, \\psi_{1235}, \\psi_{1245}, \\psi_{1345}, \\psi_{12345}$ — and the missing edge $(2,4)$ likewise removes $\\psi_{24}, \\psi_{124}, \\psi_{234}, \\psi_{245}, \\psi_{1234}, \\psi_{1245}, \\psi_{2345}, \\psi_{12345}$. A second model with the same graph but the three-way terms also dropped is <em>not</em> graphical: it has extra constraints beyond conditional independence (for instance dropping $\\psi_{235}$ says the strength of association between $X_2$ and $X_3$ does not vary with $X_5$).</p>" },
      { h: "Hierarchical models", body:
        "<p>Hierarchical models form a larger, much-used class. <strong>Definition 19.8.</strong> A log-linear model is <strong>hierarchical</strong> if $\\psi_A = 0$ and $A \\subset B$ together imply $\\psi_B = 0$. In words: if you remove a term, you must remove every higher-order term built on top of it.</p>" +
        "<p><strong>Lemma 19.9.</strong> Every graphical model is hierarchical, but the reverse need not hold.</p>" +
        "<p><strong>Example 19.10.</strong> $\\log f = \\psi_\\emptyset + \\psi_1 + \\psi_2 + \\psi_3 + \\psi_{12} + \\psi_{13}$ is hierarchical, and also graphical because all terms involving $(2,3)$ are absent (its graph is a path $X_2 - X_1 - X_3$). <strong>Example 19.11</strong> adds $\\psi_{23}$: $\\log f = \\psi_\\emptyset + \\psi_1 + \\psi_2 + \\psi_3 + \\psi_{12} + \\psi_{13} + \\psi_{23}$. This is hierarchical, and its graph is the complete triangle on $X_1,X_2,X_3$ (Figure 19.3); it is <em>not</em> graphical because $\\psi_{123} = 0$ does not correspond to any pairwise conditional independence. <strong>Example 19.12:</strong> $\\log f = \\psi_\\emptyset + \\psi_3 + \\psi_{12}$ is <em>not</em> hierarchical, since $\\psi_2 = 0$ while $\\psi_{12} \\ne 0$; not being hierarchical, it is not graphical either.</p>" }
    ],
    takeaways: [
      "Theorem 19.4: X_b is independent of X_c given X_a exactly when every psi-term touching both b and c is zero.",
      "Graphical (Def 19.6): missing terms correspond ONLY to conditional independencies read off a graph's missing edges.",
      "Hierarchical (Def 19.8): if psi_A = 0 and A is contained in B, then psi_B = 0 too.",
      "Every graphical model is hierarchical (Lemma 19.9), but a hierarchical model can have extra constraints and not be graphical."
    ]
  });

  // 3 — Model generators
  B({
    id: "aos-ch19-model-generators",
    chapter: "Chapter 19",
    title: "Model Generators",
    tagline: "Name a hierarchical model by listing only its highest-order terms; the lower-order terms are implied.",
    sections: [
      { h: "The shorthand", body:
        "<p>Hierarchical models can be written compactly using <strong>generators</strong>. Take $X = (X_1, X_2, X_3)$. The generator $M = 1.2 + 1.3$ stands for</p>" +
        "<p>$\\log f = \\psi_\\emptyset + \\psi_1 + \\psi_2 + \\psi_3 + \\psi_{12} + \\psi_{13}.$</p>" +
        "<p>The notation reads as: include $\\psi_{12}$ and $\\psi_{13}$. Because the model must be hierarchical, every lower-order term contained in those is automatically included as well (here $\\psi_1, \\psi_2, \\psi_3$ and the constant). Listing only the top-level terms is enough to pin down the whole model.</p>" },
      { h: "Worked generators", body:
        "<p>The book gives several generators for the three-variable case:</p>" +
        "<ul class=\"steps\">" +
        "<li>$M = 1.2.3$ is the <strong>saturated model</strong>: $\\log f = \\psi_\\emptyset + \\psi_1 + \\psi_2 + \\psi_3 + \\psi_{12} + \\psi_{13} + \\psi_{23} + \\psi_{123}$. Every possible term is present; it corresponds to fitting an unconstrained multinomial.</li>" +
        "<li>$M = 1 + 2 + 3$ is the <strong>mutual independence model</strong>: $\\log f = \\psi_\\emptyset + \\psi_1 + \\psi_2 + \\psi_3$. All interactions are dropped, so the three variables are independent.</li>" +
        "<li>$M = 1.2$ gives $\\log f = \\psi_\\emptyset + \\psi_1 + \\psi_2 + \\psi_{12}$. This model makes $X_3 \\mid X_2 = x_2, X_1 = x_1$ a uniform distribution (no term involves $X_3$).</li>" +
        "</ul>" +
        "<p>So a generator is a compact recipe: write the maximal interaction terms separated by $+$, and let hierarchy fill in the rest.</p>" }
    ],
    takeaways: [
      "A generator lists only the highest-order psi-terms; lower-order terms are implied by the hierarchy rule.",
      "M = 1.2.3 is the saturated model (all terms) — an unconstrained multinomial.",
      "M = 1 + 2 + 3 is the mutual independence model (no interactions).",
      "M = 1.2 includes psi_12 but no term with X_3, making X_3 conditionally uniform."
    ]
  });

  // 4 — Fitting log-linear models to data
  B({
    id: "aos-ch19-fitting-to-data",
    chapter: "Chapter 19",
    title: "Fitting Log-Linear Models to Data",
    tagline: "Fit by maximum likelihood, choose terms with AIC or the deviance test, and read independence directly off the surviving terms.",
    sections: [
      { h: "Maximum likelihood and model selection", body:
        "<p>Let $\\beta$ denote all the parameters of a log-linear model $M$. The loglikelihood is $\\ell(\\beta) = \\sum_{i=1}^n \\log f(X_i;\\beta)$, where $f(X_i;\\beta)$ is the probability function (Eq. 19.1) for the $i$-th observed vector $X_i = (X_{i1},\\dots,X_{im})$. The MLE $\\hat\\beta$ generally must be found numerically; the Fisher information matrix is also computed numerically, and its inverse supplies the estimated standard errors.</p>" +
        "<p>Fitting raises a model selection question — which $\\psi$-terms to keep — just like variable selection in linear regression. One approach uses <strong>AIC</strong>: choose the model $M$ that maximizes $\\text{AIC}(M) = \\hat\\ell(M) - |M|$, where $|M|$ is the number of parameters and $\\hat\\ell(M)$ is the maximized loglikelihood. The search is usually restricted to hierarchical models, which shrinks the search space and keeps the models interpretable.</p>" },
      { h: "The deviance test", body:
        "<p>A second approach uses hypothesis testing against the saturated model $M_{sat}$ (the model with all $\\psi$-terms). For each candidate $M$ we test $H_0$: the true model is $M$ versus $H_1$: the true model is $M_{sat}$. The likelihood ratio statistic for this is the <strong>deviance</strong>.</p>" +
        "<p><strong>Definition 19.13.</strong> $\\text{dev}(M) = 2(\\hat\\ell_{sat} - \\hat\\ell_M)$, where $\\hat\\ell_{sat}$ and $\\hat\\ell_M$ are the maximized loglikelihoods of the saturated model and of $M$.</p>" +
        "<p><strong>Theorem 19.14.</strong> Under $H_0$, the deviance converges in distribution to $\\chi^2_\\nu$, with degrees of freedom $\\nu$ equal to the difference in the number of parameters between $M_{sat}$ and $M$. The book warns against testing every sub-model: doing so invites many Type I and Type II errors, and failing to reject $H_0$ may simply reflect low power, leaving a poor model accepted.</p>" },
      { h: "Example — breast cancer data", body:
        "<p><strong>Example 19.15.</strong> Data from Morrison et al. (1973) cross-classify diagnostic center ($X_1$: Boston or Glamorgan), nuclear grade ($X_2$: malignant or benign), and survival ($X_3$: died or survived). The observed counts:</p>" +
        "<table class=\"extable\"><thead><tr><th></th><th>malignant, died</th><th>malignant, survived</th><th>benign, died</th><th>benign, survived</th></tr></thead><tbody>" +
        "<tr><td class=\"row-h\">Boston</td><td class=\"num\">35</td><td class=\"num\">59</td><td class=\"num\">47</td><td class=\"num\">112</td></tr>" +
        "<tr><td class=\"row-h\">Glamorgan</td><td class=\"num\">42</td><td class=\"num\">77</td><td class=\"num\">26</td><td class=\"num\">76</td></tr>" +
        "</tbody></table>" +
        "<p>Fitting the saturated log-linear model gives eight estimated coefficients. With Boston, malignant, and died as the baseline cell, the saturated fit exactly reproduces the observed counts and yields:</p>" +
        "<table class=\"extable\"><thead><tr><th>Variable</th><th>$\\hat\\beta_j$</th><th>$\\widehat{se}$</th><th>$W_j$</th><th>p-value</th></tr></thead><tbody>" +
        "<tr><td class=\"row-h\">(Intercept)</td><td class=\"num\">3.56</td><td class=\"num\">0.17</td><td class=\"num\">21.03</td><td class=\"num\">0.00</td></tr>" +
        "<tr><td class=\"row-h\">center</td><td class=\"num\">0.18</td><td class=\"num\">0.22</td><td class=\"num\">0.79</td><td class=\"num\">0.42</td></tr>" +
        "<tr><td class=\"row-h\">grade</td><td class=\"num\">0.29</td><td class=\"num\">0.22</td><td class=\"num\">1.32</td><td class=\"num\">0.18</td></tr>" +
        "<tr><td class=\"row-h\">survival</td><td class=\"num\">0.52</td><td class=\"num\">0.21</td><td class=\"num\">2.44</td><td class=\"num\">0.01</td></tr>" +
        "<tr><td class=\"row-h\">center&times;grade</td><td class=\"num\">-0.77</td><td class=\"num\">0.33</td><td class=\"num\">-2.31</td><td class=\"num\">0.02</td></tr>" +
        "<tr><td class=\"row-h\">center&times;survival</td><td class=\"num\">0.08</td><td class=\"num\">0.28</td><td class=\"num\">0.29</td><td class=\"num\">0.76</td></tr>" +
        "<tr><td class=\"row-h\">grade&times;survival</td><td class=\"num\">0.34</td><td class=\"num\">0.27</td><td class=\"num\">1.25</td><td class=\"num\">0.20</td></tr>" +
        "<tr><td class=\"row-h\">center&times;grade&times;survival</td><td class=\"num\">0.12</td><td class=\"num\">0.40</td><td class=\"num\">0.29</td><td class=\"num\">0.76</td></tr>" +
        "</tbody></table>" +
        "<p>The best sub-model, found by AIC with backward search, keeps the intercept, all three main effects, and two two-way interactions — center&times;grade and grade&times;survival — but drops center&times;survival and the three-way term. The fitted coefficients of the chosen model:</p>" +
        "<table class=\"extable\"><thead><tr><th>Variable</th><th>$\\hat\\beta_j$</th><th>$\\widehat{se}$</th><th>$W_j$</th><th>p-value</th></tr></thead><tbody>" +
        "<tr><td class=\"row-h\">(Intercept)</td><td class=\"num\">3.52</td><td class=\"num\">0.13</td><td class=\"num\">25.62</td><td class=\"num\">&lt; 0.00</td></tr>" +
        "<tr><td class=\"row-h\">center</td><td class=\"num\">0.23</td><td class=\"num\">0.13</td><td class=\"num\">1.70</td><td class=\"num\">0.08</td></tr>" +
        "<tr><td class=\"row-h\">grade</td><td class=\"num\">0.26</td><td class=\"num\">0.18</td><td class=\"num\">1.43</td><td class=\"num\">0.15</td></tr>" +
        "<tr><td class=\"row-h\">survival</td><td class=\"num\">0.56</td><td class=\"num\">0.14</td><td class=\"num\">3.98</td><td class=\"num\">6.65e-05</td></tr>" +
        "<tr><td class=\"row-h\">center&times;grade</td><td class=\"num\">-0.67</td><td class=\"num\">0.18</td><td class=\"num\">-3.62</td><td class=\"num\">&lt; 0.00</td></tr>" +
        "<tr><td class=\"row-h\">grade&times;survival</td><td class=\"num\">0.37</td><td class=\"num\">0.19</td><td class=\"num\">1.90</td><td class=\"num\">0.05</td></tr>" +
        "</tbody></table>" },
      { h: "Reading the fit and the link to independence", body:
        "<p>Because the chosen model keeps center&times;grade and grade&times;survival but drops center&times;survival (and the three-way term), it is graphical with graph $\\text{Center} - \\text{Grade} - \\text{Survival}$ (Figure 19.5): grade sits between the other two. By Theorem 19.4 the missing center&times;survival term means center and survival are conditionally independent given grade.</p>" +
        "<p>To check the fit, compute the deviance of this model $M$, which is $0.6$. The reference $\\chi^2$ has $8 - 6 = 2$ degrees of freedom (eight parameters in the saturated model, six in $M$), so the p-value is $\\mathbb{P}(\\chi^2_2 \\gt 0.6) = 0.74$. A large p-value means no evidence that the model fits poorly.</p>" +
        "<ul class=\"steps\">" +
        "<li>Deviance $\\text{dev}(M) = 2(\\hat\\ell_{sat} - \\hat\\ell_M) = 0.6$.</li>" +
        "<li>Degrees of freedom $\\nu = 8 - 6 = 2$.</li>" +
        "<li>p-value $= \\mathbb{P}(\\chi^2_2 \\gt 0.6) = 0.74$ — no evidence of poor fit.</li>" +
        "</ul>" +
        "<p>So after fitting and selecting a model, the surviving terms tell the independence story directly: center and survival are independent once nuclear grade is known.</p>" }
    ],
    takeaways: [
      "Fit log-linear models by maximum likelihood (numerically); standard errors come from the inverse Fisher information.",
      "Select terms with AIC (maximize loglikelihood minus number of parameters) or via deviance tests, usually within hierarchical models.",
      "Deviance dev(M) = 2(l_sat - l_M) is approximately chi-squared with df = difference in parameter counts.",
      "Breast cancer fit: deviance 0.6 on 2 df gives p = 0.74 (good fit); dropping center x survival means center and survival are independent given grade."
    ]
  });
  window.CODEVIZ["aos-ch19-fitting-to-data"] = {
    charts: [ {
      type: "bars",
      title: "Example 19.15 — breast cancer counts by center, grade, survival",
      interpret: "Observed cell counts cross-classifying the three binary variables; the fitted model finds center and survival independent given grade.",
      labels: ["Boston mal/died", "Boston mal/surv", "Boston ben/died", "Boston ben/surv", "Glam mal/died", "Glam mal/surv", "Glam ben/died", "Glam ben/surv"],
      values: [35, 59, 47, 112, 42, 77, 26, 76]
    } ],
    code: "# Log-linear fit for Example 19.15 (Poisson likelihood for cell counts)\nimport numpy as np\nfrom scipy.optimize import minimize\nfrom scipy.stats import chi2\n\ny = np.array([35, 59, 47, 112, 42, 77, 26, 76.])  # book's 2 x 2 x 2 table\nrows = [(c, g, s) for c in [0, 1] for g in [0, 1] for s in [0, 1]]\nX = np.array([[1, c, g, s, c*g, g*s] for c, g, s in rows], float)  # selected AIC model\n\ndef nll(beta):\n    eta = X @ beta\n    mu = np.exp(eta)\n    return np.sum(mu - y * eta)\n\nbeta = minimize(nll, np.zeros(X.shape[1]), method='BFGS').x\nprint(np.round(beta, 2))       # [3.52, 0.23, 0.26, 0.56, -0.67, 0.37] in the book\n# saturated log-likelihood minus selected log-likelihood gives deviance = 0.600...\nprint(chi2.sf(0.600069, df=2)) # 0.7408; book reports P(chi^2_2 > 0.6) = 0.74"
  };
})();
