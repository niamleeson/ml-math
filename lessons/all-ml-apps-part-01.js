/* All ML — Part 01 applications (5 each). Loaded after content-part-01.js, before all-ml-register.js. */

/* ---- _apps-part01-A.js ---- */
(window.ALLML_CONTENT["1.1"] = window.ALLML_CONTENT["1.1"] || {}).applications = [
  { title: "Ad click thresholding", background: "<p>Campaign systems often start with threshold rules because they are easy to audit before richer ranking models are trusted.</p>", numbers: "<p>For scores $x=\{1,2,3,4,5\}$ and labels $y=\{0,0,1,1,1\}$, thresholds have empirical risks $1/5=0.20$, $0/5=0.00$, and $1/5=0.20$, so ERM selects $t=2.5$.</p>" },
  { title: "Price or score baselines", background: "<p>A constant regressor is the simplest baseline for forecasts, prices, or quality scores.</p>", numbers: "<p>For targets $\{2,4,6\}$, squared-loss ERM picks the mean $c=4$ and MSE $\frac{(4-2)^2+(4-4)^2+(4-6)^2}{3}=2.667$.</p>" },
  { title: "Medical triage rule selection", background: "<p>Auditable triage policies compare a small menu of candidate rules before clinical review.</p>", numbers: "<p>The five-point separable threshold reaches $R_S=0$, but if labels have an illustrative $0.10$ noise floor, true risk cannot be driven below $0.10$ by ERM.</p>" },
  { title: "Fraud-rule menus", background: "<p>Rule engines often contain many tied candidates, so governance needs a tie policy after empirical risk is computed.</p>", numbers: "<p>In the lesson thresholds, $t=1.5$ and $t=3.5$ both make one mistake out of five, so both have $R_S=1/5=0.20$ before secondary criteria are applied.</p>" },
  { title: "Recommendation ranking variants", background: "<p>Offline ranking experiments average event-level losses to compare fixed model variants before online tests.</p>", numbers: "<p>For an illustrative fixed model on $m=100$ events, empirical risk is the average $R_S=\frac{1}{100}\sum_{i=1}^{100}\ell_i$; ERM minimizes that estimate, not the unknown population risk.</p>" }
];

(window.ALLML_CONTENT["1.2"] = window.ALLML_CONTENT["1.2"] || {}).applications = [
  { title: "Demand forecasting model class choice", background: "<p>Forecasting teams choose between simple, medium, and rich model classes based on the amount of historical data available.</p>", numbers: "<p>At $m=100$, totals are $0.20+\sqrt{10/200}=0.424$, $0.08+\sqrt{100/200}=0.787$, and $0.02+\sqrt{1000/200}=2.256$, so the small class wins.</p>" },
  { title: "Ad creative quality scoring", background: "<p>Richer feature sets can represent creative quality better, lowering approximation error.</p>", numbers: "<p>The lesson approximation term falls from $0.20$ to $0.08$ to $0.02$ as capacity increases, but that column alone does not decide the launch choice.</p>" },
  { title: "Search ranking launches", background: "<p>Search rankers with more templates can overfit when launch data is limited.</p>", numbers: "<p>With $m=100$, estimation terms rise as $\sqrt{10/200}=0.224$, $\sqrt{100/200}=0.707$, and $\sqrt{1000/200}=2.236$.</p>" },
  { title: "Risk-model refreshes", background: "<p>Risk models are often revisited after more labeled outcomes arrive because the optimal class can move upward.</p>", numbers: "<p>The medium class estimation term drops from $\sqrt{100/(2\cdot100)}=0.707$ to $\sqrt{100/(2\cdot1600)}=0.177$ when $m$ grows to $1600$.</p>" },
  { title: "A/B candidate pruning", background: "<p>Candidate pruning removes classes whose finite-data penalty is too expensive before experimentation.</p>", numbers: "<p>Because the estimation term scales as $1/\sqrt{m}$, increasing $m$ from $100$ to $400$ halves a fixed-complexity penalty.</p>" }
];

