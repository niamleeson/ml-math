/* All ML — Part 09 applications (5 each). Loaded after content-part-09.js, before all-ml-register.js. */

/* ---- _apps-part09-A.js ---- */
(window.ALLML_CONTENT["9.1"] = window.ALLML_CONTENT["9.1"] || {}).applications = [
  { title: "Search query classification", background: "<p>Encoder-only models are useful when the whole query can be read before scoring a category, such as navigational, support, or shopping intent.</p>", numbers: "<p>With $T=4$ query tokens, bidirectional attention exposes $4\\times4=16$ query-key pairs, so every token can use both left and right context before the classifier head fires.</p>" },
  { title: "Masked autocomplete in writing tools", background: "<p>Instead of generating indefinitely, a BERT-style writing tool fills blanks inside text that the user has already drafted.</p>", numbers: "<p>At the lesson masking rate, a 20-token sentence creates $0.15\\times20=3$ supervised masked positions and leaves the other 17 tokens as context.</p>" },
  { title: "Sentence-pair support triage", background: "<p>Support systems compare a customer sentence with a candidate policy or FAQ sentence, using segment embeddings to preserve which side each token came from.</p>", numbers: "<p>Two segment embeddings are added without changing tensor size: token, position, and segment arrays all keep the final contextual shape $4\\times768\\rightarrow4\\times768$.</p>" },
  { title: "Intent classification from CLS", background: "<p>A single pooled contextual vector can feed a small classifier for labels such as billing, creative quality, or delivery issue.</p>", numbers: "<p>A 3-label head on $h_{CLS}\\in\\mathbb{R}^{768}$ uses $768\\times3+3=2307$ trainable parameters.</p>" },
  { title: "Entity disambiguation", background: "<p>When a product or entity mention is ambiguous, the masked-token distribution can rank candidates using surrounding context.</p>", numbers: "<p>MLM logits $[2,1,0]$ give $e^2/(e^2+e^1+e^0)=0.665$, so the top entity receives about 66.5% probability.</p>" }
];

(window.ALLML_CONTENT["9.2"] = window.ALLML_CONTENT["9.2"] || {}).applications = [
  { title: "Chat completion", background: "<p>Decoder-only systems answer by extending a prefix one token at a time, never reading future response tokens during scoring.</p>", numbers: "<p>For $T=4$, the causal mask allows $1+2+3+4=10$ visible pairs instead of $4\\times4=16$ full-attention pairs.</p>" },
  { title: "Autocomplete", background: "<p>Autocomplete repeatedly calls the same next-token model as the displayed prefix grows.</p>", numbers: "<p>Generating 6 new tokens requires 6 sequential model calls, one for each newly extended prefix.</p>" },
  { title: "Controlled sampling", background: "<p>Temperature changes how sharply the model concentrates probability on its favorite token.</p>", numbers: "<p>Temperature $0.5$ scales logits $[2,1,0]$ to $[4,2,0]$, raising the top softmax probability to about 0.867.</p>" },
  { title: "Language-model scoring", background: "<p>Candidate responses can be ranked by multiplying or summing log probabilities of their tokens under the prefix.</p>", numbers: "<p>Token probabilities $0.8,0.5,0.25$ multiply to $0.8\\times0.5\\times0.25=0.100$ for the whole three-token sequence.</p>" },
  { title: "Long-form ranking", background: "<p>Raw sequence probability usually favors short answers, so production ranking often uses average log probability or another length-normalized score.</p>", numbers: "<p>Illustratively, a two-token answer with $0.6^2=0.36$ can outrank a four-token answer with $0.7^4=0.2401$ by raw probability even though each long-answer token is stronger.</p>" }
];

(window.ALLML_CONTENT["9.3"] = window.ALLML_CONTENT["9.3"] || {}).applications = [
  { title: "Machine translation", background: "<p>Encoder-decoder models read the source sentence once, then generate the target sentence while attending back to source evidence.</p>", numbers: "<p>With source length $T=3$ and target length $U=2$, the model has 9 encoder pairs, 3 decoder causal pairs, and $2\\times3=6$ cross-attention pairs.</p>" },
  { title: "Summarization", background: "<p>A summary is scored conditionally on the source document, not as a standalone language-model continuation.</p>", numbers: "<p>Target-token probabilities $0.6,0.5,0.4$ under the same source give conditional score $0.6\\times0.5\\times0.4=0.120$.</p>" },
  { title: "Text repair and denoising", background: "<p>Denoising models corrupt input spans and train the decoder to reconstruct the missing content.</p>", numbers: "<p>If 2 spans are corrupted out of 8 source tokens, those 2 spans become reconstruction targets while the encoder still reads the remaining evidence.</p>" },
  { title: "Form-to-text generation", background: "<p>Structured fields can be treated as source tokens, and cross-attention indicates which field supports each generated phrase.</p>", numbers: "<p>Cross-attention scores $[2,1,0]$ become weights $[0.665,0.245,0.090]$, so the first field dominates the generated token.</p>" },
  { title: "Data cleaning", background: "<p>Encoder-decoder repair can map noisy records to cleaned text while preserving a separate representation for source and target.</p>", numbers: "<p>Encoder states with shape $3\\times4$ and decoder states with shape $2\\times4$ produce a $2\\times4$ cross-attention output.</p>" }
];

