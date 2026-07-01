# Part 9 — Large Language Models

> Plan only — per-topic revamp plan. See ../00-MASTER-PLAN.md for the shared design & family registry (F1–F17).
> **Code style:** every notebook code cell is written one statement per line (newline-split, blank lines between logical groups) for readability — never dense, semicolon-packed one-liners. See ../00-MASTER-PLAN.md §B.4.
> Dominant family: F8 (LLM/Prompt); some F7 (core sequence) or F16 (scaling-law/analysis).

### 9.1 — Encoder-only models (BERT & variants)   [notebook: 9.1-encoder-only-models-bert-and-variants.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Search/query classification — bidirectional context over $T=4$ tokens has $4\times4=16$ visible pairs (lesson).
2. Masked autocomplete in writing tools — 15% masking of 20 tokens gives 3 supervised positions (lesson).
3. Sentence-pair matching for support triage — two segment embeddings keep shape $4\times768\rightarrow4\times768$ (lesson).
4. Intent classification — a 3-label head on $h_{CLS}\in\mathbb{R}^{768}$ uses 2307 parameters (lesson).
5. Entity disambiguation — MLM logits $[2,1,0]$ give top probability 0.665 (lesson).

**Notebook plan:**
- Family: F7 Sequence / NLP
- Concept built once (D1): `masked_encoder_predict()` computes full-mask attention and verifies 16 pairs, logits $[2,1,0]\rightarrow[0.665,0.245,0.090]$, and 3 masked labels from 20 tokens.
- Datasets D1–D5: D1 4-token masked sentence · D2 clean 5-sentence MLM set · D3 same with ambiguous repeated tokens and segment flips · D4 tiny inline sentiment/intent corpus · D5 longer sentence-pair set with heavy masking.
- Metric: masked-token / label accuracy.
- Closing viz: (a) per-rung attention or prediction panels  (b) accuracy-vs-context-length curve.
- Pitfall on D5: using encoder-only states for free-form generation; show continuation fails, then switch task to masked prediction/classification.
- Notes: delete dead template helpers; CPU-only tiny arrays/logistic heads; no model downloads.

### 9.2 — Decoder-only models (GPT family)   [notebook: 9.2-decoder-only-models-gpt-family.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Chat completion — causal mask at $T=4$ allows 10, not 16, pairs (lesson).
2. Autocomplete — generating 6 new tokens calls the model 6 times (lesson).
3. Controlled sampling — temperature 0.5 changes logits $[2,1,0]$ to top probability 0.867 (lesson).
4. Language-model scoring — token probabilities $0.8,0.5,0.25$ multiply to 0.100 (lesson).
5. Long-form ranking — length normalization is required because full-sentence probability punishes longer outputs (lesson pitfall; illustrative two candidates).

**Notebook plan:**
- Family: F7 Sequence / NLP
- Concept built once (D1): `causal_next_token_lm()` builds a causal mask, verifies 10 visible pairs, sequence probability 0.100, and temperature-sharpened top probability 0.867.
- Datasets D1–D5: D1 one 4-token prefix · D2 clean next-token mini-corpus · D3 noisy ambiguous prefixes · D4 tiny real text snippets bundled inline · D5 longer prompts where length bias appears.
- Metric: perplexity / normalized negative log-likelihood.
- Closing viz: (a) per-rung causal-mask and next-token panels  (b) perplexity-vs-context-length curve.
- Pitfall on D5: missing causal mask leaks future tokens; reproduce low invalid loss, then enforce causal masking and length-normalized scoring.
- Notes: delete hardcoded bar-chart code; CPU-only n-gram/feature LM.

### 9.3 — Encoder–decoder models (T5, BART)   [notebook: 9.3-encoder-decoder-models-t5-bart.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Machine translation — source $T=3$, target $U=2$ gives 9 encoder, 3 decoder, 6 cross-attention pairs (lesson).
2. Summarization — conditional probability $0.6\times0.5\times0.4=0.120$ scores a target given source (lesson).
3. Text repair/denoising — 2 corrupted spans out of 8 source tokens become reconstruction targets (lesson).
4. Form-to-text generation — cross-attention weights $[0.665,0.245,0.090]$ select source fields (lesson).
5. Data cleaning — encoder states $3\times4$ and decoder states $2\times4$ produce $2\times4$ cross-attention output (lesson).

**Notebook plan:**
- Family: F7 Sequence / NLP
- Concept built once (D1): `seq2seq_generate()` separates encoder self-attention, decoder causal attention, and cross-attention; verifies 9/3/6 pair counts and 0.120 conditional probability.
- Datasets D1–D5: D1 one source-target pair · D2 clean copy/translate toy set · D3 reordered/noisy inputs · D4 tiny real headline-summary pairs inline · D5 longer inputs where source evidence can be ignored.
- Metric: token accuracy / tiny BLEU.
- Closing viz: (a) cross-attention heatmaps per rung  (b) BLEU-vs-source-length curve.
- Pitfall on D5: ignoring cross-attention makes decoder unconditional; reproduce drift, then require source-conditioned scoring.
- Notes: CPU-only symbolic seq2seq simulator; no downloads.

