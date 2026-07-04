# Lesson Plan — 25 Language Models, Machine Translation & Attention

| Field | Value |
|---|---|
| Source | CS 230 |
| Content category | Model/Method |
| Example type | 💻 Colab |
| Colab notebook | Yes |
| Est. lesson time | 55–70 min |
| Source topic file | ../25-language-models-translation-attention.md |

## Part 1 — Overview (plan)
Language models score likely word sequences, translation models condition generation on a source sentence, and
attention lets the decoder focus on the right source positions. Hook: "translation is search over sentences, not
just word-by-word lookup."

## Part 2 — Key Idea (plan)
- **Focus (per category = Model/Method):** formulation + step-by-step algorithms: estimate sentence probability,
  decode with greedy/beam search, evaluate with perplexity/BLEU, and compute attention-weighted context vectors.
- **Core artifacts to present:** sentence probability $P(y)$; n-gram counts; perplexity formula; translation
  objective $y=\arg\max P(y^{<1>},...,y^{<T_y>}\mid x)$; beam-search pseudocode with beam width $B$;
  normalized log-likelihood objective $\frac{1}{T_y^\alpha}\sum_t\log p(y^{<t>}\mid x,y^{<1:t-1>})$;
  beam-search error-analysis table; BLEU clipped n-gram precision and brevity penalty intuition; attention
  context $c^{<t>}=\sum_{t'}\alpha^{<t,t'>}a^{<t'>}$ and softmax weights $\alpha^{<t,t'>}$.

## Part 3 — Worked Examples

### 🟢 Basics (10)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| B1 | Softmax three attention scores | toy attention scores $e=[1,2,0]$ | printed values + 3-bar probability chart | ~2 |
| B2 | One attention context weighted sum | three toy encoder activations and fixed attention weights | printed values + weighted-vector bars | ~3 |
| B3 | Perplexity from three token probabilities | toy next-token probabilities | printed values + probability product trace | ~3 |
| B4 | Scale one attention score by square-root dimension | one toy query-key pair with $d_k=4$ | printed raw vs scaled score | ~2 |
| B5 | Attention weights over three keys | one query and three toy keys | printed values + 3-bar attention chart | ~2 |
| B6 | Greedy next-token argmax | toy next-token probabilities | printed choice + probability bar chart | ~2 |
| B7 | Bigram probability from counts | tiny bigram count table | printed numerator/denominator trace | ~2 |
| B8 | Cross-entropy of one correct token | one correct-token probability | printed probability and negative log value | ~2 |
| B9 | Temperature-scaled softmax | three toy logits and two temperatures | printed values + grouped probability bars | ~3 |
| B10 | Length-normalized log score | three token log probabilities | printed raw vs normalized beam score | ~2 |

### 🟡 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | Count an n-gram language model | tiny nursery-rhyme corpus | process: unigram/bigram count tables; result: next-word probability bar chart | ~5 |
| E2 | Compute perplexity on held-out text | train/test split of tiny corpus | process: token probability trace; result: perplexity comparison for good vs bad sentence | ~4 |
| E3 | Greedy decoding vs beam width 1 | toy translation probability table | process: decoding tree; result: selected sequence path and score | ~4 |
| E4 | Beam search with $B=3$ | toy English→French phrase probabilities | process: beam expansion table per timestep; result: top candidate translations with scores | ~6 |
| E5 | BLEU by clipped n-grams | short candidate/reference translations | process: unigram/bigram match highlights; result: BLEU components + final score | ~5 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | Character language model | tiny Shakespeare / names corpus | process: training loss + sampled text per epoch; result: generated text at multiple temperatures | ~8 |
| A2 | Encoder-decoder translation mini-model | small English→French phrase pairs | process: source/target token flow; result: predicted translations + token accuracy | ~9 |
| A3 | Beam width and length normalization | same translation model | process: beam tree with normalized vs unnormalized scores; result: quality/speed/length tradeoff plot | ~7 |
| A4 | Attention heatmap for translation | small date-format or English→French dataset | process: decoder step attention weights; result: source-target alignment heatmap | ~9 |
| A5 | Failure case — greedy/beam/attention error analysis | ambiguous or long source sentences | process: compare $P(y^*\mid x)$ vs $P(\hat y\mid x)$ and attention spread; result: root-cause table (beam faulty vs model faulty) | ~8 |

## Part 4 — Colab Notebook
- **Notebook file:** topics/notebooks/25-language-models-translation-attention.ipynb
- **Est. cell count:** ~100 (💻 topic → all 13 examples (3 basics + 5 easy + 5 advanced) coded; sequence models and attention need granular decoding visualizations)
- **Key libraries:** numpy, pandas, matplotlib, tensorflow/keras or torch, scikit-learn, sacrebleu or nltk BLEU, seaborn, ipywidgets
- **Runtime:** GPU recommended for encoder-decoder/attention examples; toy CPU fallbacks should be included.
- **Failure/edge dataset included:** ambiguous/long translation examples in A5 — show greedy search errors, beam length bias, and diffuse attention on long sequences.
- **Signature visualizations:** beam-search expansion tree; BLEU n-gram match highlights; attention-weight heatmap over source and target tokens.
