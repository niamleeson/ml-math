/* =====================================================================
   PRACTICE PROBLEMS — MODULE 1 (PROBABILITY), HARDER set, part B.
   Harder, multi-step problems appended per owned lesson id.
   Notation matches lessons/01-probability.js exactly.
   ===================================================================== */
(function(){
  var P = window.PRACTICE;
  function add(id, probs){ P[id] = (P[id] || []).concat(probs); }

  /* ---------------------------------------------------------------- */
  add("prob-geometric-poisson", [
    { q:`<p>Calls arrive Poisson with $\\lambda=3$ per minute. What is $P(X\\ge 2)$ in one minute?</p>`,
      steps:[
        {do:`Use the complement: $P(X\\ge 2)=1-P(X=0)-P(X=1)$.`, why:`"At least 2" excludes only the counts 0 and 1.`},
        {do:`$P(X=0)=\\frac{3^0 e^{-3}}{0!}=e^{-3}$ and $P(X=1)=\\frac{3^1 e^{-3}}{1!}=3e^{-3}$.`, why:`Plug $k=0$ and $k=1$ into $\\frac{\\lambda^k e^{-\\lambda}}{k!}$.`},
        {do:`$P(X\\ge 2)=1-e^{-3}-3e^{-3}=1-4e^{-3}$.`, why:`Add the two small-count probabilities, then subtract from 1.`},
        {do:`$=1-4(0.0498)=1-0.199=0.801$.`, why:`$e^{-3}\\approx 0.0498$.`}
      ],
      answer:`$1-4e^{-3}\\approx 0.801$.` },

    { q:`<p>A Poisson process averages $\\lambda=2$ events per hour. What is the chance of exactly 3 events in a <b>90-minute</b> window?</p>`,
      steps:[
        {do:`Scale the rate to the window: $90$ min $=1.5$ hr, so the window mean is $\\lambda'=2\\times 1.5=3$.`, why:`Poisson rates add over time, so the mean count scales with window length.`},
        {do:`$P(X=3)=\\frac{(3)^3 e^{-3}}{3!}=\\frac{27 e^{-3}}{6}$.`, why:`Use $\\lambda'=3$ in $\\frac{\\lambda^k e^{-\\lambda}}{k!}$ with $k=3$.`},
        {do:`$=4.5\\,e^{-3}\\approx 4.5(0.0498)=0.224$.`, why:`$27/6=4.5$ and $e^{-3}\\approx 0.0498$.`}
      ],
      answer:`$4.5\\,e^{-3}\\approx 0.224$.` },

    { q:`<p>You roll a die until the first six ($p=\\tfrac16$). Given that the first 3 rolls were not sixes, what is the chance you need <b>more than 5 total</b> rolls?</p>`,
      steps:[
        {do:`For a Geometric, $P(X&gt;n)=(1-p)^{n}$.`, why:`Needing more than $n$ rolls means the first $n$ all failed.`},
        {do:`The Geometric is memoryless: given $X&gt;3$, the extra rolls needed is again Geometric. So $P(X&gt;5\\mid X&gt;3)=P(X&gt;2)$.`, why:`Past failures do not change future waiting; we need 2 more failures.`},
        {do:`$P(X&gt;2)=(1-\\tfrac16)^2=\\left(\\tfrac56\\right)^2=\\tfrac{25}{36}$.`, why:`Two more independent failures, each chance $\\tfrac56$.`},
        {do:`$\\tfrac{25}{36}\\approx 0.694$.`, why:`Evaluate the fraction.`}
      ],
      answer:`$\\frac{25}{36}\\approx 0.694$.` },

    { q:`<p>A Poisson has $\\lambda=4$. Using the recurrence $P(X=k+1)=\\frac{\\lambda}{k+1}P(X=k)$, find $\\frac{P(X=5)}{P(X=4)}$.</p>`,
      steps:[
        {do:`The ratio of consecutive Poisson terms is $\\frac{P(X=k+1)}{P(X=k)}=\\frac{\\lambda}{k+1}$.`, why:`The $e^{-\\lambda}$ cancels and $\\frac{\\lambda^{k+1}/(k+1)!}{\\lambda^k/k!}=\\frac{\\lambda}{k+1}$.`},
        {do:`Set $k=4$: ratio $=\\frac{4}{5}$.`, why:`Plug $\\lambda=4$ and $k+1=5$.`},
        {do:`$\\frac{4}{5}=0.8$.`, why:`Evaluate.`}
      ],
      answer:`$\\frac{4}{5}=0.8$.` },

    { q:`<p>The number of typos per page is Poisson with $\\lambda=1.5$. What is the expected number of typos across 4 independent pages, and the chance a single page is typo-free?</p>`,
      steps:[
        {do:`Per-page mean is $\\lambda=1.5$, so for 4 pages $E=4\\times 1.5=6$.`, why:`Expectations add; independent pages just sum their means.`},
        {do:`Typo-free single page: $P(X=0)=\\frac{1.5^0 e^{-1.5}}{0!}=e^{-1.5}$.`, why:`Set $k=0$.`},
        {do:`$e^{-1.5}\\approx 0.223$.`, why:`Evaluate the constant.`}
      ],
      answer:`Expected $6$ typos; $P(\\text{clean page})=e^{-1.5}\\approx 0.223$.` },

    { q:`<p>You keep flipping a fair coin until the first head ($p=0.5$). What is $P(X\\ge 3)$ (it takes at least 3 flips)?</p>`,
      steps:[
        {do:`$P(X\\ge 3)=P(X&gt;2)=(1-p)^{2}$.`, why:`At least 3 flips means the first 2 were tails.`},
        {do:`$=(0.5)^2=0.25$.`, why:`Two independent tails, each chance $0.5$.`}
      ],
      answer:`$0.25$.` },

    { q:`<p>Two independent Poisson sources, $\\lambda_A=2$ and $\\lambda_B=3$ per minute, feed one queue. What is the chance of exactly 0 arrivals total in a minute?</p>`,
      steps:[
        {do:`A sum of independent Poissons is Poisson with $\\lambda=\\lambda_A+\\lambda_B$.`, why:`Independent Poisson rates add.`},
        {do:`$\\lambda=2+3=5$, so $P(X=0)=\\frac{5^0 e^{-5}}{0!}=e^{-5}$.`, why:`Set $k=0$ on the combined rate.`},
        {do:`$e^{-5}\\approx 0.0067$.`, why:`Evaluate.`}
      ],
      answer:`$e^{-5}\\approx 0.0067$.` },

    { q:`<p>A rare event has Poisson rate $\\lambda=0.5$ per day. Over a 10-day stretch, what is the chance of <b>at least one</b> event?</p>`,
      steps:[
        {do:`Scale to the window: $\\lambda'=0.5\\times 10=5$ over 10 days.`, why:`Mean count scales with the length of the window.`},
        {do:`$P(\\ge 1)=1-P(X=0)=1-e^{-5}$.`, why:`The complement of "none" is "at least one".`},
        {do:`$=1-0.0067=0.993$.`, why:`$e^{-5}\\approx 0.0067$.`}
      ],
      answer:`$1-e^{-5}\\approx 0.993$.` }
  ]);

  /* ---------------------------------------------------------------- */
  add("prob-pdf-cdf", [
    { q:`<p>A density is $f(x)=cx$ for $0\\le x\\le 2$ and $0$ elsewhere. Find $c$, then $P(X\\le 1)$.</p>`,
      steps:[
        {do:`Require total area 1: $\\int_0^2 cx\\,dx=1$.`, why:`Every valid PDF integrates to 1.`},
        {do:`$\\int_0^2 cx\\,dx=c\\cdot\\frac{x^2}{2}\\Big|_0^2=c\\cdot\\frac{4}{2}=2c=1$, so $c=\\tfrac12$.`, why:`Antiderivative of $cx$ is $c\\frac{x^2}{2}$; evaluate at the limits.`},
        {do:`$P(X\\le 1)=\\int_0^1 \\tfrac12 x\\,dx=\\tfrac12\\cdot\\frac{x^2}{2}\\Big|_0^1=\\tfrac12\\cdot\\tfrac12=\\tfrac14$.`, why:`Integrate the now-known density up to 1.`}
      ],
      answer:`$c=\\frac12$, $P(X\\le 1)=\\frac14$.` },

    { q:`<p>For $f(x)=\\tfrac12 x$ on $[0,2]$, find the CDF $F(x)$ for $0\\le x\\le 2$, then use it to get $P(1\\le X\\le 1.5)$.</p>`,
      steps:[
        {do:`$F(x)=\\int_0^x \\tfrac12 t\\,dt=\\tfrac12\\cdot\\frac{t^2}{2}\\Big|_0^x=\\frac{x^2}{4}$.`, why:`The CDF accumulates area from the left edge $0$ up to $x$.`},
        {do:`$P(1\\le X\\le 1.5)=F(1.5)-F(1)=\\frac{1.5^2}{4}-\\frac{1^2}{4}$.`, why:`A slice probability is the difference of CDF values.`},
        {do:`$=\\frac{2.25}{4}-\\frac{1}{4}=\\frac{1.25}{4}=0.3125$.`, why:`Evaluate the squares and subtract.`}
      ],
      answer:`$F(x)=\\frac{x^2}{4}$, $P=0.3125$.` },

    { q:`<p>For the density $f(x)=\\tfrac12 x$ on $[0,2]$, find the mean $E[X]$.</p>`,
      steps:[
        {do:`$E[X]=\\int_0^2 x\\,f(x)\\,dx=\\int_0^2 x\\cdot\\tfrac12 x\\,dx=\\int_0^2 \\tfrac12 x^2\\,dx$.`, why:`The mean of a continuous variable weights each $x$ by its density.`},
        {do:`$=\\tfrac12\\cdot\\frac{x^3}{3}\\Big|_0^2=\\tfrac12\\cdot\\frac{8}{3}=\\frac{4}{3}$.`, why:`Antiderivative of $x^2$ is $\\frac{x^3}{3}$.`},
        {do:`$\\frac{4}{3}\\approx 1.333$.`, why:`Evaluate.`}
      ],
      answer:`$E[X]=\\frac{4}{3}\\approx 1.333$.` },

    { q:`<p>The CDF is $F(x)=1-e^{-2x}$ for $x\\ge 0$. Find the density $f(x)$, then $P(X\\le 1)$.</p>`,
      steps:[
        {do:`The PDF is the derivative of the CDF: $f(x)=F'(x)$.`, why:`Density is the slope of the cumulative area.`},
        {do:`$f(x)=\\frac{d}{dx}\\left(1-e^{-2x}\\right)=2e^{-2x}$.`, why:`Derivative of $-e^{-2x}$ is $2e^{-2x}$.`},
        {do:`$P(X\\le 1)=F(1)=1-e^{-2}\\approx 1-0.135=0.865$.`, why:`Read the CDF directly at $x=1$.`}
      ],
      answer:`$f(x)=2e^{-2x}$, $P(X\\le 1)\\approx 0.865$.` },

    { q:`<p>A density is $f(x)=\\tfrac34(1-x^2)$ for $-1\\le x\\le 1$. Find $P(0\\le X\\le 1)$.</p>`,
      steps:[
        {do:`$P(0\\le X\\le 1)=\\int_0^1 \\tfrac34(1-x^2)\\,dx$.`, why:`Integrate the density over the requested slice.`},
        {do:`$=\\tfrac34\\left[x-\\frac{x^3}{3}\\right]_0^1=\\tfrac34\\left(1-\\tfrac13\\right)=\\tfrac34\\cdot\\tfrac23$.`, why:`Antiderivative of $1-x^2$ is $x-\\frac{x^3}{3}$.`},
        {do:`$=\\tfrac12$.`, why:`$\\frac34\\cdot\\frac23=\\frac12$. By symmetry it had to be half.`}
      ],
      answer:`$\\frac12$.` },

    { q:`<p>For $f(x)=\\tfrac12 x$ on $[0,2]$, find the median $m$ (where $F(m)=0.5$).</p>`,
      steps:[
        {do:`Use $F(x)=\\frac{x^2}{4}$ and set $\\frac{m^2}{4}=0.5$.`, why:`The median splits the area in half.`},
        {do:`$m^2=2$, so $m=\\sqrt2$.`, why:`Multiply both sides by 4, then take the positive root (since $0\\le m\\le 2$).`},
        {do:`$m=\\sqrt2\\approx 1.414$.`, why:`Evaluate.`}
      ],
      answer:`$m=\\sqrt2\\approx 1.414$.` },

    { q:`<p>A piecewise density rises then falls: $f(x)=x$ on $[0,1]$ and $f(x)=2-x$ on $[1,2]$. Confirm it integrates to 1, then find $P(X\\le 1)$.</p>`,
      steps:[
        {do:`$\\int_0^1 x\\,dx=\\frac{x^2}{2}\\Big|_0^1=\\tfrac12$ and $\\int_1^2(2-x)\\,dx=\\left[2x-\\frac{x^2}{2}\\right]_1^2=(4-2)-(2-\\tfrac12)=\\tfrac12$.`, why:`Integrate each piece on its own interval.`},
        {do:`Total $=\\tfrac12+\\tfrac12=1$. Valid PDF.`, why:`The two triangle halves sum to area 1.`},
        {do:`$P(X\\le 1)=\\int_0^1 x\\,dx=\\tfrac12$.`, why:`Only the first piece lies below 1.`}
      ],
      answer:`Integrates to $1$; $P(X\\le 1)=\\frac12$.` },

    { q:`<p>For $f(x)=\\tfrac12 x$ on $[0,2]$, find $P(X&gt;1.5 \\mid X&gt;1)$.</p>`,
      steps:[
        {do:`Use $F(x)=\\frac{x^2}{4}$. Then $P(X&gt;a)=1-F(a)$.`, why:`Tail probability is one minus the accumulated area.`},
        {do:`$P(X&gt;1.5)=1-\\frac{2.25}{4}=1-0.5625=0.4375$ and $P(X&gt;1)=1-\\frac14=0.75$.`, why:`Evaluate the tail at each threshold.`},
        {do:`$P(X&gt;1.5\\mid X&gt;1)=\\frac{0.4375}{0.75}\\approx 0.583$.`, why:`Conditioning divides by the probability of the given event (since $X&gt;1.5$ implies $X&gt;1$).`}
      ],
      answer:`$\\approx 0.583$.` }
  ]);

  /* ---------------------------------------------------------------- */
  add("prob-uniform-exponential", [
    { q:`<p>$X$ is Exponential with rate $\\lambda=\\tfrac14$ per minute. What is $P(X&gt;6)$?</p>`,
      steps:[
        {do:`The Exponential tail is $P(X&gt;t)=e^{-\\lambda t}$.`, why:`The survival probability of an Exponential decays at rate $\\lambda$.`},
        {do:`$P(X&gt;6)=e^{-\\frac14\\cdot 6}=e^{-1.5}$.`, why:`Multiply rate by time: $\\frac14\\times 6=1.5$.`},
        {do:`$e^{-1.5}\\approx 0.223$.`, why:`Evaluate.`}
      ],
      answer:`$e^{-1.5}\\approx 0.223$.` },

    { q:`<p>Bus waits are Exponential, mean 10 minutes. You've already waited 5 minutes. What is the chance you wait at least 8 <b>more</b> minutes?</p>`,
      steps:[
        {do:`Mean $=\\tfrac1\\lambda=10$ so $\\lambda=0.1$. Exponential is memoryless: $P(X&gt;5+8\\mid X&gt;5)=P(X&gt;8)$.`, why:`Having waited already does not change the remaining wait.`},
        {do:`$P(X&gt;8)=e^{-0.1\\cdot 8}=e^{-0.8}$.`, why:`Use the tail formula on the extra 8 minutes.`},
        {do:`$e^{-0.8}\\approx 0.449$.`, why:`Evaluate.`}
      ],
      answer:`$e^{-0.8}\\approx 0.449$.` },

    { q:`<p>$X$ is Uniform on $[2,10]$. Find $P(X&gt;7 \\mid X&gt;4)$.</p>`,
      steps:[
        {do:`For Uniform on $[a,b]$, $P(X&gt;t)=\\frac{b-t}{b-a}$.`, why:`Probability is the fraction of the range above $t$.`},
        {do:`$P(X&gt;7)=\\frac{10-7}{8}=\\frac38$ and $P(X&gt;4)=\\frac{10-4}{8}=\\frac68$.`, why:`Range width is $b-a=8$.`},
        {do:`$P(X&gt;7\\mid X&gt;4)=\\frac{3/8}{6/8}=\\frac36=\\frac12$.`, why:`Divide; the event $X&gt;7$ sits inside $X&gt;4$.`}
      ],
      answer:`$\\frac12$.` },

    { q:`<p>$X$ is Exponential with $\\lambda=2$. Find the median (the time $m$ with $P(X\\le m)=0.5$).</p>`,
      steps:[
        {do:`CDF is $F(t)=1-e^{-\\lambda t}$. Set $1-e^{-2m}=0.5$.`, why:`The median splits the distribution in half.`},
        {do:`$e^{-2m}=0.5\\Rightarrow -2m=\\ln 0.5=-\\ln 2$, so $m=\\frac{\\ln 2}{2}$.`, why:`Take logs and solve for $m$.`},
        {do:`$m=\\frac{0.693}{2}\\approx 0.347$.`, why:`$\\ln 2\\approx 0.693$.`}
      ],
      answer:`$m=\\frac{\\ln 2}{2}\\approx 0.347$.` },

    { q:`<p>Lifetimes are Exponential with mean 4 years. What is the chance a unit lasts <b>between 2 and 6</b> years?</p>`,
      steps:[
        {do:`Mean $=\\tfrac1\\lambda=4$ so $\\lambda=0.25$. Use $P(a&lt;X&lt;b)=e^{-\\lambda a}-e^{-\\lambda b}$.`, why:`The interval probability is the difference of tail values.`},
        {do:`$=e^{-0.25\\cdot 2}-e^{-0.25\\cdot 6}=e^{-0.5}-e^{-1.5}$.`, why:`Plug the two endpoints into $e^{-\\lambda t}$.`},
        {do:`$\\approx 0.607-0.223=0.384$.`, why:`$e^{-0.5}\\approx 0.607$, $e^{-1.5}\\approx 0.223$.`}
      ],
      answer:`$e^{-0.5}-e^{-1.5}\\approx 0.384$.` },

    { q:`<p>$X$ is Uniform on $[0,b]$ with $P(X&gt;3)=0.4$. Find $b$, then the mean.</p>`,
      steps:[
        {do:`$P(X&gt;3)=\\frac{b-3}{b}=0.4$.`, why:`Fraction of the range above 3.`},
        {do:`$b-3=0.4b\\Rightarrow 0.6b=3\\Rightarrow b=5$.`, why:`Collect terms and solve.`},
        {do:`Mean $=\\frac{0+5}{2}=2.5$.`, why:`Uniform mean is the midpoint of the range.`}
      ],
      answer:`$b=5$, mean $=2.5$.` },

    { q:`<p>Two independent Exponential waits each have rate $\\lambda=1$. What is the chance <b>both</b> exceed 2?</p>`,
      steps:[
        {do:`For one, $P(X&gt;2)=e^{-1\\cdot 2}=e^{-2}$.`, why:`Tail of an Exponential at $t=2$.`},
        {do:`Both exceed 2: multiply by independence, $\\left(e^{-2}\\right)^2=e^{-4}$.`, why:`Independent events multiply.`},
        {do:`$e^{-4}\\approx 0.0183$.`, why:`Evaluate.`}
      ],
      answer:`$e^{-4}\\approx 0.0183$.` },

    { q:`<p>Three independent Exponential$(\\lambda=1)$ waits run together — when does the <b>first</b> of the three events occur? Give its distribution and mean.</p>`,
      steps:[
        {do:`The minimum of independent Exponentials is Exponential with rate equal to the sum of rates.`, why:`The first event happens as soon as any source fires; their rates add.`},
        {do:`Combined rate $=1+1+1=3$, so the minimum is Exponential$(3)$.`, why:`Sum the three equal rates.`},
        {do:`Mean $=\\frac{1}{3}\\approx 0.333$.`, why:`Exponential mean is $\\frac1\\lambda$.`}
      ],
      answer:`Exponential$(3)$, mean $\\frac13\\approx 0.333$.` }
  ]);

  /* ---------------------------------------------------------------- */
  add("prob-normal", [
    { q:`<p>$X\\sim\\mathcal{N}(\\mu=100,\\ \\sigma=15)$. Convert $X=130$ to a z-score, then say how rare it is.</p>`,
      steps:[
        {do:`z-score: $z=\\frac{x-\\mu}{\\sigma}=\\frac{130-100}{15}$.`, why:`The z-score counts standard deviations from the mean.`},
        {do:`$z=\\frac{30}{15}=2$.`, why:`Evaluate.`},
        {do:`$X=130$ is $2\\sigma$ above the mean; about $2.3\\%$ of values lie above $+2\\sigma$.`, why:`By the 68-95-99.7 rule, $\\approx 95\\%$ lie within $\\pm 2\\sigma$, leaving $\\approx 2.5\\%$ in each tail.`}
      ],
      answer:`$z=2$; roughly top $2.3\\%$.` },

    { q:`<p>$X\\sim\\mathcal{N}(50,\\ \\sigma^2=16)$. Find $P(46\\le X\\le 58)$ using the 68-95-99.7 rule.</p>`,
      steps:[
        {do:`$\\sigma=\\sqrt{16}=4$. Convert: $z_1=\\frac{46-50}{4}=-1$, $z_2=\\frac{58-50}{4}=2$.`, why:`Standardize both endpoints.`},
        {do:`$P(-1\\le Z\\le 0)\\approx 0.341$ and $P(0\\le Z\\le 2)\\approx 0.477$.`, why:`Half of $68\\%$ on the left ($0.34$); half of $95.4\\%$ on the right ($0.477$).`},
        {do:`Add: $0.341+0.477=0.818$.`, why:`The two regions meet at the mean, so add their areas.`}
      ],
      answer:`$\\approx 0.818$.` },

    { q:`<p>$X\\sim\\mathcal{N}(\\mu,\\sigma)$ with $P(X\\le 70)=0.5$ and $P(X\\le 82)\\approx 0.84$. Find $\\mu$ and $\\sigma$.</p>`,
      steps:[
        {do:`$P(X\\le 70)=0.5$ means $70$ is the mean: $\\mu=70$.`, why:`The Normal is symmetric, so its median equals its mean.`},
        {do:`$P(X\\le \\mu+\\sigma)\\approx 0.84$, so $82=\\mu+\\sigma=70+\\sigma$.`, why:`About $84\\%$ lies below $+1\\sigma$ (the middle $68\\%$ plus the lower $16\\%$ tail).`},
        {do:`$\\sigma=82-70=12$.`, why:`Solve for $\\sigma$.`}
      ],
      answer:`$\\mu=70$, $\\sigma=12$.` },

    { q:`<p>Two independent Normals: $X\\sim\\mathcal{N}(3,\\ 4)$ and $Y\\sim\\mathcal{N}(5,\\ 9)$ (numbers are variances). Find the distribution of $X+Y$.</p>`,
      steps:[
        {do:`Sums of independent Normals are Normal; means add: $3+5=8$.`, why:`Expectation is linear.`},
        {do:`Variances add (NOT standard deviations): $4+9=13$.`, why:`Independent variances add; here $\\sigma^2_X=4$, $\\sigma^2_Y=9$.`},
        {do:`So $X+Y\\sim\\mathcal{N}(8,\\ 13)$, with $\\sigma=\\sqrt{13}\\approx 3.61$.`, why:`State mean and variance.`}
      ],
      answer:`$X+Y\\sim\\mathcal{N}(8,\\ 13)$.` },

    { q:`<p>$X\\sim\\mathcal{N}(3,\\ 4)$ and $Y\\sim\\mathcal{N}(5,\\ 9)$ independent (variances). Find the distribution of $X-Y$.</p>`,
      steps:[
        {do:`Means subtract: $E[X-Y]=3-5=-2$.`, why:`Expectation is linear.`},
        {do:`Variances still <b>add</b> for a difference: $4+9=13$.`, why:`$\\operatorname{Var}(X-Y)=\\operatorname{Var}(X)+\\operatorname{Var}(Y)$ when independent; the minus sign does not reduce spread.`},
        {do:`So $X-Y\\sim\\mathcal{N}(-2,\\ 13)$.`, why:`State the result.`}
      ],
      answer:`$X-Y\\sim\\mathcal{N}(-2,\\ 13)$.` },

    { q:`<p>$X\\sim\\mathcal{N}(20,\\ \\sigma^2=25)$. Above what value $c$ do only the top $2.5\\%$ of values lie?</p>`,
      steps:[
        {do:`$\\sigma=5$. The top $2.5\\%$ sits beyond $+2\\sigma$ (since $\\approx 95\\%$ is within $\\pm 2\\sigma$).`, why:`The 68-95-99.7 rule leaves $\\approx 2.5\\%$ in the upper tail past $z=2$.`},
        {do:`$c=\\mu+2\\sigma=20+2(5)=30$.`, why:`Convert the $z=2$ cutoff back to the original scale.`},
        {do:`So $c=30$.`, why:`State the threshold.`}
      ],
      answer:`$c=30$.` },

    { q:`<p>$Z\\sim\\mathcal{N}(0,1)$. Using $P(Z\\le 1)\\approx 0.841$, find $P(-1\\le Z\\le 1)$ and $P(Z&gt;1)$.</p>`,
      steps:[
        {do:`By symmetry $P(Z\\le -1)=1-P(Z\\le 1)=1-0.841=0.159$.`, why:`The standard Normal is symmetric about 0.`},
        {do:`$P(-1\\le Z\\le 1)=0.841-0.159=0.682$.`, why:`Subtract the lower-tail CDF from the upper.`},
        {do:`$P(Z&gt;1)=1-0.841=0.159$.`, why:`Complement of the CDF at 1.`}
      ],
      answer:`$P(-1\\le Z\\le 1)\\approx 0.682$; $P(Z&gt;1)\\approx 0.159$.` },

    { q:`<p>Scores are $\\mathcal{N}(500,\\ \\sigma=100)$. The average of $n=4$ independent scores is taken. What is the distribution of that average, and how rare is an average of $600$?</p>`,
      steps:[
        {do:`The average of $n$ Normals is Normal with the same mean $500$ and variance $\\frac{\\sigma^2}{n}=\\frac{100^2}{4}=2500$.`, why:`Averaging shrinks variance by a factor of $n$.`},
        {do:`So $\\overline{X}\\sim\\mathcal{N}(500,\\ 2500)$, giving $\\sigma_{\\overline{X}}=\\sqrt{2500}=50$.`, why:`Take the square root for the standard deviation of the average.`},
        {do:`$600$ is $\\frac{600-500}{50}=2$ standard deviations up, so about the top $2.3\\%$.`, why:`Standardize using the average's own (smaller) spread.`}
      ],
      answer:`$\\overline{X}\\sim\\mathcal{N}(500,\\ 2500)$; $z=2$, top $\\approx 2.3\\%$.` }
  ]);

  /* ---------------------------------------------------------------- */
  add("prob-joint-marginal", [
    { q:`<p>Joint table: $P(x_1,y_1)=0.1$, $P(x_1,y_2)=0.2$, $P(x_2,y_1)=0.3$, $P(x_2,y_2)=0.4$. Find $P(X=x_2\\mid Y=y_1)$.</p>`,
      steps:[
        {do:`Marginal of $Y=y_1$: sum the column $0.1+0.3=0.4$.`, why:`Sum out $X$ to get $P(Y=y_1)$.`},
        {do:`$P(x_2\\mid y_1)=\\frac{P(x_2,y_1)}{P(y_1)}=\\frac{0.3}{0.4}$.`, why:`Conditioning divides the joint by the marginal of the given event.`},
        {do:`$=0.75$.`, why:`Evaluate.`}
      ],
      answer:`$0.75$.` },

    { q:`<p>Same table ($0.1,0.2,0.3,0.4$ for $(x_1,y_1),(x_1,y_2),(x_2,y_1),(x_2,y_2)$). Are $X$ and $Y$ independent?</p>`,
      steps:[
        {do:`Marginals: $P(x_1)=0.1+0.2=0.3$, $P(y_1)=0.1+0.3=0.4$.`, why:`Sum out the other variable for each marginal.`},
        {do:`Independence test: check $P(x_1,y_1)=P(x_1)P(y_1)$. Product $=0.3\\times 0.4=0.12$.`, why:`Independence means every joint equals the product of marginals.`},
        {do:`But $P(x_1,y_1)=0.1\\neq 0.12$. Not independent.`, why:`A single mismatch breaks independence.`}
      ],
      answer:`Not independent ($0.1\\neq 0.12$).` },

    { q:`<p>Joint density $f(x,y)=x+y$ on the unit square $0\\le x\\le 1,\\ 0\\le y\\le 1$. Find the marginal $f_X(x)$.</p>`,
      steps:[
        {do:`$f_X(x)=\\int_0^1 (x+y)\\,dy$.`, why:`Integrate out $y$ to get the marginal of $X$.`},
        {do:`$=\\left[xy+\\frac{y^2}{2}\\right]_0^1=x+\\tfrac12$.`, why:`Antiderivative in $y$ of $x+y$ is $xy+\\frac{y^2}{2}$.`},
        {do:`So $f_X(x)=x+\\tfrac12$ for $0\\le x\\le 1$.`, why:`State the marginal.`}
      ],
      answer:`$f_X(x)=x+\\frac12$ on $[0,1]$.` },

    { q:`<p>For $f(x,y)=x+y$ on the unit square, find $P(X\\le \\tfrac12)$ using the marginal $f_X(x)=x+\\tfrac12$.</p>`,
      steps:[
        {do:`$P(X\\le \\tfrac12)=\\int_0^{1/2}\\left(x+\\tfrac12\\right)dx$.`, why:`Integrate the marginal over the region.`},
        {do:`$=\\left[\\frac{x^2}{2}+\\frac{x}{2}\\right]_0^{1/2}=\\frac{(1/2)^2}{2}+\\frac{1/2}{2}=\\frac{1}{8}+\\frac14$.`, why:`Antiderivative is $\\frac{x^2}{2}+\\frac{x}{2}$.`},
        {do:`$=\\frac38$.`, why:`$\\frac18+\\frac28=\\frac38$.`}
      ],
      answer:`$\\frac38$.` },

    { q:`<p>Joint table: $P(x_1,y_1)=0.2$, $P(x_1,y_2)=0.2$, $P(x_2,y_1)=0.2$, $P(x_2,y_2)=0.4$. With $x_1=1,\\ x_2=3$, find $E[X]$.</p>`,
      steps:[
        {do:`Marginal of $X$: $P(x_1)=0.2+0.2=0.4$, $P(x_2)=0.2+0.4=0.6$.`, why:`Sum out $Y$.`},
        {do:`$E[X]=1(0.4)+3(0.6)=0.4+1.8$.`, why:`Weight each value by its marginal probability.`},
        {do:`$=2.2$.`, why:`Add.`}
      ],
      answer:`$E[X]=2.2$.` },

    { q:`<p>From the table $P(x_1,y_1)=0.2,P(x_1,y_2)=0.2,P(x_2,y_1)=0.2,P(x_2,y_2)=0.4$, find the conditional distribution of $Y$ given $X=x_2$.</p>`,
      steps:[
        {do:`$P(x_2)=0.2+0.4=0.6$.`, why:`Marginal of the conditioning event.`},
        {do:`$P(y_1\\mid x_2)=\\frac{0.2}{0.6}=\\tfrac13$, $P(y_2\\mid x_2)=\\frac{0.4}{0.6}=\\tfrac23$.`, why:`Divide each joint in the row by the row total.`},
        {do:`They sum to $\\tfrac13+\\tfrac23=1$.`, why:`A conditional distribution must sum to 1.`}
      ],
      answer:`$P(y_1\\mid x_2)=\\frac13$, $P(y_2\\mid x_2)=\\frac23$.` },

    { q:`<p>$f(x,y)=4xy$ on $0\\le x\\le 1,\\ 0\\le y\\le 1$. Find $f_X(x)$, then check whether $X,Y$ are independent.</p>`,
      steps:[
        {do:`$f_X(x)=\\int_0^1 4xy\\,dy=4x\\cdot\\frac{y^2}{2}\\Big|_0^1=2x$.`, why:`Integrate out $y$.`},
        {do:`By symmetry $f_Y(y)=2y$. Product $f_X(x)f_Y(y)=2x\\cdot 2y=4xy$.`, why:`Compute the product of the marginals.`},
        {do:`This equals $f(x,y)=4xy$, so $X,Y$ ARE independent.`, why:`The joint factors into the product of marginals.`}
      ],
      answer:`$f_X(x)=2x$; independent.` },

    { q:`<p>Joint table: $P(x_1,y_1)=0.1,P(x_1,y_2)=0.4,P(x_2,y_1)=0.3,P(x_2,y_2)=0.2$. Find $P(Y=y_1\\mid X=x_1)$.</p>`,
      steps:[
        {do:`$P(x_1)=0.1+0.4=0.5$.`, why:`Marginal of the given event.`},
        {do:`$P(y_1\\mid x_1)=\\frac{0.1}{0.5}=0.2$.`, why:`Joint over the conditioning marginal.`},
        {do:`So $0.2$.`, why:`Evaluate.`}
      ],
      answer:`$0.2$.` }
  ]);

  /* ---------------------------------------------------------------- */
  add("prob-covariance-correlation", [
    { q:`<p>Data pairs: $(1,2),(2,4),(3,4),(4,6)$. Compute $\\operatorname{Cov}(X,Y)$ using $E[XY]-E[X]E[Y]$.</p>`,
      steps:[
        {do:`$E[X]=\\frac{1+2+3+4}{4}=2.5$, $E[Y]=\\frac{2+4+4+6}{4}=4$.`, why:`Average each variable.`},
        {do:`$E[XY]=\\frac{1\\cdot2+2\\cdot4+3\\cdot4+4\\cdot6}{4}=\\frac{2+8+12+24}{4}=\\frac{46}{4}=11.5$.`, why:`Average the products of the paired values.`},
        {do:`$\\operatorname{Cov}=11.5-(2.5)(4)=11.5-10=1.5$.`, why:`Mean of product minus product of means.`}
      ],
      answer:`$\\operatorname{Cov}(X,Y)=1.5$.` },

    { q:`<p>Using the same data $(1,2),(2,4),(3,4),(4,6)$ with $\\operatorname{Cov}=1.5$, compute the correlation $\\rho$ (population version, divide by $n$).</p>`,
      steps:[
        {do:`$\\operatorname{Var}(X)=E[X^2]-E[X]^2$. $E[X^2]=\\frac{1+4+9+16}{4}=7.5$, so $\\operatorname{Var}(X)=7.5-2.5^2=1.25$.`, why:`Use the shortcut formula for variance.`},
        {do:`$E[Y^2]=\\frac{4+16+16+36}{4}=18$, so $\\operatorname{Var}(Y)=18-4^2=2$.`, why:`Same shortcut for $Y$.`},
        {do:`$\\rho=\\frac{1.5}{\\sqrt{1.25}\\sqrt{2}}=\\frac{1.5}{\\sqrt{2.5}}=\\frac{1.5}{1.581}\\approx 0.949$.`, why:`Divide covariance by the product of standard deviations.`}
      ],
      answer:`$\\rho\\approx 0.949$.` },

    { q:`<p>$\\operatorname{Var}(X)=4$, $\\operatorname{Var}(Y)=9$, $\\operatorname{Cov}(X,Y)=3$. Find $\\operatorname{Var}(X+Y)$.</p>`,
      steps:[
        {do:`$\\operatorname{Var}(X+Y)=\\operatorname{Var}(X)+\\operatorname{Var}(Y)+2\\operatorname{Cov}(X,Y)$.`, why:`Variance of a sum includes twice the covariance.`},
        {do:`$=4+9+2(3)=4+9+6$.`, why:`Plug in the given values.`},
        {do:`$=19$.`, why:`Add.`}
      ],
      answer:`$19$.` },

    { q:`<p>$\\operatorname{Var}(X)=4$, $\\operatorname{Var}(Y)=9$, $\\operatorname{Cov}(X,Y)=3$. Find $\\operatorname{Var}(X-Y)$ and the correlation $\\rho$.</p>`,
      steps:[
        {do:`$\\operatorname{Var}(X-Y)=\\operatorname{Var}(X)+\\operatorname{Var}(Y)-2\\operatorname{Cov}(X,Y)=4+9-6=7$.`, why:`Subtraction flips the sign on the covariance term.`},
        {do:`$\\rho=\\frac{\\operatorname{Cov}}{\\sigma_X\\sigma_Y}=\\frac{3}{\\sqrt4\\sqrt9}=\\frac{3}{2\\cdot3}=\\frac{3}{6}$.`, why:`Standard deviations are $\\sqrt4=2$ and $\\sqrt9=3$.`},
        {do:`$\\rho=0.5$.`, why:`Evaluate.`}
      ],
      answer:`$\\operatorname{Var}(X-Y)=7$, $\\rho=0.5$.` },

    { q:`<p>Let $Y=3X+2$ where $\\operatorname{Var}(X)=5$. Find $\\operatorname{Cov}(X,Y)$ and $\\rho(X,Y)$.</p>`,
      steps:[
        {do:`$\\operatorname{Cov}(X,3X+2)=3\\operatorname{Cov}(X,X)=3\\operatorname{Var}(X)=15$.`, why:`Covariance is linear; the constant $+2$ adds nothing.`},
        {do:`$\\operatorname{Var}(Y)=3^2\\operatorname{Var}(X)=9\\cdot5=45$, so $\\sigma_Y=\\sqrt{45}$, $\\sigma_X=\\sqrt5$.`, why:`Scaling by 3 multiplies variance by $9$.`},
        {do:`$\\rho=\\frac{15}{\\sqrt5\\sqrt{45}}=\\frac{15}{\\sqrt{225}}=\\frac{15}{15}=1$.`, why:`A perfect positive linear relation has $\\rho=1$.`}
      ],
      answer:`$\\operatorname{Cov}=15$, $\\rho=1$.` },

    { q:`<p>$\\rho(X,Y)=0.6$, $\\sigma_X=2$, $\\sigma_Y=5$. Find $\\operatorname{Cov}(X,Y)$.</p>`,
      steps:[
        {do:`Rearrange $\\rho=\\frac{\\operatorname{Cov}}{\\sigma_X\\sigma_Y}$ to $\\operatorname{Cov}=\\rho\\,\\sigma_X\\sigma_Y$.`, why:`Solve the correlation definition for covariance.`},
        {do:`$=0.6\\times 2\\times 5=6$.`, why:`Multiply.`}
      ],
      answer:`$\\operatorname{Cov}(X,Y)=6$.` },

    { q:`<p>$X,Y$ are independent. Explain why $\\operatorname{Cov}(X,Y)=0$, and whether $\\rho=0$ implies independence.</p>`,
      steps:[
        {do:`Independence gives $E[XY]=E[X]E[Y]$, so $\\operatorname{Cov}=E[XY]-E[X]E[Y]=0$.`, why:`For independent variables the mean of the product factors.`},
        {do:`Thus $\\rho=\\frac{0}{\\sigma_X\\sigma_Y}=0$.`, why:`Zero covariance forces zero correlation.`},
        {do:`But the converse fails: $\\rho=0$ only rules out a <b>linear</b> link, not all dependence.`, why:`Variables can be dependent through a nonlinear relation yet have $\\rho=0$.`}
      ],
      answer:`$\\operatorname{Cov}=0$; but $\\rho=0$ does NOT imply independence.` },

    { q:`<p>Three pairs: $(0,1),(2,1),(4,1)$. Compute $\\operatorname{Cov}(X,Y)$ and explain the result.</p>`,
      steps:[
        {do:`$Y$ is constant at 1, so $E[Y]=1$ and every $Y-E[Y]=0$.`, why:`A constant has no spread.`},
        {do:`$\\operatorname{Cov}(X,Y)=E[(X-E[X])(Y-E[Y])]=E[(X-E[X])\\cdot 0]=0$.`, why:`Multiplying by the zero deviation of $Y$ kills the covariance.`},
        {do:`So $\\operatorname{Cov}=0$: a constant cannot covary with anything.`, why:`State the conclusion.`}
      ],
      answer:`$\\operatorname{Cov}(X,Y)=0$.` }
  ]);

  /* ---------------------------------------------------------------- */
  add("prob-conditional-expectation", [
    { q:`<p>A coin is fair. If heads, you draw $X$ with mean 4; if tails, $X$ has mean 10. Find $E[X]$ via the law of iterated expectations.</p>`,
      steps:[
        {do:`$E[X]=P(H)E[X\\mid H]+P(T)E[X\\mid T]$.`, why:`Average the group means, weighted by group probability.`},
        {do:`$=0.5(4)+0.5(10)=2+5$.`, why:`Plug in the equal $0.5$ weights.`},
        {do:`$=7$.`, why:`Add.`}
      ],
      answer:`$E[X]=7$.` },

    { q:`<p>$N$ items arrive with $E[N]=5$. Each item has an independent value with mean 3. Find $E\\left[\\sum_{i=1}^N V_i\\right]$.</p>`,
      steps:[
        {do:`Condition on $N$: $E\\left[\\sum_{i=1}^N V_i \\mid N\\right]=N\\cdot E[V]=3N$.`, why:`Given $N$, the sum of $N$ values averages $N$ times the per-item mean.`},
        {do:`Take the outer expectation: $E[3N]=3E[N]=3\\times 5$.`, why:`Law of iterated expectations, then linearity.`},
        {do:`$=15$.`, why:`Multiply.`}
      ],
      answer:`$15$.` },

    { q:`<p>Roll a fair die; let $Y$ be the result. Then draw $X$ uniformly from $\\{1,\\dots,Y\\}$, so $E[X\\mid Y]=\\frac{Y+1}{2}$. Find $E[X]$.</p>`,
      steps:[
        {do:`$E[X]=E\\big[E[X\\mid Y]\\big]=E\\left[\\frac{Y+1}{2}\\right]$.`, why:`Use the law of iterated expectations.`},
        {do:`$=\\frac{E[Y]+1}{2}$, and $E[Y]=3.5$ for a fair die.`, why:`Linearity pulls the expectation inside.`},
        {do:`$=\\frac{3.5+1}{2}=\\frac{4.5}{2}=2.25$.`, why:`Evaluate.`}
      ],
      answer:`$E[X]=2.25$.` },

    { q:`<p>Group A (30% of items) averages 8; group B (70%) averages 13. Find the overall mean.</p>`,
      steps:[
        {do:`$E[X]=0.3(8)+0.7(13)$.`, why:`Weight each conditional mean by group size.`},
        {do:`$=2.4+9.1$.`, why:`Multiply each term.`},
        {do:`$=11.5$.`, why:`Add.`}
      ],
      answer:`$11.5$.` },

    { q:`<p>$E[X\\mid Y=0]=2$, $E[X\\mid Y=1]=6$, and $Y$ is Bernoulli with $p=0.25$. Find $E[X]$.</p>`,
      steps:[
        {do:`$E[X]=P(Y=0)E[X\\mid Y=0]+P(Y=1)E[X\\mid Y=1]$.`, why:`Iterated expectation over the two values of $Y$.`},
        {do:`$=0.75(2)+0.25(6)=1.5+1.5$.`, why:`$P(Y=0)=0.75$, $P(Y=1)=0.25$.`},
        {do:`$=3$.`, why:`Add.`}
      ],
      answer:`$E[X]=3$.` },

    { q:`<p>The number of eggs $N$ a hen lays is Poisson with mean 6. Each egg hatches independently with probability $0.5$. Find the expected number of chicks.</p>`,
      steps:[
        {do:`Condition on $N$: given $N$ eggs, expected chicks $=0.5N$.`, why:`Each egg hatches with chance $0.5$; the expected count of hatches is $0.5N$.`},
        {do:`$E[\\text{chicks}]=E[0.5N]=0.5E[N]=0.5\\times 6$.`, why:`Iterated expectation then linearity; $E[N]=6$.`},
        {do:`$=3$.`, why:`Multiply.`}
      ],
      answer:`$3$ chicks.` },

    { q:`<p>$X\\mid Y=y$ has mean $2y$. $Y$ is uniform on $\\{1,2,3\\}$. Find $E[X]$.</p>`,
      steps:[
        {do:`$E[X]=E[E[X\\mid Y]]=E[2Y]=2E[Y]$.`, why:`Apply iterated expectations and linearity.`},
        {do:`$E[Y]=\\frac{1+2+3}{3}=2$.`, why:`Average the three equally likely values.`},
        {do:`$E[X]=2\\times 2=4$.`, why:`Multiply.`}
      ],
      answer:`$E[X]=4$.` },

    { q:`<p>A student is from school A (mean score 70) with prob 0.4, school B (mean 80) with 0.35, or school C (mean 90) with 0.25. Find the expected score.</p>`,
      steps:[
        {do:`$E[X]=0.4(70)+0.35(80)+0.25(90)$.`, why:`Weight each school's mean by its probability (law of total/iterated expectation).`},
        {do:`$=28+28+22.5$.`, why:`Compute each product.`},
        {do:`$=78.5$.`, why:`Add.`}
      ],
      answer:`$78.5$.` }
  ]);

  /* ---------------------------------------------------------------- */
  add("prob-inequalities", [
    { q:`<p>$X\\ge 0$ has mean $E[X]=20$. Bound $P(X\\ge 50)$ by Markov.</p>`,
      steps:[
        {do:`Markov: $P(X\\ge a)\\le \\frac{E[X]}{a}$.`, why:`A small mean limits how often a nonnegative variable is large.`},
        {do:`$=\\frac{20}{50}=0.4$.`, why:`Plug $E[X]=20$, $a=50$.`}
      ],
      answer:`$P(X\\ge 50)\\le 0.4$.` },

    { q:`<p>$X$ has $\\mu=100$, $\\sigma=10$. Bound $P(|X-100|\\ge 25)$ by Chebyshev, and compare to the exact value if $X$ were Normal.</p>`,
      steps:[
        {do:`Chebyshev: $P(|X-\\mu|\\ge \\epsilon)\\le \\frac{\\sigma^2}{\\epsilon^2}=\\frac{100}{25^2}=\\frac{100}{625}$.`, why:`$\\sigma^2=100$, $\\epsilon=25$.`},
        {do:`$=0.16$.`, why:`Evaluate the bound.`},
        {do:`If Normal, $25=2.5\\sigma$, so the exact tail is $\\approx 0.012$ — far below the $0.16$ bound.`, why:`Chebyshev is loose; it must hold for ANY distribution, so it is conservative.`}
      ],
      answer:`Chebyshev $\\le 0.16$; Normal exact $\\approx 0.012$.` },

    { q:`<p>$X$ has $\\mu=50$, $\\sigma^2=16$. Using Chebyshev, give a lower bound on $P(42&lt;X&lt;58)$.</p>`,
      steps:[
        {do:`The interval is $\\mu\\pm 8$, so $\\epsilon=8$, i.e. $k=\\frac{\\epsilon}{\\sigma}=\\frac{8}{4}=2$ standard deviations.`, why:`$\\sigma=\\sqrt{16}=4$.`},
        {do:`Chebyshev: $P(|X-\\mu|\\ge 8)\\le \\frac{1}{k^2}=\\frac14=0.25$.`, why:`Bound the chance of being far out.`},
        {do:`So $P(42&lt;X&lt;58)\\ge 1-0.25=0.75$.`, why:`The complement of "far from mean" is "close to mean".`}
      ],
      answer:`$P(42&lt;X&lt;58)\\ge 0.75$.` },

    { q:`<p>Exam scores are nonnegative with mean 60. Markov says at most what fraction score $\\ge 90$? Then sharpen it if you also know $\\sigma=10$ via Chebyshev.</p>`,
      steps:[
        {do:`Markov: $P(X\\ge 90)\\le \\frac{60}{90}=\\frac23\\approx 0.667$.`, why:`Uses the mean only.`},
        {do:`Chebyshev about the mean: $90$ is $\\frac{90-60}{10}=3$ std devs up. $P(|X-60|\\ge 30)\\le \\frac{1}{3^2}=\\frac19\\approx 0.111$.`, why:`The variance gives a much tighter two-sided bound.`},
        {do:`So $P(X\\ge 90)\\le 0.111$ — far tighter than Markov's $0.667$.`, why:`Knowing the variance sharpens the bound.`}
      ],
      answer:`Markov $\\le 0.667$; Chebyshev $\\le 0.111$.` },

    { q:`<p>$X\\ge 0$ with $E[X]=4$ and $E[X^2]=25$. Use Markov on $X^2$ to bound $P(X\\ge 10)$.</p>`,
      steps:[
        {do:`$P(X\\ge 10)=P(X^2\\ge 100)$ since $X\\ge 0$.`, why:`Squaring is monotone for nonnegative $X$.`},
        {do:`Markov on $X^2$: $P(X^2\\ge 100)\\le \\frac{E[X^2]}{100}=\\frac{25}{100}$.`, why:`Apply Markov to the nonnegative variable $X^2$.`},
        {do:`$=0.25$, tighter than plain Markov's $\\frac{4}{10}=0.4$.`, why:`Using the second moment sharpens the bound.`}
      ],
      answer:`$P(X\\ge 10)\\le 0.25$.` },

    { q:`<p>How many standard deviations $k$ must you go so Chebyshev guarantees at least $96\\%$ of values fall within $\\mu\\pm k\\sigma$?</p>`,
      steps:[
        {do:`Chebyshev: $P(|X-\\mu|\\ge k\\sigma)\\le \\frac{1}{k^2}$, so coverage $\\ge 1-\\frac{1}{k^2}$.`, why:`The within-band fraction is one minus the tail bound.`},
        {do:`Set $1-\\frac{1}{k^2}\\ge 0.96\\Rightarrow \\frac{1}{k^2}\\le 0.04\\Rightarrow k^2\\ge 25$.`, why:`Solve the inequality for $k^2$.`},
        {do:`$k\\ge 5$.`, why:`Take the square root.`}
      ],
      answer:`$k=5$ standard deviations.` },

    { q:`<p>$X$ has mean 0 and variance 1. Bound $P(|X|\\ge 4)$, and state why Markov cannot be applied directly here.</p>`,
      steps:[
        {do:`Markov needs $X\\ge 0$; here $X$ can be negative, so apply Chebyshev instead.`, why:`Markov's nonnegativity assumption fails.`},
        {do:`Chebyshev: $P(|X-0|\\ge 4)\\le \\frac{\\sigma^2}{4^2}=\\frac{1}{16}$.`, why:`$\\mu=0$, $\\sigma^2=1$, $\\epsilon=4$.`},
        {do:`$=0.0625$.`, why:`Evaluate.`}
      ],
      answer:`$P(|X|\\ge 4)\\le 0.0625$.` },

    { q:`<p>Markov gives $P(X\\ge a)\\le \\frac{E[X]}{a}$. For nonnegative $X$ with mean 5, find the smallest threshold $a$ guaranteeing $P(X\\ge a)\\le 0.1$.</p>`,
      steps:[
        {do:`Set $\\frac{E[X]}{a}=\\frac{5}{a}\\le 0.1$.`, why:`Force the Markov bound down to $0.1$.`},
        {do:`$a\\ge \\frac{5}{0.1}=50$.`, why:`Solve for $a$.`},
        {do:`Smallest such $a$ is $50$.`, why:`State the threshold.`}
      ],
      answer:`$a=50$.` }
  ]);

  /* ---------------------------------------------------------------- */
  add("prob-lln", [
    { q:`<p>You average $n=400$ independent samples from a distribution with $\\sigma=20$. What is the standard deviation of the sample mean $\\overline{X}$?</p>`,
      steps:[
        {do:`$\\operatorname{Var}(\\overline X)=\\frac{\\sigma^2}{n}$, so $\\operatorname{SD}(\\overline X)=\\frac{\\sigma}{\\sqrt n}$.`, why:`Averaging divides variance by $n$.`},
        {do:`$=\\frac{20}{\\sqrt{400}}=\\frac{20}{20}=1$.`, why:`$\\sqrt{400}=20$.`}
      ],
      answer:`$\\operatorname{SD}(\\overline X)=1$.` },

    { q:`<p>To halve the standard error $\\frac{\\sigma}{\\sqrt n}$ of a sample mean, by what factor must you increase $n$?</p>`,
      steps:[
        {do:`Standard error scales as $\\frac{1}{\\sqrt n}$.`, why:`More data shrinks the spread of the average like $1/\\sqrt n$.`},
        {do:`Halving means $\\frac{1}{\\sqrt{n'}}=\\frac12\\cdot\\frac{1}{\\sqrt n}\\Rightarrow \\sqrt{n'}=2\\sqrt n$.`, why:`Set the new error to half the old.`},
        {do:`$n'=4n$: you need 4 times as many samples.`, why:`Square both sides.`}
      ],
      answer:`$4\\times$ the samples.` },

    { q:`<p>A fair die has true mean $3.5$ and variance $\\sigma^2=\\frac{35}{12}\\approx 2.917$. Use Chebyshev to bound $P(|\\overline X-3.5|\\ge 0.5)$ for $n=100$ rolls.</p>`,
      steps:[
        {do:`$\\operatorname{Var}(\\overline X)=\\frac{\\sigma^2}{n}=\\frac{2.917}{100}=0.02917$.`, why:`Variance of the average shrinks with $n$.`},
        {do:`Chebyshev: $P(|\\overline X-\\mu|\\ge \\epsilon)\\le \\frac{\\operatorname{Var}(\\overline X)}{\\epsilon^2}=\\frac{0.02917}{0.25}$.`, why:`Apply Chebyshev to the average with $\\epsilon=0.5$.`},
        {do:`$\\approx 0.117$.`, why:`Evaluate; this is how the LLN's convergence is proven.`}
      ],
      answer:`$\\le 0.117$.` },

    { q:`<p>How many rolls $n$ guarantee, by Chebyshev, that $P(|\\overline X-3.5|\\ge 0.1)\\le 0.05$? Use $\\sigma^2\\approx 2.917$.</p>`,
      steps:[
        {do:`Chebyshev: $P(|\\overline X-\\mu|\\ge\\epsilon)\\le \\frac{\\sigma^2}{n\\epsilon^2}$. Set $\\frac{2.917}{n(0.1)^2}\\le 0.05$.`, why:`Bound the average's deviation and force it below $0.05$.`},
        {do:`$\\frac{2.917}{0.01 n}\\le 0.05\\Rightarrow n\\ge \\frac{2.917}{0.01\\times 0.05}=\\frac{2.917}{0.0005}$.`, why:`Rearrange for $n$.`},
        {do:`$n\\ge 5834$.`, why:`Evaluate; round up.`}
      ],
      answer:`$n\\ge 5834$.` },

    { q:`<p>Coin flips have $p=0.5$, so $\\sigma^2=p(1-p)=0.25$. For $n=2500$ flips, what is the standard error of the sample proportion?</p>`,
      steps:[
        {do:`Standard error $=\\sqrt{\\frac{p(1-p)}{n}}=\\sqrt{\\frac{0.25}{2500}}$.`, why:`The proportion is a sample mean of 0/1 values.`},
        {do:`$=\\sqrt{0.0001}=0.01$.`, why:`$0.25/2500=0.0001$.`}
      ],
      answer:`$0.01$.` },

    { q:`<p>Two estimators of the mean: $\\overline X$ from $n=100$ samples vs. $\\overline X$ from $n=900$ samples, same $\\sigma$. How do their standard errors compare?</p>`,
      steps:[
        {do:`Standard error $\\propto \\frac{1}{\\sqrt n}$.`, why:`Larger samples give tighter averages.`},
        {do:`Ratio $=\\frac{1/\\sqrt{100}}{1/\\sqrt{900}}=\\frac{\\sqrt{900}}{\\sqrt{100}}=\\frac{30}{10}=3$.`, why:`Compare the two $1/\\sqrt n$ factors.`},
        {do:`The $n=100$ estimator's error is 3 times larger.`, why:`State the comparison.`}
      ],
      answer:`The $n=100$ error is $3\\times$ larger.` },

    { q:`<p>A simulation estimates a probability by averaging an indicator with variance $\\le 0.25$. With $n=10000$ trials, bound the standard error of $\\overline X$.</p>`,
      steps:[
        {do:`$\\operatorname{SD}(\\overline X)=\\frac{\\sigma}{\\sqrt n}\\le \\frac{\\sqrt{0.25}}{\\sqrt{10000}}=\\frac{0.5}{100}$.`, why:`Use the worst-case variance bound $0.25$.`},
        {do:`$=0.005$.`, why:`Evaluate.`},
        {do:`So the estimate is good to about $\\pm 0.005$ (1 standard error).`, why:`Interpret the standard error.`}
      ],
      answer:`$\\le 0.005$.` },

    { q:`<p>Explain in formula terms why the LLN says $\\overline X\\to\\mu$: what happens to $\\operatorname{Var}(\\overline X)$ as $n\\to\\infty$?</p>`,
      steps:[
        {do:`$\\operatorname{Var}(\\overline X)=\\frac{\\sigma^2}{n}$.`, why:`Variance of the average shrinks with sample size.`},
        {do:`As $n\\to\\infty$, $\\frac{\\sigma^2}{n}\\to 0$.`, why:`A fixed numerator over a growing denominator vanishes.`},
        {do:`Zero variance about $\\mu$ means $\\overline X$ concentrates on $\\mu$ — that is the LLN.`, why:`By Chebyshev, vanishing variance forces convergence to the mean.`}
      ],
      answer:`$\\operatorname{Var}(\\overline X)=\\frac{\\sigma^2}{n}\\to 0$, so $\\overline X\\to\\mu$.` }
  ]);

  /* ---------------------------------------------------------------- */
  add("prob-clt", [
    { q:`<p>Samples have $\\mu=10$, $\\sigma^2=36$. For $n=9$, give the distribution of $\\overline X$ and its standard deviation.</p>`,
      steps:[
        {do:`By the CLT, $\\overline X\\approx\\mathcal{N}\\!\\left(\\mu,\\ \\frac{\\sigma^2}{n}\\right)=\\mathcal{N}\\!\\left(10,\\ \\frac{36}{9}\\right)$.`, why:`The average is centered at $\\mu$ with variance $\\sigma^2/n$.`},
        {do:`$\\frac{36}{9}=4$, so $\\overline X\\approx\\mathcal{N}(10,4)$.`, why:`Evaluate the variance.`},
        {do:`$\\operatorname{SD}(\\overline X)=\\sqrt4=2$.`, why:`Square root of the variance.`}
      ],
      answer:`$\\overline X\\approx\\mathcal{N}(10,4)$, SD $=2$.` },

    { q:`<p>Samples have $\\mu=10$, $\\sigma=6$, $n=9$ (so $\\operatorname{SD}(\\overline X)=2$). Use the 68-95-99.7 rule to find $P(\\overline X&gt;14)$.</p>`,
      steps:[
        {do:`$14$ is $\\frac{14-10}{2}=2$ standard deviations above the mean of $\\overline X$.`, why:`Standardize using the average's spread of 2.`},
        {do:`About $95\\%$ of $\\overline X$ lies within $\\pm 2$ SD, leaving $\\approx 2.5\\%$ in the upper tail.`, why:`68-95-99.7 rule for the upper tail beyond $+2\\sigma$.`},
        {do:`$P(\\overline X&gt;14)\\approx 0.025$.`, why:`State the tail probability.`}
      ],
      answer:`$\\approx 0.025$.` },

    { q:`<p>A die roll has $\\mu=3.5$, $\\sigma^2\\approx 2.92$. For the <b>sum</b> (not average) of $n=100$ rolls, give the approximate distribution.</p>`,
      steps:[
        {do:`Sum $S=\\sum X_i$ has mean $n\\mu=100\\times 3.5=350$.`, why:`Means add over the 100 rolls.`},
        {do:`Variance of the sum is $n\\sigma^2=100\\times 2.92=292$.`, why:`Independent variances add for a sum (not divided by $n$).`},
        {do:`By the CLT, $S\\approx\\mathcal{N}(350,\\ 292)$, with SD $\\sqrt{292}\\approx 17.1$.`, why:`The CLT applies to sums as well as averages.`}
      ],
      answer:`$S\\approx\\mathcal{N}(350,\\ 292)$.` },

    { q:`<p>A factory part has weight mean 50 g, SD 4 g. A box holds $n=64$ parts. Approximate $P(\\overline X&lt;49)$ for the average part weight.</p>`,
      steps:[
        {do:`$\\operatorname{SD}(\\overline X)=\\frac{\\sigma}{\\sqrt n}=\\frac{4}{\\sqrt{64}}=\\frac48=0.5$.`, why:`Standard error of the average.`},
        {do:`$49$ is $\\frac{49-50}{0.5}=-2$ SD below the mean.`, why:`Standardize.`},
        {do:`Lower tail beyond $-2$ SD is $\\approx 2.5\\%$, so $P(\\overline X&lt;49)\\approx 0.025$.`, why:`68-95-99.7 rule, lower tail.`}
      ],
      answer:`$\\approx 0.025$.` },

    { q:`<p>Bernoulli trials with $p=0.5$, $n=100$. The count of successes $S$ has mean $50$ and variance $np(1-p)=25$. Approximate $P(S&gt;60)$.</p>`,
      steps:[
        {do:`$\\operatorname{SD}(S)=\\sqrt{25}=5$. Standardize: $\\frac{60-50}{5}=2$.`, why:`The CLT makes the binomial count approximately Normal.`},
        {do:`$60$ is $2$ SD above the mean, so the upper tail is $\\approx 2.5\\%$.`, why:`68-95-99.7 rule.`},
        {do:`$P(S&gt;60)\\approx 0.025$.`, why:`State the result (a Normal approximation to the binomial).`}
      ],
      answer:`$\\approx 0.025$.` },

    { q:`<p>You want the average of $n$ samples ($\\sigma=10$) to have standard error $\\le 1$. What is the smallest $n$?</p>`,
      steps:[
        {do:`Standard error $=\\frac{\\sigma}{\\sqrt n}=\\frac{10}{\\sqrt n}\\le 1$.`, why:`The CLT spread of the average must be at most 1.`},
        {do:`$\\sqrt n\\ge 10\\Rightarrow n\\ge 100$.`, why:`Solve for $n$.`},
        {do:`Smallest $n=100$.`, why:`State the answer.`}
      ],
      answer:`$n=100$.` },

    { q:`<p>$\\overline X\\approx\\mathcal{N}(\\mu,\\ \\sigma^2/n)$ with $\\mu=20$, $\\sigma=5$, $n=25$. Give a symmetric interval that holds about $95\\%$ of sample means.</p>`,
      steps:[
        {do:`$\\operatorname{SD}(\\overline X)=\\frac{5}{\\sqrt{25}}=1$.`, why:`Standard error of the average.`},
        {do:`$95\\%$ lies within $\\mu\\pm 2\\,\\operatorname{SD}=20\\pm 2(1)$.`, why:`The 68-95-99.7 rule gives $\\pm 2\\sigma$ for $\\approx 95\\%$.`},
        {do:`Interval $[18,\\ 22]$.`, why:`Evaluate the endpoints.`}
      ],
      answer:`$[18,\\ 22]$.` },

    { q:`<p>Why does the CLT need <b>independent</b> samples? Show what happens to $\\operatorname{Var}(\\overline X)$ if all $n$ samples were identical copies.</p>`,
      steps:[
        {do:`If samples are independent, $\\operatorname{Var}(\\overline X)=\\frac{\\sigma^2}{n}$, shrinking with $n$.`, why:`Independent variances add, then dividing by $n^2$ leaves $\\sigma^2/n$.`},
        {do:`If all $n$ are the same value $X$, then $\\overline X=X$ and $\\operatorname{Var}(\\overline X)=\\sigma^2$.`, why:`Copies carry no new information; the average equals the single value.`},
        {do:`The variance does NOT shrink, so no concentration and no bell narrowing — independence is essential.`, why:`State the conclusion.`}
      ],
      answer:`Independence gives $\\sigma^2/n$; identical copies leave it at $\\sigma^2$.` }
  ]);

  /* ---------------------------------------------------------------- */
  add("prob-estimation", [
    { q:`<p>Data: $\\{4,8,9,11\\}$. Compute the sample mean $\\overline X$ and sample variance $s^2$ (divide by $n-1$).</p>`,
      steps:[
        {do:`$\\overline X=\\frac{4+8+9+11}{4}=\\frac{32}{4}=8$.`, why:`Average the four values.`},
        {do:`Squared deviations: $(4-8)^2=16,(8-8)^2=0,(9-8)^2=1,(11-8)^2=9$; sum $=26$.`, why:`Measure spread around the sample mean.`},
        {do:`$s^2=\\frac{26}{n-1}=\\frac{26}{3}\\approx 8.67$.`, why:`Divide by $n-1=3$ for an unbiased estimate.`}
      ],
      answer:`$\\overline X=8$, $s^2=\\frac{26}{3}\\approx 8.67$.` },

    { q:`<p>For $\\{4,8,9,11\\}$ (sum of squared deviations $=26$), you wrongly divided by $n=4$ instead of $n-1$. By what factor is the unbiased $s^2$ larger?</p>`,
      steps:[
        {do:`Biased: $\\frac{26}{4}=6.5$. Unbiased: $\\frac{26}{3}\\approx 8.67$.`, why:`The two divisors differ.`},
        {do:`Ratio $=\\frac{26/3}{26/4}=\\frac{4}{3}\\approx 1.333$.`, why:`The sum-of-squares cancels, leaving $\\frac{n}{n-1}$.`},
        {do:`So unbiased is $\\frac43$ times the biased version.`, why:`State the factor.`}
      ],
      answer:`Factor $\\frac{4}{3}\\approx 1.333$.` },

    { q:`<p>An estimator $\\hat\\theta$ has $E[\\hat\\theta]=\\theta+\\frac{3}{n}$. Is it biased? What is its bias, and what happens as $n\\to\\infty$?</p>`,
      steps:[
        {do:`Bias $=E[\\hat\\theta]-\\theta=\\frac{3}{n}$.`, why:`Bias is the average error.`},
        {do:`Since $\\frac3n\\neq 0$ for finite $n$, it is biased.`, why:`Nonzero bias means biased.`},
        {do:`As $n\\to\\infty$, $\\frac3n\\to 0$, so it is asymptotically unbiased.`, why:`The bias vanishes with more data.`}
      ],
      answer:`Biased by $\\frac3n$; unbiased as $n\\to\\infty$.` },

    { q:`<p>The sample mean of $n$ samples has $\\operatorname{Var}(\\overline X)=\\frac{\\sigma^2}{n}$. If $\\sigma^2=12$ and you want $\\operatorname{Var}(\\overline X)\\le 0.5$, find the smallest $n$.</p>`,
      steps:[
        {do:`Set $\\frac{12}{n}\\le 0.5$.`, why:`Force the estimator's variance below the target.`},
        {do:`$n\\ge \\frac{12}{0.5}=24$.`, why:`Solve for $n$.`},
        {do:`Smallest $n=24$.`, why:`State the answer.`}
      ],
      answer:`$n=24$.` },

    { q:`<p>Estimator A is unbiased with variance 9. Estimator B has bias 1 and variance 4. Compare by mean squared error (MSE $=$ bias$^2+$variance).</p>`,
      steps:[
        {do:`$\\text{MSE}_A=0^2+9=9$.`, why:`Unbiased, so only variance contributes.`},
        {do:`$\\text{MSE}_B=1^2+4=5$.`, why:`Bias squared plus variance.`},
        {do:`B has lower MSE ($5&lt;9$), so the slightly biased estimator is better overall.`, why:`MSE trades off bias and variance; lower wins.`}
      ],
      answer:`$\\text{MSE}_A=9$, $\\text{MSE}_B=5$; B is better.` },

    { q:`<p>Data $\\{2,2,2,2\\}$. Compute the sample variance $s^2$ and explain the value.</p>`,
      steps:[
        {do:`$\\overline X=2$. Every deviation $(2-2)^2=0$, sum $=0$.`, why:`All points equal the mean.`},
        {do:`$s^2=\\frac{0}{n-1}=\\frac{0}{3}=0$.`, why:`No spread means zero estimated variance.`},
        {do:`The data has no variation, so the variance estimate is exactly 0.`, why:`Interpret the result.`}
      ],
      answer:`$s^2=0$.` },

    { q:`<p>A coin is flipped $n=200$ times, giving 130 heads. Estimate $p$ and the standard error of $\\hat p$.</p>`,
      steps:[
        {do:`$\\hat p=\\frac{130}{200}=0.65$.`, why:`The sample proportion estimates the success probability.`},
        {do:`Standard error $=\\sqrt{\\frac{\\hat p(1-\\hat p)}{n}}=\\sqrt{\\frac{0.65\\times 0.35}{200}}=\\sqrt{\\frac{0.2275}{200}}$.`, why:`Plug into the proportion standard-error formula.`},
        {do:`$=\\sqrt{0.0011375}\\approx 0.0337$.`, why:`Evaluate.`}
      ],
      answer:`$\\hat p=0.65$, SE $\\approx 0.034$.` },

    { q:`<p>Show that the sample mean $\\overline X=\\frac1n\\sum X_i$ is an unbiased estimator of $\\mu$ (i.e. $E[\\overline X]=\\mu$).</p>`,
      steps:[
        {do:`$E[\\overline X]=E\\left[\\frac1n\\sum_{i=1}^n X_i\\right]=\\frac1n\\sum_{i=1}^n E[X_i]$.`, why:`Expectation is linear, so it passes inside the sum.`},
        {do:`Each $E[X_i]=\\mu$, so the sum is $\\frac1n(n\\mu)$.`, why:`All samples share the same mean $\\mu$.`},
        {do:`$=\\mu$, so bias $=E[\\overline X]-\\mu=0$.`, why:`The sample mean is unbiased.`}
      ],
      answer:`$E[\\overline X]=\\mu$, bias $=0$.` }
  ]);

})();
