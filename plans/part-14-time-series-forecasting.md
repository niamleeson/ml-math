# Part 14 — Time Series & Forecasting

> Plan only — per-topic revamp plan. See ../00-MASTER-PLAN.md for the shared design & family registry (F1–F17).
> **Code style:** every notebook code cell is written one statement per line (newline-split, blank lines between logical groups) for readability — never dense, semicolon-packed one-liners. See ../00-MASTER-PLAN.md §B.4.
> Dominant family: F13 (Time-Series/State-Space).

### 14.1 — Decomposition & stationarity   [notebook: 14.1-decomposition-stationarity.ipynb]   (family: F13)

**Lesson — Real World Applications (5):**
1. Retail demand planning — separate growth, weekly seasonality, and noise; lesson's six-point trend has slope $0.557$ per step and residual $e_3=-2.362$ (14.1).
2. Energy load forecasting — remove a 24-hour cycle before checking residual stability; use a 24-step period (illustrative).
3. Web traffic analytics — first difference a trending metric before ACF/AR modeling; lesson's synthetic rolling-mean drift drops from $>6.0$ to $<0.2$ after differencing (14.1).
4. Call-center staffing — decompose daily arrivals into trend plus 7-day seasonality; 7 positions in the weekly seasonal bank (illustrative).
5. Sensor monitoring — require residual variance to stay roughly constant after detrending; weak stationarity checks $\mu$, $\sigma^2$, and lag covariance by $k$ (14.1).

**Notebook plan:**
- Family: F13 Time-Series/State-Space
- Concept built once (D1): `decompose_and_difference(y, period)` fits $T_t=a+bt$, subtracts seasonal means, and verifies lesson numbers on $y=\{10,12.5,11,9.5,12,14.5\}$: $\hat\beta=(10.190,0.557)$ and $e_3=-2.362$.
- Datasets D1–D5: D1 constant series · D2 linear drift · D3 drift+noise · D4 seasonal monthly synthetic series · D5 outlier/regime-shift
- Metric: RMSE of one-step forecasts from decomposed trend+season baseline
- Closing viz: (a) filtered/forecast-vs-true panels per series (b) RMSE-vs-noise curve
- Pitfall on D5: Checking stationarity on raw levels, reproduced with false residual dependence, then fixed by detrending/differencing before ACF.
- Notes: Delete generic auto-template cells unrelated to decomposition; CPU-only, tiny; no lesson/notebook edits in this planning step.

### 14.2 — Autocorrelation & spectral analysis   [notebook: 14.2-autocorrelation-spectral-analysis.ipynb]   (family: F13)

**Lesson — Real World Applications (5):**
1. Demand seasonality detection — identify a 12-step cycle; lesson clean sine has $r_{12}>0.8$, $r_6<-0.4$, and frequency $1/12=0.0833$ (14.2).
2. Vibration monitoring — spectral peak flags a repeating mechanical cycle; 60 Hz line-noise example uses frequency 60 cycles/second (illustrative).
3. Marketing calendar analysis — weekly campaigns should show lag-7 ACF peaks; period is reciprocal of frequency, so $1/7=0.1429$ cycles/day (illustrative).
4. Residual diagnostics — check whether forecast residuals still remember themselves; lesson vector $\{1,0,-1,0\}$ gives $r_1=0.000$ and $r_2=-0.500$ (14.2).
5. Climate index monitoring — detrend before reading low-frequency energy; otherwise trend masquerades as memory (14.2 pitfall).

