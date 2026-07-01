# Part 20 — ML Systems, MLOps & Production

> Plan only — per-topic revamp plan. See ../00-MASTER-PLAN.md for the shared design & family registry (F1–F17).
> **Code style:** every notebook code cell is written one statement per line (newline-split, blank lines between logical groups) for readability — never dense, semicolon-packed one-liners. See ../00-MASTER-PLAN.md §B.4.
> Dominant family: F17 (Systems/Operational).

### 20.1 — ML system design   [notebook: 20.1-ml-system-design.ipynb]   (family: F17)

**Lesson — Real World Applications (5):**
1. Feed ranking launch reviews — score candidate designs by quality, latency, and reliability; lesson formula $S=\sum w_jm_j$ with illustrative weights $0.5,0.3,0.2$ gives a re-derivable weighted score.
2. Ad prediction serving — split candidate traffic safely; lesson number: $10{,}000$ requests/day $\times 0.30=3{,}000$ candidate calls.
3. Fraud detection dependency design — chain required services; lesson number: $0.995\times0.990=0.98505$ availability.
4. Search autocomplete budgets — compare p95 not just mean; lesson pitfall names mean latency under target while p95 violates the promise.
5. Medical triage ML systems — trade sensitivity against operator load; illustrative normalized score $0.6\times0.92+0.4\times0.70=0.832$.

**Notebook plan:**
- Family: F17 Systems/Operational
- Concept built once (D1): `score_design(workload, weights)` verifies lesson traffic split $10,000\times0.30=3,000$ and dependency availability $0.995\times0.990=0.98505$ on a tiny request trace.
- Datasets D1–D5: D1 10 hand requests through two services · D2 1,000 clean requests with fixed latencies · D3 +burst and one degraded dependency · D4 real-ish diurnal trace sampled from lognormal latency distributions · D5 production-scale simulation with 1M requests and multi-service fanout
- Metric: p95 end-to-end latency across all rungs
- Closing viz: (a) latency/cost/throughput panels per workload  (b) p95-latency-vs-load curve
- Pitfall on D5: budgeting averages instead of tails; reproduce mean passing while p95 fails, then fix by choosing the design with tail headroom.
- Notes: delete dead template helpers; CPU-only NumPy workload simulation.

### 20.2 — Data pipelines & feature stores   [notebook: 20.2-data-pipelines-feature-stores.ipynb]   (family: F17)

**Lesson — Real World Applications (5):**
1. Credit risk feature stores — enforce freshness at decision time; lesson number: read time $118$ minus event time $100$ gives age $18$ minutes under a $30$ minute SLA.
2. Ads click prediction — point-in-time joins prevent future leakage; lesson number: feature computed at $125$ after label time $120$ leaks by $5$ minutes.
3. Ride-share ETA features — monitor online/offline coverage; lesson formula $n_{present}/n_{total}$, illustrative $950/1000=0.95$.
4. Fraud velocity counters — windowed event facts must be timestamped; illustrative 8 present features out of 10 gives $0.80$ coverage.
5. Retail recommender freshness — cache invalidation ownership matters; illustrative age $45-20=25$ minutes clears a $30$ minute freshness rule.

**Notebook plan:**
- Family: F17 Systems/Operational
- Concept built once (D1): `point_in_time_join(events, labels, read_time)` verifies lesson age $118-100=18$ and coverage $n_{present}/n_{total}$ on three rows.
- Datasets D1–D5: D1 tiny feature/event/label table · D2 10k clean feature rows · D3 +late arrivals, missing values, and skew · D4 real-ish trace from synthetic event-time distributions · D5 production-scale hourly feature-store simulation
- Metric: freshness SLA violation rate across all rungs
- Closing viz: (a) latency/cost/throughput panels per workload  (b) violation-rate-vs-load curve
- Pitfall on D5: future leakage; reproduce inflated coverage/metric from $t_{feature}>t_{label}$, then fix with point-in-time filtering.
- Notes: delete dead template helpers; CPU-only NumPy/Pandas simulation.

### 20.3 — Experiment tracking & reproducibility   [notebook: 20.3-experiment-tracking-reproducibility.ipynb]   (family: F17, gap)

