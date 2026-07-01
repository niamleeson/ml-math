/* All ML — authored content for Part 14: Time Series & Forecasting (14.1–14.10).
   Appends to window.ALLML_CONTENT. Numbers were computed in Python first; LaTeX uses
   String.raw; emphasis is bold and there are no prose italics. */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

/* ---------------- 14.1 Decomposition & stationarity ---------------- */
window.ALLML_CONTENT["14.1"] = {
  tagline: "A time series becomes learnable when we separate trend, seasonality, and residual noise, then ask which part has stable rules.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/14.1-decomposition-stationarity.ipynb",
  context: String.raw`
    <p>Time series forecasting starts by respecting order. The vectors and regression tools from earlier lessons give us the machinery: a time index becomes a feature column, least squares estimates slow drift, and residuals become the object we check for stable behavior.</p>
    <ul>
      <li><b>Linear regression</b> supplies the trend fit: the design matrix $X\\in\\mathbb{R}^{n\\times 2}$ contains a constant and time, so $X\\hat\\beta$ is the slow-moving component.</li>
      <li><b>Expectation and variance</b> define stationarity: the mean, variance, and lag relationships should not depend on the calendar time at which we measure them.</li>
      <li><b>Residual thinking</b> carries forward from supervised learning: after explaining the systematic pieces, the leftover should look closer to noise.</li>
    </ul>
    <p>Where it leads: autocorrelation and spectra (14.2) measure the remaining temporal dependence, ARIMA and SARIMA (14.3) model it explicitly, and backtesting (14.10) checks whether the decomposition helped forecasts rather than merely making a pretty plot.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a raw time series mixes causes. A sales curve may rise because the product is growing, pulse because weekends differ from weekdays, and wiggle because of noise. Forecasting that mixture directly is painful because the model must learn slow drift, repeating cycles, and random shocks all at once.</p>
    <p>Decomposition is the wise move: ask what changes slowly, what repeats, and what remains. Stationarity is the companion question: after removing the pieces that obviously change over time, do the residual rules stay steady enough that yesterday's relationships are still useful tomorrow?</p>
    <p>The design decision people gloss over is additive versus multiplicative decomposition. Additive means a seasonal bump adds the same amount regardless of level; multiplicative means it scales with level. The notebook uses additive synthetic data because it keeps the arithmetic visible, but the decision is substantive: choose the form that makes residual variation stable, not the one that merely fits the plot by eye.</p>`,
  mathematics: String.raw`
    <p>An additive decomposition writes an observed vector $y\\in\\mathbb{R}^{n}$ as</p>
    <div class="formula-box">$$y_t = T_t + S_t + e_t, \\qquad t=0,\\ldots,n-1$$</div>
    <p>Here $T_t$ is trend, $S_t$ is the seasonal component at time $t$, and $e_t$ is the residual. Weak stationarity asks that $\\mathbb{E}[e_t]=\\mu$, $\\operatorname{Var}(e_t)=\\sigma^2$, and $\\operatorname{Cov}(e_t,e_{t-k})=\\gamma_k$ depend on lag $k$, not on absolute time $t$.</p>

    <p><b>Fit the trend before reading the residual.</b> For six points $y=\\{10,12.5,11,9.5,12,14.5\\}$ and time $t=\\{0,1,2,3,4,5\\}$, least squares on $[1,t]$ gives:</p>
    <ol class="work">
      <li>$\\hat\\beta=(X^\\top X)^{-1}X^\\top y=(10.190,0.557)$, so $\\hat T_t=10.190+0.557t$</li>
      <li>at $t=3$, $\\hat T_3=10.190+0.557\\cdot3=11.862$</li>
      <li>residual at $t=3$: $e_3=9.500-11.862=-2.362$</li>
      <li>all residuals are $\\{-0.190,1.752,-0.305,-2.362,-0.419,1.524\\}$</li>
    </ol>
    <p>Those residuals alternate above and below zero rather than drifting upward, which is exactly why decomposition is useful: it turns a changing-level problem into a repeating-pattern problem.</p>

    <p><b>Stationarity is a before-and-after claim.</b> In the synthetic notebook series with trend $0.12t$, a 12-step rolling mean changes by more than $6.0$ units from start to finish. After first differencing, the same rolling-mean drift is below $0.2$. The operation is simple but consequential: $\\Delta y_t=y_t-y_{t-1}$ removes a linear level trend and leaves increments whose average is much more stable.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Calling a decomposed plot a forecast.</b> The formula $y_t=T_t+S_t+e_t$ describes history; forecasting still requires extending $T_t$ and $S_t$ without peeking at future $e_t$.</li>
      <li><b>Checking stationarity on raw levels.</b> If $T_t$ remains in the data, the mean term changes with $t$, so ACF and AR models in 14.2–14.3 inherit a false dependence.</li>
      <li><b>Using additive seasonality when variance grows with level.</b> Then $e_t$ gets larger as $T_t$ grows, violating the constant-variance part of stationarity.</li>
    </ul>`
};

