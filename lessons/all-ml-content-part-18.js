/* All ML — authored content for Part 18: Data-Centric AI (18.1–18.10).
   Appends to window.ALLML_CONTENT (merged into lessons by id in all-ml-register.js).
   Numeric examples were computed before authoring. LaTeX via String.raw; no prose italics. */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

/* ---------------- 18.1 Exploratory data analysis ---------------- */
window.ALLML_CONTENT["18.1"] = {
  tagline: "EDA is the disciplined habit of measuring the data before asking a model to explain it.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/18.1-exploratory-data-analysis.ipynb",
  context: String.raw`
    <p>Exploratory data analysis is where data-centric AI begins: before optimization, you ask what the table is actually saying.</p>
    <ul>
      <li><b>Descriptive statistics</b> from earlier probability lessons become the first data-quality instruments: location, spread, and tails tell you whether a feature is stable enough to model.</li>
      <li><b>Correlation and conditional rates</b> feed feature discovery by showing which variables move together and which segments behave differently.</li>
      <li><b>Missingness patterns</b> connect directly to cleaning (18.3), because a blank value is often a process signal, not merely an inconvenience.</li>
    </ul>
    <p>Where it leads: EDA defines what collection (18.2), labeling (18.4), validation (18.8), and versioning (18.9) must protect. Later model work is only as honest as this first reading of the data.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple: a dataset can look ready because it has rows and columns, while hiding outliers, broken joins, segment imbalance, or missing fields that will dominate the model. The naive approach is to train first and debug later; that makes the model the first diagnostic tool, which is slow and misleading.</p>
    <p>The mental model is a physician taking vitals. EDA does not cure the patient; it tells you where to look. The design decision people gloss over is that EDA must be <b>question-driven</b>, not chart-driven. A histogram is useful only when it answers whether a feature has a plausible range, a scatterplot is useful only when it tests a suspected relationship, and a segment table is useful only when it checks whether one population is being averaged into another.</p>`,
  mathematics: String.raw`
    <p>For a numeric column $x\\in\\mathbb{R}^m$, EDA usually starts with center $\\bar x=\\frac{1}{m}\\sum_i x_i$, spread $\\sigma=\\sqrt{\\frac{1}{m}\\sum_i(x_i-\\bar x)^2}$, standardized score $z_i=(x_i-\\bar x)/\\sigma$, and pairwise correlation $r=\\frac{\\sum_i(x_i-\\bar x)(y_i-\\bar y)}{\\sqrt{\\sum_i(x_i-\\bar x)^2\\sum_i(y_i-\\bar y)^2}}$. Here $m$ is row count and each sum runs over observed rows.</p>
    <p><b>Center and outliers.</b> For $x=\\{2,3,3,4,5,20\\}$:</p>
    <ol class="work">
      <li>$\\bar x=(2+3+3+4+5+20)/6=6.167$</li>
      <li>$\\operatorname{median}(x)=(3+4)/2=3.500$</li>
      <li>$\\sigma=\\sqrt{39.139}=6.256$, so the largest point has $z=(20-6.167)/6.256=2.211$</li>
    </ol>
    <p>The mean moved far above the median because one tail point carries large leverage; that is the signal to inspect whether 20 is real, capped incorrectly, or a different population.</p>
    <p><b>Association and segments.</b> For feature $x=\\{1,2,3,4,5\\}$ and target $y=\\{2,4,5,4,5\\}$:</p>
    <ol class="work">
      <li>$\\bar x=3.000$, $\\bar y=4.000$</li>
      <li>correlation $r=0.775$ after centering, multiplying paired deviations, and normalizing by both lengths</li>
      <li>segment label rates $A:1/4=0.250$, $B:3/4=0.750$, overall $4/8=0.500$</li>
    </ol>
    <p>The global rate of $0.500$ is true but incomplete: it averages two regimes that a downstream model or sampling plan must treat carefully.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Trusting the mean when the median disagrees.</b> The mechanism is leverage in $\\bar x$: one large value contributes directly to the sum and can redefine the center.</li>
      <li><b>Reading correlation as causation.</b> The term $r$ only normalizes co-movement; it does not identify interventions or remove confounding.</li>
      <li><b>Averaging away segments.</b> A global rate can hide conditional rates, so validation must check important slices, not only the full table.</li>
    </ul>`
};