**Lesson — Real World Applications (5):**
1. Hyperparameter sweeps — choose by recorded metric, not memory; lesson losses $0.42,0.39,0.44$ select $0.39$.
2. Regulated credit models — immutable run tuple names data, code, config, seed, metric, artifact; lesson tuple $r=(d,c,\theta,s,m,a)$ has 6 components.
3. Clinical model audits — rerun drift is bounded; lesson reproducibility gap can compare recorded $0.817$ to rerun $0.816$ for $0.001$.
4. Search ranking experiments — seed variance is a reported object; lesson scores $0.811,0.824,0.817$ have mean about $0.817$.
5. Fraud model rollbacks — artifact lineage makes a release believable twice; illustrative two artifacts with same data but different commits are two scientific claims.

**Notebook plan:**
- Family: F17 Systems/Operational
- Concept built once (D1): `record_run(data_version, code, config, seed, metric, artifact)` verifies the lesson run tuple and mean of $0.811,0.824,0.817\approx0.817$.
- Datasets D1–D5: D1 three hand-entered runs · D2 100 clean tracked runs · D3 +seed variance, stale data, and config drift · D4 real-ish experiment log generated from distributions · D5 production-scale registry log with thousands of candidates
- Metric: reproducibility gap $|m_{rerun}-m_{recorded}|$ across all rungs
- Closing viz: (a) latency/cost/throughput panels per workload  (b) reproducibility-gap-vs-run-volume curve
- Pitfall on D5: ignoring seed variance; reproduce a false winner from one seed, then fix by paired multi-seed summaries.
- Notes: delete dead template helpers; CPU-only simulation; gap topic so lesson body may need authoring before final notebook cites more detail.

### 20.4 — Data & model versioning; model registry   [notebook: 20.4-data-model-versioning-registry.ipynb]   (family: F17, gap)

**Lesson — Real World Applications (5):**
1. Model registry promotion — compare candidate to champion; lesson number $0.812-0.804=0.008$ clears a $0.005$ rule.
2. Bank model governance — hash both rows and schema; lesson names $1000$ rows plus $12$ schema fields as the content scope.
3. Recommender rollback — move served pointer, do not retrain; illustrative rollback from version 7 to 6 changes one pointer.
4. Mobile model releases — compatibility gates check expected inputs; illustrative 24 expected fields vs 23 observed blocks release by 1 mismatch.
5. Fraud model lineage — data version, run, artifact, and stage become auditable release state; illustrative 4 registry stages can be represented as one state machine.

**Notebook plan:**
- Family: F17 Systems/Operational
- Concept built once (D1): `registry_gate(candidate, champion, tau)` verifies lesson promotion $0.812-0.804=0.008\ge0.005$.
- Datasets D1–D5: D1 tiny champion/candidate registry · D2 1k clean artifacts · D3 +schema changes and metric noise · D4 real-ish release history sampled from staged deployments · D5 production-scale registry with rollbacks and compatibility failures
- Metric: bad-promotion rate across all rungs
- Closing viz: (a) latency/cost/throughput panels per workload  (b) bad-promotion-rate-vs-release-volume curve
- Pitfall on D5: versioning paths instead of content; reproduce undetected row/schema change, then fix with content hashes.
- Notes: delete dead template helpers; CPU-only simulation; gap topic so final lesson may need more authored examples.

### 20.5 — CI/CD for ML   [notebook: 20.5-cicd-for-ml.ipynb]   (family: F17)

**Lesson — Real World Applications (5):**
1. Training pipeline CI — smoke train verifies the loop; lesson loss drops from $0.90$ to $0.62$, improvement $0.28$.
2. Feature schema gates — block mismatches; lesson expected $24$ columns and observed $23$ gives 1 missing column.
3. Registry release checks — candidate error $0.184$ clears a maximum $0.190$ by $0.006$.
4. Canary rollout gates — release only if every gate passes; lesson formula $release=1$ only when all $g_k=1$.
5. Fraud model packaging — staged cheap tests catch failures early; illustrative schema, smoke, eval, package, rollout are 5 Boolean gates.