**Notebook plan:**
- Family: F13 Time-Series/State-Space
- Concept built once (D1): `acf_periodogram(y, max_lag)` computes centered $r_k$ and DFT periodogram, verifying $y=\{1,0,-1,0\}$ gives energy $2$, $r_1=0.000$, $r_2=-0.500$, and nonnegative periodogram $\{0.000,1.000,0.000\}$.
- Datasets D1–D5: D1 constant series · D2 linear drift · D3 drift+noise · D4 seasonal monthly synthetic series · D5 outlier/regime-shift
- Metric: RMSE of a lag/seasonal-naive forecast selected from ACF peaks
- Closing viz: (a) filtered/forecast-vs-true panels per series with selected lag annotated (b) RMSE-vs-noise curve
- Pitfall on D5: Reading trend as memory, reproduced by high raw-level ACF, then fixed by detrending before ACF/spectrum.
- Notes: Delete dead generic plotting/template code; CPU-only FFT/NumPy only; keep noisy-spike caveat visible.

### 14.3 — AR, MA, ARIMA & SARIMA   [notebook: 14.3-ar-ma-arima-sarima.ipynb]   (family: F13)

**Lesson — Real World Applications (5):**
1. Inventory replenishment — AR memory copies part of recent demand; lesson AR(1) with $\phi=0.6$ decays $2.0\to1.200\to0.720\to0.432\to0.2592$ (14.3).
2. Finance returns — first differences turn levels $\{3,4,6,9\}$ into increments $\{1,2,3\}$ before modeling (14.3).
3. Utility load — SARIMA uses a seasonal lag such as 12 months or 7 days; lesson cites seasonal lag $s$ (14.3).
4. Quality-control residuals — MA(1) shock memory with $\theta=0.4$ maps shocks $\{1.0,-0.5,0.2\}$ to $y_1=-0.100$, $y_2=0.000$ (14.3).
5. Subscription forecasting — four-step seasonal difference can be $0.4$ and a SARIMA-style forecast $10.5+0.5\cdot0.2=10.600$ (14.3).

**Notebook plan:**
- Family: F13 Time-Series/State-Space
- Concept built once (D1): `fit_arima_like(y, p, d, q, seasonal_lag=None)` implements tiny AR/differencing/seasonal-naive pieces and verifies lesson AR(1), MA(1), differences $\{1,2,3\}$, and SARIMA-style $10.600$ calculation.
- Datasets D1–D5: D1 constant series · D2 linear drift · D3 drift+noise · D4 seasonal monthly synthetic series · D5 outlier/regime-shift
- Metric: RMSE across rolling one-step forecasts
- Closing viz: (a) filtered/forecast-vs-true panels per series (b) RMSE-vs-noise curve
- Pitfall on D5: Fitting AR terms to a trended level, reproduced by spurious persistence, then fixed with differencing and residual ACF checks.
- Notes: Delete any generic model-comparison template not tied to AR/MA/ARIMA; CPU-only with small arrays; no statsmodels dependency required unless already present.

### 14.4 — Exponential smoothing (Holt-Winters)   [notebook: 14.4-exponential-smoothing-holt-winters.ipynb]   (family: F13)

**Lesson — Real World Applications (5):**
1. Short-horizon sales forecasting — simple smoothing with $\alpha=0.5$ on $\{10,12,13,12\}$ yields levels $10,11.000,12.000,12.000$ (14.4).
2. Queue staffing — high $\alpha$ reacts quickly to today's arrivals; compare $\alpha=0.8$ vs $0.2$ recency weight (illustrative).
3. Warehouse replenishment — Holt trend update from level $10$, trend $1$, observed $12$ gives new level $11.500$, trend $1.125$, forecast $12.625$ (14.4).
4. Retail calendar effects — additive seasonal state with $\gamma=0.3$, observation $15$, level+trend $12$, old season $2$ updates to $2.300$ (14.4).
5. Help-desk ticket volume — initialize level/trend carefully on short histories; first 4 observations can dominate when recursions have little time to wash out (illustrative).