/* ---------------- 14.2 Autocorrelation & spectral analysis ---------------- */
window.ALLML_CONTENT["14.2"] = {
  tagline: "Autocorrelation sees repetition in lag space; the spectrum sees the same repetition as frequency energy.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/14.2-autocorrelation-spectral-analysis.ipynb",
  context: String.raw`
    <p>Once decomposition (14.1) has removed obvious trend, we need a ruler for dependence across time. Autocorrelation uses covariance at a lag; spectral analysis uses the discrete Fourier transform to ask which cycles explain the variance.</p>
    <ul>
      <li><b>Covariance</b> becomes lag covariance: compare $y_t$ with $y_{t-k}$ instead of with another feature column.</li>
      <li><b>Orthogonal bases</b> become sine and cosine waves; the spectrum measures how much of the signal projects onto each wave.</li>
      <li><b>Stationarity</b> matters because a lag relationship should mean the same thing wherever it is measured.</li>
    </ul>
    <p>Where it leads: AR and MA orders in 14.3 are chosen by lag structure, seasonal models use ACF peaks to find periods, and anomaly detection (14.8) often scores residuals after the predictable frequencies are removed.</p>`,
  intuition: String.raw`
    <p>The concrete problem is deciding whether a time series remembers itself. If high values tend to be followed by high values, we should use that memory. If the series repeats every 12 steps, a forecast should know that too.</p>
    <p>Autocorrelation asks the direct question: shift the series by $k$ steps and measure how well it lines up with itself. Spectral analysis asks the complementary question: which smooth cycles, when added together, recreate the series? These are not competing stories; they are two coordinate systems for temporal structure.</p>
    <p>The design decision people miss is detrending before spectral analysis. A trend pours energy into very low frequencies, making a seasonal peak look less important than it is. The correct sequence is to remove slow drift first, then read cycles.</p>`,
  mathematics: String.raw`
    <p>For centered observations $x_t=y_t-\\bar y$, the sample autocorrelation at lag $k$ is</p>
    <div class="formula-box">$$r_k=\\frac{\\sum_{t=k}^{n-1}x_t x_{t-k}}{\\sum_{t=0}^{n-1}x_t^2}$$</div>
    <p>The numerator compares pairs $k$ steps apart; the denominator normalizes by total energy. For the spectrum, the DFT coefficient at frequency bin $j$ is $X_j=\\sum_{t=0}^{n-1}y_t e^{-2\\pi ijt/n}$ and the periodogram is $|X_j|^2/n$.</p>

    <p><b>A lag calculation by hand.</b> For $y=\\{1,0,-1,0\\}$ the mean is zero and total energy is $1^2+0^2+(-1)^2+0^2=2$.</p>
    <ol class="work">
      <li>lag 1 numerator $=1\\cdot0+0\\cdot(-1)+(-1)\\cdot0=0$, so $r_1=0/2=0.000$</li>
      <li>lag 2 numerator $=1\\cdot(-1)+0\\cdot0=-1$, so $r_2=-1/2=-0.500$</li>
      <li>DFT periodogram for the same vector is $\\{0.000,1.000,0.000\\}$ over the nonnegative frequency bins</li>
    </ol>
    <p>The lag view says points two steps apart are opposites; the frequency view says the signal's energy is concentrated in the one cycle that alternates that way.</p>

    <p><b>Seasonality appears as repeated lag peaks.</b> In a clean sine wave with period 12, the notebook computes $r_{12} \\gt 0.8$ and $r_6 \\lt -0.4$. The periodogram's largest nonzero bin occurs at frequency $1/12=0.0833$. Those two numbers are the same structure read in different languages: strong agreement after a full cycle and disagreement after half a cycle.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Reading trend as memory.</b> If $x_t$ is not centered around a stable mean, $r_k$ can stay high because both ends share a trend, not because the residual process is predictive.</li>
      <li><b>Confusing frequency with period.</b> The DFT bin reports cycles per step; the period is its reciprocal, so frequency $0.0833$ means about 12 steps per cycle.</li>
      <li><b>Trusting noisy spikes.</b> White noise has random ACF bumps; the mechanism is finite-sample covariance, not a real repeating component.</li>
    </ul>`
};