/* ---------------- 18.2 Data collection & sampling design ---------------- */
window.ALLML_CONTENT["18.2"] = {
  tagline: "Sampling design decides what population your dataset is allowed to represent.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/18.2-data-collection-sampling-design.ipynb",
  context: String.raw`
    <p>Collection is not a clerical step; it is the first model assumption written into the dataset.</p>
    <ul>
      <li><b>EDA (18.1)</b> tells which groups exist and which rates differ, so the sampling frame can include them deliberately.</li>
      <li><b>Probability sampling</b> supplies the mechanism of uncertainty: estimates fluctuate around the population rate with standard error.</li>
      <li><b>Validation (18.8)</b> later checks whether new data still matches the design you intended.</li>
    </ul>
    <p>Where it leads: poor collection cannot be repaired by clever augmentation (18.7) or synthetic data (18.6) unless you first know what target distribution those methods should mimic.</p>`,
  intuition: String.raw`
    <p>The concrete problem is representativeness. If a product has quiet users and power users, but your logging or labeling budget mostly captures power users, the model will learn a distorted world. The naive approach says "more rows"; data-centric AI asks "more rows from which population?"</p>
    <p>The mental model is a measuring cup. A large cup dipped into the wrong part of the soup still gives the wrong taste. The design decision people miss is whether to sample in proportion to the population or intentionally stratify. Stratification is not cheating; it is how you make sure small but important groups are measured with enough precision.</p>`,
  mathematics: String.raw`
    <p>Let group sizes be $N_g$, group rates be $p_g$, and total $N=\\sum_g N_g$. The population rate is the weighted average $p=\\sum_g (N_g/N)p_g$. For a binomial estimate from $n$ independent samples, the standard error is $\\sqrt{p(1-p)/n}$.</p>
    <p><b>Representation.</b> Suppose group $A$ has $800$ users at rate $0.200$ and group $B$ has $200$ users at rate $0.700$:</p>
    <ol class="work">
      <li>population rate $=(800\\cdot0.200+200\\cdot0.700)/1000=(160+140)/1000=0.300$</li>
      <li>a biased $90/10$ sample estimates $(90\\cdot0.200+10\\cdot0.700)/100=25/100=0.250$</li>
      <li>a stratified $80/20$ sample estimates $(80\\cdot0.200+20\\cdot0.700)/100=30/100=0.300$</li>
    </ol>
    <p>The biased sample is not noisy around the right answer; it is centered on the wrong mixture. Stratification fixes the mixture before modeling begins.</p>
    <p><b>Uncertainty.</b> At $p=0.300$ and $n=100$:</p>
    <ol class="work">
      <li>$SE=\\sqrt{0.300\\cdot0.700/100}=\\sqrt{0.0021}=0.0458$</li>
      <li>an approximate 95% half-width is $1.96\\cdot0.0458=0.0898$</li>
      <li>at $n=400$, $SE=\\sqrt{0.210/400}=0.0229$, exactly half as large</li>
    </ol>
    <p>More data reduces random error slowly, while better design removes systematic bias immediately.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing sample size with representativeness.</b> The standard error term shrinks with $n$, but a wrong group weight stays wrong no matter how many rows you collect.</li>
      <li><b>Oversampling without weights.</b> If you deliberately collect extra rare-group rows, training or evaluation must know the target mixture $N_g/N$.</li>
      <li><b>Sampling only observable survivors.</b> Logs often exclude failed searches, rejected applications, or churned users; the sampling frame then omits the very cases the model must handle.</li>
    </ul>`
};

