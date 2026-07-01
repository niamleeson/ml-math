module.exports = {
  "math-06-01": {
    id: "math-06-01",
    title: "Periodic functions",
    tagline: "A periodic function repeats its behavior after a fixed step, turning time into a circle you can revisit.",
    connections: {
      buildsOn: ["functions", "trigonometric functions", "graphs"],
      leadsTo: ["orthogonality of sinusoids", "Fourier series", "frequency analysis"],
      usedWith: ["sine and cosine", "modular arithmetic", "symmetry", "limits"]
    },
    motivation:
      "<p>You already recognize repetition: a clock hand returns to the top every 12 hours, a cosine wave returns to the same height every full turn, and a daily pattern repeats tomorrow.</p>" +
      "<p>A <b>periodic function</b> gives that repetition a precise name. Instead of treating a long signal as endless new information, we learn the smallest repeat block and reuse it. That is the first doorway into Fourier analysis.</p>",
    definition:
      "<p>A function $f$ is <b>periodic</b> with period $T>0$ if $$f(t+T)=f(t)$$ for every allowed input $t$. The smallest positive such $T$, when it exists, is the fundamental period. For example, $\\sin t$ and $\\cos t$ have fundamental period $2\\pi$ because moving one full circle returns to the same coordinate.</p>" +
      "<p>Why this identity matters: if $f(t+T)=f(t)$, then applying it repeatedly gives $f(t+nT)=f(t)$ for every integer $n$. One verified repeat length controls the whole line, the way one clock face controls every hour count.</p>" +
      "<p><b>Assumptions that matter:</b> the equality must hold for every input in the domain, not just some sample points; a period is positive; constant functions have every positive period and no unique smallest one; and sums of periodic functions may have a common period only when their periods fit together rationally.</p>",
    worked: {
      problem: "Find the fundamental period of $f(t)=3\\sin(2t)-\\cos(6t)$.",
      skills: ["periods of sinusoids", "least common multiples", "frequency reading"],
      strategy: "Each sinusoid repeats at its own pace. Find each period, then find the smallest time that makes both repeat.",
      steps: [
        { do: "Read the sine frequency", result: "$2$", why: "$\\sin(\\omega t)$ has period $2\\pi/\\omega$" },
        { do: "Compute the sine period", result: "$T_1=2\\pi/2=\\pi$", why: "one full sine cycle needs angle change $2\\pi$" },
        { do: "Read the cosine frequency", result: "$6$", why: "$\\cos(6t)$ cycles six times as fast as $\\cos t$" },
        { do: "Compute the cosine period", result: "$T_2=2\\pi/6=\\pi/3$", why: "one full cosine cycle needs angle change $2\\pi$" },
        { do: "Find the smallest common repeat", result: "$T=\\pi$", why: "$\\pi$ is one sine period and three cosine periods" }
      ],
      verify: "At $t+\\pi$, $\\sin(2t+2\\pi)=\\sin(2t)$ and $\\cos(6t+6\\pi)=\\cos(6t)$, so the whole function repeats.",
      answer: "The fundamental period is $\\pi$.",
      connects: "Fourier analysis begins by reading a repeated signal through its component periods."
    },
    practice: [
      { problem: "Show that $f(t)=\\cos(4t)$ has period $\\pi/2$.", steps: [
        { do: "Start from the period formula", result: "$T=2\\pi/\\omega$", why: "$\\omega$ is the angular frequency" },
        { do: "Substitute $\\omega=4$", result: "$T=2\\pi/4$", why: "the angle is $4t$" },
        { do: "Simplify", result: "$T=\\pi/2$", why: "divide numerator and denominator by $2$" },
        { do: "Check the shifted angle", result: "$4(t+\\pi/2)=4t+2\\pi$", why: "cosine repeats after $2\\pi$" },
        { do: "Apply cosine periodicity", result: "$\\cos(4t+2\\pi)=\\cos(4t)$", why: "one full turn changes nothing" }
      ], answer: "$\\pi/2$ is a period, and it is the fundamental period." },
      { problem: "Find the fundamental period of $g(t)=\\sin(3t)+2\\sin(5t)$.", steps: [
        { do: "Compute the first period", result: "$T_1=2\\pi/3$", why: "the first angular frequency is $3$" },
        { do: "Compute the second period", result: "$T_2=2\\pi/5$", why: "the second angular frequency is $5$" },
        { do: "Require both angles to complete cycles", result: "$3T=2\\pi m$ and $5T=2\\pi n$", why: "$m,n$ must be integers" },
        { do: "Test $T=2\\pi$", result: "$3T=6\\pi$ and $5T=10\\pi$", why: "both are integer multiples of $2\\pi$" },
        { do: "Check for a smaller common time", result: "none positive below $2\\pi$", why: "frequencies $3$ and $5$ have greatest common divisor $1$" }
      ], answer: "The fundamental period is $2\\pi$." },
      { problem: "A signal repeats every $0.25$ seconds. Find its frequency in cycles per second and angular frequency.", steps: [
        { do: "Name the period", result: "$T=0.25$ seconds", why: "one repeat takes a quarter second" },
        { do: "Compute ordinary frequency", result: "$f=1/T=1/0.25=4$ Hz", why: "frequency counts cycles per second" },
        { do: "Use angular frequency", result: "$\\omega=2\\pi f$", why: "one cycle is $2\\pi$ radians" },
        { do: "Substitute $f=4$", result: "$\\omega=8\\pi$ radians per second", why: "multiply by $2\\pi$" },
        { do: "Check the period formula", result: "$2\\pi/(8\\pi)=0.25$", why: "the angular frequency matches the given period" }
      ], answer: "Frequency is $4$ Hz and angular frequency is $8\\pi$ radians per second." },
      { problem: "Decide whether $h(t)=\\sin(2t)+\\sin(\\sqrt2\\,t)$ is periodic.", steps: [
        { do: "Compute the first period", result: "$T_1=\\pi$", why: "$2\\pi/2=\\pi$" },
        { do: "Compute the second period", result: "$T_2=2\\pi/\\sqrt2=\\sqrt2\\pi$", why: "divide by the angular frequency $\\sqrt2$" },
        { do: "Form the period ratio", result: "$T_2/T_1=\\sqrt2$", why: "compare whether the periods fit together" },
        { do: "Classify the ratio", result: "irrational", why: "$\\sqrt2$ is not a ratio of integers" },
        { do: "Conclude about common period", result: "no common positive period", why: "integer repeats cannot line up exactly" }
      ], answer: "$h$ is not periodic." },
      { problem: "A seasonal feature uses $x(d)=\\cos(2\\pi d/365)$ for day $d$. Compute $x(0)$, $x(365)$, and $x(730)$, then state the period.", steps: [
        { do: "Evaluate day $0$", result: "$x(0)=\\cos0=1$", why: "the angle is zero" },
        { do: "Evaluate day $365$", result: "$x(365)=\\cos(2\\pi)=1$", why: "one full yearly turn" },
        { do: "Evaluate day $730$", result: "$x(730)=\\cos(4\\pi)=1$", why: "two full yearly turns" },
        { do: "Find the repeat length", result: "$T=365$ days", why: "adding 365 adds $2\\pi$ to the angle" },
        { do: "Check the formula", result: "$x(d+365)=\\cos(2\\pi d/365+2\\pi)$", why: "cosine repeats after $2\\pi$" }
      ], answer: "$x(0)=x(365)=x(730)=1$, and the period is $365$ days." }
    ],
    applications: [
      { title: "Seasonal features", background: "Models often need calendar variables, but month numbers make December and January look far apart. Periodic encodings wrap the year into a circle.", numbers: "For day $91$, $2\\pi\\cdot91/365\\approx1.57$, so $\\sin\\theta\\approx1$ and $\\cos\\theta\\approx0$." },
      { title: "Audio pitch", background: "A musical note is pressure that repeats quickly. Pitch is frequency, the reciprocal of period.", numbers: "A $440$ Hz A note has period $1/440\\approx0.00227$ seconds." },
      { title: "Server traffic cycles", background: "Traffic often has daily and weekly rhythms. Periodic functions give a compact way to model repeatable load.", numbers: "A daily cosine term uses $\\omega=2\\pi/24=\\pi/12$ radians per hour." },
      { title: "Rotating machinery", background: "Sensors on motors and disks produce periodic readings because the physical position repeats after each rotation.", numbers: "A fan at $1800$ rpm makes $30$ rotations per second, so its period is $1/30\\approx0.0333$ seconds." },
      { title: "Positional encodings", background: "Transformer encodings use sinusoidal channels so positions can be compared through phases at different periods.", numbers: "The channel $\\sin(p\\pi/2)$ repeats every $4$ positions: $0,1,0,-1,0$." },
      { title: "Modulo arithmetic in code", background: "Periodic indexing appears whenever a buffer, clock, or circular array wraps around.", numbers: "In an array of length $8$, index $19$ maps to $19\\bmod8=3$, the same slot as index $3$." }
    ],
    applicationsClose: "The shared thread is repeat length: once you know the period, distant inputs can be folded back into one understandable cycle.",
    takeaways: [
      "A period $T$ satisfies $f(t+T)=f(t)$ for every allowed $t$.",
      "For $\\sin(\\omega t)$ or $\\cos(\\omega t)$, the fundamental period is $2\\pi/|\\omega|$.",
      "Sums of periodic functions repeat only when their periods share a common multiple.",
      "Periodic thinking turns waves, seasons, clocks, and circular code into one idea."
    ]
  },

  "math-06-02": {
    id: "math-06-02",
    title: "Orthogonality of sinusoids",
    tagline: "Different sine and cosine waves are independent directions under an integral dot product.",
    connections: {
      buildsOn: ["periodic functions", "definite integrals", "trigonometric identities"],
      leadsTo: ["Fourier series", "complex Fourier coefficients", "least-squares projection"],
      usedWith: ["inner products", "orthogonal bases", "Pythagorean theorem", "symmetry"]
    },
    motivation:
      "<p>You already know perpendicular vectors do not overlap in direction: $(1,0)$ and $(0,1)$ have dot product $0$. Fourier analysis uses the same idea, but the vectors are whole waves.</p>" +
      "<p>The dot product becomes an integral over a full period. When two sinusoids have different integer frequencies, their positive and negative overlap cancels perfectly. That cancellation is what lets us separate one frequency from another.</p>",
    definition:
      "<p>For real functions on $[-\\pi,\\pi]$, define the inner product $$\\langle f,g\\rangle=\\int_{-\\pi}^{\\pi} f(t)g(t)\\,dt.$$ Two functions are <b>orthogonal</b> if this inner product is $0$. For positive integers $m\\ne n$, $$\\int_{-\\pi}^{\\pi}\\sin(mt)\\sin(nt)\\,dt=0,$$ and the same orthogonality holds for distinct cosines and for sine against cosine.</p>" +
      "<p>One derivation uses the product identity $\\sin(mt)\\sin(nt)=\\frac12[\\cos((m-n)t)-\\cos((m+n)t)]$. Integrating a nonzero integer-frequency cosine over $[-\\pi,\\pi]$ gives zero, so the cross term disappears.</p>" +
      "<p><b>Assumptions that matter:</b> the interval must cover a whole common period; the frequencies here are integers on $[-\\pi,\\pi]$; the normalization is not unit length because $\\int_{-\\pi}^{\\pi}\\sin^2(nt)\\,dt=\\pi$; and orthogonal means zero inner product, not zero pointwise product.</p>",
    worked: {
      problem: "Compute $\\displaystyle\\int_{-\\pi}^{\\pi}\\sin(2t)\\sin(5t)\\,dt$.",
      skills: ["orthogonality", "product-to-sum identities", "definite integrals"],
      strategy: "The frequencies differ, so the answer should be zero. Use the identity to see the cancellation explicitly.",
      steps: [
        { do: "Apply the product identity", result: "$\\sin(2t)\\sin(5t)=\\frac12[\\cos(3t)-\\cos(7t)]$", why: "products of sines become sums of cosines" },
        { do: "Substitute into the integral", result: "$\\frac12\\int_{-\\pi}^{\\pi}[\\cos(3t)-\\cos(7t)]\\,dt$", why: "linearity lets the factor move outside" },
        { do: "Integrate $\\cos(3t)$", result: "$\\frac{\\sin(3t)}{3}\\big|_{-\\pi}^{\\pi}=0$", why: "$\\sin(3\\pi)=\\sin(-3\\pi)=0$" },
        { do: "Integrate $\\cos(7t)$", result: "$\\frac{\\sin(7t)}{7}\\big|_{-\\pi}^{\\pi}=0$", why: "$\\sin(7\\pi)=\\sin(-7\\pi)=0$" },
        { do: "Combine the pieces", result: "$\\frac12(0-0)=0$", why: "both full-cycle averages vanish" }
      ],
      verify: "The frequencies $2$ and $5$ are different integer frequencies, so orthogonality predicts zero overlap.",
      answer: "$\\displaystyle\\int_{-\\pi}^{\\pi}\\sin(2t)\\sin(5t)\\,dt=0$.",
      connects: "This zero is the frequency-separation fact Fourier series uses to isolate coefficients."
    },
    practice: [
      { problem: "Compute $\\int_{-\\pi}^{\\pi}\\cos(3t)\\cos(3t)\\,dt$.", steps: [
        { do: "Rewrite the integrand", result: "$\\cos^2(3t)=\\frac12(1+\\cos(6t))$", why: "use the power-reduction identity" },
        { do: "Substitute into the integral", result: "$\\frac12\\int_{-\\pi}^{\\pi}(1+\\cos(6t))\\,dt$", why: "split the squared cosine" },
        { do: "Integrate the constant", result: "$\\int_{-\\pi}^{\\pi}1\\,dt=2\\pi$", why: "the interval length is $2\\pi$" },
        { do: "Integrate the oscillating term", result: "$\\int_{-\\pi}^{\\pi}\\cos(6t)\\,dt=0$", why: "a full number of cycles cancels" },
        { do: "Multiply by one half", result: "$\\pi$", why: "only half of the constant area remains" }
      ], answer: "$\\pi$." },
      { problem: "Compute $\\int_{-\\pi}^{\\pi}\\sin(4t)\\cos(4t)\\,dt$.", steps: [
        { do: "Use a product identity", result: "$\\sin(4t)\\cos(4t)=\\frac12\\sin(8t)$", why: "sine times cosine doubles the angle" },
        { do: "Substitute into the integral", result: "$\\frac12\\int_{-\\pi}^{\\pi}\\sin(8t)\\,dt$", why: "move the constant outside" },
        { do: "Find an antiderivative", result: "$-\\frac{\\cos(8t)}{8}$", why: "differentiate cosine to get sine with a minus sign" },
        { do: "Evaluate endpoints", result: "$-\\cos(8\\pi)/8+\\cos(-8\\pi)/8=0$", why: "both cosines equal $1$" },
        { do: "Apply the factor", result: "$0$", why: "the full-cycle sine has zero net area" }
      ], answer: "$0$." },
      { problem: "Find the coefficient of $\\sin(2t)$ in $f(t)=5\\sin(2t)+3\\cos(t)$ using $b_2=\\frac1\\pi\\int_{-\\pi}^{\\pi}f(t)\\sin(2t)\\,dt$.", steps: [
        { do: "Write the projection integral", result: "$b_2=\\frac1\\pi\\int_{-\\pi}^{\\pi}(5\\sin(2t)+3\\cos t)\\sin(2t)\\,dt$", why: "project onto the target wave" },
        { do: "Distribute the product", result: "$\\frac1\\pi[5\\int\\sin^2(2t)\\,dt+3\\int\\cos t\\sin(2t)\\,dt]$", why: "linearity separates components" },
        { do: "Use the squared norm", result: "$\\int_{-\\pi}^{\\pi}\\sin^2(2t)\\,dt=\\pi$", why: "every nonzero integer sine has norm squared $\\pi$" },
        { do: "Use orthogonality", result: "$\\int_{-\\pi}^{\\pi}\\cos t\\sin(2t)\\,dt=0$", why: "sines and cosines are orthogonal" },
        { do: "Compute the coefficient", result: "$b_2=\\frac1\\pi(5\\pi+0)=5$", why: "normalization cancels the norm" }
      ], answer: "$b_2=5$." },
      { problem: "Show that $1$ and $\\cos(2t)$ are orthogonal on $[-\\pi,\\pi]$.", steps: [
        { do: "Write the inner product", result: "$\\langle 1,\\cos(2t)\\rangle=\\int_{-\\pi}^{\\pi}\\cos(2t)\\,dt$", why: "multiplying by $1$ changes nothing" },
        { do: "Find an antiderivative", result: "$\\frac{\\sin(2t)}{2}$", why: "the derivative of $\\sin(2t)$ is $2\\cos(2t)$" },
        { do: "Evaluate the upper endpoint", result: "$\\sin(2\\pi)/2=0$", why: "sine vanishes at integer multiples of $\\pi$" },
        { do: "Evaluate the lower endpoint", result: "$\\sin(-2\\pi)/2=0$", why: "the lower endpoint also lands on a full cycle" },
        { do: "Subtract endpoints", result: "$0-0=0$", why: "zero inner product means orthogonal" }
      ], answer: "$1$ and $\\cos(2t)$ are orthogonal on $[-\\pi,\\pi]$." },
      { problem: "For samples $[1,0,-1,0]$, compute its dot product with the discrete sine pattern $[0,1,0,-1]$ and interpret the result.", steps: [
        { do: "Multiply first entries", result: "$1\\cdot0=0$", why: "dot products multiply matching positions" },
        { do: "Multiply second entries", result: "$0\\cdot1=0$", why: "the second signal is zero there" },
        { do: "Multiply third entries", result: "$-1\\cdot0=0$", why: "again one factor is zero" },
        { do: "Multiply fourth entries", result: "$0\\cdot(-1)=0$", why: "the first signal is zero there" },
        { do: "Add the products", result: "$0+0+0+0=0$", why: "zero dot product means no overlap in this sampled inner product" }
      ], answer: "The dot product is $0$, so these sampled cosine-like and sine-like patterns are orthogonal." }
    ],
    applications: [
      { title: "Fourier coefficient extraction", background: "Orthogonality lets one coefficient be measured without interference from the others.", numbers: "If $f(t)=7\\cos(3t)+2\\sin t$, then $\\frac1\\pi\\int_{-\\pi}^{\\pi}f(t)\\cos(3t)\\,dt=7$." },
      { title: "Audio equalizers", background: "An equalizer boosts or cuts frequency bands because different sinusoidal components can be separated.", numbers: "A $1000$ Hz tone and $2000$ Hz tone have zero ideal inner product over $0.01$ seconds because that window contains $10$ and $20$ cycles." },
      { title: "Least-squares projection", background: "Fitting with orthogonal features makes coefficients independent, just like perpendicular vector coordinates.", numbers: "If basis norms are $\\pi$ and inner product with a signal is $4\\pi$, the coefficient is $4\\pi/\\pi=4$." },
      { title: "Image compression", background: "Cosine transforms use orthogonal cosine patterns so image blocks can be represented by independent weights.", numbers: "In an $8$-pixel row, the constant pattern has dot product $8$ with all-ones data, while many alternating patterns sum to $0$." },
      { title: "Communication channels", background: "Orthogonal carriers can share a medium because each receiver projects onto its own carrier.", numbers: "Over one second, $\\int_0^1\\sin(2\\pi 3t)\\sin(2\\pi 5t)\\,dt=0$ for integer frequencies $3$ and $5$." },
      { title: "Feature decorrelation", background: "Machine learning often benefits when features are less redundant. Orthogonal sinusoids are the clean mathematical model.", numbers: "Two centered vectors with dot product $0$ and norms $2$ and $3$ have cosine similarity $0/(2\\cdot3)=0$." }
    ],
    applicationsClose: "Orthogonality is independence made computable: integrate against the direction you want, and unrelated waves vanish.",
    takeaways: [
      "The function inner product on a period is an integral of a product.",
      "Distinct integer-frequency sinusoids are orthogonal over $[-\\pi,\\pi]$.",
      "The squared norm of $\\sin(nt)$ or $\\cos(nt)$ on $[-\\pi,\\pi]$ is $\\pi$.",
      "Orthogonality is the engine behind coefficient extraction and compression."
    ]
  },

  "math-06-03": {
    id: "math-06-03",
    title: "Fourier series",
    tagline: "A periodic signal can be rebuilt from a constant term plus sine and cosine waves.",
    connections: {
      buildsOn: ["periodic functions", "orthogonality of sinusoids", "definite integrals"],
      leadsTo: ["convergence of Fourier series", "complex Fourier coefficients", "Fourier transform"],
      usedWith: ["inner products", "infinite series", "trigonometric identities", "least-squares approximation"]
    },
    motivation:
      "<p>You can already describe a simple wave like $3\\sin(2t)$. But real periodic signals are rarely one clean wave. A square wave, a voice note, and a seasonal traffic curve all have shape.</p>" +
      "<p>A <b>Fourier series</b> says: keep the period, and decompose the shape into pure frequencies. It is like describing a color by amounts of red, green, and blue, except the basis colors are sinusoids.</p>",
    definition:
      "<p>For a $2\\pi$-periodic function $f$, its real Fourier series is $$f(t)\\sim \\frac{a_0}{2}+\\sum_{n=1}^{\\infty}\\big(a_n\\cos(nt)+b_n\\sin(nt)\\big),$$ where $$a_n=\\frac1\\pi\\int_{-\\pi}^{\\pi}f(t)\\cos(nt)\\,dt,\\quad b_n=\\frac1\\pi\\int_{-\\pi}^{\\pi}f(t)\\sin(nt)\\,dt,$$ and $a_0=\\frac1\\pi\\int_{-\\pi}^{\\pi}f(t)\\,dt$.</p>" +
      "<p>These formulas come from orthogonality. If you multiply the series by $\\cos(kt)$ and integrate, every term vanishes except $a_k\\cos^2(kt)$, whose integral is $a_k\\pi$. Dividing by $\\pi$ isolates $a_k$.</p>" +
      "<p><b>Assumptions that matter:</b> the formulas are written for period $2\\pi$; convergence is a separate question; $a_0/2$ is the average value; and enough integrability is needed so the coefficient integrals exist.</p>",
    worked: {
      problem: "Find the Fourier coefficients of $f(t)=2+3\\cos t-4\\sin(2t)$ on $[-\\pi,\\pi]$.",
      skills: ["coefficient reading", "orthogonality", "Fourier representation"],
      strategy: "The function is already written in Fourier form, so use orthogonality to read the nonzero coefficients.",
      steps: [
        { do: "Match the constant term", result: "$a_0/2=2$", why: "the Fourier constant is written as half of $a_0$" },
        { do: "Solve for $a_0$", result: "$a_0=4$", why: "multiply both sides by $2$" },
        { do: "Match the cosine term", result: "$a_1=3$", why: "$3\\cos t$ is the first cosine component" },
        { do: "Match the sine term", result: "$b_2=-4$", why: "$-4\\sin(2t)$ is the second sine component" },
        { do: "Set remaining coefficients", result: "all other $a_n$ and $b_n$ are $0$", why: "no other frequencies are present" }
      ],
      verify: "Rebuilding $a_0/2+a_1\\cos t+b_2\\sin(2t)$ gives $2+3\\cos t-4\\sin(2t)$ exactly.",
      answer: "$a_0=4$, $a_1=3$, $b_2=-4$, and all other coefficients are $0$.",
      connects: "Fourier coefficients are coordinates of a periodic function in sinusoidal directions."
    },
    practice: [
      { problem: "Find $a_0$ for $f(t)=5+\\cos(3t)$.", steps: [
        { do: "Use the formula", result: "$a_0=\\frac1\\pi\\int_{-\\pi}^{\\pi}(5+\\cos(3t))\\,dt$", why: "the constant coefficient measures average level" },
        { do: "Integrate the constant", result: "$\\int_{-\\pi}^{\\pi}5\\,dt=10\\pi$", why: "the interval has length $2\\pi$" },
        { do: "Integrate the cosine", result: "$\\int_{-\\pi}^{\\pi}\\cos(3t)\\,dt=0$", why: "full cycles cancel" },
        { do: "Substitute the areas", result: "$a_0=\\frac1\\pi(10\\pi+0)$", why: "combine the two integrals" },
        { do: "Simplify", result: "$a_0=10$", why: "divide by $\\pi$" }
      ], answer: "$a_0=10$, so the average term is $a_0/2=5$." },
      { problem: "Find $b_1$ for $f(t)=6\\sin t+2\\cos(4t)$.", steps: [
        { do: "Write the coefficient", result: "$b_1=\\frac1\\pi\\int_{-\\pi}^{\\pi}f(t)\\sin t\\,dt$", why: "project onto $\\sin t$" },
        { do: "Substitute $f$", result: "$\\frac1\\pi\\int(6\\sin t+2\\cos(4t))\\sin t\\,dt$", why: "use the given function" },
        { do: "Separate terms", result: "$\\frac1\\pi(6\\int\\sin^2t\\,dt+2\\int\\cos(4t)\\sin t\\,dt)$", why: "linearity" },
        { do: "Use norms and orthogonality", result: "$\\frac1\\pi(6\\pi+0)$", why: "$\\sin t$ has norm squared $\\pi$ and the cross term vanishes" },
        { do: "Simplify", result: "$6$", why: "the normalization cancels" }
      ], answer: "$b_1=6$." },
      { problem: "Find the first two nonzero terms of the Fourier series for $f(t)=t$ on $[-\\pi,\\pi]$, using that it is odd.", steps: [
        { do: "Use odd symmetry", result: "$a_0=0$ and $a_n=0$", why: "an odd function has no constant or cosine terms on a symmetric interval" },
        { do: "Write the sine coefficient", result: "$b_n=\\frac1\\pi\\int_{-\\pi}^{\\pi}t\\sin(nt)\\,dt$", why: "only sine terms remain" },
        { do: "Use the known evaluated integral", result: "$b_n=2(-1)^{n+1}/n$", why: "integration by parts gives this formula" },
        { do: "Set $n=1$", result: "$b_1=2$", why: "$(-1)^2=1$" },
        { do: "Set $n=2$", result: "$b_2=-1$", why: "$2(-1)^3/2=-1$" }
      ], answer: "The first two nonzero terms are $2\\sin t-\\sin(2t)$." },
      { problem: "For an even function with $a_0=6$, $a_1=-2$, $a_2=1$, and all sine coefficients zero, write the two-harmonic approximation.", steps: [
        { do: "Start with the Fourier form", result: "$a_0/2+a_1\\cos t+a_2\\cos(2t)$", why: "keep terms through the second harmonic" },
        { do: "Substitute $a_0=6$", result: "$3+a_1\\cos t+a_2\\cos(2t)$", why: "the constant term is half of $a_0$" },
        { do: "Substitute $a_1=-2$", result: "$3-2\\cos t+a_2\\cos(2t)$", why: "first cosine coefficient" },
        { do: "Substitute $a_2=1$", result: "$3-2\\cos t+\\cos(2t)$", why: "second cosine coefficient" },
        { do: "Confirm sine terms", result: "no sine terms", why: "the function is even and the given sine coefficients are zero" }
      ], answer: "$3-2\\cos t+\\cos(2t)$." },
      { problem: "Approximate $f(t)=1+0.5\\cos t+0.25\\sin(2t)$ at $t=\\pi/2$ using its listed Fourier terms.", steps: [
        { do: "Substitute $t=\\pi/2$", result: "$1+0.5\\cos(\\pi/2)+0.25\\sin(\\pi)$", why: "evaluate the approximation at the requested point" },
        { do: "Evaluate the cosine", result: "$\\cos(\\pi/2)=0$", why: "unit-circle value" },
        { do: "Evaluate the sine", result: "$\\sin\\pi=0$", why: "the sine crosses zero" },
        { do: "Substitute the values", result: "$1+0.5\\cdot0+0.25\\cdot0$", why: "both oscillatory terms vanish" },
        { do: "Simplify", result: "$1$", why: "only the average remains" }
      ], answer: "The approximation gives $1$." }
    ],
    applications: [
      { title: "Audio synthesis", background: "Digital instruments build timbre by combining harmonics, not just one pure tone.", numbers: "A tone $\\sin(2\\pi 440t)+0.5\\sin(2\\pi 880t)$ has a fundamental at $440$ Hz and a second harmonic at $880$ Hz." },
      { title: "Square-wave electronics", background: "Ideal square waves are represented by odd sine harmonics, explaining their sharp edges and ringing.", numbers: "The first approximation $\\frac4\\pi(\\sin t+\\frac13\\sin3t)$ has amplitudes about $1.273$ and $0.424$." },
      { title: "Seasonal forecasting", background: "Periodic regression models yearly data with sine and cosine features.", numbers: "A model $20+8\\cos(2\\pi d/365)$ predicts $28$ at $d=0$ and $12$ at $d=182.5$." },
      { title: "Image compression", background: "JPEG uses cosine-series-like blocks to keep low-frequency structure and discard small high-frequency weights.", numbers: "If a block coefficient drops from $80$ to $5$, keeping only the $80$ term preserves most visible energy: $80^2/(80^2+5^2)\\approx0.996$." },
      { title: "Vibration analysis", background: "Mechanical systems are diagnosed by harmonic content: a strong harmonic can reveal imbalance or resonance.", numbers: "A signal $4\\cos(30t)+1\\cos(90t)$ has the third harmonic amplitude $1$, one quarter of the fundamental amplitude $4$." },
      { title: "Neural network features", background: "Fourier features map inputs into sinusoidal coordinates so models can learn high-frequency variation.", numbers: "For $x=0.25$, features $[\\sin(2\\pi x),\\cos(2\\pi x)]$ equal $[1,0]$." }
    ],
    applicationsClose: "Fourier series turn shape into coordinates: average level, then one frequency at a time.",
    takeaways: [
      "A $2\\pi$-periodic Fourier series uses $a_0/2$, cosine coefficients $a_n$, and sine coefficients $b_n$.",
      "Orthogonality gives the coefficient formulas by isolating one frequency at a time.",
      "Even functions have only cosine terms; odd functions have only sine terms.",
      "Fourier series are the language of periodic audio, images, vibrations, and seasonal signals."
    ]
  },

  "math-06-04": {
    id: "math-06-04",
    title: "Convergence of Fourier series",
    tagline: "A Fourier series converges to the signal at smooth points and to the midpoint at jumps.",
    connections: {
      buildsOn: ["Fourier series", "one-sided limits", "continuity"],
      leadsTo: ["complex Fourier coefficients", "Fourier transform", "distributions"],
      usedWith: ["piecewise functions", "limits", "infinite series", "mean-square approximation"]
    },
    motivation:
      "<p>Fourier series feel almost magical, but a wise learner asks the honest question: does the infinite sum really come back to the original function?</p>" +
      "<p>The answer is beautifully practical. At ordinary continuous points, the series returns the function value. At a jump, it returns the average of the left and right heights. That midpoint rule is the calm way Fourier handles abrupt edges.</p>",
    definition:
      "<p>A common Dirichlet convergence theorem says: if a $2\\pi$-periodic function is piecewise smooth, then its Fourier series at $t$ converges to $$\\frac{f(t^-)+f(t^+)}{2},$$ where $f(t^-)$ and $f(t^+)$ are the left- and right-hand limits. If $f$ is continuous at $t$, this value equals $f(t)$.</p>" +
      "<p>The midpoint appears because the partial sums use symmetric sine and cosine waves. Near a jump, the waves see both sides of the point. They cannot choose only the left or only the right, so the limiting value balances them.</p>" +
      "<p><b>Assumptions that matter:</b> pointwise convergence needs hypotheses such as piecewise smoothness; jump points use one-sided limits, not the assigned function value; finite partial sums can overshoot near jumps; and convergence in average energy can be stronger than pointwise convergence for rough signals.</p>",
    worked: {
      problem: "A $2\\pi$-periodic function has $f(t)=-1$ for $-\\pi<t<0$ and $f(t)=3$ for $0<t<\\pi$. What does its Fourier series converge to at $t=0$?",
      skills: ["one-sided limits", "jump discontinuities", "Fourier convergence"],
      strategy: "At a jump, do not use either side alone. Average the left and right limits.",
      steps: [
        { do: "Find the left-hand limit", result: "$f(0^-)=-1$", why: "values just left of $0$ use the first branch" },
        { do: "Find the right-hand limit", result: "$f(0^+)=3$", why: "values just right of $0$ use the second branch" },
        { do: "Add the side limits", result: "$-1+3=2$", why: "the midpoint uses their sum" },
        { do: "Divide by $2$", result: "$1$", why: "Fourier convergence at a jump gives the average" },
        { do: "State the convergence value", result: "$S(0)=1$", why: "$S$ denotes the Fourier series sum" }
      ],
      verify: "The value $1$ lies exactly halfway between $-1$ and $3$, matching the symmetric treatment of the jump.",
      answer: "The Fourier series converges to $1$ at $t=0$.",
      connects: "The midpoint rule is the practical convergence rule for discontinuities."
    },
    practice: [
      { problem: "If $f$ is continuous and $f(1)=4$, what does its Fourier series converge to at $t=1$ under the usual piecewise-smooth assumptions?", steps: [
        { do: "Use continuity", result: "$f(1^-)=f(1^+)=f(1)$", why: "left and right limits equal the function value" },
        { do: "Substitute the value", result: "$f(1^-)=f(1^+)=4$", why: "the function is continuous at $1$" },
        { do: "Apply the midpoint formula", result: "$\\frac{4+4}{2}$", why: "Fourier convergence uses side limits" },
        { do: "Simplify", result: "$4$", why: "equal side limits average to themselves" },
        { do: "State the conclusion", result: "the series converges to $4$", why: "continuous points are recovered exactly" }
      ], answer: "It converges to $4$." },
      { problem: "A jump has left limit $2$ and right limit $10$. Find the Fourier convergence value at the jump.", steps: [
        { do: "Write the side limits", result: "$f(t^-)=2$, $f(t^+)=10$", why: "these are the values approaching the jump" },
        { do: "Add them", result: "$2+10=12$", why: "midpoint starts with the sum" },
        { do: "Divide by $2$", result: "$6$", why: "average the two sides" },
        { do: "Check location", result: "$6$ is halfway between $2$ and $10$", why: "the distance to each side is $4$" },
        { do: "State the series value", result: "$S(t)=6$", why: "Fourier chooses the midpoint at jumps" }
      ], answer: "$6$." },
      { problem: "For the square wave $f(t)=1$ on $(0,\\pi)$ and $-1$ on $(-\\pi,0)$, find the convergence values at $t=0$ and $t=\\pi$.", steps: [
        { do: "Read the sides at $0$", result: "$f(0^-)=-1$, $f(0^+)=1$", why: "left and right branches meet at a jump" },
        { do: "Average at $0$", result: "$(-1+1)/2=0$", why: "midpoint rule" },
        { do: "Use periodicity at $\\pi$", result: "$f(\\pi^-) = 1$ and $f(\\pi^+)=-1$", why: "just after $\\pi$ wraps to just after $-\\pi$" },
        { do: "Average at $\\pi$", result: "$(1-1)/2=0$", why: "the endpoint is also a jump in the periodic extension" },
        { do: "State both values", result: "$0$ and $0$", why: "both jumps are symmetric" }
      ], answer: "The Fourier series converges to $0$ at both $t=0$ and $t=\\pi$." },
      { problem: "A finite partial Fourier sum near a jump overshoots from $0$ to about $1.09$ when the right-hand value is $1$. Compute the overshoot above the right-hand value as a percent of jump height $1$.", steps: [
        { do: "Find the excess", result: "$1.09-1=0.09$", why: "overshoot means above the target side" },
        { do: "Identify the jump height", result: "$1-0=1$", why: "the signal jumps from $0$ to $1$" },
        { do: "Divide excess by jump height", result: "$0.09/1=0.09$", why: "fraction of the jump" },
        { do: "Convert to percent", result: "$9\\%$", why: "multiply by $100$" },
        { do: "Interpret", result: "about $9\\%$ overshoot", why: "this is the Gibbs-style edge behavior" }
      ], answer: "The overshoot is about $9\\%$ of the jump height." },
      { problem: "Suppose $f(t)=t^2$ on $[-\\pi,\\pi]$ and is extended periodically. What does its Fourier series converge to at $t=\\pi$?", steps: [
        { do: "Find the left limit at $\\pi$", result: "$f(\\pi^-)=\\pi^2$", why: "inside the interval the function approaches $\\pi^2$" },
        { do: "Find the right limit using periodicity", result: "$f(\\pi^+)=f(-\\pi^+)=\\pi^2$", why: "the periodic extension wraps to the left endpoint" },
        { do: "Compare the side limits", result: "$\\pi^2=\\pi^2$", why: "there is no jump at the periodic seam" },
        { do: "Apply the midpoint formula", result: "$(\\pi^2+\\pi^2)/2=\\pi^2$", why: "equal limits average to themselves" },
        { do: "State convergence", result: "$S(\\pi)=\\pi^2$", why: "the periodic extension is continuous at the seam" }
      ], answer: "It converges to $\\pi^2$ at $t=\\pi$." }
    ],
    applications: [
      { title: "Edge ringing in images", background: "Truncated Fourier or cosine expansions can create ripples near sharp edges, a visible form of jump convergence behavior.", numbers: "A black-to-white edge from $0$ to $1$ may show about $0.09$ overshoot in ideal Fourier truncation." },
      { title: "Audio clicks", background: "Abrupt waveform jumps require many high frequencies. Partial sums approximate the jump with ringing.", numbers: "A jump from $-0.5$ to $0.5$ has midpoint $0$ and jump height $1$." },
      { title: "Signal reconstruction", background: "Band-limited reconstructions often smooth discontinuities because finite frequencies cannot make a perfect jump.", numbers: "Using only $50$ harmonics captures features wider than roughly $2\\pi/50\\approx0.126$ radians better than sharper edges." },
      { title: "Numerical PDEs", background: "Fourier methods solve equations efficiently on periodic domains, but shocks and discontinuities need careful interpretation.", numbers: "A shock with left state $2$ and right state $5$ has Fourier midpoint value $3.5$ at the discontinuity." },
      { title: "Compression artifacts", background: "Keeping too few frequency coefficients blurs edges and produces oscillations because high frequencies carry sharp transitions.", numbers: "If an edge needs $100$ harmonics and only $10$ are kept, the highest represented frequency is one tenth as large." },
      { title: "Modeling discontinuous labels", background: "Hard thresholds are discontinuous, so sinusoidal approximations near boundaries behave differently from smooth regression targets.", numbers: "A label jump from $0$ to $1$ has Fourier boundary value $0.5$, not either class label." }
    ],
    applicationsClose: "Convergence teaches humility: Fourier series recover smooth behavior cleanly and treat jumps by averaging both sides.",
    takeaways: [
      "At continuous points, a piecewise-smooth Fourier series converges to $f(t)$.",
      "At jumps, it converges to $\\frac{f(t^-)+f(t^+)}{2}$.",
      "Finite partial sums can overshoot near jumps even when the limiting midpoint is correct.",
      "Pointwise convergence and average-energy convergence answer different questions."
    ]
  },

  "math-06-05": {
    id: "math-06-05",
    title: "Complex Fourier coefficients",
    tagline: "Complex exponentials package sine and cosine into one clean coefficient per frequency.",
    connections: {
      buildsOn: ["Fourier series", "Euler's formula", "complex numbers"],
      leadsTo: ["The Fourier transform", "spectral methods", "discrete Fourier transform"],
      usedWith: ["inner products", "orthogonality", "complex conjugates", "linear algebra"]
    },
    motivation:
      "<p>Sine and cosine coefficients work, but they come in pairs. Euler's formula $e^{int}=\\cos(nt)+i\\sin(nt)$ lets us treat each frequency as one rotating complex wave.</p>" +
      "<p>The complex form is not meant to make the idea stranger. It makes bookkeeping cleaner: negative frequencies, phases, and amplitudes all live in one symmetric coefficient sequence.</p>",
    definition:
      "<p>For a $2\\pi$-periodic function $f$, the complex Fourier series is $$f(t)\\sim\\sum_{n=-\\infty}^{\\infty}c_n e^{int},\\quad c_n=\\frac{1}{2\\pi}\\int_{-\\pi}^{\\pi}f(t)e^{-int}\\,dt.$$ Here $i^2=-1$, $n$ is an integer frequency, and $c_n$ is the complex coordinate of $f$ in the direction $e^{int}$.</p>" +
      "<p>The coefficient formula comes from complex orthogonality: $\\int_{-\\pi}^{\\pi}e^{int}e^{-ikt}\\,dt$ is $2\\pi$ when $n=k$ and $0$ otherwise. Multiplying by $e^{-ikt}$ and integrating isolates $c_k$.</p>" +
      "<p><b>Assumptions that matter:</b> this form uses period $2\\pi$; real-valued signals satisfy $c_{-n}=\\overline{c_n}$; $c_0$ is the average value; and complex coefficients encode both amplitude and phase.</p>",
    worked: {
      problem: "Find the complex Fourier coefficients for $f(t)=3\\cos t$.",
      skills: ["Euler's formula", "coefficient matching", "negative frequencies"],
      strategy: "Rewrite cosine as two complex exponentials, then read the coefficients.",
      steps: [
        { do: "Use Euler's cosine identity", result: "$\\cos t=\\frac{e^{it}+e^{-it}}{2}$", why: "cosine is the even part of complex rotation" },
        { do: "Multiply by $3$", result: "$3\\cos t=\\frac32e^{it}+\\frac32e^{-it}$", why: "scale both exponential terms" },
        { do: "Match the $n=1$ term", result: "$c_1=\\frac32$", why: "the coefficient of $e^{it}$ is $c_1$" },
        { do: "Match the $n=-1$ term", result: "$c_{-1}=\\frac32$", why: "the coefficient of $e^{-it}$ is $c_{-1}$" },
        { do: "Set other coefficients", result: "$c_n=0$ for $n\\ne\\pm1$", why: "no other exponentials appear" }
      ],
      verify: "$c_1e^{it}+c_{-1}e^{-it}=\\frac32(e^{it}+e^{-it})=3\\cos t$.",
      answer: "$c_1=c_{-1}=\\frac32$, and all other $c_n$ are $0$.",
      connects: "Complex coefficients combine the two real trig coordinates into positive and negative frequency coordinates."
    },
    practice: [
      { problem: "Find the complex coefficients for $f(t)=2\\sin t$.", steps: [
        { do: "Use Euler's sine identity", result: "$\\sin t=\\frac{e^{it}-e^{-it}}{2i}$", why: "sine is the odd part of complex rotation" },
        { do: "Multiply by $2$", result: "$2\\sin t=\\frac{e^{it}-e^{-it}}{i}$", why: "scale the sine" },
        { do: "Simplify $1/i$", result: "$1/i=-i$", why: "multiply numerator and denominator by $i$" },
        { do: "Read the $e^{it}$ coefficient", result: "$c_1=-i$", why: "the coefficient is $1/i$" },
        { do: "Read the $e^{-it}$ coefficient", result: "$c_{-1}=i$", why: "the negative sign changes $-1/i$ to $i$" }
      ], answer: "$c_1=-i$, $c_{-1}=i$, and all other coefficients are $0$." },
      { problem: "Find $c_0$ for $f(t)=4+\\cos(2t)$.", steps: [
        { do: "Use the average formula", result: "$c_0=\\frac1{2\\pi}\\int_{-\\pi}^{\\pi}(4+\\cos(2t))\\,dt$", why: "the zero-frequency coefficient is the average" },
        { do: "Integrate the constant", result: "$8\\pi$", why: "four over length $2\\pi$ gives area $8\\pi$" },
        { do: "Integrate the cosine", result: "$0$", why: "full cycles cancel" },
        { do: "Substitute", result: "$c_0=\\frac1{2\\pi}(8\\pi)$", why: "combine the areas" },
        { do: "Simplify", result: "$4$", why: "divide by $2\\pi$" }
      ], answer: "$c_0=4$." },
      { problem: "Convert real coefficients $a_2=6$ and $b_2=-4$ into complex coefficients $c_2$ and $c_{-2}$.", steps: [
        { do: "Use the conversion", result: "$c_n=\\frac{a_n-ib_n}{2}$", why: "combine cosine and sine at positive frequency" },
        { do: "Substitute $a_2=6$, $b_2=-4$", result: "$c_2=\\frac{6-i(-4)}{2}$", why: "use the given real coefficients" },
        { do: "Simplify $c_2$", result: "$c_2=3+2i$", why: "divide by $2$" },
        { do: "Use conjugate symmetry", result: "$c_{-2}=\\overline{c_2}$", why: "the original signal is real-valued" },
        { do: "Write the negative coefficient", result: "$c_{-2}=3-2i$", why: "conjugation flips the sign of the imaginary part" }
      ], answer: "$c_2=3+2i$ and $c_{-2}=3-2i$." },
      { problem: "For $c_3=2e^{-i\\pi/4}$ and $c_{-3}=2e^{i\\pi/4}$, find the real contribution at frequency $3$.", steps: [
        { do: "Write the paired terms", result: "$2e^{-i\\pi/4}e^{i3t}+2e^{i\\pi/4}e^{-i3t}$", why: "use positive and negative frequencies together" },
        { do: "Combine exponents", result: "$2e^{i(3t-\\pi/4)}+2e^{-i(3t-\\pi/4)}$", why: "add exponents with the same base" },
        { do: "Use the cosine identity", result: "$4\\cos(3t-\\pi/4)$", why: "$e^{ix}+e^{-ix}=2\\cos x$" },
        { do: "Read the amplitude", result: "$4$", why: "paired complex magnitude $2$ becomes real amplitude $4$" },
        { do: "Read the phase", result: "$\\pi/4$", why: "the cosine is shifted by $\\pi/4$" }
      ], answer: "The real contribution is $4\\cos(3t-\\pi/4)$." },
      { problem: "Compute $c_1$ for $f(t)=e^{it}+2e^{-i2t}$.", steps: [
        { do: "Identify the series form", result: "$f(t)=1\\cdot e^{i1t}+2\\cdot e^{-i2t}$", why: "the function is already in complex Fourier form" },
        { do: "Match the $n=1$ term", result: "$c_1=1$", why: "coefficient of $e^{it}$" },
        { do: "Match the $n=-2$ term", result: "$c_{-2}=2$", why: "coefficient of $e^{-i2t}$" },
        { do: "Check for other $n=1$ contributions", result: "none", why: "orthogonality prevents the $n=-2$ term from contributing to $c_1$" },
        { do: "State the requested coefficient", result: "$c_1=1$", why: "only the first term matches" }
      ], answer: "$c_1=1$." }
    ],
    applications: [
      { title: "Phase and amplitude", background: "Complex coefficients store phase naturally, which is cleaner than separate sine and cosine numbers.", numbers: "If $c_5=3e^{i\\pi/6}$, the paired real amplitude is $2|c_5|=6$." },
      { title: "Discrete Fourier transform", background: "The DFT is the sampled version of complex Fourier coefficients and powers modern signal processing.", numbers: "For $N=8$, frequency index $k=2$ corresponds to $2$ cycles per $8$ samples." },
      { title: "Spectral neural operators", background: "Some ML architectures transform data to Fourier coefficients, modify them, and transform back.", numbers: "Keeping $16$ complex modes out of $128$ keeps $16/128=12.5\\%$ of frequency indices." },
      { title: "Communication phase shifts", background: "Radio signals encode information in amplitude and phase, both represented by complex numbers.", numbers: "A coefficient $2e^{i\\pi/2}=2i$ has magnitude $2$ and phase $90^\\circ$." },
      { title: "Fast convolution", background: "Complex Fourier coefficients turn convolution into multiplication, which is why FFT methods are fast.", numbers: "Multiplying coefficients $(3+4i)(1-i)=7+i$ combines magnitude and phase at one frequency." },
      { title: "Real-signal symmetry", background: "For real data, negative frequencies are not extra information; they are conjugates of positive frequencies.", numbers: "If $c_7=1-2i$, then $c_{-7}=1+2i$ for a real-valued signal." }
    ],
    applicationsClose: "Complex Fourier coefficients are compact frequency coordinates: one number carries size, direction, and phase.",
    takeaways: [
      "The complex series is $\\sum c_n e^{int}$ with $c_n=\\frac1{2\\pi}\\int f(t)e^{-int}\\,dt$.",
      "Euler's formula turns sine and cosine pairs into positive and negative complex frequencies.",
      "Real signals satisfy $c_{-n}=\\overline{c_n}$.",
      "Magnitude and phase live naturally inside each complex coefficient."
    ]
  },

  "math-06-06": {
    id: "math-06-06",
    title: "The Fourier transform",
    tagline: "The Fourier transform turns a nonperiodic signal into a continuum of frequencies.",
    connections: {
      buildsOn: ["complex Fourier coefficients", "improper integrals", "complex exponentials"],
      leadsTo: ["properties of the Fourier transform", "the convolution theorem", "spectral analysis"],
      usedWith: ["integrals", "inner products", "linear systems", "limits"]
    },
    motivation:
      "<p>Fourier series works beautifully for repeating signals. But many signals do not repeat: a pulse, a word, a click, a probability density, a one-time measurement.</p>" +
      "<p>The <b>Fourier transform</b> keeps the same question and changes the setting. Instead of integer harmonics of one period, it asks how much of every real frequency $\\omega$ is present.</p>",
    definition:
      "<p>One common convention defines the Fourier transform of $f$ by $$\\hat{f}(\\omega)=\\int_{-\\infty}^{\\infty} f(t)e^{-i\\omega t}\\,dt,$$ with inverse $$f(t)=\\frac1{2\\pi}\\int_{-\\infty}^{\\infty}\\hat{f}(\\omega)e^{i\\omega t}\\,d\\omega.$$ Here $t$ is the original variable, $\\omega$ is angular frequency, and $\\hat{f}(\\omega)$ is the frequency-domain description.</p>" +
      "<p>This is the limiting version of complex Fourier series as the period grows without bound. The frequency spacing becomes smaller and smaller, so the coefficient sum becomes an integral over continuous frequency.</p>" +
      "<p><b>Assumptions that matter:</b> transform conventions differ by factors of $2\\pi$; ordinary integrals work cleanly for integrable functions; some important signals require distributions; and $\\hat{f}$ is generally complex because it stores amplitude and phase.</p>",
    worked: {
      problem: "Compute the Fourier transform of $f(t)=e^{-a t}$ for $t\\ge0$ and $0$ for $t<0$, with $a>0$.",
      skills: ["improper integrals", "complex exponentials", "transform definition"],
      strategy: "Use the definition and combine the real decay with the complex oscillation before integrating.",
      steps: [
        { do: "Write the transform", result: "$\\hat{f}(\\omega)=\\int_0^{\\infty}e^{-at}e^{-i\\omega t}\\,dt$", why: "the signal is zero for negative $t$" },
        { do: "Combine exponents", result: "$\\int_0^{\\infty}e^{-(a+i\\omega)t}\\,dt$", why: "multiply exponentials by adding exponents" },
        { do: "Find an antiderivative", result: "$-\\frac{1}{a+i\\omega}e^{-(a+i\\omega)t}$", why: "differentiate to recover the integrand" },
        { do: "Evaluate at $\\infty$", result: "$0$", why: "$a>0$ makes the real decay vanish" },
        { do: "Evaluate at $0$ and subtract", result: "$0-\\left(-\\frac1{a+i\\omega}\\right)=\\frac1{a+i\\omega}$", why: "$e^0=1$" }
      ],
      verify: "At $\\omega=0$, the transform is $1/a$, which equals the area under $e^{-at}$ on $[0,\\infty)$.",
      answer: "$\\hat{f}(\\omega)=\\dfrac1{a+i\\omega}$.",
      connects: "The transform measures how a decaying pulse overlaps every complex sinusoid."
    },
    practice: [
      { problem: "Compute $\\hat{f}(0)$ for $f(t)=e^{-2|t|}$.", steps: [
        { do: "Use the definition at zero frequency", result: "$\\hat{f}(0)=\\int_{-\\infty}^{\\infty}e^{-2|t|}\\,dt$", why: "$e^{-i0t}=1$" },
        { do: "Use even symmetry", result: "$2\\int_0^{\\infty}e^{-2t}\\,dt$", why: "the function is even" },
        { do: "Integrate the exponential", result: "$\\int_0^{\\infty}e^{-2t}\\,dt=1/2$", why: "area of a decaying exponential with rate $2$" },
        { do: "Multiply by $2$", result: "$1$", why: "include both sides of the real line" },
        { do: "Interpret", result: "$\\hat{f}(0)=1$", why: "zero frequency equals total area" }
      ], answer: "$\\hat{f}(0)=1$." },
      { problem: "Compute the transform of the box $f(t)=1$ for $|t|\\le1$ and $0$ otherwise.", steps: [
        { do: "Write the finite integral", result: "$\\hat{f}(\\omega)=\\int_{-1}^{1}e^{-i\\omega t}\\,dt$", why: "the signal is zero outside the box" },
        { do: "Find an antiderivative", result: "$\\frac{e^{-i\\omega t}}{-i\\omega}$", why: "integrate the exponential" },
        { do: "Evaluate endpoints", result: "$\\frac{e^{-i\\omega}-e^{i\\omega}}{-i\\omega}$", why: "substitute $1$ and $-1$" },
        { do: "Use Euler's sine identity", result: "$\\frac{-2i\\sin\\omega}{-i\\omega}$", why: "$e^{-i\\omega}-e^{i\\omega}=-2i\\sin\\omega$" },
        { do: "Simplify", result: "$\\frac{2\\sin\\omega}{\\omega}$", why: "cancel $-i$" }
      ], answer: "$\\hat{f}(\\omega)=2\\sin\\omega/\\omega$, with value $2$ at $\\omega=0$ by continuity." },
      { problem: "Using the convention above, what is the inverse-transform constant?", steps: [
        { do: "Read the forward convention", result: "$\\hat{f}(\\omega)=\\int f(t)e^{-i\\omega t}\\,dt$", why: "there is no constant in front" },
        { do: "Recall the matching inverse", result: "$f(t)=\\frac1{2\\pi}\\int\\hat{f}(\\omega)e^{i\\omega t}\\,d\\omega$", why: "this convention puts the full factor in the inverse" },
        { do: "Identify the constant", result: "$1/(2\\pi)$", why: "it multiplies the inverse integral" },
        { do: "Check dimensions", result: "forward times inverse restores the original scale", why: "the $2\\pi$ accounts for angular frequency" },
        { do: "State the answer", result: "$\\frac1{2\\pi}$", why: "that is the inverse normalization" }
      ], answer: "The inverse-transform constant is $1/(2\\pi)$." },
      { problem: "For $f(t)=e^{-3t}$ on $t\\ge0$, find $|\\hat{f}(4)|$.", steps: [
        { do: "Use the one-sided exponential transform", result: "$\\hat{f}(\\omega)=1/(3+i\\omega)$", why: "use $a=3$" },
        { do: "Substitute $\\omega=4$", result: "$\\hat{f}(4)=1/(3+4i)$", why: "evaluate at the requested frequency" },
        { do: "Find the denominator magnitude", result: "$|3+4i|=5$", why: "use the $3$-$4$-$5$ triangle" },
        { do: "Take the reciprocal magnitude", result: "$|1/(3+4i)|=1/5$", why: "magnitudes divide" },
        { do: "Convert to decimal", result: "$0.2$", why: "$1/5=0.2$" }
      ], answer: "$|\\hat{f}(4)|=0.2$." },
      { problem: "A sampled signal lasts $0.5$ seconds. Estimate the rough frequency resolution $\\Delta f$ in cycles per second.", steps: [
        { do: "Name the observation length", result: "$T=0.5$ seconds", why: "finite windows set frequency spacing" },
        { do: "Use the resolution rule", result: "$\\Delta f\\approx1/T$", why: "one full extra cycle must fit in the window" },
        { do: "Substitute $T=0.5$", result: "$\\Delta f\\approx1/0.5$", why: "use the given duration" },
        { do: "Simplify", result: "$2$ Hz", why: "divide by one half" },
        { do: "Interpret", result: "frequencies closer than about $2$ Hz are hard to separate", why: "short windows blur frequency" }
      ], answer: "The rough frequency resolution is $2$ Hz." }
    ],
    applications: [
      { title: "Audio spectrum", background: "Audio tools display frequency content by transforming time pressure into frequency amplitudes.", numbers: "A $0.01$ second window has rough resolution $1/0.01=100$ Hz." },
      { title: "Image frequency analysis", background: "Images can be transformed along spatial axes; low frequencies are smooth regions and high frequencies are edges.", numbers: "A stripe pattern repeating every $8$ pixels has spatial frequency $1/8=0.125$ cycles per pixel." },
      { title: "Probability characteristic functions", background: "Probability uses a Fourier-transform cousin to describe distributions through expectations of complex exponentials.", numbers: "For a normal with variance $4$, the characteristic function magnitude includes $e^{-4\\omega^2/2}=e^{-2\\omega^2}$." },
      { title: "Solving differential equations", background: "Fourier transforms turn derivatives into multiplication, simplifying linear differential equations.", numbers: "If differentiation becomes $i\\omega$, then a second derivative becomes $(i\\omega)^2=-\\omega^2$." },
      { title: "MRI reconstruction", background: "MRI machines measure frequency-domain data and reconstruct spatial images by inverse Fourier transform.", numbers: "A $256\\times256$ image has $65,536$ spatial pixels and the same number of frequency samples in a full grid." },
      { title: "ML spectral bias", background: "Neural networks often learn low-frequency components earlier than high-frequency details, so Fourier analysis helps diagnose training behavior.", numbers: "If a target has amplitudes $10$ at frequency $1$ and $0.5$ at frequency $20$, the low-frequency energy is $10^2/0.5^2=400$ times larger." }
    ],
    applicationsClose: "The Fourier transform is the nonperiodic frequency lens: time or space on one side, continuous frequency on the other.",
    takeaways: [
      "With this convention, $\\hat{f}(\\omega)=\\int f(t)e^{-i\\omega t}\\,dt$ and the inverse has $1/(2\\pi)$.",
      "Fourier series become Fourier transforms when the period grows and frequency spacing becomes continuous.",
      "Zero frequency records total area under the signal.",
      "Transforms are complex because they store phase as well as amplitude."
    ]
  },

  "math-06-07": {
    id: "math-06-07",
    title: "Properties of the Fourier transform",
    tagline: "Shifts, scales, derivatives, and modulation have predictable signatures in frequency.",
    connections: {
      buildsOn: ["The Fourier transform", "complex exponentials", "calculus rules"],
      leadsTo: ["The convolution theorem", "filtering", "spectral PDE methods"],
      usedWith: ["linearity", "change of variables", "integration by parts", "symmetry"]
    },
    motivation:
      "<p>Computing every transform from the definition would be tiring. The real power comes when you know how ordinary actions change the spectrum.</p>" +
      "<p>If you shift a signal, its magnitudes stay the same and phases rotate. If you differentiate, high frequencies get multiplied more strongly. These properties let you reason without starting over.</p>",
    definition:
      "<p>Using $\\hat{f}(\\omega)=\\int_{-\\infty}^{\\infty}f(t)e^{-i\\omega t}\\,dt$, key properties include linearity $\\widehat{af+bg}=a\\hat{f}+b\\hat{g}$, time shift $\\widehat{f(t-t_0)}=e^{-i\\omega t_0}\\hat{f}(\\omega)$, scaling $\\widehat{f(at)}=\\frac1{|a|}\\hat{f}(\\omega/a)$, and differentiation $\\widehat{f'}=i\\omega\\hat{f}(\\omega)$ when boundary terms vanish.</p>" +
      "<p>The derivative rule follows by integration by parts: $\\int f'(t)e^{-i\\omega t}\\,dt=[f(t)e^{-i\\omega t}]_{-\\infty}^{\\infty}+i\\omega\\int f(t)e^{-i\\omega t}\\,dt$. If the boundary term is zero, only $i\\omega\\hat{f}$ remains.</p>" +
      "<p><b>Assumptions that matter:</b> boundary decay is needed for derivative formulas; scaling uses $|a|$ because interval length changes; shifts change phase but not magnitude; and all properties depend on the transform convention.</p>",
    worked: {
      problem: "If $\\hat{f}(\\omega)=1/(1+\\omega^2)$, find the transform of $g(t)=f(t-3)$.",
      skills: ["time shifts", "phase factors", "frequency-domain reading"],
      strategy: "A delay in time multiplies the transform by a complex phase factor.",
      steps: [
        { do: "Identify the shift", result: "$g(t)=f(t-3)$", why: "the signal is delayed by $3$" },
        { do: "Use the shift property", result: "$\\hat{g}(\\omega)=e^{-i\\omega\\cdot3}\\hat{f}(\\omega)$", why: "time delay produces phase rotation" },
        { do: "Substitute $\\hat{f}$", result: "$\\hat{g}(\\omega)=e^{-i3\\omega}\\frac1{1+\\omega^2}$", why: "use the given transform" },
        { do: "Read the magnitude", result: "$|\\hat{g}(\\omega)|=1/(1+\\omega^2)$", why: "$|e^{-i3\\omega}|=1$" },
        { do: "Read the phase change", result: "phase decreases by $3\\omega$", why: "the exponential is a pure rotation" }
      ],
      verify: "A shift should not change how much of each frequency is present, only where the wave aligns in phase.",
      answer: "$\\hat{g}(\\omega)=e^{-i3\\omega}/(1+\\omega^2)$.",
      connects: "Transform properties let us update spectra when the time signal is moved, stretched, or differentiated."
    },
    practice: [
      { problem: "If $h(t)=2f(t)-3g(t)$, express $\\hat{h}(\\omega)$ in terms of $\\hat{f}$ and $\\hat{g}$.", steps: [
        { do: "Identify the operation", result: "linear combination", why: "$h$ is built by scaling and adding signals" },
        { do: "Apply linearity to $2f$", result: "$\\widehat{2f}=2\\hat{f}$", why: "constants pass through the transform" },
        { do: "Apply linearity to $-3g$", result: "$\\widehat{-3g}=-3\\hat{g}$", why: "negative scaling also passes through" },
        { do: "Add the transformed pieces", result: "$\\hat{h}(\\omega)=2\\hat{f}(\\omega)-3\\hat{g}(\\omega)$", why: "transforms preserve sums" },
        { do: "Check variables", result: "all terms use the same $\\omega$", why: "they live in the same frequency domain" }
      ], answer: "$\\hat{h}(\\omega)=2\\hat{f}(\\omega)-3\\hat{g}(\\omega)$." },
      { problem: "If $\\hat{f}(\\omega)=e^{-\\omega^2}$, find the transform of $f(2t)$.", steps: [
        { do: "Identify the scale", result: "$a=2$", why: "the input is $2t$" },
        { do: "Use the scaling property", result: "$\\widehat{f(2t)}=\\frac12\\hat{f}(\\omega/2)$", why: "time compression widens frequency and halves area" },
        { do: "Substitute the transform", result: "$\\frac12 e^{-(\\omega/2)^2}$", why: "replace the argument by $\\omega/2$" },
        { do: "Simplify the exponent", result: "$\\frac12 e^{-\\omega^2/4}$", why: "square $\\omega/2$" },
        { do: "Interpret", result: "frequency content is wider", why: "time compression broadens the spectrum" }
      ], answer: "$\\widehat{f(2t)}(\\omega)=\\frac12e^{-\\omega^2/4}$." },
      { problem: "If $\\hat{f}(\\omega)=1/(1+\\omega^2)$ and boundary terms vanish, find $\\widehat{f'}(\\omega)$.", steps: [
        { do: "Use the derivative property", result: "$\\widehat{f'}(\\omega)=i\\omega\\hat{f}(\\omega)$", why: "differentiation becomes multiplication" },
        { do: "Substitute $\\hat{f}$", result: "$i\\omega\\cdot\\frac1{1+\\omega^2}$", why: "use the given transform" },
        { do: "Write as one fraction", result: "$\\frac{i\\omega}{1+\\omega^2}$", why: "combine factors" },
        { do: "Check zero frequency", result: "$0$", why: "a derivative has zero total area when endpoints match" },
        { do: "Interpret high frequencies", result: "larger $|\\omega|$ are emphasized", why: "multiplication by $\\omega$ boosts rapid oscillations" }
      ], answer: "$\\widehat{f'}(\\omega)=\\frac{i\\omega}{1+\\omega^2}$." },
      { problem: "If $g(t)=e^{i5t}f(t)$, express $\\hat{g}(\\omega)$.", steps: [
        { do: "Write the transform", result: "$\\hat{g}(\\omega)=\\int f(t)e^{i5t}e^{-i\\omega t}\\,dt$", why: "use the definition" },
        { do: "Combine exponentials", result: "$\\int f(t)e^{-i(\\omega-5)t}\\,dt$", why: "$i5t-i\\omega t=-i(\\omega-5)t$" },
        { do: "Recognize the transform argument", result: "$\\hat{f}(\\omega-5)$", why: "the frequency variable is shifted" },
        { do: "Name the property", result: "modulation shifts spectrum", why: "multiplying by a complex tone moves frequencies" },
        { do: "Interpret the direction", result: "shift right by $5$", why: "features at frequency $0$ move to $5$" }
      ], answer: "$\\hat{g}(\\omega)=\\hat{f}(\\omega-5)$." },
      { problem: "A signal is delayed by $0.01$ seconds. At frequency $100$ Hz, what phase shift in radians occurs for $e^{-i2\\pi f t_0}$?", steps: [
        { do: "Name the delay", result: "$t_0=0.01$", why: "given in seconds" },
        { do: "Name the frequency", result: "$f=100$ Hz", why: "cycles per second" },
        { do: "Use angular phase", result: "$2\\pi f t_0$", why: "one cycle is $2\\pi$ radians" },
        { do: "Substitute values", result: "$2\\pi\\cdot100\\cdot0.01=2\\pi$", why: "the delay is one full cycle at $100$ Hz" },
        { do: "Apply the delay sign", result: "$-2\\pi$", why: "a delay uses $e^{-i2\\pi f t_0}$" }
      ], answer: "The phase shift is $-2\\pi$ radians, equivalent to no visible phase change modulo $2\\pi$." }
    ],
    applications: [
      { title: "Filtering derivatives", background: "Edges in images are derivatives, and the Fourier derivative rule explains why edges emphasize high frequencies.", numbers: "At $\\omega=10$, differentiation multiplies magnitude by $10$; at $\\omega=1$, it multiplies by $1$." },
      { title: "Audio delay", background: "A pure delay should not change loudness at any frequency, only phase alignment.", numbers: "A $5$ ms delay at $200$ Hz gives phase $-2\\pi\\cdot200\\cdot0.005=-2\\pi$." },
      { title: "Time stretching", background: "Slowing a signal spreads it in time and compresses its spectrum.", numbers: "If $g(t)=f(t/2)$, then $\\hat{g}(\\omega)=2\\hat{f}(2\\omega)$, so frequencies are halved." },
      { title: "Radio modulation", background: "Multiplying by a carrier moves a baseband signal up to a transmission frequency.", numbers: "Multiplication by $e^{i1000t}$ shifts $\\hat{f}(\\omega)$ to $\\hat{f}(\\omega-1000)$." },
      { title: "PDE solvers", background: "Fourier methods solve constant-coefficient differential equations by replacing derivatives with powers of $i\\omega$.", numbers: "A second derivative transforms to $-\\omega^2\\hat{f}$, so at $\\omega=3$ the multiplier is $-9$." },
      { title: "Data augmentation shifts", background: "Shift-invariant models should respond similarly to translated inputs. Fourier magnitudes explain why phase changes but energy does not.", numbers: "For a shift by $4$ pixels, coefficient magnitude stays $|C_k|$ while phase changes by $-2\\pi k\\cdot4/N$." }
    ],
    applicationsClose: "Transform properties are a toolkit: change the signal in time, and the frequency-domain effect is usually simpler than recomputing from scratch.",
    takeaways: [
      "Linearity lets transforms pass through sums and scalar multiples.",
      "Time shifts multiply by phase factors and preserve magnitude.",
      "Time compression broadens frequency content with a $1/|a|$ scale factor.",
      "Differentiation becomes multiplication by $i\\omega$ when boundary terms vanish."
    ]
  },

  "math-06-08": {
    id: "math-06-08",
    title: "The convolution theorem",
    tagline: "Convolution in time becomes multiplication in frequency, and multiplication in time becomes convolution in frequency.",
    connections: {
      buildsOn: ["properties of the Fourier transform", "integrals", "linear systems"],
      leadsTo: ["filtering", "spectral algorithms", "distributions"],
      usedWith: ["Fourier transform", "inner products", "probability densities", "polynomials"]
    },
    motivation:
      "<p>Convolution can feel like a heavy sliding integral: flip one function, slide it, multiply, and add. That is a lot to carry in the time domain.</p>" +
      "<p>The Fourier transform reveals the simple story underneath. A filter that convolves with a signal simply multiplies each frequency by a frequency response. That is one of the most useful facts in applied mathematics.</p>",
    definition:
      "<p>The convolution of two functions is $$(f*g)(t)=\\int_{-\\infty}^{\\infty}f(\\tau)g(t-\\tau)\\,d\\tau.$$ With the transform convention $\\hat{f}(\\omega)=\\int f(t)e^{-i\\omega t}\\,dt$, the <b>convolution theorem</b> says $$\\widehat{f*g}(\\omega)=\\hat{f}(\\omega)\\hat{g}(\\omega).$$ Conversely, $\\widehat{fg}=\\frac1{2\\pi}\\hat{f}*\\hat{g}$ under this convention.</p>" +
      "<p>The theorem comes from substituting the convolution integral into the transform, then changing variables $u=t-\\tau$. The inner integral becomes $\\hat{g}(\\omega)$ and the remaining outer integral becomes $\\hat{f}(\\omega)$.</p>" +
      "<p><b>Assumptions that matter:</b> the functions need enough integrability to swap integrals safely; constants depend on the Fourier convention; convolution is commutative; and in discrete computation, circular convolution appears unless padding prevents wraparound.</p>",
    worked: {
      problem: "If $\\hat{f}(\\omega)=\\frac1{1+\\omega^2}$ and $\\hat{g}(\\omega)=e^{-\\omega^2}$, find $\\widehat{f*g}(\\omega)$.",
      skills: ["convolution theorem", "frequency multiplication", "transform notation"],
      strategy: "Do not compute the sliding integral. Multiply the two transforms.",
      steps: [
        { do: "Write the theorem", result: "$\\widehat{f*g}=\\hat{f}\\hat{g}$", why: "convolution in time becomes multiplication in frequency" },
        { do: "Substitute $\\hat{f}$", result: "$\\widehat{f*g}(\\omega)=\\frac1{1+\\omega^2}\\hat{g}(\\omega)$", why: "use the first given transform" },
        { do: "Substitute $\\hat{g}$", result: "$\\frac1{1+\\omega^2}e^{-\\omega^2}$", why: "use the second given transform" },
        { do: "Write as one expression", result: "$\\frac{e^{-\\omega^2}}{1+\\omega^2}$", why: "multiply the frequency responses" },
        { do: "Check zero frequency", result: "$1$", why: "$e^0/(1+0)=1$" }
      ],
      verify: "The result is smaller at high frequency than either a flat response because both factors reduce high-frequency content.",
      answer: "$\\widehat{f*g}(\\omega)=\\dfrac{e^{-\\omega^2}}{1+\\omega^2}$.",
      connects: "Filtering is convolution viewed as frequency-by-frequency multiplication."
    },
    practice: [
      { problem: "A filter has frequency response $H(\\omega)=0.2$ at a certain frequency, and a signal has coefficient $X(\\omega)=5e^{i\\pi/3}$. What is the output coefficient?", steps: [
        { do: "Use frequency multiplication", result: "$Y(\\omega)=H(\\omega)X(\\omega)$", why: "filtering is convolution in time" },
        { do: "Substitute values", result: "$Y=0.2\\cdot5e^{i\\pi/3}$", why: "use the given response and coefficient" },
        { do: "Multiply magnitudes", result: "$1e^{i\\pi/3}$", why: "$0.2\\cdot5=1$" },
        { do: "Read phase", result: "$\\pi/3$", why: "a positive real filter does not change phase" },
        { do: "State the coefficient", result: "$e^{i\\pi/3}$", why: "magnitude one remains" }
      ], answer: "The output coefficient is $e^{i\\pi/3}$." },
      { problem: "Compute the discrete convolution of $[1,2]$ with $[3,4]$.", steps: [
        { do: "Compute index $0$", result: "$1\\cdot3=3$", why: "only the first pair overlaps" },
        { do: "Compute index $1$", result: "$1\\cdot4+2\\cdot3=10$", why: "two overlaps contribute" },
        { do: "Compute index $2$", result: "$2\\cdot4=8$", why: "only the last pair overlaps" },
        { do: "List the result", result: "$[3,10,8]$", why: "linear convolution length is $2+2-1=3$" },
        { do: "Check by polynomial multiplication", result: "$(1+2x)(3+4x)=3+10x+8x^2$", why: "coefficients match convolution" }
      ], answer: "$[3,10,8]$." },
      { problem: "If $\\widehat{f*g}(\\omega)=6$ and $\\hat{f}(\\omega)=2$ at one frequency, find $\\hat{g}(\\omega)$ there.", steps: [
        { do: "Use the convolution theorem", result: "$\\widehat{f*g}=\\hat{f}\\hat{g}$", why: "frequency-domain product" },
        { do: "Substitute the known values", result: "$6=2\\hat{g}(\\omega)$", why: "work at the one frequency" },
        { do: "Divide by $2$", result: "$\\hat{g}(\\omega)=3$", why: "isolate the unknown response" },
        { do: "Check multiplication", result: "$2\\cdot3=6$", why: "matches the output" },
        { do: "Interpret", result: "the second factor triples that frequency after the first factor is counted", why: "responses multiply" }
      ], answer: "$\\hat{g}(\\omega)=3$." },
      { problem: "A moving-average filter uses weights $[1/3,1/3,1/3]$. Convolve it with signal samples $[3,6,9]$ using valid positions only.", steps: [
        { do: "Align the three weights", result: "$[3,6,9]$ under $[1/3,1/3,1/3]$", why: "valid convolution needs full overlap" },
        { do: "Multiply first sample", result: "$3\\cdot1/3=1$", why: "weighted contribution" },
        { do: "Multiply second sample", result: "$6\\cdot1/3=2$", why: "weighted contribution" },
        { do: "Multiply third sample", result: "$9\\cdot1/3=3$", why: "weighted contribution" },
        { do: "Add contributions", result: "$1+2+3=6$", why: "the moving average is the sum of weighted samples" }
      ], answer: "The valid filtered output is $6$." },
      { problem: "Two independent variables have density means $2$ and $5$. Their sum density is a convolution. What is the mean of the sum?", steps: [
        { do: "Name the variables", result: "$X$ has mean $2$, $Y$ has mean $5$", why: "given values" },
        { do: "Use independence", result: "density of $X+Y$ is $f_X*f_Y$", why: "sums of independent variables convolve densities" },
        { do: "Use expectation linearity", result: "$E[X+Y]=E[X]+E[Y]$", why: "means add even before computing the convolution" },
        { do: "Substitute means", result: "$2+5=7$", why: "add the two averages" },
        { do: "Interpret", result: "the convolved density is centered at $7$", why: "the sum's average shifts accordingly" }
      ], answer: "The mean of the sum is $7$." }
    ],
    applications: [
      { title: "Image blurring", background: "Blurring an image convolves it with a small kernel; in frequency, it suppresses high-frequency edges.", numbers: "A $3$-pixel average of $[30,60,90]$ gives $(30+60+90)/3=60$." },
      { title: "CNN layers", background: "Convolutional neural networks learn kernels that detect local patterns such as edges and textures.", numbers: "A kernel $[-1,0,1]$ on samples $[2,5,9]$ gives $-2+0+9=7$, a rightward difference." },
      { title: "Fast polynomial multiplication", background: "Multiplying polynomials is convolution of coefficients, and FFTs speed it up by multiplying values in frequency-like space.", numbers: "$(1+2x)(3+4x)=3+10x+8x^2$, so coefficient convolution is $[3,10,8]$." },
      { title: "Probability sums", background: "The density of a sum of independent random variables is the convolution of their densities.", numbers: "Two independent fair dice have $6$ ways to sum to $7$ out of $36$, so probability is $6/36=1/6$." },
      { title: "Audio reverb", background: "Reverberation convolves dry audio with an impulse response of a room.", numbers: "If an impulse response has echoes $[1,0.5]$, input pulse $[2]$ produces $[2,1]$." },
      { title: "Low-pass filtering", background: "A smoothing filter multiplies the spectrum by a response near $1$ at low frequencies and near $0$ at high frequencies.", numbers: "If $H(2)=0.9$ and $H(20)=0.1$, amplitudes $10$ and $4$ become $9$ and $0.4$." }
    ],
    applicationsClose: "Convolution theorem is the great simplifier: sliding weighted sums in one world become ordinary products in the other.",
    takeaways: [
      "Convolution is $(f*g)(t)=\\int f(\\tau)g(t-\\tau)\\,d\\tau$.",
      "With this convention, $\\widehat{f*g}=\\hat{f}\\hat{g}$.",
      "Filtering is convolution in time and multiplication in frequency.",
      "Discrete convolution underlies CNNs, smoothing, polynomial multiplication, and probability sums."
    ]
  },

  "math-06-09": {
    id: "math-06-09",
    title: "The Dirac delta",
    tagline: "The Dirac delta is an idealized unit impulse that samples a function at one point.",
    connections: {
      buildsOn: ["integrals", "Fourier transform", "limits of narrow pulses"],
      leadsTo: ["Distributions", "impulse responses", "Green's functions"],
      usedWith: ["convolution", "linear systems", "measure-like thinking", "test functions"]
    },
    motivation:
      "<p>Sometimes a system is tested with a very short, very strong input: a tap on a table, a camera flash, a unit spike in a signal. Ordinary functions struggle to describe an infinitely narrow spike with area one.</p>" +
      "<p>The <b>Dirac delta</b> is the ideal version of that spike. It is not a normal function. It is a rule for integrals: place it at $a$, and it extracts the value of the function there.</p>",
    definition:
      "<p>The Dirac delta $\\delta(t-a)$ is defined by its sifting property $$\\int_{-\\infty}^{\\infty} f(t)\\delta(t-a)\\,dt=f(a)$$ for nice test functions $f$. It has total mass $1$ because choosing $f(t)=1$ gives $\\int\\delta(t-a)\\,dt=1$.</p>" +
      "<p>You can think of it as a limit of pulses whose widths shrink and heights grow while area stays $1$. For example, a rectangle of width $\\varepsilon$ and height $1/\\varepsilon$ has area $1$; as $\\varepsilon\\to0$, it concentrates all mass at one point.</p>" +
      "<p><b>Assumptions that matter:</b> $\\delta$ is a distribution, not an ordinary finite-valued function; equations involving it are interpreted under integrals; scaling obeys $\\delta(at)=\\delta(t)/|a|$; and convolution with $\\delta$ leaves a signal unchanged.</p>",
    worked: {
      problem: "Evaluate $\\displaystyle\\int_{-\\infty}^{\\infty}(t^2+3t)\\delta(t-2)\\,dt$.",
      skills: ["sifting property", "evaluation", "distributions"],
      strategy: "The delta at $2$ samples the function multiplying it at $t=2$.",
      steps: [
        { do: "Identify the sampled function", result: "$f(t)=t^2+3t$", why: "this is the factor next to the delta" },
        { do: "Identify the delta location", result: "$a=2$", why: "$\\delta(t-2)$ is centered at $2$" },
        { do: "Apply the sifting property", result: "$\\int f(t)\\delta(t-2)\\,dt=f(2)$", why: "delta samples at its center" },
        { do: "Evaluate $f(2)$", result: "$2^2+3\\cdot2=4+6$", why: "substitute $t=2$" },
        { do: "Simplify", result: "$10$", why: "add the terms" }
      ],
      verify: "A narrow unit-area pulse around $2$ would average values near $10$, so the ideal limit gives exactly $10$.",
      answer: "The integral equals $10$.",
      connects: "The delta turns integration into sampling, which is why it models impulses and point sources."
    },
    practice: [
      { problem: "Evaluate $\\int_{-\\infty}^{\\infty}\\cos t\\,\\delta(t-\\pi)\\,dt$.", steps: [
        { do: "Identify the function", result: "$f(t)=\\cos t$", why: "the smooth factor is being sampled" },
        { do: "Identify the location", result: "$a=\\pi$", why: "$\\delta(t-\\pi)$ is centered at $\\pi$" },
        { do: "Apply sifting", result: "$f(\\pi)$", why: "delta extracts the value at its center" },
        { do: "Evaluate cosine", result: "$\\cos\\pi=-1$", why: "unit-circle value" },
        { do: "State the integral", result: "$-1$", why: "the integral equals the sampled value" }
      ], answer: "$-1$." },
      { problem: "Compute $\\int_{-\\infty}^{\\infty}5\\delta(t+3)\\,dt$.", steps: [
        { do: "Rewrite the center", result: "$\\delta(t+3)=\\delta(t-(-3))$", why: "the impulse is located at $-3$" },
        { do: "Use total mass", result: "$\\int\\delta(t+3)\\,dt=1$", why: "every shifted delta has unit mass" },
        { do: "Pull out the constant", result: "$5\\int\\delta(t+3)\\,dt$", why: "linearity of integration" },
        { do: "Substitute the mass", result: "$5\\cdot1$", why: "unit impulse area" },
        { do: "Simplify", result: "$5$", why: "multiply" }
      ], answer: "$5$." },
      { problem: "Evaluate $\\int_{0}^{\\infty}e^{-t}\\delta(t-4)\\,dt$.", steps: [
        { do: "Check the delta location", result: "$4$", why: "the impulse is at $t=4$" },
        { do: "Check the integration interval", result: "$4\\in[0,\\infty)$", why: "the impulse lies inside the interval" },
        { do: "Apply sifting on the interval", result: "$e^{-4}$", why: "the point inside the interval contributes" },
        { do: "Approximate if desired", result: "$e^{-4}\\approx0.0183$", why: "numerical sense check" },
        { do: "State the exact value", result: "$e^{-4}$", why: "the delta samples the exponential" }
      ], answer: "$e^{-4}$." },
      { problem: "Use scaling to simplify $\\delta(3t)$.", steps: [
        { do: "Recall the scaling rule", result: "$\\delta(at)=\\frac1{|a|}\\delta(t)$", why: "area must remain one after horizontal scaling" },
        { do: "Identify $a$", result: "$a=3$", why: "the argument is $3t$" },
        { do: "Substitute into the rule", result: "$\\delta(3t)=\\frac1{|3|}\\delta(t)$", why: "apply scaling" },
        { do: "Simplify the absolute value", result: "$\\frac13\\delta(t)$", why: "$|3|=3$" },
        { do: "Check area", result: "area remains $1$", why: "the factor compensates for compression" }
      ], answer: "$\\delta(3t)=\\frac13\\delta(t)$." },
      { problem: "Show that $(f*\\delta)(t)=f(t)$ using the convolution definition.", steps: [
        { do: "Write the convolution", result: "$(f*\\delta)(t)=\\int_{-\\infty}^{\\infty}f(\\tau)\\delta(t-\\tau)\\,d\\tau$", why: "use $g(t-\\tau)=\\delta(t-\\tau)$" },
        { do: "Rewrite the delta", result: "$\\delta(t-\\tau)=\\delta(\\tau-t)$", why: "delta is even in its argument" },
        { do: "Identify the sampled variable", result: "$\\tau=t$", why: "$\\delta(\\tau-t)$ is centered at $\\tau=t$" },
        { do: "Apply sifting", result: "$f(t)$", why: "the integral samples $f(\\tau)$ at $\\tau=t$" },
        { do: "Interpret", result: "delta is the identity for convolution", why: "an impulse response with only an immediate spike changes nothing" }
      ], answer: "$(f*\\delta)(t)=f(t)$." }
    ],
    applications: [
      { title: "Impulse response", background: "Linear systems are often understood by how they respond to a unit impulse.", numbers: "If input $\\delta(t)$ produces output $h(t)$, then input $3\\delta(t-2)$ produces $3h(t-2)$." },
      { title: "Sampling", background: "Ideal sampling multiplies a signal by impulses at sample times, storing exact values in theory.", numbers: "$\\int f(t)\\delta(t-0.01)\\,dt=f(0.01)$, one sample at $10$ ms." },
      { title: "Point masses in probability", background: "A discrete probability at one value can be represented with a delta in continuous notation.", numbers: "A variable equal to $5$ with probability $1$ has expectation $\\int x\\delta(x-5)\\,dx=5$." },
      { title: "Green's functions", background: "Differential equations use deltas as point sources; the response to a point source builds responses to general sources.", numbers: "A source $2\\delta(x-3)$ has total strength $\\int2\\delta(x-3)\\,dx=2$." },
      { title: "Computer graphics lights", background: "An ideal point light is modeled as energy concentrated at a location, conceptually like a spatial delta.", numbers: "A point contribution $10\\delta(x-x_0)$ has total intensity $10$." },
      { title: "Neural spike trains", background: "Spike times are often represented as sums of impulses so timing is exact before smoothing.", numbers: "Spikes at $1.2$ ms and $3.7$ ms can be written $\\delta(t-1.2)+\\delta(t-3.7)$." }
    ],
    applicationsClose: "The delta is the ideal point event: zero width, unit mass, and exact sampling when placed under an integral.",
    takeaways: [
      "$\\delta(t-a)$ is defined by $\\int f(t)\\delta(t-a)\\,dt=f(a)$.",
      "The delta is a distribution, not an ordinary function with finite point values.",
      "It can be viewed as the limit of unit-area pulses that become narrower and taller.",
      "Convolution with $\\delta$ leaves a signal unchanged."
    ]
  },

  "math-06-10": {
    id: "math-06-10",
    title: "Distributions",
    tagline: "Distributions extend functions by defining how objects act under integrals against smooth tests.",
    connections: {
      buildsOn: ["The Dirac delta", "Fourier transform", "integration by parts"],
      leadsTo: ["weak derivatives", "Green's functions", "generalized Fourier transforms"],
      usedWith: ["test functions", "linear functionals", "differential equations", "limits"]
    },
    motivation:
      "<p>The Dirac delta already taught us a useful lesson: some mathematical objects are too sharp to be ordinary functions, but still make perfect sense inside integrals.</p>" +
      "<p><b>Distributions</b> make that lesson systematic. Instead of asking for a point value, we ask how the object acts on every smooth test function. This lets derivatives of jumps, impulses, and point sources enter calculus without breaking it.</p>",
    definition:
      "<p>A distribution $T$ is a linear rule that takes a smooth, compactly supported test function $\\varphi$ and returns a number, written $\\langle T,\\varphi\\rangle$. An ordinary integrable function $f$ defines a distribution by $$\\langle T_f,\\varphi\\rangle=\\int_{-\\infty}^{\\infty}f(t)\\varphi(t)\\,dt.$$ The delta distribution is $\\langle\\delta_a,\\varphi\\rangle=\\varphi(a)$.</p>" +
      "<p>The distributional derivative is defined by moving the derivative onto the test function: $$\\langle T',\\varphi\\rangle=-\\langle T,\\varphi'\\rangle.$$ This comes from integration by parts for ordinary functions, where the boundary term vanishes because test functions have compact support.</p>" +
      "<p><b>Assumptions that matter:</b> distributions are compared by how they act on all test functions; derivatives are defined weakly through integration by parts; ordinary functions that differ only on a negligible set define the same distribution; and Fourier transforms extend to distributions such as constants and deltas.</p>",
    worked: {
      problem: "Show that the distributional derivative of the Heaviside step $H(t)$ is $\\delta(t)$, where $H(t)=0$ for $t<0$ and $H(t)=1$ for $t>0$.",
      skills: ["distributional derivative", "test functions", "integration by parts"],
      strategy: "Use the definition of weak derivative and let the test function carry the derivative.",
      steps: [
        { do: "Write the derivative action", result: "$\\langle H',\\varphi\\rangle=-\\langle H,\\varphi'\\rangle$", why: "definition of distributional derivative" },
        { do: "Replace $H$ by its support", result: "$-\\int_0^{\\infty}\\varphi'(t)\\,dt$", why: "$H(t)=1$ for positive $t$ and $0$ for negative $t$" },
        { do: "Integrate $\\varphi'$", result: "$-[\\varphi(\\infty)-\\varphi(0)]$", why: "fundamental theorem of calculus" },
        { do: "Use compact support", result: "$-[0-\\varphi(0)]$", why: "test functions vanish at infinity" },
        { do: "Simplify", result: "$\\varphi(0)$", why: "negating gives the value at zero" }
      ],
      verify: "$\\langle\\delta,\\varphi\\rangle=\\varphi(0)$, exactly the action we obtained for $H'$.",
      answer: "In the distributional sense, $H'=\\delta$.",
      connects: "Distributions let a jump have a derivative: the derivative is an impulse at the jump."
    },
    practice: [
      { problem: "For the ordinary function $f(t)=2$ on $[0,1]$ and $0$ elsewhere, compute $\\langle T_f,\\varphi\\rangle$ if $\\varphi(t)=t+1$ on $[0,1]$.", steps: [
        { do: "Write the distribution action", result: "$\\langle T_f,\\varphi\\rangle=\\int_{-\\infty}^{\\infty}f(t)\\varphi(t)\\,dt$", why: "ordinary functions define distributions by integration" },
        { do: "Use the support of $f$", result: "$\\int_0^1 2(t+1)\\,dt$", why: "$f$ is zero outside $[0,1]$" },
        { do: "Distribute the factor", result: "$\\int_0^1(2t+2)\\,dt$", why: "simplify the integrand" },
        { do: "Integrate", result: "$[t^2+2t]_0^1$", why: "antiderivative of $2t+2$" },
        { do: "Evaluate endpoints", result: "$1+2=3$", why: "the lower endpoint gives zero" }
      ], answer: "$\\langle T_f,\\varphi\\rangle=3$." },
      { problem: "Compute $\\langle\\delta_2,\\varphi\\rangle$ for $\\varphi(t)=t^2-1$.", steps: [
        { do: "Recall delta action", result: "$\\langle\\delta_a,\\varphi\\rangle=\\varphi(a)$", why: "delta samples the test function" },
        { do: "Identify the point", result: "$a=2$", why: "the delta is centered at $2$" },
        { do: "Evaluate the test function", result: "$\\varphi(2)=2^2-1$", why: "substitute $2$" },
        { do: "Simplify", result: "$3$", why: "$4-1=3$" },
        { do: "State the action", result: "$\\langle\\delta_2,\\varphi\\rangle=3$", why: "the distribution returns that sample" }
      ], answer: "$3$." },
      { problem: "Compute $\\langle\\delta'_0,\\varphi\\rangle$ for $\\varphi(t)=e^t$.", steps: [
        { do: "Use distributional derivative", result: "$\\langle\\delta'_0,\\varphi\\rangle=-\\langle\\delta_0,\\varphi'\\rangle$", why: "move the derivative to the test function with a minus sign" },
        { do: "Differentiate the test function", result: "$\\varphi'(t)=e^t$", why: "derivative of $e^t$ is itself" },
        { do: "Apply delta sampling", result: "$\\langle\\delta_0,\\varphi'\\rangle=\\varphi'(0)$", why: "delta samples at zero" },
        { do: "Evaluate the derivative", result: "$\\varphi'(0)=1$", why: "$e^0=1$" },
        { do: "Apply the minus sign", result: "$-1$", why: "derivative of a distribution includes the negative sign" }
      ], answer: "$\\langle\\delta'_0,\\varphi\\rangle=-1$." },
      { problem: "A step jumps from $2$ to $7$ at $t=0$. What is its distributional derivative?", steps: [
        { do: "Compute the jump size", result: "$7-2=5$", why: "impulse strength equals right value minus left value" },
        { do: "Recall the Heaviside derivative", result: "$H'=\\delta$", why: "a unit jump produces a unit impulse" },
        { do: "Scale by the jump", result: "$5\\delta(t)$", why: "a jump five times as large gives five times the impulse" },
        { do: "Note constant parts", result: "derivative of the baseline is $0$", why: "constant regions have zero ordinary derivative" },
        { do: "State the result", result: "$5\\delta(t)$", why: "only the jump contributes" }
      ], answer: "The distributional derivative is $5\\delta(t)$." },
      { problem: "Using $\\widehat{1}=2\\pi\\delta(\\omega)$ under this convention, what is the transform of the constant function $4$?", steps: [
        { do: "Use linearity", result: "$\\widehat{4}=4\\widehat{1}$", why: "constants scale distributions" },
        { do: "Substitute the known transform", result: "$4\\cdot2\\pi\\delta(\\omega)$", why: "use $\\widehat{1}=2\\pi\\delta(\\omega)$" },
        { do: "Multiply constants", result: "$8\\pi\\delta(\\omega)$", why: "$4\\cdot2\\pi=8\\pi$" },
        { do: "Interpret frequency", result: "all mass is at $\\omega=0$", why: "a constant has only zero-frequency content" },
        { do: "State the transform", result: "$8\\pi\\delta(\\omega)$", why: "distribution notation captures the nonintegrable constant" }
      ], answer: "$\\widehat{4}=8\\pi\\delta(\\omega)$." }
    ],
    applications: [
      { title: "Weak derivatives in PDEs", background: "Solutions with corners or jumps may not have classical derivatives everywhere, but weak derivatives still let equations make sense.", numbers: "A jump from $0$ to $3$ contributes $3\\delta$ to the weak derivative." },
      { title: "Point sources", background: "Heat, wave, and Poisson equations often model concentrated sources with deltas.", numbers: "A source $10\\delta(x-2)$ has total strength $10$ because $\\int10\\delta(x-2)\\,dx=10$." },
      { title: "Fourier transform of constants", background: "A constant signal is not integrable over the whole line, but as a distribution it has only zero frequency.", numbers: "Under this convention, $\\widehat{1}=2\\pi\\delta(\\omega)$ and $\\widehat{5}=10\\pi\\delta(\\omega)$." },
      { title: "Edge detection", background: "An image edge is like a jump; differentiating turns it into a concentrated response at the boundary.", numbers: "A pixel row changing from $20$ to $80$ has jump size $60$, so an ideal derivative places strength $60$ at the edge." },
      { title: "Impulse trains", background: "Sampling theory represents repeated samples as a train of delta distributions.", numbers: "Sampling every $0.01$ seconds uses impulses at $t=n\\cdot0.01$, giving $100$ impulses per second." },
      { title: "Optimization with nonsmooth losses", background: "Subgradients and weak derivatives extend derivative thinking to functions with corners.", numbers: "For $|x|$, the ordinary derivative is $-1$ left and $1$ right; the corner needs generalized derivative language." }
    ],
    applicationsClose: "Distributions keep calculus alive at sharp objects: jumps, impulses, constants over infinite domains, and point sources all become legitimate actors.",
    takeaways: [
      "A distribution is defined by its action on smooth test functions.",
      "Ordinary functions define distributions by integration against tests.",
      "Distributional derivatives move the derivative onto the test function with a minus sign.",
      "The delta, weak derivatives, and Fourier transforms of nonintegrable signals all live naturally in distribution language."
    ]
  }
};