(window.ALLML_CONTENT["9.4"] = window.ALLML_CONTENT["9.4"] || {}).applications = [
  { title: "BERT-style pretraining", background: "<p>Masked language modeling hides selected tokens and trains only on those hidden positions.</p>", numbers: "<p>For masked probabilities $0.8,0.6,0.5$, the MLM loss is $-\\log0.8-\\log0.6-\\log0.5=1.427$.</p>" },
  { title: "GPT-style pretraining", background: "<p>Next-token pretraining shifts raw text so every prefix predicts the following token under a causal mask.</p>", numbers: "<p>Probabilities $0.7,0.5,0.2$ give loss $-\\log0.7-\\log0.5-\\log0.2=2.659$.</p>" },
  { title: "Automatic label construction", background: "<p>Pretraining is powerful because labels are made from text itself rather than manually annotated for each task.</p>", numbers: "<p>A 20-token sequence with 15% masking creates $0.15\\times20=3$ supervised labels.</p>" },
  { title: "Denoising text repair", background: "<p>Span corruption teaches reconstruction from incomplete evidence and often uses sentinel tokens to mark missing spans.</p>", numbers: "<p>Replacing 5 consecutive tokens with one sentinel changes input length from 20 to $20-5+1=16$ tokens.</p>" },
  { title: "Multi-objective training", background: "<p>Systems sometimes blend objectives so one run learns complementary prediction skills.</p>", numbers: "<p>Combining losses 1.4 and 2.0 with weights 0.75 and 0.25 gives $0.75\\times1.4+0.25\\times2.0=1.55$.</p>" }
];

(window.ALLML_CONTENT["9.5"] = window.ALLML_CONTENT["9.5"] || {}).applications = [
  { title: "Training-budget forecasts", background: "<p>Scaling curves estimate whether more parameters, more data, or both are likely to reduce loss enough to justify a run.</p>", numbers: "<p>With $L_\\infty=1$, $a=2$, $N=100$, and $\\alpha=0.5$, the model-size term is $2/\\sqrt{100}=0.200$.</p>" },
  { title: "Model-size planning", background: "<p>Power-law terms show the diminishing returns expected from increasing parameter count.</p>", numbers: "<p>Increasing $N$ from 100 to 400 changes the model term from $2/10=0.200$ to $2/20=0.100$, a factor-of-two reduction.</p>" },
  { title: "Data acquisition planning", background: "<p>Data tokens are a separate bottleneck, so collecting data can be more valuable than adding parameters.</p>", numbers: "<p>For the lesson data term, $3/D^{0.5}$ at $D=900$ is $3/30=0.100$.</p>" },
  { title: "Joint compute tradeoff", background: "<p>Planning needs the model and data terms together because either one can dominate excess loss.</p>", numbers: "<p>At $N=400,D=900$, total loss is $1+0.100+0.100=1.200$.</p>" },
  { title: "Benchmark thresholding", background: "<p>Capabilities can look emergent when a smooth score crosses a benchmark threshold.</p>", numbers: "<p>A capability margin of 1.5 maps to sigmoid score $1/(1+e^{-1.5})=0.818$.</p>" }
];

(window.ALLML_CONTENT["9.6"] = window.ALLML_CONTENT["9.6"] || {}).applications = [
  { title: "Sparse LLM serving", background: "<p>Mixture-of-Experts serving increases total parameters while activating only a small subset per token.</p>", numbers: "<p>Top-2 routing in a 16-expert layer activates $2/16=12.5\\%$ of experts for a token.</p>" },
  { title: "Domain routing", background: "<p>A router can send legal, creative, support, or math tokens to different experts based on learned scores.</p>", numbers: "<p>Router logits $[2,1,0]$ softmax to $[0.665,0.245,0.090]$, making the first expert the likely route.</p>" },
  { title: "Expert blending", background: "<p>Top-k MoE layers often combine selected experts rather than picking exactly one.</p>", numbers: "<p>Keeping gates 0.665 and 0.245 then renormalizing gives $[0.665,0.245]/0.910=[0.731,0.269]$.</p>" },
  { title: "Capacity planning", background: "<p>Serving systems must reserve capacity per expert or overloaded routes will drop or delay tokens.</p>", numbers: "<p>With capacity 3 and loads $[2,5]$, the second expert overflows by $5-3=2$ tokens.</p>" },
  { title: "Multi-skill assistants", background: "<p>Different skills can be represented as experts whose outputs are mixed for a token.</p>", numbers: "<p>Expert outputs $[1,0]$ and $[0,2]$ with weights $[0.731,0.269]$ mix to $[0.731,0.538]$.</p>" }
];