(window.ALLML_CONTENT["1.3"] = window.ALLML_CONTENT["1.3"] || {}).applications = [
  { title: "Labeling-budget planning", background: "<p>PAC learning gives a conservative labeled-example budget before collecting annotations for a finite rule library.</p>", numbers: "<p>For $|H|=100$, $\varepsilon=0.1$, and $\delta=0.05$, $m=\left\lceil(\ln100+\ln20)/0.1\right\rceil=77$ examples.</p>" },
  { title: "Safety review sampling", background: "<p>Safety reviews often demand higher confidence than ordinary experiments.</p>", numbers: "<p>Changing only confidence to $\delta=0.01$ gives $m=\left\lceil(\ln100+\ln100)/0.1\right\rceil=93$ examples.</p>" },
  { title: "Accuracy target setting", background: "<p>Product teams negotiate accuracy tolerance because it is the expensive PAC knob.</p>", numbers: "<p>Halving $\varepsilon$ from $0.1$ to $0.05$ changes the count from $77$ to $\left\lceil7.601/0.05\right\rceil=153$.</p>" },
  { title: "Feature-template expansion", background: "<p>Finite-class PAC shows why adding many templates can be affordable when the dependence is logarithmic.</p>", numbers: "<p>Growing $|H|$ from $100$ to $10{,}000$ gives $m=\left\lceil(\ln10^4+\ln20)/0.1\right\rceil=123$ examples.</p>" },
  { title: "Rule-library sizing", background: "<p>Each doubling of a finite rule library has a flat marginal sample cost under the realizable formula.</p>", numbers: "<p>At $\varepsilon=0.1$, a class doubling adds $\ln2/0.1=6.93$ samples before rounding.</p>" }
];

(window.ALLML_CONTENT["1.4"] = window.ALLML_CONTENT["1.4"] || {}).applications = [
  { title: "Threshold alerting", background: "<p>Alerting systems often use one-dimensional thresholds, an infinite parameter class with small VC dimension.</p>", numbers: "<p>One point has $2$ possible labels and thresholds realize both, but two ordered points have $4$ labels and the pattern $(1,0)$ is impossible, so VC dimension is $1$.</p>" },
  { title: "Range filters for moderation", background: "<p>Moderation filters frequently use intervals such as allowed score ranges.</p>", numbers: "<p>Intervals shatter two ordered points with all $2^2=4$ labelings, but on three points the pattern $(1,0,1)$ is impossible, so the VC dimension is $2$.</p>" },
  { title: "Linear screeners in 2D", background: "<p>Linear screening rules in two dimensions are classic half-plane classifiers.</p>", numbers: "<p>For points in general position, half-planes shatter $3$ points but not all $4$-point configurations, giving VC dimension $3$.</p>" },
  { title: "Box-rule dashboards", background: "<p>Dashboard filters often use axis-aligned rectangles over two measured quantities.</p>", numbers: "<p>Axis-aligned rectangles have VC dimension $4$, matching the four corner-style constraints used to realize all $2^4=16$ labelings on a suitable set.</p>" },
  { title: "Capacity audits for infinite classes", background: "<p>Sauer's lemma turns an infinite class with finite VC dimension into a finite growth count.</p>", numbers: "<p>For $d=2$ and $m=5$, the growth bound is $\binom50+\binom51+\binom52=1+5+10=16$ versus $2^5=32$ arbitrary labelings.</p>" }
];

(window.ALLML_CONTENT["1.5"] = window.ALLML_CONTENT["1.5"] || {}).applications = [
  { title: "Shuffled-label overfit tests", background: "<p>Noise-label tests ask whether a model class can chase random signs rather than signal.</p>", numbers: "<p>A single fixed function has no choice under the supremum, so averaging $\frac{1}{m}\sigma\cdot f$ over random signs gives empirical Rademacher complexity exactly $0$.</p>" },
  { title: "Tiny rule-menu audits", background: "<p>Small policy menus can be audited by exact enumeration before larger approximations are trusted.</p>", numbers: "<p>For $F=\{[1,1,1],[1,-1,1]\}$, enumerating all $2^3=8$ sign vectors gives $\hat{\mathfrak{R}}_S(F)=0.3333$.</p>" },
  { title: "Memorization detection", background: "<p>A class that can realize every sign vector is rich enough to memorize random labels.</p>", numbers: "<p>If $F$ contains every sign pattern on $m$ points, each random $\sigma$ is matched exactly and the score is $\frac{1}{m}\sum_i1=1$.</p>" },
  { title: "Dataset-specific model review", background: "<p>Unlike VC dimension, empirical Rademacher complexity is recomputed on the actual sample being reviewed.</p>", numbers: "<p>The same formula $\mathbb{E}_{\sigma}\sup_{f\in F}\frac{1}{m}\sum_i\sigma_i f(x_i)$ can change when the sample outputs $f(x_i)$ change.</p>" },
  { title: "Bound dashboards", background: "<p>Risk dashboards can include a Rademacher penalty to communicate noise-fitting capacity.</p>", numbers: "<p>In $R(h)\le R_S(h)+2\hat{\mathfrak{R}}_S(F)+\sqrt{\ln(1/\delta)/(2m)}$, an illustrative $\hat{\mathfrak{R}}_S=1/3$ contributes $2/3$ before the confidence term.</p>" }
];