**Notebook plan:**
- Family: F17 Systems/Operational
- Concept built once (D1): `ml_release_gates(schema, smoke, eval, package, rollout)` verifies lesson gate product and $24-23=1$ blocking mismatch.
- Datasets D1–D5: D1 five hand Boolean gates · D2 1k clean pipeline runs · D3 +schema drift and flaky metrics · D4 real-ish CI event trace with durations · D5 production-scale deployment queue with rollback signals
- Metric: failed-release escape rate across all rungs
- Closing viz: (a) latency/cost/throughput panels per workload  (b) escape-rate-vs-pipeline-volume curve
- Pitfall on D5: only testing code; reproduce bad data passing software-only gates, then fix with schema and metric gates.
- Notes: delete dead template helpers; CPU-only NumPy/Pandas simulation.

### 20.6 — Batch vs online (real-time) inference   [notebook: 20.6-batch-vs-online-inference.ipynb]   (family: F17)

**Lesson — Real World Applications (5):**
1. Newsfeed recommendations — cached batch scores trade staleness for speed; lesson 6-hour refresh has worst-case age 6 hours and average age 3 hours.
2. Fraud authorization — online path sums live components; lesson $25+40+15=80$ ms.
3. E-commerce personalization — batch scoring cost is predictable; lesson $1{,}000{,}000\times0.00002=\$20.00$.
4. Ads retrieval cache — hybrid expected latency uses hit rate; lesson formula $E[L]=hL_{cache}+(1-h)L_{online}$.
5. Ride-share dispatch — freshness value can exceed latency cost; illustrative $h=0.70$, $L_c=5$ ms, $L_o=80$ ms gives $27.5$ ms expected latency.

**Notebook plan:**
- Family: F17 Systems/Operational
- Concept built once (D1): `hybrid_latency(hit_rate, cache_ms, online_ms)` verifies lesson online sum $25+40+15=80$ ms and expected latency formula.
- Datasets D1–D5: D1 10 requests with cache hits · D2 100k clean requests · D3 +peak concurrency and cache misses · D4 real-ish diurnal request trace · D5 production-scale mixed batch/online serving simulation
- Metric: p95 user-visible latency across all rungs
- Closing viz: (a) latency/cost/throughput panels per workload  (b) p95-latency-vs-hit-rate/load curve
- Pitfall on D5: optimizing freshness without latency; reproduce all-online p95 blowup, then fix with hybrid cache routing.
- Notes: delete dead template helpers; CPU-only simulation.

### 20.7 — Model serving & deployment   [notebook: 20.7-model-serving-deployment.ipynb]   (family: F17)

**Lesson — Real World Applications (5):**
1. Canary model release — expose a small routed fraction; lesson $5\%$ of $40{,}000$ requests is $2{,}000$ candidate requests.
2. Autoscaled inference APIs — size replicas by capacity; lesson $900$ qps divided by $150$ qps/replica requires 6 replicas.
3. Cold-start-sensitive search — warmup avoids first-user latency; lesson warmup is $30$ seconds before traffic.
4. Shadow deployments — evaluate unseen candidate responses without serving them; illustrative 0% user-visible traffic but 100% mirrored evaluation traffic.
5. Blue-green fraud scoring — rollback by traffic switch; illustrative 1 pointer flip moves 100% traffic back to blue.

**Notebook plan:**
- Family: F17 Systems/Operational
- Concept built once (D1): `route_and_size(qps, capacity, canary_fraction)` verifies lesson $0.05\times40,000=2,000$ and $\lceil900/150\rceil=6$.
- Datasets D1–D5: D1 tiny canary trace · D2 10k stable requests · D3 +cold starts and peak qps · D4 real-ish deployment trace with warmup · D5 production-scale canary/rollback simulation
- Metric: p95 served latency across all rungs
- Closing viz: (a) latency/cost/throughput panels per workload  (b) p95-latency-vs-routed-load curve
- Pitfall on D5: cold-starting under traffic; reproduce first-user latency spike, then fix by warmup before routing.
- Notes: delete dead template helpers; CPU-only simulation.

### 20.8 — Monitoring & drift detection   [notebook: 20.8-monitoring-drift-detection.ipynb]   (family: F17)

