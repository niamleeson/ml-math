/* All of Statistics (Larry Wasserman) — Chapter 11 "Bayesian Inference".
   Self-registering book lessons. One lesson per key point. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "All of Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "All of Statistics" }, o));

  // 1) Bayesian philosophy + the Bayesian method (prior, likelihood, posterior)
  B({
    id: "aos-ch11-bayesian-method",
    chapter: "Chapter 11",
    title: "Prior, likelihood, posterior",
    tagline: "The posterior is proportional to the likelihood times the prior.",
    sections: [
      { h: "Two philosophies", body:
        "Everything up to this chapter was <strong>frequentist</strong> (also called classical) inference. The frequentist view rests on three postulates. First, probability means a limiting relative frequency and is an objective property of the world. Second, a parameter is a fixed unknown constant, so you cannot make probability statements about it. Third, procedures should have good long-run frequency behavior — for example a 95 percent confidence interval should trap the true parameter at least 95 percent of the time." },
      { h: "The Bayesian postulates", body:
        "<strong>Bayesian inference</strong> replaces those with three of its own. Probability describes a degree of belief, not a frequency, so you can attach a probability to many kinds of statements (Wasserman's example: stating that the probability Albert Einstein drank tea on August 1, 1948 is .35). You can make probability statements about parameters even though they are fixed constants. And you make inferences about a parameter $\\theta$ by producing a whole probability distribution for $\\theta$, then reading point and interval estimates out of that distribution. Wasserman notes the approach is controversial because it builds in a subjective notion of probability and gives no long-run guarantees, yet it is embraced strongly in parts of machine learning." },
      { h: "The three steps of the method", body:
        "<ul class=\"steps\">" +
        "<li>Choose a prior density $f(\\theta)$ that encodes your beliefs about $\\theta$ before seeing data.</li>" +
        "<li>Choose a statistical model $f(x|\\theta)$ for the data given $\\theta$ (written with a bar, $f(x|\\theta)$, not a semicolon).</li>" +
        "<li>After observing $X_1,\\dots,X_n$, update to the posterior $f(\\theta|X_1,\\dots,X_n)$.</li>" +
        "</ul>" },
      { h: "Bayes' theorem gives the posterior", body:
        "For a continuous parameter the posterior is $f(\\theta|x)=\\frac{f(x|\\theta)f(\\theta)}{\\int f(x|\\theta)f(\\theta)d\\theta}$. With $n$ independent observations the model becomes the likelihood $\\mathcal{L}_n(\\theta)=\\prod_{i=1}^n f(x_i|\\theta)$, writing $x^n$ for $(x_1,\\dots,x_n)$. So $f(\\theta|x^n)=\\frac{\\mathcal{L}_n(\\theta)f(\\theta)}{c_n}\\propto \\mathcal{L}_n(\\theta)f(\\theta)$, where the <strong>normalizing constant</strong> $c_n=\\int \\mathcal{L}_n(\\theta)f(\\theta)d\\theta$ does not depend on $\\theta$. The slogan: <strong>posterior is proportional to likelihood times prior</strong>. Dropping $c_n$ causes no harm because it can always be recovered later." },
      { h: "Reading estimates out of the posterior", body:
        "A point estimate summarizes the center of the posterior, usually its mean $\\bar{\\theta}_n=\\int \\theta f(\\theta|x^n)d\\theta$ or its mode. A $1-\\alpha$ <strong>posterior interval</strong> $(a,b)$ is found by putting $\\alpha/2$ probability in each tail, so that $\\int_a^b f(\\theta|x^n)d\\theta = 1-\\alpha$." },
      { h: "Worked example: Bernoulli with a uniform prior", body:
        "Let $X_1,\\dots,X_n\\sim \\text{Bernoulli}(p)$ and take the flat prior $f(p)=1$. Then $f(p|x^n)\\propto p^s(1-p)^{n-s}$ where $s=\\sum x_i$ is the number of successes. Recognizing the Beta form, the posterior is $p|x^n\\sim \\text{Beta}(s+1,\\,n-s+1)$ — the constant is figured out without doing the integral. Since a $\\text{Beta}(\\alpha,\\beta)$ has mean $\\alpha/(\\alpha+\\beta)$, the Bayes estimator is $\\bar p = \\frac{s+1}{n+2}$. Rewriting it as $\\bar p = \\lambda_n\\hat p + (1-\\lambda_n)\\tilde p$ shows it is a weighted average of the MLE $\\hat p=s/n$ and the prior mean $\\tilde p=1/2$, with weight $\\lambda_n=n/(n+2)\\approx 1$. With a $\\text{Beta}(\\alpha,\\beta)$ prior instead, the posterior is $\\text{Beta}(\\alpha+s,\\,\\beta+n-s)$; the flat prior is just $\\alpha=\\beta=1$." },
      { h: "Book numbers: 0101000000", body:
        "Exercise 11.5 gives the concrete Bernoulli sequence <code>0101000000</code>. It has $n=10$ trials and $s=2$ successes. Under the flat $\\text{Beta}(1,1)$ prior from Example 11.1, the likelihood is $L(p)=p^2(1-p)^8$ and the posterior is $\\text{Beta}(3,9)$. <table class=\"extable\"><thead><tr><th>quantity</th><th>book value used</th><th class=\"num\">number</th></tr></thead><tbody><tr><td class=\"row-h\">data</td><td><code>0101000000</code></td><td class=\"num\">$s=2,n=10$</td></tr><tr><td class=\"row-h\">MLE</td><td>$\\hat p=s/n$</td><td class=\"num\">0.200</td></tr><tr><td class=\"row-h\">flat prior mean</td><td>$1/2$</td><td class=\"num\">0.500</td></tr><tr><td class=\"row-h\">posterior</td><td>$\\text{Beta}(s+1,n-s+1)$</td><td class=\"num\">$\\text{Beta}(3,9)$</td></tr><tr><td class=\"row-h\">posterior mean</td><td>$(s+1)/(n+2)$</td><td class=\"num\">0.250</td></tr><tr><td class=\"row-h\">95% posterior interval</td><td>Beta quantiles</td><td class=\"num\">(0.060, 0.518)</td></tr></tbody></table><ul class=\"steps\"><li>The posterior mean is $(2+1)/(10+2)=3/12=0.25$.</li><li>The shrinkage form is $\\lambda_n\\hat p+(1-\\lambda_n)(1/2)$ with $\\lambda_n=10/12=0.833$.</li><li>So $0.833(0.2)+0.167(0.5)=0.25$; the prior pulls the MLE upward.</li></ul>" },
      { h: "Conjugacy", body:
        "Because the Beta prior produced a Beta posterior — same distributional family — the prior is called <strong>conjugate</strong> with respect to the model. The Normal example (Normal prior, Normal posterior) is another conjugate pair." },
      { h: "Worked example: Normal conjugacy", body:
        "Example 11.2 takes $X_1,\\dots,X_n\\sim N(\\theta,\\sigma^2)$ with known $\\sigma$ and prior $\\theta\\sim N(a,b^2)$. The posterior stays Normal: $\\theta|X^n\\sim N(\\bar\\theta,\\tau^2)$. <table class=\"extable\"><thead><tr><th>posterior ingredient</th><th>book formula</th></tr></thead><tbody><tr><td class=\"row-h\">standard error</td><td>$se=\\sigma/\\sqrt{n}$</td></tr><tr><td class=\"row-h\">posterior mean</td><td>$\\bar\\theta=w\\bar X+(1-w)a$</td></tr><tr><td class=\"row-h\">weight on data</td><td>$w=(1/se^2)/(1/se^2+1/b^2)$</td></tr><tr><td class=\"row-h\">posterior precision</td><td>$1/\\tau^2=1/se^2+1/b^2$</td></tr><tr><td class=\"row-h\">95% posterior interval</td><td>$\\bar\\theta\\pm1.96\\tau$</td></tr></tbody></table><ul class=\"steps\"><li>Choose $c$ so $P(\\theta \\lt c|X^n)=0.025$.</li><li>Standardizing gives $P(Z \\lt (c-\\bar\\theta)/\\tau)=0.025$.</li><li>Since $P(Z \\lt -1.96)=0.025$, $c=\\bar\\theta-1.96\\tau$ and similarly $d=\\bar\\theta+1.96\\tau$.</li><li>For large $n$, $\\bar\\theta\\approx\\hat\\theta$ and $\\tau\\approx se$, matching the frequentist interval $\\hat\\theta\\pm1.96se$.</li></ul>" }
    ],
    takeaways: [
      "Frequentists treat the parameter as a fixed constant; Bayesians give it a probability distribution.",
      "Posterior $\\propto$ likelihood $\\times$ prior; the normalizing constant can be recovered later.",
      "Bernoulli with a flat prior gives $p|x^n\\sim\\text{Beta}(s+1,n-s+1)$ and Bayes estimator $\\bar p=(s+1)/(n+2)$.",
      "The Bayes estimate is a weighted average of the MLE and the prior mean.",
      "When prior and posterior share a family, the prior is conjugate."
    ]
  });

  // 2) Functions of parameters & simulation
  B({
    id: "aos-ch11-functions-simulation",
    chapter: "Chapter 11",
    title: "Functions of parameters and simulation",
    tagline: "Transform the posterior by the CDF method, or just simulate to avoid the calculus.",
    sections: [
      { h: "The CDF method for a function of the parameter", body:
        "To make inferences about $\\tau=g(\\theta)$, reuse the same change-of-variable reasoning from probability theory. The posterior CDF for $\\tau$ is $H(\\tau|x^n)=\\mathbb{P}(g(\\theta)\\le \\tau|x^n)=\\int_A f(\\theta|x^n)d\\theta$ over the set $A=\\{\\theta:\\,g(\\theta)\\le\\tau\\}$, and the posterior density is its derivative $h(\\tau|x^n)=H'(\\tau|x^n)$." },
      { h: "Worked example: the log-odds", body:
        "Take Bernoulli$(p)$ with flat prior, so $p|x^n\\sim\\text{Beta}(s+1,n-s+1)$, and let $\\psi=\\log(p/(1-p))$ be the log-odds. Solving $\\psi$ for $p$ gives $p=e^{\\psi}/(1+e^{\\psi})$, so the CDF becomes $H(\\psi|x^n)=\\mathbb{P}\\!\\left(P\\le \\frac{e^{\\psi}}{1+e^{\\psi}}\\,\\middle|\\,x^n\\right)=\\int_0^{e^{\\psi}/(1+e^{\\psi})} f(p|x^n)\\,dp$. Differentiating, and using that $\\frac{\\partial}{\\partial\\psi}\\frac{e^\\psi}{1+e^\\psi}=\\left(\\frac{1}{1+e^\\psi}\\right)^2$, the posterior density is $h(\\psi|x^n)=\\frac{\\Gamma(n+2)}{\\Gamma(s+1)\\Gamma(n-s+1)}\\left(\\frac{e^\\psi}{1+e^\\psi}\\right)^s\\left(\\frac{1}{1+e^\\psi}\\right)^{n-s+2}$ for $\\psi\\in\\mathbb{R}$." },
      { h: "Simulation is the easy alternative", body:
        "The posterior can usually be approximated by simulation. Draw $\\theta_1,\\dots,\\theta_B\\sim p(\\theta|x^n)$. A histogram of those draws approximates the posterior density. The posterior mean is approximated by the sample average $\\bar\\theta_n\\approx \\frac{1}{B}\\sum_{j=1}^B \\theta_j$, and a $1-\\alpha$ posterior interval by the $\\alpha/2$ and $1-\\alpha/2$ sample quantiles of the draws." },
      { h: "Simulating a function avoids all the calculus", body:
        "<ul class=\"steps\">" +
        "<li>Draw $P_1,\\dots,P_B\\sim \\text{Beta}(s+1,n-s+1)$ — the posterior for $p$.</li>" +
        "<li>Transform each draw: $\\psi_i=\\log(P_i/(1-P_i))$.</li>" +
        "<li>The $\\psi_1,\\dots,\\psi_B$ are now IID draws from $h(\\psi|x^n)$, so their histogram estimates that density.</li>" +
        "</ul>" +
        "More generally, once you have $\\theta_1,\\dots,\\theta_B$ from $f(\\theta|x^n)$, just set $\\tau_i=g(\\theta_i)$ and the $\\tau_i$ are a sample from $f(\\tau|x^n)$ — no analytical work needed." },
      { h: "Code that mirrors the book's simulation", body:
        "For the book's sequence <code>0101000000</code>, $s=2,n=10$ and the posterior is $\\text{Beta}(3,9)$. The same two simulation steps generate posterior draws of the log-odds:<pre><code class=\"language-python\">import numpy as np\nfrom scipy.stats import beta\n\nx = np.array([0,1,0,1,0,0,0,0,0,0])\ns, n = int(x.sum()), len(x)              # book data: s=2, n=10\nrng = np.random.default_rng(123)\np = rng.beta(s + 1, n - s + 1, 100_000)  # Beta(3,9)\npsi = np.log(p / (1 - p))\nprint(p.mean())                          # about 0.250\nprint(np.quantile(p, [.025, .975]))      # about [0.060, 0.518]\nprint(psi.mean())                        # about -1.28</code></pre>" }
    ],
    takeaways: [
      "For $\\tau=g(\\theta)$, get the posterior CDF $H(\\tau|x^n)$ by integrating the posterior over $\\{g(\\theta)\\le\\tau\\}$, then differentiate.",
      "The log-odds example yields a closed-form posterior density, but the algebra is heavy.",
      "Simulation sidesteps it: draw from the posterior, apply $g$ to each draw, histogram the result.",
      "Posterior mean and intervals are read off as the sample mean and sample quantiles of the draws."
    ]
  });

  // 3) Large-sample properties + flat / improper / noninformative priors
  B({
    id: "aos-ch11-large-sample-priors",
    chapter: "Chapter 11",
    title: "Large samples and noninformative priors",
    tagline: "In large samples the posterior looks Normal around the MLE; flat priors raise subtle problems.",
    sections: [
      { h: "Large-sample behavior of the posterior", body:
        "In both the Bernoulli and Normal examples the posterior mean came out close to the MLE. This is general. <strong>Theorem (11.5):</strong> let $\\hat\\theta_n$ be the MLE and $\\hat{se}=1/\\sqrt{nI(\\hat\\theta_n)}$. Under regularity conditions the posterior is approximately Normal with mean $\\hat\\theta_n$ and standard deviation $\\hat{se}$, so $\\bar\\theta_n\\approx \\hat\\theta_n$. Consequently the frequentist Wald interval $C_n=(\\hat\\theta_n - z_{\\alpha/2}\\hat{se},\\,\\hat\\theta_n + z_{\\alpha/2}\\hat{se})$ is also an approximate $1-\\alpha$ Bayesian posterior interval: $\\mathbb{P}(\\theta\\in C_n|X^n)\\to 1-\\alpha$. There is also a Bayesian delta method: for $\\tau=g(\\theta)$, $\\tau|X^n\\approx N(\\hat\\tau,\\tilde{se}^2)$ with $\\hat\\tau=g(\\hat\\theta)$ and $\\tilde{se}=\\hat{se}\\,|g'(\\hat\\theta)|$." },
      { h: "Where does the prior come from", body:
        "A central question is where $f(\\theta)$ comes from. <strong>Subjectivism</strong> says the prior should reflect your honest subjective opinion before the data. Wasserman argues this is impractical in complicated problems with many parameters, and injecting subjective opinion conflicts with the goal of objective scientific inference. The alternative is a <strong>noninformative prior</strong>, the obvious candidate being a flat prior $f(\\theta)\\propto \\text{constant}$. In the Bernoulli case $f(p)=1$ gave the reasonable $\\text{Beta}(s+1,n-s+1)$, but flat priors raise two problems." },
      { h: "Improper priors", body:
        "Let $X\\sim N(\\theta,\\sigma^2)$ with $\\sigma$ known and adopt $f(\\theta)\\propto c$. Since $\\int f(\\theta)d\\theta=\\infty$, this is not a genuine probability density — it is an <strong>improper prior</strong>. Even so, Bayes' theorem still runs formally: $f(\\theta|x^n)\\propto \\mathcal{L}_n(\\theta)f(\\theta)\\propto \\mathcal{L}_n(\\theta)$, giving $\\theta|X^n\\sim N(\\bar X,\\sigma^2/n)$, whose point and interval estimates agree exactly with the frequentist ones. Improper priors are fine as long as the resulting posterior is a well-defined probability distribution." },
      { h: "Flat priors are not transformation invariant", body:
        "Take $X\\sim\\text{Bernoulli}(p)$ with flat prior $f(p)=1$, meant to express ignorance about $p$. Transform to $\\psi=\\log(p/(1-p))$. The induced density is $f_\\Psi(\\psi)=\\frac{e^\\psi}{(1+e^\\psi)^2}$, which is <em>not</em> flat. But if you are ignorant about $p$ you are equally ignorant about $\\psi$ and should also want a flat prior for $\\psi$ — a contradiction. So a flat prior is not well defined: flatness on one scale does not survive a change of variables. Flat priors are <strong>not transformation invariant</strong>." },
      { h: "Jeffreys' prior", body:
        "Jeffreys' rule fixes this by setting $f(\\theta)\\propto I(\\theta)^{1/2}$, where $I(\\theta)$ is the Fisher information; this rule is transformation invariant. For the Bernoulli model $I(p)=\\frac{1}{p(1-p)}$, so Jeffreys' prior is $f(p)\\propto p^{-1/2}(1-p)^{-1/2}$, which is a $\\text{Beta}(1/2,1/2)$ density — very close to a uniform. In several parameters Jeffreys' prior is $f(\\theta)\\propto \\sqrt{|I(\\theta)|}$ with $|I(\\theta)|$ the determinant of the Fisher information matrix." },
      { h: "Book prior sensitivity table", body:
        "Exercise 11.5 asks for posterior plots for the same data <code>0101000000</code> under four priors. Recomputing the posterior summaries shows exactly what the plots would reveal: stronger priors pull harder toward their prior means.<table class=\"extable\"><thead><tr><th>prior</th><th>posterior</th><th class=\"num\">posterior mean</th><th class=\"num\">95% interval</th></tr></thead><tbody><tr><td class=\"row-h\">$\\text{Beta}(1/2,1/2)$</td><td>$\\text{Beta}(2.5,8.5)$</td><td class=\"num\">0.227</td><td class=\"num\">(0.044, 0.503)</td></tr><tr><td class=\"row-h\">$\\text{Beta}(1,1)$</td><td>$\\text{Beta}(3,9)$</td><td class=\"num\">0.250</td><td class=\"num\">(0.060, 0.518)</td></tr><tr><td class=\"row-h\">$\\text{Beta}(10,10)$</td><td>$\\text{Beta}(12,18)$</td><td class=\"num\">0.400</td><td class=\"num\">(0.235, 0.577)</td></tr><tr><td class=\"row-h\">$\\text{Beta}(100,100)$</td><td>$\\text{Beta}(102,108)$</td><td class=\"num\">0.486</td><td class=\"num\">(0.418, 0.553)</td></tr></tbody></table>" }
    ],
    takeaways: [
      "Large-sample posterior $\\approx N(\\hat\\theta_n,\\hat{se}^2)$, so the Wald interval doubles as a Bayesian interval.",
      "A flat prior over an infinite range is improper, but can still yield a valid posterior.",
      "Flat priors are not transformation invariant: flat in $p$ is not flat in $\\log(p/(1-p))$.",
      "Jeffreys' prior $f(\\theta)\\propto I(\\theta)^{1/2}$ is transformation invariant; for Bernoulli it is Beta(1/2,1/2)."
    ]
  });

  // 4) Multiparameter problems & Bayesian testing
  B({
    id: "aos-ch11-multiparameter-testing",
    chapter: "Chapter 11",
    title: "Multiparameter problems and testing",
    tagline: "Marginalize (often by simulation) to inspect one parameter; testing puts a prior on the hypotheses.",
    sections: [
      { h: "The posterior for a vector parameter", body:
        "With $\\theta=(\\theta_1,\\dots,\\theta_p)$ the posterior is still $f(\\theta|x^n)\\propto \\mathcal{L}_n(\\theta)f(\\theta)$. To make inferences about a single component, say $\\theta_1$, integrate the rest out — the <strong>marginal posterior</strong> $f(\\theta_1|x^n)=\\int\\cdots\\int f(\\theta_1,\\dots,\\theta_p|x^n)\\,d\\theta_2\\cdots d\\theta_p$. That integral is often infeasible, so simulate: draw vectors $\\theta^1,\\dots,\\theta^B\\sim f(\\theta|x^n)$ and keep only the first coordinate of each draw, $\\theta_1^1,\\dots,\\theta_1^B$, which is a sample from the marginal — no integral required." },
      { h: "Worked example: comparing two binomials", body:
        "Suppose $n_1$ control and $n_2$ treatment patients, with $X_1\\sim\\text{Binomial}(n_1,p_1)$ and $X_2\\sim\\text{Binomial}(n_2,p_2)$ surviving, and we want $\\tau=p_2-p_1$. With flat prior $f(p_1,p_2)=1$ the posterior is $f(p_1,p_2|x_1,x_2)\\propto p_1^{x_1}(1-p_1)^{n_1-x_1}p_2^{x_2}(1-p_2)^{n_2-x_2}$. This factors, so $p_1$ and $p_2$ are independent under the posterior, with $p_1|x_1\\sim\\text{Beta}(x_1+1,n_1-x_1+1)$ and $p_2|x_2\\sim\\text{Beta}(x_2+1,n_2-x_2+1)$. To get the posterior of $\\tau$, draw $P_{1,b}$ and $P_{2,b}$ from those Betas and set $\\tau_b=P_{2,b}-P_{1,b}$." },
      { h: "Book numbers: 50 controls and 50 treated", body:
        "Exercise 11.4 supplies the concrete two-binomial numbers: 50 placebo patients with 30 improvements and 50 treated patients with 40 improvements. With the flat prior, the posteriors are independent Betas.<table class=\"extable\"><thead><tr><th>group</th><th class=\"num\">x</th><th class=\"num\">n</th><th>posterior</th><th class=\"num\">posterior mean</th></tr></thead><tbody><tr><td class=\"row-h\">placebo</td><td class=\"num\">30</td><td class=\"num\">50</td><td>$\\text{Beta}(31,21)$</td><td class=\"num\">0.596</td></tr><tr><td class=\"row-h\">treatment</td><td class=\"num\">40</td><td class=\"num\">50</td><td>$\\text{Beta}(41,11)$</td><td class=\"num\">0.788</td></tr><tr><td class=\"row-h\">difference $\\tau$</td><td class=\"num\">—</td><td class=\"num\">—</td><td>simulate $P_2-P_1$</td><td class=\"num\">0.192</td></tr></tbody></table><ul class=\"steps\"><li>The MLE is $\\hat\\tau=40/50-30/50=0.20$.</li><li>The posterior mean is $41/52-31/52=10/52=0.192$.</li><li>A posterior 90% interval from simulation is approximately $(0.047,0.335)$.</li></ul><pre><code class=\"language-python\">import numpy as np\nrng = np.random.default_rng(12345)\np1 = rng.beta(31, 21, 200_000)     # placebo: x1=30, n1=50\np2 = rng.beta(41, 11, 200_000)     # treatment: x2=40, n2=50\ntau = p2 - p1\nprint(tau.mean())                  # about 0.192\nprint(np.quantile(tau, [.05,.95])) # about [0.047, 0.335]</code></pre>" },
      { h: "Bayesian hypothesis testing", body:
        "Testing $H_0:\\theta=\\theta_0$ versus $H_1:\\theta\\ne\\theta_0$ Bayesianly means putting a prior on the hypotheses and computing $\\mathbb{P}(H_0|X^n)$. It is usual (though not essential) to take $\\mathbb{P}(H_0)=\\mathbb{P}(H_1)=1/2$, plus a prior density $f(\\theta)$ for $\\theta$ under $H_1$. By Bayes' theorem the equal priors cancel, leaving $\\mathbb{P}(H_0|X^n=x^n)=\\frac{\\mathcal{L}(\\theta_0)}{\\mathcal{L}(\\theta_0)+\\int \\mathcal{L}(\\theta)f(\\theta)d\\theta}$." },
      { h: "Why testing is different from estimation", body:
        "In estimation the prior was barely influential and Bayes agreed with frequentist answers. In testing this fails: the prior matters a lot, so $f(\\theta)$ must be chosen carefully. You also cannot use improper priors here, because they leave an undefined constant in the denominator integral. You can, however, get a prior-free <em>bound</em>: since $0\\le \\int\\mathcal{L}(\\theta)f(\\theta)d\\theta\\le \\mathcal{L}(\\hat\\theta)$, it follows that $\\frac{\\mathcal{L}(\\theta_0)}{\\mathcal{L}(\\theta_0)+\\mathcal{L}(\\hat\\theta)}\\le \\mathbb{P}(H_0|X^n=x^n)\\le 1$. The upper bound is uninteresting, but the lower bound is non-trivial." }
    ],
    takeaways: [
      "Multiparameter posteriors are handled by marginalizing — usually by simulating and keeping one coordinate.",
      "For two binomials with a flat prior, $p_1$ and $p_2$ are independent Betas under the posterior; simulate to get $p_2-p_1$.",
      "Bayesian testing puts priors on $H_0,H_1$ (typically 1/2 each) and reports $\\mathbb{P}(H_0|X^n)$.",
      "Unlike estimation, the prior strongly affects testing, improper priors are not allowed, but a prior-free lower bound exists."
    ]
  });

  // 5) Strengths & weaknesses — frequentist vs Bayesian
  B({
    id: "aos-ch11-strengths-weaknesses",
    chapter: "Chapter 11",
    title: "Strengths and weaknesses",
    tagline: "Bayes shines with real prior information and small models, but is tied to the likelihood and can fail in high dimensions.",
    sections: [
      { h: "What is appealing about Bayes", body:
        "Bayesian inference is attractive when genuine prior information exists, since Bayes' theorem is a natural way to combine it with data. Some find it psychologically appealing that it lets you make probability statements about a parameter directly. By contrast a frequentist confidence set $C_n$ traps the parameter 95 percent of the time, yet you cannot say $\\mathbb{P}(\\theta\\in C_n|X^n)=.95$ — the probability statement is about $C_n$, not $\\theta$. Wasserman cautions that psychological appeal is not itself a scientific argument for choosing one approach. In parametric models with large samples the two approaches give approximately the same inferences, but in general they need not agree." },
      { h: "Where Bayes wins: the confidence-set example", body:
        "Revisiting Example 6.14: let $\\theta$ be fixed and $X_1,X_2$ independent with $\\mathbb{P}(X_i=1)=\\mathbb{P}(X_i=-1)=1/2$. Observe only $Y_i=\\theta+X_i$. Define $C=\\{Y_1-1\\}$ if $Y_1=Y_2$, else $C=\\{(Y_1+Y_2)/2\\}$. This is a valid 75 percent confidence set ($\\mathbb{P}_\\theta(\\theta\\in C)=3/4$ for every $\\theta$)." },
      { h: "The example continued", body:
        "<ul class=\"steps\">" +
        "<li>Observe $Y_1=15$ and $Y_2=17$. Since $Y_1\\ne Y_2$, the set is $\\{(15+17)/2\\}=\\{16\\}$.</li>" +
        "<li>But when $Y_1\\ne Y_2$ the two $X_i$ must be $+1$ and $-1$, so $\\theta$ is known exactly to be 16 — yet calling $\\{16\\}$ merely a 75 percent confidence set bothers people, even though it is valid.</li>" +
        "<li>Bayesian: with any prior putting positive mass on every integer, when $Y=(15,17)$ the likelihood is $\\mathcal{L}(\\theta)=1/4$ at $\\theta=16$ and 0 otherwise, so the posterior puts probability 1 on $\\theta=16$ and $\\mathbb{P}(\\theta\\in C|Y)=1$.</li>" +
        "</ul>" +
        "The Bayesian answer matches our certainty and is more satisfying here." },
      { h: "Where Bayes fails: the Robins-Ritov missing-data example", body:
        "A simplified Robins-Ritov (1997) setup has IID triples $(X_i,R_i,Y_i)$. With $B$ enormous (Wasserman uses $B=100^{100}$), draw $X_i$ uniformly on $\\{1,\\dots,B\\}$, then $R_i\\sim\\text{Bernoulli}(\\xi_{X_i})$ with the $\\xi_j$ <em>known</em>, and if $R_i=1$ draw $Y_i\\sim\\text{Bernoulli}(\\theta_{X_i})$ (otherwise $Y_i$ is missing). The goal is $\\psi=\\mathbb{P}(Y_i=1)=\\frac1B\\sum_j \\theta_j\\equiv g(\\theta)$. The likelihood drops every term with $B$ and the known $\\xi_j$: $\\mathcal{L}(\\theta)\\propto \\prod_i \\theta_{X_i}^{Y_iR_i}(1-\\theta_{X_i})^{(1-Y_i)R_i}$." },
      { h: "Why the Bayesian estimate is uninformative here", body:
        "Counting, $n_j=\\#\\{i:Y_i=1,R_i=1,X_i=j\\}$ and $m_j=\\#\\{i:Y_i=0,R_i=1,X_i=j\\}$. Because $B$ dwarfs any realistic $n$, almost every category is empty: $n_j=m_j=0$ for most $j$. So the MLE for most $\\theta_j$ is undefined, and for those $\\theta_j$ the posterior just equals the prior — the data say nothing. Hence $f(\\psi|\\text{Data})\\approx f(\\psi)$: the Bayesian analysis learns almost nothing about $\\psi$." },
      { h: "The frequentist fix and the moral", body:
        "The Horwitz-Thompson estimator $\\hat\\psi=\\frac1n\\sum_{i=1}^n \\frac{R_iY_i}{\\xi_{X_i}}$ is unbiased with $\\mathbb{V}(\\hat\\psi)\\le \\frac{1}{n\\delta^2}$, so its MSE is of order $1/n$ — going to zero quickly no matter how large $B$ is. It divides by the known $\\xi_{X_i}$, which cancel out of the log-likelihood, so this estimator can never arise from a likelihood-based (hence Bayesian) method. The moral: Bayesian methods are tied to the likelihood, and in high-dimensional or nonparametric problems the likelihood may not deliver accurate inferences." }
    ],
    takeaways: [
      "Bayes is appealing with real prior information and lets you state $\\mathbb{P}(\\theta\\in C|X^n)$ directly.",
      "Example 6.14 shows Bayes giving the satisfying answer (posterior mass 1 on $\\theta=16$) where a valid confidence set feels wrong.",
      "The Robins-Ritov example shows Bayes failing: with $B$ huge, the posterior for $\\psi$ stays near the prior.",
      "The Horwitz-Thompson estimator achieves MSE of order $1/n$ but cannot come from any likelihood-based method.",
      "Moral: being tied to the likelihood, Bayes can be inaccurate in high-dimensional / nonparametric problems."
    ]
  });

  // Chart: prior, likelihood, and posterior for the Bernoulli example using Exercise 11.5 data.
  // Data are 0101000000: n=10, s=2, flat Beta(1,1) prior, posterior Beta(3,9).
  (function () {
    function betaPdf(x, a, b) {
      // log Beta(a,b) normalizing via lgamma
      function lgamma(z) {
        var g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
          771.32342877765313, -176.61502916214059, 12.507343278686905,
          -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
        if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z);
        z -= 1; var xg = c[0];
        for (var i = 1; i < g + 2; i++) xg += c[i] / (z + i);
        var t = z + g + 0.5;
        return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(xg);
      }
      var logB = lgamma(a) + lgamma(b) - lgamma(a + b);
      return Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) - logB);
    }
    var xs = [], prior = [], like = [], post = [];
    for (var k = 1; k <= 19; k++) {
      var x = k / 20;
      xs.push(Number(x.toFixed(2)));
      prior.push(Number(betaPdf(x, 1, 1).toFixed(3)));        // flat Beta(1,1)
      like.push(Number((1000 * Math.pow(x, 2) * Math.pow(1 - x, 8)).toFixed(3))); // scaled L(p)
      post.push(Number(betaPdf(x, 3, 9).toFixed(3)));         // Beta(s+1,n-s+1)=Beta(3,9), n=10,s=2
    }
    window.CODEVIZ["aos-ch11-bayesian-method"] = {
      charts: [{
        type: "line",
        title: "Prior, scaled likelihood, and posterior for p (0101000000)",
        interpret: "The book's sequence has 2 successes in 10. The flat prior is constant; the posterior Beta(3,9) centers at 0.25, between the MLE 0.20 and prior mean 0.50.",
        xlabel: "p",
        ylabel: "density",
        series: [
          { name: "prior Beta(1,1)", color: "#7ee787", points: xs.map(function (x, i) { return [x, prior[i]]; }) },
          { name: "scaled likelihood p^2(1-p)^8", color: "#ffb454", points: xs.map(function (x, i) { return [x, like[i]]; }) },
          { name: "posterior Beta(3,9)", color: "#4ea1ff", points: xs.map(function (x, i) { return [x, post[i]]; }) }
        ]
      }],
      code: "import numpy as np\nfrom scipy.stats import beta\n\nx = np.array([0,1,0,1,0,0,0,0,0,0])\ns, n = int(x.sum()), len(x)              # book data: s=2, n=10\nalpha, beta0 = 1, 1                      # flat prior Beta(1,1)\npost_a, post_b = alpha + s, beta0 + n - s\nprint(post_a, post_b)                    # Beta(3, 9)\nprint(post_a / (post_a + post_b))        # 0.25 posterior mean\nprint(beta.ppf([.025, .975], post_a, post_b))  # [0.0602, 0.5178]"
    };
  })();
  (function () {
    var ps = [0.03,0.06,0.10,0.15,0.20,0.25,0.30,0.40,0.50,0.65,0.80];
    var pts = ps.map(function (p) { return [Number(Math.log(p / (1 - p)).toFixed(3)), Number(betaPdfForChart(p, 3, 9).toFixed(3))]; });
    function betaPdfForChart(x, a, b) {
      function lgamma(z) {
        var g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
          771.32342877765313, -176.61502916214059, 12.507343278686905,
          -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
        if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z);
        z -= 1; var xg = c[0];
        for (var i = 1; i < g + 2; i++) xg += c[i] / (z + i);
        var t = z + g + 0.5;
        return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(xg);
      }
      return Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) - (lgamma(a) + lgamma(b) - lgamma(a + b)));
    }
    window.CODEVIZ["aos-ch11-functions-simulation"] = {
      charts: [{
        type: "line",
        title: "Posterior log-odds from the book's Bernoulli data",
        interpret: "Transforming draws from Beta(3,9) by log(p/(1-p)) moves the posterior to the log-odds scale without redoing the calculus.",
        xlabel: "psi = log(p/(1-p))",
        ylabel: "Beta density at matching p",
        series: [{ name: "transformed posterior grid", color: "#c89bff", points: pts }]
      }],
      code: "import numpy as np\n\nrng = np.random.default_rng(123)\np = rng.beta(3, 9, 100_000)              # posterior for p from 0101000000\npsi = np.log(p / (1 - p))                # book's transformation\nprint(p.mean())                          # about 0.250\nprint(np.quantile(p, [.025, .975]))      # about [0.060, 0.518]\nprint(np.quantile(psi, [.025, .975]))    # log-odds interval"
    };
  })();
  window.CODEVIZ["aos-ch11-multiparameter-testing"] = {
    charts: [{
      type: "bars",
      title: "Two-binomial posterior means from Exercise 11.4",
      interpret: "The posterior mean survival/improvement rate is about 0.596 for placebo and 0.788 for treatment, giving a treatment-control difference near 0.192.",
      labels: ["placebo p1", "treatment p2", "difference tau"],
      values: [0.596, 0.788, 0.192],
      colors: ["#4ea1ff", "#7ee787", "#ffb454"]
    }],
    code: "import numpy as np\n\nrng = np.random.default_rng(12345)\np1 = rng.beta(31, 21, 200_000)           # x1=30, n1=50\np2 = rng.beta(41, 11, 200_000)           # x2=40, n2=50\ntau = p2 - p1\nprint(40/50 - 30/50)                     # MLE tau = 0.20\nprint(41/52 - 31/52)                     # posterior mean tau = 0.1923\nprint(np.quantile(tau, [.05, .95]))      # about [0.047, 0.335]"
  };
})();