(window.ALLML_CONTENT["9.7"] = window.ALLML_CONTENT["9.7"] || {}).applications = [
  { title: "Chat serving latency", background: "<p>The KV cache avoids recomputing earlier token states for every generated token in a chat response.</p>", numbers: "<p>Without cache, reaching length 5 recomputes $1+2+3+4+5=15$ token states; with cache, it computes only 5 new states.</p>" },
  { title: "Memory sizing", background: "<p>KV caching trades compute for memory, so deployment needs byte estimates before choosing context length and batch size.</p>", numbers: "<p>For $L=2,H=2,T=4,d=3$ in fp16, KV memory is $2\\times2\\times2\\times4\\times3\\times2=192$ bytes.</p>" },
  { title: "Streaming generation", background: "<p>Each streamed token appends one new key row and one new value row to the cache.</p>", numbers: "<p>Adding one token grows the cached sequence length from $4\\rightarrow5$.</p>" },
  { title: "Attention reuse", background: "<p>Cached keys still participate in normal attention, so the mathematical softmax is unchanged by reuse.</p>", numbers: "<p>Scores $[2,1,0]$ over cached keys still softmax to $[0.665,0.245,0.090]$.</p>" },
  { title: "Multi-turn cache safety", background: "<p>A cache must be tied to the exact prompt prefix; using a different conversation's cache can produce plausible but wrong attention.</p>", numbers: "<p>Illustratively, two different 4-token prefixes have the same cache length 4, so shape checks pass even though the prefix identity is wrong.</p>" }
];

/* ---- _apps-part09-B.js ---- */
/* All ML — Part 9B applications (9.8-9.13). */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

window.ALLML_CONTENT["9.8"] = window.ALLML_CONTENT["9.8"] || {};
(window.ALLML_CONTENT["9.8"] = window.ALLML_CONTENT["9.8"] || {}).applications = [
  {
    title: "Edge and mobile LLMs",
    background: "<p>Low-bit inference exists because phones, browsers, and embedded devices cannot carry full fp16 model memory budgets.</p>",
    numbers: "<p>With $b=4$, the integer codebook has $2^4=16$ levels. That is the arithmetic reason a 4-bit layer can store many more weights in the same memory budget.</p>"
  },
  {
    title: "Memory reduction planning",
    background: "<p>Serving teams estimate the model-size win before they worry about kernel overheads, cache layout, or batching.</p>",
    numbers: "<p>The lesson 7B model uses about $7\cdot10^9\cdot16/8=14.0$ GB in fp16 and $7\cdot10^9\cdot4/8=3.5$ GB at 4-bit before overheads, a $4\times$ storage reduction.</p>"
  },
  {
    title: "Weight packing and dequantization",
    background: "<p>Quantized kernels store integer weights and recover approximate real values with a scale and zero point.</p>",
    numbers: "<p>For $w=0.37$, $s=0.1$, and $z=8$, $q=\mathrm{round}(0.37/0.1)+8=12$ and $\hat w=0.1(12-8)=0.4$.</p>"
  },
  {
    title: "Error auditing",
    background: "<p>A deployment check must measure the numerical error introduced by packing, not just report the number of bits.</p>",
    numbers: "<p>The same worked weight has absolute error $|0.37-0.40|=0.03$. If a group scale makes that error much larger, the task metric should be checked before rollout.</p>"
  },
  {
    title: "AWQ channel protection",
    background: "<p>Activation-aware quantization protects rare but important channels instead of treating every weight as equally disposable.</p>",
    numbers: "<p>Keeping the salient weight $2.0$ unquantized while quantizing $0.2$ preserves the large activation product; quantizing both with one bad scale can move the rare-channel logit disproportionately.</p>"
  }
];

window.ALLML_CONTENT["9.9"] = window.ALLML_CONTENT["9.9"] || {};
(window.ALLML_CONTENT["9.9"] = window.ALLML_CONTENT["9.9"] || {}).applications = [
  {
    title: "Low-latency chat",
    background: "<p>A small draft model can propose several tokens while a larger target model verifies them in one parallel pass.</p>",
    numbers: "<p>If 4 draft tokens are all accepted, one target pass replaces 4 serial target passes for those tokens, so the accepted-token count is the useful speed metric.</p>"
  },
  {
    title: "Draft acceptance audits",
    background: "<p>The acceptance ratio keeps speculative decoding faithful to the target distribution rather than merely greedy.</p>",
    numbers: "<p>With target probability $p=0.30$ and draft probability $q=0.60$, $a=\min(1,p/q)=\min(1,0.5)=0.500$.</p>"
  },
  {
    title: "Guaranteed acceptance cases",
    background: "<p>When the target assigns more probability to a draft token than the draft did, the verifier can accept it with probability one.</p>",
    numbers: "<p>For $p=0.70$ and $q=0.40$, $p/q=1.75$, so $a=\min(1,1.75)=1.000$.</p>"
  },
  {
    title: "Throughput estimation",
    background: "<p>Capacity planning sums expected accepted tokens, not simply tokens proposed by the small draft model.</p>",
    numbers: "<p>Acceptance probabilities $0.9,0.8,0.5$ give $0.9+0.8+0.5=2.2$ expected accepted tokens for that verification block.</p>"
  },
  {
    title: "Batch verification risk",
    background: "<p>Longer speculative blocks are attractive only if the probability of many acceptances stays high.</p>",
    numbers: "<p>The probability all three draft tokens are accepted is $0.9\times0.8\times0.5=0.360$, so more than half of such blocks should expect at least one rejection.</p>"
  }
];