**Lesson — Real World Applications (5):**
1. Credit score monitoring — detect feature distribution shift; lesson PSI bin $(0.30-0.20)\ln(0.30/0.20)=0.0405$.
2. Ad click model monitoring — use early feature/prediction signals before labels; lesson warns labels arrive late.
3. Fraud alert thresholds — baseline anchored z-shift; lesson $(11.5-10.0)/2.0=0.75$.
4. Recommender business dashboards — monitor predictions and outcomes as time series; illustrative 7-day baseline vs live daily mean.
5. LLM guardrail monitoring — slice drift catches localized failure; illustrative slice rate $42/50=0.84$ versus global rate can hide regressions.

**Notebook plan:**
- Family: F17 Systems/Operational
- Concept built once (D1): `drift_stats(base, live)` verifies lesson PSI term $0.0405$ and z-shift $0.75$ on tiny bins.
- Datasets D1–D5: D1 hand baseline/live bins · D2 clean monitoring stream · D3 +drift spike and delayed labels · D4 sklearn breast_cancer features with synthetic live shift · D5 production-scale feature/prediction stream simulation
- Metric: PSI drift statistic across all rungs
- Closing viz: (a) latency/cost/throughput panels per workload  (b) PSI-vs-stream-volume/shift curve
- Pitfall on D5: alerting on labels only; reproduce delayed missed alert, then fix with feature and prediction drift monitors.
- Notes: delete dead template helpers; CPU-only NumPy plus small sklearn dataset.

### 20.9 — A/B testing & online experimentation   [notebook: 20.9-ab-testing-online-experimentation.ipynb]   (family: F17)

**Lesson — Real World Applications (5):**
1. Product ranking experiments — estimate randomized lift; lesson control $480/10000=0.048$, treatment $520/10000=0.052$.
2. Ads auction changes — report relative lift; lesson $(0.052-0.048)/0.048=0.083$ relative.
3. Recommendation canaries — guardrails catch latency regressions despite primary lift; illustrative p95 guardrail threshold 200 ms.
4. Prompt release experiments — compare pass rate under randomized traffic; illustrative 740/1000 vs 690/1000 gives $0.05$ lift.
5. Fraud decision thresholds — power matters for rare outcomes; lesson standard error can exceed expected lift in underpowered tests.

**Notebook plan:**
- Family: F17 Systems/Operational
- Concept built once (D1): `ab_test_z(control_success, treatment_success, n_c, n_t)` verifies lesson rates $0.048$, $0.052$, lift $0.004$.
- Datasets D1–D5: D1 hand 20-row randomized table · D2 20k clean experiment rows · D3 +peeking and guardrail spike · D4 real-ish daily experiment trace · D5 production-scale multi-day experiment simulation
- Metric: standard-error-adjusted lift (z statistic) across all rungs
- Closing viz: (a) latency/cost/throughput panels per workload  (b) z/lift-vs-sample-size curve
- Pitfall on D5: peeking until significant; reproduce inflated false positive rate, then fix with fixed horizon or alpha-spending rule.
- Notes: delete dead template helpers; CPU-only simulation.

### 20.10 — Model compression: pruning   [notebook: 20.10-pruning.ipynb]   (family: F17)

**Lesson — Real World Applications (5):**
1. Mobile vision models — reduce parameters for memory budgets; lesson pruning $7$ of $20$ weights gives $7/20=0.35$ sparsity.
2. Server inference acceleration — density controls ideal compute; lesson $3/4=0.75$ density after pruning one of four toy weights.
3. NLP embedding compression — magnitude thresholding removes small weights; lesson threshold $0.10$ prunes only $0.02$ from $0.02,-0.50,0.10,0.80$.
4. Edge anomaly detectors — structured pruning matches hardware blocks; illustrative 4 channels pruned from 16 gives 25% channel sparsity.
5. Batch scoring cost reduction — compute proxy uses $(1-sparsity)C_{dense}$; illustrative $0.65\times100=65$ units after 35% sparsity.