/* ---------------- 14.3 AR, MA, ARIMA & SARIMA ---------------- */
window.ALLML_CONTENT["14.3"] = {
  tagline: "ARIMA forecasts by combining memory of past values, memory of past shocks, differencing, and seasonal repetition.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/14.3-ar-ma-arima-sarima.ipynb",
  context: String.raw`
    <p>Autocorrelation (14.2) tells us whether a series remembers its past; ARIMA turns that memory into a forecasting equation. Decomposition and stationarity (14.1) tell us when differencing is needed before the equation is trustworthy.</p>
    <ul>
      <li><b>Linear models</b> reappear with lagged features: $y_{t-1},y_{t-2},\\ldots$ are the predictors.</li>
      <li><b>Residuals</b> become shocks $\\varepsilon_t$, and MA terms let recent surprises influence the next value.</li>
      <li><b>Seasonality</b> enters by using lag $s$ differences and seasonal AR or MA terms.</li>
    </ul>
    <p>Where it leads: exponential smoothing (14.4) offers a state-based cousin, state-space models (14.5) generalize the same recursion with uncertainty, and evaluation (14.10) decides whether these small statistical models beat larger neural ones.</p>`,
  intuition: String.raw`
    <p>The concrete problem is forecasting a single series when we believe its future is mostly a disciplined echo of its past. A naive forecast might copy yesterday or last season; ARIMA learns how much to copy, how much to correct for recent shocks, and whether the level must be differenced first.</p>
    <p>AR means the value remembers previous values. MA means the value remembers previous forecast errors. I means we model changes rather than levels. SARIMA adds the same logic at a seasonal lag, such as 12 months or 7 days.</p>
    <p>The design decision people gloss over is differencing. Differencing is not a cosmetic preprocessing step; it changes the target from level to increment. Use it when the level is nonstationary, and avoid it when the level is already stable, because unnecessary differencing throws away signal.</p>`,
  mathematics: String.raw`
    <p>A compact ARIMA$(p,d,q)$ model says the differenced series $z_t=\\Delta^d y_t$ follows</p>
    <div class="formula-box">$$z_t = c + \\sum_{i=1}^{p}\\phi_i z_{t-i}+\\varepsilon_t+\\sum_{j=1}^{q}\\theta_j\\varepsilon_{t-j}$$</div>
    <p>Here $p$ is the number of autoregressive lags, $d$ the number of differences, $q$ the number of moving-average shock lags, and $\\varepsilon_t$ is white-noise innovation. SARIMA adds the same structure at seasonal lag $s$.</p>

    <p><b>Autoregressive memory.</b> With AR(1) coefficient $\\phi=0.6$ and initial value $y_0=2.0$:</p>
    <ol class="work">
      <li>$y_1=0.6\\cdot2.0=1.200$</li>
      <li>$y_2=0.6\\cdot1.200=0.720$</li>
      <li>$y_3=0.6\\cdot0.720=0.432$</li>
      <li>$y_4=0.6\\cdot0.432=0.2592$</li>
    </ol>
    <p>The memory decays geometrically, so a stable AR coefficient must have magnitude below one in this one-lag case.</p>

    <p><b>Shock memory and differencing.</b> With MA(1) coefficient $\\theta=0.4$ and shocks $\\{1.0,-0.5,0.2\\}$:</p>
    <ol class="work">
      <li>$y_0=1.0$</li>
      <li>$y_1=-0.5+0.4\\cdot1.0=-0.100$</li>
      <li>$y_2=0.2+0.4\\cdot(-0.5)=0.000$</li>
      <li>for levels $\\{3,4,6,9\\}$, first differences are $\\{1,2,3\\}$</li>
    </ol>
    <p>The MA part says recent forecast errors matter briefly; the differencing part says the model is about increments rather than raw levels.</p>

    <p><b>Seasonal memory.</b> For a four-step season, the notebook's seasonal difference $y_t-y_{t-4}$ equals $0.4$ at every comparable point after removing the repeated seasonal pattern. A small SARIMA-style forecast then uses last season's value $10.5$ plus half of the last seasonal residual $0.2$, giving $10.5+0.5\\cdot0.2=10.600$.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Fitting AR terms to a trended level.</b> The $\\phi_i z_{t-i}$ terms assume stable lag relationships; unremoved trend makes persistence look stronger than it is.</li>
      <li><b>Over-differencing.</b> Each $\\Delta$ subtracts neighboring observations and can turn smooth signal into noisy increments, inflating the MA terms.</li>
      <li><b>Ignoring residual checks.</b> If fitted residuals still have ACF peaks, the chosen $p,q$ or seasonal terms did not capture the dependence.</li>
    </ul>`
};