### 9.4 — Pretraining objectives (MLM, next-token, denoising)   [notebook: 9.4-pretraining-objectives-mlm-next-token-denoising.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. BERT-style pretraining — 3 masked probabilities $0.8,0.6,0.5$ yield MLM loss 1.427 (lesson).
2. GPT-style pretraining — probabilities $0.7,0.5,0.2$ yield next-token loss 2.659 (lesson).
3. Data-label construction — 20 tokens with 15% masking create 3 labels (lesson).
4. Denoising text repair — replacing 5 tokens by one sentinel shortens 20 to 16 tokens (lesson).
5. Multi-objective training — losses 1.4 and 2.0 weighted 0.75/0.25 produce 1.55 (lesson).

**Notebook plan:**
- Family: F7 Sequence / NLP
- Concept built once (D1): `pretrain_loss()` supports MLM, next-token, and denoising masks; verifies 1.427, 2.659, 3 labels, 16-token compression, and 1.55 mixed loss.
- Datasets D1–D5: D1 one 20-token synthetic sentence · D2 clean synthetic corpus · D3 high-corruption/noisy corpus · D4 tiny real text snippets inline · D5 long snippets comparing objective supervision sets.
- Metric: supervised-token negative log-likelihood.
- Closing viz: (a) masked/shifted/corrupted target panels  (b) NLL-vs-corruption-rate curve.
- Pitfall on D5: comparing MLM and next-token losses directly; reproduce misleading ranking, then normalize by supervised token set.
- Notes: no hardcoded constants without data; CPU-only.

### 9.5 — Scaling laws & emergent abilities   [notebook: 9.5-scaling-laws-and-emergent-abilities.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Training-budget forecasts — with $L_\infty=1,a=2,N=100,\alpha=0.5$, model term is 0.200 (lesson).
2. Model-size planning — increasing $N$ 100 to 400 halves that term to 0.100 (lesson).
3. Data acquisition planning — $3/D^{0.5}$ at $D=900$ is 0.100 (lesson).
4. Joint compute tradeoff — $N=400,D=900$ gives total loss 1.200 (lesson).
5. Benchmark thresholding — capability margin 1.5 maps to sigmoid score 0.818 (lesson).

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): `scaling_loss(N,D)` verifies terms 0.200, 0.100, 0.100, total 1.200, and ability sigmoid 0.818.
- Datasets D1–D5: D1 one compute/parameter/data point · D2 clean rising $N$ ladder · D3 noisy loss measurements · D4 tiny fitted curve from synthetic experiments · D5 shifted data-quality ladder where power law extrapolation breaks.
- Metric: loss prediction error / ability accuracy.
- Closing viz: (a) per-rung loss-vs-size panels  (b) metric-vs-compute curve.
- Pitfall on D5: treating a power law as destiny; reproduce bad extrapolation under shift, then add held-out validation and data-quality term.
- Notes: CPU-only simulated curves; mark any extra exponents illustrative.

### 9.6 — Mixture-of-Experts language models   [notebook: 9.6-mixture-of-experts-language-models.ipynb]   (family: F8)

**Lesson — Real World Applications (5):**
1. Sparse LLM serving — top-2 of 16 experts activates 12.5% per token (lesson).
2. Domain routing — router logits $[2,1,0]$ softmax to $[0.665,0.245,0.090]$ (lesson).
3. Expert blending — top-2 renormalizes $0.665,0.245$ to $[0.731,0.269]$ (lesson).
4. Capacity planning — capacity 3 with loads $[2,5]$ drops 2 overflow tokens (lesson).
5. Multi-skill assistants — two expert outputs mix to $[0.731,0.538]$ (lesson).

**Notebook plan:**
- Family: F8 LLM / Prompt
- Concept built once (D1): `route_to_experts()` computes softmax gates, top-k renormalization, expert mixture, active fraction, and overflow from the lesson values.
- Datasets D1–D5: D1 1 prompt · D2 few-shot routing set · D3 +distractors and skewed domains · D4 tiny real-ish task/tool set · D5 longer context/scaling ladder with router collapse.
- Metric: routing accuracy / overflow rate.
- Closing viz: (a) per-rung expert-load panels  (b) accuracy-or-overflow-vs-context/compute curve.
- Pitfall on D5: router collapse sends most tokens to one expert; reproduce queue/overflow, then add load-balancing and capacity checks.
- Notes: delete generic unused helpers; CPU-only small routers.

