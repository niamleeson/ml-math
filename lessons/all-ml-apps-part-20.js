/* All ML — Part 20 applications (5 each). Loaded after content-part-20.js, before all-ml-register.js. */

/* ---- _apps-part20-A.js ---- */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

(window.ALLML_CONTENT["20.1"] = window.ALLML_CONTENT["20.1"] || {}).applications = [
  {
    title: "Feed ranking launch reviews",
    background: "<p>Ranking teams compare candidate serving designs before a member sees them. The point is to make quality, latency, and reliability visible in one review instead of arguing about accuracy alone.</p>",
    numbers: "<p>Using the lesson weights, an illustrative design with quality $0.82$, latency score $0.73$, and reliability score $0.90$ has $S=0.50\\times0.82+0.30\\times0.73+0.20\\times0.90=0.809$.</p>"
  },
  {
    title: "Ad prediction serving splits",
    background: "<p>Ad systems often route only part of traffic to a candidate path so operational risk stays bounded during evaluation.</p>",
    numbers: "<p>A $30\\%$ candidate split on $10{,}000$ requests per day sends $10{,}000\\times0.30=3{,}000$ candidate calls and leaves $7{,}000$ calls on the safer path.</p>"
  },
  {
    title: "Fraud detection dependency design",
    background: "<p>Fraud scoring often depends on multiple required services, so the whole chain is available only when every required dependency is available.</p>",
    numbers: "<p>Two required dependencies with availability $0.995$ and $0.990$ produce chain availability $0.995\\times0.990=0.98505$, lower than either dependency alone.</p>"
  },
  {
    title: "Search autocomplete latency budgets",
    background: "<p>Autocomplete feels broken when tail latency misses the interaction budget, even if average latency looks healthy in a dashboard.</p>",
    numbers: "<p>The lesson budget has feature $35$ ms, model $55$ ms, and postprocess $20$ ms, so total planned latency is $35+55+20=110$ ms, leaving $150-110=40$ ms of headroom.</p>"
  },
  {
    title: "Medical triage ML systems",
    background: "<p>Clinical triage deployments must trade sensitivity against human operator load because an unusable workflow can erase model value.</p>",
    numbers: "<p>With illustrative weights $0.6$ for sensitivity and $0.4$ for operator-load score, $0.6\\times0.92+0.4\\times0.70=0.832$ summarizes the operational tradeoff.</p>"
  }
];

(window.ALLML_CONTENT["20.2"] = window.ALLML_CONTENT["20.2"] || {}).applications = [
  {
    title: "Credit risk feature stores",
    background: "<p>Credit decisions need features that were actually known at decision time, not values backfilled after the fact.</p>",
    numbers: "<p>If the event time is $100$ and the read time is $118$, the age is $118-100=18$ minutes, which clears a $30$ minute freshness SLA.</p>"
  },
  {
    title: "Ads click prediction joins",
    background: "<p>Ads models can look falsely strong when the offline join includes features computed after the label event.</p>",
    numbers: "<p>A label at time $120$ and feature computed at $125$ creates $125-120=5$ minutes of future leakage, so that feature value must be excluded.</p>"
  },
  {
    title: "Ride-share ETA feature coverage",
    background: "<p>ETA systems monitor whether online serving can retrieve the same features that offline training used.</p>",
    numbers: "<p>With $950$ present feature rows out of $1000$, coverage is $n_{present}/n_{total}=950/1000=0.95$.</p>"
  },
  {
    title: "Fraud velocity counters",
    background: "<p>Velocity counters are only meaningful when their event windows and timestamps are owned as part of the contract.</p>",
    numbers: "<p>If $8$ of $10$ required counters are present at decision time, the illustrative coverage is $8/10=0.80$.</p>"
  },
  {
    title: "Retail recommender freshness",
    background: "<p>Retail recommenders depend on recent inventory and behavior features, so cache ownership matters as much as feature code.</p>",
    numbers: "<p>An event at time $20$ read at time $45$ has age $45-20=25$ minutes, which remains inside a $30$ minute freshness rule.</p>"
  }
];

