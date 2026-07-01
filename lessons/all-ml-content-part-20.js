/* All ML — authored content for Part 20: ML Systems, MLOps & Production (20.1–20.20).
   Appends to window.ALLML_CONTENT (merged into lessons by id in all-ml-register.js).
   Numeric examples were computed in Python before shipping. LaTeX via String.raw;
   emphasis is bold (no prose italics). */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

/* ---------------- 20.1 ML system design ---------------- */
window.ALLML_CONTENT["20.1"] = {
  tagline: "A production ML system is a set of tradeoffs: model quality matters only when latency, reliability, and ownership let the prediction arrive safely.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/20.1-ml-system-design.ipynb",
  context: String.raw`
<p>This lesson turns earlier modeling skill into a production decision. Supervised learning metrics feed the quality term, while deployment lessons turn those metrics into service-level constraints.</p>
    <p>Where it leads: the same budget language supports serving (20.7), monitoring (20.8), and cost optimization (20.19).</p>
  `,
  intuition: String.raw`
<p>The concrete problem is choosing a design that can survive real traffic, not just win an offline leaderboard. The naive approach picks the most accurate model and discovers later that it is too slow, too fragile, or impossible to operate.</p>
    <p>The overlooked design decision is to write the non-model constraints before model choice. That feels bureaucratic, but it prevents the model from silently consuming latency, reliability, and cost budgets that belong to the whole user experience.</p>
  `,
  mathematics: String.raw`
<p>The small production calculation we will use is $S=\sum_j w_j m_j$ with weights $w_j$ that sum to $1$. $m_j$ is a normalized metric such as quality, latency score, or reliability score; $S$ is the design score.</p>
    <ol class="work">
      <li>Traffic split: $10,000$ requests/day $	imes 0.30=3,000$ candidate calls, leaving $7,000$ on the safe path.</li>
      <li>Reliability through two required services: $0.995	imes0.990=0.98505$, so the chain is less reliable than either part alone.</li>
      <li>Latency budget: feature $35$ ms $+$ model $55$ ms $+$ postprocess $20$ ms $=110$ ms, under a $150$ ms target by $40$ ms.</li>
      <li>Capacity headroom: $120$ qps capacity $-$ $85$ qps load $=35$ qps, and $35/120=0.292$ of capacity remains.</li>
      <li>Weighted utility: $0.50	imes0.82+0.30	imes0.73+0.20	imes0.90=0.809$ for the design score.</li>
    </ol>
    <p>The arithmetic is deliberately small because production ML is often decided by ratios, thresholds, and budgets before it is decided by a larger model. Once the quantities are named, the engineering choice becomes inspectable instead of a matter of taste.</p>
  `,
  pitfalls: String.raw`
<ul>
      <li><b>Optimizing one metric.</b> If $S$ is replaced by accuracy alone, the latency and reliability terms disappear, so the chosen design can be mathematically best and operationally unusable.</li>
      <li><b>Multiplying availability too late.</b> Required dependencies combine as products, so a chain with many $0.99$ services falls faster than intuition expects.</li>
      <li><b>Budgeting averages instead of tails.</b> A mean latency under the target can still violate the user promise when p95 is outside the budget.</li>
    </ul>
  `
};

/* ---------------- 20.2 Data pipelines & feature stores ---------------- */
window.ALLML_CONTENT["20.2"] = {
  tagline: "Feature stores are contracts: the same value must be computed, timestamped, joined, and served the same way offline and online.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/20.2-data-pipelines-feature-stores.ipynb",
  context: String.raw`
<p>This lesson turns earlier modeling skill into a production decision. Data splitting and leakage control feed the point-in-time join; feature engineering feeds the reusable transformation contract.</p>
    <p>Where it leads: clean feature contracts make CI/CD (20.5), monitoring (20.8), and online inference (20.6) possible.</p>
  `,
  intuition: String.raw`
<p>The problem is that training wants history while serving wants the present. A naive pipeline computes whatever is convenient in each place, and the model learns from values it will never see at prediction time.</p>
    <p>The design decision people gloss over is the timestamp. A feature is not just a number; it is a number as of a time. That timestamp is what turns a pipeline from a spreadsheet into a reproducible production system.</p>
  `,
  mathematics: String.raw`
<p>The small production calculation we will use is $	ext{age}=t_{read}-t_{event}$ and $	ext{coverage}=n_{present}/n_{total}$. $t_{read}$ is prediction time, $t_{event}$ is when the source fact became true, and coverage is the fraction of usable rows.</p>
    <ol class="work">
      <li>Feature freshness: event time $100$ and read time $118$ gives age $118-100=18$ minutes, within a $30$ minute freshness SLA.</li>
      <li>Leaky join: label time $120$ but feature computed at $125$ gives $125-120=5$ minutes from the future, so it must be excluded.</li>
      <li>Coverage: $92$ present values out of $100$ rows gives $92/100=0.92$ coverage.</li>
      <li>Offline-online skew: offline mean $0.42$ and online mean $0.47$ differ by $|0.47-0.42|=0.05$.</li>
      <li>Fanout cost: $4$ features $	imes 3$ downstream consumers $=12$ feature reads to own and monitor.</li>
    </ol>
    <p>The arithmetic is deliberately small because production ML is often decided by ratios, thresholds, and budgets before it is decided by a larger model. Once the quantities are named, the engineering choice becomes inspectable instead of a matter of taste.</p>
  `,
  pitfalls: String.raw`
<ul>
      <li><b>Future leakage.</b> If $t_{feature}\gt t_{label}$, the join injects information from after the decision and inflates offline metrics.</li>
      <li><b>Silent skew.</b> Separate offline and online code paths change the mean term, so the model sees one distribution during training and another in service.</li>
      <li><b>Freshness without ownership.</b> An age SLA is meaningless unless the upstream source, transformation, and serving cache all expose the same timestamp.</li>
    </ul>
  `
};