### 9.7 — KV cache & inference optimization   [notebook: 9.7-kv-cache-and-inference-optimization.ipynb]   (family: F8)

**Lesson — Real World Applications (5):**
1. Chat serving latency — without cache, length 5 recomputes 15 token states; cache computes 5 (lesson).
2. Memory sizing — $L=2,H=2,T=4,d=3$ fp16 KV memory is 192 bytes (lesson).
3. Streaming generation — adding one token grows cache length $4\rightarrow5$ (lesson).
4. Attention reuse — scores $[2,1,0]$ over cached keys still softmax to $[0.665,0.245,0.090]$ (lesson).
5. Multi-turn safety — caching a different prompt prefix is numerically plausible but wrong (lesson pitfall; illustrative prefix pair).

**Notebook plan:**
- Family: F8 LLM / Prompt
- Concept built once (D1): `cached_attention()` verifies 15 vs 5 states, 192-byte KV memory, unchanged softmax weights, and one-row cache append.
- Datasets D1–D5: D1 1 prompt · D2 few-shot prompt batch · D3 +distractor prefix reuse · D4 tiny real chat snippets inline · D5 longer context/scaling ladder stressing memory.
- Metric: cost per generated token / correctness.
- Closing viz: (a) cache growth panels per rung  (b) cost-vs-context-length curve.
- Pitfall on D5: KV memory grows linearly and wrong-prefix cache corrupts attention; reproduce, then key cache by exact prefix and cap context.
- Notes: CPU-only array attention; no serving stack.

### 9.8 — Quantized inference (GPTQ, AWQ)   [notebook: 9.8-quantized-inference-gptq-awq.ipynb]   (family: F8)

**Lesson — Real World Applications (5):**
1. Edge/mobile LLMs — 4-bit quantization has 16 integer levels (lesson).
2. Memory reduction — a 7B model is about 14.0 GB fp16 vs 3.5 GB at 4-bit before overheads (lesson).
3. Weight packing — $w=0.37,s=0.1,z=8$ maps to $q=12,\hat w=0.4$ (lesson).
4. Error auditing — absolute quantization error is 0.03 for that weight (lesson).
5. AWQ channel protection — keep salient weight 2.0 unquantized while quantizing 0.2 (lesson).

**Notebook plan:**
- Family: F8 LLM / Prompt
- Concept built once (D1): `quantize_dequantize()` verifies 16 levels, $q=12$, $\hat w=0.4$, error 0.03, and 14.0-to-3.5 GB scaling.
- Datasets D1–D5: D1 1 prompt/weight vector · D2 few-shot linear classifier set · D3 +distractor rare large channels · D4 tiny real text-feature classifier · D5 longer context/scaling ladder with accumulated decoding error.
- Metric: accuracy per MB / quantization error.
- Closing viz: (a) per-rung weight/logit error panels  (b) accuracy-vs-bitwidth-or-memory curve.
- Pitfall on D5: quantizing all weights equally damages rare large activation channels; reproduce, then protect salient channels AWQ-style.
- Notes: no large model downloads; simulate logits with small matrices.

### 9.9 — Speculative decoding   [notebook: 9.9-speculative-decoding.ipynb]   (family: F8)

**Lesson — Real World Applications (5):**
1. Low-latency chat — verifying 4 draft tokens in one target pass can replace 4 large-model passes if accepted (lesson).
2. Draft acceptance — target 0.30 and draft 0.60 gives accept probability 0.500 (lesson).
3. Guaranteed acceptance case — target 0.70 vs draft 0.40 gives probability 1.000 (lesson).
4. Throughput estimation — accept probabilities $0.9,0.8,0.5$ sum to 2.2 expected accepted tokens (lesson).
5. Batch verification — all-accepted probability is $0.9\times0.8\times0.5=0.360$ (lesson).

**Notebook plan:**
- Family: F8 LLM / Prompt
- Concept built once (D1): `spec_decode()` computes $a_i=\min(1,p/q)$, verifies 0.500, 1.000, 2.2 expected accepts, and 0.360 all-accept probability.
- Datasets D1–D5: D1 1 prompt · D2 few-shot clean draft set · D3 +distractor weak draft model · D4 tiny real text snippets inline · D5 longer context/scaling ladder with rejections.
- Metric: accepted tokens per target pass.
- Closing viz: (a) per-rung accept/reject panels  (b) speedup-vs-draft-quality curve.
- Pitfall on D5: counting proposed rather than accepted tokens overstates speedup; reproduce, then report accepted tokens and target passes.
- Notes: replace any bar chart of constants with simulated draft/target distributions.

### 9.10 — Knowledge distillation for LMs (DistilBERT)   [notebook: 9.10-knowledge-distillation-for-lms-distilbert.ipynb]   (family: F8)