(window.ALLML_CONTENT["20.3"] = window.ALLML_CONTENT["20.3"] || {}).applications = [
  {
    title: "Hyperparameter sweeps",
    background: "<p>Experiment trackers make sweep selection auditable by storing every loss with its data, code, config, seed, metric, and artifact.</p>",
    numbers: "<p>For losses $0.42,0.39,0.44$, the selected run is the minimum loss $0.39$, not the newest or most memorable run.</p>"
  },
  {
    title: "Regulated credit models",
    background: "<p>Regulated modeling requires a result to be reconstructed later, so the run identity must name every component of the scientific claim.</p>",
    numbers: "<p>The lesson tuple $r=(d,c,\\theta,s,m,a)$ has $6$ components: data version, code, config, seed, metric, and artifact.</p>"
  },
  {
    title: "Clinical model audits",
    background: "<p>Clinical audits need to know whether a rerun agrees with the recorded result within a stated tolerance.</p>",
    numbers: "<p>A recorded metric $0.817$ and rerun metric $0.816$ have reproducibility gap $|0.816-0.817|=0.001$.</p>"
  },
  {
    title: "Search ranking seed variance",
    background: "<p>Search ranking experiments often vary by seed, so the mean and spread should be reported instead of hiding optimizer noise.</p>",
    numbers: "<p>The scores $0.811,0.824,0.817$ have mean $(0.811+0.824+0.817)/3=0.8173$, about $0.817$.</p>"
  },
  {
    title: "Fraud model rollbacks",
    background: "<p>Artifact lineage makes rollback believable because the released artifact can be tied back to the exact run that produced it.</p>",
    numbers: "<p>Illustratively, $2$ artifacts from the same data version but different commits represent $2$ different claims because the code component $c$ changed.</p>"
  }
];

(window.ALLML_CONTENT["20.4"] = window.ALLML_CONTENT["20.4"] || {}).applications = [
  {
    title: "Model registry promotion",
    background: "<p>Registries promote candidates by comparing them to the current champion under a named threshold.</p>",
    numbers: "<p>A candidate metric $0.812$ minus champion metric $0.804$ gives $\\Delta=0.008$, which clears the $\\tau=0.005$ promotion rule.</p>"
  },
  {
    title: "Bank model governance",
    background: "<p>Governed data versions must identify both row content and schema, because either can change while a path stays the same.</p>",
    numbers: "<p>The lesson scope names $1000$ rows and $12$ schema fields, so the versioned content covers $1000+12=1012$ auditable items.</p>"
  },
  {
    title: "Recommender rollback",
    background: "<p>A registry rollback should move the served pointer to a known artifact rather than retraining during an incident.</p>",
    numbers: "<p>Rolling back from version $7$ to version $6$ changes $7-6=1$ served pointer step.</p>"
  },
  {
    title: "Mobile model release compatibility",
    background: "<p>Mobile releases need compatibility gates because old clients may send a different feature contract than the new model expects.</p>",
    numbers: "<p>If the model expects $24$ fields and serving observes $23$, the release is blocked by $24-23=1$ missing input.</p>"
  },
  {
    title: "Fraud model lineage",
    background: "<p>Fraud releases become auditable when data version, run, artifact, and stage are represented as registry state.</p>",
    numbers: "<p>Illustratively, $4$ stages such as development, staging, production, and archived can be represented as one state machine with $4$ possible stage values.</p>"
  }
];

(window.ALLML_CONTENT["20.5"] = window.ALLML_CONTENT["20.5"] || {}).applications = [
  {
    title: "Training pipeline CI",
    background: "<p>A smoke training job is a cheap way to confirm that the training loop is wired before expensive jobs run.</p>",
    numbers: "<p>If smoke loss drops from $0.90$ to $0.62$, the improvement is $0.90-0.62=0.28$.</p>"
  },
  {
    title: "Feature schema gates",
    background: "<p>Schema gates stop a pipeline when the model and data contract disagree, even if the code compiles.</p>",
    numbers: "<p>Expected $24$ columns and observed $23$ columns produce $24-23=1$ blocking mismatch.</p>"
  },
  {
    title: "Registry release checks",
    background: "<p>Evaluation gates compare the candidate error to a maximum acceptable release threshold before promotion.</p>",
    numbers: "<p>A candidate error $0.184$ clears a maximum $0.190$ by $0.190-0.184=0.006$.</p>"
  },
  {
    title: "Canary rollout gates",
    background: "<p>Canary gates make release a product of Boolean checks, so one failed safety condition blocks rollout.</p>",
    numbers: "<p>With gates $g_1,\\ldots,g_5$, release is $1$ only when $g_1g_2g_3g_4g_5=1$; one zero gate makes the product $0$.</p>"
  },
  {
    title: "Fraud model packaging",
    background: "<p>Fraud deployments use staged gates so cheap failures are caught before package and rollout work consumes time.</p>",
    numbers: "<p>Illustratively, schema, smoke, eval, package, and rollout checks are $5$ Boolean gates; all $5$ must pass for release.</p>"
  }
];

