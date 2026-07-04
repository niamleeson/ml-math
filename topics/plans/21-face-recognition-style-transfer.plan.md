# Lesson Plan — 21 Face Recognition & Neural Style Transfer

| Field | Value |
|---|---|
| Source | CS 230 |
| Content category | Method/Model |
| Example type | 💻 Colab |
| Colab notebook | Yes |
| Est. lesson time | 55–80 min |
| Source topic file | ../21-face-recognition-style-transfer.md |

## Part 1 — Overview (plan)
Cover two deep-vision methods that reuse learned representations: face systems compare embeddings, while style transfer optimizes an image to match content and style statistics. Hook: "one network can turn images into identity distances or into content/style losses."

## Part 2 — Key Idea (plan)
- **Focus (per category = Method/Model):** step-by-step method for face verification/recognition with Siamese embeddings and triplet loss, then neural style transfer with content and Gram-matrix style losses.
- **Core artifacts to present:** verification vs recognition; one-shot learning; encoder embedding $f(x)$; distance $d(\text{image 1},\text{image 2})$; triplet loss $\ell(A,P,N)=\max(d(A,P)-d(A,N)+\alpha,0)$; threshold choice for verification; content activations $a^{[l]}$; content cost $J_{\text{content}}(C,G)=\frac12\lVert a^{[l](C)}-a^{[l](G)}\rVert^2$; style Gram matrix $G_{kk'}^{[l]}=\sum_i\sum_j a_{ijk}^{[l]}a_{ijk'}^{[l]}$; style cost $J_{\text{style}}^{[l]}$; overall cost $J(G)=\alpha J_{\text{content}}+\beta J_{\text{style}}$.

## Part 3 — Worked Examples

### 🟢 Basics (3)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| B1 | Cosine similarity between two face embeddings | two toy 3-D embedding vectors | printed values plus tiny angle sketch | ~2 |
| B2 | L2 distance threshold decision for one face pair | one toy embedding pair and a fixed threshold | printed distance, threshold, and accept/reject label | ~2 |
| B3 | Gram matrix of a 2×2 two-channel activation map | toy activation tensor | printed channel-correlation matrix heatmap | ~3 |

### 🟡 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | Compute embedding distances for verification | small face/image-pair set: same person vs different person | result: pair images with embedding vectors and distance bars | ~6 |
| E2 | Choose a verification threshold | same pair set with labels | process: distance histogram by match/non-match; result: threshold line with accuracy | ~6 |
| E3 | Triplet loss on toy embeddings | generated 2D anchor/positive/negative embeddings | process: margin circle; result: loss is zero vs positive examples | ~5 |
| E4 | Build a mini face-recognition lookup | small gallery of 5 identities plus one query image | result: nearest-neighbor table and highlighted predicted identity | ~6 |
| E5 | Neural style transfer first run | content image: campus/building; style image: mosaic/painting | process: optimization snapshots; result: content+style→generated triptych | ~8 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | Hard negative face-verification failure case | face pairs with look-alikes, occlusion, or lighting shift | process: distance histogram overlap; result: false accept/false reject examples | ~8 |
| A2 | Triplet mining intuition | labeled face/image embeddings with easy, semi-hard, and hard negatives | process: embedding scatter; result: selected triplets and loss values | ~7 |
| A3 | Recognition as one-to-many search | gallery with multiple photos per identity and one distractor identity | process: query-to-gallery distance matrix; result: top-k retrieval grid | ~8 |
| A4 | Style/content loss decomposition | content: portrait; style: watercolor texture | process: content loss, style loss, total loss curves; result: generated image snapshots | ~10 |
| A5 | Style-transfer tradeoff and edge case | content: city skyline; styles: Van Gogh-like swirls and high-frequency noise texture | process: vary $\alpha/\beta$; result: triptychs showing content preservation vs style dominance and noisy-style artifacts | ~10 |

## Part 4 — Colab Notebook
- **Notebook file:** notebooks/21-face-recognition-style-transfer.ipynb
- **Est. cell count:** ~98 (💻 topic → all 13 examples (3 basics + 5 easy + 5 advanced) coded; two mini-pipelines)
- **Key libraries:** numpy, matplotlib, PIL, scikit-learn metrics, torch/torchvision, pretrained face/image encoder or lightweight embedding model, ipywidgets.
- **Runtime:** GPU recommended for neural style transfer optimization; CPU acceptable for toy embedding computations but slower for NST.
- **Failure/edge dataset included:** look-alike/occluded face pairs in A1 and high-frequency noise style in A5 — demonstrate threshold ambiguity and style artifacts.
- **Signature visualizations:** embedding-distance histograms with threshold; triplet margin scatterplots; query-to-gallery distance matrix; content/style/generated triptych with optimization snapshots.
