/* All ML — Part 18 applications (5 each). Loaded after content-part-18.js, before all-ml-register.js. */

/* ---- _apps-part18-A.js ---- */
window.ALLML_CONTENT["18.1"].applications = [
  {
    title: "Fraud and risk triage",
    background: "<p>Risk teams inspect transaction tails before modeling because a single extreme value may be a real attack, a logging cap failure, or a different population.</p>",
    numbers: "<p>For the lesson values $x=\{2,3,3,4,5,20\}$, the outlier score is $z=(20-6.167)/6.256=2.211$, so the tail point deserves review before a fraud model treats it as ordinary.</p>"
  },
  {
    title: "Product analytics by segment",
    background: "<p>Product dashboards can hide two different user regimes when they publish only a global conversion or retention rate.</p>",
    numbers: "<p>The lesson slices have $A=1/4=0.250$ and $B=3/4=0.750$ even though the pooled rate is $4/8=0.500$, so a single average would erase a 50-point segment gap.</p>"
  },
  {
    title: "Healthcare vital-sign intake",
    background: "<p>Clinical data intake often compares robust and non-robust centers to catch miscoded units, extreme values, or mixed patient populations.</p>",
    numbers: "<p>The lesson mean is $6.167$ while the median is $3.500$ for the same six values, a $2.667$ disagreement caused by tail leverage that should be checked before modeling.</p>"
  },
  {
    title: "Feature discovery",
    background: "<p>Before feature selection, analysts screen whether candidate variables co-move with the target enough to justify deeper causal or predictive investigation.</p>",
    numbers: "<p>For $x=\{1,2,3,4,5\}$ and $y=\{2,4,5,4,5\}$, the lesson correlation is $r=0.775$, indicating strong association but not proving causation.</p>"
  },
  {
    title: "Data intake monitoring",
    background: "<p>Production data monitors compare global and sliced label mixes to detect upstream changes that a model metric may reveal too late.</p>",
    numbers: "<p>The overall lesson rate is $4/8=0.500$, but the slice rates $0.250$ and $0.750$ show why monitors need conditional rates as well as the global number.</p>"
  }
];

window.ALLML_CONTENT["18.2"].applications = [
  {
    title: "Survey sampling",
    background: "<p>Survey teams design samples to represent a population mixture rather than whichever respondents are easiest to reach.</p>",
    numbers: "<p>With groups of $800$ at rate $0.200$ and $200$ at rate $0.700$, the target population rate is $(800\cdot0.200+200\cdot0.700)/1000=0.300$.</p>"
  },
  {
    title: "Ads and log sampling",
    background: "<p>Ad logs can overrepresent frequent or easy-to-capture traffic, producing a dataset centered on the wrong business population.</p>",
    numbers: "<p>An illustrative $90/10$ sample estimates $(90\cdot0.200+10\cdot0.700)/100=25/100=0.250$, below the true $0.300$ because the group mix is wrong.</p>"
  },
  {
    title: "Rare-group evaluation",
    background: "<p>Evaluation sets often stratify deliberately so smaller but important groups are present in enough volume for reliable measurement.</p>",
    numbers: "<p>The lesson's $80/20$ stratified sample gives $(80\cdot0.200+20\cdot0.700)/100=30/100=0.300$, matching the target mixture.</p>"
  },
  {
    title: "Annotation budgeting",
    background: "<p>Labeling programs use standard error to decide whether an annotation batch is large enough to estimate a rate.</p>",
    numbers: "<p>At $p=0.300$ and $n=100$, $SE=\sqrt{0.300\cdot0.700/100}=0.0458$, so the approximate 95% half-width is $1.96\cdot0.0458=0.0898$.</p>"
  },
  {
    title: "Scaling collection",
    background: "<p>More data reduces random error slowly, while representative sampling removes systematic bias immediately.</p>",
    numbers: "<p>Increasing from $n=100$ to $n=400$ changes $SE$ from $0.0458$ to $\sqrt{0.210/400}=0.0229$, exactly half as large.</p>"
  }
];