**Notebook plan:**
- Family: F13 Time-Series/State-Space
- Concept built once (D1): `holt_winters_additive(y, alpha, beta, gamma, period)` verifies the lesson's simple smoothing levels, Holt forecast $12.625$, and seasonal update $2.300$.
- Datasets D1–D5: D1 constant series · D2 linear drift · D3 drift+noise · D4 seasonal monthly synthetic series · D5 outlier/regime-shift
- Metric: RMSE from rolling one-step forecasts
- Closing viz: (a) filtered/forecast-vs-true panels per series (b) RMSE-vs-noise curve
- Pitfall on D5: Letting $\alpha$ chase noise, reproduced with an outlier-driven level jump, then fixed by lower $\alpha$ and robust outlier handling.
- Notes: Delete dead notebook cells that do not update level/trend/season states; CPU-only, tiny; additive seasonality caveat noted.

### 14.5 — State-space models   [notebook: 14.5-state-space-models.ipynb]   (family: F13)

**Lesson — Real World Applications (5):**
1. Position tracking — hidden state evolves while noisy measurements correct it; scalar Kalman example has gain $K=5/(5+3)=0.625$ (14.5).
2. Demand nowcasting — observation $13$ pulls prior mean $10$ to $11.875$, not all the way to the measurement (14.5).
3. IoT sensor smoothing — updated variance falls from predicted $P^-=5.000$ to $1.875$ after observation (14.5).
4. Financial latent trend — set process noise $Q$ high enough to follow real drift; lesson uses $Q=1$ in scalar update (14.5).
5. Medical monitoring — observation noise $R=3$ prevents copying each noisy vital-sign reading (14.5).

**Notebook plan:**
- Family: F13 Time-Series/State-Space
- Concept built once (D1): `kalman_local_level(y, Q, R)` verifies lesson scalar update from $m=10$, $P=4$, $Q=1$, $R=3$, $y=13$: $P^-=5.000$, $K=0.625$, updated mean $11.875$, variance $1.875$.
- Datasets D1–D5: D1 constant series · D2 linear drift · D3 drift+noise · D4 seasonal monthly synthetic series · D5 outlier/regime-shift
- Metric: RMSE of filtered state/forecast versus true signal
- Closing viz: (a) filtered/forecast-vs-true panels per series (b) RMSE-vs-noise curve
- Pitfall on D5: Setting $Q$ too small, reproduced as filter lag under regime drift, then fixed by increasing/adapting $Q$.
- Notes: Delete generic forecast placeholders; CPU-only scalar/local-linear Kalman code; show $H=1$ clearly to avoid observation-matrix confusion.

### 14.6 — Prophet   [notebook: 14.6-prophet.ipynb]   (family: F13, gap)

**Lesson — Real World Applications (5):**
1. Business KPI forecasting — additive story $y(t)=g(t)+s(t)+h(t)+\varepsilon_t$ separates trend, season, and event lift (14.6).
2. Product growth planning — piecewise trend with $k=0.5$, $m=10$, changepoint $s=6$, $\delta=-0.3$, $t=8$ gives $g(8)=13.400$ (14.6).
3. Weekly traffic forecasting — Fourier seasonality at $t=3$ can evaluate to $-0.033201$ for $2\sin(2\pi t/7)+\cos(2\pi t/7)$ (14.6).
4. Holiday staffing — event regressor lift $h(t)=2.000$ changes lesson forecast to $\hat y(6)=13.018169$ (14.6).
5. Revenue planning — regularized changepoints shrink most slope changes; post-changepoint slope in lesson is $0.5-0.3=0.2$ (14.6).

**Notebook plan:**
- Family: F13 Time-Series/State-Space
- Concept built once (D1): `prophet_like_additive(t, changepoints, fourier_terms, events)` builds trend+season+holiday once and verifies lesson $g(8)=13.400$, Fourier value $-0.033201$, and $\hat y(6)=13.018169$.
- Datasets D1–D5: D1 constant series · D2 linear drift · D3 drift+noise · D4 seasonal monthly synthetic series · D5 outlier/regime-shift
- Metric: RMSE from rolling-origin forecasts
- Closing viz: (a) filtered/forecast-vs-true panels per series with components overlaid (b) RMSE-vs-noise curve
- Pitfall on D5: Letting changepoints explain seasonality, reproduced by omitting Fourier terms, then fixed by adding seasonality and changepoint shrinkage.
- Notes: Delete any dependency-heavy or generic Prophet install template; implement a tiny Prophet-like additive model CPU-only; gap note: lesson is flagged `gap:true`, so body may need strengthening before implementation cites it.