/* ---------------- 18.3 Data cleaning & missing-value handling ---------------- */
window.ALLML_CONTENT["18.3"] = {
  tagline: "Cleaning is not erasing mess; it is preserving signal while making assumptions explicit.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/18.3-data-cleaning-missing-value-handling.ipynb",
  context: String.raw`
    <p>Missing-value handling sits between EDA and modeling because it changes the numbers a learner will see.</p>
    <ul>
      <li><b>EDA (18.1)</b> identifies which fields are missing and whether missingness clusters by segment.</li>
      <li><b>Sampling design (18.2)</b> tells whether missing rows are a random subset or a biased slice of the population.</li>
      <li><b>Validation (18.8)</b> later enforces missingness budgets so the same cleaning assumptions remain valid in production.</li>
    </ul>
    <p>Where it leads: labels (18.4), weak supervision (18.5), and data valuation (18.10) all become unreliable if missingness quietly changes the examples they score.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that most algorithms require numbers, while real tables contain blanks, sentinels, duplicates, and impossible values. The naive approach fills everything with one convenient constant and moves on. That is dangerous because the blank may mean "not asked," "not applicable," "failed logging," or "user chose not to answer." These meanings have different predictive and ethical consequences.</p>
    <p>The mental model is translation. Cleaning translates messy observations into model-ready features, but every translation loses or adds meaning. The design decision people gloss over is whether to treat missingness as absence of information or as information itself. A missingness indicator is often the honest compromise: impute a usable value, and also tell the model that the value was imputed.</p>`,
  mathematics: String.raw`
    <p>For observed entries $O$ in a column, mean imputation fills each missing value with $\\mu_O=\\frac{1}{|O|}\\sum_{i\\in O}x_i$. Segment-aware imputation replaces $O$ with the observed entries in the same group. A missingness indicator is $m_i=\\mathbf{1}[x_i\\text{ is missing}]$.</p>
    <p><b>Mean and group imputation.</b> For $x=\\{10,12,\\text{missing},18,20\\}$:</p>
    <ol class="work">
      <li>observed mean $\\mu_O=(10+12+18+20)/4=15.000$</li>
      <li>filled vector $\\{10,12,15,18,20\\}$ has mean $(10+12+15+18+20)/5=15.000$</li>
      <li>within groups $A:\\{10,12,\\text{missing}\\}$ and $B:\\{30,32,\\text{missing}\\}$, fills are $11.000$ and $31.000$</li>
    </ol>
    <p>The global fill preserves the global mean, but the group fill preserves segment structure; the right choice depends on the mechanism that caused the blank.</p>
    <p><b>Dropping rows.</b> With labels $\\{0,0,1,1,1,1\\}$, suppose the last two rows are incomplete:</p>
    <ol class="work">
      <li>full label rate $=4/6=0.667$</li>
      <li>complete-case label rate $=(0+0+1+1)/4=0.500$</li>
      <li>missing indicator count $=2$, so missingness is concentrated among positives</li>
    </ol>
    <p>Dropping rows changed the target distribution, so the cleaning step has become a sampling intervention, not a neutral preprocessing step.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Mean imputation shrinks variance.</b> Filled values equal $\\mu_O$, so they add no spread and make the feature look more certain than it is.</li>
      <li><b>Dropping rows under informative missingness.</b> Complete-case analysis reweights the label distribution when missingness depends on $y$ or a segment.</li>
      <li><b>Forgetting the indicator.</b> If $m_i$ predicts the outcome, filling without $m_i$ hides a real process signal from the model.</li>
    </ul>`
};

/* ---------------- 18.4 Data labeling & annotation ---------------- */
window.ALLML_CONTENT["18.4"] = {
  tagline: "Labels are measurements from humans or systems, so their noise must be measured too.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/18.4-data-labeling-annotation.ipynb",
  context: String.raw`
    <p>Annotation turns raw examples into supervised data, but it also introduces measurement error.</p>
    <ul>
      <li><b>Sampling design (18.2)</b> determines which examples humans see, so annotation quality is only meaningful for that sampled population.</li>
      <li><b>EDA (18.1)</b> finds ambiguous segments where label disagreement is likely.</li>
      <li><b>Weak supervision (18.5)</b> generalizes the same voting and reliability ideas from humans to labeling functions.</li>
    </ul>
    <p>Where it leads: label quality constrains synthetic data (18.6), augmentation (18.7), validation (18.8), and data valuation (18.10), because every one of them assumes the target is trustworthy enough to optimize.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a training label is not truth itself; it is an observation produced by an annotator, guideline, UI, or heuristic. The naive approach takes the CSV label as final. Data-centric AI asks how the label was produced, whether annotators agree, and which examples are intrinsically ambiguous.</p>
    <p>The mental model is a measuring instrument with calibration error. Majority vote reduces independent noise, gold questions estimate rater reliability, and agreement metrics reveal whether the task definition is clear. The design decision people miss is that disagreement is not always bad; sometimes it identifies examples where the taxonomy or product decision is under-specified.</p>`,
  mathematics: String.raw`
    <p>For item $i$ with $K$ annotators, the vote fraction is $v_i=\\frac{1}{K}\\sum_k a_{ik}$ and majority label is $\\mathbf{1}[v_i\\ge 0.5]$. Cohen's kappa for two annotators is $\\kappa=(p_o-p_e)/(1-p_e)$, where $p_o$ is observed agreement and $p_e$ is chance agreement from their marginal label rates.</p>
    <p><b>Votes and reliability.</b> Five items annotated by three raters have vote fractions:</p>
    <ol class="work">
      <li>fractions $\\{2/3,1/3,0/3,3/3,1/3\\}=\\{0.667,0.333,0.000,1.000,0.333\\}$</li>
      <li>majority labels $\\{1,0,0,1,0\\}$</li>
      <li>against gold labels, rater accuracies are $\\{4/5,4/5,4/5\\}=\\{0.800,0.800,0.800\\}$</li>
    </ol>
    <p>Voting turns repeated judgments into labels, while gold accuracy checks whether the voting population is competent on known cases.</p>
    <p><b>Agreement beyond chance.</b> For two raters with labels $a=\\{1,1,0,1,0\\}$ and $b=\\{1,0,0,1,1\\}$:</p>
    <ol class="work">
      <li>observed agreement $p_o=3/5=0.600$</li>
      <li>both have positive rate $3/5=0.600$, so $p_e=0.600\\cdot0.600+0.400\\cdot0.400=0.520$</li>
      <li>$\\kappa=(0.600-0.520)/(1-0.520)=0.167$</li>
    </ol>
    <p>The raw agreement looks moderate, but kappa says much of it was expected from the raters' base rates; the guideline needs clarification before scaling annotation.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Counting majority vote as ground truth.</b> The vote fraction $v_i$ hides uncertainty; items near $0.5$ should often be reviewed or down-weighted.</li>
      <li><b>Ignoring chance agreement.</b> High $p_o$ can still produce low $\\kappa$ when annotators share skewed base rates.</li>
      <li><b>Training on guideline bugs.</b> If disagreement comes from ambiguous instructions, more labels only reproduce the ambiguity more confidently.</li>
    </ul>`
};