window.ALLML_CONTENT["18.3"].applications = [
  {
    title: "CRM customer tables",
    background: "<p>Customer tables often use mean fills for simple numeric fields, but the fill should be recorded as an assumption.</p>",
    numbers: "<p>For $\{10,12,\text{missing},18,20\}$, the observed mean is $(10+12+18+20)/4=15.000$, so mean imputation fills the blank with $15.000$.</p>"
  },
  {
    title: "Segment-aware healthcare and finance",
    background: "<p>Grouped populations can have different baselines, so a global fill may erase meaningful segment structure.</p>",
    numbers: "<p>In the lesson groups, $A:\{10,12,\text{missing}\}$ fills with $11.000$ and $B:\{30,32,\text{missing}\}$ fills with $31.000$.</p>"
  },
  {
    title: "Churn and risk modeling",
    background: "<p>Dropping incomplete rows can change the label distribution when missingness depends on the outcome.</p>",
    numbers: "<p>With labels $\{0,0,1,1,1,1\}$ and the last two rows incomplete, the full rate is $4/6=0.667$ but the complete-case rate is $2/4=0.500$.</p>"
  },
  {
    title: "Missingness indicators",
    background: "<p>Many production systems add an explicit indicator so the model can learn whether the blank itself is predictive.</p>",
    numbers: "<p>The lesson has missing indicator count $2$, and both missing rows are positives, so $m_i=1$ is not neutral noise.</p>"
  },
  {
    title: "Data contracts",
    background: "<p>Validation checks compare filled and observed distributions because imputation can preserve a mean while changing uncertainty.</p>",
    numbers: "<p>The filled vector $\{10,12,15,18,20\}$ still has mean $(10+12+15+18+20)/5=15.000$, but adding the mean value shrinks spread.</p>"
  }
];

window.ALLML_CONTENT["18.4"].applications = [
  {
    title: "Content moderation",
    background: "<p>Moderation systems combine repeated human judgments before training classifiers or routing uncertain cases for review.</p>",
    numbers: "<p>The lesson vote fractions are $\{2/3,1/3,0/3,3/3,1/3\}=\{0.667,0.333,0.000,1.000,0.333\}$, producing majority labels $\{1,0,0,1,0\}$.</p>"
  },
  {
    title: "Medical annotation calibration",
    background: "<p>Clinical annotation projects compare raters with gold items before scaling because expertise and guidelines both affect label quality.</p>",
    numbers: "<p>In the lesson, each of three raters matches gold on $4/5=0.800$ items, so voting is backed by a measured rater-quality check.</p>"
  },
  {
    title: "Search relevance review",
    background: "<p>Search teams flag examples where judges disagree because ambiguity often points to unclear intent or unclear guidelines.</p>",
    numbers: "<p>A vote fraction of $1/3=0.333$ or $2/3=0.667$ is close to the decision boundary compared with $0/3$ or $3/3$, so it should carry lower confidence.</p>"
  },
  {
    title: "Taxonomy QA",
    background: "<p>Taxonomy owners measure raw agreement first, then ask how much of it would happen by chance under the raters' base rates.</p>",
    numbers: "<p>For lesson raters $a$ and $b$, observed agreement is $p_o=3/5=0.600$.</p>"
  },
  {
    title: "Guideline governance",
    background: "<p>Low agreement beyond chance signals that instructions need revision before more labels are purchased.</p>",
    numbers: "<p>With $p_e=0.600\cdot0.600+0.400\cdot0.400=0.520$, kappa is $(0.600-0.520)/(1-0.520)=0.167$.</p>"
  }
];

window.ALLML_CONTENT["18.5"].applications = [
  {
    title: "Domain-rule labeling",
    background: "<p>Teams encode expert heuristics as labeling functions and track how many examples each rule reaches.</p>",
    numbers: "<p>The lesson coverage counts are $\{4,4,5\}/5=\{0.800,0.800,1.000\}$, so the third function speaks on every example while the first two abstain once.</p>"
  },
  {
    title: "Compliance screening",
    background: "<p>Programmatic rules are audited for disagreement because conflicts often reveal ambiguous policy language or brittle keywords.</p>",
    numbers: "<p>One of five lesson rows has both class $0$ and class $1$ among non-abstaining rules, so the conflict rate is $1/5=0.200$.</p>"
  },
  {
    title: "Bootstrapping classifiers",
    background: "<p>Weak labels let a downstream classifier learn from unlabeled examples once abstentions and votes are combined.</p>",
    numbers: "<p>Ignoring abstentions in the lesson matrix, majority vote gives weak labels $\{1,1,0,0,1\}$ for the five examples.</p>"
  },
  {
    title: "Expert-rule weighting",
    background: "<p>Rules with known reliability can be weighted so a weak rule does not cancel multiple stronger rules.</p>",
    numbers: "<p>On the lesson conflicting row, the positive weight is $0.9+0.8=1.7$ while total spoken weight is $0.9+0.8+0.4=2.1$.</p>"
  },
  {
    title: "Label-model QA",
    background: "<p>Weak supervision systems report confidence as well as the chosen label so downstream users know where rules are unsupported.</p>",
    numbers: "<p>The lesson weighted positive score is $1.7/2.1=0.810$, keeping the weaker negative vote visible instead of discarding it.</p>"
  }
];