### 14.7 — Deep learning for time series (DeepAR, N-BEATS, TFT)   [notebook: 14.7-deep-learning-for-time-series.ipynb]   (family: F13)

**Lesson — Real World Applications (5):**
1. Multi-store demand — global model shares a slope; lesson has three related series with average increment $1.0$ forecasting $\{16,26,36\}$ (14.7).
2. Product-level forecasting — a window $\{10,12,14\}$ with weights $\{0.2,0.3,0.5\}$ predicts $12.600$ (14.7).
3. Traffic prediction — lookback length $L$ and horizon $H$ define supervised rows; use $L=3$, $H=1$ in the tiny weighted-window example (14.7).
4. N-BEATS-style planning — backcast $\{10,11,12\}$ for past $\{10,12,11\}$ has MSE $0.666667$ and emits forecast $\{13,14\}$ (14.7).
5. Probabilistic operations — an 80% band widens by $2\cdot1.2816\sigma$ as uncertainty grows (14.7).

**Notebook plan:**
- Family: F13 Time-Series/State-Space
- Concept built once (D1): `window_forecaster(X, weights, global_slope=False)` uses a tiny linear/MLP-style window model and verifies weighted prediction $12.600$, shared-slope forecasts $\{16,26,36\}$, and backcast MSE $0.666667$.
- Datasets D1–D5: D1 constant series · D2 linear drift · D3 drift+noise · D4 seasonal monthly synthetic series · D5 outlier/regime-shift
- Metric: RMSE across rolling windows; optionally report interval coverage for probabilistic head but keep RMSE as the shared curve
- Closing viz: (a) filtered/forecast-vs-true panels per series (b) RMSE-vs-noise curve
- Pitfall on D5: Creating windows that cross validation boundaries, reproduced with leaky windows, then fixed by chronological window generation.
- Notes: Delete heavy deep-learning boilerplate and generic template code; CPU-only NumPy/sklearn MLP or linear window model; emphasize global-vs-local caveat.

### 14.8 — Time-series anomaly detection   [notebook: 14.8-time-series-anomaly-detection.ipynb]   (family: F13)

**Lesson — Real World Applications (5):**
1. Fraud/traffic spike alerts — stable baseline $\{10,11,9,10\}$ and candidate $30$ gives z-score $28.284271$ (14.8).
2. Industrial sensor alarms — robust baseline gives median $10.000$, MAD $0.500$, robust score $26.979630$ for candidate $30$ (14.8).
3. Retail holiday monitoring — raw high value is not anomalous if expected; anomaly score uses residual $y_t-\hat y_t$ (14.8).
4. Seasonal service monitoring — series $10+2\sin(2\pi t/12)$ with a $+5$ shock has anomaly residual exactly $5.000$ (14.8).
5. Incident triage — one spike is an anomaly, while sustained residual sign points to changepoint analysis in 14.9 (14.8).

**Notebook plan:**
- Family: F13 Time-Series/State-Space
- Concept built once (D1): `residual_anomaly_score(y, baseline_model, robust=False)` computes residual z and robust MAD score, verifying lesson scores $28.284271$, $26.979630$, and seasonal residual $5.000$.
- Datasets D1–D5: D1 constant series · D2 linear drift · D3 drift+noise · D4 seasonal monthly synthetic series · D5 outlier/regime-shift
- Metric: interval/threshold coverage converted to RMSE-compatible summary by tracking false-alarm-adjusted residual RMSE across rungs
- Closing viz: (a) filtered/forecast-vs-true panels per series with anomalies marked (b) RMSE-vs-noise curve
- Pitfall on D5: Letting anomalies train the threshold, reproduced by contaminated $\hat\sigma_t$, then fixed with robust/held-out thresholding.
- Notes: Delete generic classification/anomaly placeholders; CPU-only; distinguish spike anomaly from regime shift.