window.ALLML_CONTENT["9.10"] = window.ALLML_CONTENT["9.10"] || {};
(window.ALLML_CONTENT["9.10"] = window.ALLML_CONTENT["9.10"] || {}).applications = [
  {
    title: "Mobile classification students",
    background: "<p>Distillation is used when a smaller model must mimic a larger teacher on device or in high-throughput services.</p>",
    numbers: "<p>A 110M-parameter student distilled from a 340M-parameter teacher keeps $110/340=0.324$, or $32.4\%$, of the teacher parameter count.</p>"
  },
  {
    title: "Soft-label transfer",
    background: "<p>The teacher's non-top probabilities carry dark knowledge about class similarity that hard labels discard.</p>",
    numbers: "<p>Teacher logits $[2,1,0]$ at $T=1$ softmax to $[0.665,0.245,0.090]$, so the second class still receives meaningful probability mass.</p>"
  },
  {
    title: "Temperature tuning",
    background: "<p>Higher temperature softens distributions and changes the scale of distillation gradients.</p>",
    numbers: "<p>At $T=2$, logits $[2,1,0]$ become $[1,0.5,0]$ and softmax to $[0.506,0.307,0.186]$, less peaked than $T=1$.</p>"
  },
  {
    title: "Student training loss",
    background: "<p>Cross-entropy on the teacher's top probability remains a quick sanity check for the student objective.</p>",
    numbers: "<p>If the student assigns probability $0.7$ to the teacher top class, the hard-label CE is $-\log(0.7)=0.357$.</p>"
  },
  {
    title: "Distribution matching",
    background: "<p>KL divergence reports whether the student matches the teacher's whole output shape rather than only top-1 accuracy.</p>",
    numbers: "<p>For teacher $[0.7,0.2,0.1]$ and student $[0.5,0.3,0.2]$, $\sum_i p_i\log(p_i/q_i)=0.085$.</p>"
  }
];

window.ALLML_CONTENT["9.11"] = window.ALLML_CONTENT["9.11"] || {};
(window.ALLML_CONTENT["9.11"] = window.ALLML_CONTENT["9.11"] || {}).applications = [
  {
    title: "Domain adaptation",
    background: "<p>Full fine-tuning is the reference point: every base weight can move to fit the new domain.</p>",
    numbers: "<p>A full $64\times64$ matrix has $64\cdot64=4096$ trainable weights, before counting any other layers.</p>"
  },
  {
    title: "LoRA fine-tuning",
    background: "<p>LoRA freezes the base matrix and learns a low-rank side update that is merged into inference weights.</p>",
    numbers: "<p>At rank $r=4$, the factors use $64\cdot4+4\cdot64=512$ weights for $\Delta W=BA$.</p>"
  },
  {
    title: "Training-cost planning",
    background: "<p>Parameter-efficient tuning is attractive because optimizer state and gradients scale with trainable parameters.</p>",
    numbers: "<p>The LoRA fraction is $512/4096=0.125$, so the rank-4 update trains $12.5\%$ as many weights as the full matrix.</p>"
  },
  {
    title: "Adapter serving",
    background: "<p>Adapters add bottleneck modules around frozen activations and can be swapped for different domains.</p>",
    numbers: "<p>An adapter bottleneck of width 8 around hidden width 64 uses $64\cdot8+8\cdot64=1024$ weights.</p>"
  },
  {
    title: "Prefix tuning",
    background: "<p>Prefix tuning stores learned virtual tokens instead of changing the model matrix directly.</p>",
    numbers: "<p>With 10 virtual tokens and width 64, each layer stores $10\cdot64=640$ prompt parameters.</p>"
  }
];

window.ALLML_CONTENT["9.12"] = window.ALLML_CONTENT["9.12"] || {};
(window.ALLML_CONTENT["9.12"] = window.ALLML_CONTENT["9.12"] || {}).applications = [
  {
    title: "Assistant response training",
    background: "<p>Instruction tuning trains on prompt-response pairs so a pretrained model learns how to answer user requests.</p>",
    numbers: "<p>Response probabilities $0.8,0.5,0.25$ give SFT loss $-\log0.8-\log0.5-\log0.25=0.223+0.693+1.386=2.303$.</p>"
  },
  {
    title: "Prompt masking",
    background: "<p>Only response tokens should receive loss when the goal is answering rather than copying the prompt.</p>",
    numbers: "<p>A 5-token prompt and 3-token response supervise $3/(5+3)=3/8=37.5\%$ of positions.</p>"
  },
  {
    title: "Skill mixing",
    background: "<p>Mixture weights balance chat, code, safety, and other instruction families in a single SFT run.</p>",
    numbers: "<p>Illustrative chat/code losses $1.0$ and $2.0$ with weights $0.7$ and $0.3$ combine to $0.7\cdot1.0+0.3\cdot2.0=1.300$.</p>"
  },
  {
    title: "Format control",
    background: "<p>Instruction formatting is part of the distribution, so learned format tokens can change output odds sharply.</p>",
    numbers: "<p>A format-token logit gain of $+1.5$ multiplies odds by $e^{1.5}=4.482$.</p>"
  },
  {
    title: "Dataset sizing",
    background: "<p>Supervised-token counts determine the rough scale of the instruction-tuning signal.</p>",
    numbers: "<p>With 10,000 examples and 200 response tokens each, the dataset has $10{,}000\cdot200=2{,}000{,}000$ supervised tokens.</p>"
  }
];

