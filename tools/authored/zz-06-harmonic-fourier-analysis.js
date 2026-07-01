module.exports = {
  "math-06-01": {
    connectionsProse: "<p>Periodic functions are the simplest setting where repetition becomes a mathematical structure. The reader already knows functions, graphs, and basic trigonometry, so the new point is not a new kind of formula but a rule about copying values. Once one repeat block is known, the rest of the signal is determined by shifting that block forward or backward. This makes periodicity the natural starting point for Fourier analysis, where repeated signals are described by repeated waves.</p>",
    motivation: "<p>A periodic function repeats after a fixed positive step. This means the function does not need to be understood separately at every time. If $T$ is a period, then the value at $t+T$ is the same as the value at $t$, and applying the same rule again gives the value at $t+2T$, $t+3T$, and all integer shifts.</p>" +
                "<p>Sinusoids give the basic examples because they repeat after a full turn around the circle. The angular frequency $\\omega$ tells how fast the angle advances, so a larger $|\\omega|$ completes the same $2\\pi$ turn in less time. This link between period and angular frequency is the first bridge from repeating graphs to frequency coordinates.</p>",
    definition: "<p>A function is periodic when a positive shift $T$ copies all of its values, so repeated shifts by integer multiples of $T$ also preserve the function.</p>" +
                "<p>$$f(t+T)=f(t),\\qquad f(t+nT)=f(t),\\qquad T_{\\sin(\\omega t)}=2\\pi/|\\omega|.$$</p>" +
                "<p><b>Assumptions that matter:</b> $T>0$ is a period, $n$ is an integer, and for the sinusoid formula $\\omega\\ne0$.</p>",
    symbols: [
      { sym: "$T$", desc: "period" },
      { sym: "fundamental period", desc: "smallest positive period" },
      { sym: "$\\omega$", desc: "angular frequency" },
      { sym: "$n$", desc: "integer repeat count" }
    ],
    derivation: [
      { do: "Start with the definition of a period.", result: "$f(t+T)=f(t)$ for all $t$", why: "$T$ is a period." },
      { do: "Replace $t$ by $t+T$.", result: "$f(t+2T)=f(t+T)$", why: "The identity holds everywhere." },
      { do: "Use the original period identity again.", result: "$f(t+2T)=f(t)$", why: "$f(t+T)=f(t)$." },
      { do: "Repeat the same argument.", result: "$f(t+nT)=f(t)$ for every integer $n$", why: "Each additional shift by $T$ copies the same value." },
      { do: "Apply one full turn to a sinusoid.", result: "$\\omega(t+T)=\\omega t+2\\pi$", why: "Sine repeats after one full turn." },
      { do: "Subtract $\\omega t$ and divide by $|\\omega|$.", result: "$T=2\\pi/|\\omega|$", why: "The period is positive even when $\\omega$ is negative." }
    ],
    applications: [
      { title: "Calendar feature", background: "Encode a day of year as a circular angle.", numbers: "Day $91$ gives $\\theta=2\\pi(91)/365\\approx1.566$, so $(\\sin\\theta,\\cos\\theta)\\approx(1.000,0.004)$." },
      { title: "Audio", background: "A pitch frequency determines its repeating period.", numbers: "$440$ Hz has period $1/440\\approx0.00227$ s." },
      { title: "Daily traffic", background: "A daily cycle can be written as an angular frequency per hour.", numbers: "$\\omega=2\\pi/24=\\pi/12$ rad/hour." },
      { title: "Fan", background: "Rotations per minute convert to cycles per second and period.", numbers: "A fan at $1800$ rpm is $30$ Hz, period $0.0333$ s." },
      { title: "Positional channel", background: "Sinusoidal position features repeat when the phase advances by $2\\pi$.", numbers: "$\\sin(p\\pi/2)$ repeats every $4$ positions." },
      { title: "Circular buffer", background: "Periodic indexing wraps by modular arithmetic.", numbers: "A circular buffer of length $8$: index $19$ maps to $19\\bmod8=3$." }
    ]
  },
  "math-06-02": {
    connectionsProse: "<p>Orthogonality extends the familiar idea of perpendicular vectors to functions. Instead of taking a finite dot product, the overlap of two waves is measured by integrating their product over a full period. This lesson depends on periodic functions and trigonometric identities, and it prepares the coefficient formulas for Fourier series. The main payoff is that different frequencies can be separated cleanly.</p>",
    motivation: "<p>Orthogonality says two waves have zero net overlap over a full common period. When one wave is multiplied by a different-frequency wave, the product has positive regions and negative regions. Over a complete interval, those regions balance out, so the integral is zero.</p>" +
                "<p>This cancellation is what lets Fourier methods behave like coordinate geometry. A signal may contain many waves at once, but projecting onto one sinusoid isolates only the matching frequency. The same idea later appears in DFT matrices, communication carriers, feature decorrelation, and spectral layers.</p>",
    definition: "<p>Sinusoids of different positive integer frequencies are orthogonal over $[-\\pi,\\pi]$ under the integral inner product.</p>" +
                "<p>$$\\langle f,g\\rangle=\\int_{-\\pi}^{\\pi}f(t)g(t)\\,dt,\\qquad \\int_{-\\pi}^{\\pi}\\sin(mt)\\sin(nt)\\,dt=0\\quad(m\\ne n).$$</p>" +
                "<p><b>Assumptions that matter:</b> $m$ and $n$ are positive integers, and the integration interval is a full common period.</p>",
    symbols: [
      { sym: "$m,n$", desc: "integer frequencies" },
      { sym: "$\\langle f,g\\rangle$", desc: "integral inner product" },
      { sym: "$\\pi$", desc: "the squared norm of each nonzero sine/cosine on this interval" }
    ],
    derivation: [
      { do: "Define the inner product over one period.", result: "$\\langle f,g\\rangle=\\int_{-\\pi}^{\\pi}f(t)g(t)\\,dt$", why: "Functions are treated like vectors over a period." },
      { do: "Use the product-to-sum identity.", result: "$\\sin(mt)\\sin(nt)=\\tfrac12[\\cos((m-n)t)-\\cos((m+n)t)]$", why: "It turns the product into integrable waves." },
      { do: "Integrate a nonzero integer cosine.", result: "$\\int_{-\\pi}^{\\pi}\\cos(kt)\\,dt=\\sin(kt)/k|_{-\\pi}^{\\pi}$", why: "$k$ is a nonzero integer." },
      { do: "Evaluate the endpoints.", result: "$\\sin(k\\pi)=\\sin(-k\\pi)=0$", why: "Each nonzero integer cosine integral is $0$." },
      { do: "Apply this to the two cosine terms.", result: "both terms vanish", why: "$m-n\\ne0$ and $m+n\\ne0$." },
      { do: "Combine the vanished terms.", result: "$\\int_{-\\pi}^{\\pi}\\sin(mt)\\sin(nt)\\,dt=0$", why: "The net overlap is zero." },
      { do: "Handle the matching-frequency case.", result: "$\\int_{-\\pi}^{\\pi}\\sin^2(nt)\\,dt=\\pi$", why: "$\\sin^2(nt)=\\tfrac12(1-\\cos(2nt))$." }
    ],
    applications: [
      { title: "Coefficient extraction", background: "Projecting onto the matching cosine isolates its coefficient.", numbers: "If $f=7\\cos3t+2\\sin t$, then $\\pi^{-1}\\int f\\cos3t=7$." },
      { title: "Audio carriers", background: "Whole numbers of cycles over the window cancel cross-overlap ideally.", numbers: "$1000$ Hz and $2000$ Hz over $0.01$ s complete $10$ and $20$ cycles, so ideal overlap is $0$." },
      { title: "Projection", background: "A coordinate equals inner product divided by basis norm squared.", numbers: "An inner product $4\\pi$ on a basis with norm squared $\\pi$ gives coefficient $4$." },
      { title: "DCT block", background: "A constant block has zero overlap with an alternating zero-sum row.", numbers: "All-ones data dotted with an alternating row summing to $0$ gives coefficient $0$." },
      { title: "Communications", background: "Different integer carriers over one second separate by orthogonality.", numbers: "$\\int_0^1\\sin(2\\pi3t)\\sin(2\\pi5t)dt=0$." },
      { title: "Feature decorrelation", background: "Zero dot product means zero cosine similarity.", numbers: "Vectors with dot $0$ and norms $2,3$ have cosine similarity $0/(2\\cdot3)=0$." }
    ]
  },
  "math-06-03": {
    connectionsProse: "<p>Fourier series combine periodicity with orthogonality. A repeating signal is treated like a vector, and the sine and cosine waves provide the coordinate directions. The reader has already seen that different sinusoid frequencies do not overlap over a full period. This lesson uses that fact to compute the actual coordinates of a periodic function.</p>",
    motivation: "<p>A Fourier series writes a periodic shape as an average level plus sine and cosine coordinates. The average level records the baseline, while the cosine and sine terms record how much of each harmonic appears. Low harmonics describe broad variation, and higher harmonics describe faster detail.</p>" +
                "<p>Orthogonality makes the coordinates measurable one at a time. Multiplying the whole signal by a chosen cosine and integrating cancels all nonmatching sine and cosine terms. Only the matching cosine term remains, so division by its norm gives the coefficient.</p>",
    definition: "<p>A real Fourier series represents a periodic function as an average level plus sine and cosine harmonics, with coefficients found by projection.</p>" +
                "<p>$$f(t)\\sim a_0/2+\\sum_{n\\ge1}(a_n\\cos nt+b_n\\sin nt),\\qquad a_k=\\pi^{-1}\\int_{-\\pi}^{\\pi}f(t)\\cos(kt)dt.$$</p>" +
                "<p><b>Assumptions that matter:</b> The function is considered over $[-\\pi,\\pi]$ as a periodic signal, and the basis sinusoids use integer harmonics.</p>",
    symbols: [
      { sym: "$a_0/2$", desc: "average level" },
      { sym: "$a_n$", desc: "cosine coefficient" },
      { sym: "$b_n$", desc: "sine coefficient" },
      { sym: "$n,k$", desc: "harmonic numbers" }
    ],
    derivation: [
      { do: "Start with the real series form.", result: "$f(t)\\sim a_0/2+\\sum_{n\\ge1}(a_n\\cos nt+b_n\\sin nt)$", why: "This is the real sine-cosine expansion." },
      { do: "Multiply both sides by $\\cos(kt)$.", result: "$f(t)\\cos(kt)$ is projected onto the $k$th cosine", why: "Projection onto the $k$th cosine should isolate $a_k$." },
      { do: "Integrate over $[-\\pi,\\pi]$.", result: "$\\int_{-\\pi}^{\\pi}f(t)\\cos(kt)dt$", why: "This uses the sinusoid inner product." },
      { do: "Check the constant term.", result: "$\\int_{-\\pi}^{\\pi}(a_0/2)\\cos(kt)dt=0$", why: "Nonzero cosine has zero full-period average." },
      { do: "Check sine-cosine terms.", result: "every $\\sin(nt)\\cos(kt)$ term integrates to $0$", why: "Sine-cosine orthogonality cancels them." },
      { do: "Check nonmatching cosine terms.", result: "every $a_n\\cos(nt)\\cos(kt)$ term with $n\\ne k$ integrates to $0$", why: "Different cosine frequencies are orthogonal." },
      { do: "Keep the matching cosine term.", result: "$a_k\\int_{-\\pi}^{\\pi}\\cos^2(kt)dt=a_k\\pi$", why: "Only the $n=k$ term remains." },
      { do: "Divide by the norm squared.", result: "$a_k=\\pi^{-1}\\int_{-\\pi}^{\\pi}f(t)\\cos(kt)dt$", why: "The cosine norm squared is $\\pi$." },
      { do: "Repeat with the other basis functions.", result: "$b_k=\\pi^{-1}\\int f(t)\\sin(kt)dt$ and $a_0=\\pi^{-1}\\int f$", why: "The same projection idea applies to sine and the constant basis." }
    ],
    applications: [
      { title: "Audio timbre", background: "A sound can contain a fundamental and harmonics.", numbers: "$\\sin(2\\pi440t)+0.5\\sin(2\\pi880t)$ has harmonics $440$ and $880$ Hz." },
      { title: "Square wave", background: "Odd sine harmonics describe a square wave's leading coefficients.", numbers: "$4/\\pi\\approx1.273$ and $4/(3\\pi)\\approx0.424$ for first and third sine terms." },
      { title: "Seasonal model", background: "A cosine term can represent annual temperature swing around a baseline.", numbers: "$20+8\\cos(2\\pi d/365)$ predicts $28$ at $d=0$ and $12$ half a year later." },
      { title: "Compression", background: "Energy concentration shows whether small coefficients can be dropped.", numbers: "Coefficients $80$ and $5$ give retained energy $80^2/(80^2+5^2)\\approx0.996$." },
      { title: "Vibration", background: "Harmonic amplitudes quantify higher-frequency vibration content.", numbers: "$4\\cos30t+1\\cos90t$ has third-harmonic amplitude ratio $1/4=0.25$." },
      { title: "Fourier feature", background: "Sinusoidal features encode scalar positions periodically.", numbers: "$x=0.25$ gives $[\\sin2\\pi x,\\cos2\\pi x]=[1,0]$." }
    ]
  },
  "math-06-04": {
    connectionsProse: "<p>Fourier coefficients can be computed by projection, but an infinite series also needs a rule for what value it represents. This lesson follows Fourier series and asks how the sum behaves when more and more harmonics are included. Smooth points and jump points have different limiting behavior. The result is important for signal reconstruction, compression, and boundary artifacts.</p>",
    motivation: "<p>Fourier coefficients can be computed for many piecewise-smooth periodic signals, but the infinite sum still needs an interpretation. At a point where the signal is continuous, the partial sums settle toward the signal value. The nearby oscillations balance around the correct height.</p>" +
                "<p>At a jump, the left and right sides ask the series to approach two different values at the same point. The symmetric Fourier partial sums split the difference and converge to the midpoint of the two one-sided limits. This does not remove ringing near the jump, but it gives the correct value of the limiting series at the discontinuity itself.</p>",
    definition: "<p>For a piecewise smooth periodic function, the Fourier-series sum equals the function at continuous points and equals the midpoint of the one-sided limits at jump discontinuities.</p>" +
                "<p>$$S(t)=\\frac{f(t^-)+f(t^+)}{2}.$$</p>" +
                "<p><b>Assumptions that matter:</b> The theorem is stated for piecewise smooth signals with finitely many well-behaved pieces; a full proof uses kernels and bounded variation.</p>",
    symbols: [
      { sym: "$f(t^-),f(t^+)$", desc: "one-sided limits" },
      { sym: "$S(t)$", desc: "Fourier-series sum" },
      { sym: "piecewise smooth", desc: "finitely many well-behaved pieces" }
    ],
    applications: [
      { title: "Jump", background: "At a discontinuity, the Fourier sum takes the midpoint of one-sided limits.", numbers: "from $-1$ to $3$ gives midpoint $1$." },
      { title: "Continuous point", background: "At a continuous point, the Fourier sum returns the function value.", numbers: "with $f(1)=4$ converges to $4$." },
      { title: "Square wave", background: "A symmetric jump in a square wave averages to the center value.", numbers: "jumps from $-1$ to $1$ at $0$, so value is $0$." },
      { title: "Gibbs overshoot", background: "Ringing near a jump has a characteristic overshoot.", numbers: "from $0$ to about $1.09$ is $9\\%$ of a unit jump." },
      { title: "Resolution", background: "More harmonics resolve narrower angular features.", numbers: "Keeping $50$ harmonics resolves features roughly wider than $2\\pi/50\\approx0.126$ radians." },
      { title: "Label jump", background: "A binary boundary has midpoint value in the limiting Fourier series.", numbers: "$0$ to $1$ has Fourier boundary value $0.5$." }
    ]
  },
  "math-06-05": {
    connectionsProse: "<p>Complex Fourier coefficients repackage the sine and cosine series into a more compact basis. The reader already knows real Fourier coefficients and the complex exponential identity behind rotating waves. This lesson shows how one coefficient per integer frequency can carry both amplitude and phase. That form is the natural language for the Fourier transform, DFT, and spectral multiplication.</p>",
    motivation: "<p>Complex exponentials package sine and cosine as one rotating coordinate per integer frequency. A positive frequency rotates one direction, and a negative frequency rotates the opposite direction. For real signals, those paired rotations combine to make real sine and cosine motion.</p>" +
                "<p>The coefficient $c_k$ is found by the same projection idea as before. Multiplying by $e^{-ikt}$ cancels the $k$th rotation and leaves a constant term, while all other rotations complete full turns and integrate to zero. This keeps the derivation short and makes phase bookkeeping cleaner than separate sine and cosine coefficients.</p>",
    definition: "<p>A complex Fourier series writes a periodic function as a sum of rotating exponentials indexed by all integer frequencies.</p>" +
                "<p>$$f(t)\\sim\\sum_{n=-\\infty}^{\\infty}c_ne^{int},\\qquad c_k=(2\\pi)^{-1}\\int_{-\\pi}^{\\pi}f(t)e^{-ikt}dt.$$</p>" +
                "<p><b>Assumptions that matter:</b> The function is periodic on $[-\\pi,\\pi]$, and the integer-frequency complex exponentials are orthogonal over that interval.</p>",
    symbols: [
      { sym: "$c_k$", desc: "complex coefficient" },
      { sym: "$k,n$", desc: "integer frequencies" },
      { sym: "$e^{int}$", desc: "rotating basis wave" },
      { sym: "overline", desc: "complex conjugate" }
    ],
    derivation: [
      { do: "Write the complex series.", result: "$f(t)\\sim\\sum_{n=-\\infty}^{\\infty}c_ne^{int}$", why: "Complex waves form the basis." },
      { do: "Multiply by $e^{-ikt}$.", result: "$f(t)e^{-ikt}$", why: "This projects onto frequency $k$." },
      { do: "Integrate both sides.", result: "$\\int f(t)e^{-ikt}dt\\sim\\sum_n c_n\\int e^{i(n-k)t}dt$", why: "Projection is measured by the integral inner product." },
      { do: "Evaluate nonmatching rotations.", result: "$\\int_{-\\pi}^{\\pi}e^{i(n-k)t}dt=0$ for $n\\ne k$", why: "Roots complete full turns." },
      { do: "Evaluate the matching rotation.", result: "$\\int_{-\\pi}^{\\pi}1\\,dt=2\\pi$", why: "For $n=k$, the integrand is $1$." },
      { do: "Simplify the right side.", result: "$2\\pi c_k$", why: "Only the matching coefficient remains." },
      { do: "Divide by $2\\pi$.", result: "$c_k=(2\\pi)^{-1}\\int_{-\\pi}^{\\pi}f(t)e^{-ikt}dt$", why: "The matching complex wave has norm squared $2\\pi$." }
    ],
    applications: [
      { title: "Cosine coefficient", background: "A real cosine splits evenly across positive and negative complex frequencies.", numbers: "$3\\cos t$ has $c_1=c_{-1}=1.5$." },
      { title: "Sine coefficient", background: "A real sine appears as imaginary paired complex coefficients.", numbers: "$2\\sin t$ has $c_1=-i,c_{-1}=i$." },
      { title: "Real-to-complex conversion", background: "Real sine and cosine coefficients combine into one complex coefficient.", numbers: "$a_2=6,b_2=-4$ gives $c_2=(6+4i)/2=3+2i$." },
      { title: "Paired amplitude", background: "For real signals, paired complex coefficients double into a real amplitude.", numbers: "If $c_5=3e^{i\\pi/6}$, paired real amplitude is $6$." },
      { title: "Real data symmetry", background: "Real signals have conjugate-symmetric complex coefficients.", numbers: "For real data, $c_7=1-2i$ implies $c_{-7}=1+2i$." },
      { title: "Frequency-domain multiplication", background: "Complex coefficients multiply frequency by frequency.", numbers: "$(3+4i)(1-i)=7+i$ for one frequency-domain multiplication." }
    ]
  },
  "math-06-06": {
    connectionsProse: "<p>Fourier series showed that a periodic signal can be described by sine, cosine, or complex exponential coordinates. That idea is already useful for repeating sound, seasons, and waves, but many important signals do not repeat. A pulse, a word, a sensor spike, an image row, and a probability density are better treated as signals on a line rather than as one cycle of a repeating pattern.</p><p>The Fourier transform keeps the same coordinate idea and removes the fixed period. Instead of asking for the amount of frequency $n$ in one repeating interval, it asks for the amount of every real angular frequency $\\omega$. This lesson is the bridge to transform properties, convolution, filtering, sampling, the DFT, FFT, and the spectral view of CNNs.</p>",
    motivation: "<p>A nonperiodic signal can still contain slow and fast variation. A wide smooth pulse mostly overlaps slow oscillations. A narrow click overlaps many fast oscillations. The Fourier transform measures that overlap by multiplying the signal by a complex wave $e^{-i\\omega t}$ and integrating over all time.</p>" +
                "<p>The result $\\hat f(\\omega)$ is usually complex. Its magnitude tells how strongly frequency $\\omega$ is present, and its phase tells how that frequency is aligned. At $\\omega=0$, the complex wave is just $1$, so the transform records total area. At larger $|\\omega|$, the oscillation alternates positive and negative more quickly, so only matching rapid structure survives the integral.</p>" +
                "<p>This is why the transform is central for machine learning systems that handle audio, images, sensors, and learned operators. It turns local variation in time or space into a frequency description where smoothness, edges, blur, aliasing, and convolution become easier to reason about.</p>",
    definition: "<p>The Fourier transform measures the frequency content of a nonperiodic signal by integrating it against complex waves, with an inverse integral reconstructing the signal under the chosen convention.</p>" +
                "<p>$$\\hat f(\\omega)=\\int_{-\\infty}^{\\infty} f(t)e^{-i\\omega t}\\,dt,\\qquad f(t)=\\frac1{2\\pi}\\int_{-\\infty}^{\\infty}\\hat f(\\omega)e^{i\\omega t}\\,d\\omega .$$</p>" +
                "<p><b>Assumptions that matter:</b> For the example, $f(t)=e^{-at}$ on $t\\ge0$ and $0$ for $t<0$, with $a>0$ so the integral decays.</p>",
    symbols: [
      { sym: "$t$", desc: "the original time or spatial variable" },
      { sym: "$\\omega$", desc: "angular frequency in radians per unit" },
      { sym: "$i^2=-1$", desc: "imaginary unit convention" },
      { sym: "$\\hat f$", desc: "the frequency-domain function" },
      { sym: "$a$", desc: "a positive decay rate" },
      { sym: "$1/(2\\pi)$", desc: "the inverse constant for this convention" }
    ],
    derivation: [
      { do: "Restrict the integral to where the signal is nonzero.", result: "$\\hat f(\\omega)=\\int_0^\\infty e^{-at}e^{-i\\omega t}\\,dt$", why: "The signal is zero for $t<0$." },
      { do: "Combine the exponentials.", result: "$\\hat f(\\omega)=\\int_0^\\infty e^{-(a+i\\omega)t}\\,dt$", why: "Multiplying exponentials adds exponents." },
      { do: "Find an antiderivative.", result: "$-e^{-(a+i\\omega)t}/(a+i\\omega)$", why: "Differentiating it returns the integrand." },
      { do: "Evaluate the upper-limit term.", result: "$0$", why: "$a>0$ gives real exponential decay." },
      { do: "Evaluate the lower-limit term.", result: "$-1/(a+i\\omega)$", why: "$e^0=1$." },
      { do: "Subtract endpoints.", result: "$0-[-1/(a+i\\omega)]=1/(a+i\\omega)$", why: "Definite integrals subtract lower value from upper value." },
      { do: "Check the zero-frequency value.", result: "$\\hat f(0)=1/a$", why: "This matches the area under $e^{-at}$ on $[0,\\infty)$." }
    ],
    applications: [
      { title: "Audio spectrum", background: "A shorter analysis window gives coarser frequency spacing.", numbers: "A $0.01$ s analysis window has rough frequency spacing $1/0.01=100$ Hz." },
      { title: "Image stripes", background: "Repeating spatial patterns have spatial frequencies.", numbers: "A stripe repeating every $8$ pixels has spatial frequency $1/8=0.125$ cycles/pixel." },
      { title: "One-sided exponential", background: "The transform magnitude of a decaying exponential is easy to evaluate.", numbers: "For $e^{-3t}1_{t\\ge0}$, $|\\hat f(4)|=|1/(3+4i)|=1/5=0.2$." },
      { title: "Box pulse", background: "A finite pulse has a sinc-like spectrum.", numbers: "For $1_{|t|\\le1}$, $\\hat f(\\omega)=2\\sin\\omega/\\omega$; at $\\omega=\\pi/2$ this is $4/\\pi\\approx1.273$." },
      { title: "MRI grids", background: "A full frequency grid matches the spatial sample count.", numbers: "A $256\\times256$ scan has $65{,}536$ spatial pixels and the same count of full frequency samples." },
      { title: "ML spectral bias", background: "Energy scales with squared amplitude.", numbers: "Amplitudes $10$ at frequency $1$ and $0.5$ at frequency $20$ have energy ratio $10^2/0.5^2=400$." }
    ]
  },
  "math-06-07": {
    connectionsProse: "<p>After the Fourier transform is defined, the next step is to learn how it responds to common changes in a signal. The reader already knows shifts, scaling, derivatives, and multiplication by oscillations in the time domain. This lesson translates those actions into frequency-domain rules. These rules are used constantly in filtering, PDEs, image registration, modulation, and neural signal pipelines.</p>",
    motivation: "<p>Transform properties say how ordinary actions in time change the spectrum. A time shift does not change which frequencies are present, but it changes their phases because each wave has been delayed. Scaling the time axis stretches or compresses the frequency axis in the opposite direction.</p>" +
                "<p>Derivatives and modulation have equally concrete meanings. Differentiation emphasizes rapid oscillation because high-frequency waves change faster. Multiplying by a carrier wave moves the spectrum to a new center frequency. These identities let one reason about signal operations without recomputing the transform from scratch.</p>",
    definition: "<p>Fourier-transform properties translate common time-domain operations into algebraic frequency-domain changes.</p>" +
                "<p>$$\\mathcal F\\{af+bg\\}=a\\hat f+b\\hat g,\\qquad \\mathcal F\\{f(t-t_0)\\}=e^{-i\\omega t_0}\\hat f(\\omega),\\qquad \\mathcal F\\{f(at)\\}=|a|^{-1}\\hat f(\\omega/a),\\qquad \\mathcal F\\{f'\\}=i\\omega\\hat f(\\omega).$$</p>" +
                "<p><b>Assumptions that matter:</b> The functions are integrable and decaying or well-behaved enough for the transforms, substitutions, and vanishing boundary terms to be valid.</p>",
    symbols: [
      { sym: "$a,b$", desc: "scalar weights" },
      { sym: "$t_0$", desc: "delay" },
      { sym: "$a$ in $f(at)$", desc: "scale factor" },
      { sym: "$\\omega$", desc: "angular frequency" },
      { sym: "boundary term", desc: "endpoint contribution" }
    ],
    derivation: [
      { do: "Insert $af+bg$ into the transform integral.", result: "$a\\hat f+b\\hat g$", why: "Distribute multiplication and split the integral." },
      { do: "For $g(t)=f(t-t_0)$, substitute $u=t-t_0$.", result: "$\\hat g=e^{-i\\omega t_0}\\hat f$", why: "$e^{-i\\omega t}=e^{-i\\omega u}e^{-i\\omega t_0}$." },
      { do: "For $g(t)=f(at)$, set $u=at$ and $dt=du/a$.", result: "$\\hat g(\\omega)=|a|^{-1}\\hat f(\\omega/a)$", why: "Orientation gives the absolute factor $1/|a|$." },
      { do: "Integrate $\\int f'(t)e^{-i\\omega t}dt$ by parts.", result: "$i\\omega\\hat f(\\omega)$", why: "The boundary term vanishes under decay." }
    ],
    applications: [
      { title: "Edge derivative", background: "Differentiation amplifies high angular frequencies more than low ones.", numbers: "at $\\omega=10$ derivative gain is $10$, at $\\omega=1$ gain is $1$." },
      { title: "Audio delay", background: "A delay changes phase by frequency times delay.", numbers: "$5$ ms at $200$ Hz gives phase $-2\\pi(200)(0.005)=-2\\pi$." },
      { title: "Time stretch", background: "Stretching in time compresses frequency and changes amplitude scale.", numbers: "$g(t)=f(t/2)$ gives $\\hat g(\\omega)=2\\hat f(2\\omega)$." },
      { title: "Radio carrier", background: "Multiplication by a complex carrier shifts the spectrum.", numbers: "multiplying by $e^{i1000t}$ shifts $\\hat f(\\omega)$ to $\\hat f(\\omega-1000)$." },
      { title: "PDE", background: "Second derivatives become quadratic frequency multipliers.", numbers: "A second derivative multiplier at $\\omega=3$ is $-9$." },
      { title: "Shifted image", background: "Spatial shifts preserve magnitude while changing DFT phase.", numbers: "Shifting an image by $4$ pixels changes DFT phase by $-2\\pi k4/N$ and preserves $|C_k|$." }
    ]
  },
  "math-06-08": {
    connectionsProse: "<p>Convolution is one of the main operations that Fourier analysis makes simpler. The reader has already seen the Fourier transform and its basic properties. This lesson connects a sliding operation in time or space with multiplication in frequency. The theorem explains why filters, blur kernels, reverb, probability sums, and CNN kernels all have spectral descriptions.</p>",
    motivation: "<p>Convolution is a sliding weighted sum in time or space. One function supplies the weights, and the other supplies the signal being shifted under those weights. In direct form, this can be computationally and conceptually heavy because every output location depends on a neighborhood or even the whole input.</p>" +
                "<p>The Fourier transform turns that sliding operation into ordinary multiplication frequency by frequency. Each complex wave is an eigenfunction of convolution: filtering a pure frequency only changes its amplitude and phase. This is why frequency responses are enough to describe linear time-invariant filters.</p>",
    definition: "<p>The convolution theorem says that convolution in time or space becomes multiplication in the Fourier domain.</p>" +
                "<p>$$(f*g)(t)=\\int f(\\tau)g(t-\\tau)d\\tau,\\qquad \\widehat{f*g}(\\omega)=\\hat f(\\omega)\\hat g(\\omega).$$</p>" +
                "<p><b>Assumptions that matter:</b> The functions are integrable enough to swap integrals and apply the Fourier transform.</p>",
    symbols: [
      { sym: "$*$", desc: "convolution" },
      { sym: "$\\tau$", desc: "sliding variable" },
      { sym: "$u$", desc: "shifted variable" },
      { sym: "$\\hat f,\\hat g$", desc: "frequency responses" }
    ],
    derivation: [
      { do: "Start with the convolution definition.", result: "$(f*g)(t)=\\int f(\\tau)g(t-\\tau)d\\tau$", why: "Convolution sums shifted copies." },
      { do: "Transform the convolution.", result: "$\\widehat{f*g}(\\omega)=\\int[\\int f(\\tau)g(t-\\tau)d\\tau]e^{-i\\omega t}dt$", why: "Apply the Fourier transform definition." },
      { do: "Swap the order of integration.", result: "the $\\tau$ integral moves outside the $t$ integral", why: "The functions are integrable enough." },
      { do: "Factor $f(\\tau)$ outside the inner integral.", result: "$f(\\tau)\\int g(t-\\tau)e^{-i\\omega t}dt$", why: "$f(\\tau)$ does not depend on $t$." },
      { do: "Substitute $u=t-\\tau$.", result: "$t=u+\\tau$ and $dt=du$", why: "This centers the shifted copy of $g$." },
      { do: "Split the exponential.", result: "$e^{-i\\omega(u+\\tau)}=e^{-i\\omega u}e^{-i\\omega\\tau}$", why: "Exponential factors separate sums in the exponent." },
      { do: "Recognize the inner integral.", result: "$\\int g(u)e^{-i\\omega u}du=\\hat g(\\omega)$", why: "This is the Fourier transform of $g$." },
      { do: "Finish the outer integral.", result: "$\\hat g(\\omega)\\int f(\\tau)e^{-i\\omega\\tau}d\\tau=\\hat f(\\omega)\\hat g(\\omega)$", why: "The remaining integral is $\\hat f(\\omega)$." }
    ],
    applications: [
      { title: "Blur", background: "A moving average kernel smooths neighboring values.", numbers: "$[30,60,90]$ averaged by $[1/3,1/3,1/3]$ gives $60$." },
      { title: "CNN edge", background: "A small difference kernel detects local change.", numbers: "kernel $[-1,0,1]$ on $[2,5,9]$ gives $7$." },
      { title: "Polynomial product", background: "Convolution multiplies polynomial coefficient lists.", numbers: "$[1,2]*[3,4]=[3,10,8]$." },
      { title: "Dice sum", background: "The sum distribution of dice is a convolution of two uniform lists.", numbers: "$6$ ways out of $36$ sum to $7$, probability $1/6$." },
      { title: "Reverb", background: "An impulse response spreads a pulse over time.", numbers: "impulse response $[1,0.5]$ and pulse $[2]$ give $[2,1]$." },
      { title: "Low-pass", background: "Frequency response gains reduce high-frequency amplitudes.", numbers: "gains $H(2)=0.9,H(20)=0.1$ turn amplitudes $10,4$ into $9,0.4$." }
    ]
  },
  "math-06-09": {
    connectionsProse: "<p>The Dirac delta enters Fourier analysis as the ideal version of a point impulse. The reader already knows ordinary functions and integrals, but the delta is better understood by how it acts inside an integral. This lesson prepares the language for sampling, impulse responses, distributions, and point sources. It also clarifies why idealized spikes can be useful without being ordinary finite-valued functions.</p>",
    motivation: "<p>The Dirac delta is an ideal unit impulse. It concentrates one unit of total mass at a single point, so it cannot be treated as an ordinary function with a normal pointwise height. Its defining behavior is that it samples another function inside an integral.</p>" +
                "<p>A narrow rectangle with area $1$ gives the right intuition. As the rectangle gets narrower, its height grows so that the area stays fixed. Integrating a continuous function against that rectangle gives a local average, and in the limit that average becomes the function value at the center.</p>",
    definition: "<p>The Dirac delta $\\delta(t-a)$ is an ideal unit impulse at $a$ defined by its sifting action on continuous test functions.</p>" +
                "<p>$$\\int f(t)\\delta(t-a)dt=f(a).$$</p>" +
                "<p><b>Assumptions that matter:</b> The test function $f$ is continuous at $a$, and the delta is understood as a limiting or distributional object rather than an ordinary finite-valued function.</p>",
    symbols: [
      { sym: "$\\delta(t-a)$", desc: "impulse at $a$" },
      { sym: "$\\varepsilon$", desc: "pulse width" },
      { sym: "$f$", desc: "test function" },
      { sym: "unit mass", desc: "integral $1$" }
    ],
    derivation: [
      { do: "Define a narrow unit-area pulse.", result: "$p_\\varepsilon(t-a)=1/\\varepsilon$ on $[a-\\varepsilon/2,a+\\varepsilon/2]$ and $0$ elsewhere", why: "The area is $1$." },
      { do: "Integrate a test function against the pulse.", result: "$\\int f(t)p_\\varepsilon(t-a)dt=(1/\\varepsilon)\\int_{a-\\varepsilon/2}^{a+\\varepsilon/2}f(t)dt$", why: "Only the pulse interval contributes." },
      { do: "Interpret the expression.", result: "the average value of $f$ over a small interval around $a$", why: "It is integral over width divided by width." },
      { do: "Let the pulse width shrink.", result: "the average tends to $f(a)$ as $\\varepsilon\\to0$", why: "$f$ is continuous at $a$." },
      { do: "Name the limiting object.", result: "$\\int f(t)\\delta(t-a)dt=f(a)$", why: "The limiting object is written $\\delta(t-a)$." }
    ],
    applications: [
      { title: "Sampling", background: "A shifted delta samples the function at that shift.", numbers: "$\\int f(t)\\delta(t-0.01)dt=f(0.01)$." },
      { title: "Polynomial sample", background: "The sifting rule evaluates the polynomial at the impulse location.", numbers: "$\\int(t^2+3t)\\delta(t-2)dt=10$." },
      { title: "Point mass", background: "A point mass returns the coordinate at its location.", numbers: "$\\int x\\delta(x-5)dx=5$." },
      { title: "Source strength", background: "A weighted delta has total mass equal to its weight.", numbers: "$\\int2\\delta(x-3)dx=2$." },
      { title: "Scaling", background: "Compressing the delta argument rescales its mass.", numbers: "$\\delta(3t)=\\delta(t)/3$." },
      { title: "Convolution identity", background: "Convolving with impulses copies and scales the signal.", numbers: "$[2]$ convolved with impulses $[1,0.5]$ gives impulse weights $[2,1]$." }
    ]
  },
  "math-06-10": {
    connectionsProse: "<p>Distributions extend the delta idea into a broader calculus of generalized functions. The reader has just seen that an impulse is best described by its action under an integral. This lesson uses that same action-based viewpoint for derivatives and jumps. It supports weak derivatives, PDE source terms, and signal models with discontinuities.</p>",
    motivation: "<p>Distributions extend functions by defining how an object acts on smooth test functions. Instead of asking for a value at each point, a distribution is understood through the number it returns when paired with a test function. Ordinary functions still fit this framework by integration, but impulses and jump derivatives fit too.</p>" +
                "<p>The derivative rule comes from integration by parts. Rather than differentiating a rough object directly, the derivative is moved onto the smooth test function with a minus sign. For the Heaviside step, all variation is concentrated at the jump, so its distributional derivative is the Dirac delta.</p>",
    definition: "<p>A distribution is defined by its action on smooth test functions, and its derivative is defined by moving the derivative onto the test function with a minus sign.</p>" +
                "<p>$$\\langle T',\\varphi\\rangle=-\\langle T,\\varphi'\\rangle,\\qquad H'=\\delta.$$</p>" +
                "<p><b>Assumptions that matter:</b> Test functions are smooth and compactly supported, so boundary terms vanish in integration by parts.</p>",
    symbols: [
      { sym: "$T$", desc: "distribution" },
      { sym: "$\\varphi$", desc: "smooth test function" },
      { sym: "$\\langle T,\\varphi\\rangle$", desc: "action" },
      { sym: "$H$", desc: "step function" }
    ],
    derivation: [
      { do: "Define derivative action.", result: "$\\langle T',\\varphi\\rangle=-\\langle T,\\varphi'\\rangle$", why: "Integration by parts moves derivatives to the test function." },
      { do: "Apply this to the Heaviside step $H$.", result: "$\\langle H',\\varphi\\rangle=-\\int_0^\\infty\\varphi'(t)dt$", why: "$H=1$ on positive $t$ and $0$ on negative $t$." },
      { do: "Integrate the derivative.", result: "$-\\int_0^\\infty\\varphi'(t)dt=-[\\varphi(\\infty)-\\varphi(0)]$", why: "The integral of $\\varphi'$ is an endpoint difference." },
      { do: "Use compact support.", result: "$\\varphi(\\infty)=0$", why: "The test function vanishes at infinity." },
      { do: "Simplify the expression.", result: "$\\varphi(0)$", why: "The remaining endpoint is the jump location." },
      { do: "Compare with the delta action.", result: "$H'=\\delta$", why: "$\\langle\\delta,\\varphi\\rangle=\\varphi(0)$." }
    ],
    applications: [
      { title: "Ordinary function action", background: "An ordinary function acts on a test function by integration.", numbers: "$f=2$ on $[0,1]$, $\\varphi=t+1$ gives $\\int_0^1 2(t+1)dt=3$." },
      { title: "Delta action", background: "A shifted delta evaluates the test function at its point.", numbers: "$\\langle\\delta_2,t^2-1\\rangle=3$." },
      { title: "Step derivative", background: "A jump produces a scaled delta in the distributional derivative.", numbers: "A jump of height $5$ gives $5\\delta(t)$." },
      { title: "Weak derivative", background: "Piecewise-smooth signals can have concentrated derivative terms.", numbers: "The weak derivative of a clipped signal has impulses at kink jumps in slope." },
      { title: "Point source", background: "A weighted point source returns a weighted test-function value.", numbers: "$7\\delta_{x_0}$ returns $7\\varphi(x_0)$." },
      { title: "Constant distribution derivative", background: "Constants have zero distributional derivative.", numbers: "A constant distribution derivative gives $0$ because $-\\int c\\varphi'=0$." }
    ]
  },
  "math-06-11": {
    connectionsProse: "<p>The uncertainty principle describes a limit built into the Fourier transform itself. The reader already knows that the transform compares a signal with many oscillations. This lesson explains why concentration in time and concentration in frequency cannot both be made arbitrarily small. The idea matters for audio windows, radar pulses, spectrograms, and learned time-frequency features.</p>",
    motivation: "<p>A signal cannot be arbitrarily sharp in time and frequency at the same time. A very short pulse must be built from many oscillatory components, so it occupies a broad frequency band. A very pure tone uses a narrow frequency band, but it must persist long enough to reveal that purity.</p>" +
                "<p>The formal statement measures spread rather than exact support. The time spread $\\Delta t$ and angular-frequency spread $\\Delta\\omega$ are energy-weighted standard deviations. The Fourier derivative relation and Cauchy-Schwarz inequality combine to force their product to be at least $1/2$ under this convention.</p>",
    definition: "<p>The Fourier uncertainty principle bounds how concentrated a signal can be simultaneously in time and angular frequency.</p>" +
                "<p>$$\\Delta t^2=\\|tf\\|_2^2/\\|f\\|_2^2,\\qquad \\Delta\\omega^2=\\|\\omega\\hat f\\|_2^2/\\|\\hat f\\|_2^2,\\qquad \\Delta t\\Delta\\omega\\ge1/2.$$</p>" +
                "<p><b>Assumptions that matter:</b> The signal is centered so time and frequency means are $0$, has finite spreads, and is regular enough for the derivative relation and integration by parts.</p>",
    symbols: [
      { sym: "$\\Delta t$", desc: "time spread" },
      { sym: "$\\Delta\\omega$", desc: "angular-frequency spread" },
      { sym: "$\\|\\cdot\\|_2$", desc: "energy norm" },
      { sym: "centers", desc: "energy-weighted means" }
    ],
    derivation: [
      { do: "Center the signal.", result: "time and frequency means are $0$", why: "This avoids extra notation without changing spreads." },
      { do: "Define the squared spreads.", result: "$\\Delta t^2=\\|tf\\|_2^2/\\|f\\|_2^2$ and $\\Delta\\omega^2=\\|\\omega\\hat f\\|_2^2/\\|\\hat f\\|_2^2$", why: "Spread is measured as an energy-weighted standard deviation." },
      { do: "Use the derivative property.", result: "$\\omega\\hat f$ is connected with $f'$", why: "The chosen Fourier convention turns differentiation into a frequency multiplier." },
      { do: "Apply Cauchy-Schwarz to $tf$ and $f'$.", result: "$\\|tf\\|_2\\|f'\\|_2\\ge |\\langle tf,f'\\rangle|$", why: "Cauchy-Schwarz bounds an inner product by the product of norms." },
      { do: "Integrate by parts.", result: "a lower bound proportional to $\\|f\\|_2^2/2$", why: "The derivative can be moved between factors and boundary terms vanish." },
      { do: "Translate back through the derivative relation.", result: "$\\Delta t\\Delta\\omega\\ge1/2$", why: "Frequency spread corresponds to the derivative norm." },
      { do: "Identify the equality case.", result: "Gaussians achieve equality", why: "They are the optimally concentrated Fourier pairs." }
    ],
    applications: [
      { title: "Time spread", background: "A known time spread imposes a minimum frequency spread.", numbers: "$\\Delta t=0.04$ s gives $\\Delta\\omega\\ge12.5$ rad/s and $\\Delta f\\ge1.99$ Hz." },
      { title: "Longer window", background: "Longer windows permit narrower best-case frequency spread.", numbers: "$0.10$ s gives $5$ rad/s and $0.796$ Hz." },
      { title: "Frequency spread", background: "A known angular-frequency spread imposes a minimum time spread.", numbers: "$\\Delta\\omega=40$ rad/s gives $\\Delta t\\ge0.0125$ s." },
      { title: "Impossible pair", background: "A pair below the uncertainty product cannot occur under the bound.", numbers: "$5$ ms with $10$ Hz gives product $0.314<0.5$, impossible under the bound." },
      { title: "Audio frame", background: "A short audio frame has a best-case frequency resolution limit.", numbers: "A $25$ ms audio frame has best-case $\\Delta f\\ge3.18$ Hz." },
      { title: "Radar pulse", background: "A very short radar pulse necessarily uses broad bandwidth.", numbers: "A $1$ ms radar pulse has $\\Delta f\\ge79.6$ Hz." }
    ]
  },
  "math-06-12": {
    connectionsProse: "<p>Sampling connects continuous signals to the finite data arrays used in computation. The reader already knows Fourier spectra and the Dirac impulse. This lesson explains how a grid of samples appears in frequency as repeated spectral copies. It is the foundation for digital audio, video, sensors, image resolution, and aliasing control in ML pipelines.</p>",
    motivation: "<p>Sampling replaces a continuous signal by values on a grid. In the frequency domain, that regular grid does not simply preserve one spectrum; it creates repeated copies spaced by the sampling rate. If the original signal is band-limited, those copies have finite width.</p>" +
                "<p>The Nyquist-Shannon condition says the copies must stay separated. If the sampling rate is faster than twice the highest frequency, an ideal low-pass filter can recover the central copy. If the copies overlap, high frequencies fold into lower ones, producing aliases that cannot be separated after sampling.</p>",
    definition: "<p>The Nyquist-Shannon theorem says a band-limited signal can be recovered from uniform samples when the sampling rate is greater than twice the band limit.</p>" +
                "<p>$$f_s>2B,\\qquad x(t)=\\sum_nx[n]\\operatorname{sinc}(f_st-n).$$</p>" +
                "<p><b>Assumptions that matter:</b> The original spectrum satisfies $X(f)=0$ for $|f|>B$, samples are uniformly spaced by $T_s=1/f_s$, and ideal low-pass reconstruction is allowed.</p>",
    symbols: [
      { sym: "$B$", desc: "band limit in Hz" },
      { sym: "$f_s$", desc: "sampling rate" },
      { sym: "$T_s$", desc: "sample spacing" },
      { sym: "Nyquist frequency $f_s/2$", desc: "highest representable frequency without aliasing" },
      { sym: "aliasing", desc: "overlapping spectral copies" }
    ],
    derivation: [
      { do: "Write sampling as multiplication by an impulse train.", result: "$x(t)\\sum_n\\delta(t-nT_s)$", why: "Sampling every $T_s=1/f_s$ seconds keeps grid values." },
      { do: "Move to frequency.", result: "the spectrum is copied at multiples of $f_s$", why: "Multiplication in time corresponds to convolution in frequency." },
      { do: "Use the band-limit condition.", result: "the central copy occupies $[-B,B]$", why: "$X(f)=0$ for $|f|>B$." },
      { do: "Compare central and neighboring copies.", result: "no overlap requires $B < f_s-B$", why: "Neighboring copies are centered at $\\pm f_s$." },
      { do: "Rearrange the inequality.", result: "$f_s>2B$", why: "The sampling rate must exceed twice the band limit." },
      { do: "Select the central copy.", result: "an ideal low-pass filter recovers the original spectrum", why: "The copies do not overlap." },
      { do: "Apply the inverse transform.", result: "$x(t)=\\sum_nx[n]\\operatorname{sinc}(f_st-n)$", why: "This is sinc interpolation from the recovered spectrum." }
    ],
    applications: [
      { title: "Band limit", background: "A band-limited signal requires a sampling rate above twice its highest frequency.", numbers: "$B=120$ Hz requires $f_s>240$ Hz; $200$ Hz aliases." },
      { title: "Audio", background: "Audio sampling must exceed twice the audible band limit.", numbers: "$B=20$ kHz requires $>40$ kHz; $44.1$ kHz leaves $4.1$ kHz margin." },
      { title: "Aliasing", background: "A frequency above Nyquist folds below Nyquist after sampling.", numbers: "$70$ Hz sampled at $100$ Hz aliases to $30$ Hz." },
      { title: "Video", background: "Frame rate sets the temporal Nyquist frequency.", numbers: "$60$ fps video represents temporal frequencies below $30$ Hz." },
      { title: "Sensor cutoff", background: "Anti-alias cutoff should sit below Nyquist.", numbers: "Sampling at $256$ Hz with cutoff $90$ Hz leaves Nyquist margin $128-90=38$ Hz." },
      { title: "Pixel spacing", background: "Spatial sample spacing determines spatial Nyquist frequency.", numbers: "$0.01$ mm gives sampling $100$ samples/mm and Nyquist $50$ cycles/mm." }
    ]
  },
  "math-06-13": {
    connectionsProse: "<p>The DFT is the finite-sample version of Fourier analysis. The reader already knows continuous transforms and sampling; now the signal is a list of $N$ numbers. This lesson shows that finite data can be rewritten exactly in finite frequency coordinates. It prepares the FFT and the spectral tools used in digital signal processing and ML feature extraction.</p>",
    motivation: "<p>The DFT rewrites a finite list of samples as finite frequency coordinates. Each row of the DFT matrix compares the data with a discrete rotating wave. The output coefficient records how strongly the sample vector aligns with that frequency bin.</p>" +
                "<p>Roots of unity provide the orthogonality. When two different rows are dotted together, the rotations wrap evenly around the circle and sum to zero. When a row is dotted with itself, all terms align and the sum is $N$, which gives the inverse formula.</p>",
    definition: "<p>The DFT rewrites $N$ samples as $N$ finite frequency-bin coordinates, with inversion coming from root-of-unity orthogonality.</p>" +
                "<p>$$X_k=\\sum_{n=0}^{N-1}x_nw^{kn},\\qquad w=e^{-2\\pi i/N},\\qquad x_n=N^{-1}\\sum_kX_ke^{2\\pi ikn/N}.$$</p>" +
                "<p><b>Assumptions that matter:</b> The signal has $N$ samples indexed $0$ to $N-1$, and frequency bins are indexed modulo $N$.</p>",
    symbols: [
      { sym: "$N$", desc: "number of samples" },
      { sym: "$n$", desc: "sample index" },
      { sym: "$k$", desc: "frequency-bin index" },
      { sym: "$F$", desc: "DFT matrix" },
      { sym: "$w$", desc: "root of unity" },
      { sym: "$F^*$", desc: "conjugate transpose" }
    ],
    derivation: [
      { do: "Define the discrete rotation.", result: "$w=e^{-2\\pi i/N}$", why: "One step around the $N$th roots of unity is the discrete rotation." },
      { do: "Define the DFT coefficient.", result: "$X_k=\\sum_{n=0}^{N-1}x_nw^{kn}$", why: "The row $k$ is the $k$th rotating wave." },
      { do: "Write the matrix form.", result: "$X=Fx$ with $F_{k,n}=w^{kn}$", why: "Each DFT row is one finite frequency coordinate." },
      { do: "Compute row orthogonality.", result: "$\\sum_{n=0}^{N-1}w^{(k-m)n}=0$ if $k\\ne m$ and $N$ if $k=m$", why: "Different roots wrap evenly around the circle; matching roots align." },
      { do: "Convert orthogonality to a matrix identity.", result: "$F^*F=NI$", why: "Rows have squared norm $N$ and zero cross-products." },
      { do: "Invert the transform.", result: "$x_n=N^{-1}\\sum_kX_ke^{2\\pi ikn/N}$", why: "Multiply by $(1/N)F^*$." }
    ],
    applications: [
      { title: "`np.fft` check", background: "A simple alternating pulse has energy in matching finite bins.", numbers: "$[1,0,-1,0]$ maps to $[0,2,0,2]$." },
      { title: "Constant", background: "A constant vector has only the zero-frequency component.", numbers: "$[1,1,1,1]$ maps to $[4,0,0,0]$." },
      { title: "Alternating", background: "A sign-alternating vector lands at the Nyquist bin for length four.", numbers: "$[1,-1,1,-1]$ maps to $[0,0,4,0]$." },
      { title: "Bins", background: "Frequency bins are spaced by sampling rate divided by length.", numbers: "With $N=8,f_s=800$ Hz, bins $0,1,2,4$ are $0,100,200,400$ Hz." },
      { title: "Real signal symmetry", background: "A real finite signal has conjugate-symmetric DFT coefficients.", numbers: "A real signal with $X_1=3-4i$ has $X_7=3+4i$ and magnitude $5$." },
      { title: "Bin spacing", background: "Longer DFTs give finer bin spacing at a fixed sampling rate.", numbers: "For $N=1024,f_s=44100$, bin spacing is $43.1$ Hz." }
    ]
  },
  "math-06-14": {
    connectionsProse: "<p>The FFT is an efficient way to compute the DFT without changing its mathematical output. The reader already knows the DFT formula and the role of roots of unity. This lesson shows how symmetry in those roots reduces repeated work. The result is why Fourier methods are practical for audio, images, polynomial multiplication, and large feature pipelines.</p>",
    motivation: "<p>The FFT computes the DFT exactly but avoids recomputing symmetric pieces. A length-$N$ transform can be split into the samples with even indices and the samples with odd indices. Each half looks like a length-$N/2$ DFT.</p>" +
                "<p>The two half-size transforms are then recombined with twiddle factors in butterfly pairs. Repeating this split through powers of two gives about $\\log_2N$ stages, with about $N$ work per stage. This changes the scale from $O(N^2)$ to $O(N\\log_2N)$.</p>",
    definition: "<p>The FFT computes the same DFT by recursively splitting even and odd samples, then recombining half-size transforms with twiddle factors.</p>" +
                "<p>$$X_k=E_k+w_N^kO_k,\\qquad X_{k+N/2}=E_k-w_N^kO_k,\\qquad \\text{work }O(N\\log_2N).$$</p>" +
                "<p><b>Assumptions that matter:</b> The radix-2 split assumes $N$ is even, and repeated halving is simplest when $N$ is a power of two.</p>",
    symbols: [
      { sym: "$E_k,O_k$", desc: "DFTs of even and odd subsequences" },
      { sym: "$w_N=e^{-2\\pi i/N}$", desc: "twiddle factor" },
      { sym: "butterfly pair", desc: "one add and one subtract after twiddle multiplication" }
    ],
    derivation: [
      { do: "Start with the DFT formula.", result: "$X_k=\\sum_{n=0}^{N-1}x_ne^{-2\\pi ikn/N}$", why: "The FFT computes this same output." },
      { do: "Split indices into even and odd positions.", result: "$n=2m$ and $n=2m+1$", why: "$N$ is even." },
      { do: "Rewrite the even sum.", result: "$\\sum_{m=0}^{N/2-1}x_{2m}e^{-2\\pi ikm/(N/2)}=E_k$", why: "The even samples form a length-$N/2$ DFT." },
      { do: "Rewrite the odd sum.", result: "$e^{-2\\pi ik/N}\\sum_mx_{2m+1}e^{-2\\pi ikm/(N/2)}=w_N^kO_k$", why: "The odd samples form a length-$N/2$ DFT times a twiddle factor." },
      { do: "Combine the halves.", result: "$X_k=E_k+w_N^kO_k$", why: "The DFT is the sum of even and odd contributions." },
      { do: "Use half-size DFT periodicity.", result: "$X_{k+N/2}=E_k-w_N^kO_k$", why: "The twiddle changes sign for the paired frequency." },
      { do: "Count work by stages.", result: "about $N$ butterfly operations and $\\log_2N$ stages", why: "Each split level recombines all samples once." },
      { do: "Compare asymptotic work.", result: "$O(N\\log_2N)$ instead of $O(N^2)$", why: "Recursive reuse avoids direct all-pairs summation." }
    ],
    applications: [
      { title: "Length 1024", background: "FFT scale is much smaller than direct DFT scale.", numbers: "$N=1024$: direct $1{,}048{,}576$, FFT scale $10{,}240$, ratio $102.4$." },
      { title: "Length 8", background: "Even small transforms reduce work through butterfly reuse.", numbers: "$N=8$: $64$ direct vs $24$ FFT scale." },
      { title: "Length 4096", background: "The gap grows quickly with transform length.", numbers: "$N=4096$: $N\\log_2N=49{,}152$ vs $16{,}777{,}216$." },
      { title: "Batch FFTs", background: "Batching multiple transforms keeps the same scaling advantage.", numbers: "Three $2048$-point FFTs cost $67{,}584$ scale units vs $4{,}194{,}304$, ratio $62.1$." },
      { title: "Polynomial product", background: "FFT convolution needs enough length to hold all product coefficients.", numbers: "Degree-$1023$ polynomial product needs transform length at least $2048$." },
      { title: "Streaming frames", background: "Frame-rate FFT pipelines scale by frames per second.", numbers: "$100$ frames/s of $512$-point FFTs cost $100\\cdot512\\cdot9=460{,}800$ scale units/s." }
    ]
  },
  "math-06-15": {
    connectionsProse: "<p>The Laplace transform sits next to the Fourier transform as another way to probe signals by exponentials. The reader already knows that Fourier uses pure oscillations $e^{-i\\omega t}$. This lesson adds the complex variable $s=\\sigma+i\\omega$, where the real part introduces damping or growth. The connection is especially useful in systems, control, filters, and differential equations.</p>",
    motivation: "<p>Fourier probes a signal with pure oscillation. Laplace probes it with oscillation plus exponential damping or growth. The damping factor can make integrals converge for signals that would not have an ordinary Fourier transform on the imaginary axis.</p>" +
                "<p>When the real part $\\sigma$ is set to zero, the Laplace probe becomes the Fourier probe. In that case, evaluating the Laplace transform at $s=i\\omega$ gives the one-sided Fourier transform, provided the integral converges. The region of convergence records where this substitution is allowed.</p>",
    definition: "<p>The one-sided Laplace transform uses a complex frequency $s=\\sigma+i\\omega$; setting $s=i\\omega$ gives the one-sided Fourier transform when the integral converges.</p>" +
                "<p>$$X(s)=\\int_0^\\infty x(t)e^{-st}dt,\\qquad X(i\\omega)=\\int_0^\\infty x(t)e^{-i\\omega t}dt.$$</p>" +
                "<p><b>Assumptions that matter:</b> The imaginary-axis substitution is valid only when the region of convergence includes $s=i\\omega$.</p>",
    symbols: [
      { sym: "$s$", desc: "complex frequency" },
      { sym: "$\\sigma$", desc: "damping rate" },
      { sym: "$\\omega$", desc: "angular frequency" },
      { sym: "region of convergence", desc: "where the integral decays" }
    ],
    derivation: [
      { do: "Write the complex Laplace variable.", result: "$s=\\sigma+i\\omega$", why: "A complex Laplace variable has real and imaginary parts." },
      { do: "Expand the exponential probe.", result: "$e^{-st}=e^{-\\sigma t}e^{-i\\omega t}$", why: "This separates damping from oscillation." },
      { do: "Define the one-sided Laplace transform.", result: "$X(s)=\\int_0^\\infty x(t)e^{-st}dt$", why: "Laplace integrates over $t\\ge0$." },
      { do: "Set the damping to zero.", result: "$s=i\\omega$ and the damping factor is $1$", why: "$\\sigma=0$." },
      { do: "Identify the one-sided Fourier transform.", result: "$X(i\\omega)=\\int_0^\\infty x(t)e^{-i\\omega t}dt$", why: "This is the one-sided Fourier transform when it converges." },
      { do: "Compute the transform of $x(t)=e^{-2t}$.", result: "$\\int_0^\\infty e^{-(s+2)t}dt=1/(s+2)$", why: "Combining exponents gives a decaying exponential integral." },
      { do: "Evaluate on the imaginary axis.", result: "$X(i\\omega)=1/(2+i\\omega)$", why: "Substitute $s=i\\omega$." }
    ],
    applications: [
      { title: "Exponential decay", background: "A decaying exponential has a simple Laplace/Fourier-axis form.", numbers: "$e^{-2t}$ gives $X(i\\omega)=1/(2+i\\omega)$ and $X(0)=0.5$." },
      { title: "Faster decay", background: "Increasing the decay rate shifts the denominator.", numbers: "$e^{-3t}$ gives $1/(3+i\\omega)$." },
      { title: "System gain", background: "A transfer function's frequency response is found on the imaginary axis.", numbers: "$H(s)=1/(s+5)$ has gains $0.2$ at $\\omega=0$ and $1/\\sqrt{50}\\approx0.141$ at $\\omega=5$." },
      { title: "Growth", background: "Growing exponentials may not converge on the imaginary axis.", numbers: "$e^{2t}$ has ROC $\\operatorname{Re}s>2$, so no ordinary imaginary-axis Fourier transform." },
      { title: "Poles", background: "The denominator roots mark poles of a rational transform.", numbers: "$2/(s^2+3s+2)$ has poles at $-1,-2$." },
      { title: "Magnitude", background: "Frequency response magnitude is the reciprocal complex modulus here.", numbers: "At $\\omega=4$, $|1/(2+4i)|=1/\\sqrt{20}\\approx0.224$." }
    ]
  },
  "math-06-16": {
    connectionsProse: "<p>Wavelets appear after Fourier analysis as a way to keep some location information. The reader already knows that Fourier modes are global waves extending across the whole signal. This lesson introduces localized waves that can be shifted and scaled. The goal is not a long proof but a clear representation idea used in compression, denoising, image pyramids, and transient detection.</p>",
    motivation: "<p>Wavelets analyze a signal with small localized waves that can be shifted and scaled. A wavelet coefficient measures how much the signal resembles a particular shifted and scaled copy of the mother wavelet. This keeps track of both where a feature occurs and roughly how wide it is.</p>" +
                "<p>The tradeoff is different from Fourier analysis. Fourier modes have precise global frequency but no local position, while wavelets give local time or space information with scale-dependent frequency detail. Small scales capture narrow, high-frequency changes; large scales capture broad, low-frequency structure.</p>",
    definition: "<p>A wavelet transform represents a signal by comparing it with shifted and scaled copies of a localized mother wavelet.</p>" +
                "<p>$$W_f(a,b)=\\int f(t)\\frac{1}{\\sqrt{|a|}}\\overline{\\psi\\left(\\frac{t-b}{a}\\right)}\\,dt.$$</p>" +
                "<p><b>Assumptions that matter:</b> This lesson introduces a representation family rather than proving a single identity; scaling changes width and translation moves the wavelet.</p>",
    symbols: [
      { sym: "$\\psi$", desc: "mother wavelet" },
      { sym: "$a$", desc: "scale" },
      { sym: "$b$", desc: "shift" },
      { sym: "$W_f(a,b)$", desc: "wavelet coefficient" },
      { sym: "small $a$", desc: "narrow/high-frequency detail" },
      { sym: "large $a$", desc: "broad/low-frequency structure" }
    ],
    applications: [
      { title: "Scaled width", background: "Scaling a wavelet scales its effective width.", numbers: "A wavelet with base width $10$ ms has width $20$ ms at scale $a=2$." },
      { title: "Image pyramid", background: "A pyramid level reduces spatial resolution by a factor of two per dimension.", numbers: "In an image pyramid, downsampling by $2$ halves each spatial dimension, so a $256\\times256$ map becomes $128\\times128$." },
      { title: "Subbands", background: "Multiple detail bands across levels organize multiscale structure.", numbers: "Keeping $3$ detail bands per level for $4$ levels gives $12$ detail subbands." },
      { title: "Localized spike", background: "A transient appears near its location rather than across every coefficient.", numbers: "A localized spike at $b=0.35$ s is captured by coefficients near that shift, not across the whole record." },
      { title: "Scale coverage", background: "Larger scale covers proportionally more samples.", numbers: "A scale-$4$ wavelet covers four times the samples of scale $1$." },
      { title: "Denoising", background: "Thresholding small wavelet coefficients removes weak components.", numbers: "For denoising, threshold $0.2$ zeros coefficients $0.05$ and $0.12$ but keeps $0.8$." }
    ]
  },
  "math-06-17": {
    connectionsProse: "<p>Filtering is the practical language of changing a signal by its content. The reader already knows convolution and the convolution theorem. This lesson names the impulse response in time and the frequency response in the spectrum. It connects mathematical Fourier rules to smoothing, sharpening, anti-aliasing, masks, and learned filters.</p>",
    motivation: "<p>A filter changes a signal by keeping, reducing, or emphasizing selected structure. In time or space, an LTI filter is convolution with an impulse response or kernel. That kernel describes how shifted copies of the input are weighted and added.</p>" +
                "<p>In frequency, the same operation is multiplication by a response. Each frequency bin has a gain, and the output magnitude at that frequency is the input magnitude times the gain. Low-pass filters keep slow variation and reduce rapid variation; high-pass filters do the opposite.</p>",
    definition: "<p>An LTI filter applies convolution by an impulse response in time or space, equivalently multiplication by a frequency response in the Fourier domain.</p>" +
                "<p>$$y=h*x,\\qquad \\hat y(\\omega)=\\hat h(\\omega)\\hat x(\\omega)=H(\\omega)\\hat x(\\omega),\\qquad |Y|=|H||X|.$$</p>" +
                "<p><b>Assumptions that matter:</b> The filter is linear and time-invariant, and the convolution theorem applies to the input and impulse response.</p>",
    symbols: [
      { sym: "$h$", desc: "impulse response or kernel" },
      { sym: "$x$", desc: "input" },
      { sym: "$y$", desc: "output" },
      { sym: "$H$", desc: "frequency response" },
      { sym: "gain", desc: "magnitude multiplier" }
    ],
    derivation: [
      { do: "Define the LTI filter output by convolution.", result: "$y=h*x$", why: "The impulse response $h$ describes shifted copies added together." },
      { do: "Apply the convolution theorem.", result: "$\\hat y(\\omega)=\\hat h(\\omega)\\hat x(\\omega)$", why: "Convolution in time or space becomes multiplication in frequency." },
      { do: "Name the frequency response.", result: "$H(\\omega)=\\hat h(\\omega)$", why: "This records the filter's frequency-domain action." },
      { do: "Take magnitudes frequency by frequency.", result: "$|Y|=|H||X|$", why: "Magnitudes multiply." },
      { do: "Describe low-pass behavior.", result: "$|H|\\approx1$ near $0$ and small at high $|\\omega|$", why: "Low-pass filters keep slow variation and reduce rapid variation." },
      { do: "Describe high-pass behavior.", result: "small near $0$ and larger at high frequencies", why: "High-pass filters do the opposite." }
    ],
    applications: [
      { title: "Moving average", background: "A two-point average smooths adjacent samples.", numbers: "$[1/2,1/2]$ on $[2,6,10]$ gives $[4,8]$." },
      { title: "Difference filter", background: "A first difference responds to changes between adjacent samples.", numbers: "$[1,-1]$ on $[3,7,6,10]$ gives $[-4,1,-4]$." },
      { title: "Frequency bin", background: "A frequency response gain scales a bin amplitude.", numbers: "$X_k=5$, $H_k=0.2$ gives $Y_k=1$." },
      { title: "First-order low-pass", background: "At the cutoff, a standard first-order low-pass has gain $1/\\sqrt2$.", numbers: "The gain at cutoff $\\omega=10$ is $1/\\sqrt2\\approx0.707$." },
      { title: "DFT mask", background: "A frequency-domain mask keeps selected bins and zeros others.", numbers: "DFT magnitudes $[20,8,2,1]$ masked by $[1,1,0,0]$ become $[20,8,0,0]$." },
      { title: "Downsampling", background: "Anti-alias filtering must cut below the new Nyquist frequency.", numbers: "Downsampling from $1000$ Hz to $250$ Hz requires cutoff below $125$ Hz." }
    ]
  },
  "math-06-18": {
    connectionsProse: "<p>Spectral methods use Fourier ideas to solve equations by changing basis. The reader already knows that derivatives become multiplication in the frequency domain. This lesson applies that fact to a differential equation, where each Fourier mode evolves independently. The same pattern appears in PDE solvers, graph diffusion, smoothing, and spectral neural operators.</p>",
    motivation: "<p>Spectral methods solve a problem in a basis where an operator becomes simple. In the standard coordinate view, a derivative operator acts on the whole function. In a Fourier basis, each mode has a known derivative, so the operator becomes a multiplier on each coefficient.</p>" +
                "<p>For the heat equation, this makes the smoothing effect transparent. The second derivative of $e^{ikx}$ gives $-k^2e^{ikx}$, so each mode follows a scalar decay equation. Higher-frequency modes have larger $k^2$, so they decay faster and the solution becomes smoother over time.</p>",
    definition: "<p>Spectral methods expand a function in Fourier modes so differential operators act as simple multipliers on spectral coefficients.</p>" +
                "<p>$$u(x,t)=\\sum_k\\hat u_k(t)e^{ikx},\\qquad \\hat u_k(t)=\\hat u_k(0)e^{-\\alpha k^2t}.$$</p>" +
                "<p><b>Assumptions that matter:</b> The heat-mode derivation uses a periodic Fourier basis and the heat equation $u_t=\\alpha u_{xx}$.</p>",
    symbols: [
      { sym: "$u$", desc: "function being solved" },
      { sym: "$\\hat u_k$", desc: "spectral coefficient" },
      { sym: "$k$", desc: "mode number" },
      { sym: "$\\alpha$", desc: "diffusivity" },
      { sym: "$e^{ikx}$", desc: "Fourier mode" }
    ],
    derivation: [
      { do: "Expand in Fourier modes.", result: "$u(x,t)=\\sum_k\\hat u_k(t)e^{ikx}$", why: "Fourier modes form the periodic basis." },
      { do: "Differentiate one mode twice.", result: "$\\partial_{xx}e^{ikx}=-k^2e^{ikx}$", why: "Each derivative brings down a factor $ik$." },
      { do: "Substitute the expansion into the heat equation.", result: "$u_t=\\alpha u_{xx}$", why: "This moves the PDE into the Fourier basis." },
      { do: "Match independent mode coefficients.", result: "$\\hat u_k'(t)=-\\alpha k^2\\hat u_k(t)$", why: "Each Fourier mode evolves independently." },
      { do: "Solve the scalar ODE.", result: "$\\hat u_k(t)=\\hat u_k(0)e^{-\\alpha k^2t}$", why: "The coefficient has exponential decay rate $\\alpha k^2$." },
      { do: "Interpret the $k^2$ factor.", result: "higher $k$ means faster decay", why: "$k^2$ is larger for higher-frequency modes." }
    ],
    applications: [
      { title: "Heat mode", background: "A heat-equation Fourier mode decays exponentially.", numbers: "$\\hat u_3(0)=5,\\alpha=0.1,t=2$ gives $5e^{-1.8}\\approx0.826$." },
      { title: "Second mode", background: "The same heat-mode rule applies to any mode number.", numbers: "$\\alpha=0.2,k=2,t=1,\\hat u_2(0)=3$ gives $3e^{-0.8}\\approx1.348$." },
      { title: "Second derivative", background: "A sinusoidal mode is an eigenfunction of the second derivative.", numbers: "$u=2\\sin3x$ has $u''=-18\\sin3x$." },
      { title: "Mode truncation", background: "Spectral truncation removes higher modes.", numbers: "Keep modes $[10,4,1,0.5]$ through $k=2$ gives $[10,4,1,0]$." },
      { title: "Graph heat", background: "Graph diffusion damps eigenmodes by exponential factors.", numbers: "Graph heat with $\\lambda=6$ and factor $e^{-0.05\\lambda}$ gives $0.741$." },
      { title: "Poisson solve", background: "A spectral Poisson solve divides by the mode's second-derivative multiplier.", numbers: "If $-u''=f$ and $\\hat f_4=8$, then $\\hat u_4=8/16=0.5$." }
    ]
  },
  "math-06-19": {
    connectionsProse: "<p>This capstone connects the section's Fourier tools to modern machine learning architectures. The reader already knows convolution, filtering, the convolution theorem, and spectral methods. CNNs use local learned kernels in the spatial domain, while spectral architectures learn or apply multipliers in a transformed basis. The shared idea is that structured linear operations can be understood as filters.</p>",
    motivation: "<p>CNN kernels are learned filters. A kernel forms local weighted sums across spatial offsets and input channels, and the same weights are reused across locations. That sharing gives translation equivariance away from boundaries: shifting the input shifts the output in the same way.</p>" +
                "<p>Spectral architectures use the same filtering idea after moving to Fourier, graph, or operator eigenbases. Instead of learning a small local kernel and then transforming it implicitly, a spectral layer can learn multipliers $M_k$ for selected modes directly. This makes the connection between CNNs, convolution theorems, and operator learning explicit.</p>",
    definition: "<p>A CNN convolution forms local weighted sums with shared kernels, while spectral architectures apply learned multipliers directly to transformed coefficients.</p>" +
                "<p>$$Y_{i,j}=\\sum_{a,b}K_{a,b}X_{i+a,j+b},\\qquad \\widehat Y_k=\\widehat K_k\\widehat X_k,\\qquad \\widehat Y_k=M_k\\widehat X_k.$$</p>" +
                "<p><b>Assumptions that matter:</b> The convolution statement is for the linear part of the layer, and translation equivariance holds away from boundary effects.</p>",
    symbols: [
      { sym: "$X$", desc: "input feature map" },
      { sym: "$K$", desc: "kernel" },
      { sym: "$Y$", desc: "output map" },
      { sym: "$a,b$", desc: "kernel offsets" },
      { sym: "$c$", desc: "channel index" },
      { sym: "$M_k$", desc: "learned spectral multiplier" }
    ],
    derivation: [
      { do: "Define one-channel convolution.", result: "$Y_{i,j}=\\sum_{a,b}K_{a,b}X_{i+a,j+b}$", why: "A kernel forms a local weighted sum." },
      { do: "Include multiple input channels.", result: "add $\\sum_c$", why: "Each output channel reads all input channels." },
      { do: "Use shared weights across locations.", result: "translating $X$ translates $Y$ away from boundaries", why: "This is translation equivariance." },
      { do: "View the linear convolution part as convolution.", result: "$Y=K*X$", why: "The layer applies the same local kernel across positions." },
      { do: "Apply the convolution theorem.", result: "$\\widehat Y_k=\\widehat K_k\\widehat X_k$", why: "Convolution becomes multiplication in the transformed basis." },
      { do: "Write the spectral-layer rule.", result: "$\\widehat Y_k=M_k\\widehat X_k$ for retained modes", why: "Spectral layers learn multipliers $M_k$ directly." }
    ],
    applications: [
      { title: "Edge patch", background: "A learned or hand-coded edge kernel forms a local weighted sum before activation.", numbers: "Patch $\\begin{bmatrix}1&2&1\\0&3&2\\1&1&0\\end{bmatrix}$ with edge kernel $\\begin{bmatrix}1&0&-1\\1&0&-1\\1&0&-1\\end{bmatrix}$ gives pre-activation $-1$ and ReLU $0$." },
      { title: "Small patch", background: "A small convolution output is the sum of entrywise products.", numbers: "$2\\times2$ patch $\\begin{bmatrix}2&1\\0&3\\end{bmatrix}$ with kernel $\\begin{bmatrix}1&-1\\0&2\\end{bmatrix}$ gives $7$." },
      { title: "Output shape", background: "No-padding spatial convolution shrinks the output by kernel width minus one.", numbers: "$5\\times5$ image, $3\\times3$ kernel, stride $1$, no padding gives $3\\times3=9$ outputs." },
      { title: "Parameter count", background: "CNN parameters multiply input channels, output channels, and kernel entries.", numbers: "$16$ input channels, $32$ output channels, $3\\times3$ kernels give $16\\cdot32\\cdot9=4608$ weights." },
      { title: "Spectral multiplier", background: "A spectral multiplier scales a complex mode coefficient.", numbers: "$0.5$ on $3-2i$ gives $1.5-i$ with magnitude $\\sqrt{3.25}\\approx1.803$." },
      { title: "Mode retention", background: "Keeping a subset of Fourier modes limits spectral bandwidth.", numbers: "Keeping $16$ Fourier modes out of $128$ keeps $12.5\\%$ of one-dimensional modes." }
    ]
  }
};
