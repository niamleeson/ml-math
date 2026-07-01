/* All ML — authored content for Part 9: Large Language Models (9.1–9.25).
   Appends to window.ALLML_CONTENT. Every numeric value in the worked sections was computed in the builder/notebooks. */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

/* ---------------- Encoder-only models (BERT & variants) ---------------- */
window.ALLML_CONTENT["9.1"] = {
  tagline: "An encoder-only LM reads both left and right context, then predicts or classifies from contextual states.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/9.1-encoder-only-models-bert-and-variants.ipynb",
  context: String.raw`
    <p>Encoder-only models (BERT & variants) sits on the Transformer machinery from Part 8 and asks what design pressure turns attention blocks into useful language systems.</p>
    <ul>
      <li><b>Attention (8.11)</b> supplies the query-key-value averaging mechanism; this lesson changes the masks, objectives, or control loop around that mechanism.</li>
      <li><b>Optimization and loss functions</b> supply the log-probability terms that make the model trainable instead of merely architectural.</li>
      <li><b>Generalization thinking</b> from the early curriculum keeps us honest: a lower training loss only matters when the evaluation setup measures the intended behavior.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds decoder-only LMs (9.2), instruction tuning (9.12), and factuality checks (9.23). Keep that path in mind; Part 9 is a chain of small decisions that become a deployed LLM system.</p>`,
  intuition: String.raw`
    <p>The concrete problem is bidirectional masked prediction: we want a language model behavior that is useful, controllable, and cheap enough to run, not just a stack of attention layers.</p>
    <p>The naive approach is to ask one generic model call to do everything. That hides the important decision. Each topic in this part chooses a constraint: which tokens may be seen, which tokens receive loss, which parameters may move, which evidence is supplied, or which outputs are blocked.</p>
    <p>The mental model is a workshop. The Transformer is the engine, but Encoder-only models (BERT & variants) is the jig that holds the workpiece in the right position. The design decision people gloss over is that the jig is usually more important than the engine size: it decides what signal the model receives and what mistakes are even possible.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$H=\mathrm{Encoder}(X+P+S),\; p(x_m\mid x_{\setminus m})=\mathrm{softmax}(h_m W_o)$$</div>
    <p>Here $X\in\mathbb{R}^{T	imes d}$ are token embeddings, $P$ positions, $S$ segment embeddings, $H\in\mathbb{R}^{T	imes d}$ contextual states, and $m$ is a masked position. The companion notebook computes these same toy quantities with tiny CPU-only arrays.</p>
    <p><b>Worked mechanics.</b> The point of the arithmetic is not the toy numbers themselves; it is seeing which term controls the behavior.</p>
    <ol class="work">
      <li>full attention over $T=4$ tokens has $4	imes4=16$ visible query-key pairs; a masked-token row still sees both left and right context</li>
      <li>MLM logits $[2,1,0]$: $e^2=7.389$, $e^1=2.718$, $e^0=1.000$, sum $=11.107$, probabilities $=[0.665, 0.245, 0.090]$</li>
      <li>a classifier head on $h_{\mathrm{CLS}}\in\mathbb{R}^{768}$ with $3$ labels uses $768	imes3+3=2307$ parameters</li>
      <li>two segment embeddings added to token embeddings keep the same shape: $4	imes768+4	imes768+4	imes768
ightarrow4	imes768$</li>
      <li>masking 15% of 20 tokens gives $0.15	imes20=3$ supervised positions, so most tokens serve as context rather than targets</li>
    </ol>
    <p>Read these five lines as a diagnostic checklist. If the computed term changes, the behavior changes; if the term is absent from the formula, the system cannot reliably get that behavior by wishing for it.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Using an encoder-only model for free-form generation fails because the Mathematics section has no left-to-right product; it predicts masked positions or labels, not an open-ended continuation.</b></li>
      <li><b>Forgetting segment or position embeddings makes $H$ unable to distinguish identical tokens in different places; the shape remains valid while the mechanism is wrong.</b></li>
      <li><b>Masking too many tokens removes the context that $p(x_m\mid x_{\setminus m})$ depends on.</b></li>
    </ul>`
};

/* ---------------- Decoder-only models (GPT family) ---------------- */
window.ALLML_CONTENT["9.2"] = {
  tagline: "A decoder-only LM learns one repeated skill: predict the next token using only the prefix.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/9.2-decoder-only-models-gpt-family.ipynb",
  context: String.raw`
    <p>Decoder-only models (GPT family) sits on the Transformer machinery from Part 8 and asks what design pressure turns attention blocks into useful language systems.</p>
    <ul>
      <li><b>Attention (8.11)</b> supplies the query-key-value averaging mechanism; this lesson changes the masks, objectives, or control loop around that mechanism.</li>
      <li><b>Optimization and loss functions</b> supply the log-probability terms that make the model trainable instead of merely architectural.</li>
      <li><b>Generalization thinking</b> from the early curriculum keeps us honest: a lower training loss only matters when the evaluation setup measures the intended behavior.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds KV caching (9.7), sampling and prompting (9.18), and agents (9.21). Keep that path in mind; Part 9 is a chain of small decisions that become a deployed LLM system.</p>`,
  intuition: String.raw`
    <p>The concrete problem is causal next-token prediction: we want a language model behavior that is useful, controllable, and cheap enough to run, not just a stack of attention layers.</p>
    <p>The naive approach is to ask one generic model call to do everything. That hides the important decision. Each topic in this part chooses a constraint: which tokens may be seen, which tokens receive loss, which parameters may move, which evidence is supplied, or which outputs are blocked.</p>
    <p>The mental model is a workshop. The Transformer is the engine, but Decoder-only models (GPT family) is the jig that holds the workpiece in the right position. The design decision people gloss over is that the jig is usually more important than the engine size: it decides what signal the model receives and what mistakes are even possible.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$p(x_{1:T})=\prod_{t=1}^{T}p(x_t\mid x_{\lt t})$$</div>
    <p>The sequence has length $T$; a causal mask forces each position $t$ to attend only to earlier positions, so generation is a left-to-right product. The companion notebook computes these same toy quantities with tiny CPU-only arrays.</p>
    <p><b>Worked mechanics.</b> The point of the arithmetic is not the toy numbers themselves; it is seeing which term controls the behavior.</p>
    <ol class="work">
      <li>a causal mask at $T=4$ permits $1+2+3+4=10$ pairs instead of all $16$</li>
      <li>next-token logits $[2,1,0]$ produce probabilities $=[0.665, 0.245, 0.090]$, so the top token receives $0.665$ mass</li>
      <li>sequence probability with token probabilities $0.8,0.5,0.25$ is $0.8	imes0.5	imes0.25=0.100$</li>
      <li>temperature $0.5$ doubles logits $[2,1,0]
ightarrow[4,2,0]$, sharpening the top probability to $0.867$</li>
      <li>generation of 6 new tokens calls the model 6 times, one prefix extension at a time</li>
    </ol>
    <p>Read these five lines as a diagnostic checklist. If the computed term changes, the behavior changes; if the term is absent from the formula, the system cannot reliably get that behavior by wishing for it.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>A missing causal mask leaks future tokens, turning the product $p(x_t\mid x_{\lt t})$ into an easier but invalid objective.</b></li>
      <li><b>Sampling with a temperature that is too low collapses the softmax and hides uncertainty.</b></li>
      <li><b>Evaluating by full-sentence probability without length normalization unfairly punishes longer outputs.</b></li>
    </ul>`
};

/* ---------------- Encoder–decoder models (T5, BART) ---------------- */
window.ALLML_CONTENT["9.3"] = {
  tagline: "Encoder–decoder models separate understanding the input from writing the output.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/9.3-encoder-decoder-models-t5-bart.ipynb",
  context: String.raw`
    <p>Encoder–decoder models (T5, BART) sits on the Transformer machinery from Part 8 and asks what design pressure turns attention blocks into useful language systems.</p>
    <ul>
      <li><b>Attention (8.11)</b> supplies the query-key-value averaging mechanism; this lesson changes the masks, objectives, or control loop around that mechanism.</li>
      <li><b>Optimization and loss functions</b> supply the log-probability terms that make the model trainable instead of merely architectural.</li>
      <li><b>Generalization thinking</b> from the early curriculum keeps us honest: a lower training loss only matters when the evaluation setup measures the intended behavior.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds denoising pretraining (9.4), instruction tuning (9.12), and RAG generation (9.22). Keep that path in mind; Part 9 is a chain of small decisions that become a deployed LLM system.</p>`,
  intuition: String.raw`
    <p>The concrete problem is conditional sequence generation: we want a language model behavior that is useful, controllable, and cheap enough to run, not just a stack of attention layers.</p>
    <p>The naive approach is to ask one generic model call to do everything. That hides the important decision. Each topic in this part chooses a constraint: which tokens may be seen, which tokens receive loss, which parameters may move, which evidence is supplied, or which outputs are blocked.</p>
    <p>The mental model is a workshop. The Transformer is the engine, but Encoder–decoder models (T5, BART) is the jig that holds the workpiece in the right position. The design decision people gloss over is that the jig is usually more important than the engine size: it decides what signal the model receives and what mistakes are even possible.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$p(y_{1:U}\mid x_{1:T})=\prod_{u=1}^{U}p(y_u\mid y_{\lt u},\,\mathrm{Enc}(x_{1:T}))$$</div>
    <p>The encoder reads source length $T$ bidirectionally; the decoder emits target length $U$ causally while cross-attending to encoder states. The companion notebook computes these same toy quantities with tiny CPU-only arrays.</p>
    <p><b>Worked mechanics.</b> The point of the arithmetic is not the toy numbers themselves; it is seeing which term controls the behavior.</p>
    <ol class="work">
      <li>source length $T=3$ and target length $U=2$ give encoder self-attention $3	imes3=9$, decoder causal pairs $1+2=3$, and cross-attention $2	imes3=6$</li>
      <li>cross-attention scores $[2,1,0]$ become weights $=[0.665, 0.245, 0.090]$ over source tokens</li>
      <li>conditional probability $0.6	imes0.5	imes0.4=0.120$ multiplies target-token probabilities given the same encoded source</li>
      <li>denoising 2 corrupted spans out of 8 source tokens asks the decoder to reconstruct a short target, not copy every input token</li>
      <li>if encoder states are $3	imes4$ and decoder states are $2	imes4$, cross-attention output is $2	imes4$</li>
    </ol>
    <p>Read these five lines as a diagnostic checklist. If the computed term changes, the behavior changes; if the term is absent from the formula, the system cannot reliably get that behavior by wishing for it.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting decoder self-attention see the future breaks the conditional factorization.</b></li>
      <li><b>Ignoring cross-attention leaves the decoder behaving like an unconditional LM.</b></li>
      <li><b>Using one shared mask for encoder and decoder confuses bidirectional source reading with causal target writing.</b></li>
    </ul>`
};