/* ---- _apps-part20-B.js ---- */
(window.ALLML_CONTENT["20.6"] = window.ALLML_CONTENT["20.6"] || {}).applications = [
  { title: "Newsfeed recommendations", background: "<p>Feed ranking systems often precompute candidate scores so the online path can return quickly even when traffic spikes.</p>", numbers: "<p>With a 6-hour batch refresh, the worst-case prediction age is 6 hours and the average age under uniform arrivals is $6/2=3$ hours.</p>" },
  { title: "Fraud authorization", background: "<p>Payment and account-security decisions need fresh signals, so they often pay the online inference latency cost.</p>", numbers: "<p>The lesson online path adds feature lookup, model, and network time: $25+40+15=80$ ms.</p>" },
  { title: "E-commerce personalization", background: "<p>Retail recommenders can score large catalogs offline when freshness is less important than predictable cost.</p>", numbers: "<p>Scoring $1{,}000{,}000$ candidates at $0.00002$ dollars each costs $1{,}000{,}000\\times0.00002=20.00$ dollars.</p>" },
  { title: "Ads retrieval cache", background: "<p>Ad retrieval stacks commonly mix cached candidates with live re-ranking so the expensive path is used only for misses.</p>", numbers: "<p>The hybrid latency equation is $E[L]=hL_{cache}+(1-h)L_{online}$, so the hit rate directly controls the user-visible mean.</p>" },
  { title: "Ride-share dispatch", background: "<p>Dispatch systems may spend online compute when freshness changes the quality of matches enough to justify latency.</p>", numbers: "<p>For illustrative values $h=0.70$, $L_c=5$ ms, and $L_o=80$ ms, $E[L]=0.7\\times5+0.3\\times80=27.5$ ms.</p>" }
];

(window.ALLML_CONTENT["20.7"] = window.ALLML_CONTENT["20.7"] || {}).applications = [
  { title: "Canary model release", background: "<p>Model serving teams route a small slice to a candidate artifact before broad rollout.</p>", numbers: "<p>A $5\\%$ canary of $40{,}000$ requests sends $0.05\\times40{,}000=2{,}000$ requests to the candidate.</p>" },
  { title: "Autoscaled inference APIs", background: "<p>Inference services size replica count from peak demand and per-replica capacity, not from average traffic alone.</p>", numbers: "<p>With $900$ qps demand and $150$ qps per replica, $\\lceil900/150\\rceil=6$ replicas are required.</p>" },
  { title: "Cold-start-sensitive search", background: "<p>Search serving loads indexes and compiles model graphs before the route becomes user-visible.</p>", numbers: "<p>A 30-second warmup performed before routing avoids adding those 30 seconds to the first user request.</p>" },
  { title: "Shadow deployments", background: "<p>Shadow mode evaluates candidate responses on mirrored traffic while continuing to serve the current model.</p>", numbers: "<p>Illustratively, $10{,}000$ mirrored requests at $0\\%$ exposure produce $10{,}000$ evaluations and $0$ served candidate responses.</p>" },
  { title: "Blue-green fraud scoring", background: "<p>Blue-green serving keeps a known-good stack ready so rollback can be a traffic-pointer operation.</p>", numbers: "<p>If green has error rate $0.003$ and the limit is $0.005$, the absolute margin is $0.005-0.003=0.002$ before rollback is required.</p>" }
];

