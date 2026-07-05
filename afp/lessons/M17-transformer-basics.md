# M17 · Transformer basics
> **Domain:** Domain 4 · Applied LLMs / GenAI · **Maps to:** all · **Skip if you can already…** explain self-attention and when to use an encoder vs decoder

## Overview

Transformers are the core architecture behind modern LLMs, embedding models, and many ranking systems. Their key move is simple: instead of processing a sequence one step at a time through a recurrent bottleneck, each token can directly compare itself with the other tokens and mix information from the ones that matter.

This module keeps the AFP version concise: you will compute one tiny attention head by hand, understand why position information is needed, and know when to choose an encoder, decoder, or encoder-decoder transformer.

**By the end you can answer:**
- What problem does attention solve compared with RNNs?
- How does scaled dot-product attention work with Q, K, and V?
- What is multi-head attention, and why use multiple heads?
- Why are positional encodings needed?
- When should you use an encoder, decoder, or encoder-decoder transformer?
- How do you compute a tiny attention output by hand?

Two sub-lessons:

- **M17.1 Self-attention** — Q/K/V, scaled dot-product attention, and multi-head attention.
- **M17.2 Transformer blocks and model families** — positions, masks, residual blocks, and encoder vs decoder choice.

---

## M17.1 · Self-attention

**The idea.** Attention lets a token build a new representation by taking a weighted average of other token representations. Compared with an RNN, the path between two distant tokens is direct: token 1 can attend to token 50 in one operation instead of waiting for information to survive 49 recurrent updates.

**Everyday analogy.** Imagine a dinner party where each word is a guest trying to understand its role in the conversation. The word `bank` listens more to `river` when the topic is fishing, but more to `money` when the topic is loans; those listening strengths are the attention weights. A **query** is what one guest is looking for, **keys** are everyone else's name-tags that say what they can help with, and **values** are the information the guest actually takes from the people it attends to.

For one attention head, each token has three learned projections:

- **Query (Q):** what this token is looking for.
- **Key (K):** what this token offers for matching.
- **Value (V):** the information this token contributes if attended to.

**Q/K/V, concretely on the tiny example below.** For the query token `ads`, Q/K/V play three different roles:

- **Q for `ads`** = `[1, 1]`: the current token's search request — "which tokens match both the search/ad side and the auction side?"
- **K for each token** = `search:[1,0]`, `ads:[1,1]`, `auction:[0,1]`: the match labels that `ads` compares against, giving scores `[1,2,1]`.
- **V for each token** = `search:10`, `ads:20`, `auction:30`: the actual payloads mixed after the weights are known; they produce `20.0`, not another match score.

The central computation is scaled dot-product attention:

$$\text{Attention}(Q,K,V)=\text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V.$$

Read it left to right:

1. `QKᵀ` compares every query token with every key token.
2. Dividing by $\sqrt{d_k}$ keeps scores from becoming too large when key/query vectors have many dimensions.
3. `softmax` turns scores into attention weights that sum to 1 for each query token.
4. Multiplying by `V` forms a weighted sum of value vectors.

**Why the $\sqrt{d_k}$ scaling matters.** Dot products grow in magnitude as vector dimension grows. Large logits make softmax nearly one-hot, which can make training unstable and gradients tiny for non-winning tokens. With logits `[2, 0]`, softmax is about `[0.881, 0.119]`; if $d_k=4$, scaling by $\sqrt{4}=2$ gives logits `[1, 0]`, and softmax becomes `[0.731, 0.269]` — still focused, but less saturated.

**Worked example — a tiny 3-token self-attention head.** Suppose the sequence is:

1. `search`
2. `ads`
3. `auction`

Use two-dimensional query/key vectors and one-dimensional values so the arithmetic is visible:

| token | Q | K | V |
|---|---:|---:|---:|
| search | `[1, 0]` | `[1, 0]` | `[10]` |
| ads | `[1, 1]` | `[1, 1]` | `[20]` |
| auction | `[0, 1]` | `[0, 1]` | `[30]` |

Here $d_k=2$, so the scale is $\sqrt{2}\approx1.414$.

For the query token `ads`, compute dot products against all keys:

- `ads` query · `search` key = `[1,1]·[1,0] = 1`
- `ads` query · `ads` key = `[1,1]·[1,1] = 2`
- `ads` query · `auction` key = `[1,1]·[0,1] = 1`

Scale the scores:

$$[1,2,1]/\sqrt{2}\approx[0.707,1.414,0.707].$$

Softmax those scores. Subtracting the max for stability gives `[-0.707, 0, -0.707]`, so the unnormalized weights are approximately `[0.493, 1.000, 0.493]`. Normalize:

$$[0.493,1.000,0.493]/1.986\approx[0.248,0.504,0.248].$$

Now take the weighted sum of values:

$$0.248(10)+0.504(20)+0.248(30)=2.48+10.08+7.44=20.0.$$

So the updated representation for `ads` receives about 25% from `search`, 50% from itself, and 25% from `auction`.

```python
import numpy as np
scores = np.array([1, 2, 1]) / np.sqrt(2)
w = np.exp(scores - scores.max())
w = w / w.sum()
out = w @ np.array([10, 20, 30])
assert np.allclose(w.sum(), 1.0)
assert round(out, 1) == 20.0
```

