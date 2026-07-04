# Module Plan — M19 · RAG & query understanding (NL→structured)

| Field | Value |
|---|---|
| Domain | Domain 4 · Applied LLMs / GenAI |
| Skip if you can already… | build retrieval-grounded query interpretation with a low-confidence fallback |
| Maps to (projects) | all |
| Primary structure(s) | S6 Applied Engineering / Pitfall |
| Example type | ⚑ Both |
| Sub-lessons | 2 |
| Notebooks | 1 |

## Module hub (the "complete list")
RAG turns an LLM from a memory-only generator into a grounded system: retrieve evidence, rerank it, and generate only from what was found. Query understanding adds the product layer: convert natural language into intent and slots, then fallback when confidence is too low.

- M19.1 · The RAG pipeline: retrieve → rerank → generate, grounding, faithfulness
- M19.2 · Query understanding: NL→structured with confidence fallback

## Questions this module answers (→ which sub-lesson teaches the answer)
- What is RAG, and why ground generation in retrieved evidence? → M19.1
- How do retrieval and reranking feed the generator? → M19.1
- How do you parse natural language into structured intent and slots? → M19.2
- How do confidence thresholds and low-confidence fallbacks work? → M19.2
- How do you measure faithfulness/grounding and retrieval recall? → M19.1
- How do chunking and embeddings affect RAG quality? → M19.1

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- Retrieve → augment → generate pipeline
- Dense embeddings, chunking, cosine similarity **ƒ**
- Reranking
- Grounding and faithfulness
- Retrieval recall / recall@k **ƒ**
- Natural language → structured representation: intent + slots
- Confidence threshold and low-confidence fallback

## Sub-lessons

### M19.1 · The RAG pipeline: retrieve → rerank → generate, grounding, faithfulness  —  [S6 Applied, ⚑]
- **Makes answerable:** what RAG is and why ground generation; how retrieval + reranking feed generation; measuring faithfulness/grounding and retrieval recall; chunking and embedding effects.
- **You'll be able to say:** "RAG first retrieves candidate chunks, often reranks them for relevance, then passes the best evidence to the generator so answers can cite or stay constrained to source material. Quality depends on chunks that contain complete facts, embeddings that retrieve the right neighborhood, recall@k for finding evidence, and faithfulness checks that the answer is supported by retrieved text."
- **Concepts:** retrieve→augment→generate, embeddings, cosine similarity **ƒ**, chunking, reranking, grounding, faithfulness, retrieval recall **ƒ**.
- **Key Idea focus:** correct pipeline + the hallucination it prevents.
- **Worked-example shape:** naive → break → fix → scale: ask a generator without evidence; observe unsupported answer; retrieve/rerank chunks; answer only when supporting chunks pass relevance/faithfulness checks.
- **Notebook:** Yes — NumPy cosine scoring over small synthetic chunks; rank chunks, apply top-k and a confidence threshold, and decide answer-vs-fallback; `assert` the correct chunk ranks top for an in-domain query and fallback triggers for an out-of-domain query. Break case = chunking splits the needed fact across two chunks so recall@1 fails.
- **Real numbers to cite:** query vector cosine scores `[0.82, 0.74, 0.21]`; threshold 0.70 returns evidence, threshold 0.85 falls back; recall@3 = 1.0 when the gold chunk is in the top 3.

### M19.2 · Query understanding: NL→structured with confidence fallback  —  [S6 Applied, ⚑]
- **Makes answerable:** parsing NL into structured intent + slots; confidence thresholds and low-confidence fallback; how this maps to Creator Marketplace query understanding.
- **You'll be able to say:** "A query-understanding layer turns free text into a typed intent plus slots, for example `find_creator` with `topic=AI` and `location=NYC`. It should attach confidence, validate required slots, and fallback to clarification or safe defaults when confidence is below threshold or slots conflict."
- **Concepts:** NL→structured, intent, slots, schema validation, confidence threshold, fallback.
- **Key Idea focus:** correct interpretation pipeline + the failure it prevents: silently executing the wrong query.
- **Worked-example shape:** naive → break → fix → scale: keyword parser misreads an ambiguous marketplace query; add schema, slot validation, confidence, and fallback; scale to a small intent catalog.
- **Notebook:** No — the module notebook in M19.1 covers scoring/threshold mechanics; M19.2 uses worked product examples and schema tables.
- **Real numbers to cite:** confidence threshold 0.75; `"creators for java in NY"` may produce `topic=Java programming` at 0.62 and must ask a clarification instead of executing; valid structured output has `intent`, `slots`, `confidence`, and `fallback_reason` when applicable.

## Coverage check
All 6 module questions are covered: RAG definition, retrieval/reranking, grounding metrics, recall, chunking, and embeddings → M19.1; NL→structured parsing plus confidence/fallback → M19.2. No gaps.

## Decision guide
| Situation | Action | Why |
|---|---|---|
| Evidence retrieved with high confidence | Generate grounded answer from cited chunks | The system has support. |
| Retrieval low confidence or no relevant chunk | Fallback / ask clarification | Prevents hallucinated answers. |
| Intent confident but required slot missing | Ask targeted follow-up | Avoids executing an underspecified query. |
| Ambiguous intent or conflicting slots | Return alternatives / clarify | Prevents wrong structured query. |

## Resources (from the guide)
- DeepLearning.AI — Advanced RAG (retrieval, reranking, grounding)
- LlamaIndex docs (RAG pipelines)
- Pinecone — RAG guide (chunking, embeddings, retrieval)

## SOTA papers (from the guide)
- Retrieval-Augmented Generation (Lewis et al., 2020)
- Dense Passage Retrieval (Karpukhin et al., 2020)

## Notes / caveats
- Worked example should explicitly follow naive ungrounded answer → hallucination/low-confidence break → retrieve + threshold + fallback fix.
- Maps naturally to Creator Marketplace query understanding even though the guide says maps to all; use marketplace-flavored examples without making the module marketplace-only.
- Do not force extra math beyond cosine similarity and recall@k; most of the lesson is engineering and evaluation prose.