window.ALLML_CONTENT["9.13"] = window.ALLML_CONTENT["9.13"] || {};
(window.ALLML_CONTENT["9.13"] = window.ALLML_CONTENT["9.13"] || {}).applications = [
  {
    title: "Preference labeling",
    background: "<p>Reward modeling turns pairwise human preferences into a scalar score that can rank candidate answers.</p>",
    numbers: "<p>A reward gap $r^+-r^-=1.5$ gives preference probability $\sigma(1.5)=1/(1+e^{-1.5})=0.818$.</p>"
  },
  {
    title: "Pairwise loss reporting",
    background: "<p>The Bradley-Terry loss penalizes the model when the chosen answer is not sufficiently above the rejected answer.</p>",
    numbers: "<p>For probability $0.818$, the chosen-answer loss is $-\log(0.818)=0.201$.</p>"
  },
  {
    title: "Bad preference detection",
    background: "<p>Reversed reward gaps identify pairs where the reward model prefers the rejected answer.</p>",
    numbers: "<p>A reversed gap $-1.0$ gives $\sigma(-1.0)=0.269$ and loss $-\log(0.269)=1.313$.</p>"
  },
  {
    title: "Score calibration",
    background: "<p>Only reward differences matter, so absolute offsets are not meaningful in the pairwise objective.</p>",
    numbers: "<p>Adding $+5$ to both rewards keeps the gap at $1.5$, so the probability remains $0.818$.</p>"
  },
  {
    title: "Batch reporting",
    background: "<p>Evaluation dashboards summarize preference losses across many labeled pairs.</p>",
    numbers: "<p>Losses $0.201,0.693,1.313$ average to $(0.201+0.693+1.313)/3=0.736$.</p>"
  }
];

/* ---- _apps-part09-C.js ---- */
(window.ALLML_CONTENT["9.14"] = window.ALLML_CONTENT["9.14"] || {}).applications = [
  { title: "Assistant alignment", background: "<p>RLHF is used when a deployed assistant must prefer helpful answers while staying near the pretrained model that already speaks fluently.</p>", numbers: "<p>With reward 2.0, KL 3.0, and illustrative $\\beta=0.1$, the objective is $2.0-0.1\\times3.0=1.700$.</p>" },
  { title: "PPO response updates", background: "<p>Policy-gradient RLHF often uses PPO so one sampled response does not create an unbounded update.</p>", numbers: "<p>An illustrative policy ratio 1.2 and advantage 0.5 give the surrogate term $1.2\\times0.5=0.600$.</p>" },
  { title: "Clipped rollout control", background: "<p>Clipping is a guardrail for high-variance sampled language rollouts, especially when rewards are noisy.</p>", numbers: "<p>If ratio 1.4 is clipped to 1.2 with advantage 0.5, the clipped update is $1.2\\times0.5=0.600$.</p>" },
  { title: "Drift pricing", background: "<p>The KL leash prices movement away from a reference policy so reward improvements do not become style or safety drift.</p>", numbers: "<p>When KL doubles from 3 to 6 at illustrative $\\beta=0.1$, the penalty rises from $0.1\\times3=0.3$ to $0.1\\times6=0.6$.</p>" },
  { title: "Reward centering", background: "<p>Baselines reduce variance by turning raw rewards into advantages before updating the policy.</p>", numbers: "<p>With reward 2.0 and baseline 1.2, the centered advantage is $2.0-1.2=0.800$.</p>" }
];

(window.ALLML_CONTENT["9.15"] = window.ALLML_CONTENT["9.15"] || {}).applications = [
  { title: "Direct alignment from pairs", background: "<p>DPO replaces an explicit RL loop with a classification-style preference objective over chosen and rejected answers.</p>", numbers: "<p>Chosen margin $-1.0-(-1.5)=0.5$ and rejected margin $-2.0-(-2.2)=0.2$ give DPO margin $0.5-0.2=0.3$.</p>" },
  { title: "DPO loss reporting", background: "<p>Preference-tuning dashboards often track the DPO loss because it shows whether chosen answers are becoming more likely than rejected ones.</p>", numbers: "<p>With illustrative $\\beta=2$, logit $2\\times0.3=0.6$ gives loss $-\\log\\sigma(0.6)=0.437$.</p>" },
  { title: "Temperature pressure", background: "<p>The DPO temperature controls how hard each preference pair pushes the model away from the reference.</p>", numbers: "<p>For margin 0.3, changing $\\beta$ from 1 to 2 changes the probability from $\\sigma(0.3)=0.574$ to $\\sigma(0.6)=0.646$.</p>" },
  { title: "IPO target gaps", background: "<p>IPO expresses preference optimization as matching a target log-ratio gap instead of only maximizing a logistic margin.</p>", numbers: "<p>The IPO target with illustrative $\\beta=2$ is $1/(2\\beta)=1/4=0.250$.</p>" },
  { title: "IPO error checks", background: "<p>Squared-error diagnostics reveal whether the preference gap is too small or too large relative to the IPO target.</p>", numbers: "<p>If the actual gap is 0.3 and the target is 0.25, the error is $(0.3-0.25)^2=0.0025$.</p>" }
];

