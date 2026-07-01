/* All ML — Part 14 applications (5 each). Loaded after content-part-14.js, before all-ml-register.js. */

/* ---- _apps-part14-A.js ---- */
(window.ALLML_CONTENT["14.1"] = window.ALLML_CONTENT["14.1"] || {}).applications = [
  { title: "Retail demand planning", background: "<p>Retail teams decompose sales into a slow baseline, calendar seasonality, and residual demand shocks before deciding inventory.</p>", numbers: "<p>Using the lesson series $\\{10,12.5,11,9.5,12,14.5\\}$, least squares gives $\\hat\\beta=(10.190,0.557)$. At $t=3$, $\\hat T_3=10.190+0.557\\cdot3=11.862$, so the residual is $9.500-11.862=-2.362$.</p>" },
  { title: "Energy load forecasting", background: "<p>Grid operators remove daily cycles before testing whether residual load has stable variance and lag behavior.</p>", numbers: "<p>For an illustrative 24-hour cycle, the seasonal bank has 24 positions. A 240-hour sample contributes about $240/24=10$ observations to each hourly seasonal offset.</p>" },
  { title: "Web traffic analytics", background: "<p>Traffic metrics often grow with product adoption, so analysts difference the level before fitting memory models.</p>", numbers: "<p>The lesson notebook states that a synthetic rolling-mean drift from trend $0.12t$ drops from $\\gt 6.0$ in levels to $\\lt 0.2$ after first differencing $\\Delta y_t=y_t-y_{t-1}$.</p>" },
  { title: "Call-center staffing", background: "<p>Arrival volume has day-of-week patterns, and staffing forecasts improve when weekday offsets are separated from long-run trend.</p>", numbers: "<p>An illustrative weekly seasonal bank has 7 entries. With 70 daily observations, each weekday offset averages about $70/7=10$ historical residuals.</p>" },
  { title: "Sensor monitoring", background: "<p>Industrial sensors use residual stationarity checks so alarms are based on stable noise rather than normal drift.</p>", numbers: "<p>Weak stationarity checks $\\mathbb{E}[e_t]=\\mu$, $\\operatorname{Var}(e_t)=\\sigma^2$, and $\\operatorname{Cov}(e_t,e_{t-k})=\\gamma_k$, so lag $k=3$ should mean the same relationship regardless of the absolute time $t$.</p>" }
];

(window.ALLML_CONTENT["14.2"] = window.ALLML_CONTENT["14.2"] || {}).applications = [
  { title: "Demand seasonality detection", background: "<p>Demand planners use ACF peaks and spectral peaks to confirm monthly or weekly replenishment cycles.</p>", numbers: "<p>For the lesson clean period-12 sine, $r_{12}\\gt0.8$, $r_6\\lt-0.4$, and the frequency is $1/12=0.0833$ cycles per step.</p>" },
  { title: "Vibration monitoring", background: "<p>Machine monitoring turns repeating vibration into a frequency-domain spike that can indicate line noise or a mechanical fault.</p>", numbers: "<p>An illustrative 60 Hz component has frequency 60 cycles per second, so its period is $1/60=0.0167$ seconds.</p>" },
  { title: "Marketing calendar analysis", background: "<p>Weekly promotions should leave a lag-7 signature if campaign effects repeat on the same weekday.</p>", numbers: "<p>A 7-day period corresponds to frequency $1/7=0.1429$ cycles per day, the reciprocal relation highlighted in the lesson.</p>" },
  { title: "Residual diagnostics", background: "<p>Forecast residuals should not remember themselves after the model has captured predictable structure.</p>", numbers: "<p>For $y=\\{1,0,-1,0\\}$, total centered energy is $2$, the lag-1 numerator is $0$, so $r_1=0.000$, while lag 2 gives $-1/2=-0.500$.</p>" },
  { title: "Climate index monitoring", background: "<p>Climate and environmental indices often contain low-frequency trend, so detrending comes before interpreting spectrum as cyclic memory.</p>", numbers: "<p>If a trend remains, large low-frequency energy can masquerade as memory; detrending changes the ACF numerator $\\sum x_t x_{t-k}$ by removing the shared level component.</p>" }
];