/* ---------------- 20.3 Experiment tracking & reproducibility ---------------- */
window.ALLML_CONTENT["20.3"] = {
  tagline: "An experiment tracker is the memory of learning: it records data, code, config, seed, metric, and artifact so a result can be believed twice.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/20.3-experiment-tracking-reproducibility.ipynb",
  context: String.raw`
<p>This lesson turns earlier modeling skill into a production decision. Validation metrics feed run selection, while randomness and optimization feed the variance we must record rather than explain away.</p>
    <p>Where it leads: tracked runs become the inputs to registries (20.4), release gates (20.5), and evaluation harnesses (20.18).</p>
  `,
  intuition: String.raw`
<p>The concrete pain is the mysterious good run. Without tracking, a model can look better because of a seed, a stale dataset, or a forgotten config flag.</p>
    <p>The design decision is to treat a run as an immutable tuple. That discipline feels heavy until the first incident, when the ability to answer exactly what trained the model becomes the fastest path back to safety.</p>
  `,
  mathematics: String.raw`
<p>The small production calculation we will use is $r=(d,c,	heta,s,m,a)$ for data version, code commit, config, seed, metric, and artifact. $r$ is the run identity; changing any component creates a different scientific claim.</p>
    <ol class="work">
      <li>Seed variance: validation scores $0.811,0.824,0.817$ have mean 0.817.</li>
      <li>Hyperparameter sweep: losses $0.42,0.39,0.44$ choose $0.39$ as the minimum, not the most recent run.</li>
      <li>Reproducibility gap: rerun metric $0.816$ minus recorded metric $0.817$ equals -0.001, which is within a $0.005$ tolerance.</li>
      <li>Lineage count: $2$ data versions $	imes 3$ code commits $	imes 2$ configs $=12$ possible run identities.</li>
      <li>Test discipline: if validation $0.824$ selects a run and test $0.801$ reports it once, the observed gap is $0.824-0.801=0.023$.</li>
    </ol>
    <p>The arithmetic is deliberately small because production ML is often decided by ratios, thresholds, and budgets before it is decided by a larger model. Once the quantities are named, the engineering choice becomes inspectable instead of a matter of taste.</p>
  `,
  pitfalls: String.raw`
<ul>
      <li><b>Comparing unpaired runs.</b> If data version $d$ changes, the metric difference no longer isolates the model change.</li>
      <li><b>Selecting on the test metric.</b> The test value becomes part of the selection rule, so it stops estimating future performance cleanly.</li>
      <li><b>Ignoring seed variance.</b> A single metric hides optimizer noise; the mean and spread are the reproducible object.</li>
    </ul>
  `
};

/* ---------------- 20.4 Data & model versioning; model registry ---------------- */
window.ALLML_CONTENT["20.4"] = {
  tagline: "A registry turns model artifacts into governed releases: every candidate has lineage, compatibility, stage, and rollback semantics.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/20.4-data-model-versioning-registry.ipynb",
  context: String.raw`
<p>This lesson turns earlier modeling skill into a production decision. Experiment tracking (20.3) supplies immutable runs; feature stores (20.2) supply the input schema that the artifact expects.</p>
    <p>Where it leads: registries are the handoff point for CI/CD (20.5), deployment (20.7), and incident rollback in monitoring (20.8).</p>
  `,
  intuition: String.raw`
<p>The production problem is that a model file alone cannot answer whether it should serve traffic. You need to know what trained it, what it expects, whether it beat the champion, and how to return to the previous safe state.</p>
    <p>The design decision is to promote by pointer, not by copying mystery files. The stage pointer makes release and rollback auditable operations instead of folklore.</p>
  `,
  mathematics: String.raw`
<p>The small production calculation we will use is $\Delta=m_{candidate}-m_{champion}$ and promote when $\Delta\ge	au$. $m$ is the chosen registry metric and $	au$ is the minimum meaningful improvement.</p>
    <ol class="work">
      <li>Data version hash scope: $1000$ rows plus $12$ schema fields means both row content and schema must be named, not only the file path.</li>
      <li>Registry gate: candidate AUC $0.812$ minus champion $0.804$ equals 0.008, clearing a $0.005$ promotion rule.</li>
      <li>Rollback: version $7$ to version $6$ changes the served artifact by $1$ registry pointer, not by retraining.</li>
      <li>Compatibility: model expects $24$ features and serving provides $24$, so $24-24=0$ missing inputs.</li>
      <li>Retention: keeping $5$ model versions at $180$ MB each costs $5	imes180=900$ MB.</li>
    </ol>
    <p>The arithmetic is deliberately small because production ML is often decided by ratios, thresholds, and budgets before it is decided by a larger model. Once the quantities are named, the engineering choice becomes inspectable instead of a matter of taste.</p>
  `,
  pitfalls: String.raw`
<ul>
      <li><b>Versioning paths instead of content.</b> A filename can stay fixed while rows or schema change; the hash must cover the data and contract.</li>
      <li><b>Promoting without a champion comparison.</b> Absolute metrics hide regressions when the dataset changes; $\Delta$ is the release quantity.</li>
      <li><b>Rollback by retraining.</b> Retraining changes the artifact; rollback should move the served pointer to a known prior version.</li>
    </ul>
  `
};

/* ---------------- 20.5 CI/CD for ML ---------------- */
window.ALLML_CONTENT["20.5"] = {
  tagline: "ML CI/CD gates data, training, evaluation, packaging, and rollout so a model can change quickly without changing blindly.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/20.5-cicd-for-ml.ipynb",
  context: String.raw`
<p>This lesson turns earlier modeling skill into a production decision. Versioned artifacts (20.4) give the pipeline something precise to test; experiment metrics (20.3) define release thresholds.</p>
    <p>Where it leads: the same gates protect serving (20.7), online experiments (20.9), and edge releases (20.20).</p>
  `,
  intuition: String.raw`
<p>The pain is that model failures often pass normal software tests. Code can compile while the schema is wrong, the trainer is disconnected, or the candidate is statistically worse.</p>
    <p>The overlooked decision is to make gates cheap and staged. A tiny smoke train catches wiring first; a deeper evaluation catches quality second; a canary catches real production interaction last.</p>
  `,
  mathematics: String.raw`
<p>The small production calculation we will use is $	ext{release}=1$ only if every gate $g_k=1$. $g_k$ is a Boolean gate for schema, training, evaluation, packaging, and rollout safety.</p>
    <ol class="work">
      <li>Schema gate: expected $24$ columns and observed $23$ gives $24-23=1$ blocking mismatch.</li>
      <li>Smoke-train gate: tiny job loss from $0.90$ to $0.62$ improves by $0.28$, so the training loop is wired.</li>
      <li>Evaluation gate: candidate error $0.184$ versus maximum $0.190$ clears by $0.006$.</li>
      <li>Canary gate: $2,000$ requests at $0.4\%$ error gives $2000	imes0.004=8$ errors.</li>
      <li>Rollback trigger: live p95 $180$ ms minus budget $150$ ms equals $30$ ms over budget.</li>
    </ol>
    <p>The arithmetic is deliberately small because production ML is often decided by ratios, thresholds, and budgets before it is decided by a larger model. Once the quantities are named, the engineering choice becomes inspectable instead of a matter of taste.</p>
  `,
  pitfalls: String.raw`
<ul>
      <li><b>Only testing code.</b> The schema and metric gates are terms in the release product; if either is absent, bad data can pass as good software.</li>
      <li><b>One giant gate.</b> Expensive end-to-end tests slow every change; staged gates catch cheap failures early.</li>
      <li><b>No automatic rollback condition.</b> Without a live threshold, deployment becomes a human memory task exactly when latency or errors are already rising.</li>
    </ul>
  `
};