(window.ALLML_CONTENT["9.16"] = window.ALLML_CONTENT["9.16"] || {}).applications = [
  { title: "Policy-based critique", background: "<p>Constitutional AI turns written principles into a structured critique signal before revision.</p>", numbers: "<p>Weights $[2,1]$ and violations $[0.3,0.8]$ give weighted scores $[2\\times0.3,1\\times0.8]=[0.6,0.8]$.</p>" },
  { title: "Revision selection", background: "<p>The highest weighted violation identifies the principle that should drive the next critique.</p>", numbers: "<p>The second principle is selected because $0.8\\gt0.6$.</p>" },
  { title: "Safety rewriting", background: "<p>A revision should measurably reduce violations rather than merely rephrase the answer.</p>", numbers: "<p>Revising violations to $[0.2,0.2]$ lowers the weighted total from $2\\times0.3+1\\times0.8=1.4$ to $2\\times0.2+1\\times0.2=0.6$.</p>" },
  { title: "Preference labels from principles", background: "<p>Principle scores can be converted into preference labels for later preference optimization.</p>", numbers: "<p>A score gap of 1.0 gives preference probability $\\sigma(1.0)=0.731$.</p>" },
  { title: "Iterative critique loops", background: "<p>Multiple critique-revision rounds can produce diminishing but cumulative improvements.</p>", numbers: "<p>Illustrative round improvements 0.4, 0.2, and 0.1 reduce violation by $0.4+0.2+0.1=0.7$ total.</p>" }
];

(window.ALLML_CONTENT["9.17"] = window.ALLML_CONTENT["9.17"] || {}).applications = [
  { title: "Few-shot classification", background: "<p>In-context classifiers use demonstrations in the prompt as temporary evidence for the current query.</p>", numbers: "<p>Similarities $[2,1,0]$ yield softmax weights $[0.665,0.245,0.090]$.</p>" },
  { title: "Label inference", background: "<p>Attention-like weights can be read as a weighted vote over demonstration labels.</p>", numbers: "<p>For labels $[1,0,1]$, the weighted label average is $0.665\\times1+0.245\\times0+0.090\\times1=0.755$, so the predicted class is 1.</p>" },
  { title: "Retrieval-style demonstrations", background: "<p>Retrieving a more similar example can dominate the context and change the answer distribution.</p>", numbers: "<p>Adding a demonstration with score 3 raises that example's softmax weight to 0.644.</p>" },
  { title: "Context budgeting", background: "<p>Demonstrations consume context-window tokens that could otherwise hold the query or reasoning.</p>", numbers: "<p>An 8-token window with three 2-token examples leaves $8-3\\times2=2$ query tokens.</p>" },
  { title: "Order effects", background: "<p>Examples are token sequences, so position and recency can bias an in-context learner.</p>", numbers: "<p>An illustrative recency bonus of 0.5 changes the last example's logit from 0 to 0.5.</p>" }
];

(window.ALLML_CONTENT["9.18"] = window.ALLML_CONTENT["9.18"] || {}).applications = [
  { title: "Zero-shot routing", background: "<p>Prompt instructions can route an answer even before demonstrations are provided.</p>", numbers: "<p>Zero-shot logits $[1,0]$ give first-answer probability $\\sigma(1)=0.731$.</p>" },
  { title: "Few-shot prompting", background: "<p>A demonstration can shift logits toward the intended response format or label.</p>", numbers: "<p>Adding an illustrative logit boost $+0.8$ changes the first-answer probability to $\\sigma(1.8)=0.858$.</p>" },
  { title: "Chain-of-thought sampling", background: "<p>Sampling several reasoning traces and taking a majority can help when trace errors are partly independent.</p>", numbers: "<p>With success rate 0.6 and three samples, majority success is $3\\times0.6^2\\times0.4+0.6^3=0.648$.</p>" },
  { title: "Context-window planning", background: "<p>Prompt engineering includes budgeting room for instructions, examples, reasoning, and the final answer.</p>", numbers: "<p>A 1200-token prompt in a 2048-token window leaves $2048-1200=848$ tokens.</p>" },
  { title: "Format-sensitive APIs", background: "<p>Structured-output prompts fail when a model drifts into the wrong format, so format penalties matter.</p>", numbers: "<p>A bad-format penalty of -1.0 changes odds by $e^{-1}=0.368$.</p>" }
];