/* ---------------- 18.5 Weak supervision & programmatic labeling ---------------- */
window.ALLML_CONTENT["18.5"] = {
  tagline: "Weak supervision scales labeling by combining noisy rules whose coverage and conflicts are explicit.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/18.5-weak-supervision-programmatic-labeling.ipynb",
  context: String.raw`
    <p>Weak supervision is annotation engineering: write labeling functions, measure their behavior, and combine them.</p>
    <ul>
      <li><b>Human labeling (18.4)</b> supplies the ideas of votes, reliability, and disagreement.</li>
      <li><b>EDA (18.1)</b> suggests rules by exposing keywords, ranges, or segments that correlate with labels.</li>
      <li><b>Validation (18.8)</b> is needed because labeling functions are code, and code drifts when data changes.</li>
    </ul>
    <p>Where it leads: weak labels often seed synthetic data (18.6), augmentation (18.7), and downstream model training, but their uncertainty must travel with them.</p>`,
  intuition: String.raw`
    <p>The concrete problem is label scarcity. Experts can label thousands of examples, but code can label millions if you can express domain knowledge as rules. The naive approach treats each rule as truth. Weak supervision instead treats rules as noisy annotators: they may abstain, overlap, conflict, and vary in reliability.</p>
    <p>The mental model is a committee of specialists. One rule recognizes a phrase, another checks a threshold, another catches a known exception. The design decision people gloss over is abstention. A good labeling function should say "I do not know" outside its expertise; forced labels create confident noise.</p>`,
  mathematics: String.raw`
    <p>Let $L\\in\\{-1,0,1\\}^{m\\times K}$ be the label matrix, with $-1$ meaning abstain, $0/1$ meaning class labels, $m$ examples, and $K$ labeling functions. Coverage of function $k$ is $c_k=\\frac{1}{m}\\sum_i\\mathbf{1}[L_{ik}\\ne -1]$; conflict occurs when non-abstaining functions on a row emit both labels.</p>
    <p><b>Coverage and conflict.</b> For five examples and three labeling functions:</p>
    <ol class="work">
      <li>coverage counts are $\\{4,4,5\\}/5=\\{0.800,0.800,1.000\\}$</li>
      <li>one row has both $0$ and $1$, so conflict rate $=1/5=0.200$</li>
      <li>majority vote after abstentions gives labels $\\{1,1,0,0,1\\}$</li>
    </ol>
    <p>Coverage tells how much data a rule reaches; conflict tells where rules need debugging or probabilistic combination.</p>
    <p><b>Weighted combination.</b> On a conflicting row with labels $\\{1,1,0\\}$ and reliability weights $\\{0.9,0.8,0.4\\}$:</p>
    <ol class="work">
      <li>positive weight $=0.9+0.8=1.7$</li>
      <li>total spoken weight $=0.9+0.8+0.4=2.1$</li>
      <li>weighted positive score $=1.7/2.1=0.810$</li>
    </ol>
    <p>The weaker negative rule is not ignored, but it no longer cancels two stronger positive signals.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>High coverage with low precision.</b> A function with large $c_k$ can dominate majority vote while being wrong on broad regions.</li>
      <li><b>Hidden correlated errors.</b> Two rules that use the same keyword are not independent annotators; their agreement overstates confidence.</li>
      <li><b>Not tracking abstentions.</b> The $-1$ entries define where weak labels are unsupported; treating abstain as class $0$ silently changes the label distribution.</li>
    </ul>`
};