/* ---------------- 20.6 Batch vs online (real-time) inference ---------------- */
window.ALLML_CONTENT["20.6"] = {
  tagline: "Batch inference buys cheap scale with stale predictions; online inference buys freshness with latency and reliability pressure.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/20.6-batch-vs-online-inference.ipynb",
  context: String.raw`
<p>This lesson turns earlier modeling skill into a production decision. Feature freshness (20.2) defines the staleness term; system design (20.1) defines the latency and cost budgets.</p>
    <p>Where it leads: serving patterns (20.7), streaming ML (20.16), and cost optimization (20.19) all reuse this tradeoff.</p>
  `,
  intuition: String.raw`
<p>The concrete choice is when to compute a prediction: before the user arrives or while the user waits. The naive answer is always online, because fresh feels better, but freshness is not free.</p>
    <p>The key decision is whether the value of freshness exceeds the cost of waiting. Many production wins come from a hybrid: precompute what is stable, compute only the volatile part online.</p>
  `,
  mathematics: String.raw`
<p>The small production calculation we will use is $E[L]=hL_{cache}+(1-h)L_{online}$. $h$ is cache hit rate, $L_{cache}$ is cached latency, and $L_{online}$ is real-time latency.</p>
    <ol class="work">
      <li>Batch staleness: predictions refreshed every $6$ hours have worst-case age $6$ hours and average age $3$ hours.</li>
      <li>Online latency: feature lookup $25$ ms $+$ model $40$ ms $+$ network $15$ ms $=80$ ms.</li>
      <li>Batch cost: $1,000,000$ predictions at $0.00002$ dollars each costs $20.00$.</li>
      <li>Online peak load: $500$ qps $	imes 0.080$ seconds $=40$ concurrent in-flight requests.</li>
      <li>Hybrid cache hit rate: $70\%$ batch cache at $5$ ms and $30\%$ online at $80$ ms gives $0.7	imes5+0.3	imes80=27.5$ ms expected latency.</li>
    </ol>
    <p>The arithmetic is deliberately small because production ML is often decided by ratios, thresholds, and budgets before it is decided by a larger model. Once the quantities are named, the engineering choice becomes inspectable instead of a matter of taste.</p>
  `,
  pitfalls: String.raw`
<ul>
      <li><b>Optimizing freshness without latency.</b> Online inference lowers staleness but adds every component of the latency sum to the user path.</li>
      <li><b>Ignoring peak concurrency.</b> Average qps hides in-flight load; capacity must cover qps times latency.</li>
      <li><b>Throwing away hybrid designs.</b> The expected latency formula shows that even partial caching can dominate a pure online path.</li>
    </ul>
  `
};

/* ---------------- 20.7 Model serving & deployment ---------------- */
window.ALLML_CONTENT["20.7"] = {
  tagline: "Serving is the controlled movement from artifact to traffic: load, warm, route, observe, and roll back before users pay for surprises.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/20.7-model-serving-deployment.ipynb",
  context: String.raw`
<p>This lesson turns earlier modeling skill into a production decision. Registries (20.4) provide the artifact pointer; CI/CD (20.5) provides gates before the serving system accepts it.</p>
    <p>Where it leads: monitoring (20.8), A/B testing (20.9), and cost work (20.19) all start from these routing primitives.</p>
  `,
  intuition: String.raw`
<p>The problem is not just hosting a model; it is changing a prediction system while people are using it. The naive deployment replaces everything at once and learns from the outage.</p>
    <p>The design decision is progressive exposure. Canary, shadow, and blue-green patterns separate evaluation from user impact so evidence arrives before full commitment.</p>
  `,
  mathematics: String.raw`
<p>The small production calculation we will use is $r=\lceil q/c
ceil$ and $n_{canary}=lpha n$. $q$ is demand qps, $c$ is per-replica capacity, $lpha$ is routed fraction, and $n$ is total requests.</p>
    <ol class="work">
      <li>Traffic routing: $5\%$ canary of $40,000$ requests is $0.05	imes40000=2,000$ candidate requests.</li>
      <li>Warmup: compiling for $30$ seconds before traffic avoids adding $30$ seconds to the first user request.</li>
      <li>Autoscale need: $900$ qps demand divided by $150$ qps per replica gives $900/150=6$ replicas.</li>
      <li>Shadow mode: $10,000$ mirrored requests at $0\%$ user exposure gives $10,000$ model evaluations and $0$ served responses.</li>
      <li>Blue-green cutover: error rate $0.003$ versus limit $0.005$ leaves $0.002$ absolute margin.</li>
    </ol>
    <p>The arithmetic is deliberately small because production ML is often decided by ratios, thresholds, and budgets before it is decided by a larger model. Once the quantities are named, the engineering choice becomes inspectable instead of a matter of taste.</p>
  `,
  pitfalls: String.raw`
<ul>
      <li><b>Cold-starting under traffic.</b> Warmup cost belongs before routing; otherwise the latency term hits the first users.</li>
      <li><b>Confusing shadow with canary.</b> Shadow has evaluations but no served responses, so it can reveal errors but not user behavior.</li>
      <li><b>Scaling on average load.</b> Replica count must cover peak demand and tail latency, not only the mean qps.</li>
    </ul>
  `
};

