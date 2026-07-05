# M18 · LLM fundamentals + prompting
> **Domain:** Domain 4 · Applied LLMs / GenAI · **Maps to:** all · **Skip if you can already…** explain tokens/context, few-shot, structured output

## Overview

An LLM product is not just a model call. It is a next-token model wrapped in constraints: text must fit into tokens, context is finite, sampling changes reliability, and prompts need enough structure that downstream code can trust the result.

This module gives you the minimum mechanics needed to reason about LLM behavior, then turns those mechanics into prompting patterns: zero-shot, few-shot, reasoning prompts, structured output, validation, and fallback.

**By the end you can answer:**
- What is tokenization, and why does it matter for cost and context?
- What does autoregressive next-token prediction mean, and how does the context window constrain it?
- How do temperature and top-p sampling change outputs?
- What are zero-shot, few-shot, and chain-of-thought prompting?
- How do you ask for reliable structured JSON output?
- What is perplexity, and how can it evaluate a language model?
- What common failure modes do LLM applications have?

Two sub-lessons:

- **M18.1 LLM mechanics** — tokens, context windows, next-token probabilities, sampling, and perplexity.
- **M18.2 Prompting as an interface contract** — examples, schemas, validation, and failure modes.

---

## M18.1 · LLM mechanics

**The idea.** A language model turns text into tokens, looks at the current context, predicts a probability distribution over the next token, samples or selects one token, appends it, and repeats.

**Everyday analogy.** Think of tokens as LEGO pieces of text: sometimes a whole word is one brick, sometimes a word is split into smaller bricks, and punctuation or spaces can be bricks too. The **context window** is the desk space that can hold only so many bricks at once; anything that falls off the desk cannot influence the next piece. **Temperature** is a creativity dial: low settings keep choosing the safest next brick, while higher settings allow more surprising but riskier choices.

The core autoregressive statement is:

$$P(x_t \mid x_{<t}),$$

meaning "the probability of the next token given the previous tokens." For a whole sequence, the model assigns probability by multiplying the next-token probabilities at each position, or equivalently by summing log-probabilities.

**Tokens and context.** Tokens are model vocabulary units: sometimes whole words, sometimes word pieces, punctuation, whitespace, or fragments. Tokenization matters because:

- **Cost:** APIs usually charge by input and output tokens.
- **Latency:** more tokens take more compute.
- **Context window:** the model can only condition on a bounded number of tokens.
- **Reliability:** if instructions or evidence fall outside the window, the model cannot use them.

A long campaign brief, retrieved docs, examples, and output instructions all compete for the same context budget. Good LLM systems reserve space for the answer and keep only the evidence that matters.

**From logits to probabilities.** The model produces logits, then softmax converts them into probabilities. Temperature rescales logits before softmax:

$$p_i = \frac{\exp(z_i/T)}{\sum_j \exp(z_j/T)}.$$

- Lower temperature (`T < 1`) sharpens the distribution: more deterministic.
- Higher temperature (`T > 1`) flattens the distribution: more varied.
- `T = 0` is often implemented as greedy or near-greedy decoding, not literal division by zero.

With logits `[4, 2, 0]`:

- at temperature 1, probabilities are about `[0.867, 0.117, 0.016]`;
- at temperature 2, probabilities flatten to about `[0.665, 0.245, 0.090]`.

```python
import numpy as np

def softmax(logits, temperature=1.0):
    z = np.array(logits) / temperature
    z = z - z.max()
    p = np.exp(z) / np.exp(z).sum()
    return p

assert np.allclose(softmax([4, 2, 0]).sum(), 1.0)
print(softmax([4, 2, 0], temperature=1.0))
print(softmax([4, 2, 0], temperature=2.0))
```

**Top-p sampling.** Top-p, also called nucleus sampling, sorts tokens by probability and samples only from the smallest prefix whose cumulative probability is at least `p`. If probabilities are `[0.50, 0.25, 0.15, 0.10]` and `top_p=0.80`, the candidate set is the first three tokens because `0.50+0.25+0.15=0.90`. It removes the long tail while still allowing multiple plausible outputs.

**Perplexity.** Perplexity measures how surprised the model is by a sequence. For average negative log-probability $L$, perplexity is:

$$\text{perplexity}=\exp(L).$$

Lower perplexity means the model assigned higher probability to the observed text. It is useful for comparing language models on held-out text, but it does not guarantee product quality: a model can have low perplexity and still hallucinate, ignore instructions, or fail a task-specific schema.

**Worked example — choosing sampling settings.** For deterministic extraction, such as converting a campaign request into JSON, use low temperature and tight output constraints. For brainstorming ad-copy variants, use a higher temperature or top-p to get diversity, then filter and rank the candidates. The same base model can behave like a stable parser or a creative generator depending on decoding settings.

