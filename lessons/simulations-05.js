/* Mock ML-engineering "lab" scenarios. Merged into window.SIMULATIONS by application id.
   { title, icon, goal, stages:[ { phase, icon, title, narrative(HTML), concepts:[lessonIds],
     steps:[ {type:"decide", prompt, options:[{label, feedback, best?}]} | {type:"run", label, prompt?, result:{log?, metrics?:[{k,v}], note?}} ] } ] } */
window.SIMULATIONS = Object.assign(window.SIMULATIONS || {}, {
  "forecasting-timeseries": {
    title: "Demand Forecasting",
    icon: "📅",
    goal: "Forecast next week's hourly electricity load so the grid buys the right amount of power — not too much, not too little.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Frame the problem",
        narrative: `<p>The utility must commit power purchases a day ahead. Under-buy and you pay brutal spot prices; over-buy and you waste money. You need an hourly load forecast with honest uncertainty.</p>`,
        concepts: ["mod-timeseries", "prob-expectation", "ml-regression-metrics"],
        steps: [{
          type: "decide", prompt: "What is the forecasting target and horizon?",
          options: [
            { label: "Predict the single yearly average load", feedback: "far too coarse — purchasing decisions are hourly and a yearly mean tells you nothing about the 6pm peak." },
            { label: "Predict load (MW) for each of the next 168 hours, as a conditional expectation given history", best: true, feedback: "this matches the decision: an hourly curve a week out. The forecast is $E[\\text{load}_t \\mid \\text{past}]$, and you'll attach intervals later." },
            { label: "Classify each hour as high or low load", feedback: "you lose the magnitude. Purchasers need megawatts, not a coarse label." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather the data",
        narrative: `<p>You pull years of metered load plus the drivers that move it. Time-series data must keep its ordering intact.</p>`,
        concepts: ["ml-supervised", "prob-random-variable", "mod-timeseries"],
        steps: [
          { type: "decide", prompt: "Which extra signals are worth joining to the load history?",
            options: [
              { label: "Weather (temperature), calendar (hour, weekday, holiday), and lagged load", best: true, feedback: "load is driven by heating/cooling and human schedules — these are the real causal drivers and known-ahead calendar features." },
              { label: "Tomorrow's actual metered load", feedback: "that's the answer itself — unavailable at forecast time. Pure look-ahead leakage." },
              { label: "Only the raw timestamp", feedback: "a bare timestamp can't express that 6pm on a hot weekday is a peak. You need engineered drivers." }
            ] },
          { type: "run", label: "▶ Pull 4 years of hourly load", prompt: "Load metered history joined with weather and calendar.",
            result: { log: "querying meter warehouse...\nloaded 35,064 hourly rows x 11 columns\njoined weather (temp, humidity)\njoined calendar (hour, dow, holiday)\ndaily + weekly + yearly seasonality visible in autocorrelation", metrics: [{ k: "rows", v: "35,064" }, { k: "span", v: "4 yrs" }, { k: "features", v: "11" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore seasonality",
        narrative: `<p>Before modeling, find the repeating structure. Load has nested cycles — daily, weekly, and yearly — plus weather shocks.</p>`,
        concepts: ["mod-timeseries", "prob-variance", "mlx-error-analysis"],
        steps: [
          { type: "run", label: "▶ Plot autocorrelation & seasonality", result: { log: "autocorrelation peaks at lag 24h (daily), 168h (weekly)\nstrong yearly cycle (summer AC + winter heating)\nload vs temp: U-shaped (high at hot AND cold)\n3 sensor dropouts found (flat-line gaps) -> impute", metrics: [{ k: "daily peak", v: "lag 24h" }, { k: "weekly peak", v: "lag 168h" }] } },
          { type: "decide", prompt: "Load rises at both hot AND cold temperatures. What does that mean for the model?",
            options: [
              { label: "Use temperature linearly", feedback: "a straight line can't capture a U-shape — it would predict low load on cold days, which is wrong (heating!)." },
              { label: "Capture the non-linear U-shape (e.g. cooling-degree and heating-degree terms, or a tree split)", best: true, feedback: "exactly — the relationship is non-monotonic, so you need non-linear terms or a tree that can split temperature both ways." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Engineer time features",
        narrative: `<p>Tree and regression models can't see "time" — you must hand them lags, calendar encodings, and weather. The golden rule: every feature must be knowable <i>before</i> the hour you predict.</p>`,
        concepts: ["ml-linear-regression", "cls-gradient-boosting", "prob-conditional-expectation"],
        steps: [{
          type: "decide", prompt: "Which feature set is both useful AND leak-free for a day-ahead forecast?",
          options: [
            { label: "Load at lag 24h/48h/168h, rolling 7-day mean, hour-of-day, weekday, holiday flag, forecast temperature", best: true, feedback: "all known at forecast time: past load lags, calendar, and the weather forecast you'd actually have. This encodes seasonality without peeking ahead." },
            { label: "Load at lag 1h", feedback: "for a day-ahead forecast you won't have last hour's actual load yet — it's not available at scoring time. Look-ahead leakage." },
            { label: "The true temperature measured during the target hour", feedback: "you only have the weather forecast a day ahead, not the realized temperature. Using the actual is leakage." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Baseline first, then model",
        narrative: `<p>Never ship a fancy model without beating a dumb one. A seasonal-naive baseline ("same hour last week") is shockingly hard to beat.</p>`,
        concepts: ["mod-timeseries", "cls-gradient-boosting", "ml-regression-metrics"],
        steps: [{
          type: "decide", prompt: "What is the right first move?",
          options: [
            { label: "Set a seasonal-naive baseline (load = same hour last week), then try gradient-boosted trees on the features", best: true, feedback: "the baseline defines 'good enough'. Boosted trees handle the non-linear weather and calendar interactions while you measure real lift over naive." },
            { label: "Jump straight to a large transformer", feedback: "premature. Without a baseline you can't tell if its complexity buys anything, and it may well lose to seasonal-naive." },
            { label: "Fit a flat linear trend only", feedback: "ignores the dominant daily and weekly cycles — it will badly underfit." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train with backtesting",
        narrative: `<p>You must validate the way you'll deploy: train on the past, test on the future. A random shuffle would leak future hours into training and inflate your score.</p>`,
        concepts: ["mlx-cross-validation", "cls-gradient-boosting", "ml-gradient-descent"],
        steps: [
          { type: "decide", prompt: "How do you split train/validation for a forecaster?",
            options: [
              { label: "Rolling-origin backtest: train on months 1-N, test on month N+1, then walk forward", best: true, feedback: "this respects time order — every test point is strictly in the future of its training data. It's the only honest estimate of forecast skill." },
              { label: "Random k-fold shuffle of all hours", feedback: "this puts future hours in the training fold (and neighbors leak across the split). It look-ahead-leaks and massively overstates accuracy." }
            ] },
          { type: "run", label: "▶ Backtest LightGBM (walk-forward)", result: { log: "rolling-origin backtest, 12 folds...\nfold 1  MAPE 4.8%   fold 6  MAPE 4.1%\nfold 12 MAPE 3.9%\nseasonal-naive baseline MAPE: 7.6%\nmodel beats baseline on 12/12 folds", metrics: [{ k: "model MAPE", v: "4.2%" }, { k: "baseline MAPE", v: "7.6%" }] } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate accuracy & intervals",
        narrative: `<p>A point forecast isn't enough — purchasers need to know the risk. Report error metrics AND calibrated prediction intervals.</p>`,
        concepts: ["ml-regression-metrics", "cls-gaussian-process", "prob-variance"],
        steps: [
          { type: "run", label: "▶ Score on held-out future weeks", result: { log: "held-out 8 weeks\nMAPE 4.2%   RMSE 188 MW\npeak-hour MAPE 5.1% (peaks are harder)\n90% prediction interval coverage: 89.4%  (well calibrated)", metrics: [{ k: "MAPE", v: "4.2%" }, { k: "RMSE", v: "188 MW" }, { k: "90% coverage", v: "89%" }] } },
          { type: "decide", prompt: "The 90% interval covers the truth 89% of the time. Is that good?",
            options: [
              { label: "Yes — empirical coverage ≈ nominal 90%, so the intervals are well calibrated", best: true, feedback: "a 90% interval should contain the actual ~90% of the time. 89% is essentially spot-on, so purchasers can trust the risk band." },
              { label: "No — only point accuracy matters, drop the intervals", feedback: "without intervals, purchasers can't size their safety margin. Calibrated uncertainty is the whole point of a forecast." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>Error analysis shows the model badly misses holidays — a holiday Monday looks like a normal Monday to it. How do you fix it?</p>`,
        concepts: ["mlx-error-analysis", "ml-bias-variance", "cls-gradient-boosting"],
        steps: [{
          type: "decide", prompt: "Holiday load is systematically over-predicted. Best fix?",
          options: [
            { label: "Add holiday and day-before/after flags (and maybe a school-calendar feature), then retrain", best: true, feedback: "the misses share a cause the model never saw. Encoding holidays directly closes the gap — this is the iterate loop driven by error analysis." },
            { label: "Add more trees and depth", feedback: "more capacity won't help when the holiday signal simply isn't in the features. That's a data gap, not underfitting." },
            { label: "Widen every prediction interval", feedback: "that hides the bias instead of fixing it — you'd inflate uncertainty on all the normal days too." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy the forecast service",
        narrative: `<p>The forecast feeds the day-ahead purchasing run every morning. Decide the cadence and how the model stays fresh.</p>`,
        concepts: ["mod-timeseries", "ml-regression-metrics"],
        steps: [
          { type: "decide", prompt: "How should this run in production?",
            options: [
              { label: "Daily batch job that emits the 168-hour curve each morning, with a scheduled weekly retrain on the newest data", best: true, feedback: "forecasts are needed once per purchasing cycle, and frequent retraining keeps the model current with recent weather and demand shifts." },
              { label: "Train once and never retrain", feedback: "load patterns drift (new appliances, economic shifts, climate). A frozen model decays — you need a retrain cadence." }
            ] },
          { type: "run", label: "▶ Ship daily forecast pipeline", result: { log: "deploying forecaster v1...\nbacktest gate passed (MAPE 4.2% < 5% target)\nscheduled: daily 06:00 forecast, weekly Sunday retrain\nfirst run emitted 168-hour curve + 90% bands\nlive.", metrics: [{ k: "cadence", v: "daily" }, { k: "retrain", v: "weekly" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain (MLOps)",
        narrative: `<p>Forecasts rot when the world drifts. Watch realized error as actuals arrive, watch input drift, and trigger retrains automatically.</p>`,
        concepts: ["mlx-error-analysis", "prob-variance", "ml-regression-metrics"],
        steps: [
          { type: "decide", prompt: "What do you monitor for a live forecaster?",
            options: [
              { label: "Rolling MAPE as actuals land, interval coverage, weather-feed freshness, and input drift — with alerts and an auto-retrain trigger", best: true, feedback: "track outcomes (rolling error vs baseline), calibration (coverage), and inputs (drift, stale weather feed). Breached thresholds trigger a retrain — closing the loop." },
              { label: "Nothing — backtest looked fine", feedback: "guaranteed silent decay. A heatwave, a broken weather feed, or a demand regime shift will quietly wreck accuracy unwatched." }
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
        narrative: `<p>You want an agent that masters a perfect-information board game. First decide what "good" means — what signal does the agent actually optimize?</p>`,
        concepts: ["ai-mdp", "ai-policy-value", "aix-game-theory"],
        steps: [{
          type: "decide", prompt: "How should you define the reward?",
          options: [
            { label: "Reward +1 for a win, -1 for a loss, 0 for a draw — given only at the end of the game", best: true, feedback: "this is the true objective. The sparse terminal reward defines winning; the agent must learn to assign credit to the moves that led there." },
            { label: "Reward the agent for capturing pieces each turn", best: false, feedback: "a tempting shaped reward, but it can teach greedy piece-grabbing that loses games. Material is a heuristic, not the goal." },
            { label: "Reward making any legal move", feedback: "that incentivizes nothing useful — every game already consists of legal moves. No signal about winning." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Generate self-play data",
        narrative: `<p>There's no labeled dataset of "best moves". The agent must generate its own experience by playing itself — the data source <i>is</i> the agent.</p>`,
        concepts: ["aix-monte-carlo", "ai-q-learning", "ai-mdp"],
        steps: [
          { type: "decide", prompt: "Where does training data come from?",
            options: [
              { label: "Self-play: the agent plays both sides, logging (state, action, outcome) for every game", best: true, feedback: "self-play generates unlimited fresh experience at the agent's current skill level — the engine behind AlphaZero-style training." },
              { label: "Only games scraped from human experts", feedback: "useful for a warm start, but it caps the agent at human play and is limited in volume. Self-play lets it exceed humans." },
              { label: "Random games with random moves", feedback: "fine for the very first batch, but pure noise plateaus fast — the agent must learn from increasingly strong play." }
            ] },
          { type: "run", label: "▶ Run 50,000 self-play games", prompt: "Generate experience by self-play.",
            result: { log: "spawning self-play workers...\nplayed 50,000 games\nlogged 3.1M (state, action, reward) transitions\nfirst-player win rate: 51.2% (slight first-move edge)\naverage game length: 38 plies", metrics: [{ k: "games", v: "50,000" }, { k: "transitions", v: "3.1M" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore the state space",
        narrative: `<p>Understand how big the problem is. If the game tree is astronomically large, you cannot enumerate it — you must approximate.</p>`,
        concepts: ["ai-tree-search", "ai-minimax", "aix-monte-carlo"],
        steps: [
          { type: "run", label: "▶ Estimate branching & tree size", result: { log: "avg branching factor: ~31 legal moves\ntypical depth: ~38 plies\nstate-space estimate: ~10^40 positions\nfull minimax tree: intractable to enumerate", metrics: [{ k: "branching", v: "~31" }, { k: "states", v: "~10^40" }] } },
          { type: "decide", prompt: "The tree has ~$10^{40}$ states. How do you search it?",
            options: [
              { label: "Use Monte Carlo Tree Search guided by a learned value/policy, with alpha-beta-style pruning of bad branches", best: true, feedback: "you can't enumerate $10^{40}$ states. MCTS samples promising lines and a learned value function evaluates leaves without searching to the end." },
              { label: "Enumerate the full minimax tree to the terminal of every game", feedback: "impossible — $10^{40}$ positions would take longer than the age of the universe. You must approximate." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Encode the state",
        narrative: `<p>The agent needs a numeric view of the board. A good state encoding makes patterns learnable.</p>`,
        concepts: ["ai-qvalue", "dl-conv", "ai-policy-value"],
        steps: [{
          type: "decide", prompt: "How should you represent the board state for the network?",
          options: [
            { label: "A stack of binary planes (one per piece type and side) plus side-to-move — fed to a conv net", best: true, feedback: "spatial planes let convolutions detect local patterns (threats, structures) regardless of position — the standard AlphaZero-style encoding." },
            { label: "A single integer hash of the whole board", feedback: "a hash destroys all spatial structure — two near-identical positions get unrelated numbers, so nothing generalizes." },
            { label: "The raw text of the move history as a string", feedback: "the current board is the Markov state; a string of moves is bulky and forces the net to reconstruct the position." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick the learning method",
        narrative: `<p>You need to learn both a policy (which move) and a value (who's winning). Choose the approach that scales to this state space.</p>`,
        concepts: ["mod-actor-critic", "ai-q-learning", "mod-dqn"],
        steps: [{
          type: "decide", prompt: "Which method fits a huge state space with delayed reward?",
          options: [
            { label: "An actor-critic net (policy + value heads) trained by self-play and guided by MCTS", best: true, feedback: "the value head evaluates positions, the policy head suggests moves, and MCTS sharpens both — this is the AlphaZero recipe for large games." },
            { label: "A lookup table of Q-values, one entry per state", feedback: "tabular Q-learning needs a row per state — impossible for $10^{40}$ states. You need function approximation." },
            { label: "Supervised classification of expert moves only", feedback: "caps the agent at human level and ignores the win/loss reward. Self-play RL can surpass humans." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train by self-play RL",
        narrative: `<p>Alternate: generate games with the current net, then train the net to predict MCTS move probabilities and game outcomes. Repeat until it stops improving.</p>`,
        concepts: ["ai-q-learning", "mod-actor-critic", "ai-sgd"],
        steps: [{
          type: "run", label: "▶ Train (self-play RL loop)",
          result: { log: "iteration loop: self-play -> train -> evaluate...\niter 5   value loss 0.61  policy loss 1.42  vs-random 88%\niter 20  value loss 0.39  policy loss 0.98  vs-random 99%\niter 60  value loss 0.28  policy loss 0.74  vs-prev-best 64%\nnew best net promoted at iter 60", metrics: [{ k: "iters", v: "60" }, { k: "vs prev-best", v: "64%" }] } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate vs baselines",
        narrative: `<p>Training loss going down isn't proof of skill. The real test is win rate against fixed opponents — random, a classic minimax engine, and the previous best.</p>`,
        concepts: ["ai-minimax", "ai-alpha-beta", "aix-game-theory"],
        steps: [
          { type: "run", label: "▶ Play 1,000-game match vs baselines", result: { log: "vs random player:        win 99.6%\nvs depth-6 alpha-beta:   win 71%  draw 18%  loss 11%\nvs previous best net:    win 58%\nElo gain this iter: +112", metrics: [{ k: "vs alpha-beta", v: "71%" }, { k: "Elo gain", v: "+112" }] } },
          { type: "decide", prompt: "It beats random 99.6% but only beats the alpha-beta engine 71%. What's the read?",
            options: [
              { label: "Genuine progress — beating a strong depth-6 search 71% is meaningful; keep iterating to push it higher", best: true, feedback: "beating random is table stakes; the alpha-beta engine is the real bar. A clear edge over it shows the policy learned more than brute search, and there's room to climb." },
              { label: "It's broken — it should beat alpha-beta 100%", feedback: "no game agent wins every game against a competent opponent; 71% against a strong searcher is a strong result, not a failure." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>You notice the agent collapses into one opening and loses to opponents who exploit it. The policy got too narrow.</p>`,
        concepts: ["cls-bandits", "aix-monte-carlo", "mlx-error-analysis"],
        steps: [{
          type: "decide", prompt: "The agent overfits to one line and gets exploited. Best fix?",
          options: [
            { label: "Increase exploration in self-play (more MCTS exploration, add move noise) so it sees more of the state space", best: true, feedback: "too little exploration makes self-play data narrow and brittle. More exploration broadens experience so the policy generalizes and resists exploitation — the explore/exploit trade-off." },
            { label: "Train longer on the same narrow self-play games", feedback: "more passes over narrow data just deepens the overfit. The fix is more diverse experience, not more epochs." },
            { label: "Remove the value head", feedback: "the value head isn't the cause; gutting it would cripple position evaluation and make play worse." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy the agent",
        narrative: `<p>The agent ships into a live game server facing real players. Inference must be fast enough to move within the clock, with a search-depth budget per move.</p>`,
        concepts: ["ai-tree-search", "ai-alpha-beta"],
        steps: [
          { type: "decide", prompt: "How should the agent play moves in production?",
            options: [
              { label: "Run MCTS with a fixed time/simulation budget per move, falling back to the policy net's top move if the clock runs short", best: true, feedback: "a per-move compute budget guarantees it moves in time, and the search refines the policy's suggestion when time allows. Graceful degradation under the clock." },
              { label: "Always search the full tree to the end before every move", feedback: "that never finishes within the move clock for a $10^{40}$-state game — it would forfeit on time." }
            ] },
          { type: "run", label: "▶ Ship to game server (canary)", result: { log: "deploying agent v1...\ncanary vs 1% of live games\nmedian move time 240ms (budget 1s)\nwin rate vs human players: 82%\npromoting to 100%...\nlive.", metrics: [{ k: "move time", v: "240ms" }, { k: "vs humans", v: "82%" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor exploits & drift",
        narrative: `<p>Live opponents probe for weaknesses. Watch for systematic losses to a repeated pattern — a sign players found an exploit.</p>`,
        concepts: ["mlx-error-analysis", "cls-bandits", "aix-game-theory"],
        steps: [
          { type: "decide", prompt: "What should you monitor for a deployed game agent?",
            options: [
              { label: "Live win rate by opponent type, loss clusters by opening/pattern, and move-time budget overruns — with alerts", best: true, feedback: "a cluster of losses to one repeated line means players found an exploit. Catching it triggers fresh self-play targeting that weakness — the iterate loop." },
              { label: "Nothing — it passed the eval match", feedback: "guaranteed silent failure. Human players adapt and share exploits; an unwatched agent gets farmed." }
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
        narrative: `<p>Lab assays are slow and expensive — you can only test a few hundred molecules. The model's job is to rank a huge library so the top picks are enriched with real binders.</p>`,
        concepts: ["ml-svm", "ml-classification-metrics", "cls-gaussian-process"],
        steps: [{
          type: "decide", prompt: "What is the right objective for a virtual screen?",
          options: [
            { label: "Rank molecules by predicted activity so the top-K shortlist is enriched with true actives", best: true, feedback: "you can only assay a small shortlist, so what matters is enrichment at the top — how many real binders land in the molecules you actually test." },
            { label: "Maximize plain accuracy over the whole library", best: false, feedback: "actives are a tiny fraction, so calling everything inactive scores high accuracy yet finds zero drugs. Accuracy is the wrong metric here." },
            { label: "Predict the exact binding energy to three decimals", feedback: "over-precise and unnecessary — you need a reliable ranking to prioritize, not a precise number you can't trust yet." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather assay data",
        narrative: `<p>You pull historical assay results for this target — molecules labeled active or inactive. Beware: actives are rare and labels are noisy.</p>`,
        concepts: ["ml-supervised", "ml-kmeans", "mlx-error-analysis"],
        steps: [
          { type: "decide", prompt: "What's the biggest data risk to check first?",
            options: [
              { label: "Severe class imbalance and near-duplicate analog molecules that could leak across splits", best: true, feedback: "actives are <2% and many molecules are tiny variations of each other — if analogs land in both train and test, your score is fantasy. Both must be handled." },
              { label: "Nothing — assay labels are always clean and balanced", feedback: "assays are noisy and overwhelmingly inactive. Assuming clean balanced data guarantees a misleading evaluation." }
            ] },
          { type: "run", label: "▶ Pull assay history", prompt: "Load labeled molecules for the target.",
            result: { log: "querying assay database...\nloaded 240,118 molecules\nactives: 3,604  (1.5%)\nfound 12,400 near-duplicate analog pairs\nlabel source: dose-response IC50 thresholded", metrics: [{ k: "molecules", v: "240k" }, { k: "active rate", v: "1.5%" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore chemical space",
        narrative: `<p>Look at how molecules cluster. Actives often share scaffolds, and the library may be dominated by a few chemical families.</p>`,
        concepts: ["cls-tsne", "ml-pca", "ml-kmeans"],
        steps: [
          { type: "run", label: "▶ Cluster & visualize molecules", result: { log: "computed molecular fingerprints\nt-SNE projection: 6 dense scaffold clusters\nactives concentrated in 2 of 6 clusters\nlarge inactive 'dark' region of unexplored chemistry", metrics: [{ k: "clusters", v: "6" }, { k: "active clusters", v: "2" }] } },
          { type: "decide", prompt: "Actives cluster into just 2 scaffolds. What's the validation risk?",
            options: [
              { label: "Random splits leak scaffolds across train/test, so use scaffold-based splits to test true generalization", best: true, feedback: "if the same scaffold appears in train and test, the model just memorizes families. Splitting by scaffold forces it to generalize to new chemistry — the honest test." },
              { label: "No risk — a random 80/20 split is fine", feedback: "random splits put analogs of training molecules in the test set, hugely overstating how well the model finds NEW active scaffolds." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Featurize molecules",
        narrative: `<p>A model can't read a chemical formula — turn each molecule into numbers. Choose a representation that captures structure.</p>`,
        concepts: ["mod-gnn", "ml-svm", "dl-cosine-similarity"],
        steps: [{
          type: "decide", prompt: "How should you represent each molecule?",
          options: [
            { label: "Molecular fingerprints (substructure bit-vectors) and/or a graph neural net over the atom-bond graph", best: true, feedback: "fingerprints encode which substructures are present, and GNNs learn directly from the atom-bond graph — both capture the structure that drives binding." },
            { label: "Just the molecular weight as a single number", feedback: "molecular weight throws away nearly all structure — many distinct molecules share a weight. Far too weak to predict binding." },
            { label: "The raw SMILES string treated as one categorical token", feedback: "treating the whole molecule as one opaque category means every molecule is unique and nothing generalizes." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick a model",
        narrative: `<p>You have structured molecular features and a binary active/inactive label. Pick a model that separates actives well and handles non-linear structure.</p>`,
        concepts: ["ml-svm", "ml-kernels", "mod-gnn"],
        steps: [{
          type: "decide", prompt: "Choose a first activity model.",
          options: [
            { label: "A kernel SVM (or graph neural net) on the molecular features, with a baseline of fingerprint similarity search", best: true, feedback: "an SVM with a kernel separates non-linear active/inactive boundaries well on fingerprints, and a similarity-search baseline tells you if the model adds real lift." },
            { label: "Plain linear regression predicting a 0/1 label", feedback: "linear regression on a binary target misses non-linear structure-activity relationships and isn't a proper classifier." },
            { label: "A deep transformer with no baseline", feedback: "skipping the cheap similarity-search baseline means you can't tell whether the heavy model actually helps." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train with careful splits",
        narrative: `<p>Train on scaffold-split folds with class weighting for the rare actives. The validation must mimic the real task: predict activity for unseen chemistry.</p>`,
        concepts: ["mlx-cross-validation", "ml-svm", "ml-regularization"],
        steps: [{
          type: "run", label: "▶ Train (scaffold-split CV)",
          result: { log: "scaffold-split 5-fold CV, class-weighted...\nfold ROC-AUC: 0.84 0.81 0.86 0.79 0.83\nmean ROC-AUC 0.826\nrandom-split AUC (for contrast): 0.94 (inflated by leakage)\nregularization C tuned via inner CV", metrics: [{ k: "scaffold AUC", v: "0.83" }, { k: "folds", v: "5" }] } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate enrichment",
        narrative: `<p>AUC is fine, but the lab only cares about one thing: of the top molecules you'd actually test, how many are real binders? Report enrichment.</p>`,
        concepts: ["ml-classification-metrics", "ml-roc-auc", "mlx-error-analysis"],
        steps: [
          { type: "run", label: "▶ Score held-out scaffolds", result: { log: "held-out unseen scaffolds\nROC-AUC 0.82\nrandom hit rate (base): 1.5%\nhit rate in top 1% ranked: 18.4%\nenrichment factor @1%: 12.3x", metrics: [{ k: "ROC-AUC", v: "0.82" }, { k: "EF @1%", v: "12.3x" }, { k: "top-1% hit", v: "18%" }] } },
          { type: "decide", prompt: "Enrichment factor at the top 1% is 12.3x. What does that mean?",
            options: [
              { label: "The shortlist is ~12x richer in actives than random picking — testing the top 1% finds far more binders per assay", best: true, feedback: "enrichment is exactly the value of the screen: 18% hits vs 1.5% random. Chemists waste far fewer assays, which is the whole point." },
              { label: "12.3x means the model is 12x more accurate overall", feedback: "no — enrichment is specifically about how concentrated the actives are at the top of the ranking, not overall accuracy." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>The model ranks well within known scaffolds but fails on the unexplored 'dark' chemistry. You want diverse candidates, not just more of the same.</p>`,
        concepts: ["cls-gaussian-process", "cls-bandits", "mlx-error-analysis"],
        steps: [{
          type: "decide", prompt: "The model only finds known scaffolds. How do you find novel chemistry?",
          options: [
            { label: "Use active-learning: pick molecules where the model is uncertain (high-variance GP predictions) to assay next, expanding into new chemistry", best: true, feedback: "uncertainty-guided selection explores the dark region instead of exploiting known scaffolds — each assay teaches the model the most. Explore vs exploit again." },
            { label: "Only assay the model's most-confident known-scaffold picks", feedback: "that exploits what you already know and never discovers novel chemistry — you'd keep re-finding the same families." },
            { label: "Add more trees and call it done", feedback: "more capacity can't find signal in chemistry the training data never covered. You need new, informative experiments." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Hand off candidates",
        narrative: `<p>This model doesn't serve live traffic — its "deployment" is handing a ranked shortlist to chemists for synthesis and wet-lab testing.</p>`,
        concepts: ["ml-classification-metrics", "cls-gaussian-process"],
        steps: [
          { type: "decide", prompt: "How should you deliver results to the chemistry team?",
            options: [
              { label: "A ranked shortlist with predicted activity, uncertainty, and a diversity filter so picks span multiple scaffolds", best: true, feedback: "chemists need prioritized, diverse, uncertainty-aware candidates — not 200 near-identical analogs. This maximizes what each precious assay teaches." },
              { label: "Dump all 240k scores as a raw file with no ranking", feedback: "that's unusable — the team can't tell which to synthesize first. Prioritization and diversity are the deliverable." }
            ] },
          { type: "run", label: "▶ Export candidate shortlist", result: { log: "ranking full library...\nselected top 240 candidates\ndiversity filter: spans 5 scaffolds\nmean predicted activity 0.71, flagged 30 high-uncertainty 'explore' picks\nhanded off to med-chem team", metrics: [{ k: "candidates", v: "240" }, { k: "scaffolds", v: "5" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor lab feedback",
        narrative: `<p>Weeks later the assay results come back. Compare predicted vs actual hit rate and feed the new labels back to improve the model.</p>`,
        concepts: ["mlx-error-analysis", "ml-classification-metrics", "cls-bandits"],
        steps: [
          { type: "decide", prompt: "Assay results arrive. What do you monitor?",
            options: [
              { label: "Realized hit rate vs predicted, which scaffolds confirmed, and where confident picks failed — then fold new labels into a retrain", best: true, feedback: "comparing predicted to realized enrichment validates the model in the real world, and the fresh assay labels (especially failures) make the next round smarter." },
              { label: "Nothing — the shortlist shipped, we're done", feedback: "the assay results are the most valuable labels you'll ever get. Ignoring them wastes the experiment and stalls improvement." }
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
        narrative: `<p>A support center pays agents by the hour. Too few agents and callers wait (and abandon); too many and you burn payroll. You must set staffing per hour to hit a wait-time target at minimum cost.</p>`,
        concepts: ["prob-expectation", "prob-random-variable", "prob-conditional-expectation"],
        steps: [{
          type: "decide", prompt: "What is the right objective?",
          options: [
            { label: "Minimize staffing cost subject to a service-level constraint (e.g. ≥80% of calls answered within 30s)", best: true, feedback: "this is the real trade-off: the cheapest schedule that still meets the wait-time promise. It balances payroll against expected wait." },
            { label: "Always staff for the worst-case busiest minute of the year", feedback: "wildly over-staffs 99% of the time — you'd pay for idle agents all day to cover a once-a-year spike." },
            { label: "Minimize the number of agents, ignoring wait time", feedback: "the cheapest schedule is zero agents and infinite waits. You need the service-level constraint." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather call logs",
        narrative: `<p>You pull timestamped call records: when each call arrived and how long it took to handle. These reveal the arrival and service patterns.</p>`,
        concepts: ["prob-sample-space", "prob-random-variable", "prob-pdf-cdf"],
        steps: [
          { type: "decide", prompt: "What two quantities must you measure from the logs?",
            options: [
              { label: "The arrival rate (calls per interval) and the service-time distribution (handle time per call)", best: true, feedback: "these are the two inputs to any queue model: how fast work arrives and how long each job takes. Everything else follows from them." },
              { label: "Only the total number of calls in the year", feedback: "a yearly total hides the hourly peaks and the per-call variability that actually drive waiting. You need the distributions." }
            ] },
          { type: "run", label: "▶ Pull 1 year of call logs", prompt: "Load timestamped arrivals and handle times.",
            result: { log: "querying telephony logs...\nloaded 2,184,330 calls\narrivals: strong daily + weekly pattern, peak 10am-2pm\nmean handle time 6.2 min, heavy right tail (max 71 min)\ninter-arrival times roughly memoryless", metrics: [{ k: "calls", v: "2.18M" }, { k: "mean handle", v: "6.2 min" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore arrival patterns",
        narrative: `<p>Check whether arrivals fit a clean stochastic model. If calls arrive independently at a steady rate within an hour, classic queueing theory applies.</p>`,
        concepts: ["prob-geometric-poisson", "prob-uniform-exponential", "prob-variance"],
        steps: [
          { type: "run", label: "▶ Fit arrival & service distributions", result: { log: "per-hour arrival counts: mean ≈ variance (Poisson-like)\ninter-arrival times: fit exponential, rate varies by hour\nservice time: right-skewed, fit log-normal\nKolmogorov-Smirnov: Poisson arrivals not rejected within-hour", metrics: [{ k: "arrivals", v: "Poisson" }, { k: "inter-arrival", v: "Exp" }] } },
          { type: "decide", prompt: "Arrival counts have mean ≈ variance and exponential gaps. What model does that suggest?",
            options: [
              { label: "A Poisson arrival process — counts per interval are Poisson and the gaps between calls are exponential", best: true, feedback: "mean ≈ variance and memoryless inter-arrival times are the signature of a Poisson process, the standard model for independent random arrivals." },
              { label: "Arrivals are perfectly evenly spaced (deterministic)", feedback: "the exponential gaps show arrivals are random, not clockwork. A deterministic model would badly underestimate queue spikes." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Engineer load features",
        narrative: `<p>The arrival rate isn't constant — it depends on time. Build features that let you predict the rate $\\lambda$ for each future hour.</p>`,
        concepts: ["prob-conditional-expectation", "prob-expectation", "ml-linear-regression"],
        steps: [{
          type: "decide", prompt: "Which features best predict the hourly arrival rate $\\lambda$?",
          options: [
            { label: "Hour-of-day, day-of-week, holiday flag, and recent call-volume trend", best: true, feedback: "arrival rate is driven by human schedules — these calendar and trend features let you forecast $\\lambda$ for each future hour, which feeds the queue model." },
            { label: "The exact handle time of the next call", feedback: "that's unknown ahead of time and is about service, not arrivals. It can't be a feature for predicting future load." },
            { label: "A single global average rate for all hours", feedback: "a flat rate ignores the 10am-2pm peak — you'd understaff peaks and overstaff nights." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Model the queue",
        narrative: `<p>With Poisson arrivals at rate $\\lambda$ and exponential service at rate $\\mu$ across $c$ agents, an M/M/c queue gives expected wait and the chance of waiting. Tie it to a load forecast.</p>`,
        concepts: ["prob-geometric-poisson", "prob-uniform-exponential", "prob-conditional-expectation"],
        steps: [{
          type: "decide", prompt: "How do you turn the data into staffing decisions?",
          options: [
            { label: "Forecast $\\lambda$ per hour, then use an M/M/c queue model to map (agents, $\\lambda$, $\\mu$) to expected wait and service level", best: true, feedback: "the forecast supplies the load, and the queueing model converts a staffing level into predicted wait — so you can search for the cheapest staffing that meets the target." },
            { label: "Just staff proportional to call volume with a fixed ratio", feedback: "queues are non-linear — waiting explodes near full utilization, so a flat calls-per-agent ratio fails badly at peak. You need the queue model." },
            { label: "Assume zero wait as long as agents ≥ average calls", feedback: "ignores randomness: even when capacity exceeds the mean, Poisson bursts create real queues. That's exactly what M/M/c captures." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Fit & calibrate",
        narrative: `<p>Fit the arrival-rate forecaster and plug forecasts into the queue model. Validate that predicted waits match what actually happened, hour by hour.</p>`,
        concepts: ["ml-linear-regression", "prob-expectation", "mlx-cross-validation"],
        steps: [{
          type: "run", label: "▶ Fit forecaster + calibrate queue model",
          result: { log: "fitting hourly arrival-rate model (time-ordered CV)...\narrival-rate MAPE 6.8%\nplugging forecasts into M/M/c...\npredicted vs actual avg wait: R^2 0.91\nservice-level prediction within ±4% of realized", metrics: [{ k: "rate MAPE", v: "6.8%" }, { k: "wait R²", v: "0.91" }] } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate cost vs wait",
        narrative: `<p>Now search staffing levels per hour and measure the trade-off: payroll cost against expected wait and abandonment. Find the schedule that meets the service level cheapest.</p>`,
        concepts: ["prob-expectation", "prob-conditional-expectation", "ml-regression-metrics"],
        steps: [
          { type: "run", label: "▶ Optimize hourly staffing", result: { log: "searching staffing per hour vs cost...\nbaseline (flat staffing): avg wait 95s, cost index 1.00\noptimized: avg wait 26s, cost index 0.88\nservice level (answered <30s): 71% -> 83%\nabandonment rate: 9.1% -> 3.4%", metrics: [{ k: "avg wait", v: "26s" }, { k: "cost", v: "-12%" }, { k: "SL <30s", v: "83%" }] } },
          { type: "decide", prompt: "The optimized schedule cuts both wait AND cost. How is that possible?",
            options: [
              { label: "It reallocates agents from over-staffed quiet hours to under-staffed peaks — same headcount, better placed", best: true, feedback: "the flat schedule wasted agents at night and starved the midday peak. Matching staffing to the forecast load fixes both wait and cost at once." },
              { label: "It must be a bug — you can't improve wait and cost together", feedback: "not a bug: a badly-shaped baseline leaves slack on the table. Reallocating to where load actually is improves both." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>The model assumed a single call type, but premium customers have much longer handle times and a tighter wait target. The blended average hides this.</p>`,
        concepts: ["prob-pdf-cdf", "prob-conditional-expectation", "mlx-error-analysis"],
        steps: [{
          type: "decide", prompt: "Premium calls take longer and need faster answers. Best fix?",
          options: [
            { label: "Model call types separately (priority classes with their own service-time distributions and targets), then staff for both", best: true, feedback: "a single blended distribution misrepresents both groups. Splitting into priority classes with their own $\\mu$ and targets lets staffing meet each promise — error analysis drove this." },
            { label: "Keep one average and just add more agents everywhere", feedback: "blunt and expensive — it over-serves regular calls while still mis-timing premium ones. The fix is modeling the classes, not brute headcount." },
            { label: "Ignore premium calls since they're a minority", feedback: "they have the tightest SLA and the most revenue at stake — ignoring them breaks the very promise that matters most." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy the scheduler",
        narrative: `<p>The optimizer publishes staffing recommendations that feed the workforce-scheduling system each week. Decide cadence and human oversight.</p>`,
        concepts: ["prob-expectation", "prob-conditional-expectation"],
        steps: [
          { type: "decide", prompt: "How should the optimizer run in production?",
            options: [
              { label: "A weekly batch that emits next week's hourly staffing plan for a manager to approve, with intraday re-forecasts for big surprises", best: true, feedback: "scheduling happens weekly, but a same-day re-forecast handles surprises (a viral outage spike). Human approval guards against a bad automated plan." },
              { label: "Auto-fire and hire agents minute-by-minute from the raw model output", feedback: "staffing can't flex by the minute and blind automation is dangerous — schedules need lead time and human sign-off." }
            ] },
          { type: "run", label: "▶ Ship weekly scheduler", result: { log: "deploying staffing optimizer v1...\nbacktest gate passed (SL 83% > 80% target)\nscheduled: weekly plan + intraday re-forecast\nfirst plan approved by ops manager\nlive.", metrics: [{ k: "cadence", v: "weekly" }, { k: "SL target", v: "80%" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain (MLOps)",
        narrative: `<p>Call patterns drift — product launches, outages, and seasonality shift the load. Watch realized service level and arrival-rate error, and retrain when they slip.</p>`,
        concepts: ["mlx-error-analysis", "prob-variance", "prob-expectation"],
        steps: [
          { type: "decide", prompt: "What should you monitor for the live scheduler?",
            options: [
              { label: "Realized vs predicted service level and wait, arrival-rate forecast error, abandonment, and handle-time drift — with alerts", best: true, feedback: "track outcomes (actual SL and wait), inputs (rate-forecast error, handle-time drift), and abandonment. A breach triggers a refit before staffing decisions go wrong." },
              { label: "Nothing — the backtest met the target", feedback: "guaranteed silent drift. A new product launch can double call volume overnight; an unwatched forecast will badly understaff." }
            ] },
          { type: "run", label: "▶ Check this week's monitors", result: { log: "arrival-rate forecast error: 6.8% -> 14.2%  ALERT\ncause: new product launch spiked call volume\nrealized service level: 83% -> 68%\nabandonment: 3.4% -> 8.9%\naction: refit forecaster on recent weeks, re-optimize staffing", metrics: [{ k: "SL", v: "68% ⚠" }, { k: "rate error", v: "14.2% ⚠" }] }, note: `The loop closes here: monitoring caught a demand shift, which triggers a refit and re-optimization — back to the <b>Data</b> stage. That's the real job.` }
        ]
      }
    ]
  }
});