/* ---------------- 20.8 Monitoring & drift detection ---------------- */
window.ALLML_CONTENT["20.8"] = {
  tagline: "Monitoring asks whether the world still matches the training contract: features, predictions, labels, and business outcomes are all time series.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/20.8-monitoring-drift-detection.ipynb",
  context: String.raw`
<p>This lesson turns earlier modeling skill into a production decision. Feature stores (20.2) provide the distributions to compare; registries (20.4) identify which model produced the live stream.</p>
    <p>Where it leads: drift alerts drive rollback in serving (20.7), re-training in CI/CD (20.5), and evaluation harness updates (20.18).</p>
  `,
  intuition: String.raw`
<p>The concrete pain is that a model can fail without throwing an exception. Inputs still have the right shape, but their distribution has moved.</p>
    <p>The design decision is to monitor mechanisms, not only dashboards. Feature drift, prediction drift, and delayed label metrics answer different questions, so one alert cannot replace the others.</p>
  `,
  mathematics: String.raw`
<p>The small production calculation we will use is $PSI=\sum_b (p_b-q_b)\ln(p_b/q_b)$ and $z=(\mu_{live}-\mu_{base})/\sigma_{base}$. $p_b$ and $q_b$ are baseline and live bin probabilities; $z$ measures mean shift in baseline standard deviations.</p>
    <ol class="work">
      <li>Population Stability Index bin: expected $0.20$, observed $0.30$ gives $(0.30-0.20)\ln(0.30/0.20)=0.0405$.</li>
      <li>Mean shift: baseline mean $10.0$, live mean $11.5$, baseline std $2.0$ gives z-shift $(11.5-10.0)/2.0=0.75$.</li>
      <li>KS gap: max CDF difference between $0.62$ and $0.47$ is $|0.62-0.47|=0.15$.</li>
      <li>Metric drift: AUC falls from $0.812$ to $0.781$, a drop of $0.031$.</li>
      <li>Alert rule: drift score $0.26$ exceeds threshold $0.20$ by $0.06$.</li>
    </ol>
    <p>The arithmetic is deliberately small because production ML is often decided by ratios, thresholds, and budgets before it is decided by a larger model. Once the quantities are named, the engineering choice becomes inspectable instead of a matter of taste.</p>
  `,
  pitfalls: String.raw`
<ul>
      <li><b>Alerting on labels only.</b> Labels arrive late, so feature and prediction terms are the early-warning system.</li>
      <li><b>Using live variance in the denominator.</b> The z-shift is anchored to the baseline contract; changing the denominator can hide drift.</li>
      <li><b>Ignoring small bins.</b> PSI terms can explode when $q_b$ or $p_b$ is near zero, so smoothing and bin ownership matter.</li>
    </ul>
  `
};

/* ---------------- 20.9 A/B testing & online experimentation ---------------- */
window.ALLML_CONTENT["20.9"] = {
  tagline: "Online experiments estimate causal product impact by comparing randomized traffic, not by trusting before-after movement.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/20.9-ab-testing-online-experimentation.ipynb",
  context: String.raw`
<p>This lesson turns earlier modeling skill into a production decision. Serving (20.7) supplies traffic splitting; monitoring (20.8) supplies guardrails and delayed outcome checks.</p>
    <p>Where it leads: experiment results guide registry promotion (20.4), prompt releases (20.17), and cost-quality tradeoffs (20.19).</p>
  `,
  intuition: String.raw`
<p>The pain is that product metrics move for many reasons at once. A before-after chart confounds seasonality, traffic mix, and model change.</p>
    <p>The design decision is randomization with predeclared metrics. It feels slower than shipping to everyone, but it buys the one thing observational logs cannot: a clean counterfactual.</p>
  `,
  mathematics: String.raw`
<p>The small production calculation we will use is $z=(\hat p_T-\hat p_C)/\sqrt{\hat p(1-\hat p)(1/n_T+1/n_C)}$. $\hat p_T$ and $\hat p_C$ are treatment and control rates; $\hat p$ is the pooled null rate.</p>
    <ol class="work">
      <li>Control conversion: $480/10000=0.048$ and treatment conversion: $520/10000=0.052$.</li>
      <li>Lift: $0.052-0.048=0.004$ absolute, or $0.004/0.048=0.083$ relative.</li>
      <li>Pooled rate: $(520+480)/(10000+10000)=0.050$.</li>
      <li>Standard error: $\sqrt{0.05	imes0.95	imes(1/10000+1/10000)}=0.00308$.</li>
      <li>Z score: $0.004/0.00308=1.298$, which is strong but still must be checked against experiment design and guardrails.</li>
    </ol>
    <p>The arithmetic is deliberately small because production ML is often decided by ratios, thresholds, and budgets before it is decided by a larger model. Once the quantities are named, the engineering choice becomes inspectable instead of a matter of taste.</p>
  `,
  pitfalls: String.raw`
<ul>
      <li><b>Peeking until significant.</b> Repeated looks change the error rate because the stopping rule becomes part of the test.</li>
      <li><b>Ignoring guardrails.</b> A positive primary lift can hide latency or quality regressions in other monitored terms.</li>
      <li><b>Underpowered experiments.</b> If the standard error is larger than the expected lift, a null result may only mean the test was too small.</li>
    </ul>
  `
};

/* ---------------- 20.10 Model compression: pruning ---------------- */
window.ALLML_CONTENT["20.10"] = {
  tagline: "Pruning removes parameters whose contribution is small enough that the system prefers speed, size, or simplicity over unused capacity.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/20.10-pruning.ipynb",
  context: String.raw`
<p>This lesson turns earlier modeling skill into a production decision. Regularization and feature importance feed the idea that not every parameter matters equally; serving constraints (20.7) provide the reason to remove some.</p>
    <p>Where it leads: pruning pairs with quantization (20.11), distillation (20.12), and edge deployment (20.20).</p>
  `,
  intuition: String.raw`
<p>The concrete problem is an overlarge model that meets quality but misses a memory or latency budget. The naive response is to train a smaller model from scratch, throwing away what the large model learned.</p>
    <p>The overlooked decision is the pruning unit: individual weights, channels, heads, or blocks. Unstructured sparsity can look impressive mathematically while hardware sees little speedup.</p>
  `,
  mathematics: String.raw`
<p>The small production calculation we will use is $	ext{sparsity}=n_{pruned}/n_{total}$ and $	ext{cost}pprox (1-	ext{sparsity})C_{dense}$. $n_{pruned}$ counts removed parameters and $C_{dense}$ is dense compute before sparse overhead.</p>
    <ol class="work">
      <li>Magnitude pruning threshold: weights $0.02, -0.50, 0.10, 0.80$ with threshold $0.10$ prune only $0.02$, leaving $3/4=0.75$ density.</li>
      <li>Sparsity: pruning $7$ of $20$ weights gives $7/20=0.35$ sparsity.</li>
      <li>FLOP proxy: dense cost $100$ and density $0.65$ gives $100	imes0.65=65$ effective multiply-adds before overhead.</li>
      <li>Accuracy proxy: base $0.820$ minus pruning loss $0.012$ gives $0.808$.</li>
      <li>Fine-tune recovery: $0.808+0.007=0.815$, leaving $0.820-0.815=0.005$ from baseline.</li>
    </ol>
    <p>The arithmetic is deliberately small because production ML is often decided by ratios, thresholds, and budgets before it is decided by a larger model. Once the quantities are named, the engineering choice becomes inspectable instead of a matter of taste.</p>
  `,
  pitfalls: String.raw`
<ul>
      <li><b>Counting zeros as speed.</b> The density term lowers arithmetic only if the runtime exploits that sparsity pattern.</li>
      <li><b>Pruning by magnitude only once.</b> A single threshold can remove weights that matter jointly; iterative prune-and-fine-tune is safer.</li>
      <li><b>Ignoring structured constraints.</b> Removing random weights may save memory but not latency; channel or block pruning better matches hardware.</li>
    </ul>
  `
};

