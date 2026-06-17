/* =====================================================================
   PRACTICE PROBLEMS — MODULE 1 (PROBABILITY), part B.
   10 problems per lesson id, easy -> hard.
   Notation matches lessons/01-probability.js exactly.
   ===================================================================== */
(function(){ Object.assign(window.PRACTICE, {

  /* ---------------------------------------------------------------- */
  "prob-geometric-poisson": [
    { q:`<p>A Poisson process averages $\\lambda=4$ events per hour. What is the expected number of events in one hour?</p>`,
      steps:[
        {do:`For a Poisson distribution, $E[X]=\\lambda$.`, why:`The mean of a Poisson count is just its rate $\\lambda$.`},
        {do:`Here $\\lambda=4$, so $E[X]=4$.`, why:`Plug the given rate straight in.`}
      ],
      answer:`$E[X]=4$ events.` },

    { q:`<p>You roll a die until the first six, with $p=\\frac{1}{6}$. What is the expected number of rolls?</p>`,
      steps:[
        {do:`Geometric mean is $E[X]=\\frac{1}{p}$.`, why:`Rarer success means a longer expected wait.`},
        {do:`$E[X]=\\frac{1}{1/6}=6$.`, why:`Dividing 1 by $\\frac{1}{6}$ gives 6.`}
      ],
      answer:`$6$ rolls.` },

    { q:`<p>A Poisson with $\\lambda=2$ calls per minute. What is the chance of exactly 0 calls in a minute?</p>`,
      steps:[
        {do:`Use $P(X=k)=\\frac{\\lambda^k e^{-\\lambda}}{k!}$ with $k=0$.`, why:`We want the probability of the count being zero.`},
        {do:`$P(X=0)=\\frac{2^0 e^{-2}}{0!}=\\frac{1\\times e^{-2}}{1}=e^{-2}$.`, why:`$2^0=1$ and $0!=1$, so only $e^{-2}$ remains.`},
        {do:`$e^{-2}\\approx 0.135$.`, why:`Evaluate the constant.`}
      ],
      answer:`$e^{-2}\\approx 0.135$.` },

    { q:`<p>A coin has success probability $p=0.5$. What is the chance the first success is on trial 2?</p>`,
      steps:[
        {do:`Use Geometric $P(X=k)=(1-p)^{k-1}p$ with $k=2$.`, why:`We need 1 failure, then 1 success.`},
        {do:`$P(X=2)=(1-0.5)^{1}\\times 0.5=0.5\\times 0.5=0.25$.`, why:`One failure has chance $0.5$, then success $0.5$.`}
      ],
      answer:`$0.25$.` },

    { q:`<p>A Poisson with $\\lambda=3$. What is the chance of exactly 1 event?</p>`,
      steps:[
        {do:`Use $P(X=k)=\\frac{\\lambda^k e^{-\\lambda}}{k!}$ with $k=1$.`, why:`We want exactly one event.`},
        {do:`$P(X=1)=\\frac{3^1 e^{-3}}{1!}=3e^{-3}$.`, why:`$3^1=3$ and $1!=1$.`},
        {do:`$3\\times e^{-3}\\approx 3\\times 0.0498=0.149$.`, why:`Multiply by the constant $e^{-3}\\approx 0.0498$.`}
      ],
      answer:`$3e^{-3}\\approx 0.149$.` },

    { q:`<p>Roll a die until the first six ($p=\\frac{1}{6}$). What is the chance the first six lands on roll 3?</p>`,
      steps:[
        {do:`Use $P(X=k)=(1-p)^{k-1}p$ with $k=3$.`, why:`Fail twice, then succeed once.`},
        {do:`$P(X=3)=\\left(\\frac{5}{6}\\right)^{2}\\times\\frac{1}{6}=\\frac{25}{36}\\times\\frac{1}{6}$.`, why:`$(1-\\frac{1}{6})=\\frac{5}{6}$, squared for two failures.`},
        {do:`$=\\frac{25}{216}\\approx 0.116$.`, why:`Multiply the fractions.`}
      ],
      answer:`$\\frac{25}{216}\\approx 0.116$.` },

    { q:`<p>A Poisson with $\\lambda=1$. What is the chance of at least 1 event?</p>`,
      steps:[
        {do:`Use the complement: $P(X\\ge 1)=1-P(X=0)$.`, why:`"At least 1" is everything except 0.`},
        {do:`$P(X=0)=\\frac{1^0 e^{-1}}{0!}=e^{-1}\\approx 0.368$.`, why:`Plug $k=0$ into the Poisson formula.`},
        {do:`$P(X\\ge 1)=1-0.368=0.632$.`, why:`Subtract from 1.`}
      ],
      answer:`About $0.632$.` },

    { q:`<p>A free-throw shooter makes each shot with $p=0.4$. What is the expected number of attempts until the first make?</p>`,
      steps:[
        {do:`Geometric mean $E[X]=\\frac{1}{p}$.`, why:`Counting trials until first success.`},
        {do:`$E[X]=\\frac{1}{0.4}=2.5$.`, why:`Divide 1 by $0.4$.`}
      ],
      answer:`$2.5$ attempts.` },

    { q:`<p>A Poisson with $\\lambda=2$. What is the chance of exactly 2 events?</p>`,
      steps:[
        {do:`Use $P(X=k)=\\frac{\\lambda^k e^{-\\lambda}}{k!}$ with $k=2$.`, why:`We want exactly two events.`},
        {do:`$P(X=2)=\\frac{2^2 e^{-2}}{2!}=\\frac{4e^{-2}}{2}=2e^{-2}$.`, why:`$2^2=4$, $2!=2$, so $\\frac{4}{2}=2$.`},
        {do:`$2\\times e^{-2}\\approx 2\\times 0.135=0.271$.`, why:`Multiply by the constant.`}
      ],
      answer:`$2e^{-2}\\approx 0.271$.` },

    { q:`<p>A web server gets $\\lambda=5$ requests per second. What is the chance the next 2 seconds see exactly 0 requests?</p>`,
      steps:[
        {do:`Over 2 seconds the rate scales: new mean $=5\\times 2=10$.`, why:`Poisson rates add over a longer window.`},
        {do:`Use $P(X=0)=\\frac{10^0 e^{-10}}{0!}=e^{-10}$.`, why:`Plug $k=0$ with the window mean 10.`},
        {do:`$e^{-10}\\approx 0.0000454$.`, why:`Evaluate; a quiet 2 seconds is extremely rare at this rate.`}
      ],
      answer:`$e^{-10}\\approx 0.0000454$.` }
  ],

  /* ---------------------------------------------------------------- */
  "prob-pdf-cdf": [
    { q:`<p>$X$ is uniform on $[0,2]$ with density height $\\frac{1}{2}$. What is the total area under the curve?</p>`,
      steps:[
        {do:`Area $=$ width $\\times$ height $=2\\times\\frac{1}{2}$.`, why:`The density is a flat rectangle.`},
        {do:`$=1$.`, why:`A valid PDF must have total area 1.`}
      ],
      answer:`$1$.` },

    { q:`<p>For the uniform density on $[0,2]$ (height $\\frac{1}{2}$), find $F_X(1)=P(X\\le 1)$.</p>`,
      steps:[
        {do:`$F_X(1)$ is the area from 0 to 1: width $1\\times$ height $\\frac{1}{2}$.`, why:`The CDF accumulates area up to $x=1$.`},
        {do:`$=1\\times\\frac{1}{2}=\\frac{1}{2}$.`, why:`A flat slice of width 1.`}
      ],
      answer:`$F_X(1)=\\frac{1}{2}$.` },

    { q:`<p>For the uniform density on $[0,2]$, what is $P(0.5\\le X\\le 1.5)$?</p>`,
      steps:[
        {do:`This is the area of a slice of width $1.5-0.5=1$.`, why:`Probability is area under the density over that range.`},
        {do:`Area $=1\\times\\frac{1}{2}=\\frac{1}{2}$.`, why:`Width times the constant height $\\frac{1}{2}$.`}
      ],
      answer:`$\\frac{1}{2}$.` },

    { q:`<p>For a continuous variable, what is $P(X=1)$ for the uniform density on $[0,2]$?</p>`,
      steps:[
        {do:`A single point has zero width.`, why:`Continuous outcomes have infinitely many exact values.`},
        {do:`Area of a zero-width slice $=0$.`, why:`No width means no area, so probability 0.`}
      ],
      answer:`$0$.` },

    { q:`<p>$X$ is uniform on $[0,4]$. What density height makes this a valid PDF?</p>`,
      steps:[
        {do:`Total area must be 1: width $\\times$ height $=1$.`, why:`Every PDF integrates to 1.`},
        {do:`Width is 4, so height $=\\frac{1}{4}$.`, why:`$4\\times\\frac{1}{4}=1$.`}
      ],
      answer:`Height $\\frac{1}{4}$.` },

    { q:`<p>For the uniform density on $[0,4]$ (height $\\frac{1}{4}$), find $F_X(3)=P(X\\le 3)$.</p>`,
      steps:[
        {do:`Area from 0 to 3: width $3\\times$ height $\\frac{1}{4}$.`, why:`CDF is accumulated area up to 3.`},
        {do:`$=3\\times\\frac{1}{4}=\\frac{3}{4}$.`, why:`Three-quarters of the range lies below 3.`}
      ],
      answer:`$F_X(3)=\\frac{3}{4}$.` },

    { q:`<p>A density is $f(x)=2x$ for $x$ in $[0,1]$ and 0 elsewhere. Check it is valid by finding the total area $\\int_0^1 2x\\,dx$.</p>`,
      steps:[
        {do:`The region under $f(x)=2x$ from 0 to 1 is a triangle with base 1 and height $f(1)=2$.`, why:`A straight line from $(0,0)$ to $(1,2)$.`},
        {do:`Area $=\\frac{1}{2}\\times\\text{base}\\times\\text{height}=\\frac{1}{2}\\times 1\\times 2=1$.`, why:`Triangle area formula; total area 1 means a valid PDF.`}
      ],
      answer:`Area $=1$, so it is valid.` },

    { q:`<p>For $f(x)=2x$ on $[0,1]$, find $F_X(x)=\\int_0^x 2t\\,dt$.</p>`,
      steps:[
        {do:`The area under $2t$ from 0 to $x$ is a triangle: base $x$, height $2x$.`, why:`The line reaches height $2x$ at the point $x$.`},
        {do:`$F_X(x)=\\frac{1}{2}\\times x\\times 2x=x^2$.`, why:`Triangle area $\\frac{1}{2}\\,bh$ simplifies to $x^2$.`}
      ],
      answer:`$F_X(x)=x^2$ on $[0,1]$.` },

    { q:`<p>Using $F_X(x)=x^2$ for $f(x)=2x$ on $[0,1]$, find $P(X\\le 0.5)$.</p>`,
      steps:[
        {do:`$P(X\\le 0.5)=F_X(0.5)$.`, why:`The CDF gives probability up to a value.`},
        {do:`$=0.5^2=0.25$.`, why:`Square the input.`}
      ],
      answer:`$0.25$.` },

    { q:`<p>Using $F_X(x)=x^2$ for $f(x)=2x$ on $[0,1]$, find $P(0.5\\le X\\le 1)$.</p>`,
      steps:[
        {do:`Use $P(a\\le X\\le b)=F_X(b)-F_X(a)$.`, why:`The probability in a slice is the CDF difference.`},
        {do:`$F_X(1)-F_X(0.5)=1^2-0.5^2=1-0.25$.`, why:`Plug both endpoints into $x^2$.`},
        {do:`$=0.75$.`, why:`Subtract.`}
      ],
      answer:`$0.75$.` }
  ],

  /* ---------------------------------------------------------------- */
  "prob-uniform-exponential": [
    { q:`<p>$X$ is Uniform on $[2,8]$. What is its mean?</p>`,
      steps:[
        {do:`Uniform mean is the midpoint: $E[X]=\\frac{a+b}{2}$.`, why:`A flat range averages to its center.`},
        {do:`$=\\frac{2+8}{2}=\\frac{10}{2}=5$.`, why:`Add the ends and halve.`}
      ],
      answer:`$E[X]=5$.` },

    { q:`<p>$X$ is Uniform on $[0,10]$. What is the density height $f(x)$?</p>`,
      steps:[
        {do:`Uniform height is $\\frac{1}{b-a}$.`, why:`Flat over the range, area must be 1.`},
        {do:`$=\\frac{1}{10-0}=\\frac{1}{10}$.`, why:`The width is 10.`}
      ],
      answer:`$f(x)=\\frac{1}{10}$.` },

    { q:`<p>An Exponential has rate $\\lambda=\\frac{1}{5}$ per minute. What is the mean wait?</p>`,
      steps:[
        {do:`Exponential mean is $E[X]=\\frac{1}{\\lambda}$.`, why:`A faster rate means a shorter wait.`},
        {do:`$=\\frac{1}{1/5}=5$.`, why:`Divide 1 by $\\frac{1}{5}$.`}
      ],
      answer:`$5$ minutes.` },

    { q:`<p>$X$ is Uniform on $[0,10]$. What is $P(X\\le 4)$?</p>`,
      steps:[
        {do:`For Uniform, $P(X\\le x)=\\frac{x-a}{b-a}$ inside the range.`, why:`Fraction of the range below $x$.`},
        {do:`$=\\frac{4-0}{10-0}=\\frac{4}{10}=0.4$.`, why:`4 out of 10 units of width.`}
      ],
      answer:`$0.4$.` },

    { q:`<p>An Exponential has mean wait 4 minutes. What is its rate $\\lambda$?</p>`,
      steps:[
        {do:`Mean $=\\frac{1}{\\lambda}$, so $\\lambda=\\frac{1}{\\text{mean}}$.`, why:`Rate is the reciprocal of mean wait.`},
        {do:`$\\lambda=\\frac{1}{4}=0.25$ per minute.`, why:`Invert the mean of 4.`}
      ],
      answer:`$\\lambda=0.25$ per minute.` },

    { q:`<p>An Exponential with rate $\\lambda$ has CDF $F(x)=1-e^{-\\lambda x}$. For $\\lambda=\\frac{1}{5}$, find $P(X\\le 5)$.</p>`,
      steps:[
        {do:`$P(X\\le 5)=1-e^{-\\lambda\\times 5}=1-e^{-(1/5)\\times 5}$.`, why:`Plug $x=5$ into the CDF.`},
        {do:`$=1-e^{-1}\\approx 1-0.368=0.632$.`, why:`$\\frac{1}{5}\\times 5=1$, and $e^{-1}\\approx 0.368$.`}
      ],
      answer:`About $0.632$.` },

    { q:`<p>An Exponential with rate $\\lambda=\\frac{1}{5}$ has $P(X>x)=e^{-\\lambda x}$. Find $P(X>5)$.</p>`,
      steps:[
        {do:`$P(X>5)=e^{-(1/5)\\times 5}=e^{-1}$.`, why:`The survival function is $e^{-\\lambda x}$.`},
        {do:`$\\approx 0.368$.`, why:`Evaluate $e^{-1}$.`}
      ],
      answer:`About $0.368$.` },

    { q:`<p>The Exponential is memoryless. You have waited 3 minutes for a call with mean wait 5 minutes. What is your expected remaining wait?</p>`,
      steps:[
        {do:`Memoryless means the past wait does not change the future.`, why:`The Exponential "forgets" how long you have waited.`},
        {do:`Expected remaining wait $=\\frac{1}{\\lambda}=5$ minutes.`, why:`It resets to the full mean.`}
      ],
      answer:`$5$ minutes.` },

    { q:`<p>$X$ is Uniform on $[0,10]$. What is $P(3\\le X\\le 7)$?</p>`,
      steps:[
        {do:`For Uniform, probability of a slice is $\\frac{\\text{slice width}}{b-a}$.`, why:`Each part of the range is equally likely.`},
        {do:`$=\\frac{7-3}{10-0}=\\frac{4}{10}=0.4$.`, why:`The slice is 4 wide out of total width 10.`}
      ],
      answer:`$0.4$.` },

    { q:`<p>Calls arrive Exponentially with mean wait 2 minutes ($\\lambda=\\frac{1}{2}$). Using $P(X>x)=e^{-\\lambda x}$, find the chance you wait more than 4 minutes.</p>`,
      steps:[
        {do:`$P(X>4)=e^{-\\lambda\\times 4}=e^{-(1/2)\\times 4}$.`, why:`Plug $x=4$ into the survival function.`},
        {do:`$=e^{-2}\\approx 0.135$.`, why:`$\\frac{1}{2}\\times 4=2$, and $e^{-2}\\approx 0.135$.`}
      ],
      answer:`About $0.135$.` }
  ],

  /* ---------------------------------------------------------------- */
  "prob-normal": [
    { q:`<p>Test scores are $\\mathcal{N}(\\mu=500,\\sigma=100)$. About what percent fall between 400 and 600?</p>`,
      steps:[
        {do:`400 and 600 are $\\mu-\\sigma$ and $\\mu+\\sigma$: $500-100=400$, $500+100=600$.`, why:`Rewrite the bounds as $\\pm 1\\sigma$ from the mean.`},
        {do:`The 68-95-99.7 rule: about 68% lie within one $\\sigma$.`, why:`Standard area fact for $\\pm 1\\sigma$.`}
      ],
      answer:`About $68\\%$.` },

    { q:`<p>Heights are $\\mathcal{N}(\\mu=170,\\sigma=10)$ cm. About what percent fall between 150 and 190 cm?</p>`,
      steps:[
        {do:`150 and 190 are $\\mu-2\\sigma$ and $\\mu+2\\sigma$: $170-20=150$, $170+20=190$.`, why:`These bounds are two $\\sigma$ from the mean.`},
        {do:`The 68-95-99.7 rule: about 95% lie within two $\\sigma$.`, why:`Standard area fact for $\\pm 2\\sigma$.`}
      ],
      answer:`About $95\\%$.` },

    { q:`<p>$\\mathcal{N}(\\mu=0,\\sigma=1)$. About what percent of values fall between $-3$ and $3$?</p>`,
      steps:[
        {do:`$-3$ and $3$ are $\\mu\\pm 3\\sigma$ since $\\mu=0,\\sigma=1$.`, why:`The bounds are three $\\sigma$ wide.`},
        {do:`The 68-95-99.7 rule: about 99.7% lie within three $\\sigma$.`, why:`Standard area fact for $\\pm 3\\sigma$.`}
      ],
      answer:`About $99.7\\%$.` },

    { q:`<p>Heights are $\\mathcal{N}(\\mu=170,\\sigma=10)$. A height of 180 cm has what z-score $\\frac{x-\\mu}{\\sigma}$?</p>`,
      steps:[
        {do:`$z=\\frac{x-\\mu}{\\sigma}=\\frac{180-170}{10}$.`, why:`The z-score counts standard deviations from the mean.`},
        {do:`$=\\frac{10}{10}=1$.`, why:`180 is exactly one $\\sigma$ above the mean.`}
      ],
      answer:`$z=1$.` },

    { q:`<p>$\\mathcal{N}(\\mu=100,\\sigma=15)$. What is the z-score of $x=130$?</p>`,
      steps:[
        {do:`$z=\\frac{x-\\mu}{\\sigma}=\\frac{130-100}{15}$.`, why:`Measure distance from mean in units of $\\sigma$.`},
        {do:`$=\\frac{30}{15}=2$.`, why:`130 is two $\\sigma$ above 100.`}
      ],
      answer:`$z=2$.` },

    { q:`<p>Scores are $\\mathcal{N}(\\mu=500,\\sigma=100)$. About what percent score ABOVE 600?</p>`,
      steps:[
        {do:`600 is $\\mu+1\\sigma$. About 68% lie within $\\pm 1\\sigma$, so 32% lie outside.`, why:`100% minus the central 68%.`},
        {do:`By symmetry, half the outside is above: $\\frac{32\\%}{2}=16\\%$.`, why:`The bell is symmetric, so each tail is equal.`}
      ],
      answer:`About $16\\%$.` },

    { q:`<p>Heights are $\\mathcal{N}(\\mu=170,\\sigma=10)$. About what percent are BELOW 150 cm?</p>`,
      steps:[
        {do:`150 is $\\mu-2\\sigma$. About 95% lie within $\\pm 2\\sigma$, so 5% lie outside.`, why:`100% minus the central 95%.`},
        {do:`By symmetry, half is in the lower tail: $\\frac{5\\%}{2}=2.5\\%$.`, why:`Each tail holds half the outside area.`}
      ],
      answer:`About $2.5\\%$.` },

    { q:`<p>Scores are $\\mathcal{N}(\\mu=500,\\sigma=100)$. About what percent fall between 500 and 600?</p>`,
      steps:[
        {do:`500 to 600 is from $\\mu$ to $\\mu+1\\sigma$. The full $\\pm 1\\sigma$ band holds about 68%.`, why:`68% is split across both sides of the mean.`},
        {do:`Half of that band is above the mean: $\\frac{68\\%}{2}=34\\%$.`, why:`Symmetry splits 68% evenly.`}
      ],
      answer:`About $34\\%$.` },

    { q:`<p>$\\mathcal{N}(\\mu=170,\\sigma=10)$. About what percent are between 160 and 190 cm?</p>`,
      steps:[
        {do:`160 to 170 is the lower half of $\\pm 1\\sigma$: about $\\frac{68\\%}{2}=34\\%$.`, why:`From $\\mu-\\sigma$ up to the mean.`},
        {do:`170 to 190 is the upper half of $\\pm 2\\sigma$: about $\\frac{95\\%}{2}=47.5\\%$.`, why:`From the mean up to $\\mu+2\\sigma$.`},
        {do:`Add: $34\\%+47.5\\%=81.5\\%$.`, why:`The two pieces join at the mean.`}
      ],
      answer:`About $81.5\\%$.` },

    { q:`<p>IQ is $\\mathcal{N}(\\mu=100,\\sigma=15)$. A score of 145 is how many $\\sigma$ above the mean, and is it common?</p>`,
      steps:[
        {do:`$z=\\frac{145-100}{15}=\\frac{45}{15}=3$.`, why:`Convert to a z-score.`},
        {do:`About 99.7% lie within $\\pm 3\\sigma$, so only ~0.3% lie outside; the top tail is ~0.15%.`, why:`145 sits right at the edge of the 99.7% band.`}
      ],
      answer:`$3\\sigma$ above; very rare (top ~$0.15\\%$).` }
  ],

  /* ---------------------------------------------------------------- */
  "prob-joint-marginal": [
    { q:`<p>Joint PMF: $P(0,0)=0.1$, $P(0,1)=0.2$, $P(1,0)=0.3$, $P(1,1)=0.4$. Find the marginal $p_X(0)$.</p>`,
      steps:[
        {do:`$p_X(0)=\\sum_y p_{X,Y}(0,y)=P(0,0)+P(0,1)$.`, why:`Sum the joint over all $y$ at $x=0$.`},
        {do:`$=0.1+0.2=0.3$.`, why:`Add the two entries with $x=0$.`}
      ],
      answer:`$p_X(0)=0.3$.` },

    { q:`<p>Same table ($P(0,0)=0.1$, $P(0,1)=0.2$, $P(1,0)=0.3$, $P(1,1)=0.4$). Find $p_X(1)$.</p>`,
      steps:[
        {do:`$p_X(1)=P(1,0)+P(1,1)$.`, why:`Sum the joint over all $y$ at $x=1$.`},
        {do:`$=0.3+0.4=0.7$.`, why:`Add the two entries with $x=1$.`}
      ],
      answer:`$p_X(1)=0.7$.` },

    { q:`<p>Same table. Find the marginal $p_Y(0)$.</p>`,
      steps:[
        {do:`$p_Y(0)=\\sum_x p_{X,Y}(x,0)=P(0,0)+P(1,0)$.`, why:`Sum the joint over all $x$ at $y=0$.`},
        {do:`$=0.1+0.3=0.4$.`, why:`Add the two entries with $y=0$.`}
      ],
      answer:`$p_Y(0)=0.4$.` },

    { q:`<p>Same table. Find $p_Y(1)$.</p>`,
      steps:[
        {do:`$p_Y(1)=P(0,1)+P(1,1)$.`, why:`Sum the joint over all $x$ at $y=1$.`},
        {do:`$=0.2+0.4=0.6$.`, why:`Add the two entries with $y=1$.`}
      ],
      answer:`$p_Y(1)=0.6$.` },

    { q:`<p>Check that the table $P(0,0)=0.1$, $P(0,1)=0.2$, $P(1,0)=0.3$, $P(1,1)=0.4$ is a valid joint PMF.</p>`,
      steps:[
        {do:`A valid joint PMF must have all entries sum to 1.`, why:`Some pair must occur, so total probability is 1.`},
        {do:`$0.1+0.2+0.3+0.4=1.0$.`, why:`Add all four cells.`}
      ],
      answer:`Yes, they sum to $1$.` },

    { q:`<p>Weather $Y$ (Sunny/Rainy) and mood $X$ (Happy/Sad): $P(\\text{Happy,Sunny})=0.4$, $P(\\text{Happy,Rainy})=0.1$, $P(\\text{Sad,Sunny})=0.2$, $P(\\text{Sad,Rainy})=0.3$. Find the marginal $P(\\text{Sunny})$.</p>`,
      steps:[
        {do:`Sum the Sunny column over mood: $P(\\text{Happy,Sunny})+P(\\text{Sad,Sunny})$.`, why:`Marginalize out mood by summing over $X$.`},
        {do:`$=0.4+0.2=0.6$.`, why:`Add both Sunny entries.`}
      ],
      answer:`$P(\\text{Sunny})=0.6$.` },

    { q:`<p>Same mood/weather table. Find the marginal $P(\\text{Happy})$.</p>`,
      steps:[
        {do:`Sum the Happy row over weather: $P(\\text{Happy,Sunny})+P(\\text{Happy,Rainy})$.`, why:`Marginalize out weather by summing over $Y$.`},
        {do:`$=0.4+0.1=0.5$.`, why:`Add both Happy entries.`}
      ],
      answer:`$P(\\text{Happy})=0.5$.` },

    { q:`<p>Same mood/weather table. Using the joint, find $P(X=\\text{Happy}\\mid Y=\\text{Sunny})$.</p>`,
      steps:[
        {do:`Use $P(A\\mid B)=\\frac{P(A\\cap B)}{P(B)}$ with $P(\\text{Sunny})=0.6$.`, why:`Condition on the Sunny marginal.`},
        {do:`$=\\frac{P(\\text{Happy,Sunny})}{P(\\text{Sunny})}=\\frac{0.4}{0.6}\\approx 0.667$.`, why:`Joint over marginal.`}
      ],
      answer:`$\\frac{0.4}{0.6}\\approx 0.667$.` },

    { q:`<p>A joint: $P(X{=}1,Y{=}1)=0.2$, $P(1,2)=0.1$, $P(2,1)=0.3$, $P(2,2)=0.4$. Find $p_X(2)$.</p>`,
      steps:[
        {do:`$p_X(2)=P(2,1)+P(2,2)$.`, why:`Sum over all $y$ at $x=2$.`},
        {do:`$=0.3+0.4=0.7$.`, why:`Add the two $x=2$ cells.`}
      ],
      answer:`$p_X(2)=0.7$.` },

    { q:`<p>For the joint $P(1,1)=0.2$, $P(1,2)=0.1$, $P(2,1)=0.3$, $P(2,2)=0.4$, are $X$ and $Y$ independent? Check $p_{X,Y}(1,1)$ vs $p_X(1)\\,p_Y(1)$.</p>`,
      steps:[
        {do:`Marginals: $p_X(1)=0.2+0.1=0.3$ and $p_Y(1)=0.2+0.3=0.5$.`, why:`Sum the joint over the other variable.`},
        {do:`Independence needs $p_{X,Y}(1,1)=p_X(1)\\,p_Y(1)=0.3\\times 0.5=0.15$.`, why:`Independent joints factor into the product of marginals.`},
        {do:`But $p_{X,Y}(1,1)=0.2\\ne 0.15$.`, why:`The product does not match the joint entry.`}
      ],
      answer:`No, not independent.` }
  ],

  /* ---------------------------------------------------------------- */
  "prob-covariance-correlation": [
    { q:`<p>Given $E[XY]=8$, $E[X]=2$, $E[Y]=3$. Find $\\operatorname{Cov}(X,Y)$.</p>`,
      steps:[
        {do:`Use $\\operatorname{Cov}(X,Y)=E[XY]-E[X]\\,E[Y]$.`, why:`Mean of the product minus product of the means.`},
        {do:`$=8-(2\\times 3)=8-6=2$.`, why:`Subtract the product of the means.`}
      ],
      answer:`$\\operatorname{Cov}(X,Y)=2$.` },

    { q:`<p>$\\operatorname{Cov}(X,Y)=2$, $\\sigma_X=1$, $\\sigma_Y=2$. Find the correlation $\\rho$.</p>`,
      steps:[
        {do:`Use $\\rho=\\frac{\\operatorname{Cov}(X,Y)}{\\sigma_X\\,\\sigma_Y}$.`, why:`Correlation rescales covariance by both spreads.`},
        {do:`$=\\frac{2}{1\\times 2}=\\frac{2}{2}=1$.`, why:`Divide by the product of standard deviations.`}
      ],
      answer:`$\\rho=1$.` },

    { q:`<p>If $\\operatorname{Cov}(X,Y)=0$, what is $\\rho$?</p>`,
      steps:[
        {do:`$\\rho=\\frac{0}{\\sigma_X\\,\\sigma_Y}$.`, why:`Plug zero covariance into the correlation formula.`},
        {do:`$=0$.`, why:`Zero divided by anything positive is 0; no linear link.`}
      ],
      answer:`$\\rho=0$.` },

    { q:`<p>$E[XY]=10$, $E[X]=4$, $E[Y]=2$. Find $\\operatorname{Cov}(X,Y)$.</p>`,
      steps:[
        {do:`$\\operatorname{Cov}(X,Y)=E[XY]-E[X]\\,E[Y]$.`, why:`Use the covariance shortcut.`},
        {do:`$=10-(4\\times 2)=10-8=2$.`, why:`Positive, so they tend to move together.`}
      ],
      answer:`$\\operatorname{Cov}(X,Y)=2$.` },

    { q:`<p>$E[XY]=5$, $E[X]=3$, $E[Y]=2$. Find $\\operatorname{Cov}(X,Y)$ and say its sign meaning.</p>`,
      steps:[
        {do:`$\\operatorname{Cov}(X,Y)=5-(3\\times 2)=5-6=-1$.`, why:`Mean of product minus product of means.`},
        {do:`Negative covariance: one rises as the other falls.`, why:`A negative sign means they move oppositely.`}
      ],
      answer:`$\\operatorname{Cov}(X,Y)=-1$ (move oppositely).` },

    { q:`<p>$\\operatorname{Cov}(X,Y)=6$, $\\sigma_X=3$, $\\sigma_Y=4$. Find $\\rho$.</p>`,
      steps:[
        {do:`$\\rho=\\frac{\\operatorname{Cov}(X,Y)}{\\sigma_X\\,\\sigma_Y}=\\frac{6}{3\\times 4}$.`, why:`Divide covariance by both spreads.`},
        {do:`$=\\frac{6}{12}=0.5$.`, why:`A moderate positive linear relationship.`}
      ],
      answer:`$\\rho=0.5$.` },

    { q:`<p>Data pairs $(X,Y)$: $(1,2),(2,4),(3,6)$, each equally likely. Find $E[X]$ and $E[Y]$.</p>`,
      steps:[
        {do:`$E[X]=\\frac{1+2+3}{3}=\\frac{6}{3}=2$.`, why:`Average the $X$ values with equal weight $\\frac{1}{3}$.`},
        {do:`$E[Y]=\\frac{2+4+6}{3}=\\frac{12}{3}=4$.`, why:`Average the $Y$ values.`}
      ],
      answer:`$E[X]=2$, $E[Y]=4$.` },

    { q:`<p>For $(1,2),(2,4),(3,6)$ each equally likely (with $E[X]=2$, $E[Y]=4$), find $E[XY]$.</p>`,
      steps:[
        {do:`Products: $1\\times 2=2$, $2\\times 4=8$, $3\\times 6=18$.`, why:`Multiply each pair.`},
        {do:`$E[XY]=\\frac{2+8+18}{3}=\\frac{28}{3}\\approx 9.33$.`, why:`Average the products.`}
      ],
      answer:`$E[XY]=\\frac{28}{3}\\approx 9.33$.` },

    { q:`<p>For $(1,2),(2,4),(3,6)$ with $E[XY]=\\frac{28}{3}$, $E[X]=2$, $E[Y]=4$, find $\\operatorname{Cov}(X,Y)$.</p>`,
      steps:[
        {do:`$\\operatorname{Cov}(X,Y)=E[XY]-E[X]\\,E[Y]=\\frac{28}{3}-(2\\times 4)$.`, why:`Apply the covariance formula.`},
        {do:`$=\\frac{28}{3}-8=\\frac{28-24}{3}=\\frac{4}{3}\\approx 1.33$.`, why:`Write 8 as $\\frac{24}{3}$ and subtract.`}
      ],
      answer:`$\\operatorname{Cov}(X,Y)=\\frac{4}{3}\\approx 1.33$.` },

    { q:`<p>Two variables have a perfect straight-line relationship $Y=2X$. What is their correlation $\\rho$?</p>`,
      steps:[
        {do:`Correlation lies in $[-1,1]$, and $+1$ means a perfect positive straight line.`, why:`$\\rho$ measures linear association.`},
        {do:`$Y=2X$ rises whenever $X$ rises, exactly on a line, so $\\rho=1$.`, why:`A positive-slope exact line gives the maximum.`}
      ],
      answer:`$\\rho=1$.` }
  ],

  /* ---------------------------------------------------------------- */
  "prob-conditional-expectation": [
    { q:`<p>Class A (half the students) averages 80; class B (the other half) averages 90. Find the overall average $E[X]$.</p>`,
      steps:[
        {do:`Use $E[X]=\\sum P(\\text{group})\\,E[X\\mid\\text{group}]$.`, why:`Weight each group average by its size.`},
        {do:`$=0.5\\times 80+0.5\\times 90=40+45=85$.`, why:`Add the weighted group means.`}
      ],
      answer:`$E[X]=85$.` },

    { q:`<p>Machine A (60% of items) averages 10 g; Machine B (40%) averages 20 g. Find $E[X]$.</p>`,
      steps:[
        {do:`$E[X]=P(A)\\,E[X\\mid A]+P(B)\\,E[X\\mid B]$.`, why:`Law of iterated expectations: average the group averages.`},
        {do:`$=0.6\\times 10+0.4\\times 20=6+8=14$.`, why:`Weight each by its share and add.`}
      ],
      answer:`$E[X]=14$ g.` },

    { q:`<p>$E[X\\mid Y=1]=5$ with $P(Y=1)=0.3$, and $E[X\\mid Y=2]=10$ with $P(Y=2)=0.7$. Find $E[X]$.</p>`,
      steps:[
        {do:`$E[X]=0.3\\times 5+0.7\\times 10$.`, why:`Weight each conditional mean by its probability.`},
        {do:`$=1.5+7=8.5$.`, why:`Add the two contributions.`}
      ],
      answer:`$E[X]=8.5$.` },

    { q:`<p>A bag is 70% red apples (avg weight 100 g) and 30% green apples (avg 150 g). Find the overall average weight.</p>`,
      steps:[
        {do:`$E[X]=0.7\\times 100+0.3\\times 150$.`, why:`Weight each color's average by its share.`},
        {do:`$=70+45=115$.`, why:`Add the weighted averages.`}
      ],
      answer:`$E[X]=115$ g.` },

    { q:`<p>Three equally likely regions average 2, 4, and 6 sales. Find the overall expected sales $E[X]$.</p>`,
      steps:[
        {do:`Each region has weight $\\frac{1}{3}$: $E[X]=\\frac{1}{3}(2)+\\frac{1}{3}(4)+\\frac{1}{3}(6)$.`, why:`Equal groups get equal weight.`},
        {do:`$=\\frac{2+4+6}{3}=\\frac{12}{3}=4$.`, why:`Sum the group means and divide by 3.`}
      ],
      answer:`$E[X]=4$.` },

    { q:`<p>A coin (chance $\\frac{1}{2}$ each) decides a die. Heads: roll a fair die, $E[X\\mid H]=3.5$. Tails: always 0, $E[X\\mid T]=0$. Find $E[X]$.</p>`,
      steps:[
        {do:`$E[X]=\\frac{1}{2}\\times 3.5+\\frac{1}{2}\\times 0$.`, why:`Average the two conditional means.`},
        {do:`$=1.75+0=1.75$.`, why:`Add the contributions.`}
      ],
      answer:`$E[X]=1.75$.` },

    { q:`<p>A store has 3 small days (avg \\$200) and 2 big days (avg \\$700) out of 5 equally likely days. Find expected daily revenue.</p>`,
      steps:[
        {do:`Weights: $P(\\text{small})=\\frac{3}{5}$, $P(\\text{big})=\\frac{2}{5}$.`, why:`Group size over total days.`},
        {do:`$E[X]=\\frac{3}{5}\\times 200+\\frac{2}{5}\\times 700=120+280=400$.`, why:`Weight each group mean and add.`}
      ],
      answer:`$E[X]=\\$400$.` },

    { q:`<p>$E[X\\mid Y=0]=4$, $E[X\\mid Y=1]=4$. Both groups have the same conditional mean 4. What is $E[X]$?</p>`,
      steps:[
        {do:`Any weights $P(Y=0)+P(Y=1)=1$ give $E[X]=4\\times P(Y=0)+4\\times P(Y=1)$.`, why:`Law of iterated expectations.`},
        {do:`$=4\\,(P(Y=0)+P(Y=1))=4\\times 1=4$.`, why:`Both group means equal 4, so the overall mean is 4.`}
      ],
      answer:`$E[X]=4$.` },

    { q:`<p>Customers: 80% spend \\$10 on average, 20% spend \\$60 on average. Find expected spend, then expected revenue from 100 customers.</p>`,
      steps:[
        {do:`$E[X]=0.8\\times 10+0.2\\times 60=8+12=20$.`, why:`Weighted average of the two groups.`},
        {do:`100 customers: $100\\times 20=\\$2000$.`, why:`Scale the per-customer mean by 100.`}
      ],
      answer:`$E[X]=\\$20$; total $\\$2000$.` },

    { q:`<p>A test taker guesses on 40% of questions (avg score 0.25 per question) and knows 60% (avg 1.0). Find expected score per question.</p>`,
      steps:[
        {do:`$E[X]=0.4\\times 0.25+0.6\\times 1.0$.`, why:`Weight each group's mean by its share.`},
        {do:`$=0.1+0.6=0.7$.`, why:`Add the two contributions.`}
      ],
      answer:`$E[X]=0.7$ per question.` }
  ],

  /* ---------------------------------------------------------------- */
  "prob-inequalities": [
    { q:`<p>A nonnegative variable has mean $E[X]=4$. By Markov, bound $P(X\\ge 8)$.</p>`,
      steps:[
        {do:`Markov: $P(X\\ge a)\\le\\frac{E[X]}{a}$ with $a=8$.`, why:`A small mean limits how often $X$ is large.`},
        {do:`$\\le\\frac{4}{8}=0.5$.`, why:`Divide the mean by the threshold.`}
      ],
      answer:`$P(X\\ge 8)\\le 0.5$.` },

    { q:`<p>Scores average $E[X]=50$ and are nonnegative. By Markov, bound $P(X\\ge 100)$.</p>`,
      steps:[
        {do:`Markov: $P(X\\ge 100)\\le\\frac{E[X]}{a}=\\frac{50}{100}$.`, why:`Apply the Markov bound with $a=100$.`},
        {do:`$=0.5$.`, why:`At most 50%.`}
      ],
      answer:`$\\le 0.5$.` },

    { q:`<p>A nonnegative variable has mean 3. By Markov, bound $P(X\\ge 12)$.</p>`,
      steps:[
        {do:`$P(X\\ge 12)\\le\\frac{E[X]}{a}=\\frac{3}{12}$.`, why:`Markov with $a=12$.`},
        {do:`$=0.25$.`, why:`At most 25%.`}
      ],
      answer:`$\\le 0.25$.` },

    { q:`<p>Mean $\\mu=50$, variance $\\sigma^2=100$. By Chebyshev, bound $P(|X-\\mu|\\ge 30)$.</p>`,
      steps:[
        {do:`Chebyshev: $P(|X-\\mu|\\ge\\epsilon)\\le\\frac{\\sigma^2}{\\epsilon^2}$ with $\\epsilon=30$.`, why:`Small variance limits straying from the mean.`},
        {do:`$\\le\\frac{100}{30^2}=\\frac{100}{900}\\approx 0.11$.`, why:`Divide variance by the squared distance.`}
      ],
      answer:`$\\le\\frac{100}{900}\\approx 0.11$.` },

    { q:`<p>Mean $\\mu=0$, variance $\\sigma^2=4$. By Chebyshev, bound $P(|X|\\ge 4)$.</p>`,
      steps:[
        {do:`Chebyshev with $\\epsilon=4$: $P(|X-0|\\ge 4)\\le\\frac{\\sigma^2}{\\epsilon^2}=\\frac{4}{16}$.`, why:`Apply the bound around mean 0.`},
        {do:`$=0.25$.`, why:`At most 25%.`}
      ],
      answer:`$\\le 0.25$.` },

    { q:`<p>A variable has $\\mu=10$ and $\\sigma=2$ (so $\\sigma^2=4$). By Chebyshev, bound $P(|X-10|\\ge 6)$.</p>`,
      steps:[
        {do:`$\\epsilon=6$, $\\sigma^2=4$: $P(|X-10|\\ge 6)\\le\\frac{4}{6^2}=\\frac{4}{36}$.`, why:`Plug into Chebyshev.`},
        {do:`$=\\frac{1}{9}\\approx 0.111$.`, why:`Simplify the fraction.`}
      ],
      answer:`$\\le\\frac{1}{9}\\approx 0.111$.` },

    { q:`<p>By Chebyshev, bound the chance a value is at least $2\\sigma$ from its mean, i.e. $\\epsilon=2\\sigma$.</p>`,
      steps:[
        {do:`$P(|X-\\mu|\\ge 2\\sigma)\\le\\frac{\\sigma^2}{(2\\sigma)^2}=\\frac{\\sigma^2}{4\\sigma^2}$.`, why:`Set $\\epsilon=2\\sigma$ in Chebyshev.`},
        {do:`$=\\frac{1}{4}=0.25$.`, why:`The $\\sigma^2$ terms cancel.`}
      ],
      answer:`$\\le 0.25$.` },

    { q:`<p>By Chebyshev, bound the chance a value is at least $3\\sigma$ from its mean ($\\epsilon=3\\sigma$).</p>`,
      steps:[
        {do:`$P(|X-\\mu|\\ge 3\\sigma)\\le\\frac{\\sigma^2}{(3\\sigma)^2}=\\frac{\\sigma^2}{9\\sigma^2}$.`, why:`Set $\\epsilon=3\\sigma$.`},
        {do:`$=\\frac{1}{9}\\approx 0.111$.`, why:`The $\\sigma^2$ cancels, leaving $\\frac{1}{9}$.`}
      ],
      answer:`$\\le\\frac{1}{9}\\approx 0.111$.` },

    { q:`<p>Wait times are nonnegative with mean $E[X]=5$ minutes. By Markov, bound the chance a wait is 20 minutes or more.</p>`,
      steps:[
        {do:`Markov: $P(X\\ge 20)\\le\\frac{E[X]}{a}=\\frac{5}{20}$.`, why:`Apply Markov with $a=20$.`},
        {do:`$=0.25$.`, why:`At most a 25% chance of such a long wait.`}
      ],
      answer:`$\\le 0.25$.` },

    { q:`<p>A variable has $\\mu=100$, $\\sigma^2=25$. By Chebyshev, bound $P(|X-100|\\ge 10)$, then state the lower bound on being WITHIN 10.</p>`,
      steps:[
        {do:`$P(|X-100|\\ge 10)\\le\\frac{25}{10^2}=\\frac{25}{100}=0.25$.`, why:`Chebyshev with $\\epsilon=10$.`},
        {do:`So $P(|X-100|<10)\\ge 1-0.25=0.75$.`, why:`The complement gives a guaranteed lower bound.`}
      ],
      answer:`$\\le 0.25$ outside; $\\ge 0.75$ within.` }
  ],

  /* ---------------------------------------------------------------- */
  "prob-lln": [
    { q:`<p>You flip a fair coin (true heads rate 0.5) 100,000 times. Roughly what fraction comes up heads?</p>`,
      steps:[
        {do:`The sample average $\\overline{X}\\to\\mu$ as $n\\to\\infty$.`, why:`Law of Large Numbers: averages settle on the true mean.`},
        {do:`Here $\\mu=0.5$, and $n$ is huge, so the fraction $\\approx 0.5$.`, why:`Large $n$ makes the estimate close to truth.`}
      ],
      answer:`About $0.5$.` },

    { q:`<p>Roll a fair die. As $n\\to\\infty$, what does the running average $\\overline{X}$ approach?</p>`,
      steps:[
        {do:`The true mean of a fair die is $\\mu=\\frac{1+2+3+4+5+6}{6}=3.5$.`, why:`Average the six equally likely faces.`},
        {do:`By LLN, $\\overline{X}\\to 3.5$.`, why:`The sample average converges to $\\mu$.`}
      ],
      answer:`$\\overline{X}\\to 3.5$.` },

    { q:`<p>Samples $[6,2,5,1,4]$ from a die. Compute $\\overline{X}$.</p>`,
      steps:[
        {do:`$\\overline{X}=\\frac{1}{n}\\sum X_i=\\frac{6+2+5+1+4}{5}$.`, why:`Add the samples and divide by $n=5$.`},
        {do:`$=\\frac{18}{5}=3.6$.`, why:`Close-ish to the true mean 3.5.`}
      ],
      answer:`$\\overline{X}=3.6$.` },

    { q:`<p>A die's true mean is 3.5. Which running average is likely closer to 3.5: after 50 rolls or after 5000 rolls?</p>`,
      steps:[
        {do:`LLN says the gap shrinks as $n$ grows.`, why:`More data means a more reliable average.`},
        {do:`5000 rolls gives a tighter estimate than 50.`, why:`Larger $n$ wins.`}
      ],
      answer:`After 5000 rolls.` },

    { q:`<p>A spinner has true mean payout $\\mu=\\$2$. After 1,000,000 spins, roughly what is the average payout?</p>`,
      steps:[
        {do:`By LLN, $\\overline{X}\\to\\mu$ for large $n$.`, why:`The average homes in on the true mean.`},
        {do:`With $n=10^6$, $\\overline{X}\\approx\\$2$.`, why:`Such a large $n$ makes it very close.`}
      ],
      answer:`About $\\$2$.` },

    { q:`<p>Samples $[3,5,4,8]$. Compute the running average $\\overline{X}$.</p>`,
      steps:[
        {do:`$\\overline{X}=\\frac{3+5+4+8}{4}$.`, why:`Sum over $n=4$ samples.`},
        {do:`$=\\frac{20}{4}=5$.`, why:`Divide the total by 4.`}
      ],
      answer:`$\\overline{X}=5$.` },

    { q:`<p>A coin's true heads rate is 0.5. After only 10 flips you got 7 heads (0.7). Does this break the Law of Large Numbers?</p>`,
      steps:[
        {do:`LLN is about LARGE $n$; 10 flips is small, so wide swings are normal.`, why:`Small samples are noisy.`},
        {do:`With many more flips the fraction would settle toward 0.5.`, why:`Convergence happens as $n$ grows.`}
      ],
      answer:`No; 10 flips is too few to apply LLN.` },

    { q:`<p>A survey samples voters with true support $\\mu=0.6$. As the sample size grows, what does the measured support fraction approach?</p>`,
      steps:[
        {do:`The measured fraction is a sample average $\\overline{X}$.`, why:`Each voter is a 0/1 sample.`},
        {do:`By LLN, $\\overline{X}\\to\\mu=0.6$.`, why:`More respondents tighten the estimate around the truth.`}
      ],
      answer:`About $0.6$.` },

    { q:`<p>Two estimates of a true mean: one from $n=100$ samples, one from $n=10{,}000$. Which is more trustworthy and why?</p>`,
      steps:[
        {do:`LLN: the error of $\\overline{X}$ shrinks as $n$ grows.`, why:`Noise cancels with more data.`},
        {do:`So $n=10{,}000$ is more trustworthy.`, why:`Bigger samples give reliable averages.`}
      ],
      answer:`The $n=10{,}000$ estimate.` },

    { q:`<p>Samples $[2,4,6,8,10]$. Compute $\\overline{X}$, the LLN estimate of the true mean.</p>`,
      steps:[
        {do:`$\\overline{X}=\\frac{1}{5}\\sum X_i=\\frac{2+4+6+8+10}{5}$.`, why:`Average of the five samples.`},
        {do:`$=\\frac{30}{5}=6$.`, why:`This sample mean estimates $\\mu$.`}
      ],
      answer:`$\\overline{X}=6$.` }
  ],

  /* ---------------------------------------------------------------- */
  "prob-clt": [
    { q:`<p>Samples have $\\mu=10$, $\\sigma^2=16$. For an average of $n=4$ samples, find the variance of $\\overline{X}$.</p>`,
      steps:[
        {do:`CLT: $\\overline{X}\\approx\\mathcal{N}\\!\\left(\\mu,\\frac{\\sigma^2}{n}\\right)$, so its variance is $\\frac{\\sigma^2}{n}$.`, why:`The average's variance shrinks with $n$.`},
        {do:`$=\\frac{16}{4}=4$.`, why:`Divide the single-sample variance by $n=4$.`}
      ],
      answer:`Variance $=4$.` },

    { q:`<p>From the same setup ($\\sigma^2=16$, $n=4$, variance of $\\overline{X}=4$), find the standard deviation of $\\overline{X}$.</p>`,
      steps:[
        {do:`$\\sigma_{\\overline{X}}=\\sqrt{\\frac{\\sigma^2}{n}}=\\sqrt{4}$.`, why:`Standard deviation is the square root of variance.`},
        {do:`$=2$.`, why:`Half the single-sample $\\sigma=4$.`}
      ],
      answer:`$\\sigma_{\\overline{X}}=2$.` },

    { q:`<p>Samples have $\\mu=50$, $\\sigma^2=100$. For $n=25$, find the variance of $\\overline{X}$.</p>`,
      steps:[
        {do:`Variance of the average is $\\frac{\\sigma^2}{n}=\\frac{100}{25}$.`, why:`CLT spread formula.`},
        {do:`$=4$.`, why:`Divide 100 by 25.`}
      ],
      answer:`Variance $=4$.` },

    { q:`<p>For $\\mu=50$, $\\sigma^2=100$, $n=25$ (variance of $\\overline{X}=4$), find $\\sigma_{\\overline{X}}$.</p>`,
      steps:[
        {do:`$\\sigma_{\\overline{X}}=\\sqrt{4}$.`, why:`Square root of the average's variance.`},
        {do:`$=2$.`, why:`The average is much tighter than a single sample ($\\sigma=10$).`}
      ],
      answer:`$\\sigma_{\\overline{X}}=2$.` },

    { q:`<p>One die roll has $\\mu=3.5$, $\\sigma^2\\approx 2.92$. Average $n=30$ rolls. What distribution does $\\overline{X}$ follow approximately?</p>`,
      steps:[
        {do:`CLT: $\\overline{X}\\approx\\mathcal{N}\\!\\left(\\mu,\\frac{\\sigma^2}{n}\\right)$.`, why:`Averages look Normal even from a flat die.`},
        {do:`$\\frac{\\sigma^2}{n}=\\frac{2.92}{30}\\approx 0.097$, so $\\overline{X}\\approx\\mathcal{N}(3.5,\\,0.097)$.`, why:`Center at $\\mu$, variance $\\frac{\\sigma^2}{n}$.`}
      ],
      answer:`$\\overline{X}\\approx\\mathcal{N}(3.5,\\,0.097)$.` },

    { q:`<p>Single sample has $\\sigma=10$. By the CLT, what is $\\sigma_{\\overline{X}}$ for an average of $n=100$ samples?</p>`,
      steps:[
        {do:`$\\sigma_{\\overline{X}}=\\frac{\\sigma}{\\sqrt{n}}=\\frac{10}{\\sqrt{100}}$.`, why:`Standard deviation of the average is $\\frac{\\sigma}{\\sqrt{n}}$.`},
        {do:`$=\\frac{10}{10}=1$.`, why:`$\\sqrt{100}=10$.`}
      ],
      answer:`$\\sigma_{\\overline{X}}=1$.` },

    { q:`<p>To halve the spread $\\sigma_{\\overline{X}}=\\frac{\\sigma}{\\sqrt{n}}$, by what factor must $n$ grow?</p>`,
      steps:[
        {do:`Spread depends on $\\sqrt{n}$ in the denominator.`, why:`Halving needs $\\sqrt{n}$ to double.`},
        {do:`Doubling $\\sqrt{n}$ means multiplying $n$ by $2^2=4$.`, why:`The square of the factor 2.`}
      ],
      answer:`$n$ must grow by $4\\times$.` },

    { q:`<p>Samples have $\\mu=20$, $\\sigma=6$. For $n=9$, find the center and standard deviation of $\\overline{X}$.</p>`,
      steps:[
        {do:`Center is $\\mu=20$.`, why:`The average is centered on the true mean.`},
        {do:`$\\sigma_{\\overline{X}}=\\frac{\\sigma}{\\sqrt{n}}=\\frac{6}{\\sqrt{9}}=\\frac{6}{3}=2$.`, why:`Spread shrinks by $\\sqrt{n}$.`}
      ],
      answer:`Center 20, $\\sigma_{\\overline{X}}=2$.` },

    { q:`<p>Why does the CLT let us use the Normal distribution for a sample mean, even when one sample is not bell-shaped?</p>`,
      steps:[
        {do:`The CLT says the average of many independent samples is approximately Normal.`, why:`The shape of one sample washes out when you average many.`},
        {do:`So $\\overline{X}\\approx\\mathcal{N}\\!\\left(\\mu,\\frac{\\sigma^2}{n}\\right)$ for large $n$.`, why:`This holds regardless of the original distribution.`}
      ],
      answer:`Averages become Normal as $n$ grows.` },

    { q:`<p>A sample mean of $n=100$ has $\\mu=50$ and $\\sigma_{\\overline{X}}=2$. About what percent of such sample means fall between 48 and 52?</p>`,
      steps:[
        {do:`48 and 52 are $\\mu\\pm 1\\sigma_{\\overline{X}}$: $50-2=48$, $50+2=52$.`, why:`The bounds are one $\\sigma_{\\overline{X}}$ each way.`},
        {do:`By CLT $\\overline{X}$ is Normal, so the 68-95-99.7 rule gives about 68% within $\\pm 1\\sigma_{\\overline{X}}$.`, why:`Apply the bell-curve area fact.`}
      ],
      answer:`About $68\\%$.` }
  ],

  /* ---------------------------------------------------------------- */
  "prob-estimation": [
    { q:`<p>Data $\\{2,4,6\\}$. Compute the sample mean $\\overline{X}$.</p>`,
      steps:[
        {do:`$\\overline{X}=\\frac{1}{n}\\sum X_i=\\frac{2+4+6}{3}$.`, why:`Average estimates the true mean.`},
        {do:`$=\\frac{12}{3}=4$.`, why:`Divide the sum by $n=3$.`}
      ],
      answer:`$\\overline{X}=4$.` },

    { q:`<p>Data $\\{2,4,6\\}$ with $\\overline{X}=4$. Compute the sample variance $s^2$ (divide by $n-1$).</p>`,
      steps:[
        {do:`Squared distances from 4: $(2-4)^2=4$, $(4-4)^2=0$, $(6-4)^2=4$; sum $=8$.`, why:`Spread is measured by squared gaps from the mean.`},
        {do:`$s^2=\\frac{8}{n-1}=\\frac{8}{2}=4$.`, why:`The $n-1$ divisor makes $s^2$ unbiased.`}
      ],
      answer:`$s^2=4$.` },

    { q:`<p>Data $\\{1,3\\}$. Compute the sample mean $\\overline{X}$.</p>`,
      steps:[
        {do:`$\\overline{X}=\\frac{1+3}{2}$.`, why:`Average the two data points.`},
        {do:`$=\\frac{4}{2}=2$.`, why:`Divide by $n=2$.`}
      ],
      answer:`$\\overline{X}=2$.` },

    { q:`<p>Data $\\{1,3\\}$ with $\\overline{X}=2$. Compute $s^2$ (use $n-1$).</p>`,
      steps:[
        {do:`Squared distances: $(1-2)^2=1$, $(3-2)^2=1$; sum $=2$.`, why:`Square each gap from the mean.`},
        {do:`$s^2=\\frac{2}{n-1}=\\frac{2}{1}=2$.`, why:`Divide by $n-1=1$.`}
      ],
      answer:`$s^2=2$.` },

    { q:`<p>For data $\\{2,4,6\\}$ with sum of squared distances 8, what would you WRONGLY get dividing by $n=3$ instead of $n-1$?</p>`,
      steps:[
        {do:`Wrong divisor: $\\frac{8}{n}=\\frac{8}{3}\\approx 2.67$.`, why:`Dividing by $n$ underestimates the spread.`},
        {do:`The correct $s^2=\\frac{8}{2}=4$ is larger.`, why:`The $n-1$ fix corrects the downward bias.`}
      ],
      answer:`$\\frac{8}{3}\\approx 2.67$ (too small).` },

    { q:`<p>An estimator $\\hat\\theta$ has $E[\\hat\\theta]=5$ and the true value is $\\theta=5$. Find the bias.</p>`,
      steps:[
        {do:`Bias $=E[\\hat\\theta]-\\theta=5-5$.`, why:`Bias is how far off the guess is on average.`},
        {do:`$=0$.`, why:`Zero bias means the estimator is unbiased.`}
      ],
      answer:`Bias $=0$ (unbiased).` },

    { q:`<p>An estimator has $E[\\hat\\theta]=12$ but the true value is $\\theta=10$. Find the bias.</p>`,
      steps:[
        {do:`Bias $=E[\\hat\\theta]-\\theta=12-10$.`, why:`Compare the average estimate to the truth.`},
        {do:`$=2$.`, why:`Positive bias means it overestimates on average.`}
      ],
      answer:`Bias $=2$.` },

    { q:`<p>Data $\\{4,8\\}$. Compute the sample mean and sample variance $s^2$.</p>`,
      steps:[
        {do:`$\\overline{X}=\\frac{4+8}{2}=\\frac{12}{2}=6$.`, why:`Average the data.`},
        {do:`Squared distances: $(4-6)^2=4$, $(8-6)^2=4$; sum $=8$. Then $s^2=\\frac{8}{n-1}=\\frac{8}{1}=8$.`, why:`Sum squared gaps, divide by $n-1=1$.`}
      ],
      answer:`$\\overline{X}=6$, $s^2=8$.` },

    { q:`<p>Data $\\{5,5,5\\}$. Compute the sample mean and $s^2$.</p>`,
      steps:[
        {do:`$\\overline{X}=\\frac{5+5+5}{3}=5$.`, why:`All equal, so the mean is 5.`},
        {do:`Squared distances are all $(5-5)^2=0$; sum $=0$, so $s^2=\\frac{0}{2}=0$.`, why:`No spread means zero variance.`}
      ],
      answer:`$\\overline{X}=5$, $s^2=0$.` },

    { q:`<p>Data $\\{0,2,4,6\\}$. Compute the sample mean and sample variance $s^2$.</p>`,
      steps:[
        {do:`$\\overline{X}=\\frac{0+2+4+6}{4}=\\frac{12}{4}=3$.`, why:`Average the four values.`},
        {do:`Squared distances from 3: $9,1,1,9$; sum $=20$.`, why:`$(0-3)^2=9$, $(2-3)^2=1$, $(4-3)^2=1$, $(6-3)^2=9$.`},
        {do:`$s^2=\\frac{20}{n-1}=\\frac{20}{3}\\approx 6.67$.`, why:`Divide by $n-1=3$.`}
      ],
      answer:`$\\overline{X}=3$, $s^2=\\frac{20}{3}\\approx 6.67$.` }
  ]

}); })();