/* ---------------- 14.4 Exponential smoothing (Holt-Winters) ---------------- */
window.ALLML_CONTENT["14.4"] = {
  tagline: "Exponential smoothing forecasts by keeping a few recency-weighted states: level, trend, and season.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/14.4-exponential-smoothing-holt-winters.ipynb",
  context: String.raw`
    <p>ARIMA (14.3) models lag equations; exponential smoothing models the components directly. It is still decomposition (14.1), but now level, trend, and season are updated online as each observation arrives.</p>
    <ul>
      <li><b>Weighted averages</b> provide the mechanism: recent observations get weight $\\alpha$, older information survives through the previous state.</li>
      <li><b>Trend</b> becomes a state variable $b_t$, not a coefficient fit once to all history.</li>
      <li><b>Seasonality</b> becomes a rotating bank of offsets, one for each position in the seasonal cycle.</li>
    </ul>
    <p>Where it leads: state-space models (14.5) put uncertainty around these updates, Prophet (14.6) uses a more structured additive decomposition, and backtesting (14.10) often finds Holt-Winters hard to beat on clean seasonal business series.</p>`,
  intuition: String.raw`
    <p>The concrete problem is forecasting a series whose newest values should matter more than very old values, but not so much that one noisy point whips the forecast around. Exponential smoothing solves this with a controlled memory.</p>
    <p>The mental model is a thermostat for belief. The level moves partway toward each new observation, the trend moves partway toward the newest slope, and the seasonal offset moves partway toward the newest same-season residual.</p>
    <p>The design decision is the smoothing parameter. A high $\\alpha$ reacts quickly and chases noise; a low $\\alpha$ is stable and slow. The right value is not philosophical. It is the one that wins chronological validation.</p>`,
  mathematics: String.raw`
    <p>Simple exponential smoothing updates level $\\ell_t$ by</p>
    <div class="formula-box">$$\\ell_t=\\alpha y_t+(1-\\alpha)\\ell_{t-1}, \\qquad \\hat y_{t+1}=\\ell_t$$</div>
    <p>Holt adds trend $b_t$, and additive Holt-Winters adds seasonal state $s_t$ with period $m$: $\\hat y_{t+h}=\\ell_t+h b_t+s_{t+h-m}$.</p>

    <p><b>Simple smoothing by hand.</b> With $y=\\{10,12,13,12\\}$ and $\\alpha=0.5$:</p>
    <ol class="work">
      <li>$\\ell_0=10$</li>
      <li>$\\ell_1=0.5\\cdot12+0.5\\cdot10=11.000$</li>
      <li>$\\ell_2=0.5\\cdot13+0.5\\cdot11=12.000$</li>
      <li>$\\ell_3=0.5\\cdot12+0.5\\cdot12=12.000$</li>
    </ol>
    <p>The forecast follows the level, but each move is softened by the previous belief.</p>

    <p><b>Trend and season updates.</b> Start Holt with level $10$, trend $1$, observe $12$, and use $\\alpha=0.5$, $\\beta=0.25$:</p>
    <ol class="work">
      <li>new level $=0.5\\cdot12+0.5\\cdot(10+1)=11.500$</li>
      <li>new trend $=0.25\\cdot(11.500-10)+0.75\\cdot1=1.125$</li>
      <li>next forecast $=11.500+1.125=12.625$</li>
      <li>season update with $\\gamma=0.3$, observation $15$, level-plus-trend $12$, old season $2$: $0.3(15-12)+0.7\\cdot2=2.300$</li>
    </ol>
    <p>Each state moves toward fresh evidence but preserves continuity, which is why the method behaves well on short, noisy series.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting $\\alpha$ chase noise.</b> A large recency weight makes $\\ell_t$ respond to residual shocks as if they were level changes.</li>
      <li><b>Using additive seasonality for percentage effects.</b> If seasonal amplitude scales with level, the additive $s_t$ term leaves residual variance nonconstant.</li>
      <li><b>Forgetting initialization.</b> Bad initial $\\ell_0$, $b_0$, or seasonal states can dominate short histories because the recursion has not had time to wash them out.</li>
    </ul>`
};

/* ---------------- 14.5 State-space models ---------------- */
window.ALLML_CONTENT["14.5"] = {
  tagline: "State-space models forecast hidden dynamics while using noisy observations to correct belief with calibrated uncertainty.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/14.5-state-space-models.ipynb",
  context: String.raw`
    <p>State-space models are the probabilistic backbone beneath many smoothing and forecasting methods. They keep the useful idea from 14.4, a small evolving state, and add a formal uncertainty calculation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies transition matrices that move a hidden state forward.</li>
      <li><b>Gaussian conditioning</b> supplies the Kalman update: combine prior belief and observation using their variances.</li>
      <li><b>Residuals</b> become innovations, the difference between what the state predicted and what was observed.</li>
    </ul>
    <p>Where it leads: ARIMA can be written in state-space form, modern tracking systems use the same predict-update loop, and anomaly detection (14.8) often scores unusually large innovations.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that the thing we care about is often hidden. Demand, position, or true level evolves smoothly, while the measurement is noisy. If we trust observations too much, the forecast jitters; if we trust the model too much, it lags real changes.</p>
    <p>The state-space mental model is a disciplined conversation. The model says, "Here is where I think the hidden state moved, and how uncertain I am." The observation says, "Here is what I saw, with its own noise." The Kalman gain decides how far to move toward the observation.</p>
    <p>The design decision people gloss over is variance, not mean. The forecast correction is controlled less by the observed value itself than by the relative uncertainty of the model and measurement.</p>`,
  mathematics: String.raw`
    <p>A linear Gaussian state-space model is</p>
    <div class="formula-box">$$x_t=A x_{t-1}+w_t, \\quad w_t\\sim\\mathcal{N}(0,Q), \\qquad y_t=H x_t+v_t, \\quad v_t\\sim\\mathcal{N}(0,R)$$</div>
    <p>Here $x_t\\in\\mathbb{R}^{d}$ is the hidden state, $y_t\\in\\mathbb{R}^{p}$ is the observation, $A$ is the transition matrix, $H$ maps state to observation, and $Q,R$ are process and observation noise covariances.</p>

    <p><b>One scalar Kalman update.</b> Begin with mean $m=10$, variance $P=4$, process noise $Q=1$, observation noise $R=3$, and observation $y=13$.</p>
    <ol class="work">
      <li>predict variance: $P^-=P+Q=4+1=5.000$</li>
      <li>Kalman gain: $K=P^-/(P^-+R)=5/(5+3)=0.625$</li>
      <li>innovation: $y-m^-=13-10=3$</li>
      <li>updated mean: $m=10+0.625\\cdot3=11.875$</li>
      <li>updated variance: $(1-K)P^-=(1-0.625)\\cdot5=1.875$</li>
    </ol>
    <p>The observation pulls the estimate upward, but only 62.5% of the gap, because measurement noise still matters.</p>

    <p><b>Why the filter smooths.</b> In the notebook's drifting local-level series, the filtered state has lower mean squared error than the raw observations. That happens because the $Q$ term permits gradual movement, while the $R$ term prevents every noisy observation from becoming the new truth.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Setting $R$ too small.</b> The gain $K=P^-/(P^-+R)$ approaches 1, so the filter copies measurement noise.</li>
      <li><b>Setting $Q$ too small.</b> The predicted variance stays tiny, the gain shrinks, and the model cannot follow real regime drift.</li>
      <li><b>Forgetting the observation matrix.</b> If $H$ maps the hidden state to the wrong measured quantity, a mathematically correct update corrects the wrong thing.</li>
    </ul>`
};