**Lesson — Real World Applications (5):**
1. Mobile classification — a 110M student is 32.4% of a 340M teacher (lesson).
2. Soft-label transfer — teacher logits $[2,1,0]$ give $[0.665,0.245,0.090]$ (lesson).
3. Temperature tuning — $T=2$ softens logits to $[0.506,0.307,0.186]$ (lesson).
4. Student training — CE on teacher top probability 0.7 is 0.357 (lesson).
5. Distribution matching — KL from $[0.7,0.2,0.1]$ to $[0.5,0.3,0.2]$ is 0.085 (lesson).

**Notebook plan:**
- Family: F8 LLM / Prompt
- Concept built once (D1): `distill_step()` computes temperature-softened teacher/student distributions, KL=0.085, CE=0.357, and 32.4% parameter fraction.
- Datasets D1–D5: D1 1 prompt/logit vector · D2 few-shot classification set · D3 +distractors and teacher mistakes · D4 tiny real text-classification corpus inline · D5 longer context/scaling ladder where mistakes compound.
- Metric: student accuracy / KL to teacher.
- Closing viz: (a) per-rung teacher-vs-student probability panels  (b) accuracy-vs-student-size curve.
- Pitfall on D5: student imitates teacher mistakes; reproduce, then add held-out human labels / mistake filter.
- Notes: CPU-only logistic teachers/students.

### 9.11 — Full fine-tuning vs parameter-efficient (LoRA, adapters, prefix)   [notebook: 9.11-full-fine-tuning-vs-parameter-efficient-lora-adapters.ipynb]   (family: F8)

**Lesson — Real World Applications (5):**
1. Domain adaptation — full $64\times64$ matrix has 4096 trainable weights (lesson).
2. LoRA fine-tuning — rank 4 uses $64\times4+4\times64=512$ weights (lesson).
3. Training-cost planning — LoRA fraction is 12.5% of full matrix (lesson).
4. Adapter serving — bottleneck 8 around width 64 uses 1024 weights (lesson).
5. Prefix tuning — 10 virtual tokens with width 64 store 640 prompt parameters per layer (lesson).

**Notebook plan:**
- Family: F8 LLM / Prompt
- Concept built once (D1): `apply_lora_update()` verifies full/LoRA/adapters/prefix counts and uses $W'=W+BA$ on a toy classifier.
- Datasets D1–D5: D1 1 prompt · D2 few-shot domain set · D3 +distractors needing higher rank · D4 tiny real text corpus inline · D5 longer context/scaling ladder where rank bottleneck appears.
- Metric: accuracy per trainable parameter.
- Closing viz: (a) per-rung update-matrix panels  (b) accuracy-vs-trainable-parameters curve.
- Pitfall on D5: rank too small bottlenecks $BA$; reproduce stable loss/poor quality, then raise rank or full-tune baseline.
- Notes: simulate PEFT on small matrices; no model downloads.

### 9.12 — Instruction tuning   [notebook: 9.12-instruction-tuning.ipynb]   (family: F8)

**Lesson — Real World Applications (5):**
1. Assistant training — response probabilities $0.8,0.5,0.25$ give SFT loss 2.303 (lesson).
2. Prompt masking — 5 prompt + 3 response tokens means 37.5% receive loss (lesson).
3. Skill mixing — 0.7 chat and 0.3 code losses combine to 1.300 (lesson).
4. Format control — format-token logit gain +1.5 changes odds by 4.482 (lesson).
5. Dataset sizing — 10,000 examples at 200 response tokens create 2,000,000 supervised tokens (lesson).

**Notebook plan:**
- Family: F8 LLM / Prompt
- Concept built once (D1): `sft_loss()` masks prompt tokens, verifies 2.303 response loss, 37.5% supervised positions, 1.300 mixture loss, and odds gain 4.482.
- Datasets D1–D5: D1 1 prompt · D2 few-shot instruction set · D3 +distractors/rare behavior · D4 tiny real-style instruction corpus inline · D5 longer context/scaling ladder with format shift.
- Metric: instruction-following accuracy.
- Closing viz: (a) per-rung prompt/response loss-mask panels  (b) accuracy-vs-supervised-token-count curve.
- Pitfall on D5: putting loss on prompt tokens trains echoing; reproduce echo behavior, then response-only mask.
- Notes: CPU-only feature model; no real LLM training.

### 9.13 — Reward modeling   [notebook: 9.13-reward-modeling.ipynb]   (family: F8)