/* ---------------- Pretraining objectives (MLM, next-token, denoising) ---------------- */
window.ALLML_CONTENT["9.4"] = {
  tagline: "Pretraining turns raw text into labels by hiding, shifting, or corrupting tokens.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/9.4-pretraining-objectives-mlm-next-token-denoising.ipynb",
  context: String.raw`
    <p>Pretraining objectives (MLM, next-token, denoising) sits on the Transformer machinery from Part 8 and asks what design pressure turns attention blocks into useful language systems.</p>
    <ul>
      <li><b>Attention (8.11)</b> supplies the query-key-value averaging mechanism; this lesson changes the masks, objectives, or control loop around that mechanism.</li>
      <li><b>Optimization and loss functions</b> supply the log-probability terms that make the model trainable instead of merely architectural.</li>
      <li><b>Generalization thinking</b> from the early curriculum keeps us honest: a lower training loss only matters when the evaluation setup measures the intended behavior.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds scaling laws (9.5), distillation (9.10), and every alignment method from 9.12 onward. Keep that path in mind; Part 9 is a chain of small decisions that become a deployed LLM system.</p>`,
  intuition: String.raw`
    <p>The concrete problem is self-supervised pretraining loss: we want a language model behavior that is useful, controllable, and cheap enough to run, not just a stack of attention layers.</p>
    <p>The naive approach is to ask one generic model call to do everything. That hides the important decision. Each topic in this part chooses a constraint: which tokens may be seen, which tokens receive loss, which parameters may move, which evidence is supplied, or which outputs are blocked.</p>
    <p>The mental model is a workshop. The Transformer is the engine, but Pretraining objectives (MLM, next-token, denoising) is the jig that holds the workpiece in the right position. The design decision people gloss over is that the jig is usually more important than the engine size: it decides what signal the model receives and what mistakes are even possible.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$\mathcal{L}= -\sum_{t\in M}\log p(x_t\mid x_{\setminus M})\quad\text{or}\quad -\sum_t\log p(x_t\mid x_{\lt t})$$</div>
    <p>The set $M$ holds corrupted positions for MLM or denoising; next-token training uses every position under a causal mask. The companion notebook computes these same toy quantities with tiny CPU-only arrays.</p>
    <p><b>Worked mechanics.</b> The point of the arithmetic is not the toy numbers themselves; it is seeing which term controls the behavior.</p>
    <ol class="work">
      <li>MLM with 3 masked tokens and probabilities $0.8,0.6,0.5$ has loss $-\log0.8-\log0.6-\log0.5=1.427$</li>
      <li>next-token loss over probabilities $0.7,0.5,0.2$ is $0.357+0.693+1.609=2.659$</li>
      <li>a 20-token sequence with 15% masking creates $3$ prediction labels</li>
      <li>span corruption replacing 5 tokens by one sentinel compresses the input length from $20$ to $16$</li>
      <li>mixing MLM loss $1.4$ and denoising loss $2.0$ with weights $0.75,0.25$ gives $1.55$</li>
    </ol>
    <p>Read these five lines as a diagnostic checklist. If the computed term changes, the behavior changes; if the term is absent from the formula, the system cannot reliably get that behavior by wishing for it.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Counting unmasked prompt tokens in the loss changes the objective and rewards copying.</b></li>
      <li><b>Using corruption rates that are too high removes the evidence needed for reconstruction.</b></li>
      <li><b>Comparing MLM and next-token losses directly is misleading because they supervise different token sets.</b></li>
    </ul>`
};

/* ---------------- Scaling laws & emergent abilities ---------------- */
window.ALLML_CONTENT["9.5"] = {
  tagline: "Scaling laws say loss falls smoothly with model size and data, even when abilities appear suddenly.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/9.5-scaling-laws-and-emergent-abilities.ipynb",
  context: String.raw`
    <p>Scaling laws & emergent abilities sits on the Transformer machinery from Part 8 and asks what design pressure turns attention blocks into useful language systems.</p>
    <ul>
      <li><b>Attention (8.11)</b> supplies the query-key-value averaging mechanism; this lesson changes the masks, objectives, or control loop around that mechanism.</li>
      <li><b>Optimization and loss functions</b> supply the log-probability terms that make the model trainable instead of merely architectural.</li>
      <li><b>Generalization thinking</b> from the early curriculum keeps us honest: a lower training loss only matters when the evaluation setup measures the intended behavior.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds MoE capacity (9.6), quantized inference (9.8), and benchmark design (9.24). Keep that path in mind; Part 9 is a chain of small decisions that become a deployed LLM system.</p>`,
  intuition: String.raw`
    <p>The concrete problem is predictable loss scaling: we want a language model behavior that is useful, controllable, and cheap enough to run, not just a stack of attention layers.</p>
    <p>The naive approach is to ask one generic model call to do everything. That hides the important decision. Each topic in this part chooses a constraint: which tokens may be seen, which tokens receive loss, which parameters may move, which evidence is supplied, or which outputs are blocked.</p>
    <p>The mental model is a workshop. The Transformer is the engine, but Scaling laws & emergent abilities is the jig that holds the workpiece in the right position. The design decision people gloss over is that the jig is usually more important than the engine size: it decides what signal the model receives and what mistakes are even possible.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$L(N,D)=L_\infty + aN^{-\alpha}+bD^{-\beta}$$</div>
    <p>Parameters $N$ and data tokens $D$ reduce excess loss with powers $lpha,eta\gt0$ until irreducible loss $L_\infty$ remains. The companion notebook computes these same toy quantities with tiny CPU-only arrays.</p>
    <p><b>Worked mechanics.</b> The point of the arithmetic is not the toy numbers themselves; it is seeing which term controls the behavior.</p>
    <ol class="work">
      <li>with $L_\infty=1$, $a=2$, $N=100$, $lpha=0.5$, the model-size term is $2/\sqrt{100}=0.200$</li>
      <li>raising $N$ from $100$ to $400$ halves that term: $2/20=0.100$</li>
      <li>data term $3/D^{0.5}$ at $D=900$ is $3/30=0.100$</li>
      <li>total loss at $N=400,D=900$ is $1+0.100+0.100=1.200$</li>
      <li>a sigmoid ability score at capability margin $1.5$ is $1/(1+e^{-1.5})=0.818$</li>
    </ol>
    <p>Read these five lines as a diagnostic checklist. If the computed term changes, the behavior changes; if the term is absent from the formula, the system cannot reliably get that behavior by wishing for it.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Treating a power law as destiny ignores data quality and distribution shift.</b></li>
      <li><b>Calling an ability emergent without checking the smooth loss curve confuses thresholded metrics with discontinuous learning.</b></li>
      <li><b>Scaling parameters without scaling data leaves the $bD^{-\beta}$ term as the bottleneck.</b></li>
    </ul>`
};

/* ---------------- Mixture-of-Experts language models ---------------- */
window.ALLML_CONTENT["9.6"] = {
  tagline: "Mixture-of-Experts models grow capacity while activating only a few experts per token.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/9.6-mixture-of-experts-language-models.ipynb",
  context: String.raw`
    <p>Mixture-of-Experts language models sits on the Transformer machinery from Part 8 and asks what design pressure turns attention blocks into useful language systems.</p>
    <ul>
      <li><b>Attention (8.11)</b> supplies the query-key-value averaging mechanism; this lesson changes the masks, objectives, or control loop around that mechanism.</li>
      <li><b>Optimization and loss functions</b> supply the log-probability terms that make the model trainable instead of merely architectural.</li>
      <li><b>Generalization thinking</b> from the early curriculum keeps us honest: a lower training loss only matters when the evaluation setup measures the intended behavior.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds serving optimization (9.7), distillation (9.10), and agent systems that route work (9.21). Keep that path in mind; Part 9 is a chain of small decisions that become a deployed LLM system.</p>`,
  intuition: String.raw`
    <p>The concrete problem is sparse expert routing: we want a language model behavior that is useful, controllable, and cheap enough to run, not just a stack of attention layers.</p>
    <p>The naive approach is to ask one generic model call to do everything. That hides the important decision. Each topic in this part chooses a constraint: which tokens may be seen, which tokens receive loss, which parameters may move, which evidence is supplied, or which outputs are blocked.</p>
    <p>The mental model is a workshop. The Transformer is the engine, but Mixture-of-Experts language models is the jig that holds the workpiece in the right position. The design decision people gloss over is that the jig is usually more important than the engine size: it decides what signal the model receives and what mistakes are even possible.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$y=\sum_{e\in \mathrm{TopK}(r(x))}g_e(x)E_e(x)$$</div>
    <p>Router scores $r(x)$ choose experts $E_e$; gates $g_e$ are normalized weights over the selected experts, so only a sparse subset runs. The companion notebook computes these same toy quantities with tiny CPU-only arrays.</p>
    <p><b>Worked mechanics.</b> The point of the arithmetic is not the toy numbers themselves; it is seeing which term controls the behavior.</p>
    <ol class="work">
      <li>router logits $[2,1,0]$ softmax to gates $=[0.665, 0.245, 0.090]$</li>
      <li>top-2 routing keeps gates $0.665$ and $0.245$, then renormalizes to $[0.731,0.269]$</li>
      <li>two expert outputs $[1,0]$ and $[0,2]$ mix to $0.731[1,0]+0.269[0,2]=[0.731,0.538]$</li>
      <li>a 16-expert model with top-2 activates $2/16=12.5\%$ of experts per token</li>
      <li>capacity 3 tokens per expert with loads $[2,5]$ drops $5-3=2$ overflow tokens from the second expert</li>
    </ol>
    <p>Read these five lines as a diagnostic checklist. If the computed term changes, the behavior changes; if the term is absent from the formula, the system cannot reliably get that behavior by wishing for it.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Router collapse sends most tokens to one expert, so sparse capacity becomes a queue.</b></li>
      <li><b>Top-k gates must be renormalized; otherwise the weighted expert sum shrinks activations.</b></li>
      <li><b>Capacity drops silently remove tokens unless overflow is measured.</b></li>
    </ul>`
};