(window.ALLML_CONTENT["20.8"] = window.ALLML_CONTENT["20.8"] || {}).applications = [
  { title: "Credit score monitoring", background: "<p>Credit models compare live applicant feature distributions against the baseline training contract.</p>", numbers: "<p>For one PSI bin, expected $0.20$ and observed $0.30$ gives $(0.30-0.20)\\ln(0.30/0.20)=0.0405$.</p>" },
  { title: "Ad click model monitoring", background: "<p>Ads systems watch features and predictions because click labels can arrive after the live distribution has already shifted.</p>", numbers: "<p>A feature or prediction alert at day 0 beats a label-only alert delayed by an illustrative 7 days.</p>" },
  { title: "Fraud alert thresholds", background: "<p>Fraud monitors anchor shifts to the baseline standard deviation so live variance cannot hide movement.</p>", numbers: "<p>Baseline mean $10.0$, live mean $11.5$, and baseline std $2.0$ gives $z=(11.5-10.0)/2.0=0.75$.</p>" },
  { title: "Recommender business dashboards", background: "<p>Recommendation teams track feature, prediction, label, and business outcome series together to avoid single-metric blindness.</p>", numbers: "<p>An illustrative 7-day baseline can be compared with each live daily mean; a drift score $0.26$ exceeds a $0.20$ threshold by $0.06$.</p>" },
  { title: "LLM guardrail monitoring", background: "<p>Guardrail monitors need slices because a global aggregate can hide one segment with bad behavior.</p>", numbers: "<p>An illustrative slice with $42$ failures out of $50$ items has rate $42/50=0.84$, which can be much worse than the global rate.</p>" }
];

(window.ALLML_CONTENT["20.9"] = window.ALLML_CONTENT["20.9"] || {}).applications = [
  { title: "Product ranking experiments", background: "<p>Ranking changes are evaluated with randomized traffic so causal impact is not confused with seasonality.</p>", numbers: "<p>The lesson rates are control $480/10000=0.048$ and treatment $520/10000=0.052$.</p>" },
  { title: "Ads auction changes", background: "<p>Auction experiments report both absolute and relative lift because business owners often reason in percent changes.</p>", numbers: "<p>The absolute lift is $0.052-0.048=0.004$, and relative lift is $0.004/0.048=0.083$.</p>" },
  { title: "Recommendation canaries", background: "<p>Canary experiments still need guardrails so a primary metric win does not hide latency or quality regressions.</p>", numbers: "<p>With an illustrative p95 guardrail threshold of $200$ ms, a treatment p95 of $230$ ms fails even if conversion improves.</p>" },
  { title: "Prompt release experiments", background: "<p>Prompt releases can be tested like product experiments when traffic is randomized and pass/fail outcomes are counted.</p>", numbers: "<p>Illustratively, $740/1000$ versus $690/1000$ gives pass-rate lift $0.740-0.690=0.05$.</p>" },
  { title: "Fraud decision thresholds", background: "<p>Rare-outcome experiments need enough sample size because small expected lifts can be dominated by standard error.</p>", numbers: "<p>For the lesson pooled rate $0.050$, $SE=\\sqrt{0.05\\times0.95\\times(1/10000+1/10000)}=0.00308$, so $z=0.004/0.00308=1.298$.</p>" }
];

(window.ALLML_CONTENT["20.10"] = window.ALLML_CONTENT["20.10"] || {}).applications = [
  { title: "Mobile vision models", background: "<p>On-device vision models prune weights to fit memory and battery budgets before deployment.</p>", numbers: "<p>Pruning $7$ of $20$ weights gives sparsity $7/20=0.35$.</p>" },
  { title: "Server inference acceleration", background: "<p>Server inference benefits only when the runtime can turn remaining density into less work.</p>", numbers: "<p>In the lesson toy example, pruning one of four weights leaves density $3/4=0.75$.</p>" },
  { title: "NLP embedding compression", background: "<p>Embedding tables can use magnitude thresholds to remove small values while retaining larger signal-carrying weights.</p>", numbers: "<p>For weights $0.02,-0.50,0.10,0.80$ and threshold $0.10$, only $0.02$ is pruned because $0.10$ is kept.</p>" },
  { title: "Edge anomaly detectors", background: "<p>Edge devices often prefer structured channel pruning because it maps to actual hardware kernels.</p>", numbers: "<p>Illustratively, pruning $4$ channels from $16$ gives channel sparsity $4/16=0.25$.</p>" },
  { title: "Batch scoring cost reduction", background: "<p>Offline scoring pipelines use pruning to reduce arithmetic and memory movement when sparse execution is supported.</p>", numbers: "<p>With sparsity $0.35$ and dense cost $100$, the proxy compute is $(1-0.35)\\times100=65$ units.</p>" }
];