/* ---- _apps-part18-B.js ---- */
window.ALLML_CONTENT["18.6"].applications = [
  { title: "Rare-class training", background: "<p>Synthetic generation is often used when a class is too rare for a stable decision boundary. The generated rows should be class-conditional, not just random copies of the full table.</p>", numbers: "<p>Illustrative lesson balance: $5$ real positives plus $35$ synthetic positives gives $40$ positives, matching $40$ negatives, so the target training mix is $40/80=0.500$ positive.</p>" },
  { title: "Privacy memorization review", background: "<p>Privacy checks ask whether generated rows are effectively real rows with tiny noise. Nearest-neighbor distance is a simple first warning before deeper privacy review.</p>", numbers: "<p>For real points $\\{0,1,3,6\\}$ and synthetic points $\\{0.05,2.2,5.0\\}$, the nearest distances are $\\{0.05,0.8,1.0\\}$; the minimum $0.05$ is below the illustrative $0.10$ warning threshold.</p>" },
  { title: "Distribution QA by moments", background: "<p>Generated rows should match basic summaries of the source population, while still being checked for tails and conditional structure.</p>", numbers: "<p>The real values $\\{1,2,3,4\\}$ have mean $(1+2+3+4)/4=2.500$, and synthetic values $\\{1.2,1.9,3.1,3.8\\}$ also average to $2.500$.</p>" },
  { title: "Moment validation beyond means", background: "<p>Equal means can hide different spread, tails, or class-conditional shapes, so standard deviation and distance checks remain necessary.</p>", numbers: "<p>The real standard deviation is $\\sqrt{((1-2.5)^2+(2-2.5)^2+(3-2.5)^2+(4-2.5)^2)/4}=1.118$, which a generator should compare against, not ignore.</p>" },
  { title: "Simulation before launch", background: "<p>Teams can simulate candidate data before a product or collection launch, then evaluate whether synthetic rows improve downstream accuracy without changing the target question.</p>", numbers: "<p>Using the lesson distances $\\{0.05,0.8,1.0\\}$, only $2/3$ synthetic rows are at least $0.10$ away from a real row, so a distance filter would reject $1/3$ of this batch.</p>" }
];

window.ALLML_CONTENT["18.7"].applications = [
  { title: "Vision and text robustness", background: "<p>Augmentation encodes invariances such as small brightness changes, crops, synonyms, or numeric jitter when those changes preserve the label.</p>", numbers: "<p>The lesson jitter maps $\\{1,2,3\\}$ with noise $\\{0.1,-0.1,0.2\\}$ to $\\{1.1,1.9,3.2\\}$, keeping each point near its original value.</p>" },
  { title: "Sensor noise training", background: "<p>Tabular and sensor models use small perturbations to learn local smoothness, provided the augmented values remain plausible.</p>", numbers: "<p>The original mean is $(1+2+3)/3=2.000$; after adding $\\{1.1,1.9,3.2\\}$, the combined mean is $12.2/6=2.033$.</p>" },
  { title: "Boundary auditing", background: "<p>Before trusting an augmentation, teams test whether it crosses the task boundary and creates systematic label noise.</p>", numbers: "<p>If the true boundary is $x\\gt0$, shifting $80$ evenly spaced points by $0.8$ disagrees on $32$ points, so the flip rate is $32/80=0.400$.</p>" },
  { title: "Mixup regularization", background: "<p>Mixup trains on convex combinations of examples and soft labels, often improving smoothness when interpolation is meaningful for the task.</p>", numbers: "<p>With $x_a=(0,0)$, $x_b=(2,2)$, $\\lambda=0.3$, and labels $0,1$, the mixup point is $0.3x_a+0.7x_b=(1.4,1.4)$ with soft label $0.7$.</p>" },
  { title: "Range validation", background: "<p>Augmentation should be coupled to validation because plausible-looking transforms can create impossible feature values or train-serving skew.</p>", numbers: "<p>The lesson shift by $0.8$ can move values across the $x\\gt0$ boundary; the $0.400$ disagreement rate means $40\%$ of those augmented rows would carry the wrong label.</p>" }
];