(window.ALLML_CONTENT["1.6"] = window.ALLML_CONTENT["1.6"] || {}).applications = [
  { title: "Offline model risk cards", background: "<p>Model cards summarize empirical error together with the uncertainty owed to finite data and class size.</p>", numbers: "<p>With $|H|=100$, $\delta=0.05$, and $m=100$, the finite-class penalty is $\sqrt{(\ln100+\ln20)/200}=0.1949$.</p>" },
  { title: "Data acquisition planning", background: "<p>Bounds quantify how much more data is needed to tighten a launch risk ceiling.</p>", numbers: "<p>Holding $|H|=100$ and $\delta=0.05$ fixed, penalties are $0.1949$, $0.0616$, and $0.0195$ at $m=100$, $1000$, and $10000$.</p>" },
  { title: "Confidence choice", background: "<p>Confidence changes are relatively cheap because $\delta$ appears inside a logarithm.</p>", numbers: "<p>At $m=500$ and $|H|=100$, penalties are $0.0831$, $0.0872$, and $0.0960$ for $\delta=0.10$, $0.05$, and $0.01$.</p>" },
  { title: "Experiment sizing", background: "<p>Experiment planners use the $1/\sqrt{m}$ shape to reason about diminishing returns.</p>", numbers: "<p>Quadrupling from $m=100$ to $m=400$ halves the lesson penalty from $0.1949$ to $0.0975$.</p>" },
  { title: "Launch guardrails", background: "<p>A guardrail should flag bounds that are technically true but operationally useless.</p>", numbers: "<p>If the penalty exceeds $1$, the clipped statement is only $R\le1$ for a $0$-$1$ loss, so the risk card should call the bound vacuous.</p>" }
];

/* ---- _apps-part01-B.js ---- */
(window.ALLML_CONTENT["1.7"] = window.ALLML_CONTENT["1.7"] || {}).applications = [
  { title: "Polynomial-degree selection", background: "<p>SRM was designed for choosing among nested model families such as polynomial degrees without trusting training error alone.</p>", numbers: "<p>Using the lesson ladder at $m=200$, $\delta=0.05$, the bounds are $0.396,0.270,0.216,0.238$, so rung $3$ wins with $0.216$.</p>" },
  { title: "Rule-list governance", background: "<p>Risk teams often compare increasingly expressive rule lists; SRM makes the complexity charge explicit.</p>", numbers: "<p>Rung $4$ has the lowest empirical error, $0.05$, but its penalty $0.188$ gives $0.238$, worse than rung $3$'s $0.07+0.146=0.216$.</p>" },
  { title: "Feature-family rollout", background: "<p>Launching richer feature families increases the number of hypotheses that must be justified by data.</p>", numbers: "<p>The lesson penalties rise $0.096\to0.120\to0.146\to0.188$ as $|H|$ grows from $2$ to $65{,}536$.</p>" },
  { title: "AutoML search constraints", background: "<p>AutoML systems need a reason not to always choose the largest searched class.</p>", numbers: "<p>Empirical errors fall $0.30\to0.15\to0.07\to0.05$, so unpenalized ERM chooses rung $4$ while SRM stops at rung $3$.</p>" },
  { title: "Compliance model cards", background: "<p>Model cards can document why a complexity level was selected instead of reporting accuracy alone.</p>", numbers: "<p>The selected complexity is justified by the minimum bound $0.216$, re-derived as $0.07+\sqrt{(\ln256+\ln20)/400}$.</p>" }
];

(window.ALLML_CONTENT["1.8"] = window.ALLML_CONTENT["1.8"] || {}).applications = [
  { title: "Ridge forecasting", background: "<p>Ridge regression stabilizes small forecasting fits by adding an $\ell_2$ penalty to least squares.</p>", numbers: "<p>For lesson $X=[1,1],[1,2],[1,3]$ and $y=[1,2,2]$, $\lambda=0$ gives $w=[0.667,0.500]$.</p>" },
  { title: "Overfit control", background: "<p>Increasing $\lambda$ trades fit for smaller coefficients, reducing sensitivity to small data quirks.</p>", numbers: "<p>At $\lambda=1$, the lesson weights become $[0.375,0.583]$ with squared norm $0.375^2+0.583^2\approx0.481$.</p>" },
  { title: "Simplicity budgeting", background: "<p>A norm budget is a quantitative way to discuss model simplicity across candidate settings.</p>", numbers: "<p>The lesson squared norm shrinks $0.694\to0.481\to0.206\to0.011$ as $\lambda$ goes $0\to1\to10\to100$.</p>" },
  { title: "Strong-shrinkage warnings", background: "<p>Very large regularization can underfit by collapsing useful weights toward zero.</p>", numbers: "<p>At $\lambda=100$, the lesson norm is only $0.011$, about $0.011/0.694=1.6\%$ of the unregularized norm.</p>" },
  { title: "Feature pipeline hygiene", background: "<p>Feature scaling matters because the same penalty is applied to coefficients, not to raw feature meaning.</p>", numbers: "<p>Illustratively, scaling one feature by $10$ lets its coefficient shrink by about $10$ for the same effect, so standardization is part of the calculation.</p>" }
];