/* ---------------- 18.6 Synthetic data generation ---------------- */
window.ALLML_CONTENT["18.6"] = {
  tagline: "Synthetic data is useful when it preserves the learning question, not merely when it creates more rows.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/18.6-synthetic-data-generation.ipynb",
  context: String.raw`
    <p>Synthetic generation sits after you understand the real data, because it must imitate the right structure and avoid imitating the wrong accidents.</p>
    <ul>
      <li><b>EDA (18.1)</b> supplies moment, segment, and range checks for generated samples.</li>
      <li><b>Sampling design (18.2)</b> defines the target mixture synthetic data should match or rebalance.</li>
      <li><b>Validation (18.8)</b> tests generated rows for plausibility, leakage, and memorization.</li>
    </ul>
    <p>Where it leads: augmentation (18.7) is a label-preserving special case, while data valuation (18.10) asks whether generated rows actually improve utility.</p>`,
  intuition: String.raw`
    <p>The concrete problem is scarcity: rare classes, privacy constraints, and expensive labels can leave too few examples. The naive approach says "generate more" and celebrates row count. But row count is not information. Bad synthetic data can copy private records, flatten minority structure, or teach artifacts the real world never contains.</p>
    <p>The mental model is a rehearsal stage. Synthetic examples are practice situations for the model, useful only if they rehearse the same skill it needs on real data. The design decision people miss is whether to generate unconditionally or conditionally. For supervised learning, class-conditional generation is often essential because matching the global distribution can still erase a rare class.</p>`,
  mathematics: String.raw`
    <p>A basic generator defines $\\tilde x\\sim q(x\\mid y)$ or $q(x)$, producing synthetic samples $\\tilde S$. We compare real and synthetic summaries such as means, standard deviations, class proportions, and nearest-neighbor distances to real records.</p>
    <p><b>Moment and balance checks.</b> For real values $\\{1,2,3,4\\}$ and synthetic values $\\{1.2,1.9,3.1,3.8\\}$:</p>
    <ol class="work">
      <li>real mean $=(1+2+3+4)/4=2.500$</li>
      <li>real standard deviation $=1.118$</li>
      <li>synthetic mean $=(1.2+1.9+3.1+3.8)/4=2.500$</li>
    </ol>
    <p>The mean matches, but that is only a first gate; spread, tails, and conditional structure still need checks.</p>
    <p><b>Privacy and utility.</b> For real points $\\{0,1,3,6\\}$ and synthetic points $\\{0.05,2.2,5.0\\}$:</p>
    <ol class="work">
      <li>nearest distances are $\\{0.05,0.8,1.0\\}$</li>
      <li>minimum distance $=0.05$, which is below a $0.10$ memorization warning threshold</li>
      <li>minority repair example: $5$ real positives plus $35$ synthetic positives gives $40$, matching $40$ negatives</li>
    </ol>
    <p>The same generator can help balance a class and still create privacy risk, so both utility and distance checks are part of the math.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Matching only the mean.</b> Equal $\\bar x$ does not guarantee equal variance, tail behavior, or label-conditional structure.</li>
      <li><b>Memorization disguised as generation.</b> Very small nearest-neighbor distance means synthetic rows may be copies with noise.</li>
      <li><b>Changing the target distribution accidentally.</b> Class-conditional generation must track the intended class mixture, or training and evaluation answer different questions.</li>
    </ul>`
};