**Notebook plan:**
- Family: F17 Systems/Operational
- Concept built once (D1): `prune_by_threshold(weights, threshold)` verifies lesson toy threshold and sparsity $7/20=0.35$.
- Datasets D1–D5: D1 four hand weights/request · D2 larger clean weight vector · D3 +accuracy-sensitive weights and sparse-overhead spike · D4 small sklearn logistic model weights · D5 production-scale latency simulation under unstructured vs structured pruning
- Metric: p95 inference latency across all rungs
- Closing viz: (a) latency/cost/throughput panels per workload  (b) p95-latency-vs-sparsity curve
- Pitfall on D5: counting zeros as speed; reproduce memory saving without latency gain, then fix with structured/block pruning.
- Notes: delete dead template helpers; CPU-only NumPy/sklearn for the optional small model.

### 20.11 — Model compression: quantization   [notebook: 20.11-quantization.ipynb]   (family: F17)

**Lesson — Real World Applications (5):**
1. On-device ranking — int8 reduces model bytes; lesson 1,000,000 float32 weights use 4.0 MB and int8 uses 1.0 MB, saving 3.0 MB.
2. Vision inference kernels — calibrate scale from max absolute value; lesson $1.8/127=0.01417$.
3. Recommendation embedding tables — quantize/dequantize error is measurable; lesson $0.73$ maps to $52$ then $0.737$, error $0.007$.
4. Edge speech models — clipping is calibration risk; lesson value $2.2$ with max $1.8$ clips by $0.4$.
5. Batch scoring throughput — lower bandwidth can help only with supported kernels; illustrative int8 transfers one-quarter float32 bytes.

**Notebook plan:**
- Family: F17 Systems/Operational
- Concept built once (D1): `quantize_dequantize(x, scale)` verifies lesson scale $1.8/127=0.01417$, q=52, dequantized $0.737$.
- Datasets D1–D5: D1 tiny weight vector · D2 larger clean tensor workload · D3 +outliers and bad calibration · D4 sklearn digits logistic weights under precision ladder · D5 production-scale load/precision simulation
- Metric: p95 inference latency across all rungs
- Closing viz: (a) latency/cost/throughput panels per workload  (b) p95-latency-vs-precision/load curve
- Pitfall on D5: forgetting calibration data; reproduce clipping/coarse rounding, then fix with representative calibration and per-channel scale.
- Notes: delete dead template helpers; CPU-only NumPy plus small sklearn dataset.

### 20.12 — Knowledge distillation   [notebook: 20.12-distillation.ipynb]   (family: F17)

**Lesson — Real World Applications (5):**
1. Search ranking students — preserve teacher near-miss probabilities; lesson temperature-2 soft target class 1 is $2.718/5.367=0.506$.
2. Mobile classifiers — serve smaller students; lesson $12$M parameters vs $120$M teacher is $0.10$ of size.
3. Low-latency moderation — latency speedup is explicit; lesson teacher 90 ms and student 18 ms gives $90/18=5\times$.
4. Speech command models — blend soft and hard losses; lesson $0.7\times0.42+0.3\times0.65=0.489$.
5. LLM routing — distill expensive behavior into cheap classifier; illustrative 80% easy-route traffic at 18 ms reduces average latency.

**Notebook plan:**
- Family: F17 Systems/Operational
- Concept built once (D1): `distill_loss(soft_loss, hard_loss, alpha)` verifies lesson blend $0.489$ and size ratio $12/120=0.10$.
- Datasets D1–D5: D1 three-class teacher logits · D2 clean synthetic classification workload · D3 +temperature extremes and calibration check · D4 sklearn digits teacher/student · D5 production-scale teacher/student routing simulation
- Metric: p95 inference latency across all rungs
- Closing viz: (a) latency/cost/throughput panels per workload  (b) p95-latency-vs-student-size/load curve
- Pitfall on D5: only measuring accuracy; reproduce matched top-1 with worse calibration, then fix by adding calibration metric/gate.
- Notes: delete dead template helpers; CPU-only sklearn small model.

### 20.13 — Distributed training (data/model/pipeline parallelism)   [notebook: 20.13-distributed-training.ipynb]   (family: F17)