/* ---------------- 20.11 Model compression: quantization ---------------- */
window.ALLML_CONTENT["20.11"] = {
  tagline: "Quantization stores and computes with fewer bits by choosing a scale that maps real weights into a small integer grid.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/20.11-quantization.ipynb",
  context: String.raw`
<p>This lesson turns earlier modeling skill into a production decision. Numerical linear algebra supplies the scale-and-round operation; production budgets (20.1) explain why memory bandwidth can matter as much as parameter count.</p>
    <p>Where it leads: quantization is a partner to pruning (20.10), distillation (20.12), and on-device inference (20.20).</p>
  `,
  intuition: String.raw`
<p>The problem is that full-precision models often spend more time moving bytes than doing math. A naive lower-bit conversion can destroy quality if the grid is poorly calibrated.</p>
    <p>The design decision is calibration range. A wide range prevents clipping but wastes integer levels; a tight range improves resolution for common values but clips rare extremes.</p>
  `,
  mathematics: String.raw`
<p>The small production calculation we will use is $q=\operatorname{round}(x/s)$ and $\hat x=sq$. $x$ is the real value, $s$ is scale, $q$ is the stored integer, and $\hat x$ is the dequantized value.</p>
    <ol class="work">
      <li>Symmetric int8 scale: max absolute value $1.8$ gives scale $1.8/127=0.01417$.</li>
      <li>Quantize $0.73$: round$(0.73/0.01417)=52$.</li>
      <li>Dequantize: $52	imes0.01417=0.737$, so error is $0.007$.</li>
      <li>Memory: $1,000,000$ float32 weights use $4.0$ MB, int8 uses $1.0$ MB, saving $3.0$ MB.</li>
      <li>Clipping: value $2.2$ with calibration max $1.8$ is clipped by $2.2-1.8=0.4$ before quantization.</li>
    </ol>
    <p>The arithmetic is deliberately small because production ML is often decided by ratios, thresholds, and budgets before it is decided by a larger model. Once the quantities are named, the engineering choice becomes inspectable instead of a matter of taste.</p>
  `,
  pitfalls: String.raw`
<ul>
      <li><b>Forgetting calibration data.</b> The scale term is learned from observed ranges; bad calibration makes either clipping or coarse rounding worse.</li>
      <li><b>Assuming memory savings equal latency savings.</b> Int8 reduces bytes, but speed also depends on runtime kernels and hardware support.</li>
      <li><b>Using one scale for unlike channels.</b> Per-tensor scale can waste resolution when channels have very different ranges.</li>
    </ul>
  `
};

/* ---------------- 20.12 Knowledge distillation ---------------- */
window.ALLML_CONTENT["20.12"] = {
  tagline: "Distillation trains a smaller student to match a larger teacher, preserving useful probability structure while meeting production budgets.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/20.12-distillation.ipynb",
  context: String.raw`
<p>This lesson turns earlier modeling skill into a production decision. Softmax and cross-entropy supply the training signal; compression lessons (20.10, 20.11) supply the deployment motivation.</p>
    <p>Where it leads: distilled students are common in serving (20.7), edge ML (20.20), and LLMOps routing (20.17).</p>
  `,
  intuition: String.raw`
<p>The pain is that the best model may be too large to serve. The naive response uses only hard labels, losing the teacher attention to near-miss classes.</p>
    <p>The overlooked decision is temperature. Higher temperature exposes the teacher ranking among wrong classes; too high makes the signal flat and uninformative.</p>
  `,
  mathematics: String.raw`
<p>The small production calculation we will use is $L=lpha L_{soft}(p_T^T,p_S^T)+(1-lpha)L_{hard}(y,p_S)$. $p_T^T$ and $p_S^T$ are teacher and student probabilities at temperature $T$; $lpha$ controls the blend.</p>
    <ol class="work">
      <li>Teacher softmax at temperature $2$: exponentials $e^1=2.718$, $e^{0.5}=1.649$, $e^0=1.000$ sum to 5.367.</li>
      <li>Soft target for class 1: $2.718/5.367=0.506$, less sharp than a one-hot label.</li>
      <li>Blend loss: $0.7	imes0.42+0.3	imes0.65=0.489$.</li>
      <li>Student size: $12$ million parameters versus teacher $120$ million gives $12/120=0.10$ of the size.</li>
      <li>Latency: teacher $90$ ms, student $18$ ms, speedup $90/18=5.0	imes$.</li>
    </ol>
    <p>The arithmetic is deliberately small because production ML is often decided by ratios, thresholds, and budgets before it is decided by a larger model. Once the quantities are named, the engineering choice becomes inspectable instead of a matter of taste.</p>
  `,
  pitfalls: String.raw`
<ul>
      <li><b>Using a temperature but not scaling the loss.</b> Temperature changes gradient scale, so implementations often multiply the soft loss by $T^2$.</li>
      <li><b>Trusting a weak teacher.</b> The student inherits teacher mistakes; distillation cannot create signal absent from the teacher.</li>
      <li><b>Only measuring accuracy.</b> The student may match top-1 while losing calibration, which matters for thresholds and routing.</li>
    </ul>
  `
};

