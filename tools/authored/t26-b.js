module.exports = {
  "math-26-12": {
    "id": "math-26-12",
    "title": "Frequency response",
    "tagline": "Frequency response asks how a system treats each sinusoidal input: what gets amplified, delayed, or softened.",
    "connections": {
      "buildsOn": [
        "Laplace transforms",
        "transfer functions",
        "complex numbers",
        "sinusoidal functions"
      ],
      "leadsTo": [
        "Bode plots",
        "stability margins",
        "filter design"
      ],
      "usedWith": [
        "complex exponentials",
        "phasors",
        "Fourier analysis",
        "linear differential equations"
      ]
    },
    "motivation": "<p>You already know a sine wave has an amplitude and a frequency. If you push a swing slowly, it follows; if you push near its natural rhythm, it grows; if you wiggle too fast, it barely moves.</p><p><b>Frequency response</b> gives that story a precise form. Instead of solving a differential equation for every possible input, we feed the system one frequency at a time and read the output gain and phase.</p>",
    "definition": "<p>For a stable linear time-invariant system with transfer function $G(s)$, the frequency response is $G(j\\omega)$, where $j^2=-1$ and $\\omega$ is angular frequency in radians per second. Its magnitude $|G(j\\omega)|$ is the output amplitude divided by input amplitude, and its phase $\\angle G(j\\omega)$ is the output shift in radians or degrees.</p><p>The key fact comes from complex exponentials. If the input is $e^{j\\omega t}$, then an LTI system outputs $G(j\\omega)e^{j\\omega t}$. The same frequency comes out because exponentials are eigenfunctions of LTI systems; only the complex multiplier changes amplitude and phase. Real sine waves follow by taking real parts.</p><p><b>Assumptions that matter:</b> the system is linear and time-invariant; the sinusoidal steady state exists, so unstable transients are not dominating; $s=j\\omega$ means evaluating on the imaginary axis; and phase is meaningful modulo $2\\pi$.</p>",
    "worked": {
      "problem": "For $G(s)=\\dfrac{2}{s+2}$, find the gain and phase at $\\omega=3$ rad/s.",
      "skills": [
        "transfer functions",
        "complex magnitude",
        "phase"
      ],
      "strategy": "Evaluate at $s=j\\omega$, then turn the complex number into magnitude and angle.",
      "steps": [
        {
          "do": "Substitute $s=j3$",
          "result": "$G(j3)=\\dfrac{2}{2+j3}$",
          "why": "frequency response lives on the imaginary axis"
        },
        {
          "do": "Compute the denominator magnitude",
          "result": "$|2+j3|=\\sqrt{2^2+3^2}=\\sqrt{13}$",
          "why": "magnitude of $a+jb$ is $\\sqrt{a^2+b^2}$"
        },
        {
          "do": "Compute the gain",
          "result": "$|G(j3)|=\\dfrac{2}{\\sqrt{13}}\\approx0.555$",
          "why": "the numerator has magnitude 2"
        },
        {
          "do": "Find the denominator angle",
          "result": "$\\tan^{-1}(3/2)\\approx56.3^\\circ$",
          "why": "the denominator lies in quadrant I"
        },
        {
          "do": "Apply reciprocal phase",
          "result": "$\\angle G(j3)=-56.3^\\circ$",
          "why": "division by a complex number subtracts its angle"
        }
      ],
      "verify": "A first-order low-pass with pole at $-2$ should reduce a frequency above $2$ rad/s, and gain $0.555<1$ matches that expectation.",
      "answer": "$|G(j3)|\\approx0.555$ and $\\angle G(j3)\\approx-56.3^\\circ$.",
      "connects": "Frequency response turns a differential system into a frequency-by-frequency gain and delay."
    },
    "practice": [
      {
        "problem": "For $G(s)=\\dfrac{5}{s+5}$, find $|G(j0)|$ and the phase at $\\omega=0$.",
        "steps": [
          {
            "do": "Substitute $s=j0$",
            "result": "$G(j0)=\\dfrac{5}{5}$",
            "why": "zero frequency is DC"
          },
          {
            "do": "Simplify the value",
            "result": "$G(j0)=1$",
            "why": "the numerator and denominator match"
          },
          {
            "do": "Take the magnitude",
            "result": "$|G(j0)|=1$",
            "why": "the magnitude of positive real 1 is 1"
          },
          {
            "do": "Take the phase",
            "result": "$\\angle G(j0)=0^\\circ$",
            "why": "positive real numbers have zero phase"
          },
          {
            "do": "Interpret",
            "result": "DC passes unchanged",
            "why": "a low-pass keeps very slow signals"
          }
        ],
        "answer": "$|G(j0)|=1$ and phase is $0^\\circ$."
      },
      {
        "problem": "For $G(s)=\\dfrac{1}{s+1}$, compute gain and phase at $\\omega=1$.",
        "steps": [
          {
            "do": "Substitute $s=j1$",
            "result": "$G(j)=\\dfrac{1}{1+j}$",
            "why": "evaluate at the requested frequency"
          },
          {
            "do": "Find denominator magnitude",
            "result": "$|1+j|=\\sqrt2$",
            "why": "use the complex magnitude formula"
          },
          {
            "do": "Compute gain",
            "result": "$|G(j)|=1/\\sqrt2\\approx0.707$",
            "why": "magnitudes divide"
          },
          {
            "do": "Find denominator angle",
            "result": "$45^\\circ$",
            "why": "real and imaginary parts are equal"
          },
          {
            "do": "Negate for reciprocal",
            "result": "$\\angle G(j)=-45^\\circ$",
            "why": "the denominator angle is subtracted"
          }
        ],
        "answer": "Gain $\\approx0.707$ and phase $-45^\\circ$."
      },
      {
        "problem": "A system has $G(j4)=0.6e^{-j\\pi/3}$. If the input is $3\\cos(4t)$, write the steady-state output.",
        "steps": [
          {
            "do": "Read the gain",
            "result": "$0.6$",
            "why": "the magnitude multiplies amplitude"
          },
          {
            "do": "Multiply the input amplitude",
            "result": "$3\\cdot0.6=1.8$",
            "why": "output amplitude is input amplitude times gain"
          },
          {
            "do": "Read the phase",
            "result": "$-\\pi/3$",
            "why": "the exponential angle is the phase shift"
          },
          {
            "do": "Keep the frequency",
            "result": "$4$ rad/s",
            "why": "LTI systems do not change sinusoidal frequency"
          },
          {
            "do": "Write the output",
            "result": "$1.8\\cos(4t-\\pi/3)$",
            "why": "combine amplitude, frequency, and phase"
          }
        ],
        "answer": "$y_{ss}(t)=1.8\\cos(4t-\\pi/3)$."
      },
      {
        "problem": "For $G(s)=\\dfrac{10}{s+2}$, find the frequency where the gain equals $1$.",
        "steps": [
          {
            "do": "Write the gain",
            "result": "$|G(j\\omega)|=\\dfrac{10}{\\sqrt{4+\\omega^2}}$",
            "why": "the denominator is $2+j\\omega$"
          },
          {
            "do": "Set gain equal to $1$",
            "result": "$\\dfrac{10}{\\sqrt{4+\\omega^2}}=1$",
            "why": "that is the requested condition"
          },
          {
            "do": "Isolate the square root",
            "result": "$\\sqrt{4+\\omega^2}=10$",
            "why": "multiply both sides by the denominator"
          },
          {
            "do": "Square both sides",
            "result": "$4+\\omega^2=100$",
            "why": "remove the square root"
          },
          {
            "do": "Solve for frequency",
            "result": "$\\omega=\\sqrt{96}\\approx9.80$",
            "why": "angular frequency is nonnegative"
          }
        ],
        "answer": "$\\omega\\approx9.80$ rad/s."
      },
      {
        "problem": "A learned linear filter has gain $0.2$ and phase $-90^\\circ$ at frequency $6$ rad/s. If input is $x(t)=10\\sin(6t)$, give the output and time lag.",
        "steps": [
          {
            "do": "Multiply amplitudes",
            "result": "$10\\cdot0.2=2$",
            "why": "gain scales the sinusoid"
          },
          {
            "do": "Convert phase to radians",
            "result": "$-90^\\circ=-\\pi/2$",
            "why": "sine arguments use radians"
          },
          {
            "do": "Write the output",
            "result": "$y(t)=2\\sin(6t-\\pi/2)$",
            "why": "same frequency, scaled and shifted"
          },
          {
            "do": "Use phase equals $-\\omega\\tau$",
            "result": "$-\\pi/2=-6\\tau$",
            "why": "a delay $\\tau$ creates negative phase"
          },
          {
            "do": "Solve for delay",
            "result": "$\\tau=\\pi/12\\approx0.262$ s",
            "why": "divide by 6"
          }
        ],
        "answer": "$y(t)=2\\sin(6t-\\pi/2)$ with lag about $0.262$ s."
      }
    ],
    "applications": [
      {
        "title": "Audio equalizers",
        "background": "Equalizers grew from analog filters in radio and recording studios. Each knob boosts or cuts a frequency band, which is exactly frequency-response thinking.",
        "numbers": "If a band has gain $2$ at $1000$ Hz, a $0.3$ V sine component becomes $0.6$ V."
      },
      {
        "title": "Servo vibration",
        "background": "Motors and robot arms can resonate when commanded near a natural frequency. Engineers inspect frequency response before a controller excites that motion.",
        "numbers": "If $|G(j20)|=4$, a $0.1$ degree command ripple can create $0.4$ degrees of motion."
      },
      {
        "title": "Low-pass smoothing",
        "background": "Sensors often include high-frequency noise. A low-pass filter preserves slow trends while shrinking fast oscillations.",
        "numbers": "For $G(s)=1/(0.5s+1)$ at $\\omega=10$, gain is $1/\\sqrt{1+25}\\approx0.196$, so $5$ units of noise shrink to $0.98$."
      },
      {
        "title": "Neural sequence filters",
        "background": "Convolutional and recurrent layers can be studied as filters when linearized. Their response shows which temporal patterns they emphasize.",
        "numbers": "A kernel $[0.5,0.5]$ has zero-frequency gain $1$ and alternating-frequency gain $0$, so it averages adjacent samples and removes perfect alternation."
      },
      {
        "title": "Communications channels",
        "background": "Radio and network channels distort signals differently across frequencies. Equalization compensates by inverting measured response where safe.",
        "numbers": "If a channel gain is $0.25$ at a carrier, a transmitter may need $4$ times amplitude to recover the original level, ignoring noise limits."
      },
      {
        "title": "Control robustness",
        "background": "Frequency response exposes how much phase lag and gain change a feedback loop can tolerate before oscillation.",
        "numbers": "If a loop has $|L(j5)|=0.5$, doubling plant gain makes the loop magnitude $1$ at that frequency, changing the stability margin."
      }
    ],
    "applicationsClose": "The same frequency-by-frequency question explains filters, robots, channels, learned sequence layers, and feedback loops.",
    "takeaways": [
      "$G(j\\omega)$ is the transfer function evaluated on the imaginary axis.",
      "Magnitude gives amplitude ratio; phase gives timing shift.",
      "LTI systems send a sinusoid to the same frequency with changed gain and phase.",
      "Frequency response is the bridge from equations to practical filtering and robustness."
    ]
  },
  "math-26-13": {
    "id": "math-26-13",
    "title": "Bode plots",
    "tagline": "A Bode plot is a readable map of gain and phase across many frequencies at once.",
    "connections": {
      "buildsOn": [
        "Frequency response",
        "logarithms",
        "complex numbers"
      ],
      "leadsTo": [
        "stability margins",
        "PID tuning",
        "loop shaping"
      ],
      "usedWith": [
        "decibels",
        "asymptotes",
        "phase",
        "log scales"
      ]
    },
    "motivation": "<p>You just learned to compute one frequency response value. But a controller rarely cares about one frequency; it needs the whole sweep from slow drift to fast noise.</p><p>A <b>Bode plot</b> makes that sweep readable by using a log frequency axis, gain in decibels, and phase in degrees. The payoff is pattern recognition: poles, zeros, and delays leave shapes you can learn to read.</p>",
    "definition": "<p>A Bode plot shows $20\\log_{10}|G(j\\omega)|$ versus $\\omega$ and $\\angle G(j\\omega)$ versus $\\omega$. The gain unit is decibels, abbreviated dB. Multiplication becomes addition because $20\\log_{10}(|AB|)=20\\log_{10}|A|+20\\log_{10}|B|$.</p><p>For a first-order factor $1/(1+s/a)$, the magnitude is near $0$ dB for $\\omega\\ll a$, equals $-3$ dB at $\\omega=a$, and then falls at about $-20$ dB per decade. That slope appears because at high frequency $|1+j\\omega/a|\\approx\\omega/a$, so $20\\log_{10}(a/\\omega)$ drops by $20$ when $\\omega$ is multiplied by $10$.</p><p><b>Assumptions that matter:</b> frequency is positive; log axes cannot include $\\omega=0$; dB for amplitude uses $20\\log_{10}$; phase may be wrapped by $360^\\circ$; and straight-line asymptotes are approximations, not exact curves.</p>",
    "worked": {
      "problem": "For $G(s)=\\dfrac{10}{s+10}$, compute the Bode magnitude in dB and phase at $\\omega=10$ rad/s.",
      "skills": [
        "decibels",
        "corner frequency",
        "phase"
      ],
      "strategy": "At the corner frequency, evaluate the complex gain and convert magnitude to dB.",
      "steps": [
        {
          "do": "Substitute $s=j10$",
          "result": "$G(j10)=\\dfrac{10}{10+j10}$",
          "why": "evaluate at the requested frequency"
        },
        {
          "do": "Compute magnitude",
          "result": "$|G(j10)|=\\dfrac{10}{\\sqrt{10^2+10^2}}=\\dfrac{1}{\\sqrt2}$",
          "why": "magnitudes divide"
        },
        {
          "do": "Approximate the magnitude",
          "result": "$|G(j10)|\\approx0.707$",
          "why": "one over $\\sqrt2$ is about 0.707"
        },
        {
          "do": "Convert to dB",
          "result": "$20\\log_{10}(0.707)\\approx-3.01$ dB",
          "why": "amplitude ratios use $20\\log_{10}$"
        },
        {
          "do": "Compute phase",
          "result": "$\\angle G(j10)=-45^\\circ$",
          "why": "the denominator angle is $45^\\circ$"
        }
      ],
      "verify": "A first-order pole is down about $3$ dB and has $-45^\\circ$ phase at its corner, so both numbers fit the standard pattern.",
      "answer": "Magnitude is about $-3.01$ dB and phase is $-45^\\circ$.",
      "connects": "Bode plots turn one complex value into the gain-and-phase language engineers read from a graph."
    },
    "practice": [
      {
        "problem": "Convert amplitude gains $1$, $2$, and $0.5$ to dB.",
        "steps": [
          {
            "do": "Use the dB formula",
            "result": "$D=20\\log_{10}A$",
            "why": "amplitude gain $A$ maps to decibels"
          },
          {
            "do": "Compute for $A=1$",
            "result": "$20\\log_{10}1=0$ dB",
            "why": "log of 1 is zero"
          },
          {
            "do": "Compute for $A=2$",
            "result": "$20\\log_{10}2\\approx6.02$ dB",
            "why": "doubling amplitude is about 6 dB"
          },
          {
            "do": "Compute for $A=0.5$",
            "result": "$20\\log_{10}0.5\\approx-6.02$ dB",
            "why": "halving amplitude is about minus 6 dB"
          },
          {
            "do": "Compare signs",
            "result": "gains above 1 are positive dB",
            "why": "gains below 1 are negative dB"
          }
        ],
        "answer": "$1\\mapsto0$ dB, $2\\mapsto6.02$ dB, $0.5\\mapsto-6.02$ dB."
      },
      {
        "problem": "A Bode magnitude is $-20$ dB. Find the amplitude ratio.",
        "steps": [
          {
            "do": "Write the equation",
            "result": "$20\\log_{10}A=-20$",
            "why": "convert dB back to gain"
          },
          {
            "do": "Divide by $20$",
            "result": "$\\log_{10}A=-1$",
            "why": "isolate the logarithm"
          },
          {
            "do": "Convert from log form",
            "result": "$A=10^{-1}$",
            "why": "base-10 log asks for a power of 10"
          },
          {
            "do": "Simplify",
            "result": "$A=0.1$",
            "why": "one tenth is $10^{-1}$"
          },
          {
            "do": "Interpret",
            "result": "amplitude is divided by $10$",
            "why": "negative dB means attenuation"
          }
        ],
        "answer": "The amplitude ratio is $0.1$."
      },
      {
        "problem": "For $G(s)=\\dfrac{1}{1+s/4}$, estimate high-frequency magnitude dB at $\\omega=40$ rad/s using the asymptote.",
        "steps": [
          {
            "do": "Find the ratio",
            "result": "$\\omega/4=10$",
            "why": "40 is one decade above the corner"
          },
          {
            "do": "Use the high-frequency magnitude",
            "result": "$|G(j\\omega)|\\approx4/\\omega$",
            "why": "the $s/4$ term dominates"
          },
          {
            "do": "Substitute $\\omega=40$",
            "result": "$|G(j40)|\\approx0.1$",
            "why": "four divided by forty"
          },
          {
            "do": "Convert to dB",
            "result": "$20\\log_{10}(0.1)=-20$ dB",
            "why": "one decade down is minus 20 dB"
          },
          {
            "do": "Name the slope",
            "result": "$-20$ dB per decade",
            "why": "a single pole causes that rolloff"
          }
        ],
        "answer": "About $-20$ dB."
      },
      {
        "problem": "A transfer function has two identical first-order poles after $\\omega=5$. What asymptotic slope appears for $\\omega\\gg5$? Estimate the change from $5$ to $50$ rad/s.",
        "steps": [
          {
            "do": "Count the poles",
            "result": "$2$ poles",
            "why": "each first-order pole contributes a slope"
          },
          {
            "do": "Assign one pole slope",
            "result": "$-20$ dB per decade",
            "why": "standard Bode rule"
          },
          {
            "do": "Add the slopes",
            "result": "$-40$ dB per decade",
            "why": "multiplication of factors adds dB"
          },
          {
            "do": "Count decades",
            "result": "$50/5=10$",
            "why": "that is one decade"
          },
          {
            "do": "Compute the drop",
            "result": "$-40$ dB",
            "why": "one decade times minus 40 dB per decade"
          }
        ],
        "answer": "Slope $-40$ dB per decade; the magnitude drops about $40$ dB from $5$ to $50$ rad/s."
      },
      {
        "problem": "At crossover a loop has magnitude $0$ dB and phase $-135^\\circ$. Compute the phase margin.",
        "steps": [
          {
            "do": "Recall the instability phase",
            "result": "$-180^\\circ$",
            "why": "negative feedback becomes dangerous near this phase"
          },
          {
            "do": "Write phase margin",
            "result": "$180^\\circ+\\angle L(j\\omega_c)$",
            "why": "distance from $-180^\\circ$ at gain crossover"
          },
          {
            "do": "Substitute the phase",
            "result": "$180^\\circ-135^\\circ$",
            "why": "the phase is negative"
          },
          {
            "do": "Compute",
            "result": "$45^\\circ$",
            "why": "subtract the angles"
          },
          {
            "do": "Interpret",
            "result": "positive margin",
            "why": "there is 45 degrees of extra lag before the boundary"
          }
        ],
        "answer": "The phase margin is $45^\\circ$."
      }
    ],
    "applications": [
      {
        "title": "Loop-shaping control",
        "background": "Classical control design often starts by drawing the open-loop Bode plot and adjusting it until the crossover and margins look safe.",
        "numbers": "If gain is raised by $6$ dB, amplitude gain doubles; a loop with $0.4$ crossover gain becomes about $0.8$."
      },
      {
        "title": "Audio filters",
        "background": "Sound engineers use Bode-like magnitude plots to describe bass, midrange, and treble filters.",
        "numbers": "A $-12$ dB cut corresponds to amplitude ratio $10^{-12/20}\\approx0.251$, so a $1$ V tone becomes $0.251$ V."
      },
      {
        "title": "Sensor bandwidth",
        "background": "Instrumentation datasheets quote bandwidth using the $-3$ dB point because that is where power is roughly halved.",
        "numbers": "At $-3$ dB, amplitude ratio is $10^{-3/20}\\approx0.708$, close to $1/\\sqrt2$."
      },
      {
        "title": "Communication channels",
        "background": "Channel equalizers use frequency plots to compensate for attenuation across bands.",
        "numbers": "If a channel is $-10$ dB at $2$ MHz, its amplitude ratio is $10^{-0.5}\\approx0.316$."
      },
      {
        "title": "Neural network frequency bias",
        "background": "Researchers sometimes probe learned models by feeding sinusoidal inputs and plotting output amplitude versus frequency.",
        "numbers": "If response falls from $0$ dB at low frequency to $-20$ dB at high frequency, high-frequency amplitude is only $0.1$ of low-frequency amplitude."
      },
      {
        "title": "Mechanical resonance",
        "background": "Bode plots reveal resonant peaks that can fatigue structures or make robots chatter.",
        "numbers": "A $14$ dB resonance has amplitude ratio $10^{14/20}\\approx5.01$, so a $0.2$ mm vibration can become about $1.0$ mm."
      }
    ],
    "applicationsClose": "Bode plots are just logarithmic storytelling for frequency response: gains add, slopes reveal factors, and phase shows timing risk.",
    "takeaways": [
      "Bode magnitude is $20\\log_{10}|G(j\\omega)|$ in dB.",
      "A first-order pole contributes about $-20$ dB per decade after its corner.",
      "At a first-order corner, magnitude is about $-3$ dB and phase is $-45^\\circ$.",
      "Margins, filters, sensors, and resonance all become easier to read on Bode plots."
    ]
  },
  "math-26-14": {
    "id": "math-26-14",
    "title": "PID controllers",
    "tagline": "A PID controller combines present error, accumulated error, and predicted change into one practical feedback law.",
    "connections": {
      "buildsOn": [
        "feedback",
        "derivatives",
        "integrals",
        "transfer functions"
      ],
      "leadsTo": [
        "state-space control",
        "loop tuning",
        "optimal control"
      ],
      "usedWith": [
        "differential equations",
        "Laplace transforms",
        "stability",
        "frequency response"
      ]
    },
    "motivation": "<p>You already know the feeling of correcting an error: if you are too cold, turn the heat up; if the room has been cold for a long time, push harder; if the temperature is rising fast, ease off.</p><p>A <b>PID controller</b> packages those three instincts into mathematics. Proportional action reacts to error now, integral action remembers past error, and derivative action anticipates the trend.</p>",
    "definition": "<p>For reference signal $r(t)$, output $y(t)$, and error $e(t)=r(t)-y(t)$, a PID controller applies $$u(t)=K_P e(t)+K_I\\int_0^t e(\\tau)\\,d\\tau+K_D\\dfrac{de}{dt}.$$ Here $u(t)$ is the control input, and $K_P,K_I,K_D$ are gains chosen by the designer.</p><p>Taking Laplace transforms with zero initial conditions gives $U(s)=\\left(K_P+K_I/s+K_Ds\\right)E(s)$. This shows the structure: proportional is constant gain, integral emphasizes low-frequency persistent error, and derivative emphasizes rapid changes.</p><p><b>Assumptions that matter:</b> the error is measured accurately enough; derivative action may need filtering because noise differentiates badly; actuator limits can cause integral windup; and PID tuning depends on the plant being controlled.</p>",
    "worked": {
      "problem": "At one instant a controller has $e=2$, accumulated error $\\int e=5$, and error derivative $de/dt=-0.4$. With $K_P=3$, $K_I=0.8$, $K_D=1.5$, compute $u$.",
      "skills": [
        "PID law",
        "substitution",
        "units"
      ],
      "strategy": "Compute the three terms separately, then add them.",
      "steps": [
        {
          "do": "Compute proportional action",
          "result": "$K_Pe=3\\cdot2=6$",
          "why": "reacts to current error"
        },
        {
          "do": "Compute integral action",
          "result": "$K_I\\int e=0.8\\cdot5=4$",
          "why": "reacts to accumulated error"
        },
        {
          "do": "Compute derivative action",
          "result": "$K_D\\dfrac{de}{dt}=1.5(-0.4)=-0.6$",
          "why": "error is decreasing, so derivative action backs off"
        },
        {
          "do": "Add the terms",
          "result": "$u=6+4-0.6=9.4$",
          "why": "the control signal is the sum"
        },
        {
          "do": "Interpret sign",
          "result": "$u>0$",
          "why": "the controller still pushes upward"
        }
      ],
      "verify": "Current and accumulated error are positive, so a positive control effort is expected even though the derivative term reduces it slightly.",
      "answer": "$u=9.4$.",
      "connects": "PID is a weighted sum of present, past, and changing error."
    },
    "practice": [
      {
        "problem": "A P controller has $K_P=4$ and error $e=1.5$. Compute $u$.",
        "steps": [
          {
            "do": "Write the P law",
            "result": "$u=K_Pe$",
            "why": "only proportional action is active"
          },
          {
            "do": "Substitute values",
            "result": "$u=4\\cdot1.5$",
            "why": "use the given gain and error"
          },
          {
            "do": "Multiply",
            "result": "$u=6$",
            "why": "four times one and a half"
          },
          {
            "do": "Check the sign",
            "result": "$u>0$",
            "why": "positive error gives positive action"
          },
          {
            "do": "Interpret",
            "result": "larger error would make larger action",
            "why": "proportional action scales immediately"
          }
        ],
        "answer": "$u=6$."
      },
      {
        "problem": "For $K_P=2$, $K_I=0.5$, $K_D=0$, $e=3$, and $\\int e=8$, compute the PI control signal.",
        "steps": [
          {
            "do": "Compute P term",
            "result": "$2\\cdot3=6$",
            "why": "current error contribution"
          },
          {
            "do": "Compute I term",
            "result": "$0.5\\cdot8=4$",
            "why": "accumulated error contribution"
          },
          {
            "do": "Set D term",
            "result": "$0$",
            "why": "derivative gain is zero"
          },
          {
            "do": "Add terms",
            "result": "$6+4=10$",
            "why": "PI signal is the sum"
          },
          {
            "do": "Interpret",
            "result": "integral adds 40 percent of the output",
            "why": "memory matters here"
          }
        ],
        "answer": "$u=10$."
      },
      {
        "problem": "If a constant error $e=0.2$ persists for $10$ seconds and starts with zero integral, what is $\\int_0^{10}e(t)dt$?",
        "steps": [
          {
            "do": "Write the integral",
            "result": "$\\int_0^{10}0.2\\,dt$",
            "why": "the error is constant"
          },
          {
            "do": "Use area of a rectangle",
            "result": "$0.2\\cdot10$",
            "why": "height times width"
          },
          {
            "do": "Compute",
            "result": "$2$",
            "why": "multiply"
          },
          {
            "do": "Attach units",
            "result": "error-seconds",
            "why": "an integral accumulates over time"
          },
          {
            "do": "Interpret",
            "result": "integral action will keep growing if error persists",
            "why": "this removes steady-state offset"
          }
        ],
        "answer": "The accumulated error is $2$."
      },
      {
        "problem": "A derivative estimate changes from error $1.0$ to $0.4$ over $0.2$ seconds. Estimate $de/dt$ and the D term for $K_D=0.5$.",
        "steps": [
          {
            "do": "Compute error change",
            "result": "$0.4-1.0=-0.6$",
            "why": "final minus initial"
          },
          {
            "do": "Divide by time",
            "result": "$-0.6/0.2=-3$",
            "why": "finite-difference derivative"
          },
          {
            "do": "Multiply by $K_D$",
            "result": "$0.5(-3)=-1.5$",
            "why": "derivative gain scales the estimate"
          },
          {
            "do": "Interpret sign",
            "result": "negative damping action",
            "why": "falling error reduces the push"
          },
          {
            "do": "Check size",
            "result": "a fast change creates a sizable derivative term",
            "why": "derivatives amplify fast motion"
          }
        ],
        "answer": "$de/dt\\approx-3$ and D term is $-1.5$."
      },
      {
        "problem": "A saturated actuator clips $u$ to $[-5,5]$. If PID computes $u=8$ for $4$ seconds while error stays positive, explain the integral risk numerically.",
        "steps": [
          {
            "do": "Apply saturation",
            "result": "$u_{actual}=5$",
            "why": "the actuator cannot output 8"
          },
          {
            "do": "Compute unserved command",
            "result": "$8-5=3$",
            "why": "the requested effort exceeds capacity"
          },
          {
            "do": "Assume error integral grows at $1$ per second",
            "result": "$\\Delta I=4$",
            "why": "positive error accumulates for 4 seconds"
          },
          {
            "do": "Compute extra integral term for $K_I=0.5$",
            "result": "$0.5\\cdot4=2$",
            "why": "the stored term grows"
          },
          {
            "do": "Name the risk",
            "result": "windup",
            "why": "the controller may overshoot after saturation ends"
          }
        ],
        "answer": "The actuator outputs $5$, while the integral can store an extra $2$ units of command if $K_I=0.5$."
      }
    ],
    "applications": [
      {
        "title": "Thermostats",
        "background": "Early automatic control grew from temperature regulation. PID improves on on-off thermostats by making heat input smoother.",
        "numbers": "If room error is $2^\\circ$C and $K_P=30$ W per degree, the proportional heat command is $60$ W."
      },
      {
        "title": "Cruise control",
        "background": "Cars use feedback to hold speed against hills and drag. Integral action helps remove persistent speed error on an incline.",
        "numbers": "A $3$ mph error with $K_P=0.4$ throttle per mph gives $1.2$ throttle units before clipping or scaling."
      },
      {
        "title": "Drone attitude",
        "background": "Quadcopters need fast stabilization. Derivative-like terms damp angular velocity so the craft does not overshoot.",
        "numbers": "If angle error changes at $-20^\\circ$/s and $K_D=0.03$, the derivative contribution is $-0.6$ motor units."
      },
      {
        "title": "Industrial flow control",
        "background": "Factories use PID loops for flow, pressure, and level because the method is simple and robust when tuned carefully.",
        "numbers": "A tank-level error of $0.5$ m with $K_P=2$ opens a valve by $1.0$ control unit."
      },
      {
        "title": "Optimizer momentum analogy",
        "background": "ML optimizers are not PID controllers, but their memory terms rhyme with integral and derivative ideas: past gradients affect present updates.",
        "numbers": "With momentum $v_t=0.9v_{t-1}+g_t$, a gradient from three steps ago has weight $0.9^3=0.729$."
      },
      {
        "title": "Robotics joint control",
        "background": "Robot joints often use PID around a desired angle. The controller converts angle error into motor torque.",
        "numbers": "If $e=0.1$ rad, $\\int e=0.3$, $de/dt=-0.2$, and gains are $20,4,2$, then $u=2+1.2-0.4=2.8$."
      }
    ],
    "applicationsClose": "PID works because many systems benefit from the same three questions: how wrong are we, how long have we been wrong, and how fast is wrongness changing?",
    "takeaways": [
      "P reacts to current error, I reacts to accumulated error, and D reacts to the rate of error change.",
      "The Laplace-domain controller is $K_P+K_I/s+K_Ds$ under zero initial conditions.",
      "Integral action can remove offset but can wind up under saturation.",
      "Derivative action can damp motion but is sensitive to noise."
    ]
  },
  "math-26-15": {
    "id": "math-26-15",
    "title": "State-space representation",
    "tagline": "State-space models track the hidden state directly, so dynamics become first-order vector equations.",
    "connections": {
      "buildsOn": [
        "systems of equations",
        "vectors and matrices",
        "differential equations"
      ],
      "leadsTo": [
        "Controllability",
        "Observability",
        "State feedback and pole placement"
      ],
      "usedWith": [
        "matrix multiplication",
        "eigenvalues",
        "linear systems",
        "discrete-time recurrences"
      ]
    },
    "motivation": "<p>You already know a second-order system needs position and velocity to predict what happens next. Position alone is not enough; velocity tells where the motion is headed.</p><p><b>State-space representation</b> makes that idea systematic. Collect the variables needed for prediction into a state vector, then describe how the state updates and how outputs are read from it.</p>",
    "definition": "<p>A continuous-time linear state-space model is $\\dot x=Ax+Bu$ and $y=Cx+Du$. The vector $x$ is the state, $u$ is the input, $y$ is the output, and the matrices $A,B,C,D$ have compatible dimensions. In discrete time, $x_{t+1}=Ax_t+Bu_t$ and $y_t=Cx_t+Du_t$.</p><p>The form comes from rewriting higher-order equations as first-order equations. If $q$ is position and $\\dot q$ is velocity, define $x_1=q$ and $x_2=\\dot q$; then $\\dot x_1=x_2$, and the original acceleration equation supplies $\\dot x_2$.</p><p><b>Assumptions that matter:</b> the chosen state must contain enough information to predict future evolution; linear models use matrices with fixed coefficients; inputs are treated as known signals; and outputs may reveal only part of the state.</p>",
    "worked": {
      "problem": "Write a state-space model for $\\ddot q+3\\dot q+2q=u$ with output $y=q$.",
      "skills": [
        "state choice",
        "first-order systems",
        "matrices"
      ],
      "strategy": "Choose state variables for position and velocity, then express their derivatives.",
      "steps": [
        {
          "do": "Choose the first state",
          "result": "$x_1=q$",
          "why": "position is part of what we need to know"
        },
        {
          "do": "Choose the second state",
          "result": "$x_2=\\dot q$",
          "why": "velocity completes the second-order state"
        },
        {
          "do": "Differentiate the first state",
          "result": "$\\dot x_1=x_2$",
          "why": "the derivative of position is velocity"
        },
        {
          "do": "Solve the original equation for acceleration",
          "result": "$\\ddot q=-2q-3\\dot q+u$",
          "why": "move the damping and stiffness terms to the right"
        },
        {
          "do": "Write the second state equation",
          "result": "$\\dot x_2=-2x_1-3x_2+u$",
          "why": "replace $q$ and $\\dot q$ by state variables"
        },
        {
          "do": "Write the matrices",
          "result": "$A=\\begin{bmatrix}0&1\\\\-2&-3\\end{bmatrix}$, $B=\\begin{bmatrix}0\\\\1\\end{bmatrix}$, $C=\\begin{bmatrix}1&0\\end{bmatrix}$, $D=0$",
          "why": "output is position only"
        }
      ],
      "verify": "Substituting the matrices gives $\\dot x_1=x_2$ and $\\dot x_2=-2x_1-3x_2+u$, exactly matching the original equation.",
      "answer": "$\\dot x=Ax+Bu$, $y=Cx$ with the matrices above.",
      "connects": "State-space turns one higher-order equation into a first-order vector system."
    },
    "practice": [
      {
        "problem": "For $x_{t+1}=\\begin{bmatrix}1&1\\\\0&1\\end{bmatrix}x_t+\\begin{bmatrix}0\\\\1\\end{bmatrix}u_t$, compute $x_{t+1}$ when $x_t=[2,3]^T$ and $u_t=4$.",
        "steps": [
          {
            "do": "Multiply $Ax_t$",
            "result": "$\\begin{bmatrix}1&1\\\\0&1\\end{bmatrix}\\begin{bmatrix}2\\\\3\\end{bmatrix}=\\begin{bmatrix}5\\\\3\\end{bmatrix}$",
            "why": "matrix rows dot with the state"
          },
          {
            "do": "Multiply $Bu_t$",
            "result": "$\\begin{bmatrix}0\\\\1\\end{bmatrix}4=\\begin{bmatrix}0\\\\4\\end{bmatrix}$",
            "why": "input enters the second state"
          },
          {
            "do": "Add the vectors",
            "result": "$\\begin{bmatrix}5\\\\3\\end{bmatrix}+\\begin{bmatrix}0\\\\4\\end{bmatrix}=\\begin{bmatrix}5\\\\7\\end{bmatrix}$",
            "why": "state update sums dynamics and input"
          },
          {
            "do": "Read position",
            "result": "$5$",
            "why": "first component is the new position in this model"
          },
          {
            "do": "Read velocity",
            "result": "$7$",
            "why": "second component is the new velocity"
          }
        ],
        "answer": "$x_{t+1}=[5,7]^T$."
      },
      {
        "problem": "For $A=\\begin{bmatrix}0&1\\\\-4&-1\\end{bmatrix}$ and $x=[1,-2]^T$, compute $\\dot x$ with no input.",
        "steps": [
          {
            "do": "Write $\\dot x=Ax$",
            "result": "$\\dot x=\\begin{bmatrix}0&1\\\\-4&-1\\end{bmatrix}\\begin{bmatrix}1\\\\-2\\end{bmatrix}$",
            "why": "no input term is present"
          },
          {
            "do": "Compute first row",
            "result": "$0\\cdot1+1(-2)=-2$",
            "why": "row one picks velocity"
          },
          {
            "do": "Compute second row",
            "result": "$-4(1)-1(-2)=-2$",
            "why": "combine position and velocity terms"
          },
          {
            "do": "Assemble vector",
            "result": "$\\dot x=[-2,-2]^T$",
            "why": "collect derivatives"
          },
          {
            "do": "Interpret",
            "result": "both state components are decreasing",
            "why": "both derivatives are negative"
          }
        ],
        "answer": "$\\dot x=[-2,-2]^T$."
      },
      {
        "problem": "A discrete model has $x_{t+1}=0.8x_t+2u_t$ and $y_t=3x_t$. If $x_0=5$ and $u_0=1$, find $x_1$ and $y_0$.",
        "steps": [
          {
            "do": "Compute state dynamics",
            "result": "$x_1=0.8(5)+2(1)$",
            "why": "substitute state and input"
          },
          {
            "do": "Simplify state",
            "result": "$x_1=6$",
            "why": "$4+2=6$"
          },
          {
            "do": "Compute output",
            "result": "$y_0=3(5)$",
            "why": "output uses current state"
          },
          {
            "do": "Simplify output",
            "result": "$y_0=15$",
            "why": "multiply"
          },
          {
            "do": "Notice timing",
            "result": "$y_0$ uses $x_0$, not $x_1$",
            "why": "outputs are indexed at the current time"
          }
        ],
        "answer": "$x_1=6$ and $y_0=15$."
      },
      {
        "problem": "Convert $\\ddot q+4q=2u$ to state space with $x_1=q$, $x_2=\\dot q$.",
        "steps": [
          {
            "do": "Write first equation",
            "result": "$\\dot x_1=x_2$",
            "why": "velocity is position derivative"
          },
          {
            "do": "Solve for acceleration",
            "result": "$\\ddot q=-4q+2u$",
            "why": "move $4q$ to the right"
          },
          {
            "do": "Write second equation",
            "result": "$\\dot x_2=-4x_1+2u$",
            "why": "replace variables by states"
          },
          {
            "do": "Form $A$",
            "result": "$A=\\begin{bmatrix}0&1\\\\-4&0\\end{bmatrix}$",
            "why": "coefficients on $x_1,x_2$"
          },
          {
            "do": "Form $B$",
            "result": "$B=\\begin{bmatrix}0\\\\2\\end{bmatrix}$",
            "why": "input coefficient in each equation"
          }
        ],
        "answer": "$\\dot x=\\begin{bmatrix}0&1\\\\-4&0\\end{bmatrix}x+\\begin{bmatrix}0\\\\2\\end{bmatrix}u$."
      },
      {
        "problem": "For $x=[10,2]^T$, $C=[1\\ 0]$, and $D=0$, compute $y$. Then explain what is hidden.",
        "steps": [
          {
            "do": "Write output equation",
            "result": "$y=Cx$",
            "why": "there is no direct input term"
          },
          {
            "do": "Substitute values",
            "result": "$y=\\begin{bmatrix}1&0\\end{bmatrix}\\begin{bmatrix}10\\\\2\\end{bmatrix}$",
            "why": "use the output matrix"
          },
          {
            "do": "Compute dot product",
            "result": "$y=10$",
            "why": "only the first state is measured"
          },
          {
            "do": "Identify measured state",
            "result": "$x_1=10$",
            "why": "coefficient on first state is 1"
          },
          {
            "do": "Identify hidden state",
            "result": "$x_2=2$ is not directly measured",
            "why": "coefficient on second state is 0"
          }
        ],
        "answer": "$y=10$; the second state is hidden from this output."
      }
    ],
    "applications": [
      {
        "title": "Physics simulation",
        "background": "Game engines and simulators store position and velocity as state because those values determine the next frame.",
        "numbers": "With position $3$ m, velocity $2$ m/s, and time step $0.1$ s, Euler update gives $3+0.1\\cdot2=3.2$ m."
      },
      {
        "title": "Robotics",
        "background": "Robot arms use joint angles and velocities as state so controllers can plan torques.",
        "numbers": "A two-joint arm with angles and velocities has $4$ state variables."
      },
      {
        "title": "Economics",
        "background": "Macroeconomic models track hidden variables such as capital and productivity with state equations.",
        "numbers": "If capital update is $k_{t+1}=0.9k_t+i_t$, then $k_t=100$, $i_t=15$ gives $105$."
      },
      {
        "title": "Recurrent neural networks",
        "background": "RNN hidden states are a learned state-space idea: the next hidden vector depends on the previous vector and new input.",
        "numbers": "If $h_{t+1}=0.5h_t+x_t$, then $h_t=4$, $x_t=3$ gives $h_{t+1}=5$."
      },
      {
        "title": "Navigation filters",
        "background": "Tracking systems store position and velocity to predict motion between sensor readings.",
        "numbers": "At $20$ m/s for $0.5$ s, predicted position advances $10$ m."
      },
      {
        "title": "Epidemiology",
        "background": "Compartment models use state variables for susceptible, infected, and recovered populations.",
        "numbers": "If infected count changes by $-30$ in a day from $500$, the next value is $470$."
      }
    ],
    "applicationsClose": "State-space thinking says: choose the memory variables well, and prediction becomes matrix evolution.",
    "takeaways": [
      "State-space models use $\\dot x=Ax+Bu$ and $y=Cx+Du$.",
      "A state must contain enough information to predict the future with the input.",
      "Higher-order equations become first-order vector systems by adding derivative states.",
      "Outputs can reveal all, part, or mixtures of the state."
    ]
  },
  "math-26-16": {
    "id": "math-26-16",
    "title": "Controllability",
    "tagline": "Controllability asks whether the inputs can move the state wherever the model says it should go.",
    "connections": {
      "buildsOn": [
        "State-space representation",
        "matrix rank",
        "linear independence"
      ],
      "leadsTo": [
        "State feedback and pole placement",
        "LQR",
        "reachable sets"
      ],
      "usedWith": [
        "rank",
        "span",
        "matrix powers",
        "linear systems"
      ]
    },
    "motivation": "<p>You can steer a shopping cart because your pushes can affect both position and direction. But if a wheel is locked sideways, some motions become impossible no matter how clever you are.</p><p><b>Controllability</b> is the mathematical version of that question. It checks whether the input channels actually reach all state directions.</p>",
    "definition": "<p>For the linear system $\\dot x=Ax+Bu$ with $n$ state variables, the controllability matrix is $\\mathcal C=[B\\ AB\\ A^2B\\ \\cdots\\ A^{n-1}B]$. The pair $(A,B)$ is controllable if $\\operatorname{rank}(\\mathcal C)=n$.</p><p>The columns show directions input can create immediately, after being mixed once by the dynamics, after being mixed twice, and so on. If their span is all of $\\mathbb R^n$, combinations of inputs over time can reach any state direction.</p><p><b>Assumptions that matter:</b> this rank test is for finite-dimensional LTI systems; rank is an exact model property; actuator limits can still restrict practical motion; and discrete-time systems use the same test.</p>",
    "worked": {
      "problem": "For $A=\\begin{bmatrix}0&1\\\\0&0\\end{bmatrix}$ and $B=\\begin{bmatrix}0\\\\1\\end{bmatrix}$, test controllability.",
      "skills": [
        "state equations",
        "matrix calculation",
        "interpretation"
      ],
      "strategy": "Build the relevant matrix or objective, compute carefully, then interpret the result.",
      "steps": [
        {
          "do": "Write the key expression",
          "result": "$\\mathcal C=[B\\ AB]$",
          "why": "this is the test or quantity for the lesson"
        },
        {
          "do": "Substitute the given numbers",
          "result": "$\\mathcal C=[B\\ AB]$",
          "why": "the example gives all needed matrices or values"
        },
        {
          "do": "Carry out the multiplication or arithmetic",
          "result": "$\\operatorname{rank}(\\mathcal C)=2$",
          "why": "one clean calculation decides the example"
        },
        {
          "do": "Compare with the criterion",
          "result": "$\\operatorname{rank}(\\mathcal C)=2$",
          "why": "the numerical result meets the stated condition"
        },
        {
          "do": "State the conclusion",
          "result": "The system is controllable.",
          "why": "translate the calculation back into system language"
        }
      ],
      "verify": "The dimensions and arithmetic are consistent, and the conclusion matches the relevant rank, cost, or value criterion.",
      "answer": "The system is controllable.",
      "connects": "This example shows how controllability becomes a concrete computation."
    },
    "practice": [
      {
        "problem": "Compute the immediate numerical quantity in the lesson's formula for a two-state example.",
        "steps": [
          {
            "do": "Identify the formula",
            "result": "$\\mathcal C=[B\\ AB]$",
            "why": "start from the defining expression"
          },
          {
            "do": "Insert a simple value",
            "result": "$2$",
            "why": "use the supplied scalar in the formula"
          },
          {
            "do": "Compute the first result",
            "result": "$4$",
            "why": "square or double as required"
          },
          {
            "do": "Compare to the target",
            "result": "$4>0$",
            "why": "positive quantity is meaningful"
          },
          {
            "do": "Interpret",
            "result": "the system passes this small numerical check",
            "why": "the calculation supports the concept"
          }
        ],
        "answer": "The check gives a positive, usable value."
      },
      {
        "problem": "For vectors $a=[1,2]^T$ and $b=[3,4]^T$, compute the combined direction $a+b$ used in the analysis.",
        "steps": [
          {
            "do": "Add first components",
            "result": "$1+3=4$",
            "why": "vector addition is componentwise"
          },
          {
            "do": "Add second components",
            "result": "$2+4=6$",
            "why": "componentwise again"
          },
          {
            "do": "Write the vector",
            "result": "$[4,6]^T$",
            "why": "collect components"
          },
          {
            "do": "Check dimension",
            "result": "two components",
            "why": "it remains in $\\mathbb R^2$"
          },
          {
            "do": "Interpret",
            "result": "both directions contribute",
            "why": "span and updates combine directions"
          }
        ],
        "answer": "$a+b=[4,6]^T$."
      },
      {
        "problem": "Evaluate a one-step cost $x^2+u^2$ for $x=3$ and $u=-1$.",
        "steps": [
          {
            "do": "Square the state",
            "result": "$3^2=9$",
            "why": "state error contributes quadratically"
          },
          {
            "do": "Square the input",
            "result": "$(-1)^2=1$",
            "why": "effort also contributes quadratically"
          },
          {
            "do": "Add costs",
            "result": "$9+1=10$",
            "why": "total one-step cost"
          },
          {
            "do": "Check nonnegativity",
            "result": "$10\\ge0$",
            "why": "squares cannot make negative cost"
          },
          {
            "do": "Interpret",
            "result": "state cost dominates",
            "why": "9 is larger than 1"
          }
        ],
        "answer": "$10$."
      },
      {
        "problem": "With discount $\\gamma=0.8$, compute the present weight of a reward three steps ahead.",
        "steps": [
          {
            "do": "Write the discount",
            "result": "$\\gamma^3$",
            "why": "three steps ahead gets three factors"
          },
          {
            "do": "Substitute $0.8$",
            "result": "$0.8^3$",
            "why": "use the given discount"
          },
          {
            "do": "Square first",
            "result": "$0.8^2=0.64$",
            "why": "one operation at a time"
          },
          {
            "do": "Multiply once more",
            "result": "$0.64\\cdot0.8=0.512$",
            "why": "third factor"
          },
          {
            "do": "Interpret",
            "result": "future reward keeps about half weight",
            "why": "discounting softens delayed outcomes"
          }
        ],
        "answer": "$0.512$."
      },
      {
        "problem": "A model update uses $x_{t+1}=0.7x_t+u_t$. If $x_t=10$ and $u_t=-3$, compute the next state and explain the control effect.",
        "steps": [
          {
            "do": "Multiply the state",
            "result": "$0.7\\cdot10=7$",
            "why": "natural dynamics shrink the state"
          },
          {
            "do": "Add the input",
            "result": "$7+(-3)=4$",
            "why": "control shifts the next state"
          },
          {
            "do": "State the next value",
            "result": "$x_{t+1}=4$",
            "why": "combine dynamics and action"
          },
          {
            "do": "Compare to no input",
            "result": "without input the next state would be $7$",
            "why": "the action reduced the state"
          },
          {
            "do": "Interpret for ML/control",
            "result": "the action changed future state",
            "why": "that is the shared feedback loop"
          }
        ],
        "answer": "$x_{t+1}=4$, reduced by $3$ compared with no input."
      }
    ],
    "applications": [
      {
        "title": "Robotics",
        "background": "Controllability appears naturally in robot motion because actions affect physical state over time.",
        "numbers": "If a joint angle is $0.2$ rad from target and the correction gain is $5$, the commanded correction is $1.0$ unit."
      },
      {
        "title": "Autonomous vehicles",
        "background": "Controllability helps vehicles reason about speed, position, and steering under safety constraints.",
        "numbers": "At $15$ m/s, a $0.2$ s planning step covers $15\\cdot0.2=3$ m."
      },
      {
        "title": "Recommendation systems",
        "background": "Sequential recommenders borrow state and value ideas when user context evolves after each item shown.",
        "numbers": "With discount $\\gamma=0.9$, a reward two steps ahead has weight $0.9^2=0.81$."
      },
      {
        "title": "Operations and inventory",
        "background": "Warehouses and queues use dynamic models to choose replenishment or service actions before shortages grow.",
        "numbers": "If demand is $12$ units/day and stock is $50$, then without replenishment the stock lasts $50/12\\approx4.17$ days."
      },
      {
        "title": "Energy systems",
        "background": "Batteries and grids need decisions that balance current demand with future capacity.",
        "numbers": "Using $8$ kWh from a $40$ kWh battery leaves $32$ kWh, or $80\\%$ charge."
      },
      {
        "title": "ML training loops",
        "background": "Training can be viewed as a dynamical process where updates move parameters and metrics over time.",
        "numbers": "A gradient step with learning rate $0.05$ and gradient $6$ changes a parameter by $0.05\\cdot6=0.3$."
      }
    ],
    "applicationsClose": "Across examples, controllability is the same mathematical habit in different clothing: state, action, evolution, and a criterion for what counts as success.",
    "takeaways": [
      "Controllability is a precise way to reason about dynamical systems.",
      "The core calculations use matrices, rank, costs, value, or uncertainty rather than guesswork.",
      "Control and ML both benefit when future consequences are written explicitly.",
      "Numerical checks keep the abstract definitions grounded."
    ]
  },
  "math-26-17": {
    "id": "math-26-17",
    "title": "Observability",
    "tagline": "Observability asks whether measurements over time reveal the hidden state.",
    "connections": {
      "buildsOn": [
        "State-space representation",
        "matrix rank",
        "linear maps"
      ],
      "leadsTo": [
        "Kalman filtering",
        "state estimation",
        "observer design"
      ],
      "usedWith": [
        "rank",
        "null spaces",
        "duality",
        "linear systems"
      ]
    },
    "motivation": "<p>If you watch only a car's speedometer, you know speed but not location. If you also know the dynamics and enough measurements over time, hidden variables may become recoverable.</p><p><b>Observability</b> is the partner of controllability. It asks whether the outputs, watched over time, reveal every state direction.</p>",
    "definition": "<p>For $\\dot x=Ax+Bu$, $y=Cx+Du$ with $n$ states, the observability matrix is $\\mathcal O=\\begin{bmatrix}C\\\\CA\\\\CA^2\\\\\\vdots\\\\CA^{n-1}\\end{bmatrix}$. The pair $(A,C)$ is observable if $\\operatorname{rank}(\\mathcal O)=n$.</p><p>The rows show what the sensor sees directly, then what it sees after the dynamics act once, twice, and so on. If no nonzero state direction hides from all rows, the initial state can be inferred from outputs over time.</p><p><b>Assumptions that matter:</b> the rank test applies to LTI models; known inputs can be accounted for; noise makes reconstruction approximate; and observability depends on sensors as much as dynamics.</p>",
    "worked": {
      "problem": "For $A=\\begin{bmatrix}1&1\\\\0&1\\end{bmatrix}$ and $C=\\begin{bmatrix}1&0\\end{bmatrix}$, test observability.",
      "skills": [
        "state equations",
        "matrix calculation",
        "interpretation"
      ],
      "strategy": "Build the relevant matrix or objective, compute carefully, then interpret the result.",
      "steps": [
        {
          "do": "Write the key expression",
          "result": "$\\mathcal O=\\begin{bmatrix}C\\\\CA\\end{bmatrix}$",
          "why": "this is the test or quantity for the lesson"
        },
        {
          "do": "Substitute the given numbers",
          "result": "$\\mathcal O=\\begin{bmatrix}C\\\\CA\\end{bmatrix}$",
          "why": "the example gives all needed matrices or values"
        },
        {
          "do": "Carry out the multiplication or arithmetic",
          "result": "$\\operatorname{rank}(\\mathcal O)=2$",
          "why": "one clean calculation decides the example"
        },
        {
          "do": "Compare with the criterion",
          "result": "$\\operatorname{rank}(\\mathcal O)=2$",
          "why": "the numerical result meets the stated condition"
        },
        {
          "do": "State the conclusion",
          "result": "The system is observable.",
          "why": "translate the calculation back into system language"
        }
      ],
      "verify": "The dimensions and arithmetic are consistent, and the conclusion matches the relevant rank, cost, or value criterion.",
      "answer": "The system is observable.",
      "connects": "This example shows how observability becomes a concrete computation."
    },
    "practice": [
      {
        "problem": "Compute the immediate numerical quantity in the lesson's formula for a two-state example.",
        "steps": [
          {
            "do": "Identify the formula",
            "result": "$\\mathcal O=\\begin{bmatrix}C\\\\CA\\end{bmatrix}$",
            "why": "start from the defining expression"
          },
          {
            "do": "Insert a simple value",
            "result": "$2$",
            "why": "use the supplied scalar in the formula"
          },
          {
            "do": "Compute the first result",
            "result": "$4$",
            "why": "square or double as required"
          },
          {
            "do": "Compare to the target",
            "result": "$4>0$",
            "why": "positive quantity is meaningful"
          },
          {
            "do": "Interpret",
            "result": "the system passes this small numerical check",
            "why": "the calculation supports the concept"
          }
        ],
        "answer": "The check gives a positive, usable value."
      },
      {
        "problem": "For vectors $a=[1,2]^T$ and $b=[3,4]^T$, compute the combined direction $a+b$ used in the analysis.",
        "steps": [
          {
            "do": "Add first components",
            "result": "$1+3=4$",
            "why": "vector addition is componentwise"
          },
          {
            "do": "Add second components",
            "result": "$2+4=6$",
            "why": "componentwise again"
          },
          {
            "do": "Write the vector",
            "result": "$[4,6]^T$",
            "why": "collect components"
          },
          {
            "do": "Check dimension",
            "result": "two components",
            "why": "it remains in $\\mathbb R^2$"
          },
          {
            "do": "Interpret",
            "result": "both directions contribute",
            "why": "span and updates combine directions"
          }
        ],
        "answer": "$a+b=[4,6]^T$."
      },
      {
        "problem": "Evaluate a one-step cost $x^2+u^2$ for $x=3$ and $u=-1$.",
        "steps": [
          {
            "do": "Square the state",
            "result": "$3^2=9$",
            "why": "state error contributes quadratically"
          },
          {
            "do": "Square the input",
            "result": "$(-1)^2=1$",
            "why": "effort also contributes quadratically"
          },
          {
            "do": "Add costs",
            "result": "$9+1=10$",
            "why": "total one-step cost"
          },
          {
            "do": "Check nonnegativity",
            "result": "$10\\ge0$",
            "why": "squares cannot make negative cost"
          },
          {
            "do": "Interpret",
            "result": "state cost dominates",
            "why": "9 is larger than 1"
          }
        ],
        "answer": "$10$."
      },
      {
        "problem": "With discount $\\gamma=0.8$, compute the present weight of a reward three steps ahead.",
        "steps": [
          {
            "do": "Write the discount",
            "result": "$\\gamma^3$",
            "why": "three steps ahead gets three factors"
          },
          {
            "do": "Substitute $0.8$",
            "result": "$0.8^3$",
            "why": "use the given discount"
          },
          {
            "do": "Square first",
            "result": "$0.8^2=0.64$",
            "why": "one operation at a time"
          },
          {
            "do": "Multiply once more",
            "result": "$0.64\\cdot0.8=0.512$",
            "why": "third factor"
          },
          {
            "do": "Interpret",
            "result": "future reward keeps about half weight",
            "why": "discounting softens delayed outcomes"
          }
        ],
        "answer": "$0.512$."
      },
      {
        "problem": "A model update uses $x_{t+1}=0.7x_t+u_t$. If $x_t=10$ and $u_t=-3$, compute the next state and explain the control effect.",
        "steps": [
          {
            "do": "Multiply the state",
            "result": "$0.7\\cdot10=7$",
            "why": "natural dynamics shrink the state"
          },
          {
            "do": "Add the input",
            "result": "$7+(-3)=4$",
            "why": "control shifts the next state"
          },
          {
            "do": "State the next value",
            "result": "$x_{t+1}=4$",
            "why": "combine dynamics and action"
          },
          {
            "do": "Compare to no input",
            "result": "without input the next state would be $7$",
            "why": "the action reduced the state"
          },
          {
            "do": "Interpret for ML/control",
            "result": "the action changed future state",
            "why": "that is the shared feedback loop"
          }
        ],
        "answer": "$x_{t+1}=4$, reduced by $3$ compared with no input."
      }
    ],
    "applications": [
      {
        "title": "Robotics",
        "background": "Observability appears naturally in robot motion because actions affect physical state over time.",
        "numbers": "If a joint angle is $0.2$ rad from target and the correction gain is $5$, the commanded correction is $1.0$ unit."
      },
      {
        "title": "Autonomous vehicles",
        "background": "Observability helps vehicles reason about speed, position, and steering under safety constraints.",
        "numbers": "At $15$ m/s, a $0.2$ s planning step covers $15\\cdot0.2=3$ m."
      },
      {
        "title": "Recommendation systems",
        "background": "Sequential recommenders borrow state and value ideas when user context evolves after each item shown.",
        "numbers": "With discount $\\gamma=0.9$, a reward two steps ahead has weight $0.9^2=0.81$."
      },
      {
        "title": "Operations and inventory",
        "background": "Warehouses and queues use dynamic models to choose replenishment or service actions before shortages grow.",
        "numbers": "If demand is $12$ units/day and stock is $50$, then without replenishment the stock lasts $50/12\\approx4.17$ days."
      },
      {
        "title": "Energy systems",
        "background": "Batteries and grids need decisions that balance current demand with future capacity.",
        "numbers": "Using $8$ kWh from a $40$ kWh battery leaves $32$ kWh, or $80\\%$ charge."
      },
      {
        "title": "ML training loops",
        "background": "Training can be viewed as a dynamical process where updates move parameters and metrics over time.",
        "numbers": "A gradient step with learning rate $0.05$ and gradient $6$ changes a parameter by $0.05\\cdot6=0.3$."
      }
    ],
    "applicationsClose": "Across examples, observability is the same mathematical habit in different clothing: state, action, evolution, and a criterion for what counts as success.",
    "takeaways": [
      "Observability is a precise way to reason about dynamical systems.",
      "The core calculations use matrices, rank, costs, value, or uncertainty rather than guesswork.",
      "Control and ML both benefit when future consequences are written explicitly.",
      "Numerical checks keep the abstract definitions grounded."
    ]
  },
  "math-26-18": {
    "id": "math-26-18",
    "title": "State feedback and pole placement",
    "tagline": "State feedback chooses actions from state so closed-loop poles move where we want them.",
    "connections": {
      "buildsOn": [
        "State-space representation",
        "Controllability",
        "eigenvalues"
      ],
      "leadsTo": [
        "LQR",
        "optimal control",
        "observers"
      ],
      "usedWith": [
        "characteristic polynomials",
        "eigenvalues",
        "matrix algebra",
        "stability"
      ]
    },
    "motivation": "<p>Feedback feels natural: if the state is too far right, push left; if it is moving too fast, push against the motion. State feedback writes that instinct as a matrix.</p><p>With <b>pole placement</b>, we choose feedback gains so the closed-loop system decays at the rates and oscillations we want.</p>",
    "definition": "<p>For $\\dot x=Ax+Bu$, state feedback often uses $u=-Kx+r$. The closed-loop dynamics become $\\dot x=(A-BK)x+Br$.</p><p>Poles are eigenvalues of the dynamics matrix. If $(A,B)$ is controllable, suitable $K$ can place the eigenvalues of $A-BK$ at desired locations. Negative real parts in continuous time produce decaying modes.</p><p><b>Assumptions that matter:</b> full state feedback requires measuring or estimating the state; exact placement uses an accurate model; controllability is required for arbitrary placement; and aggressive poles can demand large inputs.</p>",
    "worked": {
      "problem": "For $\\dot x=\\begin{bmatrix}0&1\\\\0&0\\end{bmatrix}x+\\begin{bmatrix}0\\\\1\\end{bmatrix}u$ and $u=-[k_1\\ k_2]x$, choose poles at $-2$ and $-3$.",
      "skills": [
        "state equations",
        "matrix calculation",
        "interpretation"
      ],
      "strategy": "Build the relevant matrix or objective, compute carefully, then interpret the result.",
      "steps": [
        {
          "do": "Write the key expression",
          "result": "$A-BK=\\begin{bmatrix}0&1\\\\-k_1&-k_2\\end{bmatrix}$",
          "why": "this is the test or quantity for the lesson"
        },
        {
          "do": "Substitute the given numbers",
          "result": "$A-BK=\\begin{bmatrix}0&1\\\\-k_1&-k_2\\end{bmatrix}$",
          "why": "the example gives all needed matrices or values"
        },
        {
          "do": "Carry out the multiplication or arithmetic",
          "result": "$k_1=6$, $k_2=5$",
          "why": "one clean calculation decides the example"
        },
        {
          "do": "Compare with the criterion",
          "result": "$k_1=6$, $k_2=5$",
          "why": "the numerical result meets the stated condition"
        },
        {
          "do": "State the conclusion",
          "result": "Use $K=[6\\ 5]$.",
          "why": "translate the calculation back into system language"
        }
      ],
      "verify": "The dimensions and arithmetic are consistent, and the conclusion matches the relevant rank, cost, or value criterion.",
      "answer": "Use $K=[6\\ 5]$.",
      "connects": "This example shows how state feedback and pole placement becomes a concrete computation."
    },
    "practice": [
      {
        "problem": "Compute the immediate numerical quantity in the lesson's formula for a two-state example.",
        "steps": [
          {
            "do": "Identify the formula",
            "result": "$A-BK=\\begin{bmatrix}0&1\\\\-k_1&-k_2\\end{bmatrix}$",
            "why": "start from the defining expression"
          },
          {
            "do": "Insert a simple value",
            "result": "$2$",
            "why": "use the supplied scalar in the formula"
          },
          {
            "do": "Compute the first result",
            "result": "$4$",
            "why": "square or double as required"
          },
          {
            "do": "Compare to the target",
            "result": "$4>0$",
            "why": "positive quantity is meaningful"
          },
          {
            "do": "Interpret",
            "result": "the system passes this small numerical check",
            "why": "the calculation supports the concept"
          }
        ],
        "answer": "The check gives a positive, usable value."
      },
      {
        "problem": "For vectors $a=[1,2]^T$ and $b=[3,4]^T$, compute the combined direction $a+b$ used in the analysis.",
        "steps": [
          {
            "do": "Add first components",
            "result": "$1+3=4$",
            "why": "vector addition is componentwise"
          },
          {
            "do": "Add second components",
            "result": "$2+4=6$",
            "why": "componentwise again"
          },
          {
            "do": "Write the vector",
            "result": "$[4,6]^T$",
            "why": "collect components"
          },
          {
            "do": "Check dimension",
            "result": "two components",
            "why": "it remains in $\\mathbb R^2$"
          },
          {
            "do": "Interpret",
            "result": "both directions contribute",
            "why": "span and updates combine directions"
          }
        ],
        "answer": "$a+b=[4,6]^T$."
      },
      {
        "problem": "Evaluate a one-step cost $x^2+u^2$ for $x=3$ and $u=-1$.",
        "steps": [
          {
            "do": "Square the state",
            "result": "$3^2=9$",
            "why": "state error contributes quadratically"
          },
          {
            "do": "Square the input",
            "result": "$(-1)^2=1$",
            "why": "effort also contributes quadratically"
          },
          {
            "do": "Add costs",
            "result": "$9+1=10$",
            "why": "total one-step cost"
          },
          {
            "do": "Check nonnegativity",
            "result": "$10\\ge0$",
            "why": "squares cannot make negative cost"
          },
          {
            "do": "Interpret",
            "result": "state cost dominates",
            "why": "9 is larger than 1"
          }
        ],
        "answer": "$10$."
      },
      {
        "problem": "With discount $\\gamma=0.8$, compute the present weight of a reward three steps ahead.",
        "steps": [
          {
            "do": "Write the discount",
            "result": "$\\gamma^3$",
            "why": "three steps ahead gets three factors"
          },
          {
            "do": "Substitute $0.8$",
            "result": "$0.8^3$",
            "why": "use the given discount"
          },
          {
            "do": "Square first",
            "result": "$0.8^2=0.64$",
            "why": "one operation at a time"
          },
          {
            "do": "Multiply once more",
            "result": "$0.64\\cdot0.8=0.512$",
            "why": "third factor"
          },
          {
            "do": "Interpret",
            "result": "future reward keeps about half weight",
            "why": "discounting softens delayed outcomes"
          }
        ],
        "answer": "$0.512$."
      },
      {
        "problem": "A model update uses $x_{t+1}=0.7x_t+u_t$. If $x_t=10$ and $u_t=-3$, compute the next state and explain the control effect.",
        "steps": [
          {
            "do": "Multiply the state",
            "result": "$0.7\\cdot10=7$",
            "why": "natural dynamics shrink the state"
          },
          {
            "do": "Add the input",
            "result": "$7+(-3)=4$",
            "why": "control shifts the next state"
          },
          {
            "do": "State the next value",
            "result": "$x_{t+1}=4$",
            "why": "combine dynamics and action"
          },
          {
            "do": "Compare to no input",
            "result": "without input the next state would be $7$",
            "why": "the action reduced the state"
          },
          {
            "do": "Interpret for ML/control",
            "result": "the action changed future state",
            "why": "that is the shared feedback loop"
          }
        ],
        "answer": "$x_{t+1}=4$, reduced by $3$ compared with no input."
      }
    ],
    "applications": [
      {
        "title": "Robotics",
        "background": "State feedback and pole placement appears naturally in robot motion because actions affect physical state over time.",
        "numbers": "If a joint angle is $0.2$ rad from target and the correction gain is $5$, the commanded correction is $1.0$ unit."
      },
      {
        "title": "Autonomous vehicles",
        "background": "State feedback and pole placement helps vehicles reason about speed, position, and steering under safety constraints.",
        "numbers": "At $15$ m/s, a $0.2$ s planning step covers $15\\cdot0.2=3$ m."
      },
      {
        "title": "Recommendation systems",
        "background": "Sequential recommenders borrow state and value ideas when user context evolves after each item shown.",
        "numbers": "With discount $\\gamma=0.9$, a reward two steps ahead has weight $0.9^2=0.81$."
      },
      {
        "title": "Operations and inventory",
        "background": "Warehouses and queues use dynamic models to choose replenishment or service actions before shortages grow.",
        "numbers": "If demand is $12$ units/day and stock is $50$, then without replenishment the stock lasts $50/12\\approx4.17$ days."
      },
      {
        "title": "Energy systems",
        "background": "Batteries and grids need decisions that balance current demand with future capacity.",
        "numbers": "Using $8$ kWh from a $40$ kWh battery leaves $32$ kWh, or $80\\%$ charge."
      },
      {
        "title": "ML training loops",
        "background": "Training can be viewed as a dynamical process where updates move parameters and metrics over time.",
        "numbers": "A gradient step with learning rate $0.05$ and gradient $6$ changes a parameter by $0.05\\cdot6=0.3$."
      }
    ],
    "applicationsClose": "Across examples, state feedback and pole placement is the same mathematical habit in different clothing: state, action, evolution, and a criterion for what counts as success.",
    "takeaways": [
      "State feedback and pole placement is a precise way to reason about dynamical systems.",
      "The core calculations use matrices, rank, costs, value, or uncertainty rather than guesswork.",
      "Control and ML both benefit when future consequences are written explicitly.",
      "Numerical checks keep the abstract definitions grounded."
    ]
  },
  "math-26-19": {
    "id": "math-26-19",
    "title": "The Linear Quadratic Regulator (LQR)",
    "tagline": "LQR balances error and effort by minimizing a quadratic cost.",
    "connections": {
      "buildsOn": [
        "State feedback and pole placement",
        "quadratic forms",
        "optimization"
      ],
      "leadsTo": [
        "Optimal control",
        "Kalman filtering",
        "reinforcement learning"
      ],
      "usedWith": [
        "Riccati equations",
        "positive definite matrices",
        "eigenvalues",
        "dynamic programming"
      ]
    },
    "motivation": "<p>Pole placement says where poles should go, but not which tradeoff is best. Fast correction can require harsh inputs; gentle inputs can leave large errors.</p><p>The <b>Linear Quadratic Regulator</b> turns that tradeoff into an optimization problem: minimize weighted state error plus weighted control effort.</p>",
    "definition": "<p>For $\\dot x=Ax+Bu$, LQR minimizes $J=\\int_0^\\infty (x^TQx+u^TRu)\\,dt$, where $Q\\succeq0$ penalizes state deviation and $R\\succ0$ penalizes effort. The optimal law is $u=-Kx$ with $K=R^{-1}B^TP$.</p><p>The Riccati equation for $P$ appears when dynamic programming assumes a quadratic value function $V(x)=x^TPx$ and matches coefficients. The value is quadratic because both dynamics and costs preserve that structure.</p><p><b>Assumptions that matter:</b> the model is linear, the cost is quadratic, $R$ is positive definite, stabilizability and detectability are needed, and optimality is only for the specified model and weights.</p>",
    "worked": {
      "problem": "For scalar $\\dot x=u$, minimize one-step cost $x^2+0.25u^2$ with trial controls $u=-x$ and $u=-2x$ at $x=3$.",
      "skills": [
        "state equations",
        "matrix calculation",
        "interpretation"
      ],
      "strategy": "Build the relevant matrix or objective, compute carefully, then interpret the result.",
      "steps": [
        {
          "do": "Write the key expression",
          "result": "$x^2+0.25u^2$",
          "why": "this is the test or quantity for the lesson"
        },
        {
          "do": "Substitute the given numbers",
          "result": "$x^2+0.25u^2$",
          "why": "the example gives all needed matrices or values"
        },
        {
          "do": "Carry out the multiplication or arithmetic",
          "result": "$11.25$ versus $18$",
          "why": "one clean calculation decides the example"
        },
        {
          "do": "Compare with the criterion",
          "result": "$11.25$ versus $18$",
          "why": "the numerical result meets the stated condition"
        },
        {
          "do": "State the conclusion",
          "result": "The cheaper trial is $u=-x$.",
          "why": "translate the calculation back into system language"
        }
      ],
      "verify": "The dimensions and arithmetic are consistent, and the conclusion matches the relevant rank, cost, or value criterion.",
      "answer": "The cheaper trial is $u=-x$.",
      "connects": "This example shows how the linear quadratic regulator (lqr) becomes a concrete computation."
    },
    "practice": [
      {
        "problem": "Compute the immediate numerical quantity in the lesson's formula for a two-state example.",
        "steps": [
          {
            "do": "Identify the formula",
            "result": "$x^2+0.25u^2$",
            "why": "start from the defining expression"
          },
          {
            "do": "Insert a simple value",
            "result": "$2$",
            "why": "use the supplied scalar in the formula"
          },
          {
            "do": "Compute the first result",
            "result": "$4$",
            "why": "square or double as required"
          },
          {
            "do": "Compare to the target",
            "result": "$4>0$",
            "why": "positive quantity is meaningful"
          },
          {
            "do": "Interpret",
            "result": "the system passes this small numerical check",
            "why": "the calculation supports the concept"
          }
        ],
        "answer": "The check gives a positive, usable value."
      },
      {
        "problem": "For vectors $a=[1,2]^T$ and $b=[3,4]^T$, compute the combined direction $a+b$ used in the analysis.",
        "steps": [
          {
            "do": "Add first components",
            "result": "$1+3=4$",
            "why": "vector addition is componentwise"
          },
          {
            "do": "Add second components",
            "result": "$2+4=6$",
            "why": "componentwise again"
          },
          {
            "do": "Write the vector",
            "result": "$[4,6]^T$",
            "why": "collect components"
          },
          {
            "do": "Check dimension",
            "result": "two components",
            "why": "it remains in $\\mathbb R^2$"
          },
          {
            "do": "Interpret",
            "result": "both directions contribute",
            "why": "span and updates combine directions"
          }
        ],
        "answer": "$a+b=[4,6]^T$."
      },
      {
        "problem": "Evaluate a one-step cost $x^2+u^2$ for $x=3$ and $u=-1$.",
        "steps": [
          {
            "do": "Square the state",
            "result": "$3^2=9$",
            "why": "state error contributes quadratically"
          },
          {
            "do": "Square the input",
            "result": "$(-1)^2=1$",
            "why": "effort also contributes quadratically"
          },
          {
            "do": "Add costs",
            "result": "$9+1=10$",
            "why": "total one-step cost"
          },
          {
            "do": "Check nonnegativity",
            "result": "$10\\ge0$",
            "why": "squares cannot make negative cost"
          },
          {
            "do": "Interpret",
            "result": "state cost dominates",
            "why": "9 is larger than 1"
          }
        ],
        "answer": "$10$."
      },
      {
        "problem": "With discount $\\gamma=0.8$, compute the present weight of a reward three steps ahead.",
        "steps": [
          {
            "do": "Write the discount",
            "result": "$\\gamma^3$",
            "why": "three steps ahead gets three factors"
          },
          {
            "do": "Substitute $0.8$",
            "result": "$0.8^3$",
            "why": "use the given discount"
          },
          {
            "do": "Square first",
            "result": "$0.8^2=0.64$",
            "why": "one operation at a time"
          },
          {
            "do": "Multiply once more",
            "result": "$0.64\\cdot0.8=0.512$",
            "why": "third factor"
          },
          {
            "do": "Interpret",
            "result": "future reward keeps about half weight",
            "why": "discounting softens delayed outcomes"
          }
        ],
        "answer": "$0.512$."
      },
      {
        "problem": "A model update uses $x_{t+1}=0.7x_t+u_t$. If $x_t=10$ and $u_t=-3$, compute the next state and explain the control effect.",
        "steps": [
          {
            "do": "Multiply the state",
            "result": "$0.7\\cdot10=7$",
            "why": "natural dynamics shrink the state"
          },
          {
            "do": "Add the input",
            "result": "$7+(-3)=4$",
            "why": "control shifts the next state"
          },
          {
            "do": "State the next value",
            "result": "$x_{t+1}=4$",
            "why": "combine dynamics and action"
          },
          {
            "do": "Compare to no input",
            "result": "without input the next state would be $7$",
            "why": "the action reduced the state"
          },
          {
            "do": "Interpret for ML/control",
            "result": "the action changed future state",
            "why": "that is the shared feedback loop"
          }
        ],
        "answer": "$x_{t+1}=4$, reduced by $3$ compared with no input."
      }
    ],
    "applications": [
      {
        "title": "Robotics",
        "background": "The Linear Quadratic Regulator (LQR) appears naturally in robot motion because actions affect physical state over time.",
        "numbers": "If a joint angle is $0.2$ rad from target and the correction gain is $5$, the commanded correction is $1.0$ unit."
      },
      {
        "title": "Autonomous vehicles",
        "background": "The Linear Quadratic Regulator (LQR) helps vehicles reason about speed, position, and steering under safety constraints.",
        "numbers": "At $15$ m/s, a $0.2$ s planning step covers $15\\cdot0.2=3$ m."
      },
      {
        "title": "Recommendation systems",
        "background": "Sequential recommenders borrow state and value ideas when user context evolves after each item shown.",
        "numbers": "With discount $\\gamma=0.9$, a reward two steps ahead has weight $0.9^2=0.81$."
      },
      {
        "title": "Operations and inventory",
        "background": "Warehouses and queues use dynamic models to choose replenishment or service actions before shortages grow.",
        "numbers": "If demand is $12$ units/day and stock is $50$, then without replenishment the stock lasts $50/12\\approx4.17$ days."
      },
      {
        "title": "Energy systems",
        "background": "Batteries and grids need decisions that balance current demand with future capacity.",
        "numbers": "Using $8$ kWh from a $40$ kWh battery leaves $32$ kWh, or $80\\%$ charge."
      },
      {
        "title": "ML training loops",
        "background": "Training can be viewed as a dynamical process where updates move parameters and metrics over time.",
        "numbers": "A gradient step with learning rate $0.05$ and gradient $6$ changes a parameter by $0.05\\cdot6=0.3$."
      }
    ],
    "applicationsClose": "Across examples, the linear quadratic regulator (lqr) is the same mathematical habit in different clothing: state, action, evolution, and a criterion for what counts as success.",
    "takeaways": [
      "The Linear Quadratic Regulator (LQR) is a precise way to reason about dynamical systems.",
      "The core calculations use matrices, rank, costs, value, or uncertainty rather than guesswork.",
      "Control and ML both benefit when future consequences are written explicitly.",
      "Numerical checks keep the abstract definitions grounded."
    ]
  },
  "math-26-20": {
    "id": "math-26-20",
    "title": "Kalman filtering",
    "tagline": "A Kalman filter blends model predictions and noisy measurements using uncertainty as the weighting guide.",
    "connections": {
      "buildsOn": [
        "State-space representation",
        "conditional expectation",
        "variance"
      ],
      "leadsTo": [
        "Optimal control",
        "sensor fusion",
        "reinforcement learning state estimation"
      ],
      "usedWith": [
        "Bayes rule",
        "least squares",
        "covariance matrices",
        "linear systems"
      ]
    },
    "motivation": "<p>When a GPS point jitters, you do not want to trust it completely. But you also do not want to ignore it, because your motion model can drift.</p><p>The <b>Kalman filter</b> predicts with the dynamics, measures with the sensor, and blends the two according to uncertainty.</p>",
    "definition": "<p>In a linear Gaussian model, $x_t=Ax_{t-1}+Bu_t+w_t$ and $y_t=Cx_t+v_t$, where $w_t$ has covariance $Q$ and $v_t$ has covariance $R$. The update is $\\hat x^+=\\hat x^-+K(y-C\\hat x^-)$.</p><p>In the scalar direct-measurement case, $K=P^-/(P^-+R)$. This gain is large when prediction variance $P^-$ is large or measurement noise $R$ is small, which is exactly the weighted average that minimizes posterior squared error.</p><p><b>Assumptions that matter:</b> the standard filter assumes linear dynamics and Gaussian noise; covariances must be realistic; biased models create biased estimates; and nonlinear systems need approximations.</p>",
    "worked": {
      "problem": "A scalar prior estimate is $10$ with variance $4$. A sensor reads $13$ with variance $1$. Compute the Kalman update.",
      "skills": [
        "state equations",
        "matrix calculation",
        "interpretation"
      ],
      "strategy": "Build the relevant matrix or objective, compute carefully, then interpret the result.",
      "steps": [
        {
          "do": "Write the key expression",
          "result": "$K=P^-/(P^-+R)$",
          "why": "this is the test or quantity for the lesson"
        },
        {
          "do": "Substitute the given numbers",
          "result": "$K=P^-/(P^-+R)$",
          "why": "the example gives all needed matrices or values"
        },
        {
          "do": "Carry out the multiplication or arithmetic",
          "result": "$\\hat x^+=12.4$",
          "why": "one clean calculation decides the example"
        },
        {
          "do": "Compare with the criterion",
          "result": "$\\hat x^+=12.4$",
          "why": "the numerical result meets the stated condition"
        },
        {
          "do": "State the conclusion",
          "result": "The posterior estimate is $12.4$.",
          "why": "translate the calculation back into system language"
        }
      ],
      "verify": "The dimensions and arithmetic are consistent, and the conclusion matches the relevant rank, cost, or value criterion.",
      "answer": "The posterior estimate is $12.4$.",
      "connects": "This example shows how kalman filtering becomes a concrete computation."
    },
    "practice": [
      {
        "problem": "Compute the immediate numerical quantity in the lesson's formula for a two-state example.",
        "steps": [
          {
            "do": "Identify the formula",
            "result": "$K=P^-/(P^-+R)$",
            "why": "start from the defining expression"
          },
          {
            "do": "Insert a simple value",
            "result": "$2$",
            "why": "use the supplied scalar in the formula"
          },
          {
            "do": "Compute the first result",
            "result": "$4$",
            "why": "square or double as required"
          },
          {
            "do": "Compare to the target",
            "result": "$4>0$",
            "why": "positive quantity is meaningful"
          },
          {
            "do": "Interpret",
            "result": "the system passes this small numerical check",
            "why": "the calculation supports the concept"
          }
        ],
        "answer": "The check gives a positive, usable value."
      },
      {
        "problem": "For vectors $a=[1,2]^T$ and $b=[3,4]^T$, compute the combined direction $a+b$ used in the analysis.",
        "steps": [
          {
            "do": "Add first components",
            "result": "$1+3=4$",
            "why": "vector addition is componentwise"
          },
          {
            "do": "Add second components",
            "result": "$2+4=6$",
            "why": "componentwise again"
          },
          {
            "do": "Write the vector",
            "result": "$[4,6]^T$",
            "why": "collect components"
          },
          {
            "do": "Check dimension",
            "result": "two components",
            "why": "it remains in $\\mathbb R^2$"
          },
          {
            "do": "Interpret",
            "result": "both directions contribute",
            "why": "span and updates combine directions"
          }
        ],
        "answer": "$a+b=[4,6]^T$."
      },
      {
        "problem": "Evaluate a one-step cost $x^2+u^2$ for $x=3$ and $u=-1$.",
        "steps": [
          {
            "do": "Square the state",
            "result": "$3^2=9$",
            "why": "state error contributes quadratically"
          },
          {
            "do": "Square the input",
            "result": "$(-1)^2=1$",
            "why": "effort also contributes quadratically"
          },
          {
            "do": "Add costs",
            "result": "$9+1=10$",
            "why": "total one-step cost"
          },
          {
            "do": "Check nonnegativity",
            "result": "$10\\ge0$",
            "why": "squares cannot make negative cost"
          },
          {
            "do": "Interpret",
            "result": "state cost dominates",
            "why": "9 is larger than 1"
          }
        ],
        "answer": "$10$."
      },
      {
        "problem": "With discount $\\gamma=0.8$, compute the present weight of a reward three steps ahead.",
        "steps": [
          {
            "do": "Write the discount",
            "result": "$\\gamma^3$",
            "why": "three steps ahead gets three factors"
          },
          {
            "do": "Substitute $0.8$",
            "result": "$0.8^3$",
            "why": "use the given discount"
          },
          {
            "do": "Square first",
            "result": "$0.8^2=0.64$",
            "why": "one operation at a time"
          },
          {
            "do": "Multiply once more",
            "result": "$0.64\\cdot0.8=0.512$",
            "why": "third factor"
          },
          {
            "do": "Interpret",
            "result": "future reward keeps about half weight",
            "why": "discounting softens delayed outcomes"
          }
        ],
        "answer": "$0.512$."
      },
      {
        "problem": "A model update uses $x_{t+1}=0.7x_t+u_t$. If $x_t=10$ and $u_t=-3$, compute the next state and explain the control effect.",
        "steps": [
          {
            "do": "Multiply the state",
            "result": "$0.7\\cdot10=7$",
            "why": "natural dynamics shrink the state"
          },
          {
            "do": "Add the input",
            "result": "$7+(-3)=4$",
            "why": "control shifts the next state"
          },
          {
            "do": "State the next value",
            "result": "$x_{t+1}=4$",
            "why": "combine dynamics and action"
          },
          {
            "do": "Compare to no input",
            "result": "without input the next state would be $7$",
            "why": "the action reduced the state"
          },
          {
            "do": "Interpret for ML/control",
            "result": "the action changed future state",
            "why": "that is the shared feedback loop"
          }
        ],
        "answer": "$x_{t+1}=4$, reduced by $3$ compared with no input."
      }
    ],
    "applications": [
      {
        "title": "Robotics",
        "background": "Kalman filtering appears naturally in robot motion because actions affect physical state over time.",
        "numbers": "If a joint angle is $0.2$ rad from target and the correction gain is $5$, the commanded correction is $1.0$ unit."
      },
      {
        "title": "Autonomous vehicles",
        "background": "Kalman filtering helps vehicles reason about speed, position, and steering under safety constraints.",
        "numbers": "At $15$ m/s, a $0.2$ s planning step covers $15\\cdot0.2=3$ m."
      },
      {
        "title": "Recommendation systems",
        "background": "Sequential recommenders borrow state and value ideas when user context evolves after each item shown.",
        "numbers": "With discount $\\gamma=0.9$, a reward two steps ahead has weight $0.9^2=0.81$."
      },
      {
        "title": "Operations and inventory",
        "background": "Warehouses and queues use dynamic models to choose replenishment or service actions before shortages grow.",
        "numbers": "If demand is $12$ units/day and stock is $50$, then without replenishment the stock lasts $50/12\\approx4.17$ days."
      },
      {
        "title": "Energy systems",
        "background": "Batteries and grids need decisions that balance current demand with future capacity.",
        "numbers": "Using $8$ kWh from a $40$ kWh battery leaves $32$ kWh, or $80\\%$ charge."
      },
      {
        "title": "ML training loops",
        "background": "Training can be viewed as a dynamical process where updates move parameters and metrics over time.",
        "numbers": "A gradient step with learning rate $0.05$ and gradient $6$ changes a parameter by $0.05\\cdot6=0.3$."
      }
    ],
    "applicationsClose": "Across examples, kalman filtering is the same mathematical habit in different clothing: state, action, evolution, and a criterion for what counts as success.",
    "takeaways": [
      "Kalman filtering is a precise way to reason about dynamical systems.",
      "The core calculations use matrices, rank, costs, value, or uncertainty rather than guesswork.",
      "Control and ML both benefit when future consequences are written explicitly.",
      "Numerical checks keep the abstract definitions grounded."
    ]
  },
  "math-26-21": {
    "id": "math-26-21",
    "title": "Optimal control",
    "tagline": "Optimal control chooses actions over time by minimizing cost while obeying dynamics.",
    "connections": {
      "buildsOn": [
        "State-space representation",
        "calculus of variations",
        "dynamic programming"
      ],
      "leadsTo": [
        "Control theory ↔ reinforcement learning",
        "model predictive control",
        "LQR"
      ],
      "usedWith": [
        "value functions",
        "Hamiltonians",
        "constraints",
        "Bellman equations"
      ]
    },
    "motivation": "<p>Sometimes the question is not just how to stabilize, but how to act best: arrive quickly, spend little fuel, avoid unsafe states, and finish near the target.</p><p><b>Optimal control</b> combines dynamics, constraints, and an objective into a decision problem over trajectories.</p>",
    "definition": "<p>A standard deterministic optimal control problem minimizes $J=\\phi(x_T)+\\int_0^T L(x(t),u(t),t)\\,dt$ subject to $\\dot x=f(x,u,t)$. Here $x$ is state, $u$ is control, $L$ is running cost, and $\\phi$ is terminal cost.</p><p>The value function $V(x,t)$ is the best remaining cost from state $x$ at time $t$. Bellman's principle says the tail of an optimal plan is still optimal, which leads to recursive equations and continuous-time Hamilton-Jacobi-Bellman equations.</p><p><b>Assumptions that matter:</b> dynamics and costs must be specified; constraints can dominate the solution; finite and infinite horizons differ; and numerical methods approximate trajectories, value functions, or both.</p>",
    "worked": {
      "problem": "A one-step system has $x_1=x_0+u$ from $x_0=4$ and cost $J=x_1^2+u^2$. Compare $u=-1$ and $u=-2$.",
      "skills": [
        "state equations",
        "matrix calculation",
        "interpretation"
      ],
      "strategy": "Build the relevant matrix or objective, compute carefully, then interpret the result.",
      "steps": [
        {
          "do": "Write the key expression",
          "result": "$J=(4+u)^2+u^2$",
          "why": "this is the test or quantity for the lesson"
        },
        {
          "do": "Substitute the given numbers",
          "result": "$J=(4+u)^2+u^2$",
          "why": "the example gives all needed matrices or values"
        },
        {
          "do": "Carry out the multiplication or arithmetic",
          "result": "$10$ versus $8$",
          "why": "one clean calculation decides the example"
        },
        {
          "do": "Compare with the criterion",
          "result": "$10$ versus $8$",
          "why": "the numerical result meets the stated condition"
        },
        {
          "do": "State the conclusion",
          "result": "Among the two choices, $u=-2$ is better.",
          "why": "translate the calculation back into system language"
        }
      ],
      "verify": "The dimensions and arithmetic are consistent, and the conclusion matches the relevant rank, cost, or value criterion.",
      "answer": "Among the two choices, $u=-2$ is better.",
      "connects": "This example shows how optimal control becomes a concrete computation."
    },
    "practice": [
      {
        "problem": "Compute the immediate numerical quantity in the lesson's formula for a two-state example.",
        "steps": [
          {
            "do": "Identify the formula",
            "result": "$J=(4+u)^2+u^2$",
            "why": "start from the defining expression"
          },
          {
            "do": "Insert a simple value",
            "result": "$2$",
            "why": "use the supplied scalar in the formula"
          },
          {
            "do": "Compute the first result",
            "result": "$4$",
            "why": "square or double as required"
          },
          {
            "do": "Compare to the target",
            "result": "$4>0$",
            "why": "positive quantity is meaningful"
          },
          {
            "do": "Interpret",
            "result": "the system passes this small numerical check",
            "why": "the calculation supports the concept"
          }
        ],
        "answer": "The check gives a positive, usable value."
      },
      {
        "problem": "For vectors $a=[1,2]^T$ and $b=[3,4]^T$, compute the combined direction $a+b$ used in the analysis.",
        "steps": [
          {
            "do": "Add first components",
            "result": "$1+3=4$",
            "why": "vector addition is componentwise"
          },
          {
            "do": "Add second components",
            "result": "$2+4=6$",
            "why": "componentwise again"
          },
          {
            "do": "Write the vector",
            "result": "$[4,6]^T$",
            "why": "collect components"
          },
          {
            "do": "Check dimension",
            "result": "two components",
            "why": "it remains in $\\mathbb R^2$"
          },
          {
            "do": "Interpret",
            "result": "both directions contribute",
            "why": "span and updates combine directions"
          }
        ],
        "answer": "$a+b=[4,6]^T$."
      },
      {
        "problem": "Evaluate a one-step cost $x^2+u^2$ for $x=3$ and $u=-1$.",
        "steps": [
          {
            "do": "Square the state",
            "result": "$3^2=9$",
            "why": "state error contributes quadratically"
          },
          {
            "do": "Square the input",
            "result": "$(-1)^2=1$",
            "why": "effort also contributes quadratically"
          },
          {
            "do": "Add costs",
            "result": "$9+1=10$",
            "why": "total one-step cost"
          },
          {
            "do": "Check nonnegativity",
            "result": "$10\\ge0$",
            "why": "squares cannot make negative cost"
          },
          {
            "do": "Interpret",
            "result": "state cost dominates",
            "why": "9 is larger than 1"
          }
        ],
        "answer": "$10$."
      },
      {
        "problem": "With discount $\\gamma=0.8$, compute the present weight of a reward three steps ahead.",
        "steps": [
          {
            "do": "Write the discount",
            "result": "$\\gamma^3$",
            "why": "three steps ahead gets three factors"
          },
          {
            "do": "Substitute $0.8$",
            "result": "$0.8^3$",
            "why": "use the given discount"
          },
          {
            "do": "Square first",
            "result": "$0.8^2=0.64$",
            "why": "one operation at a time"
          },
          {
            "do": "Multiply once more",
            "result": "$0.64\\cdot0.8=0.512$",
            "why": "third factor"
          },
          {
            "do": "Interpret",
            "result": "future reward keeps about half weight",
            "why": "discounting softens delayed outcomes"
          }
        ],
        "answer": "$0.512$."
      },
      {
        "problem": "A model update uses $x_{t+1}=0.7x_t+u_t$. If $x_t=10$ and $u_t=-3$, compute the next state and explain the control effect.",
        "steps": [
          {
            "do": "Multiply the state",
            "result": "$0.7\\cdot10=7$",
            "why": "natural dynamics shrink the state"
          },
          {
            "do": "Add the input",
            "result": "$7+(-3)=4$",
            "why": "control shifts the next state"
          },
          {
            "do": "State the next value",
            "result": "$x_{t+1}=4$",
            "why": "combine dynamics and action"
          },
          {
            "do": "Compare to no input",
            "result": "without input the next state would be $7$",
            "why": "the action reduced the state"
          },
          {
            "do": "Interpret for ML/control",
            "result": "the action changed future state",
            "why": "that is the shared feedback loop"
          }
        ],
        "answer": "$x_{t+1}=4$, reduced by $3$ compared with no input."
      }
    ],
    "applications": [
      {
        "title": "Robotics",
        "background": "Optimal control appears naturally in robot motion because actions affect physical state over time.",
        "numbers": "If a joint angle is $0.2$ rad from target and the correction gain is $5$, the commanded correction is $1.0$ unit."
      },
      {
        "title": "Autonomous vehicles",
        "background": "Optimal control helps vehicles reason about speed, position, and steering under safety constraints.",
        "numbers": "At $15$ m/s, a $0.2$ s planning step covers $15\\cdot0.2=3$ m."
      },
      {
        "title": "Recommendation systems",
        "background": "Sequential recommenders borrow state and value ideas when user context evolves after each item shown.",
        "numbers": "With discount $\\gamma=0.9$, a reward two steps ahead has weight $0.9^2=0.81$."
      },
      {
        "title": "Operations and inventory",
        "background": "Warehouses and queues use dynamic models to choose replenishment or service actions before shortages grow.",
        "numbers": "If demand is $12$ units/day and stock is $50$, then without replenishment the stock lasts $50/12\\approx4.17$ days."
      },
      {
        "title": "Energy systems",
        "background": "Batteries and grids need decisions that balance current demand with future capacity.",
        "numbers": "Using $8$ kWh from a $40$ kWh battery leaves $32$ kWh, or $80\\%$ charge."
      },
      {
        "title": "ML training loops",
        "background": "Training can be viewed as a dynamical process where updates move parameters and metrics over time.",
        "numbers": "A gradient step with learning rate $0.05$ and gradient $6$ changes a parameter by $0.05\\cdot6=0.3$."
      }
    ],
    "applicationsClose": "Across examples, optimal control is the same mathematical habit in different clothing: state, action, evolution, and a criterion for what counts as success.",
    "takeaways": [
      "Optimal control is a precise way to reason about dynamical systems.",
      "The core calculations use matrices, rank, costs, value, or uncertainty rather than guesswork.",
      "Control and ML both benefit when future consequences are written explicitly.",
      "Numerical checks keep the abstract definitions grounded."
    ]
  },
  "math-26-22": {
    "id": "math-26-22",
    "title": "Control theory ↔ reinforcement learning",
    "tagline": "Control and reinforcement learning share the same heart: choose actions to shape future state and reward.",
    "connections": {
      "buildsOn": [
        "Optimal control",
        "value functions",
        "Markov chains"
      ],
      "leadsTo": [
        "policy gradients",
        "model-based RL",
        "approximate dynamic programming"
      ],
      "usedWith": [
        "Bellman equations",
        "dynamic programming",
        "stochastic processes",
        "optimization"
      ]
    },
    "motivation": "<p>You already know feedback from control: observe the state, choose an action, and affect what happens next. Reinforcement learning uses the same loop, often when the model or best strategy must be learned from data.</p><p>This capstone connects the languages. Control says state, input, dynamics, and cost; RL says state, action, transition, reward, and value.</p>",
    "definition": "<p>In discounted reinforcement learning, a policy $\\pi$ chooses actions and $V^\\pi(s)=\\mathbb E[\\sum_{t=0}^\\infty \\gamma^t r_t\\mid s_0=s]$, where $0\\le\\gamma<1$. The Bellman equation is $V^\\pi(s)=\\mathbb E[r(s,a)+\\gamma V^\\pi(s')]$.</p><p>This mirrors optimal control. A value function stores best future payoff or cost-to-go; Bellman's principle decomposes a long decision into one action plus the value of the next state. LQR is an exact quadratic ancestor of many approximate RL value functions.</p><p><b>Assumptions that matter:</b> RL often maximizes reward while control often minimizes cost; transitions may be stochastic; $\\gamma<1$ keeps infinite sums finite; exploration is needed when the model is unknown; and approximation can introduce error.</p>",
    "worked": {
      "problem": "An RL agent gets rewards $2,1,4$ over three steps with discount $\\gamma=0.9$. Compute the return.",
      "skills": [
        "state equations",
        "matrix calculation",
        "interpretation"
      ],
      "strategy": "Build the relevant matrix or objective, compute carefully, then interpret the result.",
      "steps": [
        {
          "do": "Write the key expression",
          "result": "$G=2+0.9(1)+0.9^2(4)$",
          "why": "this is the test or quantity for the lesson"
        },
        {
          "do": "Substitute the given numbers",
          "result": "$G=2+0.9(1)+0.9^2(4)$",
          "why": "the example gives all needed matrices or values"
        },
        {
          "do": "Carry out the multiplication or arithmetic",
          "result": "$6.14$",
          "why": "one clean calculation decides the example"
        },
        {
          "do": "Compare with the criterion",
          "result": "$6.14$",
          "why": "the numerical result meets the stated condition"
        },
        {
          "do": "State the conclusion",
          "result": "The discounted return is $6.14$.",
          "why": "translate the calculation back into system language"
        }
      ],
      "verify": "The dimensions and arithmetic are consistent, and the conclusion matches the relevant rank, cost, or value criterion.",
      "answer": "The discounted return is $6.14$.",
      "connects": "This example shows how control theory ↔ reinforcement learning becomes a concrete computation."
    },
    "practice": [
      {
        "problem": "Compute the immediate numerical quantity in the lesson's formula for a two-state example.",
        "steps": [
          {
            "do": "Identify the formula",
            "result": "$G=2+0.9(1)+0.9^2(4)$",
            "why": "start from the defining expression"
          },
          {
            "do": "Insert a simple value",
            "result": "$2$",
            "why": "use the supplied scalar in the formula"
          },
          {
            "do": "Compute the first result",
            "result": "$4$",
            "why": "square or double as required"
          },
          {
            "do": "Compare to the target",
            "result": "$4>0$",
            "why": "positive quantity is meaningful"
          },
          {
            "do": "Interpret",
            "result": "the system passes this small numerical check",
            "why": "the calculation supports the concept"
          }
        ],
        "answer": "The check gives a positive, usable value."
      },
      {
        "problem": "For vectors $a=[1,2]^T$ and $b=[3,4]^T$, compute the combined direction $a+b$ used in the analysis.",
        "steps": [
          {
            "do": "Add first components",
            "result": "$1+3=4$",
            "why": "vector addition is componentwise"
          },
          {
            "do": "Add second components",
            "result": "$2+4=6$",
            "why": "componentwise again"
          },
          {
            "do": "Write the vector",
            "result": "$[4,6]^T$",
            "why": "collect components"
          },
          {
            "do": "Check dimension",
            "result": "two components",
            "why": "it remains in $\\mathbb R^2$"
          },
          {
            "do": "Interpret",
            "result": "both directions contribute",
            "why": "span and updates combine directions"
          }
        ],
        "answer": "$a+b=[4,6]^T$."
      },
      {
        "problem": "Evaluate a one-step cost $x^2+u^2$ for $x=3$ and $u=-1$.",
        "steps": [
          {
            "do": "Square the state",
            "result": "$3^2=9$",
            "why": "state error contributes quadratically"
          },
          {
            "do": "Square the input",
            "result": "$(-1)^2=1$",
            "why": "effort also contributes quadratically"
          },
          {
            "do": "Add costs",
            "result": "$9+1=10$",
            "why": "total one-step cost"
          },
          {
            "do": "Check nonnegativity",
            "result": "$10\\ge0$",
            "why": "squares cannot make negative cost"
          },
          {
            "do": "Interpret",
            "result": "state cost dominates",
            "why": "9 is larger than 1"
          }
        ],
        "answer": "$10$."
      },
      {
        "problem": "With discount $\\gamma=0.8$, compute the present weight of a reward three steps ahead.",
        "steps": [
          {
            "do": "Write the discount",
            "result": "$\\gamma^3$",
            "why": "three steps ahead gets three factors"
          },
          {
            "do": "Substitute $0.8$",
            "result": "$0.8^3$",
            "why": "use the given discount"
          },
          {
            "do": "Square first",
            "result": "$0.8^2=0.64$",
            "why": "one operation at a time"
          },
          {
            "do": "Multiply once more",
            "result": "$0.64\\cdot0.8=0.512$",
            "why": "third factor"
          },
          {
            "do": "Interpret",
            "result": "future reward keeps about half weight",
            "why": "discounting softens delayed outcomes"
          }
        ],
        "answer": "$0.512$."
      },
      {
        "problem": "A model update uses $x_{t+1}=0.7x_t+u_t$. If $x_t=10$ and $u_t=-3$, compute the next state and explain the control effect.",
        "steps": [
          {
            "do": "Multiply the state",
            "result": "$0.7\\cdot10=7$",
            "why": "natural dynamics shrink the state"
          },
          {
            "do": "Add the input",
            "result": "$7+(-3)=4$",
            "why": "control shifts the next state"
          },
          {
            "do": "State the next value",
            "result": "$x_{t+1}=4$",
            "why": "combine dynamics and action"
          },
          {
            "do": "Compare to no input",
            "result": "without input the next state would be $7$",
            "why": "the action reduced the state"
          },
          {
            "do": "Interpret for ML/control",
            "result": "the action changed future state",
            "why": "that is the shared feedback loop"
          }
        ],
        "answer": "$x_{t+1}=4$, reduced by $3$ compared with no input."
      }
    ],
    "applications": [
      {
        "title": "Q-learning targets",
        "background": "Q-learning is model-free RL, but its target is a Bellman backup just like dynamic programming in control.",
        "numbers": "With reward $2$, discount $0.9$, and next value $5$, target is $2+0.9\\cdot5=6.5$."
      },
      {
        "title": "Model predictive control and model-based RL",
        "background": "Both plan through a dynamics model, execute an action, then replan after seeing the new state.",
        "numbers": "With horizon $3$ and $4$ candidate actions per step, exhaustive search checks $4^3=64$ action sequences."
      },
      {
        "title": "LQR as a value-function lesson",
        "background": "LQR shows why quadratic value functions are natural when dynamics are linear and costs are quadratic.",
        "numbers": "If $V(x)=2x^2$, then $V(3)=18$ and $V(1)=2$, so reducing state from 3 to 1 saves 16 value units."
      },
      {
        "title": "Policy gradients",
        "background": "When dynamics are unknown or high-dimensional, RL often adjusts policy parameters directly using sampled returns.",
        "numbers": "If gradient estimate is $-4$ and learning rate is $0.05$, the parameter update is $-0.2$."
      },
      {
        "title": "Exploration",
        "background": "Control usually assumes a model; RL must often try actions to learn their consequences.",
        "numbers": "An $\\epsilon$-greedy agent with $\\epsilon=0.1$ explores about $10$ times in $100$ decisions."
      },
      {
        "title": "Reward versus cost",
        "background": "Many formulas differ only by sign: maximizing reward is equivalent to minimizing negative reward as cost.",
        "numbers": "Rewards $3,2$ sum to $5$; the equivalent costs are $-3,-2$ and total cost $-5$."
      }
    ],
    "applicationsClose": "Across examples, control theory ↔ reinforcement learning is the same mathematical habit in different clothing: state, action, evolution, and a criterion for what counts as success.",
    "takeaways": [
      "Control theory ↔ reinforcement learning is a precise way to reason about dynamical systems.",
      "The core calculations use matrices, rank, costs, value, or uncertainty rather than guesswork.",
      "Control and ML both benefit when future consequences are written explicitly.",
      "Numerical checks keep the abstract definitions grounded."
    ]
  }
};
