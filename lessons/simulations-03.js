/* Mock ML-engineering "lab" scenarios. Merged into window.SIMULATIONS by application id.
   { title, icon, goal, stages:[ { phase, icon, title, narrative(HTML), concepts:[lessonIds],
     steps:[ {type:"decide", prompt, options:[{label, feedback, best?}]} | {type:"run", label, prompt?, result:{log?, metrics?:[{k,v}], note?}} ] } ] } */
window.SIMULATIONS = Object.assign(window.SIMULATIONS || {}, {
  "llm-chatbots": {
    title: "LLM Chatbot Assistant",
    icon: "💬",
    goal: "Ship a helpful, grounded support assistant — fluent, accurate, and cheap enough to serve at scale.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Frame the use-case & evals",
        narrative: `<p>You're building a customer-support assistant for a software product. Before any model work, decide what "good" means: it must answer from the docs, refuse when unsure, and stay polite. The hard part is that fluency and correctness are different things — a model can write a perfect-sounding paragraph that is completely wrong. A vague goal gives you a chatbot you can't measure, so you pin down the exact metrics you'll grade before you touch a model.</p>`,
        concepts: ["mod-llm", "ml-classification-metrics"],
        insight: `<b>Fluency is not correctness.</b> A strong base model already scores a perplexity around <b>8–12</b> on in-domain text — meaning at each word it is effectively choosing among ~8–12 plausible next words — yet that number says <b>nothing</b> about whether the answer resolves the ticket. On a 1,000-ticket eval, the gap is real: the same model can be <b>92% fluent-sounding</b> but only <b>~80% actually correct</b>, with a <b>~6%</b> hallucination rate hiding inside the fluent-looking answers.`,
        data: {
          caption: "Three evals, three different things they measure",
          columns: ["metric", "what it scores", "range", "good?", "catches hallucination?"],
          rows: [
            ["perplexity", "next-word fluency", "1 → ∞ (lower better)", "≈ 9", "no"],
            ["task success", "does it resolve the ticket", "0–100% (higher)", "≥ 80%", "indirectly"],
            ["hallucination rate", "claims not in the source", "0–100% (lower)", "≤ 2%", "directly"],
            ["helpfulness (human)", "1–5 rating by a person", "1–5 (higher)", "≥ 4.0", "partly"]
          ],
          note: `Perplexity is cheap and automatic but blind to truth. Task success and hallucination rate need a labeled held-out set; helpfulness needs people. You report all of them — no single number certifies a support bot.`
        },
        symbols: [
          { sym: "perplexity", desc: "$\\exp(\\text{average cross-entropy})$ — roughly, the effective number of equally-likely next words the model is choosing among; lower means more confident/fluent." },
          { sym: "hallucination rate", desc: "fraction of generated claims that are not supported by the retrieved source document." },
          { sym: "task success", desc: "fraction of held-out tickets where the answer actually resolves the customer's problem." }
        ],
        steps: [{
          type: "decide", prompt: "What should your primary eval be?",
          options: [
            { label: "Perplexity on a generic web corpus", feedback: "perplexity measures next-token fluency on text the model has seen the style of — not whether answers are correct or grounded in your docs. A model can hit perplexity 9 and still confidently invent a refund policy that doesn't exist. Worse, a generic web corpus isn't even your domain, so the number reflects neither fluency on support text nor correctness." },
            { label: "Task success on a held-out set of real support questions, plus a hallucination rate and a human-helpfulness score", best: true, feedback: "you ship answers, not log-likelihoods. Task success measures whether the reply resolves the ticket, the hallucination rate measures how often it invents facts the source doesn't support, and the human score catches tone/usefulness that automatic metrics miss. The held-out set is the key design choice: it must be real tickets the model never trained on, or the scores are fantasy." },
            { label: "Number of tokens generated per reply", feedback: "longer isn't better — this metric literally rewards rambling, and the easiest way to maximize it is to pad every answer with filler. Length is a cost driver (you pay per generated token), so you track it as a budget number, never as a quality target." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather instruction data",
        narrative: `<p>You need examples of good support answers. The cleanest signal is real resolved tickets where a human gave a correct, grounded reply. Each example is an <b>instruction–response pair</b>: the customer's question is the instruction, the agent's accepted answer is the target response, and ideally a link to the doc passage that backs it. That doc link is doing double duty — it teaches grounding during fine-tuning and seeds the RAG index for retrieval.</p>`,
        concepts: ["ml-supervised", "mod-llm"],
        insight: `<b>Grounding is the asset.</b> Of <b>84,210</b> resolved tickets, only <b>73%</b> (61,540) come with a linked doc passage — and that linked subset is worth far more than the rest. A grounded pair lets you <i>verify</i> the answer against a source; an ungrounded one is just a plausible-looking reply you have to trust blindly. The 27% without links aren't useless, but they can't anchor a hallucination check.`,
        data: {
          caption: "What one instruction–response training pair looks like",
          columns: ["field", "example value"],
          rows: [
            ["instruction", "\"How do I reset my API key?\""],
            ["response", "\"Go to Settings → API, click Revoke, then Generate…\""],
            ["source_doc", "docs/api/keys.md#rotating-keys"],
            ["language", "en"],
            ["resolved", "yes (customer marked solved)"]
          ],
          note: `The model learns instruction → response; the source_doc field is what lets you later ask "is every claim in the response actually in the doc?" — the basis of the hallucination metric.`
        },
        symbols: [
          { sym: "$(x, y)$", desc: "one supervised pair: $x$ is the instruction (customer question), $y$ is the target response (accepted agent reply)." },
          { sym: "source_doc", desc: "the doc passage that backs $y$; used for grounding during training and as a retrieval target in RAG." },
          { sym: "grounded %", desc: "fraction of pairs that carry a verifiable source_doc link (here 73%)." }
        ],
        steps: [
          { type: "decide", prompt: "Where do your instruction-response pairs come from?",
            options: [
              { label: "Resolved support tickets with the agent's accepted reply, linked to the doc passage that backs it", best: true, feedback: "real questions, real grounded answers, with a citation you can verify. The accepted-reply filter means a human already judged the answer correct, and the doc link gives you the source needed to check grounding later. This is gold for both fine-tuning (teaches the answer) and RAG (seeds the retrieval index) — the only option that produces verifiable data." },
              { label: "Scrape any Q&A off the open web", feedback: "noisy, off-domain, and full of wrong answers — you'd teach the model the internet's mistakes, not your product. Web Q&A is about other companies' products, uses different terminology, and has no quality gate, so a large fraction of the 'answers' are simply wrong. Volume can't fix a poisoned signal." },
              { label: "Have the base model generate its own training answers, unchecked", feedback: "self-generated answers bake in the model's own hallucinations — you'd be training it to imitate its own mistakes, which amplifies them. Distillation can work, but only from a verified teacher whose outputs are checked; unchecked self-training is a feedback loop with no ground truth." }
            ] },
          { type: "run", label: "▶ Pull resolved support tickets", prompt: "Export tickets with accepted answers and doc links.",
            result: { log: "exporting from support warehouse...\n84,210 resolved tickets\nwith linked doc passage: 61,540 (73%)\nlanguages: en 88%, de 6%, ja 4%, other 2%\nmedian question length: 34 tokens", metrics: [{ k: "pairs", v: "61.5K" }, { k: "grounded", v: "73%" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Clean & deduplicate",
        narrative: `<p>Support archives are full of near-duplicates and junk: the same FAQ answered 50 times, copied email threads, and tickets stuffed with personal data. Duplicates waste compute and — far worse — can leak your eval set into training, inflating every score you report. You detect near-duplicates with embeddings: each pair becomes a vector, and any two with cosine similarity above a threshold are treated as the same item.</p>`,
        concepts: ["dl-cosine-similarity", "mlx-error-analysis"],
        insight: `<b>Dedup removes a quarter of the data.</b> Starting from 61,540 grounded pairs, cleaning strips <b>4,102</b> exact dups, <b>9,377</b> near-dups (cosine $&gt;0.95$), <b>12,840</b> PII redactions, and <b>1,205</b> toxic/off-topic items — leaving <b>46,856</b> clean pairs, a <b>~23%</b> cut. The near-dup step is the dangerous one: those 9,377 items, if split carelessly, would put copies of the same ticket on both sides of the train/eval line.`,
        data: {
          caption: "Near-duplicate detection: cosine similarity between pair embeddings",
          columns: ["pair A", "pair B", "cosine sim", "verdict"],
          rows: [
            ["\"reset my API key\"", "\"how to reset API key\"", "0.97", "near-dup → drop B"],
            ["\"billing failed\"", "\"my payment was declined\"", "0.91", "keep both"],
            ["\"reset password\"", "\"reset API key\"", "0.62", "keep both"],
            ["exact copy", "exact copy", "1.00", "exact dup → drop"]
          ],
          note: `cosine similarity $= \\cos\\theta$ ranges from $-1$ to $1$; near $1$ means the two embeddings point almost the same way (same meaning). The threshold 0.95 is a tradeoff: too low merges distinct tickets, too high lets paraphrases slip through.`
        },
        symbols: [
          { sym: "$\\cos\\theta$", desc: "cosine similarity between two embedding vectors $\\mathbf{a},\\mathbf{b}$: $\\dfrac{\\mathbf{a}\\cdot\\mathbf{b}}{\\lVert\\mathbf{a}\\rVert\\,\\lVert\\mathbf{b}\\rVert}$; 1 = identical direction, 0 = unrelated." },
          { sym: "MinHash", desc: "a fast hashing trick to find candidate exact/near duplicates without comparing every pair against every other." },
          { sym: "threshold $\\tau$", desc: "the cutoff (here 0.95) above which two pairs are declared near-duplicates." }
        ],
        steps: [
          { type: "run", label: "▶ Dedup & filter", result: { log: "near-dup detection (MinHash + cosine on embeddings)...\nexact duplicates removed: 4,102\nnear-duplicates (cos > 0.95) removed: 9,377\nPII redaction: 12,840 emails / phone numbers masked\ntoxic / off-topic filtered: 1,205\nremaining clean pairs: 46,856", metrics: [{ k: "after dedup", v: "46.9K" }, { k: "removed", v: "23%" }] } },
          { type: "decide", prompt: "Why dedup so aggressively before splitting train/eval?",
            options: [
              { label: "To save disk space", feedback: "minor and not the point — 23% of 60K pairs is trivial storage. The real danger is leakage: if a duplicate lands in both train and eval, the model has effectively seen the answer key, and your eval score measures memorization, not generalization." },
              { label: "Near-duplicates across the train/eval boundary leak answers and inflate metrics", best: true, feedback: "exactly. The correct order is dedup first, then split — so that all copies of a ticket land on the same side of the line. If you split first, the 9,377 near-dups scatter across both sets; the model 'memorizes' eval items during training and you over-trust a number that won't hold in production. Cleaning is the cheap insurance that your eval means something." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Tokenize",
        narrative: `<p>Models read tokens, not characters. A BPE (byte-pair encoding) tokenizer splits text into subword pieces drawn from a fixed vocabulary, keeping sequences short while still representing rare words. Common words map to a single token; unusual ones break into several pieces. Token count is what you pay for and what fills the context window, so it's the unit that governs both cost and whether an input even fits.</p>`,
        concepts: ["dl-word-embeddings", "ml-softmax"],
        insight: `<b>Subwords, not words.</b> A 50,257-token BPE vocab turns the average English word into <b>~1.3 tokens</b>. Frequent words like "the" are one token; "unbelievable" becomes <b>3</b> sub-words (<i>un</i> / <i>believ</i> / <i>able</i>). Your average question is <b>41</b> tokens and answer <b>187</b>, so a full conversation runs ~228 tokens — but the 99th percentile hits <b>2,940</b>, and <b>3.1%</b> of grounded conversations blow past a 4K context window.`,
        data: {
          caption: "How BPE maps text to token IDs",
          columns: ["text", "tokens", "token IDs", "# tokens"],
          rows: [
            ["\"reset\"", "[reset]", "[12060]", "1"],
            ["\"unbelievable\"", "[un, believ, able]", "[403, 6667, 540]", "3"],
            ["\"API key\"", "[API, ' key']", "[2969, 1994]", "2"],
            ["\"#$%\"", "[#, $, %]", "[2, 3, 4]", "3"]
          ],
          note: `Each token becomes an integer ID, then an embedding row the model reads. A 30K–50K vocab is the sweet spot: small enough to learn, large enough that most words are 1–2 tokens. "…" = sequence continues.`
        },
        symbols: [
          { sym: "vocab size $V$", desc: "number of distinct tokens the tokenizer knows (here 50,257); also the width of the model's output softmax." },
          { sym: "context window", desc: "max number of tokens the model can attend to at once (here 4K); inputs longer than this must be chunked or truncated." },
          { sym: "token", desc: "a subword unit (1–4 chars typically); the atomic input the model actually consumes — you are billed per token." }
        ],
        steps: [
          { type: "run", label: "▶ Tokenize the corpus", result: { log: "applying BPE tokenizer (vocab 50,257)...\navg tokens / question: 41\navg tokens / answer: 187\n99th pct conversation length: 2,940 tokens\ndocs that exceed 4K context: 3.1%  -> will need chunking for RAG", metrics: [{ k: "vocab", v: "50,257" }, { k: "avg conv", v: "228 tok" }],
            chart: { type: "bars", title: "Token-length distribution (tokens)", labels: ["avg question", "avg answer", "avg conversation", "99th pct conversation"], values: [41, 187, 228, 2940], valueLabels: ["41", "187", "228", "2,940"], colors: ["#4ea1ff", "#4ea1ff", "#c89bff", "#ffb454"] } } },
          { type: "decide", prompt: "3.1% of doc-grounded conversations exceed the 4K context window. What do you do?",
            options: [
              { label: "Truncate the docs and hope the answer was near the top", best: true, feedback: "for RAG you don't stuff whole docs into the prompt anyway — you chunk each doc into passages and retrieve only the few that match the question, so the overflow mostly disappears. The retrieved passages are short by construction, so smart chunking/truncation keeps you under 4K while still feeding the relevant text. It beats paying for a giant context you rarely need." },
              { label: "Always use the largest context model regardless of cost", feedback: "a 128K-context model costs several times more per call, and attention compute grows roughly with sequence length, so you pay for length on every request — even the 97% that fit comfortably in 4K. You'd be solving a 3.1% problem by taxing 100% of traffic. Pay for a big context only when a task genuinely needs it." }
            ] }
        ]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick a base model",
        narrative: `<p>Training a transformer from scratch costs millions of dollars and needs trillions of tokens of text. You start from a strong pretrained base and adapt it instead. The engine inside is <b>self-attention</b>: for each token, the model computes a weighted average over every other token, where the weights come from how well a query matches each key. That is how a token "reads" the whole context at once instead of one neighbor at a time.</p>`,
        concepts: ["mod-transformer", "mod-multihead", "dl-attention"],
        insight: `<b>Adapt, don't pretrain.</b> A 7B model was pretrained on ~<b>1–2 trillion</b> tokens; your cleaned corpus is <b>46,856</b> pairs ≈ <b>~10 million</b> tokens — about <b>0.0005%</b> of pretraining scale. There is no way to learn language from that, but it is plenty to <i>specialize</i> a base that already knows language. The attention core scales as $O(L^2)$ in sequence length $L$, which is exactly why the 4K window from the last stage matters.`,
        data: {
          caption: "Three ways to get a model — scale vs. fit",
          columns: ["option", "params", "tokens it needs", "your data covers it?"],
          rows: [
            ["pretrain 7B from scratch", "7B", "~1–2 trillion", "no (10M ≪ needed)"],
            ["adapt pretrained 7–8B instruct", "7–8B", "~10M to specialize", "yes ✓"],
            ["tiny 125M model", "125M", "~10M", "fits, but too weak"]
          ],
          note: `Self-attention: $\\text{softmax}\\!\\big(QK^\\top/\\sqrt{d}\\big)V$. Each token's query $Q$ is scored against every key $K$, scaled by $\\sqrt{d}$ to keep the numbers stable, softmaxed into weights, then used to mix the values $V$.`
        },
        symbols: [
          { sym: "$Q,K,V$", desc: "query, key, value matrices — learned linear projections of the token embeddings; $Q$ asks 'what am I looking for', $K$ advertises 'what I offer', $V$ is the content mixed in." },
          { sym: "$d$", desc: "the per-head key/query dimension; the score is divided by $\\sqrt{d}$ so dot-products don't grow large and saturate the softmax." },
          { sym: "$\\text{softmax}$", desc: "turns the raw attention scores into a probability distribution (non-negative, sums to 1) used to weight the values $V$." },
          { sym: "$L$", desc: "sequence length in tokens; attention cost grows as $O(L^2)$, the reason context windows are bounded." }
        ],
        steps: [{
          type: "decide", prompt: "How do you get your base model?",
          options: [
            { label: "Pretrain a 7B transformer from scratch on your 47K pairs", feedback: "47K pairs (~10M tokens) is six orders of magnitude short of the trillions pretraining needs — the model would badly underfit, never learning even basic grammar, while you burn millions in compute. Pretraining is a foundation-lab activity; nobody does it for a single product. Always start from a pretrained base." },
            { label: "Start from an open pretrained 7B–8B instruct model and adapt it to your domain", best: true, feedback: "the base already knows language, reasoning, and instruction-following from its trillion-token pretraining; your 10M domain tokens only need to specialize its tone, format, and product knowledge. This is the standard, affordable path — and the 'instruct' variant is already tuned to follow prompts, so adaptation is light. You get a strong model for the price of fine-tuning, not pretraining." },
            { label: "Use a tiny 125M model so it's cheap", feedback: "a 125M model simply lacks the capacity to follow multi-step instructions or reason over retrieved docs reliably — quality collapses on exactly the hard tickets that need an assistant. The cost savings are illusory because a bot that gives wrong answers generates more escalations than it deflects. Capacity is the floor here, not the ceiling." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Adapt: LoRA fine-tune + RAG",
        narrative: `<p>Two cheap levers. <b>RAG</b> (retrieval-augmented generation) fetches the most relevant doc passages at query time and pastes them into the prompt, so answers stay grounded and current without retraining. <b>LoRA</b> (low-rank adaptation) freezes the billions of base weights and learns only a small pair of low-rank matrices per layer — a few million params — to nudge tone and format. You train LoRA by minimizing cross-entropy on the instruction-response pairs; RLHF/PPO can align further later.</p>`,
        concepts: ["dl-cross-entropy", "dl-optimizers", "mod-actor-critic"],
        insight: `<b>0.13% of the weights do the job.</b> LoRA trains <b>9.4M</b> of the model's <b>7.0B</b> parameters — the rest stay frozen — by inserting a rank-$r$ update $\\Delta W = BA$ where $A,B$ are skinny matrices. Validation loss falls <b>1.71 → 1.49 → 1.47</b> and then plateaus at epoch 3, so you stop: the gap between train (1.33) and val (1.47) is starting to open, the classic early-stopping signal. RAG indexes all <b>46,856</b> chunks for cosine retrieval.`,
        data: {
          caption: "LoRA training curve — watch the train/val gap",
          columns: ["epoch", "train loss", "val loss", "read"],
          rows: [
            ["1", "1.84", "1.71", "learning"],
            ["2", "1.52", "1.49", "still improving"],
            ["3", "1.33", "1.47", "val plateau → stop"],
            ["(4)", "1.18", "1.49", "would overfit"]
          ],
          note: `Loss here is cross-entropy in nats per token. The decision to stop at epoch 3 is read off the gap: train keeps dropping but val stalls, so more epochs would memorize, not generalize.`
        },
        symbols: [
          { sym: "$\\Delta W = BA$", desc: "the LoRA update added to a frozen weight $W$; $B$ is $d\\times r$ and $A$ is $r\\times d$, so the update has rank $r$ and far fewer params than $W$." },
          { sym: "$r$", desc: "the LoRA rank (here 16) — the width of the bottleneck; larger $r$ = more capacity but more params." },
          { sym: "cross-entropy $\\mathcal{L}$", desc: "$-\\sum_t \\log p_\\theta(y_t\\mid y_{&lt;t}, x)$ — the loss that rewards assigning high probability to the correct next token." },
          { sym: "$y_{&lt;t}$", desc: "all target tokens before position $t$; the model predicts $y_t$ conditioned on these and the instruction $x$." }
        ],
        steps: [{
          type: "run", label: "▶ Train LoRA adapters (rank 16)",
          result: { log: "freezing base weights, training LoRA adapters (rank 16)...\ntrainable params: 9.4M / 7.0B (0.13%)\nepoch 1  train loss 1.84  val loss 1.71\nepoch 2  train loss 1.52  val loss 1.49\nepoch 3  train loss 1.33  val loss 1.47  (val plateau, stop)\nRAG index built: 46,856 chunks, FAISS cosine retriever", metrics: [{ k: "val loss", v: "1.47" }, { k: "trainable", v: "0.13%" }],
            chart: { type: "line", title: "LoRA loss by epoch (train vs val)", xlabel: "epoch", ylabel: "cross-entropy loss", series: [
              { name: "train loss", color: "#4ea1ff", points: [[1, 1.84], [2, 1.52], [3, 1.33], [4, 1.18]] },
              { name: "val loss", color: "#ffb454", points: [[1, 1.71], [2, 1.49], [3, 1.47], [4, 1.49]] }
            ] } } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate: held-out + human + hallucination",
        narrative: `<p>Loss alone won't tell you if answers are <i>right</i> — a model can have low loss and still confidently misstate a policy. So you run the three evals you committed to in Frame: a held-out task-success eval on 1,000 unseen tickets, a human helpfulness rating, and a hallucination check that compares every claim in the answer to the retrieved source. The hallucination check is the one automatic loss can't approximate, because it requires matching claims against an external document.</p>`,
        concepts: ["ml-classification-metrics", "mod-llm", "mlx-error-analysis"],
        insight: `<b>81% right, but 1 in 16 invents a fact.</b> On 1,000 held-out tickets the bot resolves <b>81%</b>, humans rate it <b>4.2/5</b>, and perplexity is a healthy <b>9.3</b> — yet the hallucination rate is <b>6.1%</b>, meaning roughly <b>61</b> of those answers state something the retrieved source does not support. Note how the good-looking numbers hide the dangerous one: helpfulness and perplexity both look fine while the model is fabricating in 6% of replies.`,
        data: {
          caption: "Eval suite results on 1,000 held-out tickets",
          columns: ["metric", "value", "target", "pass?"],
          rows: [
            ["task success", "81%", "≥ 80%", "✓"],
            ["helpfulness (human)", "4.2 / 5", "≥ 4.0", "✓"],
            ["perplexity (in-domain)", "9.3", "≤ 12", "✓"],
            ["hallucination rate", "6.1%", "≤ 2%", "✗ blocker"]
          ],
          note: `Three of four metrics pass, but the failing one is a shipping blocker: in support, a confident wrong answer costs more trust than ten correct ones build. You do not ship on the average.`
        },
        symbols: [
          { sym: "task success", desc: "fraction of held-out tickets the answer actually resolves; the headline quality number." },
          { sym: "hallucination rate", desc: "fraction of answers containing at least one claim not entailed by the retrieved source passage." },
          { sym: "perplexity", desc: "$\\exp(\\text{cross-entropy})$ on held-out in-domain text; a fluency sanity-check, not a correctness measure." }
        ],
        steps: [
          { type: "run", label: "▶ Run the full eval suite", result: { log: "held-out support questions: 1,000\ntask success (answer resolves the ticket): 81%\nhuman helpfulness (1-5): 4.2 avg\nhallucination rate (claim not in retrieved source): 6.1%\nperplexity on in-domain held-out: 9.3", metrics: [{ k: "task success", v: "81%" }, { k: "hallucination", v: "6.1%" }, { k: "helpfulness", v: "4.2/5" }],
            chart: { type: "bars", title: "Eval suite on 1,000 held-out tickets (percent)", labels: ["task success", "helpfulness (4.2 of 5)", "hallucination rate"], values: [81, 84, 6.1], valueLabels: ["81%", "84%", "6.1%"], colors: ["#7ee787", "#7ee787", "#ff7b72"] } } },
          { type: "decide", prompt: "Hallucination rate is 6.1%. What does that mean for shipping?",
            options: [
              { label: "Ship it — 81% success is good enough", feedback: "this reads the average and ignores the blocker. 6.1% means 1 in 16 answers states something the source doesn't support, and in support a confident wrong answer (a made-up refund window, a non-existent setting) erodes trust faster than correct answers build it. The 81% can't buy back a customer who followed fabricated instructions. Drive hallucinations down before launch." },
              { label: "Tighten grounding: require citations, refuse when retrieval confidence is low, then re-measure", best: true, feedback: "the right lever, because it attacks the mechanism of hallucination directly. Requiring the model to cite the specific retrieved passage forces every claim to trace to a source, and refusing when top-k retrieval similarity is low removes the 'answer anyway' failure mode where the model guesses with no evidence. You change behavior, then re-measure the 6.1% to confirm it moved — not just hope." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>Error analysis is the step that tells you <i>which</i> lever to pull. You bucket the 61 hallucinated answers by cause and find a dominant pattern: most happen when retrieval returned nothing relevant (top-k cosine similarity below threshold) and the model answered from its parametric memory anyway. That reframes the problem — it's a <b>retrieval</b> gap, not a generation gap, so more fine-tuning would be aimed at the wrong stage.</p>`,
        concepts: ["mlx-error-analysis", "dl-cosine-similarity", "ml-bias-variance"],
        insight: `<b>Hallucinations cluster where retrieval is blind.</b> Bucketing the failures: <b>71%</b> are "retrieval returned low-similarity passages, model guessed anyway", <b>18%</b> are "right passage retrieved but model misread it", and <b>11%</b> are other. The fix follows the biggest bucket — raise retrieval recall and add a refusal gate when the top passage's cosine similarity falls below ~<b>0.35</b> — which removes the entire 71% guess-when-blind class.`,
        data: {
          caption: "Error analysis of the 61 hallucinated answers",
          columns: ["failure bucket", "share", "root cause", "fix"],
          rows: [
            ["retrieval missed, guessed", "71%", "no relevant passage", "better retrieval + refuse"],
            ["misread passage", "18%", "generation error", "more fine-tune / prompt"],
            ["ambiguous question", "11%", "user input", "ask to clarify"]
          ],
          note: `The dominant bucket is a retrieval problem, so the generator's weights aren't the bottleneck. Always size the buckets before choosing a fix — the cheapest fix that clears the biggest bucket wins.`
        },
        chart: { type: "bars", title: "Hallucination failure buckets (% of 61)", labels: ["retrieval missed, guessed", "misread passage", "ambiguous question"], values: [71, 18, 11], valueLabels: ["71%", "18%", "11%"], colors: ["#ff7b72", "#ffb454", "#4ea1ff"] },
        symbols: [
          { sym: "top-k", desc: "the $k$ passages with highest similarity to the query that retrieval returns; the candidate evidence for the answer." },
          { sym: "$\\cos\\theta$ gate", desc: "the refusal threshold on the best passage's cosine similarity (here ≈0.35); below it, the bot says 'I'm not sure' instead of guessing." },
          { sym: "recall", desc: "fraction of questions for which the truly-relevant passage appears in the top-k — the retriever's coverage." }
        ],
        steps: [{
          type: "decide", prompt: "Most failures are 'retrieval missed, model guessed.' Best fix?",
          options: [
            { label: "Improve retrieval (better embeddings, reranking) and add a 'no-answer' refusal when top-k similarity is low", best: true, feedback: "this targets the 71% bucket head-on. Better embeddings and a reranker raise the chance the right passage is in the top-k (higher recall), and the similarity-gated refusal converts the remaining blind cases from confident fabrications into honest 'I'm not sure' — far cheaper to a customer than a wrong answer. You're fixing the stage that actually fails, not the one that's convenient to retrain." },
            { label: "Fine-tune harder on more pairs", feedback: "fine-tuning teaches style and format, but it cannot supply a fact that retrieval never surfaced — the model has no source to ground on, so it will keep guessing. You'd spend a training cycle and barely move the 71% bucket, because the bottleneck is upstream of the generator entirely." },
            { label: "Raise the generation temperature for variety", feedback: "this makes it strictly worse. Higher temperature increases output randomness, so on exactly the blind-retrieval cases the model invents more varied (and more confident-sounding) fabrications. You want determinism and refusal here, not creativity." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy: serving, latency, cost",
        narrative: `<p>A 7B model generating tokens one at a time has real latency and GPU cost, because each new token is a full forward pass over the network. Three serving tricks cut both: <b>quantization</b> stores weights in 8-bit instead of 16/32-bit to shrink memory and speed matmuls; the <b>KV-cache</b> saves the keys/values of past tokens so attention never recomputes them; and <b>continuous batching</b> packs many users' requests through the GPU together. You stream tokens to hide latency and roll out behind a canary to limit blast radius.</p>`,
        concepts: ["mod-llm", "la-matmul"],
        insight: `<b>Serving tricks pay for themselves.</b> Int8 quantization roughly <b>halves</b> the memory footprint and speeds the matmuls; the KV-cache turns generation from $O(L^2)$ recompute into $O(L)$ by reusing past keys/values; continuous batching pushes GPU utilization from ~10% (one request) to a steady stream. The result on the canary: <b>31 req/s/GPU</b>, first-token latency <b>p50 280ms / p99 720ms</b>, and <b>$0.0021</b> per answer — an order of magnitude cheaper than naive serving.`,
        data: {
          caption: "Serving optimizations and what each one buys",
          columns: ["technique", "what it does", "wins", "cost"],
          rows: [
            ["int8 quantization", "8-bit weights", "½ memory, faster matmul", "tiny accuracy loss"],
            ["KV-cache", "reuse past K,V", "$O(L^2)→O(L)$ per step", "more GPU memory"],
            ["continuous batching", "merge requests", "high GPU utilization", "scheduler complexity"],
            ["token streaming", "emit as generated", "low perceived latency", "—"]
          ],
          note: `These stack: quantization frees memory that the KV-cache then uses, and batching fills the freed compute. Together they take cost/answer from cents to $0.0021.`
        },
        symbols: [
          { sym: "KV-cache", desc: "stored keys $K$ and values $V$ for already-generated tokens, so each new token attends to them without recomputation." },
          { sym: "int8", desc: "8-bit integer weight format; ~½ the memory of 16-bit, with a small, usually negligible quality drop." },
          { sym: "p50 / p99", desc: "median and 99th-percentile latency; p99 is the tail users feel on a bad request, the number you SLO against." },
          { sym: "$L$", desc: "tokens generated so far; the KV-cache is what keeps per-token work linear in $L$ instead of quadratic." }
        ],
        steps: [
          { type: "decide", prompt: "How do you serve it affordably?",
            options: [
              { label: "Quantize to 8-bit, enable KV-cache + continuous batching, stream tokens, canary at 5%", best: true, feedback: "each piece attacks a different cost: quantization shrinks memory and speeds matmuls, the KV-cache avoids recomputing every past token's attention (the dominant cost as answers get long), continuous batching keeps the GPU busy across users instead of idling between requests, and streaming makes the bot feel instant even while it's still typing. The 5% canary means a bad build hits 1 in 20 users, not everyone — you catch regressions before full rollout." },
              { label: "Run full-precision, one request per GPU, no batching", feedback: "this wastes the hardware on every axis: full precision doubles memory for no quality you can perceive here, one-request-per-GPU leaves ~90% of the GPU idle, and no KV-cache means each token redoes all the past attention. You'll pay 5–10x for the same throughput, and with no canary a bad deploy hits 100% of traffic at once." }
            ] },
          { type: "run", label: "▶ Deploy (canary 5% → 100%)", result: { log: "loading int8 weights, warming KV-cache...\ncanary 5%: p50 first-token 280ms, p99 720ms\nthroughput: 31 req/s/GPU (continuous batching)\ncost: $0.0021 / answer\npromoting to 100% ... live.", metrics: [{ k: "p99 first-token", v: "720ms" }, { k: "cost/answer", v: "$0.0021" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor: drift, toxicity, feedback",
        narrative: `<p>A shipped model is not a finished model. Live traffic shifts as new features launch, the docs behind RAG change, and some users probe for bad behavior. You watch four layers: <b>inputs</b> (topic/length drift), <b>outputs</b> (sampled hallucination and toxicity), the <b>system</b> (latency, cost, refusal rate), and <b>outcomes</b> (thumbs-up/down). Each layer catches a different kind of failure, and alerts on them are what close the loop back to Data when something slips.</p>`,
        concepts: ["mlx-error-analysis", "ml-classification-metrics"],
        insight: `<b>A stale index quietly doubles hallucinations.</b> Three days after a docs update, sampled hallucination climbs <b>4.0% → 7.8%</b> and thumbs-up drops <b>88% → 79%</b> — not because the model changed, but because the RAG index still points at old passages. The monitor catches it via the rising hallucination sample and the thumbs-down stream, and the fix is a re-index back at the Data stage, not a retrain.`,
        data: {
          caption: "What lives on the production dashboard (four layers)",
          columns: ["layer", "signal", "this week", "alert?"],
          rows: [
            ["inputs", "topic / length drift", "spike: 'new billing API'", "watch"],
            ["outputs", "sampled hallucination", "4.0% → 7.8%", "ALERT"],
            ["outputs", "toxicity flags", "0.2% (stable)", "ok"],
            ["outcomes", "thumbs-up rate", "88% → 79%", "ALERT"]
          ],
          note: `The alert on a sampled metric (hallucination, toxicity) is cheaper than labeling all traffic and catches silent quality drops that volume or latency would never reveal.`
        },
        symbols: [
          { sym: "drift", desc: "a shift in the input distribution (topics, lengths) versus training; a leading indicator that the model may be operating off-distribution." },
          { sym: "sampled rate", desc: "a metric (hallucination, toxicity) measured on a random sample of live traffic, because labeling 100% is too costly." },
          { sym: "thumbs-up rate", desc: "fraction of answers users mark helpful; the cheapest real-world outcome signal and an early warning when it falls." }
        ],
        steps: [
          { type: "decide", prompt: "What belongs on the production dashboard?",
            options: [
              { label: "Topic/length drift on inputs, sampled hallucination + toxicity rate, refusal rate, latency/cost, and user thumbs-up rate — with alerts", best: true, feedback: "this covers all four layers, and each one catches a failure the others miss: input drift warns you the world changed, sampled output metrics catch quality/safety regressions before users complain, system metrics protect cost and SLOs, and thumbs-up is the ground-truth outcome. The alerts are what make it a loop — a hallucination spike auto-pages you back to re-index, rather than waiting for a quarterly review." },
              { label: "Just average response length", feedback: "length tells you nothing about correctness, safety, or satisfaction — the model can keep answering at a steady 150 tokens while every answer turns wrong after a stale-index event. A silent quality drop like the 4.0%→7.8% hallucination spike would sail right past this dashboard, and you'd learn about it from churned customers instead of an alert." }
            ] },
          { type: "run", label: "▶ Check this week's monitors", result: { log: "input topic drift: spike in 'new billing API' questions (docs updated 3d ago)\nhallucination (sampled): 4.0% -> 7.8%  ALERT (RAG index stale)\ntoxicity flags: 0.2% (stable)\nthumbs-up rate: 88% -> 79%\naction: re-index docs, re-run eval, schedule LoRA refresh", metrics: [{ k: "hallucination", v: "7.8% ⚠" }, { k: "thumbs-up", v: "79%" }] }, note: `The loop closes here: a doc update made the RAG index stale, hallucinations rose, and the monitor caught it — triggering a re-index back at the <b>Data</b> stage. That's the real job.` }
        ]
      }
    ]
  },

  "language-understanding": {
    title: "Text Mining & NLP Analytics",
    icon: "📰",
    goal: "Turn a flood of support tickets into structured signal — route each ticket and pull out the entities that matter.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Frame the problem",
        narrative: `<p>Support gets 20,000 tickets a day. You want two things: a <b>classifier</b> that tags each ticket's topic (billing, bug, how-to…) into one of 14 routes, and an <b>NER</b> (named-entity recognition) step that extracts product names, versions, and order IDs as exact text spans. The classes are wildly imbalanced — and one of the rare ones, security, is the one you absolutely cannot miss. So success is not "high accuracy"; it's "every class counts, and the critical rare ones are caught."</p>`,
        concepts: ["ml-classification-metrics", "ml-supervised"],
        insight: `<b>Accuracy lies under imbalance.</b> With <b>14</b> topics ranging from 'how-to' at <b>31%</b> down to 'security' at <b>0.4%</b>, a model that simply ignores security still scores <b>~99.6%</b> accuracy on that class by always predicting "not security" — while missing every urgent ticket. Macro-F1 fixes this by averaging the F1 of each class equally, so the 0.4% class pulls the score down exactly as much as the 31% one.`,
        data: {
          caption: "Class imbalance across the 14 routing topics",
          columns: ["topic", "share of tickets", "criticality", "metric that guards it"],
          rows: [
            ["how-to", "31%", "low", "accuracy already fine"],
            ["billing", "17%", "medium", "precision/recall"],
            ["bug", "12%", "medium", "recall"],
            ["security", "0.4%", "CRITICAL", "per-class recall"]
          ],
          note: `Macro-F1 = mean of per-class F1, so each class weighs the same regardless of size. A 99% accurate model that never predicts 'security' has a security-F1 of 0, dragging macro-F1 way down — which is the alarm you want.`
        },
        chart: { type: "bars", title: "Class distribution across routing topics (% of tickets)", labels: ["how-to", "billing", "bug", "security"], values: [31, 17, 12, 0.4], valueLabels: ["31%", "17%", "12%", "0.4%"], colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#ff7b72"] },
        symbols: [
          { sym: "F1", desc: "harmonic mean of precision and recall, $\\dfrac{2PR}{P+R}$; high only when both are high, so it punishes ignoring a class." },
          { sym: "macro-F1", desc: "the unweighted average of every class's F1; treats rare and common classes equally." },
          { sym: "recall $R$", desc: "of all true tickets of a class, the fraction the model catches; the metric you protect for security." },
          { sym: "precision $P$", desc: "of all tickets the model labels a class, the fraction that truly are; the false-alarm side." }
        ],
        steps: [{
          type: "decide", prompt: "What objective fits a multi-class routing task with rare but critical classes?",
          options: [
            { label: "Maximize overall accuracy", feedback: "accuracy is dominated by the big classes, so it hides exactly the rare ones you care about. With 'security' at 0.4%, a model that never predicts it is still 99.6% accurate on that class and scores beautifully overall — while routing every security incident to the wrong queue. The metric rewards the failure you most need to avoid." },
            { label: "Maximize macro-F1 so rare classes count, plus per-class recall on the urgent ones", best: true, feedback: "macro-F1 averages each class's F1 equally, so the tiny security class moves the score as much as the giant how-to class — you can't game it by ignoring the tail. Adding per-class recall on the urgent routes gives you a direct, reportable guarantee on the categories where a miss is expensive. This is what stakeholders actually need to see." },
            { label: "Minimize cross-entropy and ignore class metrics", feedback: "cross-entropy is the loss you optimize during training, but it's not what you report or make decisions on — a log-loss number doesn't tell a stakeholder whether security tickets are being caught. You need per-route precision/recall to know if the routing is trustworthy; the loss alone can fall while a critical class quietly fails." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather labeled text",
        narrative: `<p>You need two kinds of labels. <b>Topic labels</b> are nearly free — agents already tag every ticket's route when they handle it, giving 312K weakly-supervised examples. <b>NER labels</b> are expensive — they require marking the exact character span of each entity (PRODUCT, VERSION, ORDER_ID), so you hand-annotate a smaller gold set and double-annotate it to measure agreement. The two label types have completely different cost and quality profiles, which shapes how much of each you collect.</p>`,
        concepts: ["ml-supervised", "aix-lda-topic"],
        insight: `<b>Span labels are the costly ones.</b> You harvest <b>312,000</b> topic-labeled tickets for free from existing routing tags, but the NER gold set is only <b>3,400</b> tickets — and that small set is enough <i>because</i> it's high quality: inter-annotator <b>F1 0.92</b> means two humans agreed on span boundaries 92% of the time. A weak NER label of similar size would be far noisier and cap the tagger's ceiling.`,
        data: {
          caption: "What an NER-labeled ticket looks like (BIO span tags)",
          columns: ["token", "Acme", "Pro", "v2.1", "order", "#48213"],
          rows: [
            ["BIO tag", "B-PRODUCT", "I-PRODUCT", "B-VERSION", "O", "B-ORDER_ID"],
            ["char start", "0", "5", "9", "14", "20"],
            ["char end", "4", "8", "13", "19", "26"]
          ],
          note: `BIO tagging: B- begins an entity, I- continues it, O is outside any entity. The model predicts one tag per token; exact char spans are what let you evaluate VERSION vs ORDER_ID separately. "#48213" is a single ORDER_ID span.`
        },
        symbols: [
          { sym: "BIO tags", desc: "per-token labels: B-(egin), I-(nside), O-(utside); the standard scheme that turns span extraction into a token-classification problem." },
          { sym: "inter-annotator F1", desc: "agreement between two independent human labelers on the same spans (here 0.92); your gold-set quality ceiling." },
          { sym: "weak labels", desc: "cheap, noisy labels (e.g. agents' existing routing tags) used at scale for the classifier where exactness matters less." }
        ],
        steps: [
          { type: "decide", prompt: "How do you label NER spans (product, version, order-id)?",
            options: [
              { label: "Hand-annotate a few thousand tickets with span boundaries, double-annotated for agreement", best: true, feedback: "NER is a per-token, exact-boundary task — a label that's off by one word is wrong — so the noise tolerance is far lower than for topic routing. A modest gold set (3,400 tickets) double-annotated to F1 0.92 gives you clean spans to both train and evaluate the tagger, and the agreement number tells you the labels themselves are trustworthy. Quality beats quantity here precisely because spans must be exact." },
              { label: "Regex everything and call it labels", feedback: "regex nails the easy structured cases ('v1.2.3', '#48213') but breaks on the messy real text — 'the Pro plan, version two point one', truncated IDs, typos — and crucially, if you train on regex output the model just learns to imitate the regex, inheriting its exact blind spots. You'd cap the tagger at regex-level recall and never know what it's missing." },
              { label: "Skip NER labels and hope the classifier learns entities too", feedback: "a topic classifier emits a single class per ticket, not character spans — there is no mechanism for it to output 'ORDER_ID is at chars 20–26'. Without span labels you can neither train the tagger nor evaluate extraction, so entity extraction simply doesn't exist. The two tasks need two label sets." }
            ] },
          { type: "run", label: "▶ Assemble the corpus", result: { log: "pulling tagged tickets...\nrouting-labeled tickets: 312,000 across 14 topics\nclass imbalance: 'how-to' 31% ... 'security' 0.4%\nNER gold set: 3,400 tickets, inter-annotator F1 0.92\nentity types: PRODUCT, VERSION, ORDER_ID", metrics: [{ k: "tickets", v: "312K" }, { k: "topics", v: "14" }, { k: "NER agreement", v: "0.92" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore the text",
        narrative: `<p>Look before you model. <b>LDA</b> (latent Dirichlet allocation) is an unsupervised topic model that discovers clusters of co-occurring words — themes — without using your labels, so it can surface routes your schema forgot. Meanwhile <b>t-SNE</b> projects the high-dimensional embeddings to 2-D so you can see which classes overlap. Class balance, multilingual text, and code snippets all shape later choices, so you profile all of it first.</p>`,
        concepts: ["aix-lda-topic", "cls-tsne", "mlx-error-analysis"],
        insight: `<b>An unlabeled theme is a 4% routing hole.</b> LDA with $k=20$ topics surfaces a 'mobile-app-crash' cluster covering <b>~4%</b> of tickets that has <b>no routing label at all</b> — meaning today those tickets get forced into the wrong bucket every single day. Exploration also reveals <b>19%</b> non-English text and <b>12%</b> code-snippet tickets needing special tokenization, and a t-SNE plot where 'billing' and 'refund' embeddings sit right on top of each other.`,
        data: {
          caption: "LDA-discovered topics vs. your existing label schema",
          columns: ["LDA topic (top words)", "% tickets", "has a label?", "action"],
          rows: [
            ["refund, charge, money back", "8%", "yes (billing/refund)", "keep"],
            ["crash, freeze, android, ios", "4%", "NO", "add new class"],
            ["password, login, reset", "6%", "yes (account)", "keep"],
            ["…", "…", "…", "…"]
          ],
          note: `LDA models each ticket as a mixture over $k$ latent topics inferred purely from word co-occurrence. A high-mass topic with no matching label is a gap in your schema — found before training, not after a misroute incident.`
        },
        symbols: [
          { sym: "$k$", desc: "the number of latent topics LDA is told to find (here 20); a discovery knob, not a final class count." },
          { sym: "LDA", desc: "latent Dirichlet allocation — models each document as a mixture of latent word-distribution topics, fully unsupervised." },
          { sym: "t-SNE", desc: "a nonlinear 2-D projection of high-dimensional embeddings that preserves local neighborhoods, used to <i>see</i> class overlap." }
        ],
        steps: [
          { type: "run", label: "▶ Profile & topic-model", result: { log: "running LDA topic model (k=20) for discovery...\nfound an unlabeled cluster: 'mobile-app-crash' (~4% of tickets)\nlanguages: en 81%, es 9%, fr 5%, other 5%\ncode-snippet tickets: 12% (need special tokenization)\nt-SNE shows 'billing' and 'refund' heavily overlap", metrics: [{ k: "LDA topics", v: "20" }, { k: "non-en", v: "19%" }] } },
          { type: "decide", prompt: "LDA found a 'mobile-app-crash' theme that has no routing label. What now?",
            options: [
              { label: "Add it as a new class and get those tickets labeled before training", best: true, feedback: "LDA just told you the label schema is incomplete — 4% of real traffic belongs to a route that doesn't exist yet. If you train without it, those tickets are forced into the nearest wrong class every time, a guaranteed systematic error baked into the model. Defining the class and labeling examples now closes the hole before it becomes a recurring misroute. This is exactly why you explore before you model." },
              { label: "Ignore it — it's not in the label schema", feedback: "the tickets don't disappear because your schema lacks a slot for them — they keep arriving and get misrouted into whatever class is closest, producing a steady 4% error you've chosen not to fix. Worse, that error is invisible to accuracy because the model confidently predicts the wrong existing class. Pretending the theme isn't there just hides the problem." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Represent the text",
        narrative: `<p>Models need vectors, not strings. <b>TF-IDF</b> turns a ticket into a sparse vector that weights each word by how often it appears here versus everywhere — a fast, strong baseline. <b>Contextual embeddings</b> from a transformer instead give each word a dense vector that depends on its neighbors, so 'crash' near 'payment' and 'crash' near 'app' get different representations. The plan is baseline first, then upgrade where it pays off.</p>`,
        concepts: ["dl-word2vec", "dl-word-embeddings", "mod-transformer"],
        insight: `<b>TF-IDF down-weights the filler.</b> The word 'the' appears in ~100% of tickets so its IDF is near $\\log(1)=0$ — it contributes almost nothing — while 'refund' appears in ~8% of tickets, giving IDF $\\approx\\log(312\\text{K}/25\\text{K})\\approx 2.5$, so it dominates the vector. That's the whole trick: rare, discriminative words get weight; ubiquitous ones don't. Transformer embeddings then add what TF-IDF can't — context and word order.`,
        data: {
          caption: "TF-IDF vs. contextual embedding for one ticket",
          columns: ["word", "term freq", "IDF (rarity)", "TF-IDF", "contextual?"],
          rows: [
            ["the", "0.09", "≈ 0.0", "≈ 0.00", "no"],
            ["refund", "0.04", "≈ 2.5", "0.10", "no"],
            ["crash", "0.03", "≈ 2.1", "0.06", "yes — meaning shifts"],
            ["…", "…", "…", "…", "…"]
          ],
          note: `TF-IDF $= \\text{tf}\\times\\text{idf}$ is sparse (one weight per vocab word, mostly zero) and context-blind. A transformer embedding is dense (~768 dims) and context-aware, which is why it lifts the overlapping billing/refund classes.`
        },
        symbols: [
          { sym: "tf", desc: "term frequency — how often a word occurs in this ticket, normalized by ticket length." },
          { sym: "idf", desc: "inverse document frequency, $\\log\\!\\dfrac{N}{n_w}$ over $N$ tickets where $n_w$ contain the word; high for rare, discriminative words." },
          { sym: "TF-IDF", desc: "the product $\\text{tf}\\times\\text{idf}$; a sparse, fast, context-blind vector — the baseline to beat." },
          { sym: "contextual embedding", desc: "a dense vector per token from a transformer that depends on surrounding words, capturing meaning and order." }
        ],
        steps: [{
          type: "decide", prompt: "Which representation for the classifier?",
          options: [
            { label: "Start with TF-IDF for a fast baseline, then move to contextual transformer embeddings", best: true, feedback: "TF-IDF trains in seconds and sets an honest bar — if your fancy model can't beat it, something is wrong. Then transformer embeddings buy you the thing TF-IDF structurally cannot: context, so 'crash' means different things near 'payment' vs 'app', which is exactly what separates the overlapping billing/refund classes. Baseline-then-upgrade also tells you how much the expensive model is actually worth." },
            { label: "Raw character strings fed directly to a tree model", feedback: "a tree splits on numeric features; it has no way to consume a raw string, so it would error or treat the whole text as one meaningless categorical value. Vectorization isn't optional — every text model needs a numeric representation first, which is the entire point of this stage." },
            { label: "One-hot encode the full vocabulary with no weighting", feedback: "one-hot gives a vector as wide as the vocabulary (tens of thousands of dims), almost all zeros, and treats 'the' as exactly as informative as 'refund'. That's why IDF weighting exists — to down-weight the words present in every ticket and up-weight the discriminative ones. Unweighted one-hot is the worse, larger cousin of TF-IDF." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick the pipeline",
        narrative: `<p>You need two outputs from one pipeline. A topic <b>classifier</b> emits a single class per ticket; a sequence <b>tagger</b> emits a BIO label per token for NER. A single fine-tuned transformer encoder can serve both by attaching two heads — a classification head over the pooled sentence and a token-tagging head over each token — sharing the same contextual backbone. A logistic-regression baseline on TF-IDF anchors the classifier so you know what "good" looks like.</p>`,
        concepts: ["ml-logistic-regression", "mod-transformer", "ml-naive-bayes"],
        insight: `<b>One backbone, two heads.</b> A shared encoder produces a per-token contextual vector $\\mathbf{h}_t$; the <b>classification head</b> pools these (e.g. the [CLS] vector) and applies softmax over 15 routes, while the <b>tagging head</b> applies softmax over BIO tags at <i>every</i> token $t$. Reusing one backbone means the expensive transformer runs once per ticket and both tasks benefit from the same context — cheaper and stronger than two separate models.`,
        data: {
          caption: "Two heads on one shared transformer encoder",
          columns: ["component", "input", "output", "loss"],
          rows: [
            ["shared encoder", "token ids", "per-token vectors $\\mathbf{h}_t$", "—"],
            ["classification head", "pooled $\\mathbf{h}_{[CLS]}$", "1 of 15 topics", "cross-entropy"],
            ["tagging head", "every $\\mathbf{h}_t$", "BIO tag per token", "token cross-entropy"],
            ["LR baseline", "TF-IDF vector", "1 of 15 topics", "logistic"]
          ],
          note: `The logistic-regression baseline exists to be beaten: if the transformer can't clear LR's macro-F1, you've a bug, not a better model. Sharing the encoder is a classic multi-task trick — one forward pass, two predictions.`
        },
        symbols: [
          { sym: "$\\mathbf{h}_t$", desc: "the encoder's contextual output vector for token $t$; consumed by the tagging head and pooled for classification." },
          { sym: "[CLS]", desc: "a special pooled token whose vector summarizes the whole ticket; fed to the classification head." },
          { sym: "head", desc: "a small linear layer on top of the shared backbone that maps $\\mathbf{h}$ to task-specific outputs (topics or BIO tags)." },
          { sym: "softmax", desc: "normalizes head logits into a probability distribution over classes (15 topics) or tags (BIO)." }
        ],
        steps: [{
          type: "decide", prompt: "Choose the modeling approach.",
          options: [
            { label: "Logistic-regression baseline on TF-IDF, then a fine-tuned transformer with a classification head and a token-tagging head", best: true, feedback: "the LR baseline proves the data is learnable and sets a concrete macro-F1 bar in minutes, so you can tell whether the transformer is actually earning its cost. The shared-encoder transformer then handles both routing and span extraction with full context, and reusing one backbone for two heads is cheaper than two models while letting each task benefit from the same learned representation. Baseline plus a context-aware multi-task model is the right ladder." },
            { label: "Jump straight to a giant generative LLM for everything", feedback: "a generative LLM is wildly overkill for high-volume routing: it's slower, far costlier per ticket at 20K/day, and harder to evaluate because free-text output doesn't map cleanly to a fixed route or exact spans. A fine-tuned encoder gives you calibrated class probabilities and token tags directly — the structured outputs this task needs — at a fraction of the latency and price." },
            { label: "Naive Bayes only, forever", feedback: "Naive Bayes is a perfectly good baseline, but its core assumption — that words are conditionally independent given the class — is exactly what fails on overlapping classes like billing vs refund, where the same words co-occur. It can't model context or word interactions, so it'll plateau below the transformer on precisely the hard, confusable routes. Fine as a floor, not as the ceiling." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train it",
        narrative: `<p>You fine-tune with two safeguards against the imbalance. <b>Class weights</b> scale each ticket's loss by roughly $1/\\text{frequency}$, so a rare security ticket contributes far more gradient than a common how-to one — counteracting the model's pull toward the majority. You optimize cross-entropy but <b>watch validation macro-F1</b>, because accuracy would climb even while the rare classes stay broken. Early stopping ends training when macro-F1 plateaus.</p>`,
        concepts: ["dl-cross-entropy", "ml-regularization", "ml-softmax"],
        insight: `<b>Accuracy and macro-F1 diverge.</b> Watch the two columns: by epoch 3, accuracy is a flat-looking <b>0.86→0.90</b>, but macro-F1 leaps <b>0.61→0.74→0.79</b> — almost all the real improvement is in the rare classes that accuracy barely registers. The $1/\\text{freq}$ class weights are what drive that macro-F1 gain: without them the model would optimize accuracy and leave security near-zero. NER head reaches token-F1 <b>0.88</b>.`,
        data: {
          caption: "Training curve — accuracy hides what macro-F1 reveals",
          columns: ["epoch", "val accuracy", "val macro-F1", "read"],
          rows: [
            ["1", "0.86", "0.61", "rare classes weak"],
            ["2", "0.89", "0.74", "weights helping"],
            ["3", "0.90", "0.79", "plateau → early stop"],
            ["NER head", "—", "0.88 (token-F1)", "spans solid"]
          ],
          note: `Class weight for a topic $c$ $\\propto 1/\\text{freq}(c)$, so the 0.4% security class gets ~75× the per-example weight of the 31% how-to class. Accuracy moves 4 points while macro-F1 moves 18 — proof the gains are in the tail.`
        },
        symbols: [
          { sym: "class weight $w_c$", desc: "a per-class loss multiplier $\\propto 1/\\text{freq}(c)$ that up-weights rare classes so they aren't ignored." },
          { sym: "cross-entropy", desc: "$-\\sum_c y_c \\log p_c$ — the per-ticket loss; with class weights it becomes $-\\sum_c w_c\\, y_c \\log p_c$." },
          { sym: "macro-F1", desc: "the early-stopping criterion here; unweighted mean of per-class F1, sensitive to the rare classes accuracy ignores." }
        ],
        steps: [{
          type: "run", label: "▶ Fine-tune the encoder (class-weighted)",
          result: { log: "fine-tuning transformer encoder, class weights ~ 1/freq...\nepoch 1  val acc 0.86  val macro-F1 0.61\nepoch 2  val acc 0.89  val macro-F1 0.74\nepoch 3  val acc 0.90  val macro-F1 0.79  (early stop)\nNER head: token-level F1 0.88", metrics: [{ k: "macro-F1", v: "0.79" }, { k: "NER F1", v: "0.88" }],
            chart: { type: "line", title: "Accuracy hides what macro-F1 reveals", xlabel: "epoch", ylabel: "score", series: [
              { name: "val accuracy", color: "#4ea1ff", points: [[1, 0.86], [2, 0.89], [3, 0.90]] },
              { name: "val macro-F1", color: "#7ee787", points: [[1, 0.61], [2, 0.74], [3, 0.79]] }
            ] } } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate honestly",
        narrative: `<p>Overall accuracy of 0.90 looks shippable — until you read the confusion matrix and per-class recall. The confusion matrix is a grid where cell $(i,j)$ counts true-class-$i$ tickets predicted as class $j$; the off-diagonal mass is where the model fails. You look specifically at the rare critical routes and the known-overlapping pairs, because that's where the average is hiding the damage.</p>`,
        concepts: ["ml-classification-metrics", "ml-roc-auc", "mlx-error-analysis"],
        insight: `<b>0.90 accuracy, but it misses 42% of security tickets.</b> Per-class recall exposes what the headline number buries: security recall is just <b>0.58</b>, so 42 of every 100 urgent tickets are misrouted — the exact failure the whole project was framed to avoid. The confusion matrix also shows billing↔refund swapped <b>9%</b> of the time (the embeddings overlapped, as t-SNE predicted). NER spans hold up: PRODUCT <b>0.91</b>, VERSION 0.86, ORDER_ID 0.83.`,
        data: {
          caption: "Per-class breakdown on 40,000 test tickets",
          columns: ["class", "recall", "precision", "note"],
          rows: [
            ["how-to (31%)", "0.94", "0.93", "easy, fine"],
            ["billing (17%)", "0.85", "0.82", "↔ refund confusion 9%"],
            ["security (0.4%)", "0.58", "0.71", "⚠ misses 42% urgent"],
            ["NER ORDER_ID", "—", "F1 0.83", "weakest span type"]
          ],
          note: `Confusion-matrix cell $(i,j)$ = count of true $i$ predicted $j$. The diagonal is correct routes; the billing/refund off-diagonal and the low security recall are the actionable signals accuracy can't show.`
        },
        chart: { type: "confusion", title: "Confusion matrix (% of true class, rows sum to 100)", labels: ["how-to", "billing", "refund", "security"], matrix: [
          [94, 3, 2, 1],
          [4, 85, 9, 2],
          [3, 9, 86, 2],
          [12, 18, 12, 58]
        ] },
        symbols: [
          { sym: "confusion matrix", desc: "a $C\\times C$ grid; cell $(i,j)$ = number of true-class-$i$ tickets predicted as class $j$. Diagonal = correct." },
          { sym: "recall (security)", desc: "of all true security tickets, the fraction caught (here 0.58); the metric you cannot let slip." },
          { sym: "precision (security)", desc: "of all tickets flagged security, the fraction truly security (here 0.71); the false-alarm cost of flagging more." }
        ],
        steps: [
          { type: "run", label: "▶ Per-class evaluation", result: { log: "test set: 40,000 tickets\noverall accuracy: 0.90\nmacro-F1: 0.79\n'security' recall: 0.58  (misses 42% of urgent tickets)\nconfusion: 'billing' <-> 'refund' swapped 9% of the time\nNER: PRODUCT F1 0.91, VERSION 0.86, ORDER_ID 0.83", metrics: [{ k: "accuracy", v: "0.90" }, { k: "security recall", v: "0.58 ⚠" }],
            chart: { type: "bars", title: "Per-class recall (security is the blocker)", labels: ["how-to", "billing", "security"], values: [0.94, 0.85, 0.58], valueLabels: ["0.94", "0.85", "0.58"], colors: ["#7ee787", "#7ee787", "#ff7b72"] } } },
          { type: "decide", prompt: "Security recall is only 0.58. Which fix matches the goal?",
            options: [
              { label: "Lower the decision threshold for 'security' and add hard-negative examples, accepting a few more false alarms", best: true, feedback: "for a critical route the cost is asymmetric: a missed security ticket is a potential incident, a false alarm just costs a human a few seconds to dismiss. Lowering the security threshold trades precision for recall in exactly that direction, and adding hard-negative examples teaches the model the subtle cases it's missing. You over-flag on purpose and let a human confirm — directly raising recall where a miss is expensive." },
              { label: "Do nothing — overall accuracy is 0.90", feedback: "this is the trap the Frame stage warned about: the 0.90 average is propped up by the giant easy classes while the one class you most need to catch fails 42% of the time. Reporting the average here would hide a real operational risk behind a green number. Under imbalance, you must act on the per-class metric, not the headline." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>Error analysis on the 9% billing↔refund swaps reveals <i>why</i> they confuse: refund requests almost always mention billing terms (charge, invoice, card), so the two classes share most of their vocabulary. This is a <b>label-overlap</b> problem, not a model-capacity one — the boundary between the two routes is genuinely fuzzy. That diagnosis rules out "train more" and points at clarifying the labels themselves.</p>`,
        concepts: ["mlx-error-analysis", "ml-bias-variance", "mlx-cross-validation"],
        insight: `<b>The two classes share their words.</b> Reading the confused tickets, ~<b>70%</b> of refund tickets contain billing vocabulary and vice-versa, so even a perfect model can't separate them without a clearer rule. Since validation macro-F1 already <b>plateaued at 0.79</b>, the error is irreducible <i>bias</i> from ambiguous labels — not <i>variance</i> you'd cut with more data or epochs. The fix is a sharper label boundary (or a merge), plus a few hand-picked disambiguating examples.`,
        data: {
          caption: "Reading the billing↔refund confusions",
          columns: ["ticket text (excerpt)", "true label", "predicted", "why confused"],
          rows: [
            ["\"charged twice, want money back\"", "refund", "billing", "shares 'charged'"],
            ["\"my invoice looks wrong\"", "billing", "billing", "correct"],
            ["\"cancel and refund my card\"", "refund", "refund", "correct"],
            ["\"double charge, please reverse\"", "refund", "billing", "no 'refund' word"]
          ],
          note: `The confusions cluster on tickets that describe a refund using only billing words. That's a definition problem: either merge the routes or write a rule (intent = get-money-back ⇒ refund) and label to it.`
        },
        symbols: [
          { sym: "bias", desc: "error from the model/labels being unable to represent the true boundary; here, ambiguous label definitions cap accuracy regardless of data." },
          { sym: "variance", desc: "error from sensitivity to the particular training sample; reducible with more data — but that's not this failure." },
          { sym: "label overlap", desc: "when two classes share most of their feature distribution, making them inherently hard to separate without redefinition." }
        ],
        steps: [{
          type: "decide", prompt: "'billing' and 'refund' keep swapping. Best response?",
          options: [
            { label: "Error-analyze the confusions, add disambiguating features/examples, and consider merging or re-defining the two routes", best: true, feedback: "the diagnosis says the classes genuinely overlap in feature space, so the lever is the label definition, not the model. Sharpening the boundary (intent-to-get-money-back ⇒ refund) or merging the routes removes the ambiguity at its source, and a handful of targeted examples on the confusable cases teaches the new rule. This attacks the bias; blindly adding more ambiguous tickets would only reinforce the confusion." },
            { label: "Just train for more epochs", feedback: "macro-F1 already plateaued, which means the model has extracted what the current labels allow — more epochs would only fit noise (raising variance) without touching the real bias from overlapping definitions. You'd burn compute and risk overfitting while the billing/refund boundary stays exactly as fuzzy as before." },
            { label: "Drop the 'refund' class entirely", feedback: "deleting the class doesn't delete the tickets — they still arrive and now route somewhere even more wrong, and you lose the ability to handle refunds as a distinct workflow. This trades a 9% confusion for a 100% misroute of those tickets. The problem is boundary definition, not the existence of the class." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy the pipeline",
        narrative: `<p>Routing runs on every one of 20,000 inbound tickets a day, so it must be fast and reliable. The key design choice is a <b>confidence gate</b>: when the classifier's top softmax probability is high, auto-route the ticket; when it's low, send it to a human queue. That keeps automation high on the easy cases while routing the genuinely ambiguous ones (like billing/refund) to people — who also generate corrected labels for the next retrain. You canary to a small slice first.</p>`,
        concepts: ["ml-classification-metrics", "mod-transformer"],
        insight: `<b>Auto-route the confident 82%, escalate the rest.</b> With a confidence threshold tuned on validation, the canary auto-routes <b>82%</b> of tickets at p99 latency <b>58ms</b> and sends the low-confidence <b>18%</b> to humans — and shadow-mode agreement with agents' own tags is <b>91%</b>, your go/no-go gate. The human-reviewed 18% isn't waste: those corrections become fresh training labels, closing the loop that improves macro-F1 over time.`,
        data: {
          caption: "Confidence-gated routing on the canary",
          columns: ["top softmax prob", "action", "share", "outcome"],
          rows: [
            ["≥ 0.85", "auto-route", "82%", "p99 58ms"],
            ["0.50–0.85", "human queue", "16%", "corrected → new labels"],
            ["< 0.50", "human queue", "2%", "corrected → new labels"],
            ["shadow vs agent tags", "—", "—", "91% agree"]
          ],
          note: `The gate trades coverage for safety: raising the 0.85 threshold sends more tickets to humans (safer, slower); lowering it automates more (faster, riskier). Shadow agreement of 91% is what lets you promote past canary.`
        },
        symbols: [
          { sym: "top softmax prob", desc: "the model's confidence — the largest class probability for a ticket; the value the gate thresholds on." },
          { sym: "confidence threshold", desc: "the cutoff (here 0.85) above which the ticket is auto-routed and below which it's escalated to a human." },
          { sym: "shadow agreement", desc: "fraction of tickets where the model's route matches the human agent's tag while running silently in parallel; the canary go/no-go signal." }
        ],
        steps: [
          { type: "decide", prompt: "How should the classifier+NER run in production?",
            options: [
              { label: "A batched real-time service with confident auto-route and low-confidence tickets sent to a human queue, canary first", best: true, feedback: "the confidence gate is the whole design: auto-routing only the high-probability tickets keeps accuracy high where the model is sure, while the low-confidence escalations route the truly ambiguous cases to people instead of guessing. Those human decisions double as corrected labels for the next retrain, so the system improves itself. Canary-first means you validate shadow agreement before trusting it with all traffic — de-risking the launch." },
              { label: "Auto-route 100% with no human fallback", feedback: "removing the gate means every low-confidence ticket — including the billing/refund and rare-security cases the model is worst at — gets routed with no safety net, so each error lands directly on a customer. You also throw away the single best source of fresh labels: the human corrections that would otherwise feed the improvement loop. Full automation without a fallback maximizes both risk and stagnation." }
            ] },
          { type: "run", label: "▶ Ship (canary 10% → 100%)", result: { log: "deploying encoder pipeline v1...\ncanary 10%: p99 latency 58ms, auto-route rate 82%\nlow-confidence -> human queue: 18%\nshadow agreement with agent tags: 91%\npromoting to 100% ... live.", metrics: [{ k: "p99 latency", v: "58ms" }, { k: "auto-route", v: "82%" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain (MLOps)",
        narrative: `<p>Language drifts — new products launch, new slang appears, a new bug floods the queue. You monitor four things: <b>input drift</b> (new vocabulary and topic shifts), <b>per-class precision/recall</b> computed from the human-corrected routes the confidence gate produces, the <b>NER field-fill rate</b> (are entities still being extracted?), and the <b>confidence distribution</b> (is the gate escalating more?). The human corrections from Deploy are what make live per-class metrics possible at all.</p>`,
        concepts: ["mlx-error-analysis", "ml-classification-metrics", "aix-lda-topic"],
        insight: `<b>A product launch creates unseen vocabulary.</b> Five days after 'AuroraDB' launched, the token spikes in the queue and — being absent from training — gets misrouted to 'other', dragging billing precision <b>0.88 → 0.81</b> (an alert). Separately the NER ORDER_ID fill-rate drops because an upstream ID format changed. Both are caught by the live metrics the human-corrected labels feed, and both route you back to the Data stage for fresh labels and rules.`,
        data: {
          caption: "This week's monitors and what each one caught",
          columns: ["monitor", "layer", "reading", "trigger"],
          rows: [
            ["new-token rate", "input", "'AuroraDB' spike (5d old)", "drift alert"],
            ["billing precision", "output", "0.88 → 0.81", "ALERT → relabel"],
            ["NER ORDER_ID fill", "output", "dropped (format changed)", "refresh rules"],
            ["confidence dist.", "system", "more escalations", "watch"]
          ],
          note: `Live per-class metrics are computed from the human-corrected routes the gate produces — the deploy-time escalations become the monitoring-time ground truth. Drift on inputs is the leading signal; quality drop on outputs is the confirming one.`
        },
        symbols: [
          { sym: "vocabulary drift", desc: "the appearance of tokens (new product names, slang) rare or absent in training; a leading indicator of misrouting." },
          { sym: "field-fill rate", desc: "fraction of tickets where an NER field (e.g. ORDER_ID) is successfully extracted; a drop signals an upstream format change." },
          { sym: "per-class precision", desc: "precision per route, recomputed live from human-corrected labels; the confirming signal that quality slipped." }
        ],
        steps: [
          { type: "decide", prompt: "What do you monitor in production?",
            options: [
              { label: "Vocabulary/topic drift, per-class precision & recall from human-corrected routes, NER field-fill rate, and confidence distribution — with alerts", best: true, feedback: "this spans inputs, outputs, and extraction, and each catches a distinct failure: vocabulary drift warns when a launch introduces unseen terms, the per-class metrics (free from the gate's human corrections) confirm whether routing quality actually slipped, and the fill-rate catches silent NER breakage from upstream format changes. Alerts on these turn monitoring into the relabel-and-retrain loop instead of a passive chart you check after customers complain." },
              { label: "Only total ticket volume", feedback: "volume tells you how busy the queue is, not whether tickets are going to the right place — billing precision could fall from 0.88 to 0.81 with volume perfectly flat. A classifier quietly degrading after a product launch would be completely invisible here, and you'd discover it only through escalations and angry customers." }
            ] },
          { type: "run", label: "▶ Check this week's monitors", result: { log: "new token spike: 'AuroraDB' (product launched 5d ago) -> often misrouted to 'other'\n'billing' precision (7d): 0.88 -> 0.81  ALERT\nNER ORDER_ID fill-rate dropped: format changed upstream\naction: add AuroraDB examples, refresh NER rules, retrain", metrics: [{ k: "billing precision", v: "0.81 ⚠" }, { k: "drift", v: "detected" }] }, note: `The loop closes here: a product launch introduced unseen vocabulary, routing precision slipped, and monitoring caught it — sending you back to the <b>Data</b> stage for fresh labels. That's the real job.` }
        ]
      }
    ]
  },

  "speech-translation": {
    title: "Speech Recognition & Translation",
    icon: "🗣️",
    goal: "Transcribe spoken English and translate it to Spanish in near real time — accurate, low-latency, robust to noise.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Frame the problem",
        narrative: `<p>You're building speech-to-text plus translation for a meetings app, a two-stage pipeline: ASR (audio → English text) then MT (English → Spanish). Each half needs its own metric. <b>WER</b> (word error rate) counts how many word edits — insertions, deletions, substitutions — turn the transcript into the reference, divided by reference length; lower is better. <b>BLEU</b> scores how much the translation's n-grams overlap a reference translation; higher is better. Picking the right metric per task is the framing decision.</p>`,
        concepts: ["dl-rnn", "ml-classification-metrics"],
        insight: `<b>WER counts edits, not sentences.</b> If the reference is 10 words and the transcript has 1 substitution + 1 deletion, WER $= (1+1)/10 = $ <b>20%</b> — a graded signal, where plain sentence accuracy would just score the whole utterance "wrong" and tell you nothing about how wrong. BLEU works on n-gram overlap (1- to 4-grams) so it rewards partially-correct translations too. Two tasks, two graded metrics — that's why neither sentence-accuracy nor waveform-MSE fits.`,
        data: {
          caption: "WER computed from edit operations (Levenshtein)",
          columns: ["reference", "hypothesis", "edits (S/D/I)", "WER"],
          rows: [
            ["the cat sat on the mat", "the cat sat on a mat", "1 sub", "1/6 = 17%"],
            ["please mute your mic", "please your mic", "1 del", "1/4 = 25%"],
            ["start the call now", "start the the call now", "1 ins", "1/4 = 25%"],
            ["…", "…", "…", "…"]
          ],
          note: `WER $= (S+D+I)/N$ over $N$ reference words, with S=substitutions, D=deletions, I=insertions. BLEU instead compares n-gram counts with a brevity penalty for too-short outputs. Both are graded, unlike all-or-nothing sentence accuracy.`
        },
        symbols: [
          { sym: "WER", desc: "word error rate $=(S+D+I)/N$ — total word edits over $N$ reference words; lower is better, 0 is perfect." },
          { sym: "$S,D,I$", desc: "counts of word substitutions, deletions, and insertions needed to match the reference (a Levenshtein alignment)." },
          { sym: "$N$", desc: "number of words in the reference transcript; the denominator that normalizes WER." },
          { sym: "BLEU", desc: "translation score from clipped n-gram precision (n=1..4) times a brevity penalty; higher is better, max 100." }
        ],
        steps: [{
          type: "decide", prompt: "Which metrics actually match the two tasks?",
          options: [
            { label: "WER for transcription quality and BLEU for translation quality, both on held-out audio", best: true, feedback: "each metric is built for its task: WER counts insert/delete/substitute word errors against the reference transcript — the natural unit for transcription — while BLEU scores n-gram overlap against reference translations, the standard for MT. Both are graded (partial credit) and both run on held-out audio the model never saw, so they predict real-world performance. Right tool for each half of the cascade." },
            { label: "Plain accuracy on whole sentences", feedback: "sentence-level accuracy is all-or-nothing: one wrong word fails the entire utterance, so a transcript that's 95% right scores identically to one that's 5% right. That coarseness erases the graded signal you need to tell whether a change helped, which is exactly what WER and BLEU provide at the word/n-gram level." },
            { label: "Mean-squared error on the audio waveform", feedback: "MSE on the waveform measures how closely you reconstruct the <i>audio samples</i>, not whether the recognized <i>words</i> are correct — two different waveforms can say the same sentence and two similar ones can say different sentences. This is a sequence-recognition task, not signal regression; waveform error is the wrong objective entirely." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather paired data",
        narrative: `<p>The two stages need two kinds of paired data. ASR needs <b>audio paired with its transcript</b> — supervised, because the model must learn the mapping from sound to words. MT needs <b>English-Spanish sentence pairs</b>. Robustness to real meetings comes entirely from <i>coverage</i>: the training audio must span the accents, background noise, microphone types, and speaking rates you'll actually encounter, or the model fails the moment conditions leave the studio.</p>`,
        concepts: ["dl-rnn", "ai-hmm"],
        insight: `<b>Cover the conditions you'll face.</b> The corpus spans <b>2,100 hours</b> across accents — US 44%, UK 18%, IN 14%, AU 9%, other 15% — and SNR from <b>5 to 40 dB</b>, deliberately including noisy calls. SNR (signal-to-noise ratio) of 5 dB means the speech is only ~3× louder than the background; a model that never trains below 30 dB will collapse there. The 12.4M MT pairs cover translation. Sample rate is <b>16 kHz</b>, the speech standard.`,
        data: {
          caption: "What the paired ASR data looks like",
          columns: ["audio clip", "transcript", "accent", "SNR (dB)", "duration"],
          rows: [
            ["clip_0001.wav", "\"let's start the standup\"", "US", "38", "2.1s"],
            ["clip_0002.wav", "\"can everyone hear me\"", "IN", "12", "1.8s"],
            ["clip_0003.wav", "\"I'll share my screen now\"", "UK", "6", "2.4s"],
            ["…", "…", "…", "…", "…"]
          ],
          note: `Each row is one (audio, transcript) supervised pair. Low-SNR rows (6–12 dB) are the noisy-call cases the model must handle. MT data is separate: 12.4M (English sentence, Spanish sentence) pairs.`
        },
        symbols: [
          { sym: "SNR", desc: "signal-to-noise ratio in decibels; high dB = clean speech, low dB = noisy. Each +10 dB ≈ 10× more signal power vs noise." },
          { sym: "sample rate", desc: "audio samples per second (16 kHz here); enough to capture speech frequencies up to 8 kHz." },
          { sym: "(audio, transcript)", desc: "one supervised ASR pair; the transcript is the target the model learns to produce from the audio." }
        ],
        steps: [
          { type: "decide", prompt: "What makes the ASR training set robust?",
            options: [
              { label: "Diverse accents, background noise, mic types, and speaking speeds — matching real meeting conditions", best: true, feedback: "a model only ever learns to handle the conditions it sees in training, so coverage <i>is</i> robustness here. Spanning accents, SNR levels, and mics means the noisy 6 dB call and the heavy-accent speaker are in-distribution at test time instead of surprises. Matching your training distribution to real meeting conditions is the single biggest lever on production WER." },
              { label: "One narrator, studio-clean, single accent", feedback: "pristine audio produces a model that's excellent at exactly one thing you'll never ship to: a quiet studio with one familiar voice. The instant a real user joins from a noisy room with an accent the model never heard, WER explodes — the data is clean but the distribution is wrong, which is useless." },
              { label: "Audio with no transcripts; the model can figure it out", feedback: "ASR is supervised — the transcript is the target that teaches the sound-to-word mapping, and without it there's no signal for what was said. Unlabeled audio can help with self-supervised pretraining, but you still need paired transcripts to learn and to measure WER. Raw audio alone can't teach this task." }
            ] },
          { type: "run", label: "▶ Assemble audio + text corpora", result: { log: "ASR: 2,100 hours paired audio/transcript\naccents: US 44%, UK 18%, IN 14%, AU 9%, other 15%\nSNR range: 5-40 dB (includes noisy calls)\nMT: 12.4M en-es sentence pairs\nsample rate: 16 kHz", metrics: [{ k: "audio", v: "2,100 hrs" }, { k: "MT pairs", v: "12.4M" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore & clean",
        narrative: `<p>Audio data hides traps that text doesn't: mislabeled transcripts, clipped (saturated) recordings, dead silence, and the wrong language leaking in. A bad pair is worse than no pair — it actively teaches the model a wrong sound→text mapping. The most useful signal is the <b>audio-to-transcript length ratio</b>: a 10-second clip paired with a 2-word transcript is almost certainly misaligned, so you profile that ratio before featurizing.</p>`,
        concepts: ["mlx-error-analysis", "prob-normal"],
        insight: `<b>Length mismatch flags bad labels.</b> Across 2,100 hours, <b>2.4%</b> of pairs have an audio↔transcript length ratio off by more than 3× — almost always a misaligned or wrong transcript. Add <b>1.8%</b> empty/silent clips, <b>0.9%</b> clipped audio, and <b>0.3%</b> non-English leakage, and you drop <b>~5.1%</b> total before training. Mean utterance is <b>7.2s</b>, so at 100 frames/sec that's ~720 spectrogram frames per clip.`,
        data: {
          caption: "Profiling flags: which pairs to drop",
          columns: ["clip", "audio len", "transcript words", "ratio", "verdict"],
          rows: [
            ["clip_A", "8.0s", "21", "~normal", "keep"],
            ["clip_B", "10.0s", "2", ">3× off", "drop (misaligned)"],
            ["clip_C", "3.0s", "0", "silence", "drop (empty)"],
            ["clip_D", "5.0s", "14", "clipped audio", "drop (saturated)"]
          ],
          note: `A spoken utterance runs ~2–3 words/second, so the audio-seconds-to-words ratio has a tight normal range. Points far outside it are alignment errors, not real speech — filtering them protects the mapping the model learns.`
        },
        symbols: [
          { sym: "length ratio", desc: "audio duration divided by transcript word count; far-from-typical values flag misaligned or wrong labels." },
          { sym: "clipping", desc: "audio so loud it saturates the recording range, distorting the waveform; unusable for clean feature extraction." },
          { sym: "language ID", desc: "an automatic check of the spoken language; used to drop non-English clips that leaked into the English ASR set." }
        ],
        steps: [
          { type: "run", label: "▶ Profile the audio", result: { log: "scanning 2,100 hours...\nempty/silent clips: 1.8% (drop)\ntranscript-audio length mismatch > 3x: 2.4% (likely misaligned)\nclipped/saturated audio: 0.9%\nlanguage ID check: 0.3% non-English leaked in (drop)\nmean utterance: 7.2s", metrics: [{ k: "dropped", v: "5.1%" }, { k: "mean len", v: "7.2s" }] } },
          { type: "decide", prompt: "2.4% of pairs have a big audio↔transcript length mismatch. What is that, usually?",
            options: [
              { label: "Misaligned or wrong transcripts — filter or re-align them", best: true, feedback: "a 10-second clip with a 2-word transcript is a label error: either the alignment slipped or the wrong transcript got attached. Training on it teaches the model that 10 seconds of speech maps to 2 words, corrupting exactly the audio→text alignment it's trying to learn. Filtering or re-aligning these protects the supervised signal; the length ratio is the cheap detector for them." },
              { label: "Fine — keep them, more data is always better", feedback: "this confuses quantity with quality. A mislabeled pair doesn't add information, it adds <i>noise</i> pointing in a wrong direction, so it raises WER by confusing the alignment the model must learn. 'More data' only helps when the data is correct; garbage pairs make the model strictly worse." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Extract features (spectrograms)",
        narrative: `<p>Raw 16 kHz audio is 16,000 numbers per second — huge and hard to model directly. You convert it to a <b>log-mel spectrogram</b>: slide a short window (STFT) across the audio, measure energy in <b>mel</b> frequency bands (spaced like human hearing), and take the log to compress the dynamic range. The result is a small time-by-frequency image, <b>80 × T</b>, the standard front-end for speech models. SpecAugment then masks random time/frequency stripes during training for robustness.</p>`,
        concepts: ["dl-conv", "fnd-norm"],
        insight: `<b>16,000 samples/sec become 100 frames/sec × 80 bins.</b> With a 25ms window and 10ms hop, each second of audio yields <b>100</b> frames, each an <b>80</b>-value mel vector — a ~<b>200×</b> reduction versus raw samples, while keeping the frequency structure that distinguishes phonemes. The mel scale is roughly logarithmic in Hz (mimicking the ear), and per-feature mean/variance normalization centers each bin so optimization is stable. A 7.2s utterance → an 80 × 720 matrix.`,
        data: {
          caption: "Shape of a log-mel spectrogram (one clip)",
          columns: ["axis", "what it is", "size (7.2s clip)"],
          rows: [
            ["frequency (mel bins)", "energy per mel band", "80"],
            ["time (frames)", "10ms hop → 100/sec", "720"],
            ["value", "log-energy, normalized", "scalar per cell"],
            ["raw equivalent", "16 kHz samples", "115,200 (≈200× more)"]
          ],
          note: `The spectrogram is an 80 × 720 grid the model reads like an image. STFT window=25ms sets frequency resolution; hop=10ms sets the 100 frames/sec time resolution. SpecAugment masks random rows/columns so the model can't lean on any single band.`
        },
        symbols: [
          { sym: "STFT", desc: "short-time Fourier transform — slides a window over the audio and gives the frequency content in each window." },
          { sym: "mel bins", desc: "the 80 frequency bands, spaced ~logarithmically to match human pitch perception; the spectrogram's rows." },
          { sym: "$T$", desc: "number of time frames = audio seconds × 100 (10ms hop); the spectrogram's variable width." },
          { sym: "log", desc: "applied to mel energies to compress dynamic range so quiet and loud sounds are both represented well." }
        ],
        steps: [
          { type: "run", label: "▶ Compute log-mel spectrograms", result: { log: "STFT window 25ms, hop 10ms...\nmel filterbanks: 80\nframes / second: 100\nper-feature mean/variance normalization applied\noutput: 80 x T feature matrices\nSpecAugment (time/freq masking) enabled for training", metrics: [{ k: "mel bins", v: "80" }, { k: "frame rate", v: "100/s" }] } },
          { type: "decide", prompt: "Why log-mel spectrograms instead of the raw waveform?",
            options: [
              { label: "They compactly encode the frequency content humans hear, shrinking the input and exposing speech structure", best: true, feedback: "the mel scaling mimics human hearing and the log compresses dynamic range, so the model sees a clean ~80×T time-frequency image where phonemes are visible as patterns — instead of 16,000 raw samples per second with the structure buried. That ~200× shrink cuts compute and gives convolution/attention a representation where speech structure is already exposed. It's the practical default for exactly these reasons." },
              { label: "Raw waveforms are illegal to use", feedback: "nothing is illegal here — end-to-end waveform models (e.g. wav2vec-style) genuinely exist and work. The real reason spectrograms dominate is practical: waveform models need far more data and compute to learn the frequency analysis that the STFT hands you for free. Spectrograms are the efficient default, not a legal requirement." }
            ] }
        ]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick the architecture",
        narrative: `<p>ASR maps a variable-length spectrogram (~720 frames) to a much shorter word sequence (~20 words), and the alignment between them is unknown. Three ways to bridge that gap: <b>CTC</b> sums over all possible frame-to-token alignments so you need no hand-built alignment; a classic <b>HMM</b> models phoneme states with explicit transition probabilities; or an attention <b>seq2seq</b> encoder-decoder learns, for each output word, which input frames to look at. MT is a clean transformer seq2seq.</p>`,
        concepts: ["dl-attention", "mod-transformer", "dl-lstm-gru", "ai-hmm"],
        insight: `<b>The core problem is alignment: 720 frames → ~20 words.</b> Attention solves it by computing, for each output token, a softmax distribution over all input frames — effectively learning the alignment instead of hand-building it. CTC solves the same mismatch by marginalizing over alignments with a blank symbol. Both beat the classic HMM-GMM pipeline substantially on WER, and transformers are state-of-the-art for both halves, so one architecture family covers ASR and MT.`,
        data: {
          caption: "Three ASR architectures vs. the alignment problem",
          columns: ["architecture", "how it aligns frames→words", "variable length?", "modern WER"],
          rows: [
            ["attention seq2seq", "learned soft attention", "yes", "best"],
            ["CTC", "marginalize over alignments + blank", "yes", "strong"],
            ["HMM-GMM", "explicit state transitions", "yes", "weaker (legacy)"],
            ["fixed feed-forward", "can't — needs fixed size", "no", "unusable"]
          ],
          note: `Attention weight for output word $w$ over frame $f$ is $\\alpha_{w,f}=\\text{softmax}$ of a match score; high $\\alpha$ means word $w$ listens to frame $f$. This learned alignment is why seq2seq/CTC replaced hand-tuned HMM states.`
        },
        symbols: [
          { sym: "$\\alpha_{w,f}$", desc: "attention weight: how much output word $w$ attends to input frame $f$; the learned soft alignment, summing to 1 over frames." },
          { sym: "CTC", desc: "connectionist temporal classification — a loss that sums over all valid frame-to-token alignments using a blank token, so no manual alignment is needed." },
          { sym: "seq2seq", desc: "an encoder reads the spectrogram, a decoder emits words one at a time, attending back to the encoder." },
          { sym: "HMM", desc: "hidden Markov model — the classic approach modeling phoneme states with explicit transition/emission probabilities." }
        ],
        steps: [{
          type: "decide", prompt: "Choose the ASR + MT backbone.",
          options: [
            { label: "Attention-based encoder-decoder (or CTC) transformer for ASR, and a transformer seq2seq for MT", best: true, feedback: "attention directly solves the central difficulty — aligning ~720 variable input frames to ~20 output words — by letting each emitted word learn which frames to listen to, with no hand-built alignment. CTC is an equally valid alignment-free alternative. Transformers are state-of-the-art for both recognition and translation, so this single family handles the whole cascade and benefits from shared tooling." },
            { label: "A fixed-input feed-forward net that reads the whole clip at once", feedback: "a fixed-size net requires a fixed-length input, but utterances range from 1 to 20+ seconds, so you'd have to pad or truncate every clip — destroying timing information. It also has no mechanism to model temporal order or the variable-length output. Speech is inherently sequential and variable-length; a fixed feed-forward net simply can't represent it." },
            { label: "Pure HMM with hand-tuned phoneme states only", feedback: "HMM-GMM pipelines are historically important and instructive, but neural seq2seq/CTC models now beat them substantially on WER because they learn alignment and acoustics end-to-end instead of relying on hand-engineered phoneme states. You'd be choosing a legacy approach that's measurably worse on the exact metric you're optimizing." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train the models",
        narrative: `<p>You train the two stages separately. ASR minimizes a CTC or cross-entropy loss over (spectrogram → text); MT minimizes cross-entropy over (English tokens → Spanish tokens). At each output step a <b>softmax</b> over the vocabulary gives the next-token probabilities, and the loss rewards putting mass on the correct token. SpecAugment stays on for ASR so the model trains on masked spectrograms and generalizes to noisy audio.</p>`,
        concepts: ["dl-cross-entropy", "ml-softmax", "dl-optimizers"],
        insight: `<b>Both curves move the right way.</b> ASR dev WER falls <b>18.1% → 12.7% → 11.3%</b> and early-stops; MT dev BLEU climbs <b>33.4 → 38.9 → 41.2</b>. Note the metrics move in <i>opposite directions</i> by design — WER down is good, BLEU up is good — because they measure error vs. overlap. Each output token is a softmax over the vocab, and cross-entropy $-\\log p(\\text{true token})$ is the per-step loss being driven down.`,
        data: {
          caption: "Two training curves, two metrics, two directions",
          columns: ["stage", "metric", "early → late", "good direction"],
          rows: [
            ["ASR", "dev WER", "18.1% → 11.3%", "↓ lower"],
            ["MT", "dev BLEU", "33.4 → 41.2", "↑ higher"],
            ["both", "cross-entropy loss", "decreasing", "↓ lower"],
            ["ASR", "stop signal", "WER plateau @ epoch 12", "early stop"]
          ],
          note: `Softmax at step $t$: $p_t = \\text{softmax}(z_t)$ over the vocabulary; cross-entropy loss is $-\\log p_t(\\text{correct token})$. WER and BLEU are evaluation metrics computed on dev audio, not the training loss itself.`
        },
        symbols: [
          { sym: "softmax", desc: "turns the decoder's logits $z_t$ into a probability distribution over the vocabulary at each output step $t$." },
          { sym: "cross-entropy", desc: "$-\\log p_t(\\text{correct token})$ summed over steps; the loss that trains both ASR and MT." },
          { sym: "dev WER / BLEU", desc: "word error rate and BLEU measured on a held-out development set each epoch; the curves you early-stop on." }
        ],
        steps: [{
          type: "run", label: "▶ Train ASR + MT",
          result: { log: "training ASR encoder-decoder (SpecAugment on)...\nepoch 4  dev WER 18.1%\nepoch 8  dev WER 12.7%\nepoch 12 dev WER 11.3%  (early stop)\ntraining MT transformer...\ndev BLEU 33.4 -> 38.9 -> 41.2", metrics: [{ k: "dev WER", v: "11.3%" }, { k: "dev BLEU", v: "41.2" }],
            chart: { type: "line", title: "ASR WER down, MT BLEU up over training", xlabel: "epoch", ylabel: "WER (percent) and BLEU (points)", series: [
              { name: "ASR dev WER %", color: "#ff7b72", points: [[4, 18.1], [8, 12.7], [12, 11.3]] },
              { name: "MT dev BLEU", color: "#7ee787", points: [[4, 33.4], [8, 38.9], [12, 41.2]] }
            ] } } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate end-to-end",
        narrative: `<p>The pipeline is a <b>cascade</b>: ASR feeds MT, so errors compound — a single wrong word in the transcript becomes a wrong word the translator faithfully translates. You therefore evaluate three things: ASR alone (WER), MT alone on <i>gold</i> transcripts (its ceiling), and the full chain end-to-end (MT on real ASR output). The gap between MT-on-gold and end-to-end BLEU is exactly the damage ASR injects — the most actionable number you have.</p>`,
        concepts: ["ml-classification-metrics", "mlx-error-analysis", "dl-attention"],
        insight: `<b>The cascade loses 7.3 BLEU to upstream WER.</b> MT on perfect transcripts scores BLEU <b>41.0</b>, but end-to-end (MT fed real ASR output) drops to <b>33.7</b> — that 7.3-point gap is pure ASR error propagating downstream. And the WER damage is concentrated: <b>9.8%</b> on clean audio but <b>21.6%</b> on noisy (SNR &lt;15 dB). The weakest stage caps the system, so the lever is upstream noisy-audio WER, not the already-strong translator.`,
        data: {
          caption: "Stage-by-stage evaluation (held-out: 20 hrs, 11K utterances)",
          columns: ["measured on", "metric", "value", "read"],
          rows: [
            ["ASR, clean audio", "WER", "9.8%", "good"],
            ["ASR, noisy SNR&lt;15dB", "WER", "21.6%", "⚠ the bottleneck"],
            ["MT, gold transcripts", "BLEU", "41.0", "translator ceiling"],
            ["end-to-end (ASR→MT)", "BLEU", "33.7", "−7.3 from cascade"]
          ],
          note: `End-to-end BLEU < MT-on-gold BLEU because ASR errors enter the translator's input. The 7.3-point drop is the cost of the cascade, and it's dominated by the 21.6% noisy WER — fix that and the gap shrinks.`
        },
        symbols: [
          { sym: "cascade", desc: "two stages in series (ASR → MT); the second consumes the first's output, so upstream errors propagate downstream." },
          { sym: "MT-on-gold BLEU", desc: "translation quality given perfect transcripts; the translator's ceiling, isolating it from ASR error." },
          { sym: "end-to-end BLEU", desc: "translation quality on real ASR output; the actual user-facing number, lower than the ceiling by the propagated error." }
        ],
        steps: [
          { type: "run", label: "▶ Evaluate the full pipeline", result: { log: "held-out: 20 hours, 11,000 utterances\nASR WER (clean): 9.8%\nASR WER (noisy, SNR<15dB): 21.6%\nMT BLEU (on gold transcripts): 41.0\nEnd-to-end BLEU (on ASR output): 33.7  (cascaded loss)\nlatency: 1.9s avg", metrics: [{ k: "WER noisy", v: "21.6% ⚠" }, { k: "e2e BLEU", v: "33.7" }],
            chart: { type: "bars", title: "Clean vs noisy WER, and the cascade BLEU drop", labels: ["WER clean", "WER noisy", "BLEU on gold", "BLEU end-to-end"], values: [9.8, 21.6, 41.0, 33.7], valueLabels: ["9.8%", "21.6%", "41.0", "33.7"], colors: ["#7ee787", "#ff7b72", "#4ea1ff", "#ffb454"] } } },
          { type: "decide", prompt: "End-to-end BLEU (33.7) is well below MT-on-gold BLEU (41.0). Why, and what's the lesson?",
            options: [
              { label: "ASR errors propagate into MT — fix the upstream WER, especially on noisy audio, to lift the whole chain", best: true, feedback: "in a cascade the weakest stage caps the system: the translator is already strong (41.0 on gold) but it can only translate the words ASR hands it, so every transcription error becomes a translation error. The 7.3 BLEU gap is almost entirely the 21.6% noisy WER bleeding through. Lowering upstream WER — especially on noisy audio — directly recovers downstream BLEU, which is why you target ASR, not MT." },
              { label: "BLEU and WER aren't comparable, so ignore the gap", feedback: "the gap is between two BLEU numbers — MT-on-gold (41.0) and end-to-end (33.7) — both BLEU, perfectly comparable, and their difference precisely isolates the error ASR injects. Far from being noise to ignore, it's the single most actionable signal you have: it quantifies exactly how much downstream quality you'd recover by improving the transcripts." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>Error analysis slices WER by condition and pins the damage: clean audio is fine (9.8%) but noisy/accented audio is nearly <b>2.2×</b> worse (21.6%). The training set was thin on exactly those conditions, so this is a <b>data gap</b>, not a model-capacity gap — a bigger model can't learn what it never saw. The fix is targeted data plus augmentation that <i>synthesizes</i> the missing conditions from the audio you have.</p>`,
        concepts: ["mlx-error-analysis", "dl-data-augmentation", "ml-bias-variance"],
        insight: `<b>WER more than doubles where data is thin.</b> 9.8% clean vs <b>21.6%</b> noisy is a 2.2× gap that tracks training coverage, not model size. Augmentation cheaply fills it: <b>noise injection</b> mixes background sounds into clean clips, <b>speed perturbation</b> resamples to ±10% rate, and <b>SpecAugment</b> masks spectrogram stripes — each turns one clean clip into many noisy/varied training examples without new labeling.`,
        data: {
          caption: "WER by condition, and the augmentation that targets it",
          columns: ["condition", "WER now", "data coverage", "augmentation"],
          rows: [
            ["clean (SNR≥30)", "9.8%", "plentiful", "—"],
            ["noisy (SNR&lt;15)", "21.6%", "thin", "noise injection"],
            ["fast/accented", "elevated", "thin", "speed perturb"],
            ["all", "—", "—", "SpecAugment masks"]
          ],
          note: `Augmentation manufactures the under-covered conditions from existing labeled audio: inject noise to simulate calls, perturb speed for rate variation, mask spectrogram bands so the model can't over-rely on any one. A data gap fixed with data, not parameters.`
        },
        chart: { type: "bars", title: "WER by condition (% — where data is thin)", labels: ["clean (SNR 30+)", "noisy (SNR under 15)", "fast / accented"], values: [9.8, 21.6, 17.5], valueLabels: ["9.8%", "21.6%", "~17.5%"], colors: ["#7ee787", "#ff7b72", "#ffb454"] },
        symbols: [
          { sym: "data gap", desc: "a condition (noisy/accented audio) underrepresented in training; error there is high bias the model can't fix without more such data." },
          { sym: "noise injection", desc: "augmentation that adds background sound to clean clips to synthesize low-SNR training examples." },
          { sym: "speed perturbation", desc: "resampling audio to ±10% speed to cover varied speaking rates without new recordings." },
          { sym: "SpecAugment", desc: "masking random time/frequency stripes of the spectrogram so the model learns robust, redundant features." }
        ],
        steps: [{
          type: "decide", prompt: "Noisy/accented audio drives most errors. Best fix?",
          options: [
            { label: "Add more noisy & accented training audio and augment (noise injection, speed perturb, SpecAugment)", best: true, feedback: "the error analysis says the model fails specifically where its training data was thin, which is the definition of a data gap. Collecting more noisy/accented audio fills it directly, and augmentation multiplies what you have — injecting noise and perturbing speed manufactures the missing conditions from clean clips for almost no cost. You're teaching robustness exactly where WER is high, the precise lever the diagnosis points to." },
            { label: "Make the model 4x bigger", feedback: "more capacity can't conjure conditions absent from the data — a larger model will just fit the abundant clean speech even better while still flailing on noisy audio it has barely seen. You'd pay 4× the compute and serving cost to overfit the easy case. The bottleneck is coverage, not parameters." },
            { label: "Lower BLEU's brevity penalty", feedback: "this changes the scoreboard, not the system — the transcripts are genuinely wrong on noisy audio, and tweaking a metric's penalty just hides that rather than fixing it. Worse, the brevity penalty is part of MT scoring and has nothing to do with the upstream ASR WER that's actually causing the loss. It's measuring-tape manipulation, not engineering." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy for low latency",
        narrative: `<p>A meetings app needs captions that appear <i>as people speak</i>, which fights the model's accuracy. A full-utterance model sees the whole sentence before deciding — most accurate, but it can't emit a word until the speaker stops. <b>Streaming</b> ASR instead processes short audio chunks and emits partial captions immediately, optionally with a small <b>look-ahead</b> (peeking a few hundred ms into the future) to recover accuracy. The design choice is how much accuracy you trade for responsiveness.</p>`,
        concepts: ["dl-lstm-gru", "mod-transformer"],
        insight: `<b>Streaming costs only 0.8 WER for live captions.</b> Offline WER is <b>11.3%</b>; streaming with a short look-ahead is <b>12.1%</b> — a tiny 0.8-point penalty for the difference between captions that appear in <b>~380ms</b> versus after the speaker finishes. The look-ahead window is the knob: more look-ahead recovers accuracy but adds latency, so you tune it to the smallest window that keeps WER close to offline.`,
        data: {
          caption: "Streaming vs. offline: the latency/accuracy trade",
          columns: ["mode", "emits caption", "WER", "p99 latency"],
          rows: [
            ["offline (full utterance)", "after speaker stops", "11.3%", "seconds"],
            ["streaming + look-ahead", "as you speak", "12.1%", "910ms"],
            ["streaming, no look-ahead", "fastest", "higher", "lowest"],
            ["canary 5%", "live test", "monitored", "guarded"]
          ],
          note: `Look-ahead lets the model peek slightly ahead before committing a word, recovering most of the offline accuracy. The 0.8-WER gap is the price of going live; the canary at 5% means a bad model disrupts few meetings.`
        },
        symbols: [
          { sym: "streaming ASR", desc: "processes audio in short chunks and emits partial captions immediately, instead of waiting for the full utterance." },
          { sym: "look-ahead window", desc: "a few hundred ms of future audio the model may peek at before committing a word; trades latency for accuracy." },
          { sym: "p99 latency", desc: "99th-percentile time from speech to displayed caption; the tail users notice in a live meeting." }
        ],
        steps: [
          { type: "decide", prompt: "How do you serve it responsively?",
            options: [
              { label: "Streaming/chunked ASR emitting partial captions, with a short look-ahead window, on GPU, canary first", best: true, feedback: "streaming is what makes live captions possible — chunked processing emits words within ~380ms instead of after the sentence ends, and a small look-ahead buys back nearly all the accuracy (12.1% vs 11.3% WER) for a modest latency cost. Running on GPU keeps the per-chunk compute fast enough to stay real-time, and the 5% canary means a regression disrupts a handful of meetings rather than all of them." },
              { label: "Wait for the speaker to finish the whole talk, then transcribe", feedback: "full-utterance transcription is marginally more accurate but fundamentally wrong for the product: captions that appear only after someone stops talking — potentially minutes for a long monologue — are useless for following a live conversation. The whole point of a meetings caption is to track speech in real time, which requires emitting incrementally." }
            ] },
          { type: "run", label: "▶ Deploy streaming (canary 5% → 100%)", result: { log: "deploying streaming ASR + MT v2...\ncanary 5%: partial-caption latency p50 380ms, p99 910ms\nstreaming WER vs offline: 12.1% vs 11.3% (small gap)\nGPU util: 64%\npromoting to 100% ... live.", metrics: [{ k: "p99 caption", v: "910ms" }, { k: "streaming WER", v: "12.1%" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain (MLOps)",
        narrative: `<p>Acoustic conditions and vocabulary shift over time — new product names, cheaper headsets, new accents in the user base. You monitor four layers: <b>input drift</b> (SNR/accent distribution, out-of-vocabulary rate), <b>output quality</b> (WER/BLEU on a sampled set with human references), the <b>system</b> (caption latency), and <b>outcomes</b> (how often users edit a caption). The user edit rate is the cheapest real-world quality signal, since every correction is a label-free vote that the caption was wrong.</p>`,
        concepts: ["mlx-error-analysis", "ml-classification-metrics", "prob-normal"],
        insight: `<b>A new product name spikes WER through OOV.</b> The word 'Helio' launches and, being out-of-vocabulary, gets transcribed as 'helium'/'hello' — sampled WER jumps <b>12.1% → 15.4%</b>. At the same time cheap headsets push input SNR down (an acoustic drift), and the <b>user edit rate</b> climbs <b>6% → 11%</b>, confirming the quality drop from the outcome side. Both signals route you back to the Data stage for fresh vocabulary and headset audio.`,
        data: {
          caption: "This week's monitors (four layers)",
          columns: ["monitor", "layer", "reading", "trigger"],
          rows: [
            ["OOV rate", "input", "'Helio' → 'helium'/'hello'", "drift"],
            ["sampled WER", "output", "12.1% → 15.4%", "ALERT"],
            ["input SNR dist.", "input", "lower (cheap headsets)", "acoustic drift"],
            ["user edit rate", "outcome", "6% → 11%", "confirming signal"]
          ],
          note: `OOV (out-of-vocabulary) words the model never trained on are transcribed as the nearest known word — a leading cause of WER spikes after a launch. The user edit rate confirms from the outcome side without needing reference transcripts.`
        },
        symbols: [
          { sym: "OOV rate", desc: "fraction of spoken words absent from the model's vocabulary (e.g. a new product name); a leading cause of post-launch WER spikes." },
          { sym: "acoustic drift", desc: "a shift in input audio statistics (SNR, mic type, accent) away from the training distribution." },
          { sym: "user edit rate", desc: "fraction of captions users manually correct; a cheap, reference-free outcome signal that quality slipped." }
        ],
        steps: [
          { type: "decide", prompt: "What goes on the production dashboard?",
            options: [
              { label: "Audio SNR/accent drift, sampled WER & BLEU against human references, out-of-vocab rate, caption latency, and user edit rate — with alerts", best: true, feedback: "this covers all four layers, and each catches a distinct failure: SNR/accent drift and OOV rate flag when the input distribution moves (new hardware, new product names), sampled WER/BLEU confirm whether quality actually dropped, latency guards the live-caption SLO, and the user edit rate is the ground-truth outcome that needs no references. Alerts on these turn the dashboard into the retrain loop instead of a postmortem." },
              { label: "Just GPU temperature", feedback: "hardware telemetry tells you the server is healthy, not that the captions are correct — WER could climb from 12.1% to 15.4% after a product launch with the GPU running perfectly cool. A quality regression driven by OOV words or noisier headsets would be completely invisible here, and you'd hear about it from frustrated users editing captions instead of from an alert." }
            ] },
          { type: "run", label: "▶ Check this week's monitors", result: { log: "OOV spike: new product 'Helio' transcribed as 'helium'/'hello'\nsampled WER (7d): 12.1% -> 15.4%  ALERT\nnew device class (cheap headsets) -> lower SNR inputs\nuser caption-edit rate: 6% -> 11%\naction: add 'Helio' + headset audio to data, retrain", metrics: [{ k: "WER", v: "15.4% ⚠" }, { k: "edit rate", v: "11%" }] }, note: `The loop closes here: a new product name and noisier hardware drove WER up, and monitoring caught it through the rising edit rate — sending you back to the <b>Data</b> stage. That's the real job.` }
        ]
      }
    ]
  },

  "image-generation": {
    title: "Image Generation (Diffusion)",
    icon: "🎨",
    goal: "Train a text-to-image diffusion model that produces sharp, on-prompt product imagery — and ship it safely.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Frame the problem",
        narrative: `<p>You're building a text-to-image generator for a design tool, where there is no single "correct" output — many images satisfy "a red sports car at sunset." That breaks any pixel-matching metric, so you measure three things instead. <b>FID</b> (Fréchet Inception Distance) compares the <i>distribution</i> of generated images to real ones (lower = more realistic). <b>CLIP score</b> checks the image matches the prompt. And human preference catches what both metrics miss. The framing decision is committing to all three.</p>`,
        concepts: ["mod-diffusion", "prob-normal"],
        insight: `<b>No single right image — so measure distributions.</b> Pixel accuracy is meaningless because a prompt has infinitely many valid outputs. FID sidesteps this by comparing distributions: it fits a Gaussian to deep features of real vs generated images and measures the distance between them (FID <b>0</b> = identical distributions; good models land around <b>10–15</b>). CLIP score measures prompt alignment via image-text cosine similarity (~<b>0.25–0.30</b> is well-aligned). Humans break ties the metrics can't.`,
        data: {
          caption: "Three generative metrics — what each one measures",
          columns: ["metric", "measures", "good value", "blind spot"],
          rows: [
            ["FID", "image realism (distribution)", "≈ 10–15 (lower)", "per-prompt correctness"],
            ["CLIP score", "image↔prompt alignment", "≈ 0.25–0.30 (higher)", "fine detail / realism"],
            ["human preference", "overall quality", "> 50% win vs baseline", "slow, costly"],
            ["pixel accuracy", "—", "useless here", "no single target"]
          ],
          note: `FID $=\\lVert\\mu_r-\\mu_g\\rVert^2+\\text{Tr}(\\Sigma_r+\\Sigma_g-2(\\Sigma_r\\Sigma_g)^{1/2})$ over Inception features. Each metric has a blind spot, which is why you report all three rather than trusting one green number.`
        },
        symbols: [
          { sym: "FID", desc: "Fréchet Inception Distance — Wasserstein distance between Gaussians fit to deep features of real vs generated images; 0 = identical, lower is better." },
          { sym: "$\\mu_r,\\Sigma_r$", desc: "mean and covariance of Inception features for real images (and $\\mu_g,\\Sigma_g$ for generated); FID compares these." },
          { sym: "CLIP score", desc: "cosine similarity between an image embedding and its prompt embedding from CLIP; higher means better prompt alignment." }
        ],
        steps: [{
          type: "decide", prompt: "Which evaluation set fits a generative image model?",
          options: [
            { label: "FID for image realism, a CLIP score for prompt alignment, and a human preference rate", best: true, feedback: "the three cover three distinct axes: FID asks 'do generated images look like real ones at the distribution level', CLIP score asks 'does this specific image match its prompt', and human preference catches the things metrics miss (weird hands, aesthetic appeal). Each has a blind spot the others fill, so reporting all three is what keeps a good FID from rubber-stamping a model that ignores prompts. You need the full set." },
            { label: "Pixel-wise accuracy against a single target image", feedback: "generation is one-to-many: 'a cat on a sofa' has countless valid renderings that share no pixels, so comparing against one target image punishes perfectly good outputs for not being identical to an arbitrary reference. The whole premise of a single correct image is wrong for synthesis — this metric simply doesn't apply." },
            { label: "Classification accuracy", feedback: "accuracy presumes a labeling task with right/wrong answers, but you're synthesizing pixels, not assigning a class. There is no label to be correct or incorrect about, so classification accuracy has nothing to measure here — it's a metric from the wrong family of problems." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather image-text pairs",
        narrative: `<p>Text-to-image learns from <b>(image, caption)</b> pairs — the caption is the text condition, the image is the target. Three properties of the pairs set hard ceilings: <b>caption accuracy</b> determines how well the model can follow prompts, <b>resolution</b> caps the detail it can ever produce, and <b>licensing</b> determines whether you can legally ship it. A model is only as good as its pairs, so all three are sourcing requirements, not nice-to-haves.</p>`,
        concepts: ["mod-contrastive", "dl-word-embeddings"],
        insight: `<b>Caption source quality varies widely.</b> Of <b>18.0M</b> pairs, captions come from alt-text (<b>60%</b>, noisy/SEO-spammy), humans (<b>25%</b>, clean but expensive), and auto-captioning (<b>15%</b>). The human 25% teaches prompt alignment best; the alt-text 60% is volume with mixed accuracy. Resolution matters as a hard ceiling — <b>91%</b> are ≥512px because you cannot generate detail finer than the training images. A safety filter removed 240K NSFW/violent images.`,
        data: {
          caption: "What one image-caption training pair looks like",
          columns: ["field", "example", "source", "quality"],
          rows: [
            ["image", "studio_chair_07.jpg (768²)", "licensed stock", "high"],
            ["caption", "\"a walnut mid-century lounge chair\"", "human", "clean"],
            ["caption (alt)", "\"chair buy now best price 2024\"", "alt-text", "noisy"],
            ["license", "CC-BY / purchased", "—", "shippable"]
          ],
          note: `The model maps caption → image, so a clean human caption teaches precise prompt-following while SEO alt-text teaches noise. Resolution is a ceiling: a 64px thumbnail can never train a sharp 512px output.`
        },
        symbols: [
          { sym: "(image, caption)", desc: "one training pair; the caption is the text condition, the image is the target the model learns to generate." },
          { sym: "resolution ceiling", desc: "the max output detail is bounded by the training images' resolution — you can't generate detail that was never present." },
          { sym: "caption source", desc: "where a caption came from (alt-text / human / auto); determines its accuracy and thus how well the model follows prompts." }
        ],
        steps: [
          { type: "decide", prompt: "What matters most when sourcing image-caption pairs?",
            options: [
              { label: "Licensed, high-resolution images with accurate captions covering your product domain", best: true, feedback: "the three properties set three independent ceilings: accurate captions are the only way the model learns to follow prompts (the caption is literally the conditioning signal), resolution caps the detail it can ever generate, and licensing is what lets you ship without legal exposure. Domain coverage ensures it's good at <i>your</i> product imagery specifically. Miss any one and you've capped the model before training starts — all three are non-negotiable." },
              { label: "Any images scraped from the web, captions optional", feedback: "two fatal problems: missing or garbage captions break text conditioning, because the model has no clean signal linking words to pixels and learns to ignore the prompt; and unlicensed scraping is a legal and ethical landmine that can sink the whole product. 'Captions optional' guts the one thing that makes it text-to-image." },
              { label: "Tiny thumbnails, since they train faster", feedback: "resolution is a hard ceiling, not a speed knob — a model trained on 64px thumbnails can never produce sharp 512px detail because that detail was never in the data to learn. You'd permanently cap output quality to save some training time, which defeats the purpose of a generator people use for real design work." }
            ] },
          { type: "run", label: "▶ Assemble the dataset", result: { log: "collecting licensed image-caption pairs...\npairs: 18.0M\nresolution: >=512px 91%\ncaption source: alt-text 60%, human 25%, auto-captioned 15%\nNSFW/violence filter removed: 240,000\nde-duplicated near-identical images: 1.1M", metrics: [{ k: "pairs", v: "18.0M" }, { k: "≥512px", v: "91%" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore & clean",
        narrative: `<p>Generative models faithfully reproduce whatever <i>recurs</i> in training, so junk that appears consistently becomes a learned feature. Watermarks, broken aspect ratios, and caption-image mismatches are the big three. The mismatch check uses <b>CLIP</b> itself: embed the image and caption, take their cosine similarity, and drop pairs that score low (the caption doesn't describe the image). What you leave in, the model will draw.</p>`,
        concepts: ["mlx-error-analysis", "prob-normal"],
        insight: `<b>6.2% watermarked = a model that draws watermarks.</b> Because diffusion reproduces recurring patterns, leaving the <b>6.2%</b> watermarked images in teaches the model that a faint logo in the corner is part of "what an image looks like" — and it will paint fake watermarks on outputs. Separately, <b>4.7%</b> of pairs have a CLIP image-caption similarity below 0.18 (the caption is wrong) and get dropped, plus 2.1% aspect-ratio outliers and a warm color bias to correct.`,
        data: {
          caption: "Dataset profiling flags and why each matters",
          columns: ["flag", "share", "what the model would learn", "action"],
          rows: [
            ["watermarks", "6.2%", "paint watermarks on outputs", "filter out"],
            ["caption mismatch (CLIP&lt;0.18)", "4.7%", "wrong word→pixel links", "drop pair"],
            ["aspect-ratio outliers", "2.1%", "distorted compositions", "crop/bucket"],
            ["warm color bias", "—", "everything tinted warm", "rebalance"]
          ],
          note: `The mismatch detector reuses CLIP: cosine similarity between image and caption embeddings; low score = the caption doesn't match. Every recurring artifact left in the data is a feature the diffusion model will dutifully reproduce.`
        },
        symbols: [
          { sym: "CLIP similarity", desc: "cosine similarity between CLIP's image and text embeddings; high = caption matches image, low (&lt;0.18) = mismatch to drop." },
          { sym: "recurring pattern", desc: "any consistent artifact (watermark, tint) in the data; diffusion models learn and regenerate these as if they were content." },
          { sym: "aspect-ratio bucket", desc: "grouping images by shape so the model trains on consistent dimensions instead of distorting outliers." }
        ],
        steps: [
          { type: "run", label: "▶ Profile the dataset", result: { log: "scanning pairs...\nwatermarked images: 6.2% (model would learn to draw watermarks!)\ncaption-image CLIP mismatch (<0.18): 4.7% (drop)\naspect-ratio outliers (panoramas): 2.1%\nduplicated stock photos skewing the distribution: detected\ncolor profile: warm-biased", metrics: [{ k: "watermarked", v: "6.2%" }, { k: "mismatch", v: "4.7%" }] } },
          { type: "decide", prompt: "6.2% of images carry watermarks. Why care for a generator?",
            options: [
              { label: "The model learns watermarks as a 'feature' and paints them onto outputs — filter them out", best: true, feedback: "diffusion models learn the distribution of their training pixels, and a watermark that appears in 6.2% of images is a strong, consistent pattern — strong enough that the model treats 'faint logo in the corner' as part of what an image should contain, and reproduces it on clean prompts. Filtering them out removes the pattern at the source. Anything that recurs in the data recurs in the outputs." },
              { label: "Harmless — watermarks are just pixels", feedback: "they're not random pixels — they're a <i>consistent</i> pattern in a fixed location across millions of images, which is exactly the kind of regularity a generative model is built to memorize and reproduce. Left in, those pixels resurface as fake watermarks degrading every output, the opposite of harmless. Consistency is what makes them dangerous." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Latents & conditioning",
        narrative: `<p>Running diffusion on raw pixels is brutally expensive — a 512×512×3 image is ~786K numbers per step, times hundreds of steps. <b>Latent diffusion</b> fixes this: a <b>VAE</b> (variational autoencoder) compresses each image into a small <b>latent</b> grid, the diffusion model does all its work there, and the VAE decoder reconstructs pixels at the end. The text prompt is encoded separately into an embedding that <i>conditions</i> the denoiser — that's the text-to-image link.</p>`,
        concepts: ["mod-vae", "mod-autoencoder", "mod-contrastive"],
        insight: `<b>A 48× compression makes diffusion affordable.</b> The VAE encodes a <b>512×512×3</b> image (786,432 values) into a <b>64×64×4</b> latent (16,384 values) — a <b>~48×</b> shrink — with almost no visible quality loss because images are highly redundant. Diffusing in that compact space cuts per-step compute by the same factor, which is exactly why latent diffusion is the default. The latent adds no resolution; the decoder restores the original 512×512.`,
        data: {
          caption: "Pixel space vs. VAE latent space",
          columns: ["space", "shape", "# values", "diffusion cost"],
          rows: [
            ["raw pixels", "512 × 512 × 3", "786,432", "very high"],
            ["VAE latent", "64 × 64 × 4", "16,384", "~48× cheaper"],
            ["decoded output", "512 × 512 × 3", "786,432", "(decoder, once)"],
            ["text condition", "prompt embedding", "—", "guides denoiser"]
          ],
          note: `The diffusion model never touches pixels — it denoises the 64×64×4 latent, and the decoder runs once at the end. The win is pure efficiency: same output resolution, a fraction of the compute. Resolution comes from the decoder, not the latent.`
        },
        chart: { type: "scatter", title: "VAE latent space (2D projection of image codes)", xlabel: "latent dim 1", groups: [
          { name: "chairs", color: "#4ea1ff", points: [[-2.4, 1.8], [-2.1, 2.3], [-2.8, 1.4], [-1.9, 1.6], [-2.5, 2.6], [-3.0, 2.0]] },
          { name: "lamps", color: "#ffb454", points: [[1.9, -1.4], [2.4, -1.0], [1.6, -1.9], [2.7, -1.6], [2.1, -2.2], [1.4, -1.2]] },
          { name: "tables", color: "#7ee787", points: [[0.2, 2.6], [0.6, 3.0], [-0.3, 2.9], [0.9, 2.4], [0.1, 3.3], [-0.6, 2.7]] }
        ] },
        symbols: [
          { sym: "VAE", desc: "variational autoencoder; its encoder compresses an image to a latent, its decoder reconstructs pixels from a latent." },
          { sym: "latent $z$", desc: "the compact code (here 64×64×4) the diffusion model operates on instead of raw pixels; ~48× smaller." },
          { sym: "conditioning", desc: "the prompt embedding fed into the denoiser at every step so generation follows the text." },
          { sym: "decoder", desc: "the VAE half that maps a finished latent back to a full-resolution image; where output detail is restored." }
        ],
        steps: [{
          type: "decide", prompt: "Why train the diffusion model in VAE latent space?",
          options: [
            { label: "Latents are much smaller, so training and sampling are far cheaper with little quality loss", best: true, feedback: "the VAE compresses a 786K-value image into a 16K-value latent (~48×) by exploiting how redundant natural images are, so the diffusion model denoises a far smaller tensor at every one of its hundreds of steps. That cuts both training and sampling compute by roughly the compression factor, with quality loss small enough to be invisible after decoding. This efficiency is the entire reason latent diffusion replaced pixel-space diffusion as the default." },
            { label: "Latent space makes images higher-resolution for free", feedback: "the latent is a compressed code, not a super-resolution trick — the decoder reconstructs exactly the original 512×512, no more. Output detail is bounded by the VAE and the training data, not conjured by the latent. The win is compute efficiency; resolution is unchanged." },
            { label: "It removes the need for any text conditioning", feedback: "the VAE handles only the image half (compress/reconstruct); it does nothing for the text-to-image link. You still encode the prompt and feed that embedding into the denoiser at every step — without conditioning the model would generate plausible images that ignore the prompt entirely. Latents and conditioning are separate mechanisms." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick the generator",
        narrative: `<p>Three families of generator, each with a different training dynamic. <b>Diffusion</b> learns to reverse a noising process — it denoises pure noise into an image over many small steps — giving stable training and strong quality. A <b>GAN</b> pits a generator against a discriminator in a minimax game; fast to sample but unstable (mode collapse). A <b>normalizing flow</b> uses invertible transforms for exact likelihoods but trails on image quality at scale. The choice shapes every later failure mode.</p>`,
        concepts: ["mod-diffusion", "dl-gan", "mod-normalizing-flows"],
        insight: `<b>Diffusion trades sampling speed for stability and quality.</b> A GAN samples in <b>1</b> forward pass but trains as a fragile two-player game that can <i>mode-collapse</i> (produce only a few image types). Diffusion needs many denoising steps (<b>20–1000</b>) but trains with a simple, stable regression loss and reaches the best text-to-image quality today. Flows give exact likelihoods but weaker samples. For a product, stability + quality wins over raw sampling speed.`,
        data: {
          caption: "Three generative model families compared",
          columns: ["model", "training", "sampling steps", "quality / risk"],
          rows: [
            ["latent diffusion", "stable (denoising regression)", "20–1000", "best quality ✓"],
            ["GAN", "unstable minimax", "1", "fast, mode collapse"],
            ["normalizing flow", "exact likelihood", "1", "weaker samples"],
            ["—", "—", "—", "—"]
          ],
          note: `Diffusion's many steps are the cost you'll attack at Deploy (fast samplers). Its payoff is a stable training loss and top sample quality with excellent text control — the modern default for text-to-image.`
        },
        symbols: [
          { sym: "diffusion", desc: "learns to reverse a gradual noising process, denoising random noise into an image over many steps; stable training, top quality." },
          { sym: "GAN", desc: "generative adversarial network — generator vs discriminator minimax; fast sampling but unstable, prone to mode collapse." },
          { sym: "mode collapse", desc: "a GAN failure where the generator outputs only a few image types, ignoring the diversity of the data." },
          { sym: "normalizing flow", desc: "invertible transforms giving exact likelihoods and one-step sampling, but lower image quality at this scale." }
        ],
        steps: [{
          type: "decide", prompt: "Choose the generative model.",
          options: [
            { label: "A latent diffusion model with text conditioning", best: true, feedback: "diffusion's denoising objective is a simple, stable regression that trains reliably — no adversarial balancing act — and it reaches the best sample quality and text control available for text-to-image today. The one cost is many sampling steps, but that's a deployment problem with known fixes (fast samplers, distillation). Stability plus quality is exactly what you want for a product, which is why diffusion is the modern workhorse." },
            { label: "A GAN, for guaranteed easy training", feedback: "the premise is backwards — GANs are notoriously <i>hard</i> to train, not easy. The generator and discriminator must stay balanced or training diverges or mode-collapses to a handful of outputs, and tuning that two-player game is a research project in itself. GANs do sample fast, but 'guaranteed easy training' is the opposite of their reputation." },
            { label: "A normalizing flow for exact likelihoods", feedback: "flows are elegant — invertible, with exact likelihoods and one-step sampling — but that invertibility constraint limits their expressiveness, so at this scale their image quality lags diffusion noticeably. Exact likelihoods are rarely what a design tool needs; users want sharp, on-prompt images, and diffusion delivers those better. Nice theory, weaker samples here." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train the diffusion model",
        narrative: `<p>The training objective is simple: take a clean latent, add a known amount of Gaussian noise, and train the network (a U-Net) to <b>predict that noise</b>. The loss is the mean-squared error between predicted and true noise; backprop drives it down over millions of noisy examples. Two extras: <b>EMA</b> (exponential moving average) keeps a smoothed copy of the weights for better samples, and <b>classifier-free guidance</b> is trained so you can later dial up prompt adherence.</p>`,
        concepts: ["dl-backprop", "prob-normal", "dl-optimizers"],
        insight: `<b>Predicting noise drives FID from 38 to 12.</b> The model is trained on the objective $\\lVert\\epsilon - \\epsilon_\\theta(z_t, t, c)\\rVert^2$ — guess the noise $\\epsilon$ that was added to latent $z_t$ at step $t$ given prompt $c$. As this MSE loss falls <b>0.142 → 0.094</b> over 500K steps, validation FID drops <b>38.0 → 19.4 → 12.1</b>, i.e. generated images move steadily closer to the real distribution. Note the loss and FID track together — the denoising proxy genuinely predicts sample quality.`,
        data: {
          caption: "Training progress — denoising loss vs. sample quality",
          columns: ["step", "MSE loss", "val FID", "read"],
          rows: [
            ["50K", "0.142", "38.0", "blurry, off-distribution"],
            ["200K", "0.108", "19.4", "improving"],
            ["500K", "0.094", "12.1", "realistic"],
            ["+EMA / CFG", "—", "—", "smoother, controllable"]
          ],
          note: `Objective: predict the added noise $\\epsilon$. Lower MSE means better denoising, which means samples closer to real (lower FID). EMA smooths weights; classifier-free guidance is trained now so prompt strength is tunable at sampling time.`
        },
        symbols: [
          { sym: "$\\epsilon$", desc: "the Gaussian noise actually added to a latent; the target the network tries to predict." },
          { sym: "$\\epsilon_\\theta(z_t,t,c)$", desc: "the network's predicted noise given the noisy latent $z_t$, timestep $t$, and prompt condition $c$." },
          { sym: "$z_t$", desc: "the latent after $t$ steps of added noise; the noisy input the denoiser sees." },
          { sym: "EMA", desc: "exponential moving average of the weights kept alongside training; the smoothed copy used for sampling gives better, less jittery images." }
        ],
        steps: [{
          type: "run", label: "▶ Train (predict the noise)",
          result: { log: "training U-Net noise predictor in latent space...\nstep 50k   loss 0.142   FID(val) 38.0\nstep 200k  loss 0.108   FID(val) 19.4\nstep 500k  loss 0.094   FID(val) 12.1\nEMA weights enabled, classifier-free guidance trained", metrics: [{ k: "val FID", v: "12.1" }, { k: "steps", v: "500K" }],
            chart: { type: "line", title: "Validation FID falls over training (lower is better)", xlabel: "training step (thousands)", ylabel: "FID", series: [
              { name: "val FID", color: "#c89bff", points: [[50, 38.0], [200, 19.4], [500, 12.1]] }
            ] } } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate quality & alignment",
        narrative: `<p>A low FID says images look realistic <i>on average</i> — but it's a distribution-level metric, so it can be green while specific, structured failures hide inside. You add CLIP alignment (does the image match the prompt?) and a human preference test, then you <b>slice by prompt type</b> to expose the known-hard cases. Metrics and people disagree most exactly on the structured failures FID can't see: hands, in-image text, and counting.</p>`,
        concepts: ["mlx-error-analysis", "mod-contrastive", "prob-normal"],
        insight: `<b>FID 11.6 hides 71% garbled text.</b> Aggregate metrics look great — FID <b>11.6</b>, CLIP <b>0.27</b>, human preference <b>58%</b> win vs baseline — yet slicing by prompt type reveals structured failures: <b>22%</b> of hands are malformed, <b>71%</b> of in-image text is garbled, and counting ('three cats') is wrong <b>40%</b> of the time. FID measures distributional realism, so a six-fingered hand barely moves it; only slice-level eval surfaces these.`,
        data: {
          caption: "Aggregate metrics vs. per-slice failure rates",
          columns: ["measure", "value", "type", "verdict"],
          rows: [
            ["FID", "11.6", "aggregate", "looks great"],
            ["CLIP alignment", "0.27", "aggregate", "well-aligned"],
            ["hands malformed", "22%", "slice", "⚠ visible defect"],
            ["in-image text garbled", "71%", "slice", "⚠ blocker"],
            ["counting wrong", "40%", "slice", "⚠ blocker"]
          ],
          note: `The aggregate row says ship; the slice rows say don't. FID averages over the whole distribution, so a structured failure on a specific prompt type is invisible to it — which is precisely why you evaluate slices, not just the headline.`
        },
        symbols: [
          { sym: "slice", desc: "a subset of prompts sharing a property (hands, text, counting) evaluated separately to expose failures the aggregate hides." },
          { sym: "CLIP alignment", desc: "average image-prompt cosine similarity over the eval set; measures prompt-following, blind to per-slice realism defects." },
          { sym: "human preference", desc: "fraction of A/B comparisons where humans pick this model over a baseline; catches what FID and CLIP miss." }
        ],
        steps: [
          { type: "run", label: "▶ Run the eval suite", result: { log: "generating 10,000 samples across prompt set...\nFID: 11.6 (realistic)\nCLIP prompt-alignment: 0.27 avg\nhuman preference vs baseline: 58% win\nfailure modes: hands/fingers 22% malformed, text-in-image garbled 71%, counting ('three cats') wrong 40%", metrics: [{ k: "FID", v: "11.6" }, { k: "CLIP", v: "0.27" }, { k: "hands ⚠", v: "22% bad" }],
            chart: { type: "bars", title: "Per-slice failure rates FID hides (% of prompts)", labels: ["hands malformed", "in-image text garbled", "counting wrong"], values: [22, 71, 40], valueLabels: ["22%", "71%", "40%"], colors: ["#ffb454", "#ff7b72", "#ff7b72"] } } },
          { type: "decide", prompt: "FID is good but hands, in-image text, and counting fail often. What's the read?",
            options: [
              { label: "FID alone hides structured failures — target data and conditioning for the weak prompt types before shipping", best: true, feedback: "FID is a distribution-level realism score, so a malformed hand or garbled sign is a tiny perturbation that barely registers — the aggregate stays green while specific prompt types fail badly. The slice numbers (22% hands, 71% text, 40% counting) are the real shipping signal, and they call for targeted data and conditioning on those weak types, then re-measuring the slices. You certify on the slices, never on the headline FID." },
              { label: "Ship — FID 11.6 is great", feedback: "FID 11.6 only tells you the images look realistic on average, and users don't experience averages — they experience the specific image they generated, where 71% of text comes out garbled and 1 in 5 hands has the wrong number of fingers. Those are immediately, obviously broken, and a single aggregate metric structurally cannot certify them. Shipping on FID alone ignores the data you just collected." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>The three weak slices share a root cause: the training set was thin on close-up hands and clear in-image text, and counting needs stronger prompt grounding. That makes them <b>data gaps</b> (high bias), not under-training — so more steps on the same data can't help, because the structure simply isn't there to learn. The fix is targeted curation plus better captions, then re-measuring the same slices to confirm.</p>`,
        concepts: ["mlx-error-analysis", "dl-data-augmentation", "ml-bias-variance"],
        insight: `<b>Hands fail because clean hands are rare in the data.</b> Close-up, well-formed hands and sharp readable text are underrepresented, so the model never learned their structure — a high-<i>bias</i> gap that more steps (which reduce variance) can't close. The fix is to curate examples of the failing slices and rewrite their captions to be specific, then fine-tune and re-check just those slices: hands 22%, text 71%, counting 40% are the numbers to drive down.`,
        data: {
          caption: "Each failure slice mapped to its data fix",
          columns: ["failure slice", "rate", "root cause", "targeted fix"],
          rows: [
            ["malformed hands", "22%", "few clean hand images", "curate hand close-ups"],
            ["garbled text", "71%", "few sharp-text images", "add legible-text data"],
            ["wrong count", "40%", "weak count grounding", "count-annotated captions"],
            ["—", "—", "high bias, not variance", "fine-tune + re-slice"]
          ],
          note: `Bias vs variance: these are bias errors (the model can't represent what it never saw enough of), so data is the lever, not training time or guidance. Re-measuring the same slices after fine-tuning is how you confirm the gap closed.`
        },
        symbols: [
          { sym: "bias", desc: "error from the model being unable to capture structure absent from its data (clean hands, text); fixed by adding such data, not more steps." },
          { sym: "variance", desc: "error from over-sensitivity to the training sample; reduced by more data/regularization — but not the cause here." },
          { sym: "slice re-measure", desc: "re-evaluating the specific failing prompt types after a fix to verify the gap actually closed." }
        ],
        steps: [{
          type: "decide", prompt: "Hands and in-image text keep failing. Best response?",
          options: [
            { label: "Curate more high-quality hand/text examples, improve captions, and fine-tune — then re-measure those slices", best: true, feedback: "the failures are bias from data gaps — the model can't draw clean hands or legible text because it saw too few of them — so the only real fix is supplying that structure. Curating high-quality hand and text examples and writing precise captions teaches the missing patterns, and re-measuring the exact slices (not just FID) confirms whether the gap closed. You fix the data, then verify on the same numbers that exposed the problem." },
            { label: "Just train 2x longer on the same data", feedback: "more steps reduce variance, but these are bias errors — the structure of well-formed hands and sharp text simply isn't in the data to be learned. You'd watch FID inch down on the easy majority while hands stay broken, because no amount of additional training conjures patterns the dataset lacks. Time can't substitute for missing data." },
            { label: "Increase guidance scale to extreme values", feedback: "cranking classifier-free guidance very high over-saturates colors and distorts shapes — it trades the current artifacts for new ones rather than teaching the model anything about hands or text. Guidance controls how strongly the model follows the prompt, not whether it knows how to render fingers. Extreme values are a different failure, not a fix for the data gap." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy with safety",
        narrative: `<p>Diffusion's cost is its many denoising steps — each step is a full U-Net pass, so 1,000 steps is 1,000 passes per image. Two levers cut this: <b>fast samplers</b> reach good images in ~20 steps instead of 1,000, and <b>distillation</b> trains a student to take even bigger jumps. Then, because generation can produce harmful content, you add <b>safety filters</b> on both the input prompt and the output image. Batch on GPU and canary first.</p>`,
        concepts: ["mod-diffusion", "mod-contrastive"],
        insight: `<b>20 steps, not 1,000 — a ~50× speedup.</b> A distilled fast sampler reaches good quality in <b>20</b> denoising steps instead of ~1,000, taking p50 latency to <b>1.4s</b> and cost to <b>$0.009</b>/image. Safety runs on both ends: a prompt filter blocks disallowed requests up front, an output filter catches what slips through, together flagging <b>0.6%</b> of prompts. The 5% canary means a regression or safety miss affects few users before you catch it.`,
        data: {
          caption: "Serving optimizations and the safety stack",
          columns: ["lever", "what it does", "win", "guards"],
          rows: [
            ["fast sampler", "20 steps vs ~1000", "~50× fewer passes", "latency"],
            ["distillation", "student takes big jumps", "further speedup", "cost"],
            ["GPU batching", "many images at once", "high utilization", "throughput"],
            ["prompt + output filters", "block disallowed content", "0.6% blocked", "safety"]
          ],
          note: `Steps are the dominant cost knob — cutting 1000→20 is the ~50× win behind the $0.009/image price. Safety is two-sided (prompt and output) because each catches what the other misses; the canary limits blast radius of either failure.`
        },
        symbols: [
          { sym: "denoising steps", desc: "the number of U-Net passes to turn noise into an image; the dominant cost, cut from ~1000 to ~20 by fast samplers." },
          { sym: "distillation", desc: "training a student model to reproduce the teacher's many-step result in far fewer steps; extra speedup." },
          { sym: "safety filter", desc: "a classifier on the prompt (input) and/or generated image (output) that blocks disallowed content before it reaches users." },
          { sym: "canary", desc: "routing a small fraction (5%) of traffic to the new model first to catch quality or safety regressions before full rollout." }
        ],
        steps: [
          { type: "decide", prompt: "How do you serve it well?",
            options: [
              { label: "Use a fast sampler (fewer steps) + distillation, add prompt/output safety filters, batch on GPU, canary first", best: true, feedback: "this attacks every axis: fast samplers and distillation collapse ~1,000 denoising steps to ~20 (a ~50× compute cut that drives the $0.009/image price), GPU batching keeps the hardware saturated, and two-sided safety filters block disallowed prompts up front and catch unsafe outputs that slip through. The 5% canary means a quality or safety regression hits a few users, not everyone, before you catch and roll back. Speed, cost, safety, and rollout risk all handled." },
              { label: "Run 1,000 denoising steps per image with no safety filter", feedback: "this is the worst case on two axes at once: 1,000 full U-Net passes per image is painfully slow and costly when fast samplers reach the same quality in ~20, and shipping a generator with no safety filter means a single harmful output is an unguarded incident. You'd pay ~50× the compute for the privilege of having no protection against misuse. Both halves are avoidable." }
            ] },
          { type: "run", label: "▶ Deploy (canary 5% → 100%)", result: { log: "loading distilled sampler (20 steps)...\ncanary 5%: p50 latency 1.4s, p99 3.1s\nsafety filter block rate: 0.6% of prompts\ncost: $0.009 / image\npromoting to 100% ... live.", metrics: [{ k: "p99 latency", v: "3.1s" }, { k: "cost/image", v: "$0.009" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain (MLOps)",
        narrative: `<p>Prompts shift with trends and safety is never "done." You watch four layers: <b>input</b> (prompt-topic drift), <b>output</b> (sampled FID/CLIP, human spot-checks, safety-filter hits), the <b>system</b> (latency/cost), and <b>outcomes</b> (regeneration rate, save-vs-discard). The <b>regeneration rate</b> — how many times a user re-rolls before keeping an image — is the cheapest dissatisfaction signal: a rising re-roll count means the first output wasn't good enough.</p>`,
        concepts: ["mlx-error-analysis", "mod-contrastive", "prob-normal"],
        insight: `<b>A trend shifts prompts to a weak style.</b> A surge in 'anime style' requests — underrepresented in training — drops the sampled human-good rate <b>81% → 70%</b>, and users feel it: regenerations climb <b>1.4 → 2.3 per session</b> as they re-roll to get something usable. Safety-filter hits stay flat at <b>0.6%</b>, so this is a quality drift, not a safety event. The fix routes back to Data: curate anime-style pairs and fine-tune that slice.`,
        data: {
          caption: "This week's monitors (four layers)",
          columns: ["monitor", "layer", "reading", "trigger"],
          rows: [
            ["prompt-topic drift", "input", "'anime style' surge", "drift"],
            ["human-good rate", "output", "81% → 70%", "ALERT"],
            ["safety-filter hits", "output", "0.6% (stable)", "ok"],
            ["regen / session", "outcome", "1.4 → 2.3", "confirming signal"]
          ],
          note: `The regeneration rate confirms the quality drop from the user side without labels — every extra re-roll is a vote that the first image failed. Prompt drift (input) is the leading signal; the rising regen rate is the confirming one, and together they trigger the curate-and-fine-tune loop.`
        },
        symbols: [
          { sym: "prompt-topic drift", desc: "a shift in what users ask for (e.g. a trend toward anime style) away from the training distribution; a leading quality risk." },
          { sym: "regeneration rate", desc: "average re-rolls per session before a user keeps an image; a cheap, label-free dissatisfaction signal." },
          { sym: "human-good rate", desc: "fraction of sampled outputs a human judges acceptable; the sampled output-quality metric that alerts." },
          { sym: "save-vs-discard", desc: "the outcome ratio of kept to thrown-away images; the ultimate measure of whether outputs are useful." }
        ],
        steps: [
          { type: "decide", prompt: "What belongs on the production dashboard?",
            options: [
              { label: "Prompt-topic drift, sampled FID/CLIP and human spot-checks, safety-filter & regeneration rates, latency/cost, and save-vs-discard rate — with alerts", best: true, feedback: "this spans all four layers and each catches a distinct failure: prompt drift warns when a trend pushes users toward a style the model is weak on, sampled FID/CLIP and human spot-checks confirm whether output quality actually fell, safety-filter hits separate quality drift from safety events, and the regeneration / save-discard rates are the ground-truth outcome signals that need no labels. Alerts on these turn the dashboard into the curate-and-fine-tune loop instead of a postmortem." },
              { label: "Only count total images generated", feedback: "volume tells you how much the feature is used, not whether the images are good or safe — the human-good rate could fall from 81% to 70% with generation volume perfectly flat or even rising as frustrated users re-roll. A quality drift from a style trend, or a safety regression, would slip through completely unseen, and you'd learn about it from churn instead of an alert." }
            ] },
          { type: "run", label: "▶ Check this week's monitors", result: { log: "prompt drift: surge in 'anime style' requests (weak in training data)\nsampled human-good rate (7d): 81% -> 70%  ALERT\nregeneration rate: 1.4 -> 2.3 per session (users unhappy)\nsafety-filter hits: stable 0.6%\naction: curate anime-style data, fine-tune, re-eval slice", metrics: [{ k: "good rate", v: "70% ⚠" }, { k: "regen/session", v: "2.3" }] }, note: `The loop closes here: a trend shifted prompts toward a style the model was weak on, quality dropped, and monitoring caught it via the rising regeneration rate — back to the <b>Data</b> stage. That's the real job.` }
        ]
      }
    ]
  }
});