/* ---------------- 20.13 Distributed training (data/model/pipeline parallelism) ---------------- */
window.ALLML_CONTENT["20.13"] = {
  tagline: "Distributed training is a negotiation between parallel compute and the communication needed to make that compute agree.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/20.13-distributed-training.ipynb",
  context: String.raw`
<p>This lesson turns earlier modeling skill into a production decision. Optimization supplies gradients; systems design (20.1) supplies bandwidth, memory, and failure constraints.</p>
    <p>Where it leads: runtime compilation (20.14), cost optimization (20.19), and large-model serving all reuse these scaling ideas.</p>
  `,
  intuition: String.raw`
<p>The problem is that one accelerator may be too slow or too small. The naive answer is to add workers and expect linear speedup, but gradients, activations, and pipeline bubbles all have to move.</p>
    <p>The key design decision is which dimension to split: data, model weights, or pipeline stages. Each split saves a different bottleneck and creates a different communication bill.</p>
  `,
  mathematics: String.raw`
<p>The small production calculation we will use is $T_{obs}=T_1/N+T_{comm}$ and $\eta=(T_1/T_{obs})/N$. $T_1$ is single-worker time, $N$ is worker count, $T_{comm}$ is overhead, and $\eta$ is efficiency.</p>
    <ol class="work">
      <li>Data parallel ideal: $8$ workers on a $160$ minute job gives $160/8=20$ minutes before overhead.</li>
      <li>Communication overhead: $20$ ideal minutes plus $5$ communication minutes gives $25$ minutes observed.</li>
      <li>Speedup: $160/25=6.4	imes$, efficiency $6.4/8=0.80$.</li>
      <li>All-reduce payload: $50$ million gradients at $4$ bytes each is $200$ MB per synchronization.</li>
      <li>Pipeline bubbles: $4$ stages and $12$ microbatches give utilization $12/(12+4-1)=0.800$.</li>
    </ol>
    <p>The arithmetic is deliberately small because production ML is often decided by ratios, thresholds, and budgets before it is decided by a larger model. Once the quantities are named, the engineering choice becomes inspectable instead of a matter of taste.</p>
  `,
  pitfalls: String.raw`
<ul>
      <li><b>Expecting linear speedup.</b> The $T_{comm}$ term stays after compute divides, so efficiency falls as communication grows.</li>
      <li><b>Ignoring synchronization payload.</b> Gradient size times bytes per value sets a hard bandwidth cost.</li>
      <li><b>Too few microbatches.</b> Pipeline stages sit idle during bubbles; utilization depends on microbatch count.</li>
    </ul>
  `
};

/* ---------------- 20.14 Compilation & runtimes (XLA, TVM, ONNX) ---------------- */
window.ALLML_CONTENT["20.14"] = {
  tagline: "ML compilers turn model graphs into faster executable plans by fusing operations, specializing shapes, and targeting hardware kernels.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/20.14-compilation-runtimes.ipynb",
  context: String.raw`
<p>This lesson turns earlier modeling skill into a production decision. Tensor computation and deployment (20.7) provide the graph and latency budget; quantization (20.11) often changes the available kernels.</p>
    <p>Where it leads: compiled graphs matter for distributed training (20.13), latency optimization (20.19), and edge deployment (20.20).</p>
  `,
  intuition: String.raw`
<p>The pain is that a model written as many elegant operations can run as many small, memory-heavy kernels. The naive view counts math; the runtime often waits on memory traffic.</p>
    <p>The overlooked decision is which assumptions the compiler may freeze. Static shapes unlock speed, but dynamic shapes preserve flexibility. Production systems choose that trade deliberately.</p>
  `,
  mathematics: String.raw`
<p>The small production calculation we will use is $	ext{speedup}=T_{eager}/T_{compiled}$ and $|y_c-y_e|\le\epsilon$. $T$ is latency, $y_c$ and $y_e$ are compiled and eager outputs, and $\epsilon$ is the numerical tolerance.</p>
    <ol class="work">
      <li>Operator fusion: two memory reads of $4$ MB each become one $4$ MB read, saving $4$ MB of traffic.</li>
      <li>Constant folding: $3	imes4+2=14$ is computed once at compile time instead of every request.</li>
      <li>Shape specialization: static batch $32$ and feature $128$ means matrix input has $32	imes128=4096$ elements.</li>
      <li>Kernel speed: unfused $1.8$ ms versus fused $1.1$ ms saves $0.7$ ms.</li>
      <li>Numerical tolerance: compiled output $0.731$ versus eager $0.730$ differs by $0.001$, under a $0.005$ tolerance.</li>
    </ol>
    <p>The arithmetic is deliberately small because production ML is often decided by ratios, thresholds, and budgets before it is decided by a larger model. Once the quantities are named, the engineering choice becomes inspectable instead of a matter of taste.</p>
  `,
  pitfalls: String.raw`
<ul>
      <li><b>Benchmarking without warmup.</b> Compilation time is not steady-state inference time; mixing them misstates latency.</li>
      <li><b>Freezing the wrong shape.</b> Shape specialization can reject real traffic if the serving batches differ from the compiled assumption.</li>
      <li><b>Ignoring numerical tolerance.</b> Reordered floating-point operations can differ slightly; equality is the wrong correctness test.</li>
    </ul>
  `
};

/* ---------------- 20.15 Vector databases & ANN infra ---------------- */
window.ALLML_CONTENT["20.15"] = {
  tagline: "Vector databases make nearest-neighbor search operational by trading exactness for indexed candidate generation, recall, latency, and memory.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/20.15-vector-databases-ann.ipynb",
  context: String.raw`
<p>This lesson turns earlier modeling skill into a production decision. Embeddings supply the vector geometry; system design (20.1) supplies the latency and memory budgets.</p>
    <p>Where it leads: ANN infrastructure supports retrieval in LLMOps (20.17), online serving (20.7), and cost tuning (20.19).</p>
  `,
  intuition: String.raw`
<p>The concrete problem is that exact search over millions of vectors is too slow for many user paths. The naive method compares the query to everything.</p>
    <p>The design decision is how much of the space to search. ANN indexes deliberately miss some candidates to save time; recall is the price tag on that shortcut.</p>
  `,
  mathematics: String.raw`
<p>The small production calculation we will use is $\cos(q,x)=q^	op x/(\|q\|\|x\|)$ and $	ext{recall@}k=r/k$. $q$ is the query vector, $x$ is a candidate, and $r$ is the number of true top-$k$ neighbors recovered.</p>
    <ol class="work">
      <li>Cosine similarity: dot product $0.80$ and unit norms give $0.80/(1	imes1)=0.80$.</li>
      <li>Recall@$10$: $7$ true neighbors recovered out of $10$ gives $7/10=0.70$.</li>
      <li>IVF candidate set: probing $3$ lists with $120$ vectors each scans $3	imes120=360$ vectors.</li>
      <li>Latency-recall trade: increasing probes from $3$ to $8$ raises scanned vectors from $360$ to $960$.</li>
      <li>Memory: $1,000,000$ vectors $	imes 128$ dims $	imes 4$ bytes is $512$ MB.</li>
    </ol>
    <p>The arithmetic is deliberately small because production ML is often decided by ratios, thresholds, and budgets before it is decided by a larger model. Once the quantities are named, the engineering choice becomes inspectable instead of a matter of taste.</p>
  `,
  pitfalls: String.raw`
<ul>
      <li><b>Reporting latency without recall.</b> ANN can be made fast by searching too little; recall@k names what was lost.</li>
      <li><b>Ignoring embedding normalization.</b> Dot product and cosine rank differently unless vector norms are controlled.</li>
      <li><b>Forgetting index freshness.</b> A fast index serving stale vectors is a feature-store problem in disguise.</li>
    </ul>
  `
};