**Lesson — Real World Applications (5):**
1. Large recommender training — compute ideal and observed speedup; lesson 8 workers on 160 minutes gives 20 ideal minutes.
2. Foundation-model data parallelism — communication reduces speedup; lesson 20 ideal + 5 overhead = 25 observed minutes.
3. Gradient synchronization planning — payload sets bandwidth cost; lesson 50M gradients at 4 bytes is 200 MB.
4. Pipeline-parallel training — utilization depends on microbatches; lesson names 4 stages and 12 microbatches for bubble reasoning.
5. Cost-aware distributed jobs — efficiency matters; lesson speedup $160/25=6.4\times$ and efficiency $6.4/8=0.80$.

**Notebook plan:**
- Family: F17 Systems/Operational
- Concept built once (D1): `distributed_time(T1, workers, comm)` verifies lesson $160/8+5=25$, speedup $6.4\times$, efficiency $0.80$.
- Datasets D1–D5: D1 hand 2-worker job · D2 8-worker clean scaling · D3 +network spike and straggler · D4 real-ish training-step trace from sampled compute/comm times · D5 production-scale cluster simulation
- Metric: throughput (examples/sec) across all rungs
- Closing viz: (a) latency/cost/throughput panels per workload  (b) throughput-vs-worker-count/load curve
- Pitfall on D5: expecting linear speedup; reproduce flattening from communication overhead, then fix with larger batches/overlap.
- Notes: delete dead template helpers; CPU-only simulation, no actual distributed training.

### 20.14 — Compilation & runtimes (XLA, TVM, ONNX)   [notebook: 20.14-compilation-runtimes.ipynb]   (family: F17, gap)

**Lesson — Real World Applications (5):**
1. Online inference graph fusion — reduce memory traffic; lesson two 4 MB reads become one 4 MB read, saving 4 MB.
2. Mobile runtimes — constant folding avoids per-request work; lesson $3\times4+2=14$ computed once.
3. Batch recommendation serving — shape specialization fixes tensor size; lesson batch 32 and feature 128 gives $32\times128=4096$ elements.
4. Vision kernels — measure steady-state speedup; lesson unfused 1.8 ms vs fused 1.1 ms saves 0.7 ms.
5. Numeric validation — tolerate reordered floats; lesson formula requires $|y_c-y_e|\le\epsilon$ instead of equality.

**Notebook plan:**
- Family: F17 Systems/Operational
- Concept built once (D1): `compile_plan(ops, static_shape)` verifies lesson speedup $1.8/1.1$ and traffic saving 4 MB on a toy graph.
- Datasets D1–D5: D1 tiny three-op graph · D2 larger clean operator chain · D3 +dynamic shapes and warmup · D4 real-ish request-shape trace · D5 production-scale compiled/eager serving simulation
- Metric: p95 inference latency across all rungs
- Closing viz: (a) latency/cost/throughput panels per workload  (b) p95-latency-vs-shape/load curve
- Pitfall on D5: benchmarking without warmup; reproduce compile time mixed into inference latency, then fix by separating warmup from steady state.
- Notes: delete dead template helpers; CPU-only NumPy graph simulation; gap topic may need fuller authored lesson text.

### 20.15 — Vector databases & ANN infra   [notebook: 20.15-vector-databases-ann.ipynb]   (family: F17)

**Lesson — Real World Applications (5):**
1. RAG retrieval — track recall with latency; lesson recall@10 with 7 true neighbors recovered is $7/10=0.70$.
2. Similar-item ads retrieval — cosine with unit norms; lesson dot $0.80$ gives $0.80/(1\times1)=0.80$.
3. Candidate generation indexes — IVF probes trade scan volume; lesson 3 lists × 120 vectors = 360 scanned vectors.
4. Latency-recall tuning — more probes cost more scans; lesson 8 probes scan 960 vectors versus 360 at 3 probes.
5. Embedding memory planning — vector count times dimension times bytes; lesson names 1,000,000 vectors × 128 dimensions for memory budgeting.

**Notebook plan:**
- Family: F17 Systems/Operational
- Concept built once (D1): `ann_search(query, vectors, probes)` verifies lesson cosine 0.80 and recall@10 $7/10=0.70$ on tiny vectors.
- Datasets D1–D5: D1 five hand vectors · D2 10k clean clustered vectors · D3 +unnormalized vectors and stale inserts · D4 real-ish synthetic embedding trace from mixtures · D5 production-scale ANN load simulation
- Metric: recall@10 across all rungs
- Closing viz: (a) latency/cost/throughput panels per workload  (b) recall@10-vs-probes/load curve
- Pitfall on D5: reporting latency without recall; reproduce fast low-probe miss rate, then fix by selecting probes under recall constraint.
- Notes: delete dead template helpers; CPU-only NumPy exact/approx search simulation.