/* ---------------- KV cache & inference optimization ---------------- */
window.ALLML_CONTENT["9.7"] = {
  tagline: "The KV cache makes generation fast by remembering the keys and values already computed.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/9.7-kv-cache-and-inference-optimization.ipynb",
  context: String.raw`
    <p>KV cache & inference optimization sits on the Transformer machinery from Part 8 and asks what design pressure turns attention blocks into useful language systems.</p>
    <ul>
      <li><b>Attention (8.11)</b> supplies the query-key-value averaging mechanism; this lesson changes the masks, objectives, or control loop around that mechanism.</li>
      <li><b>Optimization and loss functions</b> supply the log-probability terms that make the model trainable instead of merely architectural.</li>
      <li><b>Generalization thinking</b> from the early curriculum keeps us honest: a lower training loss only matters when the evaluation setup measures the intended behavior.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds quantization (9.8), speculative decoding (9.9), and tool-using agents (9.20). Keep that path in mind; Part 9 is a chain of small decisions that become a deployed LLM system.</p>`,
  intuition: String.raw`
    <p>The concrete problem is cached autoregressive attention: we want a language model behavior that is useful, controllable, and cheap enough to run, not just a stack of attention layers.</p>
    <p>The naive approach is to ask one generic model call to do everything. That hides the important decision. Each topic in this part chooses a constraint: which tokens may be seen, which tokens receive loss, which parameters may move, which evidence is supplied, or which outputs are blocked.</p>
    <p>The mental model is a workshop. The Transformer is the engine, but KV cache & inference optimization is the jig that holds the workpiece in the right position. The design decision people gloss over is that the jig is usually more important than the engine size: it decides what signal the model receives and what mistakes are even possible.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$\mathrm{Attn}(q_t,K_{1:t},V_{1:t})=\mathrm{softmax}(q_tK_{1:t}^\top/\sqrt{d_k})V_{1:t}$$</div>
    <p>At generation step $t$, only the new query $q_t$ is computed; earlier keys and values are reused from the KV cache. The companion notebook computes these same toy quantities with tiny CPU-only arrays.</p>
    <p><b>Worked mechanics.</b> The point of the arithmetic is not the toy numbers themselves; it is seeing which term controls the behavior.</p>
    <ol class="work">
      <li>without cache, generating through length 5 recomputes $1+2+3+4+5=15$ token states</li>
      <li>with cache, the same generation computes only $5$ new states</li>
      <li>for $L=2$, $H=2$, $T=4$, $d=3$, fp16 KV memory is $2	imes2	imes2	imes4	imes3	imes2=192$ bytes</li>
      <li>attention scores $[2,1,0]$ over cached keys still softmax to $=[0.665, 0.245, 0.090]$</li>
      <li>adding one token appends one key row and one value row, growing cache length $4
ightarrow5$</li>
    </ol>
    <p>Read these five lines as a diagnostic checklist. If the computed term changes, the behavior changes; if the term is absent from the formula, the system cannot reliably get that behavior by wishing for it.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>KV cache memory grows linearly with $T$, layers, heads, and batch; speedups can become memory failures.</b></li>
      <li><b>Caching values from a different prompt prefix gives numerically plausible but wrong attention.</b></li>
      <li><b>Changing position encoding without updating cache positions breaks the query-key geometry.</b></li>
    </ul>`
};

/* ---------------- Quantized inference (GPTQ, AWQ) ---------------- */
window.ALLML_CONTENT["9.8"] = {
  tagline: "Quantized inference trades tiny numerical error for much smaller, faster language models.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/9.8-quantized-inference-gptq-awq.ipynb",
  context: String.raw`
    <p>Quantized inference (GPTQ, AWQ) sits on the Transformer machinery from Part 8 and asks what design pressure turns attention blocks into useful language systems.</p>
    <ul>
      <li><b>Attention (8.11)</b> supplies the query-key-value averaging mechanism; this lesson changes the masks, objectives, or control loop around that mechanism.</li>
      <li><b>Optimization and loss functions</b> supply the log-probability terms that make the model trainable instead of merely architectural.</li>
      <li><b>Generalization thinking</b> from the early curriculum keeps us honest: a lower training loss only matters when the evaluation setup measures the intended behavior.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds speculative decoding (9.9), deployment tradeoffs (9.21), and evaluation (9.24). Keep that path in mind; Part 9 is a chain of small decisions that become a deployed LLM system.</p>`,
  intuition: String.raw`
    <p>The concrete problem is low-bit weight approximation: we want a language model behavior that is useful, controllable, and cheap enough to run, not just a stack of attention layers.</p>
    <p>The naive approach is to ask one generic model call to do everything. That hides the important decision. Each topic in this part chooses a constraint: which tokens may be seen, which tokens receive loss, which parameters may move, which evidence is supplied, or which outputs are blocked.</p>
    <p>The mental model is a workshop. The Transformer is the engine, but Quantized inference (GPTQ, AWQ) is the jig that holds the workpiece in the right position. The design decision people gloss over is that the jig is usually more important than the engine size: it decides what signal the model receives and what mistakes are even possible.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$\hat w=s(q-z),\quad q=\mathrm{clip}(\mathrm{round}(w/s)+z,0,2^b-1)$$</div>
    <p>A real weight $w$ is represented by integer $q$ with bit width $b$, scale $s$, and zero point $z$; $\hat w$ is the dequantized approximation. The companion notebook computes these same toy quantities with tiny CPU-only arrays.</p>
    <p><b>Worked mechanics.</b> The point of the arithmetic is not the toy numbers themselves; it is seeing which term controls the behavior.</p>
    <ol class="work">
      <li>4-bit quantization has $2^4=16$ integer levels</li>
      <li>with scale $s=0.1$ and zero point $8$, weight $0.37$ maps to $q=\mathrm{round}(0.37/0.1)+8=12$ and $\hat w=0.4$</li>
      <li>the absolute error is $|0.37-0.40|=0.03$</li>
      <li>a 7B model uses about $14.0$ GB in fp16 but $3.5$ GB at 4-bit before overheads</li>
      <li>keeping a salient weight $2.0$ unquantized while quantizing $0.2$ protects the larger activation product</li>
    </ol>
    <p>Read these five lines as a diagnostic checklist. If the computed term changes, the behavior changes; if the term is absent from the formula, the system cannot reliably get that behavior by wishing for it.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Quantizing all weights equally can damage rare large activation channels, which AWQ protects.</b></li>
      <li><b>Reporting only bit width hides scale, group size, and zero-point choices that determine error.</b></li>
      <li><b>Comparing logits before and after quantization without task checks can miss accumulated decoding errors.</b></li>
    </ul>`
};

/* ---------------- Speculative decoding ---------------- */
window.ALLML_CONTENT["9.9"] = {
  tagline: "Speculative decoding lets a small model guess several tokens, then a large model checks them in parallel.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/9.9-speculative-decoding.ipynb",
  context: String.raw`
    <p>Speculative decoding sits on the Transformer machinery from Part 8 and asks what design pressure turns attention blocks into useful language systems.</p>
    <ul>
      <li><b>Attention (8.11)</b> supplies the query-key-value averaging mechanism; this lesson changes the masks, objectives, or control loop around that mechanism.</li>
      <li><b>Optimization and loss functions</b> supply the log-probability terms that make the model trainable instead of merely architectural.</li>
      <li><b>Generalization thinking</b> from the early curriculum keeps us honest: a lower training loss only matters when the evaluation setup measures the intended behavior.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds low-latency agents (9.21) and production RAG (9.22). Keep that path in mind; Part 9 is a chain of small decisions that become a deployed LLM system.</p>`,
  intuition: String.raw`
    <p>The concrete problem is draft-and-verify generation: we want a language model behavior that is useful, controllable, and cheap enough to run, not just a stack of attention layers.</p>
    <p>The naive approach is to ask one generic model call to do everything. That hides the important decision. Each topic in this part chooses a constraint: which tokens may be seen, which tokens receive loss, which parameters may move, which evidence is supplied, or which outputs are blocked.</p>
    <p>The mental model is a workshop. The Transformer is the engine, but Speculative decoding is the jig that holds the workpiece in the right position. The design decision people gloss over is that the jig is usually more important than the engine size: it decides what signal the model receives and what mistakes are even possible.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$a_i=\min\left(1,\frac{p(x_i\mid x_{\lt i})}{q(x_i\mid x_{\lt i})}\right)$$</div>
    <p>The draft model proposes from $q$; the target model verifies against $p$ with acceptance probability $a_i$, preserving the target distribution. The companion notebook computes these same toy quantities with tiny CPU-only arrays.</p>
    <p><b>Worked mechanics.</b> The point of the arithmetic is not the toy numbers themselves; it is seeing which term controls the behavior.</p>
    <ol class="work">
      <li>draft tokens accepted independently with probabilities $0.9,0.8,0.5$ have all-accepted probability $0.9	imes0.8	imes0.5=0.360$</li>
      <li>if target probability is $0.30$ and draft probability $0.60$, accept with $\min(1,0.30/0.60)=0.500$</li>
      <li>if target probability $0.70$ exceeds draft $0.40$, accept with probability $1.000$</li>
      <li>verifying 4 draft tokens in one target pass replaces 4 large-model passes when all accept</li>
      <li>expected accepted tokens from $[0.9,0.8,0.5]$ is $0.9+0.8+0.5=2.2$</li>
    </ol>
    <p>Read these five lines as a diagnostic checklist. If the computed term changes, the behavior changes; if the term is absent from the formula, the system cannot reliably get that behavior by wishing for it.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Accepting draft tokens greedily without the ratio $p/q$ changes the target distribution.</b></li>
      <li><b>A weak draft model can slow decoding because rejection wastes verification work.</b></li>
      <li><b>Counting proposed tokens rather than accepted tokens overstates speedup.</b></li>
    </ul>`
};

