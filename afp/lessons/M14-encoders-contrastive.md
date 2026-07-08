# M14 · Encoders & contrastive training
> **Domain:** Domain 2 · Recommenders, Embeddings & Retrieval · **Maps to:** Creator Marketplace AI · **Skip if you can already…** fine-tune a text encoder with a contrastive objective + hard negatives.

## Overview

Encoders turn raw text, profiles, posts, ads, and briefs into vectors. Contrastive training tells the encoder which pairs should be close and which should separate. This is the bridge between language understanding and retrieval: a model must embed "B2B cybersecurity podcast hosts" near the right creator profiles, not merely produce fluent text representations.

This module focuses on the architecture choice, the contrastive objective, and hard negatives. The core risk is teaching the wrong separation: easy negatives can be too weak, but false hard negatives can damage the representation.

**By the end you can answer:**
- Dual-encoder vs cross-encoder: which is for retrieval, which is for reranking, and why?
- What are sentence encoders such as E5, SBERT, and IRPS-style encoders used for?
- How do InfoNCE / contrastive loss and temperature work?
- Triplet loss vs in-batch contrastive loss vs hard-negative mining: how do they differ?
- How do you fine-tune an encoder for a retrieval task?
- Why and how do hard negatives raise the gradient?

Two sub-lessons:

- **M14.1 Dual vs cross-encoder & the contrastive objective** — retrieve vs rerank and InfoNCE.
- **M14.2 Hard-negative mining & encoder fine-tuning** — triplets, mining, filtering, and validation.

<p class="cur-colab"><a class="cur-colab-btn" href="https://colab.research.google.com/github/niamleeson/ml-math/blob/main/afp/notebooks/M14-encoders-contrastive.ipynb" target="_blank" rel="noopener">▶ Open the runnable encoders notebook (dual vs cross, InfoNCE + temperature, hard-negative mining) in Google Colab</a></p>

---

## M14.1 · Dual vs cross-encoder & the contrastive objective

**The idea.** A dual encoder, also called a bi-encoder, embeds the query and item separately. It is the right shape for first-stage retrieval because item vectors can be precomputed and indexed. A cross-encoder reads the query and item together, allowing token-level interaction, but it must run once per pair. That makes it strong for reranking hundreds of candidates and too expensive for retrieving from millions.

**Everyday analogy.** A dual encoder is like asking two people to fill out separate index cards — one for the request and one for the creator — then matching cards quickly by comparing their summaries. A cross-encoder is like putting the two people in the same room and reading the full conversation; it understands the pair better but must repeat that work for every pair. Contrastive training is the drill that pulls matching cards together and pushes mismatched cards apart.

For Creator Marketplace AI:

- dual encoder: embed advertiser brief and creator profile separately, retrieve top candidates;
- cross-encoder: read the brief and one creator profile jointly, rerank the retrieved set.

**Dual vs cross-encoder, concretely.** Same request: "B2B cybersecurity podcast hosts" over 1M creator profiles.

| Encoder | Concrete serving use | Latency / accuracy contrast |
|---|---|---|
| **Dual encoder** | Embed the brief once and ANN-search precomputed creator vectors | ~15 ms to retrieve 500 candidates; recall@500 may be 0.93 because pairwise token interactions are approximated |
| **Cross-encoder** | Read the brief together with one candidate profile and output a pair score | ~8 ms per pair; reranking 500 candidates costs ~4 s if run serially, but pair accuracy is higher because the model can compare exact phrases like "podcast host" and "cybersecurity" |

Sentence encoders such as SBERT, E5, and IRPS-style encoders produce reusable text vectors. They usually combine a transformer backbone with pooling or a special token representation, optional normalization, and retrieval-specific fine-tuning.

**Contrastive setup.** A training batch contains positive pairs $(q_i, d_i^+)$. The encoder scores every query against candidate documents or creators. With in-batch negatives, the other positives in the batch are treated as negatives for query $q_i$.

InfoNCE / contrastive softmax loss for row $i$ is:

$$\mathcal{L}_i=-\log\frac{\exp(s(q_i,d_i^+)/\tau)}{\sum_j \exp(s(q_i,d_j)/\tau)}.$$

Here $s(q,d)$ is a dot product or cosine score, and $\tau$ is temperature. Lower temperature sharpens score differences. It makes high-scoring negatives more influential, which can improve discrimination when labels are clean and destabilize training when false negatives are common.

**Temperature intuition.** With scores `[2.0, 1.0, 0.0]`, positive at index 0:

