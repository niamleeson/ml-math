# M19 · RAG & query understanding
> **Domain:** Domain 4 · Applied LLMs / GenAI · **Maps to:** all · **Skip if you can already…** build retrieval-grounded query interpretation with a low-confidence fallback

## Overview

RAG turns an LLM from a memory-only generator into a grounded product system. Instead of asking the model to answer from whatever is in its weights, you retrieve evidence, rerank it, pass the best chunks into the prompt, and require the answer to stay supported by that evidence.

Query understanding adds the product layer: convert messy natural language into typed intent and slots, then refuse or clarify when confidence is low. This is central for Search Ads, Creator Marketplace, support assistants, and any system where executing the wrong interpretation is worse than asking a follow-up.

**By the end you can answer:**
- What is RAG, and why ground generation in retrieved evidence?
- How do retrieval and reranking feed the generator?
- How do you parse natural language into structured intent and slots?
- How do confidence thresholds and low-confidence fallbacks work?
- How do you measure faithfulness/grounding and retrieval recall?
- How do chunking and embeddings affect RAG quality?

Two sub-lessons:

- **M19.1 The RAG pipeline** — retrieve, rerank, generate, measure recall, and check faithfulness.
- **M19.2 Query understanding** — NL→structured intent/slots with confidence gates and fallback.

---

## M19.1 · The RAG pipeline

**The idea.** Retrieval-augmented generation has three main steps:

1. **Retrieve:** find candidate chunks likely to contain evidence.
2. **Rerank:** reorder candidates with a stronger relevance model or product rules.
3. **Generate:** answer using only the selected evidence, ideally with citations or traceable support.

The failure it prevents is hallucination. A model without evidence may produce a fluent but unsupported answer. A grounded system can say, "I found supporting chunks A and B," or "I do not have enough evidence."

**Chunking.** RAG quality starts before retrieval. Chunks should be small enough to retrieve precisely but large enough to contain complete facts. If a campaign policy's condition is in one chunk and its exception is in another, recall@1 may retrieve only half the truth. Overlap can help, but too much overlap wastes context.

**Embeddings and similarity.** Dense retrieval embeds the query and each chunk into vectors, then ranks chunks by similarity. A common score is cosine similarity:

$$\cos(q,c)=\frac{q\cdot c}{\|q\|\|c\|}.$$

Use this formula because it is the actual retrieval score in many vector systems, not because every RAG concept needs math.

**Retrieval recall.** If the gold evidence is in the top `k` retrieved chunks, recall@k for that query is 1; otherwise it is 0. Averaged over queries, recall@k tells you whether the retriever gives the generator a chance to be correct. If recall is low, prompting cannot reliably fix the system because the needed evidence never reaches the model.

**Worked example — naive answer, break, fix.** A support assistant is asked:

```text
Can sponsored video creative be edited after campaign launch?
```

Naive LLM-only answer:

```text
Yes, you can usually edit creative at any time.
```

That may be fluent but unsupported. Instead, retrieve policy chunks. Suppose the query vector scores three chunks:

| chunk | text summary | cosine score |
|---|---|---:|
| A | Sponsored video edit restrictions after launch | 0.82 |
| B | Campaign budget editing rules | 0.74 |
| C | Billing contact setup | 0.21 |

With threshold `0.70`, chunks A and B are eligible; a reranker puts A first because it directly matches "sponsored video creative." With threshold `0.85`, no chunk passes, so the system should fallback rather than answer.

A grounded prompt says:

```text
Answer only from the evidence below. If the evidence does not answer, say you do not know.
Evidence:
[A] Sponsored video creative cannot be edited after launch; create a new creative instead.
[B] Campaign budgets can be edited while a campaign is active.
Question: Can sponsored video creative be edited after campaign launch?
```

Grounded answer:

```text
No. The retrieved policy says sponsored video creative cannot be edited after launch; create a new creative instead. [A]
```

**Break case — bad chunking.** If chunk A were split into:

- A1: "Sponsored video creative cannot be edited..."
- A2: "...after launch; create a new creative instead."

and retrieval returns only A2, the generator may miss the rule's subject. Fix by chunking at policy-section boundaries, adding overlap, or using a reranker that can recover adjacent chunks.