/* ---------------- Knowledge distillation for LMs (DistilBERT) ---------------- */
window.ALLML_CONTENT["9.10"] = {
  tagline: "Distillation trains a smaller model to imitate the probability shape of a larger teacher.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/9.10-knowledge-distillation-for-lms-distilbert.ipynb",
  context: String.raw`
    <p>Knowledge distillation for LMs (DistilBERT) sits on the Transformer machinery from Part 8 and asks what design pressure turns attention blocks into useful language systems.</p>
    <ul>
      <li><b>Attention (8.11)</b> supplies the query-key-value averaging mechanism; this lesson changes the masks, objectives, or control loop around that mechanism.</li>
      <li><b>Optimization and loss functions</b> supply the log-probability terms that make the model trainable instead of merely architectural.</li>
      <li><b>Generalization thinking</b> from the early curriculum keeps us honest: a lower training loss only matters when the evaluation setup measures the intended behavior.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds PEFT (9.11), instruction tuning (9.12), and guardrail model compression (9.25). Keep that path in mind; Part 9 is a chain of small decisions that become a deployed LLM system.</p>`,
  intuition: String.raw`
    <p>The concrete problem is teacher-student compression: we want a language model behavior that is useful, controllable, and cheap enough to run, not just a stack of attention layers.</p>
    <p>The naive approach is to ask one generic model call to do everything. That hides the important decision. Each topic in this part chooses a constraint: which tokens may be seen, which tokens receive loss, which parameters may move, which evidence is supplied, or which outputs are blocked.</p>
    <p>The mental model is a workshop. The Transformer is the engine, but Knowledge distillation for LMs (DistilBERT) is the jig that holds the workpiece in the right position. The design decision people gloss over is that the jig is usually more important than the engine size: it decides what signal the model receives and what mistakes are even possible.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$\mathcal{L}=T^2\,\mathrm{KL}(\sigma(z_T/T)\Vert\sigma(z_S/T))$$</div>
    <p>Teacher logits $z_T$ and student logits $z_S$ are softened by temperature $T$; KL transfers the teacher's full distribution, not just the top label. The companion notebook computes these same toy quantities with tiny CPU-only arrays.</p>
    <p><b>Worked mechanics.</b> The point of the arithmetic is not the toy numbers themselves; it is seeing which term controls the behavior.</p>
    <ol class="work">
      <li>teacher logits $[2,1,0]$ at temperature $1$ give $=[0.665, 0.245, 0.090]$</li>
      <li>at temperature $2$, logits become $[1,0.5,0]$ and soften to $[0.506,0.307,0.186]$</li>
      <li>student cross-entropy on teacher top probability $0.7$ is $-\log0.7=0.357$</li>
      <li>KL from teacher $[0.7,0.2,0.1]$ to student $[0.5,0.3,0.2]$ is $0.085$</li>
      <li>a 110M student distilled from a 340M teacher keeps $110/340=32.4\%$ of the parameters</li>
    </ol>
    <p>Read these five lines as a diagnostic checklist. If the computed term changes, the behavior changes; if the term is absent from the formula, the system cannot reliably get that behavior by wishing for it.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Training only on hard teacher labels discards the dark knowledge in non-top probabilities.</b></li>
      <li><b>Forgetting the $T^2$ factor changes gradient scale across temperatures.</b></li>
      <li><b>A student can imitate teacher mistakes, so distillation is not automatic factual improvement.</b></li>
    </ul>`
};

/* ---------------- Full fine-tuning vs parameter-efficient (LoRA, adapters, prefix) ---------------- */
window.ALLML_CONTENT["9.11"] = {
  tagline: "LoRA and related methods adapt a large model by learning small side parameters instead of moving every weight.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/9.11-full-fine-tuning-vs-parameter-efficient-lora-adapters.ipynb",
  context: String.raw`
    <p>Full fine-tuning vs parameter-efficient (LoRA, adapters, prefix) sits on the Transformer machinery from Part 8 and asks what design pressure turns attention blocks into useful language systems.</p>
    <ul>
      <li><b>Attention (8.11)</b> supplies the query-key-value averaging mechanism; this lesson changes the masks, objectives, or control loop around that mechanism.</li>
      <li><b>Optimization and loss functions</b> supply the log-probability terms that make the model trainable instead of merely architectural.</li>
      <li><b>Generalization thinking</b> from the early curriculum keeps us honest: a lower training loss only matters when the evaluation setup measures the intended behavior.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds instruction tuning (9.12), reward modeling experiments (9.13), and DPO (9.15). Keep that path in mind; Part 9 is a chain of small decisions that become a deployed LLM system.</p>`,
  intuition: String.raw`
    <p>The concrete problem is parameter-efficient adaptation: we want a language model behavior that is useful, controllable, and cheap enough to run, not just a stack of attention layers.</p>
    <p>The naive approach is to ask one generic model call to do everything. That hides the important decision. Each topic in this part chooses a constraint: which tokens may be seen, which tokens receive loss, which parameters may move, which evidence is supplied, or which outputs are blocked.</p>
    <p>The mental model is a workshop. The Transformer is the engine, but Full fine-tuning vs parameter-efficient (LoRA, adapters, prefix) is the jig that holds the workpiece in the right position. The design decision people gloss over is that the jig is usually more important than the engine size: it decides what signal the model receives and what mistakes are even possible.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$W'=W+\Delta W,\quad \Delta W=BA,\; B\in\mathbb{R}^{d\times r},\; A\in\mathbb{R}^{r\times k}$$</div>
    <p>Full fine-tuning changes $W\in\mathbb{R}^{d	imes k}$; LoRA freezes $W$ and learns rank-$r$ factors $B,A$ with far fewer parameters. The companion notebook computes these same toy quantities with tiny CPU-only arrays.</p>
    <p><b>Worked mechanics.</b> The point of the arithmetic is not the toy numbers themselves; it is seeing which term controls the behavior.</p>
    <ol class="work">
      <li>a full $64	imes64$ matrix has $4096$ trainable weights</li>
      <li>LoRA rank $r=4$ learns $64	imes4+4	imes64=512$ weights</li>
      <li>the parameter fraction is $512/4096=12.5\%$</li>
      <li>an adapter with bottleneck $r=8$ around width $64$ uses $64	imes8+8	imes64=1024$ weights</li>
      <li>prefix tuning with 10 virtual tokens and width 64 stores $10	imes64=640$ prompt parameters per layer</li>
    </ol>
    <p>Read these five lines as a diagnostic checklist. If the computed term changes, the behavior changes; if the term is absent from the formula, the system cannot reliably get that behavior by wishing for it.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Choosing rank $r$ too small bottlenecks the update $BA$ even when training loss looks stable.</b></li>
      <li><b>Forgetting that inference uses $W+BA$ causes adapter weights to be ignored.</b></li>
      <li><b>Comparing trainable parameters without quality checks hides tasks that really need full fine-tuning.</b></li>
    </ul>`
};

/* ---------------- Instruction tuning ---------------- */
window.ALLML_CONTENT["9.12"] = {
  tagline: "Instruction tuning turns a pretrained LM into a helpful interface by training on prompt-response pairs.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/9.12-instruction-tuning.ipynb",
  context: String.raw`
    <p>Instruction tuning sits on the Transformer machinery from Part 8 and asks what design pressure turns attention blocks into useful language systems.</p>
    <ul>
      <li><b>Attention (8.11)</b> supplies the query-key-value averaging mechanism; this lesson changes the masks, objectives, or control loop around that mechanism.</li>
      <li><b>Optimization and loss functions</b> supply the log-probability terms that make the model trainable instead of merely architectural.</li>
      <li><b>Generalization thinking</b> from the early curriculum keeps us honest: a lower training loss only matters when the evaluation setup measures the intended behavior.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds reward modeling (9.13), RLHF (9.14), and prompting (9.18). Keep that path in mind; Part 9 is a chain of small decisions that become a deployed LLM system.</p>`,
  intuition: String.raw`
    <p>The concrete problem is supervised instruction following: we want a language model behavior that is useful, controllable, and cheap enough to run, not just a stack of attention layers.</p>
    <p>The naive approach is to ask one generic model call to do everything. That hides the important decision. Each topic in this part chooses a constraint: which tokens may be seen, which tokens receive loss, which parameters may move, which evidence is supplied, or which outputs are blocked.</p>
    <p>The mental model is a workshop. The Transformer is the engine, but Instruction tuning is the jig that holds the workpiece in the right position. The design decision people gloss over is that the jig is usually more important than the engine size: it decides what signal the model receives and what mistakes are even possible.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$\mathcal{L}_{\mathrm{SFT}}=-\sum_{t\in R}\log p_\theta(y_t\mid x,y_{\lt t})$$</div>
    <p>Prompt tokens $x$ condition the model; response positions $R$ receive loss, so the model learns how to answer rather than how to copy prompts. The companion notebook computes these same toy quantities with tiny CPU-only arrays.</p>
    <p><b>Worked mechanics.</b> The point of the arithmetic is not the toy numbers themselves; it is seeing which term controls the behavior.</p>
    <ol class="work">
      <li>response probabilities $0.8,0.5,0.25$ give SFT loss $0.223+0.693+1.386=2.303$</li>
      <li>masking a 5-token prompt and training on 3 response tokens means only $3/8=37.5\%$ of positions receive loss</li>
      <li>mix weights $0.7$ chat and $0.3$ code give combined loss $0.7	imes1.0+0.3	imes2.0=1.300$</li>
      <li>format token logit gain $+1.5$ changes odds by $e^{1.5}=4.482$</li>
      <li>ten thousand examples at 200 response tokens each create $2{,}000{,}000$ supervised tokens</li>
    </ol>
    <p>Read these five lines as a diagnostic checklist. If the computed term changes, the behavior changes; if the term is absent from the formula, the system cannot reliably get that behavior by wishing for it.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Putting loss on prompt tokens trains the model to echo instructions instead of answer them.</b></li>
      <li><b>Mixture weights can drown a rare but important behavior.</b></li>
      <li><b>Instruction formatting is part of the distribution; changing it at inference can erase gains.</b></li>
    </ul>`
};