/* ---------------- 14.6 Prophet ---------------- */
window.ALLML_CONTENT["14.6"] = {
  tagline: "Prophet forecasts with an additive story: flexible trend, smooth seasonality, and sparse holiday effects.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/14.6-prophet.ipynb",
  context: String.raw`
    <p>Prophet packages several ideas from this part into a practical forecasting model. It decomposes the series like 14.1, uses smooth periodic components like 14.2, and handles changepoints that 14.9 will study more directly.</p>
    <ul>
      <li><b>Additive decomposition</b> supplies the structure: trend plus seasonality plus events.</li>
      <li><b>Fourier features</b> provide smooth weekly or yearly cycles without one parameter per date.</li>
      <li><b>Regularization</b> controls how much the trend may bend at candidate changepoints.</li>
    </ul>
    <p>Where it leads: Prophet is a strong baseline against deep models (14.7), and its changepoint assumptions prepare you to understand explicit changepoint detection in 14.9.</p>`,
  intuition: String.raw`
    <p>The concrete problem is business forecasting with calendar structure: growth changes, weekdays repeat, holidays spike, and analysts need components they can explain. A black-box lag model may forecast, but it may not say why.</p>
    <p>Prophet's mental model is additive storytelling. The trend handles the long arc, Fourier seasonality handles smooth cycles, and holiday regressors handle named event days. The forecast is the sum of these interpretable pieces.</p>
    <p>The design decision people miss is using many possible changepoints but shrinking most of them. This is safer than asking the user to know the exact changepoint dates, and safer than letting the trend wiggle freely at every date.</p>`,
  mathematics: String.raw`
    <p>Prophet's additive form is</p>
    <div class="formula-box">$$y(t)=g(t)+s(t)+h(t)+\\varepsilon_t$$</div>
    <p>Here $g(t)$ is trend, $s(t)$ is seasonality from Fourier terms, $h(t)$ is a holiday or event effect, and $\\varepsilon_t$ is residual noise.</p>

    <p><b>Piecewise linear trend.</b> With base slope $k=0.5$, intercept $m=10$, one changepoint at $s=6$, slope change $\\delta=-0.3$, and $t=8$:</p>
    <ol class="work">
      <li>post-changepoint extra time $=(8-6)_+=2$</li>
      <li>trend $g(8)=10+0.5\\cdot8+(-0.3)\\cdot2$</li>
      <li>$g(8)=10+4.000-0.600=13.400$</li>
    </ol>
    <p>The slope after the changepoint is $0.5-0.3=0.2$, so growth continues but more slowly.</p>

    <p><b>Season, event, and sum.</b> A weekly Fourier component $2\\sin(2\\pi t/7)+\\cos(2\\pi t/7)$ at $t=3$ gives:</p>
    <ol class="work">
      <li>$2\\sin(6\\pi/7)+\\cos(6\\pi/7)=-0.033201$</li>
      <li>with trend $10+0.3\\cdot6=11.800$, season $\\sin(12\\pi/7)=-0.781831$, and holiday $2.000$</li>
      <li>$\\hat y(6)=11.800-0.781831+2.000=13.018169$</li>
    </ol>
    <p>The forecast is interpretable because each number has a role: baseline growth, weekly position, and event lift.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting changepoints explain seasonality.</b> If seasonal terms are missing, trend flexibility absorbs repeating cycles and extrapolates them as permanent bends.</li>
      <li><b>Adding holidays without enough repeats.</b> The $h(t)$ coefficient is weakly identified when an event has too few examples, so it can memorize noise.</li>
      <li><b>Trusting default flexibility blindly.</b> The changepoint regularization controls $\\delta$ values; too loose overfits history, too tight misses real slope changes.</li>
    </ul>`
};