(window.ALLML_CONTENT["14.3"] = window.ALLML_CONTENT["14.3"] || {}).applications = [
  { title: "Inventory replenishment", background: "<p>Inventory forecasts often use autoregressive memory because recent demand is informative but should decay over time.</p>", numbers: "<p>With $\\phi=0.6$ and $y_0=2.0$, the lesson path is $2.0\\to1.200\\to0.720\\to0.432\\to0.2592$, a geometric decay because $|\\phi|\\lt1$.</p>" },
  { title: "Finance returns", background: "<p>Financial models usually difference price levels before modeling returns because levels are often nonstationary.</p>", numbers: "<p>The lesson levels $\\{3,4,6,9\\}$ become increments $\\{4-3,6-4,9-6\\}=\\{1,2,3\\}$ before ARMA-style modeling.</p>" },
  { title: "Utility load", background: "<p>Utility demand has calendar recurrence, so SARIMA terms reuse ARIMA memory at seasonal lags such as months or weekdays.</p>", numbers: "<p>An illustrative monthly SARIMA lag uses $s=12$. A seasonal difference compares $y_t-y_{t-12}$, so 60 months provide $60-12=48$ comparable seasonal differences.</p>" },
  { title: "Quality-control residuals", background: "<p>Manufacturing residuals can contain shock memory when a disturbance affects more than one measurement.</p>", numbers: "<p>With $\\theta=0.4$ and shocks $\\{1.0,-0.5,0.2\\}$, the lesson MA(1) values are $y_1=-0.5+0.4\\cdot1.0=-0.100$ and $y_2=0.2+0.4\\cdot(-0.5)=0.000$.</p>" },
  { title: "Subscription forecasting", background: "<p>Subscriptions often repeat seasonally while retaining a small residual from the same season last cycle.</p>", numbers: "<p>The lesson seasonal residual calculation gives forecast $10.5+0.5\\cdot0.2=10.600$ after a four-step seasonal difference of $0.4$.</p>" }
];

(window.ALLML_CONTENT["14.4"] = window.ALLML_CONTENT["14.4"] || {}).applications = [
  { title: "Short-horizon sales forecasting", background: "<p>Simple exponential smoothing is a fast baseline when the current level matters more than old observations.</p>", numbers: "<p>For $\\alpha=0.5$ and $\\{10,12,13,12\\}$, the lesson levels are $10$, $0.5\\cdot12+0.5\\cdot10=11.000$, $12.000$, and $12.000$.</p>" },
  { title: "Queue staffing", background: "<p>Operations teams tune recency weight based on whether today's arrivals should dominate tomorrow's staffing forecast.</p>", numbers: "<p>Illustratively, $\\alpha=0.8$ gives today four times the direct weight of $\\alpha=0.2$, because $0.8/0.2=4$.</p>" },
  { title: "Warehouse replenishment", background: "<p>Holt smoothing tracks both level and slope so replenishment can respond to a persistent rise instead of only a jump.</p>", numbers: "<p>Starting from level $10$, trend $1$, and observation $12$, the lesson gives level $11.500$, trend $1.125$, and next forecast $11.500+1.125=12.625$.</p>" },
  { title: "Retail calendar effects", background: "<p>Additive Holt-Winters keeps a rotating seasonal offset for each position in the calendar.</p>", numbers: "<p>With $\\gamma=0.3$, observation $15$, level plus trend $12$, and old season $2$, the update is $0.3(15-12)+0.7\\cdot2=2.300$.</p>" },
  { title: "Help-desk ticket volume", background: "<p>Short help-desk histories are sensitive to initialization because the recursion has little time to dilute the first states.</p>", numbers: "<p>If only the first 4 observations initialize level, trend, and season, then those 4 points account for $4/12=0.333$ of an illustrative monthly seasonal cycle.</p>" }
];

(window.ALLML_CONTENT["14.5"] = window.ALLML_CONTENT["14.5"] || {}).applications = [
  { title: "Position tracking", background: "<p>Tracking systems predict hidden position, then use noisy measurements to correct the belief by a Kalman gain.</p>", numbers: "<p>With predicted variance $P^-=5$ and observation noise $R=3$, the lesson gain is $K=5/(5+3)=0.625$.</p>" },
  { title: "Demand nowcasting", background: "<p>Nowcasting treats true demand as latent and lets noisy observations pull the estimate without fully replacing it.</p>", numbers: "<p>Starting at prior mean $10$ with observation $13$, the update is $10+0.625(13-10)=11.875$, so the estimate moves $1.875$ units rather than $3$.</p>" },
  { title: "IoT sensor smoothing", background: "<p>Sensor filters reduce uncertainty after incorporating an observation, provided the observation matrix maps the state correctly.</p>", numbers: "<p>The scalar lesson update lowers variance from $P^-=5.000$ to $(1-0.625)\\cdot5=1.875$ after the measurement.</p>" },
  { title: "Financial latent trend", background: "<p>Latent trend filters need process noise high enough to follow real drift rather than locking onto an old regime.</p>", numbers: "<p>The lesson uses $Q=1$, increasing variance from $P=4$ to $P^-=P+Q=5.000$ before the observation update.</p>" },
  { title: "Medical monitoring", background: "<p>Vital-sign monitors avoid copying every noisy reading by retaining a nonzero observation-noise variance.</p>", numbers: "<p>With $R=3$, the gain is $0.625$ rather than $1.000$, so the remaining $1-0.625=0.375$ of the prior belief is still retained.</p>" }
];