**You'll be able to say:** *"An LLM tokenizes text, repeatedly predicts P(next token | context), and is limited by the context window. Temperature rescales logits before softmax, top-p samples from the high-probability nucleus, and perplexity is exp(average negative log-probability). Tokens matter for cost, latency, context, and whether the model can even see the needed evidence."*

---

## M18.2 · Prompting as an interface contract

**The idea.** A prompt is the contract between your product and the model. A reliable prompt states the task, supplies necessary context, gives examples when the task is custom, specifies the output shape, and defines what to do when the model is uncertain.

**Everyday analogy.** Prompting is like training a temp worker with a task card. **Zero-shot** is "please do this"; **few-shot** is showing a few completed forms before handing over a new one. **Structured output** is giving the worker a fill-in-the-blank form, such as a JSON schema, so downstream software knows exactly where to read the answer. Confidence and fallback rules are the instructions for when to ask a supervisor instead of guessing.

**Prompting patterns.**

- **Zero-shot:** ask directly with no examples. Best for common tasks and simple transformations.
- **Few-shot:** include input/output examples. Best when labels, tone, or formatting are product-specific.
- **Chain-of-thought / reasoning prompts:** ask the model to reason through a hard task. In production, you usually want the model to use reasoning internally but return a concise final answer or structured result.
- **Structured output:** specify JSON fields, allowed values, and validation rules.

**Worked example — few-shot + JSON schema for query understanding.** Suppose Search Ads receives a natural-language request and needs a structured interpretation.

```text
System: You convert advertising queries into JSON. Return only valid JSON.

Schema:
{
  "intent": "find_campaigns" | "estimate_audience" | "create_ad_draft",
  "slots": {
    "topic": "string or null",
    "geo": "string or null",
    "budget_usd": "number or null"
  },
  "confidence": "number from 0 to 1"
}

Example 1
User: "show campaigns about data science in Canada"
Assistant: {"intent":"find_campaigns","slots":{"topic":"data science","geo":"Canada","budget_usd":null},"confidence":0.92}

Example 2
User: "draft ads for a $500 AI course launch"
Assistant: {"intent":"create_ad_draft","slots":{"topic":"AI course launch","geo":null,"budget_usd":500},"confidence":0.88}

User: "find campaigns for fintech in New York"
Assistant:
```

A good output is:

```json
{"intent":"find_campaigns","slots":{"topic":"fintech","geo":"New York","budget_usd":null},"confidence":0.91}
```

The examples teach the label set, the slot names, and the exact JSON shape. The schema makes downstream validation possible.

**Validation and retry.** Never assume a model's JSON is valid just because you asked for JSON. Parse it, validate allowed fields, check required slots, and ensure numeric ranges like `0 <= confidence <= 1`. If validation fails, retry with the error message or fallback to a safe path.

```python
required = {"intent", "slots", "confidence"}
obj = parse_model_json(text)
assert required <= set(obj)
assert 0 <= obj["confidence"] <= 1
```

**Common failure modes.**

- **Hallucination:** the model invents facts not in context.
- **Prompt injection:** untrusted input tells the model to ignore developer instructions.
- **Brittleness:** small wording changes cause different behavior.
- **Recency or context loss:** important details are far away, truncated, or buried.
- **Nondeterminism:** sampling produces different valid-looking outputs.
- **Schema drift:** the model returns extra fields, missing fields, or wrong types.

**Worked example — from brittle prompt to product prompt.** A brittle prompt says:

```text
Extract the campaign info from this request.
```

It may return prose, omit confidence, or invent missing fields. A product-ready prompt says:

```text
Extract only the fields in the schema. Use null for missing values.
If the request is ambiguous, set confidence below 0.75 and include no invented slots.
Return JSON only.
```

For `"campaign for Java in NY"`, the model might not know whether Java means programming or coffee. A good structured output lowers confidence instead of silently choosing:

```json
{"intent":"find_campaigns","slots":{"topic":"Java","geo":"NY","budget_usd":null},"confidence":0.62}
```

The application can then ask a clarification: "Do you mean Java programming or coffee?"

**You'll be able to say:** *"Zero-shot asks directly; few-shot supplies examples that define labels and format; reasoning prompts help with multi-step tasks but products should return concise validated outputs. For JSON, specify a schema, allowed values, missing-value behavior, confidence, and fallback. Then parse, validate, retry, or fallback because LLMs can hallucinate, be injected, be brittle, and vary under sampling."*

---

## Resources
- **HuggingFace — LLM course** (tokens, sampling, generation)
- **DeepLearning.AI — ChatGPT Prompt Engineering** (few-shot, structure, guardrails)

## Papers
- **GPT-3 / Language Models are Few-Shot Learners** (Brown et al., 2020)
- **Chain-of-Thought Prompting** (Wei et al., 2022)
- **InstructGPT** (Ouyang et al., 2022)