/* ---------------- 18.7 Data augmentation strategies ---------------- */
window.ALLML_CONTENT["18.7"] = {
  tagline: "Augmentation teaches invariance by changing examples in ways that should not change their labels.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/18.7-data-augmentation-strategies.ipynb",
  context: String.raw`
    <p>Augmentation is synthetic data with a stricter promise: the label should survive the transformation.</p>
    <ul>
      <li><b>Synthetic generation (18.6)</b> creates new examples; augmentation constrains them to be near or equivalent to existing labeled examples.</li>
      <li><b>Labeling (18.4)</b> defines which transformations preserve meaning and which cross the annotation boundary.</li>
      <li><b>Validation (18.8)</b> checks augmented data for range, distribution, and train-serving skew.</li>
    </ul>
    <p>Where it leads: augmentation can improve robustness, but data valuation (18.10) is the final judge of whether extra transformed rows help.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that models often overreact to changes humans consider irrelevant. A small crop, tiny tabular jitter, or harmless wording variation should not flip the label. The naive approach hopes the model learns this invariance from limited data. Augmentation writes the invariance into the training set.</p>
    <p>The mental model is practicing the same melody in different keys. The song remains the same only if the transformation respects the task. The design decision people gloss over is the augmentation radius: too small teaches nothing new; too large crosses the decision boundary and manufactures label noise.</p>`,
  mathematics: String.raw`
    <p>An augmentation is a transformation $T$ such that $y(T(x))=y(x)$ for the task. For numeric jitter, $T(x)=x+\\epsilon$ with small noise $\\epsilon$; for mixup, $\\tilde x=\\lambda x_a+(1-\\lambda)x_b$ and $\\tilde y=\\lambda y_a+(1-\\lambda)y_b$.</p>
    <p><b>Small transformations.</b> For values $\\{1,2,3\\}$ and jitters $\\{0.1,-0.1,0.2\\}$:</p>
    <ol class="work">
      <li>augmented values $\\{1.1,1.9,3.2\\}$</li>
      <li>original mean $=(1+2+3)/3=2.000$</li>
      <li>combined mean $=(1+2+3+1.1+1.9+3.2)/6=2.033$</li>
    </ol>
    <p>The augmented cloud stays near the original examples, nudging the model toward local smoothness.</p>
    <p><b>When transformations change meaning.</b> If the true boundary is $x\\gt0$, shifting $x\\in[-1,1]$ by $0.8$ flips many labels:</p>
    <ol class="work">
      <li>among 80 evenly spaced points, the shifted decision disagrees with the original on $32$ points</li>
      <li>flip rate $=32/80=0.400$</li>
      <li>mixup with $x_1=(0,0)$, $x_2=(2,2)$, $\\lambda=0.3$ gives $\\tilde x=(1.4,1.4)$ and $\\tilde y=0.7$</li>
    </ol>
    <p>The same mechanism that regularizes can corrupt labels if the transformation violates the task's invariance.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Augmenting across the boundary.</b> The condition $y(T(x))=y(x)$ fails, so added rows become systematic label noise.</li>
      <li><b>Changing feature ranges.</b> Jitter can violate validation constraints, producing impossible values even when labels seem plausible.</li>
      <li><b>Evaluating on augmented copies.</b> If transformed versions of training rows leak into validation, the measured gain is memorization of invariance, not generalization.</li>
    </ul>`
};