(window.ALLML_CONTENT["1.9"] = window.ALLML_CONTENT["1.9"] || {}).applications = [
  { title: "Leave-one-user-out recommender audits", background: "<p>Stability audits ask whether one user's removal materially changes the learned predictor.</p>", numbers: "<p>The lesson sample $\{2,4,6,8,10\}$ has full mean $6.0$.</p>" },
  { title: "Sensitivity reports", background: "<p>Reporting the largest leave-one-out movement gives a concrete empirical feel for algorithmic stability.</p>", numbers: "<p>Dropping $2$ leaves $\{4,6,8,10\}$ with mean $7.0$, so the largest lesson swing is $|7.0-6.0|=1.0$.</p>" },
  { title: "Data-volume planning", background: "<p>For bounded averages, one point has less influence as the sample grows.</p>", numbers: "<p>The lesson intuition improves from about $1/5=0.20$ to $1/50=0.02$ when $m$ grows tenfold.</p>" },
  { title: "Regularized training reviews", background: "<p>Regularized ERM is analyzed through stability because the penalty prevents one example from dominating.</p>", numbers: "<p>With the schematic $\beta\propto1/(\lambda m)$, doubling $\lambda$ from $1$ to $2$ at fixed $m=50$ halves the proxy from $1/50$ to $1/100$.</p>" },
  { title: "Nearest-neighbor risk checks", background: "<p>Some algorithms are not uniformly stable; nearest-neighbor predictions can hinge on a single point.</p>", numbers: "<p>If one boundary point controls a query, deleting it can change the loss by $1$, far larger than the mean estimator's $1/m$-style movement.</p>" }
];

(window.ALLML_CONTENT["1.10"] = window.ALLML_CONTENT["1.10"] || {}).applications = [
  { title: "Model-selection policy", background: "<p>No Free Lunch formalizes why a model-selection policy must state its assumptions.</p>", numbers: "<p>The lesson universe has $3$ unseen points and therefore $2^3=8$ equally likely target labelings.</p>" },
  { title: "Baseline sanity checks", background: "<p>A fixed baseline is not universally inferior under a uniform target prior.</p>", numbers: "<p>The fixed prediction $[0,0,0]$ averages off-training error $0.500$ across the lesson's $8$ targets.</p>" },
  { title: "Algorithm comparison", background: "<p>A clever-looking alternative ties once every possible target function is counted equally.</p>", numbers: "<p>The alternative rule $[1,0,1]$ also has mean error $0.500$ over the same $8$ target labelings.</p>" },
  { title: "Domain-bias design", background: "<p>Real progress comes from choosing a bias that matches the domain rather than from avoiding assumptions.</p>", numbers: "<p>Illustratively, if a smoothness bias gains $0.20$ error on smooth tasks, its mirror-random counterpart refunds that $0.20$ under the uniform average.</p>" },
  { title: "Procurement claims review", background: "<p>The theorem is a check against claims of a best model everywhere.</p>", numbers: "<p>Any advantage on $k$ of the $8$ lesson labelings is paired with disadvantage on the mirrored labelings, leaving the average at $0.500$.</p>" }
];

(window.ALLML_CONTENT["1.11"] = window.ALLML_CONTENT["1.11"] || {}).applications = [
  { title: "Whole-class validation guarantees", background: "<p>Uniform convergence turns single-model concentration into a guarantee for every candidate in a finite class.</p>", numbers: "<p>For one hypothesis at $m=500$, $\varepsilon=0.1$, Hoeffding gives $2e^{-10}=0.00009$.</p>" },
  { title: "Candidate-library audits", background: "<p>The union bound pays once for every hypothesis in the audited library.</p>", numbers: "<p>For $|H|=100$, the lesson multiplies $100\times0.00009=0.0091$, still below $1\%$.</p>" },
  { title: "Minimum sample planning", background: "<p>Solving the uniform bound for sample size gives a concrete data requirement.</p>", numbers: "<p>With $\delta=0.05$, $|H|=100$, $\varepsilon=0.1$, $m\ge(\ln100+\ln(2/0.05))/(2\cdot0.1^2)=414.7$, so use $415$ samples.</p>" },
  { title: "Early-experiment warnings", background: "<p>Small experiments can produce formally true but practically empty bounds.</p>", numbers: "<p>The lesson marks $m=100,150,230$ vacuous because the right side is $\ge1$ for $|H|=100$ and $\varepsilon=0.1$.</p>" },
  { title: "Bound communication", background: "<p>Reporting the failure probability helps stakeholders see when a guarantee is weak.</p>", numbers: "<p>At $m=300$, the lesson bound is $100\cdot2e^{-2(300)(0.1)^2}=0.496$, nearly a half-failure warning.</p>" }
];