/* ---------------- Reward modeling ---------------- */
window.ALLML_CONTENT["9.13"] = {
  tagline: "Reward modeling converts human preferences into a scalar training signal.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/9.13-reward-modeling.ipynb",
  context: String.raw`
    <p>Reward modeling sits on the Transformer machinery from Part 8 and asks what design pressure turns attention blocks into useful language systems.</p>
    <ul>
      <li><b>Attention (8.11)</b> supplies the query-key-value averaging mechanism; this lesson changes the masks, objectives, or control loop around that mechanism.</li>
      <li><b>Optimization and loss functions</b> supply the log-probability terms that make the model trainable instead of merely architectural.</li>
      <li><b>Generalization thinking</b> from the early curriculum keeps us honest: a lower training loss only matters when the evaluation setup measures the intended behavior.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds RLHF (9.14), DPO comparisons (9.15), and safety filtering (9.25). Keep that path in mind; Part 9 is a chain of small decisions that become a deployed LLM system.</p>`,
  intuition: String.raw`
    <p>The concrete problem is pairwise reward learning: we want a language model behavior that is useful, controllable, and cheap enough to run, not just a stack of attention layers.</p>
    <p>The naive approach is to ask one generic model call to do everything. That hides the important decision. Each topic in this part chooses a constraint: which tokens may be seen, which tokens receive loss, which parameters may move, which evidence is supplied, or which outputs are blocked.</p>
    <p>The mental model is a workshop. The Transformer is the engine, but Reward modeling is the jig that holds the workpiece in the right position. The design decision people gloss over is that the jig is usually more important than the engine size: it decides what signal the model receives and what mistakes are even possible.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$\mathcal{L}_{\mathrm{RM}}=-\log \sigma(r_\theta(x,y^+)-r_\theta(x,y^-))$$</div>
    <p>The reward model assigns scalar scores to a chosen answer $y^+$ and rejected answer $y^-$; only their difference matters. The companion notebook computes these same toy quantities with tiny CPU-only arrays.</p>
    <p><b>Worked mechanics.</b> The point of the arithmetic is not the toy numbers themselves; it is seeing which term controls the behavior.</p>
    <ol class="work">
      <li>reward gap $r^+-r^-=1.5$ gives preference probability $\sigma(1.5)=0.818$</li>
      <li>the pairwise loss is $-\log0.818=0.201$</li>
      <li>a reversed gap $-1.0$ gives probability $0.269$ and loss $1.313$</li>
      <li>adding a constant $+5$ to both rewards leaves the gap unchanged, so the probability is unchanged</li>
      <li>averaging losses $0.201,0.693,1.313$ gives $0.736$</li>
    </ol>
    <p>Read these five lines as a diagnostic checklist. If the computed term changes, the behavior changes; if the term is absent from the formula, the system cannot reliably get that behavior by wishing for it.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Reward offsets are meaningless because the Bradley-Terry loss uses reward differences.</b></li>
      <li><b>Unbalanced pairs teach annotator artifacts instead of preference.</b></li>
      <li><b>High reward can be gamed unless later policies are checked against human outcomes.</b></li>
    </ul>`
};

/* ---------------- RLHF ---------------- */
window.ALLML_CONTENT["9.14"] = {
  tagline: "RLHF improves a model with rewards while a KL leash keeps it near the pretrained behavior.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/9.14-rlhf.ipynb",
  context: String.raw`
    <p>RLHF sits on the Transformer machinery from Part 8 and asks what design pressure turns attention blocks into useful language systems.</p>
    <ul>
      <li><b>Attention (8.11)</b> supplies the query-key-value averaging mechanism; this lesson changes the masks, objectives, or control loop around that mechanism.</li>
      <li><b>Optimization and loss functions</b> supply the log-probability terms that make the model trainable instead of merely architectural.</li>
      <li><b>Generalization thinking</b> from the early curriculum keeps us honest: a lower training loss only matters when the evaluation setup measures the intended behavior.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds DPO (9.15), Constitutional AI (9.16), and guardrails (9.25). Keep that path in mind; Part 9 is a chain of small decisions that become a deployed LLM system.</p>`,
  intuition: String.raw`
    <p>The concrete problem is KL-regularized policy improvement: we want a language model behavior that is useful, controllable, and cheap enough to run, not just a stack of attention layers.</p>
    <p>The naive approach is to ask one generic model call to do everything. That hides the important decision. Each topic in this part chooses a constraint: which tokens may be seen, which tokens receive loss, which parameters may move, which evidence is supplied, or which outputs are blocked.</p>
    <p>The mental model is a workshop. The Transformer is the engine, but RLHF is the jig that holds the workpiece in the right position. The design decision people gloss over is that the jig is usually more important than the engine size: it decides what signal the model receives and what mistakes are even possible.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$J(\theta)=\mathbb{E}[r(x,y)]-\beta\,\mathrm{KL}(\pi_\theta(\cdot\mid x)\Vert\pi_0(\cdot\mid x))$$</div>
    <p>The policy $\pi_	heta$ seeks reward while staying close to the reference policy $\pi_0$; $eta$ prices drift. The companion notebook computes these same toy quantities with tiny CPU-only arrays.</p>
    <p><b>Worked mechanics.</b> The point of the arithmetic is not the toy numbers themselves; it is seeing which term controls the behavior.</p>
    <ol class="work">
      <li>reward $2.0$ minus KL price $0.1	imes3.0$ gives objective $1.700$</li>
      <li>policy ratio $1.2$ with advantage $0.5$ gives PPO term $0.600$</li>
      <li>clip range $0.2$ clips ratio $1.4$ down to $1.2$, giving $1.2	imes0.5=0.600$</li>
      <li>if KL doubles from $3$ to $6$, penalty rises from $0.3$ to $0.6$</li>
      <li>advantage $r-b=2.0-1.2=0.800$ centers the reward before policy update</li>
    </ol>
    <p>Read these five lines as a diagnostic checklist. If the computed term changes, the behavior changes; if the term is absent from the formula, the system cannot reliably get that behavior by wishing for it.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Setting $eta$ too low lets the policy chase reward-model loopholes.</b></li>
      <li><b>Setting $eta$ too high freezes the policy near $\pi_0$.</b></li>
      <li><b>Ignoring clipped ratios permits a few sampled responses to dominate the PPO update.</b></li>
    </ul>`
};

/* ---------------- Preference optimization (DPO, IPO) ---------------- */
window.ALLML_CONTENT["9.15"] = {
  tagline: "DPO turns preference pairs directly into a classification loss, avoiding an explicit RL loop.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/9.15-preference-optimization-dpo-ipo.ipynb",
  context: String.raw`
    <p>Preference optimization (DPO, IPO) sits on the Transformer machinery from Part 8 and asks what design pressure turns attention blocks into useful language systems.</p>
    <ul>
      <li><b>Attention (8.11)</b> supplies the query-key-value averaging mechanism; this lesson changes the masks, objectives, or control loop around that mechanism.</li>
      <li><b>Optimization and loss functions</b> supply the log-probability terms that make the model trainable instead of merely architectural.</li>
      <li><b>Generalization thinking</b> from the early curriculum keeps us honest: a lower training loss only matters when the evaluation setup measures the intended behavior.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds Constitutional AI (9.16) and evaluation of preference-tuned models (9.24). Keep that path in mind; Part 9 is a chain of small decisions that become a deployed LLM system.</p>`,
  intuition: String.raw`
    <p>The concrete problem is direct preference optimization: we want a language model behavior that is useful, controllable, and cheap enough to run, not just a stack of attention layers.</p>
    <p>The naive approach is to ask one generic model call to do everything. That hides the important decision. Each topic in this part chooses a constraint: which tokens may be seen, which tokens receive loss, which parameters may move, which evidence is supplied, or which outputs are blocked.</p>
    <p>The mental model is a workshop. The Transformer is the engine, but Preference optimization (DPO, IPO) is the jig that holds the workpiece in the right position. The design decision people gloss over is that the jig is usually more important than the engine size: it decides what signal the model receives and what mistakes are even possible.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$\mathcal{L}_{\mathrm{DPO}}=-\log\sigma\!\left(\beta[(\log\pi_\theta^+-\log\pi_0^+)-(\log\pi_\theta^- -\log\pi_0^-)]\right)$$</div>
    <p>DPO compares chosen and rejected log-probability margins against a frozen reference; $eta$ controls how hard preferences push. The companion notebook computes these same toy quantities with tiny CPU-only arrays.</p>
    <p><b>Worked mechanics.</b> The point of the arithmetic is not the toy numbers themselves; it is seeing which term controls the behavior.</p>
    <ol class="work">
      <li>chosen margin $-1.0-(-1.5)=0.5$ and rejected margin $-2.0-(-2.2)=0.2$ give DPO margin $0.3$</li>
      <li>with $eta=2$, logit is $0.6$ and loss $-\log\sigma(0.6)=0.437$</li>
      <li>doubling $eta$ from $1$ to $2$ changes $\sigma(0.3)=0.574$ to $\sigma(0.6)=0.646$</li>
      <li>IPO target gap $1/(2eta)$ with $eta=2$ is $0.250$</li>
      <li>if the actual gap is $0.3$, IPO squared error is $(0.3-0.25)^2=0.0025$</li>
    </ol>
    <p>Read these five lines as a diagnostic checklist. If the computed term changes, the behavior changes; if the term is absent from the formula, the system cannot reliably get that behavior by wishing for it.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Dropping the reference terms turns DPO into plain likelihood preference and loses the KL anchor.</b></li>
      <li><b>A very large $eta$ saturates the sigmoid, weakening useful gradients.</b></li>
      <li><b>Preference data quality matters exactly as much as in reward modeling; DPO does not remove label noise.</b></li>
    </ul>`
};