/* ---------------- 20.16 Streaming & real-time ML ---------------- */
window.ALLML_CONTENT["20.16"] = {
  tagline: "Streaming ML turns event time into continuously updated features and decisions, while watermarks decide when late data is still allowed to matter.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/20.16-streaming-real-time-ml.ipynb",
  context: String.raw`
<p>This lesson turns earlier modeling skill into a production decision. Feature stores (20.2) supply the same transformation contract; online inference (20.6) supplies the freshness requirement.</p>
    <p>Where it leads: streaming features feed monitoring (20.8), real-time serving (20.7), and LLMOps guardrails (20.17).</p>
  `,
  intuition: String.raw`
<p>The pain is that events arrive out of order while users expect current predictions. A naive stream processes arrival order and quietly corrupts time-based features.</p>
    <p>The key decision is event time rather than processing time. Watermarks accept that late data exists and make lateness an explicit contract.</p>
  `,
  mathematics: String.raw`
<p>The small production calculation we will use is $w=t_{max}-\ell$ and $x_t=lpha v_t+(1-lpha)x_{t-1}$. $w$ is the watermark, $\ell$ is allowed lateness, and $x_t$ is an exponentially updated streaming feature.</p>
    <ol class="work">
      <li>Tumbling window: events at minutes $1,3,7$ in a $5$ minute window give counts $2$ in $[0,5)$ and $1$ in $[5,10)$.</li>
      <li>Watermark: max event time $100$ with $10$ minute lateness gives watermark $90$.</li>
      <li>Late event: event time $88$ is late because $88\lt90$.</li>
      <li>Exponential feature: new value $0.6	imes10+0.4	imes7=8.8$.</li>
      <li>Backpressure: input $1200$ events/s and processing $1000$ events/s accumulates $200$ events/s of lag.</li>
    </ol>
    <p>The arithmetic is deliberately small because production ML is often decided by ratios, thresholds, and budgets before it is decided by a larger model. Once the quantities are named, the engineering choice becomes inspectable instead of a matter of taste.</p>
  `,
  pitfalls: String.raw`
<ul>
      <li><b>Using processing time for labels.</b> Arrival order can differ from event order, so windows become historically wrong.</li>
      <li><b>Setting lateness to zero.</b> That lowers latency but drops legitimate delayed events, biasing features.</li>
      <li><b>Ignoring backpressure.</b> When input exceeds processing rate, freshness degrades even if code is correct.</li>
    </ul>
  `
};

/* ---------------- 20.17 LLMOps & prompt management ---------------- */
window.ALLML_CONTENT["20.17"] = {
  tagline: "LLMOps treats prompts, retrieval context, tools, and evals as versioned production artifacts rather than informal strings.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/20.17-llmops-prompt-management.ipynb",
  context: String.raw`
<p>This lesson turns earlier modeling skill into a production decision. Experiment tracking (20.3) supplies versioned comparisons; vector search (20.15) supplies retrieval context that prompts consume.</p>
    <p>Where it leads: evaluation harnesses (20.18), online experiments (20.9), and cost optimization (20.19) are the release machinery for prompts.</p>
  `,
  intuition: String.raw`
<p>The problem is that changing a prompt can change behavior as much as changing model weights. The naive workflow edits text until examples look good and loses the ability to explain regressions.</p>
    <p>The overlooked decision is to version the whole interaction contract: prompt, model, retrieval policy, tool schema, and eval set. A prompt alone is not the system.</p>
  `,
  mathematics: String.raw`
<p>The small production calculation we will use is $C=t_{in}c_{in}+t_{out}c_{out}$ and $	ext{pass}=n_{pass}/n$. $t$ are token counts, $c$ are token prices, and pass rate is measured on a fixed eval set.</p>
    <ol class="work">
      <li>Prompt version lift: pass rate $0.74$ minus $0.69$ equals $0.05$.</li>
      <li>Context budget: system $500$ tokens plus retrieval $1,800$ plus user $300$ equals $2,600$ tokens.</li>
      <li>Cost: $2,600$ input tokens at $0.000002$ dollars/token costs $0.0052$.</li>
      <li>Fallback routing: if $8\%$ of prompts go to a large model, $10,000	imes0.08=800$ large-model calls.</li>
      <li>Regression rate: $3$ failed golden cases out of $60$ gives $3/60=0.05$.</li>
    </ol>
    <p>The arithmetic is deliberately small because production ML is often decided by ratios, thresholds, and budgets before it is decided by a larger model. Once the quantities are named, the engineering choice becomes inspectable instead of a matter of taste.</p>
  `,
  pitfalls: String.raw`
<ul>
      <li><b>Versioning only the prompt text.</b> Retrieval and tool schema changes alter behavior while the prompt string stays identical.</li>
      <li><b>Evaluating only happy paths.</b> Golden cases must include refusals, malformed inputs, and edge contexts because prompts fail by behavior, not syntax.</li>
      <li><b>Ignoring token budgets.</b> Context that exceeds budget is truncated, so the retrieval term can silently remove evidence.</li>
    </ul>
  `
};

