module.exports = {
  "math-26-01": {
    connectionsProse:
      "<p>This lesson begins the control-theory section with the basic objects that appear everywhere afterward. A signal is a time-varying quantity, and a system is a rule that turns one signal into another. Feedback adds the central control idea: use the measured output to decide what input should come next. Later lessons turn this same loop into transfer functions, stability tests, state-space models, and optimal controllers.</p>",
    motivation:
      "<p>Many mathematical models describe how a quantity changes, but control theory also asks how to influence that change. The input might be heater power, throttle, torque, a bid multiplier, or a parameter update. The output is what the system actually does, and the reference is what we wanted it to do. The error is the difference between those two signals.</p>" +
      "<p>Feedback uses that error instead of choosing inputs blindly. If the output is too low, the controller pushes upward; if the output is too high, it pushes downward. In the simple scalar loop below, the plant has gain $P$ and the controller has gain $K$, so the algebra shows how the open-loop gains combine into the closed-loop reference-to-output gain.</p>",
    definition:
      "<p><b>Closed-loop scalar proportional feedback</b> uses the measured error $e=r-y$ to choose the input $u=K(r-y)$ for a plant $y=Pu$, giving $$y=\\dfrac{PK}{1+PK}r.$$</p>" +
      "<p><b>Assumptions that matter:</b> the plant is the static gain $P$, the controller is proportional with gain $K$, and the feedback subtracts measured output from reference.</p>",
    symbols: [
      { sym: "$r(t)$", desc: "reference" },
      { sym: "$y(t)$", desc: "output" },
      { sym: "$u(t)$", desc: "input" },
      { sym: "$e(t)$", desc: "error" },
      { sym: "$P$", desc: "plant gain" },
      { sym: "$K$", desc: "controller gain" }
    ],
    derivation: [
      { do: "Write the error", result: "$e=r-y$", why: "feedback compares desired output with measured output" },
      { do: "Write the controller", result: "$u=Ke=K(r-y)$", why: "proportional action scales the error" },
      { do: "Substitute into the plant", result: "$y=PK(r-y)$", why: "the plant output depends on the control input" },
      { do: "Distribute", result: "$y=PKr-PKy$", why: "separate reference and output terms" },
      { do: "Collect output terms", result: "$(1+PK)y=PKr$", why: "move the feedback term to the left" },
      { do: "Divide", result: "$y=\\dfrac{PK}{1+PK}r$", why: "this is the closed-loop reference-to-output gain" }
    ],
    applications: [
      { title: "Thermostat", background: "A proportional controller uses the temperature error to choose heater power.", numbers: "$r=22$, $y=19$, $e=3$, $K=400$ W/degree gives $1200$ W." },
      { title: "Static loop", background: "A scalar plant-controller loop converts a reference into an output.", numbers: "$P=2$, $K=0.25$, $r=10$ gives $y=10/3\\approx3.33$." },
      { title: "Cruise control", background: "Throttle correction is proportional to speed error.", numbers: "speed error $65-61=4$ mph and gain $0.03$ gives throttle change $0.12$." },
      { title: "Robot joint", background: "Joint torque is chosen from angular error.", numbers: "$e=0.20$ rad, $K=15$ N m/rad gives $3$ N m." },
      { title: "Gradient feedback", background: "A gradient step feeds back the slope of the loss.", numbers: "$L(w)=(w-5)^2$, $w=2$, gradient $-6$, step $0.1$ gives $w^+=2.6$." },
      { title: "Pacing loop", background: "A bid multiplier changes in response to spend error.", numbers: "spend error $8000-7600=400$, gain $0.001$ changes bid multiplier by $0.4$." }
    ]
  },
  "math-26-02": {
    connectionsProse:
      "<p>The previous lesson introduced systems as input-output objects. This lesson looks inside a system by describing its state with a differential equation. The state tells what the system remembers at the current time, and the derivative tells how that state is moving. This language supports later transfer functions, time responses, and state-space models.</p>",
    motivation:
      "<p>A static equation can say where a system is, but it cannot describe motion by itself. Control problems usually depend on rates: heat leaks away, vehicles accelerate, tanks drain, and optimization variables drift toward better values. A differential equation gives a compact rule for that motion by connecting the present state, the input, and the derivative.</p>" +
      "<p>The simplest useful model is first order and linear. With a constant input, it has an equilibrium where the derivative is zero. By subtracting that equilibrium, the model becomes a pure exponential deviation equation, which shows both the final value and the speed at which the system approaches it.</p>",
    definition:
      "<p>A first-order linear differential equation with constant input has the form $$\\dot x=ax+bu_0,$$ with equilibrium $x^*=-bu_0/a$ and solution $x(t)=x^*+(x(0)-x^*)e^{at}$.</p>" +
      "<p><b>Assumptions that matter:</b> the input is constant, $a\\ne0$, and the state is measured relative to the equilibrium.</p>",
    symbols: [
      { sym: "$x$", desc: "state" },
      { sym: "$u_0$", desc: "constant input" },
      { sym: "$a$", desc: "natural rate coefficient" },
      { sym: "$b$", desc: "input coefficient" },
      { sym: "$x^*$", desc: "equilibrium" },
      { sym: "$z$", desc: "deviation" }
    ],
    derivation: [
      { do: "Set equilibrium", result: "$0=ax^*+bu_0$", why: "equilibrium means the rate is zero" },
      { do: "Solve", result: "$x^*=-bu_0/a$", why: "isolate the state, assuming $a\\ne0$" },
      { do: "Define deviation", result: "$z=x-x^*$", why: "measure distance from equilibrium" },
      { do: "Differentiate", result: "$\\dot z=\\dot x$", why: "$x^*$ is constant" },
      { do: "Substitute $x=z+x^*$", result: "$\\dot z=a(z+x^*)+bu_0$", why: "write dynamics in deviation coordinates" },
      { do: "Use equilibrium cancellation", result: "$\\dot z=az$", why: "$ax^*+bu_0=0$ makes equilibrium terms cancel" },
      { do: "Solve the deviation equation", result: "$z(t)=z(0)e^{at}$", why: "this is the first-order exponential solution" },
      { do: "Return to the original state", result: "$x(t)=x^*+(x(0)-x^*)e^{at}$", why: "add the equilibrium back" }
    ],
    applications: [
      { title: "Tank level", background: "The inflow and leak determine the equilibrium water height.", numbers: "$\\dot h=-0.5h+5$ gives $h^*=10$." },
      { title: "Current model", background: "A constant input sets a steady current-like state.", numbers: "$\\dot x=-0.4x+2u$, $u=3$ gives $x^*=15$." },
      { title: "Cooling room", background: "The decay coefficient sets the response speed.", numbers: "$a=-0.2$ gives time constant $5$ min." },
      { title: "Euler simulation", background: "A differential equation can be stepped forward numerically.", numbers: "$\\dot x=-x+5$, $x_0=2$, $\\Delta t=0.1$ gives $x_1=2.3$, $x_2=2.57$." },
      { title: "Feedback design", background: "A control input can change unstable natural dynamics into stable dynamics.", numbers: "$\\dot x=x+u$, choose $u=-3x$ to get $\\dot x=-2x$." },
      { title: "Optimization flow", background: "Continuous-time gradient-like motion approaches the minimizer.", numbers: "$\\dot w=-(w-5)$ from $w_0=2$ gives $w(1)=5-3e^{-1}\\approx3.90$." }
    ]
  },
  "math-26-03": {
    connectionsProse:
      "<p>Differential equations describe dynamics in time. Transfer functions describe the same linear dynamics in the Laplace domain, where derivatives become algebraic factors. This shift makes it easier to combine systems, draw block diagrams, and locate poles. The lessons on poles, stability, frequency response, and Bode plots all use this representation.</p>",
    motivation:
      "<p>Solving a differential equation directly is useful, but control design often needs repeated algebra with connected pieces. A controller, actuator, plant, and sensor can each have their own equation. The transfer-function view replaces each linear piece by a ratio from input transform to output transform, so interconnections can be simplified with multiplication, addition, and feedback formulas.</p>" +
      "<p>The key assumption is zero initial condition, because the transfer function describes the forced input-output behavior rather than the system's stored initial energy. In the first-order example below, the equation $\\dot y+ay=bu$ becomes a ratio $G(s)=b/(s+a)$. The denominator already shows the pole, and the value at $s=0$ gives the steady gain.</p>",
    definition:
      "<p>A <b>transfer function</b> is the zero-initial-condition input-output ratio in the Laplace domain. For $\\dot y+ay=bu$, $$G(s)=\\frac{Y(s)}{U(s)}=\\frac{b}{s+a}.$$</p>" +
      "<p><b>Assumptions that matter:</b> the system is linear time-invariant, the initial condition is zero, and the ratio describes forced response from input to output.</p>",
    symbols: [
      { sym: "$G(s)$", desc: "transfer function" },
      { sym: "$Y(s)$", desc: "output transform" },
      { sym: "$U(s)$", desc: "input transform" },
      { sym: "$s$", desc: "Laplace variable" },
      { sym: "$a$", desc: "decay coefficient" },
      { sym: "$b$", desc: "input gain" }
    ],
    derivation: [
      { do: "Take Laplace transforms", result: "$sY(s)+aY(s)=bU(s)$", why: "derivatives become multiplication by $s$ when $y(0)=0$" },
      { do: "Factor output", result: "$(s+a)Y(s)=bU(s)$", why: "collect terms containing $Y$" },
      { do: "Divide by $U(s)$", result: "$(s+a)Y(s)/U(s)=b$", why: "prepare the input-output ratio" },
      { do: "Divide by $s+a$", result: "$Y(s)/U(s)=b/(s+a)$", why: "isolate the ratio" },
      { do: "Name the ratio", result: "$G(s)=b/(s+a)$", why: "this ratio is the transfer function" }
    ],
    applications: [
      { title: "First-order plant", background: "A differential equation turns into a transfer function.", numbers: "$\\dot y+3y=6u$ gives $G(s)=6/(s+3)$." },
      { title: "DC gain", background: "Evaluating at zero frequency gives the step final gain.", numbers: "$G(0)=6/3=2$, so a unit step settles at $2$." },
      { title: "Pole from denominator", background: "The denominator root gives the natural decay rate.", numbers: "$s+3=0$ gives pole $-3$ and time constant $1/3$ s." },
      { title: "Low-pass filter", background: "A first-order transfer function attenuates high frequencies.", numbers: "$G(s)=100/(s+100)$ has DC gain $1$ and corner scale $100$ rad/s." },
      { title: "Static gain check", background: "The equilibrium gain matches the transfer-function DC gain.", numbers: "$\\dot y+2y=10u$ gives equilibrium gain $10/2=5$." },
      { title: "Gradient error model", background: "A discrete error update has a transfer-like multiplier.", numbers: "$e_{k+1}=0.8e_k$ has transfer-like multiplier $0.8$, so $e_3=0.8^3e_0=0.512e_0$." }
    ]
  },
  "math-26-04": {
    connectionsProse:
      "<p>Transfer functions make each linear component into an input-output block. Block diagrams arrange those components so the signal flow stays visible. This is the notation used before reducing a feedback loop to a single closed-loop transfer function. It prepares the algebra used in steady-state error, root locus, and controller design.</p>",
    motivation:
      "<p>A real control system is rarely one isolated equation. The reference passes through a controller, the controller drives a plant, the plant output is measured by a sensor, and the measurement returns to the summing junction. A block diagram keeps those roles separate while still allowing exact algebra.</p>" +
      "<p>The three main simplifications are simple but powerful. Series blocks multiply because the output of one is the input to the next. Parallel blocks add because their outputs are summed. Negative feedback produces the denominator $1+GH$, which is why feedback can change poles, reduce sensitivity, and reshape the closed-loop response.</p>",
    definition:
      "<p>A negative-feedback block diagram with forward path $G$ and feedback path $H$ has closed-loop transfer $$T(s)=\\frac{Y}{R}=\\frac{G}{1+GH}.$$</p>" +
      "<p><b>Assumptions that matter:</b> the blocks are linear transfer functions, the feedback signal $HY$ is subtracted from the reference, and the algebra is done in the transform domain.</p>",
    symbols: [
      { sym: "$R$", desc: "reference" },
      { sym: "$E$", desc: "error" },
      { sym: "$Y$", desc: "output" },
      { sym: "$G$", desc: "forward path" },
      { sym: "$H$", desc: "feedback path" },
      { sym: "$T$", desc: "closed-loop transfer" }
    ],
    derivation: [
      { do: "Write the error", result: "$E=R-HY$", why: "measured feedback is subtracted from reference" },
      { do: "Write the forward path", result: "$Y=GE$", why: "the plant/controller block maps error to output" },
      { do: "Substitute", result: "$Y=G(R-HY)$", why: "close the loop algebraically" },
      { do: "Distribute", result: "$Y=GR-GHY$", why: "separate reference and output terms" },
      { do: "Collect", result: "$(1+GH)Y=GR$", why: "move feedback output terms left" },
      { do: "Divide by $R$", result: "$T(s)=Y/R=G/(1+GH)$", why: "get the closed-loop transfer" }
    ],
    applications: [
      { title: "Unity feedback", background: "A controller and plant multiply in the forward path.", numbers: "with $C=2$, $P=5/(s+4)$ gives $G=10/(s+4)$ and $T=10/(s+14)$." },
      { title: "Closed-loop pole", background: "Feedback shifts the denominator and speeds the response.", numbers: "moves from $-4$ to $-14$, time constant from $0.25$ s to $0.071$ s." },
      { title: "DC closed-loop gain", background: "The stable closed-loop final gain comes from the value at $s=0$.", numbers: "is $10/14\\approx0.714$." },
      { title: "Sensor feedback", background: "A non-unity sensor changes the feedback denominator.", numbers: "$H=0.5$ gives $T=G/(1+0.5G)$, so $G(0)=10/4=2.5$ yields $T(0)=2.5/2.25\\approx1.11$." },
      { title: "Parallel filters", background: "Parallel block outputs add.", numbers: "$G_1=2$, $G_2=3$ give equivalent gain $5$." },
      { title: "Series actuator and plant", background: "Series block gains multiply.", numbers: "gains $0.4$ and $8$ multiply to $3.2$." }
    ]
  },
  "math-26-05": {
    connectionsProse:
      "<p>After modeling a system and writing its transfer function, the next question is how it moves in time. System response describes the output after an input change or an initial disturbance. The first-order response is the simplest case and sets the pattern for later transient-response metrics. It also gives the language of final value, transient, time constant, and settling.</p>",
    motivation:
      "<p>A stable system does not usually jump instantly to its final value. It carries memory of where it started, and that memory fades according to the dynamics. For a first-order stable model, this memory is a single exponential term, so the response can be read as steady state plus a decaying correction.</p>" +
      "<p>This decomposition is useful because it separates two design questions. The steady state tells where the system will end up under a constant input, while the transient tells how quickly the initial error disappears. In the derivation below, subtracting the equilibrium exposes the pure exponential decay.</p>",
    definition:
      "<p>For the stable first-order model $$\\dot x=-ax+bu_0\\quad(a>0),$$ the response is $x(t)=x^*+(x(0)-x^*)e^{-at}$ with steady state $x^*=bu_0/a$.</p>" +
      "<p><b>Assumptions that matter:</b> the input is constant, $a>0$, and the final value is an equilibrium where the derivative is zero.</p>",
    symbols: [
      { sym: "$x(t)$", desc: "state" },
      { sym: "$x^*$", desc: "steady state" },
      { sym: "$a$", desc: "positive decay rate" },
      { sym: "$u_0$", desc: "constant input" },
      { sym: "$b$", desc: "input gain" },
      { sym: "$z$", desc: "deviation" }
    ],
    derivation: [
      { do: "Set steady state", result: "$0=-ax^*+bu_0$", why: "final steady state has zero derivative" },
      { do: "Solve", result: "$x^*=bu_0/a$", why: "isolate the final value" },
      { do: "Define deviation", result: "$z=x-x^*$", why: "subtract the final value" },
      { do: "Differentiate", result: "$\\dot z=\\dot x$", why: "the final value is constant" },
      { do: "Substitute $x=z+x^*$", result: "$\\dot z=-a(z+x^*)+bu_0$", why: "rewrite in deviation form" },
      { do: "Use equilibrium cancellation", result: "$\\dot z=-az$", why: "steady terms cancel" },
      { do: "Solve the deviation", result: "$z(t)=z(0)e^{-at}$", why: "deviation decays exponentially" },
      { do: "Return to the state", result: "$x(t)=x^*+(x(0)-x^*)e^{-at}$", why: "final value plus transient" }
    ],
    applications: [
      { title: "First-order response", background: "The solution is steady state plus a decaying transient.", numbers: "$\\dot x=-2x+6$, $x(0)=1$ gives $x(t)=3-2e^{-2t}$." },
      { title: "Value at time", background: "Substitute the time into the response formula.", numbers: "at $t=0.5$, $x=3-2e^{-1}\\approx2.264$." },
      { title: "Time constant", background: "The decay rate sets the time constant.", numbers: "for $a=2$ is $0.5$ s." },
      { title: "Three time constants", background: "After three time constants only a small transient remains.", numbers: "leave remaining error $e^{-3}\\approx0.050$." },
      { title: "Step final value", background: "The equilibrium gives the final value under a constant input.", numbers: "for $\\dot y+4y=8$ is $2$." },
      { title: "Warm-start model", background: "A response can start above its final value and decay downward.", numbers: "if $x(0)=10$, $x^*=4$, $a=0.5$, then $x(2)=4+6e^{-1}\\approx6.21$." }
    ]
  },
  "math-26-06": {
    connectionsProse:
      "<p>This lesson builds on transfer functions and the Laplace transform. A transfer function writes an LTI system as a ratio $G(s)=N(s)/D(s)$, so the roots of the numerator and denominator are no longer just algebraic details. They become the places in the complex plane that tell how the system naturally moves and how it responds to inputs.</p>" +
      "<p>The next lessons use this language constantly. Stability reads the real parts of poles, transient response reads damping and oscillation from complex poles, and root locus follows poles as feedback gain changes. Poles and zeros are therefore the bridge from an equation to the behavior a controller designer cares about.</p>",
    motivation:
      "<p>When a system is disturbed briefly, its response either dies out, oscillates, or grows. For a linear system, that behavior is controlled by a small set of points in the complex plane. Factor the transfer function $G(s)=N(s)/D(s)$. The poles, which are the roots of $D(s)$, give the system's natural modes. A pole at $p$ contributes a term like $e^{pt}$, so the real part of $p$ decides whether that mode decays or grows.</p>" +
      "<p>Zeros, which are the roots of $N(s)$, do a different job. They shape the response by reducing or blocking parts of the input-output behavior. In the worked system $G(s)=\\dfrac{s+2}{(s+1)(s+4)}$, the zero is at $-2$, the poles are at $-1$ and $-4$, and the DC gain is $G(0)=\\dfrac{2}{4}=0.5$. Those three numbers already tell a useful story: the system is stable, its slow mode has time constant $1$ second, and a unit step settles at one half.</p>",
    definition:
      "<p><b>Poles and zeros</b> are the roots of the denominator and numerator of a transfer function: $$G(s)=\\frac{N(s)}{D(s)},\\qquad N(z)=0\\text{ gives zeros},\\qquad D(p)=0\\text{ gives poles}.$$</p>" +
      "<p><b>Assumptions that matter:</b> the system is represented by an LTI transfer function, denominator roots define natural modes, and numerator roots shape input-output response.</p>",
    symbols: [
      { sym: "$G(s)$", desc: "the transfer function" },
      { sym: "$s$", desc: "the Laplace variable" },
      { sym: "$N(s)$", desc: "the numerator" },
      { sym: "$D(s)$", desc: "the denominator" },
      { sym: "$z$", desc: "a zero" },
      { sym: "$p$", desc: "a pole" },
      { sym: "$\\sigma=\\operatorname{Re}(p)$", desc: "the decay or growth rate" },
      { sym: "$\\omega=\\operatorname{Im}(p)$", desc: "the oscillation rate in radians per second" }
    ],
    derivation: [
      { do: "Start with a denominator factor", result: "$s-p$", why: "a pole is a value $p$ that makes the denominator vanish" },
      { do: "Write a simple partial fraction", result: "$A/(s-p)$", why: "this isolates the contribution of that pole" },
      { do: "Use the inverse Laplace transform", result: "$\\mathcal L^{-1}\\{1/(s-p)\\}=e^{pt}$", why: "this converts the pole into a time-domain mode" },
      { do: "Write the pole in real and imaginary parts", result: "$p=\\sigma+j\\omega$", why: "every complex pole has a real part $\\sigma$ and imaginary part $\\omega$" },
      { do: "Separate the exponential", result: "$e^{pt}=e^{\\sigma t}e^{j\\omega t}$", why: "separate growth/decay from oscillation" },
      { do: "Take magnitude", result: "$|e^{pt}|=e^{\\sigma t}$", why: "the complex sinusoid has magnitude $1$" },
      { do: "Read the sign of $\\sigma$", result: "$\\sigma<0$, $\\sigma=0$, or $\\sigma>0$", why: "negative real part gives decay, zero gives sustained size, and positive gives growth" }
    ],
    applications: [
      { title: "Stability from pole sign", background: "Pole signs reveal whether natural modes decay.", numbers: "$G(s)=\\dfrac{s+2}{(s+1)(s+4)}$ has poles $-1,-4$, so modes $e^{-t}$ and $e^{-4t}$ decay." },
      { title: "Dominant speed", background: "The slowest pole determines the longest time constant.", numbers: "the slowest pole $-1$ gives time constant $1/|-1|=1$ s; the pole $-4$ gives $0.25$ s." },
      { title: "DC gain", background: "The zero-frequency value gives the stable step final value.", numbers: "$G(0)=2/(1\\cdot4)=0.5$, so a stable unit-step response settles to $0.5$." },
      { title: "Oscillation", background: "Complex poles encode decay and period.", numbers: "poles $-2\\pm3j$ have envelope $e^{-2t}$ and period $2\\pi/3\\approx2.09$ s." },
      { title: "Optimization-as-control", background: "A linearized error update has a discrete pole.", numbers: "a linearized error update $e_{k+1}=0.9e_k$ has discrete pole $0.9$, so after $20$ steps the error multiplier is $0.9^{20}\\approx0.122$." },
      { title: "Unstable learned policy check", background: "A discrete pole outside the unit circle amplifies state.", numbers: "if a closed-loop scalar policy gives $x_{k+1}=1.05x_k$, then $100$ steps multiply state by $1.05^{100}\\approx131.5$." }
    ]
  },
  "math-26-07": {
    connectionsProse:
      "<p>Poles connect algebra to natural modes. Stability uses that connection to decide whether disturbances fade or grow. This lesson gives the continuous-time pole test that later appears in transient response, Routh-Hurwitz, root locus, and pole placement. It is one of the main safety checks in linear control.</p>",
    motivation:
      "<p>A stable system returns toward rest after it is disturbed. In a linear model, the natural response is built from modal terms, and each pole contributes one such term. The real part of the pole controls the envelope, while the imaginary part controls oscillation.</p>" +
      "<p>This makes stability a geometric condition in the complex plane. Poles in the left half-plane have negative real parts, so their exponential envelopes decay. A pole in the right half-plane has a positive real part, so its mode grows and eventually dominates the response.</p>",
    definition:
      "<p>The continuous-time pole stability test says an LTI system is asymptotically stable when every pole satisfies $$\\operatorname{Re}(p_i)<0.$$</p>" +
      "<p><b>Assumptions that matter:</b> the natural response is a sum of pole modes, and stability is judged by whether all modal envelopes decay.</p>",
    symbols: [
      { sym: "$p$", desc: "pole" },
      { sym: "$\\sigma=\\operatorname{Re}(p)$", desc: "real part" },
      { sym: "$\\omega=\\operatorname{Im}(p)$", desc: "oscillation rate" },
      { sym: "$e^{pt}$", desc: "natural mode" }
    ],
    derivation: [
      { do: "Associate a pole with its mode", result: "$e^{pt}$", why: "from the inverse Laplace transform" },
      { do: "Write real and imaginary parts", result: "$p=\\sigma+j\\omega$", why: "split real and imaginary parts" },
      { do: "Rewrite the mode", result: "$e^{pt}=e^{\\sigma t}e^{j\\omega t}$", why: "separate envelope and oscillation" },
      { do: "Take magnitude", result: "$|e^{pt}|=e^{\\sigma t}$", why: "the oscillatory factor has magnitude $1$" },
      { do: "Check negative real part", result: "$\\sigma<0\\Rightarrow e^{\\sigma t}\\to0$", why: "the mode decays" },
      { do: "Require the condition for every pole", result: "every mode decays", why: "the system is asymptotically stable" },
      { do: "Check positive real part", result: "$\\sigma>0$ gives growth", why: "that mode grows and the system is unstable" }
    ],
    applications: [
      { title: "Stable polynomial", background: "Negative poles imply stable natural modes.", numbers: "$5/(s^2+6s+8)$ has poles $-2,-4$, so it is stable." },
      { title: "Growing pole", background: "A positive pole produces an exponentially growing mode.", numbers: "a pole $+0.5$ gives $e^{0.5t}$; at $t=4$ the multiplier is $e^2\\approx7.39$." },
      { title: "Fast decay", background: "A more negative pole decays quickly.", numbers: "pole $-2$ leaves $e^{-4}\\approx0.018$ after $2$ s." },
      { title: "Damped oscillation", background: "Complex poles with negative real part oscillate while decaying.", numbers: "poles $-1\\pm2j$ decay with time constant $1$ s." },
      { title: "Stable discrete update", background: "Discrete-time stability uses magnitude instead of real part.", numbers: "$x^+=0.95x$ is stable because $|0.95|<1$." },
      { title: "Unstable discrete update", background: "A multiplier outside the unit circle grows in magnitude.", numbers: "$x^+=-1.1x$ is unstable because $|-1.1|>1$." }
    ]
  },
  "math-26-08": {
    connectionsProse:
      "<p>Stability says whether a response eventually fades. Transient response describes the shape of that fading before the system settles. For second-order systems, pole location becomes damping, oscillation, overshoot, and settling time. These quantities are practical design targets for feedback controllers.</p>",
    motivation:
      "<p>A stable system can still behave poorly on the way to its final value. It may ring too much, overshoot a safe limit, or take too long to settle. The second-order model is the standard setting where these features can be computed directly from damping ratio and natural frequency.</p>" +
      "<p>The poles have real part $-\\zeta\\omega_n$ and imaginary part $\\omega_n\\sqrt{1-\\zeta^2}$. The real part sets the exponential envelope, and the imaginary part sets the oscillation period. From those two pieces come the common engineering rules for settling time, peak time, and percent overshoot.</p>",
    definition:
      "<p>For the standard second-order transfer function $$G(s)=\\omega_n^2/(s^2+2\\zeta\\omega_ns+\\omega_n^2),$$ pole location determines settling time, peak time, and overshoot.</p>" +
      "<p><b>Assumptions that matter:</b> use the standard underdamped second-order form, typically with $0<\\zeta<1$, and read transient metrics from the pole real and imaginary parts.</p>",
    symbols: [
      { sym: "$\\omega_n$", desc: "natural frequency" },
      { sym: "$\\zeta$", desc: "damping ratio" },
      { sym: "$T_s$", desc: "settling time" },
      { sym: "$t_p$", desc: "peak time" },
      { sym: "$p$", desc: "poles" }
    ],
    derivation: [
      { do: "Start with the standard form", result: "$G(s)=\\omega_n^2/(s^2+2\\zeta\\omega_ns+\\omega_n^2)$", why: "normalized second-order form" },
      { do: "Solve denominator roots", result: "$p=-\\zeta\\omega_n\\pm j\\omega_n\\sqrt{1-\\zeta^2}$", why: "apply the quadratic formula" },
      { do: "Read the envelope", result: "$e^{-\\zeta\\omega_nt}$", why: "the real part sets decay" },
      { do: "Set the 2 percent rule", result: "$e^{-\\zeta\\omega_nT_s}\\approx0.02$", why: "remaining envelope is about 2 percent" },
      { do: "Solve for settling time", result: "$T_s=-\\ln(0.02)/(\\zeta\\omega_n)\\approx4/(\\zeta\\omega_n)$", why: "$-\\ln(0.02)\\approx3.91$" },
      { do: "Find first peak time", result: "$t_p=\\pi/(\\omega_n\\sqrt{1-\\zeta^2})$", why: "the sine term reaches its first extreme after half an oscillation" },
      { do: "Evaluate the envelope at peak time", result: "$e^{-\\zeta\\pi/\\sqrt{1-\\zeta^2}}$", why: "this gives the overshoot fraction" }
    ],
    applications: [
      { title: "Overshoot", background: "Damping ratio determines the peak overshoot fraction.", numbers: "with $\\zeta=0.5$, $\\omega_n=8$, overshoot is $16.3\\%$." },
      { title: "Settling time", background: "The same pole real part sets the settling time.", numbers: "the same system has $T_s\\approx4/(0.5\\cdot8)=1$ s." },
      { title: "Oscillation period", background: "The imaginary part gives the oscillation period.", numbers: "poles are $-4\\pm j6.928$, so oscillation period is $2\\pi/6.928\\approx0.907$ s." },
      { title: "Higher damping", background: "Increasing damping reduces overshoot.", numbers: "raising damping to $\\zeta=0.7$ gives overshoot $\\approx4.60\\%$." },
      { title: "Dominant pole estimate", background: "A dominant real part gives a quick settling estimate.", numbers: "a dominant pole real part $-3$ gives 2 percent settling about $4/3\\approx1.33$ s." },
      { title: "Robot joint target", background: "An overshoot requirement translates into a damping-ratio target.", numbers: "with allowed $5\\%$ overshoot should use $\\zeta\\approx0.69$ because $e^{-\\zeta\\pi/\\sqrt{1-\\zeta^2}}\\approx0.05$." }
    ]
  },
  "math-26-09": {
    connectionsProse:
      "<p>Transient response studies the journey. Steady-state response studies what remains after stable transients have vanished. Transfer functions make many final values available through limits rather than full inverse transforms. This lesson also connects directly to feedback accuracy and steady-state error.</p>",
    motivation:
      "<p>In many control tasks, the final value matters as much as the path. A temperature controller should settle near the setpoint, a speed controller should remove persistent error, and a sensor model should have the correct DC gain. For stable systems, the final value theorem turns that long-time question into a calculation near $s=0$.</p>" +
      "<p>A unit step is especially important because its transform is $1/s$. Multiplying by a transfer function gives $Y(s)=G(s)/s$, and the final value theorem cancels the step's $s$. That is why a stable unit-step final output is simply the DC gain $G(0)$.</p>",
    definition:
      "<p>For a stable step response, the final value theorem gives $$y(\\infty)=\\lim_{s\\to0}sY(s)=G(0),$$ so the unit-step final output is the DC gain.</p>" +
      "<p><b>Assumptions that matter:</b> the response must settle, the input is a unit step with $U(s)=1/s$, and DC quantities are evaluated at $s=0$.</p>",
    symbols: [
      { sym: "$Y(s)$", desc: "output transform" },
      { sym: "$U(s)$", desc: "input transform" },
      { sym: "$G(0)$", desc: "DC gain" },
      { sym: "$e(\\infty)$", desc: "final error" }
    ],
    derivation: [
      { do: "Write the unit step transform", result: "$U(s)=1/s$", why: "Laplace transform of a unit step" },
      { do: "Compute the output transform", result: "$Y(s)=G(s)U(s)=G(s)/s$", why: "transfer functions multiply inputs" },
      { do: "Apply the final value theorem", result: "$y(\\infty)=\\lim_{s\\to0}sY(s)$", why: "valid when the response settles" },
      { do: "Substitute $Y(s)=G(s)/s$", result: "$y(\\infty)=\\lim_{s\\to0}G(s)$", why: "the $s$ cancels" },
      { do: "Evaluate at zero", result: "$y(\\infty)=G(0)$", why: "a stable unit-step final value is the DC gain" },
      { do: "Use unity-feedback block algebra", result: "$E/R=1/(1+G)$", why: "this is the error transfer" },
      { do: "Evaluate the step error at DC", result: "$e(\\infty)=1/(1+G(0))$", why: "use the final value theorem on the error transfer" }
    ],
    applications: [
      { title: "Unit-step final output", background: "A stable first-order transfer settles to its DC gain.", numbers: "$G(s)=6/(s+3)$ settles to $G(0)=2$ for a unit step." },
      { title: "Unity-feedback error", background: "Finite DC gain leaves a nonzero final step error.", numbers: "with $G(0)=2$ has step error $1/3\\approx0.333$." },
      { title: "Another DC gain", background: "The same calculation applies to another first-order plant.", numbers: "$G(s)=10/(s+5)$ has final step output $2$." },
      { title: "Integrator loop", background: "An integrator makes the DC loop gain infinite in the ideal model.", numbers: "a type-1 loop with an integrator has ideal step error $0$ because $G(0)=\\infty$." },
      { title: "Ramp tracking", background: "Ramp error is read through the velocity constant.", numbers: "a ramp with velocity constant $K_v=5$ has steady error $1/K_v=0.2$." },
      { title: "Sensor calibration", background: "A measured final value estimates DC gain.", numbers: "a sensor with measured final value $0.95$ for unit input has DC gain $0.95$." }
    ]
  },
  "math-26-10": {
    connectionsProse:
      "<p>Stability can be checked by finding poles, but high-degree polynomials can make root finding inconvenient. The Routh-Hurwitz criterion reads stability information directly from polynomial coefficients. This lesson gives the cubic case, which is enough to show how the sign-change test works. Root locus and controller tuning often use this kind of condition to find allowable gain ranges.</p>",
    motivation:
      "<p>The location of roots determines stability, but sometimes the exact root values are less important than knowing whether any root has crossed into the right half-plane. Routh-Hurwitz answers that question without solving the polynomial. It organizes the coefficients into an array whose first column counts right-half-plane roots through sign changes.</p>" +
      "<p>For a cubic with positive leading coefficient, stability reduces to a few inequalities. The coefficients must have the right signs, and the middle interaction condition $ab>c$ must hold. This gives a practical way to test a proposed controller gain before computing the closed-loop poles explicitly.</p>",
    definition:
      "<p>For the cubic characteristic polynomial $$s^3+as^2+bs+c,$$ the Routh-Hurwitz cubic condition is $a>0$, $c>0$, and $ab>c$.</p>" +
      "<p><b>Assumptions that matter:</b> the leading coefficient is positive, stability requires no first-column sign changes, and the compact condition comes from the cubic Routh array.</p>",
    symbols: [
      { sym: "$a,b,c$", desc: "polynomial coefficients" },
      { sym: "Routh array first column", desc: "entries used to count sign changes" },
      { sym: "sign change", desc: "change in sign down the first column" },
      { sym: "right-half-plane root", desc: "root with positive real part" }
    ],
    derivation: [
      { do: "Write the first two rows of the Routh array", result: "$s^3:[1,b]$ and $s^2:[a,c]$", why: "place alternating coefficients" },
      { do: "Compute the $s^1$ first-column entry", result: "$(ab-c)/a$", why: "determinant rule for the next row" },
      { do: "Put the $s^0$ entry", result: "$c$", why: "the constant term forms the last row" },
      { do: "List the first column", result: "$1,\\ a,\\ (ab-c)/a,\\ c$", why: "these decide right-half-plane root count" },
      { do: "Require no sign changes", result: "all first-column entries have the same positive sign", why: "that is the stability condition" },
      { do: "Use the positive leading coefficient", result: "$a>0$, $c>0$, and $(ab-c)/a>0$", why: "$1>0$ fixes the sign direction" },
      { do: "Multiply by $a$", result: "$ab>c$", why: "$a>0$ makes the inequality compact" }
    ],
    applications: [
      { title: "Stable cubic", background: "The first column has no sign changes.", numbers: "$s^3+4s^2+5s+2$ has first column $1,4,4.5,2$, so stable." },
      { title: "Unstable cubic", background: "Sign changes in the first column count right-half-plane roots.", numbers: "$s^3+s^2+s+2$ has middle $(1-2)/1=-1$, first column $1,1,-1,2$, two sign changes." },
      { title: "Gain lower bound", background: "Routh-Hurwitz can impose a controller gain inequality.", numbers: "for $s^3+2s^2+Ks+3$, stability needs $2K>3$, so $K>1.5$." },
      { title: "Gain interval", background: "The same test can give an upper and lower bound.", numbers: "for $s^3+5s^2+6s+K$, stability needs $K>0$ and $30>K$." },
      { title: "Second-order check", background: "For a second-order polynomial, positive coefficients are enough.", numbers: "for $s^2+3s+2$, positive coefficients give stable roots $-1,-2$." },
      { title: "Near boundary", background: "A small positive first-column entry signals little stability margin.", numbers: "a controller gain producing first column $1,3,0.2,5$ is stable but close to the boundary because $0.2$ is small." }
    ]
  },
  "math-26-11": {
    connectionsProse:
      "<p>Routh-Hurwitz can say whether a gain is stable. Root locus shows how the closed-loop poles move as that gain changes. It builds on transfer functions, block diagrams, and the pole interpretation of response. This makes gain tuning visible as motion in the complex plane.</p>",
    motivation:
      "<p>Feedback gain changes the characteristic equation of the closed-loop system. As the gain varies, the roots of that equation trace curves. Those curves show when poles become faster, when they become oscillatory, and when they approach instability.</p>" +
      "<p>In the worked unity-feedback example, the open-loop plant has poles at $0$ and $-2$. Closing the loop with gain $K$ gives the polynomial $s^2+2s+K$. Choosing a particular $K$ then gives the closed-loop pole locations and the response information that comes with them.</p>",
    definition:
      "<p>A <b>root locus</b> tracks the closed-loop poles as gain $K$ varies. For unity feedback with $$G(s)=1/[s(s+2)],$$ the closed-loop characteristic polynomial is $s^2+2s+K$.</p>" +
      "<p><b>Assumptions that matter:</b> the loop is unity feedback, the plant is $G(s)=1/[s(s+2)]$, and closed-loop poles satisfy $1+KG(s)=0$.</p>",
    symbols: [
      { sym: "$K$", desc: "gain" },
      { sym: "$G(s)$", desc: "open-loop transfer" },
      { sym: "root locus", desc: "path of closed-loop poles as gain varies" },
      { sym: "closed-loop pole", desc: "root of the closed-loop characteristic equation" },
      { sym: "characteristic equation", desc: "equation whose roots are closed-loop poles" }
    ],
    derivation: [
      { do: "Write the closed-loop pole condition", result: "$1+KG(s)=0$", why: "denominator of $G/(1+KG)$ must vanish" },
      { do: "Substitute $G$", result: "$1+K/[s(s+2)]=0$", why: "use the plant" },
      { do: "Multiply by $s(s+2)$", result: "$s(s+2)+K=0$", why: "clear the denominator" },
      { do: "Expand", result: "$s^2+2s+K=0$", why: "get the characteristic polynomial" },
      { do: "Set the gain", result: "$K=3$ gives $s^2+2s+3=0$", why: "choose the gain" },
      { do: "Apply the quadratic formula", result: "$s=(-2\\pm\\sqrt{4-12})/2$", why: "solve the roots" },
      { do: "Simplify", result: "$s=-1\\pm j\\sqrt2$", why: "read stable oscillatory poles" }
    ],
    applications: [
      { title: "Chosen gain", background: "Substituting one gain gives one closed-loop pole pair.", numbers: "for $K=3$, poles are $-1\\pm j\\sqrt2$." },
      { title: "Double pole", background: "At one gain the two poles meet on the real axis.", numbers: "for $K=1$, $s^2+2s+1=(s+1)^2$, a double pole at $-1$." },
      { title: "Starting poles", background: "The root locus starts at open-loop poles.", numbers: "for $K=0$, poles start at $0$ and $-2$." },
      { title: "Higher gain", background: "Increasing gain moves the poles farther into the imaginary direction in this example.", numbers: "for $K=5$, poles are $-1\\pm2j$, period $\\pi\\approx3.14$ s." },
      { title: "Damping ratio", background: "Pole coordinates determine damping ratio.", numbers: "for $K=3$ is $1/\\sqrt3\\approx0.577$." },
      { title: "Natural frequency", background: "The same pole pair gives the natural frequency.", numbers: "for $K=3$ is $\\sqrt3\\approx1.732$ rad/s." }
    ]
  },
  "math-26-12": {
    connectionsProse:
      "<p>Transfer functions describe how inputs become outputs. Frequency response studies that relationship one sinusoidal frequency at a time. It connects time-domain differential equations to gain and phase, which are the language of filters, resonance, and robustness. Bode plots in the next lesson organize the same information across many frequencies.</p>",
    motivation:
      "<p>Linear time-invariant systems have a special relationship with sinusoids. A sinusoidal input produces a sinusoidal output at the same frequency, but the amplitude and phase may change. Complex exponentials make this fact algebraic, because differentiation only multiplies $e^{j\\omega t}$ by $j\\omega$.</p>" +
      "<p>Evaluating the transfer function at $s=j\\omega$ gives the multiplier for that frequency. Its magnitude tells how much the input amplitude is scaled, and its angle tells how much the output is shifted in phase. This lets a control designer compare low-frequency tracking, high-frequency noise rejection, and phase delay with one common tool.</p>",
    definition:
      "<p>The <b>frequency response</b> of an LTI system is the transfer function evaluated on the imaginary axis, $$G(j\\omega),$$ whose magnitude scales a sinusoidal input and whose angle shifts its phase.</p>" +
      "<p><b>Assumptions that matter:</b> the system is linear time-invariant and real sinusoids are represented as real parts of complex exponentials.</p>",
    symbols: [
      { sym: "$j$", desc: "imaginary unit" },
      { sym: "$\\omega$", desc: "angular frequency" },
      { sym: "$G(j\\omega)$", desc: "frequency response" },
      { sym: "magnitude", desc: "amplitude scaling" },
      { sym: "phase", desc: "angle shift" }
    ],
    derivation: [
      { do: "Use complex input", result: "$u(t)=e^{j\\omega t}$", why: "real sinusoids are real parts of this signal" },
      { do: "Differentiate", result: "$du/dt=j\\omega e^{j\\omega t}$", why: "differentiating only multiplies by $j\\omega$" },
      { do: "Apply the LTI differential equation", result: "every derivative becomes a factor of $j\\omega$", why: "the same exponential factors out" },
      { do: "Identify the multiplier", result: "$G(j\\omega)$", why: "evaluate the transfer function on the imaginary axis" },
      { do: "Write the output", result: "$y(t)=G(j\\omega)e^{j\\omega t}$", why: "same frequency, complex multiplier" },
      { do: "Read magnitude and phase", result: "$|G(j\\omega)|$ and $\\angle G(j\\omega)$", why: "magnitude scales amplitude and angle shifts phase" }
    ],
    applications: [
      { title: "First-order gain", background: "Evaluate the transfer function at a sinusoidal frequency.", numbers: "$G(s)=2/(s+2)$ at $\\omega=3$ has gain $2/\\sqrt{13}\\approx0.555$." },
      { title: "Phase lag", background: "The complex angle gives phase shift.", numbers: "its phase is $-\\tan^{-1}(3/2)\\approx-56.3^\\circ$." },
      { title: "Voltage scaling", background: "Magnitude directly scales sinusoidal amplitude.", numbers: "a $3$ V input at gain $0.555$ produces $1.66$ V output." },
      { title: "Low-pass attenuation", background: "High frequency is attenuated by a first-order low-pass model.", numbers: "$1/(0.5s+1)$ at $\\omega=10$ has gain $1/\\sqrt{26}\\approx0.196$." },
      { title: "Channel compensation", background: "A known channel attenuation requires inverse amplitude scaling before noise limits.", numbers: "a channel gain $0.25$ needs $4$ times amplitude to compensate before noise limits." },
      { title: "Phase as delay", background: "Phase lag at a frequency can be interpreted as time delay.", numbers: "a phase of $-90^\\circ$ at $6$ rad/s corresponds to delay $\\pi/(12)\\approx0.262$ s." }
    ]
  },
  "math-26-13": {
    connectionsProse:
      "<p>Frequency response gives gain and phase at one frequency. A Bode plot shows those quantities across a wide frequency range. It uses logarithmic frequency and decibels so common transfer-function factors have recognizable shapes. This is the standard picture for bandwidth, rolloff, resonance, and phase margin.</p>",
    motivation:
      "<p>Control systems often need to behave differently at different frequencies. They may track slow commands, reject medium-frequency disturbances, and avoid amplifying high-frequency sensor noise. A Bode plot makes these tradeoffs visible by plotting magnitude and phase against frequency.</p>" +
      "<p>Decibels are useful because products of gains become sums of dB values. A first-order pole gives about $-20$ dB per decade after its corner, and at the corner its magnitude is $1/\\sqrt2$, or about $-3$ dB. These simple patterns let designers sketch and interpret complicated products of factors.</p>",
    definition:
      "<p>A <b>Bode plot</b> shows magnitude in decibels and phase versus logarithmic frequency. For a first-order pole, $$G(s)=1/(1+s/a),$$ the corner magnitude is about $-3.01$ dB and the high-frequency slope is about $-20$ dB per decade.</p>" +
      "<p><b>Assumptions that matter:</b> magnitude dB uses $20\\log_{10}|G|$, and the one-pole slope approximation applies well for $\\omega\\gg a$.</p>",
    symbols: [
      { sym: "$a$", desc: "corner frequency" },
      { sym: "$\\omega$", desc: "frequency" },
      { sym: "dB", desc: "decibel" },
      { sym: "$|G|$", desc: "magnitude" },
      { sym: "$\\angle G$", desc: "phase" }
    ],
    derivation: [
      { do: "Write a first-order pole", result: "$G(s)=1/(1+s/a)$", why: "a first-order pole with corner $a$" },
      { do: "Evaluate at $s=j\\omega$", result: "$G(j\\omega)=1/(1+j\\omega/a)$", why: "frequency response" },
      { do: "Take magnitude", result: "$|G(j\\omega)|=1/\\sqrt{1+(\\omega/a)^2}$", why: "complex magnitude" },
      { do: "Substitute the corner frequency", result: "$|G(ja)|=1/\\sqrt2\\approx0.707$", why: "evaluate at $\\omega=a$" },
      { do: "Convert to dB", result: "$20\\log_{10}(1/\\sqrt2)\\approx-3.01$ dB", why: "amplitude dB formula" },
      { do: "Use the high-frequency approximation", result: "$|G|\\approx a/\\omega$", why: "the high-frequency term dominates" },
      { do: "Increase frequency by one decade", result: "$20\\log_{10}(a/\\omega)$ changes by $-20$ dB", why: "one-pole rolloff" }
    ],
    applications: [
      { title: "Corner magnitude", background: "At the corner, a first-order pole is down by about 3 dB.", numbers: "$G(s)=10/(s+10)$ at $\\omega=10$ has magnitude $-3.01$ dB." },
      { title: "Corner phase", background: "A first-order pole has half its eventual phase lag at the corner.", numbers: "its phase is $-45^\\circ$." },
      { title: "Gain increase", background: "Positive dB corresponds to amplitude multiplication.", numbers: "a $6$ dB gain increase multiplies amplitude by $10^{6/20}\\approx2.00$." },
      { title: "Gain cut", background: "Negative dB corresponds to attenuation.", numbers: "a $-12$ dB cut gives amplitude ratio $10^{-12/20}\\approx0.251$." },
      { title: "Resonance", background: "A resonant peak in dB can be converted to an amplitude ratio.", numbers: "a $14$ dB resonance has ratio $10^{14/20}\\approx5.01$." },
      { title: "Two poles", background: "Each first-order pole adds another rolloff slope.", numbers: "two first-order poles produce about $-40$ dB per decade after both corners." }
    ]
  },
  "math-26-14": {
    connectionsProse:
      "<p>Feedback uses error to choose input. A PID controller is the most common practical way to build that input from the error signal. It combines present error, accumulated past error, and rate of change of error. The Laplace-domain form also connects PID tuning to transfer functions and closed-loop pole behavior.</p>",
    motivation:
      "<p>Proportional action reacts to the current error, so it gives an immediate correction. Integral action accumulates error over time, which helps remove persistent offset that proportional action may leave behind. Derivative action reacts to the error's rate of change, which can add damping or anticipation when used carefully.</p>" +
      "<p>The three terms are easy to write in time domain, but control analysis often uses the Laplace domain. Under zero initial conditions, integration becomes division by $s$ and differentiation becomes multiplication by $s$. That gives the familiar controller transfer $K_P+K_I/s+K_Ds$.</p>",
    definition:
      "<p>A <b>PID controller</b> combines proportional, integral, and derivative action: $$u(t)=K_Pe(t)+K_I\\int_0^t e(\\tau)d\\tau+K_Dde/dt,$$ so under zero initial conditions $U(s)=(K_P+K_I/s+K_Ds)E(s)$.</p>" +
      "<p><b>Assumptions that matter:</b> $e(t)=r(t)-y(t)$, the Laplace transform uses zero initial conditions, and the three terms transform separately.</p>",
    symbols: [
      { sym: "$e$", desc: "error" },
      { sym: "$u$", desc: "control input" },
      { sym: "$K_P,K_I,K_D$", desc: "gains" },
      { sym: "$E(s),U(s)$", desc: "Laplace transforms" }
    ],
    derivation: [
      { do: "Define error", result: "$e(t)=r(t)-y(t)$", why: "reference minus output" },
      { do: "Write the PID law", result: "$u(t)=K_Pe(t)+K_I\\int_0^t e(\\tau)d\\tau+K_Dde/dt$", why: "add P, I, and D actions" },
      { do: "Take Laplace transforms", result: "terms transform separately", why: "use zero initial conditions" },
      { do: "Transform the proportional term", result: "$K_PE(s)$", why: "constants pass through" },
      { do: "Transform the integral term", result: "$K_IE(s)/s$", why: "integration divides by $s$" },
      { do: "Transform the derivative term", result: "$K_DsE(s)$", why: "differentiation multiplies by $s$" },
      { do: "Factor $E(s)$", result: "$U(s)=(K_P+K_I/s+K_Ds)E(s)$", why: "the PID transfer is the bracketed factor" }
    ],
    applications: [
      { title: "Combined PID action", background: "The three terms add to the requested control input.", numbers: "with $e=2$, $\\int e=5$, $de/dt=-0.4$, gains $3,0.8,1.5$, $u=9.4$." },
      { title: "P-only thermostat", background: "Proportional heat depends only on current temperature error.", numbers: "$2^\\circ$C error and $30$ W/degree gives $60$ W." },
      { title: "Integral term", background: "Accumulated error contributes through the integral gain.", numbers: "$K_I=0.5$, accumulated error $8$ gives $4$ units." },
      { title: "Derivative term", background: "A negative rate of error change reduces the requested input.", numbers: "$K_D=0.03$, rate $-20^\\circ$/s gives $-0.6$." },
      { title: "Windup example", background: "Saturation prevents the requested control from being fully delivered.", numbers: "saturation at $5$ when requested $8$ leaves $3$ units unserved." },
      { title: "Robot joint", background: "Position error, accumulated error, and velocity-like error rate all contribute.", numbers: "$e=0.1$, $\\int e=0.3$, $de/dt=-0.2$, gains $20,4,2$ gives $u=2.8$." }
    ]
  },
  "math-26-15": {
    connectionsProse:
      "<p>Transfer functions focus on input-output behavior. State-space models keep track of the internal variables needed to predict future motion. This representation handles multiple inputs and outputs naturally and prepares the rank tests for controllability and observability. It is also the form used for LQR and Kalman filtering.</p>",
    motivation:
      "<p>A higher-order differential equation contains hidden memory, such as position and velocity in a mechanical system. State-space modeling makes that memory explicit by collecting the necessary variables into a vector $x$. Once the state is known, the model can predict the next instant from $\\dot x=Ax+Bu$ and the measured output from $y=Cx+Du$.</p>" +
      "<p>The standard conversion turns one second-order equation into two first-order equations. Position becomes one state, velocity becomes another, and acceleration is rewritten using the original equation. The result is a matrix model whose eigenvalues, input directions, and measured directions can be analyzed systematically.</p>",
    definition:
      "<p>A <b>state-space representation</b> writes dynamics and outputs as $$\\dot x=Ax+Bu,\\qquad y=Cx+Du.$$ For $\\ddot q+3\\dot q+2q=u$ with $y=q$, choose $x_1=q$ and $x_2=\\dot q$.</p>" +
      "<p><b>Assumptions that matter:</b> the state contains enough variables to predict future motion, and the second-order equation is rewritten as two first-order equations.</p>",
    symbols: [
      { sym: "$x$", desc: "state vector" },
      { sym: "$u$", desc: "input" },
      { sym: "$y$", desc: "output" },
      { sym: "$A$", desc: "dynamics matrix" },
      { sym: "$B$", desc: "input matrix" },
      { sym: "$C$", desc: "output matrix" },
      { sym: "$D$", desc: "direct feedthrough" }
    ],
    derivation: [
      { do: "Choose the first state", result: "$x_1=q$", why: "position is part of the needed memory" },
      { do: "Choose the second state", result: "$x_2=\\dot q$", why: "velocity completes the second-order state" },
      { do: "Differentiate $x_1$", result: "$\\dot x_1=x_2$", why: "velocity is position derivative" },
      { do: "Solve the original equation", result: "$\\ddot q=-2q-3\\dot q+u$", why: "isolate acceleration" },
      { do: "Replace variables", result: "$\\dot x_2=-2x_1-3x_2+u$", why: "write acceleration in state variables" },
      { do: "Put coefficients into matrices", result: "$A=\\begin{bmatrix}0&1\\-2&-3\\end{bmatrix}$, $B=\\begin{bmatrix}0\\1\\end{bmatrix}$", why: "state and input coefficients" },
      { do: "Write the output", result: "$y=\\begin{bmatrix}1&0\\end{bmatrix}x$", why: "measure position only" }
    ],
    applications: [
      { title: "Eigenvalues", background: "The matrix eigenvalues give the uncontrolled natural modes.", numbers: "the example has eigenvalues $-1,-2$, so the uncontrolled motion is stable." },
      { title: "Robot state dimension", background: "Each joint needs position and velocity state variables.", numbers: "a two-joint robot with angles and velocities has $4$ states." },
      { title: "Discrete update", background: "A scalar state update predicts the next state from current state and input.", numbers: "$x_{t+1}=0.8x_t+2u_t$, $x_0=5$, $u_0=1$ gives $x_1=6$." },
      { title: "Output matrix", background: "The output matrix selects the measured component.", numbers: "$C=[1\\ 0]$ and $x=[10,2]^T$ gives $y=10$." },
      { title: "Euler prediction", background: "Position advances by velocity times time step.", numbers: "with position $3$ m, velocity $2$ m/s, $\\Delta t=0.1$ gives $3.2$ m." },
      { title: "RNN analogy", background: "A hidden state update is a discrete dynamical system.", numbers: "$h_{t+1}=0.5h_t+x_t$, $h_t=4$, $x_t=3$ gives $5$." }
    ]
  },
  "math-26-16": {
    connectionsProse:
      "<p>State-space models separate the dynamics matrix from the input matrix. Controllability asks whether those inputs can move the full state, not just the variables they touch directly. This lesson gives the rank test that checks reachable directions. Pole placement and LQR both rely on having enough control authority.</p>",
    motivation:
      "<p>An actuator may push only one coordinate directly, but the system dynamics can carry that push into other coordinates over time. A force changes velocity immediately, and velocity then changes position. Controllability measures whether the direct input directions and their dynamically mixed versions span the whole state space.</p>" +
      "<p>The controllability matrix collects those directions as columns. In a two-state system, $B$ gives the direct direction and $AB$ gives the next direction produced by the dynamics. If the rank is the number of states, then the input can influence every independent state direction.</p>",
    definition:
      "<p>For a two-state system $\\dot x=Ax+Bu$, the controllability matrix is $$\\mathcal C=[B\\ AB].$$ The pair is controllable when $\\operatorname{rank}\\mathcal C$ equals the number of states.</p>" +
      "<p><b>Assumptions that matter:</b> $B$ gives direct actuation directions, $AB$ gives dynamically mixed directions, and full rank means those directions span the state space.</p>",
    symbols: [
      { sym: "$A$", desc: "dynamics matrix" },
      { sym: "$B$", desc: "input matrix" },
      { sym: "$n$", desc: "state dimension" },
      { sym: "$\\mathcal C$", desc: "controllability matrix" },
      { sym: "rank", desc: "number of independent columns" },
      { sym: "span", desc: "set of directions generated by the columns" }
    ],
    derivation: [
      { do: "Identify direct input directions", result: "columns of $B$", why: "those are direct actuation directions" },
      { do: "Mix through dynamics", result: "$AB$", why: "the system carries input effects into new directions" },
      { do: "Collect the two-state controllability matrix", result: "$\\mathcal C=[B\\ AB]$", why: "enough columns for the rank test" },
      { do: "Compute $AB$ for the example", result: "$AB=\\begin{bmatrix}1\\0\\end{bmatrix}$", why: "multiply $A=\\begin{bmatrix}0&1\\0&0\\end{bmatrix}$ and $B=\\begin{bmatrix}0\\1\\end{bmatrix}$" },
      { do: "Form $\\mathcal C$", result: "$\\mathcal C=\\begin{bmatrix}0&1\\1&0\\end{bmatrix}$", why: "columns are both coordinate directions" },
      { do: "Compute rank", result: "$\\operatorname{rank}\\mathcal C=2$", why: "columns are independent" },
      { do: "Compare rank with state dimension", result: "rank equals the number of states", why: "the pair is controllable" }
    ],
    applications: [
      { title: "Double integrator", background: "The input reaches both velocity and position through dynamics.", numbers: "has $\\operatorname{rank}\\mathcal C=2$, so position and velocity are reachable." },
      { title: "Uncontrollable input", background: "A direct input that does not mix can leave one direction unreachable.", numbers: "if $B=[1,0]^T$ with the same $A$, $AB=0$ and rank is $1$, not controllable." },
      { title: "Independent actuators", background: "Directly actuating every coordinate gives full rank immediately.", numbers: "two independent actuators $B=I_2$ give rank $2$ immediately." },
      { title: "Three-state chain", background: "Dynamics can propagate a single input through a chain of states.", numbers: "with $B=e_3$ and companion dynamics can produce $B,AB,A^2B=e_3,e_2,e_1$, rank $3$." },
      { title: "Actuator limit", background: "Controllability does not remove magnitude limits on inputs.", numbers: "if velocity needs change $10$ and max input is $2$ per second, at least $5$ s is needed even when controllable." },
      { title: "Feature-control analogy", background: "Updates that span too few directions cannot correct all parameters.", numbers: "if updates span only one of two parameter directions, rank $1$ means one direction cannot be corrected." }
    ]
  },
  "math-26-17": {
    connectionsProse:
      "<p>Controllability asks what inputs can move. Observability asks what measurements can reveal. It uses the same state-space model but looks from the sensor side rather than the actuator side. This idea is essential before designing estimators such as Kalman filters.</p>",
    motivation:
      "<p>A sensor may measure only part of the state directly. Even so, the unmeasured parts can sometimes be inferred from how the measurement changes over time. Position samples, for example, can reveal velocity when the dynamics connect velocity to position.</p>" +
      "<p>The observability matrix stacks the measured direction $C$ and the dynamically shifted measured direction $CA$. If those rows span the state space, then the initial state leaves enough evidence in the output history to be recovered. If the rank is too small, some hidden direction never affects the measurements.</p>",
    definition:
      "<p>For a two-state output model $y=Cx$, the observability matrix is $$\\mathcal O=\\begin{bmatrix}C\\CA\\end{bmatrix}.$$ The pair is observable when $\\operatorname{rank}\\mathcal O$ equals the state dimension.</p>" +
      "<p><b>Assumptions that matter:</b> $C$ gives direct sensor information, $CA$ gives dynamically revealed information, and full row rank means the initial state can be recovered from output history.</p>",
    symbols: [
      { sym: "$C$", desc: "output matrix" },
      { sym: "$A$", desc: "dynamics matrix" },
      { sym: "$\\mathcal O$", desc: "observability matrix" },
      { sym: "rank", desc: "number of independent rows" },
      { sym: "initial state", desc: "state to be recovered from measurements" }
    ],
    derivation: [
      { do: "Write the first measurement", result: "$Cx(0)$", why: "direct sensor information" },
      { do: "Use dynamics in later behavior", result: "$CAx(0)$", why: "dynamics reveal another mixture of the initial state" },
      { do: "Collect the two-state observability matrix", result: "$\\mathcal O=\\begin{bmatrix}C\\CA\\end{bmatrix}$", why: "stack measured directions" },
      { do: "Compute $CA$ for the example", result: "$CA=\\begin{bmatrix}1&1\\end{bmatrix}$", why: "multiply $C=\\begin{bmatrix}1&0\\end{bmatrix}$ by $A=\\begin{bmatrix}1&1\\0&1\\end{bmatrix}$" },
      { do: "Form $\\mathcal O$", result: "$\\mathcal O=\\begin{bmatrix}1&0\\1&1\\end{bmatrix}$", why: "two measurement rows" },
      { do: "Compute determinant", result: "$1$", why: "rows are independent, so rank is $2$" },
      { do: "Compare rank with state dimension", result: "rank equals the state dimension", why: "the pair is observable" }
    ],
    applications: [
      { title: "Worked pair", background: "The stacked measurement rows are independent.", numbers: "has rank $2$, so both states are recoverable." },
      { title: "Hidden position", background: "Measuring the wrong component can hide a state direction.", numbers: "if $C=[0\\ 1]$ with the same $A$, then $CA=[0\\ 1]$, rank $1$, so position is hidden." },
      { title: "Velocity from samples", background: "Position measurements over time reveal velocity in constant-velocity motion.", numbers: "measuring position in constant-velocity motion reveals velocity from two samples: $(x_1-x_0)/\\Delta t$. With $10$ m and $13$ m over $1$ s, velocity is $3$ m/s." },
      { title: "Sensor fusion", background: "Measuring every state directly gives full observability immediately.", numbers: "measuring both states with $C=I_2$ gives rank $2$ immediately." },
      { title: "Kalman filter precheck", background: "An estimator cannot correct a direction that never appears in measurements.", numbers: "unobservable bias state cannot be corrected no matter how small sensor noise is." },
      { title: "Recommender state analogy", background: "Aggregate measurements may hide latent factors if dynamics do not mix them.", numbers: "if only one aggregate metric is measured for a two-factor user state and dynamics do not mix factors, rank stays $1$." }
    ]
  },
  "math-26-18": {
    connectionsProse:
      "<p>Controllability says when the input has enough authority to shape the state. State feedback uses that authority by setting the input as a function of the measured state. Pole placement chooses the feedback gains so the closed-loop eigenvalues land at desired locations. This connects state-space algebra back to the pole-based response ideas from earlier lessons.</p>",
    motivation:
      "<p>In state feedback, the controller does not wait to compare only final output with reference. It uses the current state vector directly, so position and velocity, or other state components, can be corrected together. The gain row $K$ determines how strongly each state component contributes to the input.</p>" +
      "<p>For the double integrator, feedback changes the closed-loop matrix from $A$ to $A-BK$. The characteristic polynomial of that matrix contains the gain entries. By matching it to a desired polynomial, the controller places the closed-loop poles and therefore sets the natural modes of the controlled system.</p>",
    definition:
      "<p><b>State feedback and pole placement</b> choose $u=-Kx$ so the eigenvalues of $$A-BK$$ match desired closed-loop poles. For the double integrator, the characteristic polynomial is $s^2+k_2s+k_1$.</p>" +
      "<p><b>Assumptions that matter:</b> the state is available for feedback, the double integrator has $A=\\begin{bmatrix}0&1\\0&0\\end{bmatrix}$ and $B=\\begin{bmatrix}0\\1\\end{bmatrix}$, and gains are chosen by matching polynomial coefficients.</p>",
    symbols: [
      { sym: "$K$", desc: "feedback gain" },
      { sym: "$A-BK$", desc: "closed-loop dynamics" },
      { sym: "eigenvalues/poles", desc: "natural modes of the closed-loop system" },
      { sym: "characteristic polynomial", desc: "polynomial whose roots are the closed-loop poles" }
    ],
    derivation: [
      { do: "Write the matrices", result: "$A=\\begin{bmatrix}0&1\\0&0\\end{bmatrix}$, $B=\\begin{bmatrix}0\\1\\end{bmatrix}$, $K=\\begin{bmatrix}k_1&k_2\\end{bmatrix}$", why: "define matrices" },
      { do: "Compute $BK$", result: "$BK=\\begin{bmatrix}0&0\\k_1&k_2\\end{bmatrix}$", why: "input column times gain row" },
      { do: "Form the closed-loop matrix", result: "$A-BK=\\begin{bmatrix}0&1\\-k_1&-k_2\\end{bmatrix}$", why: "substitute feedback" },
      { do: "Compute the characteristic polynomial", result: "$\\det(sI-(A-BK))=s^2+k_2s+k_1$", why: "compute determinant" },
      { do: "Expand the desired polynomial", result: "$(s+2)(s+3)=s^2+5s+6$", why: "desired poles $-2,-3$" },
      { do: "Match coefficients", result: "$k_2=5$, $k_1=6$", why: "equal polynomials have equal coefficients" },
      { do: "Write the gain", result: "$K=[6\\ 5]$", why: "this places the poles" }
    ],
    applications: [
      { title: "Desired poles", background: "Matching coefficients gives the state-feedback gain.", numbers: "$-2,-3$ give $K=[6\\ 5]$." },
      { title: "Closed-loop polynomial", background: "The gain creates the desired characteristic polynomial.", numbers: "is $s^2+5s+6$." },
      { title: "Closed-loop modes", background: "The chosen poles determine the modal exponentials.", numbers: "are $e^{-2t}$ and $e^{-3t}$." },
      { title: "Slowest time constant", background: "The less negative pole sets the slowest decay.", numbers: "is $1/2=0.5$ s." },
      { title: "Faster desired poles", background: "More negative desired poles require different gains.", numbers: "if desired poles are $-4,-5$, then target $s^2+9s+20$ gives $K=[20\\ 9]$." },
      { title: "Control effort", background: "The feedback law turns state into input.", numbers: "at $x=[1,0]^T$ with $K=[6\\ 5]$ is $u=-6$." }
    ]
  },
  "math-26-19": {
    connectionsProse:
      "<p>Pole placement chooses desired poles directly. LQR chooses feedback by minimizing a cost that balances state error against control effort. It still produces a stabilizing state-feedback gain, but the gain comes from an optimization problem. This lesson prepares the optimal-control view used again in dynamic programming and reinforcement learning.</p>",
    motivation:
      "<p>Hand-selecting poles can be effective, but it does not say how expensive the required control effort will be. LQR makes that tradeoff explicit with a quadratic cost: large states are penalized, and large inputs are penalized too. Changing the weights changes whether the controller acts aggressively or conservatively.</p>" +
      "<p>In the scalar integrator, the value function is quadratic because both the dynamics and cost are simple. The Hamilton-Jacobi-Bellman condition finds the input that minimizes immediate cost plus future value change. Solving the resulting algebra gives the feedback gain $K=\\sqrt{q/r}$.</p>",
    definition:
      "<p>The scalar continuous-time LQR for $$\\dot x=u,\\qquad J=\\int_0^\\infty(qx^2+ru^2)dt$$ gives optimal feedback $u=-Kx$ with $K=\\sqrt{q/r}$.</p>" +
      "<p><b>Assumptions that matter:</b> $q$ penalizes state, $r$ penalizes effort, the value function is quadratic, and the positive stabilizing Riccati root is used.</p>",
    symbols: [
      { sym: "$J$", desc: "total cost" },
      { sym: "$Q$ or $q$", desc: "state penalty" },
      { sym: "$R$ or $r$", desc: "effort penalty" },
      { sym: "$P$", desc: "Riccati/value coefficient" },
      { sym: "$K$", desc: "feedback gain" }
    ],
    derivation: [
      { do: "Assume a value function", result: "$V(x)=Px^2$", why: "quadratic cost and linear dynamics preserve quadratic form" },
      { do: "Write the HJB stationary condition", result: "$0=\\min_u(qx^2+ru^2+V_xu)$", why: "running cost plus value change" },
      { do: "Compute the value derivative", result: "$V_x=2Px$", why: "derivative of the value function" },
      { do: "Differentiate with respect to $u$", result: "$2ru+2Px=0$", why: "first-order optimality" },
      { do: "Solve for the minimizing input", result: "$u=-(P/r)x$", why: "optimal feedback is linear" },
      { do: "Substitute back into HJB", result: "$0=qx^2+r(P^2/r^2)x^2-2P^2/r\\,x^2$", why: "plug the minimizing input into HJB" },
      { do: "Combine terms", result: "$0=(q-P^2/r)x^2$", why: "one quadratic coefficient must vanish" },
      { do: "Solve for the stabilizing gain", result: "$P=\\sqrt{qr}$ and $K=P/r=\\sqrt{q/r}$", why: "take the positive stabilizing root" }
    ],
    applications: [
      { title: "Trial cost", background: "State and effort penalties add in a quadratic running cost.", numbers: "at $x=3$, $u=-3$ is $9+0.25\\cdot9=11.25$." },
      { title: "More effort", background: "A larger input can cost more even when it moves faster.", numbers: "trial $u=-6$ gives $9+0.25\\cdot36=18$, so $u=-x$ is cheaper among the two." },
      { title: "Scalar optimal gain", background: "The scalar LQR formula gives the feedback gain directly.", numbers: "for scalar integrator with $q=1$, $r=0.25$, optimal gain is $K=\\sqrt{1/0.25}=2$." },
      { title: "Closed-loop pole", background: "The optimal feedback sets the scalar closed-loop decay rate.", numbers: "the feedback $u=-2x$ puts the scalar closed-loop pole at $-2$." },
      { title: "Effort penalty", background: "Increasing effort cost makes the controller less aggressive.", numbers: "if $r=4$, $K=0.5$, so effort is weighted more heavily." },
      { title: "Value coefficient", background: "The Riccati coefficient turns state into optimal remaining cost.", numbers: "for $q=1$, $r=0.25$ is $P=0.5$, so $V(3)=4.5$." }
    ]
  },
  "math-26-20": {
    connectionsProse:
      "<p>Observability says whether measurements contain enough information to recover state. Kalman filtering gives a principled way to estimate that state when measurements and models are noisy. It blends prediction with correction using uncertainty. The same state-space viewpoint used for control gains now supports sensor fusion and estimation.</p>",
    motivation:
      "<p>A model prediction is useful but imperfect, and a sensor measurement is useful but noisy. A Kalman filter combines them by weighting each source according to its variance. When the prior estimate is uncertain or the measurement is accurate, the gain is larger and the filter moves strongly toward the measurement.</p>" +
      "<p>In the scalar direct-measurement case, the update is a weighted correction by the innovation $y-\\hat x^-$. The best gain is found by minimizing the posterior error variance. The algebra gives $K=P^-/(P^-+R)$, which is a clear uncertainty ratio.</p>",
    definition:
      "<p>For a scalar direct measurement, the Kalman update is $$\\hat x^+=\\hat x^-+K(y-\\hat x^-),\\qquad K=\\frac{P^-}{P^-+R}.$$</p>" +
      "<p><b>Assumptions that matter:</b> the measurement is $y=x+v$, prior error and measurement noise are independent, and $K$ is chosen to minimize posterior variance.</p>",
    symbols: [
      { sym: "$\\hat x^-$", desc: "prior estimate" },
      { sym: "$\\hat x^+$", desc: "posterior estimate" },
      { sym: "$P^-$", desc: "prior variance" },
      { sym: "$R$", desc: "measurement variance" },
      { sym: "$K$", desc: "Kalman gain" },
      { sym: "$y$", desc: "measurement" }
    ],
    derivation: [
      { do: "Define the prior and measurement", result: "$\\hat x^-$ with variance $P^-$ and $y=x+v$ with variance $R$", why: "define information sources" },
      { do: "Use the correction update", result: "$\\hat x^+=\\hat x^-+K(y-\\hat x^-)$", why: "correct by the innovation" },
      { do: "Compute error after update", result: "$x-\\hat x^+=(1-K)(x-\\hat x^-)-Kv$", why: "substitute $y=x+v$" },
      { do: "Compute posterior variance", result: "$P^+=(1-K)^2P^-+K^2R$", why: "independent prior error and measurement noise add variances" },
      { do: "Differentiate", result: "$dP^+/dK=-2(1-K)P^-+2KR$", why: "minimize posterior variance" },
      { do: "Set the derivative to zero", result: "$(1-K)P^-=KR$", why: "balance weighted uncertainties" },
      { do: "Solve for the gain", result: "$K=P^-/(P^-+R)$", why: "isolate the Kalman gain" }
    ],
    applications: [
      { title: "Prior and sensor blend", background: "The gain weights a sensor correction by relative uncertainty.", numbers: "prior $10$, variance $4$, sensor $13$, variance $1$ gives $K=4/5=0.8$." },
      { title: "Posterior estimate", background: "Apply the gain to the innovation.", numbers: "is $10+0.8(3)=12.4$." },
      { title: "Posterior variance", background: "The scalar update reduces uncertainty after measurement.", numbers: "is $(1-0.8)4=0.8$ using the simplified scalar formula." },
      { title: "Noisier measurement", background: "Larger measurement variance lowers the gain.", numbers: "if measurement variance rises to $9$, gain becomes $4/(4+9)=0.308$." },
      { title: "Trusted model", background: "Small prior variance makes the filter trust the model more.", numbers: "if prior variance is $0.25$ and sensor variance is $1$, gain is $0.2$, so the filter trusts the model more." },
      { title: "Sensor fusion analogy", background: "Lower-variance estimates receive larger weight.", numbers: "two independent estimates with variances $4$ and $1$ weight the low-variance sensor $4$ times as strongly." }
    ]
  },
  "math-26-21": {
    connectionsProse:
      "<p>LQR is one structured example of optimal control. This lesson states the broader idea: choose actions over time to minimize cost while obeying dynamics. The value function records the best remaining cost from each state. This language leads naturally to model predictive control and to Bellman equations in reinforcement learning.</p>",
    motivation:
      "<p>Control design often involves competing goals. Moving the state closer to a target is good, but large actions may be costly, unsafe, or impossible. Optimal control writes these goals as an objective and then solves for the action sequence that gives the best tradeoff.</p>" +
      "<p>The one-step quadratic example keeps the full idea visible. The next state is $x_1=x_0+u$, and the cost penalizes both the next state and the action. Substituting the dynamics turns the problem into one convex quadratic in $u$, so ordinary differentiation finds the optimal control.</p>",
    definition:
      "<p><b>Optimal control</b> chooses actions to minimize an objective while obeying dynamics. In the one-step quadratic problem $$x_1=x_0+u,\\qquad J=x_1^2+u^2,$$ substituting the dynamics reduces the choice to one quadratic in $u$.</p>" +
      "<p><b>Assumptions that matter:</b> the example has one step, dynamics $x_1=x_0+u$, cost $J=x_1^2+u^2$, and $x_0=4$ for the worked minimizer.</p>",
    symbols: [
      { sym: "$x_t$", desc: "state" },
      { sym: "$u$", desc: "control" },
      { sym: "$J$", desc: "objective" },
      { sym: "$L$", desc: "running cost" },
      { sym: "$\\phi$", desc: "terminal cost" },
      { sym: "$V$", desc: "value function" }
    ],
    derivation: [
      { do: "Substitute dynamics into cost", result: "$J(u)=(x_0+u)^2+u^2$", why: "eliminate the next state" },
      { do: "Use the starting state", result: "$J(u)=(4+u)^2+u^2$", why: "use $x_0=4$" },
      { do: "Expand", result: "$J=16+8u+2u^2$", why: "prepare for minimization" },
      { do: "Differentiate", result: "$dJ/du=8+4u$", why: "first-order condition" },
      { do: "Set derivative to zero", result: "$8+4u=0$", why: "optimum of a convex quadratic" },
      { do: "Solve", result: "$u=-2$", why: "best one-step control" },
      { do: "Evaluate optimal cost", result: "$(4-2)^2+(-2)^2=8$", why: "evaluate the chosen action" }
    ],
    applications: [
      { title: "Trial action", background: "A candidate action produces a next state and action cost.", numbers: "$u=-1$ gives $J=3^2+1=10$." },
      { title: "Better trial action", background: "Another candidate lowers the objective.", numbers: "$u=-2$ gives $J=2^2+4=8$, so it is better." },
      { title: "Exact minimizer", background: "Differentiation gives the best one-step action.", numbers: "is $u=-2$." },
      { title: "Model predictive control", background: "A finite horizon can be searched over candidate action sequences.", numbers: "with horizon $3$ and $4$ actions per step checks $4^3=64$ sequences by brute force." },
      { title: "Fuel penalty", background: "A larger action penalty makes the optimal action smaller in magnitude.", numbers: "if cost is $(4+u)^2+4u^2$, optimum solves $8+10u=0$, so $u=-0.8$." },
      { title: "Terminal-only control", background: "A hard action bound can prevent reaching the target in one step.", numbers: "with $x_0=4$, target $0$, and max action $|u|\\le1$ can only reach $x_1=3$ in one step." }
    ]
  },
  "math-26-22": {
    connectionsProse:
      "<p>Control theory and reinforcement learning both study actions that affect future states. Control often begins with a known model and a cost to minimize, while reinforcement learning often learns values or policies from sampled rewards. The mathematical bridge is the value function. This final lesson connects the control vocabulary from this section to the Bellman recursion used in RL.</p>",
    motivation:
      "<p>In a sequential decision problem, an action matters because it changes not only the immediate reward or cost but also the future state. A value function summarizes those future consequences. Instead of evaluating an entire infinite sequence from scratch each time, the Bellman equation separates the first reward from the value of what remains.</p>" +
      "<p>The discount factor $\\gamma$ controls how strongly future rewards count, in the standard discounted setting. By pulling out the first term of the return and recognizing the rest as the next return, the infinite sum becomes a recursion. That recursion is the shared backbone behind dynamic programming, value estimation, and many RL algorithms.</p>",
    definition:
      "<p>For a fixed policy, the Bellman equation rewrites discounted return as a one-step recursion: $$V^\\pi(s)=\\mathbb E[r(s,a)+\\gamma V^\\pi(s')\\mid s].$$</p>" +
      "<p><b>Assumptions that matter:</b> rewards are discounted with $0\\le\\gamma<1$ in the standard discounted setting, the policy is fixed, and value is an expected return.</p>",
    symbols: [
      { sym: "$s$", desc: "state" },
      { sym: "$a$", desc: "action" },
      { sym: "$\\pi$", desc: "policy" },
      { sym: "$r$", desc: "reward" },
      { sym: "$\\gamma$", desc: "discount" },
      { sym: "$V^\\pi$", desc: "value function" },
      { sym: "$s'$", desc: "next state" }
    ],
    derivation: [
      { do: "Define return", result: "$G_t=\\sum_{k=0}^{\\infty}\\gamma^k r_{t+k}$", why: "discounted future reward" },
      { do: "Separate the first term", result: "$G_t=r_t+\\sum_{k=1}^{\\infty}\\gamma^k r_{t+k}$", why: "isolate immediate reward" },
      { do: "Re-index the tail", result: "$\\sum_{k=1}^{\\infty}\\gamma^k r_{t+k}=\\gamma\\sum_{m=0}^{\\infty}\\gamma^m r_{t+1+m}$", why: "factor one discount" },
      { do: "Recognize the next return", result: "$\\gamma G_{t+1}$", why: "same return starting next step" },
      { do: "Take conditional expectation under policy $\\pi$", result: "$V^\\pi(s)=\\mathbb E[r_t+\\gamma G_{t+1}\\mid s_t=s]$", why: "value is expected return" },
      { do: "Replace expected next return by next-state value", result: "$V^\\pi(s)=\\mathbb E[r(s,a)+\\gamma V^\\pi(s')\\mid s]$", why: "Bellman recursion" }
    ],
    applications: [
      { title: "Discounted return", background: "Discounted rewards are summed with powers of $\\gamma$.", numbers: "rewards $2,1,4$ with $\\gamma=0.9$ give return $2+0.9+0.81\\cdot4=6.14$." },
      { title: "Q-learning target", background: "A one-step target adds reward and discounted next value.", numbers: "with reward $2$, next value $5$, discount $0.9$ is $6.5$." },
      { title: "LQR value", background: "A quadratic value function measures improvement from reducing state.", numbers: "$V(x)=2x^2$ gives $V(3)=18$ and $V(1)=2$, saving $16$." },
      { title: "Exploration rate", background: "An $\\epsilon$-greedy policy randomizes on a fraction of decisions.", numbers: "an $\\epsilon$-greedy policy with $\\epsilon=0.1$ explores about $10$ times in $100$ decisions." },
      { title: "Reward-cost sign", background: "Maximizing reward is equivalent to minimizing negative reward as cost.", numbers: "reward maximization equals cost minimization by sign: rewards $3,2$ correspond to costs $-3,-2$ and total cost $-5$." },
      { title: "Policy-gradient update", background: "A gradient estimate and learning rate determine the parameter step.", numbers: "a policy-gradient estimate $-4$ with learning rate $0.05$ updates the parameter by $-0.2$." }
    ]
  }
};