/* ---------------- 14.7 Deep learning for time series ---------------- */
window.ALLML_CONTENT["14.7"] = {
  tagline: "Deep time-series models learn forecast functions from windows, covariates, and many related histories.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/14.7-deep-learning-for-time-series.ipynb",
  context: String.raw`
    <p>Deep forecasting keeps the chronological discipline of 14.10 but replaces hand-written lag equations with learned functions. It is most useful when many related series let the model share statistical strength.</p>
    <ul>
      <li><b>Supervised learning</b> turns a history window into features and the next horizon into labels.</li>
      <li><b>Sequence models</b> such as DeepAR learn shared dynamics across item, store, or user series.</li>
      <li><b>Basis and attention ideas</b> appear in N-BEATS and TFT: one decomposes forecasts into learned blocks; the other gates variables and time steps.</li>
    </ul>
    <p>Where it leads: anomaly detection (14.8) can use reconstruction or likelihood from neural models, while backtesting (14.10) is the guardrail that prevents high-capacity sequence models from winning by leakage.</p>`,
  intuition: String.raw`
    <p>The concrete problem is scale and heterogeneity. One store's sales history may be too short for a rich model, but thousands of stores together reveal common patterns. Deep time-series models learn those shared patterns while still conditioning on each series' recent window.</p>
    <p>The mental model is supervised learning with time-respecting examples. Each training row is a window of past values and covariates; the label is the future horizon. DeepAR outputs a distribution, N-BEATS stacks backcast/forecast blocks, and TFT uses attention-like gating to decide which covariates matter.</p>
    <p>The design decision people gloss over is global versus local modeling. A local model fits one series and is easier to audit; a global neural model borrows strength but can transfer the wrong pattern if series are not genuinely related.</p>`,
  mathematics: String.raw`
    <p>A neural forecaster learns a function $f_\\theta$ from a window $x_{t-L+1:t}\\in\\mathbb{R}^{L\\times d}$ and covariates $c_t$ to a horizon forecast $\\hat y_{t+1:t+H}\\in\\mathbb{R}^{H}$:</p>
    <div class="formula-box">$$\\hat y_{t+1:t+H}=f_\\theta(x_{t-L+1:t},c_{t+1:t+H})$$</div>
    <p>The shapes matter: $L$ is lookback length, $d$ is the number of channels, and $H$ is forecast horizon.</p>

    <p><b>A tiny learned window.</b> With window $x=\\{10,12,14\\}$ and learned weights $w=\\{0.2,0.3,0.5\\}$:</p>
    <ol class="work">
      <li>$0.2\\cdot10=2.000$</li>
      <li>$0.3\\cdot12=3.600$</li>
      <li>$0.5\\cdot14=7.000$</li>
      <li>prediction $=2.000+3.600+7.000=12.600$</li>
    </ol>
    <p>The largest weight falls on the most recent value, but the rule is learned rather than fixed.</p>

    <p><b>Shared, block, and probabilistic outputs.</b> In the notebook, three related series all have average increment $1.0$, so one shared slope forecasts $\\{16,26,36\\}$. An N-BEATS-style block uses a backcast $\\{10,11,12\\}$ for past $\\{10,12,11\\}$, with backcast MSE $((0)^2+(1)^2+(-1)^2)/3=0.666667$, and separately emits forecast $\\{13,14\\}$. A probabilistic head widens the 80% band by $2\\cdot1.2816\\sigma$, so uncertainty grows when the learned spread grows.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Creating windows that cross validation boundaries.</b> If $x_{t-L+1:t}$ contains future validation information, the function $f_\\theta$ is trained on tomorrow while pretending to forecast it.</li>
      <li><b>Pooling unrelated series.</b> A global model shares parameters; unrelated dynamics cause negative transfer rather than helpful regularization.</li>
      <li><b>Reporting only point error for probabilistic models.</b> DeepAR-style outputs should be judged by likelihood, quantile loss, or coverage, not only MAE.</li>
    </ul>`
};

