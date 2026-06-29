/* All of Statistics (Larry Wasserman) — Chapter 24: Simulation Methods.
   Self-registering book-template lessons, one per key concept. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "All of Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "All of Statistics" }, o));

  // 1 — Basic Monte Carlo integration (and Bayesian inference by simulation)
  B({
    id: "aos-ch24-basic-monte-carlo",
    chapter: "Chapter 24",
    title: "Basic Monte Carlo Integration",
    tagline: "Turn a hard integral into an average over random draws, and the law of large numbers does the rest.",
    sections: [
      { h: "Why simulate an integral", body:
        "<p>This chapter shows how random sampling can approximate integrals. The leading motivation is Bayesian inference: given a prior $f(\\theta)$ and data $X^n = (X_1,\\dots,X_n)$, the posterior density is $f(\\theta|X^n) = \\mathcal{L}(\\theta)f(\\theta)/c$, where $\\mathcal{L}(\\theta)$ is the likelihood and the normalizing constant is $c = \\int \\mathcal{L}(\\theta)f(\\theta)\\,d\\theta$. The posterior mean $\\overline{\\theta} = \\int \\theta f(\\theta|X^n)\\,d\\theta$ and (when $\\theta$ is multidimensional) marginal posteriors all require integrals. When $\\theta$ is high-dimensional these integrals may be impossible to do by hand, so we approximate them by simulation.</p>" +
        "<p>Here $\\theta$ (theta) is the unknown parameter; $f(\\theta)$ is the prior, our beliefs before seeing data; $\\mathcal{L}(\\theta)$ is the likelihood, how probable the data is for each $\\theta$; and the posterior $f(\\theta|X^n)$ is our updated belief after seeing data.</p>" },
      { h: "Rewriting the integral as an expectation", body:
        "<p>Suppose we want $I = \\int_a^b h(x)\\,dx$ for some function $h$. If $h$ is simple (a polynomial, say) we could integrate in closed form; if it is complicated there may be no closed form. Monte Carlo integration is a general, simple, scalable alternative. The trick is to rewrite the integral so it looks like an average. Write</p>" +
        "<p>$I = \\int_a^b h(x)\\,dx = \\int_a^b w(x) f(x)\\,dx$ where $w(x) = h(x)(b-a)$ and $f(x) = 1/(b-a)$.</p>" +
        "<p>Now $f$ is the probability density of a uniform random variable on $(a,b)$, so the integral is just the expected value $I = \\mathbb{E}_f(w(X))$ with $X \\sim \\text{Unif}(a,b)$. An expectation is something we can estimate by averaging.</p>" },
      { h: "The estimator and its standard error", body:
        "<p>Draw $X_1,\\dots,X_N \\sim \\text{Unif}(a,b)$. By the law of large numbers the sample average converges to the true integral:</p>" +
        "<p>$\\widehat{I} = \\frac{1}{N}\\sum_{i=1}^N w(X_i) \\;\\xrightarrow{\\text{P}}\\; \\mathbb{E}(w(X)) = I.$</p>" +
        "<p>This is the basic Monte Carlo integration method. Its standard error is $\\widehat{\\text{se}} = s/\\sqrt{N}$, where $s^2 = \\sum_{i=1}^N (Y_i - \\widehat{I})^2/(N-1)$ and $Y_i = w(X_i)$. A $1-\\alpha$ confidence interval is $\\widehat{I} \\pm z_{\\alpha/2}\\,\\widehat{\\text{se}}$. Because we can make $N$ as large as we like, we can shrink the interval as much as we want.</p>" +
        "<p>The method generalizes: for $I = \\int h(x) f(x)\\,dx$ with $f$ any density we know how to sample from, draw $X_1,\\dots,X_N \\sim f$ and take $\\widehat{I} = \\frac{1}{N}\\sum_i h(X_i)$.</p>" },
      { h: "Worked examples — the book's numbers", body:
        "<p><strong>Example 24.1.</strong> Let $h(x) = x^3$, so $I = \\int_0^1 x^3\\,dx = 1/4$. With $N = 10{,}000$ draws from $\\text{Unif}(0,1)$ the book reports $\\widehat{I} = .248$ with standard error $.0028$ — close to the exact $.25$.</p>" +
        "<p><strong>Example 24.2.</strong> To get the standard Normal CDF $\\Phi(x) = \\int_{-\\infty}^x f(s)\\,ds$ by simulation, write it as $\\int h(s) f(s)\\,ds$ with $h(s) = 1$ for $s \\lt x$ and $h(s) = 0$ for $s \\ge x$. Drawing $X_1,\\dots,X_N \\sim N(0,1)$, the estimate $\\widehat{I} = \\frac{1}{N}\\sum_i h(X_i)$ is just the fraction of draws below $x$.</p>" +
        "<table class=\"extable\"><thead><tr><th>x</th><th>true $\\Phi(x)$</th><th>N</th><th>estimate</th></tr></thead>" +
        "<tbody>" +
        "<tr><td class=\"row-h\">2</td><td class=\"num\">.9772</td><td class=\"num\">10,000</td><td class=\"num\">.9751</td></tr>" +
        "<tr><td class=\"row-h\">2</td><td class=\"num\">.9772</td><td class=\"num\">100,000</td><td class=\"num\">.9771</td></tr>" +
        "</tbody></table>" +
        "<p>The larger sample gets closer to the truth, as expected.</p>" },
      { h: "Bayesian inference by simulation — two binomials", body:
        "<p><strong>Example 24.3 (Two Binomials).</strong> Let $X \\sim \\text{Binomial}(n,p_1)$ and $Y \\sim \\text{Binomial}(m,p_2)$, and suppose we want $\\delta = p_2 - p_1$. With a flat prior $f(p_1,p_2)=1$, the posterior factors into two independent pieces: $p_1|X \\sim \\text{Beta}(X+1, n-X+1)$ and $p_2|Y \\sim \\text{Beta}(Y+1, m-Y+1)$. So instead of doing the awkward double integral for the posterior mean and the posterior CDF of $\\delta$, we simulate.</p>" +
        "<ul class=\"steps\">" +
        "<li>For $i = 1,\\dots,N$ draw $P_1^{(i)} \\sim \\text{Beta}(X+1, n-X+1)$ and $P_2^{(i)} \\sim \\text{Beta}(Y+1, m-Y+1)$.</li>" +
        "<li>Set $\\delta^{(i)} = P_2^{(i)} - P_1^{(i)}$.</li>" +
        "<li>Estimate the posterior mean by $\\overline{\\delta} \\approx \\frac{1}{N}\\sum_i \\delta^{(i)}$.</li>" +
        "<li>Get a 95% posterior interval by sorting the $\\delta^{(i)}$ and reading off the $.025$ and $.975$ quantiles; estimate the posterior density by a histogram of the $\\delta^{(i)}$.</li>" +
        "</ul>" +
        "<p>For $n = m = 10$, $X = 8$, $Y = 6$, a posterior sample of size $1000$ gives a 95% interval of $(-.52, .20)$ (Figure 24.1).</p>" },
      { h: "Bayesian inference by simulation — dose response", body:
        "<p><strong>Example 24.4 (Dose Response).</strong> Rats get one of ten doses $x_1 \\lt \\dots \\lt x_{10}$; at dose $x_i$, $Y_i \\sim \\text{Binomial}(n,p_i)$ of them survive, and biology forces $p_1 \\le p_2 \\le \\dots \\le p_{10}$. We want the LD50 — the dose giving a 50% death chance, $\\delta = x_j$ with $j = \\min\\{i : p_i \\ge .50\\}$. The posterior mean is a 10-dimensional integral over a restricted region, so we simulate with a truncated flat prior:</p>" +
        "<ul class=\"steps\">" +
        "<li>Draw $P_i \\sim \\text{Beta}(Y_i+1, n-Y_i+1)$ for $i = 1,\\dots,10$.</li>" +
        "<li>If $P_1 \\le P_2 \\le \\dots \\le P_{10}$ keep the draw; otherwise discard it and draw again.</li>" +
        "<li>Set $\\delta = x_j$ with $j = \\min\\{i : P_i \\gt .50\\}$.</li>" +
        "<li>Repeat $N$ times; the posterior mean is $\\frac{1}{N}\\sum_i \\delta^{(i)}$ and the probability mass function is $\\mathbb{P}(\\delta = x_j|\\cdot) \\approx \\frac{1}{N}\\sum_i I(\\delta^{(i)} = j)$.</li>" +
        "</ul>" +
        "<p>For the book's data (each $n_i = 15$, survivors $Y = 0,0,2,2,8,10,12,14,15,14$ across doses $1$–$10$), the result is $\\overline{\\delta} = 4.04$ with a 95% interval of $(3,5)$.</p>" }
    ],
    takeaways: [
      "Rewrite a hard integral as an expectation, then estimate it by averaging random draws.",
      "The estimate has standard error s/sqrt(N), so any desired precision is reachable by raising N.",
      "Example: integral of x^3 on (0,1) is 1/4; N=10,000 gives .248 with se .0028.",
      "Bayesian posteriors (two binomials, dose-response LD50) are computed by sampling from the posterior, not by integrating."
    ]
  });
  window.CODEVIZ["aos-ch24-basic-monte-carlo"] = { charts: [ {
    type: "bars",
    title: "Example 24.2 — Monte Carlo estimate of Phi(2)",
    interpret: "Both Monte Carlo estimates sit near the true value .9772; the larger sample (N=100,000) is closer (.9771) than the smaller one (.9751).",
    labels: ["true Phi(2)", "N=10,000", "N=100,000"],
    values: [0.9772, 0.9751, 0.9771],
    colors: ["#7ee787", "#4ea1ff", "#ffb454"]
  } ] };

  // 2 — Importance sampling
  B({
    id: "aos-ch24-importance-sampling",
    chapter: "Chapter 24",
    title: "Importance Sampling",
    tagline: "When you cannot sample from f, sample from an easier density g and reweight — but pick a g with fatter tails or the variance blows up.",
    sections: [
      { h: "The problem basic Monte Carlo cannot solve", body:
        "<p>Basic Monte Carlo for $I = \\int h(x) f(x)\\,dx$ requires sampling from $f$. But sometimes we do not know how. In Bayesian inference the posterior is the likelihood times the prior, and there is no guarantee that the result is a familiar distribution like a Normal or Gamma that we know how to sample from. Importance sampling fixes this.</p>" },
      { h: "The reweighting identity", body:
        "<p>Let $g$ be a probability density we <em>can</em> simulate from. Multiply and divide the integrand by $g$:</p>" +
        "<p>$I = \\int h(x) f(x)\\,dx = \\int \\frac{h(x) f(x)}{g(x)} g(x)\\,dx = \\mathbb{E}_g(Y),$</p>" +
        "<p>where $Y = h(X)f(X)/g(X)$ and the expectation is now taken with respect to $g$. So draw $X_1,\\dots,X_N \\sim g$ and estimate</p>" +
        "<p>$\\widehat{I} = \\frac{1}{N}\\sum_i Y_i = \\frac{1}{N}\\sum_i \\frac{h(X_i) f(X_i)}{g(X_i)}.$</p>" +
        "<p>By the law of large numbers $\\widehat{I} \\xrightarrow{\\text{P}} I$. The ratio $f(X_i)/g(X_i)$ is the <em>importance weight</em> that corrects for sampling from the wrong density.</p>" },
      { h: "The catch — infinite variance", body:
        "<p>There is a danger: $\\widehat{I}$ can have infinite standard error. Writing $w(x) = h(x)f(x)/g(x)$, the second moment is $\\mathbb{E}_g(w^2(X)) = \\int \\frac{h^2(x) f^2(x)}{g(x)}\\,dx$. If $g$ has <em>thinner</em> tails than $f$, the $g(x)$ in the denominator is tiny out in the tails and this integral can be infinite. The basic rule: sample from a $g$ with thicker tails than $f$. Also, if $g$ is small where $f$ is large, the ratio $f/g$ gets huge and the variance explodes — so $g$ should be similar in shape to $f$.</p>" },
      { h: "The optimal sampler", body:
        "<p><strong>Theorem 24.5.</strong> The choice of $g$ minimizing the variance of $\\widehat{I}$ is $g^*(x) = |h(x)| f(x) / \\int |h(s)| f(s)\\,ds$. The proof writes the variance of $w = fh/g$ as $\\int \\frac{h^2 f^2}{g}\\,dx - (\\int hf\\,dx)^2$; the second term does not depend on $g$, and Jensen's inequality gives the lower bound $\\mathbb{E}_g(W^2) \\ge (\\int |h(x)|f(x)\\,dx)^2$, which $g^*$ attains. This is of theoretical interest only: if we could sample from $g^*$ we could probably sample from $f$. In practice we just look for a thick-tailed $g$ similar to $|h|f$.</p>" },
      { h: "Worked example — a tail probability", body:
        "<p><strong>Example 24.6 (Tail Probability).</strong> Estimate $I = \\mathbb{P}(Z \\gt 3) = .0013$ for $Z \\sim N(0,1)$, writing $h(x) = 1$ if $x \\gt 3$ and $0$ otherwise, with $f$ the standard Normal density. Basic Monte Carlo with $N = 100$ draws from $N(0,1)$ wastes almost every observation, because hardly any land near the far right tail.</p>" +
        "<table class=\"extable\"><thead><tr><th>method</th><th>sampler g</th><th>mean of estimate</th><th>variance</th></tr></thead>" +
        "<tbody>" +
        "<tr><td class=\"row-h\">basic Monte Carlo</td><td>N(0,1)</td><td class=\"num\">.0015</td><td class=\"num\">.0039</td></tr>" +
        "<tr><td class=\"row-h\">importance sampling</td><td>N(4,1)</td><td class=\"num\">.0011</td><td class=\"num\">.0002</td></tr>" +
        "</tbody></table>" +
        "<p>Centering the sampler at $4$ puts the draws where they matter. The standard deviation drops by a factor of about $20$ — a dramatic gain.</p>" },
      { h: "Worked example — outliers and importance sampling for Bayes", body:
        "<p><strong>Example 24.7 (Measurement Model With Outliers).</strong> For measurements $X_i = \\theta + \\epsilon_i$, a Normal error model has thin tails so extreme outliers are treated as nearly impossible. A better model gives $\\epsilon_i$ a $t$-distribution with $\\nu$ degrees of freedom (smaller $\\nu$ = thicker tails); the book takes $\\nu = 3$. With a flat prior on $\\theta$ and likelihood $\\mathcal{L}(\\theta) = \\prod_i t(X_i - \\theta)$, the posterior mean $\\overline{\\theta} = \\int \\theta \\mathcal{L}(\\theta)\\,d\\theta / \\int \\mathcal{L}(\\theta)\\,d\\theta$ is estimated by importance sampling: draw $\\theta_1,\\dots,\\theta_N \\sim g$ and take $\\overline{\\theta} \\approx [\\frac{1}{N}\\sum_j \\theta_j \\mathcal{L}(\\theta_j)/g(\\theta_j)] / [\\frac{1}{N}\\sum_j \\mathcal{L}(\\theta_j)/g(\\theta_j)]$. With $n = 2$ observations the numerically computed posterior mean is $-.54$. A Normal importance sampler gives $-.74$ (poor), while a Cauchy ($t$ with 1 degree of freedom, very thick tails) gives $-.53$ — almost exact. This shows again that a fat-tailed sampler wins.</p>" }
    ],
    takeaways: [
      "Sample from an easy density g and reweight by f/g to estimate integrals you cannot sample for directly.",
      "If g has thinner tails than f the estimator can have infinite variance; choose a g with thicker tails, shaped like f.",
      "The variance-minimizing sampler is g* proportional to |h|f, but it is only of theoretical interest.",
      "Tail-probability example: an N(4,1) sampler cut the standard deviation by ~20x over basic Monte Carlo."
    ]
  });
  window.CODEVIZ["aos-ch24-importance-sampling"] = { charts: [ {
    type: "bars",
    title: "Example 24.6 — variance of the tail-probability estimate",
    interpret: "Importance sampling from N(4,1) shrinks the variance from .0039 to .0002 versus basic Monte Carlo, a roughly 20x drop in standard deviation.",
    labels: ["basic MC (N(0,1))", "importance (N(4,1))"],
    values: [0.0039, 0.0002],
    colors: ["#4ea1ff", "#7ee787"]
  } ] };

  // 3 — MCMC Part I: the Metropolis–Hastings algorithm
  B({
    id: "aos-ch24-metropolis-hastings",
    chapter: "Chapter 24",
    title: "MCMC and the Metropolis-Hastings Algorithm",
    tagline: "Build a Markov chain whose long-run distribution is your target, propose moves from any friendly distribution, and accept or reject them.",
    sections: [
      { h: "The MCMC idea", body:
        "<p>Markov chain Monte Carlo (MCMC) attacks $I = \\int h(x) f(x)\\,dx$ from a new angle: construct a Markov chain $X_1, X_2, \\dots$ whose stationary (long-run) distribution is the target $f$. Under suitable conditions $\\frac{1}{N}\\sum_{i=1}^N h(X_i) \\xrightarrow{\\text{P}} \\mathbb{E}_f(h(X)) = I$. This works because there is a law of large numbers for Markov chains. A Markov chain is a sequence in which the next state depends only on the current state.</p>" },
      { h: "The algorithm", body:
        "<p>The Metropolis-Hastings algorithm is a specific MCMC method. Pick a <strong>proposal distribution</strong> $q(y|x)$ — any friendly conditional density we know how to sample from. Start at an arbitrary $X_0$. Having generated $X_0,\\dots,X_i$, produce $X_{i+1}$ as follows:</p>" +
        "<ul class=\"steps\">" +
        "<li>Generate a candidate $Y \\sim q(y|X_i)$.</li>" +
        "<li>Compute the acceptance ratio $r = r(X_i, Y)$ where $r(x,y) = \\min\\left\\{\\dfrac{f(y)}{f(x)}\\dfrac{q(x|y)}{q(y|x)},\\; 1\\right\\}$.</li>" +
        "<li>Set $X_{i+1} = Y$ with probability $r$, and $X_{i+1} = X_i$ with probability $1 - r$.</li>" +
        "</ul>" +
        "<p><strong>Remark 24.8.</strong> A simple way to do the last step: draw $U \\sim \\text{Unif}(0,1)$; if $U \\lt r$ set $X_{i+1} = Y$, otherwise keep $X_{i+1} = X_i$.</p>" +
        "<p><strong>Remark 24.9.</strong> A common proposal is $q(y|x) = N(x, b^2)$ — a Normal centered at the current value. This proposal is symmetric, $q(y|x) = q(x|y)$, so the ratio simplifies to $r = \\min\\{f(Y)/f(X_i),\\; 1\\}$. Notice $f$ only enters as a ratio, so the normalizing constant cancels — we never need it.</p>" },
      { h: "Worked example — the Cauchy", body:
        "<p><strong>Example 24.10.</strong> Target the Cauchy density $f(x) = \\frac{1}{\\pi}\\frac{1}{1+x^2}$. Using the symmetric proposal $q(y|x) = N(x, b^2)$, the ratio is</p>" +
        "<p>$r(x,y) = \\min\\left\\{\\dfrac{f(y)}{f(x)},\\; 1\\right\\} = \\min\\left\\{\\dfrac{1+x^2}{1+y^2},\\; 1\\right\\}.$</p>" +
        "<p>So at each step draw $Y \\sim N(X_i, b^2)$ and accept with that probability. The only tuning knob is the proposal width $b$.</p>" },
      { h: "Tuning the step size b", body:
        "<p>Figure 24.2 shows three chains of length $N = 1000$ for $b = .1$, $b = 1$, $b = 10$:</p>" +
        "<ul class=\"steps\">" +
        "<li>$b = .1$ (too small): tiny steps, the chain barely explores the space, and the histogram poorly matches the true density.</li>" +
        "<li>$b = 10$ (too large): proposals land far out in the tails, $r$ is small, proposals get rejected, and the chain &quot;gets stuck&quot; in one place — again a poor histogram.</li>" +
        "<li>$b = 1$ (just right): avoids both extremes and represents the density well much sooner.</li>" +
        "</ul>" +
        "<p>When the sample starts to look like $f$ quickly, the chain is said to <strong>mix well</strong>. Building a well-mixing chain is something of an art; efficiency depends on the tuning parameters.</p>" },
      { h: "Why it works — detailed balance", body:
        "<p>From Chapter 23, a distribution satisfies <strong>detailed balance</strong> for a chain with transition density $p(x,y)$ if $f(x) p(x,y) = f(y) p(y,x)$. If $f$ satisfies detailed balance, then $f$ is a stationary distribution, because integrating both sides over $y$ gives $\\int f(y) p(y,x)\\,dy = f(x)$.</p>" +
        "<p>The proof that Metropolis-Hastings has $f$ as its stationary distribution checks detailed balance directly. Take two points $x, y$ and assume (without loss of generality) $f(x) q(y|x) \\gt f(y) q(x|y)$. Then $r(x,y) = \\frac{f(y)}{f(x)}\\frac{q(x|y)}{q(y|x)}$ and $r(y,x) = 1$. The probability of jumping $x \\to y$ (propose $y$ AND accept it) is $p(x,y) = q(y|x) r(x,y) = \\frac{f(y)}{f(x)} q(x|y)$, giving $f(x) p(x,y) = f(y) q(x|y)$. The probability of jumping $y \\to x$ is $p(y,x) = q(x|y) r(y,x) = q(x|y)$, giving $f(y) p(y,x) = f(y) q(x|y)$. The two right-hand sides match, so detailed balance holds and $f$ is stationary.</p>" }
    ],
    takeaways: [
      "MCMC builds a Markov chain whose stationary distribution is the target f, then averages h over the chain.",
      "Metropolis-Hastings proposes Y from q(y|x) and accepts with probability r = min{ [f(y)q(x|y)]/[f(x)q(y|x)], 1 }.",
      "A symmetric Normal proposal cancels q, leaving r = min{f(Y)/f(X), 1}; the normalizing constant of f never matters.",
      "Step size b must be tuned: too small under-explores, too large gets stuck; b that makes the chain 'mix well' is ideal.",
      "It works because the accept-reject rule makes f satisfy detailed balance, which forces f to be stationary."
    ]
  });

  // 4 — MCMC Part II: the Gibbs sampler
  B({
    id: "aos-ch24-gibbs-sampler",
    chapter: "Chapter 24",
    title: "MCMC and the Gibbs Sampler",
    tagline: "Break a hard high-dimensional sampling problem into a cycle of easy one-dimensional draws from each full conditional distribution.",
    sections: [
      { h: "The Gibbs idea", body:
        "<p>Tuning a Metropolis-Hastings chain to mix well in high dimensions is hard. The <strong>Gibbs sampler</strong> sidesteps this by turning one high-dimensional problem into several one-dimensional ones. For a bivariate density $f_{X,Y}(x,y)$, suppose we can sample from the two <strong>conditional distributions</strong> $f_{X|Y}(x|y)$ and $f_{Y|X}(y|x)$ — the distribution of one variable with the other held fixed.</p>" },
      { h: "The algorithm", body:
        "<p>Given starting values $(X_0, Y_0)$ and current state $(X_n, Y_n)$, get $(X_{n+1}, Y_{n+1})$ by:</p>" +
        "<ul class=\"steps\">" +
        "<li>Draw $X_{n+1} \\sim f_{X|Y}(x | Y_n)$ — update $X$ using the latest $Y$.</li>" +
        "<li>Draw $Y_{n+1} \\sim f_{Y|X}(y | X_{n+1})$ — update $Y$ using the just-updated $X$.</li>" +
        "<li>Repeat.</li>" +
        "</ul>" +
        "<p>Each draw is one-dimensional and uses the most recently updated value of every other variable. This generalizes in the obvious way to more than two dimensions.</p>" },
      { h: "Worked example — normal hierarchical model", body:
        "<p><strong>Example 24.11 (Normal Hierarchical Model).</strong> From each of $k$ cities we sample $n_i$ people and observe $Y_i \\sim \\text{Binomial}(n_i, p_i)$ with disease. The city rates $p_i$ are themselves draws from a common distribution — a <strong>hierarchical model</strong>. Using Normal approximations, set $\\widehat{p}_i = Y_i/n_i$, transform to $Z_i = \\log(\\widehat{p}_i/(1-\\widehat{p}_i))$, and model $Z_i | \\psi_i \\sim N(\\psi_i, \\sigma_i^2)$ with $\\psi_i \\sim N(\\mu, \\tau^2)$. Taking $\\tau = 1$, the unknowns are $\\theta = (\\mu, \\psi_1, \\dots, \\psi_k)$ with a flat prior on $\\mu$, so the posterior is proportional to the likelihood.</p>" +
        "<p>Gibbs needs each parameter's distribution conditional on all the others. Dropping terms that do not involve the target parameter gives clean Normal conditionals:</p>" +
        "<ul class=\"steps\">" +
        "<li>$\\mu | \\text{rest} \\sim N(b, 1/k)$ where $b = \\frac{1}{k}\\sum_i \\psi_i$ (the average of the current $\\psi_i$).</li>" +
        "<li>$\\psi_i | \\text{rest} \\sim N(e_i, d_i^2)$ where $e_i = \\dfrac{Z_i/\\sigma_i^2 + \\mu}{1 + 1/\\sigma_i^2}$ and $d_i^2 = \\dfrac{1}{1 + 1/\\sigma_i^2}$.</li>" +
        "</ul>" +
        "<p>So one Gibbs sweep draws $\\mu \\sim N(b, 1/k)$, then $\\psi_1 \\sim N(e_1, d_1^2), \\dots, \\psi_k \\sim N(e_k, d_k^2)$, always using the most recently drawn values. Repeat $N$ times. Each $\\psi_i$ converts back to a rate by $p_i = e^{\\psi_i}/(1 + e^{\\psi_i})$.</p>" },
      { h: "What the simulation shows — shrinkage", body:
        "<p>The book runs this with $k = 20$ cities and $n = 20$ people per city. Trace plots (Figure 24.3) of the chain for $p_1$ and $\\mu$ show the chain wandering steadily — it mixes well. The posterior histogram for $\\mu$ and the raw proportions versus the Bayes estimates appear in Figure 24.4. The key finding: the Bayes estimates are <em>shrunk</em> toward each other compared with the raw proportions. The parameter $\\tau$ controls how much shrinkage occurs; here it was fixed at $1$, but in practice $\\tau$ should itself be an unknown the data can estimate.</p>" },
      { h: "Metropolis within Gibbs", body:
        "<p>What if we cannot sample directly from a conditional $f_{X|Y}$ or $f_{Y|X}$? We can still run Gibbs by replacing each draw with a Metropolis-Hastings step — <strong>Metropolis within Gibbs</strong>. With proposal $q$ for $x$ and $\\widetilde{q}$ for $y$, update $X$ treating $Y$ as fixed (and vice versa):</p>" +
        "<ul class=\"steps\">" +
        "<li>Draw a proposal $Z \\sim q(z | X_n)$; compute $r = \\min\\left\\{\\dfrac{f(Z, Y_n)}{f(X_n, Y_n)}\\dfrac{q(X_n|Z)}{q(Z|X_n)},\\; 1\\right\\}$; set $X_{n+1} = Z$ with probability $r$, else $X_{n+1} = X_n$.</li>" +
        "<li>Draw a proposal $Z \\sim \\widetilde{q}(z | Y_n)$; compute $r = \\min\\left\\{\\dfrac{f(X_{n+1}, Z)}{f(X_{n+1}, Y_n)}\\dfrac{\\widetilde{q}(Y_n|Z)}{\\widetilde{q}(Z|Y_n)},\\; 1\\right\\}$; set $Y_{n+1} = Z$ with probability $r$, else $Y_{n+1} = Y_n$.</li>" +
        "</ul>" +
        "<p>This too generalizes beyond two dimensions, combining the flexibility of Metropolis-Hastings with the divide-and-conquer structure of Gibbs.</p>" }
    ],
    takeaways: [
      "Gibbs sampling turns a high-dimensional draw into a cycle of one-dimensional draws from each full conditional.",
      "For (X,Y): draw X from f(x|Y), then Y from f(y|X), always using the latest values; repeat.",
      "Hierarchical-model example: every full conditional is Normal, giving mu ~ N(b,1/k) and psi_i ~ N(e_i, d_i^2).",
      "The Bayes estimates come out shrunk toward each other versus the raw proportions; tau controls the shrinkage.",
      "If a conditional can't be sampled directly, use a Metropolis-Hastings step inside Gibbs (Metropolis within Gibbs)."
    ]
  });
})();
