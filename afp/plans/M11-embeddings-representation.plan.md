# Module Plan — M11 · Embeddings & representation learning

| Field | Value |
|---|---|
| Domain | Domain 2 · Recommenders, Embeddings & Retrieval |
| Skip if you can already… | explain what an embedding space encodes and how you'd evaluate it |
| Maps to (projects) | all |
| Primary structure(s) | S2 Method |
| Example type | ⚑ Both |
| Sub-lessons | 2 |
| Notebooks | 2 |

## Module hub (the "complete list")
Embeddings turn IDs, text, and behavior into dense vectors so similarity search and downstream
models can work with meaning-like geometry. This module teaches what that geometry can and cannot
claim, how common embedding families are learned, and how to judge whether a space is useful.

- M11.1 · What embeddings encode & similarity
- M11.2 · Learning & evaluating embeddings

## Questions this module answers (→ which sub-lesson teaches the answer)
- What does embedding geometry — distance, angle, and neighborhood structure — encode? → M11.1
- Cosine vs dot-product similarity: what changes, and why normalize vectors? → M11.1
- How are embeddings learned in skip-gram/word2vec, matrix factorization, and encoders? → M11.2
- What makes a good embedding space, including alignment and uniformity? → M11.2
- How do you evaluate embeddings with retrieval recall, downstream tasks, and probing? → M11.2
- ID embeddings vs text embeddings: what do they capture, and when do they fail? → M11.1, M11.2

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- Dense vectors; embedding space; dimensions as latent factors, not guaranteed human-readable axes
- Distance, angle, nearest neighbors, clusters, analogies as cautious diagnostics
- Cosine similarity **ƒ**; dot-product scoring **ƒ**; L2 normalization and vector norm effects
- Skip-gram / word2vec objective with negative sampling **ƒ**; co-occurrence windows
- Matrix factorization for user/item or entity/item embeddings **ƒ**
- Encoder-produced embeddings for text or multimodal inputs
- Alignment and uniformity **ƒ**; anisotropy; collapse; hubness
- Evaluation: retrieval recall@k, downstream metric lift, probing/classification, qualitative neighbor checks
- ID embeddings vs text embeddings; memorization vs semantic generalization; cold-start behavior

## Sub-lessons

### M11.1 · What embeddings encode & similarity  —  [S2 Method, ⚑]
- **Makes answerable:** what embedding geometry encodes; cosine vs dot-product and why normalize; ID vs text embeddings at a conceptual level.
- **You'll be able to say:** "An embedding space encodes what the training signal made nearby: co-clicked items, similar text, or shared labels. Dot product rewards both direction and norm, while cosine reads mostly angle after normalization; normalize when norm should not act like popularity or confidence. ID embeddings memorize observed entities, while text embeddings can generalize by content but may miss platform-specific behavior."
- **Concepts:** dense vectors, neighborhoods, cosine similarity **ƒ**, dot product **ƒ**, L2 normalization, vector norms, ID vs text embeddings.
- **Key Idea focus:** step-by-step similarity reading — inspect vector norms, choose the score, normalize if appropriate, then interpret neighbors as model-induced evidence rather than truth.
- **Worked-example shape:** 10 basics → 5 easy → 5 advanced: compute cosine vs dot for tiny vectors; show a high-norm popular item winning by dot product; normalize and compare neighborhood changes; diagnose an ID-only cold-start failure.
- **Notebook:** Yes — small numpy vectors for items/text snippets; `assert` normalized dot equals cosine; neighbor table before/after normalization. Break case = one high-norm "popular" vector dominates dot-product rankings despite poor angle.
- **Real numbers to cite:** query `[1, 0]`, item A `[10, 0]`, item B `[0.8, 0.6]`: dot scores 10 vs 0.8, cosine scores 1.0 vs 0.8; norm changed the ranking strength, not the angle.

### M11.2 · Learning & evaluating embeddings  —  [S2 Method, ⚑]
- **Makes answerable:** how embeddings are learned by skip-gram/word2vec, matrix factorization, and encoders; what makes a good space; how to evaluate with retrieval, downstream tasks, and probing; ID vs text tradeoffs in evaluation.
- **You'll be able to say:** "Embedding learning chooses vectors so positives score above negatives: word2vec predicts nearby words, MF reconstructs observed interactions, and encoders map raw text to vectors. A useful space aligns matching pairs without collapsing everything together; I evaluate it with recall@k, downstream lift, probes, and slice checks, especially cold-start slices where ID and text embeddings differ."
- **Concepts:** skip-gram/word2vec **ƒ**, negative sampling, matrix factorization **ƒ**, encoders, alignment/uniformity **ƒ**, retrieval recall@k, downstream evaluation, probing, cold-start slices.
- **Key Idea focus:** step-by-step training/evaluation loop — define positives, sample negatives, train the scoring objective, then judge the space by the task it must support.
- **Worked-example shape:** 10 basics → 5 easy → 5 advanced: build co-occurrence pairs; compare positive vs negative scores; compute recall@k; probe whether a simple classifier can recover a label; inspect alignment/uniformity failure modes.
- **Notebook:** Yes — tiny co-occurrence or interaction matrix; train or simulate factor vectors with numpy/sklearn; `assert` positives rank above random negatives after fitting; compute recall@k by hand. Break case = popularity-only interactions create hubs with poor long-tail recall.
- **Real numbers to cite:** if 8 of 10 held-out positives appear in top-20, recall@20 = 0.80; a cold-start item has no ID vector history but can still receive a text-encoder vector.

## Coverage check
All 6 module questions map to a sub-lesson: geometry + similarity + normalization + ID/text basics → M11.1; learning methods + alignment/uniformity + evaluation + ID/text tradeoffs → M11.2. No gaps.

## Decision guide
ID embeddings vs text embeddings: use ID embeddings when repeated behavioral history is rich and entity-specific; use text embeddings for cold-start, semantic matching, or cross-domain transfer; combine them when both behavioral and content signals matter. Cosine vs dot: use cosine/normalized vectors when magnitude should not dominate; use dot product when learned norms intentionally encode confidence, popularity, or calibration.

## Resources (from the guide)
- Google — Embeddings module (MLCC) (what latent dimensions capture)
- Jay Alammar — illustrated embeddings/word2vec (visual intuition)

## SOTA papers (from the guide)
- Efficient Estimation of Word Representations / word2vec (Mikolov et al., 2013)
- E5 Text Embeddings (Wang et al., 2022)
- Sentence-BERT (Reimers & Gurevych, 2019)

## Notes / caveats
- Do not overclaim that dimensions are directly interpretable; treat geometry as evidence induced by the objective and data.
- Keep formulas limited to genuine scoring/objective/evaluation quantities; no decorative algebra for "meaning".
- Notebooks should stay CPU-first with numpy/sklearn-scale examples, no large model downloads.