**Lesson — Real World Applications (5):**
1. Preference labeling — reward gap 1.5 gives preference probability 0.818 (lesson).
2. Pairwise loss — $-\log0.818=0.201$ for the chosen answer (lesson).
3. Bad preference detection — reversed gap -1.0 gives probability 0.269 and loss 1.313 (lesson).
4. Score calibration — adding +5 to both rewards leaves probability unchanged (lesson).
5. Batch reporting — losses 0.201, 0.693, 1.313 average to 0.736 (lesson).

**Notebook plan:**
- Family: F8 LLM / Prompt
- Concept built once (D1): `reward_model_loss()` implements Bradley-Terry pairwise loss and verifies 0.818, 0.201, 0.269, 1.313, and 0.736 average.
- Datasets D1–D5: D1 1 prompt/preference pair · D2 few-shot preference set · D3 +distractor annotator artifacts · D4 tiny real-style helpfulness pairs inline · D5 longer context/scaling ladder with reward gaming.
- Metric: pairwise preference accuracy.
- Closing viz: (a) per-rung chosen/rejected reward panels  (b) accuracy-vs-number-of-pairs curve.
- Pitfall on D5: high reward can be gamed; reproduce reward hack, then evaluate against held-out human outcomes.
- Notes: CPU-only linear reward model.

### 9.14 — RLHF   [notebook: 9.14-rlhf.ipynb]   (family: F8)

**Lesson — Real World Applications (5):**
1. Assistant alignment — reward 2.0 minus KL price $0.1\times3.0$ gives objective 1.700 (lesson).
2. PPO updates — ratio 1.2 with advantage 0.5 gives term 0.600 (lesson).
3. Clipping — ratio 1.4 clipped to 1.2 gives 0.600 (lesson).
4. Drift pricing — KL doubling 3 to 6 raises penalty 0.3 to 0.6 (lesson).
5. Reward centering — advantage $2.0-1.2=0.800$ (lesson).

**Notebook plan:**
- Family: F8 LLM / Prompt
- Concept built once (D1): `kl_regularized_update()` verifies objective 1.700, PPO term 0.600, clipping, doubled KL penalty, and advantage 0.800.
- Datasets D1–D5: D1 1 prompt/action · D2 few-shot preference-policy set · D3 +distractor reward loopholes · D4 tiny real-style instruction/reward set inline · D5 longer context/scaling ladder with KL drift.
- Metric: reward minus KL / win rate.
- Closing viz: (a) per-rung reward-KL policy panels  (b) win-rate-vs-KL-budget curve.
- Pitfall on D5: setting $\beta$ too low chases reward-model loopholes; reproduce, then tune KL leash and human check.
- Notes: simulated bandit/policy table, CPU-only.

### 9.15 — Preference optimization (DPO, IPO)   [notebook: 9.15-preference-optimization-dpo-ipo.ipynb]   (family: F8)

**Lesson — Real World Applications (5):**
1. Direct alignment — chosen margin 0.5 and rejected margin 0.2 give DPO margin 0.3 (lesson).
2. DPO loss — with $\beta=2$, logit 0.6 gives loss 0.437 (lesson).
3. Temperature effect — $\beta$ 1 to 2 changes sigmoid 0.574 to 0.646 (lesson).
4. IPO target — $1/(2\beta)$ with $\beta=2$ is 0.250 (lesson).
5. IPO error — actual gap 0.3 gives squared error 0.0025 (lesson).

**Notebook plan:**
- Family: F8 LLM / Prompt
- Concept built once (D1): `dpo_loss()` computes reference-relative chosen/rejected margins, verifies 0.3 margin, 0.437 loss, sigmoid shift, IPO target 0.250, and 0.0025 error.
- Datasets D1–D5: D1 1 prompt preference · D2 few-shot preference set · D3 +label noise/distractors · D4 tiny real-style pair corpus inline · D5 longer context/scaling ladder with saturated $\beta$.
- Metric: pairwise preference accuracy.
- Closing viz: (a) per-rung margin panels  (b) accuracy-vs-beta-or-pair-count curve.
- Pitfall on D5: dropping reference terms loses KL anchor; reproduce drift, then restore reference margins.
- Notes: CPU-only probability tables.

### 9.16 — Constitutional AI   [notebook: 9.16-constitutional-ai.ipynb]   (family: F8)

**Lesson — Real World Applications (5):**
1. Policy-based critique — weights $[2,1]$ and violations $[0.3,0.8]$ give scores $[0.6,0.8]$ (lesson).
2. Revision selection — second principle chosen because 0.8 > 0.6 (lesson).
3. Safety rewriting — reducing violations to $[0.2,0.2]$ lowers weighted total 1.4 to 0.6 (lesson).
4. Preference labeling — score gap 1.0 gives probability 0.731 (lesson).
5. Iterative critique — improvements 0.4, 0.2, 0.1 reduce violation by 0.7 total (lesson).

