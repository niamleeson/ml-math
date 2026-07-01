module.exports = {
  "math-06-11": {
    id: "math-06-11",
    title: "The uncertainty principle",
    tagline: "A signal cannot be perfectly sharp in time and perfectly sharp in frequency at the same time.",
    connections: {
      buildsOn: ["Fourier transform", "variance", "complex exponentials"],
      leadsTo: ["Sampling and the Nyquist-Shannon theorem", "Wavelets", "Spectral methods"],
      usedWith: ["Fourier transform", "Gaussian functions", "inner products", "norms"]
    },
    motivation:
      "<p>You already know the tradeoff from ordinary life: a quick clap tells you exactly when something happened, but it contains a broad burst of pitches. A long pure tone has a clean pitch, but it is spread out in time.</p>" +
      "<p>The <b>uncertainty principle</b> makes that tradeoff precise. Fourier analysis lets us move between time and frequency, but it does not let us concentrate a nonzero signal arbitrarily tightly in both places. This is not a failure of measurement; it is geometry.</p>",
    definition:
      "<p>For a square-integrable signal $f(t)$ with Fourier transform $\\widehat f(\\omega)$, define the time center $t_0$ and frequency center $\\omega_0$ as the energy-weighted means. The spreads are $\\Delta t^2=\\dfrac{\\int (t-t_0)^2|f(t)|^2\\,dt}{\\int |f(t)|^2\\,dt}$ and $\\Delta \\omega^2=\\dfrac{\\int (\\omega-\\omega_0)^2|\\widehat f(\\omega)|^2\\,d\\omega}{\\int |\\widehat f(\\omega)|^2\\,d\\omega}$.</p>" +
      "<p>With the convention $\\widehat f(\\omega)=\\int f(t)e^{-i\\omega t}\\,dt$, the Fourier uncertainty inequality is $\\Delta t\\,\\Delta\\omega\\ge \\tfrac12$. The reason is Cauchy-Schwarz: the product of the sizes of $(t-t_0)f$ and the derivative-related frequency spread must dominate their inner product. Gaussians make the inequality tight.</p>" +
      "<p><b>Assumptions that matter:</b> the signal must have finite energy and finite second moments; constants change if the Fourier convention uses frequency in cycles per second; and zero signal is excluded because its center and spread are undefined.</p>",
    worked: {
      problem: "A normalized Gaussian window has time spread $\\Delta t=0.04$ seconds. Using $\\Delta t\\,\\Delta\\omega\\ge\\tfrac12$, find the smallest possible angular-frequency spread and convert it to cycles per second.",
      skills: ["uncertainty inequality", "unit conversion", "Fourier conventions"],
      strategy: "Use the inequality first in angular frequency, then divide by $2\\pi$ to convert radians per second to hertz.",
      steps: [
        { do: "Write the inequality", result: "$\\Delta t\\,\\Delta\\omega\\ge\\tfrac12$", why: "this convention measures frequency in radians per second" },
        { do: "Substitute $\\Delta t=0.04$", result: "$0.04\\Delta\\omega\\ge0.5$", why: "the time spread is given" },
        { do: "Divide by $0.04$", result: "$\\Delta\\omega\\ge12.5$ rad/s", why: "$0.5/0.04=12.5$" },
        { do: "Convert to cycles per second", result: "$\\Delta f=\\Delta\\omega/(2\\pi)$", why: "one cycle is $2\\pi$ radians" },
        { do: "Approximate the hertz spread", result: "$\\Delta f\\ge12.5/(2\\pi)\\approx1.99$ Hz", why: "$2\\pi\\approx6.283$" }
      ],
      verify: "A short $0.04$ second pulse requiring about $2$ Hz or more of spread is sensible: sharper timing needs a wider frequency band.",
      answer: "$\\Delta\\omega\\ge12.5$ rad/s, or $\\Delta f\\ge1.99$ Hz.",
      connects: "The inequality turns the vague phrase time-frequency tradeoff into a numerical lower bound."
    },
    practice: [
      { problem: "If $\\Delta t=0.10$ s, find the minimum $\\Delta\\omega$ and $\\Delta f$.", steps: [
        { do: "Start with the uncertainty bound", result: "$\\Delta t\\,\\Delta\\omega\\ge\\tfrac12$", why: "angular frequency convention" },
        { do: "Substitute the time spread", result: "$0.10\\Delta\\omega\\ge0.5$", why: "use the given value" },
        { do: "Divide by $0.10$", result: "$\\Delta\\omega\\ge5$ rad/s", why: "$0.5/0.10=5$" },
        { do: "Convert units", result: "$\\Delta f\\ge5/(2\\pi)$", why: "hertz are cycles per second" },
        { do: "Approximate", result: "$\\Delta f\\ge0.796$ Hz", why: "$5/6.283\\approx0.796$" }
      ], answer: "The minimum spread is $5$ rad/s, or about $0.796$ Hz." },
      { problem: "A signal has $\\Delta\\omega=40$ rad/s. What is the smallest possible $\\Delta t$?", steps: [
        { do: "Write the bound", result: "$\\Delta t\\,40\\ge0.5$", why: "substitute $\\Delta\\omega=40$" },
        { do: "Divide by $40$", result: "$\\Delta t\\ge0.0125$ s", why: "$0.5/40=0.0125$" },
        { do: "Convert to milliseconds", result: "$0.0125\\text{ s}=12.5\\text{ ms}$", why: "multiply seconds by $1000$" },
        { do: "Interpret the result", result: "at least $12.5$ ms", why: "a wide frequency spread permits a shorter pulse" }
      ], answer: "The time spread must be at least $0.0125$ s, or $12.5$ ms." },
      { problem: "A desired pulse has $\\Delta t=5$ ms and $\\Delta f=10$ Hz. Does it satisfy the uncertainty bound?", steps: [
        { do: "Convert time to seconds", result: "$5\\text{ ms}=0.005$ s", why: "the inequality uses seconds" },
        { do: "Convert hertz to angular spread", result: "$\\Delta\\omega=2\\pi\\cdot10=20\\pi$ rad/s", why: "angular frequency is radians per second" },
        { do: "Multiply spreads", result: "$\\Delta t\\,\\Delta\\omega=0.005\\cdot20\\pi=0.1\\pi$", why: "test the product" },
        { do: "Approximate the product", result: "$0.1\\pi\\approx0.314$", why: "$\\pi\\approx3.14$" },
        { do: "Compare with the lower bound", result: "$0.314<0.5$", why: "the product is too small" }
      ], answer: "No. Those spreads violate the bound because $0.314<0.5$." },
      { problem: "For a Gaussian with $\\Delta t\\,\\Delta\\omega=\\tfrac12$ and $\\Delta t=0.02$ s, find $\\Delta\\omega$ and the product after doubling the time spread.", steps: [
        { do: "Use equality", result: "$0.02\\Delta\\omega=0.5$", why: "Gaussians can attain the minimum" },
        { do: "Solve for frequency spread", result: "$\\Delta\\omega=25$ rad/s", why: "$0.5/0.02=25$" },
        { do: "Double the time spread", result: "$\\Delta t_{new}=0.04$ s", why: "the question changes only time spread" },
        { do: "Keep the old frequency spread", result: "$0.04\\cdot25=1$", why: "compute the new product" },
        { do: "Compare to the minimum", result: "$1>0.5$", why: "wider time support allows a non-minimal product" }
      ], answer: "The original $\\Delta\\omega$ is $25$ rad/s; after doubling time spread with the same frequency spread, the product is $1$." },
      { problem: "An audio feature extractor wants frame uncertainty $\\Delta t=0.025$ s. What is the best-case frequency uncertainty in hertz?", steps: [
        { do: "Write the angular bound", result: "$0.025\\Delta\\omega\\ge0.5$", why: "insert the frame time spread" },
        { do: "Solve for angular spread", result: "$\\Delta\\omega\\ge20$ rad/s", why: "$0.5/0.025=20$" },
        { do: "Convert to hertz", result: "$\\Delta f\\ge20/(2\\pi)$", why: "divide by radians per cycle" },
        { do: "Approximate", result: "$\\Delta f\\ge3.18$ Hz", why: "$20/6.283\\approx3.18$" },
        { do: "Interpret for features", result: "about $3.18$ Hz or wider", why: "a frame this localized cannot have arbitrarily precise pitch" }
      ], answer: "The best-case frequency uncertainty is about $3.18$ Hz." }
    ],
    applications: [
      { title: "Short-time audio analysis", background: "Speech systems analyze small frames because words change over time. The uncertainty principle explains why very short frames blur pitch.", numbers: "A $25$ ms frame gives best-case $\\Delta f\\ge1/(4\\pi\\cdot0.025)\\approx3.18$ Hz under this convention." },
      { title: "Spectrogram window choice", background: "Spectrograms trade time detail against frequency detail by choosing a window length.", numbers: "At $16$ kHz, a $400$-sample window lasts $400/16000=0.025$ s; a $1600$-sample window lasts $0.1$ s and can support four times finer frequency spread." },
      { title: "Image edge localization", background: "A sharp edge is localized in space, so its Fourier representation needs many spatial frequencies.", numbers: "A feature localized to $\\Delta x=2$ pixels needs $\\Delta k\\ge0.25$ radians per pixel from $\\Delta x\\Delta k\\ge0.5$." },
      { title: "Gabor filters", background: "Gabor filters use Gaussian-windowed sinusoids because Gaussians are optimally concentrated in time and frequency.", numbers: "If a Gabor has $\\Delta t=0.05$ s, equality gives $\\Delta\\omega=10$ rad/s, about $1.59$ Hz." },
      { title: "Radar and sonar pulses", background: "Range resolution wants short pulses, while velocity resolution wants narrow frequency spread. The same Fourier tradeoff appears in sensing.", numbers: "A $1$ ms pulse implies $\\Delta\\omega\\ge500$ rad/s, so $\\Delta f\\ge79.6$ Hz." },
      { title: "Neural time-frequency features", background: "Audio and biosignal models often learn filters that resemble localized wave packets. Their shapes still obey Fourier concentration limits.", numbers: "A learned filter with $\\Delta t=0.02$ s cannot have $\\Delta f$ below $25/(2\\pi)\\approx3.98$ Hz if it is near the minimum." }
    ],
    applicationsClose: "Across audio, images, sensing, and learned filters, the same wisdom holds: sharper location costs broader spectrum.",
    takeaways: [
      "Time spread and frequency spread obey $\\Delta t\\,\\Delta\\omega\\ge\\tfrac12$ under the angular-frequency convention.",
      "Gaussians are the optimally concentrated signals that attain equality.",
      "Changing Fourier conventions changes constants, not the tradeoff.",
      "Window choices in real systems are uncertainty choices in practical form."
    ]
  },

  "math-06-12": {
    id: "math-06-12",
    title: "Sampling and the Nyquist-Shannon theorem",
    tagline: "A band-limited signal can be recovered from samples if you sample faster than twice its highest frequency.",
    connections: {
      buildsOn: ["The uncertainty principle", "Fourier transform", "sine waves"],
      leadsTo: ["The Discrete Fourier Transform (DFT)", "Filtering", "Spectral methods"],
      usedWith: ["band limits", "sinc interpolation", "periodic functions", "frequency spectra"]
    },
    motivation:
      "<p>You already sample the world whenever you take photos, record audio, or log sensor readings. The worry is simple: how many measurements are enough to reconstruct the thing between them?</p>" +
      "<p>The <b>Nyquist-Shannon theorem</b> gives the clean answer for band-limited signals. If no frequency above $B$ Hz is present, sampling above $2B$ Hz preserves the information. Sample too slowly, and high frequencies masquerade as lower ones through aliasing.</p>",
    definition:
      "<p>A continuous signal $x(t)$ is <b>band-limited</b> to $B$ Hz if its Fourier transform is zero for all frequencies with $|f|>B$. If the sampling rate is $f_s>2B$, then $x(t)$ can be reconstructed exactly from samples $x[n]=x(n/f_s)$ by sinc interpolation: $$x(t)=\\sum_{n=-\\infty}^{\\infty}x[n]\\,\\operatorname{sinc}(f_s t-n).$$</p>" +
      "<p>The key reason is spectral replication. Sampling in time copies the spectrum every $f_s$ Hz. If $f_s>2B$, the copies do not overlap, so an ideal low-pass filter can keep the central copy and remove the rest. If copies overlap, aliasing has mixed frequencies irreversibly.</p>" +
      "<p><b>Assumptions that matter:</b> exact recovery requires perfect band limitation, exact samples, infinite sinc interpolation, and an ideal low-pass filter. Real systems approximate this with anti-alias filters and finite windows.</p>",
    worked: {
      problem: "A sensor signal has no frequency above $120$ Hz. What sampling rate is required, and does $200$ Hz sampling avoid aliasing?",
      skills: ["Nyquist rate", "aliasing check", "sampling units"],
      strategy: "Compute twice the highest frequency, then compare the proposed sampling rate with that threshold.",
      steps: [
        { do: "Identify the band limit", result: "$B=120$ Hz", why: "highest present frequency" },
        { do: "Compute the Nyquist rate", result: "$2B=240$ Hz", why: "samples must exceed twice the band limit" },
        { do: "Compare the proposed rate", result: "$200<240$", why: "the sampler is slower than the Nyquist rate" },
        { do: "State the consequence", result: "aliasing can occur", why: "spectral copies overlap when sampling is too slow" },
        { do: "Give a safe example rate", result: "$f_s=250$ Hz", why: "it is greater than $240$ Hz" }
      ],
      verify: "A $120$ Hz sinusoid sampled at $200$ Hz would be above the $100$ Hz Nyquist frequency, so the warning is consistent.",
      answer: "The sampling rate must be greater than $240$ Hz; $200$ Hz is not enough.",
      connects: "Sampling is safe only when the spectrum fits inside half the sampling rate."
    },
    practice: [
      { problem: "Audio is band-limited to $20$ kHz. What minimum sampling rate does the theorem suggest?", steps: [
        { do: "Set the band limit", result: "$B=20000$ Hz", why: "$20$ kHz equals $20000$ Hz" },
        { do: "Double the band limit", result: "$2B=40000$ Hz", why: "Nyquist rate" },
        { do: "State strict condition", result: "$f_s>40000$ Hz", why: "the theorem uses greater than twice the band limit" },
        { do: "Compare with CD audio", result: "$44100>40000$", why: "CD sampling exceeds the threshold" }
      ], answer: "A rate above $40$ kHz is required; $44.1$ kHz satisfies it." },
      { problem: "A $70$ Hz sine wave is sampled at $100$ Hz. What alias frequency appears?", steps: [
        { do: "Find the Nyquist frequency", result: "$f_s/2=50$ Hz", why: "frequencies above this fold" },
        { do: "Subtract from the sampling rate", result: "$100-70=30$ Hz", why: "a frequency between $50$ and $100$ aliases to $f_s-f$" },
        { do: "Check the alias range", result: "$30<50$", why: "the folded frequency lies below Nyquist" },
        { do: "State the observed frequency", result: "$30$ Hz", why: "samples cannot distinguish it from the original" }
      ], answer: "The $70$ Hz sine aliases to $30$ Hz." },
      { problem: "A camera records $60$ frames per second. What is the highest temporal frequency that can be represented without aliasing?", steps: [
        { do: "Identify the sampling rate", result: "$f_s=60$ Hz", why: "frames per second are temporal samples" },
        { do: "Compute half the rate", result: "$f_s/2=30$ Hz", why: "Nyquist frequency" },
        { do: "State the safe band", result: "$B<30$ Hz", why: "strictly below half the sampling rate avoids overlap" },
        { do: "Interpret in motion", result: "fewer than $30$ cycles per second", why: "faster periodic motion can fold" }
      ], answer: "Frequencies below $30$ Hz are representable without aliasing." },
      { problem: "Sampling at $1000$ Hz, a true tone at $620$ Hz is observed. Find its alias below Nyquist.", steps: [
        { do: "Compute the Nyquist frequency", result: "$500$ Hz", why: "$1000/2=500$" },
        { do: "Notice the tone is above Nyquist", result: "$620>500$", why: "folding is needed" },
        { do: "Subtract from the sampling rate", result: "$1000-620=380$ Hz", why: "first folding below Nyquist" },
        { do: "Check the result", result: "$380<500$", why: "the alias is now in the observable band" }
      ], answer: "The tone aliases to $380$ Hz." },
      { problem: "A model consumes sensor data sampled at $256$ Hz after an anti-alias filter with cutoff $90$ Hz. Is the cutoff safe?", steps: [
        { do: "Compute the Nyquist frequency", result: "$256/2=128$ Hz", why: "half the sampling rate" },
        { do: "Compare cutoff to Nyquist", result: "$90<128$", why: "kept frequencies fit below the folding point" },
        { do: "Compute margin", result: "$128-90=38$ Hz", why: "distance from cutoff to Nyquist" },
        { do: "State practical status", result: "safe in principle", why: "a transition band can fit in the margin" }
      ], answer: "Yes. A $90$ Hz cutoff is below the $128$ Hz Nyquist frequency, leaving a $38$ Hz margin." }
    ],
    applications: [
      { title: "Digital audio", background: "Audio systems sample pressure waves. The standard $44.1$ kHz rate was chosen to cover human hearing with room for filtering.", numbers: "For $B=20$ kHz, $2B=40$ kHz, and $44.1$ kHz leaves $4.1$ kHz for a transition band." },
      { title: "Video frame rates", background: "Video samples motion in time. Fast periodic motion can appear to move backward when sampled too slowly.", numbers: "At $24$ fps, the Nyquist temporal frequency is $12$ Hz; a $14$ Hz wheel pattern can alias to $24-14=10$ Hz." },
      { title: "Medical sensors", background: "ECG and EEG pipelines use anti-alias filters before digitization so high-frequency noise does not fold into useful bands.", numbers: "Sampling at $500$ Hz gives Nyquist $250$ Hz, so a $150$ Hz low-pass cutoff is safely below it." },
      { title: "Image sampling", background: "Camera pixels sample a spatial scene. Fine stripes above the pixel Nyquist frequency create moire patterns.", numbers: "With pixel spacing $0.01$ mm, sampling rate is $100$ samples/mm and Nyquist is $50$ cycles/mm." },
      { title: "ML time-series features", background: "Models trained on sampled sensors inherit any aliasing in the data. Good preprocessing protects the learner from false patterns.", numbers: "A $90$ Hz vibration sampled at $100$ Hz appears as $10$ Hz, because $100-90=10$." },
      { title: "Downsampling embeddings or maps", background: "Before reducing resolution, engineers blur or low-pass filter to remove frequencies the coarse grid cannot carry.", numbers: "Downsampling an image by $2$ halves the sampling rate, so the new Nyquist limit is half the old one." }
    ],
    applicationsClose: "Sampling is a promise with conditions: limit the band, sample fast enough, and reconstruction becomes mathematics rather than guesswork.",
    takeaways: [
      "A band-limited signal with maximum frequency $B$ Hz needs sampling rate greater than $2B$ Hz for exact recovery.",
      "Sampling copies the spectrum every $f_s$ Hz; aliasing is overlap between those copies.",
      "Anti-alias filters remove frequencies above the new Nyquist limit before sampling or downsampling.",
      "Real systems approximate the ideal theorem with finite filters and safety margins."
    ]
  },

  "math-06-13": {
    id: "math-06-13",
    title: "The Discrete Fourier Transform (DFT)",
    tagline: "The DFT rewrites a finite list of samples as a finite list of rotating frequency components.",
    connections: {
      buildsOn: ["Sampling and the Nyquist-Shannon theorem", "complex numbers", "orthogonality"],
      leadsTo: ["The Fast Fourier Transform (FFT)", "Filtering", "Spectral methods"],
      usedWith: ["vectors", "inner products", "roots of unity", "matrix multiplication"]
    },
    motivation:
      "<p>You already know a finite signal as a list: four samples, eight samples, a thousand samples. The DFT asks a powerful question: how much of each discrete frequency is hiding in that list?</p>" +
      "<p>The answer is another list. Instead of time samples, it contains frequency coefficients. Each coefficient is an inner product with a rotating complex wave, so the DFT is geometry in a circular basis.</p>",
    definition:
      "<p>For $N$ samples $x_0,x_1,\\ldots,x_{N-1}$, the <b>Discrete Fourier Transform</b> is $$X_k=\\sum_{n=0}^{N-1}x_n e^{-2\\pi i kn/N},\\quad k=0,1,\\ldots,N-1.$$ The inverse transform is $$x_n=\\dfrac1N\\sum_{k=0}^{N-1}X_k e^{2\\pi i kn/N}.$$ Here $n$ indexes time samples, $k$ indexes frequency bins, and $e^{-2\\pi i/N}$ is a root of unity.</p>" +
      "<p>The inverse works because the complex waves are orthogonal: $\\sum_{n=0}^{N-1}e^{2\\pi i(k-m)n/N}=0$ when $k\\ne m$ and equals $N$ when $k=m$. So projecting onto each wave and summing back reconstructs the original vector.</p>" +
      "<p><b>Assumptions that matter:</b> the DFT treats the input as one period of a periodic signal; bin $k$ corresponds to frequency $k f_s/N$ for sampling rate $f_s$; and real-valued inputs have conjugate-symmetric coefficients.</p>",
    worked: {
      problem: "Compute the $4$-point DFT of $x=[1,0,-1,0]$.",
      skills: ["DFT formula", "roots of unity", "complex arithmetic"],
      strategy: "Use $N=4$, so the basis values are powers of $e^{-2\\pi i/4}=-i$.",
      steps: [
        { do: "Set the root of unity", result: "$w=e^{-2\\pi i/4}=-i$", why: "the DFT uses powers of this root" },
        { do: "Compute $X_0$", result: "$1+0-1+0=0$", why: "bin zero sums all samples" },
        { do: "Compute $X_1$", result: "$1+0\\cdot w+(-1)w^2+0\\cdot w^3$", why: "use powers $w^n$" },
        { do: "Simplify $X_1$", result: "$1-(-1)=2$", why: "$w^2=(-i)^2=-1$" },
        { do: "Compute $X_2$", result: "$1+0\\cdot(-1)+(-1)(1)+0\\cdot(-1)=0$", why: "powers of $e^{-\\pi i}$ alternate" },
        { do: "Use symmetry for $X_3$", result: "$X_3=2$", why: "the real even pattern gives matching bins $1$ and $3$" }
      ],
      verify: "The inverse gives $x_0=(0+2+0+2)/4=1$ and $x_2=(0-2+0-2)/4=-1$, matching the original samples.",
      answer: "The DFT is $X=[0,2,0,2]$.",
      connects: "The samples are explained entirely by the two one-cycle directions on a length-four circle."
    },
    practice: [
      { problem: "Compute the $4$-point DFT of $x=[1,1,1,1]$.", steps: [
        { do: "Compute $X_0$", result: "$1+1+1+1=4$", why: "DC is the sum" },
        { do: "Use root cancellation for $X_1$", result: "$1+w+w^2+w^3=0$", why: "all fourth roots sum to zero" },
        { do: "Use alternating powers for $X_2$", result: "$1-1+1-1=0$", why: "the samples are constant" },
        { do: "Use conjugate cancellation for $X_3$", result: "$1+w^3+w^6+w^9=0$", why: "nonzero bins cancel" }
      ], answer: "$X=[4,0,0,0]$." },
      { problem: "Compute the $4$-point DFT of $x=[1,-1,1,-1]$.", steps: [
        { do: "Compute $X_0$", result: "$1-1+1-1=0$", why: "zero average" },
        { do: "Compute $X_1$", result: "$1+(-1)(-i)+1(-1)+(-1)i$", why: "use powers $1,-i,-1,i$" },
        { do: "Simplify $X_1$", result: "$0$", why: "$1-1=0$ and $i-i=0$" },
        { do: "Compute $X_2$", result: "$1+(-1)(-1)+1(1)+(-1)(-1)=4$", why: "bin 2 matches the alternating pattern" },
        { do: "Use symmetry", result: "$X_3=0$", why: "only the Nyquist bin is present" }
      ], answer: "$X=[0,0,4,0]$." },
      { problem: "For $N=8$ and sampling rate $f_s=800$ Hz, what physical frequencies correspond to bins $k=0,1,2,4$?", steps: [
        { do: "Compute bin spacing", result: "$f_s/N=800/8=100$ Hz", why: "adjacent bins are equally spaced" },
        { do: "Map bin $0$", result: "$0\\cdot100=0$ Hz", why: "DC component" },
        { do: "Map bin $1$", result: "$1\\cdot100=100$ Hz", why: "one cycle per $N$ samples" },
        { do: "Map bin $2$", result: "$2\\cdot100=200$ Hz", why: "two cycles per block" },
        { do: "Map bin $4$", result: "$4\\cdot100=400$ Hz", why: "Nyquist frequency for $800$ Hz sampling" }
      ], answer: "The bins correspond to $0$, $100$, $200$, and $400$ Hz." },
      { problem: "Use the inverse DFT to recover $x_0$ from $X=[0,2,0,2]$ with $N=4$.", steps: [
        { do: "Write the inverse at $n=0$", result: "$x_0=\\dfrac14\\sum_{k=0}^{3}X_k e^{0}$", why: "all exponentials equal $1$ at $n=0$" },
        { do: "Substitute coefficients", result: "$x_0=\\dfrac14(0+2+0+2)$", why: "use the given DFT" },
        { do: "Add the numerator", result: "$4$", why: "sum the coefficients" },
        { do: "Divide by $4$", result: "$x_0=1$", why: "inverse DFT normalization" }
      ], answer: "$x_0=1$." },
      { problem: "A real signal has $N=8$ and $X_1=3-4i$. What is $X_7$? What is the magnitude of each?", steps: [
        { do: "Use conjugate symmetry", result: "$X_{N-k}=\\overline{X_k}$", why: "real time-domain samples imply paired coefficients" },
        { do: "Substitute $N=8$ and $k=1$", result: "$X_7=\\overline{X_1}$", why: "$8-1=7$" },
        { do: "Conjugate the value", result: "$X_7=3+4i$", why: "change the sign of the imaginary part" },
        { do: "Compute the magnitude", result: "$|X_1|=\\sqrt{3^2+(-4)^2}=5$", why: "Pythagorean length" },
        { do: "Use equal magnitudes", result: "$|X_7|=5$", why: "conjugates have the same magnitude" }
      ], answer: "$X_7=3+4i$, and both magnitudes are $5$." }
    ],
    applications: [
      { title: "Audio spectrum analysis", background: "Audio editors use the DFT to show which tones are present in a short block.", numbers: "With $N=1024$ at $f_s=44100$ Hz, bin spacing is $44100/1024\\approx43.1$ Hz." },
      { title: "Image frequency content", background: "Images are two-dimensional arrays, and the DFT separates slow gradients from sharp textures.", numbers: "An $8\\times8$ block has $64$ DFT coefficients; the $(0,0)$ coefficient is the sum of all pixel values." },
      { title: "Convolution acceleration", background: "Convolution in time becomes multiplication in frequency, which is useful even before learning the FFT.", numbers: "If two DFT bins are $X_k=2+ i$ and $H_k=3$, the output bin is $Y_k=6+3i$." },
      { title: "Seasonality detection", background: "Time-series analysts use DFT peaks to find repeating patterns in traffic, sales, or sensors.", numbers: "With $N=168$ hourly samples, bin $k=7$ represents $7/168=1/24$ cycles per hour, a daily cycle." },
      { title: "Neural signal features", background: "Brain and wearable models often consume band powers derived from DFT coefficients.", numbers: "If $|X_5|=10$ and $N=100$, a simple normalized power is $10^2/100=1$." },
      { title: "Polynomial and circular structure", background: "The DFT evaluates a polynomial at roots of unity, a viewpoint used in algorithms and numerical math.", numbers: "For samples $[1,2]$, the $2$-point DFT is evaluation at $1$ and $-1$: $3$ and $-1$." }
    ],
    applicationsClose: "The DFT turns finite data into finite frequencies, giving signals, images, and algorithms a common coordinate system.",
    takeaways: [
      "$X_k=\\sum_{n=0}^{N-1}x_n e^{-2\\pi i kn/N}$ projects samples onto discrete complex waves.",
      "The inverse DFT reconstructs samples by averaging frequency coefficients with opposite rotations.",
      "Bin spacing is $f_s/N$, and real signals have conjugate-symmetric spectra.",
      "The DFT treats a finite block as one period of a periodic signal."
    ]
  },

  "math-06-14": {
    id: "math-06-14",
    title: "The Fast Fourier Transform (FFT)",
    tagline: "The FFT computes the same DFT by reusing symmetry instead of doing every sum from scratch.",
    connections: {
      buildsOn: ["The Discrete Fourier Transform (DFT)", "recursion", "roots of unity"],
      leadsTo: ["Filtering", "Spectral methods", "Convolutions in CNNs & spectral architectures"],
      usedWith: ["divide and conquer", "matrix factorization", "complex multiplication", "polynomial multiplication"]
    },
    motivation:
      "<p>You already know the DFT formula, but computing it directly is expensive. For $N$ samples, each of $N$ output bins sums $N$ terms, so the direct method needs about $N^2$ work.</p>" +
      "<p>The <b>Fast Fourier Transform</b> keeps the same mathematical answer and changes the route. It splits even and odd samples, reuses smaller DFTs, and stitches them together with roots of unity. That turns a beautiful transform into a practical engine.</p>",
    definition:
      "<p>For even $N$, write the DFT sum as even-indexed plus odd-indexed samples: $$X_k=\\sum_{m=0}^{N/2-1}x_{2m}e^{-2\\pi i km/(N/2)}+e^{-2\\pi i k/N}\\sum_{m=0}^{N/2-1}x_{2m+1}e^{-2\\pi i km/(N/2)}.$$ If $E_k$ is the DFT of the even samples and $O_k$ is the DFT of the odd samples, then $X_k=E_k+w_N^k O_k$ and $X_{k+N/2}=E_k-w_N^k O_k$, where $w_N=e^{-2\\pi i/N}$.</p>" +
      "<p>This identity is the butterfly. Repeating the split for powers of two gives $O(N\\log_2 N)$ work instead of $O(N^2)$, because there are $\\log_2 N$ stages and about $N$ operations per stage.</p>" +
      "<p><b>Assumptions that matter:</b> the classic radix-2 FFT is simplest when $N$ is a power of two; the output is the exact DFT up to floating-point roundoff; and different libraries choose different normalization conventions for forward and inverse transforms.</p>",
    worked: {
      problem: "Estimate the operation-count improvement for an FFT versus a direct DFT when $N=1024$.",
      skills: ["complexity", "logarithms", "orders of growth"],
      strategy: "Compare $N^2$ direct work with $N\\log_2N$ FFT work using powers of two.",
      steps: [
        { do: "Compute direct DFT scale", result: "$N^2=1024^2=1,048,576$", why: "there are $N$ bins with $N$ terms each" },
        { do: "Compute the logarithm", result: "$\\log_2 1024=10$", why: "$1024=2^{10}$" },
        { do: "Compute FFT scale", result: "$N\\log_2N=1024\\cdot10=10,240$", why: "ten butterfly stages" },
        { do: "Divide the work estimates", result: "$1,048,576/10,240=102.4$", why: "compare direct to fast" },
        { do: "Interpret", result: "about $100$ times fewer basic operations", why: "constant factors vary, but the scaling advantage is large" }
      ],
      verify: "The ratio grows with $N$; for small $N$ overhead can matter, but at $1024$ the asymptotic win is already visible.",
      answer: "The FFT estimate is about $10,240$ units versus $1,048,576$ for direct DFT, roughly a $102$ times improvement.",
      connects: "The FFT is the DFT plus divide-and-conquer reuse."
    },
    practice: [
      { problem: "For $N=8$, compare $N^2$ and $N\\log_2N$.", steps: [
        { do: "Compute direct work", result: "$8^2=64$", why: "direct DFT scale" },
        { do: "Compute logarithm", result: "$\\log_2 8=3$", why: "$8=2^3$" },
        { do: "Compute FFT work", result: "$8\\cdot3=24$", why: "three stages" },
        { do: "Compute the ratio", result: "$64/24\\approx2.67$", why: "direct work divided by FFT work" }
      ], answer: "Direct scale is $64$; FFT scale is $24$, about $2.67$ times smaller." },
      { problem: "For $N=4096$, compute $N\\log_2N$.", steps: [
        { do: "Recognize the power", result: "$4096=2^{12}$", why: "powers of two are FFT-friendly" },
        { do: "Find the logarithm", result: "$\\log_2 4096=12$", why: "exponent of two" },
        { do: "Multiply", result: "$4096\\cdot12=49,152$", why: "FFT scale" },
        { do: "Compare to direct scale", result: "$4096^2=16,777,216$", why: "direct DFT scale" }
      ], answer: "$N\\log_2N=49,152$, much smaller than $16,777,216$." },
      { problem: "Use one butterfly with $E=5$, $O=2$, and twiddle factor $w=1$ to compute two outputs.", steps: [
        { do: "Write the butterfly formulas", result: "$X_{top}=E+wO$, $X_{bottom}=E-wO$", why: "combine even and odd DFTs" },
        { do: "Substitute values", result: "$X_{top}=5+1\\cdot2$", why: "top output" },
        { do: "Simplify top", result: "$X_{top}=7$", why: "add" },
        { do: "Compute bottom", result: "$X_{bottom}=5-1\\cdot2=3$", why: "subtract" }
      ], answer: "The butterfly outputs are $7$ and $3$." },
      { problem: "Use one butterfly with $E=3+i$, $O=1-i$, and $w=-i$.", steps: [
        { do: "Multiply the twiddle and odd value", result: "$wO=(-i)(1-i)$", why: "butterfly needs $wO$" },
        { do: "Simplify the product", result: "$wO=-1-i$", why: "$-i+i^2=-i-1$" },
        { do: "Compute the top output", result: "$E+wO=(3+i)+(-1-i)=2$", why: "add complex numbers" },
        { do: "Compute the bottom output", result: "$E-wO=(3+i)-(-1-i)=4+2i$", why: "subtract complex numbers" }
      ], answer: "The butterfly outputs are $2$ and $4+2i$." },
      { problem: "A convolution uses FFTs of length $2048$. Estimate direct circular convolution work $N^2$ versus FFT-based work $3N\\log_2N$ for two forward FFTs and one inverse FFT.", steps: [
        { do: "Compute direct scale", result: "$2048^2=4,194,304$", why: "direct circular convolution has quadratic scale" },
        { do: "Compute the logarithm", result: "$\\log_2 2048=11$", why: "$2048=2^{11}$" },
        { do: "Compute one FFT scale", result: "$2048\\cdot11=22,528$", why: "one transform" },
        { do: "Compute three-transform scale", result: "$3\\cdot22,528=67,584$", why: "two forward transforms and one inverse transform" },
        { do: "Compare", result: "$4,194,304/67,584\\approx62.1$", why: "rough speedup estimate" }
      ], answer: "The FFT-based estimate is $67,584$ versus $4,194,304$, about $62$ times smaller." }
    ],
    applications: [
      { title: "Fast spectrograms", background: "Speech and music systems compute thousands of DFTs. The FFT makes real-time spectrograms possible.", numbers: "A $1024$-point frame drops from about $1,048,576$ direct units to $10,240$ FFT units." },
      { title: "Fast convolution", background: "Long filters can be applied by transforming, multiplying bins, and transforming back.", numbers: "For length $2048$, three FFTs cost about $67,584$ scale units, far below $4,194,304$ direct units." },
      { title: "Polynomial multiplication", background: "The FFT multiplies polynomials by evaluating at roots of unity, multiplying values, and interpolating.", numbers: "Multiplying two degree-$1023$ polynomials needs a transform length at least $2048$." },
      { title: "Image compression", background: "Frequency transforms expose smooth image structure. Although JPEG uses DCT rather than DFT, the fast-transform idea is the same family.", numbers: "An $8\\times8$ block has $64$ coefficients; fast separable transforms work row by row and column by column." },
      { title: "Scientific simulation", background: "Many PDE solvers repeatedly move between physical and spectral grids. FFT speed makes those loops practical.", numbers: "A $1024\\times1024$ two-dimensional FFT costs on the order of $2N^2\\log_2N\\approx20,971,520$ one-dimensional units." },
      { title: "ML feature pipelines", background: "Audio, vibration, and biosignal models often compute FFT features before classification.", numbers: "At $100$ frames per second with $512$-point FFTs, the scale is $100\\cdot512\\cdot9=460,800$ units per second." }
    ],
    applicationsClose: "The FFT is a lesson in mathematical engineering: the same transform becomes powerful when symmetry is used instead of ignored.",
    takeaways: [
      "The FFT computes the DFT, not an approximation to a different transform.",
      "Radix-2 FFT splits even and odd samples and combines them with butterfly operations.",
      "The work drops from $O(N^2)$ to $O(N\\log N)$.",
      "Fast transforms power spectra, convolution, compression, and numerical simulation."
    ]
  },

  "math-06-15": {
    id: "math-06-15",
    title: "The Laplace connection (s = iω)",
    tagline: "Laplace and Fourier transforms are two views of exponential probing: one allows growth and decay, the other stays on the oscillatory axis.",
    connections: {
      buildsOn: ["Fourier transform", "complex exponentials", "The Laplace transform"],
      leadsTo: ["Filtering", "Spectral methods", "stability analysis"],
      usedWith: ["complex plane", "poles", "regions of convergence", "differential equations"]
    },
    motivation:
      "<p>You already know Fourier analysis tests a signal against pure rotations $e^{-i\\omega t}$. Laplace analysis tests against $e^{-st}$, where $s$ can include both decay and rotation.</p>" +
      "<p>The connection is beautifully simple: setting $s=i\\omega$ puts Laplace on the imaginary axis and recovers the Fourier transform when convergence allows it. The extra real part of $s$ is like adding damping before listening for frequency.</p>",
    definition:
      "<p>The one-sided Laplace transform of $x(t)$ is $X(s)=\\int_0^{\\infty}x(t)e^{-st}\\,dt$, where $s=\\sigma+i\\omega$ is complex. The Fourier transform on $[0,\\infty)$ is obtained formally by $s=i\\omega$: $X(i\\omega)=\\int_0^{\\infty}x(t)e^{-i\\omega t}\\,dt$.</p>" +
      "<p>The real part $\\sigma$ controls exponential damping because $e^{-st}=e^{-\\sigma t}e^{-i\\omega t}$. If a signal grows or decays, the Laplace transform may converge only in a <b>region of convergence</b>. The Fourier transform exists when the imaginary axis lies inside that region, or under a suitable generalized interpretation.</p>" +
      "<p><b>Assumptions that matter:</b> one-sided and two-sided transforms have different definitions; $s=i\\omega$ is valid only when the integral or transfer function is well-defined on the imaginary axis; and poles on the imaginary axis often signal non-decaying oscillation rather than ordinary absolute convergence.</p>",
    worked: {
      problem: "For $x(t)=e^{-2t}$ for $t\\ge0$, compute $X(s)$ and then evaluate $X(i\\omega)$.",
      skills: ["Laplace transform", "complex substitution", "frequency response"],
      strategy: "Integrate the damped exponential, then place $s$ on the imaginary axis.",
      steps: [
        { do: "Write the Laplace integral", result: "$X(s)=\\int_0^{\\infty}e^{-2t}e^{-st}\\,dt$", why: "insert the signal into the definition" },
        { do: "Combine exponentials", result: "$X(s)=\\int_0^{\\infty}e^{-(s+2)t}\\,dt$", why: "exponents add" },
        { do: "Integrate", result: "$X(s)=\\dfrac{1}{s+2}$", why: "the integral of a decaying exponential is reciprocal of its rate" },
        { do: "State convergence", result: "$\\operatorname{Re}(s)>-2$", why: "the real decay rate must be positive" },
        { do: "Substitute $s=i\\omega$", result: "$X(i\\omega)=\\dfrac{1}{2+i\\omega}$", why: "Fourier response lies on the imaginary axis" },
        { do: "Compute magnitude", result: "$|X(i\\omega)|=\\dfrac{1}{\\sqrt{4+\\omega^2}}$", why: "magnitude of $2+i\\omega$ is $\\sqrt{4+\\omega^2}$" }
      ],
      verify: "At $\\omega=0$, the response is $1/2$, equal to the area under $e^{-2t}$, so the formula passes a basic check.",
      answer: "$X(s)=1/(s+2)$ for $\\operatorname{Re}(s)>-2$, and $X(i\\omega)=1/(2+i\\omega)$.",
      connects: "Laplace reveals the pole at $s=-2$; Fourier reads the same system along the imaginary axis."
    },
    practice: [
      { problem: "For $x(t)=e^{-3t}$ on $t\\ge0$, find $X(s)$ and $X(i\\omega)$.", steps: [
        { do: "Write the integral", result: "$X(s)=\\int_0^{\\infty}e^{-(s+3)t}\\,dt$", why: "combine $e^{-3t}$ with $e^{-st}$" },
        { do: "Integrate", result: "$X(s)=\\dfrac{1}{s+3}$", why: "reciprocal of decay rate" },
        { do: "State convergence", result: "$\\operatorname{Re}(s)>-3$", why: "the exponential must decay" },
        { do: "Set $s=i\\omega$", result: "$X(i\\omega)=\\dfrac{1}{3+i\\omega}$", why: "Fourier connection" }
      ], answer: "$X(s)=1/(s+3)$ and $X(i\\omega)=1/(3+i\\omega)$." },
      { problem: "For transfer function $H(s)=1/(s+5)$, compute the gain $|H(i\\omega)|$ at $\\omega=0$ and $\\omega=5$.", steps: [
        { do: "Substitute $s=i\\omega$", result: "$H(i\\omega)=1/(5+i\\omega)$", why: "frequency response" },
        { do: "Write the magnitude", result: "$|H(i\\omega)|=1/\\sqrt{25+\\omega^2}$", why: "magnitude of complex denominator" },
        { do: "Evaluate at $\\omega=0$", result: "$|H(0)|=1/5=0.2$", why: "zero frequency" },
        { do: "Evaluate at $\\omega=5$", result: "$|H(5i)|=1/\\sqrt{50}\\approx0.141$", why: "$25+25=50$" }
      ], answer: "The gains are $0.2$ at $\\omega=0$ and about $0.141$ at $\\omega=5$." },
      { problem: "Does $x(t)=e^{2t}$ on $t\\ge0$ have an ordinary Fourier transform by setting $s=i\\omega$?", steps: [
        { do: "Compute the Laplace form", result: "$X(s)=\\int_0^{\\infty}e^{(2-s)t}\\,dt$", why: "insert the growing signal" },
        { do: "State convergence condition", result: "$\\operatorname{Re}(s)>2$", why: "damping must beat growth" },
        { do: "Locate the imaginary axis", result: "$\\operatorname{Re}(i\\omega)=0$", why: "pure oscillation has no damping" },
        { do: "Compare to the region", result: "$0\\not>2$", why: "the imaginary axis is outside the region of convergence" },
        { do: "Conclude", result: "ordinary Fourier transform does not converge", why: "the signal grows without decay" }
      ], answer: "No. The imaginary axis is outside the region of convergence." },
      { problem: "For $H(s)=\\dfrac{2}{s^2+3s+2}$, factor the denominator and list the poles.", steps: [
        { do: "Factor the quadratic", result: "$s^2+3s+2=(s+1)(s+2)$", why: "find pole locations" },
        { do: "Rewrite the transfer function", result: "$H(s)=\\dfrac{2}{(s+1)(s+2)}$", why: "factored form exposes poles" },
        { do: "Set first factor to zero", result: "$s=-1$", why: "denominator zero" },
        { do: "Set second factor to zero", result: "$s=-2$", why: "denominator zero" },
        { do: "Interpret stability", result: "both poles have negative real part", why: "responses decay in time" }
      ], answer: "The poles are $s=-1$ and $s=-2$." },
      { problem: "For $H(s)=1/(s+2)$, find the angular frequency where the gain drops to $1/\\sqrt{8}$.", steps: [
        { do: "Write the gain", result: "$|H(i\\omega)|=1/\\sqrt{4+\\omega^2}$", why: "substitute $s=i\\omega$" },
        { do: "Set the target gain", result: "$1/\\sqrt{4+\\omega^2}=1/\\sqrt8$", why: "use the requested value" },
        { do: "Equate denominators", result: "$4+\\omega^2=8$", why: "positive square roots match" },
        { do: "Solve for $\\omega^2$", result: "$\\omega^2=4$", why: "subtract $4$" },
        { do: "Take the nonnegative frequency", result: "$\\omega=2$ rad/s", why: "frequency magnitude is nonnegative" }
      ], answer: "The gain is $1/\\sqrt8$ at $\\omega=2$ rad/s." }
    ],
    applications: [
      { title: "Control-system frequency response", background: "Engineers design controllers in the $s$-plane, then inspect behavior on $s=i\\omega$ to see sinusoidal gain.", numbers: "For $H(s)=1/(s+10)$, DC gain is $0.1$ and gain at $\\omega=10$ is $1/\\sqrt{200}\\approx0.0707$." },
      { title: "Low-pass filters", background: "Simple exponential impulse responses produce first-order low-pass filters.", numbers: "Impulse response $e^{-5t}$ gives $H(i\\omega)=1/(5+i\\omega)$, with gain $0.2$ at $\\omega=0$." },
      { title: "Stability from poles", background: "Laplace poles show whether system modes decay, persist, or grow.", numbers: "A pole at $s=-3$ gives factor $e^{-3t}$, so after $2$ seconds the amplitude is $e^{-6}\\approx0.00248$." },
      { title: "Damped oscillations", background: "A damped sinusoid has poles with negative real parts and imaginary oscillation rates.", numbers: "Poles $-1\\pm4i$ correspond to decay $e^{-t}$ and angular frequency $4$ rad/s." },
      { title: "Optimization dynamics", background: "Linearized training dynamics can be studied like systems: eigenvalues with negative real parts decay.", numbers: "Mode $e^{-0.5t}$ drops to $e^{-5}\\approx0.0067$ after $10$ time units." },
      { title: "Signal modeling", background: "Autoregressive and state-space models use pole locations to control smoothness and oscillation.", numbers: "A continuous pole at $-2$ sampled every $0.1$ s maps to discrete factor $e^{-0.2}\\approx0.819$." }
    ],
    applicationsClose: "Laplace gives the whole complex landscape; Fourier is the important walk along the oscillatory axis.",
    takeaways: [
      "Setting $s=i\\omega$ connects Laplace transforms to Fourier frequency response when convergence permits.",
      "The real part of $s$ supplies damping or growth; the imaginary part supplies oscillation.",
      "Regions of convergence decide whether the imaginary axis is allowed.",
      "Poles explain decay, stability, and resonance."
    ]
  },

  "math-06-16": {
    id: "math-06-16",
    title: "Wavelets",
    tagline: "Wavelets analyze signals with small localized waves, giving time and scale information together.",
    connections: {
      buildsOn: ["The uncertainty principle", "Fourier transform", "orthonormal bases"],
      leadsTo: ["Filtering", "Spectral methods", "Convolutions in CNNs & spectral architectures"],
      usedWith: ["multiresolution analysis", "inner products", "basis expansions", "dyadic scaling"]
    },
    motivation:
      "<p>Fourier analysis is wonderful for steady tones, but many signals are not steady. A word begins and ends, an edge appears at one location, a sensor spike lasts for a moment. We want frequency information without losing place.</p>" +
      "<p><b>Wavelets</b> answer with short waves that can shift and stretch. Wide wavelets see slow trends; narrow wavelets see sharp details. The result is a multiscale map of where patterns live.</p>",
    definition:
      "<p>A wavelet family is built from a mother wavelet $\\psi(t)$ by scaling and shifting: $\\psi_{a,b}(t)=\\dfrac{1}{\\sqrt{|a|}}\\psi\\left(\\dfrac{t-b}{a}\\right)$, where $a$ controls scale and $b$ controls location. The continuous wavelet transform is $W(a,b)=\\int x(t)\\overline{\\psi_{a,b}(t)}\\,dt$.</p>" +
      "<p>The discrete wavelet transform often uses dyadic scales $a=2^j$ and shifts $b=k2^j$. For the Haar wavelet, averages capture coarse structure and differences capture detail. Repeating this split gives a multiresolution representation.</p>" +
      "<p><b>Assumptions that matter:</b> useful wavelets have finite energy and usually zero mean; orthonormal discrete wavelets require carefully matched scaling and wavelet filters; and boundary handling matters for finite signals.</p>",
    worked: {
      problem: "Compute one-level Haar averages and details for $x=[4,6,10,14]$ using average $(a+b)/2$ and detail $(a-b)/2$ for each pair.",
      skills: ["Haar transform", "averages", "details"],
      strategy: "Pair neighboring samples, compute coarse averages, then compute local differences.",
      steps: [
        { do: "Pair the samples", result: "$(4,6)$ and $(10,14)$", why: "one-level Haar works on adjacent pairs" },
        { do: "Average the first pair", result: "$(4+6)/2=5$", why: "coarse value for the first location" },
        { do: "Compute the first detail", result: "$(4-6)/2=-1$", why: "signed difference within the first pair" },
        { do: "Average the second pair", result: "$(10+14)/2=12$", why: "coarse value for the second location" },
        { do: "Compute the second detail", result: "$(10-14)/2=-2$", why: "signed difference within the second pair" },
        { do: "List coefficients", result: "averages $[5,12]$, details $[-1,-2]$", why: "separate smooth trend from local changes" }
      ],
      verify: "Reconstruction works: $5+(-1)=4$, $5-(-1)=6$, $12+(-2)=10$, and $12-(-2)=14$.",
      answer: "The one-level Haar coefficients are averages $[5,12]$ and details $[-1,-2]$.",
      connects: "Wavelets store both where a change occurs and the scale of the change."
    },
    practice: [
      { problem: "Compute one-level Haar averages and details for $x=[8,4,6,6]$.", steps: [
        { do: "Pair the samples", result: "$(8,4)$ and $(6,6)$", why: "use adjacent pairs" },
        { do: "Average first pair", result: "$(8+4)/2=6$", why: "coarse coefficient" },
        { do: "Detail first pair", result: "$(8-4)/2=2$", why: "local difference" },
        { do: "Average second pair", result: "$(6+6)/2=6$", why: "coarse coefficient" },
        { do: "Detail second pair", result: "$(6-6)/2=0$", why: "no local change" }
      ], answer: "Averages $[6,6]$, details $[2,0]$." },
      { problem: "Reconstruct a pair from Haar average $7$ and detail $-3$.", steps: [
        { do: "Use reconstruction for the first value", result: "$a+d=7+(-3)=4$", why: "average plus detail recovers the left sample" },
        { do: "Use reconstruction for the second value", result: "$a-d=7-(-3)=10$", why: "average minus detail recovers the right sample" },
        { do: "Check the average", result: "$(4+10)/2=7$", why: "matches the given average" },
        { do: "Check the detail", result: "$(4-10)/2=-3$", why: "matches the given detail" }
      ], answer: "The reconstructed pair is $[4,10]$." },
      { problem: "Compute two-level Haar coefficients for $x=[2,4,6,8]$ using the same average-detail convention.", steps: [
        { do: "Compute first pair average and detail", result: "$3$ and $-1$", why: "$(2+4)/2=3$, $(2-4)/2=-1$" },
        { do: "Compute second pair average and detail", result: "$7$ and $-1$", why: "$(6+8)/2=7$, $(6-8)/2=-1$" },
        { do: "Pair the coarse averages", result: "$(3,7)$", why: "second level transforms the coarse trend" },
        { do: "Compute second-level average", result: "$(3+7)/2=5$", why: "global coarse value" },
        { do: "Compute second-level detail", result: "$(3-7)/2=-2$", why: "coarse-scale change" }
      ], answer: "Two-level coefficients are global average $5$, coarse detail $-2$, and fine details $[-1,-1]$." },
      { problem: "A detail coefficient is $0$ for pair $(a,b)$. What relation must $a$ and $b$ satisfy?", steps: [
        { do: "Write the detail formula", result: "$(a-b)/2=0$", why: "Haar detail is half the difference" },
        { do: "Multiply by $2$", result: "$a-b=0$", why: "remove the denominator" },
        { do: "Solve for equality", result: "$a=b$", why: "add $b$ to both sides" },
        { do: "Interpret", result: "the pair is locally constant", why: "zero detail means no within-pair change" }
      ], answer: "The samples must be equal: $a=b$." },
      { problem: "A denoising step keeps average $10$ and changes detail from $3$ to $0$. Reconstruct before and after thresholding.", steps: [
        { do: "Reconstruct before thresholding", result: "$[10+3,10-3]=[13,7]$", why: "average plus and minus detail" },
        { do: "Set the thresholded detail", result: "$d=0$", why: "small detail removed" },
        { do: "Reconstruct after thresholding", result: "$[10+0,10-0]=[10,10]$", why: "the pair becomes smooth" },
        { do: "Compare changes", result: "$13\\mapsto10$ and $7\\mapsto10$", why: "detail removal reduces local variation" }
      ], answer: "Before thresholding the pair is $[13,7]$; after thresholding it is $[10,10]$." }
    ],
    applications: [
      { title: "Image compression", background: "Wavelet compression keeps large coarse and edge coefficients while discarding tiny details. JPEG 2000 uses this multiresolution idea.", numbers: "If $1000$ coefficients are stored and $850$ small ones are set to zero, only $150$ remain, a $6.67$ to $1$ sparsity ratio." },
      { title: "Denoising", background: "Noise often appears as many small high-frequency coefficients. Thresholding details can reduce noise while preserving larger structures.", numbers: "A detail $0.03$ is removed by threshold $0.05$, while detail $0.20$ is kept." },
      { title: "Edge detection", background: "Haar details are large where neighboring values change suddenly, so they locate edges.", numbers: "Pair $(20,80)$ has detail $(20-80)/2=-30$, much larger than pair $(20,22)$ with detail $-1$." },
      { title: "Time-frequency audio", background: "Wavelets use short windows at high frequencies and long windows at low frequencies, matching many natural signals.", numbers: "At scale $a=4$, a base $10$ ms wavelet covers about $40$ ms." },
      { title: "Graph and geometric ML", background: "Wavelet-like bases on graphs capture local neighborhoods at multiple scales.", numbers: "A two-hop scale around a node with degrees $3$ and $4$ can aggregate up to $1+3+12=16$ local positions in a simple tree-like count." },
      { title: "Feature pyramids", background: "Computer vision models use multiscale representations that echo wavelet thinking: coarse context plus fine detail.", numbers: "An image pyramid from $256\\times256$ to $128\\times128$ to $64\\times64$ has $65,536+16,384+4,096=86,016$ spatial locations." }
    ],
    applicationsClose: "Wavelets keep the local story: what scale, what location, and how strong the change is.",
    takeaways: [
      "Wavelets are shifted and scaled versions of a mother wavelet.",
      "Haar wavelets split data into averages and details.",
      "Multiresolution analysis separates coarse trend from fine changes.",
      "Wavelets are useful when frequency content changes over time or space."
    ]
  },

  "math-06-17": {
    id: "math-06-17",
    title: "Filtering",
    tagline: "Filtering keeps the parts of a signal you want and suppresses the parts you do not.",
    connections: {
      buildsOn: ["The Discrete Fourier Transform (DFT)", "The Laplace connection (s = iω)", "convolution"],
      leadsTo: ["Spectral methods", "Convolutions in CNNs & spectral architectures", "signal denoising"],
      usedWith: ["convolution", "frequency response", "transfer functions", "z-transforms"]
    },
    motivation:
      "<p>You already filter informally when you ignore background noise and listen for a voice. Mathematically, a filter is a rule that changes a signal so some patterns remain and others shrink.</p>" +
      "<p>Fourier analysis makes filtering especially clear: convolution in time becomes multiplication in frequency. A low-pass filter keeps slow variation; a high-pass filter keeps rapid changes; a band-pass filter keeps a chosen range.</p>",
    definition:
      "<p>For a discrete signal $x[n]$ and impulse response $h[n]$, linear time-invariant filtering is convolution: $y[n]=\\sum_m h[m]x[n-m]$. In the frequency domain, the DFT gives $Y_k=H_kX_k$, where $H_k$ is the filter's frequency response.</p>" +
      "<p>The multiplication rule follows from shifting complex exponentials: if the input is $e^{i\\omega n}$, convolution with $h$ returns the same exponential times $H(\\omega)=\\sum_m h[m]e^{-i\\omega m}$. So complex waves are eigenvectors of filtering.</p>" +
      "<p><b>Assumptions that matter:</b> ordinary DFT multiplication corresponds to circular convolution unless padding is used; stable filters have summable impulse responses in the infinite case; and causal real-time filters can only use present and past samples.</p>",
    worked: {
      problem: "Apply the moving-average filter $h=[\\tfrac12,\\tfrac12]$ to $x=[2,6,10]$ using valid convolution positions.",
      skills: ["convolution", "moving averages", "filter interpretation"],
      strategy: "Slide the two-tap filter over adjacent pairs and average each pair.",
      steps: [
        { do: "Place the filter on the first pair", result: "$(2,6)$", why: "valid convolution uses full overlap" },
        { do: "Compute first output", result: "$\\tfrac12\\cdot2+\\tfrac12\\cdot6=4$", why: "average the adjacent samples" },
        { do: "Place the filter on the second pair", result: "$(6,10)$", why: "slide one sample" },
        { do: "Compute second output", result: "$\\tfrac12\\cdot6+\\tfrac12\\cdot10=8$", why: "average the next adjacent samples" },
        { do: "List the output", result: "$y=[4,8]$", why: "valid filtering produces two positions" }
      ],
      verify: "The output is smoother than the input: the jump from $2$ to $10$ becomes values centered between neighbors.",
      answer: "$y=[4,8]$.",
      connects: "A moving average is a low-pass filter because it suppresses rapid sample-to-sample changes."
    },
    practice: [
      { problem: "Apply the difference filter $h=[1,-1]$ to $x=[3,7,6,10]$ using valid positions.", steps: [
        { do: "Use the first pair", result: "$(3,7)$", why: "first full overlap" },
        { do: "Compute first output", result: "$1\\cdot3-1\\cdot7=-4$", why: "difference filter" },
        { do: "Use the second pair", result: "$(7,6)$", why: "slide one sample" },
        { do: "Compute second output", result: "$7-6=1$", why: "local change" },
        { do: "Use the third pair", result: "$6-10=-4$", why: "last full overlap" }
      ], answer: "The valid output is $[-4,1,-4]$." },
      { problem: "A frequency bin has $X_k=5$ and a filter has $H_k=0.2$. What is $Y_k$?", steps: [
        { do: "Write the frequency-domain rule", result: "$Y_k=H_kX_k$", why: "filtering multiplies spectra" },
        { do: "Substitute values", result: "$Y_k=0.2\\cdot5$", why: "use the given bin and response" },
        { do: "Multiply", result: "$Y_k=1$", why: "the filter attenuates this bin" },
        { do: "Interpret gain", result: "amplitude reduced by factor $5$", why: "$0.2=1/5$" }
      ], answer: "$Y_k=1$." },
      { problem: "For moving average $h=[1/3,1/3,1/3]$, apply valid filtering to $x=[3,6,9,12]$.", steps: [
        { do: "Use first length-three window", result: "$[3,6,9]$", why: "filter length is three" },
        { do: "Compute first output", result: "$(3+6+9)/3=6$", why: "average" },
        { do: "Use second window", result: "$[6,9,12]$", why: "slide one sample" },
        { do: "Compute second output", result: "$(6+9+12)/3=9$", why: "average" },
        { do: "List output", result: "$[6,9]$", why: "two valid positions" }
      ], answer: "The valid filtered output is $[6,9]$." },
      { problem: "A first-order low-pass has gain $|H(i\\omega)|=1/\\sqrt{1+(\\omega/10)^2}$. Compute gains at $\\omega=0$ and $\\omega=10$.", steps: [
        { do: "Evaluate at zero", result: "$|H(0)|=1/\\sqrt{1+0}=1$", why: "DC passes fully" },
        { do: "Substitute $\\omega=10$", result: "$1/\\sqrt{1+(10/10)^2}$", why: "use the cutoff scale" },
        { do: "Simplify the denominator", result: "$1/\\sqrt2$", why: "$1+1=2$" },
        { do: "Approximate", result: "$0.707$", why: "$1/\\sqrt2\\approx0.707$" }
      ], answer: "The gains are $1$ at $0$ rad/s and about $0.707$ at $10$ rad/s." },
      { problem: "A noisy DFT has magnitudes $[20,8,2,1]$. A low-pass mask keeps bins $0$ and $1$ and zeros bins $2$ and $3$. What are the output magnitudes?", steps: [
        { do: "Write the mask", result: "$H=[1,1,0,0]$", why: "kept bins have gain one and removed bins gain zero" },
        { do: "Multiply bin $0$", result: "$20\\cdot1=20$", why: "DC kept" },
        { do: "Multiply bin $1$", result: "$8\\cdot1=8$", why: "low frequency kept" },
        { do: "Multiply bin $2$", result: "$2\\cdot0=0$", why: "high frequency removed" },
        { do: "Multiply bin $3$", result: "$1\\cdot0=0$", why: "high frequency removed" }
      ], answer: "The output magnitudes are $[20,8,0,0]$." }
    ],
    applications: [
      { title: "Audio denoising", background: "Low-pass and band-pass filters reduce hiss or isolate speech bands.", numbers: "At $16$ kHz sampling, keeping below $4$ kHz retains bins with frequency $k\\cdot16000/N<4000$, so for $N=1024$ keep roughly $k<256$." },
      { title: "Image blur", background: "Blurring is low-pass filtering in space. Averaging neighboring pixels removes high-frequency texture.", numbers: "A $3\\times3$ box blur replaces a patch sum $900$ by $900/9=100$ at the center." },
      { title: "Edge detection", background: "High-pass filters emphasize rapid changes, which often correspond to edges.", numbers: "A one-dimensional difference on values $[20,80]$ gives $60$, while $[20,22]$ gives $2$." },
      { title: "Anti-alias preprocessing", background: "Before downsampling, filters remove frequencies that the lower sampling rate cannot represent.", numbers: "Downsampling from $1000$ Hz to $250$ Hz requires a cutoff below $125$ Hz." },
      { title: "Exponential smoothing", background: "Streaming systems often smooth a measurement with a one-pole filter.", numbers: "With $y_t=0.8y_{t-1}+0.2x_t$, a new sample $x_t=10$ and old state $5$ gives $y_t=6$." },
      { title: "CNN kernels as learned filters", background: "Convolutional networks learn spatial filters rather than hand-designing them.", numbers: "A $3\\times3$ kernel with all entries $1/9$ applied to a patch summing to $45$ outputs $5$." }
    ],
    applicationsClose: "Filtering is selection by structure: smooth what should be smooth, sharpen what should be sharp, and remove what does not belong.",
    takeaways: [
      "Linear time-invariant filtering is convolution in time or multiplication in frequency.",
      "Low-pass filters keep slow variation; high-pass filters keep rapid changes.",
      "DFT-based filtering must handle circular convolution and padding carefully.",
      "Many ML kernels are learned filters with data-chosen coefficients."
    ]
  },

  "math-06-18": {
    id: "math-06-18",
    title: "Spectral methods",
    tagline: "Spectral methods solve problems by moving into a basis where global patterns become simple coefficients.",
    connections: {
      buildsOn: ["Filtering", "The Fast Fourier Transform (FFT)", "eigenvectors"],
      leadsTo: ["Convolutions in CNNs & spectral architectures", "PDE solvers", "graph Fourier analysis"],
      usedWith: ["orthogonal bases", "eigenvalues", "differential equations", "linear operators"]
    },
    motivation:
      "<p>You already saw that Fourier modes simplify filtering because each mode is multiplied by a gain. Spectral methods push that idea further: choose a basis where the operator itself becomes easy.</p>" +
      "<p>For derivatives, waves are especially friendly. Differentiating $e^{ikx}$ just multiplies by $ik$. That turns some differential equations into algebraic equations for coefficients.</p>",
    definition:
      "<p>A <b>spectral method</b> approximates a function as $u(x)\\approx\\sum_k \\widehat u_k\\phi_k(x)$ using global basis functions such as Fourier modes, Chebyshev polynomials, or eigenvectors of a graph Laplacian. Operators are applied to coefficients whenever the basis diagonalizes or nearly diagonalizes the operator.</p>" +
      "<p>For periodic Fourier modes, $\\dfrac{d}{dx}e^{ikx}=ik e^{ikx}$ and $\\dfrac{d^2}{dx^2}e^{ikx}=-k^2 e^{ikx}$. So the heat equation $u_t=\\alpha u_{xx}$ gives coefficient evolution $\\widehat u_k(t)=\\widehat u_k(0)e^{-\\alpha k^2 t}$.</p>" +
      "<p><b>Assumptions that matter:</b> Fourier spectral methods naturally fit periodic smooth functions; nonperiodic boundaries need other bases or careful treatment; nonsmooth functions can cause ringing; and numerical implementations need dealiasing for nonlinear products.</p>",
    worked: {
      problem: "A heat equation mode has initial coefficient $\\widehat u_3(0)=5$, diffusivity $\\alpha=0.1$, and time $t=2$. Compute $\\widehat u_3(t)$ using $\\widehat u_k(t)=\\widehat u_k(0)e^{-\\alpha k^2t}$.",
      skills: ["Fourier modes", "heat equation", "exponential decay"],
      strategy: "Compute the decay exponent for the mode, then multiply the initial coefficient.",
      steps: [
        { do: "Identify the mode", result: "$k=3$", why: "the coefficient is $\\widehat u_3$" },
        { do: "Compute $k^2$", result: "$3^2=9$", why: "heat decay depends on squared frequency" },
        { do: "Compute the exponent", result: "$-\\alpha k^2t=-0.1\\cdot9\\cdot2=-1.8$", why: "substitute diffusivity and time" },
        { do: "Compute the decay factor", result: "$e^{-1.8}\\approx0.165$", why: "exponential damping" },
        { do: "Multiply by the initial coefficient", result: "$5\\cdot0.165\\approx0.826$", why: "coefficient evolves independently" }
      ],
      verify: "The coefficient shrinks from $5$ to less than $1$, which matches heat smoothing high-frequency modes.",
      answer: "$\\widehat u_3(2)\\approx0.826$.",
      connects: "In a spectral basis, a differential equation can become one scalar update per frequency."
    },
    practice: [
      { problem: "For the heat equation with $\\alpha=0.2$, $k=2$, $t=1$, and $\\widehat u_2(0)=3$, compute $\\widehat u_2(t)$.", steps: [
        { do: "Compute $k^2$", result: "$2^2=4$", why: "squared mode number" },
        { do: "Compute the exponent", result: "$-0.2\\cdot4\\cdot1=-0.8$", why: "heat decay formula" },
        { do: "Approximate decay", result: "$e^{-0.8}\\approx0.449$", why: "exponential value" },
        { do: "Multiply coefficient", result: "$3\\cdot0.449\\approx1.348$", why: "scale the initial mode" }
      ], answer: "$\\widehat u_2(1)\\approx1.348$." },
      { problem: "Differentiate $u(x)=2\\sin(3x)$ twice and compare with the spectral rule.", steps: [
        { do: "Differentiate once", result: "$u'(x)=6\\cos(3x)$", why: "chain rule" },
        { do: "Differentiate twice", result: "$u''(x)=-18\\sin(3x)$", why: "differentiate cosine" },
        { do: "Apply spectral factor", result: "$-k^2=-9$", why: "second derivative multiplies mode $k=3$ by $-9$" },
        { do: "Multiply original amplitude", result: "$-9\\cdot2\\sin(3x)=-18\\sin(3x)$", why: "matches direct differentiation" }
      ], answer: "$u''(x)=-18\\sin(3x)$, exactly matching the spectral factor $-9$." },
      { problem: "A low-pass spectral approximation keeps modes $k=0,1,2$ and drops mode $3$. If magnitudes are $[10,4,1,0.5]$, what remains?", steps: [
        { do: "Write the keep mask", result: "$[1,1,1,0]$", why: "modes $0$ through $2$ are retained" },
        { do: "Multiply mode $0$", result: "$10\\cdot1=10$", why: "keep" },
        { do: "Multiply mode $1$", result: "$4\\cdot1=4$", why: "keep" },
        { do: "Multiply mode $2$", result: "$1\\cdot1=1$", why: "keep" },
        { do: "Multiply mode $3$", result: "$0.5\\cdot0=0$", why: "drop" }
      ], answer: "The remaining magnitudes are $[10,4,1,0]$." },
      { problem: "A graph Laplacian eigenvector has eigenvalue $\\lambda=6$. A heat step uses factor $e^{-0.05\\lambda}$. Compute the factor.", steps: [
        { do: "Substitute eigenvalue", result: "$e^{-0.05\\cdot6}$", why: "graph spectral heat factor" },
        { do: "Multiply exponent", result: "$e^{-0.3}$", why: "$0.05\\cdot6=0.3$" },
        { do: "Approximate", result: "$e^{-0.3}\\approx0.741$", why: "exponential decay" },
        { do: "Interpret", result: "the component keeps about $74.1\\%$", why: "higher eigenvalues decay more" }
      ], answer: "The factor is approximately $0.741$." },
      { problem: "A nonlinear spectral code multiplies two signals whose highest kept mode is $5$. What maximum mode can the product create, and why might dealiasing be needed if only modes through $6$ are stored?", steps: [
        { do: "Add highest input modes", result: "$5+5=10$", why: "products of waves add frequencies" },
        { do: "Compare with storage limit", result: "$10>6$", why: "the product creates modes beyond the grid" },
        { do: "Name the risk", result: "aliasing", why: "unrepresented high modes can fold into lower modes" },
        { do: "State the remedy", result: "dealias or use more modes", why: "remove or represent the created high frequencies" }
      ], answer: "The product can create mode $10$; storing only through $6$ risks aliasing, so dealiasing is needed." }
    ],
    applications: [
      { title: "Heat and diffusion solvers", background: "Spectral methods solve smooth periodic diffusion problems very efficiently because each Fourier mode decays independently.", numbers: "With $\\alpha=0.1$, mode $k=5$ decays by $e^{-0.1\\cdot25\\cdot1}=e^{-2.5}\\approx0.082$ after one time unit." },
      { title: "Fluid simulation", background: "Pseudo-spectral methods are common in idealized turbulence because derivatives are accurate in Fourier space.", numbers: "A $256$-point periodic grid has Fourier modes up to about $128$ before dealiasing choices." },
      { title: "Graph signal processing", background: "Graph spectral methods expand node features in Laplacian eigenvectors, generalizing Fourier modes to networks.", numbers: "A component with eigenvalue $12$ under heat factor $e^{-0.1\\lambda}$ is scaled by $e^{-1.2}\\approx0.301$." },
      { title: "Spectral clustering", background: "Clustering can use low-frequency graph eigenvectors because they vary smoothly within connected groups.", numbers: "Using the first $3$ nontrivial eigenvectors embeds each node into $\\mathbb{R}^3$ before k-means." },
      { title: "Fast Poisson solves", background: "Some boundary-value equations become division by eigenvalues in a spectral basis.", numbers: "If $-u''=f$ and $\\widehat f_4=8$, then $\\widehat u_4=8/4^2=0.5$ for a periodic Fourier mode." },
      { title: "Neural operators", background: "Modern operator-learning models sometimes update only low Fourier modes to learn maps between functions.", numbers: "Keeping $16$ modes out of a $128$-mode grid uses $12.5\\%$ of the one-dimensional spectrum." }
    ],
    applicationsClose: "Spectral methods work when the right basis makes the operator simple and the solution smooth enough to be economical.",
    takeaways: [
      "Spectral methods represent functions by coefficients in global bases.",
      "Fourier modes turn derivatives into multiplication by $ik$ or $-k^2$.",
      "Smooth problems can need few spectral coefficients; nonsmooth ones may ring.",
      "Graph and neural spectral methods extend the same basis-change idea."
    ]
  },

  "math-06-19": {
    id: "math-06-19",
    title: "Convolutions in CNNs & spectral architectures",
    tagline: "CNN kernels are learned filters, and spectral architectures learn which frequencies and modes should pass.",
    connections: {
      buildsOn: ["Filtering", "Spectral methods", "The Fast Fourier Transform (FFT)"],
      leadsTo: ["deep learning architectures", "graph neural networks", "neural operators"],
      usedWith: ["convolution", "linear operators", "Fourier bases", "matrix multiplication"]
    },
    motivation:
      "<p>You already know filtering as convolution: slide a small pattern over data and combine nearby values. A convolutional neural network learns those small patterns from examples instead of hand-designing them.</p>" +
      "<p>Spectral architectures keep the same spirit but change coordinates. Instead of learning only local kernels in pixel space, they may learn multipliers in Fourier space, graph spectral space, or another basis where global structure is easier to control.</p>",
    definition:
      "<p>For a single-channel image patch $X$ and kernel $K$, a CNN convolution output is a local weighted sum: $Y_{i,j}=\\sum_{a,b}K_{a,b}X_{i+a,j+b}$, with details depending on padding, stride, and whether the implementation flips the kernel. With multiple channels, sums also run over input channels.</p>" +
      "<p>The Fourier link is the convolution theorem: spatial convolution corresponds to frequency-domain multiplication, $\\widehat Y_k=\\widehat K_k\\widehat X_k$. Thus a learned convolution kernel is a learned filter. Spectral layers can instead learn frequency multipliers directly, often truncating to low modes for efficiency or stability.</p>" +
      "<p><b>Assumptions that matter:</b> CNN libraries often implement cross-correlation rather than mathematically flipped convolution; padding changes output size and boundary behavior; translation equivariance assumes shared weights; and spectral methods need a chosen basis and normalization convention.</p>",
    worked: {
      problem: "A $3\\times3$ grayscale patch is $\\begin{bmatrix}1&2&1\\\\0&3&2\\\\1&1&0\\end{bmatrix}$ and a learned edge kernel is $\\begin{bmatrix}1&0&-1\\\\1&0&-1\\\\1&0&-1\\end{bmatrix}$. Using CNN-style cross-correlation, compute the single output value, then apply ReLU.",
      skills: ["CNN convolution", "weighted sums", "activation functions"],
      strategy: "Multiply entries in matching positions, add the nine products, then pass the scalar through ReLU.",
      steps: [
        { do: "Multiply the first row", result: "$1\\cdot1+0\\cdot2+(-1)\\cdot1=0$", why: "entrywise products across row one" },
        { do: "Multiply the second row", result: "$1\\cdot0+0\\cdot3+(-1)\\cdot2=-2$", why: "entrywise products across row two" },
        { do: "Multiply the third row", result: "$1\\cdot1+0\\cdot1+(-1)\\cdot0=1$", why: "entrywise products across row three" },
        { do: "Add row contributions", result: "$0+(-2)+1=-1$", why: "convolution output is the total weighted sum" },
        { do: "Apply ReLU", result: "$\\max(0,-1)=0$", why: "negative pre-activation is clipped" }
      ],
      verify: "The kernel compares left-column mass $1+0+1=2$ with right-column mass $1+2+0=3$, so a negative response $2-3=-1$ is expected.",
      answer: "The pre-activation is $-1$, and the ReLU output is $0$.",
      connects: "A CNN convolution is a learned local filter followed by a nonlinear decision."
    },
    practice: [
      { problem: "A $2\\times2$ patch $\\begin{bmatrix}2&1\\\\0&3\\end{bmatrix}$ uses kernel $\\begin{bmatrix}1&-1\\\\0&2\\end{bmatrix}$. Compute the CNN-style output.", steps: [
        { do: "Multiply top-left entries", result: "$1\\cdot2=2$", why: "first weighted pixel" },
        { do: "Multiply top-right entries", result: "$(-1)\\cdot1=-1$", why: "second weighted pixel" },
        { do: "Multiply bottom-left entries", result: "$0\\cdot0=0$", why: "third weighted pixel" },
        { do: "Multiply bottom-right entries", result: "$2\\cdot3=6$", why: "fourth weighted pixel" },
        { do: "Add products", result: "$2-1+0+6=7$", why: "local weighted sum" }
      ], answer: "The output is $7$." },
      { problem: "A $5\\times5$ image uses a $3\\times3$ kernel with stride $1$ and no padding. What is the output spatial size?", steps: [
        { do: "Write the one-dimensional size formula", result: "$\\text{out}=5-3+1$", why: "valid positions without padding" },
        { do: "Compute one dimension", result: "$3$", why: "the kernel starts at positions $1$, $2$, and $3$" },
        { do: "Apply to both dimensions", result: "$3\\times3$", why: "height and width follow the same formula" },
        { do: "Count outputs", result: "$9$ spatial positions", why: "$3\\cdot3=9$" }
      ], answer: "The output is $3\\times3$, with $9$ spatial positions." },
      { problem: "A convolution layer has $16$ input channels, $32$ output channels, and $3\\times3$ kernels. How many weights are learned, ignoring bias?", steps: [
        { do: "Count weights per output channel", result: "$16\\cdot3\\cdot3=144$", why: "each output channel reads all input channels" },
        { do: "Multiply by output channels", result: "$144\\cdot32=4608$", why: "each output channel has its own kernel bank" },
        { do: "State bias exclusion", result: "$4608$ weights", why: "the problem says to ignore bias" },
        { do: "Optional bias count", result: "$32$ more if included", why: "one bias per output channel is common" }
      ], answer: "The layer has $4608$ learned weights without bias." },
      { problem: "In a spectral layer, an input Fourier coefficient is $\\widehat X_4=3-2i$ and the learned multiplier is $M_4=0.5$. What is the output coefficient and its magnitude?", steps: [
        { do: "Use spectral multiplication", result: "$\\widehat Y_4=M_4\\widehat X_4$", why: "spectral filters multiply modes" },
        { do: "Substitute values", result: "$\\widehat Y_4=0.5(3-2i)$", why: "use the learned multiplier" },
        { do: "Multiply", result: "$\\widehat Y_4=1.5-i$", why: "scale real and imaginary parts" },
        { do: "Compute magnitude", result: "$|\\widehat Y_4|=\\sqrt{1.5^2+(-1)^2}=\\sqrt{3.25}$", why: "complex magnitude" },
        { do: "Approximate", result: "$|\\widehat Y_4|\\approx1.803$", why: "$\\sqrt{3.25}\\approx1.803$" }
      ], answer: "The output coefficient is $1.5-i$ with magnitude about $1.803$." },
      { problem: "A Fourier neural operator keeps $12$ positive modes and $12$ negative modes out of $128$ one-dimensional modes. What fraction of modes are directly learned?", steps: [
        { do: "Count kept modes", result: "$12+12=24$", why: "positive and negative modes are both retained" },
        { do: "Write the fraction", result: "$24/128$", why: "kept modes over total modes" },
        { do: "Simplify", result: "$3/16$", why: "divide numerator and denominator by $8$" },
        { do: "Convert to decimal", result: "$0.1875$", why: "$3/16=0.1875$" },
        { do: "Convert to percent", result: "$18.75\\%$", why: "multiply by $100$" }
      ], answer: "The layer directly learns $24$ of $128$ modes, or $18.75\\%$." }
    ],
    applications: [
      { title: "Edge detectors in first CNN layers", background: "Early CNN filters often learn edge-like patterns because edges are useful local features in images.", numbers: "The worked kernel computes left-column sum minus right-column sum: for left $2$ and right $3$, response is $-1$." },
      { title: "Parameter sharing", background: "Convolution reuses the same weights at every location, which makes image models much smaller than fully connected ones.", numbers: "A $32\\times32$ grayscale image to $16$ feature maps with $3\\times3$ kernels uses $16\\cdot9=144$ weights, not $1024\\cdot16=16,384$." },
      { title: "Multi-channel feature extraction", background: "Deep CNN layers mix channels so each output can combine color, texture, and previous features.", numbers: "With $64$ input channels, $128$ output channels, and $3\\times3$ kernels, weights are $64\\cdot128\\cdot9=73,728$." },
      { title: "FFT convolution for large kernels", background: "Very large kernels can be faster in frequency space because convolution becomes multiplication.", numbers: "For length $2048$, direct convolution scale $4,194,304$ can be compared with about $67,584$ for three FFT-scale transforms." },
      { title: "Fourier neural operators", background: "FNO-style models learn mappings between functions by updating low Fourier modes and returning to physical space.", numbers: "Keeping $16$ positive and $16$ negative modes out of $256$ keeps $32/256=12.5\\%$ of one-dimensional modes." },
      { title: "Graph spectral networks", background: "On graphs, Laplacian eigenvectors replace sine waves, letting filters act on smooth or oscillatory graph modes.", numbers: "A multiplier $g(\\lambda)=1/(1+\\lambda)$ gives gains $1$, $0.5$, and $0.2$ at eigenvalues $0$, $1$, and $4$." },
      { title: "Anti-aliasing in vision models", background: "Strided convolution downsamples feature maps, so blur or low-pass operations can reduce aliasing artifacts.", numbers: "Going from $64\\times64$ to $32\\times32$ halves the spatial sampling rate, so the new Nyquist limit is half the old one." }
    ],
    applicationsClose: "CNNs and spectral models share one thread: learn how information should be mixed, whether locally in space or globally by modes.",
    takeaways: [
      "A CNN convolution is a learned weighted sum applied across spatial locations and channels.",
      "Convolution is filtering; in Fourier coordinates it becomes multiplication of modes.",
      "Spectral architectures can learn mode multipliers directly and often keep only selected modes.",
      "Padding, stride, channels, and basis choice determine what the layer can represent."
    ]
  }
};