### 20.16 — Streaming & real-time ML   [notebook: 20.16-streaming-real-time-ml.ipynb]   (family: F17)

**Lesson — Real World Applications (5):**
1. Fraud velocity features — event-time windows count actions; lesson events at minutes 1,3,7 in 5-minute windows give counts 2 and 1.
2. Live recommendations — watermarks handle lateness; lesson max event time 100 and lateness 10 gives watermark 90.
3. Ads pacing — late event detection matters; lesson event time 88 is late when watermark is 90.
4. Sensor anomaly streams — exponential updates smooth features; lesson formula $x_t=\alpha v_t+(1-\alpha)x_{t-1}$.
5. Real-time bidding features — backpressure degrades freshness; illustrative input 1,200 qps vs processing 1,000 qps accumulates 200 events/sec.

**Notebook plan:**
- Family: F17 Systems/Operational
- Concept built once (D1): `stream_windows(events, lateness)` verifies lesson tumbling counts 2 and 1 plus watermark $100-10=90$.
- Datasets D1–D5: D1 six hand events · D2 100k clean ordered events · D3 +late data and burst spikes · D4 real-ish Poisson event-time trace · D5 production-scale stream with backpressure
- Metric: freshness lag (p95 event age) across all rungs
- Closing viz: (a) latency/cost/throughput panels per workload  (b) p95-freshness-lag-vs-input-rate curve
- Pitfall on D5: ignoring backpressure; reproduce rising freshness lag, then fix by throttling/scaling processing capacity.
- Notes: delete dead template helpers; CPU-only event simulation.

### 20.17 — LLMOps & prompt management   [notebook: 20.17-llmops-prompt-management.ipynb]   (family: F17, gap)

**Lesson — Real World Applications (5):**
1. Customer support assistants — version prompt plus retrieval and tools; lesson warns prompt text alone is insufficient.
2. RAG cost control — token budget is arithmetic; lesson $500+1,800+300=2,600$ tokens.
3. Prompt release evals — pass-rate lift is explicit; lesson $0.74-0.69=0.05$.
4. Cost dashboards — input-token cost is re-derivable; lesson $2,600\times0.000002=\$0.0052$.
5. Fallback routing — route failures to safer path; illustrative 3 failed cases out of 100 gives 3% fallback rate.

**Notebook plan:**
- Family: F17 Systems/Operational
- Concept built once (D1): `prompt_eval(prompt_version, context_tokens, outcomes)` verifies lesson token sum 2,600, cost $0.0052$, and pass lift 0.05.
- Datasets D1–D5: D1 five hand prompt cases · D2 1k clean eval requests · D3 +distractors, malformed inputs, and token spikes · D4 real-ish prompt traffic trace sampled by route/tool · D5 production-scale LLMOps routing simulation
- Metric: cost per passed request across all rungs
- Closing viz: (a) latency/cost/throughput panels per workload  (b) cost-per-pass-vs-context/load curve
- Pitfall on D5: ignoring token budgets; reproduce truncation removing evidence, then fix with budget-aware retrieval/context packing.
- Notes: delete dead template helpers; CPU-only simulation, no external LLM calls; gap topic may need fuller authored cases.

### 20.18 — Evaluation harnesses   [notebook: 20.18-evaluation-harnesses.ipynb]   (family: F17, gap)

**Lesson — Real World Applications (5):**
1. LLM release harnesses — fixed cases produce repeatable pass rate; lesson $87/100=0.87$ accuracy.
2. Mobile/desktop slice evaluation — average can hide slice gaps; lesson mobile $42/50=0.84$ vs desktop $45/50=0.90$ gap $0.06$.
3. Pairwise ranking evals — compare candidate wins; lesson $34/60=0.567$ win rate.
4. Bootstrap uncertainty — sample means are computed explicitly; lesson $0.80,0.85,0.90$ average to $0.85$.
5. Registry release thresholds — turn metrics into decisions; illustrative threshold 0.86 means 0.87 passes by 0.01.