(window.ALLML_CONTENT["9.19"] = window.ALLML_CONTENT["9.19"] || {}).applications = [
  { title: "Math QA self-consistency", background: "<p>Self-consistency answers by aggregating multiple reasoning traces instead of trusting one chain.</p>", numbers: "<p>Votes $[A,A,B,A,B]$ give answer A a majority share $3/5=0.600$.</p>" },
  { title: "Planning search", background: "<p>Tree-of-thought methods spend tokens exploring multiple branches before selecting an answer.</p>", numbers: "<p>Branching factor 3 and depth 2 explores $1+3+9=13$ nodes.</p>" },
  { title: "Fact-check graphs", background: "<p>Graph-of-thought methods can reuse shared subclaims instead of checking the same fact twice.</p>", numbers: "<p>Two paths with one shared subclaim need $4-1=3$ unique checks.</p>" },
  { title: "ReAct tool grounding", background: "<p>ReAct interleaves reasoning with observations, updating confidence after tool feedback.</p>", numbers: "<p>Prior confidence 0.55 has odds $0.55/0.45$; multiplying by likelihood ratio 3 gives odds 3.667 and probability $3.667/(1+3.667)=0.786$.</p>" },
  { title: "Cost governance", background: "<p>Reasoning methods improve reliability by spending samples, so token cost must be tracked.</p>", numbers: "<p>Five traces at 100 tokens each cost $5\\times100=500$ generated tokens.</p>" }
];

/* ---- _apps-part09-D.js ---- */
(window.ALLML_CONTENT["9.20"] = window.ALLML_CONTENT["9.20"] || {}).applications = [
  { title: "Calculator calls", background: "<p>Function calling exists so language systems can delegate arithmetic to deterministic tools instead of sampling a fluent number.</p>", numbers: "<p>For an illustrative addition task, an invented model answer 40 against the calculator result 42 has numeric argument error $|42-40|=2$, so the tool wrapper can reject the wrong value exactly.</p>" },
  { title: "API dispatch", background: "<p>Production assistants often choose among several APIs before writing a response, so routing probabilities matter as much as the final text.</p>", numbers: "<p>With tool logits $[2,1,0]$, softmax gives $[0.665,0.245,0.090]$ after rounding, so the first API is about $0.665/0.245\approx2.71$ times as likely as the second.</p>" },
  { title: "Schema validation", background: "<p>Schemas make function arguments parseable and auditable before any external action happens.</p>", numbers: "<p>If a schema requires 3 fields and only 2 valid fields are present, completeness is $2/3=0.667$, which should block or repair the call before execution.</p>" },
  { title: "Observation integration", background: "<p>After a tool returns, the model should condition on the observation rather than hallucinating the output.</p>", numbers: "<p>An observation logit boost of $+1.2$ multiplies odds by $e^{1.2}=3.320$, making the observed answer materially more likely than unsupported text.</p>" },
  { title: "Retry monitoring", background: "<p>Retries help with transient parsing errors, but they need success-rate monitoring and stop rules.</p>", numbers: "<p>Two failed calls and one success give a tool success rate of $1/3=0.333$, a clear signal to cap retries or add validation.</p>" },
];

(window.ALLML_CONTENT["9.21"] = window.ALLML_CONTENT["9.21"] || {}).applications = [
  { title: "Workflow automation", background: "<p>Agent planners are useful when a task has dependencies rather than a single prompt-response turn.</p>", numbers: "<p>For dependencies $A\rightarrow C$, $B\rightarrow C$, and $C\rightarrow D$, steps A and B have no unmet prerequisites, so there are exactly 2 initially ready steps.</p>" },
  { title: "Controller selection", background: "<p>An orchestrator chooses the next action from scores produced by a policy, heuristic, or judge.</p>", numbers: "<p>Controller scores $[0.2,0.6,0.4]$ select the action with score $0.6$, because it is the maximum over the ready actions.</p>" },
  { title: "Memory retrieval", background: "<p>Agent memory must be retrieved selectively because every memory token competes with current task context.</p>", numbers: "<p>Retrieving 3 memories from a store of 10 uses $3/10=0.300$, or 30%, of that memory bank in the prompt loop.</p>" },
  { title: "Termination logic", background: "<p>Agents need explicit stopping rules so success does not turn into needless extra planning.</p>", numbers: "<p>If the termination probability after success is 0.8, the continuation probability is $1-0.8=0.2$.</p>" },
  { title: "Agent ensembles", background: "<p>Multiple agents or judges can reduce isolated mistakes when their failure modes are not identical.</p>", numbers: "<p>Votes $[1,1,0]$ plus a judge vote 1 produce 3 positive votes out of 4, so the majority fraction is $3/4=0.750$.</p>" },
];

(window.ALLML_CONTENT["9.22"] = window.ALLML_CONTENT["9.22"] || {}).applications = [
  { title: "Enterprise QA", background: "<p>RAG is common in enterprise QA because answers must come from a changing internal knowledge base.</p>", numbers: "<p>Query-document dot products $[0.8,0.3,0.1]$ rank the first document highest because $0.8$ is the maximum similarity.</p>" },
  { title: "Support knowledge bases", background: "<p>Support bots retrieve a few candidate articles before drafting an answer, so recall@k is a core health metric.</p>", numbers: "<p>If the one relevant document appears in the top 2 retrieved documents, top-2 recall is $1/1=1.000$.</p>" },
  { title: "Chunking pipelines", background: "<p>Long documents are chunked so retrievers can find precise evidence instead of entire manuals.</p>", numbers: "<p>Chunk size 200 with overlap 50 gives stride $200-50=150$, so consecutive chunks begin 150 tokens apart.</p>" },
  { title: "Evidence-weighted generation", background: "<p>Generation should weight answer likelihoods by retrieved evidence quality instead of relying on prior memory alone.</p>", numbers: "<p>Evidence weights $[0.7,0.3]$ and likelihoods $[0.9,0.4]$ give $0.7\times0.9+0.3\times0.4=0.75$.</p>" },
  { title: "Hallucination reduction", background: "<p>Retrieval reduces hallucination only when the answer actually uses the retrieved evidence.</p>", numbers: "<p>Raising grounded probability from 0.4 without retrieval to 0.75 with retrieval is a gain of $0.75-0.4=0.35$.</p>" },
];

