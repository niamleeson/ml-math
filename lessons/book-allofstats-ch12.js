/* All of Statistics (Larry Wasserman) — Chapter 12: Statistical Decision Theory.
   Self-registering book-template lessons, one per key concept. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "All of Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "All of Statistics" }, o));

  // 1 — Loss, risk, and comparing risk functions
  B({
    id: "aos-ch12-loss-risk-comparing",
    chapter: "Chapter 12",
    title: "Loss, Risk, and Comparing Risk Functions",
    tagline: "Score an estimator by the average loss it produces, then notice that comparing two such scores rarely gives a clean winner.",
    sections: [
      { h: "Why we need decision theory", body:
        "<p>By this point the book has built several point estimators: the maximum likelihood estimator, the method of moments estimator, and the posterior mean. There are many more ways to build an estimator, so we need a principled way to pick among them. Wasserman calls that principled way <strong>decision theory</strong>: a formal framework for comparing statistical procedures.</p>" +
        "<p>Some vocabulary. The unknown number we want is the parameter $\\theta$ (theta), and it lives in a set of allowed values called the parameter space $\\Theta$ (capital theta). A rule that turns data into a guess is an estimator $\\hat{\\theta}$ (theta-hat); in decision-theory language an estimator is called a <strong>decision rule</strong>, and the guesses it can output are called <strong>actions</strong>. Because $\\hat{\\theta}$ is computed from the data, it is sometimes written $\\hat{\\theta}(X)$ to stress that it is a function of the observed data $X$.</p>" },
      { h: "Loss: the penalty for being wrong", body:
        "<p>A <strong>loss function</strong> $L(\\theta,\\hat{\\theta})$ measures how far the guess $\\hat{\\theta}$ is from the truth $\\theta$. It takes the true value and the guess and returns a real number penalty. The book lists several standard choices:</p>" +
        "<ul class=\"steps\">" +
        "<li>Squared error loss: $L(\\theta,\\hat{\\theta}) = (\\theta-\\hat{\\theta})^2$ — the squared distance between guess and truth.</li>" +
        "<li>Absolute error loss: $L(\\theta,\\hat{\\theta}) = |\\theta-\\hat{\\theta}|$ — the plain distance.</li>" +
        "<li>$L_p$ loss: $L(\\theta,\\hat{\\theta}) = |\\theta-\\hat{\\theta}|^p$ — distance raised to a power $p$.</li>" +
        "<li>Zero-one loss: $0$ if the guess is exactly right and $1$ if it is wrong.</li>" +
        "<li>Kullback-Leibler loss: $L(\\theta,\\hat{\\theta}) = \\int \\log( f(x;\\theta)/f(x;\\hat\\theta) ) f(x;\\theta)\\,dx$ — a measure built from the two densities.</li>" +
        "</ul>" +
        "<p>Unless a different loss is named, the book assumes squared error loss for the rest of the chapter.</p>" },
      { h: "Risk: the average loss", body:
        "<p>The loss depends on which data happened to come up, so to grade an estimator we average the loss over the data. That average is the <strong>risk</strong> (Definition 12.1):</p>" +
        "<p>$R(\\theta,\\hat{\\theta}) = \\mathbb{E}_\\theta(L(\\theta,\\hat{\\theta})) = \\int L(\\theta,\\hat{\\theta}(x)) f(x;\\theta)\\,dx.$</p>" +
        "<p>When the loss is squared error, the risk is exactly the mean squared error, which splits into variance plus squared bias:</p>" +
        "<p>$R(\\theta,\\hat{\\theta}) = \\mathbb{E}_\\theta(\\hat{\\theta}-\\theta)^2 = \\text{MSE} = \\mathbb{V}_\\theta(\\hat{\\theta}) + \\text{bias}^2_\\theta(\\hat{\\theta}).$</p>" },
      { h: "Comparing risk functions gives no clean winner", body:
        "<p>To compare two estimators we can compare their risk functions, but this usually does not crown a single winner. <strong>Example 12.2.</strong> Let $X \\sim N(\\theta,1)$ (one draw from a normal centered at $\\theta$ with variance $1$) under squared error loss, and consider two estimators: $\\hat{\\theta}_1 = X$ (use the data) and $\\hat{\\theta}_2 = 3$ (always guess $3$, ignoring the data).</p>" +
        "<ul class=\"steps\">" +
        "<li>$\\hat{\\theta}_1 = X$ has risk $R(\\theta,\\hat{\\theta}_1) = \\mathbb{E}_\\theta(X-\\theta)^2 = 1$ for every $\\theta$ — a flat line at height $1$.</li>" +
        "<li>$\\hat{\\theta}_2 = 3$ has risk $R(\\theta,\\hat{\\theta}_2) = \\mathbb{E}_\\theta(3-\\theta)^2 = (3-\\theta)^2$ — a parabola that hits $0$ at $\\theta=3$.</li>" +
        "<li>For $2 \\lt \\theta \\lt 4$ the parabola sits below $1$, so $\\hat{\\theta}_2$ wins. Everywhere else $\\hat{\\theta}_1$ wins.</li>" +
        "</ul>" +
        "<p>Neither estimator dominates the other across all $\\theta$ (Figure 12.1). A second example, the Bernoulli case below, makes the same point. These examples show why we want a one-number summary of a whole risk function.</p>" }
    ],
    takeaways: [
      "An estimator is a decision rule; loss penalizes a single guess; risk is the average loss over the data.",
      "Under squared error loss, risk equals MSE, which is variance plus squared bias.",
      "Comparing two risk functions usually leaves no estimator winning at every $\\theta$.",
      "This motivates summarizing a risk function by one number — the maximum risk or the Bayes risk."
    ]
  });
  window.CODEVIZ["aos-ch12-loss-risk-comparing"] = { charts: [ {
    type: "line",
    title: "Figure 12.1 — two risk functions cross",
    interpret: "The constant estimator beats X only on the narrow window 2 < theta < 4; neither dominates everywhere.",
    xlabel: "theta", ylabel: "risk",
    series: [
      { name: "R(theta, theta1) = 1", color: "#4ea1ff", points: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1]] },
      { name: "R(theta, theta2) = (3-theta)^2", color: "#ffb454", points: [[0,9],[1,4],[2,1],[3,0],[4,1],[5,4]] }
    ]
  } ] };

  // 2 — Bayes estimators and the Bayes risk
  B({
    id: "aos-ch12-bayes-estimators",
    chapter: "Chapter 12",
    title: "Bayes Estimators and Bayes Risk",
    tagline: "Average the risk against a prior, then minimize that average — the answer is the posterior mean under squared error loss.",
    sections: [
      { h: "Two one-number summaries of risk", body:
        "<p>To collapse a whole risk function into one number the book offers two summaries (Definition 12.4). The <strong>maximum risk</strong> is the worst case over all $\\theta$,</p>" +
        "<p>$\\overline{R}(\\hat{\\theta}) = \\sup_\\theta R(\\theta,\\hat{\\theta}),$</p>" +
        "<p>and the <strong>Bayes risk</strong> averages the risk against a prior $f(\\theta)$ — a weighting that says which values of $\\theta$ we think are likely,</p>" +
        "<p>$r(f,\\hat{\\theta}) = \\int R(\\theta,\\hat{\\theta}) f(\\theta)\\,d\\theta.$</p>" +
        "<p>Minimizing the maximum risk leads to minimax estimators; minimizing the Bayes risk leads to Bayes estimators.</p>" },
      { h: "What a Bayes rule is", body:
        "<p>A decision rule that minimizes the Bayes risk is a <strong>Bayes rule</strong> (Definition 12.6): $\\hat{\\theta}$ is a Bayes rule for prior $f$ if $r(f,\\hat{\\theta}) = \\inf_{\\tilde{\\theta}} r(f,\\tilde{\\theta})$, the smallest Bayes risk over all rules $\\tilde{\\theta}$.</p>" +
        "<p>To find it, work with the <strong>posterior</strong>. By Bayes' theorem the posterior density is $f(\\theta|x) = f(x|\\theta)f(\\theta)/m(x)$, where $m(x) = \\int f(x|\\theta)f(\\theta)\\,d\\theta$ is the <strong>marginal distribution</strong> of the data. Define the <strong>posterior risk</strong> of a rule by $r(\\hat{\\theta}|x) = \\int L(\\theta,\\hat{\\theta}(x)) f(\\theta|x)\\,d\\theta$ — the expected loss averaged against the posterior.</p>" },
      { h: "The key identity and how to minimize", body:
        "<p><strong>Theorem 12.7.</strong> The Bayes risk can be rewritten as $r(f,\\hat{\\theta}) = \\int r(\\hat{\\theta}|x) m(x)\\,dx$. The proof unwinds the definitions: write the Bayes risk as a double integral of loss against the joint density $f(x,\\theta)$, swap the joint density for $f(\\theta|x)m(x)$, and regroup.</p>" +
        "<p>Because $m(x)$ is non-negative, the integral is made as small as possible by choosing, for each $x$, the action $\\hat{\\theta}(x)$ that minimizes the posterior risk $r(\\hat{\\theta}|x)$. Minimizing pointwise minimizes the whole integral. That pointwise minimizer is the Bayes estimator.</p>" },
      { h: "The explicit form for common losses", body:
        "<p><strong>Theorem 12.8.</strong> The Bayes estimator depends on the loss:</p>" +
        "<ul class=\"steps\">" +
        "<li>Squared error loss: the Bayes estimator is the posterior mean, $\\hat{\\theta}(x) = \\int \\theta f(\\theta|x)\\,d\\theta = \\mathbb{E}(\\theta|X=x)$.</li>" +
        "<li>Absolute error loss: the Bayes estimator is the median of the posterior.</li>" +
        "<li>Zero-one loss: the Bayes estimator is the mode of the posterior.</li>" +
        "</ul>" +
        "<p>For squared error the proof differentiates the posterior risk $\\int (\\theta-\\hat{\\theta}(x))^2 f(\\theta|x)\\,d\\theta$ with respect to $\\hat{\\theta}(x)$, sets it to zero to get $2\\int(\\theta-\\hat{\\theta}(x))f(\\theta|x)\\,d\\theta = 0$, and solves — yielding the posterior mean.</p>" },
      { h: "Worked example — normal mean", body:
        "<p><strong>Example 12.9.</strong> Let $X_1,\\dots,X_n \\sim N(\\mu,\\sigma^2)$ with $\\sigma^2$ known, and put a $N(a,b^2)$ prior on the mean $\\mu$. Under squared error loss the Bayes estimator is the posterior mean, which is a weighted average of the sample mean $\\overline{X}$ and the prior mean $a$:</p>" +
        "<p>$\\hat{\\theta}(X_1,\\dots,X_n) = \\dfrac{b^2}{b^2+\\frac{\\sigma^2}{n}}\\,\\overline{X} + \\dfrac{\\frac{\\sigma^2}{n}}{b^2+\\frac{\\sigma^2}{n}}\\,a.$</p>" +
        "<p>The two weights add to $1$. As the sample grows the term $\\sigma^2/n$ shrinks, so the weight on $\\overline{X}$ approaches $1$ and the data dominates the prior.</p>" }
    ],
    takeaways: [
      "Bayes risk is the prior-weighted average of the risk function; a Bayes rule minimizes it.",
      "Bayes risk equals the posterior risk averaged over the data, so minimize the posterior risk at each x.",
      "Under squared error loss the Bayes estimator is the posterior mean (median for absolute, mode for zero-one).",
      "For a normal mean with normal prior, the estimator is a weighted blend of the sample mean and the prior mean."
    ]
  });

  // 3 — Minimax rules
  B({
    id: "aos-ch12-minimax-rules",
    chapter: "Chapter 12",
    title: "Minimax Rules",
    tagline: "Protect against the worst case by minimizing the maximum risk — and a Bayes rule with flat risk does exactly that.",
    sections: [
      { h: "The minimax goal", body:
        "<p>A <strong>minimax rule</strong> minimizes the maximum risk (Definition 12.6): $\\hat{\\theta}$ is minimax if $\\sup_\\theta R(\\theta,\\hat{\\theta}) = \\inf_{\\tilde{\\theta}} \\sup_\\theta R(\\theta,\\tilde{\\theta})$. In words, among all rules pick the one whose worst-case risk is smallest. Finding minimax rules in general is hard, so the book gives a few usable results. The headline: a Bayes estimator with constant risk is minimax.</p>" },
      { h: "Bernoulli example — the two summaries disagree", body:
        "<p><strong>Example 12.5</strong> compares two estimators of a Bernoulli success probability $p$ from $X_1,\\dots,X_n$ under squared error loss. The sample mean $\\hat{p}_1 = \\overline{X}$ has risk $R(p,\\hat{p}_1) = p(1-p)/n$, a hump that is largest in the middle. A shrunken estimator $\\hat{p}_2 = (Y+\\sqrt{n/4})/(n+\\sqrt{n})$ (where $Y = \\sum X_i$) has the flat risk $R(p,\\hat{p}_2) = n/(4(n+\\sqrt{n})^2)$.</p>" +
        "<ul class=\"steps\">" +
        "<li>Maximum risk of $\\hat{p}_1$: $\\overline{R}(\\hat{p}_1) = \\max_{0\\le p\\le 1} p(1-p)/n = 1/(4n)$, since $p(1-p)$ peaks at $p=1/2$.</li>" +
        "<li>Maximum risk of $\\hat{p}_2$: $\\overline{R}(\\hat{p}_2) = n/(4(n+\\sqrt{n})^2)$ (its risk is already constant).</li>" +
        "<li>By maximum risk, $\\hat{p}_2$ wins because $\\overline{R}(\\hat{p}_2) \\lt \\overline{R}(\\hat{p}_1)$.</li>" +
        "</ul>" +
        "<p>Yet for large $n$ the data estimator $\\hat{p}_1$ has smaller risk everywhere except a small region near $p=1/2$, so many people prefer it — the maximum-risk summary, while convenient, is imperfect.</p>" },
      { h: "Bayes risk on the same example", body:
        "<p>Taking the flat prior $f(p)=1$, the Bayes risks are $r(f,\\hat{p}_1) = \\int p(1-p)/n\\,dp = 1/(6n)$ and $r(f,\\hat{p}_2) = n/(4(n+\\sqrt{n})^2)$. For $n \\ge 20$ we get $r(f,\\hat{p}_2) \\gt r(f,\\hat{p}_1)$, so the Bayes summary now favors $\\hat{p}_1$ — the opposite ranking. The verdict depends on the chosen prior; the advantage of maximum risk is that it needs no prior at all.</p>" },
      { h: "Least favorable priors", body:
        "<p><strong>Theorem 12.10.</strong> Let $\\hat{\\theta}^f$ be the Bayes rule for some prior $f$, so $r(f,\\hat{\\theta}^f) = \\inf_{\\hat{\\theta}} r(f,\\hat{\\theta})$. If $R(\\theta,\\hat{\\theta}^f) \\le r(f,\\hat{\\theta}^f)$ for all $\\theta$, then $\\hat{\\theta}^f$ is minimax and $f$ is called a <strong>least favorable prior</strong>. The proof is by contradiction: a better rule would have its average (Bayes) risk no larger than its maximum, which would undercut the Bayes risk and contradict the definition of a Bayes rule.</p>" },
      { h: "The constant-risk shortcut", body:
        "<p><strong>Theorem 12.11.</strong> If $\\hat{\\theta}$ is the Bayes rule for some prior and has constant risk $R(\\theta,\\hat{\\theta})=c$, then $\\hat{\\theta}$ is minimax. Reason: the Bayes risk is $r(f,\\hat{\\theta}) = \\int c\\,f(\\theta)\\,d\\theta = c$, so $R(\\theta,\\hat{\\theta}) \\le r(f,\\hat{\\theta})$ holds for all $\\theta$, and Theorem 12.10 applies.</p>" +
        "<p><strong>Example 12.12.</strong> The shrunken Bernoulli estimator $\\hat{p}(X^n) = (\\sum X_i + \\sqrt{n/4})/(n+\\sqrt{n})$ has constant risk and is the posterior mean (hence the Bayes rule) for the $\\text{Beta}(\\alpha,\\beta)$ prior with $\\alpha=\\beta=\\sqrt{n/4}$. So it is minimax.</p>" +
        "<p><strong>Example 12.13.</strong> Under the loss $L(p,\\hat{p}) = (p-\\hat{p})^2/(p(1-p))$, the plain sample mean $\\hat{p} = \\sum X_i / n$ has the constant risk $R(p,\\hat{p}) = 1/n$, and is the Bayes estimator under the flat prior $f(p)=1$, so it is minimax.</p>" },
      { h: "The normal mean", body:
        "<p><strong>Theorem 12.14.</strong> For $X_1,\\dots,X_n \\sim N(\\theta,1)$, the sample mean $\\hat{\\theta} = \\overline{X}$ is minimax for any well-behaved loss, and it is the only estimator with this property. <strong>Example 12.15</strong> shows the restricted case: if $X \\sim N(\\theta,1)$ but $\\theta$ is known to lie in $[-m,m]$ with $0 \\lt m \\lt 1$, the unique minimax estimator under squared error loss is $\\hat{\\theta}(X) = m\\tanh(mX)$, which is the Bayes rule for the prior putting mass $1/2$ at $m$ and $1/2$ at $-m$. Its risk is not constant but stays at or below the Bayes risk for all $\\theta$ (Figure 12.3), so Theorem 12.10 makes it minimax.</p>" }
    ],
    takeaways: [
      "A minimax rule minimizes the worst-case (maximum) risk and needs no prior.",
      "Maximum risk and Bayes risk can rank the same two estimators in opposite orders.",
      "A Bayes rule whose risk is constant is automatically minimax (Theorem 12.11).",
      "For the unrestricted normal mean the sample mean is the unique minimax estimator."
    ]
  });
  window.CODEVIZ["aos-ch12-minimax-rules"] = { charts: [ {
    type: "line",
    title: "Figure 12.2 — Bernoulli risk: hump vs flat line (n = 20)",
    interpret: "The sample mean's risk p(1-p)/n is a hump peaking at p=1/2; the shrunken estimator's risk is the flat dotted line. The flat one has lower maximum but is worse for most p.",
    xlabel: "p", ylabel: "risk",
    series: [
      { name: "R(p, p1) = p(1-p)/n", color: "#4ea1ff", points: [[0,0],[0.1,0.0045],[0.2,0.008],[0.3,0.0105],[0.4,0.012],[0.5,0.0125],[0.6,0.012],[0.7,0.0105],[0.8,0.008],[0.9,0.0045],[1,0]] },
      { name: "R(p, p2) (constant)", color: "#ffb454", points: [[0,0.00691],[0.5,0.00691],[1,0.00691]] }
    ]
  } ] };

  // 4 — MLE, minimax, Bayes connections, and admissibility
  B({
    id: "aos-ch12-mle-minimax-bayes-admissibility",
    chapter: "Chapter 12",
    title: "Connections — MLE, Minimax, Bayes, and Admissibility",
    tagline: "In ordinary low-dimensional models the MLE is nearly minimax and Bayes — but in high dimensions that breaks, and we also need a way to label bad estimators.",
    sections: [
      { h: "The MLE is approximately minimax and Bayes", body:
        "<p>For parametric models meeting weak regularity conditions, the maximum likelihood estimator is approximately minimax. Under squared error loss the risk is squared bias plus variance, and in large samples the variance term dominates the bias, so the risk roughly equals the variance:</p>" +
        "<p>$R(\\theta,\\hat{\\theta}) = \\mathbb{V}_\\theta(\\hat{\\theta}) + \\text{bias}^2 \\approx \\mathbb{V}_\\theta(\\hat{\\theta}).$</p>" +
        "<p>From Chapter 9, the MLE's variance is approximately $1/(nI(\\theta))$ where $I(\\theta)$ is the Fisher information, so $nR(\\theta,\\hat{\\theta}) \\approx 1/I(\\theta)$ (Eq. 12.10). For any competing estimator $\\theta'$ and large $n$, $R(\\theta,\\theta') \\ge R(\\theta,\\hat{\\theta})$ in a local, large-sample sense. The summary: in most parametric models with large samples, the MLE is approximately minimax and Bayes.</p>" },
      { h: "The caveat — high dimensions", body:
        "<p>These results break down when the number of parameters is large. <strong>Example 12.16 (Many Normal means).</strong> Let $Y_i \\sim N(\\theta_i,\\sigma^2/n)$ for $i=1,\\dots,n$, with the constraint $\\sum_{i=1}^n \\theta_i^2 \\le c^2$. Here there are as many parameters as observations. The MLE is $\\hat{\\theta} = Y$, and under the loss $L(\\theta,\\hat{\\theta}) = \\sum_i(\\hat{\\theta}_i-\\theta_i)^2$ its risk is $R(\\theta,\\hat{\\theta}) = \\sigma^2$. But the minimax risk is approximately $\\sigma^2/(\\sigma^2+c^2)$, achievable by another estimator $\\tilde{\\theta}$. Since $\\sigma^2/(\\sigma^2+c^2) \\lt \\sigma^2$, that estimator beats the MLE — sometimes substantially. Maximum likelihood is not optimal in high-dimensional problems.</p>" },
      { h: "Admissibility — labeling bad estimators", body:
        "<p>Minimax and Bayes estimators are good in the sense of having small risk; it also helps to flag bad ones. <strong>Definition 12.17.</strong> An estimator $\\hat{\\theta}$ is <strong>inadmissible</strong> if there is another rule $\\hat{\\theta}'$ with $R(\\theta,\\hat{\\theta}') \\le R(\\theta,\\hat{\\theta})$ for all $\\theta$ and strict inequality $R(\\theta,\\hat{\\theta}') \\lt R(\\theta,\\hat{\\theta})$ for at least one $\\theta$ — i.e. some rule is never worse and sometimes better. Otherwise $\\hat{\\theta}$ is <strong>admissible</strong>.</p>" +
        "<p><strong>Example 12.18.</strong> For $X \\sim N(\\theta,1)$ under squared error loss, the constant estimator $\\hat{\\theta}(X)=3$ is admissible. If a rule $\\hat{\\theta}'$ beat it, then at $\\theta=3$ we would need $R(3,\\hat{\\theta}') \\le R(3,\\hat{\\theta}) = 0$, forcing $\\hat{\\theta}'(x)=3$ everywhere — the same rule. So nothing beats it, even though always guessing $3$ is obviously a bad rule. Admissible does not mean good.</p>" },
      { h: "Bayes rules are admissible", body:
        "<p><strong>Theorem 12.19.</strong> If $\\Theta \\subset \\mathbb{R}$, the risk is continuous in $\\theta$, and the prior $f$ has full support (positive probability around every $\\theta$), then a Bayes rule with finite Bayes risk is admissible. The proof supposes a better rule exists, shows it would shrink the Bayes risk on a small interval where it strictly beats $\\hat{\\theta}^f$, and concludes $\\hat{\\theta}^f$ would not minimize the Bayes risk — contradicting that it is the Bayes rule. <strong>Theorem 12.20:</strong> for $X_1,\\dots,X_n \\sim N(\\mu,\\sigma^2)$ under squared error loss, $\\overline{X}$ is admissible (the posterior mean is admissible for any strictly positive prior, and a very large prior variance makes the posterior mean approach $\\overline{X}$).</p>" },
      { h: "Linking admissibility and minimaxity", body:
        "<p>A rule may be admissible, minimax, both, or neither, but two facts connect them. <strong>Theorem 12.21:</strong> if $\\hat{\\theta}$ has constant risk and is admissible, then it is minimax — because a non-minimax constant-risk rule would be beaten everywhere, making it inadmissible. <strong>Theorem 12.22:</strong> for $X_1,\\dots,X_n \\sim N(\\theta,1)$ under squared error loss, $\\overline{X}$ is minimax — it is admissible (12.20) with constant risk $1/n$, so 12.21 applies. <strong>Theorem 12.23:</strong> if $\\hat{\\theta}$ is minimax it is not strongly inadmissible (no rule beats it by a fixed margin $\\epsilon$ at every $\\theta$), so minimax rules are at least close to admissible.</p>" }
    ],
    takeaways: [
      "In low-dimensional parametric models with large samples, the MLE is approximately minimax and Bayes.",
      "In high dimensions (many normal means) the MLE is beaten — its risk sigma^2 exceeds the minimax sigma^2/(sigma^2+c^2).",
      "A rule is inadmissible if another rule is never worse and sometimes strictly better; admissible rules can still be bad.",
      "Bayes rules (under mild conditions) are admissible, and a constant-risk admissible rule is minimax."
    ]
  });

  // 5 — Stein's paradox
  B({
    id: "aos-ch12-steins-paradox",
    chapter: "Chapter 12",
    title: "Stein's Paradox",
    tagline: "Estimating three or more unrelated normal means at once, shrinking every estimate toward zero beats using each observation on its own.",
    sections: [
      { h: "One or two means — nothing strange", body:
        "<p>Start with $X \\sim N(\\theta,1)$ and squared error loss. From the admissibility section we know $\\hat{\\theta}(X) = X$ — just use the data — is admissible. Now estimate two unrelated quantities $\\theta = (\\theta_1,\\theta_2)$ with $X_1 \\sim N(\\theta_1,1)$ and $X_2 \\sim N(\\theta_2,1)$ independently, under the summed loss $L(\\theta,\\hat{\\theta}) = \\sum_{j=1}^2 (\\theta_j - \\hat{\\theta}_j)^2$. As expected, $\\hat{\\theta}(X) = X = (X_1,X_2)$ is still admissible. So far there is no surprise.</p>" },
      { h: "Three or more means — the shock", body:
        "<p>Generalize to $k$ means: $\\theta = (\\theta_1,\\dots,\\theta_k)$, $X = (X_1,\\dots,X_k)$ with $X_i \\sim N(\\theta_i,1)$ independent, loss $L(\\theta,\\hat{\\theta}) = \\sum_{j=1}^k (\\theta_j-\\hat{\\theta}_j)^2$. Stein astounded everyone by proving that once $k \\ge 3$, the natural estimator $\\hat{\\theta}(X) = X$ is <em>inadmissible</em>. There exists a rule that is never worse and sometimes strictly better, even though the $k$ problems are completely unrelated.</p>" },
      { h: "The James-Stein estimator", body:
        "<p>The rule that beats $X$ is the <strong>James-Stein estimator</strong> $\\hat{\\theta}^S = (\\hat{\\theta}^S_1,\\dots,\\hat{\\theta}^S_k)$ with</p>" +
        "<p>$\\hat{\\theta}^S_i(X) = \\left(1 - \\dfrac{k-2}{\\sum_i X_i^2}\\right)^{+} X_i,$</p>" +
        "<p>where $(z)^{+} = \\max\\{z,0\\}$ keeps the multiplier from going negative. The factor in parentheses is between $0$ and $1$, so each coordinate is pulled toward $0$ — the estimator <em>shrinks</em> the observations toward the origin. The factor $k-2$ is why the effect only appears once $k \\ge 3$.</p>" +
        "<ul class=\"steps\">" +
        "<li>If $\\sum_i X_i^2$ is large, the shrinkage factor $1 - (k-2)/\\sum_i X_i^2$ is near $1$, so the estimate stays close to $X_i$.</li>" +
        "<li>If $\\sum_i X_i^2$ is small, the factor shrinks the estimates hard toward $0$.</li>" +
        "<li>The $(\\cdot)^{+}$ truncation prevents the multiplier from flipping the sign when $\\sum_i X_i^2 \\lt k-2$.</li>" +
        "</ul>" },
      { h: "The lesson", body:
        "<p>The message is that when estimating many parameters at once, there is real value in shrinking the estimates. Pooling information across unrelated problems lowers the total risk. Wasserman notes this observation plays an important role in modern nonparametric function estimation.</p>" }
    ],
    takeaways: [
      "For one or two normal means, using the raw observation X is admissible — no paradox.",
      "Once k >= 3, the estimator theta-hat = X is inadmissible (Stein's result).",
      "The James-Stein estimator shrinks every coordinate toward zero by the factor 1 - (k-2)/sum(X_i^2), truncated at 0.",
      "Shrinkage lowers total risk when estimating many parameters and underlies modern nonparametric estimation."
    ]
  });
})();