/* ---- _apps-part20-C.js ---- */
(window.ALLML_CONTENT["20.11"] = window.ALLML_CONTENT["20.11"] || {}).applications = [
  {
    title: "On-device ranking",
    background: "<p>Phones and browsers often rank candidates locally, where model bytes compete with app size, cache, and memory bandwidth.</p>",
    numbers: "<p>The lesson budget has $1{,}000{,}000$ weights. Float32 uses $1{,}000{,}000\times4=4.0$ MB, while int8 uses $1{,}000{,}000\times1=1.0$ MB, saving $3.0$ MB.</p>"
  },
  {
    title: "Vision inference kernels",
    background: "<p>Image models use calibrated int8 kernels when the runtime and hardware support fast integer matrix operations.</p>",
    numbers: "<p>With symmetric int8 and max absolute calibration value $1.8$, the scale is $s=1.8/127=0.01417$.</p>"
  },
  {
    title: "Recommendation embedding tables",
    background: "<p>Large embedding tables are often memory-bound, so quantization is attractive only when dequantization error is measured.</p>",
    numbers: "<p>The lesson value $0.73$ maps to $q=\operatorname{round}(0.73/0.01417)=52$ and dequantizes to $52\times0.01417=0.737$, an error of $0.007$.</p>"
  },
  {
    title: "Edge speech models",
    background: "<p>Speech models running on edge devices need representative calibration because uncommon loud inputs can exceed the chosen range.</p>",
    numbers: "<p>If calibration max is $1.8$ but a real activation is $2.2$, the value clips by $2.2-1.8=0.4$ before quantization.</p>"
  },
  {
    title: "Batch scoring throughput",
    background: "<p>Offline scoring can benefit from smaller transfers, but the speedup depends on whether the serving stack has efficient int8 kernels.</p>",
    numbers: "<p>Illustratively, int8 transfers one byte per weight instead of four bytes for float32, so the transfer volume is $1/4$ of the float32 volume.</p>"
  }
];

(window.ALLML_CONTENT["20.12"] = window.ALLML_CONTENT["20.12"] || {}).applications = [
  {
    title: "Search ranking students",
    background: "<p>Search systems distill large rankers into smaller students so near-miss teacher probabilities still guide ranking behavior.</p>",
    numbers: "<p>At temperature $2$, the lesson exponentials are $2.718$, $1.649$, and $1.000$, summing to $5.367$; class 1 gets $2.718/5.367=0.506$.</p>"
  },
  {
    title: "Mobile classifiers",
    background: "<p>Mobile classifiers often copy behavior from a large teacher while serving a much smaller network on-device.</p>",
    numbers: "<p>A $12$M parameter student compared with a $120$M teacher has size ratio $12/120=0.10$, or one tenth of the parameters.</p>"
  },
  {
    title: "Low-latency moderation",
    background: "<p>Moderation pipelines can use a distilled model when every request needs a fast first-pass decision.</p>",
    numbers: "<p>The lesson latencies are $90$ ms for the teacher and $18$ ms for the student, giving speedup $90/18=5\times$.</p>"
  },
  {
    title: "Speech command models",
    background: "<p>Small command recognizers mix teacher soft targets with hard labels so they do not forget the labeled task.</p>",
    numbers: "<p>With $\alpha=0.7$, $L_{soft}=0.42$, and $L_{hard}=0.65$, the blend is $0.7\times0.42+0.3\times0.65=0.489$.</p>"
  },
  {
    title: "LLMOps routing",
    background: "<p>A cheap distilled classifier can route easy LLM requests away from an expensive model while preserving escalation for hard cases.</p>",
    numbers: "<p>Illustratively, if $80\%$ of traffic uses an $18$ ms easy route and $20\%$ still uses a $90$ ms teacher, average latency is $0.8\times18+0.2\times90=32.4$ ms.</p>"
  }
];