**Notebook plan:**
- Family: F17 Systems/Operational
- Concept built once (D1): `eval_harness(cases, slices, threshold)` verifies lesson $87/100=0.87$ and slice gap $0.90-0.84=0.06$.
- Datasets D1–D5: D1 ten hand eval cases · D2 1k stable eval cases · D3 +slice regression and case drift · D4 real-ish harness log from sampled case taxonomy · D5 production-scale release harness simulation
- Metric: release decision error rate across all rungs
- Closing viz: (a) latency/cost/throughput panels per workload  (b) decision-error-vs-case-volume curve
- Pitfall on D5: only reporting the mean; reproduce hidden slice regression, then fix with slice thresholds.
- Notes: delete dead template helpers; CPU-only simulation; gap topic may need more authored lesson detail.

### 20.19 — Cost & latency optimization   [notebook: 20.19-cost-latency-optimization.ipynb]   (family: F17)

**Lesson — Real World Applications (5):**
1. Search serving latency — optimize tails; lesson p95 180 ms and p50 72 ms gives $180/72=2.5\times$ median.
2. Batched inference — amortized compute is not end-to-end latency; lesson 8 requests in 40 ms gives 5 ms compute/request before queueing.
3. Cache routing — expected latency uses hit rate; lesson formula $E[L]=hL_h+(1-h)L_m$.
4. Cloud cost forecasting — request cost is count times unit cost; lesson formula $cost=nc$.
5. Multi-tier LLM serving — cheap route needs confidence rule; illustrative 60% cheap-route fraction at 20 ms and 40% expensive at 100 ms gives 52 ms expected latency.

**Notebook plan:**
- Family: F17 Systems/Operational
- Concept built once (D1): `latency_cost_policy(requests, hit_rate, unit_cost)` verifies lesson p95/p50 ratio $2.5\times$ and batching $40/8=5$ ms.
- Datasets D1–D5: D1 ten request latencies · D2 100k stable cacheable requests · D3 +tail spikes and queueing · D4 real-ish diurnal load trace · D5 production-scale multi-tier routing simulation
- Metric: cost at p95-latency constraint across all rungs
- Closing viz: (a) latency/cost/throughput panels per workload  (b) cost-vs-load under p95 constraint curve
- Pitfall on D5: batching without queue accounting; reproduce lower compute but higher end-to-end p95, then fix with max-wait batching.
- Notes: delete dead template helpers; CPU-only simulation.

### 20.20 — Edge & on-device ML   [notebook: 20.20-edge-on-device-ml.ipynb]   (family: F17)

**Lesson — Real World Applications (5):**
1. Smartphone keyboard prediction — memory includes model, runtime, and features; lesson $18+12+6=36$ MB under a 64 MB budget.
2. Wearable health inference — energy budget is per-inference times count; lesson $120$ mJ × 50/day = 6,000 mJ/day.
3. Offline translation — local inference improves availability when network is absent; illustrative 20 offline minutes are still serviceable locally.
4. Privacy-preserving personalization — raw logs stay local; illustrative aggregate count 1 per device replaces raw event upload.
5. Mobile model updates — rollback must fit deployment mechanics; illustrative 1 safe prior artifact pointer enables rollback without retraining.

**Notebook plan:**
- Family: F17 Systems/Operational
- Concept built once (D1): `edge_budget(model_mb, runtime_mb, feature_mb, energy_mj, n)` verifies lesson $18+12+6=36$ MB and $120\times50=6,000$ mJ/day.
- Datasets D1–D5: D1 one toy device budget · D2 1k clean device requests · D3 +battery/network spikes · D4 real-ish fleet trace from sampled device classes · D5 production-scale on-device rollout simulation
- Metric: SLA pass rate under memory and energy constraints across all rungs
- Closing viz: (a) latency/cost/throughput panels per workload  (b) SLA-pass-rate-vs-fleet-size/load curve
- Pitfall on D5: counting only model size; reproduce deployment passing model budget but failing total memory, then fix by including runtime and feature buffers.
- Notes: delete dead template helpers; CPU-only simulation.
