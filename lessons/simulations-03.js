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
        narrative: `<p>You're building a customer-support assistant for a software product. Before any model work, decide what "good" means: it must answer from the docs, refuse when unsure, and stay polite. A vague goal gives you a chatbot you can't measure.</p>`,
        concepts: ["mod-llm", "ml-classification-metrics"],
        steps: [{
          type: "decide", prompt: "What should your primary eval be?",
          options: [
            { label: "Perplexity on a generic web corpus", feedback: "perplexity measures next-token fluency, not whether answers are correct or grounded. A fluent model can still confidently make things up." },
            { label: "Task success on a held-out set of real support questions, plus a hallucination rate and a human-helpfulness score", best: true, feedback: "you ship answers, not log-likelihoods. Measure correctness on real tickets, how often it invents facts, and whether humans find it useful." },
            { label: "Number of tokens generated per reply", feedback: "longer isn't better — that just rewards rambling. Length is a cost metric, not a quality one." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather instruction data",
        narrative: `<p>You need examples of good support answers. The cleanest signal is real resolved tickets where a human gave a correct, grounded reply.</p>`,
        concepts: ["ml-supervised", "mod-llm"],
        steps: [
          { type: "decide", prompt: "Where do your instruction-response pairs come from?",
            options: [
              { label: "Resolved support tickets with the agent's accepted reply, linked to the doc passage that backs it", best: true, feedback: "real questions, real grounded answers, with a citation you can verify. This is gold for both fine-tuning and RAG." },
              { label: "Scrape any Q&A off the open web", feedback: "noisy, off-domain, and full of wrong answers — you'd teach the model the internet's mistakes, not your product." },
              { label: "Have the base model generate its own training answers, unchecked", feedback: "self-generated answers can bake in the model's own hallucinations. Distillation needs a verified teacher, not an unchecked one." }
            ] },
          { type: "run", label: "▶ Pull resolved support tickets", prompt: "Export tickets with accepted answers and doc links.",
            result: { log: "exporting from support warehouse...\n84,210 resolved tickets\nwith linked doc passage: 61,540 (73%)\nlanguages: en 88%, de 6%, ja 4%, other 2%\nmedian question length: 34 tokens", metrics: [{ k: "pairs", v: "61.5K" }, { k: "grounded", v: "73%" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Clean & deduplicate",
        narrative: `<p>Web-scale text is full of near-duplicates and junk. Duplicates waste compute and can leak your eval set into training, inflating scores.</p>`,
        concepts: ["dl-cosine-similarity", "mlx-error-analysis"],
        steps: [
          { type: "run", label: "▶ Dedup & filter", result: { log: "near-dup detection (MinHash + cosine on embeddings)...\nexact duplicates removed: 4,102\nnear-duplicates (cos > 0.95) removed: 9,377\nPII redaction: 12,840 emails / phone numbers masked\ntoxic / off-topic filtered: 1,205\nremaining clean pairs: 46,856", metrics: [{ k: "after dedup", v: "46.9K" }, { k: "removed", v: "23%" }] } },
          { type: "decide", prompt: "Why dedup so aggressively before splitting train/eval?",
            options: [
              { label: "To save disk space", feedback: "minor. The real danger is that a duplicate in both train and eval leaks answers and makes your scores a fantasy." },
              { label: "Near-duplicates across the train/eval boundary leak answers and inflate metrics", best: true, feedback: "exactly. Dedup first, then split — otherwise the model 'memorizes' eval items it saw in training and you over-trust it." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Tokenize",
        narrative: `<p>Models read tokens, not characters. A good tokenizer (BPE) keeps sequences short and handles rare words via subword pieces. Long inputs cost more and may overflow the context window.</p>`,
        concepts: ["dl-word-embeddings", "ml-softmax"],
        steps: [
          { type: "run", label: "▶ Tokenize the corpus", result: { log: "applying BPE tokenizer (vocab 50,257)...\navg tokens / question: 41\navg tokens / answer: 187\n99th pct conversation length: 2,940 tokens\ndocs that exceed 4K context: 3.1%  -> will need chunking for RAG", metrics: [{ k: "vocab", v: "50,257" }, { k: "avg conv", v: "228 tok" }] } },
          { type: "decide", prompt: "3.1% of doc-grounded conversations exceed the 4K context window. What do you do?",
            options: [
              { label: "Truncate the docs and hope the answer was near the top", best: true, feedback: "for RAG you don't stuff whole docs anyway — you chunk them and retrieve only the relevant passages, so most never overflow. Smart truncation/chunking beats a bigger, costlier context." },
              { label: "Always use the largest context model regardless of cost", feedback: "a 128K-context model costs far more per call. Most questions need a few hundred tokens of context — pay for length only when you must." }
            ] }
        ]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick a base model",
        narrative: `<p>Training a transformer from scratch costs millions and needs trillions of tokens. You start from a strong pretrained base and adapt it. Self-attention lets every token read the whole context at once.</p>`,
        concepts: ["mod-transformer", "mod-multihead", "dl-attention"],
        steps: [{
          type: "decide", prompt: "How do you get your base model?",
          options: [
            { label: "Pretrain a 7B transformer from scratch on your 47K pairs", feedback: "47K pairs is nowhere near the trillions of tokens pretraining needs — you'd badly underfit and burn a fortune. Always start from a pretrained base." },
            { label: "Start from an open pretrained 7B–8B instruct model and adapt it to your domain", best: true, feedback: "the base already knows language and reasoning; you only need to specialize it. This is the standard, affordable path." },
            { label: "Use a tiny 125M model so it's cheap", feedback: "too small to follow complex instructions or reason over docs reliably. Quality collapses; cost savings aren't worth it." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Adapt: LoRA fine-tune + RAG",
        narrative: `<p>Two cheap levers: <b>RAG</b> retrieves doc passages at query time so answers stay grounded and current; <b>LoRA</b> fine-tunes a few low-rank adapter matrices (millions of params, not billions) to fix tone and format. RLHF/PPO can align later.</p>`,
        concepts: ["dl-cross-entropy", "dl-optimizers", "mod-actor-critic"],
        steps: [{
          type: "run", label: "▶ Train LoRA adapters (rank 16)",
          result: { log: "freezing base weights, training LoRA adapters (rank 16)...\ntrainable params: 9.4M / 7.0B (0.13%)\nepoch 1  train loss 1.84  val loss 1.71\nepoch 2  train loss 1.52  val loss 1.49\nepoch 3  train loss 1.33  val loss 1.47  (val plateau, stop)\nRAG index built: 46,856 chunks, FAISS cosine retriever", metrics: [{ k: "val loss", v: "1.47" }, { k: "trainable", v: "0.13%" }] } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate: held-out + human + hallucination",
        narrative: `<p>Loss alone won't tell you if answers are <i>right</i>. Run a held-out task-success eval, a human helpfulness rating, and a hallucination check that compares each claim to the retrieved source.</p>`,
        concepts: ["ml-classification-metrics", "mod-llm", "mlx-error-analysis"],
        steps: [
          { type: "run", label: "▶ Run the full eval suite", result: { log: "held-out support questions: 1,000\ntask success (answer resolves the ticket): 81%\nhuman helpfulness (1-5): 4.2 avg\nhallucination rate (claim not in retrieved source): 6.1%\nperplexity on in-domain held-out: 9.3", metrics: [{ k: "task success", v: "81%" }, { k: "hallucination", v: "6.1%" }, { k: "helpfulness", v: "4.2/5" }] } },
          { type: "decide", prompt: "Hallucination rate is 6.1%. What does that mean for shipping?",
            options: [
              { label: "Ship it — 81% success is good enough", feedback: "1 in 16 answers states something the source doesn't support. In support, a confident wrong answer erodes trust fast. Drive hallucinations down first." },
              { label: "Tighten grounding: require citations, refuse when retrieval confidence is low, then re-measure", best: true, feedback: "the right lever. Forcing the model to cite a retrieved passage and to say 'I'm not sure' when nothing matches directly attacks hallucination." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>Error analysis shows most hallucinations come from questions where retrieval returned nothing relevant — the model answered anyway. The fix isn't always more fine-tuning.</p>`,
        concepts: ["mlx-error-analysis", "dl-cosine-similarity", "ml-bias-variance"],
        steps: [{
          type: "decide", prompt: "Most failures are 'retrieval missed, model guessed.' Best fix?",
          options: [
            { label: "Improve retrieval (better embeddings, reranking) and add a 'no-answer' refusal when top-k similarity is low", best: true, feedback: "the bottleneck is the retriever, not the generator. Better recall plus a confidence-gated refusal removes the guess-when-blind failure mode." },
            { label: "Fine-tune harder on more pairs", feedback: "more fine-tuning can't teach facts that were never retrieved. This is a retrieval gap, not a generation gap." },
            { label: "Raise the generation temperature for variety", feedback: "higher temperature makes outputs more random — it increases hallucination, the opposite of what you want." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy: serving, latency, cost",
        narrative: `<p>A 7B model streaming tokens has real latency and GPU cost. Serving tricks — KV-cache, quantization, batching — cut both. Roll out behind a canary.</p>`,
        concepts: ["mod-llm", "la-matmul"],
        steps: [
          { type: "decide", prompt: "How do you serve it affordably?",
            options: [
              { label: "Quantize to 8-bit, enable KV-cache + continuous batching, stream tokens, canary at 5%", best: true, feedback: "quantization shrinks memory/cost, KV-cache avoids recomputing past tokens, batching raises GPU utilization, streaming hides latency. Canary protects you from a bad rollout." },
              { label: "Run full-precision, one request per GPU, no batching", feedback: "wastes most of the GPU and balloons cost per answer. You'll pay 5-10x for the same throughput." }
            ] },
          { type: "run", label: "▶ Deploy (canary 5% → 100%)", result: { log: "loading int8 weights, warming KV-cache...\ncanary 5%: p50 first-token 280ms, p99 720ms\nthroughput: 31 req/s/GPU (continuous batching)\ncost: $0.0021 / answer\npromoting to 100% ... live.", metrics: [{ k: "p99 first-token", v: "720ms" }, { k: "cost/answer", v: "$0.0021" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor: drift, toxicity, feedback",
        narrative: `<p>Live traffic shifts, docs change, and users probe for bad behavior. Watch input drift, output toxicity, hallucination on sampled traffic, and the thumbs-up/down feedback stream.</p>`,
        concepts: ["mlx-error-analysis", "ml-classification-metrics"],
        steps: [
          { type: "decide", prompt: "What belongs on the production dashboard?",
            options: [
              { label: "Topic/length drift on inputs, sampled hallucination + toxicity rate, refusal rate, latency/cost, and user thumbs-up rate — with alerts", best: true, feedback: "track inputs (drift), outputs (toxicity/hallucination/refusals), system (latency/cost), and outcomes (feedback). Alerts close the loop back to retrain/re-index." },
              { label: "Just average response length", feedback: "tells you nothing about correctness, safety, or user satisfaction. A silent quality drop would sail right past." }
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
        narrative: `<p>Support gets 20,000 tickets a day. You want two things: a <b>classifier</b> that tags each ticket's topic (billing, bug, how-to...) and an <b>NER</b> step that extracts product names, versions, and order IDs. Decide what success looks like.</p>`,
        concepts: ["ml-classification-metrics", "ml-supervised"],
        steps: [{
          type: "decide", prompt: "What objective fits a multi-class routing task with rare but critical classes?",
          options: [
            { label: "Maximize overall accuracy", feedback: "accuracy hides the rare classes. If 'security-incident' is 0.5% of tickets, a model that ignores it still scores high — and you miss the urgent ones." },
            { label: "Maximize macro-F1 so rare classes count, plus per-class recall on the urgent ones", best: true, feedback: "macro-F1 weights every class equally, and per-class recall guards the critical-but-rare categories you can't afford to miss." },
            { label: "Minimize cross-entropy and ignore class metrics", feedback: "loss is what you optimize, not what you report. Stakeholders need precision/recall per route, not a log-loss number." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather labeled text",
        narrative: `<p>You need tickets labeled with their topic and spans marked for entities. Labels come from the routing tags agents already assign, plus a small hand-annotated NER set.</p>`,
        concepts: ["ml-supervised", "aix-lda-topic"],
        steps: [
          { type: "decide", prompt: "How do you label NER spans (product, version, order-id)?",
            options: [
              { label: "Hand-annotate a few thousand tickets with span boundaries, double-annotated for agreement", best: true, feedback: "NER needs exact character spans; weak labels are too noisy. A modest, high-agreement gold set trains and evaluates the tagger well." },
              { label: "Regex everything and call it labels", feedback: "regex catches the easy 'v1.2.3' cases but misses messy real text, and you'd train the model to imitate the regex's blind spots." },
              { label: "Skip NER labels and hope the classifier learns entities too", feedback: "a topic classifier doesn't emit spans. Without span labels you can't extract or evaluate entities at all." }
            ] },
          { type: "run", label: "▶ Assemble the corpus", result: { log: "pulling tagged tickets...\nrouting-labeled tickets: 312,000 across 14 topics\nclass imbalance: 'how-to' 31% ... 'security' 0.4%\nNER gold set: 3,400 tickets, inter-annotator F1 0.92\nentity types: PRODUCT, VERSION, ORDER_ID", metrics: [{ k: "tickets", v: "312K" }, { k: "topics", v: "14" }, { k: "NER agreement", v: "0.92" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore the text",
        narrative: `<p>Look before you model. Topic modeling surfaces themes you forgot existed; class balance and noisy text (typos, code snippets, multiple languages) shape every later choice.</p>`,
        concepts: ["aix-lda-topic", "cls-tsne", "mlx-error-analysis"],
        steps: [
          { type: "run", label: "▶ Profile & topic-model", result: { log: "running LDA topic model (k=20) for discovery...\nfound an unlabeled cluster: 'mobile-app-crash' (~4% of tickets)\nlanguages: en 81%, es 9%, fr 5%, other 5%\ncode-snippet tickets: 12% (need special tokenization)\nt-SNE shows 'billing' and 'refund' heavily overlap", metrics: [{ k: "LDA topics", v: "20" }, { k: "non-en", v: "19%" }] } },
          { type: "decide", prompt: "LDA found a 'mobile-app-crash' theme that has no routing label. What now?",
            options: [
              { label: "Add it as a new class and get those tickets labeled before training", best: true, feedback: "your label set was incomplete. Adding the missing class (and labels) prevents the model from mis-routing 4% of traffic into the wrong bucket." },
              { label: "Ignore it — it's not in the label schema", feedback: "those tickets still arrive. Forcing them into existing classes guarantees a systematic 4% routing error." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Represent the text",
        narrative: `<p>Models need vectors, not strings. Bag-of-words is a fast baseline; contextual embeddings from a transformer capture meaning and handle synonyms and word order.</p>`,
        concepts: ["dl-word2vec", "dl-word-embeddings", "mod-transformer"],
        steps: [{
          type: "decide", prompt: "Which representation for the classifier?",
          options: [
            { label: "Start with TF-IDF for a fast baseline, then move to contextual transformer embeddings", best: true, feedback: "TF-IDF gives a cheap, strong baseline to beat; transformer embeddings capture context ('crash' near 'payment' vs 'app') and lift the hard classes. Baseline first, then upgrade." },
            { label: "Raw character strings fed directly to a tree model", feedback: "trees can't consume raw text; you must vectorize first. This step is unavoidable." },
            { label: "One-hot encode the full vocabulary with no weighting", feedback: "sparse, huge, and treats 'the' as important as 'refund'. TF-IDF down-weights common words for a reason." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick the pipeline",
        narrative: `<p>Two heads: a topic <b>classifier</b> and a sequence <b>tagger</b> for NER. A fine-tuned transformer can do both; a logistic-regression baseline anchors the classifier.</p>`,
        concepts: ["ml-logistic-regression", "mod-transformer", "ml-naive-bayes"],
        steps: [{
          type: "decide", prompt: "Choose the modeling approach.",
          options: [
            { label: "Logistic-regression baseline on TF-IDF, then a fine-tuned transformer with a classification head and a token-tagging head", best: true, feedback: "the baseline proves the data is learnable and sets a bar; the shared transformer then handles both routing and span extraction with context." },
            { label: "Jump straight to a giant generative LLM for everything", feedback: "overkill and pricey for high-volume routing. A fine-tuned encoder is faster, cheaper, and easier to evaluate for this structured task." },
            { label: "Naive Bayes only, forever", feedback: "a fine baseline, but it assumes word independence and misses context — it'll cap out on the overlapping 'billing/refund' classes." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train it",
        narrative: `<p>Fit with class weights for the rare topics and cross-entropy loss. Watch validation macro-F1, not just accuracy.</p>`,
        concepts: ["dl-cross-entropy", "ml-regularization", "ml-softmax"],
        steps: [{
          type: "run", label: "▶ Fine-tune the encoder (class-weighted)",
          result: { log: "fine-tuning transformer encoder, class weights ~ 1/freq...\nepoch 1  val acc 0.86  val macro-F1 0.61\nepoch 2  val acc 0.89  val macro-F1 0.74\nepoch 3  val acc 0.90  val macro-F1 0.79  (early stop)\nNER head: token-level F1 0.88", metrics: [{ k: "macro-F1", v: "0.79" }, { k: "NER F1", v: "0.88" }] } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate honestly",
        narrative: `<p>Overall accuracy looks great, but check the confusion matrix and per-class recall — especially the rare, critical routes.</p>`,
        concepts: ["ml-classification-metrics", "ml-roc-auc", "mlx-error-analysis"],
        steps: [
          { type: "run", label: "▶ Per-class evaluation", result: { log: "test set: 40,000 tickets\noverall accuracy: 0.90\nmacro-F1: 0.79\n'security' recall: 0.58  (misses 42% of urgent tickets)\nconfusion: 'billing' <-> 'refund' swapped 9% of the time\nNER: PRODUCT F1 0.91, VERSION 0.86, ORDER_ID 0.83", metrics: [{ k: "accuracy", v: "0.90" }, { k: "security recall", v: "0.58 ⚠" }] } },
          { type: "decide", prompt: "Security recall is only 0.58. Which fix matches the goal?",
            options: [
              { label: "Lower the decision threshold for 'security' and add hard-negative examples, accepting a few more false alarms", best: true, feedback: "for a critical route, missing 42% is unacceptable; you'd rather over-flag and let a human confirm. Threshold tuning plus targeted data directly raises recall where it matters." },
              { label: "Do nothing — overall accuracy is 0.90", feedback: "the high average hides the failure on the one class you most need to catch. Averages lie under imbalance." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>Error analysis shows 'billing' and 'refund' confuse because the words co-occur constantly. More data alone won't separate them; better features or labels might.</p>`,
        concepts: ["mlx-error-analysis", "ml-bias-variance", "mlx-cross-validation"],
        steps: [{
          type: "decide", prompt: "'billing' and 'refund' keep swapping. Best response?",
          options: [
            { label: "Error-analyze the confusions, add disambiguating features/examples, and consider merging or re-defining the two routes", best: true, feedback: "the classes may genuinely overlap. Clarifying the label boundary (or merging) plus targeted examples beats blindly adding more ambiguous data." },
            { label: "Just train for more epochs", feedback: "more training overfits the noise without resolving a real label-overlap problem — validation macro-F1 already plateaued." },
            { label: "Drop the 'refund' class entirely", feedback: "those tickets still need routing somewhere; deleting the class doesn't make the tickets disappear." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy the pipeline",
        narrative: `<p>Routing runs on every inbound ticket, so it must be fast and reliable. Serve the encoder behind a low-latency endpoint and roll out carefully.</p>`,
        concepts: ["ml-classification-metrics", "mod-transformer"],
        steps: [
          { type: "decide", prompt: "How should the classifier+NER run in production?",
            options: [
              { label: "A batched real-time service with confident auto-route and low-confidence tickets sent to a human queue, canary first", best: true, feedback: "auto-route the easy ones, escalate the uncertain ones to people. The human-in-the-loop catches errors and yields fresh labels. Canary de-risks the rollout." },
              { label: "Auto-route 100% with no human fallback", feedback: "every misroute hits a customer with no safety net — and you lose the corrected-label feedback that improves the model." }
            ] },
          { type: "run", label: "▶ Ship (canary 10% → 100%)", result: { log: "deploying encoder pipeline v1...\ncanary 10%: p99 latency 58ms, auto-route rate 82%\nlow-confidence -> human queue: 18%\nshadow agreement with agent tags: 91%\npromoting to 100% ... live.", metrics: [{ k: "p99 latency", v: "58ms" }, { k: "auto-route", v: "82%" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain (MLOps)",
        narrative: `<p>Language drifts — new products launch, new slang appears, a new bug floods the queue. Watch input drift, per-class metrics from the human-corrected labels, and the NER extraction rate.</p>`,
        concepts: ["mlx-error-analysis", "ml-classification-metrics", "aix-lda-topic"],
        steps: [
          { type: "decide", prompt: "What do you monitor in production?",
            options: [
              { label: "Vocabulary/topic drift, per-class precision & recall from human-corrected routes, NER field-fill rate, and confidence distribution — with alerts", best: true, feedback: "track inputs (new terms/topics), outputs (per-class quality as humans correct), and extraction completeness. Drift triggers a relabel-and-retrain loop." },
              { label: "Only total ticket volume", feedback: "volume says nothing about whether routing is still correct. A quietly degrading classifier would go unnoticed." }
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
        narrative: `<p>You're building speech-to-text plus translation for a meetings app. Two sub-tasks: ASR (audio → English text) and MT (English → Spanish). You measure ASR with <b>WER</b> (word error rate, lower is better) and translation with <b>BLEU</b> (higher is better).</p>`,
        concepts: ["dl-rnn", "ml-classification-metrics"],
        steps: [{
          type: "decide", prompt: "Which metrics actually match the two tasks?",
          options: [
            { label: "WER for transcription quality and BLEU for translation quality, both on held-out audio", best: true, feedback: "WER counts insert/delete/substitute word errors against a reference transcript; BLEU scores n-gram overlap with reference translations. The right tool for each half." },
            { label: "Plain accuracy on whole sentences", feedback: "one wrong word fails the whole sentence — too coarse. WER and BLEU give graded, word-level signal that guides improvement." },
            { label: "Mean-squared error on the audio waveform", feedback: "that measures audio reconstruction, not whether the words are right. This is a sequence task, not signal regression." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather paired data",
        narrative: `<p>ASR needs audio paired with transcripts; MT needs English-Spanish sentence pairs. Real-world robustness comes from varied accents, noise, and speaking rates.</p>`,
        concepts: ["dl-rnn", "ai-hmm"],
        steps: [
          { type: "decide", prompt: "What makes the ASR training set robust?",
            options: [
              { label: "Diverse accents, background noise, mic types, and speaking speeds — matching real meeting conditions", best: true, feedback: "a model trained only on clean studio speech collapses on a noisy call. Cover the conditions you'll actually face." },
              { label: "One narrator, studio-clean, single accent", feedback: "pristine and useless — it won't generalize to real users with accents and background noise." },
              { label: "Audio with no transcripts; the model can figure it out", feedback: "supervised ASR needs paired transcripts. Unlabeled audio alone can't teach the word mapping here." }
            ] },
          { type: "run", label: "▶ Assemble audio + text corpora", result: { log: "ASR: 2,100 hours paired audio/transcript\naccents: US 44%, UK 18%, IN 14%, AU 9%, other 15%\nSNR range: 5-40 dB (includes noisy calls)\nMT: 12.4M en-es sentence pairs\nsample rate: 16 kHz", metrics: [{ k: "audio", v: "2,100 hrs" }, { k: "MT pairs", v: "12.4M" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore & clean",
        narrative: `<p>Audio data hides traps: mislabeled transcripts, clipped recordings, and silence. Bad pairs poison training, so profile before you featurize.</p>`,
        concepts: ["mlx-error-analysis", "prob-normal"],
        steps: [
          { type: "run", label: "▶ Profile the audio", result: { log: "scanning 2,100 hours...\nempty/silent clips: 1.8% (drop)\ntranscript-audio length mismatch > 3x: 2.4% (likely misaligned)\nclipped/saturated audio: 0.9%\nlanguage ID check: 0.3% non-English leaked in (drop)\nmean utterance: 7.2s", metrics: [{ k: "dropped", v: "5.1%" }, { k: "mean len", v: "7.2s" }] } },
          { type: "decide", prompt: "2.4% of pairs have a big audio↔transcript length mismatch. What is that, usually?",
            options: [
              { label: "Misaligned or wrong transcripts — filter or re-align them", best: true, feedback: "a 10-second clip with a 2-word transcript is almost always a bad label. Training on it teaches the model wrong audio→text mappings." },
              { label: "Fine — keep them, more data is always better", feedback: "more bad data is worse, not better. Garbage pairs raise WER by confusing the alignment the model must learn." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Extract features (spectrograms)",
        narrative: `<p>Raw waveforms are huge and hard to model directly. Convert audio to <b>log-mel spectrograms</b> — a time-by-frequency image of energy — the standard front-end for speech models.</p>`,
        concepts: ["dl-conv", "fnd-norm"],
        steps: [
          { type: "run", label: "▶ Compute log-mel spectrograms", result: { log: "STFT window 25ms, hop 10ms...\nmel filterbanks: 80\nframes / second: 100\nper-feature mean/variance normalization applied\noutput: 80 x T feature matrices\nSpecAugment (time/freq masking) enabled for training", metrics: [{ k: "mel bins", v: "80" }, { k: "frame rate", v: "100/s" }] } },
          { type: "decide", prompt: "Why log-mel spectrograms instead of the raw waveform?",
            options: [
              { label: "They compactly encode the frequency content humans hear, shrinking the input and exposing speech structure", best: true, feedback: "mel scaling mimics human hearing and the log compresses dynamic range. The model gets a clean, compact time-frequency view instead of 16,000 raw samples per second." },
              { label: "Raw waveforms are illegal to use", feedback: "nothing illegal — waveform models exist, but they need far more data and compute. Spectrograms are the practical default." }
            ] }
        ]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick the architecture",
        narrative: `<p>ASR maps a variable-length spectrogram to a word sequence. Options: <b>CTC</b> (alignment-free), classic <b>HMM</b> phoneme models, or an attention <b>seq2seq</b> encoder-decoder. MT uses a transformer seq2seq.</p>`,
        concepts: ["dl-attention", "mod-transformer", "dl-lstm-gru", "ai-hmm"],
        steps: [{
          type: "decide", prompt: "Choose the ASR + MT backbone.",
          options: [
            { label: "Attention-based encoder-decoder (or CTC) transformer for ASR, and a transformer seq2seq for MT", best: true, feedback: "attention aligns input audio frames to output words without hand-built alignments, and transformers are the state of the art for both ASR and translation." },
            { label: "A fixed-input feed-forward net that reads the whole clip at once", feedback: "speech is variable-length and sequential; a fixed-size net can't handle utterances of different durations or model temporal order." },
            { label: "Pure HMM with hand-tuned phoneme states only", feedback: "classic and instructive, but neural seq2seq/CTC models now beat HMM-GMM pipelines substantially on WER." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train the models",
        narrative: `<p>Train ASR with CTC/cross-entropy loss over spectrogram→text, and MT with cross-entropy over token sequences. Softmax picks the next token from the vocabulary at each step.</p>`,
        concepts: ["dl-cross-entropy", "ml-softmax", "dl-optimizers"],
        steps: [{
          type: "run", label: "▶ Train ASR + MT",
          result: { log: "training ASR encoder-decoder (SpecAugment on)...\nepoch 4  dev WER 18.1%\nepoch 8  dev WER 12.7%\nepoch 12 dev WER 11.3%  (early stop)\ntraining MT transformer...\ndev BLEU 33.4 -> 38.9 -> 41.2", metrics: [{ k: "dev WER", v: "11.3%" }, { k: "dev BLEU", v: "41.2" }] } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate end-to-end",
        narrative: `<p>The pipeline is ASR → MT, so errors compound: a wrong transcript yields a wrong translation. Evaluate each stage <i>and</i> the full chain on held-out audio.</p>`,
        concepts: ["ml-classification-metrics", "mlx-error-analysis", "dl-attention"],
        steps: [
          { type: "run", label: "▶ Evaluate the full pipeline", result: { log: "held-out: 20 hours, 11,000 utterances\nASR WER (clean): 9.8%\nASR WER (noisy, SNR<15dB): 21.6%\nMT BLEU (on gold transcripts): 41.0\nEnd-to-end BLEU (on ASR output): 33.7  (cascaded loss)\nlatency: 1.9s avg", metrics: [{ k: "WER noisy", v: "21.6% ⚠" }, { k: "e2e BLEU", v: "33.7" }] } },
          { type: "decide", prompt: "End-to-end BLEU (33.7) is well below MT-on-gold BLEU (41.0). Why, and what's the lesson?",
            options: [
              { label: "ASR errors propagate into MT — fix the upstream WER, especially on noisy audio, to lift the whole chain", best: true, feedback: "in a cascade the weakest stage caps the system. Lowering WER on noisy speech directly recovers downstream BLEU." },
              { label: "BLEU and WER aren't comparable, so ignore the gap", feedback: "the gap between MT-on-gold and end-to-end BLEU is exactly the error injected by ASR — it's the most actionable signal you have." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>Error analysis pins the WER damage on noisy, accented audio. The training data was thin there. The fix targets the data gap, not the model size.</p>`,
        concepts: ["mlx-error-analysis", "dl-data-augmentation", "ml-bias-variance"],
        steps: [{
          type: "decide", prompt: "Noisy/accented audio drives most errors. Best fix?",
          options: [
            { label: "Add more noisy & accented training audio and augment (noise injection, speed perturb, SpecAugment)", best: true, feedback: "the model never saw enough of these conditions. Targeted data plus augmentation teaches robustness where it's failing — a data gap, not a capacity gap." },
            { label: "Make the model 4x bigger", feedback: "a bigger model can't learn conditions absent from its data; it'll just overfit the clean speech it already has." },
            { label: "Lower BLEU's brevity penalty", feedback: "tweaking the metric doesn't change reality — the transcripts are genuinely wrong on noisy audio." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy for low latency",
        narrative: `<p>A meetings app needs near-real-time captions, so you stream audio and emit partial results. Full-utterance models are accurate but laggy; streaming trades a little accuracy for responsiveness.</p>`,
        concepts: ["dl-lstm-gru", "mod-transformer"],
        steps: [
          { type: "decide", prompt: "How do you serve it responsively?",
            options: [
              { label: "Streaming/chunked ASR emitting partial captions, with a short look-ahead window, on GPU, canary first", best: true, feedback: "streaming gives users live captions; a small look-ahead recovers most accuracy while keeping latency low. Canary protects live meetings from a bad model." },
              { label: "Wait for the speaker to finish the whole talk, then transcribe", feedback: "captions that appear minutes late are useless in a live meeting. You must emit incrementally." }
            ] },
          { type: "run", label: "▶ Deploy streaming (canary 5% → 100%)", result: { log: "deploying streaming ASR + MT v2...\ncanary 5%: partial-caption latency p50 380ms, p99 910ms\nstreaming WER vs offline: 12.1% vs 11.3% (small gap)\nGPU util: 64%\npromoting to 100% ... live.", metrics: [{ k: "p99 caption", v: "910ms" }, { k: "streaming WER", v: "12.1%" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain (MLOps)",
        narrative: `<p>Acoustic conditions and vocabulary shift over time — new product names, new meeting hardware, new accents. Watch for input drift, WER/BLEU on sampled audio with human references, and latency.</p>`,
        concepts: ["mlx-error-analysis", "ml-classification-metrics", "prob-normal"],
        steps: [
          { type: "decide", prompt: "What goes on the production dashboard?",
            options: [
              { label: "Audio SNR/accent drift, sampled WER & BLEU against human references, out-of-vocab rate, caption latency, and user edit rate — with alerts", best: true, feedback: "track inputs (acoustic drift, OOV terms), outputs (WER/BLEU on sampled refs), system (latency), and outcomes (how often users correct captions). That closes the loop." },
              { label: "Just GPU temperature", feedback: "hardware health won't tell you the transcripts got worse. A quality regression would be invisible." }
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
        narrative: `<p>You're building a text-to-image generator for a design tool. Quality is judged with <b>FID</b> (Fréchet Inception Distance, lower = closer to real images), prompt-alignment (CLIP score), and human preference. Decide what you're optimizing.</p>`,
        concepts: ["mod-diffusion", "prob-normal"],
        steps: [{
          type: "decide", prompt: "Which evaluation set fits a generative image model?",
          options: [
            { label: "FID for image realism, a CLIP score for prompt alignment, and a human preference rate", best: true, feedback: "FID measures how close generated images are to the real distribution, CLIP score checks the image matches the prompt, and humans catch what metrics miss. You need all three." },
            { label: "Pixel-wise accuracy against a single target image", feedback: "generation has no single right output — many images can satisfy a prompt. Pixel accuracy is meaningless here." },
            { label: "Classification accuracy", feedback: "there's nothing to classify; you're synthesizing images, not labeling them." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather image-text pairs",
        narrative: `<p>Text-to-image needs images paired with captions. Quality, licensing, and caption accuracy all matter — a model is only as good as its pairs.</p>`,
        concepts: ["mod-contrastive", "dl-word-embeddings"],
        steps: [
          { type: "decide", prompt: "What matters most when sourcing image-caption pairs?",
            options: [
              { label: "Licensed, high-resolution images with accurate captions covering your product domain", best: true, feedback: "clean captions teach prompt alignment, resolution sets a quality ceiling, and licensing keeps you out of legal trouble. All three are non-negotiable." },
              { label: "Any images scraped from the web, captions optional", feedback: "missing/garbage captions break text conditioning, and unlicensed scraping is a legal and ethical landmine." },
              { label: "Tiny thumbnails, since they train faster", feedback: "you can't generate detail the training data never had. Thumbnails cap output quality permanently." }
            ] },
          { type: "run", label: "▶ Assemble the dataset", result: { log: "collecting licensed image-caption pairs...\npairs: 18.0M\nresolution: >=512px 91%\ncaption source: alt-text 60%, human 25%, auto-captioned 15%\nNSFW/violence filter removed: 240,000\nde-duplicated near-identical images: 1.1M", metrics: [{ k: "pairs", v: "18.0M" }, { k: "≥512px", v: "91%" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore & clean",
        narrative: `<p>Generative data hides biases and junk: watermarks, broken aspect ratios, and captions that don't match the image. These flaws get faithfully reproduced in outputs.</p>`,
        concepts: ["mlx-error-analysis", "prob-normal"],
        steps: [
          { type: "run", label: "▶ Profile the dataset", result: { log: "scanning pairs...\nwatermarked images: 6.2% (model would learn to draw watermarks!)\ncaption-image CLIP mismatch (<0.18): 4.7% (drop)\naspect-ratio outliers (panoramas): 2.1%\nduplicated stock photos skewing the distribution: detected\ncolor profile: warm-biased", metrics: [{ k: "watermarked", v: "6.2%" }, { k: "mismatch", v: "4.7%" }] } },
          { type: "decide", prompt: "6.2% of images carry watermarks. Why care for a generator?",
            options: [
              { label: "The model learns watermarks as a 'feature' and paints them onto outputs — filter them out", best: true, feedback: "diffusion models reproduce whatever recurs in training. Leave watermarks in and your generations sprout fake watermarks." },
              { label: "Harmless — watermarks are just pixels", feedback: "those pixels are a consistent pattern the model will memorize and regenerate, degrading every output." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Latents & conditioning",
        narrative: `<p>Diffusing in raw pixel space is expensive. A <b>VAE</b> encodes images into a compact latent; the diffusion model works there and the decoder reconstructs pixels. Text is encoded for conditioning.</p>`,
        concepts: ["mod-vae", "mod-autoencoder", "mod-contrastive"],
        steps: [{
          type: "decide", prompt: "Why train the diffusion model in VAE latent space?",
          options: [
            { label: "Latents are much smaller, so training and sampling are far cheaper with little quality loss", best: true, feedback: "a 512×512 image compresses to a small latent grid. Diffusing there cuts compute dramatically — this is exactly why latent diffusion is the default." },
            { label: "Latent space makes images higher-resolution for free", feedback: "the latent doesn't add resolution; the decoder reconstructs the original size. The win is efficiency, not free detail." },
            { label: "It removes the need for any text conditioning", feedback: "you still encode the prompt and condition on it. The VAE handles images, not the text-to-image link." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick the generator",
        narrative: `<p>Choices for the generator: a <b>diffusion</b> model (denoise noise into an image), a <b>GAN</b> (generator vs discriminator), or a normalizing flow. Each trains differently and has different failure modes.</p>`,
        concepts: ["mod-diffusion", "dl-gan", "mod-normalizing-flows"],
        steps: [{
          type: "decide", prompt: "Choose the generative model.",
          options: [
            { label: "A latent diffusion model with text conditioning", best: true, feedback: "diffusion gives stable training, strong sample quality, and excellent text control — the modern workhorse for text-to-image." },
            { label: "A GAN, for guaranteed easy training", feedback: "GANs are fast at sampling but notoriously unstable — mode collapse and tricky generator/discriminator balance. Not the 'easy' option." },
            { label: "A normalizing flow for exact likelihoods", feedback: "flows give exact likelihood but lag diffusion on image quality at this scale. Nice theory, weaker samples here." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train the diffusion model",
        narrative: `<p>Training teaches the network to predict the noise added at each step (a denoising objective). Backprop drives the loss down over millions of noisy-image examples.</p>`,
        concepts: ["dl-backprop", "prob-normal", "dl-optimizers"],
        steps: [{
          type: "run", label: "▶ Train (predict the noise)",
          result: { log: "training U-Net noise predictor in latent space...\nstep 50k   loss 0.142   FID(val) 38.0\nstep 200k  loss 0.108   FID(val) 19.4\nstep 500k  loss 0.094   FID(val) 12.1\nEMA weights enabled, classifier-free guidance trained", metrics: [{ k: "val FID", v: "12.1" }, { k: "steps", v: "500K" }] } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate quality & alignment",
        narrative: `<p>Low FID means realistic, but does the image match the prompt? Check CLIP alignment and run a human preference test — metrics and people often disagree.</p>`,
        concepts: ["mlx-error-analysis", "mod-contrastive", "prob-normal"],
        steps: [
          { type: "run", label: "▶ Run the eval suite", result: { log: "generating 10,000 samples across prompt set...\nFID: 11.6 (realistic)\nCLIP prompt-alignment: 0.27 avg\nhuman preference vs baseline: 58% win\nfailure modes: hands/fingers 22% malformed, text-in-image garbled 71%, counting ('three cats') wrong 40%", metrics: [{ k: "FID", v: "11.6" }, { k: "CLIP", v: "0.27" }, { k: "hands ⚠", v: "22% bad" }] } },
          { type: "decide", prompt: "FID is good but hands, in-image text, and counting fail often. What's the read?",
            options: [
              { label: "FID alone hides structured failures — target data and conditioning for the weak prompt types before shipping", best: true, feedback: "FID measures distributional realism, not per-prompt correctness. Known weak spots (hands, text, counting) need targeted data/eval, not a green FID rubber-stamp." },
              { label: "Ship — FID 11.6 is great", feedback: "users will immediately notice six-fingered hands and gibberish text. A single aggregate metric can't certify those." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>The weak cases share a cause: the training set was thin on close-up hands and clear text, and counting needs better prompt grounding. The fix is targeted data and conditioning, not just more steps.</p>`,
        concepts: ["mlx-error-analysis", "dl-data-augmentation", "ml-bias-variance"],
        steps: [{
          type: "decide", prompt: "Hands and in-image text keep failing. Best response?",
          options: [
            { label: "Curate more high-quality hand/text examples, improve captions, and fine-tune — then re-measure those slices", best: true, feedback: "structured failures come from data gaps. Targeted curation plus better captions teaches the missing structure; slice-level eval confirms the fix." },
            { label: "Just train 2x longer on the same data", feedback: "more steps on a set that lacks clear hands and text won't teach what isn't there — FID may inch down while hands stay broken." },
            { label: "Increase guidance scale to extreme values", feedback: "very high guidance over-saturates and distorts images; it trades one artifact for another rather than fixing the data gap." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy with safety",
        narrative: `<p>Diffusion sampling is many denoising steps, so latency and cost are real. You also need safety filters on prompts and outputs. Roll out behind a canary.</p>`,
        concepts: ["mod-diffusion", "mod-contrastive"],
        steps: [
          { type: "decide", prompt: "How do you serve it well?",
            options: [
              { label: "Use a fast sampler (fewer steps) + distillation, add prompt/output safety filters, batch on GPU, canary first", best: true, feedback: "step-reduced samplers and distillation cut latency and cost; safety filters block disallowed content; batching maximizes GPU. Canary guards the launch." },
              { label: "Run 1,000 denoising steps per image with no safety filter", feedback: "painfully slow, costly, and unsafe — a single bad output could be a serious incident with no guardrail." }
            ] },
          { type: "run", label: "▶ Deploy (canary 5% → 100%)", result: { log: "loading distilled sampler (20 steps)...\ncanary 5%: p50 latency 1.4s, p99 3.1s\nsafety filter block rate: 0.6% of prompts\ncost: $0.009 / image\npromoting to 100% ... live.", metrics: [{ k: "p99 latency", v: "3.1s" }, { k: "cost/image", v: "$0.009" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain (MLOps)",
        narrative: `<p>Prompts shift with trends, and safety is never "done." Watch prompt drift, sampled output quality and safety-filter hits, regeneration rate, and user save/discard behavior.</p>`,
        concepts: ["mlx-error-analysis", "mod-contrastive", "prob-normal"],
        steps: [
          { type: "decide", prompt: "What belongs on the production dashboard?",
            options: [
              { label: "Prompt-topic drift, sampled FID/CLIP and human spot-checks, safety-filter & regeneration rates, latency/cost, and save-vs-discard rate — with alerts", best: true, feedback: "track inputs (prompt drift), outputs (sampled quality + safety), system (latency/cost), and outcomes (saves, regenerations). Alerts trigger the retrain/curate loop." },
              { label: "Only count total images generated", feedback: "volume says nothing about whether images are good or safe. A quality or safety regression would slip through unseen." }
            ] },
          { type: "run", label: "▶ Check this week's monitors", result: { log: "prompt drift: surge in 'anime style' requests (weak in training data)\nsampled human-good rate (7d): 81% -> 70%  ALERT\nregeneration rate: 1.4 -> 2.3 per session (users unhappy)\nsafety-filter hits: stable 0.6%\naction: curate anime-style data, fine-tune, re-eval slice", metrics: [{ k: "good rate", v: "70% ⚠" }, { k: "regen/session", v: "2.3" }] }, note: `The loop closes here: a trend shifted prompts toward a style the model was weak on, quality dropped, and monitoring caught it via the rising regeneration rate — back to the <b>Data</b> stage. That's the real job.` }
        ]
      }
    ]
  }
});