(window.ALLML_CONTENT["20.13"] = window.ALLML_CONTENT["20.13"] || {}).applications = [
  {
    title: "Large recommender training",
    background: "<p>Large recommenders distribute examples across workers, but the ideal compute split is only the first estimate.</p>",
    numbers: "<p>The lesson job takes $160$ minutes on one worker. With $8$ workers, ideal compute time is $160/8=20$ minutes before overhead.</p>"
  },
  {
    title: "Foundation-model data parallelism",
    background: "<p>Data-parallel training synchronizes gradients, so communication time remains after compute is divided.</p>",
    numbers: "<p>Adding $5$ communication minutes to the $20$ ideal minutes gives observed time $20+5=25$ minutes.</p>"
  },
  {
    title: "Gradient synchronization planning",
    background: "<p>All-reduce cost starts with the payload size that must cross the network each synchronization.</p>",
    numbers: "<p>The lesson payload is $50$M gradients at $4$ bytes each, or $50{,}000{,}000\times4=200$ MB.</p>"
  },
  {
    title: "Pipeline-parallel training",
    background: "<p>Pipeline parallelism can leave stages idle unless enough microbatches fill the pipeline.</p>",
    numbers: "<p>With $4$ stages and $12$ microbatches, utilization is $12/(12+4-1)=12/15=0.800$.</p>"
  },
  {
    title: "Cost-aware distributed jobs",
    background: "<p>Cluster cost decisions need efficiency, not just worker count, because low efficiency wastes expensive accelerators.</p>",
    numbers: "<p>The observed speedup is $160/25=6.4\times$ and efficiency is $6.4/8=0.80$.</p>"
  }
];

(window.ALLML_CONTENT["20.14"] = window.ALLML_CONTENT["20.14"] || {}).applications = [
  {
    title: "Online inference graph fusion",
    background: "<p>Serving runtimes fuse adjacent graph operations to reduce intermediate tensors and memory traffic.</p>",
    numbers: "<p>The lesson example changes two $4$ MB reads into one $4$ MB read, saving $4$ MB of traffic.</p>"
  },
  {
    title: "Mobile runtimes",
    background: "<p>Mobile runtimes fold constants so repeated requests do not recompute values known at compile time.</p>",
    numbers: "<p>The constant expression $3\times4+2$ is folded once to $14$ instead of computed for every request.</p>"
  },
  {
    title: "Batch recommendation serving",
    background: "<p>Shape specialization lets a compiler choose kernels for a known serving shape, but only if traffic matches that shape.</p>",
    numbers: "<p>A static batch of $32$ and feature width $128$ has $32\times128=4096$ input elements.</p>"
  },
  {
    title: "Vision kernels",
    background: "<p>Compiled kernels are evaluated by steady-state latency after warmup, not by compile time mixed into serving.</p>",
    numbers: "<p>The lesson unfused latency is $1.8$ ms and fused latency is $1.1$ ms, saving $1.8-1.1=0.7$ ms with speedup $1.8/1.1=1.636\times$.</p>"
  },
  {
    title: "Numeric validation",
    background: "<p>Compilers may reorder floating-point operations, so equality is the wrong production correctness test.</p>",
    numbers: "<p>With compiled output $0.731$ and eager output $0.730$, the difference is $|0.731-0.730|=0.001$, which is within an illustrative tolerance $\epsilon=0.005$.</p>"
  }
];

(window.ALLML_CONTENT["20.15"] = window.ALLML_CONTENT["20.15"] || {}).applications = [
  {
    title: "RAG retrieval",
    background: "<p>Retrieval-augmented generation needs ANN results that are fast and still recover enough true nearest neighbors.</p>",
    numbers: "<p>The lesson recall@$10$ has $7$ true neighbors recovered out of $10$, so recall@$10=7/10=0.70$.</p>"
  },
  {
    title: "Similar-item ads retrieval",
    background: "<p>Ads retrieval often compares normalized embeddings so cosine similarity is simple and stable.</p>",
    numbers: "<p>With unit norms and dot product $0.80$, cosine similarity is $0.80/(1\times1)=0.80$.</p>"
  },
  {
    title: "Candidate generation indexes",
    background: "<p>IVF-style indexes scan only the vectors in probed lists, trading recall for less work.</p>",
    numbers: "<p>Probing $3$ lists with $120$ vectors each scans $3\times120=360$ vectors.</p>"
  },
  {
    title: "Latency-recall tuning",
    background: "<p>Increasing probes usually improves recall but also raises scan volume and latency.</p>",
    numbers: "<p>The lesson compares $8$ probes at $8\times120=960$ scanned vectors with $3$ probes at $360$ scanned vectors.</p>"
  },
  {
    title: "Embedding memory planning",
    background: "<p>Vector database capacity planning starts with raw embedding memory before replicas, metadata, and index overhead.</p>",
    numbers: "<p>For $1{,}000{,}000$ vectors with $128$ dimensions and $4$ bytes per float, memory is $1{,}000{,}000\times128\times4=512$ MB.</p>"
  }
];

