/* All of Statistics (Larry Wasserman) — Chapter 15: Inference About Independence.
   Self-registering book-template lessons, one per key concept. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "All of Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "All of Statistics" }, o));

  // 1 — Two binary variables: the odds ratio, the log-odds ratio, and testing independence
  B({
    id: "aos-ch15-two-binary",
    chapter: "Chapter 15",
    title: "Two Binary Variables and the Odds Ratio",
    tagline: "For a 2x2 table, the odds ratio measures the strength of dependence and equals 1 exactly when the two variables are independent.",
    sections: [
      { h: "The 2x2 table", body:
        "<p>The chapter opens by asking two questions: how do we test whether two random variables are independent, and how do we measure how strongly they depend on each other? Here both variables are <strong>binary</strong> (each takes only the values $0$ or $1$). We write $Y \\amalg Z$ to mean $Y$ and $Z$ are independent, and call them <strong>dependent</strong> (or associated) otherwise.</p>" +
        "<p>The data on $n$ pairs $(Y_1,Z_1),\\dots,(Y_n,Z_n)$ are laid out in a two-by-two table of counts. Here $X_{ij}$ is the number of observations with $Y=i$ and $Z=j$, a dotted subscript means a sum over that index (so $X_{i\\cdot} = \\sum_j X_{ij}$ is a row total and $X_{\\cdot j} = \\sum_i X_{ij}$ is a column total), and $n = X_{\\cdot\\cdot}$ is the grand total. The matching cell probabilities are $p_{ij} = \\mathbb{P}(Z=i, Y=j)$, and the count vector $X = (X_{00},X_{01},X_{10},X_{11})$ is Multinomial$(n,p)$.</p>" },
      { h: "Odds ratio and log-odds ratio", body:
        "<p>Two new parameters summarize the dependence. <strong>Definition 15.1.</strong> The <strong>odds ratio</strong> is</p>" +
        "<p>$\\psi = \\dfrac{p_{00}\\,p_{11}}{p_{01}\\,p_{10}},$</p>" +
        "<p>and the <strong>log-odds ratio</strong> is $\\gamma = \\log(\\psi)$. The symbol $\\psi$ (psi) is the odds ratio and $\\gamma$ (gamma) is its natural logarithm.</p>" +
        "<p><strong>Theorem 15.2</strong> ties these directly to independence: the following four statements are all equivalent — (1) $Y \\amalg Z$; (2) $\\psi = 1$; (3) $\\gamma = 0$; and (4) $p_{ij} = p_{i\\cdot}\\,p_{\\cdot j}$ for every cell. So independence is exactly the case $\\psi = 1$ (equivalently $\\gamma = 0$). The further $\\psi$ is from $1$, the stronger the association.</p>" },
      { h: "Testing independence", body:
        "<p>To test $H_0: Y \\amalg Z$ against $H_1: Y$ is dependent on $Z$, the chapter gives the <strong>likelihood ratio test</strong>. Under $H_1$ the data are Multinomial$(n,p)$ with unrestricted MLE $\\hat{p} = X/n$; under $H_0$ the MLE is computed under the constraint $p_{ij} = p_{i\\cdot}\\,p_{\\cdot j}$.</p>" +
        "<p><strong>Theorem 15.3.</strong> The likelihood ratio statistic is</p>" +
        "<p>$T = 2\\sum_{i=0}^{1}\\sum_{j=0}^{1} X_{ij}\\,\\log\\!\\left(\\dfrac{X_{ij}\\,X_{\\cdot\\cdot}}{X_{i\\cdot}\\,X_{\\cdot j}}\\right).$</p>" +
        "<p>Under $H_0$, $T$ converges to a $\\chi^2_1$ distribution (chi-square with $1$ degree of freedom), so an approximate level-$\\alpha$ test rejects $H_0$ when $T \\gt \\chi^2_{1,\\alpha}$.</p>" },
      { h: "Estimating the strength of dependence", body:
        "<p>Beyond testing, we estimate $\\psi$ and $\\gamma$. <strong>Theorem 15.6.</strong> The MLEs are</p>" +
        "<p>$\\hat{\\psi} = \\dfrac{X_{00}\\,X_{11}}{X_{01}\\,X_{10}}, \\qquad \\hat{\\gamma} = \\log\\hat{\\psi}.$</p>" +
        "<p>The asymptotic standard error of $\\hat{\\gamma}$, found with the delta method, is</p>" +
        "<p>$\\widehat{\\text{se}}(\\hat{\\gamma}) = \\sqrt{\\dfrac{1}{X_{00}} + \\dfrac{1}{X_{01}} + \\dfrac{1}{X_{10}} + \\dfrac{1}{X_{11}}}.$</p>" +
        "<p><strong>Remark 15.7</strong> notes that for small samples $\\hat{\\psi}$ and $\\hat{\\gamma}$ can have very large variance, in which case the book suggests the modified estimator that adds $\\tfrac12$ to each count: $\\hat{\\psi} = \\dfrac{(X_{00}+\\frac12)(X_{11}+\\frac12)}{(X_{01}+\\frac12)(X_{10}+\\frac12)}$. A Wald test for $\\gamma = 0$ uses $W = \\hat{\\gamma}/\\widehat{\\text{se}}(\\hat{\\gamma})$, and a confidence interval for $\\psi$ is most accurately obtained by exponentiating the interval for $\\gamma$: $\\exp\\{\\hat{\\gamma} \\pm z_{\\alpha/2}\\,\\widehat{\\text{se}}(\\hat{\\gamma})\\}$.</p>" }
    ],
    takeaways: [
      "Binary data go in a 2x2 count table; the odds ratio psi = (p00 p11)/(p01 p10) measures dependence.",
      "Independence is exactly psi = 1, equivalently gamma = log(psi) = 0 (Theorem 15.2).",
      "The likelihood ratio statistic T (Theorem 15.3) is approximately chi-square with 1 df under H0.",
      "The MLE psi-hat = (X00 X11)/(X01 X10); the se of gamma-hat is sqrt of the sum of 1/cell over all four cells."
    ]
  });

  // 2 — Worked 2x2 example: tonsillectomy and Hodgkins disease
  B({
    id: "aos-ch15-tonsillectomy-example",
    chapter: "Chapter 15",
    title: "Tonsillectomy and Hodgkins Disease",
    tagline: "A worked 2x2 example: the tests reject independence and the odds ratio says tonsillectomy patients are about twice as likely to have Hodgkins disease.",
    sections: [
      { h: "The data", body:
        "<p><strong>Example 15.5</strong> uses data from Johnson and Johnson (1972) relating tonsillectomy and Hodgkins disease (the book notes the data are actually from a case-control study).</p>" +
        "<table class=\"extable\"><thead><tr><th></th><th>Hodgkins Disease</th><th>No Disease</th><th>Total</th></tr></thead><tbody>" +
        "<tr><td class=\"row-h\">Tonsillectomy</td><td class=\"num\">90</td><td class=\"num\">165</td><td class=\"num\">255</td></tr>" +
        "<tr><td class=\"row-h\">No Tonsillectomy</td><td class=\"num\">84</td><td class=\"num\">307</td><td class=\"num\">391</td></tr>" +
        "<tr><td class=\"row-h\">Total</td><td class=\"num\">174</td><td class=\"num\">472</td><td class=\"num\">646</td></tr>" +
        "</tbody></table>" +
        "<p>The question is whether tonsillectomy is related to Hodgkins disease.</p>" },
      { h: "Both tests reject independence", body:
        "<p>Two tests are run on the same table:</p>" +
        "<ul class=\"steps\">" +
        "<li>The likelihood ratio statistic is $T = 14.75$ with p-value $\\mathbb{P}(\\chi^2_1 \\gt 14.75) = .0001$.</li>" +
        "<li>Pearson's $\\chi^2$ statistic is $U = 14.96$ with p-value $\\mathbb{P}(\\chi^2_1 \\gt 14.96) = .0001$.</li>" +
        "<li>Both p-values are tiny, so we reject the null hypothesis of independence and conclude tonsillectomy is associated with Hodgkins disease.</li>" +
        "</ul>" +
        "<p>Wasserman stresses that association is <em>not</em> causation: if doctors gave tonsillectomies to the sickest patients, the link could arise because those patients were already more likely to develop a serious disease.</p>" },
      { h: "Estimating the odds ratio", body:
        "<p><strong>Example 15.8</strong> measures the strength of dependence. Using the MLE $\\hat{\\psi} = (X_{00}X_{11})/(X_{01}X_{10})$ with the table's counts:</p>" +
        "<ul class=\"steps\">" +
        "<li>$\\hat{\\psi} = \\dfrac{90 \\times 307}{165 \\times 84} = \\dfrac{27630}{13860} = 1.99.$</li>" +
        "<li>$\\hat{\\gamma} = \\log(1.99) = .69.$</li>" +
        "<li>Standard error: $\\widehat{\\text{se}}(\\hat{\\gamma}) = \\sqrt{\\tfrac{1}{90} + \\tfrac{1}{84} + \\tfrac{1}{165} + \\tfrac{1}{307}} = .18.$</li>" +
        "</ul>" +
        "<p>An odds ratio near $2$ means tonsillectomy patients were about twice as likely to have Hodgkins disease.</p>" },
      { h: "Wald test and confidence intervals", body:
        "<p>From these numbers the book completes the inference:</p>" +
        "<ul class=\"steps\">" +
        "<li>Wald statistic: $W = .69/.18 = 3.84$, with p-value $\\mathbb{P}(|Z| \\gt 3.84) = .0001$ — the same conclusion as the other two tests.</li>" +
        "<li>A 95% confidence interval for $\\gamma$: $\\hat{\\gamma} \\pm 2(.18) = .69 \\pm .36 = (.33, 1.05).$</li>" +
        "<li>A 95% confidence interval for $\\psi$, by exponentiating: $(e^{.33}, e^{1.05}) = (1.39, 2.86).$</li>" +
        "</ul>" +
        "<p>The interval for $\\psi$ lies entirely above $1$, confirming a real positive association.</p>" }
    ],
    takeaways: [
      "On the 646-patient table, T = 14.75 and U = 14.96, both with p-value about .0001 — reject independence.",
      "The odds ratio estimate is psi-hat = (90 x 307)/(165 x 84) = 1.99, so gamma-hat = log(1.99) = .69.",
      "The Wald statistic W = .69/.18 = 3.84 agrees with the other tests.",
      "95% CIs: gamma in (.33, 1.05) and psi in (1.39, 2.86), both excluding the no-association values 0 and 1."
    ]
  });
  window.CODEVIZ["aos-ch15-tonsillectomy-example"] = { charts: [ {
    type: "bars",
    title: "Tonsillectomy vs Hodgkins disease — observed counts",
    interpret: "Among tonsillectomy patients the disease/no-disease split is close (90 vs 165), while among non-tonsillectomy patients disease is much rarer (84 vs 307) — the imbalance the odds ratio of 1.99 captures.",
    labels: ["Tons.: Disease", "Tons.: No Disease", "No Tons.: Disease", "No Tons.: No Disease"],
    values: [90, 165, 84, 307],
    colors: ["#ff7b72", "#4ea1ff", "#ff7b72", "#4ea1ff"]
  } ] };

  // 3 — Two discrete variables: chi-square test of independence on an I x J table
  B({
    id: "aos-ch15-two-discrete",
    chapter: "Chapter 15",
    title: "Two Discrete Variables and the Chi-Square Test",
    tagline: "For an I-by-J table, the same likelihood ratio and Pearson statistics test independence, now with (I-1)(J-1) degrees of freedom.",
    sections: [
      { h: "From 2x2 to I x J", body:
        "<p>Now both variables are discrete but can take more than two values: $Y \\in \\{1,\\dots,I\\}$ and $Z \\in \\{1,\\dots,J\\}$. The data form an $I \\times J$ table of counts, where $X_{ij}$ is the number of observations with $Z=i$ and $Y=j$. The dotted-subscript convention for row totals $X_{i\\cdot}$, column totals $X_{\\cdot j}$, and grand total $n$ carries over. We again test $H_0: Y \\amalg Z$ against $H_1: Y$ dependent on $Z$.</p>" },
      { h: "The two test statistics", body:
        "<p><strong>Theorem 15.9.</strong> The likelihood ratio test statistic generalizes directly:</p>" +
        "<p>$T = 2\\sum_{i=1}^{I}\\sum_{j=1}^{J} X_{ij}\\,\\log\\!\\left(\\dfrac{X_{ij}\\,X_{\\cdot\\cdot}}{X_{i\\cdot}\\,X_{\\cdot j}}\\right),$</p>" +
        "<p>and Pearson's $\\chi^2$ statistic is</p>" +
        "<p>$U = \\sum_{i=1}^{I}\\sum_{j=1}^{J} \\dfrac{(X_{ij}-E_{ij})^2}{E_{ij}}, \\qquad E_{ij} = \\dfrac{X_{i\\cdot}\\,X_{\\cdot j}}{n}.$</p>" +
        "<p>Here $E_{ij}$ is the <strong>expected count</strong> in cell $(i,j)$ under independence: it is $n$ times the estimated cell probability $\\hat{p}_{ij} = \\hat{p}_{i\\cdot}\\,\\hat{p}_{\\cdot j}$, which is just the product of the row and column relative frequencies. $U$ compares the observed counts with these expected counts.</p>" +
        "<p>Asymptotically, both $T$ and $U$ have a $\\chi^2_\\nu$ distribution under $H_0$, where the degrees of freedom are $\\nu = (I-1)(J-1)$.</p>" },
      { h: "Worked example — response to treatment by histological type", body:
        "<p><strong>Example 15.10</strong> uses data from Dunsmore et al. (1987): Hodgkins-disease patients classified by their response to treatment (positive, partial, none) and by histological type (LP, NS, MC, LD).</p>" +
        "<table class=\"extable\"><thead><tr><th>Type</th><th>Positive</th><th>Partial</th><th>None</th><th>Total</th></tr></thead><tbody>" +
        "<tr><td class=\"row-h\">LP</td><td class=\"num\">74</td><td class=\"num\">18</td><td class=\"num\">12</td><td class=\"num\">104</td></tr>" +
        "<tr><td class=\"row-h\">NS</td><td class=\"num\">68</td><td class=\"num\">16</td><td class=\"num\">12</td><td class=\"num\">96</td></tr>" +
        "<tr><td class=\"row-h\">MC</td><td class=\"num\">154</td><td class=\"num\">54</td><td class=\"num\">58</td><td class=\"num\">266</td></tr>" +
        "<tr><td class=\"row-h\">LD</td><td class=\"num\">18</td><td class=\"num\">10</td><td class=\"num\">44</td><td class=\"num\">72</td></tr>" +
        "</tbody></table>" +
        "<p>This is a $4 \\times 3$ table, so $\\nu = (4-1)(3-1) = 6$ degrees of freedom.</p>" },
      { h: "The result", body:
        "<ul class=\"steps\">" +
        "<li>Pearson's statistic is $U = 75.89$ on $6$ degrees of freedom, with p-value $\\mathbb{P}(\\chi^2_6 \\gt 75.89) \\approx 0$.</li>" +
        "<li>The likelihood ratio statistic is $T = 68.30$ on $6$ degrees of freedom, with p-value $\\mathbb{P}(\\chi^2_6 \\gt 68.30) \\approx 0$.</li>" +
        "<li>Both p-values are essentially zero, so there is strong evidence that response to treatment and histological type are associated.</li>" +
        "</ul>" +
        "<p>The row totals across types are LP $104$, NS $96$, MC $266$, LD $72$ — the LD group stands out because most of its patients had no response ($44$ of $72$), unlike the other types where positive responses dominate.</p>" }
    ],
    takeaways: [
      "Discrete variables with I and J levels give an I x J count table; test H0: Y independent of Z.",
      "The likelihood ratio T and Pearson U (with expected counts E_ij = X_i. X_.j / n) both apply.",
      "Under H0 both are chi-square with nu = (I-1)(J-1) degrees of freedom.",
      "On the 4x3 Hodgkins table, U = 75.89 and T = 68.30 on 6 df, p-values about 0 — strong association."
    ]
  });
  window.CODEVIZ["aos-ch15-two-discrete"] = { charts: [ {
    type: "bars",
    title: "Treatment response by histological type — 'no response' counts",
    interpret: "The LD type has 44 no-responses out of 72 patients, far more than LP (12), NS (12), or MC (58 of 266) — the pattern driving the large chi-square of 75.89.",
    labels: ["LP", "NS", "MC", "LD"],
    values: [12, 12, 58, 44],
    colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#ff7b72"]
  } ] };

  // 4 — Continuous variables and the mixed continuous/discrete case
  B({
    id: "aos-ch15-continuous-and-mixed",
    chapter: "Chapter 15",
    title: "Continuous and Mixed Variables",
    tagline: "For two continuous variables use the correlation; for one discrete and one continuous variable, test independence by comparing conditional CDFs with a Kolmogorov-Smirnov test.",
    sections: [
      { h: "Two continuous variables", body:
        "<p>When $Y$ and $Z$ are both continuous and we assume their joint distribution is bivariate Normal, dependence is measured by the <strong>correlation coefficient</strong> $\\rho$ (rho). Tests, estimates, and confidence intervals for $\\rho$ under the Normal assumption were given earlier (Section 14.2); if we drop Normality, those same methods can still be used to draw inferences about $\\rho$.</p>" +
        "<p>One caution: correlation and independence are not the same. If we conclude that $\\rho = 0$ we may only conclude that $Y$ and $Z$ are <strong>uncorrelated</strong>, not that they are independent. The reverse direction <em>is</em> valid, though: if we conclude $Y$ and $Z$ are correlated ($\\rho \\neq 0$), then we may conclude they are dependent.</p>" },
      { h: "One continuous and one discrete variable", body:
        "<p>Now suppose $Y \\in \\{1,\\dots,I\\}$ is discrete and $Z$ is continuous. Let $F_i(z) = \\mathbb{P}(Z \\le z \\mid Y = i)$ be the conditional CDF (cumulative distribution function) of $Z$ given $Y = i$ — that is, the distribution of $Z$ within group $i$.</p>" +
        "<p><strong>Theorem 15.11.</strong> $Y \\amalg Z$ if and only if $F_1 = \\dots = F_I$. In words, $Y$ and $Z$ are independent exactly when $Z$ has the same conditional distribution in every group of $Y$. So testing independence becomes testing $H_0: F_1 = \\dots = F_I$ against the alternative that the conditional distributions are not all equal.</p>" },
      { h: "The two-sample Kolmogorov-Smirnov test", body:
        "<p>For simplicity the book takes $I = 2$ groups. Let $n_1$ be the number of observations with $Y = 1$ and $n_2$ the number with $Y = 2$. The <strong>empirical CDFs</strong> of $Z$ in each group are</p>" +
        "<p>$\\hat{F}_1(z) = \\dfrac{1}{n_1}\\sum_{i=1}^{n} I(Z_i \\le z)\\,I(Y_i = 1), \\quad \\hat{F}_2(z) = \\dfrac{1}{n_2}\\sum_{i=1}^{n} I(Z_i \\le z)\\,I(Y_i = 2),$</p>" +
        "<p>where $I(\\cdot)$ is the indicator (it is $1$ when the condition holds and $0$ otherwise). The <strong>two-sample Kolmogorov-Smirnov</strong> test statistic is the largest gap between the two empirical CDFs,</p>" +
        "<p>$D = \\sup_x |\\hat{F}_1(x) - \\hat{F}_2(x)|.$</p>" },
      { h: "The null distribution and the test", body:
        "<p><strong>Theorem 15.12</strong> gives the limiting distribution. Define</p>" +
        "<p>$H(t) = 1 - 2\\sum_{j=1}^{\\infty} (-1)^{j-1} e^{-2 j^2 t^2}.$</p>" +
        "<p>Under $H_0: F_1 = F_2$, the rescaled statistic converges: $\\lim_{n\\to\\infty} \\mathbb{P}\\!\\left(\\sqrt{\\tfrac{n_1 n_2}{n_1 + n_2}}\\,D \\le t\\right) = H(t)$. An approximate level-$\\alpha$ test therefore rejects $H_0$ when</p>" +
        "<p>$\\sqrt{\\dfrac{n_1 n_2}{n_1 + n_2}}\\,D \\gt H^{-1}(1-\\alpha).$</p>" +
        "<p>Rejecting means the conditional distributions of $Z$ differ between the two groups of $Y$, i.e. $Y$ and $Z$ are dependent.</p>" }
    ],
    takeaways: [
      "Two continuous variables: measure dependence with the correlation rho (Section 14.2 methods).",
      "rho = 0 only shows uncorrelated, not independent; but rho != 0 does imply dependence.",
      "Mixed case: by Theorem 15.11, Y independent of Z iff the conditional CDFs F_1,...,F_I are all equal.",
      "Test F_1 = F_2 with the two-sample KS statistic D = sup|F1-F2|; reject when sqrt(n1 n2/(n1+n2)) D is large."
    ]
  });
})();