/* ---------------- Constitutional AI ---------------- */
window.ALLML_CONTENT["9.16"] = {
  tagline: "Constitutional AI uses written principles to generate critiques, revisions, and preference labels.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/9.16-constitutional-ai.ipynb",
  context: String.raw`
    <p>Constitutional AI sits on the Transformer machinery from Part 8 and asks what design pressure turns attention blocks into useful language systems.</p>
    <ul>
      <li><b>Attention (8.11)</b> supplies the query-key-value averaging mechanism; this lesson changes the masks, objectives, or control loop around that mechanism.</li>
      <li><b>Optimization and loss functions</b> supply the log-probability terms that make the model trainable instead of merely architectural.</li>
      <li><b>Generalization thinking</b> from the early curriculum keeps us honest: a lower training loss only matters when the evaluation setup measures the intended behavior.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds guardrails (9.25), evaluation (9.24), and safer agents (9.21). Keep that path in mind; Part 9 is a chain of small decisions that become a deployed LLM system.</p>`,
  intuition: String.raw`
    <p>The concrete problem is principle-guided self-critique: we want a language model behavior that is useful, controllable, and cheap enough to run, not just a stack of attention layers.</p>
    <p>The naive approach is to ask one generic model call to do everything. That hides the important decision. Each topic in this part chooses a constraint: which tokens may be seen, which tokens receive loss, which parameters may move, which evidence is supplied, or which outputs are blocked.</p>
    <p>The mental model is a workshop. The Transformer is the engine, but Constitutional AI is the jig that holds the workpiece in the right position. The design decision people gloss over is that the jig is usually more important than the engine size: it decides what signal the model receives and what mistakes are even possible.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$s(y)=\sum_j c_j\,v_j(y),\quad y' = \mathrm{revise}(y,\arg\max_j c_jv_j(y))$$</div>
    <p>Principles $j$ have weights $c_j$ and violation scores $v_j$; the highest weighted violation drives critique and revision. The companion notebook computes these same toy quantities with tiny CPU-only arrays.</p>
    <p><b>Worked mechanics.</b> The point of the arithmetic is not the toy numbers themselves; it is seeing which term controls the behavior.</p>
    <ol class="work">
      <li>principle weights $[2,1]$ and violations $[0.3,0.8]$ give scores $[0.6,0.8]$</li>
      <li>the second principle is selected because $0.8\gt0.6$</li>
      <li>revision reducing violations to $[0.2,0.2]$ lowers weighted total from $1.4$ to $0.6$</li>
      <li>a preference probability from score gap $1.0$ is $\sigma(1.0)=0.731$</li>
      <li>three critique-revision rounds with improvements $0.4,0.2,0.1$ reduce violation by $0.7$ total</li>
    </ol>
    <p>Read these five lines as a diagnostic checklist. If the computed term changes, the behavior changes; if the term is absent from the formula, the system cannot reliably get that behavior by wishing for it.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Principles with vague violation scores create confident but arbitrary revisions.</b></li>
      <li><b>Optimizing only harmlessness can erase helpfulness if the weighted total ignores task success.</b></li>
      <li><b>Self-generated critiques need evaluation because the same model family can share blind spots.</b></li>
    </ul>`
};

/* ---------------- In-context learning ---------------- */
window.ALLML_CONTENT["9.17"] = {
  tagline: "In-context learning lets the forward pass infer a task from examples placed in the prompt.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/9.17-in-context-learning.ipynb",
  context: String.raw`
    <p>In-context learning sits on the Transformer machinery from Part 8 and asks what design pressure turns attention blocks into useful language systems.</p>
    <ul>
      <li><b>Attention (8.11)</b> supplies the query-key-value averaging mechanism; this lesson changes the masks, objectives, or control loop around that mechanism.</li>
      <li><b>Optimization and loss functions</b> supply the log-probability terms that make the model trainable instead of merely architectural.</li>
      <li><b>Generalization thinking</b> from the early curriculum keeps us honest: a lower training loss only matters when the evaluation setup measures the intended behavior.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds prompting (9.18), advanced reasoning (9.19), and RAG (9.22). Keep that path in mind; Part 9 is a chain of small decisions that become a deployed LLM system.</p>`,
  intuition: String.raw`
    <p>The concrete problem is learning from the prompt context: we want a language model behavior that is useful, controllable, and cheap enough to run, not just a stack of attention layers.</p>
    <p>The naive approach is to ask one generic model call to do everything. That hides the important decision. Each topic in this part chooses a constraint: which tokens may be seen, which tokens receive loss, which parameters may move, which evidence is supplied, or which outputs are blocked.</p>
    <p>The mental model is a workshop. The Transformer is the engine, but In-context learning is the jig that holds the workpiece in the right position. The design decision people gloss over is that the jig is usually more important than the engine size: it decides what signal the model receives and what mistakes are even possible.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$p(y\mid x,C)=\sum_i \alpha_i(C,x)y_i,\quad \alpha=\mathrm{softmax}(s(x,x_i))$$</div>
    <p>Examples $C=\{(x_i,y_i)\}$ sit in the context window; similarity scores $s$ weight which demonstrations influence the query. The companion notebook computes these same toy quantities with tiny CPU-only arrays.</p>
    <p><b>Worked mechanics.</b> The point of the arithmetic is not the toy numbers themselves; it is seeing which term controls the behavior.</p>
    <ol class="work">
      <li>similarities $[2,1,0]$ over three demonstrations give weights $=[0.665, 0.245, 0.090]$</li>
      <li>a weighted label average $0.665	imes1+0.245	imes0+0.090	imes1=0.755$ predicts class 1</li>
      <li>adding a more similar example with score $3$ raises its softmax weight to $0.644$</li>
      <li>context of 8 tokens with 3 examples of 2 tokens each leaves $8-6=2$ query tokens</li>
      <li>a recency bias adding $0.5$ to the last example changes its logit from $0$ to $0.5$</li>
    </ol>
    <p>Read these five lines as a diagnostic checklist. If the computed term changes, the behavior changes; if the term is absent from the formula, the system cannot reliably get that behavior by wishing for it.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Order sensitivity arises because the context examples are tokens, not a set.</b></li>
      <li><b>Long contexts can dilute relevant demonstrations when attention mass spreads away from them.</b></li>
      <li><b>In-context success is not permanent learning; the behavior disappears when $C$ is removed.</b></li>
    </ul>`
};

/* ---------------- Prompting (zero/few-shot, chain-of-thought) ---------------- */
window.ALLML_CONTENT["9.18"] = {
  tagline: "Prompting is programming the conditional distribution with words and examples.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/9.18-prompting-zero-few-shot-chain-of-thought.ipynb",
  context: String.raw`
    <p>Prompting (zero/few-shot, chain-of-thought) sits on the Transformer machinery from Part 8 and asks what design pressure turns attention blocks into useful language systems.</p>
    <ul>
      <li><b>Attention (8.11)</b> supplies the query-key-value averaging mechanism; this lesson changes the masks, objectives, or control loop around that mechanism.</li>
      <li><b>Optimization and loss functions</b> supply the log-probability terms that make the model trainable instead of merely architectural.</li>
      <li><b>Generalization thinking</b> from the early curriculum keeps us honest: a lower training loss only matters when the evaluation setup measures the intended behavior.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds advanced reasoning (9.19), tool use (9.20), and agents (9.21). Keep that path in mind; Part 9 is a chain of small decisions that become a deployed LLM system.</p>`,
  intuition: String.raw`
    <p>The concrete problem is prompt-conditioned computation: we want a language model behavior that is useful, controllable, and cheap enough to run, not just a stack of attention layers.</p>
    <p>The naive approach is to ask one generic model call to do everything. That hides the important decision. Each topic in this part chooses a constraint: which tokens may be seen, which tokens receive loss, which parameters may move, which evidence is supplied, or which outputs are blocked.</p>
    <p>The mental model is a workshop. The Transformer is the engine, but Prompting (zero/few-shot, chain-of-thought) is the jig that holds the workpiece in the right position. The design decision people gloss over is that the jig is usually more important than the engine size: it decides what signal the model receives and what mistakes are even possible.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$p(y\mid \mathrm{prompt},x)=\mathrm{LM}(y;[\mathrm{instructions},\mathrm{examples},x])$$</div>
    <p>The prompt concatenates instructions, demonstrations, and the query; the same model can behave differently because the conditioning text changes. The companion notebook computes these same toy quantities with tiny CPU-only arrays.</p>
    <p><b>Worked mechanics.</b> The point of the arithmetic is not the toy numbers themselves; it is seeing which term controls the behavior.</p>
    <ol class="work">
      <li>zero-shot logits $[1,0]$ give answer probability $0.731$ for the first option</li>
      <li>one demonstration adding logit $+0.8$ changes it to $\sigma(1.8)=0.858$</li>
      <li>three independent chain samples with success rate $0.6$ have majority success probability $0.648$</li>
      <li>prompt length 1200 in a 2048 window leaves $848$ tokens for reasoning and answer</li>
      <li>a bad format penalty $-1.0$ changes odds by $e^{-1}=0.368$</li>
    </ol>
    <p>Read these five lines as a diagnostic checklist. If the computed term changes, the behavior changes; if the term is absent from the formula, the system cannot reliably get that behavior by wishing for it.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Prompt tricks are distribution shifts, not guaranteed algorithms.</b></li>
      <li><b>Chain-of-thought samples can be confidently wrong if the intermediate text is ungrounded.</b></li>
      <li><b>Few-shot examples with label imbalance bias the conditional distribution.</b></li>
    </ul>`
};