/* ---- _apps-part20-D.js ---- */
(window.ALLML_CONTENT["20.16"] = window.ALLML_CONTENT["20.16"] || {}).applications = [
  {
    title: "Fraud velocity features",
    background: "<p>Fraud systems need event-time features because card swipes, clicks, and account actions can arrive late or out of order.</p>",
    numbers: "<p>With a 5 minute window, events at minutes $1,3,7$ give count $2$ in $[0,5)$ and count $1$ in $[5,10)$.</p>"
  },
  {
    title: "Live recommendations",
    background: "<p>Recommendation streams use watermarks to decide when a feature is complete enough for serving.</p>",
    numbers: "<p>If max event time is $100$ and allowed lateness is $10$, the watermark is $100-10=90$.</p>"
  },
  {
    title: "Ads pacing freshness",
    background: "<p>Ads pacing systems must avoid counting stale events as if they were current budget signals.</p>",
    numbers: "<p>An event at time $88$ is late once the watermark is $90$ because $88\lt90$.</p>"
  },
  {
    title: "Sensor anomaly smoothing",
    background: "<p>Streaming sensor features often use exponential updates so a single spike does not dominate the state.</p>",
    numbers: "<p>With $\alpha=0.6$, current value $10$, and prior state $7$, the update is $0.6\times10+0.4\times7=8.8$.</p>"
  },
  {
    title: "Real-time bidding backpressure",
    background: "<p>RTB feature services need capacity planning because freshness can fail even when the model code is correct.</p>",
    numbers: "<p>Illustratively, input $1,200$ events/s and processing $1,000$ events/s accumulates $1,200-1,000=200$ events/s of lag.</p>"
  }
];

(window.ALLML_CONTENT["20.17"] = window.ALLML_CONTENT["20.17"] || {}).applications = [
  {
    title: "Customer support assistants",
    background: "<p>Support assistants are production systems made of prompt version, retrieval context, tool schemas, and eval results.</p>",
    numbers: "<p>A prompt-only diff can miss behavior changes; track the full package so a pass rate such as $0.74$ is comparable to the prior $0.69$.</p>"
  },
  {
    title: "RAG context budgets",
    background: "<p>Retrieval augmented generation must pack evidence into a finite token budget before the model is called.</p>",
    numbers: "<p>The lesson budget is system $500$ plus retrieval $1,800$ plus user $300$, so total input is $500+1,800+300=2,600$ tokens.</p>"
  },
  {
    title: "Prompt release evals",
    background: "<p>Prompt releases should be promoted by fixed golden-case evals rather than by anecdotal examples.</p>",
    numbers: "<p>The lesson lift is $0.74-0.69=0.05$, a five percentage point pass-rate improvement.</p>"
  },
  {
    title: "LLM cost dashboards",
    background: "<p>Cost dashboards turn token counts into a visible production budget for each route and prompt version.</p>",
    numbers: "<p>At $0.000002$ dollars per input token, $2,600\times0.000002=0.0052$ dollars of input cost.</p>"
  },
  {
    title: "Fallback routing",
    background: "<p>Fallback routes send risky or failed prompts to a safer model, policy, or human review path.</p>",
    numbers: "<p>Illustratively, $3$ failed cases out of $100$ requests gives fallback rate $3/100=0.03$.</p>"
  }
];