/* ---------------- 20.18 Evaluation harnesses ---------------- */
window.ALLML_CONTENT["20.18"] = {
  tagline: "An evaluation harness is a repeatable measurement machine: fixed cases, metrics, slices, uncertainty, and release thresholds.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/20.18-evaluation-harnesses.ipynb",
  context: String.raw`
<p>This lesson turns earlier modeling skill into a production decision. Experiment tracking (20.3) supplies run identity; monitoring (20.8) tells which slices and failures the harness must cover.</p>
    <p>Where it leads: harnesses govern LLMOps (20.17), CI/CD (20.5), and model registry promotion (20.4).</p>
  `,
  intuition: String.raw`
<p>The concrete pain is that informal examples make every release feel persuasive and incomparable. A harness forces the model to face the same cases every time.</p>
    <p>The design decision is to preserve both aggregate and slice views. A single average can approve a model that harms an important subgroup.</p>
  `,
  mathematics: String.raw`
<p>The small production calculation we will use is $\hat m=rac1n\sum_i s_i$ and $	ext{win}=w/(w+l)$. $s_i$ is a case score, $n$ is case count, and $w,l$ are pairwise wins and losses.</p>
    <ol class="work">
      <li>Accuracy: $87$ correct out of $100$ gives $87/100=0.87$.</li>
      <li>Slice metric: mobile $42/50=0.84$ while desktop $45/50=0.90$, a slice gap of $0.06$.</li>
      <li>Bootstrap mean: sample scores $0.80,0.85,0.90$ average to 0.85.</li>
      <li>Pairwise win rate: candidate wins $34$ of $60$ comparisons, $34/60=0.567$.</li>
      <li>Release threshold: pass rate $0.92$ exceeds threshold $0.90$ by $0.02$.</li>
    </ol>
    <p>The arithmetic is deliberately small because production ML is often decided by ratios, thresholds, and budgets before it is decided by a larger model. Once the quantities are named, the engineering choice becomes inspectable instead of a matter of taste.</p>
  `,
  pitfalls: String.raw`
<ul>
      <li><b>Letting the eval set drift unnoticed.</b> If cases change, metric movement mixes model change with benchmark change.</li>
      <li><b>Only reporting the mean.</b> Slice terms reveal localized regressions that the average hides.</li>
      <li><b>No release threshold.</b> Without a threshold, evaluation produces numbers but not decisions.</li>
    </ul>
  `
};

/* ---------------- 20.19 Cost & latency optimization ---------------- */
window.ALLML_CONTENT["20.19"] = {
  tagline: "Cost and latency optimization finds the cheapest path that still satisfies quality and tail-latency promises.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/20.19-cost-latency-optimization.ipynb",
  context: String.raw`
<p>This lesson turns earlier modeling skill into a production decision. System design (20.1) supplies budgets; serving (20.7), quantization (20.11), and ANN (20.15) supply the knobs.</p>
    <p>Where it leads: edge ML (20.20) is the strongest version of the same budget discipline.</p>
  `,
  intuition: String.raw`
<p>The problem is that production systems are paid for per request and judged by slow users. The naive average hides both cloud bills and tail pain.</p>
    <p>The overlooked decision is to optimize the objective that matches the product promise. Sometimes p95 matters more than mean; sometimes a small model plus fallback beats one large model everywhere.</p>
  `,
  mathematics: String.raw`
<p>The small production calculation we will use is $E[L]=hL_h+(1-h)L_m$ and $	ext{cost}=nc$. $h$ is hit rate or cheap-route fraction, $L$ terms are latencies, $n$ is call count, and $c$ is unit cost.</p>
    <ol class="work">
      <li>Tail latency: sorted latencies have p95 $180$ ms while p50 is $72$ ms, so tail is $180/72=2.5	imes$ median.</li>
      <li>Batching: $8$ requests in a $40$ ms batch gives $40/8=5$ ms amortized compute per request before queueing.</li>
      <li>Cache expected latency: hit rate $0.60$, hit $4$ ms, miss $80$ ms gives $0.6	imes4+0.4	imes80=34.4$ ms.</li>
      <li>Model tiering: $70\%$ small model at $10$ ms and $30\%$ large at $60$ ms gives $25$ ms expected model latency.</li>
      <li>Cost: $1,000,000$ calls at $0.00003$ dollars each costs $30.00$.</li>
    </ol>
    <p>The arithmetic is deliberately small because production ML is often decided by ratios, thresholds, and budgets before it is decided by a larger model. Once the quantities are named, the engineering choice becomes inspectable instead of a matter of taste.</p>
  `,
  pitfalls: String.raw`
<ul>
      <li><b>Optimizing p50 only.</b> Users in the tail experience the p95 term, not the median.</li>
      <li><b>Batching without queue accounting.</b> Amortized compute falls, but waiting for the batch can raise end-to-end latency.</li>
      <li><b>Ignoring routing quality.</b> A cheap tier must have a confidence or difficulty rule, or savings come from serving worse answers.</li>
    </ul>
  `
};

/* ---------------- 20.20 Edge & on-device ML ---------------- */
window.ALLML_CONTENT["20.20"] = {
  tagline: "Edge ML moves prediction onto the device, trading cloud control for privacy, offline availability, latency, memory, and battery constraints.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/20.20-edge-on-device-ml.ipynb",
  context: String.raw`
<p>This lesson turns earlier modeling skill into a production decision. Compression (20.10, 20.11, 20.12) supplies smaller artifacts; cost and latency optimization (20.19) supplies the budget thinking.</p>
    <p>Where it leads: on-device design closes the production arc by forcing every previous MLOps decision into a small, user-owned environment.</p>
  `,
  intuition: String.raw`
<p>The concrete problem is serving useful predictions when the network is slow, expensive, private, or absent. The naive cloud-only design fails exactly when the device context matters most.</p>
    <p>The key decision is what stays local and what remains server-side. Local inference improves privacy and latency, but updates, monitoring, and model governance become harder.</p>
  `,
  mathematics: String.raw`
<p>The small production calculation we will use is $M=M_{model}+M_{runtime}+M_{features}$ and $E=e\,n$. $M$ is memory footprint, $E$ is daily energy, $e$ is energy per inference, and $n$ is inferences per day.</p>
    <ol class="work">
      <li>Memory budget: model $18$ MB plus runtime $12$ MB plus features $6$ MB equals $36$ MB under a $64$ MB device budget.</li>
      <li>Battery proxy: $120$ mJ per inference at $50$ inferences/day uses $6,000$ mJ per day.</li>
      <li>Offline availability: if network is unavailable $15\%$ of the time, on-device inference covers that $0.15$ fraction.</li>
      <li>Update download: $18$ MB model over $6$ MB/s takes $18/6=3$ seconds.</li>
      <li>Privacy aggregation: sending $20$ counters instead of $1,000$ raw events reduces transmitted records by $980$.</li>
    </ol>
    <p>The arithmetic is deliberately small because production ML is often decided by ratios, thresholds, and budgets before it is decided by a larger model. Once the quantities are named, the engineering choice becomes inspectable instead of a matter of taste.</p>
  `,
  pitfalls: String.raw`
<ul>
      <li><b>Counting only model size.</b> The memory formula includes runtime and feature buffers, which can dominate on small devices.</li>
      <li><b>Ignoring update mechanics.</b> A good model that users cannot download or safely roll back is not deployable.</li>
      <li><b>Losing observability.</b> Privacy-preserving aggregation reduces raw logs, so evaluation and monitoring must be designed before launch.</li>
    </ul>
  `
};