/* ---------------- Advanced reasoning (self-consistency, tree/graph of thought, ReAct) ---------------- */
window.ALLML_CONTENT["9.19"] = {
  tagline: "Advanced reasoning methods improve reliability by exploring, scoring, or grounding multiple thought paths.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/9.19-advanced-reasoning-self-consistency-tree-graph-of-thou.ipynb",
  context: String.raw`
    <p>Advanced reasoning (self-consistency, tree/graph of thought, ReAct) sits on the Transformer machinery from Part 8 and asks what design pressure turns attention blocks into useful language systems.</p>
    <ul>
      <li><b>Attention (8.11)</b> supplies the query-key-value averaging mechanism; this lesson changes the masks, objectives, or control loop around that mechanism.</li>
      <li><b>Optimization and loss functions</b> supply the log-probability terms that make the model trainable instead of merely architectural.</li>
      <li><b>Generalization thinking</b> from the early curriculum keeps us honest: a lower training loss only matters when the evaluation setup measures the intended behavior.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds tool use (9.20), agents (9.21), and evaluation (9.24). Keep that path in mind; Part 9 is a chain of small decisions that become a deployed LLM system.</p>`,
  intuition: String.raw`
    <p>The concrete problem is search over reasoning traces: we want a language model behavior that is useful, controllable, and cheap enough to run, not just a stack of attention layers.</p>
    <p>The naive approach is to ask one generic model call to do everything. That hides the important decision. Each topic in this part chooses a constraint: which tokens may be seen, which tokens receive loss, which parameters may move, which evidence is supplied, or which outputs are blocked.</p>
    <p>The mental model is a workshop. The Transformer is the engine, but Advanced reasoning (self-consistency, tree/graph of thought, ReAct) is the jig that holds the workpiece in the right position. The design decision people gloss over is that the jig is usually more important than the engine size: it decides what signal the model receives and what mistakes are even possible.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$\hat y=\arg\max_y\sum_{r\in\mathcal{R}(y)}p(r,y\mid x)$$</div>
    <p>Reasoning traces $r$ lead to answers $y$; self-consistency, tree search, and ReAct spend samples or tool calls to find better traces. The companion notebook computes these same toy quantities with tiny CPU-only arrays.</p>
    <p><b>Worked mechanics.</b> The point of the arithmetic is not the toy numbers themselves; it is seeing which term controls the behavior.</p>
    <ol class="work">
      <li>self-consistency votes $[A,A,B,A,B]$ give $A$ a $3/5=0.600$ majority</li>
      <li>tree branching factor 3 and depth 2 explores $1+3+9=13$ nodes</li>
      <li>two paths sharing one subclaim save one evaluation: $4-1=3$ unique checks</li>
      <li>ReAct prior confidence $0.55$ updated by observation likelihood ratio $3$ gives odds $0.55/0.45	imes3=3.667$ and probability $0.786$</li>
      <li>sampling 5 traces at 100 tokens each costs $500$ generated tokens</li>
    </ol>
    <p>Read these five lines as a diagnostic checklist. If the computed term changes, the behavior changes; if the term is absent from the formula, the system cannot reliably get that behavior by wishing for it.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Self-consistency helps only when errors are not perfectly correlated across traces.</b></li>
      <li><b>Tree search can spend tokens exploring bad branches if the scoring function is weak.</b></li>
      <li><b>ReAct tool observations must be parsed into state; otherwise the loop ignores reality.</b></li>
    </ul>`
};

/* ---------------- Tool use & function calling ---------------- */
window.ALLML_CONTENT["9.20"] = {
  tagline: "Tool use lets an LM delegate exact operations to external functions and fold results back into text.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/9.20-tool-use-and-function-calling.ipynb",
  context: String.raw`
    <p>Tool use & function calling sits on the Transformer machinery from Part 8 and asks what design pressure turns attention blocks into useful language systems.</p>
    <ul>
      <li><b>Attention (8.11)</b> supplies the query-key-value averaging mechanism; this lesson changes the masks, objectives, or control loop around that mechanism.</li>
      <li><b>Optimization and loss functions</b> supply the log-probability terms that make the model trainable instead of merely architectural.</li>
      <li><b>Generalization thinking</b> from the early curriculum keeps us honest: a lower training loss only matters when the evaluation setup measures the intended behavior.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds agents (9.21), RAG (9.22), and guardrails (9.25). Keep that path in mind; Part 9 is a chain of small decisions that become a deployed LLM system.</p>`,
  intuition: String.raw`
    <p>The concrete problem is structured tool invocation: we want a language model behavior that is useful, controllable, and cheap enough to run, not just a stack of attention layers.</p>
    <p>The naive approach is to ask one generic model call to do everything. That hides the important decision. Each topic in this part chooses a constraint: which tokens may be seen, which tokens receive loss, which parameters may move, which evidence is supplied, or which outputs are blocked.</p>
    <p>The mental model is a workshop. The Transformer is the engine, but Tool use & function calling is the jig that holds the workpiece in the right position. The design decision people gloss over is that the jig is usually more important than the engine size: it decides what signal the model receives and what mistakes are even possible.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$p(a\mid x)=p(\mathrm{tool}\mid x)\,p(\mathrm{args}\mid x,\mathrm{tool})$$</div>
    <p>The model first decides whether and which tool to call, then emits arguments constrained by a schema before reading the observation. The companion notebook computes these same toy quantities with tiny CPU-only arrays.</p>
    <p><b>Worked mechanics.</b> The point of the arithmetic is not the toy numbers themselves; it is seeing which term controls the behavior.</p>
    <ol class="work">
      <li>tool-call logits $[2,1,0]$ give tool probability distribution $[0.665,0.245,0.090]$</li>
      <li>schema with 3 required fields and 2 valid fields has completeness $2/3=0.667$</li>
      <li>numeric argument error $|42-40|=2$ can be checked exactly outside the model</li>
      <li>observation logit boost $+1.2$ changes odds by $e^{1.2}=3.320$</li>
      <li>fallback after 2 failed calls and 1 success has tool success rate $1/3=0.333$</li>
    </ol>
    <p>Read these five lines as a diagnostic checklist. If the computed term changes, the behavior changes; if the term is absent from the formula, the system cannot reliably get that behavior by wishing for it.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Schema-valid arguments can still be semantically wrong, so validation is necessary but insufficient.</b></li>
      <li><b>Letting the model invent tool outputs destroys the separation between computation and language.</b></li>
      <li><b>Retries without a stopping rule become agent loops.</b></li>
    </ul>`
};

/* ---------------- LLM agents & orchestration ---------------- */
window.ALLML_CONTENT["9.21"] = {
  tagline: "LLM agents wrap model calls in planning, memory, tools, and termination logic.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/9.21-llm-agents-and-orchestration.ipynb",
  context: String.raw`
    <p>LLM agents & orchestration sits on the Transformer machinery from Part 8 and asks what design pressure turns attention blocks into useful language systems.</p>
    <ul>
      <li><b>Attention (8.11)</b> supplies the query-key-value averaging mechanism; this lesson changes the masks, objectives, or control loop around that mechanism.</li>
      <li><b>Optimization and loss functions</b> supply the log-probability terms that make the model trainable instead of merely architectural.</li>
      <li><b>Generalization thinking</b> from the early curriculum keeps us honest: a lower training loss only matters when the evaluation setup measures the intended behavior.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds RAG (9.22), factuality (9.23), and guardrails (9.25). Keep that path in mind; Part 9 is a chain of small decisions that become a deployed LLM system.</p>`,
  intuition: String.raw`
    <p>The concrete problem is agentic control loop: we want a language model behavior that is useful, controllable, and cheap enough to run, not just a stack of attention layers.</p>
    <p>The naive approach is to ask one generic model call to do everything. That hides the important decision. Each topic in this part chooses a constraint: which tokens may be seen, which tokens receive loss, which parameters may move, which evidence is supplied, or which outputs are blocked.</p>
    <p>The mental model is a workshop. The Transformer is the engine, but LLM agents & orchestration is the jig that holds the workpiece in the right position. The design decision people gloss over is that the jig is usually more important than the engine size: it decides what signal the model receives and what mistakes are even possible.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$s_{t+1}=\mathrm{observe}(\mathrm{act}(\mathrm{plan}(s_t,m_t)))$$</div>
    <p>State $s_t$, memory $m_t$, plans, actions, and observations form a loop; orchestration decides when to continue, branch, or stop. The companion notebook computes these same toy quantities with tiny CPU-only arrays.</p>
    <p><b>Worked mechanics.</b> The point of the arithmetic is not the toy numbers themselves; it is seeing which term controls the behavior.</p>
    <ol class="work">
      <li>a plan with 4 steps and dependencies $A
ightarrow C$, $B
ightarrow C$, $C
ightarrow D$ has two initially ready steps</li>
      <li>controller scores $[0.2,0.6,0.4]$ choose the action with score $0.6$</li>
      <li>retrieving 3 memories from 10 stores uses only $30\%$ of memory in the prompt</li>
      <li>loop termination probability $0.8$ after success leaves continuation probability $0.2$</li>
      <li>two agents voting $[1,1,0]$ with a judge vote 1 gives majority $3/4=0.750$</li>
    </ol>
    <p>Read these five lines as a diagnostic checklist. If the computed term changes, the behavior changes; if the term is absent from the formula, the system cannot reliably get that behavior by wishing for it.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>An agent without termination criteria can keep planning after success.</b></li>
      <li><b>Memory retrieval errors compound because later actions trust the wrong state.</b></li>
      <li><b>Multi-agent voting does not help if all agents share the same prompt and failure mode.</b></li>
    </ul>`
};

/* ---------------- Retrieval-Augmented Generation ---------------- */
window.ALLML_CONTENT["9.22"] = {
  tagline: "RAG gives the model a small, relevant library before it answers.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/9.22-retrieval-augmented-generation.ipynb",
  context: String.raw`
    <p>Retrieval-Augmented Generation sits on the Transformer machinery from Part 8 and asks what design pressure turns attention blocks into useful language systems.</p>
    <ul>
      <li><b>Attention (8.11)</b> supplies the query-key-value averaging mechanism; this lesson changes the masks, objectives, or control loop around that mechanism.</li>
      <li><b>Optimization and loss functions</b> supply the log-probability terms that make the model trainable instead of merely architectural.</li>
      <li><b>Generalization thinking</b> from the early curriculum keeps us honest: a lower training loss only matters when the evaluation setup measures the intended behavior.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds hallucination control (9.23), evaluation (9.24), and safety filters (9.25). Keep that path in mind; Part 9 is a chain of small decisions that become a deployed LLM system.</p>`,
  intuition: String.raw`
    <p>The concrete problem is retrieval-grounded generation: we want a language model behavior that is useful, controllable, and cheap enough to run, not just a stack of attention layers.</p>
    <p>The naive approach is to ask one generic model call to do everything. That hides the important decision. Each topic in this part chooses a constraint: which tokens may be seen, which tokens receive loss, which parameters may move, which evidence is supplied, or which outputs are blocked.</p>
    <p>The mental model is a workshop. The Transformer is the engine, but Retrieval-Augmented Generation is the jig that holds the workpiece in the right position. The design decision people gloss over is that the jig is usually more important than the engine size: it decides what signal the model receives and what mistakes are even possible.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$p(y\mid x)=\sum_{d\in \mathrm{TopK}(x)}p(y\mid x,d)p(d\mid x)$$</div>
    <p>Documents $d$ are retrieved by similarity to query $x$; generation is conditioned on the selected evidence rather than memory alone. The companion notebook computes these same toy quantities with tiny CPU-only arrays.</p>
    <p><b>Worked mechanics.</b> The point of the arithmetic is not the toy numbers themselves; it is seeing which term controls the behavior.</p>
    <ol class="work">
      <li>query-document dot products $[0.8,0.3,0.1]$ rank the first document highest</li>
      <li>top-2 recall with one relevant document in top two is $1/1=1.000$</li>
      <li>chunk overlap 50 on chunk size 200 creates stride $150$</li>
      <li>evidence weights $[0.7,0.3]$ and answer likelihoods $[0.9,0.4]$ give grounded probability $0.75$</li>
      <li>without retrieval probability $0.4$ rising to $0.75$ is a gain of $0.35$</li>
    </ol>
    <p>Read these five lines as a diagnostic checklist. If the computed term changes, the behavior changes; if the term is absent from the formula, the system cannot reliably get that behavior by wishing for it.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Retrieving irrelevant chunks can increase hallucination by adding misleading context.</b></li>
      <li><b>Chunks that are too large lower precision; chunks that are too small lose the evidence chain.</b></li>
      <li><b>Generation must cite or use retrieved evidence, not merely retrieve it.</b></li>
    </ul>`
};