(window.ALLML_CONTENT["20.18"] = window.ALLML_CONTENT["20.18"] || {}).applications = [
  {
    title: "LLM release harnesses",
    background: "<p>A release harness freezes cases and scoring rules so model or prompt changes are measured repeatably.</p>",
    numbers: "<p>The lesson accuracy calculation is $87/100=0.87$.</p>"
  },
  {
    title: "Mobile and desktop slices",
    background: "<p>Slice evaluation catches regressions that are hidden by a strong overall average.</p>",
    numbers: "<p>Mobile is $42/50=0.84$ while desktop is $45/50=0.90$, so the gap is $0.90-0.84=0.06$.</p>"
  },
  {
    title: "Pairwise ranking evals",
    background: "<p>Ranking teams often compare a candidate against a baseline and count wins instead of absolute labels.</p>",
    numbers: "<p>If the candidate wins $34$ of $60$ comparisons, the win rate is $34/60=0.567$.</p>"
  },
  {
    title: "Bootstrap uncertainty",
    background: "<p>Bootstrap summaries show whether an observed metric is stable enough to support a release decision.</p>",
    numbers: "<p>Sample means $0.80,0.85,0.90$ average to $(0.80+0.85+0.90)/3=0.85$.</p>"
  },
  {
    title: "Registry release thresholds",
    background: "<p>Model registries need thresholds so evaluation produces a ship or do-not-ship decision.</p>",
    numbers: "<p>Illustratively, threshold $0.86$ and measured $0.87$ passes by $0.87-0.86=0.01$.</p>"
  }
];

(window.ALLML_CONTENT["20.19"] = window.ALLML_CONTENT["20.19"] || {}).applications = [
  {
    title: "Search serving latency",
    background: "<p>Search services optimize tail latency because the slowest successful requests shape user experience.</p>",
    numbers: "<p>The lesson p95 is $180$ ms and p50 is $72$ ms, so the tail is $180/72=2.5\times$ the median.</p>"
  },
  {
    title: "Batched inference",
    background: "<p>Batching can reduce compute per request, but it must be evaluated with queueing time included.</p>",
    numbers: "<p>A batch of $8$ requests computed in $40$ ms has amortized compute $40/8=5$ ms per request before queueing.</p>"
  },
  {
    title: "Cache routing",
    background: "<p>Cache policies trade hit rate against stale or lower quality answers, so expected latency must be explicit.</p>",
    numbers: "<p>With hit rate $0.60$, hit latency $4$ ms, and miss latency $80$ ms, $E[L]=0.6\times4+0.4\times80=34.4$ ms.</p>"
  },
  {
    title: "Cloud cost forecasting",
    background: "<p>Serving budgets start with a simple request count times unit cost calculation before adding route details.</p>",
    numbers: "<p>At $0.00003$ dollars per call, $1,000,000$ calls cost $1,000,000\times0.00003=30.00$ dollars.</p>"
  },
  {
    title: "Multi-tier LLM serving",
    background: "<p>Tiered serving sends easy requests to a cheap path and difficult requests to a slower, more expensive path.</p>",
    numbers: "<p>Illustratively, $60\%$ cheap route at $20$ ms and $40\%$ expensive route at $100$ ms gives $0.6\times20+0.4\times100=52$ ms.</p>"
  }
];

(window.ALLML_CONTENT["20.20"] = window.ALLML_CONTENT["20.20"] || {}).applications = [
  {
    title: "Smartphone keyboard prediction",
    background: "<p>Keyboard models run locally, so memory must include the artifact, runtime, and feature buffers.</p>",
    numbers: "<p>The lesson footprint is $18+12+6=36$ MB, which is under a $64$ MB budget.</p>"
  },
  {
    title: "Wearable health inference",
    background: "<p>Wearables care about daily energy because many small inferences can drain a small battery.</p>",
    numbers: "<p>At $120$ mJ per inference and $50$ inferences per day, daily energy is $120\times50=6,000$ mJ.</p>"
  },
  {
    title: "Offline translation",
    background: "<p>On-device translation preserves availability when the network is missing or too slow.</p>",
    numbers: "<p>Illustratively, if a user is offline for $20$ minutes, local inference can still cover those $20$ minutes.</p>"
  },
  {
    title: "Privacy-preserving personalization",
    background: "<p>Edge personalization can keep raw logs on the device and upload only aggregates.</p>",
    numbers: "<p>Illustratively, one aggregate count per device can replace a raw event upload count of $1,000$ events for that device.</p>"
  },
  {
    title: "Mobile model updates",
    background: "<p>Mobile rollout design needs rollback mechanics because a good model is not deployable if users cannot recover safely.</p>",
    numbers: "<p>Illustratively, keeping $1$ safe prior artifact pointer enables rollback without retraining.</p>"
  }
];

