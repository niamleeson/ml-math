/* Mock ML-engineering "lab" scenarios. Merged into window.SIMULATIONS by application id.
   { title, icon, goal, stages:[ { phase, icon, title, narrative(HTML), concepts:[lessonIds],
     insight?(HTML), data?:{caption,columns,rows,note}, symbols?:[{sym,desc}],
     steps:[ {type:"decide", prompt, options:[{label, feedback, best?}]} | {type:"run", label, prompt?, result:{log?, metrics?:[{k,v}], note?}} ] } ] } */
window.SIMULATIONS = Object.assign(window.SIMULATIONS || {}, {
  "forecasting-timeseries": {
    title: "Demand Forecasting",
    icon: "📅",
    goal: "Forecast next week's hourly electricity load so the grid buys the right amount of power — not too much, not too little.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Frame the problem",
        narrative: `<p>The utility must commit power purchases a full day ahead. Under-buy and you pay brutal spot prices when demand surprises you; over-buy and you pay for power nobody uses. The asymmetry is real money: a single bad peak-hour miss can cost more than a month of small errors.</p><p>So the deliverable isn't "a number" — it's an hourly load curve a week out, each hour carrying honest uncertainty so purchasers can size their safety margin.</p>`,
        concepts: ["mod-timeseries", "prob-expectation", "ml-regression-metrics"],
        insight: `<b>The flat baseline is hopeless.</b> Load swings about <b>2.6× between the 4am trough (~7,200 MW) and the 6pm weekday peak (~18,700 MW)</b>. A single all-day mean misses the peak by roughly 4,000 MW — far more than the spot-market penalty you can afford. Any useful forecast must be hour-by-hour, because the cost lives entirely in the peaks.`,
        data: {
          caption: "What the target looks like: an hourly load series indexed by time",
          columns: ["timestamp", "load (MW)", "hour", "weekday"],
          rows: [
            ["2026-06-15 04:00", "7,210", "4", "Mon"],
            ["2026-06-15 18:00", "18,640", "18", "Mon"],
            ["2026-06-16 18:00", "18,910", "18", "Tue"],
            ["2026-06-20 18:00", "14,300", "18", "Sat"]
          ],
          note: `One row per hour, in strict time order. The target is the <b>load</b> column; everything else (hour, weekday, later weather) is a clue you can know in advance. Notice the same 6pm hour is far lower on Saturday — the calendar matters.`
        },
        symbols: [
          { sym: "$\\text{load}_t$", desc: "the megawatts drawn from the grid during hour $t$ — the quantity you must forecast." },
          { sym: "$t$", desc: "the hour index; the forecast horizon is the next 168 hours ($t+1$ through $t+168$, one full week)." },
          { sym: "$E[\\text{load}_t \\mid \\text{past}]$", desc: "the conditional expectation: your best single guess of load at hour $t$ given everything known before it." }
        ],
        steps: [{
          type: "decide", prompt: "What is the forecasting target and horizon?",
          options: [
            { label: "Predict the single yearly average load", feedback: "far too coarse. Purchasing is an hourly decision and a yearly mean tells you nothing about the 6pm peak — the one hour where a miss actually costs you. A flat number throws away the 2.6× daily swing that is the entire problem." },
            { label: "Predict load (MW) for each of the next 168 hours, as a conditional expectation given history", best: true, feedback: "this matches the decision exactly: an hourly curve a week out. Framing it as $E[\\text{load}_t \\mid \\text{past}]$ makes the target a real-valued regression you can attach prediction intervals to later. The horizon (168h) is set by the purchasing cycle, not by what's convenient to model." },
            { label: "Classify each hour as high or low load", feedback: "a label loses the magnitude, and magnitude is the product. Purchasers must buy megawatts; 'high' could mean 15,000 or 19,000 MW and the difference is the whole cost. Bucketing also forces an arbitrary threshold that throws away information." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather the data",
        narrative: `<p>You pull years of metered load plus the drivers that move it: weather and the calendar. Two things make time-series data special. First, ordering is sacred — you can never let a future row inform a past one. Second, the features that matter must be <i>knowable ahead of time</i>, or they're useless at forecast time.</p>`,
        concepts: ["ml-supervised", "prob-random-variable", "mod-timeseries"],
        insight: `<b>Weather is the dominant exogenous driver.</b> Over 4 years, hour-of-day plus temperature alone explain about <b>78% of load variance</b> — heating below 12°C and cooling above 24°C drive the rest. That's why you join a weather feed: without it, your best model is stuck guessing the weather-driven swings.`,
        data: {
          caption: "The joined training table — load history with calendar and weather columns",
          columns: ["timestamp", "load (MW)", "temp °C", "hour", "dow", "holiday"],
          rows: [
            ["2026-06-15 08:00", "13,420", "19.5", "8", "Mon", "0"],
            ["2026-06-15 18:00", "18,640", "27.1", "18", "Mon", "1?"],
            ["2026-06-16 03:00", "7,540", "16.2", "3", "Tue", "0"],
            ["2026-06-20 14:00", "12,180", "29.8", "14", "Sat", "0"]
          ],
          note: `35,064 rows like these (4 years × 8,766 hours). Each row is one hour; columns are the load target plus the drivers. The weather columns come from a forecast feed, so they're available a day ahead — that's what makes them legal features.`
        },
        symbols: [
          { sym: "$x_t$", desc: "the feature vector for hour $t$ — temperature, hour, day-of-week, holiday flag, and lagged load." },
          { sym: "dow", desc: "day-of-week (Mon–Sun), a categorical calendar feature that separates weekday peaks from weekend ones." },
          { sym: "$y_t$", desc: "the supervised label: the metered load at hour $t$ that the model learns to predict from $x_t$." }
        ],
        steps: [
          { type: "decide", prompt: "Which extra signals are worth joining to the load history?",
            options: [
              { label: "Weather (temperature), calendar (hour, weekday, holiday), and lagged load", best: true, feedback: "these are the genuine causal drivers. Heating and cooling load track temperature; human schedules track the calendar; and yesterday's load carries the slow-moving level. Crucially, all of them are known a day ahead (the weather comes from a forecast feed), so they're legal at scoring time." },
              { label: "Tomorrow's actual metered load", feedback: "that's the answer itself, and it doesn't exist yet at forecast time. Joining it is textbook look-ahead leakage — your backtest would look perfect and production would collapse, because the column is blank when you actually need it." },
              { label: "Only the raw timestamp", feedback: "a bare timestamp can't express that 6pm on a hot weekday is a peak while 6pm Saturday isn't. A tree or regression sees an integer, not a clock. You must engineer the timestamp into hour/weekday/holiday drivers — the raw value carries no usable structure." }
            ] },
          { type: "run", label: "▶ Pull 4 years of hourly load", prompt: "Load metered history joined with weather and calendar.",
            result: { log: "querying meter warehouse...\nloaded 35,064 hourly rows x 11 columns\njoined weather (temp, humidity)\njoined calendar (hour, dow, holiday)\ndaily + weekly + yearly seasonality visible in autocorrelation", metrics: [{ k: "rows", v: "35,064" }, { k: "span", v: "4 yrs" }, { k: "features", v: "11" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore seasonality",
        narrative: `<p>Before modeling, find the repeating structure — that structure is most of the signal. Load has nested cycles: a daily rhythm (people wake, work, cook), a weekly rhythm (weekends differ), and a yearly rhythm (summer AC, winter heat). On top of the cycles ride weather shocks.</p><p>Autocorrelation makes the cycles visible: load at hour $t$ looks a lot like load 24 and 168 hours earlier.</p>`,
        concepts: ["mod-timeseries", "prob-variance", "mlx-error-analysis"],
        insight: `<b>The temperature response is a U, not a line.</b> Load bottoms out near <b>18°C and rises in both directions</b> — about +180 MW per °C of cooling above 24°C and +140 MW per °C of heating below 12°C. A linear temperature term would predict <i>lower</i> load on cold days, which is exactly backwards. The autocorrelation also spikes hard at <b>lag 24h and lag 168h</b>, confirming the daily and weekly cycles.`,
        data: {
          caption: "Autocorrelation of load at increasing lags",
          columns: ["lag (hours)", "meaning", "autocorr ρ"],
          rows: [
            ["1", "previous hour", "0.97"],
            ["24", "same hour yesterday", "0.91"],
            ["168", "same hour last week", "0.88"],
            ["12", "opposite time of day", "0.12"]
          ],
          note: `ρ near 1 means "load now strongly resembles load that many hours ago". The big peaks at 24 and 168 are the daily and weekly seasons — and they tell you which lags to feed the model as features.`
        },
        chart: {
          type: "bars",
          title: "Mean 6pm load by day of week (MW)",
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          values: [18640, 18910, 18700, 18550, 17900, 14300, 13800],
          colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#ffb454", "#ffb454"]
        },
        symbols: [
          { sym: "$\\rho_k$", desc: "the autocorrelation at lag $k$: correlation between $\\text{load}_t$ and $\\text{load}_{t-k}$. Near $1$ means strong repetition at that spacing." },
          { sym: "lag $k$", desc: "how many hours back you look; peaks at $k=24$ and $k=168$ reveal the daily and weekly cycles." },
          { sym: "U-shape", desc: "the non-monotonic load-vs-temperature curve — high at both hot and cold extremes, lowest in the mild middle." }
        ],
        steps: [
          { type: "run", label: "▶ Plot autocorrelation & seasonality", result: { log: "autocorrelation peaks at lag 24h (daily), 168h (weekly)\nstrong yearly cycle (summer AC + winter heating)\nload vs temp: U-shaped (high at hot AND cold)\n3 sensor dropouts found (flat-line gaps) -> impute", metrics: [{ k: "daily peak", v: "lag 24h" }, { k: "weekly peak", v: "lag 168h" }] } },
          { type: "decide", prompt: "Load rises at both hot AND cold temperatures. What does that mean for the model?",
            options: [
              { label: "Use temperature linearly", feedback: "a straight line can only slope one way, but the true response slopes up on both sides of mild. A linear term would predict low load on a freezing day — ignoring that everyone turns on the heat. It would systematically under-forecast both extremes, which is where the costly peaks live." },
              { label: "Capture the non-linear U-shape (e.g. cooling-degree and heating-degree terms, or a tree split)", best: true, feedback: "exactly — the relationship is non-monotonic. Either engineer two one-sided features (heating-degrees below a base, cooling-degrees above it) so each gets its own slope, or use a tree that can split temperature in both directions. Both let the model raise its forecast at hot AND cold extremes." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Engineer time features",
        narrative: `<p>Tree and regression models can't see "time" — they see a row of numbers. You must hand them the seasonality explicitly: lagged loads, calendar encodings, and the weather forecast.</p><p>The golden rule governs every choice: each feature must be knowable <i>before</i> the hour you predict. A feature that needs the future is leakage, no matter how predictive it looks offline.</p>`,
        concepts: ["ml-linear-regression", "cls-gradient-boosting", "prob-conditional-expectation"],
        insight: `<b>Lags carry the level; calendar carries the shape.</b> The 168-hour lag (same hour last week) alone gets MAPE down to about <b>7.6%</b> — that's your baseline. Adding hour-of-day, weekday, holiday, and the temperature forecast on top cuts another ~3 points. But the 1-hour lag, tempting because $\\rho=0.97$, is <b>illegal</b>: for a day-ahead forecast you won't have last hour's actual load.`,
        data: {
          caption: "One engineered feature row for a target hour (all columns known a day ahead)",
          columns: ["lag24 (MW)", "lag168 (MW)", "roll7d mean", "hour", "fcst temp °C"],
          rows: [
            ["18,200", "18,640", "13,900", "18", "26.4"],
            ["7,480", "7,540", "13,750", "3", "16.0"],
            ["12,050", "14,300", "13,800", "14", "29.1"]
          ],
          note: `Each row predicts one future hour. <b>lag24</b> and <b>lag168</b> are past actual loads (known); <b>fcst temp</b> is the weather forecast (known a day ahead). No column requires data from the target hour itself — that's what keeps it leak-free.`
        },
        symbols: [
          { sym: "lag$_k$", desc: "$\\text{load}_{t-k}$, the actual load $k$ hours before the target hour; legal only if $t-k$ is in the past at scoring time." },
          { sym: "roll7d", desc: "the rolling 7-day mean of load ending before the target hour — a smooth estimate of the current demand level." },
          { sym: "fcst temp", desc: "the forecasted temperature for the target hour, supplied by the weather feed a day ahead (not the realized temperature)." }
        ],
        steps: [{
          type: "decide", prompt: "Which feature set is both useful AND leak-free for a day-ahead forecast?",
          options: [
            { label: "Load at lag 24h/48h/168h, rolling 7-day mean, hour-of-day, weekday, holiday flag, forecast temperature", best: true, feedback: "every one of these is knowable at forecast time. Past load lags and the rolling mean carry the level; calendar encodings carry the daily/weekly shape; the temperature forecast is the weather you'd actually have. Together they encode all the seasonality you found without ever peeking ahead." },
            { label: "Load at lag 1h", feedback: "for a day-ahead forecast you're standing 24+ hours before the target, so last hour's actual load doesn't exist yet. Despite its sky-high autocorrelation, it's unavailable at scoring time — pure look-ahead leakage that inflates your backtest and dies in production." },
            { label: "The true temperature measured during the target hour", feedback: "you only ever have the weather forecast a day ahead, never the realized temperature. Training on the actual gives the model information it won't have at scoring time, so offline scores soar and live accuracy crashes. Use the forecast temperature instead." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Baseline first, then model",
        narrative: `<p>Never ship a fancy model without beating a dumb one. A seasonal-naive baseline — "load equals the same hour last week" — is shockingly hard to beat, because it captures the daily and weekly cycles for free.</p><p>The baseline does two jobs: it defines what "good enough" means, and it tells you whether your model's complexity is buying any real accuracy.</p>`,
        concepts: ["mod-timeseries", "cls-gradient-boosting", "ml-regression-metrics"],
        insight: `<b>Boosted trees fit the non-linear interactions a line can't.</b> The hot-weekday-evening peak is an interaction of three features (hour × weekday × temperature). A linear model would need every cross-term hand-built; gradient-boosted trees discover them automatically through splits. Expect them to cut the <b>7.6% seasonal-naive MAPE to about 4.2%</b> — a 45% relative reduction — while a flat linear trend would <i>lose</i> to naive.`,
        symbols: [
          { sym: "MAPE", desc: "Mean Absolute Percentage Error: the average of $|y-\\hat{y}|/y$ over all hours — a scale-free accuracy score where lower is better." },
          { sym: "$\\hat{y}_t$", desc: "the model's predicted load for hour $t$; the baseline sets $\\hat{y}_t=\\text{load}_{t-168}$ (same hour last week)." },
          { sym: "seasonal-naive", desc: "the baseline forecaster that copies the value from one season ago — here, 168 hours back." }
        ],
        steps: [{
          type: "decide", prompt: "What is the right first move?",
          options: [
            { label: "Set a seasonal-naive baseline (load = same hour last week), then try gradient-boosted trees on the features", best: true, feedback: "the baseline defines the bar you must clear — without it, a 4% MAPE is meaningless. Boosted trees then handle the non-linear weather and calendar interactions (hot-weekday-evening peaks) that a line can't, and you measure real lift over naive fold by fold." },
            { label: "Jump straight to a large transformer", feedback: "premature and unmeasurable. Without a baseline you can't tell whether the transformer's complexity buys anything — and on this much structure and this little data, a heavy sequence model can easily lose to seasonal-naive while costing far more to serve." },
            { label: "Fit a flat linear trend only", feedback: "a single trend line ignores the dominant daily and weekly cycles, which carry most of the variance. It would badly underfit — predicting roughly the same load at 4am and 6pm — and lose to the seasonal-naive baseline." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train with backtesting",
        narrative: `<p>You must validate the way you'll deploy: train on the past, test on the future. A random shuffle would scatter future hours into the training fold and let neighbors leak across the split, inflating your score by points.</p><p>Rolling-origin backtesting walks a window forward through time, so every test point is strictly later than its training data — the only honest estimate of forecast skill.</p>`,
        concepts: ["mlx-cross-validation", "cls-gradient-boosting", "ml-gradient-descent"],
        insight: `<b>Honest backtesting costs you accuracy on paper — and that's the point.</b> A random k-fold split here reports a flattering MAPE because each test hour sits between training hours that nearly give away the answer. The walk-forward MAPE of <b>4.2%</b> is a couple points worse than the leaky number but is the one that survives deployment. The model beats the 7.6% baseline on all 12 folds, so the lift is robust, not a fluke of one split.`,
        data: {
          caption: "Rolling-origin backtest: train always precedes test",
          columns: ["fold", "train window", "test window", "MAPE"],
          rows: [
            ["1", "months 1–12", "month 13", "4.8%"],
            ["6", "months 1–17", "month 18", "4.1%"],
            ["12", "months 1–23", "month 24", "3.9%"],
            ["naive", "(same hour last week)", "all folds", "7.6%"]
          ],
          note: `The train window grows and the test window walks forward — test is always in the strict future of train. Averaging across folds gives the honest 4.2% MAPE the model ships on.`
        },
        symbols: [
          { sym: "fold", desc: "one train/test split in the backtest; later folds train on more history and test on a later month." },
          { sym: "rolling-origin", desc: "the validation scheme where the train/test boundary (origin) slides forward in time, never letting test precede train." },
          { sym: "$\\bar{\\text{MAPE}}$", desc: "the mean MAPE across all folds — the single number summarizing out-of-sample forecast skill." }
        ],
        steps: [
          { type: "decide", prompt: "How do you split train/validation for a forecaster?",
            options: [
              { label: "Rolling-origin backtest: train on months 1-N, test on month N+1, then walk forward", best: true, feedback: "this respects time order — every test point is strictly in the future of its training data, exactly as production will be. Walking the origin forward also gives you many folds to average, so the skill estimate is stable rather than hostage to one lucky split." },
              { label: "Random k-fold shuffle of all hours", feedback: "shuffling drops future hours into the training fold, and adjacent hours (which are ~97% correlated) leak across the split. The model effectively sees the answer's neighbors, so the reported MAPE is fantasy — it look-ahead-leaks and massively overstates real accuracy." }
            ] },
          { type: "run", label: "▶ Backtest LightGBM (walk-forward)", result: { log: "rolling-origin backtest, 12 folds...\nfold 1  MAPE 4.8%   fold 6  MAPE 4.1%\nfold 12 MAPE 3.9%\nseasonal-naive baseline MAPE: 7.6%\nmodel beats baseline on 12/12 folds", metrics: [{ k: "model MAPE", v: "4.2%" }, { k: "baseline MAPE", v: "7.6%" }],
            chart: {
              type: "line",
              title: "Backtest MAPE per fold: model vs seasonal-naive",
              xlabel: "fold",
              ylabel: "MAPE (%)",
              series: [
                { name: "model", color: "#7ee787", points: [[1, 4.8], [6, 4.1], [12, 3.9]] },
                { name: "seasonal-naive", color: "#ff7b72", points: [[1, 7.6], [6, 7.6], [12, 7.6]] }
              ]
            } } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate accuracy & intervals",
        narrative: `<p>A point forecast isn't enough — purchasers need to know the risk so they can size a safety margin. So you report error metrics AND calibrated prediction intervals: a band that should contain the true load a stated fraction of the time.</p><p>Calibration is the test that matters: a "90% interval" must actually cover the truth about 90% of the time, no more and no less.</p>`,
        concepts: ["ml-regression-metrics", "cls-gaussian-process", "prob-variance"],
        insight: `<b>Peaks are harder, and the interval knows it.</b> Overall MAPE is <b>4.2%</b> but peak-hour MAPE is <b>5.1%</b> — the costly hours are also the noisiest. The 90% prediction interval covers the truth <b>89.4%</b> of the time, essentially nominal, so purchasers can trust the band: roughly 9 in 10 actuals land inside it. Width scales with hour-level variance, so peak intervals are wider exactly where uncertainty is real.`,
        data: {
          caption: "Held-out forecast vs actual, with the 90% interval",
          columns: ["hour", "forecast (MW)", "90% interval", "actual (MW)", "in band?"],
          rows: [
            ["Mon 18:00", "18,500", "[17,400, 19,600]", "18,640", "yes"],
            ["Mon 03:00", "7,560", "[7,100, 8,020]", "7,540", "yes"],
            ["Sat 18:00", "14,200", "[13,000, 15,400]", "15,510", "no"]
          ],
          note: `The interval is wider at the peak (±1,100 MW) than the trough (±460 MW) because peak load is genuinely noisier. Across 8 weeks, 89.4% of actuals fall inside their 90% band — well calibrated.`
        },
        symbols: [
          { sym: "RMSE", desc: "Root Mean Squared Error in MW — penalizes large misses more than small ones, so it spotlights bad peak errors." },
          { sym: "90% interval", desc: "a band $[\\hat{y}-z\\sigma,\\ \\hat{y}+z\\sigma]$ meant to contain the true load 90% of the time; $\\sigma$ is the forecast's standard deviation for that hour." },
          { sym: "coverage", desc: "the empirical fraction of actuals that actually fall inside the interval — should match the nominal level (here 90%)." }
        ],
        steps: [
          { type: "run", label: "▶ Score on held-out future weeks", result: { log: "held-out 8 weeks\nMAPE 4.2%   RMSE 188 MW\npeak-hour MAPE 5.1% (peaks are harder)\n90% prediction interval coverage: 89.4%  (well calibrated)", metrics: [{ k: "MAPE", v: "4.2%" }, { k: "RMSE", v: "188 MW" }, { k: "90% coverage", v: "89%" }],
            chart: {
              type: "line",
              title: "Held-out forecast vs actual load (MW)",
              xlabel: "hour of day",
              ylabel: "load (MW)",
              series: [
                { name: "forecast", color: "#4ea1ff", points: [[3, 7560], [18, 18500], [42, 14200]] },
                { name: "actual", color: "#7ee787", points: [[3, 7540], [18, 18640], [42, 15510]] }
              ]
            } } },
          { type: "decide", prompt: "The 90% interval covers the truth 89% of the time. Is that good?",
            options: [
              { label: "Yes — empirical coverage ≈ nominal 90%, so the intervals are well calibrated", best: true, feedback: "a 90% interval is a promise: it should contain the actual load ~90% of the time. 89.4% is essentially spot-on — neither overconfident (too narrow, under-covering) nor timid (too wide). Purchasers can size their reserve margin off this band and trust it." },
              { label: "No — only point accuracy matters, drop the intervals", feedback: "without intervals, purchasers can't tell whether to hold a 200 MW or a 2,000 MW reserve. Calibrated uncertainty IS the product here: the band is what turns a forecast into a risk-priced purchasing decision." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>Error analysis is where good forecasters are made. You slice the held-out errors by calendar and find the misses aren't random — they cluster on holidays. A holiday Monday looks like a normal Monday to a model that never learned what a holiday is.</p><p>This is a data gap, not a capacity problem: the signal simply isn't in the features yet.</p>`,
        concepts: ["mlx-error-analysis", "ml-bias-variance", "cls-gradient-boosting"],
        insight: `<b>The bias is concentrated, so the fix is targeted.</b> Holidays are <b>~3% of hours but ~22% of total absolute error</b>. On a holiday the model over-predicts by about <b>2,100 MW</b> on average, because it treats the day as a normal weekday. Adding a holiday flag (plus day-before/after flags) closes almost the entire gap — far cheaper and more honest than adding model capacity or widening every interval.`,
        data: {
          caption: "Error sliced by day type reveals a systematic holiday bias",
          columns: ["day type", "share of hours", "mean error (MW)", "MAPE"],
          rows: [
            ["normal weekday", "68%", "+30", "3.8%"],
            ["weekend", "28%", "-90", "4.4%"],
            ["holiday", "3%", "+2,100", "13.1%"],
            ["day after holiday", "1%", "+650", "7.9%"]
          ],
          note: `The model is nearly unbiased on normal days but over-predicts holidays by 2,100 MW because it has never seen a holiday flag. The error is a calendar gap, not noise — so the fix is a feature, not more trees.`
        },
        chart: {
          type: "scatter",
          title: "Residual (forecast minus actual, MW) by day type",
          xlabel: "share of hours (%)",
          groups: [
            { name: "normal weekday", color: "#7ee787", points: [[68, 30]] },
            { name: "weekend", color: "#4ea1ff", points: [[28, -90]] },
            { name: "day after holiday", color: "#ffb454", points: [[1, 650]] },
            { name: "holiday", color: "#ff7b72", points: [[3, 2100]] }
          ]
        },
        symbols: [
          { sym: "bias", desc: "the average signed error $\\overline{(\\hat{y}-y)}$ on a slice; a large positive bias on holidays means systematic over-prediction." },
          { sym: "holiday flag", desc: "a binary feature (1 on public holidays, else 0) that lets the model learn the lower holiday load pattern." },
          { sym: "error share", desc: "the fraction of total absolute error contributed by a slice — concentration here points to where a feature is missing." }
        ],
        steps: [{
          type: "decide", prompt: "Holiday load is systematically over-predicted. Best fix?",
          options: [
            { label: "Add holiday and day-before/after flags (and maybe a school-calendar feature), then retrain", best: true, feedback: "the misses share a single cause the model never saw — a missing calendar feature. Encoding holidays directly gives the trees a split that lowers the holiday forecast, closing a +2,100 MW bias. This is the iterate loop done right: error analysis points at a data gap, you fill it, you retrain." },
            { label: "Add more trees and depth", feedback: "more capacity can't conjure a signal that isn't in the inputs. The model already fits normal days well; the holiday error is bias from a missing feature, not variance from too little capacity. Extra depth would just overfit the normal days." },
            { label: "Widen every prediction interval", feedback: "that hides the bias instead of fixing it. You'd inflate uncertainty on all the well-forecast normal days too, making the whole forecast less useful, while the holiday point estimate stays wrong. Calibration would actually degrade." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy the forecast service",
        narrative: `<p>The forecast feeds the day-ahead purchasing run every morning, so cadence is set by the business, not the model. You also need a plan to keep the model fresh, because load patterns drift as appliances, weather, and the economy change.</p>`,
        concepts: ["mod-timeseries", "ml-regression-metrics"],
        insight: `<b>Cadence follows the decision, freshness follows the drift.</b> Purchasing happens once per day, so a single daily batch emitting the 168-hour curve is enough — real-time inference would be wasted compute. But a frozen model decays roughly <b>0.3 MAPE points per month</b> as patterns shift, so a weekly retrain on the newest data keeps it current at near-zero cost.`,
        symbols: [
          { sym: "batch job", desc: "a scheduled run that produces the full 168-hour forecast at once, rather than serving predictions on live request." },
          { sym: "retrain cadence", desc: "how often the model is refit on fresh data (here weekly) — chosen to outpace the drift rate." },
          { sym: "backtest gate", desc: "a deployment check that blocks release unless the backtest MAPE beats a target (here 5%)." }
        ],
        steps: [
          { type: "decide", prompt: "How should this run in production?",
            options: [
              { label: "Daily batch job that emits the 168-hour curve each morning, with a scheduled weekly retrain on the newest data", best: true, feedback: "forecasts are needed once per purchasing cycle, so a daily batch matches the decision exactly. The weekly retrain keeps the model current with recent weather regimes and demand shifts — frequent enough to track drift, cheap enough to run unattended." },
              { label: "Train once and never retrain", feedback: "load patterns drift continuously — new EV charging, economic swings, a warming climate. A frozen model decays a few tenths of a MAPE point per month until it quietly under-forecasts peaks. You need a retrain cadence to stay calibrated." }
            ] },
          { type: "run", label: "▶ Ship daily forecast pipeline", result: { log: "deploying forecaster v1...\nbacktest gate passed (MAPE 4.2% < 5% target)\nscheduled: daily 06:00 forecast, weekly Sunday retrain\nfirst run emitted 168-hour curve + 90% bands\nlive.", metrics: [{ k: "cadence", v: "daily" }, { k: "retrain", v: "weekly" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain (MLOps)",
        narrative: `<p>Forecasts rot when the world drifts, and the rot is silent unless you watch for it. You track three things as actuals arrive: realized error against the baseline, interval coverage (is the band still honest?), and input health (is the weather feed fresh?).</p><p>Breached thresholds should trigger an automatic retrain — that's what closes the loop.</p>`,
        concepts: ["mlx-error-analysis", "prob-variance", "ml-regression-metrics"],
        insight: `<b>Inputs fail before outputs do.</b> This week a weather-feed latency jump (5 min → 90 min) starved the model of fresh temperature, and rolling 7-day MAPE climbed from <b>4.2% to 6.9%</b> while interval coverage fell to <b>81%</b> — both past their alert thresholds. Watching the <i>input</i> (feed freshness) would have caught it before the <i>output</i> (MAPE) ever moved, which is why you monitor both.`,
        data: {
          caption: "Live monitors and their alert thresholds",
          columns: ["monitor", "healthy", "this week", "alert?"],
          rows: [
            ["rolling 7d MAPE", "< 5.0%", "6.9%", "⚠"],
            ["90% coverage", "85–93%", "81%", "⚠"],
            ["weather feed latency", "< 15 min", "90 min", "⚠"],
            ["input drift (PSI)", "< 0.2", "0.31", "⚠"]
          ],
          note: `Each monitor has a band; a breach fires an alert and, if sustained, an auto-retrain. The root cause here is the stale weather feed — fix the input and the downstream MAPE and coverage recover.`
        },
        symbols: [
          { sym: "rolling MAPE", desc: "MAPE computed over a trailing window (here 7 days) as actuals land — the live analogue of the backtest score." },
          { sym: "PSI", desc: "Population Stability Index: a drift score comparing recent input distributions to training; above ~0.2 signals meaningful shift." },
          { sym: "auto-retrain", desc: "a triggered refit on recent data when a monitor breaches threshold — the mechanism that closes the MLOps loop." }
        ],
        steps: [
          { type: "decide", prompt: "What do you monitor for a live forecaster?",
            options: [
              { label: "Rolling MAPE as actuals land, interval coverage, weather-feed freshness, and input drift — with alerts and an auto-retrain trigger", best: true, feedback: "you track outcomes (rolling error vs baseline), calibration (coverage), and inputs (drift, stale feed) — the full chain from data to decision. Crucially, input monitors fire first, so a breached threshold can trigger a retrain before the forecast actually goes wrong, closing the loop." },
              { label: "Nothing — backtest looked fine", feedback: "a backtest is a snapshot of a world that keeps moving. A heatwave, a broken weather feed, or a demand regime shift will quietly wreck accuracy, and with no monitors you'd only learn from angry purchasers weeks later. Silent decay is guaranteed." }
            ] },
          { type: "run", label: "▶ Check this week's monitors", result: { log: "weather feed latency: 5min -> 90min (provider issue!)\nrolling 7d MAPE: 4.2% -> 6.9%  ALERT\n90% interval coverage dropped to 81%\naction: fail over to backup weather source, trigger retrain on recent data", metrics: [{ k: "rolling MAPE", v: "6.9% ⚠" }, { k: "coverage", v: "81% ⚠" }] }, note: `The loop closes here: monitoring caught a degraded weather feed, which triggers a retrain — back to the <b>Data</b> stage. That's the real job.` }
        ]
      }
    ]
  },
  "game-ai": {
    title: "Game-Playing Agent",
    icon: "🎮",
    goal: "Train an agent to win a two-player board game from scratch — define a reward, generate self-play data, and learn a winning policy.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Frame the problem",
        narrative: `<p>You want an agent that masters a perfect-information board game. The first and most consequential choice is what "good" means — what scalar signal does the agent actually optimize? Get this wrong and the agent will dutifully maximize the wrong thing.</p><p>In a board game the only thing that matters is the final result, so the reward should live at the end of the game, not on every move.</p>`,
        concepts: ["ai-mdp", "ai-policy-value", "aix-game-theory"],
        insight: `<b>Sparse terminal reward beats dense shaped reward here.</b> A naive "capture a piece, get +0.1" reward sounds helpful, but in test games it makes the agent <b>trade material greedily and lose ~20% more often</b> — material is a heuristic that correlates with winning, not winning itself. The honest signal is a single $\\pm1$ at the terminal state; the hard part the agent must solve is credit assignment back through ~38 moves.`,
        data: {
          caption: "A trajectory: states, the chosen action, and the reward (only the last is non-zero)",
          columns: ["ply", "state (board)", "action", "reward $r$"],
          rows: [
            ["1", "opening position", "e2→e4", "0"],
            ["19", "midgame, even material", "knight fork", "0"],
            ["37", "winning attack", "queen→h7", "0"],
            ["38", "checkmate (terminal)", "—", "+1"]
          ],
          note: `Reward is 0 for all 37 non-terminal moves and +1 only at the win. The agent must learn that the ply-37 fork <i>caused</i> the ply-38 win — that backward credit assignment is the whole RL problem.`
        },
        symbols: [
          { sym: "$r_t$", desc: "the reward at step $t$; here $r_t=0$ except at the terminal state, where it is $+1$ (win), $-1$ (loss), or $0$ (draw)." },
          { sym: "terminal state", desc: "the end-of-game position where the outcome is decided and the only non-zero reward is paid." },
          { sym: "credit assignment", desc: "the problem of deciding which earlier moves deserve credit for a reward that arrives only at the end." }
        ],
        steps: [{
          type: "decide", prompt: "How should you define the reward?",
          options: [
            { label: "Reward +1 for a win, -1 for a loss, 0 for a draw — given only at the end of the game", best: true, feedback: "this is the true objective stated exactly. The sparse terminal reward defines winning and nothing else, so the agent can't be fooled into optimizing a proxy. The cost is that it must solve credit assignment — figuring out which of the ~38 moves earned the win — which is precisely what the learning algorithm is for." },
            { label: "Reward the agent for capturing pieces each turn", best: false, feedback: "a tempting shaped reward, but it teaches greedy piece-grabbing. The agent will happily win material and lose the game, because material only correlates with winning. Reward shaping like this introduces a bias that can dominate the true goal — a classic failure mode." },
            { label: "Reward making any legal move", feedback: "this incentivizes nothing useful — every game already consists entirely of legal moves, so the reward is constant and carries zero gradient toward winning. The agent learns to move, not to win." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Generate self-play data",
        narrative: `<p>There's no labeled dataset of "best moves" for a game stronger than humans play. So the agent must generate its own experience by playing itself — the data source <i>is</i> the agent. As it improves, the data improves, in a bootstrapping spiral.</p>`,
        concepts: ["aix-monte-carlo", "ai-q-learning", "ai-mdp"],
        insight: `<b>Self-play scales without a ceiling.</b> 50,000 games yield <b>3.1M (state, action, reward) transitions</b> in hours, all at the agent's current skill level — no human bottleneck. The logs reveal a <b>51.2% first-player win rate</b>, a real first-move edge the agent must learn to exploit, and an average game length of <b>38 plies</b>, which sets how far credit must propagate.`,
        data: {
          caption: "The self-play transition log (one row per move played by either side)",
          columns: ["game", "ply", "state", "action", "final reward"],
          rows: [
            ["1", "1", "s₀ (opening)", "a₁", "+1"],
            ["1", "38", "s₃₇", "a₃₈", "+1"],
            ["2", "1", "s₀ (opening)", "a₇", "-1"],
            ["50000", "12", "midgame s", "a", "0 (draw)"]
          ],
          note: `Each game contributes ~38 rows, all stamped with that game's final reward. 50K games × ~62 transitions ≈ 3.1M training examples — generated entirely by the agent playing itself.`
        },
        symbols: [
          { sym: "$(s,a,r)$", desc: "a transition: the board state $s$, the action $a$ taken, and the game's final reward $r$ propagated back to it." },
          { sym: "self-play", desc: "the data-generation scheme where the current agent plays both sides, producing fresh experience at its own skill level." },
          { sym: "ply", desc: "a single move by one player; a 38-ply game is 19 moves per side." }
        ],
        steps: [
          { type: "decide", prompt: "Where does training data come from?",
            options: [
              { label: "Self-play: the agent plays both sides, logging (state, action, outcome) for every game", best: true, feedback: "self-play generates unlimited fresh experience at exactly the agent's current strength — the engine behind AlphaZero-style training. Because the opponent improves in lockstep, the data never gets stale or too easy, so the agent can bootstrap past any fixed reference, including humans." },
              { label: "Only games scraped from human experts", feedback: "useful as a warm start, but it caps the agent at human strength and is limited in volume — there are only so many master games. To exceed humans you need experience from play stronger than any human, which only self-play can produce." },
              { label: "Random games with random moves", feedback: "fine for the very first batch when the agent knows nothing, but pure random play plateaus fast — there's no strong signal about which moves win. The agent must learn from increasingly skilled play, which is exactly what self-play delivers as it improves." }
            ] },
          { type: "run", label: "▶ Run 50,000 self-play games", prompt: "Generate experience by self-play.",
            result: { log: "spawning self-play workers...\nplayed 50,000 games\nlogged 3.1M (state, action, reward) transitions\nfirst-player win rate: 51.2% (slight first-move edge)\naverage game length: 38 plies", metrics: [{ k: "games", v: "50,000" }, { k: "transitions", v: "3.1M" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore the state space",
        narrative: `<p>Understand how big the problem is before you choose an algorithm. If the game tree is astronomically large, you cannot enumerate it — you must sample and approximate. The branching factor and depth tell you which regime you're in.</p>`,
        concepts: ["ai-tree-search", "ai-minimax", "aix-monte-carlo"],
        insight: `<b>The tree is unenumerable by 40 orders of magnitude.</b> With a branching factor of <b>~31</b> and depth <b>~38</b>, the game has roughly <b>$31^{38}\\approx10^{40}$</b> reachable positions. Enumerating one per nanosecond would still take longer than the age of the universe ($\\sim10^{17}$ s). So exact minimax is off the table; you must sample promising lines (MCTS) and evaluate leaves with a learned value function.`,
        data: {
          caption: "State→value snapshot from the learned evaluator (a tiny sample of $10^{40}$)",
          columns: ["state", "side to move", "value $V(s)$", "interpretation"],
          rows: [
            ["opening s₀", "player 1", "+0.04", "near-even, slight edge"],
            ["material up +3", "player 1", "+0.71", "likely winning"],
            ["king exposed", "player 2", "-0.55", "losing"],
            ["forced mate in 2", "player 1", "+0.98", "all but won"]
          ],
          note: `The value function maps any board to a number in $[-1,+1]$ — the expected game outcome from that position. It lets MCTS judge a leaf without searching all the way to checkmate, which is what makes $10^{40}$ states tractable.`
        },
        symbols: [
          { sym: "$b$", desc: "the branching factor — average number of legal moves per position (here $\\approx31$)." },
          { sym: "$d$", desc: "the typical game depth in plies (here $\\approx38$); the tree size grows like $b^d$." },
          { sym: "$V(s)$", desc: "the value of state $s$: the expected final reward from $s$ under good play, in $[-1,+1]$." }
        ],
        steps: [
          { type: "run", label: "▶ Estimate branching & tree size", result: { log: "avg branching factor: ~31 legal moves\ntypical depth: ~38 plies\nstate-space estimate: ~10^40 positions\nfull minimax tree: intractable to enumerate", metrics: [{ k: "branching", v: "~31" }, { k: "states", v: "~10^40" }] } },
          { type: "decide", prompt: "The tree has ~$10^{40}$ states. How do you search it?",
            options: [
              { label: "Use Monte Carlo Tree Search guided by a learned value/policy, with alpha-beta-style pruning of bad branches", best: true, feedback: "you can't enumerate $10^{40}$ states, so you sample. MCTS spends its simulations on the promising lines the policy suggests, and a learned value function evaluates leaves without playing to the end. Pruning weak branches focuses the budget where it pays — the only tractable approach at this scale." },
              { label: "Enumerate the full minimax tree to the terminal of every game", feedback: "impossible by an enormous margin — $10^{40}$ positions at a nanosecond each is longer than the universe has existed. Exact minimax works for tiny games (tic-tac-toe), but here you have no choice but to approximate by sampling." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Encode the state",
        narrative: `<p>The agent needs a numeric view of the board. A good encoding makes patterns learnable and a bad one hides them. Because board games are spatial, the natural representation is a stack of 2-D planes that a convolutional network can scan for local patterns.</p>`,
        concepts: ["ai-qvalue", "dl-conv", "ai-policy-value"],
        insight: `<b>Spatial planes preserve the structure convolutions need.</b> Encoding the board as a stack of binary planes — one per (piece type × side) — lets a single learned filter detect a threat pattern <b>anywhere on the board</b>, the same way it learns it once and reuses it. A flat integer hash of the board destroys this entirely: two positions differing by one piece get unrelated hashes, so nothing generalizes.`,
        data: {
          caption: "The state tensor: a stack of binary planes (3×3 corner shown)",
          columns: ["plane", "meaning", "row0", "row1", "row2"],
          rows: [
            ["0", "my pawns", "0 1 0", "0 0 0", "1 0 0"],
            ["1", "my king", "0 0 0", "0 1 0", "0 0 0"],
            ["2", "opponent pawns", "0 0 1", "0 0 0", "0 0 0"],
            ["k", "side-to-move (all 1 or 0)", "1 1 1", "1 1 1", "1 1 1"]
          ],
          note: `Each plane is a binary grid marking where one piece type sits. Stacked, they form a (planes × height × width) tensor — the exact shape a conv net consumes, so it can learn position-independent patterns like forks and pins.`
        },
        symbols: [
          { sym: "binary plane", desc: "a board-shaped grid of 0/1 marking the squares occupied by one piece type for one side." },
          { sym: "side-to-move", desc: "an extra constant plane (all 1s or all 0s) telling the net whose turn it is — the position alone is ambiguous without it." },
          { sym: "conv filter", desc: "a small learned kernel slid across the planes; it detects the same local pattern wherever it appears, giving translation invariance." }
        ],
        steps: [{
          type: "decide", prompt: "How should you represent the board state for the network?",
          options: [
            { label: "A stack of binary planes (one per piece type and side) plus side-to-move — fed to a conv net", best: true, feedback: "spatial planes let convolutions detect local patterns — threats, structures, formations — regardless of where they sit on the board, because a filter is shared across positions. This is the standard AlphaZero-style encoding, and the side-to-move plane resolves whose perspective the value is from." },
            { label: "A single integer hash of the whole board", feedback: "a hash destroys all spatial structure: two near-identical positions get completely unrelated numbers, so the net can't generalize from one to the other. You'd be back to a lookup table over $10^{40}$ keys — exactly what you're trying to avoid." },
            { label: "The raw text of the move history as a string", feedback: "the current board is the Markov state — it already contains everything needed to act. A move string is bulky, variable-length, and forces the net to reconstruct the position before it can reason. Feed the position directly." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick the learning method",
        narrative: `<p>You need to learn two things at once: a policy (which move to consider) and a value (who's winning). The method must scale to a $10^{40}$-state space with reward delayed to the very end — which rules out anything that stores a row per state.</p>`,
        concepts: ["mod-actor-critic", "ai-q-learning", "mod-dqn"],
        insight: `<b>Function approximation is mandatory at $10^{40}$ states.</b> A tabular Q-table would need one row per state — impossible. A single actor-critic network instead <i>generalizes</i> across states: the policy head proposes moves, the value head scores positions, and MCTS sharpens both. This shared-trunk design is the AlphaZero recipe, and it's the only family that fits both the scale and the delayed reward.`,
        data: {
          caption: "One training target from a self-play game (what the two heads learn)",
          columns: ["state", "MCTS policy π (top moves)", "value target $z$"],
          rows: [
            ["midgame s", "e5:0.42, Nf3:0.31, d4:0.18", "+1"],
            ["endgame s", "Kg2:0.88, Rh1:0.07", "+1"],
            ["losing s", "resign-ish spread", "-1"]
          ],
          note: `The policy head is trained toward the MCTS visit distribution π (a sharpened version of its own suggestions); the value head is trained toward the game's actual outcome z. One network, two heads, both supervised by self-play.`
        },
        symbols: [
          { sym: "policy head $\\pi$", desc: "the network output giving a probability over legal moves — the actor that proposes what to play." },
          { sym: "value head $V$", desc: "the network output estimating the expected outcome of the position — the critic that judges who's winning." },
          { sym: "$Q(s,a)$", desc: "the value of taking action $a$ in state $s$; tabular Q-learning stores one per (state, action), which is infeasible here." }
        ],
        steps: [{
          type: "decide", prompt: "Which method fits a huge state space with delayed reward?",
          options: [
            { label: "An actor-critic net (policy + value heads) trained by self-play and guided by MCTS", best: true, feedback: "the value head evaluates positions, the policy head proposes moves, and MCTS uses both to search, then feeds sharpened targets back to train them. Because it's a neural net, it generalizes across the $10^{40}$ states instead of memorizing them — this is the AlphaZero recipe, built exactly for scale plus delayed reward." },
            { label: "A lookup table of Q-values, one entry per state", feedback: "tabular Q-learning needs a row per state, which is flatly impossible for $10^{40}$ positions — you could never visit, let alone store, them. The whole reason to use a network is function approximation that generalizes across unseen states." },
            { label: "Supervised classification of expert moves only", feedback: "this caps the agent at human level and ignores the win/loss reward entirely — it learns to imitate, not to win. Self-play RL can discover moves no human plays and surpass the experts; pure imitation never can." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train by self-play RL",
        narrative: `<p>Training is a loop, not a single fit: generate games with the current net, train the net to predict the MCTS move probabilities and the game outcomes, evaluate, and repeat. Each cycle the data gets stronger because the agent generating it got stronger.</p>`,
        concepts: ["ai-q-learning", "mod-actor-critic", "ai-sgd"],
        insight: `<b>Both losses fall and skill rises in lockstep.</b> Across 60 iterations the value loss drops <b>0.61 → 0.28</b> and the policy loss <b>1.42 → 0.74</b>, while win rate climbs from <b>88% to 99% vs random</b> — and, more tellingly, to <b>64% vs the previous best net</b>. Beating random is easy; beating your own prior version is the signal that the loop is actually compounding, which is why a new best is only promoted on that head-to-head.`,
        data: {
          caption: "The self-play RL training loop, iteration by iteration",
          columns: ["iter", "value loss", "policy loss", "vs random", "vs prev-best"],
          rows: [
            ["5", "0.61", "1.42", "88%", "—"],
            ["20", "0.39", "0.98", "99%", "55%"],
            ["60", "0.28", "0.74", "99%+", "64% ✓ promoted"]
          ],
          note: `Each iteration: self-play → train both heads → evaluate. A net is only promoted to "best" when it beats the current best head-to-head (here at iter 60), so the reference opponent keeps getting stronger.`
        },
        symbols: [
          { sym: "value loss", desc: "mean squared error between the value head $V(s)$ and the game outcome $z$ — falling means better position evaluation." },
          { sym: "policy loss", desc: "cross-entropy between the policy head $\\pi$ and the MCTS visit distribution — falling means the net imitates its own search better." },
          { sym: "vs prev-best", desc: "head-to-head win rate against the prior champion net; >50% triggers promotion, proving real improvement." }
        ],
        steps: [{
          type: "run", label: "▶ Train (self-play RL loop)",
          result: { log: "iteration loop: self-play -> train -> evaluate...\niter 5   value loss 0.61  policy loss 1.42  vs-random 88%\niter 20  value loss 0.39  policy loss 0.98  vs-random 99%\niter 60  value loss 0.28  policy loss 0.74  vs-prev-best 64%\nnew best net promoted at iter 60", metrics: [{ k: "iters", v: "60" }, { k: "vs prev-best", v: "64%" }],
            chart: {
              type: "line",
              title: "Self-play training: win rate vs random and losses",
              xlabel: "iteration",
              series: [
                { name: "win % vs random", color: "#7ee787", points: [[5, 88], [20, 99], [60, 99]] },
                { name: "value loss x100", color: "#ff7b72", points: [[5, 61], [20, 39], [60, 28]] },
                { name: "policy loss x100", color: "#ffb454", points: [[5, 142], [20, 98], [60, 74]] }
              ]
            } } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate vs baselines",
        narrative: `<p>Training loss going down isn't proof of skill — a net can minimize loss and still play poorly. The real test is win rate against fixed opponents you didn't train against: a random player (sanity), a classic minimax engine (the real bar), and the previous best net (progress).</p>`,
        concepts: ["ai-minimax", "ai-alpha-beta", "aix-game-theory"],
        insight: `<b>The strong opponent is the only meaningful bar.</b> Beating random <b>99.6%</b> is table stakes — any non-broken agent does that. The number that matters is <b>71% vs a depth-6 alpha-beta engine</b>: a clear, repeatable edge over a strong brute-force searcher means the learned policy found structure that raw search misses, worth about <b>+112 Elo</b> this iteration. No competent opponent gets beaten 100%, so 71% is a strong result, not a failure.`,
        data: {
          caption: "1,000-game match results by opponent",
          columns: ["opponent", "win", "draw", "loss"],
          rows: [
            ["random player", "99.6%", "0.2%", "0.2%"],
            ["depth-6 alpha-beta", "71%", "18%", "11%"],
            ["previous best net", "58%", "—", "42%"]
          ],
          note: `Random is a sanity floor; the alpha-beta engine is the real strength test; the previous best measures iteration-over-iteration progress. Elo gain this round: +112.`
        },
        chart: {
          type: "bars",
          title: "Win rate by opponent (1,000-game match)",
          labels: ["random", "depth-6 alpha-beta", "previous best net"],
          values: [99.6, 71, 58],
          valueLabels: ["99.6%", "71%", "58%"],
          colors: ["#7ee787", "#4ea1ff", "#ffb454"]
        },
        symbols: [
          { sym: "alpha-beta", desc: "a classic minimax search that prunes branches proven worse than an already-found move — a strong fixed baseline opponent." },
          { sym: "depth-6", desc: "the search horizon of that baseline: it looks 6 plies ahead before evaluating, a genuinely tough reference." },
          { sym: "Elo", desc: "a rating scale where a +112 gain means a meaningfully higher expected score against the field." }
        ],
        steps: [
          { type: "run", label: "▶ Play 1,000-game match vs baselines", result: { log: "vs random player:        win 99.6%\nvs depth-6 alpha-beta:   win 71%  draw 18%  loss 11%\nvs previous best net:    win 58%\nElo gain this iter: +112", metrics: [{ k: "vs alpha-beta", v: "71%" }, { k: "Elo gain", v: "+112" }] } },
          { type: "decide", prompt: "It beats random 99.6% but only beats the alpha-beta engine 71%. What's the read?",
            options: [
              { label: "Genuine progress — beating a strong depth-6 search 71% is meaningful; keep iterating to push it higher", best: true, feedback: "beating random is table stakes; the depth-6 alpha-beta engine is the real bar, and a clear 71% edge means the learned policy captured patterns that brute-force search misses. There's headroom to climb, but this is solid evidence the method works, confirmed by the +112 Elo." },
              { label: "It's broken — it should beat alpha-beta 100%", feedback: "no game agent wins every game against a competent opponent — even superhuman engines draw and occasionally lose to strong searchers. Expecting 100% misreads the game; 71% against a serious depth-6 search is a strong, healthy result." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>Error analysis on the eval games shows a pattern: the agent funnels into one favorite opening, and opponents who steer into a specific line punish it. The policy became too narrow — it stopped exploring, so it never learned to handle the lines it avoids.</p>`,
        concepts: ["cls-bandits", "aix-monte-carlo", "mlx-error-analysis"],
        insight: `<b>Narrow data breeds brittle play.</b> The agent plays its top opening in <b>~84% of games</b>, so self-play barely visits the alternatives — and its win rate in those rare lines is a weak <b>~47%</b>. The cure is more exploration in self-play (raise MCTS exploration, add Dirichlet move noise) so the data covers more of the tree. Training longer on the same narrow games would only deepen the overfit.`,
        data: {
          caption: "Opening frequency vs strength reveals the over-exploitation",
          columns: ["opening line", "self-play freq", "win rate", "diagnosis"],
          rows: [
            ["favorite (A)", "84%", "61%", "over-played"],
            ["line B", "9%", "48%", "under-explored"],
            ["line C (the trap)", "3%", "41%", "exploitable"],
            ["other", "4%", "46%", "thin data"]
          ],
          note: `Because self-play rarely leaves opening A, the agent never gathers enough experience in B/C to play them well — and opponents exploit exactly those gaps. More exploration broadens the data and closes the holes.`
        },
        chart: {
          type: "bars",
          title: "Win rate by opening line (%)",
          labels: ["favorite A (84% played)", "line B (9%)", "line C trap (3%)", "other (4%)"],
          values: [61, 48, 41, 46],
          valueLabels: ["61%", "48%", "41%", "46%"],
          colors: ["#7ee787", "#ffb454", "#ff7b72", "#ffb454"]
        },
        symbols: [
          { sym: "exploration", desc: "the share of moves chosen to gather information rather than to win the current game — too little narrows the data." },
          { sym: "Dirichlet noise", desc: "random noise added to the root policy in self-play so the agent occasionally tries non-favorite moves, widening coverage." },
          { sym: "explore/exploit", desc: "the trade-off between trying new lines (explore) and playing the known-best line (exploit); over-exploiting causes brittleness." }
        ],
        steps: [{
          type: "decide", prompt: "The agent overfits to one line and gets exploited. Best fix?",
          options: [
            { label: "Increase exploration in self-play (more MCTS exploration, add move noise) so it sees more of the state space", best: true, feedback: "too little exploration makes the self-play data narrow and the policy brittle — it never learned the lines it avoids. Raising MCTS exploration and adding root noise forces the agent to visit those lines, so the data broadens and the policy generalizes and resists exploitation. This is the explore/exploit trade-off, resolved toward explore." },
            { label: "Train longer on the same narrow self-play games", feedback: "more passes over the same narrow data just deepens the overfit to opening A — it can't teach lines the data barely contains. The fix is more diverse experience, not more epochs over thin experience." },
            { label: "Remove the value head", feedback: "the value head isn't the cause — the problem is data coverage, not position evaluation. Gutting the critic would cripple how MCTS judges leaves and make play uniformly worse, doing nothing about the exploitable opening." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy the agent",
        narrative: `<p>The agent ships into a live game server facing real players on a clock. Inference must fit inside the move time, so you give MCTS a fixed compute budget per move and fall back to the raw policy if the clock runs short — graceful degradation rather than a timeout forfeit.</p>`,
        concepts: ["ai-tree-search", "ai-alpha-beta"],
        insight: `<b>A per-move budget guarantees legal timing AND uses spare time well.</b> With a 1s clock, capping MCTS at a simulation budget yields a <b>median move time of 240ms</b> — comfortably inside the limit — while still searching deeply enough to win <b>82% vs human players</b> in the canary. Searching the full tree every move would simply forfeit on time, so the budget isn't a compromise, it's the only viable plan.`,
        data: {
          caption: "Per-move compute budget vs the clock (canary)",
          columns: ["move type", "MCTS sims", "move time", "within 1s?"],
          rows: [
            ["normal", "800", "240ms", "yes"],
            ["complex midgame", "1,600", "610ms", "yes"],
            ["low clock fallback", "0 (policy top move)", "8ms", "yes"]
          ],
          note: `The agent scales search to the position but caps it at the budget; if the clock is nearly out it plays the policy head's top move instantly. It never times out.`
        },
        symbols: [
          { sym: "simulation budget", desc: "the max number of MCTS rollouts allowed per move — caps compute so the agent always moves in time." },
          { sym: "fallback", desc: "playing the policy head's top move directly when the clock is too low to search — fast, safe degradation." },
          { sym: "move clock", desc: "the per-move time limit imposed by the game server; exceeding it forfeits the game." }
        ],
        steps: [
          { type: "decide", prompt: "How should the agent play moves in production?",
            options: [
              { label: "Run MCTS with a fixed time/simulation budget per move, falling back to the policy net's top move if the clock runs short", best: true, feedback: "a per-move compute budget guarantees the agent always moves within the clock, and search refines the policy's suggestion whenever time allows. If the clock is nearly out it instantly plays the policy's top move — graceful degradation that never forfeits, which is exactly what a live server needs." },
              { label: "Always search the full tree to the end before every move", feedback: "for a $10^{40}$-state game the full search never finishes inside any realistic move clock — the agent would simply run out of time and forfeit every game. You must bound the per-move compute." }
            ] },
          { type: "run", label: "▶ Ship to game server (canary)", result: { log: "deploying agent v1...\ncanary vs 1% of live games\nmedian move time 240ms (budget 1s)\nwin rate vs human players: 82%\npromoting to 100%...\nlive.", metrics: [{ k: "move time", v: "240ms" }, { k: "vs humans", v: "82%" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor exploits & drift",
        narrative: `<p>Live opponents actively probe for weaknesses and share what they find. The signal to watch is a cluster of losses to one repeated pattern — that's not bad luck, it's a discovered exploit. Catching it should trigger targeted self-play that drills exactly that weakness.</p>`,
        concepts: ["mlx-error-analysis", "cls-bandits", "aix-game-theory"],
        insight: `<b>A loss cluster is an exploit fingerprint.</b> Overall win rate slid from <b>82% to 76%</b>, but the damage is concentrated: in the "corner trap" opening the agent wins only <b>41%</b> while playing fine everywhere else. That concentration is the tell — players found and shared a hole. The fix is to inject corner-trap positions into self-play and retrain, the same iterate loop, now driven by live data.`,
        data: {
          caption: "Live losses sliced by opening — the exploit stands out",
          columns: ["opening seen", "games", "win rate", "flag"],
          rows: [
            ["standard lines", "84%", "79%", "ok"],
            ["corner trap", "9%", "41%", "⚠ exploit"],
            ["other", "7%", "74%", "ok"]
          ],
          note: `The overall 76% hides a 41% sinkhole in one line that opponents now steer toward deliberately. Monitoring by opponent pattern surfaces it; an average alone would not.`
        },
        symbols: [
          { sym: "loss cluster", desc: "a group of losses sharing one opening or pattern — evidence of a systematic, exploitable weakness rather than variance." },
          { sym: "exploit", desc: "a repeatable line opponents use to beat the agent; spreads fast as players share it." },
          { sym: "targeted self-play", desc: "self-play seeded with the exploited positions so the agent gathers experience exactly where it's weak." }
        ],
        steps: [
          { type: "decide", prompt: "What should you monitor for a deployed game agent?",
            options: [
              { label: "Live win rate by opponent type, loss clusters by opening/pattern, and move-time budget overruns — with alerts", best: true, feedback: "a cluster of losses to one repeated line means players found an exploit, and slicing by opening surfaces it while the overall average hides it. Watching move-time overruns guards the clock too. A fired alert triggers fresh self-play targeting that exact weakness — the iterate loop, closed by monitoring." },
              { label: "Nothing — it passed the eval match", feedback: "an eval match is a fixed snapshot; live human players adapt, probe, and share exploits within days. An unwatched agent gets farmed by a discovered trap and its win rate quietly bleeds out — silent failure guaranteed." }
            ] },
          { type: "run", label: "▶ Check this week's monitors", result: { log: "overall win rate vs humans: 82% -> 76%\nloss cluster detected: 'corner trap' opening, win rate 41% there  ALERT\nmove-time budget overruns: 0.2%\naction: add corner-trap positions to self-play, retrain", metrics: [{ k: "win rate", v: "76% ⚠" }, { k: "exploit", v: "corner trap" }] }, note: `The loop closes here: monitoring found an exploit, which triggers targeted self-play and retraining — back to the <b>Data</b> stage. That's the real job.` }
        ]
      }
    ]
  },
  "drug-discovery": {
    title: "Virtual Drug Screening",
    icon: "🧬",
    goal: "Screen millions of molecules to find a handful likely to bind a disease target — so chemists only test the most promising in the lab.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Frame the problem",
        narrative: `<p>Lab assays are slow and expensive — you can physically test only a few hundred molecules. So the model's job is not to label the whole library but to <i>rank</i> it, pushing the likely binders to the top so that the small shortlist you actually test is dense with real hits.</p><p>This reframes the goal from "accuracy" to "enrichment at the top", which changes the metric you optimize.</p>`,
        concepts: ["ml-svm", "ml-classification-metrics", "cls-gaussian-process"],
        insight: `<b>Accuracy is a trap when actives are rare.</b> Only about <b>1.5% of molecules are active</b>, so a model that calls <i>everything</i> inactive scores <b>98.5% accuracy</b> and finds zero drugs. What matters is enrichment: if the top 1% of your ranking has an <b>18% hit rate</b>, that's <b>12× better than random</b> — far more binders per precious assay. Rank, don't classify.`,
        data: {
          caption: "Why ranking beats accuracy: the same 240k library, two framings",
          columns: ["framing", "score", "drugs found?"],
          rows: [
            ["call all inactive", "98.5% accuracy", "0 (useless)"],
            ["rank, test top 1%", "18% hit rate", "~440 hits"],
            ["random pick top 1%", "1.5% hit rate", "~36 hits"]
          ],
          note: `High accuracy can mean finding nothing, because the actives are buried in the rare 1.5%. The product is a ranking whose top is enriched — that's the only framing that yields drugs per assay.`
        },
        symbols: [
          { sym: "top-$K$", desc: "the $K$ highest-ranked molecules — the only ones chemists will actually synthesize and assay." },
          { sym: "enrichment", desc: "how many more actives sit in the top-$K$ than you'd get by random picking; the real measure of a screen." },
          { sym: "active", desc: "a molecule that genuinely binds the target (a true hit); actives are the rare positive class (~1.5%)." }
        ],
        steps: [{
          type: "decide", prompt: "What is the right objective for a virtual screen?",
          options: [
            { label: "Rank molecules by predicted activity so the top-K shortlist is enriched with true actives", best: true, feedback: "you can only assay a small shortlist, so the value is concentration at the top: how many real binders land in the molecules you actually test. Optimizing enrichment at top-$K$ matches the real constraint — limited assays — and turns the model into a prioritizer, which is exactly what chemists need." },
            { label: "Maximize plain accuracy over the whole library", best: false, feedback: "actives are ~1.5% of the library, so the trivial 'call everything inactive' model scores 98.5% accuracy and discovers zero drugs. Accuracy rewards the majority class; here the entire point is finding the rare minority, so it's the wrong objective." },
            { label: "Predict the exact binding energy to three decimals", feedback: "over-precise and unnecessary. You don't trust the model to three decimals, and chemists don't need a number — they need a reliable ordering to decide what to synthesize first. Calibrated ranking beats false precision." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather assay data",
        narrative: `<p>You pull historical assay results for this target — molecules labeled active or inactive from past dose-response experiments. Two properties of this data will wreck a naive evaluation if ignored: actives are extremely rare, and the library is full of near-duplicate analogs that can leak across a train/test split.</p>`,
        concepts: ["ml-supervised", "ml-kmeans", "mlx-error-analysis"],
        insight: `<b>Two silent killers live in this data.</b> Actives are only <b>3,604 of 240,118 molecules (1.5%)</b>, so any split must preserve that imbalance and the loss must weight the rare class. Worse, there are <b>12,400 near-duplicate analog pairs</b> — molecules differing by an atom — and if an analog lands in both train and test, the model memorizes rather than generalizes, and your AUC becomes fiction.`,
        data: {
          caption: "The labeled assay table (a molecule per row)",
          columns: ["molecule id", "fingerprint (2048-bit)", "IC50 (nM)", "label"],
          rows: [
            ["CHEMBL-1042", "1010…0110", "38", "active"],
            ["CHEMBL-1043 (analog)", "1010…0100", "51", "active"],
            ["CHEMBL-8819", "0001…1001", "> 10,000", "inactive"],
            ["CHEMBL-7702", "0100…0011", "> 10,000", "inactive"]
          ],
          note: `Labels come from thresholding the IC50 dose-response (active if it binds at low concentration). Note rows 1–2: near-identical fingerprints — analogs that must not be split across train and test, or the score leaks.`
        },
        symbols: [
          { sym: "IC50", desc: "the concentration at which a molecule inhibits the target by 50%; low IC50 means strong binding, so it's thresholded into the active label." },
          { sym: "class imbalance", desc: "the ~1.5% active rate; without class weighting a model just predicts the majority (inactive)." },
          { sym: "analog", desc: "a molecule nearly identical to another (differs by one substructure); analogs across a split cause leakage." }
        ],
        steps: [
          { type: "decide", prompt: "What's the biggest data risk to check first?",
            options: [
              { label: "Severe class imbalance and near-duplicate analog molecules that could leak across splits", best: true, feedback: "actives are under 2% and thousands of molecules are tiny variants of each other. If analogs land in both train and test, the model just recognizes a memorized neighbor and your score is fantasy. Both the imbalance (handle with class weighting) and the analog leakage (handle with scaffold splits) must be addressed up front." },
              { label: "Nothing — assay labels are always clean and balanced", feedback: "assays are noisy (dose-response has measurement error) and overwhelmingly inactive. Assuming clean, balanced data guarantees a misleading evaluation: you'd report a high accuracy that reflects the majority class and leakage, not real discovery." }
            ] },
          { type: "run", label: "▶ Pull assay history", prompt: "Load labeled molecules for the target.",
            result: { log: "querying assay database...\nloaded 240,118 molecules\nactives: 3,604  (1.5%)\nfound 12,400 near-duplicate analog pairs\nlabel source: dose-response IC50 thresholded", metrics: [{ k: "molecules", v: "240k" }, { k: "active rate", v: "1.5%" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore chemical space",
        narrative: `<p>Look at how molecules cluster before you model. Actives often share a common scaffold (a core substructure), and the library is usually dominated by a few chemical families with a vast "dark" region of unexplored chemistry. The shape of this space dictates how you must split your data.</p>`,
        concepts: ["cls-tsne", "ml-pca", "ml-kmeans"],
        insight: `<b>Actives hide in just 2 of 6 scaffold families.</b> A t-SNE of the fingerprints shows <b>6 dense clusters</b>, with the <b>3,604 actives concentrated in only 2</b> of them. This is exactly why a random split lies: with active scaffolds in both train and test, the model memorizes those 2 families and looks brilliant — then fails on any new scaffold. A scaffold split forces it to generalize to chemistry it has never seen.`,
        data: {
          caption: "Scaffold clusters from the t-SNE projection",
          columns: ["cluster", "molecules", "actives", "active rate"],
          rows: [
            ["A (rich)", "31,200", "2,010", "6.4%"],
            ["B (rich)", "24,800", "1,480", "6.0%"],
            ["C–F", "168,000", "60", "0.04%"],
            ["dark region", "16,118", "54", "0.3%"]
          ],
          note: `Almost all actives sit in clusters A and B. If a random split scatters A/B molecules into both train and test, the model just recognizes the family — a scaffold split (whole clusters held out) tests true generalization to new chemistry.`
        },
        chart: {
          type: "bars",
          title: "Active rate by scaffold cluster (%)",
          labels: ["A (rich)", "B (rich)", "C-F", "dark region"],
          values: [6.4, 6.0, 0.04, 0.3],
          valueLabels: ["6.4%", "6.0%", "0.04%", "0.3%"],
          colors: ["#7ee787", "#7ee787", "#4ea1ff", "#c89bff"]
        },
        symbols: [
          { sym: "scaffold", desc: "the shared core substructure of a family of molecules; activity often tracks the scaffold." },
          { sym: "t-SNE", desc: "a non-linear projection that places similar fingerprints near each other in 2-D, revealing clusters." },
          { sym: "scaffold split", desc: "a train/test split that keeps whole scaffold families on one side, so test scaffolds are genuinely unseen." }
        ],
        steps: [
          { type: "run", label: "▶ Cluster & visualize molecules", result: { log: "computed molecular fingerprints\nt-SNE projection: 6 dense scaffold clusters\nactives concentrated in 2 of 6 clusters\nlarge inactive 'dark' region of unexplored chemistry", metrics: [{ k: "clusters", v: "6" }, { k: "active clusters", v: "2" }] } },
          { type: "decide", prompt: "Actives cluster into just 2 scaffolds. What's the validation risk?",
            options: [
              { label: "Random splits leak scaffolds across train/test, so use scaffold-based splits to test true generalization", best: true, feedback: "if the same scaffold appears in both train and test, the model just memorizes the family and your metric measures recall of known chemistry, not discovery. Splitting by whole scaffolds forces the model to predict activity for chemistry it has never seen — the only honest test of whether it can find NEW drug families." },
              { label: "No risk — a random 80/20 split is fine", feedback: "a random split puts analogs of training actives directly into the test set, so the model recognizes near-neighbors and reports an inflated AUC. It hugely overstates how well the model finds new active scaffolds — which is the whole goal of a virtual screen." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Featurize molecules",
        narrative: `<p>A model can't read a chemical formula — you must turn each molecule into numbers that capture what drives binding: its substructures and 3-D shape. The two standard choices are fixed fingerprints (substructure bit-vectors) and learned graph neural nets over the atom-bond graph.</p>`,
        concepts: ["mod-gnn", "ml-svm", "dl-cosine-similarity"],
        insight: `<b>Structure is the signal; weight and string are not.</b> A 2048-bit Morgan fingerprint encodes which substructures are present, and on this data a kernel SVM over fingerprints hits <b>0.83 AUC</b>. Collapsing a molecule to its <b>molecular weight</b> (one number) throws away nearly all structure — many distinct molecules share a weight — and treating the raw SMILES as one categorical token makes every molecule unique, so nothing generalizes.`,
        data: {
          caption: "Three featurizations of the same molecule",
          columns: ["representation", "what it captures", "dims", "useful?"],
          rows: [
            ["Morgan fingerprint", "presence of substructures", "2048", "yes"],
            ["GNN embedding", "learned atom-bond graph", "256", "yes (best)"],
            ["molecular weight", "total mass only", "1", "no"],
            ["SMILES as one token", "opaque identity", "1 category", "no"]
          ],
          note: `Fingerprints and GNN embeddings both encode the structure that drives binding; molecular weight and a single opaque token discard it. Only structure-aware features let the model generalize to new actives.`
        },
        symbols: [
          { sym: "fingerprint", desc: "a fixed-length bit-vector where each bit flags the presence of a particular substructure in the molecule." },
          { sym: "GNN", desc: "a graph neural net that learns a vector for the molecule by passing messages along its atom-bond graph." },
          { sym: "SMILES", desc: "a text string encoding a molecule's structure; useful as input to parse, useless as one opaque category." }
        ],
        steps: [{
          type: "decide", prompt: "How should you represent each molecule?",
          options: [
            { label: "Molecular fingerprints (substructure bit-vectors) and/or a graph neural net over the atom-bond graph", best: true, feedback: "fingerprints explicitly encode which substructures are present, and GNNs learn directly from the atom-bond graph — both capture the structural features that actually drive binding. Either gives the model a representation where similar-acting molecules sit near each other, which is what makes activity predictable." },
            { label: "Just the molecular weight as a single number", feedback: "molecular weight throws away essentially all structure — a binder and a non-binder can have identical weight. With one weak scalar the model can't distinguish actives from inactives; it's far too coarse to predict binding." },
            { label: "The raw SMILES string treated as one categorical token", feedback: "treating the whole molecule as a single opaque category makes every molecule its own unique value, so the model can't share information between similar structures. Nothing generalizes — you'd need to have seen the exact molecule before." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick a model",
        narrative: `<p>You have structured molecular features and a binary active/inactive label, and the active/inactive boundary is non-linear in fingerprint space. Pick a model that separates the classes well — and always anchor it against a cheap baseline so you know the heavy model is actually earning its keep.</p>`,
        concepts: ["ml-svm", "ml-kernels", "mod-gnn"],
        insight: `<b>A kernel buys non-linear separation; a baseline buys honesty.</b> A linear classifier can't carve the curved active region in fingerprint space, but a kernel SVM maps it into a higher-dimensional space where the classes split — reaching <b>0.83 scaffold AUC</b>. Equally important: a dirt-cheap <b>fingerprint similarity search</b> baseline (~0.74 AUC) tells you the SVM's extra 0.09 is real lift, not wishful thinking.`,
        data: {
          caption: "Candidate models and the baseline that grounds them",
          columns: ["model", "handles non-linearity?", "scaffold AUC"],
          rows: [
            ["similarity-search baseline", "weak (nearest neighbor)", "0.74"],
            ["kernel SVM", "yes (kernel trick)", "0.83"],
            ["graph neural net", "yes (learned)", "0.84"],
            ["linear regression on 0/1", "no", "0.66"]
          ],
          note: `The kernel SVM and GNN both clear the similarity baseline by a clear margin — that gap is the evidence the model adds value. Linear regression on a binary label barely beats the baseline and isn't a proper classifier.`
        },
        symbols: [
          { sym: "kernel", desc: "a function that implicitly maps features into a higher-dimensional space where a non-linear boundary becomes linear — the SVM's trick." },
          { sym: "SVM", desc: "Support Vector Machine: finds the maximum-margin separator between classes, optionally in kernel-space." },
          { sym: "similarity baseline", desc: "ranking each candidate by its fingerprint similarity to known actives — a cheap reference the real model must beat." }
        ],
        steps: [{
          type: "decide", prompt: "Choose a first activity model.",
          options: [
            { label: "A kernel SVM (or graph neural net) on the molecular features, with a baseline of fingerprint similarity search", best: true, feedback: "a kernel SVM bends the decision boundary to separate the non-linear active/inactive structure in fingerprint space, and a GNN can do even better by learning the representation. The similarity-search baseline is the crucial control: if the SVM doesn't beat 'just find molecules like known actives', it isn't adding value." },
            { label: "Plain linear regression predicting a 0/1 label", feedback: "linear regression on a binary target fits a line through 0/1 points — it can't capture the non-linear structure-activity relationship and produces unbounded outputs that aren't probabilities. It's not even a proper classifier; use a kernel method or GNN." },
            { label: "A deep transformer with no baseline", feedback: "skipping the cheap similarity-search baseline means you can't tell whether the heavy, expensive model actually helps — it might not beat nearest-neighbor. Always establish the cheap control before paying for complexity." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train with careful splits",
        narrative: `<p>Train on scaffold-split folds with class weighting for the rare actives, and tune regularization in an inner loop. The validation must mimic the real task — predict activity for chemistry the model has never seen — or your reported number will be the leaky one, not the deployable one.</p>`,
        concepts: ["mlx-cross-validation", "ml-svm", "ml-regularization"],
        insight: `<b>The honest split costs ~0.11 AUC — and that's the truth.</b> Scaffold-split 5-fold CV gives a mean <b>ROC-AUC of 0.826</b>; the same model under a random split reports <b>0.94</b>, inflated purely by analog leakage. The 0.83 is the number that predicts real-world enrichment. Class weighting keeps the rare actives from being ignored, and the regularization strength $C$ is tuned by inner CV so the model neither overfits nor underfits the sparse positives.`,
        data: {
          caption: "Scaffold-split 5-fold CV (class-weighted), with the leaky split for contrast",
          columns: ["split type", "fold AUCs", "mean AUC", "honest?"],
          rows: [
            ["scaffold (held-out families)", "0.84 0.81 0.86 0.79 0.83", "0.826", "yes"],
            ["random 80/20", "(analogs leak)", "0.94", "no — inflated"]
          ],
          note: `The 0.11 AUC gap between random and scaffold splits is pure leakage. The scaffold number is what the screen will actually deliver on new chemistry, so it's the one you report and gate on.`
        },
        symbols: [
          { sym: "ROC-AUC", desc: "area under the ROC curve: the probability a random active is ranked above a random inactive; 0.5 is chance, 1.0 is perfect." },
          { sym: "$C$", desc: "the SVM regularization strength — large $C$ fits the training data harder (risk overfit), small $C$ keeps the margin wide; tuned by inner CV." },
          { sym: "class weighting", desc: "up-weighting the rare active class in the loss so the model doesn't trivially predict 'inactive' for everything." }
        ],
        steps: [{
          type: "run", label: "▶ Train (scaffold-split CV)",
          result: { log: "scaffold-split 5-fold CV, class-weighted...\nfold ROC-AUC: 0.84 0.81 0.86 0.79 0.83\nmean ROC-AUC 0.826\nrandom-split AUC (for contrast): 0.94 (inflated by leakage)\nregularization C tuned via inner CV", metrics: [{ k: "scaffold AUC", v: "0.83" }, { k: "folds", v: "5" }],
            chart: {
              type: "line",
              title: "Scaffold-split AUC per fold vs inflated random split",
              xlabel: "fold",
              ylabel: "ROC-AUC",
              series: [
                { name: "scaffold split (honest)", color: "#7ee787", points: [[1, 0.84], [2, 0.81], [3, 0.86], [4, 0.79], [5, 0.83]] },
                { name: "random split (leaky)", color: "#ff7b72", points: [[1, 0.94], [2, 0.94], [3, 0.94], [4, 0.94], [5, 0.94]] }
              ]
            } } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate enrichment",
        narrative: `<p>AUC is a fine summary, but the lab cares about one concrete thing: of the top molecules you'd actually test, how many are real binders? That's the enrichment factor, and it translates directly into assays saved.</p>`,
        concepts: ["ml-classification-metrics", "ml-roc-auc", "mlx-error-analysis"],
        insight: `<b>Enrichment turns AUC into dollars saved.</b> On held-out unseen scaffolds the model scores <b>0.82 AUC</b>, but the number that matters is the <b>top-1% hit rate of 18.4%</b> against a <b>1.5% random base</b> — an <b>enrichment factor of 12.3×</b>. That means a chemist testing your top 1% finds roughly twelve times as many binders per assay as random picking. Enrichment, not overall accuracy, is the screen's value.`,
        data: {
          caption: "Enrichment at the top of the ranking (held-out scaffolds)",
          columns: ["selection", "molecules tested", "hit rate", "enrichment"],
          rows: [
            ["random pick", "1% of library", "1.5%", "1× (base)"],
            ["model top 1%", "1% of library", "18.4%", "12.3×"],
            ["model top 5%", "5% of library", "9.1%", "6.1×"]
          ],
          note: `Enrichment is the ratio of the ranked hit rate to the random base rate. 12.3× at the top 1% means far fewer wasted assays — exactly the lab payoff a virtual screen exists to deliver.`
        },
        chart: {
          type: "bars",
          title: "Hit rate by selection method (%)",
          labels: ["random pick", "model top 5%", "model top 1%"],
          values: [1.5, 9.1, 18.4],
          valueLabels: ["1.5%", "9.1%", "18.4%"],
          colors: ["#ff7b72", "#ffb454", "#7ee787"]
        },
        symbols: [
          { sym: "EF@1%", desc: "Enrichment Factor at 1%: the top-1% hit rate divided by the random hit rate — how many times richer the shortlist is." },
          { sym: "hit rate", desc: "the fraction of tested molecules that turn out to be active; 18% in the top 1% vs 1.5% at random." },
          { sym: "base rate", desc: "the overall active rate in the library (1.5%) — the denominator enrichment is measured against." }
        ],
        steps: [
          { type: "run", label: "▶ Score held-out scaffolds", result: { log: "held-out unseen scaffolds\nROC-AUC 0.82\nrandom hit rate (base): 1.5%\nhit rate in top 1% ranked: 18.4%\nenrichment factor @1%: 12.3x", metrics: [{ k: "ROC-AUC", v: "0.82" }, { k: "EF @1%", v: "12.3x" }, { k: "top-1% hit", v: "18%" }],
            chart: {
              type: "roc",
              title: "ROC on held-out unseen scaffolds",
              auc: 0.82,
              points: [[0, 0], [0.05, 0.34], [0.1, 0.5], [0.2, 0.66], [0.4, 0.83], [0.6, 0.92], [0.8, 0.97], [1, 1]]
            } } },
          { type: "decide", prompt: "Enrichment factor at the top 1% is 12.3x. What does that mean?",
            options: [
              { label: "The shortlist is ~12x richer in actives than random picking — testing the top 1% finds far more binders per assay", best: true, feedback: "enrichment is exactly the value of the screen: an 18% hit rate in the top 1% versus a 1.5% random base is a 12.3× concentration of actives. Chemists waste far fewer of their limited, expensive assays on dead ends — which is the entire reason the model exists." },
              { label: "12.3x means the model is 12x more accurate overall", feedback: "no — enrichment is specifically about how concentrated the actives are at the very top of the ranking, not overall accuracy. The model's overall accuracy is a different (and here misleading) number; enrichment is the metric tied to the lab's actual decision." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>Error analysis shows the model ranks well <i>within</i> the known scaffolds but is blind to the unexplored "dark" chemistry — it keeps re-finding the same two families. To discover genuinely novel drugs you need diverse candidates, which means exploring where the model is uncertain, not exploiting where it's confident.</p>`,
        concepts: ["cls-gaussian-process", "cls-bandits", "mlx-error-analysis"],
        insight: `<b>Exploitation re-finds known families; exploration discovers new ones.</b> The model is confident only inside clusters A and B, and assaying its top picks keeps surfacing analogs of known actives — <b>0 novel scaffolds</b> per round. Active learning flips this: select the molecules where the model is <i>most uncertain</i> (high-variance GP predictions) in the dark region. Each such assay teaches the model the most, and it's what surfaced <b>2 brand-new active scaffolds</b>.`,
        data: {
          caption: "Two selection strategies for the next assay batch",
          columns: ["strategy", "picks from", "novel scaffolds", "info gained"],
          rows: [
            ["exploit (most confident)", "known A/B", "0", "low"],
            ["explore (most uncertain)", "dark region", "2", "high"],
            ["balanced (mix)", "both", "2", "high"]
          ],
          note: `Confident picks keep re-finding the same families; uncertain picks probe new chemistry where each label is most informative. Active learning chooses high-uncertainty molecules precisely to expand into the dark region.`
        },
        symbols: [
          { sym: "active learning", desc: "iteratively choosing which molecules to label next to maximize what the model learns, rather than labeling at random." },
          { sym: "GP variance", desc: "a Gaussian Process's predictive uncertainty; high variance flags molecules in regions the model hasn't learned — the best ones to assay." },
          { sym: "explore vs exploit", desc: "the trade-off between probing uncertain new chemistry (explore) and testing confident known picks (exploit)." }
        ],
        steps: [{
          type: "decide", prompt: "The model only finds known scaffolds. How do you find novel chemistry?",
          options: [
            { label: "Use active-learning: pick molecules where the model is uncertain (high-variance GP predictions) to assay next, expanding into new chemistry", best: true, feedback: "uncertainty-guided selection deliberately probes the dark region instead of exploiting known scaffolds, and each high-variance assay teaches the model the most about chemistry it hasn't seen. This is explore-vs-exploit resolved toward explore — the only way to discover genuinely novel active families." },
            { label: "Only assay the model's most-confident known-scaffold picks", feedback: "that exploits what you already know and keeps re-finding analogs of the same two families. You'd burn assays confirming known chemistry and never discover anything new — the opposite of what a novel-drug program needs." },
            { label: "Add more trees and call it done", feedback: "more model capacity can't find signal in chemistry the training data never covered — there's simply no information about the dark region in the current labels. The fix is new, informative experiments (active learning), not a bigger model." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Hand off candidates",
        narrative: `<p>This model doesn't serve live traffic — its "deployment" is a handoff: a ranked shortlist of molecules for chemists to synthesize and test in the wet lab. The deliverable must be prioritized, diverse, and uncertainty-aware so each precious assay teaches the most.</p>`,
        concepts: ["ml-classification-metrics", "cls-gaussian-process"],
        insight: `<b>A diverse shortlist beats a confident monoculture.</b> Of 240k scored molecules, the handoff is the top <b>240 candidates</b> — but filtered to span <b>5 scaffolds</b>, not 240 analogs of one family. It carries mean predicted activity <b>0.71</b> and flags <b>30 high-uncertainty "explore" picks</b> aimed at the dark region. Dumping all 240k raw scores would be unusable: chemists couldn't tell what to synthesize first, and the diversity that drives discovery would be lost.`,
        data: {
          caption: "The candidate shortlist handed to med-chem",
          columns: ["rank", "molecule", "pred. activity", "uncertainty", "scaffold"],
          rows: [
            ["1", "CHEMBL-1042", "0.94", "low", "A"],
            ["2", "novel-3318", "0.81", "low", "B"],
            ["210", "dark-0091", "0.55", "high ⚑ explore", "new"],
            ["…", "(240 total)", "mean 0.71", "30 flagged", "5 families"]
          ],
          note: `The list is ranked by predicted activity but diversity-filtered across 5 scaffolds, with 30 high-uncertainty "explore" picks marked. That's a usable experiment plan, not a raw dump.`
        },
        symbols: [
          { sym: "diversity filter", desc: "a post-ranking step that drops near-duplicate analogs so the shortlist spans multiple scaffolds instead of one." },
          { sym: "predicted activity", desc: "the model's score in $[0,1]$ for how likely a molecule is to bind — used to rank the shortlist." },
          { sym: "explore pick", desc: "a high-uncertainty candidate included specifically to gather information about unexplored chemistry." }
        ],
        steps: [
          { type: "decide", prompt: "How should you deliver results to the chemistry team?",
            options: [
              { label: "A ranked shortlist with predicted activity, uncertainty, and a diversity filter so picks span multiple scaffolds", best: true, feedback: "chemists need prioritized, diverse, uncertainty-aware candidates — not 200 near-identical analogs. Ranking tells them what to make first, the diversity filter spreads risk across scaffolds, and the uncertainty flags steer some assays toward novel chemistry. This maximizes what each expensive assay teaches." },
              { label: "Dump all 240k scores as a raw file with no ranking", feedback: "that's unusable: the team can't tell which of 240k molecules to synthesize first, and with no diversity filter the top of any naive sort is a pile of analogs. Prioritization and diversity ARE the deliverable — without them the screen's value is lost." }
            ] },
          { type: "run", label: "▶ Export candidate shortlist", result: { log: "ranking full library...\nselected top 240 candidates\ndiversity filter: spans 5 scaffolds\nmean predicted activity 0.71, flagged 30 high-uncertainty 'explore' picks\nhanded off to med-chem team", metrics: [{ k: "candidates", v: "240" }, { k: "scaffolds", v: "5" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor lab feedback",
        narrative: `<p>Weeks later the assay results come back — the most valuable labels you'll ever get, because they're real-world tests of your exact predictions. You compare predicted vs realized hit rate, see which scaffolds confirmed, and fold the new labels (especially the surprises) back into the next active-learning round.</p>`,
        concepts: ["mlx-error-analysis", "ml-classification-metrics", "cls-bandits"],
        insight: `<b>Reality is slightly less rosy — and the explore picks paid off.</b> The model predicted an <b>18% top-1% hit rate</b>; the lab realized <b>14%</b>, a mild optimism worth recalibrating. But the headline is that <b>2 novel active scaffolds</b> were confirmed straight from the high-uncertainty "explore" picks — exactly the discovery the active-learning loop was designed to produce. Those 240 fresh labels feed round 2.`,
        data: {
          caption: "Predicted vs realized, and what the explore picks found",
          columns: ["metric", "predicted", "realized", "read"],
          rows: [
            ["top-1% hit rate", "18%", "14%", "mildly optimistic"],
            ["known scaffolds confirmed", "—", "yes", "model reliable here"],
            ["novel scaffolds found", "(target)", "2", "explore paid off"],
            ["confident picks that failed", "—", "11", "recalibrate"]
          ],
          note: `The 18%→14% gap means recalibrate the confidence, but the 2 confirmed novel scaffolds are the win. All 240 results — hits and misses alike — become training labels for active-learning round 2.`
        },
        symbols: [
          { sym: "realized hit rate", desc: "the actual fraction of shortlisted molecules that the assay confirmed as active — the ground-truth check on the prediction." },
          { sym: "calibration gap", desc: "the difference between predicted and realized hit rate (18% vs 14%) — signals the scores are a touch optimistic." },
          { sym: "new labels", desc: "the fresh assay outcomes (hits and misses) fed back as training data for the next active-learning round." }
        ],
        steps: [
          { type: "decide", prompt: "Assay results arrive. What do you monitor?",
            options: [
              { label: "Realized hit rate vs predicted, which scaffolds confirmed, and where confident picks failed — then fold new labels into a retrain", best: true, feedback: "comparing predicted to realized enrichment validates the model against reality and exposes any optimism to recalibrate. Tracking which scaffolds confirmed and where confident picks failed pinpoints weaknesses, and folding the fresh labels — especially the surprising failures — into a retrain makes the next active-learning round smarter." },
              { label: "Nothing — the shortlist shipped, we're done", feedback: "the assay results are the most valuable labels you'll ever obtain — real experimental ground truth on your exact predictions. Ignoring them wastes the experiment, leaves the model uncalibrated, and stalls the active-learning loop that drives discovery." }
            ] },
          { type: "run", label: "▶ Review assay results", result: { log: "240 candidates assayed\npredicted top-1% hit rate: 18%\nrealized hit rate: 14%  (somewhat optimistic)\n2 novel active scaffolds confirmed from 'explore' picks!\naction: add 240 new labels, retrain with active-learning round 2", metrics: [{ k: "realized hits", v: "14%" }, { k: "new scaffolds", v: "2" }] }, note: `The loop closes here: lab results become new training labels, triggering the next active-learning round — back to the <b>Data</b> stage. That's the real job.` }
        ]
      }
    ]
  },
  "operations-queues": {
    title: "Queue & Staffing Optimizer",
    icon: "📦",
    goal: "Model a call center's random arrivals and service times, forecast load, and choose staffing that keeps waits short without overpaying.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Frame the problem",
        narrative: `<p>A support center pays agents by the hour. Too few agents and callers wait — then abandon, angry; too many and you burn payroll on idle staff. The job is to set staffing <i>per hour</i> so you hit a wait-time promise at the lowest cost.</p><p>That makes it a constrained optimization: minimize cost subject to a service-level constraint, not minimize cost alone (which is zero agents) nor minimize wait alone (which is infinite agents).</p>`,
        concepts: ["prob-expectation", "prob-random-variable", "prob-conditional-expectation"],
        insight: `<b>The cost is non-linear in staffing, so framing matters.</b> Near full utilization, waiting <b>explodes</b>: dropping from 12 to 11 agents at a busy hour can swing average wait from <b>22s to over 90s</b>. So neither "minimize agents" nor "staff for the worst minute" works — you want the cheapest schedule that still answers, say, <b>≥80% of calls within 30s</b>. The constraint is what makes the problem well-posed.`,
        data: {
          caption: "Why the constraint matters: wait vs agents at one busy hour",
          columns: ["agents $c$", "utilization", "avg wait", "meets SL?"],
          rows: [
            ["10", "98%", "240s", "no"],
            ["11", "89%", "92s", "no"],
            ["12", "82%", "22s", "yes"],
            ["16", "61%", "2s", "yes (wasteful)"]
          ],
          note: `Wait collapses sharply once you cross enough agents — and over-staffing buys near-zero extra benefit at high cost. The cheapest $c$ that meets the service level (here 12) is the target the objective must encode.`
        },
        chart: {
          type: "line",
          title: "Average wait vs number of agents c (M/M/c)",
          xlabel: "agents c",
          ylabel: "avg wait (s)",
          series: [
            { name: "avg wait", color: "#ff7b72", points: [[10, 240], [11, 92], [12, 22], [16, 2]] }
          ]
        },
        symbols: [
          { sym: "service level (SL)", desc: "the promise to answer at least a set fraction of calls within a time bound (e.g. 80% within 30s) — the constraint." },
          { sym: "$c$", desc: "the number of agents staffed in an hour — the decision variable you optimize." },
          { sym: "utilization $\\rho$", desc: "the fraction of agent capacity in use; waits blow up as $\\rho\\to1$, which is why the relationship is non-linear." }
        ],
        steps: [{
          type: "decide", prompt: "What is the right objective?",
          options: [
            { label: "Minimize staffing cost subject to a service-level constraint (e.g. ≥80% of calls answered within 30s)", best: true, feedback: "this captures the real trade-off: the cheapest schedule that still keeps the wait-time promise. The constraint anchors the optimization — without it the problem is degenerate — and minimizing cost under it balances payroll against expected wait exactly where the business cares." },
            { label: "Always staff for the worst-case busiest minute of the year", feedback: "that over-staffs 99% of the time — you'd pay for idle agents all day and all night to cover a once-a-year spike. Hugely wasteful, because demand varies enormously by hour and you'd ignore all of it." },
            { label: "Minimize the number of agents, ignoring wait time", feedback: "the unconstrained minimum is zero agents and infinite waits — every caller abandons. Without the service-level constraint the objective collapses to the cheapest possible disaster. You need the wait-time promise in the problem." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather call logs",
        narrative: `<p>You pull timestamped call records: when each call arrived and how long it took to handle. These two streams — arrivals and service times — are the entire raw material for any queue model. Everything downstream (the rate, the distribution fits, the staffing) is derived from them.</p>`,
        concepts: ["prob-sample-space", "prob-random-variable", "prob-pdf-cdf"],
        insight: `<b>Two distributions, not two averages, drive queues.</b> The logs show arrivals peaking <b>10am–2pm</b> and a mean handle time of <b>6.2 min</b> — but with a <b>heavy right tail (max 71 min)</b>. That tail matters: a few very long calls tie up agents and create waits that the mean alone hides. The inter-arrival times look roughly memoryless, a hint the arrivals fit a clean stochastic model.`,
        data: {
          caption: "Raw call log: one row per call (arrivals + handle times)",
          columns: ["call id", "arrival time", "handle time (min)", "agent"],
          rows: [
            ["C-88401", "10:00:04", "5.8", "a17"],
            ["C-88402", "10:00:11", "6.1", "a04"],
            ["C-88403", "10:00:33", "71.0 ⟵ tail", "a22"],
            ["C-88404", "10:00:39", "4.2", "a09"]
          ],
          note: `From these two columns you derive everything: the arrival rate (calls per interval) from the timestamps, and the service-time distribution from the handle times. Note the 71-min outlier — the heavy tail that averages would hide.`
        },
        symbols: [
          { sym: "arrival rate", desc: "calls per unit time (per hour), estimated by counting timestamps in each interval — the queue's input load." },
          { sym: "handle time", desc: "the service duration of a single call; its full distribution (not just the mean) drives waiting." },
          { sym: "inter-arrival time", desc: "the gap between consecutive arrivals; memoryless gaps signal a Poisson arrival process." }
        ],
        steps: [
          { type: "decide", prompt: "What two quantities must you measure from the logs?",
            options: [
              { label: "The arrival rate (calls per interval) and the service-time distribution (handle time per call)", best: true, feedback: "these are the two and only inputs to any queue model: how fast work arrives and how long each job takes. Everything else — expected wait, service level, staffing — is derived from them. Measuring the full service-time distribution (not just its mean) matters because the heavy tail drives waits." },
              { label: "Only the total number of calls in the year", feedback: "a yearly total averages away the hourly peaks and the per-call variability that actually create queues. Two centers with the same annual volume can need wildly different staffing depending on their peaks and tails. You need the rate over time and the service-time distribution." }
            ] },
          { type: "run", label: "▶ Pull 1 year of call logs", prompt: "Load timestamped arrivals and handle times.",
            result: { log: "querying telephony logs...\nloaded 2,184,330 calls\narrivals: strong daily + weekly pattern, peak 10am-2pm\nmean handle time 6.2 min, heavy right tail (max 71 min)\ninter-arrival times roughly memoryless", metrics: [{ k: "calls", v: "2.18M" }, { k: "mean handle", v: "6.2 min" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore arrival patterns",
        narrative: `<p>Check whether arrivals fit a clean stochastic model. If, within an hour, calls arrive independently at a steady rate, then counts are Poisson and gaps are exponential — and the whole toolbox of classic queueing theory applies. So you test that assumption before building on it.</p>`,
        concepts: ["prob-geometric-poisson", "prob-uniform-exponential", "prob-variance"],
        insight: `<b>Mean ≈ variance is the Poisson signature.</b> For per-hour arrival counts the data shows <b>mean ≈ variance</b> (the defining property of a Poisson distribution), and the inter-arrival gaps fit an <b>exponential</b> with an hour-varying rate. A Kolmogorov–Smirnov test fails to reject Poisson arrivals within the hour. Service time, by contrast, is right-skewed and fits a <b>log-normal</b> — together these license an M/M/c-style queue model.`,
        data: {
          caption: "Distribution fits from the logs",
          columns: ["quantity", "fitted dist.", "key check", "verdict"],
          rows: [
            ["hourly arrival count", "Poisson", "mean ≈ variance", "not rejected"],
            ["inter-arrival gap", "Exponential", "memoryless", "good fit"],
            ["handle time", "Log-normal", "right-skewed", "good fit"]
          ],
          note: `Poisson counts + exponential gaps mean arrivals are independent and random at a steady within-hour rate — the exact assumption classic queueing theory needs. The rate itself varies hour to hour, which the next stage forecasts.`
        },
        chart: {
          type: "bars",
          title: "Arrival rate by hour of day (calls/hr)",
          labels: ["3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm", "12am"],
          values: [44, 120, 410, 512, 470, 330, 190, 80],
          colors: ["#4ea1ff", "#4ea1ff", "#ffb454", "#ffb454", "#ffb454", "#ffb454", "#4ea1ff", "#4ea1ff"]
        },
        symbols: [
          { sym: "Poisson", desc: "the count distribution for independent random events in a fixed interval; its defining trait is mean equal to variance." },
          { sym: "exponential", desc: "the memoryless distribution of gaps between Poisson events — the time until the next call doesn't depend on how long you've waited." },
          { sym: "$\\lambda$", desc: "the arrival rate (calls per hour); it parameterizes both the Poisson counts and the exponential gaps." }
        ],
        steps: [
          { type: "run", label: "▶ Fit arrival & service distributions", result: { log: "per-hour arrival counts: mean ≈ variance (Poisson-like)\ninter-arrival times: fit exponential, rate varies by hour\nservice time: right-skewed, fit log-normal\nKolmogorov-Smirnov: Poisson arrivals not rejected within-hour", metrics: [{ k: "arrivals", v: "Poisson" }, { k: "inter-arrival", v: "Exp" }] } },
          { type: "decide", prompt: "Arrival counts have mean ≈ variance and exponential gaps. What model does that suggest?",
            options: [
              { label: "A Poisson arrival process — counts per interval are Poisson and the gaps between calls are exponential", best: true, feedback: "mean ≈ variance and memoryless exponential inter-arrival times are precisely the signature of a Poisson process — the standard model for independent random arrivals. This licenses the M/M/c queue machinery and means you only need the rate $\\lambda$ per hour to characterize arrivals." },
              { label: "Arrivals are perfectly evenly spaced (deterministic)", feedback: "the exponential gaps prove arrivals are random, not clockwork — real gaps vary widely around the mean. A deterministic model would predict no bursts, badly underestimating the queue spikes that randomness creates exactly when several calls happen to clump together." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Engineer load features",
        narrative: `<p>The arrival rate $\\lambda$ isn't constant — it depends on time of day, day of week, and special events. So you build features that let you <i>predict</i> $\\lambda$ for each future hour. That hourly rate forecast is the input the queue model needs to choose staffing ahead of time.</p>`,
        concepts: ["prob-conditional-expectation", "prob-expectation", "ml-linear-regression"],
        insight: `<b>Calendar features predict the rate; a flat average can't.</b> The arrival rate swings from about <b>40 calls/hr at 3am to 520 calls/hr at noon</b> — a 13× range. Hour-of-day, day-of-week, holiday flag, and a recent-volume trend let you forecast $\\lambda$ for each future hour to within <b>~7% MAPE</b>. A single global average rate would understaff every peak and overstaff every night — the worst of both errors.`,
        data: {
          caption: "Feature row predicting the arrival rate $\\lambda$ for a future hour",
          columns: ["hour", "dow", "holiday", "recent trend", "→ predicted λ (calls/hr)"],
          rows: [
            ["12", "Wed", "0", "+3%", "512"],
            ["03", "Wed", "0", "+3%", "44"],
            ["12", "Sun", "0", "-8%", "300"],
            ["12", "Wed", "1", "+3%", "210"]
          ],
          note: `Each row's calendar + trend features map to a predicted arrival rate $\\lambda$. The 12× swing between noon-weekday and 3am is exactly what a single global average would erase — and why these features are essential.`
        },
        symbols: [
          { sym: "$\\lambda(t)$", desc: "the arrival rate predicted for hour $t$ — the per-hour target the feature model forecasts." },
          { sym: "hour-of-day / dow", desc: "calendar features encoding the daily and weekly rhythm that drives call volume." },
          { sym: "recent trend", desc: "a short-window growth signal (e.g. last week's volume change) capturing drift the calendar alone misses." }
        ],
        steps: [{
          type: "decide", prompt: "Which features best predict the hourly arrival rate $\\lambda$?",
          options: [
            { label: "Hour-of-day, day-of-week, holiday flag, and recent call-volume trend", best: true, feedback: "arrival rate is driven by human schedules, so calendar features capture most of the structure, and a recent-volume trend catches drift the calendar misses. Together they forecast $\\lambda$ for each future hour — and that hourly rate is exactly what the queue model consumes to choose staffing ahead of time." },
            { label: "The exact handle time of the next call", feedback: "that's unknown ahead of time and it's about service, not arrivals — it can't help predict how many calls will come. Handle time feeds the service side ($\\mu$) of the model, not the arrival-rate forecast." },
            { label: "A single global average rate for all hours", feedback: "a flat rate erases the 12× swing between the noon peak and the 3am trough. You'd badly understaff midday (long waits, abandonment) and badly overstaff nights (paying idle agents) — both expensive errors the calendar features prevent." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Model the queue",
        narrative: `<p>With Poisson arrivals at rate $\\lambda$, exponential service at rate $\\mu$, and $c$ agents, an M/M/c queue gives you the expected wait and the probability a caller has to wait at all. You tie this to the load forecast: the forecast supplies $\\lambda$, the model converts a staffing level into a predicted wait.</p>`,
        concepts: ["prob-geometric-poisson", "prob-uniform-exponential", "prob-conditional-expectation"],
        insight: `<b>The queue model captures the non-linearity a ratio can't.</b> A flat "X calls per agent" rule fails because waiting explodes as utilization $\\rho=\\lambda/(c\\mu)$ nears 1 — the Erlang-C wait formula is sharply convex. The M/M/c model also captures that even when capacity exceeds the mean load, Poisson <b>bursts</b> still create real queues. Forecast $\\lambda$, set $\\mu$ from handle times, and the model maps each candidate $c$ to a predicted service level.`,
        data: {
          caption: "M/M/c mapping (agents, λ, μ) → wait, at λ=480/hr, μ=10/hr per agent",
          columns: ["agents $c$", "load $\\rho$", "P(wait)", "avg wait"],
          rows: [
            ["50", "0.96", "0.71", "133s"],
            ["52", "0.92", "0.55", "48s"],
            ["55", "0.87", "0.34", "16s"],
            ["60", "0.80", "0.16", "4s"]
          ],
          note: `Each candidate staffing $c$ yields a predicted P(wait) and average wait from the M/M/c formulas. The optimizer searches these rows for the cheapest $c$ meeting the target — impossible with a flat calls-per-agent ratio.`
        },
        chart: {
          type: "line",
          title: "M/M/c wait vs agents at lambda=480/hr",
          xlabel: "agents c",
          ylabel: "avg wait (s)",
          series: [
            { name: "avg wait", color: "#ff7b72", points: [[50, 133], [52, 48], [55, 16], [60, 4]] }
          ]
        },
        symbols: [
          { sym: "M/M/c", desc: "a queue with Markovian (Poisson) arrivals, Markovian (exponential) service, and $c$ servers — the classic multi-agent model." },
          { sym: "$\\mu$", desc: "the service rate per agent (calls completed per hour), the reciprocal of mean handle time." },
          { sym: "$\\rho=\\lambda/(c\\mu)$", desc: "the utilization; waits grow sharply as $\\rho\\to1$, the non-linearity the model captures and a ratio misses." }
        ],
        steps: [{
          type: "decide", prompt: "How do you turn the data into staffing decisions?",
          options: [
            { label: "Forecast $\\lambda$ per hour, then use an M/M/c queue model to map (agents, $\\lambda$, $\\mu$) to expected wait and service level", best: true, feedback: "the forecast supplies the hourly load $\\lambda$, and the queueing model converts any staffing level into a predicted wait and service level via the Erlang-C formulas. That lets you search staffing for the cheapest $c$ that meets the target — connecting the prediction directly to the decision." },
            { label: "Just staff proportional to call volume with a fixed ratio", feedback: "queues are non-linear: waiting explodes as utilization approaches 1, so a flat calls-per-agent ratio that's fine at midday fails catastrophically at peak. The M/M/c model exists precisely because the relationship between load and wait is convex, not linear." },
            { label: "Assume zero wait as long as agents ≥ average calls", feedback: "this ignores randomness. Even when capacity comfortably exceeds the mean load, Poisson bursts cluster calls together and create real queues — which is exactly what M/M/c captures and a mean-based rule cannot." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Fit & calibrate",
        narrative: `<p>Fit the arrival-rate forecaster with time-ordered cross-validation, then plug its forecasts into the M/M/c model and check the predictions against reality. The test that matters: do the model's predicted waits match what actually happened, hour by hour?</p>`,
        concepts: ["ml-linear-regression", "prob-expectation", "mlx-cross-validation"],
        insight: `<b>Both halves validate well, so the chain is trustworthy.</b> The arrival-rate forecaster hits <b>6.8% MAPE</b> under time-ordered CV, and feeding those forecasts into the queue model reproduces actual average waits with <b>$R^2=0.91$</b> — predicted service level lands within <b>±4%</b> of realized. That end-to-end check (forecast → queue → realized wait) is what lets you trust staffing recommendations the model hasn't been tested on.`,
        data: {
          caption: "End-to-end calibration: predicted vs realized, by hour",
          columns: ["hour", "forecast λ", "actual λ", "pred. wait", "actual wait"],
          rows: [
            ["12:00", "512", "498", "21s", "24s"],
            ["03:00", "44", "47", "1s", "1s"],
            ["18:00", "330", "351", "12s", "15s"]
          ],
          note: `The arrival-rate forecast (λ) is close to actual, and the queue model's predicted waits track realized waits (overall R²=0.91). The two-stage pipeline is calibrated end to end before any staffing goes live.`
        },
        symbols: [
          { sym: "time-ordered CV", desc: "cross-validation that always trains on earlier weeks and tests on later ones, so no future data leaks into the rate forecast." },
          { sym: "$R^2$", desc: "the fraction of variance in realized waits explained by predicted waits; 0.91 means the queue model tracks reality closely." },
          { sym: "calibration", desc: "the agreement between predicted and realized service level (here within ±4%) — the end-to-end trust check." }
        ],
        steps: [{
          type: "run", label: "▶ Fit forecaster + calibrate queue model",
          result: { log: "fitting hourly arrival-rate model (time-ordered CV)...\narrival-rate MAPE 6.8%\nplugging forecasts into M/M/c...\npredicted vs actual avg wait: R^2 0.91\nservice-level prediction within ±4% of realized", metrics: [{ k: "rate MAPE", v: "6.8%" }, { k: "wait R²", v: "0.91" }] } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate cost vs wait",
        narrative: `<p>Now search staffing levels per hour and measure the trade-off you actually care about: payroll cost against expected wait and abandonment. The goal is the schedule that meets the service level at the lowest cost — and sometimes reshaping a bad baseline improves <i>both</i> at once.</p>`,
        concepts: ["prob-expectation", "prob-conditional-expectation", "ml-regression-metrics"],
        insight: `<b>Reallocation beats a flat schedule on cost AND wait.</b> The flat baseline wastes agents at night and starves the midday peak: avg wait <b>95s</b> at cost index <b>1.00</b>. The optimized hourly schedule — same total headcount, better placed — cuts avg wait to <b>26s</b> while <i>dropping</i> cost <b>12%</b>, lifting service level <b>71%→83%</b> and halving abandonment <b>9.1%→3.4%</b>. Improving both isn't a bug; it's slack the flat schedule left on the table.`,
        data: {
          caption: "Flat baseline vs optimized hourly staffing",
          columns: ["schedule", "avg wait", "SL <30s", "abandon", "cost index"],
          rows: [
            ["flat baseline", "95s", "71%", "9.1%", "1.00"],
            ["optimized", "26s", "83%", "3.4%", "0.88"],
            ["delta", "−69s", "+12pt", "−5.7pt", "−12%"]
          ],
          note: `The optimizer moves agents from over-staffed quiet hours to under-staffed peaks — same headcount, better placed — so wait and cost both fall. That's only possible because the baseline was badly shaped to begin with.`
        },
        symbols: [
          { sym: "cost index", desc: "total payroll cost normalized to the flat baseline (1.00); 0.88 means 12% cheaper." },
          { sym: "abandonment", desc: "the fraction of callers who hang up before being answered — rises with wait, so cutting wait cuts it." },
          { sym: "SL <30s", desc: "the realized service level: percent of calls answered within 30 seconds, the constraint being met." }
        ],
        steps: [
          { type: "run", label: "▶ Optimize hourly staffing", result: { log: "searching staffing per hour vs cost...\nbaseline (flat staffing): avg wait 95s, cost index 1.00\noptimized: avg wait 26s, cost index 0.88\nservice level (answered <30s): 71% -> 83%\nabandonment rate: 9.1% -> 3.4%", metrics: [{ k: "avg wait", v: "26s" }, { k: "cost", v: "-12%" }, { k: "SL <30s", v: "83%" }],
            chart: {
              type: "bars",
              title: "Flat baseline vs optimized schedule",
              labels: ["wait (s) flat", "wait (s) opt", "cost x100 flat", "cost x100 opt"],
              values: [95, 26, 100, 88],
              valueLabels: ["95s", "26s", "1.00", "0.88"],
              colors: ["#ff7b72", "#7ee787", "#ff7b72", "#7ee787"]
            } } },
          { type: "decide", prompt: "The optimized schedule cuts both wait AND cost. How is that possible?",
            options: [
              { label: "It reallocates agents from over-staffed quiet hours to under-staffed peaks — same headcount, better placed", best: true, feedback: "the flat schedule wasted agents overnight (idle) and starved the midday peak (long waits). Matching staffing to the forecast load moves that wasted capacity to where calls actually are, so wait and cost improve together. There was no real trade-off to make — just a badly-shaped baseline." },
              { label: "It must be a bug — you can't improve wait and cost together", feedback: "not a bug. A poorly-shaped baseline leaves slack on the table — idle agents at 3am buy nothing. Reallocating that same headcount to peak hours raises service while letting you trim total cost. Pareto improvements are exactly what optimization against a weak baseline produces." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>Error analysis on the live results reveals a hidden assumption: the model treated all calls as one type, but premium customers have much longer handle times and a tighter wait target. The blended average satisfies neither group — it over-serves regular calls and misses premium SLAs.</p>`,
        concepts: ["prob-pdf-cdf", "prob-conditional-expectation", "mlx-error-analysis"],
        insight: `<b>One blended distribution hides two very different jobs.</b> Premium calls average <b>14 min</b> handle time with a <b>20s</b> answer target, while regular calls average <b>5 min</b> with a <b>30s</b> target — but the blended model assumes a single <b>6.2 min</b> mean. The result: premium SL sits at a failing <b>68%</b> while regular runs a wasteful <b>91%</b>. Splitting into priority classes, each with its own $\\mu$ and target, lets staffing meet both promises.`,
        data: {
          caption: "Blended model vs the reality of two call classes",
          columns: ["call class", "mean handle", "target", "realized SL", "issue"],
          rows: [
            ["blended (model's view)", "6.2 min", "30s", "83%", "hides both"],
            ["regular", "5 min", "30s", "91%", "over-served"],
            ["premium", "14 min", "20s", "68%", "SLA missed"]
          ],
          note: `The single blended distribution averages a fast regular class and a slow, tightly-targeted premium class into a number that fits neither. Modeling them separately (own μ, own target) is what error analysis prescribes.`
        },
        symbols: [
          { sym: "priority class", desc: "a distinct call segment (premium vs regular) with its own service-time distribution and wait target." },
          { sym: "$\\mu_{\\text{class}}$", desc: "the per-class service rate; premium's lower $\\mu$ (longer calls) demands different staffing than regular's." },
          { sym: "blended mean", desc: "the single averaged handle time (6.2 min) that misrepresents both classes when they differ sharply." }
        ],
        steps: [{
          type: "decide", prompt: "Premium calls take longer and need faster answers. Best fix?",
          options: [
            { label: "Model call types separately (priority classes with their own service-time distributions and targets), then staff for both", best: true, feedback: "a single blended distribution misrepresents both groups — it over-serves the fast regular class while missing the premium SLA. Splitting into priority classes, each with its own $\\mu$ and wait target, lets the queue model and staffing meet each promise. Error analysis on the per-class misses drove exactly this fix." },
            { label: "Keep one average and just add more agents everywhere", feedback: "blunt and expensive: blanket headcount over-serves regular calls (already at 91%) while still mis-timing premium ones, because the blended model can't represent the tighter premium target. The fix is modeling the classes, not brute-forcing the average up." },
            { label: "Ignore premium calls since they're a minority", feedback: "premium has the tightest SLA and the most revenue at stake — ignoring them breaks the very promise that matters most. A minority by count can be the majority by value; you must model them, not drop them." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy the scheduler",
        narrative: `<p>The optimizer publishes staffing recommendations that feed the workforce-scheduling system each week. You decide the cadence and the human oversight: schedules need lead time to assign shifts, and a blind automated plan needs a manager's sign-off before it touches payroll.</p>`,
        concepts: ["prob-expectation", "prob-conditional-expectation"],
        insight: `<b>Weekly cadence with an intraday safety valve.</b> Shifts can't be reassigned minute-by-minute — agents have lives and the WFM system needs lead time — so the optimizer emits a <b>weekly</b> plan for a manager to approve. But a same-day <b>re-forecast</b> handles surprises (a viral outage doubling volume) without waiting a week. The backtest gate (SL 83% > 80% target) and human approval together guard against a bad automated plan going live.`,
        data: {
          caption: "Production cadence and its guardrails",
          columns: ["component", "cadence", "purpose"],
          rows: [
            ["staffing plan", "weekly", "gives WFM lead time to assign shifts"],
            ["re-forecast", "intraday", "catches big same-day surprises"],
            ["manager approval", "per plan", "guards against a bad auto-plan"],
            ["backtest gate", "per release", "blocks if SL < 80% target"]
          ],
          note: `Weekly planning matches how shifts are actually scheduled, the intraday re-forecast adds responsiveness, and human approval plus the backtest gate keep an automated mistake from reaching payroll.`
        },
        symbols: [
          { sym: "batch cadence", desc: "how often the optimizer runs (weekly here) — set by how often staffing decisions can actually change." },
          { sym: "intraday re-forecast", desc: "a same-day rerun of the rate forecast to react to surprises between weekly plans." },
          { sym: "human-in-the-loop", desc: "the manager approval step that reviews the automated plan before it affects real schedules." }
        ],
        steps: [
          { type: "decide", prompt: "How should the optimizer run in production?",
            options: [
              { label: "A weekly batch that emits next week's hourly staffing plan for a manager to approve, with intraday re-forecasts for big surprises", best: true, feedback: "scheduling happens weekly because shifts need lead time to assign, so a weekly plan matches reality. A same-day re-forecast handles surprises like a viral outage spike without waiting, and manager approval guards against a bad automated plan reaching payroll. Cadence, responsiveness, and oversight all covered." },
              { label: "Auto-fire and hire agents minute-by-minute from the raw model output", feedback: "staffing simply can't flex by the minute — agents are people with shifts, and the WFM system needs lead time. Blind minute-by-minute automation off raw model output is also dangerous: one bad forecast would thrash the whole floor. Schedules need lead time and human sign-off." }
            ] },
          { type: "run", label: "▶ Ship weekly scheduler", result: { log: "deploying staffing optimizer v1...\nbacktest gate passed (SL 83% > 80% target)\nscheduled: weekly plan + intraday re-forecast\nfirst plan approved by ops manager\nlive.", metrics: [{ k: "cadence", v: "weekly" }, { k: "SL target", v: "80%" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain (MLOps)",
        narrative: `<p>Call patterns drift — product launches, outages, and seasonality all shift the load. You watch realized service level and arrival-rate forecast error as the week unfolds, plus abandonment and handle-time drift, and you refit when they slip. A breach should trigger a re-forecast and re-optimization before staffing decisions go wrong.</p>`,
        concepts: ["mlx-error-analysis", "prob-variance", "prob-expectation"],
        insight: `<b>A demand shock shows up in the input metric first.</b> A new product launch doubled call volume overnight, so arrival-rate forecast error jumped <b>6.8%→14.2%</b> — the leading indicator — and only then did realized service level fall <b>83%→68%</b> and abandonment climb <b>3.4%→8.9%</b>. Watching the rate error catches the shock before the service level visibly breaks, which is why you alert on inputs as well as outcomes.`,
        data: {
          caption: "Live monitors after a product-launch demand shock",
          columns: ["monitor", "healthy", "this week", "alert?"],
          rows: [
            ["arrival-rate error", "< 9%", "14.2%", "⚠ (leading)"],
            ["service level", "> 80%", "68%", "⚠"],
            ["abandonment", "< 5%", "8.9%", "⚠"],
            ["handle-time drift", "< 10%", "4%", "ok"]
          ],
          note: `The arrival-rate error (an input) breaches before service level (an outcome) fully degrades — the early warning. The fix: refit the forecaster on recent weeks and re-optimize staffing.`
        },
        symbols: [
          { sym: "rate forecast error", desc: "the live MAPE of the arrival-rate forecast — the leading indicator that fires before service level breaks." },
          { sym: "realized SL", desc: "the actual service level achieved this week, compared against the 80% target." },
          { sym: "handle-time drift", desc: "change in the service-time distribution over time; a shift changes $\\mu$ and the required staffing." }
        ],
        steps: [
          { type: "decide", prompt: "What should you monitor for the live scheduler?",
            options: [
              { label: "Realized vs predicted service level and wait, arrival-rate forecast error, abandonment, and handle-time drift — with alerts", best: true, feedback: "you track outcomes (actual SL and wait), inputs (arrival-rate error, handle-time drift), and the downstream effect (abandonment). The input monitors fire first — a rate-error spike warns you before service level visibly breaks — so a breach triggers a refit and re-optimization before staffing decisions go wrong." },
              { label: "Nothing — the backtest met the target", feedback: "a backtest reflects yesterday's demand. A new product launch can double call volume overnight, and with no monitors the forecast quietly under-staffs every peak until callers flood abandonment metrics. Silent drift is guaranteed without live monitoring." }
            ] },
          { type: "run", label: "▶ Check this week's monitors", result: { log: "arrival-rate forecast error: 6.8% -> 14.2%  ALERT\ncause: new product launch spiked call volume\nrealized service level: 83% -> 68%\nabandonment: 3.4% -> 8.9%\naction: refit forecaster on recent weeks, re-optimize staffing", metrics: [{ k: "SL", v: "68% ⚠" }, { k: "rate error", v: "14.2% ⚠" }] }, note: `The loop closes here: monitoring caught a demand shift, which triggers a refit and re-optimization — back to the <b>Data</b> stage. That's the real job.` }
        ]
      }
    ]
  }
});
