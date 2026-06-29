/* All of Statistics (Larry Wasserman) — Chapter 23: Probability Redux: Stochastic Processes.
   Self-registering book-template lessons, one per key concept. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "All of Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "All of Statistics" }, o));

  // 1 — Markov chains
  B({
    id: "aos-ch23-markov-chains",
    chapter: "Chapter 23",
    title: "Markov Chains",
    tagline: "A sequence of dependent random variables where the next state depends only on the current one, summarized by a transition matrix.",
    sections: [
      { h: "From iid to dependent sequences", body:
        "<p>Most of the book studied iid sequences, meaning random variables that are <em>independent and identically distributed</em>. A <strong>stochastic process</strong> $\\{X_t : t \\in T\\}$ drops the independence: it is a collection of random variables indexed by a set $T$ that we read as time. Each $X_t$ takes values in a set $\\mathcal{X}$ called the <strong>state space</strong>. The book's running motivation is the weather: today's temperature clearly depends on yesterday's, so the days are not independent.</p>" +
        "<p>A <strong>Markov chain</strong> is the simplest kind of dependence. It assumes the distribution of $X_n$ depends only on the immediately preceding value $X_{n-1}$ and nothing earlier. Formally (Definition 23.5), $\\mathbb{P}(X_n = x \\mid X_0,\\ldots,X_{n-1}) = \\mathbb{P}(X_n = x \\mid X_{n-1})$ for all $n$ and all $x$. Here we assume a discrete state space such as $\\mathcal{X} = \\{1,\\ldots,N\\}$ and discrete time $T = \\{0,1,2,\\ldots\\}$. The book writes $X_n$ rather than $X_t$ for chains.</p>" +
        "<p>This \"memoryless\" property lets the joint density factor into a product of one-step pieces: $f(x_1,\\ldots,x_n) = f(x_1) f(x_2 \\mid x_1) f(x_3 \\mid x_2) \\cdots f(x_n \\mid x_{n-1})$. In a diagram, each variable has a single parent: the previous observation.</p>" },
      { h: "Transition probabilities and the transition matrix", body:
        "<p>The key quantities are the chances of jumping from one state to another. A chain is <strong>homogeneous</strong> if these chances do not change with time, that is $\\mathbb{P}(X_{n+1} = j \\mid X_n = i)$ is the same for every $n$. The book deals only with homogeneous chains.</p>" +
        "<p>For such a chain (Definition 23.6) the <strong>transition probabilities</strong> are $p_{ij} \\equiv \\mathbb{P}(X_{n+1} = j \\mid X_n = i)$, the probability of moving from state $i$ to state $j$ in one step. Collecting them into a grid gives the <strong>transition matrix</strong> $\\mathbf{P}$, whose entry in row $i$, column $j$ is $p_{ij}$. Two properties always hold: every entry satisfies $p_{ij} \\geq 0$, and each row sums to one ($\\sum_j p_{ij} = 1$). So each row of $\\mathbf{P}$ is itself a probability mass function over where you go next.</p>" +
        "<p><strong>Example 23.8 (the weather).</strong> Let $\\mathcal{X} = \\{\\text{sunny}, \\text{cloudy}\\}$. As a first approximation, assume tomorrow's weather depends only on today's. A typical transition matrix the book gives is:</p>" +
        "<table class=\"extable\"><thead><tr><th>from \\\\ to</th><th>Sunny</th><th>Cloudy</th></tr></thead><tbody>" +
        "<tr><td class=\"row-h\">Sunny</td><td class=\"num\">0.4</td><td class=\"num\">0.6</td></tr>" +
        "<tr><td class=\"row-h\">Cloudy</td><td class=\"num\">0.8</td><td class=\"num\">0.2</td></tr>" +
        "</tbody></table>" +
        "<p>Reading row \"Sunny\": if it is sunny today, there is a 60 per cent chance it is cloudy tomorrow. Each row adds to one, as required.</p>" },
      { h: "n-step probabilities and Chapman-Kolmogorov", body:
        "<p>To go several steps we define the <strong>n-step transition probabilities</strong> $p_{ij}(n) = \\mathbb{P}(X_{m+n} = j \\mid X_m = i)$ (Equation 23.4): the chance of moving from $i$ to $j$ in $n$ steps. Stacking them gives the matrix $\\mathbf{P}_n$.</p>" +
        "<p>The <strong>Chapman-Kolmogorov equations</strong> (Theorem 23.9) connect different step-counts. Splitting an $(m+n)$-step trip at an intermediate state $k$ and summing over all possible $k$ gives $p_{ij}(m+n) = \\sum_k p_{ik}(m)\\, p_{kj}(n)$. This is exactly the rule for matrix multiplication, so $\\mathbf{P}_{m+n} = \\mathbf{P}_m \\mathbf{P}_n$. Since the one-step matrix $\\mathbf{P}_1 = \\mathbf{P}$, repeating the rule gives the clean result $\\mathbf{P}_n = \\mathbf{P}^n$ (Equation 23.7): the $n$-step matrix is just $\\mathbf{P}$ multiplied by itself $n$ times.</p>" +
        "<p>For the weather chain, squaring $\\mathbf{P}$ gives the two-day-ahead probabilities $\\mathbf{P}^2$:</p>" +
        "<ul class=\"steps\">" +
        "<li>Sunny to Sunny in 2 days: $0.4 \\times 0.4 + 0.6 \\times 0.8 = 0.16 + 0.48 = 0.64$.</li>" +
        "<li>Sunny to Cloudy in 2 days: $0.4 \\times 0.6 + 0.6 \\times 0.2 = 0.24 + 0.12 = 0.36$.</li>" +
        "<li>Cloudy to Sunny in 2 days: $0.8 \\times 0.4 + 0.2 \\times 0.8 = 0.32 + 0.16 = 0.48$.</li>" +
        "<li>Cloudy to Cloudy in 2 days: $0.8 \\times 0.6 + 0.2 \\times 0.2 = 0.48 + 0.04 = 0.52$.</li>" +
        "</ul>" +
        "<p>(These last numbers are worked out here from the book's matrix to illustrate $\\mathbf{P}^2$; the book gives the one-step matrix.)</p>" },
      { h: "Marginal distributions", body:
        "<p>Let $\\mu_n = (\\mu_n(1),\\ldots,\\mu_n(N))$ be a row vector where $\\mu_n(i) = \\mathbb{P}(X_n = i)$ is the chance the chain sits in state $i$ at time $n$ (Equation 23.8). This is the <strong>marginal distribution</strong> at time $n$. The starting vector $\\mu_0$ is called the <strong>initial distribution</strong>; to simulate a chain you need only $\\mu_0$ and $\\mathbf{P}$ — draw $X_0$ from $\\mu_0$, then draw each next state from the matching row of $\\mathbf{P}$.</p>" +
        "<p>The marginals follow directly from the matrix powers (Lemma 23.10): $\\mu_n = \\mu_0 \\mathbf{P}^n$. Intuitively, $\\mu_n$ is what you would see if you ran many copies of the chain and built a histogram of their states at time $n$.</p>" },
      { h: "Stationary and limiting distributions", body:
        "<p>Let $\\pi = (\\pi_i : i \\in \\mathcal{X})$ be a probability mass function over the states. We say $\\pi$ is a <strong>stationary</strong> (or invariant) distribution if $\\pi = \\pi \\mathbf{P}$ (Definition 23.23). The intuition (using the marginal rule above): if the chain starts in $\\pi$, then $\\mu_1 = \\mu_0 \\mathbf{P} = \\pi \\mathbf{P} = \\pi$, and likewise $\\mu_n = \\pi \\mathbf{P}^n = \\pi$ for every $n$. So once the chain has distribution $\\pi$, it keeps that distribution forever.</p>" +
        "<p>A separate, stronger idea is the <strong>limiting distribution</strong> (Definition 23.24): the chain has one if $\\mathbf{P}^n$ converges to a matrix whose every row equals the same vector $\\pi$, i.e. $\\pi_j = \\lim_{n\\to\\infty} \\mathbf{P}^n_{ij}$ exists and does not depend on the starting state $i$. The main convergence result (Theorem 23.25) says an irreducible, ergodic chain has a unique stationary distribution $\\pi$, and its limiting distribution exists and equals that same $\\pi$.</p>" +
        "<p><strong>Warning (the book's):</strong> a stationary distribution need not be a limit. Example 23.27 uses the cyclic matrix $\\mathbf{P}$ with rows $(0,1,0)$, $(0,0,1)$, $(1,0,0)$. The uniform vector $\\pi = (1/3, 1/3, 1/3)$ satisfies $\\pi\\mathbf{P} = \\pi$, so it is stationary; yet the chain just cycles $1 \\to 2 \\to 3 \\to 1 \\to \\cdots$ forever and never settles to a limit.</p>" +
        "<p><strong>Worked stationary distribution for the weather chain.</strong> Solve $\\pi = \\pi \\mathbf{P}$ with $\\pi = (\\pi_S, \\pi_C)$ and $\\pi_S + \\pi_C = 1$:</p>" +
        "<ul class=\"steps\">" +
        "<li>Sunny balance: $\\pi_S = 0.4\\,\\pi_S + 0.8\\,\\pi_C$, so $0.6\\,\\pi_S = 0.8\\,\\pi_C$, giving $\\pi_C = 0.75\\,\\pi_S$.</li>" +
        "<li>Normalize: $\\pi_S + 0.75\\,\\pi_S = 1$, so $1.75\\,\\pi_S = 1$ and $\\pi_S = 4/7 \\approx 0.571$.</li>" +
        "<li>Then $\\pi_C = 3/7 \\approx 0.429$.</li>" +
        "<li>Check: $\\pi \\mathbf{P} = (0.571 \\times 0.4 + 0.429 \\times 0.8,\\; 0.571 \\times 0.6 + 0.429 \\times 0.2) = (0.571, 0.429) = \\pi$. Confirmed.</li>" +
        "</ul>" +
        "<p>(The book gives this matrix; the stationary vector is solved here from it.) Finally, $\\pi$ satisfies <strong>detailed balance</strong> if $\\pi_i p_{ij} = \\pi_j p_{ji}$; Theorem 23.26 shows detailed balance is enough to guarantee $\\pi$ is stationary, a fact that matters for Markov chain Monte Carlo in the next chapter.</p>" }
    ],
    takeaways: [
      "A Markov chain's next state depends only on the current state; the transition matrix $\\mathbf{P}$ holds all one-step probabilities, with non-negative entries and rows summing to one.",
      "Chapman-Kolmogorov gives $\\mathbf{P}_{m+n} = \\mathbf{P}_m \\mathbf{P}_n$, hence the $n$-step matrix is $\\mathbf{P}^n$.",
      "The marginal at time $n$ is $\\mu_n = \\mu_0 \\mathbf{P}^n$.",
      "A stationary distribution solves $\\pi = \\pi \\mathbf{P}$; for the weather matrix it is $(4/7, 3/7)$.",
      "A limiting distribution is stronger than a stationary one — a cyclic chain can be stationary yet never converge."
    ]
  });
  window.CODEVIZ["aos-ch23-markov-chains"] = { charts: [ {
    type: "bars",
    title: "Weather chain — stationary distribution pi = pi P",
    interpret: "Solving pi = pi P for the book's weather matrix gives a long-run 4/7 sunny, 3/7 cloudy split.",
    labels: ["Sunny", "Cloudy"],
    values: [0.571, 0.429],
    valueLabels: ["4/7 = 0.571", "3/7 = 0.429"],
    colors: ["#ffb454", "#4ea1ff"]
  } ] };

  // 2 — Poisson processes
  B({
    id: "aos-ch23-poisson-processes",
    chapter: "Chapter 23",
    title: "Poisson Processes",
    tagline: "A counting process for events in continuous time, governed by an intensity function, with independent increments and exponential gaps between events.",
    sections: [
      { h: "Counting events in continuous time", body:
        "<p>The Poisson process is what you reach for when counting occurrences of events over time: traffic accidents, radioactive decay, arrivals of email. The book's running picture is your inbox — each time a message arrives you record the time, and $X_t$ is the number of messages received up to and including time $t$. A process $\\{X_t : t \\in [0,\\infty)\\}$ with state space $\\mathcal{X} = \\{0,1,2,\\ldots\\}$ that counts events this way is a <strong>counting process</strong>. A Poisson process is a counting process that meets a few specific conditions.</p>" +
        "<p>First, a reminder. $X$ has a <strong>Poisson distribution</strong> with parameter $\\lambda$ (written $X \\sim \\text{Poisson}(\\lambda)$) if $\\mathbb{P}(X = x) = e^{-\\lambda} \\lambda^x / x!$ for $x = 0,1,2,\\ldots$. Its mean and variance are both $\\lambda$: $\\mathbb{E}(X) = \\lambda$ and $\\mathbb{V}(X) = \\lambda$. The notation $f(h) = o(h)$ means $f(h)/h \\to 0$ as $h \\to 0$ — informally, $f(h)$ is much smaller than $h$ when $h$ is tiny.</p>" },
      { h: "The intensity function and increments", body:
        "<p>A <strong>Poisson process</strong> (Definition 23.32) is a process $\\{X_t : t \\in [0,\\infty)\\}$ on $\\{0,1,2,\\ldots\\}$ such that:</p>" +
        "<ul class=\"steps\">" +
        "<li><strong>Starts empty:</strong> $X(0) = 0$.</li>" +
        "<li><strong>Independent increments:</strong> for any times $0 = t_0 \\lt t_1 \\lt \\cdots \\lt t_n$, the counts added over disjoint intervals, $X(t_1) - X(t_0),\\; X(t_2) - X(t_1),\\; \\ldots,\\; X(t_n) - X(t_{n-1})$, are independent. Counts in non-overlapping time windows do not influence each other.</li>" +
        "<li><strong>Intensity rule:</strong> there is a function $\\lambda(t)$ with $\\mathbb{P}(X(t+h) - X(t) = 1) = \\lambda(t)h + o(h)$ and $\\mathbb{P}(X(t+h) - X(t) \\geq 2) = o(h)$.</li>" +
        "</ul>" +
        "<p>We call $\\lambda(t)$ the <strong>intensity function</strong>. The third condition says that in a short window $[t, t+h]$ the chance of exactly one event is roughly $h\\lambda(t)$, while the chance of two or more is negligible.</p>" +
        "<p>The counts themselves are Poisson (Theorem 23.33): if we set $m(t) = \\int_0^t \\lambda(s)\\,ds$, then over an interval $X(s+t) - X(s) \\sim \\text{Poisson}(m(s+t) - m(s))$, and in particular $X(t) \\sim \\text{Poisson}(m(t))$, so $\\mathbb{E}(X(t)) = m(t)$ and $\\mathbb{V}(X(t)) = m(t)$.</p>" +
        "<p>When the intensity is a constant, $\\lambda(t) \\equiv \\lambda$, the process is a <strong>homogeneous Poisson process with rate $\\lambda$</strong> (Definition 23.34). Then $m(t) = \\lambda t$ and $X(t) \\sim \\text{Poisson}(\\lambda t)$.</p>" },
      { h: "Interarrival times are exponential", body:
        "<p>Now track the events themselves in a homogeneous process. Let $W_n$ be the time the $n$-th event occurs (a <strong>waiting time</strong>), with $W_0 = 0$. The gaps $S_n = W_{n+1} - W_n$ are the <strong>sojourn times</strong> or <strong>interarrival times</strong> — how long you wait between consecutive events.</p>" +
        "<p>Theorem 23.35 gives their distribution: the interarrival times $S_0, S_1, \\ldots$ are iid, each <strong>exponential with mean $1/\\lambda$</strong>, with density $f(s) = \\lambda e^{-\\lambda s}$ for $s \\geq 0$. The reasoning starts from $\\mathbb{P}(S_1 \\gt t) = \\mathbb{P}(X(t) = 0) = e^{-\\lambda t}$ (no events by time $t$), so the cdf of $S_1$ is $1 - e^{-\\lambda t}$, the exponential cdf; independent increments then make each later gap independent with the same law.</p>" +
        "<p>Because a waiting time $W_n$ is a sum of $n$ exponential gaps, it follows a Gamma distribution: $W_n \\sim \\text{Gamma}(n, 1/\\lambda)$ with density $f(w) = \\frac{1}{\\Gamma(n)} \\lambda^n w^{n-1} e^{-\\lambda w}$, giving $\\mathbb{E}(W_n) = n/\\lambda$ and $\\mathbb{V}(W_n) = n/\\lambda^2$.</p>" },
      { h: "Estimating the rate from data", body:
        "<p><strong>Example 23.36.</strong> The book applies this to recorded hits on a web server in Calgary (Figure 23.3, where each vertical mark is one event). Assuming a homogeneous Poisson process, the total count over a span $T$ is $N \\equiv X(T) \\sim \\text{Poisson}(\\lambda T)$, so the likelihood is $\\mathcal{L}(\\lambda) \\propto e^{-\\lambda T}(\\lambda T)^N$. Maximizing it gives the estimate $\\widehat{\\lambda} = N / T = 48.0077$ events per minute.</p>" +
        "<p>The book then checks whether a constant-rate (homogeneous) model is reasonable. Split $[0,T]$ into four equal intervals $I_1, I_2, I_3, I_4$. Under a homogeneous process, given the total number of events, each interval should be equally likely, so the null hypothesis is $p_1 = p_2 = p_3 = p_4 = 1/4$. A chi-squared goodness-of-fit test, $\\sum_{i=1}^{4} (O_i - E_i)^2 / E_i$ with expected count $E_i = N/4$, yields $\\chi^2 = 252$ with a p-value near $0$. That is strong evidence against a constant rate — unsurprising, since the intensity of web traffic naturally varies through the day.</p>" }
    ],
    takeaways: [
      "A Poisson process counts events in continuous time: $X(0)=0$, increments over disjoint intervals are independent, and an intensity function $\\lambda(t)$ governs the chance of an event.",
      "Counts are Poisson: $X(t) \\sim \\text{Poisson}(m(t))$ with $m(t) = \\int_0^t \\lambda(s)\\,ds$; a constant rate gives $X(t) \\sim \\text{Poisson}(\\lambda t)$.",
      "Interarrival times are iid Exponential with mean $1/\\lambda$; the $n$-th waiting time is Gamma$(n, 1/\\lambda)$.",
      "For the Calgary server data the MLE is $\\widehat{\\lambda} = N/T = 48.0077$ per minute, but a $\\chi^2 = 252$ test rejects the constant-rate assumption."
    ]
  });
})();
