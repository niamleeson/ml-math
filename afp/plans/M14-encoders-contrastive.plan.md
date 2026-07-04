# Module Plan — M14 · Encoders & contrastive training

| Field | Value |
|---|---|
| Domain | Domain 2 · Recommenders, Embeddings & Retrieval |
| Skip if you can already… | fine-tune a text encoder with a contrastive objective + hard negatives |
| Maps to (projects) | Creator Marketplace AI |
| Primary structure(s) | S2 Method |
| Example type | ⚑ Both |
| Sub-lessons | 2 |
| Notebooks | 1 |

## Module hub (the "complete list")
Encoder models turn text and other content into retrieval-ready vectors, while contrastive training
teaches which pairs should be close and which should separate. This module focuses on choosing the
encoder shape, understanding InfoNCE-style objectives, and using hard negatives without accidentally
teaching the wrong signal.

- M14.1 · Dual vs cross-encoder & the contrastive objective
- M14.2 · Hard-negative mining & encoder fine-tuning

## Questions this module answers (→ which sub-lesson teaches the answer)
- Dual-encoder vs cross-encoder: which is for retrieval, which is for reranking, and why? → M14.1
- What are sentence encoders such as E5, SBERT, and IRPS-style encoders used for? → M14.1
- How do InfoNCE / contrastive loss and temperature work? → M14.1
- Triplet loss vs in-batch contrastive loss vs hard-negative mining: how do they differ? → M14.2
- How do you fine-tune an encoder for a retrieval task? → M14.2
- Why and how do hard negatives raise the gradient? → M14.2

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- Dual-encoder / bi-encoder vs cross-encoder; retrieve vs rerank tradeoff
- Sentence encoders; E5/SBERT/IRPS-style embedding models; pooling and normalization
- Positive pairs, negatives, false negatives, in-batch negatives
- InfoNCE / contrastive softmax loss with temperature **ƒ**
- Triplet loss and margin **ƒ**
- Hard-negative mining: lexical, model-mined, in-batch, cross-encoder-mined
- Encoder fine-tuning: data construction, batching, objective, validation recall, overfitting slices
- Gradient pressure from high-scoring negatives **ƒ**; temperature effects

## Sub-lessons

### M14.1 · Dual vs cross-encoder & the contrastive objective  —  [S2 Method, ⚑]
- **Makes answerable:** dual- vs cross-encoder for retrieve vs rerank; sentence encoders; InfoNCE/contrastive loss and temperature.
- **You'll be able to say:** "A dual encoder embeds query and item separately so vectors can be precomputed for retrieval; a cross-encoder reads the pair jointly and is usually too expensive for first-stage search but strong for reranking. Sentence encoders like SBERT/E5 produce reusable text vectors. InfoNCE makes the positive pair win a softmax against negatives, and temperature controls how sharply score differences affect the loss."
- **Concepts:** dual-encoder, cross-encoder, sentence encoders, pooling/normalization, positive pairs, in-batch negatives, InfoNCE **ƒ**, temperature **ƒ**.
- **Key Idea focus:** step-by-step objective — encode query/item, score all pairs in a batch, divide by temperature, softmax over candidates, and penalize the positive if it is not highest.
- **Worked-example shape:** 10 basics → 5 easy → 5 advanced: classify architectures as retrieve/rerank; compute a tiny similarity matrix; calculate one InfoNCE row; lower temperature and observe sharper probabilities.
- **Notebook:** Yes — simulate embeddings with small numpy vectors; compute InfoNCE on a tiny batch; `assert` lowering the positive score increases loss; no transformer weight downloads. Break case = collapsed embeddings where every pair has similar score and recall is poor.
- **Real numbers to cite:** scores `[2.0, 1.0, 0.0]` at temperature 1.0 give a softer positive probability than the same scores at temperature 0.1; lower temperature magnifies hard negatives and can destabilize if labels are noisy.

### M14.2 · Hard-negative mining & encoder fine-tuning  —  [S2 Method, ⚑]
- **Makes answerable:** triplet vs in-batch vs hard-negative mining; fine-tuning an encoder; how hard negatives raise the gradient.
- **You'll be able to say:** "Triplet loss enforces a margin between a positive and one negative; in-batch contrastive loss uses the other batch items as many negatives; hard-negative mining adds wrong but plausible items so the model learns fine distinctions. A hard negative raises loss and gradient because its score competes with the positive in the softmax, but false negatives can damage the encoder, so mining needs filtering and slice validation."
- **Concepts:** triplet loss **ƒ**, in-batch negatives, hard negatives, false negatives, model-mined negatives, cross-encoder-mined negatives, encoder fine-tuning loop, gradient pressure **ƒ**, validation recall.
- **Key Idea focus:** step-by-step fine-tuning loop — collect positives, mine/filter negatives, batch examples, train with contrastive/triplet objective, validate recall@k and hard-negative slices, refresh mined negatives.
- **Worked-example shape:** 10 basics → 5 easy → 5 advanced: compare easy vs hard negatives in a similarity table; compute triplet margin violation; show a hard negative increasing InfoNCE loss; design a mining/filtering recipe for Creator Marketplace queries.
- **Notebook:** No — the M14.1 notebook includes the hard-negative loss simulation; this sub-lesson uses design drills and hand calculations for mining choices.
- **Real numbers to cite:** with positive score 3.0, easy negative 0.2, and hard negative 2.8, the hard negative contributes most of the softmax denominator; a triplet margin of 0.5 is violated if `s(q,n) > s(q,p) - 0.5`.

## Coverage check
All 6 module questions map to a sub-lesson: retrieve/rerank architecture, sentence encoders, InfoNCE, and temperature → M14.1; triplet/in-batch/hard negatives, fine-tuning, and gradient effect → M14.2. No gaps.

## Decision guide
Dual encoder vs cross-encoder: use dual encoders for first-stage retrieval and precomputed vectors; use cross-encoders for reranking a small candidate set when pairwise interaction quality matters. Easy negatives stabilize early training; hard negatives improve discrimination after the model has a reasonable baseline; avoid unfiltered hard negatives when false negatives are likely. Contrastive softmax fits large in-batch training; triplet loss is useful for explicit anchor-positive-negative teaching but can be less sample-efficient.

## Resources (from the guide)
- Sentence-Transformers docs (bi-/cross-encoders and training losses)
- Lil'Log — Contrastive Representation Learning (InfoNCE, triplet, in-batch negatives)

## SOTA papers (from the guide)
- Sentence-BERT (Reimers & Gurevych, 2019)
- SimCSE (Gao et al., 2021)
- E5 (Wang et al., 2022)
- CPC / InfoNCE (van den Oord et al., 2018)
- SimCLR (Chen et al., 2020)
- MoCo (He et al., 2020)

## Notes / caveats
- Notebook must simulate embeddings with small numpy vectors and must not download transformer weights.
- Use formulas only for InfoNCE/triplet/score effects; do not add unnecessary transformer math.
- Keep Creator Marketplace examples focused on text/profile/listing retrieval and hard negatives that are plausible but incorrect.
