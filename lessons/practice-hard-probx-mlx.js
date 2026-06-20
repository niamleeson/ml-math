/* =====================================================================
   PRACTICE SET — Probability (advanced) + Machine Learning (more).
   Owned ids:
     probx-derived, probx-convolution, probx-total-variance, probx-mgf,
     mlx-newton, mlx-lwr, mlx-cross-validation, mlx-model-selection,
     mlx-clustering-metrics, mlx-error-analysis.
   Each id holds ~16-20 problems, ordered easy -> hard. Every problem has
   a question, 2-6 do/why steps, and a final answer. LaTeX uses double
   backslashes inside backtick strings.
   ===================================================================== */
(function(){
var P = window.PRACTICE;
function add(id, probs){ P[id] = (P[id] || []).concat(probs); }

/* ================================================================== */
/* probx-derived : Y = g(X) densities, f_Y(y)=f_X(h(y))|h'(y)|        */
/* ================================================================== */
add("probx-derived", [
  {
    q:`<p>$X$ is uniform on $[0,1]$, so $f_X(x)=1$ on $[0,1]$. Let $Y=3X$. Find $f_Y(y)$ and its support.</p>`,
    steps:[
      {do:`Invert $y=3x$ to get $h(y)=y/3$.`, why:`The density formula needs the $x$ that maps to each $y$.`},
      {do:`Slope of inverse: $\\frac{dh}{dy}=\\frac13$.`, why:`This is the local stretch factor in $f_Y(y)=f_X(h(y))|h'(y)|$.`},
      {do:`Plug in: $f_Y(y)=f_X(y/3)\\cdot\\frac13=1\\cdot\\frac13=\\frac13$.`, why:`$f_X=1$ everywhere on its support, so only the Jacobian survives.`},
      {do:`Support: $0\\le x\\le1$ maps to $0\\le y\\le3$.`, why:`Multiplying the interval $[0,1]$ by 3 gives $[0,3]$.`}
    ],
    answer:`$f_Y(y)=\\frac13$ for $0\\le y\\le3$.`
  },
  {
    q:`<p>$X$ is uniform on $[0,1]$. Let $Y=X+2$. Find $f_Y(y)$ and its support.</p>`,
    steps:[
      {do:`Invert: $h(y)=y-2$, with slope $h'(y)=1$.`, why:`A pure shift does not stretch, so $|h'|=1$.`},
      {do:`$f_Y(y)=f_X(y-2)\\cdot1=1$ on the shifted interval.`, why:`Shifting moves the density without changing its height.`},
      {do:`Support shifts from $[0,1]$ to $[2,3]$.`, why:`Adding 2 to every value moves the interval right by 2.`}
    ],
    answer:`$f_Y(y)=1$ for $2\\le y\\le3$.`
  },
  {
    q:`<p>$X$ is uniform on $[0,1]$, $Y=X^2$. Find $f_Y(y)$ on its support.</p>`,
    steps:[
      {do:`Invert with $x\\ge0$: $h(y)=\\sqrt{y}$.`, why:`On $[0,1]$ the map $x\\mapsto x^2$ is one-to-one and increasing.`},
      {do:`Slope: $h'(y)=\\frac{1}{2\\sqrt{y}}$.`, why:`Differentiate $\\sqrt{y}=y^{1/2}$.`},
      {do:`$f_Y(y)=1\\cdot\\frac{1}{2\\sqrt{y}}$ for $0&lt;y\\le1$.`, why:`$f_X(\\sqrt{y})=1$ on $[0,1]$.`}
    ],
    answer:`$f_Y(y)=\\frac{1}{2\\sqrt{y}}$ for $0&lt;y\\le1$.`
  },
  {
    q:`<p>Confirm the density from the previous problem is valid by integrating $\\int_0^1\\frac{1}{2\\sqrt{y}}\\,dy$.</p>`,
    steps:[
      {do:`Antiderivative of $\\frac{1}{2\\sqrt{y}}=\\frac12 y^{-1/2}$ is $\\sqrt{y}$.`, why:`$\\frac{d}{dy}\\sqrt{y}=\\frac{1}{2\\sqrt{y}}$.`},
      {do:`Evaluate $[\\sqrt{y}]_0^1=1-0=1$.`, why:`A valid density must integrate to 1 over its support.`}
    ],
    answer:`$\\int_0^1\\frac{1}{2\\sqrt{y}}\\,dy=1$, so $f_Y$ is a valid density.`
  },
  {
    q:`<p>$X$ is uniform on $[0,1]$. Let $Y=-X+1$. Find $f_Y(y)$ and its support.</p>`,
    steps:[
      {do:`Invert: $y=1-x\\Rightarrow h(y)=1-y$, slope $h'(y)=-1$.`, why:`The map is decreasing, so the slope is negative.`},
      {do:`Take the absolute value: $|h'(y)|=1$.`, why:`A width is never negative; $f_Y=f_X(h(y))|h'(y)|$.`},
      {do:`$f_Y(y)=f_X(1-y)\\cdot1=1$ on $[0,1]$.`, why:`As $x$ runs $0\\to1$, $y=1-x$ runs $1\\to0$, covering $[0,1]$.`}
    ],
    answer:`$f_Y(y)=1$ for $0\\le y\\le1$ (a reflection leaves the uniform unchanged).`
  },
  {
    q:`<p>$X$ has density $f_X(x)=2x$ for $0\\le x\\le1$. Let $Y=2X$. Find $f_Y(y)$.</p>`,
    steps:[
      {do:`Invert: $h(y)=y/2$, slope $\\frac12$.`, why:`Scaling by 2 stretches width and halves height.`},
      {do:`$f_Y(y)=f_X(y/2)\\cdot\\frac12=2\\cdot\\frac{y}{2}\\cdot\\frac12=\\frac{y}{2}$.`, why:`Substitute $x=y/2$ into $f_X(x)=2x$, then multiply by the Jacobian.`},
      {do:`Support: $[0,1]\\to[0,2]$.`, why:`Multiplying the interval by 2.`}
    ],
    answer:`$f_Y(y)=\\frac{y}{2}$ for $0\\le y\\le2$.`
  },
  {
    q:`<p>$X\\sim\\text{Exp}(\\lambda)$ with $f_X(x)=\\lambda e^{-\\lambda x}$, $x\\ge0$. Let $Y=2X$. Find $f_Y(y)$.</p>`,
    steps:[
      {do:`Invert: $h(y)=y/2$, slope $\\frac12$.`, why:`Doubling the variable.`},
      {do:`$f_Y(y)=\\lambda e^{-\\lambda y/2}\\cdot\\frac12=\\frac{\\lambda}{2}e^{-(\\lambda/2)y}$.`, why:`Substitute $x=y/2$ and multiply by $|h'|=\\frac12$.`},
      {do:`Recognize the form $\\mu e^{-\\mu y}$ with $\\mu=\\lambda/2$.`, why:`So $Y$ is exponential with halved rate $\\lambda/2$.`}
    ],
    answer:`$f_Y(y)=\\frac{\\lambda}{2}e^{-(\\lambda/2)y}$, i.e. $Y\\sim\\text{Exp}(\\lambda/2)$.`
  },
  {
    q:`<p>$X\\sim\\text{Exp}(1)$, so $f_X(x)=e^{-x}$, $x\\ge0$. Let $Y=\\sqrt{X}$. Find $f_Y(y)$ for $y\\ge0$.</p>`,
    steps:[
      {do:`Invert: $y=\\sqrt{x}\\Rightarrow x=h(y)=y^2$.`, why:`Square both sides; for $x\\ge0$ this is one-to-one.`},
      {do:`Slope: $h'(y)=2y$.`, why:`Differentiate $y^2$.`},
      {do:`$f_Y(y)=e^{-y^2}\\cdot2y=2y\\,e^{-y^2}$.`, why:`Substitute $x=y^2$ into $e^{-x}$ and multiply by $|h'|=2y$.`}
    ],
    answer:`$f_Y(y)=2y\\,e^{-y^2}$ for $y\\ge0$ (a Rayleigh density).`
  },
  {
    q:`<p>$X$ is uniform on $[0,1]$. Let $Y=-\\ln X$. Find $f_Y(y)$ for $y\\ge0$.</p>`,
    steps:[
      {do:`Invert: $y=-\\ln x\\Rightarrow x=h(y)=e^{-y}$.`, why:`Exponentiate both sides of $-y=\\ln x$.`},
      {do:`Slope: $h'(y)=-e^{-y}$, so $|h'(y)|=e^{-y}$.`, why:`Differentiate $e^{-y}$; take the magnitude.`},
      {do:`$f_Y(y)=f_X(e^{-y})\\cdot e^{-y}=1\\cdot e^{-y}=e^{-y}$.`, why:`$e^{-y}\\in(0,1]$ lies in the support of $X$, where $f_X=1$.`}
    ],
    answer:`$f_Y(y)=e^{-y}$ for $y\\ge0$, i.e. $Y\\sim\\text{Exp}(1)$. (This is the inverse-transform trick.)`
  },
  {
    q:`<p>$X$ has density $f_X$. Let $Y=aX+b$ with $a>0$. Give the general formula for $f_Y(y)$.</p>`,
    steps:[
      {do:`Invert: $y=ax+b\\Rightarrow h(y)=\\frac{y-b}{a}$.`, why:`Solve the linear map for $x$.`},
      {do:`Slope: $h'(y)=\\frac1a$, and $a>0$ so $|h'|=\\frac1a$.`, why:`The constant scaling factor.`},
      {do:`$f_Y(y)=\\frac1a f_X\\!\\left(\\frac{y-b}{a}\\right)$.`, why:`Apply the change-of-variable formula directly.`}
    ],
    answer:`$f_Y(y)=\\frac{1}{a}\\,f_X\\!\\left(\\frac{y-b}{a}\\right)$.`
  },
  {
    q:`<p>Apply the affine rule to $Z=\\frac{X-\\mu}{\\sigma}$ when $X\\sim\\mathcal N(\\mu,\\sigma^2)$ with $f_X(x)=\\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-(x-\\mu)^2/(2\\sigma^2)}$. Show $Z\\sim\\mathcal N(0,1)$.</p>`,
    steps:[
      {do:`Write $Z=aX+b$ with $a=\\frac1\\sigma$, $b=-\\frac\\mu\\sigma$.`, why:`Standardization is an affine map.`},
      {do:`Invert: $h(z)=\\sigma z+\\mu$, $|h'(z)|=\\sigma$.`, why:`The inverse of dividing by $\\sigma$ multiplies by $\\sigma$.`},
      {do:`$f_Z(z)=\\sigma\\cdot\\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-(\\sigma z+\\mu-\\mu)^2/(2\\sigma^2)}=\\frac{1}{\\sqrt{2\\pi}}e^{-z^2/2}$.`, why:`The $\\sigma$ from the Jacobian cancels the $\\sigma$ in the normalizer; the exponent simplifies to $-z^2/2$.`}
    ],
    answer:`$f_Z(z)=\\frac{1}{\\sqrt{2\\pi}}e^{-z^2/2}$, the standard normal $\\mathcal N(0,1)$.`
  },
  {
    q:`<p>$X$ is uniform on $[-1,1]$, so $f_X(x)=\\frac12$. Let $Y=X^2$. Use the CDF method to find $f_Y(y)$ for $0&lt;y&lt;1$.</p>`,
    steps:[
      {do:`$g(x)=x^2$ is not one-to-one on $[-1,1]$, so use $F_Y(y)=P(X^2\\le y)=P(-\\sqrt{y}\\le X\\le\\sqrt{y})$.`, why:`Two branches ($x=\\pm\\sqrt{y}$) map to each $y$; the CDF method handles this.`},
      {do:`$F_Y(y)=\\int_{-\\sqrt{y}}^{\\sqrt{y}}\\frac12\\,dx=\\frac12\\cdot2\\sqrt{y}=\\sqrt{y}$.`, why:`Integrate the constant density over the interval.`},
      {do:`Differentiate: $f_Y(y)=\\frac{d}{dy}\\sqrt{y}=\\frac{1}{2\\sqrt{y}}$.`, why:`The density is the derivative of the CDF.`}
    ],
    answer:`$f_Y(y)=\\frac{1}{2\\sqrt{y}}$ for $0&lt;y&lt;1$.`
  },
  {
    q:`<p>$X\\sim\\text{Exp}(\\lambda)$. Let $Y=e^{X}$. Find $f_Y(y)$ and its support.</p>`,
    steps:[
      {do:`Invert: $y=e^x\\Rightarrow x=h(y)=\\ln y$, valid for $y\\ge1$.`, why:`$x\\ge0$ forces $y=e^x\\ge1$.`},
      {do:`Slope: $h'(y)=\\frac1y$, so $|h'|=\\frac1y$.`, why:`Differentiate $\\ln y$.`},
      {do:`$f_Y(y)=\\lambda e^{-\\lambda\\ln y}\\cdot\\frac1y=\\lambda y^{-\\lambda}\\cdot\\frac1y=\\lambda y^{-\\lambda-1}$.`, why:`$e^{-\\lambda\\ln y}=y^{-\\lambda}$.`}
    ],
    answer:`$f_Y(y)=\\lambda\\,y^{-\\lambda-1}$ for $y\\ge1$ (a Pareto density).`
  },
  {
    q:`<p>$X$ is uniform on $[0,1]$. Let $Y=\\tan\\!\\left(\\pi(X-\\tfrac12)\\right)$. Find $f_Y(y)$ on $(-\\infty,\\infty)$.</p>`,
    steps:[
      {do:`Invert: $y=\\tan(\\pi(x-\\tfrac12))\\Rightarrow x=h(y)=\\frac12+\\frac1\\pi\\arctan y$.`, why:`Apply $\\arctan$ and solve for $x$.`},
      {do:`Slope: $h'(y)=\\frac1\\pi\\cdot\\frac{1}{1+y^2}$.`, why:`$\\frac{d}{dy}\\arctan y=\\frac{1}{1+y^2}$.`},
      {do:`$f_Y(y)=1\\cdot\\frac{1}{\\pi(1+y^2)}$.`, why:`$f_X=1$, multiply by the Jacobian.`}
    ],
    answer:`$f_Y(y)=\\frac{1}{\\pi(1+y^2)}$, the standard Cauchy distribution.`
  },
  {
    q:`<p>$X\\sim\\mathcal N(0,1)$ with $f_X(x)=\\frac{1}{\\sqrt{2\\pi}}e^{-x^2/2}$. Let $Y=X^2$. Find $f_Y(y)$ for $y>0$ (the chi-squared with 1 df).</p>`,
    steps:[
      {do:`$g$ is two-to-one: $F_Y(y)=P(-\\sqrt{y}\\le X\\le\\sqrt{y})=2\\,F_X(\\sqrt{y})-1$.`, why:`By symmetry both branches contribute equally.`},
      {do:`Differentiate: $f_Y(y)=2 f_X(\\sqrt{y})\\cdot\\frac{1}{2\\sqrt{y}}=\\frac{f_X(\\sqrt{y})}{\\sqrt{y}}$.`, why:`Chain rule on $F_X(\\sqrt{y})$, the factor 2 cancels the $\\frac12$.`},
      {do:`Substitute $f_X(\\sqrt{y})=\\frac{1}{\\sqrt{2\\pi}}e^{-y/2}$.`, why:`Square of $\\sqrt{y}$ in the exponent gives $-y/2$.`}
    ],
    answer:`$f_Y(y)=\\frac{1}{\\sqrt{2\\pi y}}e^{-y/2}$ for $y>0$ ($\\chi^2_1$).`
  },
  {
    q:`<p>$X$ is uniform on $[0,1]$ and you want $Y$ with CDF $F(y)=1-e^{-\\lambda y}$ (exponential). What transform $Y=g(X)$ achieves this via inverse-transform sampling?</p>`,
    steps:[
      {do:`Set $U=F(Y)$ where $U=X$ is uniform: solve $X=1-e^{-\\lambda Y}$ for $Y$.`, why:`Inverse-transform: if $U\\sim\\text{Unif}(0,1)$ then $F^{-1}(U)$ has CDF $F$.`},
      {do:`$e^{-\\lambda Y}=1-X\\Rightarrow Y=-\\frac1\\lambda\\ln(1-X)$.`, why:`Take logs and isolate $Y$.`},
      {do:`Since $1-X$ is also uniform on $[0,1]$, $Y=-\\frac1\\lambda\\ln X$ works too.`, why:`Replacing $1-X$ by $X$ gives the same distribution.`}
    ],
    answer:`$Y=-\\frac{1}{\\lambda}\\ln(1-X)$ (equivalently $-\\frac1\\lambda\\ln X$) is exponential with rate $\\lambda$.`
  },
  {
    q:`<p>$X$ has density $f_X(x)=3x^2$ for $0\\le x\\le1$. Let $Y=X^3$. Show $Y$ is uniform on $[0,1]$.</p>`,
    steps:[
      {do:`Invert: $h(y)=y^{1/3}$, slope $h'(y)=\\frac13 y^{-2/3}$.`, why:`$x\\mapsto x^3$ is increasing and one-to-one on $[0,1]$.`},
      {do:`$f_X(y^{1/3})=3(y^{1/3})^2=3y^{2/3}$.`, why:`Substitute $x=y^{1/3}$ into $3x^2$.`},
      {do:`$f_Y(y)=3y^{2/3}\\cdot\\frac13 y^{-2/3}=1$.`, why:`The powers of $y$ cancel exactly.`}
    ],
    answer:`$f_Y(y)=1$ on $[0,1]$ — $Y$ is uniform. (This is the probability integral transform: $Y=F_X(X)$.)`
  },
  {
    q:`<p>$X$ is uniform on $[0,1]$. Let $Y=\\min(X,\\,1-X)$ (distance to the nearest endpoint). Find $f_Y(y)$ for $0\\le y\\le\\tfrac12$.</p>`,
    steps:[
      {do:`$Y\\le y$ fails only in the middle: $P(Y>y)=P(y&lt;X&lt;1-y)=1-2y$.`, why:`$\\min(X,1-X)>y$ means $X$ is at least $y$ from both ends.`},
      {do:`So $F_Y(y)=1-(1-2y)=2y$ for $0\\le y\\le\\tfrac12$.`, why:`Complement of the survival probability.`},
      {do:`Differentiate: $f_Y(y)=2$.`, why:`Density is the derivative of the CDF.`}
    ],
    answer:`$f_Y(y)=2$ for $0\\le y\\le\\tfrac12$ (uniform on $[0,\\tfrac12]$).`
  }
]);

/* ================================================================== */
/* probx-convolution : sums of independent RVs                        */
/* ================================================================== */
add("probx-convolution", [
  {
    q:`<p>Two fair dice. In how many ways can the sum equal 4, and what is $P(Z=4)$?</p>`,
    steps:[
      {do:`List pairs: $(1,3),(2,2),(3,1)$ — three ways.`, why:`Each $X=k$ pairs with $Y=4-k$.`},
      {do:`Each pair has probability $\\frac16\\cdot\\frac16=\\frac{1}{36}$.`, why:`Independent uniform dice.`},
      {do:`Sum: $P(Z=4)=3\\cdot\\frac{1}{36}=\\frac{3}{36}=\\frac{1}{12}$.`, why:`Convolution adds the chances of all matching pairs.`}
    ],
    answer:`3 ways; $P(Z=4)=\\frac{1}{12}$.`
  },
  {
    q:`<p>Two fair dice. What is $P(Z=7)$, the most likely sum?</p>`,
    steps:[
      {do:`Pairs summing to 7: $(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)$ — six ways.`, why:`The middle sum has the most combinations.`},
      {do:`$P(Z=7)=6\\cdot\\frac{1}{36}=\\frac{6}{36}=\\frac16$.`, why:`Each pair is equally likely.`}
    ],
    answer:`$P(Z=7)=\\frac{1}{6}$.`
  },
  {
    q:`<p>$X\\sim\\mathcal N(0,1)$ and $Y\\sim\\mathcal N(0,1)$ are independent. Find the distribution of $Z=X+Y$.</p>`,
    steps:[
      {do:`Add means: $0+0=0$.`, why:`The mean of a sum is the sum of means.`},
      {do:`Add variances: $1+1=2$.`, why:`Independent normals add variances (never standard deviations).`},
      {do:`The sum of independent normals is normal.`, why:`Convolution of two Gaussians is Gaussian.`}
    ],
    answer:`$Z\\sim\\mathcal N(0,2)$.`
  },
  {
    q:`<p>$X\\sim\\mathcal N(3,4)$ and $Y\\sim\\mathcal N(1,9)$ are independent (variances 4 and 9). Find the distribution of $X+Y$.</p>`,
    steps:[
      {do:`Mean: $3+1=4$.`, why:`Means add.`},
      {do:`Variance: $4+9=13$.`, why:`Independent variances add.`}
    ],
    answer:`$X+Y\\sim\\mathcal N(4,13)$.`
  },
  {
    q:`<p>$X\\sim\\mathcal N(5,4)$ and $Y\\sim\\mathcal N(2,1)$ are independent. Find the distribution of $X-Y$.</p>`,
    steps:[
      {do:`Mean of $X-Y$: $5-2=3$.`, why:`The mean of a difference subtracts.`},
      {do:`Variance of $X-Y$: $\\text{Var}(X)+(-1)^2\\text{Var}(Y)=4+1=5$.`, why:`Variance scales by the square of the coefficient, so subtraction still adds variances.`}
    ],
    answer:`$X-Y\\sim\\mathcal N(3,5)$.`
  },
  {
    q:`<p>$X\\sim\\text{Poisson}(2)$ and $Y\\sim\\text{Poisson}(3)$ are independent. Find the distribution of $X+Y$.</p>`,
    steps:[
      {do:`Convolving two Poisson PMFs gives a Poisson.`, why:`A known closure property (provable via MGFs).`},
      {do:`The rate adds: $\\lambda=2+3=5$.`, why:`The mean of a Poisson is its rate, and means add.`}
    ],
    answer:`$X+Y\\sim\\text{Poisson}(5)$.`
  },
  {
    q:`<p>$X$ and $Y$ are independent each uniform on $\\{1,2,3\\}$ (a 3-sided die). Find the full PMF of $Z=X+Y$.</p>`,
    steps:[
      {do:`Possible sums run 2 to 6; count pairs for each.`, why:`Convolution counts how many $(x,y)$ hit each sum.`},
      {do:`Counts: $2{:}1,\\;3{:}2,\\;4{:}3,\\;5{:}2,\\;6{:}1$ (total 9).`, why:`E.g. sum 4 from $(1,3),(2,2),(3,1)$.`},
      {do:`Divide each by 9.`, why:`Each pair has probability $\\frac13\\cdot\\frac13=\\frac19$.`}
    ],
    answer:`$P(Z)=\\frac19,\\frac29,\\frac39,\\frac29,\\frac19$ for $Z=2,3,4,5,6$ (a triangle peaking at 4).`
  },
  {
    q:`<p>$X$ and $Y$ are independent uniform on $[0,1]$. Find $f_Z(z)$ for $0\\le z\\le1$ where $Z=X+Y$.</p>`,
    steps:[
      {do:`Convolution: $f_Z(z)=\\int_{-\\infty}^{\\infty}f_X(x)f_Y(z-x)\\,dx$.`, why:`Both densities equal 1 only inside $[0,1]$.`},
      {do:`For $0\\le z\\le1$ the overlap is $0\\le x\\le z$: $f_Z(z)=\\int_0^z 1\\cdot1\\,dx=z$.`, why:`Both $x\\in[0,1]$ and $z-x\\in[0,1]$ require $0\\le x\\le z$.`}
    ],
    answer:`$f_Z(z)=z$ for $0\\le z\\le1$ (rising edge of the triangular density).`
  },
  {
    q:`<p>Continue the previous problem: find $f_Z(z)$ for $1\\le z\\le2$.</p>`,
    steps:[
      {do:`Constraints $x\\in[0,1]$ and $z-x\\in[0,1]$ give $z-1\\le x\\le1$.`, why:`For $z>1$ the lower limit rises to keep $z-x\\le1$.`},
      {do:`$f_Z(z)=\\int_{z-1}^{1}1\\,dx=1-(z-1)=2-z$.`, why:`Length of the overlap interval.`}
    ],
    answer:`$f_Z(z)=2-z$ for $1\\le z\\le2$ (falling edge; full triangle peaks at $z=1$).`
  },
  {
    q:`<p>$X_1,\\dots,X_n$ are independent $\\mathcal N(\\mu,\\sigma^2)$. Find the distribution of the sum $S=\\sum_i X_i$.</p>`,
    steps:[
      {do:`Means add: $E[S]=n\\mu$.`, why:`Linearity of expectation.`},
      {do:`Variances add: $\\text{Var}(S)=n\\sigma^2$.`, why:`Independence lets variances add.`},
      {do:`The sum of normals is normal.`, why:`Repeated Gaussian convolution stays Gaussian.`}
    ],
    answer:`$S\\sim\\mathcal N(n\\mu,\\,n\\sigma^2)$.`
  },
  {
    q:`<p>For the same $n$ iid $\\mathcal N(\\mu,\\sigma^2)$, find the distribution of the sample mean $\\bar X=\\frac1n\\sum_i X_i$.</p>`,
    steps:[
      {do:`$\\bar X=\\frac1n S$ where $S\\sim\\mathcal N(n\\mu,n\\sigma^2)$.`, why:`Scaling a normal by a constant keeps it normal.`},
      {do:`Mean: $\\frac1n\\cdot n\\mu=\\mu$.`, why:`Scale the mean by $\\frac1n$.`},
      {do:`Variance: $\\frac{1}{n^2}\\cdot n\\sigma^2=\\frac{\\sigma^2}{n}$.`, why:`Variance scales by $(\\frac1n)^2$.`}
    ],
    answer:`$\\bar X\\sim\\mathcal N\\!\\left(\\mu,\\frac{\\sigma^2}{n}\\right)$.`
  },
  {
    q:`<p>$X\\sim\\text{Binomial}(3,p)$ and $Y\\sim\\text{Binomial}(5,p)$ are independent with the same $p$. Find the distribution of $X+Y$.</p>`,
    steps:[
      {do:`Each binomial counts independent Bernoulli($p$) trials.`, why:`Binomial$(n,p)$ is a sum of $n$ iid Bernoulli($p$).`},
      {do:`The combined count is $3+5=8$ trials, all Bernoulli($p$).`, why:`Stacking independent trial-counts adds the $n$.`}
    ],
    answer:`$X+Y\\sim\\text{Binomial}(8,p)$.`
  },
  {
    q:`<p>$X\\sim\\text{Exp}(\\lambda)$ and $Y\\sim\\text{Exp}(\\lambda)$ are independent (same rate). Find $f_Z(z)$ for $Z=X+Y$, $z\\ge0$.</p>`,
    steps:[
      {do:`Convolution: $f_Z(z)=\\int_0^z \\lambda e^{-\\lambda x}\\,\\lambda e^{-\\lambda(z-x)}\\,dx$.`, why:`Both are zero for negative arguments, so $x$ ranges over $[0,z]$.`},
      {do:`The exponents combine: $e^{-\\lambda x}e^{-\\lambda(z-x)}=e^{-\\lambda z}$ (independent of $x$).`, why:`$-\\lambda x-\\lambda z+\\lambda x=-\\lambda z$.`},
      {do:`$f_Z(z)=\\lambda^2 e^{-\\lambda z}\\int_0^z dx=\\lambda^2 z\\,e^{-\\lambda z}$.`, why:`The integral of 1 over $[0,z]$ is $z$.`}
    ],
    answer:`$f_Z(z)=\\lambda^2 z\\,e^{-\\lambda z}$ for $z\\ge0$ (Gamma with shape 2, rate $\\lambda$).`
  },
  {
    q:`<p>A request passes through 3 independent services, each with latency $\\mathcal N(20,\\,9)$ ms (variance 9). Find the distribution of total latency, then the standard deviation.</p>`,
    steps:[
      {do:`Mean: $3\\times20=60$ ms.`, why:`Means add across stages.`},
      {do:`Variance: $3\\times9=27$.`, why:`Independent stage variances add.`},
      {do:`SD: $\\sqrt{27}\\approx5.196$ ms.`, why:`Standard deviation is the square root of variance.`}
    ],
    answer:`Total $\\sim\\mathcal N(60,27)$; SD $\\approx5.20$ ms.`
  },
  {
    q:`<p>Two independent dice are biased: each shows 1 with prob $0.7$ and 2 with prob $0.3$. Find the PMF of $Z=X+Y$.</p>`,
    steps:[
      {do:`$Z=2$ needs $(1,1)$: $0.7\\times0.7=0.49$.`, why:`Only one pair gives sum 2.`},
      {do:`$Z=3$ needs $(1,2)$ or $(2,1)$: $0.7\\cdot0.3+0.3\\cdot0.7=0.42$.`, why:`Two ordered pairs.`},
      {do:`$Z=4$ needs $(2,2)$: $0.3\\times0.3=0.09$.`, why:`Only one pair gives sum 4.`}
    ],
    answer:`$P(Z=2)=0.49,\\;P(Z=3)=0.42,\\;P(Z=4)=0.09$ (sums to 1).`
  },
  {
    q:`<p>$X\\sim\\mathcal N(0,\\sigma_1^2)$ and $Y\\sim\\mathcal N(0,\\sigma_2^2)$ are independent. For constants $a,b$, find the distribution of $aX+bY$.</p>`,
    steps:[
      {do:`Mean stays 0: $a\\cdot0+b\\cdot0=0$.`, why:`Both inputs are centered at 0.`},
      {do:`Variance: $a^2\\sigma_1^2+b^2\\sigma_2^2$.`, why:`$\\text{Var}(aX)=a^2\\text{Var}(X)$; independence adds the two.`},
      {do:`Linear combos of independent normals are normal.`, why:`Convolution + scaling preserves Gaussianity.`}
    ],
    answer:`$aX+bY\\sim\\mathcal N\\!\\left(0,\\;a^2\\sigma_1^2+b^2\\sigma_2^2\\right)$.`
  },
  {
    q:`<p>A random walk takes $n=100$ independent steps, each $\\pm1$ with equal probability (mean 0, variance 1). Approximate the distribution of the final position $S_{100}$.</p>`,
    steps:[
      {do:`Sum of mean: $100\\times0=0$.`, why:`Each step is symmetric.`},
      {do:`Sum of variance: $100\\times1=100$.`, why:`Independent step variances add.`},
      {do:`By the CLT (convolution pile-up), $S_{100}\\approx\\mathcal N(0,100)$.`, why:`Many small independent contributions converge to a normal.`}
    ],
    answer:`$S_{100}\\approx\\mathcal N(0,100)$, SD $=10$.`
  },
  {
    q:`<p>$X$ and $Y$ are independent, $X\\sim\\text{Exp}(\\lambda_1)$, $Y\\sim\\text{Exp}(\\lambda_2)$ with $\\lambda_1\\ne\\lambda_2$. Set up the convolution for $f_Z(z)$, $Z=X+Y$, $z\\ge0$, and simplify.</p>`,
    steps:[
      {do:`$f_Z(z)=\\int_0^z \\lambda_1 e^{-\\lambda_1 x}\\,\\lambda_2 e^{-\\lambda_2(z-x)}\\,dx$.`, why:`Convolve over the valid range $x\\in[0,z]$.`},
      {do:`Factor out $e^{-\\lambda_2 z}$: $\\lambda_1\\lambda_2 e^{-\\lambda_2 z}\\int_0^z e^{-(\\lambda_1-\\lambda_2)x}dx$.`, why:`Group the $x$-dependent exponent.`},
      {do:`Integrate: $\\int_0^z e^{-(\\lambda_1-\\lambda_2)x}dx=\\frac{1-e^{-(\\lambda_1-\\lambda_2)z}}{\\lambda_1-\\lambda_2}$.`, why:`Standard exponential integral (valid since $\\lambda_1\\ne\\lambda_2$).`}
    ],
    answer:`$f_Z(z)=\\frac{\\lambda_1\\lambda_2}{\\lambda_1-\\lambda_2}\\left(e^{-\\lambda_2 z}-e^{-\\lambda_1 z}\\right)$ for $z\\ge0$.`
  }
]);

/* ================================================================== */
/* probx-total-variance : Var(X)=E[Var(X|Y)]+Var(E[X|Y])             */
/* ================================================================== */
add("probx-total-variance", [
  {
    q:`<p>Two equal-sized groups. Group 1: variance 10. Group 2: variance 20. Find the within-group term $E[\\text{Var}(X\\mid Y)]$.</p>`,
    steps:[
      {do:`Average the group variances: $\\frac12(10)+\\frac12(20)$.`, why:`The within term is the expected conditional variance.`},
      {do:`$=5+10=15$.`, why:`Equal group sizes weight each by $\\frac12$.`}
    ],
    answer:`$E[\\text{Var}(X\\mid Y)]=15$.`
  },
  {
    q:`<p>Two equal-sized groups with means 40 and 60. Find the grand mean and the between-group term $\\text{Var}(E[X\\mid Y])$.</p>`,
    steps:[
      {do:`Grand mean: $\\frac12(40)+\\frac12(60)=50$.`, why:`Average of the group means (equal sizes).`},
      {do:`Between: $\\frac12(40-50)^2+\\frac12(60-50)^2=\\frac12(100)+\\frac12(100)$.`, why:`Variance of the conditional mean about the grand mean.`},
      {do:`$=50+50=100$.`, why:`Both deviations are $\\pm10$, squared to 100.`}
    ],
    answer:`Grand mean 50; between-group variance $=100$.`
  },
  {
    q:`<p>Combine: two equal groups, means 70 and 80, each variance 25. Find $\\text{Var}(X)$ for a random member.</p>`,
    steps:[
      {do:`Within: $\\frac12(25)+\\frac12(25)=25$.`, why:`Average of equal conditional variances.`},
      {do:`Grand mean 75; between: $\\frac12(70-75)^2+\\frac12(80-75)^2=25$.`, why:`Spread of group means about 75.`},
      {do:`Total: $25+25=50$.`, why:`Law of total variance adds the two parts.`}
    ],
    answer:`$\\text{Var}(X)=50$.`
  },
  {
    q:`<p>Verify the previous answer directly using $\\text{Var}(X)=E[X^2]-(E[X])^2$.</p>`,
    steps:[
      {do:`$E[X^2\\mid Y]=\\text{Var}+\\text{mean}^2$: group 1 $=25+70^2=4925$, group 2 $=25+80^2=6425$.`, why:`Reverse the variance shortcut inside each group.`},
      {do:`$E[X^2]=\\frac12(4925)+\\frac12(6425)=5675$.`, why:`Average over the two groups.`},
      {do:`$\\text{Var}(X)=5675-75^2=5675-5625=50$.`, why:`Subtract the squared grand mean.`}
    ],
    answer:`$\\text{Var}(X)=50$, matching the decomposition.`
  },
  {
    q:`<p>Three equal-sized groups, all with variance 9, means 1, 2, 3. Find the within-group term.</p>`,
    steps:[
      {do:`Each group weighted $\\frac13$.`, why:`Equal sizes.`},
      {do:`$\\frac13(9)+\\frac13(9)+\\frac13(9)=9$.`, why:`Average of identical variances is that variance.`}
    ],
    answer:`$E[\\text{Var}(X\\mid Y)]=9$.`
  },
  {
    q:`<p>Same three groups (means 1, 2, 3, equal sizes). Find the between-group term.</p>`,
    steps:[
      {do:`Grand mean: $\\frac{1+2+3}{3}=2$.`, why:`Mean of equally weighted group means.`},
      {do:`Between: $\\frac13[(1-2)^2+(2-2)^2+(3-2)^2]=\\frac13[1+0+1]$.`, why:`Variance of the group means about 2.`},
      {do:`$=\\frac23\\approx0.667$.`, why:`Sum of squared deviations divided by 3.`}
    ],
    answer:`$\\text{Var}(E[X\\mid Y])=\\frac23$; total $\\text{Var}(X)=9+\\frac23=\\frac{29}{3}\\approx9.667$.`
  },
  {
    q:`<p>A coin flip $Y$ (heads with prob $0.5$) decides which die you roll. Heads: a die with mean 3.5, variance 2.9. Tails: a die with mean 3.5, variance 2.9. Find $\\text{Var}(X)$.</p>`,
    steps:[
      {do:`Within: $0.5(2.9)+0.5(2.9)=2.9$.`, why:`Both conditional variances equal 2.9.`},
      {do:`Both group means equal 3.5, so between $=0$.`, why:`No spread between identical means.`},
      {do:`Total $=2.9+0=2.9$.`, why:`Knowing $Y$ explains nothing here.`}
    ],
    answer:`$\\text{Var}(X)=2.9$ (between-group term vanishes).`
  },
  {
    q:`<p>Unequal groups: group A has weight $0.7$ (mean 10, variance 4); group B weight $0.3$ (mean 20, variance 16). Find the within-group term.</p>`,
    steps:[
      {do:`Weight each conditional variance by its probability: $0.7(4)+0.3(16)$.`, why:`$E[\\text{Var}(X\\mid Y)]$ averages with group probabilities.`},
      {do:`$=2.8+4.8=7.6$.`, why:`Compute the weighted sum.`}
    ],
    answer:`$E[\\text{Var}(X\\mid Y)]=7.6$.`
  },
  {
    q:`<p>Same unequal groups (A: weight $0.7$, mean 10; B: weight $0.3$, mean 20). Find the between-group term.</p>`,
    steps:[
      {do:`Grand mean: $0.7(10)+0.3(20)=7+6=13$.`, why:`Probability-weighted average of group means.`},
      {do:`Between: $0.7(10-13)^2+0.3(20-13)^2=0.7(9)+0.3(49)$.`, why:`Weighted squared deviations from 13.`},
      {do:`$=6.3+14.7=21$.`, why:`Add the weighted terms.`}
    ],
    answer:`$\\text{Var}(E[X\\mid Y])=21$; total $\\text{Var}(X)=7.6+21=28.6$.`
  },
  {
    q:`<p>$Y\\sim\\text{Bernoulli}(p)$ and $X\\mid Y=y$ has mean $\\mu_y$ and the same variance $\\sigma^2$. Write $\\text{Var}(X)$ in terms of $p,\\mu_0,\\mu_1,\\sigma^2$.</p>`,
    steps:[
      {do:`Within: $E[\\text{Var}(X\\mid Y)]=(1-p)\\sigma^2+p\\sigma^2=\\sigma^2$.`, why:`Both groups share variance $\\sigma^2$.`},
      {do:`$E[X\\mid Y]$ takes $\\mu_0$ w.p. $1-p$, $\\mu_1$ w.p. $p$: its variance is $p(1-p)(\\mu_1-\\mu_0)^2$.`, why:`A two-point variable's variance is $p(1-p)$ times the squared gap.`}
    ],
    answer:`$\\text{Var}(X)=\\sigma^2+p(1-p)(\\mu_1-\\mu_0)^2$.`
  },
  {
    q:`<p>Apply that formula with $p=0.5$, $\\mu_0=0$, $\\mu_1=4$, $\\sigma^2=1$. Compute $\\text{Var}(X)$.</p>`,
    steps:[
      {do:`Within: $\\sigma^2=1$.`, why:`Shared conditional variance.`},
      {do:`Between: $p(1-p)(\\mu_1-\\mu_0)^2=0.5\\cdot0.5\\cdot16=4$.`, why:`$0.25\\times16$.`},
      {do:`Total: $1+4=5$.`, why:`Add the parts.`}
    ],
    answer:`$\\text{Var}(X)=5$.`
  },
  {
    q:`<p>$N\\sim\\text{Poisson}(\\lambda)$ counts customers; each spends $X_i$ with mean $\\mu$, variance $\\sigma^2$, independent. For the total $S=\\sum_{i=1}^N X_i$, the conditional mean is $E[S\\mid N]=N\\mu$ and conditional variance $\\text{Var}(S\\mid N)=N\\sigma^2$. Find $\\text{Var}(S)$.</p>`,
    steps:[
      {do:`Within: $E[\\text{Var}(S\\mid N)]=E[N\\sigma^2]=\\lambda\\sigma^2$.`, why:`$E[N]=\\lambda$ for a Poisson.`},
      {do:`Between: $\\text{Var}(E[S\\mid N])=\\text{Var}(N\\mu)=\\mu^2\\text{Var}(N)=\\mu^2\\lambda$.`, why:`$\\text{Var}(N)=\\lambda$; scale by $\\mu^2$.`},
      {do:`Total: $\\lambda\\sigma^2+\\lambda\\mu^2=\\lambda(\\sigma^2+\\mu^2)$.`, why:`Law of total variance.`}
    ],
    answer:`$\\text{Var}(S)=\\lambda(\\sigma^2+\\mu^2)$ (the compound-Poisson variance).`
  },
  {
    q:`<p>A mixture: with prob $0.5$, $X\\sim\\mathcal N(0,1)$; with prob $0.5$, $X\\sim\\mathcal N(10,1)$. Find $\\text{Var}(X)$.</p>`,
    steps:[
      {do:`Within: $0.5(1)+0.5(1)=1$.`, why:`Both components have variance 1.`},
      {do:`Grand mean: $0.5(0)+0.5(10)=5$.`, why:`Average of the two means.`},
      {do:`Between: $0.5(0-5)^2+0.5(10-5)^2=25$.`, why:`Spread of component means about 5.`},
      {do:`Total: $1+25=26$.`, why:`The far-apart means dominate the variance.`}
    ],
    answer:`$\\text{Var}(X)=26$.`
  },
  {
    q:`<p>Knowing $Y$ explains a fraction of $X$'s variance: $R^2=\\frac{\\text{Var}(E[X\\mid Y])}{\\text{Var}(X)}$. If between-group variance is 30 and within-group variance is 10, find $R^2$.</p>`,
    steps:[
      {do:`Total variance: $30+10=40$.`, why:`Sum of between and within.`},
      {do:`$R^2=\\frac{30}{40}=0.75$.`, why:`Between-group share of the total.`}
    ],
    answer:`$R^2=0.75$ — knowing the group explains 75% of the variance.`
  },
  {
    q:`<p>Roll a fair die to get $Y\\in\\{1,\\dots,6\\}$, then let $X=Y$ exactly (no within-group noise). Use the law of total variance to find $\\text{Var}(X)$, and check it equals the die variance.</p>`,
    steps:[
      {do:`Within: $\\text{Var}(X\\mid Y)=0$ since $X=Y$ is fixed given $Y$.`, why:`No scatter inside a group of one value.`},
      {do:`$E[X\\mid Y]=Y$, so between $=\\text{Var}(Y)$.`, why:`The conditional mean is $Y$ itself.`},
      {do:`$\\text{Var}(Y)=\\frac{(6^2-1)}{12}=\\frac{35}{12}\\approx2.917$.`, why:`Variance of a uniform die.`}
    ],
    answer:`$\\text{Var}(X)=0+\\frac{35}{12}=\\frac{35}{12}\\approx2.92$, matching the die.`
  },
  {
    q:`<p>$X\\mid \\Theta=\\theta\\sim\\text{Binomial}(n,\\theta)$ and $\\Theta\\sim\\text{Uniform}(0,1)$ (so $E[\\Theta]=\\tfrac12$, $\\text{Var}(\\Theta)=\\tfrac{1}{12}$). Using $E[X\\mid\\Theta]=n\\Theta$ and $\\text{Var}(X\\mid\\Theta)=n\\Theta(1-\\Theta)$, find $\\text{Var}(X)$ for $n=10$.</p>`,
    steps:[
      {do:`Within: $E[n\\Theta(1-\\Theta)]=n(E[\\Theta]-E[\\Theta^2])$.`, why:`Expand and use linearity.`},
      {do:`$E[\\Theta^2]=\\text{Var}(\\Theta)+E[\\Theta]^2=\\frac{1}{12}+\\frac14=\\frac13$, so within $=10(\\tfrac12-\\tfrac13)=10\\cdot\\tfrac16=\\tfrac53$.`, why:`Compute the second moment, then plug in.`},
      {do:`Between: $\\text{Var}(n\\Theta)=n^2\\text{Var}(\\Theta)=100\\cdot\\frac{1}{12}=\\frac{100}{12}=\\frac{25}{3}$.`, why:`Scale $\\Theta$'s variance by $n^2$.`},
      {do:`Total: $\\frac53+\\frac{25}{3}=\\frac{30}{3}=10$.`, why:`Add within and between.`}
    ],
    answer:`$\\text{Var}(X)=10$.`
  },
  {
    q:`<p>An ensemble averages $m=4$ independent models, each predicting the same target with bias-free error variance $\\sigma^2=8$ within a group, and 0 between groups (identical means). After averaging, the within-group variance becomes $\\sigma^2/m$. Find the new total variance.</p>`,
    steps:[
      {do:`Averaging $m$ independent estimates divides the variance by $m$: $8/4=2$.`, why:`Variance of a mean of $m$ iid terms is $\\sigma^2/m$.`},
      {do:`Between-group term is 0 (means identical).`, why:`No explained spread.`},
      {do:`Total $=2+0=2$.`, why:`Law of total variance with zero between-term.`}
    ],
    answer:`New total variance $=2$ (ensembling shrinks the within-group term).`
  },
  {
    q:`<p>Suppose between-group variance is fixed at 12. As within-group variance shrinks from 8 to 2 (better-separated groups), how does the explained fraction $R^2$ change?</p>`,
    steps:[
      {do:`At within $=8$: total $=12+8=20$, $R^2=\\frac{12}{20}=0.6$.`, why:`Between share of the larger total.`},
      {do:`At within $=2$: total $=12+2=14$, $R^2=\\frac{12}{14}\\approx0.857$.`, why:`Same between, smaller total.`},
      {do:`$R^2$ rises from 0.6 to about 0.857.`, why:`Less internal scatter makes the grouping more explanatory.`}
    ],
    answer:`$R^2$ increases from $0.60$ to $\\approx0.86$.`
  }
]);

/* ================================================================== */
/* probx-mgf : M_X(t)=E[e^{tX}], moments via derivatives at 0         */
/* ================================================================== */
add("probx-mgf", [
  {
    q:`<p>What is $M_X(0)$ for any random variable $X$, and why?</p>`,
    steps:[
      {do:`$M_X(0)=E[e^{0\\cdot X}]=E[1]$.`, why:`Set $t=0$, so $e^{tX}=e^0=1$.`},
      {do:`$E[1]=1$.`, why:`A density integrates (or a PMF sums) to 1.`}
    ],
    answer:`$M_X(0)=1$ always.`
  },
  {
    q:`<p>Given $M_X(t)=e^{2t}$, find $E[X]$.</p>`,
    steps:[
      {do:`Differentiate: $M_X'(t)=2e^{2t}$.`, why:`The mean is $M_X'(0)$.`},
      {do:`Evaluate at 0: $M_X'(0)=2$.`, why:`$e^0=1$.`}
    ],
    answer:`$E[X]=2$. (This is the MGF of the constant $X=2$.)`
  },
  {
    q:`<p>$M_X(t)=e^{2t+3t^2}$. Find $E[X]$.</p>`,
    steps:[
      {do:`$M_X'(t)=(2+6t)e^{2t+3t^2}$.`, why:`Product/chain rule on the exponential.`},
      {do:`$M_X'(0)=(2+0)\\cdot1=2$.`, why:`Set $t=0$.`}
    ],
    answer:`$E[X]=2$.`
  },
  {
    q:`<p>For $M_X(t)=e^{2t+3t^2}$, find $E[X^2]$.</p>`,
    steps:[
      {do:`$M_X''(t)=\\big[6+(2+6t)^2\\big]e^{2t+3t^2}$.`, why:`Differentiate $M_X'=(2+6t)e^{(\\cdot)}$ with the product rule.`},
      {do:`$M_X''(0)=(6+4)\\cdot1=10$.`, why:`Set $t=0$: $(2)^2=4$.`}
    ],
    answer:`$E[X^2]=10$.`
  },
  {
    q:`<p>Using the two previous results, find $\\text{Var}(X)$ for $M_X(t)=e^{2t+3t^2}$.</p>`,
    steps:[
      {do:`$\\text{Var}(X)=E[X^2]-(E[X])^2=10-2^2$.`, why:`Variance shortcut.`},
      {do:`$=10-4=6$.`, why:`This is $\\mathcal N(2,6)$.`}
    ],
    answer:`$\\text{Var}(X)=6$.`
  },
  {
    q:`<p>$X\\sim\\text{Exp}(\\lambda)$ has $M_X(t)=\\frac{\\lambda}{\\lambda-t}$ for $t<\\lambda$. Find $E[X]$.</p>`,
    steps:[
      {do:`$M_X'(t)=\\frac{\\lambda}{(\\lambda-t)^2}$.`, why:`Differentiate $\\lambda(\\lambda-t)^{-1}$, chain rule gives $+\\lambda(\\lambda-t)^{-2}$.`},
      {do:`$M_X'(0)=\\frac{\\lambda}{\\lambda^2}=\\frac1\\lambda$.`, why:`Set $t=0$.`}
    ],
    answer:`$E[X]=\\frac{1}{\\lambda}$.`
  },
  {
    q:`<p>For the exponential MGF $\\frac{\\lambda}{\\lambda-t}$, find $E[X^2]$ and $\\text{Var}(X)$.</p>`,
    steps:[
      {do:`$M_X''(t)=\\frac{2\\lambda}{(\\lambda-t)^3}$.`, why:`Differentiate $\\lambda(\\lambda-t)^{-2}$.`},
      {do:`$M_X''(0)=\\frac{2\\lambda}{\\lambda^3}=\\frac{2}{\\lambda^2}=E[X^2]$.`, why:`Set $t=0$.`},
      {do:`$\\text{Var}(X)=\\frac{2}{\\lambda^2}-\\frac{1}{\\lambda^2}=\\frac{1}{\\lambda^2}$.`, why:`Subtract $(E[X])^2=1/\\lambda^2$.`}
    ],
    answer:`$E[X^2]=\\frac{2}{\\lambda^2}$, $\\text{Var}(X)=\\frac{1}{\\lambda^2}$.`
  },
  {
    q:`<p>A Bernoulli($p$) variable has $M_X(t)=1-p+pe^{t}$. Find $E[X]$.</p>`,
    steps:[
      {do:`$M_X'(t)=pe^{t}$.`, why:`Only the $pe^t$ term depends on $t$.`},
      {do:`$M_X'(0)=p$.`, why:`$e^0=1$.`}
    ],
    answer:`$E[X]=p$.`
  },
  {
    q:`<p>For the Bernoulli MGF $1-p+pe^t$, find $\\text{Var}(X)$.</p>`,
    steps:[
      {do:`$M_X''(t)=pe^t$, so $E[X^2]=M_X''(0)=p$.`, why:`Second derivative of $pe^t$ is again $pe^t$.`},
      {do:`$\\text{Var}(X)=p-p^2=p(1-p)$.`, why:`Variance shortcut $E[X^2]-(E[X])^2$.`}
    ],
    answer:`$\\text{Var}(X)=p(1-p)$.`
  },
  {
    q:`<p>$X\\sim\\mathcal N(\\mu,\\sigma^2)$ has $M_X(t)=e^{\\mu t+\\frac12\\sigma^2 t^2}$. Recover $E[X]$.</p>`,
    steps:[
      {do:`$M_X'(t)=(\\mu+\\sigma^2 t)e^{\\mu t+\\frac12\\sigma^2 t^2}$.`, why:`Chain rule; the inner derivative is $\\mu+\\sigma^2 t$.`},
      {do:`$M_X'(0)=\\mu\\cdot1=\\mu$.`, why:`Set $t=0$.`}
    ],
    answer:`$E[X]=\\mu$.`
  },
  {
    q:`<p>For the normal MGF $e^{\\mu t+\\frac12\\sigma^2 t^2}$, find $E[X^2]$ and confirm $\\text{Var}(X)=\\sigma^2$.</p>`,
    steps:[
      {do:`$M_X''(t)=\\big[\\sigma^2+(\\mu+\\sigma^2 t)^2\\big]e^{\\mu t+\\frac12\\sigma^2 t^2}$.`, why:`Differentiate $M_X'$ by the product rule.`},
      {do:`$M_X''(0)=\\sigma^2+\\mu^2$.`, why:`Set $t=0$: inner term is $\\mu^2$.`},
      {do:`$\\text{Var}(X)=(\\sigma^2+\\mu^2)-\\mu^2=\\sigma^2$.`, why:`Subtract $(E[X])^2=\\mu^2$.`}
    ],
    answer:`$E[X^2]=\\sigma^2+\\mu^2$, $\\text{Var}(X)=\\sigma^2$.`
  },
  {
    q:`<p>$X$ and $Y$ are independent with $M_X(t)=e^{t+t^2}$ and $M_Y(t)=e^{3t+2t^2}$. Find $M_{X+Y}(t)$ and identify $X+Y$.</p>`,
    steps:[
      {do:`For independent sums, multiply: $M_{X+Y}(t)=M_X(t)M_Y(t)$.`, why:`$e^{tX}$ and $e^{tY}$ are independent, so the expectation factors.`},
      {do:`$=e^{t+t^2}\\cdot e^{3t+2t^2}=e^{4t+3t^2}$.`, why:`Add exponents.`},
      {do:`Match $e^{\\mu t+\\frac12\\sigma^2 t^2}$: $\\mu=4$, $\\frac12\\sigma^2=3\\Rightarrow\\sigma^2=6$.`, why:`Read off the normal parameters.`}
    ],
    answer:`$M_{X+Y}(t)=e^{4t+3t^2}$, so $X+Y\\sim\\mathcal N(4,6)$.`
  },
  {
    q:`<p>$X\\sim\\text{Poisson}(\\lambda)$ has $M_X(t)=e^{\\lambda(e^t-1)}$. Find $E[X]$.</p>`,
    steps:[
      {do:`$M_X'(t)=\\lambda e^t\\,e^{\\lambda(e^t-1)}$.`, why:`Chain rule: derivative of the exponent is $\\lambda e^t$.`},
      {do:`$M_X'(0)=\\lambda\\cdot1\\cdot e^{0}=\\lambda$.`, why:`At $t=0$ the outer factor is 1.`}
    ],
    answer:`$E[X]=\\lambda$.`
  },
  {
    q:`<p>For the Poisson MGF $e^{\\lambda(e^t-1)}$, find $E[X^2]$ and $\\text{Var}(X)$.</p>`,
    steps:[
      {do:`$M_X''(t)=\\big[\\lambda e^t+(\\lambda e^t)^2\\big]e^{\\lambda(e^t-1)}$.`, why:`Differentiate $M_X'=\\lambda e^t e^{(\\cdot)}$ with the product rule.`},
      {do:`$M_X''(0)=\\lambda+\\lambda^2=E[X^2]$.`, why:`Set $t=0$.`},
      {do:`$\\text{Var}(X)=(\\lambda+\\lambda^2)-\\lambda^2=\\lambda$.`, why:`Subtract $(E[X])^2=\\lambda^2$.`}
    ],
    answer:`$E[X^2]=\\lambda+\\lambda^2$, $\\text{Var}(X)=\\lambda$.`
  },
  {
    q:`<p>Two independent $\\text{Poisson}(\\lambda_1)$ and $\\text{Poisson}(\\lambda_2)$ have MGFs $e^{\\lambda_1(e^t-1)}$ and $e^{\\lambda_2(e^t-1)}$. Prove their sum is Poisson.</p>`,
    steps:[
      {do:`Multiply MGFs: $e^{\\lambda_1(e^t-1)}e^{\\lambda_2(e^t-1)}$.`, why:`Independent sum multiplies MGFs.`},
      {do:`$=e^{(\\lambda_1+\\lambda_2)(e^t-1)}$.`, why:`Add exponents and factor out $(e^t-1)$.`},
      {do:`This is the Poisson MGF with rate $\\lambda_1+\\lambda_2$.`, why:`The MGF uniquely determines the distribution.`}
    ],
    answer:`Sum $\\sim\\text{Poisson}(\\lambda_1+\\lambda_2)$.`
  },
  {
    q:`<p>Read moments off a series. If $M_X(t)=1+2t+\\frac{5}{2}t^2+\\frac{7}{6}t^3+\\cdots$, find $E[X]$, $E[X^2]$, and $E[X^3]$.</p>`,
    steps:[
      {do:`Match $M_X(t)=\\sum_n\\frac{t^n}{n!}E[X^n]$.`, why:`The MGF's Taylor coefficients carry the moments.`},
      {do:`Coefficient of $t$: $E[X]=2$. Of $t^2$: $\\frac{E[X^2]}{2!}=\\frac52\\Rightarrow E[X^2]=5$.`, why:`Multiply the $t^2$ coefficient by $2!$.`},
      {do:`Of $t^3$: $\\frac{E[X^3]}{3!}=\\frac76\\Rightarrow E[X^3]=7$.`, why:`Multiply by $3!=6$.`}
    ],
    answer:`$E[X]=2,\\;E[X^2]=5,\\;E[X^3]=7$.`
  },
  {
    q:`<p>Use the MGF to build a Chernoff bound: for any $t>0$, bound $P(X\\ge a)$ in terms of $M_X(t)$.</p>`,
    steps:[
      {do:`For $t>0$, $X\\ge a\\iff e^{tX}\\ge e^{ta}$.`, why:`$e^{tx}$ is increasing, so the inequality is preserved.`},
      {do:`Apply Markov: $P(e^{tX}\\ge e^{ta})\\le\\frac{E[e^{tX}]}{e^{ta}}$.`, why:`Markov's inequality on the nonnegative variable $e^{tX}$.`},
      {do:`So $P(X\\ge a)\\le e^{-ta}M_X(t)$, then minimize over $t$.`, why:`The tightest bound picks the best $t$.`}
    ],
    answer:`$P(X\\ge a)\\le \\min_{t>0} e^{-ta}M_X(t)$ — the Chernoff bound.`
  },
  {
    q:`<p>Apply the Chernoff bound to $X\\sim\\mathcal N(0,1)$ (MGF $e^{t^2/2}$) to bound $P(X\\ge a)$ for $a>0$. Optimize over $t$.</p>`,
    steps:[
      {do:`Bound: $P(X\\ge a)\\le e^{-ta}e^{t^2/2}=e^{t^2/2-ta}$.`, why:`Plug the normal MGF into the Chernoff form.`},
      {do:`Minimize the exponent $\\frac{t^2}{2}-ta$: derivative $t-a=0\\Rightarrow t=a$.`, why:`Set the derivative to zero.`},
      {do:`At $t=a$: exponent $=\\frac{a^2}{2}-a^2=-\\frac{a^2}{2}$.`, why:`Substitute $t=a$ back.`}
    ],
    answer:`$P(X\\ge a)\\le e^{-a^2/2}$ — the standard Gaussian tail bound.`
  }
]);

/* ================================================================== */
/* mlx-newton : theta <- theta - H^{-1} grad J                        */
/* ================================================================== */
add("mlx-newton", [
  {
    q:`<p>Minimize $J(\\theta)=3\\theta^2-12\\theta+7$. State the slope $J'$ and curvature $J''$.</p>`,
    steps:[
      {do:`$J'(\\theta)=6\\theta-12$.`, why:`Differentiate term by term.`},
      {do:`$J''(\\theta)=6$.`, why:`Derivative of $6\\theta-12$ is the constant 6.`}
    ],
    answer:`$J'(\\theta)=6\\theta-12$, $J''(\\theta)=6$.`
  },
  {
    q:`<p>For $J(\\theta)=3\\theta^2-12\\theta+7$ ($J'=6\\theta-12$, $J''=6$), start at $\\theta_0=5$ and take one Newton step.</p>`,
    steps:[
      {do:`Slope: $J'(5)=30-12=18$.`, why:`Evaluate the gradient at $\\theta_0$.`},
      {do:`Newton step: $\\theta=5-\\frac{18}{6}=5-3=2$.`, why:`Update $\\theta\\leftarrow\\theta-J'/J''$.`}
    ],
    answer:`$\\theta=2$ (the exact minimum, in one step).`
  },
  {
    q:`<p>Confirm $\\theta=2$ is the minimum of $J(\\theta)=3\\theta^2-12\\theta+7$.</p>`,
    steps:[
      {do:`$J'(2)=12-12=0$.`, why:`A zero slope marks a stationary point.`},
      {do:`$J''(2)=6>0$.`, why:`Positive curvature means it is a minimum (a bowl).`}
    ],
    answer:`Yes — $J'(2)=0$ and $J''(2)>0$, so $\\theta=2$ is the minimum.`
  },
  {
    q:`<p>$J(\\theta)=2\\theta^2-8\\theta+5$ ($J'=4\\theta-8$, $J''=4$). Start at $\\theta_0=10$ and take one Newton step.</p>`,
    steps:[
      {do:`Slope: $J'(10)=40-8=32$.`, why:`Gradient at the start.`},
      {do:`Step: $\\theta=10-\\frac{32}{4}=10-8=2$.`, why:`Newton update.`}
    ],
    answer:`$\\theta=2$ (lands at the minimum in one step).`
  },
  {
    q:`<p>Why does Newton's method reach the minimum of any quadratic in exactly one step?</p>`,
    steps:[
      {do:`A quadratic has constant curvature $J''$.`, why:`Its second-order Taylor model equals the function exactly.`},
      {do:`Newton jumps to the bottom of that parabola.`, why:`The step $-J'/J''$ solves $J'(\\theta)=0$ exactly.`}
    ],
    answer:`Because the local parabola is the true function, so one step is exact.`
  },
  {
    q:`<p>To minimize $f(x)=x^4$, Newton's update for a root of $f'$ uses $x\\leftarrow x-\\frac{f'(x)}{f''(x)}$. With $f'=4x^3$, $f''=12x^2$, take one step from $x_0=1$.</p>`,
    steps:[
      {do:`$f'(1)=4$, $f''(1)=12$.`, why:`Evaluate derivatives at $x_0=1$.`},
      {do:`$x=1-\\frac{4}{12}=1-\\frac13=\\frac23\\approx0.667$.`, why:`Apply the update.`}
    ],
    answer:`$x=\\frac23\\approx0.667$ (Newton converges only linearly here since curvature vanishes at the min).`
  },
  {
    q:`<p>Newton's method as a root-finder: solve $g(x)=x^2-2=0$ (i.e. find $\\sqrt2$) via $x\\leftarrow x-\\frac{g(x)}{g'(x)}$. Start at $x_0=1$, take one step.</p>`,
    steps:[
      {do:`$g(1)=1-2=-1$, $g'(x)=2x$ so $g'(1)=2$.`, why:`Evaluate the function and its derivative.`},
      {do:`$x=1-\\frac{-1}{2}=1+0.5=1.5$.`, why:`Newton-Raphson update.`}
    ],
    answer:`$x_1=1.5$.`
  },
  {
    q:`<p>Continue: from $x_1=1.5$, take a second Newton step toward $\\sqrt2$ for $g(x)=x^2-2$.</p>`,
    steps:[
      {do:`$g(1.5)=2.25-2=0.25$, $g'(1.5)=3$.`, why:`Evaluate at the new point.`},
      {do:`$x_2=1.5-\\frac{0.25}{3}=1.5-0.0833\\approx1.4167$.`, why:`Update.`}
    ],
    answer:`$x_2\\approx1.4167$ (true $\\sqrt2\\approx1.41421$ — already 3 correct digits).`
  },
  {
    q:`<p>For $J(\\theta)=\\theta^2$ ($J'=2\\theta$, $J''=2$), compare Newton to gradient descent with learning rate $\\alpha=0.1$ from $\\theta_0=10$: one step each.</p>`,
    steps:[
      {do:`Newton: $\\theta=10-\\frac{2\\cdot10}{2}=10-10=0$.`, why:`Hits the minimum at 0 immediately.`},
      {do:`GD: $\\theta=10-0.1\\cdot(2\\cdot10)=10-2=8$.`, why:`Gradient descent only knows the slope.`}
    ],
    answer:`Newton reaches 0 in one step; GD reaches only 8 after one step.`
  },
  {
    q:`<p>Multivariate: $J(\\theta)=\\theta_1^2+4\\theta_2^2$. Give the gradient $\\nabla J$ and Hessian $H$.</p>`,
    steps:[
      {do:`$\\nabla J=\\begin{bmatrix}2\\theta_1\\\\8\\theta_2\\end{bmatrix}$.`, why:`Partial derivatives in each coordinate.`},
      {do:`$H=\\begin{bmatrix}2&0\\\\0&8\\end{bmatrix}$.`, why:`Second partials; cross terms are zero.`}
    ],
    answer:`$\\nabla J=(2\\theta_1,\\,8\\theta_2)$, $H=\\text{diag}(2,8)$.`
  },
  {
    q:`<p>Take one Newton step on $J(\\theta)=\\theta_1^2+4\\theta_2^2$ from $\\theta_0=(3,1)$ using $\\theta\\leftarrow\\theta-H^{-1}\\nabla J$.</p>`,
    steps:[
      {do:`$\\nabla J(3,1)=(6,8)$; $H^{-1}=\\text{diag}(\\tfrac12,\\tfrac18)$.`, why:`Invert a diagonal Hessian by reciprocating diagonal entries.`},
      {do:`$H^{-1}\\nabla J=(\\tfrac12\\cdot6,\\;\\tfrac18\\cdot8)=(3,1)$.`, why:`Element-wise product for diagonal matrices.`},
      {do:`$\\theta=(3,1)-(3,1)=(0,0)$.`, why:`Subtract the Newton direction.`}
    ],
    answer:`$\\theta=(0,0)$ — the minimum, reached in one step.`
  },
  {
    q:`<p>Newton for logistic-regression-style 1-D log-likelihood. Maximizing $\\ell(\\theta)$ means solving $\\ell'(\\theta)=0$ via $\\theta\\leftarrow\\theta-\\frac{\\ell'(\\theta)}{\\ell''(\\theta)}$. With $\\ell'(\\theta)=4-2\\theta$ and $\\ell''(\\theta)=-2$, start at $\\theta_0=0$.</p>`,
    steps:[
      {do:`$\\ell'(0)=4$, $\\ell''(0)=-2$.`, why:`Evaluate the score and its derivative.`},
      {do:`$\\theta=0-\\frac{4}{-2}=0+2=2$.`, why:`Newton update (works for maxima too, since it finds $\\ell'=0$).`}
    ],
    answer:`$\\theta=2$ — the maximizer, since $\\ell'(2)=0$.`
  },
  {
    q:`<p>Why can each parameter need a different effective step size, and how does $H$ provide it for $J(\\theta)=\\theta_1^2+100\\theta_2^2$?</p>`,
    steps:[
      {do:`Curvatures differ: $H=\\text{diag}(2,200)$.`, why:`The $\\theta_2$ direction is 100x steeper.`},
      {do:`$H^{-1}=\\text{diag}(\\tfrac12,\\tfrac{1}{200})$ rescales each coordinate by its own curvature.`, why:`Newton divides the gradient by curvature per direction.`}
    ],
    answer:`Newton automatically takes a small step in the steep ($\\theta_2$) direction and a larger step in the flat ($\\theta_1$) direction via $H^{-1}$.`
  },
  {
    q:`<p>A pitfall: at $\\theta_0=0$ for $J(\\theta)=\\theta^3$ ($J'=3\\theta^2$, $J''=6\\theta$), what happens to the Newton step?</p>`,
    steps:[
      {do:`$J''(0)=0$, so the step $-J'/J''$ divides by zero.`, why:`Newton needs nonzero curvature.`},
      {do:`The update is undefined (no parabola to jump to).`, why:`A flat/inflection point breaks the second-order model.`}
    ],
    answer:`The step is undefined — Newton fails where the Hessian is singular ($J''=0$).`
  },
  {
    q:`<p>Quadratic convergence: if Newton's error roughly squares each step and the current error is $0.1$, estimate the errors after the next two steps.</p>`,
    steps:[
      {do:`Next error $\\approx(0.1)^2=0.01$.`, why:`Quadratic convergence squares the error (up to a constant).`},
      {do:`Following error $\\approx(0.01)^2=0.0001$.`, why:`Square again.`}
    ],
    answer:`$\\approx0.01$ then $\\approx0.0001$ — the number of correct digits roughly doubles each step.`
  },
  {
    q:`<p>Damped Newton: when the step is too large, use $\\theta\\leftarrow\\theta-\\eta\\,H^{-1}\\nabla J$ with $0<\\eta\\le1$. For $J=\\theta^2$ ($J'=2\\theta,\\,J''=2$) from $\\theta_0=10$ with $\\eta=0.5$, take one step.</p>`,
    steps:[
      {do:`Full Newton direction: $H^{-1}\\nabla J=\\frac{2\\cdot10}{2}=10$.`, why:`The undamped step.`},
      {do:`Damped: $\\theta=10-0.5\\cdot10=5$.`, why:`Scale the step by $\\eta=0.5$.`}
    ],
    answer:`$\\theta=5$ (damping trades one-step exactness for stability).`
  },
  {
    q:`<p>Cost trade-off: Newton needs $H^{-1}$. For a model with $d$ parameters, give the rough cost of forming and inverting $H$, and say why huge models avoid it.</p>`,
    steps:[
      {do:`$H$ is $d\\times d$, costing $O(d^2)$ storage.`, why:`One entry per pair of parameters.`},
      {do:`Inverting (or solving) is about $O(d^3)$.`, why:`Standard dense linear algebra.`}
    ],
    answer:`$O(d^2)$ memory and $\\sim O(d^3)$ time — prohibitive for million-parameter models, so they use first-order methods (or L-BFGS).`
  }
]);

/* ================================================================== */
/* mlx-lwr : Gaussian weights w=exp(-(xi-x)^2 / 2 tau^2)               */
/* ================================================================== */
add("mlx-lwr", [
  {
    q:`<p>Bandwidth $\\tau=1$. A training point sits exactly at the query ($x^{(i)}=x$). What weight does it get?</p>`,
    steps:[
      {do:`Distance is 0: $w=\\exp\\!\\left(-\\frac{0^2}{2\\cdot1^2}\\right)=\\exp(0)$.`, why:`Plug a zero gap into the Gaussian weight.`},
      {do:`$\\exp(0)=1$.`, why:`The closest point gets the maximum weight.`}
    ],
    answer:`$w=1$.`
  },
  {
    q:`<p>Bandwidth $\\tau=1$, query $x=0$. Find the weight of a point at $x^{(i)}=2$.</p>`,
    steps:[
      {do:`Gap squared: $(2-0)^2=4$.`, why:`Distance enters squared.`},
      {do:`$w=\\exp\\!\\left(-\\frac{4}{2\\cdot1}\\right)=\\exp(-2)\\approx0.135$.`, why:`$2\\tau^2=2$.`}
    ],
    answer:`$w\\approx0.135$.`
  },
  {
    q:`<p>Bandwidth $\\tau=2$, query $x=0$. Find the weight of a point at distance 4.</p>`,
    steps:[
      {do:`$w=\\exp\\!\\left(-\\frac{4^2}{2\\cdot2^2}\\right)=\\exp\\!\\left(-\\frac{16}{8}\\right)$.`, why:`$2\\tau^2=8$.`},
      {do:`$=\\exp(-2)\\approx0.135$.`, why:`Compute the exponent.`}
    ],
    answer:`$w\\approx0.135$.`
  },
  {
    q:`<p>Which counts for more: a point at distance 1 with $\\tau=0.5$, or the same point with $\\tau=2$?</p>`,
    steps:[
      {do:`$\\tau=0.5$: $w=\\exp\\!\\left(-\\frac{1}{2\\cdot0.25}\\right)=\\exp(-2)\\approx0.135$.`, why:`Small $\\tau$ shrinks the bell sharply.`},
      {do:`$\\tau=2$: $w=\\exp\\!\\left(-\\frac{1}{2\\cdot4}\\right)=\\exp(-0.125)\\approx0.882$.`, why:`Large $\\tau$ keeps far points relevant.`}
    ],
    answer:`The $\\tau=2$ case ($w\\approx0.88$) weights it far more than $\\tau=0.5$ ($w\\approx0.135$).`
  },
  {
    q:`<p>Query $x=2$, $\\tau=1$. Compute weights for three points at $x^{(1)}=2$, $x^{(2)}=3$, $x^{(3)}=6$.</p>`,
    steps:[
      {do:`$w^{(1)}=\\exp(0)=1$.`, why:`Distance 0.`},
      {do:`$w^{(2)}=\\exp\\!\\left(-\\frac{1}{2}\\right)\\approx0.607$.`, why:`Gap 1, $2\\tau^2=2$.`},
      {do:`$w^{(3)}=\\exp\\!\\left(-\\frac{16}{2}\\right)=\\exp(-8)\\approx0.000335$.`, why:`Gap 4 squared is 16.`}
    ],
    answer:`$w^{(1)}=1,\\;w^{(2)}\\approx0.607,\\;w^{(3)}\\approx0.000335$ (the far point is essentially ignored).`
  },
  {
    q:`<p>As $\\tau\\to\\infty$, what happens to all the weights, and what does LWR reduce to?</p>`,
    steps:[
      {do:`Each exponent $-\\frac{(x^{(i)}-x)^2}{2\\tau^2}\\to0$.`, why:`A huge denominator kills the gap term.`},
      {do:`So every $w^{(i)}\\to1$ (all equal).`, why:`$\\exp(0)=1$ for every point.`}
    ],
    answer:`All weights become equal — LWR reduces to ordinary (unweighted) linear regression, which underfits curvy data.`
  },
  {
    q:`<p>As $\\tau\\to0$, what happens to the fit, qualitatively?</p>`,
    steps:[
      {do:`Only points essentially at the query keep nonzero weight.`, why:`The bell collapses to a spike.`},
      {do:`The local line chases each point individually.`, why:`Almost no smoothing.`}
    ],
    answer:`The fit becomes wiggly and overfits noise — high variance.`
  },
  {
    q:`<p>Weighted least squares with all weights equal ($W=I$). What does the solution $\\theta=(X^\\top W X)^{-1}X^\\top W y$ become?</p>`,
    steps:[
      {do:`Set $W=I$: $\\theta=(X^\\top X)^{-1}X^\\top y$.`, why:`The identity drops out of the products.`},
      {do:`This is the ordinary least squares (normal equations) solution.`, why:`Equal weights = no localization.`}
    ],
    answer:`$\\theta=(X^\\top X)^{-1}X^\\top y$ — ordinary least squares.`
  },
  {
    q:`<p>A weighted mean predictor: at a query, weights are $w=(0.1,0.6,1.0,0.6,0.1)$ for $y$-values $(2,3,4,5,6)$. Compute the weighted prediction $\\hat y=\\frac{\\sum w_i y_i}{\\sum w_i}$.</p>`,
    steps:[
      {do:`Numerator: $0.1(2)+0.6(3)+1.0(4)+0.6(5)+0.1(6)=0.2+1.8+4+3+0.6=9.6$.`, why:`Weighted sum of targets.`},
      {do:`Denominator: $0.1+0.6+1.0+0.6+0.1=2.4$.`, why:`Sum of weights.`},
      {do:`$\\hat y=\\frac{9.6}{2.4}=4$.`, why:`Symmetric weights center the estimate at 4.`}
    ],
    answer:`$\\hat y=4$.`
  },
  {
    q:`<p>Two points at $x^{(1)}=0$ ($y=1$) and $x^{(2)}=4$ ($y=9$). Query $x=0$, bandwidth $\\tau=1$. Using a weighted-average (constant) local fit, predict $\\hat y$.</p>`,
    steps:[
      {do:`$w^{(1)}=\\exp(0)=1$; $w^{(2)}=\\exp\\!\\left(-\\frac{16}{2}\\right)=e^{-8}\\approx0.000335$.`, why:`Distances 0 and 4.`},
      {do:`$\\hat y=\\frac{1\\cdot1+0.000335\\cdot9}{1+0.000335}\\approx\\frac{1.003}{1.000335}\\approx1.003$.`, why:`Weighted average; the far point barely shifts it.`}
    ],
    answer:`$\\hat y\\approx1.00$ — dominated by the nearby point.`
  },
  {
    q:`<p>Same two points, but query at $x=4$, $\\tau=1$. Predict $\\hat y$ with the weighted average.</p>`,
    steps:[
      {do:`Now $w^{(1)}=e^{-8}\\approx0.000335$, $w^{(2)}=1$.`, why:`Distances flip: point 2 is at the query.`},
      {do:`$\\hat y=\\frac{0.000335\\cdot1+1\\cdot9}{0.000335+1}\\approx9.00$.`, why:`The local point dominates.`}
    ],
    answer:`$\\hat y\\approx9.00$ — the fit bends from 1 near $x=0$ to 9 near $x=4$, tracing the data.`
  },
  {
    q:`<p>Why is LWR called <i>non-parametric</i>?</p>`,
    steps:[
      {do:`It keeps all training data and refits per query.`, why:`No fixed finite parameter vector is learned once and reused.`},
      {do:`Model complexity grows with the data.`, why:`More data means more local fits are possible.`}
    ],
    answer:`Because it stores the data and computes a fresh local fit on demand, rather than learning one fixed parameter set.`
  },
  {
    q:`<p>A point lies at distance $d$ with weight $w=0.25$ under bandwidth $\\tau$. Solve for $d$ in terms of $\\tau$.</p>`,
    steps:[
      {do:`$0.25=\\exp\\!\\left(-\\frac{d^2}{2\\tau^2}\\right)$, so $\\ln0.25=-\\frac{d^2}{2\\tau^2}$.`, why:`Take logs of both sides.`},
      {do:`$d^2=-2\\tau^2\\ln0.25=2\\tau^2\\ln4$.`, why:`$-\\ln0.25=\\ln4\\approx1.386$.`},
      {do:`$d=\\tau\\sqrt{2\\ln4}\\approx1.665\\,\\tau$.`, why:`Take the square root.`}
    ],
    answer:`$d=\\tau\\sqrt{2\\ln4}\\approx1.67\\,\\tau$.`
  },
  {
    q:`<p>Set up the weighted normal equations for a single query. Given the weighted sums $S_w,S_{wx},S_{wy},S_{wxx},S_{wxy}$, give the slope $m$ and intercept $b$ of the local line.</p>`,
    steps:[
      {do:`The $2\\times2$ weighted system is $\\begin{bmatrix}S_w&S_{wx}\\\\S_{wx}&S_{wxx}\\end{bmatrix}\\begin{bmatrix}b\\\\m\\end{bmatrix}=\\begin{bmatrix}S_{wy}\\\\S_{wxy}\\end{bmatrix}$.`, why:`These are $X^\\top W X\\,\\theta=X^\\top W y$ written out.`},
      {do:`Determinant: $\\det=S_w S_{wxx}-S_{wx}^2$.`, why:`Needed to invert the $2\\times2$ matrix.`},
      {do:`Solve by Cramer's rule.`, why:`Standard $2\\times2$ inversion.`}
    ],
    answer:`$m=\\frac{S_w S_{wxy}-S_{wx}S_{wy}}{\\det}$, $b=\\frac{S_{wxx}S_{wy}-S_{wx}S_{wxy}}{\\det}$.`
  },
  {
    q:`<p>Tiny example: two weighted points $(x,y,w)=(0,1,1)$ and $(2,5,1)$ (equal weights). Find the local line's slope and intercept via the sums.</p>`,
    steps:[
      {do:`$S_w=2$, $S_{wx}=0+2=2$, $S_{wy}=1+5=6$, $S_{wxx}=0+4=4$, $S_{wxy}=0+10=10$.`, why:`Accumulate the weighted sums.`},
      {do:`$\\det=2\\cdot4-2^2=4$. Slope $m=\\frac{2\\cdot10-2\\cdot6}{4}=\\frac{8}{4}=2$.`, why:`Apply the slope formula.`},
      {do:`Intercept $b=\\frac{4\\cdot6-2\\cdot10}{4}=\\frac{4}{4}=1$.`, why:`Apply the intercept formula.`}
    ],
    answer:`Line $\\hat y=2x+1$ (passes through both points, as expected for two points).`
  },
  {
    q:`<p>Bandwidth as a bias-variance dial: match each regime to its error type. (a) very small $\\tau$, (b) very large $\\tau$.</p>`,
    steps:[
      {do:`Small $\\tau$: the curve chases noise, low bias but high variance.`, why:`Few points dominate each local fit.`},
      {do:`Large $\\tau$: nearly one straight line, high bias but low variance.`, why:`All points blend, washing out local structure.`}
    ],
    answer:`(a) small $\\tau$ = overfit (high variance); (b) large $\\tau$ = underfit (high bias). Tune $\\tau$ by cross-validation.`
  },
  {
    q:`<p>For a Gaussian kernel, what fraction of full weight does a point at exactly $\\tau$ (one bandwidth away) receive?</p>`,
    steps:[
      {do:`Distance $=\\tau$: exponent $-\\frac{\\tau^2}{2\\tau^2}=-\\frac12$.`, why:`The gap equals the bandwidth.`},
      {do:`$w=\\exp(-0.5)\\approx0.607$.`, why:`Compute the exponential.`}
    ],
    answer:`About $0.607$ (61%) of full weight at one bandwidth away.`
  }
]);

/* ================================================================== */
/* mlx-cross-validation : CV = (1/k) sum Err_j                        */
/* ================================================================== */
add("mlx-cross-validation", [
  {
    q:`<p>With $k=4$ folds the round errors are $0.20,0.24,0.22,0.26$. Find the CV error.</p>`,
    steps:[
      {do:`Sum: $0.20+0.24+0.22+0.26=0.92$.`, why:`CV averages the per-fold errors.`},
      {do:`Divide by $k=4$: $\\frac{0.92}{4}=0.23$.`, why:`Average of 4 numbers.`}
    ],
    answer:`$\\text{CV}=0.23$.`
  },
  {
    q:`<p>$k=5$ folds give errors $0.30,0.26,0.34,0.28,0.32$. Find the CV error.</p>`,
    steps:[
      {do:`Sum: $0.30+0.26+0.34+0.28+0.32=1.50$.`, why:`Add the five round errors.`},
      {do:`$\\frac{1.50}{5}=0.30$.`, why:`Average.`}
    ],
    answer:`$\\text{CV}=0.30$.`
  },
  {
    q:`<p>You have 100 examples and use $k=5$ folds. How big is each fold, and how many examples train in each round?</p>`,
    steps:[
      {do:`Fold size: $100/5=20$.`, why:`Equal slices.`},
      {do:`Each round trains on $k-1=4$ folds: $4\\times20=80$.`, why:`One fold is held out for validation.`}
    ],
    answer:`Each fold has 20 examples; each round trains on 80 and validates on 20.`
  },
  {
    q:`<p>How many times is each example used for validation across all $k$ folds, and how many times for training?</p>`,
    steps:[
      {do:`Each example sits in exactly one fold.`, why:`Folds partition the data.`},
      {do:`It is validated in the one round that holds out its fold, and trains in the other $k-1$.`, why:`Every fold takes one turn as the validation set.`}
    ],
    answer:`Validated exactly once; trained on $k-1$ times.`
  },
  {
    q:`<p>Leave-one-out CV (LOOCV): with $m=50$ examples, how many folds, and how many models must you train?</p>`,
    steps:[
      {do:`LOOCV sets $k=m$, one example per fold.`, why:`Each fold is a single point.`},
      {do:`So you train $m=50$ models.`, why:`One per held-out example.`}
    ],
    answer:`50 folds, 50 models trained.`
  },
  {
    q:`<p>Two models are compared by 4-fold CV. Model A errors: $0.30,0.32,0.28,0.30$. Model B: $0.31,0.29,0.33,0.27$. Which wins?</p>`,
    steps:[
      {do:`CV(A) $=\\frac{0.30+0.32+0.28+0.30}{4}=\\frac{1.20}{4}=0.30$.`, why:`Average A's folds.`},
      {do:`CV(B) $=\\frac{0.31+0.29+0.33+0.27}{4}=\\frac{1.20}{4}=0.30$.`, why:`Average B's folds.`},
      {do:`They tie on the mean; compare variability to break the tie.`, why:`Equal CV means look at stability.`}
    ],
    answer:`Both have CV $=0.30$ — a tie on mean error.`
  },
  {
    q:`<p>Why is a single 80/20 train/test split noisier than 5-fold CV?</p>`,
    steps:[
      {do:`A single split scores on one random 20% only.`, why:`The estimate depends heavily on which points landed in the test set.`},
      {do:`CV averages 5 such estimates.`, why:`Averaging reduces variance.`}
    ],
    answer:`CV averages over all 5 held-out folds, cutting the variance of a single lucky/unlucky split.`
  },
  {
    q:`<p>Show CV is unbiased: if each $\\text{Err}_j$ has expectation $\\mu$, find $E[\\text{CV}]$.</p>`,
    steps:[
      {do:`$E[\\text{CV}]=\\frac1k\\sum_{j=1}^k E[\\text{Err}_j]=\\frac1k\\sum_{j=1}^k\\mu$.`, why:`Linearity of expectation.`},
      {do:`$=\\frac1k\\cdot k\\mu=\\mu$.`, why:`There are $k$ identical terms.`}
    ],
    answer:`$E[\\text{CV}]=\\mu$ — the average is unbiased.`
  },
  {
    q:`<p>If the $k$ fold errors were independent each with variance $\\sigma^2$, find $\\text{Var}(\\text{CV})$ for $k=10$, $\\sigma^2=0.04$.</p>`,
    steps:[
      {do:`$\\text{Var}(\\text{CV})=\\frac{1}{k^2}\\sum_j\\sigma^2=\\frac{\\sigma^2}{k}$.`, why:`Variance of an average of $k$ independent terms.`},
      {do:`$=\\frac{0.04}{10}=0.004$.`, why:`Plug in.`}
    ],
    answer:`$\\text{Var}(\\text{CV})=0.004$ (SD $\\approx0.063$).`
  },
  {
    q:`<p>In practice folds share training data, so they are correlated. Does the variance fall faster or slower than $\\sigma^2/k$?</p>`,
    steps:[
      {do:`Positive correlation adds covariance terms to the variance.`, why:`$\\text{Var}(\\text{mean})$ includes pairwise covariances when terms are dependent.`},
      {do:`These extra positive terms keep the variance above $\\sigma^2/k$.`, why:`Correlated estimates carry redundant information.`}
    ],
    answer:`Slower than $\\sigma^2/k$ — correlation means more folds help, but with diminishing returns.`
  },
  {
    q:`<p>Hyperparameter tuning: regularization $\\lambda\\in\\{0.1,1,10\\}$ gives 3-fold CV errors of (0.40,0.42,0.38), (0.30,0.31,0.29), (0.35,0.34,0.36) respectively. Which $\\lambda$ do you pick?</p>`,
    steps:[
      {do:`CV($\\lambda{=}0.1$)$=\\frac{1.20}{3}=0.40$.`, why:`Average its three folds.`},
      {do:`CV($\\lambda{=}1$)$=\\frac{0.90}{3}=0.30$; CV($\\lambda{=}10$)$=\\frac{1.05}{3}=0.35$.`, why:`Average each.`},
      {do:`Pick the smallest CV error.`, why:`Lowest validation error wins.`}
    ],
    answer:`Choose $\\lambda=1$ (CV $=0.30$, the lowest).`
  },
  {
    q:`<p>Stratified CV: a binary dataset is 90% class 0, 10% class 1. Why stratify the folds?</p>`,
    steps:[
      {do:`Random folds might leave a fold with no class-1 examples.`, why:`Rare classes can be missing by chance.`},
      {do:`Stratification keeps each fold at ~10% class 1.`, why:`It preserves the class ratio per fold.`}
    ],
    answer:`To ensure every fold reflects the true class proportions, giving stable, representative validation scores.`
  },
  {
    q:`<p>Computational cost: 10-fold CV over a grid of 20 hyperparameter settings. How many model fits total?</p>`,
    steps:[
      {do:`Each setting needs 10 fits (one per fold).`, why:`k-fold trains $k$ models.`},
      {do:`$10\\times20=200$.`, why:`Multiply by the grid size.`}
    ],
    answer:`200 model fits.`
  },
  {
    q:`<p>Nested CV: an outer 5-fold loop wraps an inner 4-fold loop used to tune over 10 settings. How many model fits does evaluating one outer fold's inner search require?</p>`,
    steps:[
      {do:`Inner search: $4$ folds $\\times10$ settings $=40$ fits.`, why:`The inner CV tunes hyperparameters.`},
      {do:`Plus 1 refit on the outer training set with the chosen setting.`, why:`After tuning, fit once before scoring the outer fold.`}
    ],
    answer:`41 fits per outer fold (40 inner + 1 refit); 205 total across the 5 outer folds.`
  },
  {
    q:`<p>A common leak: you standardize features using the whole dataset's mean/std, then run CV. Why does this bias the CV estimate optimistically?</p>`,
    steps:[
      {do:`The scaling used info from the validation folds.`, why:`Their statistics leaked into preprocessing.`},
      {do:`So validation folds are no longer truly unseen.`, why:`The model indirectly saw them.`}
    ],
    answer:`It leaks test information, making CV error look lower than the true generalization error. Fit scalers inside each training fold only.`
  },
  {
    q:`<p>5x2 CV: repeat 2-fold CV five times with different splits, giving 10 error estimates. Why prefer this over a single 2-fold run?</p>`,
    steps:[
      {do:`A single 2-fold split is high-variance (trains on only 50%).`, why:`Few folds, big estimate noise.`},
      {do:`Repeating with new shuffles and averaging reduces that noise.`, why:`More independent-ish estimates to average.`}
    ],
    answer:`Repetition averages over multiple random partitions, stabilizing the estimate for model comparison.`
  }
]);

/* ================================================================== */
/* mlx-model-selection : AIC=2k-2lnL, BIC=k ln n - 2lnL               */
/* ================================================================== */
add("mlx-model-selection", [
  {
    q:`<p>A model has $k=5$ parameters and log-likelihood $\\ln L=-50$. Compute its AIC.</p>`,
    steps:[
      {do:`$\\text{AIC}=2k-2\\ln L=2(5)-2(-50)$.`, why:`Plug into the AIC formula.`},
      {do:`$=10+100=110$.`, why:`$-2(-50)=100$.`}
    ],
    answer:`$\\text{AIC}=110$.`
  },
  {
    q:`<p>Same model ($k=5$, $\\ln L=-50$) on $n=100$ data points. Compute its BIC.</p>`,
    steps:[
      {do:`$\\ln n=\\ln100\\approx4.605$.`, why:`BIC's penalty per parameter is $\\ln n$.`},
      {do:`$\\text{BIC}=k\\ln n-2\\ln L=5(4.605)+100$.`, why:`$-2(-50)=100$.`},
      {do:`$=23.03+100=123.03$.`, why:`Add.`}
    ],
    answer:`$\\text{BIC}\\approx123.0$.`
  },
  {
    q:`<p>Lower is better for AIC. Model A: AIC $=246$. Model B: AIC $=248$. Which do you keep?</p>`,
    steps:[
      {do:`Compare directly: $246<248$.`, why:`AIC scores misfit plus penalty; smaller wins.`},
      {do:`Keep the smaller.`, why:`Best fit/complexity trade-off.`}
    ],
    answer:`Keep Model A (AIC 246).`
  },
  {
    q:`<p>Two models, $n=100$. A: $k=3$, $\\ln L=-120$. B: $k=8$, $\\ln L=-116$. Compute both AICs.</p>`,
    steps:[
      {do:`AIC(A) $=2(3)-2(-120)=6+240=246$.`, why:`Plug in A.`},
      {do:`AIC(B) $=2(8)-2(-116)=16+232=248$.`, why:`Plug in B.`}
    ],
    answer:`AIC(A) $=246$, AIC(B) $=248$ — A wins despite B fitting slightly better.`
  },
  {
    q:`<p>For the same two models, compute both BICs ($n=100$, $\\ln100\\approx4.605$) and say which wins.</p>`,
    steps:[
      {do:`BIC(A) $=3(4.605)+240=13.82+240=253.8$.`, why:`$k\\ln n-2\\ln L$.`},
      {do:`BIC(B) $=8(4.605)+232=36.84+232=268.8$.`, why:`Plug in B.`},
      {do:`A is much lower.`, why:`BIC penalizes B's extra parameters harder.`}
    ],
    answer:`BIC(A) $\\approx253.8$, BIC(B) $\\approx268.8$ — A wins by a wider margin than under AIC.`
  },
  {
    q:`<p>At what sample size $n$ does BIC's per-parameter penalty $\\ln n$ exceed AIC's penalty of 2?</p>`,
    steps:[
      {do:`Solve $\\ln n>2$.`, why:`Compare the two penalties.`},
      {do:`$n>e^2\\approx7.39$.`, why:`Exponentiate.`}
    ],
    answer:`For $n\\ge8$ (i.e. $n>e^2\\approx7.39$), BIC penalizes complexity more than AIC.`
  },
  {
    q:`<p>Why does BIC tend to choose simpler models than AIC for large $n$?</p>`,
    steps:[
      {do:`BIC's penalty $k\\ln n$ grows with $n$; AIC's $2k$ is constant.`, why:`More data makes each extra parameter costlier under BIC.`},
      {do:`So adding parameters is discouraged more strongly.`, why:`The penalty outpaces the likelihood gain sooner.`}
    ],
    answer:`Because $\\ln n\\to\\infty$ while AIC's penalty stays at 2, BIC favors parsimony as $n$ grows.`
  },
  {
    q:`<p>Compute AIC for three nested models, $\\ln L$ increasing with $k$: (k=1, $\\ln L=-60$), (k=2, $\\ln L=-55$), (k=3, $\\ln L=-54$). Which is best?</p>`,
    steps:[
      {do:`AIC$_1=2(1)+120=122$.`, why:`$-2(-60)=120$.`},
      {do:`AIC$_2=2(2)+110=114$; AIC$_3=2(3)+108=114$.`, why:`Compute each.`},
      {do:`Models 2 and 3 tie at 114, both beating model 1.`, why:`Model 3's tiny fit gain just offsets its extra penalty.`}
    ],
    answer:`AIC: 122, 114, 114 — prefer model 2 (simplest among the tied best).`
  },
  {
    q:`<p>Ordinary $R^2=0.80$ with $n=50$ data points and $k=5$ predictors. Compute the adjusted $\\bar R^2=1-(1-R^2)\\frac{n-1}{n-k-1}$.</p>`,
    steps:[
      {do:`$1-R^2=0.20$; $\\frac{n-1}{n-k-1}=\\frac{49}{44}\\approx1.1136$.`, why:`Degrees-of-freedom correction factor.`},
      {do:`$\\bar R^2=1-0.20(1.1136)=1-0.2227$.`, why:`Multiply and subtract.`},
      {do:`$\\approx0.777$.`, why:`Compute.`}
    ],
    answer:`$\\bar R^2\\approx0.777$ (below the raw $0.80$).`
  },
  {
    q:`<p>Adding a useless 6th predictor leaves $R^2$ at $0.80$ (no real improvement). Recompute $\\bar R^2$ with $k=6$, $n=50$, and compare.</p>`,
    steps:[
      {do:`$\\frac{n-1}{n-k-1}=\\frac{49}{43}\\approx1.1395$.`, why:`The divisor $n-k-1$ shrinks as $k$ grows.`},
      {do:`$\\bar R^2=1-0.20(1.1395)=1-0.2279\\approx0.772$.`, why:`Compute.`},
      {do:`It dropped from $0.777$ to $0.772$.`, why:`The penalty rose with no fit gain.`}
    ],
    answer:`$\\bar R^2\\approx0.772$ — it fell, correctly flagging the useless predictor.`
  },
  {
    q:`<p>Why does plain $R^2$ never decrease when you add a predictor, while $\\bar R^2$ can?</p>`,
    steps:[
      {do:`RSS cannot increase when a predictor is added (least squares can ignore it).`, why:`More freedom never worsens the in-sample fit.`},
      {do:`$R^2=1-\\text{RSS}/\\text{TSS}$ thus never falls; $\\bar R^2$ divides by $n-k-1$, which shrinks.`, why:`The adjusted version charges for the lost degree of freedom.`}
    ],
    answer:`Plain $R^2$ only tracks RSS (monotone); $\\bar R^2$ also penalizes the extra parameter, so it can drop.`
  },
  {
    q:`<p>Mallow's $C_p=\\frac{\\text{RSS}}{\\hat\\sigma^2}-n+2k$. With $\\text{RSS}=120$, $\\hat\\sigma^2=4$, $n=40$, $k=6$, compute $C_p$.</p>`,
    steps:[
      {do:`$\\frac{\\text{RSS}}{\\hat\\sigma^2}=\\frac{120}{4}=30$.`, why:`Standardized residual sum.`},
      {do:`$C_p=30-40+2(6)=30-40+12$.`, why:`Plug in.`},
      {do:`$=2$.`, why:`Compute.`}
    ],
    answer:`$C_p=2$.`
  },
  {
    q:`<p>For $C_p$ the rule of thumb is "good if $C_p\\approx k$." With $C_p=2$ and $k=6$, is the model well-specified?</p>`,
    steps:[
      {do:`Compare $C_p=2$ to $k=6$.`, why:`A good model has $C_p$ near $k$.`},
      {do:`$2$ is well below $6$.`, why:`Could indicate overfitting or a low-variance noise estimate.`}
    ],
    answer:`Not cleanly — $C_p=2\\ne6$, suggesting the model is not at the ideal fit/complexity balance.`
  },
  {
    q:`<p>Convert AIC back to log-likelihood: a model reports $\\text{AIC}=130$ with $k=10$. Find $\\ln L$.</p>`,
    steps:[
      {do:`$\\text{AIC}=2k-2\\ln L\\Rightarrow130=20-2\\ln L$.`, why:`Plug $k=10$.`},
      {do:`$2\\ln L=20-130=-110\\Rightarrow\\ln L=-55$.`, why:`Solve for $\\ln L$.`}
    ],
    answer:`$\\ln L=-55$.`
  },
  {
    q:`<p>$\\Delta$AIC interpretation: candidate models have AIC values 100, 102, 110. Compute $\\Delta_i=\\text{AIC}_i-\\text{AIC}_{\\min}$ and say which models are well-supported (rule: $\\Delta<2$ substantial, $4$-$7$ less, $>10$ negligible).</p>`,
    steps:[
      {do:`Min AIC is 100, so $\\Delta=0,2,10$.`, why:`Subtract the minimum.`},
      {do:`$\\Delta=0$ (best), $\\Delta=2$ (borderline support), $\\Delta=10$ (negligible).`, why:`Apply the thresholds.`}
    ],
    answer:`Model 1 ($\\Delta=0$) and arguably model 2 ($\\Delta=2$) are supported; model 3 ($\\Delta=10$) is essentially ruled out.`
  },
  {
    q:`<p>Akaike weights: from $\\Delta$AIC $=0,2,10$, the relative likelihood of model $i$ is $\\exp(-\\Delta_i/2)$. Compute the (unnormalized) weights and the best model's normalized weight.</p>`,
    steps:[
      {do:`$\\exp(0)=1$, $\\exp(-1)\\approx0.368$, $\\exp(-5)\\approx0.0067$.`, why:`Relative likelihoods.`},
      {do:`Sum $\\approx1.375$.`, why:`Normalizer.`},
      {do:`Best weight $=\\frac{1}{1.375}\\approx0.727$.`, why:`Divide by the sum.`}
    ],
    answer:`Weights $\\approx1,0.368,0.0067$; the best model carries about 73% of the Akaike weight.`
  },
  {
    q:`<p>Time-series order selection: AR models with orders $p=1,2,3$ give AIC $=210,205,206$. Which lag order do you pick, and why not always the highest $p$?</p>`,
    steps:[
      {do:`Pick the minimum AIC: $205$ at $p=2$.`, why:`Lower AIC is better.`},
      {do:`Higher $p$ fits training data better but AIC penalizes the extra lags.`, why:`The penalty term guards against overfitting noise.`}
    ],
    answer:`Choose $p=2$ (AIC 205) — the criterion stops you from over-lagging.`
  }
]);

/* ================================================================== */
/* mlx-clustering-metrics : silhouette s = (b-a)/max(a,b)            */
/* ================================================================== */
add("mlx-clustering-metrics", [
  {
    q:`<p>A point has intra-cluster distance $a=1$ and nearest-other-cluster distance $b=4$. Compute its silhouette $s$.</p>`,
    steps:[
      {do:`$\\max(a,b)=\\max(1,4)=4$.`, why:`The denominator normalizes the score.`},
      {do:`$s=\\frac{b-a}{\\max(a,b)}=\\frac{4-1}{4}=\\frac34=0.75$.`, why:`Separation minus tightness, divided by the larger.`}
    ],
    answer:`$s=0.75$.`
  },
  {
    q:`<p>Compute $s$ for $a=2$, $b=6$.</p>`,
    steps:[
      {do:`$\\max(a,b)=6$.`, why:`$b>a$.`},
      {do:`$s=\\frac{6-2}{6}=\\frac46\\approx0.667$.`, why:`Plug in.`}
    ],
    answer:`$s\\approx0.67$.`
  },
  {
    q:`<p>A point sits on a boundary: $a=4$, $b=4$. Compute $s$.</p>`,
    steps:[
      {do:`$\\max(a,b)=4$.`, why:`Equal values.`},
      {do:`$s=\\frac{4-4}{4}=0$.`, why:`Equally close to its own cluster and the neighbor.`}
    ],
    answer:`$s=0$ (a borderline point).`
  },
  {
    q:`<p>A likely-misassigned point has $a=5$, $b=3$ (closer to a neighbor than its own cluster). Compute $s$.</p>`,
    steps:[
      {do:`$\\max(a,b)=\\max(5,3)=5$.`, why:`Now $a>b$.`},
      {do:`$s=\\frac{3-5}{5}=\\frac{-2}{5}=-0.4$.`, why:`Negative because separation $<$ tightness.`}
    ],
    answer:`$s=-0.4$ — the negative sign flags a probable misassignment.`
  },
  {
    q:`<p>What is the range of possible silhouette values, and what does each extreme mean?</p>`,
    steps:[
      {do:`$s\\in[-1,1]$.`, why:`Shown by splitting into $a\\le b$ and $a>b$ cases.`},
      {do:`$+1$ = deep inside a tight, well-separated cluster; $0$ = border; $-1$ = wrong cluster.`, why:`The sign and size encode assignment quality.`}
    ],
    answer:`$s\\in[-1,1]$: near $+1$ excellent, $0$ ambiguous, near $-1$ misassigned.`
  },
  {
    q:`<p>When $a\\le b$, rewrite $s$ in the form $1-\\frac{a}{b}$ and state the resulting range.</p>`,
    steps:[
      {do:`$\\max(a,b)=b$, so $s=\\frac{b-a}{b}=1-\\frac{a}{b}$.`, why:`Divide through by $b$.`},
      {do:`Since $0\\le a\\le b$, $\\frac{a}{b}\\in[0,1]$.`, why:`Bounds on the ratio.`}
    ],
    answer:`$s=1-\\frac{a}{b}\\in[0,1]$ when $a\\le b$.`
  },
  {
    q:`<p>When $a>b$, rewrite $s$ as $\\frac{b}{a}-1$ and state its range.</p>`,
    steps:[
      {do:`$\\max(a,b)=a$, so $s=\\frac{b-a}{a}=\\frac{b}{a}-1$.`, why:`Divide through by $a$.`},
      {do:`Since $0\\le b&lt;a$, $\\frac{b}{a}\\in[0,1)$.`, why:`Bounds on the ratio.`}
    ],
    answer:`$s=\\frac{b}{a}-1\\in[-1,0)$ when $a>b$.`
  },
  {
    q:`<p>Average silhouette over three points with $s=0.8,0.6,-0.2$. Compute it.</p>`,
    steps:[
      {do:`Sum: $0.8+0.6-0.2=1.2$.`, why:`Overall quality averages per-point scores.`},
      {do:`Divide by 3: $\\frac{1.2}{3}=0.4$.`, why:`Three points.`}
    ],
    answer:`Average silhouette $=0.4$.`
  },
  {
    q:`<p>To choose $k$, you compute average silhouette for $k=2,3,4$: $0.55,0.68,0.50$. Which $k$ do you pick?</p>`,
    steps:[
      {do:`Higher average silhouette = better-separated clusters.`, why:`The metric rewards tight, distinct groups.`},
      {do:`Compare: $0.68$ at $k=3$ is the largest.`, why:`Pick the peak.`}
    ],
    answer:`$k=3$ (highest average silhouette, $0.68$).`
  },
  {
    q:`<p>Compute the silhouette of a point with one neighbor cluster: $a=1.5$, and distances to the only other cluster average $b=2.0$.</p>`,
    steps:[
      {do:`$\\max(1.5,2.0)=2.0$.`, why:`$b>a$.`},
      {do:`$s=\\frac{2.0-1.5}{2.0}=\\frac{0.5}{2.0}=0.25$.`, why:`Modest positive — somewhat near a border.`}
    ],
    answer:`$s=0.25$.`
  },
  {
    q:`<p>A point belongs to cluster Red. Mean distance to Red members is $a=2$. Mean distances to Blue and Green are 5 and 9. Compute $b$ and then $s$.</p>`,
    steps:[
      {do:`$b$ is the distance to the <i>nearest</i> other cluster: $\\min(5,9)=5$.`, why:`Silhouette uses the closest competing cluster.`},
      {do:`$\\max(a,b)=\\max(2,5)=5$; $s=\\frac{5-2}{5}=0.6$.`, why:`Plug in.`}
    ],
    answer:`$b=5$, $s=0.6$.`
  },
  {
    q:`<p>Compute $a$ for a point at $(0,0)$ in a cluster whose other members are at $(0,2)$ and $(0,4)$. (Use straight-line distances.)</p>`,
    steps:[
      {do:`Distances: to $(0,2)$ is 2, to $(0,4)$ is 4.`, why:`Vertical separations.`},
      {do:`$a=\\frac{2+4}{2}=3$.`, why:`Mean intra-cluster distance to the other members.`}
    ],
    answer:`$a=3$.`
  },
  {
    q:`<p>For that same point at $(0,0)$, the nearest other cluster has members at $(6,0)$ and $(8,0)$. Compute $b$ and $s$ (using $a=3$ from before).</p>`,
    steps:[
      {do:`Distances: 6 and 8, mean $b=7$.`, why:`Average distance to the neighboring cluster.`},
      {do:`$\\max(3,7)=7$; $s=\\frac{7-3}{7}=\\frac47\\approx0.571$.`, why:`Plug into the formula.`}
    ],
    answer:`$b=7$, $s\\approx0.57$.`
  },
  {
    q:`<p>Why divide by $\\max(a,b)$ rather than, say, $a+b$?</p>`,
    steps:[
      {do:`Dividing by $\\max(a,b)$ guarantees $s\\in[-1,1]$.`, why:`The numerator $|b-a|$ never exceeds $\\max(a,b)$.`},
      {do:`It gives clean endpoints: $+1$, $0$, $-1$.`, why:`Interpretability of the extremes.`}
    ],
    answer:`To bound $s$ in $[-1,1]$ with interpretable endpoints; $\\max(a,b)$ is the tightest such normalizer.`
  },
  {
    q:`<p>A singleton cluster (one point) has no other same-cluster members, so $a$ is undefined. By convention what is its silhouette set to?</p>`,
    steps:[
      {do:`With no intra-cluster neighbors, $a$ has no value.`, why:`The mean over an empty set is undefined.`},
      {do:`Convention sets $s=0$ for singletons.`, why:`Neither well-clustered nor misassigned.`}
    ],
    answer:`$s=0$ for a singleton cluster (by convention).`
  },
  {
    q:`<p>Two clusterings of the same data: clustering 1 has average silhouette $0.62$, clustering 2 has $0.41$ but lower within-cluster sum of squares (WCSS). Which is "better separated," and why can WCSS disagree?</p>`,
    steps:[
      {do:`Silhouette favors clustering 1 (0.62 > 0.41).`, why:`It balances cohesion <i>and</i> separation.`},
      {do:`WCSS only measures cohesion, not separation, and always drops as $k$ grows.`, why:`More clusters shrink within-cluster distances mechanically.`}
    ],
    answer:`Clustering 1 is better separated by silhouette; WCSS can mislead because it ignores between-cluster separation and decreases with more clusters.`
  },
  {
    q:`<p>Bound check: a point has $a=0$ (it coincides with all its cluster-mates) and $b=3$. Compute $s$ and interpret.</p>`,
    steps:[
      {do:`$\\max(0,3)=3$; $s=\\frac{3-0}{3}=1$.`, why:`Perfect cohesion gives the maximum.`},
      {do:`$s=1$ is the best possible.`, why:`Zero internal spread, positive separation.`}
    ],
    answer:`$s=1$ — an ideally placed point.`
  }
]);

/* ================================================================== */
/* mlx-error-analysis : Delta_c = acc*_c - acc ; ablative drops       */
/* ================================================================== */
add("mlx-error-analysis", [
  {
    q:`<p>A pipeline scores $72\\%$. Perfecting the detector raises it to $80\\%$. Compute the error-analysis gain $\\Delta_{\\text{detector}}$.</p>`,
    steps:[
      {do:`$\\Delta_c=\\text{acc}^\\star_c-\\text{acc}=80\\%-72\\%$.`, why:`Headroom from making the component perfect.`},
      {do:`$=8\\%$.`, why:`Subtract.`}
    ],
    answer:`$\\Delta_{\\text{detector}}=8\\%$.`
  },
  {
    q:`<p>From a 72% pipeline, oracle gains are: preprocess $\\to73\\%$, detector $\\to80\\%$, features $\\to75\\%$, classifier $\\to74\\%$. List each $\\Delta$ and pick where to work.</p>`,
    steps:[
      {do:`$\\Delta$: preprocess 1%, detector 8%, features 3%, classifier 2%.`, why:`Each $\\Delta=\\text{acc}^\\star-72\\%$.`},
      {do:`Largest is the detector at 8%.`, why:`Biggest headroom = biggest potential win.`}
    ],
    answer:`Work on the detector ($\\Delta=8\\%$, far above the rest).`
  },
  {
    q:`<p>A 70% pipeline: perfecting OCR lifts it to 85%, perfecting the parser to 73%. Which stage, and what is its $\\Delta$?</p>`,
    steps:[
      {do:`$\\Delta_{\\text{OCR}}=85\\%-70\\%=15\\%$.`, why:`OCR headroom.`},
      {do:`$\\Delta_{\\text{parser}}=73\\%-70\\%=3\\%$.`, why:`Parser headroom.`}
    ],
    answer:`Work on OCR ($\\Delta=15\\%$ vs. the parser's $3\\%$).`
  },
  {
    q:`<p>Ablative analysis: the full system scores $90\\%$. Removing the language model drops it to $78\\%$. Compute the ablative drop $\\nabla_c$.</p>`,
    steps:[
      {do:`$\\nabla_c=\\text{acc}-\\text{acc}^{-c}=90\\%-78\\%$.`, why:`Accuracy lost when the component is removed.`},
      {do:`$=12\\%$.`, why:`Subtract.`}
    ],
    answer:`$\\nabla_{\\text{LM}}=12\\%$ — the language model contributes a lot.`
  },
  {
    q:`<p>What is the difference in <i>question</i> between error analysis and ablative analysis?</p>`,
    steps:[
      {do:`Error analysis perfects a component (oracle) and measures the gain $\\Delta_c$.`, why:`It asks: what should I improve?`},
      {do:`Ablative analysis removes a component and measures the drop $\\nabla_c$.`, why:`It asks: what is actually helping?`}
    ],
    answer:`Error analysis = "what to improve" (upside of fixing); ablative = "what is contributing" (cost of removing).`
  },
  {
    q:`<p>An ablation removes a feature and accuracy is unchanged ($\\nabla_c=0$). What does this suggest?</p>`,
    steps:[
      {do:`The feature added no measurable accuracy.`, why:`Its drop is zero.`},
      {do:`Consider cutting it to simplify the system.`, why:`Dead weight increases cost without benefit.`}
    ],
    answer:`The component is barely helping — a candidate to remove for simplicity/speed.`
  },
  {
    q:`<p>Error-analysis gains for four stages are $\\Delta=1\\%,8\\%,3\\%,2\\%$. With a budget to deeply fix only two stages, which two, and what's the max realized gain (assuming additivity)?</p>`,
    steps:[
      {do:`Sort descending: $8,3,2,1$.`, why:`Greedy on headroom is effort-optimal.`},
      {do:`Take the top two: $8\\%+3\\%=11\\%$.`, why:`Pick the two largest $\\Delta$.`}
    ],
    answer:`Fix the detector (8%) and features (3%) for up to $11\\%$ gain.`
  },
  {
    q:`<p>Why is the all-oracle ceiling an upper bound: $\\text{acc}^{\\text{perfect}}-\\text{acc}\\le\\sum_c\\Delta_c$?</p>`,
    steps:[
      {do:`Each oracle only helps, so $\\Delta_c\\ge0$.`, why:`Perfecting a stage cannot hurt.`},
      {do:`Telescoping individual gains bounds the total improvement by their sum.`, why:`Combined fixes cannot exceed the summed individual headrooms.`}
    ],
    answer:`Because each $\\Delta_c\\ge0$ and the gains telescope, the perfect-system gain is at most $\\sum_c\\Delta_c$.`
  },
  {
    q:`<p>A 3-stage RAG pipeline (retriever, reranker, generator) scores $64\\%$. Oracle retriever $\\to82\\%$, oracle reranker $\\to70\\%$, oracle generator $\\to68\\%$. Rank the stages by $\\Delta$.</p>`,
    steps:[
      {do:`$\\Delta$: retriever 18%, reranker 6%, generator 4%.`, why:`Each minus 64%.`},
      {do:`Order: retriever > reranker > generator.`, why:`Sort by headroom.`}
    ],
    answer:`Retriever (18%) > reranker (6%) > generator (4%); fix the retriever first.`
  },
  {
    q:`<p>Ablative table for a system at $88\\%$: removing features A, B, C drops it to $80\\%$, $86\\%$, $70\\%$. Compute each $\\nabla$ and rank importance.</p>`,
    steps:[
      {do:`$\\nabla_A=88-80=8\\%$, $\\nabla_B=88-86=2\\%$, $\\nabla_C=88-70=18\\%$.`, why:`Drop = full minus ablated.`},
      {do:`Rank: C > A > B.`, why:`Larger drop = more important.`}
    ],
    answer:`$\\nabla_C=18\\%>\\nabla_A=8\\%>\\nabla_B=2\\%$ — C is most important, B nearly redundant.`
  },
  {
    q:`<p>A face pipeline at 72%: ablating the classifier drops it to 60%. Compute $\\nabla$ and interpret.</p>`,
    steps:[
      {do:`$\\nabla=72\\%-60\\%=12\\%$.`, why:`Accuracy lost on removal.`},
      {do:`A 12% drop means the classifier is essential.`, why:`Large $\\nabla$ = pulling its weight.`}
    ],
    answer:`$\\nabla=12\\%$ — keep the classifier; it contributes substantially.`
  },
  {
    q:`<p>Could a stage have small $\\Delta$ (little headroom) but large $\\nabla$ (big drop if removed)? Explain.</p>`,
    steps:[
      {do:`Small $\\Delta$ means it is already near-perfect, so perfecting it adds little.`, why:`No room to improve.`},
      {do:`Large $\\nabla$ means removing it is catastrophic.`, why:`It is essential yet already good.`}
    ],
    answer:`Yes — a stage can be already excellent (tiny $\\Delta$) yet indispensable (huge $\\nabla$). The two metrics answer different questions.`
  },
  {
    q:`<p>Greedy optimality: given headrooms sorted $\\Delta_{(1)}\\ge\\Delta_{(2)}\\ge\\dots$, why does picking the top $t$ dominate any other size-$t$ subset?</p>`,
    steps:[
      {do:`Any other subset $S$ of size $t$ can be matched term-by-term against the top $t$.`, why:`Each top element is $\\ge$ the corresponding element of $S$.`},
      {do:`So $\\sum_{\\text{top-}t}\\Delta\\ge\\sum_{S}\\Delta$.`, why:`Summing the dominating terms.`}
    ],
    answer:`Because the sorted top-$t$ dominates any size-$t$ subset term by term, ranking by $\\Delta$ and fixing from the top is effort-optimal.`
  },
  {
    q:`<p>A speech system: ablating the acoustic model drops accuracy by 25%, ablating the language model by 5%. Where is the system's value concentrated?</p>`,
    steps:[
      {do:`$\\nabla_{\\text{acoustic}}=25\\%$ vs. $\\nabla_{\\text{LM}}=5\\%$.`, why:`Compare the drops.`},
      {do:`The acoustic model carries five times the contribution.`, why:`Larger drop = more value.`}
    ],
    answer:`Mostly in the acoustic model ($\\nabla=25\\%$); the language model adds a smaller $5\\%$.`
  },
  {
    q:`<p>Suppose perfecting two stages is <i>not</i> additive: detector $\\Delta=8\\%$ and features $\\Delta=3\\%$ individually, but doing both yields only $+9\\%$ (not $11\\%$). What does this overlap imply?</p>`,
    steps:[
      {do:`Combined gain $9\\%<8\\%+3\\%=11\\%$.`, why:`The fixes partly address the same errors.`},
      {do:`Their error sources overlap.`, why:`Some mistakes were counted in both headrooms.`}
    ],
    answer:`The two stages share overlapping error sources, so their gains are sub-additive — re-measure jointly rather than summing.`
  },
  {
    q:`<p>Headroom vs. effort: detector has $\\Delta=8\\%$ but would take 4 weeks; features has $\\Delta=3\\%$ and takes 1 week. Compare gain-per-week and discuss.</p>`,
    steps:[
      {do:`Detector: $8\\%/4=2\\%$ per week.`, why:`Normalize by cost.`},
      {do:`Features: $3\\%/1=3\\%$ per week.`, why:`Same normalization.`}
    ],
    answer:`Features gives more gain per week (3% vs 2%), so with limited time it may be the better first target despite smaller total headroom.`
  },
  {
    q:`<p>A pipeline's stages have $\\Delta=0$ everywhere except one stage with $\\Delta=20\\%$. What does this profile tell you about where errors come from?</p>`,
    steps:[
      {do:`Only one stage has headroom; all others are already perfect-equivalent.`, why:`Zero $\\Delta$ means perfecting them changes nothing.`},
      {do:`All remaining errors funnel through that one stage.`, why:`It is the sole bottleneck.`}
    ],
    answer:`That single stage is the bottleneck — every remaining error originates there, so it deserves all the effort.`
  }
]);

})();