/* ---------------- 14.8 Time-series anomaly detection ---------------- */
window.ALLML_CONTENT["14.8"] = {
  tagline: "A time-series anomaly is a value or pattern that is unlikely after accounting for local trend, seasonality, and expected noise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/14.8-time-series-anomaly-detection.ipynb",
  context: String.raw`
    <p>Anomaly detection uses the modeling work of earlier lessons as a baseline. Decomposition (14.1) tells us what is expected, ARIMA and smoothing (14.3–14.4) produce one-step residuals, and state-space models (14.5) produce innovations with uncertainty.</p>
    <ul>
      <li><b>Standardization</b> turns residual size into a comparable score.</li>
      <li><b>Robust statistics</b> protect the baseline from being pulled by the very outlier we hope to detect.</li>
      <li><b>Sequence reconstruction</b> detects unusual shapes even when no single point is extreme.</li>
    </ul>
    <p>Where it leads: changepoint detection (14.9) separates isolated surprises from persistent regime shifts, and backtesting (14.10) reminds us to choose thresholds on past data only.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that "large" is not the same as anomalous. A value of 30 may be normal on Black Friday and impossible on an ordinary Tuesday. The score must be relative to what the series expected at that time.</p>
    <p>The mental model is residual surprise. Build an expected value from local history, seasonality, or a forecasting model; subtract it from the observation; then scale by typical residual size. The result is a score that says how unusual the observation is under the current rule.</p>
    <p>The design decision people gloss over is robust baselining. If the baseline mean and standard deviation are estimated from contaminated data, the anomaly hides itself by moving the ruler.</p>`,
  mathematics: String.raw`
    <p>A common score is the residual z-score</p>
    <div class="formula-box">$$z_t=\\frac{y_t-\\hat y_t}{\\hat\\sigma_t}$$</div>
    <p>where $\\hat y_t$ is the expected value from a local or seasonal model and $\\hat\\sigma_t$ is the estimated residual scale. A robust alternative uses median and MAD: $z^{rob}_t=(y_t-\\operatorname{median})/(1.4826\\operatorname{MAD})$.</p>

    <p><b>One point against a stable baseline.</b> With baseline $\\{10,11,9,10\\}$ and candidate $30$:</p>
    <ol class="work">
      <li>mean $=(10+11+9+10)/4=10.000$</li>
      <li>standard deviation $=0.707107$</li>
      <li>z-score $=(30-10.000)/0.707107=28.284271$</li>
      <li>median $=10.000$, MAD $=0.500$, robust score $=(30-10)/(1.4826\\cdot0.5)=26.979630$</li>
    </ol>
    <p>Both scores are huge because the point is far from what the local baseline could plausibly produce.</p>

    <p><b>Seasonal residuals are the safer target.</b> In the notebook's seasonal example, the raw series follows $10+2\\sin(2\\pi t/12)$ and one point receives a $+5$ shock. The anomaly residual is exactly $5.000$, not the raw value, because being high is only surprising after subtracting the seasonal expectation.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Scoring raw values instead of residuals.</b> The formula requires $y_t-\\hat y_t$; otherwise normal seasonal peaks look anomalous.</li>
      <li><b>Letting anomalies train the threshold.</b> Contaminated $\\hat\\sigma_t$ grows, which shrinks $z_t$ and hides the event.</li>
      <li><b>Confusing spikes with changepoints.</b> A single large residual is an anomaly; a sustained residual sign is evidence for a new regime in 14.9.</li>
    </ul>`
};

/* ---------------- 14.9 Changepoint detection ---------------- */
window.ALLML_CONTENT["14.9"] = {
  tagline: "Changepoint detection asks when one stable rule stopped and another rule began.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/14.9-changepoint-detection.ipynb",
  context: String.raw`
    <p>Changepoints are the persistent cousin of anomalies. Anomaly detection (14.8) scores isolated residuals; changepoint detection asks whether a whole segment is better explained by a different mean, slope, variance, or seasonality.</p>
    <ul>
      <li><b>Loss minimization</b> returns as segmentation: compare one model for all points with separate models before and after a candidate split.</li>
      <li><b>Regularization</b> supplies penalties so every wiggle does not become its own segment.</li>
      <li><b>Online filtering</b> supplies detection delay: we usually need several post-change observations before raising an alarm.</li>
    </ul>
    <p>Where it leads: Prophet (14.6) uses regularized changepoints for trend flexibility, and forecast evaluation (14.10) must backtest through regime changes instead of averaging them away.</p>`,
  intuition: String.raw`
    <p>The concrete problem is deciding whether a surprising run is noise or a new normal. If a metric jumps for one minute, alerting may be enough. If it shifts permanently, the forecast model itself must change.</p>
    <p>The mental model is segment competition. A candidate changepoint earns credit if two simpler explanations, one before and one after, reduce loss more than the penalty charged for adding a boundary.</p>
    <p>The design decision people gloss over is the penalty. Without it, the best fit is often one segment per fluctuation. With too much penalty, real changes are missed. The right penalty encodes how costly false splits are relative to delayed detection.</p>`,
  mathematics: String.raw`
    <p>For a candidate split $\\tau$, a mean-shift detector compares</p>
    <div class="formula-box">$$\\text{gain}(\\tau)=\\operatorname{SSE}_{one}-\\big(\\operatorname{SSE}_{left}(\\tau)+\\operatorname{SSE}_{right}(\\tau)\\big)-\\lambda$$</div>
    <p>Here $\\operatorname{SSE}$ is sum of squared residuals around segment means and $\\lambda$ is the changepoint penalty. Accept the split when the gain is positive.</p>

    <p><b>One split by hand.</b> For $y=\\{10,11,10,18,19,20\\}$ split after the third point:</p>
    <ol class="work">
      <li>one mean $=14.667$, one-segment average squared error $=19.222$</li>
      <li>left mean $=10.333$, right mean $=19.000$</li>
      <li>two-segment average squared error $=0.444$</li>
      <li>gain before penalty $=19.222-0.444=18.777778$</li>
    </ol>
    <p>The two-regime explanation is overwhelmingly better, so a reasonable penalty would keep this split.</p>

    <p><b>Online evidence accumulates.</b> CUSUM uses $S_t=\\max(0,S_{t-1}+x_t-\\mu_0-k)$ with baseline $\\mu_0=10.5$ and slack $k=0.5$.</p>
    <ol class="work">
      <li>for $\\{10,11,10\\}$, the path stays $\\{0,0,0\\}$</li>
      <li>after $18$: $S=0+18-10.5-0.5=7.000$</li>
      <li>after $19$: $S=7+19-10.5-0.5=15.000$</li>
      <li>after $20$: $S=15+20-10.5-0.5=24.000$</li>
    </ol>
    <p>The alarm is delayed because the method waits for persistent evidence, not one surprising point.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Detecting every anomaly as a changepoint.</b> The gain formula rewards sustained loss reduction over a segment; one spike should usually be handled by 14.8.</li>
      <li><b>Choosing penalty without validation.</b> The term $\\lambda$ directly controls split count, so it must be tuned against false alarms and missed changes.</li>
      <li><b>Ignoring trend changes.</b> A mean-shift detector can miss a slope change because both segments may have similar means but different dynamics.</li>
    </ul>`
};