**Multi-head attention.** One head gives one similarity pattern. Multiple heads run separate Q/K/V projections in parallel, so one head might connect `ads` to `auction` mechanics while another connects it to member intent or query terms. The head outputs are concatenated and projected back into the model dimension.

In a LinkedIn ads or search setting, this is useful because relevance is not one relation: query intent, advertiser category, creator topic, member profile, and marketplace constraints can all matter at once.

**You'll be able to say:** *"Attention lets each token directly weight relevant tokens instead of passing everything through a recurrent bottleneck. A query matches keys, softmax(QKᵀ/√dₖ) gives weights, and the output is the weighted sum of values. The √dₖ scale prevents overconfident softmax scores, and multiple heads learn different relation types in parallel."*

---

## M17.2 · Transformer blocks and model families

**The idea.** Self-attention is powerful, but by itself it does not know order. If you shuffle the same token vectors, plain attention sees the same set of items. Transformers therefore add **position information** and wrap attention in a stable deep-learning block.

**Everyday analogy.** A transformer without positions is like receiving a set of loose sentence magnets on a table: you can see all the words, but not which came first. **Positional encodings** are seat numbers taped to the magnets so "member clicked ad" stays different from "ad clicked member." An **encoder** is like a reader who can inspect the whole sentence at once, while a **decoder** is like a writer who must produce the next word using only the words already written.

A standard transformer block contains:

1. attention,
2. a residual connection,
3. normalization,
4. a feed-forward network applied to each position,
5. another residual connection and normalization.

The exact ordering differs by implementation, but the purpose is the same: attention mixes information across tokens; the feed-forward network transforms each token; residual paths and LayerNorm keep deep stacks trainable.

**Positional encoding.** Tokens need a way to distinguish "member clicked ad" from "ad clicked member." Two common approaches are:

- **Learned position embeddings:** each position has a trained vector added to the token vector.
- **Sinusoidal position encodings:** deterministic sine/cosine waves at different frequencies.

**Position methods, concretely.**

- **Learned position embedding:** in a BERT-style ad-query classifier, position 1, 2, and 3 each have a learned vector, so `member clicked ad` and `ad clicked member` receive different added vectors even with the same words.
- **Sinusoidal encoding:** in the original Transformer, position 7 always gets the same sine/cosine pattern in every batch, letting the model recognize relative offsets such as "the next token" without learning a separate vector for every position.

The classic sinusoidal form includes terms like:

$$PE(pos,2i)=\sin\left(pos/10000^{2i/d}\right),\quad PE(pos,2i+1)=\cos\left(pos/10000^{2i/d}\right).$$

You do not need to memorize the formula; the useful idea is that different dimensions vary at different wavelengths, so nearby and far-apart positions have distinguishable patterns.

**Causal masking.** A decoder that generates text left-to-right must not peek at future tokens. A causal mask for a length-4 sequence looks like this, where `1` means "allowed to attend":

```text
          key position
query      1  2  3  4
pos 1      1  0  0  0
pos 2      1  1  0  0
pos 3      1  1  1  0
pos 4      1  1  1  1
```

Token 3 can attend to positions 1–3, but not position 4. This is the sequence-modeling version of leakage prevention: the model cannot use a future answer when predicting the next token.

**Worked example — choosing the right transformer family.** Suppose you are building three systems:

| Task | Pick | Why |
|---|---|---|
| Classify whether an ad query is commercial | Encoder | It can read the whole input bidirectionally. |
| Generate ad copy or a creator outreach message | Decoder | It generates one token at a time with a causal mask. |
| Translate a natural-language campaign request into a structured campaign draft | Encoder-decoder | The encoder reads the source request; the decoder generates the target sequence conditioned on it. |

**Model families, concretely.**

- **Encoder → BERT-class classifier:** use it to classify `"best crm software"` as commercial because the whole query can be read at once.
- **Decoder → GPT-class generator:** use it to generate `"Try LinkedIn Ads for B2B growth..."` one token at a time for ad-copy drafting.
- **Encoder-decoder → T5/BART-class converter:** use it to translate `"target AI founders in Canada with $500"` into a structured campaign draft, with the encoder reading the request and the decoder producing the target sequence.

For retrieval and ranking, encoders are common because you want dense representations of complete inputs. For chat and code generation, decoders are common because next-token generation is the product behavior. Encoder-decoder models are natural when the input and output are separate sequences, such as translation or summarization.

**Worked example — why positions change meaning.** Consider `"creator for AI ads"` and `"ads for AI creator"`. The token set is similar, but the product interpretation can differ. Without position information, attention can mix the same words but lacks the order signal needed to decide which term modifies which entity. With positional encodings, the model can learn that `for` connects neighboring spans differently depending on where they occur.

**You'll be able to say:** *"Self-attention alone is permutation-invariant, so transformers add position information. Encoders read the full input for classification, ranking, and embedding; decoders generate left-to-right with causal masks; encoder-decoder models read one sequence and generate another. A transformer block combines attention, an FFN, residual connections, and LayerNorm for stable deep models."*

---

## Resources
- **The Illustrated Transformer** (Jay Alammar) (the canonical visual walkthrough)
- **Karpathy — Let's build GPT** (attention coded from scratch)
- **d2l.ai — attention mechanisms** (math + code)

## Papers
- **Attention Is All You Need** (Vaswani et al., 2017)
- **BERT** (Devlin et al., 2019)
- **FlashAttention** (Dao et al., 2022)
