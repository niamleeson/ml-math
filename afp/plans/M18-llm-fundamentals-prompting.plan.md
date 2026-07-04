# Module Plan — M18 · LLM fundamentals + prompting

| Field | Value |
|---|---|
| Domain | Domain 4 · Applied LLMs / GenAI |
| Skip if you can already… | explain tokens/context, few-shot, structured output |
| Maps to (projects) | all |
| Primary structure(s) | S5 Concept / Framework |
| Example type | 💻 Colab |
| Sub-lessons | 2 |
| Notebooks | 1 |

## Module hub (the "complete list")
LLMs are next-token models wrapped in product constraints: tokens cost money, context is finite, sampling changes behavior, and prompts need structure to be reliable. This module explains the core mechanics, then turns them into practical prompting patterns.

- M18.1 · How an LLM works: tokens, context, next-token probabilities, sampling
- M18.2 · Prompting: zero/few-shot, chain-of-thought, structured output, failure modes

## Questions this module answers (→ which sub-lesson teaches the answer)
- What is tokenization, and why does it matter for cost and context? → M18.1
- What does autoregressive next-token prediction mean, and how does the context window constrain it? → M18.1
- How do temperature and top-p sampling change outputs? → M18.1
- What are zero-shot, few-shot, and chain-of-thought prompting? → M18.2
- How do you ask for reliable structured JSON output? → M18.2
- What is perplexity, and how can it evaluate a language model? → M18.1
- What common failure modes do LLM applications have? → M18.2

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- Tokenization; token budget; context window
- Autoregressive next-token probability `P(x_t | x_<t)` **ƒ**
- Softmax over logits; temperature; top-p / nucleus sampling **ƒ**
- Zero-shot, few-shot, and chain-of-thought prompting
- Structured output / JSON schemas / validation-and-retry
- Sequence log-probability and perplexity **ƒ**
- Hallucination, prompt injection, brittleness, recency/context loss, nondeterminism

## Sub-lessons

### M18.1 · How an LLM works: tokens, context, next-token probabilities, sampling  —  [S5 Concept, 💻]
- **Makes answerable:** tokenization and why it matters; autoregressive next-token prediction and context windows; temperature/top-p sampling; perplexity and LM evaluation.
- **You'll be able to say:** "An LLM turns text into tokens, repeatedly predicts the next-token distribution from the current context, and is limited by the context window. Temperature rescales logits before softmax, top-p samples from the smallest high-probability prefix, and perplexity is the exponentiated average negative log-probability of the observed sequence."
- **Concepts:** tokenization, context window, `P(x_t | x_<t)` **ƒ**, softmax/temperature/top-p **ƒ**, sequence log-probability, perplexity **ƒ**.
- **Key Idea focus:** vocabulary + structure — how generation flows from tokens → logits → probabilities → sampled next token.
- **Worked-example shape:** small illustrative cases: count tokens roughly; compute a tiny softmax; change temperature; compute sequence log-prob and perplexity over a toy sentence.
- **Notebook:** Yes — NumPy toy vocabulary with logits for 5 tokens; show temperature effects, top-p filtering, sequence log-probability, and perplexity; `assert` probabilities sum to 1 and lower probability sequences have higher perplexity. Break case = high temperature produces unstable/low-confidence choices.
- **Real numbers to cite:** logits `[4, 2, 0]` at temperature 1 give probabilities ≈ `[0.867, 0.117, 0.016]`; at temperature 2 they flatten to ≈ `[0.665, 0.245, 0.090]`.

### M18.2 · Prompting: zero/few-shot, chain-of-thought, structured output, failure modes  —  [S5 Concept, 💻]
- **Makes answerable:** zero-shot vs few-shot vs chain-of-thought; reliable structured JSON output; common failure modes.
- **You'll be able to say:** "Zero-shot asks directly; few-shot supplies examples that define the task format; chain-of-thought asks for intermediate reasoning when reasoning is needed, though products may hide it. For structured output, specify a schema, constrain allowed fields, validate, and retry or fallback. LLMs can hallucinate, ignore instructions under injection, be brittle to wording, and vary under sampling."
- **Concepts:** zero-shot, few-shot, chain-of-thought, structured output, schemas, validation, hallucination, prompt injection, nondeterminism.
- **Key Idea focus:** prompting as an interface contract: task, context, examples, output schema, and fallback behavior.
- **Worked-example shape:** small illustrative cases: same task as zero-shot then few-shot; convert a free-form answer into JSON; validate and repair invalid JSON; identify when not to use chain-of-thought.
- **Notebook:** No — no API calls or model downloads; pair with M18.1's toy probability notebook and keep prompting examples in the lesson text.
- **Real numbers to cite:** a JSON contract with exactly 3 keys (`intent`, `slots`, `confidence`) and a validation rule `0 ≤ confidence ≤ 1`; invalid outputs route to retry or fallback.

## Coverage check
All 7 module questions are covered: tokens, context, next-token prediction, sampling, and perplexity → M18.1; zero/few-shot/CoT, structured JSON, and failure modes → M18.2. No gaps.

## Decision guide
| Need | Prompting pattern | Watch out |
|---|---|---|
| Simple known task | Zero-shot | Be explicit about output format. |
| Teach custom labels or style | Few-shot | Examples can bias edge cases. |
| Multi-step reasoning | Chain-of-thought / reasoning prompt | Prefer concise final answers in product UX; validate results. |
| Product integration | Structured JSON + schema validation | Always validate and fallback on parse/schema failure. |

## Resources (from the guide)
- HuggingFace — LLM course (tokens, sampling, generation)
- DeepLearning.AI — ChatGPT Prompt Engineering (few-shot, structure, guardrails)

## SOTA papers (from the guide)
- GPT-3 / Language Models are Few-Shot Learners (Brown et al., 2020)
- Chain-of-Thought Prompting (Wei et al., 2022)
- InstructGPT (Ouyang et al., 2022)

## Notes / caveats
- Keep the genuine math to softmax/temperature/top-p, autoregressive probability, and perplexity. Do not force equations onto prompting patterns.
- Notebook should be CPU-only NumPy over a tiny vocabulary; no API keys, no model downloads, and no hidden service dependencies.