**Notebook plan:**
- Family: F8 LLM / Prompt
- Concept built once (D1): `constitutional_revise()` scores principles, selects max violation, revises, and verifies 1.4-to-0.6 reduction and 0.731 preference probability.
- Datasets D1–D5: D1 1 prompt/principle · D2 few-shot critique set · D3 +conflicting principles/distractors · D4 tiny real-style policy examples inline · D5 longer context/scaling ladder with vague scores.
- Metric: violation reduction while preserving task success.
- Closing viz: (a) per-rung principle-score panels  (b) helpfulness/safety-vs-rounds curve.
- Pitfall on D5: optimizing only harmlessness erases helpfulness; reproduce, then include task-success term in weighted total.
- Notes: simulated critiques; no generated harmful content beyond benign placeholders.

### 9.17 — In-context learning   [notebook: 9.17-in-context-learning.ipynb]   (family: F8)

**Lesson — Real World Applications (5):**
1. Few-shot classification — similarities $[2,1,0]$ give weights $[0.665,0.245,0.090]$ (lesson).
2. Label inference — weighted label average $0.665\times1+0.245\times0+0.090\times1=0.755$ predicts class 1 (lesson).
3. Retrieval-style demos — adding score 3 raises that example's softmax weight to 0.644 (lesson).
4. Context budgeting — 8-token window with three 2-token examples leaves 2 query tokens (lesson).
5. Order effects — recency bias +0.5 changes last logit from 0 to 0.5 (lesson).

**Notebook plan:**
- Family: F8 LLM / Prompt
- Concept built once (D1): `icl_predict()` computes similarity softmax over demonstrations and verifies 0.755 weighted label, 0.644 added-example weight, and context budget.
- Datasets D1–D5: D1 1 prompt · D2 few-shot set · D3 +distractors/order flips · D4 tiny real text-label examples inline · D5 longer context/scaling ladder with diluted attention.
- Metric: accuracy.
- Closing viz: (a) per-rung demo-weight panels  (b) accuracy-vs-context-examples curve.
- Pitfall on D5: order sensitivity because examples are tokens, not a set; reproduce, then average shuffled orders or rank examples by similarity.
- Notes: CPU-only nearest-neighbor prompt simulator.

### 9.18 — Prompting (zero/few-shot, chain-of-thought)   [notebook: 9.18-prompting-zero-few-shot-chain-of-thought.ipynb]   (family: F8)

**Lesson — Real World Applications (5):**
1. Zero-shot routing — logits $[1,0]$ give first-answer probability 0.731 (lesson).
2. Few-shot prompting — one demo logit +0.8 raises probability to 0.858 (lesson).
3. Chain-of-thought sampling — three samples with success rate 0.6 have majority success 0.648 (lesson).
4. Context-window planning — prompt length 1200 in 2048 leaves 848 tokens (lesson).
5. Format-sensitive APIs — bad format penalty -1.0 changes odds by 0.368 (lesson).

**Notebook plan:**
- Family: F8 LLM / Prompt
- Concept built once (D1): `prompt_conditioned_predict()` verifies zero-shot 0.731, demo 0.858, majority 0.648, remaining 848 tokens, and format odds 0.368.
- Datasets D1–D5: D1 1 prompt · D2 few-shot set · D3 +distractors/label imbalance · D4 tiny real-style QA/instruction corpus inline · D5 longer context/scaling ladder with ungrounded chains.
- Metric: answer accuracy / cost.
- Closing viz: (a) per-rung prompt component panels  (b) accuracy-vs-context-tokens curve.
- Pitfall on D5: few-shot label imbalance biases the conditional distribution; reproduce skew, then balance/shuffle examples.
- Notes: replace hardcoded demonstrations with data-driven prompt simulator.

### 9.19 — Advanced reasoning (self-consistency, tree/graph of thought, ReAct)   [notebook: 9.19-advanced-reasoning-self-consistency-tree-graph-of-thou.ipynb]   (family: F8)

**Lesson — Real World Applications (5):**
1. Math QA self-consistency — votes $[A,A,B,A,B]$ give A a 0.600 majority (lesson).
2. Planning search — branching factor 3 and depth 2 explores 13 nodes (lesson).
3. Fact-check graphs — two paths sharing one subclaim need 3 unique checks instead of 4 (lesson).
4. ReAct tool grounding — prior 0.55 with likelihood ratio 3 gives probability 0.786 (lesson).
5. Cost governance — 5 traces at 100 tokens each cost 500 generated tokens (lesson).