### 14.9 — Changepoint detection   [notebook: 14.9-changepoint-detection.ipynb]   (family: F13)

**Lesson — Real World Applications (5):**
1. Site reliability metrics — detect when a stable latency rule changes; lesson series $\{10,11,10,18,19,20\}$ has split gain before penalty $18.777778$ (14.9).
2. Pricing analytics — two segment means $10.333$ and $19.000$ beat one mean $14.667$ for the lesson split (14.9).
3. Manufacturing yield — accept a split only when loss reduction beats penalty $\lambda$ in the gain formula (14.9).
4. Online monitoring — CUSUM with $\mu_0=10.5$, $k=0.5$ stays $\{0,0,0\}$ then rises to $7.000$, $15.000$, $24.000$ (14.9).
5. Forecast maintenance — distinguish isolated anomaly from new regime before retraining; one spike should usually be handled by 14.8 (14.9).

**Notebook plan:**
- Family: F13 Time-Series/State-Space
- Concept built once (D1): `detect_mean_shift(y, penalty)` computes one-split SSE gain and optional CUSUM, verifying lesson means, average squared errors $19.222$ vs $0.444$, gain $18.777778$, and CUSUM path to $24.000$.
- Datasets D1–D5: D1 constant series · D2 linear drift · D3 drift+noise · D4 seasonal monthly synthetic series · D5 outlier/regime-shift
- Metric: RMSE after refitting segment-wise forecasts; report detection delay as secondary annotation only
- Closing viz: (a) filtered/forecast-vs-true panels per series with changepoints marked (b) RMSE-vs-noise curve
- Pitfall on D5: Detecting every anomaly as a changepoint, reproduced with a single spike false split, then fixed by penalty validation and sustained-evidence check.
- Notes: Delete dead template code not tied to segmentation/CUSUM; CPU-only exhaustive tiny splits; include trend-change caveat.

### 14.10 — Forecast evaluation & backtesting   [notebook: 14.10-forecast-evaluation-backtesting.ipynb]   (family: F13, gap)

**Lesson — Real World Applications (5):**
1. Demand planning model selection — tiny forecast $y=\{10,12,15\}$ vs $\hat y=\{11,13,14\}$ has MAE $1.000$ and RMSE $1.000$ (14.10).
2. Executive KPI reporting — MAPE on the same example is $8.333333\%$ (14.10).
3. Cross-series comparison — training history $\{8,10,12,15\}$ gives naive scale $2.333333$ and MASE $0.428571$ (14.10).
4. Probabilistic forecasting — interval backtest with 5 covered points out of 5 has coverage $5/5=1.000$ (14.10).
5. Operations scheduling — horizon matters; a one-step MAE and a 30-step MAE answer different decisions (14.10 pitfall).

**Notebook plan:**
- Family: F13 Time-Series/State-Space
- Concept built once (D1): `rolling_origin_backtest(y, model, horizon, metric)` verifies lesson MAE/RMSE $1.000$, MAPE $8.333333\%$, naive scale $2.333333$, MASE $0.428571$, and coverage $1.000$.
- Datasets D1–D5: D1 constant series · D2 linear drift · D3 drift+noise · D4 seasonal monthly synthetic series · D5 outlier/regime-shift
- Metric: RMSE across chronological rolling-origin folds; include interval coverage only when forecasts emit intervals
- Closing viz: (a) filtered/forecast-vs-true panels per series with fold boundaries (b) RMSE-vs-noise curve
- Pitfall on D5: Randomly shuffling time series, reproduced with leaky random split through regime shift, then fixed by rolling-origin chronological backtesting.
- Notes: Delete generic train/test split template code; CPU-only, tiny; gap note: lesson is flagged `gap:true`, so implementation should ensure enough authored explanation before notebook rebuild.