/* ---- _apps-part14-B.js ---- */
(window.ALLML_CONTENT["14.6"] = window.ALLML_CONTENT["14.6"] || {}).applications = [
  {
    title: "Business KPI forecasting",
    background: "<p>Growth teams often need forecasts that explain whether a KPI moved because of baseline trend, weekday rhythm, or a launch event.</p>",
    numbers: "<p>The additive form $y(t)=g(t)+s(t)+h(t)+\\varepsilon_t$ lets a forecast be audited as trend plus seasonality plus event lift rather than one opaque number.</p>"
  },
  {
    title: "Product growth planning",
    background: "<p>A mature product may keep growing after a launch but at a slower slope, so planners use changepoints instead of one global line.</p>",
    numbers: "<p>With $k=0.5$, $m=10$, changepoint $s=6$, $\\delta=-0.3$, and $t=8$, $g(8)=10+0.5\\cdot8-0.3\\cdot2=13.400$.</p>"
  },
  {
    title: "Weekly traffic forecasting",
    background: "<p>Sites and apps often repeat by day of week, and Fourier terms encode the smooth cycle without a separate parameter for every date.</p>",
    numbers: "<p>The lesson term $2\\sin(2\\pi t/7)+\\cos(2\\pi t/7)$ at $t=3$ equals $-0.033201$, a re-derivable weekly seasonal contribution.</p>"
  },
  {
    title: "Holiday staffing",
    background: "<p>Operations teams add sparse event regressors when holidays or launches create demand beyond the ordinary weekly pattern.</p>",
    numbers: "<p>At $t=6$, trend $11.800$ plus season $-0.781831$ plus holiday lift $2.000$ gives $\\hat y(6)=13.018169$.</p>"
  },
  {
    title: "Revenue planning with regularized bends",
    background: "<p>Finance teams want flexibility for real business shifts without letting every noisy week become a permanent change in growth.</p>",
    numbers: "<p>The post-changepoint slope is $0.5-0.3=0.2$, so growth continues but is regularized to a slower rate after the bend.</p>"
  }
];

(window.ALLML_CONTENT["14.7"] = window.ALLML_CONTENT["14.7"] || {}).applications = [
  {
    title: "Multi-store demand forecasting",
    background: "<p>Retailers pool related store histories so a global model can share a trend learned from many short series.</p>",
    numbers: "<p>Three related series with average increment $1.0$ forecast the next values as $\\{16,26,36\\}$ from last values $\\{15,25,35\\}$.</p>"
  },
  {
    title: "Product-level window forecasting",
    background: "<p>DeepAR-style and MLP-style models turn a recent lookback window into a supervised input for the next horizon.</p>",
    numbers: "<p>For window $\\{10,12,14\\}$ and weights $\\{0.2,0.3,0.5\\}$, the forecast is $2.000+3.600+7.000=12.600$.</p>"
  },
  {
    title: "Traffic prediction with lookback and horizon",
    background: "<p>Traffic models must declare exactly how much past context they read and how far ahead they predict.</p>",
    numbers: "<p>The tiny lesson uses lookback $L=3$ and horizon $H=1$, so each row maps three ordered observations to the next point.</p>"
  },
  {
    title: "N-BEATS-style planning",
    background: "<p>Basis-block models explain the past with a backcast while emitting a separate future forecast.</p>",
    numbers: "<p>Past $\\{10,12,11\\}$ and backcast $\\{10,11,12\\}$ give MSE $((0)^2+(1)^2+(-1)^2)/3=0.666667$.</p>"
  },
  {
    title: "Probabilistic operations",
    background: "<p>Capacity planners need uncertainty bands, not just point forecasts, because staffing risk grows with forecast spread.</p>",
    numbers: "<p>An 80% normal band has total width $2\\cdot1.2816\\sigma$, so doubling $\\sigma$ doubles the interval width.</p>"
  }
];