window.ALLML_CONTENT["18.8"].applications = [
  { title: "Feature contract checks", background: "<p>Feature contracts turn assumptions such as score ranges into executable gates that fail before training or serving.</p>", numbers: "<p>For serving scores $\\{0.5,0.6,1.7,0.8\\}$ expected in $[0,1]$, only $1.7$ violates the range, so the violation count is $1$.</p>" },
  { title: "Pipeline quality gates", background: "<p>Missingness budgets catch broken joins, logging gaps, and upstream schema changes before they silently enter the learner.</p>", numbers: "<p>With missingness rates $\\{0.25,0.50,0.50\\}$ and budget $0.40$, features 2 and 3 fail because $0.50\\gt0.40$.</p>" },
  { title: "Production drift monitoring", background: "<p>Population Stability Index compares train and serving bin proportions and flags population movement before accuracy labels arrive.</p>", numbers: "<p>For $p=\\{0.5,0.3,0.2\\}$ and $q=\\{0.3,0.4,0.3\\}$, the PSI terms are $0.102$, $0.029$, and $0.041$, totaling $0.171$.</p>" },
  { title: "Offline-online parity", background: "<p>Distribution-bin checks catch cases where a feature has the right name but is computed differently online and offline.</p>", numbers: "<p>The low-bin PSI term is $(0.3-0.5)\\log(0.3/0.5)=0.102$, showing a large contribution from one shifted segment.</p>" },
  { title: "Alert triage", background: "<p>Validation metrics are not model metrics; they tell owners where data moved so model debugging starts in the right place.</p>", numbers: "<p>The same PSI example sums to $0.171$ even before labels are known, because it uses only bin proportions $p$ and $q$.</p>" }
];

window.ALLML_CONTENT["18.9"].applications = [
  { title: "Reproducible training", background: "<p>Versioning records exactly which rows a model consumed, so a result can be rebuilt instead of approximated from memory.</p>", numbers: "<p>Comparing old rows $\\{1,2,3,4\\}$ with new rows $\\{1,2,4,5\\}$ adds row $5$, so the added count is $1$.</p>" },
  { title: "Rollback", background: "<p>When a snapshot fails quality checks, versioned data lets teams return to the previous passing dataset rather than editing blindly.</p>", numbers: "<p>The removed set is $\\{3\\}$, count $1$; for quality scores $\\{0.91,0.93,0.62,0.94\\}$ at threshold $0.90$, version 3 fails and version 2 is the previous passing snapshot.</p>" },
  { title: "Audit lineage", background: "<p>Lineage tracks transforms such as filtering, cleaning, and featurization, including the row counts they produce.</p>", numbers: "<p>The lesson lineage moves raw $3$ rows to cleaned $2$ rows to featured $2$ rows, written as $3\\to2\\to2$.</p>" },
  { title: "Quality-gated releases", background: "<p>Validation results should be attached to snapshots so release automation can select known-good data.</p>", numbers: "<p>With threshold $0.90$, scores $0.91$ and $0.93$ pass, $0.62$ fails, and $0.94$ passes later; during the failure, rollback chooses version $2$.</p>" },
  { title: "Incident response", background: "<p>Diffs isolate stable overlap and changed rows, helping owners decide whether retraining, rollback, or row-level repair is needed.</p>", numbers: "<p>The kept rows are $\\{1,2,4\\}$, count $3$, from the intersection of $\\{1,2,3,4\\}$ and $\\{1,2,4,5\\}$.</p>" }
];

window.ALLML_CONTENT["18.10"].applications = [
  { title: "Training-set pruning", background: "<p>Data Shapley ranks examples by their average marginal utility, allowing teams to prune harmful rows rather than merely remove rare rows.</p>", numbers: "<p>The lesson values $\\{0.250,0.250,0.500\\}$ sum to $1.000$, matching $U(N)-U(\\varnothing)=1.000-0.000$.</p>" },
  { title: "Label-error detection", background: "<p>Mislabeled influential rows can have negative value because they flip validation predictions in the wrong context.</p>", numbers: "<p>The lesson mislabeled point changes utility from $1.000$ to $0.500$, so its marginal contribution is $0.500-1.000=-0.500$.</p>" },
  { title: "Collection prioritization", background: "<p>Rows that support underrepresented decision regions can be worth more than redundant rows, guiding future collection budgets.</p>", numbers: "<p>Point 2 has value $0.500$, double points 0 and 1 at $0.250$, because it supplies the positive-side neighbor needed for half the utility.</p>" },
  { title: "Data marketplace accounting", background: "<p>When utility must be allocated across contributors, Shapley values provide an additive accounting under the chosen model and validation set.</p>", numbers: "<p>The total allocated value is $0.250+0.250+0.500=1.000$, equal to the full-set gain $U(N)-U(\\varnothing)=1.000$.</p>" },
  { title: "Approximation QA", background: "<p>Exact valuation is exponential, so practical systems use sampled permutations and compare repeated estimates for stability.</p>", numbers: "<p>The lesson singleton utilities are each $0.500$, while pair or full utilities can reach $1.000$, showing why row value depends on subset context rather than a single leave-one-out score.</p>" }
];

