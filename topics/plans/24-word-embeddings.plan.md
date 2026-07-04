# Lesson Plan — 24 Word Embeddings: word2vec & GloVe

| Field | Value |
|---|---|
| Source | CS 230 |
| Content category | Method |
| Example type | 💻 Colab |
| Colab notebook | Yes |
| Est. lesson time | 45–60 min |
| Source topic file | ../24-word-embeddings.md |

## Part 1 — Overview (plan)
Word embeddings replace isolated one-hot vectors with dense vectors whose geometry captures similarity and
relationships. Hook: "king − man + woman ≈ queen" as evidence that vector space can encode meaning.

## Part 2 — Key Idea (plan)
- **Focus (per category = Method):** step-by-step embedding workflow: tokenize text, build vocabulary/context
  pairs, train a proxy objective (skip-gram/CBOW/negative sampling or GloVe co-occurrence), then compare words
  by cosine similarity and visualize neighborhoods.
- **Core artifacts to present:** one-hot vs embedding diagram; embedding lookup $e_w=Eo_w$; skip-gram softmax
  $P(t\mid c)=\exp(\theta_t^Te_c)/\sum_j\exp(\theta_j^Te_c)$; negative-sampling classifier
  $P(y=1\mid c,t)=\sigma(\theta_t^Te_c)$; GloVe cost with co-occurrence matrix
  $J=\frac12\sum_{ij}f(X_{ij})(\theta_i^Te_j+b_i+b'_j-\log X_{ij})^2$; final embedding
  $(e_w+\theta_w)/2$; cosine similarity; t-SNE map.

## Part 3 — Worked Examples

### 🟢 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | One-hot vs dense embeddings | tiny hand-written animal/royalty corpus | process: vocabulary and one-hot matrix; result: 2-D toy embedding arrows | ~4 |
| E2 | Build skip-gram context pairs | toy sentences | process: sliding context window diagram; result: center/context pair table | ~4 |
| E3 | Train tiny skip-gram with negative sampling | toy corpus | process: training loss curve; result: nearest-neighbor table by cosine similarity | ~6 |
| E4 | CBOW predicts a missing word | short news/movie snippets | process: context-word averaging; result: top-k predicted target probabilities | ~5 |
| E5 | Cosine similarity neighborhoods | small pretrained GloVe sample / gensim mini vectors | process: angle diagram; result: nearest neighbors for `cat`, `computer`, `king` | ~4 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | Build a GloVe co-occurrence matrix | small Wikipedia/text8 excerpt | process: weighted co-occurrence heatmap; result: learned vector neighborhoods | ~7 |
| A2 | t-SNE map of semantic clusters | pretrained GloVe / word2vec vectors | process: perplexity sweep; result: labeled 2-D t-SNE map of animals, countries, occupations | ~7 |
| A3 | Analogy arithmetic | pretrained GloVe / word2vec vectors | process: vector arrows for `king − man + woman`; result: top analogy answers + arrow plot | ~6 |
| A4 | Failure case — OOV and polysemy | mixed domain sentences with rare words and `bank` | process: missing-token report + ambiguous-neighbor table; result: failure annotation on t-SNE map | ~6 |
| A5 | Bias and dataset effects in embeddings | pretrained embeddings + profession/gender word lists | process: projection on gender direction; result: bias bar chart + nearest-neighbor comparison | ~7 |

## Part 4 — Colab Notebook
- **Notebook file:** topics/notebooks/24-word-embeddings.ipynb
- **Est. cell count:** ~74 (💻 topic → all 10 examples coded with training, lookup, and visualization loops)
- **Key libraries:** numpy, pandas, matplotlib, scikit-learn (`TSNE`), gensim, nltk or keras text utilities, seaborn
- **Runtime:** CPU
- **Failure/edge dataset included:** rare/OOV and polysemous-word set in A4 — shows that embeddings cannot represent unseen words and single-vector embeddings blur meanings like river `bank` vs financial `bank`.
- **Signature visualizations:** training-loss curve; 2-D t-SNE map with labels; nearest-neighbor tables and `king − man + woman` analogy arrows.