**Notebook plan:**
- Family: F8 LLM / Prompt
- Concept built once (D1): `reasoning_search()` aggregates traces, tree nodes, shared checks, ReAct Bayesian update, and token cost; verifies 0.600, 13, 3, 0.786, 500.
- Datasets D1–D5: D1 1 prompt · D2 few-shot reasoning set · D3 +distractor correlated errors · D4 tiny real-style arithmetic/tool set inline · D5 longer context/scaling ladder with weak scorer.
- Metric: answer accuracy per generated token.
- Closing viz: (a) per-rung trace/tree panels  (b) accuracy-vs-token-budget curve.
- Pitfall on D5: self-consistency fails when errors are correlated; reproduce, then diversify prompts/tools and verify observations.
- Notes: CPU-only symbolic traces; no LLM calls.

### 9.20 — Tool use & function calling   [notebook: 9.20-tool-use-and-function-calling.ipynb]   (family: F8, gap)

**Lesson — Real World Applications (5):**
1. Calculator calls — numeric argument error $|42-40|=2$ can be checked exactly (lesson).
2. API dispatch — tool-call logits $[2,1,0]$ give probabilities $[0.665,0.245,0.090]$ (lesson).
3. Schema validation — 2 valid of 3 required fields gives completeness 0.667 (lesson).
4. Observation integration — logit boost +1.2 changes odds by 3.320 (lesson).
5. Retry monitoring — 2 failed calls and 1 success gives success rate 0.333 (lesson).

**Notebook plan:**
- Family: F8 LLM / Prompt
- Concept built once (D1): `tool_policy()` selects a tool, validates args, executes a deterministic function, folds observation into logits, and verifies 0.667 completeness, error 2, odds 3.320, and success 0.333.
- Datasets D1–D5: D1 1 prompt · D2 few-shot tool set · D3 +distractors/ambiguous schemas · D4 tiny real corpus/tool set (calculator, lookup, unit converter) · D5 longer context/scaling ladder with loop risk.
- Metric: task success after tool execution.
- Closing viz: (a) per-rung tool-call outcome panels  (b) success-vs-context/tool-count curve.
- Pitfall on D5: schema-valid args can be semantically wrong and retries without stopping loop; reproduce, then add semantic validators and retry cap.
- Notes: current notebook is hardcoded bar charts; replace fully; gap note: lesson flagged gap, so author should enrich body before implementation.

### 9.21 — LLM agents & orchestration   [notebook: 9.21-llm-agents-and-orchestration.ipynb]   (family: F8)

**Lesson — Real World Applications (5):**
1. Workflow automation — dependencies A→C, B→C, C→D leave two initially ready steps (lesson).
2. Controller selection — scores $[0.2,0.6,0.4]$ choose action 0.6 (lesson).
3. Memory retrieval — retrieving 3 from 10 memories uses 30% in prompt (lesson).
4. Termination logic — success termination 0.8 leaves continuation 0.2 (lesson).
5. Agent ensembles — votes $[1,1,0]$ plus judge 1 give majority 0.750 (lesson).

**Notebook plan:**
- Family: F8 LLM / Prompt
- Concept built once (D1): `agent_loop()` plans ready steps, selects actions, retrieves memory, applies termination, and aggregates votes; verifies 2 ready, 0.6 action, 30%, 0.2 continuation, 0.750 majority.
- Datasets D1–D5: D1 1 prompt · D2 few-shot task set · D3 +distractor memories · D4 tiny real corpus/tool set · D5 longer context/scaling ladder with nontermination.
- Metric: task completion rate / steps to stop.
- Closing viz: (a) per-rung state/action/memory panels  (b) completion-vs-step-budget curve.
- Pitfall on D5: agent without termination criteria keeps planning after success; reproduce, then add explicit stop rule.
- Notes: CPU-only deterministic agent simulator.

### 9.22 — Retrieval-Augmented Generation   [notebook: 9.22-retrieval-augmented-generation.ipynb]   (family: F8)

**Lesson — Real World Applications (5):**
1. Enterprise QA — dot products $[0.8,0.3,0.1]$ rank first document highest (lesson).
2. Support knowledge bases — top-2 recall with one relevant doc in top two is 1.000 (lesson).
3. Chunking pipelines — chunk size 200 and overlap 50 produce stride 150 (lesson).
4. Evidence-weighted generation — weights $[0.7,0.3]$ and likelihoods $[0.9,0.4]$ give grounded probability 0.75 (lesson).
5. Hallucination reduction — retrieval raises probability 0.4 to 0.75, gain 0.35 (lesson).

**Notebook plan:**
- Family: F8 LLM / Prompt
- Concept built once (D1): `rag_answer()` embeds/query-ranks docs, chunks with stride 150, computes top-k recall and evidence-weighted probability 0.75.
- Datasets D1–D5: D1 1 prompt · D2 few-shot doc set · D3 +distractor chunks · D4 tiny real corpus/tool set inline · D5 longer context/scaling ladder with irrelevant retrieval.
- Metric: grounded answer accuracy / recall@k.
- Closing viz: (a) per-rung retrieved-evidence panels  (b) accuracy-vs-context/chunk-count curve.
- Pitfall on D5: irrelevant chunks increase hallucination; reproduce, then rerank/filter and require citation use.
- Notes: CPU-only TF-IDF embeddings; no external downloads.