(window.ALLML_CONTENT["14.8"] = window.ALLML_CONTENT["14.8"] || {}).applications = [
  {
    title: "Fraud and traffic spike alerts",
    background: "<p>Incident systems flag points that are implausible relative to a local baseline rather than merely large in absolute terms.</p>",
    numbers: "<p>For baseline $\\{10,11,9,10\\}$ and candidate $30$, mean $10.000$ and standard deviation $0.707107$ give $z=28.284271$.</p>"
  },
  {
    title: "Industrial sensor alarms",
    background: "<p>Robust thresholds are useful when the baseline can contain glitches that would inflate an ordinary standard deviation.</p>",
    numbers: "<p>The same baseline has median $10.000$ and MAD $0.500$, so the robust score is $(30-10)/(1.4826\\cdot0.5)=26.979630$.</p>"
  },
  {
    title: "Retail holiday monitoring",
    background: "<p>A high sales day is only anomalous if it is high after subtracting expected calendar or seasonal demand.</p>",
    numbers: "<p>The score uses residual $y_t-\\hat y_t$; a planned peak with residual $0$ should not alert even when the raw value is high.</p>"
  },
  {
    title: "Seasonal service monitoring",
    background: "<p>Service metrics often have normal daily or monthly cycles, so alerts should be computed after seasonal adjustment.</p>",
    numbers: "<p>For $10+2\\sin(2\\pi t/12)$ with a $+5$ shock, the anomaly residual is exactly $5.000$ after subtracting the seasonal expectation.</p>"
  },
  {
    title: "Incident triage",
    background: "<p>On-call engineers distinguish isolated spikes from sustained regime changes before choosing anomaly handling or changepoint analysis.</p>",
    numbers: "<p>One large residual is a spike anomaly; several same-sign residuals in a row are evidence for the 14.9 changepoint workflow.</p>"
  }
];

(window.ALLML_CONTENT["14.9"] = window.ALLML_CONTENT["14.9"] || {}).applications = [
  {
    title: "Site reliability metric shifts",
    background: "<p>Reliability teams need to know when latency or error rate moved to a new stable level instead of producing one bad point.</p>",
    numbers: "<p>For $\\{10,11,10,18,19,20\\}$, splitting after the third point improves average squared error by $18.777778$ before penalty.</p>"
  },
  {
    title: "Pricing analytics",
    background: "<p>Pricing teams compare whether pre-change and post-change periods are better summarized by different means.</p>",
    numbers: "<p>The one mean is $14.667$, while the two segment means are $10.333$ and $19.000$, matching the two-regime story.</p>"
  },
  {
    title: "Manufacturing yield monitoring",
    background: "<p>Factories penalize extra splits so random variation does not create a new production regime every few observations.</p>",
    numbers: "<p>The accepted split must satisfy $\\operatorname{SSE}_{one}-(\\operatorname{SSE}_{left}+\\operatorname{SSE}_{right})-\\lambda \\gt 0$.</p>"
  },
  {
    title: "Online monitoring with CUSUM",
    background: "<p>Streaming systems accumulate evidence and usually alarm after a delay rather than on the first unusual value.</p>",
    numbers: "<p>With $\\mu_0=10.5$ and $k=0.5$, CUSUM stays $\\{0,0,0\\}$ then rises to $7.000$, $15.000$, and $24.000$.</p>"
  },
  {
    title: "Forecast maintenance",
    background: "<p>Forecast owners retrain or re-segment models when behavior has persistently changed, not for every isolated spike.</p>",
    numbers: "<p>A single spike should usually be routed to 14.8 anomaly detection, while a sustained loss reduction justifies a 14.9 segment split.</p>"
  }
];

(window.ALLML_CONTENT["14.10"] = window.ALLML_CONTENT["14.10"] || {}).applications = [
  {
    title: "Demand planning model selection",
    background: "<p>Planners compare forecast candidates with metrics that match inventory or staffing cost.</p>",
    numbers: "<p>For $y=\\{10,12,15\\}$ and $\\hat y=\\{11,13,14\\}$, absolute errors are all $1$, so MAE and RMSE are both $1.000$.</p>"
  },
  {
    title: "Executive KPI reporting",
    background: "<p>Percentage error is often used when leaders compare misses across metrics with different units or scales.</p>",
    numbers: "<p>The same example has MAPE $100\\cdot(0.1+0.083333+0.066667)/3=8.333333\\%$.</p>"
  },
  {
    title: "Cross-series comparison",
    background: "<p>MASE scales errors by an in-sample naive forecast so high-volume and low-volume series can be compared.</p>",
    numbers: "<p>Training history $\\{8,10,12,15\\}$ has naive scale $(2+2+3)/3=2.333333$, so MASE is $1.000/2.333333=0.428571$.</p>"
  },
  {
    title: "Probabilistic forecast auditing",
    background: "<p>Prediction intervals must be evaluated by whether they actually contain future observations, not only by how narrow they look.</p>",
    numbers: "<p>An interval backtest with five covered points out of five has coverage $5/5=1.000$.</p>"
  },
  {
    title: "Operations scheduling by horizon",
    background: "<p>Schedulers make different decisions for tomorrow, next week, and next month, so the evaluation horizon must match the decision.</p>",
    numbers: "<p>A one-step MAE and a 30-step MAE are different metrics because forecast uncertainty compounds across the horizon.</p>"
  }
];