**Faithfulness and grounding.** A faithful answer only states claims supported by retrieved evidence. Practical checks include citation coverage, answer-vs-evidence entailment, human review for high-risk flows, and automatic refusal when evidence confidence is low. Retrieval recall asks, "Did we find the right evidence?" Faithfulness asks, "Did the answer stay within that evidence?"

**You'll be able to say:** *"RAG retrieves candidate chunks, reranks them, then generates from the best evidence so answers can be cited and constrained. Chunking and embeddings determine whether the right facts are retrievable; recall@k measures whether gold evidence appears in the top k; faithfulness checks whether the final answer is supported. If retrieval confidence is low, fallback instead of hallucinating."*

---

## M19.2 · Query understanding

**The idea.** Query understanding converts natural language into a structured representation that software can execute: an **intent**, typed **slots**, confidence, and fallback reason when needed. The pitfall is silently executing the wrong query.

For Search Ads or Creator Marketplace, users often write short ambiguous requests:

- "creators for java in NY"
- "AI ads under 5k"
- "find fintech leads in London"

The system needs to decide what action is requested, extract fields, validate them, and ask a clarification when confidence is too low.

**A simple schema.**

```json
{
  "intent": "find_creator | estimate_audience | find_campaigns",
  "slots": {
    "topic": "string or null",
    "location": "string or null",
    "budget_usd": "number or null"
  },
  "confidence": "number from 0 to 1",
  "fallback_reason": "string or null"
}
```

**Worked example — NL query to structured filter JSON.** User query:

```text
Find creators for AI in NYC with audience over 50k
```

Structured interpretation:

```json
{
  "intent": "find_creator",
  "slots": {
    "topic": "AI",
    "location": "NYC",
    "min_audience_size": 50000
  },
  "confidence": 0.91,
  "fallback_reason": null
}
```

Executable filter:

```json
{
  "entity": "creator",
  "filters": {
    "topics": {"contains": "AI"},
    "location": {"equals": "NYC"},
    "audience_size": {"gte": 50000}
  }
}
```

Because confidence is above a threshold like `0.75` and required slots are present, the system can execute the search.

**Low-confidence fallback.** Now consider:

```text
creators for java in NY
```

`Java` may mean programming or coffee; `NY` may mean New York City or New York State. A safe output is:

```json
{
  "intent": "find_creator",
  "slots": {
    "topic": "Java",
    "location": "NY"
  },
  "confidence": 0.62,
  "fallback_reason": "Ambiguous topic: Java programming vs coffee; ambiguous location: NYC vs New York State"
}
```

Confidence is below `0.75`, so the product should not execute a narrow search. It should ask:

```text
Do you mean Java programming or coffee, and should NY mean New York City or New York State?
```

**Validation rules.** A production query-understanding layer should check:

- intent is one of the allowed actions;
- required slots for that intent are present;
- slot values have the right type;
- values are normalized to canonical forms where possible;
- confidence is calibrated enough to support the threshold;
- conflicting slots trigger clarification instead of execution.

**Naive → break → fix.** A keyword parser might map every query containing `creator` to `find_creator` and every capitalized token to a topic. It will execute `creators for java in NY` as `topic=Java programming, location=NYC` even if the user meant coffee creators in New York State. The fix is a schema-driven interpreter with confidence, ambiguity detection, and a fallback path.

**How it connects to RAG.** Query understanding can sit before retrieval: parse intent and filters, retrieve only eligible documents or creators, rerank, then generate a grounded explanation. It can also sit after retrieval: use retrieved policy or catalog evidence to normalize slots. Either way, the same rule applies: if confidence or evidence is weak, do not pretend certainty.

**You'll be able to say:** *"A query-understanding layer turns free text into intent, slots, confidence, and fallback reason. It validates required fields and types, normalizes values, and uses a threshold such as 0.75 to decide execute vs clarify. Low-confidence, ambiguous, or conflicting interpretations should ask a targeted follow-up rather than silently running the wrong structured query."*

---

## Resources
- **DeepLearning.AI — Advanced RAG** (retrieval, reranking, grounding)
- **LlamaIndex docs** (RAG pipelines)
- **Pinecone — RAG guide** (chunking, embeddings, retrieval)

## Papers
- **Retrieval-Augmented Generation** (Lewis et al., 2020)
- **Dense Passage Retrieval** (Karpukhin et al., 2020)