/* ---------------- Hallucination & factuality ---------------- */
window.ALLML_CONTENT["9.23"] = {
  tagline: "Hallucination is not random weirdness; it is fluent generation outrunning evidence.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/9.23-hallucination-and-factuality.ipynb",
  context: String.raw`
    <p>Hallucination & factuality sits on the Transformer machinery from Part 8 and asks what design pressure turns attention blocks into useful language systems.</p>
    <ul>
      <li><b>Attention (8.11)</b> supplies the query-key-value averaging mechanism; this lesson changes the masks, objectives, or control loop around that mechanism.</li>
      <li><b>Optimization and loss functions</b> supply the log-probability terms that make the model trainable instead of merely architectural.</li>
      <li><b>Generalization thinking</b> from the early curriculum keeps us honest: a lower training loss only matters when the evaluation setup measures the intended behavior.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds evaluation (9.24) and guardrails (9.25). Keep that path in mind; Part 9 is a chain of small decisions that become a deployed LLM system.</p>`,
  intuition: String.raw`
    <p>The concrete problem is factuality under uncertainty: we want a language model behavior that is useful, controllable, and cheap enough to run, not just a stack of attention layers.</p>
    <p>The naive approach is to ask one generic model call to do everything. That hides the important decision. Each topic in this part chooses a constraint: which tokens may be seen, which tokens receive loss, which parameters may move, which evidence is supplied, or which outputs are blocked.</p>
    <p>The mental model is a workshop. The Transformer is the engine, but Hallucination & factuality is the jig that holds the workpiece in the right position. The design decision people gloss over is that the jig is usually more important than the engine size: it decides what signal the model receives and what mistakes are even possible.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$\mathrm{unsupported\ rate}=\frac{\#\{\text{claims without evidence}\}}{\#\{\text{claims}\}}$$</div>
    <p>A claim is factual only if evidence supports it; calibration compares confidence to empirical correctness across many answers. The companion notebook computes these same toy quantities with tiny CPU-only arrays.</p>
    <p><b>Worked mechanics.</b> The point of the arithmetic is not the toy numbers themselves; it is seeing which term controls the behavior.</p>
    <ol class="work">
      <li>3 unsupported claims among 10 gives unsupported rate $3/10=0.300$</li>
      <li>confidence bin 0.8 with accuracy 0.6 has calibration error $0.200$</li>
      <li>retrieval reducing unsupported claims from 3 to 1 cuts the rate to $0.100$</li>
      <li>abstaining on scores below $0.7$ blocks claims with scores $0.4$ and $0.6$</li>
      <li>factuality score $1-0.3=0.700$ complements unsupported rate</li>
    </ol>
    <p>Read these five lines as a diagnostic checklist. If the computed term changes, the behavior changes; if the term is absent from the formula, the system cannot reliably get that behavior by wishing for it.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>High confidence is not evidence; calibration measures whether confidence matches correctness.</b></li>
      <li><b>Counting unsupported claims requires claim extraction, so vague answers can hide errors.</b></li>
      <li><b>Abstention thresholds trade coverage for factuality and must be tuned on real tasks.</b></li>
    </ul>`
};

/* ---------------- LLM evaluation & benchmarks ---------------- */
window.ALLML_CONTENT["9.24"] = {
  tagline: "Evaluation turns fuzzy model behavior into measurements with uncertainty and failure modes.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/9.24-llm-evaluation-and-benchmarks.ipynb",
  context: String.raw`
    <p>LLM evaluation & benchmarks sits on the Transformer machinery from Part 8 and asks what design pressure turns attention blocks into useful language systems.</p>
    <ul>
      <li><b>Attention (8.11)</b> supplies the query-key-value averaging mechanism; this lesson changes the masks, objectives, or control loop around that mechanism.</li>
      <li><b>Optimization and loss functions</b> supply the log-probability terms that make the model trainable instead of merely architectural.</li>
      <li><b>Generalization thinking</b> from the early curriculum keeps us honest: a lower training loss only matters when the evaluation setup measures the intended behavior.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds final safety filtering (9.25) and any real deployment decision. Keep that path in mind; Part 9 is a chain of small decisions that become a deployed LLM system.</p>`,
  intuition: String.raw`
    <p>The concrete problem is measuring LM behavior: we want a language model behavior that is useful, controllable, and cheap enough to run, not just a stack of attention layers.</p>
    <p>The naive approach is to ask one generic model call to do everything. That hides the important decision. Each topic in this part chooses a constraint: which tokens may be seen, which tokens receive loss, which parameters may move, which evidence is supplied, or which outputs are blocked.</p>
    <p>The mental model is a workshop. The Transformer is the engine, but LLM evaluation & benchmarks is the jig that holds the workpiece in the right position. The design decision people gloss over is that the jig is usually more important than the engine size: it decides what signal the model receives and what mistakes are even possible.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$\hat p\pm1.96\sqrt{\hat p(1-\hat p)/n},\quad \mathrm{pass@}k=1-\frac{\binom{n-c}{k}}{\binom{n}{k}}$$</div>
    <p>Accuracy $\hat p$ estimates success on $n$ tasks; pass@$k$ estimates success when $k$ samples are allowed and $c$ of $n$ candidates pass. The companion notebook computes these same toy quantities with tiny CPU-only arrays.</p>
    <p><b>Worked mechanics.</b> The point of the arithmetic is not the toy numbers themselves; it is seeing which term controls the behavior.</p>
    <ol class="work">
      <li>accuracy $72/100=0.720$ has 95% half-width $1.96\sqrt{0.72\cdot0.28/100}=0.088$</li>
      <li>pass@3 with $n=10,c=3$ is $1-inom{7}{3}/inom{10}{3}=0.708$</li>
      <li>pairwise wins 30 and losses 20 give win rate $30/50=0.600$</li>
      <li>contamination of 5 tasks in a 100-task benchmark is $5\%$</li>
      <li>cost-weighted score $0.8-0.01	imes20=0.600$ prices latency or dollars</li>
    </ol>
    <p>Read these five lines as a diagnostic checklist. If the computed term changes, the behavior changes; if the term is absent from the formula, the system cannot reliably get that behavior by wishing for it.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Benchmarks without confidence intervals overread noise as progress.</b></li>
      <li><b>Pass@k is not comparable to single-sample accuracy unless $k$ and sampling are reported.</b></li>
      <li><b>Contaminated test items inflate scores because they were effectively training examples.</b></li>
    </ul>`
};

/* ---------------- Guardrails & safety filtering ---------------- */
window.ALLML_CONTENT["9.25"] = {
  tagline: "Guardrails are thresholded decisions around model behavior, not magic shields.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/9.25-guardrails-and-safety-filtering.ipynb",
  context: String.raw`
    <p>Guardrails & safety filtering sits on the Transformer machinery from Part 8 and asks what design pressure turns attention blocks into useful language systems.</p>
    <ul>
      <li><b>Attention (8.11)</b> supplies the query-key-value averaging mechanism; this lesson changes the masks, objectives, or control loop around that mechanism.</li>
      <li><b>Optimization and loss functions</b> supply the log-probability terms that make the model trainable instead of merely architectural.</li>
      <li><b>Generalization thinking</b> from the early curriculum keeps us honest: a lower training loss only matters when the evaluation setup measures the intended behavior.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds the production discipline that wraps all preceding LLM lessons. Keep that path in mind; Part 9 is a chain of small decisions that become a deployed LLM system.</p>`,
  intuition: String.raw`
    <p>The concrete problem is safety filtering decision rule: we want a language model behavior that is useful, controllable, and cheap enough to run, not just a stack of attention layers.</p>
    <p>The naive approach is to ask one generic model call to do everything. That hides the important decision. Each topic in this part chooses a constraint: which tokens may be seen, which tokens receive loss, which parameters may move, which evidence is supplied, or which outputs are blocked.</p>
    <p>The mental model is a workshop. The Transformer is the engine, but Guardrails & safety filtering is the jig that holds the workpiece in the right position. The design decision people gloss over is that the jig is usually more important than the engine size: it decides what signal the model receives and what mistakes are even possible.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$\mathrm{block}(x)=\mathbf{1}[s(x)\ge \tau]$$</div>
    <p>A safety score $s(x)$ is compared with threshold $	au$; utility depends on true positives, false positives, and missed harms. The companion notebook computes these same toy quantities with tiny CPU-only arrays.</p>
    <p><b>Worked mechanics.</b> The point of the arithmetic is not the toy numbers themselves; it is seeing which term controls the behavior.</p>
    <ol class="work">
      <li>safety score $0.82$ with threshold $0.70$ blocks because $0.82\ge0.70$</li>
      <li>true positive rate $90/100=0.900$ and false positive rate $5/100=0.050$ describe the threshold</li>
      <li>raising threshold from $0.7$ to $0.9$ may lower false positives but also misses scores in $[0.7,0.9)$</li>
      <li>two filters with pass probabilities $0.9$ and $0.8$ pass together with $0.72$</li>
      <li>utility $10	imes90-2	imes5-50	imes10=390$ makes the tradeoff explicit</li>
    </ol>
    <p>Read these five lines as a diagnostic checklist. If the computed term changes, the behavior changes; if the term is absent from the formula, the system cannot reliably get that behavior by wishing for it.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>A threshold with no utility model can optimize the wrong tradeoff.</b></li>
      <li><b>Overblocking safe requests is a real failure, not merely caution.</b></li>
      <li><b>Guardrails must wrap tools and retrieval too; filtering only the final text misses harmful actions.</b></li>
    </ul>`
};