/* ---------------- 14.10 Forecast evaluation & backtesting ---------------- */
window.ALLML_CONTENT["14.10"] = {
  tagline: "A forecast is only honest when evaluated in the order decisions would have been made, with a metric that matches the real cost of error.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/14.10-forecast-evaluation-backtesting.ipynb",
  context: String.raw`
    <p>This lesson is the audit layer for the whole part. Decomposition, ARIMA, smoothing, Prophet, and deep models are all proposals; backtesting is how we decide which proposal would have helped in real time.</p>
    <ul>
      <li><b>Loss functions</b> return as forecast metrics: absolute, squared, percentage, scaled, and quantile losses each encode a different business cost.</li>
      <li><b>Train-validation splits</b> must respect time; random shuffling destroys the forecasting question.</li>
      <li><b>Uncertainty</b> is evaluated by interval coverage or probabilistic scores, not just point accuracy.</li>
    </ul>
    <p>Where it leads: every future modeling choice should be defended by chronological evidence. If a method wins only under leaky evaluation, it has not won.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that ordinary cross-validation breaks time. If you train on March while testing on February, the score may look excellent, but the procedure could never have been used when February decisions were made.</p>
    <p>Backtesting fixes this by replaying history. At each fold, train only on the past, forecast the next horizon, record the error, then roll the origin forward. The model earns credit only for information it would actually have had.</p>
    <p>The design decision people gloss over is metric choice. RMSE punishes rare large misses, MAE measures typical absolute miss, MAPE can explode near zero, MASE compares to a naive baseline, and interval coverage checks uncertainty. The right metric is the one aligned with the decision the forecast supports.</p>`,
  mathematics: String.raw`
    <p>For actuals $y_t$ and forecasts $\\hat y_t$, common point metrics are</p>
    <div class="formula-box">$$\\operatorname{MAE}=\\frac1n\\sum_t |y_t-\\hat y_t|, \\quad \\operatorname{RMSE}=\\sqrt{\\frac1n\\sum_t (y_t-\\hat y_t)^2}, \\quad \\operatorname{MAPE}=\\frac{100}{n}\\sum_t\\left|\\frac{y_t-\\hat y_t}{y_t}\\right|$$</div>
    <p>MASE divides MAE by the in-sample naive forecast error, making errors comparable across scales.</p>

    <p><b>One tiny forecast.</b> With $y=\\{10,12,15\\}$ and $\\hat y=\\{11,13,14\\}$, errors are $\\{-1,-1,1\\}$.</p>
    <ol class="work">
      <li>MAE $=(1+1+1)/3=1.000$</li>
      <li>RMSE $=\\sqrt{(1+1+1)/3}=1.000$</li>
      <li>MAPE $=100\\cdot(0.1+0.083333+0.066667)/3=8.333333\\%$</li>
    </ol>
    <p>Here MAE and RMSE agree because all absolute errors are equal; in real series, RMSE grows faster when a few misses are large.</p>

    <p><b>Scaled and chronological evaluation.</b> If the training history is $\\{8,10,12,15\\}$, the naive one-step absolute differences are $\\{2,2,3\\}$.</p>
    <ol class="work">
      <li>naive scale $=(2+2+3)/3=2.333333$</li>
      <li>MASE $=1.000/2.333333=0.428571$</li>
      <li>an interval backtest with five points covered by five intervals has coverage $5/5=1.000$</li>
    </ol>
    <p>A MASE below one means the model beats the naive scale on this example, while coverage checks whether uncertainty statements are calibrated rather than merely narrow.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Randomly shuffling time series.</b> This leaks future regimes into training and invalidates the chronological meaning of the score.</li>
      <li><b>Choosing metrics after seeing results.</b> The metric defines the objective; selecting it post hoc is another form of overfitting.</li>
      <li><b>Ignoring horizon.</b> A one-step MAE and a 30-step MAE answer different questions because uncertainty compounds with horizon.</li>
      <li><b>Evaluating intervals only by width.</b> Narrow intervals are useless if coverage fails; coverage and sharpness must be read together.</li>
    </ul>`
};