- at $\tau=1.0$, probabilities are soft: the positive wins but negatives still have mass;
- at $\tau=0.1$, score gaps are magnified: the positive probability becomes almost 1 if it is ahead;
- if a hard negative is close to the positive, low temperature gives that hard negative a large gradient.

**Worked example — one InfoNCE row.** A brief "enterprise AI security webinar creators" has three candidate profile scores:

- positive creator: 2.0;
- similar but wrong creator: 1.0;
- unrelated creator: 0.0.

At $\tau=1.0$:

$$p^+=\frac{e^{2.0}}{e^{2.0}+e^{1.0}+e^{0.0}}\approx 0.665,$$

so the loss is $-\log(0.665)\approx 0.41$.

At $\tau=0.5$:

$$p^+=\frac{e^{4.0}}{e^{4.0}+e^{2.0}+e^{0.0}}\approx 0.867,$$

so the loss is lower because the positive was already ahead. If the hard negative score rises to 1.9, low temperature makes it compete strongly, keeping the loss high.

```python
import numpy as np

def infonce(scores, pos=0, tau=1.0):
    z = scores / tau
    z = z - z.max()
    p = np.exp(z) / np.exp(z).sum()
    return -np.log(p[pos]), p

scores = np.array([2.0, 1.0, 0.0])
loss1, p1 = infonce(scores, tau=1.0)
loss05, p05 = infonce(scores, tau=0.5)
assert loss05 < loss1
```

**Collapsed embedding break case.** If every profile and query receives nearly the same vector, then all scores in a row are similar. The softmax cannot reliably put positives above negatives, recall is poor, and nearest-neighbor results become popularity or noise. Contrastive learning needs both positive alignment and enough spread to separate unrelated items.

**You'll be able to say:** *"A dual encoder embeds query and item separately so vectors can be precomputed for retrieval; a cross-encoder reads the pair jointly and is usually too expensive for first-stage search but strong for reranking. Sentence encoders like SBERT/E5 produce reusable text vectors. InfoNCE makes the positive pair win a softmax against negatives, and temperature controls how sharply score differences affect the loss."*

---

## M14.2 · Hard-negative mining & encoder fine-tuning

**The idea.** Easy negatives teach broad separation. Hard negatives teach fine distinctions. A creator profile about "consumer fitness" is an easy negative for a B2B cybersecurity brief; a profile about "enterprise security webinars" that lacks the required audience or region is a hard negative. The hard negative is wrong, but plausible.

**Everyday analogy.** Organizing a photo library by who appears in each photo is easy when the wrong examples are landscapes. The real learning happens with look-alikes: siblings, coworkers in similar uniforms, or blurry shots. Hard negatives are those tricky look-alikes — they force the encoder to notice the details that separate a true match from a plausible mismatch, while false negatives are photos of the same person mislabeled as different.

**Triplet loss.** A triplet has anchor query $q$, positive item $p$, and negative item $n$. With similarity scores, a margin loss is:

$$\mathcal{L}=\max(0, m + s(q,n) - s(q,p)).$$

The loss is zero only when the positive beats the negative by at least margin $m$.

If $s(q,p)=3.0$, $s(q,n)=2.8$, and $m=0.5$:

$$\mathcal{L}=\max(0,0.5+2.8-3.0)=0.3.$$

The model still has work to do. If the negative score were 0.2, the loss would be zero and the example would teach little.

**In-batch contrastive vs triplet.** Triplet loss teaches one positive-negative comparison at a time. In-batch contrastive loss uses many negatives per query and gives the highest-scoring negatives the most pressure through the softmax denominator. It is often more sample-efficient, but it assumes other batch positives are valid negatives for this query.

**Loss choices, concretely.** For query $q$ = "Spanish-speaking fintech creators" and positive $p$:

- **InfoNCE / contrastive softmax:** scores `[3.0, 2.8, 0.2]` for `[positive, hard negative, easy negative]` give $p^+\approx0.53$, so the close hard negative keeps the loss high.
- **Triplet loss:** with $s(q,p)=3.0$, $s(q,n)=2.8$, and margin $m=0.5$, loss is $\max(0,0.5+2.8-3.0)=0.3$.
- **In-batch contrastive:** in a batch of 128 positive pairs, each query gets 127 other positives as negatives; if one other creator is an accepted alternate for the same brief, that row is a false-negative risk.

**Why hard negatives raise the gradient.** In InfoNCE, a negative with high score contributes a large term $\exp(s(q,n)/\tau)$ to the denominator. That lowers the positive probability and increases loss. The model receives pressure to reduce that negative's score or increase the positive's score. Easy negatives have tiny exponentiated scores and contribute little.

**Fine-tuning loop.** A practical encoder fine-tuning workflow:

1. Collect positives from accepted collaborations, clicked results, saves, applications, or expert judgments.
2. Build initial easy negatives with random or category-mismatched samples.
3. Train a baseline dual encoder with InfoNCE or triplet loss.
4. Mine hard negatives using BM25, the current model, another retrieval model, or a cross-encoder.
5. Filter likely false negatives using labels, business rules, dedupe, and human or model checks.
6. Continue training with a mix of easy and hard negatives.
7. Validate recall@k, slice recall, and qualitative neighbors.
8. Refresh mined negatives as the model improves.

**Hard-negative mining methods, concretely.** Each miner finds a different kind of plausible wrong item:

- **BM25 miner:** for "Spanish fintech SMB creators," returns a creator who says "Spanish fintech" often but targets retail consumers, not SMB owners.
- **Current-model miner:** the dual encoder retrieves a high-score creator with fintech posts but English-only content; close in vector space, wrong on language.
- **Other retrieval model miner:** a graph-based audience-similarity model returns a finance creator whose audience overlaps but whose content is about personal budgeting.
- **Cross-encoder miner:** the cross-encoder scores a candidate 0.82 because the text matches, but a business rule says the creator is outside the allowed region.
- **Human/model filter:** reviewers or a stronger model remove an accepted alternate creator so it does not become a false negative.

**Worked example — mining for Creator Marketplace AI.** Query: "Spanish-speaking fintech creators for small business owners." Positive: a creator with fintech content, Spanish posts, and SMB audience. Candidate negatives:

| Negative | Type | Use? | Reason |
|---|---|---|---|
| random cooking creator | easy | yes early | teaches broad topical separation |
| English fintech analyst | hard | yes | same topic, wrong language/audience |
| Spanish personal finance creator for consumers | hard | yes | close topic, wrong business segment |
| accepted alternate fintech creator | false negative | no | would teach against a valid match |
| creator blocked by policy | filtered | maybe for eligibility model, not semantic fit | confounds retrieval semantics |

A good batch mixes easy negatives for stability and hard negatives for discrimination. A bad batch treats all unclicked or unselected plausible creators as negatives, even though many were never shown or could have been valid choices.

**Worked example — hard negative in the softmax.** Positive score is 3.0. Easy negative is 0.2. Hard negative is 2.8. At $\tau=1$:

$$p^+=\frac{e^3}{e^3+e^{0.2}+e^{2.8}}\approx 0.53.$$

The hard negative receives almost as much probability mass as the positive. If the hard negative were removed, the positive probability would be about 0.94. That difference is the training signal.

```python
import numpy as np

def softmax(x):
    x = x - x.max()
    return np.exp(x) / np.exp(x).sum()

with_hard = softmax(np.array([3.0, 0.2, 2.8]))
without_hard = softmax(np.array([3.0, 0.2]))
print(round(with_hard[0], 2), round(without_hard[0], 2))  # 0.53 0.94
```

**Validation checklist:**

- Compare random-negative and hard-negative models on the same recall@k set.
- Track false-negative-sensitive slices where multiple candidates can be correct.
- Check whether hard-negative mining overfits to lexical overlap and hurts semantic matches.
- Evaluate cold-start creators separately from established creators.
- Use a reranker or human labels to audit mined negatives.
- Stop mining from the same stale model if negatives are no longer hard.

**Decision guide.** Use a dual encoder for first-stage retrieval and precomputed vectors. Use a cross-encoder for reranking candidates when pairwise interaction matters. Start with easy or in-batch negatives for stability, add hard negatives after the model has a reasonable baseline, and filter aggressively when false negatives are likely. Use triplet loss when explicit anchor-positive-negative teaching is natural; use contrastive softmax when large batches and many negatives are available.

**You'll be able to say:** *"Triplet loss enforces a margin between a positive and one negative; in-batch contrastive loss uses the other batch items as many negatives; hard-negative mining adds wrong but plausible items so the model learns fine distinctions. A hard negative raises loss and gradient because its score competes with the positive in the softmax, but false negatives can damage the encoder, so mining needs filtering and slice validation."*

---

## Resources
- Sentence-Transformers docs (bi-/cross-encoders and training losses)
- Lil'Log — Contrastive Representation Learning (InfoNCE, triplet, in-batch negatives)

## Papers
- Sentence-BERT (Reimers & Gurevych, 2019)
- SimCSE (Gao et al., 2021)
- E5 (Wang et al., 2022)
- CPC / InfoNCE (van den Oord et al., 2018)
- SimCLR (Chen et al., 2020)
- MoCo (He et al., 2020)
