# Module Plan — M17 · Transformer basics

| Field | Value |
|---|---|
| Domain | Domain 4 · Applied LLMs / GenAI |
| Skip if you can already… | explain self-attention and when to use an encoder vs decoder |
| Maps to (projects) | all |
| Primary structure(s) | S1 Model |
| Example type | ⚑ Both |
| Sub-lessons | 2 |
| Notebooks | 1 |

## Module hub (the "complete list")
Transformers replace recurrence with attention: each token can directly look at the tokens that matter. This module makes the attention computation concrete, then shows how the same block is arranged into encoders, decoders, and encoder-decoder systems.

- M17.1 · Self-attention: Q/K/V, scaled dot-product, multi-head
- M17.2 · The transformer block & encoder vs decoder

## Questions this module answers (→ which sub-lesson teaches the answer)
- What problem does attention solve compared with RNNs? → M17.1
- How does scaled dot-product attention work with Q, K, and V? → M17.1
- What is multi-head attention, and why use multiple heads? → M17.1
- Why are positional encodings needed? → M17.2
- When should you use an encoder, decoder, or encoder-decoder transformer? → M17.2
- How do you compute a tiny attention output by hand? → M17.1

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- Attention motivation: direct token-token interactions instead of a long recurrent bottleneck
- Queries, keys, values (Q/K/V)
- Scaled dot-product attention `softmax(QKᵀ/√d_k)V` **ƒ**
- Multi-head attention: parallel attention projections, concatenate, output projection **ƒ**
- Positional encodings / position embeddings **ƒ**
- Encoder vs decoder vs encoder-decoder
- Transformer block structure: attention, feed-forward network, residual connections, LayerNorm

## Sub-lessons

### M17.1 · Self-attention: Q/K/V, scaled dot-product, multi-head  —  [S1 Model, ⚑]
- **Makes answerable:** attention vs RNNs; scaled dot-product attention with Q/K/V; multi-head attention and why multiple heads; tiny attention output by hand.
- **You'll be able to say:** "Attention lets each token directly weight all relevant tokens, avoiding the single hidden-state bottleneck and long sequential path of an RNN. For one head, Q asks, K is matched against the query, softmax(QKᵀ/√d_k) gives weights, and the output is the weighted average of V; multiple heads learn several relation types in parallel."
- **Concepts:** attention motivation, Q/K/V, scaled dot-product attention **ƒ**, multi-head attention **ƒ**.
- **Key Idea focus:** formulation + when to use — self-attention as content-based mixing over a sequence, especially when long-range interactions matter.
- **Worked-example shape:** 10 basics → 5 easy → 5 advanced: identify query/key/value roles; compute 2-token and 3-token attention; compare one head vs two heads that attend to different relations.
- **Notebook:** Yes — compute one-head attention by hand in NumPy using small Q, K, V matrices; `assert` attention rows sum to 1 and the NumPy output matches a hand-calculated row. Break case = omit √d scaling and show the softmax becomes overconfident for larger d.
- **Real numbers to cite:** with logits `[2, 0]`, softmax ≈ `[0.881, 0.119]`; scaling logits by `√4=2` gives `[1, 0]` and softmax ≈ `[0.731, 0.269]`, a less saturated attention distribution.

### M17.2 · The transformer block & encoder vs decoder  —  [S1 Model, ⚑]
- **Makes answerable:** positional encodings and why needed; encoder vs decoder vs encoder-decoder; block structure with FFN, residual, and LayerNorm.
- **You'll be able to say:** "Self-attention alone is permutation-invariant, so tokens need position information. Encoders read the whole input for understanding tasks, decoders generate left-to-right with causal masking, and encoder-decoder models condition a generator on an encoded input. A block stacks attention with an FFN, residual paths, and LayerNorm for stable deep learning."
- **Concepts:** positional encodings / embeddings **ƒ**, encoder, decoder, encoder-decoder, FFN, residual, LayerNorm, causal mask.
- **Key Idea focus:** model anatomy + when to use each transformer family.
- **Worked-example shape:** 10 basics → 5 easy → 5 advanced: label block parts; decide encoder vs decoder vs encoder-decoder for classification, generation, translation, and retrieval; trace why a causal mask prevents future-token leakage.
- **Notebook:** No — keep the math visual/pen-paper here; the module notebook lives in M17.1 and avoids downloading weights.
- **Real numbers to cite:** a length-4 causal mask allows token 3 to attend to positions 1–3 but not 4; sinusoidal encodings use different wavelengths so adjacent and far positions have distinguishable vectors.

## Coverage check
All 6 module questions are covered: attention motivation, Q/K/V, multi-head, and by-hand computation → M17.1; positional encodings, block anatomy, and encoder/decoder choice → M17.2. No gaps.

## Decision guide
| Need | Pick | Why |
|---|---|---|
| Classify, rank, or embed an input using full bidirectional context | Encoder | Every token can attend to every input token. |
| Generate text/code left-to-right | Decoder | Causal mask matches next-token generation. |
| Transform one input sequence into another output sequence | Encoder-decoder | Encoder reads the source; decoder generates conditioned on it. |

## Resources (from the guide)
- The Illustrated Transformer (Jay Alammar) (the canonical visual walkthrough)
- Karpathy — Let's build GPT (attention coded from scratch)
- d2l.ai — attention mechanisms (math + code)

## SOTA papers (from the guide)
- Attention Is All You Need (Vaswani et al., 2017)
- BERT (Devlin et al., 2019)
- FlashAttention (Dao et al., 2022)

## Notes / caveats
- This module has genuine math: keep the attention formula, scaling, and positional encoding discussion. Do not expand into training large transformers or downloading pretrained weights.
- Overlaps the concurrent `topics/` LLM/attention material; reference rather than duplicate long derivations.