/* ---------------- 18.8 Data quality & validation ---------------- */
window.ALLML_CONTENT["18.8"] = {
  tagline: "Validation turns data assumptions into executable checks that fail before models do.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/18.8-data-quality-validation.ipynb",
  context: String.raw`
    <p>Validation is the operational form of everything EDA discovered.</p>
    <ul>
      <li><b>EDA (18.1)</b> proposes expected ranges, distributions, and segment rates.</li>
      <li><b>Cleaning (18.3)</b> defines missingness assumptions that validation must enforce.</li>
      <li><b>Versioning (18.9)</b> records which checks passed for each data snapshot.</li>
    </ul>
    <p>Where it leads: without validation, synthetic data (18.6), augmentation (18.7), and weak labels (18.5) can drift silently into training.</p>`,
  intuition: String.raw`
    <p>The concrete problem is silent data failure. Models often keep producing predictions when a feature is out of range, a join duplicates rows, or a serving pipeline changes units. The naive approach waits for model metrics to fall. Validation catches the broken assumption at the data boundary.</p>
    <p>The mental model is a contract. Each feature promises a type, range, missingness budget, and distribution. The design decision people miss is that validation should be executable and versioned, not a prose checklist. If a rule matters, it should be code that can fail a pipeline.</p>`,
  mathematics: String.raw`
    <p>Common checks include schema shape $X\\in\\mathbb{R}^{m\\times d}$, range predicates such as $0\\le x\\le1$, missingness rate $\\frac{1}{m}\\sum_i\\mathbf{1}[x_i\\text{ missing}]$, and distribution shift metrics. Population Stability Index is $PSI=\\sum_b(q_b-p_b)\\log(q_b/p_b)$ over bins $b$.</p>
    <p><b>Ranges and missingness.</b> For serving scores $\\{0.5,0.6,1.7,0.8\\}$ expected in $[0,1]$:</p>
    <ol class="work">
      <li>violations are $\\{0,0,1,0\\}$, so count $=1$</li>
      <li>missingness rates for three features are $\\{0.25,0.50,0.50\\}$</li>
      <li>with budget $0.40$, features 2 and 3 fail because $0.50\\gt0.40$</li>
    </ol>
    <p>These checks are simple, but they prevent invalid numbers from entering a learner as if they were observations.</p>
    <p><b>Distribution shift.</b> With train bin proportions $p=\\{0.5,0.3,0.2\\}$ and serving $q=\\{0.3,0.4,0.3\\}$:</p>
    <ol class="work">
      <li>low-bin term $(0.3-0.5)\\log(0.3/0.5)=0.102$</li>
      <li>mid-bin term $(0.4-0.3)\\log(0.4/0.3)=0.029$</li>
      <li>high-bin term $(0.3-0.2)\\log(0.3/0.2)=0.041$, total $PSI=0.171$</li>
    </ol>
    <p>The PSI is not a model metric; it is an early warning that the input population has moved.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Only checking schema.</b> A table can have the right columns and still have shifted distributions or impossible values.</li>
      <li><b>Using thresholds without ownership.</b> A missingness budget or PSI alert needs a response path, or validation becomes ignored noise.</li>
      <li><b>Forgetting train-serving skew.</b> The same feature name can be computed differently online and offline; row-level diffs catch that mechanism.</li>
    </ul>`
};

/* ---------------- 18.9 Data versioning & lineage ---------------- */
window.ALLML_CONTENT["18.9"] = {
  tagline: "Data versioning makes model behavior reproducible by remembering exactly which data existed when.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/18.9-data-versioning-lineage.ipynb",
  context: String.raw`
    <p>Versioning and lineage bring software discipline to datasets.</p>
    <ul>
      <li><b>Validation (18.8)</b> says whether a snapshot passed; versioning records which snapshot that was.</li>
      <li><b>Cleaning (18.3)</b> and weak supervision (18.5) are transforms whose parameters belong in lineage, not in memory.</li>
      <li><b>Data valuation (18.10)</b> needs stable snapshots so a row's contribution can be traced to a model outcome.</li>
    </ul>
    <p>Where it leads: debugging, rollback, compliance, and scientific comparison all depend on knowing which data and transforms produced a model.</p>`,
  intuition: String.raw`
    <p>The concrete problem is reproducibility. A model trained on "yesterday's data" cannot be explained if yesterday's data was overwritten, cleaned with a changed rule, or joined against a moving table. The naive approach versions code but treats data as an ambient resource. That breaks the audit trail.</p>
    <p>The mental model is a supply chain. Raw records become cleaned rows, features, training sets, and models. The design decision people miss is that lineage must include transformations, not only files. Knowing the input table is not enough if you do not know the filter, join, label rule, and validation results.</p>`,
  mathematics: String.raw`
    <p>A dataset version can be identified by a content hash $h(D)$, a diff $D_{t+1}\\setminus D_t$, and a lineage graph whose edges are transforms. If model $M_j$ consumed snapshot $D_t$, impact tracing is a graph query from a bad version to downstream models.</p>
    <p><b>Hashes and diffs.</b> Compare old rows $\\{1,2,3,4\\}$ with new rows $\\{1,2,4,5\\}$:</p>
    <ol class="work">
      <li>added rows $=\\{5\\}$, count $1$</li>
      <li>removed rows $=\\{3\\}$, count $1$</li>
      <li>kept rows $=\\{1,2,4\\}$, count $3$</li>
    </ol>
    <p>A hash tells that the snapshot changed; the diff tells the kind of change a model owner can reason about.</p>
    <p><b>Lineage and rollback.</b> Raw values $\\{1,2,3\\}$ are filtered to $\\{2,3\\}$ and squared to features $\\{4,9\\}$:</p>
    <ol class="work">
      <li>row counts move raw $3$ to cleaned $2$ to featured $2$</li>
      <li>quality scores by version are $\\{0.91,0.93,0.62,0.94\\}$</li>
      <li>with pass threshold $0.90$, version 3 fails and the previous passing version is 2</li>
    </ol>
    <p>Lineage lets you reproduce the feature values, while versioned quality lets you roll back to a known-good snapshot rather than guessing.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Versioning filenames instead of contents.</b> A path can be reused; a content hash changes when bytes change.</li>
      <li><b>Losing transform parameters.</b> A snapshot without the cleaning and labeling code that produced it is not reproducible.</li>
      <li><b>No downstream index.</b> Without a model-to-data map, discovering a bad snapshot does not tell you which models need retraining.</li>
    </ul>`
};

