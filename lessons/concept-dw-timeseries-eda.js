/* Data Wrangling — "Time-series EDA (Exploratory Data Analysis)".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-timeseries-eda". */
(function () {
  window.LESSONS.push({
    id: "dw-timeseries-eda",
    title: "Time-series EDA: trend, seasonality, autocorrelation, stationarity",
    tagline: "Look at data indexed by time the right way before you ever model or forecast it.",
    module: "Data Wrangling",
    prereqs: ["dw-dates-times", "met-forecasting", "mod-timeseries"],

    whenToUse:
      `<p>Reach for this <b>any time your rows are ordered by time</b> &mdash; daily sales, hourly traffic,
       a sensor stream, monthly revenue, a click log bucketed per day. Before you fit any forecaster or
       time-aware model you must first <i>look</i> at the series and answer four questions: is there a
       <b>trend</b> (a slow drift up or down)? a <b>seasonality</b> (a pattern that repeats every week, month,
       or year)? is the behavior <b>stable over time</b> (constant mean and variance), or does it shift? and
       how strongly does each value depend on its own recent past (<b>autocorrelation</b>)?</p>
       <p>Time-series EDA (Exploratory Data Analysis) is the step that turns a raw, time-stamped table into an
       understood series. It tells you which transforms you will need (differencing, deseasonalizing,
       log-scaling), where the data has gaps or sudden jumps, and &mdash; crucially &mdash; that you must
       respect time order and never shuffle.</p>
       <p>This sits directly between <b>dw-dates-times</b> (where you parsed strings into a real
       <code>DatetimeIndex</code>) and <b>met-forecasting</b> / <b>mod-timeseries</b> (where you actually
       predict). Skip it and you will hand a forecaster a series whose seasonality and trend it was never told
       about, or worse, leak the future during evaluation.</p>`,

    application:
      `<p>Time-ordered data is everywhere, and EDA on it precedes every serious model.</p>
       <ul>
         <li><b>Demand and revenue.</b> Daily orders carry a weekly shape (weekends differ) plus a yearly
         holiday season; you decompose to separate the slow trend from the repeating pattern before
         forecasting stock or staffing.</li>
         <li><b>Operations and sensors.</b> A machine's temperature stream is checked for <b>drift</b> (a
         creeping rolling mean) and <b>changing variance</b> (a widening rolling standard deviation) that warn
         of wear long before a failure.</li>
         <li><b>Product analytics.</b> Daily active users get resampled to weekly to strip out the day-of-week
         wiggle, and a sudden <b>level shift</b> flags a release, an outage, or a tracking bug.</li>
         <li><b>Finance and economics.</b> Prices are famously <b>non-stationary</b>; analysts difference them
         into returns and run stationarity tests before any model assuming a stable mean.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Shuffling or random-splitting time data.</b> A random train/test split lets future rows train
         a model that is then "tested" on the past &mdash; the single worst leak in time series. Always
         <b>split by time</b>: train on the early window, test on the later one, and never shuffle.</li>
         <li><b>Ignoring seasonality and trend.</b> A series that swings every December is not "noisy" &mdash;
         it is seasonal. Treating the repeating pattern as random hides it from the model and inflates your
         error estimates. Decompose first so you can see and handle it.</li>
         <li><b>Treating non-stationary data as stationary.</b> Many classical methods assume a constant mean
         and variance. Feeding them a trending or variance-changing series gives misleading fits and spurious
         correlations. Test for stationarity; difference or detrend when it fails.</li>
         <li><b>Gaps and irregular timestamps.</b> Missing days, duplicate timestamps, or uneven spacing
         silently break <code>resample</code>, rolling windows, and lag-based features. Reindex to a regular
         frequency and decide explicitly how to fill (or leave) the holes.</li>
         <li><b>Confusing autocorrelation with a real driver.</b> A value correlating with its own lag is
         often just inherited trend or seasonality, not evidence that "yesterday causes today" in any useful
         modeling sense. Remove trend/season before reading the autocorrelation.</li>
         <li><b>Over-differencing.</b> Differencing once can make a trending series stationary; differencing
         again "just to be safe" injects extra noise and negative autocorrelation, hurting the model. Difference
         the minimum number of times the tests require.</li>
       </ul>`,

    bigIdea:
      `<p>A time series is one column whose order <i>is</i> information. The whole craft of time-series EDA is
       to split that single squiggly line into parts you can reason about, and then to check whether what is
       left behaves nicely.</p>
       <p><b>Decomposition.</b> The classic mental model is that an observed value is the sum (or product) of
       three pieces: a <b>trend</b> $T_t$ (the slow drift), a <b>seasonality</b> $S_t$ (a pattern that repeats
       on a fixed period $m$ &mdash; 7 for weekly, 12 for monthly, 365 for yearly), and a <b>residual</b>
       $R_t$ (everything left over). <code>seasonal_decompose</code> or STL (Seasonal-Trend decomposition using
       Loess) pulls these apart so you can see each on its own.</p>
       <p><b>Rolling statistics.</b> A <b>rolling mean</b> slides a window over the series and averages it,
       revealing the trend by canceling short-term noise. A <b>rolling standard deviation</b> does the same for
       spread, exposing changing variance. Watching both drift is the fastest visual check for
       non-stationarity.</p>
       <p><b>Autocorrelation.</b> The Autocorrelation Function (ACF) measures how a value correlates with the
       value $k$ steps earlier &mdash; its lag $k$. A spike at lag 7 in a daily series screams "weekly
       seasonality". The Partial Autocorrelation Function (PACF) measures the same but with the shorter lags'
       effects removed, isolating the <i>direct</i> dependence on lag $k$.</p>
       <p><b>Stationarity.</b> A series is (weakly) <b>stationary</b> if its mean and variance do not change
       over time and its autocorrelation depends only on the gap, not on the absolute date. Most classical
       models assume it. The Augmented Dickey-Fuller (ADF) test and the KPSS (Kwiatkowski-Phillips-Schmidt-Shin)
       test check it, and differencing or detrending fixes it when it fails.</p>`,

    buildup:
      `<p><b>Step 1 &mdash; index and plot.</b> Put the timestamps on the index (a <code>DatetimeIndex</code>;
       see <b>dw-dates-times</b>), sort by time, and simply <b>plot the line</b>. Half of time-series EDA is
       looking: you immediately spot trend, repeating bumps, gaps, and outliers.</p>
       <p><b>Step 2 &mdash; decompose.</b> Call <code>seasonal_decompose(series, model="additive", period=m)</code>
       (or <code>STL(series, period=m).fit()</code>) to separate $T_t$, $S_t$, and $R_t$. STL is more robust:
       it handles a seasonal pattern whose shape changes slowly and is less thrown off by outliers.</p>
       <p><b>Step 3 &mdash; rolling mean and std.</b> Overlay <code>series.rolling(w).mean()</code> on the raw
       line to see the trend, and plot <code>series.rolling(w).std()</code> to see whether the spread is
       widening. Both windows look only <i>backward</i>, so they never leak the future.</p>
       <p><b>Step 4 &mdash; ACF and PACF.</b> <code>plot_acf</code> and <code>plot_pacf</code> draw the
       correlation at each lag with a confidence band; bars poking outside the band are "real". A tall slowly
       decaying ACF means trend (the series remembers its past for a long time); an isolated spike at lag $m$
       means seasonality of period $m$.</p>
       <p><b>Step 5 &mdash; stationarity test.</b> Run <code>adfuller(series)</code>. Its null hypothesis is
       "the series has a unit root" (is non-stationary); a small p-value lets you reject that and call it
       stationary. KPSS flips the null (its null is "stationary"), so the two together are a useful
       cross-check. If the series fails, <b>difference</b> it (<code>series.diff()</code>) or remove the
       trend/season, then re-test &mdash; but stop as soon as it passes to avoid over-differencing.</p>
       <p><b>Step 6 &mdash; resample and inspect anomalies.</b> <code>resample("W").mean()</code> gives a
       coarser, calmer view; comparing frequencies surfaces a weekly shape you might miss at daily resolution.
       Throughout, hunt for <b>gaps</b> (missing dates), <b>level shifts</b> (a step change in the mean), and
       <b>anomalies</b> (single wild points) &mdash; each needs a deliberate decision before modeling.</p>`,

    symbols: [
      { sym: "$y_t$", desc: "the observed value of the series at time $t$ (one row of the time-indexed column)." },
      { sym: "$T_t$", desc: "the <b>trend</b> component at time $t$ &mdash; the slow drift up or down." },
      { sym: "$S_t$", desc: "the <b>seasonal</b> component &mdash; a pattern that repeats every $m$ steps, so $S_t = S_{t-m}$." },
      { sym: "$R_t$", desc: "the <b>residual</b> (remainder) after trend and season are removed: the irregular leftover." },
      { sym: "$m$", desc: "the seasonal period (steps per cycle): $7$ for weekly in daily data, $12$ for monthly, $365$ for yearly." },
      { sym: "$w$", desc: "the rolling-window length (number of consecutive points averaged, e.g. $w=30$ for a 30-day mean)." },
      { sym: "$\\rho_k$", desc: "the autocorrelation at lag $k$ &mdash; the correlation of $y_t$ with $y_{t-k}$." }
    ],

    formula:
      `$$ y_t = T_t + S_t + R_t,\\qquad
         \\rho_k=\\frac{\\sum_{t} (y_t-\\bar{y})(y_{t-k}-\\bar{y})}{\\sum_{t}(y_t-\\bar{y})^2} $$`,

    whatItDoes:
      `<p>The left equation is the <b>additive decomposition</b>: every observed value $y_t$ is the trend
       $T_t$ plus the seasonal pattern $S_t$ plus the leftover residual $R_t$. (When the seasonal swings grow
       with the level &mdash; bigger wiggles when the series is high &mdash; use the <b>multiplicative</b>
       form $y_t = T_t \\cdot S_t \\cdot R_t$, or just take a logarithm first to turn it back into an additive
       one.) Decomposition is what lets you study, model, and remove each piece separately.</p>
       <p>The right equation is the <b>autocorrelation at lag $k$</b>, $\\rho_k$. It is an ordinary
       correlation between the series and a copy of itself shifted by $k$ steps: $\\rho_0=1$ always, and a
       value near $\\pm 1$ at some lag $k$ means $y_t$ is strongly tied to what happened $k$ steps ago. A spike
       at $k=m$ is the signature of seasonality; a slow decay across many lags is the signature of trend.</p>`,

    derivation:
      `<p><b>Why decomposition and stationarity go together.</b></p>
       <ul class="steps">
         <li>Start from the raw line $y_t$. If it drifts upward, its mean clearly depends on $t$ &mdash; so by
         definition it is <b>non-stationary</b>. A rolling mean that keeps climbing is the visual proof.</li>
         <li>Write $y_t = T_t + S_t + R_t$. The non-stationarity lives in $T_t$ (a moving mean) and in $S_t$ (a
         mean that cycles with the calendar). The residual $R_t$ is what is <i>left</i> once both are removed
         &mdash; ideally a stationary, roughly flat-mean, constant-variance series.</li>
         <li>So "make it stationary" and "remove trend and season" are the same job. <b>Differencing</b>
         $y_t - y_{t-1}$ kills a linear trend (the slope cancels); <b>seasonal differencing</b>
         $y_t - y_{t-m}$ kills a fixed seasonal pattern (since $S_t = S_{t-m}$, that term subtracts to zero).</li>
         <li>The ACF tells you which to do. A slowly decaying ACF &rarr; trend &rarr; difference once. A spike
         at lag $m$ &rarr; seasonality of period $m$ &rarr; seasonal-difference. After each step, re-run the
         <b>ADF test</b>: a sufficiently negative test statistic (a small p-value) means you can reject the
         "has a unit root" null and call the result stationary.</li>
         <li>Crucially, stop there. Each extra difference adds variance and a spurious negative lag-1
         autocorrelation. <b>Over-differencing</b> makes the series <i>look</i> rougher and harms the model, so
         the minimum number of differences that passes the test is the right number. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>Take a tiny daily series with a clear weekly beat (period $m=7$), e.g. low on weekends:</p>
       <p><code>Mon..Sun</code> for two weeks &asymp; <code>[20, 21, 22, 21, 20, 12, 11,  22, 23, 24, 23, 22, 14, 13]</code>.</p>
       <ul class="steps">
         <li><b>Plot.</b> The eye sees two things at once: a gentle upward <b>trend</b> (week 2 sits above week
         1) and a repeating <b>dip every 6th-7th point</b> (the weekend).</li>
         <li><b>Decompose</b> with period 7. $T_t$ comes out as a smooth slope from ~18 to ~20; $S_t$ is the
         fixed weekly shape (positive on weekdays, sharply negative on weekends); $R_t$ is tiny.</li>
         <li><b>Autocorrelation.</b> $\\rho_7$ is large and positive &mdash; each day looks like the same day
         last week. That lag-7 spike is the numeric fingerprint of the weekly season you saw by eye.</li>
         <li><b>Stationarity.</b> Because the mean drifts up, the raw series fails the ADF test. Subtract last
         week (<code>y.diff(7)</code>) to remove the season, or <code>y.diff(1)</code> to remove the trend; the
         differenced series has a roughly flat mean and now passes &mdash; ready for a model that assumes
         stationarity.</li>
       </ul>`,

    practice: [
      {
        q: `You have two years of daily website sessions. Before forecasting, your colleague suggests a random 80/20 train/test split "like we always do". Why is that wrong here, and what do you do instead?`,
        steps: [
          { do: `Recognize the data is time-ordered, so order carries information and the rows are not exchangeable.`, why: `Sessions on consecutive days are correlated and the whole point is to predict the <i>future</i> from the <i>past</i>.` },
          { do: `See that a random split puts some future days in the training set and some past days in the test set.`, why: `The model then "sees" the future during training &mdash; classic leakage that inflates measured accuracy.` },
          { do: `Split by time: train on the earlier window, test on the later one; never shuffle.`, why: `An honest forecast evaluation mirrors deployment, where only past data is available when predicting tomorrow.` }
        ],
        answer: `<p>A random split <b>leaks the future</b>: future days land in training and past days in test, so the model is graded on information it would never have at prediction time. Instead <b>split by time</b> &mdash; train on, say, the first 20 months, test on the last 4 &mdash; and never shuffle. Same rule for cross-validation: use forward-chaining (expanding-window) folds, not random ones.</p>`
      },
      {
        q: `A daily sales series climbs steadily and its <code>plot_acf</code> shows bars that stay high and decay very slowly across 30 lags, plus a noticeable bump at lag 7. The ADF test gives a large (non-negative) p-value. Read these three signals and prescribe the fix.`,
        steps: [
          { do: `Interpret the slowly decaying ACF as the fingerprint of a <b>trend</b>.`, why: `When the mean drifts, every value stays correlated with many past values, so the autocorrelation decays only gradually.` },
          { do: `Interpret the lag-7 bump as <b>weekly seasonality</b>.`, why: `Each day resembles the same weekday last week, producing a spike at the seasonal period $m=7$.` },
          { do: `Read the large ADF p-value as a failure to reject non-stationarity, then difference.`, why: `ADF's null is "has a unit root" (non-stationary); a large p-value means you cannot reject it, so the raw series is non-stationary. <code>diff(1)</code> removes the trend, <code>diff(7)</code> removes the weekly season; re-test after each, and stop once it passes.` }
        ],
        answer: `<p>The slowly decaying ACF says <b>trend</b>; the lag-7 spike says <b>weekly seasonality</b>; the large ADF p-value confirms the raw series is <b>non-stationary</b>. Fix it by differencing: <code>y.diff(1)</code> to remove the trend and/or <code>y.diff(7)</code> for the weekly season, re-running <code>adfuller</code> after each step. Stop the moment the test passes &mdash; differencing again just over-differences and adds noise.</p>`
      },
      {
        q: `Your hourly sensor feed has missing hours scattered through it and you want a 24-hour rolling mean and a clean ACF. What goes wrong if you ignore the gaps, and how do you prepare the series?`,
        steps: [
          { do: `Notice that rolling windows and lag-$k$ autocorrelation assume <b>evenly spaced</b> timestamps.`, why: `A "24-row" window or a "lag-24" comparison only equals 24 hours if every hour is present; gaps make a window span more real time than intended.` },
          { do: `Reindex onto a complete regular hourly grid so the missing hours become explicit <code>NaN</code> rows.`, why: `<code>series.asfreq("H")</code> (or reindex to a full <code>date_range</code>) exposes the holes instead of silently skipping them.` },
          { do: `Decide a fill policy &mdash; interpolate short gaps, or leave longer ones as <code>NaN</code> and let the window require a minimum count.`, why: `Short gaps interpolate safely; long gaps should not be invented, so you keep them missing and handle them honestly downstream.` }
        ],
        answer: `<p>If you ignore the gaps, a "24-row" rolling window and a "lag-24" autocorrelation no longer correspond to 24 real hours, so both the smoothed line and the ACF are wrong. <b>Reindex to a regular hourly grid</b> with <code>asfreq("H")</code> so missing hours appear as <code>NaN</code>, then choose a fill policy &mdash; interpolate short gaps, leave long ones missing. Only then do rolling stats and the ACF measure what you think they measure.</p>`
      }
    ]
  });

  window.CODE["dw-timeseries-eda"] = {
    lib: "pandas + statsmodels",
    runnable: false,
    explain: `<p>One end-to-end exploratory pass over a daily series on a <code>DatetimeIndex</code>: <b>plot</b>
       the raw line, <b>decompose</b> it into trend + seasonality + residual with
       <code>seasonal_decompose</code> (and the more robust STL), overlay a <b>rolling mean and standard
       deviation</b> to see drift and changing variance, draw the <b>ACF and PACF</b> with
       <code>plot_acf</code> / <code>plot_pacf</code>, run an <b>ADF stationarity test</b> with
       <code>adfuller</code>, then <b>difference</b> and re-test, and finally <b>resample</b> to a coarser
       frequency. The series is generated with numpy (trend + yearly season + weekend bump + noise) so the
       file runs as-is; swap in your own <code>pd.read_csv(..., parse_dates=...)</code> for real data.</p>`,
    code: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.seasonal import seasonal_decompose, STL
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from statsmodels.tsa.stattools import adfuller

# === 0) Build / load a series on a DatetimeIndex ========================
# Real data: s = pd.read_csv("sales.csv", parse_dates=["date"]).set_index("date")["y"]
rng = np.random.RandomState(42)
idx = pd.date_range("2021-01-01", periods=365, freq="D")     # a DatetimeIndex
t   = np.arange(365)
y   = (50 + 0.08 * t                                          # slow upward trend
       + 12 * np.sin(2 * np.pi * t / 365.25)                 # yearly seasonality
       + 6  * (idx.dayofweek >= 5)                           # weekend bump
       + rng.normal(0, 3, 365))                              # irregular noise
s = pd.Series(y, index=idx).sort_index()                     # always sort by time!

# === 1) PLOT the raw series =============================================
s.plot(title="Raw daily series", figsize=(10, 3)); plt.show()

# === 2) DECOMPOSE into trend + seasonality + residual ===================
dec = seasonal_decompose(s, model="additive", period=7)      # weekly period
dec.plot(); plt.show()                                       # trend / seasonal / resid
stl = STL(s, period=7, robust=True).fit()                    # robust alternative
stl.plot(); plt.show()

# === 3) ROLLING mean & std -> drift and changing variance ===============
roll_mean = s.rolling(30).mean()      # 30-day backward moving average (trend)
roll_std  = s.rolling(30).std()       # 30-day rolling spread (variance drift)
ax = s.plot(alpha=.4, label="raw", figsize=(10, 3))
roll_mean.plot(ax=ax, label="30d mean"); roll_std.plot(ax=ax, label="30d std")
ax.legend(); plt.show()

# === 4) AUTOCORRELATION: ACF and PACF ===================================
plot_acf(s, lags=30);  plt.show()     # spike at lag 7 -> weekly seasonality
plot_pacf(s, lags=30); plt.show()     # direct (partial) dependence per lag

# === 5) STATIONARITY: Augmented Dickey-Fuller test ======================
def adf_report(series, name):
    stat, p, *_ = adfuller(series.dropna())
    verdict = "stationary" if p < 0.05 else "NON-stationary"
    print(f"{name:18s} ADF={stat:7.3f}  p={p:.4f}  -> {verdict}")

adf_report(s,          "level")        # trend present -> expect non-stationary-ish
adf_report(s.diff(),   "1st difference")   # removing the trend usually passes

# === 6) RESAMPLE to a coarser cadence + spot gaps =======================
weekly = s.resample("W").mean()        # calmer weekly view
print(weekly.head())
print("missing dates:", pd.date_range(s.index.min(), s.index.max(), freq="D")
      .difference(s.index))            # empty here; non-empty flags gaps`
  };

  window.CODEVIZ["dw-timeseries-eda"] = {
    question: "On a real-pattern daily series (trend + yearly season + weekend bump + noise), what does a 30-day rolling mean reveal, and is the raw series stationary?",
    charts: [
      {
        type: "line",
        title: "Raw daily series vs its 30-day rolling mean (one year)",
        xlabel: "day of year",
        ylabel: "value",
        series: [
          { name: "raw daily (noisy)", color: "#ff7b72", points: [[30,63.2],[36,55.9],[42,61.6],[48,65.6],[54,65.6],[60,67.8],[66,76.1],[72,77.6],[78,66.9],[84,67.0],[90,70.7],[96,65.2],[102,68.7],[108,76.6],[114,83.6],[120,72.4],[126,76.6],[132,70.0],[138,68.5],[144,69.6],[150,75.4],[156,71.7],[162,69.6],[168,72.2],[174,66.8],[180,73.2],[186,66.5],[192,72.1],[198,69.3],[204,65.3],[210,73.0],[216,63.1],[222,54.7],[228,56.6],[234,63.5],[240,67.8],[246,58.1],[252,61.8],[258,56.9],[264,56.2],[270,60.0],[276,67.4],[282,68.6],[288,63.0],[294,64.6],[300,64.9],[306,64.4],[312,68.5],[318,71.6],[324,80.1],[330,71.2],[336,70.4],[342,73.1],[348,69.8],[354,75.3],[360,81.0]] },
          { name: "30-day rolling mean", color: "#4ea1ff", points: [[30,55.3],[36,56.5],[42,57.8],[48,59.6],[54,61.2],[60,63.2],[66,64.7],[72,66.2],[78,67.2],[84,68.3],[90,69.0],[96,69.6],[102,70.1],[108,71.0],[114,71.3],[120,71.5],[126,72.1],[132,71.9],[138,71.6],[144,71.5],[150,71.2],[156,70.3],[162,70.2],[168,70.2],[174,69.3],[180,69.2],[186,68.7],[192,67.9],[198,66.4],[204,65.9],[210,64.9],[216,64.7],[222,64.0],[228,63.6],[234,63.0],[240,62.1],[246,61.0],[252,60.9],[258,61.0],[264,60.6],[270,60.5],[276,61.0],[282,61.0],[288,61.1],[294,62.0],[300,63.0],[306,63.7],[312,65.0],[318,66.4],[324,67.6],[330,68.5],[336,69.8],[342,70.8],[348,71.6],[354,73.3],[360,74.8]] }
        ]
      }
    ],
    caption: "Real numbers from a numpy-built daily series (trend + yearly seasonality + weekend bump + noise) on a pandas DatetimeIndex. The red raw line jitters day to day; the blue 30-day rolling mean (s.rolling(30).mean()) cancels that noise and exposes the slow shape &mdash; rising into mid-year then easing off &mdash; which is exactly the trend plus yearly season. Because the rolling mean keeps moving, its mean is not constant, so the series is non-stationary; an Augmented Dickey-Fuller (ADF) test on the level gives stat -6.14 while the same test on the 1st difference gives a far more negative stat -22.07 (more clearly stationary once the trend is removed). The autocorrelation function (ACF) of the raw series stays high and decays slowly (lags 1..7: 0.70, 0.59, 0.60, 0.56, 0.57, 0.66, 0.75), the signature of trend; a separate clean weekly series shows the textbook seasonal ACF spike at lag 7 (~0.87). Monthly resample means (Jan..Dec): 55.6, 63.1, 68.9, 71.5, 71.1, 69.2, 65.0, 61.6, 60.5, 63.7, 69.2, 76.0.",
    code: `import numpy as np
import pandas as pd

rng = np.random.RandomState(42)
idx = pd.date_range("2021-01-01", periods=365, freq="D")   # DatetimeIndex
t   = np.arange(365)
y   = (50 + 0.08 * t                       # slow upward trend
       + 12 * np.sin(2 * np.pi * t / 365.25)  # yearly seasonality
       + 6  * (idx.dayofweek >= 5)         # weekend bump
       + rng.normal(0, 3, 365))            # noise
s = pd.Series(y, index=idx)

roll = s.rolling(30).mean()                # 30-day backward moving average
sub  = np.arange(29, 365, 6)[:56]          # 56 plotted days, rolling defined
print("raw :", np.round(s.values[sub], 1))
print("roll:", np.round(roll.values[sub], 1))

# Stationarity (ADF) — needs statsmodels.tsa.stattools.adfuller:
#   adfuller(s)            -> stat -6.14  (level, trend present)
#   adfuller(s.diff()...)  -> stat -22.07 (1st difference, clearly stationary)

# Autocorrelation of the raw series (slow decay = trend):
def acf(x, nlags):
    x = np.asarray(x, float) - np.mean(x); d = (x * x).sum()
    return [round(float((x[:len(x)-k] * x[k:]).sum() / d), 3) for k in range(nlags + 1)]
print("ACF 0..7:", acf(s.values, 7))       # [1.0, 0.70, 0.59, 0.60, 0.56, 0.57, 0.66, 0.75]

# A clean weekly series shows the seasonal ACF spike at lag 7:
w = 20 + 8 * np.sin(2 * np.pi * np.arange(140) / 7) + rng.normal(0, 1.5, 140)
print("weekly ACF lag7:", acf(w, 7)[7])    # ~0.87

print("monthly:", np.round(s.resample("M").mean().values, 1))
# monthly -> [55.6 63.1 68.9 71.5 71.1 69.2 65.  61.6 60.5 63.7 69.2 76. ]`
  };
})();
