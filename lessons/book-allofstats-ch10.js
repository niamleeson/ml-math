/* All of Statistics (Larry Wasserman) — Chapter 10: Hypothesis Testing and p-values */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "All of Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "All of Statistics" }, o));

  B({
    id: "aos-ch10-wald-test",
    chapter: "Chapter 10",
    title: "The Wald test",
    tagline: "Standardize an estimate by its standard error and reject when it strays too far from the null value.",
    sections: [
      {
        h: "Setup",
        body: "<p>The chapter frames testing through the asbestos-and-rats story: split rats into an exposed group and an unexposed group and ask whether the disease rate differs. Formally we split the parameter space $\\Theta$ into two pieces and test $H_0 : \\theta \\in \\Theta_0$ against $H_1 : \\theta \\in \\Theta_1$. Here $H_0$ is the <strong>null hypothesis</strong> (the status quo, e.g. \"same rate\") and $H_1$ the <strong>alternative</strong>. We pick a <strong>rejection region</strong> $R$, usually of the form $R = \\{x : T(x) \\gt c\\}$, where $T$ is a <strong>test statistic</strong> and $c$ a <strong>critical value</strong>. If the data land in $R$ we reject $H_0$; otherwise we retain it.</p><p>Wasserman compares this to a trial: we presume innocence (retain $H_0$) unless the evidence is strong. Rejecting a true $H_0$ is a <strong>type I error</strong>; retaining $H_0$ when $H_1$ holds is a <strong>type II error</strong>. The <strong>size</strong> of a test is $\\alpha = \\sup_{\\theta \\in \\Theta_0} \\beta(\\theta)$, where the power function is $\\beta(\\theta) = \\mathbb{P}_\\theta(X \\in R)$.</p>"
      },
      {
        h: "Definition of the Wald test",
        body: "<p>Let $\\theta$ be a scalar parameter, $\\hat{\\theta}$ an estimate, and $\\hat{\\mathsf{se}}$ its estimated standard error (the typical size of the estimate's random wobble). To test $H_0 : \\theta = \\theta_0$ versus $H_1 : \\theta \\neq \\theta_0$, assume $\\hat{\\theta}$ is asymptotically Normal, meaning $(\\hat{\\theta} - \\theta_0)/\\hat{\\mathsf{se}} \\rightsquigarrow N(0,1)$. The size $\\alpha$ Wald test rejects $H_0$ when $|W| \\gt z_{\\alpha/2}$, where</p><p>$$W = \\frac{\\hat{\\theta} - \\theta_0}{\\hat{\\mathsf{se}}}.$$</p><p>Here $z_{\\alpha/2} = \\Phi^{-1}(1 - \\alpha/2)$ is the Normal cutoff that leaves $\\alpha/2$ probability in each tail. The test has size $\\alpha$ asymptotically because, under the null, $\\mathbb{P}_{\\theta_0}(|W| \\gt z_{\\alpha/2}) \\to \\mathbb{P}(|Z| \\gt z_{\\alpha/2}) = \\alpha$ as the sample grows.</p>"
      },
      {
        h: "Power and the link to confidence intervals",
        body: "<p>When the truth is $\\theta_\\star \\neq \\theta_0$, the power (chance of correctly rejecting) is approximately $1 - \\Phi\\!\\left(\\frac{\\theta_0 - \\theta_\\star}{\\hat{\\mathsf{se}}} + z_{\\alpha/2}\\right) + \\Phi\\!\\left(\\frac{\\theta_0 - \\theta_\\star}{\\hat{\\mathsf{se}}} - z_{\\alpha/2}\\right)$. Since $\\hat{\\mathsf{se}}$ shrinks as $n$ grows, power is large when $\\theta_\\star$ is far from $\\theta_0$ and when the sample is large. The chapter also notes the Wald test rejects $H_0$ exactly when $\\theta_0$ lies outside the $1-\\alpha$ confidence interval $\\hat{\\theta} \\pm \\hat{\\mathsf{se}}\\, z_{\\alpha/2}$ &mdash; so testing is equivalent to checking whether the null value sits in the interval.</p><p><strong>Warning.</strong> Rejecting $H_0$ means a result is \"statistically significant,\" but the effect could still be tiny and scientifically unimportant. Statistical significance is not the same as scientific significance.</p>"
      },
      {
        h: "Worked example — comparing two means",
        body: "<p>For two independent samples with means $\\mu_1, \\mu_2$, test $H_0 : \\delta = 0$ where $\\delta = \\mu_1 - \\mu_2$. The plug-in estimate is $\\hat{\\delta} = \\overline{X} - \\overline{Y}$ with $\\hat{\\mathsf{se}} = \\sqrt{s_1^2/m + s_2^2/n}$. The chapter applies this to cholesterol data ($\\overline{X} = 216.2$, $\\overline{Y} = 195.3$, $s_1 = 5$, $s_2 = 2.4$):</p><ul class=\"steps\"><li>Difference of means: $\\hat{\\delta} = 216.2 - 195.3 = 20.9$.</li><li>Standard error: $\\hat{\\mathsf{se}} = \\sqrt{5^2 + 2.4^2} = \\sqrt{25 + 5.76} = \\sqrt{30.76} \\approx 5.546$.</li><li>Wald statistic: $W = 20.9 / 5.546 \\approx 3.78$.</li><li>Since $|W| = 3.78 \\gt z_{0.025} = 1.96$, reject $H_0$ at the 5% level.</li></ul>"
      }
    ],
    takeaways: [
      "Wald statistic: estimate minus null value, divided by its standard error.",
      "Reject when $|W| \\gt z_{\\alpha/2}$; size is $\\alpha$ for large samples.",
      "Rejecting is equivalent to the null value falling outside the confidence interval.",
      "Statistical significance need not mean a large or important effect."
    ]
  });

  B({
    id: "aos-ch10-p-values",
    chapter: "Chapter 10",
    title: "p-values",
    tagline: "The smallest level at which the test rejects — read as the strength of evidence against the null.",
    sections: [
      {
        h: "Why report a p-value",
        body: "<p>Saying only \"reject $H_0$\" or \"retain $H_0$\" hides how decisive the data were. Instead, ask for every level $\\alpha$ whether the test rejects. If it rejects at level $\\alpha$, it also rejects at any larger $\\alpha' \\gt \\alpha$, so there is a smallest level at which rejection occurs. That number is the <strong>p-value</strong>. Formally, with size $\\alpha$ rejection regions $R_\\alpha$, the p-value is $\\inf\\{\\alpha : T(X^n) \\in R_\\alpha\\}$ &mdash; the smallest level at which we can reject $H_0$.</p>"
      },
      {
        h: "How to compute it",
        body: "<p>For a test that rejects when $T(X^n) \\ge c_\\alpha$, the p-value equals $\\sup_{\\theta \\in \\Theta_0} \\mathbb{P}_\\theta(T(X^n) \\ge T(x^n))$, where $x^n$ is the observed data; if $\\Theta_0 = \\{\\theta_0\\}$ this is simply $\\mathbb{P}_{\\theta_0}(T(X^n) \\ge T(x^n))$. In words: the p-value is the probability, computed under $H_0$, of seeing a test statistic at least as extreme as the one observed. For the Wald statistic with observed value $w$, the p-value is $\\mathbb{P}_{\\theta_0}(|W| \\gt |w|) \\approx \\mathbb{P}(|Z| \\gt |w|) = 2\\Phi(-|w|)$.</p>"
      },
      {
        h: "Reading the number",
        body: "<p>Smaller p-values mean stronger evidence against $H_0$. The chapter gives this evidence scale (table below). It also issues two warnings. First, a <em>large</em> p-value is not evidence <em>for</em> $H_0$ &mdash; it can arise either because $H_0$ is true or because the test had low power. Second, the p-value is <strong>not</strong> $\\mathbb{P}(H_0 \\mid \\text{Data})$; it is not the probability that the null is true.</p><table class=\"extable\"><thead><tr><th>p-value</th><th>Evidence against $H_0$</th></tr></thead><tbody><tr><td class=\"row-h\">$\\lt .01$</td><td>very strong</td></tr><tr><td class=\"row-h\">$.01 - .05$</td><td>strong</td></tr><tr><td class=\"row-h\">$.05 - .10$</td><td>weak</td></tr><tr><td class=\"row-h\">$\\gt .1$</td><td>little or none</td></tr></tbody></table>"
      },
      {
        h: "Worked examples",
        body: "<p>Continuing the cholesterol example, the Wald statistic was $W = 3.78$, so:</p><ul class=\"steps\"><li>Means: $\\text{p-value} = \\mathbb{P}(|Z| \\gt 3.78) = 2\\,\\mathbb{P}(Z \\lt -3.78) = .0002$ &mdash; very strong evidence against equal means.</li><li>Medians: with $\\hat{\\nu}_1 - \\hat{\\nu}_2 = 212.5 - 194 = 18.5$ and a bootstrap standard error of $7.7$, $W = 18.5/7.7 = 2.4$, giving $\\text{p-value} = \\mathbb{P}(|Z| \\gt 2.4) = .02$ &mdash; strong evidence.</li></ul><p>A useful fact: if the test statistic is continuous, then under $H_0$ the p-value has a Uniform$(0,1)$ distribution. So rejecting when the p-value is below $\\alpha$ gives a type I error rate of exactly $\\alpha$.</p>"
      }
    ],
    takeaways: [
      "p-value = smallest level at which the test rejects $H_0$.",
      "Equivalently, the under-$H_0$ probability of a statistic at least as extreme as observed.",
      "Small p-value = strong evidence against $H_0$; large p-value is not evidence for it.",
      "The p-value is not $\\mathbb{P}(H_0\\mid\\text{Data})$.",
      "Under $H_0$ a continuous test statistic's p-value is Uniform$(0,1)$."
    ]
  });

  B({
    id: "aos-ch10-chi-squared-pearson",
    chapter: "Chapter 10",
    title: "Pearson chi-squared test",
    tagline: "Compare observed counts to expected counts; the standardized sum has a chi-squared distribution.",
    sections: [
      {
        h: "The chi-squared distribution",
        body: "<p>Let $Z_1, \\ldots, Z_k$ be independent standard Normals and $V = \\sum_{i=1}^k Z_i^2$. Then $V$ has a <strong>chi-squared distribution with $k$ degrees of freedom</strong>, written $V \\sim \\chi^2_k$, with density $f(v) = \\frac{v^{(k/2)-1} e^{-v/2}}{2^{k/2}\\Gamma(k/2)}$ for $v \\gt 0$. Its mean is $\\mathbb{E}(V) = k$ and variance $\\mathbb{V}(V) = 2k$. The upper $\\alpha$ quantile $\\chi^2_{k,\\alpha}$ satisfies $\\mathbb{P}(\\chi^2_k \\gt \\chi^2_{k,\\alpha}) = \\alpha$.</p>"
      },
      {
        h: "Pearson's statistic for multinomial data",
        body: "<p>Suppose counts $X = (X_1, \\ldots, X_k)$ are multinomial$(n, p)$ and we want to test $H_0 : p = p_0$ against $H_1 : p \\neq p_0$, where $p_0 = (p_{01}, \\ldots, p_{0k})$ is a fixed vector. Pearson's $\\chi^2$ statistic is</p><p>$$T = \\sum_{j=1}^k \\frac{(X_j - n p_{0j})^2}{n p_{0j}} = \\sum_{j=1}^k \\frac{(X_j - E_j)^2}{E_j},$$</p><p>where $E_j = \\mathbb{E}(X_j) = n p_{0j}$ is the expected count in cell $j$ under the null. Each term measures how far an observed count strays from its expected count, scaled by that expected count. Under $H_0$, $T \\rightsquigarrow \\chi^2_{k-1}$, so the test rejects when $T \\gt \\chi^2_{k-1,\\alpha}$ and the p-value is $\\mathbb{P}(\\chi^2_{k-1} \\gt t)$ for observed value $t$.</p>"
      },
      {
        h: "Worked example — Mendel's peas",
        body: "<p>Mendel's theory of inheritance predicts the four pea types occur with probabilities $p_0 = (9/16, 3/16, 3/16, 1/16)$. In $n = 556$ trials he observed $X = (315, 101, 108, 32)$. Expected counts: $E_1 = 556 \\cdot 9/16 = 312.75$, $E_2 = E_3 = 556 \\cdot 3/16 = 104.25$, $E_4 = 556 \\cdot 1/16 = 34.75$.</p><ul class=\"steps\"><li>$\\frac{(315 - 312.75)^2}{312.75} = \\frac{2.25^2}{312.75} = \\frac{5.0625}{312.75} \\approx 0.0162$.</li><li>$\\frac{(101 - 104.25)^2}{104.25} = \\frac{(-3.25)^2}{104.25} = \\frac{10.5625}{104.25} \\approx 0.1013$.</li><li>$\\frac{(108 - 104.25)^2}{104.25} = \\frac{3.75^2}{104.25} = \\frac{14.0625}{104.25} \\approx 0.1349$.</li><li>$\\frac{(32 - 34.75)^2}{34.75} = \\frac{(-2.75)^2}{34.75} = \\frac{7.5625}{34.75} \\approx 0.2176$.</li><li>Sum: $\\chi^2 \\approx 0.0162 + 0.1013 + 0.1349 + 0.2176 = 0.47$.</li></ul><p>The $\\alpha = .05$ cutoff for $\\chi^2_3$ is $7.815$. Since $0.47$ is far below $7.815$, do not reject. The p-value is $\\mathbb{P}(\\chi^2_3 \\gt .47) = .93$, no evidence against Mendel's theory. The chapter cautions that failing to reject does not prove $H_0$ true &mdash; it may just reflect low power, and a confidence set for the distance between $p$ and $p_0$ might serve better.</p>"
      }
    ],
    takeaways: [
      "$\\chi^2_k$ is the distribution of a sum of $k$ squared independent standard Normals; mean $k$, variance $2k$.",
      "Pearson's $T$ sums $(\\text{observed}-\\text{expected})^2/\\text{expected}$ over cells.",
      "Under $H_0$, $T \\rightsquigarrow \\chi^2_{k-1}$; reject for large $T$.",
      "Mendel's peas: $\\chi^2 = 0.47$, p-value $.93$ — data consistent with the 9:3:3:1 theory."
    ]
  });

  B({
    id: "aos-ch10-permutation-test",
    chapter: "Chapter 10",
    title: "The permutation test",
    tagline: "An exact, distribution-free test: shuffle the labels and see how often a statistic beats the observed value.",
    sections: [
      {
        h: "The idea",
        body: "<p>The permutation test is a nonparametric method for testing whether two samples come from the same distribution. It is <em>exact</em> &mdash; it does not rely on large-sample approximations. With $X_1, \\ldots, X_m \\sim F_X$ and $Y_1, \\ldots, Y_n \\sim F_Y$, we test $H_0 : F_X = F_Y$ versus $H_1 : F_X \\neq F_Y$ &mdash; the kind of hypothesis you ask when checking whether a treatment differs from a placebo. Pick a test statistic such as $T = |\\overline{X}_m - \\overline{Y}_n|$.</p><p>Let $N = m + n$. Under $H_0$ the labels are interchangeable, so each of the $N!$ orderings of the pooled data is equally likely. Compute $T$ for every permutation, giving values $T_1, \\ldots, T_{N!}$; the distribution putting mass $1/N!$ on each is the <strong>permutation distribution</strong>. With observed value $t_{obs}$ (rejecting when $T$ is large), the p-value is $\\frac{1}{N!}\\sum_{j=1}^{N!} I(T_j \\gt t_{obs})$ &mdash; the fraction of permutations giving a more extreme statistic.</p>"
      },
      {
        h: "Toy example",
        body: "<p>Take data $(X_1, X_2, Y_1) = (1, 9, 3)$ with $T = |\\overline{X} - \\overline{Y}|$. The observed value uses $\\{1,9\\}$ as the X-group and $\\{3\\}$ as the Y-group: $T = |5 - 3| = 2$. The six permutations and their $T$ values:</p><table class=\"extable\"><thead><tr><th>Permutation</th><th>Value of $T$</th><th>Probability</th></tr></thead><tbody><tr><td class=\"row-h\">(1,9,3)</td><td class=\"num\">2</td><td class=\"num\">1/6</td></tr><tr><td class=\"row-h\">(9,1,3)</td><td class=\"num\">2</td><td class=\"num\">1/6</td></tr><tr><td class=\"row-h\">(1,3,9)</td><td class=\"num\">7</td><td class=\"num\">1/6</td></tr><tr><td class=\"row-h\">(3,1,9)</td><td class=\"num\">7</td><td class=\"num\">1/6</td></tr><tr><td class=\"row-h\">(3,9,1)</td><td class=\"num\">5</td><td class=\"num\">1/6</td></tr><tr><td class=\"row-h\">(9,3,1)</td><td class=\"num\">5</td><td class=\"num\">1/6</td></tr></tbody></table><p>Four of the six permutations give $T \\gt 2$, so the p-value is $\\mathbb{P}(T \\gt 2) = 4/6$.</p>"
      },
      {
        h: "Sampling and a real example",
        body: "<p>Enumerating all $N!$ permutations is usually impractical, so we approximate: (1) compute $t_{obs} = T(X_1,\\ldots,X_m,Y_1,\\ldots,Y_n)$; (2) randomly permute the data and recompute $T$; (3) repeat $B$ times to get $T_1,\\ldots,T_B$; (4) the approximate p-value is $\\frac{1}{B}\\sum_{j=1}^B I(T_j \\gt t_{obs})$. In the DNA microarray example (Efron et al. 2001), gene-expression levels for two liver-cancer types are compared. Testing whether gene 1's median differs, the observed difference of sample medians is $T = |\\hat{\\nu}_1 - \\hat{\\nu}_2| = 710$; the permutation distribution is estimated by simulation and the p-value comes out $.045$, so at $\\alpha = .05$ there is evidence of a difference. In large samples the permutation test usually agrees with large-sample-theory tests, so it is most useful for small samples.</p>"
      }
    ],
    takeaways: [
      "Tests $H_0 : F_X = F_Y$ exactly by reshuffling pooled data under label-exchangeability.",
      "p-value = fraction of permutations whose statistic exceeds the observed value.",
      "Toy example: observed $T=2$ gives p-value $4/6$.",
      "Approximate by sampling $B$ random permutations when $N!$ is too large."
    ]
  });

  B({
    id: "aos-ch10-likelihood-ratio-test",
    chapter: "Chapter 10",
    title: "The likelihood ratio test",
    tagline: "Compare the best likelihood overall with the best likelihood under the null; twice the log-ratio is chi-squared.",
    sections: [
      {
        h: "Definition",
        body: "<p>The Wald test handles a scalar parameter; the likelihood ratio test (LRT) is more general and works for vector-valued parameters. To test $H_0 : \\theta \\in \\Theta_0$ versus $H_1 : \\theta \\notin \\Theta_0$, the <strong>likelihood ratio statistic</strong> is</p><p>$$\\lambda = 2\\log\\!\\left(\\frac{\\sup_{\\theta \\in \\Theta}\\mathcal{L}(\\theta)}{\\sup_{\\theta \\in \\Theta_0}\\mathcal{L}(\\theta)}\\right) = 2\\log\\!\\left(\\frac{\\mathcal{L}(\\hat{\\theta})}{\\mathcal{L}(\\hat{\\theta}_0)}\\right),$$</p><p>where $\\hat{\\theta}$ is the unrestricted MLE and $\\hat{\\theta}_0$ is the MLE when $\\theta$ is restricted to $\\Theta_0$. ($\\mathcal{L}$ is the likelihood &mdash; the probability of the data viewed as a function of the parameter.) Using $\\Theta$ rather than its complement in the numerator changes the statistic little in practice but makes its theory much simpler. The LRT is most useful when $\\Theta_0$ fixes some coordinates of $\\theta$ at particular values.</p>"
      },
      {
        h: "The limiting distribution",
        body: "<p>Suppose $\\theta = (\\theta_1, \\ldots, \\theta_q, \\theta_{q+1}, \\ldots, \\theta_r)$ and $\\Theta_0$ fixes the last $r - q$ coordinates. Under $H_0$, $\\lambda(x^n) \\rightsquigarrow \\chi^2_{r-q}$, where $r - q$ is the dimension of $\\Theta$ minus the dimension of $\\Theta_0$. The p-value is $\\mathbb{P}(\\chi^2_{r-q} \\gt \\lambda)$. For instance, if $\\theta = (\\theta_1,\\ldots,\\theta_5)$ and we test $\\theta_4 = \\theta_5 = 0$, the limiting distribution has $5 - 3 = 2$ degrees of freedom.</p>"
      },
      {
        h: "Worked example — Mendel's peas revisited",
        body: "<p>For Mendel's peas, $H_0 : p = p_0$ versus $H_1 : p \\neq p_0$, the LRT statistic is $\\lambda = 2\\sum_{j=1}^4 X_j \\log(\\hat{p}_j / p_{0j})$ with $\\hat{p}_j = X_j/n$ and $n = 556$. Using $X = (315, 101, 108, 32)$ and $p_0 = (9/16, 3/16, 3/16, 1/16)$:</p><ul class=\"steps\"><li>$\\hat{p}_1/p_{01} = (315/556)/(9/16) = 0.56655/0.5625 = 1.00720$, term $= 315\\log(1.00720) = 315(0.007174) = 2.260$.</li><li>$\\hat{p}_2/p_{02} = (101/556)/(3/16) = 0.18165/0.1875 = 0.96882$, term $= 101\\log(0.96882) = 101(-0.03167) = -3.199$.</li><li>$\\hat{p}_3/p_{03} = (108/556)/(3/16) = 0.19424/0.1875 = 1.03595$, term $= 108\\log(1.03595) = 108(0.035321) = 3.815$.</li><li>$\\hat{p}_4/p_{04} = (32/556)/(1/16) = 0.057554/0.0625 = 0.92086$, term $= 32\\log(0.92086) = 32(-0.082452) = -2.638$.</li><li>$\\lambda = 2(2.260 - 3.199 + 3.815 - 2.638) = 2(0.238) \\approx 0.48$.</li></ul><p>Under $H_1$ there are four parameters constrained to sum to one, so $\\dim\\Theta = 3$; under $H_0$ nothing is free, so $\\dim\\Theta_0 = 0$. Hence $\\lambda \\rightsquigarrow \\chi^2_3$ and the p-value is $\\mathbb{P}(\\chi^2_3 \\gt .48) = .92$. Same conclusion as the $\\chi^2$ test &mdash; the two usually agree when $n$ is large.</p>"
      }
    ],
    takeaways: [
      "$\\lambda = 2\\log(\\mathcal{L}(\\hat{\\theta})/\\mathcal{L}(\\hat{\\theta}_0))$ compares unrestricted to null-restricted likelihood.",
      "Under $H_0$, $\\lambda \\rightsquigarrow \\chi^2_{r-q}$, where $r-q$ is the drop in dimension.",
      "Mendel's peas: $\\lambda = 0.48$, df $=3$, p-value $.92$ — matches the Pearson result.",
      "LRT handles vector parameters where the Wald test cannot."
    ]
  });

  B({
    id: "aos-ch10-multiple-testing",
    chapter: "Chapter 10",
    title: "Multiple testing",
    tagline: "Running many tests inflates false positives; Bonferroni controls any false rejection, Benjamini-Hochberg controls the false discovery rate.",
    sections: [
      {
        h: "The problem",
        body: "<p>When many tests run at once, false positives pile up. In the microarray example there were 2,638 genes; testing each at level $\\alpha$ means each test has chance $\\alpha$ of a false rejection, but the chance of <em>at least one</em> false rejection across all of them is far higher. This is the <strong>multiple testing problem</strong>, common in data mining where thousands or millions of hypotheses are tested. Consider $m$ tests $H_{0i}$ versus $H_{1i}$ with p-values $P_1, \\ldots, P_m$.</p>"
      },
      {
        h: "The Bonferroni method",
        body: "<p>Reject $H_{0i}$ if $P_i \\lt \\alpha/m$. Then the probability of falsely rejecting <em>any</em> true null is at most $\\alpha$. The proof uses the union bound: if $R$ is the event that at least one true null is wrongly rejected and $R_i$ the event for test $i$, then $\\mathbb{P}(R) \\le \\sum_{i=1}^m \\mathbb{P}(R_i) = \\sum_{i=1}^m \\alpha/m = \\alpha$. In the gene example with $\\alpha = .05$ and $m = 2638$, the threshold is $.05/2638 = .00001895375$: only genes with a p-value below that are declared significant. Bonferroni is very conservative because it guards against even a single false rejection.</p>"
      },
      {
        h: "False discovery rate and Benjamini-Hochberg",
        body: "<p>A less strict goal is to control the <strong>false discovery rate</strong> (FDR). With $V$ false rejections out of $R$ total rejections, the false discovery proportion is $\\text{FDP} = V/R$ when $R \\gt 0$ (and $0$ if $R = 0$), and $\\text{FDR} = \\mathbb{E}(\\text{FDP})$. The <strong>Benjamini-Hochberg (BH) method</strong>: order the p-values $P_{(1)} \\lt \\cdots \\lt P_{(m)}$; define $\\ell_i = i\\alpha/(C_m m)$ (with $C_m = 1$ for independent p-values) and $R = \\max\\{i : P_{(i)} \\lt \\ell_i\\}$; set the threshold $T = P_{(R)}$ and reject every $H_{0i}$ with $P_i \\le T$. The BH theorem guarantees $\\text{FDR} \\le \\frac{m_0}{m}\\alpha \\le \\alpha$, where $m_0$ is the number of true nulls.</p>"
      },
      {
        h: "Worked example — ten ordered p-values",
        body: "<p>Ten independent tests give the ordered p-values $.00017, .00448, .00671, .00907, .01220, .33626, .39341, .53882, .58125, .98617$, with $\\alpha = .05$ and $m = 10$.</p><ul class=\"steps\"><li><strong>Uncorrected</strong> (reject $P_i \\lt \\alpha = .05$): the first five p-values are below $.05$, so five rejections.</li><li><strong>Bonferroni</strong> (reject $P_i \\lt \\alpha/m = .005$): only $.00017$ and $.00448$ clear $.005$, so two rejections.</li><li><strong>BH</strong>: find the largest $i$ with $P_{(i)} \\lt i\\alpha/m = .005\\,i$. At $i=5$, $.005 \\cdot 5 = .025$ and $P_{(5)} = .01220 \\lt .025$; at $i=6$, $.005\\cdot 6 = .030$ but $P_{(6)} = .33626 \\gt .030$. So $R = 5$ &mdash; reject the first five hypotheses.</li></ul><p>The chapter's Figure 10.6 plots ordered p-values against the line of slope $\\alpha$: Bonferroni's flat $\\alpha/m$ cutoff is the strictest, the BH threshold $T$ sits at the rightmost point still under the sloping line, and uncorrected testing uses the flat $\\alpha$ line.</p>"
      }
    ],
    takeaways: [
      "Many simultaneous tests inflate the chance of at least one false rejection.",
      "Bonferroni: reject when $P_i \\lt \\alpha/m$; bounds any-false-rejection probability by $\\alpha$.",
      "BH controls the false discovery rate $\\text{FDR} = \\mathbb{E}(V/R) \\le \\alpha$.",
      "Ten-p-value example: uncorrected 5, Bonferroni 2, BH 5 rejections."
    ]
  });

  B({
    id: "aos-ch10-goodness-of-fit",
    chapter: "Chapter 10",
    title: "Goodness-of-fit tests",
    tagline: "Bin the data, compare observed bin counts to model-predicted counts, and test with a chi-squared statistic.",
    sections: [
      {
        h: "Setup",
        body: "<p>A different use of testing: checking whether data come from an assumed parametric model $\\mathfrak{F} = \\{f(x;\\theta) : \\theta \\in \\Theta\\}$. Divide the real line into $k$ disjoint intervals $I_1, \\ldots, I_k$. For each, the model probability of falling in interval $I_j$ is $p_j(\\theta) = \\int_{I_j} f(x;\\theta)\\,dx$, where $\\theta = (\\theta_1, \\ldots, \\theta_s)$ are the model's parameters. Let $N_j$ be the count of observations in $I_j$. The likelihood based on the counts is the multinomial likelihood $Q(\\theta) = \\prod_{j=1}^k p_j(\\theta)^{N_j}$.</p>"
      },
      {
        h: "The test statistic",
        body: "<p>Maximizing $Q(\\theta)$ yields estimates $\\tilde{\\theta} = (\\tilde{\\theta}_1, \\ldots, \\tilde{\\theta}_s)$. Define</p><p>$$Q = \\sum_{j=1}^k \\frac{(N_j - n p_j(\\tilde{\\theta}))^2}{n p_j(\\tilde{\\theta})}.$$</p><p>This is Pearson's form again, but with the expected bin counts estimated from the fitted model. Under $H_0$ (the data are i.i.d. draws from the model), $Q \\rightsquigarrow \\chi^2_{k-1-s}$ &mdash; the degrees of freedom drop by $s$, one for each parameter estimated from the binned data. The approximate p-value is $\\mathbb{P}(\\chi^2_{k-1-s} \\gt q)$ for observed value $q$.</p>"
      },
      {
        h: "A subtlety and a limitation",
        body: "<p>It is tempting to plug the ordinary MLE $\\hat{\\theta}$ (fit from the raw data, not the binned counts) into the formula, but then the limiting distribution is not $\\chi^2_{k-1-s}$. A 1954 theorem of Chernoff and Lehmann shows the resulting p-value is sandwiched between the p-values from a $\\chi^2_{k-1-s}$ and a $\\chi^2_{k-1}$. Wasserman ends with a caution: if the test rejects, conclude the model is wrong; but failing to reject does <em>not</em> prove the model correct &mdash; the test may simply have lacked power. This is why nonparametric methods are preferred over parametric assumptions whenever possible.</p>"
      }
    ],
    takeaways: [
      "Bin the data and compare observed counts $N_j$ to model-predicted counts $n p_j(\\tilde{\\theta})$.",
      "$Q$ is Pearson's statistic with fitted expected counts; under $H_0$, $Q \\rightsquigarrow \\chi^2_{k-1-s}$.",
      "Estimate parameters from the binned counts, not the raw data, to keep the clean $\\chi^2$ limit.",
      "Rejection means the model is wrong; non-rejection does not prove it right."
    ]
  });

  // Charts — only where the chapter has a figure / usable tabulated data.
  window.CODEVIZ["aos-ch10-permutation-test"] = {
    charts: [
      {
        type: "bars",
        title: "Permutation distribution of T for the toy example (1,9,3)",
        interpret: "Each of the 6 equally-likely label orderings gives a value of T. Four exceed the observed t_obs = 2, so the p-value is 4/6.",
        labels: ["(1,9,3)", "(9,1,3)", "(1,3,9)", "(3,1,9)", "(3,9,1)", "(9,3,1)"],
        values: [2, 2, 7, 7, 5, 5],
        colors: ["#4ea1ff", "#4ea1ff", "#7ee787", "#7ee787", "#7ee787", "#7ee787"]
      }
    ]
  };

  window.CODEVIZ["aos-ch10-multiple-testing"] = {
    charts: [
      {
        type: "scatter",
        title: "Ten ordered p-values vs the BH and Bonferroni thresholds",
        xlabel: "rank i",
        ylabel: "p-value",
        groups: [
          { name: "ordered p-values", color: "#4ea1ff", points: [[1, 0.00017], [2, 0.00448], [3, 0.00671], [4, 0.00907], [5, 0.01220], [6, 0.33626], [7, 0.39341], [8, 0.53882], [9, 0.58125], [10, 0.98617]] }
        ],
        lines: [
          { name: "BH line i*alpha/m", color: "#7ee787", points: [[1, 0.005], [10, 0.05]] },
          { name: "Bonferroni alpha/m", color: "#ffb454", points: [[1, 0.005], [10, 0.005]] }
        ]
      }
    ]
  };
})();