(window.ALLML_CONTENT["9.23"] = window.ALLML_CONTENT["9.23"] || {}).applications = [
  { title: "Generated report QA", background: "<p>Fact-checking generated reports starts by extracting claims and checking each one against evidence.</p>", numbers: "<p>Three unsupported claims among 10 total claims give unsupported rate $3/10=0.300$.</p>" },
  { title: "Calibration dashboards", background: "<p>Confidence only helps operations teams when it matches empirical correctness.</p>", numbers: "<p>A confidence bin at 0.8 with measured accuracy 0.6 has calibration error $|0.8-0.6|=0.200$.</p>" },
  { title: "Retrieval grounding", background: "<p>Adding evidence can reduce hallucination when the generation is constrained to cite or use that evidence.</p>", numbers: "<p>Reducing unsupported claims from 3 to 1 out of 10 cuts the unsupported rate from $0.300$ to $1/10=0.100$.</p>" },
  { title: "Abstention policies", background: "<p>Systems can refuse low-evidence claims instead of forcing an answer to every prompt.</p>", numbers: "<p>With threshold 0.7, confidence scores 0.4 and 0.6 are blocked because both are $\lt0.7$.</p>" },
  { title: "Factuality scorecards", background: "<p>Dashboards often invert unsupported rate so higher numbers are better for stakeholders.</p>", numbers: "<p>If unsupported rate is 0.300, factuality score is $1-0.300=0.700$.</p>" },
];

(window.ALLML_CONTENT["9.24"] = window.ALLML_CONTENT["9.24"] || {}).applications = [
  { title: "Leaderboard confidence", background: "<p>Leaderboard differences are meaningful only when uncertainty is reported with the point estimate.</p>", numbers: "<p>Accuracy $72/100=0.720$ has 95% half-width $1.96\sqrt{0.72\times0.28/100}=0.088$ after rounding.</p>" },
  { title: "Code-generation evals", background: "<p>Code benchmarks often allow several sampled attempts, so pass@k differs from single-sample accuracy.</p>", numbers: "<p>With $n=10$, $c=3$, and $k=3$, pass@3 is $1-\frac{\binom{7}{3}}{\binom{10}{3}}=0.708$.</p>" },
  { title: "Pairwise model comparisons", background: "<p>Human or judge preferences are often summarized as pairwise win rates.</p>", numbers: "<p>Thirty wins and 20 losses give win rate $30/(30+20)=30/50=0.600$.</p>" },
  { title: "Contamination audits", background: "<p>Benchmarks overstate generalization when test items leaked into training or prompt examples.</p>", numbers: "<p>Five contaminated tasks in a 100-task benchmark produce contamination rate $5/100=0.05$, or 5%.</p>" },
  { title: "Cost-aware releases", background: "<p>A release decision may trade accuracy against latency or dollar cost.</p>", numbers: "<p>An illustrative cost-weighted score $0.8-0.01\times20=0.600$ makes the cost penalty explicit.</p>" },
];

(window.ALLML_CONTENT["9.25"] = window.ALLML_CONTENT["9.25"] || {}).applications = [
  { title: "Safety classifiers", background: "<p>Guardrails usually turn a safety score into a block or pass decision with a threshold.</p>", numbers: "<p>A score of 0.82 with threshold 0.70 blocks because $0.82\ge0.70$.</p>" },
  { title: "Policy tuning", background: "<p>Thresholds should be tuned with both caught harms and overblocked safe requests in view.</p>", numbers: "<p>True positive rate $90/100=0.900$ and false positive rate $5/100=0.050$ summarize the threshold behavior.</p>" },
  { title: "Threshold tradeoffs", background: "<p>Raising thresholds can reduce false positives while increasing missed harmful cases.</p>", numbers: "<p>Moving a threshold from 0.7 to 0.9 stops blocking scores in $[0.7,0.9)$, so any harmful item there becomes a miss.</p>" },
  { title: "Cascaded filters", background: "<p>Multiple guardrails compound, so pass rates multiply when the filters are independent.</p>", numbers: "<p>Two filters with pass probabilities 0.9 and 0.8 pass together with $0.9\times0.8=0.72$.</p>" },
  { title: "Utility modeling", background: "<p>Safety tradeoffs need a utility model because false positives and missed harms have different costs.</p>", numbers: "<p>The illustrative utility $10\times90-2\times5-50\times10=390$ prices true positives, false positives, and misses.</p>" },
];