/* ---------------- 18.10 Data valuation & Shapley for data ---------------- */
window.ALLML_CONTENT["18.10"] = {
  tagline: "Data Shapley asks how much each training example contributes when credit is averaged fairly across contexts.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/18.10-data-valuation-shapley-for-data.ipynb",
  context: String.raw`
    <p>Data valuation closes the data-centric loop by measuring which rows help.</p>
    <ul>
      <li><b>Versioning (18.9)</b> provides stable snapshots so the same row can be evaluated consistently.</li>
      <li><b>Validation (18.8)</b> identifies suspicious rows; valuation tests whether they actually harm utility.</li>
      <li><b>Labeling (18.4)</b> matters because mislabeled high-influence rows can have negative value.</li>
    </ul>
    <p>Where it leads: valuation informs data collection (18.2), cleaning (18.3), augmentation (18.7), and retraining budgets by ranking examples by marginal utility.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that datasets are not uniformly useful. Some examples define the decision boundary, some are redundant, and some are harmful. The naive approach counts rows or removes only obvious duplicates. Data Shapley asks a more precise question: if this row joined many possible training subsets, how much utility would it add on average?</p>
    <p>The mental model is group credit assignment. A player may look unimportant alone but be crucial with the right teammates. The design decision people gloss over is averaging across all coalitions. That is expensive, but it prevents credit from depending on one arbitrary training order.</p>`,
  mathematics: String.raw`
    <p>For training set $N$ with $n$ rows and utility $U(S)$ for subset $S$, the Shapley value of row $i$ is</p>
    <div class="formula-box">$$\\phi_i=\\sum_{S\\subseteq N\\setminus\\{i\\}}\\frac{|S|!(n-|S|-1)!}{n!}\big(U(S\\cup\\{i\\})-U(S)\\big).$$</div>
    <p>Here $U(S)$ might be validation accuracy after training on $S$; the weight averages row $i$'s marginal contribution over subset sizes and membership.</p>
    <p><b>Exact three-row example.</b> With one-nearest-neighbor utility on two test points, subset utilities include:</p>
    <ol class="work">
      <li>$U(\\varnothing)=0.000$, $U(\\{0\\})=0.500$, $U(\\{1\\})=0.500$, $U(\\{2\\})=0.500$</li>
      <li>$U(\\{0,2\\})=1.000$, $U(\\{1,2\\})=1.000$, $U(\\{0,1,2\\})=1.000$</li>
      <li>computed Shapley values are $\\phi=\\{0.250,0.250,0.500\\}$ and sum to $1.000=U(N)-U(\\varnothing)$</li>
    </ol>
    <p>Point 2 is worth more because it supplies the positive-side neighbor that half the test utility depends on.</p>
    <p><b>Negative value.</b> If point 1 is mislabeled and sits near the positive test case:</p>
    <ol class="work">
      <li>$U(\\{0,2\\})=1.000$ before adding it</li>
      <li>$U(\\{0,1,2\\})=0.500$ after adding it</li>
      <li>marginal contribution $=0.500-1.000=-0.500$</li>
    </ol>
    <p>A row can have negative value not because it is rare, but because it changes nearest-neighbor decisions in the wrong direction.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Interpreting Shapley as intrinsic worth.</b> $\\phi_i$ depends on the utility function, model family, validation set, and data snapshot.</li>
      <li><b>Ignoring interactions.</b> A row's marginal term $U(S\\cup\\{i\\})-U(S)$ can change sign depending on $S$; one leave-one-out score is not enough.</li>
      <li><b>Computing exact values at large scale.</b> The subset sum is exponential, so practical systems use approximations that need error checks.</li>
    </ul>`
};