### 9.23 — Hallucination & factuality   [notebook: 9.23-hallucination-and-factuality.ipynb]   (family: F8, gap)

**Lesson — Real World Applications (5):**
1. Generated report QA — 3 unsupported claims among 10 gives rate 0.300 (lesson).
2. Calibration dashboards — confidence 0.8 with accuracy 0.6 has error 0.200 (lesson).
3. Retrieval grounding — unsupported claims 3 to 1 cuts rate to 0.100 (lesson).
4. Abstention policies — threshold 0.7 blocks scores 0.4 and 0.6 (lesson).
5. Factuality scorecards — factuality score is $1-0.3=0.700$ (lesson).

**Notebook plan:**
- Family: F8 LLM / Prompt
- Concept built once (D1): `claim_factuality()` extracts claims, matches evidence, computes unsupported rate, calibration error, abstention, and factuality score; verifies 0.300, 0.200, 0.100, 0.700.
- Datasets D1–D5: D1 1 prompt · D2 few-shot claim/evidence set · D3 +distractor evidence · D4 tiny real-style corpus inline · D5 longer context/scaling ladder with vague answers.
- Metric: unsupported-claim rate.
- Closing viz: (a) per-rung claim-evidence panels  (b) unsupported-rate-vs-context/evidence curve.
- Pitfall on D5: vague answers hide errors because claim extraction is required; reproduce, then force atomic claims and evidence citations.
- Notes: gap note: lesson flagged gap; keep examples grounded in current lesson numbers and mark added thresholds illustrative.

### 9.24 — LLM evaluation & benchmarks   [notebook: 9.24-llm-evaluation-and-benchmarks.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Leaderboard confidence — accuracy $72/100=0.720$ has 95% half-width 0.088 (lesson).
2. Code-generation evals — pass@3 with $n=10,c=3$ is 0.708 (lesson).
3. Pairwise model comparisons — 30 wins and 20 losses give win rate 0.600 (lesson).
4. Contamination audits — 5 contaminated tasks in 100 is 5% (lesson).
5. Cost-aware releases — score $0.8-0.01\times20=0.600$ prices cost/latency (lesson).

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): `evaluate_benchmark()` computes binomial interval, pass@k, win rate, contamination, and cost-weighted score; verifies 0.720±0.088, 0.708, 0.600, 5%, 0.600.
- Datasets D1–D5: D1 one benchmark item · D2 clean rising task count · D3 noisy/ambiguous benchmark · D4 tiny real-style QA/code eval set inline · D5 contaminated long benchmark/scaling ladder.
- Metric: accuracy with confidence interval.
- Closing viz: (a) per-rung benchmark-result panels  (b) score-uncertainty-vs-sample-size curve.
- Pitfall on D5: benchmarks without confidence intervals overread noise; reproduce false ranking, then add CIs and contamination flags.
- Notes: CPU-only scoring functions; no benchmark downloads.

### 9.25 — Guardrails & safety filtering   [notebook: 9.25-guardrails-and-safety-filtering.ipynb]   (family: F8)

**Lesson — Real World Applications (5):**
1. Safety classifiers — score 0.82 with threshold 0.70 blocks (lesson).
2. Policy tuning — true positive rate $90/100=0.900$ and false positive rate $5/100=0.050$ (lesson).
3. Threshold tradeoffs — raising threshold 0.7 to 0.9 misses scores in $[0.7,0.9)$ (lesson).
4. Cascaded filters — pass probabilities 0.9 and 0.8 pass together with 0.72 (lesson).
5. Utility modeling — $10\times90-2\times5-50\times10=390$ (lesson).

**Notebook plan:**
- Family: F8 LLM / Prompt
- Concept built once (D1): `guardrail_decision()` applies thresholding, computes TPR/FPR, cascade pass probability, and utility; verifies block at 0.82, 0.900/0.050, 0.72, 390.
- Datasets D1–D5: D1 1 prompt · D2 few-shot safe/blocked set · D3 +distractors/borderline requests · D4 tiny real-style policy corpus inline · D5 longer context/scaling ladder with tool/retrieval actions.
- Metric: utility / balanced safety accuracy.
- Closing viz: (a) per-rung threshold/confusion panels  (b) utility-vs-threshold curve.
- Pitfall on D5: filtering only final text misses harmful actions; reproduce tool/retrieval bypass, then wrap tools and retrieval too.
- Notes: keep examples benign; CPU-only threshold classifier; no safety model downloads.
